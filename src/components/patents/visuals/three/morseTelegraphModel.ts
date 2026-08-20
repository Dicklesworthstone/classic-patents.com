import * as THREE from "three";
import { morseElectronLaneZ, stepMorseTelegraph } from "@/physics/catalogKernels";
import { wave2dFrames, waveFrameRms } from "@/physics/genericWasm";
import { createGlowPointTexture } from "./ThreeStudioScene";

export interface MorseTelegraphModelNodes {
  rootGroup: THREE.Group;
  baseboard: THREE.Mesh;
  keyGroup: THREE.Group;
  keyLeverGroup: THREE.Group;
  keyKnob: THREE.Mesh;
  sounderGroup: THREE.Group;
  coils: THREE.Mesh[];
  armatureGroup: THREE.Group;
  tapeSpool: THREE.Mesh;
  paperRibbon?: THREE.Mesh;
  flyGovernor?: THREE.Group;
  gearTrain?: THREE.Group;
  electronPoints: THREE.Points;
  electronPositions: Float32Array;
  electronCount: number;
}

export interface MorseTelegraphMaterials {
  mahogany: THREE.MeshStandardMaterial;
  brass: THREE.MeshStandardMaterial;
  burnishedBrass: THREE.MeshStandardMaterial;
  copperCoil: THREE.MeshStandardMaterial;
  ironCore: THREE.MeshStandardMaterial;
  paperTape: THREE.MeshStandardMaterial;
  eboniteKnob: THREE.MeshStandardMaterial;
  steelShaft: THREE.MeshStandardMaterial;
  electronMat: THREE.PointsMaterial;
}

export interface MorseTelegraphModelResult {
  rootGroup: THREE.Group;
  nodes: MorseTelegraphModelNodes;
  materials: MorseTelegraphMaterials;
  dispose: () => void;
}

const ELECTRON_COUNT = 50;

/**
 * Deterministic unit noise for procedural grain generation.
 */
function deterministicUnit(index: number, channel: number): number {
  const sample = Math.sin((index + 1) * 12.9898 + (channel + 1) * 78.233) * 43758.5453;
  return sample - Math.floor(sample);
}

/**
 * Procedural Figured Mahogany Varnish Texture
 */
