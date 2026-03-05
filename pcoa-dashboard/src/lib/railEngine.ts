import { MOVIES, Movie } from "@/data/movies";
import { Rule } from "@/data/exampleRails";

export interface PreviewResult {
  count: number;
  excludedMissingCount: number;
  movies: Array<Movie & { selectedScores: Record<string, number> }>;
}

export function previewRail(
  rules: Rule[],
  logic: "AND" | "OR" = "AND",
  sortDim?: string,
  sortDir: "asc" | "desc" = "desc"
): PreviewResult {
  if (rules.length === 0) return { count: 0, excludedMissingCount: 0, movies: [] };

  const dims = rules.map((r) => r.dim);
  let excluded = 0;
  const matched: Array<Movie & { selectedScores: Record<string, number> }> = [];

  for (const movie of MOVIES) {
    // Check for missing scores
    const hasMissing = dims.some((d) => movie.scores[d] === undefined || movie.scores[d] === null);
    if (hasMissing) { excluded++; continue; }

    const results = rules.map((rule) => {
      const score = movie.scores[rule.dim];
      return rule.op === ">=" ? score >= rule.threshold : score <= rule.threshold;
    });

    const passes = logic === "AND" ? results.every(Boolean) : results.some(Boolean);
    if (passes) {
      const selectedScores: Record<string, number> = {};
      dims.forEach((d) => { selectedScores[d] = movie.scores[d]; });
      matched.push({ ...movie, selectedScores });
    }
  }

  // Sort
  if (sortDim) {
    matched.sort((a, b) => {
      const av = a.selectedScores[sortDim] ?? 0;
      const bv = b.selectedScores[sortDim] ?? 0;
      return sortDir === "desc" ? bv - av : av - bv;
    });
  }

  return { count: matched.length, excludedMissingCount: excluded, movies: matched.slice(0, 20) };
}
