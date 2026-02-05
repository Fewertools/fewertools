"""
Value Bet Finder

Compares model probabilities against bookmaker odds to identify
mispriced outcomes. Uses Quarter Kelly for optimal staking.
"""

from typing import Dict, List, Optional
from dataclasses import dataclass, asdict
from datetime import datetime


@dataclass
class ValueBet:
    """A single value bet opportunity."""
    match: str
    league: str
    kickoff: str
    market: str                # e.g., "Home Win", "Draw", "Over 2.5"
    selection: str             # e.g., "Arsenal", "Draw", "Over 2.5"
    model_prob: float          # Our model's probability (%)
    implied_prob: float        # Bookmaker's implied probability (%)
    edge: float                # model_prob - implied_prob
    best_odds: float           # Best available decimal odds
    bookmaker: str             # Which bookmaker has best odds
    fair_odds: float           # What the odds "should" be per model
    kelly_stake: float         # Recommended stake in units
    confidence: str            # LOW / MEDIUM / HIGH
    timestamp: str             # When this was generated

    def to_dict(self):
        return asdict(self)


def implied_probability(decimal_odds: float) -> float:
    """Convert decimal odds to implied probability (%)."""
    if decimal_odds <= 1.0:
        return 100.0
    return round(100 / decimal_odds, 2)


def quarter_kelly(
    model_prob: float,
    decimal_odds: float,
    fraction: float = 0.25
) -> float:
    """
    Calculate Kelly Criterion stake as fraction of bankroll.

    Args:
        model_prob: Our probability estimate (0-1)
        decimal_odds: Best available decimal odds
        fraction: Kelly fraction (0.25 = Quarter Kelly)

    Returns:
        Recommended stake as % of bankroll (0 if no value)
    """
    b = decimal_odds - 1
    p = model_prob
    q = 1 - p

    if b <= 0 or p <= 0:
        return 0.0

    kelly = (b * p - q) / b
    if kelly <= 0:
        return 0.0

    return round(kelly * fraction * 100, 2)


def find_value_bets(
    prediction: Dict,
    odds_data: Dict,
    config: Dict
) -> List[ValueBet]:
    """
    Compare model predictions against bookmaker odds to find value.

    Args:
        prediction: Output from poisson.predict_match()
        odds_data: Bookmaker odds for the match
        config: User preferences (min_edge, kelly_fraction, etc.)

    Returns:
        List of ValueBet objects where edge > min_edge
    """
    min_edge = config.get("min_edge_percent", 5.0)
    kelly_fraction = config.get("kelly_fraction", 0.25)
    bankroll = config.get("bankroll", 1000)
    unit_pct = config.get("unit_percent", 1.0)
    max_units = config.get("max_stake_units", 5)

    match_name = odds_data.get("match", "Unknown")
    league = odds_data.get("league", "Unknown")
    kickoff = odds_data.get("kickoff", "Unknown")

    value_bets = []

    # Markets to check
    markets = [
        {
            "market": "Match Result",
            "selections": [
                ("Home Win", prediction["home_win"], "h2h", odds_data.get("home_team", "Home")),
                ("Draw", prediction["draw"], "h2h", "Draw"),
                ("Away Win", prediction["away_win"], "h2h", odds_data.get("away_team", "Away")),
            ],
        },
        {
            "market": "Over/Under",
            "selections": [
                ("Over 1.5", prediction["over_1_5"], "totals", "Over 1.5"),
                ("Over 2.5", prediction["over_2_5"], "totals", "Over 2.5"),
                ("Over 3.5", prediction["over_3_5"], "totals", "Over 3.5"),
                ("Under 2.5", 100 - prediction["over_2_5"], "totals", "Under 2.5"),
            ],
        },
        {
            "market": "BTTS",
            "selections": [
                ("BTTS Yes", prediction["btts_yes"], "btts", "Yes"),
                ("BTTS No", prediction["btts_no"], "btts", "No"),
            ],
        },
    ]

    now = datetime.utcnow().isoformat()

    for market_group in markets:
        market_name = market_group["market"]

        for selection_name, model_prob_pct, odds_key, outcome_name in market_group["selections"]:
            # Find best odds across bookmakers for this outcome
            best_odds_info = _find_best_odds(odds_data, odds_key, outcome_name)
            if not best_odds_info:
                continue

            best_odds = best_odds_info["price"]
            bookmaker = best_odds_info["bookmaker"]

            imp_prob = implied_probability(best_odds)
            edge = model_prob_pct - imp_prob

            if edge >= min_edge:
                # Calculate Kelly stake
                model_p = model_prob_pct / 100
                kelly_pct = quarter_kelly(model_p, best_odds, kelly_fraction)

                # Convert to units
                kelly_units = round(kelly_pct / unit_pct, 1)
                kelly_units = min(kelly_units, max_units)  # Cap at max

                # Confidence level
                if edge >= 15:
                    confidence = "HIGH"
                elif edge >= 10:
                    confidence = "MEDIUM"
                else:
                    confidence = "LOW"

                # Fair odds (what model says the odds should be)
                fair = round(100 / model_prob_pct, 2) if model_prob_pct > 0 else 99.0

                vb = ValueBet(
                    match=match_name,
                    league=league,
                    kickoff=kickoff,
                    market=market_name,
                    selection=selection_name,
                    model_prob=model_prob_pct,
                    implied_prob=imp_prob,
                    edge=round(edge, 1),
                    best_odds=best_odds,
                    bookmaker=bookmaker,
                    fair_odds=fair,
                    kelly_stake=kelly_units,
                    confidence=confidence,
                    timestamp=now,
                )
                value_bets.append(vb)

    # Sort by edge (best first)
    value_bets.sort(key=lambda x: x.edge, reverse=True)
    return value_bets


