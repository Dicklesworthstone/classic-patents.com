import * as THREE from "three";

/**
 * Dimensions based on Boulton & Watt Soho 38-inch single-acting pumping engine (1769–1777).
 * Citations: Dickinson & Jenkins, "James Watt and the Steam Engine" (1927); Science Museum London archives.
 * 1 world unit = 1 metre.
 */
export const WATT_DIM = {
  cylinderBoreM: 0.965, // 38 inch bore
  cylinderStrokeM: 1.829, // 6 ft stroke
  cylinderHeightM: 2.4, // Overall cylinder casing height
  jacketRadiusM: 0.58, // 46 inch outer steam jacket radius
  beamLengthM: 7.315, // 24 ft walking beam length
  beamDepthM: 0.65, // 26 inch timber depth
  beamWidthM: 0.45, // 18 inch timber width
  fulcrumHeightM: 5.8, // Fulcrum axis height above basement floor
  condenserRadiusM: 0.35, // 28 inch separate condenser pot
  condenserHeightM: 1.2,
  airPumpRadiusM: 0.22, // 18 inch air pump
  airPumpHeightM: 1.4,
  cisternWidthM: 1.8,
  cisternLengthM: 2.4,
  cisternHeightM: 1.5,
  boilerRadiusM: 1.1, // Waggon boiler width
  boilerLengthM: 3.6,
  wallThicknessM: 0.9,
  wallHeightM: 7.5,
} as const;

export interface WattModelHandles {
  root: THREE.Group;
  beamGroup: THREE.Group;
  pistonGroup: THREE.Group;
  airPumpRodGroup: THREE.Group;
  pitworkRodGroup: THREE.Group;
  cylinderGroup: THREE.Group;
  jacketMesh: THREE.Mesh;
  condenserGroup: THREE.Group;
  calloutGroup: THREE.Group;
  steamGlowMat: THREE.MeshBasicMaterial;
  fireGlowMat: THREE.MeshBasicMaterial;
  setCutaway(cutaway: boolean): void;
  setCalloutsVisible(visible: boolean): void;
  dispose(): void;
}

