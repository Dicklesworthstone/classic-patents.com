import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { ALL_COLORIZED_EQUATIONS } from "@/data/colorizedEquations";
import {
  archivalEditionForPublication,
  evaluateArchivalPublicationState,
} from "@/data/editions/publicationApproval";
import { allPatents } from "@/data/patents";
import {
  buildPatentCoverageManifest,
  EXTERNAL_RUNTIME_OWNER_PATENT_IDS,
  hasExternalRuntimeOwner,
  type SharedBusParticipation,
  summarizePatentCoverage,
  wasmSurfaceForPatent,
} from "./coverageManifest";
import { PATENT_PHYSICS_REGISTRY } from "./telemetryData";

const ROOT = process.cwd();
const visualDispatcherSource = readFileSync(
  join(ROOT, "src/components/patents/visuals/index.tsx"),
  "utf8",
);
const threeVisualDirectory = join(ROOT, "src/components/patents/visuals/three");
const threeVisualSources = readdirSync(threeVisualDirectory)
  .filter((filename) => filename.endsWith("3D.tsx"))
  .map((filename) => readFileSync(join(threeVisualDirectory, filename), "utf8"));
const physicsDirectory = join(ROOT, "src/physics");
const runtimeOwnerSources = [
  ...threeVisualSources,
  ...readdirSync(physicsDirectory)
    .filter((filename) => filename.endsWith("Kernel.ts"))
    .map((filename) => readFileSync(join(physicsDirectory, filename), "utf8")),
];
const genericWasmHookSource = readFileSync(
  join(physicsDirectory, "useGenericWasmSource.ts"),
  "utf8",
);

function runtimeSourcesReachLoader(sources: readonly string[], loaderFunction: string): boolean {
  if (sources.some((source) => source.includes(loaderFunction))) return true;
  return (
    loaderFunction === "ensureGenericWasm" &&
    sources.some((source) => source.includes("useGenericWasmSource")) &&
    genericWasmHookSource.includes(loaderFunction)
  );
}

