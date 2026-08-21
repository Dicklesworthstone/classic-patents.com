/**
 * haberAmmoniaEdition.ts
 *
 * Archival Edition for Fritz Haber & Robert Le Rossignol's 1910 Catalytic Ammonia Synthesis Patent
 * (US Patent 971,501 - "Production of Ammonia").
 *
 * Transcribed, annotated, and verified against the 1-page pinned facsimile
 * at public/patents/pdfs/us-971501-haber-ammonia.pdf (SHA-256: 59592a18d6dd7208c2d55ce1f6e4e09a0437635b0faa9959d49a95b64d741124).
 */

import type { CuratedSpecificationEdition, CuratedSpecificationInline } from "@/types/patent";

const text = (value: string): CuratedSpecificationInline => ({ kind: "text", text: value });

const term = (termText: string, definition: string): CuratedSpecificationInline => ({
  kind: "term",
  text: termText,
  definition,
});

const p = (...inlines: CuratedSpecificationInline[]) => ({
  kind: "paragraph" as const,
  inlines,
});

export const haberAmmoniaParallelReadings: Readonly<Record<number, readonly string[]>> = {
  1: [
    "Preamble and inventor declaration by Fritz Haber (Professor of Chemistry at Karlsruhe) and Robert Le Rossignol (Bachelor of Science), assigning their breakthrough invention to Badische Anilin & Soda Fabrik (BASF) under Application Serial No. 512,679 filed August 13, 1909.",
  ],
  2: [
    "Historical problem statement: prior attempts by Ostwald, Nernst, and other prominent chemists to synthesize ammonia directly from elemental nitrogen and hydrogen failed commercially due to negligible equilibrium yields and ineffective catalysts.",
  ],
  3: [
    "Thermodynamic dilemma of ammonia synthesis: the exothermic reaction (N2 + 3H2 ⇌ 2NH3) is thermodynamically favored at low temperatures, but molecular reaction rates freeze; increasing temperature accelerates the reaction but destroys equilibrium concentration.",
  ],
  4: [
    "The catalytic breakthrough: discovering that metallic osmium and its compounds exhibit extraordinary catalytic activity in splitting the inert nitrogen triple bond (N≡N), dramatically outperforming allied platinum-group metals.",
  ],
  5: [
    "Catalyst preparation and support methods: deploying osmium in finely divided metallic form or supported upon inert carriers such as quartz, asbestos, clay, or derived in situ from osmium oxide hydrate or Fremy's salt under reducing hydrogen atmosphere.",
  ],
  6: [
    "Super-atmospheric pressure principle: operating at 100 to 200 atmospheres (10–20 MPa) to exploit Le Chatelier's principle, driving the 4-volume reactant mixture (N2 + 3H2) into 2 volumes of product (2NH3) and multiplying equilibrium conversion tenfold.",
  ],
  7: [
    "Concrete industrial working example: passing a 3:1 stoichiometric hydrogen-nitrogen gas mixture over finely divided osmium at 175 atmospheres and ~550 °C, achieving a breakthrough 8% single-pass ammonia yield that enables continuous condensation and closed-loop gas recirculation.",
  ],
  8: [
    "Formal legal transition from the specification to the enumerated patent claims defining the exclusive scope of catalytic high-pressure synthesis.",
  ],
  17: [
    "Formal execution and subscription of the patent specification signed by Fritz Haber and Robert Le Rossignol in the presence of subscribing witnesses J. Alec. Lloyd and A. Raesenbach.",
  ],
};

