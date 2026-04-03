"use client";

import { useState } from "react";
import "./daily-log.css";

type EntryType = "Dev work" | "Scrum ceremony" | "Meeting" | "Documentation" | "Planning" | "Report" | "Other";

interface LogEntry {
  id: number;
  title: string;
  type: EntryType;
  tag: string;
  tagClass: string;
  color: string;
  time: string;
  duration: string;
}

const tagMap: Record<EntryType, { label: string; tagClass: string; color: string }> = {
  "Dev work":       { label: "Dev",           tagClass: "tag-blue",   color: "#93c5fd" },
  "Scrum ceremony": { label: "Ceremony",       tagClass: "tag-purple", color: "#a78bfa" },
  "Meeting":        { label: "Meeting",        tagClass: "tag-green",  color: "#6ee7b7" },
  "Documentation":  { label: "Documentation",  tagClass: "tag-amber",  color: "#fcd34d" },
  "Planning":       { label: "Planning",       tagClass: "tag-purple", color: "#a78bfa" },
  "Report":         { label: "Report",         tagClass: "tag-amber",  color: "#fcd34d" },
  "Other":          { label: "Other",          tagClass: "tag-green",  color: "#6ee7b7" },
};

const todayEntries: LogEntry[] = [
  { id: 1, title: "Daily standup — all 5 attended, 2 blockers surfaced", type: "Scrum ceremony", tag: "Ceremony",      tagClass: "tag-purple", color: "#a78bfa", time: "09:00", duration: "15 min" },
  { id: 2, title: "Auth API integration — POST /login connected, token handling implemented", type: "Dev work", tag: "Dev", tagClass: "tag-blue", color: "#93c5fd", time: "10:00", duration: "2h" },
  { id: 3, title: "Backlog refinement — 8 stories groomed for Sprint 2", type: "Scrum ceremony", tag: "Ceremony", tagClass: "tag-purple", color: "#a78bfa", time: "13:00", duration: "60 min" },
  { id: 4, title: "Sprint 1 mid-point report drafted", type: "Documentation", tag: "Documentation", tagClass: "tag-amber", color: "#fcd34d", time: "15:00", duration: "" },
];

const yesterdayEntries: LogEntry[] = [
  { id: 5, title: "Daily standup", type: "Scrum ceremony", tag: "Ceremony", tagClass: "tag-purple", color: "#a78bfa", time: "09:00", duration: "" },
  { id: 6, title: "Session management middleware — written, tested, merged to dev branch", type: "Dev work", tag: "Dev", tagClass: "tag-blue", color: "#93c5fd", time: "10:00", duration: "1.5h" },
  { id: 7, title: "1-on-1s with James & Aisha — team health check", type: "Meeting", tag: "Meeting", tagClass: "tag-green", color: "#6ee7b7", time: "14:00", duration: "30 min" },
  { id: 8, title: "Meeting minutes drafted and shared with team", type: "Documentation", tag: "Documentation", tagClass: "tag-amber", color: "#fcd34d", time: "15:00", duration: "" },
];

const timelineBlocks = [
  { slot: "9–9:15",  bg: "var(--purple-l)", border: "var(--purple)" },
  { slot: "10–12",   bg: "var(--blue-l)",   border: "var(--blue)" },
  { slot: "13–14",   bg: "var(--purple-l)", border: "var(--purple)" },
  { slot: "15–16",   bg: "var(--amber-l)",  border: "var(--amber)" },
];

const filters = ["All time", "Last 30 days", "This sprint", "By project"];

