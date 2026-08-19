import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { type KernelChip, StudioKernelChips } from "./StudioKernelChips";

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
    expect(html).toContain("right-4");
  });
});
