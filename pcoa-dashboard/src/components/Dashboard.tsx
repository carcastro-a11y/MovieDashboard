"use client";
import { useState } from "react";
import RailBuilder from "./RailBuilder";
import DimensionsTab from "./DimensionsTab";
import MyRails from "./MyRails";
import { Rail } from "@/data/exampleRails";

const TABS = [
  { id: "builder", label: "Rail Builder" },
  { id: "dimensions", label: "Dimensions" },
  { id: "rails", label: "My Rails" },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("builder");
  const [userRails, setUserRails] = useState<Rail[]>([]);

  const addRail = (rail: Rail) => setUserRails((p) => [...p, rail]);
  const updateRail = (rail: Rail) => setUserRails((p) => p.map((r) => (r.id === rail.id ? rail : r)));
  const deleteRail = (id: string) => setUserRails((p) => p.filter((r) => r.id !== id));

  return (
    <div className="min-h-screen" style={{ background: "var(--base)" }}>
      {/* Header */}
      <header style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className="w-8 h-8 rounded flex items-center justify-center"
              style={{ background: "var(--amber)", boxShadow: "0 0 16px var(--amber-glow)" }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="4" cy="4" r="2" fill="#000" />
                <circle cx="12" cy="4" r="2" fill="#000" />
                <circle cx="4" cy="12" r="2" fill="#000" />
                <circle cx="12" cy="12" r="2" fill="#000" />
                <line x1="4" y1="4" x2="12" y2="12" stroke="#000" strokeWidth="1.5" />
                <line x1="12" y1="4" x2="4" y2="12" stroke="#000" strokeWidth="1.5" />
              </svg>
            </div>
            <div>
              <h1 className="font-display font-800 text-base leading-none" style={{ color: "var(--text-primary)", fontWeight: 800 }}>
                PCoA Rail Builder
              </h1>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                Movie recommendation engine · 20 dimensions
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge badge-amber">{userRails.length} rails saved</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="flex gap-8">
            {TABS.map((t) => (
              <button
                key={t.id}
                className={`tab-item ${activeTab === t.id ? "active" : ""}`}
                onClick={() => setActiveTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-screen-xl mx-auto px-6 py-8 animate-fade-in">
        {activeTab === "builder" && (
          <RailBuilder userRails={userRails} onSave={addRail} />
        )}
        {activeTab === "dimensions" && <DimensionsTab />}
        {activeTab === "rails" && (
          <MyRails
            userRails={userRails}
            onUpdate={updateRail}
            onDelete={deleteRail}
            onAdd={addRail}
          />
        )}
      </main>
    </div>
  );
}
