import { describe, expect, test } from "bun:test";
import Image, { contentType, size } from "./twitter-image";

describe("Patent Detail Twitter Image Generator", () => {
  test("exports standard Twitter image dimensions and png content type", () => {
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
