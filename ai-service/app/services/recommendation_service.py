"""Business logic for generating personalized food recommendations."""

from datetime import datetime

from fastapi import HTTPException

from ..models.enums import RecommendationType
from ..models.recommendations import (
    RecommendationRequest,
    RecommendationItem,
    RecommendationResponse,
)
from .model_loader import ml_resources


def get_time_bucket(hour: int) -> str:
    if 6 <= hour < 11:
        return 'Morning'
    elif 11 <= hour < 16:
        return 'Lunch'
    return 'Evening'


def generate_recommendations(payload: RecommendationRequest) -> RecommendationResponse:
    """Generate personalized and contextual food recommendations."""

    user_matrix = ml_resources.get("user_item_matrix")
    knn = ml_resources.get("knn_model")
    time_rules = ml_resources.get("time_rules")
    canteen_map = ml_resources.get("item_canteen_map")

    if user_matrix is None or knn is None:
        raise HTTPException(status_code=503, detail="AI models are currently unavailable.")

    if payload.context.lower() == "cart":
        if payload.cafeteria_id is None:
            raise HTTPException(status_code=400, detail="You must provide a cafeteria_id when the context is 'cart'.")
        if payload.cafeteria_id < 1:
            raise HTTPException(status_code=400, detail="Invalid cafeteria_id. Must be a positive integer.")

    time_bucket = get_time_bucket(payload.current_time.hour)
    raw_item_suggestions = []

    user_known = payload.user_id in user_matrix.index
    if user_known:
        user_vector = user_matrix.loc[payload.user_id].values.reshape(1, -1)
        distances, indices = knn.kneighbors(user_vector)
        neighbor_indices = indices[0][1:]
        neighbor_user_ids = user_matrix.index[neighbor_indices]
        neighbor_purchases = user_matrix.loc[neighbor_user_ids].sum(axis=0)

        user_purchases = user_matrix.loc[payload.user_id]
        items_already_bought = user_purchases[user_purchases > 0].index.tolist()
        new_suggestions = neighbor_purchases.drop(labels=items_already_bought)
        top_new_items = new_suggestions.sort_values(ascending=False)
        valid_knn_items = top_new_items[top_new_items > 0].index.tolist()

        for item in valid_knn_items:
            raw_item_suggestions.append({
                "item_id": item,
                "type": RecommendationType.PERSONALIZED,
                "reason": "People with similar tastes loved this!"
            })

    for item in time_rules[time_bucket]:
        if not any(d['item_id'] == item for d in raw_item_suggestions):
            raw_item_suggestions.append({
                "item_id": item,
                "type": RecommendationType.CONTEXTUAL,
                "reason": f"Popular choice for {time_bucket}!"
            })

    final_suggestions = []
    for suggestion in raw_item_suggestions:
        if len(final_suggestions) >= payload.limit:
            break
        item_id_str = str(suggestion["item_id"])
        item_cafeteria = canteen_map.get(item_id_str)

        if payload.context.lower() == "cart":
            if item_cafeteria == payload.cafeteria_id:
                final_suggestions.append(suggestion)
        else:
            final_suggestions.append(suggestion)

    recommendations = [
        RecommendationItem(
            item_id=item["item_id"],
            recommendation_type=item["type"],
            confidence_score=round(0.95 - (idx * 0.05), 2),
            reason=item["reason"],
            context_data={"filtered_for_canteen": payload.context.lower() == "cart"}
        ) for idx, item in enumerate(final_suggestions)
    ]

    return RecommendationResponse(
        user_id=payload.user_id,
        recommendations=recommendations,
        generated_at=datetime.now(),
        model_version="v2.0-knn-production"
    )
