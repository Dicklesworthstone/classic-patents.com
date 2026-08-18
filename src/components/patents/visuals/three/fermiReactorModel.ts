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
  neutronColors: Float32Array;
  graphiteMat: THREE.MeshStandardMaterial;
  uraniumFuelMat: THREE.MeshStandardMaterial;
  updateKinematics: (
    delta: number,
    controlRodWithdrawalPct: number,
    kEff: number,
    moderatorPurityPct: number,
    neutronDisplaySpeed: number,
    showNeutronCascade: boolean,
  ) => void;
  dispose: () => void;
}

export function buildFermiReactorModel(): FermiReactorModel {
  const root = new THREE.Group();
  const disposables: Array<{ dispose: () => void }> = [];
  const lcg = createLcg(19421202);

  // --- AUTHENTIC MATERIALS ---
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

  // ==========================================
  // MULTI-TIER HEAVY TIMBER SCAFFOLD GANTRY
  // ==========================================
  const timberGroup = new THREE.Group();
  timberGroup.position.y = -3.4;
  root.add(timberGroup);

  for (let b = 0; b < 6; b++) {
    const beamXGeo = new THREE.BoxGeometry(11.0, 0.45, 0.45);
    disposables.push(beamXGeo);
    const beamX = new THREE.Mesh(beamXGeo, timberSupportMat);
    beamX.position.set(0, 0, -4.5 + b * 1.8);
    timberGroup.add(beamX);

    const beamZGeo = new THREE.BoxGeometry(0.45, 0.45, 11.0);
    disposables.push(beamZGeo);
    const beamZ = new THREE.Mesh(beamZGeo, timberSupportMat);
    beamZ.position.set(-4.5 + b * 1.8, 0.45, 0);
    timberGroup.add(beamZ);
  }

  [
    [-5.0, -5.0],
    [5.0, -5.0],
    [-5.0, 5.0],
    [5.0, 5.0],
  ].forEach(([cx, cz]) => {
    const postGeo = new THREE.BoxGeometry(0.6, 6.2, 0.6);
    disposables.push(postGeo);
    const post = new THREE.Mesh(postGeo, timberSupportMat);
    post.position.set(cx, 3.1, cz);
    timberGroup.add(post);
  });

  const gantryGeo = new THREE.BoxGeometry(11.0, 0.5, 0.5);
  disposables.push(gantryGeo);
  const gantryBeam = new THREE.Mesh(gantryGeo, timberSupportMat);
  gantryBeam.position.set(0, 6.2, 0);
  timberGroup.add(gantryBeam);

  [-0.8, 0.8].forEach((px) => {
    const pulleyGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.15, 16);
    disposables.push(pulleyGeo);
    const pulley = new THREE.Mesh(pulleyGeo, pulleyMat);
    pulley.rotation.z = Math.PI / 2;
    pulley.position.set(px, 5.8, 0);
    timberGroup.add(pulley);
  });

  // ==========================================
  // GRAPHITE MODERATOR BRICK MATRIX (CLAIM 1)
  // ==========================================
  const pileGroup = new THREE.Group();
  const layerSize = 5;
  const blockSize = 1.4;

  for (let x = 0; x < layerSize; x++) {
    for (let z = 0; z < layerSize; z++) {
      for (let y = 0; y < 5; y++) {
        const blockGeo = new THREE.BoxGeometry(blockSize * 0.94, 0.68, blockSize * 0.94);
        disposables.push(blockGeo);
        const block = new THREE.Mesh(blockGeo, graphiteMat);
        block.position.set((x - 2) * blockSize, -2.6 + y * 0.72, (z - 2) * blockSize);
        block.castShadow = true;
        block.receiveShadow = true;
        pileGroup.add(block);
      }
    }
  }
  root.add(pileGroup);

  // ==========================================
  // URANIUM FUEL LUMPS LATTICE
  // ==========================================
  const fuelGroup = new THREE.Group();
  for (let x = -1; x <= 1; x++) {
    for (let z = -1; z <= 1; z++) {
      const fuelGeo = new THREE.CylinderGeometry(0.24, 0.24, 3.2, 16);
      disposables.push(fuelGeo);
      const fuel = new THREE.Mesh(fuelGeo, uraniumFuelMat);
      fuel.position.set(x * blockSize * 1.5, -1.2, z * blockSize * 1.5);
      fuel.castShadow = true;
      fuelGroup.add(fuel);
    }
  }
  root.add(fuelGroup);

  // ==========================================
  // MOVABLE CADMIUM CONTROL RODS (CLAIM 2 & CLAIM 3)
  // ==========================================
  const rodGroup = new THREE.Group();
  const rodGeo = new THREE.CylinderGeometry(0.12, 0.12, 5.2, 16);
  disposables.push(rodGeo);
  const rod1 = new THREE.Mesh(rodGeo, cadmiumRodMat);
  rod1.position.set(-0.8, 0.4, 0);
  rod1.castShadow = true;
  const rod2 = rod1.clone();
  rod2.position.set(0.8, 0.4, 0);
  rodGroup.add(rod1);
  rodGroup.add(rod2);
  root.add(rodGroup);

  // Boron Trifluoride (BF3) Detector
  const bf3Geo = new THREE.CylinderGeometry(0.18, 0.18, 1.8, 16);
  disposables.push(bf3Geo);
  const bf3Detector = new THREE.Mesh(bf3Geo, detectorMat);
  bf3Detector.position.set(3.8, -0.6, 3.8);
  bf3Detector.castShadow = true;
  root.add(bf3Detector);

  // ==========================================
  // THERMAL NEUTRON DIFFUSION CASCADE
  // ==========================================
  const neutronCount = 300;
  const neutronGeo = new THREE.BufferGeometry();
  disposables.push(neutronGeo);
  const neutronPos = new Float32Array(neutronCount * 3);
  const neutronColors = new Float32Array(neutronCount * 3);
  const glowTex = createGlowPointTexture();
  disposables.push(glowTex);

  for (let i = 0; i < neutronCount; i++) {
    const idx = i * 3;
    neutronPos[idx] = (lcg() - 0.5) * 6.5;
    neutronPos[idx + 1] = -2.6 + lcg() * 3.2;
    neutronPos[idx + 2] = (lcg() - 0.5) * 6.5;

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

  // ==========================================
  // KINEMATICS & REACTOR CRITICALITY UPDATE FUNCTION
  // ==========================================
  const updateKinematics = (
    delta: number,
    controlRodWithdrawalPct: number,
    kEff: number,
    moderatorPurityPct: number,
    neutronDisplaySpeed: number,
    showNeutronCascade: boolean,
  ) => {
    const targetRodY = -0.5 + (controlRodWithdrawalPct / 100) * 3.2;
    rodGroup.position.y += (targetRodY - rodGroup.position.y) * 0.1;

    const purity = (moderatorPurityPct ?? 99.5) / 100;
    graphiteMat.color.setRGB(0.12 * purity, 0.13 * purity, 0.15 * purity);
    uraniumFuelMat.emissiveIntensity = Math.max(0, (kEff - 0.98) * 8);
    uraniumFuelMat.emissive = new THREE.Color(kEff > 1.002 ? 0xf97316 : 0x22c55e);

    if (showNeutronCascade) {
      const speed = (neutronDisplaySpeed ?? kEff * 4.0) * delta;
      for (let i = 0; i < neutronCount; i++) {
        const idx = i * 3;
        neutronPos[idx] += (lcg() - 0.5) * speed * 2.0;
        neutronPos[idx + 1] += (lcg() - 0.5) * speed * 2.0;
        neutronPos[idx + 2] += (lcg() - 0.5) * speed * 2.0;

        if (Math.abs(neutronPos[idx]) > 3.6 || Math.abs(neutronPos[idx + 2]) > 3.6) {
          neutronPos[idx] = (lcg() - 0.5) * 1.5;
          neutronPos[idx + 1] = -2.0 + (lcg() - 0.5) * 1.5;
          neutronPos[idx + 2] = (lcg() - 0.5) * 1.5;
        }
      }
      neutronGeo.attributes.position.needsUpdate = true;
      neutronPoints.visible = true;
    } else {
      neutronPoints.visible = false;
    }
  };

  const dispose = () => {
    for (const d of disposables) {
      d.dispose();
    }
  };

  return {
    root,
    timberGroup,
    pileGroup,
    fuelGroup,
    rodGroup,
    bf3Detector,
    neutronPoints,
    neutronGeo,
    neutronPos,
    neutronColors,
    graphiteMat,
    uraniumFuelMat,
    updateKinematics,
    dispose,
  };
}
