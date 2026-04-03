from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse as FastAPIFileResponse
from typing import List, Optional
from datetime import datetime
from pathlib import Path
import shutil

from schemas.file import FileCategory, FileResponse

router = APIRouter(prefix="/files", tags=["Files"])

UPLOAD_DIR = Path(__file__).parent.parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

# In-memory file registry — replaced by DB later
_files: List[dict] = [
    {
        "id": 1,
        "filename": "Sprint-1-midpoint-report.pdf",
        "ext": "pdf",
        "category": "Report",
        "project": "Dev platform",
        "notes": "",
        "size_bytes": 420000,
        "size_label": "420 KB",
        "uploaded_at": datetime(2025, 4, 1, 15, 0),
    },
    {
        "id": 2,
        "filename": "Auth-module-technical-spec.docx",
        "ext": "docx",
        "category": "Specification",
        "project": "Dev platform",
        "notes": "",
        "size_bytes": 185000,
        "size_label": "185 KB",
        "uploaded_at": datetime(2025, 3, 28, 10, 0),
    },
    {
        "id": 3,
        "filename": "Sprint-1-planning-minutes.docx",
        "ext": "docx",
        "category": "Meeting minutes",
        "project": "Dev platform",
        "notes": "",
        "size_bytes": 92000,
        "size_label": "92 KB",
        "uploaded_at": datetime(2025, 3, 28, 11, 0),
    },
]
_next_id = 4


def _size_label(size_bytes: int) -> str:
    if size_bytes >= 1_000_000:
        return f"{size_bytes / 1_000_000:.1f} MB"
    return f"{round(size_bytes / 1000)} KB"


@router.get("/", response_model=List[FileResponse])
def list_files(category: Optional[str] = None, project: Optional[str] = None):
    """List all uploaded files. Filter by ?category= or ?project="""
    result = _files
    if category:
        result = [f for f in result if f["category"] == category]
    if project:
        result = [f for f in result if f["project"] == project]
    return sorted(result, key=lambda f: f["uploaded_at"], reverse=True)


@router.get("/{file_id}", response_model=FileResponse)
def get_file_meta(file_id: int):
    """Return metadata for a single file."""
    for f in _files:
        if f["id"] == file_id:
            return f
    raise HTTPException(status_code=404, detail="File not found")


@router.get("/{file_id}/download")
def download_file(file_id: int):
    """Download the actual file."""
    for f in _files:
        if f["id"] == file_id:
            path = UPLOAD_DIR / f["filename"]
            if not path.exists():
                raise HTTPException(status_code=404, detail="File not found on disk")
            return FastAPIFileResponse(path=str(path), filename=f["filename"])
    raise HTTPException(status_code=404, detail="File not found")


@router.post("/upload", response_model=FileResponse, status_code=201)
async def upload_file(
    file:     UploadFile = File(...),
    category: FileCategory = Form(FileCategory.other),
    project:  Optional[str] = Form(None),
    notes:    Optional[str] = Form(None),
):
    """Upload a file with category and project metadata."""
    global _next_id

    # Save file to disk
    dest = UPLOAD_DIR / file.filename
    with dest.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    size_bytes = dest.stat().st_size
    ext = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else "bin"

    entry = {
        "id":         _next_id,
        "filename":   file.filename,
        "ext":        ext,
        "category":   category,
        "project":    project or "—",
        "notes":      notes or "",
        "size_bytes": size_bytes,
        "size_label": _size_label(size_bytes),
        "uploaded_at": datetime.now(),
    }
    _files.append(entry)
    _next_id += 1
    return entry


@router.delete("/{file_id}", status_code=204)
def delete_file(file_id: int):
    """Delete a file record (and the file from disk if it exists)."""
    global _files
    for f in _files:
        if f["id"] == file_id:
            path = UPLOAD_DIR / f["filename"]
            if path.exists():
                path.unlink()
            _files = [x for x in _files if x["id"] != file_id]
            return
    raise HTTPException(status_code=404, detail="File not found")
