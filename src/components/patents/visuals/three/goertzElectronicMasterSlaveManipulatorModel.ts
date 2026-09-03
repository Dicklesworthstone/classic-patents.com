import * as THREE from "three";
import type { GoertzMasterSlavePose } from "@/physics/goertzElectronicMasterSlaveManipulatorKernel";

export interface GoertzElectronicMasterSlaveManipulatorModel {
  root: THREE.Group;
  updatePose: (pose: GoertzMasterSlavePose) => void;
  dispose: () => void;
}

interface CableRoute {
  line: THREE.Line;
  geometry: THREE.BufferGeometry;
  startAnchor: THREE.Object3D;
  sourceNumber: string;
  lateralOffset: number;
  endsAtWrist: boolean;
}

interface ArmAssembly {
  unit: THREE.Group;
  shoulderPivot: THREE.Group;
  horizontalRoll: THREE.Group;
  elbowPivot: THREE.Group;
  verticalRoll: THREE.Group;
  wrist171: THREE.Group;
  wrist172: THREE.Group;
  handleTrigger: THREE.Mesh | null;
  jawA: THREE.Mesh | null;
  jawB: THREE.Mesh | null;
  contactSpecimen: THREE.Mesh | null;
  cableRoutes: CableRoute[];
}

const CABLE_NUMBERS = ["160", "161", "162", "163", "164", "175", "176"] as const;

function updateCableGeometry(geometry: THREE.BufferGeometry, points: readonly THREE.Vector3[]) {
  const position = geometry.getAttribute("position");
  if (!(position instanceof THREE.BufferAttribute) || position.count !== points.length) {
    throw new Error("Goertz cable topology changed after its fixed buffer was allocated.");
  }
  points.forEach((point, index) => {
    position.setXYZ(index, point.x, point.y, point.z);
  });
  position.needsUpdate = true;
  geometry.computeBoundingSphere();
}

/**
 * Source-shaped procedural reconstruction of the identical master and slave
 * units in US 2,846,084, Figures 1–9. Display dimensions are normalized because
 * the grant supplies topology but no calibrated arm dimensions.
 */
