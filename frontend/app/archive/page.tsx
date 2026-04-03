"use client";

import { useState, useMemo } from "react";
import "./archive.css";

type Category = "All" | "Report" | "Documentation" | "Meeting minutes" | "Specification" | "Other";
type SortKey  = "date" | "name" | "size";

interface ArchiveEntry {
  id: number;
  name: string;
  ext: string;
  category: Exclude<Category, "All">;
  project: string;
  size: string;
  sizeBytes: number;
  date: string;
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

const categoryTag: Record<Exclude<Category, "All">, string> = {
  "Report":          "tag-amber",
  "Documentation":   "tag-blue",
  "Meeting minutes": "tag-purple",
  "Specification":   "tag-green",
  "Other":           "tag-default",
};

const allFiles: ArchiveEntry[] = [
  { id: 1,  name: "Sprint-1-midpoint-report.pdf",          ext: "pdf",  category: "Report",          project: "Dev platform", size: "420 KB",  sizeBytes: 420000,  date: "1 Apr 2025" },
  { id: 2,  name: "Auth-module-technical-spec.docx",       ext: "docx", category: "Specification",   project: "Dev platform", size: "185 KB",  sizeBytes: 185000,  date: "28 Mar 2025" },
  { id: 3,  name: "Sprint-1-planning-minutes.docx",        ext: "docx", category: "Meeting minutes", project: "Dev platform", size: "92 KB",   sizeBytes: 92000,   date: "28 Mar 2025" },
  { id: 4,  name: "Q2-roadmap-summary.xlsx",               ext: "xlsx", category: "Report",          project: "Strategy",     size: "310 KB",  sizeBytes: 310000,  date: "27 Mar 2025" },
  { id: 5,  name: "Onboarding-scrum-guide.pdf",            ext: "pdf",  category: "Documentation",   project: "Dev platform", size: "640 KB",  sizeBytes: 640000,  date: "26 Mar 2025" },
  { id: 6,  name: "Kickoff-meeting-minutes.docx",          ext: "docx", category: "Meeting minutes", project: "Dev platform", size: "78 KB",   sizeBytes: 78000,   date: "27 Mar 2025" },
  { id: 7,  name: "DB-schema-design-v1.pdf",               ext: "pdf",  category: "Documentation",   project: "Dev platform", size: "215 KB",  sizeBytes: 215000,  date: "25 Mar 2025" },
  { id: 8,  name: "Backlog-refinement-session-1.docx",     ext: "docx", category: "Meeting minutes", project: "Dev platform", size: "55 KB",   sizeBytes: 55000,   date: "1 Apr 2025" },
  { id: 9,  name: "Q2-team-capacity-plan.xlsx",            ext: "xlsx", category: "Report",          project: "Strategy",     size: "198 KB",  sizeBytes: 198000,  date: "26 Mar 2025" },
  { id: 10, name: "API-endpoints-documentation.pdf",       ext: "pdf",  category: "Documentation",   project: "Dev platform", size: "380 KB",  sizeBytes: 380000,  date: "30 Mar 2025" },
];

const categories: Category[] = ["All", "Report", "Documentation", "Meeting minutes", "Specification", "Other"];

export default function Archive() {
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState<Category>("All");
  const [project,  setProject]  = useState("All");
  const [sortBy,   setSortBy]   = useState<SortKey>("date");

  const projects = useMemo(() => {
    const unique = Array.from(new Set(allFiles.map((f) => f.project)));
    return ["All", ...unique];
  }, []);

  const filtered = useMemo(() => {
    let result = [...allFiles];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.project.toLowerCase().includes(q) ||
          f.category.toLowerCase().includes(q)
      );
    }

    if (category !== "All") result = result.filter((f) => f.category === category);
    if (project  !== "All") result = result.filter((f) => f.project  === project);

    result.sort((a, b) => {
      if (sortBy === "name")  return a.name.localeCompare(b.name);
      if (sortBy === "size")  return b.sizeBytes - a.sizeBytes;
      return 0; // date — already ordered in source
    });

    return result;
  }, [search, category, project, sortBy]);

  const totalSize = useMemo(() => {
    const bytes = allFiles.reduce((s, f) => s + f.sizeBytes, 0);
    return bytes > 1_000_000
      ? `${(bytes / 1_000_000).toFixed(1)} MB`
      : `${Math.round(bytes / 1000)} KB`;
  }, []);

  return (
    <main className="page">

      {/* Page heading */}
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
          <div className="stat-value">{allFiles.length}</div>
          <div className="stat-sub">across all projects</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total size</div>
          <div className="stat-value">{totalSize}</div>
          <div className="stat-sub">stored</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Meeting minutes</div>
          <div className="stat-value">{allFiles.filter((f) => f.category === "Meeting minutes").length}</div>
          <div className="stat-sub">documents</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Reports</div>
          <div className="stat-value">{allFiles.filter((f) => f.category === "Report").length}</div>
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

        <select
          className="filter-select"
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
        >
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <select
          className="filter-select"
          value={project}
          onChange={(e) => setProject(e.target.value)}
        >
          {projects.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>

        <select
          className="filter-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortKey)}
        >
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

        {filtered.length === 0 ? (
          <div className="empty">No files match your search.</div>
        ) : (
          filtered.map((f) => (
            <div key={f.id} className="table-row">
              <div className={`file-icon ${iconClass(f.ext)}`}>{iconLabel(f.ext)}</div>
              <div className="file-name">{f.name}</div>
              <span className={`tag ${categoryTag[f.category]}`}>{f.category}</span>
              <div className="td-meta">{f.project}</div>
              <div className="td-meta">{f.date}</div>
              <div className="td-size">{f.size}</div>
            </div>
          ))
        )}
      </div>

    </main>
  );
}