export function buildWattSeparateCondenserModel(): WattModelHandles {
  const root = new THREE.Group();
  root.name = "watt-separate-condenser-root";

  const disposables: { dispose(): void }[] = [];
  const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
    disposables.push(g);
    return g;
  };
  const trackMat = <T extends THREE.Material>(m: T): T => {
    disposables.push(m);
    return m;
  };
  const trackTex = <T extends THREE.Texture>(t: T): T => {
    disposables.push(t);
    return t;
  };

  // --- Procedural Canvas Textures ---
  const makeOakTexture = () => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = "#6b4226";
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = "#54331c";
    for (let i = 0; i < 256; i += 4) {
      const shift = Math.sin(i * 0.1) * 3;
      ctx.fillRect(0, i + shift, 256, 2);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return trackTex(tex);
  };

  const makeStoneTexture = () => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = "#4a4640";
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = "#33302a";
    ctx.lineWidth = 3;
    for (let y = 0; y < 256; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(256, y);
      ctx.stroke();
      const offset = (y / 32) % 2 === 0 ? 0 : 32;
      for (let x = offset; x < 256; x += 64) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + 32);
        ctx.stroke();
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return trackTex(tex);
  };

  // --- Shared Materials ---
  const castIronMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x2b2b2b,
      roughness: 0.75,
      metalness: 0.85,
    }),
  );

  const polishedIronMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x888888,
      roughness: 0.35,
      metalness: 0.9,
    }),
  );

  const copperBoilerMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xb86d3b,
      roughness: 0.55,
      metalness: 0.8,
    }),
  );

  const oakBeamMat = trackMat(
    new THREE.MeshStandardMaterial({
      map: makeOakTexture(),
      roughness: 0.8,
      metalness: 0.1,
    }),
  );

  const stoneWallMat = trackMat(
    new THREE.MeshStandardMaterial({
      map: makeStoneTexture(),
      roughness: 0.9,
      metalness: 0.05,
    }),
  );

  const brassValvesMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.35,
      metalness: 0.85,
    }),
  );

  const waterMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.65,
      roughness: 0.1,
      metalness: 0.1,
    }),
  );

  const jacketMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x4a443b,
      roughness: 0.7,
      metalness: 0.4,
      transparent: true,
      opacity: 0.9,
    }),
  );

  const steamGlowMat = trackMat(
    new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.4,
    }),
  );

  const fireGlowMat = trackMat(
    new THREE.MeshBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.8,
    }),
  );

  // --- 1. Engine House Wall & Basement ---
  const houseGroup = new THREE.Group();
  houseGroup.name = "engine-house-structure";

  // Central Lever Wall (supports the beam gudgeon)
  const wallGeo = trackGeo(
    new THREE.BoxGeometry(WATT_DIM.wallThicknessM, WATT_DIM.wallHeightM, 3.5),
  );
  const wallMesh = new THREE.Mesh(wallGeo, stoneWallMat);
  wallMesh.position.set(0, WATT_DIM.wallHeightM / 2, 0);
  wallMesh.castShadow = true;
  wallMesh.receiveShadow = true;
  houseGroup.add(wallMesh);

  // Timber framing posts
  const postGeo = trackGeo(new THREE.BoxGeometry(0.35, 6.0, 0.35));
  const post1 = new THREE.Mesh(postGeo, oakBeamMat);
  post1.position.set(-2.5, 3.0, 1.4);
  const post2 = new THREE.Mesh(postGeo, oakBeamMat);
  post2.position.set(-2.5, 3.0, -1.4);
  houseGroup.add(post1, post2);

  root.add(houseGroup);

  // --- 2. Great Oak Walking Beam H ---
  const beamGroup = new THREE.Group();
  beamGroup.name = "walking-beam-h";
  beamGroup.position.set(0, WATT_DIM.fulcrumHeightM, 0);

  // Main tapered timber beam
  const beamGeo = trackGeo(
    new THREE.BoxGeometry(WATT_DIM.beamLengthM, WATT_DIM.beamDepthM, WATT_DIM.beamWidthM),
  );
  const beamMesh = new THREE.Mesh(beamGeo, oakBeamMat);
  beamMesh.castShadow = true;
  beamGroup.add(beamMesh);

  // Center Fulcrum Gudgeon / Bearing Blocks
  const gudgeonGeo = trackGeo(new THREE.CylinderGeometry(0.18, 0.18, 0.9, 24));
  const gudgeonMesh = new THREE.Mesh(gudgeonGeo, castIronMat);
  gudgeonMesh.rotation.x = Math.PI / 2;
  beamGroup.add(gudgeonMesh);

  // Iron truss kingpost and tension tie rods
  const kingpostGeo = trackGeo(new THREE.CylinderGeometry(0.05, 0.05, 1.4, 16));
  const kingpostMesh = new THREE.Mesh(kingpostGeo, castIronMat);
  kingpostMesh.position.set(0, 0.9, 0);
  beamGroup.add(kingpostMesh);

  // Arch Heads (Curved wooden sector heads for chains at both ends)
  const makeArchHead = (xOffset: number, isRight: boolean) => {
    const archGroup = new THREE.Group();
    const curveGeo = trackGeo(new THREE.BoxGeometry(0.4, 1.6, 0.3));
    const curveMesh = new THREE.Mesh(curveGeo, oakBeamMat);
    curveMesh.position.set(0, -0.6, 0);
    archGroup.add(curveMesh);

    // Iron chain anchor
    const anchorGeo = trackGeo(new THREE.CylinderGeometry(0.04, 0.04, 0.4, 12));
    const anchorMesh = new THREE.Mesh(anchorGeo, castIronMat);
    anchorMesh.position.set(0, -1.3, 0);
    archGroup.add(anchorMesh);

    archGroup.position.set(xOffset, 0, 0);
    if (isRight) archGroup.rotation.y = Math.PI;
    return archGroup;
  };

  const leftArch = makeArchHead(-WATT_DIM.beamLengthM / 2 + 0.1, false);
  const rightArch = makeArchHead(WATT_DIM.beamLengthM / 2 - 0.1, true);
  beamGroup.add(leftArch, rightArch);

  root.add(beamGroup);

  // --- 3. Steam Cylinder B & Steam Jacket (Principle 1) ---
  const cylinderGroup = new THREE.Group();
  cylinderGroup.name = "steam-cylinder-assembly";
  cylinderGroup.position.set(-2.5, 2.6, 0);

  // Inner Cast-Iron Cylinder
  const innerCylGeo = trackGeo(
    new THREE.CylinderGeometry(
      WATT_DIM.cylinderBoreM / 2,
      WATT_DIM.cylinderBoreM / 2,
      WATT_DIM.cylinderHeightM,
      32,
      1,
      true,
    ),
  );
  const innerCylMesh = new THREE.Mesh(innerCylGeo, polishedIronMat);
  cylinderGroup.add(innerCylMesh);

  // Concentric Steam Jacket (Principle 1)
  const jacketGeo = trackGeo(
    new THREE.CylinderGeometry(
      WATT_DIM.jacketRadiusM,
      WATT_DIM.jacketRadiusM,
      WATT_DIM.cylinderHeightM + 0.1,
      32,
    ),
  );
  const jacketMesh = new THREE.Mesh(jacketGeo, jacketMat);
  jacketMesh.castShadow = true;
  cylinderGroup.add(jacketMesh);

  // Steam Glow inside jacket annular space
  const steamGlowGeo = trackGeo(
    new THREE.CylinderGeometry(
      WATT_DIM.jacketRadiusM - 0.02,
      WATT_DIM.jacketRadiusM - 0.02,
      WATT_DIM.cylinderHeightM,
      24,
    ),
  );
  const steamGlowMesh = new THREE.Mesh(steamGlowGeo, steamGlowMat);
  cylinderGroup.add(steamGlowMesh);

  // Top & Bottom Cylinder Covers
  const coverGeo = trackGeo(
    new THREE.CylinderGeometry(
      WATT_DIM.jacketRadiusM + 0.05,
      WATT_DIM.jacketRadiusM + 0.05,
      0.12,
      32,
    ),
  );
  const topCover = new THREE.Mesh(coverGeo, castIronMat);
  topCover.position.set(0, WATT_DIM.cylinderHeightM / 2 + 0.06, 0);
  const bottomCover = new THREE.Mesh(coverGeo, castIronMat);
  bottomCover.position.set(0, -WATT_DIM.cylinderHeightM / 2 - 0.06, 0);
  cylinderGroup.add(topCover, bottomCover);

  // Brass Stuffing Box on top cover
  const stuffingBoxGeo = trackGeo(new THREE.CylinderGeometry(0.16, 0.18, 0.25, 16));
  const stuffingBox = new THREE.Mesh(stuffingBoxGeo, brassValvesMat);
  stuffingBox.position.set(0, WATT_DIM.cylinderHeightM / 2 + 0.2, 0);
  cylinderGroup.add(stuffingBox);

  root.add(cylinderGroup);

  // --- 4. Working Piston C and Rod ---
  const pistonGroup = new THREE.Group();
  pistonGroup.name = "working-piston-c";
  pistonGroup.position.set(-2.5, 2.6, 0);

  // Cast-Iron Piston Disk with Tallow Gland Packings
  const pistonDiskGeo = trackGeo(
    new THREE.CylinderGeometry(
      WATT_DIM.cylinderBoreM / 2 - 0.015,
      WATT_DIM.cylinderBoreM / 2 - 0.015,
      0.18,
      32,
    ),
  );
  const pistonDisk = new THREE.Mesh(pistonDiskGeo, castIronMat);
  pistonGroup.add(pistonDisk);

  // Piston Rod
  const rodGeo = trackGeo(new THREE.CylinderGeometry(0.05, 0.05, 3.2, 16));
  const rodMesh = new THREE.Mesh(rodGeo, polishedIronMat);
  rodMesh.position.set(0, 1.6, 0);
  pistonGroup.add(rodMesh);

  root.add(pistonGroup);

  // --- 5. Separate Condenser E & Cold Cistern (Principle 2) ---
  const condenserGroup = new THREE.Group();
  condenserGroup.name = "separate-condenser-assembly";
  condenserGroup.position.set(-2.5, 0.8, 0);

  // Cold Water Cistern (Timber / Lead lined tank)
  const cisternGeo = trackGeo(
    new THREE.BoxGeometry(WATT_DIM.cisternWidthM, WATT_DIM.cisternHeightM, WATT_DIM.cisternLengthM),
  );
  const cisternMesh = new THREE.Mesh(cisternGeo, oakBeamMat);
  cisternMesh.position.set(0, 0, 0);
  condenserGroup.add(cisternMesh);

  // Water volume inside cistern
  const waterGeo = trackGeo(
    new THREE.BoxGeometry(
      WATT_DIM.cisternWidthM - 0.1,
      WATT_DIM.cisternHeightM - 0.1,
      WATT_DIM.cisternLengthM - 0.1,
    ),
  );
  const waterMesh = new THREE.Mesh(waterGeo, waterMat);
  waterMesh.position.set(0, 0.02, 0);
  condenserGroup.add(waterMesh);

  // Separate Condenser Pot Vessel E
  const condPotGeo = trackGeo(
    new THREE.CylinderGeometry(
      WATT_DIM.condenserRadiusM,
      WATT_DIM.condenserRadiusM,
      WATT_DIM.condenserHeightM,
      24,
    ),
  );
  const condPot = new THREE.Mesh(condPotGeo, castIronMat);
  condPot.position.set(-0.35, 0.1, 0);
  condenserGroup.add(condPot);

  // Air Pump Vessel G (Principle 3)
  const airPumpGeo = trackGeo(
    new THREE.CylinderGeometry(
      WATT_DIM.airPumpRadiusM,
      WATT_DIM.airPumpRadiusM,
      WATT_DIM.airPumpHeightM,
      24,
    ),
  );
  const airPumpMesh = new THREE.Mesh(airPumpGeo, castIronMat);
  airPumpMesh.position.set(0.45, 0.2, 0);
  condenserGroup.add(airPumpMesh);

  // Foot connecting pipe between Condenser and Air Pump
  const footPipeGeo = trackGeo(new THREE.CylinderGeometry(0.08, 0.08, 0.8, 16));
  const footPipe = new THREE.Mesh(footPipeGeo, castIronMat);
  footPipe.rotation.z = Math.PI / 2;
  footPipe.position.set(0.05, -0.35, 0);
  condenserGroup.add(footPipe);

  // Steam Exhaust Pipe from Cylinder Bottom into Condenser Top
  const exhaustPipeGeo = trackGeo(new THREE.CylinderGeometry(0.09, 0.09, 1.2, 16));
  const exhaustPipe = new THREE.Mesh(exhaustPipeGeo, castIronMat);
  exhaustPipe.position.set(-0.35, 0.9, 0);
  condenserGroup.add(exhaustPipe);

  // Brass Equilibrium & Exhaust Valve D
  const valveGeo = trackGeo(new THREE.SphereGeometry(0.12, 16, 16));
  const valveMesh = new THREE.Mesh(valveGeo, brassValvesMat);
  valveMesh.position.set(-0.35, 1.3, 0);
  condenserGroup.add(valveMesh);

  root.add(condenserGroup);

  // --- 6. Air Pump Rod & Pitwork Rod ---
  const airPumpRodGroup = new THREE.Group();
  airPumpRodGroup.name = "air-pump-rod";
  airPumpRodGroup.position.set(-1.8, 2.5, 0);
  const airRodGeo = trackGeo(new THREE.CylinderGeometry(0.035, 0.035, 3.8, 12));
  const airRodMesh = new THREE.Mesh(airRodGeo, polishedIronMat);
  airPumpRodGroup.add(airRodMesh);
  root.add(airPumpRodGroup);

  // Pitwork Rod J (Right mine pump shaft side)
  const pitworkRodGroup = new THREE.Group();
  pitworkRodGroup.name = "pitwork-pump-rod-j";
  pitworkRodGroup.position.set(WATT_DIM.beamLengthM / 2 - 0.2, 2.5, 0);
  const pitworkGeo = trackGeo(new THREE.BoxGeometry(0.2, 5.0, 0.2));
  const pitworkMesh = new THREE.Mesh(pitworkGeo, oakBeamMat);
  pitworkRodGroup.add(pitworkMesh);
  root.add(pitworkRodGroup);

  // --- 7. Waggon Steam Boiler A & Firebox ---
  const boilerGroup = new THREE.Group();
  boilerGroup.name = "steam-boiler-a";
  boilerGroup.position.set(-5.5, 1.5, 0);

  // Waggon Boiler Shell
  const boilerShellGeo = trackGeo(
    new THREE.CylinderGeometry(
      WATT_DIM.boilerRadiusM,
      WATT_DIM.boilerRadiusM,
      WATT_DIM.boilerLengthM,
      32,
    ),
  );
  const boilerShell = new THREE.Mesh(boilerShellGeo, copperBoilerMat);
  boilerShell.rotation.x = Math.PI / 2;
  boilerShell.castShadow = true;
  boilerGroup.add(boilerShell);

  // Brick Hearth base under boiler
  const hearthGeo = trackGeo(new THREE.BoxGeometry(2.4, 1.0, WATT_DIM.boilerLengthM + 0.4));
  const hearthMesh = new THREE.Mesh(hearthGeo, stoneWallMat);
  hearthMesh.position.set(0, -1.0, 0);
  boilerGroup.add(hearthMesh);

  // Firebox Glow
  const fireGeo = trackGeo(new THREE.BoxGeometry(1.6, 0.4, 2.2));
  const fireMesh = new THREE.Mesh(fireGeo, fireGlowMat);
  fireMesh.position.set(0, -0.8, 0);
  boilerGroup.add(fireMesh);

  // Main Steam Pipe to Cylinder
  const steamPipeGeo = trackGeo(new THREE.CylinderGeometry(0.08, 0.08, 3.2, 16));
  const steamPipe = new THREE.Mesh(steamPipeGeo, copperBoilerMat);
  steamPipe.rotation.z = Math.PI / 2;
  steamPipe.position.set(1.5, 1.0, 0);
  boilerGroup.add(steamPipe);

  root.add(boilerGroup);

  // --- 8. Historical Callout Pins (A through J) ---
  const calloutGroup = new THREE.Group();
  calloutGroup.name = "historical-callouts";

  const callouts = [
    { label: "A", pos: new THREE.Vector3(-5.5, 2.7, 0) }, // Boiler
    { label: "B", pos: new THREE.Vector3(-2.5, 4.0, 0.7) }, // Steam Jacket
    { label: "C", pos: new THREE.Vector3(-2.5, 2.7, 0.6) }, // Piston
    { label: "D", pos: new THREE.Vector3(-2.8, 1.9, 0.4) }, // Exhaust Valve
    { label: "E", pos: new THREE.Vector3(-2.8, 0.8, 0.5) }, // Separate Condenser
    { label: "G", pos: new THREE.Vector3(-2.0, 0.9, 0.4) }, // Air Pump
    { label: "H", pos: new THREE.Vector3(0, 6.2, 0.5) }, // Walking Beam
    { label: "J", pos: new THREE.Vector3(3.5, 3.0, 0.3) }, // Pitwork Rod
  ];

  for (const c of callouts) {
    const pinGeo = trackGeo(new THREE.SphereGeometry(0.12, 16, 16));
    const pinMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xd97706,
        emissiveIntensity: 0.6,
        roughness: 0.2,
      }),
    );
    const pinMesh = new THREE.Mesh(pinGeo, pinMat);
    pinMesh.position.copy(c.pos);
    calloutGroup.add(pinMesh);
  }
  root.add(calloutGroup);

  const setCutaway = (cutaway: boolean) => {
    jacketMesh.visible = !cutaway;
    steamGlowMesh.visible = !cutaway;
  };

  const setCalloutsVisible = (visible: boolean) => {
    calloutGroup.visible = visible;
  };

  const dispose = () => {
    for (const d of disposables) {
      d.dispose();
    }
  };

  return {
    root,
    beamGroup,
    pistonGroup,
    airPumpRodGroup,
    pitworkRodGroup,
    cylinderGroup,
    jacketMesh,
    condenserGroup,
    calloutGroup,
    steamGlowMat,
    fireGlowMat,
    setCutaway,
    setCalloutsVisible,
    dispose,
  };
}
