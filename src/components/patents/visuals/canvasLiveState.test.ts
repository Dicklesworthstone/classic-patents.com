import { describe, expect, test } from "bun:test";

const CANVAS_LOOP_CONTRACTS = [
  { file: "HewittMercuryLampSim.tsx", phaseRef: "animationTimeRef" },
  { file: "KilbyIntegratedCircuitSim.tsx", phaseRef: "animationTimeRef" },
  { file: "LandPolaroidSim.tsx", phaseRef: "animationTimeRef" },
  { file: "TownesLaserSim.tsx", phaseRef: "wavePhaseRef" },
];

describe("2D canvas live-state loops", () => {
  for (const { file, phaseRef } of CANVAS_LOOP_CONTRACTS) {
    test(`${file} keeps its phase while rendering the latest simulation snapshot`, async () => {
      const source = await Bun.file(new URL(`./${file}`, import.meta.url)).text();
      const renderStart = source.indexOf("const render = () =>");
      const renderLoop = source.slice(
        renderStart,
        source.indexOf("}, [live, onscreenRef]);", renderStart),
      );

      expect(source).toContain('import { useLiveSimParams } from "./three/useLiveSimParams";');
      expect(source).toContain("const live = useLiveSimParams(");
      expect(source).toContain(`const ${phaseRef} = useRef(0);`);
      expect(renderLoop).toContain(`${phaseRef}.current +=`);
      expect(renderLoop).toContain("live.current");
      expect(source).toContain("}, [live, onscreenRef]);");
      expect(source).not.toContain("onscreenRef.current]");
    });
  }
});