export const haberAmmoniaArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "59592a18d6dd7208c2d55ce1f6e4e09a0437635b0faa9959d49a95b64d741124",
  preparedBy: "Classic Patents editorial agent (Antigravity)",
  preparedAt: "2026-08-19",
  completeFacsimileReviewed: true,
  drawingStatus: {
    kind: "no-drawings-in-facsimile",
    evidence:
      "US 971,501 was granted with 'No Drawing' specified on Page 1 of the official USPTO specification.",
  },
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE.",
        "FRITZ HABER, AND ROBERT LE ROSSIGNOL, OF KARLSRUHE, GERMANY, ASSIGNORS TO",
        "BADISCHE ANILIN & SODA FABRIK, OF LUDWIGSHAFEN-ON-THE-RHINE, GERMANY,",
        "A CORPORATION OF BADEN.",
        "PRODUCTION OF AMMONIA.",
        "971,501. Specification of Letters Patent. Patented Sept. 27, 1910.",
        "Application filed August 13, 1909. Serial No. 512,679. (No Drawing.)",
      ],
    },
    p(
      text("To all whom it may concern: Be it known that we, "),
      term(
        "FRITZ HABER",
        "Fritz Haber (1868–1934), German physical chemist who developed the high-pressure catalytic synthesis of ammonia from atmospheric nitrogen and hydrogen, awarded the 1918 Nobel Prize in Chemistry.",
      ),
      text(", Ph. D., professor of chemistry, and "),
      term(
        "ROBERT LE ROSSIGNOL",
        "Robert Le Rossignol (1884–1976), British chemist and engineer who designed and built the robust high-pressure laboratory apparatus, valves, and circulation pumps that made continuous high-pressure synthesis possible.",
      ),
      text(
        ", bachelor of science, subjects, respectively, of the King of Prussia and the King of England, residing at Karlsruhe, Germany, have invented new and useful Improvements in the ",
      ),
      term(
        "Production of Ammonia",
        "Chemical synthesis of ammonia (2NH3) directly from elemental nitrogen (N2) and hydrogen (3H2), the foundation of modern nitrogen fertilizer and chemical industry.",
      ),
      text(", of which the following is a specification."),
    ),
    p(
      text(
        "Several attempts have hitherto been made to produce ammonia on a large scale from its elements by passing them over a catalyst, but up to the present not much success has been met with.",
      ),
    ),
    p(
      text(
        "In order that a process should be successful, it is advisable that the combination take place at as low a temperature and as quickly as possible, since when the temperature increases the concentration of the ammonia formed decreases.",
      ),
    ),
    p(
      text("We have now discovered that on passing gases containing nitrogen and hydrogen over "),
      term(
        "osmium",
        "Dense platinum-group transition metal (atomic number 76) discovered by Haber to be an extraordinarily active catalyst for breaking the inert N≡N triple bond at accessible temperatures.",
      ),
      text(
        " large quantities of ammonia can be obtained. This result is surprising, since it differs in this respect from the allied metal platinum (see Zeitschrift für Elektrochemie, vol. 14, p. 191).",
      ),
    ),
    p(
      text(
        "In carrying out this invention, osmium can be used either in the form of the metal (preferably in a very finely divided condition) or in the form of a compound of the metal which upon being used becomes converted into metallic osmium, and the metal or its compound can be used either alone or in admixture with other substances or compounds. The osmium can be employed, for instance, in the form of metallic osmium, or it may be precipitated on a suitable carrier, such for instance as quartz, asbestos, clay, and the like. Asbestos containing ten per cent. of osmium is suitable for use. Further instead of metallic osmium, other suitable osmium compounds can be employed, such for instance as osmium oxid hydrate (prepared by the reaction of formaldehyde on an alcoholic solution of osmic acid, cf. Berichte 40, 1387), which under the action of the hydrogen used is converted into metallic osmium; or Fremy's salt can be used as the starting material, and either alone or mixed with an indifferent substance, or precipitated on a suitable carrier. Under the action of hydrogen it becomes converted into metallic osmium.",
      ),
    ),
    p(
      text(
        "The reaction can be carried out at ordinary pressure, but we prefer to carry it out under increased pressure, for instance at from ",
      ),
      term(
        "100 to 200 atmospheres",
        "Extreme super-atmospheric hydrostatic pressure (10–20 MPa / 1470–2940 psi), which by Le Chatelier's principle shifts the equilibrium N2 + 3H2 ⇌ 2NH3 from 4 gas volumes to 2 gas volumes, multiplying ammonia yield tenfold.",
      ),
      text("."),
    ),
    p(
      text(
        "As an example of the manner of carrying out the process of our invention, we give the following without in any way being confined to this example. Pass slowly a mixture of about three parts by volume of hydrogen and one part by volume of nitrogen over finely divided osmium at a pressure of ",
      ),
      term(
        "one hundred and seventy-five atmospheres",
        "175 atmospheres (17.7 MPa), the benchmark operating pressure used in Haber and Le Rossignol's experimental apparatus.",
      ),
      text(" and at a temperature of about "),
      term(
        "five hundred and fifty degrees centigrade",
        "550 °C (823 K), the optimal kinetic compromise between catalytic reaction velocity and thermodynamic equilibrium conversion.",
      ),
      text(". A yield of "),
      term(
        "eight per cent. by volume",
        "An 8% single-pass equilibrium concentration of ammonia, sufficiently high to condense into liquid under pressure and permit continuous recirculating extraction.",
      ),
      text(" of ammonia can easily be obtained."),
    ),
    p(text("Now what we claim is:")),
    {
      kind: "heading",
      level: 2,
      text: "CLAIMS:",
    },
    {
      kind: "claim",
      number: 1,
      inlines: [
        text(
          "1. The process of producing ammonia by passing gases containing nitrogen and hydrogen over a catalyst containing osmium.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 2,
      inlines: [
        text(
          "2. The process of producing ammonia by passing gases containing nitrogen and hydrogen over a heated catalyst containing osmium.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 3,
      inlines: [
        text(
          "3. The process of producing ammonia by passing gases containing nitrogen and hydrogen under pressure over a heated catalyst containing osmium.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 4,
      inlines: [
        text(
          "4. The process of producing ammonia by passing a mixture of nitrogen and hydrogen over a catalyst containing osmium at a pressure above 100 atmospheres.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 5,
      inlines: [
        text(
          "5. The process of producing ammonia by passing a mixture of nitrogen and hydrogen over a heated catalyst containing osmium at a pressure above 100 atmospheres.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 6,
      inlines: [
        text(
          "6. The process of producing ammonia by passing a mixture of hydrogen and nitrogen over heated osmium at a pressure above 100 atmospheres.",
        ),
      ],
    },
    {
      kind: "heading",
      level: 3,
      text: "SIGNATURES & WITNESSES",
    },
    p(
      text(
        "In testimony whereof we have hereunto set our hands in the presence of two subscribing witnesses.\n\n",
      ),
      text("FRITZ HABER.\n\n"),
      text("ROBERT LE ROSSIGNOL.\n\n"),
      text("Witnesses: J. ALEC. LLOYD, A. RAESENBACH."),
    ),
  ],
};

export function manualHaberClaimText(claimNumber: number): string {
  const block = haberAmmoniaArchivalEdition.blocks.find(
    (b) => b.kind === "claim" && b.number === claimNumber,
  );
  if (block?.kind !== "claim") {
    throw new Error(`Claim ${claimNumber} not found in haberAmmoniaArchivalEdition`);
  }
  return block.inlines.map((i) => ("text" in i ? i.text : "")).join("");
}
