import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { wrightFlyerPatent } from "@/data/patents/wright-flyer";
import { MuseumBroadsidePlaque } from "./MuseumBroadsidePlaque";

describe("MuseumBroadsidePlaque component", () => {
  test("renders print-ready archival broadside masthead and metadata", () => {
    const html = renderToStaticMarkup(<MuseumBroadsidePlaque patent={wrightFlyerPatent} />);

    expect(html).toContain("United States Patent &amp; Trademark Archive");
    expect(html).toContain("Historical Specification &amp; Engineering Broadside");
    expect(html).toContain("FLYING-MACHINE");
    expect(html).toContain("US 821,393");
    expect(html).toContain("Orville Wright, Wilbur Wright");
    expect(html).toContain("Dayton, Ohio");
    expect(html).toContain("1906-05-22");
  });
});
