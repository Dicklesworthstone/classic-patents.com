import { describe, expect, it } from "bun:test";
import { E2EDiagnosticLogger } from "./logger";

describe("E2EDiagnosticLogger", () => {
  it("initializes and logs structured JSONL events", () => {
    const logger = new E2EDiagnosticLogger({
      runId: `test-run-${Date.now()}`,
      targetBaseUrl: "http://127.0.0.1:3088",
    });

    logger.log({
      patentId: "us-821393-wright-flyer",
      route: "/patents/us-821393-wright-flyer",
      viewport: "desktop",
      face: "interactive-3d",
      action: "switch_face",
      status: "PASS",
      expectedState: "Canvas present",
      actualState: "1 canvas found",
      durationMs: 120,
      consoleErrors: [],
      pageErrors: [],
      networkErrors: [],
    });

    const events = logger.getEvents();
    expect(events.length).toBe(1);
    expect(events[0].schemaVersion).toBe("1.0.0");
    expect(events[0].patentId).toBe("us-821393-wright-flyer");
    expect(events[0].status).toBe("PASS");

    const summary = logger.getSummary();
    expect(summary.totalPatentsTested).toBe(1);
    expect(summary.passedActions).toBe(1);
    expect(summary.failedActions).toBe(0);

    const report = logger.formatHumanReadableSummary();
    expect(report).toContain("Classic Patents Vertical-Slice E2E Harness Report");
    expect(report).toContain("ALL VISITOR-FACING ACTIONS AND VERTICAL SLICES PASSED CLEANLY");
  });

  it("records and aggregates failures accurately", () => {
    const logger = new E2EDiagnosticLogger({
      runId: `test-fail-${Date.now()}`,
    });

    logger.log({
      patentId: "us-381968-tesla-motor",
      route: "/patents/us-381968-tesla-motor",
      viewport: "mobile",
      action: "check_overflow",
      status: "FAIL",
      expectedState: "No overflow",
      actualState: "Horizontal scrollbar detected",
      durationMs: 45,
      consoleErrors: [],
      pageErrors: [],
      networkErrors: [],
    });

    const summary = logger.getSummary();
    expect(summary.failedActions).toBe(1);
    expect(summary.failures.length).toBe(1);
    expect(summary.failures[0].patentId).toBe("us-381968-tesla-motor");
    expect(summary.failures[0].error).toContain("Horizontal scrollbar detected");

    const report = logger.formatHumanReadableSummary();
    expect(report).toContain("FAILURES DETECTED");
    expect(report).toContain("[us-381968-tesla-motor] [mobile]");
  });
});
