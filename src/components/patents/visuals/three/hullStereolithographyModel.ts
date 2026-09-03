import * as THREE from "three";
import type {
  HullStereolithographyControls,
  HullStereolithographyTelemetry,
} from "@/physics/hullStereolithographyKernel";

export const HULL_RESIN_SURFACE_Y = 1.42;
export const HULL_RECOAT_DISPLAY_TRAVEL = 0.28;
export const HULL_DISPLAY_LAMINA_HEIGHT = 0.055;
export const HULL_PLATFORM_HALF_THICKNESS = 0.04;

export interface HullStereolithography3DObjects {
  root: THREE.Group;
  floorMesh: THREE.Mesh;
  vatBaseMesh: THREE.Mesh;
  resinMesh: THREE.Mesh;
  platformGroup: THREE.Group;
  partGroup: THREE.Group;
  laminaMeshes: THREE.Mesh[];
  activeLaminaMesh: THREE.Mesh;
  platformCarriageNut: THREE.Mesh;
  elevatorLeadScrew: THREE.Mesh;
  scannerGroup: THREE.Group;
  scannerSupportGroup: THREE.Group;
  plotterXCarriage: THREE.Group;
  lensCarriageGroup: THREE.Group;
  fiberLine: THREE.Line;
  uvBeamLine: THREE.Line;
  uvSpotMesh: THREE.Mesh;
  shutterBladeMesh: THREE.Mesh;
  update: (
    controls: HullStereolithographyControls,
    telemetry: HullStereolithographyTelemetry,
    simTimeSec?: number,
  ) => void;
  dispose: () => void;
}

