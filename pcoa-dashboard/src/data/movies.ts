export interface Movie {
  id: string;
  title: string;
  year: number;
  scores: Record<string, number>;
}

function seededRand(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

const MOVIE_LIST = [
  { title: "Parasite", year: 2019 },
  { title: "The Shawshank Redemption", year: 1994 },
  { title: "Inception", year: 2010 },
  { title: "Spirited Away", year: 2001 },
  { title: "The Dark Knight", year: 2008 },
  { title: "Pulp Fiction", year: 1994 },
  { title: "Schindler's List", year: 1993 },
  { title: "Goodfellas", year: 1990 },
  { title: "The Godfather", year: 1972 },
  { title: "Fight Club", year: 1999 },
  { title: "Forrest Gump", year: 1994 },
  { title: "The Matrix", year: 1999 },
  { title: "Interstellar", year: 2014 },
  { title: "City of God", year: 2002 },
  { title: "The Silence of the Lambs", year: 1991 },
  { title: "Rear Window", year: 1954 },
  { title: "Casablanca", year: 1942 },
  { title: "12 Angry Men", year: 1957 },
  { title: "The Lion King", year: 1994 },
  { title: "Jurassic Park", year: 1993 },
  { title: "Eternal Sunshine", year: 2004 },
  { title: "Lost in Translation", year: 2003 },
  { title: "Her", year: 2013 },
  { title: "Drive", year: 2011 },
  { title: "Moon", year: 2009 },
  { title: "Blade Runner 2049", year: 2017 },
  { title: "Arrival", year: 2016 },
  { title: "Ex Machina", year: 2014 },
  { title: "Get Out", year: 2017 },
  { title: "Hereditary", year: 2018 },
  { title: "Midsommar", year: 2019 },
  { title: "Everything Everywhere All at Once", year: 2022 },
  { title: "The Whale", year: 2022 },
  { title: "Tár", year: 2022 },
  { title: "Aftersun", year: 2022 },
  { title: "The Banshees of Inisherin", year: 2022 },
  { title: "Triangle of Sadness", year: 2022 },
  { title: "Decision to Leave", year: 2022 },
  { title: "All Quiet on the Western Front", year: 2022 },
  { title: "The Fabelmans", year: 2022 },
  { title: "Portrait of a Lady on Fire", year: 2019 },
  { title: "Pain and Glory", year: 2019 },
  { title: "Burning", year: 2018 },
  { title: "Roma", year: 2018 },
  { title: "Cold War", year: 2018 },
  { title: "A Separation", year: 2011 },
  { title: "The Hunt", year: 2012 },
  { title: "Force Majeure", year: 2014 },
  { title: "The Square", year: 2017 },
  { title: "Wild Tales", year: 2014 },
];

function generateMovies(): Movie[] {
  const dims = Array.from({ length: 20 }, (_, i) => `PCoA_Dim${i + 1}`);
  return MOVIE_LIST.map((m, idx) => {
    const rand = seededRand(idx * 31337 + 42);
    const scores: Record<string, number> = {};
    dims.forEach((d) => {
      scores[d] = parseFloat(((rand() * 2 - 1) * 0.85).toFixed(4));
    });
    return { id: `movie_${idx + 1}`, ...m, scores };
  });
}

export const MOVIES: Movie[] = generateMovies();
