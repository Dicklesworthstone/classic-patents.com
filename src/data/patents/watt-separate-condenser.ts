import type { Patent } from "@/types/patent";
import {
  manualWattClaimText,
  wattSeparateCondenserArchivalEdition,
} from "../editions/wattSeparateCondenserEdition";

const wattFigureCallouts: Record<
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
      id: "wt-boiler",
      figureRef: "Fig. 1",
      label: "Boiler (A)",
      element: "A",
      description:
        "Low-pressure copper/iron waggon boiler supplying saturated steam to the engine at 2–5 psi gauge pressure.",
      x: 16,
      y: 78,
    },
    {
      id: "wt-steam-jacket",
      figureRef: "Fig. 1",
      label: "Steam Jacket (B)",
      element: "B",
      description:
        "Concentric outer jacket filled with live boiler steam, keeping the inner cast-iron cylinder walls continuously at 100°C+ to prevent cyclic thermal quenching.",
      x: 28,
      y: 45,
    },
    {
      id: "wt-piston",
      figureRef: "Fig. 1",
      label: "Working Piston (C)",
      element: "C",
      description:
        "Cast-iron piston fitted inside cylinder and sealed with animal tallow and wax glands rather than cold water.",
      x: 28,
      y: 50,
    },
    {
      id: "wt-exhaust-valve",
      figureRef: "Fig. 1",
      label: "Exhaust Valve (D)",
      element: "D",
      description:
        "Equilibrium steam and exhaust drop valve communicating periodically between the cylinder base and condenser vessel.",
      x: 28,
      y: 68,
    },
    {
      id: "wt-separate-condenser",
      figureRef: "Fig. 1",
      label: "Separate Condenser (E)",
      element: "E",
      description:
        "Submerged vessel kept cold in the cistern where exhausted steam is instantly condensed by cold water spray without chilling the power cylinder.",
      x: 24,
      y: 86,
    },
    {
      id: "wt-air-pump",
      figureRef: "Fig. 1",
      label: "Air Pump (G)",
      element: "G",
      description:
        "Reciprocating extraction pump driven by the beam, continually drawing non-condensable air and liquid condensate out of the condenser to hold a deep vacuum.",
      x: 34,
      y: 86,
    },
    {
      id: "wt-walking-beam",
      figureRef: "Fig. 1",
      label: "Walking Beam (H)",
      element: "H",
      description:
        "Massive timber beam pivoting on the engine house central wall, transmitting reciprocating force from the piston to the pump rod.",
      x: 50,
      y: 20,
    },
    {
      id: "wt-pump-rod",
      figureRef: "Fig. 1",
      label: "Mine Pump Rod (J)",
      element: "J",
      description:
        "Heavy wooden pitwork rod extending down the mine shaft to operate subterranean water lift bucket pumps.",
      x: 88,
      y: 55,
    },
  ],
};

