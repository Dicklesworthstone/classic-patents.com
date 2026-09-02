/**
 * sundbackZipperModel.ts
 *
 * Museum-grade procedural 3D WebGL model for Gideon Sundback's 1917 Separable Fastener (US Patent 1,219,881).
 *
 * Reconstructs only what the 1917 grant describes:
 * 1. Fabric stringer tapes with cylindrical corded edges stitched along both sides.
 * 2. Precision-stamped metal interlocking scoops with clamping jaws, convex upper projections, and hollow nesting pockets.
 * 3. Staggered half-pitch tooth layout enabling progressive interlocking.
 * 4. Y-shaped sliding cam operating device with converging guide channels, central diamond separating wedge, and pull tab.
 * 5. Bottom connecting link and top travel stops.
 */

import * as THREE from "three";
import type { SundbackZipperTelemetry } from "@/physics/sundbackZipperKernel";

export interface SundbackZipperModel {
  rootGroup: THREE.Group;
  chainGroup: THREE.Group;
  sliderGroup: THREE.Group;
  pullTabGroup: THREE.Group;
  leftTeeth: THREE.Group[];
  rightTeeth: THREE.Group[];
  leftTapeMesh: THREE.Mesh;
  rightTapeMesh: THREE.Mesh;
  materials: {
    brassScoop: THREE.MeshStandardMaterial;
    sliderMetal: THREE.MeshStandardMaterial;
    fabricTape: THREE.MeshStandardMaterial;
    tapeCord: THREE.MeshStandardMaterial;
  };
  dispose: () => void;
}

export const ZIPPER_MODEL_LENGTH = 12.0; // 12 units in 3D studio space
export const TOTAL_TOOTH_PAIRS = 32;

