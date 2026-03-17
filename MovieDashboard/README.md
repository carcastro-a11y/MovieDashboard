# Rail Creation
 
> **Presented by:** Becker, Castro, Hammer, Reyes
 
---
 
## Overview
 
**Rail Creation** is a mood-based film recommendation system that moves beyond traditional genre tags. Instead of binary labels like "Action" or "Drama," it builds **mood rails** — thematic shelves that capture how a film *feels*, allowing one film to belong to many rails.
 
> *Not a genre tag. Not an algorithm score. A mood match.*
 
### The Core Idea
 
The project starts with a fundamental question: **how do you describe what a movie is like, not just what genre it belongs to?**
 
Every film in the dataset is scored across **248 narrative and stylistic traits** — things like `suspenseful_atmosphere`, `character_driven`, `happy_ending`, or `set_in_japan`. Each trait is rated on a **0–3 intensity scale**:
 
| Score | Meaning |
|---|---|
| **0** | Trait is absent from the film |
| **1** | Trait is weakly present |
| **2** | Trait is moderately present |
| **3** | Trait is strongly present — a defining feature of the film |
 
For example, a film like *Psycho* might score **3** on `suspenseful_atmosphere` and `psychological_suspense`, **0** on `happy_ending`, and **1** on `character_driven`. These trait vectors become the raw material for building rails.
 
The goal: use those trait scores to mathematically discover **the major axes along which films vary** — and then name those axes as viewer-facing mood rails. A film like *The Dark Knight* can sit on multiple rails simultaneously (Psychological Thriller, Action, Moral Drama) because real viewers don't experience films as one-dimensional categories.
 
---
 
## The Problem
 
When someone opens a streaming app at 10pm on a Monday, they want to feel something specific — not browse a category label.
 
| Genre Tag | Mood Rail |
|---|---|
| Action | Easygoing Adventure |
| Drama | Dark Psychological Tension |
| Thriller | Pressure Building |
| Binary labels — one film, one box | Secrets and Consequences — one film, many rails |
 
**What the model gives you:**
- **Genre is binary and editorial** — Rails are built on key traits or themes of the films
- **Multi-rail membership** — Movies can be on multiple rails based on key themes and features that define what they're like
- **What you give the customer** — They land on "Heroic Sci-Fi" and see Star Wars, Avatar, Avengers. They recognise it instantly. That recognition is the product.
 
---
 
## Today's Agenda
 
1. **The Problem** — What viewers need
2. **The Data** — 8,000 films · 248 trait features · IDF weighting
3. **The Method** — PCoA embedding · scree plot · 20 dimensions
4. **The Rails** — Named shelves with real examples
5. **Business Case** — Overlap, sizing, new-title placement, trade-offs
 
---
 
## Input Data
 
| Stat | Value |
|---|---|
| Films in the Dataset | 8,000 |
| Trait Features | 248 |
| Cells with zero value (sparse) | 76.4% |
 
### Trait Scoring Scale
 
| Score | Meaning |
|---|---|
| 0 | Trait absent |
| 1 | Weakly present |
| 2 | Moderately present |
| 3 | Strongly present |
 
### Example Traits
- `suspenseful_atmosphere`
- `character_driven`
- `set_in_japan`
- `nonsensical_comedy`
- `happy_ending`
- `psychological_suspense`
 
---
 
## IDF Weighting: Rare Traits Matter More
 
A trait appearing in 285 films tells you more about a film than one appearing in 6,371.
 
**Formula:**
```
weight = (log( N + 1 ) / (df + 1) + 1) ^ 0.85
```
 
- **IDF** = Inverse Document Frequency — rarity-based weighting
- **Weight range:** 1.19 – 3.476
- **Alpha = 0.85** — reduces influence of very rare traits to prevent overpowering noise
 
### Examples
 
| Trait | # of Films | Weight | Interpretation |
|---|---|---|---|
| `set_in_japan` | 285 | 3.476 | Very rare → very informative |
| `character_driven` | 6,371 | 1.190 | Near-universal → low weight |
 
> **Why not Z-Score?** All 248 traits are on the same 0–3 unit scale. Z-scoring would amplify near-zero-variance features and destroy the intensity signal in values 1, 2, 3.
 
---
 
## Distance Metric
 
Every pair of 8,000 films gets a distance score representing how different they are, computed by summing IDF-weighted trait differences:
 
