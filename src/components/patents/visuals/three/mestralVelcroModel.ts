/**
 * mestralVelcroModel.ts
 *
 * Procedural Three.js 3D geometric construction for George de Mestral's
 * Hook-and-Loop Fastener (US 2,717,437).
 *
 * Constructs:
 * 1. Lower substrate woven tape with procedural 3D array of upright polyamide hooks (strand 9, hook 4, lost strand 10).
 * 2. Upper opposing flexible tape with procedural 3D array of loop pile or cross-oriented hooks.
 * 3. Dynamic peeling deformation arc along Kendall peeling angle.
 * 4. Heated lancet bar and traveling cutting knife assembly.
 */

import * as THREE from "three";
import type { MestralVelcroControls, MestralVelcroTelemetry } from "@/physics/mestralVelcroKernel";

export interface MestralVelcro3DObjects {
  rootGroup: THREE.Group;
  lowerTapeGroup: THREE.Group;
  upperTapeGroup: THREE.Group;
  /** Consecutive flexible-backing sections that own their loop-pile roots. */
  upperTapeSections: THREE.Group[];
  lancetBarGroup: THREE.Group;
  hookMeshes: THREE.Mesh[];
  loopMeshes: THREE.Mesh[];
  lancetMaterial: THREE.MeshStandardMaterial;
  hookMaterial: THREE.MeshStandardMaterial;
  loopMaterial: THREE.MeshStandardMaterial;
  update: (controls: MestralVelcroControls, tel: MestralVelcroTelemetry, timeSec?: number) => void;
  dispose: () => void;
}

