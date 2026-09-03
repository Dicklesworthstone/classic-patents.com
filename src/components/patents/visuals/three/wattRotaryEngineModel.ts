/**
 * wattRotaryEngineModel.ts
 *
 * Procedural 3D WebGL model for James Watt's 1781 Sun and Planet Rotary Engine (GB 1306).
 * Built with pure Three.js procedural geometries and PBR materials.
 */

import * as THREE from "three";
import {
  canonicalWattGearRatio,
  WATT_ROTARY_KINEMATIC_GEOMETRY,
  type WattRotaryTelemetry,
} from "@/physics/wattRotaryKernel";

export type WattRotaryPose = Pick<
  WattRotaryTelemetry,
  | "beamAngleDeg"
  | "beamAngleRad"
  | "connectingRodAngleRad"
  | "gearRatioNpOverNs"
  | "leftBeamEndX"
  | "leftBeamEndY"
  | "planetBodyAngleRad"
  | "planetOrbitAngleDeg"
  | "planetOrbitAngleRad"
  | "planetPosX"
  | "planetPosY"
  | "rightBeamEndX"
  | "rightBeamEndY"
  | "sunShaftAngleDeg"
  | "sunShaftAngleRad"
>;

export interface WattGearGeometrySnapshot {
  ratio: number;
  sunPitchRadiusM: number;
  planetPitchRadiusM: number;
  sunTeeth: number;
  planetTeeth: number;
}

export interface WattRotaryModelNodes {
  root: THREE.Group;
  beamGroup: THREE.Group;
  pistonGroup: THREE.Group;
  pistonLinkGroup: THREE.Group;
  connectingRodGroup: THREE.Group;
  sunGearGroup: THREE.Group;
  planetGearGroup: THREE.Group;
  flywheelGroup: THREE.Group;
  radiusLinkGroup: THREE.Group;
  cylinderShellMesh: THREE.Mesh;
  cylinderCutawayMesh: THREE.Mesh;
  calloutSprites: THREE.Sprite[];
  setCutaway: (cutaway: boolean) => void;
  setGearInspection: (inspecting: boolean) => void;
  setShowCallouts: (show: boolean) => void;
  getActiveGearGeometry: () => WattGearGeometrySnapshot;
  updateAnimation: (pose: WattRotaryPose) => void;
  dispose: () => void;
}

