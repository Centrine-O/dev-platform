"use client";

import { useState, useEffect } from "react";
import { logApi, LogEntry } from "@/lib/api";
import "./daily-log.css";

type EntryType = "Dev work" | "Scrum ceremony" | "Meeting" | "Documentation" | "Planning" | "Report" | "Other";

const tagMap: Record<string, { label: string; tagClass: string; color: string }> = {
  "Dev work":       { label: "Dev",          tagClass: "tag-blue",   color: "#93c5fd" },
  "Scrum ceremony": { label: "Ceremony",      tagClass: "tag-purple", color: "#a78bfa" },
  "Meeting":        { label: "Meeting",       tagClass: "tag-green",  color: "#6ee7b7" },
  "Documentation":  { label: "Documentation", tagClass: "tag-amber",  color: "#fcd34d" },
  "Planning":       { label: "Planning",      tagClass: "tag-purple", color: "#a78bfa" },
  "Report":         { label: "Report",        tagClass: "tag-amber",  color: "#fcd34d" },
  "Other":          { label: "Other",         tagClass: "tag-green",  color: "#6ee7b7" },
};

const timelineBlocks = [
  { slot: "9–9:15",  bg: "var(--purple-l)", border: "var(--purple)" },
  { slot: "10–12",   bg: "var(--blue-l)",   border: "var(--blue)" },
  { slot: "13–14",   bg: "var(--purple-l)", border: "var(--purple)" },
  { slot: "15–16",   bg: "var(--amber-l)",  border: "var(--amber)" },
];

const filters = ["All time", "Last 30 days", "This sprint", "By project"];

function isToday(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

function isYesterday(dateStr: string) {
  const d = new Date(dateStr);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return d.toDateString() === yesterday.toDateString();
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

function EntryRow({ entry }: { entry: LogEntry }) {
  const style = tagMap[entry.type] ?? tagMap["Other"];
  return (
    <div className="log-entry">
      <div className="log-dot" style={{ background: style.color }} />
      <div>
        <div className="log-title">{entry.title}</div>
        <div className="log-meta">
          <span className={`tag ${style.tagClass}`}>{style.label}</span>
          <span>
            {formatTime(entry.created_at)}
            {entry.duration ? ` · ${entry.duration}` : ""}
          </span>
        </div>
      </div>
    </div>
  );
}

const blankForm = {
  activity: "",
  type: "Dev work" as EntryType,
  duration: "",
  tags: "",
  notes: "",
};

export default function DailyLog() {
  const [entries,      setEntries]      = useState<LogEntry[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [saving,       setSaving]       = useState(false);
  const [activeFilter, setActiveFilter] = useState("All time");
  const [form,         setForm]         = useState(blankForm);

  async function fetchEntries() {
    try {
      const data = await logApi.getAll();
      setEntries(data);
    } catch (err) {
      console.error("Failed to fetch log entries:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchEntries(); }, []);

  async function handleSave() {
    if (!form.activity.trim()) return;
    setSaving(true);
    try {
      await logApi.create({
        title:    form.activity,
        type:     form.type,
        duration: form.duration || undefined,
        tags:     form.tags     || undefined,
        notes:    form.notes    || undefined,
      });
      await fetchEntries();
      setForm(blankForm);
    } catch (err) {
      console.error("Failed to save entry:", err);
    } finally {
      setSaving(false);
    }
  }

  const todayEntries     = entries.filter((e) => isToday(e.created_at));
  const yesterdayEntries = entries.filter((e) => isYesterday(e.created_at));
  const olderEntries     = entries.filter((e) => !isToday(e.created_at) && !isYesterday(e.created_at));

  return (
    <main className="page">

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

      <div className="grid-2">

        {/* Left — log entries */}
        <div className="col">
          {loading ? (
            <div className="card">
              <p style={{ color: "var(--ink4)", fontSize: "var(--text-sm)" }}>Loading entries...</p>
            </div>
          ) : (
            <>
              <div className="card">
                <div className="card-label">
                  Today — {new Date().toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                </div>
                {todayEntries.length === 0
                  ? <p style={{ color: "var(--ink4)", fontSize: "var(--text-sm)" }}>Nothing logged yet today.</p>
                  : todayEntries.map((e) => <EntryRow key={e.id} entry={e} />)
                }
              </div>

              {yesterdayEntries.length > 0 && (
                <div className="card">
                  <div className="card-label">Yesterday</div>
                  {yesterdayEntries.map((e) => <EntryRow key={e.id} entry={e} />)}
                </div>
              )}

              {olderEntries.length > 0 && (
                <div className="card">
                  <div className="card-label">Earlier</div>
                  {olderEntries.map((e) => <EntryRow key={e.id} entry={e} />)}
                </div>
              )}
            </>
          )}
        </div>

        {/* Right — form + timeline */}
        <div className="col">
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

              <button className="btn btn-solid" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save to log"}
              </button>

            </div>
          </div>

          <div className="card">
            <div className="card-label">Timeline view — today</div>
            <div className="timeline-bars">
              {timelineBlocks.map((b) => (
                <div key={b.slot} className="timeline-bar-row">
                  <div className="timeline-bar-time">{b.slot}</div>
                  <div className="timeline-bar" style={{ background: b.bg, borderLeftColor: b.border }} />
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
