# Analysis Prompts — Stock Watcher Content Engine

*Prompts for generating G.R.O.W. analysis content via AI.*

---

## Quick Take Prompt

Use this to generate a single-tweet stock analysis:

```
Generate a quick G.R.O.W. score tweet for {STOCK}.

Current data:
- Symbol: {SYMBOL}
- Current Price: ${PRICE}
- Price Change: {CHANGE}%
- G.R.O.W. Score: {SCORE}/100
- Growth Moat: {GM_SCORE}/100
- Revenue Quality: {RQ_SCORE}/100
- Owner-Operator: {OO_SCORE}/100
- Valuation Wisdom: {VW_SCORE}/100

Format exactly like this:
```
{SYMBOL} G.R.O.W. score: {SCORE}/100

🏰 Growth Moat: {GM_SCORE} ([brief reason])
📈 Revenue Quality: {RQ_SCORE} ([brief reason])
🤝 Owner-Operator: {OO_SCORE} ([brief reason])
💰 Valuation: {VW_SCORE} ([brief assessment])

Verdict: [One compelling sentence]
```

Rules:
- Each reason should be 3-5 words max
- Verdict should be insightful, not generic
- No emojis except the 4 component emojis
- No hashtags
- No "not financial advice" disclaimer
- Sound confident but not arrogant
- Total length under 280 characters per section
```

---

## Deep Dive Thread Prompt

Use this to generate a full 6-tweet analysis thread:

```
Generate a G.R.O.W. deep dive thread for {STOCK}.

Stock Data:
- Company: {COMPANY_NAME}
- Symbol: {SYMBOL}
- Sector: {SECTOR}
- Current Price: ${PRICE}
- Market Cap: ${MARKET_CAP}
- P/E Ratio: {PE}
- Forward P/E: {FORWARD_PE}
- Revenue Growth: {REV_GROWTH}%
- Gross Margin: {GROSS_MARGIN}%
- Insider Ownership: {INSIDER_OWN}%

G.R.O.W. Scores:
- Total: {SCORE}/100
- Growth Moat: {GM_SCORE}/100
- Revenue Quality: {RQ_SCORE}/100
- Owner-Operator: {OO_SCORE}/100
- Valuation Wisdom: {VW_SCORE}/100

Generate 6 tweets:

**Tweet 1 (Hook):**
Short, engaging opener. Mention the score. End with "Let's break it down 🧵"

**Tweet 2 (Growth Moat):**
Start with "🏰 Growth Moat: {GM_SCORE}/100"
List 3-4 bullet points about competitive advantage
End with one-line assessment

**Tweet 3 (Revenue Quality):**
Start with "📈 Revenue Quality: {RQ_SCORE}/100"
List 3-4 bullet points about revenue characteristics
End with one-line assessment

**Tweet 4 (Owner-Operator):**
Start with "🤝 Owner-Operator: {OO_SCORE}/100"
List 3-4 bullet points about leadership and alignment
End with one-line assessment

**Tweet 5 (Valuation Wisdom):**
Start with "💰 Valuation Wisdom: {VW_SCORE}/100"
Include P/E, forward P/E, comparison to peers/history
End with one-line assessment

**Tweet 6 (Verdict + CTA):**
Start with "📊 Final G.R.O.W. score: {SCORE}/100"
2-3 sentence summary of investment thesis
End with "Track {SYMBOL} on your watchlist → [link]"

Rules:
- Each tweet under 280 characters
- Be specific with numbers
- Avoid generic statements
- Sound like a thoughtful analyst, not a cheerleader
- No "not financial advice"
- Separate tweets with ---
```

---

## Score Change Alert Prompt

Use when a stock's score changes significantly:

```
Generate a G.R.O.W. score change tweet.

Data:
- Symbol: {SYMBOL}
- Previous Score: {OLD_SCORE}
- New Score: {NEW_SCORE}
- Change: {CHANGE} points
- Primary reason: {REASON}
- Component that changed most: {COMPONENT}

Format:
```
📊 G.R.O.W. Update: {SYMBOL}

Score moved: {OLD_SCORE} → {NEW_SCORE} ({+/-CHANGE})

What changed:
• {Specific reason 1}
• {Specific reason 2 if applicable}

{One sentence implication for investors}
```

Rules:
- Only include real, verifiable changes
- Be specific about what caused the change
- Don't speculate on future price movements
```

---

## Weekly Roundup Prompt

Use every Monday for the weekly summary:

