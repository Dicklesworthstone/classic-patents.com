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
  lancetBarGroup: THREE.Group;
  hookMeshes: THREE.Mesh[];
  loopMeshes: THREE.Mesh[];
  lancetMaterial: THREE.MeshStandardMaterial;
  hookMaterial: THREE.MeshStandardMaterial;
  loopMaterial: THREE.MeshStandardMaterial;
  update: (
    controls: MestralVelcroControls,
    tel: MestralVelcroTelemetry,
    peelProgress: number,
  ) => void;
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

  const upperTapeGeo = new THREE.BoxGeometry(10, 0.2, 3);
  const upperTapeMesh = new THREE.Mesh(upperTapeGeo, tapeBackingMaterial);
  upperTapeMesh.position.set(0, 0.1, 0);
  upperTapeGroup.add(upperTapeMesh);

  // 4. Procedural Upper Loop Array
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
      const x = -4.5 + c * 0.6;
      const z = -1.1 + r * 0.55;
      lMesh.position.set(x, 0, z);
      lMesh.rotation.y = (r * 0.4 + c * 0.2) * Math.PI;
      upperTapeGroup.add(lMesh);
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
  function update(
    controls: MestralVelcroControls,
    _tel: MestralVelcroTelemetry,
    peelProgress: number,
  ) {
    const peelRad = (controls.peelAngleDeg * Math.PI) / 180;
    const peelPivotX = -4.5 + peelProgress * 9.0;

    // Update Upper Tape Peeling Curve
    upperTapeGroup.position.set(0, 1.1, 0);

    // Dynamic Upper Loops Positioning along Peel Wave
    loopMeshes.forEach((mesh) => {
      const origX = mesh.position.x;
      if (origX > peelPivotX) {
        const deltaX = origX - peelPivotX;
        const liftY = deltaX * Math.sin(peelRad) * 0.8;
        mesh.position.y = liftY;
        mesh.rotation.z = deltaX * 0.15;
      } else {
        mesh.position.y = 0;
        mesh.rotation.z = 0;
      }
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
    upperTapeGeo.dispose();
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
