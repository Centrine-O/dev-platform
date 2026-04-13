from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import log, meeting, sprint, blocker, goal, file, retro, growth, portfolio

app = FastAPI(
    title="Dev Life OS API",
    description="Backend API for the Dev Life OS platform",
    version="0.1.0",
)

# Allow the Next.js frontend to talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(log.router,     prefix="/api/v1")
app.include_router(meeting.router, prefix="/api/v1")
app.include_router(sprint.router,  prefix="/api/v1")
app.include_router(blocker.router, prefix="/api/v1")
app.include_router(goal.router,   prefix="/api/v1")
app.include_router(file.router,   prefix="/api/v1")
app.include_router(retro.router,      prefix="/api/v1")
app.include_router(growth.router,     prefix="/api/v1")
app.include_router(portfolio.router,  prefix="/api/v1")


@app.get("/")
def root():
    return {"status": "Dev Life OS API is running"}


@app.get("/health")
def health():
    return {"status": "ok"}
