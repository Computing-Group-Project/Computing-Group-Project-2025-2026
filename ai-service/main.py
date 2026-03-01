"""
Demeter AI Service - Python FastAPI
Temporary AI service for recommendations, discounts, and review analysis
"""

from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import uvicorn
from enum import Enum
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from collections import Counter
from nltk.corpus import words as nltk_words
import joblib
import pandas as pd
import json
import numpy as np
from contextlib import asynccontextmanager

# Global dictionary to safely hold all AI models in memory
ml_resources = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup logic
    print("Starting up: Loading AI models into memory...")
    
    # --LOADING NLTK MODELS--
    try:
        print("-> Checking NLTK resources...")
        try:
            nltk.data.find('sentiment/vader_lexicon.zip')
            nltk.data.find('tokenizers/punkt')
            nltk.data.find('corpora/stopwords')
            nltk.data.find('corpora/words')
        except LookupError:
            print("-> Downloading missing NLTK resources...")
            nltk.download('vader_lexicon', quiet=True)
            nltk.download('punkt', quiet=True)
            nltk.download('stopwords', quiet=True)
            nltk.download('words', quiet=True)
            
        # Store the initialized NLP tools in the global dictionary
        ml_resources["english_vocab"] = set(w.lower() for w in nltk_words.words())
        ml_resources["sia"] = SentimentIntensityAnalyzer()
        print("NLTK Models successfully loaded!")
    except Exception as e:
        print(f"Warning: Could not load NLTK models: {e}")

    # --LOADING RECOMMENDATION MODELS--
    try:
        print("-> Loading Recommendation models...")
        ml_resources["knn_model"] = joblib.load('knn_model.pkl')
        ml_resources["user_item_matrix"] = pd.read_pickle('user_item_matrix.pkl')
        
        with open('item_canteen_map.json', 'r') as f:
            ml_resources["item_canteen_map"] = json.load(f)
        with open('time_rules.json', 'r') as f:
            ml_resources["time_rules"] = json.load(f)
            
        print("Recommendation Models successfully loaded!")
    except Exception as e:
        print(f"Warning: Could not load Recommendation models: {e}")

    # --LOADING DISCOUNT MODELS--

    try:
            print("-> Loading Discount models...")
            with open('combo_rules.json', 'r') as f:
                ml_resources["combo_rules"] = json.load(f)
            with open('failing_items.json', 'r') as f:
                ml_resources["failing_items"] = json.load(f)
            with open('bogo_rules.json', 'r') as f:
                ml_resources["bogo_rules"] = json.load(f)
            print("Discount Models successfully loaded!")
    except Exception as e:
            print(f"Warning: Could not load Discount models: {e}")
            # Initialize with empty dicts if files are missing to prevent crashes
            ml_resources["combo_rules"] = {}
            ml_resources["failing_items"] = {}
            ml_resources["bogo_rules"] = {}

    print("AI Service is fully booted and ready!")
    
    # serve the app
    yield 

    # shutdown logic
    print("Shutting down: Clearing ALL models from memory...")
    ml_resources.clear()

# Initialize FastAPI
app = FastAPI(
    title="Demeter AI Service",
    description="AI-powered recommendations, discounts, and review analysis",
    version="1.0.0",
    lifespan=lifespan
)
# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Key configuration (in production, use environment variables)
API_KEY = "demeter-ai-service-key-2024"

# Security dependency
async def verify_api_key(x_api_key: str = Header(...)):
    if x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API Key")
    return x_api_key


# ==================== ENUMS ====================
class RecommendationType(str, Enum):
    PERSONALIZED = "PERSONALIZED"
    CONTEXTUAL = "CONTEXTUAL"
    COMPLEMENTARY = "COMPLEMENTARY"
    POPULAR = "POPULAR"


class DiscountType(str, Enum):
    PERCENTAGE = "PERCENTAGE"
    COMBO = "COMBO"
    BOGO = "BOGO"
    FIXED_AMOUNT = "FIXED_AMOUNT"


