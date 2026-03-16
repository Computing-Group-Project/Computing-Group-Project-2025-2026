import os

# API key — falls back to default if env var not set
API_KEY = os.getenv("DEMETER_AI_API_KEY", "demeter-ai-service-key-2024")

# CORS origins
CORS_ORIGINS = ["http://localhost:8080"]

# Rate limiting
RATE_LIMIT_RECOMMENDATIONS = "10/minute"
RATE_LIMIT_DISCOUNTS = "5/minute"
RATE_LIMIT_REVIEWS = "10/minute"

# Data directory (relative to project root)
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