function assetExists(publicUrl: string): boolean {
  return Bun.file(join(ROOT, "public", publicUrl.replace(/^\//, ""))).size > 0;
}

function sharedBusParticipation(patentId: string): SharedBusParticipation {
  if (hasExternalRuntimeOwner(patentId)) return "updater";
  const matchingSources = threeVisualSources.filter((source) => source.includes(patentId));
  if (matchingSources.some((source) => source.includes("registerUpdater"))) return "updater";
  if (matchingSources.some((source) => source.includes("useFrankenSimPhysics"))) return "snapshot";
  return "missing";
}

const manifest = buildPatentCoverageManifest(allPatents, {
  assetExists,
  isEditionPublished: (patent) => Boolean(archivalEditionForPublication(patent)),
  publicationDecision: evaluateArchivalPublicationState,
  hasVisualDispatch: (patentId) => visualDispatcherSource.includes(`case "${patentId}":`),
  hasTelemetryOwner: (patentId) => Boolean(PATENT_PHYSICS_REGISTRY[patentId]),
  hasEquationSet: (patentId) => Boolean(ALL_COLORIZED_EQUATIONS[patentId]?.length),
  sharedBusParticipation,
});
const summary = summarizePatentCoverage(manifest);

describe("executable project coverage manifest", () => {
  test("contains one evidence row per catalogue record", () => {
    expect(manifest).toHaveLength(103);
    expect(new Set(manifest.map((row) => row.patentId)).size).toBe(103);
    expect(manifest.every((row) => row.source.pinnedFacsimile)).toBe(true);
    expect(manifest.filter((row) => row.source.reviewedLedger)).toHaveLength(99);
    expect(manifest.filter((row) => row.source.archivalEdition === "published")).toHaveLength(
      summary.publishedEditions,
    );
    expect(manifest.filter((row) => row.source.publication.state === "accepted")).toHaveLength(
      summary.publishedEditions,
    );
    expect(
      manifest.every(
        (row) =>
          row.source.publication.acceptedFigureCount <= row.source.publication.requiredFigureCount,
      ),
    ).toBe(true);
    expect(manifest.every((row) => row.presentation.explicitVisualDispatch)).toBe(true);
    expect(manifest.every((row) => row.presentation.defaultTelemetryOwner === "typescript")).toBe(
      true,
    );
    expect(manifest.every((row) => row.presentation.liveEquationSet)).toBe(true);
  });

  test("distinguishes patent-specific, interpretive, generic, and typed-host surfaces", () => {
    expect(
      manifest.filter((row) => row.runtime.wasmSurface === "patent-specific-wasm"),
    ).toHaveLength(3);
    expect(manifest.filter((row) => row.runtime.wasmSurface === "interpretive-wasm")).toHaveLength(
      0,
    );
    expect(manifest.filter((row) => row.runtime.wasmSurface === "generic-wasm")).toHaveLength(36);
    expect(manifest.filter((row) => row.runtime.wasmSurface === "none")).toHaveLength(64);

    for (const patentId of [
      "us-x9430-colt-revolver",
      "us-194047-otto-engine",
      "us-608969-parsons-turbine",
      "us-1773980-farnsworth-tv",
      "us-1781541-einstein-refrigerator",
      "us-2708656-fermi-reactor",
      "us-4136359-wozniak-apple",
      "us-4921293-salisbury-robot-hand",
      "us-5121329-crump-fdm",
      "us-5701965-kamen-transporter",
    ]) {
      expect(wasmSurfaceForPatent(patentId)?.kind).toBe("generic-wasm");
    }

    for (const patentId of [
      "us-132-davenport-electric-motor",
      "us-124404-westinghouse-air-brake",
      "us-542846-diesel-engine",
      "us-586193-marconi-radio",
      "us-2495429-spencer-microwave",
      "us-6331181-davinci",
      "us-3671542-kwolek-kevlar",
    ]) {
      expect(wasmSurfaceForPatent(patentId)).toBeUndefined();
    }

    for (const row of manifest) {
      expect(row.runtime.coldStartProvenance).toBe("HONEST_PLACEHOLDER");
      if (row.runtime.wasmSurface === "none") {
        expect(row.runtime.admittedProvenance).toEqual(["TS_FALLBACK"]);
      } else {
        expect(row.runtime.wasmArtifactPresent).toBe(true);
        expect(row.runtime.admittedProvenance).toEqual(["WASM", "TS_FALLBACK"]);
      }
    }
  });

  test("connects dormant generic adapters and leaves non-consumers on the typed host", () => {
    expect(genericWasmHookSource).toContain("ensureGenericWasm");
    expect(genericWasmHookSource).toContain("subscribeGenericKernelSource");
    for (const [studioFile, consumerFile] of [
      ["ColtRevolver3D.tsx", "coltRevolverModel.ts"],
      ["OttoEngine3D.tsx", "ottoEngineModel.ts"],
      ["ParsonsTurbine3D.tsx", "parsonsTurbineModel.ts"],
      ["FarnsworthTV3D.tsx", "farnsworthTvModel.ts"],
      ["EinsteinRefrigerator3D.tsx", "einsteinRefrigeratorModel.ts"],
      ["FermiReactor3D.tsx", "fermiReactorModel.ts"],
      ["WozniakApple3D.tsx", "wozniakAppleModel.ts"],
    ] as const) {
      const studioSource = readFileSync(join(threeVisualDirectory, studioFile), "utf8");
      const consumerSource = readFileSync(join(threeVisualDirectory, consumerFile), "utf8");
      expect(studioSource).toContain("ensureGenericWasm");
      expect(consumerSource).toContain('from "@/physics/genericWasm"');
    }

    const ericssonSource = readFileSync(
      join(threeVisualDirectory, "EricssonPropeller3D.tsx"),
      "utf8",
    );
    expect(ericssonSource).toContain("p.wakeCrateDensity");

    for (const studioFile of [
      "DavenportElectricMotor3D.tsx",
      "WestinghouseAirBrake3D.tsx",
      "DieselEngine3D.tsx",
    ]) {
      const studioSource = readFileSync(join(threeVisualDirectory, studioFile), "utf8");
      expect(studioSource).not.toContain("ensureGenericWasm");
      expect(studioSource).not.toContain("genericKernelSource");
    }
  });

  test("pins every declared WASM artifact and its runtime boundary", async () => {
    const checkedArtifacts = new Set<string>();
    for (const row of manifest) {
      const surface = wasmSurfaceForPatent(row.patentId);
      if (!surface) continue;
      const matchingRuntimeSources = runtimeOwnerSources.filter((source) =>
        source.includes(row.patentId),
      );
      expect(runtimeSourcesReachLoader(matchingRuntimeSources, surface.loaderFunction)).toBe(true);
      if (checkedArtifacts.has(surface.artifactUrl)) continue;
      checkedArtifacts.add(surface.artifactUrl);
      const bytes = await Bun.file(
        join(ROOT, "public", surface.artifactUrl.replace(/^\//, "")),
      ).arrayBuffer();
      expect(createHash("sha256").update(new Uint8Array(bytes)).digest("hex")).toBe(
        surface.artifactSha256,
      );
    }
    expect(checkedArtifacts.size).toBe(13);
  });

  test("all 3D studios now have an updater or a typed snapshot path", () => {
    expect(manifest.filter((row) => row.runtime.sharedBus === "updater")).toHaveLength(55);
    expect(manifest.filter((row) => row.runtime.sharedBus === "snapshot")).toHaveLength(48);
    expect(manifest.filter((row) => row.runtime.sharedBus === "missing")).toHaveLength(0);
    for (const patentId of EXTERNAL_RUNTIME_OWNER_PATENT_IDS) {
      expect(visualDispatcherSource).toContain(`case "${patentId}":`);
      expect(manifest.find((row) => row.patentId === patentId)?.runtime.sharedBus).toBe("updater");
    }
    for (const patentId of [
      "us-194047-otto-engine",
      "us-6594844-roomba",
      "us-5701965-kamen-transporter",
    ]) {
      const promotedOwner = manifest.find((row) => row.patentId === patentId);
      expect(promotedOwner?.runtime.admittedSharedBusProvenance).toEqual(["WASM", "TS_FALLBACK"]);
    }
    expect(
      manifest
        .filter(
          (row) =>
            row.patentId !== "us-194047-otto-engine" &&
            row.patentId !== "us-6594844-roomba" &&
            row.patentId !== "us-5701965-kamen-transporter",
        )
        .every(
          (row) =>
            row.runtime.admittedSharedBusProvenance.length === 1 &&
            row.runtime.admittedSharedBusProvenance[0] === "TS_FALLBACK",
        ),
    ).toBe(true);
  });

  test("README catalogue and runtime claims match the executable summary", () => {
    const readme = readFileSync(join(ROOT, "README.md"), "utf8");
    expect(readme).toContain(`${summary.reviewedLedgers} have reviewed ledgers`);
    expect(readme).toContain(`**${summary.publishedEditions} of ${summary.total}**`);
    expect(readme).toContain(
      `${summary.patentSpecificWasm} patent-specific WASM surface${summary.patentSpecificWasm === 1 ? "" : "s"}`,
    );
    expect(readme).toContain(
      `${summary.interpretiveWasm} dedicated interpretive WASM surface${summary.interpretiveWasm === 1 ? "" : "s"}`,
    );
    expect(readme).toContain(`${summary.genericWasm} generic FrankenSim WASM consumers`);
    expect(readme).toContain(`${summary.typedHostOnly} typed-host-only records`);
    expect(readme).toContain(
      `${summary.sharedBusUpdaters} ticking bus updaters + ${summary.sharedBusSnapshots} typed snapshot publishers`,
    );
  });
});
