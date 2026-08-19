import { describe, expect, test } from "bun:test";
import robots from "./robots";
import sitemap from "./sitemap";

describe("Metadata Routes (sitemap.ts & robots.ts)", () => {
  test("sitemap generates entries for all 54 classic patents and core landing pages", () => {
    const map = sitemap();
    expect(map.length).toBe(57); // 3 static routes + 54 patent routes

    const urls = map.map((entry) => entry.url);
    expect(urls).toContain("https://classic-patents.com");
    expect(urls).toContain("https://classic-patents.com/timeline");
    expect(urls).toContain("https://classic-patents.com/about");
    expect(urls).toContain("https://classic-patents.com/patents/us-821393-wright-flyer");
    expect(urls).toContain("https://classic-patents.com/patents/us-381968-tesla-motor");
  });

  test("robots configuration allows crawling and provides valid sitemap URL", () => {
    const conf = robots();
    expect(conf.sitemap).toBe("https://classic-patents.com/sitemap.xml");
    expect(conf.rules).toBeDefined();
  });
});
