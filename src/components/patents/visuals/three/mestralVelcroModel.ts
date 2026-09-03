/**
 * mestralVelcroModel.ts
 *
 * Procedural Three.js 3D geometric construction for George de Mestral's
 * hook-pile fastening fabric (US 2,717,437).
 *
 * Constructs:
 * 1. Lower fabric with upright hooks 4/9 and straight cut strands 10.
 * 2. A second piece of the same hook fabric, turned 90 degrees as Figure 2 says.
 * 3. A piecewise-continuous peeled backing whose pile remains parented to it.
 * 4. An attached clamp and applied-traction arrow defining the external load boundary.
 * 5. The Figure 1 heated lancet bar and cutting blade as a source reference.
 */

import * as THREE from "three";
import {
  MESTRAL_VELCRO_DEFAULTS,
  type MestralVelcroControls,
  type MestralVelcroTelemetry,
} from "@/physics/mestralVelcroKernel";

export interface MestralVelcro3DObjects {
  rootGroup: THREE.Group;
  supportPlateMesh: THREE.Mesh;
  lowerTapeGroup: THREE.Group;
  upperTapeGroup: THREE.Group;
  /** Consecutive flexible-backing sections that own their hook-pile roots. */
  upperTapeSections: THREE.Group[];
  upperTapeRestXs: readonly number[];
  lancetBarGroup: THREE.Group;
  lowerHookMeshes: THREE.Mesh[];
  upperHookMeshes: THREE.Mesh[];
  lowerStraightStrands: THREE.Mesh[];
  upperStraightStrands: THREE.Mesh[];
  peelClampGroup: THREE.Group;
  tractionArrowGroup: THREE.Group;
  lancetMaterial: THREE.MeshStandardMaterial;
  lowerHookMaterial: THREE.MeshStandardMaterial;
  upperHookMaterial: THREE.MeshStandardMaterial;
  update: (controls: MestralVelcroControls, tel: MestralVelcroTelemetry, timeSec?: number) => void;
  dispose: () => void;
}

