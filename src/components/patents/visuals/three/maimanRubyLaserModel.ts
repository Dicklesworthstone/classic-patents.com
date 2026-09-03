import * as THREE from "three";
import { type MaimanRubyLaserControls, stepMaimanRubyLaser } from "@/physics/catalogKernels";
import { computeLaserCavityField } from "@/physics/fieldTextures";

export interface MaimanRubyLaserModelNodes {
  group: THREE.Group;
  rubyRod: THREE.Mesh;
  helicalFlashTube: THREE.Group;
  housingCylinder: THREE.Mesh;
  rearMirror: THREE.Mesh;
  outputMirror: THREE.Mesh;
  laserBeam: THREE.Mesh;
  targetDisc: THREE.Mesh;
  targetAblationSpot: THREE.Mesh;
  basePlate: THREE.Mesh;
  excitationPhotons: THREE.Points;
  highVoltageLeads: THREE.Group;
}

export function createMaimanRubyLaserModel(): {
  nodes: MaimanRubyLaserModelNodes;
  update: (controls: MaimanRubyLaserControls, timeSec: number, isFiring: boolean) => void;
  setCutaway?: (cutaway: boolean) => void;
  dispose: () => void;
} {
  const group = new THREE.Group();
  group.name = "maiman-ruby-laser-root";

  // The facsimile gives topology, not dimensions. The rod-length control is a
  // modern scenario input, mapped monotonically into this fixed museum frame.
  // Every dependent optical component follows the same display length so the
  // lamp, reflector, mirrors, supports, beam, and witness remain connected.
  const displayRodLength = (rodLengthCm: number | undefined) => {
    const boundedCm = Math.min(10, Math.max(2, rodLengthCm ?? 5));
    return 4 + ((boundedCm - 2) / 8) * 4;
  };

  // Materials
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    metalness: 0.8,
    roughness: 0.3,
  });

  const housingMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    metalness: 0.85,
    roughness: 0.2,
    transparent: true,
    opacity: 0.35,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  const rubyMat = new THREE.MeshPhysicalMaterial({
    color: 0xe11d48,
    emissive: 0x9f1239,
    emissiveIntensity: 0.2,
    roughness: 0.1,
    metalness: 0.1,
    transmission: 0.85,
    ior: 1.76, // Exact ruby refractive index
    thickness: 1.2,
    transparent: true,
    opacity: 0.95,
  });

  const silverMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    metalness: 0.95,
    roughness: 0.1,
  });

  const outputMirrorMat = new THREE.MeshPhysicalMaterial({
    color: 0xcbd5e1,
    metalness: 0.9,
    roughness: 0.1,
    transmission: 0.15,
    transparent: true,
    opacity: 0.85,
    side: THREE.DoubleSide,
  });

  const apertureMat = new THREE.MeshBasicMaterial({
    color: 0x7f1d1d,
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide,
  });

  const flashMat = new THREE.MeshStandardMaterial({
    color: 0xfef08a,
    emissive: 0x000000,
    emissiveIntensity: 0.0,
    roughness: 0.2,
    metalness: 0.1,
    transparent: true,
    opacity: 0.85,
  });

  const beamMat = new THREE.MeshBasicMaterial({
    color: 0xff0033,
    transparent: true,
    opacity: 0.0,
    side: THREE.DoubleSide,
  });

  const targetMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.7,
    metalness: 0.3,
  });

  const ablationMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    emissive: 0xf97316,
    emissiveIntensity: 0.0,
    roughness: 0.2,
    metalness: 0.1,
  });

  const copperLeadMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    metalness: 0.9,
    roughness: 0.25,
  });

  const ceramicInsulatorMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.3,
    metalness: 0.1,
  });

  // 1. Base Plate
  const basePlate = new THREE.Mesh(new THREE.BoxGeometry(14.5, 0.6, 8), baseMat);
  basePlate.name = "Connected optical-bench foundation";
  basePlate.position.set(1.7, -1.8, 0);
  group.add(basePlate);

  // 2. Optical Mount Brackets
  const mountGeo = new THREE.BoxGeometry(0.8, 2.2, 3.2);
  const mountRear = new THREE.Mesh(mountGeo, baseMat);
  mountRear.name = "Rear reflector saddle support";
  mountRear.position.set(-3.25, -0.4, 0);
  group.add(mountRear);

  const mountFront = new THREE.Mesh(mountGeo, baseMat);
  mountFront.name = "Output reflector saddle support";
  mountFront.position.set(3.25, -0.4, 0);
  group.add(mountFront);

  // 3. Cylindrical Polished Aluminum Reflector Housing (Cutaway Cavity)
  const housingCylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(1.6, 1.6, 7.5, 32, 1, true),
    housingMat,
  );
  housingCylinder.rotation.z = Math.PI / 2;
  housingCylinder.name = "Reflective outer cylinder 38";
  housingCylinder.position.set(0, 0.4, 0);
  group.add(housingCylinder);

  // End Flanges on Cavity Housing
  const flangeGeo = new THREE.TorusGeometry(1.6, 0.1, 16, 32);
  const flangeL = new THREE.Mesh(flangeGeo, baseMat);
  flangeL.name = "Rear reflector housing flange";
  flangeL.rotation.y = Math.PI / 2;
  flangeL.position.set(-3.75, 0.4, 0);
  group.add(flangeL);

  const flangeR = new THREE.Mesh(flangeGeo, baseMat);
  flangeR.name = "Output reflector housing flange";
  flangeR.rotation.y = Math.PI / 2;
  flangeR.position.set(3.75, 0.4, 0);
  group.add(flangeR);

  // 4. Synthetic Pink Ruby Rod (Cr3+:Al2O3 along X axis)
  const rubyRod = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 6.0, 32), rubyMat);
  rubyRod.name = "Chromium-doped ruby rod 26";
  rubyRod.rotation.z = Math.PI / 2;
  rubyRod.position.set(0, 0.4, 0);
  group.add(rubyRod);

  // 5. Silvered Fabry-Pérot Resonator Mirrors at ends of ruby rod
  const mirrorGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.08, 32);
  const rearMirror = new THREE.Mesh(mirrorGeo, silverMat);
  rearMirror.name = "Highly reflective end coating 30";
  rearMirror.rotation.z = Math.PI / 2;
  rearMirror.position.set(-3.04, 0.4, 0);
  group.add(rearMirror);

  const outputMirror = new THREE.Mesh(new THREE.RingGeometry(0.11, 0.36, 32), outputMirrorMat);
  outputMirror.name = "Partially silvered output coating around aperture 32";
  outputMirror.rotation.y = Math.PI / 2;
  outputMirror.position.set(3, 0.4, 0);
  group.add(outputMirror);

  const outputAperture = new THREE.Mesh(new THREE.CircleGeometry(0.105, 24), apertureMat);
  outputAperture.name = "Nonreflective output aperture 32";
  outputAperture.rotation.y = Math.PI / 2;
  outputAperture.position.set(3.002, 0.4, 0);
  group.add(outputAperture);

  // 6. Helical gas-filled flash tube 28 surrounding the ruby rod. The grant
  // does not identify a commercial lamp model or publish tube dimensions.
  const helicalFlashTube = new THREE.Group();
  helicalFlashTube.name = "Helical gas-filled flash tube 28";
  const coilTurns = 7;
  const coilRadius = 1.0;
  const coilLength = 5.6;
  const points: THREE.Vector3[] = [];
  const totalSamples = 140;

  for (let i = 0; i <= totalSamples; i++) {
    const t = i / totalSamples;
    const angle = t * coilTurns * Math.PI * 2;
    const x = -coilLength / 2 + t * coilLength;
    const y = Math.cos(angle) * coilRadius + 0.4;
    const z = Math.sin(angle) * coilRadius;
    points.push(new THREE.Vector3(x, y, z));
  }

  const curve = new THREE.CatmullRomCurve3(points);
  const tubeGeo = new THREE.TubeGeometry(curve, 100, 0.12, 12, false);
  const flashMesh = new THREE.Mesh(tubeGeo, flashMat);
  flashMesh.name = "Connected xenon discharge envelope";
  helicalFlashTube.add(flashMesh);
  group.add(helicalFlashTube);

  // 7. High-Voltage Pulse Leads & Ceramic Feedthroughs
  const highVoltageLeads = new THREE.Group();
  highVoltageLeads.name = "Flash-tube electrodes and connected pulse leads";
  const feedGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.6, 16);

  // Anode feedthrough
  const feedA = new THREE.Mesh(feedGeo, ceramicInsulatorMat);
  feedA.name = "Anode ceramic feedthrough";
  feedA.position.set(-2.8, 1.6, 1.0);
  highVoltageLeads.add(feedA);
  const wireA = new THREE.Mesh(
    new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-2.8, 1.4, 0),
        new THREE.Vector3(-2.8, 1.35, 0.55),
        new THREE.Vector3(-2.8, 1.3, 1.0),
      ]),
      20,
      0.045,
      8,
      false,
    ),
    copperLeadMat,
  );
  wireA.name = "Anode lead from flash-tube end to feedthrough";
  highVoltageLeads.add(wireA);

  // Cathode feedthrough
  const feedC = new THREE.Mesh(feedGeo, ceramicInsulatorMat);
  feedC.name = "Cathode ceramic feedthrough";
  feedC.position.set(2.8, 1.6, 1.0);
  highVoltageLeads.add(feedC);
  const wireC = new THREE.Mesh(
    new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(2.8, 1.4, 0),
        new THREE.Vector3(2.8, 1.35, 0.55),
        new THREE.Vector3(2.8, 1.3, 1.0),
      ]),
      20,
      0.045,
      8,
      false,
    ),
    copperLeadMat,
  );
  wireC.name = "Cathode lead from flash-tube end to feedthrough";
  highVoltageLeads.add(wireC);

  group.add(highVoltageLeads);

  // 8. Excited Cr3+ Photon Emission Particles inside Resonator
  const photonCount = 80;
  const photonGeo = new THREE.BufferGeometry();
  const photonPositions = new Float32Array(photonCount * 3);
  for (let i = 0; i < photonCount; i++) {
    const rx = (Math.sin((i + 1) * 12.9898) * 43758.5453) % 1;
    const ry = (Math.sin((i + 1) * 78.233) * 43758.5453) % 1;
    const rz = (Math.sin((i + 1) * 45.164) * 43758.5453) % 1;
    photonPositions[i * 3] = -2.8 + Math.abs(rx) * 5.6;
    photonPositions[i * 3 + 1] = 0.4 + (Math.abs(ry) - 0.5) * 0.4;
    photonPositions[i * 3 + 2] = (Math.abs(rz) - 0.5) * 0.4;
  }
  photonGeo.setAttribute("position", new THREE.BufferAttribute(photonPositions, 3));
  const photonMat = new THREE.PointsMaterial({
    color: 0xff1744,
    size: 0.12,
    transparent: true,
    opacity: 0.0,
    blending: THREE.AdditiveBlending,
  });
  const excitationPhotons = new THREE.Points(photonGeo, photonMat);
  excitationPhotons.name = "Deterministic cavity-photon visualization";
  group.add(excitationPhotons);

  const photonBasePositions = photonPositions.slice();

  // 9. Collimated Laser Beam (Red 694.3 nm)
  const beamLength = 4.4;
  const laserBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, beamLength, 24), beamMat);
  laserBeam.name = "Coherent output beam 34";
  laserBeam.rotation.z = Math.PI / 2;
  laserBeam.position.set(3.0 + beamLength / 2, 0.4, 0);
  group.add(laserBeam);

  // 10. Distant Target Disc with Mounting Pedestal & Ablation Focal Spot
  const targetGroup = new THREE.Group();
  targetGroup.name = "Beam witness assembly (display context, not claimed element)";
  targetGroup.position.set(3.0 + beamLength, 0.4, 0);

  const targetDisc = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.2, 32), targetMat);
  targetDisc.name = "Beam witness disc (display context)";
  targetDisc.rotation.z = Math.PI / 2;
  targetGroup.add(targetDisc);

  // Sturdy Target Pedestal Stand and Floor Plinth
  const targetPost = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 1.9, 16), baseMat);
  targetPost.name = "Beam witness support post";
  targetPost.position.set(0, -1.05, 0);
  targetGroup.add(targetPost);

  const targetFoot = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.25, 1.6), baseMat);
  targetFoot.name = "Beam witness foundation foot";
  targetFoot.position.set(0, -1.925, 0);
  targetFoot.receiveShadow = true;
  targetGroup.add(targetFoot);

  const ablationGeo = new THREE.CircleGeometry(0.32, 24);
  const targetAblationSpot = new THREE.Mesh(ablationGeo, ablationMat);
  targetAblationSpot.name = "Beam witness illumination spot";
  targetAblationSpot.rotation.y = -Math.PI / 2;
  targetAblationSpot.position.set(-0.11, 0, 0);
  targetGroup.add(targetAblationSpot);

  group.add(targetGroup);

  // Update loop
  const update = (controls: MaimanRubyLaserControls, timeSec: number, isFiring: boolean) => {
    const metrics = stepMaimanRubyLaser(controls);
    const pumpJoules = controls.pumpEnergyJoules ?? 150;
    const invFrac = metrics.isLasing ? 0.85 : 0.45;
    const cavityField = computeLaserCavityField(pumpJoules, invFrac, 16);
    const rodDisplayLength = displayRodLength(controls.rodLengthCm);
    const rodHalfLength = rodDisplayLength / 2;
    const housingLength = rodDisplayLength + 1.5;
    const flashLengthScale = (rodDisplayLength - 0.4) / coilLength;

    rubyRod.scale.y = rodDisplayLength / 6;
    housingCylinder.scale.y = housingLength / 7.5;
    helicalFlashTube.scale.x = flashLengthScale;
    highVoltageLeads.scale.x = flashLengthScale;
    rearMirror.position.x = -rodHalfLength - 0.035;
    outputMirror.position.x = rodHalfLength;
    outputAperture.position.x = rodHalfLength + 0.002;
    flangeL.position.x = -housingLength / 2;
    flangeR.position.x = housingLength / 2;
    mountRear.position.x = -housingLength / 2 + 0.1;
    mountFront.position.x = housingLength / 2 - 0.1;
    laserBeam.position.x = rodHalfLength + beamLength / 2;
    targetGroup.position.x = rodHalfLength + beamLength;
    outputMirrorMat.opacity = 0.35 + 0.6 * (controls.outputMirrorReflectivity ?? 0.92);

    // Flash tube activation
    if (isFiring) {
      flashMat.emissive.setHex(0xfef08a);
      flashMat.emissiveIntensity = 3.0;
      rubyMat.emissive.setHex(metrics.isLasing ? 0xff4d6d : 0xe11d48);
      rubyMat.emissiveIntensity = metrics.isLasing ? 2.2 : 0.8;
      photonMat.opacity = metrics.isLasing ? 0.9 : 0.4;

      // Animate internal photon oscillation along optical cavity axis
      const pAttr = photonGeo.attributes.position;
      for (let i = 0; i < photonCount; i++) {
        const baseX = photonBasePositions[i * 3] ?? 0;
        const baseY = photonBasePositions[i * 3 + 1] ?? 0.4;
        const u = Math.max(0, Math.min(1, (baseX + 2.9) / 5.8));
        const v = Math.max(0, Math.min(1, (baseY - 0.4 + 0.4) / 0.8));
        const gx = Math.floor(u * 15);
        const gy = Math.floor(v * 15);
        const fieldGain = 0.8 + 0.4 * (cavityField[gy * 16 + gx] ?? 0.5);
        const direction = i % 2 === 0 ? 1 : -1;
        const unwrapped =
          baseX * (rodDisplayLength / 6) + direction * timeSec * rodDisplayLength * fieldGain;
        const px =
          ((((unwrapped + rodHalfLength) % rodDisplayLength) + rodDisplayLength) %
            rodDisplayLength) -
          rodHalfLength;
        pAttr.setX(i, px);
      }
      pAttr.needsUpdate = true;
    } else {
      flashMat.emissive.setHex(0x000000);
      flashMat.emissiveIntensity = 0.0;
      rubyMat.emissive.setHex(0x9f1239);
      rubyMat.emissiveIntensity = 0.2;
      photonMat.opacity = 0.0;
    }

    // Laser beam visibility and pulsing
    if (isFiring && metrics.isLasing) {
      beamMat.opacity = 0.9;
      const shimmer = 0.9 + 0.1 * Math.sin(timeSec * metrics.beamShimmerOmegaRadPerS);
      laserBeam.scale.set(shimmer, 1, shimmer);
      ablationMat.emissiveIntensity = 2.5;
      apertureMat.opacity = 0.9;
    } else {
      beamMat.opacity = 0.0;
      laserBeam.scale.set(1, 1, 1);
      ablationMat.emissiveIntensity = 0.0;
      apertureMat.opacity = 0.5;
    }
  };

  const dispose = () => {
    const geometries = new Set<THREE.BufferGeometry>();
    const materials = new Set<THREE.Material>();
    group.traverse((object) => {
      if (!(object instanceof THREE.Mesh || object instanceof THREE.Points)) return;
      geometries.add(object.geometry);
      const objectMaterials = Array.isArray(object.material) ? object.material : [object.material];
      for (const objectMaterial of objectMaterials) materials.add(objectMaterial);
    });
    for (const geometry of geometries) geometry.dispose();
    for (const material of materials) material.dispose();
  };

  const setCutaway = (cutaway: boolean) => {
    housingMat.opacity = cutaway ? 0.08 : 0.65;
    housingMat.needsUpdate = true;
  };

  return {
    nodes: {
      group,
      rubyRod,
      helicalFlashTube,
      housingCylinder,
      rearMirror,
      outputMirror,
      laserBeam,
      targetDisc,
      targetAblationSpot,
      basePlate,
      excitationPhotons,
      highVoltageLeads,
    },
    update,
    setCutaway,
    dispose,
  };
}
