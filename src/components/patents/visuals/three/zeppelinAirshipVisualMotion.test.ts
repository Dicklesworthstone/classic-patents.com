import { expect, test } from "bun:test";
import { stepZeppelinAirship } from "@/physics/catalogKernels";
import { buildZeppelinAirshipModel, updateZeppelinAirshipKinematics } from "./zeppelinAirshipModel";

test("Zeppelin hull pose only follows modeled buoyancy and trim inputs", () => {
  const model = buildZeppelinAirshipModel();
  const telemetry = stepZeppelinAirship({
    gasInflation: 95,
    flightAlt: 300,
    flightSpeedKnots: 28,
    trimWeight: 3,
  });

  updateZeppelinAirshipKinematics(
    model.nodes,
    model.materials,
    1 / 60,
    telemetry.hullStudioY,
    telemetry.pitchTrimDeg,
    telemetry.propellerDisplayOmegaRadPerS,
    3,
    false,
  );
  const poseAtFirstStep = {
    y: model.nodes.hullGroup.position.y,
    pitch: model.nodes.hullGroup.rotation.z,
  };

  updateZeppelinAirshipKinematics(
    model.nodes,
    model.materials,
    1 / 60,
    telemetry.hullStudioY,
    telemetry.pitchTrimDeg,
    telemetry.propellerDisplayOmegaRadPerS,
    3,
    false,
  );

  expect(model.nodes.hullGroup.position.y).toBe(poseAtFirstStep.y);
  expect(model.nodes.hullGroup.rotation.z).toBe(poseAtFirstStep.pitch);
  expect(() => model.dispose()).not.toThrow();
});
