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
  basePlate: THREE.Mesh;
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

  // 3. Cylindrical Reflector Housing
  const housingCylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(1.6, 1.6, 7.5, 32, 1, true),
    housingMat,
  );
  housingCylinder.rotation.z = Math.PI / 2;
  housingCylinder.position.set(0, 0.4, 0);
  group.add(housingCylinder);

  // 4. Synthetic Pink Ruby Rod (along X axis)
  const rubyRod = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 6.0, 32), rubyMat);
  rubyRod.rotation.z = Math.PI / 2;
  rubyRod.position.set(0, 0.4, 0);
  group.add(rubyRod);

  // 5. Silvered Mirrors at ends of ruby rod
  const mirrorGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.08, 32);
  const rearMirror = new THREE.Mesh(mirrorGeo, silverMat);
  rearMirror.rotation.z = Math.PI / 2;
  rearMirror.position.set(-3.04, 0.4, 0);
  group.add(rearMirror);

  const outputMirror = new THREE.Mesh(mirrorGeo, outputMirrorMat);
  outputMirror.rotation.z = Math.PI / 2;
  outputMirror.position.set(3.04, 0.4, 0);
  group.add(outputMirror);

  // 6. Helical Xenon Flash Tube (Procedural Coils)
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

  // 7. Collimated Laser Beam (Red 694.3 nm)
  const beamLength = 12;
  const laserBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, beamLength, 24), beamMat);
  laserBeam.rotation.z = Math.PI / 2;
  laserBeam.position.set(3.0 + beamLength / 2, 0.4, 0);
  group.add(laserBeam);

  // 8. Distant Target Disc
  const targetDisc = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.2, 32), targetMat);
  targetDisc.rotation.z = Math.PI / 2;
  targetDisc.position.set(3.0 + beamLength, 0.4, 0);
  group.add(targetDisc);

  // Update loop
  const update = (controls: MaimanRubyLaserControls, timeSec: number, isFiring: boolean) => {
    const metrics = stepMaimanRubyLaser(controls);

    // Flash tube activation
    if (isFiring) {
      flashMat.emissive.setHex(0xfef08a);
      flashMat.emissiveIntensity = 2.5;
      rubyMat.emissive.setHex(metrics.isLasing ? 0xff4d6d : 0xe11d48);
      rubyMat.emissiveIntensity = metrics.isLasing ? 1.8 : 0.6;
    } else {
      flashMat.emissive.setHex(0x000000);
      flashMat.emissiveIntensity = 0.0;
      rubyMat.emissive.setHex(0x9f1239);
      rubyMat.emissiveIntensity = 0.2;
    }

    // Laser beam visibility and pulsing
    if (isFiring && metrics.isLasing) {
      beamMat.opacity = 0.85;
      // High frequency relaxation oscillation shimmer
      const shimmer = 0.9 + 0.1 * Math.sin(timeSec * 80);
      laserBeam.scale.set(shimmer, 1, shimmer);
    } else {
      beamMat.opacity = 0.0;
      laserBeam.scale.set(1, 1, 1);
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
    tubeGeo.dispose();
    mountGeo.dispose();
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
      basePlate,
    },
    update,
    dispose,
  };
}
