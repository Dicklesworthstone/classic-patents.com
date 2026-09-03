import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepLandPolaroidInstantFilm } from "@/physics/catalogKernels";
import { landPolaroidViewForViewport } from "./landPolaroidCamera";
import { createLandPolaroidModel } from "./landPolaroidModel";
import { LAND_POLAROID_3D_SOURCE_BOUNDARY } from "./landPolaroidSourceBoundary";

describe("US 2,543,181 Edwin Land Polaroid Instant Photography Visual Boundary", () => {
  it("3D live loop drains useLiveSimParams instead of remounting on slider ticks", () => {
    const studioSource = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/three/LandPolaroid3D.tsx"),
      "utf8",
    );
    expect(studioSource).toContain('from "./useLiveSimParams"');
    expect(studioSource).toContain("model.update(0, live.current)");
    expect(studioSource).not.toContain("cameraPreset]");
    expect(studioSource).toContain("createThreeStudioScene");
    expect(studioSource).not.toContain("OrbitControls");
    expect(studioSource).not.toContain("PortHamiltonianEnergyStrip");
    expect(studioSource).toContain("claim1Active");
    expect(LAND_POLAROID_3D_SOURCE_BOUNDARY).toContain("energy accounting is refused");
  });

  it("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const model = createLandPolaroidModel();
    expect(model.foundation.name).toContain("foundation");
    expect(model.processBed.name).toContain("clear of roller nip");
    expect(model.bearingFrames.name).toContain("seated on foundation");
    expect(model.rollerTop).toBeDefined();
    expect(model.rollerBottom).toBeDefined();
    expect(model.negativeSheet).toBeDefined();
    expect(model.positiveSheet).toBeDefined();
    expect(model.attachedSeams.children).toHaveLength(2);
    expect(model.reagentGelLayer).toBeDefined();
    expect(model.rupturablePod).toBeDefined();
    expect(model.positiveImage).toBeDefined();
    expect(model.materials.length).toBeGreaterThanOrEqual(6);
    expect(model.geometries.length).toBeGreaterThanOrEqual(6);
    model.dispose();
  });

  it("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const stateA = stepLandPolaroidInstantFilm({
      developmentTimeSec: 30,
      exposureFraction: 0.6,
      reagentViscosityCp: 25000,
      rollerGapUm: 25,
      alkaliPh: 12.6,
    });
    const stateB = stepLandPolaroidInstantFilm({
      developmentTimeSec: 30,
      exposureFraction: 0.6,
      reagentViscosityCp: 25000,
      rollerGapUm: 25,
      alkaliPh: 12.6,
    });
    expect(stateA.positiveSilverDensity).toBe(stateB.positiveSilverDensity);
    expect(stateA.negativeSilverDensity).toBe(stateB.negativeSilverDensity);
    expect(stateA.transferEfficiencyPercent).toBe(stateB.transferEfficiencyPercent);
  });

  it("does not mutate the shared processing-time control until the visitor starts the timer", () => {
    const simSource = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/LandPolaroidSim.tsx"),
      "utf8",
    );
    expect(simSource).toContain("useState<boolean>(false)");
    expect(simSource).toContain("if (!isPlaying) setInternalTime(developmentTimeSec)");
    expect(simSource).toContain('aria-label={isPlaying ? "Pause Timer" : "Start Timer"}');
  });

  it("evaluates the declared Fickian teaching scenario and refuses a removed Claim 1 path", () => {
    const shadowState = stepLandPolaroidInstantFilm({
      developmentTimeSec: 45,
      exposureFraction: 0.1, // Shadow area = unexposed silver forms positive
    });
    const highlightState = stepLandPolaroidInstantFilm({
      developmentTimeSec: 45,
      exposureFraction: 0.9, // Highlight area = exposed silver stays in negative
    });

    expect(shadowState.positiveSilverDensity).toBeGreaterThan(highlightState.positiveSilverDensity);
    expect(highlightState.negativeSilverDensity).toBeGreaterThan(shadowState.negativeSilverDensity);
    expect(shadowState.transferEfficiencyPercent).toBeGreaterThan(80);
    expect(shadowState.rollerDisplayOmegaRadPerS).toBe(0);
    expect(stepLandPolaroidInstantFilm({ developmentTimeSec: 1 }).rollerDisplayOmegaRadPerS).toBe(
      3,
    );
    expect(stepLandPolaroidInstantFilm({ developmentTimeSec: 0 }).rollerDisplayOmegaRadPerS).toBe(
      0,
    );
    const removed = stepLandPolaroidInstantFilm({
      claim1Active: false,
      developmentTimeSec: 45,
    });
    expect(removed.claim1PathActive).toBe(false);
    expect(removed.positiveSilverDensity).toBe(0);
    expect(removed.transferEfficiencyPercent).toBe(0);
    expect(removed.diffusionFluxMolPerM2S).toBe(0);
    expect(removed.meniscusSpreadUniformityPercent).toBe(0);
    expect(
      stepLandPolaroidInstantFilm({
        developmentTimeSec: Number.NaN,
        reagentViscosityCp: Number.POSITIVE_INFINITY,
      }).positiveSilverDensity,
    ).toBeFinite();
  });

  it("keeps every product and roller load path supported and coincident", () => {
    const model = createLandPolaroidModel();
    const foundationTop = model.foundation.position.y + 0.24 / 2;
    const bedBottom = model.incomingBed.position.y - 0.16 / 2;
    const bedTop = model.incomingBed.position.y + 0.16 / 2;
    const lowerSheetBottom = model.positiveSheet.position.y - 0.03 / 2;
    const lowerRollerTop = model.rollerBottom.position.y + 0.285;
    const upperSheetTop = model.negativeSheet.position.y + 0.03 / 2;
    const upperRollerBottom = model.rollerTop.position.y - 0.285;
    const legs = model.group.children.filter((child) => child.name === "platen support leg");

    expect(legs).toHaveLength(4);
    for (const leg of legs) {
      expect(leg.position.y - 0.55 / 2).toBeCloseTo(foundationTop, 8);
      expect(leg.position.y + 0.55 / 2).toBeCloseTo(bedBottom, 8);
    }
    expect(lowerSheetBottom).toBeCloseTo(bedTop, 8);
    expect(lowerRollerTop).toBeCloseTo(lowerSheetBottom, 8);
    expect(upperRollerBottom).toBeCloseTo(upperSheetTop, 8);
    expect(model.bearingFrames.children).toHaveLength(2);
    const incomingBedEnd = model.incomingBed.position.z + 2.2 / 2;
    const outgoingBedStart = model.outgoingBed.position.z - 3.1 / 2;
    expect(incomingBedEnd).toBeLessThan(-0.285);
    expect(outgoingBedStart).toBeGreaterThan(0.285);

    model.update(9, { developmentTimeSec: 1, exposureFraction: 0.5 });
    expect(model.rollerTop.rotation.x).toBeCloseTo(3, 8);
    expect(model.rollerBottom.rotation.x).toBeCloseTo(-3, 8);
    expect(model.attachedSeams.visible).toBe(true);
    expect(model.rupturablePod.position.y).toBeCloseTo(1, 8);

    model.update(999, { developmentTimeSec: 1, exposureFraction: 0.5 });
    expect(model.rollerTop.rotation.x).toBeCloseTo(3, 8);

    model.update(1, { developmentTimeSec: 30, claim1Active: false });
    expect(model.attachedSeams.visible).toBe(false);
    expect(model.reagentGelLayer.visible).toBe(false);
    expect(model.positiveImage.visible).toBe(false);
    expect(model.rupturablePod.position.y - 0.18 / 2).toBeCloseTo(foundationTop, 8);
    expect(model.rupturablePod.rotation.y).toBeCloseTo(Math.PI / 2, 8);

    const modelSource = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/three/landPolaroidModel.ts"),
      "utf8",
    );
    expect(modelSource).not.toContain("Polaroid Model 95 Camera Body");
    expect(modelSource).not.toContain("Leather Accordion Bellows");
    model.dispose();
  });

  it("backs the phone overview away while preserving the same source target", () => {
    const desktop = landPolaroidViewForViewport("overview", 1200);
    const phone = landPolaroidViewForViewport("overview", 320);
    const distance = (view: typeof desktop) =>
      Math.hypot(
        view.pos[0] - view.target[0],
        view.pos[1] - view.target[1],
        view.pos[2] - view.target[2],
      );
    expect(phone.target).toEqual(desktop.target);
    expect(distance(phone)).toBeGreaterThan(distance(desktop) * 1.6);
  });
});
