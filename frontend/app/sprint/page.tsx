"use client";

import { useState } from "react";
import "./sprint.css";

type Status = "backlog" | "inprogress" | "review" | "done";
type Assignee = "C" | "J" | "A";

interface Story {
  id: number;
  title: string;
  points: number;
  assignee: Assignee;
  status: Status;
}

const initialStories: Story[] = [
  // Backlog
  { id: 1,  title: "Password reset flow",          points: 5, assignee: "C", status: "backlog" },
  { id: 2,  title: "Email notification service",   points: 3, assignee: "J", status: "backlog" },
  { id: 3,  title: "API docs — auth endpoints",    points: 2, assignee: "C", status: "backlog" },
  // In progress
  { id: 4,  title: "Auth module — API integration", points: 8, assignee: "C", status: "inprogress" },
  { id: 5,  title: "User profile UI",              points: 5, assignee: "J", status: "inprogress" },
  { id: 6,  title: "Profile data persistence",     points: 5, assignee: "A", status: "inprogress" },
  { id: 7,  title: "Session management",           points: 3, assignee: "J", status: "inprogress" },
  // Review
  { id: 8,  title: "Login page UI",                points: 3, assignee: "A", status: "review" },
  { id: 9,  title: "Register page UI",             points: 3, assignee: "J", status: "review" },
  // Done
  { id: 10, title: "DB schema design",             points: 5, assignee: "C", status: "done" },
  { id: 11, title: "CI/CD pipeline setup",         points: 3, assignee: "C", status: "done" },
  { id: 12, title: "Project scaffolding",          points: 2, assignee: "J", status: "done" },
  { id: 13, title: "Wireframes approved",          points: 1, assignee: "A", status: "done" },
  { id: 14, title: "Env setup for all devs",       points: 2, assignee: "C", status: "done" },
];

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

const assigneeStyle: Record<Assignee, string> = {
  C: "assignee-c",
  J: "assignee-j",
  A: "assignee-a",
};

function pointsDone(stories: Story[]) {
  return stories.filter((s) => s.status === "done").reduce((sum, s) => sum + s.points, 0);
}

function totalPoints(stories: Story[]) {
  return stories.reduce((sum, s) => sum + s.points, 0);
}

export default function SprintBoard() {
  const [stories, setStories] = useState(initialStories);

  // Move a card to the next status when clicked
  const statusOrder: Status[] = ["backlog", "inprogress", "review", "done"];
  function advance(id: number) {
    setStories((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const idx = statusOrder.indexOf(s.status);
        const next = statusOrder[Math.min(idx + 1, statusOrder.length - 1)];
        return { ...s, status: next };
      })
    );
  }

  const done = pointsDone(stories);
  const total = totalPoints(stories);

  return (
    <main className="page">

      {/* Page heading */}
      <div className="page-head">
        <div className="page-head-left">
          <div className="eyebrow">Sprint 1 · Apr 1 – Apr 10</div>
          <h1>Sprint <em>board.</em></h1>
        </div>
        <div className="page-head-right">
          <button className="btn btn-ghost">Sprint report</button>
          <button className="btn btn-solid">+ Story</button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid-4">
        <div className="card">
          <div className="stat-label">Sprint goal</div>
          <p className="sprint-goal-text">
            Auth flow + user profile module. Testable build to QA by end of sprint.
          </p>
        </div>

        <div className="card">
          <div className="stat-label">Points done</div>
          <div className="stat">
            {done}<span className="stat-unit">/{total}</span>
          </div>
        </div>

        <div className="card">
          <div className="stat-label">Days remaining</div>
          <div className="stat">4</div>
          <div className="stat-sub">of 10 · on track</div>
        </div>

        <div className="card">
          <div className="stat-label">Team capacity</div>
          <div className="stat">80<span className="stat-unit">%</span></div>
          <div className="stat-sub">1 member on leave</div>
        </div>
      </div>

      {/* Kanban */}
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
                  className={`story-card ${cardStyle[story.status]}`}
                  onClick={() => advance(story.id)}
                  title="Click to move to next stage"
                >
                  <div className="story-title">{story.title}</div>
                  <div className="story-footer">
                    <span className="story-pts">{story.points} {story.points === 1 ? "pt" : "pts"}</span>
                    <div className={`assignee ${assigneeStyle[story.assignee]}`}>
                      {story.assignee}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

    </main>
  );
}
