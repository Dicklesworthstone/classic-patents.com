import * as THREE from "three";
import type { LemelsonWarehousePose } from "@/physics/lemelsonWarehouseKernel";

export interface LemelsonWarehouseModel {
  root: THREE.Group;
  updatePose: (pose: LemelsonWarehousePose) => void;
  dispose: () => void;
}

/** Procedural normalized rail/mast/shuttle exhibit based on Figs. 1–3. */
export function buildLemelsonWarehouseModel(): LemelsonWarehouseModel {
  const root = new THREE.Group();
  root.name = "US 3,119,501 normalized warehouse carrier exhibit";
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const geometry = <T extends THREE.BufferGeometry>(value: T): T => {
    geometries.push(value);
    return value;
  };
  const material = <T extends THREE.Material>(value: T): T => {
    materials.push(value);
    return value;
  };
  const steel = material(
    new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.25 }),
  );
  const railMat = material(
    new THREE.MeshStandardMaterial({ color: 0x06b6d4, metalness: 0.6, roughness: 0.28 }),
  );
  const carrierMat = material(
    new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.62, roughness: 0.23 }),
  );
  const shuttleMat = material(
    new THREE.MeshStandardMaterial({ color: 0xc084fc, metalness: 0.45, roughness: 0.3 }),
  );
  const rackMat = material(
    new THREE.MeshStandardMaterial({
      color: 0x164e63,
      metalness: 0.38,
      roughness: 0.48,
      transparent: true,
      opacity: 0.78,
    }),
  );
  const rail = new THREE.Mesh(geometry(new THREE.BoxGeometry(6.8, 0.14, 0.34)), railMat);
  rail.name = "rail and first conveying means";
  rail.position.y = -1.55;
  root.add(rail);
  const rack = new THREE.Group();
  rack.name = "storage volumes or bays";
  const bayColumns = [-2.2, 0, 2.2] as const;
  for (let row = 0; row < 3; row += 1) {
    for (let column = 0; column < 3; column += 1) {
      const bay = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.86, 0.78, 0.75)), rackMat);
      bay.name = `storage bay ${row + 1}-${column + 1}`;
      bay.position.set(bayColumns[column], -0.96 + row * 0.84, 0.88);
      rack.add(bay);
    }
  }
  for (const x of [-2.72, -1.1, 1.1, 2.72]) {
    const post = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.08, 3.05, 0.12)), steel);
    post.name = "storage rack vertical support";
    post.position.set(x, -0.12, 0.88);
    rack.add(post);
  }
  for (const y of [-1.39, -0.55, 0.29, 1.13]) {
    const shelf = new THREE.Mesh(geometry(new THREE.BoxGeometry(5.52, 0.08, 0.92)), steel);
    shelf.name = "storage rack horizontal support";
    shelf.position.set(0, y, 0.88);
    rack.add(shelf);
  }
  root.add(rack);
  const carrier = new THREE.Group();
  carrier.name = "self-propelled carrier, elevator, and shuttle";
  const mast = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.16, 3.1, 0.32)), steel);
  mast.name = "vertical carrier mast";
  mast.position.y = -0.05;
  carrier.add(mast);
  const carriageBase = new THREE.Mesh(
    geometry(new THREE.BoxGeometry(0.92, 0.24, 0.62)),
    carrierMat,
  );
  carriageBase.name = "rail-supported carrier chassis";
  carriageBase.position.y = -1.42;
  carrier.add(carriageBase);
  const lift = new THREE.Group();
  lift.name = "vertically movable carrier platform";
  const platform = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.88, 0.19, 0.72)), carrierMat);
  lift.add(platform);
  const shuttle = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.72, 0.14, 1)), shuttleMat);
  shuttle.name = "connected transverse shuttle beam";
  lift.add(shuttle);
  const fixture = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.94, 0.08, 0.36)), shuttleMat);
  fixture.name = "laterally extending article fixture";
  lift.add(fixture);
  carrier.add(lift);
  root.add(carrier);
  const scanner = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.12, 0.12, 0.24, 16)),
    railMat,
  );
  scanner.name = "photoelectric / marker scanning relay display";
  scanner.rotation.x = Math.PI / 2;
  scanner.position.set(0, -1.24, 0.36);
  carrier.add(scanner);
  for (const x of bayColumns) {
    const marker = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.08, 0.24, 0.08)), railMat);
    marker.name = "rack position marker";
    marker.position.set(x, -1.35, 0.36);
    root.add(marker);
  }

  return {
    root,
    updatePose: (pose) => {
      carrier.position.x = -2.2 + pose.carrierX * 4.4;
      lift.position.y = -1.22 + pose.carrierY * 2.35;
      const shuttleBase = 0.29;
      const shuttleFront = 0.42 + pose.shuttleZ * 0.9;
      const shuttleLength = shuttleFront - shuttleBase;
      shuttle.scale.z = shuttleLength;
      shuttle.position.z = shuttleBase + shuttleLength / 2;
      fixture.position.z = shuttleFront;
      rack.visible = true;
      scanner.material = pose.automaticAddressing ? railMat : steel;
    },
    dispose: () => {
      for (const item of geometries) {
        item.dispose();
      }
      for (const item of materials) {
        item.dispose();
      }
    },
  };
}
