"use client";
import { useState } from "react";
import { DIMS } from "@/data/dimensions";

export default function DimensionsTab() {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = DIMS.filter(
    (d) =>
      !search ||
      (d.id + d.name + d.neg + d.pos)
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: 18,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'Syne',sans-serif",
              fontWeight: 700,
              fontSize: 17,
              marginBottom: 3,
            }}
          >
            PCoA Dimensions
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
            20 dimensions · Weighted Manhattan PCoA analysis · Click any row to
            expand features
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <svg
            style={{
              position: "absolute",
              left: 9,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
              pointerEvents: "none",
            }}
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dimensions…"
            className="search-input"
            style={{ padding: "7px 11px 7px 28px", fontSize: 12.5, width: 210 }}
          />
        </div>
      </div>

      {/* Dimension Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {filtered.map((d, i) => {
          const isOpen = expanded === d.id;
          const dimNum = parseInt(d.id.replace("PCoA_Dim", ""));
          return (
            <div
              key={d.id}
              style={{
                border: `1px solid ${isOpen ? "var(--amber)" : "var(--border)"}`,
                borderRadius: 8,
                overflow: "hidden",
                background: i % 2 === 0 ? "var(--card)" : "var(--surface)",
                transition: "border-color 0.15s",
              }}
            >
              {/* Row header — always visible */}
              <div
                onClick={() => setExpanded(isOpen ? null : d.id)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "52px 1fr 1fr 1fr 24px",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 14px",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                {/* Dim badge */}
                <span
                  style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: 10,
                    fontWeight: 700,
                    background: "var(--amber-dim)",
                    color: "var(--amber)",
                    padding: "3px 7px",
                    borderRadius: 4,
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  Dim {dimNum}
                </span>

                {/* Axis name */}
                <div>
                  <div
                    style={{
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      lineHeight: 1.3,
                    }}
                  >
                    {d.name}
                  </div>
                  {d.note && (
                    <div
                      style={{
                        fontSize: 10,
                        color: "var(--amber)",
                        marginTop: 2,
                      }}
                    >
                      ⚠ Usage note
                    </div>
                  )}
                </div>

                {/* Neg pole */}
                <div style={{ fontSize: 11, lineHeight: 1.35 }}>
                  <span
                    style={{
                      display: "inline-block",
                      background: "rgba(96,165,250,.08)",
                      color: "var(--blue)",
                      padding: "2px 7px",
                      borderRadius: 4,
                    }}
                  >
                    ← {d.neg}
                  </span>
                </div>

                {/* Pos pole */}
                <div style={{ fontSize: 11, lineHeight: 1.35 }}>
                  <span
                    style={{
                      display: "inline-block",
                      background: "rgba(249,115,22,.08)",
                      color: "var(--orange)",
                      padding: "2px 7px",
                      borderRadius: 4,
                    }}
                  >
                    {d.pos} →
                  </span>
                </div>

                {/* Chevron */}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  style={{
                    color: "var(--text-muted)",
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.15s",
                    flexShrink: 0,
                  }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>

              {/* Expanded panel */}
              {isOpen && (
                <div
                  style={{
                    borderTop: "1px solid var(--border)",
                    padding: "14px 16px 16px",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                  }}
                >
                  {/* Positive features */}
                  <div>
                    <div
                      style={{
                        fontSize: 10.5,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "var(--orange)",
                        marginBottom: 8,
                      }}
                    >
                      [+] {d.pos}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 5,
                      }}
                    >
                      {d.posFeatures.map((f, fi) => (
                        <div
                          key={fi}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <div
                            style={{
                              width: `${(f.corr / 0.85) * 100}%`,
                              maxWidth: "55%",
                              minWidth: 30,
                              height: 4,
                              borderRadius: 2,
                              background: `rgba(249,115,22,${0.3 + f.corr * 0.8})`,
                              flexShrink: 0,
                            }}
                          />
                          <span
                            style={{
                              fontSize: 11,
                              color: "var(--text-secondary)",
                              flex: 1,
                            }}
                          >
                            {f.label}
                          </span>
                          <span
                            style={{
                              fontFamily: "'JetBrains Mono',monospace",
                              fontSize: 10,
                              color: "var(--orange)",
                              flexShrink: 0,
                            }}
                          >
                            +{f.corr.toFixed(3)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Negative features */}
                  <div>
                    <div
                      style={{
                        fontSize: 10.5,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "var(--blue)",
                        marginBottom: 8,
                      }}
                    >
                      [−] {d.neg}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 5,
                      }}
                    >
                      {d.negFeatures.map((f, fi) => (
                        <div
                          key={fi}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <div
                            style={{
                              width: `${(Math.abs(f.corr) / 0.7) * 100}%`,
                              maxWidth: "55%",
                              minWidth: 30,
                              height: 4,
                              borderRadius: 2,
                              background: `rgba(96,165,250,${0.25 + Math.abs(f.corr) * 0.9})`,
                              flexShrink: 0,
                            }}
                          />
                          <span
                            style={{
                              fontSize: 11,
                              color: "var(--text-secondary)",
                              flex: 1,
                            }}
                          >
                            {f.label}
                          </span>
                          <span
                            style={{
                              fontFamily: "'JetBrains Mono',monospace",
                              fontSize: 10,
                              color: "var(--blue)",
                              flexShrink: 0,
                            }}
                          >
                            {f.corr.toFixed(3)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Usage note */}
                  {d.note && (
                    <div
                      style={{
                        gridColumn: "1 / -1",
                        background: "rgba(245,158,11,.06)",
                        border: "1px solid rgba(245,158,11,.2)",
                        borderRadius: 6,
                        padding: "8px 12px",
                        fontSize: 11,
                        color: "var(--text-secondary)",
                        lineHeight: 1.5,
                      }}
                    >
                      <span style={{ color: "var(--amber)", fontWeight: 700 }}>
                        ⚠ Guidance:{" "}
                      </span>
                      {d.note}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
