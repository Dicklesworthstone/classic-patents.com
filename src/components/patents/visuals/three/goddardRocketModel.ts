/**
 * Procedural Three.js Model Builder for US 1,102,653
 * Robert H. Goddard — Rocket (1914)
 *
 * Implements the authentic multi-stage liquid-propellant sounding rocket:
 * - Stage 1 booster airframe with cylindrical propellant tanks (Liquid Oxygen & Gasoline)
 * - 4 swept aerodynamic stabilizing fins (Claim 3)
 * - Gimbaled de Laval converging-diverging supersonic nozzle (Claim 1) with regenerative cooling tubes
 * - Gyro-stabilized jet steering vanes operating in supersonic exhaust stream
 * - Interstage truss adapter with stage separation release latches (Claim 2)
 * - Stage 2 upper sustainer payload stage with parabolic nose cone fairing
 * - Shock diamond supersonic exhaust plume particles
 */

import * as THREE from "three";
import { goddardSchematicStack } from "@/physics/catalogKernels";
import { computeGoddardPlumeField } from "@/physics/fieldTextures";
import { deLavalMeridian } from "@/physics/thermochem";
import { createLcg } from "@/utils/lcg";
import { createGlowPointTexture } from "./ThreeStudioScene";

export interface GoddardRocketModel {
  root: THREE.Group;
  stage1Group: THREE.Group;
  stage2Group: THREE.Group;
  nozzleGroup: THREE.Group;
  deLavalMesh: THREE.Mesh;
  plumePoints: THREE.Points;
  plumeGeo: THREE.BufferGeometry;
  plumePos: Float32Array;
  plumeColors: Float32Array;
  plumeJitter: Float32Array;
  materials: {
    aluminumHullMat: THREE.MeshStandardMaterial;
    tankSeamMat: THREE.MeshStandardMaterial;
    copperNozzleMat: THREE.MeshStandardMaterial;
    feedPipeMat: THREE.MeshStandardMaterial;
    darkVaneMat: THREE.MeshStandardMaterial;
    interstageMat: THREE.MeshStandardMaterial;
    plumeMat: THREE.PointsMaterial;
  };
  updateKinematics: (
    delta: number,
    activeStage: number,
    gyroGimbalAngleDeg: number,
    expansionRatio: number,
    plumeAdvancePerS: number,
    showExhaustPlume: boolean,
    isCutaway?: boolean,
  ) => void;
  dispose: () => void;
}

