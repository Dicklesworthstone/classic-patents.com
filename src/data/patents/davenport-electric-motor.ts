import type { Patent } from "@/types/patent";

export const davenportElectricMotorPatent: Patent = {
  id: "us-132-davenport-electric-motor",
  patentNumber: "US 132",
  title: "Improvement in Propelling Machinery by Magnetism and Electro-Magnetism",
  shortTitle: "Davenport Commutator DC Electric Motor",
  subtitle:
    "Revolving Cross-Arm Electromagnets, Split Commutator Plates, and Stationary Field Stators",
  inventors: ["Thomas Davenport"],
  inventorLocation: "Brandon, Rutland County, Vermont",
  grantDate: "1837-02-25",
  filingDate: "1837-01-24",
  era: "Early Republic & Industrial Dawn (1790–1830)",
  category: "electricity",
  categoryLabel: "Electromagnetic Machinery & Motors",
  summary:
    "The world's first patent for an electric motor: Thomas Davenport's 1837 DC motor utilizing rotating cross-shaped electromagnets commutated via split copper segments against stationary permanent or electromagnetic stator poles, converting galvanic battery current into continuous mechanical rotational power for machine tools.",
  heroQuote:
    "The motion is produced by the attraction and repulsion of magnets... the polarity of the revolving magnets being reversed twice during each revolution by the commutator plates.",
  originalPdfUrl: "/patents/pdfs/us-132-davenport-electric-motor.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US132/en",
  usptoClassification: "H02K 23/00 (DC commutator motors; Commutation)",
  originalText: `UNITED STATES PATENT OFFICE.
THOMAS DAVENPORT, OF BRANDON, VERMONT.

IMPROVEMENT IN PROPELLING MACHINERY BY MAGNETISM AND ELECTRO-MAGNETISM.

Specification forming part of Letters Patent No. 132, dated February 25, 1837.

To all whom it may concern:
Be it known that I, THOMAS DAVENPORT, of Brandon, in the County of Rutland and State of Vermont, have invented a new and useful Machine for Applying Magnetic and Electro-Magnetic Power to the Propelling of Machinery, of which the following is a specification:

The principle of my invention consists in producing continuous rotary motion by the mutual attraction and repulsion of electromagnets and permanent magnets or other electromagnets, changing the magnetic poles of the revolving magnets by means of a commutator as they pass the stationary poles.

The construction of the apparatus is as follows:
1. A stationary horizontal frame of wood or brass supporting two semi-circular stationary magnets (or electromagnets) with their north and south poles presented towards a central vertical shaft.
2. A vertical central shaft or spindle carrying four horizontal cross-arms formed of soft iron, wound with insulated copper wire to constitute revolving electromagnets.
3. A commutator consisting of split copper plates or segments mounted upon the vertical shaft and insulated from each other. Copper conducting wires from the galvanic battery terminate in spring brushes that press against these segments.
4. The wires from the revolving electromagnets are connected to the segments of the commutator in such manner that as the poles of the revolving magnets approach the opposite poles of the stationary magnets, they are attracted; but as they pass them, the current is reversed by the segments moving under the brushes, changing the poles of the revolving electromagnets so that they are immediately repelled from the poles they have just passed and attracted toward the next succeeding stationary poles.

By this continuous alternation of attraction and repulsion, a rapid and powerful rotary motion is imparted to the vertical shaft, which may be connected by gears or pulleys to drive lathes, printing presses, or other machinery.

I claim as my invention:
1. The application of magnetic and electro-magnetic power to the production of continuous rotary motion for propelling machinery.
2. The combination of revolving electromagnets with stationary magnets, having their polarity reversed twice in each revolution by a commutator, substantially as described.`,
  plainEnglishExplanation: {
    overview:
      "Before Thomas Davenport, electricity was considered an experimental curiosity confined to galvanic shocks and laboratory spark demonstrations. Davenport, a self-taught blacksmith from Vermont, realized that Joseph Henry's electromagnets could be arranged to rotate continuously if their magnetic poles were switched at the exact instant they passed stationary poles. His 1837 patent is the foundational master patent for all direct-current (DC) electric motors.",
    coreMechanism:
      "Four soft-iron arms wrapped with silk-insulated copper wire form a cross-shaped rotor mounted on a central drive shaft. As electric current from a galvanic battery flows through the coils, the arms become powerful electromagnets whose north and south poles are attracted toward stationary stator magnets. Just as the rotor poles reach the stator poles ($0^\\circ\\text{ alignment}$), split copper commutator segments on the shaft slide past stationary battery contact brushes, reversing the direction of current flow through the rotor coils. This instantly inverts the rotor's magnetic poles from attraction to repulsion, pushing the arms forward into the next quadrant to produce continuous unidirectional rotary torque.",
    mechanicalBreakdown: [
      {
        title: "Revolving Cross-Arm Electromagnet Rotor",
        summary: "Four soft-iron poles wound with insulated copper wire on central shaft.",
        technicalDetails:
          "Soft-iron cores wrapped with multiple layers of copper wire insulated with silk ribbons from his wife's wedding dress. When energized with $I = 2\\text{ to }5\\text{ A}$, the iron generates a magnetic flux density of $B \\approx 0.8\\text{ Tesla}$, creating magnetic dipole moments $\\vec{m} = N I A \\hat{n}$.",
        archaicTerm: "Revolving horizontal cross-arms of soft iron",
        modernEquivalent: "Salient-pole wound DC rotor / Armature",
      },
      {
        title: "Split-Segment Rotary Commutator",
        summary: "Divided copper cylinder reversing current polarity at each half-cycle.",
        technicalDetails:
          "Four semicircular copper segments mounted on an insulated wood hub on the shaft, separated by air gaps of $1.5\\text{ mm}$. Stationary copper leaf spring brushes ride upon the segments, mechanically inverting the battery circuit connection twice per revolution (every $90^\\circ$ for 4 poles).",
        archaicTerm: "Commutator plates or segments on the spindle",
        modernEquivalent: "Segmented commutator & carbon/copper brushes",
      },
      {
        title: "Stationary Magnetic Stator Field",
        summary: "Semi-circular permanent or battery-excited field magnets.",
        technicalDetails:
          "Two curved horseshoe magnets mounted in a wooden frame creating a fixed radial magnetic field $B_{\\text{stator}}$ across the air gap ($g \\approx 3\\text{ mm}$), establishing the stationary flux through which the rotor poles rotate.",
        archaicTerm: "Stationary semi-circular magnets",
        modernEquivalent: "Stator field pole shoes / Permanent magnet stator",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Lorentz Magnetic Torque on Rotor Dipole",
        formula:
          "\\vec{\\tau} = \\vec{m} \\times \\vec{B} = N I A B_{\\text{stator}} \\sin(\\theta)",
        explanation:
          "The mechanical torque produced by the rotor is proportional to the cross product of the rotor's magnetic dipole moment $\\vec{m}$ and the stator's magnetic field $\\vec{B}$, peaking when the poles are at $90^\\circ$ relative to the stator axis.",
      },
      {
        principle: "Commutation Polarity Inversion & Continuity",
        formula: "I_{\\text{coil}}(t) = I_0 \\cdot \\text{sgn}(\\sin(p \\theta(t)))",
        explanation:
          "The mechanical commutator inverts current sign at the neutral magnetic plane, ensuring that the sign of $\\sin(\\theta)$ is always positive, resulting in unidirectional positive torque $\\tau(t) > 0$ across all $360^\\circ$.",
      },
      {
        principle: "Back-EMF & Armature Current Equilibrium",
        formula:
          "I = \\frac{V_{\\text{battery}} - \\mathcal{E}_{\\text{back}}}{R} = \\frac{V_{\\text{battery}} - k_e \\omega}{R}",
        explanation:
          "As the rotor accelerates to higher angular velocity $\\omega$, Faraday induction generates a counter-electromotive force (back-EMF) that opposes battery voltage, self-regulating the motor's top no-load speed.",
      },
    ],
    whyItMattersToday:
      "Davenport's core principle of mechanical commutation—switching coil current polarities in synchronization with rotor position to produce continuous torque—is the working foundation of every brushed DC motor, starter motor, and motorized actuator in existence. It also provided the foundational blueprint for modern brushless DC (BLDC) motors, where solid-state MOSFETs replace mechanical commutator segments.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "The application of magnetic and electro-magnetic power to the production of continuous rotary motion for propelling machinery.",
      plainEnglish:
        "Pioneer claim broadly asserting the conversion of electrical and magnetic energy into continuous mechanical rotary motion to drive machinery.",
      keyInnovations: [
        "Continuous rotary electromagnetic motor",
        "Electromagnetic conversion of chemical battery power into mechanical work",
      ],
      legalSignificance:
        "The world's first patent for an electric motor, establishing the entire technical class of electromagnetic rotary engines.",
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "The combination of revolving electromagnets with stationary magnets, having their polarity reversed twice in each revolution by a commutator, substantially as described.",
      plainEnglish:
        "Specifies the combination of rotating electromagnets and fixed stator magnets with a segmented commutator that inverts rotor polarity twice per revolution to maintain continuous torque.",
      keyInnovations: [
        "Segmented rotary mechanical commutator",
        "Synchronized polarity switching at neutral axis",
        "Attraction-repulsion continuous magnetic drive",
      ],
      legalSignificance:
        "Protected the fundamental commutator switching geometry used in all direct-current motors.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Plan View of Davenport Commutator Electric Motor",
      caption:
        "Top-down view showing stationary stator magnets, rotating 4-pole electromagnet cross-arms, commutator segments, and vertical shaft.",
      svgType: "davenport-electric-motor",
      callouts: [
        {
          id: "dm-1",
          figureRef: "Fig. 1",
          label: "A",
          element: "Stationary Stator Magnets",
          description: "Curved permanent magnet poles fixed to horizontal frame.",
          x: 20,
          y: 50,
        },
        {
          id: "dm-2",
          figureRef: "Fig. 1",
          label: "B",
          element: "Rotating Electromagnet Cross-Arms",
          description: "Four soft-iron poles wound with insulated copper wire.",
          x: 50,
          y: 50,
        },
        {
          id: "dm-3",
          figureRef: "Fig. 1",
          label: "C",
          element: "Segmented Commutator & Brushes",
          description: "Split copper plates reversing current polarity at each half-cycle.",
          x: 50,
          y: 80,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "Following Hans Christian Ørsted's 1820 discovery of electromagnetism and Michael Faraday's 1821 laboratory wire-rotation experiment, no machine existed that could produce usable continuous rotary mechanical power from electricity to drive practical industrial tools.",
    priorArtLimitations: [
      "Peter Barlow's 1822 spur wheel and William Sturgeon's early devices produced negligible torque and were laboratory curiosities.",
      "No mechanism existed that systematically inverted coil current polarities dynamically during rotation to produce continuous torque.",
      "Insulation was primitive; insulated copper wire was unavailable commercially and had to be wrapped by hand.",
    ],
    breakthroughInsight:
      "Davenport realized that electromagnets could be made thousands of times stronger than permanent magnets by wrapping many turns of insulated wire, and that a segmented rotating switch (the commutator) could continuously flip magnetic poles to turn attraction into repulsion the instant the poles crossed.",
    patentWars: [
      {
        rivalName: "Patent Office Skepticism and Financial Ruin",
        rivalClaim:
          "The US Patent Office initially rejected Davenport's application in 1835 on the grounds that a 'magnetic perpetual motion engine' was physically impossible!",
        conflictDetails:
          "Davenport traveled to Princeton and Washington, obtaining letters of endorsement from physics pioneer Professor Joseph Henry and Benjamin Silliman of Yale. When the patent finally issued in 1837, Davenport faced the commercial limitation that zinc-acid batteries were too expensive to compete with steam engines.",
        resolution:
          "Davenport built electric model locomotives, a rotary printing press (publishing the journal The Electro-Magnet and Mechanics' Intelligencer in 1840), and machine shop lathes, but went bankrupt before commercial dynamos and cheap electricity arrived.",
        legalOutcome:
          "The patent was fully upheld as a valid and pioneer invention, but expired in 1851 before the widespread rollout of electrical grids.",
      },
    ],
    civilizationalImpact:
      "Davenport proved that electricity could perform heavy mechanical work. Today, over 50% of all electrical energy generated on planet Earth is consumed by electric motors descending from Davenport's rotating electromagnetic commutated architecture.",
    funFact:
      "Thomas Davenport was an impoverished village blacksmith in Brandon, Vermont, with only three years of formal schooling. To insulate the hundreds of feet of bare copper wire for his first motor in 1834, his wife Emily Davenport sacrificed her silk wedding dress, cutting it into narrow strips to wrap every inch of wire by hand!",
    aftermath:
      "Davenport died in 1851 in Salisbury, Vermont, at age 48, penniless and unrecognized. Forty years later, during the 1890s electrical boom, the American Institute of Electrical Engineers officially recognized Thomas Davenport as the father of the electric motor.",
  },
  tags: [
    "Thomas Davenport",
    "Electric Motor",
    "DC Motor",
    "Commutator",
    "Electromagnetism",
    "Industrial Electrification",
  ],
  stats: {
    totalClaims: 2,
    independentClaims: 1,
    patentWarYears: "1835–1837",
    impactScore: 98,
  },
};
