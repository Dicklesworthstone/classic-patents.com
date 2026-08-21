/**
 * parsonsTurbineModel.ts
 *
 * Museum-Grade Procedural 3D Model for Sir Charles Parsons' 1898 marine turbine network
 * (US Patent 608,969).
 *
 * Reconstructs the source's valve-and-pipe arrangement:
 * 1. Separate turbine banks on multiple screw-shafts.
 * 2. Steam pipes and selectable junctions between turbine casings.
 * 3. Condenser outlets and dedicated X/Y reversing motors from Figure 2.
 * 4. Dynamic steam particles following the live route topology.
 */

import * as THREE from "three";
import { fluidFrames, sampleFluidAt } from "@/physics/genericWasm";
import { type ParsonsRoutingMode, stepParsonsMarine } from "@/physics/parsonsMarineKernel";
import { createLcg } from "@/utils/lcg";

const lcg = createLcg(1471);

export interface ParsonsTurbineModelNodes {
  rootGroup: THREE.Group;
  bedplateGroup: THREE.Group;
  rotorGroup: THREE.Group;
  casingGroup: THREE.Group;
  casingShells: THREE.Mesh[];
  shaft: THREE.Mesh;
  turbineMeshes: THREE.Mesh[];
  pipeMeshes: THREE.Mesh[];
  routePipeGroups: Record<ParsonsRoutingMode, THREE.Mesh[]>;
  reversingPipes: THREE.Mesh[];
  steamPoints: THREE.Points;
  steamPositions: Float32Array;
  steamRadii: Float32Array;
  steamCount: number;
}

