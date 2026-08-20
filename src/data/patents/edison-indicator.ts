import type { Patent } from "@/types/patent";
import {
  edisonIndicatorArchivalEdition,
  edisonIndicatorClaimText,
} from "../editions/edisonIndicatorEdition";

const edisonIndicatorFigureCallouts: Record<
  string,
  Array<{
    id: string;
    figureRef: string;
    label: string;
    element: string;
    description: string;
    x: number;
    y: number;
  }>
> = {
  "Fig. 1": [
    {
      id: "edison-ind-mains",
      figureRef: "Fig. 1",
      label: "Mains 1, 2",
      element: "1, 2",
      description: "Direct-current multiple-arc distribution conductors.",
      x: 20,
      y: 15,
    },
    {
      id: "edison-ind-lamp-a",
      figureRef: "Fig. 1",
      label: "Lamp A",
      element: "A",
      description: "Indicator incandescent lamp enclosing vacuum space.",
      x: 48,
      y: 45,
    },
    {
      id: "edison-ind-plate-b",
      figureRef: "Fig. 1",
      label: "Plate b",
      element: "b",
      description: "Independent platinum collecting electrode in vacuum.",
      x: 52,
      y: 42,
    },
    {
      id: "edison-ind-galv-b",
      figureRef: "Fig. 1",
      label: "Galvanometer B",
      element: "B",
      description: "Torsion galvanometer measuring vacuum current.",
      x: 75,
      y: 65,
    },
  ],
  "Fig. 2": [
    {
      id: "edison-ind-aux-lamp",
      figureRef: "Fig. 2",
      label: "Auxiliary Lamp A'",
      element: "A'",
      description: "Reference comparison lamp for calibration shunt.",
      x: 50,
      y: 35,
    },
    {
      id: "edison-ind-resistor-c",
      figureRef: "Fig. 2",
      label: "Resistor C",
      element: "C",
      description: "Adjustable rheostat balancing bridge sensitivity.",
      x: 70,
      y: 55,
    },
  ],
  "Fig. 3": [
    {
      id: "edison-ind-needle-e",
      figureRef: "Fig. 3",
      label: "Needle e",
      element: "e",
      description: "Deflecting galvanometer pointer indicator.",
      x: 50,
      y: 50,
    },
    {
      id: "edison-ind-relay-arm-o",
      figureRef: "Fig. 3",
      label: "Contact Arm o",
      element: "o",
      description: "Lightweight contact closing circuit on deviation.",
      x: 65,
      y: 40,
    },
  ],
  "Fig. 4": [
    {
      id: "edison-ind-filament-c",
      figureRef: "Fig. 4",
      label: "Filament c",
      element: "c",
      description: "Horseshoe carbon filament incandescing under line voltage.",
      x: 45,
      y: 38,
    },
    {
      id: "edison-ind-plate-b4",
      figureRef: "Fig. 4",
      label: "Platinum Plate b",
      element: "b",
      description: "Platinum foil interposed between filament legs.",
      x: 55,
      y: 42,
    },
  ],
};

