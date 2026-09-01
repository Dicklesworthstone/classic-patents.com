import * as THREE from "three";
import type { LemelsonWarehousingTelemetry } from "@/physics/lemelsonWarehousingKernel";

export interface LemelsonWarehousingModel {
  readonly group: THREE.Group;
  readonly carriageMesh: THREE.Group;
  readonly elevatorMesh: THREE.Group;
  readonly forkMesh: THREE.Group;
  readonly palletMesh: THREE.Group;
  readonly markers: THREE.Mesh[];
  readonly update: (tel: LemelsonWarehousingTelemetry) => void;
  readonly dispose: () => void;
}

export function createLemelsonWarehousingModel(): LemelsonWarehousingModel {
  const group = new THREE.Group();
  group.name = "lemelson-automatic-warehousing-root";

  // Materials
  const steelRackMat = new THREE.MeshStandardMaterial({
    color: 0x3b82f6, // Industrial Blue
    roughness: 0.5,
    metalness: 0.7,
  });

  const shelfBeamMat = new THREE.MeshStandardMaterial({
    color: 0xf97316, // Safety Orange
    roughness: 0.6,
    metalness: 0.5,
  });

  const trackMat = new THREE.MeshStandardMaterial({
    color: 0x57534e,
    roughness: 0.4,
    metalness: 0.8,
  });

  const craneFrameMat = new THREE.MeshStandardMaterial({
    color: 0xeab308, // Industrial Yellow
    roughness: 0.4,
    metalness: 0.6,
  });

  const motorMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7, // Electric Cyan/Blue
    roughness: 0.3,
    metalness: 0.8,
  });

  const forkMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.3,
    metalness: 0.9,
  });

  const woodPalletMat = new THREE.MeshStandardMaterial({
    color: 0xb45309, // Timber Brown
    roughness: 0.8,
    metalness: 0.1,
  });

  const cargoBoxMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.7,
    metalness: 0.1,
  });

  const markerActiveMat = new THREE.MeshBasicMaterial({
    color: 0xfacc15,
  });

  const markerInactiveMat = new THREE.MeshStandardMaterial({
    color: 0x78716c,
    roughness: 0.2,
    metalness: 0.8,
  });

  const markers: THREE.Mesh[] = [];

  // 1. Build Multi-Tier Storage Racking Grid 50
  const cols = 10;
  const tiers = 6;
  const bayW = 1.2;
  const tierH = 0.8;
  const _rackDepth = 1.0;

  const rackGroup = new THREE.Group();
  rackGroup.name = "warehouse-rack-grid";

  // Front and Back rack rows
  for (const zSide of [-1.2, 1.2]) {
    for (let c = 0; c <= cols; c++) {
      const xPos = (c - cols / 2) * bayW;

      // Vertical Uprights
      const uprightGeo = new THREE.BoxGeometry(0.06, tiers * tierH + 0.2, 0.06);
      const upright = new THREE.Mesh(uprightGeo, steelRackMat);
      upright.position.set(xPos, (tiers * tierH + 0.2) / 2, zSide);
      rackGroup.add(upright);

      // Retroreflective Scotch-Lite Markers along aisle side
      if (zSide > 0 && c < cols) {
        const markerGeo = new THREE.BoxGeometry(0.04, 0.08, 0.02);
        const marker = new THREE.Mesh(markerGeo, markerInactiveMat);
        marker.position.set(xPos, tiers * tierH + 0.15, zSide - 0.04);
        rackGroup.add(marker);
        markers.push(marker);
      }
    }

    // Horizontal Shelf Beams
    for (let t = 0; t <= tiers; t++) {
      const yPos = t * tierH + 0.1;
      const beamGeo = new THREE.BoxGeometry(cols * bayW + 0.1, 0.05, 0.05);
      const beam = new THREE.Mesh(beamGeo, shelfBeamMat);
      beam.position.set(0, yPos, zSide);
      rackGroup.add(beam);
    }
  }

  // Populate some bays with pallets & cargo boxes deterministically
  for (let c = 0; c < cols; c++) {
    for (let t = 1; t <= tiers; t++) {
      // Deterministic pseudo-occupancy
      if ((c * 3 + t * 7) % 3 === 0) {
        const palletGroup = new THREE.Group();
        const px = (c - cols / 2 + 0.5) * bayW;
        const py = t * tierH + 0.15;
        const pz = 1.2;

        // Wood pallet base
        const palBaseGeo = new THREE.BoxGeometry(0.8, 0.08, 0.8);
        const palBase = new THREE.Mesh(palBaseGeo, woodPalletMat);
        palletGroup.add(palBase);

        // Cargo box on pallet
        const boxGeo = new THREE.BoxGeometry(0.65, 0.45, 0.65);
        const box = new THREE.Mesh(boxGeo, cargoBoxMat);
        box.position.y = 0.26;
        palletGroup.add(box);

        palletGroup.position.set(px, py, pz);
        rackGroup.add(palletGroup);
      }
    }
  }

  group.add(rackGroup);

  // 2. Overhead Guide Track 21 & Floor Rails
  const trackGeo = new THREE.BoxGeometry(cols * bayW + 2, 0.12, 0.12);
  const overheadTrack = new THREE.Mesh(trackGeo, trackMat);
  overheadTrack.position.set(0, tiers * tierH + 0.4, 0);
  group.add(overheadTrack);

  const floorRailGeo = new THREE.BoxGeometry(cols * bayW + 2, 0.04, 0.04);
  const floorRail = new THREE.Mesh(floorRailGeo, trackMat);
  floorRail.position.set(0, 0.02, 0);
  group.add(floorRail);

  // 3. Stacker Crane Carriage 22 (Aisle Traversing along X)
  const carriageMesh = new THREE.Group();
  carriageMesh.name = "crane-carriage-22";

  // Top trolley frame
  const trolleyGeo = new THREE.BoxGeometry(0.6, 0.18, 0.5);
  const trolley = new THREE.Mesh(trolleyGeo, craneFrameMat);
  trolley.position.y = tiers * tierH + 0.4;
  carriageMesh.add(trolley);

  // Traverse Motor Mx
  const motorMxGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.22, 16);
  const motorMx = new THREE.Mesh(motorMxGeo, motorMat);
  motorMx.rotation.z = Math.PI / 2;
  motorMx.position.set(0, tiers * tierH + 0.55, 0);
  carriageMesh.add(motorMx);

  // Vertical Mast Column 23
  const mastHeight = tiers * tierH + 0.3;
  const mastColGeo = new THREE.BoxGeometry(0.08, mastHeight, 0.08);

  const mastFront = new THREE.Mesh(mastColGeo, craneFrameMat);
  mastFront.position.set(0, mastHeight / 2 + 0.05, -0.15);
  carriageMesh.add(mastFront);

  const mastBack = new THREE.Mesh(mastColGeo, craneFrameMat);
  mastBack.position.set(0, mastHeight / 2 + 0.05, 0.15);
  carriageMesh.add(mastBack);

  // Bottom stabilizing truck & Hoist Motor Mz
  const bottomTruckGeo = new THREE.BoxGeometry(0.5, 0.12, 0.4);
  const bottomTruck = new THREE.Mesh(bottomTruckGeo, craneFrameMat);
  bottomTruck.position.y = 0.08;
  carriageMesh.add(bottomTruck);

  const motorMzGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.25, 16);
  const motorMz = new THREE.Mesh(motorMzGeo, motorMat);
  motorMz.position.set(0.12, 0.22, 0);
  carriageMesh.add(motorMz);

  // Hoist Chain 29
  const chainGeo = new THREE.CylinderGeometry(0.01, 0.01, mastHeight, 8);
  const chain = new THREE.Mesh(chainGeo, trackMat);
  chain.position.set(0, mastHeight / 2 + 0.05, 0);
  carriageMesh.add(chain);

  // 4. Elevator Carriage 25 (Vertical Movement along Z/Y)
  const elevatorMesh = new THREE.Group();
  elevatorMesh.name = "elevator-carriage-25";

  const elevatorBodyGeo = new THREE.BoxGeometry(0.35, 0.25, 0.38);
  const elevatorBody = new THREE.Mesh(elevatorBodyGeo, craneFrameMat);
  elevatorMesh.add(elevatorBody);

  // Lateral Transfer Motor My
  const motorMyGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.18, 16);
  const motorMy = new THREE.Mesh(motorMyGeo, motorMat);
  motorMy.rotation.x = Math.PI / 2;
  motorMy.position.set(-0.12, 0, 0);
  elevatorMesh.add(motorMy);

  // 5. Extendable Lateral Fork Assembly 27
  const forkMesh = new THREE.Group();
  forkMesh.name = "telescopic-fork-27";

  const forkTineGeo = new THREE.BoxGeometry(0.06, 0.04, 0.75);
  const forkTineLeft = new THREE.Mesh(forkTineGeo, forkMat);
  forkTineLeft.position.set(-0.1, -0.08, 0.35);
  forkMesh.add(forkTineLeft);

  const forkTineRight = new THREE.Mesh(forkTineGeo, forkMat);
  forkTineRight.position.set(0.1, -0.08, 0.35);
  forkMesh.add(forkTineRight);

  elevatorMesh.add(forkMesh);

  // 6. Carried Pallet Load
  const palletMesh = new THREE.Group();
  palletMesh.name = "carried-pallet-load";

  const carriedPalBaseGeo = new THREE.BoxGeometry(0.65, 0.06, 0.65);
  const carriedPalBase = new THREE.Mesh(carriedPalBaseGeo, woodPalletMat);
  palletMesh.add(carriedPalBase);

  const carriedBoxGeo = new THREE.BoxGeometry(0.5, 0.35, 0.5);
  const carriedBox = new THREE.Mesh(carriedBoxGeo, cargoBoxMat);
  carriedBox.position.y = 0.2;
  palletMesh.add(carriedBox);

  forkMesh.add(palletMesh);

  carriageMesh.add(elevatorMesh);
  group.add(carriageMesh);

  // Update loop
  function update(tel: LemelsonWarehousingTelemetry) {
    // Transform coordinates: Center aisle at x=0
    const xWorld = tel.carriageX - (cols * bayW) / 2;
    carriageMesh.position.x = xWorld;

    // Elevator vertical height
    elevatorMesh.position.y = tel.elevatorZ + 0.1;

    // Fork lateral extension along Z-axis in 3D world
    forkMesh.position.z = tel.forkY;

    // Pallet visibility depending on cycle phase
    palletMesh.visible = tel.cyclePhase >= 3 && tel.cyclePhase <= 5;
    palletMesh.position.set(0, 0.06, 0.35);

    // Scotch-Lite marker glow highlight
    const nearestCol = Math.round(tel.carriageX / bayW);
    for (let i = 0; i < markers.length; i++) {
      const marker = markers[i];
      if (marker && i === nearestCol && tel.markerPulseActive) {
        marker.material = markerActiveMat;
      } else if (marker) {
        marker.material = markerInactiveMat;
      }
    }
  }

  function dispose() {
    for (const mat of [
      steelRackMat,
      shelfBeamMat,
      trackMat,
      craneFrameMat,
      motorMat,
      forkMat,
      woodPalletMat,
      cargoBoxMat,
      markerActiveMat,
      markerInactiveMat,
    ]) {
      mat.dispose();
    }
  }

  return {
    group,
    carriageMesh,
    elevatorMesh,
    forkMesh,
    palletMesh,
    markers,
    update,
    dispose,
  };
}