export function createMestralVelcroModel(): MestralVelcro3DObjects {
  const rootGroup = new THREE.Group();
  rootGroup.name = "mestral-velcro-root";

  // Materials
  const tapeBackingMaterial = new THREE.MeshStandardMaterial({
    color: 0x3b3836,
    roughness: 0.85,
    metalness: 0.1,
  });

  const hookMaterial = new THREE.MeshStandardMaterial({
    color: 0xf59e0b, // Polyamide amber
    roughness: 0.35,
    metalness: 0.15,
    wireframe: false,
  });

  const loopMaterial = new THREE.MeshStandardMaterial({
    color: 0x0ea5e9, // Flexible sky blue loops
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

  // 1. Lower Tape Assembly
  const lowerTapeGroup = new THREE.Group();
  lowerTapeGroup.name = "lower-tape";

  const lowerTapeGeo = new THREE.BoxGeometry(10, 0.2, 3);
  const lowerTapeMesh = new THREE.Mesh(lowerTapeGeo, tapeBackingMaterial);
  lowerTapeMesh.position.set(0, -0.1, 0);
  lowerTapeGroup.add(lowerTapeMesh);

  // 2. Procedural Lower Hook Array
  const hookMeshes: THREE.Mesh[] = [];
  const hookCurvePoints = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0.7, 0),
    new THREE.Vector3(0, 0.95, 0),
    new THREE.Vector3(-0.15, 1.1, 0),
    new THREE.Vector3(-0.35, 1.0, 0),
    new THREE.Vector3(-0.4, 0.75, 0),
  ];
  const hookCurve = new THREE.CatmullRomCurve3(hookCurvePoints);
  const baseHookGeo = new THREE.TubeGeometry(hookCurve, 16, 0.045, 8, false);

  const numRows = 5;
  const numCols = 16;
  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      const hMesh = new THREE.Mesh(baseHookGeo, hookMaterial);
      const x = -4.5 + c * 0.6;
      const z = -1.1 + r * 0.55;
      hMesh.position.set(x, 0, z);
      // Alternate hook orientations for isotropic capture
      if ((r + c) % 2 === 1) {
        hMesh.rotation.y = Math.PI;
      }
      lowerTapeGroup.add(hMesh);
      hookMeshes.push(hMesh);
    }
  }
  rootGroup.add(lowerTapeGroup);

  // 3. Upper Tape Assembly (Peelable Flap)
  const upperTapeGroup = new THREE.Group();
  upperTapeGroup.name = "upper-tape";

  // A single rigid backing cannot describe a peel front. Segment the flexible
  // tape along the peel direction, with each section owning the loop roots
  // attached to its lower face.
  const columnPitch = 0.6;
  const upperTapeSectionGeo = new THREE.BoxGeometry(columnPitch + 0.04, 0.2, 3);
  const upperTapeSections: THREE.Group[] = [];
  for (let c = 0; c < numCols; c++) {
    const section = new THREE.Group();
    section.name = `upper-tape-section-${c}`;
    section.position.x = -4.5 + c * columnPitch;

    const backing = new THREE.Mesh(upperTapeSectionGeo, tapeBackingMaterial);
    // A loop's local y = 0 root sits exactly on this lower backing face.
    backing.position.y = 0.1;
    section.add(backing);
    upperTapeGroup.add(section);
    upperTapeSections.push(section);
  }

  // 4. Procedural Upper Loop Array. Loops belong to their backing section;
  // no loop can move independently through empty space during a peel.
  const loopMeshes: THREE.Mesh[] = [];
  const loopCurvePoints = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(-0.15, -0.6, 0),
    new THREE.Vector3(0, -1.0, 0.1),
    new THREE.Vector3(0.15, -0.6, 0),
    new THREE.Vector3(0, 0, 0),
  ];
  const loopCurve = new THREE.CatmullRomCurve3(loopCurvePoints);
  const baseLoopGeo = new THREE.TubeGeometry(loopCurve, 14, 0.035, 6, true);

  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      const lMesh = new THREE.Mesh(baseLoopGeo, loopMaterial);
      const z = -1.1 + r * 0.55;
      lMesh.position.set(0, 0, z);
      lMesh.rotation.y = (r * 0.4 + c * 0.2) * Math.PI;
      upperTapeSections[c]?.add(lMesh);
      loopMeshes.push(lMesh);
    }
  }
  rootGroup.add(upperTapeGroup);

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
    const peelPivotX = 4.5 - tel.peelProgress * 9.0;
    // World lengths are a compact studio projection rather than measured tape
    // dimensions. Derive the section tilt from the displayed rise so both the
    // backing and loop pile remain geometrically continuous.
    const displayRisePerX = 0.8 * Math.sin(peelRad);
    const peeledSectionTilt = Math.atan2(displayRisePerX, 1);

    upperTapeGroup.position.set(0, 1.1, 0);
    upperTapeSections.forEach((section) => {
      const detachedDistance = Math.max(0, section.position.x - peelPivotX);
      section.position.y = detachedDistance * displayRisePerX;
      section.rotation.z = detachedDistance > 0 ? peeledSectionTilt : 0;
    });

    // Update lancet heat color
    const heatFrac = Math.min(1.0, Math.max(0, (controls.heatSettingTempC - 100) / 100));
    lancetMaterial.emissiveIntensity = 0.3 + heatFrac * 0.7;
    if (controls.heatSettingTempC > 145) {
      lancetMaterial.emissive.setHex(0xdc2626);
    } else {
      lancetMaterial.emissive.setHex(0xb45309);
    }
  }

  function dispose() {
    lowerTapeGeo.dispose();
    upperTapeSectionGeo.dispose();
    baseHookGeo.dispose();
    baseLoopGeo.dispose();
    lancetGeo.dispose();
    bladeGeo.dispose();
    tapeBackingMaterial.dispose();
    hookMaterial.dispose();
    loopMaterial.dispose();
    lancetMaterial.dispose();
    bladeMaterial.dispose();
  }

  return {
    rootGroup,
    lowerTapeGroup,
    upperTapeGroup,
    upperTapeSections,
    lancetBarGroup,
    hookMeshes,
    loopMeshes,
    lancetMaterial,
    hookMaterial,
    loopMaterial,
    update,
    dispose,
  };
}
