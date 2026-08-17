import * as THREE from "three";

/** 1903 Flyer reference geometry. 1 world unit = 1 metre. */
export const FLYER_DIM = {
  span: 12.29,
  chord: 1.98,
  gap: 1.83,
  camberRatio: 0.05,
  thicknessRatio: 0.045,
  anhedralDeg: 3.2,
  length: 6.43,
  canardSpan: 3.66,
  canardChord: 0.76,
  canardGap: 0.55,
  canardArm: 2.15,
  rudderHeight: 1.35,
  rudderChord: 0.72,
  rudderSep: 0.72,
  rudderArm: 2.05,
  propDiameter: 2.59,
  propX: 2.15,
} as const;

export interface FlyerAirframe {
  group: THREE.Group;
  upperWing: THREE.Group;
  lowerWing: THREE.Group;
  canardGroup: THREE.Group;
  rudderGroup: THREE.Group;
  cradleGroup: THREE.Group;
  leftPropBlades: THREE.Group;
  rightPropBlades: THREE.Group;
  textures: THREE.Texture[];
}

function woodTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);
  ctx.fillStyle = "#8b5a2b";
  ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 48; i++) {
    ctx.strokeStyle = `rgba(48, 24, 8, ${0.07 + (i % 5) * 0.03})`;
    ctx.lineWidth = 1 + (i % 3) * 0.4;
    const x = i * 5.4;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.bezierCurveTo(x + 10, 70, x - 8, 170, x + 6, 256);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function muslinTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);
  ctx.fillStyle = "#f4ead0";
  ctx.fillRect(0, 0, 128, 128);
  ctx.strokeStyle = "rgba(160, 140, 100, 0.18)";
  ctx.lineWidth = 0.6;
  for (let i = 0; i < 128; i += 4) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 128);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(128, i);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(8, 3);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Wright-style thin parabolic camber (1-in-20), leading edge at +z. */
function airfoilPoint(
  s: number,
  chord: number,
  camberRatio: number,
  halfThick: number,
  upper: boolean,
) {
  const z = chord * 0.5 - s * chord;
  const camber = 4 * camberRatio * s * (1 - s) * chord;
  const thick = halfThick * Math.sqrt(Math.max(s, 0.012)) * (1 - s) * 2;
  return { y: camber + (upper ? thick : -thick), z };
}

function loftWingPanel(opts: {
  x0: number;
  x1: number;
  chord: number;
  camberRatio: number;
  thicknessRatio: number;
  anhedralRad: number;
  worldX0?: number;
  stations?: number;
  airfoilPts?: number;
}): THREE.BufferGeometry {
  const stations = opts.stations ?? 10;
  const n = opts.airfoilPts ?? 18;
  const halfT = opts.thicknessRatio * opts.chord * 0.5;
  const ring = n * 2;
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= stations; i++) {
    const t = i / stations;
    const x = opts.x0 + (opts.x1 - opts.x0) * t;
    const worldX = (opts.worldX0 ?? 0) + x;
    const droop = -Math.tan(opts.anhedralRad) * Math.abs(worldX);
    for (let k = 0; k <= n; k++) {
      const s = k / n;
      const u = airfoilPoint(s, opts.chord, opts.camberRatio, halfT, true);
      positions.push(x, u.y + droop, u.z);
      uvs.push(t, s * 0.5);
    }
    for (let k = n; k >= 0; k--) {
      const s = k / n;
      const l = airfoilPoint(s, opts.chord, opts.camberRatio, halfT, false);
      positions.push(x, l.y + droop, l.z);
      uvs.push(t, 1 - s * 0.5);
    }
  }

  const vertsPerStation = ring + 2;
  const flipWinding = opts.x1 < opts.x0;
  for (let i = 0; i < stations; i++) {
    const a = i * vertsPerStation;
    const b = (i + 1) * vertsPerStation;
    for (let k = 0; k < vertsPerStation - 1; k++) {
      if (flipWinding) {
        indices.push(a + k, a + k + 1, b + k);
        indices.push(b + k, a + k + 1, b + k + 1);
      } else {
        indices.push(a + k, b + k, a + k + 1);
        indices.push(b + k, b + k + 1, a + k + 1);
      }
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

function ellipticalStrut(length: number, mat: THREE.Material): THREE.Mesh {
  const geo = new THREE.CylinderGeometry(0.028, 0.028, length, 10);
  geo.scale(0.7, 1, 1.35);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  return mesh;
}

function addWire(
  group: THREE.Group,
  ax: number,
  ay: number,
  az: number,
  bx: number,
  by: number,
  bz: number,
  mat: THREE.Material,
) {
  const dx = bx - ax;
  const dy = by - ay;
  const dz = bz - az;
  const len = Math.hypot(dx, dy, dz);
  if (len < 1e-8) return;
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, len, 5), mat);
  mesh.position.set((ax + bx) / 2, (ay + by) / 2, (az + bz) / 2);
  mesh.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(dx, dy, dz).normalize(),
  );
  group.add(mesh);
}

