import * as THREE from "three";

/** Procedural reconstruction of the source-named Carrier air washer. */
export interface CarrierAirConditionerModelNodes {
  root: THREE.Group;
  solidCasingMesh: THREE.Mesh;
  cutawayCasingGroup: THREE.Group;
  sprayHeadersGroup: THREE.Group;
  sprayNozzles: THREE.Mesh[];
  separatorGroup: THREE.Group;
  separatorPlates: THREE.Group[];
  basin: THREE.Mesh;
  filter: THREE.Mesh;
  fanRotor: THREE.Group;
  airDroplets: THREE.Points;
}

export interface CarrierAirConditionerMaterials {
  casing: THREE.MeshStandardMaterial;
  plate: THREE.MeshStandardMaterial;
  liquid: THREE.MeshStandardMaterial;
  brass: THREE.MeshStandardMaterial;
  droplet: THREE.PointsMaterial;
}

export interface CarrierAirConditionerModelResult {
  root: THREE.Group;
  nodes: CarrierAirConditionerModelNodes;
  materials: CarrierAirConditionerMaterials;
  dispose: () => void;
}

const DROPLET_COUNT = 96;

function hash(index: number, channel: number): number {
  const value = Math.sin((index + 1) * 12.9898 + (channel + 1) * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

export function buildCarrierAirConditionerModel(): CarrierAirConditionerModelResult {
  const root = new THREE.Group();
  const geometries: THREE.BufferGeometry[] = [];
  const materialsToDispose: THREE.Material[] = [];
  const trackGeo = <T extends THREE.BufferGeometry>(geometry: T): T => {
    geometries.push(geometry);
    return geometry;
  };
  const trackMat = <T extends THREE.Material>(material: T): T => {
    materialsToDispose.push(material);
    return material;
  };
  const materials: CarrierAirConditionerMaterials = {
    casing: trackMat(new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.7, roughness: 0.45 })),
    plate: trackMat(new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.55, roughness: 0.4 })),
    liquid: trackMat(new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.55, roughness: 0.15 })),
    brass: trackMat(new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.25 })),
    droplet: trackMat(new THREE.PointsMaterial({ color: 0x7dd3fc, size: 0.12, transparent: true, opacity: 0.7 })),
  };

  const solidCasingMesh = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(7, 3.1, 3.4)), materials.casing);
  solidCasingMesh.position.set(0, 0.3, 0);
  solidCasingMesh.visible = false;
  root.add(solidCasingMesh);

  const cutawayCasingGroup = new THREE.Group();
  const top = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(7, 0.08, 3.4)), materials.casing);
  top.position.set(0, 1.85, 0);
  cutawayCasingGroup.add(top);
  const back = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(7, 3.1, 0.08)), materials.casing);
  back.position.set(0, 0.3, -1.66);
  cutawayCasingGroup.add(back);
  root.add(cutawayCasingGroup);

  const basin = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(5.7, 0.32, 3.0)), materials.liquid);
  basin.position.set(-0.5, -1.35, 0);
  root.add(basin);
  const filter = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.5, 0.1, 1.5)), materials.brass);
  filter.position.set(2.1, -1.15, 0);
  root.add(filter);

  const sprayHeadersGroup = new THREE.Group();
  const sprayNozzles: THREE.Mesh[] = [];
  const header = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.06, 0.06, 2.5, 12)), materials.brass);
  header.position.set(-2.4, 0.25, 0);
  sprayHeadersGroup.add(header);
  for (let n = 0; n < 5; n += 1) {
    const nozzle = new THREE.Mesh(trackGeo(new THREE.ConeGeometry(0.08, 0.18, 10)), materials.brass);
    nozzle.rotation.z = -Math.PI / 2;
    nozzle.position.set(-2.52, -0.65 + n * 0.45, 0);
    sprayHeadersGroup.add(nozzle);
    sprayNozzles.push(nozzle);
  }
  root.add(sprayHeadersGroup);

  const separatorGroup = new THREE.Group();
  const separatorPlates: THREE.Group[] = [];
  for (let plateIndex = 0; plateIndex < 6; plateIndex += 1) {
    const plate = new THREE.Group();
    const z = -1.15 + plateIndex * 0.46;
    for (let face = 0; face < 4; face += 1) {
      const segment = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.78, 2.4, 0.055)), materials.plate);
      segment.position.set(-0.9 + face * 0.38, 0.2, z);
      segment.rotation.z = face % 2 === 0 ? -0.48 : 0.48;
      plate.add(segment);
      if (face > 1) {
        const flange = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.3, 0.06, 0.08)), materials.brass);
        flange.position.set(segment.position.x + 0.18, segment.position.y - 0.4, z + 0.05);
        flange.rotation.z = segment.rotation.z;
        plate.add(flange);
      }
    }
    separatorGroup.add(plate);
    separatorPlates.push(plate);
  }
  root.add(separatorGroup);

  const fanRotor = new THREE.Group();
  fanRotor.position.set(2.7, 0.35, 0);
  const fanHub = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.34, 0.34, 0.3, 16)), materials.brass);
  fanHub.rotation.x = Math.PI / 2;
  fanRotor.add(fanHub);
  for (let bladeIndex = 0; bladeIndex < 12; bladeIndex += 1) {
    const blade = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.08, 1.1, 0.12)), materials.plate);
    const angle = (bladeIndex / 12) * Math.PI * 2;
    blade.position.set(Math.cos(angle) * 0.75, Math.sin(angle) * 0.75, 0);
    blade.rotation.z = angle;
    fanRotor.add(blade);
  }
  root.add(fanRotor);

  const dropletGeometry = trackGeo(new THREE.BufferGeometry());
  const dropletPositions = new Float32Array(DROPLET_COUNT * 3);
  for (let i = 0; i < DROPLET_COUNT; i += 1) {
    dropletPositions[i * 3] = -2.1 + hash(i, 0) * 3.8;
    dropletPositions[i * 3 + 1] = -0.8 + hash(i, 1) * 2.0;
    dropletPositions[i * 3 + 2] = -1.2 + hash(i, 2) * 2.4;
  }
  dropletGeometry.setAttribute("position", new THREE.BufferAttribute(dropletPositions, 3));
  const airDroplets = new THREE.Points(dropletGeometry, materials.droplet);
  root.add(airDroplets);

  const dispose = () => {
    geometries.forEach((geometry) => geometry.dispose());
    materialsToDispose.forEach((material) => material.dispose());
  };
  return {
    root,
    nodes: { root, solidCasingMesh, cutawayCasingGroup, sprayHeadersGroup, sprayNozzles, separatorGroup, separatorPlates, basin, filter, fanRotor, airDroplets },
    materials,
    dispose,
  };
}

