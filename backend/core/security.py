import os
import bcrypt
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

SECRET_KEY   = os.getenv("JWT_SECRET",       "change-me-in-production")
ALGORITHM    = "HS256"
EXPIRE_HOURS = int(os.getenv("JWT_EXPIRE_HOURS", "168"))  # 7 days

bearer_scheme = HTTPBearer(auto_error=False)


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode(), hashed.encode())


def hash_password(plain: str) -> str:
    return bcrypt.hashpw(plain.encode(), bcrypt.gensalt(12)).decode()


def create_access_token(username: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(hours=EXPIRE_HOURS)
    return jwt.encode({"sub": username, "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> str:
    """Returns username or raises HTTPException."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if not username:
            raise ValueError
        return username
    except (JWTError, ValueError):
        raise HTTPException(status_code=401, detail="Invalid or expired token")


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(bearer_scheme),
) -> str:
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return decode_token(credentials.credentials)
