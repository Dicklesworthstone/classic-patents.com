import { describe, expect, mock, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

// Mock next/navigation
mock.module("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/patents/us-821393-wright-flyer",
  useRouter: () => ({ push: () => {}, replace: () => {} }),
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

import { wrightFlyerPatent } from "@/data/patents/wright-flyer";
import { DualProjectionViewer } from "./DualProjectionViewer";

describe("DualProjectionViewer component", () => {
  test("renders navigation projection tabs and default plain-English face", () => {
    const html = renderToStaticMarkup(
      <DualProjectionViewer patent={wrightFlyerPatent} initialView="plain-english" />,
    );

    expect(html).toContain("Plain English Face");
    expect(html).toContain("Original Patent Text");
    expect(html).toContain("Interactive 3D Simulator");
    expect(html).toContain("Schematic &amp; Pins");
    expect(html).toContain("Full Original PDF");
    expect(html).toContain("Dual Split-Screen");
    expect(html).toContain("Print Broadside");
  });
});
