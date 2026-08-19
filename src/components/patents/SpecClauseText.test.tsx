import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { SpecClauseText } from "./SpecClauseText";

describe("SpecClauseText component", () => {
  test("renders text blocks and highlights active physics spec clauses safely", () => {
    const text = `UNITED STATES PATENT OFFICE
To all whom it may concern:
Be it known that we, Orville Wright and Wilbur Wright, have invented certain new and useful Improvements in Flying-Machines.

1. In a flying-machine, a normally flat aeroplane having lateral marginal portions capable of being moved to different angles of incidence.`;

    const html = renderToStaticMarkup(
      <SpecClauseText patentId="us-821393-wright-flyer" text={text} />,
    );

    expect(html).toContain("UNITED STATES PATENT OFFICE");
    expect(html).toContain("To all whom it may concern");
    expect(html).toContain("flying-machine");
    expect(html).toContain("lateral marginal portions");
  });
});
