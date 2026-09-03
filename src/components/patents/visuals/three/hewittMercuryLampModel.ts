/**
 * hewittMercuryLampModel.ts
 *
 * Procedural 3D WebGL Model of Peter Cooper Hewitt's 1901
 * Mercury-Vapor Electric Discharge Arc Lamp (US Patent 682,690).
 *
 * Conforms to the Classic Patents 3D visualization doctrine:
 * - Pure procedural Three.js geometry (No GLTF/GLB asset loading)
 * - Deterministic pseudo-random seeding (Deterministic replay in frame loop)
 * - Named articulation nodes with complete deep disposal
 */

import * as THREE from "three";

export interface HewittMercuryLampModelNodes {
  root: THREE.Group;
  lampGroup: THREE.Group;
  glassTube: THREE.Mesh;
  plasmaColumn: THREE.Mesh;
  plasmaLight: THREE.PointLight;
  cathodeSpotMesh: THREE.Mesh;
  mercuryPoolMesh: THREE.Mesh;
  condensingGlobe: THREE.Mesh;
  tiltingCradle: THREE.Group;
  pullCord: THREE.Mesh;
  startingCoil: THREE.Mesh;
  dropletParticles: THREE.Points;
  initialDropletPositions: Float32Array;
  materials: THREE.Material[];
  setCutaway?: (cutaway: boolean) => void;
  dispose: () => void;
}

