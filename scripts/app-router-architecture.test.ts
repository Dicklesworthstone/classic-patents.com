import { describe, expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { appRouterArchitectureError } from "./app-router-architecture";

describe("App Router architecture gate", () => {
  for (const contents of [[], [".keep"], ["types.d.ts"], ["index.tsx", "_app.tsx"]]) {
    test(`rejects a Pages Router directory containing ${JSON.stringify(contents)}`, () => {
      // An injected filesystem view, never a directory created in the repository.
      const paths = new Set([
        "/fixture/src/app",
        "/fixture/src/pages",
        ...contents.map((name) => `/fixture/src/pages/${name}`),
      ]);
      expect(appRouterArchitectureError("/fixture", (path) => paths.has(path))).toContain(
        "ARCHITECTURAL VIOLATION",
      );
    });
  }
  test("accepts App Router with no legacy directory", () => {
    const paths = new Set([
      "/fixture/src/app",
      "/fixture/src/app/page.tsx",
      "/fixture/src/app/opengraph-image.tsx",
    ]);
    expect(appRouterArchitectureError("/fixture", (path) => paths.has(path))).toBeNull();
  });
  test("the actual repository contains App Router and passes the real filesystem check", () => {
    const root = resolve(import.meta.dir, "..");
    expect(existsSync(resolve(root, "src/app/page.tsx"))).toBe(true);
    expect(appRouterArchitectureError(root)).toBeNull();
  });
});