export const wattSeparateCondenserPatent: Patent = {
  id: "gb-913-watt-separate-condenser",
  patentNumber: "GB 913",
  title: "A New Invented Method of Lessening the Consumption of Steam and Fuel in Fire Engines",
  shortTitle: "Watt Separate Condenser Steam Engine",
  subtitle: "External Condensation Vessel, Concentric Steam Jacket, and Air Pump Vacuum Extraction",
  inventors: ["James Watt"],
  inventorLocation: "Glasgow, Scotland",
  grantDate: "1769-01-05",
  filingDate: "1769-01-05",
  era: "Early Industrial Pioneers (Pre-1800)",
  category: "materials",
  categoryLabel: "Thermodynamics & Power Generation",
  summary:
    "The foundational master patent of the Industrial Revolution. While repairing a Newcomen atmospheric engine at the University of Glasgow, James Watt discovered that in-cylinder water injection chilled the iron cylinder on every stroke, wasting over 75% of boiler steam simply reheating the walls. Watt resolved this fundamental thermal conflict by condensing steam in an entirely separate cold vessel while surrounding the power cylinder with an insulating steam jacket, quadrupling thermal efficiency and transforming steam power into the universal prime mover of civilization.",
  heroQuote:
    "My method of lessening the consumption of steam, and consequently fuel, in fire engines consists in keeping that vessel in which the powers of steam are employed as hot as the steam that enters it, and condensing the steam in vessels distinct from the steam vessels or cylinders.",
  originalPdfUrl: "/patents/pdfs/gb-913-watt-separate-condenser.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/GB176900913A/en",
  usptoClassification: "Thermodynamic Power Cycles / Steam Condensers & Engines",
  originalTextAsset: {
    url: "/patents/transcripts/gb-913-watt-separate-condenser-reviewed.txt",
    pageCount: 2,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents Editorial Team",
    reviewedAt: "2026-08-19",
    sourcePdfSha256: "ba8638c99df583d72958f9ef8125bc30cd4e0f8784656cd561aecdc58b8b8fad",
  },
  archivalEdition: wattSeparateCondenserArchivalEdition,
  originalText:
    "TO ALL TO WHOM THESE PRESENTS SHALL COME, I, JAMES WATT, of Glasgow, in Scotland, Merchant, send greeting.\n\nWHEREAS His most Excellent Majesty King George the Third did give and grant unto me His special licence for my NEW INVENTED METHOD OF LESSENING THE CONSUMPTION OF STEAM AND FUEL IN FIRE ENGINES...\n\nFirst, That vessel in which the powers of steam are to be employed to work the engine, which is called the cylinder in common fire engines, and which I call the steam vessel, must, during the whole time the engine is at work, be kept as hot as the steam that enters it; first, by inclosing it in a case of wood... secondly, by surrounding it with steam or other heated bodies; and, thirdly, by suffering neither water nor any other substance colder than the steam to enter or touch it during that time.\n\nSecondly, In engines that are to be worked wholly or partially by condensation of steam, the steam is to be condensed in vessels distinct from the steam vessels or cylinders, although occasionally communicating with them; these vessels I call condensers; and, whilst the engines are working, these condensers ought at least to be kept as cold as the air in the neighbourhood of the engines...",
  plainEnglishExplanation: {
    overview:
      "Before James Watt's 1769 breakthrough, all steam engines in the world were atmospheric machines built according to Thomas Newcomen's 1712 design. In a Newcomen engine, steam filled a large open-topped cast-iron cylinder, and cold water was sprayed directly into the cylinder to condense the steam into liquid. This created a partial vacuum under the piston, allowing atmospheric air pressure to push the piston down. However, this direct water injection cooled the hundreds of kilograms of iron cylinder metal from 100°C down to 35°C on every single stroke. When fresh steam entered for the next stroke, up to 75% to 80% of it immediately condensed into useless water droplets against the cold iron walls before any mechanical work could be performed. Watt realized that the thermodynamic requirements of the cylinder and the condenser were completely contradictory: the cylinder must remain boiling hot at all times to avoid wasting steam, while the condenser must remain icy cold to create a deep vacuum. His master solution was to divide these duties into two separate vessels connected by a valve: a permanently hot, steam-jacketed working cylinder, and an external, permanently cold condenser evacuated by a mechanical air pump.",
    coreMechanism:
      "When the piston reaches the top of its stroke, the exhaust valve opens, allowing low-pressure steam (102°C, 120 kPa abs) to rush out of the cylinder and into the submerged condenser vessel. In the condenser, a continuous cold water spray (15°C–35°C) collapses the vapor phase into liquid, plummeting the pressure to the saturation pressure of cold water (3.5–6.0 kPa abs, or 28+ inches of mercury vacuum). Because the cylinder metal is enclosed in an outer jacket filled with live boiler steam, its inner walls never drop below 100°C. Meanwhile, a reciprocating air pump driven from the engine's main walking beam continuously pumps out condensed water, injection spray, and non-condensable atmospheric air that would otherwise choke the vacuum. During the downward working stroke, boiler steam presses directly upon the enclosed piston top while deep vacuum pulls from below, generating a large, steady Indicated Mean Effective Pressure (IMEP ~ 10–14 psi) with more than 75% less coal consumption than a Newcomen engine.",
    mechanicalBreakdown: [
      {
        title: "Separate Condenser Vessel & Cistern",
        summary:
          "An external metallic chamber submerged in a cold water cistern where steam is condensed independently of the power cylinder.",
        technicalDetails:
          "Isolates the low-temperature heat rejection step ($T_C \\approx 308\\text{ K}$) from the high-temperature expansion step ($T_H \\approx 375\\text{ K}$). By condensing steam externally via cold water spray injection ($Q_{\\text{reject}} = \\dot{m}_s \\cdot h_{fg}$), the cylinder metal is protected from cyclic thermal shock, lowering condenser saturation pressure down to $P_{\\text{sat}} < 6\\text{ kPa}$.",
        archaicTerm: "Condensers / Vessels distinct from steam vessels",
        modernEquivalent: "External surface / direct-contact jet condenser",
      },
      {
        title: "Concentric Steam Jacket & Thermal Wood Lagging",
        summary:
          "An annular steam-filled casing and timber jacket surrounding the cast-iron cylinder to keep its walls permanently at boiling temperature.",
        technicalDetails:
          "Supplies continuous latent and sensible heat flux ($q = U \\cdot A \\cdot (T_{\\text{jacket}} - T_{\\text{wall}})$) to prevent boundary layer condensation. Wood lagging reduces convective heat loss to ambient air ($h_{\\text{conv}} \\approx 8\\text{ W/m}^2\\text{K}$), virtually eliminating in-cylinder quench loss ($Q_{\\text{quench}} \\to 0$).",
        archaicTerm: "Case of wood / Surrounding it with steam",
        modernEquivalent: "Thermal steam jacket & insulation lagging",
      },
      {
        title: "Reciprocating Beam Air & Condensate Pump",
        summary:
          "A mechanical pump driven directly by the walking beam that continuously extracts non-condensable air, dissolved gases, and warm water from the condenser.",
        technicalDetails:
          "Without active extraction, dissolved air liberated from boiler feedwater and cold injection water would accumulate in the condenser (Dalton's law of partial pressures: $P_{\\text{total}} = P_{\\text{vapor}} + P_{\\text{air}}$), degrading the vacuum within dozens of strokes. The air pump evacuates both fluid phases to preserve sub-atmospheric operating pressures.",
        archaicTerm: "Pumps wrought by the engines themselves",
        modernEquivalent: "Wet vacuum air pump / Condensate extraction pump",
      },
      {
        title: "Closed Cylinder Top & Thermal Gland Packing",
        summary:
          "A sealed top cylinder head with stuffing box packed with animal tallow and wax rather than cold sealing water.",
        technicalDetails:
          "Newcomen engines relied on a layer of cold standing water atop an open piston to prevent atmospheric air from leaking inward. This cold water continuously drained heat down the cylinder bore. Watt enclosed the cylinder top and substituted warm tallow and hemp packing, allowing pressurized steam to act on the piston's upper face.",
        archaicTerm: "Oils, wax, resinous bodies, fat of animals",
        modernEquivalent: "Stuffing box with tallow-lubricated gland packing",
      },
      {
        title: "Direct Expansive Steam Action",
        summary:
          "Using steam pressure directly to drive the piston downwards rather than relying purely on atmospheric pressure.",
        technicalDetails:
          "Transformed the machine from an 'atmospheric engine' into a true 'steam engine.' Boiler steam at positive gauge pressure (2–10 psig) drives the piston, increasing indicated mean effective pressure without requiring larger cylinder diameters.",
        archaicTerm: "Expansive force of steam to press on the pistons",
        modernEquivalent: "Closed-cycle expansive steam expansion",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Thermodynamic Power Cycle & Cyclic Thermal Quench Reduction",
        formula:
          "\\eta_{\\text{th}} = \\frac{W_{\\text{net}}}{Q_{\\text{in}}} = \\frac{\\text{IMEP} \\cdot V_{\\text{disp}}}{Q_{\\text{steam}} + Q_{\\text{quench}}}",
        explanation:
          "In Newcomen engines, $Q_{\\text{quench}} = m_{\\text{iron}} \\cdot c_p \\cdot \\Delta T$ consumed up to 80% of heat input. Watt reduced $Q_{\\text{quench}}$ to near zero, raising thermal efficiency from ~0.75% to over 4.5%.",
      },
      {
        principle: "Clausius-Clapeyron Vapor-Liquid Saturation Equilibrium",
        formula:
          "\\ln\\left(\\frac{P_2}{P_1}\\right) = -\\frac{\\Delta H_{\\text{vap}}}{R}\\left(\\frac{1}{T_2} - \\frac{1}{T_1}\\right)",
        explanation:
          "Water vapor pressure drops exponentially with condensing temperature: at 100°C steam pressure is 101.3 kPa, whereas at 35°C in the separate condenser it plummets to 5.6 kPa, creating a 95 kPa pressure differential across the piston.",
      },
      {
        principle: "Latent Heat of Vaporization & Heat Balance",
        formula:
          "Q_{\\text{condense}} = \\dot{m}_{\\text{steam}} \\cdot h_{fg} = \\dot{m}_{\\text{water}} \\cdot c_w \\cdot (T_{\\text{out}} - T_{\\text{in}})",
        explanation:
          "Discovered in collaboration with Joseph Black at Glasgow, the massive latent heat of steam ($h_{fg} = 2.26\\times 10^6\\text{ J/kg}$) proved that heating and cooling iron cyclically was mathematically unsustainable.",
      },
    ],
    whyItMattersToday:
      "Watt's separate condenser steam engine was the catalyst of the Industrial Revolution. By reducing coal consumption by over 75%, it made steam power commercially viable away from coalfields, allowing factories, textile mills, iron foundries, and urban waterworks to be built anywhere, multiplying human productivity by orders of magnitude.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: manualWattClaimText(1),
      plainEnglish:
        "The power cylinder must be kept permanently as hot as entering steam throughout the entire working cycle by surrounding it with an outer steam jacket and insulating wood casing, and by preventing cold water from ever entering the cylinder.",
      keyInnovations: [
        "Concentric steam jacket",
        "Insulating wood casing lagging",
        "Permanent isothermal cylinder operation",
        "Elimination of in-cylinder cold quenching",
      ],
      legalSignificance:
        "The broad foundational principle upheld in Boulton & Watt v. Bull (1795) and Hornblower v. Boulton & Watt (1799) establishing patent protection for general technical principles.",
    },
    {
      number: 2,
      isIndependent: true,
      originalText: manualWattClaimText(2),
      plainEnglish:
        "Steam must be condensed in an external vessel completely distinct and separate from the power cylinder, with the condenser maintained continuously cold by water cooling.",
      keyInnovations: [
        "Separate condenser vessel",
        "External cold water injection",
        "Physical separation of heat input and heat rejection zones",
      ],
      legalSignificance:
        "The core technological claim that prevented all rival engine makers from building efficient steam engines throughout the late 18th century.",
    },
    {
      number: 3,
      isIndependent: true,
      originalText: manualWattClaimText(3),
      plainEnglish:
        "Non-condensable air, elastic gases, and liquid water must be continuously extracted from the separate condenser by a mechanical pump driven directly by the engine.",
      keyInnovations: [
        "Engine-driven air extraction pump",
        "Continuous vacuum maintenance",
        "Evacuation of dissolved feedwater gases",
      ],
      legalSignificance:
        "Protected the essential auxiliary mechanism without which a separate condenser would quickly choke and stall.",
    },
    {
      number: 4,
      isIndependent: true,
      originalText: manualWattClaimText(4),
      plainEnglish:
        "Using the direct expansive pressure of steam inside a closed cylinder to drive the piston, including non-condensing operation where cooling water is scarce by exhausting steam into the atmosphere.",
      keyInnovations: [
        "Direct steam pressure driving force",
        "Closed cylinder operation",
        "Non-condensing high-pressure exhaust capability",
      ],
      legalSignificance:
        "Prefigured high-pressure steam engines and non-condensing locomotives later built by Trevithick and Stephenson.",
    },
    {
      number: 5,
      isIndependent: true,
      originalText: manualWattClaimText(5),
      plainEnglish:
        "Generating continuous rotary motion around an axis using circular steam channels or mechanical linkages that convert reciprocating piston strokes into shaft rotation.",
      keyInnovations: [
        "Rotary steam power generation",
        "Reciprocating-to-rotary conversion linkages",
        "Factory mill shaft drives",
      ],
      legalSignificance:
        "Formed the basis for Watt's 1781 sun-and-planet rotative engine patent that powered the Industrial Revolution's textile mills.",
    },
    {
      number: 6,
      isIndependent: true,
      originalText: manualWattClaimText(6),
      plainEnglish:
        "Operating engines by applying moderate cooling to contract steam volumes rather than condensing it completely into liquid water.",
      keyInnovations: ["Thermal steam contraction cycle", "Partial cooling expansive operation"],
    },
    {
      number: 7,
      isIndependent: true,
      originalText: manualWattClaimText(7),
      plainEnglish:
        "Sealing the piston and stuffing boxes against steam leakage using animal tallow, wax, oils, or quicksilver instead of cold water.",
      keyInnovations: [
        "Tallow and wax thermal gland sealing",
        "Abolition of cold surface water sealing",
        "High-temperature piston lubricity",
      ],
      legalSignificance:
        "Eliminated the parasitic top-of-piston water cooling present in all Newcomen engines.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Sectional Elevation of Boulton & Watt Separate Condenser Beam Engine",
      caption:
        "Historic copperplate engraving schematic showing boiler A, steam-jacketed cylinder B, enclosed piston C, equilibrium valve D, separate condenser E, cold water cock F, air pump G, walking beam H, and mine pump rod J.",
      svgType: "watt-separate-condenser",
      callouts: wattFigureCallouts["Fig. 1"],
    },
  ],
  historicalContext: {
    problemStatement:
      "In the mid-18th century, Britain's coal and tin mines were hitting water tables, and Newcomen atmospheric engines consumed ruinous amounts of coal. A typical Newcomen engine burned over 15 to 20 kilograms of coal per horsepower-hour because 75% of every boiler charge was wasted reheating the cold cylinder walls after water injection. In tin and copper mining regions like Cornwall, where coal had to be shipped by sea at enormous expense, mine owners were going bankrupt solely from engine fuel bills.",
    priorArtLimitations: [
      "Thomas Newcomen's 1712 atmospheric engine injected cold water directly into the main cast-iron cylinder, chilling hundreds of kilograms of iron on every stroke.",
      "Up to 80% of boiler steam was wasted reheating the cylinder from 35°C back to 100°C before any mechanical work was produced.",
      "Cylinders were open to the air and used cold surface water atop the piston for sealing, causing massive heat conduction losses.",
      "Could only operate as single-acting pumping engines for mine drainage, unable to drive rotary mill machinery smoothly.",
    ],
    breakthroughInsight:
      "While walking on Glasgow Green in May 1765 after repairing a small Newcomen engine model for the University of Glasgow, James Watt realized that steam was an elastic fluid that would instantly rush into any connected vacuum vessel. Therefore, condensation could be performed in a separate cold vessel without ever dropping the temperature of the power cylinder. By keeping the cylinder enclosed in a steam jacket permanently as hot as boiling steam, and using an air pump to maintain continuous vacuum in the cold condenser, the thermal quench penalty was eliminated, saving over 75% of fuel.",
    patentWars: [
      {
        rivalName: "Edward Bull & Richard Trevithick",
        rivalClaim:
          "Built inverted direct-acting steam engines in Cornwall with the cylinder placed directly over the mine shaft, claiming their engine layout did not infringe Watt's beam engine design.",
        conflictDetails:
          "Bull and Trevithick omitted the walking beam but utilized a separate condenser and air pump. Boulton & Watt sued for infringement in the Court of Common Pleas in 1793 (Boulton & Watt v. Bull).",
        resolution:
          "The judges split on whether Watt's 1769 patent claimed a physical machine or a philosophical principle. In 1799, the Court of King's Bench unanimously ruled in Hornblower v. Boulton & Watt that Watt's patent validly protected the practical application of the separate condenser principle.",
        legalOutcome:
          "Landmark legal precedent in Anglo-American patent law affirming that a patent may protect a method or principle of manufacture embodied in a working mechanism.",
      },
      {
        rivalName: "Jonathan Hornblower",
        rivalClaim:
          "Patented the two-cylinder compound steam engine in 1781 (GB 1298), expanding steam sequentially in high-pressure and low-pressure cylinders.",
        conflictDetails:
          "Hornblower's compound engine still required steam to be condensed after leaving the low-pressure cylinder. Boulton & Watt obtained injunctions shutting down Hornblower's engines across Cornwall.",
        resolution:
          "The courts ruled that Hornblower could not use a separate condenser without a license from Boulton & Watt, stalling compound engine development until Watt's patent expired in 1800.",
        legalOutcome:
          "Enjoined Hornblower from operating compound engines, solidifying Boulton & Watt's commercial dominance until the patent expired.",
      },
    ],
    civilizationalImpact:
      "Watt's separate condenser steam engine was the catalyst of the Industrial Revolution. By reducing coal consumption by over 75%, it made steam power commercially viable away from coalfields, allowing factories, textile mills, iron foundries, and urban waterworks to be built anywhere. When paired with Watt's subsequent inventions (sun-and-planet rotative gearing, double-acting cylinders, parallel motion, and centrifugal flyball governors), the steam engine replaced water wheels and draft animals, multiplying human productivity by orders of magnitude.",
    funFact:
      "To convince skeptical Cornish mine captains to replace their Newcomen engines, Matthew Boulton and James Watt offered an unprecedented business model: they installed their engines for free and charged only one-third of the money saved on coal compared to an equivalent Newcomen engine. They also coined the unit 'horsepower' (550 ft-lb/s, or 745.7 Watts) so brewery owners could understand how many draft horses a Boulton & Watt engine would replace.",
    aftermath:
      "In 1775, Matthew Boulton successfully lobbied Parliament to pass an extraordinary Act (15 Geo. III c. 61) extending Watt's 1769 patent for 25 additional years until 1800. The Soho Manufactory in Birmingham became the world's premier engineering enterprise, manufacturing over 500 steam engines before the patent expired and establishing mechanical engineering as a recognized profession.",
    sideNotes: [
      "Joseph Black, discoverer of latent heat and specific heat, was Watt's mentor and creditor at Glasgow University, providing scientific guidance during the early condenser experiments.",
      "John Wilkinson's invention of the precision hydraulic cannon boring machine in 1774 was the critical manufacturing breakthrough that allowed Watt's large 50-inch cast-iron cylinders to be bored true enough to hold steam without leaking.",
    ],
  },
  stats: {
    totalClaims: 7,
    independentClaims: 7,
    patentWarYears: "25",
  },
  tags: [
    "Steam Engine",
    "Thermodynamics",
    "Separate Condenser",
    "Industrial Revolution",
    "James Watt",
    "Boulton & Watt",
    "Heat Engines",
    "Rankine Cycle",
    "Energy Efficiency",
    "Mining Technology",
  ],
};