export function createMestralVelcroModel(): MestralVelcro3DObjects {
  const rootGroup = new THREE.Group();
  rootGroup.name = "mestral-velcro-root";
  // The studio floor is y=-4.5. The exhibit support plate below is 0.3 units
  // thick, so this puts its underside on the floor instead of floating above it.
  rootGroup.position.y = -4.2;

  // Materials
  const tapeBackingMaterial = new THREE.MeshStandardMaterial({
    color: 0x3b3836,
    roughness: 0.85,
    metalness: 0.1,
  });

  const lowerHookMaterial = new THREE.MeshStandardMaterial({
    color: 0xf59e0b, // Polyamide amber
    roughness: 0.35,
    metalness: 0.15,
    wireframe: false,
  });

  const upperHookMaterial = new THREE.MeshStandardMaterial({
    color: 0x0ea5e9, // Same source geometry; blue distinguishes the rotated piece.
    roughness: 0.5,
    metalness: 0.05,
  });

  const lancetMaterial = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    emissive: 0x991b1b,
    emissiveIntensity: 0.6,
    roughness: 0.25,
    metalness: 0.8,
  });

  const bladeMaterial = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.15,
    metalness: 0.95,
  });

  const supportMaterial = new THREE.MeshStandardMaterial({
    color: 0x57534e,
    roughness: 0.72,
    metalness: 0.32,
  });
  const supportPlateGeo = new THREE.BoxGeometry(10.7, 0.3, 3.7);
  const supportPlateMesh = new THREE.Mesh(supportPlateGeo, supportMaterial);
  supportPlateMesh.name = "fixed-exhibit-support";
  supportPlateMesh.position.y = -0.15;
  supportPlateMesh.receiveShadow = true;
  rootGroup.add(supportPlateMesh);

  // 1. Lower Tape Assembly
  const lowerTapeGroup = new THREE.Group();
  lowerTapeGroup.name = "lower-tape";

  const lowerTapeGeo = new THREE.BoxGeometry(10, 0.2, 3);
  const lowerTapeMesh = new THREE.Mesh(lowerTapeGeo, tapeBackingMaterial);
  lowerTapeMesh.position.set(0, 0.1, 0);
  lowerTapeMesh.name = "lower-foundation-fabric";
  lowerTapeGroup.add(lowerTapeMesh);

  // 2. Procedural Lower Hook Array
  const lowerHookMeshes: THREE.Mesh[] = [];
  function buildHookGeometries(filamentDiameterMm: number, hookLengthMm: number) {
    const heightScale = hookLengthMm / MESTRAL_VELCRO_DEFAULTS.hookLengthMm;
    const radiusScale = filamentDiameterMm / MESTRAL_VELCRO_DEFAULTS.filamentDiameterMm;
    const hookCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0.7 * heightScale, 0),
      new THREE.Vector3(0, 0.95 * heightScale, 0),
      new THREE.Vector3(-0.15 * heightScale, 1.1 * heightScale, 0),
      new THREE.Vector3(-0.35 * heightScale, 1 * heightScale, 0),
      new THREE.Vector3(-0.4 * heightScale, 0.75 * heightScale, 0),
    ]);
    const lower = new THREE.TubeGeometry(hookCurve, 16, 0.045 * radiusScale, 8, false);
    const upper = lower.clone();
    upper.rotateZ(Math.PI);
    upper.rotateY(Math.PI / 2);
    const relaxedLower = new THREE.CylinderGeometry(
      0.045 * radiusScale,
      0.045 * radiusScale,
      0.95 * heightScale,
      8,
    );
    relaxedLower.translate(0, 0.475 * heightScale, 0);
    const relaxedUpper = relaxedLower.clone();
    relaxedUpper.rotateZ(Math.PI);
    return { lower, upper, relaxedLower, relaxedUpper };
  }

  let hookGeometries = buildHookGeometries(
    MESTRAL_VELCRO_DEFAULTS.filamentDiameterMm,
    MESTRAL_VELCRO_DEFAULTS.hookLengthMm,
  );
  let lastFilamentDiameterMm = MESTRAL_VELCRO_DEFAULTS.filamentDiameterMm;
  let lastHookLengthMm = MESTRAL_VELCRO_DEFAULTS.hookLengthMm;

  const numRows = 5;
  const numCols = 16;
  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      const hMesh = new THREE.Mesh(hookGeometries.lower, lowerHookMaterial);
      const x = -4.5 + c * 0.6;
      const z = -1.1 + r * 0.55;
      hMesh.position.set(x, 0.2, z);
      hMesh.name = `lower-hook-9-${r}-${c}`;
      lowerTapeGroup.add(hMesh);
      lowerHookMeshes.push(hMesh);
    }
  }

  // Figure 1 labels the other side of each slit loop as straight strand 10.
  // One representative strand per column keeps the source topology readable
  // without doubling the draw calls of the already magnified pile.
  const straightStrandGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.78, 8);
  const straightStrandMaterial = new THREE.MeshStandardMaterial({
    color: 0xa8a29e,
    roughness: 0.55,
    metalness: 0.05,
  });
  const lowerStraightStrands: THREE.Mesh[] = [];
  for (let c = 0; c < numCols; c++) {
    const strand = new THREE.Mesh(straightStrandGeo, straightStrandMaterial);
    strand.name = `lower-straight-strand-10-${c}`;
    strand.position.set(-4.5 + c * 0.6 + 0.2, 0.59, 1.28);
    lowerTapeGroup.add(strand);
    lowerStraightStrands.push(strand);
  }
  rootGroup.add(lowerTapeGroup);

  // 3. Upper Tape Assembly (Peelable Flap)
  const upperTapeGroup = new THREE.Group();
  upperTapeGroup.name = "upper-tape";

  // A single rigid backing cannot describe a peel front. Segment the flexible
  // tape along the peel direction, with each section owning the pile roots
  // attached to its lower face.
  const columnPitch = 0.6;
  const upperTapeSectionGeo = new THREE.BoxGeometry(columnPitch + 0.04, 0.2, 3);
  const upperTapeSections: THREE.Group[] = [];
  const upperTapeRestXs: number[] = [];
  for (let c = 0; c < numCols; c++) {
    const section = new THREE.Group();
    section.name = `upper-tape-section-${c}`;
    const restX = -4.5 + c * columnPitch;
    section.position.x = restX;
    upperTapeRestXs.push(restX);

    const backing = new THREE.Mesh(upperTapeSectionGeo, tapeBackingMaterial);
    // A loop's local y = 0 root sits exactly on this lower backing face.
    backing.position.y = 0.1;
    section.add(backing);
    upperTapeGroup.add(section);
    upperTapeSections.push(section);
  }

  // 4. Figure 2 does not show a modern loop face. It explicitly superposes two
  // pieces of this same hook fabric, rotates one 90 degrees, and faces their
  // piles together. Transform a clone so every upper hook points down and its
  // crook lies across the lower crook direction.
  const upperHookMeshes: THREE.Mesh[] = [];

  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      const lMesh = new THREE.Mesh(hookGeometries.upper, upperHookMaterial);
      const z = -1.1 + r * 0.55;
      lMesh.position.set(0, 0, z);
      lMesh.name = `upper-rotated-hook-9-${r}-${c}`;
      upperTapeSections[c]?.add(lMesh);
      upperHookMeshes.push(lMesh);
    }
  }

  const upperStraightStrands: THREE.Mesh[] = [];
  for (let c = 0; c < numCols; c++) {
    const strand = new THREE.Mesh(straightStrandGeo, straightStrandMaterial);
    strand.name = `upper-straight-strand-10-${c}`;
    strand.position.set(0, -0.39, 1.28);
    strand.rotation.z = Math.PI;
    upperTapeSections[c]?.add(strand);
    upperStraightStrands.push(strand);
  }
  rootGroup.add(upperTapeGroup);

  // The upper fabric is not held up by an invisible hand. A jaw clamp is
  // parented to its free edge and an arrow defines the external traction
  // boundary. It is an exhibit fixture, not a claimed patent component.
  const clampMaterial = new THREE.MeshStandardMaterial({
    color: 0xdbeafe,
    roughness: 0.22,
    metalness: 0.68,
  });
  const tractionMaterial = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    emissive: 0x7f1d1d,
    emissiveIntensity: 0.35,
    roughness: 0.4,
  });
  const clampJawGeo = new THREE.BoxGeometry(0.38, 0.5, 3.35);
  const clampBoltGeo = new THREE.CylinderGeometry(0.1, 0.1, 3.65, 12);
  clampBoltGeo.rotateX(Math.PI / 2);
  const tractionShaftGeo = new THREE.CylinderGeometry(0.055, 0.055, 0.65, 10);
  tractionShaftGeo.rotateZ(-Math.PI / 2);
  const tractionHeadGeo = new THREE.ConeGeometry(0.17, 0.42, 12);
  tractionHeadGeo.rotateZ(-Math.PI / 2);

  const peelClampGroup = new THREE.Group();
  peelClampGroup.name = "reader-applied-peel-clamp";
  peelClampGroup.position.set(columnPitch * 0.62, 0, 0);
  const jaw = new THREE.Mesh(clampJawGeo, clampMaterial);
  jaw.name = "peel-clamp-jaw";
  const bolt = new THREE.Mesh(clampBoltGeo, clampMaterial);
  bolt.name = "peel-clamp-bolt";
  bolt.position.x = 0.08;
  peelClampGroup.add(jaw, bolt);

  const tractionArrowGroup = new THREE.Group();
  tractionArrowGroup.name = "external-traction-boundary";
  tractionArrowGroup.position.x = 0.2;
  const tractionShaft = new THREE.Mesh(tractionShaftGeo, tractionMaterial);
  tractionShaft.position.x = 0.32;
  const tractionHead = new THREE.Mesh(tractionHeadGeo, tractionMaterial);
  tractionHead.position.x = 0.82;
  tractionArrowGroup.add(tractionShaft, tractionHead);
  peelClampGroup.add(tractionArrowGroup);
  upperTapeSections.at(-1)?.add(peelClampGroup);

  // 5. Heated Lancet Bar & Blade Assembly (Loom Fig. 1)
  const lancetBarGroup = new THREE.Group();
  lancetBarGroup.name = "lancet-bar-group";

  const lancetGeo = new THREE.CylinderGeometry(0.18, 0.18, 3.8, 20);
  lancetGeo.rotateX(Math.PI / 2);
  const lancetMesh = new THREE.Mesh(lancetGeo, lancetMaterial);
  lancetMesh.position.set(0, 0.7, 0);
  lancetBarGroup.add(lancetMesh);

  const bladeGeo = new THREE.BoxGeometry(0.1, 0.8, 0.4);
  const bladeMesh = new THREE.Mesh(bladeGeo, bladeMaterial);
  bladeMesh.position.set(0.15, 1.2, 0);
  bladeMesh.rotation.z = -0.35;
  lancetBarGroup.add(bladeMesh);

  lancetBarGroup.position.set(2.0, 0, 0);
  lancetBarGroup.visible = false; // toggled in loom mode
  rootGroup.add(lancetBarGroup);

  // Dynamic Update Function
  function update(controls: MestralVelcroControls, tel: MestralVelcroTelemetry, _timeSec = 0) {
    const peelRad = (controls.peelAngleDeg * Math.PI) / 180;
    // The display starts peeling from the right edge. More normalized advance
    // must mean more of the tape is detached, never less.
    const peelPivotX = 4.8 - tel.peelProgress * 9.6;
    const bendRadius = 0.9;
    const bendArcLength = bendRadius * peelRad;

    upperTapeGroup.position.set(0, 1.2, 0);
    upperTapeSections.forEach((section, index) => {
      const restX = upperTapeRestXs[index] ?? 0;
      const detachedDistance = Math.max(0, restX - peelPivotX);
      if (detachedDistance === 0) {
        section.position.set(restX, 0, 0);
        section.rotation.z = 0;
      } else {
        // Roll the first detached length through a circular bend, then continue
        // along its tangent. Arc length equals the original backing length, so
        // neighbouring centres never separate; the panel overlap closes the
        // small chord-versus-arc difference through the curved transition.
        if (detachedDistance <= bendArcLength) {
          const sectionAngle = detachedDistance / bendRadius;
          section.position.set(
            peelPivotX + bendRadius * Math.sin(sectionAngle),
            bendRadius * (1 - Math.cos(sectionAngle)),
            0,
          );
          section.rotation.z = sectionAngle;
        } else {
          const straightDistance = detachedDistance - bendArcLength;
          section.position.set(
            peelPivotX + bendRadius * Math.sin(peelRad) + straightDistance * Math.cos(peelRad),
            bendRadius * (1 - Math.cos(peelRad)) + straightDistance * Math.sin(peelRad),
            0,
          );
          section.rotation.z = peelRad;
        }
      }
    });

    const hookShapeVisible = tel.hookInterengagementAvailable;
    if (
      controls.filamentDiameterMm !== lastFilamentDiameterMm ||
      controls.hookLengthMm !== lastHookLengthMm
    ) {
      const next = buildHookGeometries(controls.filamentDiameterMm, controls.hookLengthMm);
      for (const hook of lowerHookMeshes) {
        hook.geometry = hookShapeVisible ? next.lower : next.relaxedLower;
      }
      for (const hook of upperHookMeshes) {
        hook.geometry = hookShapeVisible ? next.upper : next.relaxedUpper;
      }
      hookGeometries.lower.dispose();
      hookGeometries.upper.dispose();
      hookGeometries.relaxedLower.dispose();
      hookGeometries.relaxedUpper.dispose();
      hookGeometries = next;
      lastFilamentDiameterMm = controls.filamentDiameterMm;
      lastHookLengthMm = controls.hookLengthMm;
    }

    const rowCutoff = tel.visiblePileRows;
    lowerHookMeshes.forEach((hook, index) => {
      hook.geometry = hookShapeVisible ? hookGeometries.lower : hookGeometries.relaxedLower;
      hook.visible = Math.floor(index / numCols) < rowCutoff;
    });
    upperHookMeshes.forEach((hook, index) => {
      hook.geometry = hookShapeVisible ? hookGeometries.upper : hookGeometries.relaxedUpper;
      hook.visible = Math.floor(index / numCols) < rowCutoff;
    });

    // Claim inversions preserve an attached straight-pile comparison instead
    // of making the fabric disappear. The source does not calibrate a thermal
    // response curve, so the lancet is a binary topology indicator only.
    const straightScale = controls.filamentDiameterMm / MESTRAL_VELCRO_DEFAULTS.filamentDiameterMm;
    for (const strand of [...lowerStraightStrands, ...upperStraightStrands]) {
      strand.scale.set(straightScale, controls.hookLengthMm / 1.8, straightScale);
      strand.visible = true;
    }
    lancetMaterial.emissiveIntensity = tel.thermalSettingPresent ? 0.9 : 0.05;
    lancetMaterial.emissive.setHex(tel.thermalSettingPresent ? 0xdc2626 : 0x292524);
  }

  function dispose() {
    lowerTapeGeo.dispose();
    upperTapeSectionGeo.dispose();
    hookGeometries.lower.dispose();
    hookGeometries.upper.dispose();
    hookGeometries.relaxedLower.dispose();
    hookGeometries.relaxedUpper.dispose();
    straightStrandGeo.dispose();
    lancetGeo.dispose();
    bladeGeo.dispose();
    supportPlateGeo.dispose();
    clampJawGeo.dispose();
    clampBoltGeo.dispose();
    tractionShaftGeo.dispose();
    tractionHeadGeo.dispose();
    tapeBackingMaterial.dispose();
    lowerHookMaterial.dispose();
    upperHookMaterial.dispose();
    straightStrandMaterial.dispose();
    lancetMaterial.dispose();
    bladeMaterial.dispose();
    supportMaterial.dispose();
    clampMaterial.dispose();
    tractionMaterial.dispose();
  }

  return {
    rootGroup,
    supportPlateMesh,
    lowerTapeGroup,
    upperTapeGroup,
    upperTapeSections,
    upperTapeRestXs,
    lancetBarGroup,
    lowerHookMeshes,
    upperHookMeshes,
    lowerStraightStrands,
    upperStraightStrands,
    peelClampGroup,
    tractionArrowGroup,
    lancetMaterial,
    lowerHookMaterial,
    upperHookMaterial,
    update,
    dispose,
  };
}
