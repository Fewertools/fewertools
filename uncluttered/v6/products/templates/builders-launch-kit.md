# The Builder's Launch Kit

> From code to customers. Ship fast, ship right, ship once.

---

## 🏃 Sprint Planning Board

### Current Sprint
| Field | Details |
|-------|---------|
| **Sprint #** | |
| **Start Date** | |
| **End Date** | |
| **Sprint Goal** | |
| **Demo Date** | |

### Sprint Backlog

| # | Task | Type | Priority | Est. Hours | Assigned | Status | Notes |
|---|------|------|----------|-----------|----------|--------|-------|
| 1 | | 🔨 Feature / 🐛 Bug / 🔧 Chore | P0-P3 | | | ⬜ Todo / 🔄 In Progress / ✅ Done | |
| 2 | | | | | | | |
| 3 | | | | | | | |
| 4 | | | | | | | |
| 5 | | | | | | | |

### Sprint Velocity Tracker
| Sprint | Planned Points | Completed Points | Velocity | Notes |
|--------|---------------|-----------------|----------|-------|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

### Sprint Retro Template
**What went well:**
- 

**What didn't go well:**
- 

**What to change next sprint:**
- 

---

## 🚀 Deployment Checklist

### Pre-Launch (1 week before)
- [ ] All core features working and tested
- [ ] Error tracking set up (Sentry)
- [ ] Analytics installed and firing events
- [ ] Environment variables secured (no hardcoded secrets)
- [ ] Domain configured and SSL active
- [ ] SEO basics: title tags, meta descriptions, OG images
- [ ] Favicon and app icons set
- [ ] Loading states for all async operations
- [ ] 404 page created
- [ ] Legal pages: Privacy Policy, Terms of Service

### Performance
- [ ] Lighthouse score > 90 (Performance)
- [ ] Lighthouse score > 90 (Accessibility)
- [ ] Images optimized (WebP, lazy loading)
- [ ] Fonts preloaded
- [ ] Bundle size checked (< 200KB initial JS)
- [ ] Core Web Vitals passing (LCP < 2.5s, FID < 100ms, CLS < 0.1)

### Security
- [ ] Authentication working (sign up, login, logout, password reset)
- [ ] API routes protected (auth middleware)
- [ ] Rate limiting on auth endpoints
- [ ] CORS configured correctly
- [ ] Input validation on all forms
- [ ] SQL injection / XSS protections verified
- [ ] Secrets in environment variables (not in code)
- [ ] Database backups configured

### Payment (if applicable)
- [ ] Stripe integration tested with test keys
- [ ] Webhook handling verified
- [ ] Subscription creation flow works
- [ ] Cancellation flow works
- [ ] Invoice/receipt emails sending
- [ ] Switched to live Stripe keys
- [ ] Tax handling configured

### Launch Day
- [ ] DNS propagated (check with `dig`)
- [ ] Monitoring alerts configured
- [ ] Error notification channel set up (Slack/Discord/email)
- [ ] Backup plan documented (rollback procedure)
- [ ] Launch announcement ready (social, email, Product Hunt?)
- [ ] Support channels active (email, chat)

### Post-Launch (first 48 hours)
- [ ] Monitor error rates
- [ ] Check server logs for issues
- [ ] Respond to first user feedback
- [ ] Fix critical bugs immediately
- [ ] Screenshot and celebrate 🎉

---

## 🐛 Bug Tracker

### Active Bugs

| ID | Title | Severity | Steps to Reproduce | Expected | Actual | Status | Assigned | Date Found |
|----|-------|----------|-----------------------|----------|--------|--------|----------|------------|
| B-001 | | 🔴 Critical / 🟠 High / 🟡 Medium / 🟢 Low | | | | Open / In Progress / Fixed / Won't Fix | | |
| B-002 | | | | | | | | |
| B-003 | | | | | | | | |

### Severity Guide
- 🔴 **Critical:** App is down, data loss, security vulnerability. Fix immediately.
- 🟠 **High:** Core feature broken, affects many users. Fix within 24 hours.
- 🟡 **Medium:** Feature partially broken, workaround exists. Fix this sprint.
- 🟢 **Low:** Cosmetic issue, edge case. Fix when convenient.

