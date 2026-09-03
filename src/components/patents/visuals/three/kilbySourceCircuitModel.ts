import * as THREE from "three";
import type { KilbySourceCircuitState } from "@/physics/kilbySourceCircuitKernel";

export interface KilbySourceCircuitModel {
  root: THREE.Group;
  wafer: THREE.Mesh;
  nTypeRegions: THREE.Group;
  transistorGroups: readonly [THREE.Group, THREE.Group];
  resistorRegions: THREE.Group;
  capacitorRegions: THREE.Group;
  kovarLeads: THREE.Group;
  contactAreas: THREE.Group;
  wireBonds: THREE.Group;
  openCircuitMarkers: THREE.Group;
  update: (state: KilbySourceCircuitState) => void;
  dispose: () => void;
}

/** Figure 6a teaching model: one etched wafer, attached leads, and anchored wires. */
export function buildKilbySourceCircuitModel(): KilbySourceCircuitModel {
  const root = new THREE.Group();
  root.name = "US 3,138,743 Figure 6a monolithic multivibrator";
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const geo = <T extends THREE.BufferGeometry>(value: T): T => {
    geometries.add(value);
    return value;
  };
  const mat = <T extends THREE.Material>(value: T): T => {
    materials.add(value);
    return value;
  };
  const mesh = (
    parent: THREE.Object3D,
    geometry: THREE.BufferGeometry,
    material: THREE.Material,
    name: string,
    position: readonly [number, number, number],
    rotation: readonly [number, number, number] = [0, 0, 0],
  ) => {
    const part = new THREE.Mesh(geometry, material);
    part.name = name;
    part.position.set(...position);
    part.rotation.set(...rotation);
    part.castShadow = true;
    part.receiveShadow = true;
    parent.add(part);
    return part;
  };

  const foundationMaterial = mat(
    new THREE.MeshStandardMaterial({ color: 0x172033, metalness: 0.25, roughness: 0.68 }),
  );
  const mountMaterial = mat(
    new THREE.MeshStandardMaterial({ color: 0xe7e5e4, metalness: 0.08, roughness: 0.7 }),
  );
  const waferMaterial = mat(
    new THREE.MeshStandardMaterial({
      color: 0x7c2d12,
      metalness: 0.34,
      roughness: 0.38,
      transparent: true,
      opacity: 0.9,
    }),
  );
  const nTypeMaterial = mat(
    new THREE.MeshStandardMaterial({ color: 0x0f766e, metalness: 0.25, roughness: 0.36 }),
  );
  const mesaMaterial = mat(
    new THREE.MeshStandardMaterial({ color: 0x0891b2, metalness: 0.25, roughness: 0.34 }),
  );
  const resistorMaterial = mat(
    new THREE.MeshStandardMaterial({ color: 0x4f46e5, metalness: 0.2, roughness: 0.4 }),
  );
  const capacitorMaterial = mat(
    new THREE.MeshStandardMaterial({ color: 0xa21caf, metalness: 0.25, roughness: 0.36 }),
  );
  const kovarMaterial = mat(
    new THREE.MeshStandardMaterial({ color: 0xd6a62e, metalness: 0.92, roughness: 0.2 }),
  );
  const goldMaterial = mat(
    new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.96, roughness: 0.16 }),
  );
  const aluminumMaterial = mat(
    new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.92, roughness: 0.18 }),
  );
  const openMaterial = mat(
    new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      emissive: 0x9f1239,
      emissiveIntensity: 0.7,
      metalness: 0.45,
      roughness: 0.25,
    }),
  );

  mesh(
    root,
    geo(new THREE.BoxGeometry(10.8, 0.24, 5.6)),
    foundationMaterial,
    "museum foundation supporting the source wafer",
    [0, -0.12, 0],
  );
  for (const x of [-3.25, 3.25]) {
    for (const z of [-1.22, 1.22]) {
      mesh(
        root,
        geo(new THREE.CylinderGeometry(0.14, 0.18, 0.1, 20)),
        mountMaterial,
        "insulating museum support beneath wafer",
        [x, 0.045, z],
      );
    }
  }

  const waferShape = new THREE.Shape();
  waferShape.moveTo(-4, -1.6);
  waferShape.lineTo(4, -1.6);
  waferShape.lineTo(4, 1.6);
  waferShape.lineTo(1.8, 1.6);
  waferShape.lineTo(1.8, 0.82);
  waferShape.lineTo(-1.8, 0.82);
  waferShape.lineTo(-1.8, 1.6);
  waferShape.lineTo(-4, 1.6);
  waferShape.closePath();
  const wafer = mesh(
    root,
    geo(
      new THREE.ExtrudeGeometry(waferShape, {
        depth: 0.22,
        bevelEnabled: false,
      }),
    ),
    waferMaterial,
    "3 ohm-centimeter p-type germanium wafer with etched isolation slot",
    [0, 0.3, 0],
    [Math.PI / 2, 0, 0],
  );

  const nTypeRegions = new THREE.Group();
  nTypeRegions.name = "0.7 mil antimony-diffused n-type surface regions";
  root.add(nTypeRegions);
  mesh(
    nTypeRegions,
    geo(new THREE.BoxGeometry(7.7, 0.035, 0.62)),
    nTypeMaterial,
    "continuous diffused circuit spine",
    [0, 0.305, -0.48],
  );

  const resistorRegions = new THREE.Group();
  resistorRegions.name = "thin elongated semiconductor resistor regions R1 through R8";
  root.add(resistorRegions);
  const resistorLayout: ReadonlyArray<readonly [string, number, number, number]> = [
    ["R1 3 kilohm region", -3.22, -1.04, 1.15],
    ["R2 3 kilohm region", 3.22, -1.04, 1.15],
    ["R3 1.8 kilohm region", -2.65, 0.22, 1.0],
    ["R8 1.8 kilohm region", 2.65, 0.22, 1.0],
    ["R4 400 ohm region", -2.72, 1.2, 0.82],
    ["R5 400 ohm region", 2.72, 1.2, 0.82],
    ["R6 400 ohm region", -1.05, -0.5, 0.72],
    ["R7 400 ohm region", 1.05, -0.5, 0.72],
  ];
  for (const [name, x, z, length] of resistorLayout) {
    mesh(resistorRegions, geo(new THREE.BoxGeometry(length, 0.055, 0.24)), resistorMaterial, name, [
      x,
      0.315,
      z,
    ]);
  }

  const transistorGroups: [THREE.Group, THREE.Group] = [new THREE.Group(), new THREE.Group()];
  const contactAreas = new THREE.Group();
  contactAreas.name = "evaporated gold contact areas 51 through 54 and aluminum emitters 56";
  root.add(contactAreas);
  for (const [index, x] of [-1.25, 1.25].entries()) {
    const transistor = transistorGroups[index];
    transistor.name = `integral mesa transistor T${index + 1}`;
    root.add(transistor);
    mesh(
      transistor,
      geo(new THREE.BoxGeometry(0.88, 0.09, 0.78)),
      mesaMaterial,
      `mesa area 60 for transistor T${index + 1}`,
      [x, 0.33, 0.02],
    );
    mesh(
      contactAreas,
      geo(new THREE.CylinderGeometry(0.17, 0.17, 0.07, 28)),
      goldMaterial,
      `evaporated gold base contact area ${51 + index}`,
      [x, 0.37, 0.18],
    );
    mesh(
      contactAreas,
      geo(new THREE.CylinderGeometry(0.12, 0.12, 0.075, 28)),
      aluminumMaterial,
      `aluminum rectifying emitter area 56 for T${index + 1}`,
      [x, 0.372, -0.17],
    );
  }

  const capacitorRegions = new THREE.Group();
  capacitorRegions.name = "integral Figure 7 capacitor regions C1 and C2";
  root.add(capacitorRegions);
  for (const [index, x] of [-0.48, 0.48].entries()) {
    mesh(
      capacitorRegions,
      geo(new THREE.BoxGeometry(0.56, 0.055, 0.5)),
      capacitorMaterial,
      `C${index + 1} source-labelled 50 microfarad region`,
      [x, 0.315, -1.02],
    );
  }

  const kovarLeads = new THREE.Group();
  kovarLeads.name = "alloyed gold-plated Kovar leads 50";
  root.add(kovarLeads);
  const leadEndpoints: THREE.Vector3[] = [];
  const sideLead = (name: string, x: number, z: number) => {
    mesh(kovarLeads, geo(new THREE.BoxGeometry(1.5, 0.22, 0.22)), kovarMaterial, name, [
      x,
      0.31,
      z,
    ]);
    leadEndpoints.push(new THREE.Vector3(x > 0 ? 4.02 : -4.02, 0.41, z));
  };
  sideLead("Kovar lead 50 INPUT-2", -4.72, -1.05);
  sideLead("Kovar lead 50 +V", -4.72, 0.15);
  sideLead("Kovar lead 50 OUTPUT-2", -4.72, 1.12);
  sideLead("Kovar lead 50 INPUT-1", 4.72, -1.05);
  sideLead("Kovar lead 50 -V", 4.72, 0.15);
  sideLead("Kovar lead 50 OUTPUT-1", 4.72, 1.12);
  mesh(
    kovarLeads,
    geo(new THREE.BoxGeometry(0.22, 0.22, 1.35)),
    kovarMaterial,
    "Kovar lead 50 GND",
    [0, 0.31, -2.18],
  );
  leadEndpoints.push(new THREE.Vector3(0, 0.41, -1.6));

  const wireBonds = new THREE.Group();
  wireBonds.name = "thermally bonded gold wires 70 with both ends anchored";
  wireBonds.position.y = 0.41;
  root.add(wireBonds);
  const bond = (name: string, from: THREE.Vector3, to: THREE.Vector3, rise: number) => {
    const start = from.clone().setY(0);
    const end = to.clone().setY(0);
    const middle = start.clone().add(end).multiplyScalar(0.5);
    middle.y = rise;
    const curve = new THREE.QuadraticBezierCurve3(start, middle, end);
    const wire = mesh(
      wireBonds,
      geo(new THREE.TubeGeometry(curve, 20, 0.035, 8, false)),
      goldMaterial,
      name,
      [0, 0, 0],
    );
    for (const point of [start, end]) {
      mesh(
        wireBonds,
        geo(new THREE.SphereGeometry(0.075, 16, 12)),
        goldMaterial,
        `${name} thermal bond`,
        [point.x, point.y, point.z],
      );
    }
    return wire;
  };

  bond(
    "wire 70 R3 to T1 base",
    new THREE.Vector3(-2.15, 0, 0.22),
    new THREE.Vector3(-1.25, 0, 0.18),
    0.8,
  );
  bond(
    "wire 70 R8 to T2 base",
    new THREE.Vector3(2.15, 0, 0.22),
    new THREE.Vector3(1.25, 0, 0.18),
    0.8,
  );
  bond(
    "wire 70 C1 to T2",
    new THREE.Vector3(-0.48, 0, -1.02),
    new THREE.Vector3(1.25, 0, 0.18),
    1.0,
  );
  bond(
    "wire 70 C2 to T1",
    new THREE.Vector3(0.48, 0, -1.02),
    new THREE.Vector3(-1.25, 0, 0.18),
    1.0,
  );
  bond("wire 70 T1 to INPUT-2", new THREE.Vector3(-1.25, 0, -0.17), leadEndpoints[0], 0.72);
  bond("wire 70 T2 to INPUT-1", new THREE.Vector3(1.25, 0, -0.17), leadEndpoints[3], 0.72);
  const commonEmitterPad = mesh(
    contactAreas,
    geo(new THREE.CylinderGeometry(0.15, 0.15, 0.07, 28)),
    goldMaterial,
    "evaporated gold common-emitter contact area 54",
    [0, 0.35, -0.48],
  );
  bond(
    "wire 70 T1 emitter to common contact 54",
    new THREE.Vector3(-1.25, 0, -0.17),
    commonEmitterPad.position,
    0.44,
  );
  bond(
    "wire 70 T2 emitter to common contact 54",
    new THREE.Vector3(1.25, 0, -0.17),
    commonEmitterPad.position,
    0.44,
  );
  bond("wire 70 common emitter to GND", new THREE.Vector3(0, 0, -0.48), leadEndpoints[6], 0.55);
  bond("wire 70 R1 to +V lead 50", new THREE.Vector3(-3.78, 0, -1.04), leadEndpoints[1], 0.5);
  bond("wire 70 R2 to -V lead 50", new THREE.Vector3(3.78, 0, -1.04), leadEndpoints[4], 0.5);
  bond("wire 70 T1 to OUTPUT-2 lead 50", new THREE.Vector3(-1.25, 0, 0.18), leadEndpoints[2], 0.68);
  bond("wire 70 T2 to OUTPUT-1 lead 50", new THREE.Vector3(1.25, 0, 0.18), leadEndpoints[5], 0.68);

  const openCircuitMarkers = new THREE.Group();
  openCircuitMarkers.name = "Claim 1 conductive means withheld markers";
  openCircuitMarkers.visible = false;
  root.add(openCircuitMarkers);
  for (const x of [-2.15, -1.25, 1.25, 2.15]) {
    mesh(
      openCircuitMarkers,
      geo(new THREE.SphereGeometry(0.11, 18, 14)),
      openMaterial,
      "open interconnect endpoint",
      [x, 0.42, x < 0 ? 0.2 : 0.18],
    );
  }

  const update = (state: KilbySourceCircuitState) => {
    waferMaterial.opacity = 0.9 - state.controls.sectionRevealFraction * 0.68;
    waferMaterial.depthWrite = state.controls.sectionRevealFraction < 0.45;
    waferMaterial.needsUpdate = true;
    wireBonds.scale.y = 0.45 + state.controls.wireArchFraction;
    wireBonds.visible = state.conductiveMeansPresent;
    openCircuitMarkers.visible = !state.conductiveMeansPresent;
  };

  return {
    root,
    wafer,
    nTypeRegions,
    transistorGroups,
    resistorRegions,
    capacitorRegions,
    kovarLeads,
    contactAreas,
    wireBonds,
    openCircuitMarkers,
    update,
    dispose: () => {
      for (const geometry of geometries) geometry.dispose();
      for (const material of materials) material.dispose();
    },
  };
}
