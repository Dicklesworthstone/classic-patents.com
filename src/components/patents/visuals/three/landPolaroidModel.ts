import * as THREE from "three";
import { type LandPolaroidInput, stepLandPolaroidInstantFilm } from "@/physics/catalogKernels";

export interface LandPolaroidModelNodes {
  group: THREE.Group;
  cameraBody: THREE.Mesh;
  bellows: THREE.Group;
  rollerTop: THREE.Mesh;
  rollerBottom: THREE.Mesh;
  negativeSheet: THREE.Mesh;
  positiveSheet: THREE.Mesh;
  reagentGelLayer: THREE.Mesh;
  rupturablePod: THREE.Group;
  printSlide: THREE.Group;
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
    color: 0x475569,
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

  const podFoilMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.9,
    roughness: 0.25,
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

  const silverImageMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.4,
  });
  materials.push(silverImageMat);

  // 1. Polaroid Camera Body
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

  // 3. Pressure Roller Mechanism
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

  // 4. Rupturable Reagent Pod
  const rupturablePod = new THREE.Group();
  const podGeo = new THREE.BoxGeometry(2.4, 0.22, 0.5);
  geometries.push(podGeo);
  const podMesh = new THREE.Mesh(podGeo, podFoilMat);
  rupturablePod.add(podMesh);
  rupturablePod.position.set(0.6, 0, -0.6);
  group.add(rupturablePod);

  // 5. Multi-Layer Film Sandwich Stack
  const sheetWidth = 2.8;
  const sheetLength = 3.6;

  // Negative Sheet (Top)
  const negGeo = new THREE.BoxGeometry(sheetWidth, 0.04, sheetLength);
  geometries.push(negGeo);
  const negativeSheet = new THREE.Mesh(negGeo, negFilmMat);
  negativeSheet.position.set(0.6, 0.08, 1.4);
  negativeSheet.castShadow = true;
  group.add(negativeSheet);

  // Metered Viscous Gel Layer (Center)
  const gelGeo = new THREE.BoxGeometry(sheetWidth * 0.94, 0.02, sheetLength * 0.94);
  geometries.push(gelGeo);
  const reagentGelLayer = new THREE.Mesh(gelGeo, gelMat);
  reagentGelLayer.position.set(0.6, 0.0, 1.4);
  group.add(reagentGelLayer);

  // Positive Sheet (Bottom)
  const posGeo = new THREE.BoxGeometry(sheetWidth, 0.04, sheetLength);
  geometries.push(posGeo);
  const positiveSheet = new THREE.Mesh(posGeo, posPaperMat);
  positiveSheet.position.set(0.6, -0.08, 1.4);
  positiveSheet.receiveShadow = true;
  group.add(positiveSheet);

  // 6. Emerging Developing Print Slide
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

    // Pod crushing animation
    const isRuptured = (input.developmentTimeSec ?? 30) > 0;
    rupturablePod.scale.y = isRuptured ? 0.35 : 1.0;
    rupturablePod.position.y = isRuptured ? -0.05 : 0;

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
    rollerTop,
    rollerBottom,
    negativeSheet,
    positiveSheet,
    reagentGelLayer,
    rupturablePod,
    printSlide,
    materials,
    geometries,
    update,
    dispose,
  };
}
