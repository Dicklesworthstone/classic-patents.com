const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto("http://localhost:3000/patents/us-200521-edison-phonograph?view=original-spec");
  await page.waitForTimeout(5000);
  await page.screenshot({ path: "screenshot_local.png", fullPage: true });
  await browser.close();
})();
