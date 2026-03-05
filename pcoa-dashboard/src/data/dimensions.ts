export const DIMENSIONS = [
  { id: "PCoA_Dim1",  neg: "Feel-Good & Uplifting Drama",                    pos: "Suspense & Psychological Tension",              short: "Dim1: Uplifting vs Suspense" },
  { id: "PCoA_Dim2",  neg: "Romantic & Psychological Relationship Drama",     pos: "High-Energy Heroic Action & Spectacle",        short: "Dim2: Romance vs Action" },
  { id: "PCoA_Dim3",  neg: "Fast-Paced Plot-Driven Action",                   pos: "Reflective Character-Driven Drama",            short: "Dim3: Action vs Drama" },
  { id: "PCoA_Dim4",  neg: "Supernatural Horror & Fright Tone",               pos: "Cerebral Political & Crime Intrigue",          short: "Dim4: Horror vs Intrigue" },
  { id: "PCoA_Dim5",  neg: "Family-Centered Domestic Drama",                  pos: "Auteur-Driven Fantasy & Visual Innovation",    short: "Dim5: Family vs Fantasy" },
  { id: "PCoA_Dim6",  neg: "Historical & Wartime Narratives (Asia)",           pos: "Twisty Dialogue-Driven Crime & Humor",         short: "Dim6: History vs Crime" },
  { id: "PCoA_Dim7",  neg: "American Sci-Fi & Futuristic Thrillers",          pos: "Asian Crime & Cultural Thrillers",             short: "Dim7: Sci-Fi vs Asian Crime" },
  { id: "PCoA_Dim8",  neg: "Edgy Satirical Male-Bonding Comedy",              pos: "Romantic Relationship Drama",                  short: "Dim8: Comedy vs Romance" },
  { id: "PCoA_Dim9",  neg: "Historical European Biographical Drama",           pos: "Futuristic Tech & Sci-Fi Adventure",           short: "Dim9: Historical vs Sci-Fi" },
  { id: "PCoA_Dim10", neg: "Raw Realism",                                      pos: "Mystery & Puzzle Narrative",                   short: "Dim10: Realism vs Mystery" },
  { id: "PCoA_Dim11", neg: "Sensory Spectacle",                                pos: "Trust & Betrayal",                             short: "Dim11: Spectacle vs Betrayal" },
  { id: "PCoA_Dim12", neg: "Relatable Everyman Protagonist",                   pos: "Fatherhood Arc",                               short: "Dim12: Everyman vs Father" },
  { id: "PCoA_Dim13", neg: "Coming-of-Age Story",                              pos: "Comedy-Driven Narrative",                      short: "Dim13: Coming-of-Age vs Comedy" },
  { id: "PCoA_Dim14", neg: "Romantic Courtship",                               pos: "Inner Psychological Conflict",                 short: "Dim14: Courtship vs Conflict" },
  { id: "PCoA_Dim15", neg: "Mortality & Existential Reflection",               pos: "The Arts & Creative Life",                     short: "Dim15: Mortality vs Arts" },
  { id: "PCoA_Dim16", neg: "Police Thriller",                                  pos: "European Setting & Cultural Tone",             short: "Dim16: Police vs European" },
  { id: "PCoA_Dim17", neg: "European Fine Arts & Feminist Cinema",             pos: "American Supernatural Dialogue Drama",         short: "Dim17: Feminist vs Supernatural" },
  { id: "PCoA_Dim18", neg: "European Urban Hardship & Chase Stories",          pos: "Moral Power Struggles & Psychological Conflict", short: "Dim18: Hardship vs Power" },
  { id: "PCoA_Dim19", neg: "Mid-Century Performance & Setback Drama",          pos: "Modern Intellectual Character Studies",        short: "Dim19: Mid-Century vs Intellectual" },
  { id: "PCoA_Dim20", neg: "Rural & Contemporary Feminist Stories",            pos: "Urban Psychological Survival (NYC-Style)",     short: "Dim20: Rural vs Urban" },
];

export type Dimension = typeof DIMENSIONS[number];
