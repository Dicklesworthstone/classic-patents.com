import * as THREE from "three";
import { fourStrokeCycle, stepOttoEngine } from "@/physics/catalogKernels";
import { heatFrames, sampleHeatAt } from "@/physics/genericWasm";
import {
  OTTO_MODEL_CONNECTING_ROD_LENGTH,
  OTTO_MODEL_CRANK_RADIUS,
  type OttoMechanismPose,
} from "@/physics/ottoKernel";

export interface OttoEngineModelNodes {
  root: THREE.Group;
  // Reciprocating kinematics
  pistonGroup: THREE.Group;
  pistonMesh: THREE.Mesh;
  wristPin: THREE.Mesh;
  connectingRod: THREE.Group;
  crankshaftGroup: THREE.Group;
  crankPin: THREE.Mesh;
  leftFlywheel: THREE.Group;
  rightFlywheel: THREE.Group;
  // 2:1 Side shaft / Camshaft
  sideShaftGroup: THREE.Group;
  slideValvePlate: THREE.Group;
  slideValveEccentricPin: THREE.Mesh;
  slideValveEccentricRod: THREE.Mesh;
  exhaustCam: THREE.Mesh;
  exhaustRockerArm: THREE.Group;
  exhaustValveStem: THREE.Mesh;
  exhaustValveLink: THREE.Mesh;
  exhaustCamFollower: THREE.Mesh;
  governorSpindle: THREE.Group;
  governorBallLeft: THREE.Mesh;
  governorBallRight: THREE.Mesh;
  governorArmLeft: THREE.Mesh;
  governorArmRight: THREE.Mesh;
  governorSleeve: THREE.Mesh;
  // Gas & Flame
  pilotFlameMesh: THREE.Mesh;
  combustionVolumeMesh: THREE.Mesh;
  cylinderJacketMesh: THREE.Mesh;
  cylinderCutawayMesh: THREE.Mesh;
}

export interface OttoEngineMaterials {
  castIron: THREE.MeshStandardMaterial;
  darkIron: THREE.MeshStandardMaterial;
  polishedSteel: THREE.MeshStandardMaterial;
  bearingBronze: THREE.MeshStandardMaterial;
  brass: THREE.MeshStandardMaterial;
  paintedGreen: THREE.MeshStandardMaterial;
  combustionGas: THREE.MeshStandardMaterial;
  pilotFlame: THREE.MeshBasicMaterial;
  copperPipe: THREE.MeshStandardMaterial;
}

export interface OttoEngineModelResult {
  root: THREE.Group;
  nodes: OttoEngineModelNodes;
  materials: OttoEngineMaterials;
  connectivityReceipt: () => readonly { interface: string; gapMeters: number }[];
  dispose: () => void;
}

// The patent drawing is not dimensioned. These are explicit display-scale
// reconstruction units shared with the fs-mbd topology and the 2D reduction.
export const OTTO_CRANK_RADIUS = OTTO_MODEL_CRANK_RADIUS;
export const OTTO_CONNECTING_ROD_LENGTH = OTTO_MODEL_CONNECTING_ROD_LENGTH;
export const OTTO_CYLINDER_BORE = 1.1; // Diameter
export const OTTO_STROKE = OTTO_CRANK_RADIUS * 2; // 1.3 units
export const OTTO_PISTON_LENGTH = 1.4;
export const OTTO_STUDIO_FLOOR_Y = -4.5;
const OTTO_FOOT_BOTTOM_Y = -1.575;
export const OTTO_STUDIO_FLOOR_OFFSET_Y = OTTO_STUDIO_FLOOR_Y - OTTO_FOOT_BOTTOM_Y;
const UNIT_Y = new THREE.Vector3(0, 1, 0);

function seatUnitCylinderBetween(mesh: THREE.Mesh, start: THREE.Vector3, end: THREE.Vector3): void {
  const delta = end.clone().sub(start);
  const length = delta.length();
  if (!Number.isFinite(length) || length <= 1e-12) {
    throw new RangeError("Otto display linkage endpoints must be distinct and finite");
  }
  mesh.position.copy(start).add(end).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(UNIT_Y, delta.multiplyScalar(1 / length));
  mesh.scale.set(1, length, 1);
}

function segmentEndpointsWorld(mesh: THREE.Mesh): readonly [THREE.Vector3, THREE.Vector3] {
  return [
    mesh.localToWorld(new THREE.Vector3(0, -0.5, 0)),
    mesh.localToWorld(new THREE.Vector3(0, 0.5, 0)),
  ];
}

