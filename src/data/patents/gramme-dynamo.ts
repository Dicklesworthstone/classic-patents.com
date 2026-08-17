import type { Patent } from "@/types/patent";

export const grammeDynamoPatent: Patent = {
  id: "us-120057-gramme-dynamo",
  patentNumber: "US 120,057",
  title: "Improvement in Magneto-Electric Machines",
  shortTitle: "Gramme Ring Continuous DC Dynamo",
  subtitle:
    "Toroidal Ring Armature, Closed-Loop Multitap Winding, and Smooth Continuous DC Generation",
  inventors: ["Zénobe Théophile Gramme"],
  inventorLocation: "Paris, Republic of France",
  grantDate: "1871-10-17",
  filingDate: "1871-08-17",
  era: "Civil War & Industrial Acceleration (1860–1880)",
  category: "electricity",
  categoryLabel: "Electromagnetic Generators & Power Systems",
  summary:
    "The 1871 electrical watershed that launched industrial electrification: Zénobe Gramme's ring dynamo utilizing a soft-iron toroidal ring armature wrapped with an endless continuous copper winding tapped at multiple commutator segments, generating smooth, non-pulsating direct current with high thermodynamic efficiency and discovering electric motor reversibility.",
  heroQuote:
    "The armature consists of a ring of soft iron wound continuously with insulated wire in a series of distinct coils... from the junctions of which conductors lead to the commutator sectors, producing a continuous and non-fluctuating electric current.",
  originalPdfUrl: "/patents/pdfs/us-120057-gramme-dynamo.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US120057/en",
  usptoClassification: "H02K 3/04 (Windings for dynamos; Toroidal ring armatures)",
  originalTextAsset: {
    url: "/patents/source-text/us-120057-gramme-dynamo.txt",
    pageCount: 9,
    kind: "source-pdf-text-layer",
  },
  originalText: `UNITED STATES PATENT OFFICE.
ZÉNOBE THÉOPHILE GRAMME, OF PARIS, FRANCE.

IMPROVEMENT IN MAGNETO-ELECTRIC MACHINES.

Specification forming part of Letters Patent No. 120,057, dated October 17, 1871.

To all whom it may concern:
Be it known that I, ZÉNOBE THÉOPHILE GRAMME, of Paris, in the Republic of France, have invented an Improved Magneto-Electric Machine for Generating Continuous Currents, of which the following is a specification:

My invention consists in a new construction of the armature of magneto-electric and dynamo-electric machines, by means of which an electric current is generated that is continuous and constant in intensity and direction, without the sudden pulsations, heating, and sparking that have characterized prior machines.

The construction of the machine comprises:
1. An armature formed of a continuous ring or hollow cylinder of soft iron or a bundle of soft iron wires, mounted to revolve upon a central shaft between the poles of a permanent magnet or electromagnet.
2. An insulated copper wire wound continuously around said iron ring in an endless helix, divided into a large number of distinct, symmetrical sections or coils.
3. A cylindrical commutator mounted on the shaft, composed of a number of metallic sectors or bars equal to the number of coil sections on the ring, each sector being electrically connected to the junction between two adjacent coils.
4. Two collecting brushes or rub-contacts pressing against the commutator sectors at diametrically opposite points aligned with the neutral magnetic plane.

As the iron ring rotates between the magnetic poles, the lines of magnetic force entering the outer surface of the ring divide and travel circumferentially through the soft iron toward the opposite pole. The rotation of the ring continuously cuts these magnetic lines of force, inducing electromotive forces in the individual coil sections.

Because the winding is endless and connected in two symmetrical parallel paths between the opposite brushes, the individual voltages of all the active coils in each half of the ring add together in series, producing a high and perfectly continuous direct current at the terminals, free from the destructive pulsations of earlier shuttle armatures.

I claim as my invention:
1. An armature for magneto-electric or dynamo-electric machines, consisting of an endless soft-iron ring wound continuously with insulated wire, tapped at regular intervals to commutator segments, substantially as described.
2. The combination with said ring armature of the multi-segment commutator and brushes arranged to collect continuous direct current from two parallel series-connected circuits.`,
  plainEnglishExplanation: {
    overview:
      "Before Zénobe Gramme, electric generators were crude devices with two-pole 'shuttle' armatures (like the Siemens H-armature). They produced violent, pulsating current spikes that generated massive inductive sparks at the brushes, overheated the iron core with eddy currents, and were incapable of powering commercial lighting or industrial machines. Belgian electrical genius Zénobe Gramme invented the toroidal 'ring armature,' which divided the magnetic circuit into two smooth, continuous parallel electrical loops, producing the world's first steady, high-power DC electricity.",
    coreMechanism:
      "A soft-iron ring made of bundled iron wires rotates between the north and south poles of a stationary electromagnet. Magnetic flux lines ($\\Phi$) from the north pole enter the iron ring, split into two equal paths flowing clockwise and counter-clockwise through the top and bottom halves of the ring, and exit into the south pole. An endless helix of insulated copper wire is wound tightly around the ring and divided into 32 to 64 sections, with each tap connected to a commutator bar. As the ring spins, the coils on one side generate an upward EMF while coils on the other generate a downward EMF. The commutator taps sum these small incremental voltages in series, creating a smooth DC voltage at the brushes with less than $2\\%$ ripple, operating at unprecedented electrical efficiencies ($>85\\%$).",
    mechanicalBreakdown: [
      {
        title: "Toroidal Laminated Soft-Iron Core Ring",
        summary: "Circular ring of varnished soft-iron wires channeling magnetic flux.",
        technicalDetails:
          "Formed from a bundle of mutually insulated $1\\text{ mm}$ soft-iron wires to suppress eddy currents ($\\dot{q}_{\\text{eddy}} \\propto f^2 B^2 t_{\\text{wire}}^2$). The high magnetic permeability ($\\mu_r > 2,000$) concentrates the magnetic flux within the ring walls ($B = 1.2\\text{ to }1.5\\text{ Tesla}$).",
        archaicTerm: "Continuous ring or hollow cylinder of soft iron",
        modernEquivalent: "Laminated toroidal armature core / Ring core rotor",
      },
      {
        title: "Endless Multitap Closed-Loop Helix Winding",
        summary: "Continuous closed copper winding divided into series-parallel sections.",
        technicalDetails:
          "Insulated copper wire wound in a continuous closed loop of $N = 32\\text{ to }64$ equal coils. Taps from every junction link directly to copper commutator segments, forming two symmetrical parallel circuits that halve internal armature resistance ($R_{\\text{armature}} = \\frac{1}{4} R_{\\text{total wire}}$).",
        archaicTerm: "Insulated copper wire wound in an endless helix",
        modernEquivalent: "Gramme ring winding / Closed-loop distributed DC armature",
      },
      {
        title: "Multi-Segment Commutator & Neutral Axis Brushes",
        summary: "Radial copper commutator sectors and copper gauze collector brushes.",
        technicalDetails:
          "Radial copper sectors insulated with mica sheets. Copper leaf brushes rest against the neutral magnetic axis ($90^\\circ$ to the pole axis), extracting continuous current while individual coil commutations occur at zero-crossing flux points ($d\\Phi/dt = 0$), eliminating destructive contact arcing.",
        archaicTerm: "Commutator sectors and collecting rub-contacts",
        modernEquivalent: "Multi-bar commutator & neutral plane brushes",
      },
      {
        title: "Self-Excited Horseshoe Field Electromagnet",
        summary:
          "Massive cast-iron stator core wound with series/shunt coils producing intense working flux.",
        technicalDetails:
          "Two curved cast-iron pole pieces embrace the toroidal ring with a narrow $3.0\\text{ mm}$ air gap. Residual magnetism in the iron core bootstraps self-excitation upon spin-up, building the magnetic field up to saturation ($B_{\\text{gap}} \\approx 0.95\\text{ Tesla}$) without requiring separate battery excitation.",
        archaicTerm: "Electro-magnets forming the stationary magnetic field",
        modernEquivalent: "Self-excited stator field poles & shunt field coils",
      },
      {
        title: "Non-Magnetic Brass Spider Hub & Central Shaft",
        summary:
          "Phosphor-bronze multi-arm spider mounting the iron ring without magnetic short-circuits.",
        technicalDetails:
          "The soft-iron wire ring is clamped by an eight-armed cast-brass spider hub keyed to the steel drive shaft. Using non-ferromagnetic bronze prevents the shaft from shunting magnetic flux away from the working copper coils, preserving $98\\%$ of the pole flux within the active copper winding envelope.",
        archaicTerm: "Brass spider or carrier securing the ring to the shaft",
        modernEquivalent: "Non-magnetic rotor carrier spider & drive shaft hub",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Faraday Induction in Distributed Parallel Circuits",
        formula:
          "\\mathcal{E}_{\\text{DC}} = \\frac{p \\cdot Z \\cdot \\Phi \\cdot N_{\\text{rpm}}}{60 \\cdot a}, \\quad a = 2 \\; (\\text{parallel paths})",
        explanation:
          "Total generated DC voltage is the sum of instantaneous induced EMFs across $Z$ conductors rotating through magnetic flux $\\Phi$, divided into $a = 2$ parallel branches.",
      },
      {
        principle: "Commutator Voltage Ripple Suppression",
        formula:
          "\\text{Ripple P-P} = V_{\\text{max}} \\left(1 - \\cos\\left(\\frac{\\pi}{N_{\\text{bars}}}\\right)\\right) \\approx \\frac{\\pi^2}{2 N_{\\text{bars}}^2}",
        explanation:
          "Increasing the number of commutator segments $N_{\\text{bars}}$ from 2 to 32 suppresses voltage ripple from $100\\%$ down to under $0.5\\%$, converting pulsating AC spikes into clean direct current.",
      },
      {
        principle: "Reversibility of Electric Dynamos (Motor-Generator Duality)",
        formula:
          "P_{\\text{mech}} = \\tau \\cdot \\omega \\longleftrightarrow P_{\\text{elec}} = V \\cdot I - I^2 R",
        explanation:
          "The Gramme ring revealed that the dynamo is completely reversible: supplying mechanical shaft work generates electrical power, while feeding battery current into the brushes generates powerful mechanical torque.",
      },
      {
        principle: "Armature Reaction & Neutral Plane Angular Shift",
        formula:
          "\\theta_{\\text{brush}} = \\arctan\\left(\\frac{\\mathcal{F}_{\\text{armature}}}{\\mathcal{F}_{\\text{field}}}\\right) = \\arctan\\left(\\frac{Z I_a / 2 a}{2 N_f I_f}\\right)",
        explanation:
          "Current circulating in the armature conductors generates a cross-magnetizing MMF that distorts the main stator field, shifting the sparkless commutation neutral axis forward in generators and backward in motors.",
      },
    ],
    whyItMattersToday:
      "The Gramme Ring Dynamo was the machine that launched the electrical age. It powered the first arc-light grids in Paris, London, and New York, drove the first electric railways, and enabled commercial electroplating. In 1873 at the Vienna Exhibition, Gramme's engineer Hippolyte Fontaine accidentally connected one Gramme machine to another 2 kilometers away, discovering the electrical transmission of power across distance.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "An armature for magneto-electric or dynamo-electric machines, consisting of an endless soft-iron ring wound continuously with insulated wire, tapped at regular intervals to commutator segments, substantially as described.",
      plainEnglish:
        "Master pioneer claim covering an endless soft-iron ring wound with continuous insulated wire tapped at regular intervals to commutator segments to generate non-pulsating continuous DC current.",
      keyInnovations: [
        "Toroidal soft-iron ring armature",
        "Endless closed-loop multi-section winding",
        "Multitap commutator connection",
      ],
      legalSignificance:
        "The foundational claim for modern direct-current dynamos and motors, revolutionizing electrical engineering worldwide.",
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "The combination with said ring armature of the multi-segment commutator and brushes arranged to collect continuous direct current from two parallel series-connected circuits.",
      plainEnglish:
        "Specifies the combination of the ring winding with a multi-segment commutator and diametric brushes to extract current from two parallel circuits with minimal ripple and sparking.",
      keyInnovations: [
        "Two-circuit parallel series voltage summing",
        "Zero-plane sparkless current collection",
      ],
      legalSignificance:
        "Protected the parallel electrical circuit architecture that allowed dynamos to produce high amperage without burning out windings.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Plan and Magnetic Cross-Section of Gramme Ring Dynamo",
      caption:
        "Sectional drawing showing stationary pole pieces, soft-iron ring armature core, continuous helical coil sections, radial commutator taps, and brushes.",
      svgType: "gramme-dynamo",
      callouts: [
        {
          id: "gd-1",
          figureRef: "Fig. 1",
          label: "A",
          element: "Toroidal Soft-Iron Core Ring",
          description: "Laminated ring conducting magnetic flux between stator poles.",
          x: 50,
          y: 50,
        },
        {
          id: "gd-2",
          figureRef: "Fig. 1",
          label: "B",
          element: "Continuous Multitap Coil Sections",
          description: "Endless copper helix divided into 32 tapped series sections.",
          x: 50,
          y: 25,
        },
        {
          id: "gd-3",
          figureRef: "Fig. 1",
          label: "C",
          element: "Multi-Segment Commutator",
          description: "Radial copper bars connecting coil junctions to brushes.",
          x: 50,
          y: 75,
        },
        {
          id: "gd-4",
          figureRef: "Fig. 1",
          label: "D",
          element: "Stationary Magnet Pole Shoes",
          description: "North and South stator poles creating radial magnetic field.",
          x: 15,
          y: 50,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "In 1870, industrial electricity was severely bottlenecked: factories relied entirely on expensive, messy chemical batteries (like Bunsen and Daniell cells) because existing magneto generators produced wildly pulsating, spark-laden currents that melted brushes and ruined copper coils through overheating.",
    priorArtLimitations: [
      "Siemens H-shuttle armatures (1856) concentrated all copper wire in two deep slots, producing extreme inductive voltage spikes and heavy eddy-current heating.",
      "Wilde's and Holmes's dynamos suffered severe commutation sparking and required frequent water cooling.",
      "Efficiency of early dynamos was less than 30%, making electrical generation far more expensive than steam or gas power.",
    ],
    breakthroughInsight:
      "Zénobe Gramme, a self-taught Belgian carpenter working in Paris as a model-maker for electrical firm Alliance, envisioned the magnetic field flowing through an iron ring like water around a circular canal, realizing that a continuous toroidal winding would generate constant, ripple-free voltage as it turned.",
    patentWars: [
      {
        rivalName: "Antonio Pacinotti and Werner von Siemens",
        rivalClaim:
          "Italian physicist Antonio Pacinotti published an academic description of a toothed ring armature in Il Nuovo Cimento in 1865, claiming priority over Gramme.",
        conflictDetails:
          "Pacinotti had built a small laboratory model in Pisa but never commercialized or patented it. When Gramme patented his practical industrial ring dynamo in France (1870), Britain (1870), and the US (1871), the Société des Machines Magnéto-Électriques Gramme was formed in Paris.",
        resolution:
          "Pacinotti received academic recognition as the theoretical precursor, but courts and patent offices worldwide upheld Gramme's patent because Gramme independently solved the practical engineering of continuous closed-loop winding, multi-segment commutation, and industrial manufacturing.",
        legalOutcome:
          "Gramme held the core international patents for industrial DC electrical generation throughout the 1870s.",
      },
    ],
    civilizationalImpact:
      "The Gramme dynamo turned electricity into a major global industry. In 1878, Gramme dynamos powered the legendary Jablochkoff 'Electric Candles' illuminating the Avenue de l'Opéra in Paris during the Exposition Universelle, dazzling the world and inspiring Thomas Edison to pursue incandescent lighting.",
    funFact:
      "Zénobe Gramme had no formal education in physics or mathematics and struggled to write standard French. When elite French academics at the Académie des Sciences questioned his mathematical calculations, Gramme smiled and pointed to his humming dynamo powering an array of blinding arc lamps, stating: 'The machine knows more mathematics than all of us!'",
    aftermath:
      "Gramme was awarded the Grand Cross of the Legion of Honor and the 50,000-franc Volta Prize by the French Government in 1888. The International Electrotechnical Commission erected a monument to Gramme at the Montefiore Institute in Liège, Belgium.",
  },
  tags: [
    "Zénobe Gramme",
    "Dynamo",
    "Electric Generator",
    "Toroidal Armature",
    "Electromagnetism",
    "Industrial Electrification",
  ],
  stats: {
    totalClaims: 2,
    independentClaims: 1,
    patentWarYears: "1871–1878",
    impactScore: 100,
  },
};
