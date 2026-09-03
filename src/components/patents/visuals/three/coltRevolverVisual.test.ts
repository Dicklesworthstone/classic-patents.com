import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import { stepColtRevolver } from "@/physics/catalogKernels";
import { coltRevolverCameraForViewport } from "./coltRevolverCamera";
import {
  buildColtRevolverModel,
  COLT_HISTORICAL_FINISHES,
  updateColtRevolverKinematics,
} from "./coltRevolverModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

function projectedColtBounds(viewportWidth: number, viewportHeight: number) {
  const model = buildColtRevolverModel();
  try {
    const bounds = new THREE.Box3().setFromObject(model.group);
    const cameraConfig = coltRevolverCameraForViewport("iso", viewportWidth, viewportHeight);
    const camera = new THREE.PerspectiveCamera(38, viewportWidth / viewportHeight, 0.1, 1000);
    camera.position.set(...cameraConfig.pos);
    camera.lookAt(...cameraConfig.target);
    camera.updateMatrixWorld();

    const projected = [bounds.min.x, bounds.max.x].flatMap((x) =>
      [bounds.min.y, bounds.max.y].flatMap((y) =>
        [bounds.min.z, bounds.max.z].map((z) => new THREE.Vector3(x, y, z).project(camera)),
      ),
    );
    const coordinate = (axis: "x" | "y") => projected.map((point) => point[axis]);
    const xs = coordinate("x");
    const ys = coordinate("y");
    return {
      minX: Math.min(...xs),
      maxX: Math.max(...xs),
      minY: Math.min(...ys),
      maxY: Math.max(...ys),
      cameraConfig,
    };
  } finally {
    model.dispose();
  }
}

function projectedColtMeshBounds(viewportWidth: number, viewportHeight: number) {
  const model = buildColtRevolverModel();
  try {
    const cameraConfig = coltRevolverCameraForViewport("iso", viewportWidth, viewportHeight);
    const camera = new THREE.PerspectiveCamera(38, viewportWidth / viewportHeight, 0.1, 1000);
    camera.position.set(...cameraConfig.pos);
    camera.lookAt(...cameraConfig.target);
    camera.updateProjectionMatrix();
    model.group.updateMatrixWorld(true);
    camera.updateMatrixWorld();

    let minX = Number.POSITIVE_INFINITY;
    let maxX = Number.NEGATIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;
    model.group.traverse((part) => {
      if (!(part instanceof THREE.Mesh)) return;
      const positions = part.geometry.getAttribute("position");
      for (let index = 0; index < positions.count; index++) {
        const projected = new THREE.Vector3()
          .fromBufferAttribute(positions, index)
          .applyMatrix4(part.matrixWorld)
          .project(camera);
        minX = Math.min(minX, projected.x);
        maxX = Math.max(maxX, projected.x);
        minY = Math.min(minY, projected.y);
        maxY = Math.max(maxY, projected.y);
      }
    });
    return { minX, maxX, minY, maxY, cameraConfig };
  } finally {
    model.dispose();
  }
}