class SentimentType(str, Enum):
    POSITIVE = "POSITIVE"
    NEUTRAL = "NEUTRAL"
    NEGATIVE = "NEGATIVE"


# ==================== REQUEST MODELS ====================

class RecommendationRequest(BaseModel):
    user_id: int
    current_time: datetime
    dietary_preferences: Optional[List[str]] = None
    cafeteria_id: Optional[int] = None
    context: str = Field(default="homepage", description="homepage or cart")
    limit: int = Field(default=3, ge=1, le=10)


class DiscountRequest(BaseModel):
    cafeteria_id: int
    limit: int = Field(default=5, ge=1, le=10)

class ReviewAnalysisRequest(BaseModel):
    review_id: int
    review_text: str
    star_rating: int = Field(ge=1, le=5)


# ==================== RESPONSE MODELS ====================
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


class ProposedDiscount(BaseModel):
    discount_type: DiscountType
    target_item_id: int
    associated_item_id: Optional[int] = None  # ONLY for COMBO or BOGO
    suggested_value: float 
    reason: str

class DiscountResponse(BaseModel):
    cafeteria_id: int
    proposed_discounts: List[ProposedDiscount]
    generated_at: datetime


class ReviewAnalysisResponse(BaseModel):
    review_id: int
    sentiment_score: float = Field(ge=-1.0, le=1.0)
    sentiment_type: SentimentType
    keywords: List[str]
    is_approved: bool
    confidence: float = Field(ge=0.0, le=1.0)
    analysis_notes: str


# ==================== HEALTH CHECK ====================
@app.get("/")
async def root():
    return {
        "service": "Demeter AI Service",
        "status": "running",
        "version": "1.0.0",
        "endpoints": {
            "recommendations": "/api/v1/recommendations",
            "discounts": "/api/v1/discounts/generate",
            "review_analysis": "/api/v1/reviews/analyze"
        }
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    }


