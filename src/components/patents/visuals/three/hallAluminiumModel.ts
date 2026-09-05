import * as THREE from "three";

export interface HallAluminiumModelNodes {
  root: THREE.Group;
  potShell: THREE.Group;
  refractoryInsulation: THREE.Group;
  carbonCathode: THREE.Group;
  potShellPanels: HallCellPanelSet;
  refractoryPanels: HallCellPanelSet;
  carbonCathodePanels: HallCellPanelSet;
  cryoliteBath: THREE.Mesh;
  aluminiumPad: THREE.Mesh;
  anodeAssembly: THREE.Group;
  anodeBlocks: THREE.Mesh[];
  copperBusbar: THREE.Mesh;
  bubbleParticles: THREE.Points;
  feederHopper: THREE.Mesh;
  siphonSpout: THREE.Mesh;
  setCutaway?: (cutaway: boolean) => void;
  dispose: () => void;
}

export interface HallCellPanelSet {
  floor: THREE.Mesh;
  left: THREE.Mesh;
  right: THREE.Mesh;
  front: THREE.Mesh;
  back: THREE.Mesh;
}

export const HALL_CELL_GEOMETRY = {
  vesselBottomY: -1.1,
  vesselTopY: 0.7,
  cavityBottomY: -0.75,
  cavityWidthM: 3.5,
  cavityDepthM: 1.9,
  aluminiumTopY: -0.55,
  bathTopY: 0.225,
  anodeBottomY: -0.3,
} as const;

function createOpenRectangularLayer({
  name,
  material,
  outerWidth,
  outerDepth,
  bottomY,
  topY,
  thickness,
}: {
  name: string;
  material: THREE.Material;
  outerWidth: number;
  outerDepth: number;
  bottomY: number;
  topY: number;
  thickness: number;
}): { group: THREE.Group; panels: HallCellPanelSet } {
  const group = new THREE.Group();
  group.name = name;
  const wallBottomY = bottomY + thickness;
  const wallHeight = topY - wallBottomY;
  const innerWidth = outerWidth - 2 * thickness;

  const panel = (
    panelName: string,
    size: [number, number, number],
    position: [number, number, number],
  ) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
    mesh.name = `${name}_${panelName}`;
    mesh.position.set(...position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    return mesh;
  };

  return {
    group,
    panels: {
      floor: panel("floor", [outerWidth, thickness, outerDepth], [0, bottomY + thickness / 2, 0]),
      left: panel(
        "left_wall",
        [thickness, wallHeight, outerDepth],
        [-outerWidth / 2 + thickness / 2, wallBottomY + wallHeight / 2, 0],
      ),
      right: panel(
        "right_wall",
        [thickness, wallHeight, outerDepth],
        [outerWidth / 2 - thickness / 2, wallBottomY + wallHeight / 2, 0],
      ),
      front: panel(
        "front_cutaway_wall",
        [innerWidth, wallHeight, thickness],
        [0, wallBottomY + wallHeight / 2, outerDepth / 2 - thickness / 2],
      ),
      back: panel(
        "back_wall",
        [innerWidth, wallHeight, thickness],
        [0, wallBottomY + wallHeight / 2, -outerDepth / 2 + thickness / 2],
      ),
    },
  };
}

