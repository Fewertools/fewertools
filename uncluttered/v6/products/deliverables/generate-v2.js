const fs = require('fs');
const path = require('path');

const template = fs.readFileSync(path.join(__dirname, 'pdf-template.html'), 'utf8');

function buildCover(badge, title, subtitle, tools) {
  const toolsHtml = tools.map(t => `
    <div class="cover-meta-item">
      <div class="value">${t}</div>
    </div>`).join('');
  
  return `
  <div class="cover">
    <div class="cover-inner">
      <div class="cover-logo">
        <div class="mark"><span></span></div>
        <span class="name">fewertools</span>
      </div>
      <div class="cover-badge">${badge}</div>
      <h1>${title}</h1>
      <p class="subtitle">${subtitle}</p>
      <div class="cover-meta">
        ${toolsHtml}
      </div>
    </div>
  </div>`;
}

function buildTOC(sections) {
  const items = sections.map((s, i) => `
    <div class="toc-item">
      <div class="toc-number">${i + 1}</div>
      <div class="toc-text">
        <h3>${s.title}</h3>
        <p>${s.desc}</p>
      </div>
    </div>`).join('');
  
  return `
  <div class="toc">
    <h2>What's Inside</h2>
    ${items}
  </div>`;
}

function buildTable(headers, rows) {
  const th = headers.map(h => `<th>${h}</th>`).join('');
  const trs = rows.map(row => {
    const tds = row.map(c => `<td>${c}</td>`).join('');
    return `<tr>${tds}</tr>`;
  }).join('\n');
  return `<table><thead><tr>${th}</tr></thead><tbody>${trs}</tbody></table>`;
}

function buildChecklist(items) {
  const lis = items.map(item => `
    <div class="check-item">
      <div class="check-box"></div>
      <div class="check-text">${item}</div>
    </div>`).join('');
  return `<div class="check-list">${lis}</div>`;
}

function buildNumberedList(items) {
  const lis = items.map((item, i) => `
    <div class="numbered-item">
      <div class="num-circle">${i + 1}</div>
      <div class="num-text">${item}</div>
    </div>`).join('');
  return `<div class="numbered-list">${lis}</div>`;
}

function buildCallout(title, text) {
  return `<div class="callout"><div class="callout-title">${title}</div><p>${text}</p></div>`;
}

function buildToolGrid(tools) {
  const cards = tools.map(t => `
    <div class="tool-card">
      <div class="tool-purpose">${t.purpose}</div>
      <div class="tool-name">${t.name}</div>
      <div class="tool-desc">${t.desc}</div>
    </div>`).join('');
  return `<div class="tool-grid">${cards}</div>`;
}

function buildPriorityCard(cls, label, count) {
  const lines = Array(count).fill('<div class="fill-line"></div>').join('');
  return `<div class="priority-card ${cls}"><div class="priority-label">${label}</div>${lines}</div>`;
}

function buildSection(num, title, desc, content) {
  return `
  <div class="content-page">
    <div class="section-header">
      <div class="section-number">SECTION ${num}</div>
      <h2>${title}</h2>
      <div class="section-desc">${desc}</div>
    </div>
    ${content}
  </div>`;
}

function buildBackPage() {
  return `
  <div class="back-page">
    <h2>Build with fewer tools.</h2>
    <p>Curated stacks for every stage of building.</p>
    <div class="url">fewertools.com</div>
  </div>`;
}

function wrap(content) {
  return template.replace('<!-- CONTENT_PLACEHOLDER -->', content);
}

