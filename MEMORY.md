# MEMORY.md - Long-Term Memory

*Curated memories — the stuff worth keeping.*

---

## Active Projects

### Fewertools.com 🧹
**Location:** `~/clawd/uncluttered/v6/`
**Live:** fewertools.com (Vercel, auto-deploys from GitHub main branch)
**Repo:** github.com/Fewertools/fewertools

Curated tool recommendation site. Outcome-first, not tool-first. "The right tools. Nothing else."

- **Content:** 106 HTML pages — Tools directory (172+), Compare (22), Students (10+ paths), Jobs (16 paths), Stacks, Use Cases (12+), Gems, AI Stack Builder, Blog, Workflows
- **Design:** Light (#FAFAF8), Space Grotesk + Inter, teal accent (#0D9488)
- **Known issue:** 27 pages missing mobile hamburger menu (pre-existing, different nav variants across pages)
- **TODO:** Build shared `nav.js` on a BRANCH first, test on preview URL before merging
- **Product Hunt launch:** Planned for Feb 10, 2026
- **Reddit marketing:** Active via u/Equivalent_Ad6915

**⚠️ LESSON LEARNED (2026-02-09):** Never bulk-edit nav/structure across 100+ static HTML pages live. Always branch → preview → approve → merge. The pages have 3+ different nav variants and the cascade conflicts are brutal.

### Stock Watcher App 📈
**Location:** `~/clawd/projects/stock-watcher/`

Stock monitoring app with G.R.O.W. scoring algorithm.
- Full Next.js build, 9 routes
- Go-to-market docs in `/drafts/stock-watcher-product/`
- Next: FMP API key, Supabase setup, deploy

### @Unserious_boy Growth 🐦
**Strategy:** `~/clawd/memory/unserious-boy-strategy.md`
**Viral Engine:** `~/clawd/systems/viral-engine/`
- Autonomous viral growth system
- Daily scan → analyze → generate → post → learn cycle
- Framework evolves daily based on what's working

**Cron Jobs:**
| Job | Time | Purpose |
|-----|------|---------|
| viral-scan | 6 AM | Scan viral content, update framework |
| viral-post-midday | 11 AM | Trending QT |
| viral-post-afternoon | 2 PM | Relatable content |
| viral-post-evening | 8 PM | Hot takes, peak hours |
| viral-learn | 11 PM | Analyze performance, compound learnings |

---

## Ongoing Commitments

### Family Motivation Messages 💌
**Started:** 2026-02-01

Daily motivational messages to Clinton's family iMessage group chat.

- **Family members:** Dad, Mum, Marvellous, Eric, Donald
- **Schedule:** Every morning ~7:30 AM UK (with random delay for natural feel)
- **Vibe:** Mix of spiritual wisdom + life encouragement
- **Voice:** Must sound human, like Clinton wrote it — not AI corporate speak
- **Chat ID:** 80 (iMessage group)
- **Cron job:** `family-motivation`

---

## Important Context

*(To be filled as I learn more)*

---

## Lessons Learned

*(To be filled as I make mistakes and figure things out)*
