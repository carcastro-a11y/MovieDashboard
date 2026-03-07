import { PCTL, PctKey } from "./movies";

export interface Rule {
  dim: string;
  op: ">=" | "<=";
  th: number;
}

export interface Rail {
  id: string;
  name: string;
  desc: string;
  tier: "1D" | "2D" | "3D";
  rules: Rule[];
  isExample?: boolean;
}

function cr(criteria: { d: number; t: string; dir: string }[]): Rule[] {
  return criteria.map((c) => ({
    dim: `PCoA_Dim${c.d}`,
    op: (c.dir === "above" ? ">=" : "<=") as ">=" | "<=",
    th: parseFloat(PCTL[`PCoA_Dim${c.d}`][c.t as PctKey].toFixed(3)),
  }));
}

// ─── 1D RAILS ────────────────────────────────────────────────────────────────
// Each uses top_1pct / bottom_1pct threshold, then match-score trims to ~50

const RAILS_1D: Omit<Rail, "isExample">[] = [
  {
    id: "1d_01",
    tier: "1D",
    name: "Dread — Dark Intensity",
    desc: "Dim1 top 1%: pure dark psychological tension — Oldboy, Se7en, Sin City",
    rules: cr([{ d: 1, t: "top_1pct", dir: "above" }]),
  },
  {
    id: "1d_02",
    tier: "1D",
    name: "Dread — Warm & Uplifting",
    desc: "Dim1 bottom 1%: pure warmth and uplift — Shrek, Tangled, Enchanted",
    rules: cr([{ d: 1, t: "bottom_1pct", dir: "below" }]),
  },
  {
    id: "1d_03",
    tier: "1D",
    name: "Heroic Action Core",
    desc: "Dim2 top 1%: heroic adventure — LOTR, Avengers, Star Wars",
    rules: cr([{ d: 2, t: "top_1pct", dir: "above" }]),
  },
  {
    id: "1d_04",
    tier: "1D",
    name: "Character Study Core",
    desc: "Dim3 top 1%: introspective character studies — Gone with the Wind, Anna Karenina",
    rules: cr([{ d: 3, t: "top_1pct", dir: "above" }]),
  },
  {
    id: "1d_05",
    tier: "1D",
    name: "Twisty Storytelling Core",
    desc: "Dim6 top 1%: surprise-driven, twisty plots — Gone Girl, Vertigo, Knives Out",
    rules: cr([{ d: 6, t: "top_1pct", dir: "above" }]),
  },
  {
    id: "1d_06",
    tier: "1D",
    name: "American Tech Thriller Core",
    desc: "Dim7 top 1%: American sci-fi/tech thrillers — Oppenheimer, Terminator 2, Blade Runner",
    rules: cr([{ d: 7, t: "top_1pct", dir: "above" }]),
  },
  {
    id: "1d_07",
    tier: "1D",
    name: "Romantic Drama Core",
    desc: "Dim8 top 1%: romantic drama & female-led stories — Beauty and the Beast, Twilight",
    rules: cr([{ d: 8, t: "top_1pct", dir: "above" }]),
  },
  {
    id: "1d_08",
    tier: "1D",
    name: "Future Tech Core",
    desc: "Dim9 top 1%: sci-fi & future technology — Ghost in the Shell, Blade Runner 2049, Akira",
    rules: cr([{ d: 9, t: "top_1pct", dir: "above" }]),
  },
  {
    id: "1d_09",
    tier: "1D",
    name: "European Detective Core",
    desc: "Dim10 top 1%: old-world mystery & intellectual intrigue — Hugo, Tinker Tailor, Zootopia",
    rules: cr([{ d: 10, t: "top_1pct", dir: "above" }]),
  },
  {
    id: "1d_10",
    tier: "1D",
    name: "Redemption Core",
    desc: "Dim14 top 1%: inner darkness & moral redemption — Rocketman, Amadeus, Soul",
    rules: cr([{ d: 14, t: "top_1pct", dir: "above" }]),
  },
];

// ─── 2D RAILS ────────────────────────────────────────────────────────────────