// ============================================================
// PRODUCT 1: THE STARTER'S PLAYBOOK
// ============================================================
const startersPlaybook = wrap([
  buildCover('💡 Starting Stage', "The Starter's<br>Playbook", 'From idea to validated concept. Stop guessing, start knowing.', ['Notion', 'Figma', 'Claude', 'Perplexity', 'Midjourney']),
  
  buildTOC([
    { title: 'Idea Validation Checklist', desc: '20+ questions to score your idea before building' },
    { title: 'Market Research Template', desc: 'Customer profiling, discovery questions, interview tracking' },
    { title: 'Competitor Analysis Grid', desc: 'Map competitors, find gaps, define your edge' },
    { title: 'MVP Feature Prioritizer', desc: 'Impact/effort scoring to decide what to build first' },
  ]),
  
  buildSection('01', 'Idea Validation Checklist', 'Use this before writing a single line of code. Score your idea across 4 dimensions.',
    `<h3>The Problem</h3>` +
    buildChecklist([
      'I can describe the problem in <strong>one sentence</strong>',
      "I've experienced this problem personally (or deeply understand someone who has)",
      'The problem is <strong>recurring</strong> (not a one-time annoyance)',
      'People are currently <strong>paying</strong> to solve this problem (even with bad solutions)',
      'I can name <strong>5 specific people</strong> who have this problem',
    ]) +
    `<h3>The Solution</h3>` +
    buildChecklist([
      'My solution is fundamentally different from what exists (not just "better UI")',
      'I can explain the value prop in <strong>under 10 seconds</strong>',
      'A non-technical person would understand what it does',
      'It solves a <strong>core</strong> problem, not a nice-to-have',
      'I can build a usable v1 in <strong>under 4 weeks</strong>',
    ]) +
    `<h3>The Market</h3>` +
    buildChecklist([
      'The target market has at least <strong>10,000 potential users</strong>',
      'People in this market are already spending money on tools',
      'I can reach these people through 2-3 clear channels',
      'The market is <strong>growing</strong> (not shrinking or stagnant)',
      'There\'s a clear "hair on fire" segment who need this <strong>NOW</strong>',
    ]) +
    `<h3>Personal Fit</h3>` +
    buildChecklist([
      "I'd use this product myself",
      'I can commit <strong>6+ months</strong> to this',
      'I have (or can quickly build) the skills needed for v1',
      'This aligns with where I want my career/life to go',
      "I'm excited about the <strong>problem</strong>, not just the solution",
    ]) +
    `<div class="spacer"></div>` +
    `<div class="score-box">
      <div style="font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:14px;margin-bottom:12px;">📊 Your Score</div>
      <div class="score-item"><span class="score-label">20+ checks</span> Strong signal. Move to market research.</div>
      <div class="score-item"><span class="score-label">15–19 checks</span> Promising. Dig deeper on weak areas.</div>
      <div class="score-item"><span class="score-label">10–14 checks</span> Needs work. Validate assumptions first.</div>
      <div class="score-item"><span class="score-label">Under 10</span> Reconsider or pivot the idea.</div>
    </div>`
  ),

  buildSection('02', 'Market Research Template', 'Understand your market before you build for it.',
    `<h3>Overview</h3>` +
    buildTable(
      ['Field', 'Your Answer'],
      [
        ['Market Name', ''],
        ['Date Researched', ''],
        ['Market Size (TAM)', ''],
        ['Growth Rate', ''],
        ['Key Trends', ''],
      ]
    ) +
    `<h3>Target Customer Profile</h3>` +
    buildTable(
      ['Attribute', 'Description'],
      [
        ['Who are they?', ''],
        ['Job title / role', ''],
        ['Company size', ''],
        ['Budget range', ''],
        ['Where they hang out online', ''],
        ['What they read', ''],
        ['Pain points (top 3)', ''],
        ['Current solutions they use', ''],
        ['What they wish existed', ''],
      ]
    ) +
    `<h3>Customer Discovery Questions</h3>
    <p>Use these in interviews. Aim for 10–20 conversations.</p>` +
    buildNumberedList([
      'Tell me about the <strong>last time</strong> you experienced [problem]. What happened?',
      'How are you <strong>currently solving</strong> this? Walk me through your process.',
      "What's the most <strong>frustrating part</strong> of your current approach?",
      'If you could wave a magic wand and fix <strong>one thing</strong>, what would it be?',
      'How much <strong>time</strong> do you spend on this per week?',
      'Have you tried other solutions? What did you <strong>like/dislike</strong>?',
      'Would you pay <strong>$X/month</strong> for something that [your value prop]?',
      'Who else on your team is <strong>affected</strong> by this problem?',
      'What would need to be true for you to <strong>switch</strong> from your current solution?',
      'Can I show you something I\'m working on and get your <strong>honest feedback</strong>?',
    ]) +
    `<h3>Interview Notes Log</h3>` +
    buildTable(
      ['#', 'Name', 'Date', 'Key Insights', 'Willingness to Pay', 'Follow-up?'],
      [
        ['1', '', '', '', '', ''],
        ['2', '', '', '', '', ''],
        ['3', '', '', '', '', ''],
        ['4', '', '', '', '', ''],
        ['5', '', '', '', '', ''],
      ]
    ) +
    buildCallout('💡 Tip', 'The best insights come from questions 1–3. Let people tell stories — don\'t pitch your solution until the very end.')
  ),
  
  buildSection('03', 'Competitor Analysis Grid', 'Know the landscape. Find the gaps. Own your position.',
    `<h3>Direct Competitors</h3>` +
    buildTable(
      ['Competitor', 'URL', 'Pricing', 'Strengths', 'Weaknesses', 'Market Position'],
      [
        ['', '', '', '', '', ''],
        ['', '', '', '', '', ''],
        ['', '', '', '', '', ''],
        ['', '', '', '', '', ''],
      ]
    ) +
    `<h3>Indirect Competitors &amp; Alternatives</h3>` +
    buildTable(
      ['Alternative', 'How People Use It', 'Why It Falls Short'],
      [
        ['Manual process (spreadsheets)', '', ''],
        ['', '', ''],
        ['', '', ''],
      ]
    ) +
    `<h3>Your Differentiation</h3>` +
    buildTable(
      ['Dimension', 'Them', 'You'],
      [
        ['Speed', '', ''],
        ['Price', '', ''],
        ['Simplicity', '', ''],
        ['Integration', '', ''],
        ['Support', '', ''],
        ['Unique angle', '', ''],
      ]
    ) +
    buildCallout('🎯 Key Question', 'What is the <strong>one thing</strong> you can do better than everyone else? That\'s your wedge. Everything else is noise.')
  ),
  
  buildSection('04', 'MVP Feature Prioritizer', 'Build the right things in the right order.',
    `<h3>Feature Brainstorm</h3>
    <p>List every feature, then score each one honestly.</p>` +
    buildTable(
      ['Feature', 'User Impact (1–5)', 'Build Effort (1–5)', 'Score (Impact ÷ Effort)', 'Priority'],
      [
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
      ]
    ) +
    `<h3>Priority Buckets</h3>` +
    buildPriorityCard('must-have', '🔴 Must Have (MVP) — Ship doesn\'t sail without these', 3) +
    buildPriorityCard('should-have', '🟡 Should Have (v1.1) — Important but not launch-blocking', 3) +
    buildPriorityCard('nice-have', '🟢 Nice to Have (v2+) — Delighters, not essentials', 3) +
    buildPriorityCard('wont-build', '⚪ Won\'t Build — Explicitly out of scope (for now)', 3) +
    `<h3>MVP Definition</h3>` +
    buildTable(
      ['Field', 'Your Answer'],
      [
        ['Core user flow', ''],
        ['Success metric', ''],
        ['Target launch date', ''],
        ['Maximum build time', '4 weeks'],
        ['Must support', 'Web / Mobile / Both'],
      ]
    ) +
    `<div class="spacer"></div>
    <h3>Recommended Tool Stack</h3>` +
    buildToolGrid([
      { purpose: 'Knowledge Base', name: 'Notion', desc: 'Everything in one place. Notes, docs, research, planning.' },
      { purpose: 'Design', name: 'Figma', desc: 'Validate ideas visually before building. Share with users.' },
      { purpose: 'AI Partner', name: 'Claude', desc: 'Brainstorm, analyze, write copy, plan strategy.' },
      { purpose: 'Research', name: 'Perplexity', desc: 'Fast, sourced research without drowning in tabs.' },
      { purpose: 'Visual Assets', name: 'Midjourney', desc: 'Landing page visuals, social content, pitch deck imagery.' },
    ])
  ),
  
  buildBackPage(),
].join('\n'));


