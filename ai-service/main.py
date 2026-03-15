"""
Demeter AI Service - Python FastAPI
AI service for recommendations, discounts, and review analysis
"""

from fastapi import FastAPI, HTTPException, Header, Depends,Request
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
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import os
import ssl

#global dictionary to safely hold all AI models in memory
ml_resources = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    #startup logic
    print("Starting up: Loading AI models into memory...")

    # --loading NLTK models--
    try:
        print("-> Checking NLTK resources...")
        try:
            nltk.data.find('sentiment/vader_lexicon.zip')
            nltk.data.find('tokenizers/punkt')
            nltk.data.find('tokenizers/punkt_tab')
            nltk.data.find('corpora/stopwords')
            nltk.data.find('corpora/words')
        except LookupError:
            print("-> Downloading missing NLTK resources...")
            # Workaround for macOS SSL certificate issues
            try:
                _create_unverified_https_context = ssl._create_unverified_context
            except AttributeError:
                pass
            else:
                ssl._create_default_https_context = _create_unverified_https_context
            nltk.download('vader_lexicon', quiet=True)
            nltk.download('punkt', quiet=True)
            nltk.download('punkt_tab', quiet=True)
            nltk.download('stopwords', quiet=True)
            nltk.download('words', quiet=True)
            
        #store the initialized NLP tools in the global dictionary
        ml_resources["english_vocab"] = set(w.lower() for w in nltk_words.words())
        ml_resources["sia"] = SentimentIntensityAnalyzer()
        print("NLTK Models successfully loaded!")
    except Exception as e:
        print(f"Warning: Could not load NLTK models: {e}")

    # --loading recommendation models--
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

    # --loading discount models--

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
            ml_resources["combo_rules"] = {}
            ml_resources["failing_items"] = {}
            ml_resources["bogo_rules"] = {}

    print("AI Service is fully booted and ready!")
    
    #serve the app
    yield 

    #shutdown logic
    print("Shutting down: Clearing ALL models from memory...")
    ml_resources.clear()

limiter = Limiter(key_func=get_remote_address)

#initialize FastAPI
app = FastAPI(
    title="Demeter AI Service",
    description="AI-powered recommendations, discounts, and review analysis",
    version="1.0.0",
    lifespan=lifespan
)

#CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],  #spring boot backend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

#API Key configuration using Environment Variables
#it falls back to the string if the environment variable is not set
API_KEY = os.getenv("DEMETER_AI_API_KEY", "demeter-ai-service-key-2024")

#security dependency
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
    COMBO = "COMBO"
    BOGO = "BOGO"
    FIXED_AMOUNT = "FIXED_AMOUNT"


class SentimentType(str, Enum):
    POSITIVE = "POSITIVE"
    NEUTRAL = "NEUTRAL"
    NEGATIVE = "NEGATIVE"


#request models

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


#response models
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
    associated_item_id: Optional[int] = None 
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


#health check 
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


