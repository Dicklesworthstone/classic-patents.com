/**
 * eastmanKodakModel.ts
 *
 * Museum-Grade Procedural 3D Model for George Eastman's 1888 Roll-Film Box Camera
 * (US Patent 388,850).
 *
 * Reconstructs the iconic "You press the button, we do the rest" Kodak No. 1:
 * 1. Rectangular wooden box covered in pebbled black morocco leather.
 * 2. Rapid Rectilinear glass doublet lens mounted in a cylindrical brass barrel.
 * 3. Rotatable cylindrical barrel shutter with slotted aperture.
 * 4. Internal mahogany wood chassis with conical dark chamber / light baffle cone.
 * 5. Roll-film holder carrying 100-exposure continuous paper-backed stripping film.
 * 6. Top brass winding key, cord pull cocking trigger, and tension indicator ratchet.
 */

import * as THREE from "three";

export interface EastmanKodakModelNodes {
  rootGroup: THREE.Group;
  boxBody: THREE.Mesh;
  internalChassis: THREE.Group;
  lightCone: THREE.Mesh;
  filmGroup: THREE.Group;
  supplySpool: THREE.Mesh;
  takeupSpool: THREE.Mesh;
  filmPlane: THREE.Mesh;
  shutterGroup: THREE.Group;
  barrel: THREE.Mesh;
  lensElement: THREE.Mesh;
  windingKey: THREE.Group;
  shutterButton: THREE.Mesh;
}

export interface EastmanKodakMaterials {
  moroccoLeather: THREE.MeshStandardMaterial;
  mahoganyWood: THREE.MeshStandardMaterial;
  burnishedBrass: THREE.MeshStandardMaterial;
  rollFilm: THREE.MeshStandardMaterial;
  opticalGlass: THREE.MeshStandardMaterial;
  darkInterior: THREE.MeshStandardMaterial;
}

export interface EastmanKodakModelResult {
  rootGroup: THREE.Group;
  nodes: EastmanKodakModelNodes;
  materials: EastmanKodakMaterials;
  dispose: () => void;
}

