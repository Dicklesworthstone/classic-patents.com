/**
 * bardeenTransistorModel.ts
 *
 * Procedural 3D reading of Fig. 1 and Fig. 1a in US 2,524,035.
 *
 * The model is intentionally limited to structures printed in this grant:
 * block 1, plated base 2, P-type surface layer 3, barrier 4, and the close
 * spring-wire emitter 5 and collector 6. It does not reconstruct the separate
 * December 1947 laboratory fixture.
 */

import * as THREE from "three";
import {
  BARDEEN_CARRIER_RESET_PAD,
  BARDEEN_CARRIER_WRAP_PAD,
} from "@/physics/bardeenPointContactKernel";
import { createGlowPointTexture } from "./ThreeStudioScene";

export interface BardeenTransistorModelNodes {
  rootGroup: THREE.Group;
  baseFilm: THREE.Mesh;
  geBlock: THREE.Mesh;
  surfaceLayer: THREE.Mesh;
  barrierLayer: THREE.Mesh;
  emitterGroup: THREE.Group;
  collectorGroup: THREE.Group;
  emitterContact: THREE.Mesh;
  collectorContact: THREE.Mesh;
  inputTransformer: THREE.Group;
  outputTransformer: THREE.Group;
  emitterBattery: THREE.Mesh;
  collectorBattery: THREE.Mesh;
  circuitConductors: readonly THREE.Mesh[];
  carrierPoints: THREE.Points;
  carrierPositions: Float32Array;
  carrierCount: number;
}

export interface BardeenTransistorMaterials {
  germaniumCrystal: THREE.MeshStandardMaterial;
  baseMetal: THREE.MeshStandardMaterial;
  surfaceLayer: THREE.MeshPhysicalMaterial;
  barrierLayer: THREE.MeshPhysicalMaterial;
  springWire: THREE.MeshStandardMaterial;
  carrierMaterial: THREE.PointsMaterial;
}

export interface BardeenTransistorModelResult {
  rootGroup: THREE.Group;
  nodes: BardeenTransistorModelNodes;
  materials: BardeenTransistorMaterials;
  dispose: () => void;
}

/**
 * Deterministic unit noise for procedural texture generation.
 */
function deterministicUnit(index: number, channel: number): number {
  const sample = Math.sin((index + 1) * 12.9898 + (channel + 1) * 78.233) * 43758.5453;
  return sample - Math.floor(sample);
}

/**
 * Procedural Etched N-Type Germanium Crystal Texture
 */
