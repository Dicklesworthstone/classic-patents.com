/**
 * townesLaserModel.ts
 *
 * Procedural 3D WebGL Model for Arthur L. Schawlow & Charles H. Townes'
 * Optical Maser / Laser (US Patent 2,929,922).
 *
 * Built purely with Three.js primitives (geometries, meshes, materials).
 * Zero external GLTF/GLB asset dependencies.
 */

import * as THREE from "three";

export interface TownesLaserModelNodes {
  root: THREE.Group;
  baseRail: THREE.Mesh;
  rearMirrorMount: THREE.Group;
  rearMirror: THREE.Mesh;
  frontMirrorMount: THREE.Group;
  frontMirror: THREE.Mesh;
  laserTube: THREE.Mesh;
  gainCore: THREE.Mesh;
  helicalFlashlamp: THREE.Mesh;
  intraCavityBeam: THREE.Mesh;
  outputBeam: THREE.Mesh;
  detectorHousing: THREE.Group;
  materials: THREE.Material[];
}

export interface TownesLaserArticulationState {
  pumpPowerWatts: number;
  laserOutputPowerWatts: number;
  intraCavityPowerWatts: number;
  isLasing: boolean;
  pumpShimmerOmegaRadPerS: number;
  beamShimmerOmegaRadPerS: number;
}

