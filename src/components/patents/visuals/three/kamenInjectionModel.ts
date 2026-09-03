import * as THREE from "three";
import type { KamenInjectionTapeFrame } from "@/physics/kamenInjectionKernel";

export interface KamenInjectionModel {
  root: THREE.Group;
  updateFrame: (frame: KamenInjectionTapeFrame) => void;
  dispose: () => void;
}

function setShadows(object: THREE.Object3D): void {
  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
}

/** Connected procedural reconstruction of the source apparatus in Figs. 1–6. */
export function buildKamenInjectionModel(): KamenInjectionModel {
  const root = new THREE.Group();
  root.name = "US 3,858,581 connected source apparatus";
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
  const caseMat = material(
    new THREE.MeshStandardMaterial({ color: 0x34536b, metalness: 0.42, roughness: 0.48 }),
  );
  const edgeMat = material(
    new THREE.MeshStandardMaterial({ color: 0x172a3a, metalness: 0.55, roughness: 0.32 }),
  );
  const steelMat = material(
    new THREE.MeshStandardMaterial({ color: 0xd8e2e8, metalness: 0.9, roughness: 0.15 }),
  );
  const brassMat = material(
    new THREE.MeshStandardMaterial({ color: 0xb7791f, metalness: 0.7, roughness: 0.25 }),
  );
  const followerMat = material(
    new THREE.MeshStandardMaterial({ color: 0xe8872f, metalness: 0.5, roughness: 0.3 }),
  );
  const syringeMat = material(
    new THREE.MeshStandardMaterial({
      color: 0xbbe8f4,
      metalness: 0.05,
      roughness: 0.18,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
    }),
  );
  const fluidMat = material(
    new THREE.MeshStandardMaterial({
      color: 0x67e8f9,
      emissive: 0x0e7490,
      emissiveIntensity: 0.2,
      transparent: true,
      opacity: 0.55,
    }),
  );
  const wireMat = material(
    new THREE.MeshStandardMaterial({ color: 0x8b5cf6, metalness: 0.15, roughness: 0.42 }),
  );
  const circuitMat = material(
    new THREE.MeshStandardMaterial({ color: 0x155e4a, metalness: 0.18, roughness: 0.5 }),
  );
  const counterOffMat = material(
    new THREE.MeshStandardMaterial({ color: 0x30364a, metalness: 0.2, roughness: 0.5 }),
  );
  const counterOnMat = material(
    new THREE.MeshStandardMaterial({
      color: 0xe9d5ff,
      emissive: 0x7c3aed,
      emissiveIntensity: 1.5,
      metalness: 0.1,
      roughness: 0.25,
    }),
  );
  const signalMat = material(
    new THREE.MeshStandardMaterial({
      color: 0x5b1f16,
      emissive: 0x000000,
      emissiveIntensity: 0,
      roughness: 0.25,
    }),
  );
  const warningMat = material(
    new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.25, roughness: 0.4 }),
  );

  const box = (
    name: string,
    size: [number, number, number],
    position: [number, number, number],
    mat: THREE.Material,
  ) => {
    const mesh = new THREE.Mesh(geometry(new THREE.BoxGeometry(...size)), mat);
    mesh.name = name;
    mesh.position.set(...position);
    return mesh;
  };
  const cylinder = (
    name: string,
    radius: number,
    length: number,
    position: [number, number, number],
    mat: THREE.Material,
  ) => {
    const mesh = new THREE.Mesh(
      geometry(new THREE.CylinderGeometry(radius, radius, length, 28)),
      mat,
    );
    mesh.name = name;
    mesh.rotation.z = Math.PI / 2;
    mesh.position.set(...position);
    return mesh;
  };
  const tube = (name: string, points: THREE.Vector3[], radius: number, mat: THREE.Material) => {
    const curve = new THREE.CatmullRomCurve3(points);
    const mesh = new THREE.Mesh(
      geometry(new THREE.TubeGeometry(curve, Math.max(12, points.length * 8), radius, 8, false)),
      mat,
    );
    mesh.name = name;
    return mesh;
  };

  // Source case 32/34. The front and central top are omitted only as an
  // inspection cutaway; every internal part remains mounted to the case.
  const housing = new THREE.Group();
  housing.name = "case 32 34 with source-mounted apparatus";
  housing.add(
    box("case base 34", [7.8, 0.28, 3.35], [0, -1.02, 0], caseMat),
    box("case rear wall", [7.8, 1.45, 0.18], [0, -0.2, -1.58], caseMat),
    box("case left end wall", [0.18, 1.45, 3.35], [-3.81, -0.2, 0], caseMat),
    box("case right end wall", [0.18, 1.45, 3.35], [3.81, -0.2, 0], caseMat),
    box("top plate 32 rear strip", [7.8, 0.18, 0.82], [0, 0.51, -1.14], caseMat),
    box("top plate 32 front strip", [7.8, 0.18, 0.52], [0, 0.51, 1.42], caseMat),
  );
  root.add(housing);

  const motorMount = box(
    "stationary motor mounting member 44",
    [0.22, 1.0, 1.15],
    [-2.12, -0.3, 0],
    edgeMat,
  );
  root.add(motorMount);
  const motorBody = cylinder("powering motor 24", 0.55, 1.2, [-2.82, -0.28, 0], edgeMat);
  root.add(motorBody);
  const motorRotor = new THREE.Group();
  motorRotor.name = "motor 24 rotor and driving clutch half";
  motorRotor.position.set(-2.12, -0.28, 0);
  motorRotor.add(
    cylinder("motor output shaft", 0.105, 0.38, [-0.1, 0, 0], steelMat),
    cylinder("driving clutch half 136", 0.31, 0.16, [0.12, 0, 0], brassMat),
  );
  root.add(motorRotor);

  const screwAxisY = -0.28;
  const leadScrewAssembly = new THREE.Group();
  leadScrewAssembly.name = "lead screw 22 driven assembly with striker 80";
  leadScrewAssembly.position.set(0, screwAxisY, 0);
  const screwCore = cylinder(
    "uniform-pitch lead screw 22 core",
    0.11,
    3.05,
    [-0.38, 0, 0],
    steelMat,
  );
  leadScrewAssembly.add(screwCore);
  const helixPoints: THREE.Vector3[] = [];
  const threadTurns = 18;
  for (let index = 0; index <= 180; index += 1) {
    const u = index / 180;
    const angle = u * threadTurns * Math.PI * 2;
    helixPoints.push(
      new THREE.Vector3(-1.905 + u * 3.05, Math.cos(angle) * 0.14, Math.sin(angle) * 0.14),
    );
  }
  const screwThread = tube("uniform-pitch helical thread 26", helixPoints, 0.018, brassMat);
  leadScrewAssembly.add(screwThread);
  leadScrewAssembly.add(cylinder("driven clutch half 136", 0.31, 0.16, [-1.98, 0, 0], brassMat));

  const striker = new THREE.Group();
  striker.name = "radial striker 80 mounted on lead screw";
  striker.position.x = 1.18;
  striker.add(
    box("radial striker arm 80", [0.12, 0.46, 0.1], [0, 0.23, 0], brassMat),
    new THREE.Mesh(geometry(new THREE.SphereGeometry(0.1, 16, 12)), brassMat),
  );
  const strikerTip = striker.children[1] as THREE.Mesh;
  strikerTip.name = "striker 80 contact tip";
  strikerTip.position.y = 0.46;
  leadScrewAssembly.add(striker);
  root.add(leadScrewAssembly);

  // Follower 18 is simultaneously threaded on the screw and guided by body
  // element 40 through fixed member 44, so it can translate but cannot rotate.
  const followerGuide = cylinder(
    "anti-rotation follower guide bore 42",
    0.075,
    3.0,
    [-0.58, -0.66, 0.5],
    steelMat,
  );
  root.add(followerGuide);
  const followerAndPlunger = new THREE.Group();
  followerAndPlunger.name = "connected follower 18 and syringe plunger 14";
  followerAndPlunger.add(
    cylinder("threaded follower member 20", 0.25, 0.34, [0, screwAxisY, 0], followerMat),
    box("anti-rotation body element 40", [1.45, 0.14, 0.16], [-0.72, -0.66, 0.5], followerMat),
    box("upstanding follower rod 28", [0.16, 1.22, 0.16], [0, 0.27, 0.48], followerMat),
    box("pushing head 16", [0.18, 0.72, 0.72], [0, 0.92, 0.48], followerMat),
    cylinder("syringe plunger rod 14", 0.065, 1.38, [0.76, 0.96, 0.48], steelMat),
    cylinder("syringe piston 14", 0.245, 0.1, [1.47, 0.96, 0.48], followerMat),
  );
  root.add(followerAndPlunger);

  const syringe = new THREE.Group();
  syringe.name = "syringe 12 clamped to mounting plate 52";
  syringe.add(
    cylinder("transparent syringe barrel 12", 0.3, 2.55, [1.92, 0.96, 0.48], syringeMat),
    cylinder("source-bounded barrel contents display", 0.245, 1.02, [2.56, 0.96, 0.48], fluidMat),
    cylinder("syringe outlet", 0.1, 0.34, [3.36, 0.96, 0.48], syringeMat),
    box("syringe finger grip lip 48", [0.12, 0.82, 0.85], [0.61, 0.96, 0.48], steelMat),
    box("mounting plate 52 and holding recess 50", [2.45, 0.14, 1.08], [1.75, 0.57, 0.48], edgeMat),
  );
  const clamp = new THREE.Mesh(geometry(new THREE.TorusGeometry(0.39, 0.055, 10, 28)), steelMat);
  clamp.name = "L-shaped syringe clamp 54";
  clamp.rotation.y = Math.PI / 2;
  clamp.position.set(2.46, 0.96, 0.48);
  syringe.add(clamp);
  syringe.add(
    tube(
      "patient connection tubing 15",
      [
        new THREE.Vector3(3.52, 0.96, 0.48),
        new THREE.Vector3(3.83, 0.88, 0.63),
        new THREE.Vector3(3.95, 0.5, 0.92),
        new THREE.Vector3(3.62, 0.12, 1.18),
      ],
      0.045,
      syringeMat,
    ),
  );
  root.add(syringe);

  // Claim 1 switch/counter loop, mounted to the case and physically wired.
  const pulseLoop = new THREE.Group();
  pulseLoop.name = "Claim 1 striker switch and pulse counting loop";
  const switchBody = box(
    "pulse-emitting switch 84",
    [0.42, 0.32, 0.36],
    [1.18, 0.17, -0.24],
    edgeMat,
  );
  const switchArm = box("switch contact arm 82", [0.1, 0.3, 0.08], [1.18, 0.39, -0.02], brassMat);
  pulseLoop.add(switchBody, switchArm);
  const board = box(
    "printed circuit board 86",
    [2.05, 0.78, 0.12],
    [1.94, -0.34, -1.43],
    circuitMat,
  );
  pulseLoop.add(board);
  pulseLoop.add(
    tube(
      "switch 84 to counter 114 conductor",
      [
        new THREE.Vector3(1.18, 0.17, -0.24),
        new THREE.Vector3(1.38, -0.05, -0.74),
        new THREE.Vector3(1.52, -0.23, -1.36),
      ],
      0.025,
      wireMat,
    ),
    tube(
      "counter control 124 to motor-off switch 126 conductor",
      [
        new THREE.Vector3(2.55, -0.34, -1.36),
        new THREE.Vector3(0.1, -0.75, -1.36),
        new THREE.Vector3(-2.65, -0.48, -0.52),
      ],
      0.025,
      wireMat,
    ),
  );
  const counterLeds: THREE.Mesh[][] = [[], []];
  for (let counterIndex = 0; counterIndex < 2; counterIndex += 1) {
    const centerX = 1.54 + counterIndex * 0.82;
    for (let digit = 0; digit < 10; digit += 1) {
      const angle = (digit / 10) * Math.PI * 2 - Math.PI / 2;
      const led = new THREE.Mesh(geometry(new THREE.SphereGeometry(0.045, 10, 8)), counterOffMat);
      led.name = `${counterIndex === 0 ? "first" : "second"} pulse counter ${
        counterIndex === 0 ? 114 : 116
      } output ${digit}`;
      led.position.set(centerX + Math.cos(angle) * 0.25, -0.34 + Math.sin(angle) * 0.25, -1.34);
      pulseLoop.add(led);
      counterLeds[counterIndex]?.push(led);
    }
  }
  root.add(pulseLoop);

  // Exterior controls are attached to the top plate as in Figs. 1 and 2.
  const controlPanel = new THREE.Group();
  controlPanel.name = "source control panel 66 74 96 98 100";
  controlPanel.add(
    box("control panel mounting face", [2.35, 0.14, 0.68], [-1.55, 0.63, -1.05], edgeMat),
  );
  for (const [index, x] of [-2.18, -1.58, -0.78].entries()) {
    const knob = new THREE.Mesh(
      geometry(new THREE.CylinderGeometry(0.17, 0.2, 0.18, 20)),
      brassMat,
    );
    knob.name = index < 2 ? `motor-on selector ${index === 0 ? 68 : 70}` : "motor-off selector 76";
    knob.position.set(x, 0.76, -1.05);
    controlPanel.add(knob);
  }
  const indicator = new THREE.Mesh(geometry(new THREE.SphereGeometry(0.13, 18, 12)), signalMat);
  indicator.name = "pulse visual signal 100";
  indicator.position.set(-0.28, 0.78, -1.05);
  controlPanel.add(indicator);
  root.add(controlPanel);

  // Claim 3 spring and notch/pin clutch parts share the drive axis. Nothing is
  // drawn as a detached relief halo.
  const clutchSpringAssembly = new THREE.Group();
  clutchSpringAssembly.name = "axially compressible clutch spring assembly";
  clutchSpringAssembly.position.set(-2.03, screwAxisY, 0);
  clutchSpringAssembly.add(
    tube(
      "compression spring 138 in clutch 136",
      Array.from({ length: 45 }, (_, index) => {
        const u = index / 44;
        const angle = u * Math.PI * 8;
        return new THREE.Vector3(-0.14 + u * 0.28, Math.cos(angle) * 0.19, Math.sin(angle) * 0.19);
      }),
      0.018,
      warningMat,
    ),
  );
  root.add(clutchSpringAssembly);

  // Follower-correlated scale 62 and pointer 64/65 on top plate 32.
  const scale = new THREE.Group();
  scale.name = "linear displacement and pulse scale 62";
  for (let index = 0; index <= 9; index += 1) {
    scale.add(
      box(
        `scale 62 tick ${index * 10}`,
        [0.025, 0.05, 0.26],
        [-1.02 + index * 0.18, 0.64, 1.26],
        brassMat,
      ),
    );
  }
  root.add(scale);

  setShadows(root);

  return {
    root,
    updateFrame: (frame) => {
      const { metrics } = frame;
      followerAndPlunger.position.x = -1.02 + metrics.followerPositionNormalized * 1.62;
      leadScrewAssembly.rotation.x = metrics.leadScrewAngleRad;
      leadScrewAssembly.position.x = metrics.clutchAxialOffsetNormalized * 0.16;
      const springScale = metrics.clutchEngaged ? 1 : 0.55;
      clutchSpringAssembly.scale.x = springScale;
      // Keep the motor-side spring end fixed at x=-2.17 as the other end compresses.
      clutchSpringAssembly.position.x = -2.17 + (0.28 * springScale) / 2;
      motorRotor.rotation.x = metrics.motorRotorAngleRad;
      striker.visible = metrics.pulseLoopComplete;
      pulseLoop.visible = metrics.pulseLoopComplete;
      switchArm.material = metrics.strikerContactsSwitch ? counterOnMat : brassMat;
      signalMat.color.setHex(metrics.indicatorOn ? 0xfef08a : 0x5b1f16);
      signalMat.emissive.setHex(metrics.indicatorOn ? 0xf59e0b : 0x000000);
      signalMat.emissiveIntensity = metrics.indicatorOn ? 2.2 : 0;
      const digits = [metrics.firstCounterDigit, metrics.secondCounterDigit];
      for (let counterIndex = 0; counterIndex < counterLeds.length; counterIndex += 1) {
        for (let digit = 0; digit < 10; digit += 1) {
          const led = counterLeds[counterIndex]?.[digit];
          if (led) led.material = digits[counterIndex] === digit ? counterOnMat : counterOffMat;
        }
      }
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
