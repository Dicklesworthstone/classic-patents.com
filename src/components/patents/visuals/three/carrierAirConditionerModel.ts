import * as THREE from "three";
import type { CarrierAirWasherAnimationState } from "@/physics/engine";

/** Procedural reconstruction of the source-named Carrier air washer. */
export interface CarrierAirConditionerModelNodes {
  root: THREE.Group;
  solidCasingMesh: THREE.Mesh;
  cutawayCasingGroup: THREE.Group;
  cutawayRoofRails: THREE.Mesh[];
  sprayHeadersGroup: THREE.Group;
  sprayNozzles: THREE.Mesh[];
  separatorGroup: THREE.Group;
  separatorPlates: THREE.Group[];
  basin: THREE.Mesh;
  filter: THREE.Mesh;
  fanHousing: THREE.Mesh;
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
    casing: trackMat(
      new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.7, roughness: 0.45 }),
    ),
    plate: trackMat(
      new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.55, roughness: 0.4 }),
    ),
    liquid: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.55,
        roughness: 0.15,
      }),
    ),
    brass: trackMat(
      new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.25 }),
    ),
    droplet: trackMat(
      new THREE.PointsMaterial({ color: 0x7dd3fc, size: 0.12, transparent: true, opacity: 0.7 }),
    ),
  };

  // ==============================================================
  // 1. Structural Steel Base Frame & Foundation Channels
  // ==============================================================
  const baseFrameGroup = new THREE.Group();
  root.add(baseFrameGroup);

  // Longitudinal I-Beam Rails
  for (const z of [-1.5, 1.5]) {
    const rail = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(7.6, 0.25, 0.2)), materials.casing);
    rail.position.set(0, -1.6, z);
    rail.receiveShadow = true;
    baseFrameGroup.add(rail);
  }

  // Cross I-Beams & Floor Support Piers
  for (const x of [-3.2, -1.2, 0.8, 2.8]) {
    const crossBeam = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.25, 0.22, 3.4)),
      materials.casing,
    );
    crossBeam.position.set(x, -1.6, 0);
    baseFrameGroup.add(crossBeam);

    for (const z of [-1.5, 1.5]) {
      const pier = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.18, 0.22, 0.35, 12)),
        materials.casing,
      );
      pier.position.set(x, -1.85, z);
      baseFrameGroup.add(pier);
    }
  }

  const solidCasingMesh = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(7, 3.1, 3.4)),
    materials.casing,
  );
  solidCasingMesh.position.set(0, 0.3, 0);
  solidCasingMesh.visible = false;
  root.add(solidCasingMesh);

  const cutawayCasingGroup = new THREE.Group();
  // A full roof looks like a cutaway only from the side; from the default
  // elevated studio view it completely hides the washer's spray and sinuous
  // separator. Keep the casing outline as thin roof rails, leaving the actual
  // source-named internals visible through the open inspection face.
  const cutawayRoofRails: THREE.Mesh[] = [];
  const addCutawayRoofRail = (width: number, depth: number, x: number, z: number) => {
    const rail = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(width, 0.12, depth)),
      materials.casing,
    );
    rail.position.set(x, 1.85, z);
    cutawayCasingGroup.add(rail);
    cutawayRoofRails.push(rail);
  };
  addCutawayRoofRail(7, 0.14, 0, -1.6);
  addCutawayRoofRail(7, 0.14, 0, 1.6);
  addCutawayRoofRail(0.14, 3.06, -3.43, 0);
  addCutawayRoofRail(0.14, 3.06, 3.43, 0);
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

  // Recirculation Centrifugal Water Pump bolted to base
  const pumpGroup = new THREE.Group();
  pumpGroup.position.set(-2.8, -1.35, 1.4);
  root.add(pumpGroup);

  const pumpVolute = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.3, 0.3, 0.25, 16)),
    materials.casing,
  );
  pumpVolute.rotation.x = Math.PI / 2;
  pumpGroup.add(pumpVolute);

  const pumpMotor = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.22, 0.22, 0.45, 16)),
    materials.casing,
  );
  pumpMotor.position.set(0, 0, 0.35);
  pumpGroup.add(pumpMotor);

  // Pump Suction Pipe from Basin Filter
  const suctionCurve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(2.1, -1.15, 0.8),
    new THREE.Vector3(0, -1.35, 1.4),
    new THREE.Vector3(-2.8, -1.35, 1.4),
  );
  const suctionPipe = new THREE.Mesh(
    trackGeo(new THREE.TubeGeometry(suctionCurve, 16, 0.045, 8, false)),
    materials.brass,
  );
  root.add(suctionPipe);

  // Pump Discharge Pipe to Vertical Spray Header
  const dischargeCurve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(-2.8, -1.2, 1.4),
    new THREE.Vector3(-2.6, -0.4, 0.8),
    new THREE.Vector3(-2.4, 0.25, 0),
  );
  const dischargePipe = new THREE.Mesh(
    trackGeo(new THREE.TubeGeometry(dischargeCurve, 16, 0.045, 8, false)),
    materials.brass,
  );
  root.add(dischargePipe);

  const sprayHeadersGroup = new THREE.Group();
  const sprayNozzles: THREE.Mesh[] = [];
  const header = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.06, 0.06, 2.5, 12)),
    materials.brass,
  );
  header.position.set(-2.4, 0.25, 0);
  sprayHeadersGroup.add(header);
  for (let n = 0; n < 5; n += 1) {
    const nozzle = new THREE.Mesh(
      trackGeo(new THREE.ConeGeometry(0.08, 0.18, 10)),
      materials.brass,
    );
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
      const segment = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(0.78, 2.4, 0.055)),
        materials.plate,
      );
      segment.position.set(-0.9 + face * 0.38, 0.2, z);
      segment.rotation.z = face % 2 === 0 ? -0.48 : 0.48;
      plate.add(segment);
      if (face > 1) {
        const flange = new THREE.Mesh(
          trackGeo(new THREE.BoxGeometry(0.3, 0.06, 0.08)),
          materials.brass,
        );
        flange.position.set(segment.position.x + 0.18, segment.position.y - 0.4, z + 0.05);
        flange.rotation.z = segment.rotation.z;
        plate.add(flange);
      }
    }
    separatorGroup.add(plate);
    separatorPlates.push(plate);
  }
  root.add(separatorGroup);

  // Fan Scroll Casing Housing & Drive Motor
  const fanHousing = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(1.6, 1.6, 0.6, 32, 1, false, 0, Math.PI * 1.5)),
    materials.casing,
  );
  fanHousing.rotation.x = Math.PI / 2;
  fanHousing.position.set(2.7, 0.35, 0);
  root.add(fanHousing);

  const fanMotorBase = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.8, 0.6, 0.8)),
    materials.casing,
  );
  fanMotorBase.position.set(2.7, -1.2, 0);
  root.add(fanMotorBase);

  const fanRotor = new THREE.Group();
  fanRotor.position.set(2.7, 0.35, 0);
  const fanHub = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.34, 0.34, 0.3, 16)),
    materials.brass,
  );
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
    for (const geometry of geometries) {
      geometry.dispose();
    }
    for (const material of materialsToDispose) {
      material.dispose();
    }
  };
  return {
    root,
    nodes: {
      root,
      solidCasingMesh,
      cutawayCasingGroup,
      cutawayRoofRails,
      sprayHeadersGroup,
      sprayNozzles,
      separatorGroup,
      separatorPlates,
      basin,
      filter,
      fanHousing,
      fanRotor,
      airDroplets,
    },
    materials,
    dispose,
  };
}

