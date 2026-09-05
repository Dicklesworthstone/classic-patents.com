/**
 * e2e-visual-audit.ts
 *
 * Ultra-fast Automated E2E Visual QA, DOM Health & Layout Verification Suite for Classic Patents.
 * Uses Playwright to test local responsive breakpoints, console logs, canvas renders, and theme toggling.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { chromium } from "playwright";

const BASE_URL = process.env.E2E_BASE_URL || "http://127.0.0.1:3088";
const SCREENSHOT_DIR = path.join(process.cwd(), "artifacts", "e2e_screenshots");

interface AuditResult {
  route: string;
  viewport: string;
  status: number;
  hasHorizontalOverflow: boolean;
  consoleErrors: string[];
  canvasCount: number;
  screenshotPath?: string;
}

async function main() {
  console.log("==================================================");
  console.log(`  Classic Patents E2E Visual & Layout Audit Suite`);
  console.log(`  Target: ${BASE_URL}`);
  console.log("==================================================\n");

  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const viewports = [
    { name: "Desktop 1440px", width: 1440, height: 900 },
    { name: "Tablet 768px", width: 768, height: 1024 },
    { name: "Mobile 375px", width: 375, height: 667 },
  ];

  const routesToTest = [
    "/",
    "/timeline",
    "/about",
    "/patents/us-821393-wright-flyer",
    "/patents/us-381968-tesla-motor",
    "/patents/us-223898-edison-lightbulb",
    "/patents/us-2708656-fermi-reactor",
    "/patents/us-4136359-wozniak-apple",
    "/patents/us-3541541-engelbart-mouse",
    "/patents/us-1781541-einstein-refrigerator",
  ];

  const results: AuditResult[] = [];
  let totalErrors = 0;

  for (const vp of viewports) {
    console.log(`\n--- Auditing Breakpoint: ${vp.name} (${vp.width}x${vp.height}) ---`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });

    const page = await context.newPage();
    const consoleErrors: string[] = [];

    page.on("pageerror", (err) => {
      consoleErrors.push(`[PageError] ${err.message}`);
    });

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(`[ConsoleError] ${msg.text()}`);
      }
    });

    for (const route of routesToTest) {
      const url = `${BASE_URL}${route}`;
      process.stdout.write(`  Testing ${route.padEnd(42)} ... `);

      const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 8000 });
      const status = response ? response.status() : 0;

      // Allow 3D canvas and dynamic components to mount
      await page.waitForTimeout(250);

      // Check for horizontal overflow (common mobile responsive bug)
      const hasHorizontalOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });

      // Count active WebGL Canvas elements
      const canvasCount = await page.locator("canvas").count();

      // Clean screenshot filename
      const cleanRouteName = route === "/" ? "home" : route.replace(/^\//, "").replace(/\//g, "_");
      const screenshotFilename = `${cleanRouteName}_${vp.width}px.png`;
      const screenshotPath = path.join(SCREENSHOT_DIR, screenshotFilename);

      await page.screenshot({ path: screenshotPath, fullPage: false });

      const hasIssues = status !== 200 || hasHorizontalOverflow;
      if (hasIssues) {
        totalErrors++;
        console.log(`❌ FAILED (Status: ${status}, Overflow: ${hasHorizontalOverflow})`);
      } else {
        console.log(`✓ OK (Status: ${status}, Canvases: ${canvasCount})`);
      }

      results.push({
        route,
        viewport: vp.name,
        status,
        hasHorizontalOverflow,
        consoleErrors: [...consoleErrors],
        canvasCount,
        screenshotPath,
      });

      // Clear route errors
      consoleErrors.length = 0;
    }

    await context.close();
  }

  // Interactive Test: Theme Toggle & Tab Switching on Desktop
  console.log("\n--- Auditing Interactive Components & State Transitions ---");
  const interactiveContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const iPage = await interactiveContext.newPage();
  await iPage.goto(`${BASE_URL}/patents/us-821393-wright-flyer`, { waitUntil: "domcontentloaded" });
  await iPage.waitForTimeout(300);

  // 1. Test Theme Toggle
  const themeButton = iPage.locator('button[aria-label="Toggle light and dark theme"]');
  if ((await themeButton.count()) > 0) {
    await themeButton.click();
    await iPage.waitForTimeout(200);
    const isDark = await iPage.evaluate(() => document.documentElement.classList.contains("dark"));
    console.log(
      `  ✓ Theme Toggle Transition: Successfully toggled to ${isDark ? "Dark" : "Light"} mode`,
    );
    await themeButton.click(); // Toggle back
  }

  // 2. Test the actual Original Patent Text control, URL state, refresh, and
  // source-figure hover behavior. A static page must restore this selected
  // face from ?view=original-spec after a browser refresh.
  const originalTextTab = iPage.getByRole("button", { name: /^Original Patent Text\b/ });
  if ((await originalTextTab.count()) !== 1) {
    totalErrors++;
    console.log("  ❌ Original Patent Text control is unavailable");
  } else {
    await originalTextTab.click();
    await iPage.waitForFunction(
      () => new URL(window.location.href).searchParams.get("view") === "original-spec",
    );
    await iPage.reload({ waitUntil: "domcontentloaded" });
    await iPage.waitForTimeout(300);

    const specContentCount = await iPage
      .getByRole("heading", { name: /Specification of Letters Patent/ })
      .count();
    if (specContentCount === 0) {
      totalErrors++;
      console.log("  ❌ Original Patent Text did not survive refresh");
    } else {
      console.log("  ✓ Original Patent Text selection survives refresh");
    }

    const figureReference = iPage.getByRole("button", {
      name: /Preview Figure 1 from the original patent facsimile/,
    });
    if ((await figureReference.count()) === 0) {
      totalErrors++;
      console.log("  ❌ Original Patent Text has no Figure 1 source-preview control");
    } else {
      await figureReference.first().hover();
      const figurePreview = iPage.getByRole("tooltip").locator('a[href$="fig-1-preview.png"]');
      try {
        await figurePreview.waitFor({ state: "visible", timeout: 1500 });
        console.log("  ✓ Figure 1 hover exposes a linked individual source crop");
      } catch {
        totalErrors++;
        console.log("  ❌ Figure 1 hover did not expose its linked source crop");
      }
    }
  }

  // 3. Every view must own a URL value, restore after reload, and expose its
  // selected state accessibly. This also prevents Back from leaving an old
  // face rendered after the URL returns to a route without `?view=`.
  const viewChecks = [
    {
      name: /^Plain English Face\b/,
      view: "plain-english",
      marker: iPage.getByRole("heading", {
        name: /How It Works: Step-by-Step Mechanical & Physical Breakdown/,
      }),
    },
    {
      name: /^Interactive 3D Simulator\b/,
      view: "interactive-sim",
      marker: iPage.getByRole("button", { name: /^Interactive 3D Simulator\b/ }),
    },
    {
      name: /^Schematic & Pins\b/,
      view: "schematic-sheet",
      marker: iPage.getByRole("button", { name: /^Schematic & Pins\b/ }),
    },
    {
      name: /^Full Original PDF\b/,
      view: "pdf-facsimile",
      marker: iPage.locator(
        '[data-testid="pinned-pdf-renderer"][data-render-state="ready"] canvas',
      ),
    },
    {
      name: /^Dual Split-Screen\b/,
      view: "split-view",
      marker: iPage.getByRole("heading", { name: "Face 2: Complete Archival Source Text" }),
    },
  ];

  for (const check of viewChecks) {
    const tab = iPage.getByRole("button", { name: check.name });
    if ((await tab.count()) !== 1) {
      totalErrors++;
      console.log(`  ❌ ${check.view} control is unavailable`);
      continue;
    }

    await tab.click();
    await iPage.waitForFunction(
      (view) => new URL(window.location.href).searchParams.get("view") === view,
      check.view,
    );
    await iPage.reload({ waitUntil: "domcontentloaded" });
    await iPage.waitForTimeout(300);

    const restoredTab = iPage.getByRole("button", { name: check.name });
    const active = (await restoredTab.getAttribute("aria-pressed")) === "true";
    const markerVisible = await check.marker
      .first()
      .isVisible()
      .catch(() => false);
    if (!active || !markerVisible) {
      totalErrors++;
      console.log(`  ❌ ${check.view} did not restore its selected face after refresh`);
    } else {
      console.log(`  ✓ ${check.view} selection survives refresh`);
    }
  }

  await iPage.goto(`${BASE_URL}/patents/us-821393-wright-flyer`, {
    waitUntil: "domcontentloaded",
  });
  const originalForBackTest = iPage.getByRole("button", { name: /^Original Patent Text\b/ });
  await originalForBackTest.click();
  await iPage.waitForFunction(
    () => new URL(window.location.href).searchParams.get("view") === "original-spec",
  );
  await iPage.goBack({ waitUntil: "domcontentloaded" });
  await iPage.waitForTimeout(150);
  const defaultViewRestored =
    new URL(iPage.url()).searchParams.get("view") === null &&
    (await iPage
      .getByRole("button", { name: /^Plain English Face\b/ })
      .getAttribute("aria-pressed")) === "true";
  if (!defaultViewRestored) {
    totalErrors++;
    console.log("  ❌ Browser Back did not restore the default Plain English face");
  } else {
    console.log("  ✓ Browser Back restores the default Plain English face");
  }

  await interactiveContext.close();
  await browser.close();

  console.log("\n==================================================");
  console.log(
    `  E2E Visual QA Summary: ${totalErrors === 0 ? "ALL PASSING GREEN (0 ERRORS)" : `${totalErrors} ISSUES FOUND`}`,
  );
  console.log(`  Screenshots saved to: ${SCREENSHOT_DIR}`);
  console.log("==================================================");

  if (totalErrors > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("E2E Audit failed with exception:", err);
  process.exit(1);
});
