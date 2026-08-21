import * as THREE from "three";
import { type MaimanRubyLaserControls, stepMaimanRubyLaser } from "@/physics/catalogKernels";

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
  dispose: () => void;
} {
  const group = new THREE.Group();
  group.name = "maiman-ruby-laser-root";

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
  const basePlate = new THREE.Mesh(new THREE.BoxGeometry(18, 0.6, 8), baseMat);
  basePlate.position.set(0, -1.8, 0);
  group.add(basePlate);

  // 2. Optical Mount Brackets
  const mountGeo = new THREE.BoxGeometry(0.8, 2.2, 3.2);
  const mountRear = new THREE.Mesh(mountGeo, baseMat);
  mountRear.position.set(-4.5, -0.4, 0);
  group.add(mountRear);

  const mountFront = new THREE.Mesh(mountGeo, baseMat);
  mountFront.position.set(4.5, -0.4, 0);
  group.add(mountFront);

  // 3. Cylindrical Polished Aluminum Reflector Housing (Cutaway Cavity)
  const housingCylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(1.6, 1.6, 7.5, 32, 1, true),
    housingMat,
  );
  housingCylinder.rotation.z = Math.PI / 2;
  housingCylinder.position.set(0, 0.4, 0);
  group.add(housingCylinder);

  // End Flanges on Cavity Housing
  const flangeGeo = new THREE.TorusGeometry(1.6, 0.1, 16, 32);
  const flangeL = new THREE.Mesh(flangeGeo, baseMat);
  flangeL.rotation.y = Math.PI / 2;
  flangeL.position.set(-3.75, 0.4, 0);
  group.add(flangeL);

  const flangeR = new THREE.Mesh(flangeGeo, baseMat);
  flangeR.rotation.y = Math.PI / 2;
  flangeR.position.set(3.75, 0.4, 0);
  group.add(flangeR);

  // 4. Synthetic Pink Ruby Rod (Cr3+:Al2O3 along X axis)
  const rubyRod = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 6.0, 32), rubyMat);
  rubyRod.rotation.z = Math.PI / 2;
  rubyRod.position.set(0, 0.4, 0);
  group.add(rubyRod);

  // 5. Silvered Fabry-Pérot Resonator Mirrors at ends of ruby rod
  const mirrorGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.08, 32);
  const rearMirror = new THREE.Mesh(mirrorGeo, silverMat);
  rearMirror.rotation.z = Math.PI / 2;
  rearMirror.position.set(-3.04, 0.4, 0);
  group.add(rearMirror);

  const outputMirror = new THREE.Mesh(mirrorGeo, outputMirrorMat);
  outputMirror.rotation.z = Math.PI / 2;
  outputMirror.position.set(3.04, 0.4, 0);
  group.add(outputMirror);

  // 6. Helical Xenon Flash Tube (FT-506 spiral geometry surrounding ruby rod)
  const helicalFlashTube = new THREE.Group();
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
  helicalFlashTube.add(flashMesh);
  group.add(helicalFlashTube);

  // 7. High-Voltage Pulse Leads & Ceramic Feedthroughs
  const highVoltageLeads = new THREE.Group();
  const feedGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.6, 16);
  const leadWireGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.8, 8);

  // Anode feedthrough
  const feedA = new THREE.Mesh(feedGeo, ceramicInsulatorMat);
  feedA.position.set(-2.8, 1.6, 1.0);
  highVoltageLeads.add(feedA);
  const wireA = new THREE.Mesh(leadWireGeo, copperLeadMat);
  wireA.position.set(-2.8, 1.0, 1.0);
  highVoltageLeads.add(wireA);

  // Cathode feedthrough
  const feedC = new THREE.Mesh(feedGeo, ceramicInsulatorMat);
  feedC.position.set(2.8, 1.6, 1.0);
  highVoltageLeads.add(feedC);
  const wireC = new THREE.Mesh(leadWireGeo, copperLeadMat);
  wireC.position.set(2.8, 1.0, 1.0);
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
  group.add(excitationPhotons);

  // 9. Collimated Laser Beam (Red 694.3 nm)
  const beamLength = 12;
  const laserBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, beamLength, 24), beamMat);
  laserBeam.rotation.z = Math.PI / 2;
  laserBeam.position.set(3.0 + beamLength / 2, 0.4, 0);
  group.add(laserBeam);

  // 10. Distant Target Disc with Ablation Focal Spot
  const targetDisc = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.2, 32), targetMat);
  targetDisc.rotation.z = Math.PI / 2;
  targetDisc.position.set(3.0 + beamLength, 0.4, 0);
  group.add(targetDisc);

  const ablationGeo = new THREE.CircleGeometry(0.32, 24);
  const targetAblationSpot = new THREE.Mesh(ablationGeo, ablationMat);
  targetAblationSpot.rotation.y = -Math.PI / 2;
  targetAblationSpot.position.set(3.0 + beamLength - 0.11, 0.4, 0);
  group.add(targetAblationSpot);

  // Update loop
  const update = (controls: MaimanRubyLaserControls, timeSec: number, isFiring: boolean) => {
    const metrics = stepMaimanRubyLaser(controls);

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
        let px = pAttr.getX(i) + (i % 2 === 0 ? 0.4 : -0.4);
        if (px > 2.9) px = -2.9;
        if (px < -2.9) px = 2.9;
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
    } else {
      beamMat.opacity = 0.0;
      laserBeam.scale.set(1, 1, 1);
      ablationMat.emissiveIntensity = 0.0;
    }
  };

  const dispose = () => {
    baseMat.dispose();
    housingMat.dispose();
    rubyMat.dispose();
    silverMat.dispose();
    outputMirrorMat.dispose();
    flashMat.dispose();
    beamMat.dispose();
    targetMat.dispose();
    ablationMat.dispose();
    copperLeadMat.dispose();
    ceramicInsulatorMat.dispose();
    photonMat.dispose();
    tubeGeo.dispose();
    mountGeo.dispose();
    mirrorGeo.dispose();
    flangeGeo.dispose();
    feedGeo.dispose();
    leadWireGeo.dispose();
    photonGeo.dispose();
    ablationGeo.dispose();
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
    dispose,
  };
}