function createMahoganyTexture(): THREE.CanvasTexture | undefined {
  if (typeof document === "undefined") return undefined;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;

  // Deep rich mahogany base tone
  ctx.fillStyle = "#3e1708";
  ctx.fillRect(0, 0, 512, 512);

  // Longitudinal wood growth rings and ribbon figure
  for (let i = 0; i < 90; i++) {
    const x = i * 5.8 + (deterministicUnit(i, 0) - 0.5) * 4;
    const alpha = 0.07 + (i % 5 === 0 ? 0.12 : 0.03);
    ctx.strokeStyle = `rgba(110, 38, 12, ${alpha})`;
    ctx.lineWidth = 1.2 + (i % 3) * 0.6;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.bezierCurveTo(x + 14, 160, x - 12, 360, x + 6, 512);
    ctx.stroke();
  }

  // Medullary wood pores & deep stain grain
  for (let p = 0; p < 350; p++) {
    const px = deterministicUnit(p, 1) * 512;
    const py = deterministicUnit(p, 2) * 512;
    ctx.fillStyle = "rgba(25, 8, 3, 0.25)";
    ctx.fillRect(px, py, 1.6, 5 + deterministicUnit(p, 3) * 10);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Procedural Embossed Morse Paper Ribbon Texture
 */
function createMorsePaperTexture(): THREE.CanvasTexture | undefined {
  if (typeof document === "undefined") return undefined;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;

  // Aged unbleached register paper
  ctx.fillStyle = "#fdf8e6";
  ctx.fillRect(0, 0, 512, 128);

  // Subtle paper fibers
  for (let f = 0; f < 180; f++) {
    const fx = deterministicUnit(f, 4) * 512;
    const fy = deterministicUnit(f, 5) * 128;
    ctx.strokeStyle = "rgba(180, 160, 120, 0.18)";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(fx, fy);
    ctx.lineTo(fx + 6, fy + (deterministicUnit(f, 6) - 0.5) * 4);
    ctx.stroke();
  }

  // Embossed Morse dots & dashes indentation track in center: "WHAT HATH GOD WROUGHT"
  const morsePattern = [
    // W (.--)
    1, 3, 3, 0,
    // H (....)
    1, 1, 1, 1, 0,
    // A (.-)
    1, 3, 0,
    // T (-)
    3, 0, 0,
    // G (--.)
    3, 3, 1, 0,
    // O (---)
    3, 3, 3, 0,
    // D (-..)
    3, 1, 1,
  ];

  ctx.fillStyle = "rgba(70, 50, 25, 0.55)";
  ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
  ctx.shadowBlur = 1.5;
  ctx.shadowOffsetY = 1;

  let curX = 16;
  const yCenter = 64;
  for (const sym of morsePattern) {
    if (sym === 0) {
      curX += 14;
    } else if (sym === 1) {
      // Dot
      ctx.beginPath();
      ctx.arc(curX + 4, yCenter, 4, 0, Math.PI * 2);
      ctx.fill();
      curX += 14;
    } else if (sym === 3) {
      // Dash
      ctx.beginPath();
      ctx.roundRect(curX, yCenter - 3.5, 20, 7, 3);
      ctx.fill();
      curX += 28;
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.repeat.set(3, 1);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function buildMorseTelegraphModel(): MorseTelegraphModelResult {
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

  const mahoganyTex = createMahoganyTexture();
  if (mahoganyTex) texturesToDispose.push(mahoganyTex);

  const paperTex = createMorsePaperTexture();
  if (paperTex) texturesToDispose.push(paperTex);

  const glowTex = createGlowPointTexture();
  texturesToDispose.push(glowTex);

  // --- Museum-Grade Materials Palette ---
  const mahogany = trackMat(
    new THREE.MeshStandardMaterial({
      ...(mahoganyTex ? { map: mahoganyTex } : {}),
      color: 0x5a2310,
      roughness: 0.38,
      metalness: 0.06,
    }),
  );

  const brass = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.22,
      metalness: 0.92,
    }),
  );

  const burnishedBrass = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xc8963e,
      roughness: 0.3,
      metalness: 0.88,
    }),
  );

  const copperCoil = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xca8a04,
      roughness: 0.35,
      metalness: 0.82,
    }),
  );

  const ironCore = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.62,
      metalness: 0.85,
    }),
  );

  const steelShaft = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.12,
      metalness: 0.96,
    }),
  );

  const paperTape = trackMat(
    new THREE.MeshStandardMaterial({
      ...(paperTex ? { map: paperTex } : {}),
      color: 0xfdf8e6,
      roughness: 0.85,
      metalness: 0.02,
      side: THREE.DoubleSide,
    }),
  );

  const eboniteKnob = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.38,
      metalness: 0.15,
    }),
  );

  const electronMat = trackMat(
    new THREE.PointsMaterial({
      size: 0.22,
      color: 0x38bdf8,
      map: glowTex,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );

  const materials: MorseTelegraphMaterials = {
    mahogany,
    brass,
    burnishedBrass,
    copperCoil,
    ironCore,
    paperTape,
    eboniteKnob,
    steelShaft,
    electronMat,
  };

  // ==========================================
  // 1. BEVELED MAHOGANY BASEBOARD & TURNED BRASS FEET
  // ==========================================
  const baseGroup = new THREE.Group();
  rootGroup.add(baseGroup);

  // Main Plinth with Beveled Upper Edge
  const baseboard = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(13.4, 0.75, 8.2)),
    materials.mahogany,
  );
  baseboard.position.y = -2.4;
  baseboard.castShadow = true;
  baseboard.receiveShadow = true;
  baseGroup.add(baseboard);

  // Molded Ogee Base Rim Under Plinth
  const subBase = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(13.8, 0.18, 8.6)),
    materials.mahogany,
  );
  subBase.position.y = -2.82;
  subBase.receiveShadow = true;
  baseGroup.add(subBase);

  // 4 Turned Brass Bun Feet with Stepped Collars and Felt Pads
  [
    [-6.0, -3.5],
    [6.0, -3.5],
    [-6.0, 3.5],
    [6.0, 3.5],
  ].forEach(([fx, fz]) => {
    const footGroup = new THREE.Group();
    footGroup.position.set(fx, -2.95, fz);

    const footMesh = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.42, 0.28, 0.32, 20)),
      materials.brass,
    );
    footMesh.castShadow = true;
    footGroup.add(footMesh);

    const collar = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.48, 0.48, 0.08, 20)),
      materials.burnishedBrass,
    );
    collar.position.y = 0.16;
    footGroup.add(collar);

    baseGroup.add(footGroup);
  });

  // Knurled Terminal Binding Posts on rear of baseboard (Line, Battery, Ground, Key)
  [-5.0, -3.2, 3.2, 5.0].forEach((bx) => {
    const postGroup = new THREE.Group();
    postGroup.position.set(bx, -1.8, -3.4);

    // Turned brass threaded shank
    const post = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.12, 0.14, 0.65, 16)),
      materials.brass,
    );
    post.castShadow = true;
    postGroup.add(post);

    // Knurled thumb nut with wire clamping hole
    const nut = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.24, 0.24, 0.22, 16)),
      materials.burnishedBrass,
    );
    nut.position.y = 0.28;
    nut.castShadow = true;
    postGroup.add(nut);

    // Washer plate at base
    const washer = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.32, 0.32, 0.04, 16)),
      materials.brass,
    );
    washer.position.y = -0.28;
    postGroup.add(washer);

    baseGroup.add(postGroup);
  });

  // ==========================================
  // 2. TRANSMITTING MORSE TELEGRAPH KEY (CLAIM 1)
  // ==========================================
  const keyGroup = new THREE.Group();
  keyGroup.position.set(-3.6, -1.85, 0.2);
  rootGroup.add(keyGroup);

  // Cast brass mounting bedplate with counterbored screw holes
  const keyBedplate = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(4.8, 0.2, 2.4)),
    materials.burnishedBrass,
  );
  keyBedplate.castShadow = true;
  keyBedplate.receiveShadow = true;
  keyGroup.add(keyBedplate);

  // Trunnion bearing pedestals supporting the key fulcrum
  [-0.95, 0.95].forEach((zPos) => {
    const trunnion = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.22, 0.26, 0.95, 16)),
      materials.brass,
    );
    trunnion.position.set(0, 0.48, zPos);
    trunnion.castShadow = true;
    keyGroup.add(trunnion);

    // Cone-point pivot adjusting screw with locknut
    const pivotScrew = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.08, 0.08, 0.3, 12)),
      materials.steelShaft,
    );
    pivotScrew.rotation.x = Math.PI / 2;
    pivotScrew.position.set(0, 0.65, zPos > 0 ? zPos - 0.15 : zPos + 0.15);
    keyGroup.add(pivotScrew);
  });

  // Key Lever Pivoting Group
  const keyLeverGroup = new THREE.Group();
  keyLeverGroup.position.set(0, 0.65, 0);
  keyGroup.add(keyLeverGroup);

  // Classic Cast-Brass Camelback Key Lever with Cross Trunnion Axle
  const keyLeverShape = new THREE.Shape();
  keyLeverShape.moveTo(-2.4, -0.06);
  keyLeverShape.lineTo(-1.2, -0.06);
  keyLeverShape.quadraticCurveTo(-0.4, 0.25, 0.3, 0.06);
  keyLeverShape.lineTo(1.6, 0.06);
  keyLeverShape.lineTo(1.6, -0.08);
  keyLeverShape.lineTo(0.3, -0.08);
  keyLeverShape.quadraticCurveTo(-0.4, 0.12, -1.2, -0.16);
  keyLeverShape.lineTo(-2.4, -0.16);
  keyLeverShape.closePath();

  const keyLeverGeo = trackGeo(
    new THREE.ExtrudeGeometry(keyLeverShape, { depth: 0.24, bevelEnabled: false }),
  );
  keyLeverGeo.center();
  const keyLever = new THREE.Mesh(keyLeverGeo, materials.brass);
  keyLever.castShadow = true;
  keyLeverGroup.add(keyLever);

  // Cross trunnion axle
  const trunnionAxle = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.09, 0.09, 2.1, 16)),
    materials.steelShaft,
  );
  trunnionAxle.rotation.x = Math.PI / 2;
  keyLeverGroup.add(trunnionAxle);

  // Turned Ebonite / Vulcanite Hard Rubber Finger Knob
  const keyKnob = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.48, 0.34, 0.38, 24)),
    materials.eboniteKnob,
  );
  keyKnob.position.set(-2.1, 0.28, 0);
  keyKnob.castShadow = true;
  keyLeverGroup.add(keyKnob);

  // Polished brass knob retaining washer and screw
  const knobWasher = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.18, 0.18, 0.06, 16)),
    materials.brass,
  );
  knobWasher.position.set(-2.1, 0.48, 0);
  keyLeverGroup.add(knobWasher);

  // Platinum Contact Stud on Lever
  const upperContact = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.08, 0.08, 0.14, 12)),
    materials.steelShaft,
  );
  upperContact.position.set(-1.8, -0.14, 0);
  keyLeverGroup.add(upperContact);

  // Lower Anvil Contact Post on Bedplate with Platinum Tip
  const lowerContact = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.12, 0.14, 0.32, 14)),
    materials.brass,
  );
  lowerContact.position.set(-1.8, 0.22, 0);
  lowerContact.castShadow = true;
  keyGroup.add(lowerContact);

  // Helical Key Return Spring
  const keySpring = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.14, 0.14, 0.35, 12)),
    materials.burnishedBrass,
  );
  keySpring.position.set(0.8, 0.26, 0);
  keyGroup.add(keySpring);

  // Side Circuit-Closing Switch Blade with Turned Ebonite Handle
  const switchBlade = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(1.6, 0.08, 0.2)),
    materials.brass,
  );
  switchBlade.position.set(-1.0, 0.16, 0.95);
  switchBlade.rotation.y = 0.25;
  keyGroup.add(switchBlade);

  const switchKnob = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.14, 0.14, 0.25, 12)),
    materials.eboniteKnob,
  );
  switchKnob.position.set(-1.7, 0.26, 1.1);
  keyGroup.add(switchKnob);

  // ==========================================
  // 3. CLOCKWORK REGISTER & ELECTROMAGNET SOUNDER (CLAIMS 2 & 3)
  // ==========================================
  const sounderGroup = new THREE.Group();
  sounderGroup.position.set(3.4, -1.85, 0);
  rootGroup.add(sounderGroup);

  // Heavy Cast-Iron / Brass Register Base Bedplate
  const registerBed = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(5.4, 0.22, 3.8)),
    materials.burnishedBrass,
  );
  registerBed.castShadow = true;
  registerBed.receiveShadow = true;
  sounderGroup.add(registerBed);

  // Architectural Pierced Brass Frame Plates (Front and Rear)
  const plateShape = new THREE.Shape();
  plateShape.moveTo(-1.8, 0);
  plateShape.lineTo(1.8, 0);
  plateShape.lineTo(1.8, 2.6);
  plateShape.quadraticCurveTo(0, 3.1, -1.8, 2.6);
  plateShape.closePath();

  // Decorative cutouts in brass frame plates
  const cutoutPath = new THREE.Path();
  cutoutPath.moveTo(-1.1, 0.6);
  cutoutPath.lineTo(1.1, 0.6);
  cutoutPath.lineTo(1.1, 2.1);
  cutoutPath.lineTo(-1.1, 2.1);
  cutoutPath.closePath();
  plateShape.holes.push(cutoutPath);

  const plateGeo = trackGeo(
    new THREE.ExtrudeGeometry(plateShape, { depth: 0.12, bevelEnabled: false }),
  );
  plateGeo.center();

  [-1.3, 1.3].forEach((pz) => {
    const framePlate = new THREE.Mesh(plateGeo, materials.brass);
    framePlate.position.set(0, 1.5, pz);
    framePlate.castShadow = true;
    sounderGroup.add(framePlate);
  });

  // 4 Turned Brass Spacing Pillars connecting the frame plates
  [
    [-1.5, 0.4],
    [1.5, 0.4],
    [-1.5, 2.6],
    [1.5, 2.6],
  ].forEach(([px, py]) => {
    const pillar = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.12, 0.12, 2.6, 14)),
      materials.burnishedBrass,
    );
    pillar.rotation.x = Math.PI / 2;
    pillar.position.set(px, py, 0);
    sounderGroup.add(pillar);
  });

  // Clockwork Spring Barrel Drum with Winding Arbor
  const springBarrel = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.72, 0.72, 1.8, 24)),
    materials.burnishedBrass,
  );
  springBarrel.rotation.x = Math.PI / 2;
  springBarrel.position.set(-0.8, 0.9, 0);
  springBarrel.castShadow = true;
  sounderGroup.add(springBarrel);

  // Brass Spur Gear Train Inside Clockwork
  const gearTrain = new THREE.Group();
  gearTrain.position.set(0.4, 1.2, 0);
  sounderGroup.add(gearTrain);

  const gear1 = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.85, 0.85, 0.08, 30)),
    materials.brass,
  );
  gear1.rotation.x = Math.PI / 2;
  gear1.position.z = -0.5;
  gearTrain.add(gear1);

  const gear2 = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.55, 0.55, 0.08, 24)),
    materials.brass,
  );
  gear2.rotation.x = Math.PI / 2;
  gear2.position.set(0.4, 0.6, 0.3);
  gearTrain.add(gear2);

  // Dual-Vane Centrifugal Air Governor Fan (Spins during paper feed)
  const flyGovernor = new THREE.Group();
  flyGovernor.position.set(0.8, 2.5, 0);
  sounderGroup.add(flyGovernor);

  const govShaft = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.06, 0.06, 2.4, 12)),
    materials.steelShaft,
  );
  govShaft.rotation.x = Math.PI / 2;
  flyGovernor.add(govShaft);

  [-1, 1].forEach((dir) => {
    const vane = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.48, 0.22, 0.04)), materials.brass);
    vane.position.set(dir * 0.28, 0, 0);
    flyGovernor.add(vane);
  });

  // --- ELECTROMAGNETIC SOUNDER BOBBINS & CORES (CLAIM 2) ---
  const coils: THREE.Mesh[] = [];
  [-0.72, 0.72].forEach((cz) => {
    // Soft-iron cylindrical core
    const core = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.25, 0.25, 1.95, 20)),
      materials.ironCore,
    );
    core.position.set(-1.8, 0.98, cz);
    core.castShadow = true;
    sounderGroup.add(core);

    // Silk-wrapped green/gold insulated copper wire coil
    const coil = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.68, 0.68, 1.6, 24)),
      materials.copperCoil,
    );
    coil.position.set(-1.8, 0.95, cz);
    coil.castShadow = true;
    sounderGroup.add(coil);
    coils.push(coil);

    // Black vulcanite coil end caps
    [-0.8, 0.8].forEach((capY) => {
      const cap = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.74, 0.74, 0.08, 20)),
        materials.eboniteKnob,
      );
      cap.position.set(-1.8, 0.95 + capY, cz);
      sounderGroup.add(cap);
    });
  });

  // Soft-Iron Pole Yoke Base
  const yoke = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.72, 0.28, 1.85)),
    materials.ironCore,
  );
  yoke.position.set(-1.8, 0.14, 0);
  sounderGroup.add(yoke);

  // Pivoted Armature Lever with Embossing Stylus Point (US 1,647 Claim 2 & 3)
  const armatureGroup = new THREE.Group();
  armatureGroup.position.set(-0.8, 2.1, 0);
  sounderGroup.add(armatureGroup);

  const armatureBar = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(3.1, 0.24, 0.52)),
    materials.ironCore,
  );
  armatureBar.castShadow = true;
  armatureGroup.add(armatureBar);

  // Hardened steel embossing stylus needle point beneath lever tip
  const stylusPin = new THREE.Mesh(
    trackGeo(new THREE.ConeGeometry(0.06, 0.35, 12)),
    materials.steelShaft,
  );
  stylusPin.rotation.x = Math.PI;
  stylusPin.position.set(1.4, -0.22, 0);
  armatureGroup.add(stylusPin);

  // Knurled stroke limiting stop screws on sounder arch
  const stopScrew = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.12, 0.12, 0.45, 14)),
    materials.brass,
  );
  stopScrew.position.set(0.6, 0.32, 0);
  armatureGroup.add(stopScrew);

  // --- PAPER TAPE RECORDING REEL & EMBOSSED RIBBON (CLAIM 3) ---
  const tapeSpoolGroup = new THREE.Group();
  tapeSpoolGroup.position.set(1.6, 1.5, -2.5);
  sounderGroup.add(tapeSpoolGroup);

  // Pierced Brass Spool Flanges with Weight-Reduction Cutouts
  [-0.38, 0.38].forEach((fz) => {
    const flange = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(1.4, 1.4, 0.04, 32)),
      materials.brass,
    );
    flange.rotation.x = Math.PI / 2;
    flange.position.z = fz;
    flange.castShadow = true;
    tapeSpoolGroup.add(flange);
  });

  // Paper Tape Roll Core
  const tapeSpool = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(1.35, 1.35, 0.72, 32)),
    materials.paperTape,
  );
  tapeSpool.rotation.x = Math.PI / 2;
  tapeSpool.castShadow = true;
  tapeSpoolGroup.add(tapeSpool);

  // Turned Brass Reel Support Upright Post
  const spoolPost = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.18, 0.22, 1.8, 16)),
    materials.brass,
  );
  spoolPost.position.set(0, -0.85, 0);
  tapeSpoolGroup.add(spoolPost);

  // Continuous Embossed Paper Ribbon passing over the register anvil roller
  const ribbonGeo = trackGeo(new THREE.PlaneGeometry(3.6, 0.55));
  const paperRibbon = new THREE.Mesh(ribbonGeo, materials.paperTape);
  paperRibbon.position.set(0.6, 1.88, 0);
  paperRibbon.rotation.x = -Math.PI / 2;
  sounderGroup.add(paperRibbon);

  // Grooved Steel Anvil Roller under Stylus
  const anvilRoller = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.32, 0.32, 0.8, 20)),
    materials.steelShaft,
  );
  anvilRoller.rotation.x = Math.PI / 2;
  anvilRoller.position.set(0.6, 1.6, 0);
  sounderGroup.add(anvilRoller);

  // Knurled Brass Paper Feed Pinch Roller
  const feedRoller = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.28, 0.28, 0.8, 20)),
    materials.burnishedBrass,
  );
  feedRoller.rotation.x = Math.PI / 2;
  feedRoller.position.set(1.4, 1.6, 0);
  sounderGroup.add(feedRoller);

  // ==========================================
  // 4. FLOWING CIRCUIT ELECTRONS
  // ==========================================
  const electronGeo = trackGeo(new THREE.BufferGeometry());
  const electronPositions = new Float32Array(ELECTRON_COUNT * 3);
  const morseSeats = stepMorseTelegraph({
    lineVoltageV: 24,
    lineLengthMiles: 44,
    wpmSpeed: 20,
  });
  for (let i = 0; i < ELECTRON_COUNT; i++) {
    electronPositions[i * 3] =
      morseSeats.electronOriginX + (i / ELECTRON_COUNT) * morseSeats.electronSpanX;
    electronPositions[i * 3 + 1] = -1.95;
    electronPositions[i * 3 + 2] = morseElectronLaneZ(i, morseSeats.electronLaneZ);
  }
  electronGeo.setAttribute("position", new THREE.BufferAttribute(electronPositions, 3));
  const electronPoints = new THREE.Points(electronGeo, materials.electronMat);
  rootGroup.add(electronPoints);

  const nodes: MorseTelegraphModelNodes = {
    rootGroup,
    baseboard,
    keyGroup,
    keyLeverGroup,
    keyKnob,
    sounderGroup,
    coils,
    armatureGroup,
    tapeSpool,
    paperRibbon,
    flyGovernor,
    gearTrain,
    electronPoints,
    electronPositions,
    electronCount: ELECTRON_COUNT,
  };

  const dispose = () => {
    for (const m of materialsToDispose) {
      m.dispose();
    }
    for (const g of geometriesToDispose) {
      g.dispose();
    }
    for (const t of texturesToDispose) {
      t.dispose();
    }
  };

  return { rootGroup, nodes, materials, dispose };
}

