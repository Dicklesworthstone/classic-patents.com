"use client";

import { Compass, Play, Wind } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createGlowPointTexture, createThreeStudioScene } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { FLYER_DIM, buildWrightFlyerAirframe } from "./wrightFlyerAirframe";

export function WrightFlyer3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Aerodynamic State Controls
  const [wingWarpDeg, setWingWarpDeg] = useState<number>(8); // -15 to +15 deg
  const [rudderYawDeg, setRudderYawDeg] = useState<number>(4); // -25 to +25 deg
  const [elevatorPitchDeg, setElevatorPitchDeg] = useState<number>(5); // -15 to +15 deg
  const [airspeedMph, setAirspeedMph] = useState<number>(28); // 15 to 45 mph
  const [showStreamlines, setShowStreamlines] = useState<boolean>(true);
  const [showVectors, setShowVectors] = useState<boolean>(true);
  const [isAutoFlying, setIsAutoFlying] = useState<boolean>(true);
  const [isCoupled, setIsCoupled] = useState<boolean>(true);
  const [showMuseumScan, setShowMuseumScan] = useState<boolean>(false);

  // Aerodynamic Physics Calculations
  const airspeedFps = (airspeedMph * 5280) / 3600;
  const dynamicPressure = 0.5 * 0.002377 * airspeedFps * airspeedFps; // q = 1/2 rho V^2 (slugs/ft^3)
  const wingAreaSqFt = 510; // 1903 Flyer wing area
  const baseCl = 0.45 + elevatorPitchDeg * 0.04;
  const totalLiftLbs = Math.round(dynamicPressure * wingAreaSqFt * Math.max(0.1, baseCl));

  // Induced Drag: C_Di = C_L^2 / (pi * AR * e)
  const aspectratio = 6.2;
  const oswaldEfficiency = 0.75;
  const cdInduced = (baseCl * baseCl) / (Math.PI * aspectratio * oswaldEfficiency);
  const cdParasite = 0.045;
  const totalDragLbs = Math.round(dynamicPressure * wingAreaSqFt * (cdParasite + cdInduced));

  // Positive warp = more right-wing AoA. Extra right induced drag yaws the nose left (negative).
  // Positive rudder = starboard, producing positive (right) yaw that cancels adverse yaw.
  const speedRatio = airspeedMph / 30;
  const adverseYawMomentFtLbs = Math.round(-wingWarpDeg * 12.5 * speedRatio);
  const rudderCorrectiveMomentFtLbs = Math.round(rudderYawDeg * 28.0 * speedRatio);
  const netYawMoment = adverseYawMomentFtLbs + rudderCorrectiveMomentFtLbs;

  const live = useLiveSimParams({
    wingWarpDeg,
    rudderYawDeg,
    elevatorPitchDeg,
    airspeedMph,
    showStreamlines,
    showVectors,
    isAutoFlying,
    baseCl,
    totalLiftLbs,
    totalDragLbs,
    showMuseumScan,
  });

  const applyWarp = (val: number) => {
    setWingWarpDeg(val);
    if (isCoupled) {
      setRudderYawDeg(Math.round(val * 0.45));
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create Studio Scene with Museum Lighting
    const studio = createThreeStudioScene({
      container,
      cameraPos: [7.6, 3.2, 8.4],
      targetPos: [0, 0.15, 0],
      fov: 38,
    });

    const { scene, camera, renderer, controls } = studio;
    controls.setRadius(11);

    const airframe = buildWrightFlyerAirframe();
    const flyerGroup = airframe.group;
    scene.add(flyerGroup);

    const {
      upperWing,
      lowerWing,
      canardGroup,
      rudderGroup,
      leftPropBlades,
      rightPropBlades,
    } = airframe;

    const scanGroup = new THREE.Group();
    scanGroup.visible = false;
    scene.add(scanGroup);
    void import("three/addons/loaders/STLLoader.js").then(({ STLLoader }) => {
      const loader = new STLLoader();
      loader.load("/models/wright-flyer/smithsonian-nasm-1903-flyer.cc0.stl", (geo) => {
        geo.computeVertexNormals();
        geo.center();
        geo.computeBoundingBox();
        const box = geo.boundingBox;
        if (box) {
          const size = new THREE.Vector3();
          box.getSize(size);
          const longest = Math.max(size.x, size.y, size.z);
          if (longest > 0) {
            geo.scale(FLYER_DIM.span / longest, FLYER_DIM.span / longest, FLYER_DIM.span / longest);
          }
        }
        const mesh = new THREE.Mesh(
          geo,
          new THREE.MeshStandardMaterial({
            color: 0xe7d8b8,
            roughness: 0.72,
            metalness: 0.04,
          }),
        );
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        scanGroup.add(mesh);
      });
    });

    // Dimensions: 40ft span (14 units), 6.5ft chord (2.6 units), 6ft gap (2.3 units)
    const spanUnits = 14;
    const chordUnits = 2.6;
    const gapUnits = 2.3;

    // Helper: Create a Cambered Airfoil Section (1-in-20 Wright parabolic camber)
    const createAirfoilShape = (chord: number, maxCamber: number, thickness: number) => {
      const shape = new THREE.Shape();
      const numPts = 24;
      const ptsUpper: THREE.Vector2[] = [];
      const ptsLower: THREE.Vector2[] = [];

      for (let i = 0; i <= numPts; i++) {
        const x = (i / numPts) * chord; // 0 to chord (leading edge to trailing edge)
        const xNorm = x / chord;
        // Parabolic camber equation
        const camber = 4 * maxCamber * xNorm * (1 - xNorm);
        // Thickness distribution tapering to trailing edge
        const thick = 0.5 * thickness * (1 - xNorm) * Math.sqrt(Math.max(0, xNorm));

        ptsUpper.push(new THREE.Vector2(x - chord / 2, camber + thick));
        ptsLower.push(new THREE.Vector2(x - chord / 2, camber - thick));
      }

      // Start at leading edge
      shape.moveTo(ptsUpper[0].x, ptsUpper[0].y);
      for (let i = 1; i <= numPts; i++) {
        shape.lineTo(ptsUpper[i].x, ptsUpper[i].y);
      }
      for (let i = numPts; i >= 0; i--) {
        shape.lineTo(ptsLower[i].x, ptsLower[i].y);
      }
      shape.closePath();
      return shape;
    };

    const airfoilShape = createAirfoilShape(chordUnits, 0.14, 0.12);
    const extrudeSettings = { depth: 1, bevelEnabled: false, steps: 1 };

    // Helper: Create a Cambered Wing Panel with Spruce Rib Battens
    const createWingPanel = (width: number, isLeftTip = false, isRightTip = false) => {
      const panelGroup = new THREE.Group();

      // Fabric Skin
      const geom = new THREE.ExtrudeGeometry(airfoilShape, {
        ...extrudeSettings,
        depth: width,
      });
      geom.center();
      // Rotate so chord is along Z axis and width is along X axis
      geom.rotateY(Math.PI / 2);

      const fabricMesh = new THREE.Mesh(geom, wingFabricMat);
      fabricMesh.castShadow = true;
      fabricMesh.receiveShadow = true;
      panelGroup.add(fabricMesh);

      // Spruce Rib Battens across the panel
      const numRibs = Math.max(3, Math.floor(width / 0.65));
      const ribMat = spruceWoodMat;
      for (let r = 0; r <= numRibs; r++) {
        const ribX = -width / 2 + (r * width) / numRibs;
        const ribMesh = new THREE.Mesh(
          new THREE.BoxGeometry(0.04, 0.045, chordUnits * 0.98),
          ribMat,
        );
        ribMesh.position.set(ribX, 0.08, 0);
        panelGroup.add(ribMesh);
      }

      // Front Bullnose Spar & Rear Spar
      const frontSpar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.045, width, 8),
        spruceWoodMat,
      );
      frontSpar.rotation.z = Math.PI / 2;
      frontSpar.position.set(0, 0.02, chordUnits / 2 - 0.1);
      panelGroup.add(frontSpar);

      const rearSpar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, width, 8),
        spruceWoodMat,
      );
      rearSpar.rotation.z = Math.PI / 2;
      rearSpar.position.set(0, 0.02, -chordUnits / 2 + 0.15);
      panelGroup.add(rearSpar);

      // Curved Elliptical Wingtip Bow
      if (isLeftTip || isRightTip) {
        const tipBowGeo = new THREE.TorusGeometry(chordUnits * 0.48, 0.04, 8, 16, Math.PI);
        const tipBow = new THREE.Mesh(tipBowGeo, spruceWoodMat);
        tipBow.rotation.x = Math.PI / 2;
        tipBow.rotation.z = isLeftTip ? Math.PI / 2 : -Math.PI / 2;
        tipBow.position.set(isLeftTip ? -width / 2 : width / 2, 0.04, 0);
        panelGroup.add(tipBow);
      }

      return panelGroup;
    };

    // Upper and Lower Wings with Articulated Wing Warping Tips
    const createWingSurface = (isUpper: boolean) => {
      const wingG = new THREE.Group();
      wingG.position.y = isUpper ? gapUnits / 2 : -gapUnits / 2;

      // Center Wing Section (Rigid)
      const centerWidth = spanUnits * 0.44;
      const centerMesh = createWingPanel(centerWidth);
      wingG.add(centerMesh);

      // Left Wing Tip (Articulated for Wing Warping)
      const tipWidth = spanUnits * 0.28;
      const leftTipGroup = new THREE.Group();
      leftTipGroup.position.set(-centerWidth / 2 - tipWidth / 2, 0, 0);
      const leftTipMesh = createWingPanel(tipWidth, true, false);
      leftTipMesh.name = "leftTip";
      leftTipGroup.add(leftTipMesh);
      wingG.add(leftTipGroup);

      // Right Wing Tip (Articulated for Wing Warping)
      const rightTipGroup = new THREE.Group();
      rightTipGroup.position.set(centerWidth / 2 + tipWidth / 2, 0, 0);
      const rightTipMesh = createWingPanel(tipWidth, false, true);
      rightTipMesh.name = "rightTip";
      rightTipGroup.add(rightTipMesh);
      wingG.add(rightTipGroup);

      return wingG;
    };

    const upperWing = createWingSurface(true);
    const lowerWing = createWingSurface(false);
    flyerGroup.add(upperWing);
    flyerGroup.add(lowerWing);

    // --- STREAMLINED INTERPLANE STRUTS & TRUSS BRACING WIRES ---
    const strutPositionsX = [
      -spanUnits * 0.48,
      -spanUnits * 0.24,
      0,
      spanUnits * 0.24,
      spanUnits * 0.48,
    ];
    const wirePositions: number[] = [];

    strutPositionsX.forEach((xPos, idx) => {
      // Front Strut (Teardrop profile)
      const fStrut = new THREE.Mesh(new THREE.BoxGeometry(0.06, gapUnits, 0.12), spruceWoodMat);
      fStrut.position.set(xPos, 0, chordUnits / 2 - 0.2);
      fStrut.castShadow = true;
      flyerGroup.add(fStrut);

      // Rear Strut
      const rStrut = new THREE.Mesh(new THREE.BoxGeometry(0.06, gapUnits, 0.12), spruceWoodMat);
      rStrut.position.set(xPos, 0, -chordUnits / 2 + 0.2);
      rStrut.castShadow = true;
      flyerGroup.add(rStrut);

      // Diagonal Truss Bracing Wires across bays
      if (idx < strutPositionsX.length - 1) {
        const nextX = strutPositionsX[idx + 1];
        const yTop = gapUnits / 2;
        const yBot = -gapUnits / 2;
        const zFront = chordUnits / 2 - 0.2;
        const zRear = -chordUnits / 2 + 0.2;

        // Front Bay X-bracing
        wirePositions.push(xPos, yTop, zFront, nextX, yBot, zFront);
        wirePositions.push(xPos, yBot, zFront, nextX, yTop, zFront);
        // Rear Bay X-bracing
        wirePositions.push(xPos, yTop, zRear, nextX, yBot, zRear);
        wirePositions.push(xPos, yBot, zRear, nextX, yTop, zRear);
        // Fore-Aft Diagonal Strut Bracing
        wirePositions.push(xPos, yTop, zFront, xPos, yBot, zRear);
        wirePositions.push(xPos, yBot, zFront, xPos, yTop, zRear);
      }
    });

    const wireGeo = new THREE.BufferGeometry();
    wireGeo.setAttribute("position", new THREE.Float32BufferAttribute(wirePositions, 3));
    const wireLines = new THREE.LineSegments(wireGeo, steelWireMat);
    flyerGroup.add(wireLines);

    // --- STEAM-BENT ASH LANDING SKIDS (RUNNERS) ---
    const createLandingSkid = (xPos: number) => {
      const skidGroup = new THREE.Group();
      skidGroup.position.set(xPos, -gapUnits / 2 - 0.45, 0);

      // Horizontal runner rail
      const railGeo = new THREE.BoxGeometry(0.09, 0.08, chordUnits + 1.8);
      const rail = new THREE.Mesh(railGeo, ashSkidMat);
      rail.castShadow = true;
      skidGroup.add(rail);

      // Upward-curved forward bow
      const bowGeo = new THREE.TorusGeometry(1.2, 0.045, 8, 16, Math.PI / 3);
      const bow = new THREE.Mesh(bowGeo, ashSkidMat);
      bow.rotation.y = Math.PI / 2;
      bow.position.set(0, 0.5, chordUnits / 2 + 0.9);
      skidGroup.add(bow);

      // Vertical Skid Uprights to Lower Wing
      const u1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.45, 6), spruceWoodMat);
      u1.position.set(0, 0.22, chordUnits / 2 - 0.2);
      skidGroup.add(u1);
      const u2 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.45, 6), spruceWoodMat);
      u2.position.set(0, 0.22, -chordUnits / 2 + 0.2);
      skidGroup.add(u2);

      return skidGroup;
    };

    const leftSkid = createLandingSkid(-1.2);
    const rightSkid = createLandingSkid(1.2);
    flyerGroup.add(leftSkid);
    flyerGroup.add(rightSkid);

    // --- FORWARD CANARD ELEVATOR (Pitch Control Stabilizer) ---
    const canardGroup = new THREE.Group();
    canardGroup.position.set(0, 0, chordUnits + 3.4);

    const canardSpan = 5.2;
    const canardChord = 1.3;
    const canardGap = 0.9;

    const canardUpper = createWingPanel(canardSpan);
    canardUpper.position.y = canardGap / 2;
    canardUpper.scale.set(1, 0.8, canardChord / chordUnits);
    const canardLower = createWingPanel(canardSpan);
    canardLower.position.y = -canardGap / 2;
    canardLower.scale.set(1, 0.8, canardChord / chordUnits);
    canardGroup.add(canardUpper);
    canardGroup.add(canardLower);

    // Canard Interplane End Struts
    [-canardSpan * 0.45, canardSpan * 0.45].forEach((cx) => {
      const cStrutF = new THREE.Mesh(
        new THREE.CylinderGeometry(0.035, 0.035, canardGap, 6),
        spruceWoodMat,
      );
      cStrutF.position.set(cx, 0, canardChord / 2 - 0.1);
      canardGroup.add(cStrutF);
      const cStrutR = new THREE.Mesh(
        new THREE.CylinderGeometry(0.035, 0.035, canardGap, 6),
        spruceWoodMat,
      );
      cStrutR.position.set(cx, 0, -canardChord / 2 + 0.1);
      canardGroup.add(cStrutR);
    });

    // Forward Outrigger Booms to Canard
    [-1.2, 1.2].forEach((ox) => {
      const outrigger = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.045, 3.8, 6),
        spruceWoodMat,
      );
      outrigger.rotation.x = Math.PI / 2;
      outrigger.position.set(ox, -gapUnits / 4, chordUnits / 2 + 1.7);
      flyerGroup.add(outrigger);
    });
    flyerGroup.add(canardGroup);

    // --- REAR TWIN VERTICAL RUDDER (Coupled Yaw Control) ---
    const rudderGroup = new THREE.Group();
    rudderGroup.position.set(0, 0, -chordUnits - 3.4);

    const rudderV1 = createWingPanel(2.4);
    rudderV1.rotation.z = Math.PI / 2;
    rudderV1.position.x = -0.85;
    rudderV1.scale.set(1, 0.7, 1.1 / chordUnits);
    const rudderV2 = createWingPanel(2.4);
    rudderV2.rotation.z = Math.PI / 2;
    rudderV2.position.x = 0.85;
    rudderV2.scale.set(1, 0.7, 1.1 / chordUnits);
    rudderGroup.add(rudderV1);
    rudderGroup.add(rudderV2);

    // Rear Outrigger Booms
    [-0.85, 0.85].forEach((rx) => {
      const rearOutrigger = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.045, 3.8, 6),
        spruceWoodMat,
      );
      rearOutrigger.rotation.x = Math.PI / 2;
      rearOutrigger.position.set(rx, 0, -chordUnits / 2 - 1.7);
      flyerGroup.add(rearOutrigger);
    });
    flyerGroup.add(rudderGroup);

    // --- 1903 CHARLIE TAYLOR 12-HP 4-CYLINDER ENGINE & DRIVETRAIN ---
    const engineGroup = new THREE.Group();
    engineGroup.position.set(0.85, -gapUnits / 2 + 0.35, 0);

    // Cast Aluminum Crankcase
    const crankcase = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.5, 1.2), aluminumEngineMat);
    crankcase.castShadow = true;
    engineGroup.add(crankcase);

    // 4 Horizontal Cast-Iron Cylinders
    for (let c = 0; c < 4; c++) {
      const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.45, 12), castIronMat);
      cyl.rotation.z = Math.PI / 2;
      cyl.position.set(0.48, 0.05, -0.45 + c * 0.3);
      cyl.castShadow = true;
      engineGroup.add(cyl);
    }

    // Heavy Engine Flywheel
    const flywheel = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.12, 24), castIronMat);
    flywheel.rotation.x = Math.PI / 2;
    flywheel.position.set(-0.38, 0, -0.5);
    flywheel.castShadow = true;
    engineGroup.add(flywheel);

    // Upright Radiator Tubes on Front Strut
    const radiator = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, gapUnits * 0.75, 0.25),
      copperRadiatorMat,
    );
    radiator.position.set(-0.65, gapUnits * 0.2, chordUnits / 2 - 0.2);
    radiator.castShadow = true;
    engineGroup.add(radiator);

    // Gravity-Feed Gasoline Tank (Mounted on Upper Wing Strut)
    const gasTank = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.15, 0.7, 16),
      brassFittingMat,
    );
    gasTank.rotation.z = Math.PI / 2;
    gasTank.position.set(0.2, gapUnits * 0.65, 0);
    gasTank.castShadow = true;
    engineGroup.add(gasTank);

    flyerGroup.add(engineGroup);

    // --- PILOT PRONE HIP CRADLE & PITCH CONTROL LEVER ---
    const cradleGroup = new THREE.Group();
    cradleGroup.position.set(-0.85, -gapUnits / 2 + 0.15, 0);

    const cradleBase = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.12, 1.5), spruceWoodMat);
    cradleBase.castShadow = true;
    cradleGroup.add(cradleBase);

    // Canvas hip strap
    const hipStrap = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.06, 0.4), wingFabricMat);
    hipStrap.position.set(0, 0.1, 0);
    cradleGroup.add(hipStrap);

    // Left-Hand Pitch Lever for Elevator
    const pitchLever = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 0.65, 8),
      spruceWoodMat,
    );
    pitchLever.position.set(-0.45, 0.35, 0.4);
    pitchLever.rotation.z = -0.2;
    cradleGroup.add(pitchLever);

    flyerGroup.add(cradleGroup);

    // --- DUAL COUNTER-ROTATING PUSHER PROPELLERS WITH TWISTED SCIMITAR BLADES ---
    const createPropeller = (xPos: number, _isPortCounterClockwise = false) => {
      const pGroup = new THREE.Group();
      pGroup.position.set(xPos, 0, -chordUnits / 2 - 0.32);

      // Sprocket & Shaft Housing
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.28, 16), brassFittingMat);
      hub.rotation.x = Math.PI / 2;
      hub.castShadow = true;
      pGroup.add(hub);

      // Drive Chain Guide Tube leading from engine
      const tubeGeo = new THREE.CylinderGeometry(0.03, 0.03, Math.abs(xPos - 0.85), 6);
      const chainTube = new THREE.Mesh(tubeGeo, brassFittingMat);
      chainTube.rotation.z = Math.PI / 2;
      chainTube.position.set(-(xPos - 0.85) / 2, -0.15, 0.15);
      pGroup.add(chainTube);

      // Twisted Aerodynamic Blades (8.5ft scale)
      const bladeRadius = 1.65;
      const bladeMeshGroup = new THREE.Group();

      [-1, 1].forEach((dir) => {
        const bladeGeo = new THREE.BoxGeometry(0.24, bladeRadius, 0.045);
        const blade = new THREE.Mesh(bladeGeo, propellerWoodMat);
        blade.position.y = (dir * bladeRadius) / 2;
        blade.rotation.z = dir * 0.18;
        blade.rotation.x = dir * 0.25; // Aerodynamic pitch angle
        blade.castShadow = true;
        bladeMeshGroup.add(blade);
      });

      pGroup.add(bladeMeshGroup);

      // Semi-transparent rotational motion blur disk
      const blurDisk = new THREE.Mesh(
        new THREE.CircleGeometry(bladeRadius, 32),
        new THREE.MeshBasicMaterial({
          color: 0xfef08a,
          transparent: true,
          opacity: 0.15,
          side: THREE.DoubleSide,
        }),
      );
      pGroup.add(blurDisk);

      return { pGroup, bladeMeshGroup };
    };

    const { pGroup: leftPropGroup, bladeMeshGroup: leftPropBlades } = createPropeller(-2.4, true);
    const { pGroup: rightPropGroup, bladeMeshGroup: rightPropBlades } = createPropeller(2.4, false);
    flyerGroup.add(leftPropGroup);
    flyerGroup.add(rightPropGroup);

    // --- AERODYNAMIC AIRFLOW STREAMLINE PARTICLES ---
    const particleCount = 280;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const glowTex = createGlowPointTexture();

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      particlePositions[idx] = (Math.random() - 0.5) * (spanUnits + 4);
      particlePositions[idx + 1] = (Math.random() - 0.5) * (gapUnits + 2.5);
      particlePositions[idx + 2] = 12 + Math.random() * 8; // Flow incoming from front

      particleVelocities[idx] = 0;
      particleVelocities[idx + 1] = 0;
      particleVelocities[idx + 2] = -(0.3 + Math.random() * 0.25);

      // Color code by energy: Cyan-Blue (high speed/low pressure) to Amber (stagnation)
      particleColors[idx] = 0.2 + Math.random() * 0.4;
      particleColors[idx + 1] = 0.7 + Math.random() * 0.3;
      particleColors[idx + 2] = 1.0;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.5,
      map: glowTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const streamlinePoints = new THREE.Points(particleGeo, particleMat);
    scene.add(streamlinePoints);

    // --- 3D AERODYNAMIC FORCE VECTORS ---
    const vectorsGroup = new THREE.Group();
    scene.add(vectorsGroup);

    const createVectorArrow = (color: number, dir: THREE.Vector3, length: number) => {
      const arrow = new THREE.ArrowHelper(
        dir.clone().normalize(),
        new THREE.Vector3(0, 0, 0),
        length,
        color,
        0.4,
        0.25,
      );
      return arrow;
    };

    const liftVector = createVectorArrow(0x10b981, new THREE.Vector3(0, 1, 0), 2.5);
    const dragVector = createVectorArrow(0xef4444, new THREE.Vector3(0, 0, -1), 1.2);
    const thrustVector = createVectorArrow(0x3b82f6, new THREE.Vector3(0, 0, 1), 1.8);
    const weightVector = createVectorArrow(0xf59e0b, new THREE.Vector3(0, -1, 0), 2.2);

    vectorsGroup.add(liftVector);
    vectorsGroup.add(dragVector);
    vectorsGroup.add(thrustVector);
    vectorsGroup.add(weightVector);

    // --- RENDER LOOP & REAL-TIME PHYSICS SIMULATION ---
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      const p = live.current;

      // Auto-flight subtle atmospheric turbulence
      if (p.isAutoFlying) {
        flyerGroup.position.y = Math.sin(elapsed * 1.5) * 0.15;
        flyerGroup.rotation.z =
          Math.sin(elapsed * 0.9) * 0.03 + ((p.wingWarpDeg * Math.PI) / 180) * 0.4;
        flyerGroup.rotation.y =
          ((-p.rudderYawDeg * Math.PI) / 180) * 0.6 + Math.cos(elapsed * 0.7) * 0.02;
        flyerGroup.rotation.x = ((-p.elevatorPitchDeg * Math.PI) / 180) * 0.4;
      }

      // Propellers Rotation (Counter-Rotating to eliminate gyroscopic torque)
      const propSpeed = (p.airspeedMph / 25) * 45;
      leftPropBlades.rotation.z += propSpeed * delta;
      rightPropBlades.rotation.z -= propSpeed * delta;

      // Animate Wing Warping Deflection on Mesh Tips
      const warpRad = (p.wingWarpDeg * Math.PI) / 180;
      const leftTipUpper = upperWing.getObjectByName("leftTip");
      const rightTipUpper = upperWing.getObjectByName("rightTip");
      const leftTipLower = lowerWing.getObjectByName("leftTip");
      const rightTipLower = lowerWing.getObjectByName("rightTip");

      if (leftTipUpper && rightTipUpper && leftTipLower && rightTipLower) {
        leftTipUpper.rotation.x = warpRad * 0.6;
        leftTipLower.rotation.x = warpRad * 0.6;
        rightTipUpper.rotation.x = -warpRad * 0.6;
        rightTipLower.rotation.x = -warpRad * 0.6;
      }

      // Animate Elevator & Rudder
      canardGroup.rotation.x = (-p.elevatorPitchDeg * Math.PI) / 180;
      rudderGroup.rotation.y = (-p.rudderYawDeg * Math.PI) / 180;

      // Streamline Flow Particle Physics
      const posArr = particlePositions;
      const flowSpeed = (p.airspeedMph / 30) * 18 * delta;

      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        posArr[idx + 2] -= flowSpeed;

        // Downwash deflection as airflow passes the wings
        if (posArr[idx + 2] < 1 && posArr[idx + 2] > -4) {
          posArr[idx + 1] -= p.baseCl * 0.08 * delta;
        }

        // Reset particle when it travels past the tail
        if (posArr[idx + 2] < -12) {
          posArr[idx + 2] = 12 + Math.random() * 4;
          posArr[idx] = (Math.random() - 0.5) * (spanUnits + 4);
          posArr[idx + 1] = (Math.random() - 0.5) * (gapUnits + 2.5);
        }
      }
      particleGeo.attributes.position.needsUpdate = true;
      streamlinePoints.visible = p.showStreamlines;
      vectorsGroup.visible = p.showVectors;

      // Update Force Vector Scales
      liftVector.setLength(Math.max(0.5, p.totalLiftLbs / 250), 0.4, 0.25);
      dragVector.setLength(Math.max(0.3, p.totalDragLbs / 90), 0.3, 0.2);

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      studio.dispose();
    };
  }, [live]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      {/* 3D WebGL Canvas Viewport */}
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Live HUD Telemetry Overlay */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
          <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm">
            <div className="text-[11px] font-sans text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 animate-spin-slow" />
              Aerodynamic Equilibrium
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1 text-xs font-sans">
              <div>
                <span className="text-ink-600 dark:text-ink-400">Total Lift:</span>{" "}
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {totalLiftLbs} lbs
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Total Drag:</span>{" "}
                <span className="font-bold text-red-600 dark:text-red-400">{totalDragLbs} lbs</span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Lift/Drag (L/D):</span>{" "}
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {(totalLiftLbs / Math.max(1, totalDragLbs)).toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Net Yaw Torque:</span>{" "}
                <span
                  className={`font-bold ${
                    Math.abs(netYawMoment) < 30
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-amber-600 dark:text-amber-400"
                  }`}
                >
                  {netYawMoment > 0 ? `+${netYawMoment}` : netYawMoment} ft-lb
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-[11px] font-sans text-ink-700 dark:text-ink-300 flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${isCoupled ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`}
            />
            <span>
              {isCoupled
                ? "Claim 1 cable coupling: warp drives starboard rudder"
                : "Unlinked controls — adverse yaw is unopposed"}
            </span>
          </div>
        </div>

        {/* Camera & Toggle Controls */}
        <div className="absolute top-4 right-4 z-10 flex flex-wrap justify-end gap-2 max-w-[55%]">
          <button
            type="button"
            onClick={() => setShowStreamlines(!showStreamlines)}
            className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold border transition-all ${
              showStreamlines
                ? "bg-amber-500 text-white border-amber-600 shadow-sm"
                : "bg-white/80 dark:bg-ink-900/80 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-700"
            }`}
          >
            <Wind className="w-3.5 h-3.5 inline mr-1" />
            Streamlines
          </button>
          <button
            type="button"
            onClick={() => setShowVectors(!showVectors)}
            className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold border transition-all ${
              showVectors
                ? "bg-blue-600 text-white border-blue-700 shadow-sm"
                : "bg-white/80 dark:bg-ink-900/80 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-700"
            }`}
          >
            Force Vectors
          </button>
          <button
            type="button"
            onClick={() => setIsAutoFlying(!isAutoFlying)}
            className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold border transition-all ${
              isAutoFlying
                ? "bg-emerald-600 text-white border-emerald-700 shadow-sm"
                : "bg-white/80 dark:bg-ink-900/80 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-700"
            }`}
          >
            <Play className="w-3.5 h-3.5 inline mr-1" />
            {isAutoFlying ? "Live Flight" : "Freeze"}
          </button>
        </div>
      </div>

      {/* Parameter Sliders Panel */}
      <div className="p-4 sm:p-5 bg-parchment-100/80 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
        {/* Wing Warping (Roll & Adverse Yaw) */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Wing Warping (Roll):</span>
            <span className="font-bold text-amber-700 dark:text-amber-400">
              {wingWarpDeg > 0 ? `+${wingWarpDeg}°` : `${wingWarpDeg}°`}
            </span>
          </div>
          <input
            type="range"
            min="-15"
            max="15"
            step="1"
            value={wingWarpDeg}
            onChange={(e) => applyWarp(Number(e.target.value))}
            className="w-full accent-amber-600 dark:accent-amber-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Helical torsion along lateral spars
          </span>
        </div>

        {/* Vertical Rudder (Yaw Compensation) */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Rudder Angle (Yaw):</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {rudderYawDeg > 0 ? `+${rudderYawDeg}°` : `${rudderYawDeg}°`}
            </span>
          </div>
          <input
            type="range"
            min="-25"
            max="25"
            step="1"
            value={rudderYawDeg}
            disabled={isCoupled}
            onChange={(e) => setRudderYawDeg(Number(e.target.value))}
            className={`w-full accent-blue-600 dark:accent-blue-400 ${isCoupled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          />
          <label className="flex items-center gap-1.5 text-[10px] text-ink-500 dark:text-ink-400">
            <input
              type="checkbox"
              checked={isCoupled}
              onChange={(e) => {
                setIsCoupled(e.target.checked);
                if (e.target.checked) {
                  setRudderYawDeg(Math.round(wingWarpDeg * 0.45));
                }
              }}
              className="rounded accent-emerald-600"
            />
            Claim 1 hip-cradle coupling
          </label>
        </div>

        {/* Forward Canard (Pitch Angle) */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Canard Elevator (Pitch):</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {elevatorPitchDeg > 0 ? `+${elevatorPitchDeg}°` : `${elevatorPitchDeg}°`}
            </span>
          </div>
          <input
            type="range"
            min="-15"
            max="15"
            step="1"
            value={elevatorPitchDeg}
            onChange={(e) => setElevatorPitchDeg(Number(e.target.value))}
            className="w-full accent-emerald-600 dark:accent-emerald-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Controls angle of attack &amp; stall margin
          </span>
        </div>

        {/* Airspeed (Dynamic Pressure) */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Relative Airspeed:</span>
            <span className="font-bold text-purple-600 dark:text-purple-400">
              {airspeedMph} mph ({airspeedFps.toFixed(1)} ft/s)
            </span>
          </div>
          <input
            type="range"
            min="15"
            max="45"
            step="1"
            value={airspeedMph}
            onChange={(e) => setAirspeedMph(Number(e.target.value))}
            className="w-full accent-purple-600 dark:accent-purple-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Dynamic pressure q = ½ρV² = {dynamicPressure.toFixed(2)} psf
          </span>
        </div>
      </div>
    </div>
  );
}
