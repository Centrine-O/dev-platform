"use client";

import { useState, useEffect, useMemo } from "react";
import { fileApi, FileEntry } from "@/lib/api";
import "./archive.css";

type Category = "All" | "Report" | "Documentation" | "Meeting minutes" | "Specification" | "Other";
type SortKey  = "date" | "name" | "size";

const categories: Category[] = ["All", "Report", "Documentation", "Meeting minutes", "Specification", "Other"];

const categoryTag: Record<string, string> = {
  "Report":          "tag-amber",
  "Documentation":   "tag-blue",
  "Meeting minutes": "tag-purple",
  "Specification":   "tag-green",
  "Other":           "tag-default",
};

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

export default function Archive() {
  const [files,    setFiles]    = useState<FileEntry[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState<Category>("All");
  const [project,  setProject]  = useState("All");
  const [sortBy,   setSortBy]   = useState<SortKey>("date");

  useEffect(() => {
    fileApi.getAll()
      .then(setFiles)
      .catch((err) => console.error("Failed to load archive:", err))
      .finally(() => setLoading(false));
  }, []);

  const projects = useMemo(() => {
    const unique = Array.from(new Set(files.map((f) => f.project ?? "—")));
    return ["All", ...unique];
  }, [files]);

  const filtered = useMemo(() => {
    let result = [...files];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (f) =>
          f.filename.toLowerCase().includes(q) ||
          (f.project ?? "").toLowerCase().includes(q) ||
          f.category.toLowerCase().includes(q)
      );
    }

    if (category !== "All") result = result.filter((f) => f.category === category);
    if (project  !== "All") result = result.filter((f) => (f.project ?? "—") === project);

    result.sort((a, b) => {
      if (sortBy === "name") return a.filename.localeCompare(b.filename);
      if (sortBy === "size") return b.size_bytes - a.size_bytes;
      return new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime();
    });

    return result;
  }, [files, search, category, project, sortBy]);

  const totalSize = useMemo(() => {
    const bytes = files.reduce((s, f) => s + f.size_bytes, 0);
    return bytes >= 1_000_000
      ? `${(bytes / 1_000_000).toFixed(1)} MB`
      : `${Math.round(bytes / 1000)} KB`;
  }, [files]);

  return (
    <main className="page">

      <div className="page-head">
        <div className="page-head-left">
          <div className="eyebrow">Everything, searchable</div>
          <h1>Archive.</h1>
        </div>
        <div className="page-head-right">
          <button className="btn btn-ghost">Export list</button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">Total files</div>
          <div className="stat-value">{files.length}</div>
          <div className="stat-sub">across all projects</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total size</div>
          <div className="stat-value">{loading ? "—" : totalSize}</div>
          <div className="stat-sub">stored</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Meeting minutes</div>
          <div className="stat-value">{files.filter((f) => f.category === "Meeting minutes").length}</div>
          <div className="stat-sub">documents</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Reports</div>
          <div className="stat-value">{files.filter((f) => f.category === "Report").length}</div>
          <div className="stat-sub">filed</div>
        </div>
      </div>

      {/* Search + filters */}
      <div className="toolbar">
        <div className="search-wrap">
          <svg className="search-icon" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4">
            <circle cx="6" cy="6" r="4" />
            <path d="M10 10l2.5 2.5" />
          </svg>
          <input
            className="search-input"
            type="text"
            placeholder="Search files by name, project, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select className="filter-select" value={category} onChange={(e) => setCategory(e.target.value as Category)}>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>

        <select className="filter-select" value={project} onChange={(e) => setProject(e.target.value)}>
          {projects.map((p) => <option key={p}>{p}</option>)}
        </select>

        <select className="filter-select" value={sortBy} onChange={(e) => setSortBy(e.target.value as SortKey)}>
          <option value="date">Sort: Date</option>
          <option value="name">Sort: Name</option>
          <option value="size">Sort: Size</option>
        </select>
      </div>

      {/* Table */}
      <div className="archive-table">
        <div className="table-head">
          <div className="th" />
          <div className="th">File</div>
          <div className="th">Category</div>
          <div className="th">Project</div>
          <div className="th">Date</div>
          <div className="th">Size</div>
        </div>

        {loading ? (
          <div className="empty">Loading archive...</div>
        ) : filtered.length === 0 ? (
          <div className="empty">No files match your search.</div>
        ) : (
          filtered.map((f) => (
            <div key={f.id} className="table-row">
              <div className={`file-icon ${iconClass(f.ext)}`}>{iconLabel(f.ext)}</div>
              <div className="file-name">{f.filename}</div>
              <span className={`tag ${categoryTag[f.category] ?? "tag-default"}`}>{f.category}</span>
              <div className="td-meta">{f.project ?? "—"}</div>
              <div className="td-meta">{formatDate(f.uploaded_at)}</div>
              <div className="td-size">{f.size_label}</div>
            </div>
          ))
        )}
      </div>

    </main>
  );
}
