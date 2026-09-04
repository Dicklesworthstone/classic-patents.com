import type { CuratedSpecificationEdition, CuratedSpecificationInline } from "@/types/patent";

const term = (
  surfaceText: string,
  definition: string,
  label?: string,
): CuratedSpecificationInline => ({
  kind: "term",
  text: surfaceText,
  definition,
  label,
});

export const HOPKINS_PARALLEL_READINGS: Readonly<Record<number, readonly string[]>> = {
  1: [
    "The formal preamble and recital: Samuel Hopkins of Philadelphia discovers a novel apparatus and four-step process for making Pearl ash by roasting raw wood ashes in a furnace prior to leaching, yielding a dramatically higher salt content with minimal residual carbon.",
  ],
  2: [
    "The operative legal grant: in accordance with the 1790 Patent Act, the United States grants Hopkins and his assigns the exclusive right for fourteen years to practice and vend the discovery of furnace-calcining raw ashes prior to water dissolution.",
  ],
  3: [
    "Execution and testimonium: issued under the Great Seal of the United States at the City of New York on July 31, 1790, with the handwritten signature of George Washington visible on the pinned sheet.",
  ],
  4: [
    "Presidential execution: George Washington affixes his own hand to make the invention letters patent, the act that gives the federal grant its force under the 1790 Patent Act.",
  ],
  5: [
    "Legal examination and certification: Attorney General Edmund Randolph certifies at the City of New York on July 31, 1790 that the foregoing letters patent were delivered to him in pursuance of the Act to promote the Progress of useful Arts and that he finds them conformable to that Act.",
  ],
};

export const hopkinsPotashArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "d4cdaf8e4f5cf9fc841df0a98adca8341b5c513e4f328f013f50fc914509777e",
  preparedBy: "Classic Patents editorial agent (ox-alpha)",
  preparedAt: "2026-08-22",
  completeFacsimileReviewed: true,
  drawingStatus: {
    kind: "no-drawings-in-facsimile",
    evidence:
      "The pinned single-sheet letters patent contains text, seals, and signatures but no separate technical drawing or numbered figure.",
  },
  claimStatus: {
    kind: "no-formal-claims-in-facsimile",
    evidence:
      "The original 1790 Hopkins patent predates the 1836 Patent Act statutory requirement for formal numbered claims; the grant recites the complete process in the narrative specification.",
  },
  blocks: [
    {
      kind: "masthead",
      lines: ["THE UNITED STATES.", "To all to whom these Presents shall come.", "GREETING."],
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "Whereas Samuel Hopkins of the City of Philadelphia and State of Pensylvania hath discovered an Improvement, not known or used before such Discovery, in the making of ",
        },
        term(
          "Pot ash",
          "Crude potassium carbonate (K₂CO₃) historically extracted by leaching wood ashes in iron pots; used extensively in soap, glass, and industrial chemistry.",
        ),
        {
          kind: "text",
          text: " and ",
        },
        term(
          "Pearl ash",
          "Refined, calcined potassium carbonate purified of combustible organic contaminants, yielding white pearl-like crystals with high chemical purity.",
        ),
        {
          kind: "text",
          text: " by a new Apparatus and Process; that is to say, in the making of Pearl ash 1st. by ",
        },
        term(
          "burning the raw Ashes in a Furnace",
          "Thermal roasting in a reverberatory kiln to oxidize volatile hydrocarbons, tars, and unburned carbon into CO₂ and H₂O prior to aqueous extraction.",
        ),
        {
          kind: "text",
          text: ", 2d. by dissolving and boiling them when so burnt in Water, 3rd. by drawing off and settling the ",
        },
        term(
          "Ley",
          "Strong alkaline aqueous solution of potassium carbonate and soluble alkali salts obtained by lixiviation of calcined ashes.",
        ),
        {
          kind: "text",
          text: ", and 4th. by boiling the Ley into Salts which then are the true Pearl ash; and also in the making of Pot ash by ",
        },
        term(
          "fluxing the Pearl ash",
          "Heating refined pearl ash to its melting point in cast-iron pots to cast dense fused blocks of commercial potash.",
        ),
        {
          kind: "text",
          text: " so made as aforesaid; which Operation of burning the raw Ashes in a Furnace, preparatory to their Dissolution and boiling in Water, is new, leaves little Residuum; and produces a much greater Quantity of Salt:",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "These are therefore in pursuance of the Act, entituled “An Act to promote the Progress of useful Arts”, to grant to the said Samuel Hopkins, his Heirs, Administrators and Assigns, for the Term of fourteen Years, the sole and exclusive Right and Liberty of using, and vending to others the said Discovery, of burning the raw Ashes previous to their being dissolved and boiled in Water, according to the true Intent and Meaning, of the Act aforesaid.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "In Testimony whereof I have caused these Letters to be made patent, and the Seal of the United States to be hereunto affixed. Given under my Hand at the City of New York this thirty first Day of July in the Year of our Lord one thousand seven hundred & Ninety.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "G. WASHINGTON.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "City of New York July 31st. 1790. I do hereby certify that the foregoing Letters Patent were delivered to me in pursuance of the Act, entituled “An Act to promote the Progress of useful Arts”; that I have examined the same, and find them conformable to the said Act.",
        },
        term(
          "Edm. Randolph",
          "Edmund Randolph of Virginia, the first Attorney General of the United States, whose statutory duty under the 1790 Patent Act was to examine each letters-patent application for conformity to the Act before grant.",
        ),
        {
          kind: "text",
          text: ", Attorney General for the United States.",
        },
      ],
    },
  ],
};