# ==================== RECOMMENDATION ENDPOINT ====================
@app.post("/api/v1/recommendations", response_model=RecommendationResponse)
async def generate_recommendations(
        request: RecommendationRequest,
        api_key: str = Depends(verify_api_key)
):
    """Generate personalized and contextual food recommendations"""
    try:
        recommendations = []
        raw_item_suggestions = []
        
        # Safely extract models from the lifespan dictionary
        user_matrix = ml_resources.get("user_item_matrix")
        knn = ml_resources.get("knn_model")
        time_rules = ml_resources.get("time_rules")
        canteen_map = ml_resources.get("item_canteen_map")

        # Failsafe: If models aren't loaded, return a clean error
        if user_matrix is None or knn is None:
            raise HTTPException(status_code=503, detail="AI models are currently unavailable.")
        
        if request.context.lower() == "cart":
            if request.cafeteria_id is None:
                raise HTTPException(
                    status_code=400, 
                    detail="You must provide a cafeteria_id when the context is 'cart'."
                )
            if request.cafeteria_id not in [1, 2, 3]:
                raise HTTPException(
                    status_code=400, 
                    detail="Invalid cafeteria_id. Must be 1, 2, or 3."
                )

        # Determine Time Bucket for Contextual Fallback
        hour = request.current_time.hour
        if 6 <= hour < 11:
            time_bucket = 'Morning'
        elif 11 <= hour < 16:
            time_bucket = 'Lunch'
        else:
            time_bucket = 'Evening'

        # Check if User is Known 
        user_known = request.user_id in user_matrix.index
        
        if user_known:
            # Extract user's taste vector
            user_vector = user_matrix.loc[request.user_id].values.reshape(1, -1)
            
            # Find the 6 nearest neighbors (1 is the user + 5 actual neighbors)
            distances, indices = knn.kneighbors(user_vector)
            neighbor_indices = indices[0][1:] 
            
            # Get the IDs of the neighbors and their purchase history
            neighbor_user_ids = user_matrix.index[neighbor_indices]
            neighbor_purchases = user_matrix.loc[neighbor_user_ids].sum(axis=0)
            
            # Remove items the user has already bought
            user_purchases = user_matrix.loc[request.user_id]
            items_already_bought = user_purchases[user_purchases > 0].index.tolist()
            new_suggestions = neighbor_purchases.drop(labels=items_already_bought)
            
            # Sort by highest purchase count among neighbors
            top_new_items = new_suggestions.sort_values(ascending=False)
            
            # Get the items that neighbors actually bought (count > 0)
            valid_knn_items = top_new_items[top_new_items > 0].index.tolist()
            
            for item in valid_knn_items:
                raw_item_suggestions.append({
                    "item_id": item,
                    "type": RecommendationType.PERSONALIZED,
                    "reason": "People with similar tastes loved this!"
                })

        # Time-Based Fallback & Backfill
        # If k-NN returns nothing or need more items to fill the limit
        for item in time_rules[time_bucket]:
            # prevent suggesting duplicates
            if not any(d['item_id'] == item for d in raw_item_suggestions):
                raw_item_suggestions.append({
                    "item_id": item,
                    "type": RecommendationType.CONTEXTUAL,
                    "reason": f"Popular choice for {time_bucket}!"
                })

        # Context Filter (Cart vs Homepage)
        final_suggestions = []
        for suggestion in raw_item_suggestions:
            if len(final_suggestions) >= request.limit:
                break
                
            item_id_str = str(suggestion["item_id"]) # JSON keys are strings
            item_cafeteria = canteen_map.get(item_id_str)
            
            # If request is from the cart page, return items from the current cafeteria
            if request.context.lower() == "cart":
                if item_cafeteria == request.cafeteria_id:
                    final_suggestions.append(suggestion)
            # If from the homepage, return anything
            else:
                final_suggestions.append(suggestion)

        # Format the Response
        recommendations = [
            RecommendationItem(
                item_id=item["item_id"],
                recommendation_type=item["type"],
                confidence_score=round(0.95 - (idx * 0.05), 2),
                reason=item["reason"],
                context_data={"filtered_for_canteen": request.context.lower() == "cart"}
            ) for idx, item in enumerate(final_suggestions)
        ]


        return RecommendationResponse(
            user_id=request.user_id,
            recommendations=recommendations,
            generated_at=datetime.now(),
            model_version="v2.0-knn-production"
        )

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Recommendation pipeline failed: {str(e)}")

# ==================== DISCOUNT GENERATION ENDPOINT ====================
@app.post("/api/v1/discounts", response_model=DiscountResponse)
async def generate_discounts(
    request: DiscountRequest,
    api_key: str = Depends(verify_api_key)
):
    try:
        # --- NEW VALIDATION BLOCK ---
        # Check if ID is null
        if request.cafeteria_id is None:
            raise HTTPException(status_code=400, detail="Cafeteria ID cannot be null.")
        
        # Check if ID is within the valid range (1-3)
        if not (1 <= request.cafeteria_id <= 3):
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid Cafeteria ID: {request.cafeteria_id}. Must be between 1 and 3."
            )
        
        # 1. Setup
        cid = str(request.cafeteria_id)
        canteen_map = ml_resources.get("item_canteen_map", {})
        combo_rules = ml_resources.get("combo_rules", {})
        failing_items = ml_resources.get("failing_items", {})
        
        proposed_discounts = []
        used_items = set()

        # 2. Process Combos
        current_cafeteria_combos = combo_rules.get(cid, [])
        for combo in current_cafeteria_combos:
            item_a, item_b = combo["item_a"], combo["item_b"]
            if canteen_map.get(str(item_a)) == request.cafeteria_id and canteen_map.get(str(item_b)) == request.cafeteria_id:
                if item_a not in used_items and item_b not in used_items:
                    proposed_discounts.append(ProposedDiscount(
                        discount_type=DiscountType.COMBO,
                        target_item_id=item_a,
                        associated_item_id=item_b,
                        suggested_value=10.0,
                        reason=f"Frequently bought with item {item_b}."
                    ))
                    used_items.update([item_a, item_b])

        # 3. Process Percentage
        current_failing_items = failing_items.get(cid, [])
        if isinstance(current_failing_items, dict):
            current_failing_items = current_failing_items.get("items", [])

        for item in current_failing_items:
            if canteen_map.get(str(item)) == request.cafeteria_id:
                if item not in used_items:
                    proposed_discounts.append(ProposedDiscount(
                        discount_type=DiscountType.PERCENTAGE,
                        target_item_id=item,
                        suggested_value=15.0,
                        reason="Low sales volume detected."
                    ))
                    used_items.add(item)

        # 4. Final Response
        return DiscountResponse(
            cafeteria_id=request.cafeteria_id,
            proposed_discounts=proposed_discounts,
            generated_at=datetime.now()
        )

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Discount pipeline failed: {str(e)}")

