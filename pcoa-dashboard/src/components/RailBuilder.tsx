"use client";
import { useState, useMemo } from "react";
import { DIMENSIONS } from "@/data/dimensions";
import { Rail, Rule } from "@/data/exampleRails";
import { previewRail } from "@/lib/railEngine";
import { X, Plus, ChevronUp, ChevronDown, Save, Eye } from "lucide-react";

let _idCounter = 1;
const uid = () => `user_${Date.now()}_${_idCounter++}`;

interface Props {
  userRails: Rail[];
  onSave: (rail: Rail) => void;
}

export default function RailBuilder({ onSave }: Props) {
  const [rules, setRules] = useState<Rule[]>([]);
  const [selectedDim, setSelectedDim] = useState("");
  const [logic] = useState<"AND" | "OR">("AND");
  const [sortDim, setSortDim] = useState<string | undefined>();
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [railName, setRailName] = useState("");
  const [railDesc, setRailDesc] = useState("");
  const [showSave, setShowSave] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const usedDimIds = new Set(rules.map((r) => r.dim));

  const addDimension = () => {
    if (!selectedDim || usedDimIds.has(selectedDim)) return;
    setRules((p) => [...p, { dim: selectedDim, op: ">=", threshold: 0.3 }]);
    setSelectedDim("");
  };

  const removeRule = (dim: string) => setRules((p) => p.filter((r) => r.dim !== dim));

  const updateRule = (dim: string, patch: Partial<Rule>) =>
    setRules((p) => p.map((r) => (r.dim === dim ? { ...r, ...patch } : r)));

  const results = useMemo(
    () => previewRail(rules, logic, sortDim, sortDir),
    [rules, logic, sortDim, sortDir]
  );

  const toggleSort = (dim: string) => {
    if (sortDim === dim) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortDim(dim);
      setSortDir("desc");
    }
  };

  const handleSave = () => {
    if (!railName.trim() || rules.length === 0) return;
    onSave({ id: uid(), name: railName.trim(), description: railDesc.trim(), rules, logic });
    setRailName("");
    setRailDesc("");
    setShowSave(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {/* LEFT: Rule Editor */}
      <div className="space-y-5">
        <div>
          <h2 className="font-display text-xl font-700 mb-1" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
            Build Your Rail
          </h2>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Select dimensions and set threshold rules to filter movies
          </p>
        </div>

        {/* Dim selector */}
        <div className="flex gap-2">
          <select
            className="search-input flex-1 px-3 py-2 text-sm"
            value={selectedDim}
            onChange={(e) => setSelectedDim(e.target.value)}
          >
            <option value="">+ Add dimension…</option>
            {DIMENSIONS.filter((d) => !usedDimIds.has(d.id)).map((d) => (
              <option key={d.id} value={d.id}>
                {d.short}
              </option>
            ))}
          </select>
          <button
            className="btn-amber px-4 py-2 rounded-md text-sm flex items-center gap-1.5 font-display"
            onClick={addDimension}
            disabled={!selectedDim}
          >
            <Plus size={14} />
            Add
          </button>
        </div>

        {/* Rule rows */}
        {rules.length === 0 && (
          <div
            className="rounded-lg p-8 text-center"
            style={{ border: "1px dashed var(--border-bright)", color: "var(--text-muted)" }}
          >
            <p className="font-mono text-xs">No rules defined</p>
            <p className="text-xs mt-1">Add at least one dimension to preview results</p>
          </div>
        )}

        <div className="space-y-3">
          {rules.map((rule) => {
            const dim = DIMENSIONS.find((d) => d.id === rule.dim)!;
            return (
              <div key={rule.dim} className="rule-row rounded-lg p-4">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  {/* Dim label */}
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-xs font-semibold" style={{ color: "var(--amber)" }}>
                      {dim.short}
                    </p>
                  </div>

                  {/* Operator toggle */}
                  <div className="op-toggle">
                    <button
                      className={`op-btn ${rule.op === ">=" ? "active" : "inactive"}`}
                      onClick={() => updateRule(rule.dim, { op: ">=" })}
                    >
                      ≥
                    </button>
                    <button
                      className={`op-btn ${rule.op === "<=" ? "active" : "inactive"}`}
                      onClick={() => updateRule(rule.dim, { op: "<=" })}
                    >
                      ≤
                    </button>
                  </div>

                  {/* Threshold */}
                  <input
                    type="number"
                    className="threshold-input px-2 py-1.5"
                    value={rule.threshold}
                    step={0.05}
                    min={-1}
                    max={1}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      if (!isNaN(v)) updateRule(rule.dim, { threshold: v });
                    }}
                  />

                  {/* Remove */}
                  <button
                    onClick={() => removeRule(rule.dim)}
                    className="ml-1 p-1 rounded transition-colors"
                    style={{ color: "var(--text-muted)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Axis helper text */}
                <div className="flex justify-between mt-2.5 text-xs">
                  <span style={{ color: "var(--blue)" }}>← {dim.neg}</span>
                  <span style={{ color: "var(--orange)" }}>{dim.pos} →</span>
                </div>

                {/* Threshold bar */}
                <div
                  className="mt-2 h-1 rounded-full relative overflow-hidden"
                  style={{ background: "var(--border)" }}
                >
                  <div
                    className="absolute top-0 h-full rounded-full transition-all"
                    style={{
                      background: rule.op === ">=" ? "var(--orange)" : "var(--blue)",
                      left: rule.op === ">=" ? `${((rule.threshold + 1) / 2) * 100}%` : 0,
                      right: rule.op === "<=" ? `${((1 - rule.threshold + 1) / 2) * 100}%` : 0,
                      width: rule.op === ">=" ? `${((1 - rule.threshold) / 2) * 100}%` : `${((rule.threshold + 1) / 2) * 100}%`,
                    }}
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2"
                    style={{
                      left: `calc(${((rule.threshold + 1) / 2) * 100}% - 4px)`,
                      background: "var(--surface)",
                      borderColor: "var(--amber)",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Save section */}
        {rules.length > 0 && (
          <div className="space-y-3">
            <button
              className="btn-ghost w-full py-2 rounded-md text-sm flex items-center justify-center gap-2 font-display font-semibold"
              onClick={() => setShowSave(!showSave)}
            >
              <Save size={14} />
              {showSave ? "Cancel" : "Save this Rail"}
            </button>

            {showSave && (
              <div
                className="p-4 rounded-lg space-y-3 animate-slide-up"
                style={{ background: "var(--card)", border: "1px solid var(--border)" }}
              >
                <input
                  type="text"
                  placeholder="Rail name (required)"
                  className="search-input w-full px-3 py-2 text-sm"
                  value={railName}
                  onChange={(e) => setRailName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Description (optional)"
                  className="search-input w-full px-3 py-2 text-sm"
                  value={railDesc}
                  onChange={(e) => setRailDesc(e.target.value)}
                />
                <button
                  className="btn-amber w-full py-2 rounded-md text-sm"
                  onClick={handleSave}
                  disabled={!railName.trim()}
                >
                  Save Rail ({rules.length} rule{rules.length !== 1 ? "s" : ""})
                </button>
              </div>
            )}

            {saveSuccess && (
              <p className="text-xs text-center animate-fade-in" style={{ color: "#4ade80" }}>
                ✓ Rail saved successfully
              </p>
            )}
          </div>
        )}
      </div>

      {/* RIGHT: Results Preview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-xl font-700" style={{ fontWeight: 700 }}>
              Preview Results
            </h2>
            {rules.length > 0 && results.excludedMissingCount > 0 && (
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                {results.excludedMissingCount} excluded (missing scores)
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {rules.length > 0 && (
              <div className="flex items-center gap-2">
                <Eye size={14} style={{ color: "var(--text-muted)" }} />
                <span className="match-count text-3xl font-bold leading-none">{results.count}</span>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  matches
                </span>
              </div>
            )}
          </div>
        </div>

        {rules.length === 0 ? (
          <div
            className="rounded-lg p-12 text-center"
            style={{ border: "1px dashed var(--border)", color: "var(--text-muted)" }}
          >
            <p className="font-mono text-xs">Add rules to see matching movies</p>
          </div>
        ) : results.count === 0 ? (
          <div
            className="rounded-lg p-12 text-center"
            style={{ border: "1px solid var(--border)", background: "var(--card)", color: "var(--text-muted)" }}
          >
            <p className="font-mono text-xs">No movies match these rules</p>
            <p className="text-xs mt-1">Try relaxing your thresholds</p>
          </div>
        ) : (
          <div
            className="rounded-lg overflow-hidden"
            style={{ border: "1px solid var(--border)", background: "var(--card)" }}
          >
            <div className="overflow-x-auto">
              <table className="data-table w-full">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Year</th>
                    {rules.map((r) => {
                      const d = DIMENSIONS.find((x) => x.id === r.dim)!;
                      return (
                        <th key={r.dim} onClick={() => toggleSort(r.dim)} className="cursor-pointer">
                          <span className="flex items-center gap-1">
                            {d.id.replace("PCoA_", "")}
                            {sortDim === r.dim ? (
                              sortDir === "desc" ? <ChevronDown size={10} /> : <ChevronUp size={10} />
                            ) : null}
                          </span>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {results.movies.map((movie, i) => (
                    <tr key={movie.id} className="animate-fade-in" style={{ animationDelay: `${i * 20}ms` }}>
                      <td style={{ color: "var(--text-primary)" }}>{movie.title}</td>
                      <td className="font-mono" style={{ color: "var(--text-muted)" }}>
                        {movie.year}
                      </td>
                      {rules.map((r) => {
                        const score = movie.selectedScores[r.dim];
                        const cls = score > 0.2 ? "score-pos" : score < -0.2 ? "score-neg" : "score-neutral";
                        return (
                          <td key={r.dim} className={`font-mono ${cls}`}>
                            {score > 0 ? "+" : ""}
                            {score.toFixed(3)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {results.count > 20 && (
              <p className="px-4 py-3 text-xs" style={{ color: "var(--text-muted)", borderTop: "1px solid var(--border)" }}>
                Showing top 20 of {results.count} matches
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
