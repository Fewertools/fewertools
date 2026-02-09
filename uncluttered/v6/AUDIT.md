# Fewertools.com - Full Website Audit

**Date:** 2025-07-15
**Repo:** `/Users/clinton/clawd/uncluttered/v6`
**Total HTML files:** 106 (98 public pages + 8 internal/deliverable templates)

---

## 🔴 Critical Issues

### 1. Homepage Links to Non-Existent Use-Case URLs (8 broken links + 12 in JS)

The homepage (`index.html`) links to use-case pages using `.html` format, but the actual pages live in directories with `index.html` files.

**Broken HTML links:**
| Link on Homepage | Should Be |
|---|---|
| `./use-cases/start-youtube-channel.html` | `./use-cases/start-youtube-channel/` |
| `./use-cases/build-saas.html` | `./use-cases/build-saas/` |
| `./use-cases/start-freelancing.html` | `./use-cases/start-freelancing/` |
| `./use-cases/start-newsletter.html` | `./use-cases/start-newsletter/` |
| `./use-cases/launch-podcast.html` | `./use-cases/launch-podcast/` |
| `./use-cases/start-ecommerce.html` | `./use-cases/start-ecommerce/` |

**Broken `data-href` attributes (search tags):**
- `./use-cases/start-youtube-channel.html`
- `./use-cases/build-saas.html`
- `./use-cases/start-freelancing.html`
- `./use-cases/start-newsletter.html`

**Broken JavaScript `href` values (in useCases array, script block 3):**
All 12 use-case links in the JS search/filter system use `.html` format instead of `/` directory format:
- `./use-cases/start-youtube-channel.html` (x2 - card + JS)
- `./use-cases/launch-podcast.html`
- `./use-cases/start-freelancing.html`
- `./use-cases/build-saas.html`
- `./use-cases/start-newsletter.html`
- `./use-cases/start-ecommerce.html`
- `./use-cases/youtube-automation.html`
- `./use-cases/affiliate-marketing.html`
- `./use-cases/personal-brand.html`
- `./use-cases/sell-digital-products.html`
- `./use-cases/content-agency.html`
- `./use-cases/launch-mobile-app.html`

**Impact:** These are the most prominent links on the homepage. Clicking any use-case card or search result leads to a 404. This is the single highest-priority fix.

**Note:** Vercel's routing may handle `.html` -> `/` redirects, but this should not be relied upon. The links should match the actual file structure.

---

## 🟡 Warning Issues

### 2. Inconsistent Navigation (4 different nav patterns)

**Majority pattern (94 pages):** `Stacks | Tools | Compare | Students 🎓 | Hidden Gems 💎 | Blog | [Find your stack]`

**Deviations:**