export function createHullStereolithographyModel(): HullStereolithography3DObjects {
  const root = new THREE.Group();
  root.name = "HullStereolithographyModel";

  const materials: THREE.Material[] = [];
  const geometries: THREE.BufferGeometry[] = [];
  const material = <T extends THREE.Material>(value: T): T => {
    materials.push(value);
    return value;
  };
  const geometry = <T extends THREE.BufferGeometry>(value: T): T => {
    geometries.push(value);
    return value;
  };

  const darkMetal = material(
    new THREE.MeshStandardMaterial({ color: 0x292524, metalness: 0.78, roughness: 0.3 }),
  );
  const brightMetal = material(
    new THREE.MeshStandardMaterial({ color: 0xb8b4ad, metalness: 0.88, roughness: 0.22 }),
  );
  const blackHousing = material(
    new THREE.MeshStandardMaterial({ color: 0x171412, metalness: 0.42, roughness: 0.48 }),
  );
  const glass = material(
    new THREE.MeshPhysicalMaterial({
      color: 0xdbeafe,
      roughness: 0.08,
      transmission: 0.8,
      thickness: 0.04,
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
    }),
  );
  const resin = material(
    new THREE.MeshPhysicalMaterial({
      color: 0x0ea5e9,
      roughness: 0.22,
      transmission: 0.46,
      transparent: true,
      opacity: 0.48,
      depthWrite: false,
    }),
  );
  const cured = material(
    new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.42, metalness: 0.08 }),
  );
  const curedAlternate = material(
    new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.38, metalness: 0.06 }),
  );
  const activeCure = material(
    new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xf59e0b,
      emissiveIntensity: 1.2,
      roughness: 0.3,
    }),
  );
  const violet = material(new THREE.LineBasicMaterial({ color: 0xe879f9 }));
  const fiberMaterial = material(new THREE.LineBasicMaterial({ color: 0xf8fafc }));
  const spotMaterial = material(
    new THREE.MeshBasicMaterial({ color: 0xf0abfc, transparent: true, opacity: 0.95 }),
  );
  const floorMaterial = material(
    new THREE.MeshStandardMaterial({ color: 0xddd6ce, roughness: 0.82, metalness: 0.02 }),
  );

  const floorMesh = new THREE.Mesh(geometry(new THREE.BoxGeometry(3.6, 0.1, 3.25)), floorMaterial);
  floorMesh.name = "Museum floor supporting the vat";
  floorMesh.position.y = -0.05;
  floorMesh.receiveShadow = true;
  root.add(floorMesh);

  const vatGroup = new THREE.Group();
  vatGroup.name = "Container 21";
  const vatBaseMesh = new THREE.Mesh(geometry(new THREE.BoxGeometry(2.5, 0.12, 2.2)), darkMetal);
  vatBaseMesh.name = "Container 21 base";
  vatBaseMesh.position.y = 0.06;
  const vatFront = new THREE.Mesh(geometry(new THREE.BoxGeometry(2.3, 1.44, 0.06)), glass);
  vatFront.name = "Container 21 transparent front wall";
  vatFront.position.set(0, 0.84, 1.03);
  const vatBack = new THREE.Mesh(geometry(new THREE.BoxGeometry(2.3, 1.44, 0.06)), darkMetal);
  vatBack.position.set(0, 0.84, -1.03);
  const vatLeft = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.06, 1.44, 2.0)), darkMetal);
  vatLeft.position.set(-1.15, 0.84, 0);
  const vatRight = vatLeft.clone();
  vatRight.position.x = 1.15;
  vatGroup.add(vatBaseMesh, vatFront, vatBack, vatLeft, vatRight);

  const resinMesh = new THREE.Mesh(geometry(new THREE.BoxGeometry(2.22, 1.27, 1.94)), resin);
  resinMesh.name = "UV-curable liquid 22 with fixed working surface 23";
  resinMesh.position.set(0, 0.785, 0);
  resinMesh.renderOrder = 2;
  vatGroup.add(resinMesh);
  root.add(vatGroup);

  const elevatorGroup = new THREE.Group();
  elevatorGroup.name = "Elevator platform 29 and translational support";
  const elevatorLeadScrew = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.035, 0.035, 1.95, 18)),
    brightMetal,
  );
  elevatorLeadScrew.name = "Illustrative prismatic elevator guide";
  elevatorLeadScrew.position.set(0, 1.095, -0.98);
  const lowerBearing = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.09, 0.09, 0.12, 20)),
    darkMetal,
  );
  lowerBearing.position.set(0, 0.18, -0.98);
  const upperBearing = lowerBearing.clone();
  upperBearing.position.y = 2.01;
  const elevatorColumn = new THREE.Mesh(
    geometry(new THREE.BoxGeometry(0.18, 1.95, 0.13)),
    darkMetal,
  );
  elevatorColumn.position.set(0, 1.095, -1.055);
  elevatorGroup.add(elevatorColumn, elevatorLeadScrew, lowerBearing, upperBearing);

  const platformGroup = new THREE.Group();
  platformGroup.name = "Platform 29 moving with its carriage";
  const platformMesh = new THREE.Mesh(
    geometry(new THREE.BoxGeometry(1.28, HULL_PLATFORM_HALF_THICKNESS * 2, 1.2)),
    brightMetal,
  );
  platformMesh.name = "Object-support platform 29";
  const platformCarriageNut = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.1, 0.1, 0.18, 20)),
    brightMetal,
  );
  platformCarriageNut.name = "Platform carriage surrounding elevator guide";
  platformCarriageNut.position.set(0, 0, -0.98);
  const platformRearBracket = new THREE.Mesh(
    geometry(new THREE.BoxGeometry(0.23, 0.08, 0.37)),
    brightMetal,
  );
  platformRearBracket.name = "Continuous platform-to-carriage bracket";
  platformRearBracket.position.set(0, 0, -0.785);
  platformGroup.add(platformMesh, platformCarriageNut, platformRearBracket);

  const partGroup = new THREE.Group();
  partGroup.name = "Object 30 assembled from touching laminae 30a, 30b, 30c";
  const laminaMeshes: THREE.Mesh[] = [];
  for (let index = 0; index < 12; index++) {
    const radiusBottom = 0.49 - index * 0.012;
    const radiusTop = Math.max(0.33, radiusBottom - 0.012);
    const lamina = new THREE.Mesh(
      geometry(new THREE.CylinderGeometry(radiusTop, radiusBottom, HULL_DISPLAY_LAMINA_HEIGHT, 32)),
      index % 2 === 0 ? cured : curedAlternate,
    );
    lamina.name = `Integrated display lamina ${index + 1}`;
    lamina.position.y =
      HULL_PLATFORM_HALF_THICKNESS +
      HULL_DISPLAY_LAMINA_HEIGHT / 2 +
      index * HULL_DISPLAY_LAMINA_HEIGHT;
    lamina.castShadow = true;
    partGroup.add(lamina);
    laminaMeshes.push(lamina);
  }
  const activeLaminaMesh = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.34, 0.34, 0.008, 32)),
    activeCure,
  );
  activeLaminaMesh.name = "Illuminated cross-section at working surface 23";
  partGroup.add(activeLaminaMesh);
  platformGroup.add(partGroup);
  elevatorGroup.add(platformGroup);
  root.add(elevatorGroup);

  const scannerSupportGroup = new THREE.Group();
  scannerSupportGroup.name = "Container-anchored plotter support";
  for (const x of [-1.03, 1.03]) {
    const upright = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.09, 2.35, 0.09)), brightMetal);
    upright.name = `Plotter support upright ${x < 0 ? "left" : "right"}`;
    upright.position.set(x, 1.295, -1.02);
    scannerSupportGroup.add(upright);
  }
  const crossbeam = new THREE.Mesh(geometry(new THREE.BoxGeometry(2.15, 0.12, 0.12)), brightMetal);
  crossbeam.name = "Plotter X-axis crossbeam";
  crossbeam.position.set(0, 2.45, -1.02);
  scannerSupportGroup.add(crossbeam);

  const scannerGroup = new THREE.Group();
  scannerGroup.name = "Preferred 350 W mercury-lamp source 26";
  const lampHousing = new THREE.Mesh(
    geometry(new THREE.BoxGeometry(0.72, 0.32, 0.42)),
    blackHousing,
  );
  lampHousing.name = "Mercury short-arc lamp housing";
  lampHousing.position.set(-0.66, 2.67, -1.02);
  const waterCoolingCollar = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.1, 0.1, 0.18, 20)),
    brightMetal,
  );
  waterCoolingCollar.name = "Water-cooled fiber input collar";
  waterCoolingCollar.rotation.z = Math.PI / 2;
  waterCoolingCollar.position.set(-0.25, 2.67, -1.02);
  const shutterBladeMesh = new THREE.Mesh(
    geometry(new THREE.BoxGeometry(0.02, 0.19, 0.2)),
    darkMetal,
  );
  shutterBladeMesh.name = "Electronically controlled shutter blade";
  shutterBladeMesh.position.set(-0.33, 2.67, -1.02);
  scannerGroup.add(lampHousing, waterCoolingCollar, shutterBladeMesh);
  scannerSupportGroup.add(scannerGroup);

  const plotterXCarriage = new THREE.Group();
  plotterXCarriage.name = "Computer-driven plotter X carriage";
  const xCarriageBlock = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.2, 0.2, 0.2)), darkMetal);
  xCarriageBlock.position.set(0, 2.4, -1.02);
  const zRail = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.08, 0.08, 1.78)), brightMetal);
  zRail.name = "Plotter carriage Z rail";
  zRail.position.set(0, 2.34, -0.17);
  plotterXCarriage.add(xCarriageBlock, zRail);

  const lensCarriageGroup = new THREE.Group();
  lensCarriageGroup.name = "Fiber output, shutter path, and quartz lens tube";
  const zCarriageBlock = new THREE.Mesh(
    geometry(new THREE.BoxGeometry(0.18, 0.16, 0.18)),
    darkMetal,
  );
  zCarriageBlock.position.y = 2.34;
  const lensTube = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.055, 0.08, 0.43, 20)),
    blackHousing,
  );
  lensTube.name = "Quartz-lens tube carried by the plotter";
  lensTube.position.y = 2.085;
  lensCarriageGroup.add(zCarriageBlock, lensTube);
  plotterXCarriage.add(lensCarriageGroup);
  scannerSupportGroup.add(plotterXCarriage);
  root.add(scannerSupportGroup);

  const fiberGeometry = geometry(
    new THREE.BufferGeometry().setFromPoints(Array.from({ length: 5 }, () => new THREE.Vector3())),
  );
  const fiberLine = new THREE.Line(fiberGeometry, fiberMaterial);
  fiberLine.name = "Continuous one-metre UV-transmitting fiber bundle";
  root.add(fiberLine);

  const uvBeamGeometry = geometry(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]),
  );
  const uvBeamLine = new THREE.Line(uvBeamGeometry, violet);
  uvBeamLine.name = "Source-described UV spot light path";
  root.add(uvBeamLine);

  const uvSpotMesh = new THREE.Mesh(geometry(new THREE.CircleGeometry(0.045, 24)), spotMaterial);
  uvSpotMesh.name = "Spot 27 at fixed working surface 23";
  uvSpotMesh.rotation.x = -Math.PI / 2;
  root.add(uvSpotMesh);

  function update(
    controls: HullStereolithographyControls,
    telemetry: HullStereolithographyTelemetry,
    _simTimeSec = 0,
  ) {
    const count = Math.max(1, Math.min(12, Math.round(controls.displayLaminaCount)));
    for (let index = 0; index < laminaMeshes.length; index++) {
      laminaMeshes[index].visible = index < count;
    }

    const localStackTop = HULL_PLATFORM_HALF_THICKNESS + count * HULL_DISPLAY_LAMINA_HEIGHT;
    platformGroup.position.y =
      HULL_RESIN_SURFACE_Y -
      localStackTop -
      telemetry.platformDepthFraction * HULL_RECOAT_DISPLAY_TRAVEL;
    activeLaminaMesh.position.y = localStackTop + 0.004;
    activeLaminaMesh.visible = telemetry.exposureAtWorkingSurface;

    const scanX = telemetry.spotXFraction * 0.72;
    const scanZ = telemetry.spotZFraction * 0.58;
    plotterXCarriage.position.x = scanX;
    lensCarriageGroup.position.z = scanZ;

    uvSpotMesh.position.set(scanX, HULL_RESIN_SURFACE_Y + 0.006, scanZ);
    uvSpotMesh.visible = telemetry.exposureAtWorkingSurface;
    uvBeamLine.visible = telemetry.exposureAtWorkingSurface;
    const beamPositions = uvBeamGeometry.getAttribute("position") as THREE.BufferAttribute;
    beamPositions.setXYZ(0, scanX, 1.87, scanZ);
    beamPositions.setXYZ(1, scanX, HULL_RESIN_SURFACE_Y + 0.012, scanZ);
    beamPositions.needsUpdate = true;

    const fiberPositions = fiberGeometry.getAttribute("position") as THREE.BufferAttribute;
    fiberPositions.setXYZ(0, -0.25, 2.67, -1.02);
    fiberPositions.setXYZ(1, -0.05, 2.82, -0.96);
    fiberPositions.setXYZ(2, scanX, 2.73, -0.82);
    fiberPositions.setXYZ(3, scanX, 2.5, scanZ - 0.08);
    fiberPositions.setXYZ(4, scanX, 2.3, scanZ);
    fiberPositions.needsUpdate = true;

    shutterBladeMesh.rotation.z = telemetry.shutterOpen ? Math.PI / 2 : 0;
  }

  function dispose() {
    for (const entry of new Set(materials)) entry.dispose();
    for (const entry of new Set(geometries)) entry.dispose();
  }

  return {
    root,
    floorMesh,
    vatBaseMesh,
    resinMesh,
    platformGroup,
    partGroup,
    laminaMeshes,
    activeLaminaMesh,
    platformCarriageNut,
    elevatorLeadScrew,
    scannerGroup,
    scannerSupportGroup,
    plotterXCarriage,
    lensCarriageGroup,
    fiberLine,
    uvBeamLine,
    uvSpotMesh,
    shutterBladeMesh,
    update,
    dispose,
  };
}
