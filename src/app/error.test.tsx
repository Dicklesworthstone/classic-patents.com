import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import ErrorBoundary from "./error";

describe("ErrorBoundary component", () => {
  test("renders error message and reload button", () => {
    const error = new Error("Failed to load WebGL context") as Error & { digest?: string };
    error.digest = "ERR_WEBGL_123";
    const html = renderToStaticMarkup(<ErrorBoundary error={error} reset={() => {}} />);

    expect(html).toContain("An error occurred while loading this exhibit");
    expect(html).toContain("An unexpected rendering error was encountered");
    expect(html).toContain("Reference: ERR_WEBGL_123");
    expect(html).toContain("Reload Exhibit");
  });
});
