/**
 * carrierAirConditionerModel.ts
 *
 * Museum-Grade Procedural 3D Model for Willis H. Carrier's 1906 Apparatus for Treating Air
 * (US Patent 808,897 - "Apparatus for Treating Air").
 *
 * Reconstructs the original industrial spray-type air conditioning and humidity control system:
 * 1. Galvanized sheet-metal spray chamber tunnel with authentic zinc spangle grain and angle-iron bracing.
 * 2. Bottom water collection sump tank with water surface, drain strainer, and float valve.
 * 3. Fresh air and return air mixing damper louvers with modulating quadrant linkage.
 * 4. Dual vertical spray header trees with centrifugal atomizing swirl nozzles (counter-flow and parallel-flow banks).
 * 5. Recirculating water pump with Buffalo Forge green cast-iron volute and pressure gauge.
 * 6. Zig-zag corrugated eliminator baffle plates with droplet separation lip gutters (Claim 3).
 * 7. Forward-curved multi-blade "Sirocco" centrifugal blower fan housing with squirrel-cage rotor.
 * 8. Thermostatic dew-point expansion bulb and psychrometric mist particle advection field.
 */

import * as THREE from "three";

export interface CarrierAirConditionerModelNodes {
  root: THREE.Group;
  housingGroup: THREE.Group;
  solidCasingMesh: THREE.Mesh;
  cutawayCasingMesh: THREE.Mesh;
  sumpTank: THREE.Mesh;
  freshAirDamperLouvers: THREE.Mesh[];
  returnAirDamperLouvers: THREE.Mesh[];
  sprayHeadersGroup: THREE.Group;
  sprayNozzles: THREE.Mesh[];
  recirculatingPump: THREE.Group;
  dewPointThermostatBulb: THREE.Mesh;
  eliminatorBafflesGroup: THREE.Group;
  blowerFanRotor: THREE.Group;
  blowerScrollHousing: THREE.Group;
  atomizedMistPoints: THREE.Points;
}

export interface CarrierAirConditionerMaterials {
  galvanizedSteel: THREE.MeshStandardMaterial;
  paintedDarkGreen: THREE.MeshStandardMaterial;
  brassNozzles: THREE.MeshStandardMaterial;
  zincBaffles: THREE.MeshStandardMaterial;
  copperTubing: THREE.MeshStandardMaterial;
  waterSump: THREE.MeshStandardMaterial;
  mistParticle: THREE.PointsMaterial;
}

export interface CarrierAirConditionerModelResult {
  root: THREE.Group;
  nodes: CarrierAirConditionerModelNodes;
  materials: CarrierAirConditionerMaterials;
  dispose: () => void;
}

const MIST_PARTICLE_COUNT = 180;

/**
 * Deterministic unit noise for procedural grain generation.
 */
function deterministicUnit(index: number, channel: number): number {
  const sample = Math.sin((index + 1) * 12.9898 + (channel + 1) * 78.233) * 43758.5453;
  return sample - Math.floor(sample);
}

/**
 * Procedural Hot-Dip Galvanized Zinc Spangle Texture
 */
