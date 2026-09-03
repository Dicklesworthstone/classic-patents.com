/**
 * deployment-verification.ts
 *
 * Enforces canonical Vercel production project identity, verifies domain alias
 * ownership, and runs headless browser source-reader sweeps across patent routes.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { type Browser, chromium, type Page } from "playwright";
import { allPatents, LEGACY_PATENT_REDIRECTS } from "../src/data/patents";
import { classifyPatentE2EDiagnostic } from "./patent-e2e-contract";

export const CANONICAL_VERCEL_PROJECT_ID = "prj_eeVw8BqcY9iO2e0VEQyS5i6rZkE0";
export const CANONICAL_VERCEL_ORG_ID = "team_F5Q3EH8Qxu3nDEOyEZLcQPe6";
export const CANONICAL_VERCEL_PROJECT_NAME = "classic-patents";

export const CANONICAL_PUBLIC_HOSTNAMES = [
  "classic-patents.com",
  "www.classic-patents.com",
] as const;
export const CANONICAL_PLATFORM_HOSTNAME = "classic-patents.vercel.app";

export const FORBIDDEN_AUDIT_HOLD_STRINGS = [
  "Complete archival edition is not published yet",
  "AUDIT_FIGURE_ACCEPTANCE_PENDING",
  "AUDIT_FACSIMILE_REVIEW_PENDING",
  "AUDIT_LEDGER_ACCEPTANCE_PENDING",
  "AUDIT_FULL_SPECIFICATION_PENDING",
  "AUDIT_PRIMARY_FACSIMILE_PENDING",
  "AUDIT_RECONSTRUCTION_QUARANTINE",
  "FABRICATION_OR_RECONSTRUCTION_QUARANTINE",
  "Review status: held",
  "source-text-excerpt",
  "source-withheld-banner",
  "Archival Edition Held",
  "The held preview set requires complete source-crop acceptance",
] as const;

export interface VercelProjectConfig {
  projectId: string;
  orgId: string;
  projectName: string;
}

export interface SourceReaderSweepOptions {
  baseUrl: string;
  patentIds?: readonly string[];
  viewport?: { width: number; height: number };
  timeoutMs?: number;
  outputLogPath?: string;
}

export interface SourceReaderRouteResult {
  route: string;
  patentId: string;
  status: "pass" | "fail";
  deliveryMode: "edition" | "transcript" | "facsimile" | "unknown";
  durationMs: number;
  error?: string;
  consoleErrors: string[];
  pageErrors: string[];
}

export interface SourceReaderSweepResult {
  total: number;
  passed: number;
  failed: number;
  durationMs: number;
  results: SourceReaderRouteResult[];
}

/**
 * Validates that the provided .vercel/project.json content exactly matches the
 * canonical production project that owns classic-patents.com.
 */
export function parseAndValidateVercelProjectConfig(
  projectJsonContent: string,
): VercelProjectConfig {
  let parsed: unknown;
  try {
    parsed = JSON.parse(projectJsonContent);
  } catch (err: any) {
    throw new Error(`Invalid JSON in .vercel/project.json: ${err.message}`);
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error(".vercel/project.json content must be a JSON object.");
  }

  const raw = parsed as Partial<VercelProjectConfig>;

  if (!raw.projectId || typeof raw.projectId !== "string") {
    throw new Error(".vercel/project.json is missing required 'projectId' string.");
  }
  if (!raw.orgId || typeof raw.orgId !== "string") {
    throw new Error(".vercel/project.json is missing required 'orgId' string.");
  }
  if (!raw.projectName || typeof raw.projectName !== "string") {
    throw new Error(".vercel/project.json is missing required 'projectName' string.");
  }

  if (raw.projectName !== CANONICAL_VERCEL_PROJECT_NAME) {
    throw new Error(
      `Incorrect Vercel projectName: expected '${CANONICAL_VERCEL_PROJECT_NAME}', found '${raw.projectName}'. ` +
        `Duplicate projects (such as 'classic-patents.com') do not own the production domain alias and will cause silent deployment divergence.`,
    );
  }

  if (raw.projectId !== CANONICAL_VERCEL_PROJECT_ID) {
    throw new Error(
      `Incorrect Vercel projectId: expected '${CANONICAL_VERCEL_PROJECT_ID}', found '${raw.projectId}'. ` +
        `Refusing to deploy to a non-canonical Vercel project target.`,
    );
  }

  if (raw.orgId !== CANONICAL_VERCEL_ORG_ID) {
    throw new Error(
      `Incorrect Vercel orgId: expected '${CANONICAL_VERCEL_ORG_ID}', found '${raw.orgId}'.`,
    );
  }

  return {
    projectId: raw.projectId,
    orgId: raw.orgId,
    projectName: raw.projectName,
  };
}

/**
 * Reads and verifies the project identity from disk (.vercel/project.json).
 */
export function assertCanonicalVercelProject(customPath?: string): VercelProjectConfig {
  const filePath = customPath ?? path.join(process.cwd(), ".vercel", "project.json");
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `Missing .vercel/project.json at ${filePath}. Link the repository to the canonical '${CANONICAL_VERCEL_PROJECT_NAME}' project before deploying.`,
    );
  }
  const content = fs.readFileSync(filePath, "utf8");
  return parseAndValidateVercelProjectConfig(content);
}

