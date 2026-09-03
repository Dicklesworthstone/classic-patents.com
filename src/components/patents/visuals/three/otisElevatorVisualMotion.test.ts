import { expect, test } from "bun:test";
import { stepOtisElevator } from "@/physics/machineKernels";
import { buildOtisElevatorModel, updateOtisElevatorKinematics } from "./otisElevatorModel";

test("Otis elevator consumes static safety state and keeps cutaway separate from pawls", () => {
  const model = buildOtisElevatorModel();
  const suspended = stepOtisElevator({ cabPayloadKg: 650, cableTensionPct: 100 });

  updateOtisElevatorKinematics(
    model.nodes,
    model.materials,
    1,
    suspended.isSnapped,
    suspended.springBowY,
    suspended.isPawlEngaged,
    true,
    650,
    100,
  );
  const supportedCabY = model.nodes.cabGroup.position.y;
  const supportedSheaveAngle = model.nodes.crownSheave.rotation.z;
  expect(model.nodes.leftPawlGroup.rotation.z).toBe(suspended.pawlDisengagedRotZ);
  expect(model.nodes.cabRailings.visible).toBe(false);

  updateOtisElevatorKinematics(
    model.nodes,
    model.materials,
    1,
    suspended.isSnapped,
    suspended.springBowY,
    suspended.isPawlEngaged,
    true,
    650,
    100,
  );
  expect(model.nodes.cabGroup.position.y).toBe(supportedCabY);
  expect(model.nodes.crownSheave.rotation.z).toBe(supportedSheaveAngle);

  const snapped = stepOtisElevator({ cabPayloadKg: 650, cableTensionPct: 0 });
  updateOtisElevatorKinematics(
    model.nodes,
    model.materials,
    1,
    snapped.isSnapped,
    snapped.springBowY,
    snapped.isPawlEngaged,
    false,
    650,
    0,
  );
  expect(model.nodes.cabGroup.position.y).toBe(snapped.cabCaughtY);
  expect(model.nodes.leftPawlGroup.rotation.z).toBe(0);
  expect(model.nodes.cabRailings.visible).toBe(true);
  expect(() => model.dispose()).not.toThrow();
});
