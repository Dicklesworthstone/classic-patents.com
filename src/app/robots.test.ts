import { describe, expect, test } from "bun:test";
import robots from "./robots";

describe("robots.txt configuration", () => {
  test("generates valid robots policy allowing root indexing and specifying sitemap URL", () => {
    const config = robots();
    expect(config).toBeDefined();
    expect(config.rules).toBeDefined();

    const rules = Array.isArray(config.rules) ? config.rules[0] : config.rules;
    expect(rules.userAgent).toBe("*");
    expect(rules.allow).toBe("/");
    expect(config.sitemap).toBe("https://classic-patents.com/sitemap.xml");
  });
});
