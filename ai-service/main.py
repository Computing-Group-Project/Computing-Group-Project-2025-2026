"""
Demeter AI Service - Python FastAPI
Temporary AI service for recommendations, discounts, and review analysis
"""

from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import uvicorn
from enum import Enum
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from collections import Counter
from nltk.corpus import words as nltk_words

# Initialize FastAPI
app = FastAPI(
    title="Demeter AI Service",
    description="AI-powered recommendations, discounts, and review analysis",
    version="1.0.0"
)

# This ensures the AI (lexicons) is downloaded when the app starts
try:
    nltk.data.find('sentiment/vader_lexicon.zip')
    nltk.data.find('tokenizers/punkt')
    nltk.data.find('corpora/stopwords')
    nltk.data.find('corpora/words')
except LookupError:
    print("Downloading NLTK resources...")
    nltk.download('vader_lexicon')
    nltk.download('punkt')
    nltk.download('stopwords')
    nltk.download('punkt_tab')
    nltk.download('words')

# Load the dictionary once (Standard English words)
english_vocab = set(w.lower() for w in nltk_words.words())
# Initialize the VADER analyzer once 
sia = SentimentIntensityAnalyzer()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Key configuration (in production, use environment variables)
API_KEY = "demeter-ai-service-key-2024"

# Security dependency
async def verify_api_key(x_api_key: str = Header(...)):
    if x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API Key")
    return x_api_key


# ==================== ENUMS ====================
class RecommendationType(str, Enum):
    PERSONALIZED = "PERSONALIZED"
    CONTEXTUAL = "CONTEXTUAL"
    COMPLEMENTARY = "COMPLEMENTARY"
    POPULAR = "POPULAR"


class DiscountType(str, Enum):
    PERCENTAGE = "PERCENTAGE"
    FIXED_AMOUNT = "FIXED_AMOUNT"
    BUY_X_GET_Y = "BUY_X_GET_Y"
    COMBO = "COMBO"


class SentimentType(str, Enum):
    POSITIVE = "POSITIVE"
    NEUTRAL = "NEUTRAL"
    NEGATIVE = "NEGATIVE"


# ==================== REQUEST MODELS ====================
class PurchaseHistoryItem(BaseModel):
    item_id: int
    item_name: str
    category_id: int
    purchase_count: int
    last_purchased: datetime
    total_spent: float


class RecommendationRequest(BaseModel):
    user_id: int
    purchase_history: List[PurchaseHistoryItem]
    current_time: datetime
    dietary_preferences: Optional[List[str]] = None
    cafeteria_id: int
    context: str = Field(default="homepage", description="homepage, cart, or checkout")
    limit: int = Field(default=3, ge=1, le=10)


class SalesDataItem(BaseModel):
    item_id: int
    item_name: str
    category_id: int
    base_price: float
    total_sales: int
    revenue: float
    last_30_days_sales: int
    average_rating: Optional[float] = None


class DiscountRequest(BaseModel):
    cafeteria_id: int
    sales_data: List[SalesDataItem]
    current_discounts: List[int]  # List of item_ids currently on discount
    target_profit_margin: float = Field(default=0.3, ge=0.1, le=0.5)
    max_discount_percentage: float = Field(default=30.0, ge=5.0, le=50.0)


class ReviewAnalysisRequest(BaseModel):
    review_id: int
    review_text: str
    star_rating: int = Field(ge=1, le=5)


# ==================== RESPONSE MODELS ====================
class RecommendationItem(BaseModel):
    item_id: int
    recommendation_type: RecommendationType
    confidence_score: float = Field(ge=0.0, le=1.0)
    reason: str
    context_data: Dict[str, Any]


class RecommendationResponse(BaseModel):
    user_id: int
    recommendations: List[RecommendationItem]
    generated_at: datetime
    model_version: str = "v1.0-basic"


class DiscountSuggestion(BaseModel):
    discount_type: DiscountType
    discount_value: float
    applicable_items: List[int]
    requirements: Dict[str, Any]
    expected_impact: Dict[str, float]
    reasoning: str


class DiscountResponse(BaseModel):
    cafeteria_id: int
    suggestions: List[DiscountSuggestion]
    generated_at: datetime
    analysis_summary: Dict[str, Any]


