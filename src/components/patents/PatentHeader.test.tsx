import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { wrightFlyerPatent } from "@/data/patents/wright-flyer";
import { PatentHeader } from "./PatentHeader";

describe("PatentHeader component", () => {
  test("renders patent header title, inventors, metadata cards, and Archaic Glossary button", () => {
    const html = renderToStaticMarkup(<PatentHeader patent={wrightFlyerPatent} />);
    expect(html).toContain("US 821,393");
    expect(html).toContain("Wright Flyer");
    expect(html).toContain("Orville Wright, Wilbur Wright");
    expect(html).toContain("1906-05-22");
    expect(html).toContain("Dayton, Ohio");
    expect(html).toContain("Archaic Glossary &amp; Cite");
    expect(html).toContain("Aeronautics &amp; Aerodynamics");
  });
});
