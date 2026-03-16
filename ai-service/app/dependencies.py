from fastapi import Header, HTTPException
from slowapi import Limiter
from slowapi.util import get_remote_address

from .config import API_KEY

# Shared rate limiter instance — used by routers and registered on the app
limiter = Limiter(key_func=get_remote_address)


async def verify_api_key(x_api_key: str = Header(...)):
    """Validate the API key from request headers."""
    if x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API Key")
    return x_api_key
