/**
 * cortPuddlingRollingModel.ts
 *
 * Procedural editorial teaching model of the process described in the
 * 1854 Patent Office abridgment for Henry Cort's GB 1420.
 *
 * The enrolled specification and any drawing sheet are not currently
 * available in a reviewed facsimile, so this model is deliberately unlabelled
 * and must not be presented as an archival reconstruction.
 *
 * Constructs a source-bounded teaching topology of:
 * - Reverberatory Puddling Furnace: brick hearth, coal firebox, arched roof crown,
 *   working door with puddler rabble rod, molten decarburizing bath, chimney stack.
 * - Grooved Rolling Mill: heavy cast-iron stanchions, counter-rotating chilled-iron
 *   rolls with four declared recessed working bands, screw-down adjustment
 *   wheels, hot billet and deterministic slag/spark reader aids.
 */

import * as THREE from "three";
import {
  CORT_ACTIVE_BILLET_HEIGHT_M,
  CORT_BILLET_TRAVEL_M,
  CORT_ROLL_BODY_RADIUS_M,
  CORT_ROLL_CENTER_SEPARATION_M,
  CORT_ROLL_PASS_RADII_M,
  CORT_ROLL_PASS_WIDTHS_M,
  CORT_ROLL_PASS_X_M,
  type CortKinematicPhases,
} from "@/physics/cortKernel";

export interface CortModel {
  root: THREE.Group;
  furnaceGroup: THREE.Group;
  roofGroup: THREE.Group;
  rabbleGroup: THREE.Group;
  puddleBallMesh: THREE.Mesh;
  moltenBathMesh: THREE.Mesh;
  topRollGroup: THREE.Group;
  bottomRollGroup: THREE.Group;
  topRollDriveGear: THREE.Group;
  bottomRollDriveGear: THREE.Group;
  billetMesh: THREE.Mesh;
  sparkParticles: THREE.Points;
  setCutaway: (enabled: boolean) => void;
  updateAnimation: (
    phases: CortKinematicPhases,
    timeSec: number,
    isComingToNature: boolean,
  ) => void;
  dispose: () => void;
}

export const CORT_ROLL_DRIVE_GEAR_PITCH_RADIUS_M = CORT_ROLL_CENTER_SEPARATION_M / 2;
export const CORT_ROLL_DRIVE_GEAR_TEETH = 24;
export const CORT_ROLL_DRIVE_GEAR_TOOTH_DEPTH_M = 0.035;
export const CORT_ROLL_DRIVE_GEAR_ROOT_RADIUS_M =
  CORT_ROLL_DRIVE_GEAR_PITCH_RADIUS_M - CORT_ROLL_DRIVE_GEAR_TOOTH_DEPTH_M / 2;

