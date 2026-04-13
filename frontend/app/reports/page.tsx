"use client";

import { useState, useEffect, useRef, DragEvent, ChangeEvent } from "react";
import { fileApi, FileEntry } from "@/lib/api";
import "./reports.css";

type Category = "All" | "Report" | "Documentation" | "Meeting minutes" | "Specification" | "Other";

const categories: Category[] = ["All", "Report", "Documentation", "Meeting minutes", "Specification", "Other"];

function getExt(name: string): string {
  return name.split(".").pop()?.toLowerCase() ?? "txt";
}

function iconClass(ext: string): string {
  if (ext === "pdf") return "file-icon--pdf";
  if (["doc", "docx"].includes(ext)) return "file-icon--doc";
  if (["xls", "xlsx", "csv"].includes(ext)) return "file-icon--xls";
  if (["ppt", "pptx"].includes(ext)) return "file-icon--ppt";
  return "file-icon--txt";
}

function iconLabel(ext: string): string {
  if (ext === "pdf") return "PDF";
  if (["doc", "docx"].includes(ext)) return "DOC";
  if (["xls", "xlsx"].includes(ext)) return "XLS";
  if (ext === "csv") return "CSV";
  if (["ppt", "pptx"].includes(ext)) return "PPT";
  return ext.toUpperCase().slice(0, 3);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

const blankForm = {
  category: "Report" as Exclude<Category, "All">,
  project:  "",
  notes:    "",
};

export default function Reports() {
  const [files,           setFiles]           = useState<FileEntry[]>([]);
  const [loading,         setLoading]         = useState(true);
  const [uploading,       setUploading]       = useState(false);
  const [activeCategory,  setActiveCategory]  = useState<Category>("All");
  const [dragging,        setDragging]        = useState(false);
  const [form,            setForm]            = useState(blankForm);
  const inputRef = useRef<HTMLInputElement>(null);

  async function fetchFiles() {
    try {
      const data = await fileApi.getAll();
      setFiles(data);
    } catch (err) {
      console.error("Failed to load files:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchFiles(); }, []);

  const visible = activeCategory === "All"
    ? files
    : files.filter((f) => f.category === activeCategory);

  async function processFiles(fileList: FileList) {
    setUploading(true);
    try {
      for (const file of Array.from(fileList)) {
        const fd = new FormData();
        fd.append("file",     file);
        fd.append("category", form.category);
        if (form.project) fd.append("project", form.project);
        if (form.notes)   fd.append("notes",   form.notes);
        await fileApi.upload(fd);
      }
      await fetchFiles();
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  }

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.length) processFiles(e.target.files);
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files?.length) processFiles(e.dataTransfer.files);
  }

  return (
    <main className="page">

      <div className="page-head">
        <div className="page-head-left">
          <div className="eyebrow">Documents · evidence · deliverables</div>
          <h1>Reports & <em>documents.</em></h1>
        </div>
        <div className="page-head-right">
          <button className="btn btn-ghost" onClick={() => inputRef.current?.click()}>
            Upload file
          </button>
        </div>
      </div>

      <div className="grid-2">

        {/* Left — file list */}
        <div className="col">

          {/* Upload zone */}
          <div
            className={`upload-zone ${dragging ? "upload-zone--drag" : ""}`}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
          >
            <div className="upload-icon">{uploading ? "…" : "↑"}</div>
            <div className="upload-title">
              {uploading ? "Uploading…" : "Drop files here or click to upload"}
            </div>
            <div className="upload-sub">PDF, DOCX, XLSX, PPTX, CSV — any project material</div>
            <input
              ref={inputRef}
              className="upload-input"
              type="file"
              multiple
              onChange={onFileChange}
            />
          </div>

          {/* File list */}
          <div className="card">
            <div className="card-label-row">
              <div className="card-label">All files</div>
              <span className="card-count">{visible.length} file{visible.length !== 1 ? "s" : ""}</span>
            </div>

            <div className="filters">
              {categories.map((c) => (
                <button
                  key={c}
                  className={`filter-btn ${activeCategory === c ? "filter-btn--active" : ""}`}
                  onClick={() => setActiveCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>

            {loading ? (
              <p style={{ fontSize: "var(--text-sm)", color: "var(--ink4)", padding: "8px 0" }}>
                Loading files...
              </p>
            ) : visible.length === 0 ? (
              <p style={{ fontSize: "var(--text-sm)", color: "var(--ink4)", padding: "8px 0" }}>
                No files in this category yet.
              </p>
            ) : (
              visible.map((f) => (
                <div key={f.id} className="file-row">
                  <div className={`file-icon ${iconClass(f.ext)}`}>{iconLabel(f.ext)}</div>
                  <div className="file-info">
                    <div className="file-name">{f.filename}</div>
                    <div className="file-meta">
                      {f.category} · {f.project ?? "—"} · {formatDate(f.uploaded_at)}
                    </div>
                  </div>
                  <div className="file-size">{f.size_label}</div>
                </div>
              ))
            )}
          </div>

        </div>

        {/* Right — upload details form */}
        <div className="card">
          <div className="card-label">Upload details</div>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--ink3)", marginBottom: 16, lineHeight: 1.6 }}>
            Set the category and project before uploading so files are organised from the start.
          </p>

          <div className="form-group">

            <div className="field">
              <label>Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as Exclude<Category, "All"> })}
              >
                <option>Report</option>
                <option>Documentation</option>
                <option>Meeting minutes</option>
                <option>Specification</option>
                <option>Other</option>
              </select>
            </div>

            <div className="field">
              <label>Project</label>
              <input
                type="text"
                placeholder="Which project does this belong to?"
                value={form.project}
                onChange={(e) => setForm({ ...form, project: e.target.value })}
              />
            </div>

            <div className="field">
              <label>Notes (optional)</label>
              <textarea
                rows={3}
                placeholder="Any context about this file..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>

            <button className="btn btn-solid" onClick={() => inputRef.current?.click()}>
              Choose file to upload
            </button>

          </div>
        </div>

      </div>
    </main>
  );
}
