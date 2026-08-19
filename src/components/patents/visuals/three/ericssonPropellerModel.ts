/**
 * ericssonPropellerModel.ts
 *
 * Museum-Grade Procedural 3D Model for John Ericsson's 1838 Screw Propeller
 * (US Patent 588 - "Screw-Propeller for Vessels").
 *
 * Reconstructs the authentic historical apparatus of the SS Archimedes / Robert F. Stockton:
 * 1. Wooden ship stern deadwood keel block with aged oak planking and caulking seams.
 * 2. Bottom verdigris copper hull sheathing with copper rivets.
 * 3. Heavy cast-iron sternpost with bronze stuffing box and water-tight packing gland.
 * 4. Concentric hollow/solid steel drive shafts for contra-rotating motion (Claim 2).
 * 5. Forward and aft cylindrical hoop drums (Claim 1) with radial spokes and helical airfoil blades.
 * 6. Internal reversing bevel gear transmission inside the ship's stern.
 * 7. Rudder post, iron gudgeon/pintle hinges, and wooden rudder blade.
 * 8. Hydrodynamic wake streamlines and blade-tip cavitation vortex particles.
 */

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

/**
 * Deterministic unit noise for procedural grain generation.
 */
function deterministicUnit(index: number, channel: number): number {
  const sample = Math.sin((index + 1) * 12.9898 + (channel + 1) * 78.233) * 43758.5453;
  return sample - Math.floor(sample);
}

/**
 * Procedural Weathered Ship Hull Oak Plank Texture
 */
