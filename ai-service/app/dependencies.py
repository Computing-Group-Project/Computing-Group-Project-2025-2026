import hmac

from fastapi import Header, HTTPException
from slowapi import Limiter
from slowapi.util import get_remote_address

from .config import API_KEY

limiter = Limiter(key_func=get_remote_address)


async def verify_api_key(x_api_key: str = Header(...)):
    """Validate the API key from request headers using constant-time comparison."""
    if not hmac.compare_digest(x_api_key.encode(), API_KEY.encode()):
        raise HTTPException(status_code=401, detail="Invalid API Key")
    return x_api_key
