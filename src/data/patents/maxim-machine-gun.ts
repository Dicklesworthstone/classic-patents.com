import { maximMachineGunArchivalEdition } from "@/data/editions/maximMachineGunEdition";
import type { Patent } from "@/types/patent";

function manualClaimText(number: number): string {
  const block = maximMachineGunArchivalEdition.blocks.find(
    (candidate) => candidate.kind === "claim" && candidate.number === number,
  );
  if (block?.kind !== "claim") {
    throw new Error(`US 319,596 is missing claim ${number} in its archival edition.`);
  }
  return block.inlines.map((inline) => inline.text).join("");
}

export const maximMachineGunPatent: Patent = {
  id: "us-319596-maxim-machine-gun",
  patentNumber: "US 319,596",
  title: "Machine-Gun",
  shortTitle: "Maxim Muzzle-Gas Machine Gun",
  subtitle:
    "Direct Muzzle-Gas Sliding Sleeve, Direction-Reversing Linkage, and Crankshaft-Driven Breech Block",
  inventors: ["Hiram S. Maxim"],
  inventorLocation: "London, England",
  grantDate: "1885-06-09",
  filingDate: "1885-03-14",
  era: "Gilded Age & Grid (1870–1900)",
  category: "consumer",
  categoryLabel: "Firearms & Automatic Mechanism Linkages",
  summary:
    "In US Patent No. 319,596, granted June 9, 1885, Hiram S. Maxim claimed a machine gun operated directly by expanding gases issuing at the muzzle. Expanding propellant gases act on interior shoulders within a sliding muzzle sleeve, driving it forward along a fixed barrel; reversing levers and connecting rods transmit and invert this forward displacement to slide the breech-block rearward, extracting the spent case, cocking the firing pin, and winding a volute return spring on the crankshaft to power the forward reloading stroke.",
  heroQuote:
    "Expanding gases issuing at the muzzle act upon the shoulders of the sliding tubular piece to drive it forward and operate the breech mechanism.",
  originalPdfUrl: "/patents/pdfs/us-319596-maxim-machine-gun.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US319596A/en",
  usptoClassification: "F41A 5/04 (Gas-operated automatic firearms / Muzzle-gas cup mechanisms)",
  originalTextAsset: {
    url: "/patents/transcripts/us-319596-maxim-machine-gun-reviewed.txt",
    pageCount: 5,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-08-18",
    sourcePdfSha256: "ca385c254e2e390451a2eecd28273fee662afd0179451bcbf9f48bf8fde63dcb",
  },
  archivalEdition: maximMachineGunArchivalEdition,
  originalText: `UNITED STATES PATENT OFFICE.
HIRAM S. MAXIM, OF LONDON, COUNTY OF MIDDLESEX, ENGLAND.

MACHINE-GUN.

SPECIFICATION forming part of Letters Patent No. 319,596, dated June 9, 1885.
Application filed March 14, 1885. (No model.) Patented in England January 3, 1884, No. 606, and in France June 13, 1884, No. 162,737.

To all whom it may concern:
Be it known that I, HIRAM S. MAXIM, a citizen of the United States, residing at London, in the county of Middlesex, England, have invented certain new and useful Improvements in Machine-Guns, of which the following is a specification, reference being had to the drawings accompanying and forming a part of the same, this application being a division of one filed by me May 27, 1884, No. 132,883, and for an invention patented by me in Great Britain January 3, 1884, No. 606, and in France June 13, 1884, No. 162,737.

In Letters Patent of the United States granted to me on the 10th day of March, 1885, No. 313,607, is described a gun in which the gases of the discharge issuing from the muzzle of the barrel are used for performing or assisting in the operations of removing the empty cartridge-case, cocking the hammer, placing another cartridge in position to be fired, firing the same, or storing up energy for performing these or some of these operations. In the apparatus described in said Letters Patent, however, the gases of the discharge do not act directly upon the movable parts, but act upon them through the medium of a vacuum or open chamber surrounding the muzzle of the barrel, a vacuum or a pressure being produced in the said chamber and acting upon a piston or diaphragm to move the parts. My present invention differs from the above in that the gases of the discharge act directly upon a movable piece or part surrounding the muzzle of the barrel, so as to impart movement thereto without the intervention of an open chamber or vacuum.`,
  plainEnglishExplanation: {
    overview:
      "US 319,596 is Hiram Maxim's June 9, 1885 divisional grant for a direct muzzle-gas operated automatic gun. Unlike indirect vacuum chambers or moving-barrel designs, this patent describes a stationary barrel surrounded at the muzzle by a sliding sleeve. Expanding powder gases exiting the muzzle push against internal shoulders of the sleeve, driving it forward. A mechanical linkage reverses that forward motion into rearward travel of the breech block, extracting the empty cartridge case, cocking the firing pin, and winding a volute clock spring to power the return stroke.",
    coreMechanism:
      "When a cartridge is discharged down fixed barrel B, expanding propellant gases exiting the muzzle enter sliding tubular piece l and press against internal shoulders l². This drives sleeve l and its socket l′ forward along the barrel. Pivot links m and m′ rock reversing levers n around stationary frame pivots n′, which in turn pull connecting rods c′ rearward. The rear ends of rods c′ rotate crankshaft e via links f² and crank arms f. Crank pin e² engages a vertical slot in cross-head d, driving sliding breech-block C rearward to extract the spent case, cock firing pin i against sear h, and wind volute clock-spring k. The spring then unwinds, driving crankshaft e in reverse to push breech-block C forward, chamber the next round from feed wheels Q and Q′, and close the breech for the next shot.",
    mechanicalBreakdown: [
      {
        title: "Fixed Barrel B & Structural Frame A",
        summary:
          "Rigid barrel mounted permanently in the main casing, providing a stationary guide for the muzzle sleeve and breech block.",
        technicalDetails:
          "Unlike moving-barrel firearms where the barrel reciprocates, barrel B is fixed stationary inside frame A. The frame includes top cover A′ and longitudinal internal guide grooves d² to guide sliding rods c′ and cross-head d.",
        archaicTerm: "Frame A and fixed barrel B",
        modernEquivalent: "Receiver chassis and stationary barrel assembly",
      },
      {
        title: "Sliding Tubular Muzzle Piece l & Socket l′",
        summary:
          "Forward-moving gas expansion sleeve capturing propellant blast exiting the muzzle.",
        technicalDetails:
          "Sleeve l surrounds the muzzle of barrel B and is secured to socket l′. The front aperture allows the projectile to pass freely, while expanding powder gases push against shoulders l², driving the sleeve and socket forward along the barrel exterior.",
        archaicTerm: "Sliding tubular piece surrounding the muzzle",
        modernEquivalent: "Forward-sliding muzzle-gas expansion piston/sleeve",
      },
      {
        title: "Reversing Levers n & Connecting Rods c′",
        summary:
          "Kinematic motion-reversal linkage converting forward sleeve motion into rearward breech pull.",
        technicalDetails:
          "Links m and m′ connect socket l′ to levers n pivoted on frame fulcrums n′. Links o connect levers n to long connecting rods c′ sliding in frame guides d². As the muzzle sleeve moves forward, levers n swing back, pulling rods c′ rearward.",
        archaicTerm: "Intermediate lever and link connection",
        modernEquivalent: "Motion-reversing rocker linkage and operating rods",
      },
      {
        title: "Crankshaft e, Cross-Head d & Breech-Block C",
        summary:
          "Scotch-yoke mechanism converting reciprocating rod stroke into rotary crank motion and linear breech travel.",
        technicalDetails:
          "Rods c′ connect via links f² to crank arms f on transverse crankshaft e. Center crankpin e² travels in the vertical slot of cross-head d (integral with breech-block C), drawing the breech block smoothly rearward to open the chamber.",
        archaicTerm: "Crank-shaft, cross-head, and sliding breech-block",
        modernEquivalent: "Transverse crankshaft and Scotch-yoke bolt carrier",
      },
      {
        title: "Volute Return Clock-Spring k",
        summary:
          "Torsional spring storing mechanical energy during breech opening to power the return and chambering stroke.",
        technicalDetails:
          "Volute spring k is housed in a circular case on the side of frame A, anchored between the gun frame and crankshaft e. Rearward rotation of the crankshaft winds the spring; spring unwinding drives the crankshaft back to close the breech and feed a new cartridge.",
        archaicTerm: "Spring k secured to the crank-shaft and frame",
        modernEquivalent: "Torsional clock-spring return mechanism",
      },
      {
        title: "Extractor g, Sear h, and Feed Wheels Q, Q′",
        summary:
          "Breech-mounted extractor claw, firing pin catch, and rotary cartridge transfer wheels.",
        technicalDetails:
          "Extractor g and sear h pivot on breech-block C under bias of spring h′. Lever j retracts firing pin i during rearward motion until sear h catches it. Hooked rod K′ on cross-head d advances rotary feed wheels Q and Q′ to deliver the next cartridge.",
        archaicTerm: "Extractor, sear, and feed-wheels",
        modernEquivalent: "Extractor claw, striker sear, and rotary feed starwheels",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Muzzle Gas Dynamic Impulse",
        formula: "I = \\int_{t_0}^{t_1} F_{\\text{gas}}(t) \\, dt = \\Delta p_{\\text{sleeve}}",
        explanation:
          "High-pressure propellant gas expanding behind the exiting projectile impinges upon internal shoulders l², transferring forward momentum to sleeve l during the blowdown phase.",
      },
      {
        principle: "Kinematic Motion Reversal",
        formula:
          "\\dot{x}_{\\text{rods}} = -\\left(\\frac{L_2}{L_1}\\right) \\dot{x}_{\\text{sleeve}}",
        explanation:
          "Reversing levers n pivot around stationary frame pins n′, converting the forward stroke of muzzle sleeve l into an inverted rearward pull on operating rods c′.",
      },
      {
        principle: "Scotch-Yoke Crank-to-Cross-Head Kinematics",
        formula: "x_{\\text{breech}}(\\theta) = r_{\\text{crank}} (1 - \\cos\\theta)",
        explanation:
          "Crank pin e² engages the vertical slot in cross-head d, transforming rotational crankshaft displacement θ into pure harmonic linear translation of sliding breech-block C.",
      },
      {
        principle: "Volute Spring Elastic Strain Energy",
        formula:
          "U_{\\text{spring}} = \\frac{1}{2} k_\\theta \\theta_{\\text{wind}}^2, \\quad \\tau_{\\text{return}} = k_\\theta \\theta_{\\text{wind}}",
        explanation:
          "Angular rotation of crankshaft e during breech opening winds volute spring k. Stored elastic strain energy provides restoring torque to drive the forward closing and chambering stroke.",
      },
    ],
    whyItMattersToday:
      "US 319,596 documents an important early branch of automatic weapons engineering: direct muzzle-gas operation. This patent illustrates how Victorian engineers tackled the foundational problems of automatic cycling—harnessing expanding gas impulses, reversing motion through linkages, storing energy in springs, and coordinating extraction, feeding, and firing with positive mechanical timing.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: manualClaimText(1),
      plainEnglish:
        "Claim 1 covers the combination of a sliding breech-block and its loading/firing/extracting mechanism with a sliding tubular sleeve surrounding the muzzle and intermediate connections so that movement of the sleeve operates the breech mechanism.",
      keyInnovations: [
        "Sliding muzzle sleeve",
        "Sliding breech-block",
        "Intermediate operating connections",
      ],
      legalSignificance:
        "Foundational claim establishing direct muzzle-gas sleeve actuation of firearm breech mechanisms.",
    },
    {
      number: 2,
      isIndependent: true,
      originalText: manualClaimText(2),
      plainEnglish:
        "Claim 2 specifies the motion-reversing linkage: the sliding muzzle sleeve, connecting rods to the breech, and intermediate levers and links that convert forward sleeve motion into rearward rod motion.",
      keyInnovations: [
        "Forward sleeve movement",
        "Connecting rods",
        "Intermediate lever and link motion reversal",
      ],
      legalSignificance:
        "Covers the kinematic linkage that inverts forward muzzle gas thrust into rearward breech opening force.",
    },
    {
      number: 3,
      isIndependent: true,
      originalText: manualClaimText(3),
      plainEnglish:
        "Claim 3 recites fixed barrel B, sliding tubular sleeve l with socket l′, sliding breech-block C, and connecting bars m and c′ with intermediate links.",
      keyInnovations: ["Fixed barrel B", "Socketed muzzle sleeve l/l′", "Connecting bars m and c′"],
      legalSignificance:
        "Defines the structural assembly of the fixed barrel, socketed sleeve, and operating bars.",
    },
    {
      number: 4,
      isIndependent: true,
      originalText: manualClaimText(4),
      plainEnglish:
        "Claim 4 recites the sliding breech mechanism, crankshaft e connected to the breech-block, volute spring k secured to crankshaft and frame, sliding muzzle sleeve l, and intermediate connections to the crankshaft.",
      keyInnovations: [
        "Crankshaft e cross-head drive",
        "Frame-anchored volute return spring k",
        "Muzzle sleeve to crankshaft drive chain",
      ],
      legalSignificance:
        "Protects the complete mechanical drive chain including crankshaft and volute return spring.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Vertical Central Longitudinal Section",
      caption:
        "Section showing fixed barrel B, forward sliding muzzle sleeve l, socket l′, reversing levers n, connecting rods c′, crankshaft e, cross-head d, breech-block C, and volute spring k.",
      svgType: "maxim-machine-gun",
      callouts: [
        {
          id: "maxim-fig1-a",
          figureRef: "Fig. 1",
          label: "A",
          element: "Metal frame",
          description: "The main casing supporting fixed barrel B and guiding sliding mechanism.",
          x: 45,
          y: 51,
        },
        {
          id: "maxim-fig1-b",
          figureRef: "Fig. 1",
          label: "B",
          element: "Fixed barrel",
          description: "Stationary rifled gun barrel mounted rigidly in frame A.",
          x: 35,
          y: 50,
        },
        {
          id: "maxim-fig1-l",
          figureRef: "Fig. 1",
          label: "l",
          element: "Sliding tubular piece",
          description: "Muzzle sleeve driven forward along barrel B by expanding propellant gas.",
          x: 15,
          y: 50,
        },
        {
          id: "maxim-fig1-n",
          figureRef: "Fig. 1",
          label: "n",
          element: "Reversing levers",
          description: "Pivoted levers inverting forward sleeve stroke to rearward rod pull.",
          x: 25,
          y: 55,
        },
        {
          id: "maxim-fig1-c",
          figureRef: "Fig. 1",
          label: "C",
          element: "Sliding breech-block",
          description: "Sliding breech-block carrying extractor, firing pin, and sear.",
          x: 65,
          y: 50,
        },
        {
          id: "maxim-fig1-e",
          figureRef: "Fig. 1",
          label: "e",
          element: "Crank-shaft",
          description: "Transverse crankshaft driving cross-head d and winding volute spring k.",
          x: 75,
          y: 52,
        },
      ],
    },
    {
      figureNumber: "Fig. 2",
      title: "Plan View in Partial Section",
      caption:
        "Horizontal plan view showing dual connecting rods c′, frame guides d², and feed wheel placement.",
      svgType: "maxim-machine-gun",
      callouts: [
        {
          id: "maxim-fig2-cprime",
          figureRef: "Fig. 2",
          label: "c′",
          element: "Connecting rods",
          description: "Longitudinal operating rods sliding in guides d² of frame A.",
          x: 45,
          y: 40,
        },
        {
          id: "maxim-fig2-q",
          figureRef: "Fig. 2",
          label: "Q",
          element: "Feed-wheels",
          description: "Cartridge feed wheels for transferring ammunition into the breech.",
          x: 60,
          y: 35,
        },
      ],
    },
    {
      figureNumber: "Fig. 3",
      title: "Breech-Case Side Elevation",
      caption:
        "Side elevation of the breech casing showing the cylindrical housing for volute spring k.",
      svgType: "maxim-machine-gun",
      callouts: [
        {
          id: "maxim-fig3-k",
          figureRef: "Fig. 3",
          label: "k",
          element: "Volute spring casing",
          description: "Circular case housing torsional volute clock spring k on crankshaft e.",
          x: 70,
          y: 50,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "Early machine guns (like the Gatling and Gardner) required continuous manual cranking by an operator, inducing weapon vibration, limiting effective aim, and causing user fatigue. Hiram Maxim sought to harness the waste energy of propellant gases exiting the muzzle to automate the entire cycling sequence.",
    priorArtLimitations: [
      "Manual hand cranking caused weapon oscillation, throwing off precision targeting.",
      "Earlier gas-operated attempts used delicate vacuum chambers or diaphragms that fouled rapidly.",
      "Existing mechanisms had not yet achieved positive direct gas sleeve forward motion with linkage reversal.",
    ],
    breakthroughInsight:
      "Maxim designed a sliding muzzle sleeve that captures the expanding gas blast directly at the muzzle, coupling it through reversing levers and connecting rods to turn a transverse crankshaft. The crankshaft draws the breech block open via a Scotch yoke cross-head while winding a volute clock spring, storing energy for the subsequent closing and chambering stroke.",
    patentWars: [
      {
        rivalName: "Thorsten Nordenfelt",
        rivalClaim:
          "Nordenfelt contested automatic feed and rapid-fire mechanisms with his multi-barrel mechanical lever guns.",
        conflictDetails:
          "Maxim demonstrated the superiority of self-powered automatic cycling over mechanical hand levers.",
        resolution:
          "The two inventors merged their interests in 1888 to form the Maxim-Nordenfelt Guns and Ammunition Company.",
        legalOutcome:
          "Maxim's automatic patents established the foundation for automatic weapons engineering.",
      },
    ],
    civilizationalImpact:
      "US 319,596 represents a seminal milestone in automatic firearm history, documenting Maxim's transition from indirect pneumatic chambers to direct gas-actuated sliding sleeves. Gas-operated mechanisms inspired by this lineage later became standard across modern automatic rifles and autocannons worldwide.",
  },
  tags: [
    "Hiram Maxim",
    "Machine Gun",
    "Muzzle Gas Sleeve",
    "Automatic Firearm",
    "Reversing Linkage",
    "Volute Return Spring",
    "Scotch Yoke Cross-Head",
  ],
  stats: {
    totalClaims: 4,
    independentClaims: 4,
  },
};
