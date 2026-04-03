"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import "./reports.css";

type Category = "All" | "Report" | "Documentation" | "Meeting minutes" | "Specification" | "Other";

interface FileEntry {
  id: number;
  name: string;
  ext: string;
  category: Category;
  project: string;
  size: string;
  date: string;
}

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

const initialFiles: FileEntry[] = [
  { id: 1, name: "Sprint-1-midpoint-report.pdf",     ext: "pdf",  category: "Report",           project: "Dev platform", size: "420 KB", date: "1 Apr 2025" },
  { id: 2, name: "Auth-module-technical-spec.docx",  ext: "docx", category: "Specification",    project: "Dev platform", size: "185 KB", date: "28 Mar 2025" },
  { id: 3, name: "Sprint-1-planning-minutes.docx",   ext: "docx", category: "Meeting minutes",  project: "Dev platform", size: "92 KB",  date: "28 Mar 2025" },
  { id: 4, name: "Q2-roadmap-summary.xlsx",          ext: "xlsx", category: "Report",           project: "Strategy",     size: "310 KB", date: "27 Mar 2025" },
  { id: 5, name: "Onboarding-scrum-guide.pdf",       ext: "pdf",  category: "Documentation",    project: "Dev platform", size: "640 KB", date: "26 Mar 2025" },
];

const categories: Category[] = ["All", "Report", "Documentation", "Meeting minutes", "Specification", "Other"];

const blankForm = {
  category: "Report" as Category,
  project: "",
  notes: "",
};

export default function Reports() {
  const [files, setFiles]             = useState(initialFiles);
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [dragging, setDragging]       = useState(false);
  const [form, setForm]               = useState(blankForm);
  const inputRef                      = useRef<HTMLInputElement>(null);

  const visible = activeCategory === "All"
    ? files
    : files.filter((f) => f.category === activeCategory);

  function processFiles(fileList: FileList) {
    const today = new Date().toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
    });

    const newEntries: FileEntry[] = Array.from(fileList).map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      ext: getExt(file.name),
      category: form.category,
      project: form.project || "—",
      size: file.size > 1_000_000
        ? `${(file.size / 1_000_000).toFixed(1)} MB`
        : `${Math.round(file.size / 1000)} KB`,
      date: today,
    }));

    setFiles((prev) => [...newEntries, ...prev]);
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

      {/* Page heading */}
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
            <div className="upload-icon">↑</div>
            <div className="upload-title">Drop files here or click to upload</div>
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

            {/* Category filters */}
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

            {visible.length === 0 ? (
              <p style={{ fontSize: "var(--text-sm)", color: "var(--ink4)", padding: "8px 0" }}>
                No files in this category yet.
              </p>
            ) : (
              visible.map((f) => (
                <div key={f.id} className="file-row">
                  <div className={`file-icon ${iconClass(f.ext)}`}>{iconLabel(f.ext)}</div>
                  <div className="file-info">
                    <div className="file-name">{f.name}</div>
                    <div className="file-meta">{f.category} · {f.project} · {f.date}</div>
                  </div>
                  <div className="file-size">{f.size}</div>
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
                onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
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
