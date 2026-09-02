import type { Patent, PatentClaim } from "@/types/patent";
import {
  devolProgrammedTransferArchivalEdition,
  devolProgrammedTransferClaimText,
} from "../editions/devolProgrammedTransferEdition";

const patentId = "us-2988237-devol-programmed-transfer";

function decodedClaim(
  number: number,
  isIndependent: boolean,
  subject: string,
  legalWork: string,
  keyInnovations: string[],
  dependsOn?: number[],
  legalSignificance?: string,
): PatentClaim {
  return {
    number,
    isIndependent,
    ...(dependsOn ? { dependsOn } : {}),
    originalText: devolProgrammedTransferClaimText(number),
    plainEnglish: `${subject} ${legalWork} This claim's legal boundary is the listed combination, not the general idea of an industrial robot, a magnetic memory, or feedback control. The source supplies code and apparatus topology but no manipulator dimensions, payload, pressure, travel rate, or modern controller gains.`,
    keyInnovations,
    ...(legalSignificance ? { legalSignificance } : {}),
  };
}

export const devolProgrammedTransferPatent: Patent = {
  id: patentId,
  patentNumber: "US 2,988,237",
  title: "Programmed Article Transfer",
  shortTitle: "Devol Programmed Article-Transfer Controller",
  subtitle: "Magnetic Program Storage, Coded Position Feedback, and Anticipatory Stopping",
  inventors: ["George C. Devol, Jr."],
  inventorLocation: "Greenwich, Connecticut",
  grantDate: "1961-06-13",
  filingDate: "1954-12-10",
  era: "Information Age & Silicon Revolution (1960–1990)",
  category: "computing",
  categoryLabel: "Programmable Industrial Automation",
  summary:
    "US 2,988,237 claims an automatic article-transfer apparatus in which a program controller stores coded destination symbols, a position representation moves with the transfer head, and coincidence detectors control the output when the selected and sensed codes match. The 1954 filing also claims recording the sequence by manually moving the apparatus, anticipatory sensing for slowing before a true stop, magnetic detector and code-member forms, and coordinated article seizure and release.",
  heroQuote:
    "The transfer head may stop or continue moving at an angle to the previous path when coincidence of the codes is detected in the program controller and the position representing means.",
  originalPdfUrl: "/patents/pdfs/us-2988237-devol-programmed-transfer.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US2988237A/en",
  usptoClassification: "214/11; G05B 19/18; B25J 9/16",
  archivalEdition: devolProgrammedTransferArchivalEdition,
  originalTextAsset: {
    url: "/patents/transcripts/us-2988237-devol-programmed-transfer-reviewed.txt",
    pageCount: 13,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (JadeHeron)",
    reviewedAt: "2026-09-01",
    sourcePdfSha256: "9b0ea9729cf6d670a21dfed17264d7b78fa343ab1e98467fc0d3255a5cd03790",
    pageAnchors: [
      {
        page: 1,
        exactSourceText: "PROGRAMMED ARTICLE TRANSFER",
        sourceRelationship: "Printed drawing sheet 1 of 3, with Figures 1 through 3.",
      },
      {
        page: 2,
        exactSourceText: "Program drum 40",
        sourceRelationship: "Printed drawing sheet 2 of 3, with Figures 4 through 8.",
      },
      {
        page: 3,
        exactSourceText: "Magnetic detector",
        sourceRelationship: "Printed drawing sheet 3 of 3, with Figures 9 through 11.",
      },
      {
        page: 4,
        exactSourceText: "The present invention relates to the automatic operation of machinery",
        sourceRelationship:
          "Masthead and opening specification through the code-increment discussion.",
      },
      {
        page: 5,
        exactSourceText: "Fast traverse is best achieved by providing for speed reduction",
        sourceRelationship:
          "Specification on feedback, anticipatory stopping, drawings, and apparatus.",
      },
      {
        page: 6,
        exactSourceText:
          "The sensing head and the transfer head are directly connected to move as a unit",
        sourceRelationship:
          "Illustrative transfer apparatus, encoder, and direct coupling description.",
      },
      {
        page: 7,
        exactSourceText: "FIG. 5 is a side view of an “anticipator” mechanism",
        sourceRelationship: "Encoder-strip construction, anticipator, and program-drum discussion.",
      },
      {
        page: 8,
        exactSourceText:
          "Amplet coincidence detector 100 includes a pair of high-permeability cores",
        sourceRelationship: "Magnetic detector and coincidence-detector descriptions.",
      },
      {
        page: 9,
        exactSourceText:
          "It has been noted that the use of a magnetic drum enables a vast amount of control data to be stored",
        sourceRelationship: "Recording sequence, alternate storage, and end of specification.",
      },
      {
        page: 10,
        exactSourceText: "1. Apparatus having automatic control means",
        sourceRelationship: "Claims 1 through 6.",
      },
      {
        page: 11,
        exactSourceText: "7. Automatically programmed apparatus",
        sourceRelationship: "Claims 7 through 14.",
      },
      {
        page: 12,
        exactSourceText: "15. Apparatus for evidencing the position of a movable member",
        sourceRelationship: "Claims 15 through 26.",
      },
      {
        page: 13,
        exactSourceText: "27. Automatic article transfer apparatus",
        sourceRelationship: "Claims 27 and 28 with cited references.",
      },
    ],
  },
  originalText: `PROGRAMMED ARTICLE TRANSFER

The present invention relates to the automatic operation of machinery, particularly to automatically operable materials handling apparatus, and to automatic control apparatus suitable for such machinery.

An especially desirable form of program controller combined with the transfer mechanism to be controlled represents a further feature of the invention. According to this concept, the transfer mechanism operates the transfer head and at the same time it displaces a position detector or position representing device; and the position detector is compared through a feedback loop with the program controller, until the position detector of the transfer head is displaced into coincidence or matching.`,
  plainEnglishExplanation: {
    overview:
      "Devol addresses a practical gap between a manually directed transfer machine and a purpose-built cam machine. A cam embodies one motion sequence in metal; a human can change the sequence but must remain at the controls. The patent records position and function codes on a program controller, then compares selected instructions with a code representation that moves with the transfer head. The claimed novelty is a specific family of program storage, code sensing, coincidence comparison, recording, and anticipatory-control combinations. It is not a blanket claim to industrial robotics.",
    coreMechanism:
      "A program slot requests a destination code cₚ. The transfer head is mechanically coupled to a position encoder that reports cₛ. A bank of individual coincidence detectors compares corresponding code portions. At a full match, the controller can perform the next function or index the next slot. An anticipator permits an advance sensing relationship before true position sensing, so the apparatus can reduce traverse before the final code match. The grant gives an illustrative one-sixteenth-inch increment but does not provide the head geometry, cylinder diameter, pressure, mass, speed, braking law, or controller gains needed for an SI dynamics calculation. The live exhibit therefore reports discrete code state and refuses fictitious SI performance.",
    mechanicalBreakdown: [
      {
        title: "Program Drum and Tracks",
        summary:
          "Drum 40 stores sequential slots whose tracks can direct separate transfer motions and functions.",
        technicalDetails:
          "A source slot contains a selected position symbol and may contain a function instruction for direction, gripper state, rate, or anticipation. Modernly, this is an ordered instruction memory, but the historical embodiment is magnetic recording. The relationship is $c_p(k) \rightarrow c_p(k+1)$ after a completed programmed step; no drum diameter, rotation speed, or storage density is printed.",
        archaicTerm: "program-controller",
        modernEquivalent: "sequential program store and readout controller",
      },
      {
        title: "Coupled Position Encoder",
        summary:
          "Sensing head 46 moves with the transfer head along code member 50, making feedback a mechanically coupled representation of position.",
        technicalDetails:
          "The key relationship is $c_s = E(q)$, where q is the transfer-head configuration and E is the source's code member and sensing arrangement. The patent emphasizes direct mechanical coupling because recording can be performed by manually moving the apparatus. It does not give a reusable kinematic transform or numerical arm coordinates.",
        archaicTerm: "position representing means",
        modernEquivalent: "mechanically coupled position encoder",
      },
      {
        title: "Coincidence Bank",
        summary:
          "Individual detector channels compare program and sensed code portions; their joint condition controls the powered output.",
        technicalDetails:
          "For a binary teaching projection, coincidence means $d_H(c_p,c_s)=0$, where $d_H$ counts unlike code bits. This is a modern explanation of the source's matching bank, not a claim that Devol used present-day digital logic. The source itself permits magnetic detector forms and says other coincidence detectors may be substituted.",
        archaicTerm: "coincidence detector",
        modernEquivalent: "parallel equality comparator",
      },
      {
        title: "Anticipator and Gripper Function",
        summary:
          "The anticipator shifts from advance sensing to true-position sensing, while a separate controlled function can seize or release an article.",
        technicalDetails:
          "The legal device recognizes approaching coincidence before final coincidence so a rate-control path can change state. A second recorded function controls jaw 44. The source gives the causal order, $\text{advance match} \rightarrow \text{slow search} \rightarrow \text{true match}$, but not a stopping-distance model, grip force, or hydraulic flow.",
        archaicTerm: "article seizing means",
        modernEquivalent: "program-controlled gripper or end effector",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Coded feedback equality",
        formula: "$d_H(c_p,c_s)=0$",
        explanation:
          "A compact modern rendering of the claimed coincidence condition: the program code cₚ and the mechanically sensed code cₛ must have no unequal channels. The equation is logical, not an SI force equation, and the visual labels its slots as codes rather than distances.",
      },
      {
        principle: "Mechanically coupled encoder state",
        formula: "$c_s=E(q)$",
        explanation:
          "The encoder's code is a function of the transfer head's configuration because the sensing head is coupled directly to it. The patent gives the architecture and one illustrative spatial increment, but no dimensions that would specify q in a general machine.",
      },
      {
        principle: "Anticipatory two-stage control",
        formula:
          "$mathrm{advance match}\rightarrowmathrm{rate reduction}\rightarrowmathrm{true match}$",
        explanation:
          "The anticipator changes the sensing relationship after an early match, allowing a slower final approach. It establishes a state sequence, not a source-derived velocity profile or braking dynamics.",
      },
    ],
    whyItMattersToday:
      "The document is useful because it makes the architecture of programmable automation visible in hardware terms: destination memory, a position representation that follows the output, a comparator, record and replay, and a separately coordinated gripper command. Later industrial robots use different sensors, drives, encoders, and software, but the distinction between a stored task state and a sensed machine state remains a clear teaching bridge.",
  },
  claims: [
    decodedClaim(
      1,
      true,
      "Claim 1 claims the broad apparatus combination of a powered mechanical output, its coupled position representation, a unique combinational code at each represented position, stored selected code symbols, and a corresponding bank of coincidence detectors.",
      "It requires joint detector-responsive output control, so a transfer machine without its recited coded feedback architecture does not meet the claim.",
      ["Combinational code member", "Coupled sensing units", "Coincidence detector bank"],
      undefined,
      "Principal independent claim for the coded position-feedback architecture.",
    ),
    decodedClaim(
      2,
      false,
      "Claim 2 narrows claim 1 with different control while approaching a selected position and progressive rate control as detectors approach complete coincidence.",
      "The dependent limitation connects partial match to rate behavior rather than merely requiring an eventual stop.",
      ["Progressive coincidence", "Approach-rate control"],
      [1],
    ),
    decodedClaim(
      3,
      false,
      "Claim 3 adds an adjustable mechanical coupling between the output and position representation, switched from advance sensing to true-position sensing when coincidence is detected.",
      "It is the claim form of the anticipator mechanism: an early relation and a final relation are both required.",
      ["Adjustable sensing coupling", "Advance-to-true sensing"],
      [1],
    ),
    decodedClaim(
      4,
      false,
      "Claim 4 adds plural detector connections that progressively reduce rate as the number of coincident channels increases.",
      "It specifically ties partial code agreement to staged rate reduction rather than claiming all feedback deceleration.",
      ["Plural detector controls", "Progressive rate reduction"],
      [1],
    ),
    decodedClaim(
      5,
      false,
      "Claim 5 adds recording elements and switching that connect sensed positions to the program controller during teaching, then connect them to coincidence detectors during replay.",
      "Its legal work is the record/replay changeover for a sequence later to be performed automatically.",
      ["Position recording elements", "Record/replay switching"],
      [1],
    ),
    decodedClaim(
      6,
      true,
      "Claim 6 applies the coded position architecture to an article-handling machine with a transfer head and article gripper.",
      "It combines transfer-head feedback, sequential code recording, and gripper control symbols; it does not cover an arbitrary articulated arm that lacks those parts.",
      ["Transfer head", "Article gripper", "Recorded position symbols"],
      undefined,
      "Independent article-handling form that explicitly brings the gripper into the programmed combination.",
    ),
    decodedClaim(
      7,
      true,
      "Claim 7 claims a movable output with a fixed-versus-coupled pattern and sensing portion, two-kind control patterns, and balanced or unbalanced coincidence detectors.",
      "It defines a specific detector behavior for matching and mismatching code inputs, including two pattern kinds.",
      ["Two-kind control patterns", "Balanced coincidence detector", "Power-actuator coupling"],
      undefined,
    ),
    decodedClaim(
      8,
      true,
      "Claim 8 claims an article transfer head whose position representation operates in an anticipation-sensing relationship and changes to true-position sensing in response to sensing.",
      "It separates the two sensing relationships as the operative limitation rather than claiming the general aspiration of stopping accurately.",
      ["Anticipation sensing", "True-position sensing", "Transfer-head drive"],
      undefined,
      "Independent anticipator claim tied to an article-handling machine.",
    ),
    decodedClaim(
      9,
      true,
      "Claim 9 claims sequential program-control slots with parallel two-condition outputs, a coordinated position representation, and parallel coincidence comparisons.",
      "The legal boundary is the parallel slot and comparator structure that controls the mechanical output, not a generic stored instruction list.",
      ["Sequential control slots", "Parallel-output sensors", "Parallel coincidence detectors"],
      undefined,
    ),
    decodedClaim(
      10,
      false,
      "Claim 10 narrows claim 9 by adding recording elements for one control slot and switching between recording and coincidence connections.",
      "It covers a particular way to place the same sensing units into teaching or comparison service.",
      ["Control-slot recording", "Selective switching"],
      [9],
    ),
    decodedClaim(
      11,
      false,
      "Claim 11 narrows claim 9 with recording elements for both the program-controller slot and the position representation, using a source of combinational codes.",
      "It requires the same code sequence to identify selected output positions and to be recorded into respective program slots.",
      ["Shared code source", "Dual recording paths"],
      [9],
    ),
    decodedClaim(
      12,
      true,
      "Claim 12 claims a transfer head, stored position symbols of two bit types, corresponding sensed position symbols, a mechanical coupling, and detector responses that distinguish match from mismatch.",
      "It focuses the legal scope on equal-width symbolic comparisons coupled mechanically to the head.",
      ["Two-type position bits", "Mechanical encoder connection", "Match/mismatch response"],
      undefined,
    ),
    decodedClaim(
      13,
      true,
      "Claim 13 claims an article-seizing device controlled by a magnetic program controller, feedback code generation, coincidence response, and timed gripper control.",
      "The gripper command must be coordinated with selective positioning; the claim is not simply a claim to a gripper.",
      ["Magnetic program controller", "Feedback code", "Timed article seizing"],
      undefined,
    ),
    decodedClaim(
      14,
      true,
      "Claim 14 is a method claim for operating a transfer head across a predetermined article arrangement, recording distinctive position codes and seize/release indicia, then using them in later control.",
      "It protects the teach-and-replay process as a method, not only the hardware arrangement.",
      ["Recorded transfer positions", "Coordinated seize/release indicia", "Replay method"],
      undefined,
      "Independent method claim for recording and later using the article-transfer sequence.",
    ),
    decodedClaim(
      15,
      true,
      "Claim 15 claims an apparatus that evidences a movable member's position using biased and alternating-current excited magnetic detectors opposite a combinational code member.",
      "It limits the claim to the detector, code-member, coordinated movement, and arrival indication combination.",
      ["Magnetic detectors", "Combinational code member", "Arrival indication"],
      undefined,
    ),
    decodedClaim(
      16,
      true,
      "Claim 16 claims a movable member, a magnetic recording and sensing position representation, a magnetically recorded program device, coincidence detection, and operation through the recorded sequence.",
      "It combines program storage with position evidence and output movement rather than claiming any magnetic recorder alone.",
      ["Magnetic position recording", "Program-device code sequence", "Coincidence control"],
      undefined,
    ),
    decodedClaim(
      17,
      false,
      "Claim 17 narrows claim 16 by adding an article holder and program-controlled seizing and release between transfer strokes.",
      "It imports the base magnetic programmed apparatus and specifies its gripper coordination.",
      ["Article holder", "Program-controlled seize/release"],
      [16],
    ),
    decodedClaim(
      18,
      false,
      "Claim 18 narrows claim 16 with recording means near the program device and a selectable arbitrary-code source that records both position and program codes concurrently.",
      "It captures a particular teaching arrangement for deliberately placed positions.",
      ["Arbitrary code source", "Concurrent position and program recording"],
      [16],
    ),
    decodedClaim(
      19,
      true,
      "Claim 19 claims a master controller selected symbol, a mechanically coupled position representation with advance and true-position adjustments, and an anticipation-responsive adjustment.",
      "Its legal focus is the two-state sensing relationship controlled by detected anticipation.",
      ["Master-controller readout", "Advance sensing", "True-position adjustment"],
      undefined,
    ),
    decodedClaim(
      20,
      false,
      "Claim 20 narrows claim 19 to a master controller that stores a sequence of position symbols and reads a selected one.",
      "The dependent claim makes the controller's sequential stored-symbol function explicit.",
      ["Stored symbol sequence", "Selected-symbol readout"],
      [19],
    ),
    decodedClaim(
      21,
      false,
      "Claim 21 narrows claim 19 where the output supports an article gripper and the controller separately produces gripper-control symbols.",
      "It connects gripper commands to the position-symbol controller without claiming all gripper control.",
      ["Article gripper", "Separate gripper-control symbols"],
      [19],
    ),
    decodedClaim(
      22,
      true,
      "Claim 22 claims magnetic detectors and a combinational code member for identifying a movable member's position, including concurrent coordinated movement.",
      "It is a detector-and-code-member claim without the arrival-indicating addition of claim 15.",
      ["Magnetically biased detectors", "Unique code patterns", "Coordinated detector motion"],
      undefined,
    ),
    decodedClaim(
      23,
      true,
      "Claim 23 claims a coupled mechanical output, mutually independent sensing elements, uniquely different code combinations, and recording of their responses in a program controller.",
      "It protects the architecture for recording selected mechanical positions as code combinations.",
      ["Independent sensing elements", "Unique position codes", "Program-controller recording"],
      undefined,
    ),
    decodedClaim(
      24,
      true,
      "Claim 24 claims a movable mechanical output, independent-output magnetic detectors, a uniquely coded magnetic member, and a coupling enforcing coordinated adjustment.",
      "Its boundary is the physical detector/code-member coupling for a range of sensing positions.",
      [
        "Independent detector windings",
        "Magnetically distinct code portions",
        "Coordinated adjustment coupling",
      ],
      undefined,
    ),
    decodedClaim(
      25,
      true,
      "Claim 25 claims an article carrier, magnetic coded-position sensing, a coordinate coupling, magnetic program storage, sequential code readout, and coincidence control.",
      "It combines the carrier with both storage and comparison, rather than merely sensing an article position.",
      ["Article carrier", "Magnetic storage program controller", "Sequential code readout"],
      undefined,
    ),
    decodedClaim(
      26,
      true,
      "Claim 26 claims a mechanical output coupled to periodically excited magnetic sensing elements and a uniquely contrasting magnetic code member, with recording into magnetic program storage.",
      "It is the magnetic-storage form of the coded-position recording architecture.",
      [
        "Periodically excited sensing elements",
        "Contrasting magnetic code portions",
        "Magnetic response recording",
      ],
      undefined,
    ),
    decodedClaim(
      27,
      true,
      "Claim 27 claims a transfer head with article-seizing means, a carrier and support on different strokes, separate power devices, and selective program controls that coordinate the motions and gripper.",
      "The claim is tied to its multi-stroke transfer apparatus and coordinated selective indicia, not every program-controlled pick-and-place system.",
      ["Multi-stroke transfer head", "Separate power devices", "Coordinated program indicia"],
      undefined,
      "Independent figure-level apparatus claim for the transfer head, support, and gripper sequence.",
    ),
    decodedClaim(
      28,
      true,
      "Claim 28 claims a magnetizable medium, combined recording and sensing magnetic devices, a moving relation coordinated with a mechanical output member, and uniquely recorded locations.",
      "It protects recorded position evidence in the stated medium-and-device relationship.",
      [
        "Magnetizable recording medium",
        "Recording and sensing devices",
        "Unique recorded control areas",
      ],
      undefined,
    ),
  ],
  drawings: [
    {
      figureNumber: "1–3",
      title: "Programmed transfer apparatus and position encoder",
      caption:
        "Source Figures 1–3: a track-borne transfer apparatus with pallets and conveyor, its plan, and the edge-notched combinational code strips read by sensing elements.",
      svgType: "devol-programmed-transfer",
      callouts: [
        {
          id: "transfer-apparatus",
          figureRef: "Fig. 1",
          label: "Transfer apparatus",
          element: "10",
          description: "The illustrative mobile apparatus carrying the transfer mechanism.",
          x: 31,
          y: 48,
        },
        {
          id: "program-drum",
          figureRef: "Fig. 1",
          label: "Program drum",
          element: "40",
          description: "Stored sequential control positions and functions.",
          x: 45,
          y: 35,
        },
        {
          id: "encoder",
          figureRef: "Fig. 3",
          label: "Position encoder",
          element: "50",
          description: "Stacked edge-notched code strips sensed with the transfer head.",
          x: 50,
          y: 49,
        },
      ],
    },
    {
      figureNumber: "4–6",
      title: "Control, anticipator, and rate-control forms",
      caption:
        "Source Figures 4–6: magnetic-program control, the advance-to-true sensing anticipator, and high/middle/low-order rate control.",
      svgType: "devol-programmed-transfer",
      callouts: [
        {
          id: "coincidence",
          figureRef: "Fig. 4",
          label: "Coincidence detector",
          element: "100",
          description: "Comparison channel for program and position code information.",
          x: 50,
          y: 43,
        },
        {
          id: "anticipator",
          figureRef: "Fig. 5",
          label: "Anticipator sensing head",
          element: "70",
          description: "Sensing head adjusted between advance and true-position relationships.",
          x: 44,
          y: 46,
        },
        {
          id: "rate-control",
          figureRef: "Fig. 6",
          label: "Rate-control orders",
          element: "84, 86, 88",
          description:
            "High, middle, and low code orders used in the illustrated staged rate control.",
          x: 50,
          y: 45,
        },
      ],
    },
    {
      figureNumber: "7–11",
      title: "Recording medium and magnetic detectors",
      caption:
        "Source Figures 7–11: deformable-sheet recording medium, two magnetic detector circuits, and a code-source/program-drum variant.",
      svgType: "devol-programmed-transfer",
      callouts: [
        {
          id: "recording-sheet",
          figureRef: "Fig. 7",
          label: "Recording sheet",
          element: "142",
          description: "Flexible metal storage sheet with deformable bands.",
          x: 48,
          y: 50,
        },
        {
          id: "magnetic-detector",
          figureRef: "Fig. 9",
          label: "Magnetic detector",
          element: "A–G",
          description: "Two-core detector arrangement for magnetic drum recordings.",
          x: 50,
          y: 51,
        },
        {
          id: "code-source",
          figureRef: "Fig. 11",
          label: "Code source",
          element: "150",
          description: "Code source used with recording channel and program drum.",
          x: 18,
          y: 35,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "The grant identifies a choice between flexible but labor-intensive manual handling and specialized cam-controlled handling whose task sequence is expensive to change. Its example is a pallet-and-conveyor article-transfer apparatus that must select motions and article operations in a recorded order.",
    priorArtLimitations: [
      "Manual hydraulic, electric, or other powered handling could adapt quickly but kept an operator in the loop.",
      "Cam control mechanized repetitive work but embodied a specialized motion sequence and was economical only for particular high-volume tasks.",
      "Limit switches could accomplish a few operations, but the specification says they had not supplied flexible programming for varied transfer sequences.",
    ],
    breakthroughInsight:
      "Store a selected sequence of code symbols and function commands, move a physical position representation with the transfer head, compare the two through coincidence detectors, and optionally record the sequence by manually placing the machine. The anticipator makes the comparison useful before and at a true stop.",
    patentWars: [],
    aftermath:
      "This record makes no litigation or licensing assertion without a reviewed primary legal record. The patent's text itself calls its broad objective “Unimation” and gives a warehouse transfer example; the catalogue confines its historical interpretation to those source-supported facts.",
    sideNotes: [
      "The grant was filed on December 10, 1954 and issued on June 13, 1961.",
      "The source prints an illustrative one-sixteenth-inch code increment but says smaller values are practical where warranted.",
    ],
    civilizationalImpact:
      "The patent documents a concrete control architecture for programmable materials handling: stored task symbols, an output-coupled position representation, a comparison condition, record/replay, and a separately coordinated article-seizing operation. It is a rigorous historical bridge between fixed mechanical sequencing and later software-driven automation without treating later hardware as if it were printed in this grant.",
    funFact:
      "The source uses “Unimation” in the specification itself: “Universal automation, or ‘Unimation,’ is a term that may well characterize the general object of the invention.”",
  },
  tags: [
    "industrial automation",
    "robotics history",
    "program control",
    "magnetic storage",
    "feedback control",
    "end effector",
  ],
  stats: {
    totalClaims: 28,
    independentClaims: 18,
  },
};
