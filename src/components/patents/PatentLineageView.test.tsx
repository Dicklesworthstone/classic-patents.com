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

import { PatentLineageView } from "./PatentLineageView";

describe("PatentLineageView component", () => {
  test("renders default lineage view with title, steps, and years", () => {
    const html = renderToStaticMarkup(<PatentLineageView />);

    expect(html).toContain('data-testid="patent-lineage-view"');
    expect(html).toContain("Technological Lineage &amp; Descent");
    expect(html).toContain("The Evolution of Motive Power");
    expect(html).toContain("1769");
    expect(html).toContain("Foundational Origin");
    expect(html).toContain("Watt");
  });

  test("highlights current patent when currentPatentId is provided", () => {
    const html = renderToStaticMarkup(
      <PatentLineageView currentPatentId="us-821393-wright-flyer" />,
    );

    expect(html).toContain("Atmospheric &amp; Exoatmospheric Flight");
    expect(html).toContain("This Patent");
    expect(html).toContain("Wright Flyer");
    expect(html).toContain("US 821,393");
    expect(html).toContain("1899");
    expect(html).toContain("1914");
    expect(html).toContain("1943");
  });
});
