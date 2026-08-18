import { teslaTeleautomatonArchivalEdition } from "@/data/editions/teslaTeleautomatonEdition";
import type { Patent } from "@/types/patent";

function manualClaimText(number: number): string {
  const block = teslaTeleautomatonArchivalEdition.blocks.find(
    (candidate) => candidate.kind === "claim" && candidate.number === number,
  );
  if (block?.kind !== "claim") {
    throw new Error(`Tesla teleautomaton manual edition is missing claim ${number}.`);
  }
  return block.inlines.map((inline) => inline.text).join("");
}

const claimDecoders = [
  "This method claim describes remote control through disturbances carried by natural media: a distant source acts on apparatus aboard the vessel, and that apparatus controls propulsion, steering, or another onboard mechanism. It does not limit the method to one pictured receiver or one particular vehicle.",
  "This method claim frames the transmitting effect as a region of waves or disturbances. The vehicle-side devices are actuated at a distance and perform the propulsion, steering, or other controlling work; the claim therefore keeps the focus on remote operational influence.",
  "This is the electrical-wave version of the preceding remote-control method. It requires a region of electrical disturbances and devices on the vessel or vehicle that are actuated by that distant influence to control its mechanisms.",
  "This claim adds a vessel-side control circuit that is adjusted or made sensitive to disturbances of a definite character. The remote disturbances render that circuit active or inactive, linking selectivity to the vessel's propulsion and steering control.",
  "This apparatus combination places a moving vessel or vehicle and its operating mechanism with a source of electrical disturbances and a distant-actuated controlling apparatus. The claim is broad about the vessel mechanism but requires the source-to-controller remote relationship.",
  "This combination states a source, moving vehicle, vehicle mechanism, a control circuit, and means that make that circuit active or inactive through disturbances from a distance. It captures the circuit-mediated form of remote machine control.",
  "This claim includes means for starting and stopping the wave source, plus a vehicle, its propulsion and steering mechanisms, and a circuit adjusted or sensitive to the source disturbances. The switching of the source is an express element.",
  "This more detailed combination uses source start-stop means, local circuits for vehicle mechanisms, and a sensitive circuit with means that controls those local circuits. It distinguishes a receiving or control stage from the local actuator circuits.",
  "This detector claim is directed to a receptacle of particles such as oxidized metal in an electrical circuit and a mechanism that turns it end for end after a discharge. The inversion restores a repeatable detector condition for another command.",
  "This dependent-looking but separately printed claim specifies the particle receptacle, an electromagnet in the circuit, and electromagnet-controlled turning devices. The legal focus is the electrically triggered physical reset of the sensitive material.",
  "This claim gives the reset mechanism a motor and an escapement: when the electromagnet is energized, the escapement permits a half-revolution of the particle receptacle. The claimed result is a measured mechanical reset after reception.",
  "This vehicle combination joins propulsion and steering motors to contacts carried by a moving steering component. Certain steering positions interrupt propulsion, while local and control circuits make the steering motor responsive to distant electrical disturbances.",
  "This claim covers opposite-direction steering current under a remotely sensitive control circuit, together with a motor that runs in one direction and controls local circuits. It captures the coupling between steering control and a unidirectional auxiliary motor.",
] as const;

const claimInnovations = [
  ["Remote control through natural media", "Vessel-side controlling apparatus"],
  ["Region of remote disturbances", "Distance-actuated vessel controls"],
  ["Electrical-wave control", "Remote vehicle mechanism actuation"],
  ["Selective receiving circuit", "Remote circuit activation"],
  ["Electrical disturbance source", "Distant controlling apparatus"],
  ["Vehicle control circuit", "Remote active-inactive switching"],
  ["Source start-stop control", "Sensitive vehicle circuit"],
  ["Local actuator circuits", "Remote-sensitive control stage"],
  ["Particle sensitive device", "End-for-end detector reset"],
  ["Electromagnetically operated reset", "Particle receptacle detector"],
  ["Escapement-controlled reset", "Motor-driven receptacle rotation"],
  ["Rudder-position propulsion interruption", "Remote steering control"],
  ["Opposite-direction steering current", "Unidirectional auxiliary motor"],
] as const;

