import * as THREE from "three";
import type {
  MetcalfeEthernetControls,
  MetcalfeEthernetMetrics,
} from "@/physics/metcalfeEthernetKernel";

export interface MetcalfeEthernet3DModel {
  root: THREE.Group;
  updateState: (metrics: MetcalfeEthernetMetrics, controls: MetcalfeEthernetControls) => void;
  dispose: () => void;
}

export function buildMetcalfeEthernetModel(): MetcalfeEthernet3DModel {
  const root = new THREE.Group();
  root.name = "US 4,063,220 Ethernet 3D Studio Model";

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
  const yellowJacket = material(
    new THREE.MeshStandardMaterial({
      color: 0xeab308, // 10BASE5 Thicknet Yellow
      roughness: 0.35,
      metalness: 0.1,
    }),
  );

  const terminationMetal = material(
    new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.25,
      metalness: 0.85,
    }),
  );

  const tapClampMaterial = material(
    new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.4,
      metalness: 0.6,
    }),
  );

  const altoBeige = material(
    new THREE.MeshStandardMaterial({
      color: 0xd6cbb8,
      roughness: 0.55,
      metalness: 0.05,
    }),
  );

  const altoDarkBezel = material(
    new THREE.MeshStandardMaterial({
      color: 0x27272a,
      roughness: 0.4,
      metalness: 0.2,
    }),
  );

  const crtPhosphor = material(
    new THREE.MeshBasicMaterial({
      color: 0x1e293b,
    }),
  );

  const packetWaveMat1 = material(
    new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.85,
    }),
  );

  const packetWaveMat2 = material(
    new THREE.MeshBasicMaterial({
      color: 0x34d399,
      transparent: true,
      opacity: 0.85,
    }),
  );

  const collisionFlashMat = material(
    new THREE.MeshBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.0,
    }),
  );

  // 1. Thicknet Coaxial Cable Bus
  const cableRadius = 0.05;
  const cableLength = 8.0;
  const cableGeo = geometry(new THREE.CylinderGeometry(cableRadius, cableRadius, cableLength, 32));
  const cableMesh = new THREE.Mesh(cableGeo, yellowJacket);
  cableMesh.rotation.z = Math.PI / 2;
  cableMesh.position.set(0, 0.4, -0.5);
  root.add(cableMesh);

  // 2. 50-Ohm Terminators at Ends
  const termGeo = geometry(new THREE.CylinderGeometry(0.09, 0.09, 0.35, 24));
  const termLeft = new THREE.Mesh(termGeo, terminationMetal);
  termLeft.rotation.z = Math.PI / 2;
  termLeft.position.set(-cableLength / 2 - 0.175, 0.4, -0.5);
  root.add(termLeft);

  const termRight = new THREE.Mesh(termGeo, terminationMetal);
  termRight.rotation.z = Math.PI / 2;
  termRight.position.set(cableLength / 2 + 0.175, 0.4, -0.5);
  root.add(termRight);

  // 3. Vampire Taps & Xerox Alto Workstations
  const createAltoStation = (xPos: number, _stationId: number) => {
    const stationGroup = new THREE.Group();
    stationGroup.position.set(xPos, 0, 0);

    // Vampire Tap on Cable
    const tapGeo = geometry(new THREE.BoxGeometry(0.22, 0.22, 0.28));
    const tapMesh = new THREE.Mesh(tapGeo, tapClampMaterial);
    tapMesh.position.set(0, 0.4, -0.5);
    stationGroup.add(tapMesh);

    // AUI Drop Cable
    const dropCableGeo = geometry(new THREE.CylinderGeometry(0.02, 0.02, 0.9, 16));
    const dropCable = new THREE.Mesh(dropCableGeo, altoDarkBezel);
    dropCable.rotation.x = Math.PI / 4;
    dropCable.position.set(0, 0.65, -0.2);
    stationGroup.add(dropCable);

    // Workstation Table Top
    const deskGeo = geometry(new THREE.BoxGeometry(1.8, 0.08, 1.2));
    const deskMat = material(new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.7 }));
    const deskMesh = new THREE.Mesh(deskGeo, deskMat);
    deskMesh.position.set(0, 0.9, 0.3);
    stationGroup.add(deskMesh);

    // Alto Portrait CRT Monitor
    const crtHousingGeo = geometry(new THREE.BoxGeometry(0.7, 0.95, 0.65));
    const crtHousing = new THREE.Mesh(crtHousingGeo, altoBeige);
    crtHousing.position.set(0, 1.45, 0.3);
    stationGroup.add(crtHousing);

    const crtScreenGeo = geometry(new THREE.PlaneGeometry(0.5, 0.75));
    const crtScreen = new THREE.Mesh(crtScreenGeo, crtPhosphor);
    crtScreen.position.set(0, 1.45, 0.63);
    stationGroup.add(crtScreen);

    // Alto Keyboard
    const kbGeo = geometry(new THREE.BoxGeometry(0.65, 0.05, 0.25));
    const kbMesh = new THREE.Mesh(kbGeo, altoBeige);
    kbMesh.position.set(0, 0.96, 0.65);
    stationGroup.add(kbMesh);

    // Alto 3-Button Optical Mouse
    const mouseGeo = geometry(new THREE.BoxGeometry(0.08, 0.04, 0.12));
    const mouseMesh = new THREE.Mesh(mouseGeo, altoDarkBezel);
    mouseMesh.position.set(0.45, 0.96, 0.65);
    stationGroup.add(mouseMesh);

    root.add(stationGroup);
    return { crtScreen };
  };

  const station1 = createAltoStation(-2.0, 1);
  const station2 = createAltoStation(2.0, 2);

  // 4. Propagating Wavefront Rings on Coaxial Bus
  const ringGeo = geometry(new THREE.TorusGeometry(0.08, 0.02, 16, 32));
  const waveRing1 = new THREE.Mesh(ringGeo, packetWaveMat1);
  waveRing1.rotation.y = Math.PI / 2;
  waveRing1.position.set(-2.0, 0.4, -0.5);
  root.add(waveRing1);

  const waveRing2 = new THREE.Mesh(ringGeo, packetWaveMat2);
  waveRing2.rotation.y = Math.PI / 2;
  waveRing2.position.set(2.0, 0.4, -0.5);
  root.add(waveRing2);

  // Collision Spark Sphere
  const sparkGeo = geometry(new THREE.SphereGeometry(0.25, 24, 24));
  const collisionSpark = new THREE.Mesh(sparkGeo, collisionFlashMat);
  collisionSpark.position.set(0, 0.4, -0.5);
  root.add(collisionSpark);

  // 5. Update Loop
  let waveProgress1 = 0;
  let waveProgress2 = 0;

  const updateState = (metrics: MetcalfeEthernetMetrics, _controls: MetcalfeEthernetControls) => {
    // Animate wave propagation
    waveProgress1 = (waveProgress1 + 0.025) % 1.0;
    waveProgress2 = (waveProgress2 + 0.025) % 1.0;

    const leftX = -cableLength / 2;
    const rightX = cableLength / 2;

    waveRing1.position.x = -2.0 + waveProgress1 * (rightX - -2.0);
    waveRing2.position.x = 2.0 - waveProgress2 * (2.0 - leftX);

    // Collision Flash
    if (metrics.collisionDetected) {
      collisionFlashMat.opacity = 0.9;
      (station1.crtScreen.material as THREE.MeshBasicMaterial).color.setHex(0xef4444);
      (station2.crtScreen.material as THREE.MeshBasicMaterial).color.setHex(0xef4444);
    } else {
      collisionFlashMat.opacity = 0.0;
      (station1.crtScreen.material as THREE.MeshBasicMaterial).color.setHex(0x0284c7);
      (station2.crtScreen.material as THREE.MeshBasicMaterial).color.setHex(0x059669);
    }
  };

  const dispose = () => {
    for (const g of geometries) g.dispose();
    for (const m of materials) m.dispose();
    root.clear();
  };

  return { root, updateState, dispose };
}
