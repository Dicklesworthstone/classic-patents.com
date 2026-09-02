import type {
  ArchivalPublicationDecision,
  ArchivalPublicationStateKind,
} from "../src/data/editions/archivalPublicationState";
import type { Patent } from "../src/types/patent";

export const PATENT_E2E_LOG_SCHEMA = "classic-patents.e2e-event.v1" as const;
export const PATENT_E2E_SUMMARY_SCHEMA = "classic-patents.e2e-summary.v1" as const;

export const PATENT_E2E_VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 768, height: 1024 },
  phone: { width: 320, height: 800 },
} as const;

export type PatentE2EViewportName = keyof typeof PATENT_E2E_VIEWPORTS;
export type PatentE2EEventStatus = "info" | "pass" | "fail";
export type PatentE2ESourceState = "published" | "withheld";

export interface PatentE2EControl {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit: string;
}

export interface PatentE2EScenario {
  patentId: string;
  patentNumber: string;
  title: string;
  route: string;
  pdfUrl: string;
  sourceState: PatentE2ESourceState;
  sourcePublicationState: ArchivalPublicationStateKind;
  sourceReasonCode: string;
  sourceDecision: {
    completeFacsimileReviewed: boolean;
    ledgerKind: string | undefined;
    ledgerReviewer: string | null;
    ledgerReviewedAt: string | null;
    digestParity: "matching" | "mismatched" | "unavailable";
    requiredFigureCount: number;
    acceptedFigureCount: number;
    figureAttestation: {
      reviewer: string;
      reviewedAt: string;
      acceptanceBasis: string;
      sourcePdfSha256: string;
      acceptedOccurrenceCount: number;
      acceptedAssetCount: number;
      matchesEdition: boolean;
    } | null;
    evidenceReferences: readonly string[];
  };
  claimCount: number;
  drawingCount: number;
  hasReviewedLedger: boolean;
  hasStoredEdition: boolean;
  figurePreviewUrls: readonly string[];
  equationIds: readonly string[];
  claimProbeCount: number;
  hasEnergyChannels: boolean;
  controls: readonly PatentE2EControl[];
}

export interface PatentE2EEvent {
  schemaVersion: typeof PATENT_E2E_LOG_SCHEMA;
  runId: string;
  sequence: number;
  timestamp: string;
  patentId: string;
  route: string;
  viewport: PatentE2EViewportName | "run";
  face: string;
  action: string;
  status: PatentE2EEventStatus;
  durationMs: number;
  expected?: unknown;
  actual?: unknown;
  responseStatus?: number;
  controls?: Record<string, string | number | boolean>;
  kernelSource?: string;
  telemetry?: string;
  refusal?: string;
  digest?: string;
  errors?: readonly string[];
  consoleErrors?: readonly string[];
  pageErrors?: readonly string[];
  networkErrors?: readonly string[];
  artifactPaths?: readonly string[];
}

export interface PatentE2ESummary {
  schemaVersion: typeof PATENT_E2E_SUMMARY_SCHEMA;
  runId: string;
  startedAt: string;
  finishedAt: string;
  baseUrl: string;
  selectedPatents: readonly string[];
  selectedViewports: readonly PatentE2EViewportName[];
  eventCount: number;
  passedActions: number;
  failedActions: number;
  failedPatents: readonly string[];
  artifactDirectory: string;
  actionGroups: readonly PatentE2EActionGroup[];
}

export interface PatentE2EActionGroup {
  patentId: string;
  viewport: PatentE2EViewportName | "run";
  face: string;
  action: string;
  eventCount: number;
  passedActions: number;
  failedActions: number;
  artifactPaths: readonly string[];
  kernelSources: readonly string[];
  refusalReasons: readonly string[];
}

export interface PatentE2EOptions {
  baseUrl: string;
  outputRoot: string;
  patentIds: string[];
  all: boolean;
  changed: boolean;
  headed: boolean;
  failFast: boolean;
  selfTestFailure: boolean;
  viewports: PatentE2EViewportName[];
}

