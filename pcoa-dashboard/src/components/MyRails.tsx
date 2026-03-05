"use client";
import { useState } from "react";
import { Rail, Rule, EXAMPLE_RAILS } from "@/data/exampleRails";
import { DIMENSIONS } from "@/data/dimensions";
import { previewRail } from "@/lib/railEngine";
import { Copy, Pencil, Trash2, X, Plus, Search, ChevronDown, ChevronUp } from "lucide-react";

let _id = 1000;
const uid = () => `user_copy_${Date.now()}_${_id++}`;

interface Props {
  userRails: Rail[];
  onUpdate: (r: Rail) => void;
  onDelete: (id: string) => void;
  onAdd: (r: Rail) => void;
}

function RuleChip({ rule }: { rule: Rule }) {
  const dim = DIMENSIONS.find((d) => d.id === rule.dim);
  return (
    <span
      className="font-mono text-xs px-2 py-0.5 rounded-full"
      style={{
        background: rule.op === ">=" ? "rgba(249,115,22,0.1)" : "rgba(96,165,250,0.1)",
        color: rule.op === ">=" ? "var(--orange)" : "var(--blue)",
        border: `1px solid ${rule.op === ">=" ? "rgba(249,115,22,0.2)" : "rgba(96,165,250,0.2)"}`,
      }}
    >
      {dim?.id.replace("PCoA_", "")} {rule.op} {rule.threshold}
    </span>
  );
}

function MatchCount({ rail }: { rail: Rail }) {
  const res = previewRail(rail.rules, rail.logic);
  return (
    <span className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>
      {res.count} movies
    </span>
  );
}

