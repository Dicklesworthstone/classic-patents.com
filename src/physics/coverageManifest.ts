import type { Patent } from "@/types/patent";

export type WasmSurfaceKind =
  | "none"
  | "generic-wasm"
  | "interpretive-wasm"
  | "patent-specific-wasm";
export type SharedBusParticipation = "updater" | "snapshot" | "missing";
export type RuntimeProvenance = "WASM" | "TS_FALLBACK" | "HONEST_PLACEHOLDER";

export interface WasmSurfaceDescriptor {
  kind: Exclude<WasmSurfaceKind, "none">;
  sourceCrate: string;
  loaderFunction: string;
  exportName: string;
  artifactUrl: string;
  artifactSha256: string;
  refusalBoundary: "typed-wasm" | "host-decoder" | "none";
}

export interface PatentCoverageFacts {
  assetExists: (publicUrl: string) => boolean;
  isEditionPublished: (patent: Patent) => boolean;
  hasVisualDispatch: (patentId: string) => boolean;
  hasTelemetryOwner: (patentId: string) => boolean;
  hasEquationSet: (patentId: string) => boolean;
  sharedBusParticipation: (patentId: string) => SharedBusParticipation;
}

export interface PatentCoverageRow {
  patentId: string;
  source: {
    pinnedFacsimile: boolean;
    reviewedLedger: boolean;
    archivalEdition: "published" | "review-pending" | "missing";
  };
  presentation: {
    explicitVisualDispatch: boolean;
    defaultTelemetryOwner: "typescript" | "missing";
    liveEquationSet: boolean;
  };
  runtime: {
    wasmSurface: WasmSurfaceKind;
    wasmArtifactUrl?: string;
    wasmArtifactPresent: boolean;
    admittedProvenance: readonly RuntimeProvenance[];
    coldStartProvenance: "HONEST_PLACEHOLDER";
    sharedBus: SharedBusParticipation;
    sharedBusProvenance: "TS_FALLBACK" | "HONEST_PLACEHOLDER";
  };
}

export interface PatentCoverageSummary {
  total: number;
  pinnedFacsimiles: number;
  reviewedLedgers: number;
  publishedEditions: number;
  patentSpecificWasm: number;
  interpretiveWasm: number;
  genericWasm: number;
  typedHostOnly: number;
  sharedBusUpdaters: number;
  sharedBusSnapshots: number;
  missingSharedBus: number;
}

const GENERIC_WASM_SURFACE: WasmSurfaceDescriptor = {
  kind: "generic-wasm",
  sourceCrate: "fs-wasm",
  loaderFunction: "ensureGenericWasm",
  exportName: "domain-specific generic exports",
  artifactUrl: "/wasm/fs-generic/fs_wasm_bg.wasm",
  artifactSha256: "ba050469d5a3ae56ce3e3be26fa959a06a6194f0287512f7c86f222994e5799f",
  refusalBoundary: "none",
};

export const DEDICATED_WASM_SURFACES = {
  "us-593138-tesla-coil": {
    kind: "interpretive-wasm",
    sourceCrate: "fs-tesla-wasm",
    loaderFunction: "ensureTeslaWasm",
    exportName: "tesla_coil_step",
    artifactUrl: "/wasm/fs-tesla/fs_tesla_wasm_bg.wasm",
    artifactSha256: "589fa98b01bfcef131a5b6c81583ec7c9abcac193fcb4aeb7a676c085241ff18",
    refusalBoundary: "typed-wasm",
  },
  "us-821393-wright-flyer": {
    kind: "patent-specific-wasm",
    sourceCrate: "fs-flyer-wasm",
    loaderFunction: "ensureFlyerWasm",
    exportName: "step_aero_body",
    artifactUrl: "/wasm/fs-flyer/fs_flyer_wasm_bg.wasm",
    artifactSha256: "592850c8994182791c0a3ca663804d5f836b635e884008c2bdf7e925033e3ce7",
    refusalBoundary: "typed-wasm",
  },
  "us-1102653-goddard-rocket": {
    kind: "patent-specific-wasm",
    sourceCrate: "fs-goddard-wasm",
    loaderFunction: "ensureGoddardWasm",
    exportName: "goddard_apparatus_step",
    artifactUrl: "/wasm/fs-goddard/fs_goddard_wasm_bg.wasm",
    artifactSha256: "79ace2e83a82bdf526a20a51a56a82cceeab89a9555b0aa51225bf194ec9f171",
    refusalBoundary: "typed-wasm",
  },
  "us-361931-daimler-engine": {
    kind: "patent-specific-wasm",
    sourceCrate: "fs-daimler-wasm",
    loaderFunction: "ensureDaimlerWasm",
    exportName: "daimler_marine_step",
    artifactUrl: "/wasm/fs-daimler/fs_daimler_wasm_bg.wasm",
    artifactSha256: "9c8ee2c8fcf80a1186b32b1ecae529476f24646060f7f767fcb051ddbb1b69c2",
    refusalBoundary: "typed-wasm",
  },
} as const satisfies Record<string, WasmSurfaceDescriptor>;

