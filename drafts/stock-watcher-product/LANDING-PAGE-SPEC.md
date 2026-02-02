# Stock Watcher — Landing Page Spec

*The page that converts curious visitors into users.*

---

## Design Direction

**Vibe:** Calm, premium, confident. Think: a well-designed trading desk for patient investors.

**Not:** Flashy finance bro energy. No rocket emojis. No "🚀 TO THE MOON."

**Color palette:**
- Primary: Deep navy (#0f172a) or rich black (#09090b)
- Accent: Emerald green (#10b981) — growth, money, positive
- Secondary: Slate grays
- Text: High contrast whites and soft grays

**Typography:**
- Headlines: Inter or SF Pro Display (bold, clean)
- Body: Inter (readable, modern)
- Monospace accents for numbers: JetBrains Mono

**Imagery:**
- Minimal
- Product screenshots (real, not mockups)
- Subtle gradients
- No stock photos of people pointing at screens

---

## Page Structure

### Section 1: Hero

**Headline:**
```
Stock watching for patient investors
```

**Subheadline:**
```
Stop drowning in noise. Track quality stocks with G.R.O.W. scores, 
get alerted when they hit buy zones, and invest with confidence.
```

**CTA:**
```
[Start watching for free] → primary button
[See how it works] → text link
```

**Visual:** Hero product screenshot showing dashboard with scores

---

### Section 2: The Problem

**Headline:**
```
Too much noise. Not enough signal.
```

**Copy:**
```
You're not a day trader. You don't have hours to research. 
But you know good companies exist — you just can't cut through the chaos to find them.

Traditional tools give you everything. Data dumps. Endless charts. Forum opinions.
What you need is simple: "Is this stock worth watching? Should I buy now?"
```

---

### Section 3: The Solution (G.R.O.W.)

**Headline:**
```
One score. Four pillars. Zero noise.
```

**Copy:**
```
The G.R.O.W. methodology scores every stock on what actually matters:
```

**Feature cards:**

| Letter | Word | Description |
|--------|------|-------------|
| G | Growth Moat | Does it have lasting competitive advantage? |
| R | Revenue Quality | Is the income predictable and growing? |
| O | Owner-Operator | Is management aligned with shareholders? |
| W | Valuation Wisdom | Is the price reasonable for the quality? |

```
Every stock gets a score from 0-100. 
Above 70? Worth your attention. 
Above 85? Probably worth your money.
```

---

### Section 4: Features

**Headline:**
```
What you get
```

**Feature blocks:**

**1. Curated Watchlist**
> Track the stocks that matter. Not 10,000 tickers — just your carefully chosen few, scored and monitored.

**2. AI Suggestions**
> Based on your watchlist style, we surface stocks you might be missing. Quality begets quality.

**3. Buy Zone Alerts**
> Get notified when a stock hits your price target AND has a strong G.R.O.W. score. Not just "it dropped" — "it's time."

**4. Portfolio Tracker**
> See your holdings through the G.R.O.W. lens. Know the quality of what you own.

---

### Section 5: Screenshot Showcase

Full-width product screenshots:
1. Dashboard with market overview + scores
2. Stock detail page with G.R.O.W. breakdown
3. Buy zone alert notification
4. Mobile view (responsive)

---

### Section 6: Social Proof

**Headline:**
```
What early users say
```

*(Placeholder for testimonials — gather during beta)*

**Alternative for launch:**
```
"Built by an investor tired of complexity. 
Used daily to manage a real portfolio."
```

---

### Section 7: Pricing

**Headline:**
```
Simple pricing. No surprises.
```

**Tier cards:**

```
FREE — For the curious
- Watch up to 5 stocks
- Basic G.R.O.W. scores
- Daily market overview
[Start free]

PRO — For the serious
- Unlimited watchlist
- AI suggestions
- Buy zone alerts
- Full G.R.O.W. breakdowns
$8/month or $79/year (save 18%)
[Upgrade to Pro]

EARLY ADOPTER — Limited
- Everything in Pro
- $59/year forever
- First 100 users only
[Claim early access]
```

---

### Section 8: FAQ

**Q: Is this financial advice?**
A: No. Stock Watcher provides information and opinion, not advice. You make your own decisions.

**Q: What data do you use?**
A: Financial Modeling Prep API for fundamentals. We cache and process it into G.R.O.W. scores.

**Q: Can I track international stocks?**
A: Currently US markets only. International coming based on demand.

**Q: How is G.R.O.W. calculated?**
A: [Link to methodology page] — fully transparent scoring.

**Q: Can I cancel anytime?**
A: Yes. Monthly cancels immediately. Annual is prorated if you cancel within 30 days.

---

### Section 9: Final CTA

**Headline:**
```
Ready to watch smarter?
```

**Copy:**
```
Join hundreds of patient investors who cut the noise and focus on quality.
```

**CTA:**
```
[Create free account]
```

---

## Mobile Considerations

- Sticky CTA button at bottom
- Collapsible FAQ
- Feature cards stack vertically
- Screenshots in carousel

---

## Technical Notes

- Build with Next.js (same stack as app)
- Host on Vercel
- Analytics: Plausible (privacy-friendly)
- Forms: Supabase or Formspree
- Domain: stockwatcher.app, growscore.app, or similar

---

## SEO Targets

Primary keywords:
- stock watchlist app
- stock tracking app
- stock portfolio tracker
- best stock screener
- quality stock investing

Long-tail:
- "how to find quality stocks"
- "stock scoring methodology"
- "patient investor tools"

---

## Pre-Launch Checklist

- [ ] Domain registered
- [ ] Landing page live
- [ ] Waitlist form working
- [ ] Analytics installed
- [ ] Social preview images (OG tags)
- [ ] Mobile tested

---

*Next: Review LAUNCH-ROADMAP.md*
