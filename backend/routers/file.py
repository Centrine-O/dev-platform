from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse as FastAPIFileResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from pathlib import Path
import shutil

from core.database import get_db
from models.all_models import FileRecord
from schemas.file import FileCategory, FileResponse

router = APIRouter(prefix="/files", tags=["Files"])

UPLOAD_DIR = Path(__file__).parent.parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)


def _size_label(size_bytes: int) -> str:
    if size_bytes >= 1_000_000:
        return f"{size_bytes / 1_000_000:.1f} MB"
    return f"{round(size_bytes / 1000)} KB"


@router.get("/", response_model=List[FileResponse])
def list_files(category: Optional[str] = None, project: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(FileRecord)
    if category:
        q = q.filter(FileRecord.category == category)
    if project:
        q = q.filter(FileRecord.project == project)
    return q.order_by(FileRecord.uploaded_at.desc()).all()


@router.get("/{file_id}", response_model=FileResponse)
def get_file_meta(file_id: int, db: Session = Depends(get_db)):
    record = db.get(FileRecord, file_id)
    if not record:
        raise HTTPException(status_code=404, detail="File not found")
    return record


@router.get("/{file_id}/download")
def download_file(file_id: int, db: Session = Depends(get_db)):
    record = db.get(FileRecord, file_id)
    if not record:
        raise HTTPException(status_code=404, detail="File not found")
    path = UPLOAD_DIR / record.filename
    if not path.exists():
        raise HTTPException(status_code=404, detail="File not found on disk")
    return FastAPIFileResponse(path=str(path), filename=record.filename)


@router.post("/upload", response_model=FileResponse, status_code=201)
async def upload_file(
    file:     UploadFile = File(...),
    category: FileCategory = Form(FileCategory.other),
    project:  Optional[str] = Form(None),
    notes:    Optional[str] = Form(None),
    db:       Session = Depends(get_db),
):
    dest = UPLOAD_DIR / file.filename
    with dest.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    size_bytes = dest.stat().st_size
    ext = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else "bin"

    record = FileRecord(
        filename=file.filename,
        ext=ext,
        category=category,
        project=project or "—",
        notes=notes or "",
        size_bytes=size_bytes,
        size_label=_size_label(size_bytes),
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.delete("/{file_id}", status_code=204)
def delete_file(file_id: int, db: Session = Depends(get_db)):
    record = db.get(FileRecord, file_id)
    if not record:
        raise HTTPException(status_code=404, detail="File not found")
    path = UPLOAD_DIR / record.filename
    if path.exists():
        path.unlink()
    db.delete(record)
    db.commit()
