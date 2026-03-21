"""
Demeter AI Service — FastAPI application factory.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from .config import CORS_ORIGINS
from .dependencies import limiter
from .routers import health, recommendations, discounts, reviews
from .services.model_loader import load_all, unload_all


@asynccontextmanager
async def lifespan(app: FastAPI):
    load_all()
    yield
    unload_all()


def create_app() -> FastAPI:
    app = FastAPI(
        title="Demeter AI Service",
        description="AI-powered recommendations, discounts, and review analysis",
        version="1.0.0",
        lifespan=lifespan
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

    app.include_router(health.router)
    app.include_router(recommendations.router)
    app.include_router(discounts.router)
    app.include_router(reviews.router)

    return app


app = create_app()