#----------------recommendation endpoint------------------------------------- 
@app.post("/api/v1/recommendations", response_model=RecommendationResponse)
@limiter.limit("10/minute")  #10 requests per minute per IP
async def generate_recommendations(
        request: Request,
        payload: RecommendationRequest,
        api_key: str = Depends(verify_api_key)
):
    """Generate personalized and contextual food recommendations"""
    try:
        recommendations = []
        raw_item_suggestions = []
        
        #extract models from the lifespan dictionary
        user_matrix = ml_resources.get("user_item_matrix")
        knn = ml_resources.get("knn_model")
        time_rules = ml_resources.get("time_rules")
        canteen_map = ml_resources.get("item_canteen_map")

        #failsafe
        if user_matrix is None or knn is None:
            raise HTTPException(status_code=503, detail="AI models are currently unavailable.")
        
        if payload.context.lower() == "cart":
            if payload.cafeteria_id is None:
                raise HTTPException(
                    status_code=400, 
                    detail="You must provide a cafeteria_id when the context is 'cart'."
                )
            if payload.cafeteria_id not in [1, 2, 3]:
                raise HTTPException(
                    status_code=400, 
                    detail="Invalid cafeteria_id. Must be 1, 2, or 3."
                )

        #determine time bucket for contextual fallback
        hour = payload.current_time.hour
        if 6 <= hour < 11:
            time_bucket = 'Morning'
        elif 11 <= hour < 16:
            time_bucket = 'Lunch'
        else:
            time_bucket = 'Evening'

        #check if user is known 
        user_known = payload.user_id in user_matrix.index
        
        if user_known:
            #extract user's taste vector
            user_vector = user_matrix.loc[payload.user_id].values.reshape(1, -1)
            
            #find the 6 nearest neighbors 
            distances, indices = knn.kneighbors(user_vector)
            neighbor_indices = indices[0][1:] 
            
            #get the IDs of the neighbors and their purchase history
            neighbor_user_ids = user_matrix.index[neighbor_indices]
            neighbor_purchases = user_matrix.loc[neighbor_user_ids].sum(axis=0)
            
            #remove items the user has already bought
            user_purchases = user_matrix.loc[payload.user_id]
            items_already_bought = user_purchases[user_purchases > 0].index.tolist()
            new_suggestions = neighbor_purchases.drop(labels=items_already_bought)
            
            #sort by highest purchase count among neighbors
            top_new_items = new_suggestions.sort_values(ascending=False)
            
            #get the items that neighbors actually bought (count > 0)
            valid_knn_items = top_new_items[top_new_items > 0].index.tolist()
            
            for item in valid_knn_items:
                raw_item_suggestions.append({
                    "item_id": item,
                    "type": RecommendationType.PERSONALIZED,
                    "reason": "People with similar tastes loved this!"
                })

        #time-based fallback and backfill
        for item in time_rules[time_bucket]:
            # prevent suggesting duplicates
            if not any(d['item_id'] == item for d in raw_item_suggestions):
                raw_item_suggestions.append({
                    "item_id": item,
                    "type": RecommendationType.CONTEXTUAL,
                    "reason": f"Popular choice for {time_bucket}!"
                })

        #context filter (cart vs homepage)
        final_suggestions = []
        for suggestion in raw_item_suggestions:
            if len(final_suggestions) >= payload.limit:
                break
                
            item_id_str = str(suggestion["item_id"]) # JSON keys are strings
            item_cafeteria = canteen_map.get(item_id_str)
            
            #if request is from the cart page, return items from the current cafeteria
            if payload.context.lower() == "cart":
                if item_cafeteria == payload.cafeteria_id:
                    final_suggestions.append(suggestion)
            #if from the homepage, return anything
            else:
                final_suggestions.append(suggestion)

        #format the response
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

    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Recommendation pipeline failed: {str(e)}")

#---------------------discount generation endpoint----------------------------------
@app.post("/api/v1/discounts", response_model=DiscountResponse)
@limiter.limit("5/minute") #stricter limit bcz this is for the admin side
async def generate_discounts(
    request: Request,
    payload: DiscountRequest,
    api_key: str = Depends(verify_api_key)
):
    try:
        if payload.cafeteria_id is None or not (1 <= payload.cafeteria_id <= 3):
            raise HTTPException(status_code=400, detail="Invalid Cafeteria ID. Must be between 1 and 3.")
        
        cid = str(payload.cafeteria_id)
        combo_rules = ml_resources.get("combo_rules", {})
        failing_items = ml_resources.get("failing_items", {})
        bogo_rules = ml_resources.get("bogo_rules", {})
        
        proposed_discounts = []
        used_items = set()

        #process bogo (highest priority to clear stock)
        current_bogos = bogo_rules.get(cid, [])
        for bogo in current_bogos:
            if len(proposed_discounts) >= payload.limit: break
            buy_item = bogo["buy_item"]
            get_item = bogo["get_item"]
            bogo_type = bogo.get("bogo_type", "clearance")
            
            if buy_item not in used_items and get_item not in used_items:
                reason = "Buy one get one free to clear stock!" if bogo_type == "clearance" else "Buy a favorite, try something new for free!"
                
                proposed_discounts.append(ProposedDiscount(
                    discount_type=DiscountType.BOGO,
                    target_item_id=buy_item,
                    associated_item_id=get_item,
                    suggested_value=100.0, # 100% off the second item
                    reason=reason
                ))
                used_items.update([buy_item, get_item])

        #process combos
        current_cafeteria_combos = combo_rules.get(cid, [])
        for combo in current_cafeteria_combos:
            if len(proposed_discounts) >= payload.limit: break
            item_a, item_b = combo["item_a"], combo["item_b"]
            confidence = combo.get("confidence", 0.5)
            
            if item_a not in used_items and item_b not in used_items:
                #business logic: lower confidence - higher discount to encourage the pair 
                #formula: base 5% + up to 10% extra based on how weak the natural pairing is
                dynamic_discount = round(5.0 + ((1.0 - confidence) * 10.0), 1)
                
                proposed_discounts.append(ProposedDiscount(
                    discount_type=DiscountType.COMBO,
                    target_item_id=item_a,
                    associated_item_id=item_b,
                    suggested_value=dynamic_discount,
                    reason=f"Frequently bought together. Get {dynamic_discount}% off the bundle!"
                ))
                used_items.update([item_a, item_b])

        #process percentage (failing items)
        current_failing = failing_items.get(cid, [])
        
        for item_data in current_failing:
            if len(proposed_discounts) >= payload.limit: break
            
            #backward compatibility check just in case
            if isinstance(item_data, dict):
                item_id = item_data["item_id"]
                severity = item_data.get("severity", 0.5)
            else:
                item_id = item_data
                severity = 0.5

            if item_id not in used_items:
                #business logic: higher severity (worse sales) = higher discount
                #formula: base 10% + up to 25% extra based on severity score
                dynamic_discount = round(10.0 + (severity * 25.0), 1)
                
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

    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Discount pipeline failed: {str(e)}")

