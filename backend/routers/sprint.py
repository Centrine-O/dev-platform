from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from core.database import get_db
from models.all_models import Sprint as SprintModel, Story as StoryModel
from schemas.sprint import StoryCreate, StoryStatusUpdate, StoryResponse, SprintResponse

router = APIRouter(prefix="/sprint", tags=["Sprint"])


@router.get("/", response_model=SprintResponse)
def get_sprint(db: Session = Depends(get_db)):
    sprint = db.query(SprintModel).order_by(SprintModel.id.desc()).first()
    if not sprint:
        raise HTTPException(status_code=404, detail="No sprint found")

    stories = db.query(StoryModel).filter(StoryModel.sprint_id == sprint.id).all()
    total = sum(s.points for s in stories)
    done  = sum(s.points for s in stories if s.status == "done")

    days_remaining = 4  # static until we add date logic
    capacity_pct   = 80

    return SprintResponse(
        id=sprint.id,
        name=sprint.name,
        goal=sprint.goal,
        start_date=sprint.start_date,
        end_date=sprint.end_date,
        total_points=total,
        done_points=done,
        days_remaining=days_remaining,
        capacity_pct=capacity_pct,
    )


@router.get("/stories", response_model=List[StoryResponse])
def get_stories(status: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(StoryModel)
    if status:
        q = q.filter(StoryModel.status == status)
    return q.all()


@router.get("/stories/{story_id}", response_model=StoryResponse)
def get_story(story_id: int, db: Session = Depends(get_db)):
    story = db.get(StoryModel, story_id)
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    return story


@router.post("/stories", response_model=StoryResponse, status_code=201)
def create_story(body: StoryCreate, db: Session = Depends(get_db)):
    story = StoryModel(**body.model_dump())
    db.add(story)
    db.commit()
    db.refresh(story)
    return story


@router.patch("/stories/{story_id}", response_model=StoryResponse)
def update_story_status(story_id: int, body: StoryStatusUpdate, db: Session = Depends(get_db)):
    story = db.get(StoryModel, story_id)
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    story.status = body.status
    db.commit()
    db.refresh(story)
    return story


@router.delete("/stories/{story_id}", status_code=204)
def delete_story(story_id: int, db: Session = Depends(get_db)):
    story = db.get(StoryModel, story_id)
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    db.delete(story)
    db.commit()
