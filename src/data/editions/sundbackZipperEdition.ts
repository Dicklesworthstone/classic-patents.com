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
const p = (value: string) => paragraph(text(value));

const term = (value: string, definition: string, label?: string): CuratedSpecificationInline => ({
  kind: "term",
  text: value,
  definition,
  label,
});

const sourceSheetPreview = (figure: string, description: string) => ({
  src: "/patents/figures/us-1219881-sundback-zipper/source-sheet-1-v1.png",
  alt: `Complete source drawing sheet 1 of 1 from US 1,219,881, including ${figure}: ${description}`,
  width: 2320,
  height: 3408,
});

const FIGURES = {
  1: sourceSheetPreview(
    "Figure 1",
    "perspective view on an enlarged scale of a separable fastener with slider, stringers, and interlocking members",
  ),
  2: sourceSheetPreview(
    "Figure 2",
    "detail view showing the manner of locking and unlocking teeth through the Y-slider cam channels",
  ),
  3: sourceSheetPreview(
    "Figure 3",
    "transverse cross section on line 3-3 of Figure 1 showing jaws clamped around the corded tape edge",
  ),
  4: sourceSheetPreview(
    "Figure 4",
    "detail plan view of a single interlocking member showing the clamping jaws, base, and internal nesting recess",
  ),
  5: sourceSheetPreview(
    "Figure 5",
    "cross section on line 5-5 of Figure 4 showing the cup-shaped projection on one face and recess on the reverse",
  ),
  6: sourceSheetPreview(
    "Figure 6",
    "detail view of one of the fabric stringer tapes with corded edge reinforcing lines",
  ),
  7: sourceSheetPreview(
    "Figure 7",
    "transverse cross section on line 7-7 of Figure 6 showing cords stitched to opposite faces of the tape",
  ),
  8: sourceSheetPreview(
    "Figure 8",
    "cross section of the Y-shaped slider showing converging cam channels and central guiding wedge tongue",
  ),
  9: sourceSheetPreview(
    "Figure 9",
    "enlarged longitudinal section showing nested engagement of alternating cup-shaped scoops under transverse flexion",
  ),
} as const;

const figure = (
  label: string,
  numbers: readonly (keyof typeof FIGURES)[],
): CuratedSpecificationInline => ({
  kind: "reference",
  text: label,
  href: "#",
  referenceType: "figure",
  label: `Preview ${label} from US 1,219,881 source facsimile`,
  figurePreviews: numbers.map((n) => FIGURES[n]),
});

const claim = (number: number, inlines: CuratedSpecificationInlines) => ({
  kind: "claim" as const,
  number,
  inlines,
});

