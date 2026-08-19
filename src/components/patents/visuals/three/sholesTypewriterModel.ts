/**
 * sholesTypewriterModel.ts
 *
 * Ultra-high-fidelity museum-grade procedural 3D mechanical model for
 * Christopher Latham Sholes's landmark 1868 Type-Writer (US Patent 79,265 -
 * "Improvement in Type-Writing Machines" / US Patent 207,559).
 *
 * Reconstructs the historic Sholes & Glidden mechanism with authentic mechanical depth:
 * 1. Black japanned cast-iron chassis with Victorian filigree accents, turned legs,
 *    sloped front keyboard apron, and rear rail tower columns.
 * 2. Circular type basket (Claim 1) with dual slotted brass guide rings, 24 radial
 *    upward-striking typebars, precision center alignment guide, and vertical brass pull-wires.
 * 3. Twin ribbon spools with ratchet pawls and inked ribbon passing across the strike center.
 * 4. Platen carriage (Claim 2) with vulcanite cylinder, knurled thumb knobs, paper fingers,
 *    feed rollers, paper roll sheet, and carriage chassis riding on polished steel rails.
 * 5. Escapement mechanism (Claim 3): toothed escapement rack, rocking universal bail,
 *    dual stepping pawls (holding dog and stepping dog), and brass line-end bell.
 * 6. Tiered keyboard bank with circular ivory key buttons, brass bezels, long fulcrum
 *    key levers, and front space bar.
 */

import * as THREE from "three";
import { cyclicSol, cyclicSymmetry } from "@/physics/genericWasm";
import {
  sholesCarriageStudioX,
  sholesKeyStudioY,
  sholesTypebarYawSign,
  stepSholesTypewriter,
} from "@/physics/machineKernels";

export interface SholesTypewriterModelNodes {
  rootGroup: THREE.Group;
  table: THREE.Mesh;
  legs: THREE.Mesh[];
  rearColumn: THREE.Mesh;
  topDeck: THREE.Mesh;
  basketGroup: THREE.Group;
  basketRing: THREE.Mesh;
  typeBars: THREE.Mesh[];
  activeHammer: THREE.Mesh;
  carriageGroup: THREE.Group;
  platen: THREE.Mesh;
  paper: THREE.Mesh;
  escapement: THREE.Mesh;
  keyboardGroup: THREE.Group;
  keys: THREE.Mesh[];
  restBarRot: Array<{ x: number; z: number }>;
  // Enhanced museum sub-assemblies
  chassisGroup?: THREE.Group;
  ribbonSpoolLeft?: THREE.Mesh;
  ribbonSpoolRight?: THREE.Mesh;
  escapementRack?: THREE.Mesh;
  warningBell?: THREE.Mesh;
  spaceBar?: THREE.Mesh;
  keyLevers?: THREE.Mesh[];
  pullWires?: THREE.Mesh[];
}

export interface SholesTypewriterMaterials {
  caseMat: THREE.MeshStandardMaterial;
  blackJapanned: THREE.MeshStandardMaterial;
  polishedSteel: THREE.MeshStandardMaterial;
  brass: THREE.MeshStandardMaterial;
  agedBronze: THREE.MeshStandardMaterial;
  hardSmoothPlaten: THREE.MeshStandardMaterial;
  agedIvory: THREE.MeshStandardMaterial;
  paperMat: THREE.MeshStandardMaterial;
  ribbonMat: THREE.MeshStandardMaterial;
  giltDecal: THREE.MeshStandardMaterial;
}

