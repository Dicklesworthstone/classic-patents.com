import * as THREE from "three";
import { type BoyleSmithCcdControls, stepBoyleSmithCcd } from "@/physics/catalogKernels";

export interface BoyleSmithCcdModelNodes {
  group: THREE.Group;
  siliconSubstrate: THREE.Mesh;
  oxideLayer: THREE.Mesh;
  gateArray: THREE.Group;
  electronPackets: THREE.Group;
  dipPackage: THREE.Mesh;
  leadPins: THREE.Group;
}

export function createBoyleSmithCcdModel(): {
  nodes: BoyleSmithCcdModelNodes;
  update: (controls: BoyleSmithCcdControls, timeSec: number) => void;
  dispose: () => void;
} {
  const group = new THREE.Group();
  group.name = "boyle-smith-ccd-root";

  // Materials
  const ceramicMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.4,
    metalness: 0.2,
  });

  const siliconMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.2,
    metalness: 0.8,
  });

  const oxideMat = new THREE.MeshPhysicalMaterial({
    color: 0x38bdf8,
    transmission: 0.7,
    roughness: 0.1,
    metalness: 0.1,
    transparent: true,
    opacity: 0.6,
  });

  const gateMatPhi1 = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    metalness: 0.7,
    roughness: 0.3,
  });

  const gateMatPhi2 = new THREE.MeshStandardMaterial({
    color: 0x34d399,
    metalness: 0.7,
    roughness: 0.3,
  });

  const gateMatPhi3 = new THREE.MeshStandardMaterial({
    color: 0xf43f5e,
    metalness: 0.7,
    roughness: 0.3,
  });

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    metalness: 0.9,
    roughness: 0.2,
  });

  const electronMat = new THREE.MeshStandardMaterial({
    color: 0x60a5fa,
    emissive: 0x3b82f6,
    emissiveIntensity: 1.5,
    roughness: 0.2,
    metalness: 0.1,
  });

  // 1. Ceramic DIP Package Body
  const dipPackage = new THREE.Mesh(new THREE.BoxGeometry(16, 1.2, 8), ceramicMat);
  dipPackage.position.set(0, -1.0, 0);
  group.add(dipPackage);

  // 2. Gold Lead Pins
  const leadPins = new THREE.Group();
  const numPins = 8;
  const pinGeo = new THREE.BoxGeometry(0.3, 1.8, 0.2);
  for (let i = 0; i < numPins; i++) {
    const px = -6 + i * 1.7;
    const pinL = new THREE.Mesh(pinGeo, goldMat);
    pinL.position.set(px, -1.6, 4.0);
    leadPins.add(pinL);

    const pinR = new THREE.Mesh(pinGeo, goldMat);
    pinR.position.set(px, -1.6, -4.0);
    leadPins.add(pinR);
  }
  group.add(leadPins);

  // 3. Silicon Die Substrate
  const siliconSubstrate = new THREE.Mesh(new THREE.BoxGeometry(11, 0.6, 5), siliconMat);
  siliconSubstrate.position.set(0, -0.1, 0);
  group.add(siliconSubstrate);

  // 4. SiO2 Thin Oxide Layer
  const oxideLayer = new THREE.Mesh(new THREE.BoxGeometry(10.5, 0.12, 4.6), oxideMat);
  oxideLayer.position.set(0, 0.26, 0);
  group.add(oxideLayer);

  // 5. Array of 3-Phase Gate Electrodes
  const gateArray = new THREE.Group();
  const numGates = 18;
  const gateWidth = 0.5;
  const gateHeight = 0.18;
  const gateDepth = 3.6;
  const gateMeshes: THREE.Mesh[] = [];

  const gateGeom = new THREE.BoxGeometry(gateWidth, gateHeight, gateDepth);

  for (let i = 0; i < numGates; i++) {
    const phase = i % 3;
    let mat = gateMatPhi1;
    if (phase === 1) mat = gateMatPhi2;
    if (phase === 2) mat = gateMatPhi3;

    const gx = -4.8 + i * (gateWidth + 0.08);
    const gateMesh = new THREE.Mesh(gateGeom, mat.clone());
    gateMesh.position.set(gx, 0.4, 0);
    gateArray.add(gateMesh);
    gateMeshes.push(gateMesh);
  }
  group.add(gateArray);

  // 6. Electron Charge Packets
  const electronPackets = new THREE.Group();
  const packetGeo = new THREE.SphereGeometry(0.24, 16, 16);
  const packetMeshes: THREE.Mesh[] = [];
  const numPackets = 6;

  for (let i = 0; i < numPackets; i++) {
    const pMesh = new THREE.Mesh(packetGeo, electronMat);
    pMesh.position.set(-4.0 + i * 1.8, 0.05, 0);
    electronPackets.add(pMesh);
    packetMeshes.push(pMesh);
  }
  group.add(electronPackets);

  // Update loop
  const update = (controls: BoyleSmithCcdControls, timeSec: number) => {
    const metrics = stepBoyleSmithCcd(controls);
    const fClock = controls.clockFrequencyMhz ?? 5.0;

    // Clock phase progression
    const clockPhase = (timeSec * fClock * 1.5) % (Math.PI * 2);

    // Gate activation shimmers
    for (let i = 0; i < numGates; i++) {
      const phase = i % 3;
      const phaseAngle = clockPhase - (phase * 2 * Math.PI) / 3;
      const vNorm = 0.5 * (1 + Math.sin(phaseAngle));
      const gMesh = gateMeshes[i];

      // Elevation and brightness
      gMesh.position.y = 0.4 + vNorm * 0.08;
      (gMesh.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(
        phase === 0 ? 0x0284c7 : phase === 1 ? 0x059669 : 0xe11d48,
      );
      (gMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = vNorm * 0.8;
    }

    // Translate electron charge packets smoothly along channel
    const channelLength = 9.0;
    const stageWidth = (gateWidth + 0.08) * 3;

    for (let i = 0; i < numPackets; i++) {
      const pMesh = packetMeshes[i];
      const baseOffset =
        (i * stageWidth + (clockPhase / (Math.PI * 2)) * stageWidth) % channelLength;
      pMesh.position.x = -4.5 + baseOffset;

      // Scale packet size according to collected photoelectrons
      const scale = Math.max(0.5, Math.min(1.6, metrics.totalCollectedElectrons / 50000));
      pMesh.scale.set(scale, scale, scale);
    }
  };

  const dispose = () => {
    ceramicMat.dispose();
    siliconMat.dispose();
    oxideMat.dispose();
    gateMatPhi1.dispose();
    gateMatPhi2.dispose();
    gateMatPhi3.dispose();
    goldMat.dispose();
    electronMat.dispose();
    gateGeom.dispose();
    packetGeo.dispose();
    pinGeo.dispose();
  };

  return {
    nodes: {
      group,
      siliconSubstrate,
      oxideLayer,
      gateArray,
      electronPackets,
      dipPackage,
      leadPins,
    },
    update,
    dispose,
  };
}
