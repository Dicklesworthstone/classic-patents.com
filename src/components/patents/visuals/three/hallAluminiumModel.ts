import * as THREE from "three";

export interface HallAluminiumModelNodes {
  root: THREE.Group;
  potShell: THREE.Mesh;
  refractoryInsulation: THREE.Mesh;
  carbonCathode: THREE.Mesh;
  cryoliteBath: THREE.Mesh;
  aluminiumPad: THREE.Mesh;
  anodeAssembly: THREE.Group;
  anodeBlocks: THREE.Mesh[];
  copperBusbar: THREE.Mesh;
  bubbleParticles: THREE.Points;
  feederHopper: THREE.Mesh;
  siphonSpout: THREE.Mesh;
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
    color: 0xe2e8f0,
    metalness: 0.95,
    roughness: 0.15,
    envMapIntensity: 1.5,
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

  // 1. STEEL POT SHELL (A) - Outer box
  const potShellGeometry = new THREE.BoxGeometry(4.2, 1.8, 2.6);
  const potShell = new THREE.Mesh(potShellGeometry, potShellMaterial);
  potShell.position.set(0, -0.2, 0);
  potShell.name = "pot_shell_A";
  root.add(potShell);

  // 2. THERMAL REFRACTORY INSULATION
  const refractoryGeometry = new THREE.BoxGeometry(4.0, 1.6, 2.4);
  const refractoryInsulation = new THREE.Mesh(refractoryGeometry, refractoryMaterial);
  refractoryInsulation.position.set(0, -0.15, 0);
  refractoryInsulation.name = "refractory_insulation";
  root.add(refractoryInsulation);

  // 3. CARBON CATHODE LINING (B) - Bottom & Inner Sides
  const carbonCathodeGeometry = new THREE.BoxGeometry(3.7, 1.4, 2.1);
  const carbonCathode = new THREE.Mesh(carbonCathodeGeometry, carbonCathodeMaterial);
  carbonCathode.position.set(0, -0.1, 0);
  carbonCathode.name = "carbon_cathode_B";
  root.add(carbonCathode);

  // 4. SUNK MOLTEN ALUMINIUM PAD (E) - Heavy metal pool (density 2.28 g/cm³)
  const aluminiumPadGeometry = new THREE.BoxGeometry(3.5, 0.25, 1.9);
  const aluminiumPad = new THREE.Mesh(aluminiumPadGeometry, aluminiumPadMaterial);
  aluminiumPad.position.set(0, -0.65, 0);
  aluminiumPad.name = "molten_aluminium_pad_E";
  root.add(aluminiumPad);

  // 5. MOLTEN CRYOLITE BATH (D) - Liquid electrolyte solvent (density 2.10 g/cm³)
  const cryoliteBathGeometry = new THREE.BoxGeometry(3.5, 0.75, 1.9);
  const cryoliteBath = new THREE.Mesh(cryoliteBathGeometry, cryoliteBathMaterial);
  cryoliteBath.position.set(0, -0.15, 0);
  cryoliteBath.name = "cryolite_bath_D";
  root.add(cryoliteBath);

  // 6. ANODE ASSEMBLY - 4 Consumable Prebaked Carbon Blocks (C C)
  const anodeAssembly = new THREE.Group();
  anodeAssembly.name = "anode_assembly";
  const anodeBlocks: THREE.Mesh[] = [];

  const anodeGeo = new THREE.BoxGeometry(0.55, 1.1, 0.65);
  const hangerGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.8, 12);

  const xPositions = [-1.2, -0.4, 0.4, 1.2];
  for (let i = 0; i < 4; i++) {
    const anodeMesh = new THREE.Mesh(anodeGeo, carbonAnodeMaterial);
    anodeMesh.position.set(xPositions[i], 0.25, 0);
    anodeMesh.name = `carbon_anode_block_${i + 1}`;
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

  // 9. ALUMINA POINT FEEDER HOPPER
  const hopperGeo = new THREE.ConeGeometry(0.25, 0.5, 8);
  const feederHopper = new THREE.Mesh(hopperGeo, potShellMaterial);
  feederHopper.rotation.x = Math.PI;
  feederHopper.position.set(0, 0.9, 0.8);
  feederHopper.name = "alumina_feeder_hopper";
  root.add(feederHopper);

  // 10. MOLTEN ALUMINIUM SIPHON TAP SPOUT
  const spoutGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.7, 12);
  const siphonSpout = new THREE.Mesh(spoutGeo, potShellMaterial);
  siphonSpout.rotation.z = Math.PI / 4;
  siphonSpout.position.set(2.1, -0.6, 0);
  siphonSpout.name = "siphon_tap_spout";
  root.add(siphonSpout);

  return {
    root,
    potShell,
    refractoryInsulation,
    carbonCathode,
    cryoliteBath,
    aluminiumPad,
    anodeAssembly,
    anodeBlocks,
    copperBusbar,
    bubbleParticles,
    feederHopper,
    siphonSpout,
  };
}

export function updateHallAluminiumVisual(
  model: HallAluminiumModelNodes,
  telemetry: {
    currentAmperes: number;
    bathTemperatureCelsius: number;
    totalCellVoltage: number;
    aluminiumProductionRateKgPerHour: number;
  },
  elapsedSeconds: number,
) {
  // Deterministic bubble evolution animation
  const positions = model.bubbleParticles.geometry.attributes.position.array as Float32Array;
  const count = positions.length / 3;
  const currentFactor = telemetry.currentAmperes / 300000;

  for (let i = 0; i < count; i++) {
    const baseBlock = i % 4;
    const blockX = [-1.2, -0.4, 0.4, 1.2][baseBlock];

    // Lift speed proportional to current density
    const speed = 0.4 * currentFactor;
    let y = positions[i * 3 + 1] + speed * 0.016;
    if (y > 0.25) {
      y = -0.55;
    }
    positions[i * 3 + 1] = y;

    // Slight lateral sway
    positions[i * 3] = blockX + Math.sin(elapsedSeconds * 3 + i) * 0.15;
  }
  model.bubbleParticles.geometry.attributes.position.needsUpdate = true;

  // Modulate cryolite bath emissive glow with bath temperature
  const tempRatio = Math.max(0.7, Math.min(1.3, telemetry.bathTemperatureCelsius / 960));
  const bathMat = model.cryoliteBath.material as THREE.MeshPhysicalMaterial;
  bathMat.emissiveIntensity = 0.35 * tempRatio;

  // Gentle thermal pulsation on anode assembly
  model.anodeAssembly.position.y = Math.sin(elapsedSeconds * 1.5) * 0.005;
}
