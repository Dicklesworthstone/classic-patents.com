import * as THREE from "three";
import type { BaerOdysseyControls, BaerOdysseyMetrics } from "@/physics/baerOdysseyKernel";

export interface BaerOdyssey3DModel {
  root: THREE.Group;
  updateState: (metrics: BaerOdysseyMetrics, controls: BaerOdysseyControls) => void;
  dispose: () => void;
}

export function buildBaerOdysseyModel(): BaerOdyssey3DModel {
  const root = new THREE.Group();
  root.name = "US 3,728,480 Figure 1 and 1B Source Apparatus";

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
  const signalCableMaterial = material(
    new THREE.MeshStandardMaterial({
      color: 0x1f2937,
      emissive: 0x0b3b4d,
      emissiveIntensity: 0.35,
      roughness: 0.72,
      metalness: 0.08,
    }),
  );
  const photocellGlass = material(
    new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.1,
      metalness: 0.85,
    }),
  );

  // Screen phosphor and signal-path materials. The patent permits monochrome
  // or color receivers; the two generated source dots are deliberately the
  // same phosphor color rather than invented game-player colors.
  const screenPhosphorMat = material(
    new THREE.MeshBasicMaterial({
      color: 0x041824,
    }),
  );
  const dot20Material = material(
    new THREE.MeshBasicMaterial({
      color: 0xfff7c2,
    }),
  );
  const dot20PrimeMaterial = material(
    new THREE.MeshBasicMaterial({
      color: 0xfff7c2,
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
  tvGroup.position.set(0, 0.825, 0);

  // TV Cabinet (Wood Console)
  const tvCabinetMesh = new THREE.Mesh(
    geometry(new THREE.BoxGeometry(2.25, 1.65, 1.1)),
    woodFinish,
  );
  tvCabinetMesh.name = "Receiver 10 cabinet";
  tvCabinetMesh.castShadow = true;
  tvCabinetMesh.receiveShadow = true;
  tvGroup.add(tvCabinetMesh);

  // TV Front Bezel (Cream plastic)
  const tvBezel = new THREE.Mesh(geometry(new THREE.BoxGeometry(2.05, 1.4, 0.08)), plasticBlack);
  tvBezel.name = "Receiver 10 front bezel";
  tvBezel.position.set(0, 0, 0.57);
  tvGroup.add(tvBezel);

  // Curved CRT Screen Face
  const crtScreen = new THREE.Mesh(
    geometry(new THREE.PlaneGeometry(1.72, 1.12)),
    screenPhosphorMat,
  );
  crtScreen.name = "Television screen 18";
  crtScreen.position.set(0, 0, 0.615);
  tvGroup.add(crtScreen);

  // Generated rectangular dots 20 and 20-1 from Figure 1. They are not
  // Pong paddles and no autonomous third ball is part of this source view.
  const dot20Mesh = new THREE.Mesh(geometry(new THREE.PlaneGeometry(0.11, 0.075)), dot20Material);
  dot20Mesh.name = "Generated dot 20";
  dot20Mesh.position.set(-0.5, 0.05, 0.62);
  tvGroup.add(dot20Mesh);

  const dot20PrimeMesh = new THREE.Mesh(
    geometry(new THREE.PlaneGeometry(0.11, 0.075)),
    dot20PrimeMaterial,
  );
  dot20PrimeMesh.name = "Generated dot 20-1";
  dot20PrimeMesh.position.set(0.5, 0.05, 0.62);
  tvGroup.add(dot20PrimeMesh);

  const coincidenceGlowMesh = new THREE.Mesh(
    geometry(new THREE.RingGeometry(0.04, 0.12, 24)),
    coincidenceGlowMat,
  );
  coincidenceGlowMesh.name = "Dot coincidence indicator";
  coincidenceGlowMesh.position.set(0, 0.05, 0.623);
  tvGroup.add(coincidenceGlowMesh);

  root.add(tvGroup);

  // 2. SOURCE MASTER CONTROL UNIT 21 (FIG. 1B)
  const consoleGroup = new THREE.Group();
  consoleGroup.name = "Master Control Unit 21";
  consoleGroup.position.set(0, 0.1, 1.8);

  const consoleBody = new THREE.Mesh(geometry(new THREE.BoxGeometry(1.2, 0.2, 0.75)), creamConsole);
  consoleBody.name = "Master unit 21 housing";
  consoleBody.castShadow = true;
  consoleBody.receiveShadow = true;
  consoleGroup.add(consoleBody);

  const consoleTopInlay = new THREE.Mesh(
    geometry(new THREE.BoxGeometry(1.12, 0.02, 0.68)),
    brownBoxVinyl,
  );
  consoleTopInlay.position.set(0, 0.095, 0);
  consoleGroup.add(consoleTopInlay);

  // Reset Button (Pushbutton 26)
  const resetBtn = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.035, 0.035, 0.04, 16)),
    goldTrim,
  );
  resetBtn.name = "Reset switch 26";
  resetBtn.position.set(-0.2, 0.125, 0);
  consoleGroup.add(resetBtn);

  // Background-color control 15 is on the front of master unit 21.
  const chromaDialGroup = new THREE.Group();
  chromaDialGroup.name = "Background color knob 15";
  chromaDialGroup.position.set(0.18, 0, 0.385);
  const chromaDial = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.045, 0.045, 0.03, 20)),
    chromeMetal,
  );
  chromaDial.rotation.x = Math.PI / 2;
  chromaDialGroup.add(chromaDial);
  const chromaPointer = new THREE.Mesh(
    geometry(new THREE.BoxGeometry(0.01, 0.045, 0.018)),
    plasticBlack,
  );
  chromaPointer.position.set(0, 0.02, 0.02);
  chromaDialGroup.add(chromaPointer);
  consoleGroup.add(chromaDialGroup);

  root.add(consoleGroup);

  // 3. PLAYER 1 CONTROLLER (UNIT 22)
  const controllerKnobPointerGeometry = geometry(new THREE.BoxGeometry(0.012, 0.012, 0.045));
  const p1Group = new THREE.Group();
  p1Group.name = "Individual Control Unit 22";
  p1Group.position.set(-1.1, 0.08, 2.2);

  const p1Box = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.48, 0.16, 0.42)), creamConsole);
  p1Box.name = "Control unit 22 housing";
  p1Box.castShadow = true;
  p1Group.add(p1Box);

  // Figure 1B places both position knobs on the top surface.
  const p1KnobVGroup = new THREE.Group();
  p1KnobVGroup.name = "Control 22 vertical knob 16";
  p1KnobVGroup.position.set(-0.1, 0.095, 0);
  const p1KnobV = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.04, 0.04, 0.04, 16)),
    plasticBlack,
  );
  p1KnobVGroup.add(p1KnobV);
  const p1KnobVPointer = new THREE.Mesh(controllerKnobPointerGeometry, creamConsole);
  p1KnobVPointer.position.set(0, 0.026, 0.012);
  p1KnobVGroup.add(p1KnobVPointer);
  p1Group.add(p1KnobVGroup);

  const p1KnobHGroup = new THREE.Group();
  p1KnobHGroup.name = "Control 22 horizontal knob 17";
  p1KnobHGroup.position.set(0.1, 0.095, 0);
  const p1KnobH = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.04, 0.04, 0.04, 16)),
    chromeMetal,
  );
  p1KnobHGroup.add(p1KnobH);
  const p1KnobHPointer = new THREE.Mesh(controllerKnobPointerGeometry, plasticBlack);
  p1KnobHPointer.position.set(0, 0.026, 0.012);
  p1KnobHGroup.add(p1KnobHPointer);
  p1Group.add(p1KnobHGroup);

  root.add(p1Group);

  // 4. PLAYER 2 CONTROLLER (UNIT 23)
  const p2Group = new THREE.Group();
  p2Group.name = "Individual Control Unit 23";
  p2Group.position.set(1.1, 0.08, 2.2);

  const p2Box = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.48, 0.16, 0.42)), creamConsole);
  p2Box.name = "Control unit 23 housing";
  p2Box.castShadow = true;
  p2Group.add(p2Box);

  const p2KnobVGroup = new THREE.Group();
  p2KnobVGroup.name = "Control 23 vertical knob 16-1";
  p2KnobVGroup.position.set(-0.1, 0.095, 0);
  const p2KnobV = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.04, 0.04, 0.04, 16)),
    plasticBlack,
  );
  p2KnobVGroup.add(p2KnobV);
  const p2KnobVPointer = new THREE.Mesh(controllerKnobPointerGeometry, creamConsole);
  p2KnobVPointer.position.set(0, 0.026, 0.012);
  p2KnobVGroup.add(p2KnobVPointer);
  p2Group.add(p2KnobVGroup);

  const p2KnobHGroup = new THREE.Group();
  p2KnobHGroup.name = "Control 23 horizontal knob 17-1";
  p2KnobHGroup.position.set(0.1, 0.095, 0);
  const p2KnobH = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.04, 0.04, 0.04, 16)),
    chromeMetal,
  );
  p2KnobHGroup.add(p2KnobH);
  const p2KnobHPointer = new THREE.Mesh(controllerKnobPointerGeometry, plasticBlack);
  p2KnobHPointer.position.set(0, 0.026, 0.012);
  p2KnobHGroup.add(p2KnobHPointer);
  p2Group.add(p2KnobHGroup);

  root.add(p2Group);

  // 5. OPTICAL LIGHT GUN (FIG. 1C)
  const gunGroup = new THREE.Group();
  gunGroup.name = "Photoelectric Light Gun 27";
  gunGroup.position.set(0.55, 0.235, 2.55);
  gunGroup.rotation.y = -0.4;

  const gunBarrel = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.02, 0.025, 0.65, 16)),
    plasticBlack,
  );
  gunBarrel.rotation.x = Math.PI / 2;
  gunGroup.add(gunBarrel);

  const photocellLens = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.028, 0.028, 0.025, 18)),
    photocellGlass,
  );
  photocellLens.name = "Light gun 27 photoelectric cell lens";
  photocellLens.position.z = -0.33;
  photocellLens.rotation.x = Math.PI / 2;
  gunGroup.add(photocellLens);

  const gunGrip = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.09, 0.24, 0.11)), woodFinish);
  gunGrip.name = "Light gun 27 grip";
  gunGrip.position.set(0, -0.105, 0.16);
  gunGrip.rotation.x = -0.25;
  gunGroup.add(gunGrip);

  const gunTrigger = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.026, 0.07, 0.018)), goldTrim);
  gunTrigger.name = "Light gun 27 trigger";
  gunTrigger.position.set(0, -0.055, 0.055);
  gunTrigger.rotation.x = -0.25;
  gunGroup.add(gunTrigger);

  root.add(gunGroup);

  // 6. Every detached unit in Figure 1B is physically tethered. Short
  // cylinder runs make the routing inspectable and keep both endpoints inside
  // the connected housings instead of leaving decorative floating cords.
  const addCable = (name: string, points: readonly THREE.Vector3[], radius = 0.014) => {
    const cable = new THREE.Group();
    cable.name = name;
    cable.userData.start = points[0]?.toArray() ?? [];
    cable.userData.end = points.at(-1)?.toArray() ?? [];
    for (let index = 0; index < points.length - 1; index += 1) {
      const start = points[index];
      const end = points[index + 1];
      if (!start || !end) continue;
      const delta = end.clone().sub(start);
      const segment = new THREE.Mesh(
        geometry(new THREE.CylinderGeometry(radius, radius, delta.length(), 10)),
        signalCableMaterial,
      );
      segment.name = `${name} segment ${index + 1}`;
      segment.position.copy(start).add(end).multiplyScalar(0.5);
      segment.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.normalize());
      cable.add(segment);
    }
    root.add(cable);
    return cable;
  };

  addCable("Shielded connection means 12", [
    new THREE.Vector3(0.34, 0.08, 1.43),
    new THREE.Vector3(0.55, 0.014, 1.18),
    new THREE.Vector3(0.8, 0.014, 0.78),
    new THREE.Vector3(0.88, 0.14, 0.54),
  ]);
  addCable("Control unit 22 cable", [
    new THREE.Vector3(-0.86, 0.08, 2.2),
    new THREE.Vector3(-0.76, 0.014, 2.05),
    new THREE.Vector3(-0.6, 0.07, 1.92),
  ]);
  addCable("Control unit 23 cable", [
    new THREE.Vector3(0.86, 0.08, 2.2),
    new THREE.Vector3(0.76, 0.014, 2.05),
    new THREE.Vector3(0.6, 0.07, 1.92),
  ]);
  addCable(
    "Light gun 27 electrical cable",
    [
      new THREE.Vector3(0.55, 0.235, 2.55),
      new THREE.Vector3(0.45, 0.01, 2.35),
      new THREE.Vector3(0.38, 0.07, 2.15),
    ],
    0.01,
  );

  // Floor Mat / Table surface
  const tableMesh = new THREE.Mesh(geometry(new THREE.BoxGeometry(4.2, 0.08, 3.2)), woodFinish);
  tableMesh.name = "Supporting table surface";
  tableMesh.position.set(0, -0.04, 1.4);
  tableMesh.receiveShadow = true;
  root.add(tableMesh);

  // Update loop
  const updateState = (metrics: BaerOdysseyMetrics, controls: BaerOdysseyControls) => {
    // Map both source dots across the same receiver screen 18. Later-game
    // paddle/ball conventions are intentionally absent from this projection.
    const screenXMin = -0.76;
    const screenXSpan = 1.52;
    const screenYMin = -0.45;
    const screenYSpan = 0.9;

    // Position source dot 20.
    const p1X = screenXMin + metrics.p1X * screenXSpan;
    const p1Y = screenYMin + (1.0 - metrics.p1Y) * screenYSpan;
    dot20Mesh.position.set(p1X, p1Y, 0.62);
    dot20Mesh.visible = metrics.firstDotVisible;

    // Position source dot 20-1.
    const p2X = screenXMin + metrics.p2X * screenXSpan;
    const p2Y = screenYMin + (1.0 - metrics.p2Y) * screenYSpan;
    dot20PrimeMesh.position.set(p2X, p2Y, 0.62);
    dot20PrimeMesh.visible = metrics.secondDotVisible;

    // Coincidence Flash Effect
    if (metrics.coincidenceActive) {
      coincidenceGlowMesh.position.set(p2X, p2Y, 0.623);
      coincidenceGlowMat.opacity = 0.9;
    } else {
      coincidenceGlowMat.opacity = 0.0;
    }

    // The pointer groups rotate about the vertical shaft axis, making every
    // source potentiometer visibly follow its shared control value.
    p1KnobVGroup.rotation.y = controls.player1PotY * Math.PI * 2;
    p1KnobHGroup.rotation.y = controls.player1PotX * Math.PI * 2;
    p2KnobVGroup.rotation.y = controls.player2PotY * Math.PI * 2;
    p2KnobHGroup.rotation.y = controls.player2PotX * Math.PI * 2;
    chromaDialGroup.rotation.z = (controls.chromaPhaseDeg / 180.0) * Math.PI;

    signalCableMaterial.emissiveIntensity = metrics.directCouplingActive ? 0.35 : 0;
    screenPhosphorMat.color.setHex(metrics.claim1TopologyActive ? 0x041824 : 0x020617);
  };

  const dispose = () => {
    for (const g of geometries) g.dispose();
    for (const m of materials) m.dispose();
  };

  return { root, updateState, dispose };
}
