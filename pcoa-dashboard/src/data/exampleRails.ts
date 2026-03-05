export interface Rule {
  dim: string;
  op: ">=" | "<=";
  threshold: number;
}

export interface Rail {
  id: string;
  name: string;
  description: string;
  rules: Rule[];
  logic: "AND" | "OR";
  isExample?: boolean;
}

export const EXAMPLE_RAILS: Rail[] = [
  { id: "ex1",  name: "Dark Psychological Thrillers",       description: "High tension, low warmth",             logic: "AND", isExample: true, rules: [{ dim: "PCoA_Dim1", op: ">=", threshold: 0.3 }, { dim: "PCoA_Dim4", op: ">=", threshold: 0.2 }] },
  { id: "ex2",  name: "Feel-Good Family Films",             description: "Warm, emotional, uplifting",           logic: "AND", isExample: true, rules: [{ dim: "PCoA_Dim1", op: "<=", threshold: -0.3 }, { dim: "PCoA_Dim5", op: "<=", threshold: -0.2 }] },
  { id: "ex3",  name: "Superhero Spectacles",               description: "Action-packed heroic journeys",        logic: "AND", isExample: true, rules: [{ dim: "PCoA_Dim2", op: ">=", threshold: 0.4 }, { dim: "PCoA_Dim11", op: "<=", threshold: -0.3 }] },
  { id: "ex4",  name: "Arthouse & Auteur Visions",          description: "Visually innovative character studies",logic: "AND", isExample: true, rules: [{ dim: "PCoA_Dim5", op: ">=", threshold: 0.3 }, { dim: "PCoA_Dim3", op: ">=", threshold: 0.2 }] },
  { id: "ex5",  name: "Whodunit Mysteries",                 description: "Puzzle narratives and deception",      logic: "AND", isExample: true, rules: [{ dim: "PCoA_Dim10", op: ">=", threshold: 0.3 }, { dim: "PCoA_Dim11", op: ">=", threshold: 0.2 }] },
  { id: "ex6",  name: "Gritty Crime Comedies",              description: "Twisty plots with dark humor",         logic: "AND", isExample: true, rules: [{ dim: "PCoA_Dim6", op: ">=", threshold: 0.3 }, { dim: "PCoA_Dim8", op: "<=", threshold: -0.2 }] },
  { id: "ex7",  name: "Sci-Fi Epics",                       description: "Futuristic tech and wonder",           logic: "AND", isExample: true, rules: [{ dim: "PCoA_Dim9", op: ">=", threshold: 0.4 }, { dim: "PCoA_Dim7", op: "<=", threshold: -0.3 }] },
  { id: "ex8",  name: "Asian Crime Thrillers",              description: "Cultural tension, crime, suspense",    logic: "AND", isExample: true, rules: [{ dim: "PCoA_Dim7", op: ">=", threshold: 0.3 }, { dim: "PCoA_Dim4", op: ">=", threshold: 0.15 }] },
  { id: "ex9",  name: "Intimate Romance Dramas",            description: "Relationship drama, emotional pull",   logic: "AND", isExample: true, rules: [{ dim: "PCoA_Dim8", op: ">=", threshold: 0.3 }, { dim: "PCoA_Dim14", op: "<=", threshold: -0.2 }] },
  { id: "ex10", name: "Existential Slow Burns",             description: "Death, philosophy, introspection",     logic: "AND", isExample: true, rules: [{ dim: "PCoA_Dim15", op: "<=", threshold: -0.3 }, { dim: "PCoA_Dim3", op: ">=", threshold: 0.2 }] },
  { id: "ex11", name: "European Art House",                 description: "Continental Europe, satire, dry wit",  logic: "AND", isExample: true, rules: [{ dim: "PCoA_Dim16", op: ">=", threshold: 0.3 }, { dim: "PCoA_Dim17", op: "<=", threshold: -0.2 }] },
  { id: "ex12", name: "American Supernatural",              description: "Ghosts, dialogue, US settings",        logic: "AND", isExample: true, rules: [{ dim: "PCoA_Dim17", op: ">=", threshold: 0.3 }] },
  { id: "ex13", name: "Feminist Cinema",                    description: "Female-led narratives",                logic: "AND", isExample: true, rules: [{ dim: "PCoA_Dim17", op: "<=", threshold: -0.3 }, { dim: "PCoA_Dim20", op: "<=", threshold: -0.2 }] },
  { id: "ex14", name: "NYC Urban Survival",                 description: "Metropolitan grit and temptation",     logic: "AND", isExample: true, rules: [{ dim: "PCoA_Dim20", op: ">=", threshold: 0.3 }] },
  { id: "ex15", name: "Coming-of-Age Classics",             description: "Youth, identity, growth",              logic: "AND", isExample: true, rules: [{ dim: "PCoA_Dim13", op: "<=", threshold: -0.3 }] },
  { id: "ex16", name: "Laugh-Out-Loud Comedies",            description: "Humor-centered storytelling",          logic: "AND", isExample: true, rules: [{ dim: "PCoA_Dim13", op: ">=", threshold: 0.4 }] },
  { id: "ex17", name: "Political Spy Thrillers",            description: "Espionage, dialogue-driven tension",   logic: "AND", isExample: true, rules: [{ dim: "PCoA_Dim4", op: ">=", threshold: 0.4 }] },
  { id: "ex18", name: "WW2 & Historical War",               description: "Wartime settings, historical weight",  logic: "AND", isExample: true, rules: [{ dim: "PCoA_Dim6", op: "<=", threshold: -0.3 }, { dim: "PCoA_Dim9", op: "<=", threshold: -0.2 }] },
  { id: "ex19", name: "Grounded Realism",                   description: "Unfiltered dialogue, real-world tone", logic: "AND", isExample: true, rules: [{ dim: "PCoA_Dim10", op: "<=", threshold: -0.3 }] },
  { id: "ex20", name: "Sensory Immersion Films",            description: "Heavy sound design, technical craft",  logic: "AND", isExample: true, rules: [{ dim: "PCoA_Dim11", op: "<=", threshold: -0.3 }] },
  { id: "ex21", name: "Father-Son Stories",                 description: "Paternal arcs, generational bonds",    logic: "AND", isExample: true, rules: [{ dim: "PCoA_Dim12", op: ">=", threshold: 0.3 }] },
  { id: "ex22", name: "Everyman Hero Journeys",             description: "Grounded protagonists, everyday struggles", logic: "AND", isExample: true, rules: [{ dim: "PCoA_Dim12", op: "<=", threshold: -0.3 }] },
  { id: "ex23", name: "Inner Demons & Moral Conflict",      description: "Psychological struggle, confronting self", logic: "AND", isExample: true, rules: [{ dim: "PCoA_Dim14", op: ">=", threshold: 0.3 }] },
  { id: "ex24", name: "Artists & Creatives",                description: "Fine arts, creativity on screen",      logic: "AND", isExample: true, rules: [{ dim: "PCoA_Dim15", op: ">=", threshold: 0.3 }] },
  { id: "ex25", name: "Police Procedurals",                 description: "Crime investigation, law enforcement",  logic: "AND", isExample: true, rules: [{ dim: "PCoA_Dim16", op: "<=", threshold: -0.4 }] },
  { id: "ex26", name: "Betrayal & Broken Trust",            description: "Fractured alliances, deception",       logic: "AND", isExample: true, rules: [{ dim: "PCoA_Dim11", op: ">=", threshold: 0.3 }, { dim: "PCoA_Dim10", op: ">=", threshold: 0.15 }] },
  { id: "ex27", name: "Power Struggles",                    description: "Moral conflict, psychological power",   logic: "AND", isExample: true, rules: [{ dim: "PCoA_Dim18", op: ">=", threshold: 0.3 }] },
  { id: "ex28", name: "Intellectual Character Studies",     description: "Genius leads, philosophical depth",    logic: "AND", isExample: true, rules: [{ dim: "PCoA_Dim19", op: ">=", threshold: 0.3 }] },
  { id: "ex29", name: "Vintage Black & White Era",          description: "Mid-century stage and performance",     logic: "AND", isExample: true, rules: [{ dim: "PCoA_Dim19", op: "<=", threshold: -0.3 }] },
  { id: "ex30", name: "Male Bonding & Bromance",            description: "Satire, raw humor, male friendship",   logic: "AND", isExample: true, rules: [{ dim: "PCoA_Dim8", op: "<=", threshold: -0.3 }] },
  { id: "ex31", name: "Chase Thrillers",                    description: "Urban chase, hardship, kinetic energy", logic: "AND", isExample: true, rules: [{ dim: "PCoA_Dim18", op: "<=", threshold: -0.3 }, { dim: "PCoA_Dim3", op: "<=", threshold: -0.2 }] },
  { id: "ex32", name: "Slow Cinema",                        description: "Meditative pace, contemplative mood",   logic: "AND", isExample: true, rules: [{ dim: "PCoA_Dim3", op: ">=", threshold: 0.4 }, { dim: "PCoA_Dim15", op: "<=", threshold: -0.15 }] },
  { id: "ex33", name: "High-Concept Sci-Fi",                description: "Big ideas, futuristic worlds",          logic: "AND", isExample: true, rules: [{ dim: "PCoA_Dim7", op: "<=", threshold: -0.3 }, { dim: "PCoA_Dim9", op: ">=", threshold: 0.3 }] },
  { id: "ex34", name: "Supernatural Horror",                description: "Eerie, psychological dread",            logic: "AND", isExample: true, rules: [{ dim: "PCoA_Dim4", op: "<=", threshold: -0.4 }, { dim: "PCoA_Dim1", op: ">=", threshold: 0.2 }] },
  { id: "ex35", name: "Courtroom & Legal Drama",            description: "Dialogue-driven tension, justice",      logic: "AND", isExample: true, rules: [{ dim: "PCoA_Dim4", op: ">=", threshold: 0.2 }, { dim: "PCoA_Dim16", op: "<=", threshold: -0.2 }] },
  { id: "ex36", name: "Village Life & Rural Drama",         description: "Small communities, quiet character arcs", logic: "AND", isExample: true, rules: [{ dim: "PCoA_Dim20", op: "<=", threshold: -0.3 }] },
  { id: "ex37", name: "Road Movies",                        description: "Journey, self-discovery, landscapes",   logic: "AND", isExample: true, rules: [{ dim: "PCoA_Dim3", op: "<=", threshold: -0.2 }, { dim: "PCoA_Dim13", op: "<=", threshold: -0.15 }] },
  { id: "ex38", name: "Heist & Con Films",                  description: "Clever schemes, deception, twists",     logic: "AND", isExample: true, rules: [{ dim: "PCoA_Dim10", op: ">=", threshold: 0.2 }, { dim: "PCoA_Dim6", op: ">=", threshold: 0.15 }] },
  { id: "ex39", name: "Romance in Unusual Settings",        description: "Love stories with unusual backdrops",   logic: "AND", isExample: true, rules: [{ dim: "PCoA_Dim2", op: "<=", threshold: -0.2 }, { dim: "PCoA_Dim14", op: "<=", threshold: -0.25 }] },
  { id: "ex40", name: "Dystopian Futures",                  description: "Dark societies, survival, rebellion",   logic: "AND", isExample: true, rules: [{ dim: "PCoA_Dim9", op: ">=", threshold: 0.2 }, { dim: "PCoA_Dim1", op: ">=", threshold: 0.25 }] },
  { id: "ex41", name: "Grief & Loss",                       description: "Emotional weight, mourning, healing",   logic: "AND", isExample: true, rules: [{ dim: "PCoA_Dim15", op: "<=", threshold: -0.2 }, { dim: "PCoA_Dim1", op: ">=", threshold: 0.15 }] },
  { id: "ex42", name: "Comedy of Manners",                  description: "Social satire, class dynamics",         logic: "AND", isExample: true, rules: [{ dim: "PCoA_Dim16", op: ">=", threshold: 0.2 }, { dim: "PCoA_Dim13", op: ">=", threshold: 0.2 }] },
  { id: "ex43", name: "War & Resistance",                   description: "Courage under fire, moral choices",     logic: "AND", isExample: true, rules: [{ dim: "PCoA_Dim6", op: "<=", threshold: -0.2 }, { dim: "PCoA_Dim18", op: ">=", threshold: 0.15 }] },
  { id: "ex44", name: "Memory & Identity",                  description: "Who are we? Fragmented selves",         logic: "AND", isExample: true, rules: [{ dim: "PCoA_Dim14", op: ">=", threshold: 0.2 }, { dim: "PCoA_Dim19", op: ">=", threshold: 0.2 }] },
  { id: "ex45", name: "Animated & Family Fantasy",          description: "Imagination-driven worlds for all ages", logic: "AND", isExample: true, rules: [{ dim: "PCoA_Dim5", op: ">=", threshold: 0.3 }, { dim: "PCoA_Dim1", op: "<=", threshold: -0.2 }] },
  { id: "ex46", name: "Cult & Underground Films",           description: "Subversive, edgy, offbeat narratives",  logic: "AND", isExample: true, rules: [{ dim: "PCoA_Dim8", op: "<=", threshold: -0.2 }, { dim: "PCoA_Dim10", op: "<=", threshold: -0.15 }] },
  { id: "ex47", name: "Bio-Pics & Real Stories",            description: "True events, inspirational figures",    logic: "AND", isExample: true, rules: [{ dim: "PCoA_Dim9", op: "<=", threshold: -0.2 }, { dim: "PCoA_Dim3", op: ">=", threshold: 0.15 }] },
  { id: "ex48", name: "Paranoid Thrillers",                 description: "Who to trust? Conspiracy and fear",     logic: "AND", isExample: true, rules: [{ dim: "PCoA_Dim11", op: ">=", threshold: 0.2 }, { dim: "PCoA_Dim4", op: ">=", threshold: 0.15 }] },
  { id: "ex49", name: "Love & Obsession",                   description: "Consuming romantic desire",             logic: "AND", isExample: true, rules: [{ dim: "PCoA_Dim2", op: "<=", threshold: -0.3 }, { dim: "PCoA_Dim14", op: "<=", threshold: -0.3 }] },
  { id: "ex50", name: "Immigrant & Diaspora Stories",       description: "Cultural displacement, identity",       logic: "AND", isExample: true, rules: [{ dim: "PCoA_Dim7", op: ">=", threshold: 0.2 }, { dim: "PCoA_Dim20", op: "<=", threshold: -0.15 }] },
];
