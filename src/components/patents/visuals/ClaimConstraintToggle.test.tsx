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
    expect(html).toContain('aria-pressed="true"');
    expect(html).toContain("min-h-11");
    expect(html).toContain("focus-visible:outline-cyan-300");
    expect(html).toContain("Claim 1: Active (Patent Mode)");
  });

  test("describes an inverted constraint without an unconditional motion effect", () => {
    const html = renderToStaticMarkup(
      <ClaimConstraintToggle
        patentId="us-821393-wright-flyer"
        claimStates={{ 1: false }}
        onToggleClaim={() => undefined}
      />,
    );

    expect(html).toContain('data-claim-active="false"');
    expect(html).toContain('aria-pressed="false"');
    expect(html).toContain("Constraint Inverted");
    expect(html).toContain("motion-safe:animate-pulse");
  });

  test("disables a probe that has no state-change handler", () => {
    const html = renderToStaticMarkup(
      <ClaimConstraintToggle patentId="us-821393-wright-flyer" claimStates={{ 1: true }} />,
    );

    expect(html).toContain("disabled");
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
