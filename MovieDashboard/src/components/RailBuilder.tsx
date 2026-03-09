"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { DIMS } from "@/data/dimensions";
import { Rule, Rail } from "@/data/exampleRails";
import { runPreview } from "@/lib/railEngine";

let _uid = 0;
const uid = () => `u${Date.now()}_${++_uid}`;

function DimSlider({ value, op, onChange }: { value: number; op: ">=" | "<="; onChange: (v: number) => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const MIN = -1, MAX = 1;
  const pct = (v: number) => ((v - MIN) / (MAX - MIN)) * 100;
  const fromPct = (p: number) => parseFloat((MIN + (p / 100) * (MAX - MIN)).toFixed(2));
  const clamp = (v: number) => Math.max(MIN, Math.min(MAX, v));

  const getVal = useCallback((clientX: number) => {
    if (!trackRef.current) return value;
    const rect = trackRef.current.getBoundingClientRect();
    const p = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    return clamp(fromPct(p));
  }, [value]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => { if (dragging.current) onChange(getVal(e.clientX)); };
    const onTouch = (e: TouchEvent) => { if (dragging.current) { e.preventDefault(); onChange(getVal(e.touches[0].clientX)); } };
    const onUp = () => { dragging.current = false; };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("touchmove", onTouch, { passive: false });
    document.addEventListener("mouseup", onUp);
    document.addEventListener("touchend", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("touchmove", onTouch);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("touchend", onUp);
    };
  }, [getVal, onChange]);

  const p = pct(value);
  const fillColor = op === ">=" ? "#f97316" : "#60a5fa";

  return (
    <div ref={trackRef}
      onClick={(e) => { if ((e.target as HTMLElement).dataset.thumb) return; onChange(getVal(e.clientX)); }}
      style={{ position: "relative", height: 28, display: "flex", alignItems: "center", cursor: "pointer", userSelect: "none", touchAction: "none" }}>
      <div style={{ position: "absolute", left: 0, right: 0, height: 4, background: "var(--border)", borderRadius: 9999, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, height: "100%", background: fillColor, borderRadius: 9999, left: op === ">=" ? `${p}%` : "0", width: op === ">=" ? `${100 - p}%` : `${p}%` }} />
      </div>
      <div data-thumb="1"
        onMouseDown={(e) => { e.preventDefault(); dragging.current = true; }}
        onTouchStart={(e) => { e.preventDefault(); dragging.current = true; }}
        style={{ position: "absolute", left: `${p}%`, width: 16, height: 16, borderRadius: "50%", background: "var(--surface)", border: "2.5px solid var(--amber)", transform: "translate(-50%,-50%)", top: "50%", cursor: "grab", boxShadow: "0 0 8px var(--amber-glow)", pointerEvents: "all" }} />
    </div>
  );
}

function ScoreCell({ score }: { score: number }) {
  const color = score > 0.2 ? "var(--orange)" : score < -0.2 ? "var(--blue)" : "var(--text-muted)";
  return <td style={{ padding: "8px 12px", borderBottom: "1px solid var(--border)", fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color }}>{score > 0 ? "+" : ""}{score.toFixed(3)}</td>;
}

