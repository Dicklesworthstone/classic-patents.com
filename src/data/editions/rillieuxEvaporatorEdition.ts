import type {
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

const term = (
  surfaceText: string,
  key: string,
  definition: string,
): CuratedSpecificationInline => ({
  kind: "term",
  text: surfaceText,
  label: key,
  definition,
});

const p = (
  ...inlines: (string | CuratedSpecificationInline)[]
): {
  kind: "paragraph";
  inlines: CuratedSpecificationInlines;
} => ({
  kind: "paragraph",
  inlines: inlines.map((item) => (typeof item === "string" ? { kind: "text", text: item } : item)),
});

export const RILLIEUX_EVAPORATOR_PARALLEL_READINGS: Readonly<Record<number, readonly string[]>> = {
  1: [
    "The opening identifies Rillieux and locates the work in evaporating and concentrating saccharine juices and sirups for sugar manufacture, while expressly extending the described method to other fluids. It is the legal preamble, not a quantified performance statement.",
  ],
  8: [
    "The inventor's signature, N. RILLIEUX., executes the specification in his own hand; on an 1843 Louisiana grant this signing is what dates and validates the instrument that the subscribing witnesses then attest below.",
  ],
  9: ["Attestation of subscribing witnesses: Geo. Griscom and Joseph Greer."],
};

export const rillieuxEvaporatorParallelReadings = RILLIEUX_EVAPORATOR_PARALLEL_READINGS;

export const rillieuxEvaporatorArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "10d9a2c3909f1a7d7086c063925f96feed8aa362e1b39a64275a869853dc1d7a",
  preparedBy: "Classic Patents Editorial Team",
  preparedAt: "2026-08-19",
  // This is a source-bound opening-and-claims packet, not the complete
  // five-page specification. It deliberately excludes the old reconstructed
  // body; the source reader therefore falls open to the full page-marked
  // ledger and pinned facsimile.
  completeFacsimileReviewed: false,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE.",
        "NORBERT RILLIEUX, OF NEW ORLEANS, LOUISIANA, ASSIGNOR TO SAML. V. MERRICK AND JOHN H. TOWNE.",
        "IMPROVEMENT IN SUGAR-WORKS.",
        "Specification forming part of Letters Patent No. 3,237, dated August 26, 1843.",
      ],
    },
    p(
      "To all whom it may concern:\nBe it known that I, ",
      term(
        "NORBERT RILLIEUX",
        "Norbert Rillieux",
        "Free person of color born in New Orleans (1806–1894), educated at École Centrale Paris as an engineer and applied thermodynamicist, who invented the multiple-effect vacuum evaporator—one of the foundational inventions of modern chemical engineering.",
      ),
      ", of New Orleans, in the parish of Orleans and State of Louisiana, have invented certain improvements in the method of evaporating and concentrating saccharine juices and sirups in the manufacture of sugar, and which is applicable to the evaporation of other fluids; and I do hereby declare that the following is a full, clear, and exact description of said improvements.",
    ),
    {
      kind: "heading",
      level: 3,
      text: "CLAIMS",
    },
    {
      kind: "claim",
      number: 1,
      inlines: [
        {
          kind: "text",
          text: "1. Under the head of my first improvement, I claim the employment of a weighted throttle or other regulating valve in the main steam-pipe leading from the boiler to the evaporating pan or pans and the steam-engine, which valve shall be situated between the induction-valve of the engine and the evaporating pan or pans, for the purpose and in the manner described.",
        },
      ],
    },
    {
      kind: "claim",
      number: 2,
      inlines: [
        {
          kind: "text",
          text: "2. Under the head of my second improvement, I claim a vacuum pan or pans—that is to say, an evaporating pan or pans connected with a condenser—in combination with an evaporating pan or pans, or boiler, in which the saccharine juice or other fluid is evaporated under a pressure lower, equal to, or greater than the atmosphere, which last-mentioned pan or pans, or boiler, prepares the saccharine juice, &c., for the vacuum pan or pans, and at the same time supplies the necessary vapor from the saccharine juice, &c., to complete the evaporation or concentration of the sirup, &c., in the vacuum pan or pans, as fully described above.",
        },
      ],
    },
    {
      kind: "claim",
      number: 3,
      inlines: [
        {
          kind: "text",
          text: '3. Under the head of my third improvement, I claim surrounding the evaporating-column, known as the "Champenoise" column, with an outer column or jacket, by which I am enabled to adapt it to the condition of my second-recited improvement, as described.',
        },
      ],
    },
    {
      kind: "claim",
      number: 4,
      inlines: [
        {
          kind: "text",
          text: "4. Under the head of my fourth improvement, I claim the employment of a differential thermometer to regulate the concentration of the sirup, in the manner substantially as herein described.",
        },
      ],
    },
    {
      kind: "claim",
      number: 5,
      inlines: [
        {
          kind: "text",
          text: "5. The so constructing the differential thermometer that all the range of its action up to the point desired shall not act on the regulating valve, as described.",
        },
      ],
    },
    p("N. RILLIEUX."),
    p("Witnesses:\nGEO. GRISCOM,\nJOSEPH GREER."),
  ],
};

export const rillieuxEvaporatorEdition = rillieuxEvaporatorArchivalEdition;

export function manualRillieuxClaimText(claimNumber: number): string {
  const claimBlock = rillieuxEvaporatorArchivalEdition.blocks.find(
    (b) => b.kind === "claim" && b.number === claimNumber,
  );
  if (claimBlock?.kind !== "claim") {
    throw new Error(`Rillieux Evaporator archival edition is missing Claim ${claimNumber}`);
  }
  return claimBlock.inlines
    .map((inline) => (inline.kind === "text" || inline.kind === "term" ? inline.text : ""))
    .join("")
    .trim();
}
