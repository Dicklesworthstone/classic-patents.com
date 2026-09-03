import * as THREE from "three";
import type { TownesMaserTopologyState } from "@/physics/townesMaserKernel";

export interface TownesMaserSystemModel {
  root: THREE.Group;
  generator: THREE.Group;
  amplifier: THREE.Group;
  detector: THREE.Group;
  modeSelector: THREE.Group;
  generatorPumpLamps: readonly THREE.Mesh[];
  amplifierPumpLamp: THREE.Mesh;
  modulationCoils: readonly THREE.Mesh[];
  generatorBeam: THREE.Mesh;
  amplifierBeam: THREE.Mesh;
  detectorBeam: THREE.Mesh;
  update: (state: TownesMaserTopologyState, timeSec: number) => void;
  setCutaway: (cutaway: boolean) => void;
  dispose: () => void;
}

interface MaserAssembly {
  group: THREE.Group;
  scalableParts: THREE.Object3D[];
  leftEnd: THREE.Group;
  rightEnd: THREE.Group;
  vapor: THREE.Mesh;
  transparentShell: THREE.Mesh;
  pumpingElements: THREE.Mesh[];
  modulationCoils: THREE.Mesh[];
}

function updateCylinderBetween(
  mesh: THREE.Mesh,
  start: THREE.Vector3,
  end: THREE.Vector3,
  radiusScale = 1,
) {
  const delta = end.clone().sub(start);
  const length = delta.length();
  mesh.position.copy(start).add(end).multiplyScalar(0.5);
  mesh.scale.set(radiusScale, Math.max(0.0001, length), radiusScale);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.normalize());
}

/**
 * Procedural, source-shaped reconstruction of Figures 1–3. The exhibit keeps
 * generator 10, mode-selection optics 23–26, modulated amplifier 12, and
 * detector 13 on one physically connected optical axis.
 */
