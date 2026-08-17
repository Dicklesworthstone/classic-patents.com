import type { Patent } from "@/types/patent";

export const corlissSteamEnginePatent: Patent = {
  id: "us-6162-corliss-steam-engine",
  patentNumber: "US 6,162",
  title: "Improvement in Cut-Off and Working Valves of Steam-Engines",
  shortTitle: "Corliss Variable Cut-Off Valve Gear",
  subtitle:
    "Four Oscillating Rotary Valves, Centrifugal Governor Trip-Gear, and Pneumatic Dashpot Cutoff",
  inventors: ["George Henry Corliss"],
  inventorLocation: "Providence, Providence County, Rhode Island",
  grantDate: "1849-03-10",
  filingDate: "1848-11-20",
  era: "Early Republic & Industrial Dawn (1790–1830)",
  category: "materials",
  categoryLabel: "Thermodynamics & Steam Power",
  summary:
    "The 1849 thermodynamic triumph of the Industrial Revolution: George Corliss's four-valve steam engine with variable expansion trip-gear governed directly by a centrifugal flyball governor, snapping steam admission valves shut in milliseconds with pneumatic dashpots to expand steam adiabatically and cutting fuel consumption by over 30 percent.",
  heroQuote:
    "The cut-off of the steam is effected by releasing the valve from the mechanism that opened it, leaving it free to close instantly by weights or springs, the time of release being regulated by the governor according to the resistance on the engine...",
  originalPdfUrl: "/patents/pdfs/us-6162-corliss-steam-engine.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US6162/en",
  usptoClassification: "F01L 31/00 (Valve-gear with variable cut-off governed by engine speed)",
  originalText: `UNITED STATES PATENT OFFICE.
GEORGE H. CORLISS, OF PROVIDENCE, RHODE ISLAND.

IMPROVEMENT IN CUT-OFF AND WORKING VALVES OF STEAM-ENGINES.

Specification forming part of Letters Patent No. 6,162, dated March 10, 1849.

To all whom it may concern:
Be it known that I, GEORGE H. CORLISS, of the city and county of Providence, in the State of Rhode Island, have invented certain new and useful Improvements in the Valves and Cut-Off Mechanism of Steam-Engines, of which the following is a specification:

The principle of my invention consists in:
1. The employment of four separate oscillating cylindrical valves for each steam cylinder—two at the upper side for the admission of steam and two at the lower side for the exhaust—placed close to the cylinder bore to reduce clearance spaces to a minimum.
2. The combination with the steam admission valves of a disengaging or trip mechanism operated by the eccentric through a wrist-plate, whereby the valve is opened against the resistance of a weight, spring, or pneumatic dashpot, and at a variable point in the piston's stroke is released from the driving gear, allowing the dashpot to close the valve with extreme rapidity.
3. The regulation of the point of cut-off directly by the governor, which shifts the tripping cams according to the load on the engine, so that the steam is admitted at full boiler pressure and expanded to do work without throttling.

The construction comprises a central oscillating wrist-plate driven by an eccentric on the crankshaft. From this wrist-plate, four connecting rods extend to cranks on the four valve stems. The steam valve rods carry catch-hooks that engage the valve arms. As the wrist-plate rocks, the valve is opened; but a trip-lever connected to the centrifugal governor pushes the catch-hook out of engagement at a point determined by the engine speed. The instant the hook is tripped, an air-cushioned vacuum dashpot pulls the valve shut, instantly cutting off the steam supply.

The exhaust valves remain connected positively to the wrist-plate throughout the entire stroke, ensuring free and unrestricted exhaust into the condenser or atmosphere without back-pressure.

I claim as my invention:
1. The method of regulating the velocity of steam-engines by varying the point of cut-off of the steam by means of the governor, substantially as described.
2. The combination of the catch-hook trip mechanism with the steam admission valves and pneumatic dashpot for closing the valves rapidly when released.
3. The arrangement of four separate oscillating rotary valves situated at the four corners of the cylinder close to the bore.`,
  plainEnglishExplanation: {
    overview:
      "Before George Corliss, steam engines were throttled: a governor opened or choked a narrow neck valve in the steam pipe, wasting immense energy in friction and lowering steam pressure before it even entered the cylinder. Corliss realized that the only thermodynamic way to run an engine efficiently was to admit steam at full boiler pressure and temperature, then snap the valve shut partway through the stroke, letting the trapped steam expand adiabatically like a compressed spring to push the piston.",
    coreMechanism:
      "Corliss placed four independent rotary valves at the corners of the cylinder—two at the top for high-pressure steam admission and two at the bottom for exhaust, eliminating thermal cross-contamination and dead clearance volume. A central oscillating 'wrist-plate' rocks back and forth via an eccentric rod from the crankshaft. As the wrist-plate opens a steam valve, a catch-hook latches onto the valve arm. A centrifugal flyball governor continuously adjusts the height of a tripping wedge. When the catch-hook hits the wedge, it unlatches in a fraction of a millisecond, and a vacuum air-cushioned dashpot slams the valve shut. If the factory load increases, the governor lets the valve stay open longer; if load drops, the governor trips cutoff earlier ($10\\%\\text{ of stroke}$), maintaining perfectly constant engine speed.",
    mechanicalBreakdown: [
      {
        title: "Four-Valve Corner Geometry & Oscillating Plugs",
        summary: "Two top admission and two bottom exhaust rotary valves.",
        technicalDetails:
          "Four cylindrical oscillating valve plugs seated in transverse bores directly at the cylinder ends. This reduced parasitic clearance volume from $>10\\%$ to $<2.5\\%$ and kept cold exhaust steam ($100^\\circ\\text{C}$) separated from hot intake steam ($170^\\circ\\text{C}$), eliminating cylinder wall condensation losses.",
        archaicTerm: "Four separate oscillating cylindrical valves",
        modernEquivalent: "Corliss rotary oscillatory valves & multi-port heads",
      },
      {
        title: "Central Oscillating Wrist-Plate Linkage",
        summary: "Centrally mounted rocker plate creating non-linear dwell kinematics.",
        technicalDetails:
          "A disk pivoted at the cylinder center driven in harmonic oscillation by an eccentric. The link pin layout provides a non-linear toggle action: valves open rapidly when the link is near dead center, but dwell with near-zero motion when closed, reducing valve seat wear.",
        archaicTerm: "Oscillating wrist-plate or rocker disk",
        modernEquivalent: "Rotary kinematic wrist-plate distributor",
      },
      {
        title: "Governor-Regulated Variable Trip Cut-Off & Dashpot",
        summary: "Catch-hook unlatched by governor wedges; closed by vacuum dashpot.",
        technicalDetails:
          "The flyball governor adjusts the angular position of a trip cam. When released, an air dashpot with a vacuum cylinder pulls the valve closed in $<15\\text{ milliseconds}$. A bottom air-bleed needle valve provides a viscous air cushion that stops the valve without mechanical shock ($b_{\\text{damping}} = \\frac{\\Delta P A_{\\text{piston}}}{\\dot{x}}$).",
        archaicTerm: "Catch-hook trip mechanism and pneumatic dashpot",
        modernEquivalent: "Pneumatic dashpot trip-cutoff valve gear",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Thermodynamic Adiabatic Expansion Work",
        formula:
          "W_{\\text{expansion}} = \\int_{V_1}^{V_2} P(V) \\, dV = \\frac{P_1 V_1 - P_2 V_2}{\\gamma - 1}, \\quad P V^\\gamma = \\text{const}",
        explanation:
          "Cutting off steam admission early at $V_1$ allows the high-pressure steam to expand adiabatically to $V_2$, extracting additional mechanical boundary work from internal molecular heat energy without consuming additional boiler fuel.",
      },
      {
        principle: "Flyball Centrifugal Governor Dynamic Equilibrium",
        formula:
          "\\omega_{\\text{governor}}^2 r = g \\tan\\theta \\implies h = \\frac{g}{\\omega^2}",
        explanation:
          "The height $h$ of the rotating flyball governor varies inversely with the square of engine speed $\\omega$, mechanically translating speed changes into linear displacement that shifts the cutoff tripping cam.",
      },
      {
        principle: "Rankine Cycle Thermal Efficiency Maximization",
        formula:
          "\\eta = \\frac{W_{\\text{net}}}{Q_{\\text{in}}} = 1 - \\frac{h_{\\text{exhaust}} - h_{\\text{condensate}}}{h_{\\text{boiler}} - h_{\\text{feedwater}}}",
        explanation:
          "Admitting steam at full boiler pressure without throttling avoids irreversible throttling entropy generation ($\\Delta s_{\\text{throttle}} = -R \\ln(P_2/P_1)$), increasing overall thermal efficiency by $30\\text{ to }40\\%$.",
      },
    ],
    whyItMattersToday:
      "Corliss's principle of variable valve timing and unthrottled expansion is the direct ancestor of modern automotive variable valve timing (VTEC, VANOS, MultiAir) and electronic fuel injection cutoff. The massive 1,400-horsepower Centennial Corliss Engine powered all 8,000 machines at the 1876 World's Fair in Philadelphia, becoming the defining physical icon of the American Industrial Century.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "The method of regulating the velocity of steam-engines by varying the point of cut-off of the steam by means of the governor, substantially as described.",
      plainEnglish:
        "The pioneer master claim: controlling the speed of a steam engine by varying the point of expansion cutoff using the governor, rather than throttling the steam pipe.",
      keyInnovations: [
        "Governor-regulated variable expansion cutoff",
        "Unthrottled full-boiler-pressure steam admission",
        "Automatic thermodynamic load adaptation",
      ],
      legalSignificance:
        "One of the most valuable thermodynamic claims in patent history, granting Corliss a virtual monopoly on high-efficiency stationary steam power.",
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "The combination of the catch-hook trip mechanism with the steam admission valves and pneumatic dashpot for closing the valves rapidly when released.",
      plainEnglish:
        "Covers the catch-hook disengaging mechanism that releases the valve under governor control and the pneumatic dashpot that snaps it closed instantly.",
      keyInnovations: ["Disengaging catch-hook trip gear", "Air-cushioned vacuum dashpot closure"],
      legalSignificance:
        "Protected the mechanical trip mechanism that achieved sub-20ms valve closure without shattering valve seats.",
    },
    {
      number: 3,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "The arrangement of four separate oscillating rotary valves situated at the four corners of the cylinder close to the bore.",
      plainEnglish:
        "Specifies four independent oscillating valves located at the cylinder corners to minimize clearance volume and separate hot steam intake from cold exhaust.",
      keyInnovations: [
        "Four-valve corner arrangement",
        "Separated hot admission and cold exhaust ports",
        "Minimal parasitic clearance volume",
      ],
      legalSignificance:
        "Defined the physical cylinder architecture of all Corliss-type steam engines worldwide.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Side Elevation of Corliss Steam Cylinder & Valve Gear",
      caption:
        "Side view showing central oscillating wrist-plate, four corner valve stems, catch-hooks, governor linkage rods, and base dashpots.",
      svgType: "corliss-steam-engine",
      callouts: [
        {
          id: "ce-1",
          figureRef: "Fig. 1",
          label: "A",
          element: "Central Oscillating Wrist-Plate",
          description: "Rocking disk driven by crankshaft eccentric to operate valve rods.",
          x: 50,
          y: 50,
        },
        {
          id: "ce-2",
          figureRef: "Fig. 1",
          label: "B",
          element: "Top Steam Admission Valves & Catch-Hooks",
          description: "Oscillating rotary valves opened by hooks and tripped by governor cams.",
          x: 50,
          y: 20,
        },
        {
          id: "ce-3",
          figureRef: "Fig. 1",
          label: "C",
          element: "Bottom Exhaust Valves",
          description: "Separate bottom rotary valves providing unrestricted exhaust.",
          x: 50,
          y: 80,
        },
        {
          id: "ce-4",
          figureRef: "Fig. 1",
          label: "D",
          element: "Pneumatic Air-Cushion Dashpots",
          description: "Vacuum cylinders pulling released valves closed in milliseconds.",
          x: 25,
          y: 85,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "In the 1840s, factory steam engines were notoriously fuel-inefficient, burning cords of wood or tons of expensive coal because throttle governors choked the steam flow, reducing the pressure and thermodynamic availability of the steam before it reached the piston.",
    priorArtLimitations: [
      "Watt throttle governors placed a restrictor valve in the steam pipe, causing massive thermodynamic throttling irreversibilities.",
      "Slide valves forced hot fresh steam and cold wet exhaust through the same passages, chilling the cylinder walls and causing severe condensation.",
      "Fixed cutoff gears could not adapt to changing machine shop loads, causing engine speed to surge and sag.",
    ],
    breakthroughInsight:
      "Corliss recognized that the governor should not control *how much* the steam valve opened, but *how long* it stayed open before being snapped shut by a vacuum dashpot, ensuring that all steam entered at maximum boiler pressure and expanded cleanly.",
    patentWars: [
      {
        rivalName: "Zachariah Allen and Sickels",
        rivalClaim:
          "Frederick Sickels patented a drop cut-off in 1842; Allen claimed prior art on variable expansion gearing.",
        conflictDetails:
          "Corliss was sued for patent infringement by Sickels. Corliss vigorously defended his design in federal court, demonstrating that Sickels used poppet valves with lifting cams, whereas Corliss invented a complete system of four rotary oscillating valves integrated with a central wrist-plate and governor tripping cams.",
        resolution:
          "The courts ruled in Corliss's favor, recognizing his combination as a distinct and superior mechanical system. Corliss's business model was revolutionary: he offered to install his engines for free in textile mills in exchange for the cost of the coal saved over five years, earning massive fortunes as fuel bills dropped by $35\\%$ to $50\\%$.",
        legalOutcome:
          "Upheld Corliss's patents as the standard for high-efficiency stationary steam power.",
      },
    ],
    civilizationalImpact:
      "Corliss engines powered New England textile mills, water pumping stations, and industrial factories worldwide. In 1876, the monumental 700-ton Corliss Centennial Engine was started by President Ulysses S. Grant and Emperor Dom Pedro II of Brazil to open the Centennial Exposition, powering the entire 13-acre Machinery Hall.",
    funFact:
      "When Corliss offered to replace the steam engine at the James Steam Mills in Newburyport, Massachusetts, the mill owners were skeptical. Corliss offered to provide his engine for either $7,100 cash or the value of all coal saved over five years. The owners chose the savings option; Corliss earned nearly $20,000 in fuel savings checks!",
    aftermath:
      "George Corliss received the Rumford Medal from the American Academy of Arts and Sciences in 1870 and the Montyon Prize from the Institute of France. The Corliss Steam Engine Company in Providence, Rhode Island, grew into the largest engine manufacturing plant in the world.",
  },
  tags: [
    "George Corliss",
    "Steam Engine",
    "Thermodynamics",
    "Centennial Engine",
    "Industrial Revolution",
    "Variable Valve Timing",
  ],
  stats: {
    totalClaims: 3,
    independentClaims: 1,
    patentWarYears: "1849–1865",
    impactScore: 99,
  },
};