interface ScenarioFacts {
  isEditionPublished: (patent: Patent) => boolean;
  publicationDecision?: (patent: Patent) => ArchivalPublicationDecision;
  assetExists?: (publicUrl: string) => boolean;
  equationIdsForPatent?: (patent: Patent) => readonly string[];
  claimProbeCountForPatent?: (patent: Patent) => number;
  hasEnergyChannelsForPatent?: (patent: Patent) => boolean;
  controlsForPatent?: (patent: Patent) => readonly PatentE2EControl[];
}

const DEFAULT_OPTIONS: PatentE2EOptions = {
  baseUrl: process.env.E2E_BASE_URL ?? "http://127.0.0.1:3088",
  outputRoot: process.env.E2E_OUTPUT_DIR ?? "artifacts/e2e-patent-vertical-slices",
  patentIds: [],
  all: false,
  changed: false,
  headed: false,
  failFast: false,
  selfTestFailure: false,
  viewports: ["desktop", "tablet", "phone"],
};

export function buildPatentE2EScenarios(
  patents: readonly Patent[],
  facts: ScenarioFacts,
): PatentE2EScenario[] {
  const seen = new Set<string>();
  return patents.map((patent) => {
    if (seen.has(patent.id)) {
      throw new Error(`Duplicate patent id in E2E scenario manifest: ${patent.id}`);
    }
    seen.add(patent.id);

    if (
      !patent.originalPdfUrl.startsWith("/patents/pdfs/") ||
      !patent.originalPdfUrl.endsWith(".pdf")
    ) {
      throw new Error(`${patent.id} has a non-canonical pinned PDF URL: ${patent.originalPdfUrl}`);
    }
    if (facts.assetExists && !facts.assetExists(patent.originalPdfUrl)) {
      throw new Error(
        `${patent.id} E2E scenario points at a missing pinned PDF: ${patent.originalPdfUrl}`,
      );
    }

    const decision = facts.publicationDecision?.(patent);
    const isPublished = decision?.isPublished ?? facts.isEditionPublished(patent);
    return {
      patentId: patent.id,
      patentNumber: patent.patentNumber,
      title: patent.shortTitle,
      route: `/patents/${patent.id}`,
      pdfUrl: patent.originalPdfUrl,
      sourceState: isPublished ? "published" : "withheld",
      sourcePublicationState:
        decision?.state.kind ??
        (isPublished ? "accepted" : patent.archivalEdition ? "candidate" : "facsimile-only"),
      sourceReasonCode:
        decision?.reasonCode ??
        (isPublished
          ? "ACCEPTED"
          : patent.archivalEdition
            ? "UNSPECIFIED_HOLD"
            : "NO_EDITION_BOUND"),
      sourceDecision: {
        completeFacsimileReviewed:
          decision?.reviewerAttestation.completeFacsimileReviewed ??
          patent.archivalEdition?.completeFacsimileReviewed === true,
        ledgerKind: decision?.state.evidence.ledger.kind ?? patent.originalTextAsset?.kind,
        ledgerReviewer: decision?.state.evidence.ledger.reviewer ?? null,
        ledgerReviewedAt: decision?.state.evidence.ledger.reviewedAt ?? null,
        digestParity: decision?.state.evidence.digestParity ?? "unavailable",
        requiredFigureCount: decision?.figureManifest.requiredFigureCount ?? 0,
        acceptedFigureCount: decision?.figureManifest.acceptedFigureCount ?? 0,
        figureAttestation: decision?.figureManifest.attestation ?? null,
        evidenceReferences: decision?.state.evidence.evidenceReferences ?? [patent.id],
      },
      claimCount: patent.claims.length,
      drawingCount: patent.drawings.length,
      hasReviewedLedger: patent.originalTextAsset?.kind === "reviewed-transcription",
      hasStoredEdition: Boolean(patent.archivalEdition),
      figurePreviewUrls: figurePreviewUrlsForPatent(patent),
      equationIds: [...(facts.equationIdsForPatent?.(patent) ?? [])],
      claimProbeCount: facts.claimProbeCountForPatent?.(patent) ?? 0,
      hasEnergyChannels: facts.hasEnergyChannelsForPatent?.(patent) ?? false,
      controls: facts.controlsForPatent?.(patent) ?? [],
    };
  });
}