export interface ParsonsTurbineMaterials {
  castIronCasing: THREE.MeshStandardMaterial;
  steelRotor: THREE.MeshStandardMaterial;
  reversingHousing: THREE.MeshStandardMaterial;
  pipes: THREE.MeshStandardMaterial;
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
    reversingHousing: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.3,
        metalness: 0.85,
        side: THREE.DoubleSide,
      }),
    ),
    pipes: trackMat(
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

  // 1. Shared bedplate supporting the pictured screw-shaft groups.
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

  // 3. Turbine banks and screw-shafts from Figures 1–3.
  const rotorGroup = new THREE.Group();
  rootGroup.add(rotorGroup);

  const shaft = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.16, 0.16, 12.5, 20)),
    materials.steelRotor,
  );
  shaft.rotation.z = Math.PI / 2;
  shaft.position.y = -1.8;
  rotorGroup.add(shaft);

  const casingShells: THREE.Mesh[] = [];
  const turbineMeshes: THREE.Mesh[] = [];
  const pipeMeshes: THREE.Mesh[] = [];
  const turbineNames = ["A", "A′", "B", "B′", "C", "C′", "D", "D′", "X", "Y"];
  const positions = new Map<string, THREE.Vector3>();
  turbineNames.forEach((name, index) => {
    const row = name === "X" || name === "Y" ? 2 : Math.floor(index / 4);
    const column = name === "X" ? 1 : name === "Y" ? 2 : index % 4;
    const center = new THREE.Vector3(-4.2 + column * 2.7, 0.8 - row * 1.5, 0);
    positions.set(name, center);
    const casing = new THREE.Mesh(
      trackGeo(
        new THREE.CylinderGeometry(
          name === "X" || name === "Y" ? 0.6 : 0.72,
          name === "X" || name === "Y" ? 0.6 : 0.72,
          1.45,
          24,
          1,
          false,
          0,
          Math.PI * 1.35,
        ),
      ),
      name === "X" || name === "Y" ? materials.reversingHousing : materials.castIronCasing,
    );
    casing.rotation.z = Math.PI / 2;
    casing.position.copy(center);
    casing.castShadow = true;
    casing.receiveShadow = true;
    casingGroup.add(casing);
    casingShells.push(casing);
    turbineMeshes.push(casing);
  });

  const pipeBetween = (from: THREE.Vector3, to: THREE.Vector3) => {
    const delta = new THREE.Vector3().subVectors(to, from);
    const pipe = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.08, 0.08, delta.length(), 12)),
      materials.pipes,
    );
    pipe.position.copy(from).add(to).multiplyScalar(0.5);
    pipe.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.normalize());
    casingGroup.add(pipe);
    pipeMeshes.push(pipe);
    return pipe;
  };
  const routePipeGroups: Record<ParsonsRoutingMode, THREE.Mesh[]> = {
    series: [],
    "compound-parallel": [],
    "simple-parallel": [],
  };
  const reversingPipes: THREE.Mesh[] = [];
  for (const route of ["series", "compound-parallel", "simple-parallel"] as const) {
    for (const [from, to] of stepParsonsMarine({ routing: route }).routeEdges) {
      const fromPos =
        from === "boiler"
          ? new THREE.Vector3(-6.0, 0, 0)
          : from.startsWith("condenser")
            ? new THREE.Vector3(6.0, 0, 0)
            : positions.get(from);
      const toPos =
        to === "boiler"
          ? new THREE.Vector3(-6.0, 0, 0)
          : to.startsWith("condenser")
            ? new THREE.Vector3(6.0, 0, 0)
            : positions.get(to);
      if (fromPos && toPos) routePipeGroups[route].push(pipeBetween(fromPos, toPos));
    }
  }
  for (const [from, to] of stepParsonsMarine({ reversing: true }).routeEdges) {
    const fromPos =
      from === "boiler"
        ? new THREE.Vector3(-6.0, 0, 0)
        : from.startsWith("condenser")
          ? new THREE.Vector3(6.0, 0, 0)
          : positions.get(from);
    const toPos =
      to === "boiler"
        ? new THREE.Vector3(-6.0, 0, 0)
        : to.startsWith("condenser")
          ? new THREE.Vector3(6.0, 0, 0)
          : positions.get(to);
    if (fromPos && toPos) reversingPipes.push(pipeBetween(fromPos, toPos));
  }

  // 4. Steam Flow Streamline Particles
  const steamGeo = trackGeo(new THREE.BufferGeometry());
  const steamPositions = new Float32Array(STEAM_COUNT * 3);
  const steamRadii = new Float32Array(STEAM_COUNT);

  for (let i = 0; i < STEAM_COUNT; i++) {
    const idx = i * 3;
    const x = -4.5 + lcg() * 9.5;
    const r = 0.4 + 1.2 * lcg();
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
    turbineMeshes,
    pipeMeshes,
    routePipeGroups,
    reversingPipes,
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
  steamSwirlOmegaRadPerS: number,
  showSteamFlow: boolean,
  isCutaway: boolean,
  routing: ParsonsRoutingMode = "series",
  reversing = false,
) {
  // 1. Rotor Rotation
  nodes.rotorGroup.rotation.x += displayOmegaRadPerS * dt;

  // 2. Steam particles traverse the selected source route.
  const marine = stepParsonsMarine({ routing, reversing });
  for (const [mode, pipes] of Object.entries(nodes.routePipeGroups) as [
    ParsonsRoutingMode,
    THREE.Mesh[],
  ][]) {
    for (const pipe of pipes) pipe.visible = !reversing && mode === routing;
  }
  for (const pipe of nodes.reversingPipes) pipe.visible = reversing;
  const fluid = fluidFrames(16, 8);
  const frame = Math.abs(Math.floor(_timeSec * 4)) % 8;
  const pos = nodes.steamPositions;
  for (let i = 0; i < nodes.steamCount; i++) {
    const idx = i * 3;
    const u = Math.max(0, Math.min(1, ((pos[idx] ?? 0) + 4.5) / 9.5));
    const v = 0.5 + ((pos[idx + 1] ?? 0) + 2.5) / 5;
    const dens = sampleFluidAt(fluid, 16, 8, frame, u, v);
    const routeFactor = marine.routeEdges.length / 9;
    pos[idx] += steamAdvancePerS * dt * (0.6 + dens) * routeFactor;
    let x = pos[idx];

    if (x > 5.0) {
      x = -4.5;
      pos[idx] = x;
    }

    const maxR = 0.45 + 0.1 * marine.routeEdges.length;

    let r = nodes.steamRadii[i];
    if (r < maxR) {
      r += (maxR - r) * 0.6 * dt;
    } else if (r > maxR + 0.1) {
      r -= (r - maxR) * 0.6 * dt;
    }
    nodes.steamRadii[i] = r;

    let a = Math.atan2(pos[idx + 2], pos[idx + 1]);
    a += steamSwirlOmegaRadPerS * dt;
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