```
distance(A, B) = Σ | weighted_trait_A - weighted_trait_B |
```
 
**Distance stats:** Raw range 7.19 – 617.94. Normalised to [0, 1] so the absolute scale does not distort the embedding step.
 
### Why Weighted Manhattan, Not Euclidean?
 
| Method | Description |
|---|---|
| **Weighted Manhattan (used)** | Sum of weighted absolute distances · Identifies ordinal relationships · Explainable |
| **Euclidean** | Straight-line distance (squared differences) · Likes continuous features with linear magnitude differences · Sensitive to outliers |
 
---
 
## Why PCoA?
 
We needed a method that accepts a custom distance metric **AND** produces axes with a consistent, nameable direction.
 
| Method | Custom Distance | Interpretable Axis | Verdict |
|---|---|---|---|
| **PCoA** | ✅ Yes | ✅ Yes — Bipolar axes | ✅ **Selected: Only Method that Satisfies Both Requirements** |
| PCA | ❌ NO — Euclidean only | ✅ Yes | ❌ Rejected: can't use IDF weighted metric |
| Factor Analysis | ❌ No | ✅ Yes | ❌ Rejected: assumes latent factors cause traits |
| Clustering | ✅ Yes | N/A | ❌ Rejected: wanted option to create custom rails |
 
---
 
## Dimension Selection
 
### Scree Plot Results
 
- **Variance Captured (20D):** 47.4% of all positive eigenvalue variance
- **Dims 21–30 Combined:** +6.1% — less than Dim 1 alone (10.3%)
- **Positive Eigenvalues:** 671 of 8,000 total (expected for L1 metric)
 
### Cutoff Rationale
 
| Finding | Detail |
|---|---|
| 3 dominant axes | 6 secondary axes, 14 diminishing plateau of consistent signal |
| Stop at Dimension 20 | Marginal variance drops below 0.77% per dimension |
| Next 10 dimensions (21–30) | Contribute less than a single first dimension |
 
---
 
## Spearman Correlation for Dimension Interpretation
 
### What Spearman Does
 
After PCoA produces coordinates, we need to know what each axis means:
- Spearman correlation measures the **monotonic relationship** between each dimension's scores and each of the 248 traits across all 8,000 films
- If films that score high on Dimension 1 consistently also score high on `suspenseful_atmosphere`, that trait defines the axis
 
### Why Not Pearson?
 
| Spearman | Pearson |
|---|---|
| Works on **ranks** — correctly handles the stepped ordinal structure without assuming equal intervals | Assumes a **linear relationship** between normally distributed variables — treats the gap between 0 and 1 as mathematically identical to the gap between 2 and 3 |
| Appropriate for **ordinal (0–3 scale)** data | Best for **continuous** data |
 
---
 
## Dimension Interpretation
 
Each dimension contains many correlated features. Most features have small correlations and contribute little meaning — only the strongest define the axis.
 
### Dimension 1: Warmth & Uplift ↔ Dark Psychological Tension
 
**Positive (Warmth & Uplift):** Feel-Good Narrative, Happy Ending, Positive Emotional Tone  
**Negative (Dark Psychological Tension):** Somber Atmosphere, Psychological Suspense, Suspenseful Atmosphere
 
Top positive correlations include:
- `Suspenseful atmosphere` — 0.807
- `Somber atmosphere` — 0.766
- `Psychological Suspense` — 0.736
- `Heightened Tension` — 0.734
 
Top negative correlations include:
- `Happy Ending` — -0.680
- `Positive, Uplifting Emotional Tone` — -0.675
- `Feel-Good Narrative` — -0.652
- `Positive Emotional Tone` — -0.650
 
### Dimension 2: Psychological Unease ↔ Heroic Adventure & Action
 
**Positive (Psychological Unease):** Unstable Protagonist, Relationship Turmoil, Psychological Horror  
**Negative (Heroic Adventure & Action):** Formidable Challenge, Brave Protagonist, The Hero's Journey
 
Feature correlations:
- Hero's Journey: +0.71
- Brave Protagonist: +0.71
- Formidable Challenge: +0.59
- Psychological Horror: -0.27
- Romantic Drama: -0.20
- Unstable Protagonist: -0.19
 
### Dimension 20: Recent Rural Stories ↔ Urban Modern Era
 
