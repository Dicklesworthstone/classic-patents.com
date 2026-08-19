/**
 * hyattCelluloidModel.ts
 *
 * Museum-Grade Procedural 3D Model for John Wesley Hyatt's 1870 Camphor-Pyroxyline Celluloid Press
 * (US Patent 105,338 - "Improvement in Treating and Molding Pyroxyline").
 *
 * Reconstructs the historic 1870 apparatus that founded the synthetic plastics industry:
 * 1. Heavy cast-iron press bedplate with 4 polished steel tie-rod tension columns and bronze hex nuts.
 * 2. Annular steam-jacketed heating cylinder with brass piping manifold, gate valves, and Bourdon gauge (Claim 1).
 * 3. High-pressure hydraulic plunger ram with ground chrome piston and bronze packing gland (Claim 2).
 * 4. Precision brass extrusion nozzle die and translucent amber/tortoiseshell extruded celluloid billet.
 * 5. Two-piece split mold box with locking toggle lever for compression molding.
 * 6. Finished molded celluloid billiard balls (solid ivory-white cue ball and inlaid dark ball) on brass pedestals (Claim 3).
 * 7. Hydraulic pump accumulator cylinder and copper high-pressure tubing lines.
 */

import * as THREE from "three";
import { stepHyattCelluloid } from "@/physics/catalogKernels";
import { fluidFrames, sampleFluidAt } from "@/physics/genericWasm";

export interface HyattCelluloidModelNodes {
  rootGroup: THREE.Group;
  bedplate: THREE.Mesh;
  tieRods: THREE.Mesh[];
  barrelGroup: THREE.Group;
  jacket: THREE.Mesh;
  steamPipes: THREE.Mesh[];
  steamManifold?: THREE.Group;
  gaugeNeedle?: THREE.Mesh;
  ramGroup: THREE.Group;
  hydCyl: THREE.Mesh;
  ramPiston: THREE.Mesh;
  nozzleGroup: THREE.Group;
  nozzleCone: THREE.Mesh;
  rodMesh: THREE.Mesh;
  moldBoxGroup?: THREE.Group;
  billiardBalls: THREE.Mesh[];
  internalCore?: THREE.Mesh;
}

export interface HyattCelluloidMaterials {
  castIron: THREE.MeshStandardMaterial;
  polishedSteel: THREE.MeshStandardMaterial;
  brassPipes: THREE.MeshStandardMaterial;
  celluloidAmber: THREE.MeshPhysicalMaterial | THREE.MeshStandardMaterial;
  billiardBallWhite: THREE.MeshStandardMaterial;
  billiardBallAmber: THREE.MeshStandardMaterial;
  copperGasket?: THREE.MeshStandardMaterial;
}

