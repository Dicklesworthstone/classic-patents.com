/**
 * parsonsTurbineModel.ts
 *
 * Museum-Grade Procedural 3D Model for Sir Charles Parsons' 1898 Multi-Stage Axial Reaction Steam Turbine
 * (US Patent 608,969).
 *
 * Reconstructs the revolutionary Turbinia high-speed steam turbomachinery:
 * 1. Heavy cast-iron bedplate with flanged journal bearing pedestals.
 * 2. Stepped cylindrical rotor drum shaft with dummy piston axial thrust balance.
 * 3. 3-stage expansion (High-Pressure, Intermediate-Pressure, Low-Pressure) with increasing drum diameters.
 * 4. High-density curved reaction blade rings (instanced bronze rotor blades & steel stator guide vanes).
 * 5. Cutaway upper casing shell allowing visual inspection of internal blade rows and steam expansion annular channel.
 * 6. Dynamic steam streamline particle flow expanding axially through the reaction stages.
 */

import * as THREE from "three";
import { createLcg } from "@/utils/lcg";

const lcg = createLcg(1471);

export interface ParsonsTurbineModelNodes {
  rootGroup: THREE.Group;
  bedplateGroup: THREE.Group;
  rotorGroup: THREE.Group;
  casingGroup: THREE.Group;
  casingShells: THREE.Mesh[];
  shaft: THREE.Mesh;
  dummyPiston: THREE.Mesh;
  steamPoints: THREE.Points;
  steamPositions: Float32Array;
  steamRadii: Float32Array;
  steamCount: number;
}

export interface ParsonsTurbineMaterials {
  castIronCasing: THREE.MeshStandardMaterial;
  steelRotor: THREE.MeshStandardMaterial;
  bronzeBlades: THREE.MeshStandardMaterial;
  statorBlades: THREE.MeshStandardMaterial;
  steamPoints: THREE.PointsMaterial;
}

export interface ParsonsTurbineModelResult {
  rootGroup: THREE.Group;
  nodes: ParsonsTurbineModelNodes;
  materials: ParsonsTurbineMaterials;
  dispose: () => void;
}

const STEAM_COUNT = 300;

