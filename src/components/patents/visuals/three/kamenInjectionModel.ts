import * as THREE from "three";
import type { KamenInjectionPose } from "@/physics/kamenInjectionKernel";

export interface KamenInjectionModel {
  root: THREE.Group;
  updatePose: (pose: KamenInjectionPose) => void;
  dispose: () => void;
}

/** Procedural normalized motor/lead-screw/counter exhibit from Figs. 2–6. */
export function buildKamenInjectionModel(): KamenInjectionModel {
  const root = new THREE.Group();
  root.name = "US 3,858,581 nonclinical normalized lead-screw exhibit";
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
  const housingMat = material(
    new THREE.MeshStandardMaterial({ color: 0x172554, metalness: 0.76, roughness: 0.27 }),
  );
  const screwMat = material(
    new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.88, roughness: 0.14 }),
  );
  const plungerMat = material(
    new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.6, roughness: 0.25 }),
  );
  const counterMat = material(
    new THREE.MeshStandardMaterial({ color: 0xc084fc, metalness: 0.48, roughness: 0.32 }),
  );
  const reliefMat = material(
    new THREE.MeshStandardMaterial({
      color: 0xfb7185,
      metalness: 0.35,
      roughness: 0.38,
      transparent: true,
      opacity: 0.8,
    }),
  );
  const body = new THREE.Mesh(geometry(new THREE.BoxGeometry(5.4, 1.2, 1.45)), housingMat);
  body.name = "case and longitudinal device housing";
  root.add(body);
  for (const x of [-1.7, 1.7]) {
    const support = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.22, 0.6, 1.0)), housingMat);
    support.name = "museum display support, not a patent part";
    support.position.set(x, -0.9, 0);
    root.add(support);
  }
  const motor = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.65, 0.65, 1.3, 28)),
    housingMat,
  );
  motor.name = "motor";
  motor.rotation.z = Math.PI / 2;
  motor.position.x = -2.2;
  root.add(motor);
  const screw = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.12, 0.12, 3.85, 26)),
    screwMat,
  );
  screw.name = "uniform-pitch lead screw";
  screw.rotation.z = Math.PI / 2;
  screw.position.x = 0.1;
  root.add(screw);
  const plunger = new THREE.Group();
  plunger.name = "follower and plunger";
  const follower = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.34, 0.84, 0.84)), plungerMat);
  plunger.add(follower);
  const rod = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.12, 0.12, 1.25, 20)),
    plungerMat,
  );
  rod.rotation.z = Math.PI / 2;
  rod.position.x = 0.74;
  plunger.add(rod);
  root.add(plunger);
  const counter = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.78, 0.72, 0.72)), counterMat);
  counter.name = "pulse counter and timing control";
  counter.position.set(1.82, 0.93, 0);
  root.add(counter);
  const striker = new THREE.Mesh(geometry(new THREE.SphereGeometry(0.18, 16, 12)), counterMat);
  striker.name = "radial striker and pulse-emitting switch";
  striker.position.set(1.38, 0.35, 0);
  root.add(striker);
  const relief = new THREE.Mesh(geometry(new THREE.TorusGeometry(0.62, 0.07, 10, 28)), reliefMat);
  relief.name = "illustrative clutch or relief arrangement";
  relief.rotation.x = Math.PI / 2;
  relief.position.set(0.65, -0.59, 0);
  root.add(relief);
  return {
    root,
    updatePose: (pose) => {
      plunger.position.x = -0.8 + pose.plungerPosition * 2.1;
      screw.rotation.x = pose.leadScrewTurnFraction * Math.PI * 4;
      striker.rotation.y = pose.pulseProgress * Math.PI * 6;
      counter.material = pose.motorCircuitClosed ? counterMat : housingMat;
      relief.visible = pose.reliefPathShown;
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
