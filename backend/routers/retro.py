from fastapi import APIRouter, HTTPException
from typing import List, Optional
from datetime import datetime

from schemas.retro import RetroCardCreate, RetroCardResponse

router = APIRouter(prefix="/retros", tags=["Retros"])

_cards: List[dict] = [
    {
        "id": 1,
        "text": "Team adapted quickly to daily standups — no resistance at all.",
        "column": "went-well",
        "sprint": "Sprint 1",
        "created_at": datetime(2025, 4, 1, 10, 0),
    },
    {
        "id": 2,
        "text": "Clear sprint goal from day one, no scope confusion mid-sprint.",
        "column": "went-well",
        "sprint": "Sprint 1",
        "created_at": datetime(2025, 4, 1, 10, 1),
    },
    {
        "id": 3,
        "text": "Strong collaboration between front and back-end dev.",
        "column": "went-well",
        "sprint": "Sprint 1",
        "created_at": datetime(2025, 4, 1, 10, 2),
    },
    {
        "id": 4,
        "text": "Blockers surfaced faster in week 2 than week 1.",
        "column": "went-well",
        "sprint": "Sprint 1",
        "created_at": datetime(2025, 4, 1, 10, 3),
    },
    {
        "id": 5,
        "text": "Blockers not raised until they were already causing delays.",
        "column": "improve",
        "sprint": "Sprint 1",
        "created_at": datetime(2025, 4, 1, 10, 4),
    },
    {
        "id": 6,
        "text": "Backlog not fully refined before sprint start.",
        "column": "improve",
        "sprint": "Sprint 1",
        "created_at": datetime(2025, 4, 1, 10, 5),
    },
    {
        "id": 7,
        "text": "Estimation variance too high — needs calibration.",
        "column": "improve",
        "sprint": "Sprint 1",
        "created_at": datetime(2025, 4, 1, 10, 6),
    },
    {
        "id": 8,
        "text": "Mid-sprint PO communication was patchy.",
        "column": "improve",
        "sprint": "Sprint 1",
        "created_at": datetime(2025, 4, 1, 10, 7),
    },
    {
        "id": 9,
        "text": "Blockers flagged in standup — not after the meeting ends.",
        "column": "actions",
        "sprint": "Sprint 1",
        "created_at": datetime(2025, 4, 1, 10, 8),
    },
    {
        "id": 10,
        "text": "Refinement session midway through sprint — locked in calendar.",
        "column": "actions",
        "sprint": "Sprint 1",
        "created_at": datetime(2025, 4, 1, 10, 9),
    },
    {
        "id": 11,
        "text": "Planning poker for all stories above 3 points.",
        "column": "actions",
        "sprint": "Sprint 1",
        "created_at": datetime(2025, 4, 1, 10, 10),
    },
    {
        "id": 12,
        "text": "Weekly async update to PO via shared doc.",
        "column": "actions",
        "sprint": "Sprint 1",
        "created_at": datetime(2025, 4, 1, 10, 11),
    },
]
_next_id = 13


@router.get("/", response_model=List[RetroCardResponse])
def get_cards(sprint: Optional[str] = None, column: Optional[str] = None):
    """Return all retro cards. Filter by ?sprint= and/or ?column="""
    result = _cards
    if sprint:
        result = [c for c in result if c["sprint"] == sprint]
    if column:
        result = [c for c in result if c["column"] == column]
    return sorted(result, key=lambda c: c["created_at"])


@router.post("/", response_model=RetroCardResponse, status_code=201)
def create_card(body: RetroCardCreate):
    """Add a new retro card."""
    global _next_id
    card = {
        "id": _next_id,
        **body.model_dump(),
        "created_at": datetime.now(),
    }
    _cards.append(card)
    _next_id += 1
    return card


@router.delete("/{card_id}", status_code=204)
def delete_card(card_id: int):
    """Delete a retro card."""
    global _cards
    before = len(_cards)
    _cards = [c for c in _cards if c["id"] != card_id]
    if len(_cards) == before:
        raise HTTPException(status_code=404, detail="Card not found")
