import type {
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
  Patent,
} from "@/types/patent";

const text = (value: string): CuratedSpecificationInlines => [{ kind: "text", text: value }];
const paragraph = (inlines: CuratedSpecificationInlines) => ({
  kind: "paragraph" as const,
  inlines,
});
const p = (value: string) => paragraph(text(value));

const term = (value: string, definition: string): CuratedSpecificationInline => ({
  kind: "term",
  text: value,
  definition,
});

const crop = (number: number, width: number, height: number, revision = "-v3") => ({
  src: `/patents/figures/us-223898-edison-lightbulb/fig-${number}-source-crop${revision}.png`,
  alt: `Source-facsimile crop of Fig. ${number} from US 223,898.`,
  width,
  height,
});

const FIGURES = {
  "Fig. 1": crop(1, 600, 900, "-v4"),
  "Fig. 2": crop(2, 430, 1450, "-v6"),
  "Fig. 3": crop(3, 650, 900),
} as const;

const figure = (
  label: keyof typeof FIGURES,
  sourceText: string = label,
): CuratedSpecificationInline => ({
  kind: "reference",
  text: sourceText,
  href: "#",
  referenceType: "figure",
  label: `Open the source-facsimile crop for ${label} in US 223,898`,
  figurePreviews: [FIGURES[label]],
});

const statute = (sourceText: string): CuratedSpecificationInline => ({
  kind: "reference",
  text: sourceText,
  href: "#",
  referenceType: "section",
  label: `Source legal reference: ${sourceText} of the Revised Statutes`,
});

const claim = (number: number, value: string | CuratedSpecificationInlines) => ({
  kind: "claim" as const,
  number,
  inlines: typeof value === "string" ? text(value) : value,
});

/**
 * A continuous, manually prepared edition of the complete four-sheet US
 * 223,898 facsimile. The final sheet carries two post-grant certificate
 * impressions as well as the patent specification, so it is included rather
 * than silently treating the grant body as the whole archival document.
 */
