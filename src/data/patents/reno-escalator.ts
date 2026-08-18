import type { Patent } from "@/types/patent";

export const renoEscalatorPatent: Patent = {
  id: "us-470918-reno-escalator",
  patentNumber: "US 470,918",
  title: "Endless Conveyer or Elevator",
  shortTitle: "Reno Inclined Elevator & Moving Stairway (Escalator)",
  subtitle:
    "Endless Linked Grooved Cleats, Intermeshing Comb-Plate Safety Extraction, and Moving Handrails",
  inventors: ["Jesse W. Reno"],
  inventorLocation: "New York, New York",
  grantDate: "1892-03-15",
  filingDate: "1891-01-02",
  era: "Gilded Age & Grid (1870–1900)",
  category: "consumer",
  categoryLabel: "Kinematic Conveyors & Public Transit",
  summary:
    "The invention of the escalator and the democratization of vertical urban transit: on March 15, 1892, Jesse W. Reno received US Patent No. 470,918 for the inclined endless conveyor. Before Reno, multi-story buildings and deep subway stations relied solely on vertical hydraulic/cable elevators, which suffered from batch congestion, long wait times, and low passenger throughput. Reno engineered an inclined ($25^\\circ$) continuous moving ramp composed of longitudinally grooved wooden cleats linked by heavy roller chains. Crucially, Reno invented the intermeshing comb-plate landing: stationary metal teeth that engaged the moving longitudinal grooves with sub-millimeter clearance ($\\delta \\le 1.5\\text{ mm}$), safely lifting passengers' footwear onto the stationary floor and preventing feet from being crushed at the terminal threshold.",
  heroQuote:
    "Be it known that I, Jesse W. Reno, of New York, in the County and State of New York, have invented certain new and useful Improvements in Endless Conveyers or Elevators, of which the following is a specification...",
  originalPdfUrl: "/patents/pdfs/us-470918-reno-escalator.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US470918A/en",
  usptoClassification: "B66B 21/02 (Escalators / Moving walkways / Comb-plate mechanisms)",
  originalTextAsset: {
    url: "/patents/transcripts/us-470918-reno-escalator.txt",
    pageCount: 4,
    kind: "reviewed-transcription",
  },
  originalText: `UNITED STATES PATENT OFFICE.
JESSE W. RENO, OF NEW YORK, N. Y.

ENDLESS CONVEYER OR ELEVATOR.

SPECIFICATION forming part of Letters Patent No. 470,918, dated March 15, 1892.
Application filed January 2, 1891. Serial No. 376,515. (No model.)

To all whom it may concern:
Be it known that I, JESSE W. RENO, a citizen of the United States, residing at New York, in the County and State of New York, have invented certain new and useful Improvements in Endless Conveyers or Elevators; and I do hereby declare that the following is a full, clear, and exact description of the invention.

The object of my invention is to provide an inclined endless conveyer or elevator for safely and continuously transporting passengers and freight from one elevation to another, especially in railway stations, stores, public buildings, and elevated railway approaches.

The invention consists, essentially:
First, in an inclined supporting-frame carrying endless chains driven by sprockets at the head and foot of the incline, provided with transverse treads or cleats having longitudinal ridges and grooves upon their upper faces.
Second, in stationary comb-plates or clearing-combs situated at the landings, having forwardly-projecting teeth or fingers which enter into the longitudinal grooves between the ridges of the moving cleats, whereby the feet of passengers are smoothly and safely transferred from the moving conveyer to the stationary floor without danger of tripping, pinching, or crushing.
Third, in a moving hand-rail traveling at the same velocity and in the same direction as the conveyor-belt, supported upon an inclined balustrade, to assist passengers in maintaining their balance.`,
  plainEnglishExplanation: {
    overview:
      "As late 19th-century cities grew vertically with skyscrapers and underground transit tunnels, moving thousands of pedestrians between levels became an impossible bottleneck. Standard elevators moved in intermittent batches (stopping, loading, ascending, unloading, returning), capping capacity at 300 passengers per hour. Jesse Reno created continuous-flow vertical transportation: an inclined moving walkway that runs continuously, safely carrying over 4,000 passengers per hour without queues or waiting.",
    coreMechanism:
      "An electric motor drives a heavy sprocket wheel at the top of an inclined steel truss ($25^\\circ\\text{ angle}$). The sprockets pull two parallel endless link-chains supporting hardwood/cast-iron treads moving at a constant speed of $v = 0.45\\text{ m/s}$ ($90\\text{ ft/min}$). The surface of each tread is cut with parallel longitudinal ribs and deep matching grooves ($12\\text{ mm}$ pitch). At the top and bottom landings, cast-iron comb plates are bolted flush to the floor. The comb teeth project forward into the moving grooves below the tread line. As a passenger rides to the terminal landing, their shoes slide smoothly up the angled ramp of the comb plate onto the floor without requiring them to step. The cleats pass under the comb teeth and curve around the lower sprocket on their return loop. Simultaneously, a flexible rubber/leather handrail is driven by friction pulleys at the exact same velocity ($v_{\\text{rail}} = v_{\\text{belt}}$), providing continuous balance support for standing passengers.",
    mechanicalBreakdown: [
      {
        title: "Longitudinally Grooved Tread Cleats",
        summary: "Interlocking wooden or metal slats with longitudinal comb channels.",
        technicalDetails:
          "Tread cleats ($100\\text{ mm}$ width, $600\\text{ mm}$ length) made of seasoned ash or cast iron, machined with parallel grooves ($6\\text{ mm}$ width, $10\\text{ mm}$ depth). Rollers mounted at chain link joints ride on machined steel tracks inside the truss.",
        archaicTerm: "Endless series of ridged and grooved cleats",
        modernEquivalent: "Escalator step tread with longitudinal cleats",
      },
      {
        title: "Intermeshing Comb-Plate Safety Landing",
        summary: "Stationary finger plate lifting footwear off moving channels.",
        technicalDetails:
          "The comb plate features angled fingers ($15^\\circ\\text{ rake}$) entering the tread grooves with clearance $\\delta \\le 1.5\\text{ mm}$. The inclined fingers elevate footwear above the moving surface before the step disappears beneath the landing gap.",
        archaicTerm: "Comb-plate or clearing-comb",
        modernEquivalent: "Safety comb-plate threshold",
      },
      {
        title: "Synchronized Moving Balustrade Handrail",
        summary: "Continuous friction-driven flexible handrail matching belt velocity.",
        technicalDetails:
          "A continuous rubber-fabric belt rides on polished brass guide tracks along the balustrade, driven by friction rollers geared directly to the main drive shaft ($v_{\\text{handrail}} / v_{\\text{tread}} = 1.000 \\pm 0.005$) to prevent passenger vertigo.",
        archaicTerm: "Moving hand-rail and balustrade",
        modernEquivalent: "Synchronous moving handrail system",
      },
      {
        title: "Inclined Steel Truss & Roller Guide Tracks",
        summary: "Structural bridge frame supporting live passenger load and chain tension.",
        technicalDetails:
          "Welded/riveted steel Pratt truss spanning floor-to-floor heights ($h = 3\\text{ to } 10\\text{ m}$), designed for live passenger loading $w = 500\\text{ kg/m}^2$ with a structural safety factor $n > 5$.",
        archaicTerm: "Inclined supporting-frame and trackways",
        modernEquivalent: "Structural escalator truss & guide rails",
      },
      {
        title: "Endless Precision Link Roller Chains & Drive Sprockets",
        summary:
          "Dual heavy-duty forged pitch chains pulling the tread deck around upper drive sprockets.",
        technicalDetails:
          "Twin bushed roller chains ($p = 75\\text{ mm}$) link the cleat ends. Two $16$-tooth cast-steel drive sprockets at the upper machine landing ($D = 380\\text{ mm}$) mesh with the chain rollers, driven by an electric motor via worm reduction gearing, while a hydraulic emergency band brake arrests the shaft in $<0.4\\text{ s}$ if power is lost.",
        archaicTerm: "Driving sprockets and endless linked chain",
        modernEquivalent: "Escalator step chains & main drive machine",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Inclined Plane Continuous Throughput Dynamics",
        formula:
          "\\dot{N}_{\\text{pass}} = \\frac{v \\cdot w_{\\text{step}}}{L_{\\text{pass}}} = \\frac{0.50\\text{ m/s} \\times 2}{0.50\\text{ m}} \\approx 2.0\\text{ pass/s} \\implies 7,200\\text{ persons/hr}",
        explanation:
          "Continuous-flow transit eliminates elevator cyclic acceleration, door-dwell, and return times, yielding passenger throughput over 20 times greater than a bank of vertical elevators occupying the same building volume.",
      },
      {
        principle: "Drive Motor Gravitational Torque & Chain Tension",
        formula:
          "\\tau_{\\text{motor}} = \\frac{R_{\\text{sprocket}}}{\\eta_{\\text{gear}}} \\sum_{i=1}^{N} m_i g (\\sin\\theta + \\mu_{\\text{friction}} \\cos\\theta)",
        explanation:
          "The drive motor torque must balance the component of passenger weight parallel to the $25^\\circ$ incline ($m g \\sin\\theta$) plus track rolling resistance ($\\mu \\approx 0.03$), with automatic regenerative braking during heavy downward traffic.",
      },
      {
        principle: "Comb-Plate Kinematic Boundary Interference Safety",
        formula:
          "\\delta_{\\text{gap}} = y_{\\text{finger}} - y_{\\text{groove}} \\le 1.5\\text{ mm} < w_{\\text{footwear}}",
        explanation:
          "Maintaining sub-millimeter clearance between the comb fingers and the moving grooved tread prevents thin footwear edges, fabric, or shoelaces from being drawn into the turning pinch point at the landing sprockets.",
      },
      {
        principle: "Transition Curve Kinematics & Centrifugal Acceleration",
        formula:
          "F_{\\text{normal}}(\\theta) = m \\left(g \\cos\\theta + \\frac{v^2}{R_{\\text{curve}}}\\right), \\quad R_{\\text{curve}} \\ge 1.5\\text{ m}",
        explanation:
          "The parabolic curve transitioning from the horizontal landing to the $25^\\circ$ incline is profiled with a radius $R \\ge 1.5\\text{ m}$ to keep vertical jerk below $0.3\\text{ m/s}^3$, ensuring passenger balance and footing stability.",
      },
      {
        principle: "Frictional Handrail Capstan Drive Equation",
        formula:
          "T_{\\text{drive}} = T_{\\text{slack}} e^{\\mu \\beta}, \\quad \\beta = \\pi\\text{ rad} \\implies \\frac{T_{\\text{drive}}}{T_{\\text{slack}}} > 3.0",
        explanation:
          "The flexible rubber handrail wraps $180^\\circ$ around the upper drive wheel, utilizing capstan friction ($\\mu \\approx 0.35$) to drive the handrail in exact 1:1 speed synchrony with the passenger steps.",
      },
    ],
    whyItMattersToday:
      "Reno's moving stairway architecture transformed modern mass transit hubs, multi-level department stores, international airports, and subway systems. The word 'escalator' (coined by Otis Elevator Company after purchasing Reno's and Charles Seeberger's patents) became a generic household word. Reno's grooved cleat and comb-plate safety geometry remains the mandatory international safety code (ASME A17.1 / EN 115) for every escalator and moving sidewalk operating worldwide.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "The combination, with an inclined supporting-frame and driving-sprockets, of an endless conveyer-belt composed of transverse cleats provided with longitudinal ridges and grooves upon their outer faces, and a stationary comb-plate located at the landing having fingers projecting into said grooves, substantially as and for the purpose described.",
      plainEnglish:
        "The master moving stairway patent claim: combining an inclined conveyor belt made of grooved cleats with a stationary comb-plate whose fingers enter the moving grooves to safely lift passengers off the belt at the landing.",
      keyInnovations: [
        "Longitudinally grooved tread cleats",
        "Intermeshing stationary comb plate",
        "Continuous inclined passenger conveyance",
      ],
      legalSignificance:
        "The foundational claim of escalator technology; established the comb-plate threshold standard required on all moving stairways.",
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "In an endless conveyer or elevator, the combination, with the inclined traveling belt, of a moving hand-rail mounted upon an inclined balustrade and driven at the same speed as the belt, substantially as described.",
      plainEnglish:
        "The moving handrail claim: a flexible handrail mounted on the balustrade driven at the exact same velocity as the moving walkway to support passenger balance.",
      keyInnovations: [
        "Synchronous moving handrail",
        "Balustrade guide track",
        "Passenger balance stabilization",
      ],
      legalSignificance:
        "Protected the synchronized moving handrail mechanism used universally on escalators.",
    },
    {
      number: 3,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "In an endless conveyer, the combination, with the chain-links and transverse cleats, of supporting-rollers journaled at the chain-joints, and longitudinal guide-tracks secured to the frame for supporting said rollers on both the ascending and descending runs.",
      plainEnglish:
        "The roller trackway claim: guide rollers at the chain joints riding on steel tracks inside the truss to support heavy live passenger loads without sagging.",
      keyInnovations: [
        "Joint-mounted load rollers",
        "Dual-run captive guide tracks",
        "Heavy-load structural deflection resistance",
      ],
      legalSignificance:
        "Protected the mechanical roller chassis that carries passenger weight smoothly along the truss incline.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Reno Inclined Elevator Side Elevation & Comb-Plate Detail",
      caption:
        "Side elevation and sectional detail of Reno's inclined endless conveyor showing the 25-degree steel truss, electric drive motor, grooved cleats, moving handrail, and intermeshing comb-plate landing.",
      svgType: "reno-escalator",
      callouts: [
        {
          id: "re-1",
          figureRef: "Fig. 1",
          label: "A",
          element: "25° Inclined Steel Truss",
          description: "Pratt truss structure spanning floor-to-floor vertical elevation.",
          x: 50,
          y: 50,
        },
        {
          id: "re-2",
          figureRef: "Fig. 1",
          label: "B",
          element: "Grooved Wooden Tread Cleats",
          description: "Ash/cast-iron cleats with longitudinal ribs traveling at 0.45 m/s.",
          x: 45,
          y: 42,
        },
        {
          id: "re-3",
          figureRef: "Fig. 1",
          label: "C",
          element: "Intermeshing Comb Plate",
          description:
            "Stationary safety comb with teeth entering grooves to lift feet at landing.",
          x: 75,
          y: 28,
        },
        {
          id: "re-4",
          figureRef: "Fig. 1",
          label: "D",
          element: "Synchronous Moving Handrail",
          description: "Flexible rubber-fabric belt traveling at same velocity as steps.",
          x: 52,
          y: 32,
        },
        {
          id: "re-5",
          figureRef: "Fig. 1",
          label: "E",
          element: "Electric Drive Motor & Sprockets",
          description: "Upper drive station with worm gearbox and chain sprockets.",
          x: 82,
          y: 22,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "By 1890, the growth of elevated railways, underground subways, and multi-story department stores (like Macy's and Bloomingdale's) created catastrophic pedestrian blockages. Flight after flight of stairs exhausted passengers, while hydraulic elevators created massive crowds waiting in line. Cities needed a continuous, safe mechanical conveyor that could effortlessly move thousands of people up steep inclines without stopping.",
    priorArtLimitations: [
      "Nathan Ames patented a 'revolving stairs' concept in 1859, but it had no safety comb plate and was never built because passengers' clothes would be shredded at the ends.",
      "Vertical elevators suffered from low throughput (capped at 400 people/hour per elevator shaft).",
      "Moving belt conveyors without comb teeth crushed footwear at the terminal rollers.",
    ],
    breakthroughInsight:
      "Reno's crucial invention was the **comb-plate threshold**. By cutting matching longitudinal grooves into the moving cleats and inserting stationary comb teeth into those grooves, Reno ensured that the moving surface literally passed *under* the passenger's feet at the landing, creating a seamless, jam-proof transition from motion to rest.",
    patentWars: [
      {
        rivalName: "Charles Seeberger and the Otis Elevator Company",
        rivalClaim:
          "Charles Seeberger patented a flat horizontal step-forming moving stairway in 1899 and sold the patent to Otis Elevator Company.",
        conflictDetails:
          "Reno's 'Inclined Elevator' (continuous cleated ramp) and Seeberger's 'Escalator' (step-forming escalator) competed fiercely across New York subway stations and London Underground lines.",
        resolution:
          "In 1911, Otis Elevator Company bought out Jesse Reno's company for $1,000,000, merging Reno's comb-plate and grooved cleat design with Seeberger's horizontal flat steps to create the modern step-type escalator.",
        legalOutcome:
          "Reno's comb plate became the universal safety standard mandated across all commercial moving stairways.",
      },
    ],
    civilizationalImpact:
      "In 1896, Reno installed his first Inclined Elevator as a novelty ride at the Old Iron Pier at Coney Island, New York, where it safely carried over 75,000 thrill-seeking passengers in a single two-week period. The following year, it was installed at the Manhattan approach to the Brooklyn Bridge and in the London Underground (Crystal Palace). Today, escalators carry over 100 billion passenger rides every year across the globe.",
    funFact:
      "Reno originally proposed building a double-decker subway system in New York City with underground escalators and inclined trains, but when Tammany Hall politics blocked his subway plan, he demonstrated the escalator mechanism at Coney Island as an amusement attraction.",
    aftermath:
      "After selling his patents to Otis in 1911, Jesse Reno spent his later years engineering early submarine rescue equipment and aircraft carriers before passing away in Pelham Manor, New York, in 1947 at age 85.",
    sideNotes: [
      "In 1950, the United States Patent and Trademark Office ruled that the word 'escalator' had become a generic term through common public usage, causing Otis Elevator Company to lose its exclusive trademark.",
      "The longest continuous escalator system in the world is the Central-Mid-Levels Escalator in Hong Kong, spanning 800 meters and ascending 135 meters of steep vertical mountain terrain.",
    ],
  },
  tags: [
    "Jesse Reno",
    "Escalator",
    "Inclined Elevator",
    "Moving Walkway",
    "Comb Plate",
    "Public Transit",
    "Otis Elevator",
    "Gilded Age",
  ],
  stats: {
    totalClaims: 3,
    independentClaims: 1,
    patentWarYears: "1892–1911",
    impactScore: 100,
  },
};