export const edisonIndicatorPatent: Patent = {
  id: "us-307031-edison-indicator",
  patentNumber: "US 307,031",
  title: "Electrical Indicator",
  shortTitle: "Edison Effect Thermionic Diode Indicator",
  subtitle: "Vacuum Thermionic Emission, Space-Charge Conduction, and Voltage Regulation",
  inventors: ["Thomas A. Edison"],
  inventorLocation: "Menlo Park, New Jersey",
  grantDate: "1884-10-21",
  filingDate: "1883-11-15",
  era: "Electrification & Early Modern (1870–1920)",
  category: "electricity",
  categoryLabel: "Electrification & Vacuum Electronics",
  summary:
    "The landmark foundational patent disclosing the 'Edison Effect'—the physical phenomenon of thermionic electron emission across a vacuum gap. Edison discovered that an incandescing carbon filament in an evacuated bulb emits a unidirectional electric current across empty space to an independent cold platinum plate when biased positively relative to the filament. Edison harnessed this sensitive vacuum current to construct high-precision station voltmeters and automated dynamo-field regulators, directly creating the physical and technological precursor to the Fleming diode, De Forest triode, and 20th-century electronics.",
  heroQuote:
    "I have discovered that if a conducting substance is interposed anywhere in the vacuous space within the globe of an incandescent electric lamp, and said conducting substance is connected outside of the lamp with one terminal, preferably the positive one, of the incandescent conductor, a portion of the current will, when the lamp is in operation, pass through the shunt-circuit thus formed, which shunt includes a portion of the vacuous space within the lamp.",
  originalPdfUrl: "/patents/pdfs/us-307031-edison-indicator.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US307031A/en",
  usptoClassification: "H01J 1/02, G01R 19/00, H01K 1/02",
  originalTextAsset: {
    url: "/patents/transcripts/us-307031-edison-indicator-reviewed.txt",
    pageCount: 3,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents Editorial Team",
    reviewedAt: "2026-08-19",
    sourcePdfSha256: "f36bc6aa879d42a3f495a9bda05871bb6181aa1979e6baa03b258c42d6a30c13",
  },
  archivalEdition: edisonIndicatorArchivalEdition,
  originalText:
    "Be it known that I, THOMAS A. EDISON, of Menlo Park, in the county of Middlesex and State of New Jersey, have invented a new and useful Improvement in Electrical Indicators, of which the following is a specification.\n\nI have discovered that if a conducting substance is interposed anywhere in the vacuous space within the globe of an incandescent electric lamp, and said conducting substance is connected outside of the lamp with one terminal, preferably the positive one, of the incandescent conductor, a portion of the current will, when the lamp is in operation, pass through the shunt-circuit thus formed, which shunt includes a portion of the vacuous space within the lamp. The current I find to be proportional to the degree of incandescence of the conductor or candle-power of the lamp.\n\nUtilizing this discovery, I have devised an indicator for showing the degree of incandescence of incandescent electric lamps, and therefore the variations in the electromotive force in the circuits in which they are placed, which indicator is not subject to the variations to which the indicators heretofore in use are subject...",
  plainEnglishExplanation: {
    overview:
      "In 1883, while investigating why the interior glass of his incandescent lightbulbs turned black over time, Thomas Edison inserted an independent platinum foil plate into the evacuated glass bulb between the legs of the horseshoe carbon filament. He discovered an astonishing phenomenon: when the platinum plate was connected externally to the positive leg of the incandescent filament, a steady direct current flowed across the empty vacuum from the filament to the plate. When connected to the negative leg, zero current flowed. This unilateral conduction across empty space—the 'Edison Effect'—was the very first recorded observation of thermionic electron emission in human history. Edison recognized that the magnitude of this vacuum current was exquisitely sensitive to filament temperature, and therefore to line voltage. He immediately patented this discovery to build sensitive grid voltmeters and automated dynamo regulators, creating the direct physical ancestor of the vacuum tube.",
    coreMechanism:
      "When line voltage ($V_{\\text{line}}$) energizes the carbon filament, Joule heating ($P = I^2 R$) raises its temperature to ~1950 K. High thermal kinetic energy excites electrons in the carbon lattice past their work function (Richardson-Dushman thermionic emission). These liberated electrons form a space-charge cloud in the high vacuum ($10^{-5}$ Torr). The cold platinum plate ($b$), biased at the positive filament terminal potential ($+V_{\\text{line}}$), establishes an electrostatic acceleration field across the vacuum gap ($d$). Electrons stream across the vacuum to the plate (Child-Langmuir space-charge law), generating a measurable shunt current ($I_{\\text{shunt}} \\approx 0.1\\text{--}4.0\\text{ mA}$) that deflects a sensitive series galvanometer needle ($B$). Because thermionic emission scales exponentially with cathode temperature ($T$), a minute 1% variation in line voltage produces a massive 15% to 25% change in vacuum shunt current, providing unprecedented detection sensitivity.",
    mechanicalBreakdown: [
      {
        title: "Evacuated Indicator Bulb & Platinum Anode",
        summary:
          "A high-vacuum glass globe containing an incandescing carbon filament and an isolated platinum collector plate.",
        technicalDetails:
          "Bulb $A$ is evacuated to high vacuum. Platinum plate $b$ is supported on a dedicated platinum lead-in wire hermetically sealed into the glass stem, positioned symmetrically between the filament legs to maximize electron capture cross-section ($A_{\\text{anode}}$).",
        archaicTerm: "conducting substance in the vacuous space",
        modernEquivalent: "isolated thermionic anode plate",
      },
      {
        title: "Unilateral Vacuum Shunt Circuit",
        summary:
          "An external circuit connecting the platinum anode through a galvanometer to the positive leg of the filament.",
        technicalDetails:
          "Conductor 3 connects plate $b$ to the positive leg (terminal 5). Negative electrons emitted by cathode leg 4 are electrostatically attracted to positive plate $b$, completing the circuit exclusively through the vacuum gap.",
        archaicTerm: "shunt-circuit including vacuous space",
        modernEquivalent: "diode anode-cathode vacuum circuit",
      },
      {
        title: "Torsion Galvanometer Indicator",
        summary:
          "A high-precision moving-coil or needle galvanometer indicating minute vacuum current changes on a calibrated dial.",
        technicalDetails:
          "Galvanometer $B$ has high internal resistance ($R_g \\approx 500\\ \\Omega$) and fine torsional suspension. Needle $e$ deflects across calibrated scale $n$, where center represents nominal 110 V line pressure.",
        archaicTerm: "galvanometer or other current-indicator",
        modernEquivalent: "precision analog microammeter / voltmeter",
      },
      {
        title: "Automated Dynamo-Field Relay Contacts",
        summary:
          "Electrical contacts actuated by the galvanometer needle to automatically adjust generator field rheostats.",
        technicalDetails:
          "Needle $e$ carries a lightweight contact arm $o$ that moves between high and low contacts $p$. Deviations in line pressure energize electromechanical solenoids (Patent No. 287,524) that physically rotate the generator field rheostat, automatically restoring distribution line voltage to equilibrium.",
        archaicTerm: "circuit-controlling arm and contacts",
        modernEquivalent: "closed-loop electromechanical voltage regulator",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Richardson-Dushman Thermionic Emission Law",
        explanation:
          "Governs the thermal emission current density $J$ from a hot cathode into a vacuum as an exponential function of surface temperature and material work function.",
        formula: "J = A T^2 e^{-\\frac{\\Phi}{k_B T}}",
      },
      {
        principle: "Child-Langmuir Space-Charge Law",
        explanation:
          "Defines the maximum vacuum current density between planar electrodes when limited by the electrostatic repulsion of the inter-electrode electron cloud.",
        formula: "J = \\frac{4\\varepsilon_0}{9} \\sqrt{\\frac{2e}{m_e}} \\frac{V_a^{3/2}}{d^2}",
      },
      {
        principle: "Filament Thermal-Radiation Equilibrium & Line Voltage",
        explanation:
          "Relates the electrical Joule heating input power to Stefan-Boltzmann radiation losses, linking line voltage to the resulting absolute cathode temperature.",
        formula:
          "P = \\frac{V_{\\text{line}}^2}{R(T)} = \\varepsilon \\sigma A_{\\text{surf}} (T^4 - T_0^4)",
      },
      {
        principle: "Torsional Galvanometer Torque Balance",
        explanation:
          "Equates the electromagnetic deflecting torque produced by thermionic coil current to the elastic restoring torque of the calibrated torsion wire.",
        formula:
          "\\tau_{\\text{net}} = N I_{\\text{shunt}} A_{\\text{coil}} B - \\kappa \\theta = 0",
      },
    ],
    whyItMattersToday:
      "US 307,031 is the foundational origin patent for thermionic vacuum emission—the physical phenomenon underlying the entire 20th-century vacuum tube and electronics era. Edison demonstrated that electricity could traverse an absolute vacuum gap without physical contact, moving exclusively from the hot negative cathode to the cold positive anode, creating the first operational vacuum diode two decades before John Ambrose Fleming patented the Fleming valve (1904) for radio frequency detection.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: edisonIndicatorClaimText(1),
      plainEnglish:
        "The broad foundational combination of an evacuated incandescent electric bulb, an electric circuit routed through the interior vacuum space of the bulb, and electrical apparatus operated or controlled by the vacuum current.",
      keyInnovations: [
        "Conduction through evacuated space",
        "Vacuum shunt circuit",
        "Current-controlled electrical indicator",
      ],
      legalSignificance:
        "The master claim establishing patent rights over conducting electrical current through a vacuum gap to control external instruments.",
    },
    {
      number: 2,
      isIndependent: true,
      originalText: edisonIndicatorClaimText(2),
      plainEnglish:
        "The combination with an electric power distribution network of an indicator or regulator comprising a standard vacuum bulb with an internal vacuum-spanning circuit and controlling apparatus driven by that current.",
      keyInnovations: [
        "Power distribution line monitor",
        "Standardized vacuum indicator bulb",
        "Automatic voltage regulation",
      ],
      legalSignificance:
        "Covers central-station grid voltage monitoring and closed-loop regulation using thermionic vacuum conduction.",
    },
    {
      number: 3,
      isIndependent: true,
      originalText: edisonIndicatorClaimText(3),
      plainEnglish:
        "An incandescent lamp circuit where one terminal is located inside the vacuum space of the bulb and the other terminal connects externally to one side of the filament circuit.",
      keyInnovations: [
        "Internal vacuum terminal electrode",
        "External unilateral shunt connection",
      ],
      legalSignificance:
        "Defines the fundamental structural geometry of a vacuum diode electrode configuration.",
    },
    {
      number: 4,
      isIndependent: true,
      originalText: edisonIndicatorClaimText(4),
      plainEnglish:
        "An incandescent lamp circuit where one terminal is inside the vacuum space and the other connects externally to the positive leg of the lamp supply circuit.",
      keyInnovations: [
        "Positive-bias vacuum circuit connection",
        "Unidirectional thermionic electron collection",
      ],
      legalSignificance:
        "Specifically claims the positive anode bias essential for collecting negative thermionic electrons across the vacuum gap.",
    },
    {
      number: 5,
      isIndependent: true,
      originalText: edisonIndicatorClaimText(5),
      plainEnglish:
        "The combination of the vacuum-spanning circuit connected to one side of the lamp circuit with electrically operated or controlled apparatus placed in series with the vacuum circuit.",
      keyInnovations: [
        "Series-connected vacuum control apparatus",
        "Direct vacuum-current actuation",
      ],
      legalSignificance:
        "Covers connecting galvanometers, relays, or actuators directly in series with the thermionic vacuum conduction path.",
    },
    {
      number: 6,
      isIndependent: true,
      originalText: edisonIndicatorClaimText(6),
      plainEnglish:
        "An incandescent lamp having an independent piece of conducting material placed within the vacuum space, with a connecting conductor passing through and hermetically sealed into the glass bulb.",
      keyInnovations: ["Third sealed lead-in wire", "Isolated internal vacuum conductor"],
      legalSignificance:
        "The physical structural claim covering three-lead vacuum tubes with isolated internal cold anodes.",
    },
    {
      number: 7,
      isIndependent: true,
      originalText: edisonIndicatorClaimText(7),
      plainEnglish:
        "In a parallel multiple-arc distribution system, connecting an indicator lamp with an internal vacuum circuit and electrical apparatus across the mains in parallel with the lighting load.",
      keyInnovations: ["Multiple-arc parallel integration", "Stationary line-voltage sensor"],
      legalSignificance:
        "Protects the system architecture of parallel grid monitoring using thermionic indicator cells.",
    },
    {
      number: 8,
      isIndependent: true,
      originalText: edisonIndicatorClaimText(8),
      plainEnglish:
        "An incandescent lamp where the internal conducting material is specifically positioned between the two limbs of the incandescent carbon filament loop with an external lead.",
      keyInnovations: [
        "Inter-filament electrode geometry",
        "Symmetrical space-charge interception",
      ],
      legalSignificance:
        "Covers the physical placement of the collector anode between the horseshoe filament legs for maximum electron capture.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "System diagram with indicator lamp and galvanometer",
      caption:
        "System diagram showing multiple-arc lighting distribution mains (1, 2), incandescent lamps (a), indicator lamp (A) with platinum plate (b), and torsion galvanometer (B) with scale (n).",
      svgType: "edison-indicator",
      callouts: edisonIndicatorFigureCallouts["Fig. 1"],
    },
    {
      figureNumber: "Fig. 2",
      title: "Calibration circuit with reference lamp",
      caption:
        "Modified circuit diagram showing auxiliary reference calibration lamp (A') connected in shunt around operating indicator lamp (A) with adjustable resistor (C).",
      svgType: "edison-indicator",
      callouts: edisonIndicatorFigureCallouts["Fig. 2"],
    },
    {
      figureNumber: "Fig. 3",
      title: "Galvanometer contact mechanism",
      caption:
        "Detail view of galvanometer needle carrying articulated relay arm (o) closing circuit at bilateral contacts (p) to drive automated generator field regulation magnets.",
      svgType: "edison-indicator",
      callouts: edisonIndicatorFigureCallouts["Fig. 3"],
    },
    {
      figureNumber: "Fig. 4",
      title: "Indicating lamp construction",
      caption:
        "Perspective detail view of standard indicating lamp (A), illustrating evacuated glass bulb, incandescing carbon filament loop, central platinum plate (b), and sealed terminal leads (3, 4, 5).",
      svgType: "edison-indicator",
      callouts: edisonIndicatorFigureCallouts["Fig. 4"],
    },
  ],
  historicalContext: {
    problemStatement:
      "In early direct-current central station networks (such as Pearl Street Station in New York), incandescent lamp life and illumination quality were critically sensitive to line voltage variations. A 5% voltage surge would destroy delicate carbon filaments, while a 5% drop caused dim yellow light. Standard magnetic and thermal voltmeters lacked the precision and speed needed to detect subtle distribution fluctuations across distant district feeders. Furthermore, carbon lamps suffered from mysterious internal glass blackening that Edison was determined to understand and eliminate.",
    priorArtLimitations: [
      "Existing electrical indicators relied on electromagnetic moving-iron coils or thermal expansion hot-wires.",
      "These devices suffered from high friction, slow thermal inertia, hysteresis, and poor non-linear scale resolution near nominal operating voltage.",
      "Classical physics held that a high vacuum was a total insulator through which steady direct current could not pass without destructive high-voltage spark discharge.",
    ],
    breakthroughInsight:
      "Edison discovered that heating a carbon filament in high vacuum causes it to emit negative electrical charges (electrons) into the surrounding space. By placing an independent cold platinum plate in the vacuum and connecting it to the positive filament leg, a continuous conduction path was established through the vacuum gap without touching the filament. Because this thermionic current increases exponentially with filament temperature ($T$) and line voltage ($V_{\\text{line}}$), the device acted as an extraordinary sensitive amplifier of voltage fluctuations.",
    patentWars: [
      {
        rivalName: "John Ambrose Fleming / Marconi Wireless Telegraph Co.",
        rivalClaim: "Fleming valve oscillation detector diode (1904)",
        conflictDetails:
          "In 1884, Edison demonstrated the Edison Effect lamp at Philadelphia. English physicist John Ambrose Fleming, scientific advisor to the Edison Swan Company in London, studied the phenomenon. In 1904, Fleming patented the Fleming valve in US Patent 803,684 for radio frequency rectification, acknowledging Edison's US 307,031.",
        resolution:
          "Fleming's patent was recognized as an application of the Edison Effect to high-frequency RF detection; De Forest later added the grid in US 879,532 to create the Audion triode.",
        legalOutcome:
          "Established the thermionic vacuum tube as the foundation of 20th-century wireless, telephony, and electronic computing.",
      },
    ],
    civilizationalImpact:
      "The Edison Effect patent directly birthed modern electronics. It proved that electrons could flow through a vacuum, leading directly to the Fleming diode (1904), De Forest Audion triode (1906), cathode ray tubes, radio broadcasting, television, radar, and electronic computers.",
  },
  stats: {
    totalClaims: 8,
    independentClaims: 8,
  },
  tags: [
    "edison effect",
    "thermionic emission",
    "vacuum tube",
    "diode",
    "electronics",
    "voltage regulator",
    "instrumentation",
    "physics",
    "electrification",
  ],
};
