from fastapi import APIRouter, HTTPException
from app.core.config import settings
import os

# We avoid instantiating an OpenAI client at import-time because some
# combinations of the `openai` package and `httpx` forward incompatible
# kwargs (e.g. 'proxies') and raise a TypeError during construction. Instead
# we create the client lazily when the endpoint is called and fall back to the
# legacy `openai` module if necessary.

try:
    # Keep a reference to the new OpenAI client class if available
    from openai import OpenAI as OpenAIClientClass  # type: ignore
except Exception:
    OpenAIClientClass = None


def get_client():
    """Return an OpenAI client object."""
    api_key = settings.OPENAI_API_KEY or os.getenv("OPENAI_API_KEY")
    if not api_key:
        return None

    # ensure env var is set for libraries that read from it
    os.environ.setdefault("OPENAI_API_KEY", api_key)

    try:
        import httpx
        http_client = httpx.Client()
        return OpenAIClientClass(http_client=http_client)
    except Exception:
        return None

router = APIRouter(prefix="/chatbot", tags=["chatbot"])

@router.post("/ask")
async def ask_chatbot(question: str):
    try:
        client = get_client()
        if client is None:
            raise HTTPException(status_code=500, detail="OpenAI API key not configured")
        
        # Use only new OpenAI API style (v1.0+)
        resp = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an AI mentor helping internship students with project guidance."},
                {"role": "user", "content": question},
            ],
        )
        return {"response": resp.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))