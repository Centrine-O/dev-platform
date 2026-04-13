import os
from fastapi import APIRouter, HTTPException, Depends

from schemas.auth import LoginRequest, TokenResponse
from core.security import verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest):
    app_username = os.getenv("APP_USERNAME", "centrine")
    app_hash     = os.getenv("APP_PASSWORD_HASH", "")

    if body.username != app_username or not verify_password(body.password, app_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(app_username)
    return TokenResponse(access_token=token, username=app_username)


@router.get("/me")
def me(username: str = Depends(get_current_user)):
    return {"username": username}
