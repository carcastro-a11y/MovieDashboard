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

const RAW = [
  // EXTREME PSYCHOLOGICAL INTENSITY
  { id:"ex1",  name:"Extreme Psychological Thrillers", desc:"High tension, suspense, dark crime",         criteria:[{d:1,t:"extreme_high",dir:"above"},{d:3,t:"very_high",  dir:"above"},{d:6, t:"high",        dir:"above"}] },
  { id:"ex2",  name:"Disturbing Horror Films",          desc:"Horror, fright, low comedy",                criteria:[{d:1,t:"extreme_high",dir:"above"},{d:4,t:"very_high",  dir:"above"},{d:8, t:"low",         dir:"below"}] },
  { id:"ex3",  name:"Bleak Dystopian Cinema",           desc:"Suspense, sci-fi, existential",             criteria:[{d:1,t:"extreme_high",dir:"above"},{d:7,t:"very_high",  dir:"above"},{d:15,t:"very_high",   dir:"above"}] },
  { id:"ex4",  name:"Dark Crime Noir",                  desc:"Tension, crime and humor, mystery",         criteria:[{d:1,t:"extreme_high",dir:"above"},{d:6,t:"very_high",  dir:"above"},{d:10,t:"very_high",   dir:"above"}] },
  { id:"ex5",  name:"Melancholic Art Films",            desc:"Tension, slow drama, low action and comedy",criteria:[{d:1,t:"very_high",   dir:"above"},{d:3,t:"extreme_high",dir:"above"},{d:2, t:"low",         dir:"below"},{d:8,t:"low",dir:"below"}] },
  { id:"ex6",  name:"Somber Character Studies",         desc:"Tension, drama, existential reflection",    criteria:[{d:1,t:"very_high",   dir:"above"},{d:3,t:"very_high",  dir:"above"},{d:15,t:"very_high",   dir:"above"}] },
  { id:"ex7",  name:"Tense Detective Mysteries",        desc:"Tension, crime, modern intellectual",       criteria:[{d:1,t:"very_high",   dir:"above"},{d:6,t:"extreme_high",dir:"above"},{d:19,t:"high",        dir:"above"}] },
  { id:"ex8",  name:"Atmospheric Supernatural",         desc:"Suspense, horror, fantasy",                 criteria:[{d:1,t:"very_high",   dir:"above"},{d:4,t:"extreme_high",dir:"above"},{d:5, t:"high",        dir:"above"}] },
  // PURE JOY & OPTIMISM
  { id:"ex9",  name:"Purely Joyful Films",              desc:"Uplifting, comedy, coming-of-age",          criteria:[{d:1,t:"extreme_low", dir:"below"},{d:8,t:"extreme_high",dir:"above"},{d:13,t:"high",        dir:"above"}] },
  { id:"ex10", name:"Lighthearted Rom-Coms",             desc:"Uplifting, action spectacle, arts",         criteria:[{d:1,t:"extreme_low", dir:"below"},{d:2,t:"very_high",  dir:"above"},{d:15,t:"high",        dir:"above"}] },
  { id:"ex11", name:"Family Friendly Adventures",        desc:"Uplifting, comedy-driven, high comedy",     criteria:[{d:1,t:"extreme_low", dir:"below"},{d:13,t:"extreme_high",dir:"above"},{d:8,t:"high",         dir:"above"}] },
  { id:"ex12", name:"Cheerful Animated Classics",        desc:"Uplifting, fantasy, high comedy",           criteria:[{d:1,t:"extreme_low", dir:"below"},{d:5,t:"very_high",  dir:"above"},{d:8, t:"very_high",   dir:"above"}] },
  { id:"ex13", name:"Wholesome Feel-Good",               desc:"Uplifting, comedy, fatherhood",             criteria:[{d:1,t:"very_low",    dir:"below"},{d:8,t:"very_high",  dir:"above"},{d:12,t:"high",        dir:"above"}] },
  { id:"ex14", name:"Upbeat Musical Fun",                desc:"Uplifting, action spectacle, high comedy",  criteria:[{d:1,t:"extreme_low", dir:"below"},{d:2,t:"high",        dir:"above"},{d:8, t:"extreme_high",dir:"above"}] },
  // ACTION SPECTACLE
  { id:"ex15", name:"Massive Action Blockbusters",       desc:"Action, sci-fi, comedy",                   criteria:[{d:2,t:"extreme_high",dir:"above"},{d:7,t:"extreme_high",dir:"above"},{d:8, t:"high",        dir:"above"}] },
  { id:"ex16", name:"Superhero Megafilms",               desc:"Action, sci-fi, fantasy",                   criteria:[{d:2,t:"extreme_high",dir:"above"},{d:7,t:"very_high",  dir:"above"},{d:5, t:"high",        dir:"above"}] },
  { id:"ex17", name:"Epic Fantasy Battles",              desc:"Action, fantasy, sci-fi",                   criteria:[{d:2,t:"extreme_high",dir:"above"},{d:5,t:"extreme_high",dir:"above"},{d:9, t:"high",        dir:"above"}] },
  { id:"ex18", name:"Explosive Sci-Fi Action",           desc:"Action, sci-fi, modern intellectual",       criteria:[{d:2,t:"very_high",   dir:"above"},{d:7,t:"extreme_high",dir:"above"},{d:19,t:"high",        dir:"above"}] },
  { id:"ex19", name:"Intense War Action",                desc:"Action, historical, suspense",              criteria:[{d:2,t:"extreme_high",dir:"above"},{d:9,t:"extreme_high",dir:"above"},{d:1, t:"high",        dir:"above"}] },
  { id:"ex20", name:"Fast-Paced Thrillers",              desc:"Action, suspense, crime",                   criteria:[{d:2,t:"very_high",   dir:"above"},{d:1,t:"very_high",  dir:"above"},{d:6, t:"high",        dir:"above"}] },
  // DEEP CHARACTER WORK
  { id:"ex21", name:"Intimate Character Portraits",      desc:"Drama, low action, low comedy",             criteria:[{d:3,t:"extreme_high",dir:"above"},{d:2,t:"low",         dir:"below"},{d:8, t:"low",         dir:"below"}] },
  { id:"ex22", name:"Slow-Burn Dramas",                  desc:"Drama, suspense, very low action",          criteria:[{d:3,t:"extreme_high",dir:"above"},{d:1,t:"very_high",  dir:"above"},{d:2, t:"very_low",    dir:"below"}] },
  { id:"ex23", name:"European Arthouse",                 desc:"Drama, mystery, European tone",             criteria:[{d:3,t:"extreme_high",dir:"above"},{d:10,t:"extreme_high",dir:"above"},{d:16,t:"very_high",  dir:"above"}] },
  { id:"ex24", name:"Philosophical Meditations",         desc:"Drama, intellectual, suspense",             criteria:[{d:3,t:"extreme_high",dir:"above"},{d:19,t:"extreme_high",dir:"above"},{d:1, t:"high",        dir:"above"}] },
  { id:"ex25", name:"Relationship Deep-Dives",           desc:"Drama, arts, low action",                   criteria:[{d:3,t:"extreme_high",dir:"above"},{d:15,t:"very_high",  dir:"above"},{d:2, t:"low",         dir:"below"}] },
  { id:"ex26", name:"Contemplative Indies",              desc:"Drama, European, low comedy",               criteria:[{d:3,t:"very_high",   dir:"above"},{d:16,t:"extreme_high",dir:"above"},{d:8, t:"low",         dir:"below"}] },
  // FANTASY & MAGICAL
  { id:"ex27", name:"Epic High Fantasy",                 desc:"Fantasy, action, sci-fi",                   criteria:[{d:5,t:"extreme_high",dir:"above"},{d:2,t:"extreme_high",dir:"above"},{d:9, t:"high",        dir:"above"}] },
  { id:"ex28", name:"Dark Fantasy Worlds",               desc:"Fantasy, suspense, horror",                 criteria:[{d:5,t:"extreme_high",dir:"above"},{d:1,t:"very_high",  dir:"above"},{d:4, t:"high",        dir:"above"}] },
  { id:"ex29", name:"Whimsical Wonder",                  desc:"Fantasy, uplifting, high comedy",           criteria:[{d:5,t:"extreme_high",dir:"above"},{d:1,t:"extreme_low", dir:"below"},{d:8, t:"very_high",   dir:"above"}] },
  { id:"ex30", name:"Magical Adventures",               desc:"Fantasy, comedy, coming-of-age",            criteria:[{d:5,t:"extreme_high",dir:"above"},{d:8,t:"very_high",  dir:"above"},{d:13,t:"high",        dir:"above"}] },
  { id:"ex31", name:"Gothic Fantasy",                   desc:"Fantasy, suspense, mystery",                criteria:[{d:5,t:"very_high",   dir:"above"},{d:1,t:"very_high",  dir:"above"},{d:10,t:"high",        dir:"above"}] },
  // MYSTERY & PUZZLES
  { id:"ex32", name:"Complex Thrillers",                desc:"Crime, suspense, modern intellectual",      criteria:[{d:6,t:"extreme_high",dir:"above"},{d:1,t:"very_high",  dir:"above"},{d:19,t:"very_high",   dir:"above"}] },
  { id:"ex33", name:"Twisty Mystery Box",               desc:"Crime, drama, low comedy",                  criteria:[{d:6,t:"extreme_high",dir:"above"},{d:3,t:"high",        dir:"above"},{d:8, t:"low",         dir:"below"}] },
  { id:"ex34", name:"Detective Procedurals",            desc:"Crime, mystery, drama",                     criteria:[{d:6,t:"extreme_high",dir:"above"},{d:10,t:"high",        dir:"above"},{d:3, t:"high",        dir:"above"}] },
  { id:"ex35", name:"Mind-Bending Sci-Fi",              desc:"Crime, sci-fi, intellectual",               criteria:[{d:6,t:"very_high",   dir:"above"},{d:7,t:"extreme_high",dir:"above"},{d:19,t:"very_high",   dir:"above"}] },
  // SCI-FI
  { id:"ex36", name:"Hard Sci-Fi Epics",                desc:"Sci-fi, intellectual, drama",               criteria:[{d:7,t:"extreme_high",dir:"above"},{d:19,t:"extreme_high",dir:"above"},{d:3, t:"high",        dir:"above"}] },
  { id:"ex37", name:"Dark Dystopian",                   desc:"Sci-fi, suspense, existential",             criteria:[{d:7,t:"extreme_high",dir:"above"},{d:1,t:"extreme_high",dir:"above"},{d:15,t:"high",        dir:"above"}] },
  { id:"ex38", name:"Optimistic Space Opera",           desc:"Sci-fi, uplifting, action",                 criteria:[{d:7,t:"extreme_high",dir:"above"},{d:1,t:"extreme_low", dir:"below"},{d:2, t:"very_high",   dir:"above"}] },
  { id:"ex39", name:"Tech-Thriller Noir",               desc:"Sci-fi, mystery, suspense",                 criteria:[{d:7,t:"very_high",   dir:"above"},{d:10,t:"extreme_high",dir:"above"},{d:1, t:"very_high",   dir:"above"}] },
  { id:"ex40", name:"Time Travel Puzzles",              desc:"Sci-fi, crime, intellectual",               criteria:[{d:7,t:"extreme_high",dir:"above"},{d:6,t:"extreme_high",dir:"above"},{d:19,t:"high",        dir:"above"}] },
  // COMEDY
  { id:"ex41", name:"Absurdist Comedy",                 desc:"Comedy, European tone, intellectual",       criteria:[{d:8,t:"extreme_high",dir:"above"},{d:16,t:"very_high",  dir:"above"},{d:19,t:"high",        dir:"above"}] },
  { id:"ex42", name:"Physical Slapstick",               desc:"Comedy, action, low drama",                 criteria:[{d:8,t:"extreme_high",dir:"above"},{d:2,t:"very_high",  dir:"above"},{d:3, t:"low",         dir:"below"}] },
  { id:"ex43", name:"Dark Comedy Satire",               desc:"Comedy, suspense, intellectual",            criteria:[{d:8,t:"extreme_high",dir:"above"},{d:1,t:"very_high",  dir:"above"},{d:19,t:"high",        dir:"above"}] },
  { id:"ex44", name:"Witty Banter Films",               desc:"Comedy, intellectual, drama",               criteria:[{d:8,t:"very_high",   dir:"above"},{d:19,t:"extreme_high",dir:"above"},{d:3, t:"high",        dir:"above"}] },
  { id:"ex45", name:"Quirky Indie Comedy",              desc:"Comedy, European, drama",                   criteria:[{d:8,t:"extreme_high",dir:"above"},{d:16,t:"extreme_high",dir:"above"},{d:3, t:"high",        dir:"above"}] },
  // HISTORICAL
  { id:"ex46", name:"Sweeping Historical Epics",        desc:"Historical, action, European",              criteria:[{d:9,t:"extreme_high",dir:"above"},{d:2,t:"extreme_high",dir:"above"},{d:16,t:"high",        dir:"above"}] },
  { id:"ex47", name:"Period Romance Dramas",            desc:"Historical, romance, drama",                criteria:[{d:9,t:"extreme_high",dir:"above"},{d:15,t:"extreme_high",dir:"above"},{d:3, t:"high",        dir:"above"}] },
  { id:"ex48", name:"Epic War Films",                   desc:"Historical, action, suspense",              criteria:[{d:9,t:"extreme_high",dir:"above"},{d:2,t:"very_high",  dir:"above"},{d:1, t:"very_high",   dir:"above"}] },
  { id:"ex49", name:"Historical Biopics",               desc:"Historical, drama, intellectual",           criteria:[{d:9,t:"extreme_high",dir:"above"},{d:3,t:"extreme_high",dir:"above"},{d:19,t:"high",        dir:"above"}] },
  { id:"ex50", name:"Period Mysteries",                 desc:"Historical, crime, mystery",                criteria:[{d:9,t:"very_high",   dir:"above"},{d:6,t:"extreme_high",dir:"above"},{d:10,t:"high",        dir:"above"}] },
  // ARTISTIC
  { id:"ex51", name:"Arthouse Masterworks",             desc:"Mystery, European, drama",                  criteria:[{d:10,t:"extreme_high",dir:"above"},{d:16,t:"extreme_high",dir:"above"},{d:3,t:"very_high",   dir:"above"}] },
  { id:"ex52", name:"Provocative Art Films",            desc:"Intellectual, mystery, suspense",           criteria:[{d:19,t:"extreme_high",dir:"above"},{d:10,t:"extreme_high",dir:"above"},{d:1,t:"high",         dir:"above"}] },
  { id:"ex53", name:"Visual Poetry",                    desc:"European, drama, mystery",                  criteria:[{d:16,t:"extreme_high",dir:"above"},{d:3,t:"extreme_high",dir:"above"},{d:10,t:"high",         dir:"above"}] },
  { id:"ex54", name:"Experimental Narratives",          desc:"European, intellectual, crime",             criteria:[{d:16,t:"extreme_high",dir:"above"},{d:19,t:"extreme_high",dir:"above"},{d:6,t:"high",          dir:"above"}] },
  // ROMANCE
  { id:"ex55", name:"Epic Romance",                     desc:"Arts, action spectacle, historical",        criteria:[{d:15,t:"extreme_high",dir:"above"},{d:2,t:"very_high",  dir:"above"},{d:9, t:"high",         dir:"above"}] },
  { id:"ex56", name:"Intimate Love Stories",            desc:"Arts, drama, low action",                   criteria:[{d:15,t:"extreme_high",dir:"above"},{d:3,t:"extreme_high",dir:"above"},{d:2, t:"low",          dir:"below"}] },
  { id:"ex57", name:"Quirky Romance",                   desc:"Arts, comedy, European",                    criteria:[{d:15,t:"extreme_high",dir:"above"},{d:8,t:"extreme_high",dir:"above"},{d:16,t:"high",         dir:"above"}] },
  { id:"ex58", name:"Passionate Drama",                 desc:"Arts, suspense, drama",                     criteria:[{d:15,t:"extreme_high",dir:"above"},{d:1,t:"very_high",  dir:"above"},{d:3, t:"high",         dir:"above"}] },
  // URBAN
  { id:"ex59", name:"NYC Underground",                  desc:"Urban survival, suspense, mystery",         criteria:[{d:20,t:"extreme_high",dir:"above"},{d:1,t:"very_high",  dir:"above"},{d:10,t:"high",         dir:"above"}] },
  { id:"ex60", name:"Urban Comedy",                     desc:"Urban survival, comedy, intellectual",      criteria:[{d:20,t:"extreme_high",dir:"above"},{d:8,t:"extreme_high",dir:"above"},{d:19,t:"high",         dir:"above"}] },
  { id:"ex61", name:"City Crime Thrillers",             desc:"Urban survival, crime and humor, suspense", criteria:[{d:20,t:"extreme_high",dir:"above"},{d:6,t:"extreme_high",dir:"above"},{d:1, t:"high",         dir:"above"}] },
  { id:"ex62", name:"Metropolitan Drama",               desc:"Urban survival, drama, intellectual",       criteria:[{d:20,t:"very_high",   dir:"above"},{d:3,t:"extreme_high",dir:"above"},{d:19,t:"high",         dir:"above"}] },
  // HYBRIDS
  { id:"ex63", name:"Stylish Neo-Noir",                 desc:"Suspense, European, crime",                 criteria:[{d:1,t:"very_high",   dir:"above"},{d:16,t:"extreme_high",dir:"above"},{d:6,t:"very_high",    dir:"above"}] },
  { id:"ex64", name:"Emotional Sci-Fi Drama",           desc:"Sci-fi, drama, suspense",                   criteria:[{d:7,t:"very_high",   dir:"above"},{d:3,t:"extreme_high",dir:"above"},{d:1,t:"high",          dir:"above"}] },
  { id:"ex65", name:"Supernatural Mystery",             desc:"Horror, crime, suspense",                   criteria:[{d:4,t:"extreme_high",dir:"above"},{d:6,t:"extreme_high",dir:"above"},{d:1,t:"high",          dir:"above"}] },
  // NICHE
  { id:"ex66", name:"Coming-of-Age Indie",              desc:"Psychological conflict, European, drama",   criteria:[{d:14,t:"extreme_high",dir:"above"},{d:16,t:"extreme_high",dir:"above"},{d:3,t:"high",         dir:"above"}] },
  { id:"ex67", name:"Female-Led Dramas",                desc:"Everyman protagonist, drama, intellectual", criteria:[{d:12,t:"extreme_high",dir:"above"},{d:3,t:"extreme_high",dir:"above"},{d:19,t:"high",         dir:"above"}] },
  { id:"ex68", name:"Gritty Crime Westerns",            desc:"Betrayal, suspense, historical",            criteria:[{d:11,t:"extreme_high",dir:"above"},{d:1,t:"very_high",  dir:"above"},{d:9, t:"high",         dir:"above"}] },
  { id:"ex69", name:"Political Thrillers",              desc:"Power struggles, intellectual, suspense",   criteria:[{d:18,t:"extreme_high",dir:"above"},{d:19,t:"extreme_high",dir:"above"},{d:1,t:"high",         dir:"above"}] },
  { id:"ex70", name:"Redemption Stories",               desc:"Psychological conflict, suspense, drama",   criteria:[{d:14,t:"extreme_high",dir:"above"},{d:1,t:"high",        dir:"above"},{d:3, t:"high",         dir:"above"}] },
  { id:"ex71", name:"Ensemble Comedies",                desc:"Comedy-driven, comedy, intellectual",       criteria:[{d:13,t:"extreme_high",dir:"above"},{d:8,t:"extreme_high",dir:"above"},{d:19,t:"high",         dir:"above"}] },
  { id:"ex72", name:"Brooding Melodramas",              desc:"Suspense, arts, drama",                     criteria:[{d:1,t:"extreme_high",dir:"above"},{d:15,t:"extreme_high",dir:"above"},{d:3,t:"high",          dir:"above"}] },
  { id:"ex73", name:"Asian Horror Masters",             desc:"Horror, Asian crime, suspense",             criteria:[{d:4,t:"very_high",   dir:"above"},{d:7,t:"very_high",  dir:"above"},{d:1, t:"high",         dir:"above"}] },
  { id:"ex74", name:"Crime Docudramas",                 desc:"Mystery, realism, crime",                   criteria:[{d:10,t:"very_high",  dir:"above"},{d:6,t:"very_high",  dir:"above"},{d:3, t:"high",         dir:"above"}] },
  { id:"ex75", name:"Surreal Horror",                   desc:"Horror, mystery, drama",                    criteria:[{d:4,t:"extreme_high",dir:"above"},{d:10,t:"high",        dir:"above"},{d:3, t:"high",         dir:"above"}] },
  { id:"ex76", name:"Retro Sci-Fi Classics",            desc:"Historical, sci-fi, intellectual",          criteria:[{d:9,t:"very_high",   dir:"above"},{d:7,t:"very_high",  dir:"above"},{d:19,t:"very_high",    dir:"above"}] },
  { id:"ex77", name:"Feminist Arthouse",                desc:"Feminist cinema, drama, European",          criteria:[{d:17,t:"very_high",  dir:"below"},{d:3,t:"extreme_high",dir:"above"},{d:16,t:"very_high",    dir:"above"}] },
  { id:"ex78", name:"Domestic Noir",                    desc:"Family drama, suspense, mystery",           criteria:[{d:5,t:"very_high",   dir:"below"},{d:1,t:"very_high",  dir:"above"},{d:10,t:"very_high",    dir:"above"}] },
  { id:"ex79", name:"Violent Revenge Dramas",           desc:"Spectacle, suspense, power",                criteria:[{d:11,t:"very_high",  dir:"below"},{d:1,t:"very_high",  dir:"above"},{d:18,t:"high",         dir:"above"}] },
  { id:"ex80", name:"Slow European Thrillers",          desc:"European, drama, crime",                    criteria:[{d:16,t:"very_high",  dir:"above"},{d:3,t:"very_high",  dir:"above"},{d:6, t:"high",         dir:"above"}] },
];

export const EXAMPLE_RAILS: Rail[] = RAW.map((r) => ({
  id: r.id,
  name: r.name,
  desc: r.desc,
  rules: cr(r.criteria),
  isExample: true,
}));
