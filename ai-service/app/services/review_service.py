"""Business logic for review sentiment analysis."""

from collections import Counter

from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

from ..models.enums import SentimentType
from ..models.reviews import ReviewAnalysisRequest, ReviewAnalysisResponse
from .model_loader import ml_resources


def analyze_review(payload: ReviewAnalysisRequest) -> ReviewAnalysisResponse:
    """Analyze review sentiment with nonsense filtering and dynamic confidence."""

    text_lower = payload.review_text.lower()
    tokens = word_tokenize(text_lower)

    # Nonsense check: if < 50% of words are real English, flag it
    meaningful_words = [w for w in tokens if w.isalpha() and len(w) > 2]

    if not meaningful_words:
        valid_word_ratio = 0
    else:
        valid_count = sum(1 for w in meaningful_words if w in ml_resources['english_vocab'])
        valid_word_ratio = valid_count / len(meaningful_words)

    if len(meaningful_words) > 0 and valid_word_ratio < 0.4:
        return ReviewAnalysisResponse(
            review_id=payload.review_id,
            sentiment_score=0.0,
            sentiment_type=SentimentType.NEUTRAL,
            keywords=[],
            is_approved=False,
            confidence=0.1,
            analysis_notes="Flagged as potential gibberish/nonsense text."
        )

    # VADER sentiment analysis
    scores = ml_resources['sia'].polarity_scores(payload.review_text)
    compound_score = scores['compound']

    if compound_score >= 0.05:
        sentiment_type = SentimentType.POSITIVE
    elif compound_score <= -0.05:
        sentiment_type = SentimentType.NEGATIVE
    else:
        sentiment_type = SentimentType.NEUTRAL

    # Dynamic confidence
    confidence = 0.5 + (abs(compound_score) * 0.4)

    # Boost if star rating matches sentiment
    star_consistent = (
        (payload.star_rating >= 4 and sentiment_type == SentimentType.POSITIVE) or
        (payload.star_rating <= 2 and sentiment_type == SentimentType.NEGATIVE)
    )
    if star_consistent:
        confidence = min(0.99, confidence + 0.1)

    # Keyword extraction
    stop_words = set(stopwords.words('english'))
    filtered_words = [w for w in meaningful_words if w not in stop_words]
    keywords = [word for word, _ in Counter(filtered_words).most_common(5)]

    # Approval logic
    is_approved = (
        confidence > 0.6
        and not (sentiment_type == SentimentType.NEGATIVE and payload.star_rating >= 4)
    )

    return ReviewAnalysisResponse(
        review_id=payload.review_id,
        sentiment_score=round(compound_score, 3),
        sentiment_type=sentiment_type,
        keywords=keywords,
        is_approved=is_approved,
        confidence=round(confidence, 2),
        analysis_notes=f"Valid English Ratio: {int(valid_word_ratio * 100)}%"
    )