const GENERIC_WASM_PATENT_IDS = new Set([
  "us-x72-whitney-cotton-gin",
  "us-x8277-mccormick-reaper",
  "us-588-ericsson-propeller",
  "us-3633-goodyear-rubber",
  "us-6162-corliss-steam-engine",
  "us-6469-lincoln-buoy",
  "us-31128-otis-elevator",
  "us-36836-gatling-gun",
  "us-78317-nobel-dynamite",
  "us-79265-sholes-typewriter",
  "us-105338-hyatt-celluloid",
  "us-120057-gramme-dynamo",
  "us-157124-glidden-barbed-wire",
  "us-174465-bell-telephone",
  "us-223898-edison-lightbulb",
  "us-247804-delaval-separator",
  "us-2981877-noyce-ic",
  "us-313224-mergenthaler-linotype",
  "us-319596-maxim-machine-gun",
  "us-347140-thomson-welding",
  "us-381968-tesla-motor",
  "us-388850-eastman-kodak",
  "us-395781-hollerith-tabulating",
  "us-470918-reno-escalator",
  "us-586193-marconi-radio",
  "us-621195-zeppelin-airship",
  "us-x9430-colt-revolver",
  "us-194047-otto-engine",
  "us-608969-parsons-turbine",
  "us-1773980-farnsworth-tv",
  "us-1781541-einstein-refrigerator",
  "us-2495429-spencer-microwave",
  "us-2708656-fermi-reactor",
  "us-3541541-engelbart-mouse",
  "us-3671542-kwolek-kevlar",
  "us-4136359-wozniak-apple",
]);

export function wasmSurfaceForPatent(patentId: string): WasmSurfaceDescriptor | undefined {
  const patentSpecific = DEDICATED_WASM_SURFACES[patentId as keyof typeof DEDICATED_WASM_SURFACES];
  if (patentSpecific) return patentSpecific;
  return GENERIC_WASM_PATENT_IDS.has(patentId) ? GENERIC_WASM_SURFACE : undefined;
}

export function buildPatentCoverageManifest(
  patents: readonly Patent[],
  facts: PatentCoverageFacts,
): PatentCoverageRow[] {
  return patents.map((patent) => {
    const wasmSurface = wasmSurfaceForPatent(patent.id);
    const wasmArtifactPresent = wasmSurface ? facts.assetExists(wasmSurface.artifactUrl) : false;
    const sharedBus = facts.sharedBusParticipation(patent.id);
    const archivalEdition = facts.isEditionPublished(patent)
      ? "published"
      : patent.archivalEdition
        ? "review-pending"
        : "missing";

    return {
      patentId: patent.id,
      source: {
        pinnedFacsimile: facts.assetExists(patent.originalPdfUrl),
        reviewedLedger:
          patent.originalTextAsset?.kind === "reviewed-transcription" &&
          facts.assetExists(patent.originalTextAsset.url),
        archivalEdition,
      },
      presentation: {
        explicitVisualDispatch: facts.hasVisualDispatch(patent.id),
        defaultTelemetryOwner: facts.hasTelemetryOwner(patent.id) ? "typescript" : "missing",
        liveEquationSet: facts.hasEquationSet(patent.id),
      },
      runtime: {
        wasmSurface: wasmSurface?.kind ?? "none",
        ...(wasmSurface ? { wasmArtifactUrl: wasmSurface.artifactUrl } : {}),
        wasmArtifactPresent,
        admittedProvenance:
          wasmSurface && wasmArtifactPresent
            ? (["WASM", "TS_FALLBACK"] as const)
            : (["TS_FALLBACK"] as const),
        coldStartProvenance: "HONEST_PLACEHOLDER",
        sharedBus,
        sharedBusProvenance: sharedBus === "missing" ? "HONEST_PLACEHOLDER" : "TS_FALLBACK",
      },
    };
  });
}

export function summarizePatentCoverage(
  manifest: readonly PatentCoverageRow[],
): PatentCoverageSummary {
  return {
    total: manifest.length,
    pinnedFacsimiles: manifest.filter((row) => row.source.pinnedFacsimile).length,
    reviewedLedgers: manifest.filter((row) => row.source.reviewedLedger).length,
    publishedEditions: manifest.filter((row) => row.source.archivalEdition === "published").length,
    patentSpecificWasm: manifest.filter((row) => row.runtime.wasmSurface === "patent-specific-wasm")
      .length,
    interpretiveWasm: manifest.filter((row) => row.runtime.wasmSurface === "interpretive-wasm")
      .length,
    genericWasm: manifest.filter((row) => row.runtime.wasmSurface === "generic-wasm").length,
    typedHostOnly: manifest.filter((row) => row.runtime.wasmSurface === "none").length,
    sharedBusUpdaters: manifest.filter((row) => row.runtime.sharedBus === "updater").length,
    sharedBusSnapshots: manifest.filter((row) => row.runtime.sharedBus === "snapshot").length,
    missingSharedBus: manifest.filter((row) => row.runtime.sharedBus === "missing").length,
  };
}
