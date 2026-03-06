"use client";
import { useState } from "react";
import { Rail, Rule, EXAMPLE_RAILS } from "@/data/exampleRails";
import { DIMS } from "@/data/dimensions";
import { runPreview, countMatches } from "@/lib/railEngine";

let _uid = 0;
const uid = () => `u${Date.now()}_${++_uid}`;

// ── Modal wrapper ────────────────────────────────────────────────────────────
function Modal({ open, onClose, title, children, footer, wide = false }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode; footer?: React.ReactNode; wide?: boolean;
}) {
  if (!open) return null;
  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.72)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "var(--card)", border: "1px solid var(--border-bright)", borderRadius: 11, width: "100%", maxWidth: wide ? 820 : 460, maxHeight: "90vh", display: "flex", flexDirection: "column" }} className="animate-slide-up">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 14px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 15 }}>{title}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 18, lineHeight: 1, padding: "3px 6px" }}>✕</button>
        </div>
        <div style={{ padding: "18px 20px", overflowY: "auto", flex: 1 }}>{children}</div>
        {footer && <div style={{ padding: "14px 20px", borderTop: "1px solid var(--border)", display: "flex", gap: 8, flexShrink: 0 }}>{footer}</div>}
      </div>
    </div>
  );
}

function BtnCancel({ onClick }: { onClick: () => void }) {
  return <button onClick={onClick} style={{ flex: 1, background: "none", border: "1px solid var(--border-bright)", color: "var(--text-secondary)", borderRadius: 6, padding: 8, fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: 11.5, cursor: "pointer" }}>Cancel</button>;
}
function BtnConfirm({ onClick, children, disabled }: { onClick: () => void; children: React.ReactNode; disabled?: boolean }) {
  return <button onClick={onClick} disabled={disabled} className="btn-amber" style={{ flex: 1, border: "none", borderRadius: 6, padding: 8, fontSize: 11.5, cursor: disabled ? "not-allowed" : "pointer" }}>{children}</button>;
}
function BtnDanger({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} style={{ flex: 1, background: "rgba(248,113,113,.12)", color: "#f87171", border: "1px solid rgba(248,113,113,.28)", borderRadius: 6, padding: 8, fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 11.5, cursor: "pointer" }}>{children}</button>;
}

// ── Rule chips ───────────────────────────────────────────────────────────────
function RuleChips({ rules }: { rules: Rule[] }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
      {rules.map((r, i) => (
        <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5, padding: "2px 6px", borderRadius: 9999, background: r.op === ">=" ? "rgba(249,115,22,.1)" : "rgba(96,165,250,.1)", color: r.op === ">=" ? "var(--orange)" : "var(--blue)", border: `1px solid ${r.op === ">=" ? "rgba(249,115,22,.2)" : "rgba(96,165,250,.2)"}` }}>
            {r.dim.replace("PCoA_", "")} {r.op}
          </span>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5, padding: "2px 6px", borderRadius: 9999, background: "rgba(74,222,128,.08)", color: "#4ade80", border: "1px solid rgba(74,222,128,.15)" }}>
            {r.th >= 0 ? "+" : ""}{r.th.toFixed(2)}
          </span>
        </span>
      ))}
    </div>
  );
}