function EditModal({ rail, onClose, onSave }: { rail: Rail; onClose: () => void; onSave: (r: Rail) => void }) {
  const [name, setName] = useState(rail.name);
  const [desc, setDesc] = useState(rail.description);
  const [rules, setRules] = useState<Rule[]>(rail.rules);
  const [selectedDim, setSelectedDim] = useState("");

  const usedDims = new Set(rules.map((r) => r.dim));

  const addDim = () => {
    if (!selectedDim || usedDims.has(selectedDim)) return;
    setRules((p) => [...p, { dim: selectedDim, op: ">=", threshold: 0.3 }]);
    setSelectedDim("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
      <div
        className="w-full max-w-lg rounded-xl p-6 space-y-5 animate-slide-up"
        style={{ background: "var(--card)", border: "1px solid var(--border-bright)" }}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display text-base font-700" style={{ fontWeight: 700 }}>
            Edit Rail
          </h3>
          <button onClick={onClose} style={{ color: "var(--text-muted)" }}>
            <X size={16} />
          </button>
        </div>

        <input
          className="search-input w-full px-3 py-2 text-sm"
          placeholder="Rail name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="search-input w-full px-3 py-2 text-sm"
          placeholder="Description (optional)"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />

        {/* Add dim */}
        <div className="flex gap-2">
          <select
            className="search-input flex-1 px-3 py-2 text-sm"
            value={selectedDim}
            onChange={(e) => setSelectedDim(e.target.value)}
          >
            <option value="">+ Add dimension…</option>
            {DIMENSIONS.filter((d) => !usedDims.has(d.id)).map((d) => (
              <option key={d.id} value={d.id}>
                {d.short}
              </option>
            ))}
          </select>
          <button className="btn-amber px-3 py-2 rounded-md text-sm" onClick={addDim} disabled={!selectedDim}>
            <Plus size={14} />
          </button>
        </div>

        {/* Rules */}
        <div className="space-y-2 max-h-52 overflow-y-auto">
          {rules.map((rule) => {
            const dim = DIMENSIONS.find((d) => d.id === rule.dim)!;
            return (
              <div
                key={rule.dim}
                className="flex items-center gap-2 p-2 rounded-md"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <span className="font-mono text-xs flex-1" style={{ color: "var(--amber)" }}>
                  {dim?.short}
                </span>
                <div className="op-toggle">
                  <button
                    className={`op-btn ${rule.op === ">=" ? "active" : "inactive"}`}
                    onClick={() => setRules((p) => p.map((r) => r.dim === rule.dim ? { ...r, op: ">=" } : r))}
                  >≥</button>
                  <button
                    className={`op-btn ${rule.op === "<=" ? "active" : "inactive"}`}
                    onClick={() => setRules((p) => p.map((r) => r.dim === rule.dim ? { ...r, op: "<=" } : r))}
                  >≤</button>
                </div>
                <input
                  type="number"
                  className="threshold-input px-2 py-1"
                  value={rule.threshold}
                  step={0.05}
                  min={-1}
                  max={1}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    if (!isNaN(v))
                      setRules((p) => p.map((r) => r.dim === rule.dim ? { ...r, threshold: v } : r));
                  }}
                />
                <button
                  onClick={() => setRules((p) => p.filter((r) => r.dim !== rule.dim))}
                  style={{ color: "var(--text-muted)" }}
                >
                  <X size={13} />
                </button>
              </div>
            );
          })}
        </div>

        <div className="flex gap-2 pt-2">
          <button className="btn-ghost flex-1 py-2 rounded-md text-sm font-semibold" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-amber flex-1 py-2 rounded-md text-sm"
            onClick={() => { onSave({ ...rail, name, description: desc, rules }); onClose(); }}
            disabled={!name.trim() || rules.length === 0}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirm({ name, onConfirm, onCancel }: { name: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
      <div
        className="w-full max-w-sm rounded-xl p-6 space-y-4 animate-slide-up"
        style={{ background: "var(--card)", border: "1px solid var(--border-bright)" }}
      >
        <h3 className="font-display font-700 text-base" style={{ fontWeight: 700 }}>Delete Rail?</h3>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          &ldquo;{name}&rdquo; will be permanently deleted.
        </p>
        <div className="flex gap-2">
          <button className="btn-ghost flex-1 py-2 rounded-md text-sm font-semibold" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="flex-1 py-2 rounded-md text-sm font-semibold"
            style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)" }}
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MyRails({ userRails, onUpdate, onDelete, onAdd }: Props) {
  const [editingRail, setEditingRail] = useState<Rail | null>(null);
  const [deletingRail, setDeletingRail] = useState<Rail | null>(null);
  const [exampleSearch, setExampleSearch] = useState("");
  const [exampleExpanded, setExampleExpanded] = useState(true);

  const filteredExamples = EXAMPLE_RAILS.filter(
    (r) =>
      r.name.toLowerCase().includes(exampleSearch.toLowerCase()) ||
      r.description.toLowerCase().includes(exampleSearch.toLowerCase())
  );

  return (
    <>
      {editingRail && (
        <EditModal
          rail={editingRail}
          onClose={() => setEditingRail(null)}
          onSave={(r) => { onUpdate(r); setEditingRail(null); }}
        />
      )}
      {deletingRail && (
        <DeleteConfirm
          name={deletingRail.name}
          onConfirm={() => { onDelete(deletingRail.id); setDeletingRail(null); }}
          onCancel={() => setDeletingRail(null)}
        />
      )}

      <div className="space-y-10">
        {/* USER RAILS */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-xl font-700" style={{ fontWeight: 700 }}>
                My Rails
              </h2>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                {userRails.length} saved rail{userRails.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {userRails.length === 0 ? (
            <div
              className="rounded-lg p-10 text-center"
              style={{ border: "1px dashed var(--border)", color: "var(--text-muted)" }}
            >
              <p className="font-mono text-xs">No rails saved yet</p>
              <p className="text-xs mt-1">Build one in the Rail Builder tab</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {userRails.map((rail) => (
                <div key={rail.id} className="rail-card user p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-display font-700 text-sm" style={{ fontWeight: 700 }}>
                        {rail.name}
                      </p>
                      {rail.description && (
                        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                          {rail.description}
                        </p>
                      )}
                    </div>
                    <MatchCount rail={rail} />
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {rail.rules.map((r) => (
                      <RuleChip key={r.dim} rule={r} />
                    ))}
                  </div>

                  <div className="flex gap-1.5 pt-1">
                    <button
                      className="btn-ghost flex-1 py-1.5 rounded text-xs font-semibold flex items-center justify-center gap-1"
                      onClick={() => setEditingRail(rail)}
                    >
                      <Pencil size={11} /> Edit
                    </button>
                    <button
                      className="btn-ghost flex-1 py-1.5 rounded text-xs font-semibold flex items-center justify-center gap-1"
                      onClick={() => onAdd({ ...rail, id: uid(), name: `${rail.name} (copy)` })}
                    >
                      <Copy size={11} /> Duplicate
                    </button>
                    <button
                      className="py-1.5 px-3 rounded text-xs font-semibold flex items-center gap-1 transition-colors"
                      style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#ef4444";
                        e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "var(--text-muted)";
                        e.currentTarget.style.borderColor = "var(--border)";
                      }}
                      onClick={() => setDeletingRail(rail)}
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* EXAMPLE RAILS */}
        <section>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <button
                className="flex items-center gap-2 font-display text-xl font-700"
                style={{ fontWeight: 700, color: "var(--text-primary)" }}
                onClick={() => setExampleExpanded((p) => !p)}
              >
                Example Rails
                <span className="badge badge-blue">{EXAMPLE_RAILS.length} rails</span>
                {exampleExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                Read-only · Duplicate to add to your collection
              </p>
            </div>

            {exampleExpanded && (
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                <input
                  className="search-input pl-8 pr-3 py-2 text-sm w-52"
                  placeholder="Filter example rails…"
                  value={exampleSearch}
                  onChange={(e) => setExampleSearch(e.target.value)}
                />
              </div>
            )}
          </div>

          {exampleExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 animate-fade-in">
              {filteredExamples.map((rail) => (
                <div key={rail.id} className="rail-card example p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-display font-700 text-sm" style={{ fontWeight: 700 }}>
                        {rail.name}
                      </p>
                      {rail.description && (
                        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                          {rail.description}
                        </p>
                      )}
                    </div>
                    <MatchCount rail={rail} />
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {rail.rules.map((r) => (
                      <RuleChip key={r.dim} rule={r} />
                    ))}
                  </div>

                  <button
                    className="btn-ghost w-full py-1.5 rounded text-xs font-semibold flex items-center justify-center gap-1.5"
                    onClick={() =>
                      onAdd({ ...rail, id: uid(), name: rail.name, isExample: false })
                    }
                  >
                    <Copy size={11} /> Duplicate to My Rails
                  </button>
                </div>
              ))}
              {filteredExamples.length === 0 && (
                <div
                  className="col-span-3 text-center py-8 rounded-lg"
                  style={{ border: "1px dashed var(--border)", color: "var(--text-muted)" }}
                >
                  No rails match &ldquo;{exampleSearch}&rdquo;
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