export interface HyattCelluloidModelResult {
  rootGroup: THREE.Group;
  nodes: HyattCelluloidModelNodes;
  materials: HyattCelluloidMaterials;
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
 * Procedural Hammered 19th-Century Foundry Cast Iron Texture
 */
function createCastIronTexture(): THREE.CanvasTexture | undefined {
  if (typeof document === "undefined") return undefined;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;

  ctx.fillStyle = "#1e2229";
  ctx.fillRect(0, 0, 512, 512);

  // Micro-stippling & casting sand texture
  for (let i = 0; i < 900; i++) {
    const px = deterministicUnit(i, 0) * 512;
    const py = deterministicUnit(i, 1) * 512;
    const rad = 1.0 + deterministicUnit(i, 2) * 2.2;
    const tone = 20 + Math.floor(deterministicUnit(i, 3) * 35);
    ctx.fillStyle = `rgba(${tone}, ${tone + 4}, ${tone + 8}, 0.55)`;
    ctx.beginPath();
    ctx.arc(px, py, rad, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Procedural Translucent Tortoiseshell / Amber Celluloid Texture
 */
function createTortoiseshellTexture(): THREE.CanvasTexture | undefined {
  if (typeof document === "undefined") return undefined;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;

  // Luminous honey-amber base
  const grad = ctx.createLinearGradient(0, 0, 512, 512);
  grad.addColorStop(0, "#d97706");
  grad.addColorStop(0.5, "#b45309");
  grad.addColorStop(1, "#78350f");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Swirling organic camphor veins and dark obsidian mottles
  for (let i = 0; i < 40; i++) {
    const cx = deterministicUnit(i, 0) * 512;
    const cy = deterministicUnit(i, 1) * 512;
    const r = 20 + deterministicUnit(i, 2) * 80;
    const spotGrad = ctx.createRadialGradient(cx, cy, 4, cx, cy, r);
    spotGrad.addColorStop(0, "rgba(45, 18, 4, 0.75)");
    spotGrad.addColorStop(0.6, "rgba(120, 53, 15, 0.45)");
    spotGrad.addColorStop(1, "rgba(217, 119, 6, 0)");

    ctx.fillStyle = spotGrad;
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

/**
 * Procedural 1870 Bourdon Steam Pressure Gauge Dial Texture
 */
function createSteamGaugeTexture(): THREE.CanvasTexture | undefined {
  if (typeof document === "undefined") return undefined;
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;

  // Aged ivory parchment face
  ctx.fillStyle = "#faf6eb";
  ctx.beginPath();
  ctx.arc(128, 128, 124, 0, Math.PI * 2);
  ctx.fill();

  // Brass bezel border ring
  ctx.strokeStyle = "#854d0e";
  ctx.lineWidth = 6;
  ctx.stroke();

  // Dial calibrations
  ctx.strokeStyle = "#1c1917";
  ctx.lineWidth = 2;
  for (let a = 0; a <= 12; a++) {
    const angle = Math.PI * 0.75 + (a / 12) * (Math.PI * 1.5);
    const x1 = 128 + Math.cos(angle) * 105;
    const y1 = 128 + Math.sin(angle) * 105;
    const x2 = 128 + Math.cos(angle) * 88;
    const y2 = 128 + Math.sin(angle) * 88;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  // Dial Inscriptions
  ctx.fillStyle = "#292524";
  ctx.font = "bold 13px serif";
  ctx.textAlign = "center";
  ctx.fillText("HYATT & CO.", 128, 88);
  ctx.font = "9px sans-serif";
  ctx.fillText("STEAM PRESS · 1870", 128, 102);
  ctx.font = "bold 11px sans-serif";
  ctx.fillText("LBS / SQ. IN.", 128, 175);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function buildHyattCelluloidModel(): HyattCelluloidModelResult {
  const rootGroup = new THREE.Group();
  const materialsToDispose: THREE.Material[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];
  const texturesToDispose: THREE.Texture[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(geo: T): T => {
    geometriesToDispose.push(geo);
    return geo;
  };
  const trackMat = <T extends THREE.Material>(mat: T): T => {
    materialsToDispose.push(mat);
    return mat;
  };

  const castIronTex = createCastIronTexture();
  if (castIronTex) texturesToDispose.push(castIronTex);

  const tortoiseshellTex = createTortoiseshellTexture();
  if (tortoiseshellTex) texturesToDispose.push(tortoiseshellTex);

  const gaugeTex = createSteamGaugeTexture();
  if (gaugeTex) texturesToDispose.push(gaugeTex);

  // --- Museum-Grade PBR Materials ---
  const castIron = trackMat(
    new THREE.MeshStandardMaterial({
      ...(castIronTex ? { map: castIronTex } : {}),
      color: 0x242831,
      roughness: 0.68,
      metalness: 0.82,
    }),
  );

  const polishedSteel = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.1,
      metalness: 0.96,
    }),
  );

  const brassPipes = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.24,
      metalness: 0.9,
    }),
  );

  const copperGasket = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xb45309,
      roughness: 0.32,
      metalness: 0.92,
    }),
  );

  const celluloidAmber = trackMat(
    new THREE.MeshPhysicalMaterial({
      ...(tortoiseshellTex ? { map: tortoiseshellTex } : {}),
      color: 0xd97706,
      roughness: 0.14,
      metalness: 0.04,
      transmission: 0.82,
      ior: 1.49,
      transparent: true,
      opacity: 0.92,
      clearcoat: 0.95,
      clearcoatRoughness: 0.06,
    }),
  );

