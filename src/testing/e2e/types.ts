/**
 * types.ts
 *
 * Strongly-typed data models for the Classic Patents vertical-slice E2E test harness,
 * scenario manifests, structured diagnostic logging, and failure evidence management.
 */

export type E2EViewportName = "desktop" | "tablet" | "mobile";

export interface E2EViewport {
  name: E2EViewportName;
  width: number;
  height: number;
}

export const E2E_VIEWPORTS: Record<E2EViewportName, E2EViewport> = {
  desktop: { name: "desktop", width: 1440, height: 900 },
  tablet: { name: "tablet", width: 768, height: 1024 },
  mobile: { name: "mobile", width: 320, height: 800 },
} as const;

export type E2EActionType =
  | "goto"
  | "preflight"
  | "check_metadata"
  | "check_pdf"
  | "switch_face"
  | "operate_control"
  | "verify_telemetry"
  | "verify_equation"
  | "verify_claim_probe"
  | "verify_figure_preview"
  | "check_refusal"
  | "check_overflow"
  | "check_a11y"
  | "check_theme"
  | "check_console_cleanliness";

export type E2EFaceName =
  | "overview"
  | "interactive-3d"
  | "original-text"
  | "plain-english"
  | "schematic-2d"
  | "claim-decoders";

export interface E2ELogEvent {
  schemaVersion: "1.0.0";
  runId: string;
  timestamp: string;
  patentId: string;
  route: string;
  viewport: E2EViewportName;
  face?: E2EFaceName;
  action: E2EActionType;
  status: "PASS" | "FAIL" | "SKIP" | "WARN";
  expectedState?: string;
  actualState?: string;
  durationMs: number;
  httpStatus?: number;
  consoleErrors: string[];
  pageErrors: string[];
  networkErrors: string[];
  controlsTested?: Record<string, number | string>;
  kernelSource?: string;
  telemetrySnapshot?: Record<string, string | number>;
  refusalReason?: string;
  digest?: string;
  artifactPaths?: {
    screenshot?: string;
    domSnapshot?: string;
    trace?: string;
  };
}

export interface PatentE2EControlSpec {
  id: string;
  label?: string;
  testValue: number | string;
}

export interface PatentE2EScenario {
  patentId: string;
  patentNumber: string;
  title: string;
  isArchivalPublished: boolean;
  hasFigures: boolean;
  figureCount: number;
  claimCount: number;
  supports3D: boolean;
  supports2D: boolean;
  primaryControls: PatentE2EControlSpec[];
  expectedTelemetryLabels: string[];
  hasEnergyOmission: boolean;
  energyOmissionReason?: string;
  claimProbeNumbers: number[];
}

export interface E2ERunSummary {
  runId: string;
  startTime: string;
  endTime: string;
  totalDurationMs: number;
  targetBaseUrl: string;
  totalPatentsTested: number;
  totalActions: number;
  passedActions: number;
  failedActions: number;
  skippedActions: number;
  failures: Array<{
    patentId: string;
    viewport: E2EViewportName;
    face?: E2EFaceName;
    action: E2EActionType;
    error: string;
    artifactPaths?: {
      screenshot?: string;
      domSnapshot?: string;
      trace?: string;
    };
  }>;
}