function createGermaniumTexture(): THREE.CanvasTexture | undefined {
  if (typeof document === "undefined") return undefined;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;

  // Dark slate-gray metallic semiconductor base
  ctx.fillStyle = "#334155";
  ctx.fillRect(0, 0, 512, 512);

  // Crystal cleavage striations & chemical etch pits
  for (let i = 0; i < 70; i++) {
    const y = i * 7.5 + (deterministicUnit(i, 0) - 0.5) * 5;
    const alpha = 0.08 + (i % 3 === 0 ? 0.12 : 0.03);
    ctx.strokeStyle = `rgba(148, 163, 184, ${alpha})`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y + (deterministicUnit(i, 1) - 0.5) * 15);
    ctx.stroke();
  }

  // Microscopic etch pits & grain boundaries
  for (let p = 0; p < 220; p++) {
    const px = deterministicUnit(p, 2) * 512;
    const py = deterministicUnit(p, 3) * 512;
    ctx.fillStyle = "rgba(15, 23, 42, 0.35)";
    ctx.beginPath();
    ctx.arc(px, py, 1.5 + deterministicUnit(p, 4) * 3, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const CARRIER_COUNT = 120;
const CONTACT_SURFACE_Y = 0.16;
const EMITTER_UPPER_ANCHOR = new THREE.Vector3(-1.45, 2.05, 0);
const COLLECTOR_UPPER_ANCHOR = new THREE.Vector3(1.45, 2.05, 0);

function setConnectedCylinder(mesh: THREE.Mesh, start: THREE.Vector3, end: THREE.Vector3): void {
  const delta = end.clone().sub(start);
  mesh.position.copy(start).add(end).multiplyScalar(0.5);
  mesh.scale.set(1, delta.length(), 1);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.normalize());
}

export function buildBardeenTransistorModel(): BardeenTransistorModelResult {
  const rootGroup = new THREE.Group();
  const materialsToDispose: THREE.Material[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];
  const texturesToDispose: THREE.Texture[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(geo: T): T => {
    geometriesToDispose.push(geo);
    return geo;
  };
  const trackMat = <T extends THREE.Material>(mat: T): T => {
    materialsToDispose.push(mat);
    return mat;
  };

  const geTex = createGermaniumTexture();
  if (geTex) texturesToDispose.push(geTex);

  const glowTex = createGlowPointTexture();
  texturesToDispose.push(glowTex);

  // Materials
  const materials: BardeenTransistorMaterials = {
    germaniumCrystal: trackMat(
      new THREE.MeshStandardMaterial({
        ...(geTex ? { map: geTex } : {}),
        color: 0x475569,
        roughness: 0.15,
        metalness: 0.85,
      }),
    ),
    baseMetal: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xb87333,
        roughness: 0.25,
        metalness: 0.9,
      }),
    ),
    surfaceLayer: trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        transmission: 0.3,
        opacity: 0.62,
        transparent: true,
        roughness: 0.25,
      }),
    ),
    barrierLayer: trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0xa78bfa,
        transmission: 0.2,
        opacity: 0.5,
        transparent: true,
        roughness: 0.3,
      }),
    ),
    springWire: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xb7791f,
        roughness: 0.28,
        metalness: 0.88,
      }),
    ),
    carrierMaterial: trackMat(
      new THREE.PointsMaterial({
        color: 0x38bdf8,
        size: 0.22,
        map: glowTex,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    ),
  };

  // Exhibit foundation for the complete Fig. 1 circuit path.
  const plinth = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(12, 0.35, 6.2)),
    materials.baseMetal,
  );
  plinth.name = "Bardeen Fig. 1 apparatus foundation";
  plinth.position.y = -1.4;
  plinth.receiveShadow = true;
  rootGroup.add(plinth);

  // Block 1: the supporting semiconductor body shown in Fig. 1 and Fig. 1a.
  const geBlock = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(6.2, 1.1, 5.2)),
    materials.germaniumCrystal,
  );
  geBlock.position.y = -0.55;
  geBlock.castShadow = true;
  rootGroup.add(geBlock);

  // Metal film 2: the patent permits copper or gold but does not require
  // either one. The neutral copper color is a display choice, not a claim.
  const baseFilm = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(6.0, 0.12, 5.0)),
    materials.baseMetal,
  );
  baseFilm.position.y = -1.18;
  baseFilm.receiveShadow = true;
  rootGroup.add(baseFilm);

  // P-type surface layer 3 and high-resistance barrier 4 from Fig. 1a. Their
  // visible thicknesses are exaggerated so the visitor can inspect them.
  const barrierLayer = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(6.0, 0.08, 5.0)),
    materials.barrierLayer,
  );
  barrierLayer.position.y = 0.02;
  rootGroup.add(barrierLayer);

  const surfaceLayer = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(6.0, 0.1, 5.0)),
    materials.surfaceLayer,
  );
  surfaceLayer.position.y = 0.11;
  rootGroup.add(surfaceLayer);

  // Fig. 1 circuit members: input transformer 10 and output transformer 9,
  // emitter battery 7, collector battery 8, and continuous conductors to the
  // plated base 2 and point contacts 5/6.
  const circuitCoreMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.5,
      metalness: 0.7,
    }),
  );
  const batteryMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.46,
      metalness: 0.35,
    }),
  );

  const buildTransformer = (name: string, x: number) => {
    const group = new THREE.Group();
    group.name = name;
    group.position.set(x, -0.58, 0);
    for (const z of [-0.35, 0.35]) {
      const windingGeo = trackGeo(new THREE.TorusGeometry(0.42, 0.095, 10, 28));
      for (const y of [-0.35, -0.12, 0.12, 0.35]) {
        const winding = new THREE.Mesh(windingGeo, materials.springWire);
        winding.position.set(0, y, z);
        winding.rotation.x = Math.PI / 2;
        group.add(winding);
      }
    }
    for (const [size, position] of [
      [
        [1.35, 0.14, 1.2],
        [0, 0.68, 0],
      ],
      [
        [1.35, 0.14, 1.2],
        [0, -0.68, 0],
      ],
      [
        [0.14, 1.36, 1.2],
        [-0.605, 0, 0],
      ],
      [
        [0.14, 1.36, 1.2],
        [0.605, 0, 0],
      ],
    ] as const) {
      const core = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(...size)), circuitCoreMat);
      core.position.set(position[0], position[1], position[2]);
      group.add(core);
    }
    rootGroup.add(group);
    return group;
  };

  const inputTransformer = buildTransformer("Input transformer 10", -5.05);
  const outputTransformer = buildTransformer("Output transformer 9", 5.05);

  const buildBattery = (name: string, x: number) => {
    const battery = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.72, 0.58, 0.52)), batteryMat);
    battery.name = name;
    battery.position.set(x, -0.935, -2.25);
    rootGroup.add(battery);
    for (const terminalX of [-0.2, 0.2]) {
      const terminal = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.055, 0.055, 0.14, 10)),
        materials.springWire,
      );
      terminal.position.set(terminalX, 0.36, 0);
      battery.add(terminal);
    }
    return battery;
  };
  const emitterBattery = buildBattery("Emitter battery 7", -3.85);
  const collectorBattery = buildBattery("Collector battery 8", 3.85);

  const circuitConductors: THREE.Mesh[] = [];
  const addConductor = (name: string, points: readonly THREE.Vector3[]) => {
    const curve = new THREE.CatmullRomCurve3(points.map((point) => point.clone()));
    const geometry = trackGeo(new THREE.TubeGeometry(curve, 28, 0.045, 8, false));
    const conductor = new THREE.Mesh(geometry, materials.springWire);
    conductor.name = name;
    rootGroup.add(conductor);
    circuitConductors.push(conductor);
    return conductor;
  };

  addConductor("Input boundary to transformer 10", [
    new THREE.Vector3(-6, -0.45, -0.35),
    new THREE.Vector3(-5.65, -0.45, -0.35),
  ]);
  addConductor("Transformer 10 through emitter battery 7", [
    new THREE.Vector3(-4.45, -0.45, -0.35),
    new THREE.Vector3(-4.2, -0.55, -1.8),
    new THREE.Vector3(-3.85, -0.55, -2.25),
    new THREE.Vector3(-2.8, 0.25, -1.5),
    EMITTER_UPPER_ANCHOR,
  ]);
  addConductor("Collector 6 through battery 8 to transformer 9", [
    COLLECTOR_UPPER_ANCHOR,
    new THREE.Vector3(2.8, 0.25, -1.5),
    new THREE.Vector3(3.85, -0.55, -2.25),
    new THREE.Vector3(4.45, -0.45, -0.35),
  ]);
  addConductor("Output transformer 9 to external boundary", [
    new THREE.Vector3(5.65, -0.45, -0.35),
    new THREE.Vector3(6, -0.45, -0.35),
  ]);
  addConductor("Plated-base return to transformer 10", [
    new THREE.Vector3(-3, -1.18, 0.5),
    new THREE.Vector3(-4.2, -1.05, 1.25),
    new THREE.Vector3(-4.45, -0.72, 0.35),
  ]);
  addConductor("Plated-base return to transformer 9", [
    new THREE.Vector3(3, -1.18, 0.5),
    new THREE.Vector3(4.2, -1.05, 1.25),
    new THREE.Vector3(4.45, -0.72, 0.35),
  ]);

  // Emitter 5 and collector 6: pointed spring wires, one of the expressly
  // described contact forms. Their separation is animated from the shared
  // source-bounded step.
  const emitterGroup = new THREE.Group();
  const collectorGroup = new THREE.Group();

  const emitterContact = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.055, 0.055, 1, 12)),
    materials.springWire,
  );
  emitterContact.name = "Emitter point contact 5";
  emitterContact.castShadow = true;
  emitterGroup.add(emitterContact);
  rootGroup.add(emitterGroup);

  const collectorContact = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.055, 0.055, 1, 12)),
    materials.springWire,
  );
  collectorContact.name = "Collector point contact 6";
  collectorContact.castShadow = true;
  collectorGroup.add(collectorContact);
  rootGroup.add(collectorGroup);

  setConnectedCylinder(
    emitterContact,
    new THREE.Vector3(-0.305, CONTACT_SURFACE_Y, 0),
    EMITTER_UPPER_ANCHOR,
  );
  setConnectedCylinder(
    collectorContact,
    new THREE.Vector3(0.305, CONTACT_SURFACE_Y, 0),
    COLLECTOR_UPPER_ANCHOR,
  );

  // Deterministic illustrative carrier paths. Their speed is explicitly a
  // display mapping; the grant does not report carrier lifetime or transit time.
  const carrierGeometry = trackGeo(new THREE.BufferGeometry());
  const carrierPositions = new Float32Array(CARRIER_COUNT * 3);
  for (let i = 0; i < CARRIER_COUNT; i++) {
    const fraction = i / CARRIER_COUNT;
    carrierPositions[i * 3] = -0.6 + fraction * 1.2;
    carrierPositions[i * 3 + 1] = 0.18 - (i % 7) * 0.025;
    carrierPositions[i * 3 + 2] = ((i % 11) / 10 - 0.5) * 0.9;
  }
  carrierGeometry.setAttribute("position", new THREE.BufferAttribute(carrierPositions, 3));
  const carrierPoints = new THREE.Points(carrierGeometry, materials.carrierMaterial);
  rootGroup.add(carrierPoints);

  const nodes: BardeenTransistorModelNodes = {
    rootGroup,
    baseFilm,
    geBlock,
    surfaceLayer,
    barrierLayer,
    emitterGroup,
    collectorGroup,
    emitterContact,
    collectorContact,
    inputTransformer,
    outputTransformer,
    emitterBattery,
    collectorBattery,
    circuitConductors,
    carrierPoints,
    carrierPositions,
    carrierCount: CARRIER_COUNT,
  };

  const dispose = () => {
    for (const m of materialsToDispose) m.dispose();
    for (const g of geometriesToDispose) g.dispose();
    for (const t of texturesToDispose) t.dispose();
  };

  return { rootGroup, nodes, materials, dispose };
}