export function buildTownesLaserModel(): TownesLaserModelNodes {
  const root = new THREE.Group();
  const materials: THREE.Material[] = [];

  const addMat = <T extends THREE.Material>(m: T): T => {
    materials.push(m);
    return m;
  };

  // Materials
  const railMat = addMat(
    new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.85,
      roughness: 0.35,
    }),
  );

  const mountMat = addMat(
    new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.7,
      roughness: 0.4,
    }),
  );

  const brassMat = addMat(
    new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.9,
      roughness: 0.25,
    }),
  );

  const mirrorMat1 = addMat(
    new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.98,
      roughness: 0.05,
    }),
  );

  const mirrorMat2 = addMat(
    new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.8,
      roughness: 0.15,
      transparent: true,
      opacity: 0.85,
    }),
  );

  const glassTubeMat = addMat(
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.1,
      transmission: 0.9,
      transparent: true,
      opacity: 0.35,
    }),
  );

  const gainCoreMat = addMat(
    new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x0891b2,
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.6,
    }),
  );

  const flashlampMat = addMat(
    new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.8,
    }),
  );

  const intraCavityBeamMat = addMat(
    new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.0,
    }),
  );

  const outputBeamMat = addMat(
    new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.0,
    }),
  );

  // 1. Optical Bench Rail
  const baseRailGeo = new THREE.BoxGeometry(6.5, 0.18, 0.9);
  const baseRail = new THREE.Mesh(baseRailGeo, railMat);
  baseRail.position.set(0, -0.65, 0);
  baseRail.castShadow = true;
  baseRail.receiveShadow = true;
  root.add(baseRail);

  // Bench support feet
  for (const x of [-2.8, 0, 2.8]) {
    const footGeo = new THREE.CylinderGeometry(0.22, 0.28, 0.15, 16);
    const foot = new THREE.Mesh(footGeo, railMat);
    foot.position.set(x, -0.81, 0);
    root.add(foot);
  }

  // 2. Rear Mirror Mount (x = -1.8)
  const rearMirrorMount = new THREE.Group();
  rearMirrorMount.position.set(-1.8, 0, 0);

  const postGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.6, 16);
  const post1 = new THREE.Mesh(postGeo, mountMat);
  post1.position.set(0, -0.3, 0);
  rearMirrorMount.add(post1);

  const ringGeo = new THREE.TorusGeometry(0.45, 0.08, 16, 32);
  const ring1 = new THREE.Mesh(ringGeo, mountMat);
  ring1.rotation.y = Math.PI / 2;
  rearMirrorMount.add(ring1);

  const mirrorGeo1 = new THREE.CylinderGeometry(0.4, 0.4, 0.06, 32);
  const rearMirror = new THREE.Mesh(mirrorGeo1, mirrorMat1);
  rearMirror.rotation.z = Math.PI / 2;
  rearMirrorMount.add(rearMirror);

  // Kinematic adjustment screws
  for (const ang of [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3]) {
    const screwGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.2, 12);
    const screw = new THREE.Mesh(screwGeo, brassMat);
    screw.rotation.z = Math.PI / 2;
    screw.position.set(-0.1, Math.cos(ang) * 0.42, Math.sin(ang) * 0.42);
    rearMirrorMount.add(screw);
  }
  root.add(rearMirrorMount);

  // 3. Front Output Coupler Mirror Mount (x = +1.2)
  const frontMirrorMount = new THREE.Group();
  frontMirrorMount.position.set(1.2, 0, 0);

  const post2 = new THREE.Mesh(postGeo, mountMat);
  post2.position.set(0, -0.3, 0);
  frontMirrorMount.add(post2);

  const ring2 = new THREE.Mesh(ringGeo, mountMat);
  ring2.rotation.y = Math.PI / 2;
  frontMirrorMount.add(ring2);

  const mirrorGeo2 = new THREE.CylinderGeometry(0.4, 0.4, 0.05, 32);
  const frontMirror = new THREE.Mesh(mirrorGeo2, mirrorMat2);
  frontMirror.rotation.z = Math.PI / 2;
  frontMirrorMount.add(frontMirror);
  root.add(frontMirrorMount);

  // 4. Central Gain Tube with Brewster Angle Quartz End Windows (x = -0.3, Length = 2.6)
  const tubeGeo = new THREE.CylinderGeometry(0.32, 0.32, 2.6, 32);
  const laserTube = new THREE.Mesh(tubeGeo, glassTubeMat);
  laserTube.rotation.z = Math.PI / 2;
  laserTube.position.set(-0.3, 0, 0);
  root.add(laserTube);

  const coreGeo = new THREE.CylinderGeometry(0.24, 0.24, 2.58, 32);
  const gainCore = new THREE.Mesh(coreGeo, gainCoreMat);
  gainCore.rotation.z = Math.PI / 2;
  gainCore.position.set(-0.3, 0, 0);
  root.add(gainCore);

  // Brewster Angle Quartz Windows at tube ends (~56° angle of incidence)
  const brewsterGeo = new THREE.CylinderGeometry(0.33, 0.33, 0.04, 24);
  const brewsterL = new THREE.Mesh(brewsterGeo, glassTubeMat);
  brewsterL.rotation.z = Math.PI / 3;
  brewsterL.position.set(-1.6, 0, 0);
  root.add(brewsterL);

  const brewsterR = new THREE.Mesh(brewsterGeo, glassTubeMat);
  brewsterR.rotation.z = Math.PI / 3;
  brewsterR.position.set(1.0, 0, 0);
  root.add(brewsterR);

  // RF Gas Discharge Electrodes (Anode and Cathode gas feed tubes)
  const rfGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.5, 12);
  const rf1 = new THREE.Mesh(rfGeo, brassMat);
  rf1.position.set(-1.0, 0.45, 0);
  root.add(rf1);

  const rf2 = new THREE.Mesh(rfGeo, brassMat);
  rf2.position.set(0.4, 0.45, 0);
  root.add(rf2);

  // Gain tube mounting stanchions
  for (const x of [-1.2, 0.6]) {
    const clampGeo = new THREE.BoxGeometry(0.12, 0.75, 0.75);
    const clamp = new THREE.Mesh(clampGeo, mountMat);
    clamp.position.set(x, -0.25, 0);
    root.add(clamp);
  }

  // 5. Helical Pumping Flashlamp
  const helixCurve = new THREE.CatmullRomCurve3(
    Array.from({ length: 48 }, (_, i) => {
      const t = i / 47;
      const x = -1.4 + t * 2.2;
      const theta = t * Math.PI * 12;
      const r = 0.44;
      return new THREE.Vector3(x, Math.sin(theta) * r, Math.cos(theta) * r);
    }),
  );
  const helixGeo = new THREE.TubeGeometry(helixCurve, 64, 0.035, 12, false);
  const helicalFlashlamp = new THREE.Mesh(helixGeo, flashlampMat);
  root.add(helicalFlashlamp);

  // 6. Intra-Cavity Laser Standing Wave (between -1.75 and 1.15)
  const intraBeamGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.9, 16);
  const intraCavityBeam = new THREE.Mesh(intraBeamGeo, intraCavityBeamMat);
  intraCavityBeam.rotation.z = Math.PI / 2;
  intraCavityBeam.position.set(-0.3, 0, 0);
  root.add(intraCavityBeam);

  // 7. Output Extracted Laser Beam (from 1.25 to 2.6)
  const outBeamGeo = new THREE.CylinderGeometry(0.075, 0.085, 1.35, 16);
  const outputBeam = new THREE.Mesh(outBeamGeo, outputBeamMat);
  outputBeam.rotation.z = Math.PI / 2;
  outputBeam.position.set(1.92, 0, 0);
  root.add(outputBeam);

  // 8. Receiver / Detector Station (x = 2.6) with Photodetector Target
  const detectorHousing = new THREE.Group();
  detectorHousing.position.set(2.6, 0, 0);

  const detPost = new THREE.Mesh(postGeo, mountMat);
  detPost.position.set(0, -0.3, 0);
  detectorHousing.add(detPost);

  const detBoxGeo = new THREE.BoxGeometry(0.35, 0.65, 0.65);
  const detBox = new THREE.Mesh(detBoxGeo, mountMat);
  detectorHousing.add(detBox);

  const lensHolderGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.12, 24);
  const lensHolder = new THREE.Mesh(lensHolderGeo, brassMat);
  lensHolder.rotation.z = Math.PI / 2;
  lensHolder.position.set(-0.18, 0, 0);
  detectorHousing.add(lensHolder);

  // TEM00 Gaussian Spot Profile on Detector Target
  const spotDiscGeo = new THREE.CircleGeometry(0.18, 24);
  const spotDiscMat = addMat(
    new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.0,
    }),
  );
  const spotDisc = new THREE.Mesh(spotDiscGeo, spotDiscMat);
  spotDisc.rotation.y = -Math.PI / 2;
  spotDisc.position.set(-0.19, 0, 0);
  detectorHousing.add(spotDisc);

  root.add(detectorHousing);

  return {
    root,
    baseRail,
    rearMirrorMount,
    rearMirror,
    frontMirrorMount,
    frontMirror,
    laserTube,
    gainCore,
    helicalFlashlamp,
    intraCavityBeam,
    outputBeam,
    detectorHousing,
    materials,
  };
}

