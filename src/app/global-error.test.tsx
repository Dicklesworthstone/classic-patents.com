import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import GlobalErrorBoundary from "./global-error";

describe("GlobalErrorBoundary component", () => {
  test("renders critical error headline, digest reference, and reset button", () => {
    const error = new Error("Catastrophic WebAssembly memory fault") as Error & {
      digest?: string;
    };
    error.digest = "wasm-fault-digest";
    const html = renderToStaticMarkup(<GlobalErrorBoundary error={error} reset={() => {}} />);

    // Visitor copy stays generic; diagnosability travels through the digest
    // reference rather than a raw error message.
    expect(html).toContain("Critical Application Error");
    expect(html).toContain("Reference: wasm-fault-digest");
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
