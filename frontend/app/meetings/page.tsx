"use client";

import { useState, useEffect } from "react";
import { meetingApi, Meeting } from "@/lib/api";
import "./meetings.css";

type MeetingType =
  | "Daily standup"
  | "Sprint planning"
  | "Backlog refinement"
  | "Sprint review"
  | "Retrospective"
  | "Stakeholder"
  | "1-on-1"
  | "Other";

const tagStyle: Record<string, string> = {
  "Daily standup":      "tag-purple",
  "Sprint planning":    "tag-purple",
  "Backlog refinement": "tag-purple",
  "Sprint review":      "tag-blue",
  "Retrospective":      "tag-blue",
  "Stakeholder":        "tag-green",
  "1-on-1":             "tag-amber",
  "Other":              "tag-default",
};

const blankForm = {
  title:        "",
  date:         "",
  duration:     "",
  type:         "Daily standup" as MeetingType,
  attendees:    "",
  key_points:   "",
  action_items: "",
};

export default function Meetings() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [form,     setForm]     = useState(blankForm);
  const [selected, setSelected] = useState<Meeting | null>(null);

  async function fetchMeetings() {
    try {
      const data = await meetingApi.getAll();
      setMeetings(data);
    } catch (err) {
      console.error("Failed to fetch meetings:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchMeetings(); }, []);

  async function handleSave() {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      await meetingApi.create({
        title:        form.title,
        date:         form.date,
        duration:     form.duration   || undefined,
        type:         form.type,
        attendees:    form.attendees  || undefined,
        key_points:   form.key_points,
        action_items: form.action_items || undefined,
      });
      await fetchMeetings();
      setForm(blankForm);
    } catch (err) {
      console.error("Failed to save meeting:", err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="page">

      <div className="page-head">
        <div className="page-head-left">
          <div className="eyebrow">All ceremonies & stakeholder meetings</div>
          <h1>Meeting <em>minutes.</em></h1>
        </div>
        <div className="page-head-right">
          <button className="btn btn-solid" style={{ width: "auto" }}>+ New minutes</button>
        </div>
      </div>

      <div className="grid-2">

        {/* Left — meeting list */}
        <div className="col">
          {loading ? (
            <div className="meeting-card">
              <p style={{ color: "var(--ink4)", fontSize: "var(--text-sm)" }}>Loading meetings...</p>
            </div>
          ) : meetings.map((m) => (
            <div
              key={m.id}
              className="meeting-card"
              onClick={() => setSelected(selected?.id === m.id ? null : m)}
            >
              <div className="meeting-card-head">
                <div className="meeting-title">{m.title}</div>
                <div className="meeting-date">{m.date}{m.duration ? ` · ${m.duration}` : ""}</div>
              </div>

              <div className="meeting-tags">
                <span className={`tag ${tagStyle[m.type] ?? "tag-default"}`}>{m.type}</span>
                {m.attendees && <span className="tag tag-default">{m.attendees}</span>}
              </div>

              <div className="meeting-summary">{m.key_points}</div>

              {selected?.id === m.id && m.action_items && (
                <div className="meeting-footer">
                  <div className="meeting-attendees">
                    <strong>Action items:</strong> {m.action_items}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right — form */}
        <div className="card">
          <div className="card-label">Add meeting minutes</div>
          <div className="form-group">

            <div className="field">
              <label>Meeting title</label>
              <input
                type="text"
                placeholder="e.g. Sprint 2 planning"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className="form-row">
              <div className="field">
                <label>Date</label>
                <input
                  type="text"
                  placeholder="DD/MM/YYYY"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Duration</label>
                <input
                  type="text"
                  placeholder="e.g. 60 min"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                />
              </div>
            </div>

            <div className="field">
              <label>Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as MeetingType })}
              >
                <option>Daily standup</option>
                <option>Sprint planning</option>
                <option>Backlog refinement</option>
                <option>Sprint review</option>
                <option>Retrospective</option>
                <option>Stakeholder</option>
                <option>1-on-1</option>
                <option>Other</option>
              </select>
            </div>

            <div className="field">
              <label>Attendees</label>
              <input
                type="text"
                placeholder="Names or roles"
                value={form.attendees}
                onChange={(e) => setForm({ ...form, attendees: e.target.value })}
              />
            </div>

            <div className="field">
              <label>Key points & decisions</label>
              <textarea
                rows={4}
                placeholder="What was discussed, decided, agreed?"
                value={form.key_points}
                onChange={(e) => setForm({ ...form, key_points: e.target.value })}
              />
            </div>

            <div className="field">
              <label>Action items</label>
              <textarea
                rows={3}
                placeholder="Who does what by when?"
                value={form.action_items}
                onChange={(e) => setForm({ ...form, action_items: e.target.value })}
              />
            </div>

            <button className="btn btn-solid" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save minutes"}
            </button>

          </div>
        </div>

      </div>
    </main>
  );
}
