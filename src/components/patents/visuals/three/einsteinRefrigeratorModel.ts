import * as THREE from "three";
import type { GenericKernelSource } from "@/physics/genericWasm";
import { createLcg } from "@/utils/lcg";
import { createGlowPointTexture } from "./ThreeStudioScene";

type SourcePortId =
  | "generator-rich-inlet"
  | "generator-vapor-outlet"
  | "generator-lift-inlet"
  | "container-lift-outlet"
  | "container-weak-outlet"
  | "container-vent-outlet"
  | "condenser-vapor-inlet"
  | "condenser-butane-outlet"
  | "condenser-rich-outlet"
  | "condenser-weak-inlet"
  | "condenser-vent-inlet"
  | "evaporator-vapor-outlet"
  | "evaporator-butane-inlet"
  | "evaporator-distributor";

type Point3 = readonly [number, number, number];

/** Display-space seats for the numbered organs in the grant's sole drawing. */
export const EINSTEIN_SOURCE_PORTS: Readonly<Record<SourcePortId, Point3>> = {
  "generator-rich-inlet": [-3.4, -2.75, 0],
  "generator-vapor-outlet": [-3.4, -1.05, -0.28],
  "generator-lift-inlet": [-3.18, -2.3, 0.28],
  "container-lift-outlet": [-2.65, 2.0, 0.28],
  "container-weak-outlet": [-2.3, 2.25, 0.38],
  "container-vent-outlet": [-2.65, 3.05, -0.38],
  "condenser-vapor-inlet": [0.72, 0.58, 0],
  "condenser-butane-outlet": [0.72, -0.55, 0.24],
  "condenser-rich-outlet": [0, -1.45, 0],
  "condenser-weak-inlet": [-0.42, 1.3, 0.38],
  "condenser-vent-inlet": [0.42, 1.35, -0.38],
  "evaporator-vapor-outlet": [3.4, 1.42, 0],
  "evaporator-butane-inlet": [3.4, -0.72, 0.24],
  "evaporator-distributor": [3.4, -0.55, -0.28],
};

export interface EinsteinSourceConduit {
  readonly id: "5" | "11" | "27" | "30" | "32" | "34" | "37";
  readonly from: SourcePortId;
  readonly to: SourcePortId;
  readonly points: readonly Point3[];
  readonly flow:
    | "butane-vapor"
    | "liquid-butane"
    | "rich-solution"
    | "ammonia"
    | "weak-solution"
    | "vent";
}

/**
 * Every route begins and ends at an explicit source-organ port. Conduit 30 is
 * drawn behind conduit 5 where their heat-exchange run overlaps, matching the
 * nested relation described in the specification without pretending to know
 * unprinted pipe diameters.
 */
export const EINSTEIN_SOURCE_CONDUITS: readonly EinsteinSourceConduit[] = [
  {
    id: "5",
    from: "evaporator-vapor-outlet",
    to: "condenser-vapor-inlet",
    points: [
      EINSTEIN_SOURCE_PORTS["evaporator-vapor-outlet"],
      [2.55, 1.42, 0],
      [2.35, 0.75, 0],
      EINSTEIN_SOURCE_PORTS["condenser-vapor-inlet"],
    ],
    flow: "butane-vapor",
  },
  {
    id: "11",
    from: "condenser-butane-outlet",
    to: "evaporator-butane-inlet",
    points: [
      EINSTEIN_SOURCE_PORTS["condenser-butane-outlet"],
      [1.65, -0.55, 0.24],
      [2.55, -0.72, 0.24],
      EINSTEIN_SOURCE_PORTS["evaporator-butane-inlet"],
    ],
    flow: "liquid-butane",
  },
  {
    id: "27",
    from: "condenser-rich-outlet",
    to: "generator-rich-inlet",
    points: [
      EINSTEIN_SOURCE_PORTS["condenser-rich-outlet"],
      [-0.25, -2.45, 0],
      [-1.55, -2.65, 0],
      EINSTEIN_SOURCE_PORTS["generator-rich-inlet"],
    ],
    flow: "rich-solution",
  },
  {
    id: "30",
    from: "generator-vapor-outlet",
    to: "evaporator-distributor",
    points: [
      EINSTEIN_SOURCE_PORTS["generator-vapor-outlet"],
      [-4.05, 2.95, -0.28],
      [0.72, 2.95, -0.28],
      [0.72, 0.58, 0],
      [2.35, 0.75, 0],
      [2.55, 1.42, 0],
      [3.4, 1.42, 0],
      [3.95, 1.05, -0.28],
      [3.95, -0.55, -0.28],
      EINSTEIN_SOURCE_PORTS["evaporator-distributor"],
    ],
    flow: "ammonia",
  },
  {
    id: "32",
    from: "generator-lift-inlet",
    to: "container-lift-outlet",
    points: [
      EINSTEIN_SOURCE_PORTS["generator-lift-inlet"],
      [-3.18, 1.65, 0.28],
      EINSTEIN_SOURCE_PORTS["container-lift-outlet"],
    ],
    flow: "weak-solution",
  },
  {
    id: "34",
    from: "container-vent-outlet",
    to: "condenser-vent-inlet",
    points: [
      EINSTEIN_SOURCE_PORTS["container-vent-outlet"],
      [-0.8, 3.05, -0.38],
      [0.42, 2.55, -0.38],
      EINSTEIN_SOURCE_PORTS["condenser-vent-inlet"],
    ],
    flow: "vent",
  },
  {
    id: "37",
    from: "container-weak-outlet",
    to: "condenser-weak-inlet",
    points: [
      EINSTEIN_SOURCE_PORTS["container-weak-outlet"],
      [-2.3, -1.8, 0.38],
      [-1.55, -2.25, 0.38],
      [-0.9, 0.95, 0.38],
      EINSTEIN_SOURCE_PORTS["condenser-weak-inlet"],
    ],
    flow: "weak-solution",
  },
] as const;

