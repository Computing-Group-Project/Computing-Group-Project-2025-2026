"""Business logic for AI-driven discount generation."""

from datetime import datetime

from fastapi import HTTPException

from ..models.enums import DiscountType
from ..models.discounts import DiscountRequest, ProposedDiscount, DiscountResponse
from .model_loader import ml_resources


def generate_discounts(payload: DiscountRequest) -> DiscountResponse:
    """Generate discount proposals for a cafeteria based on sales analysis."""

    if payload.cafeteria_id is None or payload.cafeteria_id < 1:
        raise HTTPException(status_code=400, detail="Invalid Cafeteria ID. Must be a positive integer.")

    cid = str(payload.cafeteria_id)
    combo_rules = ml_resources.get("combo_rules", {})
    failing_items = ml_resources.get("failing_items", {})
    bogo_rules = ml_resources.get("bogo_rules", {})

    proposed_discounts = []
    used_items = set()

    # BOGO (highest priority — clear stock)
    for bogo in bogo_rules.get(cid, []):
        if len(proposed_discounts) >= payload.limit:
            break
        buy_item = bogo["buy_item"]
        get_item = bogo["get_item"]
        bogo_type = bogo.get("bogo_type", "clearance")

        if buy_item not in used_items and get_item not in used_items:
            reason = ("Buy one get one free to clear stock!"
                      if bogo_type == "clearance"
                      else "Buy a favorite, try something new for free!")
            proposed_discounts.append(ProposedDiscount(
                discount_type=DiscountType.BOGO,
                target_item_id=buy_item,
                associated_item_id=get_item,
                suggested_value=100.0,
                reason=reason
            ))
            used_items.update([buy_item, get_item])

    for combo in combo_rules.get(cid, []):
        if len(proposed_discounts) >= payload.limit:
            break
        item_a, item_b = combo["item_a"], combo["item_b"]
        confidence = combo.get("confidence", 0.5)

        if item_a not in used_items and item_b not in used_items:
            dynamic_discount = min(round(5.0 + ((1.0 - confidence) * 10.0), 1), 10.0)
            proposed_discounts.append(ProposedDiscount(
                discount_type=DiscountType.COMBO,
                target_item_id=item_a,
                associated_item_id=item_b,
                suggested_value=dynamic_discount,
                reason=f"Frequently bought together. Get {dynamic_discount}% off the bundle!"
            ))
            used_items.update([item_a, item_b])

    for item_data in failing_items.get(cid, []):
        if len(proposed_discounts) >= payload.limit:
            break

        if isinstance(item_data, dict):
            item_id = item_data["item_id"]
            severity = item_data.get("severity", 0.5)
        else:
            item_id = item_data
            severity = 0.5

        if item_id not in used_items:
            dynamic_discount = min(round(10.0 + (severity * 25.0), 1), 10.0)
            proposed_discounts.append(ProposedDiscount(
                discount_type=DiscountType.PERCENTAGE,
                target_item_id=item_id,
                associated_item_id=None,
                suggested_value=dynamic_discount,
                reason=f"Low sales volume. Recommended {dynamic_discount}% off to boost traction."
            ))
            used_items.add(item_id)

    return DiscountResponse(
        cafeteria_id=payload.cafeteria_id,
        proposed_discounts=proposed_discounts,
        generated_at=datetime.now()
    )
