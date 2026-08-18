import type { Patent } from "@/types/patent";

export const goddardRocketPatent: Patent = {
  id: "us-1155986-goddard-rocket",
  patentNumber: "US 1,155,986",
  title: "Rocket Apparatus",
  shortTitle: "Goddard's Multi-Stage Liquid Rocket",
  subtitle:
    "Multi-Stage Vehicle Staging and Supersonic de Laval Expansion Nozzles for Extreme Altitudes and Spaceflight",
  inventors: ["Robert H. Goddard"],
  inventorLocation: "Worcester, Massachusetts",
  grantDate: "1915-10-05",
  filingDate: "1913-10-01",
  era: "Early Aviation (1900–1910)",
  category: "aviation",
  categoryLabel: "Aerospace & Rocket Propulsion",
  summary:
    "Goddard's foundational astronautics patent established the two physical breakthroughs required to leave Earth's gravity: multi-stage staging that jettisons empty deadweight tanks in flight, and converging-diverging supersonic de Laval nozzles that convert combustion gas thermal enthalpy into hypersonic kinetic exhaust velocity.",
  heroQuote:
    "A major difficulty with ordinary rockets is that the dead weight of the casing must be accelerated throughout the entire flight... in the apparatus of my invention, the propellant is burned in a chamber having a properly shaped expansion nozzle, and is arranged in a plurality of stages so that as the propellant in one section is consumed, that section is detached and dropped.",
  originalPdfUrl: "/patents/pdfs/us-1155986-goddard-rocket.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US1155986A/en",
  usptoClassification: "F02K 9/00 (Rocket-engine plants)",
  originalText: `UNITED STATES PATENT OFFICE.
ROBERT H. GODDARD, OF WORCESTER, MASSACHUSETTS.

ROCKET APPARATUS.

1,155,986. Specification of Letters Patent. Patented Oct. 5, 1915.
Application filed October 1, 1913. Serial No. 792,869.

To all whom it may concern:
Be it known that I, ROBERT H. GODDARD, a citizen of the United States, residing at Worcester, in the County of Worcester and State of Massachusetts, have invented certain new and useful Improvements in Rocket Apparatus, of which the following is a specification, reference being had to the accompanying drawings forming a part thereof.

This invention relates to rocket apparatus, and has for its primary object the provision of a rocket which can reach extreme altitudes, far beyond the limits attainable with ordinary rockets, for meteorological, scientific, or other purposes, and which may be utilized to transport recording instruments or payloads into the upper atmosphere or outer space.

A major difficulty with ordinary rockets is that the ratio of the weight of the propellant to the total initial weight of the rocket is small, and that the dead weight of the casing must be accelerated throughout the entire flight. Furthermore, the gases produced by combustion are discharged with low velocity through simple orifices, resulting in very low thermodynamic efficiency (rarely exceeding two per cent).

In the apparatus of my invention, the propellant is burned in a combustion chamber having a properly shaped expansion nozzle with a converging entrance and a diverging cone, whereby the heat energy of the combustion gases is converted into kinetic energy of a high-velocity supersonic jet with great efficiency (exceeding sixty per cent).

Furthermore, the apparatus is arranged in a plurality of stages or cartridge sections, so that as the propellant in one section is consumed, that section is detached and dropped, thereby reducing the mass to be accelerated by the succeeding section. The apparatus also comprises automatic igniting devices and means for stabilizing the vehicle in flight.`,
  plainEnglishExplanation: {
    overview:
      "Before Robert H. Goddard, rockets were simple solid-gunpowder fireworks that rarely exceeded a mile in altitude. Because a single-stage rocket must accelerate its heavy burnt-out iron casing and empty fuel tanks for its entire flight, reaching orbit was mathematically impossible under the rocket equation. Goddard solved this by inventing two foundational aerospace principles: supersonic de Laval converging-diverging nozzles that accelerate exhaust gas to Mach 3+, and multi-stage staging that jettisons empty structural deadweight at separation points.",
    coreMechanism:
      "Liquid propellants (liquid oxygen and gasoline) or pressurized solid charges burn inside a high-strength combustion chamber at high chamber pressure ($P_c > 20\\text{ bar}$). The expanding gas accelerates through a converging throat to Mach 1 and expands through a diverging bell to supersonic exit velocity ($v_e > 2,500\\text{ m/s}$). As the propellant in stage 1 is depleted, automated release latches decouple the stage, dropping empty deadweight so that stage 2 ignites at high velocity with a pristine mass ratio ($m_0/m_f$).",
    mechanicalBreakdown: [
      {
        title: "Supersonic de Laval Expansion Nozzle",
        summary:
          "Converging-diverging hourglass geometry converting heat enthalpy to kinetic velocity.",
        technicalDetails:
          "Compresses subsonic gas to Mach 1 at the narrow throat ($A^*$) and expands it isentropically in the diverging cone to Mach 3+, increasing exhaust kinetic efficiency from 2% to over 60% ($v_e = \\sqrt{\\frac{2\\gamma R T_0}{(\\gamma-1)M}[1 - (p_e/p_0)^{(\\gamma-1)/\\gamma}]}$).",
        archaicTerm: "Expansion nozzle with tapered throat and diverging cone",
        modernEquivalent: "Supersonic converging-diverging de Laval rocket nozzle",
      },
      {
        title: "Multi-Stage Detachable Separation Latches",
        summary:
          "Mechanical spring-loaded latches and explosive releases decoupling depleted stages.",
        technicalDetails:
          "When propellant pressure drops at burnout, release collars disengage, allowing aerodynamic drag and separation springs to jettison the spent stage casing.",
        archaicTerm: "Detachable cartridge sections and release pins",
        modernEquivalent: "Pneumatic/pyrotechnic stage separation interstage mechanism",
      },
      {
        title: "Liquid Propellant Injection & Chamber Cooling",
        summary:
          "Pressurized fuel and oxidizer manifold injecting propellants into a combustion zone.",
        technicalDetails:
          "Injects liquid oxygen and hydrocarbon fuel through atomizing orifices, absorbing heat along the chamber walls to prevent metallurgical burn-through.",
        archaicTerm: "Propellant feed chamber with injector orifices",
        modernEquivalent: "Regeneratively cooled bi-propellant combustion chamber",
      },
      {
        title: "Exhaust Jet Gyroscope Steering Vanes",
        summary: "Movable refractory vanes mounted directly in the supersonic exhaust stream.",
        technicalDetails:
          "Deflects supersonic exhaust vectors ($\vec{F}_{thrust}$) to generate restoring pitch and yaw control moments, maintaining aerodynamic vertical stability.",
        archaicTerm: "Movable steering vanes in exhaust jet",
        modernEquivalent: "Gimbaled rocket thrust vector control (TVC) system",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Tsiolkovsky Multi-Stage Rocket Equation",
        formula:
          "\\Delta v_{total} = \\sum_{i=1}^N v_{e,i} \\ln\\left(\\frac{m_{0,i}}{m_{f,i}}\\right) = \\sum_{i=1}^N I_{sp,i} g_0 \\ln\\left(\\frac{m_{0,i}}{m_{f,i}}\\right)",
        explanation:
          "Because empty structural mass ($m_{dry}$) is discarded at each stage separation, the vehicle avoids hauling useless deadweight, allowing the cumulative velocity increment ($\\Delta v$) to exceed Earth escape velocity ($11.2\\text{ km/s}$).",
      },
      {
        principle: "Isentropic Supersonic Expansion & Exhaust Velocity",
        formula:
          "v_e = \\sqrt{\\frac{2\\gamma}{\\gamma - 1} \\frac{R T_c}{M} \\left[1 - \\left(\\frac{p_e}{p_c}\\right)^{\\frac{\\gamma - 1}{\\gamma}}\\right]}",
        explanation:
          "High combustion chamber temperature ($T_c$), low molecular weight exhaust gas ($M$), and large nozzle expansion ratios ($p_c/p_e$) maximize kinetic exhaust velocity ($v_e$) and specific impulse ($I_{sp}$).",
      },
      {
        principle: "Rocket Thrust in Atmosphere & Vacuum",
        formula: "F = \\dot{m} v_e + (p_e - p_a) A_e",
        explanation:
          "Thrust consists of momentum thrust ($\\dot{m} v_e$) and pressure thrust ($(p_e - p_a) A_e$). In the vacuum of space ($p_a = 0$), rocket thrust actually increases to its maximum value, proving the rocket operates by Newton's third law rather than 'pushing against air.'",
      },
      {
        principle: "Nozzle Area-Mach Number Expansion Relation",
        formula:
          "\\frac{A}{A^*} = \\frac{1}{M}\\left[\\frac{2 + (\\gamma - 1)M^2}{\\gamma + 1}\\right]^{\\frac{\\gamma + 1}{2(\\gamma - 1)}}",
        explanation:
          "In supersonic compressible flow ($M > 1$), increasing cross-sectional area ($A > A^*$) causes gas velocity to increase and pressure to drop, accelerating combustion exhaust to supersonic speeds.",
      },
      {
        principle: "Payload Mass Fraction Optimization",
        formula:
          "\\lambda = \\frac{m_{payload}}{m_0} = \\prod_{i=1}^N \\left(e^{-\\Delta v_i / v_e} - \\epsilon_i\\right)",
        explanation:
          "Multi-stage optimization demonstrates that a 3-stage rocket can deliver a payload to orbit with a total vehicle mass that is orders of magnitude smaller than any theoretically possible single-stage vehicle.",
      },
    ],
    whyItMattersToday:
      "Every modern orbital launch vehicle—from NASA's Saturn V and Artemis SLS to SpaceX Falcon 9 and Starship—relies directly on the multi-stage separation architecture and supersonic de Laval expansion nozzles first patented by Robert Goddard in 1915.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "In a rocket apparatus, a plurality of combustion chambers, each chamber having an expansion nozzle, and means for successively igniting the charges in said chambers and separating the spent chambers from the apparatus.",
      plainEnglish:
        "The master claim covering a multi-stage rocket vehicle comprising multiple combustion chambers, each equipped with an expansion nozzle, and mechanisms to successively ignite propellant charges and detach spent stages in flight.",
      keyInnovations: [
        "Multi-stage launch vehicle architecture",
        "In-flight structural staging and separation",
        "Sequential stage ignition",
      ],
      legalSignificance:
        "The cornerstone patent claim of modern aerospace engineering, establishing the legal foundation for multi-stage space launch vehicles.",
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "In a rocket apparatus, the combination of a combustion chamber, an expansion nozzle having a restricted throat and a diverging portion, and means for feeding propellant continuously into said combustion chamber under pressure.",
      plainEnglish:
        "A rocket propulsion assembly combining a pressurized combustion chamber, a converging-diverging de Laval expansion nozzle, and continuous propellant feed under pressure.",
      keyInnovations: [
        "Converging-diverging de Laval rocket nozzle",
        "Continuous pressurized propellant feed",
        "Supersonic gas enthalpy conversion",
      ],
      legalSignificance:
        "Protected the integration of supersonic converging-diverging nozzles into liquid and continuous rocket propulsion systems.",
    },
    {
      number: 3,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "In a rocket apparatus, a casing comprising a plurality of sections, means for releasing each section when its charge is consumed, and guide vanes positioned in the path of the discharging gases to maintain stability in flight.",
      plainEnglish:
        "A rocket vehicle casing divided into separable stage sections with automated release mechanisms and exhaust gas steering vanes for in-flight stabilization.",
      keyInnovations: [
        "Separable stage casing joints",
        "Automated burnout release mechanisms",
        "Jet vane thrust vector steering",
      ],
      legalSignificance:
        "Covered early thrust vector control (TVC) mechanisms using jet vanes directly immersed in the rocket exhaust plume.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Longitudinal Cross Section of Multi-Stage Rocket Apparatus",
      caption:
        "Cross-sectional blueprint showing stacked combustion stages, de Laval converging-diverging exhaust nozzles, and stage release latches.",
      svgType: "goddard-rocket",
      callouts: [
        {
          id: "gd-1",
          figureRef: "Fig. 1",
          label: "A",
          element: "Supersonic de Laval Nozzle",
          description:
            "Hourglass converging-diverging nozzle accelerating exhaust to supersonic velocity.",
          x: 50,
          y: 82,
        },
        {
          id: "gd-2",
          figureRef: "Fig. 1",
          label: "B",
          element: "Primary Combustion Chamber",
          description:
            "High-pressure combustion chamber engineered for continuous propellant combustion.",
          x: 50,
          y: 55,
        },
        {
          id: "gd-3",
          figureRef: "Fig. 1",
          label: "C",
          element: "Stage Separation Joint",
          description:
            "Spring-loaded mechanical latch decoupling depleted lower stage casings in flight.",
          x: 50,
          y: 40,
        },
        {
          id: "gd-4",
          figureRef: "Fig. 1",
          label: "D",
          element: "Upper Stage Payload Bay",
          description:
            "Upper stage compartment housing scientific instruments and recovery parachute.",
          x: 50,
          y: 18,
        },
      ],
    },
    {
      figureNumber: "Fig. 2",
      title: "Detailed Cross Section of Combustion Chamber & Feed Manifold",
      caption:
        "Enlarged mechanical detail of the high-pressure propellant feeding injectors, combustion throat, and refractory nozzle liner.",
      svgType: "goddard-rocket",
      callouts: [
        {
          id: "gd-5",
          figureRef: "Fig. 2",
          label: "E",
          element: "Throat Contraction Area",
          description:
            "Minimum cross-sectional throat where exhaust gas achieves Mach 1 sonic velocity.",
          x: 50,
          y: 65,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "In the early 20th century, rocketry was restricted to solid black-powder fireworks and artillery rockets. These single-stage projectiles had dismal thermodynamic efficiency (<2%), could not be throttled or guided, and carried the entire heavy casing deadweight from launch to burnout, making high-altitude atmospheric research or orbital spaceflight physically impossible.",
    priorArtLimitations: [
      "Congreve and Hale black-powder artillery rockets had low exhaust velocities ($v_e < 600\\text{ m/s}$) and heavy iron casings.",
      "Konstantin Tsiolkovsky had derived the rocket equation mathematically in 1903, but had built no working hardware, pumps, or nozzles.",
      "Single-stage mass ratios ($m_0/m_f$) could not mathematically provide the $\\Delta v$ needed to escape Earth's gravity well without staging.",
    ],
    breakthroughInsight:
      "Goddard recognized that by applying steam-turbine de Laval supersonic nozzles to rocket combustion, gas thermal energy could be converted into hypersonic exhaust ($v_e > 2,500\\text{ m/s}$) with >60% kinetic efficiency. Crucially, by dividing the rocket into separable stages that drop empty tank mass in flight, the vehicle's effective mass ratio multiplies exponentially.",
    patentWars: [
      {
        rivalName: "The New York Times Editorial Board (1920)",
        rivalClaim:
          "In a January 1920 editorial, The New York Times ridiculed Goddard's proposal to send a multi-stage rocket to the Moon, asserting that rockets could not operate in the vacuum of space because they had 'no air to push against.'",
        conflictDetails:
          "Goddard had already demonstrated experimentally in Clark University vacuum chambers that rocket thrust actually increases in vacuum ($F = \\dot{m}v_e + p_e A_e$) because ambient atmospheric backpressure no longer retards nozzle expansion.",
        resolution:
          "On July 17, 1969—as Apollo 11 was speeding toward the Moon powered by multi-stage liquid rocket engines—The New York Times published a historic retraction: 'Further investigation and experimentation have confirmed the findings of Isaac Newton in the 17th Century and it is now definitely established that a rocket can function in a vacuum as well as in an atmosphere. The Times regrets the error.'",
        legalOutcome:
          "In 1960, the United States Government and NASA paid a $1,000,000 patent infringement settlement to the estate of Robert H. Goddard, formally acknowledging that all American military and space rockets utilized Goddard's patented staging and nozzle designs.",
      },
    ],
    civilizationalImpact:
      "Goddard's 1915 patents laid the foundation for the Space Age. Wernher von Braun, Sergei Korolev, and NASA engineers directly studied Goddard's papers and patents to build the V-2, Redstone, Saturn V, Space Shuttle, and interplanetary exploration probes.",
    funFact:
      "On March 16, 1926, in Auburn, Massachusetts, Goddard launched the world's first liquid-propellant rocket. Fueled by gasoline and liquid oxygen, the 10-foot rocket flew for 2.5 seconds, reached an altitude of 41 feet, and landed in a cabbage patch 184 feet away, marking the 'Kitty Hawk of Rocketry.'",
    aftermath:
      "With financial backing from Charles Lindbergh and the Guggenheim Foundation, Goddard moved to Roswell, New Mexico, where he built and test-fired gyroscope-stabilized, liquid-fueled rockets up to 9,000 feet altitude throughout the 1930s. Today, NASA's premier space flight center in Greenbelt, Maryland, is named the Goddard Space Flight Center in his honor.",
    sideNotes: [
      "US Patent 1,102,653 (July 1914) protected Goddard's liquid-propellant combustion chamber and de Laval nozzle; US Patent 1,155,986 (October 1915) protected the multi-stage vehicle architecture.",
      "Goddard was granted 214 patents during his lifetime and posthumously, covering gyroscopic steering, turbopumps, variable-thrust throttles, and ceramic combustion liners.",
    ],
  },
  tags: [
    "Robert Goddard",
    "Multi-Stage Rocket",
    "Space Exploration",
    "de Laval Nozzle",
    "Liquid Propellant",
    "Astronautics",
    "Apollo",
    "Supersonic Aerodynamics",
  ],
  stats: {
    totalClaims: 3,
    independentClaims: 1,
    patentWarYears: "1913–1960",
    impactScore: 100,
  },
};
