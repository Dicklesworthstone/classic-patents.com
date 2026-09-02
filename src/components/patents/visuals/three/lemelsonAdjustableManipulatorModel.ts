import * as THREE from "three";
import type { LemelsonManipulatorState } from "@/physics/lemelsonAdjustableManipulatorKernel";

export interface LemelsonAdjustableManipulatorModel {
  root: THREE.Group;
  updateState: (state: LemelsonManipulatorState) => void;
  dispose: () => void;
}

export function buildLemelsonAdjustableManipulatorModel(): LemelsonAdjustableManipulatorModel {
  const root = new THREE.Group();
  root.name = "US 3,260,375 Lemelson Adjustable Manipulator 3D Exhibit";

  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const geometry = <T extends THREE.BufferGeometry>(value: T): T => {
    geometries.push(value);
    return value;
  };
  const material = <T extends THREE.Material>(value: T): T => {
    materials.push(value);
    return value;
  };

  // Materials
  const trackSteel = material(
    new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.85, roughness: 0.25 }),
  );
  const carriagePaint = material(
    new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.6, roughness: 0.3 }),
  );
  const outerMastSteel = material(
    new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.28 }),
  );
  const innerMastSteel = material(
    new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.82, roughness: 0.22 }),
  );
  const turntableBrass = material(
    new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.75, roughness: 0.35 }),
  );
  const wristPaint = material(
    new THREE.MeshStandardMaterial({ color: 0x059669, metalness: 0.55, roughness: 0.25 }),
  );
  const jawSteel = material(
    new THREE.MeshStandardMaterial({ color: 0x7c3aed, metalness: 0.7, roughness: 0.2 }),
  );
  const stop1Material = material(
    new THREE.MeshStandardMaterial({ color: 0xf43f5e, emissive: 0x881337, emissiveIntensity: 0.4 }),
  );
  const stop2Material = material(
    new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0x7c2d12, emissiveIntensity: 0.4 }),
  );
  const switchArmMaterial = material(
    new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.6, roughness: 0.2 }),
  );

  // 1. Static Overhead Trackway (21)
  const trackGroup = new THREE.Group();
  const iBeamTop = new THREE.Mesh(geometry(new THREE.BoxGeometry(7.0, 0.08, 0.4)), trackSteel);
  iBeamTop.position.set(0, 3.0, 0);
  const iBeamWeb = new THREE.Mesh(geometry(new THREE.BoxGeometry(7.0, 0.32, 0.06)), trackSteel);
  iBeamWeb.position.set(0, 2.82, 0);
  const iBeamBottom = new THREE.Mesh(geometry(new THREE.BoxGeometry(7.0, 0.08, 0.4)), trackSteel);
  iBeamBottom.position.set(0, 2.64, 0);
  trackGroup.add(iBeamTop, iBeamWeb, iBeamBottom);

  // Power Bus Bars (28)
  const busBar1 = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.015, 0.015, 7.0, 8)),
    turntableBrass,
  );
  busBar1.rotation.z = Math.PI / 2;
  busBar1.position.set(0, 2.75, 0.18);
  const busBar2 = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.015, 0.015, 7.0, 8)),
    turntableBrass,
  );
  busBar2.rotation.z = Math.PI / 2;
  busBar2.position.set(0, 2.75, -0.18);
  trackGroup.add(busBar1, busBar2);
  root.add(trackGroup);

  // 2. Movable Carriage (22)
  const carriageGroup = new THREE.Group();
  carriageGroup.position.set(0, 2.5, 0);

  const carriageBody = new THREE.Mesh(
    geometry(new THREE.BoxGeometry(0.9, 0.24, 0.55)),
    carriagePaint,
  );
  carriageGroup.add(carriageBody);

  // Wheels (24)
  for (const dx of [-0.35, 0.35]) {
    for (const dz of [-0.22, 0.22]) {
      const wheel = new THREE.Mesh(
        geometry(new THREE.CylinderGeometry(0.06, 0.06, 0.04, 16)),
        trackSteel,
      );
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(dx, 0.14, dz);
      carriageGroup.add(wheel);
    }
  }

  // Motor Mx
  const motorMx = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.08, 0.08, 0.22, 16)),
    outerMastSteel,
  );
  motorMx.rotation.z = Math.PI / 2;
  motorMx.position.set(-0.35, 0.0, 0.32);
  carriageGroup.add(motorMx);

  // Outer Guide Mast (23)
  const outerMast = new THREE.Mesh(
    geometry(new THREE.BoxGeometry(0.32, 1.2, 0.32)),
    outerMastSteel,
  );
  outerMast.position.set(0, -0.65, 0);
  carriageGroup.add(outerMast);

  // Hoist Motor Mz
  const motorMz = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.07, 0.07, 0.2, 16)),
    innerMastSteel,
  );
  motorMz.position.set(0.22, -0.3, 0);
  carriageGroup.add(motorMz);

  // 3. Inner Telescoping Mast (23')
  const innerMastGroup = new THREE.Group();
  innerMastGroup.position.set(0, -0.65, 0);

  const innerMast = new THREE.Mesh(
    geometry(new THREE.BoxGeometry(0.24, 1.2, 0.24)),
    innerMastSteel,
  );
  innerMast.position.set(0, -0.5, 0);
  innerMastGroup.add(innerMast);

  // 4. Turntable Assembly (43' & 45)
  const turntableGroup = new THREE.Group();
  turntableGroup.position.set(0, -1.1, 0);

  const turntablePlate = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.32, 0.32, 0.06, 32)),
    turntableBrass,
  );
  turntableGroup.add(turntablePlate);

  // Concentric Channel (45)
  const channelRing = new THREE.Mesh(
    geometry(new THREE.RingGeometry(0.18, 0.24, 32)),
    outerMastSteel,
  );
  channelRing.rotation.x = -Math.PI / 2;
  channelRing.position.set(0, 0.031, 0);
  turntableGroup.add(channelRing);

  // Stop Pins 1 and 2
  const stopPin1 = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.02, 0.02, 0.08, 12)),
    stop1Material,
  );
  const stopPin2 = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.02, 0.02, 0.08, 12)),
    stop2Material,
  );
  turntableGroup.add(stopPin1, stopPin2);

  // Azimuth Rotating Assembly (Column 23'a)
  const azimuthGroup = new THREE.Group();
  azimuthGroup.position.set(0, -0.05, 0);

  const rotatingColumn = new THREE.Mesh(
    geometry(new THREE.BoxGeometry(0.2, 0.5, 0.2)),
    outerMastSteel,
  );
  rotatingColumn.position.set(0, -0.25, 0);
  azimuthGroup.add(rotatingColumn);

  // Limit Switch Arm (54')
  const switchArm = new THREE.Mesh(
    geometry(new THREE.BoxGeometry(0.03, 0.02, 0.18)),
    switchArmMaterial,
  );
  switchArm.position.set(0, 0.05, 0.16);
  azimuthGroup.add(switchArm);

  // 5. Wrist Joint (50) & Yoke (51)
  const wristYokeGroup = new THREE.Group();
  wristYokeGroup.position.set(0, -0.5, 0);

  const yokeFork1 = new THREE.Mesh(
    geometry(new THREE.BoxGeometry(0.04, 0.18, 0.18)),
    innerMastSteel,
  );
  yokeFork1.position.set(-0.11, -0.06, 0);
  const yokeFork2 = new THREE.Mesh(
    geometry(new THREE.BoxGeometry(0.04, 0.18, 0.18)),
    innerMastSteel,
  );
  yokeFork2.position.set(0.11, -0.06, 0);
  wristYokeGroup.add(yokeFork1, yokeFork2);

  // Pivot Axle Pin (60)
  const pivotAxle = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.03, 0.03, 0.28, 16)),
    trackSteel,
  );
  pivotAxle.rotation.z = Math.PI / 2;
  pivotAxle.position.set(0, -0.1, 0);
  wristYokeGroup.add(pivotAxle);

  // 6. Pitch Articulated Arm (35')
  const pitchGroup = new THREE.Group();
  pitchGroup.position.set(0, -0.1, 0);

  const bevelGearSector = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.1, 0.1, 0.06, 16, 1, false, 0, Math.PI * 1.33)),
    turntableBrass,
  );
  bevelGearSector.rotation.z = Math.PI / 2;
  pitchGroup.add(bevelGearSector);

  const forearm = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.05, 0.04, 0.7, 16)),
    wristPaint,
  );
  forearm.position.set(0, -0.38, 0);
  pitchGroup.add(forearm);

  // 7. Gripper Assembly (80 & 87)
  const gripperGroup = new THREE.Group();
  gripperGroup.position.set(0, -0.75, 0);

  const gripperBase = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.14, 0.08, 0.1)), jawSteel);
  gripperGroup.add(gripperBase);

  const jaw1 = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.03, 0.18, 0.04)), jawSteel);
  jaw1.position.set(-0.06, -0.1, 0);
  const jaw2 = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.03, 0.18, 0.04)), jawSteel);
  jaw2.position.set(0.06, -0.1, 0);
  gripperGroup.add(jaw1, jaw2);

  pitchGroup.add(gripperGroup);
  wristYokeGroup.add(pitchGroup);
  azimuthGroup.add(wristYokeGroup);
  turntableGroup.add(azimuthGroup);
  innerMastGroup.add(turntableGroup);
  carriageGroup.add(innerMastGroup);
  root.add(carriageGroup);

  const updateState = (state: LemelsonManipulatorState) => {
    const { controls, displayPose } = state;

    // Carriage position along track
    carriageGroup.position.x = controls.carriagePosition * 2.2;

    // Mast vertical descent
    innerMastGroup.position.y = -0.65 - controls.columnElevation * 0.75;

    // Stop pin radial positions on plate
    const stopRadius = 0.21;
    const s1Angle = controls.stop1Azimuth * Math.PI;
    const s2Angle = controls.stop2Azimuth * Math.PI;
    stopPin1.position.set(Math.cos(s1Angle) * stopRadius, 0.05, Math.sin(s1Angle) * stopRadius);
    stopPin2.position.set(Math.cos(s2Angle) * stopRadius, 0.05, Math.sin(s2Angle) * stopRadius);

    // Turntable azimuth rotation
    azimuthGroup.rotation.y = displayPose.azimuthRad;

    // Wrist pitch rotation
    pitchGroup.rotation.x = displayPose.pivotRad;

    // Gripper jaw opening
    const jawOpen = displayPose.jawOpeningFraction * 0.04 + 0.02;
    jaw1.position.x = -jawOpen;
    jaw2.position.x = jawOpen;

    // Highlight stop pins if tripped
    if (state.sequencer.stop1Tripped) {
      stop1Material.emissiveIntensity = 1.0;
    } else {
      stop1Material.emissiveIntensity = 0.3;
    }
    if (state.sequencer.stop2Tripped) {
      stop2Material.emissiveIntensity = 1.0;
    } else {
      stop2Material.emissiveIntensity = 0.3;
    }
  };

  const dispose = () => {
    for (const g of geometries) g.dispose();
    for (const m of materials) m.dispose();
  };

  return { root, updateState, dispose };
}
