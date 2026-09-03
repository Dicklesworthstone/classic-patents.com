import { expect, test } from "bun:test";
import {
  buildTeslaTeleautomatonModel,
  updateTeslaTeleautomatonKinematics,
} from "./teslaTeleautomatonModel";

test("Tesla teleautomaton keeps its hull fixed without a modeled sea-state input", () => {
  const model = buildTeslaTeleautomatonModel();
  const initialPosition = model.nodes.hullGroup.position.clone();
  const initialRotation = model.nodes.hullGroup.rotation.clone();

  updateTeslaTeleautomatonKinematics(model.nodes, model.materials, 1 / 60, 0, 0, 0, false, false);
  updateTeslaTeleautomatonKinematics(model.nodes, model.materials, 1 / 60, 7.5, 0, 0, false, false);

  expect(model.nodes.hullGroup.position.toArray()).toEqual(initialPosition.toArray());
  expect(model.nodes.hullGroup.rotation.toArray()).toEqual(initialRotation.toArray());
  expect(() => model.dispose()).not.toThrow();
});
