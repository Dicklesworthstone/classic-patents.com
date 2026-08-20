import type {
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

const text = (value: string): CuratedSpecificationInlines => [{ kind: "text", text: value }];
const paragraph = (inlines: CuratedSpecificationInlines) => ({
  kind: "paragraph" as const,
  inlines,
});
const claim = (number: number, value: string) => ({
  kind: "claim" as const,
  number,
  inlines: text(value),
});
const term = (value: string, definition: string): CuratedSpecificationInline => ({
  kind: "term",
  text: value,
  definition,
});

const FIGURES = {
  1: {
    src: "/patents/figures/us-808897-carrier-air-conditioner/fig-1-source-crop-v1.png",
    alt: "US 808,897 Fig. 1: section and elevation of Carrier's air-treating apparatus.",
    width: 1900,
    height: 1320,
  },
  2: {
    src: "/patents/figures/us-808897-carrier-air-conditioner/fig-2-source-crop-v2.png",
    alt: "US 808,897 Fig. 2: enlarged horizontal section through the separating device.",
    width: 480,
    height: 610,
  },
  3: {
    src: "/patents/figures/us-808897-carrier-air-conditioner/fig-3-source-crop-v1.png",
    alt: "US 808,897 Fig. 3: diagram of the separating device.",
    width: 980,
    height: 720,
  },
  4: {
    src: "/patents/figures/us-808897-carrier-air-conditioner/fig-4-source-crop-v1.png",
    alt: "US 808,897 Fig. 4: perspective of one separator plate or element.",
    width: 900,
    height: 1150,
  },
  5: {
    src: "/patents/figures/us-808897-carrier-air-conditioner/fig-5-source-crop-v1.png",
    alt: "US 808,897 Fig. 5: enlarged section of a spray nozzle.",
    width: 600,
    height: 820,
  },
  6: {
    src: "/patents/figures/us-808897-carrier-air-conditioner/fig-6-source-crop-v1.png",
    alt: "US 808,897 Fig. 6: enlarged section in a different plane of a spray nozzle.",
    width: 750,
    height: 820,
  },
} as const;

const figure = (
  number: keyof typeof FIGURES,
  sourceText = `Fig. ${number}`,
): CuratedSpecificationInline => ({
  kind: "reference",
  text: sourceText,
  href: "#",
  referenceType: "figure",
  label: `Preview source ${sourceText} from US 808,897`,
  figurePreviews: [FIGURES[number]],
});

/**
 * A continuous, manually prepared reading of the complete four-sheet source
 * facsimile. It is about an air washer and separator, not Carrier's earlier
 * humidity-control work: this exact grant claims plate geometry for removing
 * liquid and impurities from an air stream.
 */
export const carrierAirConditionerArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "b8cfbb69e27934862236ecabf03396e67d04a4b4011c98083f1205cd76f0291e",
  preparedBy: "Classic Patents editorial agent (GPT-5.6)",
  preparedAt: "2026-08-18",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE.",
        "WILLIS H. CARRIER, OF BUFFALO, NEW YORK, ASSIGNOR TO BUFFALO FORGE COMPANY, OF BUFFALO, NEW YORK.",
        "APPARATUS FOR TREATING AIR.",
        "No. 808,897. Specification of Letters Patent. Patented Jan. 2, 1906.",
        "Application filed September 16, 1904. Serial No. 224,758.",
      ],
    },
    paragraph(
      text(
        "To all whom it may concern: Be it known that I, WILLIS H. CARRIER, a citizen of the United States, residing at Buffalo, in the county of Erie and State of New York, have invented a new and useful Improvement in Apparatus for Treating Air, of which the following is a specification.",
      ),
    ),
    paragraph([
      {
        kind: "text",
        text: "This invention relates to apparatus for treating air previous to its use for ventilating and heating buildings or for other commercial purposes—such as drying, refrigerating, &c.—and more particularly to ",
      },
      term(
        "air-purifying apparatus",
        "An apparatus that washes particles from an air stream and then separates the liquid from that stream.",
      ),
      {
        kind: "text",
        text: " of that kind in which a liquid or solution in a finely-divided condition or atomized spray is introduced into a current of air to be treated, which is then caused to pass through a separator consisting of baffle-plates which intercept and separate from the air the particles of liquid, together with the solid impurities contained therein.",
      },
    ]),
    paragraph(
      text(
        "The object of the invention is to provide an efficient practical apparatus of simple construction which will thoroughly separate all solid impurities, floating particles, and noxious material from the air either with or without altering its temperature and humidity.",
      ),
    ),
    paragraph([
      { kind: "text", text: "In the accompanying drawings, " },
      figure(1, "Figure 1"),
      {
        kind: "text",
        text: " is a view, partly in elevation and partly in vertical section, of an apparatus for treating air embodying the invention. ",
      },
      figure(2, "Fig. 2"),
      {
        kind: "text",
        text: " is a fragmentary horizontal section, on an enlarged scale, of the separating device. ",
      },
      figure(3, "Fig. 3"),
      { kind: "text", text: " is a diagram of the separating device. " },
      figure(4, "Fig. 4"),
      { kind: "text", text: " is a perspective view of one of the separator plates or elements. " },
      figure(5, "Figs. 5"),
      { kind: "text", text: " and " },
      figure(6, "6"),
      {
        kind: "text",
        text: " are enlarged sections in different planes of one of the spray-nozzles detached.",
      },
    ]),
    paragraph(text("Like letters of reference refer to like parts in the several figures.")),
    paragraph([
      {
        kind: "text",
        text: "M represents an air trunk, conduit, or casing, of galvanized iron or other suitable material, through which a current of air is caused to pass in a horizontal direction by a fan or other propelling device K, connected with the casing. In the casing M, preferably near its open intake or front end, is located a spraying device H for introducing water or any other suitable treating liquid or solution into the air passing through the casing. The spraying device may be of any suitable construction which will fill the adjacent portion of the casing with a finely divided or atomized spray of the liquid and cause an intimate contact and mixture thereof with all portions of the air-current. The spray device shown consists of a vertical head or pipe connected with a supply-pipe F and provided with spray-nozzles h of a well-known type, (shown in ",
      },
      figure(5, "Figs. 5"),
      { kind: "text", text: " and " },
      figure(6, "6,"),
      {
        kind: "text",
        text: ") which impart a whirling or circular motion to the issuing liquid and produce a very fine spray or vapor.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "In the casing in rear of the spray device is a separator through which the air is passed for eliminating or separating therefrom the solid particles of foreign matter or impurities, together with all or a portion of the water which was introduced into the air for cleansing it. The separator comprises a series of parallel ",
      },
      term(
        "baffle plates or elements",
        "The upright shaped plates that force the air through repeated turns while collecting liquid on their surfaces.",
      ),
      {
        kind: "text",
        text: ", made of sheet metal or other suitable material, separated by intervening passages for the air and arranged in an upright position, which will be understood to mean either vertically or inclined, so that the liquid or moisture removed from the air can flow down the surface of the plates or elements. The separator elements are provided with oblique faces joined by upright bends or angles, so as to form a series of continuous, sinuous, or zigzag passages between the elements for the air, which in its passage is deflected from side to side and caused to impinge against the alternate faces of the opposite separator plates or elements. Each plate or element comprises a forward portion consisting of oblique faces i, joined by a simple upright bend or angle j, and a rear portion consisting of oblique faces f g, joined by upright bends or angles, which are provided with flanges or portions b c, which project outwardly and rearwardly from the plates or in a direction opposed to the direction of movement of the air and form recesses or gutters.",
      },
    ]),
    paragraph(
      text(
        "The separator plates or elements are preferably constructed as shown in the drawings, from which it will be seen that the front portion of each plate consists of a single section or piece which is bent at the angle j, while the other portion consists of separate sections or pieces riveted or otherwise joined with the front edge of each section projecting beyond the joint to form the flanges b and c. An obvious modification of the construction would be to make each plate or element of a single continuous piece and secure separate narrow strips thereon at the angles to form the flanges b and c. The upright rear edge of the last section f of each plate or element is also formed with or has secured thereto a lip or flange which forms a gutter or recess a.",
      ),
    ),
    paragraph(
      text(
        "The two portions of the separator-plates perform distinct functions. The front portion does not completely separate the particles of the liquid or solution from the air, but only to a sufficient extent to cover the faces i with thin films or streams of the liquid. The air is brought into intimate contact with these films of liquid by reason of the sinuous passage-ways, and all the solid particles of material or impurities contained in the air are thrown against the films of liquid by reason of their inertia and by the action of centrifugal force produced by the sinuous course of the air. The liquid intercepts the impurities and the same are washed down the separator plates or elements by the downwardly-flowing films of liquid and collect in a suitable basin or trap J in the bottom of the casing, from which the liquid passes out through a suitable filter or sieve L. While the liquid is flowing downwardly on the front portions of the separator-plates, due to the action of gravity, it is also propelled forwardly by the current of air across the unobstructed bends j of the front portions of the plates. The entire surface of the front faces i of the plates is kept wet and offers a large area to catch the impurities from the air; but the front portion of the separator plates is not designed to completely remove the particles of liquid from the air. The projecting flanges or lips b c of the rear portion of the plates, however, obstruct the flow of the liquid across the angles from one face to the other of the rear portion of the plates, so that all of the free particles of liquid or any desired proportion thereof can be separated from the air, depending on the number of the faces f g and flanges b c with which the rear portion of the plates are provided. The number of faces of the front portion and faces and flanges of the rear portion of the separator-plates will depend on the desired degree of purification and elimination of moisture from the air.",
      ),
    ),
    paragraph(
      text(
        "The separator-plates can be supported in the casing on transverse horizontal bars e and secured to said bars and the top of the casing by projecting ears or parts d at the lower and upper ends of the plates or they can be mounted and secured in any other desired manner.",
      ),
    ),
    paragraph(
      text(
        "B represents pipe-coils located in a suitable portion of the casing in the path of the air and through which a heating or cooling medium is circulated for raising or lowering the temperature of the air as desired or necessary for the purpose for which the air is to be used. These heating or cooling coils constitute no part of the invention and may be of any known construction and their temperature regulated in any suitable manner. They are omitted when it is not desired to alter the temperature of the air.",
      ),
    ),
    paragraph(
      text(
        "By the described construction of the separator the air is brought into intimate contact with a large wetted surface, whereby all of the impurities are removed from the air and a perfect separation of the free particles of liquid from the air is secured, while at the same time a minimum amount of resistance is offered to the flow of the air. On account of the continuous sinuous passages for the air the latter cannot flow in any but the intended paths, and thereby defeat to a greater or less extent the desired separation of the impurities and moisture. The construction of the separator is exceedingly simple and inexpensive.",
      ),
    ),
    { kind: "heading", level: 2, text: "I claim as my invention—" },
    claim(
      1,
      "In an air-purifying apparatus, the combination of an air-conduit and a separator therein comprising upright plates, each having a succession of oblique faces forming a continuous sinuous surface lengthwise of the conduit and having the front portion of such surface unobstructed to permit the distribution of the liquid along the plate from one face to another, and having its succeeding portion provided with projections which obstruct the flow of the liquid lengthwise of the conduit and promote the separation of the liquid from the air, the plates being spaced from each other to form continuous sinuous air-passages between them, substantially as set forth.",
    ),
    claim(
      2,
      "In an air-purifying apparatus, the combination of means for moistening the air, an air-conduit, and a separator therein comprising spaced upright plates having upright bends providing each plate with a succession of oblique faces and forming continuous sinuous air-passages between the plates, the surface of the front portions of said plates being smooth and unobstructed, and the succeeding portions of said plates having surface projections which obstruct the flow of the liquid lengthwise of the conduit, substantially as set forth.",
    ),
    claim(
      3,
      "In an air-purifying apparatus, the combination of means for moistening the air, an air-conduit, and a separator in said conduit comprising spaced upright plates having upright bends whereby the plates form continuous sinuous air-passages between them, a portion of the bends of each plate being provided with projecting flanges forming upright gutters, substantially as set forth.",
    ),
    claim(
      4,
      "In an air-purifying apparatus, the combination of means for moistening the air, an air-conduit, and a separator in said conduit composed of spaced upright plates having continuous zigzig surfaces and having projections forming gutters at salient portions of said surfaces, substantially as set forth.",
    ),
    claim(
      5,
      "A separator-plate for air-purifiers having separate sections arranged at an angle to each other, with the front portion of the rear section projecting beyond the rear portion of the adjacent front section, thereby forming a gutter at the junction of the sections, substantially as set forth.",
    ),
    paragraph(text("Witness my hand this 14th day of September, 1904.")),
    paragraph([{ kind: "small-caps", text: "WILLIS H. CARRIER." }]),
    paragraph(text("Witnesses: CHAS. W. PARKER, G. B. HORNBECK.")),
  ],
};

