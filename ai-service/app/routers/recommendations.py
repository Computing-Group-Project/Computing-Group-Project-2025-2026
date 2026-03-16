import traceback

from fastapi import APIRouter, HTTPException, Depends, Request

from ..config import RATE_LIMIT_RECOMMENDATIONS
from ..dependencies import verify_api_key, limiter
from ..models.recommendations import RecommendationRequest, RecommendationResponse
from ..services import recommendation_service

router = APIRouter(prefix="/api/v1", tags=["Recommendations"])


@router.post("/recommendations", response_model=RecommendationResponse)
@limiter.limit(RATE_LIMIT_RECOMMENDATIONS)
async def generate_recommendations(
    request: Request,
    payload: RecommendationRequest,
    api_key: str = Depends(verify_api_key)
):
    """Generate personalized and contextual food recommendations."""
    try:
        return recommendation_service.generate_recommendations(payload)
    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Recommendation pipeline failed: {str(e)}")
