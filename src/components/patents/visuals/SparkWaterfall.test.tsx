import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { SparkWaterfall } from "./SparkWaterfall";

describe("SparkWaterfall Component", () => {
  test("renders HTML5 canvas element with appropriate responsive styling", () => {
    const html = renderToStaticMarkup(
      <SparkWaterfall fundamentalHz={1000} energy={0.8} firing={true} className="w-full h-48" />,
    );

    expect(html).toContain("<canvas");
    expect(html).toContain("w-full h-48");
  });

  test("keeps its canvas timeline and frame loop mounted across live control updates", () => {
    const source = readFileSync(
      join(process.cwd(), "src", "components", "patents", "visuals", "SparkWaterfall.tsx"),
      "utf8",
    );
    const drawLoop = source.slice(source.indexOf("const draw ="), source.indexOf("const f0Khz"));

    expect(source).toContain('import { useLiveSimParams } from "./three/useLiveSimParams";');
    expect(source).toContain("const live = useLiveSimParams({ fundamentalHz, energy, firing });");
    expect(source).toContain("const [rows] = useState(() => Array.from({ length: ROWS }");
    expect(drawLoop).toContain("live.current");
    expect(source).toContain("}, [live, onscreenRef, rows]);");
    expect(source).not.toContain("}, [energy, firing, fundamentalHz, onscreenRef]);");
  });
});
