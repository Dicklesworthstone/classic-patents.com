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
  originalTextAsset: {
    url: "/patents/transcripts/us-3541541-engelbart-mouse-reviewed.txt",
    kind: "reviewed-transcription",
    pageCount: 7,
    sourcePdfSha256: engelbartMouseArchivalEdition.sourcePdfSha256,
  },
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
        summary:
          "The housing rests on two wheels whose axes are perpendicular, plus a ball-bearing support.",
        technicalDetails:
          "For a rolling wheel, travel and angular turn have the reading-aid relation $s = r\\theta$. The grant uses perpendicular axes to distinguish the two coordinate directions, but does not specify $r$, a friction model, or a measured resolution.",
        archaicTerm: "position wheels",
        modernEquivalent: "orthogonal displacement transducers",
      },
      {
        title: "Position-Signal Transducers",
        summary:
          "The grant presents potentiometers, a shaft encoder, and incremental encoder/counter arrangements.",
        technicalDetails:
          "In Fig. 4, wheel shafts turn potentiometers and the computer reads their wiper voltages relative to ground. Figs. 5 through 7 show digital readout alternatives. A voltage-divider expression such as $V_{out}=V_{ref}(R_{wiper}/R_{total})$ explains the analog arrangement but supplies no source value for the supply or resistance.",
        archaicTerm: "transducer means",
        modernEquivalent: "position sensor",
      },
      {
        title: "Flexible Conductor and Display Controls",
        summary:
          "A wire carries position signals to the computer, while housing buttons close additional circuits.",
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
        "Claim 1 covers a computer-controlled display system with a movable position indicator: a housing supported by two wheels on perpendicular axes, transducer means for the wheels, and a flexible conductor to the computer.",
      keyInnovations: [
        "Orthogonal dual-wheel housing support",
        "Digital rotary transducer integration",
        "Flexible tethered computer interface",
      ],
      legalSignificance:
        "This independent claim states the two-wheel, transducer, flexible-conductor combination in the display-system setting.",
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText: manualClaimText(2),
      plainEnglish:
        "Claim 2 narrows Claim 1 to an incremental encoder on the first wheel. It generates first and second directional pulses, and a counter reports the net rotation.",
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
        "Claim 3 narrows Claim 2 to a disc with spaced conductor segments, control and stepping contacts, and logic that distinguishes the directional transitions.",
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
        "Claim 4 gives another Claim 1 alternative: a shaft-position encoder with several outputs and corresponding conductors that continuously indicate the apparatus position.",
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
        "Claim 5 is a second independent apparatus claim. It requires the housing, first and second perpendicular position wheels that support it on the surface, and transducer means connected to both wheels.",
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
        "Claim 6 adds coupling means between the transducers and the computer while allowing substantially unrestrained movement of the housing.",
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
        "Claim 7 adds a flexible conductor that carries position signals from the transducers to the computer while allowing the housing to move.",
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
        "Claim 8 is an independent display-system claim: a CRT, a computer that defines a variable cursor and can change the display around it, a surface-moved position control, and at least one display-control switch on that control.",
      keyInnovations: [
        "Interactive CRT cursor positioning system",
        "Desk-surface direct manipulation controller",
        "Housing-mounted display control switch",
      ],
      legalSignificance:
        "This independent claim joins the position indicator and switch to the CRT display system described in the grant.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Display System and Position Indicator",
      caption:
        "Pictorial illustration of the CRT display, computer, typewriter input, position indicator control, wire, and cursor described in the grant.",
      svgType: "engelbart-mouse",
      callouts: [],
    },
    {
      figureNumber: "Fig. 2",
      title: "Sectional Elevation of the Position Indicator",
      caption:
        "Sectional elevation of the housing, switches, wheel/transducer arrangement, and support described in the specification.",
      svgType: "engelbart-mouse",
      callouts: [],
    },
    {
      figureNumber: "Fig. 3",
      title: "Sectional Plan of the Position Indicator",
      caption: "Sectional plan view of the Fig. 2 mechanism.",
      svgType: "engelbart-mouse",
      callouts: [],
    },
    {
      figureNumber: "Fig. 4",
      title: "Potentiometer Readout Circuit",
      caption: "Simplified circuit for monitoring the position indicator with potentiometers.",
      svgType: "engelbart-mouse",
      callouts: [],
    },
    {
      figureNumber: "Fig. 5",
      title: "Shaft-Encoder Circuit",
      caption: "Electrical-circuit embodiment using a shaft encoder.",
      svgType: "engelbart-mouse",
      callouts: [],
    },
    {
      figureNumber: "Fig. 6",
      title: "Incremental-Encoder Circuit",
      caption: "Electrical-circuit embodiment using an incremental encoder and counter.",
      svgType: "engelbart-mouse",
      callouts: [],
    },
    {
      figureNumber: "Fig. 7",
      title: "Further Incremental-Encoder Circuit",
      caption: "Another circuit embodiment employing an incremental encoder.",
      svgType: "engelbart-mouse",
      callouts: [],
    },
  ],
  historicalContext: {
    problemStatement:
      "The specification identifies a display-location problem: a human operator needs to indicate precisely where to alter a CRT display.",
    priorArtLimitations: [
      "The specification says a light-pencil detector is held against the tube while the tube is swept by the beam.",
      "It says this can leave the operator without both hands free to enter changes and can cover part of the display area where changes are entered.",
    ],
    breakthroughInsight:
      "The grant moves the position-control mechanism to a supporting surface. Its preferred construction uses two perpendicular wheels and a third ball-bearing support, then sends position information through a wire to the computer controlling the CRT.",
    patentWars: [],
    civilizationalImpact:
      "The grant supplies a primary-source account of an early computer position-indicator architecture: surface motion becomes wheel rotation, a transducer signal, and a cursor position on a CRT. Broader accounts of later products and adoption require separate, cited historical research and are not asserted here.",
    funFact:
      "The grant itself calls the apparatus an “X-Y position indicator control,” not a mouse.",
    aftermath:
      "The document issued on November 17, 1970 with eight claims. The source record does not by itself establish later licensing, product, or royalty history.",
    sideNotes: [
      "The preferred embodiment permits the indicator to move on a desktop or another surface, and notes that it may even be moved by the feet.",
      "The specification describes potentiometer, shaft-position-encoder, and incremental-encoder alternatives.",
    ],
  },
  tags: [
    "Douglas Engelbart",
    "Position Indicator",
    "Human-Computer Interaction",
    "Stanford Research Institute",
    "Cathode-Ray Tube",
    "Position Transducer",
  ],
  stats: {
    totalClaims: 8,
    independentClaims: 3,
  },
};
