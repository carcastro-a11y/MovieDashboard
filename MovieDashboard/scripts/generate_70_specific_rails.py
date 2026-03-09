"""
generate_70_specific_rails.py
==============================
Generates 70 feeling-based 2D rails from PCoA coordinates.

IDF WEIGHTS — apply this in PCOA_Step_1.py before running PCoA:
─────────────────────────────────────────────────────────────────
    N = trait_matrix.shape[0]
    df_counts = np.sum(trait_matrix > 0, axis=0)
    base_weights = np.log((N + 1) / (df_counts + 1)) + 1
    weights = base_weights ** 0.85          # ← exponent=0.85
─────────────────────────────────────────────────────────────────
"""
import os
import itertools
import numpy as np
import pandas as pd


POSITIVE_ONLY_DIMS = {2, 7, 9, 14, 18, 20}

DIMENSION_LABELS = {
    1: ("The Dread Axis", "Dark Psychological Tension", "Warmth & Uplift"),
    2: ("The Hero's Journey Axis", "Heroic Adventure & Action", "Psychological Unease"),
    3: ("The Soul Depth Axis", "Introspective Character Study", "Kinetic Plot Drive"),
    4: ("The Sharp Wit Axis", "Clever Crime & Wit", "Supernatural Horror"),
    5: ("The Auteur Axis", "Visionary Originality & Fantasy", "Devoted Family Stories"),
    6: ("The Twist Axis", "Surprise-Driven & Twisty Storytelling", "Historical War Epic"),
    7: ("The American Sci-Fi Axis", "American Technological Thriller", "Asian Cinema"),
    8: ("The Romance Axis", "Romantic Drama & Female-Led Stories", "Laddish Comedy & Male Bonds"),
    9: ("The Future Tech Axis", "Science Fiction & Future Technology", "European Historical Period"),
    10: ("The European Detective Axis", "Old-World Mystery & Intellectual Intrigue", "Raw Romantic Drama"),
    11: ("The Medieval Betrayal Axis", "Fantasy Worlds & Moral Treachery", "Music-Driven Sound Design"),
    12: ("The Father Figure Axis", "Paternal Drama & Family Bonds", "Female Underdog Stories"),
    13: ("The Parental Warmth Axis", "Family Comedy & Devoted Parents", "Coming-of-Age Youth"),
    14: ("The Redemption Axis", "Inner Darkness & Moral Redemption", "Female Coming-of-Age"),
    15: ("The American Spotlight Axis", "American Arts & Entertainment Culture", "British/European Grit & Mortality"),
    16: ("The Classic Era Axis", "Black-and-White Timelessness", "Contemporary Artist Drama"),
    17: ("The European Arts Axis", "European High Arts & Feminist Narrative", "American Supernatural Fantasy"),
    18: ("The Moral Corruption Axis", "Temptation, Manipulation & Greed", "Contemporary Urban Life"),
    19: ("The Perseverance Axis", "Struggle, Setbacks & the Will to Overcome", "Contemporary Intellectual Drama"),
    20: ("The Small-Town Modernity Axis", "Recent Rural & Village Stories", "Late 20th Century Urban Era"),
}


def get_allowed_directions(dim_num):
    if dim_num in POSITIVE_ONLY_DIMS:
        return ["above"]
    return ["above", "below"]


def default_threshold(direction):
    return "very_high" if direction == "above" else "very_low"


def criterion_description(dim_num, threshold_type, direction, threshold_value):
    axis_name, plus_label, minus_label = DIMENSION_LABELS[dim_num]
    side = plus_label if direction == "above" else minus_label
    arrow = "↑" if direction == "above" else "↓"
    return (
        f"Dim{dim_num} ({axis_name}): {side} | "
        f"{threshold_type.replace('_', ' ').upper()} {arrow} ({direction} {threshold_value:.3f})"
    )


def compute_percentiles(df):
    dim_cols = [f"PCoA_Dim{i}" for i in range(1, 21)]
    percentiles = {}
    for dim_col in dim_cols:
        percentiles[dim_col] = {
            "very_low": df[dim_col].quantile(0.10),
            "low": df[dim_col].quantile(0.25),
            "high": df[dim_col].quantile(0.75),
            "very_high": df[dim_col].quantile(0.90),
        }
    return percentiles


def build_mask(df, criteria, percentiles):
    mask = pd.Series(True, index=df.index)
    for dim_num, threshold_type, direction in criteria:
        dim_col = f"PCoA_Dim{dim_num}"
        threshold = percentiles[dim_col][threshold_type]
        if direction == "above":
            mask &= df[dim_col] >= threshold
        else:
            mask &= df[dim_col] <= threshold
    return mask