export function buildGoddardRocketModel(): GoddardRocketModel {
  const root = new THREE.Group();
  const disposables: Array<{ dispose: () => void }> = [];
  const lcg = createLcg(19140707);

  // --- AUTHENTIC MATERIALS ---
  const aluminumHullMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.22,
    metalness: 0.88,
    transparent: true,
    opacity: 1.0,
  });
  disposables.push(aluminumHullMat);

  const tankSeamMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    roughness: 0.4,
    metalness: 0.8,
  });
  disposables.push(tankSeamMat);

  const copperNozzleMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.28,
    metalness: 0.85,
  });
  disposables.push(copperNozzleMat);

  const feedPipeMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.25,
    metalness: 0.9,
  });
  disposables.push(feedPipeMat);

  const darkVaneMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.35,
    metalness: 0.92,
  });
  disposables.push(darkVaneMat);

  const interstageMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.45,
    metalness: 0.75,
    transparent: true,
    opacity: 1.0,
  });
  disposables.push(interstageMat);

  // ==========================================
  // STAGE 1 (BOOSTER STAGE WITH PROPELLANT TANKS)
  // ==========================================
  const stage1Group = new THREE.Group();
  root.add(stage1Group);

  // Main Booster Cylinder (LOX + Gasoline Hull)
  const stage1Geo = new THREE.CylinderGeometry(1.2, 1.2, 5.5, 48);
  disposables.push(stage1Geo);
  const stage1Body = new THREE.Mesh(stage1Geo, aluminumHullMat);
  stage1Body.castShadow = true;
  stage1Body.receiveShadow = true;
  stage1Group.add(stage1Body);

  // Ring Stiffeners & Tank Welds
  for (let r = 0; r < 4; r++) {
    const ringGeo = new THREE.TorusGeometry(1.21, 0.03, 8, 36);
    disposables.push(ringGeo);
    const ring = new THREE.Mesh(ringGeo, tankSeamMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -2.2 + r * 1.4;
    stage1Group.add(ring);
  }

  // 4 Swept Aerodynamic Stabilizing Fins (Claim 3)
  for (let f = 0; f < 4; f++) {
    const fAngle = (f * Math.PI) / 2;
    const finShape = new THREE.Shape();
    finShape.moveTo(0, 0);
    finShape.lineTo(1.4, -0.6);
    finShape.lineTo(1.4, -1.8);
    finShape.lineTo(0, -1.5);
    finShape.closePath();

    const finGeo = new THREE.ExtrudeGeometry(finShape, { depth: 0.08, bevelEnabled: false });
    finGeo.center();
    disposables.push(finGeo);
    const fin = new THREE.Mesh(finGeo, aluminumHullMat);
    fin.position.set(Math.cos(fAngle) * 1.8, -2.0, Math.sin(fAngle) * 1.8);
    fin.rotation.y = -fAngle + Math.PI / 2;
    fin.castShadow = true;
    stage1Group.add(fin);
  }

  // ==========================================
  // GIMBALED DE LAVAL SUPERSONIC NOZZLE ASSEMBLY (CLAIM 1)
  // ==========================================
  const nozzleGroup = new THREE.Group();
  nozzleGroup.position.y = -2.75;
  stage1Group.add(nozzleGroup);

  // Gimbal Mounting Ring
  const gimbalGeo = new THREE.TorusGeometry(0.95, 0.06, 12, 32);
  disposables.push(gimbalGeo);
  const gimbalRing = new THREE.Mesh(gimbalGeo, darkVaneMat);
  gimbalRing.rotation.x = Math.PI / 2;
  gimbalRing.position.y = 0.2;
  nozzleGroup.add(gimbalRing);

  // Supersonic Lathe Converging-Diverging Nozzle
  const initialExpansion = 3.5;
  const deLavalGeo = new THREE.LatheGeometry(
    deLavalMeridian(initialExpansion).map(([r, y]) => new THREE.Vector2(r, y)),
    48,
  );
  disposables.push(deLavalGeo);
  const deLavalMesh = new THREE.Mesh(deLavalGeo, copperNozzleMat);
  deLavalMesh.castShadow = true;
  nozzleGroup.add(deLavalMesh);

  // Regenerative Cooling Manifold Ring
  const manifoldGeo = new THREE.TorusGeometry(0.93, 0.05, 12, 36);
  disposables.push(manifoldGeo);
  const manifoldRing = new THREE.Mesh(manifoldGeo, copperNozzleMat);
  manifoldRing.rotation.x = Math.PI / 2;
  manifoldRing.position.y = -1.45;
  nozzleGroup.add(manifoldRing);

  // Dual High-Pressure Propellant Feed Piping
  [-0.65, 0.65].forEach((px) => {
    const pipeCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(px, 1.8, 0.8),
      new THREE.Vector3(px, 0.4, 0.8),
      new THREE.Vector3(px * 0.6, -0.2, 0.4),
      new THREE.Vector3(px * 0.4, -0.8, 0.2),
    ]);
    const pipeGeo = new THREE.TubeGeometry(pipeCurve, 20, 0.045, 8, false);
    disposables.push(pipeGeo);
    const pipeMesh = new THREE.Mesh(pipeGeo, feedPipeMat);
    nozzleGroup.add(pipeMesh);
  });

  // 4 Gyro-Stabilized Exhaust Jet Vanes
  for (let v = 0; v < 4; v++) {
    const vAngle = (v * Math.PI) / 2;
    const vaneGeo = new THREE.BoxGeometry(0.04, 0.35, 0.25);
    disposables.push(vaneGeo);
    const vane = new THREE.Mesh(vaneGeo, darkVaneMat);
    vane.position.set(Math.cos(vAngle) * 0.65, -1.5, Math.sin(vAngle) * 0.65);
    vane.rotation.y = -vAngle;
    nozzleGroup.add(vane);
  }

  // ==========================================
  // STAGE 2 (UPPER PAYLOAD & SUSTAINER STAGE - CLAIM 2)
  // ==========================================
  const stage2Group = new THREE.Group();
  stage2Group.position.y = 4.2;
  root.add(stage2Group);

  // Interstage Conical Adapter
  const interstageGeo = new THREE.CylinderGeometry(0.8, 1.2, 1.2, 36);
  disposables.push(interstageGeo);
  const interstage = new THREE.Mesh(interstageGeo, interstageMat);
  interstage.position.y = -1.0;
  stage2Group.add(interstage);

  // Stage 2 Sustainer Tank Body
  const stage2Geo = new THREE.CylinderGeometry(0.8, 0.8, 2.6, 36);
  disposables.push(stage2Geo);
  const stage2Body = new THREE.Mesh(stage2Geo, aluminumHullMat);
  stage2Body.position.y = 0.8;
  stage2Body.castShadow = true;
  stage2Group.add(stage2Body);

  // Aerodynamic Parabolic Nose Cone Fairing
  const nosePoints: THREE.Vector2[] = [
    new THREE.Vector2(0.01, 2.2),
    new THREE.Vector2(0.2, 1.8),
    new THREE.Vector2(0.5, 1.0),
    new THREE.Vector2(0.8, 0),
  ];
  const noseGeo = new THREE.LatheGeometry(nosePoints, 36);
  disposables.push(noseGeo);
  const noseCone = new THREE.Mesh(noseGeo, aluminumHullMat);
  noseCone.position.y = 2.1;
  noseCone.castShadow = true;
  stage2Group.add(noseCone);

  // ==========================================
  // SUPERSONIC EXHAUST PLUME WITH SHOCK DIAMONDS
  // ==========================================
  const plumeCount = 180;
  const plumeGeo = new THREE.BufferGeometry();
  disposables.push(plumeGeo);
  const plumePos = new Float32Array(plumeCount * 3);
  const plumeColors = new Float32Array(plumeCount * 3);
  const plumeJitter = new Float32Array(plumeCount * 3);
  const glowTex = createGlowPointTexture();
  disposables.push(glowTex);

  for (let i = 0; i < plumeCount; i++) {
    const idx = i * 3;
    plumePos[idx] = (lcg() - 0.5) * 0.4;
    plumePos[idx + 1] = -4.2 - lcg() * 4.5;
    plumePos[idx + 2] = (lcg() - 0.5) * 0.4;

    plumeJitter[idx] = lcg() - 0.5;
    plumeJitter[idx + 1] = lcg();
    plumeJitter[idx + 2] = lcg() - 0.5;

    const progress = (-plumePos[idx + 1] - 4.2) / 4.5;
    plumeColors[idx] = 1.0;
    plumeColors[idx + 1] = Math.max(0, 0.8 - progress * 0.7);
    plumeColors[idx + 2] = Math.max(0, 0.3 - progress * 0.3);
  }

  plumeGeo.setAttribute("position", new THREE.BufferAttribute(plumePos, 3));
  plumeGeo.setAttribute("color", new THREE.BufferAttribute(plumeColors, 3));

  const plumeMat = new THREE.PointsMaterial({
    size: 0.42,
    map: glowTex,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  disposables.push(plumeMat);

  const plumePoints = new THREE.Points(plumeGeo, plumeMat);
  root.add(plumePoints);

  const updateKinematics = (
    delta: number,
    activeStage: number,
    gyroGimbalAngleDeg: number,
    expansionRatio: number,
    plumeAdvancePerS: number,
    showExhaustPlume: boolean,
    isCutaway = false,
  ) => {
    updateGoddardRocketKinematics(
      model,
      delta,
      activeStage,
      gyroGimbalAngleDeg,
      expansionRatio,
      plumeAdvancePerS,
      showExhaustPlume,
      isCutaway,
    );
  };

  const dispose = () => {
    for (const d of disposables) {
      d.dispose();
    }
  };

  const model: GoddardRocketModel = {
    root,
    stage1Group,
    stage2Group,
    nozzleGroup,
    deLavalMesh,
    plumePoints,
    plumeGeo,
    plumePos,
    plumeColors,
    plumeJitter,
    materials: {
      aluminumHullMat,
      tankSeamMat,
      copperNozzleMat,
      feedPipeMat,
      darkVaneMat,
      interstageMat,
      plumeMat,
    },
    updateKinematics,
    dispose,
  };

  return model;
}

let lastExpansionRatio = 3.5;

/**
 * Updates Goddard liquid-propellant rocket staging kinematics, de Laval nozzle mesh expansion, gimbal angle, and exhaust plume.
 */
export function updateGoddardRocketKinematics(
  model: GoddardRocketModel,
  delta: number,
  activeStage: number,
  gyroGimbalAngleDeg: number,
  expansionRatio: number,
  plumeAdvancePerS: number,
  showExhaustPlume: boolean,
  isCutaway = false,
): void {
  const goddard = goddardSchematicStack();
  const gimbalRad = (gyroGimbalAngleDeg * Math.PI) / 180;
  model.nozzleGroup.rotation.z = gimbalRad;

  const ar = expansionRatio;
  if (Math.abs(ar - lastExpansionRatio) > goddard.expansionRebuildDelta) {
    lastExpansionRatio = ar;
    model.deLavalMesh.geometry.dispose();
    model.deLavalMesh.geometry = new THREE.LatheGeometry(
      deLavalMeridian(ar).map(([r, y]) => new THREE.Vector2(r, y)),
      48,
    );
  }

  if (activeStage === 2) {
    model.stage2Group.position.y +=
      (goddard.stage2SepY - model.stage2Group.position.y) * goddard.sepLerp;
    model.stage1Group.position.y +=
      (goddard.stage1SepY - model.stage1Group.position.y) * goddard.sepLerp;
  } else {
    model.stage2Group.position.y +=
      (goddard.stage2HomeY - model.stage2Group.position.y) * goddard.dockLerp;
    model.stage1Group.position.y +=
      (goddard.stage1HomeY - model.stage1Group.position.y) * goddard.dockLerp;
  }

  const plumeOk = plumeAdvancePerS > 0;
  if (showExhaustPlume && plumeOk) {
    const velocitySpeed = plumeAdvancePerS * delta;
    const exitSpread = goddard.plumeExitSpread0 * Math.sqrt(Math.max(goddard.plumeMinAr, ar));
    const plumeField = computeGoddardPlumeField(250, ar, (model.plumePos[1] ?? 0) * 0.1, 16);

    for (let i = 0; i < model.plumePos.length / 3; i++) {
      const idx = i * 3;
      const u = Math.max(
        0,
        Math.min(
          1,
          Math.abs((model.plumePos[idx + 1] ?? 0) - goddard.plumeResetY) /
            Math.abs(goddard.plumeWrapY - goddard.plumeResetY),
        ),
      );
      const v = Math.max(0, Math.min(1, 0.5 + (model.plumePos[idx] ?? 0) / 4.0));
      const gx = Math.floor(u * 15);
      const gy = Math.floor(v * 15);
      const shockFactor = 0.8 + 0.4 * (plumeField[gy * 16 + gx] ?? 0.5);

      model.plumePos[idx + 1] -= velocitySpeed * shockFactor;
      model.plumePos[idx] += Math.sin(gimbalRad) * velocitySpeed * goddard.plumeGimbalCoupling;

      if (model.plumePos[idx + 1] < goddard.plumeWrapY) {
        model.plumePos[idx] = model.plumeJitter[idx] * exitSpread;
        model.plumePos[idx + 1] = goddard.plumeResetY;
        model.plumePos[idx + 2] = model.plumeJitter[idx + 2] * exitSpread;
      }
    }
    model.plumeGeo.attributes.position.needsUpdate = true;
    model.plumePoints.visible = true;
  } else {
    model.plumePoints.visible = false;
  }

  // Cutaway mode: make aluminum tank hulls and interstage fairings translucent
  model.materials.aluminumHullMat.opacity = isCutaway ? 0.35 : 1.0;
  model.materials.aluminumHullMat.transparent = isCutaway;
  model.materials.interstageMat.opacity = isCutaway ? 0.35 : 1.0;
  model.materials.interstageMat.transparent = isCutaway;
}
