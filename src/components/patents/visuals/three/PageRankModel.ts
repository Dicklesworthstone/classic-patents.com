import * as THREE from "three";
import { stepPageRank } from "@/physics/pageRankKernel";
import { createGlowPointTexture } from "./ThreeStudioScene";

export interface PageRankModel {
  root: THREE.Group;
  mainGroup: THREE.Group;
  nodes: THREE.Mesh[];
  edges: THREE.Group[];
  surferParticles: THREE.Points;
  surferPositions: Float32Array;
  updateSurfers: (timeSec: number, omegaRadPerSec?: number) => void;
  dispose: () => void;
}

export function buildPageRankModel(): PageRankModel {
  const root = new THREE.Group();
  root.name = "Google PageRank Graph Model";
  const mainGroup = new THREE.Group();
  root.add(mainGroup);

  const materialsToDispose: THREE.Material[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];
  const texturesToDispose: THREE.Texture[] = [];

  const trackMat = <T extends THREE.Material>(mat: T): T => {
    materialsToDispose.push(mat);
    return mat;
  };

  const trackGeo = <T extends THREE.BufferGeometry>(geo: T): T => {
    geometriesToDispose.push(geo);
    return geo;
  };

  // Node Materials with Google-Themed Vibrant PBR Colors
  const nodeColors = [0x4285f4, 0xea4335, 0xfbbc05, 0x34a853, 0x9333ea];
  const nodeMats = nodeColors.map((color) =>
    trackMat(
      new THREE.MeshStandardMaterial({
        color,
        roughness: 0.22,
        metalness: 0.65,
        emissive: new THREE.Color(color),
        emissiveIntensity: 0.15,
      }),
    ),
  );

  const ringMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xfbbc05,
      roughness: 0.2,
      metalness: 0.9,
      emissive: new THREE.Color(0xf59e0b),
      emissiveIntensity: 0.4,
    }),
  );

  const edgeMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.4,
      metalness: 0.6,
      transparent: true,
      opacity: 0.75,
    }),
  );

  const arrowMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.2,
      metalness: 0.8,
      emissive: new THREE.Color(0x0284c7),
      emissiveIntensity: 0.35,
    }),
  );

  const sphereGeo = trackGeo(new THREE.SphereGeometry(0.85, 32, 32));
  const ringGeo = trackGeo(new THREE.TorusGeometry(1.2, 0.04, 12, 32));

  // 3D coordinates for the 5 graph nodes
  const positions = [
    new THREE.Vector3(0, 2.2, 0), // Node A (Hub)
    new THREE.Vector3(2.4, 0.4, 0.4), // Node B
    new THREE.Vector3(0, -2.0, 0), // Node C (Target authority)
    new THREE.Vector3(-2.4, -0.2, -0.4), // Node D
    new THREE.Vector3(-1.8, 2.0, 0.2), // Node E
  ];

  const nodes: THREE.Mesh[] = [];
  positions.forEach((pos, idx) => {
    const nodeGroup = new THREE.Group();
    nodeGroup.position.copy(pos);

    const mesh = new THREE.Mesh(sphereGeo, nodeMats[idx % nodeMats.length]);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    nodeGroup.add(mesh);
    nodes.push(mesh);

    // Authority halo ring around top target node
    if (idx === 2) {
      const halo = new THREE.Mesh(ringGeo, ringMat);
      halo.rotation.x = Math.PI / 2;
      nodeGroup.add(halo);
    }

    mainGroup.add(nodeGroup);
  });

  const links: [number, number][] = [
    [0, 1],
    [0, 2],
    [1, 2],
    [2, 0],
    [3, 2],
    [4, 0],
    [4, 3],
  ];

  const edgeGroups: THREE.Group[] = [];
  const arrowGeo = trackGeo(new THREE.ConeGeometry(0.12, 0.28, 16));

  links.forEach(([srcIdx, dstIdx]) => {
    const src = positions[srcIdx];
    const dst = positions[dstIdx];
    const edgeGroup = new THREE.Group();

    const distance = src.distanceTo(dst);
    const midPoint = new THREE.Vector3().addVectors(src, dst).multiplyScalar(0.5);

    const cylinderGeo = trackGeo(new THREE.CylinderGeometry(0.035, 0.035, distance, 12));
    const cylinder = new THREE.Mesh(cylinderGeo, edgeMat);
    cylinder.position.copy(midPoint);
    cylinder.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dst.clone().sub(src).normalize(),
    );
    edgeGroup.add(cylinder);

    // Directional Arrow pointing along link to destination
    const arrow = new THREE.Mesh(arrowGeo, arrowMat);
    const arrowPos = src.clone().lerp(dst, 0.72);
    arrow.position.copy(arrowPos);
    arrow.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dst.clone().sub(src).normalize(),
    );
    edgeGroup.add(arrow);

    mainGroup.add(edgeGroup);
    edgeGroups.push(edgeGroup);
  });

  // Dynamic Pulsating "Surfer" Particle Packets traveling along links
  const surferCount = links.length * 4;
  const surferPositions = new Float32Array(surferCount * 3);
  const surferColors = new Float32Array(surferCount * 3);
  const glowTex = createGlowPointTexture();
  texturesToDispose.push(glowTex);

  for (let i = 0; i < surferCount; i++) {
    const offset = i * 3;
    surferColors[offset] = 0.22;
    surferColors[offset + 1] = 0.85;
    surferColors[offset + 2] = 1.0;
  }

  const surferGeo = trackGeo(new THREE.BufferGeometry());
  surferGeo.setAttribute("position", new THREE.BufferAttribute(surferPositions, 3));
  surferGeo.setAttribute("color", new THREE.BufferAttribute(surferColors, 3));

  const surferMat = trackMat(
    new THREE.PointsMaterial({
      size: 0.3,
      map: glowTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );

  const surferParticles = new THREE.Points(surferGeo, surferMat);
  mainGroup.add(surferParticles);

  const updateSurfers = (timeSec: number, omegaRadPerSec = stepPageRank({}).omegaRadPerSec) => {
    links.forEach(([srcIdx, dstIdx], linkIdx) => {
      const src = positions[srcIdx];
      const dst = positions[dstIdx];
      for (let p = 0; p < 4; p++) {
        const particleIdx = linkIdx * 4 + p;
        const progress = (timeSec * omegaRadPerSec + p * 0.25) % 1.0;
        const pos = src.clone().lerp(dst, progress);
        surferPositions[particleIdx * 3] = pos.x;
        surferPositions[particleIdx * 3 + 1] = pos.y;
        surferPositions[particleIdx * 3 + 2] = pos.z;
      }
    });
    surferGeo.attributes.position.needsUpdate = true;
  };

  return {
    root,
    mainGroup,
    nodes,
    edges: edgeGroups,
    surferParticles,
    surferPositions,
    updateSurfers,
    dispose: () => {
      for (const g of geometriesToDispose) g.dispose();
      for (const m of materialsToDispose) m.dispose();
      for (const t of texturesToDispose) t.dispose();
    },
  };
}
