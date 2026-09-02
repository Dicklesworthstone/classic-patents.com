/**
 * gliddenBarbedWireModel.ts
 *
 * Museum-Grade Procedural 3D Model for Joseph F. Glidden's 1874 Twisted Wire Barbed Fence
 * (US Patent 157,124 - "Improvement in Wire-Fences").
 *
 * Reconstructs the source-described mechanism from the 1874 patent drawings:
 * 1. Double-strand twisted fence wire (the single printed claim, Figs. 1–3):
 *    - True parametric double helix where strand a and strand z interlock under uniform pitch.
 * 2. Transverse spur wires (the same claim, Figs. 1–3):
 *    - Short wire bent at the middle into a helical loop around strand a, with opposite-pointing spur ends
 *      firmly clamped and locked against rotation and longitudinal slip by the twisting of strand z.
 * 3. Fence posts B and the through-post twisting key C (Fig. 1):
 *    - A source-described post and key are shown as context for tightening the twisted fence wire.
 *
 * The workshop bench, feed spools, flyer, and take-up reel below are presentation props for
 * showing the twist operation. They are not figures or separately claimed structures in US 157,124.
 */

import * as THREE from "three";
import { gliddenFlyerCrate } from "@/physics/genericWasm";

export interface GliddenBarbedWireModelNodes {
  rootGroup: THREE.Group;
  bench: THREE.Mesh;
  feedSpools: THREE.Mesh[];
  flyerGroup: THREE.Group;
  flyerGears?: THREE.Group;
  wireAssemblyGroup: THREE.Group;
  strand1Mesh: THREE.Mesh;
  strand2Mesh: THREE.Mesh;
  barbGroups: THREE.Group[];
  reelGroup: THREE.Group;
  fencePostGroup?: THREE.Group;
  tensionKeyMesh?: THREE.Mesh;
}

export interface GliddenBarbedWireMaterials {
  castIron: THREE.MeshStandardMaterial;
  galvanizedSteel: THREE.MeshStandardMaterial;
  walnutWood: THREE.MeshStandardMaterial;
  agedPostWood?: THREE.MeshStandardMaterial;
  brassBronze?: THREE.MeshStandardMaterial;
  barbSteel?: THREE.MeshStandardMaterial;
}

export interface GliddenBarbedWireModelResult {
  rootGroup: THREE.Group;
  nodes: GliddenBarbedWireModelNodes;
  materials: GliddenBarbedWireMaterials;
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
 * Procedural 19th-Century Workshop Bench Wood Texture
 */
function createBenchTexture(): THREE.CanvasTexture | undefined {
  if (typeof document === "undefined") return undefined;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;

  ctx.fillStyle = "#4a2810";
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 75; i++) {
    const y = i * 7.0 + (deterministicUnit(i, 0) - 0.5) * 4;
    const alpha = 0.08 + (i % 4 === 0 ? 0.12 : 0.03);
    ctx.strokeStyle = `rgba(30, 15, 6, ${alpha})`;
    ctx.lineWidth = 1.4 + (i % 3) * 0.5;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(170, y + 12, 330, y - 10, 512, y + 6);
    ctx.stroke();
  }

