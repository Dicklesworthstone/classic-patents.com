import * as THREE from "three";
import { createLcg } from "@/utils/lcg";
import { createGlowPointTexture } from "./ThreeStudioScene";

export interface EricssonPropellerModel {
  rootGroup: THREE.Group;
  hullGroup: THREE.Group;
  forwardDrumGroup: THREE.Group;
  aftDrumGroup: THREE.Group;
  innerShaftMesh: THREE.Mesh;
  outerShaftMesh: THREE.Mesh;
  rudderMesh: THREE.Mesh;
  wakePoints: THREE.Points;
  wakePositions: Float32Array;
  wakeCount: number;
  materials: {
    bronzeGunmetal: THREE.MeshStandardMaterial;
    polishedBrass: THREE.MeshStandardMaterial;
    shipHullWood: THREE.MeshStandardMaterial;
    copperSheathing: THREE.MeshStandardMaterial;
    steelShaft: THREE.MeshStandardMaterial;
    castIronSternpost: THREE.MeshStandardMaterial;
    wakeMat: THREE.PointsMaterial;
  };
  dispose: () => void;
}

export function buildEricssonPropellerModel(): EricssonPropellerModel {
  const lcg = createLcg(1838);
  const rootGroup = new THREE.Group();
  const materialsToDispose: THREE.Material[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];
  const texturesToDispose: THREE.Texture[] = [];

  // --- 1. AUTHENTIC MATERIALS ---
  const bronzeGunmetal = new THREE.MeshStandardMaterial({
    color: 0xc8963e,
    roughness: 0.28,
    metalness: 0.88,
  });
  materialsToDispose.push(bronzeGunmetal);

  const polishedBrass = new THREE.MeshStandardMaterial({
    color: 0xdfad36,
    roughness: 0.18,
    metalness: 0.92,
  });
  materialsToDispose.push(polishedBrass);

  const shipHullWood = new THREE.MeshStandardMaterial({
    color: 0x3d2714,
    roughness: 0.75,
    metalness: 0.08,
  });
  materialsToDispose.push(shipHullWood);

  const copperSheathing = new THREE.MeshStandardMaterial({
    color: 0xb87333,
    roughness: 0.42,
    metalness: 0.85,
  });
  materialsToDispose.push(copperSheathing);

  const steelShaft = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    roughness: 0.15,
    metalness: 0.95,
  });
  materialsToDispose.push(steelShaft);

  const castIronSternpost = new THREE.MeshStandardMaterial({
    color: 0x24272c,
    roughness: 0.6,
    metalness: 0.75,
  });
  materialsToDispose.push(castIronSternpost);

  // --- 2. SHIP STERN HULL, DEADWOOD & RUDDER ---
  const hullGroup = new THREE.Group();
  hullGroup.position.set(-3.6, 0, 0);
  rootGroup.add(hullGroup);

  // Wood Keel / Deadwood Block
  const deadwoodGeo = new THREE.BoxGeometry(3.0, 4.8, 1.4);
  geometriesToDispose.push(deadwoodGeo);
  const deadwood = new THREE.Mesh(deadwoodGeo, shipHullWood);
  deadwood.position.set(-1.0, 1.2, 0);
  deadwood.castShadow = true;
  deadwood.receiveShadow = true;
  hullGroup.add(deadwood);

  // Bottom Copper Hull Sheathing Plate
  const copperGeo = new THREE.BoxGeometry(3.04, 1.6, 1.44);
  geometriesToDispose.push(copperGeo);
  const copperPlate = new THREE.Mesh(copperGeo, copperSheathing);
  copperPlate.position.set(-1.0, -0.4, 0);
  hullGroup.add(copperPlate);

  // Heavy Cast-Iron Sternpost
  const sternpostGeo = new THREE.BoxGeometry(0.55, 5.2, 0.7);
  geometriesToDispose.push(sternpostGeo);
  const sternpost = new THREE.Mesh(sternpostGeo, castIronSternpost);
  sternpost.position.set(0.4, 1.0, 0);
  sternpost.castShadow = true;
  hullGroup.add(sternpost);

  // Stuffing Box Stern Tunnel Housing
  const tunnelGeo = new THREE.CylinderGeometry(0.45, 0.45, 1.6, 20);
  geometriesToDispose.push(tunnelGeo);
  const tunnel = new THREE.Mesh(tunnelGeo, castIronSternpost);
  tunnel.rotation.z = Math.PI / 2;
  tunnel.position.set(0.8, 0, 0);
  hullGroup.add(tunnel);

  // Bronze Stuffing Gland Packing Flange
  const glandGeo = new THREE.CylinderGeometry(0.52, 0.52, 0.25, 20);
  geometriesToDispose.push(glandGeo);
  const gland = new THREE.Mesh(glandGeo, polishedBrass);
  gland.rotation.z = Math.PI / 2;
  gland.position.set(1.6, 0, 0);
  hullGroup.add(gland);

  // Rudder Post & Hinged Rudder Blade
  const rudderGroup = new THREE.Group();
  rudderGroup.position.set(3.8, 0, 0);
  rootGroup.add(rudderGroup);

  const rudderAftPostGeo = new THREE.BoxGeometry(0.45, 5.2, 0.55);
  geometriesToDispose.push(rudderAftPostGeo);
  const rudderAftPost = new THREE.Mesh(rudderAftPostGeo, castIronSternpost);
  rudderAftPost.position.set(0, 1.0, 0);
  rudderGroup.add(rudderAftPost);

  const rudderBladeGeo = new THREE.BoxGeometry(1.6, 4.2, 0.22);
  geometriesToDispose.push(rudderBladeGeo);
  const rudderMesh = new THREE.Mesh(rudderBladeGeo, shipHullWood);
  rudderMesh.position.set(0.9, 0.8, 0);
  rudderMesh.castShadow = true;
  rudderGroup.add(rudderMesh);

  // --- 3. CONCENTRIC DRIVE SHAFTS ---
  // Outer Hollow Shaft (drives forward drum)
  const outerShaftGeo = new THREE.CylinderGeometry(0.24, 0.24, 2.2, 20);
  geometriesToDispose.push(outerShaftGeo);
  const outerShaftMesh = new THREE.Mesh(outerShaftGeo, steelShaft);
  outerShaftMesh.rotation.z = Math.PI / 2;
  outerShaftMesh.position.set(-1.0, 0, 0);
  rootGroup.add(outerShaftMesh);

  // Inner Solid Shaft (extends through to aft drum)
  const innerShaftGeo = new THREE.CylinderGeometry(0.15, 0.15, 6.2, 20);
  geometriesToDispose.push(innerShaftGeo);
  const innerShaftMesh = new THREE.Mesh(innerShaftGeo, steelShaft);
  innerShaftMesh.rotation.z = Math.PI / 2;
  innerShaftMesh.position.set(0.6, 0, 0);
  rootGroup.add(innerShaftMesh);

  // Helper to build an Ericsson cylindrical drum with radial spokes and helical blades
  function buildEricssonDrum(pitchAngleRad: number, drumColor: THREE.MeshStandardMaterial) {
    const drumGroup = new THREE.Group();

    // Central Bronze Hub
    const hubGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.85, 24);
    geometriesToDispose.push(hubGeo);
    const hub = new THREE.Mesh(hubGeo, polishedBrass);
    hub.rotation.z = Math.PI / 2;
    hub.castShadow = true;
    drumGroup.add(hub);

    // Outer Cylindrical Hoop Drum (Claim 1)
    const drumRadius = 2.2;
    const drumWidth = 0.75;
    const hoopGeo = new THREE.CylinderGeometry(drumRadius, drumRadius, drumWidth, 36, 1, true);
    geometriesToDispose.push(hoopGeo);
    const hoop = new THREE.Mesh(hoopGeo, drumColor);
    hoop.rotation.z = Math.PI / 2;
    hoop.castShadow = true;
    drumGroup.add(hoop);

    // Inner Reinforcement Ribs on Drum
    const ribGeo = new THREE.TorusGeometry(drumRadius, 0.05, 12, 36);
    geometriesToDispose.push(ribGeo);
    const ribFront = new THREE.Mesh(ribGeo, polishedBrass);
    ribFront.rotation.y = Math.PI / 2;
    ribFront.position.x = -drumWidth / 2;
    drumGroup.add(ribFront);

    const ribBack = new THREE.Mesh(ribGeo, polishedBrass);
    ribBack.rotation.y = Math.PI / 2;
    ribBack.position.x = drumWidth / 2;
    drumGroup.add(ribBack);

    // 4 Curved Radial Internal Spokes supporting the drum
    for (let s = 0; s < 4; s++) {
      const spokeAngle = (s * Math.PI) / 2;
      const spokeGeo = new THREE.CylinderGeometry(0.06, 0.08, drumRadius - 0.35, 12);
      geometriesToDispose.push(spokeGeo);
      const spoke = new THREE.Mesh(spokeGeo, polishedBrass);
      spoke.position.set(
        0,
        ((drumRadius + 0.35) / 2) * Math.cos(spokeAngle),
        ((drumRadius + 0.35) / 2) * Math.sin(spokeAngle),
      );
      spoke.rotation.z = spokeAngle + Math.PI / 2;
      drumGroup.add(spoke);
    }

    // 6 Helical Spiral Blades mounted on exterior of drum
    for (let b = 0; b < 6; b++) {
      const bladeAngle = (b * Math.PI) / 3;
      const bladeHolder = new THREE.Group();
      bladeHolder.rotation.x = bladeAngle;

      const bladeGeo = new THREE.BoxGeometry(0.72, 1.1, 0.08);
      geometriesToDispose.push(bladeGeo);
      const blade = new THREE.Mesh(bladeGeo, bronzeGunmetal);
      blade.position.set(0, drumRadius + 0.5, 0);
      blade.rotation.y = pitchAngleRad;
      blade.castShadow = true;
      bladeHolder.add(blade);

      drumGroup.add(bladeHolder);
    }

    return drumGroup;
  }

  // --- 4. FORWARD DRUM (+X = -0.2) ---
  const forwardDrumGroup = buildEricssonDrum(Math.PI / 5, bronzeGunmetal);
  forwardDrumGroup.position.set(-0.2, 0, 0);
  rootGroup.add(forwardDrumGroup);

  // --- 5. AFT COUNTER-ROTATING DRUM (+X = +1.6) ---
  const aftDrumGroup = buildEricssonDrum(-Math.PI / 5, bronzeGunmetal);
  aftDrumGroup.position.set(1.6, 0, 0);
  rootGroup.add(aftDrumGroup);

  // --- 6. HYDRODYNAMIC CAVITATION & WAKE STREAMLINES ---
  const wakeCount = 220;
  const wakeGeo = new THREE.BufferGeometry();
  geometriesToDispose.push(wakeGeo);
  const wakePositions = new Float32Array(wakeCount * 3);
  const wakeColors = new Float32Array(wakeCount * 3);

  for (let i = 0; i < wakeCount; i++) {
    const idx = i * 3;
    const r = 0.6 + lcg() * 2.4;
    const a = lcg() * Math.PI * 2;
    wakePositions[idx] = 2.2 + lcg() * 8.0; // Downstream along +X
    wakePositions[idx + 1] = Math.cos(a) * r;
    wakePositions[idx + 2] = Math.sin(a) * r;

    // Ocean blue/cyan foam
    wakeColors[idx] = 0.35 + lcg() * 0.25;
    wakeColors[idx + 1] = 0.78 + lcg() * 0.2;
    wakeColors[idx + 2] = 0.95 + lcg() * 0.05;
  }

  wakeGeo.setAttribute("position", new THREE.BufferAttribute(wakePositions, 3));
  wakeGeo.setAttribute("color", new THREE.BufferAttribute(wakeColors, 3));

  const waterGlowTex = createGlowPointTexture();
  texturesToDispose.push(waterGlowTex);

  const wakeMat = new THREE.PointsMaterial({
    size: 0.32,
    map: waterGlowTex,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  materialsToDispose.push(wakeMat);

  const wakePoints = new THREE.Points(wakeGeo, wakeMat);
  rootGroup.add(wakePoints);

  const dispose = () => {
    for (const geo of geometriesToDispose) geo.dispose();
    for (const mat of materialsToDispose) mat.dispose();
    for (const tex of texturesToDispose) tex.dispose();
  };

  return {
    rootGroup,
    hullGroup,
    forwardDrumGroup,
    aftDrumGroup,
    innerShaftMesh,
    outerShaftMesh,
    rudderMesh,
    wakePoints,
    wakePositions,
    wakeCount,
    materials: {
      bronzeGunmetal,
      polishedBrass,
      shipHullWood,
      copperSheathing,
      steelShaft,
      castIronSternpost,
      wakeMat,
    },
    dispose,
  };
}

/**
 * Updates Ericsson contra-rotating propeller drums, wake vortex, and cutaway state.
 */
export function updateEricssonPropellerKinematics(
  model: EricssonPropellerModel,
  dt: number,
  shaftOmegaRadPerS: number,
  wakeSwirlScale: number,
  wakeFlowSpeed: number,
  wakeSwirlCoeff: number,
  showWake: boolean,
  isCutaway = false,
): void {
  // Counter-rotating propeller drums (US Patent 588)
  const dAngle = shaftOmegaRadPerS * dt;
  model.forwardDrumGroup.rotation.x += dAngle;
  model.aftDrumGroup.rotation.x -= dAngle;

  if (showWake) {
    model.wakePoints.visible = true;
    const wPos = model.wakePositions;
    const flowVelocity = wakeFlowSpeed * dt;
    const swirlVelocity = shaftOmegaRadPerS * wakeSwirlCoeff * dt * wakeSwirlScale;

    for (let i = 0; i < model.wakeCount; i++) {
      const idx = i * 3;
      wPos[idx] += flowVelocity; // Travel downstream (+X)

      // Swirl vortex
      const y = wPos[idx + 1];
      const z = wPos[idx + 2];
      wPos[idx + 1] = y * Math.cos(swirlVelocity) - z * Math.sin(swirlVelocity);
      wPos[idx + 2] = y * Math.sin(swirlVelocity) + z * Math.cos(swirlVelocity);

      // Recycle downstream particles
      if (wPos[idx] > 10.5) {
        wPos[idx] = 2.2;
      }
    }
    model.wakePoints.geometry.attributes.position.needsUpdate = true;
  } else {
    model.wakePoints.visible = false;
  }

  // Cutaway mode
  model.materials.bronzeGunmetal.opacity = isCutaway ? 0.45 : 1.0;
  model.materials.bronzeGunmetal.transparent = isCutaway;
  model.materials.shipHullWood.opacity = isCutaway ? 0.35 : 1.0;
  model.materials.shipHullWood.transparent = isCutaway;
}
