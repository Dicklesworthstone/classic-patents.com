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

const sourceSheetPreview = (sheet: 1 | 2, figure: string, description: string) => ({
  src: `/patents/figures/us-319596-maxim-machine-gun/source-sheet-${sheet}-v1.png`,
  alt: `Complete unmodified source drawing sheet ${sheet} of 2 from US 319,596, including ${figure}: ${description}`,
  width: 2320,
  height: 3408,
});

const FIGURES = {
  "Fig. 1": sourceSheetPreview(1, "Fig. 1", "the vertical central longitudinal section"),
  "Fig. 2": sourceSheetPreview(1, "Fig. 2", "the partly sectional plan"),
  "Fig. 3": sourceSheetPreview(2, "Fig. 3", "the breech-case side view"),
} as const;

const figure = (
  label: keyof typeof FIGURES,
  sourceText: string = label,
): CuratedSpecificationInline => ({
  kind: "reference",
  text: sourceText,
  href: "#",
  referenceType: "figure",
  label: `Open the complete source drawing sheet containing ${label} in US 319,596`,
  figurePreviews: [FIGURES[label]],
});

const claim = (number: number, value: string) => ({
  kind: "claim" as const,
  number,
  inlines: text(value),
});

/**
 * A continuous, manually prepared edition of the complete five-sheet US
 * 319,596 facsimile. The source describes a direct muzzle-gas mechanism,
 * rather than the later recoil-operated Maxim mechanism often associated
 * with the inventor's name.
 */