export function parsePatentE2EArgs(argv: readonly string[]): PatentE2EOptions {
  const options: PatentE2EOptions = {
    ...DEFAULT_OPTIONS,
    patentIds: [],
    viewports: [...DEFAULT_OPTIONS.viewports],
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    const value = argv[index + 1];
    if (argument === "--all") options.all = true;
    else if (argument === "--changed") options.changed = true;
    else if (argument === "--headed") options.headed = true;
    else if (argument === "--fail-fast") options.failFast = true;
    else if (argument === "--self-test-failure") options.selfTestFailure = true;
    else if (argument === "--patent") {
      options.patentIds.push(requireOptionValue(argument, value));
      index += 1;
    } else if (argument === "--base-url") {
      options.baseUrl = requireOptionValue(argument, value);
      index += 1;
    } else if (argument === "--output-dir") {
      options.outputRoot = requireOptionValue(argument, value);
      index += 1;
    } else if (argument === "--viewports") {
      options.viewports = parseViewports(requireOptionValue(argument, value));
      index += 1;
    } else if (argument === "--help" || argument === "-h") {
      throw new PatentE2EHelpRequested();
    } else {
      throw new Error(`Unknown patent E2E option: ${argument}`);
    }
  }

  const selectorCount =
    Number(options.all) + Number(options.changed) + Number(options.patentIds.length > 0);
  if (!options.selfTestFailure && selectorCount !== 1) {
    throw new Error(
      "Select exactly one of --all, --changed, or one or more --patent <id> arguments.",
    );
  }
  if (options.viewports.length === 0) {
    throw new Error("At least one E2E viewport is required.");
  }
  options.baseUrl = normalizeBaseUrl(options.baseUrl);
  return options;
}

export class PatentE2EHelpRequested extends Error {
  constructor() {
    super("Patent E2E help requested");
    this.name = "PatentE2EHelpRequested";
  }
}

export function patentE2EUsage(): string {
  return [
    "Usage:",
    "  bun scripts/e2e-patent-vertical-slices.ts --patent <catalogue-id> [--patent <id>...]",
    "  bun scripts/e2e-patent-vertical-slices.ts --changed",
    "  bun scripts/e2e-patent-vertical-slices.ts --all",
    "",
    "Options:",
    "  --base-url <url>       Existing server target (default E2E_BASE_URL or http://127.0.0.1:3088)",
    "  --output-dir <path>    Artifact root; existing evidence is never removed",
    "  --viewports <names>    Comma-separated desktop,tablet,phone (phone is exactly 320px)",
    "  --headed               Show Chromium",
    "  --fail-fast            Stop after the first failed patent/viewport scenario",
    "  --self-test-failure    Emit a synthetic failed event and exit nonzero",
  ].join("\n");
}

export function selectPatentE2EScenarios(
  scenarios: readonly PatentE2EScenario[],
  patentIds: readonly string[],
): PatentE2EScenario[] {
  const byId = new Map(scenarios.map((scenario) => [scenario.patentId, scenario]));
  const selected: PatentE2EScenario[] = [];
  for (const id of [...new Set(patentIds)]) {
    const scenario = byId.get(id);
    if (!scenario) {
      throw new Error(`Unknown patent E2E id: ${id}`);
    }
    selected.push(scenario);
  }
  return selected;
}

export function resolveChangedPatentIds(
  scenarios: readonly PatentE2EScenario[],
  changedPaths: readonly string[],
  readText: (path: string) => string | undefined,
): string[] {
  if (changedPaths.length === 0) return [];
  const selected = new Set<string>();
  let sharedSurfaceChanged = false;

  for (const changedPath of changedPaths) {
    const normalized = changedPath.replaceAll("\\", "/");
    const content = readText(changedPath) ?? "";
    const directMatches = scenarios.filter(
      (scenario) => normalized.includes(scenario.patentId) || content.includes(scenario.patentId),
    );
    for (const match of directMatches) selected.add(match.patentId);

    if (directMatches.length === 0 && isSharedPatentSurface(normalized)) {
      sharedSurfaceChanged = true;
    }
  }

  return sharedSurfaceChanged ? scenarios.map((scenario) => scenario.patentId) : [...selected];
}

