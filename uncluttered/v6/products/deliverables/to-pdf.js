const puppeteer = require('/tmp/node_modules/puppeteer');
const path = require('path');
const fs = require('fs');

const files = [
  { html: 'starters-playbook.html', pdf: 'The-Starters-Playbook-FewerTools.pdf' },
  { html: 'builders-launch-kit.html', pdf: 'The-Builders-Launch-Kit-FewerTools.pdf' },
  { html: 'growth-dashboard.html', pdf: 'The-Growth-Dashboard-FewerTools.pdf' },
  { html: 'simplifiers-audit.html', pdf: 'The-Simplifiers-Audit-FewerTools.pdf' },
];

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  
  for (const file of files) {
    const page = await browser.newPage();
    const htmlPath = path.join(__dirname, file.html);
    const pdfPath = path.join(__dirname, file.pdf);
    
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
    
    // Wait for fonts to load
    await page.evaluateHandle('document.fonts.ready');
    await new Promise(r => setTimeout(r, 1000));
    
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      margin: { top: '50px', right: '45px', bottom: '50px', left: '45px' },
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: '<span></span>',
      footerTemplate: `
        <div style="width:100%;font-size:8px;color:#aaa;padding:0 45px;display:flex;justify-content:space-between;">
          <span>fewertools.com</span>
          <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
        </div>
      `,
    });
    
    const size = (fs.statSync(pdfPath).size / 1024).toFixed(0);
    console.log(`✅ ${file.pdf} (${size}KB)`);
    await page.close();
  }
  
  await browser.close();
  console.log('\nAll PDFs generated!');
})();
