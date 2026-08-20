import * as THREE from "three";

export function buildMultiTouchModel() {
  const root = new THREE.Group();
  const mainGroup = new THREE.Group();
  root.add(mainGroup);

  const materials = {
    glass: new THREE.MeshPhysicalMaterial({
      color: 0xe8f0fe,
      transparent: true,
      opacity: 0.35,
      roughness: 0.05,
      transmission: 0.9,
      ior: 1.52,
      thickness: 0.2,
    }),
    bezel: new THREE.MeshStandardMaterial({
      color: 0x1f2328,
      metalness: 0.8,
      roughness: 0.3,
    }),
    itoGrid: new THREE.MeshBasicMaterial({
      color: 0x4285f4,
      transparent: true,
      opacity: 0.25,
      wireframe: true,
    }),
    touchContact: new THREE.MeshBasicMaterial({
      color: 0x00ffcc,
      transparent: true,
      opacity: 0.8,
    }),
    docCard: new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.4,
      metalness: 0.1,
    }),
    docAccent: new THREE.MeshBasicMaterial({
      color: 0xfa755a,
    }),
  };

  const bezelGeo = new THREE.BoxGeometry(2.8, 4.0, 0.2);
  const bezel = new THREE.Mesh(bezelGeo, materials.bezel);
  bezel.position.set(0, 0, -0.15);
  mainGroup.add(bezel);

  const glassGeo = new THREE.BoxGeometry(2.4, 3.6, 0.05);
  const glass = new THREE.Mesh(glassGeo, materials.glass);
  glass.position.set(0, 0, 0);
  mainGroup.add(glass);

  const gridGeo = new THREE.PlaneGeometry(2.2, 3.4, 8, 12);
  const grid = new THREE.Mesh(gridGeo, materials.itoGrid);
  grid.position.set(0, 0, -0.01);
  mainGroup.add(grid);

  const docGroup = new THREE.Group();
  docGroup.position.set(0, 0, -0.04);
  mainGroup.add(docGroup);

  const cardGeo = new THREE.PlaneGeometry(1.4, 1.8);
  const card = new THREE.Mesh(cardGeo, materials.docCard);
  docGroup.add(card);

  const cardImgGeo = new THREE.PlaneGeometry(1.2, 1.2);
  const cardImg = new THREE.Mesh(cardImgGeo, materials.docAccent);
  cardImg.position.set(0, 0.15, 0.01);
  docGroup.add(cardImg);

  const ringGeo = new THREE.RingGeometry(0.08, 0.14, 24);
  const touch1 = new THREE.Mesh(ringGeo, materials.touchContact);
  touch1.position.set(0, 0, 0.04);
  mainGroup.add(touch1);

  const touch2 = new THREE.Mesh(ringGeo, materials.touchContact);
  touch2.position.set(0, 0, 0.04);
  mainGroup.add(touch2);

  const ambient = new THREE.AmbientLight(0xffffff, 0.7);
  root.add(ambient);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
  dirLight.position.set(2, 4, 3);
  root.add(dirLight);

  return {
    root,
    mainGroup,
    docGroup,
    touch1,
    touch2,
    dispose: () => {
      bezelGeo.dispose();
      glassGeo.dispose();
      gridGeo.dispose();
      cardGeo.dispose();
      cardImgGeo.dispose();
      ringGeo.dispose();
      Object.values(materials).forEach((m) => {
        m.dispose();
      });
    },
  };
}