def _find_best_odds(
    odds_data: Dict,
    market_key: str,
    outcome_name: str
) -> Optional[Dict]:
    """
    Find the best available odds for a specific outcome across all bookmakers.

    Args:
        odds_data: Full odds data from The Odds API
        market_key: Market type (h2h, totals, btts)
        outcome_name: Name of the outcome to match

    Returns:
        Dict with 'price' and 'bookmaker', or None if not found
    """
    bookmakers = odds_data.get("bookmakers", [])
    best = None

    for bm in bookmakers:
        bm_name = bm.get("title", bm.get("key", "Unknown"))
        for market in bm.get("markets", []):
            if market.get("key") != market_key:
                continue
            for outcome in market.get("outcomes", []):
                name = outcome.get("name", "")
                price = outcome.get("price", 0)

                # Match outcome name (flexible matching)
                if _outcome_matches(name, outcome_name, market_key):
                    if best is None or price > best["price"]:
                        best = {"price": price, "bookmaker": bm_name}

    return best


def _outcome_matches(api_name: str, target_name: str, market_key: str) -> bool:
    """Flexible matching between API outcome names and our target names."""
    api_lower = api_name.lower().strip()
    target_lower = target_name.lower().strip()

    # Direct match
    if api_lower == target_lower:
        return True

    # For h2h markets, match team names
    if market_key == "h2h":
        # Handle "Draw" specifically
        if target_lower == "draw" and api_lower == "draw":
            return True
        # Team name matching (partial)
        if target_lower in api_lower or api_lower in target_lower:
            return True

    # For totals, match "Over X.X" / "Under X.X"
    if market_key == "totals":
        if "over" in target_lower and "over" in api_lower:
            # Extract the number
            try:
                target_num = float(target_lower.split()[-1])
                api_point = outcome_point(api_name)
                if api_point and abs(api_point - target_num) < 0.1:
                    return True
            except (ValueError, IndexError):
                pass
        if "under" in target_lower and "under" in api_lower:
            try:
                target_num = float(target_lower.split()[-1])
                api_point = outcome_point(api_name)
                if api_point and abs(api_point - target_num) < 0.1:
                    return True
            except (ValueError, IndexError):
                pass

    return False


def outcome_point(name: str) -> Optional[float]:
    """Extract numeric point from outcome name like 'Over 2.5'."""
    parts = name.strip().split()
    for part in reversed(parts):
        try:
            return float(part)
        except ValueError:
            continue
    return None


def format_value_bet(vb: ValueBet, bankroll: float = 1000, unit_pct: float = 1.0) -> str:
    """Format a ValueBet as a readable string."""
    unit_value = bankroll * (unit_pct / 100)
    stake_money = vb.kelly_stake * unit_value

    confidence_emoji = {"LOW": "🟡", "MEDIUM": "🟠", "HIGH": "🔴"}.get(vb.confidence, "⚪")

    lines = [
        f"╔{'═' * 56}╗",
        f"║  ⚽ VALUE BET FOUND  {confidence_emoji} {vb.confidence:<36}║",
        f"╠{'═' * 56}╣",
        f"║  {vb.match:<54}║",
        f"║  {vb.league} — {vb.kickoff:<43}║",
        f"║{'─' * 56}║",
        f"║  Market:  {vb.selection:<44}║",
        f"║  Odds:    {vb.best_odds:.2f} ({vb.bookmaker}){' ' * max(0, 34 - len(vb.bookmaker))}║",
        f"║  Implied: {vb.implied_prob:.1f}%{' ' * 43}║",
        f"║  Model:   {vb.model_prob:.1f}%{' ' * 43}║",
        f"║  Edge:    +{vb.edge:.1f}%  {'✅' if vb.edge >= 10 else '📊'}{' ' * 40}║",
        f"║{'─' * 56}║",
        f"║  Stake:   {vb.kelly_stake:.1f} units (£{stake_money:.2f}){' ' * max(0, 30 - len(f'{stake_money:.2f}'))}║",
        f"║  Fair:    {vb.fair_odds:.2f}{' ' * 44}║",
        f"╚{'═' * 56}╝",
    ]
    return "\n".join(lines)


if __name__ == "__main__":
    # Test with example data
    from poisson import predict_match

    home = {
        "home_played": 12, "home_goals_scored": 28, "home_goals_conceded": 8,
        "away_played": 11, "away_goals_scored": 15, "away_goals_conceded": 12,
        "recent_form": ["W", "W", "D", "W", "W"],
    }
    away = {
        "home_played": 12, "home_goals_scored": 20, "home_goals_conceded": 10,
        "away_played": 11, "away_goals_scored": 12, "away_goals_conceded": 14,
        "recent_form": ["W", "L", "W", "D", "L"],
    }

    pred = predict_match(home, away, 1.55, 1.20)

    # Simulated odds data
    odds = {
        "match": "Arsenal vs Chelsea",
        "league": "Premier League",
        "kickoff": "Sat 8 Feb, 15:00",
        "home_team": "Arsenal",
        "away_team": "Chelsea",
        "bookmakers": [
            {
                "key": "pinnacle",
                "title": "Pinnacle",
                "markets": [
                    {
                        "key": "h2h",
                        "outcomes": [
                            {"name": "Arsenal", "price": 1.55},
                            {"name": "Draw", "price": 3.60},
                            {"name": "Chelsea", "price": 6.50},
                        ],
                    }
                ],
            }
        ],
    }

    config = {
        "min_edge_percent": 5.0,
        "kelly_fraction": 0.25,
        "bankroll": 1000,
        "unit_percent": 1.0,
        "max_stake_units": 5,
    }

    bets = find_value_bets(pred, odds, config)
    for bet in bets:
        print(format_value_bet(bet))
        print()