export function createHallAluminiumModel(): HallAluminiumModelNodes {
  const root = new THREE.Group();
  root.name = "hall_aluminium_smelting_cell";

  // MATERIALS
  const potShellMaterial = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.7,
    metalness: 0.6,
  });

  const refractoryMaterial = new THREE.MeshStandardMaterial({
    color: 0xb45309,
    roughness: 0.9,
    metalness: 0.1,
  });

  const carbonCathodeMaterial = new THREE.MeshStandardMaterial({
    color: 0x111827,
    roughness: 0.8,
    metalness: 0.2,
  });

  const cryoliteBathMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xf59e0b,
    emissive: 0xd97706,
    emissiveIntensity: 0.4,
    roughness: 0.2,
    metalness: 0.1,
    transmission: 0.7,
    transparent: true,
    opacity: 0.85,
    ior: 1.35,
  });

  const aluminiumPadMaterial = new THREE.MeshStandardMaterial({
    color: 0xdbeafe,
    emissive: 0x475569,
    emissiveIntensity: 0.28,
    metalness: 0.68,
    roughness: 0.24,
    envMapIntensity: 1.8,
  });

  const carbonAnodeMaterial = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.85,
    metalness: 0.1,
  });

  const copperBusMaterial = new THREE.MeshStandardMaterial({
    color: 0xea580c,
    metalness: 0.85,
    roughness: 0.3,
  });

  // Concrete Foundation Plinth & Refractory Support Piers
  const concreteMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.85,
    metalness: 0.1,
  });
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.4, 3.8), concreteMat);
  plinth.position.set(0, -1.3, 0);
  plinth.receiveShadow = true;
  root.add(plinth);

  // 6 Refractory Insulating Support Piers beneath Pot Shell
  for (const [px, pz] of [
    [-1.6, -1.0],
    [0, -1.0],
    [1.6, -1.0],
    [-1.6, 1.0],
    [0, 1.0],
    [1.6, 1.0],
  ]) {
    const pier = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.25, 0.5), refractoryMaterial);
    pier.position.set(px, -1.15, pz);
    root.add(pier);
  }

  // 1–3. The steel pot, refractory insulation, and carbon cathode are open
  // vessels made from contacting floor/wall panels. They must not be nested
  // solid boxes: the cavity is occupied by molten metal and electrolyte.
  const steelLayer = createOpenRectangularLayer({
    name: "steel_pot_shell_A",
    material: potShellMaterial,
    outerWidth: 4.2,
    outerDepth: 2.6,
    bottomY: HALL_CELL_GEOMETRY.vesselBottomY,
    topY: HALL_CELL_GEOMETRY.vesselTopY,
    thickness: 0.12,
  });
  const potShell = steelLayer.group;
  root.add(potShell);

  // Negative Cathode Collector Steel Bars exiting Bottom of Pot
  for (let b = 0; b < 3; b++) {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.12, 0.15), copperBusMaterial);
    bar.position.set(0, -1.0, -0.8 + b * 0.8);
    root.add(bar);
  }

  const refractoryLayer = createOpenRectangularLayer({
    name: "thermal_refractory_insulation",
    material: refractoryMaterial,
    outerWidth: 3.96,
    outerDepth: 2.36,
    bottomY: -0.98,
    topY: HALL_CELL_GEOMETRY.vesselTopY,
    thickness: 0.15,
  });
  const refractoryInsulation = refractoryLayer.group;
  root.add(refractoryInsulation);

  const carbonLayer = createOpenRectangularLayer({
    name: "carbon_cathode_lining_B",
    material: carbonCathodeMaterial,
    outerWidth: 3.66,
    outerDepth: 2.06,
    bottomY: -0.83,
    topY: HALL_CELL_GEOMETRY.vesselTopY,
    thickness: 0.08,
  });
  const carbonCathode = carbonLayer.group;
  root.add(carbonCathode);

  // 4. SUNK MOLTEN ALUMINIUM PAD (E) - Heavy metal pool (density 2.28 g/cm³)
  const aluminiumPadHeight = HALL_CELL_GEOMETRY.aluminiumTopY - HALL_CELL_GEOMETRY.cavityBottomY;
  const aluminiumPadGeometry = new THREE.BoxGeometry(
    HALL_CELL_GEOMETRY.cavityWidthM,
    aluminiumPadHeight,
    HALL_CELL_GEOMETRY.cavityDepthM,
  );
  const aluminiumPad = new THREE.Mesh(aluminiumPadGeometry, aluminiumPadMaterial);
  aluminiumPad.position.set(
    0,
    (HALL_CELL_GEOMETRY.cavityBottomY + HALL_CELL_GEOMETRY.aluminiumTopY) / 2,
    0,
  );
  aluminiumPad.name = "molten_aluminium_pad_E";
  root.add(aluminiumPad);

  // 5. MOLTEN CRYOLITE BATH (D) - Liquid electrolyte solvent (density 2.10 g/cm³)
  const bathHeight = HALL_CELL_GEOMETRY.bathTopY - HALL_CELL_GEOMETRY.aluminiumTopY;
  const cryoliteBathGeometry = new THREE.BoxGeometry(
    HALL_CELL_GEOMETRY.cavityWidthM,
    bathHeight,
    HALL_CELL_GEOMETRY.cavityDepthM,
  );
  const cryoliteBath = new THREE.Mesh(cryoliteBathGeometry, cryoliteBathMaterial);
  cryoliteBath.position.set(
    0,
    (HALL_CELL_GEOMETRY.aluminiumTopY + HALL_CELL_GEOMETRY.bathTopY) / 2,
    0,
  );
  cryoliteBath.name = "cryolite_bath_D";
  root.add(cryoliteBath);

  // Anode Superstructure Gantry Frame Columns
  for (const [gx, gz] of [
    [-2.0, -1.2],
    [2.0, -1.2],
    [-2.0, 1.2],
    [2.0, 1.2],
  ]) {
    const col = new THREE.Mesh(new THREE.BoxGeometry(0.16, 1.4, 0.16), potShellMaterial);
    col.position.set(gx, 0.8, gz);
    col.castShadow = true;
    root.add(col);
  }
  // Crossbeams atop Gantry
  for (const gz of [-1.2, 1.2]) {
    const crossbeam = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.14, 0.14), potShellMaterial);
    crossbeam.position.set(0, 1.45, gz);
    root.add(crossbeam);
  }

  // 6. ANODE ASSEMBLY - 4 Consumable Prebaked Carbon Blocks (C C)
  const anodeAssembly = new THREE.Group();
  anodeAssembly.name = "anode_assembly";
  const anodeBlocks: THREE.Mesh[] = [];

  const anodeHeight = 0.8 - HALL_CELL_GEOMETRY.anodeBottomY;
  const anodeGeo = new THREE.BoxGeometry(0.55, anodeHeight, 0.65);
  const hangerGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.8, 12);

  const xPositions = [-1.2, -0.4, 0.4, 1.2];
  for (let i = 0; i < 4; i++) {
    const anodeMesh = new THREE.Mesh(anodeGeo, carbonAnodeMaterial);
    anodeMesh.position.set(xPositions[i], (0.8 + HALL_CELL_GEOMETRY.anodeBottomY) / 2, 0);
    anodeMesh.name = `carbon_anode_block_${i + 1}`;
    anodeMesh.castShadow = true;
    anodeAssembly.add(anodeMesh);
    anodeBlocks.push(anodeMesh);

    // Copper hanger rod
    const hangerMesh = new THREE.Mesh(hangerGeo, copperBusMaterial);
    hangerMesh.position.set(xPositions[i], 0.9, 0);
    anodeAssembly.add(hangerMesh);
  }
  root.add(anodeAssembly);

  // 7. OVERHEAD POSITIVE COPPER BUSBAR TRUNK
  const busbarGeo = new THREE.BoxGeometry(3.6, 0.12, 0.2);
  const copperBusbar = new THREE.Mesh(busbarGeo, copperBusMaterial);
  copperBusbar.position.set(0, 1.3, 0);
  copperBusbar.name = "positive_copper_busbar";
  root.add(copperBusbar);

  // 8. CO2 BUBBLE POINT CLOUD PARTICLES
  const bubbleParticleCount = 120;
  const bubblePositions = new Float32Array(bubbleParticleCount * 3);
  for (let i = 0; i < bubbleParticleCount; i++) {
    const blockIdx = i % 4;
    const bx = xPositions[blockIdx] + Math.sin(i * 1.7) * 0.2;
    const by = -0.5 + ((i * 0.03) % 0.8);
    const bz = Math.cos(i * 2.3) * 0.25;
    bubblePositions[i * 3] = bx;
    bubblePositions[i * 3 + 1] = by;
    bubblePositions[i * 3 + 2] = bz;
  }

  const bubbleGeometry = new THREE.BufferGeometry();
  bubbleGeometry.setAttribute("position", new THREE.BufferAttribute(bubblePositions, 3));
  const bubbleMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.04,
    transparent: true,
    opacity: 0.8,
  });
  const bubbleParticles = new THREE.Points(bubbleGeometry, bubbleMaterial);
  bubbleParticles.name = "co2_bubbles";
  root.add(bubbleParticles);

  // 9. ALUMINA POINT FEEDER HOPPER & SUPPORT BRACKET
  const hopperGroup = new THREE.Group();
  hopperGroup.position.set(0, 0.9, 0.8);
  root.add(hopperGroup);

  const hopperGeo = new THREE.ConeGeometry(0.25, 0.5, 8);
  const feederHopper = new THREE.Mesh(hopperGeo, potShellMaterial);
  feederHopper.rotation.x = Math.PI;
  feederHopper.name = "alumina_feeder_hopper";
  hopperGroup.add(feederHopper);

  const hopperBracket = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.45, 0.35), potShellMaterial);
  hopperBracket.position.set(0, 0.2, 0.2);
  hopperGroup.add(hopperBracket);

  // 10. MOLTEN ALUMINIUM SIPHON TAP SPOUT
  const spoutGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.7, 12);
  const siphonSpout = new THREE.Mesh(spoutGeo, potShellMaterial);
  siphonSpout.rotation.z = Math.PI / 4;
  siphonSpout.position.set(2.1, -0.6, 0);
  siphonSpout.name = "siphon_tap_spout";
  root.add(siphonSpout);

  const setCutaway = (cutaway: boolean) => {
    for (const layer of [steelLayer, refractoryLayer, carbonLayer]) {
      layer.panels.front.visible = !cutaway;
      layer.group.userData.cutaway = cutaway;
    }
  };

  const dispose = () => {
    const geometries = new Set<THREE.BufferGeometry>();
    const materials = new Set<THREE.Material>();
    root.traverse((node) => {
      if (!(node instanceof THREE.Mesh || node instanceof THREE.Points)) return;
      geometries.add(node.geometry);
      const nodeMaterials = Array.isArray(node.material) ? node.material : [node.material];
      for (const material of nodeMaterials) materials.add(material);
    });
    for (const geometry of geometries) geometry.dispose();
    for (const material of materials) material.dispose();
  };

  return {
    root,
    potShell,
    refractoryInsulation,
    carbonCathode,
    potShellPanels: steelLayer.panels,
    refractoryPanels: refractoryLayer.panels,
    carbonCathodePanels: carbonLayer.panels,
    cryoliteBath,
    aluminiumPad,
    anodeAssembly,
    anodeBlocks,
    copperBusbar,
    bubbleParticles,
    feederHopper,
    siphonSpout,
    setCutaway,
    dispose,
  };
}

