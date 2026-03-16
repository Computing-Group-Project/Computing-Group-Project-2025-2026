"""
Tests for Demeter AI Service endpoints.
Uses FastAPI TestClient (httpx) — no running server needed.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.dependencies import limiter

API_KEY = "demeter-ai-service-key-2024"
HEADERS = {"X-API-Key": API_KEY, "Content-Type": "application/json"}


@pytest.fixture(scope="module")
def client():
    # Disable rate limiting during tests
    limiter.enabled = False
    with TestClient(app) as c:
        yield c
    limiter.enabled = True


# ── Health & Root ──


class TestHealthEndpoints:
    def test_root_returns_service_info(self, client):
        resp = client.get("/")
        assert resp.status_code == 200
        data = resp.json()
        assert data["service"] == "Demeter AI Service"
        assert data["status"] == "running"
        assert "endpoints" in data

    def test_health_check(self, client):
        resp = client.get("/health")
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "healthy"
        assert "timestamp" in data


# ── API Key Authentication ──


class TestAuthentication:
    def test_missing_api_key_returns_422(self, client):
        resp = client.post(
            "/api/v1/recommendations",
            json={"user_id": 1, "current_time": "2026-03-15T12:00:00", "context": "homepage", "limit": 3},
        )
        assert resp.status_code == 422

    def test_invalid_api_key_returns_401(self, client):
        resp = client.post(
            "/api/v1/recommendations",
            headers={"X-API-Key": "wrong-key", "Content-Type": "application/json"},
            json={"user_id": 1, "current_time": "2026-03-15T12:00:00", "context": "homepage", "limit": 3},
        )
        assert resp.status_code == 401
        assert "Invalid API Key" in resp.json()["detail"]

    def test_invalid_api_key_on_discounts(self, client):
        resp = client.post(
            "/api/v1/discounts",
            headers={"X-API-Key": "wrong-key", "Content-Type": "application/json"},
            json={"cafeteria_id": 1, "limit": 5},
        )
        assert resp.status_code == 401

    def test_invalid_api_key_on_reviews(self, client):
        resp = client.post(
            "/api/v1/reviews/analyze",
            headers={"X-API-Key": "wrong-key", "Content-Type": "application/json"},
            json={"review_id": 1, "review_text": "Great food", "star_rating": 5},
        )
        assert resp.status_code == 401


# ── Recommendations ──


class TestRecommendations:
    def test_homepage_recommendations_for_known_user(self, client):
        resp = client.post(
            "/api/v1/recommendations",
            headers=HEADERS,
            json={"user_id": 1, "current_time": "2026-03-15T12:00:00", "context": "homepage", "limit": 3},
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["user_id"] == 1
        assert len(data["recommendations"]) <= 3
        assert data["model_version"] == "v2.0-knn-production"
        for rec in data["recommendations"]:
            assert "item_id" in rec
            assert "recommendation_type" in rec
            assert 0.0 <= rec["confidence_score"] <= 1.0
            assert "reason" in rec

    def test_homepage_recommendations_for_unknown_user(self, client):
        """Unknown users should get contextual (time-based) fallback recommendations."""
        resp = client.post(
            "/api/v1/recommendations",
            headers=HEADERS,
            json={"user_id": 99999, "current_time": "2026-03-15T12:00:00", "context": "homepage", "limit": 3},
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["user_id"] == 99999
        assert len(data["recommendations"]) > 0
        for rec in data["recommendations"]:
            assert rec["recommendation_type"] == "CONTEXTUAL"

    def test_cart_recommendations_filter_by_cafeteria(self, client):
        resp = client.post(
            "/api/v1/recommendations",
            headers=HEADERS,
            json={"user_id": 1, "current_time": "2026-03-15T12:00:00", "context": "cart", "cafeteria_id": 1, "limit": 5},
        )
        assert resp.status_code == 200
        data = resp.json()
        for rec in data["recommendations"]:
            assert rec["context_data"]["filtered_for_canteen"] is True

    def test_cart_without_cafeteria_id_returns_400(self, client):
        resp = client.post(
            "/api/v1/recommendations",
            headers=HEADERS,
            json={"user_id": 1, "current_time": "2026-03-15T12:00:00", "context": "cart", "limit": 3},
        )
        assert resp.status_code == 400
        assert "cafeteria_id" in resp.json()["detail"]

    def test_cart_with_invalid_cafeteria_id_returns_400(self, client):
        resp = client.post(
            "/api/v1/recommendations",
            headers=HEADERS,
            json={"user_id": 1, "current_time": "2026-03-15T12:00:00", "context": "cart", "cafeteria_id": 99, "limit": 3},
        )
        assert resp.status_code == 400
        assert "Invalid cafeteria_id" in resp.json()["detail"]

    def test_morning_time_bucket(self, client):
        """Requests at 8 AM should use Morning time bucket."""
        resp = client.post(
            "/api/v1/recommendations",
            headers=HEADERS,
            json={"user_id": 99999, "current_time": "2026-03-15T08:00:00", "context": "homepage", "limit": 3},
        )
        assert resp.status_code == 200
        data = resp.json()
        assert len(data["recommendations"]) > 0
        for rec in data["recommendations"]:
            assert "Morning" in rec["reason"]

    def test_lunch_time_bucket(self, client):
        """Requests at noon should use Lunch time bucket."""
        resp = client.post(
            "/api/v1/recommendations",
            headers=HEADERS,
            json={"user_id": 99999, "current_time": "2026-03-15T12:00:00", "context": "homepage", "limit": 3},
        )
        assert resp.status_code == 200
        data = resp.json()
        assert len(data["recommendations"]) > 0
        for rec in data["recommendations"]:
            assert "Lunch" in rec["reason"]

    def test_evening_time_bucket(self, client):
        """Requests at 7 PM should use Evening time bucket."""
        resp = client.post(
            "/api/v1/recommendations",
            headers=HEADERS,
            json={"user_id": 99999, "current_time": "2026-03-15T19:00:00", "context": "homepage", "limit": 3},
        )
        assert resp.status_code == 200
        data = resp.json()
        assert len(data["recommendations"]) > 0
        for rec in data["recommendations"]:
            assert "Evening" in rec["reason"]

    def test_limit_respected(self, client):
        resp = client.post(
            "/api/v1/recommendations",
            headers=HEADERS,
            json={"user_id": 1, "current_time": "2026-03-15T12:00:00", "context": "homepage", "limit": 1},
        )
        assert resp.status_code == 200
        assert len(resp.json()["recommendations"]) <= 1

    def test_confidence_scores_are_descending(self, client):
        resp = client.post(
            "/api/v1/recommendations",
            headers=HEADERS,
            json={"user_id": 1, "current_time": "2026-03-15T12:00:00", "context": "homepage", "limit": 5},
        )
        assert resp.status_code == 200
        scores = [r["confidence_score"] for r in resp.json()["recommendations"]]
        assert scores == sorted(scores, reverse=True)

    def test_known_user_gets_personalized_recommendations(self, client):
        """A user present in the training data should get at least one PERSONALIZED recommendation."""
        resp = client.post(
            "/api/v1/recommendations",
            headers=HEADERS,
            json={"user_id": 1, "current_time": "2026-03-15T12:00:00", "context": "homepage", "limit": 5},
        )
        assert resp.status_code == 200
        types = [r["recommendation_type"] for r in resp.json()["recommendations"]]
        assert "PERSONALIZED" in types

    def test_response_contains_generated_at(self, client):
        resp = client.post(
            "/api/v1/recommendations",
            headers=HEADERS,
            json={"user_id": 1, "current_time": "2026-03-15T12:00:00", "context": "homepage", "limit": 3},
        )
        assert resp.status_code == 200
        assert "generated_at" in resp.json()


# ── Discounts ──


class TestDiscounts:
    def test_generate_discounts_cafeteria_1(self, client):
        resp = client.post(
            "/api/v1/discounts",
            headers=HEADERS,
            json={"cafeteria_id": 1, "limit": 5},
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["cafeteria_id"] == 1
        assert len(data["proposed_discounts"]) > 0
        assert len(data["proposed_discounts"]) <= 5
        assert "generated_at" in data

    def test_generate_discounts_cafeteria_2(self, client):
        resp = client.post(
            "/api/v1/discounts",
            headers=HEADERS,
            json={"cafeteria_id": 2, "limit": 5},
        )
        assert resp.status_code == 200
        assert resp.json()["cafeteria_id"] == 2
        assert len(resp.json()["proposed_discounts"]) > 0

    def test_generate_discounts_cafeteria_3(self, client):
        resp = client.post(
            "/api/v1/discounts",
            headers=HEADERS,
            json={"cafeteria_id": 3, "limit": 5},
        )
        assert resp.status_code == 200
        assert resp.json()["cafeteria_id"] == 3
        assert len(resp.json()["proposed_discounts"]) > 0

    def test_discount_types_are_valid(self, client):
        resp = client.post(
            "/api/v1/discounts",
            headers=HEADERS,
            json={"cafeteria_id": 1, "limit": 10},
        )
        assert resp.status_code == 200
        valid_types = {"BOGO", "COMBO", "PERCENTAGE", "FIXED_AMOUNT"}
        for discount in resp.json()["proposed_discounts"]:
            assert discount["discount_type"] in valid_types
            assert discount["suggested_value"] > 0
            assert "reason" in discount

    def test_bogo_discounts_have_associated_item(self, client):
        resp = client.post(
            "/api/v1/discounts",
            headers=HEADERS,
            json={"cafeteria_id": 1, "limit": 10},
        )
        assert resp.status_code == 200
        bogos = [d for d in resp.json()["proposed_discounts"] if d["discount_type"] == "BOGO"]
        assert len(bogos) > 0
        for bogo in bogos:
            assert bogo["associated_item_id"] is not None
            assert bogo["suggested_value"] == 100.0

    def test_combo_discounts_have_associated_item(self, client):
        resp = client.post(
            "/api/v1/discounts",
            headers=HEADERS,
            json={"cafeteria_id": 2, "limit": 10},
        )
        assert resp.status_code == 200
        combos = [d for d in resp.json()["proposed_discounts"] if d["discount_type"] == "COMBO"]
        for combo in combos:
            assert combo["associated_item_id"] is not None

    def test_percentage_discounts_no_associated_item(self, client):
        resp = client.post(
            "/api/v1/discounts",
            headers=HEADERS,
            json={"cafeteria_id": 2, "limit": 10},
        )
        assert resp.status_code == 200
        percentages = [d for d in resp.json()["proposed_discounts"] if d["discount_type"] == "PERCENTAGE"]
        for pct in percentages:
            assert pct["associated_item_id"] is None

    def test_invalid_cafeteria_id_returns_400(self, client):
        resp = client.post(
            "/api/v1/discounts",
            headers=HEADERS,
            json={"cafeteria_id": 99, "limit": 5},
        )
        assert resp.status_code == 400
        assert "Invalid Cafeteria ID" in resp.json()["detail"]

    def test_limit_respected(self, client):
        resp = client.post(
            "/api/v1/discounts",
            headers=HEADERS,
            json={"cafeteria_id": 1, "limit": 2},
        )
        assert resp.status_code == 200
        assert len(resp.json()["proposed_discounts"]) <= 2

    def test_no_duplicate_target_items_in_discounts(self, client):
        resp = client.post(
            "/api/v1/discounts",
            headers=HEADERS,
            json={"cafeteria_id": 1, "limit": 10},
        )
        assert resp.status_code == 200
        all_target_ids = [d["target_item_id"] for d in resp.json()["proposed_discounts"]]
        assert len(all_target_ids) == len(set(all_target_ids))

    def test_discount_priority_order(self, client):
        """BOGO discounts should appear before COMBO, which should appear before PERCENTAGE."""
        resp = client.post(
            "/api/v1/discounts",
            headers=HEADERS,
            json={"cafeteria_id": 1, "limit": 10},
        )
        assert resp.status_code == 200
        types = [d["discount_type"] for d in resp.json()["proposed_discounts"]]
        priority = {"BOGO": 0, "COMBO": 1, "PERCENTAGE": 2, "FIXED_AMOUNT": 3}
        priorities = [priority[t] for t in types]
        assert priorities == sorted(priorities)

    def test_cafeteria_0_returns_400(self, client):
        resp = client.post(
            "/api/v1/discounts",
            headers=HEADERS,
            json={"cafeteria_id": 0, "limit": 5},
        )
        assert resp.status_code == 400


# ── Review Analysis ──


class TestReviewAnalysis:
    def test_positive_review(self, client):
        resp = client.post(
            "/api/v1/reviews/analyze",
            headers=HEADERS,
            json={"review_id": 1, "review_text": "Amazing food and excellent service, loved it", "star_rating": 5},
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["review_id"] == 1
        assert data["sentiment_type"] == "POSITIVE"
        assert data["sentiment_score"] > 0
        assert data["is_approved"] is True
        assert data["confidence"] > 0.5
        assert len(data["keywords"]) > 0

    def test_negative_review(self, client):
        resp = client.post(
            "/api/v1/reviews/analyze",
            headers=HEADERS,
            json={"review_id": 2, "review_text": "Terrible food, cold and tasteless, worst experience ever", "star_rating": 1},
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["sentiment_type"] == "NEGATIVE"
        assert data["sentiment_score"] < 0

    def test_neutral_review(self, client):
        """A bland, factual review should produce a near-zero sentiment score."""
        resp = client.post(
            "/api/v1/reviews/analyze",
            headers=HEADERS,
            json={"review_id": 3, "review_text": "I had the rice and chicken for lunch today", "star_rating": 3},
        )
        assert resp.status_code == 200
        data = resp.json()
        assert -0.3 <= data["sentiment_score"] <= 0.3

    def test_nonsense_review_flagged(self, client):
        resp = client.post(
            "/api/v1/reviews/analyze",
            headers=HEADERS,
            json={"review_id": 4, "review_text": "asdfgh jklqwerty zxcvbn mnbvcx lkjhgf", "star_rating": 3},
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["is_approved"] is False
        assert data["confidence"] <= 0.2
        assert "gibberish" in data["analysis_notes"].lower() or "nonsense" in data["analysis_notes"].lower()

    def test_star_sentiment_consistency_boosts_confidence(self, client):
        """High star + positive text should yield higher confidence than mismatched."""
        positive_resp = client.post(
            "/api/v1/reviews/analyze",
            headers=HEADERS,
            json={"review_id": 5, "review_text": "Absolutely wonderful, best meal ever", "star_rating": 5},
        )
        mismatch_resp = client.post(
            "/api/v1/reviews/analyze",
            headers=HEADERS,
            json={"review_id": 6, "review_text": "Absolutely wonderful, best meal ever", "star_rating": 1},
        )
        assert positive_resp.status_code == 200
        assert mismatch_resp.status_code == 200
        assert positive_resp.json()["confidence"] >= mismatch_resp.json()["confidence"]

    def test_negative_sentiment_with_high_stars_not_approved(self, client):
        """Contradictory reviews (negative text + high stars) should not be auto-approved."""
        resp = client.post(
            "/api/v1/reviews/analyze",
            headers=HEADERS,
            json={"review_id": 7, "review_text": "Horrible disgusting terrible awful", "star_rating": 5},
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["is_approved"] is False

    def test_keywords_are_meaningful(self, client):
        resp = client.post(
            "/api/v1/reviews/analyze",
            headers=HEADERS,
            json={"review_id": 8, "review_text": "The chicken was delicious and the rice was perfectly cooked", "star_rating": 5},
        )
        assert resp.status_code == 200
        keywords = resp.json()["keywords"]
        assert len(keywords) > 0
        common_stopwords = {"the", "was", "and", "is", "a", "an"}
        for kw in keywords:
            assert kw not in common_stopwords

    def test_sentiment_score_range(self, client):
        resp = client.post(
            "/api/v1/reviews/analyze",
            headers=HEADERS,
            json={"review_id": 9, "review_text": "Pretty good food overall", "star_rating": 4},
        )
        assert resp.status_code == 200
        score = resp.json()["sentiment_score"]
        assert -1.0 <= score <= 1.0

    def test_confidence_range(self, client):
        resp = client.post(
            "/api/v1/reviews/analyze",
            headers=HEADERS,
            json={"review_id": 10, "review_text": "Great service", "star_rating": 4},
        )
        assert resp.status_code == 200
        confidence = resp.json()["confidence"]
        assert 0.0 <= confidence <= 1.0

    def test_analysis_notes_contain_valid_ratio(self, client):
        resp = client.post(
            "/api/v1/reviews/analyze",
            headers=HEADERS,
            json={"review_id": 11, "review_text": "Good food and friendly staff", "star_rating": 4},
        )
        assert resp.status_code == 200
        notes = resp.json()["analysis_notes"]
        assert "Valid English Ratio" in notes

    def test_negative_review_with_matching_low_stars_approved(self, client):
        """Consistent negative review (low stars + negative text) should still be approved."""
        resp = client.post(
            "/api/v1/reviews/analyze",
            headers=HEADERS,
            json={"review_id": 12, "review_text": "The food was terrible and service was slow", "star_rating": 1},
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["sentiment_type"] == "NEGATIVE"
        assert data["is_approved"] is True


# ── Request Validation ──


class TestRequestValidation:
    def test_recommendation_missing_user_id(self, client):
        resp = client.post(
            "/api/v1/recommendations",
            headers=HEADERS,
            json={"current_time": "2026-03-15T12:00:00", "context": "homepage", "limit": 3},
        )
        assert resp.status_code == 422

    def test_recommendation_invalid_limit(self, client):
        resp = client.post(
            "/api/v1/recommendations",
            headers=HEADERS,
            json={"user_id": 1, "current_time": "2026-03-15T12:00:00", "context": "homepage", "limit": 0},
        )
        assert resp.status_code == 422

    def test_recommendation_limit_exceeds_max(self, client):
        resp = client.post(
            "/api/v1/recommendations",
            headers=HEADERS,
            json={"user_id": 1, "current_time": "2026-03-15T12:00:00", "context": "homepage", "limit": 11},
        )
        assert resp.status_code == 422

    def test_discount_missing_cafeteria_id(self, client):
        resp = client.post(
            "/api/v1/discounts",
            headers=HEADERS,
            json={"limit": 5},
        )
        assert resp.status_code == 422

    def test_review_missing_review_text(self, client):
        resp = client.post(
            "/api/v1/reviews/analyze",
            headers=HEADERS,
            json={"review_id": 1, "star_rating": 5},
        )
        assert resp.status_code == 422

    def test_review_star_rating_out_of_range(self, client):
        resp = client.post(
            "/api/v1/reviews/analyze",
            headers=HEADERS,
            json={"review_id": 1, "review_text": "Good food", "star_rating": 6},
        )
        assert resp.status_code == 422

    def test_review_star_rating_below_minimum(self, client):
        resp = client.post(
            "/api/v1/reviews/analyze",
            headers=HEADERS,
            json={"review_id": 1, "review_text": "Bad food", "star_rating": 0},
        )
        assert resp.status_code == 422
