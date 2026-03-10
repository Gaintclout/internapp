# app/routers/vscode_token.py
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["vscode"])

class VSCodeToken(BaseModel):
    token: str

@router.post("/vscode-token")
def receive_vscode_token(data: VSCodeToken):
    print("VS CODE TOKEN RECEIVED:", data.token)
    return {"message": "Token received successfully"}
