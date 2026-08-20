import * as THREE from "three";

export function buildDaVinciModel() {
  const root = new THREE.Group();
  const mainGroup = new THREE.Group();
  root.add(mainGroup);

  const materials = {
    metal: new THREE.MeshStandardMaterial({
      color: 0xd0d4dc,
      metalness: 0.85,
      roughness: 0.25,
    }),
    darkMetal: new THREE.MeshStandardMaterial({
      color: 0x3a404d,
      metalness: 0.7,
      roughness: 0.4,
    }),
    instrumentShaft: new THREE.MeshStandardMaterial({
      color: 0xeef2f7,
      metalness: 0.9,
      roughness: 0.15,
    }),
    jaw: new THREE.MeshStandardMaterial({
      color: 0x9aa0a6,
      metalness: 0.95,
      roughness: 0.2,
    }),
    masterGhost: new THREE.MeshStandardMaterial({
      color: 0x34a853,
      transparent: true,
      opacity: 0.45,
      wireframe: true,
    }),
    trocarRing: new THREE.MeshStandardMaterial({
      color: 0xea4335,
      metalness: 0.3,
      roughness: 0.6,
    }),
  };

  const trocarGeo = new THREE.TorusGeometry(0.35, 0.04, 16, 32);
  const trocar = new THREE.Mesh(trocarGeo, materials.trocarRing);
  trocar.rotation.x = Math.PI / 2;
  trocar.position.set(0, 0, 0);
  root.add(trocar);

  const masterGeo = new THREE.OctahedronGeometry(0.12, 1);
  const masterHandle = new THREE.Mesh(masterGeo, materials.masterGhost);
  root.add(masterHandle);

  const baseGroup = new THREE.Group();
  mainGroup.add(baseGroup);

  const carriageGeo = new THREE.BoxGeometry(0.2, 0.4, 0.25);
  const carriage = new THREE.Mesh(carriageGeo, materials.darkMetal);
  carriage.position.set(0, 1.8, 0);
  baseGroup.add(carriage);

  const shaftGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.2, 24);
  const shaft = new THREE.Mesh(shaftGeo, materials.instrumentShaft);
  shaft.position.set(0, 0.7, 0);
  baseGroup.add(shaft);

  const wristPitchGroup = new THREE.Group();
  wristPitchGroup.position.set(0, -0.4, 0);
  baseGroup.add(wristPitchGroup);

  const clevisGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.08, 16);
  const clevis = new THREE.Mesh(clevisGeo, materials.metal);
  clevis.rotation.z = Math.PI / 2;
  wristPitchGroup.add(clevis);

  const wristYawGroup = new THREE.Group();
  wristYawGroup.position.set(0, -0.06, 0);
  wristPitchGroup.add(wristYawGroup);

  const yawPulleyGeo = new THREE.SphereGeometry(0.042, 16, 16);
  const yawPulley = new THREE.Mesh(yawPulleyGeo, materials.metal);
  wristYawGroup.add(yawPulley);

  const wristRollGroup = new THREE.Group();
  wristRollGroup.position.set(0, -0.05, 0);
  wristYawGroup.add(wristRollGroup);

  const leftJawGroup = new THREE.Group();
  wristRollGroup.add(leftJawGroup);
  const jawGeo = new THREE.ConeGeometry(0.025, 0.18, 4);
  jawGeo.rotateX(Math.PI);
  const leftJaw = new THREE.Mesh(jawGeo, materials.jaw);
  leftJaw.position.set(0.015, -0.09, 0);
  leftJawGroup.add(leftJaw);

  const rightJawGroup = new THREE.Group();
  wristRollGroup.add(rightJawGroup);
  const rightJaw = new THREE.Mesh(jawGeo, materials.jaw);
  rightJaw.position.set(-0.015, -0.09, 0);
  rightJawGroup.add(rightJaw);

  const ambient = new THREE.AmbientLight(0xffffff, 0.5);
  root.add(ambient);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
  dirLight.position.set(3, 5, 4);
  dirLight.castShadow = true;
  root.add(dirLight);

  return {
    root,
    mainGroup,
    masterHandle,
    baseGroup,
    wristPitchGroup,
    wristYawGroup,
    wristRollGroup,
    leftJawGroup,
    rightJawGroup,
    dispose: () => {
      trocarGeo.dispose();
      masterGeo.dispose();
      carriageGeo.dispose();
      shaftGeo.dispose();
      clevisGeo.dispose();
      yawPulleyGeo.dispose();
      jawGeo.dispose();
      Object.values(materials).forEach((m) => {
        m.dispose();
      });
    },
  };
}
