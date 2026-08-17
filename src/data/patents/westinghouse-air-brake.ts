import type { Patent } from "@/types/patent";

export const westinghouseAirBrakePatent: Patent = {
  id: "us-124404-westinghouse-air-brake",
  patentNumber: "US 124,404",
  title: "Improvement in Steam and Air Brakes",
  shortTitle: "Westinghouse Triple-Valve Automatic Air Brake",
  subtitle:
    "Pressurized Continuous Train Line, Inverted Pressure Control, and Local Auxiliary Reservoir Discharge",
  inventors: ["George Westinghouse Jr."],
  inventorLocation: "Pittsburgh, Allegheny County, Pennsylvania",
  grantDate: "1872-03-05",
  filingDate: "1871-12-09",
  era: "Civil War & Industrial Acceleration (1860–1880)",
  category: "consumer",
  categoryLabel: "Pneumatic Control & Railroad Systems",
  summary:
    "The 1872 railroad safety masterpiece: George Westinghouse's automatic air brake introducing the fail-safe 'triple valve' on every railcar. By keeping the continuous train pipe pressurized with compressed air, any intentional reduction in line pressure—or accidental break-in-two of the train—automatically shifts the triple valve, dumping local auxiliary reservoir air into the brake cylinder to clamp the wheels instantly.",
  heroQuote:
    "The triple-valve is so constructed that while the pressure in the main pipe is maintained, the brakes are off and the auxiliary reservoir is charged; but when the pressure in the pipe is reduced, the valve automatically shifts, discharging air from the reservoir into the brake-cylinder to apply the brakes...",
  originalPdfUrl: "/patents/pdfs/us-124404-westinghouse-air-brake.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US124404/en",
  usptoClassification: "B60T 15/18 (Triple-valves; Automatic pneumatic brake control)",
  originalText: `UNITED STATES PATENT OFFICE.
GEORGE WESTINGHOUSE, JR., OF PITTSBURGH, PENNSYLVANIA.

IMPROVEMENT IN STEAM AND AIR BRAKES.

Specification forming part of Letters Patent No. 124,404, dated March 5, 1872.

To all whom it may concern:
Be it known that I, GEORGE WESTINGHOUSE, Jr., of Pittsburgh, in the County of Allegheny and State of Pennsylvania, have invented a new and useful Improvement in Steam and Air Brakes, of which the following is a specification:

In the straight-air brake system heretofore patented by me, compressed air was admitted directly from the locomotive reservoir through a continuous train-pipe to the brake cylinders under each car. If a hose burst or a train broke in two, the air escaped and the entire braking power was lost.

The nature of my present invention consists in:
1. Providing each car in a train with its own independent auxiliary reservoir of compressed air, in addition to the usual brake cylinder.
2. A continuous train-pipe running from the locomotive through all the cars, normally kept charged with compressed air at full working pressure (about 70 pounds per square inch).
3. A device known as a "triple-valve" placed on each car at the junction of the train-pipe, auxiliary reservoir, brake cylinder, and atmosphere.

The triple-valve operates automatically in three distinct states:
FIRST: To charge the auxiliary reservoir and release the brakes. High pressure admitted to the train-pipe forces the triple-valve piston upward, uncovering a small feed-groove through which air passes to charge the auxiliary reservoir, while simultaneously opening an exhaust port from the brake cylinder to the atmosphere.
SECOND: To apply the brakes. When the engineer vents air from the train-pipe to reduce its pressure (or when the train separates and ruptures the hose), the higher pressure in the auxiliary reservoir instantly pushes the triple-valve piston downward. This closes the feed-groove, cuts off the exhaust to atmosphere, and opens a slide-valve passage allowing compressed air from the auxiliary reservoir to rush directly into the brake cylinder, applying the brake shoes against the wheels with full force.
THIRD: Lap or hold. By equalizing the reduced pipe pressure, the valve maintains any desired partial braking pressure.

Thus, the system is entirely fail-safe: any accidental rupture of the train-pipe or uncoupling of cars instantly applies the brakes on every car independently without action by the engineer.

I claim as my invention:
1. The triple-valve device constructed and arranged to operate substantially as described, for controlling the admission of air from the auxiliary reservoir to the brake-cylinder and from the cylinder to the atmosphere.
2. The combination of a main train-pipe, an auxiliary reservoir, a brake-cylinder, and a triple-valve on each car of a train, so arranged that a reduction of pressure in the train-pipe causes the application of the brakes.`,
  plainEnglishExplanation: {
    overview:
      "In early railroading, stopping a train required brakemen to run across the icy tops of moving railcars, manually cranking hand brakes on each car while colliding trains and derailments killed thousands. Westinghouse's original 1869 air brake was vulnerable: if a hose snapped, all air escaped and brakes failed. In this 1872 master patent, Westinghouse inverted the control logic: the train line is kept pressurized ($70\\text{ psi}$) to hold the brakes *off*. Any drop in line pressure—whether from the engineer's lever or a severed train—instantly fires the brakes on every car automatically.",
    coreMechanism:
      "Each railcar carries a dedicated air reservoir, a brake cylinder, and a 'triple valve' containing a sliding piston and D-slide valve. During normal running, compressed air from the locomotive pressurizes the train pipe, holding the triple valve piston up; air trickles through a tiny feed groove to charge the local car reservoir to $70\\text{ psi}$ while venting the brake cylinder to atmosphere. When the engineer vents the brake pipe (e.g. dropping pressure to $50\\text{ psi}$), the $70\\text{ psi}$ air in the auxiliary reservoir pushes the triple valve piston downward. This motion slides the D-valve to seal the exhaust and open a wide conduit from the auxiliary reservoir into the brake cylinder, pushing the piston rod to clamp cast-iron brake shoes against all wheels.",
    mechanicalBreakdown: [
      {
        title: "The Automatic Triple Valve Assembly",
        summary: "Pneumatic differential-pressure piston and slide valve.",
        technicalDetails:
          "Contains a brass piston operating in a polished cylinder with a leather packing cup. The piston moves between three discrete kinematic states: (1) Release & Charge (piston up), (2) Application (piston down), and (3) Lap (piston centered), actuated by pressure differentials as small as $\\Delta P = 15\\text{ kPa}$ ($2\\text{ psi}$).",
        archaicTerm: "The triple-valve device",
        modernEquivalent: "Triple valve / Control valve assembly (AB / ABDX brake valve)",
      },
      {
        title: "Auxiliary Air Reservoir on Each Car",
        summary: "Welded steel pressure tank storing localized braking energy.",
        technicalDetails:
          "A cylindrical steel tank ($V = 40\\text{ to }60\\text{ liters}$) mounted under the frame of every car. Storing compressed air locally on each car eliminates the pressure-drop lag of feeding air from the distant locomotive during an emergency stop.",
        archaicTerm: "Auxiliary reservoir of compressed air",
        modernEquivalent: "Auxiliary and emergency air reservoir",
      },
      {
        title: "Brake Cylinder & Foundation Lever Rigging",
        summary: "Piston cylinder pushing foundation brake levers against wheel treads.",
        technicalDetails:
          "A single-acting pneumatic cylinder ($D = 25\\text{ cm}$). When pressurized to $50\\text{ psi}$, it delivers a piston thrust of $F = P \\cdot A \\approx 17\\text{ kN}$, magnified by a $5:1$ mechanical lever linkage to apply over $80\\text{ kN}$ of total normal clamping force across eight wheel brake shoes.",
        archaicTerm: "Brake cylinder and brake shoes",
        modernEquivalent: "Brake cylinder & foundation brake rigging",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Acoustic Pressure Wave Propagation in Pneumatic Lines",
        formula:
          "c = \\sqrt{\\gamma R T} \\approx 340\\text{ m/s}, \\quad t_{\\text{arrival}}(x) = \\frac{x}{c}",
        explanation:
          "Venting the brake pipe at the locomotive creates a rarefaction acoustic wave that travels down the train pipe at sonic velocity, sequentially triggering the triple valve on each car as the pressure drop wave passes.",
      },
      {
        principle: "Boyle's Law Pressure Equalization",
        formula:
          "P_{\\text{final}} (V_{\\text{aux}} + V_{\\text{cyl}}) = P_{\\text{aux}} V_{\\text{aux}} + P_{\\text{atm}} V_{\\text{cyl}} \\implies P_{\\text{cyl}} \\approx 50\\text{ psi}",
        explanation:
          "During a full service application, expanding compressed air from the auxiliary reservoir into the evacuated brake cylinder equalizes at approximately 50 psi, delivering predictable maximum deceleration.",
      },
      {
        principle: "Kinetic Friction & Rail Adhesion Limit",
        formula:
          "F_{\\text{retarding}} = \\mu_{\\text{shoe}}(v) \\cdot F_{\\text{clamping}} \\le \\mu_{\\text{adhesion}} \\cdot m_{\\text{car}} g",
        explanation:
          "Braking force is limited by the steel-on-steel adhesion coefficient between the wheel tread and rail ($\\mu_{\\text{rail}} \\approx 0.20$). If brake clamping force exceeds this limit, the wheel locks and skids, causing flat spots and reducing stopping distance.",
      },
    ],
    whyItMattersToday:
      "Westinghouse's automatic triple-valve air brake is universally regarded as one of the most consequential safety inventions in industrial history. It enabled heavy freight trains and high-speed passenger expresses to travel across continents safely. The Association of American Railroads (AAR) mandates that all freight and passenger trains in North America operate on pneumatic fail-safe systems directly descending from this 1872 patent.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "The triple-valve device constructed and arranged to operate substantially as described, for controlling the admission of air from the auxiliary reservoir to the brake-cylinder and from the cylinder to the atmosphere.",
      plainEnglish:
        "Master pioneer claim covering the triple valve device that automatically controls air flow from the car's auxiliary reservoir into the brake cylinder and vents the cylinder to atmosphere based on train line pressure.",
      keyInnovations: [
        "Automatic differential-pressure triple valve",
        "Localized auxiliary reservoir discharge",
        "Fail-safe inverted pneumatic control logic",
      ],
      legalSignificance:
        "The foundational claim for automatic train brakes, licensed globally and legally mandated by the US Safety Appliance Act of 1893.",
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "The combination of a main train-pipe, an auxiliary reservoir, a brake-cylinder, and a triple-valve on each car of a train, so arranged that a reduction of pressure in the train-pipe causes the application of the brakes.",
      plainEnglish:
        "Specifies the continuous train-pipe system where each railcar carries an auxiliary reservoir, brake cylinder, and triple valve, configured so that reducing line pressure applies the brakes.",
      keyInnovations: [
        "Continuous pressurized train-pipe network",
        "Automatic break-in-two emergency application",
      ],
      legalSignificance:
        "Protected the closed pneumatic train line architecture that made freight and passenger rail operations safe across multi-mile train lengths.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Sectional View of Westinghouse Triple-Valve Assembly",
      caption:
        "Cutaway drawing showing triple valve body, slide valve, differential piston, auxiliary reservoir port, brake cylinder port, and exhaust vent.",
      svgType: "westinghouse-air-brake",
      callouts: [
        {
          id: "wb-1",
          figureRef: "Fig. 1",
          label: "A",
          element: "Differential Pressure Piston",
          description: "Piston sliding in chamber between train pipe and auxiliary reservoir.",
          x: 50,
          y: 40,
        },
        {
          id: "wb-2",
          figureRef: "Fig. 1",
          label: "B",
          element: "D-Slide Valve & Ports",
          description: "Slide valve directing air to brake cylinder or venting to atmosphere.",
          x: 50,
          y: 60,
        },
        {
          id: "wb-3",
          figureRef: "Fig. 1",
          label: "C",
          element: "Train-Pipe Connection Inlet",
          description: "Port connecting to continuous pressurized train line from locomotive.",
          x: 20,
          y: 35,
        },
        {
          id: "wb-4",
          figureRef: "Fig. 1",
          label: "D",
          element: "Auxiliary Reservoir Port",
          description: "Conduit leading to localized compressed air storage tank.",
          x: 80,
          y: 35,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "In the 1860s, American railroads suffered thousands of catastrophic collisions and derailments every year. Freight trains traveling at 30 mph required over a mile to stop because brakemen had to manually run along the catwalks above railcars in rain and blizzards to tighten hand wheels on each car.",
    priorArtLimitations: [
      "Manual hand brakes were slow, dangerous to train crews, and completely ineffective in sudden emergencies.",
      "Steam chain brakes suffered massive mechanical slack and snapped under heavy loads.",
      "Straight-air brakes (1869) dumped all braking power if a single hose ruptured, leaving a runaway train with zero brakes.",
    ],
    breakthroughInsight:
      "Westinghouse realized that by keeping the continuous train pipe pressurized at all times and storing air locally under each railcar, the loss of pressure itself could be used as the trigger to fire the brakes instantly, creating a fail-safe system.",
    patentWars: [
      {
        rivalName: "1886–1887 Burlington Brake Trials",
        rivalClaim:
          "Rival brake manufacturers and railroad executives claimed automatic air brakes could not stop 50-car freight trains without severe slack-action shocks that crushed cars.",
        conflictDetails:
          "The Master Car Builders Association conducted the legendary Burlington Brake Trials in Iowa in 1886. On long 50-car trains, the acoustic lag of air traveling down the pipe caused the rear cars to slam into the front cars before their brakes applied.",
        resolution:
          "Westinghouse returned to his workshop and invented the Quick-Action Triple Valve (Patent 360,070 in 1887), adding a local train-pipe venting valve that accelerated the brake application wave to over 600 miles per hour, stopping a 50-car freight train smoothly in just 500 feet.",
        legalOutcome:
          "The US Congress passed the Railroad Safety Appliance Act of 1893, making Westinghouse automatic air brakes mandatory on all American trains.",
      },
    ],
    civilizationalImpact:
      "The Westinghouse air brake made modern freight and passenger rail transportation possible. Train speeds doubled, freight tonnage expanded tenfold, and railroad worker fatalities dropped by over 70%. Westinghouse founded the Westinghouse Air Brake Company (WABCO) and later Westinghouse Electric.",
    funFact:
      "When 22-year-old George Westinghouse first pitched his straight-air brake to Cornelius 'Commodore' Vanderbilt of the New York Central Railroad in 1868, Vanderbilt famously scoffed: 'Do you mean to tell me that you can stop a locomotive with wind? I have no time to talk to fools!' Westinghouse took the idea to the Panhandle Railroad, where on its very first trial run in Pittsburgh, the air brake saved a horse and dray stranded on the tracks!",
    aftermath:
      "George Westinghouse went on to patent over 360 inventions, champion Nikola Tesla's alternating current system against Thomas Edison in the 'War of the Currents,' and build one of the greatest industrial empires in American history. In 1911, Westinghouse received the prestigious Edison Medal for his achievements in engineering.",
  },
  tags: [
    "George Westinghouse",
    "Air Brake",
    "Railroad Safety",
    "Pneumatics",
    "Triple Valve",
    "Fail-Safe Engineering",
  ],
  stats: {
    totalClaims: 2,
    independentClaims: 1,
    patentWarYears: "1872–1893",
    impactScore: 100,
  },
};
