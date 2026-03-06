# PCoA Rail Builder Dashboard

A production-grade dashboard for building custom movie "rails" using PCoA (Principal Coordinates Analysis) dimension scores.

## Features

- **Rail Builder** — Select dimensions, set `>=` / `<=` threshold rules, preview matching movies in real time, save rails
- **Dimensions** — Browse all 20 PCoA dimensions with full axis labels, searchable table
- **My Rails** — Manage user-created rails (edit, duplicate, delete) + 50 read-only example rails

## Tech Stack

- [Next.js 14](https://nextjs.org/) (App Router)
- TypeScript
- Tailwind CSS
- `lucide-react` icons

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

---

## Deploy to Vercel

### Option 1 — Vercel CLI

```bash
npm i -g vercel
vercel
```

### Option 2 — GitHub Integration

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your GitHub repo
4. Vercel auto-detects Next.js — click **Deploy**

No environment variables required for the base app.

---

## Project Structure

```
src/
  app/
    layout.tsx         # Root layout + global fonts
    page.tsx           # Entry point → Dashboard
    globals.css        # Design system (CSS variables, utilities)
  components/
    Dashboard.tsx      # Tab shell + shared state
    RailBuilder.tsx    # Rail Builder tab
    DimensionsTab.tsx  # Dimensions tab
    MyRails.tsx        # My Rails tab + modals
  data/
    dimensions.ts      # 20 PCoA dimensions (from PDF)
    movies.ts          # 50 mock movies with seeded scores
    exampleRails.ts    # 50 example rails
  lib/
    railEngine.ts      # Rule evaluation logic
public/
  dimensions_labels.json  # Dimension labels (source of truth)
```

---

## Connecting Your Real PCoA Data

### Step 1 — Replace mock movies

Edit `src/data/movies.ts`. Replace the `MOVIE_LIST` array and `generateMovies()` with a loader that reads your actual `pcoa_coordinates_20D.csv`:

```typescript
// Example: load from a CSV you place in /public
export async function loadMovies(): Promise<Movie[]> {
  const res = await fetch('/pcoa_coordinates_20D.csv');
  const text = await res.text();
  // parse CSV rows → Movie[]
}
```

Or for server-side loading, read the file in a Next.js API route:

```typescript
// src/app/api/movies/route.ts
import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';

export async function GET() {
  const raw = readFileSync('data/pcoa_coordinates_20D.csv', 'utf-8');
  const rows = parse(raw, { columns: true, skip_empty_lines: true });
  return Response.json(rows);
}
```

### Step 2 — Replace example rails

Edit `src/data/exampleRails.ts` and replace `EXAMPLE_RAILS` with your actual rails loaded from your Python module's output.

---

## Regenerating `dimensions_labels.json`

If you update the PDF source, run:

```bash
python scripts/parse_dimensions_pdf.py
```

This reads `Dimension_Breakthrough.pdf` and overwrites `public/dimensions_labels.json`.

The app reads dimension labels from `src/data/dimensions.ts` (TypeScript mirror of the JSON) — update both files when labels change.

---

## Design System

| Token | Value |
|-------|-------|
| Base background | `#090d14` |
| Surface | `#0d1117` |
| Card | `#161b22` |
| Accent (amber) | `#e6b450` |
| Negative axis | `#60a5fa` (blue) |
| Positive axis | `#f97316` (orange) |
| Font: scores | JetBrains Mono |
| Font: UI | Syne + DM Sans |
