import { sundbackZipperArchivalEdition } from "@/data/editions/sundbackZipperEdition";
import type { Patent } from "@/types/patent";

function manualClaimText(number: number): string {
  const block = sundbackZipperArchivalEdition.blocks.find(
    (candidate) => candidate.kind === "claim" && candidate.number === number,
  );
  if (block?.kind !== "claim") {
    throw new Error(`Sundback Zipper manual edition is missing claim ${number}.`);
  }
  return block.inlines.map((inline) => inline.text).join("");
}

export const sundbackZipperPatent: Patent = {
  id: "us-1219881-sundback-zipper",
  patentNumber: "US 1,219,881",
  title: "Separable Fastener",
  shortTitle: "Sundback Interlocking Scoop Zipper",
  subtitle: "Nested Scoop Teeth, Staggered Cords, and Converging Y-Slider Cam Fastening",
  inventors: ["Gideon Sundback"],
  inventorLocation: "Meadville, Pennsylvania",
  grantDate: "1917-03-20",
  filingDate: "1914-08-27",
  era: "Electrification & Early Modern (1870–1920)",
  category: "consumer",
  categoryLabel: "Mechanical Fasteners & Precision Manufacturing",
  summary:
    "Gideon Sundback's 1917 Separable Fastener patent established the universal modern zipper: identical interchangeable cup-shaped metal scoops clamped along reinforced fabric tape cords that smoothly interlock and disengage through a Y-shaped sliding cam.",
  heroQuote:
    "A snug fit is obtained and at the same time ample provision is made for movement of one on the other without coming out when the fastener is flexed transversely.",
  originalPdfUrl: "/patents/pdfs/us-1219881-sundback-zipper.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US1219881A/en",
  usptoClassification: "24/381",

  originalTextAsset: {
    url: "/patents/transcripts/us-1219881-sundback-zipper-reviewed.txt",
    pageCount: 5,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (Gemini 3.7 Flash)",
    reviewedAt: "2026-09-01",
    sourcePdfSha256: "8b73a4db400d449ec6349a07c05b38df6f5bed609562a2c96ba893890a41a3b9",
  },

  archivalEdition: sundbackZipperArchivalEdition,

  originalText: `Be it known that I, GIDEON SUNDBACK, a subject of the King of Sweden, residing at Meadville, in the county of Crawford and State of Pennsylvania, have invented certain new and useful Improvements in Separable Fasteners, of which the following is a full, clear, and exact specification.

This invention relates to separable fasteners, and has particular reference to that type of fastener for garments and other purposes, where two flexible stringers are locked and unlocked by a sliding cam device mounted on both members, the locking being effected by movement in one direction and unlocking by an opposite movement.

The objects of the present invention are to decrease the weight and bulk, to increase the flexibility and security of locking, and to provide one form of locking member for both stringers, so constructed and arranged that when properly positioned relatively to each other on the stringers they lock and unlock upon proper movement of the cam sliding device.`,

  plainEnglishExplanation: {
    overview:
      "Before Sundback's 1914 breakthrough, continuous garment fasteners like Whitcomb Judson's 1893 'Clasp Locker' and early hook-and-eye chains were unreliable, bulky, and prone to popping open under minimal transverse bending. Sundback revolutionized fastener engineering by replacing complex hooks with identical, precision-stamped metal scoops. Each scoop features a rounded convex projection on one face and a complementary concave hollow recess on the reverse. Crimped at a high linear density (10–11 teeth per inch) along corded textile tapes in a staggered pattern, the teeth are forced into alternating nested engagement by a Y-shaped sliding cam, creating an airtight, flexible closure that stays locked even when folded completely double.",
    coreMechanism:
      "When the Y-shaped slider advances in the closing direction, its converging interior side walls press opposing staggered teeth together at a precise engagement angle (θ ≈ 15°–20°). As each tooth enters the slider's narrow neck, its rounded upper projection nests into the hollow underside recess of the preceding tooth on the opposite stringer. The crimped corded edges of the fabric tape absorb lateral tensile stress (F_pull), while the nested pocket geometry converts transverse peel forces into compressive shear across the metal scoops. Sliding in the opposite direction drives the internal diamond wedge between the tooth rows, levering each nested projection out of its pocket sequentially.",
    mechanicalBreakdown: [
      {
        title: "Interchangeable Cup-Shaped Scoops",
        summary:
          "Precision-stamped metal teeth with top convex projections and bottom concave nesting pockets.",
        technicalDetails:
          "Each scoop is stamped from sheet metal with a truncated conical projection (10) on its upper surface and a matching internal socket (11) on its underside. The teeth are identical on both stringers, eliminating asymmetrical left/right manufacturing dies and ensuring uniform load distribution.",
        archaicTerm: "locking members of elongated cup shape",
        modernEquivalent: "zipper teeth / interlocking scoops",
      },
      {
        title: "Corded Fabric Stringer Tape",
        summary:
          "Textile tape reinforced with cylindrical stitched cords providing a compressive anchor for metal jaws.",
        technicalDetails:
          "Woven fabric stringers (1) have longitudinal cords (2) stitched along both faces. The spread metal clamping jaws (17) are crimped around the corded bead in a die press, distorting the textile fiber to lock the tooth permanently in place without slipping under longitudinal tension ($F_{\\text{shear}} > 300\\text{ N}$).",
        archaicTerm: "beaded or corded edge",
        modernEquivalent: "beaded zipper tape cord",
      },
      {
        title: "Y-Channel Cam Slider",
        summary:
          "Dual-plate sliding cam with converging guide channels and central separating diamond wedge.",
        technicalDetails:
          "The slider (6) consists of upper and lower stamped flanges (7) spaced apart to allow tape passage. A central separating diamond wedge (8) splits the closed chain when pulled backward, while the outer converging side walls force opposing scoops to rotate and seat into full engagement when pulled forward.",
        archaicTerm: "sliding cam operating device",
        modernEquivalent: "slider body and pull tab",
      },
      {
        title: "Wedge Top and Bottom Stops",
        summary:
          "Mechanical limit stops preventing slider derailment and unintended chain splitting.",
        technicalDetails:
          "Bottom stop links (4) permanently bridge the two stringers at the base, while top stop members (5) abut against each other inside the slider throat. Because the combined height of the abutting top stops exceeds the exit channel width, the slider is physically blocked from running off the tape.",
        archaicTerm: "stop members and fastening links",
        modernEquivalent: "top stops and bottom box / pin",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Cam Wedge Mechanical Advantage & Normal Force Resolution",
        formula: "F_{\\text{engage}} = 2 F_{\\text{pull}} \\cot\\theta",
        explanation:
          "The converging flanges of the slider act as inclined wedge planes. Pulling the slider with force $F_{\\text{pull}}$ generates lateral compressive normal forces $F_n = \\frac{F_{\\text{pull}}}{2 \\sin\\theta}$ that squeeze the staggered scoops into positive nested alignment.",
      },
      {
        principle: "Interlocking Scoop Peel & Burst Resistance",
        formula: "F_{\\text{burst}} = 2 N \\mu \\sigma_y A_{\\text{shear}}",
        explanation:
          "Under transverse tensile load across the closed zipper, the nested projections cannot slip out because the overlapping cup lips create an interference fit. Disengagement requires yielding the metal shear area $A_{\\text{shear}}$ or tearing the corded tape core.",
      },
      {
        principle: "Kinematic Pitch Staggering & Stagger Phase Shift",
        formula:
          "p_{\\text{stagger}} = \\frac{1}{2} p_{\\text{tooth}} = \\frac{1}{2 f_{\\text{linear}}}",
        explanation:
          "To allow single-form scoops to mesh continuously, teeth on the right tape are offset longitudinally by exactly half a pitch ($p/2$) relative to the left tape, ensuring each tooth nests symmetrically between two opposing elements.",
      },
    ],
    whyItMattersToday:
      "Gideon Sundback's 1917 design is the exact mechanical architecture used in virtually every metal and molded plastic zipper manufactured worldwide today (over 45 billion units annually by YKK, Talon, and others). It transformed apparel, military flight gear, luggage, aerospace pressure suits, and surgical closures by providing an instantaneous, reusable, high-strength linear mechanical fastener.",
  },

  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: manualClaimText(1),
      plainEnglish:
        "Asserts broad patent ownership over a separable slide fastener comprising a pair of flexible stringers with staggered interlocking members, each having a rounded recess on one face and a matching projection on the reverse, with guide surfaces that allow teeth to ride smoothly over each other during progressive cam engagement.",
      keyInnovations: [
        "Staggered interchangeable teeth",
        "Convex projection with concave nesting socket",
        "Camming guide edge for smooth interlock",
      ],
      legalSignificance:
        "The foundational claim that established legal monopoly over modern interlocking scoop fasteners with nested cup geometry.",
    },
    {
      number: 2,
      isIndependent: true,
      originalText: manualClaimText(2),
      plainEnglish:
        "Specifies that the rounded recess and corresponding projection on each locking member are transversely elongated across the tape width, providing broad load-bearing contact shoulders that prevent accidental unmeshing when the closed fastener is sharply bent or flexed sideways.",
      keyInnovations: [
        "Transversely elongated cup geometry",
        "Increased lateral angular flexibility",
      ],
    },
    {
      number: 3,
      isIndependent: true,
      originalText: manualClaimText(3),
      plainEnglish:
        "Protects interlocking members where the convex projections have inclined end surfaces continuous with the recessed side of the member, acting as positive lead-in ramps that guide cooperating teeth from the opposing tape over and directly into seated engagement.",
      keyInnovations: ["Inclined lead-in guide ramps", "Continuous nesting contours"],
    },
    {
      number: 4,
      isIndependent: true,
      originalText: manualClaimText(4),
      plainEnglish:
        "Covers the complete fastener combination comprising like fabric stringers with alternating stamped teeth, a sliding operating cam moving along both stringers to open and close them, a bottom double-jaw connecting link bridging the tapes, and top stop members limiting travel.",
      keyInnovations: [
        "Complete fastener assembly",
        "Sliding cam actuator",
        "Bottom connecting link and top travel stops",
      ],
    },
    {
      number: 5,
      isIndependent: true,
      originalText: manualClaimText(5),
      plainEnglish:
        "Details the mechanical construction of the Y-slider cam operating device, comprising two parallel plates with diverging internal channels, a central doubled spacer cap positioned between the channels, a fastening rivet passing through, and a pulling tab ring carried by the cap.",
      keyInnovations: [
        "Dual-plate diverging slider channel",
        "Central diamond spacer cap",
        "Riveted pull tab assembly",
      ],
    },
    {
      number: 6,
      isIndependent: true,
      originalText: manualClaimText(6),
      plainEnglish:
        "Protects the fastener system utilizing like fabric stringers with transversely rounded interlocking projections, a bidirectional sliding cam actuator, a double-jaw bottom stop member permanently connecting both stringers, and a separate top stop member on at least one stringer.",
      keyInnovations: [
        "Transversely rounded tooth profile",
        "Dual-channel slide actuation",
        "Permanent bottom bridge and top arrest stop",
      ],
    },
    {
      number: 7,
      isIndependent: true,
      originalText: manualClaimText(7),
      plainEnglish:
        "Protects the slide fastener specifically configured as an opening and closing device for boots, shoes, corsets, and apparel, featuring an internal separating tongue and top stop members that wedge directly against the inclined slider side walls to arrest closing travel without derailment.",
      keyInnovations: [
        "Apparel closure application",
        "Wedge-arrest top stop geometry",
        "Internal separating tongue",
      ],
    },
    {
      number: 8,
      isIndependent: true,
      originalText: manualClaimText(8),
      plainEnglish:
        "Covers an opening and closing device for apparel where the manually controlled slide has internal inclined camming surfaces arranged to engage abutting end stops to limit closing travel, while bottom stop means limit the opening travel of the slider.",
      keyInnovations: ["Inclined cam stop surfaces", "Positive bidirectional slider travel limits"],
    },
    {
      number: 9,
      isIndependent: true,
      originalText: manualClaimText(9),
      plainEnglish:
        "Protects an opening and closing device with flexible carrier tapes, alternating teeth, and a slider having lateral tape passage slots, a central separating tongue splitting the chamber into branch channels, and abutting end members preventing slider detachment from the teeth.",
      keyInnovations: [
        "Lateral tape passage slots",
        "Central separating diamond tongue",
        "Abutting anti-detachment stops",
      ],
    },
    {
      number: 10,
      isIndependent: true,
      originalText: manualClaimText(10),
      plainEnglish:
        "Covers an opening and closing device where each interlocking tooth has a pin-and-recess pair on opposing tape edges, operated by a slider with inclined chamber walls and separating tongue, with a pair of abutting top stop members positioned adjacent the tongue point to arrest closing.",
      keyInnovations: [
        "Pin-and-recess interlocking scoops",
        "Abutting top stop pair at tongue entry",
      ],
    },
    {
      number: 11,
      isIndependent: true,
      originalText: manualClaimText(11),
      plainEnglish:
        "Covers the combined series of stringers with interlocking elements, sliding operator, opening limit means at one end, and cooperating closing limit members at the opposite end adapted to enter the slider and abut each other to limit forward closing movement.",
      keyInnovations: [
        "Serial combination of stringers, teeth, slider, and dual-end limits",
        "Entering end-stop interlock",
      ],
    },
  ],

  drawings: [
    {
      figureNumber: "1",
      title: "Perspective View of Fastener Assembly",
      caption:
        "Overall perspective view of the Hookless No. 2 fastener showing fabric stringers (1), corded edges (2), interlocking teeth (17), slider cam (6), pull tab (16), top stops (5), and bottom link (4).",
      svgType: "sundback-zipper",
      callouts: [
        {
          id: "callout-1-stringer",
          figureRef: "Fig. 1",
          label: "Stringer Tape",
          element: "1",
          description: "Flexible woven fabric mounting tape.",
          x: 20,
          y: 35,
        },
        {
          id: "callout-2-cord",
          figureRef: "Fig. 1",
          label: "Corded Edge",
          element: "2",
          description: "Reinforcing textile cord sewn to tape margin.",
          x: 38,
          y: 45,
        },
        {
          id: "callout-6-slider",
          figureRef: "Fig. 1",
          label: "Slider Cam",
          element: "6",
          description: "Y-shaped channel cam device that forces teeth to lock or unlock.",
          x: 48,
          y: 52,
        },
        {
          id: "callout-5-stop",
          figureRef: "Fig. 1",
          label: "Top Stop",
          element: "5",
          description: "Upper limit stop that blocks slider from running off tape.",
          x: 42,
          y: 15,
        },
        {
          id: "callout-4-bottom",
          figureRef: "Fig. 1",
          label: "Bottom Link",
          element: "4",
          description: "Connecting link joining both tapes at the base.",
          x: 52,
          y: 92,
        },
      ],
    },
    {
      figureNumber: "2",
      title: "Detail of Locking and Unlocking Action",
      caption:
        "Detail view showing the Y-slider cam forcing alternating scoops into nested engagement through diverging guide channels.",
      svgType: "sundback-zipper",
      callouts: [
        {
          id: "callout-2-flange",
          figureRef: "Fig. 2",
          label: "Converging Flanges",
          element: "7",
          description: "Side walls guiding teeth into alternating alignment.",
          x: 35,
          y: 40,
        },
        {
          id: "callout-2-tongue",
          figureRef: "Fig. 2",
          label: "Separating Tongue",
          element: "8",
          description: "Central wedge that levers teeth apart on reverse motion.",
          x: 50,
          y: 30,
        },
      ],
    },
    {
      figureNumber: "3",
      title: "Transverse Section of Clamped Corded Edge",
      caption:
        "Transverse cross section on line 3-3 of Fig. 1 showing metal clamping jaws (17) crimped securely into the corded textile core (2).",
      svgType: "sundback-zipper",
      callouts: [
        {
          id: "callout-3-jaws",
          figureRef: "Fig. 3",
          label: "Clamping Jaws",
          element: "17",
          description: "Contractible jaw legs crimped tight around cord.",
          x: 45,
          y: 50,
        },
        {
          id: "callout-3-cord",
          figureRef: "Fig. 3",
          label: "Compressed Cord",
          element: "2",
          description: "Distorted textile fibers filling jaw cavity.",
          x: 65,
          y: 50,
        },
      ],
    },
    {
      figureNumber: "4",
      title: "Detail Plan View of Single Interlocking Scoop",
      caption:
        "Plan view of a single stamped metal tooth showing clamping jaws (17) in spread and crimped positions, base (9), and internal nesting recess (11).",
      svgType: "sundback-zipper",
      callouts: [
        {
          id: "callout-4-recess",
          figureRef: "Fig. 4",
          label: "Internal Recess",
          element: "11",
          description: "Concave hollow pocket receiving adjacent tooth projection.",
          x: 50,
          y: 30,
        },
        {
          id: "callout-4-spread",
          figureRef: "Fig. 4",
          label: "Spread Jaws",
          element: "17",
          description: "Bifurcated legs spread apart before die crimping.",
          x: 50,
          y: 75,
        },
      ],
    },
  ],

  historicalContext: {
    problemStatement:
      "In the late 19th century, clothing and shoe closures relied entirely on buttons, laces, and hooks-and-eyes, requiring tedious individual fastening. Whitcomb Judson patented the 'Clasp Locker' in 1893 (US 504,038) and the 'C-curity' fastener in 1905, but both designs used complex hook-and-socket links that jammed constantly, rusted, were difficult to manufacture, and burst open when clothing bent.",
    priorArtLimitations: [
      "Judson's 1893 Clasp Locker: crude stamped clasp hooks that jammed in the slider and lacked transverse bending flexibility.",
      "Judson's 1905 C-curity: hook-and-eye chains that popped open unexpectedly when bent across the knee or torso.",
      "Sundback's earlier 1909 'Plako' fastener: hook-and-eye design requiring stiff fabric backing, with teeth that pulled off the tape under moderate tension.",
      "Asymmetrical manufacturing: prior designs required two completely different dies and machines for left and right tape teeth.",
    ],
    breakthroughInsight:
      "Sundback realized that reliable continuous fastening required four synchronized innovations: (1) identical, interchangeable cup-shaped scoops stamped from single dies, (2) high tooth density (10–11 teeth/inch) so individual tooth forces are minimal, (3) clamping the metal jaws directly onto thickened textile cords sewn to the tape edge, and (4) convex-to-concave rounded scoop nesting that permits full transverse flexing and folding without unmeshing.",
    patentWars: [
      {
        rivalName: "Whitcomb Judson / Universal Fastener Company",
        rivalClaim:
          "Universal Fastener Co. claimed ownership over sliding shoe clasps, but their commercial products were market failures due to persistent jamming.",
        conflictDetails:
          "Sundback was hired as chief engineer by Universal Fastener (reorganized as Hookless Fastener Co. in Meadville, PA). After the Plako failed, Sundback spent four years developing the 'Hookless No. 2' (US 1,219,881).",
        resolution:
          "Hookless Fastener Company patented Sundback's design and built automated manufacturing machinery, establishing absolute market dominance.",
        legalOutcome:
          "US 1,219,881 was upheld in multiple infringement suits and became the cornerstone of Talon, Inc.",
      },
      {
        rivalName: "B.F. Goodrich Company (Trademark Coining)",
        rivalClaim:
          "In 1923, B.F. Goodrich ordered Sundback fasteners for their new rubber galoshes and trademarked the onomatopoeic name 'Zipper' for their boots.",
        conflictDetails:
          "The public instantly associated 'zipper' with the slide fastener itself rather than Goodrich's rubber boots.",
        resolution:
          "Goodrich retained the trademark for boots, but 'zipper' became the universal generic name for slide fasteners worldwide.",
        legalOutcome:
          "Hookless Fastener Company rebranded as Talon, Inc. in 1928 and supplied millions of zippers to apparel and military markets.",
      },
    ],
    civilizationalImpact:
      "Sundback's zipper became one of the most widely manufactured precision mechanical devices in human history. It fundamentally altered garment design, replacing buttons on trousers (1930s 'Battle of the Fly'), boots, jackets, and luggage. It was critical to World War II aviation flight suits and life vests, space suits (Apollo and Gemini airtight pressure zippers), and sterile medical closures.",
    aftermath:
      "Talon, Inc. produced over 500 million zippers per year by the mid-20th century. In 1932, Hookless filed a formal disclaimer narrowing Claims 1–3 to thin, flexible teeth, solidifying their patent monopoly against foreign imitators.",
    sideNotes: [
      "Sundback designed the automated 'S-L' (scrapless) manufacturing machine in 1914, which took a spool of Y-shaped brass wire, cut and stamped teeth, and crimped them onto cords at hundreds of teeth per minute.",
      "The US military was the zipper's first major customer: during WWI, the US Navy purchased Sundback fasteners for canvas money belts and airtight flying suits.",
    ],
    funFact:
      "The word 'zipper' was not coined by Sundback, but by B.F. Goodrich executive Bertram Work in 1923, who loved the sound the slider made when pulling up rubber boots: 'Zip!'",
  },

  stats: {
    totalClaims: 11,
    independentClaims: 11,
  },
};
