/**
 * Procedural Three.js Model Builder for US 2,708,656
 * Enrico Fermi & Leo Szilard — Neutronic Reactor (Chicago Pile-1, 1955)
 *
 * Implements the authentic self-sustaining nuclear chain reaction pile:
 * - Multi-tier timber framing scaffold of pine and Douglas fir beams with hoisting gantry
 * - Matrix of high-purity graphite moderator bricks arranged in orthogonal lattice geometry
 * - Array of natural uranium metal lumps and sintered uranium oxide fuel cylinders (Claim 1)
 * - Cadmium neutron-absorbing control and emergency safety rods (Claim 2 & Claim 3)
 * - BF3 proportional neutron counter detection chamber
 * - Thermal neutron diffusion cascade cloud with dynamic fission criticality spectrum
 */

import * as THREE from "three";
import {
  heatFrames,
  laplacianModeShape,
  laplacianModes,
  sampleHeatAt,
} from "@/physics/genericWasm";
import { createLcg } from "@/utils/lcg";
import { createGlowPointTexture } from "./ThreeStudioScene";

export interface FermiReactorModel {
  root: THREE.Group;
  timberGroup: THREE.Group;
  pileGroup: THREE.Group;
  fuelGroup: THREE.Group;
  rodGroup: THREE.Group;
  bf3Detector: THREE.Mesh;
  neutronPoints: THREE.Points;
  neutronGeo: THREE.BufferGeometry;
  neutronPos: Float32Array;
  neutronVel: Float32Array;
  neutronColors: Float32Array;
  neutronCount: number;
  graphiteMat: THREE.MeshStandardMaterial;
  uraniumFuelMat: THREE.MeshStandardMaterial;
  updateKinematics: (
    delta: number,
    controlRodWithdrawalPct: number,
    kEff: number,
    moderatorPurityPct: number,
    neutronDisplaySpeed: number,
    showNeutronCascade: boolean,
    rodStudioY?: number,
    fuelGlowIntensity?: number,
  ) => void;
  dispose: () => void;
}