export interface EinsteinRefrigeratorModel {
  rootGroup: THREE.Group;
  fridgeGroup: THREE.Group;
  generatorMesh: THREE.Mesh;
  heaterMesh: THREE.Mesh;
  condenserGroup: THREE.Group;
  evaporatorMesh: THREE.Mesh;
  containerMesh: THREE.Mesh;
  heatExchangerMesh: THREE.Mesh;
  liftPathGroup: THREE.Group;
  conduitCurves: readonly THREE.CatmullRomCurve3[];
  fluidPoints: THREE.Points;
  fluidPositions: Float32Array;
  fluidPathIndices: Uint8Array;
  fluidPhases: Float32Array;
  fluidCount: number;
  kernelSource?: GenericKernelSource;
  materials: {
    weldedSteel: THREE.MeshStandardMaterial;
    hotGenerator: THREE.MeshStandardMaterial;
    heaterGlow: THREE.MeshStandardMaterial;
    coldEvaporator: THREE.MeshStandardMaterial;
    condenserFins: THREE.MeshStandardMaterial;
    absorberMat: THREE.MeshStandardMaterial;
    fluidMat: THREE.PointsMaterial;
    insulationMat?: THREE.MeshStandardMaterial;
    frostMat?: THREE.MeshStandardMaterial;
    weldSeamMat?: THREE.MeshStandardMaterial;
  };
  dispose: () => void;
}

