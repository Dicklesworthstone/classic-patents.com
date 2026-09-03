import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const THREE_DIRECTORY = join(process.cwd(), "src", "components", "patents", "visuals", "three");

describe("Three.js transport updater lifecycle", () => {
  test("all public updater effects retain their identity-safe disposer", () => {
    const updaterSources = readdirSync(THREE_DIRECTORY)
      .filter((file) => file.endsWith(".tsx") && !file.includes(".test."))
      .map((file) => [file, readFileSync(join(THREE_DIRECTORY, file), "utf8")] as const)
      .filter(([, source]) => source.includes("globalTransportBus.registerUpdater"));

    expect(updaterSources.length).toBeGreaterThan(0);
    for (const [file, source] of updaterSources) {
      expect(source, `${file} bypasses registerUpdater's guarded disposer`).not.toMatch(
        /globalTransportBus\.registerUpdater\([\s\S]{0,900}return \(\) => globalTransportBus\.unregisterUpdater\(/,
      );
    }
  });

  test("long-lived updater effects do not re-register on live ref current values", () => {
    const updaterSources = readdirSync(THREE_DIRECTORY)
      .filter((file) => file.endsWith(".tsx") && !file.includes(".test."))
      .map((file) => [file, readFileSync(join(THREE_DIRECTORY, file), "utf8")] as const)
      .filter(([, source]) => source.includes("globalTransportBus.registerUpdater"));

    for (const [file, source] of updaterSources) {
      const dependencyLists = Array.from(
        source.matchAll(
          /globalTransportBus\.registerUpdater\([\s\S]{0,1400}?\},\s*\[([\s\S]{0,400}?)\]\);/g,
        ),
        (match) => match[1],
      );
      expect(
        dependencyLists.length,
        `${file} has an unrecognized updater effect shape`,
      ).toBeGreaterThan(0);
      for (const dependencies of dependencyLists) {
        expect(
          dependencies,
          `${file} re-registers its updater when a live ref changes`,
        ).not.toContain("live.current");
      }
    }
  });
});
