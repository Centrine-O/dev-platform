from fastapi import APIRouter, HTTPException
from typing import List

from schemas.sprint import (
    StoryCreate,
    StoryStatusUpdate,
    StoryResponse,
    SprintResponse,
)

router = APIRouter(prefix="/sprint", tags=["Sprint"])

# Current sprint metadata
_sprint = {
    "id": 1,
    "name": "Sprint 1",
    "goal": "Auth flow + user profile module. Testable build to QA by end of sprint.",
    "start_date": "1 Apr 2025",
    "end_date": "10 Apr 2025",
    "days_remaining": 4,
    "capacity_pct": 80,
}

_stories: List[dict] = [
    { "id": 1,  "title": "Password reset flow",           "points": 5, "assignee": "C", "status": "backlog" },
    { "id": 2,  "title": "Email notification service",    "points": 3, "assignee": "J", "status": "backlog" },
    { "id": 3,  "title": "API docs — auth endpoints",     "points": 2, "assignee": "C", "status": "backlog" },
    { "id": 4,  "title": "Auth module — API integration", "points": 8, "assignee": "C", "status": "inprogress" },
    { "id": 5,  "title": "User profile UI",               "points": 5, "assignee": "J", "status": "inprogress" },
    { "id": 6,  "title": "Profile data persistence",      "points": 5, "assignee": "A", "status": "inprogress" },
    { "id": 7,  "title": "Session management",            "points": 3, "assignee": "J", "status": "inprogress" },
    { "id": 8,  "title": "Login page UI",                 "points": 3, "assignee": "A", "status": "review" },
    { "id": 9,  "title": "Register page UI",              "points": 3, "assignee": "J", "status": "review" },
    { "id": 10, "title": "DB schema design",              "points": 5, "assignee": "C", "status": "done" },
    { "id": 11, "title": "CI/CD pipeline setup",          "points": 3, "assignee": "C", "status": "done" },
    { "id": 12, "title": "Project scaffolding",           "points": 2, "assignee": "J", "status": "done" },
    { "id": 13, "title": "Wireframes approved",           "points": 1, "assignee": "A", "status": "done" },
    { "id": 14, "title": "Env setup for all devs",        "points": 2, "assignee": "C", "status": "done" },
]
_next_id = 15


def _calc_points(stories: List[dict]) -> dict:
    total = sum(s["points"] for s in stories)
    done  = sum(s["points"] for s in stories if s["status"] == "done")
    return {"total_points": total, "done_points": done}


@router.get("/", response_model=SprintResponse)
def get_sprint():
    """Return current sprint metadata with point totals."""
    return {**_sprint, **_calc_points(_stories)}


@router.get("/stories", response_model=List[StoryResponse])
def get_stories(status: str = None):
    """Return all stories. Optionally filter by status."""
    if status:
        return [s for s in _stories if s["status"] == status]
    return _stories


@router.get("/stories/{story_id}", response_model=StoryResponse)
def get_story(story_id: int):
    """Return a single story by id."""
    for s in _stories:
        if s["id"] == story_id:
            return s
    raise HTTPException(status_code=404, detail="Story not found")


@router.post("/stories", response_model=StoryResponse, status_code=201)
def create_story(body: StoryCreate):
    """Add a new story to the board."""
    global _next_id
    story = {"id": _next_id, **body.model_dump()}
    _stories.append(story)
    _next_id += 1
    return story


@router.patch("/stories/{story_id}", response_model=StoryResponse)
def update_story_status(story_id: int, body: StoryStatusUpdate):
    """Move a story to a different column."""
    for s in _stories:
        if s["id"] == story_id:
            s["status"] = body.status
            return s
    raise HTTPException(status_code=404, detail="Story not found")


@router.delete("/stories/{story_id}", status_code=204)
def delete_story(story_id: int):
    """Remove a story from the board."""
    global _stories
    before = len(_stories)
    _stories = [s for s in _stories if s["id"] != story_id]
    if len(_stories) == before:
        raise HTTPException(status_code=404, detail="Story not found")
