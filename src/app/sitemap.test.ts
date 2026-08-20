import { describe, expect, test } from "bun:test";
import { allPatents } from "@/data/patents";
import robots from "./robots";
import sitemap from "./sitemap";

describe("Metadata Routes (sitemap.ts & robots.ts)", () => {
  test("sitemap generates entries for all classic patents and core landing pages", () => {
    const map = sitemap();
    expect(map.length).toBe(allPatents.length + 3); // 3 static routes + all patent routes

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