export const sundbackZipperArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "8b73a4db400d449ec6349a07c05b38df6f5bed609562a2c96ba893890a41a3b9",
  preparedBy: "Classic Patents editorial agent (Gemini 3.7 Flash)",
  preparedAt: "2026-09-01",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE.",
        "GIDEON SUNDBACK, OF MEADVILLE, PENNSYLVANIA, ASSIGNOR TO HOOKLESS FASTENER COMPANY, A CORPORATION OF PENNSYLVANIA.",
        "SEPARABLE FASTENER.",
        "1,219,881.",
        "Specification of Letters Patent. Patented Mar. 20, 1917.",
        "Application filed August 27, 1914. Serial No. 858,848.",
      ],
    },
    {
      kind: "heading",
      level: 3,
      text: "Drawing sheet: printed title and figure schedule",
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIGURES 1-9",
      title:
        "Complete fastener assembly, cam slider operation, clamped corded jaw section, locking member detail and section, tape stringer and cord section, slider cross section, and enlarged interlocking scoops",
      description: [
        {
          kind: "text",
          text: "1,219,881. G. Sundback. Separable Fastener. Application Filed Aug. 27, 1914. Patented Mar. 20, 1917. ",
        },
        figure("Figure 1", [1]),
        { kind: "text", text: ", " },
        figure("Fig. 2", [2]),
        { kind: "text", text: ", " },
        figure("Fig. 3", [3]),
        { kind: "text", text: ", " },
        figure("Fig. 4", [4]),
        { kind: "text", text: ", " },
        figure("Fig. 5", [5]),
        { kind: "text", text: ", " },
        figure("Fig. 6", [6]),
        { kind: "text", text: ", " },
        figure("Fig. 7", [7]),
        { kind: "text", text: ", " },
        figure("Fig. 8", [8]),
        { kind: "text", text: ", " },
        figure("Fig. 9", [9]),
        {
          kind: "text",
          text: ". Witnesses: Lewis C. Bell; Maude Harper. Inventor: Gideon Sundback.",
        },
      ],
    },
    p("To all whom it may concern:"),
    p(
      "Be it known that I, GIDEON SUNDBACK, a subject of the King of Sweden, residing at Meadville, in the county of Crawford and State of Pennsylvania, have invented certain new and useful Improvements in Separable Fasteners, of which the following is a full, clear, and exact specification.",
    ),
    paragraph([
      {
        kind: "text",
        text: "This invention relates to ",
      },
      term(
        "separable fasteners",
        "A mechanical closure device comprising two flexible linear bands bearing interlocking elements that can be joined and separated repeatedly by a sliding cam without sewing, lacing, or individual buttons.",
      ),
      {
        kind: "text",
        text: ", and has particular reference to that type of fastener for garments and other purposes, where two flexible ",
      },
      term(
        "stringers",
        "The elongated fabric mounting tapes that carry the rows of metal interlocking elements along their reinforced longitudinal edges.",
      ),
      {
        kind: "text",
        text: " are locked and unlocked by a ",
      },
      term(
        "sliding cam device",
        "The channel-shaped slider containing converging internal guide surfaces and a central separating wedge (diamond) that forces the teeth into alternating engagement or levers them apart.",
      ),
      {
        kind: "text",
        text: " mounted on both members, the locking being effected by movement in one direction and unlocking by an opposite movement.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "The objects of the present invention are to decrease the weight and bulk, to increase the flexibility and security of locking, and to provide one form of locking member for both stringers, so constructed and arranged that when properly positioned relatively to each other on the stringers they lock and unlock upon proper movement of the cam sliding device. A further object of the invention is to simplify the cam sliding device, which is possible owing to the reduction of locking members to one form for both stringers, instead of the different forms heretofore employed on the respective stringers.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "According to the present invention, the stringers are alike, as in some prior types of this fastener, preferably consisting as herein shown of a fabric tape provided with a ",
      },
      term(
        "beaded or corded edge",
        "A woven textile margin reinforced by longitudinal textile cords sewn to opposite faces of the tape, providing a thickened cylindrical anchor that prevents clamped metal jaws from pulling free under lateral tension.",
      ),
      {
        kind: "text",
        text: ", upon which the locking members are clamped. The locking members are all alike, and therefore interchangeable, and in general form consist of ",
      },
      term(
        "contractible jaw portions",
        "The bifurcated clamping legs at the rear of each metal tooth that are initially spread open to fit over the corded tape edge and subsequently swaged or crimped tight in a die press.",
      ),
      {
        kind: "text",
        text: " which are each clamped upon the tape and projecting locking portions of ",
      },
      term(
        "elongated cup shape",
        "A hollow nested scoop geometry featuring a rounded convex projection on the upper face and a complementary concave hollow pocket on the lower face, enabling adjacent elements to nest securely.",
      ),
      {
        kind: "text",
        text: ", so that the outside of one member nests within the recess of an adjoining member when in locked relation. Consequently, it will be seen that the members on one stringer alternate with those on the other, so that when the sliding operating device is moved back and forth, the locking members will be engaged and disengaged according to the direction of movement. A further feature of the invention resides in the shape and configuration of the locking members, these being as shown in enlarged scale on the drawings, provided with exterior and interior rounded surfaces, and are somewhat elongated transversely. Thereby, a snug fit is obtained and at the same time ample provision is made for movement of one on the other without coming out when the fastener is flexed transversely. At the same time this construction gives facility for relative longitudinal movement, without disengagement.",
      },
    ]),
    paragraph([
      { kind: "text", text: "In the accompanying drawings: " },
      figure("Figure 1", [1]),
      {
        kind: "text",
        text: " is a perspective view on an enlarged scale of a fastener embodying the invention; ",
      },
      figure("Fig. 2", [2]),
      {
        kind: "text",
        text: " is a detail view showing the manner of locking and unlocking; ",
      },
      figure("Fig. 3", [3]),
      {
        kind: "text",
        text: " is a cross section on the line 3—3 of ",
      },
      figure("Fig. 1", [1]),
      {
        kind: "text",
        text: "; ",
      },
      figure("Fig. 4", [4]),
      {
        kind: "text",
        text: " is a detail view of one of the locking members showing the recess; ",
      },
      figure("Fig. 5", [5]),
      {
        kind: "text",
        text: " is a cross section thereof on the line 5—5 of ",
      },
      figure("Fig. 4", [4]),
      {
        kind: "text",
        text: "; ",
      },
      figure("Fig. 6", [6]),
      { kind: "text", text: " is a detail view of one of the stringers; " },
      figure("Fig. 7", [7]),
      {
        kind: "text",
        text: " is a cross section thereof on the line 7—7 of ",
      },
      figure("Fig. 6", [6]),
      {
        kind: "text",
        text: "; ",
      },
      figure("Fig. 8", [8]),
      { kind: "text", text: " is a cross section of the slider; and " },
      figure("Fig. 9", [9]),
      { kind: "text", text: " is an enlarged detail of the locking members." },
    ]),
    paragraph([
      {
        kind: "text",
        text: "1, 1 represent stringers which preferably will be made of woven tape having sewed thereto on opposite sides cords 2—2 to form a beaded edge. 3 represents the line of stitching as employed in the preferred construction. Each of these stringers may be secured together at one end by fastening links 4, and will have at the opposite end a stop member 5. These stop members 5 pass into the slider and limit the locking movement of the slider when they strike each other, because it will be seen from the drawings that the total heights of the stop members 5 when they are in contact with each other is greater than the total width of the channel at the bottom of the slider.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "6 represents the sliding cam operating device, which consists of two stamped sides 7 each having a Y-shaped channel forming a tongue, with their sides separated to permit of the passage of the tape portion of the stringers 1. 8 represents a cap having a point to fit between the diverging channels, and secured to the slider by a rivet 14. 15 is a ring in which may be placed an operating tape or bow 16. The stampings may be integral and doubled over or they may be separate, in either event a rigid structure being provided when the cap 8 is applied thereto and the rivet 14 set.",
      },
    ]),
    paragraph([
      figure("Fig. 4", [4]),
      {
        kind: "text",
        text: " represents one of the locking members, which consists of jaws 17—17 having a base portion 9 which is stamped or otherwise formed to provide an external locking projection 10 and an internal recess 11. These members, as well as the locking members 4 and the stop members 5 are stamped out of flat metal, and the jaws 17, 17 of the locking members are spread apart as shown in dotted lines in ",
      },
      figure("Fig. 4", [4]),
      {
        kind: "text",
        text: " so as to pass over the corded edges 2 of the stringers. Then the jaws are set by a die press or other suitable means, the jaws thereby becoming firmly clamped to the stringers by the compression of the corded edges 2. This will be seen in ",
      },
      figure("Fig. 3", [3]),
      {
        kind: "text",
        text: ", where the corded edges have been distorted by the setting of the locking members thereon so as to completely fill the slot in the locking members, and the jaws 17, 17 engaging firmly on the tape immediately behind the corded edges.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "From the assembly in ",
      },
      figure("Fig. 1", [1]),
      {
        kind: "text",
        text: ", it will be seen that the members 17 on one stringer alternate with those on the other stringer, and consequently it is possible to make the members on both stringers alike and cause them to lock and unlock readily, and remain locked even while the fastener is almost doubled on itself. At the same time, owing to the rounded and transversely elongated shape of the projections and recesses, the fastener is very flexible without being loose. Flexibility is also increased by reason of the relatively large number of locking members provided, which is possible because these members are thin and their projections and recesses can be proportioned so that one will not touch another when the fastener is bent transversely. This is an important consideration in fasteners of this type. Thus it will be seen that the shape of the projections and recesses is such that when engaged, the stringers have practically no movement of separation, but yet the engagement is secure without being stiff, because the locking members on one stringer can rock or oscillate freely relatively to those on the other stringer without disengagement.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "By the present invention, an improved fastener has been produced which is much more simple and cheap to manufacture than others heretofore invented, because both stringers as well as the respective members thereon, are alike, and the members themselves can all be made by simple die operations from flat material. The only assembling operations are those required to attach the members to the tapes. The finishing of the locking members such as smoothing or tumbling is very simple, because all are alike and the dies can be so designed as not to require much subsequent finishing of these members. It will be understood that the connecting members 4 and the stop members 5 may have jaws 17 on each end similar to those of the locking members, which are only on one end. As shown herein, it will be seen that the locking members are of a rounded truncated conical shape, the tops being cut off and rounded so as not to leave projecting edges which would interfere with their engagement and disengagement.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "The novel features of the interlocking and stop members, together with the novel stringer construction, are separately claimed in my application continuous herewith Serial No. 19,474 filed April 6, 1915.",
      },
    ]),
    p(
      "Having thus described my invention, what I declare as new and desire to secure by Letters Patent of the United States is:",
    ),
    claim(
      1,
      text(
        "1. A fastener comprising a pair of flexible stringers, interlocking members secured at one end thereto in staggered relation, each member having at the free end a rounded recess on one side and a corresponding projection on the opposite side, the recessed side and the end surface of the projection of each member meeting in an edge and constituting guiding means enabling said members to ride one on the other in interlocking.",
      ),
    ),
    claim(
      2,
      text(
        "2. A fastener comprising a pair of flexible stringers, interlocking members secured at one end thereto in staggered relation, each member having at the free end a transversely elongated rounded recess on one side and a transversely elongated rounded projection on the opposite side, the recessed side and the transversely elongated end surface of the projection of each member meeting in an edge and constituting guiding means enabling said members to ride one on the other in interlocking.",
      ),
    ),
    claim(
      3,
      text(
        "3. A fastener comprising a pair of flexible stringers, interlocking members secured thereto in staggered relation, each member having a recess on one side and a projection of similar shape on the other, said projections having inclined ends continuous with the recessed side of the member to engage and guide the coöperating member over and into engagement therewith.",
      ),
    ),
    claim(
      4,
      text(
        "4. A fastener comprising a pair of like fabric stringers, a series of like interlocking members secured to the abutting edges of each stringer, those on one stringer alternating with those on the other and having interlocking projections, means sliding on both stringers for actuating said members to lock and unlock according to its direction of movement, a double jaw stop member connecting both stringers at one end, and a separate stop member adapted to pass into said actuating means on at least one stringer at the other end.",
      ),
    ),
    claim(
      5,
      text(
        "5. In a fastener comprising two stringers, a sliding operating device mounted thereon composed of two plates having diverging channels therein, a doubled cap between the diverging channels, a fastening passing through said plates and said cap, and a pulling means carried by said cap.",
      ),
    ),
    claim(
      6,
      text(
        "6. A fastener comprising a pair of like fabric stringers, a series of like interlocking members secured to the abutting edges of each stringer, those on one stringer alternating with those on the other and having transversely rounded interlocking projections, means sliding on both stringers for actuating said members to lock and unlock according to its direction of movement, a double jaw stop member connecting both stringers at one end, and a separate stop member on at least one stringer at the other end.",
      ),
    ),
    claim(
      7,
      text(
        "7. An opening and closing device for shoes, corsets, and other articles of wear, comprising interlocking members on the parts of the articles to be fastened together, a manually controlled slide having a chamber open at one end for the passage of the interlocking members, the side walls of said chamber having inclined faces, the slide having a tongue centrally disposed in said chamber and adapted to engage the said interlocking members on moving the slide in one direction to unlock and open the said members, the said slide when moved in the opposite direction closing the said members, stopping means at one end of the interlocking members to limit the opening movement of the slide, and stopping members at the other end of the interlocking members and adapted to abut against each other, the outer ends of the last mentioned stopping members engaging the inclined faces of the side walls of said chamber to limit the closing movement of the slide.",
      ),
    ),
    claim(
      8,
      text(
        "8. An opening and closing device for shoes, corsets and other articles of wear, comprising interlocking members on the parts of the article to be fastened together, and a manually controlled opener adapted to engage the said interlocking members on moving the opener in one direction to unlock and open the said members, and on moving the opener in the opposite direction to close the said members, stopping means at one end of the interlocking members for engaging the opener to limit the opening movement thereof, stopping members at the other end of the interlocking members and adapted to abut against each other, the said opener being provided with inclined surfaces adapted to be engaged by said stopping members to limit the closing movement of the opener.",
      ),
    ),
    claim(
      9,
      text(
        "9. An opening and closing device comprising flexible carriers adapted to be secured to the parts to be opened and closed, interlocking members attached alternately to the said carriers, a manually controlled slide having a chamber open at one end for the passage of the interlocking members, the sides of said chamber having slots for the passage of the carrier, a tongue disposed in said chamber near the other end of the slide and separating the chamber into sidewise extending branch channels, open at the sides for the passage of the interlocking members, the side walls of said chamber having inclined faces, and abutting members secured to the carriers at one end thereof and adapted to engage the inclined faces of the side wall of said chamber to prevent the slide from disengagement with the interlocking members.",
      ),
    ),
    claim(
      10,
      text(
        "10. An opening and closing device, comprising flexible carriers adapted to be secured along their outer edges to the parts to be opened and closed, interlocking members attached alternately to the free edges of the said carriers, each interlocking member having a pin, a recess, the pin of an interlocking member on one carrier being adapted to engage the recess of the adjacent interlocking member on the other carrier, a manually controlled slide mounted to slide on the said carriers and provided with a chamber, the side walls of said chamber having inclined faces, the said slide having a separating tongue adapted to engage the free ends of the said interlocking members to separate and unlock the members on moving the slide in one direction, the said slide when moved in the opposite direction moving the said interlocking members into interlocking engagement, and a pair of stopping members on the beginning ends of the said carriers and adapted to abut against each other adjacent the point of the said tongue to limit the closing movement of the said slide, the outer ends of said stopping members abutting against the inclined faces of the side walls of the said chamber.",
      ),
    ),
    claim(
      11,
      text(
        "11. The combination in a series: a pair of stringers carrying interlocking members, and a sliding operating device, of means at one end of said stringers for limiting the opening movement of said operating device and a member on the other end of each stringer adapted to pass into said operating device and to engage with the other end member to limit closing movement of said sliding operating device.",
      ),
    ),
    paragraph([
      {
        kind: "text",
        text: "In testimony whereof I affix my signature in presence of two witnesses. GIDEON SUNDBACK. Witnesses: Lewis C. Bell; Maude Harper.",
      },
    ]),
    {
      kind: "heading",
      level: 3,
      text: "Official disclaimer (April 6, 1932)",
    },
    paragraph([
      {
        kind: "text",
        text: "DISCLAIMER. 1,219,881.—Gideon Sundback, Meadville, Pa. SEPARABLE FASTENER. Patent dated March 20, 1917. Disclaimer filed April 6, 1932, by the assignee, Hookless Fastener Company. Therefore disclaims: From the scope of each of claims 1, 2 and 3, any fastener except one in which the longitudinal thickness of the interlocking members and the distances, if any, between the sides of the members and the sides of the recesses and projections, are so slight as to enable the fastener to be bent sharply transversely of its length without opening automatically. [Official Gazette April 26, 1932.]",
      },
    ]),
  ],
};