export function updateCarrierAirConditionerKinematics(
  nodes: CarrierAirConditionerModelNodes,
  materials: CarrierAirConditionerMaterials,
  dt: number,
  airflowCfm: number,
  sprayRatePct: number,
  separatorFaces: number,
  cutawayMode: boolean,
  showSpray: boolean,
) {
  nodes.solidCasingMesh.visible = !cutawayMode;
  nodes.cutawayCasingGroup.visible = cutawayMode;
  nodes.fanRotor.rotation.z -= (airflowCfm / 15000) * dt * 2.5;
  nodes.separatorPlates.forEach((plate, index) => {
    plate.visible = index < Math.max(2, Math.min(nodes.separatorPlates.length, Math.round(separatorFaces / 2)));
  });
  materials.droplet.opacity = showSpray ? Math.min(0.85, 0.15 + sprayRatePct / 140) : 0;
  const positions = nodes.airDroplets.geometry.attributes.position.array as Float32Array;
  const speed = (airflowCfm / 15000) * dt * 1.8;
  for (let i = 0; i < DROPLET_COUNT; i += 1) {
    const offset = i * 3;
    positions[offset] += speed;
    if (positions[offset] > 2.4) positions[offset] = -2.2 + hash(i, 0) * 0.6;
  }
  nodes.airDroplets.geometry.attributes.position.needsUpdate = true;
}
