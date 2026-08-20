import * as THREE from "three";
import type { YaleLockState } from "@/physics/yaleLockKernel";

export interface YaleLockModelNodes {
  group: THREE.Group;
  housingGroup: THREE.Group;
  plugGroup: THREE.Group;
  keyGroup: THREE.Group;
  camGroup: THREE.Group;
  boltMesh: THREE.Mesh;
  pinStacks: Array<{
    driverMesh: THREE.Mesh;
    keyPinMesh: THREE.Mesh;
    springMesh: THREE.Mesh;
  }>;
  materials: THREE.Material[];
  geometries: THREE.BufferGeometry[];
  update: (state: YaleLockState, keyInsertion: number) => void;
  dispose: () => void;
}

export function createYaleLockModel(): YaleLockModelNodes {
  const group = new THREE.Group();
  const materials: THREE.Material[] = [];
  const geometries: THREE.BufferGeometry[] = [];

  // PBR Materials
  const brassHousingMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    metalness: 0.85,
    roughness: 0.25,
    transparent: true,
    opacity: 0.75, // Semi-transparent to reveal internal pin stacks
    depthWrite: true,
  });
  materials.push(brassHousingMat);

  const plugBrassMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.8,
    roughness: 0.2,
  });
  materials.push(plugBrassMat);

  const driverPinMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    metalness: 0.7,
    roughness: 0.3,
  });
  materials.push(driverPinMat);

  const keyPinMat = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    metalness: 0.7,
    roughness: 0.3,
  });
  materials.push(keyPinMat);

  const springMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    metalness: 0.9,
    roughness: 0.2,
  });
  materials.push(springMat);

  const steelKeyMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    metalness: 0.9,
    roughness: 0.15,
  });
  materials.push(steelKeyMat);

  const deadboltMat = new THREE.MeshStandardMaterial({
    color: 0x64748b,
    metalness: 0.85,
    roughness: 0.3,
  });
  materials.push(deadboltMat);

  // 1. Outer Cylinder Housing (Casing C)
  const housingGroup = new THREE.Group();
  const housingGeo = new THREE.CylinderGeometry(1.8, 1.8, 4.0, 32, 1, false);
  housingGeo.rotateZ(Math.PI / 2);
  geometries.push(housingGeo);
  const housingMesh = new THREE.Mesh(housingGeo, brassHousingMat);
  housingGroup.add(housingMesh);

  // Housing Flange / Escutcheon Ring at front
  const flangeGeo = new THREE.CylinderGeometry(2.1, 2.1, 0.3, 32);
  flangeGeo.rotateZ(Math.PI / 2);
  geometries.push(flangeGeo);
  const flangeMesh = new THREE.Mesh(flangeGeo, brassHousingMat);
  flangeMesh.position.x = -1.9;
  housingGroup.add(flangeMesh);

  group.add(housingGroup);

  // 2. Revolving Plug Cylinder (Core D)
  const plugGroup = new THREE.Group();
  plugGroup.position.set(0, -0.4, 0); // Mounted eccentrically in the lower half
  const plugGeo = new THREE.CylinderGeometry(0.85, 0.85, 4.2, 32);
  plugGeo.rotateZ(Math.PI / 2);
  geometries.push(plugGeo);
  const plugMesh = new THREE.Mesh(plugGeo, plugBrassMat);
  plugGroup.add(plugMesh);

  // Keyway slot cutout visual (dark inset)
  const slotGeo = new THREE.BoxGeometry(4.25, 0.9, 0.14);
  geometries.push(slotGeo);
  const slotMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
  materials.push(slotMat);
  const slotMesh = new THREE.Mesh(slotGeo, slotMat);
  plugGroup.add(slotMesh);

  group.add(plugGroup);

  // 3. 5 Pin Tumbler Stacks
  const pinStacks: Array<{
    driverMesh: THREE.Mesh;
    keyPinMesh: THREE.Mesh;
    springMesh: THREE.Mesh;
  }> = [];

  const numPins = 5;
  const pinSpacing = 0.65;
  const pinRadius = 0.16;

  for (let i = 0; i < numPins; i++) {
    const px = -1.3 + i * pinSpacing;

    // Driver Pin Geometry
    const driverGeo = new THREE.CylinderGeometry(pinRadius, pinRadius, 0.9, 16);
    geometries.push(driverGeo);
    const driverMesh = new THREE.Mesh(driverGeo, driverPinMat);
    driverMesh.position.set(px, 0.45, 0);
    group.add(driverMesh);

    // Key Pin Geometry
    const keyPinGeo = new THREE.CylinderGeometry(pinRadius, pinRadius, 0.8, 16);
    geometries.push(keyPinGeo);
    const keyPinMesh = new THREE.Mesh(keyPinGeo, keyPinMat);
    keyPinMesh.position.set(px, -0.4, 0);
    group.add(keyPinMesh);

    // Compression Spring Geometry
    const springGeo = new THREE.CylinderGeometry(
      pinRadius * 0.9,
      pinRadius * 0.9,
      0.6,
      12,
      6,
      true,
    );
    geometries.push(springGeo);
    const springMesh = new THREE.Mesh(springGeo, springMat);
    springMesh.position.set(px, 1.15, 0);
    group.add(springMesh);

    pinStacks.push({ driverMesh, keyPinMesh, springMesh });
  }

  // 4. Flat Serrated Key Blade
  const keyGroup = new THREE.Group();
  // Key Blade body
  const keyBladeGeo = new THREE.BoxGeometry(3.6, 0.7, 0.1);
  geometries.push(keyBladeGeo);
  const keyBladeMesh = new THREE.Mesh(keyBladeGeo, steelKeyMat);
  keyBladeMesh.position.set(1.8, 0, 0);
  keyGroup.add(keyBladeMesh);

  // Key Bow (Grip Ring)
  const bowGeo = new THREE.TorusGeometry(0.7, 0.18, 16, 32);
  bowGeo.rotateY(Math.PI / 2);
  geometries.push(bowGeo);
  const bowMesh = new THREE.Mesh(bowGeo, steelKeyMat);
  bowMesh.position.set(-0.2, 0, 0);
  keyGroup.add(bowMesh);

  keyGroup.position.set(-4.5, -0.4, 0);
  group.add(keyGroup);

  // 5. Lost-Motion Lazy-Arm Cam & Deadbolt
  const camGroup = new THREE.Group();
  camGroup.position.set(2.2, -0.4, 0);
  const camRingGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 24);
  camRingGeo.rotateZ(Math.PI / 2);
  geometries.push(camRingGeo);
  const camRingMesh = new THREE.Mesh(camRingGeo, deadboltMat);
  camGroup.add(camRingMesh);

  const camWingGeo = new THREE.BoxGeometry(0.18, 1.2, 0.35);
  geometries.push(camWingGeo);
  const camWingMesh = new THREE.Mesh(camWingGeo, driverPinMat);
  camWingMesh.position.set(0, 0.6, 0);
  camGroup.add(camWingMesh);

  group.add(camGroup);

  // Deadbolt Block
  const boltGeo = new THREE.BoxGeometry(0.8, 1.4, 0.6);
  geometries.push(boltGeo);
  const boltMesh = new THREE.Mesh(boltGeo, deadboltMat);
  boltMesh.position.set(2.5, 0.5, 0);
  group.add(boltMesh);

  // Animation / State update handler
  const update = (state: YaleLockState, keyInsertion: number) => {
    // 1. Key position: slides along X into keyway
    // keyInsertion = 0 (x = -4.5), keyInsertion = 1 (x = -2.1)
    const targetKeyX = -4.5 + keyInsertion * 2.4;
    keyGroup.position.x = targetKeyX;

    // 2. Pin stacks update (Shear line boundary at y = 0.45)
    state.pins.forEach((pin, i) => {
      const stack = pinStacks[i];
      if (!stack) return;

      // Vertical lift based on key progress & bitting
      const lift = (pin.currentElevationMm / 6.0) * 0.45;
      const keyPinY = -0.4 + lift;
      const driverPinY = keyPinY + 0.85;

      stack.keyPinMesh.position.y = keyPinY;
      stack.driverMesh.position.y = driverPinY;

      // Spring compression
      const springHeight = Math.max(0.2, 1.6 - driverPinY);
      stack.springMesh.scale.y = springHeight / 0.6;
      stack.springMesh.position.y = driverPinY + springHeight / 2 + 0.1;
    });

    // 3. Plug & Cam Rotation
    if (state.isUnlocked && state.plugAngleRad !== undefined) {
      plugGroup.rotation.x = state.plugAngleRad;
      camGroup.rotation.x = (state.lazyArmAngleDeg * Math.PI) / 180;
    } else {
      plugGroup.rotation.x = 0;
      camGroup.rotation.x = 0;
    }

    // 4. Deadbolt throw
    boltMesh.position.z = (state.boltExtensionMm / 18.0) * 0.8;
  };

  const dispose = () => {
    for (const g of geometries) {
      g.dispose();
    }
    for (const m of materials) {
      m.dispose();
    }
  };

  return {
    group,
    housingGroup,
    plugGroup,
    keyGroup,
    camGroup,
    boltMesh,
    pinStacks,
    materials,
    geometries,
    update,
    dispose,
  };
}
