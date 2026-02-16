"""Demeter AI Service - Temporary Basic Implementation"""

from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import uvicorn
from enum import Enum

app = FastAPI(title="Demeter AI Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = "demeter-ai-service-key-2024"

async def verify_api_key(x_api_key: str = Header(...)):
    if x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API Key")
    return x_api_key

# ENUMS
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

# REQUEST MODELS
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
    context: str = "homepage"
    limit: int = 3

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
    current_discounts: List[int]
    target_profit_margin: float = 0.3
    max_discount_percentage: float = 30.0

class ReviewAnalysisRequest(BaseModel):
    review_id: int
    review_text: str
    star_rating: int = Field(ge=1, le=5)

# RESPONSE MODELS
class RecommendationItem(BaseModel):
    item_id: int
    recommendation_type: RecommendationType
    confidence_score: float
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
    sentiment_score: float
    sentiment_type: SentimentType
    keywords: List[str]
    is_approved: bool
    confidence: float
    analysis_notes: str

# ENDPOINTS
@app.get("/")
async def root():
    return {"service": "Demeter AI", "status": "running", "version": "1.0.0"}

@app.get("/health")
async def health():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/api/v1/recommendations", response_model=RecommendationResponse)
async def generate_recommendations(request: RecommendationRequest, api_key: str = Depends(verify_api_key)):
    recommendations = []
    hour = request.current_time.hour

    # Based on purchase history
    if request.purchase_history:
        top = max(request.purchase_history, key=lambda x: x.purchase_count)
        recommendations.append(RecommendationItem(
            item_id=top.item_id,
            recommendation_type=RecommendationType.PERSONALIZED,
            confidence_score=0.85,
            reason=f"Ordered {top.purchase_count} times",
            context_data={"category_id": top.category_id}
        ))

    # Time-based
    item_id = 101 if 6 <= hour < 11 else (201 if 11 <= hour < 15 else 301)
    recommendations.append(RecommendationItem(
        item_id=item_id,
        recommendation_type=RecommendationType.CONTEXTUAL,
        confidence_score=0.75,
        reason="Time-based suggestion",
        context_data={"hour": hour}
    ))

    # Complementary
    recommendations.append(RecommendationItem(
        item_id=150,
        recommendation_type=RecommendationType.COMPLEMENTARY,
        confidence_score=0.70,
        reason="Pairs well with your order",
        context_data={}
    ))

    return RecommendationResponse(
        user_id=request.user_id,
        recommendations=recommendations[:request.limit],
        generated_at=datetime.now()
    )

@app.post("/api/v1/discounts/generate", response_model=DiscountResponse)
async def generate_discounts(request: DiscountRequest, api_key: str = Depends(verify_api_key)):
    suggestions = []

    if request.sales_data:
        avg = sum(i.total_sales for i in request.sales_data) / len(request.sales_data)
        low = [i for i in request.sales_data if i.total_sales < avg * 0.5]

        if low:
            suggestions.append(DiscountSuggestion(
                discount_type=DiscountType.PERCENTAGE,
                discount_value=20.0,
                applicable_items=[low[0].item_id],
                requirements={"min_quantity": 1},
                expected_impact={"sales_increase": 35.0},
                reasoning="Boost low performer"
            ))

    return DiscountResponse(
        cafeteria_id=request.cafeteria_id,
        suggestions=suggestions,
        generated_at=datetime.now(),
        analysis_summary={"total": len(request.sales_data)}
    )

@app.post("/api/v1/reviews/analyze", response_model=ReviewAnalysisResponse)
async def analyze_review(request: ReviewAnalysisRequest, api_key: str = Depends(verify_api_key)):
    text = request.review_text.lower()
    pos = sum(1 for w in ['good', 'great', 'excellent', 'delicious'] if w in text)
    neg = sum(1 for w in ['bad', 'terrible', 'awful', 'poor'] if w in text)

    score = (request.star_rating - 3) / 2 * 0.7 + (pos - neg) * 0.3
    score = max(-1.0, min(1.0, score))

    sentiment = SentimentType.POSITIVE if score > 0.2 else (SentimentType.NEGATIVE if score < -0.2 else SentimentType.NEUTRAL)

    words = text.split()
    keywords = [w for w in words if len(w) > 3][:5]

    return ReviewAnalysisResponse(
        review_id=request.review_id,
        sentiment_score=round(score, 3),
        sentiment_type=sentiment,
        keywords=keywords,
        is_approved=score >= -0.3 and request.star_rating >= 2,
        confidence=0.8,
        analysis_notes=f"{pos} positive, {neg} negative words"
    )

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)