**Positive (Recent Rural Stories):** Post-2015 Narrative, Rural Story, Village Story  
**Negative (Urban Modern Era):** Late 20th/Early 21st, Metropolitan Story, Avarice
 
---
 
## Dimension Restrictions
 
Not all axes on both sides are usable as independent themes.
 
### Restriction Type 1 — Weak Negative Side (e.g., Dimension 2)
 
- Feature correlation measures how strongly a trait defines the dimension
- Negative side only reaches about −0.27 and contains unrelated features
- Doesn't represent a specific theme — just represents "films without heroic adventure"
- **Psychological Unease shows the absence of Heroic Adventure, not a standalone theme**
- → **Restrict the negative side; use only Heroic Adventure**
 
### Restriction Type 2 — Redundant Axis (e.g., Dimension 9 vs. 10)
 
- **Dimension 9:** Sci-Fi & Future Technology ↔ European Historical Biopics
  - Used side: Sci-Fi Adventure (+0.446), Futuristic Thriller (+0.413), Science Thriller (+0.385)
  - Restricted side: Set in Europe (-0.274), Pre-Modern Era (-0.272), Historical Biopic (-0.260)
- **Dimension 10:** Old-World Mystery & Intellectual Intrigue ↔ Raw Romantic Drama
  - Strong positive: Set in Europe (+0.314), A Whodunnit (+0.310), Genius Protagonist (+0.259)
  - The "European historical" theme is already captured more clearly by Dimension 10
- → **Keep the strong axis (Old-World Mystery), remove the redundant one from Dim 9**
 
---
 
## Rail Construction
 
Rails connect movies and shows through simple themes or shared ideas.
 
**Goal:** Build rails that match how viewers feel or what they're in the mood for.
 
**Key capability:** Allow companies to create custom rails from desired features/themes.
 
---
 
## The Rails
 
### Rail 1: Easygoing Adventure
 
> Light, energetic stories built around fun spectacle, humor, and fast-moving adventures. These films prioritize entertainment and playful action over heavy drama, making them easy to watch and broadly enjoyable.
 
| Dimension Side | Category | Example Films |
|---|---|---|
| Negative — Dim 1 | Warmth & Uplift | Home Alone 3, Ghostbusters, Paul Blart: Mall Cop |
| **Rail Core** | **Easygoing Adventure** | **Space Jam, Despicable Me 3, Jumanji: Welcome to the Jungle, Ghostbusters II, Cars 2** |
| Negative — Dim 3 | Kinetic Plot Drive | Back to the Future Part II, Thor: The Dark World, The Fast and the Furious |
 
---
 
### Rail 2: Romance in Epic Worlds
 
> Stories where emotional relationships unfold within dramatic or larger-than-life settings. These films balance romance with sweeping stakes, placing personal connections at the center of extraordinary situations.
 
| Dimension Side | Category | Example Films |
|---|---|---|
| Negative — Dim 4 | Super Natural Horror | Bird Box, It, A Quiet Place |
| **Rail Core** | **Romance in Epic Worlds** | **Beauty and the Beast, Cinderella, Maleficent, The Twilight Saga: Breaking Dawn – Part 1, Gravity** |
| Positive — Dim 8 | Romantic Drama & Female-Led Stories | Dr. Strangelove or, Toy Story 4, Vice |
 
---
 
### Rail 3: Pressure Building
 
> Stories where tension steadily mounts as characters face escalating stakes and increasingly difficult choices. These films keep viewers engaged by slowly intensifying the situation until the characters are forced to confront the consequences.
 
| Dimension Side | Category | Example Films |
|---|---|---|
| Positive — Dim 5 | Creative Fantasy Stories | Dracula, Alice in Wonderland, 2001: A Space Odyssey |
| **Rail Core** | **Pressure Building** | **The Avengers, Alien vs. Predator, Kong: Skull Island, Star Trek: First Contact, Indiana Jones and the Temple of Doom** |
| Negative — Dim 3 | Kinetic Plot Drive | Back to the Future Part II, Thor: The Dark World, The Fast and the Furious |
 
---
 
### Rail 4: Losing Control
 
> Stories where emotional relationships unfold within dramatic or larger-than-life settings. These films balance romance with sweeping stakes, placing personal connections at the center of extraordinary situations.
 
