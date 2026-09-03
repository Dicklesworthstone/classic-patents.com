import { kamenTransporterArchivalEdition } from "@/data/editions/kamenTransporterEdition";
import type { Patent } from "@/types/patent";

function manualClaimText(number: number): string {
  const block = kamenTransporterArchivalEdition.blocks.find(
    (candidate) => candidate.kind === "claim" && candidate.number === number,
  );
  if (block?.kind !== "claim") {
    throw new Error(`Kamen Transporter manual edition is missing claim ${number}.`);
  }
  return block.inlines.map((inline) => inline.text).join("");
}

function sourceBoundedDependentClaimReading(number: number): string {
  return `Claim ${String(number)} is a dependent narrowing limitation. Its exact legal condition is available on the reviewed source face; this public reading does not infer an unprinted sensor, controller setting, performance value, or operating outcome.`;
}

export const kamenTransporterPatent: Patent = {
  id: "us-5701965-kamen-transporter",
  patentNumber: "US 5,701,965",
  title: "Human Transporter",
  shortTitle: "Human Transporter Balance and Cluster-Wheel Control",
  subtitle: "Fore-Aft Balance Control, Cluster-Wheel Locomotion, and Stair-State Coordination",
  inventors: [
    "Dean L. Kamen",
    "Robert R. Ambrogi",
    "Robert J. Duggan",
    "Richard K. Heinzmann",
    "Brian R. Key",
    "Andrzej Skoskiewicz",
    "Phyllis K. Kristal",
  ],
  inventorLocation: "Manchester, New Hampshire",
  grantDate: "1997-12-30",
  filingDate: "1994-05-27",
  era: "Information & Digital Age (1950–Present)",
  category: "consumer",
  categoryLabel: "Mobility Robotics & Control Topology",
  summary:
    "US 5,701,965 describes a human transporter with a support, a motorized ground-contacting module, and a control loop for fore-aft balance. Later claims describe clusters of wheels, separately controlled cluster and ground-contact wheel relationships, and a coordination sequence for stair use; this public exhibit reads those as source topology rather than a calibrated gear-train or quantitative performance model.",
  heroQuote:
    "A control loop, in which the motorized drive is included, dynamically maintains stability in the fore-aft plane by operation of the motorized drive in connection with the ground-contacting module.",
  originalPdfUrl: "/patents/pdfs/us-5701965-kamen-transporter.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US5701965A/en",
  usptoClassification: "180/7.1",

  originalTextAsset: {
    url: "/patents/transcripts/us-5701965-kamen-transporter-reviewed.txt",
    pageCount: 48,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-09-02",
    sourcePdfSha256: "b1dac639b2b9905914433d27fd9b6cad82382239bc291d10ca3e1ac1ffe05f65",
    pageAnchors: [
      {
        page: 1,
        exactSourceText:
          "USOO570 1965A\nUnited States Patent (19)                                                             11) Patent Number:                             5,701,965",
        sourceRelationship: "Title page masthead and bibliographic data",
      },
      {
        page: 2,
        exactSourceText: "5,701,965\nPage 2",
        sourceRelationship: "References cited continuation",
      },
      {
        page: 3,
        exactSourceText: "U.S. Patent   Dec. 30, 1997   Sheet 1 of 34   5,701,965\nZ",
        sourceRelationship: "Drawing sheet 1 of 34",
      },
      {
        page: 4,
        exactSourceText: "U.S. Patent   Dec. 30, 1997   Sheet 2 of 34   5,701,965",
        sourceRelationship: "Drawing sheet 2 of 34",
      },
      {
        page: 5,
        exactSourceText:
          "U.S. Patent             Dec. 30, 1997       Sheet 3 of 34        5,701,965\n12",
        sourceRelationship: "Drawing sheet 3 of 34",
      },
      {
        page: 6,
        exactSourceText: "U.S. Patent   Dec. 30, 1997   Sheet 4 of 34   5,701,965",
        sourceRelationship: "Drawing sheet 4 of 34",
      },
      {
        page: 7,
        exactSourceText:
          "U.S. Patent          Dec. 30, 1997        Sheet 5 of 34               5,701,965\n51",
        sourceRelationship: "Drawing sheet 5 of 34",
      },
      {
        page: 8,
        exactSourceText: "U.S. Patent   Dec. 30, 1997   Sheet 6 of 34   5,701,965",
        sourceRelationship: "Drawing sheet 6 of 34",
      },
      {
        page: 9,
        exactSourceText: "U.S. Patent    Dec. 30, 1997        Sheet 7 of 34   5,701,965\nFORWARD",
        sourceRelationship: "Drawing sheet 7 of 34",
      },
      {
        page: 10,
        exactSourceText:
          "U.S. Patent           Dec. 30, 1997        Sheet 8 of 34         5,701,965\nREAD SENSOR",
        sourceRelationship: "Drawing sheet 8 of 34",
      },
      {
        page: 11,
        exactSourceText: "U.S. Patent   Dec. 30, 1997   Sheet 9 of 34   5,701,965",
        sourceRelationship: "Drawing sheet 9 of 34",
      },
      {
        page: 12,
        exactSourceText: "U.S. Patent   5,701,965",
        sourceRelationship: "Drawing sheet 10 of 34",
      },
      {
        page: 13,
        exactSourceText: "U.S. Patent   Dec. 30, 1997   Sheet 11 of 34   5,701,965",
        sourceRelationship: "Drawing sheet 11 of 34",
      },
      {
        page: 14,
        exactSourceText: "U.S. Patent   Dec. 30, 1997   Sheet 12 of 34   5,701,965",
        sourceRelationship: "Drawing sheet 12 of 34",
      },
      {
        page: 15,
        exactSourceText: "U.S. Patent       Dec. 30, 1997   Sheet 13 of 34   5,701,965\n&",
        sourceRelationship: "Drawing sheet 13 of 34",
      },
      {
        page: 16,
        exactSourceText: "U.S. Patent   Dec. 30, 1997   Sheet 14 of 34   5,701,965",
        sourceRelationship: "Drawing sheet 14 of 34",
      },
      {
        page: 17,
        exactSourceText: "U.S. Patent   Dec. 30, 1997   Sheet 15 of 34   5,701,965",
        sourceRelationship: "Drawing sheet 15 of 34",
      },
      {
        page: 18,
        exactSourceText: "U.S. Patent   Dec. 30, 1997   Sheet 16 of 34   5,701,965",
        sourceRelationship: "Drawing sheet 16 of 34",
      },
      {
        page: 19,
        exactSourceText: "U.S. Patent   Dec. 30, 1997   Sheet 17 of 34   5,701,965\nFG. 26",
        sourceRelationship: "Drawing sheet 17 of 34",
      },
      {
        page: 20,
        exactSourceText:
          "U.S. Patent          Dec. 30, 1997        Sheet 18 of 34              5,701,965\nCENTRA",
        sourceRelationship: "Drawing sheet 18 of 34",
      },
      {
        page: 21,
        exactSourceText: "U.S. Patent   Dec. 30, 1997   Sheet 19 of 34   5,701,965",
        sourceRelationship: "Drawing sheet 19 of 34",
      },
      {
        page: 22,
        exactSourceText:
          "U.S. Patent   Dec. 30, 1997               Sheet 20 of 34     5,701,965\n617                         T57",
        sourceRelationship: "Drawing sheet 20 of 34",
      },
      {
        page: 23,
        exactSourceText:
          "U.S. Patent                Dec. 30, 1997                Sheet 21 of 34                 5,701,965\n30      CET TECHNICAN'S",
        sourceRelationship: "Drawing sheet 21 of 34",
      },
      {
        page: 24,
        exactSourceText: "U.S. Patent   Dec. 30, 1997   Sheet 22 of 34   5,701,965",
        sourceRelationship: "Drawing sheet 22 of 34",
      },
      {
        page: 25,
        exactSourceText:
          'U.S. Patent   Dec. 30, 1997   Sheet 23 of 34                          5,701,965\n"0||99',
        sourceRelationship: "Drawing sheet 23 of 34",
      },
      {
        page: 26,
        exactSourceText:
          "U.S. Patent          Dec. 30, 1997   Sheet 24 of 34   5,701,965\nJIS11L/?.TO80IIZ?ON",
        sourceRelationship: "Drawing sheet 24 of 34",
      },
      {
        page: 27,
        exactSourceText:
          "U.S. Patent           Dec. 30, 1997                   Sheet 25 of 34   5,701,965\nN",
        sourceRelationship: "Drawing sheet 25 of 34",
      },
      {
        page: 28,
        exactSourceText: "U.S. Patent       Dec. 30, 1997   Sheet 26 of 34   5,701,965\n|",
        sourceRelationship: "Drawing sheet 26 of 34",
      },
      {
        page: 29,
        exactSourceText: "U.S. Patent   Dec. 30, 1997   Sheet 27 of 34   5,701,965",
        sourceRelationship: "Drawing sheet 27 of 34",
      },
      {
        page: 30,
        exactSourceText:
          "U.S. Patent   Dec. 30, 1997          Sheet 28 of 34             5,701,965\n3801    BEGIN",
        sourceRelationship: "Drawing sheet 28 of 34",
      },
      {
        page: 31,
        exactSourceText: "U.S. Patent         5,701,965\n0d0",
        sourceRelationship: "Drawing sheet 29 of 34",
      },
      {
        page: 32,
        exactSourceText:
          "U.S. Patent            Dec. 30, 1997   Sheet 30 of 34   5,701,965\nuz=#182-ºde                        ±",
        sourceRelationship: "Drawing sheet 30 of 34",
      },
      {
        page: 33,
        exactSourceText: "U.S. Patent   Dec. 30, 1997          Sheet 31 of 34   5,701,965\n181°",
        sourceRelationship: "Drawing sheet 31 of 34",
      },
      {
        page: 34,
        exactSourceText: "U.S. Patent   Dec. 30, 1997   Sheet 32 of 34   5,701,965",
        sourceRelationship: "Drawing sheet 32 of 34",
      },
      {
        page: 35,
        exactSourceText:
          "U.S. Patent                   Dec. 30, 1997                     5,701,965\nLyy   8TL0E/?J1OHW)MIlONOIZ?",
        sourceRelationship: "Drawing sheet 33 of 34",
      },
      {
        page: 36,
        exactSourceText: "U.S. Patent   Dec. 30, 1997   Sheet 34 of 34   5,701,965",
        sourceRelationship: "Drawing sheet 34 of 34",
      },
      {
        page: 37,
        exactSourceText: "1\nHUMAN TRANSPORTER",
        sourceRelationship: "Specification columns 1-2",
      },
      {
        page: 38,
        exactSourceText:
          "FIG. 38 is a block diagram of the state of the device,\nutilizing the first embodiment permitting climbing, for mov",
        sourceRelationship: "Specification columns 3-4",
      },
      {
        page: 39,
        exactSourceText: "S\nof the embodiment of FIGS. 1-4 to achieve locomotion and",
        sourceRelationship: "Specification columns 5-6",
      },
      {
        page: 40,
        exactSourceText:
          "contacting members in lieu of the pair of wheels used in the\nembodiment of FIG. 1.",
        sourceRelationship: "Specification columns 7-8",
      },
      {
        page: 41,
        exactSourceText:
          "right wheel clusters 214 operated in the manner of the\nclusters of FIGS. 13-20, the transporter may be alternatively",
        sourceRelationship: "Specification columns 9-10",
      },
      {
        page: 42,
        exactSourceText:
          "microcontroller board 283 is in turn in communication with\nthe central microcontroller board 272 over bus 279.",
        sourceRelationship: "Specification columns 11-12",
      },
      {
        page: 43,
        exactSourceText: "TABLE 2-continued\nAngle and Motion Wariables.",
        sourceRelationship: "Specification columns 13-14",
      },
      {
        page: 44,
        exactSourceText:
          "to pitch rate signal 6, which is supplied by summer 3519,\nyielding the corrected output 8.",
        sourceRelationship: "Specification columns 15-16",
      },
      {
        page: 45,
        exactSourceText: "17\nweight), and 45 (climb). (No motion is involved in the reset",
        sourceRelationship: "Specification columns 17-18",
      },
      {
        page: 46,
        exactSourceText:
          "and occupying only a portion of the entire angular\ndistance around the axis; the support and the support",
        sourceRelationship: "Specification columns 19-20",
      },
      {
        page: 47,
        exactSourceText:
          "from the slave mode to the balance mode, operative\nprevent entering the balance mode until a zero crossing",
        sourceRelationship: "Specification columns 21-22",
      },
      {
        page: 48,
        exactSourceText:
          "distance around the axis; the support and the support\nmembers being parts of an assembly;",
        sourceRelationship: "Specification columns 23-24",
      },
    ],
  },

  archivalEdition: kamenTransporterArchivalEdition,

  originalText: `There is provided, in a preferred embodiment, a device for transporting a human subject over ground having a surface that may be irregular and may include stairs. This embodiment has a support for supporting the subject. A ground-contacting module, movably attached to the support, serves to suspend the subject in the support over the surface. The orientation of the ground-contacting module defines fore-aft and lateral planes intersecting one another at a vertical. The support and the ground-contacting module are components of an assembly.

A motorized drive, mounted to the assembly and coupled to the ground-contacting module, causes locomotion of the assembly and the subject therewith over the surface. Finally, the embodiment has a control loop, in which the motorized drive is included, for dynamically enhancing stability in the fore-aft plane by operation of the motorized drive in connection with the ground-contacting module.`,

  plainEnglishExplanation: {
    overview:
      "The reviewed grant addresses a human transporter for irregular ground that may include stairs. Its claimed move is architectural rather than a published performance specification: a support is coupled to a motorized ground-contacting module, and a control loop operates the drive in the fore-aft plane. Claims 16 and 21 add wheel clusters and separate relationships for cluster orientation and wheels in ground contact; Claims 22 through 26 name balance, slave, lean, transition, and coordination modes. The public exhibit does not turn those relationships into a calibrated gear train, controller implementation, sensor package, or operating-performance claim.",
    coreMechanism:
      "The legal mechanism is a sequence of relationships. Claim 1 joins the support, ground-contacting module, motorized drive, and fore-aft control loop. Claim 21 separates orientation control of each wheel cluster from rotation control of ground-contacting wheels. Claim 22 calls out a balance mode, Claim 23 a slave mode and a lean mode, and Claim 26 orders start, weight transfer, climb, and return toward normal balance. This reading presents that topology only; it does not expose a torque law, timing model, stair dimension, transfer angle, or predicted capability.",
    mechanicalBreakdown: [
      {
        title: "Fore-Aft Balance-Control Relationship",
        summary:
          "Claim 1 couples the motorized drive and ground-contacting module through a fore-aft control-loop relationship.",
        technicalDetails:
          "The claim identifies the legal combination of support, motorized drive, ground-contacting module, and control loop. It does not itself establish a controller family, gain, sampling rate, state estimator, response time, or numerical stability margin for this exhibit.",
        archaicTerm: "control loop for dynamically enhancing stability in the fore-aft plane",
        modernEquivalent: "fore-aft balance-control topology",
      },
      {
        title: "Cluster-Wheel Ground Module",
        summary:
          "Claims 16 through 21 describe wheel clusters and separate relationships for cluster orientation and wheels in ground contact.",
        technicalDetails:
          "The grant says wheels in each cluster can be motor-driven independently of the cluster, and Claim 21 distinguishes cluster-orientation control from wheel rotation control. It does not identify a planetary gear train, gear ratio, wheel count for the displayed embodiment, drive type, or geometric climbing limit.",
        archaicTerm: "cluster of wheels mounted to permit complete travel around an axis",
        modernEquivalent: "cluster-wheel ground-contact module",
      },
      {
        title: "Subject and State Inputs",
        summary:
          "Claim 48 describes cyclical subject-provided and state-variable inputs before control of the motorized drive.",
        technicalDetails:
          "Claim 48 names an order of reading inputs, modifying program state, and performing calculations. This source-bounded reader does not identify a sensor, filter, processor, input rate, calibration, or signal scale that is not necessary to show that order.",
        archaicTerm: "reading state variable inputs",
        modernEquivalent: "state-input processing relationship",
      },
      {
        title: "Leaning-Responsive Drive Relationship",
        summary:
          "Dependent claims describe leaning means that sense a subject's direction of leaning and control the motorized drive accordingly.",
        technicalDetails:
          "The printed claim connects the direction of leaning to the direction of movement. It does not publish a transfer function, speed or acceleration result, lean angle, sensor type, or user-interface calibration for the public exhibit.",
        archaicTerm: "leaning means for sensing leaning of the subject",
        modernEquivalent: "leaning-direction input relationship",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Claimed Control-Loop Topology",
        formula:
          "\\text{subject input} + \\text{state-variable input} \\rightarrow \\text{program state} \\rightarrow \\text{motorized-drive control}",
        explanation:
          "Claim 48 supplies an ordered information relationship, not a public physical-dynamics equation. The exhibit therefore uses a qualitative state reader instead of asserting a numerical stability calculation.",
      },
      {
        principle: "Cluster and Wheel Coordination Topology",
        formula:
          "\\text{cluster orientation control} + \\text{ground-contact wheel control} \\rightarrow \\text{transfer / climb state sequence}",
        explanation:
          "Claims 21 through 26 identify separate control relationships and an ordered stair-use sequence. They do not, by themselves, furnish a public geometry, timing, load, force, clearance, or traversal limit.",
      },
    ],
    whyItMattersToday:
      "The document is useful to engineering readers because it makes a mobility-control architecture explicit: ground-contact hardware, a motorized drive, balance-related control, separate cluster and wheel relations, and a transition sequence appear as distinct legal elements. This source-bound edition does not claim a quantified lineage, commercial product identity, or modern performance equivalence beyond those documented relationships.",
  },

  drawings: [
    {
      figureNumber: "Figure 1",
      title: "Transporter Assembly with Support and Ground-Contacting Module",
      caption:
        "Perspective view of the simplified seated transporter embodiment in the pinned drawing sheet.",
      svgType: "kamen-transporter",
      callouts: [
        {
          id: "callout-10-chassis",
          figureRef: "Fig. 1",
          label: "Chassis Assembly",
          element: "10",
          description: "Support and assembly relationship shown in the pinned perspective drawing.",
          x: 45,
          y: 50,
        },
        {
          id: "callout-12-cluster",
          figureRef: "Fig. 1",
          label: "Cluster Wheel",
          element: "12",
          description: "Cluster-wheel ground-contact relationship shown in the pinned drawing.",
          x: 30,
          y: 75,
        },
        {
          id: "callout-14-seat",
          figureRef: "Fig. 1",
          label: "Rider Seat",
          element: "14",
          description: "Subject-support arrangement shown in the seated embodiment.",
          x: 55,
          y: 35,
        },
      ],
    },
    {
      figureNumber: "Figure 2",
      title: "Two-Wheel Balance Configuration",
      caption: "Source drawing view of an embodiment in a two-wheel balance configuration.",
      svgType: "kamen-transporter",
      callouts: [
        {
          id: "callout-20-contact",
          figureRef: "Fig. 2",
          label: "Contact Wheel Pair",
          element: "20",
          description: "Ground-contacting wheel pair in the illustrated configuration.",
          x: 50,
          y: 80,
        },
        {
          id: "callout-22-elevated",
          figureRef: "Fig. 2",
          label: "Elevated Cluster Wheel",
          element: "22",
          description: "Cluster-wheel relationship depicted above the ground-contact pair.",
          x: 50,
          y: 40,
        },
      ],
    },
    {
      figureNumber: "Figure 3",
      title: "Stair-Use Coordination Configuration",
      caption:
        "Source drawing view associated with stair use; the interactive exhibit treats it as a qualitative coordination state.",
      svgType: "kamen-transporter",
      callouts: [
        {
          id: "callout-30-stair-contact",
          figureRef: "Fig. 3",
          label: "Stair-Use Contact",
          element: "30",
          description: "Wheel-and-surface relationship depicted for the stair-use embodiment.",
          x: 40,
          y: 70,
        },
        {
          id: "callout-32-carrier",
          figureRef: "Fig. 3",
          label: "Cluster Orientation",
          element: "32",
          description:
            "Cluster orientation relation depicted in the stair-use embodiment; no angle, clearance, or traversal value is asserted.",
          x: 60,
          y: 50,
        },
      ],
    },
  ],

  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: manualClaimText(1),
      plainEnglish:
        "An independent combination claim for a human transporter: it joins a support, movable support members with ground-contacting components, a motorized drive arrangement, and a fore-aft control loop. The public exhibit reads that combination as topology, not as a numerical balance prediction.",
      keyInnovations: [
        "Fore-aft balance control-loop relationship",
        "Motorized ground-contacting module",
        "Human-transporter support and surface relationship",
      ],
      legalSignificance:
        "Independent claim defining the support, motorized-drive, ground-contact, and fore-aft control-loop combination.",
    },
    {
      number: 2,
      isIndependent: false,
      originalText: manualClaimText(2),
      plainEnglish:
        "The transporter of claim 1 where all support member wheel axes are arranged substantially collinear across the vehicle.",
      keyInnovations: ["Collinear wheel axis mounting"],

      dependsOn: [1],
    },
    {
      number: 3,
      isIndependent: false,
      originalText: manualClaimText(3),
      plainEnglish:
        "The transporter of claim 2 where each ground-contacting component is an arcuate or curved rolling element.",
      keyInnovations: ["Arcuate rolling component geometry"],

      dependsOn: [2],
    },
    {
      number: 4,
      isIndependent: false,
      originalText: manualClaimText(4),
      plainEnglish: sourceBoundedDependentClaimReading(4),
      keyInnovations: ["Refined claim 4 specification feature"],

      dependsOn: [3],
    },
    {
      number: 5,
      isIndependent: false,
      originalText: manualClaimText(5),
      plainEnglish: sourceBoundedDependentClaimReading(5),
      keyInnovations: ["Refined claim 5 specification feature"],

      dependsOn: [4],
    },
    {
      number: 6,
      isIndependent: false,
      originalText: manualClaimText(6),
      plainEnglish: sourceBoundedDependentClaimReading(6),
      keyInnovations: ["Refined claim 6 specification feature"],

      dependsOn: [4],
    },
    {
      number: 7,
      isIndependent: false,
      originalText: manualClaimText(7),
      plainEnglish: sourceBoundedDependentClaimReading(7),
      keyInnovations: ["Refined claim 7 specification feature"],

      dependsOn: [4],
    },
    {
      number: 8,
      isIndependent: false,
      originalText: manualClaimText(8),
      plainEnglish: sourceBoundedDependentClaimReading(8),
      keyInnovations: ["Refined claim 8 specification feature"],

      dependsOn: [4],
    },
    {
      number: 9,
      isIndependent: false,
      originalText: manualClaimText(9),
      plainEnglish: sourceBoundedDependentClaimReading(9),
      keyInnovations: ["Refined claim 9 specification feature"],

      dependsOn: [3],
    },
    {
      number: 10,
      isIndependent: false,
      originalText: manualClaimText(10),
      plainEnglish: sourceBoundedDependentClaimReading(10),
      keyInnovations: ["Refined claim 10 specification feature"],

      dependsOn: [9],
    },
    {
      number: 11,
      isIndependent: false,
      originalText: manualClaimText(11),
      plainEnglish: sourceBoundedDependentClaimReading(11),
      keyInnovations: ["Refined claim 11 specification feature"],

      dependsOn: [10],
    },
    {
      number: 12,
      isIndependent: false,
      originalText: manualClaimText(12),
      plainEnglish: sourceBoundedDependentClaimReading(12),
      keyInnovations: ["Refined claim 12 specification feature"],

      dependsOn: [9],
    },
    {
      number: 13,
      isIndependent: false,
      originalText: manualClaimText(13),
      plainEnglish: sourceBoundedDependentClaimReading(13),
      keyInnovations: ["Refined claim 13 specification feature"],

      dependsOn: [3],
    },
    {
      number: 14,
      isIndependent: false,
      originalText: manualClaimText(14),
      plainEnglish: sourceBoundedDependentClaimReading(14),
      keyInnovations: ["Refined claim 14 specification feature"],

      dependsOn: [13],
    },
    {
      number: 15,
      isIndependent: false,
      originalText: manualClaimText(15),
      plainEnglish: sourceBoundedDependentClaimReading(15),
      keyInnovations: ["Refined claim 15 specification feature"],

      dependsOn: [14],
    },
    {
      number: 16,
      isIndependent: false,
      originalText: manualClaimText(16),
      plainEnglish:
        "The transporter of claim 1 where the ground-contacting components are wheels rotatably mounted on support members configured as a cluster of wheels on each lateral side.",
      keyInnovations: [
        "Cluster-wheel assemblies on opposing vehicle sides",
        "Wheels motor-driven independently of their clusters",
      ],
      legalSignificance:
        "Dependent structural claim defining wheel clusters on the two sides and their motor-driven relationship.",
      dependsOn: [1],
    },
    {
      number: 17,
      isIndependent: false,
      originalText: manualClaimText(17),
      plainEnglish:
        "The transporter of claim 16 where the central cluster axes on both lateral sides are substantially collinear.",
      keyInnovations: ["Collinear central cluster rotation axis"],

      dependsOn: [16],
    },
    {
      number: 18,
      isIndependent: false,
      originalText: manualClaimText(18),
      plainEnglish: sourceBoundedDependentClaimReading(18),
      keyInnovations: ["Refined claim 18 specification feature"],

      dependsOn: [17],
    },
    {
      number: 19,
      isIndependent: false,
      originalText: manualClaimText(19),
      plainEnglish: sourceBoundedDependentClaimReading(19),
      keyInnovations: ["Refined claim 19 specification feature"],

      dependsOn: [17],
    },
    {
      number: 20,
      isIndependent: false,
      originalText: manualClaimText(20),
      plainEnglish: sourceBoundedDependentClaimReading(20),
      keyInnovations: ["Refined claim 20 specification feature"],

      dependsOn: [17],
    },
    {
      number: 21,
      isIndependent: false,
      originalText: manualClaimText(21),
      plainEnglish:
        "The transporter of claim 17 with separate cluster rotation control and independent wheel drive control for wheels in ground contact.",
      keyInnovations: [
        "Separate cluster-orientation and ground-contact wheel control",
        "Ground-contact wheel rotation control",
      ],

      dependsOn: [17],
    },
    {
      number: 22,
      isIndependent: false,
      originalText: manualClaimText(22),
      plainEnglish:
        "The transporter of claim 21 where the wheel control means has a balance mode that uses the control loop while wheels in contact with the ground are driven to maintain fore-aft balance.",
      keyInnovations: ["Fore-aft balance mode for ground-contact wheels"],

      dependsOn: [21],
    },
    {
      number: 23,
      isIndependent: false,
      originalText: manualClaimText(23),
      plainEnglish:
        "The transporter of claim 21 where wheel control has a slave mode related to cluster rotation, while cluster control has a lean mode using the control loop for stair or other surface-feature use.",
      keyInnovations: ["Cluster-rotation slave mode", "Cluster-control lean mode"],

      dependsOn: [21],
    },
    {
      number: 24,
      isIndependent: false,
      originalText: manualClaimText(24),
      plainEnglish: sourceBoundedDependentClaimReading(24),
      keyInnovations: ["Refined claim 24 specification feature"],

      dependsOn: [23],
    },
    {
      number: 25,
      isIndependent: false,
      originalText: manualClaimText(25),
      plainEnglish: sourceBoundedDependentClaimReading(25),
      keyInnovations: ["Refined claim 25 specification feature"],

      dependsOn: [24],
    },
    {
      number: 26,
      isIndependent: false,
      originalText: manualClaimText(26),
      plainEnglish:
        "Claim 26 specifies coordination between cluster and wheel control: start with a first wheel pair, rotate a second pair to the stair, transfer weight while wheel drives maintain cluster position relative to the world, then alternate transfer and climb before returning to normal balance. The claim states an ordered relationship, not a timing or performance result.",
      keyInnovations: [
        "Claimed start, transfer, and climb state ordering",
        "Coordination of cluster and wheel control means",
      ],
      legalSignificance:
        "Dependent claim spelling out a coordination sequence for the source-described stair-climbing mode.",
      dependsOn: [21],
    },
    {
      number: 27,
      isIndependent: false,
      originalText: manualClaimText(27),
      plainEnglish: sourceBoundedDependentClaimReading(27),
      keyInnovations: ["Refined claim 27 specification feature"],

      dependsOn: [23],
    },
    {
      number: 28,
      isIndependent: false,
      originalText: manualClaimText(28),
      plainEnglish: sourceBoundedDependentClaimReading(28),
      keyInnovations: ["Refined claim 28 specification feature"],

      dependsOn: [17],
    },
    {
      number: 29,
      isIndependent: false,
      originalText: manualClaimText(29),
      plainEnglish:
        "The transporter of claim 17 with leaning means that sense a subject's direction of leaning and control the motorized drive to move in that direction.",
      keyInnovations: ["Leaning-direction drive-control relationship"],

      dependsOn: [17],
    },
    {
      number: 30,
      isIndependent: false,
      originalText: manualClaimText(30),
      plainEnglish: sourceBoundedDependentClaimReading(30),
      keyInnovations: ["Refined claim 30 specification feature"],

      dependsOn: [29],
    },
    {
      number: 31,
      isIndependent: false,
      originalText: manualClaimText(31),
      plainEnglish: sourceBoundedDependentClaimReading(31),
      keyInnovations: ["Refined claim 31 specification feature"],

      dependsOn: [29],
    },
    {
      number: 32,
      isIndependent: false,
      originalText: manualClaimText(32),
      plainEnglish: sourceBoundedDependentClaimReading(32),
      keyInnovations: ["Refined claim 32 specification feature"],

      dependsOn: [17],
    },
    {
      number: 33,
      isIndependent: false,
      originalText: manualClaimText(33),
      plainEnglish: sourceBoundedDependentClaimReading(33),
      keyInnovations: ["Refined claim 33 specification feature"],

      dependsOn: [17],
    },
    {
      number: 34,
      isIndependent: false,
      originalText: manualClaimText(34),
      plainEnglish: sourceBoundedDependentClaimReading(34),
      keyInnovations: ["Refined claim 34 specification feature"],

      dependsOn: [23],
    },
    {
      number: 35,
      isIndependent: false,
      originalText: manualClaimText(35),
      plainEnglish: sourceBoundedDependentClaimReading(35),
      keyInnovations: ["Refined claim 35 specification feature"],

      dependsOn: [24],
    },
    {
      number: 36,
      isIndependent: false,
      originalText: manualClaimText(36),
      plainEnglish: sourceBoundedDependentClaimReading(36),
      keyInnovations: ["Refined claim 36 specification feature"],

      dependsOn: [33],
    },
    {
      number: 37,
      isIndependent: false,
      originalText: manualClaimText(37),
      plainEnglish: sourceBoundedDependentClaimReading(37),
      keyInnovations: ["Refined claim 37 specification feature"],

      dependsOn: [17],
    },
    {
      number: 38,
      isIndependent: false,
      originalText: manualClaimText(38),
      plainEnglish: sourceBoundedDependentClaimReading(38),
      keyInnovations: ["Refined claim 38 specification feature"],

      dependsOn: [37],
    },
    {
      number: 39,
      isIndependent: false,
      originalText: manualClaimText(39),
      plainEnglish: sourceBoundedDependentClaimReading(39),
      keyInnovations: ["Refined claim 39 specification feature"],

      dependsOn: [17],
    },
    {
      number: 40,
      isIndependent: false,
      originalText: manualClaimText(40),
      plainEnglish: sourceBoundedDependentClaimReading(40),
      keyInnovations: ["Refined claim 40 specification feature"],

      dependsOn: [39],
    },
    {
      number: 41,
      isIndependent: false,
      originalText: manualClaimText(41),
      plainEnglish: sourceBoundedDependentClaimReading(41),
      keyInnovations: ["Refined claim 41 specification feature"],

      dependsOn: [39],
    },
    {
      number: 42,
      isIndependent: false,
      originalText: manualClaimText(42),
      plainEnglish: sourceBoundedDependentClaimReading(42),
      keyInnovations: ["Refined claim 42 specification feature"],

      dependsOn: [41],
    },
    {
      number: 43,
      isIndependent: false,
      originalText: manualClaimText(43),
      plainEnglish:
        "The transporter of claim 1 where the support is proximate to the ground to permit a subject to stand on it.",
      keyInnovations: [
        "Low standing platform configuration",
        "Standing-subject support relationship",
      ],
      legalSignificance:
        "Dependent claim narrowing the Claim 1 support arrangement to one that permits standing.",
      dependsOn: [1],
    },
    {
      number: 44,
      isIndependent: false,
      originalText: manualClaimText(44),
      plainEnglish:
        "The standing transporter of claim 43 further comprising a handle affixed to the support with a grip at approximately rider waist height for scooter operation.",
      keyInnovations: ["Waist-height steering handlebar assembly"],

      dependsOn: [43],
    },
    {
      number: 45,
      isIndependent: false,
      originalText: manualClaimText(45),
      plainEnglish: sourceBoundedDependentClaimReading(45),
      keyInnovations: ["Refined claim 45 specification feature"],

      dependsOn: [43],
    },
    {
      number: 46,
      isIndependent: false,
      originalText: manualClaimText(46),
      plainEnglish: sourceBoundedDependentClaimReading(46),
      keyInnovations: ["Refined claim 46 specification feature"],

      dependsOn: [43],
    },
    {
      number: 47,
      isIndependent: false,
      originalText: manualClaimText(47),
      plainEnglish: sourceBoundedDependentClaimReading(47),
      keyInnovations: ["Refined claim 47 specification feature"],

      dependsOn: [44],
    },
    {
      number: 48,
      isIndependent: false,
      originalText: manualClaimText(48),
      plainEnglish:
        "The transporter of claim 1 where the control loop cyclically reads subject-provided and state-variable inputs, modifies program state, and performs calculations for motorized-drive control.",
      keyInnovations: ["Cyclical control-loop input ordering", "Program-state update relationship"],

      dependsOn: [1],
    },
    {
      number: 49,
      isIndependent: true,
      originalText: manualClaimText(49),
      plainEnglish:
        "An independent payload-transporter version of the Claim 1 arrangement, using support members, a motorized drive arrangement, and a fore-aft control loop.",
      keyInnovations: [
        "Payload transport control-loop arrangement",
        "Fore-aft balance relationship",
      ],
      legalSignificance:
        "Independent payload-oriented variant of the transport and control arrangement.",
    },
    {
      number: 50,
      isIndependent: false,
      originalText: manualClaimText(50),
      plainEnglish: sourceBoundedDependentClaimReading(50),
      keyInnovations: ["Refined claim 50 specification feature"],

      dependsOn: [49],
    },
    {
      number: 51,
      isIndependent: false,
      originalText: manualClaimText(51),
      plainEnglish: sourceBoundedDependentClaimReading(51),
      keyInnovations: ["Refined claim 51 specification feature"],

      dependsOn: [49],
    },
    {
      number: 52,
      isIndependent: false,
      originalText: manualClaimText(52),
      plainEnglish: sourceBoundedDependentClaimReading(52),
      keyInnovations: ["Refined claim 52 specification feature"],

      dependsOn: [50],
    },
    {
      number: 53,
      isIndependent: false,
      originalText: manualClaimText(53),
      plainEnglish: sourceBoundedDependentClaimReading(53),
      keyInnovations: ["Refined claim 53 specification feature"],

      dependsOn: [52],
    },
    {
      number: 54,
      isIndependent: false,
      originalText: manualClaimText(54),
      plainEnglish: sourceBoundedDependentClaimReading(54),
      keyInnovations: ["Refined claim 54 specification feature"],

      dependsOn: [52],
    },
  ],

  historicalContext: {
    problemStatement:
      "The grant itself identifies a tension between stability and ease of locomotion for human transport devices over irregular surfaces and stairs. It says stair-climbing devices tend to be complex, heavy, and difficult for ordinary locomotion.",
    priorArtLimitations: [
      "The source says existing transport devices require compromises to address physical incapacity.",
      "The source identifies the difficulty of a self-propelled, user-guidable transporter that can address stairs and ordinary locomotion.",
      "The reviewed grant does not quantify earlier vehicles, comparative safety, weight, speed, or commercial performance.",
    ],
    breakthroughInsight:
      "Within the checked claims, the differentiating structure is the combination of a ground-contacting module, motorized drive and control loop, cluster and wheel-control relations, and a coordination sequence. This record does not infer a particular control implementation.",
    patentWars: [],
    civilizationalImpact:
      "This source-bound record does not make an unsourced commercial or industry-wide impact claim. Its educational value lies in making the grant's claimed mobility-control topology legible.",
    aftermath:
      "No source-verified commercial, regulatory, or litigation after-history is asserted in this edition.",
    sideNotes: [],
    funFact:
      "The reviewed grant prints 54 claims and includes both human-subject and payload transporter embodiments.",
  },

  stats: {
    totalClaims: 54,
    independentClaims: 2,
  },
};
