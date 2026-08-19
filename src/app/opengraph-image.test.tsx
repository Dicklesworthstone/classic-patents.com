import { describe, expect, test } from "bun:test";
import Image, { alt, contentType, size } from "./opengraph-image";

describe("Root OpenGraph Image Generator", () => {
  test("exports standard 1200x630 dimensions and png content type", () => {
    expect(size.width).toBe(1200);
    expect(size.height).toBe(630);
    expect(contentType).toBe("image/png");
    expect(alt).toContain("Classic Patents");
  });

  test("generates valid ImageResponse instance", async () => {
    const res = await Image();
    expect(res).toBeDefined();
    expect(res.headers.get("content-type")).toContain("image/png");
  });
});
