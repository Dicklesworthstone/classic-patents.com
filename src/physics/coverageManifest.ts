import type {
  ArchivalPublicationDecision,
  ArchivalPublicationStateKind,
} from "@/data/editions/archivalPublicationState";
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
  /** True only when an accepted owner step promotes the shared tape itself. */
  provesSharedBusSource?: boolean;
}

export interface PatentCoverageFacts {
  assetExists: (publicUrl: string) => boolean;
  isEditionPublished: (patent: Patent) => boolean;
  /** The typed source-face decision is authoritative when supplied. */
  publicationDecision?: (patent: Patent) => ArchivalPublicationDecision;
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
    publication: {
      state: ArchivalPublicationStateKind;
      reasonCode: string;
      requiredFigureCount: number;
      acceptedFigureCount: number;
    };
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
    admittedSharedBusProvenance: readonly RuntimeProvenance[];
  };
}

export interface PatentCoverageSummary {
  total: number;
  pinnedFacsimiles: number;
  reviewedLedgers: number;
  publishedEditions: number;
  candidateEditions: number;
  heldEditions: number;
  rejectedEditions: number;
  facsimileOnlyRecords: number;
  sourceBoundedRecords: number;
  patentSpecificWasm: number;
  interpretiveWasm: number;
  genericWasm: number;
  typedHostOnly: number;
  sharedBusUpdaters: number;
  sharedBusSnapshots: number;
  missingSharedBus: number;
}

/**
 * Patents whose 2D/3D faces consume a transport tape owned above the face
 * switch. Keeping the owner outside either face prevents a mode toggle from
 * resetting the physical sequence or mounting a second updater.
 */
export const EXTERNAL_RUNTIME_OWNER_PATENT_IDS = [
  "us-1773980-farnsworth-tv",
  "us-4063220-metcalfe-ethernet",
  "us-3728480-baer-odyssey",
  "us-3858232-boyle-smith-ccd",
  "us-3858581-kamen-medication-injection-device",
  "us-6120588-eink",
  "us-2292387-lamarr-frequency-hopping",
  "us-586193-marconi-radio",
] as const;

const EXTERNAL_RUNTIME_OWNER_PATENT_ID_SET = new Set<string>(EXTERNAL_RUNTIME_OWNER_PATENT_IDS);

