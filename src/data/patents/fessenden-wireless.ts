import {
  fessendenWirelessArchivalEdition,
  manualFessendenClaimText,
} from "@/data/editions/fessendenWirelessEdition";
import type { Patent } from "@/types/patent";

const fessendenClaimDecoders: Record<
  number,
  { plainEnglish: string; keyInnovations: string[]; legalSignificance?: string }
> = {
  1: {
    plainEnglish:
      "Claims a transmitting conductor whose capacitance is large and substantially uniform across its radiating portion. The legal work is the distributed-capacity aerial geometry, not an asserted continuous-wave receiver or a later detector.",
    keyInnovations: ["Distributed aerial capacity", "Radiating portion"],
  },
  2: {
    plainEnglish:
      "Claims a sending conductor whose capacitance is adjusted to make its radiated electromagnetic waves low in frequency. It protects the specified electrical adjustment, rather than a generic claim to all wireless signaling.",
    keyInnovations: ["Low-frequency radiation", "Adjusted capacitance"],
  },
  3: {
    plainEnglish:
      "Claims a sending conductor with both capacitance and inductance adjusted so that its waves have low frequency. The protected relationship is the jointly tuned electrical constants of the conductor.",
    keyInnovations: ["Capacitance-inductance tuning", "Low-frequency waves"],
  },
  4: {
    plainEnglish:
      "Claims a transmission system using an alternating-voltage source and series sending conductor whose radiating portion is a large fraction of the quarter-wave length in its surrounding medium. It ties physical radiator length to the source-driven wave.",
    keyInnovations: ["Quarter-wave proportion", "Series sending conductor"],
  },
  5: {
    plainEnglish:
      "Claims a source-and-conductor transmission system in which the radiating portion forms a large fraction of the whole sending conductor. It distinguishes the radiating element from the entire series circuit.",
    keyInnovations: ["Radiating-length fraction", "Whole sending conductor"],
  },
  6: {
    plainEnglish:
      "Claims a system with a low-frequency impulse source and a series conductor proportioned to radiate electromagnetic waves and tuned to that source. The legal combination is source, tuned conductor, and radiation function.",
    keyInnovations: ["Low-frequency impulses", "Source tuning"],
  },
  7: {
    plainEnglish:
      "Claims the combination of an alternating-current dynamo and series conductor that forms a sending conductor tuned to the dynamo and adapted to radiate electromagnetic waves. The dynamo is an explicit claimed component.",
    keyInnovations: ["Alternating-current dynamo", "Dynamo-tuned conductor"],
  },
  8: {
    plainEnglish:
      "Claims a low-frequency sending conductor with an alternating-current dynamo connected between its radiating portion and ground, adjusted to approximately the conductor's natural period. The source and ground connection are both limiting elements.",
    keyInnovations: ["Grounded dynamo connection", "Natural-period adjustment"],
  },
  9: {
    plainEnglish:
      "Claims a sending conductor formed by a grounded-pole alternating-current dynamo and a series conductor, proportioned for low-frequency radiation. It treats the dynamo and conductor together as the sending conductor.",
    keyInnovations: ["Grounded dynamo pole", "Composite sending conductor"],
  },
  10: {
    plainEnglish:
      "Claims a low-frequency sending conductor combined with an alternating-voltage source connected to the radiating portion and ground, with source periodicity matching the connected system's natural period.",
    keyInnovations: ["Voltage-generator periodicity", "System natural period"],
  },
  11: {
    plainEnglish:
      "Claims a sending conductor formed from a continuously alternating-voltage source and series conductor, with one source pole grounded and the combination proportioned for low-frequency radiation.",
    keyInnovations: ["Continuous alternating voltage", "Grounded source pole"],
  },
  12: {
    plainEnglish:
      "Claims a signaling system combining a low-frequency radiating conductor with a receiver that uses a constant or independently varying magnetic field and responds to currents produced by the waves.",
    keyInnovations: ["Magnetic-field receiver", "Wave-produced currents"],
  },
  13: {
    plainEnglish:
      "Claims a short sending conductor whose operating frequency equals its natural period and whose radiating portion is a large fraction of its total length. It makes the electrical length constraint explicit.",
    keyInnovations: ["Short electrical conductor", "Natural-period frequency"],
  },
  14: {
    plainEnglish:
      "Claims a sending conductor with a natural vibration period much lower than that of an ether-wave four times its length, allowing a relatively large radiating portion of the total conductor.",
    keyInnovations: ["Low natural period", "Large radiating fraction"],
  },
  15: {
    plainEnglish:
      "Claims a sending conductor tuned to a selected low frequency through large capacitance and small inductance. It is a concise claim to that particular tuning choice.",
    keyInnovations: ["Large capacity", "Small inductance"],
  },
  16: {
    plainEnglish:
      "Claims a sending conductor having small inductance and tuned to a desired low frequency by a suitably proportioned large capacitance. The claim specifies the capacitance proportion as well as the tuning objective.",
    keyInnovations: ["Proportioned capacitance", "Small inductance"],
  },
  17: {
    plainEnglish:
      "Claims a low-resistance sending conductor with small self-induction and great capacity for the stated purpose. The three electrical properties are jointly required.",
    keyInnovations: ["Low resistance", "Great capacity", "Small self-induction"],
  },
  18: {
    plainEnglish:
      "Claims the same low-resistance, low-self-induction, high-capacity conductor when correlated to sustain persistent low-frequency oscillation relative to an ether-wave four times its conductor length.",
    keyInnovations: ["Persistent oscillation", "Correlated electrical constants"],
  },
  19: {
    plainEnglish:
      "Claims a transmission system whose radiating conductor and alternating-energy source are coordinated and relatively adjusted to radiate a substantially continuous electromagnetic stream.",
    keyInnovations: ["Coordinated source and radiator", "Continuous stream"],
  },
  20: {
    plainEnglish:
      "Claims a similar source-and-radiator system specifically adjusted to generate and radiate a substantially continuous electromagnetic stream. The verb generate adds a stated function to the coordinated apparatus.",
    keyInnovations: ["Generation of continuous waves", "Radiating conductor"],
  },
  21: {
    plainEnglish:
      "Claims a source-and-radiating-conductor system coordinated to radiate a substantially continuous electromagnetic stream of substantially uniform strength. The uniform-strength limitation is printed in the claim itself.",
    keyInnovations: ["Uniform-strength waves", "Coordinated apparatus"],
  },
};

