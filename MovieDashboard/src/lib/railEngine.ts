import { MOVIES, Movie } from "@/data/movies";
import { Rule } from "@/data/exampleRails";

export interface PreviewResult {
  count: number;
  excluded: number;
  movies: Movie[];
}

export function runPreview(
  rules: Rule[],
  sortDim?: string,
  sortDir: "asc" | "desc" = "desc"
): PreviewResult {
  if (!rules || rules.length === 0) return { count: 0, excluded: 0, movies: [] };

  let excluded = 0;
  const matched: Movie[] = [];

  for (const m of MOVIES) {
    if (rules.some((r) => m.scores[r.dim] === undefined)) { excluded++; continue; }
    if (rules.every((r) => r.op === ">=" ? m.scores[r.dim] >= r.th : m.scores[r.dim] <= r.th)) {
      matched.push(m);
    }
  }

  const sd = sortDim || rules[0]?.dim;
  matched.sort((a, b) =>
    sortDir === "desc" ? b.scores[sd] - a.scores[sd] : a.scores[sd] - b.scores[sd]
  );

  return { count: matched.length, excluded, movies: matched.slice(0, 20) };
}

export function countMatches(rules: Rule[]): number {
  return runPreview(rules).count;
}
