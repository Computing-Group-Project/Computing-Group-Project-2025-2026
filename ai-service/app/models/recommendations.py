from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

from .enums import RecommendationType


class RecommendationRequest(BaseModel):
    user_id: int
    current_time: datetime
    dietary_preferences: Optional[List[str]] = None
    cafeteria_id: Optional[int] = None
    context: str = Field(default="homepage", description="homepage or cart")
    limit: int = Field(default=3, ge=1, le=10)


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