export const maximMachineGunArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "ca385c254e2e390451a2eecd28273fee662afd0179451bcbf9f48bf8fde63dcb",
  preparedBy: "Classic Patents editorial agent (GPT-5.6)",
  preparedAt: "2026-08-18",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE.",
        "HIRAM S. MAXIM, OF LONDON, COUNTY OF MIDDLESEX, ENGLAND.",
        "MACHINE-GUN.",
        "SPECIFICATION forming part of Letters Patent No. 319,596, dated June 9, 1885.",
        "Application filed March 14, 1885. (No model.) Patented in England January 3, 1884, No. 606, and in France June 13, 1884, No. 162,737.",
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIGURES 1-3",
      title: "Sections, plan, and breech-case side view",
      description: [
        { kind: "text", text: "The two drawing sheets contain " },
        figure("Fig. 1"),
        { kind: "text", text: ", " },
        figure("Fig. 2"),
        { kind: "text", text: ", and " },
        figure("Fig. 3"),
        {
          kind: "text",
          text: ". Each preview is the complete source sheet that contains the cited figure.",
        },
      ],
    },
    p("To all whom it may concern:"),
    p(
      "Be it known that I, HIRAM S. MAXIM, a citizen of the United States, residing at London, in the county of Middlesex, England, have invented certain new and useful Improvements in Machine-Guns, of which the following is a specification, reference being had to the drawings accompanying and forming a part of the same, this application being a division of one filed by me May 27, 1884, No. 132,883, and for an invention patented by me in Great Britain January 3, 1884, No. 606, and in France June 13, 1884, No. 162,737.",
    ),
    p(
      "My improvements, which form the subject of this application, relate to a machine or automatic magazine-gun described and shown in my application May 27, 1884, No. 132,883. In the gun referred to the construction is of such nature that the force of the gases which issue from the muzzle of the gun at each discharge of the same is utilized for extracting and ejecting the empty cartridge-case, cocking the hammer, bringing another cartridge into position for firing, and firing the same, or for preparing the arm for the next discharge, or for effecting one or more of these operations, and in some cases storing energy to be subsequently used for effecting the remainder thereof.",
    ),
    paragraph([
      {
        kind: "text",
        text: "The particular means for utilizing the force of the gases in the case referred to comprised a ",
      },
      term(
        "vacuum-chamber",
        "A chamber intended to use reduced pressure created near the muzzle to move a piston.",
      ),
      {
        kind: "text",
        text: ", in communication with a tubular open chamber surrounding the muzzle of the gun, and a movable piston in the chamber, connected with the breech mechanism in such manner that the movement of the piston effected the proper operation of the breech mechanism. In lieu of using in this way the force of the gases indirectly, they may be used directly to effect the several operations of reloading, firing, and extracting; and the subject of my present application is a gun constructed for so utilizing the gases.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "I will describe my invention by reference to the accompanying drawings, in which ",
      },
      figure("Fig. 1", "Figure 1"),
      {
        kind: "text",
        text: " is a vertical central longitudinal section of a gun constructed in accordance with my invention. ",
      },
      figure("Fig. 2"),
      { kind: "text", text: " is a plan of the same, partly in section, on line a c a², " },
      figure("Fig. 1"),
      { kind: "text", text: ". " },
      figure("Fig. 3"),
      {
        kind: "text",
        text: " is a side view of a portion of the breech-case with the parts attached thereto.",
      },
    ]),
    p(
      "A is a strong metal frame, which is provided with a lid or cover, A′, and which may be mounted on any suitable stand or carriage.",
    ),
    paragraph([
      { kind: "text", text: "B is the barrel, which is fixed in the frame A, and C is the " },
      term(
        "breech-block",
        "The sliding rear closure of the barrel that carries the firing and extraction parts.",
      ),
      { kind: "text", text: "." },
    ]),
    p(
      "Fitted upon the muzzle of the gun is a sleeve or tubular piece, l, which piece is firmly united to a socket, l′, free to slide a short distance to and fro on the barrel B, and connected by the side rods or links, m and m′, to levers n, pivoted upon a pin or rod, n′, fixed in the frame A. The diameter of the sleeve or tubular piece l is diminished at its front end in the manner shown, so that a bullet can pass through the same; but the gases issuing from the muzzle of the gun will, by reason of their expansion, act upon the series of shoulders l², and force the tubular piece l and its socket l′ to move forward upon the barrel when the gun is fired.",
    ),
    paragraph([
      {
        kind: "text",
        text: "Two bars or rods, c′ c′, with right-angled ends c², are arranged to slide through apertures, serving as guides, in the frame A. The ends c² of these rods are connected by means of links o with the levers n, as shown in ",
      },
      figure("Fig. 1"),
      {
        kind: "text",
        text: ". The rear ends of the rods c′ are connected with the breech mechanism, as hereinafter described.",
      },
    ]),
    p(
      "d is a slotted arm or cross-head, which is fixed to or formed integrally with the breech-block C, and which is provided with a guide-rod, d′, extending rearwardly therefrom and free to slide to and fro in a guide, d², carried by the frame A. A crank-shaft, e, is carried in bearings e′ fixed to the frame A, and is so arranged that the crank-pin e² fits within the slot in the cross-head d. Two arms, f, are fixed to the crank e at right angles thereto, and a pin or rod, f′, is passed through these arms and connected by the links f² to the rear end of the two rods c′. When the rods are moved rearwardly, the crank e is partially rotated, the said crank acting upon the cross-head d, so as to draw back the breech-block and the crank-pin traveling in the slot in the said cross-head. The crank-shaft e is made with a square portion to receive a hand-wheel, e³, for operating the breech mechanism by hand.",
    ),
    p(
      "g is the extractor, and h the sear, which are both pivoted to the breech-block C, and h′ is a spring fixed to the said sear, and tending to hold the extractor g in engagement with the flange of a cartridge when the latter is inserted in the barrel. This spring also tends to hold the sear h down, so that it will engage with the firing-pin i. The said firing-pin passes longitudinally through the center of the breech-block C, and is encircled by a spiral spring, i′, which tends to press the same forward. The said firing-pin is provided at its rear end with a head, i², which has a knife-edge and a roller, i³, carried by a pin fixed in the said head. A lever, j, is pivoted to the cross-head d, one end of which lever extends upward between the said knife-edge and the roller i³, and the other end of which extends downward into the path of the crank-pin e². These parts are so arranged that during the rearward movement of the cross-head d the crank-pin e² acts upon the lever j and causes it to draw back the firing-pin i until the sear h, which is acted upon by the spring h′, engages with the head i² of the said firing-pin and holds the same in its cocked position. When the sear thus falls into engagement with the firing-pin the extractor g is disengaged from the flange of the cartridge or cartridge-case in the barrel.",
    ),
    p(
      "The feed-wheels Q Q′ are similar to those described in the specification filed with my said former application for Letters Patent, and are operated in a similar manner, the hooked rod K′ for removing or transferring the cartridges from the feed-wheel Q to the feed-wheel Q′ being fixed to the cross-head d.",
    ),
    paragraph([
      {
        kind: "text",
        text: "The return movement of the piston c and parts connected therewith is caused by a ",
      },
      term(
        "volute spring",
        "A flat spiral spring, like a clock spring, wound in a case and used here as the return-energy store.",
      ),
      {
        kind: "text",
        text: ", k, like an ordinary clock-spring. This spring is arranged within a cover or case, k′, to which one end of the said spring is secured, the other end thereof being secured to the crank-shaft e. The cover or case k′ is attached to the frame A by screws k² passing through the slots k³, and the said cover or case is provided with a handle, k⁴, so that it can be adjusted in either direction to regulate the tension of the spring k. By these means the tension of the spring can be so diminished that after the breech-block and other parts have been moved backward by the force of the explosion, the said spring will not cause their return movement. The gun can then be discharged, when desired, by turning the handle k⁴ in the opposite direction.",
      },
    ]),
    p(
      "The operation of this gun is as follows—that is to say, the mechanism is operated by hand until a cartridge is fed into the barrel. The discharge of this cartridge causes the tubular piece l to move forward and the rods c′ are forced backward. In this rearward movement the extractor g withdraws the empty cartridge-case from the barrel B into the uppermost groove of the feed-wheel Q, and the crank-pin e², traveling downward in the slotted cross-head d, acts upon the lever j and draws back the firing-pin i until the sear h falls and its shoulder h² engages with the shoulder i³ of the firing-pin. The downward movement of the sear h disengages the extractor g from the flange of the cartridge-case. The rearward movement of the hooked rod K′ draws a cartridge from the uppermost groove of the feed-wheel Q′ and the projection C⁵ on the breech-block acts upon one of the teeth of the feed-wheel Q and causes the partial rotation of the feed-wheels, as described in the specification above referred to. The energy stored up in the spring k by the partial rotation of the crank e then causes the tubular piece to move back into position, and the breech-block and parts connected therewith to move forward. This forward movement causes the feed-wheels Q Q′ to be again partially rotated by the projection C⁵, so as to bring a fresh cartridge in line with the barrel, and also to bring a fresh cartridge in the feed-wheel Q′ in line with the lowermost groove of the feed-wheel Q. The breech-block is, moreover, driven home—that is to say, driven firmly against the breech end of the barrel—and in its forward movement forces the cartridge into the barrel, and at the moment the breech is closed the crank-pin e² is forced against the end of the sear h, and pushes the same up so as to release the firing-pin i, which is acted upon by the spring i′, and discharges the cartridge in the barrel. This movement of the sear also causes the extractor g to engage with the flange of the said cartridge. The discharge of the fresh cartridge again operates the mechanism in the manner above described. It will therefore be understood that after the first discharge the fire-arm operates automatically until all the cartridges in the magazine or in the feed-wheels are fired.",
    ),
    p(
      "It is obvious that my invention may be applied to various descriptions of fire-arms, either for storing energy, to be subsequently used for effecting the operations necessary in loading and firing the same, or preparing the arm for the next discharge, or for directly effecting one or more of these operations and storing energy to be afterwards used for effecting the remainder of the said operations.",
    ),
    p("What I claim as my invention is—"),
    claim(
      1,
      "The combination, with the sliding breech-block and the loading, firing, and extracting mechanism connected therewith, of the sliding tubular piece surrounding the muzzle and intermediate connections, between the breech-block and the sliding piece, whereby a movement of the latter operates the breech mechanism, as set forth.",
    ),
    claim(
      2,
      "The combination, with the sliding breech-block and the loading, firing, and extracting mechanism connected therewith, of the sliding tubular piece surrounding the muzzle, the rods connecting the said piece with the breech mechanism, and the intermediate lever and link between the tubular piece and the connecting-rods, whereby a forward movement of the former produces a rearward movement of the latter, as described.",
    ),
    claim(
      3,
      "The combination, with the barrel B, of the sliding tubular piece l surrounding the muzzle, socket l′, into which the rear end of the same extends, sliding breech-block C, and bars m and c′, with intermediate links, the said bars and links forming a connection between the sliding breech-block and the tubular piece l, as described.",
    ),
    claim(
      4,
      "The combination of the sliding breech-block and the breech mechanism connected therewith, the crank-shaft e, connected with the breech-block, spring k, secured to the crank-shaft and the frame of the gun, the sliding tubular piece l, surrounding the muzzle, and intermediate connections between the same and the crank-shaft, all as set forth.",
    ),
    p("In testimony whereof I have hereunto set may hand this 16th day of December, 1884."),
    p("HIRAM S. MAXIM."),
    p("Witnesses: J. R. CLARK, Jr., H. M. TAYLOR."),
  ],
};