export const edisonLightbulbArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "70c46d7c8624b1e471dffd1175b0f34e70b4b05b6a9adede43c198fe71abc054",
  preparedBy: "Classic Patents editorial agent (GPT-5.6)",
  preparedAt: "2026-08-18",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE.",
        "THOMAS A. EDISON, OF MENLO PARK, NEW JERSEY.",
        "ELECTRIC-LAMP.",
        "Specification forming part of Letters Patent No. 223,898, dated January 27, 1880. Application filed November 4, 1879.",
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIGURES 1-3",
      title: "Lamp, plastic stock, and carbonized spiral",
      description: [
        { kind: "text", text: "The drawing sheet contains " },
        figure("Fig. 1"),
        { kind: "text", text: ", " },
        figure("Fig. 2"),
        { kind: "text", text: ", and " },
        figure("Fig. 3"),
        { kind: "text", text: ". Each preview is a direct crop from the pinned facsimile." },
      ],
    },
    p("To all whom it may concern:"),
    p(
      "Be it known that I, THOMAS ALVA EDISON, of Menlo Park, in the State of New Jersey, United States of America, have invented an Improvement in Electric Lamps, and in the method of manufacturing the same, (Case No. 186,) of which the following is a specification.",
    ),
    paragraph([
      {
        kind: "text",
        text: "The object of this invention is to produce electric lamps giving light by ",
      },
      term("incandescence", "Light emitted because a material has been heated until it glows."),
      {
        kind: "text",
        text: ", which lamps shall have high resistance, so as to allow of the practical subdivision of the electric light.",
      },
    ]),
    p(
      "The invention consists in a light-giving body of carbon wire or sheet coiled or arranged in such a manner as to offer great resistance to the passage of the electric current, and at the same time present but a slight surface from which radiation can take place.",
    ),
    paragraph([
      {
        kind: "text",
        text: "The invention further consists in placing such burner of great resistance in a nearly perfect vacuum, to prevent oxidation and injury to the conductor by the atmosphere. The current is conducted into the vacuum-bulb through ",
      },
      term("platina", "The historical name used here for platinum."),
      { kind: "text", text: " wires sealed into the glass." },
    ]),
    p(
      "The invention further consists in the method of manufacturing carbon conductors of high resistance, so as to be suitable for giving light by incandescence, and in the manner of securing perfect contact between the metallic conductors or leading-wires and the carbon conductor.",
    ),
    p(
      "Heretofore light by incandescence has been obtained from rods of carbon of one to four ohms resistance, placed in closed vessels, in which the atmospheric air has been replaced by gases that do not combine chemically with the carbon. The vessel holding the burner has been composed of glass cemented to a metallic base. The connection between the leading-wires and the carbon has been obtained by clamping the carbon to the metal. The leading-wires have always been large, so that their resistance shall be many times less than the burner, and, in general, the attempts of previous persons have been to reduce the resistance of the carbon rod.",
    ),
    paragraph([
      {
        kind: "text",
        text: "The disadvantages of following this practice are, that a lamp having but one to four ohms resistance cannot be worked in great numbers in ",
      },
      term(
        "multiple arc",
        "A parallel electrical connection in which each lamp is connected across the supply conductors.",
      ),
      {
        kind: "text",
        text: " without the employment of main conductors of enormous dimensions; that, owing to the low resistance of the lamp, the leading-wires must be of large dimensions and good conductors, and a glass globe cannot be kept tight at the place where the wires pass in and are cemented; hence the carbon is consumed, because there must be almost a perfect vacuum to render the carbon stable, especially when each carbon is small in mass and high in electrical resistance.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: 'The use of a gas in the receiver at the atmospheric pressure, although not attacking the carbon, serves to destroy it in time by "',
      },
      term(
        "air-washing",
        "Edison's period term for erosion or attrition caused by rapid gas movement over hot carbon.",
      ),
      {
        kind: "text",
        text: '," or the attrition produced by the rapid passage of the air over the slightly-coherent highly-heated surface of the carbon. I have reversed this practice.',
      },
    ]),
    p(
      "I have discovered that even a cotton thread properly carbonized and placed in a sealed glass bulb exhausted to one-millionth of an atmosphere offers from one hundred to five hundred ohms resistance to the passage of the current, and that it is absolutely stable at very high temperatures; that if the thread be coiled as a spiral and carbonized, or if any fibrous vegetable substance which will leave a carbon residue after heating in a closed chamber be so coiled, as much as two thousand ohms resistance may be obtained without presenting a radiating-surface greater than three-sixteenths of an inch; that if such fibrous material be rubbed with a plastic compound of lamp-black and tar, its resistance may be made high or low, according to the amount of lamp-black placed upon it; that carbon filaments may be made by a combination of tar and lamp-black, the latter being previously ignited in a closed crucible for several hours and afterward moistened and kneaded until it assumes the consistency of thick putty. Small pieces of this material may be rolled out in the form of wire as small as seven one-thousandths of an inch in diameter and over a foot in length, and the same may be coated with a non-conducting non-carbonizable substance and wound on a bobbin, or as a spiral, and the tar carbonized in a closed chamber by subjecting it to high heat, the spiral after carbonization retaining its form.",
    ),
    paragraph([
      {
        kind: "text",
        text: "All these forms are fragile and cannot be clamped to the leading-wires with sufficient force to insure good contact and prevent heating. I have discovered that if ",
      },
      term("platina wires", "Platinum wires; the period spelling is retained from the source."),
      {
        kind: "text",
        text: " are used and the plastic lamp-black and tar material be molded around it in the act of carbonization there is an intimate union by combination and by pressure between the carbon and platina, and nearly perfect contact is obtained without the necessity of clamps; hence the burner and the leading-wires are connected to the carbon ready to be placed in the vacuum-bulb.",
      },
    ]),
    p(
      "When fibrous material is used the plastic lamp-black and tar are used to secure it to the platina before carbonizing.",
    ),
    p(
      "By using the carbon wire of such high resistance I am enabled to use fine platina wires for leading-wires, as they will have a small resistance compared to the burner, and hence will not heat and crack the sealed vacuum-bulb. Platina can only be used, as its expansion is nearly the same as that of glass.",
    ),
    paragraph([
      {
        kind: "text",
        text: "By using a considerable length of carbon wire and coiling it the exterior, which is only a small portion of its entire surface, will form the principal radiating-surface; hence I am able to raise the ",
      },
      term(
        "specific heat",
        "The source's historical phrasing for the thermal behavior of the carbon mass.",
      ),
      {
        kind: "text",
        text: " of the whole of the carbon, and thus prevent the rapid reception and disappearance of the light, which on a plain wire is prejudicial, as it shows the least unsteadiness of the current by the flickering of the light; but if the current is steady the defect does not show.",
      },
    ]),
    p(
      "I have carbonized and used cotton and linen thread, wood splints, papers coiled in various ways, also lamp-black, plumbago, and carbon in various forms, mixed with tar and kneaded so that the same may be rolled out into wires of various lengths and diameters. Each wire, however, is to be uniform in size throughout.",
    ),
    paragraph([
      {
        kind: "text",
        text: "If the carbon thread is liable to be distorted during carbonization it is to be coiled between a helix of copper wire. The ends of the carbon or filament are secured to the platina leading-wires by plastic ",
      },
      term(
        "carbonizable material",
        "Material intended to turn into carbon during heating in the chamber.",
      ),
      {
        kind: "text",
        text: ", and the whole placed in the carbonizing-chamber. The copper, which has served to prevent distortion of the carbon thread, is afterward eaten away by nitric acid, and the spiral soaked in water, and then dried and placed on the glass holder, and a glass bulb blown over the whole, with a leading-tube for exhaustion by a mercury-pump. This tube, when a high vacuum has been reached, is hermetically sealed.",
      },
    ]),
    p(
      "With substances which are not greatly distorted in carbonizing, they may be coated with a non-conducting non-carbonizable substance, which allows one coil or turn of the carbon to rest upon and be supported by the other.",
    ),
    paragraph([
      { kind: "text", text: "In the drawings, " },
      figure("Fig. 1", "Figure 1"),
      {
        kind: "text",
        text: " shows the lamp sectionally. a is the carbon spiral or thread. c c′ are the thickened ends of the spiral, formed of the plastic compound of lamp-black and tar. d d′ are the platina wires. h h are the clamps, which serve to connect the platina wires, cemented in the carbon, with the leading-wires x x, sealed in the glass vacuum-bulb. e e are copper wires, connected just outside the bulb to the wires x x. m is the tube (shown by dotted lines) leading to the vacuum-pump, which, after exhaustion, is hermetically sealed and the surplus removed. ",
      },
      figure("Fig. 2"),
      { kind: "text", text: " represents the plastic material before being wound into a spiral. " },
      figure("Fig. 3"),
      {
        kind: "text",
        text: " shows the spiral after carbonization, ready to have a bulb blown over it.",
      },
    ]),
    p("I claim as my invention—"),
    claim(
      1,
      "An electric lamp for giving light by incandescence, consisting of a filament of carbon of high resistance, made as described, and secured to metallic wires, as set forth.",
    ),
    claim(
      2,
      "The combination of carbon filaments with a receiver made entirely of glass and conductors passing through the glass, and from which receiver the air is exhausted, for the purposes set forth.",
    ),
    claim(
      3,
      "A carbon filament or strip coiled and connected to electric conductors so that only a portion of the surface of such carbon conductors shall be exposed for radiating light, as set forth.",
    ),
    claim(
      4,
      "The method herein described of securing the platina contact-wires to the carbon filament and carbonizing of the whole in a closed chamber, substantially as set forth.",
    ),
    p("Signed by me this 1st day of November, A. D. 1879."),
    p("THOMAS A. EDISON."),
    p("Witnesses: S. L. GRIFFIN, JOHN F. RANDOLPH."),
    { kind: "heading", level: 2, text: "Attached post-grant certificates" },
    p(
      "It is found that the following certificate has been attached to Letters Patent granted to Thomas A. Edison for improvement in “Electric Lamps,” No. 223,898, dated January 27, 1880:",
    ),
    p(
      "DEPARTMENT OF THE INTERIOR, UNITED STATES PATENT OFFICE, WASHINGTON, D. C., December 18, 1882.",
    ),
    p(
      "In compliance with the request of the party in interest Letters Patent No. 223,898, granted January 27, 1880, to Thomas A. Edison, of Menlo Park, New Jersey, for an improvement in “Electric Lamps,” is hereby limited so as to expire at the same time with the patent of the following-named, having the shortest time to run, viz: British patent, dated November 10, 1879, No. 4,576; Canadian patent, dated November 17, 1879, No. 10,654; Belgian patent, dated November 30, 1879, No. 49,884; Italian patent, dated December 6, 1879, and French patent, dated January 20, 1880, No. 133,756.",
    ),
    p(
      "It is hereby certified that the proper entries and corrections have been made in the files and records of the Patent Office.",
    ),
    paragraph([
      {
        kind: "text",
        text: "This amendment is made that the United States patent may conform to the provisions of ",
      },
      statute("section 4887"),
      { kind: "text", text: " of the Revised Statutes." },
    ]),
    p(
      "[SEAL.] BENJ. BUTTERWORTH, Commissioner of Patents. Approved: M. L. JOSLYN, Acting Secretary of the Interior.",
    ),
    p(
      "Now, in compliance with the request of the parties in interest, said certificate is hereby canceled and proper entries and corrections have been made in the files and records of the Patent Office.",
    ),
    p(
      "In testimony whereof I have hereunto set my hand and caused the seal of the Patent Office to be affixed, this 15th day of March, 1883.",
    ),
    p(
      "W. E. SIMONDS, Commissioner of Patents. Approved: CYRUS BUSSEY, Assistant Secretary of the Interior.",
    ),
    p(
      "DEPARTMENT OF THE INTERIOR, UNITED STATES PATENT OFFICE, WASHINGTON, D. C., December 18, 1882.",
    ),
    p(
      "In compliance with the request of the party in interest Letters Patent No. 223,898, granted January 27, 1880, to Thomas A. Edison, of Menlo Park, New Jersey, for an improvement in “Electric Lamps,” is hereby limited so as to expire at the same time with the patent of the following-named, having the shortest time to run, viz: British patent, dated November 10, 1879, No. 4,576; Canadian patent, dated November 17, 1879, No. 10,654; Belgian patent, dated November 30, 1879, No. 49,884; Italian patent, dated December 6, 1879, and French patent, dated January 20, 1880, No. 133,756.",
    ),
    paragraph([
      {
        kind: "text",
        text: "It is hereby certified that the proper entries and corrections have been made in the files and records of the Patent Office. This amendment is made that the United States patent may conform to the provisions of ",
      },
      statute("section 4887"),
      { kind: "text", text: " of the Revised Statutes." },
    ]),
    p(
      "BENJ. BUTTERWORTH, Commissioner of Patents. Approved: M. L. JOSLYN, Acting Secretary of the Interior.",
    ),
  ],
};

