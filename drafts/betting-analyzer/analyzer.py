#!/usr/bin/env python3
"""
⚽ Betting Analyzer — Value Bet Finder
Finds mispriced football bets using Poisson modeling.

Usage:
  python analyzer.py scan              # Scan upcoming matches for value bets
  python analyzer.py scan --league PL  # Scan specific league only
  python analyzer.py match "Arsenal" "Chelsea"  # Analyze specific match
  python analyzer.py history           # View bet tracking history
  python analyzer.py update-stats      # Refresh team statistics cache
  python analyzer.py test              # Run with example data (no API needed)
"""

import sys
import os
import json
import argparse
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional

# Add models to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "models"))

try:
    import requests
    from rich.console import Console
    from rich.table import Table
    from rich.panel import Panel
    from rich import box
except ImportError:
    print("Missing dependencies. Run: pip install -r requirements.txt")
    sys.exit(1)

from poisson import predict_match, fair_odds
from value_finder import find_value_bets, format_value_bet, ValueBet, implied_probability

console = Console()

# Paths
BASE_DIR = Path(__file__).parent
CONFIG_PATH = BASE_DIR / "config.json"
STATS_PATH = BASE_DIR / "data" / "team_stats.json"
HISTORY_PATH = BASE_DIR / "data" / "bet_history.json"


# ─── Config ───────────────────────────────────────────────────────────

def load_config() -> Dict:
    """Load configuration from config.json."""
    if not CONFIG_PATH.exists():
        console.print("[red]No config.json found. Copy config.example.json → config.json and add your API keys.[/red]")
        sys.exit(1)

    with open(CONFIG_PATH) as f:
        return json.load(f)


def load_stats() -> Dict:
    """Load cached team statistics."""
    if not STATS_PATH.exists():
        return {}
    with open(STATS_PATH) as f:
        return json.load(f)


def save_stats(stats: Dict):
    """Save team statistics to cache."""
    STATS_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(STATS_PATH, "w") as f:
        json.dump(stats, f, indent=2)


def load_history() -> List[Dict]:
    """Load bet tracking history."""
    if not HISTORY_PATH.exists():
        return []
    with open(HISTORY_PATH) as f:
        return json.load(f)


def save_history(history: List[Dict]):
    """Save bet tracking history."""
    HISTORY_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(HISTORY_PATH, "w") as f:
        json.dump(history, f, indent=2)


# ─── API Calls ─────────────────────────────────────────────────────────

def fetch_odds(config: Dict, sport: str = "soccer_epl") -> List[Dict]:
    """
    Fetch upcoming match odds from The Odds API.

    Free tier: 500 requests/month.
    """
    api_key = config["api_keys"]["odds_api"]
    if api_key == "YOUR_ODDS_API_KEY_HERE":
        console.print("[yellow]⚠ No Odds API key set. Get one free at https://the-odds-api.com/[/yellow]")
        return []

    url = f"https://api.the-odds-api.com/v4/sports/{sport}/odds"
    params = {
        "apiKey": api_key,
        "regions": "uk",
        "markets": "h2h,totals",
        "oddsFormat": "decimal",
        "dateFormat": "iso",
    }

    try:
        resp = requests.get(url, params=params, timeout=15)
        resp.raise_for_status()

        # Show remaining API requests
        remaining = resp.headers.get("x-requests-remaining", "?")
        console.print(f"[dim]API requests remaining this month: {remaining}[/dim]")

        return resp.json()
    except requests.RequestException as e:
        console.print(f"[red]Odds API error: {e}[/red]")
        return []


def fetch_team_stats(config: Dict, league_code: str = "PL") -> Dict:
    """
    Fetch team statistics from football-data.org.

    Free tier: 10 calls/min.
    """
    api_key = config["api_keys"]["football_data"]
    if api_key == "YOUR_FOOTBALL_DATA_KEY_HERE":
        console.print("[yellow]⚠ No Football-Data key set. Get one free at https://www.football-data.org/[/yellow]")
        return {}

    headers = {"X-Auth-Token": api_key}

    try:
        # Get standings (includes team stats)
        url = f"https://api.football-data.org/v4/competitions/{league_code}/standings"
        resp = requests.get(url, headers=headers, timeout=15)
        resp.raise_for_status()
        data = resp.json()

        # Get recent matches for form data
        matches_url = f"https://api.football-data.org/v4/competitions/{league_code}/matches?status=FINISHED&limit=100"
        matches_resp = requests.get(matches_url, headers=headers, timeout=15)
        matches_resp.raise_for_status()
        matches_data = matches_resp.json()

        return _process_football_data(data, matches_data)

    except requests.RequestException as e:
        console.print(f"[red]Football-Data API error: {e}[/red]")
        return {}