export function createPatentE2EEvent(
  event: Omit<PatentE2EEvent, "schemaVersion" | "timestamp"> & { timestamp?: string },
): PatentE2EEvent {
  return {
    ...event,
    schemaVersion: PATENT_E2E_LOG_SCHEMA,
    timestamp: event.timestamp ?? new Date().toISOString(),
    durationMs: finiteDuration(event.durationMs),
    errors: event.errors?.map(redactPatentE2ESecrets),
    consoleErrors: event.consoleErrors?.map(redactPatentE2ESecrets),
    pageErrors: event.pageErrors?.map(redactPatentE2ESecrets),
    networkErrors: event.networkErrors?.map(redactPatentE2ESecrets),
  };
}

export function serializePatentE2EEvent(event: PatentE2EEvent): string {
  validatePatentE2EEvent(event);
  return JSON.stringify(event);
}

export function summarizePatentE2EEvents(args: {
  runId: string;
  startedAt: string;
  finishedAt: string;
  baseUrl: string;
  selectedPatents: readonly string[];
  selectedViewports: readonly PatentE2EViewportName[];
  artifactDirectory: string;
  events: readonly PatentE2EEvent[];
}): PatentE2ESummary {
  const failed = args.events.filter((event) => event.status === "fail");
  const grouped = new Map<string, PatentE2EEvent[]>();
  for (const event of args.events) {
    const key = [event.patentId, event.viewport, event.face, event.action].join("\u0000");
    const events = grouped.get(key) ?? [];
    events.push(event);
    grouped.set(key, events);
  }
  const actionGroups: PatentE2EActionGroup[] = [...grouped.values()]
    .map((events) => {
      const [first] = events;
      return {
        patentId: first.patentId,
        viewport: first.viewport,
        face: first.face,
        action: first.action,
        eventCount: events.length,
        passedActions: events.filter((event) => event.status === "pass").length,
        failedActions: events.filter((event) => event.status === "fail").length,
        artifactPaths: uniqueStrings(events.flatMap((event) => event.artifactPaths ?? [])),
        kernelSources: uniqueStrings(
          events.flatMap((event) => (event.kernelSource ? [event.kernelSource] : [])),
        ),
        refusalReasons: uniqueStrings(
          events.flatMap((event) => (event.refusal ? [event.refusal] : [])),
        ),
      };
    })
    .sort((left, right) =>
      [left.patentId, left.viewport, left.face, left.action]
        .join("\u0000")
        .localeCompare([right.patentId, right.viewport, right.face, right.action].join("\u0000")),
    );
  return {
    schemaVersion: PATENT_E2E_SUMMARY_SCHEMA,
    runId: args.runId,
    startedAt: args.startedAt,
    finishedAt: args.finishedAt,
    baseUrl: args.baseUrl,
    selectedPatents: [...args.selectedPatents],
    selectedViewports: [...args.selectedViewports],
    eventCount: args.events.length,
    passedActions: args.events.filter((event) => event.status === "pass").length,
    failedActions: failed.length,
    failedPatents: [...new Set(failed.map((event) => event.patentId))].sort(),
    artifactDirectory: args.artifactDirectory,
    actionGroups,
  };
}

export function patentE2EExitCode(summary: PatentE2ESummary): number {
  return summary.failedActions === 0 ? 0 : 1;
}

export function safeArtifactSegment(value: string): string {
  const normalized = value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
  return normalized || "unknown";
}

export function stableFailureStem(
  patentId: string,
  viewport: PatentE2EViewportName,
  face: string,
  action: string,
): string {
  return [patentId, viewport, face, action].map(safeArtifactSegment).join("__");
}

export function createRunId(now = new Date(), suffix = `${process.pid}`): string {
  const stamp = now.toISOString().replace(/[:.]/g, "-");
  return `${stamp}__${safeArtifactSegment(suffix)}`;
}