/**
 * Updates point-contact spacing, illustrative carrier motion, and cutaway mode.
 */
export function updateBardeenTransistorKinematics(
  nodes: BardeenTransistorModelNodes,
  materials: BardeenTransistorMaterials,
  dt: number,
  _timeSec: number,
  gapStudioUnits: number,
  carrierDisplaySpeed: number,
  showCarrierPaths: boolean,
  isCutaway: boolean,
) {
  const currentGapUnits = Number.isFinite(gapStudioUnits)
    ? Math.min(1.53, Math.max(0.495, gapStudioUnits))
    : 0.61;
  setConnectedCylinder(
    nodes.emitterContact,
    new THREE.Vector3(-currentGapUnits / 2, CONTACT_SURFACE_Y, 0),
    EMITTER_UPPER_ANCHOR,
  );
  setConnectedCylinder(
    nodes.collectorContact,
    new THREE.Vector3(currentGapUnits / 2, CONTACT_SURFACE_Y, 0),
    COLLECTOR_UPPER_ANCHOR,
  );

  const displayStep = carrierDisplaySpeed * dt;
  const pos = nodes.carrierPositions;

  for (let i = 0; i < nodes.carrierCount; i++) {
    const idx = i * 3;
    pos[idx] += displayStep;
    if (pos[idx] > currentGapUnits / 2 + BARDEEN_CARRIER_WRAP_PAD) {
      pos[idx] = -currentGapUnits / 2 - BARDEEN_CARRIER_RESET_PAD;
    }
  }
  nodes.carrierPoints.geometry.attributes.position.needsUpdate = true;
  nodes.carrierPoints.visible = showCarrierPaths && carrierDisplaySpeed > 0;
  nodes.collectorGroup.visible = showCarrierPaths;

  // Cutaway Mode
  materials.germaniumCrystal.opacity = isCutaway ? 0.45 : 1.0;
  materials.germaniumCrystal.transparent = isCutaway;
  materials.surfaceLayer.opacity = isCutaway ? 0.85 : 0.62;
  materials.barrierLayer.opacity = isCutaway ? 0.75 : 0.5;
}
