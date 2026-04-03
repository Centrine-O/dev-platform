from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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


@app.get("/")
def root():
    return {"status": "Dev Life OS API is running"}


@app.get("/health")
def health():
    return {"status": "ok"}
