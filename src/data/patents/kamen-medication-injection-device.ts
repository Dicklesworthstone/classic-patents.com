import { kamenMedicationInjectionArchivalEdition } from "@/data/editions/kamenMedicationInjectionEdition";
import type { Patent } from "@/types/patent";

function manualClaimText(number: number): string {
  const block = kamenMedicationInjectionArchivalEdition.blocks.find(
    (candidate) => candidate.kind === "claim" && candidate.number === number,
  );
  if (block?.kind !== "claim") throw new Error(`Kamen manual edition is missing claim ${number}.`);
  return block.inlines.map((inline) => inline.text).join("");
}

export const kamenMedicationInjectionPatent: Patent = {
  id: "us-3858581-kamen-medication-injection-device",
  patentNumber: "US 3,858,581",
  title: "Medication Injection Device",
  shortTitle: "Kamen Pulse-Counted Lead-Screw Injection Mechanism",
  subtitle: "Motor rotation, uniform-pitch lead screw, pulse counting, and timed motor intervals",
  inventors: ["Dean Kamen"],
  inventorLocation: "Rockville Centre, New York",
  grantDate: "1975-01-07",
  filingDate: "1973-07-02",
  era: "Information Age & Silicon Revolution (1960–1990)",
  category: "consumer",
  categoryLabel: "Medical Devices & Mechatronics",
  summary:
    "Kamen's 1975 grant claims a mechanically coupled motor, uniform-pitch lead screw, striker-operated pulse switch, and pulse-counting control for a syringe plunger. The claims connect a count of screw rotations to motor operation and add timers, a clutch, a visual signal, and a scale. This historical record does not establish a modern dosage, delivery-rate, pressure, or treatment protocol.",
  heroQuote: "A radially oriented striker mounted on said lead screw",
  originalPdfUrl: "/patents/pdfs/us-3858581-kamen-medication-injection-device.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US3858581A/en",
  usptoClassification: "Int. Cl. A61M 5/14; U.S. Cl. 128/218 (printed)",
  archivalEdition: kamenMedicationInjectionArchivalEdition,
  originalTextAsset: {
    url: "/patents/transcripts/us-3858581-kamen-medication-injection-device-reviewed.txt",
    pageCount: 8,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-09-01",
    sourcePdfSha256: "1aa0df879ec119a9ad4025774e482dfc41e748127bc3f83cde31047daeedc35d",
    pageAnchors: [
      {
        page: 1,
        exactSourceText: "MEDICATION INJECTION DEVICE",
        sourceRelationship: "front page identity",
      },
      {
        page: 2,
        exactSourceText: "FIG. 1 is a perspective view",
        sourceRelationship: "source figure sheet",
      },
      {
        page: 3,
        exactSourceText: "FIG. 4 is an end elevational view",
        sourceRelationship: "source figure sheet",
      },
      {
        page: 4,
        exactSourceText: "The present invention relates",
        sourceRelationship: "printed specification opening",
      },
      {
        page: 5,
        exactSourceText: "lead screw 22",
        sourceRelationship: "printed mechanical description",
      },
      {
        page: 6,
        exactSourceText: "radially oriented striker 80",
        sourceRelationship: "printed pulse description",
      },
      {
        page: 7,
        exactSourceText: "FIG. 6 illustrates",
        sourceRelationship: "printed control description",
      },
      {
        page: 8,
        exactSourceText: "What is claimed is",
        sourceRelationship: "printed claims pp. 9–10",
      },
    ],
  },
  originalText:
    "The present invention relates to improvements in a medication injection device, and more particularly to an automatic medication-injecting or administering device readily capable of dispensing medication in accordance with any selected schedule of successive intervals of operation and non-operation of a syringe-driving or powering motor.",
  plainEnglishExplanation: {
    overview:
      "The legal core is an electromechanical counting chain. A motor turns a lead screw; a nonrotating follower advances a plunger; a striker closes a switch once each screw rotation; and a pulse counter keeps the motor running for a selected count. The important engineering move is not a generic motorized syringe but using discrete rotational events to govern a linear actuator. The museum visual keeps this strictly nonclinical because the grant does not supply a safe dose, patient condition, fluid-pressure limit, or therapeutic prescription.",
    coreMechanism:
      "For an ideal uniform-pitch screw, a follower displacement can be described as $x = n p$, where $n$ is the rotation count and $p$ is the unreported thread pitch. The striker makes an electrical pulse for each rotation, so the source couples the same count to the controller. Claim 1 links that mechanical and electrical chain; Claims 2–5 add scheduling, clutch disengagement, signaling, and a scale. The source supports this causal relation, not numerical calibration for real medication delivery.",
    mechanicalBreakdown: [
      {
        title: "Motor and uniform-pitch lead screw",
        summary:
          "A motor drives lead screw 22; the threaded follower advances along the screw rather than rotating with it.",
        technicalDetails:
          "The basic kinematic reading is $x = n p$. The patent says the pitch is uniform but does not print $p$, a motor speed, backlash, friction, or a safe operating load. The exhibit therefore uses normalized screw position only.",
        archaicTerm: "rotatively mounted lead screw",
        modernEquivalent: "motor-driven screw linear actuator",
      },
      {
        title: "Follower and plunger interface",
        summary:
          "Follower 18 and head 16 translate screw motion into linear movement of syringe plunger 14.",
        technicalDetails:
          "The mechanism constrains the follower against co-rotation so a rotation of the screw produces longitudinal advance. The claim is about the relation of these parts, not an asserted flow or therapy metric.",
        archaicTerm: "pushing means",
        modernEquivalent: "traveling nut / plunger driver",
      },
      {
        title: "Striker, switch, and pulse counter",
        summary:
          "A rotating striker reaches switch 84 once per rotational traverse and supplies the event count used by the control circuit.",
        technicalDetails:
          "In the ideal source relationship $N_{pulse}=n_{turns}$. That identifies a countable motion event, but the patent does not turn it into a modern encoder accuracy or safety specification.",
        archaicTerm: "pulse-emitting switch",
        modernEquivalent: "rotation-event switch",
      },
      {
        title: "Timing and clutch additions",
        summary:
          "Dependent claims add a scheduled interval, a visual signal, and a clutch that can interrupt the motor-to-screw drive.",
        technicalDetails:
          "The source describes timer and clutch functions as circuit and coupling relationships. It gives neither a validated alarm threshold nor a medically safe timing program, so the interactive treatment presents only state topology.",
        archaicTerm: "additional timing means",
        modernEquivalent: "interval-control circuit",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Lead-screw displacement relation",
        formula: "x = n p",
        explanation:
          "Each ideal full rotation advances a uniform-pitch follower by pitch $p$. Kamen's source supplies the qualitative uniform-pitch relationship but not a numerical pitch, so $x$ remains a symbolic mechanical relation here.",
      },
      {
        principle: "Rotation-event counting",
        formula: "N_{pulse}=n_{turns}",
        explanation:
          "Claim 1 says the radially oriented striker engages the pulse-emitting switch during each rotation of the lead screw. The counter therefore receives a discrete event tied to the screw traversal.",
      },
      {
        principle: "State-sequenced actuation",
        formula: "motor\\;on \\xrightarrow{N\\;pulses} motor\\;off \\xrightarrow{timer} motor\\;on",
        explanation:
          "Claims 2 and 4 describe an interval and pulse-operated timing logic. The notation represents the claimed state sequence, not a medical schedule or a promise of a clinical result.",
      },
    ],
    whyItMattersToday:
      "The grant is a compact early example of a familiar mechatronic pattern: turn a physical actuator state into countable electrical events, then use the count to decide the next machine state. The pattern appears in many nonmedical position-controlled machines. The archive presents the historical device's mechanism while refusing to turn a 1975 document into medical guidance.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: manualClaimText(1),
      plainEnglish:
        "Claim 1 protects the complete count-governed actuator chain: syringe and plunger, uniform-pitch screw, advancing pusher, motor, rotating striker, nearby pulse switch, and counter that permits motor operation for a selected count. The legal work is in coupling the repeated screw rotation to a count that governs the actuator interval, not merely in naming any one of those familiar components.",
      keyInnovations: [
        "Uniform-pitch lead screw",
        "Radial striker",
        "Pulse-emitting switch",
        "Pulse-counting motor control",
      ],
      legalSignificance:
        "The independent claim makes the mechanical-to-electrical counting chain the legal center of the grant.",
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText: manualClaimText(2),
      plainEnglish:
        "Claim 2 keeps the complete Claim 1 mechanism and adds an additional timing means that starts the motor after a selected nonoperation interval. Its legal contribution is a repeated schedule of motor-on and motor-off states attached to the pulse-counted lead-screw mechanism, rather than an unrestricted claim to every timer used with every syringe.",
      keyInnovations: [
        "Additional timing means",
        "Successive motor intervals",
        "Scheduled restart",
      ],
      legalSignificance:
        "It narrows the core mechanism to the source-described intermittent timing arrangement.",
    },
    {
      number: 3,
      isIndependent: false,
      dependsOn: [2],
      originalText: manualClaimText(3),
      plainEnglish:
        "Claim 3 adds a clutch between the motor and lead screw plus a limited linear movement that disengages the clutch. The legal function is mechanical interruption of the drive connection under the claimed condition. It does not define a modern pressure limit, alarm logic, medical safety certification, or a complete clinical risk-control system.",
      keyInnovations: ["Interposed clutch", "Limited lead-screw movement", "Drive disengagement"],
      legalSignificance:
        "This dependent claim identifies a concrete mechanical stop path rather than relying only on electrical timing.",
    },
    {
      number: 4,
      isIndependent: false,
      dependsOn: [2],
      originalText: manualClaimText(4),
      plainEnglish:
        "Claim 4 adds a pulse-operated timing means and a visual signal that responds to pulses sent to both timer and counter. The legal addition is an indicator coupled to the same pulse traffic that drives control state, making the working condition visible without claiming every possible visual indicator or monitoring system.",
      keyInnovations: [
        "Pulse-operated timing",
        "Visual signaling device",
        "Shared pulse indication",
      ],
      legalSignificance:
        "It narrows the intermittent mechanism to an explicitly pulse-visible control arrangement.",
    },
    {
      number: 5,
      isIndependent: false,
      dependsOn: [4],
      originalText: manualClaimText(5),
      plainEnglish:
        "Claim 5 adds a scale relating plunger displacement to an ascending pulse count. Its legal function is a readable mechanical-to-count correspondence in the claimed assembly. The historical scale does not supply a current medical instruction, and this archive deliberately does not expose it as a dose-setting control.",
      keyInnovations: [
        "Plunger-displacement scale",
        "Ascending pulse count",
        "Count-to-position correspondence",
      ],
      legalSignificance:
        "It attaches a source-described calibration display to the pulse-counting mechanism.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Medication injection device perspective",
      caption:
        "Figure 1 shows the source device as an assembled object; the museum schematic does not treat it as a current clinical product.",
      svgType: "kamen-injection-device",
      callouts: [
        {
          id: "kmd-10",
          figureRef: "Fig. 1",
          label: "10",
          element: "Device",
          description: "Overall source device designation.",
          x: 50,
          y: 52,
        },
      ],
    },
    {
      figureNumber: "Fig. 3",
      title: "Longitudinal mechanical arrangement",
      caption:
        "Figure 3 identifies the motor, lead screw, follower, plunger-driving head, and coupling arrangement.",
      svgType: "kamen-injection-device",
      callouts: [
        {
          id: "kmd-22",
          figureRef: "Fig. 3",
          label: "22",
          element: "Lead screw",
          description: "Uniform-pitch screw named in Claim 1.",
          x: 49,
          y: 51,
        },
        {
          id: "kmd-24",
          figureRef: "Fig. 3",
          label: "24",
          element: "Motor",
          description: "Motor powering lead-screw rotation.",
          x: 25,
          y: 50,
        },
      ],
    },
    {
      figureNumber: "Fig. 4",
      title: "Pulse generator section",
      caption:
        "Figure 4 depicts the radial striker and switch relationship that creates a pulse during each rotational traverse.",
      svgType: "kamen-injection-device",
      callouts: [
        {
          id: "kmd-80",
          figureRef: "Fig. 4",
          label: "80",
          element: "Striker",
          description: "Radially oriented member associated with lead-screw rotation.",
          x: 51,
          y: 45,
        },
        {
          id: "kmd-84",
          figureRef: "Fig. 4",
          label: "84",
          element: "Switch",
          description: "Pulse-emitting switch named in Claim 1.",
          x: 70,
          y: 50,
        },
      ],
    },
    {
      figureNumber: "Fig. 6",
      title: "Electrical control components",
      caption:
        "Figure 6 is the source block diagram of the pulse counters, motor-on and motor-off timing relationships.",
      svgType: "kamen-injection-device",
      callouts: [
        {
          id: "kmd-114",
          figureRef: "Fig. 6",
          label: "114",
          element: "First pulse counter",
          description: "Source pulse-counting circuit component.",
          x: 42,
          y: 54,
        },
        {
          id: "kmd-116",
          figureRef: "Fig. 6",
          label: "116",
          element: "Second pulse counter",
          description: "Second count stage shown in the source circuit.",
          x: 55,
          y: 54,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "The source describes an attempt to make a motor-driven plunger stroke depend on repeated physical rotation events rather than relying on elapsed motor time alone, which can vary with the driving situation described in the specification.",
    priorArtLimitations: [
      "The specification says a prior motor could deliver different amounts when viscosity differed.",
      "It identifies wear and changing frictional resistance as factors that could affect a time-based prior device.",
      "The source describes manual time-based control as inadequate for the repeated on/off behavior it sought.",
    ],
    breakthroughInsight:
      "Use one mechanical rotation of a uniform-pitch lead screw as a countable event, then let a pulse counter and timers control the motor state. This joins a linear actuator, a rotation switch, and old electronic counting logic into one claimed chain.",
    patentWars: [],
    civilizationalImpact:
      "The historical significance lies in the combined actuator-and-event-count architecture. It shows an early compact mechatronic approach to linking physical motion with discrete control logic, while the document alone cannot establish the safety or suitability of a present-day medical device.",
    aftermath:
      "Google Patents records a 1983 assignment from Auto Syringe, Inc. to Baxter Travenol Laboratories, Inc. The public record establishes an ownership transaction; it does not make this archival entry a recommendation of any medical product or use.",
    sideNotes: [
      "The front page prints five claims and six drawing figures.",
      "The reviewed source face retains the historical language; the interactive visual deliberately omits any dose, volume, flow, or therapy setting.",
    ],
  },
  tags: ["Dean Kamen", "Lead screw", "Pulse counter", "Mechatronics", "Medical-device history"],
  stats: { totalClaims: 5, independentClaims: 1 },
};
