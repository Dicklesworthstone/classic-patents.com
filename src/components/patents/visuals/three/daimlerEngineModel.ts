/**
 * daimlerEngineModel.ts
 *
 * Museum-Grade Procedural 3D Model for Gottlieb Daimler's 1886 High-Speed Four-Stroke Engine
 * (US Patent 361,931 - "Standuhr" / Grandfather Clock Engine).
 *
 * Reconstructs the historic Cannstatt pioneer engine that powered the first automobile, motorcycle, and boat:
 * 1. Sealed cast-iron crankcase with integrated mounting feet and oil sump.
 * 2. Twin enclosed counterbalanced disc flywheels with integral crankpin and curved surface cam groove.
 * 3. Cam-actuated exhaust valve pushrod and rocker arm driven directly from the flywheel cam track.
 * 4. Vertical water-cooled cylinder with cast jacket, water banjos, and ribbed cylinder head.
 * 5. Trunk piston with compression rings, wrist pin, and forged steel H-beam connecting rod.
 * 6. Incandescent platinum hot-tube igniter with external brass burner chimney / torch lamp.
 * 7. Automatic spring-loaded intake poppet valve, float carburetor, and output drive pulley.
 * 8. Real-time kinematic articulation: crankshaft, connecting rod, piston, valve pushrod, and combustion flash.
 */

import * as THREE from "three";
import { fourStrokeIndexFromRad, stepDaimlerEngine } from "@/physics/catalogKernels";
import { heatFrames, sampleHeatAt } from "@/physics/genericWasm";

export interface DaimlerEngineModel {
  rootGroup: THREE.Group;
  crankshaftGroup: THREE.Group;
  flywheelGroup: THREE.Group;
  pistonGroup: THREE.Group;
  conRodGroup: THREE.Group;
  exhaustPushrod: THREE.Group;
  exhaustRocker: THREE.Group;
  exhaustValve: THREE.Group;
  intakeValve: THREE.Group;
  hotTubeMesh: THREE.Mesh;
  burnerFlame: THREE.Mesh;
  combustionFlame: THREE.Mesh;
  casingCutaway: THREE.Mesh;
  materials: {
    castIron: THREE.MeshStandardMaterial;
    darkCastIron: THREE.MeshStandardMaterial;
    polishedSteel: THREE.MeshStandardMaterial;
    brass: THREE.MeshStandardMaterial;
    bronze: THREE.MeshStandardMaterial;
    copper: THREE.MeshStandardMaterial;
    hotTubeMat: THREE.MeshStandardMaterial;
    flameMat: THREE.MeshStandardMaterial;
  };
  dispose: () => void;
}

