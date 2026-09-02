import * as THREE from "three";
import type {
  LemelsonMachineVisionControls,
  LemelsonMachineVisionMetrics,
} from "@/physics/lemelsonMachineVisionKernel";

export interface LemelsonMachineVision3DObjects {
  root: THREE.Group;
  conveyorGroup: THREE.Group;
  cameraGroup: THREE.Group;
  lampGroup: THREE.Group;
  diverterGroup: THREE.Group;
  crtMonitorGroup: THREE.Group;
  partMesh: THREE.Mesh;
  scanConeMesh: THREE.Mesh;
  diverterBladeMesh: THREE.Mesh;
  oscilloscopeLine: THREE.Line;
  update: (
    controls: LemelsonMachineVisionControls,
    metrics: LemelsonMachineVisionMetrics,
    simTimeSec: number,
  ) => void;
  dispose: () => void;
}

export function createLemelsonMachineVisionModel(): LemelsonMachineVision3DObjects {
  const root = new THREE.Group();
  root.name = "LemelsonMachineVisionApparatus";

  // Materials
  const metalFrameMaterial = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    metalness: 0.8,
    roughness: 0.3,
  });

  const beltMaterial = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.8,
  });

  const cameraBodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x334155,
    metalness: 0.7,
    roughness: 0.25,
  });

  const lensGlassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x0284c7,
    metalness: 0.1,
    roughness: 0.1,
    transmission: 0.85,
    ior: 1.5,
  });

  const brassSolenoidMaterial = new THREE.MeshStandardMaterial({
    color: 0xb45309,
    metalness: 0.75,
    roughness: 0.3,
  });

  const partPassMaterial = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    metalness: 0.3,
    roughness: 0.4,
  });

  const partFailMaterial = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    metalness: 0.3,
    roughness: 0.4,
  });

  const scanConeMaterial = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.18,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

  const crtBezelMaterial = new THREE.MeshStandardMaterial({
    color: 0x020617,
    metalness: 0.5,
    roughness: 0.5,
  });

  const crtScreenMaterial = new THREE.MeshStandardMaterial({
    color: 0x064e3b,
    emissive: 0x047857,
    emissiveIntensity: 0.4,
    roughness: 0.2,
  });

  // 1. CONVEYOR BED & ROLLERS
  const conveyorGroup = new THREE.Group();
  conveyorGroup.name = "ConveyorSystem";

  // Main conveyor bed (length 3.0 m, width 0.45 m)
  const bedGeo = new THREE.BoxGeometry(3.0, 0.08, 0.45);
  const bedMesh = new THREE.Mesh(bedGeo, metalFrameMaterial);
  bedMesh.position.y = 0.5;
  conveyorGroup.add(bedMesh);

  // Moving belt surface
  const beltGeo = new THREE.BoxGeometry(2.9, 0.02, 0.4);
  const beltMesh = new THREE.Mesh(beltGeo, beltMaterial);
  beltMesh.position.y = 0.55;
  conveyorGroup.add(beltMesh);

  // Guide rails
  const railGeo = new THREE.BoxGeometry(3.0, 0.06, 0.02);
  const leftRail = new THREE.Mesh(railGeo, metalFrameMaterial);
  leftRail.position.set(0, 0.58, 0.22);
  const rightRail = new THREE.Mesh(railGeo, metalFrameMaterial);
  rightRail.position.set(0, 0.58, -0.22);
  conveyorGroup.add(leftRail, rightRail);

  // Support Legs
  const legGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.5, 12);
  for (const x of [-1.3, 0, 1.3]) {
    for (const z of [-0.2, 0.2]) {
      const leg = new THREE.Mesh(legGeo, metalFrameMaterial);
      leg.position.set(x, 0.25, z);
      conveyorGroup.add(leg);
    }
  }
  root.add(conveyorGroup);

  // 2. GANTRY & OVERHEAD VIDICON CAMERA
  const cameraGroup = new THREE.Group();
  cameraGroup.name = "VidiconCameraAssembly";

  // Gantry arch over conveyor at x = 0
  const archColGeo = new THREE.BoxGeometry(0.05, 0.8, 0.05);
  const leftCol = new THREE.Mesh(archColGeo, metalFrameMaterial);
  leftCol.position.set(0, 0.95, 0.26);
  const rightCol = new THREE.Mesh(archColGeo, metalFrameMaterial);
  rightCol.position.set(0, 0.95, -0.26);

  const archBeamGeo = new THREE.BoxGeometry(0.06, 0.05, 0.58);
  const archBeam = new THREE.Mesh(archBeamGeo, metalFrameMaterial);
  archBeam.position.set(0, 1.35, 0);
  cameraGroup.add(leftCol, rightCol, archBeam);

  // Vidicon camera body (cylindrical tube)
  const cameraBodyGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.28, 24);
  const cameraBodyMesh = new THREE.Mesh(cameraBodyGeo, cameraBodyMaterial);
  cameraBodyMesh.position.set(0, 1.15, 0);
  cameraGroup.add(cameraBodyMesh);

  // Lens barrel and optics
  const lensBarrelGeo = new THREE.CylinderGeometry(0.045, 0.055, 0.1, 24);
  const lensBarrelMesh = new THREE.Mesh(lensBarrelGeo, metalFrameMaterial);
  lensBarrelMesh.position.set(0, 0.96, 0);
  cameraGroup.add(lensBarrelMesh);

  const lensGlassGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.01, 24);
  const lensGlassMesh = new THREE.Mesh(lensGlassGeo, lensGlassMaterial);
  lensGlassMesh.position.set(0, 0.91, 0);
  cameraGroup.add(lensGlassMesh);

  // Optical scan beam cone
  const coneGeo = new THREE.ConeGeometry(0.18, 0.35, 24, 1, true);
  const scanConeMesh = new THREE.Mesh(coneGeo, scanConeMaterial);
  scanConeMesh.position.set(0, 0.73, 0);
  scanConeMesh.rotation.x = Math.PI;
  cameraGroup.add(scanConeMesh);

  root.add(cameraGroup);

  // 3. INSPECTION FLOODLIGHTS
  const lampGroup = new THREE.Group();
  lampGroup.name = "InspectionLighting";
  const lampHousingGeo = new THREE.ConeGeometry(0.06, 0.1, 16);
  const lampMaterial = new THREE.MeshStandardMaterial({
    color: 0xfef08a,
    emissive: 0xfbbf24,
    emissiveIntensity: 0.8,
  });

  const lamp1 = new THREE.Mesh(lampHousingGeo, cameraBodyMaterial);
  lamp1.position.set(0, 1.2, 0.18);
  lamp1.rotation.x = -Math.PI / 6;
  const bulb1 = new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 12), lampMaterial);
  bulb1.position.set(0, 1.15, 0.16);

  const lamp2 = new THREE.Mesh(lampHousingGeo, cameraBodyMaterial);
  lamp2.position.set(0, 1.2, -0.18);
  lamp2.rotation.x = Math.PI / 6;
  const bulb2 = new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 12), lampMaterial);
  bulb2.position.set(0, 1.15, -0.16);

  lampGroup.add(lamp1, bulb1, lamp2, bulb2);
  root.add(lampGroup);

  // 4. SOLENOID DEFECT EJECTION DIVERTER (at x = 0.6 m downstream)
  const diverterGroup = new THREE.Group();
  diverterGroup.name = "SolenoidDiverterGate";
  diverterGroup.position.set(0.6, 0.55, 0.22);

  // Solenoid coil box
  const solenoidBoxGeo = new THREE.BoxGeometry(0.12, 0.14, 0.12);
  const solenoidBoxMesh = new THREE.Mesh(solenoidBoxGeo, brassSolenoidMaterial);
  solenoidBoxMesh.position.set(0, 0.12, 0);
  diverterGroup.add(solenoidBoxMesh);

  // Solenoid plunger arm & diverter blade
  const bladeGeo = new THREE.BoxGeometry(0.02, 0.12, 0.35);
  const diverterBladeMesh = new THREE.Mesh(bladeGeo, metalFrameMaterial);
  diverterBladeMesh.position.set(0, 0.08, -0.18);
  diverterGroup.add(diverterBladeMesh);

  root.add(diverterGroup);

  // 5. CONSOLE CRT OSCILLOSCOPE MONITOR
  const crtMonitorGroup = new THREE.Group();
  crtMonitorGroup.name = "OscilloscopeMonitor";
  crtMonitorGroup.position.set(-0.8, 0.9, -0.4);
  crtMonitorGroup.rotation.y = Math.PI / 5;

  const crtBoxGeo = new THREE.BoxGeometry(0.38, 0.32, 0.28);
  const crtBoxMesh = new THREE.Mesh(crtBoxGeo, crtBezelMaterial);
  crtMonitorGroup.add(crtBoxMesh);

  const crtScreenGeo = new THREE.PlaneGeometry(0.3, 0.22);
  const crtScreenMesh = new THREE.Mesh(crtScreenGeo, crtScreenMaterial);
  crtScreenMesh.position.z = 0.141;
  crtMonitorGroup.add(crtScreenMesh);

  // Waveform line on CRT screen
  const wavePoints: THREE.Vector3[] = [];
  const numPts = 32;
  for (let i = 0; i < numPts; i++) {
    const u = (i / (numPts - 1)) * 0.26 - 0.13;
    wavePoints.push(new THREE.Vector3(u, 0, 0.142));
  }
  const waveGeo = new THREE.BufferGeometry().setFromPoints(wavePoints);
  const waveMat = new THREE.LineBasicMaterial({ color: 0x34d399, linewidth: 2 });
  const oscilloscopeLine = new THREE.Line(waveGeo, waveMat);
  crtMonitorGroup.add(oscilloscopeLine);

  root.add(crtMonitorGroup);

  // 6. WORKPIECE PART ON CONVEYOR
  const partGeo = new THREE.BoxGeometry(0.08, 0.06, 0.082);
  const partMesh = new THREE.Mesh(partGeo, partPassMaterial);
  partMesh.position.set(0, 0.59, 0);
  root.add(partMesh);

  return {
    root,
    conveyorGroup,
    cameraGroup,
    lampGroup,
    diverterGroup,
    crtMonitorGroup,
    partMesh,
    scanConeMesh,
    diverterBladeMesh,
    oscilloscopeLine,

    update(
      controls: LemelsonMachineVisionControls,
      metrics: LemelsonMachineVisionMetrics,
      simTimeSec: number,
    ) {
      // Animate conveyor workpiece motion
      const speed = controls.conveyorSpeedMPerS;
      const cyclePos = ((simTimeSec * speed) % 2.6) - 1.3;
      partMesh.position.x = cyclePos;

      // Update part geometry based on actual width
      partMesh.scale.set(1.0, 1.0, controls.actualPartWidthM / 0.08);

      // Color part green if accepted, red if defective
      if (metrics.isDefective) {
        partMesh.material = partFailMaterial;
      } else {
        partMesh.material = partPassMaterial;
      }

      // Animate solenoid diverter gate when defective part reaches x ≈ 0.6 m
      const nearDiverter = Math.abs(cyclePos - 0.6) < 0.25;
      if (metrics.isDefective && nearDiverter) {
        diverterBladeMesh.rotation.y = THREE.MathUtils.lerp(
          diverterBladeMesh.rotation.y,
          Math.PI / 4,
          0.2,
        );
      } else {
        diverterBladeMesh.rotation.y = THREE.MathUtils.lerp(diverterBladeMesh.rotation.y, 0, 0.1);
      }

      // Optical scan beam sweep wobble
      const sweepPhase = Math.sin(simTimeSec * 40) * 0.08;
      scanConeMesh.rotation.z = sweepPhase;

      // Update oscilloscope CRT waveform
      const positions = waveGeo.attributes.position;
      const arr = positions.array as Float32Array;
      for (let i = 0; i < numPts; i++) {
        const u = (i / (numPts - 1)) * 0.26 - 0.13;
        let y = -0.04;
        const partRadius = (controls.actualPartWidthM / 2) * 0.8;
        if (Math.abs(u) < partRadius) {
          y = 0.04 * (metrics.videoPeakVoltageV / 1.2);
        }
        arr[i * 3 + 1] = y;
      }
      positions.needsUpdate = true;
    },

    dispose() {
      metalFrameMaterial.dispose();
      beltMaterial.dispose();
      cameraBodyMaterial.dispose();
      lensGlassMaterial.dispose();
      brassSolenoidMaterial.dispose();
      partPassMaterial.dispose();
      partFailMaterial.dispose();
      scanConeMaterial.dispose();
      crtBezelMaterial.dispose();
      crtScreenMaterial.dispose();
      waveMat.dispose();
      bedGeo.dispose();
      beltGeo.dispose();
      railGeo.dispose();
      legGeo.dispose();
      archColGeo.dispose();
      archBeamGeo.dispose();
      cameraBodyGeo.dispose();
      lensBarrelGeo.dispose();
      lensGlassGeo.dispose();
      coneGeo.dispose();
      lampHousingGeo.dispose();
      solenoidBoxGeo.dispose();
      bladeGeo.dispose();
      crtBoxGeo.dispose();
      crtScreenGeo.dispose();
      waveGeo.dispose();
      partGeo.dispose();
    },
  };
}