| Dimension Side | Category | Example Films |
|---|---|---|
| Positive — Dim 7 | American Technological Thriller | Oppenheimer, Apollo 13, Terminator 2: Judgment Day |
| **Rail Core** | **Losing Control** | **Interstellar, The Martian, Planet of the Apes, Star Trek, Jurassic Park** |
| Positive — Dim 9 | Science Fiction & Future Technology | Blade Runner, Ender's Game, Ghost in the Shell |
| Positive — Dim 10 | Old-World Mystery & Intellectual Intrigue | Enola Holmes 2, Dial M for Murder, The Imitation Game |
 
---
 
### Rail 5: Dark Tension
 
> Stories driven by suspicion, danger, and moral ambiguity. These films build a constant sense of unease as characters navigate high-stakes situations where every decision carries serious consequences.
 
| Dimension Side | Category | Example Films |
|---|---|---|
| Positive — Dim 1 | Dark Psychological Tension | Psycho, Saw III, The Dark Knight |
| Positive — Dim 20 | Recent Rural & Village Stories | Elf, Hotel Transylvania, The Smurfs |
| **Rail Core** | **Dark Tension** | **The Silence of the Lambs, Get Out, Us, Strangers on a Train, Watchmen** |
| Positive — Dim 6 | Surprise-Driven & Twisty Storytelling | Knives Out, Vertigo, Coco |
 
---
 
## Technical Summary
 
| Component | Choice | Reason |
|---|---|---|
| Distance metric | Weighted Manhattan (L1) + IDF | Handles ordinal data, explainable, suppresses universal traits |
| Dimensionality reduction | PCoA | Accepts custom distance metric, produces bipolar interpretable axes |
| Axis interpretation | Spearman correlation | Correct for ordinal 0–3 trait scale |
| Dimensions retained | 20 | Marginal gain drops below 0.77% per dim at Dim 21+ |
| Films | 8,000 | — |
| Trait features | 248 | — |
 
---
 
*Q1 Analysis | 2026*
 
---
 
## Rail Overlap & Content Placement
 
Rails represent viewer moods, not fixed genres. A single film can score highly on multiple dimensions (tone, story type, setting simultaneously), which is a feature, not a bug.
 
**Why this matters for streaming platforms:**
- Enables multiple discovery paths for the same title
- Reflects how viewers actually browse (by feeling, not by label)
- Avoids forcing films into one rigid category
 
**Example:** *The Dark Knight* → Psychological Thriller + Action + Moral Drama. It surfaces in multiple rails, reaching viewers regardless of what mood brought them to the app.
 
---
 
## Adding a New Title to the Rail
 
New content can be placed into rails without rerunning the full PCoA. The pipeline for a new film is:
 
1. **Trait Scoring** — The new film is scored on all 248 traits (0–3 scale) by the editorial/tagging team, using the same process as the existing 8,000 films.
2. **IDF Weighting** — Apply the saved weight vector (`weights_new.npy`). No recomputation needed; weights are fixed to the existing library.
3. **Distance Calculation** — Compute IDF-weighted Manhattan distance from the new film to all landmark points.
4. **Nyström Projection** — Use the saved eigenvectors and eigenvalues to project the new film into the existing 20D coordinate space without re-running the full PCoA.
5. **Rail Placement** — Check which rails the new film's coordinates qualify for: 1D (top/bottom 1%), 2D (90th percentile on both axes), 3D (75th percentile on three axes).
 
### Nyström Approximation (Technical Detail)
 
```
coords(x) = Λ^(-½) · Uᵀ · b(x)
```
 
Where `b(x)` is the vector of distances from the new film to all landmark films. Landmark films are chosen by k-means, which minimises approximation error. **No retraining required.**
 
### Update Cadence
 
| Task | Details |
|---|---|
| New title placement | New Film → trait scoring → Nyström projection → rail placement |
| Full weight refresh | Monthly re-run; ~5–10 minutes on standard hardware for 8,000 films |
| Reproducibility | Pipeline is fully deterministic — reproducible by any engineer with the code and trait data |
 
---
 
## Strengths, Trade-offs, and Limitations
 
> The system favors interpretability and stability, but sacrifices some fine-grained similarity structure.
 
### Strengths
- Rails show clear thematic cohesion
- Deterministic system (same input → same output)
- Allows multi-rail membership
- Interpretable axes (unlike UMAP)
 
