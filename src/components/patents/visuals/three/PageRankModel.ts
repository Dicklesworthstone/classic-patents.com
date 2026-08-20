import * as THREE from "three";

export function buildPageRankModel() {
  const root = new THREE.Group();
  const mainGroup = new THREE.Group();
  root.add(mainGroup);

  const materials = {
    node: new THREE.MeshStandardMaterial({
      color: 0x4285f4,
      roughness: 0.2,
      metalness: 0.1,
    }),
    edge: new THREE.LineBasicMaterial({
      color: 0x999999,
      opacity: 0.6,
      transparent: true,
    }),
  };

  const sphereGeo = new THREE.SphereGeometry(1, 32, 32);

  // 3D coordinates for the 5 graph nodes
  const positions = [
    new THREE.Vector3(0, 2.2, 0), // Node A (Hub)
    new THREE.Vector3(2.4, 0.4, 0), // Node B
    new THREE.Vector3(0, -2.0, 0), // Node C (Target authority)
    new THREE.Vector3(-2.4, -0.2, 0), // Node D
    new THREE.Vector3(-1.8, 2.0, 0), // Node E
  ];

  const nodes: THREE.Mesh[] = [];
  positions.forEach((pos) => {
    const mesh = new THREE.Mesh(sphereGeo, materials.node);
    mesh.position.copy(pos);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    nodes.push(mesh);
    mainGroup.add(mesh);
  });

  const links = [
    [0, 1],
    [0, 2],
    [1, 2],
    [2, 0],
    [3, 2],
    [4, 0],
    [4, 3],
  ];

  const edges: THREE.Line[] = [];
  links.forEach(([src, dst]) => {
    const geo = new THREE.BufferGeometry().setFromPoints([positions[src], positions[dst]]);
    const line = new THREE.Line(geo, materials.edge);
    mainGroup.add(line);
    edges.push(line);
  });

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  root.add(ambientLight);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.85);
  dirLight.position.set(5, 5, 5);
  dirLight.castShadow = true;
  root.add(dirLight);

  return {
    root,
    mainGroup,
    nodes,
    edges,
    dispose: () => {
      sphereGeo.dispose();
      materials.node.dispose();
      materials.edge.dispose();
      edges.forEach((e) => {
        e.geometry.dispose();
      });
    },
  };
}
