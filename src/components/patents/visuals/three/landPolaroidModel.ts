import * as THREE from "three";
import { type LandPolaroidInput, stepLandPolaroidInstantFilm } from "@/physics/catalogKernels";

export interface LandPolaroidModelNodes {
  group: THREE.Group;
  cameraBody: THREE.Mesh;
  bellows: THREE.Group;
  lensAssembly: THREE.Group;
  foldingBed: THREE.Group;
  struts: THREE.Group;
  rollerTop: THREE.Mesh;
  rollerBottom: THREE.Mesh;
  negativeSheet: THREE.Mesh;
  positiveSheet: THREE.Mesh;
  reagentGelLayer: THREE.Mesh;
  meniscusWave: THREE.Mesh;
  rupturablePod: THREE.Group;
  printSlide: THREE.Group;
  spools: THREE.Group;
  materials: THREE.Material[];
  geometries: THREE.BufferGeometry[];
  update: (timeSec: number, input: LandPolaroidInput) => void;
  dispose: () => void;
}

export function createLandPolaroidModel(_initialInput?: LandPolaroidInput): LandPolaroidModelNodes {
  const group = new THREE.Group();
  const materials: THREE.Material[] = [];
  const geometries: THREE.BufferGeometry[] = [];

  // PBR Materials
  const cameraBodyMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    metalness: 0.85,
    roughness: 0.3,
  });
  materials.push(cameraBodyMat);

  const leatherMat = new THREE.MeshStandardMaterial({
    color: 0x78350f,
    metalness: 0.1,
    roughness: 0.8,
  });
  materials.push(leatherMat);

  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    metalness: 0.95,
    roughness: 0.15,
  });
  materials.push(chromeMat);

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xe2e8f0,
    transmission: 0.9,
    roughness: 0.05,
    metalness: 0.1,
    transparent: true,
    opacity: 0.8,
  });
  materials.push(glassMat);

  const podFoilMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.92,
    roughness: 0.2,
  });
  materials.push(podFoilMat);

  const negFilmMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.5,
  });
  materials.push(negFilmMat);

  const posPaperMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    roughness: 0.6,
  });
  materials.push(posPaperMat);

  const gelMat = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    transparent: true,
    opacity: 0.85,
    roughness: 0.1,
  });
  materials.push(gelMat);

  const meniscusMat = new THREE.MeshStandardMaterial({
    color: 0x34d399,
    emissive: 0x059669,
    emissiveIntensity: 0.5,
    transparent: true,
    opacity: 0.9,
    roughness: 0.1,
  });
  materials.push(meniscusMat);

  const silverImageMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.4,
  });
  materials.push(silverImageMat);

  // 1. Polaroid Model 95 Camera Body
  const bodyGeo = new THREE.BoxGeometry(4.2, 2.8, 1.4);
  geometries.push(bodyGeo);
  const cameraBody = new THREE.Mesh(bodyGeo, cameraBodyMat);
  cameraBody.position.set(-1.8, 0, 0);
  cameraBody.castShadow = true;
  cameraBody.receiveShadow = true;
  group.add(cameraBody);

  // 2. Leather Accordion Bellows
  const bellows = new THREE.Group();
  const foldCount = 5;
  for (let i = 0; i < foldCount; i++) {
    const scale = 1 - i * 0.12;
    const bGeo = new THREE.BoxGeometry(1.6 * scale, 1.2 * scale, 0.18);
    geometries.push(bGeo);
    const bMesh = new THREE.Mesh(bGeo, leatherMat);
    bMesh.position.set(-1.8, 0, 0.8 + i * 0.22);
    bellows.add(bMesh);
  }
  group.add(bellows);

  // 3. Front Standard & Optical Lens Assembly (US 2,543,181 Camera Standard)
  const lensAssembly = new THREE.Group();
  const lensBezelGeo = new THREE.CylinderGeometry(0.5, 0.55, 0.3, 32);
  lensBezelGeo.rotateX(Math.PI / 2);
  geometries.push(lensBezelGeo);
  const lensBezel = new THREE.Mesh(lensBezelGeo, chromeMat);
  lensAssembly.add(lensBezel);

  const glassGeo = new THREE.SphereGeometry(0.42, 24, 24);
  glassGeo.scale(1, 1, 0.3);
  geometries.push(glassGeo);
  const glassElem = new THREE.Mesh(glassGeo, glassMat);
  glassElem.position.set(0, 0, 0.1);
  lensAssembly.add(glassElem);

  lensAssembly.position.set(-1.8, 0, 1.9);
  group.add(lensAssembly);

  // 4. Folding Front Bed and Chrome Scissor Struts
  const foldingBed = new THREE.Group();
  const bedPlateGeo = new THREE.BoxGeometry(2.4, 0.1, 2.6);
  geometries.push(bedPlateGeo);
  const bedPlate = new THREE.Mesh(bedPlateGeo, cameraBodyMat);
  bedPlate.position.set(-1.8, -1.35, 1.3);
  foldingBed.add(bedPlate);
  group.add(foldingBed);

  const struts = new THREE.Group();
  const strutGeo = new THREE.BoxGeometry(0.06, 0.06, 2.2);
  geometries.push(strutGeo);

  const strutL = new THREE.Mesh(strutGeo, chromeMat);
  strutL.position.set(-2.8, -0.6, 1.0);
  strutL.rotation.x = -0.45;
  struts.add(strutL);

  const strutR = new THREE.Mesh(strutGeo, chromeMat);
  strutR.position.set(-0.8, -0.6, 1.0);
  strutR.rotation.x = -0.45;
  struts.add(strutR);
  group.add(struts);

  // 5. Internal Supply & Takeup Film Spools
  const spools = new THREE.Group();
  const spoolGeo = new THREE.CylinderGeometry(0.25, 0.25, 2.4, 24);
  geometries.push(spoolGeo);

  const negSpool = new THREE.Mesh(spoolGeo, chromeMat);
  negSpool.position.set(-3.5, 0.8, -0.2);
  spools.add(negSpool);

  const posSpool = new THREE.Mesh(spoolGeo, chromeMat);
  posSpool.position.set(-3.5, -0.8, -0.2);
  spools.add(posSpool);
  group.add(spools);

  // 6. Precision Pressure Roller Mechanism (Nip Rollers)
  const rollerRadius = 0.18;
  const rollerLength = 3.2;
  const rollerGeo = new THREE.CylinderGeometry(rollerRadius, rollerRadius, rollerLength, 32);
  rollerGeo.rotateZ(Math.PI / 2);
  geometries.push(rollerGeo);

  const rollerTop = new THREE.Mesh(rollerGeo, chromeMat);
  rollerTop.position.set(0.6, 0.28, 0);
  rollerTop.castShadow = true;
  group.add(rollerTop);

  const rollerBottom = new THREE.Mesh(rollerGeo, chromeMat);
  rollerBottom.position.set(0.6, -0.28, 0);
  rollerBottom.castShadow = true;
  group.add(rollerBottom);

  // 7. Rupturable Reagent Pod (Foil pouch containing developer reagent)
  const rupturablePod = new THREE.Group();
  const podGeo = new THREE.BoxGeometry(2.4, 0.22, 0.5);
  geometries.push(podGeo);
  const podMesh = new THREE.Mesh(podGeo, podFoilMat);
  rupturablePod.add(podMesh);
  rupturablePod.position.set(0.6, 0, -0.6);
  group.add(rupturablePod);

  // 8. Multi-Layer Film Sandwich Stack
  const sheetWidth = 2.8;
  const sheetLength = 3.6;

  // Negative Sheet (Photosensitive silver halide emulsion)
  const negGeo = new THREE.BoxGeometry(sheetWidth, 0.04, sheetLength);
  geometries.push(negGeo);
  const negativeSheet = new THREE.Mesh(negGeo, negFilmMat);
  negativeSheet.position.set(0.6, 0.08, 1.4);
  negativeSheet.castShadow = true;
  group.add(negativeSheet);

  // Metered Viscous Gel Layer (Center diffusion gap)
  const gelGeo = new THREE.BoxGeometry(sheetWidth * 0.94, 0.02, sheetLength * 0.94);
  geometries.push(gelGeo);
  const reagentGelLayer = new THREE.Mesh(gelGeo, gelMat);
  reagentGelLayer.position.set(0.6, 0.0, 1.4);
  group.add(reagentGelLayer);

  // Dynamic Meniscus Wave (Advancing reagent meniscus wedge between rollers)
  const meniscusGeo = new THREE.CylinderGeometry(0.12, 0.04, sheetWidth * 0.9, 16);
  meniscusGeo.rotateZ(Math.PI / 2);
  geometries.push(meniscusGeo);
  const meniscusWave = new THREE.Mesh(meniscusGeo, meniscusMat);
  meniscusWave.position.set(0.6, 0.0, 0.2);
  group.add(meniscusWave);

  // Positive Sheet (Receptive layer with silver precipitating nuclei)
  const posGeo = new THREE.BoxGeometry(sheetWidth, 0.04, sheetLength);
  geometries.push(posGeo);
  const positiveSheet = new THREE.Mesh(posGeo, posPaperMat);
  positiveSheet.position.set(0.6, -0.08, 1.4);
  positiveSheet.receiveShadow = true;
  group.add(positiveSheet);

  // 9. Emerging Developing Print Slide
  const printSlide = new THREE.Group();
  const frameGeo = new THREE.BoxGeometry(3.0, 0.02, 3.8);
  geometries.push(frameGeo);
  const frameMesh = new THREE.Mesh(frameGeo, posPaperMat);
  printSlide.add(frameMesh);

  const imageAreaGeo = new THREE.BoxGeometry(2.5, 0.025, 2.5);
  geometries.push(imageAreaGeo);
  const imageAreaMesh = new THREE.Mesh(imageAreaGeo, silverImageMat);
  imageAreaMesh.position.set(0, 0.01, -0.3);
  printSlide.add(imageAreaMesh);

  printSlide.position.set(2.4, -0.1, 2.8);
  printSlide.rotation.y = 0.2;
  group.add(printSlide);

  // Update loop
  const update = (timeSec: number, input: LandPolaroidInput) => {
    const state = stepLandPolaroidInstantFilm(input);

    // Rollers counter-rotation from kernel ω (0 when development time is 0)
    rollerTop.rotation.x = timeSec * state.rollerDisplayOmegaRadPerS;
    rollerBottom.rotation.x = -timeSec * state.rollerDisplayOmegaRadPerS;

    // Spools rotation during film transport
    negSpool.rotation.y = timeSec * state.rollerDisplayOmegaRadPerS * 0.7;
    posSpool.rotation.y = -timeSec * state.rollerDisplayOmegaRadPerS * 0.7;

    // Pod crushing animation
    const isRuptured = (input.developmentTimeSec ?? 30) > 0;
    rupturablePod.scale.y = isRuptured ? 0.35 : 1.0;
    rupturablePod.position.y = isRuptured ? -0.05 : 0;

    // Advancing meniscus wave position
    const devProgress = Math.min(1.0, (input.developmentTimeSec ?? 30) / 60);
    meniscusWave.position.z = 0.2 + devProgress * 2.4;
    meniscusWave.visible = isRuptured && devProgress < 0.95;

    // Developing image density tone
    const posDensity = state.positiveSilverDensity;
    const toneVal = Math.max(0.08, 0.95 - (posDensity / 2.1) * 0.85);
    silverImageMat.color.setRGB(toneVal, toneVal * 0.96, toneVal * 0.9);

    // Gel layer spreading glow
    const gelAlpha = 0.4 + 0.5 * (state.meniscusSpreadUniformityPercent / 100);
    gelMat.opacity = gelAlpha;
  };

  const dispose = () => {
    for (const g of geometries) g.dispose();
    for (const m of materials) m.dispose();
  };

  return {
    group,
    cameraBody,
    bellows,
    lensAssembly,
    foldingBed,
    struts,
    rollerTop,
    rollerBottom,
    negativeSheet,
    positiveSheet,
    reagentGelLayer,
    meniscusWave,
    rupturablePod,
    printSlide,
    spools,
    materials,
    geometries,
    update,
    dispose,
  };
}
