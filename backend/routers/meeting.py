from fastapi import APIRouter, HTTPException
from typing import List
from datetime import datetime

from schemas.meeting import MeetingCreate, MeetingResponse

router = APIRouter(prefix="/meetings", tags=["Meetings"])

_meetings: List[dict] = [
    {
        "id": 1,
        "title": "Sprint 1 planning",
        "date": "28 Mar 2025",
        "duration": "60 min",
        "type": "Sprint planning",
        "attendees": "All team",
        "key_points": "Agreed sprint goal around auth module. 16 story points committed. Definition of Done reviewed. PO confirmed acceptance criteria for top 5 stories.",
        "action_items": "Centrine to share sprint board by EOD.",
        "created_at": datetime(2025, 3, 28, 10, 0),
    },
    {
        "id": 2,
        "title": "Kickoff with Product Owner",
        "date": "27 Mar 2025",
        "duration": "45 min",
        "type": "Stakeholder",
        "attendees": "Centrine, PO",
        "key_points": "Q2 roadmap priorities aligned. PO availability confirmed for Wednesday refinements. Backlog grooming process agreed.",
        "action_items": "PO to review backlog by Friday.",
        "created_at": datetime(2025, 3, 27, 14, 0),
    },
    {
        "id": 3,
        "title": "Backlog refinement — session 1",
        "date": "1 Apr 2025",
        "duration": "60 min",
        "type": "Backlog refinement",
        "attendees": "All team",
        "key_points": "Sprint 2 backlog groomed. 8 stories estimated. 3 stories split. Payment flow acceptance criteria updated.",
        "action_items": "James to spike on payment gateway by Wed.",
        "created_at": datetime(2025, 4, 1, 13, 0),
    },
]
_next_id = 4


@router.get("/", response_model=List[MeetingResponse])
def get_all_meetings():
    """Return all meeting minutes, newest first."""
    return sorted(_meetings, key=lambda m: m["created_at"], reverse=True)


@router.get("/{meeting_id}", response_model=MeetingResponse)
def get_meeting(meeting_id: int):
    """Return a single meeting by id."""
    for m in _meetings:
        if m["id"] == meeting_id:
            return m
    raise HTTPException(status_code=404, detail="Meeting not found")


@router.post("/", response_model=MeetingResponse, status_code=201)
def create_meeting(body: MeetingCreate):
    """Save new meeting minutes."""
    global _next_id
    meeting = {
        "id": _next_id,
        **body.model_dump(),
        "created_at": datetime.now(),
    }
    _meetings.append(meeting)
    _next_id += 1
    return meeting


@router.delete("/{meeting_id}", status_code=204)
def delete_meeting(meeting_id: int):
    """Delete a meeting record."""
    global _meetings
    before = len(_meetings)
    _meetings = [m for m in _meetings if m["id"] != meeting_id]
    if len(_meetings) == before:
        raise HTTPException(status_code=404, detail="Meeting not found")