export function buildTownesMaserSystemModel(): TownesMaserSystemModel {
  const root = new THREE.Group();
  root.name = "US 2,929,922 connected maser communications system";

  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const rememberGeometry = <T extends THREE.BufferGeometry>(geometry: T): T => {
    geometries.add(geometry);
    return geometry;
  };
  const rememberMaterial = <T extends THREE.Material>(material: T): T => {
    materials.add(material);
    return material;
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

  const benchMaterial = rememberMaterial(
    new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.58, roughness: 0.48 }),
  );
  const housingMaterial = rememberMaterial(
    new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.72, roughness: 0.32 }),
  );
  const generatorMaterial = rememberMaterial(
    new THREE.MeshStandardMaterial({ color: 0x0e7490, metalness: 0.44, roughness: 0.32 }),
  );
  const amplifierMaterial = rememberMaterial(
    new THREE.MeshStandardMaterial({ color: 0x6d28d9, metalness: 0.42, roughness: 0.3 }),
  );
  const goldMaterial = rememberMaterial(
    new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.92, roughness: 0.18 }),
  );
  const glassMaterial = rememberMaterial(
    new THREE.MeshPhysicalMaterial({
      color: 0xcffafe,
      transparent: true,
      opacity: 0.28,
      transmission: 0.45,
      roughness: 0.12,
      depthWrite: false,
    }),
  );
  const vaporMaterial = rememberMaterial(
    new THREE.MeshStandardMaterial({
      color: 0x7dd3fc,
      emissive: 0x0369a1,
      emissiveIntensity: 0.15,
      transparent: true,
      opacity: 0.34,
      depthWrite: false,
    }),
  );
  const pumpMaterial = rememberMaterial(
    new THREE.MeshStandardMaterial({
      color: 0xfef3c7,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.7,
      roughness: 0.22,
    }),
  );
  const coilMaterial = rememberMaterial(
    new THREE.MeshStandardMaterial({
      color: 0xf97316,
      emissive: 0x9a3412,
      emissiveIntensity: 0.18,
      metalness: 0.76,
      roughness: 0.26,
    }),
  );
  const opticMaterial = rememberMaterial(
    new THREE.MeshPhysicalMaterial({
      color: 0xbae6fd,
      transparent: true,
      opacity: 0.7,
      transmission: 0.28,
      roughness: 0.08,
      depthWrite: false,
    }),
  );
  const apertureMaterial = rememberMaterial(
    new THREE.MeshStandardMaterial({ color: 0x172554, metalness: 0.4, roughness: 0.4 }),
  );
  const detectorMaterial = rememberMaterial(
    new THREE.MeshStandardMaterial({ color: 0x881337, metalness: 0.36, roughness: 0.34 }),
  );
  const beamMaterial = rememberMaterial(
    new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.62,
      depthWrite: false,
    }),
  );
  const selectedBeamMaterial = rememberMaterial(
    new THREE.MeshBasicMaterial({
      color: 0x67e8f9,
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
    }),
  );
  const wiringMaterial = rememberMaterial(
    new THREE.LineBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.8 }),
  );

  const deck = mesh(
    root,
    rememberGeometry(new THREE.BoxGeometry(10.6, 0.16, 2.65)),
    benchMaterial,
    "continuous optical-bench foundation",
    [-0.45, -1.18, 0],
  );
  deck.receiveShadow = true;
  for (const x of [-4.8, -2.2, 0.5, 3.8]) {
    mesh(
      root,
      rememberGeometry(new THREE.CylinderGeometry(0.16, 0.2, 0.28, 16)),
      benchMaterial,
      "bench support foot",
      [x, -1.4, 0],
    );
  }

  const cylinderGeometry = rememberGeometry(new THREE.CylinderGeometry(0.35, 0.35, 2.3, 28));
  const vaporGeometry = rememberGeometry(new THREE.CylinderGeometry(0.24, 0.24, 2.2, 24));
  const endDiscGeometry = rememberGeometry(new THREE.CylinderGeometry(0.38, 0.38, 0.08, 28));
  const spacerGeometry = rememberGeometry(new THREE.TorusGeometry(0.45, 0.045, 10, 28));
  const housingRailGeometry = rememberGeometry(new THREE.BoxGeometry(2.45, 0.1, 0.12));
  const lampGeometry = rememberGeometry(new THREE.CylinderGeometry(0.045, 0.045, 2.2, 12));

  const buildAssembly = (
    name: string,
    x: number,
    accent: THREE.Material,
    spiralPump: boolean,
  ): MaserAssembly => {
    const group = new THREE.Group();
    group.name = name;
    group.position.set(x, 0, 0);
    root.add(group);

    const transparentShell = mesh(
      group,
      cylinderGeometry,
      glassMaterial,
      `${name} protective shell 19`,
      [0, 0, 0],
      [0, 0, Math.PI / 2],
    );
    const vapor = mesh(
      group,
      vaporGeometry,
      vaporMaterial,
      `${name} potassium-vapor negative-temperature medium in cylinder 15`,
      [0, 0, 0],
      [0, 0, Math.PI / 2],
    );
    const scalableParts: THREE.Object3D[] = [transparentShell, vapor];

    for (const y of [-0.62, 0.62]) {
      for (const z of [-0.38, 0.38]) {
        scalableParts.push(
          mesh(
            group,
            housingRailGeometry,
            housingMaterial,
            `${name} open reflective housing 22 rail`,
            [0, y, z],
          ),
        );
      }
    }
    for (const xLocal of [-0.72, 0, 0.72]) {
      const spacer = mesh(
        group,
        spacerGeometry,
        accent,
        `${name} shell spacer 18/27`,
        [xLocal, 0, 0],
        [0, Math.PI / 2, 0],
      );
      scalableParts.push(spacer);
    }

    const leftEnd = new THREE.Group();
    leftEnd.name = `${name} left sapphire-and-gold end assembly 16`;
    group.add(leftEnd);
    mesh(
      leftEnd,
      endDiscGeometry,
      opticMaterial,
      "sapphire member 16a",
      [0, 0, 0],
      [0, 0, Math.PI / 2],
    );
    mesh(
      leftEnd,
      endDiscGeometry,
      goldMaterial,
      "500 angstrom gold coating 16b",
      [-0.045, 0, 0],
      [0, 0, Math.PI / 2],
    ).scale.set(0.92, 1, 0.92);

    const rightEnd = new THREE.Group();
    rightEnd.name = `${name} right sapphire-and-gold end assembly 17`;
    group.add(rightEnd);
    mesh(
      rightEnd,
      endDiscGeometry,
      opticMaterial,
      "sapphire member 17",
      [0, 0, 0],
      [0, 0, Math.PI / 2],
    );
    mesh(
      rightEnd,
      endDiscGeometry,
      goldMaterial,
      "partially transmitting gold coating",
      [0.045, 0, 0],
      [0, 0, Math.PI / 2],
    ).scale.set(0.92, 1, 0.92);

    const pumpingElements: THREE.Mesh[] = [];
    if (spiralPump) {
      const curve = new THREE.CatmullRomCurve3(
        Array.from({ length: 80 }, (_, index) => {
          const fraction = index / 79;
          const angle = fraction * Math.PI * 10;
          return new THREE.Vector3(
            -1.05 + 2.1 * fraction,
            Math.sin(angle) * 0.54,
            Math.cos(angle) * 0.54,
          );
        }),
      );
      const spiral = mesh(
        group,
        rememberGeometry(new THREE.TubeGeometry(curve, 96, 0.036, 10, false)),
        pumpMaterial,
        `${name} spiral potassium pumping lamp 30`,
        [0, 0, 0],
      );
      pumpingElements.push(spiral);
      scalableParts.push(spiral);
    } else {
      for (const [y, z] of [
        [0.5, 0],
        [-0.5, 0],
        [0, 0.5],
        [0, -0.5],
      ] as const) {
        const lamp = mesh(
          group,
          lampGeometry,
          pumpMaterial,
          `${name} potassium pumping lamp 20`,
          [0, y, z],
          [0, 0, Math.PI / 2],
        );
        pumpingElements.push(lamp);
        scalableParts.push(lamp);
      }
    }

    const modulationCoils: THREE.Mesh[] = [];
    if (spiralPump) {
      for (const xLocal of [-0.68, -0.34, 0, 0.34, 0.68]) {
        modulationCoils.push(
          mesh(
            group,
            rememberGeometry(new THREE.TorusGeometry(0.68, 0.025, 8, 28)),
            coilMaterial,
            `${name} longitudinal-field coil 32`,
            [xLocal, 0, 0],
            [0, Math.PI / 2, 0],
          ),
        );
      }
    }

    for (const xLocal of [-0.72, 0.72]) {
      mesh(
        group,
        rememberGeometry(new THREE.BoxGeometry(0.14, 0.55, 0.72)),
        accent,
        `${name} chamber support cradle`,
        [xLocal, -0.83, 0],
      );
    }

    return {
      group,
      scalableParts,
      leftEnd,
      rightEnd,
      vapor,
      transparentShell,
      pumpingElements,
      modulationCoils,
    };
  };

  const generatorAssembly = buildAssembly("generator 10", -4.0, generatorMaterial, false);
  const amplifierAssembly = buildAssembly("modulated amplifier 12", 0.15, amplifierMaterial, true);

  const sourceBoxGeometry = rememberGeometry(new THREE.BoxGeometry(1.05, 0.48, 0.7));
  const sourceSupportGeometry = rememberGeometry(
    new THREE.CylinderGeometry(0.055, 0.065, 0.66, 12),
  );
  const generatorSource = mesh(
    root,
    sourceBoxGeometry,
    generatorMaterial,
    "lamp energizing source 21",
    [-4, 1.18, -0.15],
  );
  const amplifierSource = mesh(
    root,
    sourceBoxGeometry,
    amplifierMaterial,
    "lamp energizing source 31",
    [0.15, 1.18, -0.15],
  );
  const modulatingSource = mesh(
    root,
    sourceBoxGeometry,
    coilMaterial,
    "modulating source 11",
    [0.15, -0.85, 0.82],
  );
  mesh(
    root,
    sourceSupportGeometry,
    generatorMaterial,
    "physical bracket supporting lamp source 21",
    [-4, 0.63, -0.15],
  );
  mesh(
    root,
    sourceSupportGeometry,
    amplifierMaterial,
    "physical bracket supporting lamp source 31",
    [0.15, 0.63, -0.15],
  );

  const addWire = (points: readonly THREE.Vector3[], name: string) => {
    const geometry = rememberGeometry(new THREE.BufferGeometry().setFromPoints([...points]));
    const line = new THREE.Line(geometry, wiringMaterial);
    line.name = name;
    root.add(line);
  };
  addWire(
    [new THREE.Vector3(-4, 0.94, -0.15), new THREE.Vector3(-4, 0.63, -0.15)],
    "source 21 connected to pumping lamps 20",
  );
  addWire(
    [new THREE.Vector3(0.15, 0.94, -0.15), new THREE.Vector3(0.15, 0.63, -0.15)],
    "source 31 connected to pumping assembly 30",
  );
  addWire(
    [new THREE.Vector3(0.15, -0.61, 0.82), new THREE.Vector3(0.15, -0.2, 0.66)],
    "modulating source 11 connected to coil 32",
  );
  generatorSource.castShadow = true;
  amplifierSource.castShadow = true;
  modulatingSource.castShadow = true;

  const lensGeometry = rememberGeometry(new THREE.SphereGeometry(0.31, 20, 14));
  const apertureGeometry = rememberGeometry(new THREE.RingGeometry(0.07, 0.4, 28));
  const opticPostGeometry = rememberGeometry(new THREE.CylinderGeometry(0.045, 0.06, 1.08, 12));
  const modeSelector = new THREE.Group();
  modeSelector.name = "focal-plane mode selector 23–26";
  root.add(modeSelector);
  const lens23 = mesh(
    modeSelector,
    lensGeometry,
    opticMaterial,
    "double-convex lens 23",
    [-2.45, 0, 0],
  );
  lens23.scale.set(0.18, 1, 1);
  const aperture25 = mesh(
    modeSelector,
    apertureGeometry,
    apertureMaterial,
    "absorptive sheet 25 with aperture 24",
    [-1.92, 0, 0],
    [0, Math.PI / 2, 0],
  );
  const lens26 = mesh(
    modeSelector,
    lensGeometry,
    opticMaterial,
    "double-convex lens 26",
    [-1.4, 0, 0],
  );
  lens26.scale.set(0.18, 1, 1);
  for (const [x, name] of [
    [-2.45, "lens-23 mount"],
    [-1.92, "aperture-24/25 mount"],
    [-1.4, "lens-26 mount"],
  ] as const) {
    mesh(root, opticPostGeometry, housingMaterial, name, [x, -0.58, 0]);
  }

  const detector = new THREE.Group();
  detector.name = "detector 13 photomultiplier station";
  detector.position.set(3.75, 0, 0);
  root.add(detector);
  const outputLens33 = mesh(root, lensGeometry, opticMaterial, "output lens 33", [1.72, 0, 0]);
  outputLens33.scale.set(0.18, 1, 1);
  const outputAperture35 = mesh(
    root,
    apertureGeometry,
    apertureMaterial,
    "absorptive member 35 with aperture 34",
    [2.23, 0, 0],
    [0, Math.PI / 2, 0],
  );
  const outputLens36 = mesh(root, lensGeometry, opticMaterial, "output lens 36", [2.72, 0, 0]);
  outputLens36.scale.set(0.18, 1, 1);
  for (const [x, name] of [
    [1.72, "lens-33 mount"],
    [2.23, "aperture-34/35 mount"],
    [2.72, "lens-36 mount"],
  ] as const) {
    mesh(root, opticPostGeometry, housingMaterial, name, [x, -0.58, 0]);
  }
  mesh(
    detector,
    rememberGeometry(new THREE.BoxGeometry(0.72, 0.85, 0.85)),
    detectorMaterial,
    "photomultiplier detector housing 13",
    [0, 0, 0],
  );
  mesh(
    detector,
    rememberGeometry(new THREE.CylinderGeometry(0.24, 0.24, 0.16, 24)),
    goldMaterial,
    "detector photosensitive face",
    [-0.42, 0, 0],
    [0, 0, Math.PI / 2],
  );
  mesh(
    detector,
    rememberGeometry(new THREE.BoxGeometry(0.14, 0.62, 0.64)),
    detectorMaterial,
    "detector bench support",
    [0, -0.82, 0],
  );

  const beamGeometry = rememberGeometry(new THREE.CylinderGeometry(0.035, 0.035, 1, 12));
  const generatorBeam = mesh(
    root,
    beamGeometry,
    beamMaterial,
    "generator selected optical path",
    [0, 0, 0],
  );
  const amplifierBeam = mesh(
    root,
    beamGeometry,
    selectedBeamMaterial,
    "input path to amplifier",
    [0, 0, 0],
  );
  const detectorBeam = mesh(
    root,
    beamGeometry,
    selectedBeamMaterial,
    "amplified path to detector",
    [0, 0, 0],
  );

  const update = (state: TownesMaserTopologyState, timeSec: number) => {
    const displayLengthScale = 0.75 + ((state.controls.cavityLengthCm - 5) / 15) * 0.5;
    const displayDiameterScale = 0.72 + ((state.controls.chamberDiameterCm - 0.5) / 1.5) * 0.52;
    for (const assembly of [generatorAssembly, amplifierAssembly]) {
      for (const part of assembly.scalableParts) {
        if (part.name.includes("protective shell") || part.name.includes("potassium-vapor")) {
          part.scale.set(displayDiameterScale, displayLengthScale, displayDiameterScale);
        } else if (part.name.includes("potassium pumping lamp") && !part.name.includes("spiral")) {
          part.scale.set(1, displayLengthScale, 1);
        } else if (part.name.includes("housing 22 rail") || part.name.includes("spiral")) {
          part.scale.set(displayLengthScale, 1, 1);
        }
      }
      assembly.leftEnd.position.x = -1.15 * displayLengthScale;
      assembly.rightEnd.position.x = 1.15 * displayLengthScale;
    }

    const pumpFraction = state.controls.pumpExcitationPct / 100;
    const pumpPulse = 0.82 + 0.18 * Math.sin(timeSec * 4);
    pumpMaterial.emissiveIntensity = state.pumpingPathPresent
      ? 0.2 + 2.2 * pumpFraction * pumpPulse
      : 0.03;
    vaporMaterial.emissiveIntensity = state.pumpingPathPresent ? 0.1 + 0.75 * pumpFraction : 0;
    const modulationFraction = state.controls.modulationFieldPct / 100;
    coilMaterial.emissiveIntensity = state.zeemanModulationPathPresent
      ? 0.15 + modulationFraction * (0.55 + 0.18 * Math.sin(timeSec * 3))
      : 0.04;

    const generatorRight = new THREE.Vector3(
      generatorAssembly.group.position.x + 1.15 * displayLengthScale,
      0,
      0,
    );
    const amplifierLeft = new THREE.Vector3(
      amplifierAssembly.group.position.x - 1.15 * displayLengthScale,
      0,
      0,
    );
    const amplifierRight = new THREE.Vector3(
      amplifierAssembly.group.position.x + 1.15 * displayLengthScale,
      0,
      0,
    );
    updateCylinderBetween(generatorBeam, generatorRight, new THREE.Vector3(-1.92, 0, 0));
    updateCylinderBetween(amplifierBeam, new THREE.Vector3(-1.4, 0, 0), amplifierLeft);
    updateCylinderBetween(detectorBeam, amplifierRight, new THREE.Vector3(3.33, 0, 0));

    const apertureFraction = state.controls.modeApertureOpenPct / 100;
    aperture25.scale.setScalar(0.82 + apertureFraction * 0.45);
    outputAperture35.scale.setScalar(1);
    const reflectedFraction = state.controls.endReflectivityPct / 100;
    const pathOpacity = state.signalPathComplete ? 0.28 + 0.55 * pumpFraction : 0;
    beamMaterial.opacity = pathOpacity;
    selectedBeamMaterial.opacity = pathOpacity * (0.65 + 0.35 * (1 - reflectedFraction));
    generatorBeam.visible = state.signalPathComplete;
    amplifierBeam.visible = state.signalPathComplete;
    detectorBeam.visible = state.signalPathComplete;

    const claimOpacity = state.claim1PathPresent ? 1 : 0.22;
    generatorMaterial.opacity = claimOpacity;
    generatorMaterial.transparent = !state.claim1PathPresent;
    amplifierMaterial.opacity = claimOpacity;
    amplifierMaterial.transparent = !state.claim1PathPresent;
    detectorMaterial.opacity = claimOpacity;
    detectorMaterial.transparent = !state.claim1PathPresent;
  };

  const setCutaway = (cutaway: boolean) => {
    glassMaterial.opacity = cutaway ? 0.08 : 0.28;
    housingMaterial.opacity = cutaway ? 0.32 : 1;
    housingMaterial.transparent = cutaway;
    glassMaterial.needsUpdate = true;
    housingMaterial.needsUpdate = true;
  };

  const dispose = () => {
    for (const geometry of geometries) geometry.dispose();
    for (const material of materials) material.dispose();
  };

  return {
    root,
    generator: generatorAssembly.group,
    amplifier: amplifierAssembly.group,
    detector,
    modeSelector,
    generatorPumpLamps: generatorAssembly.pumpingElements,
    amplifierPumpLamp: amplifierAssembly.pumpingElements[0] as THREE.Mesh,
    modulationCoils: amplifierAssembly.modulationCoils,
    generatorBeam,
    amplifierBeam,
    detectorBeam,
    update,
    setCutaway,
    dispose,
  };
}
