export interface Movie {
  id: string;
  title: string;
  year: number;
  scores: Record<string, number>;
}

function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

const MOVIE_LIST: [string, number][] = [
  ["Parasite", 2019], ["The Shawshank Redemption", 1994], ["Inception", 2010], ["Spirited Away", 2001],
  ["The Dark Knight", 2008], ["Pulp Fiction", 1994], ["Schindler's List", 1993], ["Goodfellas", 1990],
  ["The Godfather", 1972], ["Fight Club", 1999], ["Forrest Gump", 1994], ["The Matrix", 1999],
  ["Interstellar", 2014], ["City of God", 2002], ["The Silence of the Lambs", 1991],
  ["Rear Window", 1954], ["Casablanca", 1942], ["12 Angry Men", 1957], ["The Lion King", 1994],
  ["Jurassic Park", 1993], ["Eternal Sunshine of the Spotless Mind", 2004], ["Lost in Translation", 2003],
  ["Her", 2013], ["Drive", 2011], ["Moon", 2009], ["Blade Runner 2049", 2017], ["Arrival", 2016],
  ["Ex Machina", 2014], ["Get Out", 2017], ["Hereditary", 2018], ["Midsommar", 2019],
  ["Everything Everywhere All at Once", 2022], ["The Whale", 2022], ["Tar", 2022], ["Aftersun", 2022],
  ["The Banshees of Inisherin", 2022], ["Triangle of Sadness", 2022], ["Decision to Leave", 2022],
  ["All Quiet on the Western Front", 2022], ["The Fabelmans", 2022], ["Portrait of a Lady on Fire", 2019],
  ["Pain and Glory", 2019], ["Burning", 2018], ["Roma", 2018], ["Cold War", 2018], ["A Separation", 2011],
  ["The Hunt", 2012], ["Force Majeure", 2014], ["The Square", 2017], ["Wild Tales", 2014],
  ["Oldboy", 2003], ["Memories of Murder", 2003], ["Mother", 2009], ["The Wailing", 2016],
  ["A Tale of Two Sisters", 2003], ["The Host", 2006], ["I Saw the Devil", 2010],
  ["Shoplifters", 2018], ["Like Father Like Son", 2013], ["Still Walking", 2008],
  ["After Life", 1998], ["Hana-bi", 1997], ["Battle Royale", 2000], ["Audition", 1999],
  ["Ringu", 1998], ["Ju-on", 2002], ["Ichi the Killer", 2001], ["13 Assassins", 2010],
  ["2001 A Space Odyssey", 1968], ["Stalker", 1979], ["Andrei Rublev", 1966], ["The Mirror", 1975],
  ["Persona", 1966], ["The Seventh Seal", 1957], ["Wild Strawberries", 1957], ["Cries and Whispers", 1972],
  ["Amarcord", 1973], ["8 and a Half", 1963], ["La Dolce Vita", 1960], ["L'Avventura", 1960],
  ["Bicycle Thieves", 1948], ["Rome Open City", 1945], ["The Battle of Algiers", 1966],
  ["Z", 1969], ["Au Revoir les Enfants", 1987], ["The 400 Blows", 1959],
  ["Breathless", 1960], ["Jules and Jim", 1962], ["Contempt", 1963],
  ["Aguirre Wrath of God", 1972], ["Fitzcarraldo", 1982], ["Nosferatu", 1922],
  ["M", 1931], ["The Cabinet of Dr Caligari", 1920], ["Metropolis", 1927],
  ["Das Boot", 1981], ["Run Lola Run", 1998], ["Goodbye Lenin", 2003], ["The Lives of Others", 2006],
  ["Downfall", 2004], ["Sophie Scholl", 2005], ["Revanche", 2008], ["Amour", 2012],
];

export const MOVIES: Movie[] = MOVIE_LIST.map(([title, year], i) => {
  const r = seededRand(i * 31337 + 42);
  const scores: Record<string, number> = {};
  for (let d = 1; d <= 20; d++) {
    scores[`PCoA_Dim${d}`] = parseFloat(((r() * 2 - 1) * 0.9).toFixed(4));
  }
  return { id: `m${i + 1}`, title, year, scores };
});

export type PctKey =
  | "bottom_1pct" | "bottom_2pct" | "extreme_low" | "very_low" | "low"
  | "medium" | "high" | "very_high" | "extreme_high" | "top_2pct" | "top_1pct";

// ─── IDF Weights (Tempered) ─────────────────────────────────────────────────
// Used in the upstream Python PCoA coordinate generation pipeline.
// Paste this block into your PCoA Step 1 script to apply the updated weights:
//
//   # 1. IDF Weights (Tempered)
//   print("\n[1/4] Calculating IDF Weights...")
//   N = trait_matrix.shape[0]
//   df_counts = np.sum(trait_matrix > 0, axis=0)
//   base_weights = np.log((N + 1) / (df_counts + 1)) + 1
//   weights = base_weights ** 0.85          # ← exponent was 0.7, now 0.85
//   print(f"  ✓ Upweight factor: {weights.max() / weights.min():.1f}x")
//
// These PCTL percentile thresholds below are derived from those coordinates.

export const PCTL: Record<string, Record<PctKey, number>> = {};
(() => {
  for (let d = 1; d <= 20; d++) {
    const key = `PCoA_Dim${d}`;
    const vals = MOVIES.map((m) => m.scores[key]).sort((a, b) => a - b);
    const n = vals.length;
    const q = (p: number) => vals[Math.round(p * (n - 1))];
    PCTL[key] = {
      bottom_1pct: q(0.01), bottom_2pct: q(0.02),
      extreme_low: q(0.05), very_low: q(0.10), low: q(0.25), medium: q(0.50),
      high: q(0.75), very_high: q(0.90), extreme_high: q(0.95),
      top_2pct: q(0.98), top_1pct: q(0.99),
    };
  }
})();