export function ottoCombustionFlamePresentation(
  crankAngleRad: number,
  running: boolean,
  cutawayMode: boolean,
): { strokeIndex: number; visible: boolean; opacity: number; scale: number } {
  const cycleAngle = ((crankAngleRad % (4 * Math.PI)) + 4 * Math.PI) % (4 * Math.PI);
  const strokeIndex = Math.min(3, Math.floor(cycleAngle / Math.PI));
  const powerPhase = strokeIndex === 2 ? (cycleAngle - 2 * Math.PI) / Math.PI : 0;
  const pulse = strokeIndex === 2 ? Math.max(0, Math.sin(powerPhase * Math.PI)) : 0;
  const visible = running && cutawayMode && strokeIndex === 2;
  return {
    strokeIndex,
    visible,
    opacity: visible ? pulse * 0.8 : 0,
    scale: 1 + (visible ? pulse * 0.5 : 0),
  };
}

export function buildOttoEngineModel(): OttoEngineModelResult {
  const root = new THREE.Group();
  root.position.y = OTTO_STUDIO_FLOOR_OFFSET_Y;
  const disposableGeometries: THREE.BufferGeometry[] = [];
  const disposableMaterials: THREE.Material[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(geo: T): T => {
    disposableGeometries.push(geo);
    return geo;
  };
  const trackMat = <T extends THREE.Material>(mat: T): T => {
    disposableMaterials.push(mat);
    return mat;
  };

  // Authentic 1870s Deutz Engine Materials
  const materials: OttoEngineMaterials = {
    castIron: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x24282f,
        roughness: 0.7,
        metalness: 0.65,
      }),
    ),
    darkIron: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x181c22,
        roughness: 0.8,
        metalness: 0.5,
      }),
    ),
    polishedSteel: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.18,
        metalness: 0.95,
      }),
    ),
    bearingBronze: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xcd7f32,
        roughness: 0.28,
        metalness: 0.85,
      }),
    ),
    brass: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        roughness: 0.22,
        metalness: 0.9,
      }),
    ),
    paintedGreen: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x1b3b2b, // Historic Deutz dark engine green
        roughness: 0.45,
        metalness: 0.4,
      }),
    ),
    combustionGas: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.4,
        roughness: 0.1,
        metalness: 0.1,
        emissive: 0x0284c7,
        emissiveIntensity: 0.3,
        side: THREE.DoubleSide,
      }),
    ),
    pilotFlame: trackMat(
      new THREE.MeshBasicMaterial({
        color: 0xff7700,
        transparent: true,
        opacity: 0.85,
      }),
    ),
    copperPipe: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xb87333,
        roughness: 0.3,
        metalness: 0.9,
      }),
    ),
  };

  // -------------------------------------------------------------
  // 1. Cast-Iron Engine Bedplate & Crosshead Guides
  // -------------------------------------------------------------
  const bedplateGroup = new THREE.Group();
  root.add(bedplateGroup);

  // Main foundation box
  const baseBox = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(7.2, 0.7, 2.8)),
    materials.paintedGreen,
  );
  baseBox.position.set(0, -1.2, 0);
  baseBox.castShadow = true;
  baseBox.receiveShadow = true;
  bedplateGroup.add(baseBox);

  // Flared foot flanges
  const footFlange = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(7.6, 0.15, 3.2)),
    materials.castIron,
  );
  footFlange.position.set(0, -1.5, 0);
  footFlange.name = "Engine foundation foot seated on studio floor";
  footFlange.receiveShadow = true;
  bedplateGroup.add(footFlange);

  // Foundation anchor bolts (8 studs)
  const boltPositions = [
    [-3.5, 1.4],
    [-3.5, -1.4],
    [-1.2, 1.4],
    [-1.2, -1.4],
    [1.2, 1.4],
    [1.2, -1.4],
    [3.5, 1.4],
    [3.5, -1.4],
  ];
  for (const [bx, bz] of boltPositions) {
    const bolt = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.04, 0.04, 0.25, 8)),
      materials.polishedSteel,
    );
    bolt.position.set(bx, -1.4, bz);
    bedplateGroup.add(bolt);
  }

  // Raised Main Bearing Pedestals (Crankshaft Journals)
  const crankCenterX = 2.4;
  [-1.1, 1.1].forEach((pz) => {
    const pedestal = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.9, 1.1, 0.45)),
      materials.paintedGreen,
    );
    pedestal.position.set(crankCenterX, -0.4, pz);
    pedestal.castShadow = true;
    bedplateGroup.add(pedestal);

    // Bronze split bearing brasses
    const brassCap = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.22, 0.22, 0.46, 16)),
      materials.bearingBronze,
    );
    brassCap.rotation.x = Math.PI / 2;
    brassCap.position.set(crankCenterX, 0.05, pz);
    bedplateGroup.add(brassCap);

    // Heavy iron bearing cap
    const ironCap = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.7, 0.25, 0.46)),
      materials.castIron,
    );
    ironCap.position.set(crankCenterX, 0.25, pz);
    bedplateGroup.add(ironCap);
  });

  // -------------------------------------------------------------
  // 2. Water-Jacketed Horizontal Cylinder & Cylinder Head
  // -------------------------------------------------------------
  const cylinderCenterY = 0.0;
  const cylinderLength = 3.2;
  const cylinderOriginX = -1.6; // Rear head is at -3.2, front open bore at 0.0

  // Water Jacket Casting (Outer Barrel)
  const cylinderJacketMesh = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.85, 0.85, cylinderLength, 32)),
    materials.paintedGreen,
  );
  cylinderJacketMesh.rotation.z = Math.PI / 2;
  cylinderJacketMesh.position.set(cylinderOriginX, cylinderCenterY, 0);
  cylinderJacketMesh.castShadow = true;
  root.add(cylinderJacketMesh);

  // Cutaway Cylinder Mesh (Semi-transparent with interior liner exposed)
  const cylinderCutawayMesh = new THREE.Mesh(
    trackGeo(
      new THREE.CylinderGeometry(0.85, 0.85, cylinderLength, 32, 1, false, 0, (Math.PI * 3) / 2),
    ),
    materials.castIron,
  );
  cylinderCutawayMesh.rotation.z = Math.PI / 2;
  cylinderCutawayMesh.rotation.x = Math.PI / 2;
  cylinderCutawayMesh.position.set(cylinderOriginX, cylinderCenterY, 0);
  cylinderCutawayMesh.visible = false;
  root.add(cylinderCutawayMesh);

  // Cylinder Head (Combustion chamber endplate at -3.2)
  const cylinderHead = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.95, 0.95, 0.35, 32)),
    materials.castIron,
  );
  cylinderHead.rotation.z = Math.PI / 2;
  cylinderHead.position.set(-3.25, cylinderCenterY, 0);
  cylinderHead.castShadow = true;
  root.add(cylinderHead);

  // Head Studs (8 radial nuts)
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4;
    const nut = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.04, 0.04, 0.15, 6)),
      materials.polishedSteel,
    );
    nut.rotation.z = Math.PI / 2;
    nut.position.set(-3.45, Math.cos(angle) * 0.75, Math.sin(angle) * 0.75);
    root.add(nut);
  }

  // Cooling Water Pipes & Spigots
  const waterInlet = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.06, 0.06, 0.62, 12)),
    materials.copperPipe,
  );
  waterInlet.name = "Cylinder-to-bed cooling-water inlet";
  waterInlet.position.set(-2.6, -0.9, 0.6);
  root.add(waterInlet);

  const waterOutlet = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.06, 0.06, 0.5, 12)),
    materials.copperPipe,
  );
  waterOutlet.position.set(-1.0, 0.9, 0);
  root.add(waterOutlet);

  // Dynamic In-Cylinder Combustion Gas Volume (Visual indicator of 4-stroke cycle)
  const combustionVolumeMesh = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.55, 0.55, 1.8, 24)),
    materials.combustionGas,
  );
  combustionVolumeMesh.rotation.z = Math.PI / 2;
  combustionVolumeMesh.position.set(-2.3, cylinderCenterY, 0);
  root.add(combustionVolumeMesh);

  // -------------------------------------------------------------
  // 3. Trunk Piston & Internal Compression Rings
  // -------------------------------------------------------------
  const pistonGroup = new THREE.Group();
  root.add(pistonGroup);

  // Trunk piston body (hollow skirt, closed crown)
  const pistonMesh = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.56, 0.56, OTTO_PISTON_LENGTH, 28)),
    materials.polishedSteel,
  );
  pistonMesh.rotation.z = Math.PI / 2;
  pistonMesh.castShadow = true;
  pistonGroup.add(pistonMesh);

  // 3 Compression Rings on Piston Crown
  [-0.55, -0.45, -0.35].forEach((rx) => {
    const ring = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(0.565, 0.015, 8, 28)),
      materials.darkIron,
    );
    ring.rotation.y = Math.PI / 2;
    ring.position.set(rx, 0, 0);
    pistonGroup.add(ring);
  });

  // Hardened Gudgeon Pin (Wrist Pin)
  const wristPin = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.09, 0.09, 0.95, 16)),
    materials.polishedSteel,
  );
  // The connecting-rod small end is seated at the piston-group origin. Keep
  // the visible gudgeon pin on that same physical axis.
  wristPin.position.set(0, 0, 0);
  pistonGroup.add(wristPin);

  // -------------------------------------------------------------
  // 4. Connecting Rod & Big-End Crank Bearing
  // -------------------------------------------------------------
  const connectingRod = new THREE.Group();
  root.add(connectingRod);

  // I-Beam rod shank
  const rodShank = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(OTTO_CONNECTING_ROD_LENGTH, 0.16, 0.1)),
    materials.polishedSteel,
  );
  rodShank.position.set(OTTO_CONNECTING_ROD_LENGTH / 2, 0, 0);
  rodShank.castShadow = true;
  connectingRod.add(rodShank);

  // Small-End Bronze Bushing (at wristpin)
  const smallEnd = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.14, 0.14, 0.28, 16)),
    materials.bearingBronze,
  );
  connectingRod.add(smallEnd);

  // Split Marine Big-End Bearing (at crankpin)
  const bigEndGroup = new THREE.Group();
  bigEndGroup.position.set(OTTO_CONNECTING_ROD_LENGTH, 0, 0);
  connectingRod.add(bigEndGroup);

  const bigEndBronze = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.2, 0.2, 0.35, 16)),
    materials.bearingBronze,
  );
  bigEndGroup.add(bigEndBronze);

  const bigEndCap = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.36, 0.45, 0.36)),
    materials.polishedSteel,
  );
  bigEndGroup.add(bigEndCap);

  // -------------------------------------------------------------
  // 5. Crankshaft, Crank Throw & Twin Heavy Flywheels
  // -------------------------------------------------------------
  const crankshaftGroup = new THREE.Group();
  crankshaftGroup.position.set(crankCenterX, cylinderCenterY, 0);
  root.add(crankshaftGroup);

  // Main Shaft Journal
  const mainShaft = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.12, 0.12, 3.4, 24)),
    materials.polishedSteel,
  );
  mainShaft.rotation.x = Math.PI / 2;
  crankshaftGroup.add(mainShaft);

  // Counterweighted Crank Webs
  const crankWeb1 = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.25, 1.2, 0.2)),
    materials.polishedSteel,
  );
  crankWeb1.position.set(0, 0.1, -0.3);
  crankshaftGroup.add(crankWeb1);

  const crankWeb2 = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.25, 1.2, 0.2)),
    materials.polishedSteel,
  );
  crankWeb2.position.set(0, 0.1, 0.3);
  crankshaftGroup.add(crankWeb2);

  // Crank Pin (Connects rod big end)
  const crankPin = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.11, 0.11, 0.4, 16)),
    materials.polishedSteel,
  );
  crankPin.rotation.x = Math.PI / 2;
  // The kernel defines theta=0 on +X. The pin must use the same local axis so
  // rotating crankshaftGroup seats the visible pin in the rod's big end.
  crankPin.position.set(OTTO_CRANK_RADIUS, 0, 0);
  crankshaftGroup.add(crankPin);

  // Spiral Bevel Driving Gear (Crankshaft Side)
  const crankBevelGear = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.22, 0.18, 0.18, 20)),
    materials.brass,
  );
  crankBevelGear.rotation.x = Math.PI / 2;
  crankBevelGear.position.set(0, 0, 0.8);
  crankshaftGroup.add(crankBevelGear);

  // Twin 6-Spoke 1877 Heavy Cast-Iron Flywheels
  const buildFlywheel = (zPos: number): THREE.Group => {
    const fwGroup = new THREE.Group();
    fwGroup.position.set(0, 0, zPos);

    // Heavy Outer Rim (High moment of inertia)
    const rim = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(2.1, 0.22, 16, 48)),
      materials.paintedGreen,
    );
    rim.castShadow = true;
    fwGroup.add(rim);

    // Machined Rim Face (for flat belt takeoff)
    const beltTire = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(2.32, 2.32, 0.38, 48, 1, true)),
      materials.polishedSteel,
    );
    beltTire.rotation.x = Math.PI / 2;
    fwGroup.add(beltTire);

    // Central Keyed Hub
    const hub = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.32, 0.32, 0.42, 20)),
      materials.castIron,
    );
    hub.rotation.x = Math.PI / 2;
    fwGroup.add(hub);

    // 6 S-Curved Tapered Spokes
    for (let s = 0; s < 6; s++) {
      const spokeAngle = (s * Math.PI) / 3;
      const spoke = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.06, 0.1, 1.9, 12)),
        materials.castIron,
      );
      spoke.position.set(Math.cos(spokeAngle) * 0.95, Math.sin(spokeAngle) * 0.95, 0);
      spoke.rotation.z = spokeAngle + Math.PI / 2;
      fwGroup.add(spoke);
    }

    return fwGroup;
  };

  const leftFlywheel = buildFlywheel(-1.5);
  const rightFlywheel = buildFlywheel(1.5);
  crankshaftGroup.add(leftFlywheel);
  crankshaftGroup.add(rightFlywheel);

  // -------------------------------------------------------------
  // 6. The 2:1 Reduction Lay Shaft (Camshaft) & Bevel Gears
  // -------------------------------------------------------------
  const sideShaftGroup = new THREE.Group();
  sideShaftGroup.position.set(0, cylinderCenterY + 0.55, 1.25);
  root.add(sideShaftGroup);

  // Longitudinal Steel Shaft running from crank to cylinder head
  const layShaft = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.06, 0.06, 5.8, 16)),
    materials.polishedSteel,
  );
  layShaft.rotation.z = Math.PI / 2;
  layShaft.position.set(-0.5, 0, 0);
  sideShaftGroup.add(layShaft);

  // Three bed-mounted pedestals carry the complete counter-shaft/cam train.
  // Their top faces meet the shaft centerline instead of leaving it airborne.
  for (const [index, supportX] of [-2.6, -0.4, 1.8].entries()) {
    const support = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.22, 1.4, 0.35)),
      materials.paintedGreen,
    );
    support.name = `Counter-shaft bed support ${index + 1}`;
    support.position.set(supportX, -0.15, 1.25);
    root.add(support);
  }

  // Driven Bevel Gear (2:1 ratio - twice the diameter of crank gear)
  const layBevelGear = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.44, 0.38, 0.18, 24)),
    materials.brass,
  );
  layBevelGear.rotation.z = Math.PI / 2;
  layBevelGear.position.set(crankCenterX, 0, 0);
  sideShaftGroup.add(layBevelGear);

  // Slide Valve Driving Eccentric & Crank Pin
  const slideEccentric = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.18, 0.18, 0.12, 16)),
    materials.castIron,
  );
  slideEccentric.rotation.z = Math.PI / 2;
  slideEccentric.position.set(-3.2, 0, 0);
  sideShaftGroup.add(slideEccentric);

  // Exhaust Cam Lobe
  const exhaustCam = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.16, 0.26, 0.14, 16)),
    materials.polishedSteel,
  );
  exhaustCam.rotation.z = Math.PI / 2;
  exhaustCam.position.set(-2.5, 0, 0);
  exhaustCam.name = "Half-speed exhaust cam";
  sideShaftGroup.add(exhaustCam);

  const slideValveEccentricPin = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.07, 0.07, 0.16, 16)),
    materials.bearingBronze,
  );
  slideValveEccentricPin.name = "Slide-valve eccentric pin";
  slideValveEccentricPin.rotation.z = Math.PI / 2;
  slideValveEccentricPin.position.set(-3.2, 0.16, 0);
  sideShaftGroup.add(slideValveEccentricPin);

  // -------------------------------------------------------------
  // 7. Reciprocating Slide Valve & External Flame Pocket Ignition
  // -------------------------------------------------------------
  const slideValveChest = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.7, 0.9, 0.5)),
    materials.castIron,
  );
  slideValveChest.position.set(-3.45, cylinderCenterY + 0.1, 0.7);
  root.add(slideValveChest);

  // Reciprocating Slide Valve Plate
  const slideValvePlate = new THREE.Group();
  slideValvePlate.position.set(-3.45, cylinderCenterY + 0.1, 0.7);
  root.add(slideValvePlate);

  const valveSlider = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.5, 0.65, 0.15)),
    materials.brass,
  );
  slideValvePlate.add(valveSlider);

  // Internal Flame Pocket Cavity
  const flamePocket = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.06, 0.06, 0.12, 12)),
    materials.darkIron,
  );
  flamePocket.position.set(0, 0, -0.05);
  slideValvePlate.add(flamePocket);

  // Slide Valve Eccentric Rod Linkage
  const slideValveEccentricRod = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.035, 0.035, 1, 12)),
    materials.polishedSteel,
  );
  slideValveEccentricRod.name = "Eccentric-pin-to-slide-valve link";
  root.add(slideValveEccentricRod);
  seatUnitCylinderBetween(
    slideValveEccentricRod,
    new THREE.Vector3(-3.2, cylinderCenterY + 0.71, 1.25),
    slideValvePlate.position,
  );

  // External Town-Gas Pilot Flame Chimney
  const pilotChimney = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.08, 0.08, 0.4, 12)),
    materials.brass,
  );
  pilotChimney.position.set(-3.45, cylinderCenterY + 0.65, 0.85);
  root.add(pilotChimney);

  const pilotFlameMesh = new THREE.Mesh(
    trackGeo(new THREE.ConeGeometry(0.06, 0.2, 8)),
    materials.pilotFlame,
  );
  pilotFlameMesh.position.set(-3.45, cylinderCenterY + 0.9, 0.85);
  root.add(pilotFlameMesh);

  // -------------------------------------------------------------
  // 8. Centrifugal Flyball Governor and Gas-Metering Linkage
  // -------------------------------------------------------------
  const governorGroup = new THREE.Group();
  governorGroup.position.set(-1.2, cylinderCenterY + 0.55, 1.25);
  root.add(governorGroup);

  // Vertical governor spindle driven by bevel gears
  const governorSpindle = new THREE.Group();
  governorGroup.add(governorSpindle);

  const govShaft = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.03, 0.03, 0.9, 12)),
    materials.polishedSteel,
  );
  govShaft.position.set(0, 0.45, 0);
  governorSpindle.add(govShaft);

  // Twin Flyballs on Hinged Brass Arms
  const governorBallLeft = new THREE.Mesh(
    trackGeo(new THREE.SphereGeometry(0.09, 16, 16)),
    materials.brass,
  );
  governorBallLeft.position.set(-0.22, 0.6, 0);
  governorSpindle.add(governorBallLeft);

  const governorBallRight = new THREE.Mesh(
    trackGeo(new THREE.SphereGeometry(0.09, 16, 16)),
    materials.brass,
  );
  governorBallRight.position.set(0.22, 0.6, 0);
  governorSpindle.add(governorBallRight);

  const governorArmLeft = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.018, 0.018, 1, 10)),
    materials.brass,
  );
  governorArmLeft.name = "Left governor flyball arm";
  governorSpindle.add(governorArmLeft);
  const governorArmRight = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.018, 0.018, 1, 10)),
    materials.brass,
  );
  governorArmRight.name = "Right governor flyball arm";
  governorSpindle.add(governorArmRight);
  const governorArmPivot = new THREE.Vector3(0, 0.2, 0);
  seatUnitCylinderBetween(governorArmLeft, governorArmPivot, governorBallLeft.position);
  seatUnitCylinderBetween(governorArmRight, governorArmPivot, governorBallRight.position);

  // Sliding Collar / Sleeve
  const governorSleeve = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.07, 0.07, 0.12, 12)),
    materials.bearingBronze,
  );
  governorSleeve.position.set(0, 0.35, 0);
  governorGroup.add(governorSleeve);

  // -------------------------------------------------------------
  // 9. Exhaust Poppet Valve, Rocker Arm & Exhaust Pipe
  // -------------------------------------------------------------
  const exhaustChest = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.6, 0.6, 0.5)),
    materials.castIron,
  );
  exhaustChest.position.set(-2.5, cylinderCenterY - 0.7, 0);
  root.add(exhaustChest);

  const exhaustPipe = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.12, 0.12, 0.575, 16)),
    materials.castIron,
  );
  exhaustPipe.position.set(-2.5, -1.2875, 0);
  root.add(exhaustPipe);

  // Exhaust Valve Spindle
  const exhaustValveStem = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.03, 0.03, 0.45, 8)),
    materials.polishedSteel,
  );
  exhaustValveStem.position.set(-2.5, cylinderCenterY - 0.35, 0.45);
  root.add(exhaustValveStem);

  const exhaustValveGuide = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.18, 0.38, 0.24)),
    materials.bearingBronze,
  );
  exhaustValveGuide.name = "Exhaust-chest valve-stem guide";
  exhaustValveGuide.position.set(-2.5, cylinderCenterY - 0.35, 0.32);
  root.add(exhaustValveGuide);

  // Rocker Arm Pivot & Lever
  const exhaustRockerArm = new THREE.Group();
  exhaustRockerArm.position.set(-2.5, cylinderCenterY - 0.05, 0.65);
  root.add(exhaustRockerArm);

  const rockerLever = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.06, 0.08, 0.65)),
    materials.polishedSteel,
  );
  rockerLever.name = "Exhaust rocker lever";
  exhaustRockerArm.add(rockerLever);

  const exhaustValveLink = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.025, 0.025, 1, 10)),
    materials.polishedSteel,
  );
  exhaustValveLink.name = "Rocker-to-exhaust-valve link";
  root.add(exhaustValveLink);
  seatUnitCylinderBetween(
    exhaustValveLink,
    new THREE.Vector3(-2.5, -0.05, 0.325),
    new THREE.Vector3(-2.5, -0.125, 0.45),
  );

  const exhaustCamFollower = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.025, 0.025, 1, 10)),
    materials.polishedSteel,
  );
  exhaustCamFollower.name = "Exhaust-cam-to-rocker follower";
  root.add(exhaustCamFollower);
  seatUnitCylinderBetween(
    exhaustCamFollower,
    new THREE.Vector3(-2.5, -0.05, 0.975),
    new THREE.Vector3(-2.5, 0.55, 1.25),
  );

  const nodes: OttoEngineModelNodes = {
    root,
    pistonGroup,
    pistonMesh,
    wristPin,
    connectingRod,
    crankshaftGroup,
    crankPin,
    leftFlywheel,
    rightFlywheel,
    sideShaftGroup,
    slideValvePlate,
    slideValveEccentricPin,
    slideValveEccentricRod,
    exhaustCam,
    exhaustRockerArm,
    exhaustValveStem,
    exhaustValveLink,
    exhaustCamFollower,
    governorSpindle,
    governorBallLeft,
    governorBallRight,
    governorArmLeft,
    governorArmRight,
    governorSleeve,
    pilotFlameMesh,
    combustionVolumeMesh,
    cylinderJacketMesh,
    cylinderCutawayMesh,
  };

  const connectivityReceipt = () => {
    root.updateMatrixWorld(true);
    const [slideRodStart, slideRodEnd] = segmentEndpointsWorld(slideValveEccentricRod);
    const [leftArmStart, leftArmEnd] = segmentEndpointsWorld(governorArmLeft);
    const [rightArmStart, rightArmEnd] = segmentEndpointsWorld(governorArmRight);
    const [valveLinkStart, valveLinkEnd] = segmentEndpointsWorld(exhaustValveLink);
    const [camFollowerStart, camFollowerEnd] = segmentEndpointsWorld(exhaustCamFollower);
    const rockerLow = exhaustRockerArm.localToWorld(new THREE.Vector3(0, 0, -0.325));
    const rockerHigh = exhaustRockerArm.localToWorld(new THREE.Vector3(0, 0, 0.325));
    return [
      {
        interface: "slide eccentric pin / connecting link",
        gapMeters: slideRodStart.distanceTo(
          slideValveEccentricPin.getWorldPosition(new THREE.Vector3()),
        ),
      },
      {
        interface: "connecting link / slide valve",
        gapMeters: slideRodEnd.distanceTo(slideValvePlate.getWorldPosition(new THREE.Vector3())),
      },
      {
        interface: "governor spindle / left flyball arm",
        gapMeters: leftArmStart.distanceTo(
          governorSpindle.localToWorld(new THREE.Vector3(0, 0.2, 0)),
        ),
      },
      {
        interface: "left flyball arm / ball",
        gapMeters: leftArmEnd.distanceTo(governorBallLeft.getWorldPosition(new THREE.Vector3())),
      },
      {
        interface: "governor spindle / right flyball arm",
        gapMeters: rightArmStart.distanceTo(
          governorSpindle.localToWorld(new THREE.Vector3(0, 0.2, 0)),
        ),
      },
      {
        interface: "right flyball arm / ball",
        gapMeters: rightArmEnd.distanceTo(governorBallRight.getWorldPosition(new THREE.Vector3())),
      },
      {
        interface: "exhaust rocker / valve link",
        gapMeters: valveLinkStart.distanceTo(rockerLow),
      },
      {
        interface: "exhaust rocker / cam follower",
        gapMeters: camFollowerStart.distanceTo(rockerHigh),
      },
      {
        interface: "cam follower / half-speed exhaust cam",
        gapMeters: camFollowerEnd.distanceTo(exhaustCam.getWorldPosition(new THREE.Vector3())),
      },
      {
        interface: "valve link / exhaust valve stem",
        gapMeters: valveLinkEnd.distanceTo(
          exhaustValveStem.localToWorld(new THREE.Vector3(0, 0.225, 0)),
        ),
      },
    ] as const;
  };

  const dispose = () => {
    for (const g of disposableGeometries) {
      g.dispose();
    }
    for (const m of disposableMaterials) {
      m.dispose();
    }
  };

  return { root, nodes, materials, connectivityReceipt, dispose };
}

