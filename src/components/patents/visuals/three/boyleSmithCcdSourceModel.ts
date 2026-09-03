import * as THREE from "three";
import {
  BOYLE_SMITH_CCD_GATE_COUNT,
  type BoyleSmithCcdSourceMetrics,
} from "@/physics/boyleSmithCcdKernel";

export interface BoyleSmithCcdSourceModel {
  root: THREE.Group;
  substrate: THREE.Mesh;
  oxide: THREE.Mesh;
  gateArray: THREE.Group;
  phaseRails: THREE.Group;
  potentialWells: THREE.Group;
  chargePackets: THREE.Group;
  externalCircuit: THREE.Group;
  inputRegion: THREE.Mesh;
  outputRegion: THREE.Mesh;
  update: (metrics: BoyleSmithCcdSourceMetrics) => void;
  setCutaway: (cutaway: boolean) => void;
  dispose: () => void;
}

const GATE_PITCH = 0.9;
const FIRST_GATE_X = -4.95;

function gateX(index: number): number {
  return FIRST_GATE_X + index * GATE_PITCH;
}

export function createBoyleSmithCcdSourceModel(): BoyleSmithCcdSourceModel {
  const root = new THREE.Group();
  root.name = "US 3,858,232 Figure 2 source shift-register apparatus";

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

  const substrateMaterial = material(
    new THREE.MeshStandardMaterial({
      color: 0x374151,
      roughness: 0.55,
      metalness: 0.08,
      transparent: true,
    }),
  );
  const oxideMaterial = material(
    new THREE.MeshPhysicalMaterial({
      color: 0x7dd3fc,
      emissive: 0x075985,
      emissiveIntensity: 0.12,
      transparent: true,
      opacity: 0.62,
      roughness: 0.22,
    }),
  );
  const phaseMaterials = [0x38bdf8, 0x34d399, 0xfb7185].map((color) =>
    material(
      new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.15,
        metalness: 0.68,
        roughness: 0.28,
      }),
    ),
  );
  const inputMaterial = material(
    new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.55, roughness: 0.35 }),
  );
  const outputMaterial = material(
    new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.5, roughness: 0.35 }),
  );
  const wellMaterials = phaseMaterials.map((phaseMaterial) =>
    material(
      new THREE.MeshPhysicalMaterial({
        color: phaseMaterial.color,
        emissive: phaseMaterial.color,
        emissiveIntensity: 0.18,
        transparent: true,
        opacity: 0.28,
        roughness: 0.25,
        side: THREE.DoubleSide,
      }),
    ),
  );
  const chargeMaterial = material(
    new THREE.MeshStandardMaterial({
      color: 0xfef3c7,
      emissive: 0xf59e0b,
      emissiveIntensity: 1.2,
      roughness: 0.25,
    }),
  );
  const refusalMaterial = material(
    new THREE.MeshBasicMaterial({
      color: 0xfb7185,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    }),
  );
  const circuitMaterial = material(
    new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.72, roughness: 0.25 }),
  );
  const circuitHousingMaterial = material(
    new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.35, roughness: 0.48 }),
  );

  const substrate = new THREE.Mesh(
    geometry(new THREE.BoxGeometry(11.8, 0.9, 4.4)),
    substrateMaterial,
  );
  substrate.name = "N-type single-conductivity storage medium 20";
  substrate.position.y = -0.45;
  substrate.castShadow = true;
  substrate.receiveShadow = true;
  root.add(substrate);

  const oxide = new THREE.Mesh(geometry(new THREE.BoxGeometry(11.8, 0.12, 4.4)), oxideMaterial);
  oxide.name = "Insulating layer 21";
  oxide.position.y = 0.06;
  root.add(oxide);

  const gateArray = new THREE.Group();
  gateArray.name = "Electrode sequence 22 23 24";
  const gateGeometry = geometry(new THREE.BoxGeometry(0.72, 0.24, 2.8));
  const gateMeshes: THREE.Mesh[] = [];
  for (let index = 0; index < BOYLE_SMITH_CCD_GATE_COUNT; index += 1) {
    const phaseIndex = index % 3;
    const gate = new THREE.Mesh(gateGeometry, phaseMaterials[phaseIndex]);
    gate.name = `Electrode ${22 + phaseIndex}${String.fromCharCode(97 + Math.floor(index / 3))}`;
    gate.position.set(gateX(index), 0.24, 0);
    gate.castShadow = true;
    gateArray.add(gate);
    gateMeshes.push(gate);
  }
  root.add(gateArray);

  const phaseRails = new THREE.Group();
  phaseRails.name = "Three connected phase conductors 22-prime 23-prime 24-prime";
  const railGeometry = geometry(new THREE.BoxGeometry(11.55, 0.08, 0.09));
  for (let phaseIndex = 0; phaseIndex < 3; phaseIndex += 1) {
    const railZ = -1.55 - phaseIndex * 0.2;
    const rail = new THREE.Mesh(railGeometry, phaseMaterials[phaseIndex]);
    rail.name = `Phase conductor ${22 + phaseIndex}-prime`;
    rail.position.set(0, 0.16, railZ);
    phaseRails.add(rail);

    for (let gateIndex = phaseIndex; gateIndex < BOYLE_SMITH_CCD_GATE_COUNT; gateIndex += 3) {
      const length = Math.abs(railZ + 1.4);
      const connectorGeometry = geometry(new THREE.BoxGeometry(0.09, 0.08, length + 0.09));
      const connector = new THREE.Mesh(connectorGeometry, phaseMaterials[phaseIndex]);
      connector.name = `Conductor ${22 + phaseIndex}-prime to ${gateIndex + 1}`;
      connector.position.set(gateX(gateIndex), 0.16, (-1.4 + railZ) / 2);
      phaseRails.add(connector);
    }
  }
  root.add(phaseRails);

  const inputRegion = new THREE.Mesh(
    geometry(new THREE.BoxGeometry(0.52, 0.28, 2.8)),
    inputMaterial,
  );
  inputRegion.name = "Charge input region 25";
  inputRegion.position.set(-5.55, 0.04, 0);
  root.add(inputRegion);

  const outputRegion = new THREE.Mesh(
    geometry(new THREE.BoxGeometry(0.52, 0.5, 2.8)),
    outputMaterial,
  );
  outputRegion.name = "Output depletion region 28 and p-n junction 29";
  outputRegion.position.set(5.55, 0.09, 0);
  root.add(outputRegion);

  const externalCircuit = new THREE.Group();
  externalCircuit.name = "Output load 30 bias 31 electrode 32 and regeneration circuit 33";

  const outputElectrode = new THREE.Mesh(
    geometry(new THREE.BoxGeometry(0.44, 0.18, 1.4)),
    circuitMaterial,
  );
  outputElectrode.name = "Output electrode 32";
  outputElectrode.position.set(5.55, 0.43, 0);
  externalCircuit.add(outputElectrode);

  const load = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.22, 0.75, 0.22)), circuitMaterial);
  load.name = "Output load 30";
  load.position.set(6.25, 0.82, 0);
  externalCircuit.add(load);

  const bias = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.22, 0.22, 0.18, 18)),
    inputMaterial,
  );
  bias.name = "Bias source 31";
  bias.position.set(6.25, 1.29, 0);
  externalCircuit.add(bias);

  const regenerationHousing = new THREE.Mesh(
    geometry(new THREE.BoxGeometry(2.4, 0.65, 0.9)),
    circuitHousingMaterial,
  );
  regenerationHousing.name = "Regeneration circuit 33";
  regenerationHousing.position.set(0, 0.55, -2.65);
  regenerationHousing.castShadow = true;
  externalCircuit.add(regenerationHousing);

  const addWire = (name: string, points: readonly THREE.Vector3[]) => {
    const curve = new THREE.CatmullRomCurve3([...points], false, "catmullrom", 0.05);
    const wire = new THREE.Mesh(
      geometry(new THREE.TubeGeometry(curve, 32, 0.035, 8, false)),
      circuitMaterial,
    );
    wire.name = name;
    wire.userData.start = points[0]?.toArray();
    wire.userData.end = points[points.length - 1]?.toArray();
    externalCircuit.add(wire);
  };

  addWire("Output electrode 32 to load 30", [
    new THREE.Vector3(5.55, 0.52, 0),
    new THREE.Vector3(6.25, 0.52, 0),
  ]);
  addWire("Output electrode 32 to regeneration circuit 33", [
    new THREE.Vector3(5.55, 0.43, -0.45),
    new THREE.Vector3(6.05, 0.55, -0.7),
    new THREE.Vector3(6.05, 0.55, -2.65),
    new THREE.Vector3(1.2, 0.55, -2.65),
  ]);
  addWire("Regeneration circuit 33 to input 25", [
    new THREE.Vector3(-1.2, 0.55, -2.65),
    new THREE.Vector3(-6.05, 0.55, -2.65),
    new THREE.Vector3(-6.05, 0.38, -0.7),
    new THREE.Vector3(-5.55, 0.16, -0.45),
  ]);
  root.add(externalCircuit);

  const potentialWells = new THREE.Group();
  potentialWells.name = "Induced potential-energy minima 27";
  const wellGeometry = geometry(new THREE.BoxGeometry(0.62, 0.42, 2.55));
  const wellMeshes: THREE.Mesh[] = [];
  for (let index = 0; index < BOYLE_SMITH_CCD_GATE_COUNT; index += 1) {
    const well = new THREE.Mesh(wellGeometry, wellMaterials[index % 3]);
    well.name = `Potential well beneath electrode ${index + 1}`;
    well.position.set(gateX(index), -0.14, 0);
    potentialWells.add(well);
    wellMeshes.push(well);
  }
  root.add(potentialWells);

  const chargePackets = new THREE.Group();
  chargePackets.name = "Figure 3 minority-carrier pattern 1101";
  chargePackets.renderOrder = 3;
  const packetGeometry = geometry(new THREE.SphereGeometry(0.075, 12, 10));
  const packetGroups: THREE.Group[] = [];
  for (let packetIndex = 0; packetIndex < 3; packetIndex += 1) {
    const packet = new THREE.Group();
    packet.name = `Minority positive-charge packet ${packetIndex + 1}`;
    for (const [x, y, z] of [
      [-0.12, 0, -0.16],
      [0, 0.03, 0],
      [0.12, 0, 0.16],
      [-0.08, -0.02, 0.18],
      [0.08, -0.02, -0.18],
    ] as const) {
      const carrier = new THREE.Mesh(packetGeometry, chargeMaterial);
      carrier.position.set(x, y, z);
      packet.add(carrier);
    }
    packet.position.y = -0.12;
    chargePackets.add(packet);
    packetGroups.push(packet);
  }
  root.add(chargePackets);

  const claimBoundaryMarkers = new THREE.Group();
  claimBoundaryMarkers.name = "Claim 1 channel-withheld boundary markers";
  const refusalGeometry = geometry(new THREE.PlaneGeometry(3.2, 0.72));
  for (const x of [-2.7, 0, 2.7]) {
    const marker = new THREE.Mesh(refusalGeometry, refusalMaterial);
    marker.position.set(x, -0.38, 0);
    marker.rotation.y = Math.PI / 2;
    claimBoundaryMarkers.add(marker);
  }
  root.add(claimBoundaryMarkers);

  const update = (metrics: BoyleSmithCcdSourceMetrics) => {
    for (let index = 0; index < gateMeshes.length; index += 1) {
      const phaseIndex = index % 3;
      const depth = metrics.phaseDepths[phaseIndex];
      const phaseMaterial = gateMeshes[index]?.material as THREE.MeshStandardMaterial;
      phaseMaterial.emissiveIntensity = 0.08 + depth * 0.82;
      const well = wellMeshes[index];
      if (well) {
        well.scale.y = 0.3 + depth * 1.15;
        well.position.y = -0.08 - 0.18 * depth;
        well.visible = metrics.claim1TopologyComplete;
      }
    }

    for (let index = 0; index < packetGroups.length; index += 1) {
      const packet = packetGroups[index];
      const gatePosition = metrics.packetGatePositions[index];
      if (!packet || gatePosition === undefined) continue;
      packet.position.x = gateX(0) + gatePosition * GATE_PITCH;
      packet.visible = metrics.claim1TopologyComplete;
    }

    substrateMaterial.color.setHex(metrics.claim1TopologyComplete ? 0x374151 : 0x4c1d2d);
    refusalMaterial.opacity = metrics.claim1TopologyComplete ? 0 : 0.72;
  };

  const setCutaway = (cutaway: boolean) => {
    substrateMaterial.opacity = cutaway ? 0.35 : 1;
    oxideMaterial.opacity = cutaway ? 0.36 : 0.62;
    for (const gate of gateMeshes) {
      gate.scale.z = cutaway ? 0.5 : 1;
      gate.position.z = cutaway ? -0.7 : 0;
    }
  };

  const dispose = () => {
    for (const value of geometries) value.dispose();
    for (const value of materials) value.dispose();
  };

  return {
    root,
    substrate,
    oxide,
    gateArray,
    phaseRails,
    potentialWells,
    chargePackets,
    externalCircuit,
    inputRegion,
    outputRegion,
    update,
    setCutaway,
    dispose,
  };
}
