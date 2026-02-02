# Stock Watcher — Launch Roadmap

*A 6-week plan from "project" to "product."*

---

## Overview

| Phase | Duration | Goal |
|-------|----------|------|
| Week 1-2 | Polish | Product-ready app |
| Week 3 | Soft Launch | Private beta (25 users) |
| Week 4 | Iterate | Fix issues, gather feedback |
| Week 5 | Public Beta | Open waitlist, start marketing |
| Week 6 | Official Launch | Product Hunt, payments live |

---

## Week 1: Polish the Product

### Goal: App is production-ready

**Tasks:**

- [ ] Get FMP API key (paid tier for production limits)
- [ ] Set up Supabase project
- [ ] Run schema migration
- [ ] Test all API endpoints
- [ ] Fix any bugs from prior build
- [ ] Add loading states and error handling
- [ ] Mobile responsiveness pass
- [ ] Dark mode polish (if not done)
- [ ] Add onboarding flow (first-run experience)
- [ ] Set up environment variables for production

**Deliverable:** App runs smoothly on Vercel preview

---

## Week 2: Landing + Infrastructure

### Goal: Landing page live, auth working, payments ready

**Tasks:**

- [ ] Register domain
- [ ] Build landing page (from spec)
- [ ] Set up Supabase auth (email + Google)
- [ ] Implement free tier limits (5 stocks)
- [ ] Set up Stripe + Lemonsqueezy
- [ ] Build upgrade flow
- [ ] Test subscription lifecycle
- [ ] Create email templates (welcome, upgrade, receipt)
- [ ] Set up Plausible analytics
- [ ] Create OG images and social previews

**Deliverable:** Landing page live with waitlist

---

## Week 3: Private Beta

### Goal: 25 real users testing the product

**Finding beta users:**
- Twitter (your account + Unserious_boy)
- Reddit (r/stocks, r/investing, r/smallbusiness)
- Friends/network who invest
- Indie Hackers community

**Beta user criteria:**
- Actually invests in stocks
- Willing to give feedback
- Mix of experience levels

**Tasks:**

- [ ] Create beta invite system
- [ ] Set up feedback channel (Slack or Discord)
- [ ] Write beta onboarding email
- [ ] Send invites (25 users)
- [ ] Create feedback form
- [ ] Schedule 1:1 calls with 5 users (optional)
- [ ] Monitor error logs (Sentry)
- [ ] Track usage patterns

**Deliverable:** 25 users actively using app

---

## Week 4: Iterate

### Goal: Fix critical issues, improve based on feedback

**Tasks:**

- [ ] Triage all beta feedback
- [ ] Fix critical bugs (priority 1)
- [ ] Implement quick wins (priority 2)
- [ ] Note future features (priority 3)
- [ ] Improve onboarding based on confusion points
- [ ] Update copy based on user language
- [ ] Optimize performance if needed
- [ ] Gather testimonials from happy users

**Deliverable:** Stable product with testimonials

---

## Week 5: Public Beta

### Goal: Open waitlist, start marketing engine

**Tasks:**

- [ ] Update landing page with testimonials
- [ ] Remove waitlist gate (open registration)
- [ ] Write launch blog post / thread
- [ ] Create social content batch (10 posts)
- [ ] Post on Twitter (main + Unserious)
- [ ] Post on Reddit (carefully, avoid spam flags)
- [ ] Submit to BetaList, Launching Next
- [ ] Reach out to finance newsletters
- [ ] Start email drip sequence for signups

**Marketing angles:**
- "The stock app for people who hate noise"
- "I built a G.R.O.W. scoring system — here's what it found"
- "Why I track 20 stocks instead of 200"

**Deliverable:** 100+ signups, 10+ paid conversions

---

## Week 6: Official Launch

### Goal: Product Hunt launch, payments flowing

**Tasks:**

- [ ] Prepare Product Hunt listing
  - [ ] Tagline
  - [ ] Description
  - [ ] Screenshots (6)
  - [ ] Video demo (optional but powerful)
  - [ ] Maker comment
- [ ] Line up hunter (or self-hunt)
- [ ] Schedule launch for Tuesday (best day)
- [ ] Coordinate Twitter/social push
- [ ] Monitor PH comments, respond quickly
- [ ] Track conversions throughout the day
- [ ] Send thank-you email to supporters

**Deliverable:** Top 10 Product Hunt, 50+ paid users

---

## Post-Launch: Month 2+

**Week 7-8: Optimize conversion**
- A/B test pricing page
- Improve free → paid funnel
- Add missing features from feedback

**Week 9-10: Content marketing**
- "How I use G.R.O.W. to find quality stocks" blog series
- Stock analysis examples
- Twitter threads breaking down real stocks

**Week 11-12: Growth experiments**
- Referral program?
- Affiliate partnerships with finance creators?
- Lifetime deal on AppSumo?

---

## Content Strategy (Faceless)

Since marketing/being the face is a blocker:

**Options:**

1. **Brand account** — Stock Watcher posts, not "Clinton posts"
2. **Threads as analysis** — "G.R.O.W. scored AAPL today: 78. Here's why..."
3. **Automated insights** — Daily AI-generated stock takes
4. **Guest posts** — Write for finance blogs, not your face
5. **YouTube without face** — Screen recordings with voiceover

The G.R.O.W. methodology IS the personality. You don't need to be.

---

## Resource Requirements

**Money:**
- FMP API: ~$30/month (growth tier)
- Supabase: Free tier initially
- Vercel: Free tier initially
- Domain: ~$15/year
- Lemonsqueezy: 5% + 50¢ per transaction

**Time:**
- Week 1-2: 15-20 hours
- Week 3-4: 10 hours (mostly monitoring)
- Week 5-6: 20 hours (launch push)

---

## Risk Mitigation

| Risk | Plan |
|------|------|
| No signups | Iterate on messaging, try different channels |
| Too many bugs | Extend beta period, don't rush |
| Data costs spike | Implement caching, rate limiting |
| Legal concerns | Add disclaimers, consult if needed |
| Burnout | Sustainable pace > sprint |

---

## Success Definition

**Minimum viable success (6 months):**
- 50 paying users
- £400+ MRR
- Positive user feedback
- Still enjoying working on it

**Stretch goal:**
- 200 paying users
- £1,500+ MRR
- Featured on a finance podcast or blog

---

## Decision Points

**At 50 users, ask:**
- Is this worth continuing?
- Should I double down or maintain?
- Any pivot signals?

**At 200 users, ask:**
- Time to hire/outsource anything?
- Mobile app worth building?
- New markets worth exploring?

---

*This roadmap is your north star. Adjust as you learn.*
