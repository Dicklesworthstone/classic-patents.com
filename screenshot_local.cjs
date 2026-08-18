const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });
  const url = process.argv[2] || "http://localhost:3000/patents/us-138-colt-revolver";
  console.log("Navigating to", url);
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(5000);
  await page.screenshot({ path: "screenshot_local.png" });
  await browser.close();
})();
