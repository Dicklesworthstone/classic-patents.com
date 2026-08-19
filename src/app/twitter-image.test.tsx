import { describe, expect, test } from "bun:test";
import Image, { alt, contentType, size } from "./twitter-image";

describe("Root Twitter Image Generator", () => {
  test("exports standard Twitter image dimensions and png content type", () => {
    expect(size.width).toBe(1200);
    expect(size.height).toBe(600);
    expect(contentType).toBe("image/png");
    expect(alt).toContain("Classic Patents");
  });

  test("generates valid ImageResponse instance", () => {
    const res = Image();
    expect(res).toBeDefined();
    expect(res.headers.get("content-type")).toContain("image/png");
  });
});