export function buildSundbackZipperModel(): SundbackZipperModel {
  const rootGroup = new THREE.Group();
  const chainGroup = new THREE.Group();
  const sliderGroup = new THREE.Group();
  const pullTabGroup = new THREE.Group();
  rootGroup.add(chainGroup);
  chainGroup.add(sliderGroup);

  const materialsToDispose: THREE.Material[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];

  // 1. Materials
  const brassScoop = new THREE.MeshStandardMaterial({
    color: 0xd4af37, // Vintage cartridge brass
    roughness: 0.35,
    metalness: 0.85,
  });
  materialsToDispose.push(brassScoop);

  const sliderMetal = new THREE.MeshStandardMaterial({
    color: 0x94a3b8, // Polished nickel-steel
    roughness: 0.28,
    metalness: 0.9,
  });
  materialsToDispose.push(sliderMetal);

  const fabricTape = new THREE.MeshStandardMaterial({
    color: 0x334155, // Dark slate woven fabric
    roughness: 0.9,
    metalness: 0.05,
    side: THREE.DoubleSide,
  });
  materialsToDispose.push(fabricTape);

  const tapeCord = new THREE.MeshStandardMaterial({
    color: 0xb45309, // Reinforced cotton bead
    roughness: 0.8,
    metalness: 0.1,
  });
  materialsToDispose.push(tapeCord);

  // 2. Base Fabric Tapes
  const tapeGeo = new THREE.PlaneGeometry(1.2, ZIPPER_MODEL_LENGTH, 1, 32);
  geometriesToDispose.push(tapeGeo);

  const leftTapeMesh = new THREE.Mesh(tapeGeo, fabricTape);
  leftTapeMesh.position.set(-0.85, 0, 0);
  chainGroup.add(leftTapeMesh);

  const rightTapeMesh = new THREE.Mesh(tapeGeo, fabricTape);
  rightTapeMesh.position.set(0.85, 0, 0);
  chainGroup.add(rightTapeMesh);

  // 3. Corded Edges (Beaded cords along tape margins)
  const cordGeo = new THREE.CylinderGeometry(0.08, 0.08, ZIPPER_MODEL_LENGTH, 16);
  geometriesToDispose.push(cordGeo);

  const leftCord = new THREE.Mesh(cordGeo, tapeCord);
  leftCord.position.set(-0.25, 0, 0);
  chainGroup.add(leftCord);

  const rightCord = new THREE.Mesh(cordGeo, tapeCord);
  rightCord.position.set(0.25, 0, 0);
  chainGroup.add(rightCord);

  // 4. Stamped Scoop Geometry (Tooth with jaws, projection, and recess)
  const toothBodyGeo = new THREE.BoxGeometry(0.42, 0.14, 0.22);
  const toothProjGeo = new THREE.ConeGeometry(0.09, 0.12, 12);
  const toothJawGeo = new THREE.BoxGeometry(0.25, 0.12, 0.28);
  geometriesToDispose.push(toothBodyGeo, toothProjGeo, toothJawGeo);

  const leftTeeth: THREE.Group[] = [];
  const rightTeeth: THREE.Group[] = [];
  const pitch = ZIPPER_MODEL_LENGTH / TOTAL_TOOTH_PAIRS;

  for (let i = 0; i < TOTAL_TOOTH_PAIRS; i++) {
    const y = -ZIPPER_MODEL_LENGTH / 2 + i * pitch + pitch / 2;

    // Left tooth group
    const leftG = new THREE.Group();
    const lBody = new THREE.Mesh(toothBodyGeo, brassScoop);
    const lProj = new THREE.Mesh(toothProjGeo, brassScoop);
    lProj.position.set(0.12, 0, 0.12);
    lProj.rotation.x = Math.PI / 2;
    const lJaws = new THREE.Mesh(toothJawGeo, brassScoop);
    lJaws.position.set(-0.16, 0, 0);

    leftG.add(lBody, lProj, lJaws);
    leftG.position.set(-0.22, y, 0);
    chainGroup.add(leftG);
    leftTeeth.push(leftG);

    // Right tooth group (staggered by half pitch)
    const rightY = y + pitch / 2;
    if (rightY < ZIPPER_MODEL_LENGTH / 2) {
      const rightG = new THREE.Group();
      const rBody = new THREE.Mesh(toothBodyGeo, brassScoop);
      const rProj = new THREE.Mesh(toothProjGeo, brassScoop);
      rProj.position.set(-0.12, 0, 0.12);
      rProj.rotation.x = Math.PI / 2;
      const rJaws = new THREE.Mesh(toothJawGeo, brassScoop);
      rJaws.position.set(0.16, 0, 0);

      rightG.add(rBody, rProj, rJaws);
      rightG.position.set(0.22, rightY, 0);
      chainGroup.add(rightG);
      rightTeeth.push(rightG);
    }
  }

  // 5. Y-Slider Cam Operating Device (Claim 5)
  const sliderTopPlateGeo = new THREE.BoxGeometry(1.3, 1.1, 0.12);
  const sliderBottomPlateGeo = new THREE.BoxGeometry(1.3, 1.1, 0.12);
  const wedgeDiamondGeo = new THREE.CylinderGeometry(0.18, 0.08, 0.38, 4);
  const rivetGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.5, 12);
  const pullTabGeo = new THREE.BoxGeometry(0.35, 0.9, 0.06);
  const pullTabHoleGeo = new THREE.TorusGeometry(0.12, 0.04, 8, 16);
  geometriesToDispose.push(
    sliderTopPlateGeo,
    sliderBottomPlateGeo,
    wedgeDiamondGeo,
    rivetGeo,
    pullTabGeo,
    pullTabHoleGeo,
  );

  const topPlate = new THREE.Mesh(sliderTopPlateGeo, sliderMetal);
  topPlate.position.set(0, 0, 0.24);
  const btmPlate = new THREE.Mesh(sliderBottomPlateGeo, sliderMetal);
  btmPlate.position.set(0, 0, -0.24);
  const wedge = new THREE.Mesh(wedgeDiamondGeo, sliderMetal);
  wedge.rotation.y = Math.PI / 4;
  const rivet = new THREE.Mesh(rivetGeo, sliderMetal);

  sliderGroup.add(topPlate, btmPlate, wedge, rivet);

  // Pull Tab
  const pullTab = new THREE.Mesh(pullTabGeo, sliderMetal);
  pullTab.position.set(0, -0.45, 0.35);
  pullTabGroup.add(pullTab);
  sliderGroup.add(pullTabGroup);

  // 6. Top and Bottom Stops (Claim 4)
  const bottomLinkGeo = new THREE.BoxGeometry(0.9, 0.35, 0.35);
  const topStopGeo = new THREE.BoxGeometry(0.35, 0.3, 0.3);
  geometriesToDispose.push(bottomLinkGeo, topStopGeo);

  const bottomLink = new THREE.Mesh(bottomLinkGeo, sliderMetal);
  bottomLink.position.set(0, -ZIPPER_MODEL_LENGTH / 2 - 0.15, 0);
  chainGroup.add(bottomLink);

  const leftTopStop = new THREE.Mesh(topStopGeo, sliderMetal);
  leftTopStop.position.set(-0.35, ZIPPER_MODEL_LENGTH / 2 + 0.15, 0);
  chainGroup.add(leftTopStop);

  const rightTopStop = new THREE.Mesh(topStopGeo, sliderMetal);
  rightTopStop.position.set(0.35, ZIPPER_MODEL_LENGTH / 2 + 0.15, 0);
  chainGroup.add(rightTopStop);

  return {
    rootGroup,
    chainGroup,
    sliderGroup,
    pullTabGroup,
    leftTeeth,
    rightTeeth,
    leftTapeMesh,
    rightTapeMesh,
    materials: {
      brassScoop,
      sliderMetal,
      fabricTape,
      tapeCord,
    },
    dispose: () => {
      materialsToDispose.forEach((m) => {
        m.dispose();
      });
      geometriesToDispose.forEach((g) => {
        g.dispose();
      });
    },
  };
}

