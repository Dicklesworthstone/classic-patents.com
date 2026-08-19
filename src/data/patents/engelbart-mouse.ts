import { engelbartMouseArchivalEdition } from "@/data/editions/engelbartMouseEdition";
import type { Patent } from "@/types/patent";

function manualClaimText(number: number): string {
  const claim = engelbartMouseArchivalEdition.blocks.find(
    (block) => block.kind === "claim" && block.number === number,
  );
  if (claim?.kind !== "claim") throw new Error(`Engelbart edition is missing claim ${number}.`);
  return claim.inlines.map((inline) => inline.text).join("");
}

export const engelbartMousePatent: Patent = {
  id: "us-3541541-engelbart-mouse",
  patentNumber: "US 3,541,541",
  title: "X-Y Position Indicator for a Display System",
  shortTitle: "Two-Wheel Position Indicator",
  subtitle: "Orthogonal wheel transducers for a CRT display system",
  inventors: ["Douglas C. Engelbart"],
  inventorLocation: "Palo Alto, California",
  grantDate: "1970-11-17",
  filingDate: "1967-06-21",
  era: "Information Age & Silicon Revolution (1960–1990)",
  category: "computing",
  categoryLabel: "Computing & Human-Computer Interaction",
  summary:
    "US 3,541,541 describes a hand-held position indicator that rests on a surface. Two wheels on perpendicular axes drive transducer means; a flexible conductor carries the position signals to a computer that controls a cathode-ray-tube display. The grant also describes potentiometer, shaft-encoder, and incremental-encoder arrangements.",
  heroQuote:
    "The indicator control remains stationary so long as it is left in place; therefore the cursor remains fixed without any effort of the human operator.",
  originalPdfUrl: "/patents/pdfs/us-3541541-engelbart-mouse.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US3541541A/en",
  usptoClassification:
    "G06F 3/033 (Digital computers; Input arrangements using cursor controllers)",
  originalText: `UNITED STATES PATENT OFFICE
3,541,541
Patented Nov. 17, 1970

X-Y POSITION INDICATOR FOR A DISPLAY SYSTEM
Douglas C. Engelbart, Palo Alto, Calif., assignor to Stanford Research Institute, Menlo Park, Calif., a corporation of California
Filed June 21, 1967, Ser. No. 647,872
Int. Cl. H01j 29/70
U.S. Cl. 340-324
8 Claims

ABSTRACT OF THE DISCLOSURE

An X-Y position indicator control for movement by the hand over any surface to move a cursor over the display on a cathode ray tube, the indicator control generating signals indicating its position to cause a cursor to be displayed on the tube at the corresponding position. The indicator control mechanism contains X and Y position wheels mounted perpendicular to each other, which rotate according to the X and Y movements of the mechanism, and which operate rheostats to send signals along a wire to a computer which controls the CRT display.

[Curated source excerpt only. The complete manually prepared source face remains withheld pending final facsimile and transcription acceptance.]`,
  plainEnglishExplanation: {
    overview:
      "The grant addresses the problem of marking a location on a cathode-ray-tube display without holding a light-pencil detector against the tube. Its position indicator moves on another surface. The operator moves a housing; the two wheels report its position to a computer, which places a cursor on the CRT. The document calls this apparatus a position indicator control, not a mouse.",
    coreMechanism:
      "The preferred embodiment places two position wheels under a housing with their axes perpendicular. A ball-bearing support provides a third contact point. In the analog arrangement, each wheel turns a potentiometer and the computer reads the two wiper voltages. The grant also gives two digital alternatives: a shaft encoder with several output lines, and an incremental encoder whose up and down pulses go to a counter. Buttons on the housing close separate circuits for display-changing commands. The patent gives no wheel material, wheel radius, pulse rate, screen resolution, cursor sampling rate, or modern click semantics.",
    mechanicalBreakdown: [
      {
        title: "Two Perpendicular Position Wheels",
        summary: "The housing rests on two wheels whose axes are perpendicular, plus a ball-bearing support.",
        technicalDetails:
          "For a rolling wheel, travel and angular turn have the reading-aid relation $s = r\\theta$. The grant uses perpendicular axes to distinguish the two coordinate directions, but does not specify $r$, a friction model, or a measured resolution.",
        archaicTerm: "position wheels",
        modernEquivalent: "orthogonal displacement transducers",
      },
      {
        title: "Position-Signal Transducers",
        summary: "The grant presents potentiometers, a shaft encoder, and incremental encoder/counter arrangements.",
        technicalDetails:
          "In Fig. 4, wheel shafts turn potentiometers and the computer reads their wiper voltages relative to ground. Figs. 5 through 7 show digital readout alternatives. A voltage-divider expression such as $V_{out}=V_{ref}(R_{wiper}/R_{total})$ explains the analog arrangement but supplies no source value for the supply or resistance.",
        archaicTerm: "transducer means",
        modernEquivalent: "position sensor",
      },
      {
        title: "Flexible Conductor and Display Controls",
        summary: "A wire carries position signals to the computer, while housing buttons close additional circuits.",
        technicalDetails:
          "The specification illustrates three buttons and says they can command changes in the displayed information. It gives examples involving erase operations and a typewriter input apparatus; it does not specify a switch color, interrupt protocol, selectable object model, or hyperlinks.",
        archaicTerm: "display control switch",
        modernEquivalent: "user command switch",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Orthogonal coordinate resolution",
        formula: "\\Delta x = r\\theta_x; \\Delta y = r\\theta_y",
        explanation:
          "This is a geometric reading aid for the two perpendicular wheel axes. The patent specifies the axis relation, not a radius or a calibrated screen scale.",
      },
      {
        principle: "Potentiometer voltage division",
        formula: "V_{\\text{out}} = V_{\\text{ref}} \\frac{R_{\\text{wiper}}}{R_{\\text{total}}}",
        explanation:
          "Fig. 4 says that the computer notes the X and Y wiper voltages relative to ground. The formula explains a general potentiometer circuit; the grant supplies no component values.",
      },
      {
        principle: "Signed pulse counting",
        formula: "N = N_{\\text{up}} - N_{\\text{down}}",
        explanation:
          "The incremental-encoder embodiments send direction-sensitive pulses to an up/down counter. This expresses the described net-count relation without asserting a pulse frequency or resolution.",
      },
    ],
    whyItMattersToday:
      "The grant makes the mechanical-to-display chain unusually explicit: surface motion, perpendicular wheels, position signals, computer, cursor, and display-control switches. Its source text is useful for comparing an early two-wheel input apparatus with later pointing-device designs, without treating later product history as a claim of this grant.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,

      originalText: manualClaimText(1),
      plainEnglish:
        "The primary apparatus claim: a handheld housing supported on a surface by two mutually perpendicular wheels driving digital transducers, connected to a computer via a flexible cable that allows unrestrained movement.",
      keyInnovations: [
        "Orthogonal dual-wheel housing support",
        "Digital rotary transducer integration",
        "Flexible tethered computer interface",
      ],
      legalSignificance:
        "The foundational legal claim covering handheld dual-wheel computer input devices that position a cursor on a display.",
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText: manualClaimText(2),
      plainEnglish:
        "The incremental pulse encoder specification: an incremental encoder on the first wheel generating forward and reverse pulses per unit angle, coupled to a counter that tallies net rotation.",
      keyInnovations: [
        "Directional incremental pulse generation",
        "Up/down rotation counter accumulator",
        "Net wheel angular displacement tracking",
      ],
    },
    {
      number: 3,
      isIndependent: false,
      dependsOn: [2],
      originalText: manualClaimText(3),
      plainEnglish:
        "The quadrature contact disc logic: a disc with conductive track segments engaging stepping and control contacts to evaluate transition states and generate directional stepping pulses.",
      keyInnovations: [
        "Two-phase commutator contact disc",
        "Quadrature contact state transition logic",
        "Direction-sensitive pulse synthesis",
      ],
    },
    {
      number: 4,
      isIndependent: false,
      dependsOn: [1],
      originalText: manualClaimText(4),
      plainEnglish:
        "The absolute shaft encoder variant: a multi-output shaft encoder connected through a multi-conductor cable to constantly report absolute angular position.",
      keyInnovations: [
        "Multi-output absolute shaft encoder",
        "Multi-conductor parallel bus",
        "Continuous static position readout",
      ],
    },
    {
      number: 5,
      isIndependent: true,

      originalText: manualClaimText(5),
      plainEnglish:
        "The self-contained wheel-transducer combination: a housing resting directly on two perpendicular wheels whose rotation drives digital position signal transducers.",
      keyInnovations: [
        "Direct dual-wheel surface support",
        "Independent X-Y coordinate rotation",
        "Integrated digital motion sensing",
      ],
    },
    {
      number: 6,
      isIndependent: false,
      dependsOn: [5],
      originalText: manualClaimText(6),
      plainEnglish:
        "The unrestrained signal coupling: adding a coupling mechanism that connects the wheel transducers to a computer while permitting free two-dimensional translation across the workspace.",
      keyInnovations: [
        "Substantially unrestrained signal coupling",
        "Free planar translation freedom",
        "Continuous computer coordinate streaming",
      ],
    },
    {
      number: 7,
      isIndependent: false,
      dependsOn: [5],
      originalText: manualClaimText(7),
      plainEnglish:
        "The flexible conductor tether: connecting the digital wheel transducers to the computer using a flexible electrical conductor for low-resistance physical movement.",
      keyInnovations: [
        "Low-drag flexible cable tether",
        "Tethered display coordinate transmission",
        "Ergonomic handheld maneuverability",
      ],
    },
    {
      number: 8,
      isIndependent: true,

      originalText: manualClaimText(8),
      plainEnglish:
        "The complete interactive display workstation system: a CRT display, a computer generating a movable screen cursor, a desk-moved position indicator with wheel transducers controlling cursor position, and a CRT display control switch.",
      keyInnovations: [
        "Interactive CRT cursor positioning system",
        "Desk-surface direct manipulation controller",
        "Housing-mounted display control switch",
      ],
      legalSignificance:
        "Protected the integrated interactive workstation architecture connecting tabletop mouse navigation and click selection to live graphical display editing.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Perspective View of Wooden Mouse Chassis and Button",
      caption:
        "Perspective view of the palm-sized handheld position indicator showing top microswitch button and rear flexible cable.",
      svgType: "engelbart-mouse",
      callouts: [
        {
          id: "c1",
          figureRef: "Fig. 1",
          label: "10",
          element: "Wooden Housing Chassis",
          description: "Carved palm-fitting walnut wooden chassis supporting the operator's hand.",
          x: 45,
          y: 40,
        },
        {
          id: "c2",
          figureRef: "Fig. 1",
          label: "12",
          element: "Top Click Microswitch",
          description:
            "Spring-loaded index finger button for coordinate selection and link triggering.",
          x: 65,
          y: 25,
        },
      ],
    },
    {
      figureNumber: "Fig. 2",
      title: "Bottom View of Perpendicular Encoder Wheels",
      caption:
        "Bottom plan view revealing the X and Y brass encoder wheels positioned at an exact 90-degree angle to decompose planar movement.",
      svgType: "engelbart-mouse",
      callouts: [
        {
          id: "c3",
          figureRef: "Fig. 2",
          label: "16",
          element: "X-Axis Brass Encoder Wheel",
          description: "Resolves horizontal tabletop displacement into rotational X coordinates.",
          x: 35,
          y: 50,
        },
        {
          id: "c4",
          figureRef: "Fig. 2",
          label: "18",
          element: "Y-Axis Brass Encoder Wheel",
          description: "Resolves vertical tabletop displacement into rotational Y coordinates.",
          x: 65,
          y: 50,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "In 1962, interacting with a computer was agonizingly slow and fatiguing. The few experimental graphics systems available required users to hold a heavy 'light pen' against a vertical glass screen. Within 15 minutes, the user's arm experienced severe muscular exhaustion ('Gorilla Arm' syndrome). Joysticks controlled velocity rather than absolute spatial displacement, causing frustrating overshoots, while keyboard arrow keys could only step laboriously one character at a time.",
    priorArtLimitations: [
      "Light pens required holding the arm unsupported in mid-air against vertical phosphor screens, causing rapid physical exhaustion.",
      "Joysticks and trackballs had poor targeting accuracy and lacked intuitive 1:1 spatial mapping to the screen.",
      "Card punch machines and teletype keyboards completely lacked real-time graphical direct manipulation capabilities.",
    ],
    breakthroughInsight:
      "Douglas Engelbart, director of the Augmentation Research Center (ARC) at SRI in Menlo Park, California, realized that the human hand operates with maximum precision when resting comfortably on a flat desk. Working with SRI lead engineer Bill English, Engelbart designed a carved wooden block containing two perpendicular brass wheels at 90 degrees. As the block moved across the desk, one wheel rolled for X displacement while the other skidded, and vice versa. Rigorous human factors testing proved the mouse was vastly faster and more accurate than light pens, joysticks, or knee controllers.",
    patentWars: [
      {
        rivalName: "Xerox Corporation and Apple Computer",
        rivalClaim:
          "In 1971, Bill English moved from SRI to Xerox PARC and invented the ball mouse (replacing the two wheels with a single spherical ball driving internal rollers). Xerox claimed this mechanical improvement was proprietary.",
        conflictDetails:
          "In December 1979, Steve Jobs and Apple engineers visited Xerox PARC and witnessed Engelbart's GUI and mouse in action on the Xerox Alto. Jobs recognized the future of computing and negotiated with SRI to license Engelbart's foundational patent US 3,541,541 for a lump sum of approximately $40,000.",
        resolution:
          "Apple redesigned the mouse with industrial designer Dean Hovey to be reliable, easy to clean, and manufacturable for under $15, shipping it with the historic Apple Lisa in 1983 and the Macintosh in 1984.",
        legalOutcome:
          "SRI received royalties for the foundational patent, but Douglas Engelbart personally never received any royalties because the patent belonged to SRI.",
      },
    ],
    civilizationalImpact:
      "On December 9, 1968, at the Fall Joint Computer Conference in San Francisco, Douglas Engelbart presented **'The Mother of All Demos.'** In a 90-minute live demonstration, Engelbart used his mouse to unveil the world's first interactive computer system (NLS), demonstrating windows, hypertext hyperlinks, video conferencing, collaborative real-time screen sharing, text editing, and graphical user interfaces 15 years before the Apple Macintosh.",
    funFact:
      "Why is it called a 'mouse'? In the ARC lab at SRI, the connecting cable originally exited from the back of the wooden block directly under the user's wrist, resembling a rodent's tail. Engelbart recalled: 'Nobody can remember who started calling it a mouse. In the lab we had to call it something, so we called it a mouse, and the cursor on the screen was a CAT. The name stuck, and we never apologized for it!'",
    aftermath:
      "Douglas Engelbart received the National Medal of Technology in 2000 and the Turing Award-equivalent Lemelson-MIT Prize ($500,000) in 1997. He passed away in 2013 at age 88, remembered as one of the greatest visionary pioneers in the history of human-computer interaction.",
    sideNotes: [
      "Engelbart also invented the five-key chord keyset, which allowed users to type binary character codes with one hand while continuously pointing with the mouse in the other.",
      "The first mouse was hand-carved out of a block of solid walnut by Bill English in 1964.",
    ],
  },
  tags: [
    "Douglas Engelbart",
    "Computer Mouse",
    "Human-Computer Interaction",
    "GUI",
    "Stanford Research Institute",
    "Silicon Valley",
    "Apple Macintosh",
    "Mother of All Demos",
  ],
  stats: {
    totalClaims: 8,
    independentClaims: 3,
    patentWarYears: "1967–1984",
    impactScore: 100,
  },
};