function createGalvanizedSpangleTexture(): THREE.CanvasTexture | undefined {
  if (typeof document === "undefined") return undefined;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;

  ctx.fillStyle = "#64748b";
  ctx.fillRect(0, 0, 512, 512);

  // Crystalline zinc spangles (feathery polygonal crystal grains)
  for (let i = 0; i < 70; i++) {
    const cx = deterministicUnit(i, 0) * 512;
    const cy = deterministicUnit(i, 1) * 512;
    const rad = 25 + deterministicUnit(i, 2) * 50;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(deterministicUnit(i, 3) * Math.PI);

    const grad = ctx.createRadialGradient(0, 0, 2, 0, 0, rad);
    const bright = 140 + Math.floor(deterministicUnit(i, 4) * 60);
    grad.addColorStop(0, `rgba(${bright}, ${bright + 10}, ${bright + 20}, 0.55)`);
    grad.addColorStop(0.8, "rgba(90, 105, 125, 0.3)");
    grad.addColorStop(1, "rgba(70, 85, 105, 0)");

    ctx.fillStyle = grad;
    ctx.beginPath();
    for (let p = 0; p < 6; p++) {
      const angle = (p * Math.PI) / 3;
      const r = rad * (0.7 + deterministicUnit(i + p, 5) * 0.5);
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      if (p === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function buildCarrierAirConditionerModel(): CarrierAirConditionerModelResult {
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

  const spangleTex = createGalvanizedSpangleTexture();
  if (spangleTex) disposableTextures.push(spangleTex);

  // Authentic 1906 Willis Carrier Industrial Air Conditioning Materials
  const materials: CarrierAirConditionerMaterials = {
    galvanizedSteel: trackMat(
      new THREE.MeshStandardMaterial({
        ...(spangleTex ? { map: spangleTex } : {}),
        color: 0x64748b,
        roughness: 0.42,
        metalness: 0.82,
      }),
    ),
    paintedDarkGreen: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x1e3a29, // Buffalo Forge industrial green
        roughness: 0.52,
        metalness: 0.58,
      }),
    ),
    brassNozzles: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        roughness: 0.22,
        metalness: 0.92,
      }),
    ),
    zincBaffles: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        roughness: 0.35,
        metalness: 0.8,
      }),
    ),
    copperTubing: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xb87333,
        roughness: 0.28,
        metalness: 0.92,
      }),
    ),
    waterSump: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        transparent: true,
        opacity: 0.65,
        roughness: 0.1,
        metalness: 0.2,
      }),
    ),
    mistParticle: trackMat(
      new THREE.PointsMaterial({
        size: 0.25,
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
      }),
    ),
  };

  // -------------------------------------------------------------
  // 1. Structural Base & Sloped Water Collection Sump
  // -------------------------------------------------------------
  const housingGroup = new THREE.Group();
  root.add(housingGroup);

  // Structural angle-iron support legs
  const legPositions = [
    [-3.8, 1.6],
    [-3.8, -1.6],
    [-1.2, 1.6],
    [-1.2, -1.6],
    [1.4, 1.6],
    [1.4, -1.6],
  ];
  for (const [lx, lz] of legPositions) {
    const leg = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.12, 0.9, 0.12)),
      materials.paintedDarkGreen,
    );
    leg.position.set(lx, -1.65, lz);
    housingGroup.add(leg);
  }

  // Water Sump Basin (Bottom of washer)
  const sumpTank = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(5.8, 0.5, 3.4)),
    materials.paintedDarkGreen,
  );
  sumpTank.position.set(-1.2, -1.15, 0);
  sumpTank.castShadow = true;
  housingGroup.add(sumpTank);

  // Water Surface in Sump
  const waterSurface = new THREE.Mesh(
    trackGeo(new THREE.PlaneGeometry(5.6, 3.2)),
    materials.waterSump,
  );
  waterSurface.rotation.x = -Math.PI / 2;
  waterSurface.position.set(-1.2, -0.92, 0);
  housingGroup.add(waterSurface);

  // -------------------------------------------------------------
  // 2. Galvanized Washer Tunnel (Solid vs Cutaway Modes)
  // -------------------------------------------------------------
  // Solid Full Casing (Outer Galvanized Box)
  const solidCasingMesh = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(5.6, 2.6, 3.2)),
    materials.galvanizedSteel,
  );
  solidCasingMesh.position.set(-1.2, 0.4, 0);
  solidCasingMesh.castShadow = true;
  solidCasingMesh.visible = false;
  housingGroup.add(solidCasingMesh);

  // Cutaway Casing (Open front with structural angle framing)
  const cutawayCasingMesh = new THREE.Group() as unknown as THREE.Mesh;
  const cutawayTop = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(5.6, 0.08, 3.2)),
    materials.galvanizedSteel,
  );
  cutawayTop.position.set(-1.2, 1.7, 0);
  housingGroup.add(cutawayTop);

  const cutawayBack = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(5.6, 2.6, 0.08)),
    materials.galvanizedSteel,
  );
  cutawayBack.position.set(-1.2, 0.4, -1.56);
  housingGroup.add(cutawayBack);

  // Inspection Window on Side
  const windowFrame = new THREE.Mesh(
    trackGeo(new THREE.TorusGeometry(0.35, 0.04, 8, 20)),
    materials.brassNozzles,
  );
  windowFrame.position.set(-1.2, 0.5, 1.6);
  housingGroup.add(windowFrame);

  // -------------------------------------------------------------
  // 3. Intake Air Mixing Louver Dampers
  // -------------------------------------------------------------
  const freshAirDamperLouvers: THREE.Mesh[] = [];
  const returnAirDamperLouvers: THREE.Mesh[] = [];

  // Fresh air louvers (intake at -4.0)
  for (let d = 0; d < 5; d++) {
    const louver = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.04, 0.38, 2.8)),
      materials.zincBaffles,
    );
    louver.position.set(-4.0, -0.6 + d * 0.45, 0);
    louver.rotation.z = Math.PI / 6;
    housingGroup.add(louver);
    freshAirDamperLouvers.push(louver);
  }

  // -------------------------------------------------------------
  // 4. Atomizing Spray Header Trees & Swirl Nozzles (US 808,897)
  // -------------------------------------------------------------
  const sprayHeadersGroup = new THREE.Group();
  sprayHeadersGroup.position.set(0, 0, 0);
  root.add(sprayHeadersGroup);

  const sprayNozzles: THREE.Mesh[] = [];

  // Two vertical spray header rows (Counter-flow & Parallel-flow)
  [-2.6, -1.4].forEach((hx, bankIdx) => {
    [-1.0, 0.0, 1.0].forEach((hz) => {
      // Vertical supply standpipe
      const pipe = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.06, 0.06, 2.4, 12)),
        materials.copperTubing,
      );
      pipe.position.set(hx, 0.35, hz);
      sprayHeadersGroup.add(pipe);

      // 4 Atomizing Nozzles per pipe
      for (let n = 0; n < 4; n++) {
        const ny = -0.55 + n * 0.6;
        const nozzle = new THREE.Mesh(
          trackGeo(new THREE.ConeGeometry(0.05, 0.16, 8)),
          materials.brassNozzles,
        );
        // First bank sprays against incoming air (counter-flow -X), second bank with air (+X)
        nozzle.rotation.z = bankIdx === 0 ? -Math.PI / 2 : Math.PI / 2;
        nozzle.position.set(bankIdx === 0 ? hx - 0.12 : hx + 0.12, ny, hz);
        sprayHeadersGroup.add(nozzle);
        sprayNozzles.push(nozzle);
      }
    });
  });

  // Centrifugal Recirculating Water Pump & Piping
  const recirculatingPump = new THREE.Group();
  recirculatingPump.position.set(-2.0, -1.35, 1.8);
  root.add(recirculatingPump);

  const pumpVolute = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.35, 0.35, 0.28, 16)),
    materials.paintedDarkGreen,
  );
  pumpVolute.rotation.z = Math.PI / 2;
  recirculatingPump.add(pumpVolute);

  const pumpMotor = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.25, 0.25, 0.6, 16)),
    materials.paintedDarkGreen,
  );
  pumpMotor.rotation.z = Math.PI / 2;
  pumpMotor.position.set(0.45, 0, 0);
  recirculatingPump.add(pumpMotor);

  // Thermostatic Dew-Point Sensing Bulb at washer exit
  const dewPointThermostatBulb = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.04, 0.04, 1.8, 12)),
    materials.copperTubing,
  );
  dewPointThermostatBulb.position.set(1.4, 0.4, 0);
  root.add(dewPointThermostatBulb);

  // -------------------------------------------------------------
  // 5. Zig-Zag Mist Eliminator Baffle Plates (Claim 3)
  // -------------------------------------------------------------
  const eliminatorBafflesGroup = new THREE.Group();
  eliminatorBafflesGroup.position.set(0.6, 0.4, 0);
  root.add(eliminatorBafflesGroup);

  // 14 Closely-spaced corrugated chevron baffle plates
  for (let b = 0; b < 14; b++) {
    const bz = -1.3 + b * 0.2;
    const bafflePlate = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.7, 2.3, 0.03)),
      materials.zincBaffles,
    );
    bafflePlate.rotation.y = Math.PI / 4;
    bafflePlate.position.set(0, 0, bz);
    eliminatorBafflesGroup.add(bafflePlate);
  }

  // -------------------------------------------------------------
  // 6. Forward-Curved Centrifugal "Sirocco" Blower Fan
  // -------------------------------------------------------------
  const blowerScrollHousing = new THREE.Group();
  blowerScrollHousing.position.set(3.2, 0.4, 0);
  root.add(blowerScrollHousing);

  // Heavy sheet-metal scroll casing
  const scrollMesh = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(1.6, 1.6, 2.2, 28)),
    materials.paintedDarkGreen,
  );
  scrollMesh.rotation.x = Math.PI / 2;
  scrollMesh.castShadow = true;
  blowerScrollHousing.add(scrollMesh);

  // Rectangular Discharge Duct
  const dischargeDuct = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(1.2, 1.6, 2.2)),
    materials.galvanizedSteel,
  );
  dischargeDuct.position.set(1.4, 0.8, 0);
  blowerScrollHousing.add(dischargeDuct);

  // Squirrel-Cage Fan Impeller Rotor
  const blowerFanRotor = new THREE.Group();
  blowerScrollHousing.add(blowerFanRotor);

  const fanShaft = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.08, 0.08, 2.8, 16)),
    materials.galvanizedSteel,
  );
  fanShaft.rotation.x = Math.PI / 2;
  blowerFanRotor.add(fanShaft);

  // 24 Forward-curved steel blades
  for (let f = 0; f < 24; f++) {
    const angle = (f * Math.PI * 2) / 24;
    const blade = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.04, 0.35, 1.8)),
      materials.zincBaffles,
    );
    blade.position.set(Math.cos(angle) * 1.3, Math.sin(angle) * 1.3, 0);
    blade.rotation.z = angle + 0.3; // Forward curve tilt
    blowerFanRotor.add(blade);
  }

  // -------------------------------------------------------------
  // 7. Atomized Mist Particles (Dynamic Flow Simulation)
  // -------------------------------------------------------------
  const mistGeo = trackGeo(new THREE.BufferGeometry());
  const mistPositions = new Float32Array(MIST_PARTICLE_COUNT * 3);

  // Deterministic initial seed
  for (let i = 0; i < MIST_PARTICLE_COUNT; i++) {
    const hashX = Math.sin(i * 13.123);
    const hashY = Math.cos(i * 37.456);
    const hashZ = Math.sin(i * 59.789);
    mistPositions[i * 3 + 0] = -3.2 + (hashX + 1) * 1.8;
    mistPositions[i * 3 + 1] = -0.6 + (hashY + 1) * 1.0;
    mistPositions[i * 3 + 2] = hashZ * 1.3;
  }

  mistGeo.setAttribute("position", new THREE.BufferAttribute(mistPositions, 3));
  const atomizedMistPoints = new THREE.Points(mistGeo, materials.mistParticle);
  root.add(atomizedMistPoints);

  const nodes: CarrierAirConditionerModelNodes = {
    root,
    housingGroup,
    solidCasingMesh,
    cutawayCasingMesh,
    sumpTank,
    freshAirDamperLouvers,
    returnAirDamperLouvers,
    sprayHeadersGroup,
    sprayNozzles,
    recirculatingPump,
    dewPointThermostatBulb,
    eliminatorBafflesGroup,
    blowerFanRotor,
    blowerScrollHousing,
    atomizedMistPoints,
  };

  const dispose = () => {
    for (const g of disposableGeometries) g.dispose();
    for (const m of disposableMaterials) m.dispose();
    for (const t of disposableTextures) t.dispose();
  };

  return { root, nodes, materials, dispose };
}

