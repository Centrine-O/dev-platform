from fastapi import APIRouter, HTTPException
from typing import List
from datetime import datetime

from schemas.log import LogEntryCreate, LogEntryResponse

router = APIRouter(prefix="/log", tags=["Daily Log"])

# In-memory store — will be replaced with a database later
_entries: List[dict] = [
    {
        "id": 1,
        "title": "Daily standup — all 5 attended, 2 blockers surfaced",
        "type": "Scrum ceremony",
        "duration": "15 min",
        "tags": "#standup #sprint1",
        "notes": "",
        "created_at": datetime(2025, 4, 1, 9, 0),
    },
    {
        "id": 2,
        "title": "Auth API integration — POST /login connected, token handling implemented",
        "type": "Dev work",
        "duration": "2h",
        "tags": "#backend #auth #sprint1",
        "notes": "Used JWT. Refresh token flow still to do.",
        "created_at": datetime(2025, 4, 1, 10, 0),
    },
    {
        "id": 3,
        "title": "Backlog refinement — 8 stories groomed for Sprint 2",
        "type": "Scrum ceremony",
        "duration": "60 min",
        "tags": "#refinement #sprint2",
        "notes": "",
        "created_at": datetime(2025, 4, 1, 13, 0),
    },
]
_next_id = 4


@router.get("/", response_model=List[LogEntryResponse])
def get_all_entries():
    """Return all log entries, newest first."""
    return sorted(_entries, key=lambda e: e["created_at"], reverse=True)


@router.get("/{entry_id}", response_model=LogEntryResponse)
def get_entry(entry_id: int):
    """Return a single log entry by id."""
    for entry in _entries:
        if entry["id"] == entry_id:
            return entry
    raise HTTPException(status_code=404, detail="Log entry not found")


@router.post("/", response_model=LogEntryResponse, status_code=201)
def create_entry(body: LogEntryCreate):
    """Create a new log entry."""
    global _next_id
    entry = {
        "id": _next_id,
        **body.model_dump(),
        "created_at": datetime.now(),
    }
    _entries.append(entry)
    _next_id += 1
    return entry


@router.delete("/{entry_id}", status_code=204)
def delete_entry(entry_id: int):
    """Delete a log entry by id."""
    global _entries
    before = len(_entries)
    _entries = [e for e in _entries if e["id"] != entry_id]
    if len(_entries) == before:
        raise HTTPException(status_code=404, detail="Log entry not found")
