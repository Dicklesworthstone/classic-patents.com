/**
 * e2e-all-visuals-audit.ts
 *
 * Automated Playwright browser verification for every single patent visualization in the museum.
 * Tests 3D WebGL physics engine mount, 2D vector schematic toggle, console errors, page errors,
 * and responsive layout stability across all 22 patents.
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
  console.log("  Classic Patents Comprehensive 22/22 Browser Visualization Audit");
  console.log(`  Target: ${BASE_URL}`);
  console.log("=======================================================================\n");

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
  });

  const page = await context.newPage();
  const results: PatentTestResult[] = [];
  let failCount = 0;

  for (let i = 0; i < allPatents.length; i++) {
    const patent = allPatents[i];
    const url = `${BASE_URL}/patents/${patent.id}`;
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];

    const onPageError = (err: Error) => {
      pageErrors.push(err.message);
    };

    const onConsole = (msg: any) => {
      if (msg.type() === "error") {
        const text = msg.text();
        // Ignore expected favicon or non-fatal network noise if any
        if (!text.includes("favicon") && !text.includes("404")) {
          consoleErrors.push(text);
        }
      }
    };

    page.on("pageerror", onPageError);
    page.on("console", onConsole);

    process.stdout.write(`[${i + 1}/22] Testing ${patent.patentNumber} (${patent.id}) ... `);

    try {
      const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 10000 });
      if (response?.status() !== 200) {
        throw new Error(`HTTP Status ${response?.status()}`);
      }

      // 1. Check 3D WebGL Canvas Render
      await page.waitForTimeout(600);
      const canvasCount = await page.locator("canvas").count();
      const canvasFound = canvasCount > 0;

      let threeDStatus: "PASS" | "FAIL" = "PASS";
      if (!canvasFound || pageErrors.length > 0) {
        threeDStatus = "FAIL";
      }

      // 2. Test 2D Schematic Switcher
      let twoDStatus: "PASS" | "FAIL" = "PASS";
      const twoDButton = page.locator('button:has-text("2D Schematic")');
      if ((await twoDButton.count()) > 0) {
        await twoDButton.click();
        await page.waitForTimeout(400);

        // Verify SVG vector schematic is present
        const svgCount = await page.locator("svg").count();
        if (svgCount === 0) {
          twoDStatus = "FAIL";
        }

        // Switch back to 3D Engine
        const threeDButton = page.locator('button:has-text("3D Engine")');
        if ((await threeDButton.count()) > 0) {
          await threeDButton.click();
          await page.waitForTimeout(400);
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
      page.off("pageerror", onPageError);
      page.off("console", onConsole);
    }
  }

  await context.close();
  await browser.close();

  console.log("\n=======================================================================");
  console.log(`  Audit Completed: ${22 - failCount}/22 PASSED (${failCount} failures)`);
  console.log("=======================================================================");

  if (failCount > 0) {
    process.exit(1);
  }
}

runVisualsAudit().catch((err) => {
  console.error("Fatal audit execution error:", err);
  process.exit(1);
});