/**
 * Asserts that the deployment's aliases include the required production custom domains.
 */
export function assertDeploymentHasRequiredAliases(
  aliases: readonly string[],
  requiredHostnames: readonly string[] = CANONICAL_PUBLIC_HOSTNAMES,
): void {
  const normalized = aliases.map((a) =>
    a
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/\/$/, ""),
  );

  const missing = requiredHostnames.filter((host) => !normalized.includes(host.toLowerCase()));

  if (missing.length > 0) {
    throw new Error(
      `Deployment does not possess required domain aliases: [${missing.join(", ")}]. ` +
        `Available aliases: [${normalized.join(", ")}]. Refusing promotion.`,
    );
  }
}

/**
 * Returns all valid, non-redirect patent IDs in canonical catalog order.
 */
export function getNonRedirectPatentIds(): string[] {
  const redirectKeys = new Set(Object.keys(LEGACY_PATENT_REDIRECTS));
  return allPatents.map((p) => p.id).filter((id) => !redirectKeys.has(id));
}

/**
 * Headless browser check that visits patent routes with `?view=original-spec`,
 * waiting for URL-hydrated source state and asserting complete source face delivery.
 */
export async function runLiveSourceReaderSweep(
  options: SourceReaderSweepOptions,
): Promise<SourceReaderSweepResult> {
  const {
    baseUrl,
    patentIds = getNonRedirectPatentIds(),
    viewport = { width: 1440, height: 900 },
    timeoutMs = 15_000,
    outputLogPath,
  } = options;

  const results: SourceReaderRouteResult[] = [];
  const startTime = Date.now();

  const browser: Browser = await chromium.launch({
    headless: true,
  });

  try {
    const context = await browser.newContext({
      viewport,
      userAgent: "ClassicPatentsSourceReaderSweep/1.0",
      deviceScaleFactor: 1,
    });

    for (const id of patentIds) {
      const route = `/patents/${id}?view=original-spec`;
      const fullUrl = `${baseUrl.replace(/\/$/, "")}${route}`;
      const routeStart = Date.now();

      const consoleErrors: string[] = [];
      const pageErrors: string[] = [];

      const page: Page = await context.newPage();

      page.on("console", (msg) => {
        if (msg.type() === "error") {
          const text = msg.text();
          const classification = classifyPatentE2EDiagnostic(text);
          if (!classification.allowed) {
            consoleErrors.push(text);
          }
        }
      });

      page.on("pageerror", (err) => {
        const message = err.message;
        const classification = classifyPatentE2EDiagnostic(message);
        if (!classification.allowed) {
          pageErrors.push(message);
        }
      });

      let status: "pass" | "fail" = "pass";
      let deliveryMode: "edition" | "transcript" | "facsimile" | "unknown" = "unknown";
      let failureReason: string | undefined;

      try {
        const response = await page.goto(fullUrl, {
          waitUntil: "domcontentloaded",
          timeout: timeoutMs,
        });

        if (!response?.ok()) {
          status = "fail";
          failureReason = `HTTP ${response?.status() ?? "no response"}`;
        } else {
          // Wait for dual-projection-viewer container to hydrate
          const viewer = page.locator('[data-testid="dual-projection-viewer"]');
          await viewer.waitFor({ state: "visible", timeout: timeoutMs });

          const deliveryAttr = await viewer.getAttribute("data-source-delivery");
          if (
            deliveryAttr === "edition" ||
            deliveryAttr === "transcript" ||
            deliveryAttr === "facsimile"
          ) {
            deliveryMode = deliveryAttr;
          } else {
            status = "fail";
            failureReason = `Invalid or missing data-source-delivery attribute: '${deliveryAttr}'`;
          }

          // Prohibit historic withheld banner, audit holds, or truncated excerpt
          const content = await page.content();
          for (const forbidden of FORBIDDEN_AUDIT_HOLD_STRINGS) {
            if (content.includes(forbidden)) {
              status = "fail";
              failureReason = `Found prohibited audit hold string in DOM: '${forbidden}'`;
              break;
            }
          }

          if (consoleErrors.length > 0) {
            status = "fail";
            failureReason = `Uncaught console error(s): ${consoleErrors.join("; ")}`;
          }
          if (pageErrors.length > 0) {
            status = "fail";
            failureReason = `Uncaught page error(s): ${pageErrors.join("; ")}`;
          }
        }
      } catch (err: any) {
        status = "fail";
        failureReason = err.message || String(err);
      } finally {
        await page.close();
      }

      const durationMs = Date.now() - routeStart;
      const result: SourceReaderRouteResult = {
        route,
        patentId: id,
        status,
        deliveryMode,
        durationMs,
        error: failureReason,
        consoleErrors,
        pageErrors,
      };

      results.push(result);

      if (outputLogPath) {
        const logEntry = JSON.stringify({
          schema: "classic-patents.source-reader-sweep.v1",
          timestamp: new Date().toISOString(),
          ...result,
        });
        fs.appendFileSync(outputLogPath, `${logEntry}\n`);
      }
    }
  } finally {
    await browser.close();
  }

  const passed = results.filter((r) => r.status === "pass").length;
  const failed = results.filter((r) => r.status === "fail").length;

  return {
    total: results.length,
    passed,
    failed,
    durationMs: Date.now() - startTime,
    results,
  };
}
