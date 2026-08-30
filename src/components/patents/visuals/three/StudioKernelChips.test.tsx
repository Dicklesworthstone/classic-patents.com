import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { type KernelChip, StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";

describe("StudioKernelChips Component", () => {
  const sampleChips: KernelChip[] = [
    { label: "Shaft RPM", value: "3,600", unit: "rpm", tone: "ok" },
    { label: "Core Temp", value: "385", unit: "°C", tone: "warn" },
    { label: "Thermal Flux", value: "1.42", unit: "MW/m²", tone: "hot" },
  ];

  test("returns null when visible is false or chips array is empty", () => {
    const hiddenHtml = renderToStaticMarkup(
      <StudioKernelChips visible={false} chips={sampleChips} />,
    );
    expect(hiddenHtml).toBe("");

    const emptyHtml = renderToStaticMarkup(<StudioKernelChips visible={true} chips={[]} />);
    expect(emptyHtml).toBe("");
  });

  test("renders telemetry chips with units, tones, and title header", () => {
    const html = renderToStaticMarkup(
      <StudioKernelChips
        visible={true}
        title="Live Telemetry Bus"
        chips={sampleChips}
        side="right"
      />,
    );

    expect(html).toContain("Live Telemetry Bus");
    expect(html).toContain("Shaft RPM");
    expect(html).toContain("3,600");
    expect(html).toContain("rpm");
    expect(html).toContain("Core Temp");
    expect(html).toContain("385");
    expect(html).toContain("Thermal Flux");
    expect(html).toContain("1.42");
    expect(html).toContain("right-3");
    expect(html).toContain("max-w-[min(calc(100%-25rem),28rem)]");
  });

  test("automatically redirects side='left' to 'right' when hasPrimaryHud is true", () => {
    const html = renderToStaticMarkup(
      <StudioKernelChips
        visible={true}
        title="Secondary Bus"
        chips={sampleChips}
        side="left"
        hasPrimaryHud={true}
      />,
    );

    // Should position on the right to prevent overlapping with primary bottom-left card
    expect(html).toContain("right-3");
  });

  test("respects side='left' when hasPrimaryHud is false", () => {
    const html = renderToStaticMarkup(
      <StudioKernelChips
        visible={true}
        title="Stand-alone Bus"
        chips={sampleChips}
        side="left"
        hasPrimaryHud={false}
      />,
    );

    expect(html).toContain("left-3");
  });

  test("renders hot and warn badge tones with proper styling classes", () => {
    const html = renderToStaticMarkup(<StudioKernelChips visible={true} chips={sampleChips} />);

    expect(html).toContain("bg-rose-500/15");
    expect(html).toContain("bg-amber-500/15");
    expect(html).toContain("bg-parchment-100/80");
  });

  test("useResponsiveStudioHud exports a valid hook function", () => {
    expect(typeof useResponsiveStudioHud).toBe("function");
  });
});