export function buildCortPuddlingRollingModel(): CortModel {
  const root = new THREE.Group();
  root.name = "cort-puddling-rolling-assembly";

  // Materials
  const brickMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b4513,
    roughness: 0.85,
    metalness: 0.1,
  });

  const fireboxMaterial = new THREE.MeshStandardMaterial({
    color: 0x2d1810,
    roughness: 0.9,
    metalness: 0.2,
  });

  const coalGlowMaterial = new THREE.MeshStandardMaterial({
    color: 0xff4500,
    emissive: 0xff2200,
    emissiveIntensity: 0.8,
    roughness: 0.6,
  });

  const moltenBathMaterial = new THREE.MeshStandardMaterial({
    color: 0xff6600,
    emissive: 0xdd3300,
    emissiveIntensity: 0.7,
    roughness: 0.3,
    metalness: 0.8,
  });

  const puddleBallMaterial = new THREE.MeshStandardMaterial({
    color: 0xffaa00,
    emissive: 0xff5500,
    emissiveIntensity: 0.9,
    roughness: 0.5,
    metalness: 0.7,
  });

  const ironMetalMaterial = new THREE.MeshStandardMaterial({
    color: 0x3a3d40,
    roughness: 0.45,
    metalness: 0.85,
  });

  const chilledRollMaterial = new THREE.MeshStandardMaterial({
    color: 0x4a4e52,
    roughness: 0.3,
    metalness: 0.9,
  });

  const driveGearMaterial = new THREE.MeshStandardMaterial({
    color: 0x8a5a24,
    roughness: 0.4,
    metalness: 0.8,
  });

  const hotBilletMaterial = new THREE.MeshStandardMaterial({
    color: 0xff3300,
    emissive: 0xcc2200,
    emissiveIntensity: 0.95,
    roughness: 0.4,
  });

  // ==========================================
  // 1. REVERBERATORY PUDDLING FURNACE (LEFT)
  // ==========================================
  const furnaceGroup = new THREE.Group();
  furnaceGroup.position.set(-2.8, 0, 0);
  root.add(furnaceGroup);

  // Foundation Bedding
  const foundationGeo = new THREE.BoxGeometry(3.6, 0.4, 2.2);
  const foundation = new THREE.Mesh(foundationGeo, brickMaterial);
  foundation.position.set(0, 0.2, 0);
  furnaceGroup.add(foundation);

  // Firebox & Grate (Left side of furnace)
  const fireboxGeo = new THREE.BoxGeometry(1.0, 1.2, 1.8);
  const firebox = new THREE.Mesh(fireboxGeo, fireboxMaterial);
  firebox.position.set(-1.2, 1.0, 0);
  furnaceGroup.add(firebox);

  // Glowing Coal Bed
  const coalBedGeo = new THREE.BoxGeometry(0.8, 0.2, 1.4);
  const coalBed = new THREE.Mesh(coalBedGeo, coalGlowMaterial);
  coalBed.position.set(-1.2, 0.6, 0);
  furnaceGroup.add(coalBed);

  // Fire Bridge Wall
  const fireBridgeGeo = new THREE.BoxGeometry(0.3, 1.0, 1.8);
  const fireBridge = new THREE.Mesh(fireBridgeGeo, brickMaterial);
  fireBridge.position.set(-0.55, 0.9, 0);
  furnaceGroup.add(fireBridge);

  // Concave Sand Hearth Basin
  const hearthBasinGeo = new THREE.CylinderGeometry(0.9, 0.7, 0.4, 24);
  const hearthBasin = new THREE.Mesh(hearthBasinGeo, brickMaterial);
  hearthBasin.position.set(0.3, 0.6, 0);
  furnaceGroup.add(hearthBasin);

  // Molten Iron Pool
  const bathGeo = new THREE.CylinderGeometry(0.75, 0.75, 0.1, 24);
  const moltenBathMesh = new THREE.Mesh(bathGeo, moltenBathMaterial);
  moltenBathMesh.position.set(0.3, 0.82, 0);
  furnaceGroup.add(moltenBathMesh);

  // Agglomerated Puddle Ball (Loup)
  const puddleBallGeo = new THREE.SphereGeometry(0.24, 16, 16);
  puddleBallGeo.scale(1.2, 0.7, 1.0);
  const puddleBallMesh = new THREE.Mesh(puddleBallGeo, puddleBallMaterial);
  puddleBallMesh.position.set(0.3, 0.92, 0);
  furnaceGroup.add(puddleBallMesh);

  // Chimney Stack (Right side of furnace)
  const stackGeo = new THREE.BoxGeometry(0.8, 3.2, 0.8);
  const stack = new THREE.Mesh(stackGeo, brickMaterial);
  stack.position.set(1.4, 2.0, 0);
  furnaceGroup.add(stack);

  // Chimney Flue Damper
  const damperGeo = new THREE.BoxGeometry(0.6, 0.05, 0.6);
  const damper = new THREE.Mesh(damperGeo, ironMetalMaterial);
  damper.position.set(1.4, 1.5, 0);
  furnaceGroup.add(damper);

  // Arched Reverberatory Roof (Cutaway capable)
  const roofGroup = new THREE.Group();
  const roofArchGeo = new THREE.CylinderGeometry(1.2, 1.2, 2.6, 24, 1, false, 0, Math.PI);
  roofArchGeo.rotateZ(Math.PI / 2);
  const roof = new THREE.Mesh(roofArchGeo, brickMaterial);
  roof.position.set(0.1, 1.7, 0);
  roofGroup.add(roof);
  furnaceGroup.add(roofGroup);

  // Puddler Working Door & Rabble Rod
  const rabbleGroup = new THREE.Group();
  const doorFrame = new THREE.Group();
  doorFrame.name = "supported-working-door-frame";
  doorFrame.position.set(0.3, 1.2, 0.95);
  const doorSideGeo = new THREE.BoxGeometry(0.08, 0.7, 0.1);
  const doorLintelGeo = new THREE.BoxGeometry(0.6, 0.08, 0.1);
  for (const x of [-0.26, 0.26]) {
    const side = new THREE.Mesh(doorSideGeo, ironMetalMaterial);
    side.position.x = x;
    doorFrame.add(side);
  }
  for (const y of [-0.31, 0.31]) {
    const lintel = new THREE.Mesh(doorLintelGeo, ironMetalMaterial);
    lintel.position.y = y;
    doorFrame.add(lintel);
  }
  furnaceGroup.add(doorFrame);

  // Rabble iron pivots at the working door; its inner end remains inside the bath.
  rabbleGroup.position.set(0.3, 1.15, 0.95);
  rabbleGroup.name = "door-pivoted-rabble";
  const rabbleRodGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.34, 12);
  rabbleRodGeo.rotateX(-1.797);
  const rabbleRod = new THREE.Mesh(rabbleRodGeo, ironMetalMaterial);
  rabbleRod.position.set(0, -0.15, -0.65);
  rabbleGroup.add(rabbleRod);
  const rabbleHead = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.04, 0.05), ironMetalMaterial);
  rabbleHead.position.set(0, -0.3, -1.3);
  rabbleGroup.add(rabbleHead);
  furnaceGroup.add(rabbleGroup);

  // ==========================================
  // 2. GROOVED ROLLING MILL TRAIN (RIGHT)
  // ==========================================
  const millGroup = new THREE.Group();
  millGroup.position.set(2.0, 0, 0);
  root.add(millGroup);

  // Mill Bedplate Foundation
  const millBaseGeo = new THREE.BoxGeometry(2.4, 0.3, 1.8);
  const millBase = new THREE.Mesh(millBaseGeo, ironMetalMaterial);
  millBase.name = "rolling-mill-bedplate";
  millBase.position.set(0, 0.15, 0);
  millGroup.add(millBase);

  // Left & Right Cast-Iron Stanchions / Housings
  const stanchionGeo = new THREE.BoxGeometry(0.35, 1.8, 0.8);
  const leftStanchion = new THREE.Mesh(stanchionGeo, ironMetalMaterial);
  leftStanchion.name = "left-roll-bearing-stand";
  leftStanchion.position.set(-0.85, 1.05, 0);
  millGroup.add(leftStanchion);

  const rightStanchion = new THREE.Mesh(stanchionGeo, ironMetalMaterial);
  rightStanchion.name = "right-roll-bearing-stand";
  rightStanchion.position.set(0.85, 1.05, 0);
  millGroup.add(rightStanchion);

  // Screw-Down Adjustment Spindles & Handwheels
  const screwGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.4, 12);
  const leftScrew = new THREE.Mesh(screwGeo, ironMetalMaterial);
  leftScrew.position.set(-0.85, 2.05, 0);
  millGroup.add(leftScrew);

  const wheelGeo = new THREE.TorusGeometry(0.12, 0.025, 8, 16);
  wheelGeo.rotateX(Math.PI / 2);
  const leftWheel = new THREE.Mesh(wheelGeo, ironMetalMaterial);
  leftWheel.position.set(-0.85, 2.25, 0);
  millGroup.add(leftWheel);

  const rightScrew = new THREE.Mesh(screwGeo, ironMetalMaterial);
  rightScrew.position.set(0.85, 2.05, 0);
  millGroup.add(rightScrew);

  const rightWheel = new THREE.Mesh(wheelGeo, ironMetalMaterial);
  rightWheel.position.set(0.85, 2.25, 0);
  millGroup.add(rightWheel);

  // Grooved Rollers Assembly
  const topRollGroup = new THREE.Group();
  topRollGroup.position.set(0, 1.015 + CORT_ROLL_CENTER_SEPARATION_M / 2, 0);
  millGroup.add(topRollGroup);

  const bottomRollGroup = new THREE.Group();
  bottomRollGroup.position.set(0, 1.015 - CORT_ROLL_CENTER_SEPARATION_M / 2, 0);
  millGroup.add(bottomRollGroup);

  // Coaxially connected roll core, full-radius shoulders, and reduced-radius
  // working bands. Unlike the former overlaid cylinders, these bands create
  // real visible pass recesses without hidden geometry pretending to be cuts.
  function buildGroovedRoller(): THREE.Group {
    const group = new THREE.Group();
    const coreGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.35, 24);
    coreGeo.rotateZ(Math.PI / 2);
    const core = new THREE.Mesh(coreGeo, ironMetalMaterial);
    core.name = "continuous-roll-core";
    group.add(core);

    const shoulderIntervals = [
      [-0.675, -0.47],
      [-0.33, -0.205],
      [-0.095, 0.04],
      [0.16, 0.31],
      [0.39, 0.675],
    ] as const;
    for (const [start, end] of shoulderIntervals) {
      const width = end - start;
      const shoulderGeo = new THREE.CylinderGeometry(
        CORT_ROLL_BODY_RADIUS_M,
        CORT_ROLL_BODY_RADIUS_M,
        width,
        32,
      );
      shoulderGeo.rotateZ(Math.PI / 2);
      const shoulder = new THREE.Mesh(shoulderGeo, chilledRollMaterial);
      shoulder.position.x = (start + end) / 2;
      shoulder.name = "full-radius-roll-shoulder";
      group.add(shoulder);
    }

    for (let i = 0; i < CORT_ROLL_PASS_X_M.length; i++) {
      const gGeo = new THREE.CylinderGeometry(
        CORT_ROLL_PASS_RADII_M[i],
        CORT_ROLL_PASS_RADII_M[i],
        CORT_ROLL_PASS_WIDTHS_M[i],
        32,
      );
      gGeo.rotateZ(Math.PI / 2);
      const gMesh = new THREE.Mesh(gGeo, chilledRollMaterial);
      gMesh.name = `recessed-working-pass-${i + 1}`;
      gMesh.position.set(CORT_ROLL_PASS_X_M[i], 0, 0);
      group.add(gMesh);
    }

    // Roll Necks / Journals
    const journalGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.25, 16);
    journalGeo.rotateZ(Math.PI / 2);
    const leftJournal = new THREE.Mesh(journalGeo, ironMetalMaterial);
    leftJournal.name = "left-supported-roll-journal";
    leftJournal.position.set(-0.78, 0, 0);
    group.add(leftJournal);

    const rightJournal = new THREE.Mesh(journalGeo, ironMetalMaterial);
    rightJournal.name = "right-supported-roll-journal";
    rightJournal.position.set(0.78, 0, 0);
    group.add(rightJournal);

    return group;
  }

  const topRoller = buildGroovedRoller();
  topRollGroup.add(topRoller);

  const bottomRoller = buildGroovedRoller();
  bottomRollGroup.add(bottomRoller);

  // Equal external gears constrain the two rolls to opposite angular
  // velocities. They are deliberately presented as a normalized teaching
  // coupling because the pinned abridgment has no transmission drawing.
  function buildRollDriveGear(phaseOffset: number): THREE.Group {
    const gear = new THREE.Group();
    // With equal pitch radii whose sum is the centre distance, the addendum
    // of either normalized tooth lands exactly at the opposing root radius.
    // That preserves meshing clearance instead of intersecting two solid hubs.
    const disc = new THREE.Mesh(
      new THREE.CylinderGeometry(
        CORT_ROLL_DRIVE_GEAR_ROOT_RADIUS_M,
        CORT_ROLL_DRIVE_GEAR_ROOT_RADIUS_M,
        0.12,
        48,
      ),
      driveGearMaterial,
    );
    disc.name = "normalized-roll-drive-root-disc";
    disc.rotation.z = Math.PI / 2;
    gear.add(disc);

    const toothWidth =
      (2 * Math.PI * CORT_ROLL_DRIVE_GEAR_PITCH_RADIUS_M * 0.48) / CORT_ROLL_DRIVE_GEAR_TEETH;
    const toothGeometry = new THREE.BoxGeometry(
      0.13,
      CORT_ROLL_DRIVE_GEAR_TOOTH_DEPTH_M,
      toothWidth,
    );
    for (let toothIndex = 0; toothIndex < CORT_ROLL_DRIVE_GEAR_TEETH; toothIndex++) {
      const angle = phaseOffset + (toothIndex / CORT_ROLL_DRIVE_GEAR_TEETH) * Math.PI * 2;
      const tooth = new THREE.Mesh(toothGeometry, driveGearMaterial);
      tooth.name = "normalized-roll-drive-tooth";
      tooth.position.set(
        0,
        Math.cos(angle) * CORT_ROLL_DRIVE_GEAR_PITCH_RADIUS_M,
        Math.sin(angle) * CORT_ROLL_DRIVE_GEAR_PITCH_RADIUS_M,
      );
      tooth.rotation.x = angle;
      gear.add(tooth);
    }
    return gear;
  }

  const extensionGeometry = new THREE.CylinderGeometry(0.07, 0.07, 0.52, 16);
  extensionGeometry.rotateZ(Math.PI / 2);
  const topDriveShaft = new THREE.Mesh(extensionGeometry, ironMetalMaterial);
  topDriveShaft.name = "top-roll-drive-shaft-extension";
  topDriveShaft.position.x = 1.01;
  topRollGroup.add(topDriveShaft);
  const bottomDriveShaft = new THREE.Mesh(extensionGeometry, ironMetalMaterial);
  bottomDriveShaft.name = "bottom-roll-drive-shaft-extension";
  bottomDriveShaft.position.x = 1.01;
  bottomRollGroup.add(bottomDriveShaft);

  const topRollDriveGear = buildRollDriveGear(Math.PI / CORT_ROLL_DRIVE_GEAR_TEETH);
  topRollDriveGear.name = "normalized-top-roll-drive-gear";
  topRollDriveGear.position.x = 1.08;
  topRollGroup.add(topRollDriveGear);
  const bottomRollDriveGear = buildRollDriveGear(0);
  bottomRollDriveGear.name = "normalized-bottom-roll-drive-gear";
  bottomRollDriveGear.position.x = 1.08;
  bottomRollGroup.add(bottomRollDriveGear);

  const inputCoupling = new THREE.Mesh(
    new THREE.CylinderGeometry(0.13, 0.13, 0.18, 24),
    driveGearMaterial,
  );
  inputCoupling.name = "attached-off-scene-lineshaft-input-coupling";
  inputCoupling.rotation.z = Math.PI / 2;
  inputCoupling.position.x = 1.31;
  bottomRollGroup.add(inputCoupling);

  // Continue the input shaft through the camera boundary. The visible end is
  // therefore not a free-floating power source; it is explicitly connected
  // to an out-of-scene prime mover without inventing one for this abridgment.
  const offSceneLineShaftGeometry = new THREE.CylinderGeometry(0.07, 0.07, 2.0, 16);
  offSceneLineShaftGeometry.rotateZ(Math.PI / 2);
  const offSceneLineShaft = new THREE.Mesh(offSceneLineShaftGeometry, ironMetalMaterial);
  offSceneLineShaft.name = "normalized-off-scene-line-shaft";
  offSceneLineShaft.position.x = 2.22;
  bottomRollGroup.add(offSceneLineShaft);

  // Hot Wrought Iron Billet Passing Through Pass 1
  const billetGeo = new THREE.BoxGeometry(0.12, CORT_ACTIVE_BILLET_HEIGHT_M, 1.2);
  const billetMesh = new THREE.Mesh(billetGeo, hotBilletMaterial);
  billetMesh.name = "first-pass-billet-no-interference";
  billetMesh.position.set(CORT_ROLL_PASS_X_M[0], 1.015, -CORT_BILLET_TRAVEL_M / 2);
  millGroup.add(billetMesh);

  // Slag / Spark Particles (Deterministic pseudo-random distribution)
  const sparkCount = 45;
  const sparkGeo = new THREE.BufferGeometry();
  const sparkPositions = new Float32Array(sparkCount * 3);
  const sparkPhaseSeeds = new Float32Array(sparkCount);
  const sparkXSeeds = new Float32Array(sparkCount);
  const sparkZSeeds = new Float32Array(sparkCount);
  const fractional = (value: number) => value - Math.floor(value);
  for (let i = 0; i < sparkCount; i++) {
    sparkXSeeds[i] = fractional(Math.sin((i + 1) * 12.9898) * 43758.5453);
    sparkPhaseSeeds[i] = fractional(Math.sin((i + 1) * 78.233) * 43758.5453);
    sparkZSeeds[i] = fractional(Math.sin((i + 1) * 45.164) * 43758.5453);
    sparkPositions[i * 3] = CORT_ROLL_PASS_X_M[0] + (sparkXSeeds[i] - 0.5) * 0.18;
    sparkPositions[i * 3 + 1] = 0.95 - sparkPhaseSeeds[i] * 0.6;
    sparkPositions[i * 3 + 2] = (sparkZSeeds[i] - 0.5) * 0.24;
  }
  sparkGeo.setAttribute("position", new THREE.BufferAttribute(sparkPositions, 3));
  const sparkMaterial = new THREE.PointsMaterial({
    color: 0xffaa00,
    size: 0.04,
    transparent: true,
    opacity: 0.85,
  });
  const sparkParticles = new THREE.Points(sparkGeo, sparkMaterial);
  millGroup.add(sparkParticles);

  return {
    root,
    furnaceGroup,
    roofGroup,
    rabbleGroup,
    puddleBallMesh,
    moltenBathMesh,
    topRollGroup,
    bottomRollGroup,
    topRollDriveGear,
    bottomRollDriveGear,
    billetMesh,
    sparkParticles,

    setCutaway(enabled: boolean) {
      roofGroup.visible = !enabled;
    },

    updateAnimation(phases: CortKinematicPhases, timeSec: number, isComingToNature: boolean) {
      // 1. The rod sweeps about its supported door pivot; it never translates
      // away from the opening or floats through the furnace shell.
      rabbleGroup.rotation.y = Math.sin(phases.rabbleCycleRad) * 0.18;

      // 2. The purely illustrative glow is a function of shared tape time, so
      // pause and deterministic replay hold the exact same visual state.
      if (isComingToNature) {
        puddleBallMesh.scale.set(1.4, 0.85, 1.2);
        (puddleBallMesh.material as THREE.MeshStandardMaterial).emissiveIntensity =
          0.85 + Math.sin(timeSec * 2.7) * 0.1;
      } else {
        puddleBallMesh.scale.set(0.8, 0.5, 0.8);
      }

      // 3. Counter-rotating rolls share one constrained tape coordinate.
      topRollGroup.rotation.x = phases.topRollRad;
      bottomRollGroup.rotation.x = phases.bottomRollRad;

      // 4. Billet travel is integrated from the working-radius surface speed.
      billetMesh.position.z = phases.billetTravelM - CORT_BILLET_TRAVEL_M / 2;

      // 5. Deterministic slag/spark reader aid. Positions are a pure function
      // of tape time and fixed seeds, never frame count or ambient randomness.
      const posAttr = sparkParticles.geometry.getAttribute("position") as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;
      for (let i = 0; i < sparkCount; i++) {
        const fall = fractional(sparkPhaseSeeds[i] + timeSec * 0.85);
        posArr[i * 3] = CORT_ROLL_PASS_X_M[0] + (sparkXSeeds[i] - 0.5) * 0.18;
        posArr[i * 3 + 1] = 0.95 - fall * 0.6;
        posArr[i * 3 + 2] = (sparkZSeeds[i] - 0.5) * 0.24;
      }
      posAttr.needsUpdate = true;
      sparkMaterial.opacity = Math.abs(billetMesh.position.z) < 0.22 ? 0.85 : 0.08;
    },

    dispose() {
      root.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            for (const m of obj.material) m.dispose();
          } else if (obj.material) {
            obj.material.dispose();
          }
        } else if (obj instanceof THREE.Sprite) {
          obj.material.map?.dispose();
          obj.material.dispose();
        } else if (obj instanceof THREE.Points) {
          obj.geometry.dispose();
          if (obj.material instanceof THREE.Material) obj.material.dispose();
        }
      });
    },
  };
}