export const sundbackZipperParallelReadings: Record<number, readonly string[]> = {
  3: [
    "Formal introductory address directed to the Commissioner of Patents and all interested parties.",
  ],
  4: [
    "Official legal statement of citizenship, Swedish nationality, Meadville residence, and declaration of invention in separable slide fasteners.",
  ],
  5: [
    "Field of invention: continuous slide fasteners where two flexible fabric tape stringers are sequentially locked and unlocked by a sliding cam operating in opposite directions.",
  ],
  6: [
    "Statement of technical objectives: reducing bulk, increasing transverse flexibility and burst security, and establishing a single interchangeable stamped tooth design for both stringer tapes.",
  ],
  7: [
    "Core mechanical disclosure: interchangeable cup-shaped scoops stamped from sheet metal with contractible clamping jaws crimped over beaded corded tape edges, nesting sequentially when closed.",
  ],
  8: [
    "Enumeration and brief description of the nine patent drawing figures depicting the fastener assembly, slider kinematics, tooth cross sections, tape mounting, and interlocking scoop geometry.",
  ],
  9: [
    "Mechanical description of stringer tapes with stitched cord reinforcement, bottom stop links, and top stop members that wedge inside the slider channel to prevent accidental slide derailment.",
  ],
  10: [
    "Detailed construction of the Y-slider cam operating device: stamped parallel side plates forming diverging guide channels, central diamond wedge, cap, rivet, and pull tab ring.",
  ],
  11: [
    "Detailed geometry of individual locking scoops: stamped base with convex upper projection and concave lower recess, plus spread clamping jaws crimped into the corded textile core.",
  ],
  12: [
    "Kinematics of alternating engagement: identical teeth on opposing tapes interlock in staggered sequence, allowing full transverse flexion, folding, and articulation without popping open.",
  ],
  13: [
    "Manufacturing advantages: single-die mass stamping from flat brass or nickel-silver strip, minimal tumbling/finishing requirements, and automated crimp attachment to fabric tapes.",
  ],
  14: [
    "Cross-reference notice documenting that specific automated tooth-stamping and stringer manufacturing machinery are protected under co-pending continuation Serial No. 19,474.",
  ],
  15: ["Formal legal preamble introducing the numbered patent claims."],
  27: [
    "Formal execution clause bearing the witnessed signature of inventor Gideon Sundback and witnesses Lewis C. Bell and Maude Harper.",
  ],
  29: [
    "Official 1932 Hookless Fastener Company disclaimer narrowing Claims 1, 2, and 3 to teeth whose thinness and clearances permit sharp transverse bending without self-opening.",
  ],
};
