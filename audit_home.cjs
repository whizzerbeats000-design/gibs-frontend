const { chromium } = require('playwright-core');

async function audit() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const viewports = [
    { w: 320, h: 800 }, { w: 360, h: 800 }, { w: 390, h: 844 }, { w: 430, h: 932 },
    { w: 640, h: 900 }, { w: 768, h: 1024 }, { w: 820, h: 1180 }, { w: 1023, h: 900 },
    { w: 1024, h: 768 }, { w: 1280, h: 800 }, { w: 1440, h: 900 }, { w: 1920, h: 1080 }, { w: 2560, h: 1440 }
  ];

  const results = [];

  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.w, height: vp.h });
    try {
      await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
      
      // Wait for motion reveals - scroll to bottom and back
      await page.evaluate(async () => {
        await new Promise(r => {
          const interval = setInterval(() => {
            window.scrollBy(0, 500);
            if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
              clearInterval(interval);
            }
          }, 100);
        });
      });
      await new Promise(r => setTimeout(r, 1000));
      await page.evaluate(() => window.scrollTo(0, 0));
      await new Promise(r => setTimeout(r, 500));

      const measurements = await page.evaluate(() => {
        const container = document.querySelector('.container-x');
        const header = document.querySelector('header');
        const footer = document.querySelector('footer');
        
        return {
          viewport: { w: window.innerWidth, h: window.innerHeight },
          scrollWidth: document.documentElement.scrollWidth,
          container: container ? {
            width: container.getBoundingClientRect().width,
            left: container.getBoundingClientRect().left,
            right: container.getBoundingClientRect().right
          } : null,
          headerHeight: header ? header.getBoundingClientRect().height : null,
          footerHeight: footer ? footer.getBoundingClientRect().height : null,
          hasOverflow: document.documentElement.scrollWidth > window.innerWidth
        };
      });
      
      results.push({ viewport: vp, ...measurements });
    } catch (e) {
      results.push({ viewport: vp, error: e.message });
    }
  }

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
}

audit().catch(console.error);