### Weaknesses / Trade-offs
- Only 47.4% of variance captured by the 20 dimensions
- Rails use rank-based selection (top 50) rather than score thresholds
- Built using editorial traits only, not viewer behavior
- IDF weights depend on the current movie library
 
---
 
## Appendix
 
### Why Stop at 20 Dimensions? (Not 30 or 40?)
 
| Reason | Detail |
|---|---|
| **01** | 30 dimensions reach 53.5%; 40 reach 57.9% |
| **02** | Dimensions 21+ have max Spearman correlations below 0.33 — too diffused to name as coherent viewer moods |
| **03** | It would generate rails that cannot be labelled or defended |
| **04** | Interpretability was chosen over raw variance numbers |
 
### Why Not Use PCA? (It Would Give Higher Variance Explained)
 
PCA on raw features with 20 dimensions gives 57.4%, compared to 47.4% for PCoA. However:
- PCA implicitly assumes Euclidean distance and cannot accept IDF-weighted metrics
- IDF weighting is the intellectual contribution of this pipeline
- A 10 percentage point variance gain is not worth losing the principled, frequency-grounded distance metric
 
### Why Manhattan Distance and Not Euclidean?
 
- Euclidean squares differences before summing; on a 0–3 ordinal scale, a gap of 3 should count 3× a gap of 1, not 9×
- Manhattan preserves the linear ordinal relationship
- Euclidean distance is more sensitive to single-feature outliers
 
### Dimensionality Reduction Comparison
 
| Method | Properties |
|---|---|
| **PCoA** | Preserves distance between points · Allows non-Euclidean (ordinal) relationships · Maximizes similarity |
| **PCA** | Best line of fit through data · Assumes continuous data · Maximizes variance explained |
| **Factor Analysis** | Explains correlations with latent factors · Assumes continuous, normally distributed data |
 
### Why Are 7,329 of 8,000 Eigenvalues Negative?
 
**What it means:** The distance metric captures real structure. 671 positive eigenvalues represent the dimensions along which films genuinely vary. The 7,329 negative eigenvalues represent geometric distortion introduced by embedding non-Euclidean distances into flat coordinate space.
 
**What we do about it:** Standard practice in PCoA is to retain only the positive eigenvalues for coordinate computation. We apply `sqrt(|λ|)` scaling only for the positive subset. The negative eigenvalues are discarded and do not contribute to the 20D embedding.
 
**Why it doesn't invalidate the results:** The 671 positive eigenvalues account for all usable variance. Our 20 retained dimensions are the 20 largest positive eigenvalues — the strongest, most reliable signal in the distance structure. The negative eigenvalue mass (31.4% of absolute eigenvalue mass) is the price of using a principled ordinal distance metric rather than forcing Euclidean assumptions onto ordinal data.
 
### How Did You Validate the Axes Are Real and Not Just Noise?
 
Validation used Spearman correlation across all 8,000 films:
- Dimension 1 hits r = 0.805 on `suspenseful_atmosphere`
- Dimension 3 hits r = −0.634 on `character_driven`
 
Extreme positive end of Dimension 1: *Oldboy*, *A Clockwork Orange*, *Psycho*  
Extreme negative end of Dimension 1: *Tangled*, *Shrek*, *The Wizard of Oz*
 
These film examples confirm the axes are semantically coherent and not noise.
 
---
 
### Dimension Metrics (Full Table)
 
| Dim | Eigenvalue | Var. Explained | Cumulative | Max \|r\| | Axis Name |
|---|---|---|---|---|---|
| Dim 1 | 130.41 | 10.27% | 10.27% | 0.805 | Dread |
| Dim 2 | 74.30 | 5.85% | 16.12% | 0.724 | Hero's Journey |
| Dim 3 | 67.28 | 5.30% | 21.42% | 0.634 | Soul Depth |
| Dim 4 | 38.58 | 3.04% | 24.46% | 0.467 | Sharp Wit |
| Dim 5 | 35.81 | 2.82% | 27.27% | 0.431 | Auteur |
| Dim 6 | 34.28 | 2.70% | 29.97% | 0.437 | Twist |
| Dim 7 | 25.12 | 1.98% | 31.95% | 0.492 | American Sci-Fi |
| Dim 8 | 23.66 | 1.86% | 33.82% | 0.505 | Romance |
| Dim 9 | 20.73 | 1.63% | 35.45% | 0.449 | Future Tech |
| Dim 10 | 18.49 | 1.46% | 36.90% | 0.315 | European Detective |
| Dim 11 | 17.49 | 1.38% | 38.28% | 0.285 | Medieval Betrayal |
| Dim 12 | 16.52 | 1.30% | 39.58% | 0.375 | Father Figure |
| Dim 13 | 15.38 | 1.21% | 40.79% | 0.398 | Parental Warmth |
| Dim 14 | 14.51 | 1.14% | 41.94% | 0.419 | Redemption |
| Dim 15 | 13.14 | 1.03% | 42.97% | 0.343 | American Spotlight |
| Dim 16 | 12.64 | 1.00% | 43.97% | 0.246 | Classic Era |
| Dim 17 | 11.86 | 0.93% | 44.90% | 0.357 | European Arts |
| Dim 18 | 10.97 | 0.86% | 45.76% | 0.364 | Moral Corruption |
| Dim 19 | 10.76 | 0.85% | 46.61% | 0.348 | Perseverance |
| Dim 20 | 9.84 | 0.77% | 47.39% | 0.547 | Small-Town Modernity |
 
