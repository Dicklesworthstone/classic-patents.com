/**
 * wattRotaryEngineModel.ts
 *
 * Procedural 3D WebGL model for James Watt's 1781 Sun and Planet Rotary Engine (GB 1306).
 * Built with pure Three.js procedural geometries and PBR materials.
 */

import * as THREE from "three";

export type WattRotaryPose = {
  beamAngleDeg: number;
  planetOrbitAngleDeg: number;
  sunShaftAngleDeg: number;
};

export interface WattRotaryModelNodes {
  root: THREE.Group;
  beamGroup: THREE.Group;
  pistonGroup: THREE.Group;
  connectingRodGroup: THREE.Group;
  sunGearGroup: THREE.Group;
  planetGearGroup: THREE.Group;
  flywheelGroup: THREE.Group;
  radiusLinkGroup: THREE.Group;
  cylinderShellMesh: THREE.Mesh;
  cylinderCutawayMesh: THREE.Mesh;
  calloutSprites: THREE.Sprite[];
  setCutaway: (cutaway: boolean) => void;
  setShowCallouts: (show: boolean) => void;
  updateAnimation: (pose: WattRotaryPose) => void;
  dispose: () => void;
}

export function buildWattRotaryEngineModel(): WattRotaryModelNodes {
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

  // ==========================================
  // 3. GREAT WALKING BEAM (Pivot at (0, 3.2, 0))
  // ==========================================
  const beamGroup = new THREE.Group();
  beamGroup.position.set(0, 3.2, 0);

  const beamLength = 4.4;
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
  leftArch.position.set(-2.2, 0, 0);
  leftArch.rotation.z = Math.PI / 2;
  const rightArch = new THREE.Mesh(archGeom, castIronMat);
  rightArch.position.set(2.2, 0, 0);
  rightArch.rotation.z = -Math.PI / 2;
  beamGroup.add(leftArch, rightArch);

  root.add(beamGroup);

  // ==========================================
  // 4. CONNECTING SPEAR / ROD (Suspended from X = 2.2)
  // ==========================================
  const connectingRodGroup = new THREE.Group();
  connectingRodGroup.position.set(2.2, 3.2, 0);

  const rodGeom = track(new THREE.CylinderGeometry(0.07, 0.07, 2.8, 16));
  const rodMesh = new THREE.Mesh(rodGeom, polishedIronMat);
  rodMesh.position.set(0, -1.4, 0);
  connectingRodGroup.add(rodMesh);
  root.add(connectingRodGroup);

  // ==========================================
  // 5. SUN & PLANET EPICYCLIC GEARS & FLYWHEEL (Right side at X = 2.2, Y = 0.9)
  // ==========================================
  const sunPosX = 2.2;
  const sunPosY = 0.9;
  const rSun = 0.45;
  const rPlanet = 0.45;
  const rOrbit = rSun + rPlanet; // 0.9 m

  // Central Sun Driveshaft & Bearings
  const shaftGeom = track(new THREE.CylinderGeometry(0.1, 0.1, 2.6, 20));
  const shaftMesh = new THREE.Mesh(shaftGeom, polishedIronMat);
  shaftMesh.rotation.x = Math.PI / 2;
  shaftMesh.position.set(sunPosX, sunPosY, 0.5);
  root.add(shaftMesh);

  // Sun Gear Group (rotates on shaft axis Z)
  const sunGearGroup = new THREE.Group();
  sunGearGroup.position.set(sunPosX, sunPosY, 0);

  const sunDiscGeom = track(new THREE.CylinderGeometry(rSun, rSun, 0.14, 32));
  const sunDiscMesh = new THREE.Mesh(sunDiscGeom, sunGearMat);
  sunDiscMesh.rotation.x = Math.PI / 2;
  sunGearGroup.add(sunDiscMesh);

  // Sun Gear Teeth
  const toothGeom = track(new THREE.BoxGeometry(0.05, 0.08, 0.15));
  for (let i = 0; i < 20; i++) {
    const ang = (i / 20) * Math.PI * 2;
    const tooth = new THREE.Mesh(toothGeom, sunGearMat);
    tooth.position.set(Math.cos(ang) * rSun, Math.sin(ang) * rSun, 0);
    tooth.rotation.z = ang;
    sunGearGroup.add(tooth);
  }
  root.add(sunGearGroup);

  // Planet Gear Group (orbits around Sun, orientation fixed by connecting rod)
  const planetGearGroup = new THREE.Group();
  planetGearGroup.position.set(sunPosX, sunPosY - rOrbit, 0);

  const planetDiscGeom = track(new THREE.CylinderGeometry(rPlanet, rPlanet, 0.14, 32));
  const planetDiscMesh = new THREE.Mesh(planetDiscGeom, planetGearMat);
  planetDiscMesh.rotation.x = Math.PI / 2;
  planetGearGroup.add(planetDiscMesh);

  // Planet Gear Teeth
  for (let i = 0; i < 20; i++) {
    const ang = (i / 20) * Math.PI * 2;
    const tooth = new THREE.Mesh(toothGeom, planetGearMat);
    tooth.position.set(Math.cos(ang) * rPlanet, Math.sin(ang) * rPlanet, 0);
    tooth.rotation.z = ang;
    planetGearGroup.add(tooth);
  }

  // Rigid mounting bracket connecting Planet to Connecting Rod
  const bracketGeom = track(new THREE.BoxGeometry(0.16, 0.6, 0.16));
  const bracketMesh = new THREE.Mesh(bracketGeom, castIronMat);
  bracketMesh.position.set(0, 0.3, 0);
  planetGearGroup.add(bracketMesh);

  root.add(planetGearGroup);

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
      const spriteMat = new THREE.SpriteMaterial({ depthTest: false });
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
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture, depthTest: false });
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

  // ==========================================
  // CONTROLLER METHODS
  // ==========================================
  const setCutaway = (cutaway: boolean) => {
    cylinderShellMesh.visible = !cutaway;
    cylinderCutawayMesh.visible = cutaway;
  };

  const setShowCallouts = (show: boolean) => {
    for (const sprite of calloutSprites) {
      sprite.visible = show;
    }
  };

  const updateAnimation = (pose: WattRotaryPose) => {
    const beamAngle = (pose.beamAngleDeg * Math.PI) / 180;
    const phase = (pose.planetOrbitAngleDeg * Math.PI) / 180;
    const sunAngle = -((pose.sunShaftAngleDeg * Math.PI) / 180);

    beamGroup.rotation.z = beamAngle;
    pistonGroup.position.y = 1.3 - beamAngle * 2.2;

    const planetX = sunPosX + rOrbit * Math.sin(phase);
    const planetY = sunPosY - rOrbit * Math.cos(phase);
    planetGearGroup.position.set(planetX, planetY, 0);

    const rightBeamEndX = Math.cos(beamAngle) * 2.2;
    const rightBeamEndY = 3.2 + Math.sin(beamAngle) * 2.2;
    connectingRodGroup.position.set(rightBeamEndX, rightBeamEndY, 0);
    const rodDx = planetX - rightBeamEndX;
    const rodDy = planetY - rightBeamEndY;
    connectingRodGroup.rotation.z = Math.atan2(rodDx, -rodDy);

    radiusLinkGroup.rotation.z = -phase;
    sunGearGroup.rotation.z = sunAngle;
    flywheelGroup.rotation.z = sunAngle;
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
    connectingRodGroup,
    sunGearGroup,
    planetGearGroup,
    flywheelGroup,
    radiusLinkGroup,
    cylinderShellMesh,
    cylinderCutawayMesh,
    calloutSprites,
    setCutaway,
    setShowCallouts,
    updateAnimation,
    dispose,
  };
}
