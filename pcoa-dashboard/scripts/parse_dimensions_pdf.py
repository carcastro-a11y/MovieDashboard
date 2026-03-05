"""
parse_dimensions_pdf.py
-----------------------
One-time script to parse "Dimension Breakthrough (1).pdf" and generate
public/dimensions_labels.json

Usage:
    pip install pypdf2
    python scripts/parse_dimensions_pdf.py

Outputs: public/dimensions_labels.json
"""

import json
import re
import os

# ── Manual transcription from PDF (fast, no runtime PDF parsing) ──────────────
# This is the authoritative source. Update here if the PDF changes.
DIMENSIONS_RAW = [
    ("PCoA_Dim1",
     "Feel-Good & Uplifting Drama (happy endings, positive emotional tone, hopeful narratives)",
     "Suspense & Psychological Tension (suspenseful atmosphere, darker mood, emotional unease)"),
    ("PCoA_Dim2",
     "Romantic & Psychological Relationship Drama (romantic turmoil, unstable protagonists, dramedy)",
     "High-Energy Heroic Action & Spectacle (hero's journey, combat, stunts, fast pacing, VFX)"),
    ("PCoA_Dim3",
     "Fast-Paced Plot-Driven Action (chases, relentless pacing, energetic tone)",
     "Reflective Character-Driven Drama (life story, self-discovery, cultural dialogue)"),
    ("PCoA_Dim4",
     "Supernatural Horror & Fright Tone (eerie score, psychological horror, supernatural fear)",
     "Cerebral Political & Crime Intrigue (spy thrillers, criminal underworld, dialogue-driven tension)"),
    ("PCoA_Dim5",
     "Family-Centered Domestic Drama (parent-child arcs, devoted protagonists)",
     "Auteur-Driven Fantasy & Visual Innovation (fantastical worlds, stylistic direction, originality)"),
    ("PCoA_Dim6",
     "Historical & Wartime Narratives (Asia) (historical references, wartime settings)",
     "Twisty Dialogue-Driven Crime & Humor (plot twists, deception, dry humor)"),
    ("PCoA_Dim7",
     "American Sci-Fi & Futuristic Thrillers (technology, futuristic settings)",
     "Asian Crime & Cultural Thrillers (Asian settings, crime, cultural tension)"),
    ("PCoA_Dim8",
     "Edgy Satirical Male-Bonding Comedy (raw humor, satire, male friendship)",
     "Romantic Relationship Drama (courtship, romantic triangles, emotional tension)"),
    ("PCoA_Dim9",
     "Historical European Biographical Drama (pre-modern era, European settings)",
     "Futuristic Tech & Sci-Fi Adventure (future settings, extraterrestrials, technology)"),
    ("PCoA_Dim10",
     "Raw Realism (unfiltered dialogue, grounded tone)",
     "Mystery & Puzzle Narrative (whodunnits, deception, investigation)"),
    ("PCoA_Dim11",
     "Sensory Spectacle (heavy sound design, technical immersion)",
     "Trust & Betrayal (deception, fractured alliances)"),
    ("PCoA_Dim12",
     "Relatable Everyman Protagonist (grounded identity, everyday struggles)",
     "Fatherhood Arc (paternal responsibility, generational bonds)"),
    ("PCoA_Dim13",
     "Coming-of-Age Story (youth growth, identity formation)",
     "Comedy-Driven Narrative (humor-centered storytelling)"),
    ("PCoA_Dim14",
     "Romantic Courtship (relationship development)",
     "Inner Psychological Conflict (moral struggle, confronting inner demons)"),
    ("PCoA_Dim15",
     "Mortality & Existential Reflection (death, philosophy, life meaning)",
     "The Arts & Creative Life (artists, creativity, fine arts)"),
    ("PCoA_Dim16",
     "Police Thriller (crime investigation, law enforcement focus)",
     "European Setting & Cultural Tone (continental Europe, dry wit, satire)"),
    ("PCoA_Dim17",
     "European Fine Arts & Feminist Cinema",
     "American Supernatural Dialogue Drama (ghosts, supernatural, US setting)"),
    ("PCoA_Dim18",
     "European Urban Hardship & Chase Stories",
     "Moral Power Struggles & Psychological Conflict"),
    ("PCoA_Dim19",
     "Mid-Century Performance & Setback Drama (black & white era, stage performance)",
     "Modern Intellectual Character Studies (genius leads, philosophical exploration)"),
    ("PCoA_Dim20",
     "Rural & Contemporary Feminist Stories (village settings, female bonding)",
     "Urban Psychological Survival (NYC-Style) (temptation, adversity, metropolitan struggle)"),
]


def extract_keyword(label: str) -> str:
    """Extract 1-2 key words from an axis label for the short label."""
    # Strip parenthetical details
    label = re.sub(r'\(.*?\)', '', label).strip()
    # Take first 2 significant words
    words = [w for w in label.split() if len(w) > 3 and w not in ('with', 'and', 'the', 'from', 'that')]
    return ' '.join(words[:2]) if words else label.split()[0]


def make_short_label(dim_id: str, neg: str, pos: str) -> str:
    dim_num = dim_id.replace('PCoA_Dim', 'Dim')
    neg_kw = extract_keyword(neg)
    pos_kw = extract_keyword(pos)
    return f"{dim_num}: {neg_kw} vs {pos_kw}"


def main():
    output = []
    for dim_id, neg, pos in DIMENSIONS_RAW:
        output.append({
            "dim_id": dim_id,
            "negative_axis_label_long": neg,
            "positive_axis_label_long": pos,
            "short_label": make_short_label(dim_id, neg, pos),
        })

    out_path = os.path.join(os.path.dirname(__file__), '..', 'public', 'dimensions_labels.json')
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"✅ Generated {len(output)} dimensions → {out_path}")


if __name__ == '__main__':
    main()
