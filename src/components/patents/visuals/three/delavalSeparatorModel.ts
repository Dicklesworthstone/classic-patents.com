/**
 * delavalSeparatorModel.ts
 *
 * Museum-Grade Procedural 3D Model for Gustaf de Laval's 1881 Continuous Centrifugal Cream Separator
 * (US Patent 247,804).
 *
 * Reconstructs the authentic 19th-century Swedish dairy engineering landmark:
 * 1. Heavy tripod cast-iron pedestal with mounting feet, oil sump, and belt-driven speed-multiplier pulley.
 * 2. Flexible vertical steel spindle designed to rotate self-centered above its critical resonant speed.
 * 3. High-speed forged-steel centrifuge bowl with conical upper bonnet, central raw milk feed tube, and
 *    internal vertical radial wing baffles preventing fluid slip.
 * 4. Dual peripheral skim-milk riser conduits and central cream weir discharge collar.
 * 5. Concentric tinned-brass collecting pans with angled discharge spouts for cream and skim milk.
 * 6. Overhead brass supply funnel with regulating float valve.
 * 7. Cutaway fluid layers: outer dense skim milk ($1035\\text{ kg/m}^3$) and inner light cream core ($920\\text{ kg/m}^3$).
 */

import * as THREE from "three";
import { fluidFrames, sampleFluidAt } from "@/physics/genericWasm";

/** Cream/skim drop advance from the Stam-style fluid tape. */
export function delavalFluidAdvance(elapsedSec: number, laneU: number): number {
  const fluid = fluidFrames(16, 8);
  const frame = Math.abs(Math.floor(elapsedSec * 4)) % 8;
  return 1 + sampleFluidAt(fluid, 16, 8, frame, laneU, 0.45);
}

export interface DeLavalSeparatorModel {
  rootGroup: THREE.Group;
  bowlGroup: THREE.Group;
  spindleGroup: THREE.Group;
  pulleyGroup: THREE.Group;
  receiverGroup: THREE.Group;
  floatValve: THREE.Group;
  creamDrops: THREE.Mesh[];
  skimDrops: THREE.Mesh[];
  materials: {
    castIron: THREE.MeshStandardMaterial;
    polishedSteel: THREE.MeshStandardMaterial;
    tinnedBrass: THREE.MeshStandardMaterial;
    cream: THREE.MeshStandardMaterial;
    skimMilk: THREE.MeshStandardMaterial;
  };
  dispose: () => void;
}

