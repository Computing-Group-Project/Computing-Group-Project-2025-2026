from fastapi import APIRouter, HTTPException, Depends, Request

from ..config import RATE_LIMIT_REVIEWS
from ..dependencies import verify_api_key
from ..models.reviews import ReviewAnalysisRequest, ReviewAnalysisResponse
from ..services import review_service

router = APIRouter(prefix="/api/v1", tags=["Reviews"])


@router.post("/reviews/analyze", response_model=ReviewAnalysisResponse)
async def analyze_review(
    request: Request,
    payload: ReviewAnalysisRequest,
    api_key: str = Depends(verify_api_key)
):
    """Analyze review sentiment with nonsense filtering and dynamic confidence."""
    try:
        return review_service.analyze_review(payload)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
