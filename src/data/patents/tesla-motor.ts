import type { Patent } from "@/types/patent";

export const teslaMotorPatent: Patent = {
  id: "us-381968-tesla-motor",
  patentNumber: "US 381,968",
  title: "Electro-Magnetic Motor",
  shortTitle: "Tesla Polyphase AC Induction Motor",
  subtitle: "Rotating Magnetic Field and Polyphase Alternating Current Induction Machine",
  inventors: ["Nikola Tesla"],
  inventorLocation: "New York, New York",
  grantDate: "1888-05-01",
  filingDate: "1887-10-12",
  era: "Electrification & Early Modern (1870–1920)",
  category: "electricity",
  categoryLabel: "Electromagnetism & Power Generation",
  summary:
    "Tesla's 1888 method for turning a motor with two or more alternating currents that differ in phase. Stationary stator coils produce a magnetic field that walks around the air gap; a closed rotor follows it by induction. No commutator, no brushes.",
  heroQuote:
    "The subject of my present application is a new and useful improvement in electro-magnetic motors, having for its object to produce the rotation of the armature by the action of alternating currents differing in phase...",
  originalPdfUrl: "/patents/pdfs/us-381968-tesla-motor.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US381968A/en",
  usptoClassification: "H02K 17/00 (Asynchronous induction motors)",
  originalText: `UNITED STATES PATENT OFFICE.
NIKOLA TESLA, OF NEW YORK, N. Y., ASSIGNOR OF ONE-HALF TO CHARLES F. PECK, OF ENGLEWOOD, NEW JERSEY.

ELECTRO-MAGNETIC MOTOR.

SPECIFICATION forming part of Letters Patent No. 381,968, dated May 1, 1888.
Application filed October 12, 1887. Serial No. 252,132. (No model.)

To all whom it may concern:
Be it known that I, NIKOLA TESLA, a subject of the Emperor of Austria, from Smiljan, Lika, border country of Austria-Hungary, residing at New York, in the county and State of New York, have invented certain new and useful Improvements in Electro-Magnetic Motors, of which the following is a specification, reference being had to the drawings accompanying and forming a part of the same.

The subject of my present application is a new and useful improvement in electro-magnetic motors, having for its object to produce the rotation of the armature by the action of alternating currents differing in phase and conveyed to the motor over independent circuits.

In all previous electro-magnetic motors it has been the practice to pass the current through a commutator, or to utilize make-and-break devices to change the direction of current in the armature or field coils. Such commutators and contact brushes are subject to continuous wear, sparking, energy dissipation, and high maintenance, rendering them unsuitable for high-voltage power transmission over long distances.

In accordance with my invention I dispense entirely with commutators, collecting rings, and sliding contacts. I produce a continuously shifting or rotating magnetic field in the stationary part of the motor (the stator) by passing two or more alternating currents having a phase difference through independent energizing circuits.

These energized field poles induce secondary currents in a closed conductor or armature (the rotor) mounted on a shaft within the field. By the interaction of the induced currents with the rotating magnetic field, the armature is dragged around in continuous synchronous or asynchronous rotation with great mechanical torque and high efficiency.

Referring to the drawings:
Figure 1 is an end view and diagram of a motor having four poles energized in pairs by two independent alternating current circuits differing in phase by 90 degrees (quarter-phase or two-phase).
Figure 2 is a similar view showing an alternative form with an annular ring core.
Figure 3 is a diagram illustrating the sinusoidal waveforms of the two alternating currents.
Figure 4 is a diagram showing the resultant rotating magnetic vector at eight successive moments in a complete alternating current cycle.
Figure 5 is a longitudinal central section of the complete motor assembly.
Figure 6 is a diagrammatic representation of the generator and motor connected by four line wires.
Figure 7 is a diagram of an alternative three-phase configuration differing in phase by 120 degrees.
Figure 8 is a detail view of the laminated closed copper rotor.

In Figure 1, the field magnet consists of an annular laminated iron ring provided with four internal poles, A, A', B, B'. The coils on poles A and A' are connected in series to form circuit 1, connected to line wires leading from the first coil of a two-phase alternator. The coils on poles B and B' are connected in series to form circuit 2, connected to line wires leading from the second coil of the alternator, generating currents in quadrature (differing by 90 degrees).

When the current in circuit 1 is at maximum and that in circuit 2 is zero, the magnetic poles are at A and A'. As current in circuit 1 decreases and current in circuit 2 increases, the resultant magnetic vector rotates smoothly toward poles B and B'. Thus the magnetic field shifts continuously around the internal circumference of the stator ring without any moving parts.

The armature consists of a laminated iron cylinder mounted on a central shaft and wrapped with closed coils of heavy copper wire. As the magnetic lines of force sweep across the armature, they induce powerful eddy currents in the closed coils, which according to Lenz's law generate magnetic poles opposing the field change, creating continuous rotational torque.`,
  plainEnglishExplanation: {
    overview:
      "In 1887 a factory motor meant a DC machine with a split-ring commutator and carbon brushes. The brushes sparked, wore out, and confined useful DC transmission to about a mile. Tesla's answer was to leave the field coils still and let two (or three) alternating currents, shifted in phase, make the magnetic field itself walk around the stator. A closed rotor follows that field by induction.",
    coreMechanism:
      "Two currents 90° apart in perpendicular coils on an iron ring give a net field $\\vec{B}_{net}(t) = B_0[\\cos(\\omega t)\\hat{i}+\\sin(\\omega t)\\hat{j}]$ of constant magnitude that rotates at $n_s = 120f/P$. That traveling field cuts closed copper on the rotor, induces current, and the rotor is dragged along a slip behind the field.",
    mechanicalBreakdown: [
      {
        title: "Stationary Polyphase Stator Coils",
        summary: "Perpendicular pairs of coils energized by out-of-phase AC currents.",
        technicalDetails:
          "Circuit 1 carries $I_1(t) = I_0 \\cos(\\omega t)$ through horizontal poles; Circuit 2 carries $I_2(t) = I_0 \\sin(\\omega t)$ through vertical poles. The net magnetic field vector is $\\vec{B}_{net}(t) = B_0 [\\cos(\\omega t)\\hat{i} + \\sin(\\omega t)\\hat{j}]$, having constant magnitude $|\\vec{B}_{net}| = B_0$ and rotating at angular velocity $\\omega = 2\\pi f$.",
        archaicTerm: "Energizing-circuits differing in phase",
        modernEquivalent: "Polyphase AC stator windings",
      },
      {
        title: "Closed-Circuit Laminated Rotor (Armature)",
        summary: "A cylinder of laminated electrical steel containing closed copper conductors.",
        technicalDetails:
          "The rotor has no electrical connection to any power source. As the stator's B-field rotates, it cuts the rotor bars with relative speed (slip $s = (n_s - n_r)/n_s$). By Faraday's law of induction ($\\mathcal{E} = -d\\Phi/dt$), this induces large AC currents in the rotor bars, generating Lorentz force torque ($\\vec{F} = I \\vec{L} \\times \\vec{B}$).",
        archaicTerm: "Armature with closed coils",
        modernEquivalent: "Squirrel-cage induction rotor",
      },
      {
        title: "Brushless Laminated Core Design",
        summary: "Thin insulated sheets of silicon steel stacked together.",
        technicalDetails:
          "Laminating the iron stator and rotor cores interrupts closed circulating eddy currents inside the bulk iron, reducing hysteresis and eddy-current losses ($P_{eddy} \\propto f^2 B_{max}^2 d_{lam}^2$) and allowing high operational efficiency (>90%).",
        archaicTerm: "Laminated soft-iron ring",
        modernEquivalent: "Laminated stator core stack",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Rotating Magnetic Field Vector Synthesis",
        formula:
          "\\vec{B}_{net}(t) = B_0 \\cos(\\omega t)\\hat{i} + B_0 \\sin(\\omega t)\\hat{j} \\implies |\\vec{B}_{net}| = B_0",
        explanation:
          "Two sinusoidal magnetic fields in space quadrature and time quadrature sum vectorially to produce a single rotating vector of constant magnitude.",
      },
      {
        principle: "Faraday-Lenz Electromagnetic Induction",
        formula:
          "\\mathcal{E}_{rotor} = -N \\frac{d\\Phi_B}{dt} = -N \\frac{d}{dt} \\int \\vec{B}_{rot} \\cdot d\\vec{A}",
        explanation:
          "The time-varying magnetic flux through the closed rotor loops generates an electromotive force (EMF) that drives induced currents without electrical contacts.",
      },
      {
        principle: "Asynchronous Rotor Slip & Induction Torque",
        formula:
          "T_{em} = \\frac{3 V_{th}^2 R_r'/s}{\\omega_s [(R_{th} + R_r'/s)^2 + (X_{th} + X_r')^2]}",
        explanation:
          "Induction motors operate with a small slip s between synchronous field speed and mechanical rotor speed; maximum torque (breakdown torque) occurs at critical slip.",
      },
    ],
    whyItMattersToday:
      "Most of the electrical energy that becomes shaft work still goes through a three-phase induction machine: pumps, compressors, factory lines, locomotive traction. The name on a modern EV inverter is marketing; the physics is still $n_s = 120f/P$ and a squirrel cage chasing a rotating field.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "The method of operating electro-magnetic motors herein described, which consists in producing a progressive shifting of the magnetic poles of the motor by directing through independent energizing-circuits alternating currents differing in phase, substantially as set forth.",
      plainEnglish:
        "The master claim covering the method of turning any electric motor by using two or more alternating currents with shifted phases to create a rotating magnetic field.",
      keyInnovations: [
        "Polyphase AC rotating magnetic field",
        "Phase-shifted alternating currents",
        "Progressive magnetic shifting without mechanical switching",
      ],
    },
    {
      number: 2,
      isIndependent: true,
      originalText:
        "The combination, with an annular or other closed field-magnet, of two or more independent energizing-circuits and an armature mounted within the field, and connections for directing through the circuits alternating currents differing in phase, whereby a progressive shifting of the poles of the field-magnet is produced, substantially as set forth.",
      plainEnglish:
        "Apparatus claim for the motor structure: a closed stator with multiple independent phase coils, a rotor mounted inside, and wiring for out-of-phase AC currents.",
      keyInnovations: [
        "Polyphase stator architecture",
        "Closed magnetic circuit",
        "Internal rotor geometry",
      ],
    },
    {
      number: 9,
      isIndependent: true,
      originalText:
        "The combination, with a motor containing independent energizing-circuits, of an alternating-current generator with coils connected with the motor-circuits and adapted to produce alternating currents differing in phase, substantially as described.",
      plainEnglish:
        "System claim covering the entire AC power grid: an alternating current generator producing polyphase electricity linked directly over transmission wires to polyphase induction motors.",
      keyInnovations: [
        "End-to-end polyphase AC power system",
        "Synchronous AC generation and distribution",
        "Complete AC grid architecture",
      ],
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Quarter-Phase 4-Pole AC Induction Motor",
      caption:
        "Diagrammatic front view showing four salient stator poles energized in orthogonal pairs by two alternating currents differing in phase by 90 degrees.",
      svgType: "tesla-motor",
      callouts: [
        {
          id: "tm-1",
          figureRef: "Fig. 1",
          label: "A, A'",
          element: "Phase 1 Stator Coils (Cosine Wave)",
          description:
            "Energized by first AC phase circuit to produce horizontal alternating magnetic flux.",
          x: 20,
          y: 50,
        },
        {
          id: "tm-2",
          figureRef: "Fig. 1",
          label: "B, B'",
          element: "Phase 2 Stator Coils (Sine Wave)",
          description:
            "Energized by second AC phase circuit (90 deg shifted) to produce vertical alternating magnetic flux.",
          x: 50,
          y: 20,
        },
        {
          id: "tm-3",
          figureRef: "Fig. 1",
          label: "C",
          element: "Laminated Closed Rotor",
          description:
            "Squirrel-cage induction rotor rotated by induced secondary currents with zero brushes.",
          x: 50,
          y: 50,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "Edison's Pearl Street station (1882) sold 110-volt DC. $I^2R$ loss made that voltage useless beyond about a mile, so every neighborhood needed its own dynamo. Transformers could raise AC for long lines, but factories still wanted a motor that started under load and did not eat its own brushes. Until Tesla, AC was a lighting trick.",
    priorArtLimitations: [
      "DC commutators sparked, needed constant turning, and failed in dusty mills.",
      "Single-phase AC machines had no starting torque; they had to be spun up by hand.",
      "Gaulard–Gibbs and Zipernowsky–Déri–Bláthy transformers served lamps, not shafts.",
      "Niagara's 1880s hydraulic plans had no electrical load except arc lights.",
    ],
    breakthroughInsight:
      "Tesla later said the idea arrived in Budapest in 1882, walking and reciting Faust: two stationary coils, currents in quadrature, a field that rotates in empty iron. Ferraris in Turin published a similar rotating-field observation in 1888; Tesla had already filed. Priority fights followed, but Westinghouse bought Tesla's stack, not Ferraris's paper.",
    patentWars: [
      {
        rivalName: "Thomas Edison and General Electric (War of the Currents)",
        rivalClaim:
          "Edison's camp argued high-voltage AC would kill customers. They funded public animal electrocutions and backed the first electric chair (1890) as a demonstration of AC danger.",
        conflictDetails:
          "Westinghouse licensed Tesla's polyphase patents in 1888 (cash, stock, and a per-horsepower royalty). The 1893 Chicago fair ran on Westinghouse AC. In 1895 the Niagara Adams plant sent two-phase power to Buffalo. GE, after merging with Thomson-Houston, had to take AC licenses to stay in the transmission business.",
        resolution:
          "By 1900 new urban plants were AC. Edison lost the system fight and left the day-to-day running of GE. DC lingered in elevator and traction pockets into the late 20th century.",
        legalOutcome:
          "Tesla's motor and system patents held. The commercial fight was decided by Niagara and the fair, not by a single decree.",
      },
    ],
    civilizationalImpact:
      "Once a factory could hang an induction motor on a 60 Hz (or 50 Hz) feeder, the steam-shaft alley died. The same polyphase grammar still sets the frequency of every interconnected grid.",
    funFact:
      "During Westinghouse's 1890s cash crisis Tesla released the per-horsepower royalty. The often-quoted '$12 million torn up' figure is a later estimate, not a cancelled invoice, but the waiver was real and it kept the AC plant program alive.",
    aftermath:
      "Tesla left motor design for radio-frequency and wireless-power work. The induction machine became a GE and Westinghouse commodity. His name returned to consumer products a century later; the stator math did not need the branding.",
    sideNotes: [
      "US 381,968 is one of a cluster Tesla filed in October 1887. The companion generator and distribution patents are why Westinghouse could bid Niagara as a system, not a motor.",
      "Galileo Ferraris demonstrated a two-phase rotating field in Turin in 1885 and published in 1888. He did not file in the United States. Historians now treat the physics as independently seen; the industrial system is Tesla–Westinghouse.",
      "Early Niagara generators were two-phase. Utilities later standardized on three-phase because three wires carry more power for the copper. Tesla's claims already covered more than two phases.",
    ],
  },
};
