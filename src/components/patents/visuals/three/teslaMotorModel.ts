import * as THREE from "three";
import { gaMotorFrameIndex, gaMotorOrbit } from "@/physics/genericWasm";
import { stepTeslaMotorFig9 } from "@/physics/teslaKernel";
import { createLcg } from "@/utils/lcg";
import { createGlowPointTexture } from "./ThreeStudioScene";

/**
 * Fig. 9 apparatus for US 381,968. Depicts the printed relationships
 * (R, C/C', D, G, B/B', b/b', and L/L') without filling the drawing with
 * later motor construction details that the figure does not give.
 */
export interface TeslaMotorModel {
  rootGroup: THREE.Group;
  statorGroup: THREE.Group;
  rotorGroup: THREE.Group;
  shaftMarker: THREE.Mesh;
  generatorGroup: THREE.Group;
  generatorCollectorRings: THREE.Mesh[];
  generatorBrushes: THREE.Mesh[];
  coilMeshes: { mesh: THREE.Mesh; phaseIdx: number }[];
  fluxPoints: THREE.Points;
  fluxPositions: Float32Array;
  fluxCount: number;
  materials: {
    annulusIron: THREE.MeshStandardMaterial;
    insulatedWire: THREE.MeshStandardMaterial;
    magneticDisk: THREE.MeshStandardMaterial;
    contactRing: THREE.MeshStandardMaterial;
    collector: THREE.MeshStandardMaterial;
    fluxMat: THREE.PointsMaterial;
  };
  dispose: () => void;
}