export function buildDaimlerEngineModel(): DaimlerEngineModel {
  const rootGroup = new THREE.Group();
  const materialsToDispose: THREE.Material[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];
  const texturesToDispose: THREE.Texture[] = [];

  // --- 1. MATERIALS ---
  const castIron = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.55,
    metalness: 0.8,
  });
  materialsToDispose.push(castIron);

  const darkCastIron = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.7,
    metalness: 0.65,
  });
  materialsToDispose.push(darkCastIron);

  const polishedSteel = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.15,
    metalness: 0.95,
  });
  materialsToDispose.push(polishedSteel);

  const brass = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.25,
    metalness: 0.88,
  });
  materialsToDispose.push(brass);

  const bronze = new THREE.MeshStandardMaterial({
    color: 0xb45309,
    roughness: 0.3,
    metalness: 0.85,
  });
  materialsToDispose.push(bronze);

  const copper = new THREE.MeshStandardMaterial({
    color: 0xb91c1c,
    roughness: 0.35,
    metalness: 0.85,
  });
  materialsToDispose.push(copper);

  const hotTubeMat = new THREE.MeshStandardMaterial({
    color: 0xffedd5,
    emissive: 0xf97316,
    emissiveIntensity: 2.8,
    roughness: 0.2,
  });
  materialsToDispose.push(hotTubeMat);

  const flameMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    emissive: 0xf59e0b,
    emissiveIntensity: 3.5,
    transparent: true,
    opacity: 0.85,
  });
  materialsToDispose.push(flameMat);

  // --- 2. ENCLOSED CRANKCASE HOUSING & MOUNTING FEET ---
  const crankcaseGroup = new THREE.Group();
  rootGroup.add(crankcaseGroup);

  // Cylindrical Crankcase Barrel
  const caseGeo = new THREE.CylinderGeometry(1.35, 1.35, 1.5, 32, 1, false, 0, Math.PI * 1.45);
  geometriesToDispose.push(caseGeo);
  const casingCutaway = new THREE.Mesh(caseGeo, castIron);
  casingCutaway.rotation.z = Math.PI / 2;
  casingCutaway.position.set(0, -0.65, 0);
  casingCutaway.castShadow = true;
  crankcaseGroup.add(casingCutaway);

  // Crankcase side covers
  for (const sign of [-1, 1]) {
    const endCoverGeo = new THREE.CylinderGeometry(1.4, 1.4, 0.12, 32);
    geometriesToDispose.push(endCoverGeo);
    const endCover = new THREE.Mesh(endCoverGeo, darkCastIron);
    endCover.rotation.x = Math.PI / 2;
    endCover.position.set(0, -0.65, sign * 0.8);
    endCover.castShadow = true;
    crankcaseGroup.add(endCover);
  }

  // 4 Integral Cast Mounting Feet
  for (const fx of [-1, 1]) {
    for (const fz of [-1, 1]) {
      const footGeo = new THREE.BoxGeometry(0.4, 0.25, 0.45);
      geometriesToDispose.push(footGeo);
      const foot = new THREE.Mesh(footGeo, darkCastIron);
      foot.position.set(fx * 1.1, -1.9, fz * 0.75);
      foot.receiveShadow = true;
      crankcaseGroup.add(foot);

      // Anchor bolt
      const boltGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.15, 6);
      geometriesToDispose.push(boltGeo);
      const bolt = new THREE.Mesh(boltGeo, polishedSteel);
      bolt.position.set(fx * 1.1, -1.75, fz * 0.75);
      crankcaseGroup.add(bolt);
    }
  }

  // --- 3. VERTICAL WATER-COOLED CYLINDER & HEAD ---
  const cylinderGroup = new THREE.Group();
  cylinderGroup.position.set(0, 1.05, 0);
  rootGroup.add(cylinderGroup);

  // Outer Water Jacket Casting
  const jacketGeo = new THREE.CylinderGeometry(0.68, 0.68, 2.2, 32);
  geometriesToDispose.push(jacketGeo);
  const jacket = new THREE.Mesh(jacketGeo, castIron);
  jacket.castShadow = true;
  cylinderGroup.add(jacket);

  // Flanged Base Ring
  const flangeGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.15, 32);
  geometriesToDispose.push(flangeGeo);
  const flange = new THREE.Mesh(flangeGeo, darkCastIron);
  flange.position.y = -1.0;
  cylinderGroup.add(flange);

  // Copper Cooling Water Inlet & Outlet Pipes
  const waterInletGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.6, 12);
  geometriesToDispose.push(waterInletGeo);
  const waterInlet = new THREE.Mesh(waterInletGeo, copper);
  waterInlet.rotation.z = Math.PI / 2;
  waterInlet.position.set(-0.7, -0.6, 0);
  cylinderGroup.add(waterInlet);

  const waterOutletGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.6, 12);
  geometriesToDispose.push(waterOutletGeo);
  const waterOutlet = new THREE.Mesh(waterOutletGeo, copper);
  waterOutlet.rotation.z = Math.PI / 2;
  waterOutlet.position.set(-0.7, 0.6, 0);
  cylinderGroup.add(waterOutlet);

  // Cylinder Head Casting with Cooling Fins
  const headGeo = new THREE.BoxGeometry(1.3, 0.7, 1.3);
  geometriesToDispose.push(headGeo);
  const headMesh = new THREE.Mesh(headGeo, castIron);
  headMesh.position.y = 1.45;
  headMesh.castShadow = true;
  cylinderGroup.add(headMesh);

  // --- 4. TWIN ENCLOSED FLYWHEELS & CRANKSHAFT ---
  const crankshaftGroup = new THREE.Group();
  crankshaftGroup.position.set(0, -0.65, 0);
  rootGroup.add(crankshaftGroup);

  const flywheelGroup = new THREE.Group();
  crankshaftGroup.add(flywheelGroup);

  // Twin Counterbalanced Disc Flywheels (US Patent 361,931)
  for (const sign of [-1, 1]) {
    const discGeo = new THREE.CylinderGeometry(1.05, 1.05, 0.22, 32);
    geometriesToDispose.push(discGeo);
    const disc = new THREE.Mesh(discGeo, castIron);
    disc.rotation.x = Math.PI / 2;
    disc.position.z = sign * 0.48;
    disc.castShadow = true;
    flywheelGroup.add(disc);

    // Counterweight crescent segment
    const cweightGeo = new THREE.CylinderGeometry(1.02, 1.02, 0.23, 16, 1, false, 0, Math.PI);
    geometriesToDispose.push(cweightGeo);
    const cweight = new THREE.Mesh(cweightGeo, darkCastIron);
    cweight.rotation.x = Math.PI / 2;
    cweight.rotation.y = Math.PI / 2;
    cweight.position.set(0, -0.1, sign * 0.48);
    flywheelGroup.add(cweight);
  }

  // Curved Face Cam Groove on flywheel rim (Daimler's cam valve drive)
  const camGrooveGeo = new THREE.TorusGeometry(1.06, 0.04, 8, 32);
  geometriesToDispose.push(camGrooveGeo);
  const camGroove = new THREE.Mesh(camGrooveGeo, polishedSteel);
  camGroove.rotation.x = Math.PI / 2;
  camGroove.position.z = 0.59;
  flywheelGroup.add(camGroove);

  // Crankpin connecting the two flywheels
  const crankpinGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.96, 16);
  geometriesToDispose.push(crankpinGeo);
  const crankpin = new THREE.Mesh(crankpinGeo, polishedSteel);
  crankpin.rotation.x = Math.PI / 2;
  crankpin.position.set(0.42, 0, 0);
  crankpin.castShadow = true;
  flywheelGroup.add(crankpin);

  // Main Output Drive Shafts & Pulley
  const mainShaftGeo = new THREE.CylinderGeometry(0.12, 0.12, 2.6, 16);
  geometriesToDispose.push(mainShaftGeo);
  const mainShaft = new THREE.Mesh(mainShaftGeo, polishedSteel);
  mainShaft.rotation.x = Math.PI / 2;
  crankshaftGroup.add(mainShaft);

  const drivePulleyGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.28, 24);
  geometriesToDispose.push(drivePulleyGeo);
  const drivePulley = new THREE.Mesh(drivePulleyGeo, castIron);
  drivePulley.rotation.x = Math.PI / 2;
  drivePulley.position.z = -1.15;
  drivePulley.castShadow = true;
  crankshaftGroup.add(drivePulley);

  // --- 5. RECIPROCATING TRUNK PISTON & CONNECTING ROD ---
  const pistonGroup = new THREE.Group();
  pistonGroup.position.set(0, 1.0, 0);
  rootGroup.add(pistonGroup);

  const pistonGeo = new THREE.CylinderGeometry(0.54, 0.54, 0.75, 24);
  geometriesToDispose.push(pistonGeo);
  const piston = new THREE.Mesh(pistonGeo, polishedSteel);
  piston.castShadow = true;
  pistonGroup.add(piston);

  // Piston compression rings
  for (let r = 0; r < 3; r++) {
    const ringGeo = new THREE.TorusGeometry(0.545, 0.015, 6, 24);
    geometriesToDispose.push(ringGeo);
    const ring = new THREE.Mesh(ringGeo, darkCastIron);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.22 - r * 0.08;
    pistonGroup.add(ring);
  }

  // Connecting Rod Assembly (wrist pin to crankpin)
  const conRodGroup = new THREE.Group();
  rootGroup.add(conRodGroup);

  const conRodBeamGeo = new THREE.CylinderGeometry(0.065, 0.065, 1.7, 12);
  geometriesToDispose.push(conRodBeamGeo);
  const conRodBeam = new THREE.Mesh(conRodBeamGeo, bronze);
  conRodBeam.position.y = -0.85;
  conRodBeam.castShadow = true;
  conRodGroup.add(conRodBeam);

  // Big-end split journal bearing
  const bigEndGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.28, 16);
  geometriesToDispose.push(bigEndGeo);
  const bigEnd = new THREE.Mesh(bigEndGeo, brass);
  bigEnd.rotation.x = Math.PI / 2;
  bigEnd.position.y = -1.7;
  conRodGroup.add(bigEnd);

  // --- 6. HOT-TUBE IGNITER & TORCH BURNER CHIMNEY ---
  const igniterGroup = new THREE.Group();
  igniterGroup.position.set(0.72, 2.5, 0);
  rootGroup.add(igniterGroup);

  // Glowing Platinum Hot-Tube (Claim 1)
  const hotTubeGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.45, 12);
  geometriesToDispose.push(hotTubeGeo);
  const hotTubeMesh = new THREE.Mesh(hotTubeGeo, hotTubeMat);
  hotTubeMesh.rotation.z = Math.PI / 2;
  igniterGroup.add(hotTubeMesh);

  // Brass Burner Lamp Chimney Enclosure
  const chimneyGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.8, 16);
  geometriesToDispose.push(chimneyGeo);
  const chimney = new THREE.Mesh(chimneyGeo, brass);
  chimney.position.set(0.25, 0.1, 0);
  chimney.castShadow = true;
  igniterGroup.add(chimney);

  // Burner Torch Flame
  const flameGeo = new THREE.ConeGeometry(0.08, 0.35, 12);
  geometriesToDispose.push(flameGeo);
  const burnerFlame = new THREE.Mesh(flameGeo, flameMat);
  burnerFlame.position.set(0.25, -0.2, 0);
  igniterGroup.add(burnerFlame);

  // Internal Combustion Flash Volume
  const combGeo = new THREE.SphereGeometry(0.48, 16, 16);
  geometriesToDispose.push(combGeo);
  const combustionFlame = new THREE.Mesh(combGeo, flameMat);
  combustionFlame.position.set(0, 2.0, 0);
  combustionFlame.visible = false;
  rootGroup.add(combustionFlame);

  // --- 7. VALVES & CAM-OPERATED PUSHROD LINKAGE ---
  // Cam Follower Pushrod on the side
  const exhaustPushrod = new THREE.Group();
  exhaustPushrod.position.set(0.65, 0.2, 0.6);
  rootGroup.add(exhaustPushrod);

  const pushrodGeo = new THREE.CylinderGeometry(0.035, 0.035, 2.2, 8);
  geometriesToDispose.push(pushrodGeo);
  const pushrod = new THREE.Mesh(pushrodGeo, polishedSteel);
  exhaustPushrod.add(pushrod);

  // Rocker Arm on Cylinder Top
  const exhaustRocker = new THREE.Group();
  exhaustRocker.position.set(0.4, 2.6, 0.6);
  rootGroup.add(exhaustRocker);

  const rockerGeo = new THREE.BoxGeometry(0.5, 0.06, 0.08);
  geometriesToDispose.push(rockerGeo);
  const rocker = new THREE.Mesh(rockerGeo, bronze);
  exhaustRocker.add(rocker);

  // Exhaust Poppet Valve
  const exhaustValve = new THREE.Group();
  exhaustValve.position.set(0.2, 2.5, 0.6);
  rootGroup.add(exhaustValve);

  const exValveGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.3, 12);
  geometriesToDispose.push(exValveGeo);
  const exValveMesh = new THREE.Mesh(exValveGeo, polishedSteel);
  exhaustValve.add(exValveMesh);

  // Automatic Intake Valve & Carburetor Box
  const intakeValve = new THREE.Group();
  intakeValve.position.set(-0.5, 2.5, 0);
  rootGroup.add(intakeValve);

  const carbBoxGeo = new THREE.BoxGeometry(0.45, 0.5, 0.45);
  geometriesToDispose.push(carbBoxGeo);
  const carbBox = new THREE.Mesh(carbBoxGeo, brass);
  intakeValve.add(carbBox);

  // --- DISPOSE CLEANUP ---
  const dispose = () => {
    for (const g of geometriesToDispose) g.dispose();
    for (const m of materialsToDispose) m.dispose();
    for (const t of texturesToDispose) t.dispose();
  };

  return {
    rootGroup,
    crankshaftGroup,
    flywheelGroup,
    pistonGroup,
    conRodGroup,
    exhaustPushrod,
    exhaustRocker,
    exhaustValve,
    intakeValve,
    hotTubeMesh,
    burnerFlame,
    combustionFlame,
    casingCutaway,
    materials: {
      castIron,
      darkCastIron,
      polishedSteel,
      brass,
      bronze,
      copper,
      hotTubeMat,
      flameMat,
    },
    dispose,
  };
}

