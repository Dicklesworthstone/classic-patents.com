import { createHash } from "node:crypto";
import * as THREE from "three";
import { USDZExporter } from "three/examples/jsm/exporters/USDZExporter.js";
import { nativeModelSpecifiers } from "./native-model-specifiers";
import { canonicalizeUSDZArchive, usdzArchivesHaveEquivalentPayload } from "./native-usdz-archive";

const exportArguments = process.argv.slice(2);
const manifestOnly = exportArguments.includes("--manifest-only");
const unsupportedArguments = exportArguments.filter((argument) => argument !== "--manifest-only");
if (unsupportedArguments.length > 0) {
  throw new Error(`Unsupported native-model export arguments: ${unsupportedArguments.join(", ")}`);
}

type ExportedPatent = {
  id: string;
  sourceVisualization:
    | {
        kind: "model";
        spatialComponent: string;
        vectorComponent: string;
      }
    | {
        kind: "source-bound-pdf-only";
        sourceBoundary: string;
      };
};

type NativeVisualizationManifestEntry = {
  id: string;
  kind?: "model" | "no-drawing" | "source-bound-pdf-only";
  asset: string | null;
  builder: string;
  spatialComponent?: string;
  vectorComponent?: string;
  meshCount: number;
  namedNodeCount: number;
  sourceBoundary?: string;
};

const resourcesURL = new URL("./Resources/", import.meta.url);
const threeSourceURL = new URL("../src/components/patents/visuals/three/", import.meta.url);
const records = (await Bun.file(new URL("patents.json", resourcesURL)).json()) as ExportedPatent[];
const nativeVisualizationManifestURL = new URL("native-visualizations.json", resourcesURL);
const existingManifest = manifestOnly
  ? ((await Bun.file(nativeVisualizationManifestURL).json()) as NativeVisualizationManifestEntry[])
  : [];

async function nativeModelDigests(): Promise<readonly (readonly [string, string])[]> {
  const nativeModelGlob = new Bun.Glob("NativeModels/*.usdz");
  const paths = [
    ...nativeModelGlob.scanSync({ cwd: resourcesURL.pathname, onlyFiles: true }),
  ].sort();
  return Promise.all(
    paths.map(async (path) => {
      const asset = Bun.file(new URL(path, resourcesURL));
      const digest = createHash("sha256")
        .update(new Uint8Array(await asset.arrayBuffer()))
        .digest("hex");
      return [path, `${asset.size}:${digest}`] as const;
    }),
  );
}

// This mode is intentionally read-only for every USDZ. It is used when a
// route's publication boundary changes but no authored geometry is being
// regenerated. Snapshotting before and after turns that guarantee into a
// runtime-checked contract rather than relying on a convention alone.
const nativeModelDigestsBefore = manifestOnly ? await nativeModelDigests() : undefined;

const objectSize = (object: THREE.Object3D): number => {
  let count = 0;
  object.traverse(() => {
    count += 1;
  });
  return count;
};

const assignExportNames = (value: unknown, seen = new Set<unknown>(), path = "model"): void => {
  if (!value || typeof value !== "object" || seen.has(value)) return;
  seen.add(value);
  if (value instanceof THREE.Object3D) {
    if (!value.name) value.name = path.replace(/[^A-Za-z0-9_-]/g, "_");
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((child, index) => {
      assignExportNames(child, seen, `${path}_${index}`);
    });
    return;
  }
  for (const [key, child] of Object.entries(value)) {
    if (key === "dispose" || typeof child === "function") continue;
    assignExportNames(child, seen, key);
  }
};

const objectCandidates = (value: unknown, seen = new Set<unknown>()): THREE.Object3D[] => {
  if (!value || typeof value !== "object" || seen.has(value)) return [];
  seen.add(value);
  if (value instanceof THREE.Object3D) return [value];
  const candidates: THREE.Object3D[] = [];
  if (Array.isArray(value)) {
    for (const child of value) candidates.push(...objectCandidates(child, seen));
    return candidates;
  }
  for (const [key, child] of Object.entries(value)) {
    if (key !== "dispose" && typeof child !== "function") {
      candidates.push(...objectCandidates(child, seen));
    }
  }
  return candidates;
};