export function buildFermiReactorModel(): FermiReactorModel {
  const root = new THREE.Group();
  const disposables: Array<{ dispose: () => void }> = [];
  const lcg = createLcg(19421202);

  const graphiteMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.5,
    metalness: 0.6,
  });
  disposables.push(graphiteMat);

  const uraniumFuelMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.3,
    metalness: 0.85,
  });
  disposables.push(uraniumFuelMat);

  const cadmiumRodMat = new THREE.MeshStandardMaterial({
    color: 0x64748b,
    roughness: 0.15,
    metalness: 0.95,
  });
  disposables.push(cadmiumRodMat);

  const timberSupportMat = new THREE.MeshStandardMaterial({
    color: 0x78350f,
    roughness: 0.6,
    metalness: 0.1,
  });
  disposables.push(timberSupportMat);

  const pulleyMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    metalness: 0.85,
  });
  disposables.push(pulleyMat);

  const detectorMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    metalness: 0.95,
  });
  disposables.push(detectorMat);

  const timberGroup = new THREE.Group();
  timberGroup.position.y = -3.4;
  root.add(timberGroup);

  for (let b = 0; b < 6; b++) {
    const beamXGeo = new THREE.BoxGeometry(11.0, 0.45, 0.45);
    disposables.push(beamXGeo);
    const beamX = new THREE.Mesh(beamXGeo, timberSupportMat);
    beamX.position.set(0, 0, -4.5 + b * 1.8);
    timberGroup.add(beamX);
  }

  for (let c = 0; c < 4; c++) {
    const colGeo = new THREE.BoxGeometry(0.5, 7.5, 0.5);
    disposables.push(colGeo);
    const col = new THREE.Mesh(colGeo, timberSupportMat);
    const cx = c % 2 === 0 ? -4.5 : 4.5;
    const cz = c < 2 ? -3.8 : 3.8;
    col.position.set(cx, 3.5, cz);
    timberGroup.add(col);
  }

  for (let g = 0; g < 3; g++) {
    const gantryGeo = new THREE.BoxGeometry(10.2, 0.35, 0.35);
    disposables.push(gantryGeo);
    const gantry = new THREE.Mesh(gantryGeo, timberSupportMat);
    gantry.position.set(0, 7.2, -2.5 + g * 2.5);
    timberGroup.add(gantry);

    const pulleyGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.15, 16);
    disposables.push(pulleyGeo);
    const pulley = new THREE.Mesh(pulleyGeo, pulleyMat);
    pulley.rotation.z = Math.PI / 2;
    pulley.position.set(0, 7.0, -2.5 + g * 2.5);
    timberGroup.add(pulley);
  }

  const pileGroup = new THREE.Group();
  pileGroup.position.y = -1.2;
  root.add(pileGroup);

  const pileLayers = 14;
  const pileRadius = 3.6;

  for (let l = 0; l < pileLayers; l++) {
    const layerFraction = (l / (pileLayers - 1) - 0.5) * 2;
    const r = Math.sqrt(Math.max(0.1, 1 - layerFraction * layerFraction * 0.85)) * pileRadius;
    const layerGroup = new THREE.Group();
    layerGroup.position.y = -2.2 + l * 0.32;

    const brickCount = Math.floor(r * 2.4);
    for (let bx = -brickCount; bx <= brickCount; bx++) {
      for (let bz = -brickCount; bz <= brickCount; bz++) {
        const dist = Math.sqrt(bx * bx + bz * bz) * 0.35;
        if (dist <= r) {
          const brickGeo = new THREE.BoxGeometry(0.33, 0.3, 0.33);
          disposables.push(brickGeo);
          const brick = new THREE.Mesh(brickGeo, graphiteMat);
          brick.position.set(bx * 0.35, 0, bz * 0.35);
          brick.castShadow = true;
          brick.receiveShadow = true;
          layerGroup.add(brick);
        }
      }
    }
    pileGroup.add(layerGroup);
  }

  const fuelGroup = new THREE.Group();
  fuelGroup.position.y = -1.2;
  root.add(fuelGroup);

  for (let fl = 2; fl < pileLayers - 2; fl += 2) {
    const layerY = -2.2 + fl * 0.32;
    for (let fx = -4; fx <= 4; fx += 2) {
      for (let fz = -4; fz <= 4; fz += 2) {
        if (Math.sqrt(fx * fx + fz * fz) * 0.35 < pileRadius * 0.85) {
          const fuelGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.22, 12);
          disposables.push(fuelGeo);
          const fuel = new THREE.Mesh(fuelGeo, uraniumFuelMat);
          fuel.position.set(fx * 0.35, layerY, fz * 0.35);
          fuelGroup.add(fuel);
        }
      }
    }
  }

  const rodGroup = new THREE.Group();
  root.add(rodGroup);

  const rodCoords: [number, number][] = [
    [0, 0],
    [-0.7, 0.7],
    [0.7, -0.7],
  ];

  for (const [rx, rz] of rodCoords) {
    const rodGeo = new THREE.CylinderGeometry(0.08, 0.08, 5.8, 16);
    disposables.push(rodGeo);
    const rod = new THREE.Mesh(rodGeo, cadmiumRodMat);
    rod.position.set(rx, 1.2, rz);
    rodGroup.add(rod);

    const wireGeo = new THREE.CylinderGeometry(0.015, 0.015, 4.2, 8);
    disposables.push(wireGeo);
    const wire = new THREE.Mesh(wireGeo, cadmiumRodMat);
    wire.position.set(rx, 4.8, rz);
    rodGroup.add(wire);
  }

  const detectorGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.4, 16);
  disposables.push(detectorGeo);
  const bf3Detector = new THREE.Mesh(detectorGeo, detectorMat);
  bf3Detector.position.set(2.4, -0.5, 0);
  bf3Detector.rotation.z = Math.PI / 2;
  root.add(bf3Detector);

  const neutronCount = 300;
  const neutronGeo = new THREE.BufferGeometry();
  disposables.push(neutronGeo);
  const neutronPos = new Float32Array(neutronCount * 3);
  const neutronVel = new Float32Array(neutronCount * 3);
  const neutronColors = new Float32Array(neutronCount * 3);
  const glowTex = createGlowPointTexture();
  disposables.push(glowTex);

  for (let i = 0; i < neutronCount; i++) {
    const idx = i * 3;
    neutronPos[idx] = (lcg() - 0.5) * 6.5;
    neutronPos[idx + 1] = -2.6 + lcg() * 3.2;
    neutronPos[idx + 2] = (lcg() - 0.5) * 6.5;

    const theta = lcg() * Math.PI * 2;
    const phi = (lcg() - 0.5) * Math.PI;
    neutronVel[idx] = Math.cos(phi) * Math.cos(theta);
    neutronVel[idx + 1] = Math.sin(phi);
    neutronVel[idx + 2] = Math.cos(phi) * Math.sin(theta);

    neutronColors[idx] = 0.2;
    neutronColors[idx + 1] = 0.8;
    neutronColors[idx + 2] = 1.0;
  }

  neutronGeo.setAttribute("position", new THREE.BufferAttribute(neutronPos, 3));
  neutronGeo.setAttribute("color", new THREE.BufferAttribute(neutronColors, 3));

  const neutronMat = new THREE.PointsMaterial({
    size: 0.45,
    map: glowTex,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  disposables.push(neutronMat);

  const neutronPoints = new THREE.Points(neutronGeo, neutronMat);
  root.add(neutronPoints);

  const updateKinematics = (
    delta: number,
    controlRodWithdrawalPct: number,
    kEff: number,
    moderatorPurityPct: number,
    neutronDisplaySpeed: number,
    showNeutronCascade: boolean,
    rodStudioY?: number,
    fuelGlowIntensity?: number,
  ) => {
    const effRodStudioY =
      rodStudioY ?? -0.5 + (Math.min(100, Math.max(0, controlRodWithdrawalPct)) / 100) * 3.2;
    const effFuelGlow = fuelGlowIntensity ?? Math.max(0, (kEff - 0.98) * 8);
    updateFermiReactorKinematics(
      model,
      delta,
      controlRodWithdrawalPct,
      kEff,
      moderatorPurityPct,
      neutronDisplaySpeed,
      effRodStudioY,
      effFuelGlow,
      showNeutronCascade,
    );
  };

  const dispose = () => {
    for (const d of disposables) {
      d.dispose();
    }
  };

  const model: FermiReactorModel = {
    root,
    timberGroup,
    pileGroup,
    fuelGroup,
    rodGroup,
    bf3Detector,
    neutronPoints,
    neutronGeo,
    neutronPos,
    neutronVel,
    neutronColors,
    neutronCount,
    graphiteMat,
    uraniumFuelMat,
    updateKinematics,
    dispose,
  };

  return model;
}

export function updateFermiReactorKinematics(
  model: FermiReactorModel,
  delta: number,
  _controlRodWithdrawalPct: number,
  kEff: number,
  moderatorPurityPct: number,
  neutronDisplaySpeed: number,
  rodStudioY: number,
  fuelGlowIntensity: number,
  showNeutronCascade: boolean,
  isCutaway = false,
): void {
  const targetRodY = rodStudioY;
  model.rodGroup.position.y += (targetRodY - model.rodGroup.position.y) * 0.1;

  const purity = moderatorPurityPct / 100;
  model.graphiteMat.color.setRGB(0.12 * purity, 0.13 * purity, 0.15 * purity);
  model.uraniumFuelMat.emissiveIntensity = fuelGlowIntensity;
  model.uraniumFuelMat.emissive = new THREE.Color(kEff > 1.002 ? 0xf97316 : 0x22c55e);

  if (showNeutronCascade) {
    const heat = heatFrames(12, 16, 2);
    const modes = laplacianModes(17, 3);
    const heatFrame = Math.max(0, Math.min(15, Math.floor((kEff - 0.9) * 80)));
    const speed = neutronDisplaySpeed * delta;
    const pos = model.neutronPos;
    const vel = model.neutronVel;
    for (let i = 0; i < model.neutronCount; i++) {
      const idx = i * 3;
      const u = 0.5 + ((pos[idx] ?? 0) + 3.6) / 7.2;
      const v = 0.5 + ((pos[idx + 2] ?? 0) + 3.6) / 7.2;
      const local = 1 + Math.abs(sampleHeatAt(heat, 12, 16, heatFrame, u, v));
      const lattice = 1 + 0.35 * laplacianModeShape(modes, 17, 3, 0, i);
      pos[idx] += (vel[idx] ?? 0) * speed * 2.0 * local;
      pos[idx + 1] += (vel[idx + 1] ?? 0) * speed * 2.0 * lattice;
      pos[idx + 2] += (vel[idx + 2] ?? 0) * speed * 2.0 * local;

      if (
        Math.abs(pos[idx]) > 3.6 ||
        Math.abs(pos[idx + 2]) > 3.6 ||
        pos[idx + 1] > 0.5 ||
        pos[idx + 1] < -4.0
      ) {
        pos[idx] = ((i % 17) / 17 - 0.5) * 1.5;
        pos[idx + 1] = -2.0 + ((i % 13) / 13 - 0.5) * 1.5;
        pos[idx + 2] = ((i % 19) / 19 - 0.5) * 1.5;
      }
    }
    model.neutronGeo.attributes.position.needsUpdate = true;
    model.neutronPoints.visible = true;
  } else {
    model.neutronPoints.visible = false;
  }

  model.graphiteMat.opacity = isCutaway ? 0.35 : 1.0;
  model.graphiteMat.transparent = isCutaway;
}
