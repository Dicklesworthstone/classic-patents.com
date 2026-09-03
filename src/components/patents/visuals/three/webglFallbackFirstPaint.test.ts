import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();

const WEBGL_FALLBACK_STUDIOS = ["AMFVersatran3D.tsx", "ClavelDeltaRobot3D.tsx"] as const;

describe("WebGL fallback first-paint boundary", () => {
  test("creates each fallback-capable studio in a layout effect", () => {
    for (const fileName of WEBGL_FALLBACK_STUDIOS) {
      const source = readFileSync(
        join(ROOT, "src", "components", "patents", "visuals", "three", fileName),
        "utf8",
      );
      const layoutEffectStart = source.indexOf("useLayoutEffect(() => {");
      const layoutEffectEnd = source.indexOf("\n  }, []);", layoutEffectStart);
      const mountedStudio = source.slice(layoutEffectStart, layoutEffectEnd);

      expect(layoutEffectStart).toBeGreaterThan(0);
      expect(layoutEffectEnd).toBeGreaterThan(layoutEffectStart);
      expect(mountedStudio).toContain("createThreeStudioScene");
      expect(mountedStudio).toContain("setWebglUnavailable(true)");
    }
  });
});
