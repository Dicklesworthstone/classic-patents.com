import { describe, expect, test } from "bun:test";
import type React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { useLiveSimParams } from "./useLiveSimParams";

function TestParamsHarness(props: {
  params: { rpm: number; pressure: number };
  onRef?: (ref: React.RefObject<{ rpm: number; pressure: number }>) => void;
}) {
  const ref = useLiveSimParams(props.params);
  props.onRef?.(ref);
  return <div data-rpm={ref.current.rpm} data-pressure={ref.current.pressure} />;
}

describe("useLiveSimParams Hook", () => {
  test("initializes ref with provided simulation parameters", () => {
    let capturedRef: React.RefObject<{ rpm: number; pressure: number }> | undefined;
    const initialParams = { rpm: 3000, pressure: 180 };

    const html = renderToStaticMarkup(
      <TestParamsHarness
        params={initialParams}
        onRef={(r) => {
          capturedRef = r;
        }}
      />,
    );

    expect(html).toContain('data-rpm="3000"');
    expect(html).toContain('data-pressure="180"');
    expect(capturedRef?.current).toEqual(initialParams);
  });
});