export function buildParsonsTurbineModel(): ParsonsTurbineModelResult {
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
  const materials: ParsonsTurbineMaterials = {
    castIronCasing: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.6,
        metalness: 0.7,
        side: THREE.DoubleSide,
      }),
    ),
    steelRotor: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.2,
        metalness: 0.8,
      }),
    ),
    bronzeBlades: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.3,
        metalness: 0.85,
        side: THREE.DoubleSide,
      }),
    ),
    statorBlades: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x64748b,
        roughness: 0.4,
        metalness: 0.8,
        side: THREE.DoubleSide,
      }),
    ),
    steamPoints: trackMat(
      new THREE.PointsMaterial({
        size: 0.18,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        color: 0xbae6fd,
      }),
    ),
  };

  // 1. Bedplate & Bearing Pedestals
  const bedplateGroup = new THREE.Group();
  rootGroup.add(bedplateGroup);

  const bedplate = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(13.0, 0.9, 6.5)),
    materials.castIronCasing,
  );
  bedplate.position.y = -2.6;
  bedplate.receiveShadow = true;
  bedplateGroup.add(bedplate);

  const pedestalLeft = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(1.5, 3.0, 2.0)),
    materials.castIronCasing,
  );
  pedestalLeft.position.set(-5.5, -1.0, 0);
  bedplateGroup.add(pedestalLeft);

  const pedestalRight = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(1.5, 3.0, 2.0)),
    materials.castIronCasing,
  );
  pedestalRight.position.set(5.5, -1.0, 0);
  bedplateGroup.add(pedestalRight);

  // 2. Casing Group (Lower half and upper cutaway shells)
  const casingGroup = new THREE.Group();
  rootGroup.add(casingGroup);

  // 3. Rotor Group (Shaft, dummy balance piston, drum stages, reaction blades)
  const rotorGroup = new THREE.Group();
  rootGroup.add(rotorGroup);

  const shaft = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.3, 0.3, 12.5, 32)),
    materials.steelRotor,
  );
  shaft.rotation.z = Math.PI / 2;
  rotorGroup.add(shaft);

  const dummyPiston = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.85, 0.85, 0.8, 32)),
    materials.steelRotor,
  );
  dummyPiston.rotation.z = Math.PI / 2;
  dummyPiston.position.set(-4.8, 0, 0);
  rotorGroup.add(dummyPiston);

  // Stages Configuration (HP, IP, LP)
  const stages = [
    { cx: -2.8, drumR: 0.8, casingR: 1.3, length: 3.0, rows: 8, bladeCount: 40 }, // HP Stage
    { cx: 0.2, drumR: 1.2, casingR: 1.8, length: 2.8, rows: 7, bladeCount: 60 }, // IP Stage
    { cx: 3.4, drumR: 1.6, casingR: 2.4, length: 3.2, rows: 6, bladeCount: 80 }, // LP Stage
  ];

  const bladeShape = new THREE.Shape();
  bladeShape.moveTo(0, 0.08);
  bladeShape.quadraticCurveTo(0.1, 0.04, 0.15, -0.08);
  bladeShape.quadraticCurveTo(0.05, -0.02, 0, 0.08);
  const extrudeSettings = { depth: 1.0, bevelEnabled: false };
  const baseBladeGeo = trackGeo(new THREE.ExtrudeGeometry(bladeShape, extrudeSettings));
  baseBladeGeo.center();

  let totalRotorBlades = 0;
  let totalStatorBlades = 0;
  for (const s of stages) {
    totalRotorBlades += s.rows * s.bladeCount;
    totalStatorBlades += s.rows * s.bladeCount;
  }

  const rotorInstanced = new THREE.InstancedMesh(
    baseBladeGeo,
    materials.bronzeBlades,
    totalRotorBlades,
  );
  rotorGroup.add(rotorInstanced);

  const statorInstanced = new THREE.InstancedMesh(
    baseBladeGeo,
    materials.statorBlades,
    totalStatorBlades,
  );
  casingGroup.add(statorInstanced);

  let rotorIdx = 0;
  let statorIdx = 0;
  const dummyObj = new THREE.Object3D();
  const casingShells: THREE.Mesh[] = [];

  for (const { cx, drumR, casingR, length, rows, bladeCount } of stages) {
    const drum = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(drumR, drumR, length, 32)),
      materials.steelRotor,
    );
    drum.rotation.z = Math.PI / 2;
    drum.position.set(cx, 0, 0);
    rotorGroup.add(drum);

    const casing = new THREE.Mesh(
      trackGeo(
        new THREE.CylinderGeometry(
          casingR + 0.1,
          casingR + 0.1,
          length,
          64,
          1,
          false,
          0,
          Math.PI * 1.3,
        ),
      ),
      materials.castIronCasing,
    );
    casing.rotation.z = Math.PI / 2;
    casing.position.set(cx, 0, 0);
    casing.castShadow = true;
    casing.receiveShadow = true;
    casingGroup.add(casing);
    casingShells.push(casing);

    const rowSpacing = length / (rows * 2);
    const startX = cx - length / 2 + rowSpacing;

    for (let r = 0; r < rows; r++) {
      const rX = startX + r * 2 * rowSpacing;
      const bladeHeight = casingR - drumR - 0.02;

      for (let b = 0; b < bladeCount; b++) {
        const angle = (b / bladeCount) * Math.PI * 2;
        dummyObj.position.set(
          rX,
          Math.cos(angle) * (drumR + bladeHeight / 2),
          Math.sin(angle) * (drumR + bladeHeight / 2),
        );
        dummyObj.rotation.set(angle, Math.PI / 2, 0);
        dummyObj.rotateY(Math.PI / 6);
        dummyObj.scale.set(1.0, 1.0, bladeHeight);
        dummyObj.updateMatrix();
        rotorInstanced.setMatrixAt(rotorIdx++, dummyObj.matrix);
      }

      const sX = startX + r * 2 * rowSpacing + rowSpacing;
      for (let b = 0; b < bladeCount; b++) {
        const angle = (b / bladeCount) * Math.PI * 2;
        if (angle > Math.PI * 1.3 && angle < Math.PI * 2) continue;

        dummyObj.position.set(
          sX,
          Math.cos(angle) * (casingR - bladeHeight / 2),
          Math.sin(angle) * (casingR - bladeHeight / 2),
        );
        dummyObj.rotation.set(angle + Math.PI, Math.PI / 2, 0);
        dummyObj.rotateY(-Math.PI / 6);
        dummyObj.scale.set(1.0, 1.0, bladeHeight);
        dummyObj.updateMatrix();
        statorInstanced.setMatrixAt(statorIdx++, dummyObj.matrix);
      }
    }
  }

  // 4. Steam Flow Streamline Particles
  const steamGeo = trackGeo(new THREE.BufferGeometry());
  const steamPositions = new Float32Array(STEAM_COUNT * 3);
  const steamRadii = new Float32Array(STEAM_COUNT);

  for (let i = 0; i < STEAM_COUNT; i++) {
    const idx = i * 3;
    const x = -4.5 + lcg() * 9.5;
    let maxR = 0.8;
    if (x > -4.3 && x <= -1.3) maxR = 1.25;
    else if (x > -1.3 && x <= 1.7) maxR = 1.75;
    else if (x > 1.7 && x <= 5.0) maxR = 2.35;

    const r = maxR * lcg() ** 0.5;
    const a = lcg() * Math.PI * 2;

    steamPositions[idx] = x;
    steamPositions[idx + 1] = Math.cos(a) * r;
    steamPositions[idx + 2] = Math.sin(a) * r;
    steamRadii[i] = r;
  }

  steamGeo.setAttribute("position", new THREE.BufferAttribute(steamPositions, 3));
  const steamPoints = new THREE.Points(steamGeo, materials.steamPoints);
  rootGroup.add(steamPoints);

  const nodes: ParsonsTurbineModelNodes = {
    rootGroup,
    bedplateGroup,
    rotorGroup,
    casingGroup,
    casingShells,
    shaft,
    dummyPiston,
    steamPoints,
    steamPositions,
    steamRadii,
    steamCount: STEAM_COUNT,
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
 * Updates turbine rotor rotation, steam streamline expansion, and casing cutaway.
 */
export function updateParsonsTurbineKinematics(
  nodes: ParsonsTurbineModelNodes,
  materials: ParsonsTurbineMaterials,
  dt: number,
  _timeSec: number,
  displayOmegaRadPerS: number,
  steamAdvancePerS: number,
  steamOpacity: number,
  showSteamFlow: boolean,
  isCutaway: boolean,
) {
  // 1. Rotor Rotation
  nodes.rotorGroup.rotation.x += displayOmegaRadPerS * dt;

  // 2. Steam Streamline Particle Advection
  const pos = nodes.steamPositions;
  for (let i = 0; i < nodes.steamCount; i++) {
    const idx = i * 3;
    pos[idx] += steamAdvancePerS * dt;
    let x = pos[idx];

    if (x > 5.0) {
      x = -4.5;
      pos[idx] = x;
    }

    let maxR = 0.8;
    if (x > -4.3 && x <= -1.3) maxR = 1.25;
    else if (x > -1.3 && x <= 1.7) maxR = 1.75;
    else if (x > 1.7 && x <= 5.0) maxR = 2.35;

    let r = nodes.steamRadii[i];
    if (r < maxR) {
      r += (maxR - r) * 5.0 * dt;
    } else if (r > maxR + 0.1) {
      r -= (r - maxR) * 10.0 * dt;
    }
    nodes.steamRadii[i] = r;

    let a = Math.atan2(pos[idx + 2], pos[idx + 1]);
    a += displayOmegaRadPerS * 0.5 * dt;
    pos[idx + 1] = Math.cos(a) * r;
    pos[idx + 2] = Math.sin(a) * r;
  }
  nodes.steamPoints.geometry.attributes.position.needsUpdate = true;

  // 3. Steam Streamline Visibility and Opacity
  nodes.steamPoints.visible = showSteamFlow;
  materials.steamPoints.opacity = steamOpacity;

  // 4. Cutaway Casing Transparency
  materials.castIronCasing.opacity = isCutaway ? 0.35 : 1.0;
  materials.castIronCasing.transparent = isCutaway;
}
