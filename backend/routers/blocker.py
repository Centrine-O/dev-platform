from fastapi import APIRouter, HTTPException
from typing import List, Optional
from datetime import datetime

from schemas.blocker import BlockerCreate, BlockerResolve, BlockerResponse

router = APIRouter(prefix="/blockers", tags=["Blockers"])

_blockers: List[dict] = [
    {
        "id": 1,
        "title": "QA environment not provisioned — blocking entire testing pipeline",
        "severity": "High",
        "status": "active",
        "owner": "DevOps",
        "impact": "No testing possible until resolved.",
        "resolved_note": None,
        "created_at": datetime(2025, 3, 30, 9, 0),
        "resolved_at": None,
    },
    {
        "id": 2,
        "title": "PO unavailable for story clarification on payment flow",
        "severity": "Med",
        "status": "active",
        "owner": "Centrine",
        "impact": "Payment stories cannot be started.",
        "resolved_note": None,
        "created_at": datetime(2025, 3, 31, 10, 0),
        "resolved_at": None,
    },
    {
        "id": 3,
        "title": "DB access credentials missing for two devs",
        "severity": "Low",
        "status": "resolved",
        "owner": "Centrine",
        "impact": "Two devs could not run local DB.",
        "resolved_note": "Credentials shared via password manager.",
        "created_at": datetime(2025, 3, 27, 9, 0),
        "resolved_at": datetime(2025, 3, 29, 11, 0),
    },
    {
        "id": 4,
        "title": "Design files not finalised before sprint start",
        "severity": "Low",
        "status": "resolved",
        "owner": "Centrine",
        "impact": "UI stories had no source of truth on day 1.",
        "resolved_note": "Designer shared final Figma on sprint day 2.",
        "created_at": datetime(2025, 3, 28, 8, 0),
        "resolved_at": datetime(2025, 3, 29, 9, 0),
    },
]
_next_id = 5


@router.get("/", response_model=List[BlockerResponse])
def get_blockers(status: Optional[str] = None):
    """Return all blockers. Filter by ?status=active or ?status=resolved."""
    if status:
        return [b for b in _blockers if b["status"] == status]
    return sorted(_blockers, key=lambda b: b["created_at"], reverse=True)


@router.get("/{blocker_id}", response_model=BlockerResponse)
def get_blocker(blocker_id: int):
    """Return a single blocker by id."""
    for b in _blockers:
        if b["id"] == blocker_id:
            return b
    raise HTTPException(status_code=404, detail="Blocker not found")


@router.post("/", response_model=BlockerResponse, status_code=201)
def create_blocker(body: BlockerCreate):
    """Log a new blocker."""
    global _next_id
    blocker = {
        "id": _next_id,
        **body.model_dump(),
        "status": "active",
        "resolved_note": None,
        "created_at": datetime.now(),
        "resolved_at": None,
    }
    _blockers.append(blocker)
    _next_id += 1
    return blocker


@router.patch("/{blocker_id}/resolve", response_model=BlockerResponse)
def resolve_blocker(blocker_id: int, body: BlockerResolve):
    """Mark a blocker as resolved."""
    for b in _blockers:
        if b["id"] == blocker_id:
            if b["status"] == "resolved":
                raise HTTPException(status_code=400, detail="Blocker is already resolved")
            b["status"]        = "resolved"
            b["resolved_note"] = body.resolved_note
            b["resolved_at"]   = datetime.now()
            return b
    raise HTTPException(status_code=404, detail="Blocker not found")


@router.delete("/{blocker_id}", status_code=204)
def delete_blocker(blocker_id: int):
    """Delete a blocker record."""
    global _blockers
    before = len(_blockers)
    _blockers = [b for b in _blockers if b["id"] != blocker_id]
    if len(_blockers) == before:
        raise HTTPException(status_code=404, detail="Blocker not found")
