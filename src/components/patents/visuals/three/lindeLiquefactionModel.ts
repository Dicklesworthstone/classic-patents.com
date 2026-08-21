/**
 * lindeLiquefactionModel.ts
 *
 * Museum-Grade Procedural 3D Model for Carl von Linde's 1903 Regenerative Air Liquefaction Process
 * (US Patent 727,650 - "Process of Liquefying Air or Other Gases").
 *
 * Reconstructs the historic cryogenic physics breakthrough:
 * 1. Felted wool thermal insulation cryostat casing with brass end flanges and tripod support stand.
 * 2. Counter-current heat exchanger coil G′ consisting of coaxial nested pipes (inner high-pressure supply, outer low-pressure return).
 * 3. Joule-Thomson throttling expansion needle valve R′ with regulating handwheel and nozzle N.
 * 4. Lower collection receiver vessel V′ with cryogenic liquid air pool (liquid oxygen/nitrogen at 77 K).
 * 5. High-pressure supply piping and cryogenic low-pressure return line with frosted condensation texture.
 * 6. Dynamic Joule-Thomson expansion mist droplet advection.
 */

import * as THREE from "three";

export interface LindeLiquefactionModelNodes {
  root: THREE.Group;
  cryostatGroup: THREE.Group;
  solidCasingMesh: THREE.Mesh;
  cutawayCasingMesh: THREE.Mesh;
  supportLegs: THREE.Mesh[];
  counterCurrentCoilGroup: THREE.Group;
  coilRings: THREE.Mesh[];
  inletSupplyPipe: THREE.Mesh;
  returnRecyclePipe: THREE.Mesh;
  jtValveGroup: THREE.Group;
  jtSpindleRod: THREE.Mesh;
  jtHandwheel: THREE.Mesh;
  jtNeedleNozzle: THREE.Mesh;
  receiverVessel: THREE.Mesh;
  condensedGasVolume: THREE.Mesh;
  flowTracerPoints: THREE.Points;
}

export interface LindeLiquefactionMaterials {
  insulatingPacking: THREE.MeshStandardMaterial;
  apparatusMetal: THREE.MeshStandardMaterial;
  highPressurePath: THREE.MeshStandardMaterial;
  lowPressureReturn: THREE.MeshStandardMaterial;
  receiverGlass: THREE.MeshStandardMaterial;
  condensedGas: THREE.MeshStandardMaterial;
  flowTracer: THREE.PointsMaterial;
}

export interface LindeLiquefactionModelResult {
  root: THREE.Group;
  nodes: LindeLiquefactionModelNodes;
  materials: LindeLiquefactionMaterials;
  dispose: () => void;
}

const MIST_COUNT = 160;

/**
 * Deterministic unit noise for procedural grain generation.
 */
function deterministicUnit(index: number, channel: number): number {
  const sample = Math.sin((index + 1) * 12.9898 + (channel + 1) * 78.233) * 43758.5453;
  return sample - Math.floor(sample);
}

/**
 * Procedural Wool / Mineral Wool Insulation Felt Texture
 */
function createInsulationFeltTexture(): THREE.CanvasTexture | undefined {
  if (typeof document === "undefined") return undefined;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;

  ctx.fillStyle = "#4a3728";
  ctx.fillRect(0, 0, 512, 512);

  // Felted wool fiber strands
  ctx.strokeStyle = "rgba(120, 95, 75, 0.35)";
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 300; i++) {
    const x0 = deterministicUnit(i, 0) * 512;
    const y0 = deterministicUnit(i, 1) * 512;
    const len = 15 + deterministicUnit(i, 2) * 25;
    const angle = deterministicUnit(i, 3) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x0 + Math.cos(angle) * len, y0 + Math.sin(angle) * len);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 4);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Procedural Frosted Cryogenic Copper Texture
 */
