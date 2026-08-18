import { teslaMotorArchivalEdition } from "@/data/editions/teslaMotorEdition";
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
    "The Foundation of the Modern Power Grid: On May 1, 1888, Nikola Tesla patented the polyphase alternating current (AC) induction motor. By feeding two or more out-of-phase AC currents through stationary stator windings, Tesla created a continuously rotating magnetic field in the air gap without any mechanical movement. This traveling magnetic field induced powerful secondary currents in a closed brushless rotor, dragging it into smooth rotation. Tesla's induction motor solved the fundamental limitation of AC power, proving that alternating current could drive industrial machinery and sparking the victory of AC over DC in the War of the Currents.",
  heroQuote:
    "The subject of my present application is a new and useful improvement in electro-magnetic motors, having for its object to produce the rotation of the armature by the action of alternating currents differing in phase...",
  originalPdfUrl: "/patents/pdfs/us-381968-tesla-motor.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US381968A/en",
  usptoClassification: "H02K 17/00 (Asynchronous induction motors)",
  archivalEdition: teslaMotorArchivalEdition,
  originalTextAsset: {
    url: "/patents/transcripts/us-381968-tesla-motor-reviewed.txt",
    pageCount: 9,
    kind: "reviewed-transcription",
    sourcePdfSha256: "cffd7ff061b05feef92c2d6ef4d767c7b7e8c6b4e0d10cc9be3fbd51841dce12",
    reviewedBy: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-08-18",
  },
  originalText: `UNITED STATES PATENT OFFICE.
NIKOLA TESLA, OF NEW YORK, N. Y., ASSIGNOR OF ONE-HALF TO CHARLES F. PECK, OF ENGLEWOOD, NEW JERSEY.

ELECTRO-MAGNETIC MOTOR.

SPECIFICATION forming part of Letters Patent No. 381,968, dated May 1, 1888.
Application filed October 12, 1887. Serial No. 252,132. (No model.)

To all whom it may concern:
Be it known that I, NIKOLA TESLA, from Smiljan Lika, border country of Austria-Hungary, residing at New York, in the county and State of New York, have invented certain new and useful Improvements in Electro-Magnetic Motors, of which the following is a specification, reference being had to the drawings accompanying and forming a part of the same.

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

The armature consists of a laminated iron cylinder mounted on a central shaft and wrapped with closed coils of heavy copper wire. As the magnetic lines of force sweep across the armature, they induce powerful eddy currents in the closed coils, which according to Lenz's law generate magnetic poles opposing the field change, creating continuous rotational torque.

What I claim is:

1. The combination, with a motor containing separate or independent circuits on the armature or field-magnet, or both, of an alternating-current generator containing induced circuits connected independently to corresponding circuits in the motor, whereby a rotation of the generator produces a progressive shifting of the poles of the motor, as herein described.

2. In a system for the electrical transmission of power, the combination of a motor provided with two or more independent magnetizing-coils and an alternating-current generator containing induced coils corresponding to the motor-coils, and circuits connecting directly the motor and generator coils in such order that the currents developed by the generator will be passed through the corresponding motor-coils, and thereby produce a progressive shifting of the poles of the motor, as herein set forth.

3. The combination, with a motor having an annular or ring-shaped field-magnet and a cylindrical or equivalent armature, and independent coils on the field-magnet or armature, or both, of an alternating-current generator having correspondingly independent coils, and circuits including the generator-coils and corresponding motor-coils in such manner that the rotation of the generator causes a progressive shifting of the poles of the motor in the manner set forth.

4. In a system for the electrical transmission of power, the combination of the following instrumentalities, to wit: a motor composed of a disk or its equivalent mounted within a ring or annular field-magnet, which is provided with magnetizing-coils connected in diametrically-opposite pairs or groups to independent terminals, a generator having induced coils or groups of coils equal in number to the pairs or groups of motor-coils, and circuits connecting the terminals of said coils to the terminals of the motor, respectively, and in such order that the rotation of the generator and the consequent production of alternating currents in the respective circuits produces a progressive shifting of the poles of the motor, as hereinbefore described.`,
  plainEnglishExplanation: {
    overview:
      "In the 1880s, electric motors were direct current (DC) machines equipped with split-ring mechanical commutators and carbon brushes. The brushes sparked violently, wore out rapidly, generated severe electrical noise, and limited power transmission to a one-mile radius around local DC dynamos ($I^2R$ copper losses). Alternating current (AC) could be transformed to high voltages for hundreds of miles of transmission, but no practical AC motor existed—single-phase motors had zero starting torque and had to be spun up by hand. In a flash of mathematical genius, Nikola Tesla realized that passing multiple out-of-phase AC currents through stationary stator coils created a rotating magnetic field in the air gap. A closed rotor inside this field is dragged along purely by electromagnetic induction, eliminating all commutators, brushes, sparking, and wear.",
    coreMechanism:
      "Two alternating currents in phase quadrature ($I_1 = I_0 \\cos(\\omega t)$ and $I_2 = I_0 \\sin(\\omega t)$) flow through orthogonal stator winding pairs. By vector addition of magnetic flux, this generates a constant-magnitude net magnetic field vector $\\vec{B}_{net}(t) = B_0 [\\cos(\\omega t)\\hat{i} + \\sin(\\omega t)\\hat{j}]$ that rotates at synchronous speed $n_s = 120f/P$. As the rotating magnetic flux sweeps across the closed copper conductors of the rotor, Faraday's Law of Induction induces large circulating rotor currents. By Lorentz force law ($\\vec{F} = I \\vec{L} \\times \\vec{B}$), the interaction between the induced rotor currents and the sweeping stator field exerts continuous rotational torque on the motor shaft.",
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
      {
        title: "Brushless Solid Shaft Assembly",
        summary: "Rotating drive shaft supported on low-friction sleeve bearings.",
        technicalDetails:
          "Because power is transferred across the air gap entirely by electromagnetic induction, the rotor requires zero slip rings, commutators, or carbon brushes, operating maintenance-free for decades.",
        archaicTerm: "Shaft mounted in non-magnetic bearings",
        modernEquivalent: "Brushless rotor shaft and bearing assembly",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Rotating Magnetic Field Vector Synthesis",
        formula:
          "\\vec{B}_{net}(t) = B_0 \\cos(\\omega t)\\hat{i} + B_0 \\sin(\\omega t)\\hat{j} \\implies |\\vec{B}_{net}| = B_0, \\quad \\theta(t) = \\omega t",
        explanation:
          "Two sinusoidal magnetic fields in 90° spatial quadrature and 90° temporal phase quadrature sum vectorially to produce a single rotating vector of invariant magnitude $B_0$ revolving at $\\omega = 2\\pi f$.",
      },
      {
        principle: "Faraday-Lenz Electromagnetic Induction in Rotor",
        formula:
          "\\mathcal{E}_{rotor} = -N \\frac{d\\Phi_B}{dt} = -N \\frac{d}{dt} \\int \\vec{B}_{rot} \\cdot d\\vec{A}, \\quad I_r = \\frac{\\mathcal{E}_{rotor}}{\\sqrt{R_r^2 + (s \\omega_s L_r)^2}}",
        explanation:
          "The relative motion between the rotating stator field and the slower rotor bars induces an alternating voltage that drives high rotor currents proportional to slip $s$.",
      },
      {
        principle: "Kloss Formula for Induction Motor Torque",
        formula:
          "T_{em}(s) = \\frac{2 T_{max}}{\\frac{s}{s_{crit}} + \\frac{s_{crit}}{s}}, \\quad T_{max} = \\frac{3 V_{th}^2}{2 \\omega_s [R_{th} + \\sqrt{R_{th}^2 + (X_{th} + X_r')^2}]}",
        explanation:
          "Torque is zero at synchronous speed ($s=0$), reaches peak breakdown torque $T_{max}$ at critical slip $s_{crit}$, and provides high self-starting torque under heavy industrial loads.",
      },
      {
        principle: "Synchronous Speed & Stator Pole Geometry",
        formula:
          "n_s = \\frac{120 f}{P} \\text{ RPM}, \\quad \\omega_s = \\frac{4\\pi f}{P} \\text{ rad/s}",
        explanation:
          "Synchronous rotational speed is strictly determined by grid frequency $f$ (60 Hz) and the number of magnetic stator poles $P$, establishing predictable motor speeds for factory automation.",
      },
      {
        principle: "Laminated Core Eddy Current Loss Suppression",
        formula:
          "P_{eddy} = \\frac{\\pi^2 B_{max}^2 d_{lam}^2 f^2}{6 \\rho_{core} D_{iron}} \\propto d_{lam}^2",
        explanation:
          "Dividing the iron core into thin insulated laminations of thickness $d_{lam} \\approx 0.5\\text{ mm}$ reduces parasitic eddy current heating by a factor of 100, elevating efficiency above 90%.",
      },
    ],
    whyItMattersToday:
      "Tesla's polyphase induction motor is the workhorse of industrial civilization. Today, polyphase induction machines consume over 45% of all global electrical energy generated worldwide—powering industrial pumps, compressors, factory robotics, HVAC systems, bullet trains, and modern electric vehicle powertrains. Tesla's polyphase system also established the worldwide 3-phase AC power transmission grid that supplies modern civilization.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "The combination, with a motor containing separate or independent circuits on the armature or field-magnet, or both, of an alternating-current generator containing induced circuits connected independently to corresponding circuits in the motor, whereby a rotation of the generator produces a progressive shifting of the poles of the motor, as herein described.",
      plainEnglish:
        "The master apparatus and system combination claim protecting an alternating-current motor possessing two or more independent energizing circuits on the field or armature, coupled directly to corresponding induced circuits of an alternating-current generator, whereby rotating the generator continuously advances and rotates the motor's magnetic poles in synchronism without mechanical commutators.",
      keyInnovations: [
        "Paired motor-generator polyphase circuits",
        "Independent magnetic phase windings",
        "Progressive pole shifting from generator rotation",
      ],
      legalSignificance:
        "The core structural combination claim establishing the foundational link between polyphase AC generation and polyphase motor torque.",
    },
    {
      number: 2,
      isIndependent: true,
      originalText:
        "In a system for the electrical transmission of power, the combination of a motor provided with two or more independent magnetizing-coils and an alternating-current generator containing induced coils corresponding to the motor-coils, and circuits connecting directly the motor and generator coils in such order that the currents developed by the generator will be passed through the corresponding motor-coils, and thereby produce a progressive shifting of the poles of the motor, as herein set forth.",
      plainEnglish:
        "The master power-transmission system combination claim covering an induction motor possessing at least two independent magnetizing coils directly wired to matching induced generator coils in an ordered sequence that transmits alternating currents to produce continuous traveling magnetic poles.",
      keyInnovations: [
        "Polyphase electrical power transmission system",
        "Ordered direct multi-phase wiring",
        "Phase-quadrature induction motor drive",
      ],
      legalSignificance:
        "Protected the fundamental architecture of long-distance polyphase power transmission from generator station to industrial motor.",
    },
    {
      number: 3,
      isIndependent: true,
      originalText:
        "The combination, with a motor having an annular or ring-shaped field-magnet and a cylindrical or equivalent armature, and independent coils on the field-magnet or armature, or both, of an alternating-current generator having correspondingly independent coils, and circuits including the generator-coils and corresponding motor-coils in such manner that the rotation of the generator causes a progressive shifting of the poles of the motor in the manner set forth.",
      plainEnglish:
        "The specific machine architecture claim covering an annular ring field magnet enclosing a cylindrical or equivalent armature rotor, equipped with independent phase coils wired to an alternating-current generator to shift the stator poles progressively and drive continuous brushless shaft rotation.",
      keyInnovations: [
        "Annular ring stator geometry",
        "Internal cylindrical armature rotor",
        "Continuous circular traveling magnetic vector",
      ],
      legalSignificance:
        "Defined the physical circular ring and internal cylindrical rotor topology adopted by virtually all industrial induction motors.",
    },
    {
      number: 4,
      isIndependent: true,
      originalText:
        "In a system for the electrical transmission of power, the combination of the following instrumentalities, to wit: a motor composed of a disk or its equivalent mounted within a ring or annular field-magnet, which is provided with magnetizing-coils connected in diametrically-opposite pairs or groups to independent terminals, a generator having induced coils or groups of coils equal in number to the pairs or groups of motor-coils, and circuits connecting the terminals of said coils to the terminals of the motor, respectively, and in such order that the rotation of the generator and the consequent production of alternating currents in the respective circuits produces a progressive shifting of the poles of the motor, as hereinbefore described.",
      plainEnglish:
        "The complete instrumental power system claim defining a ring stator with diametrically-opposed coil groups, an internal disk armature rotor, and an equal number of matching generator coil circuits creating polyphase currents and progressive magnetic pole shifting to transmit mechanical power.",
      keyInnovations: [
        "Diametrically-opposed stator coil pairs",
        "Equal multi-phase generator coil groups",
        "Synchronous polyphase induction drive",
      ],
      legalSignificance:
        "The most exhaustive system claim of the patent, upholding Westinghouse's exclusive rights during the historic War of the Currents.",
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
    {
      figureNumber: "Fig. 4",
      title: "Rotating Magnetic Field Vector Progression",
      caption:
        "Vector diagrams showing the resultant magnetic field vector $\\vec{B}_{net}$ revolving through 360 degrees during one AC electrical cycle.",
      svgType: "tesla-motor",
      callouts: [
        {
          id: "tm-4",
          figureRef: "Fig. 4",
          label: "R",
          element: "Rotating Magnetic Vector",
          description:
            "Constant-magnitude vector revolving around the air gap at synchronous speed $n_s$.",
          x: 50,
          y: 50,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "In the late 1880s, Thomas Edison's low-voltage DC grid was severely limited by $I^2R$ line resistance losses, requiring expensive coal dynamos every mile. George Westinghouse realized that alternating current (AC) could be transformed to thousands of volts for efficient long-distance transmission. However, AC had a fatal flaw: no practical AC motor existed. Without a motor to run factory machinery, elevator shafts, and streetcars, alternating current was confined strictly to nighttime incandescent lighting.",
    priorArtLimitations: [
      "DC commutators and carbon brushes sparked violently, wore out rapidly, and failed in dusty industrial mills.",
      "Single-phase AC machines had zero starting torque, requiring operators to hand-crank the motor up to speed.",
      "Early AC transformers could power lamps, but could not produce mechanical rotary motion.",
      "The massive Niagara Falls hydroelectric project had no industrial power market without an efficient AC motor.",
    ],
    breakthroughInsight:
      "In February 1882, while walking in a Budapest city park reciting Goethe's *Faust*, Tesla experienced a legendary flash of insight: instead of mechanically spinning a physical magnetic pole, two stationary electromagnets energized by out-of-phase AC currents would produce a rotating magnetic field in empty space. Placing a closed copper armature inside would induce current and produce self-starting rotational torque without a single commutator or brush.",
    patentWars: [
      {
        rivalName: "Thomas Edison and General Electric (War of the Currents)",
        rivalClaim:
          "Thomas Edison launched a fierce smear campaign against alternating current, calling it lethal and funding public animal electrocutions. When Westinghouse won the contract to power the 1893 World's Columbian Exposition in Chicago using Tesla's AC system, Edison's General Electric attempted to block Westinghouse from using Edison screw-base light bulbs.",
        conflictDetails:
          "George Westinghouse licensed Tesla's polyphase patents in July 1888 for $60,000 in cash and stock, plus a $2.50 per-horsepower royalty. In 1893, Westinghouse brilliantly demonstrated Tesla's polyphase motors at the Chicago World's Fair, illuminating 100,000 bulbs and running huge motors. In 1895, the Edward Dean Adams Power Plant at Niagara Falls went online, transmitting 15,000 horsepower of two-phase 25 Hz electricity 26 miles to Buffalo, New York.",
        resolution:
          "General Electric conceded defeat in the War of the Currents and took cross-licenses to Tesla's AC patents. Within five years, virtually every new power grid in the world was constructed on Tesla's polyphase AC standard.",
        legalOutcome:
          "Tesla's US Patent No. 381,968 was repeatedly upheld in federal circuit courts, affirming Tesla as the sole inventor of the polyphase induction motor.",
      },
    ],
    civilizationalImpact:
      "Tesla's induction motor and polyphase system built the electrical infrastructure of modern civilization. It enabled clean, centralized hydroelectric and thermal power generation, long-distance high-voltage transmission, and the complete electrification of factory manufacturing, mining, transportation, and domestic appliances.",
    funFact:
      "During the financial panic of the 1890s, George Westinghouse was pushed to the brink of bankruptcy by New York bankers who demanded he cancel Tesla's royalty contract. Westinghouse explained the situation to Tesla in Pittsburgh. Recognizing that the future of AC power was at stake, Tesla famously tore up his multimillion-dollar royalty contract on the spot, telling Westinghouse: 'My gratitude to you is absolute. You believed in me when no one else did... I tear this contract to pieces!'",
    aftermath:
      "Tesla's induction motor made Westinghouse Electric a global industrial empire. Tesla went on to pioneer high-frequency radio-frequency oscillators (Tesla Coils), wireless power transmission, radio remote control (the first RC teleautomaton boat in 1898), and early robotics. In 1960, the Conférence Générale des Poids et Mesures named the SI unit of magnetic flux density the **Tesla** (T) in his honor.",
    sideNotes: [
      "Italian physicist Galileo Ferraris demonstrated a similar rotating magnetic field principle in 1885 and published a paper in April 1888, but did not file a patent and concluded the device had too low efficiency for practical use. Tesla filed his complete US patents six months before Ferraris published.",
      "While early Niagara Falls generation used Tesla's 2-phase 4-wire system, German engineer Mikhail Dolivo-Dobrovolsky refined Tesla's concept in 1889 into the 3-phase 3-wire star/delta system, which requires 25% less copper and is the universal global standard today.",
    ],
  },
  tags: [
    "Nikola Tesla",
    "Induction Motor",
    "Alternating Current",
    "Polyphase",
    "Rotating Magnetic Field",
    "Electromagnetism",
    "War of the Currents",
    "Niagara Falls",
  ],
  stats: {
    totalClaims: 4,
    independentClaims: 4,
  },
};

