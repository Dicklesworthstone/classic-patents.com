import type { Patent } from "@/types/patent";

export const wrightFlyerPatent: Patent = {
  id: "us-821393-wright-flyer",
  patentNumber: "US 821,393",
  title: "Flying-Machine",
  shortTitle: "The Wright Flyer",
  subtitle: "3-Axis Aerodynamic Flight Control via Wing-Warping and Synchronized Rudder",
  inventors: ["Orville Wright", "Wilbur Wright"],
  inventorLocation: "Dayton, Ohio",
  grantDate: "1906-05-22",
  filingDate: "1903-03-23",
  era: "Early Aviation (1900–1910)",
  category: "aviation",
  categoryLabel: "Aviation & Aerodynamics",
  summary:
    "The foundational patent of practical aviation. The Wright brothers solved the primary obstacle to human flight: dynamic equilibrium and aerodynamic control in three dimensions (pitch, roll, and yaw). Rather than relying on rigid wings and weight-shifting, they invented a mechanism to warp the flexible lateral tips of biplane wings while simultaneously coordinating a vertical movable rudder to counteract adverse yaw.",
  heroQuote:
    "Be it known that we, Orville Wright and Wilbur Wright, citizens of the United States, residing at Dayton, in the county of Montgomery and State of Ohio, have invented certain new and useful Improvements in Flying-Machines...",
  originalPdfUrl: "/patents/pdfs/us-821393-wright-flyer.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US821393A/en",
  usptoClassification: "B64C 13/00 (Aeronautics; Aircraft control systems)",
  originalText: `UNITED STATES PATENT OFFICE.
ORVILLE WRIGHT AND WILBUR WRIGHT, OF DAYTON, OHIO.

FLYING-MACHINE.

No. 821,393. Specification of Letters Patent. Patented May 22, 1906.
Application filed March 23, 1903. Serial No. 149,220.

To all whom it may concern:
Be it known that we, ORVILLE WRIGHT and WILBUR WRIGHT, citizens of the United States, residing at Dayton, in the county of Montgomery and State of Ohio, have invented certain new and useful Improvements in Flying-Machines, of which the following is a specification.

Our invention relates to that class of flying-machines in which the weight is sustained by the reactions resulting when one or more aeroplanes are moved through the air downwardly and forwardly at a small angle of incidence, either by the application of mechanical power or by the utilization of the force of gravity.

The objects of our invention are, first, to provide means for maintaining or restoring the equilibrium or lateral balance of the apparatus; second, to provide means for guiding the machine in both vertical and horizontal directions; and, third, to provide a structure combining lightness, strength, convenience of construction, and certain other advantageous features in points of detail.

In flying-machines of the character to which this invention relates it is necessary to provide means for maintaining or restoring the lateral balance or equilibrium of the apparatus, and to this end we construct the aeroplanes of superposed flexible surfaces connected together by upright posts pivoted to the surfaces, and we provide cables and operating mechanisms connected to the outer marginal portions of the aeroplanes, whereby the lateral margins of the aeroplanes may be twisted or warped in opposite directions...`,
  plainEnglishExplanation: {
    overview:
      "Before the Wright brothers, pioneer aviators like Otto Lilienthal and Samuel Langley assumed that flying was an engine problem or a matter of static inherent stability (like a ship righting itself in water). The Wrights realized that flight was fundamentally an active aerodynamic equilibrium and control problem in turbulent three-dimensional fluid. Their invention provided complete authority over pitch (nose up/down), roll (banking left/right), and yaw (nose left/right).",
    coreMechanism:
      "By twisting (warping) the trailing edges of the flexible wings in opposite directions, one wing generates more aerodynamic lift and more induced drag than the other, causing the aircraft to bank into a roll. To prevent the higher-drag wing from pulling the nose in the wrong direction (adverse yaw), the Wrights interconnected the wing-warping cables directly to a movable vertical rear rudder, creating the first synchronized 3-axis flight control system in history.",
    mechanicalBreakdown: [
      {
        title: "Differential Wing Warping (Roll Control)",
        summary: "Twisting the flexible outer tips of biplane wings in opposite directions.",
        technicalDetails:
          "Cables running from a cradle operated by the pilot's hips pulled the rear wingtips. The right wing tip twisted to increase its angle of attack (generating higher lift), while the left wing tip twisted downward to decrease its angle of attack (generating lower lift). This differential lift produced a rolling moment ($M_x = \\Delta L \\cdot b/2$).",
        archaicTerm: "Superposed flexible aeroplanes",
        modernEquivalent: "Biplane wings with ailerons",
      },
      {
        title: "Coordinated Vertical Rudder (Yaw Control & Adverse Yaw Solution)",
        summary: "A movable vertical rudder tied directly to the wing-warping mechanism.",
        technicalDetails:
          "Increasing the angle of attack on the high-lift wing inherently increased induced drag ($C_{Di} = C_L^2 / \\pi AR$). This drag caused the airplane to yaw away from the turn—a dangerous phenomenon known as adverse yaw, which had caused previous glider crashes. The Wrights solved this by mechanically linking the wing-warping cradle to the rear vertical rudder, deflecting the rudder into the turn to neutralize adverse yaw.",
        archaicTerm: "Vertical rudder",
        modernEquivalent: "Movable vertical stabilizer / rudder",
      },
      {
        title: "Forward Elevator (Pitch Control)",
        summary: "A horizontal surface placed ahead of the main wings (canard configuration).",
        technicalDetails:
          "Operated by a hand lever, the forward canard elevator adjusted the pitch angle of attack relative to the relative wind ($M_y = L_{canard} \\cdot x_{cg}$). Placing it in front ensured that the aircraft was dynamically controllable and provided early stall recovery.",
        archaicTerm: "Horizontal rudder",
        modernEquivalent: "Canard / horizontal stabilizer & elevator",
      },
      {
        title: "Flexible Truss & Universal Pivots",
        summary: "A biplane box-truss built with flexible ash and spruce struts and piano wire.",
        technicalDetails:
          "Instead of a rigid truss, the vertical struts were connected to the wing spars with universal pivot joints. This allowed the entire biplane structure to twist helical-fashion without fracturing the structural spars or snapping diagonal guy wires.",
        archaicTerm: "Upright posts pivoted to the surfaces",
        modernEquivalent: "Articulated wing spar trusses",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Aerodynamic Lift & Angle of Attack",
        formula: "L = \\frac{1}{2} \\rho V^2 S C_L(\\alpha)",
        explanation:
          "Lift is directly proportional to air density (\\rho), airspeed squared (V^2), wing area (S), and the lift coefficient as a function of the angle of attack (\\alpha). Wing warping dynamically alters \\alpha across the wingspan.",
      },
      {
        principle: "Induced Drag & Adverse Yaw",
        formula: "C_{Di} = \\frac{C_L^2}{\\pi \\cdot e \\cdot AR}",
        explanation:
          "Because induced drag scales with the square of the lift coefficient, the wing generating greater lift experiences substantially more drag, creating an adverse yawing moment that must be counteracted by rudder deflection.",
      },
    ],
    whyItMattersToday:
      "Every modern aircraft flying today—from a Cessna 172 to a Boeing 787 Dreamliner and supersonic fighter jets—uses the exact three-axis aerodynamic flight control principle invented and patented by the Wright brothers. While modern planes use hinged ailerons and fly-by-wire flight control computers instead of cable-pulled wing warping, the fundamental physics and coordinated roll-yaw coupling remain identical.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "In a flying-machine, a normally flat aeroplane having lateral marginal portions capable of being adjusted to different angles of incidence at the opposite sides of the machine, or in opposite directions on the same side, substantially as described.",
      plainEnglish:
        "Asserts broad ownership over any flying machine capable of twisting or adjusting its wing tips to different angles of attack on opposite sides to achieve lateral roll control.",
      keyInnovations: ["Differential angle of attack", "Lateral balance control", "Wing warping"],
      legalSignificance:
        "The broadest and most aggressive claim in aviation history. The Wrights used Claim 1 in court to argue that even hinged ailerons (invented by Glenn Curtiss and Alberto Santos-Dumont) infringed their patent because they adjusted the lateral margins to different angles of incidence.",
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "In a flying-machine, the combination, with two superposed aeroplanes, of upright posts pivotally connected to both aeroplanes, and means for flexing the lateral marginal portions of the aeroplanes to different angles of incidence, substantially as described.",
      plainEnglish:
        "Specifies a biplane structure with pivoting vertical struts and cables to twist the upper and lower wings simultaneously.",
      keyInnovations: ["Biplane box-truss", "Pivoting struts", "Helical wing deformation"],
      legalSignificance:
        "Protected the specific mechanical construction of the 1902 glider and 1903 Flyer.",
    },
    {
      number: 3,
      isIndependent: true,
      originalText:
        "In a flying-machine, the combination, with an aeroplane, and means for simultaneously moving the lateral marginal portions thereof to different angles of incidence, of a vertical rudder, and means for operating said rudder in conjunction with the movement of the lateral margins of the aeroplane, substantially as described.",
      plainEnglish:
        "Protects the combination of wing warping with a vertical rudder operated in coordination to counteract adverse yaw during a turn.",
      keyInnovations: [
        "Coordinated rudder",
        "Adverse yaw compensation",
        "Integrated roll-yaw control",
      ],
      legalSignificance:
        "The scientific cornerstone of the patent. Proved to the courts that the Wrights did not just invent wing twisting, but discovered the fundamental aerodynamic law linking roll and yaw in banking turns.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Perspective View of the Flying Machine",
      caption:
        "Overall perspective view showing the biplane wings, forward elevator (horizontal rudder), and rear vertical rudder.",
      svgType: "wright-flyer",
      callouts: [
        {
          id: "wf-1",
          figureRef: "Fig. 1",
          label: "1",
          element: "Upper Aeroplane",
          description:
            "Upper flexible lifting surface constructed of fabric stretched over flexible wooden spars.",
          x: 48,
          y: 28,
        },
        {
          id: "wf-2",
          figureRef: "Fig. 1",
          label: "2",
          element: "Lower Aeroplane",
          description: "Lower lifting surface carrying the pilot cradle and engine mountings.",
          x: 48,
          y: 62,
        },
        {
          id: "wf-3",
          figureRef: "Fig. 1",
          label: "19",
          element: "Forward Elevator",
          description:
            "Horizontal elevator (canard) used for controlling pitch attitude and angle of attack.",
          x: 18,
          y: 46,
        },
        {
          id: "wf-4",
          figureRef: "Fig. 1",
          label: "22",
          element: "Vertical Rudder",
          description:
            "Rear vertical rudder linked to the warping cradle to counteract adverse yaw.",
          x: 82,
          y: 44,
        },
        {
          id: "wf-5",
          figureRef: "Fig. 1",
          label: "12",
          element: "Warping Cable",
          description: "Control wire leading from the hip cradle to the rear outer wing posts.",
          x: 64,
          y: 38,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "In the late 1890s, hundreds of aviators were killed or injured because their gliders were inherently unstable in gusts. When an aircraft tipped sideways, it suffered a catastrophic sideslip and nose-dive that pilots could not correct by swinging their bodies.",
    priorArtLimitations: [
      "Otto Lilienthal relied on body-shifting to shift the center of gravity; this had insufficient control authority in gusts and killed him in 1896.",
      "Hiram Maxim and Samuel Langley built massive powered machines with rigid wings that possessed zero active roll control.",
      "Octave Chanute built biplane gliders with swinging wings that were too sluggish to handle turbulent wind shears.",
    ],
    breakthroughInsight:
      "While observing buzzards and twisting an empty bicycle inner-tube box in their Dayton shop, Wilbur Wright realized that birds do not shift weight—they actively bank into turns by twisting the tips of their wings to generate differential aerodynamic lift.",
    patentWars: [
      {
        rivalName: "Glenn H. Curtiss (Aerial Experiment Association)",
        rivalClaim:
          "Curtiss used separate hinged surfaces placed between the wings (ailerons) rather than twisting the main wing structure, arguing he did not infringe the Wrights' wing-warping patent.",
        conflictDetails:
          "The Wrights sued Curtiss in 1909 for patent infringement under Claim 1 and Claim 3, claiming that any device creating differential angles of attack on opposite wingtips was legally equivalent to wing-warping.",
        resolution:
          "After years of bitter litigation that consumed Wilbur's health, federal courts repeatedly ruled in favor of the Wrights in 1913 and 1914, establishing that the Wright patent was a pioneering patent entitled to broad construction.",
        legalOutcome:
          "The patent war severely crippled American aviation on the eve of World War I. In 1917, under pressure from the US Navy and Assistant Secretary Franklin D. Roosevelt, the Manufacturers Aircraft Association was formed to cross-license all aviation patents for a flat royalty fee per airplane.",
      },
    ],
    civilizationalImpact:
      "US Patent 821,393 transformed flight from an impossible fantasy and deadly stunt into a predictable, engineered discipline, paving the way for global passenger aviation, international commerce, and modern aerospace exploration.",
    funFact:
      "The patent was filed on March 23, 1903—nine months BEFORE the historic powered flight at Kitty Hawk on December 17, 1903. The patent was based on their successful 1902 unpowered glider!",
  },
  tags: [
    "Aviation",
    "Wright Brothers",
    "Aerodynamics",
    "Flight Control",
    "Wing Warping",
    "Pioneer Patent",
  ],
  stats: {
    totalClaims: 18,
    independentClaims: 3,
    patentWarYears: "1909–1917",
    impactScore: 100,
  },
};