function createFrostedCopperTexture(): THREE.CanvasTexture | undefined {
  if (typeof document === "undefined") return undefined;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;

  ctx.fillStyle = "#38bdf8";
  ctx.fillRect(0, 0, 512, 512);

  // Microscopic rime ice frost crystals
  for (let i = 0; i < 200; i++) {
    const cx = deterministicUnit(i, 0) * 512;
    const cy = deterministicUnit(i, 1) * 512;
    const rad = 2 + deterministicUnit(i, 2) * 6;
    ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + deterministicUnit(i, 3) * 0.4})`;
    ctx.beginPath();
    ctx.arc(cx, cy, rad, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function buildLindeLiquefactionModel(): LindeLiquefactionModelResult {
  const root = new THREE.Group();
  const disposableGeometries: THREE.BufferGeometry[] = [];
  const disposableMaterials: THREE.Material[] = [];
  const disposableTextures: THREE.Texture[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(geo: T): T => {
    disposableGeometries.push(geo);
    return geo;
  };
  const trackMat = <T extends THREE.Material>(mat: T): T => {
    disposableMaterials.push(mat);
    return mat;
  };

  const feltTex = createInsulationFeltTexture();
  if (feltTex) disposableTextures.push(feltTex);

  const frostTex = createFrostedCopperTexture();
  if (frostTex) disposableTextures.push(frostTex);

  const materials: LindeLiquefactionMaterials = {
    insulatingPacking: trackMat(
      new THREE.MeshStandardMaterial({
        ...(feltTex ? { map: feltTex } : {}),
        color: 0x4a3728,
        roughness: 0.72,
        metalness: 0.12,
      }),
    ),
    apparatusMetal: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        roughness: 0.22,
        metalness: 0.9,
      }),
    ),
    highPressurePath: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xb87333,
        roughness: 0.3,
        metalness: 0.9,
      }),
    ),
    lowPressureReturn: trackMat(
      new THREE.MeshStandardMaterial({
        ...(frostTex ? { map: frostTex } : {}),
        color: 0x38bdf8,
        roughness: 0.25,
        metalness: 0.85,
      }),
    ),
    receiverGlass: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        transparent: true,
        opacity: 0.55,
        roughness: 0.1,
        metalness: 0.3,
      }),
    ),
    condensedGas: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        transparent: true,
        opacity: 0.85,
        roughness: 0.05,
        metalness: 0.1,
      }),
    ),
    flowTracer: trackMat(
      new THREE.PointsMaterial({
        size: 0.3,
        color: 0x7dd3fc,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
      }),
    ),
  };

  // -------------------------------------------------------------
  // 1. Casing H around counter-current apparatus G′
  // -------------------------------------------------------------
  const cryostatGroup = new THREE.Group();
  root.add(cryostatGroup);

  const supportLegs: THREE.Mesh[] = [];
  for (let l = 0; l < 3; l++) {
    const lAngle = (l * Math.PI * 2) / 3;
    const leg = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.08, 0.12, 1.6, 12)),
      materials.apparatusMetal,
    );
    leg.position.set(Math.cos(lAngle) * 1.3, -2.6, Math.sin(lAngle) * 1.3);
    leg.rotation.z = Math.cos(lAngle) * 0.15;
    leg.rotation.x = -Math.sin(lAngle) * 0.15;
    leg.receiveShadow = true;
    cryostatGroup.add(leg);
    supportLegs.push(leg);
  }

  // Solid view of casing H and its non-conducting packing
  const solidCasingMesh = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(1.4, 1.4, 4.6, 32)),
    materials.insulatingPacking,
  );
  solidCasingMesh.position.set(0, 0.4, 0);
  solidCasingMesh.castShadow = true;
  solidCasingMesh.visible = false;
  cryostatGroup.add(solidCasingMesh);

  // Cutaway of casing H, to show G′'s nested coiled pipes
  const cutawayCasingGeo = trackGeo(
    new THREE.CylinderGeometry(1.4, 1.4, 4.6, 32, 1, false, 0, Math.PI),
  );
  cutawayCasingGeo.rotateY(Math.PI / 2);
  const cutawayCasingMesh = new THREE.Mesh(cutawayCasingGeo, materials.insulatingPacking);
  cutawayCasingMesh.position.set(0, 0.4, 0);
  cutawayCasingMesh.castShadow = true;
  cryostatGroup.add(cutawayCasingMesh);

  // Brass end flanges
  [-1.9, 2.7].forEach((fy) => {
    const flange = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(1.48, 1.48, 0.15, 32)),
      materials.apparatusMetal,
    );
    flange.position.set(0, fy, 0);
    cryostatGroup.add(flange);
  });

  // -------------------------------------------------------------
  // 2. Counter-current apparatus G′: two coiled pipes, one inside the other
  // -------------------------------------------------------------
  const counterCurrentCoilGroup = new THREE.Group();
  root.add(counterCurrentCoilGroup);

  const coilRings: THREE.Mesh[] = [];
  const coilTurns = 18;

  for (let c = 0; c < coilTurns; c++) {
    const fraction = c / (coilTurns - 1);
    const coilMat = fraction < 0.5 ? materials.highPressurePath : materials.lowPressureReturn;

    const ring = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(0.95, 0.08, 12, 36)), coilMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(0, 2.3 - c * 0.22, 0);
    counterCurrentCoilGroup.add(ring);
    coilRings.push(ring);
  }

  // High-pressure supply into G′ from cooler K
  const inletSupplyPipe = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.06, 0.06, 1.2, 12)),
    materials.highPressurePath,
  );
  inletSupplyPipe.position.set(-1.2, 2.8, 0);
  inletSupplyPipe.rotation.z = Math.PI / 4;
  counterCurrentCoilGroup.add(inletSupplyPipe);

  // Low-pressure return from G′
  const returnRecyclePipe = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.09, 0.09, 1.2, 12)),
    materials.lowPressureReturn,
  );
  returnRecyclePipe.position.set(1.2, 2.8, 0);
  returnRecyclePipe.rotation.z = -Math.PI / 4;
  counterCurrentCoilGroup.add(returnRecyclePipe);

  // -------------------------------------------------------------
  // 3. Nozzle N with regulating valve R′ at the bottom of G′
  // -------------------------------------------------------------
  const jtValveGroup = new THREE.Group();
  jtValveGroup.position.set(0, -1.6, 0);
  root.add(jtValveGroup);

  // Valve Body Casting
  const jtBody = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.24, 0.24, 0.6, 16)),
    materials.apparatusMetal,
  );
  jtValveGroup.add(jtBody);

  // Nozzle N / valve R′
  const jtNeedleNozzle = new THREE.Mesh(
    trackGeo(new THREE.ConeGeometry(0.12, 0.35, 12)),
    materials.apparatusMetal,
  );
  jtNeedleNozzle.rotation.x = Math.PI;
  jtNeedleNozzle.position.set(0, -0.4, 0);
  jtValveGroup.add(jtNeedleNozzle);

  // Valve stem
  const jtSpindleRod = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.035, 0.035, 4.8, 12)),
    materials.apparatusMetal,
  );
  jtSpindleRod.position.set(0, 2.3, 0);
  jtValveGroup.add(jtSpindleRod);

  // Regulator handwheel
  const jtHandwheel = new THREE.Mesh(
    trackGeo(new THREE.TorusGeometry(0.38, 0.05, 8, 24)),
    materials.apparatusMetal,
  );
  jtHandwheel.rotation.x = Math.PI / 2;
  jtHandwheel.position.set(0, 4.7, 0);
  jtValveGroup.add(jtHandwheel);

  // -------------------------------------------------------------
  // 4. Closed vessel V′ beneath G′
  // -------------------------------------------------------------
  const receiverVessel = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.75, 0.75, 0.9, 24)),
    materials.receiverGlass,
  );
  receiverVessel.position.set(0, -2.25, 0);
  root.add(receiverVessel);

  // Liquid air collection pool
  const condensedGasVolume = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.68, 0.68, 0.5, 24)),
    materials.condensedGas,
  );
  condensedGasVolume.position.set(0, -2.4, 0);
  root.add(condensedGasVolume);

  // -------------------------------------------------------------
  // 5. Flow tracer at N/R′
  // -------------------------------------------------------------
  const mistGeo = trackGeo(new THREE.BufferGeometry());
  const mistPositions = new Float32Array(MIST_COUNT * 3);

  for (let i = 0; i < MIST_COUNT; i++) {
    const r = Math.sqrt((i + 1) / MIST_COUNT) * 0.55;
    const a = i * 2.39996;
    mistPositions[i * 3 + 0] = Math.cos(a) * r;
    mistPositions[i * 3 + 1] = -1.7 - (i / MIST_COUNT) * 0.6;
    mistPositions[i * 3 + 2] = Math.sin(a) * r;
  }

  mistGeo.setAttribute("position", new THREE.BufferAttribute(mistPositions, 3));
  const flowTracerPoints = new THREE.Points(mistGeo, materials.flowTracer);
  root.add(flowTracerPoints);

  const nodes: LindeLiquefactionModelNodes = {
    root,
    cryostatGroup,
    solidCasingMesh,
    cutawayCasingMesh,
    supportLegs,
    counterCurrentCoilGroup,
    coilRings,
    inletSupplyPipe,
    returnRecyclePipe,
    jtValveGroup,
    jtSpindleRod,
    jtHandwheel,
    jtNeedleNozzle,
    receiverVessel,
    condensedGasVolume,
    flowTracerPoints,
  };

  const dispose = () => {
    for (const g of disposableGeometries) g.dispose();
    for (const m of disposableMaterials) m.dispose();
    for (const t of disposableTextures) t.dispose();
  };

  return { root, nodes, materials, dispose };
}

/**
 * Updates explanatory flow tracing and cutaway state.
 */
export function updateLindeLiquefactionKinematics(
  nodes: LindeLiquefactionModelNodes,
  materials: LindeLiquefactionMaterials,
  dt: number,
  timeSec: number,
  highPressureAtm: number,
  showFlowTracer: boolean,
  cutawayMode: boolean,
) {
  // 1. Regulator handwheel — display ω scales with grant p (75 atm → leftover 0.4)
  const pressureNorm = Math.max(0.2, highPressureAtm / 75);
  nodes.jtHandwheel.rotation.z = Math.sin(timeSec * 0.4 * pressureNorm) * 0.2;

  // 2. Cutaway Visibility
  nodes.solidCasingMesh.visible = !cutawayMode;
  nodes.cutawayCasingMesh.visible = cutawayMode;

  // 3. Liquid level subtle fluid ripple
  nodes.condensedGasVolume.scale.y = 1.0 + Math.sin(timeSec * 3.0 * pressureNorm) * 0.04;

  // 4. Flow markers scaled to pressure
  materials.flowTracer.opacity = showFlowTracer
    ? Math.min(0.8, (highPressureAtm / 75) * 0.65)
    : 0.0;

  if (showFlowTracer) {
    const pos = nodes.flowTracerPoints.geometry.attributes.position.array as Float32Array;
    const jetSpeed = (highPressureAtm / 75) * 1.1;

    for (let i = 0; i < MIST_COUNT; i++) {
      const idx = i * 3;
      pos[idx + 1] -= jetSpeed * dt;

      if (pos[idx + 1] < -2.5) {
        const r = Math.sqrt((i + 1) / MIST_COUNT) * 0.4;
        const a = (i + timeSec * 10 * pressureNorm) * 2.39996;
        pos[idx + 0] = Math.cos(a) * r;
        pos[idx + 1] = -1.7;
        pos[idx + 2] = Math.sin(a) * r;
      }
    }
    nodes.flowTracerPoints.geometry.attributes.position.needsUpdate = true;
  }
}