### Bug Triage Questions
1. Can users still accomplish their core task?
2. How many users are affected?
3. Is there a workaround?
4. Is data being lost or corrupted?
5. Is this a security issue?

---

## 🗄 Database Schema Planner

### Tables / Collections

#### Users
| Column | Type | Constraints | Notes |
|--------|------|------------|-------|
| id | UUID | PK, auto-generated | |
| email | VARCHAR(255) | UNIQUE, NOT NULL | |
| name | VARCHAR(255) | | |
| avatar_url | TEXT | | |
| plan | ENUM | DEFAULT 'free' | free, pro, team |
| created_at | TIMESTAMP | DEFAULT now() | |
| updated_at | TIMESTAMP | | Auto-update on change |

#### [Your Main Entity]
| Column | Type | Constraints | Notes |
|--------|------|------------|-------|
| id | UUID | PK, auto-generated | |
| user_id | UUID | FK → users.id | |
| title | VARCHAR(255) | NOT NULL | |
| description | TEXT | | |
| status | ENUM | DEFAULT 'draft' | |
| created_at | TIMESTAMP | DEFAULT now() | |
| updated_at | TIMESTAMP | | |

#### [Related Entity]
| Column | Type | Constraints | Notes |
|--------|------|------------|-------|
| id | UUID | PK | |
| [parent]_id | UUID | FK → [parent].id | ON DELETE CASCADE |
| | | | |

### Relationships
```
users ──┐
        ├── 1:many ──→ [main entity]
        │                    │
        │                    ├── 1:many ──→ [related entity]
        │                    │
        └── 1:many ──→ subscriptions
```

### Indexes
| Table | Column(s) | Type | Reason |
|-------|----------|------|--------|
| users | email | UNIQUE | Login lookups |
| [main] | user_id | INDEX | Dashboard queries |
| [main] | created_at | INDEX | Sorting |
| [main] | user_id, status | COMPOSITE | Filtered queries |

### Row-Level Security (Supabase)
```sql
-- Users can only see their own data
CREATE POLICY "Users see own data" ON [table]
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only insert their own data
CREATE POLICY "Users insert own data" ON [table]
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

---

## 🔌 API Integration Tracker

| Service | Purpose | API Key Location | Rate Limits | Status | Docs URL |
|---------|---------|-----------------|-------------|--------|----------|
| Supabase | Database + Auth | `.env.local` | Generous (free tier: 500MB, 50K MAU) | | [docs](https://supabase.com/docs) |
| Stripe | Payments | `.env.local` | 100 req/s | | [docs](https://stripe.com/docs/api) |
| Resend | Transactional Email | `.env.local` | 100/day (free) | | [docs](https://resend.com/docs) |
| Vercel | Hosting + Edge | Auto (deployment) | 100GB bandwidth (free) | | [docs](https://vercel.com/docs) |
| | | | | | |

### Webhook Endpoints
| Source | Endpoint | Events Handled | Secret Location |
|--------|----------|---------------|----------------|
| Stripe | `/api/webhooks/stripe` | checkout.session.completed, customer.subscription.updated, customer.subscription.deleted | `.env.local` → `STRIPE_WEBHOOK_SECRET` |
| | | | |

### Environment Variables
```
# Database
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Payments
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Email
RESEND_API_KEY=

# Analytics (optional)
NEXT_PUBLIC_POSTHOG_KEY=
```

---

## 🛠 Recommended Tool Stack

| Purpose | Tool | Why |
|---------|------|-----|
| **Framework** | Next.js | Full-stack React. API routes, SSR, ISR. Industry standard. |
| **Hosting** | Vercel | Zero-config deploys, edge functions, preview URLs. |
| **Database + Auth** | Supabase | Postgres + auth + storage + realtime. One tool, not four. |
| **Payments** | Stripe | The standard. Clean API, great docs, handles everything. |
| **AI Coding** | Cursor | Write code 3-5x faster. Tab completion that actually works. |
| **Email** | Resend | Beautiful transactional emails. Simple API, React templates. |

---

*Built with fewer tools. Part of the [Fewer Tools](https://fewertools.com) building stack.*
