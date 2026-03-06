"use client";
import { useState } from "react";
import { DIMS } from "@/data/dimensions";

export default function DimensionsTab() {
  const [search, setSearch] = useState("");
  const filtered = DIMS.filter(
    (d) => !search || (d.id + d.neg + d.pos + d.short).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 17, marginBottom: 3 }}>PCoA Dimensions</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>20 dimensions · Weighted Manhattan PCoA analysis</div>
        </div>
        <div style={{ position: "relative" }}>
          <svg style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search dimensions…"
            className="search-input" style={{ padding: "7px 11px 7px 28px", fontSize: 12.5, width: 210 }} />
        </div>
      </div>

      <div style={{ border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
        <table className="data-table" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--surface)" }}>
              <th>Dim</th><th>Short Label</th><th>← Negative Axis</th><th>Positive Axis →</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((d, i) => (
              <tr key={d.id} style={{ background: i % 2 === 0 ? "var(--card)" : "var(--surface)" }}>
                <td>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700, background: "var(--amber-dim)", color: "var(--amber)", padding: "2px 7px", borderRadius: 4 }}>
                    {d.id.replace("PCoA_", "")}
                  </span>
                </td>
                <td style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "var(--text-secondary)" }}>{d.short}</td>
                <td><span style={{ background: "rgba(96,165,250,.07)", color: "var(--blue)", padding: "2px 7px", borderRadius: 4, fontSize: 11 }}>← {d.neg}</span></td>
                <td><span style={{ background: "rgba(249,115,22,.07)", color: "var(--orange)", padding: "2px 7px", borderRadius: 4, fontSize: 11 }}>{d.pos} →</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
