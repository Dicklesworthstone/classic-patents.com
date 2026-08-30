import * as THREE from "three";
import { USDZExporter } from "three/examples/jsm/exporters/USDZExporter.js";

type ExportedPatent = {
  id: string;
  sourceVisualization: {
    spatialComponent: string;
    vectorComponent: string;
  };
};

type NativeVisualizationManifestEntry = {
  id: string;
  asset: string | null;
  builder: string;
  spatialComponent: string;
  vectorComponent: string;
  meshCount: number;
  namedNodeCount: number;
  sourceBoundary?: string;
};

const resourcesURL = new URL("./Resources/", import.meta.url);
const threeSourceURL = new URL("../src/components/patents/visuals/three/", import.meta.url);
const records = (await Bun.file(new URL("patents.json", resourcesURL)).json()) as ExportedPatent[];

const objectSize = (object: THREE.Object3D): number => {
  let count = 0;
  object.traverse(() => { count += 1; });
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
    value.forEach((child, index) => assignExportNames(child, seen, `${path}_${index}`));
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
  if (Array.isArray(value)) return value.flatMap((child) => objectCandidates(child, seen));
  return Object.entries(value)
    .filter(([key, child]) => key !== "dispose" && typeof child !== "function")
    .flatMap(([, child]) => objectCandidates(child, seen));
};

const modelModuleSpecifiers = (source: string): string[] => {
  const matches = source.matchAll(/from\s+["'](\.\/[A-Za-z0-9_-]*(?:Model|model|Airframe|airframe))["']/g);
  return [...new Set([...matches].map((match) => match[1]))];
};

const modelBuilder = async (component: string): Promise<{ name: string; result: unknown; root: THREE.Object3D }> => {
  const componentURL = new URL(`${component}.tsx`, threeSourceURL);
  const componentSource = await Bun.file(componentURL).text();
  const moduleSpecifiers = modelModuleSpecifiers(componentSource);
  if (moduleSpecifiers.length === 0) {
    throw new Error(`${component}: no model module import found`);
  }

  const attempts: string[] = [];
  for (const specifier of moduleSpecifiers) {
    const moduleURL = new URL(`${specifier}.ts`, componentURL);
    const modelModule = await import(moduleURL.href) as Record<string, unknown>;
    const builders = Object.entries(modelModule).filter(([name, value]) => (
      typeof value === "function" && /^(?:build|create).*(?:Model|Airframe)$/i.test(name)
    ));
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

for (const [index, record] of records.entries()) {
  const { spatialComponent, vectorComponent } = record.sourceVisualization;
  let built: Awaited<ReturnType<typeof modelBuilder>>;
  try {
    built = await modelBuilder(spatialComponent);
  } catch (error) {
    if (record.id !== "us-971501-haber-ammonia") throw error;
    manifest.push({
      id: record.id,
      asset: null,
      builder: "source-boundary:no-drawing",
      spatialComponent,
      vectorComponent,
      meshCount: 0,
      namedNodeCount: 0,
      sourceBoundary: "US 971,501 contains no apparatus drawing; its web exhibit intentionally withholds the interpretive process-loop model.",
    });
    console.log(`[${index + 1}/${records.length}] ${record.id}: source-bounded live chemistry exhibit`);
    continue;
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
  await Bun.write(new URL(asset, resourcesURL), bytes);
  manifest.push({
    id: record.id,
    asset,
    builder,
    spatialComponent,
    vectorComponent,
    meshCount,
    namedNodeCount,
  });
  console.log(`[${index + 1}/${records.length}] ${record.id}: ${meshCount} meshes via ${builder}`);
}

await Bun.write(
  new URL("native-visualizations.json", resourcesURL),
  `${JSON.stringify(manifest, null, 2)}\n`,
);

console.log(`Exported ${manifest.length} native USDZ patent exhibits.`);
