"use client";

import { useState, KeyboardEvent } from "react";
import "./retros.css";

type ColKey = "went-well" | "improve" | "actions";

interface RetroCard {
  id: number;
  text: string;
}

interface RetroColumn {
  key: ColKey;
  label: string;
  headClass: string;
  cards: RetroCard[];
}

const initialColumns: RetroColumn[] = [
  {
    key: "went-well",
    label: "Went well",
    headClass: "retro-col-head--green",
    cards: [
      { id: 1, text: "Team adapted quickly to daily standups — no resistance at all." },
      { id: 2, text: "Clear sprint goal from day one, no scope confusion mid-sprint." },
      { id: 3, text: "Strong collaboration between front and back-end dev." },
      { id: 4, text: "Blockers surfaced faster in week 2 than week 1." },
    ],
  },
  {
    key: "improve",
    label: "Needs improvement",
    headClass: "retro-col-head--amber",
    cards: [
      { id: 5, text: "Blockers not raised until they were already causing delays." },
      { id: 6, text: "Backlog not fully refined before sprint start." },
      { id: 7, text: "Estimation variance too high — needs calibration." },
      { id: 8, text: "Mid-sprint PO communication was patchy." },
    ],
  },
  {
    key: "actions",
    label: "Actions next sprint",
    headClass: "retro-col-head--purple",
    cards: [
      { id: 9,  text: "Blockers flagged in standup — not after the meeting ends." },
      { id: 10, text: "Refinement session midway through sprint — locked in calendar." },
      { id: 11, text: "Planning poker for all stories above 3 points." },
      { id: 12, text: "Weekly async update to PO via shared doc." },
    ],
  },
];

export default function Retros() {
  const [columns, setColumns] = useState(initialColumns);
  const [drafts, setDrafts] = useState<Record<ColKey, string>>({
    "went-well": "",
    "improve": "",
    "actions": "",
  });

  function addCard(colKey: ColKey) {
    const text = drafts[colKey].trim();
    if (!text) return;

    setColumns((prev) =>
      prev.map((col) =>
        col.key === colKey
          ? { ...col, cards: [...col.cards, { id: Date.now(), text }] }
          : col
      )
    );
    setDrafts((prev) => ({ ...prev, [colKey]: "" }));
  }

  function deleteCard(colKey: ColKey, cardId: number) {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === colKey
          ? { ...col, cards: col.cards.filter((c) => c.id !== cardId) }
          : col
      )
    );
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>, colKey: ColKey) {
    if (e.key === "Enter") addCard(colKey);
  }

  return (
    <main className="page">

      {/* Page heading */}
      <div className="page-head">
        <div className="page-head-left">
          <div className="eyebrow">Sprint 1 · end of sprint</div>
          <h1>Retrospective <em>board.</em></h1>
        </div>
        <div className="page-head-right">
          <button className="btn btn-ghost">Export</button>
          <button className="btn btn-solid">+ Card</button>
        </div>
      </div>

      {/* Three columns */}
      <div className="grid-3">
        {columns.map((col) => (
          <div key={col.key}>

            {/* Column header */}
            <div className={`retro-col-head ${col.headClass}`}>
              {col.label}
            </div>

            {/* Column body */}
            <div className="retro-col-body">

              {/* Cards */}
              {col.cards.map((card) => (
                <div key={card.id} className="retro-card">
                  <span className="retro-card-text">{card.text}</span>
                  <button
                    className="retro-card-delete"
                    onClick={() => deleteCard(col.key, card.id)}
                    aria-label="Remove card"
                  >
                    ×
                  </button>
                </div>
              ))}

              {/* Add card */}
              <div className="add-card">
                <input
                  type="text"
                  placeholder="Add a card..."
                  value={drafts[col.key]}
                  onChange={(e) =>
                    setDrafts((prev) => ({ ...prev, [col.key]: e.target.value }))
                  }
                  onKeyDown={(e) => handleKey(e, col.key)}
                />
                <button
                  className="add-card-btn"
                  onClick={() => addCard(col.key)}
                  aria-label="Add card"
                >
                  +
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>

    </main>
  );
}