export function buildHewittMercuryLampModel(): HewittMercuryLampModelNodes {
  const root = new THREE.Group();
  const materials: THREE.Material[] = [];

  // ==========================================
  // MATERIALS
  // ==========================================
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xe2e8f0,
    metalness: 0.1,
    roughness: 0.1,
    transmission: 0.85,
    ior: 1.52,
    transparent: true,
    opacity: 0.45,
  });
  materials.push(glassMat);

  const plasmaMat = new THREE.MeshStandardMaterial({
    color: 0x06b6d4,
    emissive: 0x10b981, // Characteristic cyan-green mercury emission glow
    emissiveIntensity: 2.2,
    roughness: 0.2,
    metalness: 0.1,
    transparent: true,
    opacity: 0.85,
  });
  materials.push(plasmaMat);

  const mercuryMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    metalness: 0.95,
    roughness: 0.15,
  });
  materials.push(mercuryMat);

  const spotMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
  });
  materials.push(spotMat);

  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    metalness: 0.85,
    roughness: 0.3,
  });
  materials.push(brassMat);

  const copperMat = new THREE.MeshStandardMaterial({
    color: 0xb45309,
    metalness: 0.9,
    roughness: 0.25,
  });
  materials.push(copperMat);

  const ironMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    metalness: 0.7,
    roughness: 0.5,
  });
  materials.push(ironMat);

  const wallBracketMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    metalness: 0.6,
    roughness: 0.7,
  });
  materials.push(wallBracketMat);

  const cordMat = new THREE.MeshStandardMaterial({
    color: 0x78350f,
    roughness: 0.9,
  });
  materials.push(cordMat);

  // ==========================================
  // 1. MOUNTING FRAME & WALL BRACKETS
  // ==========================================
  const bracketGroup = new THREE.Group();
  bracketGroup.name = "Floor-anchored wall mounting frame";
  root.add(bracketGroup);

  // A visible backplate reaches the exhibit floor, so the source-style wall
  // bracket is not represented as a collection of rods hovering in space.
  const wallBackplate = new THREE.Mesh(new THREE.BoxGeometry(4.4, 3.2, 0.12), wallBracketMat);
  wallBackplate.name = "Floor-reaching mounting backplate";
  wallBackplate.position.set(0, 1.55, -0.82);
  bracketGroup.add(wallBackplate);

  const pivotSupport = new THREE.Mesh(
    new THREE.CylinderGeometry(0.07, 0.07, 0.72, 16),
    wallBracketMat,
  );
  pivotSupport.name = "Backplate-to-cradle pivot support";
  pivotSupport.rotation.x = Math.PI / 2;
  pivotSupport.position.set(0, 1.5, -0.43);
  bracketGroup.add(pivotSupport);

  // Inductive starting choke coil fixed to the backplate
  const ballastGeo = new THREE.TorusGeometry(0.2, 0.06, 12, 24);
  const startingCoil = new THREE.Mesh(ballastGeo, copperMat);
  startingCoil.name = "Backplate-mounted inductive starting choke";
  startingCoil.position.set(0.72, 2.45, -0.72);
  bracketGroup.add(startingCoil);

  const starterMount = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.08, 0.08), wallBracketMat);
  starterMount.name = "Starting choke mounting strap";
  starterMount.position.set(0.72, 2.45, -0.78);
  bracketGroup.add(starterMount);

  // ==========================================
  // 2. TILTING SUSPENSION CRADLE
  // ==========================================
  const tiltingCradle = new THREE.Group();
  tiltingCradle.name = "Tilting lamp cradle and trunnion";
  tiltingCradle.position.set(0, 1.5, 0);
  tiltingCradle.rotation.z = -0.22;

  const pivotGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.24, 18);
  const centralPivot = new THREE.Mesh(pivotGeo, brassMat);
  centralPivot.name = "Central cradle trunnion anchored to bracket";
  centralPivot.rotation.x = Math.PI / 2;
  centralPivot.position.z = -0.08;
  tiltingCradle.add(centralPivot);

  const cradleRail = new THREE.Mesh(new THREE.BoxGeometry(3.35, 0.08, 0.1), ironMat);
  cradleRail.name = "Continuous lamp support rail";
  cradleRail.position.y = -0.29;
  tiltingCradle.add(cradleRail);

  for (const x of [-1.45, 1.45]) {
    const hanger = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.3, 0.08), ironMat);
    hanger.name = `Cradle end hanger ${x < 0 ? "cathode" : "anode"}`;
    hanger.position.set(x, -0.15, 0);
    tiltingCradle.add(hanger);
  }

  // Starting Tilt Pull Cord / Chain
  const cordGeo = new THREE.CylinderGeometry(0.015, 0.015, 1.55, 8);
  const pullCord = new THREE.Mesh(cordGeo, cordMat);
  pullCord.position.set(-1.55, -1.0, 0);
  tiltingCradle.add(pullCord);

  root.add(tiltingCradle);

  // ==========================================
  // 3. DISCHARGE LAMP ASSEMBLY (Tilted at 15°)
  // ==========================================
  const lampGroup = new THREE.Group();
  lampGroup.name = "Complete discharge tube attached to tilting cradle";
  tiltingCradle.add(lampGroup);

  // Heavy Glass Discharge Tube (1.0m scale in WebGL: 3.2 units)
  const tubeLength = 3.2;
  const tubeRadius = 0.16;
  const tubeGeo = new THREE.CylinderGeometry(tubeRadius, tubeRadius, tubeLength, 24, 1, true);
  const glassTube = new THREE.Mesh(tubeGeo, glassMat);
  glassTube.rotation.z = Math.PI / 2;
  lampGroup.add(glassTube);

  // Internal Glowing Plasma Positive Column
  const plasmaGeo = new THREE.CylinderGeometry(
    tubeRadius * 0.75,
    tubeRadius * 0.75,
    tubeLength * 0.94,
    20,
  );
  const plasmaColumn = new THREE.Mesh(plasmaGeo, plasmaMat);
  plasmaColumn.rotation.z = Math.PI / 2;
  lampGroup.add(plasmaColumn);

  // Plasma Light Source
  const plasmaLight = new THREE.PointLight(0x22d3ee, 3.5, 8.0);
  plasmaLight.position.set(0, 0, 0);
  lampGroup.add(plasmaLight);

  // ==========================================
  // 4. LIQUID MERCURY CATHODE POOL (Left End: x = -1.6)
  // ==========================================
  const cathodeGroup = new THREE.Group();
  cathodeGroup.position.set(-1.6, 0, 0);
  lampGroup.add(cathodeGroup);

  // Liquid Mercury Pool Bulb
  const poolGeo = new THREE.SphereGeometry(0.26, 20, 16);
  const mercuryPoolMesh = new THREE.Mesh(poolGeo, mercuryMat);
  cathodeGroup.add(mercuryPoolMesh);

  // Cathode Spot Emitting Hot Pinpoint
  const spotGeo = new THREE.SphereGeometry(0.06, 12, 12);
  const cathodeSpotMesh = new THREE.Mesh(spotGeo, spotMat);
  cathodeSpotMesh.position.set(0.12, 0.1, 0);
  cathodeGroup.add(cathodeSpotMesh);

  // Brass Cathode Cap & Terminal Lug
  const cap1Geo = new THREE.CylinderGeometry(0.18, 0.18, 0.14, 16);
  const cap1 = new THREE.Mesh(cap1Geo, brassMat);
  cap1.rotation.z = Math.PI / 2;
  cap1.position.set(-0.25, 0, 0);
  cathodeGroup.add(cap1);

  // ==========================================
  // 5. IRON ANODE & CONDENSING GLOBE (Right End: x = 1.6)
  // ==========================================
  const anodeGroup = new THREE.Group();
  anodeGroup.position.set(1.6, 0, 0);
  lampGroup.add(anodeGroup);

  // Solid Iron Anode Plate
  const anodePlateGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 16);
  const anodePlate = new THREE.Mesh(anodePlateGeo, ironMat);
  anodePlate.rotation.z = Math.PI / 2;
  anodePlate.position.set(-0.1, 0, 0);
  anodeGroup.add(anodePlate);

  // Bulbous Glass Condensing Chamber (8 in Fig. 1)
  const globeGeo = new THREE.SphereGeometry(0.48, 24, 20);
  const condensingGlobe = new THREE.Mesh(globeGeo, glassMat);
  condensingGlobe.position.set(0.35, 0.25, 0);
  anodeGroup.add(condensingGlobe);

  // Brass Anode Cap & Suspension Ring
  const cap2Geo = new THREE.CylinderGeometry(0.18, 0.18, 0.14, 16);
  const cap2 = new THREE.Mesh(cap2Geo, brassMat);
  cap2.rotation.z = Math.PI / 2;
  cap2.position.set(0.82, 0.25, 0);
  anodeGroup.add(cap2);

  // The starting choke is fixed to the backplate, while this insulated lead
  // follows the tilted cradle to the cathode terminal. It makes the electrical
  // path legible without pretending that a floating torus is a circuit.
  const cathodeTerminalWorld = new THREE.Vector3(-1.85, 0, 0)
    .applyAxisAngle(new THREE.Vector3(0, 0, 1), tiltingCradle.rotation.z)
    .add(tiltingCradle.position);
  const starterLeadCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.52, 2.45, -0.7),
    new THREE.Vector3(-0.35, 2.25, -0.58),
    new THREE.Vector3(cathodeTerminalWorld.x, cathodeTerminalWorld.y, -0.16),
    cathodeTerminalWorld,
  ]);
  const starterLead = new THREE.Mesh(
    new THREE.TubeGeometry(starterLeadCurve, 36, 0.018, 8, false),
    copperMat,
  );
  starterLead.name = "Starting-choke lead connected to cathode terminal";
  root.add(starterLead);

  // ==========================================
  // 6. CONDENSED MERCURY DROPLETS PARTICLES
  // ==========================================
  const dropCount = 45;
  const dropGeo = new THREE.BufferGeometry();
  const dropPositions = new Float32Array(dropCount * 3);

  for (let i = 0; i < dropCount; i++) {
    const rx = (Math.sin(i * 19.34) * 43758.5453) % 1;
    const ry = (Math.sin(i * 71.12) * 43758.5453) % 1;
    const rz = (Math.sin(i * 43.89) * 43758.5453) % 1;

    dropPositions[i * 3] = -1.4 + Math.abs(rx) * 2.8;
    dropPositions[i * 3 + 1] = -0.1 + (Math.abs(ry) - 0.5) * 0.08;
    dropPositions[i * 3 + 2] = (Math.abs(rz) - 0.5) * 0.12;
  }
  const initialDropPositions = dropPositions.slice();

  dropGeo.setAttribute("position", new THREE.BufferAttribute(dropPositions, 3));
  const dropMat = new THREE.PointsMaterial({
    color: 0xcbd5e1,
    size: 0.04,
    transparent: true,
    opacity: 0.9,
  });
  materials.push(dropMat);

  const dropletParticles = new THREE.Points(dropGeo, dropMat);
  lampGroup.add(dropletParticles);

  const setCutaway = (cutaway: boolean) => {
    glassMat.opacity = cutaway ? 0.08 : 0.45;
    glassMat.needsUpdate = true;
  };

  const dispose = () => {
    const disposedGeometries = new Set<THREE.BufferGeometry>();
    root.traverse((object) => {
      if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
        if (!disposedGeometries.has(object.geometry)) {
          disposedGeometries.add(object.geometry);
          object.geometry.dispose();
        }
      }
    });
    for (const item of materials) item.dispose();
  };

  return {
    root,
    lampGroup,
    glassTube,
    plasmaColumn,
    plasmaLight,
    cathodeSpotMesh,
    mercuryPoolMesh,
    condensingGlobe,
    tiltingCradle,
    pullCord,
    startingCoil,
    dropletParticles,
    initialDropletPositions: initialDropPositions,
    materials,
    setCutaway,
    dispose,
  };
}