function validatePatentE2EEvent(event: PatentE2EEvent): void {
  if (event.schemaVersion !== PATENT_E2E_LOG_SCHEMA) throw new Error("Invalid E2E event schema.");
  for (const [field, value] of Object.entries({
    runId: event.runId,
    patentId: event.patentId,
    route: event.route,
    viewport: event.viewport,
    face: event.face,
    action: event.action,
    status: event.status,
    timestamp: event.timestamp,
  })) {
    if (typeof value !== "string" || value.length === 0) {
      throw new Error(`E2E event ${field} must be a non-empty string.`);
    }
  }
  if (!Number.isFinite(event.durationMs) || event.durationMs < 0) {
    throw new Error("E2E event durationMs must be finite and non-negative.");
  }
  if (!Number.isInteger(event.sequence) || event.sequence < 1) {
    throw new Error("E2E event sequence must be a positive integer.");
  }
}

export function validatePatentE2EEventOrder(events: readonly PatentE2EEvent[]): readonly string[] {
  const errors: string[] = [];
  for (const [index, event] of events.entries()) {
    const expected = index + 1;
    if (event.sequence !== expected) {
      errors.push(`event index ${index} has sequence ${event.sequence}; expected ${expected}`);
    }
  }
  return errors;
}

export function classifyPatentE2EDiagnostic(message: string): {
  allowed: boolean;
  reason?: string;
} {
  if (/favicon\.ico/i.test(message)) {
    return { allowed: true, reason: "optional browser favicon request" };
  }
  if (
    /requestfailed/i.test(message) &&
    /net::ERR_ABORTED/i.test(message) &&
    /(?:\.pdf|_next\/static)/i.test(message)
  ) {
    return { allowed: true, reason: "navigation canceled an in-flight immutable asset request" };
  }
  return { allowed: false };
}

function parseViewports(value: string): PatentE2EViewportName[] {
  const names = [
    ...new Set(
      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  ];
  for (const name of names) {
    if (!(name in PATENT_E2E_VIEWPORTS)) {
      throw new Error(`Unknown E2E viewport '${name}'. Use desktop, tablet, or phone.`);
    }
  }
  return names as PatentE2EViewportName[];
}

function normalizeBaseUrl(value: string): string {
  const url = new URL(value);
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(`E2E base URL must use http or https: ${value}`);
  }
  return url.toString().replace(/\/$/, "");
}

function requireOptionValue(flag: string, value: string | undefined): string {
  if (!value || value.startsWith("--")) throw new Error(`${flag} requires a value.`);
  return value;
}

function isSharedPatentSurface(path: string): boolean {
  return (
    path === "package.json" ||
    path.startsWith("src/components/patents/") ||
    path.startsWith("src/data/editions/") ||
    path.startsWith("src/physics/") ||
    path.startsWith("src/app/patents/") ||
    path.startsWith("scripts/e2e-") ||
    path === "src/data/patents/index.ts"
  );
}

function finiteDuration(value: number): number {
  return Number.isFinite(value) && value >= 0 ? Math.round(value) : 0;
}

function uniqueStrings(values: readonly string[]): string[] {
  return [...new Set(values.filter(Boolean))].sort();
}

function figurePreviewUrlsForPatent(patent: Patent): string[] {
  const urls = new Set<string>();
  for (const block of patent.archivalEdition?.blocks ?? []) {
    const inlineGroups =
      block.kind === "paragraph" || block.kind === "claim"
        ? [block.inlines]
        : block.kind === "figure-sheet"
          ? [block.description]
          : block.kind === "table"
            ? [...block.headers, ...block.rows.flat()]
            : [];
    for (const inlines of inlineGroups) {
      for (const inline of inlines) {
        if (inline.kind !== "reference" || inline.referenceType !== "figure") continue;
        for (const preview of inline.figurePreviews ?? []) urls.add(preview.src);
      }
    }
  }
  return [...urls].sort();
}

export function redactPatentE2ESecrets(value: string): string {
  return value
    .replace(/(authorization|token|cookie|password)=([^\s&]+)/gi, "$1=[redacted]")
    .replace(/(bearer\s+)[a-z0-9._~-]+/gi, "$1[redacted]");
}
