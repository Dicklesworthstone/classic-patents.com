import * as THREE from "three";
import type { DaVinciInterfaceTopologyState } from "@/physics/daVinciInterfaceTopology";

export interface DaVinciInterfaceModel {
  root: THREE.Group;
  setTopologyState: (state: DaVinciInterfaceTopologyState) => void;
  dispose: () => void;
}

/**
 * A normalized topology of the tool-side interface in US 6,331,181.
 *
 * It intentionally has no clinical scene, motion envelope, scale claim,
 * contact object, speed, or force model. The grant supports the shown
 * processor / holder / releasable tool / tool-memory relationships, but not
 * quantitative mechanics for them.
 */
export function buildDaVinciInterfaceModel(): DaVinciInterfaceModel {
  const root = new THREE.Group();
  root.name = "US 6,331,181 source-bounded tool interface topology";

  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const trackGeometry = <T extends THREE.BufferGeometry>(geometry: T): T => {
    geometries.push(geometry);
    return geometry;
  };
  const trackMaterial = <T extends THREE.Material>(material: T): T => {
    materials.push(material);
    return material;
  };

  const processorMaterial = trackMaterial(
    new THREE.MeshStandardMaterial({ color: 0x1d4ed8, metalness: 0.3, roughness: 0.42 }),
  );
  const holderMaterial = trackMaterial(
    new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.72, roughness: 0.28 }),
  );
  const toolMaterial = trackMaterial(
    new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.86, roughness: 0.2 }),
  );
  const memoryMaterial = trackMaterial(
    new THREE.MeshStandardMaterial({
      color: 0x059669,
      emissive: new THREE.Color(0x047857),
      emissiveIntensity: 0.55,
      metalness: 0.22,
      roughness: 0.36,
    }),
  );
  const calibrationMaterial = trackMaterial(
    new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      emissive: new THREE.Color(0x0369a1),
      emissiveIntensity: 0.32,
      metalness: 0.18,
      roughness: 0.38,
    }),
  );
  const engagementMaterial = trackMaterial(
    new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: new THREE.Color(0x047857),
      emissiveIntensity: 0.35,
      metalness: 0.35,
      roughness: 0.3,
    }),
  );
  const busMaterial = trackMaterial(
    new THREE.LineBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.94 }),
  );
  const inactiveBusMaterial = trackMaterial(
    new THREE.LineBasicMaterial({ color: 0xfb7185, transparent: true, opacity: 0.65 }),
  );
  const inactiveStatusMaterial = trackMaterial(
    new THREE.MeshStandardMaterial({
      color: 0xe11d48,
      emissive: new THREE.Color(0x9f1239),
      emissiveIntensity: 0.24,
      roughness: 0.42,
    }),
  );

  const base = new THREE.Mesh(
    trackGeometry(new THREE.BoxGeometry(6.4, 0.16, 2.2)),
    trackMaterial(new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.66 })),
  );
  base.name = "Normalized topology plinth (not a dimensional drawing)";
  base.position.y = -0.95;
  root.add(base);

  const processor = new THREE.Group();
  processor.name = "Processor receiving tool-interface data";
  processor.position.set(-2.25, 0, 0);
  root.add(processor);
  const processorBody = new THREE.Mesh(
    trackGeometry(new THREE.BoxGeometry(1.1, 1.02, 0.82)),
    processorMaterial,
  );
  processor.add(processorBody);
  for (const z of [-0.36, -0.12, 0.12, 0.36]) {
    const pin = new THREE.Mesh(
      trackGeometry(new THREE.BoxGeometry(0.18, 0.11, 0.06)),
      calibrationMaterial,
    );
    pin.position.set(0.64, 0, z);
    processor.add(pin);
  }

  const holder = new THREE.Group();
  holder.name = "Holder-side releasable drive interface";
  holder.position.set(-0.35, 0, 0);
  root.add(holder);
  const holderBody = new THREE.Mesh(
    trackGeometry(new THREE.BoxGeometry(1.18, 1.26, 0.9)),
    holderMaterial,
  );
  holder.add(holderBody);
  const interfaceWell = new THREE.Mesh(
    trackGeometry(new THREE.BoxGeometry(0.36, 0.7, 0.62)),
    trackMaterial(new THREE.MeshStandardMaterial({ color: 0x020617, roughness: 0.5 })),
  );
  interfaceWell.position.x = 0.56;
  holder.add(interfaceWell);

  const tool = new THREE.Group();
  tool.name = "Releasable robotic surgical tool";
  tool.position.set(1.25, 0, 0);
  root.add(tool);
  const toolBody = new THREE.Mesh(
    trackGeometry(new THREE.BoxGeometry(1.36, 0.64, 0.52)),
    toolMaterial,
  );
  tool.add(toolBody);
  const distal = new THREE.Mesh(
    trackGeometry(new THREE.CylinderGeometry(0.1, 0.1, 0.92, 16)),
    toolMaterial,
  );
  distal.rotation.z = Math.PI / 2;
  distal.position.x = 1.1;
  tool.add(distal);
  const endEffector = new THREE.Group();
  endEffector.name = "Distal end effector (qualitative)";
  endEffector.position.x = 1.62;
  tool.add(endEffector);
  for (const sign of [-1, 1]) {
    const jaw = new THREE.Mesh(trackGeometry(new THREE.ConeGeometry(0.1, 0.38, 4)), toolMaterial);
    jaw.rotation.z = (sign * Math.PI) / 2;
    jaw.position.set(0.14, sign * 0.1, 0);
    endEffector.add(jaw);
  }

  const memory = new THREE.Mesh(
    trackGeometry(new THREE.BoxGeometry(0.42, 0.42, 0.12)),
    memoryMaterial,
  );
  memory.name = "Tool-mounted compatibility and calibration memory";
  memory.position.set(-0.12, 0.34, 0.33);
  tool.add(memory);

  const offsetRecord = new THREE.Mesh(
    trackGeometry(new THREE.BoxGeometry(0.22, 0.22, 0.08)),
    calibrationMaterial,
  );
  offsetRecord.name = "Measured calibration offset record";
  offsetRecord.position.set(0.28, 0.34, 0.33);
  tool.add(offsetRecord);

  const engagementPins = new THREE.Group();
  engagementPins.name = "Engagement structures and signals";
  for (const y of [-0.24, 0.24]) {
    const pin = new THREE.Mesh(
      trackGeometry(new THREE.CylinderGeometry(0.065, 0.065, 0.3, 12)),
      engagementMaterial,
    );
    pin.rotation.z = Math.PI / 2;
    pin.position.set(-0.72, y, 0);
    engagementPins.add(pin);
  }
  tool.add(engagementPins);

  const pathPoints = [
    new THREE.Vector3(-1.65, 0.28, 0),
    new THREE.Vector3(-0.95, 0.8, 0),
    new THREE.Vector3(0.62, 0.8, 0),
    new THREE.Vector3(1.12, 0.4, 0),
  ];
  const dataPath = new THREE.Line(
    trackGeometry(new THREE.BufferGeometry().setFromPoints(pathPoints)),
    busMaterial,
  );
  dataPath.name = "Compatibility, calibration, and engagement data path";
  root.add(dataPath);

  const arrow = new THREE.Mesh(
    trackGeometry(new THREE.ConeGeometry(0.1, 0.26, 4)),
    trackMaterial(
      new THREE.MeshStandardMaterial({
        color: 0x22d3ee,
        emissive: new THREE.Color(0x0891b2),
        emissiveIntensity: 0.38,
      }),
    ),
  );
  arrow.rotation.z = -Math.PI / 2;
  arrow.position.set(-1.75, 0.28, 0);
  root.add(arrow);

  const statusRing = new THREE.Mesh(
    trackGeometry(new THREE.TorusGeometry(0.8, 0.034, 12, 48)),
    engagementMaterial,
  );
  statusRing.name = "Processor configuration status";
  statusRing.rotation.x = Math.PI / 2;
  statusRing.position.set(-2.25, -0.56, 0);
  root.add(statusRing);

  const setTopologyState = (state: DaVinciInterfaceTopologyState) => {
    const compatibilityColor = state.compatibilitySignalPresent ? 0x059669 : 0xe11d48;
    memoryMaterial.color.setHex(compatibilityColor);
    memoryMaterial.emissive.setHex(state.compatibilitySignalPresent ? 0x047857 : 0x9f1239);
    memoryMaterial.emissiveIntensity = state.compatibilitySignalPresent ? 0.55 : 0.24;

    offsetRecord.visible = state.calibrationRecordAvailable;
    calibrationMaterial.color.setHex(state.calibrationRecordAvailable ? 0x0ea5e9 : 0x64748b);
    calibrationMaterial.emissive.setHex(state.calibrationRecordAvailable ? 0x0369a1 : 0x334155);

    engagementMaterial.color.setHex(state.engagementSignalPresent ? 0x10b981 : 0xf97316);
    engagementMaterial.emissive.setHex(state.engagementSignalPresent ? 0x047857 : 0x9a3412);
    engagementPins.visible = state.engagementSignalPresent;

    dataPath.material = state.processorCanConfigureTool ? busMaterial : inactiveBusMaterial;
    statusRing.material = state.processorCanConfigureTool
      ? engagementMaterial
      : inactiveStatusMaterial;
    statusRing.scale.setScalar(state.processorCanConfigureTool ? 1 : 0.72);
  };

  setTopologyState({
    compatibilitySignalPresent: true,
    calibrationRecordAvailable: true,
    engagementSignalPresent: true,
    processorCanConfigureTool: true,
    status: "ready",
  });

  return {
    root,
    setTopologyState,
    dispose: () => {
      for (const geometry of geometries) geometry.dispose();
      for (const material of materials) material.dispose();
    },
  };
}
