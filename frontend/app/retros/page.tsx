"use client";

import { useState, useEffect, KeyboardEvent } from "react";
import { retroApi, RetroCard } from "@/lib/api";
import "./retros.css";

type ColKey = "went-well" | "improve" | "actions";

const columns: { key: ColKey; label: string; headClass: string }[] = [
  { key: "went-well", label: "Went well",          headClass: "retro-col-head--green"  },
  { key: "improve",   label: "Needs improvement",  headClass: "retro-col-head--amber"  },
  { key: "actions",   label: "Actions next sprint", headClass: "retro-col-head--purple" },
];

const SPRINT = "Sprint 1";

export default function Retros() {
  const [cards,   setCards]   = useState<RetroCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [drafts,  setDrafts]  = useState<Record<ColKey, string>>({
    "went-well": "",
    "improve":   "",
    "actions":   "",
  });

  async function fetchCards() {
    try {
      const data = await retroApi.getAll(SPRINT);
      setCards(data);
    } catch (err) {
      console.error("Failed to fetch retro cards:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchCards(); }, []);

  async function addCard(colKey: ColKey) {
    const text = drafts[colKey].trim();
    if (!text) return;
    setDrafts((prev) => ({ ...prev, [colKey]: "" }));
    try {
      await retroApi.create({ text, column: colKey, sprint: SPRINT });
      await fetchCards();
    } catch (err) {
      console.error("Failed to add card:", err);
    }
  }

  async function deleteCard(id: number) {
    // Optimistic removal
    setCards((prev) => prev.filter((c) => c.id !== id));
    try {
      await retroApi.remove(id);
    } catch (err) {
      console.error("Failed to delete card:", err);
      await fetchCards();
    }
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>, colKey: ColKey) {
    if (e.key === "Enter") addCard(colKey);
  }

  return (
    <main className="page">

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

      {loading ? (
        <p style={{ color: "var(--ink4)", fontSize: "var(--text-sm)" }}>Loading board...</p>
      ) : (
        <div className="grid-3">
          {columns.map((col) => {
            const colCards = cards.filter((c) => c.column === col.key);
            return (
              <div key={col.key}>

                <div className={`retro-col-head ${col.headClass}`}>
                  {col.label}
                </div>

                <div className="retro-col-body">

                  {colCards.map((card) => (
                    <div key={card.id} className="retro-card">
                      <span className="retro-card-text">{card.text}</span>
                      <button
                        className="retro-card-delete"
                        onClick={() => deleteCard(card.id)}
                        aria-label="Remove card"
                      >
                        ×
                      </button>
                    </div>
                  ))}

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
            );
          })}
        </div>
      )}

    </main>
  );
}