  const billiardBallWhite = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xfffdf5,
      roughness: 0.08,
      metalness: 0.02,
    }),
  );

  const billiardBallAmber = trackMat(
    new THREE.MeshStandardMaterial({
      ...(tortoiseshellTex ? { map: tortoiseshellTex } : {}),
      color: 0xb45309,
      roughness: 0.1,
      metalness: 0.04,
    }),
  );

  const materials: HyattCelluloidMaterials = {
    castIron,
    polishedSteel,
    brassPipes,
    celluloidAmber,
    billiardBallWhite,
    billiardBallAmber,
    copperGasket,
  };

  // --- 1. Heavy Cast-Iron Press Bedplate & Tension Columns ---
  const bedplate = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(12.4, 0.95, 6.0)),
    materials.castIron,
  );
  bedplate.position.y = -2.2;
  bedplate.receiveShadow = true;
  bedplate.castShadow = true;
  rootGroup.add(bedplate);

  // Machine foundation feet / mounting flanges
  const footGeo = trackGeo(new THREE.BoxGeometry(1.0, 0.45, 1.4));
  [
    [-5.6, -2.6, 2.4],
    [5.6, -2.6, 2.4],
    [-5.6, -2.6, -2.4],
    [5.6, -2.6, -2.4],
  ].forEach(([fx, fy, fz]) => {
    const foot = new THREE.Mesh(footGeo, materials.castIron);
    foot.position.set(fx, fy, fz);
    foot.castShadow = true;
    rootGroup.add(foot);
  });

  // 4 Heavy Polished Steel Tie-Rod Columns with Bronze Hex Nuts
  const tieRods: THREE.Mesh[] = [];
  const rodOffsets = [
    [-1.4, -1.8],
    [1.4, -1.8],
    [-1.4, 1.8],
    [1.4, 1.8],
  ];

  rodOffsets.forEach(([ty, tz]) => {
    const rod = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.19, 0.19, 10.2, 24)),
      materials.polishedSteel,
    );
    rod.rotation.z = Math.PI / 2;
    rod.position.set(0, ty, tz);
    rod.castShadow = true;
    rootGroup.add(rod);
    tieRods.push(rod);

    // End Retention Bronze Nuts on both sides of each column
    [-5.0, 5.0].forEach((nx) => {
      const nut = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.34, 0.34, 0.32, 6)),
        materials.brassPipes,
      );
      nut.rotation.z = Math.PI / 2;
      nut.position.set(nx, ty, tz);
      nut.castShadow = true;
      rootGroup.add(nut);
    });
  });

  // --- 2. Steam-Jacketed Heated Barrel (Claim 1) ---
  const barrelGroup = new THREE.Group();
  rootGroup.add(barrelGroup);

  // Cast iron outer jacket cylinder
  const jacket = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(1.68, 1.68, 4.8, 32)),
    materials.castIron,
  );
  jacket.rotation.z = Math.PI / 2;
  jacket.castShadow = true;
  barrelGroup.add(jacket);

  // Internal masticating compression core (visible when cutaway is toggled)
  const internalCore = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.95, 0.95, 4.4, 28)),
    materials.copperGasket,
  );
  internalCore.rotation.z = Math.PI / 2;
  internalCore.visible = false;
  barrelGroup.add(internalCore);

  // Heavy end mounting flanges with bolting perimeter
  [-2.35, 2.35].forEach((fx) => {
    const flange = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(2.05, 2.05, 0.28, 32)),
      materials.castIron,
    );
    flange.rotation.z = Math.PI / 2;
    flange.position.x = fx;
    flange.castShadow = true;
    barrelGroup.add(flange);

    // 8 perimeter bolts
    for (let b = 0; b < 8; b++) {
      const angle = (b * Math.PI) / 4;
      const bolt = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.07, 0.07, 0.38, 6)),
        materials.polishedSteel,
      );
      bolt.rotation.z = Math.PI / 2;
      bolt.position.set(
        fx + (fx > 0 ? 0.06 : -0.06),
        Math.cos(angle) * 1.84,
        Math.sin(angle) * 1.84,
      );
      barrelGroup.add(bolt);
    }
  });

  // Steam Manifold, Brass Inlet/Outlet Pipes, and Dial Pressure Gauge (Claim 1)
  const steamManifold = new THREE.Group();
  barrelGroup.add(steamManifold);

  const steamPipes: THREE.Mesh[] = [];
  [-1.4, 1.4].forEach((sx) => {
    // Upright steam riser pipe
    const pipe = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.14, 0.14, 1.4, 16)),
      materials.brassPipes,
    );
    pipe.position.set(sx, 2.1, 0);
    pipe.castShadow = true;
    steamManifold.add(pipe);
    steamPipes.push(pipe);

    // Gate valve handwheel
    const handwheel = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(0.24, 0.04, 8, 16)),
      materials.brassPipes,
    );
    handwheel.position.set(sx, 2.8, 0);
    handwheel.rotation.x = Math.PI / 2;
    steamManifold.add(handwheel);
  });

  // Top Bourdon steam pressure gauge
  const gaugeBody = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.44, 0.44, 0.18, 28)),
    materials.brassPipes,
  );
  gaugeBody.position.set(0, 2.7, 0.6);
  gaugeBody.rotation.x = Math.PI / 4;
  steamManifold.add(gaugeBody);

  const gaugeDialMat = trackMat(
    new THREE.MeshStandardMaterial({
      ...(gaugeTex ? { map: gaugeTex } : {}),
      color: 0xffffff,
      roughness: 0.25,
      metalness: 0.1,
    }),
  );

  const gaugeDial = new THREE.Mesh(trackGeo(new THREE.CircleGeometry(0.4, 28)), gaugeDialMat);
  gaugeDial.position.set(0, 2.78, 0.68);
  gaugeDial.rotation.x = Math.PI / 4;
  steamManifold.add(gaugeDial);

  // Pressure gauge pointer needle
  const gaugeNeedle = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.03, 0.26, 0.01)),
    materials.castIron,
  );
  gaugeNeedle.position.set(0, 2.79, 0.69);
  gaugeNeedle.rotation.x = Math.PI / 4;
  steamManifold.add(gaugeNeedle);

  // --- 3. High-Pressure Hydraulic Plunger Ram (Claim 2) ---
  const ramGroup = new THREE.Group();
  ramGroup.position.set(-4.0, 0, 0);
  rootGroup.add(ramGroup);

  // Cast iron hydraulic cylinder body
  const hydCyl = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(1.48, 1.48, 3.6, 28)),
    materials.castIron,
  );
  hydCyl.rotation.z = Math.PI / 2;
  hydCyl.castShadow = true;
  ramGroup.add(hydCyl);

  // Gland packing collar with copper sealing rings
  const glandCollar = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(1.15, 1.15, 0.48, 24)),
    materials.copperGasket,
  );
  glandCollar.rotation.z = Math.PI / 2;
  glandCollar.position.x = 1.8;
  ramGroup.add(glandCollar);

  // Polished chrome ram piston
  const ramPiston = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.74, 0.74, 4.6, 28)),
    materials.polishedSteel,
  );
  ramPiston.rotation.z = Math.PI / 2;
  ramPiston.position.x = 1.8;
  ramPiston.castShadow = true;
  ramGroup.add(ramPiston);

  // Hydraulic Feed Tubing from Bedplate Pump
  const hydTube = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.08, 0.08, 2.2, 12)),
    materials.copperGasket,
  );
  hydTube.position.set(-1.2, -1.0, 1.2);
  ramGroup.add(hydTube);

  // --- 4. Precision Extrusion Nozzle Die & Extruded Celluloid Billet ---
  const nozzleGroup = new THREE.Group();
  nozzleGroup.position.set(2.4, 0, 0);
  rootGroup.add(nozzleGroup);

  const nozzleCone = new THREE.Mesh(
    trackGeo(new THREE.ConeGeometry(1.35, 1.45, 28)),
    materials.brassPipes,
  );
  nozzleCone.rotation.z = -Math.PI / 2;
  nozzleCone.position.x = 0.65;
  nozzleCone.castShadow = true;
  nozzleGroup.add(nozzleCone);

  // Extruded translucent amber celluloid rod
  const rodMesh = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.42, 0.42, 4.0, 28)),
    materials.celluloidAmber,
  );
  rodMesh.rotation.z = Math.PI / 2;
  rodMesh.position.x = 2.7;
  rodMesh.castShadow = true;
  nozzleGroup.add(rodMesh);

  // Two-piece hinged compression mold box (Claim 3)
  const moldBoxGroup = new THREE.Group();
  moldBoxGroup.position.set(3.6, -0.9, -1.6);
  rootGroup.add(moldBoxGroup);

  const moldLower = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(1.4, 0.7, 1.4)),
    materials.castIron,
  );
  moldLower.position.y = -0.35;
  moldLower.castShadow = true;
  moldBoxGroup.add(moldLower);

  const moldUpper = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(1.4, 0.7, 1.4)),
    materials.brassPipes,
  );
  moldUpper.position.y = 0.35;
  moldUpper.castShadow = true;
  moldBoxGroup.add(moldUpper);

  // Clamping toggle screw
  const clampScrew = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.08, 0.08, 1.8, 12)),
    materials.polishedSteel,
  );
  clampScrew.position.set(0, 0.4, 0.85);
  moldBoxGroup.add(clampScrew);

  // --- 5. Finished Molded Celluloid Billiard Balls (Claim 3) ---
  const billiardBalls: THREE.Mesh[] = [];
  [-0.9, 0.9].forEach((bz, idx) => {
    const ball = new THREE.Mesh(
      trackGeo(new THREE.SphereGeometry(0.5, 32, 32)),
      idx === 0 ? materials.billiardBallWhite : materials.billiardBallAmber,
    );
    ball.position.set(4.6, -1.6, bz);
    ball.castShadow = true;
    ball.receiveShadow = true;
    rootGroup.add(ball);
    billiardBalls.push(ball);

    // Turned brass display pedestal
    const pedestal = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.36, 0.46, 0.32, 24)),
      materials.brassPipes,
    );
    pedestal.position.set(4.6, -1.95, bz);
    pedestal.castShadow = true;
    rootGroup.add(pedestal);
  });

  const nodes: HyattCelluloidModelNodes = {
    rootGroup,
    bedplate,
    tieRods,
    barrelGroup,
    jacket,
    steamPipes,
    steamManifold,
    gaugeNeedle,
    ramGroup,
    hydCyl,
    ramPiston,
    nozzleGroup,
    nozzleCone,
    rodMesh,
    moldBoxGroup,
    billiardBalls,
    internalCore,
  };

  const dispose = () => {
    for (const m of materialsToDispose) m.dispose();
    for (const g of geometriesToDispose) g.dispose();
    for (const t of texturesToDispose) t.dispose();
  };

  return { rootGroup, nodes, materials, dispose };
}

