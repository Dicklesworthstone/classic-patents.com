/**
 * e2e-vertical-slice-audit.ts
 *
 * CLI runner for the data-driven patent vertical-slice E2E test harness.
 *
 * Usage:
 *   bun scripts/e2e-vertical-slice-audit.ts --patent us-821393-wright-flyer
 *   bun scripts/e2e-vertical-slice-audit.ts --patents us-821393-wright-flyer,us-381968-tesla-motor
 *   bun scripts/e2e-vertical-slice-audit.ts --all
 */

import { E2EDiagnosticLogger } from "../src/testing/e2e/logger";
import { buildPatentE2EScenario, getAllE2EScenarios } from "../src/testing/e2e/manifest";
import { runVerticalSliceE2E } from "../src/testing/e2e/runner";
import type { E2EViewportName, PatentE2EScenario } from "../src/testing/e2e/types";

async function main() {
  const args = process.argv.slice(2);
  const patentArg = args.find((a, i) => args[i - 1] === "--patent" || a.startsWith("--patent="));
  const patentsArg = args.find((a, i) => args[i - 1] === "--patents" || a.startsWith("--patents="));
  const isAll = args.includes("--all");
  const isFast = args.includes("--fast");
  const baseUrlArg = args.find(
    (a, i) => args[i - 1] === "--base-url" || a.startsWith("--base-url="),
  );

  const baseUrl =
    baseUrlArg?.replace("--base-url=", "") ?? process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000";

  const viewports: E2EViewportName[] = isFast ? ["desktop"] : ["desktop", "mobile"];

  let scenarios: PatentE2EScenario[] = [];

  if (patentArg) {
    const patentId = patentArg.includes("=")
      ? patentArg.split("=")[1]
      : args[args.indexOf("--patent") + 1];
    scenarios = [buildPatentE2EScenario(patentId)];
  } else if (patentsArg) {
    const rawIds = patentsArg.includes("=")
      ? patentsArg.split("=")[1]
      : args[args.indexOf("--patents") + 1];
    const ids = rawIds
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    scenarios = ids.map((id) => buildPatentE2EScenario(id));
  } else if (isAll) {
    scenarios = getAllE2EScenarios();
  } else {
    // Default to testing exemplar patents if unspecified
    const defaultIds = [
      "us-821393-wright-flyer",
      "us-381968-tesla-motor",
      "us-223898-edison-lightbulb",
      "us-78317-nobel-dynamite",
    ];
    scenarios = defaultIds.map((id) => buildPatentE2EScenario(id));
  }

  console.log("=======================================================================");
  console.log(`  Classic Patents Vertical-Slice E2E Harness`);
  console.log(`  Testing ${scenarios.length} patent scenario(s) against ${baseUrl}`);
  console.log(`  Viewports: ${viewports.join(", ")}`);
  console.log("=======================================================================\n");

  const logger = new E2EDiagnosticLogger({ targetBaseUrl: baseUrl });
  const summary = await runVerticalSliceE2E(scenarios, {
    baseUrl,
    viewports,
    logger,
  });

  console.log(logger.formatHumanReadableSummary());

  if (summary.failedActions > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal E2E runner error:", err);
  process.exit(1);
});