/** Non-lossy paragraph companions for the authored Carrier source blocks. */
export const carrierAirConditionerParallelReadings: Readonly<Record<number, readonly string[]>> = {
  1: [
    "Carrier identifies himself, his Buffalo residence, and the document as the specification for his apparatus. This is formal notice, not an additional mechanical limitation.",
  ],
  2: [
    "The scope begins with air treatment before ventilation, heating, drying, refrigeration, or related uses. The specific apparatus is an air washer: a liquid is atomized into the current, then baffle plates remove the liquid together with the particles captured in it.",
  ],
  3: [
    "The stated objective is particulate and noxious-material removal with a simple apparatus. Temperature and humidity may be changed, but the claim is not a claim to controlling them; the apparatus may also operate without changing either.",
  ],
  4: [
    "The drawing sheet has six distinct source views. Figure 1 shows the whole machine; Figures 2 through 4 isolate the separator geometry; Figures 5 and 6 cut through the nozzle in two planes. The figure links preserve that source relationship without sending a visitor to a PDF's first page.",
  ],
  5: [
    "The same letters identify the same physical parts in every drawing. The text relies on those letters, so they are part of the engineering description rather than decorative labels.",
  ],
  6: [
    "M is the air casing and K supplies the moving current. H introduces water or another treating liquid as a fine spray. The printed nozzle construction uses a vertical head, supply pipe F, and nozzles h whose swirling outlet action makes a fine spray. This grant does not specify a chilled-water temperature, a dew-point controller, or a compressor.",
  ],
  7: [
    "Downstream of the spray, upright plates make the air turn repeatedly through a zigzag path. Liquid can drain down the plates while the changing air direction sends particles and droplets toward the plate faces. The front faces i and bend j begin the wet-contact stage; the rear faces f and g, with flanges b and c, add the droplet-separation stage.",
  ],
  8: [
    "Carrier describes one preferred manufacturing method: a bent one-piece front section plus joined rear sections whose overlapping edges form flanges b and c. He expressly allows a single continuous plate with separate strips instead. The rear lip makes gutter a.",
  ],
  9: [
    "The plate has two functional zones. In front, the intent is to keep a wet film on faces i so inertia and turning motion throw airborne dirt into it; the collected liquid runs to trap J and leaves through filter or sieve L. In back, flanges b and c interrupt liquid flow across each bend, so that free droplets can be removed. More rear faces and flanges allow a stronger moisture-removal effect.",
  ],
  10: [
    "Bars e and projecting ears d are one mounting arrangement for the plates. Carrier leaves other ways of securing them open; this description identifies the drawing's hardware rather than making a separate claimed mechanism.",
  ],
  11: [
    "B is a heat-exchange coil in the airflow. It can heat or cool the air, but Carrier explicitly disclaims it as part of this invention. Its presence explains why the apparatus may be used with altered temperature, yet the printed claims concern the separator plates.",
  ],
  12: [
    "Carrier's claimed plate path seeks both large wet contact area and low resistance. Because the passages are continuous and sinuous, the air follows the intended turns instead of bypassing them; that makes contact and droplet separation more reliable.",
  ],
  19: [
    "This is the execution date printed in the grant: September 14, 1904. It is distinct from the September 16 filing date shown in the masthead.",
  ],
  20: ["Willis H. Carrier is the inventor who signs the specification."],
  21: ["Chas. W. Parker and G. B. Hornbeck are the two printed witnesses."],
};
