import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import * as THREE from "three";
import { applyClaimConstraintModifications } from "@/physics/claimConstraints";
import {
  DEFAULT_SIKORSKY_CONTROLS,
  INITIAL_SIKORSKY_STATE,
  SIKORSKY_SOURCE_BOUNDARY,
  stepSikorskyHelicopterSi,
} from "@/physics/sikorskyHelicopterKernel";
import {
  SIKORSKY_HELICOPTER_VIEW_LABELS,
  sikorskyViewForViewport,
} from "./sikorskyHelicopterCamera";
import { buildSikorskyHelicopterModel, sikorskyStudioAltitude } from "./sikorskyHelicopterModel";

function projectedTabletOverviewBounds() {
  const model = buildSikorskyHelicopterModel();
  try {
    const result = stepSikorskyHelicopterSi(
      INITIAL_SIKORSKY_STATE,
      DEFAULT_SIKORSKY_CONTROLS,
      0.016,
    );
    model.updateState(result.metrics, DEFAULT_SIKORSKY_CONTROLS, result.state);
    model.root.updateMatrixWorld(true);

    const bounds = new THREE.Box3().setFromObject(model.root);
    const view = sikorskyViewForViewport("overview", 720, INITIAL_SIKORSKY_STATE.altitudeMeters);
    const camera = new THREE.PerspectiveCamera(42, 720 / 540, 0.1, 1000);
    camera.position.set(...view.position);
    camera.lookAt(...view.target);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();

    const projected = [bounds.min.x, bounds.max.x].flatMap((x) =>
      [bounds.min.y, bounds.max.y].flatMap((y) =>
        [bounds.min.z, bounds.max.z].map((z) => new THREE.Vector3(x, y, z).project(camera)),
      ),
    );
    return {
      minX: Math.min(...projected.map((point) => point.x)),
      maxX: Math.max(...projected.map((point) => point.x)),
      minY: Math.min(...projected.map((point) => point.y)),
      maxY: Math.max(...projected.map((point) => point.y)),
    };
  } finally {
    model.dispose();
  }
}

type ProjectedBounds = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

function expandProjectedBounds(bounds: ProjectedBounds, point: THREE.Vector3) {
  bounds.minX = Math.min(bounds.minX, point.x);
  bounds.maxX = Math.max(bounds.maxX, point.x);
  bounds.minY = Math.min(bounds.minY, point.y);
  bounds.maxY = Math.max(bounds.maxY, point.y);
}

function projectedPhoneOverviewBounds(viewportWidth: number, viewportHeight: number) {
  const model = buildSikorskyHelicopterModel();
  try {
    const result = stepSikorskyHelicopterSi(
      INITIAL_SIKORSKY_STATE,
      DEFAULT_SIKORSKY_CONTROLS,
      0.016,
    );
    const view = sikorskyViewForViewport(
      "overview",
      viewportWidth,
      INITIAL_SIKORSKY_STATE.altitudeMeters,
    );
    const camera = new THREE.PerspectiveCamera(42, viewportWidth / viewportHeight, 0.1, 1000);
    camera.position.set(...view.position);
    camera.lookAt(...view.target);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();

    const allAirframe: ProjectedBounds = {
      minX: Number.POSITIVE_INFINITY,
      maxX: Number.NEGATIVE_INFINITY,
      minY: Number.POSITIVE_INFINITY,
      maxY: Number.NEGATIVE_INFINITY,
    };
    const centralAssembly: ProjectedBounds = { ...allAirframe };

    // Cover every animated rotor orientation rather than validating only the
    // first frame that happened to reach the screenshot harness.
    for (let phaseIndex = 0; phaseIndex < 24; phaseIndex++) {
      const phase = (phaseIndex / 24) * Math.PI * 2;
      model.updateState(result.metrics, DEFAULT_SIKORSKY_CONTROLS, {
        ...result.state,
        rotorPhaseRad: phase,
        tailRotorPhaseRad: phase * 5,
      });
      model.root.updateMatrixWorld(true);
      model.root.traverse((part) => {
        if (!(part instanceof THREE.Mesh)) return;
        const positions = part.geometry.getAttribute("position");
        for (let index = 0; index < positions.count; index++) {
          const world = new THREE.Vector3()
            .fromBufferAttribute(positions, index)
            .applyMatrix4(part.matrixWorld);
          const projected = world.clone().project(camera);
          expandProjectedBounds(allAirframe, projected);
          if (world.x ** 2 + world.z ** 2 < 2.25 && world.y < 2.2) {
            expandProjectedBounds(centralAssembly, projected);
          }
        }
      });
    }
    return { allAirframe, centralAssembly };
  } finally {
    model.dispose();
  }
}