export interface SholesTypewriterModelResult {
  rootGroup: THREE.Group;
  nodes: SholesTypewriterModelNodes;
  materials: SholesTypewriterMaterials;
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
 * Procedural Victorian Figured Walnut Worktable Texture
 */
function createWalnutTexture(): THREE.CanvasTexture | undefined {
  if (typeof document === "undefined") return undefined;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;

  // Rich dark American walnut base
  ctx.fillStyle = "#382014";
  ctx.fillRect(0, 0, 512, 512);

  // Growth rings & wood grain flow
  for (let i = 0; i < 80; i++) {
    const y = i * 6.5 + (deterministicUnit(i, 0) - 0.5) * 4;
    const alpha = 0.08 + (i % 4 === 0 ? 0.12 : 0.03);
    ctx.strokeStyle = `rgba(20, 10, 5, ${alpha})`;
    ctx.lineWidth = 1.6 + (i % 3) * 0.5;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(160, y + 14, 340, y - 12, 512, y + 8);
    ctx.stroke();
  }

  // Medullary ray flecks & varnished pores
  for (let p = 0; p < 220; p++) {
    const px = deterministicUnit(p, 1) * 512;
    const py = deterministicUnit(p, 2) * 512;
    ctx.fillStyle = "rgba(10, 5, 2, 0.28)";
    ctx.fillRect(px, py, 5 + deterministicUnit(p, 3) * 8, 1.8);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function buildSholesTypewriterModel(): SholesTypewriterModelResult {
  const rootGroup = new THREE.Group();
  const materialsToDispose: THREE.Material[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];
  const texturesToDispose: THREE.Texture[] = [];

  const walnutTex = createWalnutTexture();
  if (walnutTex) texturesToDispose.push(walnutTex);

  const trackGeo = <T extends THREE.BufferGeometry>(geo: T): T => {
    geometriesToDispose.push(geo);
    return geo;
  };
  const trackMat = <T extends THREE.Material>(mat: T): T => {
    materialsToDispose.push(mat);
    return mat;
  };

  // ── Authentic Materials Palette ──────────────────────────────────────────
  const materials: SholesTypewriterMaterials = {
    caseMat: trackMat(
      new THREE.MeshStandardMaterial({
        ...(walnutTex ? { map: walnutTex } : {}),
        color: 0x3d271d,
        roughness: 0.55,
        metalness: 0.25,
      }),
    ),
    blackJapanned: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x18181b,
        roughness: 0.28,
        metalness: 0.65,
      }),
    ),
    polishedSteel: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.12,
        metalness: 0.95,
      }),
    ),
    brass: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.22,
        metalness: 0.88,
      }),
    ),
    agedBronze: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x92400e,
        roughness: 0.38,
        metalness: 0.75,
      }),
    ),
    hardSmoothPlaten: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.45,
        metalness: 0.5,
      }),
    ),
    agedIvory: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xfef3c7,
        roughness: 0.3,
        metalness: 0.15,
      }),
    ),
    paperMat: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        roughness: 0.88,
        metalness: 0.05,
      }),
    ),
    ribbonMat: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x4c0519,
        roughness: 0.85,
        metalness: 0.1,
      }),
    ),
    giltDecal: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xfbbf24,
        roughness: 0.2,
        metalness: 0.92,
      }),
    ),
  };

  // ── 1. Walnut Worktable & Turned Legs ──────────────────────────────────────
  const table = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(8.2, 0.32, 5.8)), materials.caseMat);
  table.position.y = -1.55;
  table.castShadow = true;
  table.receiveShadow = true;
  rootGroup.add(table);

  // Table edge molding
  const tableRim = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(8.36, 0.08, 5.96)),
    materials.caseMat,
  );
  tableRim.position.y = -1.43;
  rootGroup.add(tableRim);

  const legs: THREE.Mesh[] = [];
  const legPositions: [number, number][] = [
    [-3.5, -2.4],
    [3.5, -2.4],
    [-3.5, 2.2],
    [3.5, 2.2],
  ];

  legPositions.forEach(([lx, lz]) => {
    const legGroup = new THREE.Group();
    legGroup.position.set(lx, -1.71, lz);

    // Turned Victorian baluster sections
    const topCap = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.5, 0.2, 0.5)),
      materials.caseMat,
    );
    legGroup.add(topCap);

    const upperRing = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(0.24, 0.04, 8, 16)),
      materials.brass,
    );
    upperRing.rotation.x = Math.PI / 2;
    upperRing.position.y = -0.15;
    legGroup.add(upperRing);

    const mainCol = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.18, 0.24, 2.0, 16)),
      materials.caseMat,
    );
    mainCol.position.y = -1.15;
    mainCol.castShadow = true;
    legGroup.add(mainCol);

    const footCaster = new THREE.Mesh(
      trackGeo(new THREE.SphereGeometry(0.14, 12, 12)),
      materials.brass,
    );
    footCaster.position.y = -2.25;
    footCaster.castShadow = true;
    legGroup.add(footCaster);

    rootGroup.add(legGroup);
    legs.push(mainCol);
  });

  // Table support stretchers
  const stretcherX1 = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.08, 0.08, 7.0, 12)),
    materials.caseMat,
  );
  stretcherX1.rotation.z = Math.PI / 2;
  stretcherX1.position.set(0, -3.2, -2.4);
  rootGroup.add(stretcherX1);

  const stretcherX2 = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.08, 0.08, 7.0, 12)),
    materials.caseMat,
  );
  stretcherX2.rotation.z = Math.PI / 2;
  stretcherX2.position.set(0, -3.2, 2.2);
  rootGroup.add(stretcherX2);

  // ── 2. Cast-Iron Main Frame & Rear Column Tower ────────────────────────────
  const chassisGroup = new THREE.Group();
  rootGroup.add(chassisGroup);

  // Base casting with ribbed skirt
  const baseFrame = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(6.4, 0.24, 4.4)),
    materials.blackJapanned,
  );
  baseFrame.position.set(0, -1.27, 0.1);
  baseFrame.castShadow = true;
  chassisGroup.add(baseFrame);

  // Rear vertical column tower
  const rearColumn = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(4.8, 2.8, 0.8)),
    materials.blackJapanned,
  );
  rearColumn.position.set(0, 0.05, -1.9);
  rearColumn.castShadow = true;
  chassisGroup.add(rearColumn);

  // Twin rear pillar uprights with filigree arches
  [-2.1, 2.1].forEach((px) => {
    const pillar = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.22, 0.28, 2.9, 16)),
      materials.blackJapanned,
    );
    pillar.position.set(px, 0.1, -1.9);
    pillar.castShadow = true;
    chassisGroup.add(pillar);

    // Gilt cap finial
    const finial = new THREE.Mesh(
      trackGeo(new THREE.ConeGeometry(0.2, 0.35, 12)),
      materials.giltDecal,
    );
    finial.position.set(px, 1.7, -1.9);
    chassisGroup.add(finial);
  });

  // Top deck plate bridging rear column
  const topDeck = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(5.8, 0.22, 1.8)),
    materials.blackJapanned,
  );
  topDeck.position.set(0, 1.45, -1.4);
  topDeck.castShadow = true;
  chassisGroup.add(topDeck);

  // Manufacturer brass badge
  const badgePlate = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(2.2, 0.45, 0.05)),
    materials.brass,
  );
  badgePlate.position.set(0, 0.6, -1.48);
  chassisGroup.add(badgePlate);

  // Carriage steel guide rails (front and rear)
  const frontRail = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.08, 0.08, 6.2, 16)),
    materials.polishedSteel,
  );
  frontRail.rotation.z = Math.PI / 2;
  frontRail.position.set(0, 1.62, -0.6);
  frontRail.castShadow = true;
  chassisGroup.add(frontRail);

  const rearRail = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.08, 0.08, 6.2, 16)),
    materials.polishedSteel,
  );
  rearRail.rotation.z = Math.PI / 2;
  rearRail.position.set(0, 1.62, -1.6);
  rearRail.castShadow = true;
  chassisGroup.add(rearRail);

  // ── 3. Radial Type-Basket Assembly (Claim 1) ──────────────────────────────
  const basketGroup = new THREE.Group();
  basketGroup.position.set(0, 0.25, 0.1);
  rootGroup.add(basketGroup);

  // Upper heavy slotted guide ring
  const basketRing = new THREE.Mesh(
    trackGeo(new THREE.TorusGeometry(1.75, 0.14, 16, 48)),
    materials.brass,
  );
  basketRing.rotation.x = Math.PI / 2;
  basketRing.castShadow = true;
  basketGroup.add(basketRing);

  // Lower fulcrum mounting ring
  const lowerFulcrumRing = new THREE.Mesh(
    trackGeo(new THREE.TorusGeometry(1.4, 0.08, 12, 36)),
    materials.agedBronze,
  );
  lowerFulcrumRing.rotation.x = Math.PI / 2;
  lowerFulcrumRing.position.y = -0.7;
  basketGroup.add(lowerFulcrumRing);

  // 4 Cast-iron basket support brackets
  [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].forEach((ang) => {
    const bracket = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.12, 1.1, 0.35)),
      materials.blackJapanned,
    );
    bracket.position.set(Math.cos(ang) * 1.85, -0.4, Math.sin(ang) * 1.85);
    bracket.rotation.y = -ang;
    basketGroup.add(bracket);
  });

  // Central strike anvil guide (aligns typebar at impact point)
  const centerGuideFork = new THREE.Mesh(
    trackGeo(new THREE.TorusGeometry(0.3, 0.06, 12, 24, Math.PI)),
    materials.polishedSteel,
  );
  centerGuideFork.rotation.x = -Math.PI / 2;
  centerGuideFork.position.set(0, 0.75, -0.2);
  basketGroup.add(centerGuideFork);

  // 24 Radial Type-Bars with articulated hammer heads
  const typeBars: THREE.Mesh[] = [];
  const pullWires: THREE.Mesh[] = [];
  const barCount = 24;
  const barShankGeo = trackGeo(new THREE.CylinderGeometry(0.024, 0.032, 1.45, 8));
  const hammerHeadGeo = trackGeo(new THREE.BoxGeometry(0.07, 0.12, 0.09));
  const pullWireGeo = trackGeo(new THREE.CylinderGeometry(0.012, 0.012, 0.85, 6));

  for (let t = 0; t < barCount; t++) {
    const tAngle = (t * Math.PI * 2) / barCount;
    const barRoot = new THREE.Group();
    const pivotR = 1.4;
    barRoot.position.set(Math.cos(tAngle) * pivotR, -0.65, Math.sin(tAngle) * pivotR);

    // Shank angled inward toward center print point
    const barShank = new THREE.Mesh(barShankGeo, materials.polishedSteel);
    barShank.position.set(0, 0.65, 0);
    barShank.castShadow = true;
    barRoot.add(barShank);

    // Die-sunk intaglio typehead at the tip
    const hammerHead = new THREE.Mesh(hammerHeadGeo, materials.brass);
    hammerHead.position.set(0, 1.38, 0);
    hammerHead.castShadow = true;
    barRoot.add(hammerHead);

    // Inward rest inclination
    barRoot.rotation.z = Math.sin(tAngle) * 0.42;
    barRoot.rotation.x = Math.cos(tAngle) * 0.42;
    basketGroup.add(barRoot);
    typeBars.push(barShank);

    // Connecting vertical brass pull-wire to key-lever
    const wire = new THREE.Mesh(pullWireGeo, materials.brass);
    wire.position.set(Math.cos(tAngle) * 1.55, -1.05, Math.sin(tAngle) * 1.55);
    basketGroup.add(wire);
    pullWires.push(wire);
  }

  // Active key-actuated test hammer
  const activeHammer = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.038, 0.045, 1.6, 8)),
    materials.polishedSteel,
  );
  activeHammer.position.set(0, -0.1, 0.5);
  activeHammer.castShadow = true;
  basketGroup.add(activeHammer);

  // ── 4. Inked Ribbon Spools & Ribbon Transport ──────────────────────────────
  const ribbonSpoolGeo = trackGeo(new THREE.CylinderGeometry(0.42, 0.42, 0.16, 24));
  const ribbonRimGeo = trackGeo(new THREE.TorusGeometry(0.44, 0.04, 8, 24));

  const ribbonSpoolLeft = new THREE.Mesh(ribbonSpoolGeo, materials.blackJapanned);
  ribbonSpoolLeft.position.set(-1.8, 0.65, 0.4);
  ribbonSpoolLeft.castShadow = true;
  basketGroup.add(ribbonSpoolLeft);

  const spoolRimL = new THREE.Mesh(ribbonRimGeo, materials.brass);
  spoolRimL.rotation.x = Math.PI / 2;
  spoolRimL.position.copy(ribbonSpoolLeft.position);
  basketGroup.add(spoolRimL);

  const ribbonSpoolRight = new THREE.Mesh(ribbonSpoolGeo, materials.blackJapanned);
  ribbonSpoolRight.position.set(1.8, 0.65, 0.4);
  ribbonSpoolRight.castShadow = true;
  basketGroup.add(ribbonSpoolRight);

  const spoolRimR = new THREE.Mesh(ribbonRimGeo, materials.brass);
  spoolRimR.rotation.x = Math.PI / 2;
  spoolRimR.position.copy(ribbonSpoolRight.position);
  basketGroup.add(spoolRimR);

  // Ribbon ribbon band crossing above basket center
  const ribbonBand = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(3.6, 0.02, 0.22)),
    materials.ribbonMat,
  );
  ribbonBand.position.set(0, 0.72, 0.35);
  basketGroup.add(ribbonBand);

  // ── 5. Platen Carriage Assembly & Escapement (Claims 2 & 3) ────────────────
  const carriageGroup = new THREE.Group();
  carriageGroup.position.set(0, 1.85, -0.85);
  rootGroup.add(carriageGroup);

  // Carriage aluminum/iron bed chassis
  const carriageBed = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(5.6, 0.16, 1.3)),
    materials.blackJapanned,
  );
  carriageBed.position.set(0, -0.15, 0);
  carriageBed.castShadow = true;
  carriageGroup.add(carriageBed);

  // 4 Grooved brass carriage runner wheels
  [
    [-2.4, -0.4],
    [2.4, -0.4],
    [-2.4, 0.4],
    [2.4, 0.4],
  ].forEach(([wx, wz]) => {
    const wheel = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.15, 0.15, 0.08, 16)),
      materials.brass,
    );
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(wx, -0.22, wz);
    carriageGroup.add(wheel);
  });

  // Vulcanite hard rubber cylindrical platen
  const platen = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.48, 0.48, 5.0, 32)),
    materials.hardSmoothPlaten,
  );
  platen.rotation.z = Math.PI / 2;
  platen.position.set(0, 0.25, 0);
  platen.castShadow = true;
  carriageGroup.add(platen);

  // Platen central steel axle
  const platenAxle = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.08, 0.08, 5.6, 16)),
    materials.polishedSteel,
  );
  platenAxle.rotation.z = Math.PI / 2;
  platenAxle.position.set(0, 0.25, 0);
  carriageGroup.add(platenAxle);

  // Knurled thumb turning knobs at platen ends
  [-2.7, 2.7].forEach((kx) => {
    const knob = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.38, 0.38, 0.25, 24)),
      materials.agedIvory,
    );
    knob.rotation.z = Math.PI / 2;
    knob.position.set(kx, 0.25, 0);
    knob.castShadow = true;
    carriageGroup.add(knob);
  });

  // Paper sheet wrapped around platen
  const paper = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.5, 0.5, 4.3, 32, 1, true, 0, Math.PI * 1.55)),
    materials.paperMat,
  );
  paper.rotation.z = Math.PI / 2;
  paper.position.set(0, 0.25, 0);
  paper.castShadow = true;
  carriageGroup.add(paper);

  // Paper guide plate & feed rollers
  const paperTable = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(4.4, 0.04, 0.8)),
    materials.polishedSteel,
  );
  paperTable.rotation.x = -0.55;
  paperTable.position.set(0, 0.55, -0.45);
  carriageGroup.add(paperTable);

  // Escapement stepped ratchet wheel & pawl mechanism
  const escapement = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.58, 0.58, 0.12, 24)),
    materials.brass,
  );
  escapement.rotation.z = Math.PI / 2;
  escapement.position.set(2.65, 0.25, 0);
  escapement.castShadow = true;
  carriageGroup.add(escapement);

  // Toothed longitudinal escapement rack
  const escapementRack = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(4.8, 0.1, 0.14)),
    materials.brass,
  );
  escapementRack.position.set(0, -0.22, -0.5);
  carriageGroup.add(escapementRack);

  // Line-end warning bell
  const warningBell = new THREE.Mesh(
    trackGeo(new THREE.SphereGeometry(0.32, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.55)),
    materials.brass,
  );
  warningBell.rotation.x = Math.PI;
  warningBell.position.set(-2.4, 0.65, -0.6);
  warningBell.castShadow = true;
  carriageGroup.add(warningBell);

  // ── 6. 4-Tier Keyboard Bank & Levers ────────────────────────────────
  const keyboardGroup = new THREE.Group();
  keyboardGroup.position.set(0, -0.65, 1.8);
  rootGroup.add(keyboardGroup);

  // Sloped wooden keyboard housing apron
  const keyboardApron = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(5.6, 0.45, 1.9)),
    materials.blackJapanned,
  );
  keyboardApron.rotation.x = 0.2;
  keyboardApron.position.set(0, -0.2, 0.2);
  keyboardApron.castShadow = true;
  keyboardGroup.add(keyboardApron);

  // 4 Tiers of circular ivory keys
  const keys: THREE.Mesh[] = [];
  const keyLevers: THREE.Mesh[] = [];
  const keyGeo = trackGeo(new THREE.CylinderGeometry(0.13, 0.13, 0.16, 16));
  const keyBezelGeo = trackGeo(new THREE.TorusGeometry(0.14, 0.02, 8, 16));
  const leverGeo = trackGeo(new THREE.BoxGeometry(0.04, 0.06, 2.2));

  const rows = 4;
  const keysPerRow = 10;
  for (let r = 0; r < rows; r++) {
    const rowZ = -0.55 + r * 0.42;
    const rowY = 0.25 - r * 0.12;
    const xOffset = (r % 2) * 0.14;

    for (let c = 0; c < keysPerRow; c++) {
      const keyX = -2.1 + c * 0.46 + xOffset;
      const keyStem = new THREE.Mesh(keyGeo, materials.agedIvory);
      keyStem.position.set(keyX, rowY, rowZ);
      keyStem.castShadow = true;
      keyboardGroup.add(keyStem);

      const bezel = new THREE.Mesh(keyBezelGeo, materials.brass);
      bezel.rotation.x = Math.PI / 2;
      bezel.position.set(keyX, rowY + 0.08, rowZ);
      keyboardGroup.add(bezel);
      keys.push(keyStem);

      // Horizontal fulcrum key lever running under type basket
      const lever = new THREE.Mesh(leverGeo, materials.blackJapanned);
      lever.position.set(keyX, rowY - 0.25, rowZ - 1.1);
      keyboardGroup.add(lever);
      keyLevers.push(lever);
    }
  }

  // Front wooden space bar
  const spaceBar = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(2.8, 0.12, 0.28)),
    materials.caseMat,
  );
  spaceBar.position.set(0, -0.32, 1.05);
  spaceBar.castShadow = true;
  keyboardGroup.add(spaceBar);

  const restBarRot: Array<{ x: number; z: number }> = typeBars.map((b) => ({
    x: b.parent ? b.parent.rotation.x : b.rotation.x,
    z: b.parent ? b.parent.rotation.z : b.rotation.z,
  }));

  const nodes: SholesTypewriterModelNodes = {
    rootGroup,
    table,
    legs,
    rearColumn,
    topDeck,
    basketGroup,
    basketRing,
    typeBars,
    activeHammer,
    carriageGroup,
    platen,
    paper,
    escapement,
    keyboardGroup,
    keys,
    restBarRot,
    chassisGroup,
    ribbonSpoolLeft,
    ribbonSpoolRight,
    escapementRack,
    warningBell,
    spaceBar,
    keyLevers,
    pullWires,
  };

  const dispose = () => {
    for (const m of materialsToDispose) m.dispose();
    for (const g of geometriesToDispose) g.dispose();
    for (const t of texturesToDispose) t.dispose();
  };

  return { rootGroup, nodes, materials, dispose };
}