/**
 * Updates key lever depression, sounder armature strike, paper tape motion, governor rotation, and cutaway.
 */
export function updateMorseTelegraphKinematics(
  nodes: MorseTelegraphModelNodes,
  materials: MorseTelegraphMaterials,
  dt: number,
  timeSec: number,
  keyOscillationRadPerS: number,
  armatureStrikeM: number,
  tapeAdvanceRadPerS: number,
  electronDisplaySpeed: number,
  keyIsDown: boolean,
  isCutaway: boolean,
  lineVoltageV = 12,
  lineLengthMiles = 40,
  wpmSpeed = 20,
) {
  // 1. Key Action (manual or rhythmic Morse oscillation)
  const morse = stepMorseTelegraph({ lineVoltageV, lineLengthMiles, wpmSpeed });
  const isKeyActive =
    keyIsDown || Math.sin(timeSec * keyOscillationRadPerS) > morse.keySinThreshold;
  nodes.keyLeverGroup.rotation.z = isKeyActive ? morse.keyTiltRad : 0;

  // 2. Sounder Armature Strike
  const strike = isKeyActive ? -armatureStrikeM : 0;
  nodes.armatureGroup.position.y = morse.armatureHomeY + strike;

  // 3. Paper Tape & Clockwork Governor Advance
  if (isKeyActive) {
    nodes.tapeSpool.rotation.y += dt * tapeAdvanceRadPerS;
    if (nodes.flyGovernor) {
      nodes.flyGovernor.rotation.z += dt * tapeAdvanceRadPerS * morse.governorRatio;
    }
    if (nodes.gearTrain) {
      nodes.gearTrain.rotation.x += dt * tapeAdvanceRadPerS * morse.gearRatio;
    }
  }

  // 4. Flowing Circuit Electrons
  const pos = nodes.electronPositions;
  const field = wave2dFrames(16, 16, 2);
  const rms = waveFrameRms(field, 16, 16, Math.abs(Math.floor(timeSec * 8)) % 16);
  for (let i = 0; i < nodes.electronCount; i++) {
    const idx = i * 3;
    if (isKeyActive) {
      pos[idx] += dt * electronDisplaySpeed * (1 + rms);
      if (pos[idx] > morse.electronWrapX) {
        pos[idx] = morse.electronOriginX;
      }
    }
  }
  nodes.electronPoints.geometry.attributes.position.needsUpdate = true;
  nodes.electronPoints.visible = isKeyActive;

  // 5. Cutaway Mode
  materials.mahogany.opacity = isCutaway ? 0.35 : 1.0;
  materials.mahogany.transparent = isCutaway;
}