export function updateSundbackZipperKinematics(
  model: SundbackZipperModel,
  tel: SundbackZipperTelemetry,
  flexAngleDeg: number = 0,
) {
  // Slider position along Y axis: 0% = -L/2, 100% = +L/2
  const sliderY = -ZIPPER_MODEL_LENGTH / 2 + tel.engagementFraction * ZIPPER_MODEL_LENGTH;
  model.sliderGroup.position.set(0, sliderY, 0);

  // Articulate individual teeth
  const pitch = ZIPPER_MODEL_LENGTH / TOTAL_TOOTH_PAIRS;

  for (let i = 0; i < model.leftTeeth.length; i++) {
    const tooth = model.leftTeeth[i];
    const toothY = -ZIPPER_MODEL_LENGTH / 2 + i * pitch + pitch / 2;

    if (toothY < sliderY) {
      // Below slider: locked and meshed into center
      tooth.position.x = -0.11;
      tooth.rotation.z = 0;
    } else {
      // Above slider: diverging tracks
      const distAbove = toothY - sliderY;
      const spread = Math.min(1.2, distAbove * 0.35);
      tooth.position.x = -0.22 - spread;
      tooth.rotation.z = -Math.min(0.35, distAbove * 0.1);
    }
  }

  for (let i = 0; i < model.rightTeeth.length; i++) {
    const tooth = model.rightTeeth[i];
    const toothY = -ZIPPER_MODEL_LENGTH / 2 + i * pitch + pitch;

    if (toothY < sliderY) {
      // Below slider: meshed
      tooth.position.x = 0.11;
      tooth.rotation.z = 0;
    } else {
      // Above slider: diverging
      const distAbove = toothY - sliderY;
      const spread = Math.min(1.2, distAbove * 0.35);
      tooth.position.x = 0.22 + spread;
      tooth.rotation.z = Math.min(0.35, distAbove * 0.1);
    }
  }

  // Transverse bending / folding curvature
  if (flexAngleDeg > 0) {
    const rad = (flexAngleDeg * Math.PI) / 180;
    model.chainGroup.rotation.y = rad * 0.4;
  } else {
    model.chainGroup.rotation.y = 0;
  }
}
