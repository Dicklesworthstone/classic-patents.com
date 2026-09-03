import { describe, expect, mock, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";

// Mock next/link
mock.module("next/link", () => ({
  default: ({ href, children, ...rest }: any) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

import { PatentTimeline } from "./PatentTimeline";

const TIMELINE_SOURCE = readFileSync(
  join(process.cwd(), "src/components/timeline/PatentTimeline.tsx"),
  "utf8",
);

describe("PatentTimeline component", () => {
  test("renders era filter tabs, timeline milestones, and initial patent feature card", () => {
    const html = renderToStaticMarkup(<PatentTimeline />);

    expect(html).toContain("All Milestones");
    expect(html).toContain("1769");
    expect(html).toContain("James Watt");
    expect(html).toContain("GB 913");
    expect(html).toContain("Explore Patent &amp; 3D Model");
    expect(html).toContain('data-testid="coupled-dynamics-strip"');
    expect(html).toContain("Coupled Transfer Dynamics · fs-couple");
    expect(html).toContain("separate condenser");
  });

  test("renders interactive timeline scrubber slider with accessible range attributes", () => {
    const html = renderToStaticMarkup(<PatentTimeline />);

    expect(html).toContain('data-testid="timeline-scrubber"');
    expect(html).toContain('aria-label="Timeline milestone scrubber"');
    expect(html).toContain('type="range"');
    expect(html).toContain("1836 (Colt)");
    expect(html).toContain("1906 (Wright)");
    expect(html).toContain("1947 (Transistor)");
  });

  test("does not advertise a 3D model for the source-held Kwolek record", () => {
    expect(TIMELINE_SOURCE).toContain('selectedPatent.id === "us-3671542-kwolek-kevlar"');
    expect(TIMELINE_SOURCE).toContain("Explore Source-Bound Record");
  });
});
