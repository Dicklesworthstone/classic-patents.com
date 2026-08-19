import { describe, expect, test } from "bun:test";
import Image, { contentType, size } from "./opengraph-image";

describe("Patent Detail OpenGraph Image Generator", () => {
  test("exports standard 1200x630 dimensions and png content type", () => {
    expect(size.width).toBe(1200);
    expect(size.height).toBe(630);
    expect(contentType).toBe("image/png");
  });

  test("generates valid ImageResponse for a known patent", async () => {
    const res = await Image({
      params: Promise.resolve({ id: "us-821393-wright-flyer" }),
    });
    expect(res).toBeDefined();
    expect(res.headers.get("content-type")).toContain("image/png");
  }, 15000);

  test("handles unknown patent gracefully with fallback metadata", async () => {
    const res = await Image({
      params: Promise.resolve({ id: "non-existent-patent" }),
    });
    expect(res).toBeDefined();
    expect(res.headers.get("content-type")).toContain("image/png");
  }, 15000);
});