class ReviewAnalysisResponse(BaseModel):
    review_id: int
    sentiment_score: float = Field(ge=-1.0, le=1.0)
    sentiment_type: SentimentType
    keywords: List[str]
    is_approved: bool
    confidence: float = Field(ge=0.0, le=1.0)
    analysis_notes: str


# ==================== HEALTH CHECK ====================
@app.get("/")
async def root():
    return {
        "service": "Demeter AI Service",
        "status": "running",
        "version": "1.0.0",
        "endpoints": {
            "recommendations": "/api/v1/recommendations",
            "discounts": "/api/v1/discounts/generate",
            "review_analysis": "/api/v1/reviews/analyze"
        }
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    }


# ==================== RECOMMENDATION ENDPOINT ====================
@app.post("/api/v1/recommendations", response_model=RecommendationResponse)
async def generate_recommendations(
        request: RecommendationRequest,
        api_key: str = Depends(verify_api_key)
):
    """Generate personalized food recommendations"""

    try:
        recommendations = []
        current_hour = request.current_time.hour

        # Recommendation 1: Based on purchase history
        if request.purchase_history:
            most_purchased = max(request.purchase_history, key=lambda x: x.purchase_count)
            recommendations.append(RecommendationItem(
                item_id=most_purchased.item_id,
                recommendation_type=RecommendationType.PERSONALIZED,
                confidence_score=0.85,
                reason=f"You've ordered this {most_purchased.purchase_count} times",
                context_data={
                    "category_id": most_purchased.category_id,
                    "purchase_frequency": most_purchased.purchase_count
                }
            ))

        # Recommendation 2: Time-based contextual
        if 6 <= current_hour < 11:
            context_item_id = 101
            reason = "Perfect for breakfast!"
        elif 11 <= current_hour < 15:
            context_item_id = 201
            reason = "Lunch time favorite"
        else:
            context_item_id = 301
            reason = "Popular evening choice"

        recommendations.append(RecommendationItem(
            item_id=context_item_id,
            recommendation_type=RecommendationType.CONTEXTUAL,
            confidence_score=0.75,
            reason=reason,
            context_data={"time_of_day": current_hour, "context": request.context}
        ))

        # Recommendation 3: Complementary item
        recommendations.append(RecommendationItem(
            item_id=150,
            recommendation_type=RecommendationType.COMPLEMENTARY,
            confidence_score=0.70,
            reason="Pairs well with your order",
            context_data={"complement_type": "beverage"}
        ))

        recommendations = recommendations[:request.limit]

        return RecommendationResponse(
            user_id=request.user_id,
            recommendations=recommendations,
            generated_at=datetime.now()
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation generation failed: {str(e)}")


# ==================== DISCOUNT GENERATION ENDPOINT ====================
@app.post("/api/v1/discounts/generate", response_model=DiscountResponse)
async def generate_discounts(
        request: DiscountRequest,
        api_key: str = Depends(verify_api_key)
):
    """Generate AI-powered discount suggestions"""

    try:
        suggestions = []

        if request.sales_data:
            avg_sales = sum(item.total_sales for item in request.sales_data) / len(request.sales_data)
            low_performers = [item for item in request.sales_data if item.total_sales < avg_sales * 0.5]

            # Strategy 1: Percentage discount on low performers
            if low_performers:
                target_item = low_performers[0]
                discount_value = min(20.0, request.max_discount_percentage)

                suggestions.append(DiscountSuggestion(
                    discount_type=DiscountType.PERCENTAGE,
                    discount_value=discount_value,
                    applicable_items=[target_item.item_id],
                    requirements={"min_quantity": 1},
                    expected_impact={
                        "sales_increase_percent": 35.0,
                        "revenue_impact_percent": 15.0,
                        "margin_percent": request.target_profit_margin * 100
                    },
                    reasoning=f"Boost sales of underperforming item (current sales: {target_item.total_sales})"
                ))

            # Strategy 2: Buy 2 Get 1 Free
            popular_items = sorted(request.sales_data, key=lambda x: x.total_sales, reverse=True)[:3]
            if len(popular_items) >= 3:
                suggestions.append(DiscountSuggestion(
                    discount_type=DiscountType.BUY_X_GET_Y,
                    discount_value=33.33,
                    applicable_items=[item.item_id for item in popular_items],
                    requirements={"buy_quantity": 2, "get_quantity": 1},
                    expected_impact={
                        "sales_increase_percent": 45.0,
                        "revenue_impact_percent": 25.0,
                        "margin_percent": request.target_profit_margin * 100
                    },
                    reasoning="Increase purchase quantity of top sellers"
                ))

        analysis_summary = {
            "total_items_analyzed": len(request.sales_data),
            "average_sales": avg_sales if request.sales_data else 0,
            "low_performers_count": len(low_performers) if request.sales_data else 0,
            "suggestions_count": len(suggestions)
        }

        return DiscountResponse(
            cafeteria_id=request.cafeteria_id,
            suggestions=suggestions,
            generated_at=datetime.now(),
            analysis_summary=analysis_summary
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Discount generation failed: {str(e)}")


# ==================== REVIEW ANALYSIS ENDPOINT ====================
@app.post("/api/v1/reviews/analyze", response_model=ReviewAnalysisResponse)
async def analyze_review(
        request: ReviewAnalysisRequest,
        api_key: str = Depends(verify_api_key)
):
    """Analyze review sentiment with Nonsense Filtering & Dynamic Confidence"""

    try:
        text_lower = request.review_text.lower()
        tokens = word_tokenize(text_lower)
        
        # nonsense check 
        # Logic: If < 50% of the words are real English words, it's probably nonsense.
        meaningful_words = [w for w in tokens if w.isalpha() and len(w) > 2]
        
        if not meaningful_words:
            valid_word_ratio = 0
        else:
            valid_count = sum(1 for w in meaningful_words if w in english_vocab)
            valid_word_ratio = valid_count / len(meaningful_words)

        # Rejection Logic: If ratio is too low, return Low Confidence / Unapproved
        if len(meaningful_words) > 0 and valid_word_ratio < 0.4:
            return ReviewAnalysisResponse(
                review_id=request.review_id,
                sentiment_score=0.0,
                sentiment_type=SentimentType.NEUTRAL,
                keywords=[],
                is_approved=False,
                confidence=0.1, 
                analysis_notes="Flagged as potential gibberish/nonsense text."
            )

        # sentiment analysis using VADER
        scores = sia.polarity_scores(request.review_text)
        compound_score = scores['compound']

        # Determine label
        if compound_score >= 0.05:
            sentiment_type = SentimentType.POSITIVE
        elif compound_score <= -0.05:
            sentiment_type = SentimentType.NEGATIVE
        else:
            sentiment_type = SentimentType.NEUTRAL

        # dynamic confidence calculation
        # Logic: The more intense the sentiment (closer to 1 or -1), the higher the confidence. 
        # Neutral scores (around 0) are less confident.
        confidence = 0.5 + (abs(compound_score) * 0.4)
        
        # Boost confidence if the Star Rating matches the Sentiment
        star_consistent = False
        if (request.star_rating >= 4 and sentiment_type == SentimentType.POSITIVE):
            star_consistent = True
        elif (request.star_rating <= 2 and sentiment_type == SentimentType.NEGATIVE):
            star_consistent = True
            
        if star_consistent:
            confidence = min(0.99, confidence + 0.1) 
            
        # keyword extraction (frequency-based)
        stop_words = set(stopwords.words('english'))
        filtered_words = [w for w in meaningful_words if w not in stop_words]
        keywords = [word for word, count in Counter(filtered_words).most_common(5)]

        # approval logic
        is_approved = (confidence > 0.6) and (not (sentiment_type == SentimentType.NEGATIVE and request.star_rating >= 4))

        return ReviewAnalysisResponse(
            review_id=request.review_id,
            sentiment_score=round(compound_score, 3),
            sentiment_type=sentiment_type,
            keywords=keywords,
            is_approved=is_approved,
            confidence=round(confidence, 2),
            analysis_notes=f"Valid English Ratio: {int(valid_word_ratio*100)}%"
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