/**
 * Updates Daimler high-speed engine 4-stroke cycle kinematics, valves, and combustion.
 */
export function updateDaimlerEngineKinematics(
  model: DaimlerEngineModel,
  cycleAngle: number,
  fourStrokePhase: number,
  hotTubeTempC: number,
  hotTubeGlow: number,
  isCutaway = false,
): { strokeIndex: number; pistonY: number } {
  // Hot-tube glow modulation
  model.materials.hotTubeMat.emissiveIntensity = hotTubeGlow;
  const daimler = stepDaimlerEngine({});
  model.materials.hotTubeMat.emissive.setHex(
    hotTubeTempC >= daimler.hotTubeBrightC
      ? daimler.hotTubeBrightHex
      : hotTubeTempC >= daimler.hotTubeWarmC
        ? daimler.hotTubeWarmHex
        : daimler.hotTubeColdHex,
  );

  model.crankshaftGroup.rotation.z = cycleAngle;

  // Kinematics: crankpin position
  const crankR = daimler.crankR;
  const pinY = daimler.pinYHome + Math.sin(cycleAngle) * crankR;
  const pinX = Math.cos(cycleAngle) * crankR;

  const rodLen = daimler.rodLen;
  const pistonY = pinY + Math.sqrt(Math.max(daimler.rodMin, rodLen ** 2 - pinX ** 2));
  model.pistonGroup.position.y = pistonY;

  // Connecting rod pose
  model.conRodGroup.position.set(pinX, pinY, 0);
  const rodAngle = Math.atan2(pistonY - pinY, -pinX) - Math.PI / 2;
  model.conRodGroup.rotation.z = rodAngle;

  // 4-Stroke Cycle Dynamics:
  const seats = daimler;
  const strokeIndex = fourStrokeIndexFromRad(fourStrokePhase, seats.strokeRad);

  if (strokeIndex === 0) {
    // Intake Stroke: automatic valve sucked open
    const intakeLift = Math.sin(fourStrokePhase) * seats.intakeLiftAmp;
    model.intakeValve.position.y = seats.valveHomeY - intakeLift;
    model.combustionFlame.visible = false;
  } else if (strokeIndex === 1) {
    // Compression Stroke
    model.intakeValve.position.y = seats.valveHomeY;
    model.combustionFlame.visible = false;
  } else if (strokeIndex === 2) {
    // Power Stroke: combustion flash near top dead center
    model.intakeValve.position.y = seats.valveHomeY;
    const powerProgress = fourStrokePhase - 2 * seats.strokeRad;
    if (powerProgress < seats.powerFlashWindowRad) {
      model.combustionFlame.visible = true;
      model.combustionFlame.position.y = pistonY + seats.flamePistonOffset;
      const heat = heatFrames(12, 16, 2);
      const localHeat =
        1 + Math.abs(sampleHeatAt(heat, 12, 16, 8, fourStrokePhase / (Math.PI * 2), 0.45));
      const flashScale =
        (seats.flameScale0 +
          Math.sin((powerProgress / seats.powerFlashWindowRad) * Math.PI) * seats.flameScaleAmp) *
        localHeat;
      model.combustionFlame.scale.set(flashScale, flashScale, flashScale);
    } else {
      model.combustionFlame.visible = false;
    }
  } else {
    // Exhaust Stroke: cam-operated pushrod
    model.intakeValve.position.y = seats.valveHomeY;
    model.combustionFlame.visible = false;
    const exhaustLift = Math.sin(fourStrokePhase - 3 * seats.strokeRad) * seats.exhaustLiftAmp;
    model.exhaustPushrod.position.y = seats.exhaustPushrodHomeY + exhaustLift;
    model.exhaustRocker.rotation.z = -exhaustLift * seats.exhaustRockerCoupling;
    model.exhaustValve.position.y = seats.valveHomeY - exhaustLift;
  }

  // Cutaway transparency
  model.materials.castIron.opacity = isCutaway ? 0.35 : 1.0;
  model.materials.castIron.transparent = isCutaway;

  return { strokeIndex, pistonY };
}
