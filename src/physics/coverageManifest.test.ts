import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { ALL_COLORIZED_EQUATIONS } from "@/data/colorizedEquations";
import { archivalEditionForPublication } from "@/data/editions/publicationApproval";
import { allPatents } from "@/data/patents";
import {
  buildPatentCoverageManifest,
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

function assetExists(publicUrl: string): boolean {
  return Bun.file(join(ROOT, "public", publicUrl.replace(/^\//, ""))).size > 0;
}

function sharedBusParticipation(patentId: string): SharedBusParticipation {
  const matchingSources = threeVisualSources.filter((source) => source.includes(patentId));
  if (matchingSources.some((source) => source.includes("registerUpdater"))) return "updater";
  if (matchingSources.some((source) => source.includes("useFrankenSimPhysics"))) return "snapshot";
  return "missing";
}

const manifest = buildPatentCoverageManifest(allPatents, {
  assetExists,
  isEditionPublished: (patent) => Boolean(archivalEditionForPublication(patent)),
  hasVisualDispatch: (patentId) => visualDispatcherSource.includes(`case "${patentId}":`),
  hasTelemetryOwner: (patentId) => Boolean(PATENT_PHYSICS_REGISTRY[patentId]),
  hasEquationSet: (patentId) => Boolean(ALL_COLORIZED_EQUATIONS[patentId]?.length),
  sharedBusParticipation,
});
const summary = summarizePatentCoverage(manifest);

describe("executable project coverage manifest", () => {
  test("contains one evidence row per catalogue record", () => {
    expect(manifest).toHaveLength(79);
    expect(new Set(manifest.map((row) => row.patentId)).size).toBe(79);
    expect(manifest.every((row) => row.source.pinnedFacsimile)).toBe(true);
    expect(manifest.filter((row) => row.source.reviewedLedger)).toHaveLength(78);
    expect(manifest.filter((row) => row.source.archivalEdition === "published")).toHaveLength(69);
    expect(manifest.every((row) => row.presentation.explicitVisualDispatch)).toBe(true);
    expect(manifest.every((row) => row.presentation.defaultTelemetryOwner === "typescript")).toBe(
      true,
    );
    expect(manifest.every((row) => row.presentation.liveEquationSet)).toBe(true);
  });

  test("distinguishes patent-specific, interpretive, generic, and typed-host surfaces", () => {
    expect(
      manifest.filter((row) => row.runtime.wasmSurface === "patent-specific-wasm"),
    ).toHaveLength(1);
    expect(manifest.filter((row) => row.runtime.wasmSurface === "interpretive-wasm")).toHaveLength(
      2,
    );
    expect(manifest.filter((row) => row.runtime.wasmSurface === "generic-wasm")).toHaveLength(36);
    expect(manifest.filter((row) => row.runtime.wasmSurface === "none")).toHaveLength(40);

    for (const patentId of [
      "us-x9430-colt-revolver",
      "us-194047-otto-engine",
      "us-608969-parsons-turbine",
      "us-1773980-farnsworth-tv",
      "us-1781541-einstein-refrigerator",
      "us-2708656-fermi-reactor",
      "us-3671542-kwolek-kevlar",
      "us-4136359-wozniak-apple",
    ]) {
      expect(wasmSurfaceForPatent(patentId)?.kind).toBe("generic-wasm");
    }

    for (const patentId of [
      "us-132-davenport-electric-motor",
      "us-124404-westinghouse-air-brake",
      "us-542846-diesel-engine",
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
    for (const [studioFile, consumerFile] of [
      ["ColtRevolver3D.tsx", "coltRevolverModel.ts"],
      ["OttoEngine3D.tsx", "ottoEngineModel.ts"],
      ["ParsonsTurbine3D.tsx", "parsonsTurbineModel.ts"],
      ["FarnsworthTV3D.tsx", "farnsworthTvModel.ts"],
      ["EinsteinRefrigerator3D.tsx", "einsteinRefrigeratorModel.ts"],
      ["FermiReactor3D.tsx", "fermiReactorModel.ts"],
      ["KwolekKevlar3D.tsx", "kwolekKevlarModel.ts"],
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
      const matchingVisualSources = threeVisualSources.filter((source) =>
        source.includes(row.patentId),
      );
      expect(matchingVisualSources.some((source) => source.includes(surface.loaderFunction))).toBe(
        true,
      );
      if (checkedArtifacts.has(surface.artifactUrl)) continue;
      checkedArtifacts.add(surface.artifactUrl);
      const bytes = await Bun.file(
        join(ROOT, "public", surface.artifactUrl.replace(/^\//, "")),
      ).arrayBuffer();
      expect(createHash("sha256").update(new Uint8Array(bytes)).digest("hex")).toBe(
        surface.artifactSha256,
      );
    }
    expect(checkedArtifacts.size).toBe(4);
  });

  test("all 3D studios now have an updater or a typed snapshot path", () => {
    expect(manifest.filter((row) => row.runtime.sharedBus === "updater")).toHaveLength(47);
    expect(manifest.filter((row) => row.runtime.sharedBus === "snapshot")).toHaveLength(32);
    expect(manifest.filter((row) => row.runtime.sharedBus === "missing")).toHaveLength(0);
    expect(manifest.every((row) => row.runtime.sharedBusProvenance === "TS_FALLBACK")).toBe(true);
  });

  test("README catalogue and runtime claims match the executable summary", () => {
    const readme = readFileSync(join(ROOT, "README.md"), "utf8");
    expect(readme).toContain(`${summary.reviewedLedgers} have reviewed ledgers`);
    expect(readme).toContain(`**${summary.publishedEditions} of ${summary.total}**`);
    expect(readme).toContain(`${summary.patentSpecificWasm} patent-specific WASM surface`);
    expect(readme).toContain(`${summary.interpretiveWasm} dedicated interpretive WASM surfaces`);
    expect(readme).toContain(`${summary.genericWasm} generic FrankenSim WASM consumers`);
    expect(readme).toContain(`${summary.typedHostOnly} typed-host-only records`);
    expect(readme).toContain(
      `${summary.sharedBusUpdaters} ticking bus updaters + ${summary.sharedBusSnapshots} typed snapshot publishers`,
    );
  });
});
