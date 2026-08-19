import { describe, expect, mock, test } from "bun:test";
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

describe("PatentTimeline component", () => {
  test("renders era filter tabs, timeline milestones, and initial patent feature card", () => {
    const html = renderToStaticMarkup(<PatentTimeline />);

    expect(html).toContain("All Milestones");
    expect(html).toContain("1794");
    expect(html).toContain("Eli Whitney");
    expect(html).toContain("US X72");
    expect(html).toContain("Explore Patent &amp; 3D Model");
  });
});
