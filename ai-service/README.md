# Demeter AI Service

## Setup
```bash
# Install dependencies
pip install -r requirements.txt

# Run the service
python main.py
```

Service will run on `http://localhost:8001`

## API Key
Default: `demeter-ai-service-key-2024`

## Endpoints
- `POST /api/v1/recommendations` - Generate recommendations
- `POST /api/v1/discounts/generate` - Generate discount suggestions
- `POST /api/v1/reviews/analyze` - Analyze review sentiment