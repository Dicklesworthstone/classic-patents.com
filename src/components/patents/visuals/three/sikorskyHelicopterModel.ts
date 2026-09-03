import * as THREE from "three";
import type {
  SikorskyHelicopterControls,
  SikorskyHelicopterMetrics,
  SikorskyHelicopterState,
} from "@/physics/sikorskyHelicopterKernel";

export interface SikorskyHelicopter3DModel {
  root: THREE.Group;
  updateState: (
    metrics: SikorskyHelicopterMetrics,
    controls: SikorskyHelicopterControls,
    state: SikorskyHelicopterState,
  ) => void;
  dispose: () => void;
}

/**
 * Maps unbounded SI altitude into the bounded museum-studio inspection volume.
 * The mapping is monotonic, finite-safe, and deliberately presentation-only.
 */
export function sikorskyStudioAltitude(altitudeMeters: number): number {
  const safeAltitude = Number.isFinite(altitudeMeters) ? Math.max(0, altitudeMeters) : 0;
  return Math.min(2.3, 0.1 + 2.2 * (1 - Math.exp(-safeAltitude / 6)));
}

export function buildSikorskyHelicopterModel(): SikorskyHelicopter3DModel {
  const root = new THREE.Group();
  root.name = "US 2,318,259 Sikorsky VS-300 Helicopter 3D Studio Model";

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

  // Museum-display materials. Colors are interpretive, not source attributes.
  const steelTruss = material(
    new THREE.MeshStandardMaterial({
      color: 0x85929e,
      roughness: 0.35,
      metalness: 0.7,
    }),
  );

  const engineDark = material(
    new THREE.MeshStandardMaterial({
      color: 0x2c3e50,
      roughness: 0.55,
      metalness: 0.6,
    }),
  );

  const bronzeBrass = material(
    new THREE.MeshStandardMaterial({
      color: 0xd4ac0d,
      roughness: 0.3,
      metalness: 0.8,
    }),
  );

  const fabricWing = material(
    new THREE.MeshStandardMaterial({
      color: 0xd8c39f,
      roughness: 0.7,
      metalness: 0.1,
      side: THREE.DoubleSide,
    }),
  );

  const yellowTip = material(
    new THREE.MeshStandardMaterial({
      color: 0xf1c40f,
      roughness: 0.4,
      metalness: 0.2,
    }),
  );

  const rubberTire = material(
    new THREE.MeshStandardMaterial({
      color: 0x17202a, // Pneumatic landing gear tire
      roughness: 0.85,
      metalness: 0.05,
    }),
  );

  const tailRotorBladeMat = material(
    new THREE.MeshStandardMaterial({
      color: 0x3498db, // Tail rotor blade
      roughness: 0.4,
      metalness: 0.3,
      side: THREE.DoubleSide,
    }),
  );

  const connectedStrut = (
    name: string,
    start: THREE.Vector3,
    end: THREE.Vector3,
    radius: number,
  ) => {
    const direction = end.clone().sub(start);
    const strut = new THREE.Mesh(
      geometry(new THREE.CylinderGeometry(radius, radius, direction.length(), 8)),
      steelTruss,
    );
    strut.name = name;
    strut.position.copy(start).add(end).multiplyScalar(0.5);
    strut.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
    return strut;
  };

  const setConnectedCylinder = (cylinder: THREE.Mesh, start: THREE.Vector3, end: THREE.Vector3) => {
    const direction = end.clone().sub(start);
    const length = direction.length();
    cylinder.position.copy(start).add(end).multiplyScalar(0.5);
    cylinder.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      length > 1e-9 ? direction.multiplyScalar(1 / length) : new THREE.Vector3(0, 1, 0),
    );
    cylinder.scale.set(1, length, 1);
  };

  // Airframe Group (translates/pitches with flight dynamics)
  const airframe = new THREE.Group();
  airframe.name = "HelicopterAirframe";
  root.add(airframe);

  // 1. Tubular Steel Truss Fuselage (VS-300 open frame)
  const fuselageGroup = new THREE.Group();
  airframe.add(fuselageGroup);

  // Longitudinal longerons
  const longeronGeo = geometry(new THREE.CylinderGeometry(0.02, 0.02, 2.4, 8));
  const bottomLongeronL = new THREE.Mesh(longeronGeo, steelTruss);
  bottomLongeronL.rotation.x = Math.PI / 2;
  bottomLongeronL.position.set(-0.35, 0.2, 0);
  fuselageGroup.add(bottomLongeronL);

  const bottomLongeronR = new THREE.Mesh(longeronGeo, steelTruss);
  bottomLongeronR.rotation.x = Math.PI / 2;
  bottomLongeronR.position.set(0.35, 0.2, 0);
  fuselageGroup.add(bottomLongeronR);

  const topLongeronL = new THREE.Mesh(longeronGeo, steelTruss);
  topLongeronL.rotation.x = Math.PI / 2;
  topLongeronL.position.set(-0.35, 0.9, 0);
  fuselageGroup.add(topLongeronL);

  const topLongeronR = new THREE.Mesh(longeronGeo, steelTruss);
  topLongeronR.rotation.x = Math.PI / 2;
  topLongeronR.position.set(0.35, 0.9, 0);
  fuselageGroup.add(topLongeronR);

  // Vertical and diagonal truss struts
  const strutGeo = geometry(new THREE.CylinderGeometry(0.018, 0.018, 0.7, 8));
  for (let z = -1.0; z <= 1.0; z += 0.5) {
    const vStrutL = new THREE.Mesh(strutGeo, steelTruss);
    vStrutL.position.set(-0.35, 0.55, z);
    fuselageGroup.add(vStrutL);

    const vStrutR = new THREE.Mesh(strutGeo, steelTruss);
    vStrutR.position.set(0.35, 0.55, z);
    fuselageGroup.add(vStrutR);

    const crossStrut = new THREE.Mesh(
      geometry(new THREE.CylinderGeometry(0.018, 0.018, 0.7, 8)),
      steelTruss,
    );
    crossStrut.rotation.z = Math.PI / 2;
    crossStrut.position.set(0, 0.2, z);
    fuselageGroup.add(crossStrut);
  }

  // Source-disclosed engine envelope; no make, output, or dimensions are inferred.
  const engineMesh = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.5, 0.45, 0.65)), engineDark);
  engineMesh.position.set(0, 0.5, -0.2);
  fuselageGroup.add(engineMesh);

  // Pilot Cockpit Seat & Controls
  const seatGroup = new THREE.Group();
  seatGroup.position.set(0, 0.35, 0.6);
  const seatBottom = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.4, 0.05, 0.4)), engineDark);
  const seatBack = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.4, 0.5, 0.05)), engineDark);
  seatBack.position.set(0, 0.25, -0.18);
  seatGroup.add(seatBottom, seatBack);
  fuselageGroup.add(seatGroup);

  // Cyclic Stick & Collective Lever
  const cyclicStick = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.012, 0.012, 0.4, 8)),
    bronzeBrass,
  );
  cyclicStick.position.set(0, 0.45, 0.75);
  fuselageGroup.add(cyclicStick);

  const collectiveLever = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.012, 0.012, 0.35, 8)),
    bronzeBrass,
  );
  collectiveLever.rotation.x = Math.PI / 4;
  collectiveLever.position.set(-0.25, 0.4, 0.6);
  fuselageGroup.add(collectiveLever);

  // Landing Gear
  const lgGroup = new THREE.Group();
  const wheelGeo = geometry(new THREE.CylinderGeometry(0.16, 0.16, 0.08, 16));
  wheelGeo.rotateZ(Math.PI / 2);

  const leftWheel = new THREE.Mesh(wheelGeo, rubberTire);
  leftWheel.name = "SikorskyLeftMainWheel";
  leftWheel.position.set(-0.7, -0.1, 0.4);
  const rightWheel = new THREE.Mesh(wheelGeo, rubberTire);
  rightWheel.name = "SikorskyRightMainWheel";
  rightWheel.position.set(0.7, -0.1, 0.4);
  const tailWheel = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.08, 0.08, 0.04, 12)).rotateZ(Math.PI / 2),
    rubberTire,
  );
  tailWheel.name = "SikorskyTailWheel";
  tailWheel.position.set(0, -0.1, -4.55);

  const mainAxle = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.025, 0.025, 1.4, 10)).rotateZ(Math.PI / 2),
    steelTruss,
  );
  mainAxle.name = "SikorskyMainAxle";
  mainAxle.position.set(0, -0.1, 0.4);
  const lgStrutL = connectedStrut(
    "SikorskyLeftLandingStrut",
    new THREE.Vector3(-0.35, 0.2, 0.4),
    leftWheel.position,
    0.02,
  );
  const lgStrutR = connectedStrut(
    "SikorskyRightLandingStrut",
    new THREE.Vector3(0.35, 0.2, 0.4),
    rightWheel.position,
    0.02,
  );
  const tailStrut = connectedStrut(
    "SikorskyTailWheelStrut",
    new THREE.Vector3(0, 0.65, -4.55),
    tailWheel.position,
    0.018,
  );

  lgGroup.add(leftWheel, rightWheel, tailWheel, mainAxle, lgStrutL, lgStrutR, tailStrut);
  fuselageGroup.add(lgGroup);

  // 2. Tail Boom & Anti-Torque Tail Rotor
  const tailBoomGroup = new THREE.Group();
  tailBoomGroup.position.set(0, 0.65, -1.2);
  fuselageGroup.add(tailBoomGroup);

  const tailBoomGeo = geometry(new THREE.CylinderGeometry(0.04, 0.025, 3.6, 12));
  tailBoomGeo.rotateX(Math.PI / 2);
  const tailBoomMesh = new THREE.Mesh(tailBoomGeo, steelTruss);
  tailBoomMesh.position.set(0, 0, -1.8);
  tailBoomGroup.add(tailBoomMesh);

  // Positive drive path runs continuously inside the tail boom to the auxiliary rotor gearbox.
  const tailDriveShaft = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.012, 0.012, 3.6, 8)).rotateX(Math.PI / 2),
    bronzeBrass,
  );
  tailDriveShaft.name = "SikorskyAuxiliaryRotorDriveShaft";
  tailDriveShaft.position.set(0, 0, -1.8);
  tailBoomGroup.add(tailDriveShaft);

  // Tail Vertical Pylon
  const tailPylon = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.025, 0.025, 0.6, 8)),
    steelTruss,
  );
  tailPylon.position.set(0, 0.25, -3.6);
  tailBoomGroup.add(tailPylon);

  // Tail Rotor Assembly
  const tailRotorHub = new THREE.Group();
  tailRotorHub.position.set(0.08, 0.48, -3.6);
  tailBoomGroup.add(tailRotorHub);

  // Tail Rotor Shaft (lateral horizontal)
  const tailShaft = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.015, 0.015, 0.1, 8)).rotateZ(Math.PI / 2),
    bronzeBrass,
  );
  tailRotorHub.add(tailShaft);

  // 2-Blade Tail Rotor
  const tailRotorBladeGroup = new THREE.Group();
  tailRotorHub.add(tailRotorBladeGroup);

  const tailBladeGeo = geometry(new THREE.BoxGeometry(0.01, 0.65, 0.06));
  const tailBlade1 = new THREE.Mesh(tailBladeGeo, tailRotorBladeMat);
  tailBlade1.position.set(0.04, 0.3, 0);
  const tailBlade2 = new THREE.Mesh(tailBladeGeo, tailRotorBladeMat);
  tailBlade2.position.set(0.04, -0.3, 0);
  tailRotorBladeGroup.add(tailBlade1, tailBlade2);

  // 3. Main Rotor Mast, Swashplate & 3-Blade Articulated Head
  const mainMastGroup = new THREE.Group();
  mainMastGroup.position.set(0, 0.9, 0);
  fuselageGroup.add(mainMastGroup);

  // Stationary Mast Tube
  const mastShaft = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.04, 0.04, 0.9, 12)),
    steelTruss,
  );
  mastShaft.position.set(0, 0.45, 0);
  mainMastGroup.add(mastShaft);

  // Swashplate Assembly (slides vertically & tilts on cyclic)
  const swashplateGroup = new THREE.Group();
  swashplateGroup.position.set(0, 0.55, 0);
  mainMastGroup.add(swashplateGroup);

  const swashplateRingGeo = geometry(new THREE.CylinderGeometry(0.18, 0.18, 0.04, 16));
  const swashplateMesh = new THREE.Mesh(swashplateRingGeo, bronzeBrass);
  swashplateMesh.name = "SikorskyStationaryPitchControlPlate168";
  swashplateGroup.add(swashplateMesh);

  // Patent plate 176 rotates with the rotor across thrust bearing 174 while
  // inheriting the collective/cyclic pose selected by stationary plate 168.
  const rotatingPitchPlate = new THREE.Group();
  rotatingPitchPlate.name = "SikorskyRotatingPitchControlPlate176";
  swashplateGroup.add(rotatingPitchPlate);
  const rotatingPitchRing = new THREE.Mesh(
    geometry(new THREE.TorusGeometry(0.15, 0.015, 8, 24)).rotateX(Math.PI / 2),
    bronzeBrass,
  );
  rotatingPitchRing.position.y = 0.045;
  rotatingPitchPlate.add(rotatingPitchRing);

  // Rotating Main Rotor Head (spins with rotor RPM)
  const mainRotorHead = new THREE.Group();
  mainRotorHead.position.set(0, 0.9, 0);
  mainMastGroup.add(mainRotorHead);

  const hubCasting = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.12, 0.12, 0.1, 12)),
    steelTruss,
  );
  mainRotorHead.add(hubCasting);

  // 3 Articulated Blade Assemblies (120 deg separation)
  const blades: THREE.Group[] = [];
  const lowerPitchAnchors: THREE.Object3D[] = [];
  const upperPitchAnchors: THREE.Object3D[] = [];
  const pitchLinks: THREE.Mesh[] = [];
  const pitchLinkGeometry = geometry(new THREE.CylinderGeometry(0.012, 0.012, 1, 8));
  const bladeRadius = 3.6; // Visual span scaled for 3D studio

  for (let i = 0; i < 3; i++) {
    const bladeAngle = (i * 2 * Math.PI) / 3;
    const bladeArmGroup = new THREE.Group();
    bladeArmGroup.rotation.y = bladeAngle;
    mainRotorHead.add(bladeArmGroup);

    // Flapping Hinge Pin
    const flapHinge = new THREE.Mesh(
      geometry(new THREE.CylinderGeometry(0.02, 0.02, 0.08, 8)).rotateZ(Math.PI / 2),
      bronzeBrass,
    );
    flapHinge.position.set(0.15, 0, 0);
    bladeArmGroup.add(flapHinge);

    // Blade Span Group (flaps vertically, feathers in pitch)
    const bladeSpanGroup = new THREE.Group();
    bladeSpanGroup.position.set(0.2, 0, 0);
    bladeArmGroup.add(bladeSpanGroup);
    blades.push(bladeSpanGroup);

    // Blade Airfoil (Fabric covered tapered wing)
    const bladeAirfoil = new THREE.Mesh(
      geometry(new THREE.BoxGeometry(bladeRadius, 0.02, 0.18)),
      fabricWing,
    );
    bladeAirfoil.position.set(bladeRadius / 2, 0, 0);
    bladeSpanGroup.add(bladeAirfoil);

    // Yellow Tip Marker
    const tipMarker = new THREE.Mesh(
      geometry(new THREE.BoxGeometry(0.35, 0.022, 0.182)),
      yellowTip,
    );
    tipMarker.position.set(bladeRadius - 0.175, 0, 0);
    bladeSpanGroup.add(tipMarker);

    // Pitch Horn & Link
    const pitchHorn = new THREE.Mesh(
      geometry(new THREE.CylinderGeometry(0.01, 0.01, 0.12, 8)),
      bronzeBrass,
    );
    pitchHorn.name = `SikorskyBladePitchHorn${i + 1}`;
    pitchHorn.position.set(0.1, -0.05, 0.08);
    bladeSpanGroup.add(pitchHorn);

    const upperAnchor = new THREE.Object3D();
    upperAnchor.name = `SikorskyBladePitchHornAnchor${i + 1}`;
    upperAnchor.position.set(0.1, -0.11, 0.08);
    bladeSpanGroup.add(upperAnchor);
    upperPitchAnchors.push(upperAnchor);

    const lowerAnchor = new THREE.Object3D();
    lowerAnchor.name = `SikorskyPitchPlateAnchor${i + 1}`;
    lowerAnchor.position.set(0.14 * Math.cos(bladeAngle), 0.045, -0.14 * Math.sin(bladeAngle));
    rotatingPitchPlate.add(lowerAnchor);
    lowerPitchAnchors.push(lowerAnchor);

    const pitchLink = new THREE.Mesh(pitchLinkGeometry, bronzeBrass);
    pitchLink.name = `SikorskyRigidPitchLink${i + 1}`;
    mainMastGroup.add(pitchLink);
    pitchLinks.push(pitchLink);
  }

  const startWorld = new THREE.Vector3();
  const endWorld = new THREE.Vector3();
  const updatePitchLinks = () => {
    root.updateMatrixWorld(true);
    for (let index = 0; index < pitchLinks.length; index++) {
      lowerPitchAnchors[index].getWorldPosition(startWorld);
      upperPitchAnchors[index].getWorldPosition(endWorld);
      const localStart = mainMastGroup.worldToLocal(startWorld.clone());
      const localEnd = mainMastGroup.worldToLocal(endWorld.clone());
      setConnectedCylinder(pitchLinks[index], localStart, localEnd);
    }
  };

  // 4. Update function (60 FPS tick)
  const updateState = (
    _metrics: SikorskyHelicopterMetrics,
    controls: SikorskyHelicopterControls,
    state: SikorskyHelicopterState,
  ) => {
    // Helicopter position & attitude
    // The studio is an inspection volume, not a world-scale chase camera.
    // Compress unbounded scenario altitude monotonically so a sustained climb
    // cannot carry the mechanism out of the exhibit while the numeric SI
    // readout retains the kernel's uncompressed altitude.
    const altY = sikorskyStudioAltitude(state.altitudeMeters);
    airframe.position.set(0, altY, 0);
    airframe.rotation.set(
      (state.pitchAngleDeg * Math.PI) / 180.0,
      (state.yawAngleDeg * Math.PI) / 180.0,
      (state.rollAngleDeg * Math.PI) / 180.0,
      "YXZ",
    );

    // Swashplate Tilt & Vertical Height
    const collHeight = 0.48 + (controls.collectivePitchDeg / 16.0) * 0.15;
    swashplateGroup.position.y = collHeight;
    swashplateGroup.rotation.x = (-controls.cyclicPitchForwardDeg * Math.PI) / 180.0;
    swashplateGroup.rotation.z = (controls.cyclicRollRightDeg * Math.PI) / 180.0;

    // Main Rotor Spin
    mainRotorHead.rotation.y = -state.rotorPhaseRad;
    rotatingPitchPlate.rotation.y = -state.rotorPhaseRad;

    // Cyclic Pitch feathering on individual blades
    const collRad = (controls.collectivePitchDeg * Math.PI) / 180.0;
    const cyclicPitchRad = (-controls.cyclicPitchForwardDeg * Math.PI) / 180.0;
    const cyclicRollRad = (controls.cyclicRollRightDeg * Math.PI) / 180.0;

    blades.forEach((bladeGroup, idx) => {
      const bladeAzimuth = -state.rotorPhaseRad + (idx * 2 * Math.PI) / 3;
      const featherAngle =
        collRad + cyclicPitchRad * Math.cos(bladeAzimuth) + cyclicRollRad * Math.sin(bladeAzimuth);
      bladeGroup.rotation.x = featherAngle;
      // Slight coning / flapping angle under thrust
      const coningAngle = 0.04 + (controls.collectivePitchDeg / 16.0) * 0.05;
      bladeGroup.rotation.z = coningAngle;
    });

    // Tail Rotor Spin & Rudder Pitch
    tailRotorBladeGroup.rotation.x = state.tailRotorPhaseRad;
    const tailPitchRad = (controls.tailRotorPedalPercent / 100.0) * 0.35;
    tailBlade1.rotation.y = tailPitchRad;
    tailBlade2.rotation.y = tailPitchRad;

    // Cockpit stick animations
    cyclicStick.rotation.x = (controls.cyclicPitchForwardDeg * Math.PI) / 180.0;
    cyclicStick.rotation.z = (-controls.cyclicRollRightDeg * Math.PI) / 180.0;
    collectiveLever.rotation.x = Math.PI / 4 - (controls.collectivePitchDeg / 16.0) * 0.35;

    // Reconnect every push-pull rod after plate tilt, plate rotation, blade
    // feathering, and head rotation. Both endpoints remain mechanically
    // coincident through the full control range.
    updatePitchLinks();
  };

  const dispose = () => {
    geometries.forEach((g) => {
      g.dispose();
    });
    materials.forEach((m) => {
      m.dispose();
    });
  };

  return { root, updateState, dispose };
}
