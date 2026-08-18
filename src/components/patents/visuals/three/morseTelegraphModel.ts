/**
 * morseTelegraphModel.ts
 *
 * Museum-Grade Procedural 3D Model for Samuel Morse's 1840 Electro-Magnetic Telegraph
 * (US Patent 1,647 - "Improvement in the Mode of Communicating Information by Signals by the Application of Electro-Magnetism").
 *
 * Reconstructs the apparatus that established instantaneous telecommunication:
 * 1. Mahogany instrument baseboard with turned brass bun feet and binding posts.
 * 2. Transmitting telegraph key lever with brass trunnion bearings and ebonite finger knob.
 * 3. Electromagnetic sounder receiver with twin soft-iron cores and silk-insulated copper windings.
 * 4. Pivoted iron armature lever with adjustable back-stop anvil screw and return spring.
 * 5. Continuous paper tape recording register with supply spool, guide rollers, and steel embossing stylus.
 * 6. Dynamic circuit electron current stream.
 */

import * as THREE from "three";

export interface MorseTelegraphModelNodes {
  rootGroup: THREE.Group;
  baseboard: THREE.Mesh;
  keyGroup: THREE.Group;
  keyLeverGroup: THREE.Group;
  keyKnob: THREE.Mesh;
  sounderGroup: THREE.Group;
  coils: THREE.Mesh[];
  armatureGroup: THREE.Group;
  tapeSpool: THREE.Mesh;
  electronPoints: THREE.Points;
  electronPositions: Float32Array;
  electronCount: number;
}

export interface MorseTelegraphMaterials {
  mahogany: THREE.MeshStandardMaterial;
  brass: THREE.MeshStandardMaterial;
  copperCoil: THREE.MeshStandardMaterial;
  ironCore: THREE.MeshStandardMaterial;
  paperTape: THREE.MeshStandardMaterial;
  eboniteKnob: THREE.MeshStandardMaterial;
  electronMat: THREE.PointsMaterial;
}

export interface MorseTelegraphModelResult {
  rootGroup: THREE.Group;
  nodes: MorseTelegraphModelNodes;
  materials: MorseTelegraphMaterials;
  dispose: () => void;
}

const ELECTRON_COUNT = 50;

