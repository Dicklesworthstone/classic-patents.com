import * as THREE from "three";
import type { BaerOdysseyControls, BaerOdysseyMetrics } from "@/physics/baerOdysseyKernel";

export interface BaerOdyssey3DModel {
  root: THREE.Group;
  updateState: (metrics: BaerOdysseyMetrics, controls: BaerOdysseyControls) => void;
  dispose: () => void;
}

export function buildBaerOdysseyModel(): BaerOdyssey3DModel {
  const root = new THREE.Group();
  root.name = "US 3,728,480 Magnavox Odyssey 3D Studio Model";

  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];

  const geometry = <T extends THREE.BufferGeometry>(value: T): T => {
    geometries.push(value);
    return value;
  };
  const material = <T extends THREE.Material>(value: T): T => {
    materials.push(value);
    return value;
  };

  // Materials
  const woodFinish = material(
    new THREE.MeshStandardMaterial({
      color: 0x3f2010,
      roughness: 0.6,
      metalness: 0.1,
    }),
  );
  const brownBoxVinyl = material(
    new THREE.MeshStandardMaterial({
      color: 0x5c3d2e,
      roughness: 0.75,
      metalness: 0.05,
    }),
  );
  const creamConsole = material(
    new THREE.MeshStandardMaterial({
      color: 0xe2d9c8,
      roughness: 0.4,
      metalness: 0.15,
    }),
  );
  const goldTrim = material(
    new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.3,
      metalness: 0.8,
    }),
  );
  const plasticBlack = material(
    new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.5,
      metalness: 0.2,
    }),
  );
  const chromeMetal = material(
    new THREE.MeshStandardMaterial({
      color: 0xd1d5db,
      roughness: 0.2,
      metalness: 0.9,
    }),
  );
  const _crtGlass = material(
    new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.1,
      metalness: 0.85,
    }),
  );

  // Screen Phosphor Glow Materials
  const screenPhosphorMat = material(
    new THREE.MeshBasicMaterial({
      color: 0x041824,
    }),
  );
  const paddleP1Mat = material(
    new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
    }),
  );
  const paddleP2Mat = material(
    new THREE.MeshBasicMaterial({
      color: 0xf472b6,
    }),
  );
  const ballMat = material(
    new THREE.MeshBasicMaterial({
      color: 0xfef08a,
    }),
  );
  const coincidenceGlowMat = material(
    new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.0,
    }),
  );

  // 1. CRT TELEVISION SET (RECEIVER 10)
  const tvGroup = new THREE.Group();
  tvGroup.name = "Television Receiver 10";
  tvGroup.position.set(0, 1.2, 0);

  // TV Cabinet (Wood Console)
  const tvCabinetMesh = new THREE.Mesh(geometry(new THREE.BoxGeometry(2.4, 1.8, 1.4)), woodFinish);
  tvCabinetMesh.castShadow = true;
  tvCabinetMesh.receiveShadow = true;
  tvGroup.add(tvCabinetMesh);

  // TV Front Bezel (Cream plastic)
  const tvBezel = new THREE.Mesh(geometry(new THREE.BoxGeometry(2.2, 1.6, 0.1)), plasticBlack);
  tvBezel.position.set(0, 0, 0.71);
  tvGroup.add(tvBezel);

  // Curved CRT Screen Face
  const crtScreen = new THREE.Mesh(geometry(new THREE.PlaneGeometry(1.6, 1.2)), screenPhosphorMat);
  crtScreen.position.set(-0.2, 0.05, 0.77);
  tvGroup.add(crtScreen);

  // TV Tuner Control Panel on Right Side
  const tunerPanel = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.35, 1.2, 0.05)), creamConsole);
  tunerPanel.position.set(0.8, 0.05, 0.76);
  tvGroup.add(tunerPanel);

  // Channel VHF Dial (Knob)
  const vhfKnob = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.08, 0.08, 0.06, 24)),
    chromeMetal,
  );
  vhfKnob.rotation.x = Math.PI / 2;
  vhfKnob.position.set(0.8, 0.35, 0.8);
  tvGroup.add(vhfKnob);

  // UHF Dial
  const uhfKnob = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.08, 0.08, 0.06, 24)),
    chromeMetal,
  );
  uhfKnob.rotation.x = Math.PI / 2;
  uhfKnob.position.set(0.8, 0.1, 0.8);
  tvGroup.add(uhfKnob);

  // Speaker Grille Slits
  const grille = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.3, 0.35, 0.02)), plasticBlack);
  grille.position.set(0.8, -0.3, 0.78);
  tvGroup.add(grille);

  // TV Stand / Legs
  const legGeom = geometry(new THREE.CylinderGeometry(0.04, 0.025, 0.8, 16));
  const legFL = new THREE.Mesh(legGeom, goldTrim);
  legFL.position.set(-1.0, -1.2, 0.5);
  legFL.rotation.z = 0.15;
  legFL.rotation.x = -0.1;
  tvGroup.add(legFL);

  const legFR = new THREE.Mesh(legGeom, goldTrim);
  legFR.position.set(1.0, -1.2, 0.5);
  legFR.rotation.z = -0.15;
  legFR.rotation.x = -0.1;
  tvGroup.add(legFR);

  const legBL = new THREE.Mesh(legGeom, goldTrim);
  legBL.position.set(-1.0, -1.2, -0.5);
  legBL.rotation.z = 0.15;
  legBL.rotation.x = 0.1;
  tvGroup.add(legBL);

  const legBR = new THREE.Mesh(legGeom, goldTrim);
  legBR.position.set(1.0, -1.2, -0.5);
  legBR.rotation.z = -0.15;
  legBR.rotation.x = 0.1;
  tvGroup.add(legBR);

  // CRT Screen Phosphor Dynamic Meshes
  const p1PaddleMesh = new THREE.Mesh(geometry(new THREE.PlaneGeometry(0.06, 0.28)), paddleP1Mat);
  p1PaddleMesh.position.set(-0.7, 0.05, 0.78);
  tvGroup.add(p1PaddleMesh);

  const p2PaddleMesh = new THREE.Mesh(geometry(new THREE.PlaneGeometry(0.06, 0.28)), paddleP2Mat);
  p2PaddleMesh.position.set(0.3, 0.05, 0.78);
  tvGroup.add(p2PaddleMesh);

  const ballMesh = new THREE.Mesh(geometry(new THREE.PlaneGeometry(0.05, 0.05)), ballMat);
  ballMesh.position.set(-0.2, 0.05, 0.78);
  tvGroup.add(ballMesh);

  const coincidenceGlowMesh = new THREE.Mesh(
    geometry(new THREE.RingGeometry(0.04, 0.12, 24)),
    coincidenceGlowMat,
  );
  coincidenceGlowMesh.position.set(-0.2, 0.05, 0.782);
  tvGroup.add(coincidenceGlowMesh);

  root.add(tvGroup);

  // 2. MAGNAVOX ODYSSEY MASTER CONSOLE (UNIT 14 / 21)
  const consoleGroup = new THREE.Group();
  consoleGroup.name = "Master Console 14";
  consoleGroup.position.set(0, 0.1, 1.8);

  // Console Body (Futuristic 1972 Cream + Brown Faux Wood)
  const consoleBody = new THREE.Mesh(
    geometry(new THREE.BoxGeometry(1.2, 0.18, 0.75)),
    creamConsole,
  );
  consoleBody.castShadow = true;
  consoleBody.receiveShadow = true;
  consoleGroup.add(consoleBody);

  const consoleTopInlay = new THREE.Mesh(
    geometry(new THREE.BoxGeometry(1.12, 0.02, 0.68)),
    brownBoxVinyl,
  );
  consoleTopInlay.position.set(0, 0.095, 0);
  consoleGroup.add(consoleTopInlay);

  // Program Card Cartridge Slot
  const slotBezel = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.5, 0.04, 0.08)), goldTrim);
  slotBezel.position.set(0, 0.11, -0.15);
  consoleGroup.add(slotBezel);

  // Inserted Game Card #1 (Tennis)
  const gameCard = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.44, 0.18, 0.04)), creamConsole);
  gameCard.position.set(0, 0.18, -0.15);
  consoleGroup.add(gameCard);

  // Reset Button (Pushbutton 26)
  const resetBtn = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.035, 0.035, 0.04, 16)),
    goldTrim,
  );
  resetBtn.position.set(0.35, 0.11, 0.18);
  consoleGroup.add(resetBtn);

  // Chroma Background Color Dial (Knob 15)
  const chromaDial = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.045, 0.045, 0.03, 20)),
    chromeMetal,
  );
  chromaDial.position.set(-0.35, 0.11, 0.18);
  consoleGroup.add(chromaDial);

  root.add(consoleGroup);

  // 3. PLAYER 1 CONTROLLER (UNIT 22)
  const p1Group = new THREE.Group();
  p1Group.name = "Player 1 Controller 22";
  p1Group.position.set(-1.1, 0.08, 2.2);

  const p1Box = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.42, 0.14, 0.42)), creamConsole);
  p1Box.castShadow = true;
  p1Group.add(p1Box);

  // Player 1 Vertical Knob (Knob 16) on right side of controller
  const p1KnobV = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.04, 0.04, 0.04, 16)),
    plasticBlack,
  );
  p1KnobV.rotation.z = Math.PI / 2;
  p1KnobV.position.set(0.22, 0, 0);
  p1Group.add(p1KnobV);

  // Player 1 Horizontal Knob (Knob 17) on right side of controller
  const p1KnobH = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.03, 0.03, 0.04, 16)),
    chromeMetal,
  );
  p1KnobH.rotation.z = Math.PI / 2;
  p1KnobH.position.set(0.25, 0, 0);
  p1Group.add(p1KnobH);

  // Player 1 English Dial on left side
  const p1KnobEnglish = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.04, 0.04, 0.03, 16)),
    plasticBlack,
  );
  p1KnobEnglish.rotation.z = Math.PI / 2;
  p1KnobEnglish.position.set(-0.22, 0, 0);
  p1Group.add(p1KnobEnglish);

  root.add(p1Group);

  // 4. PLAYER 2 CONTROLLER (UNIT 23)
  const p2Group = new THREE.Group();
  p2Group.name = "Player 2 Controller 23";
  p2Group.position.set(1.1, 0.08, 2.2);

  const p2Box = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.42, 0.14, 0.42)), creamConsole);
  p2Box.castShadow = true;
  p2Group.add(p2Box);

  const p2KnobV = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.04, 0.04, 0.04, 16)),
    plasticBlack,
  );
  p2KnobV.rotation.z = Math.PI / 2;
  p2KnobV.position.set(0.22, 0, 0);
  p2Group.add(p2KnobV);

  const p2KnobH = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.03, 0.03, 0.04, 16)),
    chromeMetal,
  );
  p2KnobH.rotation.z = Math.PI / 2;
  p2KnobH.position.set(0.25, 0, 0);
  p2Group.add(p2KnobH);

  root.add(p2Group);

  // 5. OPTICAL LIGHT GUN (FIG. 1C)
  const gunGroup = new THREE.Group();
  gunGroup.name = "Light Gun 27";
  gunGroup.position.set(0.6, 0.12, 1.4);
  gunGroup.rotation.y = -0.4;

  const gunBarrel = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.02, 0.025, 0.65, 16)),
    plasticBlack,
  );
  gunBarrel.rotation.x = Math.PI / 2;
  gunGroup.add(gunBarrel);

  const gunStock = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.05, 0.12, 0.35)), woodFinish);
  gunStock.position.set(0, -0.05, 0.35);
  gunStock.rotation.x = 0.2;
  gunGroup.add(gunStock);

  root.add(gunGroup);

  // 6. Connecting Antenna Twin-Lead Cable (Lead 12)
  const cableGeom = geometry(new THREE.CylinderGeometry(0.01, 0.01, 1.8, 8));
  const cableMesh = new THREE.Mesh(cableGeom, plasticBlack);
  cableMesh.position.set(0, 0.6, 0.9);
  cableMesh.rotation.x = 0.9;
  root.add(cableMesh);

  // Floor Mat / Table surface
  const tableMesh = new THREE.Mesh(geometry(new THREE.BoxGeometry(4.2, 0.08, 3.2)), woodFinish);
  tableMesh.position.set(0, -0.04, 1.4);
  tableMesh.receiveShadow = true;
  root.add(tableMesh);

  // Update loop
  const updateState = (metrics: BaerOdysseyMetrics, controls: BaerOdysseyControls) => {
    // Map screen bounds: X from -0.9 to 0.5 (width 1.4), Y from -0.45 to 0.55 (height 1.0)
    const screenXMin = -0.9;
    const screenXSpan = 1.4;
    const screenYMin = -0.45;
    const screenYSpan = 1.0;

    // Position P1 paddle
    const p1X = screenXMin + metrics.p1X * screenXSpan;
    const p1Y = screenYMin + (1.0 - metrics.p1Y) * screenYSpan;
    p1PaddleMesh.position.set(p1X, p1Y, 0.78);

    // Position P2 paddle / target
    const p2X = screenXMin + metrics.p2X * screenXSpan;
    const p2Y = screenYMin + (1.0 - metrics.p2Y) * screenYSpan;
    p2PaddleMesh.position.set(p2X, p2Y, 0.78);
    p2PaddleMesh.visible = metrics.targetVisible;

    // Position ball
    const bX = screenXMin + metrics.ballX * screenXSpan;
    const bY = screenYMin + (1.0 - metrics.ballY) * screenYSpan;
    ballMesh.position.set(bX, bY, 0.78);

    // Coincidence Flash Effect
    if (metrics.coincidenceActive) {
      coincidenceGlowMesh.position.set(bX, bY, 0.782);
      coincidenceGlowMat.opacity = 0.9;
    } else {
      coincidenceGlowMat.opacity = 0.0;
    }

    // Rotate knobs based on potentiometer controls
    p1KnobV.rotation.x = controls.player1PotY * Math.PI * 2;
    p1KnobH.rotation.x = controls.player1PotX * Math.PI * 2;
    p1KnobEnglish.rotation.x = controls.englishControl * Math.PI;

    p2KnobV.rotation.x = controls.player2PotY * Math.PI * 2;
    p2KnobH.rotation.x = controls.player2PotX * Math.PI * 2;

    chromaDial.rotation.y = (controls.chromaPhaseDeg / 180.0) * Math.PI;
  };

  const dispose = () => {
    for (const g of geometries) g.dispose();
    for (const m of materials) m.dispose();
  };

  return { root, updateState, dispose };
}
