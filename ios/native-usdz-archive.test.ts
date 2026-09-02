import { describe, expect, it } from "bun:test";
import { strToU8, zipSync } from "fflate";
import {
  canonicalizeUSDZArchive,
  usdzArchivesHaveEqualContent,
  usdzArchivesHaveEquivalentPayload,
} from "./native-usdz-archive";

const archive = (content: string, mtime: Date) =>
  zipSync({ "model.usda": strToU8(content) }, { level: 0, mtime });

describe("USDZ archive canonicalization", () => {
  it("ignores exporter timestamps while preserving payload bytes", () => {
    const first = archive('def Xform "Robot" {}', new Date("2025-01-01T00:00:00Z"));
    const second = archive('def Xform "Robot" {}', new Date("2026-08-01T12:30:00Z"));

    expect(usdzArchivesHaveEqualContent(first, second)).toBe(true);
    expect(canonicalizeUSDZArchive(first)).toEqual(canonicalizeUSDZArchive(second));
  });

  it("does not hide changed geometry payloads", () => {
    const first = archive('def Xform "RobotA" {}', new Date("2025-01-01T00:00:00Z"));
    const second = archive('def Xform "RobotB" {}', new Date("2026-08-01T12:30:00Z"));

    expect(usdzArchivesHaveEqualContent(first, second)).toBe(false);
  });

  it("ignores Three.js process-global USD identifier renumbering", () => {
    const first = zipSync(
      {
        "model.usda": strToU8(
          `def Xform "Object_42" (\n  prepend references = @./geometries/Geometry_10.usda@</Geometry>\n)\n{ rel material:binding = </Materials/Material_99> }`,
        ),
        "geometries/Geometry_10.usda": strToU8(
          'def Mesh "Geometry" { point3f[] points = [(0, 0, 0)] }',
        ),
      },
      { level: 0, mtime: new Date("2025-01-01T00:00:00Z") },
    );
    const second = zipSync(
      {
        "model.usda": strToU8(
          `def Xform "Object_142" (\n  prepend references = @./geometries/Geometry_110.usda@</Geometry>\n)\n{ rel material:binding = </Materials/Material_199> }`,
        ),
        "geometries/Geometry_110.usda": strToU8(
          'def Mesh "Geometry" { point3f[] points = [(0, 0, 0)] }',
        ),
      },
      { level: 0, mtime: new Date("2026-08-01T12:30:00Z") },
    );

    expect(usdzArchivesHaveEqualContent(first, second)).toBe(false);
    expect(usdzArchivesHaveEquivalentPayload(first, second)).toBe(true);
  });

  it("does not hide authored transform changes behind identifier normalization", () => {
    const first = archive(
      'def Xform "Object_42" { matrix4d xformOp:transform = ((1, 0, 0, 0)) }',
      new Date("2025-01-01T00:00:00Z"),
    );
    const second = archive(
      'def Xform "Object_142" { matrix4d xformOp:transform = ((2, 0, 0, 0)) }',
      new Date("2026-08-01T12:30:00Z"),
    );

    expect(usdzArchivesHaveEquivalentPayload(first, second)).toBe(false);
  });

  it("never mutates Buffer-backed caller archives during semantic comparison", () => {
    const first = Buffer.from(
      archive(
        'def Xform "Object_42" { rel material:binding = </Materials/Material_99> }',
        new Date("2025-01-01T00:00:00Z"),
      ),
    );
    const second = Buffer.from(
      archive(
        'def Xform "Object_142" { rel material:binding = </Materials/Material_199> }',
        new Date("2026-08-01T12:30:00Z"),
      ),
    );
    const firstBefore = Uint8Array.from(first);
    const secondBefore = Uint8Array.from(second);

    expect(usdzArchivesHaveEquivalentPayload(first, second)).toBe(true);
    expect(first).toEqual(firstBefore);
    expect(second).toEqual(secondBefore);
  });
});
