"use client";

import { useState, useEffect } from "react";
import { sprintApi, Sprint, Story } from "@/lib/api";
import "./sprint.css";

type Status   = "backlog" | "inprogress" | "review" | "done";

const columns: { key: Status; label: string }[] = [
  { key: "backlog",    label: "Backlog" },
  { key: "inprogress", label: "In progress" },
  { key: "review",     label: "Review" },
  { key: "done",       label: "Done" },
];

const cardStyle: Record<Status, string> = {
  backlog:    "",
  inprogress: "story-card--inprogress",
  review:     "story-card--review",
  done:       "story-card--done",
};

const assigneeStyle: Record<string, string> = {
  C: "assignee-c",
  J: "assignee-j",
  A: "assignee-a",
};

const statusOrder: Status[] = ["backlog", "inprogress", "review", "done"];

const blankForm = { title: "", points: "3", assignee: "C", status: "backlog" as Status };

export default function SprintBoard() {
  const [sprint,    setSprint]    = useState<Sprint | null>(null);
  const [stories,   setStories]   = useState<Story[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form,      setForm]      = useState(blankForm);
  const [saving,    setSaving]    = useState(false);

  async function fetchAll() {
    try {
      const [sprintData, storiesData] = await Promise.all([
        sprintApi.getSprint(),
        sprintApi.getStories(),
      ]);
      setSprint(sprintData);
      setStories(storiesData);
    } catch (err) {
      console.error("Failed to fetch sprint data:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchAll(); }, []);

  async function advance(id: number, currentStatus: Status) {
    const idx  = statusOrder.indexOf(currentStatus);
    const next = statusOrder[Math.min(idx + 1, statusOrder.length - 1)];
    if (next === currentStatus) return;

    setStories((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: next } : s))
    );

    try {
      await sprintApi.updateStatus(id, next);
      const updated = await sprintApi.getSprint();
      setSprint(updated);
    } catch (err) {
      console.error("Failed to update story status:", err);
      await fetchAll();
    }
  }

  async function handleAddStory() {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      await sprintApi.createStory({
        title:    form.title.trim(),
        points:   Number(form.points) || 1,
        assignee: form.assignee,
        status:   form.status,
      });
      setForm(blankForm);
      setShowModal(false);
      await fetchAll();
    } catch (err) {
      console.error("Failed to create story:", err);
    } finally {
      setSaving(false);
    }
  }

  const done  = stories.filter((s) => s.status === "done").reduce((sum, s) => sum + s.points, 0);
  const total = stories.reduce((sum, s) => sum + s.points, 0);

  return (
    <main className="page">

      <div className="page-head">
        <div className="page-head-left">
          <div className="eyebrow">
            {sprint ? `${sprint.name} · ${sprint.start_date} – ${sprint.end_date}` : "Loading..."}
          </div>
          <h1>Sprint <em>board.</em></h1>
        </div>
        <div className="page-head-right">
          <button className="btn btn-ghost">Sprint report</button>
          <button className="btn btn-solid" onClick={() => setShowModal(true)}>+ Story</button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid-4">
        <div className="card">
          <div className="stat-label">Sprint goal</div>
          <p className="sprint-goal-text">{sprint?.goal ?? "—"}</p>
        </div>
        <div className="card">
          <div className="stat-label">Points done</div>
          <div className="stat">{done}<span className="stat-unit">/{total}</span></div>
        </div>
        <div className="card">
          <div className="stat-label">Days remaining</div>
          <div className="stat">{sprint?.days_remaining ?? "—"}</div>
          <div className="stat-sub">of 10 · on track</div>
        </div>
        <div className="card">
          <div className="stat-label">Team capacity</div>
          <div className="stat">{sprint?.capacity_pct ?? "—"}<span className="stat-unit">%</span></div>
        </div>
      </div>

      {/* Kanban */}
      {loading ? (
        <p style={{ color: "var(--ink4)", fontSize: "var(--text-sm)" }}>Loading board...</p>
      ) : (
        <div className="kanban">
          {columns.map((col) => {
            const colStories = stories.filter((s) => s.status === col.key);
            return (
              <div key={col.key}>
                <div className="kb-col-head">
                  {col.label}
                  <span className="kb-col-count">{colStories.length}</span>
                </div>

                {colStories.map((story) => (
                  <div
                    key={story.id}
                    className={`story-card ${cardStyle[story.status as Status]}`}
                    onClick={() => advance(story.id, story.status as Status)}
                    title="Click to advance to next stage"
                  >
                    <div className="story-title">{story.title}</div>
                    <div className="story-footer">
                      <span className="story-pts">
                        {story.points} {story.points === 1 ? "pt" : "pts"}
                      </span>
                      <div className={`assignee ${assigneeStyle[story.assignee ?? ""] ?? ""}`}>
                        {story.assignee}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Story Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>

            <div className="modal-head">
              <div className="modal-title">Add story</div>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <div className="field">
              <label>Title</label>
              <input
                type="text"
                placeholder="What needs to be done?"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                autoFocus
              />
            </div>

            <div className="field">
              <label>Story points</label>
              <select
                value={form.points}
                onChange={(e) => setForm({ ...form, points: e.target.value })}
              >
                {[1, 2, 3, 5, 8, 13].map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Assignee</label>
              <select
                value={form.assignee}
                onChange={(e) => setForm({ ...form, assignee: e.target.value })}
              >
                <option value="C">C — Centrine</option>
                <option value="J">J — James</option>
                <option value="A">A — Aisha</option>
              </select>
            </div>

            <div className="field">
              <label>Column</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as Status })}
              >
                <option value="backlog">Backlog</option>
                <option value="inprogress">In progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button
                className="btn btn-solid"
                onClick={handleAddStory}
                disabled={saving || !form.title.trim()}
              >
                {saving ? "Adding…" : "Add story"}
              </button>
            </div>

          </div>
        </div>
      )}

    </main>
  );
}