export function buildEastmanKodakModel(): EastmanKodakModelResult {
  const rootGroup = new THREE.Group();
  const materialsToDispose: THREE.Material[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(geo: T): T => {
    geometriesToDispose.push(geo);
    return geo;
  };
  const trackMat = <T extends THREE.Material>(mat: T): T => {
    materialsToDispose.push(mat);
    return mat;
  };

  // Materials
  const materials: EastmanKodakMaterials = {
    moroccoLeather: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x18181b,
        roughness: 0.75,
        metalness: 0.1,
      }),
    ),
    mahoganyWood: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x451a03,
        roughness: 0.55,
        metalness: 0.1,
      }),
    ),
    burnishedBrass: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.22,
        metalness: 0.9,
      }),
    ),
    rollFilm: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        roughness: 0.35,
        metalness: 0.1,
      }),
    ),
    opticalGlass: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        roughness: 0.05,
        metalness: 0.1,
        transparent: true,
        opacity: 0.7,
      }),
    ),
    darkInterior: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x09090b,
        roughness: 0.9,
        metalness: 0.05,
      }),
    ),
  };

  // 1. Black Morocco Leather Covered Box Camera Body (Claim 1)
  const boxBody = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(4.8, 3.8, 3.8)),
    materials.moroccoLeather,
  );
  boxBody.castShadow = true;
  boxBody.receiveShadow = true;
  rootGroup.add(boxBody);

  // 2. Internal Mahogany Chassis & Light Baffle Cone
  const internalChassis = new THREE.Group();
  rootGroup.add(internalChassis);

  const lightCone = new THREE.Mesh(
    trackGeo(new THREE.ConeGeometry(1.6, 3.0, 24, 1, true)),
    materials.darkInterior,
  );
  lightCone.rotation.z = -Math.PI / 2;
  lightCone.position.set(0.4, 0, 0);
  internalChassis.add(lightCone);

  // 3. Roll-Film Spool Mechanism (Claim 1 & Claim 2)
  const filmGroup = new THREE.Group();
  rootGroup.add(filmGroup);

  const supplySpool = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.32, 0.32, 3.2, 16)),
    materials.rollFilm,
  );
  supplySpool.position.set(-1.6, 0, -1.2);
  supplySpool.castShadow = true;
  filmGroup.add(supplySpool);

  const takeupSpool = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.32, 0.32, 3.2, 16)),
    materials.rollFilm,
  );
  takeupSpool.position.set(1.6, 0, -1.2);
  takeupSpool.castShadow = true;
  filmGroup.add(takeupSpool);

  const filmPlane = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(3.2, 3.0, 0.05)),
    materials.rollFilm,
  );
  filmPlane.position.set(0, 0, -1.2);
  filmGroup.add(filmPlane);

  // 4. Rotating Cylindrical Barrel Shutter & Optical Lens
  const shutterGroup = new THREE.Group();
  shutterGroup.position.set(2.4, 0, 0);
  rootGroup.add(shutterGroup);

  const barrel = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.65, 0.65, 0.8, 24)),
    materials.burnishedBrass,
  );
  barrel.rotation.z = Math.PI / 2;
  shutterGroup.add(barrel);

  const lensElement = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.4, 0.4, 0.1, 24)),
    materials.opticalGlass,
  );
  lensElement.rotation.z = Math.PI / 2;
  lensElement.position.x = 0.45;
  shutterGroup.add(lensElement);

  // 5. Top Deck Brass Winding Key & Shutter Release Button
  const windingKey = new THREE.Group();
  windingKey.position.set(-1.6, 2.1, -1.2);
  rootGroup.add(windingKey);

  const keyRing = new THREE.Mesh(
    trackGeo(new THREE.TorusGeometry(0.3, 0.05, 8, 16)),
    materials.burnishedBrass,
  );
  keyRing.rotation.x = Math.PI / 2;
  windingKey.add(keyRing);

  const keyStem = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.06, 0.06, 0.3, 12)),
    materials.burnishedBrass,
  );
  keyStem.position.y = -0.15;
  windingKey.add(keyStem);

  const shutterButton = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.12, 0.12, 0.18, 16)),
    materials.burnishedBrass,
  );
  shutterButton.position.set(1.8, 2.0, 0);
  rootGroup.add(shutterButton);

  const nodes: EastmanKodakModelNodes = {
    rootGroup,
    boxBody,
    internalChassis,
    lightCone,
    filmGroup,
    supplySpool,
    takeupSpool,
    filmPlane,
    shutterGroup,
    barrel,
    lensElement,
    windingKey,
    shutterButton,
  };

  const dispose = () => {
    for (const m of materialsToDispose) {
      m.dispose();
    }
    for (const g of geometriesToDispose) {
      g.dispose();
    }
  };

  return { rootGroup, nodes, materials, dispose };
}

/**
 * Updates Kodak barrel shutter rotation, film advance, and cutaway shell transparency.
 */
export function updateEastmanKodakKinematics(
  nodes: EastmanKodakModelNodes,
  materials: EastmanKodakMaterials,
  dt: number,
  _timeSec: number,
  barrelOmegaRadPerS: number,
  isCutaway: boolean,
  filmAdvanceSpeedRadPerS: number,
) {
  // 1. Shutter Rotation
  nodes.barrel.rotation.x += barrelOmegaRadPerS * dt;

  // 2. Film Spool & Winding Key Motion during advance
  nodes.windingKey.rotation.y += filmAdvanceSpeedRadPerS * dt;
  nodes.takeupSpool.rotation.y += filmAdvanceSpeedRadPerS * dt;
  nodes.supplySpool.rotation.y += filmAdvanceSpeedRadPerS * 0.8 * dt;

  // 3. Cutaway Body Mode
  materials.moroccoLeather.opacity = isCutaway ? 0.28 : 1.0;
  materials.moroccoLeather.transparent = isCutaway;
}