#-------------------------review analysis endpoint----------------------------------
@app.post("/api/v1/reviews/analyze", response_model=ReviewAnalysisResponse)
@limiter.limit("10/minute")
async def analyze_review(
        request: Request,
        payload: ReviewAnalysisRequest,
        api_key: str = Depends(verify_api_key)
):
    """Analyze review sentiment with Nonsense Filtering & Dynamic Confidence"""

    try:
        text_lower = payload.review_text.lower()
        tokens = word_tokenize(text_lower)
        
        #nonsense check 
        #logic: If < 50% of the words are real english words, its probably nonsense.
        meaningful_words = [w for w in tokens if w.isalpha() and len(w) > 2]
        
        if not meaningful_words:
            valid_word_ratio = 0
        else:
            valid_count = sum(1 for w in meaningful_words if w in ml_resources['english_vocab'])
            valid_word_ratio = valid_count / len(meaningful_words)

        #rejection logic: if ratio is too low, return low confidence / unapproved
        if len(meaningful_words) > 0 and valid_word_ratio < 0.4:
            return ReviewAnalysisResponse(
                review_id=payload.review_id,
                sentiment_score=0.0,
                sentiment_type=SentimentType.NEUTRAL,
                keywords=[],
                is_approved=False,
                confidence=0.1, 
                analysis_notes="Flagged as potential gibberish/nonsense text."
            )

        #sentiment analysis using VADER
        scores = ml_resources['sia'].polarity_scores(payload.review_text)
        compound_score = scores['compound']

        #determine label
        if compound_score >= 0.05:
            sentiment_type = SentimentType.POSITIVE
        elif compound_score <= -0.05:
            sentiment_type = SentimentType.NEGATIVE
        else:
            sentiment_type = SentimentType.NEUTRAL

        #dynamic confidence calculation
        #logic: the more intense the sentiment (closer to 1 or -1), the higher the confidence. 
        #neutral scores (around 0) are less confident.
        confidence = 0.5 + (abs(compound_score) * 0.4)
        
        #boost confidence if the star rating matches the sentiment
        star_consistent = False
        if (payload.star_rating >= 4 and sentiment_type == SentimentType.POSITIVE):
            star_consistent = True
        elif (payload.star_rating <= 2 and sentiment_type == SentimentType.NEGATIVE):
            star_consistent = True
            
        if star_consistent:
            confidence = min(0.99, confidence + 0.1) 
            
        #keyword extraction (frequency-based)
        stop_words = set(stopwords.words('english'))
        filtered_words = [w for w in meaningful_words if w not in stop_words]
        keywords = [word for word, count in Counter(filtered_words).most_common(5)]

        #approval logic
        is_approved = (confidence > 0.6) and (not (sentiment_type == SentimentType.NEGATIVE and payload.star_rating >= 4))

        return ReviewAnalysisResponse(
            review_id=payload.review_id,
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
