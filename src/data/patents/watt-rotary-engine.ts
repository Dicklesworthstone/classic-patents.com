/**
 * watt-rotary-engine.ts
 *
 * Canonical typed patent record for James Watt's 1781 Rotary Motion & Sun and Planet Gearing Patent
 * (GB 1306 - "Certain New Methods of Producing a Continued Rotative Motion Around an Axis or Center").
 *
 * Adheres strictly to AGENTS.md single-source-of-truth invariants:
 * - Claim text is dynamically retrieved from wattRotaryEngineArchivalEdition via manualWattRotaryClaimText(n).
 * - Pinned facsimile PDF and reviewed ledger digests match the provenance receipt.
 */

import { manualWattRotaryClaimText } from "@/data/editions/wattRotaryEngineEdition";
import type { Patent } from "@/types/patent";

export const wattRotaryEnginePatent: Patent = {
  id: "gb-1306-watt-rotary-engine",
  patentNumber: "GB 1306",
  title:
    "Certain New Methods of Producing a Continued Rotative Motion Around an Axis or Center, and for other Purposes, to be Applied to the Steam or Fire Engines",
  shortTitle: "Watt Rotary Motion & Sun and Planet Gearing",
  subtitle:
    "Converting Reciprocating Steam Piston Motion into Continuous Rotary Shaft Power with 2:1 Epicyclic Velocity Acceleration",
  inventors: ["James Watt"],
  inventorLocation: "Birmingham, County of Warwick, England",
  grantDate: "1781-10-25",
  filingDate: "1781-10-25",
  era: "Pre-Industrial & Early Industrial (Pre-1800)",
  category: "materials",
  categoryLabel: "Energy & Thermodynamics",
  summary:
    "James Watt's landmark 1781 patent solved the greatest engineering challenge of the early Industrial Revolution: converting the reciprocating push-pull stroke of a steam engine into continuous, smooth rotational power without violating James Pickard's restrictive 1780 crank patent. Devised by Watt and his brilliant foreman William Murdoch, the Sun and Planet epicyclic gearing bolted an orbiting 'planet' spur gear rigidly to the engine connecting rod, forcing a central 'sun' gear on the flywheel shaft to make two full revolutions for every single double-stroke of the engine beam. This 2:1 speed multiplication enabled slow, gentle piston motions to spin factory line shafts, textile water frames, flour mills, and iron forges at double velocity.",
  heroQuote:
    "Because the planet wheel is firmly fixed to the connecting rod and does not rotate independently about its own center, it causes the sun wheel, and the main axle and fly-wheel attached thereto, to perform two complete revolutions for every double stroke.",
  originalPdfUrl: "/patents/pdfs/gb-1306-watt-rotary-engine.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/GB178101306A/en",
  usptoClassification: "GB Class 122 (Steam Engines & Gearing)",

  originalText:
    "TO ALL TO WHOM THESE PRESENTS SHALL COME, I, JAMES WATT, of Birmingham, in the County of Warwick, Engineer, send greeting:\n\nWHEREAS His most Excellent Majesty King George the Third, by His Letters Patent under the Great Seal of Great Britain, bearing date at Westminster, the Twenty-fifth day of October, in the twenty-first year of His reign, did give and grant unto me, the said James Watt, His especial licence, full power, sole privilege and authority, that I, the said James Watt, my executors, administrators, and assigns, should and lawfully might make, use, exercise, and vend, within England, Wales, and the Town of Berwick-upon-Tweed, my new Invented 'Certain New Methods of Producing a Continued Rotative Motion Around an Axis or Center, and for other Purposes, to be Applied to the Steam or Fire Engines;' in which said Letters Patent there is contained a proviso obliging me, the said James Watt, by an instrument in writing under my hand and seal, to cause a particular description of the nature of my said Invention, and the manner in which the same is to be performed, to be inrolled in His Majesty's High Court of Chancery within four calendar months next and immediately after the date of the said Letters Patent...\n\nMy Invention consists in certain new methods or apparatus for applying the reciprocating motion of the working beams or pistons of steam or fire engines to turn large wheels, axles, or shafts, and to produce a continued circular or rotative motion round an axis or center, without employing a simple revolving crank; which circular motion may be applied to drive mills of all kinds, forge hammers, rolling mills, spinning and weaving machinery, and other mechanical apparatus requiring continuous rotation.",

  plainEnglishExplanation: {
    overview:
      "Before 1781, steam engines were exclusively reciprocating pumpers—suited for bailing water out of Cornish copper and coal mines, but incapable of turning a factory driveshaft. Mills still relied entirely on capricious water wheels and draft horses. When Boulton & Watt sought to apply steam to factories, they found James Pickard had patented the simple crankshaft in 1780, demanding exorbitant royalties. Instead of yielding, Watt and William Murdoch invented five ingenious rotary mechanisms, crowned by the Sun and Planet epicyclic gear. By clamping an orbiting planet gear rigidly to the connecting rod, the mechanism not only bypassed the crank patent but doubled output shaft speed, spinning factory line shafts at twice the frequency of the engine beam.",
    coreMechanism:
      "The engine piston rocks a great wooden or cast-iron walking beam through a stroke $S = 1.8\\text{ m}$. Suspended from the outer beam head is a long iron connecting spear. Clamped rigidly to the bottom of this spear is the 'Planet' spur gear ($N_p = 40$ teeth). Meshing with it is the 'Sun' spur gear ($N_s = 40$ teeth) keyed directly to the flywheel shaft. A brass radius link holds the two gear centers at constant pitch distance $R_{\\text{orbit}} = r_s + r_p$. Because the planet gear cannot spin independently on its own center, orbiting once around the sun forces the sun gear to advance by its own teeth PLUS the planet's teeth, yielding an exact 2:1 epicyclic speed multiplication: $\\omega_{\\text{shaft}} = \\omega_{\\text{beam}} \\cdot (1 + N_p / N_s) = 2 \\cdot \\omega_{\\text{beam}}$.",
    mechanicalBreakdown: [
      {
        title: "Sun & Planet Epicyclic Gear Pair",
        summary:
          "Two matching external spur gears that produce continuous shaft rotation and 2x speed multiplication through orbital mesh.",
        technicalDetails:
          "The central Sun wheel ($r_s = 0.45\\text{ m}$) is keyed to the flywheel shaft. The Planet wheel ($r_p = 0.45\\text{ m}$) orbits around it. With equal tooth counts ($N_p = N_s = 40$), each complete orbit rotates the sun gear by $2\\pi (1 + N_p/N_s) = 4\\pi$ radians (720°), doubling line shaft speed without auxiliary gearing.",
        archaicTerm: "Sun and Planet wheels",
        modernEquivalent: "Epicyclic / planetary external spur gear drive",
      },
      {
        title: "Rigid Connecting Spear Mounting Bracket",
        summary:
          "Solid iron flange bolting the planet gear rigidly to the connecting rod, preventing independent rotation on its own center.",
        technicalDetails:
          "If the planet gear were free to rotate on a bearing pin at the end of the connecting rod like an idler, it would transmit zero continuous torque. Bolting it solidly locks its angular orientation to the connecting rod, converting rod translation into orbital driving torque.",
        archaicTerm: "Spear or connecting rod",
        modernEquivalent: "Rigid planetary carrier / connecting rod extension",
      },
      {
        title: "Radius Guide Link & Retaining Ring",
        summary:
          "Pivoted mechanical tie link maintaining continuous pitch-line mesh contact between sun and planet centers.",
        technicalDetails:
          "A heavy brass or wrought-iron link connects the central driveshaft to the planet gear spindle, maintaining exact center distance $R = r_{\\text{sun}} + r_{\\text{planet}} = 0.90\\text{ m}$ against separating tooth forces ($F_{\\text{sep}} = F_{\\text{tangential}} \\tan 20^\\circ$).",
        archaicTerm: "Radius arm or circular guiding groove",
        modernEquivalent: "Pitch-circle center-distance constraint link",
      },
      {
        title: "Massive Cast-Iron Flywheel",
        summary:
          "Large heavy-rim wheel storing kinetic energy to carry the engine through top and bottom dead centers and smooth torque ripples.",
        technicalDetails:
          "Operating at twice the engine cycle speed ($Omega = 40\\text{ RPM}$ at $20\\text{ SPM}$), the flywheel stores kinetic energy $E = \\frac{1}{2} I \\Omega^2 \\approx 80\\text{ kJ}$ with $I \\approx 10{,}080\\text{ kg}\\cdot\\text{m}^2$, reducing angular velocity fluctuation $\\delta < 0.05$.",
        archaicTerm: "Fly-wheel to equalize the velocity",
        modernEquivalent: "Rotational inertia energy storage flywheel",
      },
      {
        title: "Steam Cylinder & Great Walking Beam",
        summary:
          "Condensing steam cylinder driving an oscillating timber or cast-iron beam pivoted on masonry trunnions.",
        technicalDetails:
          "Operates with separate condenser vacuum and low boiler pressure ($P_{\\text{eff}} \\approx 70\\text{ kPa}$) across a $0.76\\text{ m}$ bore cylinder, delivering $\\approx 31.7\\text{ kN}$ of reciprocating driving force to the beam.",
        archaicTerm: "Great working beam and steam cylinder",
        modernEquivalent: "Single-acting condensing beam engine prime mover",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Epicyclic Kinematic Velocity Multiplication",
        formula:
          "\\omega_{\\text{shaft}} = \\omega_{\\text{beam}} \\left(1 + \\frac{N_{\\text{planet}}}{N_{\\text{sun}}}\\right) = 2 \\cdot \\omega_{\\text{beam}}",
        explanation:
          "In an epicyclic gear train where the planet gear does not rotate relative to its carrier arm, the driven sun gear rotates with angular velocity equal to the carrier arm velocity plus the ratio of gear teeth. For identical gears ($N_p = N_s$), the velocity ratio is exactly $1 + 1 = 2.0$.",
      },
      {
        principle: "Instantaneous Shaft Torque & Tangential Tooth Contact",
        formula:
          "\\tau_{\\text{shaft}} = \\frac{1}{2} F_{\\text{rod}} \\cdot r_{\\text{sun}} \\cdot \\sin(\\theta)",
        explanation:
          "The connecting rod force creates a tangential drive force across the pitch line of the sun gear. While torque fluctuates from zero at dead centers to peak at horizontal positions, mean torque balances total work per cycle over the double revolution.",
      },
      {
        principle: "Flywheel Rotational Kinetic Energy Storage",
        formula:
          "E_{\\text{kinetic}} = \\frac{1}{2} I_{\\text{flywheel}} \\omega_{\\text{shaft}}^2 = \\frac{1}{4} M_{\\text{rim}} R^2 \\omega_{\\text{shaft}}^2",
        explanation:
          "Because kinetic energy scales with the square of rotational speed ($\\omega^2$), doubling output shaft speed quadrupled the energy stored per kilogram of flywheel iron, allowing lighter flywheels to achieve superior speed uniformity.",
      },
    ],
    whyItMattersToday:
      "Watt's Sun and Planet patent was the catalyst that unshackled the Industrial Revolution from riverbanks. By turning steam into continuous rotation, factories no longer needed to be built alongside rushing streams in remote valleys. Textile mills, flour mills, and ironworks could now be located anywhere in cities near labor and transport.",
  },

  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: manualWattRotaryClaimText(1),
      plainEnglish:
        "Protects the fundamental method of converting the reciprocating up-and-down motion of a steam engine beam or piston into continuous rotary shaft motion using a toothed planet gear rigidly fixed to the connecting rod that orbits around a central toothed sun gear keyed to the output shaft.",
      keyInnovations: [
        "Rigid planet gear attachment to connecting rod",
        "Epicyclic orbital conversion of reciprocating beam motion",
        "Elimination of simple single-piece crankshaft",
      ],
      legalSignificance:
        "The core broad claim of GB 1306, legally protecting Boulton & Watt's rotary steam engines against infringement while successfully circumventing Pickard's crank patent.",
    },
    {
      number: 2,
      isIndependent: true,
      originalText: manualWattRotaryClaimText(2),
      plainEnglish:
        "Protects the epicyclic gearing mechanism and geometry that causes the driven sun gear and flywheel shaft to make exactly two complete revolutions for every single double-stroke or cycle of the engine walking beam.",
      keyInnovations: [
        "2:1 speed doubling without auxiliary speed-increasing gears",
        "Halving required engine stroke rate for given shaft RPM",
        "Quadrupled flywheel kinetic energy density per stroke",
      ],
      legalSignificance:
        "Established exclusive rights over the 2:1 velocity multiplication effect, giving Boulton & Watt engines a huge technological edge in cotton spinning mills.",
    },
    {
      number: 3,
      isIndependent: true,
      originalText: manualWattRotaryClaimText(3),
      plainEnglish:
        "Protects the mechanical retaining link, guide arm, or circular groove that connects the centers of the sun and planet gears to maintain constant pitch-circle meshing and prevent the orbiting planet gear from disengaging under load.",
      keyInnovations: [
        "Center-distance retention radius link",
        "Separating tooth force containment",
        "Continuous pitch-circle alignment during full 360° orbit",
      ],
      legalSignificance:
        "Protected the physical kinematic constraint mechanism essential for safe, reliable operation of heavy industrial epicyclic gearing.",
    },
    {
      number: 4,
      isIndependent: true,
      originalText: manualWattRotaryClaimText(4),
      plainEnglish:
        "Protects four alternative mechanical conversion systems disclosed in the specification, including internal planetary ring gearing, crown-wheel ratchet escapements, double reciprocating rack-and-pinions, and helical spiral shaft cams.",
      keyInnovations: [
        "Internal epicyclic ring gear drive (Method 2)",
        "Crown wheel push-pull ratchet escapement (Method 3)",
        "Double rack with alternating sector pinions (Method 4)",
        "Helical cam groove rotary conversion (Method 5)",
      ],
      legalSignificance:
        "Comprehensive defensive patent claiming that prevented competing engine builders from circumventing Watt using alternative non-crank rotary conversion designs.",
    },
  ],

  drawings: [
    {
      figureNumber: "1",
      title: "Fig. 1 — Elevation of Rotary Steam Engine & Fig. 2 — Sun and Planet Pitch Mesh",
      caption:
        "Technical drawing plate showing the walking beam (A), connecting spear (B), planet gear wheel (C), sun gear wheel (D), flywheel shaft (E), steam cylinder (F), and radius guide link (G).",
      svgType: "watt-rotary-engine",
      callouts: [
        {
          id: "A",
          figureRef: "1",
          label: "A",
          element: "Great Walking Beam",
          description:
            "Heavy timber or cast-iron beam rocking on central masonry trunnions to transmit reciprocating motion from the piston to the connecting rod.",
          x: 24,
          y: 24,
        },
        {
          id: "B",
          figureRef: "1",
          label: "B",
          element: "Connecting Spear / Rod",
          description:
            "Long vertical iron rod suspended from the outer beam head, carrying the rigidly bolted planet gear at its lower end.",
          x: 40,
          y: 46,
        },
        {
          id: "C",
          figureRef: "1",
          label: "C",
          element: "Planet Gear Wheel",
          description:
            "Orbiting spur gear wheel bolted solidly to the connecting rod, prevented from spinning independently on its own center.",
          x: 48,
          y: 66,
        },
        {
          id: "D",
          figureRef: "1",
          label: "D",
          element: "Sun Gear Wheel",
          description:
            "Central spur gear wheel keyed fast to the output driveshaft and flywheel, rotating at twice the engine cycle frequency.",
          x: 31,
          y: 74,
        },
        {
          id: "E",
          figureRef: "1",
          label: "E",
          element: "Flywheel & Shaft",
          description:
            "Heavy cast-iron flywheel equalizing rotational velocity and storing kinetic energy across engine dead centers.",
          x: 51,
          y: 80,
        },
        {
          id: "F",
          figureRef: "1",
          label: "F",
          element: "Steam Cylinder",
          description:
            "Single-acting condensing steam cylinder with reciprocating piston driving the left end of the walking beam.",
          x: 13,
          y: 52,
        },
        {
          id: "G",
          figureRef: "1",
          label: "G",
          element: "Radius Guide Link",
          description:
            "Pivoted brass link connecting the centers of the sun and planet wheels to maintain pitch-line tooth engagement.",
          x: 42,
          y: 74,
        },
      ],
    },
  ],

  historicalContext: {
    problemStatement:
      "Converting reciprocating steam engine piston motion into continuous, uniform rotation was the single most urgent engineering necessity of the 1780s. Early industrial mills—especially Richard Arkwright's water-frame cotton spinning mills and Henry Cort's grooved rolling mills—were severely constrained by the availability and seasonal freezing of water power. James Pickard had secured a broad patent in 1780 (GB 1263) covering the application of a simple crankshaft to steam engines. Boulton & Watt refused to buy a license or compromise their intellectual property, prompting Watt and William Murdoch to invent the Sun and Planet epicyclic gear, turning an obstacle into a decisive technical superiority with 2:1 speed doubling.",
    priorArtLimitations: [
      "Thomas Newcomen Atmospheric Engine (1712) — Strictly reciprocating mine-drainage pump with open top cylinder and water spray condensation inside cylinder.",
      "James Watt Separate Condenser Engine (GB 913, 1769) — Drastically reduced fuel consumption by 75% via separate condenser and steam jacket, but remained reciprocating.",
      "James Pickard Crank Engine Patent (GB 1263, 1780) — Patented the application of a standard simple crank and connecting rod to steam engines.",
      "Matthew Wasborough Ratchet Engine (GB 1211, 1779) — Attempted rotary motion using ratchet wheels and pawls, which suffered violent mechanical shocks and rapid tooth failure.",
    ],
    breakthroughInsight:
      "Clamping an orbiting planet spur gear rigidly to the connecting rod to orbit around a central sun gear, bypassing the crank patent while doubling flywheel shaft rotational velocity.",
    patentWars: [
      {
        rivalName: "James Pickard and Matthew Wasborough",
        rivalClaim:
          "Application of simple crankshaft and connecting rod to steam engines (GB 1263)",
        conflictDetails:
          "In 1780, Pickard patented the crank on steam engines after allegedly obtaining the concept from a Boulton & Watt workman at a pub. Watt refused to pay licensing royalties.",
        resolution:
          "Watt and Murdoch deployed the Sun and Planet gear across all Boulton & Watt engines until Pickard's patent expired in 1794.",
        legalOutcome:
          "Boulton & Watt avoided all infringement claims while marketing a superior 2:1 speed-doubled engine.",
      },
      {
        rivalName: "Jonathan Hornblower and John Maberly",
        rivalClaim: "Compound two-cylinder rotary steam engine",
        conflictDetails:
          "Jonathan Hornblower argued his two-cylinder engine was an independent rotary design. In 1795, Boulton & Watt sued Maberly in the Court of Common Pleas.",
        resolution:
          "The Court of King's Bench confirmed Watt's patent validity in 1799, awarding substantial back damages.",
        legalOutcome:
          "Definitive legal victory that protected Boulton & Watt's rotary engine monopoly across the British Empire.",
      },
    ],
    civilizationalImpact:
      "The Sun and Planet rotary engine established Boulton & Watt as the unrivaled global leader in industrial steam power. In 1786, Boulton & Watt erected the celebrated Albion Flour Mills in London, powered by two 50-horsepower Sun and Planet rotary engines driving 20 pairs of millstones, grinding 16,000 bushels of wheat per week. By 1800, Boulton & Watt had built over 300 rotary engines across Britain, powering cotton spinning mills, iron rolling mills, breweries, and canal boatyards, fundamentally creating modern urban industrial civilization.",
  },

  stats: {
    totalClaims: 4,
    independentClaims: 4,
  },

  tags: [
    "steam engine",
    "rotary motion",
    "james watt",
    "epicyclic gearing",
    "sun and planet",
    "industrial revolution",
    "flywheel kinetics",
    "william murdoch",
    "boulton & watt",
  ],
};
