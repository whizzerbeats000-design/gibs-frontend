const { chromium } = require('playwright');
const fs = require('fs');

async function audit() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Assuming the app is served at localhost:5173 (Vite default)
  // I need to run the dev server first.
  const url = 'http://localhost:5173';
  
  const viewports = [
    320, 360, 375, 390, 430, 480, 640, 768, 820, 900, 1024, 1100, 1280, 1366, 1440, 1536, 1600, 1920, 2560
  ];
  
  const results = [];

  for (const width of viewports) {
    await page.setViewport({ width, height: 1080 });
    try {
      await page.goto(url, { waitUntil: 'networkidle' });
      
      const data = await page.evaluate(() => {
        const getComputed = (sel) => {
          const el = document.querySelector(sel);
          if (!el) return null;
          const style = window.getComputedStyle(el);
          const rect = el.getBoundingClientRect();
          return {
            width: rect.width,
            height: rect.height,
            paddingTop: style.paddingTop,
            paddingBottom: style.paddingBottom,
            fontSize: style.fontSize,
            lineHeight: style.lineHeight,
            maxWidth: style.maxWidth,
          };
        };

        return {
          viewportWidth: window.innerWidth,
          documentHeight: document.documentElement.scrollHeight,
          bodyWidth: document.body.offsetWidth,
          mainContentWidth: getComputed('.container-x')?.width,
          headerHeight: getComputed('header')?.height,
          sectionHeights: Array.from(document.querySelectorAll('section')).map(s => s.getBoundingClientRect().height),
          h1Size: getComputed('h1')?.fontSize,
          h2Size: getComputed('h2')?.fontSize,
          pWidth: Array.from(document.querySelectorAll('p')).map(p => p.getBoundingClientRect().width),
        };
      });
      results.push({ width, ...data });
    } catch (e) {
      results.push({ width, error: e.message });
    }
  }

  fs.writeFileSync('geometry_results.json', JSON.stringify(results, null, 2));
  await browser.close();
}

audit();