const modelBuilder = async (
  component: string,
): Promise<{ name: string; result: unknown; root: THREE.Object3D }> => {
  const componentURL = new URL(`${component}.tsx`, threeSourceURL);
  const componentSource = await Bun.file(componentURL).text();
  const moduleSpecifiers = nativeModelSpecifiers(componentSource);
  if (moduleSpecifiers.length === 0) {
    throw new Error(`${component}: no model module import found`);
  }

  const modelModules = await Promise.all(
    moduleSpecifiers.map(async (specifier) => {
      const moduleURL = new URL(`${specifier}.ts`, threeSourceURL);
      return {
        specifier,
        modelModule: (await import(moduleURL.href)) as Record<string, unknown>,
      };
    }),
  );
  const attempts: string[] = [];
  for (const { modelModule } of modelModules) {
    const builders = Object.entries(modelModule).filter(
      ([name, value]) =>
        typeof value === "function" && /^(?:build|create).*(?:Model|Airframe)$/i.test(name),
    );
    for (const [name, candidate] of builders) {
      try {
        const result = (candidate as (...args: never[]) => unknown)();
        assignExportNames(result);
        const roots = objectCandidates(result).sort((a, b) => objectSize(b) - objectSize(a));
        if (roots[0]) return { name, result, root: roots[0] };
        attempts.push(`${name}: returned no Object3D`);
      } catch (error) {
        attempts.push(`${name}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }
  throw new Error(`${component}: no usable model builder (${attempts.join("; ")})`);
};

const exporter = new USDZExporter();
const manifest: NativeVisualizationManifestEntry[] = [];
let preservedAssetCount = 0;
let writtenAssetCount = 0;

const sourceBoundManifestEntry = (
  id: string,
  sourceBoundary: string,
): NativeVisualizationManifestEntry => ({
  id,
  kind: "source-bound-pdf-only",
  asset: null,
  builder: "source-bound:pdf-only",
  meshCount: 0,
  namedNodeCount: 0,
  sourceBoundary,
});

const exportMaterial = (source: THREE.Material): THREE.MeshStandardMaterial => {
  const material = source as THREE.Material & {
    color?: THREE.Color;
    emissive?: THREE.Color;
    emissiveIntensity?: number;
    metalness?: number;
    roughness?: number;
    opacity?: number;
    transparent?: boolean;
    side?: THREE.Side;
  };
  return new THREE.MeshStandardMaterial({
    name: material.name,
    color: material.color?.clone() ?? new THREE.Color(0xb79a68),
    emissive: material.emissive?.clone() ?? new THREE.Color(0x000000),
    emissiveIntensity: material.emissiveIntensity ?? 1,
    metalness: material.metalness ?? 0.15,
    roughness: material.roughness ?? 0.68,
    opacity: material.opacity ?? 1,
    transparent: material.transparent ?? false,
    // USDZ is one-sided. Geometry authored as DoubleSide still remains
    // orbitable; keeping the front face also avoids exporter log floods.
    side: THREE.FrontSide,
  });
};

const prepareForUSDZ = (root: THREE.Object3D): void => {
  root.traverse((node) => {
    if (!(node instanceof THREE.Mesh) && !(node instanceof THREE.InstancedMesh)) return;
    node.material = Array.isArray(node.material)
      ? node.material.map(exportMaterial)
      : exportMaterial(node.material);
  });
};

if (manifestOnly) {
  const existingByID = new Map(existingManifest.map((entry) => [entry.id, entry]));
  for (const record of records) {
    if (record.sourceVisualization.kind === "source-bound-pdf-only") {
      manifest.push(sourceBoundManifestEntry(record.id, record.sourceVisualization.sourceBoundary));
      continue;
    }
    const existing = existingByID.get(record.id);
    if (existing) manifest.push(existing);
  }
  const pendingModelIDs: string[] = [];
  for (const record of records) {
    if (record.sourceVisualization.kind === "model" && !existingByID.has(record.id)) {
      pendingModelIDs.push(record.id);
    }
  }
  if (pendingModelIDs.length > 0) {
    console.log(
      `Manifest-only export retained ${manifest.length} existing native exhibits; ` +
        `${pendingModelIDs.length} newer model route(s) remain pending a deliberate USDZ export: ` +
        pendingModelIDs.join(", "),
    );
  }
} else {
  // USDZExporter assigns process-global identifiers. Preserve the existing
  // record order by exporting one model at a time, without an await in a loop.
  const exportModelsInRecordOrder = async (index: number): Promise<void> => {
    const record = records[index];
    if (!record) return;
    if (record.sourceVisualization.kind === "source-bound-pdf-only") {
      manifest.push(sourceBoundManifestEntry(record.id, record.sourceVisualization.sourceBoundary));
      console.log(`[${index + 1}/${records.length}] ${record.id}: source-bound PDF-only exhibit`);
      return exportModelsInRecordOrder(index + 1);
    }

    const { spatialComponent, vectorComponent } = record.sourceVisualization;
    let built: Awaited<ReturnType<typeof modelBuilder>>;
    try {
      built = await modelBuilder(spatialComponent);
    } catch (error) {
      if (record.id !== "us-971501-haber-ammonia") throw error;
      manifest.push({
        id: record.id,
        kind: "no-drawing",
        asset: null,
        builder: "source-boundary:no-drawing",
        spatialComponent,
        vectorComponent,
        meshCount: 0,
        namedNodeCount: 0,
        sourceBoundary:
          "US 971,501 contains no apparatus drawing; its web exhibit intentionally withholds the interpretive process-loop model.",
      });
      console.log(
        `[${index + 1}/${records.length}] ${record.id}: source-bounded live chemistry exhibit`,
      );
      return exportModelsInRecordOrder(index + 1);
    }
    const { name: builder, root } = built;
    prepareForUSDZ(root);
    root.updateMatrixWorld(true);

    let meshCount = 0;
    let namedNodeCount = 0;
    root.traverse((node) => {
      if (node.name) namedNodeCount += 1;
      if (node instanceof THREE.Mesh || node instanceof THREE.InstancedMesh) meshCount += 1;
    });
    if (meshCount === 0) throw new Error(`${record.id}: ${builder} exported no meshes`);

    const asset = `NativeModels/${record.id}.usdz`;
    const bytes = await exporter.parseAsync(root, { quickLookCompatible: true });
    const assetURL = new URL(asset, resourcesURL);
    const generatedBytes = new Uint8Array(bytes);
    const existingFile = Bun.file(assetURL);
    const existingBytes =
      existingFile.size > 0 ? new Uint8Array(await existingFile.arrayBuffer()) : null;
    if (existingBytes && usdzArchivesHaveEquivalentPayload(existingBytes, generatedBytes)) {
      preservedAssetCount += 1;
    } else {
      await Bun.write(assetURL, canonicalizeUSDZArchive(generatedBytes));
      writtenAssetCount += 1;
    }
    manifest.push({
      id: record.id,
      kind: "model",
      asset,
      builder,
      spatialComponent,
      vectorComponent,
      meshCount,
      namedNodeCount,
    });
    console.log(
      `[${index + 1}/${records.length}] ${record.id}: ${meshCount} meshes via ${builder}`,
    );
    return exportModelsInRecordOrder(index + 1);
  };
  await exportModelsInRecordOrder(0);
}

await Bun.write(nativeVisualizationManifestURL, `${JSON.stringify(manifest, null, 2)}\n`);

if (nativeModelDigestsBefore) {
  const nativeModelDigestsAfter = await nativeModelDigests();
  if (JSON.stringify(nativeModelDigestsAfter) !== JSON.stringify(nativeModelDigestsBefore)) {
    throw new Error("Manifest-only export altered a preserved native USDZ asset");
  }
  console.log(
    `Manifest-only export preserved ${nativeModelDigestsBefore.length} native USDZ assets byte-for-byte.`,
  );
}

console.log(
  manifestOnly
    ? `Exported native visualization manifest for ${manifest.length} native patent exhibits.`
    : `Exported ${manifest.length} native patent exhibits: ${writtenAssetCount} USDZ assets written, ` +
        `${preservedAssetCount} byte-stable assets preserved.`,
);
