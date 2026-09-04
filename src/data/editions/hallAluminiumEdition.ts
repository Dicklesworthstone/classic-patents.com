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

const HALL_SOURCE_SHEET = "/patents/figures/us-400766-hall-aluminium/source-sheet-1-v1.png";

const sourceSheetPreview = (figure: string, description: string) => ({
  src: HALL_SOURCE_SHEET,
  alt: `Complete unmodified source drawing sheet 1 from US 400,766, including ${figure}: ${description}`,
  width: 2320,
  height: 3408,
});

const preview = (
  surfaceText: string,
  figureNumber: number,
  description: string,
): CuratedSpecificationInline => ({
  kind: "reference",
  text: surfaceText,
  href: `#figure-${figureNumber}`,
  referenceType: "figure",
  label: `Open the complete source drawing sheet containing ${surfaceText} from US 400,766`,
  figurePreviews: [sourceSheetPreview(surfaceText, description)],
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

/**
 * Manual continuous edition reviewed against all three sheets of the pinned
 * facsimile. Every active figure citation retains its intact drawing sheet.
 */
export const hallAluminiumArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "8a9cda34caaa0426bc62d75ca3910cab636c9f0329cb2f6193019c95c5d94791",
  preparedBy: "Classic Patents editorial agent (GPT-5.6); direct source-sheet review",
  preparedAt: "2026-09-03",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE.",
        "CHARLES M. HALL, OF OBERLIN, OHIO.",
        "PROCESS OF REDUCING ALUMINIUM BY ELECTROLYSIS.",
        "SPECIFICATION forming part of Letters Patent No. 400,766, dated April 2, 1889.",
        "Application filed July 9, 1886. Serial No. 207,601. (Specimens.)",
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "DRAWING SHEET",
      title: "Two forms of electrolytic reduction apparatus",
      description: [
        { kind: "text", text: "The sheet prints " },
        preview("Fig. 1", 1, "sectional elevation of Hall's apparatus"),
        { kind: "text", text: ", a sectional elevation, and " },
        preview("Fig. 2", 2, "modified apparatus in elevation and section"),
        {
          kind: "text",
          text: ", a modified form partly in elevation and partly in section. The sheet also prints `Witnesses: GEORGE E. HALL. ROBT. L. FENWICK.` and `Inventor: CHARLES M. HALL.`; an attorney line and handwritten signatures appear beneath the inventor line.",
        },
      ],
    },
    p(
      "To all whom it may concern:\nBe it known that I, ",
      term(
        "CHARLES M. HALL",
        "charles-m-hall",
        "The inventor named by the facsimile. This annotation identifies the authored name without replacing the legal preamble or importing later biographical claims into the source face.",
      ),
      ", a citizen of the United States, residing at Oberlin, in the county of Lorain and State of Ohio, have invented certain new and useful Improvements in the Process of Reducing Aluminium by Electrolysis; and I do hereby declare the following to be a full, clear, and exact description of the invention, such as will enable others skilled in the art to which it appertains to make and use the same.",
    ),
    p(
      "The invention described herein relates to the reduction of aluminium from its oxide by dissolving such oxide in a bath containing a ",
      term(
        "fused fluoride salt of aluminium",
        "fused-fluoride-salt",
        "The molten fluoride electrolyte described by Hall as the solvent for alumina. It is the bath phase through which current passes while the patent's claimed reduction occurs.",
      ),
      " and then reducing the aluminium by passing an electric current through the bath; and in general terms the invention consists in the electrolysis of a solution of alumina in a fused fluoride salt of aluminium, substantially as hereinafter more fully described and claimed.",
    ),
    p(
      "In the accompanying drawings, forming a part of this specification, ",
      preview("Figure 1", 1, "sectional elevation"),
      " is a sectional elevation of a form of apparatus applicable in the practice of my invention; and ",
      preview("Fig. 2", 2, "modified apparatus"),
      " is a view, partly in elevation and partly in section, of a modified form of apparatus.",
    ),
    p(
      "In the practice of my invention I prepare a bath for the solution of the alumina by fusing together in a suitable ",
      term(
        "crucible",
        "crucible",
        "The heat-resistant vessel in which Hall fuses the fluoride salts and dissolves alumina. The source drawing labels the metal vessel A and its furnace B.",
      ),
      ", A, the fluoride of aluminium and the fluoride of a metal more electro-positive than aluminium; as, for example, the fluoride of sodium potassium, &c.—these salts being preferably mingled together in the proportions of eighty-four parts of sodium fluoride and one hundred and sixty-nine parts of aluminium fluoride, represented by the formula Na₂Al₂F₈. A convenient method of forming the bath consists in adding to the mineral ",
      term(
        "cryolite",
        "cryolite-solvent",
        "The mineral fluoride mixture used as the starting bath. Hall says to add aluminium fluoride to cryolite to obtain the relative fluoride proportions required for the fused solvent.",
      ),
      " 33 1/3 per cent. of its weight of aluminium fluoride. The object of thus adding aluminium fluoride is to secure in the bath the proper relative proportions of the fluorides of aluminium and sodium.",
    ),
    p(
      "To this fused bath is added alumina or the oxide of aluminium in sufficient quantities, and the alumina being dissolved by the fused bath an electric current is passed through the solution, by means of suitable electrodes, C and D, connected with a ",
      term(
        "dynamo-electric machine",
        "dynamo-electric-machine",
        "The period source of electric current named in the specification. Hall also allows another suitable source, provided the electrodes are connected and immersed in the fused solution.",
      ),
      " or other suitable source of electricity and immersed in the solution. By the action of the electric current, which preferably has an ",
      term(
        "electro-motive force",
        "electro-motive-force",
        "Hall's voltage description for the electrical driving force, stated in the source as about four to six volts for the fused bath and its electrode reactions.",
      ),
      " of about four to six volts, oxygen is released at the positive electrode C, and aluminium is reduced at the negative electrode D, which, on account of the affinity of aluminium for other metals, is formed of carbon when it is desired to produce pure aluminium. The positive electrode may be formed of carbon, copper, platinum, or other suitable material. When formed of carbon, the electrode C is gradually consumed, and must therefore be renewed from time to time; but when formed of copper an oxide coating is formed over the surface of the electrode. This coating serves to protect the electrode from further destruction by the action of the oxygen, but does not interfere materially with the conducting qualities of the electrode.",
    ),
    p(
      "On account of the affinity of aluminium for other metals, and also the corrosive action of the materials forming the bath on earthy materials, I prefer to form the crucible or melting-pot A of metal—as iron or steel—and protect the same from the action of the aluminium by a ",
      term(
        "carbon lining",
        "carbon-lining",
        "A carbon protective lining inside the metal melting-pot. In Hall's arrangement it shields the vessel from aluminium and can also serve as the negative electrode in the modified apparatus.",
      ),
      ", A′. This crucible is placed in a suitable furnace, B, and subjected to a sufficient heat to fuse the materials placed therein, such materials fusing at approximately the same temperature as common salt.",
    ),
    p(
      "In lieu of the electrode D, as shown in ",
      preview("Fig. 1", 1, "electrode D and carbon-lined crucible"),
      ", the carbon lining A′ may be employed as the negative electrode, as shown in ",
      preview("Fig. 2", 2, "carbon lining A-prime as negative electrode"),
      ", the conductor from the negative pole of the electric generator being suitably connected, as shown at N′, to such lining.",
    ),
    p(
      "In order to render the bath or solvent more fusible fluoride of lithium may be substituted for a portion of the fluoride of sodium—as, for example, for one-fourth of the fluoride of sodium an equivalent amount of lithium fluoride by molecular weights may be substituted. Thus twenty-six parts of lithium fluoride displacing forty-two parts of sodium fluoride, the resulting combination contains twenty-six parts of lithium fluoride for every one hundred and twenty-six parts of sodium fluoride and three hundred and thirty-eight parts of aluminium fluoride.",
    ),
    p(
      "While I consider the proportions of fluorides of sodium and aluminium, and of the fluorides of sodium, lithium, and aluminium, hereinbefore stated, as best adapted for the purpose, such proportions may be varied within certain limits without materially affecting the operation or function of the bath, as, in fact, any proportions which may be found suitable may be employed. The aluminium as it is reduced at the negative electrode is melted and collects thereon in globules, and then drops down to the bottom of the bath, which is of less specific gravity than the molten aluminium, and can be removed by suitable means; or the bath may be poured out and after being cooled the aluminium may be picked out.",
    ),
    p(
      "As hereinbefore stated, the oxygen is released at the positive electrode, and when the latter is formed of carbon combines therewith, forming ",
      term(
        "carbonic oxide",
        "carbonic-oxide",
        "The source's period name for carbon monoxide, printed with the formula (CO). Hall describes carbon consumption at the positive electrode and subsequent oxygen release for a copper electrode.",
      ),
      ", (CO), the carbon being gradually consumed, and with some salts, more particularly the salts of sodium, carbonaceous material is preferably used in the positive electrode or anode; but when the positive electrode is formed of copper, as is preferable when salts of potassium are employed, a copper-oxide coating is first formed on the electrode, thereby forming a protective covering, free oxygen being subsequently given off at the positive electrode.",
    ),
    p(
      "No claim is made herein specifically to the use of the fluoride of potassium and aluminium as a bath for the reduction of aluminium, as the same forms the subject-matter of an application filed February 2, 1887, and numbered Serially 226,206; nor does the apparatus described herein with more or less particularity form any part of the invention herein, as the same forms the subject-matter of an application, No. 282,952, filed August 17, 1888.",
    ),
    {
      kind: "heading",
      level: 3,
      text: "I claim herein as my invention---",
    },
    {
      kind: "claim",
      number: 1,
      inlines: [
        {
          kind: "text",
          text: "1. As an improvement in the art of manufacturing aluminium, the herein-described process, which consists in dissolving alumina in a fused bath composed of the fluorides of aluminium and a metal more electro-positive than aluminium, and then passing an electric current through the fused mass, substantially as set forth.",
        },
      ],
    },
    {
      kind: "claim",
      number: 2,
      inlines: [
        {
          kind: "text",
          text: "2. As an improvement in the art of manufacturing aluminium, the herein-described process, which consists in dissolving alumina in a fused bath composed of the fluorides of aluminium and sodium, and then passing an electric current, by means of a carbonaceous anode, through the fused mass, substantially as set forth.",
        },
      ],
    },
    {
      kind: "claim",
      number: 3,
      inlines: [
        {
          kind: "text",
          text: "3. As an improvement in the art of manufacturing aluminium, the herein-described process, which consists in dissolving alumina in a fused bath composed of the fluorides of aluminium, sodium, and lithium, and then passing an electric current, by means of a carbonaceous anode, through the fused mass, substantially as set forth.",
        },
      ],
    },
    p("In testimony whereof I affix my signature in presence of two witnesses."),
    p("CHARLES M. HALL."),
    p("Witnesses:\nGEORGE E. HALL,\nROBT. L. FENWICK."),
  ],
};

