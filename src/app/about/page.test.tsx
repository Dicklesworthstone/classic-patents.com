import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import AboutPage from "./page";

describe("AboutPage component", () => {
  test("renders mission header, core principles, dual-projection diptych explanation, and open-source archive", () => {
    const html = renderToStaticMarkup(<AboutPage />);

    expect(html).toContain("Mission &amp; Philosophy");
    expect(html).toContain("Restoring History&#x27;s Technical Masterpieces");
    expect(html).toContain("The Dilemma of Historical Patents");
    expect(html).toContain("The Dual-Projection (Diptych) Architecture");
    expect(html).toContain("Pedagogical Physical Simulations");
    expect(html).toContain("Open Source Digital Museum");
    expect(html).toContain("Return to Museum Catalog");
  });
});