const RAILS_2D: Omit<Rail, "isExample">[] = [
  {
    id: "2d_01",
    tier: "2D",
    name: "Dark Twisty Mystery",
    desc: "Dim1 + Dim6 very high: psychological tension meets plot twists — Gone Girl, Psycho, Oldboy",
    rules: cr([
      { d: 1, t: "very_high", dir: "above" },
      { d: 6, t: "very_high", dir: "above" },
    ]),
  },
  {
    id: "2d_02",
    tier: "2D",
    name: "Dark European Detective",
    desc: "Dim1 + Dim10 very high: dark dread meets old-world intrigue — Tinker Tailor, The Wicker Man",
    rules: cr([
      { d: 1, t: "very_high", dir: "above" },
      { d: 10, t: "very_high", dir: "above" },
    ]),
  },
  {
    id: "2d_03",
    tier: "2D",
    name: "Heroic Future Tech",
    desc: "Dim2 + Dim9 very high: heroic action meets sci-fi — The Matrix, Avengers, Blade Runner 2049",
    rules: cr([
      { d: 2, t: "very_high", dir: "above" },
      { d: 9, t: "very_high", dir: "above" },
    ]),
  },
  {
    id: "2d_04",
    tier: "2D",
    name: "Heroic American Sci-Fi",
    desc: "Dim2 + Dim7 very high: heroic action meets American tech — Avengers, Terminator 2, Star Wars",
    rules: cr([
      { d: 2, t: "very_high", dir: "above" },
      { d: 7, t: "very_high", dir: "above" },
    ]),
  },
  {
    id: "2d_05",
    tier: "2D",
    name: "Introspective Romantic",
    desc: "Dim3 + Dim8 very high: deep character study meets romantic drama — Gone with the Wind, Anna Karenina",
    rules: cr([
      { d: 3, t: "very_high", dir: "above" },
      { d: 8, t: "very_high", dir: "above" },
    ]),
  },
  {
    id: "2d_06",
    tier: "2D",
    name: "Auteur Twisty",
    desc: "Dim5 + Dim6 very high: visionary direction meets surprise storytelling — Mulholland Drive, Psycho",
    rules: cr([
      { d: 5, t: "very_high", dir: "above" },
      { d: 6, t: "very_high", dir: "above" },
    ]),
  },
  {
    id: "2d_07",
    tier: "2D",
    name: "Moral Redemption",
    desc: "Dim18 + Dim14 very high: moral corruption meets redemption — Rocketman, Amadeus, The Prestige",
    rules: cr([
      { d: 18, t: "very_high", dir: "above" },
      { d: 14, t: "very_high", dir: "above" },
    ]),
  },
  {
    id: "2d_08",
    tier: "2D",
    name: "Parental Redemption",
    desc: "Dim12 + Dim14 very high: father figure arc meets moral redemption — Amadeus, Inception, Elvis",
    rules: cr([
      { d: 12, t: "very_high", dir: "above" },
      { d: 14, t: "very_high", dir: "above" },
    ]),
  },
  {
    id: "2d_09",
    tier: "2D",
    name: "European Art Crime Wit",
    desc: "Dim17 + Dim4 very high: European arts meets clever crime & wit — Cabaret, Amadeus, Chicago",
    rules: cr([
      { d: 17, t: "very_high", dir: "above" },
      { d: 4, t: "very_high", dir: "above" },
    ]),
  },
  {
    id: "2d_10",
    tier: "2D",
    name: "Perseverance Detective",
    desc: "Dim19 + Dim10 very high: struggle and setbacks meets intellectual intrigue — Hugo, Murder!",
    rules: cr([
      { d: 19, t: "very_high", dir: "above" },
      { d: 10, t: "very_high", dir: "above" },
    ]),
  },
];

// ─── 3D RAILS ────────────────────────────────────────────────────────────────

