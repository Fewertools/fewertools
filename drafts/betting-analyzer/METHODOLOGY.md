# Methodology: How the Model Works

## The Core Idea

Football goals follow a **Poisson distribution** — a statistical model for counting events that occur independently at a constant average rate. This is well-established in sports analytics research.

Given the expected number of goals for each team, you can calculate the probability of any scoreline, and from that, the probability of any outcome.

---

## Step 1: Calculate Attack & Defense Strength

For each team, we calculate two numbers:
- **Attack Strength** = How good they are at scoring relative to league average
- **Defense Strength** = How bad they are at defending relative to league average

### Home Team Attack Strength
```
= (Goals scored at home / Home games played) / League average home goals
```

### Home Team Defense Strength
```
= (Goals conceded at home / Home games played) / League average away goals
```

### Away Team Attack Strength
```
= (Goals scored away / Away games played) / League average away goals
```

### Away Team Defense Strength
```
= (Goals conceded away / Away games played) / League average home goals
```

### Example: Arsenal (Home) vs Chelsea (Away)

**League averages (Premier League 2025-26):**
- Average home goals: ~1.55 per game
- Average away goals: ~1.20 per game

**Arsenal at home:** 28 goals in 12 games = 2.33 goals/game
- Attack strength: 2.33 / 1.55 = **1.50** (50% better than average)

**Arsenal at home conceded:** 8 goals in 12 games = 0.67 goals/game
- Defense strength: 0.67 / 1.20 = **0.56** (44% better than average)

**Chelsea away:** 12 goals in 11 games = 1.09 goals/game
- Attack strength: 1.09 / 1.20 = **0.91** (9% worse than average)

**Chelsea away conceded:** 14 goals in 11 games = 1.27 goals/game
- Defense strength: 1.27 / 1.55 = **0.82** (18% better than average)

---

## Step 2: Calculate Expected Goals

### Expected goals for home team
```
= Home attack strength × Away defense strength × League avg home goals
= 1.50 × 0.82 × 1.55 = 1.91 expected goals for Arsenal
```

### Expected goals for away team
```
= Away attack strength × Home defense strength × League avg away goals
= 0.91 × 0.56 × 1.20 = 0.61 expected goals for Chelsea
```

---

## Step 3: Poisson Distribution

The Poisson formula gives us the probability of scoring exactly `k` goals:

```
P(X = k) = (λ^k × e^(-λ)) / k!
```

Where λ (lambda) is the expected number of goals.

For Arsenal (λ = 1.91):
- P(0 goals) = 14.8%
- P(1 goal)  = 28.3%
- P(2 goals) = 27.0%
- P(3 goals) = 17.2%
- P(4 goals) = 8.2%

For Chelsea (λ = 0.61):
- P(0 goals) = 54.3%
- P(1 goal)  = 33.2%
- P(2 goals) = 10.1%
- P(3 goals) = 2.1%

---

## Step 4: Score Matrix

Multiply each combination to get the probability of every scoreline:

|  | Chelsea 0 | Chelsea 1 | Chelsea 2 | Chelsea 3 |
|--|-----------|-----------|-----------|-----------|
| **Arsenal 0** | 8.0% | 4.9% | 1.5% | 0.3% |
| **Arsenal 1** | 15.4% | 9.4% | 2.9% | 0.6% |
| **Arsenal 2** | 14.7% | 9.0% | 2.7% | 0.6% |
| **Arsenal 3** | 9.3% | 5.7% | 1.7% | 0.4% |
| **Arsenal 4** | 4.5% | 2.7% | 0.8% | 0.2% |

### Match Outcomes
- **Arsenal Win:** Sum of all cells where Arsenal > Chelsea = ~65%
- **Draw:** Sum of diagonal (0-0, 1-1, 2-2, 3-3) = ~21%
- **Chelsea Win:** Sum of all cells where Chelsea > Arsenal = ~14%

---

## Step 5: Form Adjustment

Raw season stats don't capture momentum. We apply a **form factor**:

```
form_factor = (points_last_5 / max_possible_points) × weight
```

- Weight = 0.15 (form adjusts expected goals by up to 15%)
- Recent form blended with season data: `adjusted_xG = base_xG × (1 + form_deviation × 0.15)`

If a team has won 5/5 recent matches:
- Form factor = +15% boost to attack strength
- Defense gets a corresponding boost

If they've lost 5/5:
- -15% to attack strength

This keeps the model responsive without overreacting to small samples.

---

## Step 6: Value Identification

### Convert odds to implied probability
```
implied_probability = 1 / decimal_odds
```

### Calculate edge
```
edge = model_probability - implied_probability
```

### Value thresholds
| Edge | Rating | Action |
|------|--------|--------|
| < 3% | No value | Skip |
| 3-5% | Marginal | Skip (model uncertainty) |
| 5-10% | Value | Bet (low confidence) |
| 10-15% | Strong value | Bet (medium confidence) |
| 15%+ | High value | Bet (high confidence) |

### Why 5% minimum?
The model isn't perfect. A 5% buffer accounts for:
- Data limitations
- Injuries not captured in stats
- Tactical surprises
- Model error margin

---

## Step 7: Kelly Criterion (Quarter Kelly)

Full Kelly formula:
```
f* = (b × p - q) / b
```
Where:
- b = decimal odds - 1
- p = model probability
- q = 1 - p

**We use Quarter Kelly** (f* / 4) because:
1. Our probability estimates have uncertainty
2. Kelly assumes perfect probability knowledge
3. Quarter Kelly produces ~75% of the growth with far less volatility
4. Drawdowns are dramatically reduced

### Practical example:
- Odds: 3.60 (b = 2.60)
- Model prob: 34.2% (p = 0.342, q = 0.658)
- Full Kelly: (2.60 × 0.342 - 0.658) / 2.60 = 8.9%
- **Quarter Kelly: 2.2% of bankroll**

---

## Model Limitations

1. **No player-level data** — Injuries/suspensions not automatically captured
2. **No tactical analysis** — Doesn't know about formation changes
3. **Regression to mean** — New seasons need time to build data
4. **Cup competitions** — Less reliable (smaller sample, rotation)
5. **Poisson assumption** — Goals aren't perfectly independent (game state affects strategy)

### How to compensate:
- **Read the news** before confirming any bet
- **Check lineups** when available (matchday)
- **Skip early season** bets (first 5 matchdays, small samples)
- **Weight cup games lower** or skip entirely

---

## Further Reading

- *Soccermatics* by David Sumpter — Academic but accessible, covers Poisson models
- *The Signal and the Noise* by Nate Silver — Chapter on sports prediction
- Pinnacle's betting resources (pinnacle.com/betting-resources) — Free, practical

---

*The model gives you an edge. Your discipline keeps it.*
