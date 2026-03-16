from pydantic import BaseModel, Field
from typing import List

from .enums import SentimentType


class ReviewAnalysisRequest(BaseModel):
    review_id: int
    review_text: str
    star_rating: int = Field(ge=1, le=5)


class ReviewAnalysisResponse(BaseModel):
    review_id: int
    sentiment_score: float = Field(ge=-1.0, le=1.0)
    sentiment_type: SentimentType
    keywords: List[str]
    is_approved: bool
    confidence: float = Field(ge=0.0, le=1.0)
    analysis_notes: str
