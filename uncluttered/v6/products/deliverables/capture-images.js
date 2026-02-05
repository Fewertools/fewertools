const puppeteer = require('/tmp/node_modules/puppeteer');
const path = require('path');

const images = [
  { id: 'img-starter', file: 'product-starter.png' },
  { id: 'img-builder', file: 'product-builder.png' },
  { id: 'img-growth', file: 'product-growth.png' },
  { id: 'img-simplify', file: 'product-simplify.png' },
  { id: 'img-bundle', file: 'product-bundle.png' },
];

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 3600, deviceScaleFactor: 2 });
  
  const htmlPath = path.join(__dirname, 'product-images.html');
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');
  await new Promise(r => setTimeout(r, 1500));
  
  for (const img of images) {
    const el = await page.$(`#${img.id}`);
    const outPath = path.join(__dirname, img.file);
    await el.screenshot({ path: outPath, type: 'png' });
    console.log(`✅ ${img.file}`);
  }
  
  await browser.close();
  console.log('\nAll product images captured!');
})();