/**
 * Updates hydraulic ram stroke, polymer melt flow, pressure needle, and cutaway mode.
 */
export function updateHyattCelluloidKinematics(
  nodes: HyattCelluloidModelNodes,
  materials: HyattCelluloidMaterials,
  _dt: number,
  timeSec: number,
  processTempC: number,
  viscosityPaS: number,
  isMelted: boolean,
  ramHz: number,
  ramStroke: number,
  isCutaway: boolean,
) {
  const hyatt = stepHyattCelluloid({
    steamTempC: processTempC,
  });
  const fluid = fluidFrames(16, 8);
  const melt = 1 + sampleFluidAt(fluid, 16, 8, Math.abs(Math.floor(timeSec * 4)) % 8, 0.5, 0.4);
  nodes.ramPiston.position.x =
    hyatt.ramHomeX + Math.sin(timeSec * ramHz * hyatt.ramCycleTau) * ramStroke;

  const flow = isMelted
    ? Math.min(
        hyatt.flowMax,
        hyatt.flowViscosityRef / Math.max(hyatt.flowViscosityFloor, viscosityPaS),
      ) * melt
    : hyatt.solidFlow;
  nodes.rodMesh.visible = isMelted;
  nodes.rodMesh.scale.x = flow;
  materials.celluloidAmber.opacity = isMelted ? hyatt.meltedOpacity : hyatt.solidOpacity;
  materials.celluloidAmber.color.setHex(processTempC >= 90 ? 0xd97706 : 0x9a3412);

  // Pressure gauge needle response
  if (nodes.gaugeNeedle) {
    const targetAngle = -Math.PI * 0.4 + (Math.min(150, processTempC) / 150) * (Math.PI * 0.8);
    nodes.gaugeNeedle.rotation.z = targetAngle;
  }

  // Cutaway Mode
  materials.castIron.opacity = isCutaway ? 0.35 : 1.0;
  materials.castIron.transparent = isCutaway;
  if (nodes.internalCore) {
    nodes.internalCore.visible = isCutaway;
  }
}