# ==================== REVIEW ANALYSIS ENDPOINT ====================
@app.post("/api/v1/reviews/analyze", response_model=ReviewAnalysisResponse)
async def analyze_review(
        request: ReviewAnalysisRequest,
        api_key: str = Depends(verify_api_key)
):
    """Analyze review sentiment with Nonsense Filtering & Dynamic Confidence"""

    try:
        text_lower = request.review_text.lower()
        tokens = word_tokenize(text_lower)
        
        # nonsense check 
        # Logic: If < 50% of the words are real English words, it's probably nonsense.
        meaningful_words = [w for w in tokens if w.isalpha() and len(w) > 2]
        
        if not meaningful_words:
            valid_word_ratio = 0
        else:
            valid_count = sum(1 for w in meaningful_words if w in ml_resources['english_vocab'])
            valid_word_ratio = valid_count / len(meaningful_words)

        # Rejection Logic: If ratio is too low, return Low Confidence / Unapproved
        if len(meaningful_words) > 0 and valid_word_ratio < 0.4:
            return ReviewAnalysisResponse(
                review_id=request.review_id,
                sentiment_score=0.0,
                sentiment_type=SentimentType.NEUTRAL,
                keywords=[],
                is_approved=False,
                confidence=0.1, 
                analysis_notes="Flagged as potential gibberish/nonsense text."
            )

        # sentiment analysis using VADER
        scores = ml_resources['sia'].polarity_scores(request.review_text)
        compound_score = scores['compound']

        # Determine label
        if compound_score >= 0.05:
            sentiment_type = SentimentType.POSITIVE
        elif compound_score <= -0.05:
            sentiment_type = SentimentType.NEGATIVE
        else:
            sentiment_type = SentimentType.NEUTRAL

        # dynamic confidence calculation
        # Logic: The more intense the sentiment (closer to 1 or -1), the higher the confidence. 
        # Neutral scores (around 0) are less confident.
        confidence = 0.5 + (abs(compound_score) * 0.4)
        
        # Boost confidence if the Star Rating matches the Sentiment
        star_consistent = False
        if (request.star_rating >= 4 and sentiment_type == SentimentType.POSITIVE):
            star_consistent = True
        elif (request.star_rating <= 2 and sentiment_type == SentimentType.NEGATIVE):
            star_consistent = True
            
        if star_consistent:
            confidence = min(0.99, confidence + 0.1) 
            
        # keyword extraction (frequency-based)
        stop_words = set(stopwords.words('english'))
        filtered_words = [w for w in meaningful_words if w not in stop_words]
        keywords = [word for word, count in Counter(filtered_words).most_common(5)]

        # approval logic
        is_approved = (confidence > 0.6) and (not (sentiment_type == SentimentType.NEGATIVE and request.star_rating >= 4))

        return ReviewAnalysisResponse(
            review_id=request.review_id,
            sentiment_score=round(compound_score, 3),
            sentiment_type=sentiment_type,
            keywords=keywords,
            is_approved=is_approved,
            confidence=round(confidence, 2),
            analysis_notes=f"Valid English Ratio: {int(valid_word_ratio*100)}%"
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
