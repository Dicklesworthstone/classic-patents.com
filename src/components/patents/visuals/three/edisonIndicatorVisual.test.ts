import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import { stepEdisonIndicator } from "@/physics/catalogKernels";
import { edisonIndicatorCameraForViewport } from "./edisonIndicatorCamera";
import { buildEdisonIndicatorModel } from "./edisonIndicatorModel";

function projectedOverviewBounds(viewportWidth: number, viewportHeight: number) {
  const model = buildEdisonIndicatorModel();
  try {
    model.root.updateMatrixWorld(true);
    const bounds = new THREE.Box3().setFromObject(model.root);
    const view = edisonIndicatorCameraForViewport("overview", viewportWidth);
    const camera = new THREE.PerspectiveCamera(42, viewportWidth / viewportHeight, 0.1, 1000);
    camera.position.set(...view.pos);
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

function projectedGeometryBandBounds(
  viewportWidth: number,
  viewportHeight: number,
  top: number,
  bottom: number,
) {
  const model = buildEdisonIndicatorModel();
  try {
    model.root.updateMatrixWorld(true);
    const view = edisonIndicatorCameraForViewport("overview", viewportWidth);
    const camera = new THREE.PerspectiveCamera(42, viewportWidth / viewportHeight, 0.1, 1000);
    camera.position.set(...view.pos);
    camera.lookAt(...view.target);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();

    const projected: THREE.Vector3[] = [];
    model.root.traverse((node) => {
      const geometry = (node as THREE.Mesh).geometry;
      const positions = geometry?.getAttribute("position");
      if (!positions) return;

      const point = new THREE.Vector3();
      for (let index = 0; index < positions.count; index += 1) {
        point.fromBufferAttribute(positions, index).applyMatrix4(node.matrixWorld).project(camera);
        const screenY = ((1 - point.y) * viewportHeight) / 2;
        if (screenY >= top && screenY <= bottom) {
          projected.push(point.clone());
        }
      }
    });

    return {
      count: projected.length,
      minX: Math.min(...projected.map((point) => ((point.x + 1) * viewportWidth) / 2)),
      maxX: Math.max(...projected.map((point) => ((point.x + 1) * viewportWidth) / 2)),
    };
  } finally {
    model.dispose();
  }
}

describe("US 307,031 Thomas Edison Electrical Indicator Visual Boundary", () => {
  const root = process.cwd();

  it("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const modelSource = readFileSync(
      join(root, "src/components/patents/visuals/three/edisonIndicatorModel.ts"),
      "utf8",
    );
    const componentSource = readFileSync(
      join(root, "src/components/patents/visuals/three/EdisonIndicator3D.tsx"),
      "utf8",
    );

    expect(modelSource).not.toContain(".gltf");
    expect(modelSource).not.toContain(".glb");
    expect(modelSource).not.toContain("GLTFLoader");
    expect(componentSource).not.toContain(".gltf");
    expect(componentSource).not.toContain(".glb");
    expect(componentSource).not.toContain("GLTFLoader");
    expect(componentSource).toContain('usePatentPhysics("us-307031-edison-indicator")');
    expect(componentSource).toContain('from "./useLiveSimParams"');
    expect(componentSource).toContain("controls.setView");
    expect(componentSource).toContain('from "./edisonIndicatorCamera"');
    expect(componentSource).toContain("edisonIndicatorCameraForViewport");
    expect(componentSource).toContain(
      'edisonIndicatorCameraForViewport("overview", container.clientWidth)',
    );
    expect(componentSource).toContain('window.addEventListener("resize", restoreResponsiveCamera)');
    const simSource = readFileSync(
      join(root, "src/components/patents/visuals/EdisonIndicatorSim.tsx"),
      "utf8",
    );
    expect(simSource).toContain('usePatentPhysics("us-307031-edison-indicator")');
    expect(simSource).not.toContain("setMainsVoltage");
  });

  it("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const componentSource = readFileSync(
      join(root, "src/components/patents/visuals/three/EdisonIndicator3D.tsx"),
      "utf8",
    );

    expect(componentSource).not.toContain("Math.random()");
    expect(componentSource).not.toContain("THREE.Clock");
    expect(componentSource).not.toContain("Date.now()");
  });

  it("fully frames the torsion post and baseboard at desktop, tablet, and narrow-phone widths", () => {
    const desktop = edisonIndicatorCameraForViewport("overview", 1214);
    const tablet = edisonIndicatorCameraForViewport("overview", 718);
    const phone375 = edisonIndicatorCameraForViewport("overview", 375);
    const phone320 = edisonIndicatorCameraForViewport("overview", 320);
    const desktopFrame = projectedOverviewBounds(1214, 460);
    const tabletFrame = projectedOverviewBounds(718, 460);
    const narrowPhoneFrame = projectedOverviewBounds(320, 430);

    expect(desktop).toEqual({ pos: [0, 2.6, 5.0], target: [0, 0.9, 0] });
    expect(tablet).toEqual({ pos: [0, 2.4, 5.4], target: [0, 1.0, 0] });
    expect(phone375).toEqual({ pos: [0, 2.6, 8.0], target: [0, 0.9, 0] });
    expect(phone320).toEqual({ pos: [0, 3.0, 9.5], target: [0, 0.9, 0] });

    // The full model bounds include the brass torsion-post thumb nut and the
    // physical mahogany baseboard. These bounds must never touch the canvas.
    expect(desktopFrame.minX).toBeGreaterThan(-0.7);
    expect(desktopFrame.maxX).toBeLessThan(0.7);
    expect(desktopFrame.minY).toBeGreaterThan(-0.92);
    expect(desktopFrame.maxY).toBeLessThan(0.86);
    expect(tabletFrame.minX).toBeGreaterThan(-0.95);
    expect(tabletFrame.maxX).toBeLessThan(0.95);
    expect(tabletFrame.minY).toBeGreaterThan(-0.9);
    expect(tabletFrame.maxY).toBeLessThan(0.8);
    expect(narrowPhoneFrame.minX).toBeGreaterThan(-0.95);
    expect(narrowPhoneFrame.maxX).toBeLessThan(0.95);
    expect(narrowPhoneFrame.minY).toBeGreaterThan(-0.5);
    expect(narrowPhoneFrame.maxY).toBeLessThan(0.5);
  });

  it("keeps desktop thermionic telemetry in a top-right clearance lane, not over the baseboard", () => {
    const componentSource = readFileSync(
      join(root, "src/components/patents/visuals/three/EdisonIndicator3D.tsx"),
      "utf8",
    );
    const topRightBand = projectedGeometryBandBounds(1214, 460, 80, 220);

    // The chip strip is 17 rem wide and right-aligned at the standard 1 rem
    // desktop inset. Its top placement sits below the action buttons, while
    // this physical-model projection proves that lane retains 64 px of air.
    const telemetryLeftEdge = 1214 - 16 - 17 * 16;
    expect(componentSource).toContain("minDesktopWidth: 1100");
    expect(componentSource).toContain('placement="top"');
    expect(componentSource).toContain('width="compact"');
    expect(topRightBand.count).toBeGreaterThan(0);
    expect(topRightBand.maxX).toBeLessThan(telemetryLeftEdge - 64);
  });

  it("computes genuine Richardson-Dushman emission, filament temperature, and galvo deflection in SI units", () => {
    // Nominal condition at 110 V
    const nominal = stepEdisonIndicator({
      mainsVoltageV: 110,
      plateBiasPolarity: 1,
      galvanometerTorsionNullV: 110,
    });

    expect(nominal.filamentTemperatureK).toBeGreaterThan(1900);
    expect(nominal.filamentTemperatureK).toBeLessThan(2400);
    expect(nominal.emissionCurrentMicroAmps).toBeGreaterThan(5);
    expect(nominal.galvoDeflectionDeg).toBeCloseTo(0.0, 1);
    expect(nominal.regulatorState).toBe("nominal");

    // Over-voltage condition at 125 V
    const overVoltage = stepEdisonIndicator({
      mainsVoltageV: 125,
      plateBiasPolarity: 1,
      galvanometerTorsionNullV: 110,
    });
    expect(overVoltage.filamentTemperatureK).toBeGreaterThan(nominal.filamentTemperatureK);
    expect(overVoltage.emissionCurrentMicroAmps).toBeGreaterThan(nominal.emissionCurrentMicroAmps);
    expect(overVoltage.galvoDeflectionDeg).toBeGreaterThan(0);
    expect(overVoltage.regulatorState).toBe("high_voltage_trip");

    // Reverse-bias condition (negative plate)
    const reverseBias = stepEdisonIndicator({
      mainsVoltageV: 110,
      plateBiasPolarity: -1,
      galvanometerTorsionNullV: 110,
    });
    expect(reverseBias.emissionCurrentMicroAmps).toBeLessThan(0.1);
    expect(reverseBias.rectificationRatio).toBeGreaterThanOrEqual(1000);
  });

  it("builds and articulates procedural baseboard, vacuum bulb, carbon loop, platinum plate, and galvanometer needle", () => {
    const model = buildEdisonIndicatorModel();
    expect(model.root).toBeDefined();
    expect(model.root.children.length).toBeGreaterThan(2);

    // Update with live values
    model.update({
      filamentTemperatureK: 2150,
      galvoDeflectionDeg: 12.5,
      plateBiasPolarity: "positive",
      mainsVoltageV: 120,
    });

    model.dispose();
  });
});
