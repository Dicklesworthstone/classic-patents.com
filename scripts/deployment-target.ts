import * as fs from "node:fs";
import * as path from "node:path";
import {
  completeArchivalEditionForViewer,
  patentForSourceReader,
} from "../src/data/editions/publicationApproval";
import { reviewedLedgerPublicationEvidenceFor } from "../src/data/editions/reviewedLedgerPublicationEvidence.server";
import { allPatents } from "../src/data/patents";
import type { Patent } from "../src/types/patent";

export const CANONICAL_PRODUCTION_PROJECT = {
  projectId: "prj_eeVw8BqcY9iO2e0VEQyS5i6rZkE0",
  projectName: "classic-patents",
  orgId: "team_F5Q3EH8Qxu3nDEOyEZLcQPe6",
  customDomains: ["classic-patents.com", "www.classic-patents.com"] as const,
  platformDomain: "classic-patents.vercel.app" as const,
} as const;

export const PROMOTION_REQUIRED_DOMAINS = [
  ...CANONICAL_PRODUCTION_PROJECT.customDomains,
  CANONICAL_PRODUCTION_PROJECT.platformDomain,
] as const;

export interface ProjectJsonConfig {
  projectId?: string;
  projectName?: string;
  orgId?: string;
  settings?: Record<string, unknown>;
}

export function assertCanonicalProjectIdentity(customPath?: string): ProjectJsonConfig {
  const filePath = customPath ?? path.join(process.cwd(), ".vercel", "project.json");
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `Deployment target check failed: ${filePath} does not exist. ` +
        `Link the workspace to the canonical production project with: vercel link --project ${CANONICAL_PRODUCTION_PROJECT.projectName}`,
    );
  }

  let config: ProjectJsonConfig;
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    config = JSON.parse(raw) as ProjectJsonConfig;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`Deployment target check failed: ${filePath} is invalid JSON: ${msg}`);
  }

  if (
    config.projectId !== CANONICAL_PRODUCTION_PROJECT.projectId ||
    config.projectName !== CANONICAL_PRODUCTION_PROJECT.projectName
  ) {
    throw new Error(
      `Deployment target mismatch: ${filePath} is linked to project "${config.projectName ?? "unknown"}" ` +
        `(${config.projectId ?? "unknown"}), but the canonical production project owning ${CANONICAL_PRODUCTION_PROJECT.customDomains[0]} ` +
        `is "${CANONICAL_PRODUCTION_PROJECT.projectName}" (${CANONICAL_PRODUCTION_PROJECT.projectId}). ` +
        `Refusing deployment to wrong project. Relink with: vercel link --project ${CANONICAL_PRODUCTION_PROJECT.projectName}`,
    );
  }

  return config;
}

export interface ParsedDeploymentInspect {
  id: string;
  name: string;
  target: string;
  status: string;
  url: string;
  aliases: string[];
}

export function parseDeploymentInspect(output: string): ParsedDeploymentInspect {
  const lines = output.split("\n");
  let id = "";
  let name = "";
  let target = "";
  let status = "";
  let url = "";
  const aliases: string[] = [];

  let inAliases = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (line === "Aliases") {
      inAliases = true;
      continue;
    }
    if (line === "Builds" || line === "General") {
      inAliases = false;
      continue;
    }

    if (inAliases) {
      const aliasMatch = line.match(/(?:╶\s+)?https?:\/\/([^\s]+)/);
      if (aliasMatch) {
        aliases.push(aliasMatch[1].replace(/\/$/, ""));
      }
      continue;
    }

    const idMatch = line.match(/^id\s+([^\s]+)/i);
    if (idMatch) {
      id = idMatch[1];
      continue;
    }
    const nameMatch = line.match(/^name\s+([^\s]+)/i);
    if (nameMatch) {
      name = nameMatch[1];
      continue;
    }
    const targetMatch = line.match(/^target\s+([^\s]+)/i);
    if (targetMatch) {
      target = targetMatch[1];
      continue;
    }
    const statusMatch = line.match(/^status\s+(.+)$/i);
    if (statusMatch) {
      status = statusMatch[1].trim();
      continue;
    }
    const urlMatch = line.match(/^url\s+https?:\/\/([^\s]+)/i);
    if (urlMatch) {
      url = urlMatch[1].replace(/\/$/, "");
    }
  }

  return { id, name, target, status, url, aliases };
}

