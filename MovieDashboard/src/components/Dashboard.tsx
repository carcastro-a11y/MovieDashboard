"use client";
import { useState } from "react";
import { Rail } from "@/data/exampleRails";
import RailBuilder from "./RailBuilder";
import DimensionsTab from "./DimensionsTab";
import MyRails from "./MyRails";

type Tab = "builder" | "dimensions" | "rails";

export default function Dashboard() {
  const [tab, setTab] = useState<Tab>("builder");
  const [userRails, setUserRails] = useState<Rail[]>([]);

  const addRail = (r: Rail) => setUserRails((p) => [...p, r]);
  const updateRail = (r: Rail) => setUserRails((p) => p.map((x) => (x.id === r.id ? r : x)));
  const deleteRail = (id: string) => setUserRails((p) => p.filter((x) => x.id !== id));

  const TABS: { id: Tab; label: string }[] = [
    { id: "builder", label: "Rail Builder" },
    { id: "dimensions", label: "Dimensions" },
    { id: "rails", label: "My Rails" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--base)" }}>
      <header style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(12px)" }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 6, background: "var(--amber)", display: "grid", placeItems: "center", boxShadow: "0 0 14px var(--amber-glow)", flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <circle cx="4" cy="4" r="1.8" fill="#000" /><circle cx="12" cy="4" r="1.8" fill="#000" />
                <circle cx="4" cy="12" r="1.8" fill="#000" /><circle cx="12" cy="12" r="1.8" fill="#000" />
                <line x1="4" y1="4" x2="12" y2="12" stroke="#000" strokeWidth="1.4" />
                <line x1="12" y1="4" x2="4" y2="12" stroke="#000" strokeWidth="1.4" />
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 14, letterSpacing: "-0.01em" }}>PCoA Rail Builder</div>
              <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 1 }}>Movie recommendation engine · 20 dimensions</div>
            </div>
          </div>
          <span className="badge badge-amber">{userRails.length} rail{userRails.length !== 1 ? "s" : ""} saved</span>
        </div>
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 24px", display: "flex", gap: 28 }}>
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`tab-item${tab === t.id ? " active" : ""}`}
              style={{ border: "none", background: "none", cursor: "pointer" }}>
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <main style={{ maxWidth: 1300, margin: "0 auto", padding: "28px 24px", animation: "fadeIn 0.28s ease" }}>
        {tab === "builder" && <RailBuilder onSaveRail={addRail} />}
        {tab === "dimensions" && <DimensionsTab />}
        {tab === "rails" && <MyRails userRails={userRails} onUpdate={updateRail} onDelete={deleteRail} onAdd={addRail} />}
      </main>
    </div>
  );
}