describe("US X9430 Colt Paterson Revolver visual & physics boundary", () => {
  test("uses pure procedural WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "ColtRevolver3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "coltRevolverModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildColtRevolverModel");
    expect(modelSource).toContain("updateColtRevolverKinematics");
    expect(modelSource).toContain("dispose");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "ColtRevolver3D.tsx"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
    }
  });

  test("limits control-deck animation to the properties that actually change", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "ColtRevolver3D.tsx"),
      "utf8",
    );

    expect(threeSource).not.toContain("transition-all");
    expect(threeSource).toContain("transition-colors");
    expect(threeSource).toContain("transition-[background-color,transform]");
    expect(threeSource).toContain("transition-[background-color,color,border-color,transform]");
  });

  test("keeps mobile action controls and focused descendants clear of the site sticky header", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "ColtRevolver3D.tsx"),
      "utf8",
    );

    // The 3D card must not become the sticky element's scroll container. On a
    // phone, the action row remains available below the global header while a
    // range or claim probe is brought into view.
    expect(threeSource).toContain("overflow-clip");
    expect(threeSource).toContain("max-sm:sticky");
    expect(threeSource).toContain("max-sm:top-[calc(4rem+env(safe-area-inset-top))]");
    expect(threeSource).toContain("max-sm:[&_input[type=range]]:scroll-mt-72");
    expect(threeSource).toContain('className="mt-2 max-sm:[&_button]:scroll-mt-72"');
  });

  test("clears a pending firing completion before unmount", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "ColtRevolver3D.tsx"),
      "utf8",
    );

    expect(threeSource).toContain("const firingTimeoutRef = useRef");
    expect(threeSource).toContain("window.clearTimeout(firingTimeoutRef.current)");
    expect(threeSource).toContain("firingTimeoutRef.current = window.setTimeout");
    expect(threeSource).toContain("firingTimeoutRef.current = null;");
  });

  test("exposes all 6 authentic camera presets and 8 historical patent callouts", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "ColtRevolver3D.tsx"),
      "utf8",
    );

    for (const preset of ["iso", "cylinder", "lockwork", "sightline", "loading_lever", "top"]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("1. Octagonal Rifled Barrel (.36 Caliber)");
    expect(threeSource).toContain("2. 5-Chamber Roll-Engraved Cylinder");
    expect(threeSource).toContain("3. Single-Action Spur Hammer");
    expect(threeSource).toContain("4. Paterson Folding Trigger");
    expect(threeSource).toContain("5. Black Walnut Plowhandle Grip");
    expect(threeSource).toContain("6. Creeping Loading Lever & Rammer");
    expect(threeSource).toContain("7. Transverse Takedown Wedge");
    expect(threeSource).toContain("8. Recoil Shield & Capping Channel");
  });

  test("keeps the complete Paterson profile in a portrait overview without remounting on pins", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "ColtRevolver3D.tsx"),
      "utf8",
    );
    const cameraSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "coltRevolverCamera.ts"),
      "utf8",
    );

    expect(cameraSource).toContain("function coltRevolverCameraForViewport");
    expect(threeSource).toContain(
      'coltRevolverCameraForViewport("iso", container.clientWidth, container.clientHeight)',
    );
    expect(cameraSource).toContain("overviewDistanceMultiplier");
    expect(threeSource).toContain("showCalloutPins,");
    expect(threeSource).toContain("pinGroup.visible = p.showCalloutPins");
    expect(threeSource).not.toContain("}, [showCalloutPins, live]);");
  });

  test("uses a close desktop study view while retaining a centered full-profile tablet overview", () => {
    const desktop = projectedColtBounds(1216, 500);
    // The actual 768 px page card gives the canvas roughly 720 px of width.
    // Pin that narrower tablet frame rather than treating the browser width as
    // the available Three.js field.
    const tablet = projectedColtBounds(720, 500);
    const distance = (config: typeof desktop.cameraConfig) =>
      Math.hypot(
        config.pos[0] - config.target[0],
        config.pos[1] - config.target[1],
        config.pos[2] - config.target[2],
      );

    expect(desktop.maxX - desktop.minX).toBeGreaterThan(1.5);
    expect(distance(tablet.cameraConfig)).toBeGreaterThan(distance(desktop.cameraConfig));
    expect(tablet.cameraConfig.target).toEqual([3.15, -0.5, 0]);
    expect(tablet.maxX - tablet.minX).toBeGreaterThan(1.6);
    expect((tablet.minX + tablet.maxX) / 2).toBeGreaterThan(0.05);
    expect(tablet.minX).toBeGreaterThan(-1);
    expect(tablet.maxX).toBeLessThan(1);
    expect(tablet.minY).toBeGreaterThan(-1);
    expect(tablet.maxY).toBeLessThan(1);
  });

  test("balances the complete Paterson silhouette in real narrow-phone canvases", () => {
    // These are the actual rendered WebGL canvas dimensions for 320 px and
    // 375 px phone viewports, rather than the browser viewport dimensions.
    const phone320 = projectedColtMeshBounds(286, 420);

    for (const frame of [phone320]) {
      expect(frame.minX).toBeGreaterThan(-0.9);
      expect(frame.maxX).toBeLessThan(0.97);
      expect(frame.minY).toBeGreaterThan(-0.5);
      expect(frame.maxY).toBeLessThan(0.6);
      // The dense grip/cylinder visual mass reads left-heavy at a mathematically
      // centred envelope. A small rightward composition offset balances it
      // without sacrificing the visible muzzle or full historical silhouette.
      const visualCenter = (frame.minX + frame.maxX) / 2;
      expect(visualCenter).toBeGreaterThan(0.02);
      expect(visualCenter).toBeLessThan(0.1);
      expect(frame.maxX - frame.minX).toBeGreaterThan(1.7);
      expect(frame.maxY - frame.minY).toBeGreaterThan(0.55);
    }

    expect(phone320.cameraConfig.target).toEqual([3.65, -0.6, -0.9]);
  });

  test("mass-balances the full Colt silhouette in the V11 341 px phone canvas", () => {
    const phone320 = projectedColtMeshBounds(286, 420);
    const phone375 = projectedColtMeshBounds(341, 420);
    const visualCenter = (phone375.minX + phone375.maxX) / 2;

    // This is the actual interior canvas observed at a 375 px phone viewport.
    // It must use the dedicated wide-phone pose rather than the 320 px target.
    expect(phone375.cameraConfig.target).toEqual([2.2, -0.6, -0.9]);
    expect(phone375.minX).toBeGreaterThan(-0.65);
    expect(phone375.maxX).toBeLessThan(0.98);
    expect(phone375.minY).toBeGreaterThan(-0.4);
    expect(phone375.maxY).toBeLessThan(0.45);
    expect(phone375.maxX - phone375.minX).toBeGreaterThan(1.55);
    expect(phone375.maxY - phone375.minY).toBeGreaterThan(0.6);
    // A rightward geometric center counterweights the grip/cylinder's larger
    // visual mass without hiding the complete historical arm.
    expect(visualCenter).toBeGreaterThan(0.16);
    expect(visualCenter).toBeLessThan(0.2);

    const distance = (config: typeof phone375.cameraConfig) =>
      Math.hypot(
        config.pos[0] - config.target[0],
        config.pos[1] - config.target[1],
        config.pos[2] - config.target[2],
      );
    expect(distance(phone375.cameraConfig)).toBeGreaterThan(distance(phone320.cameraConfig));
  });

  test("keeps blued steel, case hardening, engraved steel, and walnut visibly distinct", () => {
    const model = buildColtRevolverModel();
    try {
      const finishColors = new Set<number>();
      model.group.traverse((part) => {
        if (!(part instanceof THREE.Mesh)) return;
        const materials = Array.isArray(part.material) ? part.material : [part.material];
        for (const material of materials) {
          if (material instanceof THREE.MeshStandardMaterial) {
            finishColors.add(material.color.getHex());
          }
        }
      });

      expect(COLT_HISTORICAL_FINISHES.bluedSteel.metalness).toBeLessThan(0.8);
      expect(COLT_HISTORICAL_FINISHES.caseHardenedSteel.metalness).toBeLessThan(0.8);
      expect(COLT_HISTORICAL_FINISHES.engravedSteel.metalness).toBeLessThan(0.8);
      expect(finishColors).toContain(COLT_HISTORICAL_FINISHES.bluedSteel.color);
      expect(finishColors).toContain(COLT_HISTORICAL_FINISHES.caseHardenedSteel.color);
      expect(finishColors).toContain(COLT_HISTORICAL_FINISHES.engravedSteel.color);
      expect(finishColors).toContain(COLT_HISTORICAL_FINISHES.walnut.color);
    } finally {
      model.dispose();
    }
  });

  test("computes solid mechanics hoop stress and ballistics in reproducible SI units", () => {
    const fullCock = stepColtRevolver({ chamberPressureMpa: 85, cockingAngleDeg: 45 });
    expect(fullCock.isLocked).toBe(true);
    expect(fullCock.indexAngleDeg).toBe(72);
    expect(fullCock.schematicBoltRetractY).toBe(0);
    expect(fullCock.hoopStressMpa).toBe(100.7);
    expect(fullCock.muzzleVelocityMps).toBe(304);
    expect(fullCock.muzzleEnergyJoules).toBe(240);
    expect(fullCock.powderGrains).toBe(45);
    expect(fullCock.recoilKick).toBeCloseTo(0.05 + (304 / 400) * 0.1, 3);
    expect(fullCock.recoilKickX).toBeCloseTo(fullCock.recoilKick * 0.8, 3);

    const halfCock = stepColtRevolver({ chamberPressureMpa: 85, cockingAngleDeg: 22.5 });
    expect(halfCock.isLocked).toBe(false);
    expect(halfCock.indexAngleDeg).toBe(36);
    expect(halfCock.schematicBoltRetractY).toBe(8);

    const hammerDown = stepColtRevolver({ chamberPressureMpa: 85, cockingAngleDeg: 0 });
    expect(hammerDown.isLocked).toBe(false);
    expect(hammerDown.indexAngleDeg).toBe(0);
  });

  test("builds and articulates procedural 5-chamber cylinder, folding trigger, and lockwork cutaway correctly", () => {
    const model = buildColtRevolverModel();

    expect(model.group.children.length).toBeGreaterThan(3);
    expect(model.cylinderGroup).toBeDefined();
    expect(model.hammerGroup).toBeDefined();
    expect(model.triggerGroup).toBeDefined();
    expect(model.loadingLeverGroup).toBeDefined();
    expect(model.rammerPlunger).toBeDefined();

    updateColtRevolverKinematics(model, 45, 1, 50, true, true);
    expect(model.hammerGroup.rotation.z).toBeCloseTo(-(45 * Math.PI) / 180, 2);
    expect(model.blastMesh.visible).toBe(true);
    expect(model.lockworkCutawayGroup.visible).toBe(true);

    model.dispose();
  });
});
