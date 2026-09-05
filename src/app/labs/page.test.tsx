import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import LabsPage, { metadata } from "./page";

describe("LabsPage route", () => {
  test("defines comprehensive metadata for search engines and social cards", () => {
    expect(metadata.title).toBe("Coupled Teaching Laboratories — Classic Patents");
    expect(metadata.description).toContain("port-Hamiltonian energy conservation");
  });

  test("renders static page layout and CoupledTeachingLabs simulator", () => {
    const html = renderToStaticMarkup(<LabsPage />);
    expect(html).toContain("Coupled Teaching Laboratories");
    expect(html).toContain("Multi-Patent Systems &amp; Port Networks");
    expect(html).toContain('data-testid="coupled-teaching-labs"');
    expect(html).toContain("fs-couple · Multi-Patent V2");
  });
});
