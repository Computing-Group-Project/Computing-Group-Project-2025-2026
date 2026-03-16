import logging

from fastapi import APIRouter, HTTPException, Depends, Request

from ..config import RATE_LIMIT_DISCOUNTS
from ..dependencies import verify_api_key, limiter
from ..models.discounts import DiscountRequest, DiscountResponse
from ..services import discount_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1", tags=["Discounts"])


@router.post("/discounts", response_model=DiscountResponse)
@limiter.limit(RATE_LIMIT_DISCOUNTS)
async def generate_discounts(
    request: Request,
    payload: DiscountRequest,
    api_key: str = Depends(verify_api_key)
):
    """Generate AI-driven discount proposals for a cafeteria."""
    try:
        return discount_service.generate_discounts(payload)
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Discount pipeline failed")
        raise HTTPException(status_code=500, detail="Discount pipeline failed")
