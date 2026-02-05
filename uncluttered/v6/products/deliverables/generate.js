const fs = require('fs');
const path = require('path');

const template = fs.readFileSync(path.join(__dirname, 'pdf-template.html'), 'utf8');

const products = [
  {
    slug: 'starters-playbook',
    badge: '💡 STARTING STAGE',
    title: "The Starter's Playbook",
    subtitle: 'From idea to validated concept. Stop guessing, start knowing.',
    md: path.join(__dirname, '..', 'templates', 'starters-playbook.md'),
  },
  {
    slug: 'builders-launch-kit',
    badge: '🔨 BUILDING STAGE',
    title: "The Builder's Launch Kit",
    subtitle: 'From code to customers. Ship fast, ship right, ship once.',
    md: path.join(__dirname, '..', 'templates', 'builders-launch-kit.md'),
  },
  {
    slug: 'growth-dashboard',
    badge: '📈 GROWING STAGE',
    title: 'The Growth Dashboard',
    subtitle: 'Measure what matters. Ignore the rest. Scale with clarity.',
    md: path.join(__dirname, '..', 'templates', 'growth-dashboard.md'),
  },
  {
    slug: 'simplifiers-audit',
    badge: '✂️ SIMPLIFYING STAGE',
    title: "The Simplifier's Audit",
    subtitle: 'Cut the bloat. Keep what works. Save thousands.',
    md: path.join(__dirname, '..', 'templates', 'simplifiers-audit.md'),
  },
];

function mdToHtml(md) {
  // Simple markdown to HTML converter for our specific content
  let html = md;
  
  // Remove the first H1 and blockquote (we use cover page instead)
  html = html.replace(/^# .+\n\n> .+\n\n---\n\n/, '');
  
  // Horizontal rules -> section breaks
  html = html.replace(/^---$/gm, '<hr>');
  
  // Headers
  html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  
  // Bold
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  
  // Italic
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    return `<pre><code>${code.trim()}</code></pre>`;
  });
  
  // Blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
  // Merge consecutive blockquotes
  html = html.replace(/<\/blockquote>\n<blockquote>/g, '<br>');
  
  // Tables
  html = html.replace(/(\|.+\|)\n(\|[-| :]+\|)\n((?:\|.+\|\n?)+)/g, (match, header, sep, body) => {
    const headers = header.split('|').filter(c => c.trim()).map(c => `<th>${c.trim()}</th>`).join('');
    const rows = body.trim().split('\n').map(row => {
      const cells = row.split('|').filter(c => c.trim() !== undefined).slice(1, -1).map(c => `<td>${c.trim()}</td>`).join('');
      return `<tr>${cells}</tr>`;
    }).join('\n');
    return `<table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
  });
  
  // Checkbox items  
  html = html.replace(/^- \[ \] (.+)$/gm, '<div style="display:flex;align-items:flex-start;gap:8px;margin:4px 0;"><span style="display:inline-block;width:14px;height:14px;border:1.5px solid #ccc;border-radius:3px;flex-shrink:0;margin-top:2px;"></span><span>$1</span></div>');
  html = html.replace(/^- \[x\] (.+)$/gm, '<div style="display:flex;align-items:flex-start;gap:8px;margin:4px 0;"><span style="display:inline-block;width:14px;height:14px;background:#0D9488;border:1.5px solid #0D9488;border-radius:3px;flex-shrink:0;margin-top:2px;color:white;text-align:center;font-size:10px;line-height:14px;">✓</span><span>$1</span></div>');
  
  // Regular list items
  html = html.replace(/^- (.+)$/gm, '<li style="list-style:disc;margin-left:16px;">$1</li>');
  html = html.replace(/^(\d+)\. (.+)$/gm, '<li style="list-style:decimal;margin-left:16px;">$2</li>');
  
  // Paragraphs - wrap standalone lines
  html = html.split('\n').map(line => {
    const trimmed = line.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('<')) return line;
    if (trimmed.startsWith('#')) return line;
    return `<p>${trimmed}</p>`;
  }).join('\n');
  
  // Clean up empty paragraphs
  html = html.replace(/<p><\/p>/g, '');
  
  return html;
}

products.forEach(product => {
  const md = fs.readFileSync(product.md, 'utf8');
  const contentHtml = mdToHtml(md);
  
  const cover = `
  <div class="cover">
    <div class="cover-logo">
      <div class="mark"><span></span></div>
      <span class="name">fewertools</span>
    </div>
    <div class="cover-badge">${product.badge}</div>
    <h1>${product.title}</h1>
    <p class="subtitle">${product.subtitle}</p>
    <p class="cover-footer">fewertools.com — The only tools you need</p>
  </div>`;
  
  const fullHtml = template.replace(
    '<!-- Content will be injected per product -->',
    `${cover}\n<div class="content">\n${contentHtml}\n</div>`
  );
  
  const outPath = path.join(__dirname, `${product.slug}.html`);
  fs.writeFileSync(outPath, fullHtml);
  console.log(`✅ Generated: ${outPath}`);
});

console.log('\nDone! Open these HTML files in a browser and print to PDF (Cmd+P → Save as PDF)');
console.log('Or use the browser tool to auto-generate PDFs.');
