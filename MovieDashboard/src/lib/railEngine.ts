import { MOVIES, Movie } from "@/data/movies";
import { Rule } from "@/data/exampleRails";

export interface PreviewResult {
  count: number;
  excluded: number;
  movies: Movie[];
}

export function runPreview(
  rules: Rule[],
  movieIds?: string[],
  sortDim?: string,
  sortDir: "asc" | "desc" = "desc"
): PreviewResult {
  // If explicit movieIds provided (example rails), filter by those IDs
  if (movieIds && movieIds.length > 0) {
    const idSet = new Set(movieIds);
    const matched = MOVIES.filter((m) => idSet.has(m.id));
    const sd = sortDim || rules?.[0]?.dim;
    if (sd) {
      matched.sort((a, b) =>
        sortDir === "desc" ? b.scores[sd] - a.scores[sd] : a.scores[sd] - b.scores[sd]
      );
    }
    return { count: matched.length, excluded: MOVIES.length - matched.length, movies: matched.slice(0, 20) };
  }

  // Otherwise use threshold rules
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

export function countMatches(rules: Rule[], movieIds?: string[]): number {
  if (movieIds && movieIds.length > 0) return movieIds.length;
  return runPreview(rules).count;
}
