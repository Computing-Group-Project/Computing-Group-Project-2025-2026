# Demeter AI Service (v2)

Personalized food recommendations, smart discount generation, and review sentiment analysis for the Demeter Smart Cafeteria System.

## Setup
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python run.py                  # Starts on port 8001
```

## Testing
```bash
python -m pytest tests/ -v     # 49 tests
```

## API Key
Default: `demeter-ai-service-key-2024` (set via `DEMETER_AI_API_KEY` env var)

## Endpoints
- `GET /health` — Health check (no auth required)
- `POST /api/v1/recommendations` — Personalized food recommendations (KNN + time-based contextual)
- `POST /api/v1/discounts` — Smart discount generation (BOGO, combo, percentage — capped at 10%)
- `POST /api/v1/reviews/analyze` — Review sentiment analysis (VADER + keyword extraction)

All endpoints except `/health` require the `X-API-Key` header.
