import os

API_KEY = os.getenv("DEMETER_AI_API_KEY", "demeter-ai-service-key-2024")

CORS_ORIGINS = ["http://localhost:8080"]

RATE_LIMIT_RECOMMENDATIONS = "10/minute"
RATE_LIMIT_DISCOUNTS = "5/minute"
RATE_LIMIT_REVIEWS = "10/minute"

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
