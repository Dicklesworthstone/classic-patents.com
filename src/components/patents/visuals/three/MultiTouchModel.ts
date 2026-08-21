import * as THREE from "three";

export interface MultiTouchModel {
  root: THREE.Group;
  mainGroup: THREE.Group;
  docGroup: THREE.Group;
  touch1: THREE.Mesh;
  touch2: THREE.Mesh;
  touch1Ring: THREE.Mesh;
  touch2Ring: THREE.Mesh;
  updateTouchContacts: (
    t1: { x: number; y: number },
    t2: { x: number; y: number },
    active: boolean,
  ) => void;
  setExplodedView?: (exploded: boolean) => void;
  dispose: () => void;
}

export function buildMultiTouchModel(): MultiTouchModel {
  const root = new THREE.Group();
  root.name = "Apple iPhone Multi-Touch Stack Model";
  const mainGroup = new THREE.Group();
  root.add(mainGroup);

  const materialsToDispose: THREE.Material[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];

  const trackMat = <T extends THREE.Material>(mat: T): T => {
    materialsToDispose.push(mat);
    return mat;
  };

  const trackGeo = <T extends THREE.BufferGeometry>(geo: T): T => {
    geometriesToDispose.push(geo);
    return geo;
  };

  // --- Museum-Grade Materials ---
  const aluminumMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.85,
      roughness: 0.25,
    }),
  );

  const glassMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0xf8fafc,
      transparent: true,
      opacity: 0.45,
      roughness: 0.05,
      transmission: 0.92,
      ior: 1.52,
      thickness: 0.15,
    }),
  );

  const screenBlackMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.2,
      metalness: 0.8,
    }),
  );

  const itoGridMat = trackMat(
    new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.3,
      wireframe: true,
    }),
  );

  const touchPointMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: new THREE.Color(0x0284c7),
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.85,
    }),
  );

  const touchRingMat = trackMat(
    new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.5,
    }),
  );

  const docCardMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.35,
      metalness: 0.1,
    }),
  );

  const docPhotoMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.3,
      metalness: 0.2,
      emissive: new THREE.Color(0x0369a1),
      emissiveIntensity: 0.2,
    }),
  );

  const homeBtnMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.4,
      metalness: 0.5,
    }),
  );

  // 1. Phone Chassis & Bezel
  const chassisGeo = trackGeo(new THREE.BoxGeometry(3.0, 5.0, 0.22));
  const chassis = new THREE.Mesh(chassisGeo, aluminumMat);
  chassis.position.set(0, 0, -0.16);
  chassis.castShadow = true;
  chassis.receiveShadow = true;
  mainGroup.add(chassis);

  // Screen Backing
  const screenBackGeo = trackGeo(new THREE.PlaneGeometry(2.6, 4.4));
  const screenBack = new THREE.Mesh(screenBackGeo, screenBlackMat);
  screenBack.position.set(0, 0, -0.045);
  mainGroup.add(screenBack);

  // Top Speaker Ear Piece
  const speakerGeo = trackGeo(new THREE.BoxGeometry(0.6, 0.06, 0.02));
  const speaker = new THREE.Mesh(speakerGeo, aluminumMat);
  speaker.position.set(0, 2.22, -0.035);
  mainGroup.add(speaker);

  // Bottom Concave Home Button
  const homeBtnGeo = trackGeo(new THREE.CylinderGeometry(0.24, 0.24, 0.02, 32));
  const homeBtn = new THREE.Mesh(homeBtnGeo, homeBtnMat);
  homeBtn.rotation.x = Math.PI / 2;
  homeBtn.position.set(0, -2.18, -0.035);
  mainGroup.add(homeBtn);

  // 2. Optical Glass Faceplate
  const glassGeo = trackGeo(new THREE.BoxGeometry(2.8, 4.8, 0.04));
  const glass = new THREE.Mesh(glassGeo, glassMat);
  glass.position.set(0, 0, 0.01);
  mainGroup.add(glass);

  // 3. ITO Mutual Capacitance Diamond Grid Traces
  const gridGeo = trackGeo(new THREE.PlaneGeometry(2.4, 3.8, 12, 18));
  const grid = new THREE.Mesh(gridGeo, itoGridMat);
  grid.position.set(0, 0, -0.015);
  mainGroup.add(grid);

  // 4. Transformable Document / Photo Card
  const docGroup = new THREE.Group();
  docGroup.position.set(0, 0, -0.035);
  mainGroup.add(docGroup);

  const cardGeo = trackGeo(new THREE.PlaneGeometry(1.6, 2.2));
  const card = new THREE.Mesh(cardGeo, docCardMat);
  docGroup.add(card);

  const photoGeo = trackGeo(new THREE.PlaneGeometry(1.4, 1.6));
  const photo = new THREE.Mesh(photoGeo, docPhotoMat);
  photo.position.set(0, 0.18, 0.005);
  docGroup.add(photo);

  // 5. Multi-Touch Contact Indicators
  const contactSphereGeo = trackGeo(new THREE.SphereGeometry(0.08, 16, 16));
  const contactRingGeo = trackGeo(new THREE.RingGeometry(0.12, 0.18, 32));

  const touch1 = new THREE.Mesh(contactSphereGeo, touchPointMat);
  touch1.position.set(-0.4, -0.4, 0.05);
  mainGroup.add(touch1);

  const touch1Ring = new THREE.Mesh(contactRingGeo, touchRingMat);
  touch1Ring.position.set(-0.4, -0.4, 0.045);
  mainGroup.add(touch1Ring);

  const touch2 = new THREE.Mesh(contactSphereGeo, touchPointMat);
  touch2.position.set(0.4, 0.4, 0.05);
  mainGroup.add(touch2);

  const touch2Ring = new THREE.Mesh(contactRingGeo, touchRingMat);
  touch2Ring.position.set(0.4, 0.4, 0.045);
  mainGroup.add(touch2Ring);

  const updateTouchContacts = (
    t1: { x: number; y: number },
    t2: { x: number; y: number },
    active: boolean,
  ) => {
    touch1.position.set(t1.x, t1.y, 0.05);
    touch1Ring.position.set(t1.x, t1.y, 0.045);
    touch2.position.set(t2.x, t2.y, 0.05);
    touch2Ring.position.set(t2.x, t2.y, 0.045);

    touch1.visible = active;
    touch1Ring.visible = active;
    touch2.visible = active;
    touch2Ring.visible = active;
  };

  const setExplodedView = (exploded: boolean) => {
    if (exploded) {
      glass.position.z = 0.65;
      speaker.position.z = 0.67;
      homeBtn.position.z = 0.67;
      grid.position.z = 0.32;
      docGroup.position.z = 0.05;
      screenBack.position.z = -0.15;
      chassis.position.z = -0.45;
    } else {
      glass.position.z = 0.01;
      speaker.position.z = -0.035;
      homeBtn.position.z = -0.035;
      grid.position.z = -0.015;
      docGroup.position.z = -0.035;
      screenBack.position.z = -0.045;
      chassis.position.z = -0.16;
    }
  };

  return {
    root,
    mainGroup,
    docGroup,
    touch1,
    touch2,
    touch1Ring,
    touch2Ring,
    updateTouchContacts,
    setExplodedView,
    dispose: () => {
      for (const g of geometriesToDispose) g.dispose();
      for (const m of materialsToDispose) m.dispose();
    },
  };
}
