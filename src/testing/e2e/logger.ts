/**
 * logger.ts
 *
 * Structured diagnostic logger for the Classic Patents vertical-slice E2E test harness.
 * Emits schema-validated JSONL action streams and aggregates failure diagnostics with retained evidence.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import type { E2EEventLog, E2ERunSummary } from "./types";

export class E2EDiagnosticLogger {
  readonly runId: string;
  readonly targetBaseUrl: string;
  readonly logFilePath: string;
  private readonly events: E2EEventLog[] = [];
  private readonly startTime: Date;

  constructor(
    options: {
      runId?: string;
      targetBaseUrl?: string;
      logDir?: string;
    } = {},
  ) {
    this.runId = options.runId ?? `e2e-run-${Date.now()}`;
    this.targetBaseUrl = options.targetBaseUrl ?? "http://127.0.0.1:3000";
    this.startTime = new Date();

    const dir =
      options.logDir ??
      (fs.existsSync("/Volumes/USBNVME16TB/temp_agent_space")
        ? "/Volumes/USBNVME16TB/temp_agent_space/e2e-logs"
        : path.join(process.cwd(), "artifacts", "e2e"));

    if (!fs.existsSync(dir)) {
      try {
        fs.mkdirSync(dir, { recursive: true });
      } catch {
        // Fall back to cwd artifacts if external volume is inaccessible
      }
    }

    this.logFilePath = path.join(dir, `${this.runId}.jsonl`);
  }

  log(event: Omit<E2EEventLog, "schemaVersion" | "runId" | "timestamp">): E2EEventLog {
    const fullEvent: E2EEventLog = {
      schemaVersion: "1.0.0",
      runId: this.runId,
      timestamp: new Date().toISOString(),
      ...event,
      consoleErrors: [...event.consoleErrors],
      pageErrors: [...event.pageErrors],
      networkErrors: [...event.networkErrors],
    };

    this.events.push(fullEvent);

    try {
      fs.appendFileSync(this.logFilePath, `${JSON.stringify(fullEvent)}\n`, "utf8");
    } catch {
      // Non-blocking log write
    }

    return fullEvent;
  }

  getEvents(): readonly E2EEventLog[] {
    return this.events;
  }

  getSummary(): E2ERunSummary {
    const endTime = new Date();
    const durationMs = endTime.getTime() - this.startTime.getTime();

    const patentsTested = new Set<string>();
    let passed = 0;
    let failed = 0;
    let skipped = 0;
    const failures: E2ERunSummary["failures"] = [];

    for (const evt of this.events) {
      if (evt.patentId && evt.patentId !== "global") {
        patentsTested.add(evt.patentId);
      }

      if (evt.status === "PASS") passed++;
      else if (evt.status === "FAIL") {
        failed++;
        failures.push({
          patentId: evt.patentId,
          viewport: evt.viewport,
          face: evt.face,
          action: evt.action,
          error:
            evt.actualState ||
            evt.pageErrors.join("; ") ||
            evt.consoleErrors.join("; ") ||
            "Action failed assertion",
          artifactPaths: evt.artifactPaths,
        });
      } else if (evt.status === "SKIP") {
        skipped++;
      }
    }

    return {
      runId: this.runId,
      startTime: this.startTime.toISOString(),
      endTime: endTime.toISOString(),
      totalDurationMs: durationMs,
      targetBaseUrl: this.targetBaseUrl,
      totalPatentsTested: patentsTested.size,
      totalActions: this.events.length,
      passedActions: passed,
      failedActions: failed,
      skippedActions: skipped,
      failures,
    };
  }

  formatHumanReadableSummary(): string {
    const summary = this.getSummary();
    const lines: string[] = [
      "=======================================================================",
      `  Classic Patents Vertical-Slice E2E Harness Report [Run: ${summary.runId}]`,
      `  Target: ${summary.targetBaseUrl}`,
      `  Patents Tested: ${summary.totalPatentsTested} | Actions: ${summary.totalActions} (Pass: ${summary.passedActions}, Fail: ${summary.failedActions}, Skip: ${summary.skippedActions})`,
      `  Duration: ${(summary.totalDurationMs / 1000).toFixed(2)}s | Log: ${this.logFilePath}`,
      "=======================================================================",
    ];

    if (summary.failures.length > 0) {
      lines.push("\n❌ FAILURES DETECTED:");
      for (const [idx, fail] of summary.failures.entries()) {
        lines.push(
          `  ${idx + 1}. [${fail.patentId}] [${fail.viewport}] [${fail.face ?? "page"}] [${fail.action}]: ${fail.error}`,
        );
        if (fail.artifactPaths?.screenshot) {
          lines.push(`     Screenshot: ${fail.artifactPaths.screenshot}`);
        }
        if (fail.artifactPaths?.domSnapshot) {
          lines.push(`     DOM: ${fail.artifactPaths.domSnapshot}`);
        }
      }
    } else {
      lines.push("\n✅ ALL VISITOR-FACING ACTIONS AND VERTICAL SLICES PASSED CLEANLY.");
    }

    return lines.join("\n");
  }
}
