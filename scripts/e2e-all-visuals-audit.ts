/**
 * e2e-all-visuals-audit.ts
 *
 * Automated Playwright browser verification for every registered patent visualization in the museum.
 * It tests the actual Interactive 3D Simulator face before checking the WebGL canvas, then tests
 * the paired 2D Schematic face, console/page errors, and responsive layout stability. Rendering
 * health is necessary but does not establish historical or physical fidelity.
 */

import { chromium } from "playwright";
import { allPatents } from "../src/data/patents";

const BASE_URL = process.env.E2E_BASE_URL || "http://127.0.0.1:3088";

interface PatentTestResult {
  id: string;
  patentNumber: string;
  title: string;
  threeDStatus: "PASS" | "FAIL";
  twoDStatus: "PASS" | "FAIL";
  consoleErrors: string[];
  pageErrors: string[];
  canvasFound: boolean;
  hasOverflow: boolean;
}

async function runVisualsAudit() {
  console.log("=======================================================================");
  console.log(
    `  Classic Patents Comprehensive ${allPatents.length}/${allPatents.length} Browser Visualization Audit`,
  );
  console.log(`  Target: ${BASE_URL}`);
  console.log("=======================================================================\n");

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
  });

  const results: PatentTestResult[] = [];
  let failCount = 0;

  for (let i = 0; i < allPatents.length; i++) {
    const patent = allPatents[i];
    const url = `${BASE_URL}/patents/${patent.id}`;
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];

    const page = await context.newPage();

    page.on("response", (res) => {
      if (res.status() >= 400) {
        console.log(`\n       [HTTP ${res.status()}] ${res.url()}`);
      }
    });

    const onPageError = (err: Error) => {
      pageErrors.push(err.message);
    };

    const onConsole = (msg: any) => {
      if (msg.type() === "error") {
        const text = msg.text();
        if (!text.includes("favicon")) {
          consoleErrors.push(text);
        }
      }
    };

    page.on("pageerror", onPageError);
    page.on("console", onConsole);

    process.stdout.write(
      `[${i + 1}/${allPatents.length}] Testing ${patent.patentNumber} (${patent.id}) ... `,
    );

    try {
      const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });
      if (response?.status() !== 200) {
        throw new Error(`HTTP Status ${response?.status()}`);
      }

      const interactiveView = page.getByRole("button", { name: "Interactive 3D Simulator" });
      if ((await interactiveView.count()) !== 1) {
        throw new Error("The Interactive 3D Simulator view control is unavailable.");
      }
      await interactiveView.click();

      // 1. Check 3D WebGL Canvas Render after entering the interactive face.
      let canvasFound = false;
      try {
        await page.waitForSelector("canvas", { timeout: 6000 });
        canvasFound = true;
      } catch {
        canvasFound = false;
      }

      let threeDStatus: "PASS" | "FAIL" = "PASS";
      if (!canvasFound || pageErrors.length > 0) {
        threeDStatus = "FAIL";
      }

      // 2. Test the source-drawing / schematic face. Its visitor-facing
      // label deliberately changed from "2D Schematic" to "Schematic & Pins";
      // the face id is the stable contract used by the navigation component.
      let twoDStatus: "PASS" | "FAIL" = "PASS";
      const twoDButton = page.locator('button[data-patent-face="schematic-sheet"]');
      if ((await twoDButton.count()) !== 1) {
        twoDStatus = "FAIL";
      } else {
        await twoDButton.click();
        await page.waitForTimeout(300);

        // Only a visible vector is evidence for this face. Other faces can
        // remain mounted offscreen, so a document-wide SVG count is not
        // meaningful here.
        if ((await page.locator("svg:visible").count()) === 0) {
          twoDStatus = "FAIL";
        }
      }

      // Check horizontal overflow
      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });

      const isPassed =
        threeDStatus === "PASS" &&
        twoDStatus === "PASS" &&
        pageErrors.length === 0 &&
        consoleErrors.length === 0 &&
        !hasOverflow;

      if (isPassed) {
        console.log("✓ OK (3D: PASS, 2D: PASS, Errors: 0)");
      } else {
        failCount++;
        console.log(
          `❌ FAILED (3D: ${threeDStatus}, 2D: ${twoDStatus}, PageErrors: ${pageErrors.length}, ConsoleErrors: ${consoleErrors.length})`,
        );
        if (pageErrors.length > 0) {
          console.log(`   [PageErrors]:`, pageErrors);
        }
        if (consoleErrors.length > 0) {
          console.log(`   [ConsoleErrors]:`, consoleErrors);
        }
      }

      results.push({
        id: patent.id,
        patentNumber: patent.patentNumber,
        title: patent.shortTitle,
        threeDStatus,
        twoDStatus,
        consoleErrors: [...consoleErrors],
        pageErrors: [...pageErrors],
        canvasFound,
        hasOverflow,
      });
    } catch (err: any) {
      failCount++;
      console.log(`❌ EXCEPTION: ${err.message}`);
      results.push({
        id: patent.id,
        patentNumber: patent.patentNumber,
        title: patent.shortTitle,
        threeDStatus: "FAIL",
        twoDStatus: "FAIL",
        consoleErrors: [...consoleErrors],
        pageErrors: [err.message],
        canvasFound: false,
        hasOverflow: false,
      });
    } finally {
      await page.close();
    }
  }

  await context.close();
  await browser.close();

  console.log("\n=======================================================================");
  console.log(
    `  Audit Completed: ${allPatents.length - failCount}/${allPatents.length} PASSED (${failCount} failures)`,
  );
  console.log("=======================================================================");

  if (failCount > 0) {
    process.exit(1);
  }
}

runVisualsAudit().catch((err) => {
  console.error("Fatal audit execution error:", err);
  process.exit(1);
});