export function assertDeploymentReadyAndAliased(
  inspectOutput: string,
  requiredDomains: readonly string[] = CANONICAL_PRODUCTION_PROJECT.customDomains,
): ParsedDeploymentInspect {
  const parsed = parseDeploymentInspect(inspectOutput);

  if (!parsed.status.toLowerCase().includes("ready")) {
    throw new Error(
      `Deployment is not Ready (current status: "${parsed.status || "unknown"}", url: "${parsed.url || "unknown"}"). ` +
        `Refusing release promotion.`,
    );
  }

  const normalizedAliases = new Set(
    parsed.aliases.map((a) =>
      a
        .replace(/^https?:\/\//, "")
        .replace(/\/$/, "")
        .toLowerCase(),
    ),
  );

  const missingDomains = requiredDomains.filter((req) => !normalizedAliases.has(req.toLowerCase()));

  if (missingDomains.length > 0) {
    throw new Error(
      `Deployment ${parsed.url} (${parsed.id}) is Ready, but missing required production alias(es): ` +
        `${missingDomains.join(", ")}. Existing aliases: [${parsed.aliases.join(", ")}]. ` +
        `Refusing release promotion without live custom domain aliases attached.`,
    );
  }

  return parsed;
}

export type SourceDeliveryMode = "edition" | "transcript" | "facsimile";

export interface PatentSourceRoute {
  patentId: string;
  patentNumber: string;
  title: string;
  route: string;
  specUrl: string;
  expectedDeliveryMode: SourceDeliveryMode;
}

export function deriveExpectedDeliveryMode(patent: Patent): SourceDeliveryMode {
  const viewerPatent = patentForSourceReader(patent);
  const archivalSource = completeArchivalEditionForViewer(viewerPatent);
  if (archivalSource) {
    return "edition";
  }
  const hasLedger = Boolean(reviewedLedgerPublicationEvidenceFor(patent));
  if (hasLedger) {
    return "transcript";
  }
  return "facsimile";
}

export function buildPatentSourceRouteManifest(
  patents: readonly Patent[] = allPatents,
): PatentSourceRoute[] {
  return patents.map((patent) => {
    return {
      patentId: patent.id,
      patentNumber: patent.patentNumber,
      title: patent.shortTitle,
      route: `/patents/${patent.id}`,
      specUrl: `/patents/${patent.id}?view=original-spec`,
      expectedDeliveryMode: deriveExpectedDeliveryMode(patent),
    };
  });
}

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
  "The held preview set requires complete source-crop acceptance",
] as const;

export interface SourceReaderSweepOptions {
  baseUrl: string;
  routes?: readonly PatentSourceRoute[];
  concurrency?: number;
  timeoutMs?: number;
  jsonlOutputPath?: string;
  evidenceDirectory?: string;
}

export interface RouteSweepResult {
  patentId: string;
  specUrl: string;
  expectedDeliveryMode: SourceDeliveryMode;
  actualDeliveryMode: SourceDeliveryMode | "missing" | "error";
  durationMs: number;
  status: "pass" | "fail";
  error?: string;
  consoleErrors: string[];
  pageErrors: string[];
}

export interface SweepSummary {
  runId: string;
  baseUrl: string;
  totalRoutes: number;
  passed: number;
  failed: number;
  durationMs: number;
  results: RouteSweepResult[];
}

