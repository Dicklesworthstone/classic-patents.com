import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const BRIDGED_STUDIOS = [
  ["LemelsonAdjustableManipulator3D.tsx", "liveParams", "effectiveParams"],
  ["LemelsonAutomaticProduction3D.tsx", "liveState", "state"],
  ["LemelsonMachineVision3D.tsx", "liveState", "state"],
  ["MakinoScara3D.tsx", "liveParams", "effectiveParams"],
  ["MilacronRobotToolchanger3D.tsx", "liveParams", "params"],
  ["RobotEndEffector3D.tsx", "liveParams", "effectiveParams"],
  ["SikorskyHelicopter3D.tsx", "liveParams", "claimResult.modifiedParams"],
] as const;

describe("Three.js React 19 live simulation parameter bridges", () => {
  test("uses a layout-effect bridge instead of render-time parameter ref writes", () => {
    const bridgeSource = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/three/useLiveSimParams.ts"),
      "utf8",
    );
    expect(bridgeSource).toContain("useLayoutEffect");

    for (const [fileName, refName, parameterName] of BRIDGED_STUDIOS) {
      const source = readFileSync(
        join(process.cwd(), "src/components/patents/visuals/three", fileName),
        "utf8",
      );

      expect(source).toContain('import { useLiveSimParams } from "./useLiveSimParams";');
      expect(source).toContain(`const ${refName} = useLiveSimParams(${parameterName});`);
      expect(source).not.toContain(`${refName}.current = ${parameterName};`);
    }
  });
});
