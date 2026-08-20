import * as THREE from "three";
import { ROOMBA_FURNITURE, ROOMBA_ROOM } from "@/physics/roombaKernel";

export function buildRoombaModel() {
  const root = new THREE.Group();
  const mainGroup = new THREE.Group();
  root.add(mainGroup);

  const materials = {
    body: new THREE.MeshStandardMaterial({ color: 0x2b2d42, roughness: 0.5, metalness: 0.3 }),
    bumper: new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.8 }),
    button: new THREE.MeshStandardMaterial({ color: 0x4caf50 }),
    floor: new THREE.MeshStandardMaterial({ color: 0xe0e1dd, roughness: 0.9 }),
    wall: new THREE.MeshStandardMaterial({ color: 0x8d99ae, roughness: 0.7 }),
  };

  const bodyGeo = new THREE.CylinderGeometry(0.17, 0.17, 0.08, 32);
  const bodyMesh = new THREE.Mesh(bodyGeo, materials.body);
  bodyMesh.position.y = 0.04;
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;

  const fwdGeo = new THREE.SphereGeometry(0.02, 16, 16);
  const fwdMesh = new THREE.Mesh(fwdGeo, materials.button);
  fwdMesh.position.set(0.1, 0.08, 0);
  bodyMesh.add(fwdMesh);

  mainGroup.add(bodyMesh);

  const floorGeo = new THREE.PlaneGeometry(ROOMBA_ROOM.width, ROOMBA_ROOM.height);
  const floorMesh = new THREE.Mesh(floorGeo, materials.floor);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.receiveShadow = true;
  root.add(floorMesh);

  const furnitureMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.85,
    metalness: 0.05,
  });
  const furnitureGeos: THREE.BoxGeometry[] = [];
  for (const obs of ROOMBA_FURNITURE) {
    const geo = new THREE.BoxGeometry(obs.w, 0.35, obs.h);
    furnitureGeos.push(geo);
    const mesh = new THREE.Mesh(geo, furnitureMat);
    mesh.position.set(obs.x, 0.175, obs.y);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    root.add(mesh);
  }

  // Path trail
  const maxPoints = 4000;
  const positions = new Float32Array(maxPoints * 3);
  const pathGeo = new THREE.BufferGeometry();
  pathGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const pathMat = new THREE.LineBasicMaterial({ color: 0x3a86ff, opacity: 0.6, transparent: true });
  const pathLine = new THREE.Line(pathGeo, pathMat);
  root.add(pathLine);

  let pointCount = 0;
  const updateTrail = (x: number, z: number) => {
    if (pointCount >= maxPoints) return;
    positions[pointCount * 3] = x;
    positions[pointCount * 3 + 1] = 0.005;
    positions[pointCount * 3 + 2] = z;
    pathGeo.attributes.position.needsUpdate = true;
    pathGeo.setDrawRange(0, pointCount + 1);
    pointCount++;
  };

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  root.add(ambientLight);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.85);
  dirLight.position.set(2, 4, 2);
  dirLight.castShadow = true;
  root.add(dirLight);

  return {
    root,
    mainGroup,
    updateTrail,
    dispose: () => {
      bodyGeo.dispose();
      fwdGeo.dispose();
      floorGeo.dispose();
      pathGeo.dispose();
      pathMat.dispose();
      furnitureMat.dispose();
      for (const geo of furnitureGeos) {
        geo.dispose();
      }
      Object.values(materials).forEach((m) => {
        m.dispose();
      });
    },
  };
}