export function buildGoertzElectronicMasterSlaveManipulatorModel(): GoertzElectronicMasterSlaveManipulatorModel {
  const root = new THREE.Group();
  root.name = "US 2,846,084 source-shaped bilateral master-slave manipulator exhibit";

  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const rememberGeometry = <T extends THREE.BufferGeometry>(value: T): T => {
    geometries.add(value);
    return value;
  };
  const rememberMaterial = <T extends THREE.Material>(value: T): T => {
    materials.add(value);
    return value;
  };
  const mesh = (
    parent: THREE.Object3D,
    meshGeometry: THREE.BufferGeometry,
    meshMaterial: THREE.Material,
    name: string,
    position: readonly [number, number, number],
    rotation: readonly [number, number, number] = [0, 0, 0],
  ): THREE.Mesh => {
    const part = new THREE.Mesh(meshGeometry, meshMaterial);
    part.name = name;
    part.position.set(...position);
    part.rotation.set(...rotation);
    parent.add(part);
    return part;
  };

  const structural = rememberMaterial(
    new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.76, roughness: 0.3 }),
  );
  const darkSteel = rememberMaterial(
    new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.72, roughness: 0.34 }),
  );
  const masterMaterial = rememberMaterial(
    new THREE.MeshStandardMaterial({
      color: 0x0891b2,
      emissive: 0x083344,
      emissiveIntensity: 0.16,
      metalness: 0.56,
      roughness: 0.27,
    }),
  );
  const slaveMaterial = rememberMaterial(
    new THREE.MeshStandardMaterial({
      color: 0x7c3aed,
      emissive: 0x2e1065,
      emissiveIntensity: 0.16,
      metalness: 0.56,
      roughness: 0.27,
    }),
  );
  const toolMaterial = rememberMaterial(
    new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0x78350f,
      emissiveIntensity: 0.18,
      metalness: 0.58,
      roughness: 0.25,
    }),
  );
  const electricalHousingMaterial = rememberMaterial(
    new THREE.MeshStandardMaterial({ color: 0x172554, metalness: 0.46, roughness: 0.38 }),
  );
  const wallMaterial = rememberMaterial(
    new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.12, roughness: 0.72 }),
  );
  const floorMaterial = rememberMaterial(
    new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.2, roughness: 0.78 }),
  );
  const glassMaterial = rememberMaterial(
    new THREE.MeshPhysicalMaterial({
      color: 0xbae6fd,
      roughness: 0.12,
      transmission: 0.42,
      transparent: true,
      opacity: 0.62,
      depthWrite: false,
    }),
  );
  const contactMaterial = rememberMaterial(
    new THREE.MeshStandardMaterial({
      color: 0xfda4af,
      emissive: 0x9f1239,
      emissiveIntensity: 0.45,
      metalness: 0.06,
      roughness: 0.2,
      transparent: true,
      opacity: 0.85,
    }),
  );
  const reflectedMaterial = rememberMaterial(
    new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0xb45309,
      emissiveIntensity: 0.6,
      roughness: 0.24,
      transparent: true,
      opacity: 0.9,
    }),
  );

  const floorGeometry = rememberGeometry(new THREE.BoxGeometry(8.2, 0.16, 5.2));
  const wallGeometry = rememberGeometry(new THREE.BoxGeometry(3.7, 4.05, 0.18));
  const floor = mesh(
    root,
    floorGeometry,
    floorMaterial,
    "hot-cell exhibit foundation",
    [0, -2.12, 0],
  );
  floor.receiveShadow = true;
  const masterWall = mesh(
    root,
    wallGeometry,
    wallMaterial,
    "master structural wall",
    [-2.08, -0.04, -1.72],
  );
  const slaveWall = mesh(
    root,
    wallGeometry,
    wallMaterial,
    "slave sealed-cell structural wall",
    [2.08, -0.04, -1.72],
  );
  masterWall.receiveShadow = true;
  slaveWall.receiveShadow = true;

  const divider = mesh(
    root,
    rememberGeometry(new THREE.BoxGeometry(0.07, 4.08, 3.85)),
    glassMaterial,
    "sealed-cell separation plane",
    [0, -0.04, 0.1],
  );
  divider.renderOrder = 1;

  const cableTray = mesh(
    root,
    rememberGeometry(new THREE.BoxGeometry(3.36, 1.12, 0.13)),
    electricalHousingMaterial,
    "seven-channel electrical cable tray bonded to wall",
    [0, -0.8, -1.54],
  );
  cableTray.receiveShadow = true;

  const signalMaterials: THREE.LineBasicMaterial[] = [];
  const signalLines: THREE.Line[] = [];
  for (let channel = 0; channel < 7; channel += 1) {
    const y = -1.22 + channel * 0.14;
    const signalGeometry = rememberGeometry(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-1.55, y, -1.44),
        new THREE.Vector3(-0.42, y, -1.44),
        new THREE.Vector3(0.42, y, -1.44),
        new THREE.Vector3(1.55, y, -1.44),
      ]),
    );
    const signalMaterial = rememberMaterial(
      new THREE.LineBasicMaterial({
        color: channel === 6 ? 0xf59e0b : 0x22d3ee,
        transparent: true,
        opacity: 0.72,
      }),
    );
    signalMaterials.push(signalMaterial);
    const signalLine = new THREE.Line(signalGeometry, signalMaterial);
    signalLine.name = `electrical correspondence channel ${channel + 1}`;
    signalLines.push(signalLine);
    root.add(signalLine);
  }

  const sourceCableMaterial = rememberMaterial(
    new THREE.LineBasicMaterial({ color: 0xe2e8f0, transparent: true, opacity: 0.78 }),
  );
  const horizontalArmGeometry = rememberGeometry(new THREE.CylinderGeometry(0.17, 0.19, 2.2, 22));
  const outerVerticalGeometry = rememberGeometry(new THREE.CylinderGeometry(0.18, 0.2, 0.92, 22));
  const innerVerticalGeometry = rememberGeometry(new THREE.CylinderGeometry(0.115, 0.13, 1.55, 20));
  const jointGeometry = rememberGeometry(new THREE.SphereGeometry(0.23, 22, 16));
  const cableRoutes: CableRoute[] = [];

  const createUnit = (
    x: number,
    name: "master" | "slave",
    armMaterial: THREE.MeshStandardMaterial,
  ): ArmAssembly => {
    const unit = new THREE.Group();
    unit.name = `${name} unit`;
    unit.position.x = x;
    root.add(unit);

    mesh(
      unit,
      rememberGeometry(new THREE.BoxGeometry(1.42, 0.28, 0.36)),
      structural,
      `${name} support 50 wall anchor`,
      [0, 1.78, -1.5],
    );
    mesh(
      unit,
      rememberGeometry(new THREE.BoxGeometry(1.35, 0.32, 0.58)),
      structural,
      `${name} upper hollow support portion 61`,
      [0, 1.52, -1.31],
    );
    mesh(
      unit,
      rememberGeometry(new THREE.BoxGeometry(0.18, 1.05, 0.3)),
      structural,
      `${name} support leg 62`,
      [-0.52, 0.92, -1.18],
    );
    mesh(
      unit,
      rememberGeometry(new THREE.BoxGeometry(0.18, 1.05, 0.3)),
      structural,
      `${name} support leg 63`,
      [0.52, 0.92, -1.18],
    );

    const controllerHousing = mesh(
      unit,
      rememberGeometry(new THREE.BoxGeometry(1.25, 1.3, 0.34)),
      electricalHousingMaterial,
      `${name} seven-servo electrical housing`,
      [0, -0.88, -1.45],
    );
    controllerHousing.castShadow = true;

    const motorAnchors: THREE.Object3D[] = [];
    const assemblyPositions: readonly (readonly [number, number, number])[] = [
      [-0.72, 1.31, -1.05],
      [-0.72, 0.96, -1.05],
      [-0.72, 0.61, -1.05],
      [0.72, 0.61, -1.05],
      [0.72, 0.96, -1.05],
      [0.72, 1.31, -1.05],
      [0, 1.75, -1.02],
    ];
    assemblyPositions.forEach((position, index) => {
      const assemblyNumber = 54 + index;
      const assembly = mesh(
        unit,
        rememberGeometry(new THREE.BoxGeometry(0.38, 0.27, 0.46)),
        electricalHousingMaterial,
        `${name} force-transmitting and receiving assembly ${assemblyNumber}`,
        position,
      );
      motorAnchors.push(assembly);
    });

    const shoulderPivot = new THREE.Group();
    shoulderPivot.name = `${name} transverse pivot group axis 113b`;
    shoulderPivot.position.set(0, 0.86, -1.03);
    unit.add(shoulderPivot);
    mesh(
      shoulderPivot,
      rememberGeometry(new THREE.CylinderGeometry(0.11, 0.11, 1.24, 18)),
      darkSteel,
      `${name} carriage 66 cross shaft axis 113b`,
      [0, 0, 0],
      [0, 0, Math.PI / 2],
    );
    mesh(
      shoulderPivot,
      rememberGeometry(new THREE.BoxGeometry(0.76, 0.44, 0.48)),
      armMaterial,
      `${name} carriage 66`,
      [0, 0, 0.08],
    );

    const counterweight = mesh(
      shoulderPivot,
      rememberGeometry(new THREE.TorusGeometry(0.55, 0.1, 10, 28, Math.PI)),
      structural,
      `${name} carriage counterweight 115`,
      [0, 0.49, 0.15],
    );
    counterweight.rotation.z = Math.PI;

    const horizontalRoll = new THREE.Group();
    horizontalRoll.name = `${name} horizontal-arm longitudinal roll group`;
    horizontalRoll.position.z = 0.18;
    shoulderPivot.add(horizontalRoll);
    mesh(
      horizontalRoll,
      horizontalArmGeometry,
      armMaterial,
      `${name} generally horizontal first arm 51`,
      [0, 0, 1.1],
      [Math.PI / 2, 0, 0],
    );
    mesh(
      horizontalRoll,
      rememberGeometry(new THREE.CylinderGeometry(0.035, 0.035, 2.08, 12)),
      structural,
      `${name} counterweight rod 117`,
      [0.32, 0.34, 1.05],
      [Math.PI / 2, 0, 0],
    );
    for (const z of [0.55, 1.55]) {
      mesh(
        horizontalRoll,
        rememberGeometry(new THREE.CylinderGeometry(0.025, 0.025, 0.34, 10)),
        structural,
        `${name} counterweight rod leg 125 at ${z.toFixed(2)}`,
        [0.32, 0.17, z],
      );
    }

    const elbowPivot = new THREE.Group();
    elbowPivot.name = `${name} second-arm transverse pivot group axis 126`;
    elbowPivot.position.z = 2.2;
    horizontalRoll.add(elbowPivot);
    mesh(
      elbowPivot,
      rememberGeometry(new THREE.CylinderGeometry(0.095, 0.095, 0.68, 18)),
      darkSteel,
      `${name} stub shafts 127 axis 126`,
      [0, 0, 0],
      [0, 0, Math.PI / 2],
    );
    mesh(elbowPivot, jointGeometry, armMaterial, `${name} arm 51 to arm 52 joint`, [0, 0, 0]);
    mesh(
      elbowPivot,
      outerVerticalGeometry,
      armMaterial,
      `${name} nonrotatable outer section 130 of arm 52`,
      [0, -0.46, 0],
    );

    const verticalRoll = new THREE.Group();
    verticalRoll.name = `${name} vertical-arm longitudinal roll group`;
    elbowPivot.add(verticalRoll);
    mesh(
      verticalRoll,
      innerVerticalGeometry,
      armMaterial,
      `${name} rotatable inner tube 146 of generally vertical second arm 52`,
      [0, -1.03, 0],
    );
    mesh(
      verticalRoll,
      rememberGeometry(new THREE.CylinderGeometry(0.19, 0.19, 0.16, 18)),
      darkSteel,
      `${name} arm 52 lower bearing collar`,
      [0, -1.72, 0],
    );

    const wrist171 = new THREE.Group();
    wrist171.name = `${name} tool transverse pivot group axis 171`;
    wrist171.position.y = -1.76;
    verticalRoll.add(wrist171);
    mesh(wrist171, jointGeometry, toolMaterial, `${name} tool joint axis 171`, [0, 0, 0]);

    const wrist172 = new THREE.Group();
    wrist172.name = `${name} tool transverse pivot group axis 172`;
    wrist171.add(wrist172);
    mesh(
      wrist172,
      rememberGeometry(new THREE.BoxGeometry(0.25, 0.42, 0.24)),
      toolMaterial,
      `${name} tool 53 carrier housing`,
      [0, -0.19, 0],
    );

    let handleTrigger: THREE.Mesh | null = null;
    let jawA: THREE.Mesh | null = null;
    let jawB: THREE.Mesh | null = null;
    let contactSpecimen: THREE.Mesh | null = null;
    if (name === "master") {
      mesh(
        wrist172,
        rememberGeometry(new THREE.CylinderGeometry(0.065, 0.065, 0.52, 16)),
        toolMaterial,
        "master tool 53 fixed hand grip",
        [0, -0.4, 0],
        [0, 0, Math.PI / 2],
      );
      mesh(
        wrist172,
        rememberGeometry(new THREE.BoxGeometry(0.1, 0.28, 0.1)),
        toolMaterial,
        "master handle hinge connecting grip and trigger",
        [-0.21, -0.3, 0],
        [0, 0, -0.25],
      );
      handleTrigger = mesh(
        wrist172,
        rememberGeometry(new THREE.CylinderGeometry(0.052, 0.052, 0.44, 14)),
        toolMaterial,
        "master tool 53 movable closing handle",
        [0, -0.58, 0],
        [0, 0, Math.PI / 2],
      );
    } else {
      mesh(
        wrist172,
        rememberGeometry(new THREE.BoxGeometry(0.5, 0.14, 0.23)),
        toolMaterial,
        "slave grasper 53 jaw carrier",
        [0, -0.37, 0],
      );
      const jawGeometry = rememberGeometry(new THREE.BoxGeometry(0.11, 0.5, 0.16));
      jawA = mesh(
        wrist172,
        jawGeometry,
        toolMaterial,
        "slave grasper 53 jaw A",
        [-0.17, -0.58, 0],
        [0, 0, -0.13],
      );
      jawB = mesh(
        wrist172,
        jawGeometry,
        toolMaterial,
        "slave grasper 53 jaw B",
        [0.17, -0.58, 0],
        [0, 0, 0.13],
      );
      contactSpecimen = mesh(
        wrist172,
        rememberGeometry(new THREE.CylinderGeometry(0.11, 0.11, 0.3, 20)),
        contactMaterial,
        "fragile glass specimen held by slave grasper",
        [0, -0.67, 0],
      );
      contactSpecimen.visible = false;
    }

    const unitRoutes: CableRoute[] = [];
    CABLE_NUMBERS.forEach((sourceNumber, index) => {
      const cableGeometry = rememberGeometry(new THREE.BufferGeometry());
      cableGeometry.setAttribute("position", new THREE.Float32BufferAttribute(15, 3));
      const line = new THREE.Line(cableGeometry, sourceCableMaterial);
      line.name = `${name} source cable ${sourceNumber} routed through arms`;
      root.add(line);
      const route: CableRoute = {
        line,
        geometry: cableGeometry,
        startAnchor: motorAnchors[index] as THREE.Object3D,
        sourceNumber,
        lateralOffset: (index - 3) * 0.025,
        endsAtWrist: index < 5,
      };
      unitRoutes.push(route);
      cableRoutes.push(route);
    });

    return {
      unit,
      shoulderPivot,
      horizontalRoll,
      elbowPivot,
      verticalRoll,
      wrist171,
      wrist172,
      handleTrigger,
      jawA,
      jawB,
      contactSpecimen,
      cableRoutes: unitRoutes,
    };
  };

  const master = createUnit(-2.08, "master", masterMaterial);
  const slave = createUnit(2.08, "slave", slaveMaterial);

  const reflectionCue = new THREE.Group();
  reflectionCue.name = "Claim 9 reflected-resistance cue attached to master handle";
  reflectionCue.position.set(0.23, -0.4, 0);
  master.wrist172.add(reflectionCue);
  mesh(
    reflectionCue,
    rememberGeometry(new THREE.CylinderGeometry(0.032, 0.032, 0.5, 12)),
    reflectedMaterial,
    "reflected-resistance cue shaft",
    [0.25, 0, 0],
    [0, 0, -Math.PI / 2],
  );
  mesh(
    reflectionCue,
    rememberGeometry(new THREE.ConeGeometry(0.1, 0.22, 16)),
    reflectedMaterial,
    "reflected-resistance cue head",
    [0.61, 0, 0],
    [0, 0, -Math.PI / 2],
  );
  reflectionCue.visible = false;

  const routePoint = (localPoint: THREE.Vector3, owner: THREE.Object3D): THREE.Vector3 => {
    const worldPoint = owner.localToWorld(localPoint.clone());
    return root.worldToLocal(worldPoint);
  };

  const updateArm = (assembly: ArmAssembly, channels: readonly number[]) => {
    assembly.shoulderPivot.rotation.x = (channels[0] ?? 0) * 0.48;
    assembly.horizontalRoll.rotation.z = (channels[1] ?? 0) * 0.62;
    assembly.elbowPivot.rotation.x = (channels[2] ?? 0) * 0.62;
    assembly.verticalRoll.rotation.y = (channels[3] ?? 0) * 1.35;
    assembly.wrist171.rotation.z = (channels[4] ?? 0) * 0.78;
    assembly.wrist172.rotation.x = (channels[5] ?? 0) * 0.78;

    const closure = THREE.MathUtils.clamp(channels[6] ?? 0, 0, 1);
    if (assembly.handleTrigger) {
      assembly.handleTrigger.rotation.z = Math.PI / 2 - closure * 0.36;
      assembly.handleTrigger.position.y = -0.58 + closure * 0.05;
    }
    if (assembly.jawA && assembly.jawB) {
      const jawCenter = 0.22 - closure * 0.08;
      assembly.jawA.position.x = -jawCenter;
      assembly.jawB.position.x = jawCenter;
      assembly.jawA.rotation.z = -0.13 - closure * 0.08;
      assembly.jawB.rotation.z = 0.13 + closure * 0.08;
    }
  };

  const updateRoutes = (assembly: ArmAssembly) => {
    assembly.cableRoutes.forEach((route) => {
      const offset = route.lateralOffset;
      const start = routePoint(new THREE.Vector3(), route.startAnchor);
      const carriageGuide = routePoint(
        new THREE.Vector3(offset, -0.05, 0.18),
        assembly.shoulderPivot,
      );
      const boomGuide = routePoint(new THREE.Vector3(offset, -0.12, 1.28), assembly.horizontalRoll);
      const elbowGuide = routePoint(new THREE.Vector3(offset, -0.08, 0), assembly.elbowPivot);
      const end = route.endsAtWrist
        ? routePoint(new THREE.Vector3(offset, -0.26, 0), assembly.wrist172)
        : routePoint(new THREE.Vector3(offset, -0.88, 0), assembly.verticalRoll);
      updateCableGeometry(route.geometry, [start, carriageGuide, boomGuide, elbowGuide, end]);
    });
  };

  root.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });
  divider.castShadow = false;
  divider.receiveShadow = false;

  return {
    root,
    updatePose: (pose) => {
      updateArm(master, pose.masterChannels);
      updateArm(slave, pose.slaveChannels);
      root.updateMatrixWorld(true);
      updateRoutes(master);
      updateRoutes(slave);

      reflectionCue.visible = pose.reflectedResistance > 0.005;
      reflectionCue.scale.setScalar(0.78 + pose.reflectedResistance * 0.52);
      reflectedMaterial.opacity = 0.55 + pose.reflectedResistance * 0.4;
      if (slave.contactSpecimen) {
        slave.contactSpecimen.visible = pose.mismatchChannel === "tool opening/closing";
        slave.contactSpecimen.scale.y = 0.86 + pose.errorMagnitude * 0.28;
      }

      signalMaterials.forEach((signalMaterial, index) => {
        const error = Math.abs(pose.positionErrors[index] ?? 0);
        signalMaterial.color.setHex(error > 0.005 ? 0xfbbf24 : index === 6 ? 0x38bdf8 : 0x22d3ee);
        signalMaterial.opacity = error > 0.005 ? 1 : 0.62;
      });
      signalLines.forEach((line) => {
        line.visible = true;
      });
    },
    dispose: () => {
      geometries.forEach((item) => {
        item.dispose();
      });
      materials.forEach((item) => {
        item.dispose();
      });
    },
  };
}
