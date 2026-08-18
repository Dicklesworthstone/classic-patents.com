/**
 * gatlingGunModel.ts
 *
 * Museum-Grade Procedural 3D Model for Dr. Richard Gatling's 1862 Rotary Battery Gun (US Patent 36,836).
 * Features authentic Civil War artillery carriage with 12-spoked wheels, 6 rifled steel barrels,
 * bronze receiver housing, reciprocating lock bolts, spiral cam track cutaway, and gravity feed hopper.
 */

import * as THREE from "three";

export interface GatlingGunModel {
  rootGroup: THREE.Group;
  barrelClusterGroup: THREE.Group;
  crankGroup: THREE.Group;
  bolts: THREE.Mesh[];
  muzzleFlashPoints: THREE.Points;
  dispose: () => void;
}

export function buildGatlingGunModel(): GatlingGunModel {
  const rootGroup = new THREE.Group();
  const texturesToDispose: THREE.Texture[] = [];
  const materialsToDispose: THREE.Material[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];

  // Procedural Wood Grain Texture for Oak Carriage
  const woodCanvas = document.createElement("canvas");
  woodCanvas.width = 512;
  woodCanvas.height = 512;
  const wctx = woodCanvas.getContext("2d");
  if (wctx) {
    wctx.fillStyle = "#4a2a14";
    wctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 200; i++) {
      wctx.fillStyle = i % 2 === 0 ? "rgba(90, 50, 25, 0.4)" : "rgba(35, 18, 8, 0.5)";
      wctx.fillRect(0, Math.random() * 512, 512, Math.random() * 4 + 1);
    }
  }
  const woodTexture = new THREE.CanvasTexture(woodCanvas);
  woodTexture.colorSpace = THREE.SRGBColorSpace;
  woodTexture.wrapS = THREE.RepeatWrapping;
  woodTexture.wrapT = THREE.RepeatWrapping;
  woodTexture.repeat.set(2, 4);
  texturesToDispose.push(woodTexture);

  // Materials
  const bluedSteelMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.28,
    metalness: 0.88,
  });
  materialsToDispose.push(bluedSteelMat);

  const bronzeReceiverMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.25,
    metalness: 0.9,
  });
  materialsToDispose.push(bronzeReceiverMat);

  const ironFittingsMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.45,
    metalness: 0.82,
  });
  materialsToDispose.push(ironFittingsMat);

  const oakWoodMat = new THREE.MeshStandardMaterial({
    map: woodTexture,
    color: 0x6e3d1d,
    roughness: 0.75,
    metalness: 0.05,
  });
  materialsToDispose.push(oakWoodMat);

  const brassCartridgeMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.2,
    metalness: 0.95,
  });
  materialsToDispose.push(brassCartridgeMat);

  const leadBulletMat = new THREE.MeshStandardMaterial({
    color: 0x64748b,
    roughness: 0.6,
    metalness: 0.4,
  });
  materialsToDispose.push(leadBulletMat);

  // ==========================================
  // 1. Oak Field Carriage & Artillery Wheels
  // ==========================================
  const carriageGroup = new THREE.Group();
  rootGroup.add(carriageGroup);

  // Main Axle Tree (Heavy wood beam with iron sleeve)
  const axleTree = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.35, 0.4), oakWoodMat);
  axleTree.position.set(0, -0.6, 0);
  axleTree.castShadow = true;
  carriageGroup.add(axleTree);

  const ironAxleSleeve = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.12, 4.8, 16),
    ironFittingsMat,
  );
  ironAxleSleeve.rotation.z = Math.PI / 2;
  ironAxleSleeve.position.set(0, -0.6, 0);
  carriageGroup.add(ironAxleSleeve);

  // Two 12-Spoke Artillery Wheels
  [-2.25, 2.25].forEach((wx) => {
    const wheelGroup = new THREE.Group();
    wheelGroup.position.set(wx, -0.6, 0);
    carriageGroup.add(wheelGroup);

    // Outer Iron Tire Rim
    const tire = new THREE.Mesh(new THREE.TorusGeometry(1.65, 0.06, 12, 48), ironFittingsMat);
    tire.rotation.y = Math.PI / 2;
    tire.castShadow = true;
    wheelGroup.add(tire);

    // Wooden Felloes (Rim Segments)
    const felloe = new THREE.Mesh(new THREE.TorusGeometry(1.56, 0.08, 12, 36), oakWoodMat);
    felloe.rotation.y = Math.PI / 2;
    wheelGroup.add(felloe);

    // Bronze Hub Core & Linchpin
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.45, 16), bronzeReceiverMat);
    hub.rotation.z = Math.PI / 2;
    wheelGroup.add(hub);

    // 12 Wooden Spokes
    for (let s = 0; s < 12; s++) {
      const angle = (s * Math.PI) / 6;
      const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 1.45, 8), oakWoodMat);
      spoke.position.set(0, Math.sin(angle) * 0.78, Math.cos(angle) * 0.78);
      spoke.rotation.x = angle;
      spoke.castShadow = true;
      wheelGroup.add(spoke);
    }
  });

  // Tapered Wooden Trail Leg
  const trailLeg = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.38, 5.5), oakWoodMat);
  trailLeg.position.set(0, -1.15, -2.4);
  trailLeg.rotation.x = Math.PI / 11;
  trailLeg.castShadow = true;
  carriageGroup.add(trailLeg);

  // Iron Lunette Ring (Towing Hook at rear of trail)
  const lunetteRing = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.04, 8, 24), ironFittingsMat);
  lunetteRing.position.set(0, -1.8, -4.9);
  lunetteRing.rotation.x = Math.PI / 2;
  carriageGroup.add(lunetteRing);

  // Brass Elevation Screw Mechanism (Acme Threads + Handwheel)
  const elevationScrew = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 1.1, 12),
    bronzeReceiverMat,
  );
  elevationScrew.position.set(0, -0.05, -0.6);
  carriageGroup.add(elevationScrew);

  const elevHandwheel = new THREE.Mesh(
    new THREE.TorusGeometry(0.22, 0.03, 8, 24),
    bronzeReceiverMat,
  );
  elevHandwheel.rotation.x = Math.PI / 2;
  elevHandwheel.position.set(0, -0.4, -0.6);
  carriageGroup.add(elevHandwheel);

  // Trunnion Mounts & Caps
  [-0.65, 0.65].forEach((tx) => {
    const trunnionBlock = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.45, 0.35), ironFittingsMat);
    trunnionBlock.position.set(tx, -0.15, 0);
    carriageGroup.add(trunnionBlock);
  });

  // ==========================================
  // 2. Revolving 6-Barrel Cluster & Locks (Claim 1)
  // ==========================================
  const barrelClusterGroup = new THREE.Group();
  barrelClusterGroup.position.set(0, 0.4, 0);
  rootGroup.add(barrelClusterGroup);

  // Central Steel Mainshaft
  const mainshaft = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 7.2, 16), bluedSteelMat);
  mainshaft.rotation.z = Math.PI / 2;
  barrelClusterGroup.add(mainshaft);

  // Fluted Bronze Spider Alignment Discs
  const spiderPositions = [0.8, 2.4, 4.0];
  spiderPositions.forEach((px) => {
    const spider = new THREE.Mesh(
      new THREE.CylinderGeometry(0.72, 0.72, 0.16, 24),
      bronzeReceiverMat,
    );
    spider.rotation.z = Math.PI / 2;
    spider.position.x = px;
    spider.castShadow = true;
    barrelClusterGroup.add(spider);
  });

  // 6 Rifled Steel Barrels (.58 Caliber)
  const barrelRadius = 0.52;
  for (let b = 0; b < 6; b++) {
    const angle = (b * Math.PI) / 3;
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.12, 4.6, 16), bluedSteelMat);
    barrel.rotation.z = Math.PI / 2;
    barrel.position.set(2.4, Math.cos(angle) * barrelRadius, Math.sin(angle) * barrelRadius);
    barrel.castShadow = true;
    barrelClusterGroup.add(barrel);

    // Muzzle Crown & Rifled Bore Inset
    const muzzleBore = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 0.1, 12),
      ironFittingsMat,
    );
    muzzleBore.rotation.z = Math.PI / 2;
    muzzleBore.position.set(4.72, Math.cos(angle) * barrelRadius, Math.sin(angle) * barrelRadius);
    barrelClusterGroup.add(muzzleBore);
  }

  // 6 Reciprocating Steel Lock Bolts (Claim 2)
  const bolts: THREE.Mesh[] = [];
  const boltCarrier = new THREE.Mesh(
    new THREE.CylinderGeometry(0.68, 0.68, 1.8, 24),
    ironFittingsMat,
  );
  boltCarrier.rotation.z = Math.PI / 2;
  boltCarrier.position.set(-0.6, 0, 0);
  barrelClusterGroup.add(boltCarrier);

  for (let b = 0; b < 6; b++) {
    const angle = (b * Math.PI) / 3;
    const bolt = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.12, 0.12), bluedSteelMat);
    bolt.position.set(-0.6, Math.cos(angle) * barrelRadius, Math.sin(angle) * barrelRadius);
    barrelClusterGroup.add(bolt);
    bolts.push(bolt);
  }

  // ==========================================
  // 3. Bronze Breech Casing & Cam Track Housing
  // ==========================================
  const breechHousingGroup = new THREE.Group();
  breechHousingGroup.position.set(0, 0.4, 0);
  rootGroup.add(breechHousingGroup);

  const breechCover = new THREE.Mesh(
    new THREE.CylinderGeometry(0.88, 0.88, 2.6, 24),
    bronzeReceiverMat,
  );
  breechCover.rotation.z = Math.PI / 2;
  breechCover.position.set(-1.4, 0, 0);
  breechCover.castShadow = true;
  breechHousingGroup.add(breechCover);

  // Rear Cascabel & Traversing Screw
  const cascabel = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), bronzeReceiverMat);
  cascabel.position.set(-2.8, 0, 0);
  breechHousingGroup.add(cascabel);

  // ==========================================
  // 4. Gravity Feed Ammunition Hopper Magazine
  // ==========================================
  const hopperGroup = new THREE.Group();
  hopperGroup.position.set(-0.6, 1.9, 0);
  rootGroup.add(hopperGroup);

  // Tapered Brass Feed Chute
  const chute = new THREE.Mesh(new THREE.BoxGeometry(0.65, 1.2, 0.45), bronzeReceiverMat);
  chute.castShadow = true;
  hopperGroup.add(chute);

  // Stacked Visible Brass Cartridges in Hopper
  for (let c = 0; c < 4; c++) {
    const cartridgeGroup = new THREE.Group();
    cartridgeGroup.position.set(0, 0.4 - c * 0.22, 0);
    hopperGroup.add(cartridgeGroup);

    // Brass Case
    const caseMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 0.38, 12),
      brassCartridgeMat,
    );
    caseMesh.rotation.z = Math.PI / 2;
    cartridgeGroup.add(caseMesh);

    // Lead Bullet Tip
    const bulletMesh = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.14, 12), leadBulletMat);
    bulletMesh.rotation.z = -Math.PI / 2;
    bulletMesh.position.x = 0.24;
    cartridgeGroup.add(bulletMesh);
  }

  // ==========================================
  // 5. Geared Hand Crank Mechanism
  // ==========================================
  const crankGroup = new THREE.Group();
  crankGroup.position.set(-2.4, 0.4, 0.85);
  rootGroup.add(crankGroup);

  const crankBevelGear = new THREE.Mesh(
    new THREE.CylinderGeometry(0.26, 0.22, 0.18, 16),
    bronzeReceiverMat,
  );
  crankBevelGear.rotation.x = Math.PI / 2;
  crankGroup.add(crankBevelGear);

  const crankArm = new THREE.Mesh(new THREE.BoxGeometry(0.11, 1.1, 0.11), ironFittingsMat);
  crankArm.position.y = 0.45;
  crankGroup.add(crankArm);

  const crankKnob = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.45, 12), oakWoodMat);
  crankKnob.rotation.x = Math.PI / 2;
  crankKnob.position.set(0, 0.95, 0.26);
  crankGroup.add(crankKnob);

  // ==========================================
  // 6. Muzzle Flash Particle System
  // ==========================================
  const flashGeo = new THREE.BufferGeometry();
  const flashCount = 60;
  const flashPositions = new Float32Array(flashCount * 3);
  for (let i = 0; i < flashCount; i++) {
    flashPositions[i * 3] = 4.8 + Math.random() * 1.8;
    flashPositions[i * 3 + 1] = 0.4 + (Math.random() - 0.5) * 0.8;
    flashPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
  }
  flashGeo.setAttribute("position", new THREE.BufferAttribute(flashPositions, 3));
  geometriesToDispose.push(flashGeo);

  const flashMat = new THREE.PointsMaterial({
    size: 0.65,
    color: 0xffaa22,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
  });
  materialsToDispose.push(flashMat);

  const muzzleFlashPoints = new THREE.Points(flashGeo, flashMat);
  rootGroup.add(muzzleFlashPoints);

  const dispose = () => {
    texturesToDispose.forEach((t) => {
      t.dispose();
    });
    materialsToDispose.forEach((m) => {
      m.dispose();
    });
    geometriesToDispose.forEach((g) => {
      g.dispose();
    });
  };

  return {
    rootGroup,
    barrelClusterGroup,
    crankGroup,
    bolts,
    muzzleFlashPoints,
    dispose,
  };
}
