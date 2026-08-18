import { lamarrFrequencyHoppingArchivalEdition } from "@/data/editions/lamarrFrequencyHoppingEdition";
import type { Patent, PatentClaim } from "@/types/patent";

const manualClaimBlocks = lamarrFrequencyHoppingArchivalEdition.blocks.filter(
  (block) => block.kind === "claim",
);

const claimDecoders: Readonly<Record<number, Omit<PatentClaim, "number" | "originalText">>> = {
  1: {
    isIndependent: true,
    plainEnglish:
      "The principal apparatus claim covers a transmitting station and receiving station that each move a record past selective actuators, keeping the receiver tuned to the transmitter's changing carrier frequency.",
    keyInnovations: [
      "synchronized record strips",
      "selective frequency tuning",
      "coordinated transmitter and receiver",
    ],
  },
  2: {
    isIndependent: false,
    dependsOn: [1],
    plainEnglish:
      "This narrows claim 1 to records whose different control positions are distinguished by lateral placement across the strip.",
    keyInnovations: ["laterally positioned recordings", "position-sensitive reader"],
  },
  3: {
    isIndependent: false,
    dependsOn: [1],
    plainEnglish:
      "This specifies a slotted ribbon and movable tuning elements selected by the lateral position of those slots.",
    keyInnovations: ["slotted ribbon", "movable tuning elements"],
  },
  4: {
    isIndependent: true,
    plainEnglish:
      "This applies the synchronized frequency-changing system to a movable craft whose receiver turns received signals into movement control.",
    keyInnovations: [
      "movable craft control",
      "synchronized radio receiver",
      "frequency-selected control signals",
    ],
  },
  5: {
    isIndependent: false,
    dependsOn: [4],
    plainEnglish:
      "This adds a control element that moves one predetermined increment for each distinct received impulse, regardless of that impulse's duration.",
    keyInnovations: ["incremental control", "one impulse per movement step"],
  },
  6: {
    isIndependent: false,
    dependsOn: [1],
    plainEnglish:
      "The sixth claim adds deliberately unreceivable transmitter frequencies and a transmitter-side indication of when the current frequency is one of those decoy channels.",
    keyInnovations: [
      "false channels",
      "transmitter-side indication",
      "receiver-excluded frequencies",
    ],
  },
};

const manualClaims: PatentClaim[] = manualClaimBlocks.map(({ number, inlines }) => ({
  number,
  originalText: inlines.map((inline) => inline.text).join(""),
  ...claimDecoders[number],
}));

