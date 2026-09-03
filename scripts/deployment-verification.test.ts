import { describe, expect, test } from "bun:test";
import * as fs from "node:fs";
import { LEGACY_PATENT_REDIRECTS } from "../src/data/patents";
import {
  assertCanonicalVercelProject,
  assertDeploymentHasRequiredAliases,
  CANONICAL_PUBLIC_HOSTNAMES,
  CANONICAL_VERCEL_ORG_ID,
  CANONICAL_VERCEL_PROJECT_ID,
  CANONICAL_VERCEL_PROJECT_NAME,
  FORBIDDEN_AUDIT_HOLD_STRINGS,
  getNonRedirectPatentIds,
  parseAndValidateVercelProjectConfig,
} from "./deployment-verification";

describe("deployment verification contract", () => {
  describe("parseAndValidateVercelProjectConfig", () => {
    test("accepts canonical Vercel project configuration", () => {
      const validConfig = JSON.stringify({
        projectId: CANONICAL_VERCEL_PROJECT_ID,
        orgId: CANONICAL_VERCEL_ORG_ID,
        projectName: CANONICAL_VERCEL_PROJECT_NAME,
      });
      const parsed = parseAndValidateVercelProjectConfig(validConfig);
      expect(parsed.projectId).toBe(CANONICAL_VERCEL_PROJECT_ID);
      expect(parsed.orgId).toBe(CANONICAL_VERCEL_ORG_ID);
      expect(parsed.projectName).toBe(CANONICAL_VERCEL_PROJECT_NAME);
    });

    test("strictly rejects duplicate project name classic-patents.com", () => {
      const invalidDuplicateProject = JSON.stringify({
        projectId: "prj_duplicate_12345",
        orgId: CANONICAL_VERCEL_ORG_ID,
        projectName: "classic-patents.com",
      });
      expect(() => parseAndValidateVercelProjectConfig(invalidDuplicateProject)).toThrow(
        /Duplicate projects \(such as 'classic-patents.com'\) do not own the production domain/,
      );
    });

    test("strictly rejects non-canonical project ID", () => {
      const wrongId = JSON.stringify({
        projectId: "prj_wrong_id_9999",
        orgId: CANONICAL_VERCEL_ORG_ID,
        projectName: CANONICAL_VERCEL_PROJECT_NAME,
      });
      expect(() => parseAndValidateVercelProjectConfig(wrongId)).toThrow(
        /Incorrect Vercel projectId/,
      );
    });

    test("strictly rejects non-canonical org ID", () => {
      const wrongOrg = JSON.stringify({
        projectId: CANONICAL_VERCEL_PROJECT_ID,
        orgId: "team_wrong_org",
        projectName: CANONICAL_VERCEL_PROJECT_NAME,
      });
      expect(() => parseAndValidateVercelProjectConfig(wrongOrg)).toThrow(/Incorrect Vercel orgId/);
    });

    test("rejects malformed JSON or non-object content", () => {
      expect(() => parseAndValidateVercelProjectConfig("invalid json")).toThrow(/Invalid JSON/);
      expect(() => parseAndValidateVercelProjectConfig('"just a string"')).toThrow(
        /must be a JSON object/,
      );
    });
  });

  describe("assertCanonicalVercelProject", () => {
    test("validates local workspace .vercel/project.json", () => {
      const config = assertCanonicalVercelProject();
      expect(config.projectName).toBe(CANONICAL_VERCEL_PROJECT_NAME);
      expect(config.projectId).toBe(CANONICAL_VERCEL_PROJECT_ID);
      expect(config.orgId).toBe(CANONICAL_VERCEL_ORG_ID);
    });

    test("throws error if custom path does not exist", () => {
      expect(() => assertCanonicalVercelProject("/tmp/non-existent-project.json")).toThrow(
        /Missing \.vercel\/project\.json/,
      );
    });
  });

  describe("assertDeploymentHasRequiredAliases", () => {
    test("accepts aliases that include canonical production domains", () => {
      const aliases = [
        "https://classic-patents.com",
        "https://www.classic-patents.com",
        "classic-patents-xyz.vercel.app",
      ];
      expect(() =>
        assertDeploymentHasRequiredAliases(aliases, CANONICAL_PUBLIC_HOSTNAMES),
      ).not.toThrow();
    });

    test("fails when deployment only has a temporary vercel.app alias", () => {
      const temporaryOnly = ["classic-patents-xyz-git-main.vercel.app"];
      expect(() =>
        assertDeploymentHasRequiredAliases(temporaryOnly, CANONICAL_PUBLIC_HOSTNAMES),
      ).toThrow(/Deployment does not possess required domain aliases/);
    });

    test("fails when www subdomain alias is missing", () => {
      const missingWww = ["classic-patents.com", "classic-patents.vercel.app"];
      expect(() =>
        assertDeploymentHasRequiredAliases(missingWww, CANONICAL_PUBLIC_HOSTNAMES),
      ).toThrow(/Deployment does not possess required domain aliases/);
    });
  });

  describe("getNonRedirectPatentIds", () => {
    test("returns 103 canonical non-redirect patent records", () => {
      const ids = getNonRedirectPatentIds();
      expect(ids.length).toBe(103);
      expect(ids).toContain("us-821393-wright-flyer");
      expect(ids).toContain("us-381968-tesla-motor");
      expect(ids).toContain("us-5701965-kamen-transporter");
    });

    test("excludes all legacy redirect shorthand keys", () => {
      const ids = getNonRedirectPatentIds();
      const redirectKeys = Object.keys(LEGACY_PATENT_REDIRECTS);
      for (const legacyKey of redirectKeys) {
        expect(ids).not.toContain(legacyKey);
      }
    });
  });

  describe("structured JSONL log contract", () => {
    test("writes valid bounded JSONL entries for sweep results", () => {
      const sampleResult = {
        schema: "classic-patents.source-reader-sweep.v1",
        timestamp: new Date().toISOString(),
        route: "/patents/us-821393-wright-flyer?view=original-spec",
        patentId: "us-821393-wright-flyer",
        status: "pass",
        deliveryMode: "edition",
        durationMs: 345,
        consoleErrors: [],
        pageErrors: [],
      };

      const jsonLine = `${JSON.stringify(sampleResult)}\n`;
      const parsed = JSON.parse(jsonLine.trim());

      expect(parsed.schema).toBe("classic-patents.source-reader-sweep.v1");
      expect(parsed.patentId).toBe("us-821393-wright-flyer");
      expect(parsed.status).toBe("pass");
      expect(parsed.deliveryMode).toBe("edition");
      expect(parsed.durationMs).toBe(345);
    });
  });

  describe("prohibited audit hold phrases", () => {
    test("contains all required audit hold and withheld notice phrases", () => {
      expect(FORBIDDEN_AUDIT_HOLD_STRINGS).toContain(
        "Complete archival edition is not published yet",
      );
      expect(FORBIDDEN_AUDIT_HOLD_STRINGS).toContain("AUDIT_FIGURE_ACCEPTANCE_PENDING");
      expect(FORBIDDEN_AUDIT_HOLD_STRINGS).toContain("source-text-excerpt");
      expect(FORBIDDEN_AUDIT_HOLD_STRINGS).toContain("source-withheld-banner");
      expect(FORBIDDEN_AUDIT_HOLD_STRINGS).toContain("Archival Edition Held");
      expect(FORBIDDEN_AUDIT_HOLD_STRINGS).toContain(
        "The held preview set requires complete source-crop acceptance",
      );
    });
  });
});
