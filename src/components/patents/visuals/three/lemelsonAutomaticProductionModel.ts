import * as THREE from "three";
import type { LemelsonAutomaticProductionState } from "@/physics/lemelsonAutomaticProductionKernel";

export interface LemelsonAutomaticProductionModel {
  readonly root: THREE.Group;
  readonly update: (state: LemelsonAutomaticProductionState) => void;
  readonly dispose: () => void;
}

/**
 * Connected museum geometry based on Figs. 1–5 and 13: overhead guideway 21,
 * carriage 22, column 23, platform 35, Mx/Mz/My positioning members, portable
 * controller 47, coupling contacts 85/86/87, and adjacent machine stations.
 * The grant prints no dimensions; every length below is an explicitly
 * non-dimensional display proportion, not a reconstruction or SI geometry.
 */
export function buildLemelsonAutomaticProductionModel(): LemelsonAutomaticProductionModel {
  const root = new THREE.Group();
  root.name = "US 3,313,014 automatic production source-bounded topology";
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
  const darkSteel = material(
    new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7, roughness: 0.28 }),
  );
  const steel = material(
    new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.23 }),
  );
  const carrierInk = material(
    new THREE.MeshStandardMaterial({ color: 0x0f766e, metalness: 0.6, roughness: 0.3 }),
  );
  const controlInk = material(
    new THREE.MeshStandardMaterial({ color: 0x1d4ed8, metalness: 0.52, roughness: 0.27 }),
  );
  const platformInk = material(
    new THREE.MeshStandardMaterial({ color: 0x7c3aed, metalness: 0.56, roughness: 0.28 }),
  );
  const markerInk = material(
    new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0x78350f, emissiveIntensity: 0.3 }),
  );
  const activeInk = material(
    new THREE.MeshStandardMaterial({ color: 0x34d399, emissive: 0x064e3b, emissiveIntensity: 0.4 }),
  );
  const idleInk = material(
    new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.45, roughness: 0.42 }),
  );
  const warningInk = material(
    new THREE.MeshStandardMaterial({
      color: 0xfb7185,
      emissive: 0x881337,
      emissiveIntensity: 0.25,
    }),
  );

  const railGroup = new THREE.Group();
  railGroup.name = "Overhead trackway 21 and slide bars 28";
  const rail = new THREE.Mesh(geometry(new THREE.BoxGeometry(7.6, 0.16, 0.3)), steel);
  rail.position.set(0, 2.4, 0);
  railGroup.add(rail);
  [-0.28, 0.28].forEach((z) => {
    const bar = new THREE.Mesh(geometry(new THREE.BoxGeometry(7.6, 0.045, 0.035)), controlInk);
    bar.position.set(0, 2.12, z);
    railGroup.add(bar);
  });
  root.add(railGroup);

  const stationGroup = new THREE.Group();
  stationGroup.name = "Production tools MT with marker and station contacts";
  const stations = [-2.4, 0, 2.4].map((x, index) => {
    const station = new THREE.Group();
    station.name = `Work station ${index + 1}`;
    const plinth = new THREE.Mesh(geometry(new THREE.BoxGeometry(1.32, 0.46, 1.15)), darkSteel);
    plinth.position.set(x, 0.02, 1.2);
    station.add(plinth);
    const tool = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.68, 0.95, 0.64)), steel);
    tool.name = `Machine tool MT ${index + 1}`;
    tool.position.set(x, 0.72, 1.2);
    station.add(tool);
    const fixture = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.94, 0.12, 0.86)), idleInk);
    fixture.name = `Station work fixture ${index + 1}`;
    fixture.position.set(x, 0.42, 0.68);
    station.add(fixture);
    const marker = new THREE.Mesh(geometry(new THREE.SphereGeometry(0.095, 16, 12)), markerInk);
    marker.name = `Marker 61 / station sensing event ${index + 1}`;
    marker.position.set(x, 2.1, -0.18);
    station.add(marker);
    const contacts = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.42, 0.1, 0.14)), idleInk);
    contacts.name = `Fixed contacts 87 ${index + 1}`;
    contacts.position.set(x, 0.84, 0.54);
    station.add(contacts);
    const clamp = new THREE.Mesh(geometry(new THREE.BoxGeometry(1.02, 0.13, 0.13)), idleInk);
    clamp.name = `Power-operated carrier retaining means ${index + 1}`;
    clamp.position.set(x, 0.68, 0.43);
    station.add(clamp);
    stationGroup.add(station);
    return { tool, fixture, marker, contacts, clamp };
  });
  root.add(stationGroup);

  const carrier = new THREE.Group();
  carrier.name = "Carrier 22 with vertical column 23 and portable controller 47";
  const carriage = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.8, 0.36, 0.7)), carrierInk);
  carriage.name = "Overhead carriage 22 and Mx";
  carriage.position.y = 2.13;
  carrier.add(carriage);
  [-0.23, 0.23].forEach((z) => {
    const wheel = new THREE.Mesh(geometry(new THREE.CylinderGeometry(0.12, 0.12, 0.1, 16)), steel);
    wheel.rotation.x = Math.PI / 2;
    wheel.position.set(0, 2.35, z);
    carrier.add(wheel);
  });
  const column = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.16, 0.16, 1.72, 20)),
    carrierInk,
  );
  column.name = "Vertical column 23 and Mz guide";
  column.position.y = 1.25;
  carrier.add(column);
  const controller = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.52, 0.34, 0.4)), controlInk);
  controller.name = "Carrier-mounted cycle controller 47";
  controller.position.set(-0.35, 1.84, -0.1);
  carrier.add(controller);
  const lift = new THREE.Group();
  lift.name = "Mz lift collar 38 and platform 35";
  const collar = new THREE.Mesh(geometry(new THREE.CylinderGeometry(0.23, 0.23, 0.14, 20)), steel);
  lift.add(collar);
  const beam = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.22, 0.16, 1.48)), platformInk);
  beam.name = "Platform beam 35 and My rack reach";
  beam.position.z = 0.68;
  lift.add(beam);
  const reach = new THREE.Group();
  reach.name = "Work fixture, contacts 86, and retaining device";
  const workPlatform = new THREE.Mesh(
    geometry(new THREE.BoxGeometry(0.76, 0.16, 0.64)),
    platformInk,
  );
  workPlatform.position.z = 0.26;
  reach.add(workPlatform);
  const workPiece = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.45, 0.21, 0.34)), markerInk);
  workPiece.name = "Work-in-process W";
  workPiece.position.set(0, 0.18, 0.26);
  reach.add(workPiece);
  const movableContacts = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.42, 0.1, 0.12)), idleInk);
  movableContacts.name = "Carrier coupling contacts 86";
  movableContacts.position.set(0, 0.04, 0.62);
  reach.add(movableContacts);
  const lockingBar = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.8, 0.1, 0.1)), warningInk);
  lockingBar.name = "Carrier locking / retaining state";
  lockingBar.position.set(0, 0.18, 0.57);
  lockingBar.visible = false;
  reach.add(lockingBar);
  lift.add(reach);
  carrier.add(lift);
  root.add(carrier);

  const couplingGeometry = geometry(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0.7, 0.5),
      new THREE.Vector3(0, 0.84, 0.54),
    ]),
  );
  const couplingLine = new THREE.Line(couplingGeometry, activeInk);
  couplingLine.name = "Controller-to-station coupling path 85/86/87";
  couplingLine.visible = false;
  root.add(couplingLine);

  return {
    root,
    update: (state) => {
      const carrierX = (state.carrierAddressFraction - 0.5) * 6.3;
      const selectedStation = Math.max(
        0,
        Math.min(2, Math.round(state.carrierAddressFraction * 2)),
      );
      const stationX = [-2.4, 0, 2.4][selectedStation] ?? 0;
      carrier.position.x = carrierX;
      lift.position.y = 1.72 - state.liftFraction * 0.78;
      reach.position.z = state.reachFraction * 0.88;
      lockingBar.visible = state.carrierLocked;
      movableContacts.material = state.controllerCoupled ? activeInk : idleInk;
      couplingLine.visible = state.controllerCoupled;
      workPiece.material = state.machineCommandAuthorized ? activeInk : markerInk;
      controller.material = state.markerMatched ? controlInk : idleInk;

      stations.forEach((station, index) => {
        const selected = index === selectedStation;
        station.marker.material = selected && state.markerMatched ? markerInk : idleInk;
        station.clamp.material = selected && state.carrierLocked ? activeInk : idleInk;
        station.contacts.material = selected && state.controllerCoupled ? activeInk : idleInk;
        station.fixture.material = selected && state.machineCommandAuthorized ? activeInk : idleInk;
        station.tool.material = selected && state.machineCommandAuthorized ? activeInk : steel;
      });

      const positions = couplingGeometry.getAttribute("position") as THREE.BufferAttribute;
      positions.setXYZ(0, carrierX, lift.position.y + 0.04, reach.position.z + 0.62);
      positions.setXYZ(1, stationX, 0.84, 0.54);
      positions.needsUpdate = true;
    },
    dispose: () => {
      for (const item of new Set(geometries)) item.dispose();
      for (const item of new Set(materials)) item.dispose();
    },
  };
}