export const teslaTeleautomatonPatent: Patent = {
  id: "us-613809-tesla-teleautomaton",
  patentNumber: "US 613,809",
  title: "Method of and Apparatus for Controlling Mechanism of Moving Vessels or Vehicles",
  shortTitle: "Tesla Remote-Control Vessel Mechanism",
  subtitle:
    "Remote electrical disturbances, a sensitive receiver, and stepped local control circuits",
  inventors: ["Nikola Tesla"],
  inventorLocation: "New York, New York",
  grantDate: "1898-11-08",
  filingDate: "1898-07-01",
  era: "Electrification & Early Modern (1870–1920)",
  category: "telecom",
  categoryLabel: "Wireless Signaling & Remote Control",
  summary:
    "Granted on November 8, 1898, this specification describes controlling a moving vessel or vehicle from a distance without an intermediate wire or cable. Tesla sets out several ways to send electrical disturbances through natural media, then details a vessel receiver, sensitive particle device, relay, escapement, contact controller, propulsion motor, steering motor, and a command sequence that selects their local circuits.",
  heroQuote:
    "I require no intermediate wires, cables, or other form of electrical or mechanical connection with the object save the natural media in space.",
  originalPdfUrl: "/patents/pdfs/us-613809-tesla-teleautomaton.pdf",
  archivalEdition: teslaTeleautomatonArchivalEdition,
  googlePatentsUrl: "https://patents.google.com/patent/US613809A/en",
  usptoClassification:
    "Title printed on the grant: controlling mechanism of moving vessels or vehicles",
  originalTextAsset: {
    url: "/patents/transcripts/us-613809-tesla-teleautomaton-reviewed.txt",
    pageCount: 13,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-08-18",
    sourcePdfSha256: "b92da6bad46cca996f7ecc99a16a87bdd38d12b3e04a0fce11cc5f033aed849b",
  },
  originalText: `To all whom it may concern:

Be it known that I, NIKOLA TESLA, a citizen of the United States, residing at New York, in the county and State of New York, have invented certain new and useful improvements in methods of and apparatus for controlling from a distance the operation of the propelling-engines, the steering apparatus, and other mechanism carried by moving bodies or floating vessels, of which the following is a specification, reference being had to the drawings accompanying and forming part of the same.

In a broad sense, then, my invention differs from all of those systems which provide for the control of the mechanism carried by a moving object and governing its motion in that I require no intermediate wires, cables, or other form of electrical or mechanical connection with the object save the natural media in space.`,
  plainEnglishExplanation: {
    overview:
      "The source's engineering problem is reliable remote control of a moving craft without a flexible conductor. Tesla first treats transmission broadly—induction, elevated terminals with ground, currents through earth, and radiated disturbances—then explains one pictured receiver-and-controller arrangement. A received disturbance changes a sensitive particle device, a local relay and escapement step a contact cylinder, and those contacts select onboard steering, propulsion, lighting, or other local circuits.",
    coreMechanism:
      "The causal chain in the detailed embodiment is: a distant switch produces a short electrical disturbance; the vessel receiving circuit and sensitive device respond; the local relay starts an escapement-controlled mechanical action; a contact cylinder changes which relay circuit is closed; and the selected local circuit runs the steering or propulsion mechanism. The source is careful that its broader claims reach the remote-control relationship, while later claims address the particular particle detector reset and steering-contact arrangement.",
    mechanicalBreakdown: [
      {
        title: "Receiving circuit and elevated terminal",
        summary:
          "A receiver connects an elevated terminal, insulated conductor, sensitive device, and ground connection through the vessel's metal keel.",
        technicalDetails:
          "Tesla says the circuit is preferably adjusted or made sensitive to the remote waves or impulses and describes a large conducting surface supported high on a standard. The source gives no verified frequency, capacitance, or quantitative range for this pictured form.",
        archaicTerm: "receiving-circuit",
        modernEquivalent: "remote-control receiver circuit",
      },
      {
        title: "Sensitive particle device",
        summary:
          "Oxidized conducting grains in a cylinder change the local circuit state under a distant electrical disturbance.",
        technicalDetails:
          "The grant describes a metal cylinder, insulating heads, central rod, strip contact, and grains such as oxidized metal. Its reset turns the cylinder end for end so the grains again fall through the same space; the source does not identify a particular alloy or resistance value.",
        archaicTerm: "sensitive device",
        modernEquivalent: "particle-based electrical detector",
      },
      {
        title: "Escapement and contact controller",
        summary:
          "Relays, clockwork, an anchor escapement, and brushes turn a received event into a stepped local-circuit selection.",
        technicalDetails:
          "The local relay closes the circuit of another magnet, whose armature actuates an anchor escapement. The train advances a contact cylinder and then enables a controlled half-turn of the sensitive-device cylinder; the brush positions choose relay states rather than being a modern digital protocol.",
        archaicTerm: "anchor-escapement",
        modernEquivalent: "clockwork stepping mechanism",
      },
      {
        title: "Propulsion and steering mechanisms",
        summary:
          "Separate onboard motors drive a screw propeller and a worm-geared rudder, under contact and relay control.",
        technicalDetails:
          "The drawings and text name a propeller C, electromagnetic motor D, storage batteries E, steering motor F, worm, toothed wheel, sleeve, rod, and rudder. Contact plates stop propulsion or limit rudder travel at specified positions; the grant supplies no verified voltage, speed, or hull dimension.",
        archaicTerm: "propelling-engine",
        modernEquivalent: "propulsion motor",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Tuned receiving selectivity",
        formula: "receiving period = source period or a harmonic",
        explanation:
          "Tesla repeatedly says close adjustment of transmitting and receiving vibration periods improves sensitivity and rejects uncontrolled disturbances. The source gives a qualitative tuning condition, not component values for a modern resonant-frequency calculation.",
      },
      {
        principle: "Remote electrical actuation",
        formula: "distant disturbance → sensitive device → local relay → selected local circuit",
        explanation:
          "The specification uses the receiver's change of electrical condition to start local battery-powered actions. It separates the remote disturbance from the onboard energy that operates motors and other mechanisms.",
      },
      {
        principle: "Mechanical state selection",
        formula: "one relay action → escapement step → changed brush/contact condition",
        explanation:
          "The clockwork and contact cylinder provide a repeatable sequence of local circuit states. The described behavior is electromechanical sequencing, not an asserted numerical digital-state count.",
      },
    ],
    whyItMattersToday:
      "The document remains legible as an early primary source for the architecture of remote actuation: a transmitted influence is detected remotely, then local power and switching perform the physical work. Its value lies in the printed mechanisms and legal claims, not in unsupported modern performance figures or claims of direct identity with every later wireless system.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: manualClaimText(1),
      plainEnglish: claimDecoders[0],
      keyInnovations: [...claimInnovations[0]],
      legalSignificance:
        "Printed method claim; its scope is the source text in the authored edition.",
    },
    {
      number: 2,
      isIndependent: true,
      originalText: manualClaimText(2),
      plainEnglish: claimDecoders[1],
      keyInnovations: [...claimInnovations[1]],
      legalSignificance:
        "Printed method claim; its scope is the source text in the authored edition.",
    },
    {
      number: 3,
      isIndependent: true,
      originalText: manualClaimText(3),
      plainEnglish: claimDecoders[2],
      keyInnovations: [...claimInnovations[2]],
      legalSignificance:
        "Printed method claim; its scope is the source text in the authored edition.",
    },
    {
      number: 4,
      isIndependent: true,
      originalText: manualClaimText(4),
      plainEnglish: claimDecoders[3],
      keyInnovations: [...claimInnovations[3]],
      legalSignificance:
        "Printed method claim; its scope is the source text in the authored edition.",
    },
    {
      number: 5,
      isIndependent: true,
      originalText: manualClaimText(5),
      plainEnglish: claimDecoders[4],
      keyInnovations: [...claimInnovations[4]],
      legalSignificance:
        "Printed combination claim; its scope is the source text in the authored edition.",
    },
    {
      number: 6,
      isIndependent: true,
      originalText: manualClaimText(6),
      plainEnglish: claimDecoders[5],
      keyInnovations: [...claimInnovations[5]],
      legalSignificance:
        "Printed combination claim; its scope is the source text in the authored edition.",
    },
    {
      number: 7,
      isIndependent: true,
      originalText: manualClaimText(7),
      plainEnglish: claimDecoders[6],
      keyInnovations: [...claimInnovations[6]],
      legalSignificance:
        "Printed combination claim; its scope is the source text in the authored edition.",
    },
    {
      number: 8,
      isIndependent: true,
      originalText: manualClaimText(8),
      plainEnglish: claimDecoders[7],
      keyInnovations: [...claimInnovations[7]],
      legalSignificance:
        "Printed combination claim; its scope is the source text in the authored edition.",
    },
    {
      number: 9,
      isIndependent: true,
      originalText: manualClaimText(9),
      plainEnglish: claimDecoders[8],
      keyInnovations: [...claimInnovations[8]],
      legalSignificance:
        "Printed sensitive-device claim; its scope is the source text in the authored edition.",
    },
    {
      number: 10,
      isIndependent: true,
      originalText: manualClaimText(10),
      plainEnglish: claimDecoders[9],
      keyInnovations: [...claimInnovations[9]],
      legalSignificance:
        "Printed sensitive-device claim; its scope is the source text in the authored edition.",
    },
    {
      number: 11,
      isIndependent: true,
      originalText: manualClaimText(11),
      plainEnglish: claimDecoders[10],
      keyInnovations: [...claimInnovations[10]],
      legalSignificance:
        "Printed sensitive-device claim; its scope is the source text in the authored edition.",
    },
    {
      number: 12,
      isIndependent: true,
      originalText: manualClaimText(12),
      plainEnglish: claimDecoders[11],
      keyInnovations: [...claimInnovations[11]],
      legalSignificance:
        "Printed vehicle-control claim; its scope is the source text in the authored edition.",
    },
    {
      number: 13,
      isIndependent: true,
      originalText: manualClaimText(13),
      plainEnglish: claimDecoders[12],
      keyInnovations: [...claimInnovations[12]],
      legalSignificance:
        "Printed vehicle-control claim; its scope is the source text in the authored edition.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Plan of vessel and mechanism",
      caption:
        "The first drawing sheet labels Fig. 1 as a plan view of a vessel and mechanism within it.",
      svgType: "tesla-teleautomaton",
      callouts: [
        {
          id: "tta-fig1-a",
          figureRef: "Fig. 1",
          label: "A",
          element: "Vessel or vehicle",
          description:
            "The specification identifies A as the vessel or vehicle capable of propulsion and direction.",
          x: 50,
          y: 50,
        },
      ],
    },
    {
      figureNumber: "Fig. 2",
      title: "Longitudinal section",
      caption:
        "The second drawing sheet labels Fig. 2 as a longitudinal section showing interior mechanism in side elevation.",
      svgType: "tesla-teleautomaton",
      callouts: [],
    },
    {
      figureNumber: "Fig. 3",
      title: "Plan and circuit connections",
      caption:
        "The third drawing sheet labels Fig. 3 as a partially diagrammatic plan of vessel, apparatus, and circuit connections.",
      svgType: "tesla-teleautomaton",
      callouts: [],
    },
    {
      figureNumber: "Fig. 4–8",
      title: "Controlling mechanism and sensitive device details",
      caption:
        "The fourth drawing sheet contains the numbered enlarged mechanism and sensitive-device detail figures specified in the source.",
      svgType: "tesla-teleautomaton",
      callouts: [],
    },
    {
      figureNumber: "Fig. 9–10",
      title: "Preferred system and enlarged mechanisms",
      caption:
        "The fifth drawing sheet contains the system diagram and enlarged mechanism view named in the specification.",
      svgType: "tesla-teleautomaton",
      callouts: [],
    },
  ],
  historicalContext: {
    problemStatement:
      "Tesla states that conductor-governed vessel control is limited by the conductor's length, weight, strength, speed and turning constraints, and the practical fixity of the controlling point.",
    priorArtLimitations: [
      "The specification identifies flexible-conductor control as the prior system that imposed the stated physical and operational limitations.",
      "Tesla says the receiving apparatus should be protected from disturbances not under the operator's control through careful adjustment and selectivity.",
    ],
    breakthroughInsight:
      "The printed insight is to dispense with an artificial intermediate connection and let a distant electrical influence activate apparatus aboard the moving body, where local circuits perform the work.",
    patentWars: [],
    civilizationalImpact:
      "The grant records a specific historical approach to wireless remote actuation—receiver, local power, relays, stepped contacts, and mechanical reset—without treating the patent as proof of a later product's exact technical lineage.",
    funFact:
      "The printed drawings occupy five sheets (Figures 1 through 10), followed by eight pages of specification and claims.",
    aftermath:
      "The specification itself lists possible life, despatch, pilot, delivery, exploration, animal-capture, scientific, engineering, commercial, and military uses; this record does not add unsupported demonstration or procurement narratives.",
    sideNotes: [
      "The grant prints the application date July 1, 1898, Serial No. 684,934, and “(No model.)”.",
      "The printed witnesses are Raphaël Netter and George Scherff.",
    ],
  },
  tags: [
    "Nikola Tesla",
    "Remote Control",
    "Electrical Waves",
    "Sensitive Device",
    "Electromechanical Control",
  ],
  stats: { totalClaims: 13, independentClaims: 13 },
};