describe("US 2,318,259 Sikorsky Helicopter 3D Procedural Model", () => {
  test("instantiates full procedural 3D hierarchy: fuselage truss, engine, rotor mast, swashplate, tail boom, tail rotor", () => {
    const model = buildSikorskyHelicopterModel();
    expect(model.root.name).toBe("US 2,318,259 Sikorsky VS-300 Helicopter 3D Studio Model");
    expect(model.root.children.length).toBeGreaterThan(0);

    model.root.updateMatrixWorld(true);
    for (const [strutName, wheelName] of [
      ["SikorskyLeftLandingStrut", "SikorskyLeftMainWheel"],
      ["SikorskyRightLandingStrut", "SikorskyRightMainWheel"],
      ["SikorskyTailWheelStrut", "SikorskyTailWheel"],
    ] as const) {
      const strut = model.root.getObjectByName(strutName) as THREE.Mesh;
      const wheel = model.root.getObjectByName(wheelName) as THREE.Mesh;
      const height = (strut.geometry as THREE.CylinderGeometry).parameters.height;
      const center = strut.getWorldPosition(new THREE.Vector3());
      const axis = new THREE.Vector3(0, height / 2, 0).applyQuaternion(
        strut.getWorldQuaternion(new THREE.Quaternion()),
      );
      const wheelCenter = wheel.getWorldPosition(new THREE.Vector3());
      expect(
        Math.min(
          center.clone().add(axis).distanceTo(wheelCenter),
          center.sub(axis).distanceTo(wheelCenter),
        ),
      ).toBeLessThan(1e-9);
    }
    model.dispose();
  });

  test("keeps all three rigid pitch links coincident with the rotating plate and blade horns", () => {
    const model = buildSikorskyHelicopterModel();
    const controls = {
      ...DEFAULT_SIKORSKY_CONTROLS,
      collectivePitchDeg: 13,
      cyclicPitchForwardDeg: 7,
      cyclicRollRightDeg: -5,
    };
    const result = stepSikorskyHelicopterSi(INITIAL_SIKORSKY_STATE, controls, 0.05);
    model.updateState(result.metrics, controls, result.state);
    model.root.updateMatrixWorld(true);

    for (let index = 1; index <= 3; index++) {
      const link = model.root.getObjectByName(`SikorskyRigidPitchLink${index}`) as THREE.Mesh;
      const lower = model.root.getObjectByName(`SikorskyPitchPlateAnchor${index}`);
      const upper = model.root.getObjectByName(`SikorskyBladePitchHornAnchor${index}`);
      expect(link).toBeDefined();
      expect(lower).toBeDefined();
      expect(upper).toBeDefined();
      if (!lower || !upper) throw new Error(`Pitch-link anchors ${index} are missing.`);

      const endpointA = new THREE.Vector3(0, -0.5, 0).applyMatrix4(link.matrixWorld);
      const endpointB = new THREE.Vector3(0, 0.5, 0).applyMatrix4(link.matrixWorld);
      const lowerWorld = lower.getWorldPosition(new THREE.Vector3());
      const upperWorld = upper.getWorldPosition(new THREE.Vector3());
      expect(
        Math.min(endpointA.distanceTo(lowerWorld), endpointB.distanceTo(lowerWorld)),
      ).toBeLessThan(1e-8);
      expect(
        Math.min(endpointA.distanceTo(upperWorld), endpointB.distanceTo(upperWorld)),
      ).toBeLessThan(1e-8);
    }

    expect(model.root.getObjectByName("SikorskyAuxiliaryRotorDriveShaft")).toBeDefined();
    model.dispose();
  });

  test("keeps the inspection camera centred on the compressed studio altitude", () => {
    const studioSource = readFileSync(
      resolve(process.cwd(), "src/components/patents/visuals/three/SikorskyHelicopter3D.tsx"),
      "utf8",
    );
    const cameraSource = readFileSync(
      resolve(process.cwd(), "src/components/patents/visuals/three/sikorskyHelicopterCamera.ts"),
      "utf8",
    );
    expect(studioSource).toContain("sikorskyViewForViewport");
    expect(cameraSource).toContain("sikorskyStudioAltitude(altitudeMeters)");
    expect(cameraSource).toContain("position: [5.9, 4.5, 7.2]");
  });

  test("keeps long-running climbs inside the inspection volume without corrupting SI altitude", () => {
    const model = buildSikorskyHelicopterModel();
    const highAltitudeState = { ...INITIAL_SIKORSKY_STATE, altitudeMeters: 10_000 };
    const result = stepSikorskyHelicopterSi(
      INITIAL_SIKORSKY_STATE,
      DEFAULT_SIKORSKY_CONTROLS,
      0.05,
    );
    model.updateState(result.metrics, DEFAULT_SIKORSKY_CONTROLS, highAltitudeState);
    const airframe = model.root.getObjectByName("HelicopterAirframe");
    expect(airframe).toBeDefined();
    expect(airframe?.position.y).toBeGreaterThan(2);
    expect(airframe?.position.y).toBeLessThanOrEqual(2.3);
    expect(highAltitudeState.altitudeMeters).toBe(10_000);
    model.dispose();
  });

  test("aims inspection cameras at the actual articulated assemblies and follows display altitude", () => {
    const defaultRotor = sikorskyViewForViewport(
      "rotorHead",
      1200,
      INITIAL_SIKORSKY_STATE.altitudeMeters,
    );
    const cockpit = sikorskyViewForViewport("cockpit", 1200, INITIAL_SIKORSKY_STATE.altitudeMeters);
    expect(defaultRotor.target[1]).toBeGreaterThan(3);
    expect(cockpit.target[1]).toBeLessThan(defaultRotor.target[1]);

    const highRotor = sikorskyViewForViewport("rotorHead", 1200, 10_000);
    const expectedOffset =
      sikorskyStudioAltitude(10_000) -
      sikorskyStudioAltitude(INITIAL_SIKORSKY_STATE.altitudeMeters);
    expect(highRotor.target[1] - defaultRotor.target[1]).toBeCloseTo(expectedOffset, 12);
    expect(highRotor.position[1] - defaultRotor.position[1]).toBeCloseTo(expectedOffset, 12);

    const mobileOverview = sikorskyViewForViewport(
      "overview",
      390,
      INITIAL_SIKORSKY_STATE.altitudeMeters,
    );
    const desktopOverview = sikorskyViewForViewport(
      "overview",
      1200,
      INITIAL_SIKORSKY_STATE.altitudeMeters,
    );
    const tabletOverview = sikorskyViewForViewport(
      "overview",
      768,
      INITIAL_SIKORSKY_STATE.altitudeMeters,
    );
    expect(mobileOverview.position).not.toEqual(desktopOverview.position);
    expect(mobileOverview.position).toEqual([5.63, 6.85, 5.57]);
    expect(mobileOverview.target).toEqual([0.18, 2.4, 0.12]);
    expect(tabletOverview.position).toEqual([6.15, 4.58, 7.56]);
    expect(tabletOverview.target).toEqual([-0.35, 1.65, -1.3]);
    expect(tabletOverview.position).not.toEqual(desktopOverview.position);
  });

  test("keeps the complete main-rotor envelope inside a rendered tablet card", () => {
    const frame = projectedTabletOverviewBounds();

    // A 720 px content card is narrower than the nominal 768 px tablet. Keep
    // a clear NDC margin rather than merely avoiding a one-pixel rotor crop.
    expect(frame.minX).toBeGreaterThan(-0.95);
    expect(frame.maxX).toBeLessThan(0.95);
    expect(frame.minY).toBeGreaterThan(-0.9);
    expect(frame.maxY).toBeLessThan(0.6);
  });

  test("keeps the complete animated airframe readable in real narrow-phone canvases", () => {
    // These are the measured canvas dimensions for the 320 px and 375 px
    // phone audit cases, not the browser viewport dimensions.
    for (const [viewportWidth, viewportHeight] of [
      [286, 214.5],
      [341, 255.75],
    ]) {
      const { allAirframe, centralAssembly } = projectedPhoneOverviewBounds(
        viewportWidth,
        viewportHeight,
      );
      expect(allAirframe.minX).toBeGreaterThan(-0.94);
      expect(allAirframe.maxX).toBeLessThan(0.94);
      expect(allAirframe.minY).toBeGreaterThan(-0.7);
      expect(allAirframe.maxY).toBeLessThan(0.7);
      expect(centralAssembly.maxX - centralAssembly.minX).toBeGreaterThan(0.44);
      expect(centralAssembly.maxY - centralAssembly.minY).toBeGreaterThan(0.45);
    }
  });

  test("keeps the full airframe visible by default on narrow viewports", () => {
    const source = readFileSync(
      resolve(process.cwd(), "src/components/patents/visuals/three/SikorskyHelicopter3D.tsx"),
      "utf8",
    );
    const cameraSource = readFileSync(
      resolve(process.cwd(), "src/components/patents/visuals/three/sikorskyHelicopterCamera.ts"),
      "utf8",
    );
    expect(source).toContain("useResponsiveStudioHud(true)");
    expect(cameraSource).toContain("MOBILE_OVERVIEW");
    expect(source).toContain("flex-nowrap");
    expect(source).toContain('data-testid="sikorsky-source-boundary"');
    expect(source).toContain("SIKORSKY_SOURCE_BOUNDARY.reason");
    expect(source).toContain("refusal: { isRefused: true");
    expect(source).toContain("applyClaimConstraintModifications");
    expect(source).not.toContain("PortHamiltonianEnergyStrip");
    expect(SIKORSKY_SOURCE_BOUNDARY.reason).toContain("no aircraft mass");
  });

  test("uses complete, non-overlapping inspection labels in the 320 px phone toolbar", () => {
    const source = readFileSync(
      resolve(process.cwd(), "src/components/patents/visuals/three/SikorskyHelicopter3D.tsx"),
      "utf8",
    );

    expect(SIKORSKY_HELICOPTER_VIEW_LABELS).toEqual({
      overview: "Full Airframe",
      rotorHead: "Main Hub / Swashplate",
      tailRotor: "Anti-Torque Tail",
      cockpit: "Flight Controls",
    });
    expect(source).toContain('data-testid="sikorsky-mobile-view-select"');
    expect(source).toContain('aria-label="Helicopter inspection view"');
    // 6 rem (96 px) leaves the full 174 px selector lane in a 286 px canvas
    // after the two icon controls; desktop retains its full button toolbar.
    expect(source).toContain("absolute top-4 left-4 right-24 z-10 sm:hidden");
    expect(source).toContain("absolute top-4 left-4 right-20 z-10 hidden flex-nowrap");
  });

  test("updates 3D articulated rotor kinematics and flight attitude from SI physics telemetry", () => {
    const model = buildSikorskyHelicopterModel();
    const result = stepSikorskyHelicopterSi(
      INITIAL_SIKORSKY_STATE,
      DEFAULT_SIKORSKY_CONTROLS,
      0.016,
    );

    expect(() => {
      model.updateState(result.metrics, DEFAULT_SIKORSKY_CONTROLS, result.state);
    }).not.toThrow();

    // High collective pitch & cyclic forward tilt
    const climbControls = {
      ...DEFAULT_SIKORSKY_CONTROLS,
      collectivePitchDeg: 14.0,
      cyclicPitchForwardDeg: 6.0,
      tailRotorPedalPercent: 30.0,
    };
    const climbResult = stepSikorskyHelicopterSi(result.state, climbControls, 0.05);
    expect(() => {
      model.updateState(climbResult.metrics, climbControls, climbResult.state);
    }).not.toThrow();

    model.dispose();
  });

  test("refuses a synthetic historical energy strip", () => {
    const {
      ENERGY_CHANNEL_OMISSION_REASONS,
      energyChannelsFor,
    } = require("@/physics/energyChannels");
    expect(energyChannelsFor("us-2318259-sikorsky-helicopter", {})).toEqual([]);
    expect(ENERGY_CHANNEL_OMISSION_REASONS["us-2318259-sikorsky-helicopter"]).toContain(
      "no aircraft mass",
    );
  });

  test("routes both claim inversions into shared kernel controls", () => {
    const result = applyClaimConstraintModifications(
      "us-2318259-sikorsky-helicopter",
      { ...DEFAULT_SIKORSKY_CONTROLS },
      { 1: false, 2: false },
    );
    expect(result.modifiedParams.collectiveThrottleLinked).toBe(0);
    expect(result.modifiedParams.auxiliaryRotorEnabled).toBe(0);
    expect(result.activeFailures).toHaveLength(2);
  });

  test("classifies every quantitative registry value as scenario-derived", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const entry = PATENT_PHYSICS_REGISTRY["us-2318259-sikorsky-helicopter"];
    expect(entry.provenance).toBe("scenario-modern");
    expect(entry.engineMethod).toContain("historical SI dynamics refused");
    for (const control of entry.controls) expect(control.provenance).toBe("scenario-reader");
    for (const metric of entry.computeMetrics({})) {
      expect(metric.provenance).toBe("scenario-reader");
    }
  });
});
