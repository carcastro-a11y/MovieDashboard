"use client";
import { useState } from "react";
import { DIMENSIONS } from "@/data/dimensions";
import { Search } from "lucide-react";

export default function DimensionsTab() {
  const [query, setQuery] = useState("");

  const filtered = DIMENSIONS.filter(
    (d) =>
      d.id.toLowerCase().includes(query.toLowerCase()) ||
      d.neg.toLowerCase().includes(query.toLowerCase()) ||
      d.pos.toLowerCase().includes(query.toLowerCase()) ||
      d.short.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-display text-xl font-700" style={{ fontWeight: 700 }}>
            PCoA Dimensions
          </h2>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            20 dimensions from Weighted Manhattan PCoA analysis · hover to explore axis labels
          </p>
        </div>
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
          <input
            className="search-input pl-8 pr-3 py-2 text-sm w-64"
            placeholder="Search dimensions…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--border)" }}>
        <table className="data-table w-full">
          <thead style={{ background: "var(--surface)" }}>
            <tr>
              <th style={{ width: 110 }}>Dimension</th>
              <th style={{ width: 120 }}>Short Label</th>
              <th>Negative Axis ←</th>
              <th>Positive Axis →</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((dim, i) => (
              <tr key={dim.id} style={{ background: i % 2 === 0 ? "var(--card)" : "var(--surface)" }}>
                <td>
                  <span
                    className="font-mono text-xs font-semibold px-2 py-1 rounded"
                    style={{ background: "var(--amber-dim)", color: "var(--amber)" }}
                  >
                    {dim.id.replace("PCoA_", "")}
                  </span>
                </td>
                <td className="font-mono text-xs" style={{ color: "var(--text-secondary)" }}>
                  {dim.short}
                </td>
                <td>
                  <span
                    className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-md"
                    style={{ background: "rgba(96,165,250,0.08)", color: "var(--blue)" }}
                  >
                    <span className="opacity-60">←</span>
                    {dim.neg}
                  </span>
                </td>
                <td>
                  <span
                    className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-md"
                    style={{ background: "rgba(249,115,22,0.08)", color: "var(--orange)" }}
                  >
                    {dim.pos}
                    <span className="opacity-60">→</span>
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-8" style={{ color: "var(--text-muted)" }}>
                  No dimensions match &ldquo;{query}&rdquo;
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
        Source: <span className="font-mono">dimensions_labels.json</span> · Generated from{" "}
        <span className="font-mono">Dimension Breakthrough (1).pdf</span>
      </p>
    </div>
  );
}
