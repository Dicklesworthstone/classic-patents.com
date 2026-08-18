import { otisElevatorArchivalEdition } from "@/data/editions/otisElevatorEdition";
import type { Patent } from "@/types/patent";

/** Source-checked catalogue record for the actual four-claim US 31,128 grant. */
/*
 * Preserved, unreviewed pre-edition draft. It is deliberately not exported or
 * executed: its leaf-spring narrative and two claims do not describe US 31,128.
 */
/* const _unreviewedOtisElevatorDraft: Patent = {
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
*/

/** Source-checked catalogue record for the actual four-claim US 31,128 grant. */
export const otisElevatorPatent: Patent = {
  id: "us-31128-otis-elevator",
  patentNumber: "US 31,128",
  title: "Improvement in Hoisting Apparatus",
  shortTitle: "Otis Hoist Safety Catch and Belt Brake",
  subtitle: "Hook Racks, Spring Pawls, Belt Shipper, and Counterpoise on a Winding Drum",
  inventors: ["Elisha Graves Otis"],
  inventorLocation: "Yonkers, Westchester County, New York",
  grantDate: "1861-01-15",
  filingDate: "1860-08-15",
  era: "Civil War & Industrial Acceleration (1860–1880)",
  category: "consumer",
  categoryLabel: "Hoisting Machinery & Safety Engineering",
  summary:
    "US 31,128 describes a powered hoisting apparatus, not a simple leaf-spring elevator catch. Otis combines a platform lifted by rope G, hook-form racks C and spring-biased pawls f f that lock on rope failure, a hand-operated belt shipper and brake, a lower-travel stop, and a counterpoise rope Q wound on the opposite side of drum H.",
  heroQuote:
    "In case the rope G should break in hoisting the loaded platform D, the pawls f f … will immediately be thrown in connection with the racks C C.",
  originalPdfUrl: "/patents/pdfs/us-31128-otis-elevator.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US31128A/en",
  usptoClassification: "B66B 5/26 (positively acting catch devices for elevators)",
  originalTextAsset: {
    url: "/patents/transcripts/us-31128-otis-elevator.txt",
    pageCount: 3,
    kind: "reviewed-transcription",
    reviewedBy: "CopperLotus, direct PDF comparison",
    reviewedAt: "2026-08-17",
    sourcePdfSha256: "c35eb5c999bc20b015ef0d24a3ffb0f194123d780c8a46fabea7f2d52a355d42",
  },
  archivalEdition: otisElevatorArchivalEdition,
  originalText:
    "Be it known that I, E. G. OTIS, of Yonkers, in the county of Westchester and State of New York, have invented a new and Improved Hoisting Apparatus. The complete source-checked specification, all four claims, figures, signature, and witnesses are presented in the manually prepared Original Patent Text edition.",
  plainEnglishExplanation: {
    overview:
      "Otis builds a hoist in which the normal drive, the hand control, the service brake, the lowest-travel stop, the counterweight, and the broken-rope catch are mechanically coordinated. Its safety claim is specific: when lifting rope G loses its pull, springs drive pawls f f into upward hook teeth C C; platform weight then pulls the hooks together rather than prying the uprights apart.",
    coreMechanism:
      "Drum H winds lifting rope G while an opposite-wound rope Q carries counterpoise R. Shaft I uses belts O and P, idle pulleys J and K, and working pulley L to choose motion. Hand rope T moves slide S through drum r, pinion p, and rack o. At a stop, fork V aligns its branches, moves both belts off their working drive, and presses shoe Z against L. If G breaks, springs e, g, and g put pawls f f into hook racks C C and the load geometry locks them.",
    mechanicalBreakdown: [
      {
        title: "Hook Racks and Safety Pawls",
        summary:
          "Pawls f f pivot on levers E and enter hook-form rack teeth C C when rope G no longer holds the mechanism released.",
        technicalDetails:
          "Springs e, g, and g urge the pawls toward engagement. With the loaded platform falling, the upward-pointing hook teeth make the force draw uprights B B inward, which is the claimed anti-separation condition rather than a generic friction brake.",
        archaicTerm: "pawls in gear with the racks",
        modernEquivalent: "positive mechanical safety catch",
      },
      {
        title: "Belt Shipper and Brake Shoe",
        summary: "Slide S changes belt positions while shoe Z bears on working pulley L.",
        technicalDetails:
          "Rope T turns drum r; pinion p engages rack o to move S. The same linkage shifts belts O and P to idle pulleys and presses Z on L, so stopping power transmission and applying the brake occur together.",
        archaicTerm: "belt-shipper",
        modernEquivalent: "sliding belt selector",
      },
      {
        title: "Forked Stop Rope",
        summary:
          "Rope U and branched end V convert a stop pull into a non-actuating locked position.",
        technicalDetails:
          "When U is pulled down, its two u branches reach one horizontal plane. That geometry lets V actuate T during running but prevents it from moving T after the brake is applied, which is the limitation in claim 2.",
        archaicTerm: "branched end V",
        modernEquivalent: "forked stop linkage",
      },
      {
        title: "Drum Counterpoise",
        summary:
          "Counterweight R is connected by rope Q to drum H rather than directly to platform D.",
        technicalDetails:
          "Q winds on the opposite direction from G. The arrangement offsets platform weight but leaves the platform-side safety mechanism free to lock when G breaks, which is the functional limit in claim 4.",
        archaicTerm: "counterpoise",
        modernEquivalent: "counterweight",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Torque reversal through crossed belts",
        formula: "τ = F × r",
        explanation:
          "Moving cross-belt P between idle and working pulleys reverses the rotation delivered to the winding train. Otis couples that directional selection to the stop and brake linkage instead of treating it as a separate control.",
      },
      {
        principle: "Positive hook engagement under load",
        formula: "W = m g",
        explanation:
          "After G fails, platform weight supplies the load that seats pawls f f in hook racks C C. The patent's key geometric claim is that this force tends to draw the uprights together and therefore resists accidental disengagement.",
      },
    ],
    whyItMattersToday:
      "The grant records an early integrated approach to hoisting safety: a positive rope-failure catch, controlled braking, travel limit, and counterweight are described as interacting mechanisms. It is a direct historical source for the engineering problem that later elevator safety systems continued to address.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "Having the pawls f f and the teeth of the racks C C hook-formed, essentially as shown, so that the weight of the platform will, in case of the breaking of the rope G, cause the pawls and teeth to lock together and prevent the contingency of a separation of the same, as herein set forth.",
      plainEnglish:
        "Claim 1 requires hook-form pawls and racks arranged so a broken lifting rope G lets platform weight lock them together. The legal point is the load-directed geometry that prevents separation, not merely the existence of a spring or a brake.",
      keyInnovations: ["hook-form rack teeth", "pivoted pawls f f", "rope-failure load lock"],
    },
    {
      number: 2,
      isIndependent: true,
      originalText:
        "The arrangement of the ropes T, U, and V, combined and operating substantially as and for the purpose set forth.",
      plainEnglish:
        "Claim 2 covers the combined hand rope T, stop rope U, and fork V. Their arrangement both actuates the running control and, once aligned horizontally at the stop, prevents that stop linkage from moving the rope again.",
      keyInnovations: ["hand rope T", "stop rope U", "branched end V"],
    },
    {
      number: 3,
      isIndependent: true,
      originalText:
        "The arrangement of the slide or belt-shipper S with the shoe or brake Z and rope T, substantially as shown, to admit of the simultaneous application of the brake and the shifting of the belts O P on the idle-pulleys J K, as set forth.",
      plainEnglish:
        "Claim 3 covers the linkage in which rope T moves slide S, shifts belts O and P onto the idle pulleys J and K, and applies brake shoe Z at the same time. It is a claim to coordinated power disengagement and braking.",
      keyInnovations: ["slide S", "brake shoe Z", "simultaneous belt shifting"],
    },
    {
      number: 4,
      isIndependent: true,
      originalText:
        "Attaching the rope Q of the counterpoise R to the drum H on the opposite side from the lifting-rope G, substantially as shown, so as to counterpoise the platform D without preventing or interfering with the action of the safety mechanism E e f.",
      plainEnglish:
        "Claim 4 places counterpoise rope Q on the opposite side of drum H from lifting rope G. The arrangement must balance platform D while preserving the operation of safety mechanism E e f.",
      keyInnovations: [
        "counterpoise rope Q",
        "opposite drum winding",
        "unobstructed safety mechanism",
      ],
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Vertical section of the hoisting apparatus",
      caption: "Source drawing sheet, Figure 1: vertical section taken on line x x of Figure 2.",
      svgType: "otis-elevator",
      callouts: [
        {
          id: "oe-fig1-a",
          figureRef: "Fig. 1",
          label: "A",
          element: "Base or platform",
          description: "Base carrying the hoisting apparatus.",
          x: 73,
          y: 77,
        },
        {
          id: "oe-fig1-h",
          figureRef: "Fig. 1",
          label: "H",
          element: "Winding drum",
          description: "Drum to which lifting rope G and counterpoise rope Q attach.",
          x: 67,
          y: 37,
        },
        {
          id: "oe-fig1-r",
          figureRef: "Fig. 1",
          label: "R",
          element: "Counterpoise",
          description: "Weight on rope Q.",
          x: 78,
          y: 73,
        },
      ],
    },
    {
      figureNumber: "Fig. 2",
      title: "Front view of the hoisting apparatus",
      caption:
        "Source drawing sheet, Figure 2: front view identifying platform D, hook racks C C, levers E E, pawls f f, and the winding and belt gear.",
      svgType: "otis-elevator",
      callouts: [
        {
          id: "oe-fig2-c",
          figureRef: "Fig. 2",
          label: "C",
          element: "Hook racks",
          description: "Upward-inclined hook teeth that receive pawls f f.",
          x: 60,
          y: 25,
        },
        {
          id: "oe-fig2-d",
          figureRef: "Fig. 2",
          label: "D",
          element: "Platform",
          description: "Load-bearing platform between the uprights.",
          x: 52,
          y: 45,
        },
        {
          id: "oe-fig2-f",
          figureRef: "Fig. 2",
          label: "f",
          element: "Pawls",
          description: "Spring-biased safety catches on levers E E.",
          x: 19,
          y: 37,
        },
      ],
    },
    {
      figureNumber: "Fig. 3",
      title: "Detached side view of the stop mechanism",
      caption: "Source drawing sheet, Figure 3: the rope U, fork V, and related stop linkage.",
      svgType: "otis-elevator",
      callouts: [
        {
          id: "oe-fig3-u",
          figureRef: "Fig. 3",
          label: "U",
          element: "Stop rope",
          description: "Rope that moves the forked stop linkage.",
          x: 49,
          y: 56,
        },
        {
          id: "oe-fig3-v",
          figureRef: "Fig. 3",
          label: "V",
          element: "Branched end",
          description: "Forked end whose alignment isolates rope T after stopping.",
          x: 46,
          y: 50,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "The document identifies two operating risks: stopping a suspended load at a desired point with a brake, and sustaining that load when lifting rope G breaks.",
    priorArtLimitations: [
      "The specification does not name a prior competing machine or a court dispute; it instead states the unsolved stop, brake, and rope-break problem directly.",
      "A direct counterpoise connection to cross-piece d would interfere with the platform safety mechanism, according to the description.",
    ],
    breakthroughInsight:
      "Otis integrates rope-failure pawls, a belt selector, brake shoe, stop linkage, and counterpoise so the normal drive and the safety action are mechanically distinct but coordinated.",
    patentWars: [],
    civilizationalImpact:
      "US 31,128 is primary evidence of a nineteenth-century attempt to make powered vertical hoisting safer through positive engagement rather than operator reaction alone.",
    aftermath:
      "The facsimile establishes the January 15, 1861 grant. This edition makes no further litigation or commercial claim without a separately cited historical source.",
  },
  tags: [
    "Elisha Graves Otis",
    "hoisting apparatus",
    "safety catch",
    "belt shipper",
    "counterpoise",
  ],
  stats: { totalClaims: 4, independentClaims: 4 },
};