export const maximMachineGunParallelReadings: Readonly<Record<number, readonly string[]>> = {
  2: ["This is the conventional notice opening the United States specification."],
  3: [
    "Maxim identifies himself as a United States citizen resident in London, connects this filing to an earlier application, and records British and French patents. The present document is a divisional application, so its claims do not automatically cover every mechanism mentioned in the earlier application.",
  ],
  4: [
    "The earlier machine already uses gases issuing at the muzzle to perform part or all of the cycle: remove the fired case, cock the hammer, place another cartridge for firing, fire it, or store energy for later steps. This specification begins by locating the new work within that earlier gas-operated family.",
  ],
  5: [
    "The older arrangement used the muzzle gases indirectly. A vacuum chamber, open chamber around the muzzle, and piston transmitted motion to the breech. Here Maxim replaces that indirect arrangement with direct gas pressure on a movable muzzle sleeve.",
  ],
  6: [
    "Figure 1 is the longitudinal section that shows the gas sleeve, connecting links, breech, and crank linkage in one line of action. Figure 2 is the plan, partly cut on line a c a² of Figure 1. Figure 3 isolates the side of the breech case and the spring case. The links open source crops instead of a modern reconstruction.",
  ],
  7: [
    "A is the structural frame and A′ its lid or cover. The source allows it to sit on any suitable stand or carriage.",
  ],
  8: [
    "Barrel B stays fixed in frame A. Breech-block C is the moving closure and carries the extraction, firing, and sear parts described later.",
  ],
  9: [
    "The operating element is sleeve l around the muzzle, attached to sliding socket l′. Its narrowed front passes the bullet, while the expanding muzzle gases push on shoulders l² and drive the sleeve and socket forward along fixed barrel B. That forward motion, not rearward recoil of the barrel, is the stated power input for this patent.",
  ],
  10: [
    "Rods c′ c′ slide in guides in the frame. At their front ends, links o connect them to levers n, which receive motion from the sleeve-side links m and m′. Their rear ends lead into the breech mechanism. This is the directional reversal chain between a sleeve going forward and a breech mechanism going backward.",
  ],
  11: [
    "Cross-head d is integral with breech-block C and runs on guide d′ in frame guide d². The rods turn crankshaft e through links f² and arms f. The crank pin moves in the cross-head slot and draws the breech-block backward. Square end e³ accepts a hand-wheel so the mechanism can be operated by hand before automatic cycling begins.",
  ],
  12: [
    "Extractor g and sear h are both pivoted on the breech-block. Spring h′ both keeps the extractor engaged with a cartridge flange and biases the sear toward the firing pin. During rearward motion, crank pin e² moves lever j; the lever retracts firing pin i until the sear catches the firing-pin head. Catching the pin also disengages the extractor from the empty case in the barrel.",
  ],
  13: [
    "The source refers back to an earlier filing for the detailed feed-wheel construction. In this grant, it states only that feed-wheels Q and Q′ work similarly and that hooked rod K′, fixed to cross-head d, transfers cartridges from one feed wheel to the other.",
  ],
  14: [
    "Spring k stores return energy as crankshaft e turns. Its case can be turned with handle k⁴ to regulate spring tension. Maxim explicitly says the tension can be reduced enough that the spring does not return the breech after an explosion; in that setting the operator can discharge the gun by turning the handle the other way. The source gives no spring rate or firing rate.",
  ],
  15: [
    "First the operator uses the hand mechanism until a cartridge enters barrel B. Firing drives sleeve l forward and rods c′ backward. The extractor places the empty case in feed-wheel Q, the cross-head and crank cock firing pin i, and the feed wheels rotate partway. Spring k then returns the sleeve and breech forward, advances the feed arrangement again, forces the fresh cartridge into the barrel, and moves the sear to release the firing pin. The sequence repeats until the magazine or feed wheels are empty.",
  ],
  16: [
    "Maxim says the arrangement can be applied to various firearms. He frames the mechanism in functional terms: gas action may directly perform loading or firing steps, store energy for later steps, or do a mixture of both. The legal boundary is narrower: the following four claims require the listed moving muzzle sleeve and connections.",
  ],
  17: [
    "The following four claims define the particular combinations Maxim asks to protect in this grant.",
  ],
  22: [
    "This execution sentence gives the signing date as December 16, 1884. The word “may” is printed in the source and is retained rather than silently corrected.",
  ],
  23: ["HIRAM S. MAXIM signs the completed specification."],
  24: ["J. R. Clark, Jr., and H. M. Taylor are the witnesses listed on the instrument."],
};

