import { describe, expect, mock, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

// Mock next/link
mock.module("next/link", () => ({
  default: ({ href, children, ...rest }: any) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

import { wrightFlyerPatent } from "@/data/patents/wright-flyer";
import { PatentCard } from "./PatentCard";

describe("PatentCard component", () => {
  test("renders patent number, shortTitle, inventors, grant date, and link target", () => {
    const html = renderToStaticMarkup(<PatentCard patent={wrightFlyerPatent} />);
    expect(html).toContain("US 821,393");
    expect(html).toContain("Wright Flyer");
    expect(html).toContain("Orville Wright, Wilbur Wright");
    expect(html).toContain("1906-05-22");
    expect(html).toContain("/patents/us-821393-wright-flyer");
    expect(html).toContain("Explore");
  });
});