export function buildWattRotaryEngineModel(): WattRotaryModelNodes {
  const geometry = WATT_ROTARY_KINEMATIC_GEOMETRY;
  const root = new THREE.Group();
  root.name = "WattRotaryEngineRoot";

  const disposables: Array<{ dispose: () => void }> = [];

  const track = <T extends { dispose: () => void }>(obj: T): T => {
    disposables.push(obj);
    return obj;
  };

  // ==========================================
  // MATERIALS (Cast Iron, Brass, Timber, Masonry)
  // ==========================================
  const castIronMat = track(
    new THREE.MeshStandardMaterial({
      color: 0x38332e,
      roughness: 0.75,
      metalness: 0.65,
    }),
  );

  const polishedIronMat = track(
    new THREE.MeshStandardMaterial({
      color: 0x8c827a,
      roughness: 0.35,
      metalness: 0.85,
    }),
  );

  const sunGearMat = track(
    new THREE.MeshStandardMaterial({
      color: 0xd97706, // Amber golden bronze
      roughness: 0.45,
      metalness: 0.7,
    }),
  );

  const planetGearMat = track(
    new THREE.MeshStandardMaterial({
      color: 0x0284c7, // Sky steel blue
      roughness: 0.45,
      metalness: 0.7,
    }),
  );

  const brassMat = track(
    new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.35,
      metalness: 0.8,
    }),
  );

  const timberMat = track(
    new THREE.MeshStandardMaterial({
      color: 0x5c4033,
      roughness: 0.85,
      metalness: 0.05,
    }),
  );

  const masonryMat = track(
    new THREE.MeshStandardMaterial({
      color: 0x3d352e,
      roughness: 0.95,
      metalness: 0.05,
    }),
  );

  // ==========================================
  // 1. MASONRY PILLAR & FOUNDATION
  // ==========================================
  const baseGeom = track(new THREE.BoxGeometry(7.0, 0.4, 4.0));
  const baseMesh = new THREE.Mesh(baseGeom, masonryMat);
  baseMesh.position.set(0, -0.2, 0);
  root.add(baseMesh);

  // Main Central Pillar supporting Walking Beam
  const pillarGeom = track(new THREE.BoxGeometry(0.8, 3.4, 1.0));
  const pillarMesh = new THREE.Mesh(pillarGeom, masonryMat);
  pillarMesh.position.set(0, 1.5, 0);
  root.add(pillarMesh);

  // Beam Trunnion Bearings (Brass Pillow Blocks)
  const bearingGeom = track(new THREE.CylinderGeometry(0.18, 0.18, 1.2, 16));
  const bearingMesh = new THREE.Mesh(bearingGeom, brassMat);
  bearingMesh.rotation.x = Math.PI / 2;
  bearingMesh.position.set(0, 3.2, 0);
  root.add(bearingMesh);

  // ==========================================
  // 2. STEAM CYLINDER & PISTON (Left Side at X = -2.2)
  // ==========================================
  const cylRadius = 0.55;
  const cylHeight = 2.2;
  const cylPosX = -2.2;

  // Solid Cylinder Outer Shell
  const cylShellGeom = track(new THREE.CylinderGeometry(cylRadius, cylRadius, cylHeight, 24));
  const cylinderShellMesh = new THREE.Mesh(cylShellGeom, castIronMat);
  cylinderShellMesh.position.set(cylPosX, 1.3, 0);
  root.add(cylinderShellMesh);

  // Cutaway Half-Cylinder Mesh (for cutaway mode)
  const cylCutawayGeom = track(
    new THREE.CylinderGeometry(cylRadius, cylRadius, cylHeight, 24, 1, false, 0, Math.PI),
  );
  const cylinderCutawayMesh = new THREE.Mesh(cylCutawayGeom, castIronMat);
  cylinderCutawayMesh.position.set(cylPosX, 1.3, 0);
  cylinderCutawayMesh.visible = false;
  root.add(cylinderCutawayMesh);

  // Cylinder End Flanges
  const flangeGeom = track(new THREE.CylinderGeometry(0.65, 0.65, 0.12, 24));
  const topFlange = new THREE.Mesh(flangeGeom, castIronMat);
  topFlange.position.set(cylPosX, 2.4, 0);
  const bottomFlange = new THREE.Mesh(flangeGeom, castIronMat);
  bottomFlange.position.set(cylPosX, 0.2, 0);
  root.add(topFlange, bottomFlange);

  // Piston Group (moves vertically)
  const pistonGroup = new THREE.Group();
  pistonGroup.position.set(cylPosX, 1.3, 0);

  const pistonDiscGeom = track(new THREE.CylinderGeometry(0.5, 0.5, 0.18, 20));
  const pistonDiscMesh = new THREE.Mesh(pistonDiscGeom, brassMat);
  pistonGroup.add(pistonDiscMesh);

  const pistonRodGeom = track(new THREE.CylinderGeometry(0.06, 0.06, 2.2, 16));
  const pistonRodMesh = new THREE.Mesh(pistonRodGeom, polishedIronMat);
  pistonRodMesh.position.set(0, 1.0, 0);
  pistonGroup.add(pistonRodMesh);
  root.add(pistonGroup);

  // Short flexible attachment between the arched beam head and the vertical
  // piston rod. It closes the visible mechanism while allowing the beam end
  // to follow an arc instead of forcing the piston sideways in its cylinder.
  const pistonLinkGroup = new THREE.Group();
  const pistonLinkGeom = track(new THREE.CylinderGeometry(0.035, 0.035, 1, 10));
  const pistonLinkMesh = new THREE.Mesh(pistonLinkGeom, polishedIronMat);
  pistonLinkGroup.add(pistonLinkMesh);
  root.add(pistonLinkGroup);

  // ==========================================
  // 3. GREAT WALKING BEAM (Pivot at (0, 3.2, 0))
  // ==========================================
  const beamGroup = new THREE.Group();
  beamGroup.position.set(geometry.beamPivotX, geometry.beamPivotY, 0);

  const beamLength = geometry.beamHalfLengthM * 2;
  const beamGeom = track(new THREE.BoxGeometry(beamLength, 0.35, 0.25));
  const beamBody = new THREE.Mesh(beamGeom, timberMat);
  beamGroup.add(beamBody);

  // Beam Truss Iron Straps
  const strapGeom = track(new THREE.BoxGeometry(beamLength + 0.05, 0.38, 0.04));
  const strapMesh = new THREE.Mesh(strapGeom, castIronMat);
  beamGroup.add(strapMesh);

  // Arched Heads (Left & Right)
  const archGeom = track(new THREE.CylinderGeometry(0.35, 0.35, 0.26, 16, 1, false, 0, Math.PI));
  const leftArch = new THREE.Mesh(archGeom, castIronMat);
  leftArch.position.set(-geometry.beamHalfLengthM, 0, 0);
  leftArch.rotation.z = Math.PI / 2;
  const rightArch = new THREE.Mesh(archGeom, castIronMat);
  rightArch.position.set(geometry.beamHalfLengthM, 0, 0);
  rightArch.rotation.z = -Math.PI / 2;
  beamGroup.add(leftArch, rightArch);

  root.add(beamGroup);

  // ==========================================
  // 4. CONNECTING SPEAR / ROD (Suspended from X = 2.2)
  // ==========================================
  const connectingRodGroup = new THREE.Group();
  connectingRodGroup.position.set(
    geometry.beamPivotX + geometry.beamHalfLengthM,
    geometry.beamPivotY,
    0,
  );

  const rodGeom = track(new THREE.CylinderGeometry(0.07, 0.07, geometry.connectingRodLengthM, 16));
  const rodMesh = new THREE.Mesh(rodGeom, polishedIronMat);
  rodMesh.position.set(0, -geometry.connectingRodLengthM / 2, 0);
  connectingRodGroup.add(rodMesh);
  root.add(connectingRodGroup);

  // ==========================================
  // 5. SUN & PLANET EPICYCLIC GEARS & FLYWHEEL (Right side at X = 2.2, Y = 0.9)
  // ==========================================
  const sunPosX = geometry.sunCenterX;
  const sunPosY = geometry.sunCenterY;
  const rOrbit = geometry.gearCenterDistanceM;

  // Central Sun Driveshaft & Bearings
  const shaftGeom = track(new THREE.CylinderGeometry(0.1, 0.1, 2.6, 20));
  const shaftMesh = new THREE.Mesh(shaftGeom, polishedIronMat);
  shaftMesh.rotation.x = Math.PI / 2;
  shaftMesh.position.set(sunPosX, sunPosY, 0.5);
  root.add(shaftMesh);

  // The seven supported gear ratios are discrete, physically compatible gear
  // pairs. Each pair has one module shared by its sun and planet; inactive
  // pairs stay hidden so a ratio change does not allocate during animation.
  const sunGearGroup = new THREE.Group();
  sunGearGroup.position.set(sunPosX, sunPosY, 0);
  const planetGearGroup = new THREE.Group();
  planetGearGroup.position.set(sunPosX, sunPosY - rOrbit, 0);

  const supportedRatios = Array.from(
    {
      length: Math.round((geometry.ratioMax - geometry.ratioMin) / geometry.ratioStep) + 1,
    },
    (_, index) => geometry.ratioMin + index * geometry.ratioStep,
  );

  const createSpurGear = (
    pitchRadius: number,
    toothCount: number,
    material: THREE.MeshStandardMaterial,
    phaseOffset: number,
  ): THREE.Group => {
    const gear = new THREE.Group();
    const module = (2 * pitchRadius) / toothCount;
    const toothDepth = Math.max(0.025, module * 0.72);
    const bodyRadius = pitchRadius - toothDepth * 0.38;
    const discGeom = track(new THREE.CylinderGeometry(bodyRadius, bodyRadius, 0.14, 48));
    const discMesh = new THREE.Mesh(discGeom, material);
    discMesh.rotation.x = Math.PI / 2;
    gear.add(discMesh);

    const toothGeom = track(
      new THREE.BoxGeometry(Math.max(0.018, module * 0.56), toothDepth, 0.15),
    );
    for (let toothIndex = 0; toothIndex < toothCount; toothIndex += 1) {
      const angle = phaseOffset + (toothIndex / toothCount) * Math.PI * 2;
      const tooth = new THREE.Mesh(toothGeom, material);
      const toothCenterRadius = bodyRadius + toothDepth / 2;
      tooth.position.set(
        Math.cos(angle) * toothCenterRadius,
        Math.sin(angle) * toothCenterRadius,
        0,
      );
      tooth.rotation.z = angle - Math.PI / 2;
      gear.add(tooth);
    }
    return gear;
  };

  const gearVariants = supportedRatios.map((rawRatio) => {
    const ratio = canonicalWattGearRatio(rawRatio);
    const sunTeeth = geometry.nominalSunTeeth;
    const planetTeeth = Math.round(sunTeeth * ratio);
    const sunPitchRadiusM = rOrbit / (1 + ratio);
    const planetPitchRadiusM = rOrbit - sunPitchRadiusM;
    const sunNode = createSpurGear(sunPitchRadiusM, sunTeeth, sunGearMat, 0);
    const planetNode = createSpurGear(
      planetPitchRadiusM,
      planetTeeth,
      planetGearMat,
      Math.PI / 2 + Math.PI / planetTeeth,
    );
    sunNode.visible = ratio === 1;
    planetNode.visible = ratio === 1;
    sunGearGroup.add(sunNode);
    planetGearGroup.add(planetNode);
    return {
      ratio,
      sunPitchRadiusM,
      planetPitchRadiusM,
      sunTeeth,
      planetTeeth,
      sunNode,
      planetNode,
    };
  });

  // The centre pin is a bearing attachment. It connects the rod to the
  // planet centre without pretending that the rod is a gear tooth or a
  // stretchy member.
  const planetPinGeom = track(new THREE.CylinderGeometry(0.12, 0.12, 0.22, 20));
  const planetPin = new THREE.Mesh(planetPinGeom, brassMat);
  planetPin.rotation.x = Math.PI / 2;
  planetPin.position.z = 0.02;
  planetGearGroup.add(planetPin);

  root.add(sunGearGroup, planetGearGroup);

  let activeGearVariant = gearVariants.find((variant) => variant.ratio === 1) ?? gearVariants[0];
  const setGearRatio = (rawRatio: number) => {
    const ratio = canonicalWattGearRatio(rawRatio);
    const next =
      gearVariants.find((variant) => Math.abs(variant.ratio - ratio) < 1e-9) ?? gearVariants[0];
    if (next === activeGearVariant) return;
    activeGearVariant.sunNode.visible = false;
    activeGearVariant.planetNode.visible = false;
    next.sunNode.visible = true;
    next.planetNode.visible = true;
    activeGearVariant = next;
  };

  const getActiveGearGeometry = (): WattGearGeometrySnapshot => ({
    ratio: activeGearVariant.ratio,
    sunPitchRadiusM: activeGearVariant.sunPitchRadiusM,
    planetPitchRadiusM: activeGearVariant.planetPitchRadiusM,
    sunTeeth: activeGearVariant.sunTeeth,
    planetTeeth: activeGearVariant.planetTeeth,
  });

  // Radius Guide Link connecting Sun Center to Planet Center
  const radiusLinkGroup = new THREE.Group();
  radiusLinkGroup.position.set(sunPosX, sunPosY, 0);

  const linkBarGeom = track(new THREE.BoxGeometry(0.08, rOrbit, 0.05));
  const linkBarMesh = new THREE.Mesh(linkBarGeom, brassMat);
  linkBarMesh.position.set(0, -rOrbit / 2, 0.12);
  radiusLinkGroup.add(linkBarMesh);

  const linkHubGeom = track(new THREE.CylinderGeometry(0.12, 0.12, 0.08, 16));
  const sunHub = new THREE.Mesh(linkHubGeom, brassMat);
  sunHub.rotation.x = Math.PI / 2;
  sunHub.position.set(0, 0, 0.12);
  const planetHub = new THREE.Mesh(linkHubGeom, brassMat);
  planetHub.rotation.x = Math.PI / 2;
  planetHub.position.set(0, -rOrbit, 0.12);
  radiusLinkGroup.add(sunHub, planetHub);

  root.add(radiusLinkGroup);

  // Massive 6-Spoke Flywheel (at Z = 1.4)
  const flywheelGroup = new THREE.Group();
  flywheelGroup.position.set(sunPosX, sunPosY, 1.4);

  const rimGeom = track(new THREE.TorusGeometry(1.8, 0.14, 16, 40));
  const rimMesh = new THREE.Mesh(rimGeom, castIronMat);
  flywheelGroup.add(rimMesh);

  // 6 Spokes
  const spokeGeom = track(new THREE.CylinderGeometry(0.06, 0.06, 3.6, 12));
  for (let i = 0; i < 3; i++) {
    const spoke = new THREE.Mesh(spokeGeom, castIronMat);
    spoke.rotation.z = (i * Math.PI) / 3;
    flywheelGroup.add(spoke);
  }
  root.add(flywheelGroup);

  // ==========================================
  // 6. CALLOUT SPRITES
  // ==========================================
  const calloutDefinitions = [
    { text: "A: Walking Beam", pos: [0, 3.7, 0] },
    { text: "B: Connecting Rod", pos: [2.5, 2.2, 0] },
    { text: "C: Planet Gear", pos: [2.9, 0.3, 0] },
    { text: "D: Sun Gear", pos: [1.7, 0.9, 0] },
    { text: "E: Flywheel", pos: [2.2, 2.6, 1.4] },
    { text: "F: Steam Cylinder", pos: [-2.2, 2.7, 0] },
    { text: "G: Radius Link", pos: [2.2, 0.5, 0.3] },
    { text: "H: Masonry Pillar", pos: [0, 1.2, 0.6] },
    { text: "I: Trunnion Bearings", pos: [0, 3.3, 0.7] },
    { text: "J: Driveshaft", pos: [2.2, 0.9, 1.8] },
  ];

  function createTextSprite(message: string): THREE.Sprite {
    if (typeof document === "undefined") {
      const spriteMat = track(new THREE.SpriteMaterial({ depthTest: false }));
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(0.8, 0.2, 1);
      return sprite;
    }

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "rgba(10, 10, 12, 0.85)";
      ctx.strokeStyle = "#e7e5e4";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(4, 4, 248, 56, 10);
      ctx.fill();
      ctx.stroke();

      ctx.font = "bold 24px monospace";
      ctx.fillStyle = "#fef08a";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(message, 128, 32);
    }
    const texture = track(new THREE.CanvasTexture(canvas));
    const spriteMat = track(new THREE.SpriteMaterial({ map: texture, depthTest: false }));
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(0.8, 0.2, 1);
    return sprite;
  }

  const calloutSprites: THREE.Sprite[] = [];
  for (const item of calloutDefinitions) {
    const sprite = createTextSprite(item.text);
    sprite.position.set(item.pos[0], item.pos[1], item.pos[2]);
    root.add(sprite);
    calloutSprites.push(sprite);
  }

  let calloutsRequested = true;
  let gearInspectionActive = false;
  const applyCalloutVisibility = () => {
    for (const sprite of calloutSprites) {
      sprite.visible = calloutsRequested && !gearInspectionActive;
    }
  };

  // ==========================================
  // CONTROLLER METHODS
  // ==========================================
  const setCutaway = (cutaway: boolean) => {
    cylinderShellMesh.visible = !cutaway;
    cylinderCutawayMesh.visible = cutaway;
  };

  const setGearInspection = (inspecting: boolean) => {
    // The Gear Mesh camera is an explicitly labeled inspection presentation:
    // leave the source-driven gears and their shaft state intact, while
    // temporarily removing the flywheel and labels that otherwise mask their mesh.
    gearInspectionActive = inspecting;
    flywheelGroup.visible = !inspecting;
    applyCalloutVisibility();
  };

  const setShowCallouts = (show: boolean) => {
    calloutsRequested = show;
    applyCalloutVisibility();
  };

  const updateAnimation = (pose: WattRotaryPose) => {
    setGearRatio(pose.gearRatioNpOverNs);
    beamGroup.rotation.z = pose.beamAngleRad;

    pistonGroup.position.set(cylPosX, pose.leftBeamEndY - 2, 0);
    const pistonRodTopX = cylPosX;
    const pistonRodTopY = pistonGroup.position.y + 2.1;
    const pistonLinkDx = pistonRodTopX - pose.leftBeamEndX;
    const pistonLinkDy = pistonRodTopY - pose.leftBeamEndY;
    const pistonLinkLength = Math.max(0.001, Math.hypot(pistonLinkDx, pistonLinkDy));
    pistonLinkGroup.position.set(
      (pose.leftBeamEndX + pistonRodTopX) / 2,
      (pose.leftBeamEndY + pistonRodTopY) / 2,
      0,
    );
    pistonLinkGroup.rotation.z = Math.atan2(-pistonLinkDx, pistonLinkDy);
    pistonLinkGroup.scale.set(1, pistonLinkLength, 1);

    const planetX = sunPosX + pose.planetPosX;
    const planetY = sunPosY + pose.planetPosY;
    planetGearGroup.position.set(planetX, planetY, 0);

    // This is a fixed-length member: animation may translate and rotate it,
    // but never stretch it to conceal a closure error.
    connectingRodGroup.position.set(pose.rightBeamEndX, pose.rightBeamEndY, 0);
    connectingRodGroup.rotation.z = pose.connectingRodAngleRad;
    connectingRodGroup.scale.set(1, 1, 1);

    // The planet centre orbits while the restrained wheel keeps its fixed
    // orientation; the spear only positions the bearing at its centre.
    planetGearGroup.rotation.z = pose.planetBodyAngleRad;

    // Radius link guide bar pivots at sun center and rotates with phase
    radiusLinkGroup.rotation.z = pose.planetOrbitAngleRad;

    // Both keyed bodies consume the exact shaft angle authored by the kernel.
    sunGearGroup.rotation.z = pose.sunShaftAngleRad;
    flywheelGroup.rotation.z = pose.sunShaftAngleRad;

    // Dynamic labels stay attached to the assemblies they identify.
    calloutSprites[1]?.position.set(
      (pose.rightBeamEndX + planetX) / 2 + 0.25,
      (pose.rightBeamEndY + planetY) / 2,
      0,
    );
    calloutSprites[2]?.position.set(planetX + 0.45, planetY, 0);
    calloutSprites[6]?.position.set((sunPosX + planetX) / 2, (sunPosY + planetY) / 2, 0.3);
  };

  const dispose = () => {
    for (const item of disposables) {
      item.dispose();
    }
  };

  return {
    root,
    beamGroup,
    pistonGroup,
    pistonLinkGroup,
    connectingRodGroup,
    sunGearGroup,
    planetGearGroup,
    flywheelGroup,
    radiusLinkGroup,
    cylinderShellMesh,
    cylinderCutawayMesh,
    calloutSprites,
    setCutaway,
    setGearInspection,
    setShowCallouts,
    getActiveGearGeometry,
    updateAnimation,
    dispose,
  };
}
