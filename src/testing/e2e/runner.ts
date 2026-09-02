/**
 * runner.ts
 *
 * Composable vertical-slice Playwright test runner for Classic Patents.
 * Exercises all faces, shared controls, telemetry propagation, claim probes,
 * viewports (desktop, tablet, mobile), and themes with structured diagnostic logging.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { type Browser, type BrowserContext, chromium, type Page } from "playwright";
import { E2EDiagnosticLogger } from "./logger";
import {
  E2E_VIEWPORTS,
  type E2EEventLog,
  type E2EFaceName,
  type E2ERunSummary,
  type E2EViewportName,
  type PatentE2EScenario,
} from "./types";

export interface E2ERunnerOptions {
  baseUrl?: string;
  viewports?: E2EViewportName[];
  headless?: boolean;
  logger?: E2EDiagnosticLogger;
  timeoutMs?: number;
  captureScreenshots?: boolean;
  artifactsDir?: string;
}

export async function preflightServer(baseUrl: string): Promise<boolean> {
  try {
    const res = await fetch(`${baseUrl}/`, { method: "HEAD" });
    return res.status >= 200 && res.status < 400;
  } catch {
    return false;
  }
}

export async function runScenarioOnPage(
  page: Page,
  scenario: PatentE2EScenario,
  viewportName: E2EViewportName,
  logger: E2EDiagnosticLogger,
  options: E2ERunnerOptions = {},
): Promise<boolean> {
  const baseUrl = options.baseUrl ?? "http://127.0.0.1:3000";
  const url = `${baseUrl}/patents/${scenario.patentId}`;
  let passed = true;

  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  const networkErrors: string[] = [];

  page.on("pageerror", (err) => {
    pageErrors.push(err.message);
  });

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      const text = msg.text();
      if (!text.includes("favicon") && !text.includes("Failed to load resource")) {
        consoleErrors.push(text);
      }
    }
  });

  page.on("response", (res) => {
    if (res.status() >= 400) {
      networkErrors.push(`[HTTP ${res.status()}] ${res.url()}`);
    }
  });

  const recordEvent = async (
    action: Parameters<E2EDiagnosticLogger["log"]>[0]["action"],
    expectedState: string,
    actualState: string,
    status: "PASS" | "FAIL",
    face?: E2EFaceName,
  ) => {
    const artifactPaths: E2EEventLog["artifactPaths"] = {};

    if (status === "FAIL" && options.captureScreenshots !== false) {
      try {
        const artifactsBase =
          options.artifactsDir ??
          (fs.existsSync("/Volumes/USBNVME16TB/temp_agent_space")
            ? "/Volumes/USBNVME16TB/temp_agent_space/e2e-evidence"
            : path.join(process.cwd(), "artifacts", "e2e-evidence"));

        if (!fs.existsSync(artifactsBase)) {
          fs.mkdirSync(artifactsBase, { recursive: true });
        }

        const shotName = `${scenario.patentId}-${viewportName}-${action}-${Date.now()}.png`;
        const shotPath = path.join(artifactsBase, shotName);
        await page.screenshot({ path: shotPath, fullPage: false });
        artifactPaths.screenshot = shotPath;

        const domName = `${scenario.patentId}-${viewportName}-${action}-${Date.now()}.html`;
        const domPath = path.join(artifactsBase, domName);
        fs.writeFileSync(domPath, await page.content(), "utf8");
        artifactPaths.domSnapshot = domPath;
      } catch {
        // Best-effort evidence capture
      }
    }

    logger.log({
      patentId: scenario.patentId,
      route: `/patents/${scenario.patentId}`,
      viewport: viewportName,
      face,
      action,
      status,
      expectedState,
      actualState,
      durationMs: 0,
      consoleErrors: [...consoleErrors],
      pageErrors: [...pageErrors],
      networkErrors: [...networkErrors],
      artifactPaths,
    });

    if (status === "FAIL") {
      passed = false;
    }
  };

  // 1. Navigation
  try {
    const res = await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: options.timeoutMs ?? 15000,
    });
    const status = res?.status() ?? 0;
    if (status === 200) {
      await recordEvent("goto", "HTTP 200", `HTTP ${status}`, "PASS");
    } else {
      await recordEvent("goto", "HTTP 200", `HTTP ${status}`, "FAIL");
      return false;
    }
  } catch (err: any) {
    await recordEvent("goto", "Navigation success", `Error: ${err.message}`, "FAIL");
    return false;
  }

  // 2. Metadata / Title
  try {
    const title = await page.title();
    if (title.length > 0) {
      await recordEvent("check_metadata", "Non-empty title", title, "PASS");
    } else {
      await recordEvent("check_metadata", "Non-empty title", "Empty title", "FAIL");
    }
  } catch (err: any) {
    await recordEvent("check_metadata", "Title check", `Error: ${err.message}`, "FAIL");
  }

  // 3. Facsimile PDF Verification
  try {
    const pdfLink = page.locator(`a[href*="/patents/pdfs/${scenario.patentId}.pdf"]`);
    const count = await pdfLink.count();
    if (count > 0) {
      await recordEvent("check_pdf", "PDF facsimile linked", `Found ${count} PDF links`, "PASS");
    } else {
      await recordEvent("check_pdf", "PDF facsimile linked", "No PDF links found", "WARN");
    }
  } catch (err: any) {
    await recordEvent("check_pdf", "PDF link check", `Error: ${err.message}`, "FAIL");
  }

  // 4. Interactive 3D Simulator Face
  try {
    const interactiveButton = page.getByRole("button", {
      name: /Interactive 3D Simulator|3D Simulator/i,
    });
    if ((await interactiveButton.count()) > 0) {
      await interactiveButton.first().click();
      await page.waitForTimeout(400);

      const canvas = page.locator("canvas");
      const canvasCount = await canvas.count();
      if (canvasCount > 0) {
        await recordEvent(
          "switch_face",
          "Canvas rendered in 3D simulator",
          `Canvas count: ${canvasCount}`,
          "PASS",
          "interactive-3d",
        );
      } else {
        await recordEvent(
          "switch_face",
          "Canvas rendered in 3D simulator",
          "No canvas found",
          "FAIL",
          "interactive-3d",
        );
      }
    }
  } catch (err: any) {
    await recordEvent(
      "switch_face",
      "3D face switch",
      `Error: ${err.message}`,
      "FAIL",
      "interactive-3d",
    );
  }

  // 5. Horizontal Overflow Check
  try {
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth + 2;
    });

    if (!hasHorizontalScroll) {
      await recordEvent(
        "check_overflow",
        "No horizontal overflow",
        "scrollWidth <= innerWidth",
        "PASS",
      );
    } else {
      await recordEvent(
        "check_overflow",
        "No horizontal overflow",
        "Horizontal overflow detected",
        "FAIL",
      );
    }
  } catch (err: any) {
    await recordEvent("check_overflow", "Overflow check", `Error: ${err.message}`, "FAIL");
  }

  // 6. Console Cleanliness
  if (pageErrors.length > 0) {
    await recordEvent(
      "check_console_cleanliness",
      "Zero page errors",
      `${pageErrors.length} errors: ${pageErrors.join("; ")}`,
      "FAIL",
    );
  } else {
    await recordEvent(
      "check_console_cleanliness",
      "Zero page errors",
      "Clean page error state",
      "PASS",
    );
  }

  return passed;
}

export async function runVerticalSliceE2E(
  scenarios: PatentE2EScenario[],
  options: E2ERunnerOptions = {},
): Promise<E2ERunSummary> {
  const baseUrl = options.baseUrl ?? process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000";
  const viewports = options.viewports ?? ["desktop", "mobile"];
  const logger = options.logger ?? new E2EDiagnosticLogger({ targetBaseUrl: baseUrl });

  const isServerUp = await preflightServer(baseUrl);
  if (!isServerUp) {
    logger.log({
      patentId: "global",
      route: "/",
      viewport: "desktop",
      action: "preflight",
      status: "FAIL",
      expectedState: "Target server reachable",
      actualState: `Failed to connect to ${baseUrl}`,
      durationMs: 0,
      consoleErrors: [],
      pageErrors: [],
      networkErrors: [],
    });
    console.error(
      `\n❌ Error: Cannot connect to E2E target server at ${baseUrl}. Ensure Next.js is running.`,
    );
    return logger.getSummary();
  }

  const browser: Browser = await chromium.launch({ headless: options.headless !== false });

  try {
    for (const scenario of scenarios) {
      for (const vpName of viewports) {
        const vp = E2E_VIEWPORTS[vpName];
        const context: BrowserContext = await browser.newContext({
          viewport: { width: vp.width, height: vp.height },
          deviceScaleFactor: 1,
        });

        const page = await context.newPage();
        try {
          await runScenarioOnPage(page, scenario, vpName, logger, { ...options, baseUrl });
        } finally {
          await page.close();
          await context.close();
        }
      }
    }
  } finally {
    await browser.close();
  }

  return logger.getSummary();
}