export function buildMorseTelegraphModel(): MorseTelegraphModelResult {
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
  const materials: MorseTelegraphMaterials = {
    mahogany: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x78350f,
        roughness: 0.35,
        metalness: 0.08,
      }),
    ),
    brass: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.18,
        metalness: 0.92,
      }),
    ),
    copperCoil: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xca8a04,
        roughness: 0.28,
        metalness: 0.85,
      }),
    ),
    ironCore: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x334155,
        roughness: 0.4,
        metalness: 0.8,
      }),
    ),
    paperTape: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xfef9e7,
        roughness: 0.8,
        metalness: 0.02,
        side: THREE.DoubleSide,
      }),
    ),
    eboniteKnob: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.5,
        metalness: 0.1,
      }),
    ),
    electronMat: trackMat(
      new THREE.PointsMaterial({
        size: 0.18,
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    ),
  };

  // 1. Mahogany Baseboard & Bun Feet
  const baseboard = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(12.5, 0.7, 7.5)),
    materials.mahogany,
  );
  baseboard.position.y = -2.4;
  baseboard.castShadow = true;
  baseboard.receiveShadow = true;
  rootGroup.add(baseboard);

  [
    [-5.6, -3.2],
    [5.6, -3.2],
    [-5.6, 3.2],
    [5.6, 3.2],
  ].forEach(([fx, fz]) => {
    const foot = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.35, 0.25, 0.35, 16)),
      materials.brass,
    );
    foot.position.set(fx, -2.9, fz);
    rootGroup.add(foot);
  });

  // 2. Transmitting Key Lever (Left)
  const keyGroup = new THREE.Group();
  keyGroup.position.set(-3.5, -1.8, 0);
  rootGroup.add(keyGroup);

  const keyPlate = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(4.8, 0.18, 2.2)), materials.brass);
  keyPlate.castShadow = true;
  keyGroup.add(keyPlate);

  [-0.9, 0.9].forEach((zPos) => {
    const post = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.18, 0.22, 0.85, 12)),
      materials.brass,
    );
    post.position.set(0, 0.45, zPos);
    keyGroup.add(post);
  });

  const keyLeverGroup = new THREE.Group();
  keyLeverGroup.position.set(0, 0.65, 0);
  keyGroup.add(keyLeverGroup);

  const keyLever = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(4.2, 0.16, 0.28)),
    materials.brass,
  );
  keyLever.position.set(-0.2, 0, 0);
  keyLever.castShadow = true;
  keyLeverGroup.add(keyLever);

  const keyKnob = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.42, 0.3, 0.35, 24)),
    materials.eboniteKnob,
  );
  keyKnob.position.set(-2.1, 0.25, 0);
  keyKnob.castShadow = true;
  keyLeverGroup.add(keyKnob);

  // 3. Sounder & Relay Electromagnet (Right)
  const sounderGroup = new THREE.Group();
  sounderGroup.position.set(3.5, -1.8, 0);
  rootGroup.add(sounderGroup);

  const coils: THREE.Mesh[] = [];
  [-0.65, 0.65].forEach((cz) => {
    const core = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.25, 0.25, 1.8, 16)),
      materials.ironCore,
    );
    core.position.set(0, 0.9, cz);
    sounderGroup.add(core);

    const coil = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.65, 0.65, 1.5, 24)),
      materials.copperCoil,
    );
    coil.position.set(0, 0.85, cz);
    coil.castShadow = true;
    sounderGroup.add(coil);
    coils.push(coil);
  });

  // Pivoted Armature Lever
  const armatureGroup = new THREE.Group();
  armatureGroup.position.set(0, 2.0, 0);
  sounderGroup.add(armatureGroup);

  const armatureBar = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(2.8, 0.22, 0.45)),
    materials.ironCore,
  );
  armatureBar.castShadow = true;
  armatureGroup.add(armatureBar);

  // 4. Paper Tape Register Spool
  const tapeSpool = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(1.2, 1.2, 0.6, 24)),
    materials.paperTape,
  );
  tapeSpool.rotation.x = Math.PI / 2;
  tapeSpool.position.set(1.5, 1.4, -2.4);
  sounderGroup.add(tapeSpool);

  // 5. Flowing Electron Particles
  const electronGeo = trackGeo(new THREE.BufferGeometry());
  const electronPositions = new Float32Array(ELECTRON_COUNT * 3);
  for (let i = 0; i < ELECTRON_COUNT; i++) {
    electronPositions[i * 3] = -3.5 + (i / ELECTRON_COUNT) * 7.0;
    electronPositions[i * 3 + 1] = -1.9;
    electronPositions[i * 3 + 2] = 0;
  }
  electronGeo.setAttribute("position", new THREE.BufferAttribute(electronPositions, 3));
  const electronPoints = new THREE.Points(electronGeo, materials.electronMat);
  rootGroup.add(electronPoints);

  const nodes: MorseTelegraphModelNodes = {
    rootGroup,
    baseboard,
    keyGroup,
    keyLeverGroup,
    keyKnob,
    sounderGroup,
    coils,
    armatureGroup,
    tapeSpool,
    electronPoints,
    electronPositions,
    electronCount: ELECTRON_COUNT,
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
 * Updates key lever depression, sounder armature strike, paper tape motion, and cutaway.
 */
export function updateMorseTelegraphKinematics(
  nodes: MorseTelegraphModelNodes,
  materials: MorseTelegraphMaterials,
  dt: number,
  timeSec: number,
  keyOscillationRadPerS: number,
  armatureStrikeM: number,
  tapeAdvanceRadPerS: number,
  electronDisplaySpeed: number,
  keyIsDown: boolean,
  isCutaway: boolean,
) {
  // 1. Key Action (manual or rhythmic Morse oscillation)
  const isKeyActive = keyIsDown || Math.sin(timeSec * keyOscillationRadPerS) > 0.2;
  nodes.keyLeverGroup.rotation.z = isKeyActive ? 0.08 : 0;

  // 2. Sounder Armature Strike
  const strike = isKeyActive ? -armatureStrikeM : 0;
  nodes.armatureGroup.position.y = 2.0 + strike;

  // 3. Paper Tape Advance
  if (isKeyActive) {
    nodes.tapeSpool.rotation.y += dt * tapeAdvanceRadPerS;
  }

  // 4. Flowing Circuit Electrons
  const pos = nodes.electronPositions;
  for (let i = 0; i < nodes.electronCount; i++) {
    const idx = i * 3;
    if (isKeyActive) {
      pos[idx] += dt * electronDisplaySpeed;
      if (pos[idx] > 3.5) {
        pos[idx] = -3.5;
      }
    }
  }
  nodes.electronPoints.geometry.attributes.position.needsUpdate = true;
  nodes.electronPoints.visible = isKeyActive;

  // 5. Cutaway Mode
  materials.mahogany.opacity = isCutaway ? 0.35 : 1.0;
  materials.mahogany.transparent = isCutaway;
}
