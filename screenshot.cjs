const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(
    "https://classic-patents.com/patents/us-200521-edison-phonograph?view=original-spec",
  );
  await page.waitForTimeout(4000);
  await page.screenshot({ path: "screenshot.png", fullPage: true });
  await browser.close();
})();
