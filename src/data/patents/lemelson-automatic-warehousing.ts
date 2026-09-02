import { lemelsonAutomaticWarehousingArchivalEdition } from "@/data/editions/lemelsonAutomaticWarehousingEdition";
import type { Patent } from "@/types/patent";

function manualClaimText(number: number): string {
  const block = lemelsonAutomaticWarehousingArchivalEdition.blocks.find(
    (candidate) => candidate.kind === "claim" && candidate.number === number,
  );
  if (block?.kind !== "claim") {
    throw new Error(`Lemelson manual edition is missing claim ${number}.`);
  }
  return block.inlines.map((inline) => inline.text).join("");
}

export const lemelsonAutomaticWarehousingPatent: Patent = {
  id: "us-3119501-lemelson-automatic-warehousing",
  patentNumber: "US 3,119,501",
  title: "Automatic Warehousing System",
  shortTitle: "Lemelson Marker-Addressed Automatic Warehouse",
  subtitle: "Rail travel, vertical positioning, bay transfer, and preset-count feedback",
  inventors: ["Jerome H. Lemelson"],
  inventorLocation: "Metuchen, New Jersey",
  grantDate: "1964-01-28",
  filingDate: "1961-10-10",
  era: "Information Age & Silicon Revolution (1960–1990)",
  category: "computing",
  categoryLabel: "Industrial Automation & Warehouse Control",
  summary:
    "Lemelson's 1964 continuation grant claims a self-propelled storage-and-retrieval carrier with a vertical guide, laterally extending article fixture, storage-bay markers, a scanning relay, and a preset counting relay that stops motion after a selected number of position events. The issued text ties the 1961 filing to a 1954 continuation application, so the museum treats the record as an early electromechanical warehouse-addressing system rather than a claim to all automated storage.",
  heroQuote: "The scanner 37 may detect vertical beams 51 by means of sensing markers 56",
  originalPdfUrl: "/patents/pdfs/us-3119501-lemelson-automatic-warehousing.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US3119501A/en",
  usptoClassification: "U.S. Cl. 214—16.4 (printed)",
  archivalEdition: lemelsonAutomaticWarehousingArchivalEdition,
  originalTextAsset: {
    url: "/patents/transcripts/us-3119501-lemelson-automatic-warehousing-reviewed.txt",
    pageCount: 8,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-09-01",
    sourcePdfSha256: "409c2b9fbd3a926b53a9d17ea3acc975fd710953c3a0b56ec4bb2855c64ff7d4",
    pageAnchors: [
      {
        page: 1,
        exactSourceText: "AUTOMATIC WAREHOUSING SYSTEM",
        sourceRelationship: "source drawing-sheet title",
      },
      {
        page: 2,
        exactSourceText: "FIG. 3 is a schematic diagram",
        sourceRelationship: "source drawing-sheet caption",
      },
      {
        page: 3,
        exactSourceText: "FIG. 5 is a circuit diagram",
        sourceRelationship: "source drawing-sheet caption",
      },
      {
        page: 4,
        exactSourceText: "This invention relates to an automatic conveying system",
        sourceRelationship: "printed specification opening",
      },
      {
        page: 5,
        exactSourceText: "The racking system 50",
        sourceRelationship: "printed racking description",
      },
      {
        page: 6,
        exactSourceText: "counters PrCx, PrCz and PrCy",
        sourceRelationship: "printed counter-control description",
      },
      { page: 7, exactSourceText: "I claim:", sourceRelationship: "printed claims opening" },
      {
        page: 8,
        exactSourceText: "Automatic conveying apparatus in accordance with claim 2",
        sourceRelationship: "printed Claim 6",
      },
    ],
  },
  originalText:
    "This invention relates to an automatic conveying system particularly applicable to the automatic conveyance of work-in-process, materials and finished goods to and from a predetermined storage area and is a continuation of my copending application Ser. No. 449,874 which was filed on July 28, 1954 and is now abandoned.",
  plainEnglishExplanation: {
    overview:
      "The system is a coordinate-addressed material-handling machine. A self-propelled carrier moves along a first guide, an attached second guide moves a load fixture vertically, and the fixture reaches laterally into a selected storage bay. The more distinctive legal move is the feedback loop: source-described markers produce scanning signals, a preset relay counts them down, and the motor stops at a chosen position. The patent's architecture is physical rail, mast, bay, scanner, relay, and transfer fixture—not a generic right to warehouse software.",
    coreMechanism:
      "The source assigns separate carrier motions to motors Mx, My, and Mz. In a normalized engineering reading, the selected bay is a pose $q=(x,y,z)$: rail position, vertical level, and lateral transfer. A scanner emits a position event as it sees a marker; the preset counter state can be written $c_{next}=c_{now}-1$ per received event, with a motor-state transition when $c=0$. The grant does not print a rail length, bay pitch, payload, motor power, sensor error, or cycle-time value, so the shared exhibit shows topology and state rather than fabricated SI performance figures.",
    mechanicalBreakdown: [
      {
        title: "Track-travelling carrier and first guide",
        summary:
          "A self-propelled carriage travels horizontally beside the storage rack on the first guide means.",
        technicalDetails:
          "Claim 1 places the first carriage on a first guide substantially parallel to the accessible side of the rack. That establishes the rail-address coordinate $x$, but the drawing and claims do not state a rail length, wheel diameter, motor torque, or speed. The visual therefore maps its rail control only to normalized position.",
        archaicTerm: "first guide means",
        modernEquivalent: "longitudinal guide rail / aisle axis",
      },
      {
        title: "Vertical guide and second conveying means",
        summary:
          "A second carriage moves vertically on a guide attached to the horizontal carrier, bringing the fixture to a selected level.",
        technicalDetails:
          "The patent's second guide provides a vertical coordinate $z$ after rail travel. The source describes a motor-driven carriage and fork arrangement, not a sourced payload chart, mast stiffness, brake rating, acceleration curve, or safe operating envelope.",
        archaicTerm: "second conveying means",
        modernEquivalent: "elevator carriage",
      },
      {
        title: "Laterally extending fixture",
        summary:
          "A laterally extending article holder transfers an item between the carrier and a rack bay.",
        technicalDetails:
          "The fixture supplies the transfer coordinate $y$ relative to the rack face. In the source sequence, horizontal travel and vertical positioning establish the bay address before the transfer motion proceeds. The patent gives the part relationship but not a measured stroke, contact force, or payload capacity.",
        archaicTerm: "laterally extending fixture",
        modernEquivalent: "shuttle fork / load-transfer carriage",
      },
      {
        title: "Marker scanner and preset counter",
        summary:
          "A scanner turns physical bay markers into event pulses; a preset counter uses their number to stop or sequence motor action.",
        technicalDetails:
          "The source describes photoelectric markers and a limit-switch alternative. The abstract control relation is $c_{next}=c_{now}-1$ for each position event until $c=0$. That is a discrete feedback mechanism, not a claim that the source supplies encoder resolution, latency, or fault-detection data.",
        archaicTerm: "predetermining counting relay means",
        modernEquivalent: "preset event counter with motor-stop logic",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Coordinate-addressed motion",
        formula: "q=(x,y,z)",
        explanation:
          "The carrier rail, vertical guide, and lateral fixture form three source-described motion directions. The equation labels their normalized positional relationship; it does not assign source-unsupported dimensions to the warehouse.",
      },
      {
        principle: "Discrete feedback counting",
        formula: "c_{next}=c_{now}-1",
        explanation:
          "Claims 1–5 require a preset counting relay or counter that receives marker-derived position signals and stops a drive after the selected count. This is an event-count relation, not a claim about clock time or sensor precision.",
      },
      {
        principle: "Motor-state sequence",
        formula: "Mx \\xrightarrow{c_x=0} Mz \\xrightarrow{c_z=0} My",
        explanation:
          "The specification describes counter-controlled sequencing among longitudinal, vertical, and transfer motions. The notation makes the claimed control topology legible while avoiding a fabricated production-rate or motion-profile model.",
      },
    ],
    whyItMattersToday:
      "The patent is a remarkably concrete bridge between warehouse geometry and discrete control: a selected location is reached by rails, lift, shuttle, marker, scan, count, and stop operations. In 1973, the Second Circuit's account of the related Triax system described automatic stackers used in warehouses and analyzed precisely those rail, elevator, shuttle, and marker-control differences. That makes this a useful historical exhibit for understanding why automated storage is a coupled mechanical-and-feedback problem, even though the 1964 grant is not a blanket claim to modern warehouse automation.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: manualClaimText(1),
      plainEnglish:
        "Claim 1 is the broadest issued warehouse machine claim: a self-propelled rail carriage, vertical second guide, laterally extending article holder, storage rack, bay identifiers, scanning relay, and preset counter that stops motion after selected position signals. Its legal work is the physical-and-control combination, not any isolated rail, fork, relay, or generic inventory-location concept.",
      keyInnovations: [
        "Self-propelled guide-rail carrier",
        "Vertical second guide",
        "Lateral article fixture",
        "Marker-scanning relay",
        "Preset counting relay",
      ],
      legalSignificance:
        "The Second Circuit later treated the rail, elevator, lateral fixture, rack markers, and count-controlled stopping features as the claim-specific structure when assessing infringement.",
    },
    {
      number: 2,
      isIndependent: true,
      originalText: manualClaimText(2),
      plainEnglish:
        "Claim 2 independently recites the same coordinate-addressed warehouse architecture but frames its signals as position-indicating feedback from markers during carrier travel. It protects the source-described combination of horizontal and vertical positioning, lateral holding fixture, marker scanner, and count-driven stop logic without making every automated storage system fall within its words.",
      keyInnovations: [
        "Position-indicating feedback",
        "Scanning relay",
        "Preset count stop",
        "Storage-bay addressing",
      ],
      legalSignificance:
        "It is an independent formulation of the marker-feedback architecture central to the grant.",
    },
    {
      number: 3,
      isIndependent: true,
      originalText: manualClaimText(3),
      plainEnglish:
        "Claim 3 narrows the sensing implementation by calling for reflective markers in the scanner path and a counter circuit serving both conveying directions. The legal addition is not merely a photoelectric idea in isolation; it joins reflective marker events to the coordinated rail-and-vertical positioning arrangement of the claimed warehouse carrier.",
      keyInnovations: [
        "Reflective markers",
        "Feedback signals",
        "Coordinated first and second conveying means",
        "Preset counter circuit",
      ],
      legalSignificance:
        "This claim makes the source's optical-marker embodiment explicit and was relevant to later comparison with other stacker sensing arrangements.",
    },
    {
      number: 4,
      isIndependent: true,
      originalText: manualClaimText(4),
      plainEnglish:
        "Claim 4 independently describes bay identifiers as devices that abruptly change an ambient light pattern in the scanner path. Its legal work is to state the optical-event principle in functional source language while retaining the carrier, vertical guide, lateral fixture, rack, scan, counter, and motor-stop chain around it.",
      keyInnovations: [
        "Ambient-light-pattern change",
        "Scanning relay",
        "Bay-identifying devices",
        "Motor-stop counter",
      ],
      legalSignificance:
        "It offers a distinct issued wording for source-described optical identification rather than relying only on the phrase reflective marker.",
    },
    {
      number: 5,
      isIndependent: true,
      originalText: manualClaimText(5),
      plainEnglish:
        "Claim 5 independently describes an energy field and bay identifiers that locally change that field, then calls for a responsive scanner and preset count logic. The legal contribution is an intentionally broader sensing formulation tied to the particular material-handling topology, not a freestanding claim to any sensor used anywhere in a warehouse.",
      keyInnovations: [
        "Energy-field sensing",
        "Bay identifiers",
        "Responsive scanning relay",
        "Position-event counter",
      ],
      legalSignificance:
        "It preserves a non-optical functional framing of the source's position-identification arrangement.",
    },
    {
      number: 6,
      isIndependent: false,
      dependsOn: [2],
      originalText: manualClaimText(6),
      plainEnglish:
        "Claim 6 depends on Claim 2 and selects a mechanical sensing alternative: a limit switch scans protrusions in its travel path. This dependent claim is important because it shows the issued patent did not make its system depend solely on photoelectric markers; it specifically protected a contact-event version of the same positional feedback role.",
      keyInnovations: ["Limit switch", "Protrusion markers", "Mechanical position event"],
      legalSignificance:
        "It supplies the grant's explicit physical-contact alternative to the optical sensing descriptions.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Automatic storage and retrieval arrangement",
      caption:
        "Figure 1 shows the source system's carrier, track, racking, lift, and fork relationships.",
      svgType: "lemelson-warehousing",
      callouts: [
        {
          id: "law-20",
          figureRef: "Fig. 1",
          label: "20",
          element: "Carrier",
          description: "Track-travelling carrier named in the specification.",
          x: 39,
          y: 43,
        },
        {
          id: "law-23",
          figureRef: "Fig. 1",
          label: "23",
          element: "Vertical assembly",
          description: "Subtending assembly guiding the second carriage.",
          x: 43,
          y: 51,
        },
        {
          id: "law-27",
          figureRef: "Fig. 1",
          label: "27",
          element: "Fork assembly",
          description: "Source product-holding fixture.",
          x: 48,
          y: 62,
        },
        {
          id: "law-50",
          figureRef: "Fig. 1",
          label: "50",
          element: "Racking system",
          description: "Source storage racking system.",
          x: 71,
          y: 49,
        },
      ],
    },
    {
      figureNumber: "Fig. 3",
      title: "Preset-count control relationship",
      caption:
        "Figure 3 diagrams the counters and motor-control relation for the source apparatus.",
      svgType: "lemelson-warehousing",
      callouts: [
        {
          id: "law-prcx",
          figureRef: "Fig. 3",
          label: "PrCx",
          element: "Preset counter",
          description: "Source counter associated with longitudinal positioning control.",
          x: 42,
          y: 41,
        },
        {
          id: "law-37",
          figureRef: "Fig. 3",
          label: "37",
          element: "Scanner",
          description: "Source positional scanner supplying feedback events.",
          x: 71,
          y: 52,
        },
      ],
    },
    {
      figureNumber: "Fig. 5",
      title: "Photoelectric scanning circuit",
      caption:
        "Figure 5 gives the source optical scanner and relay circuit for position-marker detection.",
      svgType: "lemelson-warehousing",
      callouts: [
        {
          id: "law-37a",
          figureRef: "Fig. 5",
          label: "37a",
          element: "Photoelectric cell",
          description: "Light-responsive source component.",
          x: 45,
          y: 51,
        },
        {
          id: "law-38a",
          figureRef: "Fig. 5",
          label: "38a",
          element: "Light source",
          description: "Source illumination adjacent to the photoelectric cell.",
          x: 61,
          y: 51,
        },
      ],
    },
    {
      figureNumber: "Fig. 6",
      title: "Remote count presetting",
      caption:
        "Figure 6 shows the source pulse-generating dial switch arrangement for remote counter presetting.",
      svgType: "lemelson-warehousing",
      callouts: [
        {
          id: "law-39",
          figureRef: "Fig. 6",
          label: "39",
          element: "Dial switch",
          description: "Source pulse-generating dial switch at the operator station.",
          x: 50,
          y: 48,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "The specification identifies the logistical difficulty of moving work-in-process and finished goods to and from selected bays without continuously directing stacker cranes or relying on single-level conveyor storage.",
    priorArtLimitations: [
      "The source says earlier equipment for palletized or boxed goods required manual direction or manual remote control.",
      "It describes conventional stacker cranes as requiring attendance by an operator.",
      "It identifies a closed-loop belt-conveyor arrangement as limited to a particular section and substantially a single storage level.",
    ],
    breakthroughInsight:
      "Treat a warehouse location as a physical address reached by serial rail, lift, and transfer motion, with marker-derived events counted down by preset relays. The resulting system connects rack geometry, sensing, and motor state instead of treating storage and control as separate problems.",
    patentWars: [
      {
        rivalName: "The Triax Company v. Hartman Metal Fabricators, Inc.",
        rivalClaim:
          "Triax asserted the Lemelson warehouse patent against Hartman's stacker under the doctrine of equivalents.",
        conflictDetails:
          "The Second Circuit compared the claimed laterally extending fixture, sequential rail-and-elevator movement, rack markers, and preset-count logic with Hartman's retractable bidirectional extractor, simultaneous motion, and different sensing/control arrangement.",
        resolution:
          "In 1973 the Second Circuit affirmed judgment for Hartman on the Lemelson claim while preserving validity of the Lemelson patent.",
        legalOutcome:
          "US 3,119,501 was held valid but not infringed; the court characterized it as non-pioneering and assigned a relatively narrow range of equivalents.",
      },
    ],
    civilizationalImpact:
      "The grant records an early, concrete treatment of automated storage as a coupled mechanical-and-feedback system. Its significance is not that it owns all later warehouse automation, but that it makes a selected bay legible as a rail, lift, shuttle, marker, scanner, counter, and stop sequence.",
    aftermath:
      "The 1973 Triax litigation provides unusually direct evidence that the claimed kind of automatic stacker system was being manufactured, sold, and installed in warehouses. It also makes the boundary of the claim visible: different geometry and sensing/control choices could avoid infringement.",
    sideNotes: [
      "The printed grant says six claims; the edition includes all six, including the dependent limit-switch alternative.",
      "The official text calls the 1961 application a continuation of a July 1954 application; the court later accepted the earlier filing date for patentability analysis.",
      "The visual uses only normalized geometry because the facsimile does not state warehouse dimensions, payload, travel speed, motor power, or sensor precision.",
    ],
  },
  tags: [
    "Jerome Lemelson",
    "Warehouse automation",
    "Material handling",
    "Photoelectric sensing",
    "Preset counter",
    "Robotics history",
  ],
  stats: { totalClaims: 6, independentClaims: 5 },
};