const RAILS_3D: Omit<Rail, "isExample">[] = [
  {
    id: "3d_01",
    tier: "3D",
    name: "Dread Twist Detective",
    desc: "Dim1 + Dim6 + Dim10: dark dread, plot twists, intellectual mystery — Psycho, Chinatown",
    rules: cr([
      { d: 1, t: "high", dir: "above" },
      { d: 6, t: "very_high", dir: "above" },
      { d: 10, t: "high", dir: "above" },
    ]),
  },
  {
    id: "3d_02",
    tier: "3D",
    name: "Heroic Sci-Fi Future",
    desc: "Dim2 + Dim7 + Dim9: heroic action, American sci-fi, future tech — Matrix, Terminator, Blade Runner",
    rules: cr([
      { d: 2, t: "very_high", dir: "above" },
      { d: 7, t: "high", dir: "above" },
      { d: 9, t: "high", dir: "above" },
    ]),
  },
  {
    id: "3d_03",
    tier: "3D",
    name: "Dark Redemption Perseverance",
    desc: "Dim1 + Dim14 + Dim19: dark tension, moral redemption, will to overcome — Oldboy, The Prestige",
    rules: cr([
      { d: 1, t: "high", dir: "above" },
      { d: 14, t: "very_high", dir: "above" },
      { d: 19, t: "high", dir: "above" },
    ]),
  },
  {
    id: "3d_04",
    tier: "3D",
    name: "Introspective Romance Redemption",
    desc: "Dim3 + Dim8 + Dim14: soul depth, romantic drama, inner darkness — Beauty and the Beast, Walk the Line",
    rules: cr([
      { d: 3, t: "high", dir: "above" },
      { d: 8, t: "high", dir: "above" },
      { d: 14, t: "high", dir: "above" },
    ]),
  },
  {
    id: "3d_05",
    tier: "3D",
    name: "Auteur Clever Crime Twists",
    desc: "Dim5 + Dim4 + Dim6: auteur vision, clever wit, plot twists — Dangerous Liaisons, Grand Budapest",
    rules: cr([
      { d: 5, t: "high", dir: "above" },
      { d: 4, t: "high", dir: "above" },
      { d: 6, t: "high", dir: "above" },
    ]),
  },
  {
    id: "3d_06",
    tier: "3D",
    name: "Parental Warmth Father Arc",
    desc: "Dim12 + Dim13 + Dim1 low: paternal bonds, family comedy, warm uplift — Kung Fu Panda, Despicable Me",
    rules: cr([
      { d: 12, t: "high", dir: "above" },
      { d: 13, t: "high", dir: "above" },
      { d: 1, t: "very_low", dir: "below" },
    ]),
  },
  {
    id: "3d_07",
    tier: "3D",
    name: "European Intrigue Arts",
    desc: "Dim10 + Dim17 + Dim3: European detective, high arts, soul depth — Hugo, The Sound of Music",
    rules: cr([
      { d: 10, t: "high", dir: "above" },
      { d: 17, t: "high", dir: "above" },
      { d: 3, t: "high", dir: "above" },
    ]),
  },
  {
    id: "3d_08",
    tier: "3D",
    name: "Moral Corruption Noir",
    desc: "Dim18 + Dim1 + Dim6: temptation, dark tension, plot twists — Gangs of Wasseypur, Parasite",
    rules: cr([
      { d: 18, t: "very_high", dir: "above" },
      { d: 1, t: "high", dir: "above" },
      { d: 6, t: "high", dir: "above" },
    ]),
  },
  {
    id: "3d_09",
    tier: "3D",
    name: "Small Town Redemption",
    desc: "Dim20 + Dim14 + Dim19: rural modernity, redemption, perseverance — Ray, Walk the Line, A Star Is Born",
    rules: cr([
      { d: 20, t: "high", dir: "above" },
      { d: 14, t: "high", dir: "above" },
      { d: 19, t: "high", dir: "above" },
    ]),
  },
  {
    id: "3d_10",
    tier: "3D",
    name: "Heroic Crime Wit Detective",
    desc: "Dim2 + Dim4 + Dim10: heroic action, clever wit, old-world intrigue — Enola Holmes, Mission Impossible",
    rules: cr([
      { d: 2, t: "high", dir: "above" },
      { d: 4, t: "high", dir: "above" },
      { d: 10, t: "high", dir: "above" },
    ]),
  },
];

export const EXAMPLE_RAILS: Rail[] = [
  ...RAILS_1D,
  ...RAILS_2D,
  ...RAILS_3D,
].map((r) => ({ ...r, isExample: true }));
