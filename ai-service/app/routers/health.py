from datetime import datetime

from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def root():
    return {
        "service": "Demeter AI Service",
        "status": "running",
        "version": "1.0.0"
    }


@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    }
