"""
Poisson Goal Model for Football Match Prediction

Uses team attack/defense strengths and league averages
to calculate expected goals, then applies Poisson distribution
to generate scoreline probabilities.
"""

import math
from typing import Dict, List, Tuple


def poisson_probability(lam: float, k: int) -> float:
    """Calculate P(X = k) for Poisson distribution with parameter lambda."""
    return (lam ** k * math.exp(-lam)) / math.factorial(k)


def calculate_strengths(
    team_stats: Dict,
    league_avg_home_goals: float,
    league_avg_away_goals: float,
    form_weight: float = 0.15,
    form_window: int = 5
) -> Dict:
    """
    Calculate attack and defense strength for a team.

    Returns dict with:
      - home_attack, home_defense (for when playing at home)
      - away_attack, away_defense (for when playing away)
      - form_factor (recent form adjustment)
    """
    home_games = team_stats.get("home_played", 1)
    away_games = team_stats.get("away_played", 1)

    # Season averages
    home_scored = team_stats.get("home_goals_scored", 0) / max(home_games, 1)
    home_conceded = team_stats.get("home_goals_conceded", 0) / max(home_games, 1)
    away_scored = team_stats.get("away_goals_scored", 0) / max(away_games, 1)
    away_conceded = team_stats.get("away_goals_conceded", 0) / max(away_games, 1)

    # Attack & defense strength relative to league average
    home_attack = home_scored / max(league_avg_home_goals, 0.1)
    home_defense = home_conceded / max(league_avg_away_goals, 0.1)
    away_attack = away_scored / max(league_avg_away_goals, 0.1)
    away_defense = away_conceded / max(league_avg_home_goals, 0.1)

    # Form adjustment based on recent results
    recent_form = team_stats.get("recent_form", [])
    if recent_form:
        # Points from last N matches (W=3, D=1, L=0)
        form_points = sum({"W": 3, "D": 1, "L": 0}.get(r, 0) for r in recent_form[-form_window:])
        max_points = form_window * 3
        form_ratio = form_points / max_points  # 0.0 to 1.0
        # Center around 0: -0.5 (terrible) to +0.5 (perfect)
        form_deviation = form_ratio - 0.5
        form_factor = 1.0 + (form_deviation * form_weight * 2)
    else:
        form_factor = 1.0

    return {
        "home_attack": home_attack,
        "home_defense": home_defense,
        "away_attack": away_attack,
        "away_defense": away_defense,
        "form_factor": form_factor,
    }


def predict_match(
    home_stats: Dict,
    away_stats: Dict,
    league_avg_home_goals: float,
    league_avg_away_goals: float,
    form_weight: float = 0.15,
    form_window: int = 5,
    max_goals: int = 7
) -> Dict:
    """
    Predict a match using the Poisson model.

    Returns comprehensive prediction including:
      - expected goals for each team
      - scoreline probabilities (matrix)
      - outcome probabilities (home/draw/away)
      - over/under probabilities
      - BTTS probability
    """
    home_strength = calculate_strengths(
        home_stats, league_avg_home_goals, league_avg_away_goals,
        form_weight, form_window
    )
    away_strength = calculate_strengths(
        away_stats, league_avg_home_goals, league_avg_away_goals,
        form_weight, form_window
    )

    # Expected goals
    home_xg = (
        home_strength["home_attack"]
        * away_strength["away_defense"]
        * league_avg_home_goals
        * home_strength["form_factor"]
    )
    away_xg = (
        away_strength["away_attack"]
        * home_strength["home_defense"]
        * league_avg_away_goals
        * away_strength["form_factor"]
    )

    # Clamp expected goals to reasonable range
    home_xg = max(0.2, min(home_xg, 5.0))
    away_xg = max(0.2, min(away_xg, 5.0))

    # Build scoreline probability matrix
    score_matrix = {}
    for h in range(max_goals + 1):
        for a in range(max_goals + 1):
            p = poisson_probability(home_xg, h) * poisson_probability(away_xg, a)
            score_matrix[(h, a)] = p

    # Outcome probabilities
    home_win_prob = sum(p for (h, a), p in score_matrix.items() if h > a)
    draw_prob = sum(p for (h, a), p in score_matrix.items() if h == a)
    away_win_prob = sum(p for (h, a), p in score_matrix.items() if h < a)

    # Normalize (small rounding errors from capping at max_goals)
    total = home_win_prob + draw_prob + away_win_prob
    home_win_prob /= total
    draw_prob /= total
    away_win_prob /= total

    # Over/Under probabilities
    total_goals_probs = {}
    for (h, a), p in score_matrix.items():
        total_g = h + a
        total_goals_probs[total_g] = total_goals_probs.get(total_g, 0) + p

    over_15 = sum(p for g, p in total_goals_probs.items() if g >= 2)
    over_25 = sum(p for g, p in total_goals_probs.items() if g >= 3)
    over_35 = sum(p for g, p in total_goals_probs.items() if g >= 4)

    # BTTS (Both Teams To Score)
    btts_yes = sum(p for (h, a), p in score_matrix.items() if h > 0 and a > 0)

    # Most likely scorelines
    sorted_scores = sorted(score_matrix.items(), key=lambda x: x[1], reverse=True)
    top_scores = [(f"{h}-{a}", round(p * 100, 1)) for (h, a), p in sorted_scores[:5]]

    return {
        "home_xg": round(home_xg, 2),
        "away_xg": round(away_xg, 2),
        "home_win": round(home_win_prob * 100, 1),
        "draw": round(draw_prob * 100, 1),
        "away_win": round(away_win_prob * 100, 1),
        "over_1_5": round(over_15 * 100, 1),
        "over_2_5": round(over_25 * 100, 1),
        "over_3_5": round(over_35 * 100, 1),
        "btts_yes": round(btts_yes * 100, 1),
        "btts_no": round((1 - btts_yes) * 100, 1),
        "top_scorelines": top_scores,
        "score_matrix": {
            f"{h}-{a}": round(p * 100, 2)
            for (h, a), p in sorted_scores[:20]
        },
        "home_form_factor": round(home_strength["form_factor"], 3),
        "away_form_factor": round(away_strength["form_factor"], 3),
    }


def fair_odds(probability_pct: float) -> float:
    """Convert a probability (%) to fair decimal odds."""
    if probability_pct <= 0:
        return 999.0
    return round(100 / probability_pct, 2)


if __name__ == "__main__":
    # Quick test with example data
    home = {
        "home_played": 12,
        "home_goals_scored": 28,
        "home_goals_conceded": 8,
        "away_played": 11,
        "away_goals_scored": 15,
        "away_goals_conceded": 12,
        "recent_form": ["W", "W", "D", "W", "W"],
    }
    away = {
        "home_played": 12,
        "home_goals_scored": 20,
        "home_goals_conceded": 10,
        "away_played": 11,
        "away_goals_scored": 12,
        "away_goals_conceded": 14,
        "recent_form": ["W", "L", "W", "D", "L"],
    }

    result = predict_match(home, away, 1.55, 1.20)

    print(f"Home xG: {result['home_xg']}")
    print(f"Away xG: {result['away_xg']}")
    print(f"Home Win: {result['home_win']}%")
    print(f"Draw: {result['draw']}%")
    print(f"Away Win: {result['away_win']}%")
    print(f"Over 2.5: {result['over_2_5']}%")
    print(f"BTTS: {result['btts_yes']}%")
    print(f"Top scorelines: {result['top_scorelines']}")