export function buildTeslaMotorModel(): TeslaMotorModel {
  const lcg = createLcg(1888);
  const rootGroup = new THREE.Group();
  rootGroup.name = "US 381,968 Fig. 9 apparatus";
  const materialsToDispose: THREE.Material[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];
  const texturesToDispose: THREE.Texture[] = [];

  const annulusIron = new THREE.MeshStandardMaterial({
    color: 0x475569,
    roughness: 0.52,
    metalness: 0.72,
  });
  const insulatedWire = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.45,
    metalness: 0.4,
  });
  const magneticDisk = new THREE.MeshStandardMaterial({
    color: 0x64748b,
    roughness: 0.45,
    metalness: 0.65,
  });
  const contactRing = new THREE.MeshStandardMaterial({
    color: 0xc8963e,
    roughness: 0.35,
    metalness: 0.82,
  });
  const collector = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.65,
    metalness: 0.3,
  });
  materialsToDispose.push(annulusIron, insulatedWire, magneticDisk, contactRing, collector);

  // R: the annulus described as thin insulated iron rings or annular plates.
  const statorGroup = new THREE.Group();
  statorGroup.name = "R annulus and C/C-prime coils";
  rootGroup.add(statorGroup);
  const annulusGeo = new THREE.CylinderGeometry(5.1, 5.1, 2.8, 48, 1, true);
  geometriesToDispose.push(annulusGeo);
  statorGroup.add(new THREE.Mesh(annulusGeo, annulusIron));

  const coilMeshes: { mesh: THREE.Mesh; phaseIdx: number }[] = [];
  const poleGeo = new THREE.BoxGeometry(1.35, 2.25, 1.15);
  const coilGeo = new THREE.BoxGeometry(1.62, 1.85, 1.5);
  geometriesToDispose.push(poleGeo, coilGeo);
  for (let index = 0; index < 4; index++) {
    const angle = (index * Math.PI) / 2;
    const coilGroup = new THREE.Group();
    coilGroup.position.set(Math.cos(angle) * 3.85, 0, Math.sin(angle) * 3.85);
    coilGroup.rotation.y = -angle + Math.PI / 2;
    coilGroup.add(new THREE.Mesh(poleGeo, annulusIron));
    const coil = new THREE.Mesh(coilGeo, insulatedWire);
    coilGroup.add(coil);
    coilMeshes.push({ mesh: coil, phaseIdx: index % 2 });
    statorGroup.add(coilGroup);
  }

  // D and a: a freely mounted magnetic disk, shown without invented supports.
  const rotorGroup = new THREE.Group();
  rotorGroup.name = "D magnetic disk on axis a";
  rootGroup.add(rotorGroup);
  const diskGeo = new THREE.CylinderGeometry(2.55, 2.55, 0.5, 32);
  const shaftGeo = new THREE.CylinderGeometry(0.16, 0.16, 4.5, 16);
  const markerGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.14, 20);
  geometriesToDispose.push(diskGeo, shaftGeo, markerGeo);
  rotorGroup.add(new THREE.Mesh(diskGeo, magneticDisk));
  const shaft = new THREE.Mesh(shaftGeo, magneticDisk);
  shaft.rotation.x = Math.PI / 2;
  rotorGroup.add(shaft);
  const shaftMarker = new THREE.Mesh(markerGeo, magneticDisk);
  shaftMarker.position.y = 0.32;
  rotorGroup.add(shaftMarker);

  // G, B/B' and b/b': the separate generator shown at the right of Fig. 9.
  const generatorGroup = new THREE.Group();
  generatorGroup.name = "G generator with B/B-prime and b/b-prime";
  generatorGroup.position.set(7.1, 0, 0);
  rootGroup.add(generatorGroup);
  const fieldGeo = new THREE.BoxGeometry(0.95, 4.8, 4.6);
  const armatureGeo = new THREE.CylinderGeometry(1.2, 1.2, 2.9, 28);
  const generatorShaftGeo = new THREE.CylinderGeometry(0.15, 0.15, 5.8, 16);
  geometriesToDispose.push(fieldGeo, armatureGeo, generatorShaftGeo);
  const field = new THREE.Mesh(fieldGeo, annulusIron);
  field.position.x = 1.2;
  generatorGroup.add(field);
  const armature = new THREE.Mesh(armatureGeo, insulatedWire);
  armature.rotation.z = Math.PI / 2;
  armature.position.x = -0.1;
  generatorGroup.add(armature);
  const generatorShaft = new THREE.Mesh(generatorShaftGeo, magneticDisk);
  generatorShaft.rotation.z = Math.PI / 2;
  generatorShaft.position.x = -0.75;
  generatorGroup.add(generatorShaft);

  const generatorCollectorRings: THREE.Mesh[] = [];
  const generatorBrushes: THREE.Mesh[] = [];
  const ringGeo = new THREE.TorusGeometry(0.36, 0.065, 8, 18);
  const brushGeo = new THREE.BoxGeometry(0.24, 0.34, 0.16);
  geometriesToDispose.push(ringGeo, brushGeo);
  for (let index = 0; index < 4; index++) {
    const ring = new THREE.Mesh(ringGeo, contactRing);
    ring.rotation.y = Math.PI / 2;
    ring.position.set(-2.35 + index * 0.27, 0, 0);
    generatorGroup.add(ring);
    generatorCollectorRings.push(ring);

    const brush = new THREE.Mesh(brushGeo, collector);
    brush.position.set(-2.35 + index * 0.27, 0.48, 0);
    generatorGroup.add(brush);
    generatorBrushes.push(brush);
  }

  // L/L': simple conductors connect the four Fig. 9 terminals without
  // asserting insulation, gauge, routing hardware, or an installation layout.
  const conductorMat = new THREE.LineBasicMaterial({ color: 0x94a3b8 });
  materialsToDispose.push(conductorMat);
  for (const y of [-1.15, -0.4, 0.4, 1.15]) {
    const points = [
      new THREE.Vector3(3.9, y, -3.3),
      new THREE.Vector3(5.3, y, -3.3),
      new THREE.Vector3(5.3, y, 0),
      new THREE.Vector3(4.75, y, 0),
    ];
    const conductorGeo = new THREE.BufferGeometry().setFromPoints(points);
    geometriesToDispose.push(conductorGeo);
    rootGroup.add(new THREE.Line(conductorGeo, conductorMat));
  }

  const fluxCount = 160;
  const fluxGeo = new THREE.BufferGeometry();
  geometriesToDispose.push(fluxGeo);
  const fluxPositions = new Float32Array(fluxCount * 3);
  const fluxColors = new Float32Array(fluxCount * 3);
  const glowTex = createGlowPointTexture();
  texturesToDispose.push(glowTex);
  for (let index = 0; index < fluxCount; index++) {
    const offset = index * 3;
    const radius = 2.6 + lcg() * 1.75;
    const angle = lcg() * Math.PI * 2;
    fluxPositions[offset] = Math.cos(angle) * radius;
    fluxPositions[offset + 1] = (lcg() - 0.5) * 2.4;
    fluxPositions[offset + 2] = Math.sin(angle) * radius;
    fluxColors[offset] = 0.22;
    fluxColors[offset + 1] = 0.74;
    fluxColors[offset + 2] = 0.98;
  }
  fluxGeo.setAttribute("position", new THREE.BufferAttribute(fluxPositions, 3));
  fluxGeo.setAttribute("color", new THREE.BufferAttribute(fluxColors, 3));
  const fluxMat = new THREE.PointsMaterial({
    size: 0.3,
    map: glowTex,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  materialsToDispose.push(fluxMat);
  const fluxPoints = new THREE.Points(fluxGeo, fluxMat);
  statorGroup.add(fluxPoints);

  return {
    rootGroup,
    statorGroup,
    rotorGroup,
    shaftMarker,
    generatorGroup,
    generatorCollectorRings,
    generatorBrushes,
    coilMeshes,
    fluxPoints,
    fluxPositions,
    fluxCount,
    materials: { annulusIron, insulatedWire, magneticDisk, contactRing, collector, fluxMat },
    dispose: () => {
      for (const geometry of geometriesToDispose) geometry.dispose();
      for (const material of materialsToDispose) material.dispose();
      for (const texture of texturesToDispose) texture.dispose();
    },
  };
}

export function updateTeslaMotorKinematics(
  model: TeslaMotorModel,
  delta: number,
  omegaDisplay: number,
  bFieldAngle: number,
  showMagneticFlux: boolean,
  fieldTimeSec = 0,
): void {
  const tesla = stepTeslaMotorFig9(60);
  model.rotorGroup.rotation.y += omegaDisplay * delta;
  for (const item of model.coilMeshes) {
    const phaseOffset = item.phaseIdx * tesla.coilPhaseOffsetRad;
    const current = Math.sin(bFieldAngle + phaseOffset);
    const material = item.mesh.material as THREE.MeshStandardMaterial;
    material.emissive = new THREE.Color(tesla.coilEmissiveHex);
    material.emissiveIntensity = Math.abs(current) * tesla.coilEmissiveAmp;
  }
  const orbit = gaMotorOrbit(model.fluxCount, 60);
  const frame = gaMotorFrameIndex(fieldTimeSec, omegaDisplay, 60);
  const base = 2 + frame * model.fluxCount * 3;
  for (let index = 0; index < model.fluxCount; index++) {
    const src = base + index * 3;
    const dst = index * 3;
    const x = orbit[src] ?? 0;
    const y = orbit[src + 1] ?? 0;
    const z = orbit[src + 2] ?? 0;
    if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) continue;
    model.fluxPositions[dst] = (x - 1) * 2.8;
    model.fluxPositions[dst + 1] = z * 0.45;
    model.fluxPositions[dst + 2] = y * 2.8;
  }
  model.fluxPoints.geometry.attributes.position.needsUpdate = true;
  model.fluxPoints.visible = showMagneticFlux;
}