export function buildEinsteinRefrigeratorModel(): EinsteinRefrigeratorModel {
  const lcg = createLcg(1930);
  const rootGroup = new THREE.Group();
  const materialsToDispose: THREE.Material[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];
  const texturesToDispose: THREE.Texture[] = [];

  // --- 1. AUTHENTIC PBR MATERIALS ---
  const weldedSteel = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    roughness: 0.2,
    metalness: 0.9,
    transparent: true,
    opacity: 1.0,
  });
  materialsToDispose.push(weldedSteel);

  const hotGenerator = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    roughness: 0.25,
    metalness: 0.8,
    emissive: 0xd97706,
    emissiveIntensity: 0.6,
  });
  materialsToDispose.push(hotGenerator);

  const heaterGlow = new THREE.MeshStandardMaterial({
    color: 0xff3b30,
    emissive: 0xff5500,
    emissiveIntensity: 0.9,
    roughness: 0.3,
  });
  materialsToDispose.push(heaterGlow);

  const coldEvaporator = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    roughness: 0.12,
    metalness: 0.85,
    emissive: 0x0284c7,
    emissiveIntensity: 0.45,
  });
  materialsToDispose.push(coldEvaporator);

  const condenserFins = new THREE.MeshStandardMaterial({
    color: 0x64748b,
    roughness: 0.32,
    metalness: 0.85,
  });
  materialsToDispose.push(condenserFins);

  const absorberMat = new THREE.MeshStandardMaterial({
    color: 0x475569,
    roughness: 0.3,
    metalness: 0.88,
    transparent: true,
    opacity: 1.0,
  });
  materialsToDispose.push(absorberMat);

  const insulationMat = new THREE.MeshStandardMaterial({
    color: 0xd4d4d8,
    roughness: 0.8,
    metalness: 0.05,
  });
  materialsToDispose.push(insulationMat);

  const frostMat = new THREE.MeshStandardMaterial({
    color: 0xe0f2fe,
    roughness: 0.15,
    metalness: 0.2,
    emissive: 0x38bdf8,
    emissiveIntensity: 0.3,
  });
  materialsToDispose.push(frostMat);

  const weldSeamMat = new THREE.MeshStandardMaterial({
    color: 0x475569,
    roughness: 0.45,
    metalness: 0.95,
  });
  materialsToDispose.push(weldSeamMat);

  // --- 2. HERMETIC VESSEL HIERARCHY ---
  const fridgeGroup = new THREE.Group();
  rootGroup.add(fridgeGroup);

  // Structural Mounting Chassis / Angle-Iron Frame & Base Skids
  const chassisGroup = new THREE.Group();
  fridgeGroup.add(chassisGroup);

  [-3.8, 4.4].forEach((lx) => {
    const legGeo = new THREE.BoxGeometry(0.3, 0.4, 3.4);
    geometriesToDispose.push(legGeo);
    const leg = new THREE.Mesh(legGeo, weldedSteel);
    leg.position.set(lx, -3.3, 0);
    leg.castShadow = true;
    leg.receiveShadow = true;
    chassisGroup.add(leg);
  });

  // 4 Welded Vertical Angle-Iron Chassis Columns
  for (const cx of [-3.8, 4.4]) {
    for (const cz of [-1.5, 1.5]) {
      const colGeo = new THREE.BoxGeometry(0.18, 6.6, 0.18);
      geometriesToDispose.push(colGeo);
      const col = new THREE.Mesh(colGeo, weldedSteel);
      col.position.set(cx, 0, cz);
      col.castShadow = true;
      chassisGroup.add(col);
    }
  }

  // Horizontal Cross-Bracing Girders (Top, Middle, Bottom)
  for (const gy of [-3.1, 0.2, 3.3]) {
    for (const gz of [-1.5, 1.5]) {
      const gBeamGeo = new THREE.BoxGeometry(8.4, 0.14, 0.14);
      geometriesToDispose.push(gBeamGeo);
      const gBeam = new THREE.Mesh(gBeamGeo, weldedSteel);
      gBeam.position.set(0.3, gy, gz);
      chassisGroup.add(gBeam);
    }
  }

  // Neutral museum-display brackets: every vessel has a visible load path
  // into the frame. The brackets are not numbered patent organs.
  for (const [sx, sy, width] of [
    [-3.4, -3.05, 1.8],
    [-2.65, 1.92, 1.5],
    [0, -1.55, 1.9],
    [3.4, -0.88, 1.9],
  ] as const) {
    const saddleGeo = new THREE.BoxGeometry(width, 0.16, 1.35);
    geometriesToDispose.push(saddleGeo);
    const saddle = new THREE.Mesh(saddleGeo, weldedSteel);
    saddle.position.set(sx, sy, 0);
    saddle.castShadow = true;
    chassisGroup.add(saddle);
  }

  // Generator 29: low in the source drawing so rich solution returns by gravity.
  const genGeo = new THREE.CylinderGeometry(0.72, 0.72, 2.0, 24);
  geometriesToDispose.push(genGeo);
  const generatorMesh = new THREE.Mesh(genGeo, hotGenerator);
  generatorMesh.position.set(-3.4, -2.05, 0);
  generatorMesh.castShadow = true;
  fridgeGroup.add(generatorMesh);

  // Generator Circumferential Weld Seam Rings
  [-2.92, -1.18].forEach((wy) => {
    const weldGeo = new THREE.TorusGeometry(0.74, 0.035, 8, 24);
    geometriesToDispose.push(weldGeo);
    const weld = new THREE.Mesh(weldGeo, weldSeamMat);
    weld.rotation.x = Math.PI / 2;
    weld.position.set(-3.4, wy, 0);
    fridgeGroup.add(weld);
  });

  // Source-bounded heat seat below generator 29; the grant leaves its type open.
  const heaterGeo = new THREE.CylinderGeometry(0.82, 0.82, 0.38, 24);
  geometriesToDispose.push(heaterGeo);
  const heaterMesh = new THREE.Mesh(heaterGeo, heaterGlow);
  heaterMesh.position.set(-3.4, -3.18, 0);
  heaterMesh.castShadow = true;
  fridgeGroup.add(heaterMesh);

  // Condenser 6 and surrounding cooling-water jacket 12.
  const condenserGroup = new THREE.Group();
  fridgeGroup.add(condenserGroup);

  const condenserGeo = new THREE.CylinderGeometry(0.72, 0.72, 2.75, 24);
  geometriesToDispose.push(condenserGeo);
  const condenserMesh = new THREE.Mesh(condenserGeo, condenserFins);
  condenserMesh.castShadow = true;
  condenserGroup.add(condenserMesh);

  for (let f = 0; f < 7; f++) {
    const finGeo = new THREE.TorusGeometry(0.8, 0.035, 8, 24);
    geometriesToDispose.push(finGeo);
    const fin = new THREE.Mesh(finGeo, condenserFins);
    fin.rotation.x = Math.PI / 2;
    fin.position.y = -1.15 + f * 0.38;
    fin.castShadow = true;
    condenserGroup.add(fin);
  }

  // Evaporator 1, at the right in the source drawing.
  const evapGeo = new THREE.CylinderGeometry(0.72, 0.72, 2.2, 24);
  geometriesToDispose.push(evapGeo);
  const evaporatorMesh = new THREE.Mesh(evapGeo, coldEvaporator);
  evaporatorMesh.position.set(3.4, 0.32, 0);
  evaporatorMesh.castShadow = true;
  fridgeGroup.add(evaporatorMesh);

  // Elevated weak-solution container 33.
  const containerGeo = new THREE.CylinderGeometry(0.62, 0.62, 1.05, 24);
  geometriesToDispose.push(containerGeo);
  const containerMesh = new THREE.Mesh(containerGeo, absorberMat);
  containerMesh.position.set(-2.65, 2.52, 0);
  containerMesh.castShadow = true;
  fridgeGroup.add(containerMesh);

  // Heat-exchanger jacket 28 encloses the strong/weak solution paths.
  const exchangerGeo = new THREE.CylinderGeometry(0.42, 0.42, 1.7, 20, 1, true);
  geometriesToDispose.push(exchangerGeo);
  const heatExchangerMesh = new THREE.Mesh(exchangerGeo, absorberMat);
  heatExchangerMesh.position.set(-1.55, -2.05, 0.18);
  heatExchangerMesh.castShadow = true;
  fridgeGroup.add(heatExchangerMesh);

  const liftPathGroup = new THREE.Group();
  liftPathGroup.name = "claim-1-heated-lift-conduit-32";
  fridgeGroup.add(liftPathGroup);

  const conduitCurves: THREE.CatmullRomCurve3[] = [];
  for (const route of EINSTEIN_SOURCE_CONDUITS) {
    const curve = new THREE.CatmullRomCurve3(
      route.points.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
      false,
      "centripetal",
    );
    conduitCurves.push(curve);
    const conduitGeo = new THREE.TubeGeometry(
      curve,
      Math.max(24, route.points.length * 12),
      route.id === "5" ? 0.16 : route.id === "30" ? 0.065 : 0.105,
      10,
      false,
    );
    geometriesToDispose.push(conduitGeo);
    const conduit = new THREE.Mesh(conduitGeo, weldedSteel);
    conduit.name = `source-conduit-${route.id}`;
    conduit.castShadow = true;
    (route.id === "32" ? liftPathGroup : fridgeGroup).add(conduit);
  }

  // Separate source heat 36 around lift conduit 32.
  const liftHeaterGeo = new THREE.TorusGeometry(0.24, 0.08, 10, 24);
  geometriesToDispose.push(liftHeaterGeo);
  const liftHeater = new THREE.Mesh(liftHeaterGeo, heaterGlow);
  liftHeater.rotation.x = Math.PI / 2;
  liftHeater.position.set(-3.18, 0.4, 0.28);
  liftHeater.name = "source-heat-36";
  liftPathGroup.add(liftHeater);

  // Flow tracers are constrained to source conduits; none can float through open space.
  const flowingRoutes = EINSTEIN_SOURCE_CONDUITS.filter((route) => route.flow !== "vent");
  const fluidCount = 144;
  const fluidGeo = new THREE.BufferGeometry();
  geometriesToDispose.push(fluidGeo);
  const fluidPositions = new Float32Array(fluidCount * 3);
  const fluidColors = new Float32Array(fluidCount * 3);
  const fluidPathIndices = new Uint8Array(fluidCount);
  const fluidPhases = new Float32Array(fluidCount);

  const glowTex = createGlowPointTexture();
  texturesToDispose.push(glowTex);

  for (let i = 0; i < fluidCount; i++) {
    const idx = i * 3;
    const flowingRoute = flowingRoutes[i % flowingRoutes.length];
    const routeIndex = EINSTEIN_SOURCE_CONDUITS.indexOf(flowingRoute);
    const phase = (i / fluidCount + lcg() * 0.08) % 1;
    const point = conduitCurves[routeIndex].getPointAt(phase);
    fluidPathIndices[i] = routeIndex;
    fluidPhases[i] = phase;
    fluidPositions[idx] = point.x;
    fluidPositions[idx + 1] = point.y;
    fluidPositions[idx + 2] = point.z;

    const color =
      flowingRoute.flow === "ammonia"
        ? [1.0, 0.75, 0.2]
        : flowingRoute.flow === "liquid-butane"
          ? [0.2, 0.85, 1.0]
          : flowingRoute.flow === "butane-vapor"
            ? [0.65, 0.9, 1.0]
            : [0.45, 1.0, 0.55];
    fluidColors[idx] = color[0];
    fluidColors[idx + 1] = color[1];
    fluidColors[idx + 2] = color[2];
  }

  fluidGeo.setAttribute("position", new THREE.BufferAttribute(fluidPositions, 3));
  fluidGeo.setAttribute("color", new THREE.BufferAttribute(fluidColors, 3));

  const fluidMat = new THREE.PointsMaterial({
    size: 0.16,
    map: glowTex,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  materialsToDispose.push(fluidMat);

  const fluidPoints = new THREE.Points(fluidGeo, fluidMat);
  fridgeGroup.add(fluidPoints);

  const dispose = () => {
    for (const geo of geometriesToDispose) geo.dispose();
    for (const mat of materialsToDispose) mat.dispose();
    for (const tex of texturesToDispose) tex.dispose();
  };

  return {
    rootGroup,
    fridgeGroup,
    generatorMesh,
    heaterMesh,
    condenserGroup,
    evaporatorMesh,
    containerMesh,
    heatExchangerMesh,
    liftPathGroup,
    conduitCurves,
    fluidPoints,
    fluidPositions,
    fluidPathIndices,
    fluidPhases,
    fluidCount,
    materials: {
      weldedSteel,
      hotGenerator,
      heaterGlow,
      coldEvaporator,
      condenserFins,
      absorberMat,
      fluidMat,
    },
    dispose,
  };
}

/**
 * Updates Einstein-Szilard single-pressure absorption refrigerator convection circulation, heating glow, and cutaway.
 */
export function updateEinsteinRefrigeratorKinematics(
  model: EinsteinRefrigeratorModel,
  delta: number,
  fluidDisplaySpeed: number,
  heaterGlowIntensity: number,
  generatorGlowIntensity: number,
  isHeating: boolean,
  isCutaway = false,
  _heatFrameIndex = 7,
  _fluidWrapY = 2.8,
  claim1LiftPathPresent = true,
): void {
  // Move each tracer along the centerline of a connected source conduit.
  // This is a deliberately slowed display coordinate, not an asserted SI velocity.
  const pos = model.fluidPositions;
  const phaseAdvance = isHeating && claim1LiftPathPresent ? fluidDisplaySpeed * delta * 0.018 : 0;
  for (let i = 0; i < model.fluidCount; i++) {
    const idx = i * 3;
    const phase = (model.fluidPhases[i] + phaseAdvance) % 1;
    model.fluidPhases[i] = phase;
    const point = model.conduitCurves[model.fluidPathIndices[i]].getPointAt(phase);
    pos[idx] = point.x;
    pos[idx + 1] = point.y;
    pos[idx + 2] = point.z;
  }
  model.fluidPoints.geometry.attributes.position.needsUpdate = true;
  model.fluidPoints.visible = claim1LiftPathPresent;
  model.liftPathGroup.visible = claim1LiftPathPresent;

  // Heater & Generator Glow
  const operating = isHeating && claim1LiftPathPresent;
  model.materials.heaterGlow.emissiveIntensity = operating ? heaterGlowIntensity : 0.05;
  model.materials.hotGenerator.emissiveIntensity = operating ? generatorGlowIntensity : 0.05;

  // Cutaway transparency
  model.materials.weldedSteel.opacity = isCutaway ? 0.35 : 1.0;
  model.materials.weldedSteel.transparent = isCutaway;
  model.materials.absorberMat.opacity = isCutaway ? 0.35 : 1.0;
  model.materials.absorberMat.transparent = isCutaway;
}