// ── Movie table (for viewer modal) ───────────────────────────────────────────
function ViewerMovieTable({ rules }: { rules: Rule[] }) {
  const { count, movies } = runPreview(rules);
  if (count === 0) return <div style={{ padding: 24, textAlign: "center", color: "var(--text-muted)", fontSize: 12 }}>No movies match these rules</div>;
  return (
    <div>
      <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 10 }}>
        <strong style={{ fontFamily: "'JetBrains Mono',monospace", color: "var(--amber)" }}>{count}</strong> movies match · showing top 20
      </div>
      <div style={{ border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--surface)" }}>
                <th>#</th><th>Title</th><th>Year</th>
                {rules.map((r) => <th key={r.dim}>{r.dim.replace("PCoA_", "")}</th>)}
              </tr>
            </thead>
            <tbody>
              {movies.map((m, idx) => (
                <tr key={m.id}>
                  <td style={{ fontFamily: "'JetBrains Mono',monospace", color: "var(--text-muted)" }}>{idx + 1}</td>
                  <td style={{ color: "var(--text-primary)", whiteSpace: "nowrap" }}>{m.title}</td>
                  <td style={{ fontFamily: "'JetBrains Mono',monospace", color: "var(--text-muted)" }}>{m.year}</td>
                  {rules.map((r) => {
                    const score = m.scores[r.dim];
                    const color = score > 0.2 ? "var(--orange)" : score < -0.2 ? "var(--blue)" : "var(--text-muted)";
                    return <td key={r.dim} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color }}>{score > 0 ? "+" : ""}{score.toFixed(3)}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Rail card ────────────────────────────────────────────────────────────────
function RailCard({ rail, isExample, onView, onEdit, onDup, onDelete }: {
  rail: Rail; isExample: boolean;
  onView: () => void; onEdit?: () => void; onDup: () => void; onDelete?: () => void;
}) {
  const matchCount = countMatches(rail.rules);
  const actBtn: React.CSSProperties = { flex: 1, background: "none", border: "1px solid var(--border)", borderRadius: 5, color: "var(--text-muted)", fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: 10.5, padding: "5px 6px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 3 };
  return (
    <div className={`rail-card ${isExample ? "example" : "user"}`} style={{ padding: 15, display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 12.5, color: "var(--text-primary)" }}>{rail.name}</div>
      {rail.desc && <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{rail.desc}</div>}
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "var(--text-muted)" }}>{matchCount} movies match</div>
      <RuleChips rules={rail.rules} />
      <div style={{ display: "flex", gap: 5, marginTop: 3 }}>
        <button onClick={onView} style={actBtn}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>View
        </button>
        {!isExample && onEdit && <button onClick={onEdit} style={actBtn}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>Edit
        </button>}
        <button onClick={onDup} style={actBtn}>⧉ {isExample ? "Duplicate" : "Copy"}</button>
        {!isExample && onDelete && (
          <button onClick={onDelete} style={{ ...actBtn, flex: "none", padding: "5px 10px" }}>🗑</button>
        )}
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function MyRails({ userRails, onUpdate, onDelete, onAdd }: {
  userRails: Rail[];
  onUpdate: (r: Rail) => void;
  onDelete: (id: string) => void;
  onAdd: (r: Rail) => void;
}) {
  const [exampleSearch, setExampleSearch] = useState("");
  const [examplesOpen, setExamplesOpen] = useState(true);
  const [viewerRail, setViewerRail] = useState<{ rail: Rail; isExample: boolean } | null>(null);
  const [editRail, setEditRail] = useState<Rail | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editRules, setEditRules] = useState<Rule[]>([]);
  const [editDimSel, setEditDimSel] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Rail | null>(null);

  const openEdit = (r: Rail) => {
    setEditRail(r); setEditName(r.name); setEditDesc(r.desc);
    setEditRules(r.rules.map((x) => ({ ...x }))); setEditDimSel("");
  };
  const saveEdit = () => {
    if (!editRail || !editName.trim()) return;
    onUpdate({ ...editRail, name: editName.trim(), desc: editDesc.trim(), rules: editRules.map((x) => ({ ...x })) });
    setEditRail(null);
  };

  const inpStyle: React.CSSProperties = { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text-primary)", fontFamily: "'DM Sans',sans-serif", fontSize: 13, padding: "7px 11px", width: "100%", marginBottom: 8, outline: "none" };
  const selStyle: React.CSSProperties = { flex: 1, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 7, color: "var(--text-primary)", fontFamily: "'DM Sans',sans-serif", fontSize: 13, padding: "8px 12px", cursor: "pointer", outline: "none" };

  const filteredExamples = EXAMPLE_RAILS.filter(
    (r) => !exampleSearch || (r.name + r.desc).toLowerCase().includes(exampleSearch.toLowerCase())
  );

  return (
    <div>
      {/* User rails */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 17, marginBottom: 3 }}>My Rails</div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 14 }}>{userRails.length} saved rail{userRails.length !== 1 ? "s" : ""}</div>
        {userRails.length === 0 ? (
          <div style={{ border: "1px dashed var(--border-bright)", borderRadius: 9, padding: 36, textAlign: "center", color: "var(--text-muted)" }}>
            <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, marginBottom: 4 }}>No rails saved yet</p>
            <p style={{ fontSize: 11 }}>Build one in the Rail Builder tab</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))", gap: 12 }}>
            {userRails.map((r) => (
              <RailCard key={r.id} rail={r} isExample={false}
                onView={() => setViewerRail({ rail: r, isExample: false })}
                onEdit={() => openEdit(r)}
                onDup={() => onAdd({ ...r, id: uid(), name: r.name + " (copy)" })}
                onDelete={() => setDeleteTarget(r)}
              />
            ))}
          </div>
        )}
      </div>

      <div style={{ height: 1, background: "var(--border)", margin: "24px 0" }} />

      {/* Example rails */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
          <div>
            <button onClick={() => setExamplesOpen((p) => !p)}
              style={{ background: "none", border: "none", color: "var(--text-primary)", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 17, cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
              Example Rails
              <span className="badge badge-blue">{EXAMPLE_RAILS.length} rails</span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points={examplesOpen ? "18 15 12 9 6 15" : "6 9 12 15 18 9"} />
              </svg>
            </button>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}>From your PCoA Step 2 model · read-only · duplicate to edit</div>
          </div>
          <div style={{ position: "relative" }}>
            <svg style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--text-muted)" }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input value={exampleSearch} onChange={(e) => setExampleSearch(e.target.value)} placeholder="Filter rails…"
              className="search-input" style={{ padding: "7px 11px 7px 28px", fontSize: 12.5, width: 200 }} />
          </div>
        </div>

        {examplesOpen && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))", gap: 12 }}>
            {filteredExamples.map((r) => (
              <RailCard key={r.id} rail={r} isExample
                onView={() => setViewerRail({ rail: r, isExample: true })}
                onDup={() => onAdd({ ...r, id: uid(), isExample: false })}
              />
            ))}
          </div>
        )}
      </div>

      {/* VIEWER MODAL */}
      <Modal open={!!viewerRail} onClose={() => setViewerRail(null)} title={viewerRail?.rail.name ?? ""} wide
        footer={<>
          <BtnCancel onClick={() => setViewerRail(null)} />
          {viewerRail?.isExample && (
            <BtnConfirm onClick={() => { onAdd({ ...viewerRail.rail, id: uid(), isExample: false }); setViewerRail(null); }}>
              ⧉ Duplicate to My Rails
            </BtnConfirm>
          )}
        </>}>
        {viewerRail && (
          <>
            {viewerRail.rail.desc && <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>{viewerRail.rail.desc}</div>}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, paddingBottom: 14, marginBottom: 14, borderBottom: "1px solid var(--border)" }}>
              {viewerRail.rail.rules.map((r, i) => {
                const dim = DIMS.find((d) => d.id === r.dim);
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 9px", borderRadius: 6, background: "var(--surface)", border: "1px solid var(--border)", fontSize: 11 }}>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "var(--amber)" }}>{dim?.short ?? r.dim}</span>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: r.op === ">=" ? "var(--orange)" : "var(--blue)" }}>{r.op}</span>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "var(--amber)" }}>{r.th >= 0 ? "+" : ""}{r.th.toFixed(3)}</span>
                    <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{r.op === ">=" ? "→ positive" : "← negative"}</span>
                  </div>
                );
              })}
            </div>
            <ViewerMovieTable rules={viewerRail.rail.rules} />
          </>
        )}
      </Modal>

      {/* EDIT MODAL */}
      <Modal open={!!editRail} onClose={() => setEditRail(null)} title="Edit Rail"
        footer={<><BtnCancel onClick={() => setEditRail(null)} /><BtnConfirm onClick={saveEdit} disabled={!editName.trim()}>Save Changes</BtnConfirm></>}>
        {editRail && (
          <>
            <input style={inpStyle} type="text" placeholder="Rail name" value={editName} onChange={(e) => setEditName(e.target.value)} />
            <input style={inpStyle} type="text" placeholder="Description (optional)" value={editDesc} onChange={(e) => setEditDesc(e.target.value)} />
            <div style={{ display: "flex", gap: 8, margin: "12px 0 10px" }}>
              <select value={editDimSel} onChange={(e) => setEditDimSel(e.target.value)} style={selStyle}>
                <option value="">+ Add dimension…</option>
                {DIMS.filter((d) => !editRules.some((r) => r.dim === d.id)).map((d) => (
                  <option key={d.id} value={d.id}>{d.short}</option>
                ))}
              </select>
              <button onClick={() => { if (!editDimSel) return; setEditRules((p) => [...p, { dim: editDimSel, op: ">=", th: 0.3 }]); setEditDimSel(""); }} disabled={!editDimSel}
                className="btn-amber" style={{ border: "none", borderRadius: 7, padding: "8px 14px", fontSize: 12, cursor: editDimSel ? "pointer" : "not-allowed" }}>
                Add
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 240, overflowY: "auto" }}>
              {editRules.map((r, i) => {
                const dim = DIMS.find((d) => d.id === r.dim);
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, padding: 8, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6 }}>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "var(--amber)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{dim?.short ?? r.dim}</span>
                    <div className="op-toggle">
                      {([">=", "<="] as const).map((op) => (
                        <button key={op} onClick={() => setEditRules((p) => p.map((x, j) => j === i ? { ...x, op } : x))}
                          className={`op-btn ${r.op === op ? "active" : "inactive"}`} style={{ border: "none" }}>
                          {op === ">=" ? "≥" : "≤"}
                        </button>
                      ))}
                    </div>
                    <input type="number" value={r.th} step={0.05} min={-1} max={1}
                      onChange={(e) => { const v = parseFloat(e.target.value); if (!isNaN(v)) setEditRules((p) => p.map((x, j) => j === i ? { ...x, th: v } : x)); }}
                      className="threshold-input" style={{ width: 70 }} />
                    <button onClick={() => setEditRules((p) => p.filter((_, j) => j !== i))} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 14, lineHeight: 1 }}>✕</button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </Modal>

      {/* DELETE MODAL */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Rail?"
        footer={<><BtnCancel onClick={() => setDeleteTarget(null)} /><BtnDanger onClick={() => { if (deleteTarget) { onDelete(deleteTarget.id); setDeleteTarget(null); } }}>Delete</BtnDanger></>}>
        <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>"{deleteTarget?.name}" will be permanently deleted.</p>
      </Modal>
    </div>
  );
}
