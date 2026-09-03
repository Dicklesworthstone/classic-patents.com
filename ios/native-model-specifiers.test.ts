import { describe, expect, it } from "bun:test";
import { nativeModelSpecifiers } from "./native-model-specifiers";

describe("nativeModelSpecifiers", () => {
  it("accepts both local and current aliased model imports", () => {
    expect(
      nativeModelSpecifiers(`
        import { buildOldModel } from "./OldModel";
        import { buildZipperModel } from "@/components/patents/visuals/three/sundbackZipperModel";
        import { helper } from "@/components/patents/visuals/three/ThreeStudioScene";
      `),
    ).toEqual(["./OldModel", "./sundbackZipperModel"]);
  });

  it("normalizes extensions and removes duplicate imports", () => {
    expect(
      nativeModelSpecifiers(`
        import { build } from "./WrightAirframe.ts";
        import { build as buildAgain } from './WrightAirframe';
      `),
    ).toEqual(["./WrightAirframe"]);
  });
});
