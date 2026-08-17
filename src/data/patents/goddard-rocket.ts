import type { Patent } from "@/types/patent";

export const goddardRocketPatent: Patent = {
  id: "us-1155986-goddard-rocket",
  patentNumber: "US 1,155,986",
  title: "Rocket Apparatus",
  shortTitle: "Goddard's Multi-Stage Liquid Rocket",
  subtitle:
    "Multi-Stage Staging and Supersonic de Laval Expansion Nozzles for Extreme Altitudes and Spaceflight",
  inventors: ["Robert H. Goddard"],
  inventorLocation: "Worcester, Massachusetts",
  grantDate: "1915-10-05",
  filingDate: "1913-10-01",
  era: "Early Aviation (1900–1910)",
  category: "aviation",
  categoryLabel: "Aerospace & Rocket Propulsion",
  summary:
    "Goddard's 1914 staging and nozzle patents: liquid propellant through a de Laval throat, then drop the empty tank. The 1926 Auburn flight lasted 2.5 seconds and 41 feet. The mass-ratio argument is the same one Falcon 9 still uses.",
  heroQuote:
    "Be it known that I, Robert H. Goddard, a citizen of the United States, residing at Worcester, in the County of Worcester and State of Massachusetts, have invented certain new and useful Improvements in Rocket Apparatus...",
  originalPdfUrl: "/patents/pdfs/us-1155986-goddard-rocket.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US1155986A/en",
  usptoClassification: "F02K 9/00 (Rocket-engine plants)",
  originalText: `UNITED STATES PATENT OFFICE.
ROBERT H. GODDARD, OF WORCESTER, MASSACHUSETTS.

ROCKET APPARATUS.

1,155,986. Specification of Letters Patent. Patented Oct. 5, 1915.
Application filed October 1, 1913. Serial No. 792,869.

To all whom it may concern:
Be it known that I, ROBERT H. GODDARD, a citizen of the United States, residing at Worcester, in the County of Worcester and State of Massachusetts, have invented certain new and useful Improvements in Rocket Apparatus, of which the following is a specification.

This invention relates to rocket apparatus, and has for its primary object the provision of a rocket which can reach extreme altitudes, far beyond the limits attainable with ordinary rockets, for meteorological, scientific, or other purposes.

A major difficulty with ordinary rockets is that the ratio of the weight of the propellant to the total initial weight of the rocket is small, and that the dead weight of the casing must be accelerated throughout the entire flight. Furthermore, the gases produced by combustion are discharged with low velocity, resulting in very low efficiency.

In the apparatus of my invention, the propellant is burned in a combustion chamber having a properly shaped expansion nozzle, whereby the heat energy of the combustion gases is converted into kinetic energy of a high-velocity jet with great efficiency. Furthermore, the apparatus is arranged in a plurality of stages or sections, so that as the propellant in one section is consumed, that section is detached and dropped, thereby reducing the mass to be accelerated by the succeeding section.`,
  plainEnglishExplanation: {
    overview:
      "Before Robert Goddard, rockets were simple solid-gunpowder fireworks that could barely reach a mile high because they had to carry heavy burnt-out iron casings the entire way. Goddard proved two critical concepts required to reach space: multi-stage rockets that discard empty deadweight in flight, and supersonic de Laval expansion nozzles that convert hot combustion gases into massive kinetic exhaust thrust.",
    coreMechanism:
      "Propellant burns inside a high-pressure combustion chamber and exhausts through a supersonic hourglass-shaped de Laval nozzle ($F = \\dot{m} v_e$). As lower stages deplete their fuel, mechanical release latches decouple the empty stage, allowing the lighter upper stage to ignite and accelerate to orbital velocity.",
    mechanicalBreakdown: [
      {
        title: "Supersonic de Laval Expansion Nozzle",
        summary:
          "Hourglass-shaped nozzle converting combustion gas thermal enthalpy into supersonic kinetic velocity.",
        technicalDetails:
          "Accelerates gas from subsonic combustion through Mach 1 at the throat to Mach 3+ at the diverging exit cone ($v_e = \\sqrt{\\frac{2\\gamma R T_0}{(\\gamma-1)M} [1 - (p_e/p_0)^{(\\gamma-1)/\\gamma}]}$).",
        archaicTerm: "Expansion nozzle with tapered throat",
        modernEquivalent: "Supersonic de Laval rocket nozzle",
      },
      {
        title: "Multi-Stage Progressive Jettison Mechanism",
        summary: "Automated latches separating depleted fuel stages in flight.",
        technicalDetails:
          "Dramatically improves the mass fraction at each staging event, multiplying final vehicle velocity under the rocket equation ($v_f = v_e \\ln(m_0 / m_f)$).",
        archaicTerm: "Detachable cartridge sections",
        modernEquivalent: "Multi-stage launch vehicle staging",
      },
      {
        title: "High-Pressure Liquid Combustion Chamber",
        summary: "Combustion chamber engineered for continuous propellant burning.",
        technicalDetails:
          "Handles intense combustion pressures and thermal loads without detonating.",
        archaicTerm: "Combustion chamber with propellant feed",
        modernEquivalent: "Regeneratively cooled rocket combustion chamber",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Tsiolkovsky Rocket Equation & Multi-Stage Mass Ratio",
        formula:
          "\\Delta v = v_e \\cdot \\ln\\left(\\frac{m_0}{m_f}\\right) = I_{sp} g_0 \\cdot \\ln\\left(\\frac{m_0}{m_f}\\right)",
        explanation:
          "Jettisoning empty structural mass at each stage allows the upper stages to achieve terminal velocities exceeding Earth escape velocity (11.2 km/s).",
      },
      {
        principle: "Supersonic Compressible Flow & Nozzle Expansion",
        formula:
          "\\frac{A}{A^*} = \\frac{1}{M}\\left[\\frac{2 + (\\gamma-1)M^2}{\\gamma+1}\\right]^{\\frac{\\gamma+1}{2(\\gamma-1)}}",
        explanation:
          "The converging-diverging geometry expands high-pressure exhaust gas into the vacuum of space, maximizing thrust and specific impulse.",
      },
    ],
    whyItMattersToday:
      "Falcon 9 still throws away (or now lands) a stage so the upper stage is not hauling empty tanks. That is Goddard's 1914 mass-fraction claim with better metallurgy.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "In a rocket apparatus, a plurality of combustion chambers, each chamber having an expansion nozzle, and means for successively igniting the charges in said chambers and separating the spent chambers from the apparatus.",
      plainEnglish:
        "The master claim covering a multi-stage rocket with multiple combustion chambers, expansion nozzles, and a mechanism to successively ignite charges and detach spent chambers.",
      keyInnovations: [
        "Multi-stage rocket architecture",
        "Supersonic expansion nozzles",
        "In-flight detachment of empty propellant stages",
      ],
      legalSignificance:
        "The foundational patent of modern astronautics and space launch vehicle staging.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Longitudinal Cross Section of Multi-Stage Rocket Apparatus",
      caption:
        "Cross-sectional blueprint showing stacked combustion stages, de Laval nozzles, and stage release mechanisms.",
      svgType: "goddard-rocket",
      callouts: [
        {
          id: "gd-1",
          figureRef: "Fig. 1",
          label: "A",
          element: "Supersonic Nozzle",
          description: "Hourglass-shaped de Laval exhaust nozzle.",
          x: 50,
          y: 80,
        },
        {
          id: "gd-2",
          figureRef: "Fig. 1",
          label: "B",
          element: "Combustion Chamber",
          description: "High-pressure propellant combustion chamber.",
          x: 50,
          y: 50,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "A Congreve stick-rocket is a gunpowder case you throw away all at once. Tsiolkovsky (1903) already had $\\Delta v = v_e \\ln(m_0/m_f)$. Nobody in America had a pump, a regenerative chamber, and a nozzle that would not melt, in one vehicle.",
    priorArtLimitations: [
      "Black-powder artillery rockets, low $v_e$, no throttle.",
      "Tsiolkovsky and Oberth on paper.",
      "Single-stage mass ratios that could not reach orbit even in theory.",
    ],
    breakthroughInsight:
      "Goddard's 1914 patents split the problem: liquid propellants through a de Laval nozzle (high $v_e$), and staging so you stop carrying empty tankage. The 1926 Auburn flight was gasoline and liquid oxygen, 2.5 seconds, 41 feet. Ugly. First.",
    patentWars: [
      {
        rivalName: "The New York Times editorial page (1920)",
        rivalClaim:
          "A rocket cannot work in vacuum because there is nothing to push against. Goddard, Clark University, 'does not know the relation of action to reaction.'",
        conflictDetails:
          "Goddard had already run motors in a vacuum tank. Thrust rises as $p_a$ falls: $F = \\dot{m}v_e + (p_e-p_a)A_e$. On 17 July 1969 the Times printed a retraction while Apollo 11 was on the way to the Moon.",
        resolution:
          "The US government settled Goddard's estate in 1960 for $1 million, covering a stack of patents NASA and the Army had been using.",
        legalOutcome: "No infringement spectacle. A quiet taking, then a check to the widow.",
      },
    ],
    civilizationalImpact:
      "Von Braun read Goddard. So did the GALCIT group that became JPL. Staging and liquid oxygen are still how a first stage leaves Florida.",
    funFact:
      "The 16 March 1926 stand was a pipe frame in an Aunt Effie farm field. The rocket went up, sideways, and into the cabbage. Esther Goddard ran the camera.",
    aftermath:
      "Lindbergh got Guggenheim money to move Goddard to Roswell. The Army mostly ignored him until the V-2s arrived. He died in 1945, just as the German files proved he had been right about almost every subsystem.",
    sideNotes: [
      "US 1,102,653 is the rocket apparatus; US 1,155,986 is the multi-stage claim. The museum treats them as one story because Goddard did.",
      "He was secretive to a fault. American rocketry duplicated some of his work because he would not publish drawings.",
    ],
  },
  tags: [
    "Robert Goddard",
    "Rocketry",
    "Space Exploration",
    "Multi-Stage",
    "de Laval Nozzle",
    "Apollo",
  ],
  stats: {
    totalClaims: 1,
    independentClaims: 1,
    patentWarYears: "1913–1960",
    impactScore: 99,
  },
};