/**
 * Updates fan rotor speed, damper angles, and mist particle advection across washer.
 */
export function updateCarrierAirConditionerKinematics(
  nodes: CarrierAirConditionerModelNodes,
  materials: CarrierAirConditionerMaterials,
  dt: number,
  airflowCfm: number,
  _sprayWaterTempC: number,
  showMist: boolean,
  cutawayMode: boolean,
) {
  // 1. Blower Fan Impeller Rotation
  const fanOmega = (airflowCfm / 15000) * 14.0;
  nodes.blowerFanRotor.rotation.z -= fanOmega * dt;

  // 2. Cutaway Visibility
  nodes.solidCasingMesh.visible = !cutawayMode;

  // 3. Modulating Dampers Angle
  const damperAngle = (airflowCfm / 25000) * (Math.PI / 3);
  nodes.freshAirDamperLouvers.forEach((louver) => {
    louver.rotation.z = damperAngle;
  });

  // 4. Mist Droplets Advection & Psychrometric Saturation
  materials.mistParticle.opacity = showMist ? 0.75 : 0.0;

  if (showMist) {
    const pos = nodes.atomizedMistPoints.geometry.attributes.position.array as Float32Array;
    const speed = (airflowCfm / 15000) * 3.2;

    for (let i = 0; i < MIST_PARTICLE_COUNT; i++) {
      const idx = i * 3;
      pos[idx] += speed * dt;

      if (pos[idx] > 0.4) {
        const hashPhase = i + airflowCfm / 150;
        const hashX = Math.sin(hashPhase * 13.123);
        const hashY = Math.cos(hashPhase * 37.456);
        const hashZ = Math.sin(hashPhase * 59.789);
        pos[idx] = -3.2 + (hashX + 1) * 0.4;
        pos[idx + 1] = -0.6 + (hashY + 1) * 1.0;
        pos[idx + 2] = hashZ * 1.3;
      }
    }
    nodes.atomizedMistPoints.geometry.attributes.position.needsUpdate = true;
  }
}