export function articulateHewittMercuryLampModel(
  nodes: HewittMercuryLampModelNodes,
  telemetry: {
    arcCurrentAmperes?: number;
    luminousEfficacyLmPerWatt?: number;
    mercuryVaporPressureMmHg?: number;
    arcOperatingVoltageV?: number;
    plasmaFlickerOmegaRadPerS?: number;
    cathodeSpotOmegaXRadPerS?: number;
    cathodeSpotOmegaYRadPerS?: number;
  },
  timeSec: number,
) {
  const arcCurrentAmperes = telemetry.arcCurrentAmperes ?? 3.5;
  const plasmaFlickerOmegaRadPerS = telemetry.plasmaFlickerOmegaRadPerS ?? 377;
  const cathodeSpotOmegaXRadPerS = telemetry.cathodeSpotOmegaXRadPerS ?? 4.0;
  const cathodeSpotOmegaYRadPerS = telemetry.cathodeSpotOmegaYRadPerS ?? 3.5;

  // 1. Plasma Column Emissive Glow & Pulse
  const pMat = nodes.plasmaColumn.material as THREE.MeshStandardMaterial;
  const currentRatio = Math.max(0.2, Math.min(2.0, arcCurrentAmperes / 3.5));
  const flicker = 1.0 + Math.sin(timeSec * plasmaFlickerOmegaRadPerS) * 0.04;

  if (pMat) {
    pMat.emissiveIntensity = 1.8 * currentRatio * flicker;
  }
  nodes.plasmaLight.intensity = 3.5 * currentRatio * flicker;

  // 2. Mobile Cathode Spot Motion
  const spotX = 0.12 + Math.sin(timeSec * cathodeSpotOmegaXRadPerS) * 0.06;
  const spotY = 0.1 + Math.cos(timeSec * cathodeSpotOmegaYRadPerS) * 0.04;
  nodes.cathodeSpotMesh.position.set(spotX, spotY, 0);

  // 3. Trickling mercury droplets along the bottom wall toward the cathode.
  // Derive every position from absolute simulation time and the immutable
  // seeded layout. Incrementing once per rendered frame made playback speed
  // depend on refresh rate and prevented deterministic replay/scrubbing.
  const posAttr = nodes.dropletParticles.geometry.getAttribute("position") as THREE.BufferAttribute;
  const posArr = posAttr.array as Float32Array;
  const count = posArr.length / 3;
  const travelMinX = -1.5;
  const travelSpanX = 3.0;
  const flowSpeedUnitsPerSecond = 0.45;

  for (let i = 0; i < count; i++) {
    const unwrappedX = nodes.initialDropletPositions[i * 3] - flowSpeedUnitsPerSecond * timeSec;
    posArr[i * 3] =
      ((((unwrappedX - travelMinX) % travelSpanX) + travelSpanX) % travelSpanX) + travelMinX;
  }
  posAttr.needsUpdate = true;
}