export const lamarrPatent: Patent = {
  id: "us-2292387-lamarr-frequency-hopping",
  patentNumber: "US 2,292,387",
  title: "Secret Communication System",
  shortTitle: "Synchronized Frequency-Control Records",
  subtitle: "Matched perforated records change transmitter and receiver tuning together",
  inventors: ["Hedy Kiesler Markey", "George Antheil"],
  inventorLocation: "Los Angeles and Manhattan Beach, California",
  grantDate: "1942-08-11",
  filingDate: "1941-06-10",
  era: "Electronic Era (1920–1960)",
  category: "telecom",
  categoryLabel: "Radio Control & Secret Communication",
  summary:
    "Markey and Antheil's grant describes a radio-control system for a torpedo in which matched moving records change the transmitter and receiver tuning together. The illustrated arrangement uses seven selectable transmitting channels, four receiver channels, a warning lamp, and decoy transmissions; it also explains that player-piano records could provide as many as 88 rows.",
  heroQuote:
    "This invention relates broadly to secret communication systems involving the use of carrier waves of different frequencies, and is especially useful in the remote control of dirigible craft, such as torpedoes.",
  originalPdfUrl: "/patents/pdfs/us-2292387-lamarr-frequency-hopping.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US2292387A/en",
  usptoClassification: "Cl. 250-2 (as printed in the grant)",
  originalTextAsset: {
    url: "/patents/transcripts/us-2292387-lamarr-frequency-hopping-reviewed.txt",
    pageCount: 7,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (MossyFortress)",
    reviewedAt: "2026-08-18",
    sourcePdfSha256: "8204e975e2ea96f34973b87f3cab20d28604e52596c116af367facb74e319292",
  },
  archivalEdition: lamarrFrequencyHoppingArchivalEdition,
  originalText:
    "Reviewed excerpt only. The complete, hand-prepared source reading is available in the Original Patent Text view. This invention relates broadly to secret communication systems involving the use of carrier waves of different frequencies, and is especially useful in the remote control of dirigible craft, such as torpedoes.",
  plainEnglishExplanation: {
    overview:
      "The grant addresses a radio-controlled torpedo whose control frequency could be discovered and imitated. Its illustrated solution is not a single fixed channel: a transmitting station and a receiver use matched moving records to change their tuning in step. The drawings show seven selectable transmitter frequencies, four receiver frequencies, and additional transmitter channels used for false impulses. The specification notes that player-piano records can have as many as 88 rows, but does not say that the illustrated apparatus uses 88 channels.",
    coreMechanism:
      "The two records are held at their starting holes, then released together when the torpedo is fired. As a perforation reaches a control-head passage, the pneumatic mechanism lets a spring close a selected tuning switch. At the transmitter, that connects one of capacitors 24a through 24g to oscillator 20; at the receiver, a matching record controls selector 61. A 100-cycle modulation tone produces a one-step left-rudder command, while a 500-cycle tone produces a one-step right-rudder command. The lamp on row H tells the operator when a transmission is a false signal or falls between usable channels.",
    mechanicalBreakdown: [
      {
        title: "Synchronous record strips",
        summary:
          "A record at each station selects tuning positions as it moves over its own control head.",
        technicalDetails:
          "The records are held by pins in special starting holes and released simultaneously when the torpedo is fired. The specification permits constant-speed clock motors and also permits periodic correction of the receiving record by synchronizing impulses.",
        archaicTerm: "record strip",
        modernEquivalent: "a physical sequence that selects one tuning state after another",
      },
      {
        title: "Variable-frequency transmitting station",
        summary:
          "Oscillator 20, modulator 21, amplifier 22, and antenna 23 form the illustrated transmitting station.",
        technicalDetails:
          "Seven tuning condensers, 24a through 24g, have different capacities and are independently connected to oscillator 20 by switches 31. The illustrated apparatus therefore selects seven transmitter frequencies; the specification's 88-row player-piano passage describes a separate possible record.",
        archaicTerm: "tuning condensers",
        modernEquivalent: "selectable capacitors that change an oscillator's tuned frequency",
      },
      {
        title: "Record-responsive pneumatic switching",
        summary: "Perforations in strip 37 determine which tuning switch closes.",
        technicalDetails:
          "A solid section of paper lets suction lift piston 53 and leave switch 31 open. A hole admits air through passage 46, breaks that suction, and lets spring 53a close the switch. Different rows bring different capacitors into circuit in whatever order the record provides.",
        archaicTerm: "record-actuated means",
        modernEquivalent:
          "a reader that converts the position of a paper perforation into a switching action",
      },
      {
        title: "Receiver and incremental rudder control",
        summary:
          "The receiver separates two modulation tones and advances the rudder one ratchet increment per received command.",
        technicalDetails:
          "Selector 61 is tuned by four capacitors, 24'd through 24'g. A received 100-cycle tone reaches filter 166 and drives the left-rudder pawl; a 500-cycle tone reaches filter 566 and drives the right-rudder pawl. The brake band holds the rudder after a step. The grant describes discrete increments, not proportional servo control.",
        archaicTerm: "pawl",
        modernEquivalent: "a tooth-engaging lever that advances a ratchet by one step",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Synchronized selection",
        explanation:
          "The functional requirement is phase agreement between the two moving records: corresponding perforations must reach their control heads together, so the receiver follows the transmitter's selected carrier frequency.",
      },
      {
        principle: "Selective tuning",
        explanation:
          "Different capacitor capacities give oscillator 20 and selector 61 different tuned states. The record-controlled switches choose among those states; the specification says the order can be arbitrary rather than periodically recurring.",
      },
      {
        principle: "Tone selection and ratchet motion",
        explanation:
          "The two printed modulation frequencies serve as distinct command labels after detection. Separate filters, magnets, and pawls turn those labels into one-step left or right rudder movement.",
      },
    ],
    whyItMattersToday:
      "The grant is a detailed historical record of a frequency-changing radio-control proposal: matched records select tuning states, false channels can be transmitted, and short commands change a craft's rudder by discrete increments. Claims 1 through 6 define that apparatus, its laterally positioned records, movable craft control, incremental action, and transmitter-side decoy indication.",
  },
  claims: manualClaims,
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Transmitting station",
      caption:
        "Schematic diagram of oscillator 20, modulator 21, amplifier 22, antenna 23, tuning condensers 24a through 24g, and record strip 37 at the transmitting station.",
      svgType: "lamarr-frequency-hopping",
      callouts: [
        {
          id: "lf-1",
          figureRef: "Fig. 1",
          label: "37",
          element: "Record strip",
          description:
            "The strip whose perforations actuate the tuning switches as it moves over control head 39.",
          x: 40,
          y: 40,
        },
        {
          id: "lf-2",
          figureRef: "Fig. 1",
          label: "20",
          element: "Variable-frequency carrier oscillator",
          description:
            "The oscillator whose tuning condensers are selectively connected by switches 31.",
          x: 65,
          y: 35,
        },
        {
          id: "lf-3",
          figureRef: "Fig. 1",
          label: "23",
          element: "Antenna",
          description: "The printed antenna at the output of amplifier 22.",
          x: 85,
          y: 25,
        },
      ],
    },
    {
      figureNumber: "Fig. 2",
      title: "Receiving station",
      caption:
        "Schematic diagram of the receiving antenna 60, selector 61, amplifier 64, detector 65, filters, record strip 37', and incremental rudder mechanism.",
      svgType: "lamarr-frequency-hopping",
      callouts: [
        {
          id: "lf-4",
          figureRef: "Fig. 2",
          label: "61",
          element: "Signal selector",
          description:
            "The receiver tuning element controlled by condensers 24'd through 24'g and by record strip 37'.",
          x: 45,
          y: 55,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "The specification says that an enemy could discover the frequency used for remote control and then send false signals on that frequency, potentially blocking the control of a dirigible craft such as a torpedo.",
    priorArtLimitations: [
      "The inventors state that remote control of a torpedo was already old and does not broadly form part of their invention.",
      "The grant identifies discovery and imitation of the control frequency as the weakness of a fixed-frequency control arrangement.",
    ],
    breakthroughInsight:
      "The grant's stated contribution is a variable-frequency transmitting station and a correspondingly variable receiver controlled by synchronized records. In the illustrated arrangement, some transmitter frequencies intentionally do not correspond to a receiver setting and serve as false impulses.",
    patentWars: [],
    civilizationalImpact:
      "The document records a 1941 filing for a radio-control apparatus that changes tuning through synchronized record positions, permits false transmissions, and moves a craft's rudder in discrete increments. Its asserted legal scope is stated in claims 1 through 6.",
  },
  tags: [
    "Hedy Lamarr",
    "George Antheil",
    "Secret Communication System",
    "Radio Control",
    "Record-Actuated Tuning",
    "Variable Frequency",
    "Torpedo Guidance",
  ],
  stats: {
    totalClaims: 6,
    independentClaims: 2,
  },
};
