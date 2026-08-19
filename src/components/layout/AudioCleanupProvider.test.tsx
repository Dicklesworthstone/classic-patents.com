import { describe, expect, mock, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { AudioCleanupProvider } from "./AudioCleanupProvider";

// Mock next/navigation
mock.module("next/navigation", () => ({
  usePathname: () => "/patents/us-821393-wright-flyer",
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ push: () => {}, replace: () => {} }),
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

describe("AudioCleanupProvider component", () => {
  test("renders without throwing in server-side React environment", () => {
    const html = renderToStaticMarkup(<AudioCleanupProvider />);
    expect(html).toBe("");
  });
});
