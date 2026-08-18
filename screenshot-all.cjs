const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

// Read the list of patents by executing a quick ts-node or just parsing the directory
const dir = path.join(__dirname, "src", "data", "patents");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".ts") && f !== "index.ts");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  // Set a large viewport
  await page.setViewportSize({ width: 1280, height: 800 });

  const outDir = path.join(
    __dirname,
    ".gemini",
    "antigravity-cli",
    "brain",
    "c2f02dad-a257-426f-bbbc-38b5e5a119a5",
  ); // But wait, it's safer to save locally and I can just move them.
  const tempDir = path.join(__dirname, "screenshots");
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  for (let file of files) {
    const id = file.replace(".ts", "");
    console.log(`Screenshotting ${id}...`);
    try {
      // ?view=3d forces the 3d view (if applicable) or 2d view
      await page.goto(`http://localhost:3000/patents/${id}`);
      await page.waitForTimeout(2000); // let 3d scene render
      await page.screenshot({ path: path.join(tempDir, `${id}.png`) });
    } catch (e) {
      console.error(`Failed on ${id}: ${e.message}`);
    }
  }

  await browser.close();
  console.log("Done taking screenshots.");
})();
