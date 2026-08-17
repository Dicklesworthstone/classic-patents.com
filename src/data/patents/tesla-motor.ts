import type { Patent } from "@/types/patent";

export const teslaMotorPatent: Patent = {
  id: "us-381968-tesla-motor",
  patentNumber: "US 381,968",
  title: "Electro-Magnetic Motor",
  shortTitle: "Tesla AC Induction Motor",
  subtitle: "Polyphase Alternating Current Rotating Magnetic Field Induction Motor",
  inventors: ["Nikola Tesla"],
  inventorLocation: "New York, N.Y.",
  grantDate: "1888-05-01",
  filingDate: "1887-10-12",
  era: "Electrification Era (1880–1895)",
  category: "electricity",
  categoryLabel: "Electrical Power & Magnetics",
  summary:
    "The crown jewel of the Second Industrial Revolution. Nikola Tesla discovered that two or more alternating currents out of phase with each other could generate a continuously rotating magnetic field in the stator. This induced electromagnetic currents in a brushless rotor, causing it to spin without any physical electrical connection, brushes, or commutators. This patent made modern AC power generation and distribution possible.",
  heroQuote:
    "Be it known that I, Nikola Tesla, from Smiljan, Lika, border country of Austria-Hungary, residing at New York, in the county and State of New York, have invented certain new and useful Improvements in Electro-Magnetic Motors...",
  originalPdfUrl:
    "https://patentimages.storage.googleapis.com/0f/c6/3e/2a8a479d2bf941/US381968.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US381968A/en",
  usptoClassification: "H02K 17/00 (Asynchronous induction motors)",
  originalText: `UNITED STATES PATENT OFFICE.
NIKOLA TESLA, OF NEW YORK, N.Y.

ELECTRO-MAGNETIC MOTOR.

SPECIFICATION forming part of Letters Patent No. 381,968, dated May 1, 1888.
Application filed October 12, 1887. Serial No. 252,132.

To all whom it may concern:
Be it known that I, NIKOLA TESLA, from Smiljan, Lika, border country of Austria-Hungary, residing at New York, in the county and State of New York, have invented certain new and useful Improvements in Electro-Magnetic Motors, of which the following is a specification.

The practical solution of the problem of the electrical transmission of power requires that we should be able to utilize distributed alternating currents; and the primary object of my present invention is to provide a motor which will be operated by alternating currents, and which will develop mechanical power without the necessity of using commutators or collecting-rings on the moving element.

I have discovered that if a magnetic core or armature be surrounded by two or more sets of energizing-coils, and these coils be traversed by alternating currents of different phases, the magnetic poles produced in the core will continuously shift or rotate in space...`,
  plainEnglishExplanation: {
    overview:
      "In the 1880s, direct current (DC) motors invented by Thomas Edison and others suffered from a critical limitation: they required mechanical carbon brushes rubbing violently against a spinning split-ring commutator to constantly reverse the current. These brushes sparked, overheated, wore down rapidly, and could not operate at high voltages or power levels. Tesla invented an electric motor with no physical contacts, no brushes, and no commutator—powered entirely by contactless electromagnetic induction.",
    coreMechanism:
      "Tesla fed two alternating currents with a $90^\\circ$ phase difference (or three currents $120^\\circ$ apart) into orthogonal stator coils surrounding an iron rotor. As the currents oscillated sinusoidally ($I_A = I_0 \\cos(\\omega t)$, $I_B = I_0 \\sin(\\omega t)$), their magnetic fields added vectorially to produce a magnetic field of constant magnitude that smoothly rotated around the circumference of the motor. This rotating field swept across the rotor conductors, inducing eddy currents that created an opposing magnetic field (Lenz's Law), forcing the rotor to spin in pursuit of the rotating stator field.",
    mechanicalBreakdown: [
      {
        title: "Stationary Polyphase Stator Coils",
        summary:
          "Two or more pairs of independent wire coils wrapped around a laminated iron ring.",
        technicalDetails:
          "Coil pair A and Coil pair B are placed at right angles ($90^\\circ$ mechanical separation). When supplied with quadrature two-phase AC currents, the magnetic field vector $\\vec{B}(t) = B_0 \\cos(\\omega t)\\hat{i} + B_0 \\sin(\\omega t)\\hat{j}$ maintains a constant magnitude $|\\vec{B}| = B_0$ while rotating with angular velocity $\\omega = 2\\pi f$.",
        archaicTerm: "Energizing-coils traversed by alternating currents of different phases",
        modernEquivalent: "Polyphase AC stator windings",
      },
      {
        title: "Contactless Closed-Circuit Rotor",
        summary:
          "A solid iron cylinder or copper-barred armature with zero external electrical connections.",
        technicalDetails:
          "As the stator's magnetic field rotates at synchronous speed $n_s = 120 f / P$, it cuts through the stationary rotor bars, inducing an electromotive force (EMF) $\\mathcal{E} = -d\\Phi_B / dt$. The resulting induced rotor currents produce a secondary magnetic field that locks with the stator field, generating continuous mechanical torque $\\tau = k \\cdot B_{stator} \\cdot I_{rotor} \\cdot \\sin(\\theta)$.",
        archaicTerm: "Armature closed upon itself",
        modernEquivalent: "Squirrel-cage induction rotor",
      },
      {
        title: "Elimination of Commutators & Brushes",
        summary: "Zero sliding contacts, zero sparking, and zero brush wear.",
        technicalDetails:
          "Because power is transferred into the moving rotor solely via electromagnetic flux through the air gap, the motor can run submerged, in explosive chemical environments, or at high industrial voltages without mechanical degradation.",
        archaicTerm: "Without commutators or collecting-rings",
        modernEquivalent: "Brushless induction machine",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Rotating Magnetic Field Vector Sum",
        formula:
          "\\vec{B}_{net}(t) = B_0 [\\cos(\\omega t)\\hat{i} + \\sin(\\omega t)\\hat{j}] \\implies |\\vec{B}_{net}| = B_0",
        explanation:
          "Two orthogonal coils driven by sinusoidal currents in quadrature phase produce a magnetic field vector of constant magnitude rotating at angular velocity \\omega.",
      },
      {
        principle: "Faraday-Lenz Induction & Rotor Slip",
        formula:
          "s = \\frac{n_s - n_r}{n_s}, \\quad \\mathcal{E}_{rotor} = s \\cdot \\mathcal{E}_0",
        explanation:
          "The rotor must spin slightly slower than the synchronous magnetic field (rotor slip s) in order for the stator field to cut the rotor bars and sustain the induced current that generates torque.",
      },
    ],
    whyItMattersToday:
      "Tesla's polyphase AC motor is the true workhorse of modern civilization. Over 60% of all electrical energy generated on Earth is consumed by electric motors based on Tesla's rotating magnetic field principles—powering factory automation, water pumps, HVAC compressors, subway trains, and electric vehicles like Tesla and modern EV drivetrains.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "The method which consists in producing a progressively shifting or rotating magnetic field by causing alternating currents of different phases to pass through independent energizing-circuits, and utilizing said field to produce the rotation of an armature, substantially as described.",
      plainEnglish:
        "Protects the fundamental method of using multiple alternating currents of different phases to generate a rotating magnetic field and using that field to drive a motor.",
      keyInnovations: [
        "Rotating magnetic field",
        "Polyphase alternating current",
        "Induction rotation",
      ],
      legalSignificance:
        "The core master claim for polyphase electrical power. Westinghouse paid Tesla and his backers $60,000 in cash, stock, and royalties to acquire this patent, enabling AC to defeat DC in the War of the Currents.",
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "The combination, with an armature, of a magnetic core having two or more sets of energizing-coils, and an alternating-current generator having corresponding independent circuits connected with said coils...",
      plainEnglish:
        "Specifies the complete electro-mechanical system coupling a polyphase AC generator to the polyphase induction motor.",
      keyInnovations: ["End-to-end AC power transmission", "Multi-circuit generator-motor pair"],
      legalSignificance:
        "Secured the entire architecture of AC power generation, transmission lines, and motor utilization.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Diagrammatic View of Generator and Motor System",
      caption:
        "Schematic view showing the two-phase AC generator on the left and the four-pole induction motor stator on the right.",
      svgType: "tesla-motor",
      callouts: [
        {
          id: "tm-1",
          figureRef: "Fig. 1",
          label: "A",
          element: "Generator Armature",
          description:
            "Two-phase AC alternator generating two sinusoidal currents 90 degrees out of phase.",
          x: 22,
          y: 50,
        },
        {
          id: "tm-2",
          figureRef: "Fig. 1",
          label: "C",
          element: "Stator Ring",
          description: "Laminated iron stator core holding the independent sets of field coils.",
          x: 75,
          y: 50,
        },
        {
          id: "tm-3",
          figureRef: "Fig. 1",
          label: "D",
          element: "Rotor Disk",
          description:
            "Iron/copper armature mounted on the drive shaft with no electrical connections.",
          x: 75,
          y: 50,
        },
        {
          id: "tm-4",
          figureRef: "Fig. 1",
          label: "L1, L2",
          element: "Transmission Lines",
          description:
            "Four transmission wires carrying the two independent alternating current phases.",
          x: 48,
          y: 45,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "In 1887, Thomas Edison's DC power systems were limited to a transmission radius of roughly one mile due to $I^2 R$ heat losses in copper cables. Alternating current could be stepped up to high voltages for long-distance transmission via transformers, but AC was commercially useless for industrial factories because there was no practical motor that could run on AC.",
    priorArtLimitations: [
      "Direct current motors required mechanical commutators and carbon brushes that sparked violently and burned out under heavy loads.",
      "Single-phase AC motors could not start from a standstill (zero starting torque) without manual hand-spinning.",
      "Synchronous AC motors required separate DC excitation and ran at strictly fixed speeds.",
    ],
    breakthroughInsight:
      "While walking in a park in Budapest in February 1882 reciting Goethe's Faust, Tesla had a sudden flash of insight: instead of mechanically reversing the magnetic poles of a rotor with spinning brushes, one could use out-of-phase AC currents to make the stator's magnetic field rotate electronically.",
    patentWars: [
      {
        rivalName: "Thomas Alva Edison & General Electric",
        rivalClaim:
          "Edison waged the 'War of the Currents', launching a massive public campaign claiming AC was inherently lethal, electrocuting animals and promoting the electric chair to frighten the public.",
        conflictDetails:
          "George Westinghouse backed Tesla's patents and won the contracts to illuminate the 1893 Chicago World's Fair and build the monumental 1895 Niagara Falls hydroelectric power plant using Tesla's polyphase system.",
        resolution:
          "Tesla's induction motor proved so vastly superior and economical that General Electric was forced to abandon pure DC and license Tesla's polyphase AC patents.",
        legalOutcome:
          "Upheld as a seminal pioneer patent across dozens of federal court challenges, establishing the universal global standard for 3-phase AC power transmission at 50/60 Hz.",
      },
    ],
    civilizationalImpact:
      "Tesla's patent unlocked long-distance high-voltage electrical transmission from distant hydroelectric dams and power stations directly to factories and cities, electrifying the 20th century.",
    funFact:
      "Tesla demonstrated his rotating magnetic field at the 1893 Chicago World's Columbian Exposition using his famous 'Egg of Columbus'—a copper egg that spun on its tip atop a wooden table powered by a hidden rotating magnetic stator underneath!",
  },
  tags: [
    "Electricity",
    "Nikola Tesla",
    "AC Motor",
    "Electromagnetism",
    "Induction",
    "War of Currents",
  ],
  stats: {
    totalClaims: 9,
    independentClaims: 2,
    patentWarYears: "1888–1896",
    impactScore: 100,
  },
};
