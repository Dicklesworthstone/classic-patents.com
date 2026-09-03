import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import { ALL_COLORIZED_EQUATIONS } from "@/data/colorizedEquations";
import { stepLemelsonAutomaticProductionTopology } from "@/physics/lemelsonAutomaticProductionKernel";
import { PATENT_PHYSICS_REGISTRY } from "@/physics/telemetryData";
import { buildLemelsonAutomaticProductionModel } from "./lemelsonAutomaticProductionModel";

const PATENT_ID = "us-3313014-lemelson-automatic-production";
const THREE_DIRECTORY = join(process.cwd(), "src", "components", "patents", "visuals", "three");

function object(model: ReturnType<typeof buildLemelsonAutomaticProductionModel>, name: string) {
  const found = model.root.getObjectByName(name);
  expect(found, `missing ${name}`).toBeDefined();
  return found as THREE.Object3D;
}

function bounds(value: THREE.Object3D) {
  value.updateWorldMatrix(true, true);
  return new THREE.Box3().setFromObject(value);
}

function expectContact(a: THREE.Object3D, b: THREE.Object3D) {
  expect(bounds(a).intersectsBox(bounds(b))).toBe(true);
}

describe("US 3,313,014 automatic-production source-bounded visual", () => {
  test("keeps the carrier, column, platform, portable controller, and station interface connected", () => {
    const model = buildLemelsonAutomaticProductionModel();
    expect(model.root.getObjectByName("Overhead trackway 21 and slide bars 28")).toBeDefined();
    expect(
      model.root.getObjectByName("Carrier 22 with vertical column 23 and portable controller 47"),
    ).toBeDefined();
    expect(model.root.getObjectByName("Vertical column 23 and Mz guide")).toBeDefined();
    expect(model.root.getObjectByName("Platform beam 35 and My rack reach")).toBeDefined();
    expect(
      model.root.getObjectByName("Controller-to-station coupling path 85/86/87"),
    ).toBeDefined();

    model.update(
      stepLemelsonAutomaticProductionTopology({
        carrierAddressFraction: 0.5,
        liftFraction: 0.5,
        reachFraction: 0.8,
        stationDetected: 1,
        stationCoupled: 1,
        cycleProgress: 0.6,
      }),
    );
    expect(
      model.root.getObjectByName("Controller-to-station coupling path 85/86/87")?.visible,
    ).toBe(true);
    model.update(
      stepLemelsonAutomaticProductionTopology({
        stationDetected: 1,
        stationCoupled: 0,
        cycleProgress: 0.6,
      }),
    );
    expect(
      model.root.getObjectByName("Controller-to-station coupling path 85/86/87")?.visible,
    ).toBe(false);
    expect(() => model.dispose()).not.toThrow();
  });

  test("closes the structural path from the factory datum through the rail and suspended carrier", () => {
    const model = buildLemelsonAutomaticProductionModel();
    model.update(stepLemelsonAutomaticProductionTopology({}));
    const foundation = object(model, "Factory floor datum (display context)");
    const rail = object(model, "Overhead monorail track 21");
    const carriage = object(model, "Overhead carriage 22 and Mx");
    const column = object(model, "Vertical column 23 and Mz guide");
    const controller = object(model, "Carrier-mounted cycle controller 47");
    const collar = object(model, "Mz lift collar 38 and platform 35");
    const beam = object(model, "Platform beam 35 and My rack reach");
    const platform = object(model, "Work fixture, contacts 86, and retaining device");
    const workPiece = object(model, "Work-in-process W");
    const contacts = object(model, "Carrier coupling contacts 86");

    for (const index of [1, 2]) {
      const support = object(model, `Track support frame ${index} (display context)`);
      expectContact(foundation, support);
      expectContact(support, rail);
      expectContact(carriage, object(model, `Carriage wheel 24 ${index}`));
    }
    expectContact(object(model, "Carriage wheel 24 1"), rail);
    expectContact(object(model, "Carriage wheel 24 2"), rail);
    expectContact(carriage, column);
    expectContact(carriage, controller);
    expectContact(column, collar);
    expectContact(collar, beam);
    expectContact(beam, platform);
    expectContact(platform, workPiece);
    expectContact(platform, contacts);

    model.dispose();
  });

  test("mounts power bars, station markers, contacts, clamps, and tools instead of floating them", () => {
    const model = buildLemelsonAutomaticProductionModel();
    model.update(stepLemelsonAutomaticProductionTopology({}));
    const rail = object(model, "Overhead monorail track 21");
    const foundation = object(model, "Factory floor datum (display context)");

    for (const barIndex of [1, 2]) {
      const bar = object(model, `Power slide bar 28 ${barIndex}`);
      for (let hangerIndex = 1; hangerIndex <= 5; hangerIndex += 1) {
        const vertical = object(model, `Slide-bar hanger ${barIndex}.${hangerIndex} vertical`);
        const railArm = object(model, `Slide-bar hanger ${barIndex}.${hangerIndex} rail arm`);
        expectContact(bar, vertical);
        expectContact(vertical, railArm);
        expectContact(railArm, rail);
      }
    }

    for (const stationIndex of [1, 2, 3]) {
      const plinth = object(model, `Work station ${stationIndex}`).children[0] as THREE.Object3D;
      const tool = object(model, `Machine tool MT ${stationIndex}`);
      const fixture = object(model, `Station work fixture ${stationIndex}`);
      const marker = object(model, `Marker 61 / station sensing event ${stationIndex}`);
      const markerStem = object(model, `Marker 61 mounting stem ${stationIndex}`);
      const stationContacts = object(model, `Fixed contacts 87 ${stationIndex}`);
      const interfaceSupport = object(model, `Station contact and clamp support ${stationIndex}`);
      const clamp = object(model, `Power-operated carrier retaining means ${stationIndex}`);

      expectContact(foundation, plinth);
      expectContact(plinth, tool);
      expectContact(tool, fixture);
      expectContact(fixture, interfaceSupport);
      expectContact(interfaceSupport, stationContacts);
      expectContact(interfaceSupport, clamp);
      expectContact(marker, markerStem);
      expectContact(markerStem, rail);
    }

    model.dispose();
  });

  test("maps the normalized guideway endpoints to the outer work stations without overshoot", () => {
    const model = buildLemelsonAutomaticProductionModel();
    const carrier = object(model, "Carrier 22 with vertical column 23 and portable controller 47");

    model.update(stepLemelsonAutomaticProductionTopology({ carrierAddressFraction: 0 }));
    expect(carrier.position.x).toBeCloseTo(-2.4, 7);

    model.update(stepLemelsonAutomaticProductionTopology({ carrierAddressFraction: 0.5 }));
    expect(carrier.position.x).toBeCloseTo(0, 7);

    model.update(stepLemelsonAutomaticProductionTopology({ carrierAddressFraction: 1 }));
    expect(carrier.position.x).toBeCloseTo(2.4, 7);

    model.dispose();
  });

  test("keeps both visual faces on the shared bus and declares the numerical boundary", () => {
    const modelSource = readFileSync(
      join(THREE_DIRECTORY, "lemelsonAutomaticProductionModel.ts"),
      "utf8",
    );
    const studioSource = readFileSync(
      join(THREE_DIRECTORY, "LemelsonAutomaticProduction3D.tsx"),
      "utf8",
    );
    const simSource = readFileSync(
      join(
        process.cwd(),
        "src",
        "components",
        "patents",
        "visuals",
        "LemelsonAutomaticProductionSim.tsx",
      ),
      "utf8",
    );

    expect(modelSource).toContain("no dimensions");
    expect(modelSource).toContain("Fixed contacts 87");
    expect(modelSource).not.toContain("useGLTF");
    expect(modelSource).not.toContain(".gltf");
    expect(modelSource).not.toContain(".glb");
    expect(modelSource).not.toContain("Math.random");
    expect(studioSource).toContain("createThreeStudioScene");
    expect(studioSource).toContain("usePatentPhysics");
    expect(studioSource).toContain("useFrankenSimPhysics");
    expect(studioSource).toContain("effectiveParams");
    expect(studioSource).toContain("claimConstraintStateParamId");
    expect(studioSource).toContain("isRefused: true");
    expect(studioSource).toContain("stepLemelsonAutomaticProductionTopology");
    expect(studioSource).not.toContain("Math.random");
    expect(studioSource).not.toContain("performance.now()");
    expect(simSource).toContain("usePatentPhysics");
    expect(simSource).toContain("Quantitative refusal");
  });

  test("publishes only normalized topology metrics and a source-bounded equation", () => {
    const registry = PATENT_PHYSICS_REGISTRY[PATENT_ID];
    const equations = ALL_COLORIZED_EQUATIONS[PATENT_ID];
    expect(registry.engineMethod).toContain("source-bounded topology");
    expect(JSON.stringify(registry)).not.toContain("mechanicalPowerWatts");
    expect(JSON.stringify(registry)).not.toContain("speedMps");
    expect(equations).toHaveLength(1);
    expect(equations[0]?.rawLatex).toContain("m_{recognized}");
    expect(JSON.stringify(equations)).not.toContain("claimRef");
  });
});