export function updateHallAluminiumVisual(
  model: HallAluminiumModelNodes,
  telemetry: {
    currentAmperes: number;
    bathTemperatureCelsius: number;
    totalCellVoltage: number;
    aluminiumProductionRateKgPerHour: number;
    claim1Active?: number;
  },
  elapsedSeconds: number,
  deltaSeconds: number,
) {
  const isClaim1Active = telemetry.claim1Active === undefined || telemetry.claim1Active >= 0.5;
  const isProducing = isClaim1Active && telemetry.aluminiumProductionRateKgPerHour > 0;

  // Deterministic bubble evolution animation
  model.bubbleParticles.visible = isProducing;
  if (isProducing) {
    const positions = model.bubbleParticles.geometry.attributes.position.array as Float32Array;
    const count = positions.length / 3;
    const currentFactor = telemetry.currentAmperes / 300000;
    // Lift / sway drain current density (300 kA → leftover 0.4 / 3). Zero current freezes the bath.
    const bubbleLiftSpeed = 0.4 * currentFactor;
    const bubbleSwayOmegaRadPerS = 3 * currentFactor;

    for (let i = 0; i < count; i++) {
      const baseBlock = i % 4;
      const blockX = [-1.2, -0.4, 0.4, 1.2][baseBlock];

      const lowerBathY = -0.55;
      const bathTravel = 0.8;
      const nextY = positions[i * 3 + 1] + bubbleLiftSpeed * Math.max(0, deltaSeconds);
      const y = lowerBathY + ((((nextY - lowerBathY) % bathTravel) + bathTravel) % bathTravel);
      positions[i * 3 + 1] = y;

      positions[i * 3] = blockX + Math.sin(elapsedSeconds * bubbleSwayOmegaRadPerS + i) * 0.15;
    }
    model.bubbleParticles.geometry.attributes.position.needsUpdate = true;
  }

  // Modulate cryolite bath emissive glow with bath temperature
  const tempRatio = Math.max(0.7, Math.min(1.3, telemetry.bathTemperatureCelsius / 960));
  const bathMat = model.cryoliteBath.material as THREE.MeshPhysicalMaterial;
  bathMat.emissiveIntensity = isClaim1Active ? 0.35 * tempRatio : 0.05;

  // Anode pulse drains the same current factor (300 kA → leftover 1.5).
  const anodePulseOmegaRadPerS = isProducing ? 1.5 * (telemetry.currentAmperes / 300000) : 0;
  model.anodeAssembly.position.y = Math.sin(elapsedSeconds * anodePulseOmegaRadPerS) * 0.005;
}
