import { describe, expect, test } from "bun:test";
import * as path from "node:path";
import { allPatents } from "../src/data/patents";
import {
  assertCanonicalProjectIdentity,
  assertDeploymentReadyAndAliased,
  buildPatentSourceRouteManifest,
  CANONICAL_PRODUCTION_PROJECT,
  FORBIDDEN_AUDIT_HOLD_STRINGS,
  parseDeploymentInspect,
} from "./deployment-target";

describe("deployment-target canonical project identity", () => {
  test("validates canonical project identity from active workspace configuration", () => {
    const config = assertCanonicalProjectIdentity();
    expect(config.projectId).toBe(CANONICAL_PRODUCTION_PROJECT.projectId);
    expect(config.projectName).toBe(CANONICAL_PRODUCTION_PROJECT.projectName);
    expect(config.orgId).toBe(CANONICAL_PRODUCTION_PROJECT.orgId);
  });

  test("rejects missing configuration file with actionable message", () => {
    expect(() => assertCanonicalProjectIdentity("/nonexistent/path/project.json")).toThrow(
      /does not exist/,
    );
  });

  test("rejects configuration linked to a mismatched project", () => {
    const wrongFile = path.join(import.meta.dir, "fixtures/deployment-target/wrong-project.json");
    expect(() => assertCanonicalProjectIdentity(wrongFile)).toThrow(
      /Deployment target mismatch.*classic-patents/,
    );
  });

  test("rejects corrupt JSON project file", () => {
    const corruptFile = path.join(
      import.meta.dir,
      "fixtures/deployment-target/corrupt-project.txt",
    );
    expect(() => assertCanonicalProjectIdentity(corruptFile)).toThrow(/invalid JSON/);
  });
});

describe("deployment inspect parsing & alias verification", () => {
  const SAMPLE_READY_INSPECT = `
Vercel CLI 59.10.0 (Node.js 25.9.0)
Fetching deployment "classic-patents.com" in dicklesworthstones-projects
> Fetched deployment "classic-patents-5yxsj0n8j-dicklesworthstones-projects.vercel.app" in dicklesworthstones-projects [340ms]

  General

    id		dpl_Gu19xujsrTgywGbTvsReLzm64DQE
    name	classic-patents
    target	production
    status	● Ready
    url		https://classic-patents-5yxsj0n8j-dicklesworthstones-projects.vercel.app
    created	Thu Sep 03 2026 19:20:59 GMT-0400 (Eastern Daylight Time)

  Aliases

    ╶ https://classic-patents-dicklesworthstones-projects.vercel.app
    ╶ https://classic-patents.com
    ╶ https://www.classic-patents.com
    ╶ https://classic-patents.vercel.app

  Builds
`;

  const SAMPLE_PREVIEW_ONLY_INSPECT = `
Vercel CLI 59.10.0 (Node.js 25.9.0)
Fetching deployment "classic-patents-5yxsj0n8j" in dicklesworthstones-projects

  General

    id		dpl_Gu19xujsrTgywGbTvsReLzm64DQE
    name	classic-patents
    target	production
    status	● Ready
    url		https://classic-patents-5yxsj0n8j-dicklesworthstones-projects.vercel.app
    created	Thu Sep 03 2026 19:20:59 GMT-0400 (Eastern Daylight Time)

  Aliases

    ╶ https://classic-patents-dicklesworthstones-projects.vercel.app
`;

  const SAMPLE_BUILDING_INSPECT = `
  General

    id		dpl_Gu19xujsrTgywGbTvsReLzm64DQE
    name	classic-patents
    target	production
    status	● Building
    url		https://classic-patents-5yxsj0n8j-dicklesworthstones-projects.vercel.app
`;

  test("parses deployment inspect text correctly", () => {
    const parsed = parseDeploymentInspect(SAMPLE_READY_INSPECT);
    expect(parsed.id).toBe("dpl_Gu19xujsrTgywGbTvsReLzm64DQE");
    expect(parsed.name).toBe("classic-patents");
    expect(parsed.target).toBe("production");
    expect(parsed.status).toContain("Ready");
    expect(parsed.url).toBe("classic-patents-5yxsj0n8j-dicklesworthstones-projects.vercel.app");
    expect(parsed.aliases).toContain("classic-patents.com");
    expect(parsed.aliases).toContain("www.classic-patents.com");
  });

  test("accepts ready deployment with all required custom domain aliases", () => {
    const verified = assertDeploymentReadyAndAliased(SAMPLE_READY_INSPECT, [
      "classic-patents.com",
      "www.classic-patents.com",
    ]);
    expect(verified.id).toBe("dpl_Gu19xujsrTgywGbTvsReLzm64DQE");
  });

  test("fails closed when deployment is Ready but missing custom domain aliases", () => {
    expect(() =>
      assertDeploymentReadyAndAliased(SAMPLE_PREVIEW_ONLY_INSPECT, [
        "classic-patents.com",
        "www.classic-patents.com",
      ]),
    ).toThrow(/missing required production alias/);
  });

  test("fails closed when deployment is not in Ready state", () => {
    expect(() =>
      assertDeploymentReadyAndAliased(SAMPLE_BUILDING_INSPECT, ["classic-patents.com"]),
    ).toThrow(/not Ready/);
  });
});

describe("patent source route manifest", () => {
  test("generates route entries for all catalogue patents", () => {
    const manifest = buildPatentSourceRouteManifest(allPatents);
    expect(manifest.length).toBe(allPatents.length);
    expect(manifest.length).toBe(103);

    for (const entry of manifest) {
      expect(entry.patentId).toMatch(/^(?:us|gb)-/);
      expect(entry.route).toBe(`/patents/${entry.patentId}`);
      expect(entry.specUrl).toBe(`/patents/${entry.patentId}?view=original-spec`);
      expect(["edition", "transcript", "facsimile"]).toContain(entry.expectedDeliveryMode);
    }
  });

  test("derives expected delivery mode partition without missing or partial excerpt", () => {
    const manifest = buildPatentSourceRouteManifest(allPatents);
    const editionCount = manifest.filter((m) => m.expectedDeliveryMode === "edition").length;
    const transcriptCount = manifest.filter((m) => m.expectedDeliveryMode === "transcript").length;
    const facsimileCount = manifest.filter((m) => m.expectedDeliveryMode === "facsimile").length;

    expect(editionCount).toBe(89);
    expect(transcriptCount).toBe(14);
    expect(facsimileCount).toBe(0);
    expect(editionCount + transcriptCount + facsimileCount).toBe(103);
  });

  test("includes critical forbidden hold strings", () => {
    expect(FORBIDDEN_AUDIT_HOLD_STRINGS).toContain(
      "Complete archival edition is not published yet",
    );
    expect(FORBIDDEN_AUDIT_HOLD_STRINGS).toContain("AUDIT_FIGURE_ACCEPTANCE_PENDING");
    expect(FORBIDDEN_AUDIT_HOLD_STRINGS).toContain("source-text-excerpt");
  });
});