def compute_weighted_scores(rows, criteria, percentiles, dim_weight_map):
    scored = rows.copy()

    total_score = np.zeros(len(scored), dtype=float)

    for dim_num, threshold_type, direction in criteria:
        dim_col = f"PCoA_Dim{dim_num}"
        threshold = percentiles[dim_col][threshold_type]
        weight = dim_weight_map[dim_num]

        if direction == "above":
            margin = np.maximum(0.0, scored[dim_col].values - threshold)
        else:
            margin = np.maximum(0.0, threshold - scored[dim_col].values)

        contrib_col = f"Dim{dim_num}_weighted_contrib"
        scored[contrib_col] = margin * weight
        total_score += scored[contrib_col].values

    scored["total_weighted_match_score"] = total_score
    return scored


def jaccard(a, b):
    if not a and not b:
        return 1.0
    union = len(a | b)
    if union == 0:
        return 0.0
    return len(a & b) / union


def generate_70_rails(
    metadata_file="Cleaned_data.csv",
    coords_file="pcoa_coordinates_20D.csv",
    eigen_file="pcoa_eigen_spectrum.csv",
    output_file="FEELING_BASED_RAILS_70x50.txt",
    summary_file="FEELING_BASED_RAILS_70x50_SUMMARY.csv",
    target_rails=70,
    target_movies=50,
):
    if not all(os.path.exists(p) for p in [metadata_file, coords_file, eigen_file]):
        print("❌ Missing required inputs. Need Cleaned_data.csv, pcoa_coordinates_20D.csv, pcoa_eigen_spectrum.csv")
        return

    print("🎬 Generating 70 new rails from updated PCoA model...")

    df_movies = pd.read_csv(metadata_file)
    df_coords = pd.read_csv(coords_file)
    df_eigs = pd.read_csv(eigen_file)

    df = pd.merge(df_movies[["imdb_id", "movie_name"]], df_coords, on="imdb_id", how="inner")
    percentiles = compute_percentiles(df)

    evr_map = {}
    for dim in range(1, 21):
        match = df_eigs[df_eigs["dimension"] == dim]
        evr_map[dim] = float(match["explained_variance_ratio"].iloc[0]) if len(match) else 1.0

    # Candidate criteria built from all 2D combinations + allowed direction combos.
    candidates = []
    dim_numbers = list(range(1, 21))

    for d1, d2 in itertools.combinations(dim_numbers, 2):
        dirs1 = get_allowed_directions(d1)
        dirs2 = get_allowed_directions(d2)

        for dir1 in dirs1:
            for dir2 in dirs2:
                criteria = [
                    (d1, default_threshold(dir1), dir1),
                    (d2, default_threshold(dir2), dir2),
                ]

                mask = build_mask(df, criteria, percentiles)
                raw = df[mask]
                raw_count = len(raw)

                if raw_count < target_movies:
                    continue

                # Rail-level dimension weights from explained variance, normalized within rail.
                denom = evr_map[d1] + evr_map[d2]
                if denom <= 0:
                    dim_weight_map = {d1: 0.5, d2: 0.5}
                else:
                    dim_weight_map = {
                        d1: evr_map[d1] / denom,
                        d2: evr_map[d2] / denom,
                    }

                scored = compute_weighted_scores(raw, criteria, percentiles, dim_weight_map)
                scored = scored.sort_values("total_weighted_match_score", ascending=False)
                trimmed = scored.head(target_movies).copy()

                ids = set(trimmed["imdb_id"].tolist())

                candidates.append(
                    {
                        "criteria": criteria,
                        "raw_count": raw_count,
                        "trimmed": trimmed,
                        "ids": ids,
                        "dim_weight_map": dim_weight_map,
                        "score": abs(raw_count - target_movies),
                        "name": f"Dim{d1}_{'PLUS' if dir1=='above' else 'MINUS'}__Dim{d2}_{'PLUS' if dir2=='above' else 'MINUS'}",
                    }
                )

    if not candidates:
        print("❌ No candidate rails met minimum size.")
        return

    # Prefer natural count close to 50, then diversify by low Jaccard overlap.
    candidates = sorted(candidates, key=lambda x: (x["score"], x["raw_count"]))

    selected = []
    selected_sets = []

    for cand in candidates:
        if len(selected) >= target_rails:
            break

        overlap_too_high = False
        for s in selected_sets:
            if jaccard(cand["ids"], s) > 0.80:
                overlap_too_high = True
                break

        if overlap_too_high:
            continue

        selected.append(cand)
        selected_sets.append(cand["ids"])

    # If diversity filtering kept fewer than target, backfill by best remaining.
    if len(selected) < target_rails:
        already = {id(c) for c in selected}
        for cand in candidates:
            if len(selected) >= target_rails:
                break
            if id(cand) in already:
                continue
            selected.append(cand)

    selected = selected[:target_rails]

    with open(output_file, "w", encoding="utf-8") as f:
        f.write("🎬 70 NEW FEELING-BASED RAILS (UPDATED PCoA MODEL)\n")
        f.write("=" * 130 + "\n")
        f.write("Target: ~50 movies per rail\n")
        f.write("Method: 2D criteria rails, top-ranked trim by weighted match score\n")
        f.write("Per-movie output includes criterion dimension values + weighted contributions\n")
        f.write("=" * 130 + "\n\n")

        for idx, rail in enumerate(selected, 1):
            criteria = rail["criteria"]
            trimmed = rail["trimmed"]
            dim_weight_map = rail["dim_weight_map"]

            f.write("\n" + "=" * 130 + "\n")
            f.write(f"RAIL {idx:02d}: {rail['name']}\n")
            f.write("=" * 130 + "\n")
            f.write(f"Raw candidate size: {rail['raw_count']}\n")
            f.write(f"Final rail size: {len(trimmed)}\n")

            f.write("\n📊 RAIL CRITERIA:\n")
            for dim_num, threshold_type, direction in criteria:
                threshold_val = percentiles[f"PCoA_Dim{dim_num}"][threshold_type]
                f.write(f"   • {criterion_description(dim_num, threshold_type, direction, threshold_val)}\n")

            f.write("\n⚖️ DIMENSION WEIGHTS USED FOR MATCH SCORING:\n")
            for dim_num, _, _ in criteria:
                f.write(f"   • Dim{dim_num}: {dim_weight_map[dim_num]:.4f}\n")

            dim_nums = [d for d, _, _ in criteria]

            header_cols = ["Movie Name"]
            for dim_num in dim_nums:
                header_cols.append(f"Dim{dim_num}_value")
                header_cols.append(f"Dim{dim_num}_weighted_contrib")
            header_cols.append("Total_weighted_match")

            f.write("\n📽️ MOVIES (TOP 50 BY WEIGHTED MATCH):\n")
            f.write("-" * 130 + "\n")

            header = f"{header_cols[0]:<44}"
            for col in header_cols[1:]:
                header += f" | {col:>16}"
            f.write(header + "\n")
            f.write("-" * 130 + "\n")

            for _, row in trimmed.iterrows():
                line = f"{str(row['movie_name'])[:44]:<44}"
                for dim_num in dim_nums:
                    line += f" | {row[f'PCoA_Dim{dim_num}']:>16.4f}"
                    line += f" | {row[f'Dim{dim_num}_weighted_contrib']:>16.4f}"
                line += f" | {row['total_weighted_match_score']:>16.4f}"
                f.write(line + "\n")

            f.write("\n")

    summary_rows = []
    for idx, rail in enumerate(selected, 1):
        crit = rail["criteria"]
        summary_rows.append(
            {
                "rail_number": idx,
                "rail_name": rail["name"],
                "raw_candidate_size": rail["raw_count"],
                "final_size": len(rail["trimmed"]),
                "criterion_1": f"Dim{crit[0][0]} {crit[0][2]} {crit[0][1]}",
                "criterion_2": f"Dim{crit[1][0]} {crit[1][2]} {crit[1][1]}",
                "dim1_weight": rail["dim_weight_map"][crit[0][0]],
                "dim2_weight": rail["dim_weight_map"][crit[1][0]],
            }
        )

    pd.DataFrame(summary_rows).to_csv(summary_file, index=False)

    print("✅ Completed rail generation")
    print(f"📄 Rails file: {output_file}")
    print(f"📄 Summary file: {summary_file}")
    print(f"📊 Rails generated: {len(selected)}")


if __name__ == "__main__":
    generate_70_rails(
        metadata_file="Cleaned_data.csv",
        coords_file="pcoa_coordinates_20D.csv",
        eigen_file="pcoa_eigen_spectrum.csv",
        output_file="FEELING_BASED_RAILS_70x50.txt",
        summary_file="FEELING_BASED_RAILS_70x50_SUMMARY.csv",
        target_rails=70,
        target_movies=50,
    )
