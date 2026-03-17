# AI Service — What Changed and How It Works

This document explains the restructuring and data changes made to the Demeter AI Service. Read this to understand the new codebase layout, why these changes were made, and how to work with the service going forward.

---

## Table of Contents

1. [Summary of Changes](#summary-of-changes)
2. [Why We Restructured](#why-we-restructured)
3. [New Directory Structure](#new-directory-structure)
4. [How the Modules Map to the Old Code](#how-the-modules-map-to-the-old-code)
5. [Module-by-Module Walkthrough](#module-by-module-walkthrough)
6. [Training Data Regeneration](#training-data-regeneration)
7. [How to Run, Test, and Deploy](#how-to-run-test-and-deploy)
8. [How to Retrain Models](#how-to-retrain-models)
9. [What Stayed the Same](#what-stayed-the-same)

---

## Summary of Changes

Three things changed:

1. **Restructured the codebase** — The monolithic `main.py` (565 lines, everything in one file) was split into 12 focused modules across `app/models/`, `app/routers/`, and `app/services/`. This mirrors the backend's `controller → service → model` layered pattern.

2. **Moved data files into `data/`** — All model artifacts (`.pkl` files) and JSON rule files that were scattered in the project root now live in a dedicated `data/` directory.

3. **Regenerated training data** — The CSVs had a 10x price discrepancy with `data.sql` (they used LKR values while the database uses Gold Krakens). A new `regenerate_and_retrain.py` script was created to keep training data in sync with the seed data, and all models were retrained with correct prices.

**Nothing changed in the API itself.** All endpoints, request/response schemas, business logic, and test assertions are identical. The 49 tests pass without modification.

---

## Why We Restructured

The old layout had a single `main.py` containing:
- 4 enums
- 6 Pydantic models (3 request, 3 response, plus sub-models)
- App configuration (CORS, rate limiting, API key)
- 3 endpoint handlers with full business logic inline
- The lifespan function loading all ML models

This made it difficult to:
- Find where a specific piece of logic lives
- Modify one endpoint without scrolling past unrelated code
- Understand the separation between "what data looks like" vs "how we process it" vs "what the API exposes"

The new structure matches the backend's organization (`controller/` → `service/` → `model/`) so the entire team can navigate both codebases using the same mental model.

---

## New Directory Structure

```
ai-service/
├── app/                              # Application package
│   ├── __init__.py
│   ├── main.py                       # App factory, lifespan, middleware, router registration
│   ├── config.py                     # API key, CORS origins, rate limit constants
│   ├── dependencies.py               # FastAPI dependencies (API key verification)
│   │
│   ├── models/                       # Pydantic schemas (= backend's dto/)
│   │   ├── __init__.py               # Re-exports all models for convenience
│   │   ├── enums.py                  # RecommendationType, DiscountType, SentimentType
│   │   ├── recommendations.py        # RecommendationRequest, RecommendationItem, RecommendationResponse
│   │   ├── discounts.py              # DiscountRequest, ProposedDiscount, DiscountResponse
│   │   └── reviews.py               # ReviewAnalysisRequest, ReviewAnalysisResponse
│   │
│   ├── routers/                      # Endpoint definitions (= backend's controller/)
│   │   ├── __init__.py
│   │   ├── health.py                 # GET /, GET /health
│   │   ├── recommendations.py        # POST /api/v1/recommendations
│   │   ├── discounts.py              # POST /api/v1/discounts
│   │   └── reviews.py               # POST /api/v1/reviews/analyze
│   │
│   └── services/                     # Business logic (= backend's service/)
│       ├── __init__.py
│       ├── model_loader.py           # Loads/unloads all ML models at startup/shutdown
│       ├── recommendation_service.py # KNN + time-based recommendation logic
│       ├── discount_service.py       # BOGO, combo, percentage discount generation
│       └── review_service.py         # VADER sentiment + nonsense detection + keyword extraction
│
├── data/                             # Model artifacts (loaded at runtime)
│   ├── knn_model.pkl                 # Trained KNN model (k=6, cosine similarity)
│   ├── user_item_matrix.pkl          # Normalized user-item purchase matrix (pandas DataFrame)
│   ├── item_canteen_map.json         # Maps item_id → cafeteria_id (all 54 items)
│   ├── time_rules.json               # Top 10 items per time bucket (Morning/Lunch/Evening)
│   ├── combo_rules.json              # Apriori association rules per cafeteria
│   ├── failing_items.json            # Low-sales items with severity scores per cafeteria
│   └── bogo_rules.json              # BOGO offers (clearance + cross-sell) per cafeteria
│
├── tests/                            # Test suite
│   ├── __init__.py
│   └── test_endpoints.py            # 49 tests across 6 test classes
│
├── training/                         # Training pipeline (not needed at runtime)
│   ├── orders.csv                    # Synthetic order data (generated from data.sql logic)
│   ├── order_items.csv               # Synthetic order items with correct GK prices
│   ├── model_trainning.ipynb         # Jupyter notebook: KNN training + time rules + item map
│   ├── discount_training.ipynb       # Jupyter notebook: apriori + failing items + BOGO rules
│   └── regenerate_and_retrain.py     # Script to regenerate CSVs + retrain all models
│
├── run.py                            # Entry point: python run.py
├── Dockerfile
├── requirements.txt
└── README.md
```

---

## How the Modules Map to the Old Code

| Old `main.py` lines | What it was | New location |
|---|---|---|
| Lines 1-28 | Imports | Distributed across each module that needs them |
| Lines 30-108 | `lifespan()` — model loading | `app/services/model_loader.py` |
| Lines 110-140 | App init, CORS, rate limiter, API key | `app/main.py` + `app/config.py` + `app/dependencies.py` |
| Lines 143-161 | Enums | `app/models/enums.py` |
| Lines 164-222 | Pydantic request/response models | `app/models/recommendations.py`, `discounts.py`, `reviews.py` |
| Lines 224-244 | Health endpoints | `app/routers/health.py` |
| Lines 247-375 | Recommendations endpoint + logic | `app/routers/recommendations.py` + `app/services/recommendation_service.py` |
| Lines 377-477 | Discounts endpoint + logic | `app/routers/discounts.py` + `app/services/discount_service.py` |
| Lines 479-561 | Reviews endpoint + logic | `app/routers/reviews.py` + `app/services/review_service.py` |
| Lines 563-564 | `uvicorn.run()` | `run.py` |

---

## Module-by-Module Walkthrough

### `app/main.py` — The Application Factory

Creates the FastAPI app, wires up middleware, and registers routers. Think of this as the "orchestrator" — it doesn't contain any business logic, just configuration.

```python
app = create_app()  # Called once at import time
```

The `lifespan` context manager calls `load_all()` on startup and `unload_all()` on shutdown. All four routers are registered via `app.include_router()`.

### `app/config.py` — Configuration Constants

All configurable values in one place: API key (from env var), CORS origins, rate limit strings, and the `DATA_DIR` path. If you need to change a rate limit or add a new CORS origin, this is the only file to touch.

### `app/dependencies.py` — Security

Contains the `verify_api_key` dependency injected into every protected endpoint via `Depends(verify_api_key)`. Reads the expected key from `config.py`.

### `app/models/` — Data Schemas

Pure Pydantic models. No logic, no imports from services. Each file defines the request and response shapes for one domain:

- `enums.py` — `RecommendationType`, `DiscountType`, `SentimentType`
- `recommendations.py` — `RecommendationRequest` → `RecommendationResponse` (containing `RecommendationItem` list)
- `discounts.py` — `DiscountRequest` → `DiscountResponse` (containing `ProposedDiscount` list)
- `reviews.py` — `ReviewAnalysisRequest` → `ReviewAnalysisResponse`

### `app/routers/` — Endpoint Handlers

Thin wrappers that define the HTTP contract (method, path, response model, rate limit) and delegate to services. Error handling (try/except with HTTPException passthrough) lives here.

Each router is a `fastapi.APIRouter` with a prefix (`/api/v1`) and tags for Swagger grouping.

### `app/services/` — Business Logic

Where the actual work happens:

- **`model_loader.py`** — Manages the `ml_resources` dictionary (global in-memory model store). Three loader functions (`load_nltk_resources`, `load_recommendation_models`, `load_discount_models`) are called by `load_all()` at startup. Every other service reads from `ml_resources`.

- **`recommendation_service.py`** — KNN collaborative filtering for known users, time-bucket contextual fallback for unknown users, cafeteria filtering for cart context. Returns up to `limit` items with descending confidence scores.

- **`discount_service.py`** — Processes three discount types in priority order: BOGO (stock clearance) → COMBO (frequently bought together, dynamic discount based on confidence) → PERCENTAGE (failing items, discount based on severity score). Deduplicates items across all types.

- **`review_service.py`** — VADER sentiment scoring, English word ratio check for nonsense detection, star-sentiment consistency boost, keyword extraction via frequency analysis, and approval logic.

### `data/` — Model Artifacts

These files are loaded into memory at startup by `model_loader.py` and never modified at runtime:

| File | Format | What it contains |
|---|---|---|
| `knn_model.pkl` | scikit-learn KNN | Trained with k=6, cosine similarity, brute-force algorithm |
| `user_item_matrix.pkl` | pandas DataFrame | Min-max normalized purchase counts, rows=users, cols=items |
| `item_canteen_map.json` | `{"item_id": cafeteria_id}` | Maps all 54 menu items to their cafeteria (1, 2, or 3) |
| `time_rules.json` | `{"Morning": [...], ...}` | Top 10 most ordered items per time bucket |
| `combo_rules.json` | Per-cafeteria association rules | Item pairs with confidence and lift scores (from apriori) |
| `failing_items.json` | Per-cafeteria low-sales items | Items below 25th percentile with severity scores |
| `bogo_rules.json` | Per-cafeteria BOGO offers | Clearance (buy X get X) and cross-sell (buy popular get failing) |

---

## Training Data Regeneration

### The Problem

The old CSVs (`training/orders.csv` and `training/order_items.csv`) had prices that were **10x higher** than what's in `database/data.sql`. For example:

| Item | CSV price (old) | data.sql price | Unit |
|---|---|---|---|
| Soraka Star Salad (ID 1) | 1200.0 | 120.00 | GK |
| Lee Sin Fried Rice (ID 16) | 1100.0 | 110.00 | GK |
| Dragon Chilli Paste (ID 17) | 150.0 | 15.00 | GK |

The CSVs were using LKR values (1 GK = 10 LKR) while the database stores Gold Krakens. While this didn't affect the KNN model (which uses purchase counts, not prices), it was an inconsistency that would cause confusion and could affect future price-aware features.

### The Fix

A new script `training/regenerate_and_retrain.py` was created that:

1. **Generates synthetic orders** matching the exact logic of the `GenerateData` stored procedure in `data.sql`:
   - 2000 orders across 56 students (IDs 1-60, excluding staff 23/43/45/48)
   - Three user clusters: Healthy (1-20), Fast Food (21-40), Morning (41-60)
   - Each cluster orders from their preferred category per cafeteria
   - Cluster B gets combo pairs (16+17, 34+35, 52+53) with 85% probability
   - Realistic timestamps based on cluster (morning users order 6-11, etc.)
   - **Correct GK prices** from `data.sql`

2. **Retrains all models**:
   - KNN model + user-item matrix → `data/knn_model.pkl`, `data/user_item_matrix.pkl`
   - Item-canteen mapping → `data/item_canteen_map.json`
   - Time-based rules → `data/time_rules.json`
   - If `mlxtend` is installed: combo rules, failing items, BOGO rules → `data/*.json`

### Menu Item Reference

For convenience, here's the full item-to-cafeteria mapping with GK prices (from `data.sql`):

**Canteen 1 — The Last Drop** (IDs 1-18):
- Healthy (1-5): Soraka Star Salad (120), Ionian Spirit Juice (45), Xayah Feather Wrap (85), Karma Green Bowl (110), Irelia Blade Greens (95)
- Fast Food (6-10): Darius Dunk Burger (150), Noxian Coke (30), Draven Spinning Fries (60), Kled Spicy Tacos (130), Sion Smash Burger (160)
- Breakfast (11-15): Piltover Coffee (40), Caitlyn Cupcake (55), Jayce Hammer Sandwich (90), Yordle Buns (45), Progress Day Toast (60)
- Combo: Lee Sin Fried Rice (110) + Dragon Chilli Paste (15) — 85% co-purchase
- Failing: Teemo Veggie Burger (125)

**Canteen 2 — Hex Core Cafe** (IDs 19-36):
- Healthy (19-23): Hex Core Salad (105), Zaunite Purified Water (40), Ekko Time-Wrap (90), Chem-Baron Veggie Bowl (115), Janna Breezy Greens (95)
- Fast Food (24-28): Evolution Burger (140), Shimmer Cola (35), Vi Punching Fries (65), Jinx Rocket Tacos (135), Urgot Grind Burger (170)
- Breakfast (29-33): Viktor Black Coffee (35), Heimerdinger Sweet Roll (50), Academy Breakfast Sandwich (95), Gearbox Buns (45), Inventor Toast (60)
- Combo: Zaun Street Noodles (105) + Spicy Shroom Skewer (20) — 85% co-purchase
- Failing: Stale Trench Cake (110)

**Canteen 3 — Skyline Sips** (IDs 37-54):
- Healthy (37-41): High-Altitude Green Bowl (130), Cloud Piercer Juice (50), Zephyr Wrap (85), Skyline Vegan Platter (140), Aero Salad (100)
- Fast Food (42-46): Progress Gate Slider (120), Hex-Energy Drink (45), Gilded Fries (70), Piltovan Fried Chicken (150), Council Smash Burger (180)
- Breakfast (47-51): Skyline Espresso (45), Golden Muffin (60), Aristocrat Croissant (75), Sun-Gate Buns (50), Elite Morning Toast (65)
- Combo: Premium Iced Latte (80) + Macaron Set (40) — 85% co-purchase
- Failing: Overpriced Tap Water (10)

---

## How to Run, Test, and Deploy

### Run Locally

```bash
cd ai-service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python run.py                    # Starts on http://localhost:8001
```

The app import path is now `app.main:app` (not `main:app`).

### Run Tests

```bash
cd ai-service
source venv/bin/activate
python -m pytest tests/ -v       # 49 tests
```

### Docker

```bash
docker build -t demeter-ai .
docker run -p 8001:8001 -e DEMETER_AI_API_KEY=your-key demeter-ai
```

The Dockerfile CMD is `uvicorn app.main:app --host 0.0.0.0 --port 8001`.

### CI

The GitHub Actions workflow runs: `cd ai-service && python -m pytest tests/test_endpoints.py -v`

---

## How to Retrain Models

If the menu items, prices, or user clusters change in `database/data.sql`, the AI models need to be retrained:

```bash
cd ai-service
source venv/bin/activate

# Optional: install mlxtend for discount rule generation
pip install mlxtend

# Regenerate CSVs from data.sql logic and retrain everything
cd training
python regenerate_and_retrain.py
```

This will:
1. Generate fresh `orders.csv` and `order_items.csv` in `training/`
2. Retrain KNN model and save to `data/knn_model.pkl`
3. Regenerate `data/user_item_matrix.pkl`, `data/item_canteen_map.json`, `data/time_rules.json`
4. If mlxtend is installed: regenerate `data/combo_rules.json`, `data/failing_items.json`, `data/bogo_rules.json`

**Important:** If you add new menu items to `data.sql`, you must also update the `MENU_ITEMS` dictionary at the top of `regenerate_and_retrain.py` to include the new items with their cafeteria and price. Similarly, update `CLUSTER_ITEMS` and `COMBO_PAIRS` if the cluster ranges or combo pairings change.

After retraining, run the tests to verify nothing broke: `python -m pytest tests/ -v`

---

## What Stayed the Same

- **All API endpoints** — Same paths, same methods, same request/response schemas
- **All business logic** — KNN recommendation algorithm, discount priority ordering, VADER sentiment analysis, nonsense detection, keyword extraction, approval logic
- **All 49 tests** — Identical assertions, just importing from `app.main` instead of `main`
- **Rate limiting** — Same limits (10/min recommendations, 5/min discounts, 10/min reviews)
- **API key authentication** — Same header (`X-API-Key`), same env var (`DEMETER_AI_API_KEY`)
- **Model artifacts** — Same pkl and json files, just moved to `data/` (and retrained with correct prices)