export const maximMachineGunRecordCorrections: Pick<
  Patent,
  | "title"
  | "shortTitle"
  | "subtitle"
  | "inventors"
  | "inventorLocation"
  | "filingDate"
  | "categoryLabel"
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
  title: "Machine-Gun",
  shortTitle: "Maxim's Muzzle-Gas Machine-Gun Mechanism",
  subtitle: "A forward-moving muzzle sleeve coupled to a sliding breech-block",
  inventors: ["Hiram S. Maxim"],
  inventorLocation: "London, County of Middlesex, England",
  filingDate: "1885-03-14",
  categoryLabel: "Muzzle-Gas Mechanisms & Automatic Firearms",
  summary:
    "US 319,596 is a divisional specification for a machine-gun mechanism driven directly by gases issuing at the muzzle. Expanding gases push a tapered sleeve and socket forward along a fixed barrel. Links and rods turn that forward sleeve travel into rearward breech motion; a clock-like volute spring returns the mechanism. The four printed claims require combinations of the sliding muzzle sleeve, breech mechanism, connecting rods and links, and, in claim 4, the crankshaft and return spring.",
  heroQuote:
    "In lieu of using in this way the force of the gases indirectly, they may be used directly to effect the several operations of reloading, firing, and extracting.",
  usptoClassification: "F41A 5/02 (Gas-operated automatic-weapon mechanisms)",
  originalText: `UNITED STATES PATENT OFFICE.
HIRAM S. MAXIM, OF LONDON, COUNTY OF MIDDLESEX, ENGLAND.

MACHINE-GUN.

Specification forming part of Letters Patent No. 319,596, dated June 9, 1885. Application filed March 14, 1885. (No model.)

This is a catalogue excerpt. Open Original Patent Text for the complete manually prepared edition, including both drawing sheets, the full specification, all four printed claims, execution, and witnesses.`,
  plainEnglishExplanation: {
    overview:
      "This specification is a particular muzzle-gas mechanism, not a generic account of later Maxim designs. A sleeve surrounding the muzzle moves forward when the firing gases expand against its internal shoulders. A linkage turns that forward movement into rearward breech travel, cocks the firing pin, moves the feed mechanism, and lets a wound spring return the parts for the next cartridge.",
    coreMechanism:
      "Barrel B is fixed in frame A. After a shot, gases at the muzzle expand against shoulders l² inside tapered sleeve l, driving sleeve l and socket l′ forward. Sleeve-side links m and m′ act through levers n, links o, and rods c′. The rods rotate crankshaft e; its crank pin running in slotted cross-head d pulls breech-block C backward. That rearward stroke extracts the fired case, cocks firing pin i, and moves the feed wheels partway. Wound spring k then rotates the crankshaft back, returning the muzzle sleeve and breech forward, feeding a fresh cartridge, closing the breech, and releasing the firing pin.",
    mechanicalBreakdown: [
      {
        title: "Muzzle sleeve and direct gas drive",
        summary:
          "A tapered sleeve around the fixed barrel moves forward under expanding muzzle gases.",
        technicalDetails:
          "Sleeve l is firmly attached to socket l′ but slides a short distance along fixed barrel B. Its front is reduced enough for the bullet to pass. The source says expanding gases act on shoulders l² and push the sleeve forward. It gives no gas pressure, sleeve travel, calibre, or muzzle velocity.",
        archaicTerm: "tubular piece",
        modernEquivalent: "A sliding muzzle-gas operating sleeve",
      },
      {
        title: "Linkage and crank reversal",
        summary: "Links and rods turn the sleeve's forward movement into rearward breech travel.",
        technicalDetails:
          "Side links m and m′ act on levers n; links o connect those levers to rods c′. Rearward rod motion partly turns crankshaft e. Its crank pin moves within cross-head d, which is fixed to breech-block C, and draws the breech backward. The source shows this motion chain but gives no mechanical advantage or timing measurement.",
        archaicTerm: "cross-head",
        modernEquivalent: "A guided sliding link between the crank and breech block",
      },
      {
        title: "Extractor, sear, and firing pin",
        summary:
          "The backward stroke extracts, catches the firing pin, and prepares the next discharge.",
        technicalDetails:
          "Extractor g and sear h pivot on C. During the rearward stroke, crank pin e² acts through lever j to withdraw firing pin i until sear h catches the firing-pin head. The source ties this catch to the extractor's release from the case flange, then describes re-engagement as the forward stroke completes.",
        archaicTerm: "sear",
        modernEquivalent: "The latch that retains and releases the cocked firing pin",
      },
      {
        title: "Adjustable return spring",
        summary:
          "A flat spiral spring returns the operating parts and can be weakened by an external handle.",
        technicalDetails:
          "Volute spring k is secured between a case and crankshaft e. Turning case handle k⁴ alters its tension. Maxim says the tension can be reduced so the parts do not return automatically after the explosion, leaving the operator to discharge by turning the handle in the opposite direction. The specification provides no spring constant or rate of fire.",
        archaicTerm: "volute spring",
        modernEquivalent: "An adjustable clock-like flat spiral return spring",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Muzzle-gas pressure acting on a sleeve",
        formula:
          "F_{\\text{sleeve}}(t) = P_{\\text{blast}}(t) \\cdot (A_{\\text{sleeve}} - A_{\\text{bullet}}), \\quad I = \\int_0^{\\Delta t} F_{\\text{sleeve}}(t) \\, dt",
        explanation:
          "The working impulse in this document is gas expansion at the muzzle acting on the sleeve's shoulders. The source does not state a pressure, area, or impulse value, so a visitor should not infer a numerical force from the drawing alone.",
      },
      {
        principle: "Kinematic motion reversal",
        formula:
          "x_{\\text{breech}}(\\theta) = r_{\\text{crank}} (1 - \\cos\\theta), \\quad \\dot{x}_{\\text{breech}} = -\\left(\\frac{L_{\\text{lever2}}}{L_{\\text{lever1}}}\\right) \\dot{x}_{\\text{sleeve}}",
        explanation:
          "The sleeve travels forward while rods c′ and the breech mechanism travel rearward. Levers n, links o, rods c′, crankshaft e, and slotted cross-head d are the physical chain that reverses the direction and couples the two motions.",
      },
      {
        principle: "Stored elastic return energy",
        formula:
          "U_{\\text{spring}} = \\frac{1}{2} k_{\\theta} \\theta_{\\text{wind}}^2, \\quad \\tau_{\\text{return}} = k_{\\theta} \\theta_{\\text{wind}}",
        explanation:
          "Partial rotation of crankshaft e winds spring k. Its return rotation restores the sleeve and breech, advances the described feed system, closes the breech, and enables the next firing sequence. The facsimile calls the spring like an ordinary clock spring, not a measured spring design.",
      },
    ],
    whyItMattersToday:
      "The document is useful precisely because it separates a particular 1885 muzzle-gas linkage from the generic history often attached to the Maxim name. Its claims show an early automatic-firearm design problem in concrete mechanical terms: collect a transient gas impulse, reverse its direction through rigid links, store part of it in a spring, and coordinate breech, extraction, feed, and firing operations.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "The combination, with the sliding breech-block and the loading, firing, and extracting mechanism connected therewith, of the sliding tubular piece surrounding the muzzle and intermediate connections, between the breech-block and the sliding piece, whereby a movement of the latter operates the breech mechanism, as set forth.",
      plainEnglish:
        "Claim 1 requires a sliding muzzle-surrounding sleeve, a sliding breech-block with loading, firing, and extraction gear, and intermediate connections so movement of the sleeve operates the breech mechanism.",
      keyInnovations: [
        "Sliding muzzle sleeve",
        "Sliding breech-block",
        "Intermediate operating connections",
      ],
    },
    {
      number: 2,
      isIndependent: true,
      originalText:
        "The combination, with the sliding breech-block and the loading, firing, and extracting mechanism connected therewith, of the sliding tubular piece surrounding the muzzle, the rods connecting the said piece with the breech mechanism, and the intermediate lever and link between the tubular piece and the connecting-rods, whereby a forward movement of the former produces a rearward movement of the latter, as described.",
      plainEnglish:
        "Claim 2 adds the named direction-reversing connection: the muzzle sleeve, rods to the breech mechanism, and an intermediate lever and link that turn forward sleeve motion into rearward rod motion.",
      keyInnovations: ["Forward sleeve movement", "Connecting rods", "Intermediate lever and link"],
    },
    {
      number: 3,
      isIndependent: true,
      originalText:
        "The combination, with the barrel B, of the sliding tubular piece l surrounding the muzzle, socket l′, into which the rear end of the same extends, sliding breech-block C, and bars m and c′, with intermediate links, the said bars and links forming a connection between the sliding breech-block and the tubular piece l, as described.",
      plainEnglish:
        "Claim 3 specifies barrel B, sleeve l and its socket l′, sliding breech-block C, bars m and c′, and intermediate links connecting the sleeve to the breech block.",
      keyInnovations: ["Socketed muzzle sleeve", "Named connecting bars", "Breech-block linkage"],
    },
    {
      number: 4,
      isIndependent: true,
      originalText:
        "The combination of the sliding breech-block and the breech mechanism connected therewith, the crank-shaft e, connected with the breech-block, spring k, secured to the crank-shaft and the frame of the gun, the sliding tubular piece l, surrounding the muzzle, and intermediate connections between the same and the crank-shaft, all as set forth.",
      plainEnglish:
        "Claim 4 requires the sliding breech mechanism, crankshaft e, spring k secured to both crankshaft and frame, muzzle sleeve l, and the connections between that sleeve and the crankshaft.",
      keyInnovations: [
        "Crankshaft-linked breech",
        "Frame-anchored return spring",
        "Muzzle-sleeve-to-crank connections",
      ],
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Vertical central longitudinal section",
      caption:
        "The source's central longitudinal section shows the fixed barrel, sliding muzzle sleeve, breech block, rods, crankshaft, extractor and firing parts.",
      svgType: "maxim-machine-gun",
      callouts: [
        {
          id: "maxim-fig1-a",
          figureRef: "Fig. 1",
          label: "A",
          element: "Metal frame",
          description: "The frame that carries barrel B and guides the moving mechanism.",
          x: 45,
          y: 51,
        },
        {
          id: "maxim-fig1-l",
          figureRef: "Fig. 1",
          label: "l",
          element: "Sliding tubular piece",
          description: "The muzzle sleeve that moves forward under expanding muzzle gases.",
          x: 52,
          y: 14,
        },
        {
          id: "maxim-fig1-c",
          figureRef: "Fig. 1",
          label: "C",
          element: "Breech-block",
          description: "The sliding breech block pulled backward through the crank and cross-head.",
          x: 47,
          y: 37,
        },
        {
          id: "maxim-fig1-e",
          figureRef: "Fig. 1",
          label: "e",
          element: "Crank-shaft",
          description:
            "The shaft partly rotated by the rods to operate the breech and return spring.",
          x: 35,
          y: 75,
        },
      ],
    },
    {
      figureNumber: "Fig. 2",
      title: "Partly sectional plan",
      caption:
        "A plan view on line a c a² of Figure 1, showing the same barrel, frame, rods, feed wheels, and controls in plan.",
      svgType: "maxim-machine-gun",
      callouts: [
        {
          id: "maxim-fig2-b",
          figureRef: "Fig. 2",
          label: "B",
          element: "Barrel",
          description: "The barrel, fixed in frame A according to the written specification.",
          x: 50,
          y: 49,
        },
        {
          id: "maxim-fig2-q",
          figureRef: "Fig. 2",
          label: "Q",
          element: "Feed-wheel",
          description:
            "One of the feed wheels referenced to the earlier application for its detailed construction.",
          x: 29,
          y: 70,
        },
      ],
    },
    {
      figureNumber: "Fig. 3",
      title: "Breech-case side view",
      caption:
        "A side view of part of the breech-case and attached spring-case components, including k′, k², k³, and handle k⁴.",
      svgType: "maxim-machine-gun",
      callouts: [
        {
          id: "maxim-fig3-k",
          figureRef: "Fig. 3",
          label: "k′",
          element: "Spring cover or case",
          description: "The case holding spring k; its position can be adjusted using the handle.",
          x: 48,
          y: 37,
        },
        {
          id: "maxim-fig3-k4",
          figureRef: "Fig. 3",
          label: "k⁴",
          element: "Adjustment handle",
          description: "The handle used to regulate the tension of spring k.",
          x: 52,
          y: 60,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "The specification seeks a way to use gases issuing from a gun muzzle to perform the loading, extraction, cocking, firing, and energy-storage operations associated with repeated discharge.",
    priorArtLimitations: [
      "The preceding arrangement used a vacuum chamber, an open chamber around the muzzle, and a movable piston, so that muzzle gases operated the breech indirectly.",
    ],
    breakthroughInsight:
      "Rather than first making a vacuum move a piston, this application places a sliding sleeve around the muzzle and lets expanding gases push directly on its shoulders. The remaining links reverse and distribute that motion through the breech mechanism.",
    patentWars: [],
    civilizationalImpact:
      "Within this document's own boundaries, the contribution is a concrete gas-operated mechanism: a moving muzzle sleeve, reversible linkage, crankshaft, spring, and breech are described as one timed system. The facsimile does not establish the broad military, commercial, or legal history often attached to later Maxim guns.",
    aftermath:
      "The source records a United States filing on March 14, 1885, grant on June 9, 1885, and related British and French patents. It contains no later litigation, adoption, rate-of-fire, or service record.",
    sideNotes: [
      "The drawing sheets are marked “No Model.” and show the inventor's signature by Parkerson Page, attorney.",
      "The execution sentence prints “may hand”; the reviewed edition retains the source wording rather than normalizing it to “my hand.”",
    ],
  },
  tags: ["Hiram S. Maxim", "Machine-Gun", "Muzzle Gas", "Breech Mechanism", "Crankshaft", "Spring"],
  stats: {
    totalClaims: 4,
    independentClaims: 4,
  },
};
