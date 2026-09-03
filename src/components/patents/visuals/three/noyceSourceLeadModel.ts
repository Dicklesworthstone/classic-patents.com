import * as THREE from "three";
import type { NoycePlanarLeadState } from "@/physics/noycePlanarLeadKernel";

export interface NoyceSourceLeadModel {
  root: THREE.Group;
  semiconductorBody: THREE.Mesh;
  collectorRegion: THREE.Mesh;
  baseRegion: THREE.Mesh;
  emitterRegion: THREE.Mesh;
  oxideLayer: THREE.Mesh;
  oxideBridge: THREE.Group;
  emitterContact: THREE.Mesh;
  baseContact: THREE.Group;
  emitterLead: THREE.Mesh;
  baseLead: THREE.Mesh;
  backsideContact: THREE.Mesh;
  update: (state: NoycePlanarLeadState, cutaway: boolean) => void;
  dispose: () => void;
}

/** Source-shaped Figure 1/2 teaching model: no DIP, lead frame, or wire bonds. */
export function buildNoyceSourceLeadModel(): NoyceSourceLeadModel {
  const root = new THREE.Group();
  root.name = "US 2,981,877 Figure 1/2 oxide-supported lead crossing";
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const geo = <T extends THREE.BufferGeometry>(value: T): T => {
    geometries.add(value);
    return value;
  };
  const mat = <T extends THREE.Material>(value: T): T => {
    materials.add(value);
    return value;
  };
  const mesh = (
    parent: THREE.Object3D,
    geometry: THREE.BufferGeometry,
    material: THREE.Material,
    name: string,
    position: readonly [number, number, number],
    rotation: readonly [number, number, number] = [0, 0, 0],
  ) => {
    const part = new THREE.Mesh(geometry, material);
    part.name = name;
    part.position.set(...position);
    part.rotation.set(...rotation);
    part.castShadow = true;
    part.receiveShadow = true;
    parent.add(part);
    return part;
  };

  const pedestalMaterial = mat(
    new THREE.MeshStandardMaterial({ color: 0x172033, metalness: 0.34, roughness: 0.6 }),
  );
  const bodyMaterial = mat(
    new THREE.MeshStandardMaterial({
      color: 0x701a75,
      metalness: 0.08,
      roughness: 0.5,
      transparent: true,
      opacity: 0.68,
      depthWrite: false,
    }),
  );
  const pMaterial = mat(
    new THREE.MeshStandardMaterial({ color: 0xc026d3, metalness: 0.12, roughness: 0.42 }),
  );
  const nMaterial = mat(
    new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.12, roughness: 0.4 }),
  );
  const emitterMaterial = mat(
    new THREE.MeshStandardMaterial({ color: 0x22d3ee, metalness: 0.16, roughness: 0.32 }),
  );
  const oxideMaterial = mat(
    new THREE.MeshPhysicalMaterial({
      color: 0xa5f3fc,
      transparent: true,
      opacity: 0.7,
      transmission: 0.22,
      roughness: 0.12,
      depthWrite: false,
    }),
  );
  const metalMaterial = mat(
    new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.96, roughness: 0.14 }),
  );
  const shortMaterial = mat(
    new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      emissive: 0x9f1239,
      emissiveIntensity: 0.58,
      metalness: 0.4,
      roughness: 0.25,
    }),
  );
  const collectorMaterial = mat(
    new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.82, roughness: 0.2 }),
  );

  mesh(
    root,
    geo(new THREE.BoxGeometry(8.4, 0.18, 6.7)),
    pedestalMaterial,
    "museum foundation supporting semiconductor body",
    [0, -1.06, 0],
  );
  const semiconductorBody = mesh(
    root,
    geo(new THREE.BoxGeometry(7.3, 1.3, 5.6)),
    bodyMaterial,
    "single-crystal silicon body 1",
    [0, -0.25, 0],
  );
  const backsideContact = mesh(
    root,
    geo(new THREE.BoxGeometry(7.25, 0.09, 5.55)),
    collectorMaterial,
    "back-side collector coating 10",
    [0, -0.93, 0],
  );

  const collectorRegion = mesh(
    root,
    geo(new THREE.CylinderGeometry(1.62, 1.78, 1.08, 48)),
    nMaterial,
    "N-type collector region bounded by dished junction 4",
    [0, -0.15, 0],
  );
  const baseRegion = mesh(
    root,
    geo(new THREE.CylinderGeometry(0.96, 1.14, 0.5, 48)),
    pMaterial,
    "P-type base region bounded by dished junction 3",
    [0, 0.14, 0],
  );
  const emitterRegion = mesh(
    root,
    geo(new THREE.CylinderGeometry(0.48, 0.58, 0.2, 40)),
    emitterMaterial,
    "N-type emitter region",
    [0, 0.29, 0],
  );

  const oxideShape = new THREE.Shape();
  oxideShape.moveTo(-3.59, -2.74);
  oxideShape.lineTo(3.59, -2.74);
  oxideShape.lineTo(3.59, 2.74);
  oxideShape.lineTo(-3.59, 2.74);
  oxideShape.closePath();
  const contactOpening = new THREE.Path();
  contactOpening.absarc(0, 0, 1.08, 0, Math.PI * 2, false);
  oxideShape.holes.push(contactOpening);

  const oxideLayer = mesh(
    root,
    geo(
      new THREE.ExtrudeGeometry(oxideShape, {
        depth: 0.12,
        bevelEnabled: false,
        curveSegments: 48,
      }),
    ),
    oxideMaterial,
    "retained oxide insulation 5 with selected contact opening",
    [0, 0.54, 0],
    [Math.PI / 2, 0, 0],
  );
  const oxideBridge = new THREE.Group();
  oxideBridge.name = "oxide tongue 5 double-prime crossing junctions 3 and 4";
  root.add(oxideBridge);
  const bridgeSupport = mesh(
    oxideBridge,
    geo(new THREE.BoxGeometry(3.55, 0.06, 0.58)),
    oxideMaterial,
    "oxide bridge beneath emitter lead 7",
    [1.78, 0.51, 0],
  );

  const emitterContact = mesh(
    root,
    geo(new THREE.CylinderGeometry(0.34, 0.34, 0.1, 40)),
    metalMaterial,
    "discoid emitter contact 6",
    [0, 0.505, 0],
  );
  const baseContact = new THREE.Group();
  baseContact.name = "C-shaped base contact 8 with lead passage gap";
  baseContact.position.set(0, 0.505, 0);
  root.add(baseContact);
  mesh(
    baseContact,
    geo(new THREE.TorusGeometry(0.78, 0.11, 12, 56, Math.PI * 1.62)),
    metalMaterial,
    "C-shaped base contact 8",
    [0, 0, 0],
    [Math.PI / 2, 0, Math.PI * 0.19],
  );

  const emitterLead = mesh(
    oxideBridge,
    geo(new THREE.BoxGeometry(3.6, 0.1, 0.24)),
    metalMaterial,
    "vacuum-deposited emitter lead 7 crossing oxide",
    [1.8, 0.59, 0],
  );
  mesh(
    root,
    geo(new THREE.BoxGeometry(2.45, 0.06, 0.46)),
    oxideMaterial,
    "oxide tongue 5 prime beneath base lead 9",
    [-1.72, 0.51, 0.68],
    [0, 0.38, 0],
  );
  const baseLead = mesh(
    root,
    geo(new THREE.BoxGeometry(2.35, 0.1, 0.26)),
    metalMaterial,
    "vacuum-deposited base lead 9",
    [-1.72, 0.57, 0.68],
    [0, 0.38, 0],
  );
  mesh(
    root,
    geo(new THREE.CylinderGeometry(0.13, 0.13, 0.1, 24)),
    metalMaterial,
    "base-lead ohmic contact window",
    [-0.7, 0.505, 0.27],
  );

  const junctionGuideMaterial = mat(
    new THREE.LineBasicMaterial({ color: 0xfef08a, transparent: true, opacity: 0.72 }),
  );
  for (const radius of [0.62, 1.23]) {
    const points = Array.from({ length: 65 }, (_, index) => {
      const angle = (index / 64) * Math.PI * 2;
      return new THREE.Vector3(Math.cos(angle) * radius, 0.405, Math.sin(angle) * radius);
    });
    const lineGeometry = geo(new THREE.BufferGeometry().setFromPoints(points));
    const line = new THREE.LineLoop(lineGeometry, junctionGuideMaterial);
    line.name = "surface-reaching P-N junction perimeter";
    root.add(line);
  }

  const update = (state: NoycePlanarLeadState, cutaway: boolean) => {
    const oxideScale = 0.65 + ((state.controls.oxideThicknessUm - 0.5) / 1.5) * 0.7;
    const leadWidthScale = state.controls.leadStripWidthFraction / 0.12;
    oxideLayer.scale.z = oxideScale;
    bridgeSupport.scale.y = oxideScale;
    bridgeSupport.position.y = 0.54 - 0.03 * oxideScale;
    bridgeSupport.scale.z = leadWidthScale;
    bridgeSupport.visible = state.oxideCrossesJunction;
    emitterLead.scale.z = leadWidthScale;
    emitterLead.material = state.claim1TopologyComplete ? metalMaterial : shortMaterial;
    emitterLead.position.y = state.claim1TopologyComplete ? 0.59 : 0.44;
    baseLead.position.y = 0.59;
    oxideMaterial.opacity = cutaway ? 0.28 : 0.7;
    bodyMaterial.opacity = cutaway ? 0.16 : 0.68;
  };

  return {
    root,
    semiconductorBody,
    collectorRegion,
    baseRegion,
    emitterRegion,
    oxideLayer,
    oxideBridge,
    emitterContact,
    baseContact,
    emitterLead,
    baseLead,
    backsideContact,
    update,
    dispose: () => {
      for (const geometry of geometries) geometry.dispose();
      for (const material of materials) material.dispose();
    },
  };
}