// ============================================================
// PRODUCT 2: THE BUILDER'S LAUNCH KIT
// ============================================================
const buildersKit = wrap([
  buildCover('🔨 Building Stage', "The Builder's<br>Launch Kit", 'From code to customers. Ship fast, ship right, ship once.', ['Next.js', 'Vercel', 'Supabase', 'Stripe', 'Cursor', 'Resend']),
  
  buildTOC([
    { title: 'Sprint Planning Board', desc: 'Organize work into focused sprints with velocity tracking' },
    { title: 'Deployment Checklist', desc: 'Never miss a step when shipping to production' },
    { title: 'Bug Tracker', desc: 'Severity-based tracking with triage framework' },
    { title: 'Database Schema Planner', desc: 'Plan your data model before writing migrations' },
    { title: 'API Integration Tracker', desc: 'One source of truth for every service you depend on' },
  ]),
  
  buildSection('01', 'Sprint Planning Board', 'Organize your work. Move fast without losing track.',
    `<h3>Current Sprint</h3>` +
    buildTable(
      ['Field', 'Details'],
      [['Sprint #', ''], ['Start Date', ''], ['End Date', ''], ['Sprint Goal', ''], ['Demo Date', '']]
    ) +
    `<h3>Sprint Backlog</h3>` +
    buildTable(
      ['#', 'Task', 'Type', 'Priority', 'Est. Hours', 'Status'],
      [
        ['1', '', '🔨 Feature', 'P0', '', '⬜ Todo'],
        ['2', '', '🐛 Bug', 'P1', '', '⬜ Todo'],
        ['3', '', '🔧 Chore', 'P2', '', '⬜ Todo'],
        ['4', '', '', '', '', ''],
        ['5', '', '', '', '', ''],
        ['6', '', '', '', '', ''],
        ['7', '', '', '', '', ''],
        ['8', '', '', '', '', ''],
      ]
    ) +
    `<h3>Sprint Velocity</h3>` +
    buildTable(
      ['Sprint', 'Planned Points', 'Completed', 'Velocity', 'Notes'],
      [['1','','','',''], ['2','','','',''], ['3','','','',''], ['4','','','','']]
    ) +
    `<h3>Sprint Retro</h3>` +
    `<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;">
      <div class="priority-card nice-have"><div class="priority-label">✅ What went well</div><div class="fill-line"></div><div class="fill-line"></div><div class="fill-line"></div></div>
      <div class="priority-card must-have"><div class="priority-label">❌ What didn't</div><div class="fill-line"></div><div class="fill-line"></div><div class="fill-line"></div></div>
      <div class="priority-card should-have"><div class="priority-label">🔄 Change next time</div><div class="fill-line"></div><div class="fill-line"></div><div class="fill-line"></div></div>
    </div>`
  ),

  buildSection('02', 'Deployment Checklist', 'Ship with confidence. Every time.',
    `<h3>Pre-Launch (1 week before)</h3>` +
    buildChecklist([
      'All core features working and tested',
      'Error tracking set up (Sentry)',
      'Analytics installed and firing events',
      'Environment variables secured (no hardcoded secrets)',
      'Domain configured and SSL active',
      'SEO basics: title tags, meta descriptions, OG images',
      'Favicon and app icons set',
      'Loading states for all async operations',
      '404 page created',
      'Legal pages: Privacy Policy, Terms of Service',
    ]) +
    `<h3>Performance</h3>` +
    buildChecklist([
      'Lighthouse score > 90 (Performance)',
      'Lighthouse score > 90 (Accessibility)',
      'Images optimized (WebP, lazy loading)',
      'Fonts preloaded',
      'Bundle size < 200KB initial JS',
      'Core Web Vitals passing (LCP < 2.5s, FID < 100ms, CLS < 0.1)',
    ]) +
    `<h3>Security</h3>` +
    buildChecklist([
      'Authentication working (sign up, login, logout, reset)',
      'API routes protected (auth middleware)',
      'Rate limiting on auth endpoints',
      'CORS configured correctly',
      'Input validation on all forms',
      'SQL injection / XSS protections verified',
      'Secrets in environment variables (not in code)',
      'Database backups configured',
    ]) +
    `<h3>Payment (if applicable)</h3>` +
    buildChecklist([
      'Stripe integration tested with test keys',
      'Webhook handling verified',
      'Subscription creation flow works',
      'Cancellation flow works',
      'Invoice/receipt emails sending',
      'Switched to live Stripe keys',
    ]) +
    `<h3>Launch Day</h3>` +
    buildChecklist([
      'DNS propagated (check with dig)',
      'Monitoring alerts configured',
      'Error notification channel set up',
      'Backup plan documented (rollback procedure)',
      'Launch announcement ready',
      'Support channels active',
    ]) +
    buildCallout('🚀 Post-Launch', 'Monitor error rates for 48 hours. Respond to first user feedback immediately. Fix critical bugs same-day. Then celebrate — you shipped. 🎉')
  ),
  
  buildSection('03', 'Bug Tracker', 'Know what\'s critical, what can wait, and what to ignore.',
    `<h3>Active Bugs</h3>` +
    buildTable(
      ['ID', 'Title', 'Severity', 'Steps to Reproduce', 'Status', 'Assigned'],
      [
        ['B-001', '', '🔴 Critical', '', 'Open', ''],
        ['B-002', '', '🟠 High', '', 'Open', ''],
        ['B-003', '', '🟡 Medium', '', 'Open', ''],
        ['B-004', '', '🟢 Low', '', 'Open', ''],
        ['B-005', '', '', '', '', ''],
        ['B-006', '', '', '', '', ''],
      ]
    ) +
    `<h3>Severity Guide</h3>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
      <div class="priority-card must-have"><div class="priority-label">🔴 Critical</div><p style="font-size:11px;color:#666;">App down, data loss, security vulnerability.<br><strong>Fix immediately.</strong></p></div>
      <div class="priority-card should-have"><div class="priority-label">🟠 High</div><p style="font-size:11px;color:#666;">Core feature broken, many users affected.<br><strong>Fix within 24 hours.</strong></p></div>
      <div class="priority-card nice-have"><div class="priority-label">🟡 Medium</div><p style="font-size:11px;color:#666;">Feature partially broken, workaround exists.<br><strong>Fix this sprint.</strong></p></div>
      <div class="priority-card wont-build"><div class="priority-label">🟢 Low</div><p style="font-size:11px;color:#666;">Cosmetic issue, edge case.<br><strong>Fix when convenient.</strong></p></div>
    </div>` +
    `<h3>Bug Triage Questions</h3>` +
    buildNumberedList([
      'Can users still accomplish their <strong>core task</strong>?',
      'How many users are <strong>affected</strong>?',
      'Is there a <strong>workaround</strong>?',
      'Is data being <strong>lost or corrupted</strong>?',
      'Is this a <strong>security</strong> issue?',
    ])
  ),
  
  buildSection('04', 'Database Schema Planner', 'Plan your data model before writing migrations.',
    `<h3>Users Table</h3>` +
    buildTable(
      ['Column', 'Type', 'Constraints', 'Notes'],
      [
        ['id', 'UUID', 'PK, auto-generated', ''],
        ['email', 'VARCHAR(255)', 'UNIQUE, NOT NULL', ''],
        ['name', 'VARCHAR(255)', '', ''],
        ['avatar_url', 'TEXT', '', ''],
        ['plan', 'ENUM', "DEFAULT 'free'", 'free, pro, team'],
        ['created_at', 'TIMESTAMP', 'DEFAULT now()', ''],
        ['updated_at', 'TIMESTAMP', '', 'Auto-update'],
      ]
    ) +
    `<h3>Your Main Entity</h3>` +
    buildTable(
      ['Column', 'Type', 'Constraints', 'Notes'],
      [
        ['id', 'UUID', 'PK', ''],
        ['user_id', 'UUID', 'FK → users.id', ''],
        ['title', 'VARCHAR(255)', 'NOT NULL', ''],
        ['description', 'TEXT', '', ''],
        ['status', 'ENUM', "DEFAULT 'draft'", ''],
        ['created_at', 'TIMESTAMP', 'DEFAULT now()', ''],
        ['', '', '', ''],
        ['', '', '', ''],
      ]
    ) +
    `<h3>Row-Level Security (Supabase)</h3>
    <pre><code>-- Users can only see their own data
CREATE POLICY "Users see own data" ON [table]
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only insert their own data  
CREATE POLICY "Users insert own data" ON [table]
  FOR INSERT WITH CHECK (auth.uid() = user_id);</code></pre>` +
    `<h3>Indexes</h3>` +
    buildTable(
      ['Table', 'Column(s)', 'Type', 'Reason'],
      [
        ['users', 'email', 'UNIQUE', 'Login lookups'],
        ['[main]', 'user_id', 'INDEX', 'Dashboard queries'],
        ['[main]', 'created_at', 'INDEX', 'Sorting'],
        ['[main]', 'user_id, status', 'COMPOSITE', 'Filtered queries'],
      ]
    )
  ),
  
  buildSection('05', 'API Integration Tracker', 'One source of truth for every external service.',
    `<h3>Services</h3>` +
    buildTable(
      ['Service', 'Purpose', 'API Key Location', 'Rate Limits', 'Status'],
      [
        ['Supabase', 'Database + Auth', '.env.local', '500MB, 50K MAU (free)', ''],
        ['Stripe', 'Payments', '.env.local', '100 req/s', ''],
        ['Resend', 'Email', '.env.local', '100/day (free)', ''],
        ['Vercel', 'Hosting', 'Auto', '100GB bandwidth (free)', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
      ]
    ) +
    `<h3>Webhook Endpoints</h3>` +
    buildTable(
      ['Source', 'Endpoint', 'Events Handled', 'Secret Location'],
      [
        ['Stripe', '/api/webhooks/stripe', 'checkout.completed, subscription.updated, subscription.deleted', 'STRIPE_WEBHOOK_SECRET'],
        ['', '', '', ''],
      ]
    ) +
    `<h3>Environment Variables</h3>
    <pre><code># Database
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Payments
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Email
RESEND_API_KEY=

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=</code></pre>` +
    `<div class="spacer"></div>
    <h3>Recommended Tool Stack</h3>` +
    buildToolGrid([
      { purpose: 'Framework', name: 'Next.js', desc: 'Full-stack React. API routes, SSR, ISR.' },
      { purpose: 'Hosting', name: 'Vercel', desc: 'Zero-config deploys, edge functions, preview URLs.' },
      { purpose: 'Database + Auth', name: 'Supabase', desc: 'Postgres + auth + storage + realtime.' },
      { purpose: 'Payments', name: 'Stripe', desc: 'The standard. Clean API, handles everything.' },
      { purpose: 'AI Coding', name: 'Cursor', desc: 'Write code 3-5x faster. Tab completion that works.' },
      { purpose: 'Email', name: 'Resend', desc: 'Beautiful transactional emails. React templates.' },
    ])
  ),
  
  buildBackPage(),
].join('\n'));


// ============================================================
// PRODUCT 3: THE GROWTH DASHBOARD
// ============================================================
const growthDashboard = wrap([
  buildCover('📈 Growing Stage', 'The Growth<br>Dashboard', 'Measure what matters. Ignore the rest. Scale with clarity.', ['PostHog', 'Intercom', 'Sentry', 'Metabase', 'Loops']),
  
  buildTOC([
    { title: 'KPI Tracker', desc: 'North Star metric, weekly dashboards, revenue breakdowns' },
    { title: 'User Feedback Log', desc: 'Centralized inbox with categorization and sentiment' },
    { title: 'Funnel Metrics (AARRR)', desc: 'Track every stage of your user journey' },
    { title: 'Experiment Tracker', desc: 'Hypothesis-driven A/B testing with result logging' },
    { title: 'Customer Health Scorecard', desc: 'Spot churn before it happens' },
  ]),
  
  buildSection('01', 'KPI Tracker', 'Define your North Star. Track what actually moves the needle.',
    `<h3>North Star Metric</h3>` +
    buildTable(
      ['Field', 'Your Answer'],
      [['Metric', ''], ['Current Value', ''], ['Target (30 days)', ''], ['Target (90 days)', ''], ['How it\'s measured', ''], ['Why this metric', '']]
    ) +
    `<h3>Weekly Dashboard</h3>` +
    buildTable(
      ['Metric', 'This Week', 'Last Week', 'Δ Change', 'Target', 'Status'],
      [
        ['<strong>Revenue (MRR)</strong>', '', '', '', '', '🟢 🟡 🔴'],
        ['New Signups', '', '', '', '', ''],
        ['Active Users (WAU)', '', '', '', '', ''],
        ['Churn Rate', '', '', '', '', ''],
        ['Activation Rate', '', '', '', '', ''],
        ['NPS Score', '', '', '', '', ''],
        ['Support Tickets', '', '', '', '', ''],
        ['Avg. Response Time', '', '', '', '', ''],
      ]
    ) +
    `<h3>Monthly Revenue</h3>` +
    buildTable(
      ['Month', 'MRR', 'New MRR', 'Churned MRR', 'Net New', 'Customers', 'ARPU'],
      [['','','','','','',''],['','','','','','',''],['','','','','','',''],['','','','','','',''],['','','','','','',''],['','','','','','','']]
    ) +
    `<h3>Cohort Retention</h3>` +
    buildTable(
      ['Cohort', 'Week 0', 'Week 1', 'Week 2', 'Week 4', 'Week 8', 'Week 12'],
      [['', '100%','','','','',''],['', '100%','','','','',''],['', '100%','','','','',''],['', '100%','','','','','']]
    ) +
    buildCallout('📊 Focus', 'If you can only track one number, track <strong>Net Revenue Retention</strong>. It tells you if your existing customers are getting more value over time.')
  ),
  
  buildSection('02', 'User Feedback Log', 'Never lose a user insight. Centralize everything here.',
    `<h3>Feedback Inbox</h3>` +
    buildTable(
      ['#', 'Date', 'User', 'Channel', 'Feedback', 'Category', 'Sentiment', 'Status'],
      [
        ['1', '', '', 'Email', '', 'Feature Request', '😀', 'Open'],
        ['2', '', '', 'Chat', '', 'Bug', '😐', 'Open'],
        ['3', '', '', 'Twitter', '', 'Praise', '😀', 'Open'],
        ['4', '', '', '', '', '', '', ''],
        ['5', '', '', '', '', '', '', ''],
        ['6', '', '', '', '', '', '', ''],
        ['7', '', '', '', '', '', '', ''],
        ['8', '', '', '', '', '', '', ''],
      ]
    ) +
    `<h3>Top Requested Features</h3>` +
    buildTable(
      ['Feature', '# Requests', 'Revenue Impact', 'Effort', 'Decision'],
      [['','','','','Build / Defer / Decline'],['','','','',''],['','','','',''],['','','','',''],['','','','','']]
    ) +
    `<h3>User Quotes Worth Remembering</h3>
    <blockquote>"<em>[Exact quote from user]</em>" — Name, Date</blockquote>
    <div class="fill-block"></div>
    <div class="fill-block"></div>` +
    buildCallout('💡 Tip', 'Review this log weekly. Patterns emerge after 10+ entries. One complaint is an anecdote — five complaints about the same thing is a feature.')
  ),
  
  buildSection('03', 'Funnel Metrics (AARRR)', 'Track every stage of your user journey.',
    `<h3>Acquisition — How do users find you?</h3>` +
    buildTable(
      ['Channel', 'Visitors', 'Signups', 'Conversion', 'CAC', 'Notes'],
      [['Organic Search','','','','',''], ['Twitter/X','','','','',''], ['Product Hunt','','','','',''], ['Referral','','','','',''], ['Direct','','','','',''], ['Paid Ads','','','','',''], ['<strong>Total</strong>','','','','','']]
    ) +
    `<h3>Activation — Do they have an "aha" moment?</h3>` +
    buildTable(
      ['Step', 'Users', 'Drop-off %', 'Notes'],
      [['Signed up', '', '—', ''], ['Completed onboarding', '', '', ''], ['Performed core action', '', '', ''], ['Invited teammate', '', '', ''], ['<strong>Activation rate</strong>', '', '', 'Target: 40%+']]
    ) +
    `<h3>Retention — Do they come back?</h3>` +
    buildTable(
      ['Timeframe', 'Retention Rate', 'Target', 'Status'],
      [['Day 1', '', '60%', ''], ['Day 7', '', '30%', ''], ['Day 30', '', '15%', ''], ['Day 90', '', '10%', '']]
    ) +
    `<h3>Revenue — Do they pay?</h3>` +
    buildTable(
      ['Metric', 'Value', 'Target'],
      [['Trial → Paid conversion', '', '5–10%'], ['Free → Paid conversion', '', '2–5%'], ['Average Revenue Per User', '', ''], ['Lifetime Value (LTV)', '', ''], ['LTV:CAC Ratio', '', '>3:1']]
    ) +
    `<h3>Referral — Do they tell others?</h3>` +
    buildTable(
      ['Metric', 'Value', 'Target'],
      [['Referral rate', '', '10%+'], ['Viral coefficient (K)', '', '>0.5'], ['Avg. referrals per user', '', '']]
    )
  ),
  
  buildSection('04', 'Experiment Tracker', 'Test hypotheses, not hunches. Run experiments properly.',
    `<h3>Active Experiments</h3>` +
    buildTable(
      ['ID', 'Name', 'Hypothesis', 'Primary Metric', 'Start', 'End', 'Result'],
      [['EXP-001','','If we [change], then [metric] will [improve] because [reason]','','','',''], ['EXP-002','','','','','',''], ['EXP-003','','','','','','']]
    ) +
    `<h3>Experiment Template</h3>` +
    buildTable(
      ['Field', 'Details'],
      [['Hypothesis', 'If we [do X], then [metric Y] will [change Z] because [reason]'], ['Primary Metric', ''], ['Secondary Metrics', ''], ['Traffic Split', '50/50'], ['Min. Sample Size', ''], ['Duration', ''], ['Confidence Level', '95%']]
    ) +
    `<h3>Results Log</h3>` +
    buildTable(
      ['Metric', 'Control', 'Variant', 'Δ', 'Confidence', 'Winner'],
      [['','','','','',''], ['','','','','','']]
    ) +
    `<h3>Experiment Backlog</h3>` +
    buildTable(
      ['Priority', 'Experiment', 'Expected Impact', 'Effort', 'Status'],
      [['1','','','','Queued'], ['2','','','',''], ['3','','','',''], ['4','','','',''], ['5','','','','']]
    ) +
    buildCallout('🧪 Rule of Thumb', 'Run one experiment at a time. Minimum 2 weeks per test. If you can\'t reach statistical significance, the difference probably doesn\'t matter.')
  ),
  
  buildSection('05', 'Customer Health Scorecard', 'Spot churn before it happens. Rescue at-risk customers.',
    `<h3>Health Score Components</h3>` +
    buildTable(
      ['Factor', 'Weight', 'Scoring (1–10)'],
      [
        ['<strong>Usage Frequency</strong>', '30%', 'Daily=10, Weekly=7, Monthly=4, Rare=1'],
        ['<strong>Feature Adoption</strong>', '20%', '80%+ features=10, 50%+=7, Core only=4, Minimal=1'],
        ['<strong>Support Interactions</strong>', '15%', 'Positive=10, Neutral=5, Frequent complaints=2'],
        ['<strong>Growth Signal</strong>', '15%', 'Added seats=10, Upgraded=8, Static=5, Downgraded=2'],
        ['<strong>Engagement Trend</strong>', '10%', 'Increasing=10, Stable=6, Declining=2'],
        ['<strong>Payment Health</strong>', '10%', 'On time=10, Late once=5, Multiple failures=1'],
      ]
    ) +
    `<h3>Customer Dashboard</h3>` +
    buildTable(
      ['Customer', 'Plan', 'MRR', 'Score', 'Health'],
      [['','','','  /100','🟢 🟡 🔴'],['','','','  /100',''],['','','','  /100',''],['','','','  /100',''],['','','','  /100','']]
    ) +
    `<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-top:20px;">
      <div class="priority-card nice-have"><div class="priority-label">🟢 Healthy (70–100)</div><p style="font-size:11px;color:#666;">Candidate for upsell, case study, referral ask.</p></div>
      <div class="priority-card should-have"><div class="priority-label">🟡 At Risk (40–69)</div><p style="font-size:11px;color:#666;">Schedule check-in. Investigate usage drop.</p></div>
      <div class="priority-card must-have"><div class="priority-label">🔴 Critical (0–39)</div><p style="font-size:11px;color:#666;">Immediate outreach. Offer help or discount.</p></div>
    </div>` +
    `<h3>Churn Risk Signals</h3>` +
    buildChecklist([
      'Login frequency dropped >50% in last 30 days',
      'Key feature usage stopped',
      'Support ticket with negative sentiment',
      'Downgraded plan',
      'Payment failed 2+ times',
      'Competitor mentioned in support conversation',
      'Asked about data export or cancellation',
    ]) +
    `<div class="spacer"></div>
    <h3>Recommended Tool Stack</h3>` +
    buildToolGrid([
      { purpose: 'Product Analytics', name: 'PostHog', desc: 'Feature flags, session replays, funnels. All-in-one.' },
      { purpose: 'Customer Messaging', name: 'Intercom', desc: 'In-app messages, support, onboarding flows.' },
      { purpose: 'Error Monitoring', name: 'Sentry', desc: 'Know about bugs before users report them.' },
      { purpose: 'Business Analytics', name: 'Metabase', desc: 'SQL dashboards anyone on the team can read.' },
      { purpose: 'Email Marketing', name: 'Loops', desc: 'Event-triggered emails that actually convert.' },
    ])
  ),
  
  buildBackPage(),
].join('\n'));


// ============================================================
// PRODUCT 4: THE SIMPLIFIER'S AUDIT
// ============================================================
const simplifiersAudit = wrap([
  buildCover('✂️ Simplifying Stage', "The Simplifier's<br>Audit", 'Cut the bloat. Keep what works. Save thousands.', ['Notion', 'Linear', 'Zapier', 'Slack', '1Password']),
  
  buildTOC([
    { title: 'Tool Inventory', desc: 'Audit every subscription, tool, and service you\'re paying for' },
    { title: 'Cost Calculator', desc: 'What you\'re paying vs. what you actually need' },
    { title: 'Migration Planner', desc: 'Phased plan to consolidate without breaking things' },
    { title: 'Decision Matrix', desc: 'Weighted framework: keep, cut, replace, or downgrade' },
  ]),
  
  buildSection('01', 'Tool Inventory', 'List everything. Be ruthless — include every subscription.',
    `<h3>Complete Tool Audit</h3>` +
    buildTable(
      ['#', 'Tool', 'Category', 'Monthly $', 'Annual $', 'Users', 'Last Used', 'Essential?'],
      [
        ['1','','Dev / Design / Mktg / Analytics / Comms / PM / Finance','','','','','✅ ⚠️ ❌'],
        ['2','','','','','','',''],
        ['3','','','','','','',''],
        ['4','','','','','','',''],
        ['5','','','','','','',''],
        ['6','','','','','','',''],
        ['7','','','','','','',''],
        ['8','','','','','','',''],
        ['9','','','','','','',''],
        ['10','','','','','','',''],
        ['11','','','','','','',''],
        ['12','','','','','','',''],
      ]
    ) +
    `<h3>Category Summary</h3>` +
    buildTable(
      ['Category', '# of Tools', 'Monthly $', 'Annual $', 'Overlap?'],
      [['Development','','','',''], ['Design','','','',''], ['Communication','','','',''], ['Project Management','','','',''], ['Marketing','','','',''], ['Analytics','','','',''], ['Finance / Billing','','','',''], ['Other','','','',''], ['<strong>TOTAL</strong>','','<strong>$</strong>','<strong>$</strong>','']]
    ) +
    buildCallout('🔍 Look For', 'Tools with <strong>overlapping features</strong> (e.g., Notion + Confluence + Google Docs). Tools nobody logged into in the <strong>last 30 days</strong>. Plans that are <strong>way above</strong> your actual usage.')
  ),
  
  buildSection('02', 'Cost Calculator', 'See the real numbers. What you\'re paying vs. what you need.',
    `<h3>Current Spend</h3>` +
    buildTable(
      ['Category', 'Current Tool(s)', 'Monthly $', 'Annual $'],
      [
        ['Hosting / Infra','','',''],
        ['Database','','',''],
        ['Auth','','',''],
        ['Email (transactional)','','',''],
        ['Email (marketing)','','',''],
        ['Analytics','','',''],
        ['Error tracking','','',''],
        ['Communication','','',''],
        ['Project management','','',''],
        ['Design','','',''],
        ['AI / Dev tools','','',''],
        ['Other','','',''],
        ['<strong>TOTAL</strong>','','<strong>$</strong>','<strong>$</strong>'],
      ]
    ) +
    `<h3>Optimized Spend</h3>` +
    buildTable(
      ['Category', 'Recommended Tool', 'Monthly $', 'Annual $', 'Savings'],
      [
        ['Hosting', 'Vercel (free → Pro $20)', '', '', ''],
        ['Database + Auth', 'Supabase (free → Pro $25)', '', '', ''],
        ['Email', 'Resend ($0–20/mo)', '', '', ''],
        ['Analytics', 'PostHog (free tier)', '', '', ''],
        ['Error tracking', 'Sentry (free tier)', '', '', ''],
        ['Communication', 'Slack (free tier)', '', '', ''],
        ['Project management', 'Linear (free → $8/user)', '', '', ''],
        ['Passwords', '1Password ($8/user)', '', '', ''],
        ['<strong>TOTAL</strong>', '', '<strong>$</strong>', '<strong>$</strong>', ''],
      ]
    ) +
    `<div class="score-box" style="text-align:center;">
      <div style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:14px;margin-bottom:16px;">💸 Your Annual Savings</div>
      <div style="display:flex;justify-content:center;gap:40px;align-items:baseline;">
        <div><div style="font-size:10px;color:#999;text-transform:uppercase;letter-spacing:0.06em;">Current</div><div style="font-family:'Space Grotesk',sans-serif;font-size:28px;font-weight:700;color:#DC2626;">$_____</div></div>
        <div style="font-size:24px;color:#ccc;">→</div>
        <div><div style="font-size:10px;color:#999;text-transform:uppercase;letter-spacing:0.06em;">Optimized</div><div style="font-family:'Space Grotesk',sans-serif;font-size:28px;font-weight:700;color:#0D9488;">$_____</div></div>
        <div style="font-size:24px;color:#ccc;">=</div>
        <div><div style="font-size:10px;color:#999;text-transform:uppercase;letter-spacing:0.06em;">You Save</div><div style="font-family:'Space Grotesk',sans-serif;font-size:28px;font-weight:700;color:#0D9488;">$_____</div></div>
      </div>
    </div>`
  ),
  
  buildSection('03', 'Migration Planner', 'Move fast without breaking things. Three phases, four weeks.',
    `<h3>Phase 1: Quick Wins — Week 1</h3>
    <p>Tools to cut immediately: unused, duplicate, or free alternatives exist.</p>` +
    buildTable(
      ['Tool to Remove', 'Action', 'Replacement', 'Risk', 'Done?'],
      [['','Cancel / Downgrade','','Low','☐'],['','','','','☐'],['','','','','☐'],['','','','','☐']]
    ) +
    `<h3>Phase 2: Consolidation — Weeks 2–3</h3>
    <p>Merge overlapping tools into fewer, better ones.</p>` +
    buildTable(
      ['Tools to Merge', 'Into', 'Data to Migrate', 'Steps', 'Done?'],
      [['','','','','☐'],['','','','','☐'],['','','','','☐']]
    ) +
    `<h3>Phase 3: Optimization — Week 4</h3>
    <p>Downgrade plans, negotiate contracts, lock in annual billing.</p>` +
    buildTable(
      ['Tool', 'Action', 'Expected Savings', 'Done?'],
      [['','Downgrade tier','','☐'],['','Renegotiate','','☐'],['','Switch to annual','','☐']]
    ) +
    `<h3>Per-Tool Migration Checklist</h3>` +
    buildChecklist([
      'Export all data from old tool',
      'Verify data is complete and accessible',
      'Import / set up data in new tool',
      'Test core workflows in new tool',
      'Update team documentation',
      'Notify team of the switch',
      'Set a "sunset date" for old tool (2-week overlap)',
      'Cancel old tool subscription',
      'Remove old tool logins from password manager',
      'Update any integrations / webhooks',
    ])
  ),
  
  buildSection('04', 'Decision Matrix', 'A framework for every "should I keep this?" decision.',
    `<h3>Weighted Scoring</h3>
    <p>For each tool you're considering changing, score these factors:</p>` +
    buildTable(
      ['Factor', 'Weight', 'Score (1–10)', 'Weighted Score'],
      [
        ['<strong>Cost savings</strong>', '25%', '', ''],
        ['<strong>Reduced complexity</strong>', '20%', '', ''],
        ['<strong>Team productivity impact</strong>', '20%', '', ''],
        ['<strong>Migration difficulty</strong>', '15%', '', ''],
        ['<strong>Data portability</strong>', '10%', '', ''],
        ['<strong>Feature coverage of replacement</strong>', '10%', '', ''],
        ['<strong>TOTAL</strong>', '100%', '', '<strong>/10</strong>'],
      ]
    ) +
    `<div class="score-box">
      <div style="font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:14px;margin-bottom:12px;">📊 Decision Thresholds</div>
      <div class="score-item"><span class="score-label">8–10</span> Strong candidate. Proceed with migration.</div>
      <div class="score-item"><span class="score-label">6–7</span> Good candidate. Plan carefully.</div>
      <div class="score-item"><span class="score-label">4–5</span> Marginal. Only as part of larger simplification.</div>
      <div class="score-item"><span class="score-label">1–3</span> Keep as-is. Switching costs outweigh benefits.</div>
    </div>` +
    `<h3>Tool Decisions</h3>` +
    buildTable(
      ['Tool', 'Decision', 'Reason', 'Monthly Savings', 'Timeline'],
      [['','Keep / Cut / Replace / Downgrade','','',''],['','','','',''],['','','','',''],['','','','',''],['','','','',''],['','','','','']]
    ) +
    `<h3>The "Do I Really Need This?" Test</h3>` +
    buildNumberedList([
      '<strong>If this tool disappeared tomorrow, would I notice within a week?</strong><br><span style="color:#0D9488;">No → Cut it.</span>',
      '<strong>Is another tool I already use doing 80% of this?</strong><br><span style="color:#0D9488;">Yes → Consolidate.</span>',
      '<strong>Am I on a higher plan than I need?</strong><br><span style="color:#0D9488;">Yes → Downgrade.</span>',
      '<strong>When did someone last log into this?</strong><br><span style="color:#0D9488;">30+ days ago → Flag for review.</span>',
      '<strong>Does this tool spark joy?</strong> (seriously)<br><span style="color:#0D9488;">No → Find one that does, or go without.</span>',
    ]) +
    `<div class="spacer"></div>
    <h3>Recommended Tool Stack</h3>` +
    buildToolGrid([
      { purpose: 'Everything Hub', name: 'Notion', desc: 'Docs, wikis, databases, notes. Replace 3-4 tools with one.' },
      { purpose: 'Project Tracking', name: 'Linear', desc: 'Fast, keyboard-first. Replaces Jira + Trello + Asana.' },
      { purpose: 'Automation', name: 'Zapier', desc: 'Connect the tools you keep. Automate the repetitive stuff.' },
      { purpose: 'Communication', name: 'Slack', desc: 'One channel for everything. Kill the email threads.' },
      { purpose: 'Passwords', name: '1Password', desc: 'Team security without the headache. Shared vaults.' },
    ])
  ),
  
  buildBackPage(),
].join('\n'));


// Write all files
const products = [
  { slug: 'starters-playbook', html: startersPlaybook },
  { slug: 'builders-launch-kit', html: buildersKit },
  { slug: 'growth-dashboard', html: growthDashboard },
  { slug: 'simplifiers-audit', html: simplifiersAudit },
];

products.forEach(p => {
  const outPath = path.join(__dirname, `${p.slug}.html`);
  fs.writeFileSync(outPath, p.html);
  console.log(`✅ ${p.slug}.html`);
});

console.log('\nReady for PDF conversion.');
