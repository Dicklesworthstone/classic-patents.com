import * as THREE from "three";
import { type LandPolaroidInput, stepLandPolaroidInstantFilm } from "@/physics/catalogKernels";

export interface LandPolaroidModelNodes {
  group: THREE.Group;
  foundation: THREE.Mesh;
  processBed: THREE.Group;
  incomingBed: THREE.Mesh;
  outgoingBed: THREE.Mesh;
  bearingFrames: THREE.Group;
  rollerTop: THREE.Mesh;
  rollerBottom: THREE.Mesh;
  negativeSheet: THREE.Mesh;
  positiveSheet: THREE.Mesh;
  attachedSeams: THREE.Group;
  reagentGelLayer: THREE.Mesh;
  meniscusWave: THREE.Mesh;
  rupturablePod: THREE.Group;
  positiveImage: THREE.Mesh;
  materials: THREE.Material[];
  geometries: THREE.BufferGeometry[];
  update: (timeSec: number, input: LandPolaroidInput) => void;
  setCutaway: (cutaway: boolean) => void;
  dispose: () => void;
}

const FILM_Y = 1;
const ROLLER_Z = 0;

export function createLandPolaroidModel(
  initialInput: LandPolaroidInput = {},
): LandPolaroidModelNodes {
  const group = new THREE.Group();
  group.name = "US 2543181 Figure 1 and Figure 14 photographic product";
  const materials: THREE.Material[] = [];
  const geometries: THREE.BufferGeometry[] = [];

  const material = (options: THREE.MeshStandardMaterialParameters) => {
    const result = new THREE.MeshStandardMaterial(options);
    materials.push(result);
    return result;
  };
  const baseMaterial = material({ color: 0x334155, metalness: 0.7, roughness: 0.35 });
  const steelMaterial = material({ color: 0xcbd5e1, metalness: 0.92, roughness: 0.18 });
  const bearingMaterial = material({ color: 0x475569, metalness: 0.82, roughness: 0.28 });
  const negativeMaterial = material({
    color: 0x172033,
    roughness: 0.5,
    transparent: true,
    opacity: 0.96,
    side: THREE.DoubleSide,
  });
  const positiveMaterial = material({ color: 0xf5f0df, roughness: 0.72 });
  const attachmentMaterial = material({ color: 0xa16207, roughness: 0.58 });
  const podMaterial = material({ color: 0xd97706, metalness: 0.72, roughness: 0.28 });
  const reagentMaterial = material({
    color: 0x10b981,
    emissive: 0x065f46,
    emissiveIntensity: 0.25,
    transparent: true,
    opacity: 0.68,
    roughness: 0.18,
  });
  const meniscusMaterial = material({
    color: 0x6ee7b7,
    emissive: 0x10b981,
    emissiveIntensity: 0.7,
    transparent: true,
    opacity: 0.9,
  });
  const imageMaterial = material({ color: 0x1f2937, roughness: 0.55 });

  const addBox = (
    name: string,
    size: [number, number, number],
    position: [number, number, number],
    boxMaterial: THREE.Material,
    parent: THREE.Object3D = group,
  ) => {
    const geometry = new THREE.BoxGeometry(...size);
    geometries.push(geometry);
    const mesh = new THREE.Mesh(geometry, boxMaterial);
    mesh.name = name;
    mesh.position.set(...position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };

  // The museum model is an enlarged section of the claimed product, supported
  // by a presentation bed. It intentionally does not invent a consumer camera.
  const foundation = addBox(
    "supported exhibit foundation",
    [7, 0.24, 7.2],
    [0, 0.12, 0.35],
    baseMaterial,
  );
  const processBed = new THREE.Group();
  processBed.name = "split film support platen clear of roller nip";
  group.add(processBed);
  const incomingBed = addBox(
    "incoming film support platen",
    [3, 0.16, 2.2],
    [0, 0.87, -1.55],
    baseMaterial,
    processBed,
  );
  const outgoingBed = addBox(
    "outgoing film support platen",
    [3, 0.16, 3.1],
    [0, 0.87, 1.95],
    baseMaterial,
    processBed,
  );
  for (const x of [-1.25, 1.25]) {
    for (const z of [-2.15, 2.95]) {
      addBox("platen support leg", [0.18, 0.55, 0.18], [x, 0.515, z], baseMaterial);
    }
  }

  const bearingFrames = new THREE.Group();
  bearingFrames.name = "roller bearing frames seated on foundation";
  group.add(bearingFrames);
  for (const x of [-1.82, 1.82]) {
    addBox(
      "roller frame upright",
      [0.24, 1.38, 0.46],
      [x, 0.93, ROLLER_Z],
      bearingMaterial,
      bearingFrames,
    );
    for (const y of [0.665, 1.335]) {
      const bearingGeometry = new THREE.CylinderGeometry(0.18, 0.18, 0.18, 24);
      bearingGeometry.rotateZ(Math.PI / 2);
      geometries.push(bearingGeometry);
      const bearing = new THREE.Mesh(bearingGeometry, steelMaterial);
      bearing.name = "roller journal bearing";
      bearing.position.set(x > 0 ? -0.13 : 0.13, y - 0.93, 0);
      bearingFrames.children[bearingFrames.children.length - 1]?.add(bearing);
    }
  }

  const rollerGeometry = new THREE.CylinderGeometry(0.285, 0.285, 3.4, 40);
  rollerGeometry.rotateZ(Math.PI / 2);
  geometries.push(rollerGeometry);
  const markerGeometry = new THREE.BoxGeometry(0.05, 0.38, 0.055);
  geometries.push(markerGeometry);
  const rollerTop = new THREE.Mesh(rollerGeometry, steelMaterial);
  rollerTop.name = "upper pressure roller";
  rollerTop.position.set(0, 1.335, ROLLER_Z);
  const topMarker = new THREE.Mesh(markerGeometry, attachmentMaterial);
  topMarker.position.x = 1.715;
  rollerTop.add(topMarker);
  group.add(rollerTop);
  const rollerBottom = new THREE.Mesh(rollerGeometry, steelMaterial);
  rollerBottom.name = "lower pressure roller";
  rollerBottom.position.set(0, 0.665, ROLLER_Z);
  const bottomMarker = new THREE.Mesh(markerGeometry, attachmentMaterial);
  bottomMarker.position.x = -1.715;
  rollerBottom.add(bottomMarker);
  group.add(rollerBottom);

  // Claim 1 requires the sensitized layer, transfer-image base, and container
  // to be attached as one product. The long edge seams make that load path
  // visible rather than leaving two unsupported sheets floating in space.
  const negativeSheet = addBox(
    "photosensitive layer and transparent base",
    [2.8, 0.03, 5.7],
    [0, 1.035, 0.45],
    negativeMaterial,
  );
  const positiveSheet = addBox(
    "transfer-image base layer",
    [2.8, 0.03, 5.7],
    [0, 0.965, 0.45],
    positiveMaterial,
  );
  const attachedSeams = new THREE.Group();
  attachedSeams.name = "attached product edge seams";
  group.add(attachedSeams);
  for (const x of [-1.37, 1.37]) {
    addBox(
      "layer attachment seam",
      [0.06, 0.1, 5.7],
      [x, FILM_Y, 0.45],
      attachmentMaterial,
      attachedSeams,
    );
  }

  const reagentGelLayer = addBox(
    "released processing liquid between superposed layers",
    [2.58, 0.026, 2.85],
    [0, FILM_Y, 1.62],
    reagentMaterial,
  );
  const meniscusWave = addBox(
    "advancing reagent boundary",
    [2.58, 0.042, 0.1],
    [0, FILM_Y, 0.22],
    meniscusMaterial,
  );
  const positiveImage = addBox(
    "transfer image forming on receiving layer",
    [2.18, 0.012, 2.18],
    [0, 1.006, 1.72],
    imageMaterial,
  );

  const rupturablePod = new THREE.Group();
  rupturablePod.name = "container 218 attached across the product";
  const podBody = addBox(
    "liquid container 218",
    [2.64, 0.15, 0.58],
    [0, 0, 0],
    podMaterial,
    rupturablePod,
  );
  podBody.castShadow = true;
  for (const x of [-1.34, 1.34]) {
    addBox("container end seal", [0.08, 0.18, 0.64], [x, 0, 0], attachmentMaterial, rupturablePod);
  }
  rupturablePod.position.set(0, FILM_Y, -0.46);
  group.add(rupturablePod);

  let cutaway = false;
  const update = (_timeSec: number, input: LandPolaroidInput) => {
    const state = stepLandPolaroidInstantFilm(input);
    const developmentTime = Number.isFinite(input.developmentTimeSec)
      ? Math.max(0, Math.min(60, input.developmentTimeSec as number))
      : 30;
    const spreadTime = Math.min(3, developmentTime);
    const rollerAngle = spreadTime * 3;
    rollerTop.rotation.x = rollerAngle;
    rollerBottom.rotation.x = -rollerAngle;

    if (state.claim1PathActive) {
      const ruptureProgress = Math.min(1, developmentTime / 3);
      rupturablePod.position.set(0, FILM_Y, -0.46);
      rupturablePod.rotation.set(0, 0, 0);
      rupturablePod.scale.set(1, 1 - ruptureProgress * 0.58, 1);
      attachedSeams.visible = true;
      reagentGelLayer.visible = developmentTime > 0;
      positiveImage.visible = developmentTime > 0;
      meniscusWave.visible = developmentTime > 0 && developmentTime < 60;
    } else {
      // The removed claim element still obeys gravity: the detached container
      // is placed on the foundation beside the supported product.
      rupturablePod.position.set(2.55, 0.33, -1.65);
      rupturablePod.rotation.set(0, Math.PI / 2, 0);
      rupturablePod.scale.set(1, 1, 1);
      attachedSeams.visible = false;
      reagentGelLayer.visible = false;
      positiveImage.visible = false;
      meniscusWave.visible = false;
    }

    const progress = Math.min(1, developmentTime / 60);
    meniscusWave.position.z = 0.22 + progress * 2.55;
    reagentMaterial.opacity = cutaway
      ? 0.82
      : 0.45 + 0.28 * (state.meniscusSpreadUniformityPercent / 100);
    const tone = Math.max(0.08, 0.93 - (state.positiveSilverDensity / 2.1) * 0.82);
    imageMaterial.color.setRGB(tone, tone * 0.96, tone * 0.88);
  };

  const setCutaway = (nextCutaway: boolean) => {
    cutaway = nextCutaway;
    negativeMaterial.opacity = nextCutaway ? 0.16 : 0.96;
    negativeMaterial.depthWrite = !nextCutaway;
  };

  const dispose = () => {
    for (const geometry of geometries) geometry.dispose();
    for (const item of materials) item.dispose();
  };

  const model = {
    group,
    foundation,
    processBed,
    incomingBed,
    outgoingBed,
    bearingFrames,
    rollerTop,
    rollerBottom,
    negativeSheet,
    positiveSheet,
    attachedSeams,
    reagentGelLayer,
    meniscusWave,
    rupturablePod,
    positiveImage,
    materials,
    geometries,
    update,
    setCutaway,
    dispose,
  };
  model.update(0, initialInput);
  return model;
}