  for (let p = 0; p < 200; p++) {
    const px = deterministicUnit(p, 1) * 512;
    const py = deterministicUnit(p, 2) * 512;
    ctx.fillStyle = "rgba(15, 6, 2, 0.28)";
    ctx.fillRect(px, py, 4 + deterministicUnit(p, 3) * 6, 1.8);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function buildGliddenBarbedWireModel(): GliddenBarbedWireModelResult {
  const rootGroup = new THREE.Group();
  const materialsToDispose: THREE.Material[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];
  const texturesToDispose: THREE.Texture[] = [];

  const benchTex = createBenchTexture();
  if (benchTex) texturesToDispose.push(benchTex);

  const trackGeo = <T extends THREE.BufferGeometry>(geo: T): T => {
    geometriesToDispose.push(geo);
    return geo;
  };
  const trackMat = <T extends THREE.Material>(mat: T): T => {
    materialsToDispose.push(mat);
    return mat;
  };

  // --- Museum-Quality Materials ---
  const castIron = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x22272e,
      roughness: 0.65,
      metalness: 0.85,
      transparent: true,
      opacity: 1.0,
    }),
  );

  const galvanizedSteel = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xdde3ea,
      roughness: 0.28,
      metalness: 0.92,
    }),
  );

  const barbSteel = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.2,
      metalness: 0.96,
    }),
  );

  const walnutWood = trackMat(
    new THREE.MeshStandardMaterial({
      ...(benchTex ? { map: benchTex } : {}),
      transparent: true,
      opacity: 1.0,
      color: 0x4a2810,
      roughness: 0.72,
      metalness: 0.04,
    }),
  );

  const agedPostWood = trackMat(
    new THREE.MeshStandardMaterial({
      ...(benchTex ? { map: benchTex } : {}),
      transparent: true,
      opacity: 1.0,
      color: 0x6e5d4e,
      roughness: 0.85,
      metalness: 0.02,
    }),
  );

  const brassBronze = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.35,
      metalness: 0.85,
    }),
  );

  const materials: GliddenBarbedWireMaterials = {
    castIron,
    galvanizedSteel,
    walnutWood,
    agedPostWood,
    brassBronze,
    barbSteel,
  };

  // --- 1. Heavy Wooden Workshop Bench & Cast Iron Bed ---
  const benchGroup = new THREE.Group();
  rootGroup.add(benchGroup);

  const benchTop = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(11.4, 0.6, 5.0)),
    materials.walnutWood,
  );
  benchTop.position.set(0, -2.1, 0);
  benchTop.receiveShadow = true;
  benchTop.castShadow = true;
  benchGroup.add(benchTop);

  // Bench legs (4 heavy square posts with cross-stretchers)
  const legGeo = trackGeo(new THREE.BoxGeometry(0.5, 2.2, 0.5));
  const legPositions = [
    [-5.2, -3.2, 2.1],
    [5.2, -3.2, 2.1],
    [-5.2, -3.2, -2.1],
    [5.2, -3.2, -2.1],
  ];
  for (const [lx, ly, lz] of legPositions) {
    const leg = new THREE.Mesh(legGeo, materials.walnutWood);
    leg.position.set(lx, ly, lz);
    leg.castShadow = true;
    leg.receiveShadow = true;
    benchGroup.add(leg);
  }

  // Cast iron guide rails along bench top
  const railGeo = trackGeo(new THREE.BoxGeometry(10.8, 0.12, 0.25));
  const rail1 = new THREE.Mesh(railGeo, materials.castIron);
  rail1.position.set(0, -1.74, 0.8);
  const rail2 = new THREE.Mesh(railGeo, materials.castIron);
  rail2.position.set(0, -1.74, -0.8);
  benchGroup.add(rail1, rail2);

  // --- 2. Presentation feed-spool props (not specified by the patent) ---
  const feedSpools: THREE.Mesh[] = [];
  const spoolLocations = [
    { x: -4.4, y: 0.75, z: -1.2 },
    { x: -4.4, y: -0.75, z: -1.2 },
  ];

  spoolLocations.forEach((loc) => {
    const spoolAssembly = new THREE.Group();
    spoolAssembly.position.set(loc.x, loc.y, loc.z);
    rootGroup.add(spoolAssembly);

    // Cast iron frame stand
    const stand = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.3, 1.8, 0.3)),
      materials.castIron,
    );
    stand.position.set(0, -0.9 + loc.y * -0.5, 0);
    spoolAssembly.add(stand);

    // Wooden wire core
    const spool = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.85, 0.85, 0.65, 24)),
      materials.walnutWood,
    );
    spool.rotation.z = Math.PI / 2;
    spool.castShadow = true;
    spoolAssembly.add(spool);
    feedSpools.push(spool);

    // Flanges on both ends
    [-0.34, 0.34].forEach((fx) => {
      const flange = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(1.2, 1.2, 0.06, 24)),
        materials.castIron,
      );
      flange.rotation.z = Math.PI / 2;
      flange.position.x = fx;
      flange.castShadow = true;
      spoolAssembly.add(flange);
    });

    // Coil of smooth raw wire wound on spool
    const wireCoil = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(1.05, 1.05, 0.58, 24)),
      materials.galvanizedSteel,
    );
    wireCoil.rotation.z = Math.PI / 2;
    spoolAssembly.add(wireCoil);
  });

  // --- 3. Presentation twist arbor (not a source-drawn or separately claimed structure) ---
  const flyerGroup = new THREE.Group();
  flyerGroup.position.set(-2.0, 0, 0);
  rootGroup.add(flyerGroup);

  // Cast iron flyer cage rings and cross-arms
  const outerFlyerRing = new THREE.Mesh(
    trackGeo(new THREE.TorusGeometry(1.45, 0.12, 16, 36)),
    materials.castIron,
  );
  outerFlyerRing.rotation.y = Math.PI / 2;
  outerFlyerRing.castShadow = true;
  flyerGroup.add(outerFlyerRing);

  const innerFlyerRing = new THREE.Mesh(
    trackGeo(new THREE.TorusGeometry(0.85, 0.09, 14, 32)),
    materials.castIron,
  );
  innerFlyerRing.rotation.y = Math.PI / 2;
  flyerGroup.add(innerFlyerRing);

  // 4 Radial Cross-Arms with wire eyelet guides
  for (let a = 0; a < 4; a++) {
    const armAngle = (a * Math.PI) / 2;
    const arm = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.06, 0.06, 1.45, 12)),
      materials.castIron,
    );
    arm.position.set(0, Math.sin(armAngle) * 0.725, Math.cos(armAngle) * 0.725);
    arm.rotation.x = armAngle;
    flyerGroup.add(arm);

    // Brass wire guide eyelet
    const eyelet = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(0.12, 0.035, 8, 16)),
      materials.brassBronze,
    );
    eyelet.position.set(0, Math.sin(armAngle) * 1.45, Math.cos(armAngle) * 1.45);
    eyelet.rotation.y = Math.PI / 2;
    flyerGroup.add(eyelet);
  }

  // Flyer Drive Bevel Gears & Bearing Housings
  const flyerGears = new THREE.Group();
  flyerGears.position.set(-2.4, 0, 0);
  rootGroup.add(flyerGears);

  const bevelGear1 = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.7, 0.5, 0.25, 20)),
    materials.castIron,
  );
  bevelGear1.rotation.z = Math.PI / 2;
  flyerGears.add(bevelGear1);

  const flyerPillowBlock = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.45, 1.2, 0.7)),
    materials.castIron,
  );
  flyerPillowBlock.position.set(0, -0.85, 0);
  flyerGears.add(flyerPillowBlock);

  // --- 4. Double-helix wire strands (single printed claim) ---
  const wireAssemblyGroup = new THREE.Group();
  rootGroup.add(wireAssemblyGroup);

  // Generate 80 parametric samples along the length from X = -3.4 to +3.4
  const helixPoints1: THREE.Vector3[] = [];
  const helixPoints2: THREE.Vector3[] = [];
  const sampleCount = 90;
  const lengthX = 6.8;
  const startX = -3.4;
  const helixRadius = 0.12;
  const totalTurns = 7.5; // ~5 twists per foot scaling

  for (let s = 0; s <= sampleCount; s++) {
    const fraction = s / sampleCount;
    const x = startX + fraction * lengthX;
    const theta = fraction * totalTurns * 2 * Math.PI;

    // Strand 1 (y)
    const y1 = Math.cos(theta) * helixRadius;
    const z1 = Math.sin(theta) * helixRadius;
    helixPoints1.push(new THREE.Vector3(x, y1, z1));

    // Strand 2 (z) 180 degrees out of phase
    const y2 = Math.cos(theta + Math.PI) * helixRadius;
    const z2 = Math.sin(theta + Math.PI) * helixRadius;
    helixPoints2.push(new THREE.Vector3(x, y2, z2));
  }

  const strand1Curve = new THREE.CatmullRomCurve3(helixPoints1);
  const strand1Geo = trackGeo(new THREE.TubeGeometry(strand1Curve, 120, 0.045, 10, false));
  const strand1Mesh = new THREE.Mesh(strand1Geo, materials.galvanizedSteel);
  strand1Mesh.castShadow = true;
  wireAssemblyGroup.add(strand1Mesh);

  const strand2Curve = new THREE.CatmullRomCurve3(helixPoints2);
  const strand2Geo = trackGeo(new THREE.TubeGeometry(strand2Curve, 120, 0.045, 10, false));
  const strand2Mesh = new THREE.Mesh(strand2Geo, materials.galvanizedSteel);
  strand2Mesh.castShadow = true;
  wireAssemblyGroup.add(strand2Mesh);

  // --- 5. Transverse spur wires around strand 1 (single printed claim) ---
  const barbCount = 5;
  const barbGroups: THREE.Group[] = [];
  const barbSpacing = 1.25;
  const barbStartX = -2.5;

  for (let b = 0; b < barbCount; b++) {
    const bx = barbStartX + b * barbSpacing;
    const fraction = (bx - startX) / lengthX;
    const theta = fraction * totalTurns * 2 * Math.PI;

    const barbGroup = new THREE.Group();
    // Position the spur wire at strand a's helical locus.
    barbGroup.position.set(bx, Math.cos(theta) * helixRadius, Math.sin(theta) * helixRadius);
    barbGroup.rotation.x = theta;

    // Central helical coiled loop (1.5 turns around strand 1)
    const coil = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(0.08, 0.038, 12, 24)),
      materials.barbSteel,
    );
    coil.rotation.y = Math.PI / 2;
    coil.castShadow = true;
    barbGroup.add(coil);

    // Second coil pass
    const coil2 = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(0.08, 0.038, 12, 24)),
      materials.barbSteel,
    );
    coil2.position.x = 0.06;
    coil2.rotation.y = Math.PI / 2;
    barbGroup.add(coil2);

    // 2 Diamond-Point Chisel Spurs pointing in opposite directions (Fig. 2 & Fig. 3)
    [-1, 1].forEach((dir, sIdx) => {
      const spurGroup = new THREE.Group();
      spurGroup.position.set(sIdx * 0.06, 0, 0);

      // Chisel body
      const spurBody = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.038, 0.038, 0.38, 8)),
        materials.barbSteel,
      );
      spurBody.position.set(0, dir * 0.22, 0);
      spurBody.castShadow = true;
      spurGroup.add(spurBody);

      // Sharp diamond-point cone tip
      const spurTip = new THREE.Mesh(
        trackGeo(new THREE.ConeGeometry(0.042, 0.16, 4)),
        materials.barbSteel,
      );
      spurTip.position.set(0, dir * (0.38 + 0.08), 0);
      spurTip.rotation.y = Math.PI / 4; // Diamond cross-section
      if (dir === -1) spurTip.rotation.z = Math.PI;
      spurTip.castShadow = true;
      spurGroup.add(spurTip);

      spurGroup.rotation.z = (dir * Math.PI) / 6;
      spurGroup.rotation.y = dir * 0.25;
      barbGroup.add(spurGroup);
    });

    wireAssemblyGroup.add(barbGroup);
    barbGroups.push(barbGroup);
  }

  // --- 6. Fence post B and through-post twisting key C (Fig. 1) ---
  const fencePostGroup = new THREE.Group();
  fencePostGroup.position.set(1.6, 0, 1.6);
  rootGroup.add(fencePostGroup);

  // Weathered Cedar Fence Post
  const post = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.38, 0.44, 4.2, 16)),
    materials.agedPostWood,
  );
  post.position.y = -0.5;
  post.castShadow = true;
  post.receiveShadow = true;
  fencePostGroup.add(post);

  // Source drawing context: the post and wire-end/key relationship.
  const staple = new THREE.Mesh(
    trackGeo(new THREE.TorusGeometry(0.16, 0.04, 8, 16, Math.PI)),
    materials.castIron,
  );
  staple.position.set(0, 0, -0.38);
  staple.rotation.z = Math.PI / 2;
  fencePostGroup.add(staple);

  // Through-post twisting key C with transverse thumb-piece (Fig. 1)
  const tensionKey = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.07, 0.07, 0.9, 12)),
    materials.castIron,
  );
  tensionKey.position.set(0, 0.35, -0.38);
  tensionKey.rotation.x = Math.PI / 2;
  fencePostGroup.add(tensionKey);

  const keyHandle = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.12, 0.5, 0.12)),
    materials.castIron,
  );
  keyHandle.position.set(0, 0.35, 0.1);
  fencePostGroup.add(keyHandle);

  // --- 7. Presentation take-up reel (not part of the printed claim) ---
  const reelGroup = new THREE.Group();
  reelGroup.position.set(3.8, 0, 0);
  rootGroup.add(reelGroup);

  // Heavy walnut core drum
  const reelHub = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.65, 0.65, 1.5, 24)),
    materials.walnutWood,
  );
  reelHub.rotation.z = Math.PI / 2;
  reelHub.castShadow = true;
  reelGroup.add(reelHub);

  // Stamped spoked cast-iron flanges
  [-0.78, 0.78].forEach((rx) => {
    const flange = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(1.65, 1.65, 0.08, 28)),
      materials.castIron,
    );
    flange.rotation.z = Math.PI / 2;
    flange.position.x = rx;
    flange.castShadow = true;
    reelGroup.add(flange);

    // 6 Reinforcing ribs per flange
    for (let r = 0; r < 6; r++) {
      const ribAngle = (r * Math.PI) / 3;
      const rib = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(0.06, 1.4, 0.12)),
        materials.castIron,
      );
      rib.position.set(rx + (rx > 0 ? 0.06 : -0.06), 0, 0);
      rib.rotation.x = ribAngle;
      reelGroup.add(rib);
    }
  });

  // Ratchet wheel and locking pawl on reel axle
  const ratchetWheel = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.55, 0.55, 0.16, 18)),
    materials.castIron,
  );
  ratchetWheel.position.x = 0.95;
  ratchetWheel.rotation.z = Math.PI / 2;
  reelGroup.add(ratchetWheel);

  const nodes: GliddenBarbedWireModelNodes = {
    rootGroup,
    bench: benchTop,
    feedSpools,
    flyerGroup,
    flyerGears,
    wireAssemblyGroup,
    strand1Mesh,
    strand2Mesh,
    barbGroups,
    reelGroup,
    fencePostGroup,
    tensionKeyMesh: tensionKey,
  };

  const dispose = () => {
    for (const m of materialsToDispose) m.dispose();
    for (const g of geometriesToDispose) g.dispose();
    for (const t of texturesToDispose) t.dispose();
  };

  return { rootGroup, nodes, materials, dispose };
}

