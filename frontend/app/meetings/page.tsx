"use client";

import { useState } from "react";
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

interface Meeting {
  id: number;
  title: string;
  date: string;
  duration: string;
  type: MeetingType;
  attendees: string;
  keyPoints: string;
  actionItems: string;
}

const tagStyle: Record<MeetingType, string> = {
  "Daily standup":      "tag-purple",
  "Sprint planning":    "tag-purple",
  "Backlog refinement": "tag-purple",
  "Sprint review":      "tag-blue",
  "Retrospective":      "tag-blue",
  "Stakeholder":        "tag-green",
  "1-on-1":             "tag-amber",
  "Other":              "tag-default",
};

const initialMeetings: Meeting[] = [
  {
    id: 1,
    title: "Sprint 1 planning",
    date: "28 Mar · 60 min",
    duration: "60 min",
    type: "Sprint planning",
    attendees: "All team",
    keyPoints: "Agreed sprint goal around auth module. 16 story points committed. Definition of Done reviewed. PO confirmed acceptance criteria for top 5 stories.",
    actionItems: "Nisha to share sprint board by EOD.",
  },
  {
    id: 2,
    title: "Kickoff with Product Owner",
    date: "27 Mar · 45 min",
    duration: "45 min",
    type: "Stakeholder",
    attendees: "Centrine, PO",
    keyPoints: "Q2 roadmap priorities aligned. PO availability confirmed for Wednesday refinements. Backlog grooming process agreed. Sprint 1 scope outlined.",
    actionItems: "PO to review backlog by Friday.",
  },
  {
    id: 3,
    title: "Backlog refinement — session 1",
    date: "1 Apr · 60 min",
    duration: "60 min",
    type: "Backlog refinement",
    attendees: "All team",
    keyPoints: "Sprint 2 backlog groomed. 8 stories estimated. 3 stories split. Payment flow acceptance criteria updated.",
    actionItems: "James to spike on payment gateway by Wed.",
  },
];

const blankForm = {
  title: "",
  date: "",
  duration: "",
  type: "Daily standup" as MeetingType,
  attendees: "",
  keyPoints: "",
  actionItems: "",
};

export default function Meetings() {
  const [meetings, setMeetings] = useState(initialMeetings);
  const [form, setForm] = useState(blankForm);
  const [selected, setSelected] = useState<Meeting | null>(null);

  function handleSave() {
    if (!form.title.trim()) return;

    const newMeeting: Meeting = {
      id: Date.now(),
      ...form,
    };

    setMeetings((prev) => [newMeeting, ...prev]);
    setForm(blankForm);
  }

  return (
    <main className="page">

      {/* Page heading */}
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
          {meetings.map((m) => (
            <div
              key={m.id}
              className="meeting-card"
              onClick={() => setSelected(selected?.id === m.id ? null : m)}
            >
              <div className="meeting-card-head">
                <div className="meeting-title">{m.title}</div>
                <div className="meeting-date">{m.date}</div>
              </div>

              <div className="meeting-tags">
                <span className={`tag ${tagStyle[m.type]}`}>{m.type}</span>
                {m.attendees && (
                  <span className="tag tag-default">{m.attendees}</span>
                )}
              </div>

              <div className="meeting-summary">{m.keyPoints}</div>

              {/* Expanded view */}
              {selected?.id === m.id && m.actionItems && (
                <div className="meeting-footer">
                  <div className="meeting-attendees">
                    <strong>Action items:</strong> {m.actionItems}
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
                value={form.keyPoints}
                onChange={(e) => setForm({ ...form, keyPoints: e.target.value })}
              />
            </div>

            <div className="field">
              <label>Action items</label>
              <textarea
                rows={3}
                placeholder="Who does what by when?"
                value={form.actionItems}
                onChange={(e) => setForm({ ...form, actionItems: e.target.value })}
              />
            </div>

            <button className="btn btn-solid" onClick={handleSave}>
              Save minutes
            </button>

          </div>
        </div>

      </div>
    </main>
  );
}