---
 
### Top 3 Feature Analysis (All 20 Dimensions)
 
| Dim | Positive Axis | Top 3 Positive Features | Negative Axis | Top 3 Negative Features |
|---|---|---|---|---|
| 1 | Dark Psychological Tension | Suspenseful Atmosphere (+0.807), Somber Atmosphere (+0.766), Psychological Suspense (+0.736) | Warmth & Uplift | Happy Ending (−0.680), Positive Uplifting Tone (−0.675), Feel-Good Narrative (−0.652) |
| 2 | Heroic Adventure & Action | The Hero's Journey (+0.713), Brave Protagonist (+0.712), Formidable Challenge (+0.587) | Psychological Unease | Psychological Horror (−0.273), Romantic Drama (−0.203), Unstable Protagonist (−0.199) |
| 3 | Introspective Character Study | Character-Driven (+0.628), Poignant Mood (+0.611), Profound & Reflective (+0.557) | Kinetic Plot Drive | Fast-Paced (−0.503), Plot-Centric (−0.463), Energetic Tone (−0.451) |
| 4 | Clever Crime Thriller | Dry Humor Dialogue (+0.387), Criminal Underbelly (+0.334), Elegant Dialogue (+0.293) | Supernatural Horror | Somber & Eerie Tone (−0.468), Eerie Score (−0.444), Intended Fright Response (−0.434) |
| 5 | Creative Fantasy Stories | Narrative Originality (+0.395), Unconventional Directing (+0.368), Alternative Reality (+0.360) | Devoted Family Stories | Family-Devoted Protagonist (−0.439), Parent-Child Narrative (−0.415), About a Family (−0.413) |
| 6 | Surprise-Driven Twists | Dialog-Driven (+0.442), Plot Twists (+0.423), Reversal of Fortune (+0.422) | Historical War Epic | History-in-the-Making (−0.342), Wartime Tale (−0.339), Set in Asia (−0.297) |
| 7 | American Technological Thriller | Set in America (+0.428), Futuristic Thriller (+0.364), Science Thriller (+0.353) | Asian Cinema | Asian-Driven Story (−0.492), Set in Asia (−0.457), Set in East Asia (−0.432) |
| 8 | Romantic Drama & Female Stories | Romantic Drama (+0.505), Female-Centric Narrative (+0.477), Heterosexual Relationship (+0.477) | Laddish Comedy & Male Bonds | Nonsensical Comedy (−0.389), Male Bonding (−0.337), Dark Wit (−0.320) |
| 9 | Science Fiction & Future Tech | Sci-Fi Adventure (+0.446), Futuristic Thriller (+0.413), Science Thriller (+0.385) | European Historical Period | Set in Europe (−0.274), Pre-Modern Era (−0.272), Historical Biopic (−0.260) |
| 10 | Old-World Mystery & Intrigue | Set in Europe (+0.314), Whodunnit (+0.310), Genius Protagonist (+0.259) | Raw Romantic Drama | Raw Dialogue (−0.314), Courtship (−0.292), Heterosexual Relationship (−0.287) |
| 11 | Fantasy Worlds & Treachery | Unraveling of Trust (+0.285), High Medieval Fantasy (+0.282), Set in Europe (+0.276) | Music-Driven Sound Design | Predominant Sound Effects (−0.273), Music-Led Storytelling (−0.273), Fright Response (−0.256) |
| 12 | Paternal Drama & Family Bonds | Father's Arc (+0.381), Parent-Child Narrative (+0.336), About a Family (+0.294) | Female Underdog Stories | Relatable Protagonist (−0.315), Underdog Wins (−0.310), Female-Centric Narrative (−0.288) |
| 13 | Family Comedy & Devoted Parents | Mother's Arc (+0.293), Humor-Based Story (+0.282), Family-Devoted Protagonist (+0.277) | Coming-of-Age Youth | Coming of Age (−0.392), Childhood Bonds (−0.346), Coming-of-Age Tale (−0.339) |
| 14 | Inner Darkness & Redemption | Confronting One's Shadow (+0.421), Moral Redemption (+0.291), Withdrawn Protagonist (+0.281) | Female Coming-of-Age | Female-Centric Narrative (−0.223), Coming-of-Age Tale (−0.211), Courtship (−0.196) |
| 15 | American Arts & Entertainment | Set in America (+0.332), Fine Arts (+0.257), Live Performance Arts (+0.243) | European Grit & Mortality | Set in Europe (−0.338), Repeated Setbacks (−0.317), Grappling with Mortality (−0.291) |
| 16 | Black-and-White Timelessness | Black & White (+0.243), All-Ages (+0.223), Police Thriller (+0.216) | Contemporary Artist Drama | Artist's Story (−0.221), Fine Arts (−0.220), Late 20th Narrative (−0.210) |
| 17 | European High Arts & Feminism | Live Performance Arts (+0.290), Fine Arts (+0.273), Focus on Feminism (+0.270) | American Supernatural Fantasy | Set in America (−0.370), Supernatural Phenomena (−0.256), Enchanted Creatures (−0.210) |
| 18 | Temptation & Moral Corruption | Moral Temptation (+0.291), Psychological Manipulation (+0.272), Avarice (+0.197) | Contemporary Urban Life | Late 20th Narrative (−0.370), Set in Europe (−0.271), Metropolitan Story (−0.233) |
| 19 | Struggle & Overcoming Adversity | Repeated Setbacks (+0.354), Live Performance Arts (+0.257), Entertainment Industry (+0.236) | Contemporary Intellectual Drama | Late 20th Narrative (−0.300), Genius Protagonist (−0.207), Character Driven (−0.188) |
| 20 | Recent Rural & Village Stories | Post-2015 Narrative (+0.298), Rural Story (+0.258), Village Story (+0.231) | Late 20th Century Urban Era | Late 20th Narrative (−0.547), Metropolitan Story (−0.236), Avarice (−0.184) |
 