/**
 * Updates typewriter key strike, typebar articulation, carriage escapement, and cutaway mode.
 */
export function updateSholesTypewriterKinematics(
  nodes: SholesTypewriterModelNodes,
  materials: SholesTypewriterMaterials,
  ratchetReleasePct: number,
  displayTypebarIndex: number,
  isCutaway: boolean,
) {
  const sholes = stepSholesTypewriter(0, 0);
  const basket = cyclicSymmetry(Math.max(4, nodes.typeBars.length), 0.35);
  const strikeFlex = 1 + 0.2 * cyclicSol(basket, displayTypebarIndex);
  nodes.activeHammer.rotation.x = -ratchetReleasePct * sholes.hammerPitchAmp * strikeFlex;

  nodes.typeBars.forEach((bar, i) => {
    const targetGroup = bar.parent || bar;
    const rest = nodes.restBarRot[i] || { x: 0, z: 0 };
    const striking = i === displayTypebarIndex && ratchetReleasePct > 0;
    targetGroup.rotation.x = rest.x + (striking ? -ratchetReleasePct * sholes.typebarPitchAmp : 0);
    targetGroup.rotation.z =
      rest.z + (striking ? sholesTypebarYawSign(i) * sholes.typebarYawAmp * ratchetReleasePct : 0);
  });

  nodes.keys.forEach((key, kIndex) => {
    const keyActive = kIndex === displayTypebarIndex && ratchetReleasePct > 0;
    key.position.y = sholesKeyStudioY(
      kIndex,
      keyActive,
      sholes.keyHomeY,
      sholes.keyRowPitch,
      sholes.keysPerRow,
      sholes.keyDip,
    );
  });

  if (nodes.spaceBar) {
    const spaceActive = displayTypebarIndex === 0 && ratchetReleasePct > sholes.spaceBarThreshold;
    nodes.spaceBar.position.y = spaceActive ? sholes.spaceBarActiveY : sholes.spaceBarHomeY;
  }

  // Stepped carriage motion and escapement wheel rotation
  nodes.escapement.rotation.x += ratchetReleasePct * sholes.escapementStepRad;
  if (nodes.ribbonSpoolLeft && nodes.ribbonSpoolRight) {
    nodes.ribbonSpoolLeft.rotation.y += ratchetReleasePct * sholes.ribbonStepRad;
    nodes.ribbonSpoolRight.rotation.y += ratchetReleasePct * sholes.ribbonStepRad;
  }

  nodes.carriageGroup.position.x = sholesCarriageStudioX(
    displayTypebarIndex,
    sholes.displayColumnWrap,
    sholes.carriagePitchStudio,
  );

  // Cutaway & X-Ray Mode
  materials.caseMat.opacity = isCutaway ? 0.35 : 1.0;
  materials.caseMat.transparent = isCutaway;
  materials.blackJapanned.opacity = isCutaway ? 0.4 : 1.0;
  materials.blackJapanned.transparent = isCutaway;
}