export function hasExternalRuntimeOwner(patentId: string): boolean {
  return EXTERNAL_RUNTIME_OWNER_PATENT_ID_SET.has(patentId);
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
  "us-194047-otto-engine": {
    kind: "generic-wasm",
    sourceCrate: "fs-otto-wasm",
    loaderFunction: "ensureOttoWasm",
    exportName: "otto_topology_step",
    artifactUrl: "/wasm/fs-otto/fs_otto_wasm_bg.wasm",
    artifactSha256: "0d0c8c7a10c876c3ccd56ee6b8e1075bb72e3ff9bb57464b9295cc61e820eda1",
    refusalBoundary: "typed-wasm",
    provesSharedBusSource: true,
  },
  "us-31128-otis-elevator": {
    kind: "generic-wasm",
    sourceCrate: "fs-otis-wasm",
    loaderFunction: "ensureOtisWasm",
    exportName: "otis_topology_step",
    artifactUrl: "/wasm/fs-otis/fs_otis_wasm_bg.wasm",
    artifactSha256: "1625fd8ea88d245e947ca4a474c1b3b81b4b2fd5f3dbdbd620c3bec776a7046d",
    refusalBoundary: "typed-wasm",
  },
  "us-4750-howe-sewing-machine": {
    kind: "generic-wasm",
    sourceCrate: "fs-howe-wasm",
    loaderFunction: "ensureHoweWasm",
    exportName: "howe_topology_step",
    artifactUrl: "/wasm/fs-howe/fs_howe_wasm_bg.wasm",
    artifactSha256: "f8ecfc56eca4c9e5e66e45a3e4f45b7444b0d27cbacda078fb1f0549341978c0",
    refusalBoundary: "typed-wasm",
  },
  "us-223898-edison-lightbulb": {
    kind: "generic-wasm",
    sourceCrate: "fs-edison-wasm",
    loaderFunction: "ensureEdisonWasm",
    exportName: "edison_radiative_step",
    artifactUrl: "/wasm/fs-edison/fs_edison_wasm_bg.wasm",
    artifactSha256: "5b1ffe2e22f758003d48d85dbc423367e8a4c2d3f6adc03603690cfe9c78eec5",
    refusalBoundary: "typed-wasm",
  },
  "us-593138-tesla-coil": {
    kind: "generic-wasm",
    sourceCrate: "fs-tesla-wasm",
    loaderFunction: "ensureTeslaWasm",
    exportName: "tesla_transformer_step",
    artifactUrl: "/wasm/fs-tesla/fs_tesla_wasm_bg.wasm",
    artifactSha256: "acd1672b052cd9a41cff0b12ae60fc133eb981cc547f7f07a59de44d06975d34",
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
  "us-4921293-salisbury-robot-hand": {
    kind: "generic-wasm",
    sourceCrate: "fs-salisbury-wasm",
    loaderFunction: "ensureSalisburyWasm",
    exportName: "salisbury_hand_step",
    artifactUrl: "/wasm/fs-salisbury/fs_salisbury_wasm_bg.wasm",
    artifactSha256: "f20637bf916fee5feab91c4dcd452a987c07de331b1838087b3ff7a4fca285f2",
    refusalBoundary: "typed-wasm",
  },
  "us-6331181-davinci": {
    kind: "generic-wasm",
    sourceCrate: "fs-davinci-wasm",
    loaderFunction: "ensureDaVinciTopologyWasm",
    exportName: "davinci_topology_step",
    artifactUrl: "/wasm/fs-davinci/fs_davinci_wasm_bg.wasm",
    artifactSha256: "f09c2a0718c927247a56f84b10037ac21318f89d8a4e27c53b030fa43b14816d",
    refusalBoundary: "typed-wasm",
  },
  "us-6594844-roomba": {
    kind: "generic-wasm",
    sourceCrate: "fs-roomba-wasm",
    loaderFunction: "ensureRoombaWasm",
    exportName: "roomba_step",
    artifactUrl: "/wasm/fs-roomba/fs_roomba_wasm_bg.wasm",
    artifactSha256: "711ec2910b16382d328c6943ecfd7793c820868933b275db923b832b49d8b594",
    refusalBoundary: "typed-wasm",
    provesSharedBusSource: true,
  },
} as const satisfies Record<string, WasmSurfaceDescriptor>;

const GENERIC_WASM_PATENT_IDS = new Set([
  "us-x72-whitney-cotton-gin",
  "us-x8277-mccormick-reaper",
  "us-588-ericsson-propeller",
  "us-3633-goodyear-rubber",
  "us-6162-corliss-steam-engine",
  "us-6469-lincoln-buoy",
  "us-36836-gatling-gun",
  "us-78317-nobel-dynamite",
  "us-79265-sholes-typewriter",
  "us-105338-hyatt-celluloid",
  "us-120057-gramme-dynamo",
  "us-157124-glidden-barbed-wire",
  "us-174465-bell-telephone",
  "us-247804-delaval-separator",
  "us-2981877-noyce-ic",
  "us-313224-mergenthaler-linotype",
  "us-319596-maxim-machine-gun",
  "us-347140-thomson-welding",
  "us-381968-tesla-motor",
  "us-388850-eastman-kodak",
  "us-395781-hollerith-tabulating",
  "us-621195-zeppelin-airship",
  "us-x9430-colt-revolver",
  "us-608969-parsons-turbine",
  "us-1773980-farnsworth-tv",
  "us-1781541-einstein-refrigerator",
  "us-2495429-spencer-microwave",
  "us-2708656-fermi-reactor",
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
    const publicationDecision = facts.publicationDecision?.(patent);
    const isEditionPublished = publicationDecision?.isPublished ?? facts.isEditionPublished(patent);
    const archivalEdition = isEditionPublished
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
        publication: {
          state:
            publicationDecision?.state.kind ??
            (isEditionPublished
              ? "accepted"
              : patent.archivalEdition
                ? "candidate"
                : "facsimile-only"),
          reasonCode:
            publicationDecision?.reasonCode ??
            (isEditionPublished
              ? "ACCEPTED"
              : patent.archivalEdition
                ? "UNSPECIFIED_HOLD"
                : "NO_EDITION_BOUND"),
          requiredFigureCount: publicationDecision?.figureManifest.requiredFigureCount ?? 0,
          acceptedFigureCount: publicationDecision?.figureManifest.acceptedFigureCount ?? 0,
        },
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
        admittedSharedBusProvenance:
          sharedBus === "missing"
            ? (["HONEST_PLACEHOLDER"] as const)
            : wasmSurface?.provesSharedBusSource && wasmArtifactPresent
              ? (["WASM", "TS_FALLBACK"] as const)
              : (["TS_FALLBACK"] as const),
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
    candidateEditions: manifest.filter((row) => row.source.publication.state === "candidate")
      .length,
    heldEditions: manifest.filter((row) => row.source.publication.state === "held").length,
    rejectedEditions: manifest.filter((row) => row.source.publication.state === "rejected").length,
    facsimileOnlyRecords: manifest.filter(
      (row) => row.source.publication.state === "facsimile-only",
    ).length,
    sourceBoundedRecords: manifest.filter(
      (row) => row.source.publication.state === "source-bounded",
    ).length,
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
