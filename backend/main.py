from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from routers import log, meeting, sprint, blocker, goal, file, retro, growth, portfolio, auth
from core.database import engine, Base
from core.security import decode_token
import models.all_models  # noqa: F401 — registers all ORM models

# Create all tables (idempotent — safe to run on every startup)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Dev Life OS API",
    description="Backend API for the Dev Life OS platform",
    version="0.1.0",
)

# CORS — must be added before the auth middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Auth middleware ───────────────────────────────────────────────────────────

PUBLIC_PATHS = {"/", "/health", "/api/v1/auth/login", "/docs", "/openapi.json", "/redoc"}

@app.middleware("http")
async def auth_middleware(request: Request, call_next):
    if request.method == "OPTIONS" or request.url.path in PUBLIC_PATHS:
        return await call_next(request)

    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return JSONResponse(status_code=401, content={"detail": "Not authenticated"})

    try:
        decode_token(auth_header.removeprefix("Bearer ").strip())
    except Exception:
        return JSONResponse(status_code=401, content={"detail": "Invalid or expired token"})

    return await call_next(request)

# ── Routers ───────────────────────────────────────────────────────────────────

app.include_router(auth.router,       prefix="/api/v1")
app.include_router(log.router,        prefix="/api/v1")
app.include_router(meeting.router,    prefix="/api/v1")
app.include_router(sprint.router,     prefix="/api/v1")
app.include_router(blocker.router,    prefix="/api/v1")
app.include_router(goal.router,       prefix="/api/v1")
app.include_router(file.router,       prefix="/api/v1")
app.include_router(retro.router,      prefix="/api/v1")
app.include_router(growth.router,     prefix="/api/v1")
app.include_router(portfolio.router,  prefix="/api/v1")


@app.get("/")
def root():
    return {"status": "Dev Life OS API is running"}


@app.get("/health")
def health():
    return {"status": "ok"}
