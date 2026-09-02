import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { ClaimConstraintToggle } from "./ClaimConstraintToggle";

describe("ClaimConstraintToggle", () => {
  test("exposes the registered probe count and active patent-mode control", () => {
    const html = renderToStaticMarkup(
      <ClaimConstraintToggle
        patentId="us-821393-wright-flyer"
        claimStates={{ 1: true }}
        onToggleClaim={() => undefined}
      />,
    );

    expect(html).toContain('data-testid="claim-constraint-toggle"');
    expect(html).toContain('data-claim-constraint-count="1"');
    expect(html).toContain('data-claim-number="1"');
    expect(html).toContain('data-claim-active="true"');
    expect(html).toContain("Claim 1: Active (Patent Mode)");
  });

  test("renders nothing when the catalogue has no registered claim probe", () => {
    const html = renderToStaticMarkup(
      <ClaimConstraintToggle
        patentId="us-not-registered"
        claimStates={{}}
        onToggleClaim={() => undefined}
      />,
    );

    expect(html).toBe("");
  });
});