export const edisonLightbulbParallelReadings: Readonly<Record<number, readonly string[]>> = {
  2: [
    "This conventional opening addresses every reader who may need notice of the claimed invention.",
  ],
  3: [
    "Edison identifies both the subject matter and his separate manufacturing method. “Case No. 186” is part of the source text, not a modern case citation.",
  ],
  4: [
    "The stated economic problem is subdivision: many lamps must share a distribution system. Edison says a lamp needs high electrical resistance if the main conductors are to remain practical in size.",
  ],
  5: [
    "The proposed light-giving element is carbon wire or sheet arranged to resist current strongly while keeping its outward radiating surface small. The source does not select one universal filament shape here.",
  ],
  6: [
    "Edison combines the high-resistance burner with a nearly perfect vacuum so atmospheric oxygen does not attack it. The electrical path crosses the glass boundary through platina wires sealed in the glass.",
  ],
  7: [
    "The document also claims manufacturing and contact-making methods. A high-resistance carbon element is only useful if the metal leads join it without a bad electrical contact that heats locally.",
  ],
  8: [
    "Edison contrasts his work with low-resistance carbon rods in gas-filled vessels. Those systems used large leads and metal-base glass vessels, with the carbon clamped to metal. He describes that prior practice to explain the distribution and sealing problem he is trying to avoid.",
  ],
  9: [
    "A large parallel installation of one-to-four-ohm lamps would demand very large mains. Edison also says the lead-through cannot stay tight if it must carry a large conductor. The point is a coupled electrical and vacuum-sealing constraint, not a claim that every earlier lamp used the same construction.",
  ],
  10: [
    "The source says a nonreactive gas can still wear hot carbon by rapid gas flow. Edison calls this “air-washing” and says he reverses the gas-filled-receiver practice by exhausting the bulb instead.",
  ],
  11: [
    "This paragraph supplies the source's own range of materials and dimensions. A carbonized cotton thread in a bulb exhausted to one-millionth of an atmosphere is said to give 100 to 500 ohms; a coiled carbon residue can reach 2,000 ohms with only three-sixteenths of an inch of radiating surface. Edison also describes lamp-black-and-tar stock, including a seven-thousandths-inch wire and a spiral carbonized in a closed chamber.",
  ],
  12: [
    "Thin carbon forms are too fragile for forceful clamping. Edison says molding the plastic lamp-black-and-tar material around platina during carbonization produces contact by both combination and pressure, so the carbon and leads are ready for the vacuum bulb without clamps at that joint.",
  ],
  13: [
    "For a fibrous element, the same plastic lamp-black-and-tar material fixes the fiber to the platina before carbonization.",
  ],
  14: [
    "High filament resistance lets the lead wires have small resistance relative to the burner, so Edison says they will not heat and crack the sealed bulb. He gives matched expansion of platina and glass as the reason for choosing that metal.",
  ],
  15: [
    "Edison attributes steadier visible light to a coiled, longer carbon element whose exterior is only part of the total surface. His period explanation uses “specific heat”; the observational point is that a plain wire reveals current variation as flicker.",
  ],
  16: [
    "The patent leaves material choice broad within its described preparation: cotton, linen, wood splints, paper, lamp-black, plumbago, and other carbon forms. The manufacturing constraint explicitly stated is uniform wire size.",
  ],
  17: [
    "A copper helix holds a delicate carbon thread in shape during carbonization. Afterward nitric acid removes that temporary copper support; the spiral is washed, dried, mounted, enclosed in a glass bulb, exhausted through a mercury-pump tube, and sealed.",
  ],
  18: [
    "If a material does not distort much during carbonization, an insulating, noncarbonizable coating can let adjacent coil turns rest on one another rather than shorting or collapsing together.",
  ],
  19: [
    "The three source figures distinguish the assembled lamp, the plastic material before it is wound, and the carbonized spiral before the bulb is blown over it. The labels identify the carbon, its thickened contact ends, platina wires, clamps, lead wires, exterior copper wires, and exhaust tube.",
  ],
  20: [
    "The claims now define the legal combinations. Their scope is narrower than a general story about electric lighting: each names particular carbon, receiver, coil, conductor, and manufacturing relationships.",
  ],
  25: [
    "Edison dates his signature November 1, 1879. That is the execution date in the source, distinct from the November 4 filing date in the masthead and the January 27, 1880 grant.",
  ],
  26: ["Thomas A. Edison signs the specification."],
  27: [
    "S. L. Griffin and John F. Randolph are the listed witnesses to execution of the patent instrument.",
  ],
  29: [
    "The fourth sheet is not merely an extra scan. It records that an administrative certificate was attached to the grant in 1882.",
  ],
  30: [
    "The first certificate is headed by the Department of the Interior and the United States Patent Office and dated December 18, 1882.",
  ],
  31: [
    "The certificate limits the United States patent to end with the shortest-running listed foreign counterpart. It names five foreign grants and their dates and numbers, rather than changing the technical claims.",
  ],
  32: [
    "The Patent Office certifies that its files and records were corrected to reflect the limitation.",
  ],
  33: [
    "The stated legal basis is section 4887 of the Revised Statutes. This is a post-grant term-administration record, not part of Edison's technical specification.",
  ],
  34: [
    "Benjamin Butterworth signs as Commissioner of Patents, with M. L. Joslyn approving as Acting Secretary of the Interior.",
  ],
  35: [
    "A later certificate cancels the earlier certificate at the parties' request and says the Office made the corresponding entries and corrections.",
  ],
  36: ["The cancellation instrument is dated March 15, 1883."],
  37: [
    "W. E. Simonds signs as Commissioner of Patents; Cyrus Bussey approves as Assistant Secretary of the Interior.",
  ],
  38: [
    "The bottom of the source sheet repeats the earlier December 1882 certificate header. The duplicate impression is preserved because it is visibly part of the supplied facsimile.",
  ],
  39: [
    "The repeated certificate again names the same five foreign patents and the term limitation tied to the one with the shortest time remaining.",
  ],
  40: [
    "The repetition again states that the Patent Office made the relevant entries and corrections under section 4887.",
  ],
  41: [
    "The duplicate visible signature line again names Commissioner Butterworth and Acting Secretary Joslyn.",
  ],
};

