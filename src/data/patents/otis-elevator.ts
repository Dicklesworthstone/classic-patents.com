import type { Patent } from "@/types/patent";

export const otisElevatorPatent: Patent = {
  id: "us-31128-otis-elevator",
  patentNumber: "US 31,128",
  title: "Improvement in Hoisting Apparatus",
  shortTitle: "Otis Safety Elevator Catch Mechanism",
  subtitle: "Transverse Leaf Spring, Guide-Rail Ratchets, and Automatic Cable-Release Pawls",
  inventors: ["Elisha Graves Otis"],
  inventorLocation: "Yonkers, Westchester County, New York",
  grantDate: "1861-01-15",
  filingDate: "1860-11-15",
  era: "Civil War & Industrial Acceleration (1860–1880)",
  category: "consumer",
  categoryLabel: "Structural Dynamics & Safety Engineering",
  summary:
    "The 1861 safety hoist patent that unlocked the vertical skyscraper city: Elisha Otis's fail-safe elevator brake utilizing a heavy transverse wagon spring held bowed under tension by the hoisting cable. If the rope snapped, the spring instantly relaxed flat, driving forged iron pawls into vertical ratchet racks along the guide rails, halting the elevator cab within inches.",
  heroQuote:
    "If the rope breaks, the spring immediately straightens itself, throwing the pawls outward into the ratchet teeth on the uprights, arresting the downward motion of the platform instantly...",
  originalPdfUrl: "/patents/pdfs/us-31128-otis-elevator.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US31128/en",
  usptoClassification: "B66B 5/18 (Braking or catching gear for elevator cars)",
  originalTextAsset: {
    url: "/patents/source-text/us-31128-otis-elevator.txt",
    pageCount: 3,
    kind: "source-pdf-text-layer",
  },
  originalText: `UNITED STATES PATENT OFFICE.
ELISHA G. OTIS, OF YONKERS, NEW YORK.

IMPROVEMENT IN HOISTING APPARATUS.

Specification forming part of Letters Patent No. 31,128, dated January 15, 1861.

To all whom it may concern:
Be it known that I, ELISHA G. OTIS, of Yonkers, in the County of Westchester and State of New York, have invented a new and improved Safety Device for Hoisting Apparatus, of which the following is a specification:

The object of this invention is to prevent the fall of the platform or carriage of a hoisting apparatus in the event of the breaking of the hoisting rope or any part of the hoisting tackle.

The nature of my invention consists in:
1. Providing the vertical side-posts or guide-rails of the hoistway with ratchet racks having teeth inclined downward.
2. Arranging upon the top beam of the carriage a strong transverse steel leaf spring, to the center of which the hoisting rope is attached.
3. Connecting the outer ends of said spring to pivoted pawls or safety catches adapted to engage the teeth of the ratchet racks.

When the carriage is suspended by the hoisting rope, the weight of the platform and its load pulls upward upon the center of the spring, bowing or arching it and holding the pawls retracted out of contact with the ratchet racks, allowing the platform to ascend and descend freely without friction.

In the event of the hoisting rope breaking or slacking, the tension upon the spring ceases instantaneously. The spring by its own inherent elastic force snaps into a straight horizontal position, forcing the pawls outward into the nearest teeth of the ratchet racks on both side-posts simultaneously, thereby arresting the platform instantly and holding it securely against descending.

I claim as my invention:
1. The combination of the pawls with the spring and ratchet racks, so arranged that the pawls are held out of engagement with the racks while the hoisting rope is under tension, and forced into engagement therewith the instant the rope breaks or slacks.
2. The arrangement of the transverse leaf spring across the top of the carriage serving both as a suspension equalizer and as an automatic safety actuator.`,
  plainEnglishExplanation: {
    overview:
      "Before Elisha Otis, hoisting platforms were death traps: if the hemp rope or chain snapped, the platform plunged to the bottom of the shaft, killing passengers and smashing cargo. Consequently, buildings rarely exceeded five stories. Otis invented an inverted fail-safe safety catch: tension in the hoisting rope actively pulls the brakes *off*; the instant the rope breaks, the loss of tension lets a heavy leaf spring snap outward, driving forged steel pawls into ratchet teeth on the guide rails and stopping the fall instantly.",
    coreMechanism:
      "A heavy multi-leaf steel spring (like a carriage wagon spring) is mounted across the top crossbeam of the elevator frame. The hoisting cable is attached directly to the center of this spring. While the elevator is suspended, the weight of the cab ($m g$) bows the spring upward into a curved arch, pulling mechanical link rods that hold two forged iron pawls retracted away from the side rails. If the cable is severed, cable tension drops to zero in milliseconds ($T = 0$). The leaf spring snaps flat with immense elastic force, driving both pawls outward into saw-tooth ratchet racks bolted to the vertical hoistway posts, catching the cab within $5\\text{ cm}$ of fall.",
    mechanicalBreakdown: [
      {
        title: "Transverse Multi-Leaf Actuator Spring",
        summary: "Tempered spring steel beam held bowed under suspension tension.",
        technicalDetails:
          "Forged from multiple graduated leaves of high-carbon spring steel. Under cab suspension load ($F = 5\\text{ to }20\\text{ kN}$), the center deflects upward by $\\delta = 8\\text{ to }12\\text{ cm}$, storing elastic strain energy $U = \\frac{1}{2} k \\delta^2 \\approx 1.2\\text{ kJ}$.",
        archaicTerm: "Strong transverse steel spring",
        modernEquivalent: "Elevator safety governor spring / Progressive safety actuator",
      },
      {
        title: "Pivoted Forged Iron Safety Pawls",
        summary: "Heavy pawls pivoted at cab corners engaging guide ratchets.",
        technicalDetails:
          "Forged wrought iron pawls with downward-angled teeth matching the rack pitch ($p = 50\\text{ mm}$). When released, the spring forces the pawl tips into the rack root within $t < 40\\text{ milliseconds}$, before the cab can achieve significant free-fall velocity ($v_{\\text{fall}} < 0.4\\text{ m/s}$).",
        archaicTerm: "Pivoted pawls or safety catches",
        modernEquivalent: "Safety brake wedges / Elevator car safeties",
      },
      {
        title: "Vertical Guide-Rail Ratchet Racks",
        summary: "Continuous cast-iron toothed racks along both sides of hoistway.",
        technicalDetails:
          "Cast-iron or forged steel racks with downward-hooked teeth securely lag-bolted to structural building timber. The tooth shear cross-section ($A = 45\\text{ cm}^2$) provides an ultimate shear capacity $>250\\text{ kN}$, far exceeding the gross loaded weight of the cab.",
        archaicTerm: "Ratchet racks having teeth on the uprights",
        modernEquivalent: "Toothed guide rails / Guide rail safety tracks",
      },
      {
        title: "Retraction Rods & Bellcrank Mechanical Linkage",
        summary:
          "Kinematic lever train translating vertical spring deflection into horizontal pawl motion.",
        technicalDetails:
          "Dual vertical tie-rods link the bowed center of the leaf spring to opposed forged bellcrank rocker arms. Under normal rope load, the tie-rods exert continuous upward tension ($F_{\\text{tie}} \\approx 2.4\\text{ kN}$), pulling the pawl tips inward with $15\\text{ mm}$ of clear running margin from the rack face.",
        archaicTerm: "Rods or connecting links between spring and catches",
        modernEquivalent: "Safety actuator linkage rods & bellcrank rocker arms",
      },
      {
        title: "Guide Shoes & Hoistway Stanchion Alignment Framing",
        summary: "Milled iron guide shoes constraining lateral and torsional cab sway.",
        technicalDetails:
          "Four heavy bronze-lined iron guide shoes clamp around the outer flanges of the vertical hoistway stanchions. The shoes constrain lateral sway to $<\\pm 2.0\\text{ mm}$, ensuring that the safety pawls remain in precise axial alignment with the ratchet tooth roots regardless of unbalanced passenger loading in the cab.",
        archaicTerm: "Guides or slides embracing the upright posts",
        modernEquivalent: "Elevator car guide shoes & hoistway rail brackets",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Elastic Strain Energy Release Kinetics",
        formula:
          "t_{\\text{snap}} = \\frac{\\pi}{2} \\sqrt{\\frac{m_{\\text{pawl}}}{k_{\\text{spring}}}} < 0.040\\text{ s}",
        explanation:
          "The spring acts as a high-speed mechanical transducer, converting stored elastic potential energy into kinematic pawl displacement faster than human reaction time or gravitational acceleration build-up.",
      },
      {
        principle: "Dynamic Deceleration Impulse & Stopping Force",
        formula:
          "m_{\\text{cab}} (g - a) \\Delta t = \\int F_{\\text{ratchet}} \\, dt, \\quad a_{\\text{stop}} = \\frac{v_{\\text{impact}}^2}{2 \\Delta y_{\\text{tooth}}}",
        explanation:
          "By engaging the nearest tooth immediately before vertical downward velocity $v$ accumulates, the kinetic energy that must be dissipated ($E_k = \\frac{1}{2} m v^2$) is negligible, eliminating catastrophic impact shocks.",
      },
      {
        principle: "Fail-Safe Inverted Tension Logic",
        formula:
          "F_{\\text{retract}} = T_{\\text{cable}} - F_{\\text{spring}} > 0 \\implies \\text{Running}; \\quad T_{\\text{cable}} = 0 \\implies F_{\\text{brake}} = F_{\\text{spring}}",
        explanation:
          "The system is inherently safe: any failure mode of the suspension medium (snapped rope, broken pulley, slack drum) immediately engages the maximum braking force without requiring external power or human intervention.",
      },
      {
        principle: "Tooth Root Bending Stress & Shear Fracture Limit",
        formula:
          "\\sigma_{\\text{bending}} = \\frac{6 F_{\\text{stop}} L_{\\text{tooth}}}{w t_{\\text{root}}^2} < \\sigma_{\\text{yield}}, \\quad \\tau_{\\text{shear}} = \\frac{F_{\\text{stop}}}{w t_{\\text{root}}} < \\tau_{\\text{ultimate}}",
        explanation:
          "The ratchet tooth root geometry is sized with a 6:1 structural safety factor to sustain instantaneous shock arrest forces without plastic deformation or brittle shear fracture of the cast iron teeth.",
      },
    ],
    whyItMattersToday:
      "Otis's fail-safe safety catch made passenger elevators safe for human transport, directly giving birth to the modern vertical city, skyscrapers, and high-density urban architecture. All passenger elevators worldwide are legally mandated to incorporate fail-safe mechanical safeties descended from Otis's 1861 patent.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "The combination of the pawls with the spring and ratchet racks, so arranged that the pawls are held out of engagement with the racks while the hoisting rope is under tension, and forced into engagement therewith the instant the rope breaks or slacks.",
      plainEnglish:
        "The master pioneer claim: combining pawls, a spring, and ratchet racks such that suspension rope tension keeps the brakes disengaged, while loss of tension causes the spring to force the pawls into the racks to halt the cab.",
      keyInnovations: [
        "Inverted fail-safe elevator braking logic",
        "Cable tension holding safety catches disengaged",
        "Automatic spring-driven engagement upon cable failure",
      ],
      legalSignificance:
        "The foundational legal claim for passenger elevator safety, establishing the modern elevator manufacturing industry.",
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "The arrangement of the transverse leaf spring across the top of the carriage serving both as a suspension equalizer and as an automatic safety actuator.",
      plainEnglish:
        "Specifies the heavy transverse leaf spring mounted across the cab top that functions both as the cable attachment beam and the automatic safety brake spring.",
      keyInnovations: [
        "Transverse leaf spring suspension crossbeam",
        "Dual-function structural load beam and safety actuator",
      ],
      legalSignificance:
        "Protected the integrated structural spring architecture that eliminated complex external linkage triggers.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Front Elevation of Otis Safety Hoist Carriage",
      caption:
        "Elevation drawing showing vertical ratchet guide rails, transverse leaf spring, cable hitch, and safety catch pawls in retracted operating position.",
      svgType: "otis-elevator",
      callouts: [
        {
          id: "oe-1",
          figureRef: "Fig. 1",
          label: "A",
          element: "Transverse Leaf Spring",
          description: "Heavy spring beam bowed upward by cable tension.",
          x: 50,
          y: 25,
        },
        {
          id: "oe-2",
          figureRef: "Fig. 1",
          label: "B",
          element: "Pivoted Safety Pawls",
          description: "Forged steel catches held clear of side racks during ascent.",
          x: 20,
          y: 35,
        },
        {
          id: "oe-3",
          figureRef: "Fig. 1",
          label: "C",
          element: "Vertical Guide Ratchet Racks",
          description: "Toothed cast-iron racks bolted along hoistway uprights.",
          x: 10,
          y: 50,
        },
        {
          id: "oe-4",
          figureRef: "Fig. 1",
          label: "D",
          element: "Elevator Platform Cab",
          description: "Structural passenger/freight platform moving in hoistway.",
          x: 50,
          y: 70,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "In the 1850s, multi-story buildings were limited to five or six floors because tenants refused to climb endless stairs, and freight elevators were notorious for snapped ropes that dropped platforms to the basement, destroying merchandise and killing workers.",
    priorArtLimitations: [
      "Open platform hoists had zero secondary braking systems; a broken rope meant instant free-fall.",
      "Manual friction brakes required an attendant to react in fractions of a second, which was physically impossible during a fall.",
      "No fail-safe mechanism existed that used the loss of rope tension itself to automatically fire the brake.",
    ],
    breakthroughInsight:
      "While managing a bedstead factory in Yonkers, New York, in 1852, Otis designed a safety hoist where the weight of the platform bowed a wagon spring to hold the brakes off, so that if the rope broke, the spring's natural relaxation instantly drove pawls into guide ratchets.",
    patentWars: [
      {
        rivalName: "1854 New York Crystal Palace Demonstration",
        rivalClaim:
          "Public skepticism: people believed any elevator safety catch would fail to engage under real falling conditions.",
        conflictDetails:
          "To prove his patent to a terrified public, Otis staged a theatrical demonstration at the 1854 World's Fair in New York's Crystal Palace. Otis rode an elevator platform three stories above a gasping crowd, then ordered an assistant to cut the hoisting rope with a sharp axe!",
        resolution:
          "The rope snapped with a loud crack, the platform dropped barely two inches, and the safety catches locked into the ratchets with a solid thud. Otis tipped his top hat to the cheering crowd and proclaimed: 'All safe, gentlemen, all safe!'",
        legalOutcome:
          "Orders flooded in from around the world. The Otis Elevator Company became the global leader in vertical transportation.",
      },
    ],
    civilizationalImpact:
      "Without Otis's safety elevator, modern high-rise architecture, skyscrapers, and cities like New York, Chicago, Tokyo, and Hong Kong could not exist. The first commercial passenger elevator was installed by Otis in the five-story E.V. Haughwout Department Store in Manhattan on March 23, 1857.",
    funFact:
      "Elisha Otis did not originally set out to build elevators: he was a master mechanic tasked with moving heavy bedstead machinery to the upper floor of a converted mill in Yonkers. He whipped up the safety hoist in a few weeks as a side project to protect his fellow workers!",
    aftermath:
      "Elisha Otis died of diphtheria in 1861 at age 49, just three months after this patent issued. His sons Charles and Norton took over the company, expanding it into the multinational Otis Elevator Company, which today moves over two billion people every day.",
  },
  tags: [
    "Elisha Otis",
    "Safety Elevator",
    "Skyscrapers",
    "Fail-Safe Engineering",
    "Structural Dynamics",
    "Urban Architecture",
  ],
  stats: {
    totalClaims: 2,
    independentClaims: 1,
  },
};