export function updateCarrierAirConditionerKinematics(
  nodes: CarrierAirConditionerModelNodes,
  materials: CarrierAirConditionerMaterials,
  dt: number,
  animation: CarrierAirWasherAnimationState,
  cutawayMode: boolean,
  showSpray: boolean,
) {
  nodes.solidCasingMesh.visible = !cutawayMode;
  nodes.cutawayCasingGroup.visible = cutawayMode;
  nodes.fanRotor.rotation.z -= animation.fanDisplayAngularVelocityRadPerSec * dt;
  nodes.separatorPlates.forEach((plate, index) => {
    plate.visible =
      index < Math.min(nodes.separatorPlates.length, animation.activeSeparatorPlateCount);
  });
  materials.droplet.opacity = showSpray ? animation.dropletDisplayOpacity : 0;
  const positions = nodes.airDroplets.geometry.attributes.position.array as Float32Array;
  const speed = animation.dropletDisplayAdvectionUnitsPerSec * dt;
  for (let i = 0; i < DROPLET_COUNT; i += 1) {
    const offset = i * 3;
    positions[offset] += speed;
    if (positions[offset] > 2.4) positions[offset] = -2.2 + hash(i, 0) * 0.6;
  }
  nodes.airDroplets.geometry.attributes.position.needsUpdate = true;
}