const fessendenClaims = Array.from({ length: 21 }, (_, index) => {
  const number = index + 1;
  return {
    number,
    isIndependent: true,
    originalText: manualFessendenClaimText(number),
    ...fessendenClaimDecoders[number],
  };
});

export const fessendenWirelessPatent: Patent = {
  id: "us-706737-fessenden-wireless",
  patentNumber: "US 706,737",
  title: "Wireless Telegraphy",
  shortTitle: "Low-Frequency Wireless Radiating Conductors",
  subtitle: "Distributed Capacity, Dynamo Resonance, and Direct-Action Electromagnetic Receivers",
  inventors: ["Reginald Aubrey Fessenden"],
  inventorLocation: "Allegheny, Pennsylvania",
  grantDate: "1902-08-12",
  filingDate: "1901-05-29",
  era: "Electrification & Early Modern (1870–1920)",
  category: "telecom",
  categoryLabel: "Telecommunications & Radio Frequency Engineering",
  summary:
    "Reginald A. Fessenden's 1902 grant concerns lower-frequency electromagnetic-wave transmission: increasing a sending conductor's capacity and self-induction, its radiating portion, and the relation of an alternating-voltage source to the conductor's natural period. The printed claims run from distributed capacity through coordinated source-and-radiator systems.",
  heroQuote:
    "The invention described herein relates to certain improvements in transmission of energy by electromagnetic waves, and has for its object the production of more efficient sending or generating conductors.",
  originalPdfUrl: "/patents/pdfs/us-706737-fessenden-wireless.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US706737A/en",
  usptoClassification: "375/295",
  originalTextAsset: {
    url: "/patents/transcripts/us-706737-fessenden-wireless-reviewed.txt",
    pageCount: 7,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (Codex)",
    reviewedAt: "2026-08-21",
    sourcePdfSha256: "2098ec6d967d3ab7999da0fb96357328fa68bb8e7639c1863ac600547aff8887",
    pageAnchors: [
      {
        page: 1,
        sourceRelationship: "drawing-sheet",
        exactSourceText: "FIG. 1. FIG. 2. FIG. 3. FIG. 4. FIG. 5. Reginald A. Fessenden Inventor.",
      },
      {
        page: 2,
        sourceRelationship: "specification-masthead",
        exactSourceText:
          "UNITED STATES PATENT OFFICE. REGINALD A. FESSENDEN, OF ALLEGHENY, PENNSYLVANIA. WIRELESS TELEGRAPHY. Letters Patent No. 706,737, dated August 12, 1902.",
      },
      {
        page: 3,
        sourceRelationship: "specification-body",
        exactSourceText:
          "cage or cylinder can be connected to ground in any suitable manner, as by the wire 8, in which coils or turns may be formed to adjust the self-induction of the sending-conductor.",
      },
      {
        page: 4,
        sourceRelationship: "specification-body",
        exactSourceText:
          "with a sending-conductor of large capacity uniformly distributed it is possible to get a sine-wave and a low resistance—i. e., conditions necessary and favorable for the production of large resonant voltages from small impressed voltages",
      },
      {
        page: 5,
        sourceRelationship: "specification-body",
        exactSourceText:
          "The receiving instrument consists of a vessel containing a liquid—such as a solution of nitric acid, caustic soda, &c.—in which are immersed two terminals",
      },
      {
        page: 6,
        sourceRelationship: "specification-claims",
        exactSourceText:
          "1. A sending-conductor for electromagnetic waves, having a large capacity distributed with substantial uniformity over its radiating portion, substantially as set forth.",
      },
      {
        page: 7,
        sourceRelationship: "claims-and-signatures",
        exactSourceText:
          "In testimony whereof I have hereunto set my hand. REGINALD A. FESSENDEN. Witnesses: W. B. FEARING, S. C. GRAY.",
      },
    ],
  },
  archivalEdition: fessendenWirelessArchivalEdition,
  originalText:
    "Be it known that I, REGINALD A. FESSENDEN, a citizen of the United States, residing at Allegheny, in the county of Allegheny and State of Pennsylvania, have invented certain new and useful Improvements in Wireless Telegraphy, of which the following is a specification.\n\nThe invention described herein relates to certain improvements in transmission of energy by electromagnetic waves, and has for its object the production of more efficient sending or generating conductors.\n\nIt is a further object of the invention to provide for the production of mechanical movements by the direct interaction of currents induced in the receiving-conductor by electromagnetic waves and constant or varying magnetic fields.",
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Wireless Telegraphy System",
      caption:
        "Diagrammatic system with radiating portion 1, inductance 2, alternating-current dynamo 3, and receiving-conductor 10 connected to telephone-receiver 11 and ground.",
      svgType: "fessenden-wireless",
      callouts: [
        {
          id: "fw-1",
          figureRef: "Fig. 1",
          label: "1",
          element: "Low-Loss Sending Conductor",
          description:
            "Radiating portion of the sending-conductor connected through the source and inductance.",
          x: 35,
          y: 25,
        },
        {
          id: "fw-2",
          figureRef: "Fig. 1",
          label: "2",
          element: "Series Tuning Inductance",
          description:
            "Coils in the conductor used to adjust the self-induction of the sending-conductor.",
          x: 25,
          y: 55,
        },
        {
          id: "fw-3",
          figureRef: "Fig. 1",
          label: "3",
          element: "Alternating-Current Dynamo",
          description:
            "Alternating-current dynamo serving as the source of voltage for the sending-conductor.",
          x: 18,
          y: 75,
        },
        {
          id: "fw-10",
          figureRef: "Fig. 1",
          label: "10",
          element: "Receiving Aerial Conductor",
          description: "Receiving-conductor connected to the receiving instrument and ground.",
          x: 70,
          y: 25,
        },
        {
          id: "fw-11",
          figureRef: "Fig. 1",
          label: "11",
          element: "Telephone Receiver Earpiece",
          description:
            "Telephone-receiver whose diaphragm responds to the low-frequency induced currents.",
          x: 88,
          y: 70,
        },
      ],
    },
    {
      figureNumber: "Fig. 2",
      title: "Modified Receiving Apparatus",
      caption:
        "Modified receiving apparatus with fine wire 12 between magnet poles 13, and an alternative liquid receiver with vessel 13, terminals 14, local battery 15, and telephone 16.",
      svgType: "fessenden-wireless",
      callouts: [
        {
          id: "fw-12",
          figureRef: "Fig. 2",
          label: "12",
          element: "Fine Wire Receiver",
          description:
            "Fine wire held in tension between the poles of a magnet and moved by the induced current.",
          x: 75,
          y: 60,
        },
        {
          id: "fw-13",
          figureRef: "Fig. 2",
          label: "13",
          element: "Magnet Poles / Liquid Vessel",
          description:
            "The drawing uses this number for the magnet in the fine-wire form and for the vessel in the liquid-receiver form.",
          x: 75,
          y: 75,
        },
        {
          id: "fw-14",
          figureRef: "Fig. 2",
          label: "14",
          element: "Fine Terminal",
          description:
            "Extremely small terminal, including a Wollaston platinum wire in the liquid-receiver form.",
          x: 75,
          y: 50,
        },
        {
          id: "fw-15",
          figureRef: "Fig. 2",
          label: "15",
          element: "Local Battery",
          description: "Local battery included with the liquid receiver and telephone circuit.",
          x: 60,
          y: 70,
        },
        {
          id: "fw-16",
          figureRef: "Fig. 2",
          label: "16",
          element: "Telephone",
          description:
            "Telephone included in the local receiving circuit and producing an audible signal.",
          x: 88,
          y: 70,
        },
      ],
    },
    {
      figureNumber: "Fig. 3",
      title: "Low-Loss Cylindrical Cage Antenna Elevation",
      caption:
        "Side elevation of low-loss cylindrical cage antenna comprising vertical conductors (4), circular metallic spreader rings (5), insulated supporting mast (7), and base connection (8).",
      svgType: "fessenden-wireless",
      callouts: [
        {
          id: "fw-4",
          figureRef: "Fig. 3",
          label: "4",
          element: "Parallel Wires",
          description:
            "Wires arranged in the form of a cylinder or cage and connected together at top and bottom.",
          x: 40,
          y: 40,
        },
        {
          id: "fw-5",
          figureRef: "Fig. 3",
          label: "5",
          element: "Supporting Rings",
          description:
            "Metal or other suitable rings supporting the wires through hubs or collars.",
          x: 50,
          y: 20,
        },
        {
          id: "fw-7",
          figureRef: "Fig. 3",
          label: "7",
          element: "Central Mast",
          description: "Central mast or support carrying the hubs or collars of the cage.",
          x: 50,
          y: 50,
        },
      ],
    },
    {
      figureNumber: "Fig. 4",
      title: "Cylindrical Cage Antenna Transverse Cross-Section",
      caption:
        "Horizontal transverse section of cylindrical cage antenna showing circumferential radiating wires (4), support ring (5), and insulated hub collar (6).",
      svgType: "fessenden-wireless",
      callouts: [
        {
          id: "fw-4-sec",
          figureRef: "Fig. 4",
          label: "4",
          element: "Wires",
          description: "The wires shown in transverse section around the cylindrical conductor.",
          x: 50,
          y: 15,
        },
        {
          id: "fw-5-ring",
          figureRef: "Fig. 4",
          label: "5",
          element: "Ring",
          description: "The supporting ring shown in transverse section.",
          x: 50,
          y: 50,
        },
        {
          id: "fw-6-hub",
          figureRef: "Fig. 4",
          label: "6",
          element: "Hub or Collar",
          description: "The hub or collar mounted on the central supporting mast.",
          x: 50,
          y: 50,
        },
      ],
    },
    {
      figureNumber: "Fig. 5",
      title: "Cylinder Radiating Portion Detail",
      caption:
        "Detail view illustrating a radiating portion formed by a cylinder 9 having continuous metal walls.",
      svgType: "fessenden-wireless",
      callouts: [
        {
          id: "fw-9-cyl",
          figureRef: "Fig. 5",
          label: "9",
          element: "Cylinder",
          description: "Alternative radiating portion formed with continuous metal walls.",
          x: 50,
          y: 50,
        },
        {
          id: "fw-17-sleeve",
          figureRef: "Fig. 5",
          label: "17",
          element: "Adjusting Means",
          description:
            "Detail illustrating an adjusting means for the antenna or generating-conductor.",
          x: 50,
          y: 30,
        },
      ],
    },
  ],
  plainEnglishExplanation: {
    overview:
      "The specification contrasts high-potential, high-frequency spark-gap oscillations, which rapidly diminish and vary in frequency and form, with a continuous train of waves of substantially uniform strength and predetermined frequency. Its stated engineering move is to enlarge and distribute the sending-conductor's capacity or self-induction so the radiating portion is a large fraction of the conductor and low-frequency currents can be used.",
    coreMechanism:
      "The source is an alternating-current dynamo or similar alternating-voltage source in series with the sending-conductor and ground. The conductor's capacity and self-induction are proportioned so its natural period is equal or approximately equal to the source frequency. In the receiving apparatus, low-frequency induced currents act directly on a telephone diaphragm, a fine wire in a magnetic field, or a tiny terminal in a liquid-and-battery circuit. The specification's resonance relationship is $f_{source} \\approx f_{natural}$; it does not claim a carbon microphone, amplitude modulation, or a later audio-broadcast system.",
    mechanicalBreakdown: [
      {
        title: "Alternating-Current Source",
        summary:
          "A low-frequency, substantial-voltage alternating-current dynamo is connected directly in series with the sending-conductor and ground.",
        technicalDetails:
          "The grant says the source frequency should match the conductor's natural period, the armature should have low internal resistance and self-induction, and the machine should be ventilated for the potentially large current.",
        archaicTerm: "alternating-current dynamo",
        modernEquivalent: "Low-frequency alternating-voltage generator",
      },
      {
        title: "Distributed-Capacity Sending-Conductor",
        summary:
          "A plurality of wires forms a cylinder or cage around a central mast, with supporting rings and a ground lead whose turns can adjust self-induction.",
        technicalDetails:
          "The source states that large capacity or self-induction, distributed with practical uniformity, lowers the frequency and allows a large radiating fraction. A continuous-wall cylinder is also described.",
        archaicTerm: "sending-conductor",
        modernEquivalent: "Distributed-capacitance radiating conductor",
      },
      {
        title: "Direct-Action Receiving Instruments",
        summary:
          "The receiving alternatives use the low-frequency induced current directly: a telephone, a fine wire between magnet poles, or a liquid receiver with a very small terminal and local battery.",
        technicalDetails:
          "The liquid form uses a vessel containing nitric acid, caustic soda, or similar liquid, with a Wollaston platinum terminal from one-thousandth to one ten-thousandth of an inch in diameter. Heat at the small terminal changes circuit resistance and varies the telephone current.",
        archaicTerm: "translating device",
        modernEquivalent: "Direct-current receiving transducer",
      },
      {
        title: "Source-to-Radiator Resonance",
        summary:
          "The source and sending-conductor are adjusted so the source frequency is equal or approximately equal to the natural frequency of the radiating system.",
        technicalDetails:
          "The specification says this adjustment makes the voltage at the top of the sending-conductor a maximum for a given voltage at the dynamo terminals.",
        archaicTerm: "natural period",
        modernEquivalent: "Source-and-radiator resonance",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Source and Conductor Resonance",
        formula: "f_{source} \\approx f_{natural}",
        explanation:
          "Fessenden says the best result occurs when the alternating-voltage source frequency is equal or approximately equal to the natural frequency of the radiating system, maximizing voltage at the top of the sending-conductor for a given source voltage.",
      },
      {
        principle: "Distributed Capacity and Inductance",
        formula: "f_{wave} \\downarrow \\text{ as } C \\text{ or } L \\uparrow",
        explanation:
          "The specification states that increasing capacity, self-induction, or both decreases the frequency of the radiated waves and correspondingly increases their wavelength, while distributed capacity allows a shorter conductor with a larger radiating fraction.",
      },
      {
        principle: "Direct Thermal Receiving Action",
        formula: "\\Delta R \\propto I^2 R_{small-terminal}",
        explanation:
          "In the liquid receiver described in Fig. 2, current-induced heat at the extremely small terminal changes the circuit resistance and therefore varies current through the local telephone.",
      },
    ],
    whyItMattersToday:
      "The grant is an early source record for low-frequency radiating conductors, source-to-antenna resonance, and direct-action receiving instruments. Its claims should not be presented as proof that this single document claimed amplitude modulation, mobile telephony, or every later radio system.",
  },
  claims: fessendenClaims,
  historicalContext: {
    problemStatement:
      "The grant identifies the contemporary problem as high-potential, high-frequency spark-gap oscillations that rapidly diminish, vary in frequency and form, and do not produce continuous uniform signals.",
    priorArtLimitations: [
      "Spark-gap waves rapidly diminished in amplitude or power",
      "Spark-gap waves were irregular and varied in frequency and form",
      "Receiving instruments such as coherers required mechanical tapping to restore them to an operative condition",
    ],
    breakthroughInsight:
      "Increasing and distributing the sending-conductor's capacity or self-induction lowers the frequency, increases wavelength, and allows a large radiating portion; a dynamo or similar alternating-voltage source can then replace the induction-coil and spark-gap.",
    patentWars: [],
    civilizationalImpact:
      "The document records an early low-frequency wireless architecture: a distributed-capacity radiating conductor, source-to-conductor resonance, and receiving instruments driven directly by induced current.",
  },
  stats: {
    totalClaims: 21,
    independentClaims: 21,
  },
};