export function buildDeLavalSeparatorModel(): DeLavalSeparatorModel {
  const rootGroup = new THREE.Group();
  const materialsToDispose: THREE.Material[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];
  const texturesToDispose: THREE.Texture[] = [];

  // --- 1. MATERIALS ---
  const castIron = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.6,
    metalness: 0.75,
  });
  materialsToDispose.push(castIron);

  const polishedSteel = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.12,
    metalness: 0.95,
  });
  materialsToDispose.push(polishedSteel);

  const tinnedBrass = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.25,
    metalness: 0.88,
  });
  materialsToDispose.push(tinnedBrass);

  const cream = new THREE.MeshStandardMaterial({
    color: 0xfef08a,
    roughness: 0.28,
    metalness: 0.05,
  });
  materialsToDispose.push(cream);

  const skimMilk = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.32,
    metalness: 0.05,
  });
  materialsToDispose.push(skimMilk);

  // --- 2. CAST-IRON PEDESTAL STAND & BASE ---
  const pedestalGroup = new THREE.Group();
  rootGroup.add(pedestalGroup);

  // Pedestal Column
  const columnGeo = new THREE.CylinderGeometry(0.85, 1.4, 3.6, 24);
  geometriesToDispose.push(columnGeo);
  const column = new THREE.Mesh(columnGeo, castIron);
  column.position.y = -1.8;
  column.receiveShadow = true;
  pedestalGroup.add(column);

  // 3 Curved Tripod Mounting Feet with Anchor Bolt Holes
  for (let f = 0; f < 3; f++) {
    const fAngle = (f * Math.PI * 2) / 3;
    const footGroup = new THREE.Group();
    footGroup.rotation.y = fAngle;
    pedestalGroup.add(footGroup);

    const footGeo = new THREE.BoxGeometry(0.5, 0.4, 1.6);
    geometriesToDispose.push(footGeo);
    const foot = new THREE.Mesh(footGeo, castIron);
    foot.position.set(0, -3.4, 1.2);
    foot.rotation.x = -0.15;
    foot.receiveShadow = true;
    footGroup.add(foot);

    const boltGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.2, 6);
    geometriesToDispose.push(boltGeo);
    const bolt = new THREE.Mesh(boltGeo, polishedSteel);
    bolt.position.set(0, -3.3, 1.8);
    footGroup.add(bolt);
  }

  // --- 3. BELT DRIVE PULLEY & MULTIPLIER GEAR ---
  const pulleyGroup = new THREE.Group();
  pulleyGroup.position.set(0, -2.2, 0);
  rootGroup.add(pulleyGroup);

  const pulleyGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.35, 32);
  geometriesToDispose.push(pulleyGeo);
  const pulley = new THREE.Mesh(pulleyGeo, castIron);
  pulley.castShadow = true;
  pulleyGroup.add(pulley);

  const beltRimGeo = new THREE.TorusGeometry(1.22, 0.05, 8, 32);
  geometriesToDispose.push(beltRimGeo);
  const beltRim = new THREE.Mesh(beltRimGeo, polishedSteel);
  beltRim.rotation.x = Math.PI / 2;
  pulleyGroup.add(beltRim);

  // --- 4. FLEXIBLE VERTICAL SPINDLE ASSEMBLY ---
  const spindleGroup = new THREE.Group();
  spindleGroup.position.set(0, 0.6, 0);
  rootGroup.add(spindleGroup);

  // Flexible steel spindle shaft (Claim 1)
  const spindleGeo = new THREE.CylinderGeometry(0.09, 0.09, 4.2, 16);
  geometriesToDispose.push(spindleGeo);
  const spindle = new THREE.Mesh(spindleGeo, polishedSteel);
  spindle.position.y = -1.0;
  spindle.castShadow = true;
  spindleGroup.add(spindle);

  // Lower footstep pivot bearing cup
  const pivotGeo = new THREE.CylinderGeometry(0.25, 0.15, 0.4, 16);
  geometriesToDispose.push(pivotGeo);
  const pivot = new THREE.Mesh(pivotGeo, tinnedBrass);
  pivot.position.y = -2.9;
  spindleGroup.add(pivot);

  // --- 5. HIGH-SPEED CENTRIFUGAL SEPARATOR BOWL (Claim 1 & Claim 2) ---
  const bowlGroup = new THREE.Group();
  spindleGroup.add(bowlGroup);

  // Bowl Bottom & Cylindrical Body
  const bowlPoints: THREE.Vector2[] = [];
  bowlPoints.push(new THREE.Vector2(0.12, -1.2));
  bowlPoints.push(new THREE.Vector2(0.65, -1.0));
  bowlPoints.push(new THREE.Vector2(1.65, -0.4));
  bowlPoints.push(new THREE.Vector2(1.65, 0.6));
  bowlPoints.push(new THREE.Vector2(1.1, 1.4));
  bowlPoints.push(new THREE.Vector2(0.45, 1.8));
  bowlPoints.push(new THREE.Vector2(0.35, 2.0));
  bowlPoints.push(new THREE.Vector2(0.15, 2.0));

  const bowlGeo = new THREE.LatheGeometry(bowlPoints, 36);
  geometriesToDispose.push(bowlGeo);
  const bowlMesh = new THREE.Mesh(bowlGeo, polishedSteel);
  bowlMesh.castShadow = true;
  bowlGroup.add(bowlMesh);

  // Threaded bowl clamp lock ring
  const clampRingGeo = new THREE.TorusGeometry(1.68, 0.08, 8, 36);
  geometriesToDispose.push(clampRingGeo);
  const clampRing = new THREE.Mesh(clampRingGeo, tinnedBrass);
  clampRing.rotation.x = Math.PI / 2;
  clampRing.position.y = 0.55;
  bowlGroup.add(clampRing);

  // Central Vertical Feed Tube (bringing whole milk to bottom)
  const feedTubeGeo = new THREE.CylinderGeometry(0.14, 0.14, 2.8, 16);
  geometriesToDispose.push(feedTubeGeo);
  const feedTube = new THREE.Mesh(feedTubeGeo, tinnedBrass);
  feedTube.position.y = 0.6;
  bowlGroup.add(feedTube);

  // 4 Internal Vertical Radial Anti-Slip Baffle Wings (US Patent 247,804)
  for (let w = 0; w < 4; w++) {
    const wAngle = (w * Math.PI * 2) / 4;
    const wingGeo = new THREE.BoxGeometry(1.2, 1.6, 0.03);
    geometriesToDispose.push(wingGeo);
    const wing = new THREE.Mesh(wingGeo, tinnedBrass);
    wing.position.set(Math.cos(wAngle) * 0.75, 0.1, Math.sin(wAngle) * 0.75);
    wing.rotation.y = -wAngle;
    bowlGroup.add(wing);
  }

  // 2 Skim Milk Peripheral Riser Tubes (leading to top discharge)
  for (const sign of [-1, 1]) {
    const riserGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.9, 12);
    geometriesToDispose.push(riserGeo);
    const riser = new THREE.Mesh(riserGeo, tinnedBrass);
    riser.position.set(sign * 1.5, 0.35, 0);
    bowlGroup.add(riser);
  }

  // Fluid Separation Zones: Inner Cream Core & Outer Skim Milk Cylinder
  const creamCoreGeo = new THREE.CylinderGeometry(0.55, 0.55, 1.4, 24);
  geometriesToDispose.push(creamCoreGeo);
  const creamCore = new THREE.Mesh(creamCoreGeo, cream);
  creamCore.position.y = 0.2;
  bowlGroup.add(creamCore);

  const skimRingGeo = new THREE.RingGeometry(0.6, 1.55, 24);
  geometriesToDispose.push(skimRingGeo);
  const skimRing = new THREE.Mesh(skimRingGeo, skimMilk);
  skimRing.rotation.x = -Math.PI / 2;
  skimRing.position.y = 0.85;
  bowlGroup.add(skimRing);

  // --- 6. CONCENTRIC COLLECTING PANS & DISCHARGE SPOUTS ---
  const receiverGroup = new THREE.Group();
  receiverGroup.position.set(0, 2.2, 0);
  rootGroup.add(receiverGroup);

  // Lower Skim Milk Collecting Pan
  const skimPanGeo = new THREE.CylinderGeometry(1.45, 1.25, 0.5, 32, 1, true);
  geometriesToDispose.push(skimPanGeo);
  const skimPan = new THREE.Mesh(skimPanGeo, tinnedBrass);
  skimPan.position.y = 0.15;
  receiverGroup.add(skimPan);

  // Skim Milk Curved Output Spout (directed to left bucket)
  const skimSpoutGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.8, 16);
  geometriesToDispose.push(skimSpoutGeo);
  const skimSpout = new THREE.Mesh(skimSpoutGeo, tinnedBrass);
  skimSpout.rotation.z = -Math.PI / 3;
  skimSpout.position.set(-1.6, 0.05, 0);
  skimSpout.castShadow = true;
  receiverGroup.add(skimSpout);

  // Upper Cream Collecting Pan
  const creamPanGeo = new THREE.CylinderGeometry(1.25, 1.05, 0.5, 32, 1, true);
  geometriesToDispose.push(creamPanGeo);
  const creamPan = new THREE.Mesh(creamPanGeo, tinnedBrass);
  creamPan.position.y = 0.75;
  receiverGroup.add(creamPan);

  // Cream Output Spout (directed to right jar)
  const creamSpoutGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.6, 16);
  geometriesToDispose.push(creamSpoutGeo);
  const creamSpout = new THREE.Mesh(creamSpoutGeo, tinnedBrass);
  creamSpout.rotation.z = Math.PI / 3;
  creamSpout.position.set(1.45, 0.65, 0);
  creamSpout.castShadow = true;
  receiverGroup.add(creamSpout);

  // --- 7. OVERHEAD MILK SUPPLY FUNNEL & REGULATING FLOAT ---
  const floatValve = new THREE.Group();
  floatValve.position.set(0, 3.4, 0);
  rootGroup.add(floatValve);

  // Large Conical Milk Hopper Funnel
  const funnelGeo = new THREE.ConeGeometry(1.6, 1.5, 32, 1, true);
  geometriesToDispose.push(funnelGeo);
  const funnel = new THREE.Mesh(funnelGeo, tinnedBrass);
  funnel.position.y = 0.6;
  funnel.castShadow = true;
  floatValve.add(funnel);

  // Regulating float cup
  const floatCupGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.45, 20);
  geometriesToDispose.push(floatCupGeo);
  const floatCup = new THREE.Mesh(floatCupGeo, tinnedBrass);
  floatCup.position.y = -0.3;
  floatValve.add(floatCup);

  // Faucet shutoff handle
  const handleGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.6, 8);
  geometriesToDispose.push(handleGeo);
  const handle = new THREE.Mesh(handleGeo, polishedSteel);
  handle.rotation.z = Math.PI / 2;
  handle.position.set(0.4, 0.1, 0);
  floatValve.add(handle);

  // --- 8. DYNAMIC CREAM & SKIM MILK DROPLETS ---
  const creamDrops: THREE.Mesh[] = [];
  const skimDrops: THREE.Mesh[] = [];

  for (let i = 0; i < 12; i++) {
    const cDropGeo = new THREE.SphereGeometry(0.065, 8, 8);
    geometriesToDispose.push(cDropGeo);
    const cDrop = new THREE.Mesh(cDropGeo, cream);
    cDrop.position.set(2.2, 0.35 - i * 0.18, 0);
    receiverGroup.add(cDrop);
    creamDrops.push(cDrop);

    const sDropGeo = new THREE.SphereGeometry(0.08, 8, 8);
    geometriesToDispose.push(sDropGeo);
    const sDrop = new THREE.Mesh(sDropGeo, skimMilk);
    sDrop.position.set(-2.4, -0.3 - i * 0.2, 0);
    receiverGroup.add(sDrop);
    skimDrops.push(sDrop);
  }

  // --- DISPOSE CLEANUP ---
  const dispose = () => {
    for (const g of geometriesToDispose) g.dispose();
    for (const m of materialsToDispose) m.dispose();
    for (const t of texturesToDispose) t.dispose();
  };

  return {
    rootGroup,
    bowlGroup,
    spindleGroup,
    pulleyGroup,
    receiverGroup,
    floatValve,
    creamDrops,
    skimDrops,
    materials: {
      castIron,
      polishedSteel,
      tinnedBrass,
      cream,
      skimMilk,
    },
    dispose,
  };
}