export default function RailBuilder({ onSaveRail }: { onSaveRail: (r: Rail) => void }) {
  const [rules, setRules] = useState<Rule[]>([]);
  const [selectedDim, setSelectedDim] = useState("");
  const [sortDim, setSortDim] = useState<string | undefined>();
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [railName, setRailName] = useState("");
  const [railDesc, setRailDesc] = useState("");
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [saveOk, setSaveOk] = useState(false);

  const usedDims = new Set(rules.map((r) => r.dim));
  const availDims = DIMS.filter((d) => !usedDims.has(d.id));

  const addRule = () => {
    if (!selectedDim) return;
    setRules((p) => [...p, { dim: selectedDim, op: ">=", th: 0.3 }]);
    setSelectedDim("");
  };
  const removeRule = (i: number) => setRules((p) => p.filter((_, j) => j !== i));
  const setOp = (i: number, op: ">=" | "<=") => setRules((p) => p.map((r, j) => j === i ? { ...r, op } : r));
  const setTh = (i: number, th: number) => setRules((p) => p.map((r, j) => j === i ? { ...r, th } : r));
  const toggleSort = (dim: string) => {
    if (sortDim === dim) setSortDir((d) => d === "desc" ? "asc" : "desc");
    else { setSortDim(dim); setSortDir("desc"); }
  };
  const doSave = () => {
    if (!railName.trim() || !rules.length) return;
    onSaveRail({ id: uid(), name: railName.trim(), desc: railDesc.trim(), rules: rules.map((r) => ({ ...r })) });
    setRailName(""); setRailDesc(""); setShowSaveForm(false);
    setSaveOk(true); setTimeout(() => setSaveOk(false), 2200);
  };

  const { count, excluded, movies } = runPreview(rules, undefined, sortDim, sortDir);

  const inpStyle: React.CSSProperties = { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text-primary)", fontFamily: "'DM Sans',sans-serif", fontSize: 13, padding: "7px 11px", width: "100%", marginBottom: 8, outline: "none" };
  const selStyle: React.CSSProperties = { flex: 1, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 7, color: "var(--text-primary)", fontFamily: "'DM Sans',sans-serif", fontSize: 13, padding: "8px 12px", cursor: "pointer", outline: "none" };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "min(420px,100%) 1fr", gap: 28, alignItems: "start" }}>
      {/* LEFT */}
      <div>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 17, marginBottom: 3 }}>Build Your Rail</div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 16 }}>Select dimensions and drag the slider to set your threshold</div>

        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <select value={selectedDim} onChange={(e) => setSelectedDim(e.target.value)} style={selStyle}>
            <option value="">+ Add dimension…</option>
            {availDims.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <button onClick={addRule} disabled={!selectedDim} className="btn-amber"
            style={{ border: "none", borderRadius: 7, padding: "8px 16px", fontSize: 12, cursor: selectedDim ? "pointer" : "not-allowed", display: "flex", alignItems: "center", gap: 5 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>Add
          </button>
        </div>

        {rules.length === 0 ? (
          <div style={{ border: "1px dashed var(--border-bright)", borderRadius: 9, padding: 36, textAlign: "center", color: "var(--text-muted)" }}>
            <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, marginBottom: 4 }}>No rules yet</p>
            <p style={{ fontSize: 11 }}>Select a dimension above and click Add</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {rules.map((rule, i) => {
              const dim = DIMS.find((d) => d.id === rule.dim)!;
              return (
                <div key={rule.dim} className="rule-row" style={{ borderRadius: "0 8px 8px 0", padding: "14px 14px 12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, fontWeight: 700, color: "var(--amber)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{dim.name}</span>
                    <div className="op-toggle">
                      {([">=", "<="] as const).map((op) => (
                        <button key={op} onClick={() => setOp(i, op)} className={`op-btn ${rule.op === op ? "active" : "inactive"}`} style={{ border: "none" }}>
                          {op === ">=" ? "≥" : "≤"}
                        </button>
                      ))}
                    </div>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "var(--amber)", minWidth: 52, textAlign: "right", flexShrink: 0 }}>{rule.th >= 0 ? "+" : ""}{rule.th.toFixed(2)}</span>
                    <button onClick={() => removeRule(i)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 15, lineHeight: 1, padding: "2px 4px", flexShrink: 0 }}>✕</button>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 9.5 }}>
                    <span style={{ color: "var(--blue)" }}>← {dim.neg}</span>
                    <span style={{ color: "var(--orange)" }}>{dim.pos} →</span>
                  </div>
                  <DimSlider value={rule.th} op={rule.op} onChange={(v) => setTh(i, v)} />
                  <div style={{ height: 8 }} />
                </div>
              );
            })}
          </div>
        )}

        {rules.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <button onClick={() => setShowSaveForm((p) => !p)}
              style={{ background: "none", border: "1px solid var(--border-bright)", color: "var(--text-secondary)", borderRadius: 7, padding: "8px 14px", fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: 11.5, cursor: "pointer", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
              Save Rail ({rules.length} rule{rules.length !== 1 ? "s" : ""})
            </button>
            {showSaveForm && (
              <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, padding: 14, marginTop: 10 }} className="animate-slide-up">
                <input style={inpStyle} type="text" placeholder="Rail name (required)" value={railName} onChange={(e) => setRailName(e.target.value)} />
                <input style={inpStyle} type="text" placeholder="Description (optional)" value={railDesc} onChange={(e) => setRailDesc(e.target.value)} />
                <button onClick={doSave} disabled={!railName.trim()} className="btn-amber"
                  style={{ border: "none", borderRadius: 6, padding: "9px 16px", fontSize: 12, width: "100%" }}>
                  Save Rail
                </button>
                {saveOk && <p style={{ fontSize: 11, color: "#4ade80", textAlign: "center", marginTop: 8 }}>✓ Rail saved!</p>}
              </div>
            )}
          </div>
        )}
      </div>

      {/* RIGHT */}
      <div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 17 }}>Preview Results</div>
            {excluded > 0 && <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{excluded} excluded</div>}
          </div>
          {rules.length > 0 && (
            <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
              <span className="match-count" style={{ fontSize: 38, fontWeight: 700, lineHeight: 1 }}>{count}</span>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>movies match</span>
            </div>
          )}
        </div>

        {rules.length === 0 ? (
          <div style={{ border: "1px dashed var(--border-bright)", borderRadius: 9, padding: 36, textAlign: "center", color: "var(--text-muted)" }}>
            <p style={{ fontSize: 11 }}>Add rules to preview movies</p>
          </div>
        ) : count === 0 ? (
          <div style={{ border: "1px dashed var(--border-bright)", borderRadius: 9, padding: 36, textAlign: "center", color: "var(--text-muted)" }}>
            <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, marginBottom: 4 }}>No movies match</p>
            <p style={{ fontSize: 11 }}>Try adjusting your thresholds</p>
          </div>
        ) : (
          <div style={{ border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden", background: "var(--card)" }}>
            <div style={{ overflowX: "auto" }}>
              <table className="data-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "var(--surface)" }}>
                    <th>Title</th><th>Year</th>
                    {rules.map((r) => (
                      <th key={r.dim} onClick={() => toggleSort(r.dim)}>
                        {r.dim.replace("PCoA_", "")}
                        <span style={{ marginLeft: 3, opacity: sortDim === r.dim ? 1 : 0.4, color: "var(--amber)" }}>
                          {sortDim === r.dim ? (sortDir === "desc" ? "↓" : "↑") : "↕"}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {movies.map((m) => (
                    <tr key={m.id}>
                      <td style={{ color: "var(--text-primary)", whiteSpace: "nowrap" }}>{m.title}</td>
                      <td style={{ fontFamily: "'JetBrains Mono',monospace", color: "var(--text-muted)" }}></td>
                      {rules.map((r) => <ScoreCell key={r.dim} score={m.scores[r.dim]} />)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {count > 20 && <div style={{ padding: "9px 12px", fontSize: 10.5, color: "var(--text-muted)", borderTop: "1px solid var(--border)" }}>Top 20 of {count} matches</div>}
          </div>
        )}
      </div>
    </div>
  );
}