/**
 * Updates twister flyer rotation, strand helix motion, and cutaway mode.
 */
export function updateGliddenBarbedWireKinematics(
  nodes: GliddenBarbedWireModelNodes,
  materials: GliddenBarbedWireMaterials,
  dt: number,
  _timeSec: number,
  flyerOmegaRadPerS: number,
  reelOmegaRadPerS: number,
  isLocked: boolean,
  isCutaway: boolean,
) {
  const flex = gliddenFlyerCrate(flyerOmegaRadPerS).flyerFlex;
  nodes.flyerGroup.rotation.x += flyerOmegaRadPerS * dt * flex;
  nodes.reelGroup.rotation.x += reelOmegaRadPerS * dt * flex;

  materials.galvanizedSteel.color.setHex(isLocked ? 0xdde3ea : 0xf87171);
  if (materials.barbSteel) {
    materials.barbSteel.color.setHex(isLocked ? 0xf1f5f9 : 0xfca5a5);
  }

  // Cutaway Mode
  materials.castIron.opacity = isCutaway ? 0.35 : 1.0;
  materials.castIron.transparent = isCutaway;
  materials.walnutWood.opacity = isCutaway ? 0.45 : 1.0;
  materials.walnutWood.transparent = isCutaway;
  if (materials.agedPostWood) {
    materials.agedPostWood.opacity = isCutaway ? 0.45 : 1.0;
    materials.agedPostWood.transparent = isCutaway;
  }
}
