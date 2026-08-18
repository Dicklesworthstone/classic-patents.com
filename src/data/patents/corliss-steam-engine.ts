import type { Patent } from "@/types/patent";
import { corlissSteamEngineArchivalEdition } from "../editions/corlissSteamEngineEdition";

export const corlissSteamEnginePatent: Patent = {
  id: "us-6162-corliss-steam-engine",
  patentNumber: "US 6,162",
  title: "Improvement in Cut-Off and Working Valves of Steam-Engines",
  shortTitle: "Governor-Controlled Slide-Valve Gear",
  subtitle: "Differential Rock-Shaft Motion and Governor-Released Expansion Cut-Off",
  inventors: ["George Henry Corliss"],
  inventorLocation: "Providence, Providence County, Rhode Island",
  grantDate: "1849-03-10",
  // Neither the reviewed grant nor the primary public record supplies a filing date.
  filingDate: null,
  era: "Early Republic & Industrial Dawn (1790–1830)",
  category: "materials",
  categoryLabel: "Thermodynamics & Steam Power",
  summary:
    "US 6,162 describes a tension-braced beam-engine frame, a rock shaft whose arms give unequal travel to paired slide valves, and a centrifugal governor that releases the steam-valve catches earlier as speed rises. The local facsimile is dated March 10, 1849 and records reissue No. 200 on May 13, 1851.",
  heroQuote:
    "The third part of my invention relates to the method of regulating the cut off, of the steam in the main slide valves.",
  originalPdfUrl: "/patents/pdfs/us-6162-corliss-steam-engine.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US6162A/en",
  usptoClassification:
    "Historical U.S. patent; no contemporary classification is printed on the local facsimile.",
  originalTextAsset: {
    url: "/patents/source-text/us-6162-corliss-steam-engine.txt",
    pageCount: 8,
    kind: "source-pdf-text-layer",
  },
  originalText: `UNITED STATES PATENT OFFICE.
GEO. H. CORLISS, OF PROVIDENCE, RHODE ISLAND.

CUT-OFF AND WORKING THE VALVES OF STEAM-ENGINES.

Specification forming part of Letters Patent No. 6,162, dated March 10, 1849; Reissued May 13, 1851, No. 200.

To all whom it may concern:
Be it known that I, GEORGE H. CORLISS, of the city and county of Providence and State of Rhode Island, have invented certain new and useful Improvements in Steam-Engines; and that the following is a full, clear, and exact description of the principle or character which distinguishes them from all other things before known and of the manner of making, constructing, and using the same, reference being had to the accompanying drawings, making part of this specification, in which—`,
  archivalEdition: corlissSteamEngineArchivalEdition,
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
      {
        title: "Pneumatic Vacuum Dashpot & Compression Snubber",
        summary:
          "Dual-chamber springless actuator slamming valves shut and providing hydraulic cushioning.",
        technicalDetails:
          "A vertical cylinder containing a close-fitting bronze plunger. The upper chamber pulls a high vacuum ($P < 20\\text{ kPa}$) during valve opening to supply rapid closing acceleration, while the lower chamber compresses entrapped air through an adjustable needle orifice to cushion the final $5\\text{ mm}$ of travel without seat bounce.",
        archaicTerm: "Air-cushion dash-pot or closing cylinder",
        modernEquivalent: "Pneumatic vacuum return actuator & air snubber",
      },
      {
        title: "Steam-Jacketed Cylinder Casting & Corner Ports",
        summary:
          "Double-walled iron jacket maintaining cylinder temperature and isolating thermal domains.",
        technicalDetails:
          "Live boiler steam circulates through an outer annular jacket ($t = 25\\text{ mm}$) encasing the working cylinder, keeping the inner iron walls above saturation temperature ($T_{\\text{wall}} \\approx 175^\\circ\\text{C}$). Independent short corner ports reduce internal clearance volume to $<2.0\\%$, minimizing wasted re-compression work.",
        archaicTerm: "Steam-casing or jacket surrounding the cylinder",
        modernEquivalent: "Steam-jacketed cylinder barrel & low-clearance porting",
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
      {
        principle: "Wall Condensation Irreversibility & Heat Transfer Barrier",
        formula:
          "\\dot{Q}_{\\text{loss}} = h_{\\text{film}} A_{\\text{wall}} (T_{\\text{steam}} - T_{\\text{wall}}), \\quad m_{\\text{condensed}} = \\frac{\\dot{Q}_{\\text{loss}} \\Delta t}{h_{fg}}",
        explanation:
          "Separating cold exhaust passage routes from hot intake ports prevents cyclic cooling of cylinder head surfaces, eliminating initial condensation where up to 40% of fresh boiler steam would otherwise liquefy uselessly on cold iron.",
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
        "The method, substantially as described, of operating the slide valves of steam engines by connecting the valves that govern the ports at opposite ends of the cylinder, with separate arms of the rock shaft, or the mechanical equivalents thereof, so that from the motion thereof the valve that keeps its port or ports closed shall move over a less space while its port or ports is closed than the one that is opening or closing its port, or ports, and vice versa, while at the same time the two arms by which they are operated have the same range of motion, as described, whereby I am enabled to save much of the power heretofore required to work the slide valves of steam engines, and by which also I am enabled to give a greater range of motion to the valves at the periods of opening and closing the ports to facilitate the induction and eduction of steam, as specified.",
      plainEnglish:
        "Claim 1 covers the differential-motion arrangement: separate arms on one rock shaft operate opposite-end slide valves, but the closed valve receives less travel while it stays shut. The opening or closing valve receives more travel even though both arms swing through the same range, reducing force spent moving a pressure-loaded closed valve while keeping port events rapid.",
      keyInnovations: [
        "Separate rock-shaft arms",
        "Differential valve travel",
        "Rapid induction and eduction",
      ],
      legalSignificance:
        "The claim is limited to the stated relation between the separate rock-shaft arms and the slide valves; it is not a blanket claim to every steam-engine governor.",
    },
    {
      number: 2,
      isIndependent: true,
      originalText:
        "And lastly I claim the method of regulating the motion of steam engines by means of the centrifugal regulator by combining the said regulator with the catches that liberate the steam valves by means of movable cams or stops, substantially as described.",
      plainEnglish:
        "Claim 2 covers speed regulation by combining the centrifugal governor with the catches that release the admission valves, using movable cams or stops. When speed changes, the governor changes when the catch releases, thereby changing the point of steam cut-off.",
      keyInnovations: ["Centrifugal regulator", "Valve-release catches", "Movable cams or stops"],
      legalSignificance:
        "This is a separate method claim. Its legal work is the governor-to-catch-to-movable-cam connection, not merely the use of a governor near a steam engine.",
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
    totalClaims: 2,
    independentClaims: 2,
  },
};
