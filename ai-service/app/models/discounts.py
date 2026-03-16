from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

from .enums import DiscountType


class DiscountRequest(BaseModel):
    cafeteria_id: int
    limit: int = Field(default=5, ge=1, le=10)


class ProposedDiscount(BaseModel):
    discount_type: DiscountType
    target_item_id: int
    associated_item_id: Optional[int] = None
    suggested_value: float
    reason: str


class DiscountResponse(BaseModel):
    cafeteria_id: int
    proposed_discounts: List[ProposedDiscount]
    generated_at: datetime
