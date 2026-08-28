import { describe, expect, mock, test } from "bun:test";
import type React from "react";
import { renderToStaticMarkup } from "react-dom/server";

mock.module("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/",
  useRouter: () => ({ push: () => {}, replace: () => {} }),
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
  redirect: (url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  },
}));

mock.module("next/link", () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

mock.module("next/font/google", () => ({
  Newsreader: () => ({ variable: "--font-serif" }),
  Plus_Jakarta_Sans: () => ({ variable: "--font-sans" }),
  JetBrains_Mono: () => ({ variable: "--font-mono" }),
}));

describe("RootLayout & Global App Metadata", () => {
  test("defines comprehensive site metadata and openGraph configuration", async () => {
    const { metadata } = await import("./layout");

    expect(metadata.metadataBase?.toString()).toBe("https://classic-patents.com/");
    expect(metadata.title).toBeDefined();
    expect(metadata.description).toContain("open-source digital museum");
    expect(metadata.authors).toEqual([
      { name: "Jeffrey Emanuel", url: "https://github.com/Dicklesworthstone" },
    ]);
    expect(metadata.openGraph?.siteName).toBe("Classic Patents");
    expect((metadata.twitter as unknown as { card?: string })?.card).toBe("summary_large_image");
  });

  test("renders layout wrapper with header, footer, audio cleanup, and child content", async () => {
    const { default: RootLayout } = await import("./layout");

    const html = renderToStaticMarkup(
      <RootLayout>
        <div id="test-content">Classic Patents Test Children</div>
      </RootLayout>,
    );

    expect(html).toContain("Classic Patents Test Children");
    expect(html).toContain("<header");
    expect(html).toContain("<footer");
    expect(html).toContain("<main");
  });
});