```
Generate this week's G.R.O.W. roundup.

This week's data:
{TABLE OF STOCKS WITH SCORES AND CHANGES}

Format:
```
📊 G.R.O.W. Weekly — {DATE}

Score movers this week:

⬆️ {STOCK}: {OLD} → {NEW} ({reason})
⬆️ {STOCK}: {OLD} → {NEW} ({reason})
⬇️ {STOCK}: {OLD} → {NEW} ({reason})
➡️ {STOCK}: {SCORE} (stable)

{One interesting insight from the week}

Free watchlist tracking → [link]
```

Rules:
- Include 4-6 stocks
- Lead with biggest positive mover
- Reasons should be very brief (2-4 words)
- Insight should be non-obvious
```

---

## Comparison Thread Prompt

Use for head-to-head stock comparisons:

```
Generate a G.R.O.W. comparison thread: {STOCK_A} vs {STOCK_B}

Stock A Data:
{ALL METRICS}

Stock B Data:
{ALL METRICS}

Generate 6 tweets:

**Tweet 1 (Hook):**
"{STOCK_A} vs {STOCK_B} — G.R.O.W. comparison

Two [sector] giants. Which scores higher?

Let's break it down 🧵"

**Tweet 2-5:** Compare each G.R.O.W. component
- Show both scores
- Brief explanation for each
- Declare edge: "{STOCK} wins" or "Tie"

**Tweet 6 (Verdict):**
Final scores, 2-sentence summary of when you'd choose each.
CTA to compare on Stock Watcher.

Rules:
- Be fair to both stocks
- Acknowledge trade-offs
- Don't declare an overall "winner" — different investors have different needs
```

---

## Educational Thread Prompt

Use for methodology explainers:

```
Generate an educational thread about {G.R.O.W. COMPONENT}.

Topic: {What is Growth Moat / Revenue Quality / Owner-Operator / Valuation Wisdom}

Generate 6-7 tweets:

**Tweet 1:** Hook explaining why this matters
**Tweet 2:** Definition in simple terms
**Tweet 3-4:** Specific factors to look for (bullet points)
**Tweet 5:** Examples with real stocks and scores
**Tweet 6:** Common mistakes investors make
**Tweet 7:** CTA to check scores on Stock Watcher

Rules:
- Teach, don't preach
- Use concrete examples
- Avoid jargon or define it immediately
- Make it actionable
```

---

## Buy Zone Alert Prompt

Use when a quality stock hits a good entry point:

```
Generate a buy zone alert tweet.

Data:
- Symbol: {SYMBOL}
- G.R.O.W. Score: {SCORE}
- Current Price: ${PRICE}
- Target Zone: ${LOW} - ${HIGH}
- Why now: {CATALYST}

Format:
```
🔔 {SYMBOL} entered the buy zone

G.R.O.W. score: {SCORE}/100
Current price: ${PRICE}
Target zone: ${LOW} - ${HIGH}

{Why this is interesting - one line}

Track your own buy zones → [link]
```

Rules:
- Never say "buy now" or give direct advice
- Frame as "entered the zone" not "you should buy"
- Include the score to show quality backing
```

---

## Content Variation Rules

To keep content fresh, rotate between:

1. **Tone variations:**
   - Sometimes more casual ("Interesting move here...")
   - Sometimes more analytical ("The data shows...")
   - Sometimes more direct ("Score: 87. Breakdown:")

2. **Structure variations:**
   - Standard G.R.O.W. breakdown
   - Lead with the most interesting component
   - Lead with the verdict, then explain

3. **Length variations:**
   - Quick takes (single tweet)
   - Medium depth (3 tweets)
   - Full threads (6+ tweets)

4. **Focus variations:**
   - Score-focused
   - Story-focused (what's changing)
   - Comparison-focused

---

## Quality Checklist

Before posting any generated content, verify:

- [ ] Scores match current data
- [ ] No specific price predictions
- [ ] No "buy" or "sell" recommendations
- [ ] Factual claims are accurate
- [ ] Tone matches brand voice (calm, confident)
- [ ] Under character limits
- [ ] No repeated phrasing from recent posts
- [ ] CTA link is correct

---

## Example Workflow

1. **Fetch data** from FMP for target stock
2. **Calculate scores** using G.R.O.W. algorithm
3. **Select prompt** based on content type for today
4. **Fill in data** placeholders in prompt
5. **Generate** via Claude
6. **Review** against quality checklist
7. **Post** via bird CLI or save for manual posting

---

*Good prompts + good data = consistent quality content.*
