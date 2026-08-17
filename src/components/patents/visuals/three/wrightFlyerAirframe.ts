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
  stations?: number;
  airfoilPts?: number;
}): THREE.BufferGeometry {
  const stations = opts.stations ?? 10;
  const n = opts.airfoilPts ?? 18;
  const halfT = opts.thicknessRatio * opts.chord * 0.5;
  const ring = n * 2;
  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= stations; i++) {
    const t = i / stations;
    const x = opts.x0 + (opts.x1 - opts.x0) * t;
    const droop = -Math.tan(opts.anhedralRad) * Math.abs(x);
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
  for (let i = 0; i < stations; i++) {
    const a = i * vertsPerStation;
    const b = (i + 1) * vertsPerStation;
    for (let k = 0; k < vertsPerStation - 1; k++) {
      indices.push(a + k, b + k, a + k + 1);
      indices.push(b + k, b + k + 1, a + k + 1);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  void normals;
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

export function buildWrightFlyerAirframe(): FlyerAirframe {
  const d = FLYER_DIM;
  const textures: THREE.Texture[] = [];
  const woodMap = woodTexture();
  const muslinMap = muslinTexture();
  textures.push(woodMap, muslinMap);

  const muslin = new THREE.MeshPhysicalMaterial({
    map: muslinMap,
    color: 0xf7edd4,
    roughness: 0.88,
    metalness: 0.0,
    transmission: 0.08,
    thickness: 0.02,
    transparent: true,
    opacity: 0.92,
    side: THREE.DoubleSide,
  });
  const spruce = new THREE.MeshStandardMaterial({
    map: woodMap,
    color: 0xc4a06a,
    roughness: 0.42,
    metalness: 0.04,
  });
  const ash = new THREE.MeshStandardMaterial({
    map: woodMap,
    color: 0x8b5a2b,
    roughness: 0.5,
    metalness: 0.03,
  });
  const steel = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    metalness: 0.92,
    roughness: 0.22,
  });
  const brass = new THREE.MeshStandardMaterial({
    color: 0xd4a017,
    metalness: 0.88,
    roughness: 0.28,
  });
  const alum = new THREE.MeshStandardMaterial({
    color: 0x8a93a0,
    metalness: 0.82,
    roughness: 0.32,
  });
  const iron = new THREE.MeshStandardMaterial({
    color: 0x3f4651,
    metalness: 0.7,
    roughness: 0.48,
  });
  const copper = new THREE.MeshStandardMaterial({
    color: 0xb45309,
    metalness: 0.86,
    roughness: 0.24,
  });
  const propWood = new THREE.MeshStandardMaterial({
    map: woodMap,
    color: 0x6b3f14,
    roughness: 0.28,
    metalness: 0.08,
  });
  const canvas = new THREE.MeshStandardMaterial({
    color: 0xddd0b4,
    roughness: 0.85,
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
      stations: 12,
    });
    const center = new THREE.Mesh(centerGeo, muslin);
    center.castShadow = true;
    center.receiveShadow = true;
    wing.add(center);

    const addTip = (sign: -1 | 1) => {
      const tipG = new THREE.Group();
      tipG.position.x = sign * tipInboard;
      const tipGeo = loftWingPanel({
        x0: 0,
        x1: sign * (d.span / 2 - tipInboard),
        chord: d.chord,
        camberRatio: d.camberRatio,
        thicknessRatio: d.thicknessRatio,
        anhedralRad: anhedral,
        stations: 10,
      });
      const tipMesh = new THREE.Mesh(tipGeo, muslin);
      tipMesh.castShadow = true;
      tipMesh.receiveShadow = true;
      tipG.add(tipMesh);

      const bow = new THREE.Mesh(
        new THREE.TorusGeometry(d.chord * 0.46, 0.022, 8, 18, Math.PI),
        spruce,
      );
      bow.rotation.x = Math.PI / 2;
      bow.rotation.z = sign > 0 ? -Math.PI / 2 : Math.PI / 2;
      bow.position.set(sign * (d.span / 2 - tipInboard), -Math.tan(anhedral) * (d.span / 2), 0);
      tipG.add(bow);
      tipG.name = sign < 0 ? "leftTip" : "rightTip";
      wing.add(tipG);
    };
    addTip(-1);
    addTip(1);

    const ribCount = 22;
    for (let i = 0; i <= ribCount; i++) {
      const x = -d.span / 2 + (i / ribCount) * d.span;
      const droop = -Math.tan(anhedral) * Math.abs(x);
      const rib = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.028, d.chord * 0.96), spruce);
      rib.position.set(x, droop + 0.03, 0);
      wing.add(rib);
    }
    const frontSpar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.032, 0.032, d.span * 0.98, 10),
      spruce,
    );
    frontSpar.rotation.z = Math.PI / 2;
    frontSpar.position.set(0, 0.015, zFront);
    wing.add(frontSpar);
    const rearSpar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.028, 0.028, d.span * 0.98, 10),
      spruce,
    );
    rearSpar.rotation.z = Math.PI / 2;
    rearSpar.position.set(0, 0.01, zRear);
    wing.add(rearSpar);
    return wing;
  };

  const upperWing = makeSurface(yUpper);
  const lowerWing = makeSurface(yLower);
  group.add(upperWing, lowerWing);

  const strutXs = [-0.48, -0.3, -0.12, 0.12, 0.3, 0.48].map((f) => f * d.span);
  for (const x of strutXs) {
    for (const z of [zFront, zRear]) {
      const strut = ellipticalStrut(d.gap, spruce);
      strut.position.set(x, 0, z);
      group.add(strut);
      const cap = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 6), brass);
      cap.position.set(x, yUpper, z);
      group.add(cap);
    }
  }
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

  const skid = (x: number) => {
    const g = new THREE.Group();
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(x, yLower - 0.12, zFront + 1.15),
      new THREE.Vector3(x, yLower - 0.42, zFront + 0.35),
      new THREE.Vector3(x, yLower - 0.48, 0),
      new THREE.Vector3(x, yLower - 0.46, zRear - 0.15),
      new THREE.Vector3(x, yLower - 0.38, zRear - 0.55),
    ]);
    const rail = new THREE.Mesh(new THREE.TubeGeometry(curve, 24, 0.032, 8, false), ash);
    rail.castShadow = true;
    g.add(rail);
    for (const z of [zFront, zRear]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.48, 8), spruce);
      post.position.set(x, yLower - 0.22, z);
      g.add(post);
    }
    return g;
  };
  group.add(skid(-0.95), skid(0.95));

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
      stations: 8,
      airfoilPts: 12,
    });
    const mesh = new THREE.Mesh(geo, muslin);
    mesh.position.y = y;
    mesh.castShadow = true;
    return mesh;
  };
  canardGroup.add(canardPanel(d.canardGap / 2), canardPanel(-d.canardGap / 2));
  for (const x of [-d.canardSpan * 0.42, d.canardSpan * 0.42]) {
    const s = ellipticalStrut(d.canardGap, spruce);
    s.position.set(x, 0, 0);
    canardGroup.add(s);
  }
  const boomXs = [-0.95, 0.95];
  for (const x of boomXs) {
    for (const y of [yLower + 0.08, 0.15]) {
      const boom = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, d.canardArm + 0.35, 8),
        spruce,
      );
      boom.rotation.x = Math.PI / 2;
      boom.position.set(x, y, d.chord / 2 + d.canardArm * 0.48);
      group.add(boom);
    }
    addWire(group, x, yLower + 0.08, zFront, x, 0.15, d.chord / 2 + d.canardArm * 0.9, steel);
  }
  group.add(canardGroup);

  const rudderGroup = new THREE.Group();
  rudderGroup.position.set(0, 0.05, -d.chord / 2 - d.rudderArm);
  const makeRudder = (x: number) => {
    const g = new THREE.Group();
    const fabric = new THREE.Mesh(new THREE.PlaneGeometry(d.rudderChord, d.rudderHeight), muslin);
    fabric.rotation.y = Math.PI / 2;
    fabric.castShadow = true;
    g.add(fabric);
    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(0.03, d.rudderHeight + 0.04, d.rudderChord + 0.04),
      spruce,
    );
    g.add(frame);
    g.position.x = x;
    return g;
  };
  rudderGroup.add(makeRudder(-d.rudderSep / 2), makeRudder(d.rudderSep / 2));
  for (const x of [-d.rudderSep / 2, d.rudderSep / 2]) {
    const boom = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, d.rudderArm + 0.3, 8),
      spruce,
    );
    boom.rotation.x = Math.PI / 2;
    boom.position.set(x, 0, -d.chord / 2 - d.rudderArm * 0.48);
    group.add(boom);
  }
  group.add(rudderGroup);

  const engine = new THREE.Group();
  engine.position.set(0.82, yLower + 0.28, 0.05);
  const crank = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.28, 0.95), alum);
  crank.castShadow = true;
  engine.add(crank);
  for (let i = 0; i < 4; i++) {
    const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.32, 14), iron);
    cyl.rotation.z = Math.PI / 2;
    cyl.position.set(0.28, 0.04, -0.36 + i * 0.24);
    cyl.castShadow = true;
    engine.add(cyl);
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.1, 0.1), brass);
    head.position.set(0.46, 0.04, -0.36 + i * 0.24);
    engine.add(head);
  }
  const flywheel = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.055, 28), iron);
  flywheel.rotation.x = Math.PI / 2;
  flywheel.position.set(-0.18, 0, -0.42);
  engine.add(flywheel);
  for (let i = 0; i < 9; i++) {
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, d.gap * 0.62, 6), copper);
    tube.position.set(-0.12, d.gap * 0.18, zFront - 0.02 + (i - 4) * 0.028);
    engine.add(tube);
  }
  const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.42, 14), brass);
  tank.rotation.z = Math.PI / 2;
  tank.position.set(0.05, d.gap * 0.42, 0.05);
  engine.add(tank);
  group.add(engine);

  const cradle = new THREE.Group();
  cradle.position.set(-0.78, yLower + 0.08, 0.05);
  cradle.add(new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.07, 1.15), spruce));
  const hip = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.05, 0.32), canvas);
  hip.position.set(0, 0.07, 0.05);
  cradle.add(hip);
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.13, 0.55, 6, 10), canvas);
  torso.rotation.x = Math.PI / 2;
  torso.position.set(0, 0.16, -0.05);
  cradle.add(torso);
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 12, 10),
    new THREE.MeshStandardMaterial({ color: 0xc4a484, roughness: 0.7 }),
  );
  head.position.set(0, 0.22, 0.48);
  cradle.add(head);
  const lever = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.55, 8), spruce);
  lever.position.set(-0.32, 0.28, 0.28);
  lever.rotation.z = -0.25;
  cradle.add(lever);
  group.add(cradle);

  const makeProp = (x: number) => {
    const p = new THREE.Group();
    p.position.set(x, 0.02, zRear - 0.22);
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.14, 14), brass);
    hub.rotation.x = Math.PI / 2;
    p.add(hub);
    const blades = new THREE.Group();
    const b1 = scimitarBlade(d.propDiameter / 2, propWood);
    const b2 = scimitarBlade(d.propDiameter / 2, propWood);
    b2.rotation.z = Math.PI;
    blades.add(b1, b2);
    p.add(blades);
    const chain = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, Math.abs(x - 0.82), 6),
      steel,
    );
    chain.rotation.z = Math.PI / 2;
    chain.position.set(-(x - 0.82) / 2, -0.12, 0.08);
    p.add(chain);
    group.add(p);
    return blades;
  };
  const leftPropBlades = makeProp(-d.propX);
  const rightPropBlades = makeProp(d.propX);

  return {
    group,
    upperWing,
    lowerWing,
    canardGroup,
    rudderGroup,
    leftPropBlades,
    rightPropBlades,
    textures,
  };
}
