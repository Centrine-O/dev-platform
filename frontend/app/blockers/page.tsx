"use client";

import { useState } from "react";
import "./blockers.css";

type Severity = "High" | "Med" | "Low";
type BlockerStatus = "active" | "resolved";

interface Blocker {
  id: number;
  title: string;
  meta: string;
  severity: Severity;
  status: BlockerStatus;
}

const barClass: Record<Severity, string> = {
  High: "blocker-bar--high",
  Med:  "blocker-bar--med",
  Low:  "blocker-bar--low",
};

const badgeClass: Record<Severity, string> = {
  High: "badge--high",
  Med:  "badge--med",
  Low:  "badge--low",
};

const initialBlockers: Blocker[] = [
  {
    id: 1,
    title: "QA environment not provisioned — blocking entire testing pipeline",
    meta: "Owner: DevOps · Raised: 30 Mar · Due: today",
    severity: "High",
    status: "active",
  },
  {
    id: 2,
    title: "PO unavailable for story clarification on payment flow",
    meta: "Owner: Centrine · Raised: 31 Mar · Scheduled: tomorrow",
    severity: "Med",
    status: "active",
  },
  {
    id: 3,
    title: "DB access credentials missing for two devs",
    meta: "Resolved: 29 Mar · took 2 days",
    severity: "Low",
    status: "resolved",
  },
  {
    id: 4,
    title: "Design files not finalised before sprint start",
    meta: "Resolved: 28 Mar · took 1 day",
    severity: "Low",
    status: "resolved",
  },
];

const blankForm = {
  title: "",
  severity: "High" as Severity,
  owner: "",
  impact: "",
};

export default function Blockers() {
  const [blockers, setBlockers] = useState(initialBlockers);
  const [form, setForm] = useState(blankForm);

  const active   = blockers.filter((b) => b.status === "active");
  const resolved = blockers.filter((b) => b.status === "resolved");

  function resolve(id: number) {
    setBlockers((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, status: "resolved", meta: `${b.meta.split("·")[0].trim()} · Resolved: today` }
          : b
      )
    );
  }

  function handleSave() {
    if (!form.title.trim()) return;

    const newBlocker: Blocker = {
      id: Date.now(),
      title: form.title,
      meta: `Owner: ${form.owner || "—"} · Raised: today${form.impact ? ` · Impact: ${form.impact}` : ""}`,
      severity: form.severity,
      status: "active",
    };

    setBlockers((prev) => [newBlocker, ...prev]);
    setForm(blankForm);
  }

  return (
    <main className="page">

      {/* Page heading */}
      <div className="page-head">
        <div className="page-head-left">
          <div className="eyebrow">Sprint 1</div>
          <h1>Blockers & <em>impediments.</em></h1>
        </div>
        <div className="page-head-right">
          <button className="btn btn-solid" style={{ width: "auto" }}>+ Log blocker</button>
        </div>
      </div>

      <div className="grid-2">

        {/* Left — blocker list */}
        <div>
          <div className="section-label">Active — {active.length} open</div>

          {active.map((b) => (
            <div key={b.id} className="blocker">
              <div className={`blocker-bar ${barClass[b.severity]}`} />
              <div className="blocker-body">
                <div className="blocker-title">{b.title}</div>
                <div className="blocker-meta">{b.meta}</div>
              </div>
              <div className="blocker-right">
                <span className={`badge ${badgeClass[b.severity]}`}>{b.severity}</span>
                <button className="resolve-btn" onClick={() => resolve(b.id)}>
                  Mark resolved
                </button>
              </div>
            </div>
          ))}

          <div className="divider" />

          <div className="section-label">Resolved this sprint</div>

          {resolved.map((b) => (
            <div key={b.id} className="blocker blocker--resolved">
              <div className="blocker-bar blocker-bar--done" />
              <div className="blocker-body">
                <div className="blocker-title">{b.title}</div>
                <div className="blocker-meta">{b.meta}</div>
              </div>
              <div className="blocker-right">
                <span className="badge badge--done">Done</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right — form */}
        <div className="card">
          <div className="card-label">Log a blocker</div>
          <div className="form-group">

            <div className="field">
              <label>Description</label>
              <textarea
                rows={3}
                placeholder="What is blocking the team?"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className="form-row">
              <div className="field">
                <label>Severity</label>
                <select
                  value={form.severity}
                  onChange={(e) => setForm({ ...form, severity: e.target.value as Severity })}
                >
                  <option>High</option>
                  <option>Med</option>
                  <option>Low</option>
                </select>
              </div>
              <div className="field">
                <label>Owner</label>
                <input
                  type="text"
                  placeholder="Who resolves this?"
                  value={form.owner}
                  onChange={(e) => setForm({ ...form, owner: e.target.value })}
                />
              </div>
            </div>

            <div className="field">
              <label>Impact</label>
              <textarea
                rows={2}
                placeholder="What work is affected?"
                value={form.impact}
                onChange={(e) => setForm({ ...form, impact: e.target.value })}
              />
            </div>

            <button className="btn btn-solid" onClick={handleSave}>
              Log blocker
            </button>

          </div>
        </div>

      </div>
    </main>
  );
}