---
 
### All Dimension Restrictions
 
| Dimension | Axis Removed | Axis Titles | Strength | Reason for Restriction |
|---|---|---|---|---|
| Dim 2 | Negative axis | Heroic Adventure & Action ↔ Psychological Unease | −0.27 vs +0.71 | Negative side mixes horror, romance, and general unease with no shared theme. Positive side forms a very strong and coherent heroic adventure signal. |
| Dim 9 | Negative axis | Science Fiction & Future Technology ↔ European Historical Period | −0.27 vs +0.45 | Negative side blends European history, biopics, and period drama — different forms of "not sci-fi," so the axis lacks a clear identity. |
| Dim 10 | Negative axis | Old-World Mystery & Intellectual Intrigue ↔ Raw Romantic Drama | ±0.31 | Negative side combines raw dialogue, romance, and explicit violence — three unrelated genres that simply contrast with European mysteries but do not form a coherent theme. |
| Dim 12 | Negative axis | Paternal Drama & Family Bonds ↔ Female Underdog Stories | −0.31 | Negative side merges underdog narratives, feminist stories, and prison films — no narrative core beyond not being father-child drama. |
| Dim 14 | Negative axis | Inner Darkness & Moral Redemption ↔ Female Coming-of-Age | −0.22 vs +0.42 | Negative side spreads across coming-of-age, courtship, and sibling narratives. Positive side forms a strong and coherent redemption arc theme, so only that side is retained. |
| Dim 19 | Negative axis | Struggle & Overcoming Adversity ↔ Contemporary Intellectual Drama | −0.30 | Negative side mostly reflects time-period effects and overlaps heavily with Dim 3's character-driven drama, making it redundant. |
 
---