def _process_football_data(standings_data: Dict, matches_data: Dict) -> Dict:
    """Process API responses into our team stats format."""
    teams = {}

    # Process standings for season stats
    for standing_type in standings_data.get("standings", []):
        table_type = standing_type.get("type", "")

        for entry in standing_type.get("table", []):
            team_name = entry.get("team", {}).get("name", "Unknown")
            team_id = entry.get("team", {}).get("id", 0)

            if team_name not in teams:
                teams[team_name] = {
                    "id": team_id,
                    "home_played": 0,
                    "home_goals_scored": 0,
                    "home_goals_conceded": 0,
                    "away_played": 0,
                    "away_goals_scored": 0,
                    "away_goals_conceded": 0,
                    "recent_form": [],
                }

            if table_type == "HOME":
                teams[team_name]["home_played"] = entry.get("playedGames", 0)
                teams[team_name]["home_goals_scored"] = entry.get("goalsFor", 0)
                teams[team_name]["home_goals_conceded"] = entry.get("goalsAgainst", 0)
            elif table_type == "AWAY":
                teams[team_name]["away_played"] = entry.get("playedGames", 0)
                teams[team_name]["away_goals_scored"] = entry.get("goalsFor", 0)
                teams[team_name]["away_goals_conceded"] = entry.get("goalsAgainst", 0)
            elif table_type == "TOTAL":
                # Use total if home/away not available
                if teams[team_name]["home_played"] == 0:
                    gp = entry.get("playedGames", 0)
                    gf = entry.get("goalsFor", 0)
                    ga = entry.get("goalsAgainst", 0)
                    # Approximate 50/50 split
                    teams[team_name]["home_played"] = gp // 2
                    teams[team_name]["away_played"] = gp - (gp // 2)
                    teams[team_name]["home_goals_scored"] = gf // 2
                    teams[team_name]["away_goals_scored"] = gf - (gf // 2)
                    teams[team_name]["home_goals_conceded"] = ga // 2
                    teams[team_name]["away_goals_conceded"] = ga - (ga // 2)

    # Process recent matches for form
    matches = matches_data.get("matches", [])
    # Sort by date descending
    matches.sort(key=lambda m: m.get("utcDate", ""), reverse=True)

    # Track last 10 matches per team (to extract last 5 form)
    team_matches = {}
    for match in matches:
        home_team = match.get("homeTeam", {}).get("name", "")
        away_team = match.get("awayTeam", {}).get("name", "")
        winner = match.get("score", {}).get("winner", "")

        for team_name in [home_team, away_team]:
            if team_name and team_name in teams:
                if team_name not in team_matches:
                    team_matches[team_name] = []
                if len(team_matches[team_name]) < 10:
                    if team_name == home_team:
                        if winner == "HOME_TEAM":
                            team_matches[team_name].append("W")
                        elif winner == "DRAW":
                            team_matches[team_name].append("D")
                        else:
                            team_matches[team_name].append("L")
                    else:
                        if winner == "AWAY_TEAM":
                            team_matches[team_name].append("W")
                        elif winner == "DRAW":
                            team_matches[team_name].append("D")
                        else:
                            team_matches[team_name].append("L")

    for team_name, form in team_matches.items():
        if team_name in teams:
            # Reverse so oldest first (form reads left to right)
            teams[team_name]["recent_form"] = list(reversed(form[:5]))

    return teams


def _calculate_league_averages(stats: Dict) -> tuple:
    """Calculate league average home and away goals from team stats."""
    total_home_goals = sum(t.get("home_goals_scored", 0) for t in stats.values())
    total_home_games = sum(t.get("home_played", 0) for t in stats.values())
    total_away_goals = sum(t.get("away_goals_scored", 0) for t in stats.values())
    total_away_games = sum(t.get("away_played", 0) for t in stats.values())

    avg_home = total_home_goals / max(total_home_games, 1)
    avg_away = total_away_goals / max(total_away_games, 1)

    return round(avg_home, 3), round(avg_away, 3)


# ─── Commands ──────────────────────────────────────────────────────────

def cmd_scan(config: Dict, league_filter: Optional[str] = None):
    """Scan upcoming matches for value bets."""
    console.print(Panel("⚽ Scanning for Value Bets...", style="bold cyan"))

    prefs = config["preferences"]
    leagues = prefs["leagues"]
    league_map = config.get("football_data_leagues", {})

    if league_filter:
        # Map common abbreviations
        abbrevs = {
            "PL": "soccer_epl", "EPL": "soccer_epl",
            "LL": "soccer_spain_la_liga", "LALIGA": "soccer_spain_la_liga",
            "SA": "soccer_italy_serie_a", "SERIE_A": "soccer_italy_serie_a",
            "BL": "soccer_germany_bundesliga", "BUNDESLIGA": "soccer_germany_bundesliga",
            "L1": "soccer_france_ligue_one", "LIGUE1": "soccer_france_ligue_one",
            "CL": "soccer_uefa_champs_league", "UCL": "soccer_uefa_champs_league",
        }
        target = abbrevs.get(league_filter.upper(), league_filter)
        leagues = [l for l in leagues if l == target]
        if not leagues:
            console.print(f"[yellow]League '{league_filter}' not found. Available: {', '.join(prefs['leagues'])}[/yellow]")
            return

    all_stats = load_stats()
    all_value_bets = []

    for league_key in leagues:
        console.print(f"\n[bold]📊 {league_key}[/bold]")

        # Fetch odds
        matches = fetch_odds(config, league_key)
        if not matches:
            console.print("[dim]  No upcoming matches or API error[/dim]")
            continue

        # Get team stats for this league
        fd_code = league_map.get(league_key)
        league_stats = all_stats.get(league_key, {})

        if not league_stats and fd_code:
            console.print(f"[dim]  No cached stats for {league_key}. Run 'update-stats' first.[/dim]")
            continue

        avg_home, avg_away = _calculate_league_averages(league_stats)
        if avg_home == 0:
            avg_home, avg_away = 1.50, 1.15  # Fallback defaults

        console.print(f"[dim]  League avg: {avg_home:.2f} home, {avg_away:.2f} away | {len(matches)} matches[/dim]")

        for match in matches:
            home_name = match.get("home_team", "")
            away_name = match.get("away_team", "")
            kickoff = match.get("commence_time", "")

            # Find team stats (fuzzy match)
            home_stats = _find_team_stats(home_name, league_stats)
            away_stats = _find_team_stats(away_name, league_stats)

            if not home_stats or not away_stats:
                console.print(f"[dim]  ⏭ {home_name} vs {away_name} — missing stats[/dim]")
                continue

            # Run prediction
            pred = predict_match(
                home_stats, away_stats, avg_home, avg_away,
                form_weight=prefs.get("form_weight", 0.15),
                form_window=prefs.get("form_window", 5),
            )

            # Format kickoff
            try:
                dt = datetime.fromisoformat(kickoff.replace("Z", "+00:00"))
                kickoff_str = dt.strftime("%a %d %b, %H:%M")
            except Exception:
                kickoff_str = kickoff

            # Build odds data structure
            odds_data = {
                "match": f"{home_name} vs {away_name}",
                "league": league_key.replace("soccer_", "").replace("_", " ").title(),
                "kickoff": kickoff_str,
                "home_team": home_name,
                "away_team": away_name,
                "bookmakers": match.get("bookmakers", []),
            }

            # Find value
            value_bets = find_value_bets(pred, odds_data, prefs)
            all_value_bets.extend(value_bets)

            # Show match summary
            status = f"[green]✅ {len(value_bets)} value bet(s)[/green]" if value_bets else "[dim]No value[/dim]"
            console.print(
                f"  {home_name} vs {away_name} — "
                f"H:{pred['home_win']:.0f}% D:{pred['draw']:.0f}% A:{pred['away_win']:.0f}%"
                f" | {status}"
            )

    # Summary
    console.print(f"\n{'═' * 60}")
    if all_value_bets:
        console.print(f"[bold green]🎯 Found {len(all_value_bets)} value bet(s)![/bold green]\n")
        for vb in all_value_bets:
            console.print(format_value_bet(vb))
            console.print()

        # Save to history as pending
        _save_pending_bets(all_value_bets)
    else:
        console.print("[bold yellow]No value bets found in today's scan.[/bold yellow]")
        console.print("[dim]This is normal. Patience is the edge.[/dim]")


def cmd_match(config: Dict, home_name: str, away_name: str):
    """Deep analysis of a specific match."""
    console.print(Panel(f"⚽ {home_name} vs {away_name}", style="bold cyan"))

    all_stats = load_stats()
    prefs = config["preferences"]

    # Search across all leagues
    home_stats = None
    away_stats = None
    found_league = None

    for league_key, league_stats in all_stats.items():
        h = _find_team_stats(home_name, league_stats)
        a = _find_team_stats(away_name, league_stats)
        if h and a:
            home_stats, away_stats = h, a
            found_league = league_key
            break

    if not home_stats or not away_stats:
        console.print(f"[red]Could not find stats for both teams. Run 'update-stats' first.[/red]")
        console.print(f"[dim]Looked for: '{home_name}' and '{away_name}'[/dim]")
        return

    avg_home, avg_away = _calculate_league_averages(all_stats.get(found_league, {}))
    if avg_home == 0:
        avg_home, avg_away = 1.50, 1.15

    pred = predict_match(
        home_stats, away_stats, avg_home, avg_away,
        form_weight=prefs.get("form_weight", 0.15),
        form_window=prefs.get("form_window", 5),
    )

    # Display analysis
    table = Table(title="Match Prediction", box=box.ROUNDED)
    table.add_column("Metric", style="bold")
    table.add_column(home_name, justify="center", style="cyan")
    table.add_column(away_name, justify="center", style="magenta")

    table.add_row("Expected Goals", str(pred["home_xg"]), str(pred["away_xg"]))
    table.add_row("Win Probability", f"{pred['home_win']}%", f"{pred['away_win']}%")
    table.add_row("Draw", f"{pred['draw']}%", f"{pred['draw']}%")
    table.add_row("Form Factor", str(pred["home_form_factor"]), str(pred["away_form_factor"]))

    home_form = " ".join(home_stats.get("recent_form", []))
    away_form = " ".join(away_stats.get("recent_form", []))
    table.add_row("Recent Form", home_form or "N/A", away_form or "N/A")

    console.print(table)

    # Markets table
    markets = Table(title="Market Predictions", box=box.ROUNDED)
    markets.add_column("Market")
    markets.add_column("Probability", justify="center")
    markets.add_column("Fair Odds", justify="center")

    markets.add_row("Over 1.5 Goals", f"{pred['over_1_5']}%", str(fair_odds(pred['over_1_5'])))
    markets.add_row("Over 2.5 Goals", f"{pred['over_2_5']}%", str(fair_odds(pred['over_2_5'])))
    markets.add_row("Over 3.5 Goals", f"{pred['over_3_5']}%", str(fair_odds(pred['over_3_5'])))
    markets.add_row("BTTS Yes", f"{pred['btts_yes']}%", str(fair_odds(pred['btts_yes'])))
    markets.add_row("BTTS No", f"{pred['btts_no']}%", str(fair_odds(pred['btts_no'])))

    console.print(markets)

    # Top scorelines
    console.print("\n[bold]Most Likely Scorelines:[/bold]")
    for score, prob in pred["top_scorelines"]:
        bar = "█" * int(prob / 2)
        console.print(f"  {score:>5}  {bar} {prob}%")


def cmd_update_stats(config: Dict):
    """Update team statistics cache from Football-Data.org."""
    console.print(Panel("📊 Updating Team Statistics...", style="bold cyan"))

    league_map = config.get("football_data_leagues", {})
    all_stats = {}

    for league_key, fd_code in league_map.items():
        console.print(f"  Fetching {league_key} ({fd_code})...")
        stats = fetch_team_stats(config, fd_code)
        if stats:
            all_stats[league_key] = stats
            console.print(f"  [green]✓ {len(stats)} teams loaded[/green]")
        else:
            console.print(f"  [red]✗ Failed to fetch[/red]")

        # Respect rate limit
        import time
        time.sleep(7)  # 10 calls/min limit

    save_stats(all_stats)
    console.print(f"\n[bold green]Stats updated! {sum(len(v) for v in all_stats.values())} teams cached.[/bold green]")


def cmd_history(config: Dict):
    """Display bet tracking history."""
    history = load_history()
    if not history:
        console.print("[yellow]No betting history yet. Use 'scan' to find value bets.[/yellow]")
        return

    table = Table(title="Betting History", box=box.ROUNDED)
    table.add_column("Date")
    table.add_column("Match")
    table.add_column("Selection")
    table.add_column("Edge", justify="right")
    table.add_column("Odds", justify="right")
    table.add_column("Stake", justify="right")
    table.add_column("Result")
    table.add_column("P/L", justify="right")

    total_pl = 0
    total_bets = 0
    wins = 0

    for bet in history[-50:]:  # Last 50
        result = bet.get("result", "pending")
        pl = bet.get("profit_loss", 0)
        total_pl += pl
        total_bets += 1
        if result == "won":
            wins += 1

        result_style = {
            "won": "[green]WON[/green]",
            "lost": "[red]LOST[/red]",
            "void": "[yellow]VOID[/yellow]",
            "pending": "[dim]PENDING[/dim]",
        }.get(result, result)

        pl_str = f"[green]+{pl:.1f}[/green]" if pl > 0 else f"[red]{pl:.1f}[/red]" if pl < 0 else "[dim]—[/dim]"

        table.add_row(
            bet.get("date", "?"),
            bet.get("match", "?")[:25],
            bet.get("selection", "?"),
            f"{bet.get('edge', 0):.1f}%",
            f"{bet.get('odds', 0):.2f}",
            f"{bet.get('stake', 0):.1f}u",
            result_style,
            pl_str,
        )

    console.print(table)

    # Summary
    settled = [b for b in history if b.get("result") in ("won", "lost")]
    if settled:
        strike_rate = (wins / len(settled)) * 100
        console.print(f"\n[bold]Summary:[/bold] {len(settled)} settled | {wins}W {len(settled)-wins}L | "
                      f"Strike rate: {strike_rate:.1f}% | P/L: {total_pl:+.1f} units")


def cmd_test():
    """Run with example data — no API keys needed."""
    console.print(Panel("🧪 Test Mode — Example Analysis", style="bold cyan"))

    # Premier League example teams
    teams = {
        "Arsenal": {
            "home_played": 12, "home_goals_scored": 28, "home_goals_conceded": 8,
            "away_played": 11, "away_goals_scored": 15, "away_goals_conceded": 12,
            "recent_form": ["W", "W", "D", "W", "W"],
        },
        "Chelsea": {
            "home_played": 12, "home_goals_scored": 20, "home_goals_conceded": 10,
            "away_played": 11, "away_goals_scored": 12, "away_goals_conceded": 14,
            "recent_form": ["W", "L", "W", "D", "L"],
        },
        "Liverpool": {
            "home_played": 12, "home_goals_scored": 30, "home_goals_conceded": 6,
            "away_played": 11, "away_goals_scored": 18, "away_goals_conceded": 10,
            "recent_form": ["W", "W", "W", "W", "D"],
        },
        "Man United": {
            "home_played": 12, "home_goals_scored": 16, "home_goals_conceded": 14,
            "away_played": 11, "away_goals_scored": 10, "away_goals_conceded": 16,
            "recent_form": ["L", "D", "W", "L", "L"],
        },
    }

    avg_home, avg_away = 1.55, 1.20

    # Example matches with simulated odds
    matches = [
        {
            "home": "Arsenal", "away": "Chelsea",
            "odds": {"home": 1.55, "draw": 3.60, "away": 6.50},
            "bookmaker": "Pinnacle",
        },
        {
            "home": "Liverpool", "away": "Man United",
            "odds": {"home": 1.30, "draw": 5.50, "away": 10.0},
            "bookmaker": "Bet365",
        },
    ]

    for m in matches:
        home_name = m["home"]
        away_name = m["away"]

        pred = predict_match(teams[home_name], teams[away_name], avg_home, avg_away)

        console.print(f"\n[bold]{home_name} vs {away_name}[/bold]")
        console.print(f"  xG: {pred['home_xg']} - {pred['away_xg']}")
        console.print(f"  Win: H {pred['home_win']}% | D {pred['draw']}% | A {pred['away_win']}%")
        console.print(f"  O/U 2.5: {pred['over_2_5']}% / {100 - pred['over_2_5']:.1f}%")
        console.print(f"  BTTS: {pred['btts_yes']}%")
        console.print(f"  Top: {', '.join(f'{s} ({p}%)' for s, p in pred['top_scorelines'][:3])}")

        # Check value vs example odds
        for outcome, prob_key, odds in [
            (f"{home_name} Win", "home_win", m["odds"]["home"]),
            ("Draw", "draw", m["odds"]["draw"]),
            (f"{away_name} Win", "away_win", m["odds"]["away"]),
        ]:
            model_prob = pred[prob_key]
            imp = implied_probability(odds)
            edge = model_prob - imp

            if edge >= 5:
                console.print(
                    f"  [green]✅ VALUE: {outcome} @ {odds} "
                    f"(model: {model_prob:.1f}%, implied: {imp:.1f}%, edge: +{edge:.1f}%)[/green]"
                )
            else:
                console.print(
                    f"  [dim]   {outcome} @ {odds} "
                    f"(model: {model_prob:.1f}%, implied: {imp:.1f}%, edge: {edge:+.1f}%)[/dim]"
                )

    console.print(f"\n[bold green]✓ Test complete! Model is working.[/bold green]")
    console.print("[dim]Get API keys to scan real matches → see README.md[/dim]")


# ─── Helpers ───────────────────────────────────────────────────────────

def _find_team_stats(name: str, league_stats: Dict) -> Optional[Dict]:
    """Fuzzy match a team name against cached stats."""
    name_lower = name.lower()

    # Common name mappings
    aliases = {
        "man city": "manchester city",
        "man utd": "manchester united",
        "man united": "manchester united",
        "spurs": "tottenham hotspur",
        "tottenham": "tottenham hotspur",
        "wolves": "wolverhampton wanderers",
        "wolverhampton": "wolverhampton wanderers",
        "brighton": "brighton & hove albion",
        "west ham": "west ham united",
        "newcastle": "newcastle united",
        "nott'm forest": "nottingham forest",
        "nottingham": "nottingham forest",
        "sheffield utd": "sheffield united",
        "atletico": "atlético madrid",
        "atletico madrid": "atlético madrid",
        "real madrid": "real madrid cf",
        "barcelona": "fc barcelona",
        "bayern": "fc bayern münchen",
        "bayern munich": "fc bayern münchen",
        "psg": "paris saint-germain",
        "inter": "fc internazionale milano",
        "inter milan": "fc internazionale milano",
        "ac milan": "ac milan",
        "juventus": "juventus fc",
    }

    # Try direct match first
    for team_name, stats in league_stats.items():
        if team_name.lower() == name_lower:
            return stats

    # Try alias
    resolved = aliases.get(name_lower, name_lower)
    for team_name, stats in league_stats.items():
        if team_name.lower() == resolved:
            return stats

    # Try partial match
    for team_name, stats in league_stats.items():
        if name_lower in team_name.lower() or team_name.lower() in name_lower:
            return stats

    return None


def _save_pending_bets(value_bets: List[ValueBet]):
    """Save value bets to history as pending."""
    history = load_history()
    for vb in value_bets:
        entry = {
            "date": datetime.utcnow().strftime("%Y-%m-%d"),
            "match": vb.match,
            "league": vb.league,
            "selection": vb.selection,
            "market": vb.market,
            "edge": vb.edge,
            "odds": vb.best_odds,
            "bookmaker": vb.bookmaker,
            "model_prob": vb.model_prob,
            "stake": vb.kelly_stake,
            "confidence": vb.confidence,
            "result": "pending",
            "profit_loss": 0,
            "timestamp": vb.timestamp,
        }
        history.append(entry)
    save_history(history)
    console.print(f"[dim]Saved {len(value_bets)} bet(s) to history (pending)[/dim]")


# ─── Main ──────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="⚽ Betting Analyzer — Find mispriced football bets"
    )
    subparsers = parser.add_subparsers(dest="command")

    # scan
    scan_parser = subparsers.add_parser("scan", help="Scan for value bets")
    scan_parser.add_argument("--league", "-l", help="Filter by league (PL, LL, SA, BL, L1, CL)")

    # match
    match_parser = subparsers.add_parser("match", help="Analyze a specific match")
    match_parser.add_argument("home", help="Home team name")
    match_parser.add_argument("away", help="Away team name")

    # history
    subparsers.add_parser("history", help="View bet history")

    # update-stats
    subparsers.add_parser("update-stats", help="Update team statistics")

    # test
    subparsers.add_parser("test", help="Test with example data (no API needed)")

    args = parser.parse_args()

    if args.command == "test":
        cmd_test()
        return

    if not args.command:
        parser.print_help()
        return

    config = load_config()

    if args.command == "scan":
        cmd_scan(config, args.league)
    elif args.command == "match":
        cmd_match(config, args.home, args.away)
    elif args.command == "history":
        cmd_history(config)
    elif args.command == "update-stats":
        cmd_update_stats(config)


if __name__ == "__main__":
    main()