export async function runSourceReaderBrowserSweep(
  options: SourceReaderSweepOptions,
): Promise<SweepSummary> {
  const { chromium } = await import("playwright");
  const routes = options.routes ?? buildPatentSourceRouteManifest();
  const concurrency = Math.max(1, Math.min(options.concurrency ?? 4, 8));
  const timeoutMs = options.timeoutMs ?? 20_000;
  const runId = `sweep-${Date.now()}`;
  const evidenceDir =
    options.evidenceDirectory ?? path.join(process.cwd(), "artifacts", "deploy-sweeps", runId);

  fs.mkdirSync(evidenceDir, { recursive: true });

  const externalTmp = process.env.TMPDIR?.startsWith("/Volumes/") ? process.env.TMPDIR : undefined;
  if (externalTmp) {
    delete process.env.TMPDIR;
  }

  const startTime = Date.now();
  const results: RouteSweepResult[] = [];

  try {
    const browser = await chromium.launch({ headless: true });

    try {
      const queue = [...routes];
      const workerPromises = Array.from({ length: concurrency }, async () => {
        const context = await browser.newContext({
          viewport: { width: 1440, height: 900 },
          userAgent: "ClassicPatents-ReleaseGate-Sweep/1.0",
        });

        while (queue.length > 0) {
          const route = queue.shift();
          if (!route) break;

          const routeStartTime = Date.now();
          const consoleErrors: string[] = [];
          const pageErrors: string[] = [];
          const page = await context.newPage();

          page.on("console", (msg) => {
            if (msg.type() === "error") {
              const text = msg.text();
              if (!text.includes("ERR_ABORTED") && !text.includes("favicon.ico")) {
                consoleErrors.push(text);
              }
            }
          });

          page.on("pageerror", (err) => {
            pageErrors.push(err.message);
          });

          let routeStatus: "pass" | "fail" = "pass";
          let failureError: string | undefined;
          let actualDelivery: SourceDeliveryMode | "missing" | "error" = "missing";

          try {
            const targetUrl = `${options.baseUrl.replace(/\/$/, "")}${route.specUrl}`;
            const response = await page.goto(targetUrl, {
              timeout: timeoutMs,
              waitUntil: "domcontentloaded",
            });

            if (!response || response.status() >= 400) {
              throw new Error(`HTTP ${response?.status() ?? "unknown"} loading ${targetUrl}`);
            }

            // Wait for viewer hydration
            const viewerLocator = page.locator('[data-testid="dual-projection-viewer"]');
            await viewerLocator.waitFor({ state: "visible", timeout: timeoutMs });

            const deliveryAttr = await viewerLocator.getAttribute("data-source-delivery");
            actualDelivery = (deliveryAttr as SourceDeliveryMode) || "missing";

            if (actualDelivery !== route.expectedDeliveryMode) {
              throw new Error(
                `Expected delivery mode "${route.expectedDeliveryMode}", but received "${actualDelivery}"`,
              );
            }

            // Check for forbidden audit hold strings anywhere on the page
            const bodyText = (await page.textContent("body")) ?? "";
            for (const forbidden of FORBIDDEN_AUDIT_HOLD_STRINGS) {
              if (bodyText.includes(forbidden)) {
                throw new Error(
                  `Found forbidden audit hold string on visitor source reader: "${forbidden}"`,
                );
              }
            }

            // Delivery-mode-specific verification
            if (actualDelivery === "edition") {
              const specHeading = page.getByRole("heading", {
                name: /Specification of Letters Patent/i,
              });
              await specHeading.waitFor({ state: "visible", timeout: 5_000 });
            } else if (actualDelivery === "transcript") {
              const transcriptFallback = page.locator(
                '[data-testid="reviewed-transcript-fallback"]',
              );
              await transcriptFallback.waitFor({ state: "visible", timeout: 5_000 });
              const preText = (await transcriptFallback.locator("pre").textContent()) ?? "";
              if (!preText.includes("--- REVIEWED TRANSCRIPTION PAGE 1 OF ")) {
                throw new Error(
                  `Transcript mode did not render page markers; prefix: ${preText.slice(0, 50)}`,
                );
              }
            } else if (actualDelivery === "facsimile") {
              const facsimileFallback = page.locator('[data-testid="source-facsimile-fallback"]');
              await facsimileFallback.waitFor({ state: "visible", timeout: 5_000 });
            }

            if (pageErrors.length > 0) {
              throw new Error(`Uncaught page error(s): ${pageErrors.join("; ")}`);
            }
          } catch (err: unknown) {
            routeStatus = "fail";
            failureError = err instanceof Error ? err.message : String(err);

            // Capture failure artifacts
            const screenshotPath = path.join(evidenceDir, `${route.patentId}-failure.png`);
            const htmlPath = path.join(evidenceDir, `${route.patentId}-failure.html`);
            await page.screenshot({ path: screenshotPath, fullPage: true }).catch(() => undefined);
            const html = await page.content().catch(() => "");
            if (html) {
              fs.writeFileSync(htmlPath, html, "utf8");
            }
          } finally {
            await page.close().catch(() => undefined);
          }

          const durationMs = Date.now() - routeStartTime;
          results.push({
            patentId: route.patentId,
            specUrl: route.specUrl,
            expectedDeliveryMode: route.expectedDeliveryMode,
            actualDeliveryMode: actualDelivery,
            durationMs,
            status: routeStatus,
            error: failureError,
            consoleErrors,
            pageErrors,
          });

          if (routeStatus === "pass") {
            process.stdout.write(".");
          } else {
            process.stdout.write(`\n❌ [${route.patentId}]: ${failureError}\n`);
          }
        }

        await context.close();
      });

      await Promise.all(workerPromises);
    } finally {
      await browser.close();
    }
  } finally {
    if (externalTmp) {
      process.env.TMPDIR = externalTmp;
    }
  }

  const totalDuration = Date.now() - startTime;
  const passed = results.filter((r) => r.status === "pass").length;
  const failed = results.filter((r) => r.status === "fail").length;

  const summary: SweepSummary = {
    runId,
    baseUrl: options.baseUrl,
    totalRoutes: routes.length,
    passed,
    failed,
    durationMs: totalDuration,
    results,
  };

  if (options.jsonlOutputPath) {
    const jsonlLines = results.map((r) =>
      JSON.stringify({
        schema: "classic-patents.deploy-sweep.v1",
        runId,
        timestamp: new Date().toISOString(),
        ...r,
      }),
    );
    fs.writeFileSync(options.jsonlOutputPath, `${jsonlLines.join("\n")}\n`, "utf8");
  }

  return summary;
}