export function articulateTownesLaserModel(
  nodes: TownesLaserModelNodes,
  state: TownesLaserArticulationState,
  time: number,
) {
  // 1. Pumping Flashlamp emissive pulse
  const pumpNormalized = Math.min(1.0, state.pumpPowerWatts / 800);
  const pumpPulse = 0.7 + 0.3 * Math.sin(time * state.pumpShimmerOmegaRadPerS);
  const lampMat = nodes.helicalFlashlamp.material as THREE.MeshStandardMaterial;
  lampMat.emissiveIntensity = 0.5 + pumpNormalized * 2.5 * pumpPulse;

  // 2. Active Gain Core fluorescence
  const coreMat = nodes.gainCore.material as THREE.MeshStandardMaterial;
  coreMat.emissiveIntensity = 0.2 + pumpNormalized * 1.8;

  // 3. Intra-Cavity Standing Wave & Output Beam
  const intraMat = nodes.intraCavityBeam.material as THREE.MeshBasicMaterial;
  const outMat = nodes.outputBeam.material as THREE.MeshBasicMaterial;

  if (state.isLasing && state.laserOutputPowerWatts > 0) {
    const beamPulse = 0.85 + 0.15 * Math.sin(time * state.beamShimmerOmegaRadPerS);
    intraMat.opacity = Math.min(0.9, 0.3 + (state.intraCavityPowerWatts / 300) * 0.6) * beamPulse;
    outMat.opacity = Math.min(0.95, 0.4 + (state.laserOutputPowerWatts / 150) * 0.6) * beamPulse;
  } else {
    intraMat.opacity = 0.0;
    outMat.opacity = 0.0;
  }
}