/**
 * Updates full 4-stroke kinematic state, slide valve, lay shaft, and thermodynamic combustion tint.
 * crankAngle is continuous radians (2 revs = 4pi rad for complete 4-stroke cycle).
 */
export function updateOttoEngineKinematics(
  nodes: OttoEngineModelNodes,
  materials: OttoEngineMaterials,
  pose: OttoMechanismPose,
  compressionRatio: number,
  cutawayMode: boolean,
  running: boolean,
  dt: number,
  govDisplayOmegaRadPerS: number,
  engineRpm = 180,
) {
  const cycleAngle = pose.cycleAngleRad;
  const mechanicalCrankAngle = Math.atan2(pose.crankPinY, pose.crankPinX);
  // 1. Crankshaft & Twin Flywheels Rotation
  nodes.crankshaftGroup.rotation.z = mechanicalCrankAngle;

  // 2. The fs-mbd pose is already a closed slider-crank solve. Offset its
  // shaft-relative coordinates to the model's one fixed crank center.
  const crankCenterX = 2.4;
  const pistonWristX = crankCenterX + pose.pistonPinX;

  nodes.pistonGroup.position.set(pistonWristX, 0, 0);

  // 3. Seat the rod's modeled small and big ends on the two kernel pins.
  nodes.connectingRod.position.set(pistonWristX, 0, 0);
  nodes.connectingRod.rotation.z = pose.connectingRodAngleRad;

  // 4. 2:1 Lay Shaft (Camshaft) Half-Speed Rotation
  const otto = stepOttoEngine({ engineRpm, compressionRatio });
  const cycle = fourStrokeCycle(cycleAngle);
  const camAngle = pose.sideShaftAngleRad;
  nodes.sideShaftGroup.rotation.x = camAngle;

  // 5. Slide Valve Reciprocation (Driven by Lay Shaft Eccentric)
  const slideOffset = pose.slideValveNormalized * otto.slideStroke;
  nodes.slideValvePlate.position.x = otto.slideHomeX + slideOffset;
  const eccentricRadius = 0.16;
  const eccentricPin = new THREE.Vector3(
    -3.2,
    0.55 + Math.cos(camAngle) * eccentricRadius,
    1.25 + Math.sin(camAngle) * eccentricRadius,
  );
  seatUnitCylinderBetween(
    nodes.slideValveEccentricRod,
    eccentricPin,
    nodes.slideValvePlate.position,
  );

  // 6. Exhaust Valve & Rocker Arm (Opens during Exhaust Stroke 540-720 deg)
  const cyclePhase = cycle.cyclePhaseRad;
  const exhaustLift = pose.exhaustLiftNormalized * otto.exhaustLiftAmp;

  nodes.exhaustValveStem.position.y = otto.exhaustValveHomeY - exhaustLift;
  nodes.exhaustRockerArm.rotation.x = -exhaustLift * otto.exhaustRockerCoupling;
  const rockerAngle = nodes.exhaustRockerArm.rotation.x;
  const rockerEndpoint = (localZ: number) =>
    new THREE.Vector3(
      nodes.exhaustRockerArm.position.x,
      nodes.exhaustRockerArm.position.y - localZ * Math.sin(rockerAngle),
      nodes.exhaustRockerArm.position.z + localZ * Math.cos(rockerAngle),
    );
  seatUnitCylinderBetween(
    nodes.exhaustValveLink,
    rockerEndpoint(-0.325),
    new THREE.Vector3(
      nodes.exhaustValveStem.position.x,
      nodes.exhaustValveStem.position.y + 0.225,
      nodes.exhaustValveStem.position.z,
    ),
  );
  seatUnitCylinderBetween(
    nodes.exhaustCamFollower,
    rockerEndpoint(0.325),
    new THREE.Vector3(-2.5, 0.55, 1.25),
  );

  // 7. Centrifugal Flyball Governor Kinematics
  if (running) {
    nodes.governorSpindle.rotation.y += govDisplayOmegaRadPerS * dt;
  }
  // A stopped governor has no centrifugal spread. Always write the absolute
  // ball and sleeve pose so pausing cannot freeze them improbably in mid-air.
  // The topology owns running spread; this is only a display-scale mapping.
  const governorMaxDisplayRadius = 0.33;
  const displayedSpread = running ? pose.governorSpreadNormalized : 0;
  const kernelFlyballRadius =
    otto.sleeveRadius0 + displayedSpread * (governorMaxDisplayRadius - otto.sleeveRadius0);
  nodes.governorBallLeft.position.x = -kernelFlyballRadius;
  nodes.governorBallRight.position.x = kernelFlyballRadius;
  const governorArmPivot = new THREE.Vector3(0, 0.2, 0);
  seatUnitCylinderBetween(nodes.governorArmLeft, governorArmPivot, nodes.governorBallLeft.position);
  seatUnitCylinderBetween(
    nodes.governorArmRight,
    governorArmPivot,
    nodes.governorBallRight.position,
  );
  nodes.governorSleeve.position.y =
    otto.sleeveHomeY + (kernelFlyballRadius - otto.sleeveRadius0) * otto.sleeveCoupling;

  // 8. Cutaway Visibility
  nodes.cylinderJacketMesh.visible = !cutawayMode;
  nodes.cylinderCutawayMesh.visible = cutawayMode;

  // 9. Thermodynamic 4-Stroke Gas Volume Color & Luminance
  const pistonCrownX = pistonWristX - OTTO_PISTON_LENGTH / 2;
  const gasLength = Math.max(otto.gasMinLength, pistonCrownX - otto.cylinderTdcX);
  nodes.combustionVolumeMesh.scale.set(1, gasLength / otto.combustionLengthRef, 1);
  nodes.combustionVolumeMesh.position.x = otto.cylinderTdcX + gasLength / 2;

  const heat = heatFrames(12, 16, 2);
  const localHeat =
    1 + Math.abs(sampleHeatAt(heat, 12, 16, 8, cycle.cyclePhaseRad / (Math.PI * 2), 0.45));

  if (cycle.strokeIndex === 0) {
    // INTAKE
    materials.combustionGas.color.setHex(otto.intakeGasColor);
    materials.combustionGas.emissive.setHex(otto.intakeGasEmissive);
    materials.combustionGas.emissiveIntensity = otto.intakeEmissive * localHeat;
    materials.combustionGas.opacity = otto.intakeOpacity;
  } else if (cycle.strokeIndex === 1) {
    // COMPRESSION
    const compFraction = (cyclePhase - cycle.strokeRad) / cycle.strokeRad;
    materials.combustionGas.color.setHex(otto.compressionGasColor);
    materials.combustionGas.emissive.setHex(otto.compressionGasEmissive);
    materials.combustionGas.emissiveIntensity =
      (otto.compressionEmissive0 + compFraction * otto.compressionEmissiveAmp) * localHeat;
    materials.combustionGas.opacity =
      otto.compressionOpacity0 + compFraction * otto.compressionOpacityAmp;
  } else if (cycle.strokeIndex === 2) {
    // POWER (Expansion & Combustion)
    const expFraction = (cyclePhase - cycle.powerStartRad) / cycle.strokeRad;
    const intensity = Math.max(otto.expansionMin, 1 - expFraction * otto.expansionFade);
    materials.combustionGas.color.setHex(otto.powerGasColor);
    materials.combustionGas.emissive.setHex(otto.powerGasEmissive);
    materials.combustionGas.emissiveIntensity = otto.expansionEmissive0 * intensity * localHeat;
    materials.combustionGas.opacity = otto.expansionOpacity0 * intensity;
  } else {
    // EXHAUST
    materials.combustionGas.color.setHex(otto.exhaustGasColor);
    materials.combustionGas.emissive.setHex(otto.exhaustGasEmissive);
    materials.combustionGas.emissiveIntensity = otto.exhaustEmissive * localHeat;
    materials.combustionGas.opacity = otto.exhaustOpacity;
  }
}
