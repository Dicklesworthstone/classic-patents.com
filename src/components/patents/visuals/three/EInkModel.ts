import * as THREE from "three";

export function buildEInkModel() {
  const root = new THREE.Group();
  const mainGroup = new THREE.Group();
  root.add(mainGroup);

  const materials = {
    capsuleShell: new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.28,
      roughness: 0.1,
      transmission: 0.85,
      ior: 1.45,
      thickness: 0.1,
      side: THREE.DoubleSide,
    }),
    itoElectrode: new THREE.MeshPhysicalMaterial({
      color: 0x8ab4f8,
      transparent: true,
      opacity: 0.4,
      roughness: 0.1,
      transmission: 0.9,
    }),
    bottomElectrode: new THREE.MeshStandardMaterial({
      color: 0xb8860b,
      metalness: 0.8,
      roughness: 0.3,
    }),
    whiteParticle: new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.5,
      metalness: 0.1,
    }),
    blackParticle: new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.8,
      metalness: 0.1,
    }),
    eFieldArrow: new THREE.MeshBasicMaterial({
      color: 0xf2994a,
      transparent: true,
      opacity: 0.7,
    }),
  };

  const topPlateGeo = new THREE.BoxGeometry(2.4, 0.08, 2.4);
  const topPlate = new THREE.Mesh(topPlateGeo, materials.itoElectrode);
  topPlate.position.set(0, 1.35, 0);
  mainGroup.add(topPlate);

  const bottomPlateGeo = new THREE.BoxGeometry(2.4, 0.08, 2.4);
  const bottomPlate = new THREE.Mesh(bottomPlateGeo, materials.bottomElectrode);
  bottomPlate.position.set(0, -1.35, 0);
  mainGroup.add(bottomPlate);

  const capsuleGeo = new THREE.SphereGeometry(1.15, 32, 32);
  const capsule = new THREE.Mesh(capsuleGeo, materials.capsuleShell);
  mainGroup.add(capsule);

  const NUM_PARTICLES = 36;
  const particleGeo = new THREE.SphereGeometry(0.065, 12, 12);

  const whiteParticleMeshes: THREE.Mesh[] = [];
  const blackParticleMeshes: THREE.Mesh[] = [];

  for (let i = 0; i < NUM_PARTICLES; i++) {
    const angle = (i / NUM_PARTICLES) * Math.PI * 2;
    const r = 0.2 + (Math.sin(i * 3.7) * 0.5 + 0.5) * 0.65;
    const offsetX = Math.cos(angle) * r;
    const offsetZ = Math.sin(angle) * r;
    const jitterY = Math.cos(i * 5.1) * 0.5 * 0.18;

    const wp = new THREE.Mesh(particleGeo, materials.whiteParticle);
    wp.position.set(offsetX, 0.7 + jitterY, offsetZ);
    wp.castShadow = true;
    mainGroup.add(wp);
    whiteParticleMeshes.push(wp);

    const bp = new THREE.Mesh(particleGeo, materials.blackParticle);
    bp.position.set(-offsetX, -0.7 - jitterY, -offsetZ);
    bp.castShadow = true;
    mainGroup.add(bp);
    blackParticleMeshes.push(bp);
  }

  const arrowGeo = new THREE.CylinderGeometry(0.015, 0.015, 1.8, 8);
  const eFieldArrows: THREE.Mesh[] = [];
  [-0.9, 0.9].forEach((x) => {
    [-0.9, 0.9].forEach((z) => {
      const arrow = new THREE.Mesh(arrowGeo, materials.eFieldArrow);
      arrow.position.set(x, 0, z);
      mainGroup.add(arrow);
      eFieldArrows.push(arrow);
    });
  });

  const ambient = new THREE.AmbientLight(0xffffff, 0.65);
  root.add(ambient);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.95);
  dirLight.position.set(3, 5, 4);
  dirLight.castShadow = true;
  root.add(dirLight);

  return {
    root,
    mainGroup,
    whiteParticleMeshes,
    blackParticleMeshes,
    eFieldArrows,
    dispose: () => {
      topPlateGeo.dispose();
      bottomPlateGeo.dispose();
      capsuleGeo.dispose();
      particleGeo.dispose();
      arrowGeo.dispose();
      Object.values(materials).forEach((m) => {
        m.dispose();
      });
    },
  };
}