function createShipHullTexture(): THREE.CanvasTexture | undefined {
  if (typeof document === "undefined") return undefined;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;

  ctx.fillStyle = "#3b2210";
  ctx.fillRect(0, 0, 512, 512);

  // Horizontal plank seams and tar caulk lines
  for (let p = 0; p < 8; p++) {
    const y = p * 64;
    ctx.fillStyle = "#150a04";
    ctx.fillRect(0, y - 2, 512, 4);
  }

  // Coarse wood grain
  for (let i = 0; i < 90; i++) {
    const y = i * 5.7 + (deterministicUnit(i, 0) - 0.5) * 4;
    const alpha = 0.08 + (i % 4 === 0 ? 0.12 : 0.03);
    ctx.strokeStyle = `rgba(25, 12, 5, ${alpha})`;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(160, y + 8, 340, y - 8, 512, y + 4);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Procedural Verdigris Maritime Copper Sheathing Texture
 */
function createVerdigrisTexture(): THREE.CanvasTexture | undefined {
  if (typeof document === "undefined") return undefined;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;

  ctx.fillStyle = "#9a5628";
  ctx.fillRect(0, 0, 512, 512);

  // Verdigris oxidation patches (sea-green patina)
  for (let i = 0; i < 40; i++) {
    const cx = deterministicUnit(i, 0) * 512;
    const cy = deterministicUnit(i, 1) * 512;
    const r = 15 + deterministicUnit(i, 2) * 45;
    const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, r);
    grad.addColorStop(0, "rgba(52, 144, 118, 0.6)");
    grad.addColorStop(0.7, "rgba(38, 110, 89, 0.3)");
    grad.addColorStop(1, "rgba(154, 86, 40, 0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function buildEricssonPropellerModel(): EricssonPropellerModel {
  const lcg = createLcg(1838);
  const rootGroup = new THREE.Group();
  const materialsToDispose: THREE.Material[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];
  const texturesToDispose: THREE.Texture[] = [];

  const hullTex = createShipHullTexture();
  if (hullTex) texturesToDispose.push(hullTex);

  const copperTex = createVerdigrisTexture();
  if (copperTex) texturesToDispose.push(copperTex);

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
    ...(hullTex ? { map: hullTex } : {}),
    color: 0x4a2c14,
    roughness: 0.72,
    metalness: 0.06,
  });
  materialsToDispose.push(shipHullWood);

  const copperSheathing = new THREE.MeshStandardMaterial({
    ...(copperTex ? { map: copperTex } : {}),
    color: 0xa86030,
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
  const deadwoodGeo = new THREE.BoxGeometry(3.2, 5.0, 1.45);
  geometriesToDispose.push(deadwoodGeo);
  const deadwood = new THREE.Mesh(deadwoodGeo, shipHullWood);
  deadwood.position.set(-1.0, 1.2, 0);
  deadwood.castShadow = true;
  deadwood.receiveShadow = true;
  hullGroup.add(deadwood);

  // Bottom Copper Hull Sheathing Plate
  const copperGeo = new THREE.BoxGeometry(3.24, 1.8, 1.49);
  geometriesToDispose.push(copperGeo);
  const copperPlate = new THREE.Mesh(copperGeo, copperSheathing);
  copperPlate.position.set(-1.0, -0.4, 0);
  copperPlate.castShadow = true;
  hullGroup.add(copperPlate);

  // Heavy Cast-Iron Sternpost
  const sternpostGeo = new THREE.BoxGeometry(0.58, 5.4, 0.75);
  geometriesToDispose.push(sternpostGeo);
  const sternpost = new THREE.Mesh(sternpostGeo, castIronSternpost);
  sternpost.position.set(0.4, 1.0, 0);
  sternpost.castShadow = true;
  hullGroup.add(sternpost);

  // Stuffing Box Stern Tunnel Housing
  const tunnelGeo = new THREE.CylinderGeometry(0.48, 0.48, 1.8, 20);
  geometriesToDispose.push(tunnelGeo);
  const tunnel = new THREE.Mesh(tunnelGeo, castIronSternpost);
  tunnel.rotation.z = Math.PI / 2;
  tunnel.position.set(0.8, 0, 0);
  hullGroup.add(tunnel);

  // Bronze Stuffing Gland Packing Flange
  const glandGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.28, 20);
  geometriesToDispose.push(glandGeo);
  const gland = new THREE.Mesh(glandGeo, polishedBrass);
  gland.rotation.z = Math.PI / 2;
  gland.position.set(1.65, 0, 0);
  hullGroup.add(gland);

  // Rudder Post & Hinged Rudder Blade
  const rudderGroup = new THREE.Group();
  rudderGroup.position.set(3.8, 0, 0);
  rootGroup.add(rudderGroup);

  const rudderAftPostGeo = new THREE.BoxGeometry(0.48, 5.4, 0.58);
  geometriesToDispose.push(rudderAftPostGeo);
  const rudderAftPost = new THREE.Mesh(rudderAftPostGeo, castIronSternpost);
  rudderAftPost.position.set(0, 1.0, 0);
  rudderGroup.add(rudderAftPost);

  const rudderBladeGeo = new THREE.BoxGeometry(1.65, 4.4, 0.24);
  geometriesToDispose.push(rudderBladeGeo);
  const rudderMesh = new THREE.Mesh(rudderBladeGeo, shipHullWood);
  rudderMesh.position.set(0.9, 0.8, 0);
  rudderMesh.castShadow = true;
  rudderGroup.add(rudderMesh);

  // --- 3. CONCENTRIC DRIVE SHAFTS ---
  // Outer Hollow Shaft (drives forward drum)
  const outerShaftGeo = new THREE.CylinderGeometry(0.25, 0.25, 2.4, 20);
  geometriesToDispose.push(outerShaftGeo);
  const outerShaftMesh = new THREE.Mesh(outerShaftGeo, steelShaft);
  outerShaftMesh.rotation.z = Math.PI / 2;
  outerShaftMesh.position.set(-1.0, 0, 0);
  rootGroup.add(outerShaftMesh);

  // Inner Solid Shaft (extends through to aft drum)
  const innerShaftGeo = new THREE.CylinderGeometry(0.16, 0.16, 6.4, 20);
  geometriesToDispose.push(innerShaftGeo);
  const innerShaftMesh = new THREE.Mesh(innerShaftGeo, steelShaft);
  innerShaftMesh.rotation.z = Math.PI / 2;
  innerShaftMesh.position.set(0.6, 0, 0);
  rootGroup.add(innerShaftMesh);

  // Helper to build an Ericsson cylindrical drum with radial spokes and helical blades
  function buildEricssonDrum(pitchAngleRad: number, drumColor: THREE.MeshStandardMaterial) {
    const drumGroup = new THREE.Group();

    // Central Bronze Hub
    const hubGeo = new THREE.CylinderGeometry(0.44, 0.44, 0.88, 24);
    geometriesToDispose.push(hubGeo);
    const hub = new THREE.Mesh(hubGeo, polishedBrass);
    hub.rotation.z = Math.PI / 2;
    hub.castShadow = true;
    drumGroup.add(hub);

    // Outer Cylindrical Hoop Drum (Claim 1)
    const drumRadius = 2.2;
    const drumWidth = 0.78;
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

    // 6 Helical Spiral Airfoil Blades mounted on exterior of drum
    for (let b = 0; b < 6; b++) {
      const bladeAngle = (b * Math.PI) / 3;
      const bladeHolder = new THREE.Group();
      bladeHolder.rotation.x = bladeAngle;

      const bladeGeo = new THREE.BoxGeometry(0.74, 1.15, 0.09);
      geometriesToDispose.push(bladeGeo);
      const blade = new THREE.Mesh(bladeGeo, bronzeGunmetal);
      blade.position.set(0, drumRadius + 0.52, 0);
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
  const wakeCount = 240;
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

    // Luminous cyan / bubbly white
    wakeColors[idx] = 0.6 + lcg() * 0.4;
    wakeColors[idx + 1] = 0.85 + lcg() * 0.15;
    wakeColors[idx + 2] = 1.0;
  }

  wakeGeo.setAttribute("position", new THREE.BufferAttribute(wakePositions, 3));
  wakeGeo.setAttribute("color", new THREE.BufferAttribute(wakeColors, 3));

  const glowTex = createGlowPointTexture();
  if (glowTex) texturesToDispose.push(glowTex);

  const wakeMat = new THREE.PointsMaterial({
    size: 0.16,
    map: glowTex,
    vertexColors: true,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  materialsToDispose.push(wakeMat);

  const wakePoints = new THREE.Points(wakeGeo, wakeMat);
  rootGroup.add(wakePoints);

  const dispose = () => {
    for (const m of materialsToDispose) m.dispose();
    for (const g of geometriesToDispose) g.dispose();
    for (const t of texturesToDispose) t.dispose();
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
 * Updates contra-rotating drums, coaxial shafts, and hydrodynamic wake particle vortex.
 */
export function updateEricssonPropellerKinematics(
  model: EricssonPropellerModel,
  dt: number,
  displayOmegaRadPerS: number,
  wakeOpacityOrScale: number,
  flowSpeedOrRudder: number,
  swirlCoeffOrShowWake: number | boolean,
  showWakeOrCutaway?: boolean,
  isCutaway?: boolean,
) {
  const cutaway =
    typeof showWakeOrCutaway === "boolean" && isCutaway !== undefined
      ? isCutaway
      : Boolean(showWakeOrCutaway);
  const showWake =
    typeof swirlCoeffOrShowWake === "boolean"
      ? swirlCoeffOrShowWake
      : showWakeOrCutaway !== undefined
        ? Boolean(showWakeOrCutaway)
        : true;
  const rudderAngle =
    typeof flowSpeedOrRudder === "number" && Math.abs(flowSpeedOrRudder) <= 45
      ? flowSpeedOrRudder
      : 0;
  const wakeOpacity = typeof wakeOpacityOrScale === "number" ? wakeOpacityOrScale : 0.65;

  // 1. Cutaway Material Opacity
  if (cutaway) {
    model.materials.bronzeGunmetal.transparent = true;
    model.materials.bronzeGunmetal.opacity = 0.45;
  } else {
    model.materials.bronzeGunmetal.transparent = false;
    model.materials.bronzeGunmetal.opacity = 1.0;
  }

  // 2. Contra-Rotating Drums (Forward Drum rotates CW, Aft Drum rotates CCW)
  const angleDelta = displayOmegaRadPerS * dt;
  model.forwardDrumGroup.rotation.x += angleDelta;
  model.outerShaftMesh.rotation.x += angleDelta;

  model.aftDrumGroup.rotation.x -= angleDelta;
  model.innerShaftMesh.rotation.x -= angleDelta;

  // 3. Rudder Yaw Angle
  model.rudderMesh.rotation.y = (rudderAngle * Math.PI) / 180;

  // 4. Wake Cavitation Streamlines
  if (!showWake) {
    model.wakePoints.visible = false;
    return;
  }
  model.wakePoints.visible = true;
  model.materials.wakeMat.opacity = wakeOpacity;

  const positions = model.wakePositions;
  const flowSpeed = 6.5 * dt * (Math.abs(displayOmegaRadPerS) / 3.0);
  const swirlCoeff = 0.08 * dt * displayOmegaRadPerS;

  for (let i = 0; i < model.wakeCount; i++) {
    const idx = i * 3;
    positions[idx] += flowSpeed; // Move downstream

    // Swirl around propeller axis
    const y = positions[idx + 1];
    const z = positions[idx + 2];
    positions[idx + 1] = y * Math.cos(swirlCoeff) - z * Math.sin(swirlCoeff);
    positions[idx + 2] = y * Math.sin(swirlCoeff) + z * Math.cos(swirlCoeff);

    // Reset when exiting downstream bounding box
    if (positions[idx] > 10.0) {
      positions[idx] = 2.2;
      const r = 0.5 + deterministicUnit(i, 1) * 2.2;
      const a = deterministicUnit(i, 2) * Math.PI * 2;
      positions[idx + 1] = Math.cos(a) * r;
      positions[idx + 2] = Math.sin(a) * r;
    }
  }

  const attr = model.wakePoints.geometry.getAttribute("position") as THREE.BufferAttribute;
  if (attr) {
    attr.needsUpdate = true;
  }
}