/**
 * Extract literal claim text from the archival edition blocks.
 * Enforces dynamic runtime single-source-of-truth lookup.
 */
export function manualHallClaimText(claimNumber: number): string {
  const block = hallAluminiumArchivalEdition.blocks.find(
    (b) => b.kind === "claim" && b.number === claimNumber,
  );
  if (block?.kind !== "claim") {
    throw new Error(`Claim ${claimNumber} not found in hallAluminiumArchivalEdition`);
  }
  return block.inlines.map((i) => i.text).join("");
}

export const HALL_ALUMINIUM_PARALLEL_READINGS: Readonly<Record<number, readonly string[]>> = {
  2: [
    "The opening identifies Hall and preserves the formal enabling-description promise: the specification is meant to let a skilled person make and use the improvement.",
  ],
  3: [
    "Hall frames the invention as dissolving aluminium oxide in a fused aluminium-fluoride salt and electrolyzing that solution rather than decomposing the fluoride bath itself.",
  ],
  4: [
    "The drawing paragraph binds the two printed figures to their distinct source roles: Fig. 1 is a sectional apparatus elevation and Fig. 2 is the modified elevation-and-section arrangement.",
  ],
  5: [
    "Hall prepares the electrolyte by fusing aluminium fluoride with a more electro-positive metal fluoride, gives the sodium and aluminium proportions, and adds aluminium fluoride to cryolite to set those proportions.",
  ],
  6: [
    "The dissolved alumina is placed between electrodes connected to a dynamo source. Hall states a preferred four-to-six-volt force, carbon's purity advantage at the negative electrode, and the alternative carbon, copper, or platinum positive electrodes.",
  ],
  7: [
    "The metal crucible is protected from aluminium and earthy-bath corrosion by a carbon lining, while a furnace supplies enough heat to fuse the charge at about the temperature of common salt.",
  ],
  8: [
    "Hall's Fig. 2 variant replaces the separate negative electrode D with the carbon lining A-prime and connects the generator's negative conductor to that lining at N-prime.",
  ],
  9: [
    "Lithium fluoride can replace one-fourth of the sodium fluoride by molecular weight, and Hall records the resulting lithium, sodium, and aluminium fluoride quantities explicitly.",
  ],
  10: [
    "The stated fluoride proportions are preferred but adjustable. Reduced aluminium forms globules, falls through the lighter bath, and can be removed either directly or after the bath is cooled and poured out.",
  ],
  11: [
    "At the positive electrode oxygen reacts with carbon to form the printed carbonic-oxide product; sodium salts favor carbonaceous anodes, while copper can form a protective oxide coating and later release oxygen.",
  ],
  12: [
    "Hall excludes a potassium-aluminium-fluoride bath and the detailed apparatus from this application's claims because separate applications already address those subject matters.",
  ],
  17: [
    "The closing legal formula states that Hall affixes his signature in the presence of two witnesses.",
  ],
  18: ["The inventor's printed name and signature line execute the specification."],
  19: [
    "George E. Hall and Robt. L. Fenwick are the two witnesses printed beneath Hall's signature.",
  ],
};
