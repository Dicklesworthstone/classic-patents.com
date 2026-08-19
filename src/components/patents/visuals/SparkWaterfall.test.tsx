import { describe, expect, test } from "bun:test";
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
});