| Page | Nav Pattern | Issue |
|---|---|---|
| `index.html` | Adds `Jobs 💼` + CTA says "🤖 Build your stack" | Homepage has extra Jobs link and different CTA text vs rest of site |
| `use-cases/affiliate-marketing/index.html` | Missing `Blog` link | Has only 6 nav items instead of 7 |
| `stacks/building-guide.html` | Nav contains anchor links (#nextjs, #supabase, etc.) | Completely different nav structure (tutorial TOC, not site nav) |
| 9 pages (build/, og-image, deliverables/*) | No nav at all | Internal/utility pages - acceptable |

### 3. Highly Inconsistent Footers (20+ different patterns)

There are **20 distinct footer patterns** across the site. Major groups:

| Pattern | Count | Pages |
|---|---|---|
| Students 🎓 \| All Tools \| Stages \| Workflows \| Contact | 34 | Compare pages, most content pages |
| Jobs \| All Tools \| Stages \| Workflows \| Contact | 20 | Job path pages |
| Philosophy \| All Tools \| Stages \| Workflows \| Contact | 16 | Homepage, blog, use-cases |
| Students 🎓 \| All Tools \| Stacks \| Workflows \| Contact | 5 | Jobs index, stacks/building, students |
| Home \| Workflows \| Tools \| Compare \| Contact | 4 | Some workflow pages |
| Home \| Products \| Stacks \| Students 🎓 \| Workflows \| Contact | 3 | Product pages |
| Home \| All Stacks \| Students 🎓 \| Workflows \| Contact | 3 | Stack detail pages |
| No footer | 7 | Deliverable templates, og-image |
| 12 other unique patterns | 1-2 each | Various pages |

**Recommendation:** Standardize to one footer pattern across all public pages.

### 4. Missing Workflows Link in Footer

- **`ai-use-guide/index.html`** - Footer has `Students | All Tools | Stages | Contact` but **no Workflows link**

### 5. Orphaned Pages (not linked from anywhere on the site)

| Page | Notes |
|---|---|
| `contact/index.html` | Has a contact form, but no page links to it (footer uses `mailto:` instead) |
| `og-image.html` | OG image generator template - internal use only, acceptable |
| `products/deliverables/*.html` (6 files) | PDF generation templates - internal use only, acceptable |

**`contact/index.html`** is the real concern - it exists, is in the sitemap, but is completely unreachable from any page on the site.

### 6. Sitemap Missing 47 Pages

The sitemap has 51 URLs but the site has 98+ public pages. Missing pages:

- **`build/`** - The AI stack builder page
- **15 compare pages** (beehiiv-vs-substack, claude-vs-chatgpt, clerk-vs-auth0, cloudflare-vs-aws, descript-vs-premiere, figma-vs-canva, ghost-vs-wordpress, hono-vs-express, linear-vs-jira, neon-vs-planetscale, notion-vs-obsidian, resend-vs-sendgrid, shopify-vs-gumroad, tailwind-vs-bootstrap)
- **`jobs/`** and all 21 job path pages
- **`students/paths/`** and all 10 student path pages

### 7. SEO - Missing OG Tags

**Missing both og:title and og:description (6 pages):**
- `stacks/building-guide.html`
- `stacks/building.html`
- `tools/index.html`
- All 6 workflow detail pages

**Missing og:description only (9 pages):**
- `use-cases/affiliate-marketing/index.html`
- `use-cases/build-saas/index.html`
- `use-cases/content-agency/index.html`
- `use-cases/launch-mobile-app/index.html`
- `use-cases/personal-brand/index.html`
- `use-cases/sell-digital-products/index.html`
- `use-cases/start-ecommerce/index.html`
- `use-cases/start-newsletter/index.html`
- `use-cases/youtube-automation/index.html`

### 8. Jobs Section Only Accessible from Homepage Nav

The `Jobs 💼` nav link only appears on the homepage. Once a user navigates to any other page, there's no way to get back to the Jobs section from the nav. The jobs pages themselves have their own internal navigation but rely on footer links.

---

## 🟢 Minor Issues

### 9. Nav CTA Text Inconsistency

- **95 pages:** "Find your stack" (links to `/stages/`)
- **1 page (homepage):** "🤖 Build your stack" (links to `/build/`)

These are different pages with different purposes. Consider whether this is intentional or should be unified.

### 10. Header Brand Text Inconsistency

- **97 pages:** Logo text is "fewertools" (lowercase)
- **2 pages:** `stacks/building-guide.html` and `stacks/building.html` use "Fewer Tools" (title case)

### 11. Excessive Inline Styles

Several pages have heavy inline styling that could be moved to stylesheets:

| Page | Inline `style=` count |
|---|---|
| `index.html` | 57 |
| `stacks/growing.html` | 49 |
| `products/deliverables/product-images.html` | 45 |
| `stacks/building.html` | 31 |
| `stacks/simplifying.html` | 31 |
| `gems/index.html` | 24 |
| `workflows/index.html` | 21 |

### 12. `stacks/building-guide.html` Uses Tutorial-Style Nav

This page replaces the standard site navigation with in-page anchor links (#nextjs, #supabase, #stripe, etc.). Users on this page have no way to navigate back to other sections of the site via the nav bar (they can only use the footer or browser back button).

### 13. `build/index.html` and `students/quiz/index.html` Have Template Literals in HTML Context

Both pages use `${tool.url}`, `${tool.name}`, etc. in their HTML. These are actually JavaScript template literals inside `<script>` blocks and work correctly at runtime, but they show up as potential issues in static analysis. **Not a real bug** - just noting for completeness.

### 14. Products Section Discoverability

Product pages (`/products/`) are not in the main nav. They're accessible from:
- Products index page (from footer on some pages)
- Individual stack detail pages (building, growing, simplifying, starting)

Consider whether products deserve a nav link.

### 15. No Em Dashes Found ✅

All em dashes have been successfully replaced. None remaining in any HTML file.

### 16. No TODO/FIXME Comments Found ✅

No placeholder text, lorem ipsum, or TODO comments in any HTML file.

### 17. All Canonical URLs Correct ✅

Every page with a canonical URL has the correct corresponding URL.

### 18. All Viewport Meta Tags Present ✅

All public pages have proper viewport meta tags. Only the internal deliverable templates and og-image.html are missing them (acceptable).

---

## Summary

| Severity | Count | Top Priority |
|---|---|---|
| 🔴 Critical | 1 issue (20+ broken links) | Fix homepage use-case links (`.html` -> `/`) |
| 🟡 Warning | 7 issues | Standardize footers, update sitemap, fix orphaned contact page |
| 🟢 Minor | 10 issues | Nav/brand consistency, inline styles |

### Recommended Fix Order

1. **Homepage use-case links** - Change all `./use-cases/X.html` to `./use-cases/X/` in both HTML and JavaScript
2. **ai-use-guide footer** - Add Workflows link
3. **affiliate-marketing nav** - Add missing Blog link
4. **Contact page** - Either link to it from footer (replace mailto) or remove from sitemap
5. **Sitemap** - Add missing 47 pages (especially jobs, student paths, remaining compare pages)
6. **Footer standardization** - Pick one pattern and apply to all pages
7. **OG tags** - Add missing og:title/og:description to 15 pages
8. **building-guide.html nav** - Add standard site nav above the tutorial nav
