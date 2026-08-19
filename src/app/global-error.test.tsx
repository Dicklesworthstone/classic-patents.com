import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import GlobalErrorBoundary from "./global-error";

describe("GlobalErrorBoundary component", () => {
  test("renders critical error headline, custom message, and reset button", () => {
    const error = new Error("Catastrophic WebAssembly memory fault") as Error & {
      digest?: string;
    };
    const html = renderToStaticMarkup(<GlobalErrorBoundary error={error} reset={() => {}} />);

    expect(html).toContain("Critical Application Error");
    expect(html).toContain("Catastrophic WebAssembly memory fault");
    expect(html).toContain("Reload Application");
  });

  test("renders fallback error message when error.message is empty", () => {
    const error = new Error("") as Error & { digest?: string };
    const html = renderToStaticMarkup(<GlobalErrorBoundary error={error} reset={() => {}} />);

    expect(html).toContain("Critical Application Error");
    expect(html).toContain(
      "A critical error occurred while rendering the digital museum application.",
    );
  });
});