function manualClaimText(number: number): string {
  const block = edisonLightbulbArchivalEdition.blocks.find(
    (candidate) => candidate.kind === "claim" && candidate.number === number,
  );
  if (block?.kind !== "claim") {
    throw new Error(`Edison Lightbulb manual edition is missing claim ${number}.`);
  }
  return block.inlines.map((inline) => inline.text).join("");
}

export const edisonLightbulbRecordCorrections: Pick<
  Patent,
  | "shortTitle"
  | "subtitle"
  | "inventors"
  | "inventorLocation"
  | "summary"
  | "heroQuote"
  | "usptoClassification"
  | "originalText"
  | "plainEnglishExplanation"
  | "claims"
  | "drawings"
  | "historicalContext"
  | "tags"
  | "stats"
> = {
  shortTitle: "Edison's High-Resistance Carbon Lamp",
  subtitle: "A coiled carbon filament, matched platina lead-throughs, and a nearly perfect vacuum",
  inventors: ["Thomas Alva Edison"],
  inventorLocation: "Menlo Park, New Jersey",
  summary:
    "US 223,898 describes an electric lamp built around a high-resistance carbon filament or strip. Edison places the carbon in a nearly perfect vacuum, brings current through platina wires sealed in glass, and describes several ways to make and connect the carbon. His specification ties that resistance to the practical subdivision of electric light: many lamps can be supplied without enormous main conductors.",
  heroQuote:
    "The object of this invention is to produce electric lamps giving light by incandescence, which lamps shall have high resistance, so as to allow of the practical subdivision of the electric light.",
  usptoClassification: "H01K 1/00 (Incandescent lamps)",
  originalText: `UNITED STATES PATENT OFFICE.
THOMAS A. EDISON, OF MENLO PARK, NEW JERSEY.

ELECTRIC-LAMP.

Specification forming part of Letters Patent No. 223,898, dated January 27, 1880. Application filed November 4, 1879.

This is a catalogue excerpt. Open Original Patent Text for the complete manually prepared edition, including the drawing sheet, full specification, four printed claims, and attached post-grant certificates.`,
  plainEnglishExplanation: {
    overview:
      "Edison's stated problem is not simply making something glow. A network with many one-to-four-ohm lamps needs enormous main conductors, and the large lead-throughs needed for those lamps compromise a sealed glass receiver. His answer is a high-resistance carbon element in a nearly perfect vacuum. The high resistance shifts the electrical design toward a small filament and comparatively fine leads; the vacuum protects the hot carbon from atmospheric injury.",
    coreMechanism:
      "A carbon wire, sheet, filament, or strip is arranged into a long or coiled path so current encounters high resistance. The element is enclosed in a glass receiver whose air is exhausted. Platina wires pass through the glass, where their expansion is said to be nearly the same as the glass's. For fragile carbon, Edison describes molding plastic lamp-black and tar around the platina contacts before carbonizing the whole. The finished carbon and leads can then be put into the vacuum bulb without relying on clamps at that contact.",
    mechanicalBreakdown: [
      {
        title: "High-resistance carbon light-giver",
        summary:
          "The lamp's glowing element is a carbon wire, sheet, filament, or strip deliberately arranged for high resistance.",
        technicalDetails:
          "The specification gives cotton thread, linen, wood splints, paper, lamp-black, plumbago, and carbon mixtures as candidate starting materials. It says a carbonized cotton thread in a glass bulb exhausted to one-millionth of an atmosphere can offer 100 to 500 ohms, while a suitably coiled carbon residue can reach 2,000 ohms. Those are reported source values, not universal performance promises.",
        archaicTerm: "burner",
        modernEquivalent: "Incandescent filament or light-giving element",
      },
      {
        title: "Glass receiver and sealed lead-throughs",
        summary:
          "The carbon is put in a nearly perfect vacuum, with platina conductors sealed through the glass.",
        technicalDetails:
          "Edison contrasts this receiver with gas-filled vessels that preserve carbon chemically but still erode hot carbon through air-washing. He says platina is needed because its expansion is nearly the same as glass. The source does not name a pump model or give a Torr value; it describes exhaustion by a mercury pump and then hermetic sealing.",
        archaicTerm: "receiver",
        modernEquivalent: "Glass vacuum envelope",
      },
      {
        title: "Molded carbon-to-metal contact",
        summary:
          "Plastic lamp-black and tar can be molded around platina and carbonized as one assembly.",
        technicalDetails:
          "The document treats the contact as a manufacturing problem. Delicate carbon forms cannot be force-clamped without poor contact or local heating. Edison says carbonization creates an intimate union by combination and pressure between carbon and platina, removing the need for clamps at that junction.",
        archaicTerm: "platina",
        modernEquivalent: "Platinum",
      },
      {
        title: "Coiling and temporary copper support",
        summary:
          "Coiling increases the carbon length in a compact form; copper can hold a delicate spiral during carbonization.",
        technicalDetails:
          "When a thread would distort in the carbonizing chamber, it is coiled between a copper helix. Nitric acid later dissolves the copper. The carbon spiral is soaked, dried, placed on a glass holder, covered by a blown glass bulb, exhausted through a tube, and sealed. The alternative insulating coating lets turns support one another when distortion is not severe.",
        archaicTerm: "carbonizing-chamber",
        modernEquivalent: "Heating chamber used to convert the precursor into carbon",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Resistive heating and current distribution",
        formula:
          "P_{\\text{loss}} = I^2 R_{\\text{line}} = \\left(\\frac{P_{\\text{total}}}{V}\\right)^2 R_{\\text{line}}, \\quad R_{\\text{lamp}} = \\frac{\\rho L}{A} \\gg R_{\\text{line}}",
        explanation:
          "A resistive element converts electrical input into heat, and at sufficiently high temperature it emits visible light. Edison frames high resistance as a distribution-system choice: many lamps in parallel can be fed with smaller main conductors than a population of very low-resistance lamps. The specification supplies resistance ranges but does not state a system voltage, current, or percentage saving.",
      },
      {
        principle: "Vacuum protection of hot carbon",
        formula:
          "P_{\\text{evac}} \\le \\frac{1}{10^6}\\text{ atm}, \\quad \\text{Rate}_{\\text{oxidation}} \\propto P_{\\text{O}_2} \\cdot e^{-\\frac{E_a}{k_B T}} \\to 0",
        explanation:
          "A nearly perfect vacuum removes the atmospheric medium that Edison says oxidizes or otherwise injures the hot carbon. He also rejects a gas-filled receiver because rapid gas movement can wear the slightly coherent, highly heated carbon surface. This is the source's physical rationale for exhausting the bulb.",
      },
      {
        principle: "Thermal expansion at the glass seal",
        formula:
          "\\Delta L = \\alpha \\cdot L_0 \\cdot \\Delta T, \\quad \\alpha_{\\text{platinum}} \\approx \\alpha_{\\text{lead-glass}}",
        explanation:
          "The lead wire crosses a difficult interface: it must conduct current without opening the glass seal as temperature changes. Edison says platina is suitable because its expansion is nearly the same as that of glass, reducing the tendency for the lead-through to crack the vacuum bulb.",
      },
    ],
    whyItMattersToday:
      "The patent makes a distribution constraint visible inside an object that later became ordinary. Its claims combine the high-resistance carbon element, an all-glass exhausted receiver, a coiled radiating arrangement, and a carbonization method for the contacts. The attached certificates also show that the historical object is more than its technical pages: its United States term was later administratively tied to foreign patents and then that certificate was canceled.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: manualClaimText(1),
      plainEnglish:
        "This claim covers the lamp as a combination of a high-resistance carbon filament made by the described method and secured to metallic wires. It does not claim every incandescent lamp in the abstract.",
      keyInnovations: ["High-resistance carbon filament", "Metallic-wire connection"],
    },
    {
      number: 2,
      isIndependent: true,
      originalText: manualClaimText(2),
      plainEnglish:
        "This claim protects the combination of carbon filaments, an all-glass receiver, conductors passing through its glass wall, and an exhausted interior.",
      keyInnovations: ["All-glass receiver", "Sealed conductors", "Exhausted interior"],
    },
    {
      number: 3,
      isIndependent: true,
      originalText: manualClaimText(3),
      plainEnglish:
        "This claim narrows the carbon element to a coiled filament or strip connected to conductors so that only part of its surface is exposed as the radiating surface.",
      keyInnovations: ["Coiled carbon filament or strip", "Controlled radiating surface"],
    },
    {
      number: 4,
      isIndependent: true,
      originalText: manualClaimText(4),
      plainEnglish:
        "This claim covers the specified manufacturing method: secure platina contact wires to the carbon filament and carbonize the assembled whole in a closed chamber.",
      keyInnovations: ["Platina contact wires", "Closed-chamber carbonization"],
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Sectional electric lamp",
      caption:
        "Source Fig. 1: carbon spiral a; thickened ends c c′; platina wires d d′; clamps h h; leading wires x x; exterior copper wires e e; and exhaust tube m.",
      svgType: "edison-bulb",
      callouts: [
        {
          id: "edison-fig1-carbon",
          figureRef: "Fig. 1",
          label: "a",
          element: "Carbon spiral or thread",
          description: "The source's carbon light-giving element.",
          x: 52,
          y: 47,
        },
        {
          id: "edison-fig1-contacts",
          figureRef: "Fig. 1",
          label: "c c′",
          element: "Thickened carbon-contact ends",
          description: "Ends formed from the plastic lamp-black-and-tar compound.",
          x: 52,
          y: 50,
        },
        {
          id: "edison-fig1-platina",
          figureRef: "Fig. 1",
          label: "d d′",
          element: "Platina wires",
          description: "The source's period name for the platinum contact wires.",
          x: 52,
          y: 54,
        },
        {
          id: "edison-fig1-pump",
          figureRef: "Fig. 1",
          label: "m",
          element: "Exhaust tube",
          description: "Tube leading to the vacuum pump before it is sealed and trimmed.",
          x: 60,
          y: 16,
        },
      ],
    },
    {
      figureNumber: "Fig. 2",
      title: "Plastic material before winding",
      caption: "Source Fig. 2: the plastic material before it is wound into a spiral.",
      svgType: "edison-bulb",
      callouts: [
        {
          id: "edison-fig2-plastic",
          figureRef: "Fig. 2",
          label: "c",
          element: "Plastic compound strip",
          description: "Tar and lamp-black kneaded into a coherent filamentary thread.",
          x: 50,
          y: 50,
        },
      ],
    },
    {
      figureNumber: "Fig. 3",
      title: "Spiral after carbonization",
      caption: "Source Fig. 3: the carbonized spiral ready to receive a blown glass bulb.",
      svgType: "edison-bulb",
      callouts: [
        {
          id: "edison-fig3-spiral",
          figureRef: "Fig. 3",
          label: "a",
          element: "Carbonized spiral",
          description:
            "The high-resistance carbon filament after heating in a closed carbonizing chamber.",
          x: 50,
          y: 50,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "The specification identifies two linked practical limits: one-to-four-ohm lamps cannot be operated in large numbers in multiple arc without enormous main conductors, and large lead wires make it difficult to keep a glass receiver tight where the wires enter.",
    priorArtLimitations: [
      "Earlier incandescent arrangements described by Edison used one-to-four-ohm carbon rods in closed vessels whose air was replaced by gases that did not combine chemically with carbon.",
      "Those arrangements used large leading wires and a glass vessel cemented to a metallic base, with the carbon clamped to metal.",
      "A gas at atmospheric pressure could avoid chemical attack yet still destroy hot carbon through the source-described air-washing or attrition.",
    ],
    breakthroughInsight:
      "Use a high-resistance carbon light-giver in a nearly perfect vacuum, with platina sealed through glass and a carbonized contact-making method for fragile forms.",
    patentWars: [],
    civilizationalImpact:
      "The technical document connects a lamp's internal construction to a distribution-network constraint. Its four claims preserve the carbon element, exhausted glass receiver, coiled radiating arrangement, and carbonization method as distinct legal combinations rather than reducing the invention to a generic bulb story.",
    aftermath:
      "The facsimile's attached records show that, on December 18, 1882, the United States patent was limited to expire with the shortest-running listed foreign patent under section 4887 of the Revised Statutes. A March 15, 1883 certificate then canceled that earlier certificate and recorded corrections.",
  },
  tags: ["Thomas Alva Edison", "Incandescent lamp", "Carbon filament", "Vacuum technology"],
  stats: {
    totalClaims: 4,
    independentClaims: 4,
  },
};
