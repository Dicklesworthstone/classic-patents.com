import { describe, expect, test } from "bun:test";
import { specClausesFor } from "@/physics/specClauses";
import { PATENT_PHYSICS_REGISTRY } from "@/physics/telemetryData";
import { fidelityField, intervalGhosts } from "@/physics/weaveSurfaces";

const NEWER_PATENT_IDS = [
  "gb-913-watt-separate-condenser",
  "gb-931-arkwright-water-frame",
  "gb-1306-watt-rotary-engine",
  "gb-1420-cort-puddling-rolling",
  "us-x1-hopkins-potash",
  "us-3237-rillieux-evaporator",
  "us-48475-yale-lock",
  "us-235199-bell-photophone",
  "us-307031-edison-indicator",
  "us-400766-hall-aluminium",
  "us-2543181-land-polaroid",
  "us-2929922-townes-laser",
  "us-3138743-kilby-integrated-circuit",
  "us-3353115-maiman-ruby-laser",
  "us-682690-hewitt-mercury-lamp",
  "us-706737-fessenden-wireless",
  "us-971501-haber-ammonia",
  "us-2297691-carlson-electrophotography",
  "us-6120588-eink",
  "us-6285999-pagerank",
  "us-6331181-davinci",
  "us-6594844-roomba",
  "us-7479949-multitouch",
];

const WRIGHT_EXCLUSIVE_CONTROLS = ["wingWarp", "elevator", "canardAngle", "warpAngle"];

describe("Newer Patents Visual & Telemetry Controls Verification", () => {
  for (const patentId of NEWER_PATENT_IDS) {
    describe(`Patent: ${patentId}`, () => {
      test("is registered in physics registry with authentic domain controls", () => {
        const entry = PATENT_PHYSICS_REGISTRY[patentId];
        expect(entry).toBeDefined();
        expect(entry.controls.length).toBeGreaterThan(0);

        // Verify none of the controls are Wright-specific
        for (const ctrl of entry.controls) {
          expect(WRIGHT_EXCLUSIVE_CONTROLS.includes(ctrl.id)).toBe(false);
          expect(ctrl.label.toLowerCase()).not.toContain("wing warp");
          expect(ctrl.label.toLowerCase()).not.toContain("kitty hawk");
        }
      });

      test("computes valid non-empty telemetry metrics", () => {
        const entry = PATENT_PHYSICS_REGISTRY[patentId];
        const initialParams: Record<string, number> = {};
        for (const ctrl of entry.controls) {
          initialParams[ctrl.id] = ctrl.defaultValue;
        }
        const metrics = entry.computeMetrics(initialParams);
        expect(metrics.length).toBeGreaterThan(0);
        for (const m of metrics) {
          expect(m.label).toBeDefined();
          expect(m.value).toBeDefined();
          expect(m.unit).toBeDefined();
        }
      });

      test("does not trigger Wright Flyer spec clauses or weave artifacts", () => {
        const clauses = specClausesFor(patentId, {});
        for (const c of clauses) {
          expect(c.phrase.toLowerCase()).not.toContain("wing warp");
          expect(c.phrase.toLowerCase()).not.toContain("aeroplane");
          expect(c.phrase.toLowerCase()).not.toContain("kitty hawk");
        }

        const ghosts = intervalGhosts(patentId, {});
        for (const g of ghosts) {
          expect(g.label.toLowerCase()).not.toContain("wing warp");
          expect(g.label.toLowerCase()).not.toContain("kitty hawk");
        }

        const fidelity = fidelityField(patentId, {});
        if (fidelity) {
          expect(fidelity.part.toLowerCase()).not.toContain("kitty hawk");
        }
      });
    });
  }
});