export default function DailyLog() {
  const [activeFilter, setActiveFilter] = useState("All time");
  const [entries, setEntries] = useState(todayEntries);

  const [form, setForm] = useState({
    activity: "",
    type: "Dev work" as EntryType,
    duration: "",
    tags: "",
    notes: "",
  });

  function handleSave() {
    if (!form.activity.trim()) return;

    const { label, tagClass, color } = tagMap[form.type];
    const now = new Date();
    const time = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

    const newEntry: LogEntry = {
      id: Date.now(),
      title: form.activity,
      type: form.type,
      tag: label,
      tagClass,
      color,
      time,
      duration: form.duration,
    };

    setEntries((prev) => [newEntry, ...prev]);
    setForm({ activity: "", type: "Dev work", duration: "", tags: "", notes: "" });
  }

  return (
    <main className="page">

      {/* Page heading */}
      <div className="page-head">
        <div className="page-head-left">
          <div className="eyebrow">Evidence trail · audit-ready</div>
          <h1>Daily <em>log.</em></h1>
        </div>
        <div className="page-head-right">
          <button className="btn btn-ghost">View last 30 days</button>
          <button className="btn btn-solid" style={{ width: "auto" }}>+ New entry</button>
        </div>
      </div>

      {/* Audit banner */}
      <div className="audit-banner">
        <div className="audit-banner-left">
          <h3>Audit mode</h3>
          <p>Filter your work history for any period or project</p>
        </div>
        <div className="audit-filters">
          {filters.map((f) => (
            <button
              key={f}
              className={`audit-btn ${activeFilter === f ? "audit-btn--active" : ""}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Main grid */}
      <div className="grid-2">

        {/* Left — log entries */}
        <div className="col">

          {/* Today */}
          <div className="card">
            <div className="card-label">Today — {new Date().toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</div>
            {entries.map((e) => (
              <div key={e.id} className="log-entry">
                <div className="log-dot" style={{ background: e.color }} />
                <div>
                  <div className="log-title">{e.title}</div>
                  <div className="log-meta">
                    <span className={`tag ${e.tagClass}`}>{e.tag}</span>
                    <span>{e.time}{e.duration ? ` · ${e.duration}` : ""}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Yesterday */}
          <div className="card">
            <div className="card-label">Yesterday</div>
            {yesterdayEntries.map((e) => (
              <div key={e.id} className="log-entry">
                <div className="log-dot" style={{ background: e.color }} />
                <div>
                  <div className="log-title">{e.title}</div>
                  <div className="log-meta">
                    <span className={`tag ${e.tagClass}`}>{e.tag}</span>
                    <span>{e.time}{e.duration ? ` · ${e.duration}` : ""}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Right — form + timeline */}
        <div className="col">

          {/* Log form */}
          <div className="card">
            <div className="card-label">Log today&apos;s work</div>
            <div className="form-group">

              <div className="field">
                <label>Activity</label>
                <input
                  type="text"
                  placeholder="What did you work on?"
                  value={form.activity}
                  onChange={(e) => setForm({ ...form, activity: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="field">
                  <label>Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as EntryType })}>
                    <option>Dev work</option>
                    <option>Scrum ceremony</option>
                    <option>Meeting</option>
                    <option>Documentation</option>
                    <option>Planning</option>
                    <option>Report</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="field">
                  <label>Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 2h"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  />
                </div>
              </div>

              <div className="field">
                <label>Smart tags</label>
                <input
                  type="text"
                  placeholder="#backend #auth #sprint1"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                />
              </div>

              <div className="field">
                <label>Detail notes (becomes your evidence)</label>
                <textarea
                  rows={4}
                  placeholder="Describe what you did, decisions made, outcomes achieved..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>

              <button className="btn btn-solid" onClick={handleSave}>
                Save to log
              </button>

            </div>
          </div>

          {/* Timeline visual */}
          <div className="card">
            <div className="card-label">Timeline view — today</div>
            <div className="timeline-bars">
              {timelineBlocks.map((b) => (
                <div key={b.slot} className="timeline-bar-row">
                  <div className="timeline-bar-time">{b.slot}</div>
                  <div
                    className="timeline-bar"
                    style={{ background: b.bg, borderLeftColor: b.border }}
                  />
                </div>
              ))}
            </div>
            <div className="legend">
              <div className="legend-item">
                <div className="legend-swatch" style={{ background: "var(--purple-l)", borderLeftColor: "var(--purple)" }} />
                Ceremony
              </div>
              <div className="legend-item">
                <div className="legend-swatch" style={{ background: "var(--blue-l)", borderLeftColor: "var(--blue)" }} />
                Dev
              </div>
              <div className="legend-item">
                <div className="legend-swatch" style={{ background: "var(--amber-l)", borderLeftColor: "var(--amber)" }} />
                Doc
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