function scimitarBlade(radius: number, mat: THREE.Material): THREE.Mesh {
  const radial = 14;
  const around = 8;
  const positions: number[] = [];
  const indices: number[] = [];
  for (let i = 0; i <= radial; i++) {
    const r = (i / radial) * radius;
    const rn = r / radius;
    const twist = (1 - rn) * 0.85 + 0.18;
    const chord = 0.2 * (0.35 + 0.75 * Math.sin(Math.PI * Math.max(rn, 0.04)));
    const thick = 0.018 * (1 - rn * 0.7);
    const sweep = rn * rn * 0.12;
    for (let k = 0; k <= around; k++) {
      const a = (k / around) * Math.PI * 2;
      const localY = Math.cos(a) * chord * 0.5;
      const localZ = Math.sin(a) * thick;
      const cy = Math.cos(twist);
      const sy = Math.sin(twist);
      const y = localY * cy - localZ * sy;
      const z = localY * sy + localZ * cy + sweep;
      positions.push(y, r, z);
    }
  }
  for (let i = 0; i < radial; i++) {
    for (let k = 0; k < around; k++) {
      const a = i * (around + 1) + k;
      const b = a + around + 1;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  return mesh;
}

function makeCamberedRib(chord: number, camberRatio: number, mat: THREE.Material): THREE.Mesh {
  const pts: THREE.Vector3[] = [];
  const n = 16;
  for (let i = 0; i <= n; i++) {
    const s = i / n;
    const z = chord * 0.5 - s * chord;
    const y = 4 * camberRatio * s * (1 - s) * chord;
    pts.push(new THREE.Vector3(0, y, z));
  }
  const curve = new THREE.CatmullRomCurve3(pts);
  const geo = new THREE.TubeGeometry(curve, 16, 0.012, 6, false);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  return mesh;
}

export function buildWrightFlyerAirframe(): FlyerAirframe {
  const d = FLYER_DIM;
  const textures: THREE.Texture[] = [];
  const woodMap = woodTexture();
  const muslinMap = muslinTexture();
  textures.push(woodMap, muslinMap);

  const muslin = new THREE.MeshPhysicalMaterial({
    map: muslinMap,
    color: 0xf5ebd6,
    roughness: 0.82,
    metalness: 0.0,
    transmission: 0.06,
    thickness: 0.02,
    transparent: true,
    opacity: 0.94,
    side: THREE.DoubleSide,
  });
  const spruce = new THREE.MeshStandardMaterial({
    map: woodMap,
    color: 0xc9a46c,
    roughness: 0.45,
    metalness: 0.04,
  });
  const ash = new THREE.MeshStandardMaterial({
    map: woodMap,
    color: 0x8b5a2b,
    roughness: 0.52,
    metalness: 0.03,
  });
  const steel = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    metalness: 0.94,
    roughness: 0.2,
  });
  const brass = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    metalness: 0.88,
    roughness: 0.26,
  });
  const alum = new THREE.MeshStandardMaterial({
    color: 0x9ca3af,
    metalness: 0.84,
    roughness: 0.32,
  });
  const iron = new THREE.MeshStandardMaterial({
    color: 0x374151,
    metalness: 0.72,
    roughness: 0.46,
  });
  const copper = new THREE.MeshStandardMaterial({
    color: 0xb45309,
    metalness: 0.86,
    roughness: 0.24,
  });
  const propWood = new THREE.MeshStandardMaterial({
    map: woodMap,
    color: 0x6e401f,
    roughness: 0.3,
    metalness: 0.08,
  });
  const darkWool = new THREE.MeshStandardMaterial({
    color: 0x1f2937,
    roughness: 0.9,
  });
  const pilotSkin = new THREE.MeshStandardMaterial({
    color: 0xd4a373,
    roughness: 0.65,
  });

  const group = new THREE.Group();
  const anhedral = (d.anhedralDeg * Math.PI) / 180;
  const yUpper = d.gap / 2;
  const yLower = -d.gap / 2;
  const zFront = d.chord * 0.42;
  const zRear = -d.chord * 0.38;
  const centerHalf = d.span * 0.22;
  const tipInboard = centerHalf;

  const makeSurface = (y: number) => {
    const wing = new THREE.Group();
    wing.position.y = y;

    const centerGeo = loftWingPanel({
      x0: -centerHalf,
      x1: centerHalf,
      chord: d.chord,
      camberRatio: d.camberRatio,
      thicknessRatio: d.thicknessRatio,
      anhedralRad: anhedral,
      stations: 14,
    });
    const center = new THREE.Mesh(centerGeo, muslin);
    center.castShadow = true;
    center.receiveShadow = true;
    wing.add(center);

    const addRibsAndSpars = (
      parent: THREE.Group,
      xStart: number,
      xEnd: number,
      worldX0: number,
    ) => {
      const count = Math.max(4, Math.round(Math.abs(xEnd - xStart) / 0.38));
      for (let i = 0; i <= count; i++) {
        const x = xStart + (i / count) * (xEnd - xStart);
        const droop = -Math.tan(anhedral) * Math.abs(worldX0 + x);
        const rib = makeCamberedRib(d.chord, d.camberRatio, spruce);
        rib.position.set(x, droop + 0.015, 0);
        parent.add(rib);
      }
      const sparLen = Math.abs(xEnd - xStart);
      const sparX = (xStart + xEnd) / 2;
      const frontSpar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.026, 0.026, sparLen, 8),
        spruce,
      );
      frontSpar.rotation.z = Math.PI / 2;
      frontSpar.position.set(sparX, 0.018, zFront);
      parent.add(frontSpar);
      const rearSpar = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, sparLen, 8), spruce);
      rearSpar.rotation.z = Math.PI / 2;
      rearSpar.position.set(sparX, 0.012, zRear);
      parent.add(rearSpar);
    };

    addRibsAndSpars(wing, -centerHalf, centerHalf, 0);

    const addTip = (sign: -1 | 1) => {
      const tipG = new THREE.Group();
      tipG.position.x = sign * tipInboard;
      const tipEnd = sign * (d.span / 2 - tipInboard);
      const tipGeo = loftWingPanel({
        x0: 0,
        x1: tipEnd,
        chord: d.chord,
        camberRatio: d.camberRatio,
        thicknessRatio: d.thicknessRatio,
        anhedralRad: anhedral,
        worldX0: sign * tipInboard,
        stations: 12,
      });
      const tipMesh = new THREE.Mesh(tipGeo, muslin);
      tipMesh.castShadow = true;
      tipMesh.receiveShadow = true;
      tipG.add(tipMesh);
      addRibsAndSpars(tipG, 0, tipEnd, sign * tipInboard);

      const bow = new THREE.Mesh(
        new THREE.TorusGeometry(d.chord * 0.46, 0.02, 8, 18, Math.PI),
        spruce,
      );
      bow.rotation.x = Math.PI / 2;
      bow.rotation.z = sign > 0 ? -Math.PI / 2 : Math.PI / 2;
      bow.position.set(tipEnd, -Math.tan(anhedral) * (d.span / 2), 0);
      tipG.add(bow);
      tipG.name = sign < 0 ? "leftTip" : "rightTip";
      wing.add(tipG);
    };
    addTip(-1);
    addTip(1);
    return wing;
  };

  const upperWing = makeSurface(yUpper);
  const lowerWing = makeSurface(yLower);
  group.add(upperWing, lowerWing);

  // Aerodynamic Interplane Struts & Warping Pulley Rigging
  const strutXs = [-0.48, -0.3, -0.12, 0.12, 0.3, 0.48].map((f) => f * d.span);
  for (const x of strutXs) {
    for (const z of [zFront, zRear]) {
      const strut = ellipticalStrut(d.gap, spruce);
      strut.position.set(x, 0, z);
      group.add(strut);
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.04, 8), brass);
      cap.position.set(x, yUpper, z);
      group.add(cap);
      const capLower = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.04, 8), brass);
      capLower.position.set(x, yLower, z);
      group.add(capLower);
    }
  }

  // Cross-bracing piano wires
  for (let i = 0; i < strutXs.length - 1; i++) {
    const a = strutXs[i];
    const b = strutXs[i + 1];
    addWire(group, a, yUpper, zFront, b, yLower, zFront, steel);
    addWire(group, a, yLower, zFront, b, yUpper, zFront, steel);
    addWire(group, a, yUpper, zRear, b, yLower, zRear, steel);
    addWire(group, a, yLower, zRear, b, yUpper, zRear, steel);
    addWire(group, a, yUpper, zFront, a, yLower, zRear, steel);
    addWire(group, a, yLower, zFront, a, yUpper, zRear, steel);
  }

  // Forward Landing Skids with Curved Ash Runners
  const skid = (x: number) => {
    const g = new THREE.Group();
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(x, yLower - 0.08, zFront + 1.25),
      new THREE.Vector3(x, yLower - 0.38, zFront + 0.4),
      new THREE.Vector3(x, yLower - 0.46, 0),
      new THREE.Vector3(x, yLower - 0.45, zRear - 0.2),
      new THREE.Vector3(x, yLower - 0.36, zRear - 0.6),
    ]);
    const rail = new THREE.Mesh(new THREE.TubeGeometry(curve, 28, 0.028, 8, false), ash);
    rail.castShadow = true;
    g.add(rail);
    for (const z of [zFront, zRear]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.46, 8), spruce);
      post.position.set(x, yLower - 0.23, z);
      g.add(post);
    }
    // Diagonal brace to skid tip
    addWire(g, x, yLower, zFront, x, yLower - 0.08, zFront + 1.25, steel);
    return g;
  };
  group.add(skid(-0.95), skid(0.95));

  // Forward Biplane Canard Elevator (Pitch Control)
  const canardGroup = new THREE.Group();
  canardGroup.position.set(0, -0.05, d.chord / 2 + d.canardArm);
  const canardPanel = (y: number) => {
    const geo = loftWingPanel({
      x0: -d.canardSpan / 2,
      x1: d.canardSpan / 2,
      chord: d.canardChord,
      camberRatio: 0.04,
      thicknessRatio: 0.05,
      anhedralRad: 0,
      stations: 10,
      airfoilPts: 12,
    });
    const mesh = new THREE.Mesh(geo, muslin);
    mesh.position.y = y;
    mesh.castShadow = true;
    return mesh;
  };
  canardGroup.add(canardPanel(d.canardGap / 2), canardPanel(-d.canardGap / 2));
  for (const x of [-d.canardSpan * 0.42, 0, d.canardSpan * 0.42]) {
    const s = ellipticalStrut(d.canardGap, spruce);
    s.position.set(x, 0, 0);
    canardGroup.add(s);
  }
  // Canard Outriggers
  const boomXs = [-0.95, 0.95];
  for (const x of boomXs) {
    for (const y of [yLower + 0.08, 0.15]) {
      const boom = new THREE.Mesh(
        new THREE.CylinderGeometry(0.018, 0.018, d.canardArm + 0.35, 8),
        spruce,
      );
      boom.rotation.x = Math.PI / 2;
      boom.position.set(x, y, d.chord / 2 + d.canardArm * 0.48);
      group.add(boom);
    }
    addWire(group, x, yLower + 0.08, zFront, x, 0.15, d.chord / 2 + d.canardArm * 0.9, steel);
  }
  group.add(canardGroup);

  // Twin Vertical Rudders (Yaw Control)
  const rudderGroup = new THREE.Group();
  rudderGroup.position.set(0, 0.05, -d.chord / 2 - d.rudderArm);
  const makeRudder = (x: number) => {
    const g = new THREE.Group();
    const fabric = new THREE.Mesh(new THREE.PlaneGeometry(d.rudderChord, d.rudderHeight), muslin);
    fabric.rotation.y = Math.PI / 2;
    fabric.castShadow = true;
    g.add(fabric);
    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(0.024, d.rudderHeight + 0.02, d.rudderChord + 0.02),
      spruce,
    );
    g.add(frame);
    g.position.x = x;
    return g;
  };
  rudderGroup.add(makeRudder(-d.rudderSep / 2), makeRudder(d.rudderSep / 2));
  for (const x of [-d.rudderSep / 2, d.rudderSep / 2]) {
    const boom = new THREE.Mesh(
      new THREE.CylinderGeometry(0.018, 0.018, d.rudderArm + 0.3, 8),
      spruce,
    );
    boom.rotation.x = Math.PI / 2;
    boom.position.set(x, 0, -d.chord / 2 - d.rudderArm * 0.48);
    group.add(boom);
  }
  group.add(rudderGroup);

  // Wright 12-HP 4-Cylinder Inline Engine & Radiator
  const engine = new THREE.Group();
  engine.position.set(0.48, yLower + 0.22, 0.05);
  const crank = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.24, 0.88), alum);
  crank.castShadow = true;
  engine.add(crank);

  for (let i = 0; i < 4; i++) {
    const cylZ = -0.32 + i * 0.22;
    const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.28, 14), iron);
    cyl.rotation.z = Math.PI / 2;
    cyl.position.set(0.24, 0.02, cylZ);
    cyl.castShadow = true;
    engine.add(cyl);
    const valve = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.08, 8), brass);
    valve.position.set(0.36, 0.08, cylZ);
    engine.add(valve);
  }

  const flywheel = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.045, 24), iron);
  flywheel.rotation.x = Math.PI / 2;
  flywheel.position.set(-0.16, 0, -0.38);
  engine.add(flywheel);

  // Tall vertical radiator on front wing strut
  const radiatorLen = d.gap * 0.58;
  const radiatorLocalY = yUpper - (yLower + 0.22) - radiatorLen * 0.18;
  for (let i = 0; i < 8; i++) {
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, radiatorLen, 6), copper);
    tube.position.set(-0.1, radiatorLocalY, zFront - 0.02 + (i - 3.5) * 0.026);
    engine.add(tube);
  }

  // Brass gravity fuel tank mounted high on upper strut
  const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.36, 12), brass);
  tank.rotation.z = Math.PI / 2;
  tank.position.set(0.04, yUpper - (yLower + 0.22) - 0.16, 0.05);
  engine.add(tank);
  group.add(engine);

  // Pilot Prone Hip Cradle & Orville Figure
  const cradleGroup = new THREE.Group();
  cradleGroup.position.set(-0.35, yLower + 0.08, 0.05);

  // Guide rails on lower wing
  const railL = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.98, 8), ash);
  railL.rotation.x = Math.PI / 2;
  railL.position.set(-0.25, 0.01, 0);
  cradleGroup.add(railL);
  const railR = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.98, 8), ash);
  railR.rotation.x = Math.PI / 2;
  railR.position.set(0.25, 0.01, 0);
  cradleGroup.add(railR);

  // Sliding carriage
  const hipCradleBox = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.08, 0.32), ash);
  hipCradleBox.position.set(0, 0.06, 0.05);
  cradleGroup.add(hipCradleBox);

  // Warping cable anchor attachments on cradle
  const cableEyeL = new THREE.Mesh(new THREE.TorusGeometry(0.02, 0.005, 6, 8), brass);
  cableEyeL.position.set(-0.24, 0.08, 0.05);
  cradleGroup.add(cableEyeL);
  const cableEyeR = new THREE.Mesh(new THREE.TorusGeometry(0.02, 0.005, 6, 8), brass);
  cableEyeR.position.set(0.24, 0.08, 0.05);
  cradleGroup.add(cableEyeR);

  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.52, 6, 8), darkWool);
  torso.rotation.x = Math.PI / 2;
  torso.position.set(0, 0.15, -0.05);
  cradleGroup.add(torso);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 8), pilotSkin);
  head.position.set(0, 0.2, 0.42);
  cradleGroup.add(head);

  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.04, 10), darkWool);
  cap.position.set(0, 0.26, 0.42);
  cradleGroup.add(cap);

  const elevatorLever = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.48, 8), spruce);
  elevatorLever.position.set(-0.26, 0.24, 0.25);
  elevatorLever.rotation.z = -0.2;
  cradleGroup.add(elevatorLever);
  group.add(cradleGroup);

  // Richard Anemometer & Stopwatch Instrument Cluster on Front Strut
  const instrumentCluster = new THREE.Group();
  instrumentCluster.position.set(-0.12, yLower + 0.55, zFront);
  const instBase = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.14, 0.03), ash);
  instrumentCluster.add(instBase);

  // Vane anemometer wheel
  const anemometerHub = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.04, 8), brass);
  anemometerHub.rotation.x = Math.PI / 2;
  anemometerHub.position.set(0, 0.04, 0.03);
  instrumentCluster.add(anemometerHub);
  for (let i = 0; i < 4; i++) {
    const cupArm = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.06, 6), steel);
    cupArm.rotation.z = (i * Math.PI) / 2;
    cupArm.position.set(0, 0.04, 0.045);
    instrumentCluster.add(cupArm);
  }

  // Stopwatch dial
  const stopwatch = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.015, 12), brass);
  stopwatch.rotation.x = Math.PI / 2;
  stopwatch.position.set(0, -0.035, 0.02);
  instrumentCluster.add(stopwatch);
  group.add(instrumentCluster);

  // Wing-Warping Rigging Pulleys & Claim 1 Interconnection Cables
  const outerLeftX = strutXs[0];
  const outerRightX = strutXs[strutXs.length - 1];

  // Pulley blocks on rear upper/lower outer struts
  for (const x of [outerLeftX, outerRightX]) {
    for (const y of [yUpper, yLower]) {
      const pulleyBlock = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.04), brass);
      pulleyBlock.position.set(x, y, zRear);
      group.add(pulleyBlock);
    }
  }

  // Claim 1 Warping-to-Rudder Cross Cables
  addWire(
    group,
    outerLeftX,
    yLower,
    zRear,
    -d.rudderSep / 2,
    0.05,
    -d.chord / 2 - d.rudderArm,
    steel,
  );
  addWire(
    group,
    outerRightX,
    yLower,
    zRear,
    d.rudderSep / 2,
    0.05,
    -d.chord / 2 - d.rudderArm,
    steel,
  );

  // Twin Counter-Rotating Pusher Propellers & Tubular Chain Casings
  const makeProp = (x: number, isPort: boolean) => {
    const p = new THREE.Group();
    p.position.set(x, 0.02, zRear - 0.22);
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.12, 12), brass);
    hub.rotation.x = Math.PI / 2;
    p.add(hub);

    // Driven sprocket on propeller shaft
    const sprocket = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.02, 16), iron);
    sprocket.rotation.x = Math.PI / 2;
    sprocket.position.set(0, 0, 0.08);
    p.add(sprocket);

    const blades = new THREE.Group();
    const b1 = scimitarBlade(d.propDiameter / 2, propWood);
    const b2 = scimitarBlade(d.propDiameter / 2, propWood);
    b2.rotation.z = Math.PI;
    blades.add(b1, b2);
    p.add(blades);

    // Tubular steel chain guide casing (port chain crossed in figure-8 to reverse rotation)
    const chainDist = Math.abs(x - 0.48);
    const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, chainDist, 6), steel);
    chain.rotation.z = Math.PI / 2;
    chain.position.set(-(x - 0.48) / 2, -0.1, 0.06);
    if (isPort) {
      chain.rotation.y = 0.04;
    }
    p.add(chain);

    group.add(p);
    return blades;
  };
  const leftPropBlades = makeProp(-d.propX, true);
  const rightPropBlades = makeProp(d.propX, false);

  return {
    group,
    upperWing,
    lowerWing,
    canardGroup,
    rudderGroup,
    cradleGroup,
    leftPropBlades,
    rightPropBlades,
    textures,
  };
}
