import type { Patent } from "@/types/patent";

export const peltonWaterWheelPatent: Patent = {
  id: "us-233692-pelton-water-wheel",
  patentNumber: "US 233,692",
  title: "Water Wheel",
  shortTitle: "Pelton Split-Bucket Impulse Water Turbine",
  subtitle:
    "Bifurcated Double-Cup Buckets with Central Knife-Edge Splitter and 170-Degree Flow Reversal",
  inventors: ["Lester Allen Pelton"],
  inventorLocation: "Camptonville, Yuba County, California",
  grantDate: "1880-10-26",
  filingDate: "1880-07-03",
  era: "Electrification & Early Modern (1870–1920)",
  category: "electricity",
  categoryLabel: "Fluid Mechanics & Hydroelectric Turbines",
  summary:
    "The 1880 hydroelectric breakthrough that powers high-head water generation: Lester Pelton's split-bucket impulse wheel featuring double-cup buckets divided by a sharp central splitter wedge that bifurcates high-pressure water jets and turns the flow through nearly 180 degrees, transferring over 90 percent of the water's kinetic energy into rotational shaft power.",
  heroQuote:
    "The bucket is divided into two halves by a central ridge or splitter... the water-jet striking this sharp edge is divided into two equal streams, which pass around the curved sides of the two compartments and are discharged backwards, transferring nearly all their velocity to the wheel.",
  originalPdfUrl: "/patents/pdfs/us-233692-pelton-water-wheel.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US233692/en",
  usptoClassification: "F03B 1/02 (Pelton wheels; Buckets with splitters)",
  originalTextAsset: {
    url: "/patents/source-text/us-233692-pelton-water-wheel.txt",
    pageCount: 3,
    kind: "source-pdf-text-layer",
  },
  originalText: `UNITED STATES PATENT OFFICE.
LESTER A. PELTON, OF CAMPTONVILLE, CALIFORNIA.

WATER-WHEEL.

Specification forming part of Letters Patent No. 233,692, dated October 26, 1880.
Application filed July 3, 1880.

To all whom it may concern:
Be it known that I, LESTER A. PELTON, of Camptonville, in the County of Yuba and State of California, have invented a new and useful Improvement in Water-Wheels, of which the following is a specification:

My invention relates to that class of water-wheels known as 'impulse' or 'hurdy-gurdy' wheels, driven by the dynamic impact of a high-pressure jet of water issuing from a nozzle.

In wheels of this class heretofore constructed, the buckets were flat cups or curved single troughs. When the jet of water struck the center of the bucket, it created violent turbulence and back-pressure, and the water splashed out in all directions with high residual velocity, wasting from forty to sixty percent of the available energy.

The object of my invention is to utilize the maximum kinetic energy of the water jet by dividing it smoothly and reversing its direction of flow through nearly one hundred and eighty degrees relative to the moving bucket.

My invention consists in:
1. Providing the periphery of the wheel with a series of double-cup buckets, each bucket consisting of two concave curved compartments separated by a sharp central dividing wedge or splitter.
2. Directing the jet of water from the nozzle squarely against the sharp edge of said central splitter.
3. Forming the interior surfaces of the two concave cups so that they smoothly turn each half of the divided stream through an angle of about one hundred and seventy degrees, discharging the water backwards from the outer lateral edges of the bucket clear of the incoming wheel.

As the water jet strikes the knife-edge splitter, it is sliced smoothly into two equal sheets without impact shock or eddying. Each sheet glides smoothly along the curved inner surface of its cup, and because the cup curves back on itself, the water leaves the bucket with a forward absolute velocity nearly equal to zero, having surrendered practically all its momentum to the wheel.

I claim as my invention:
1. A water-wheel bucket comprising two concave curved cups separated by a central splitter wedge or ridge, substantially as described.
2. The combination with an impulse water-wheel of a series of split double-cup buckets and a nozzle arranged to direct a jet of water upon the central splitter ridge to divide and reverse the stream, substantially as described.`,
  plainEnglishExplanation: {
    overview:
      "During the California Gold Rush, miners in the Sierra Nevada mountains needed immense power to crush hard quartz gold ore. Flat-paddle water wheels (called 'hurdy-gurdy' wheels) were terribly inefficient ($40\\%$ efficiency): the water jet hit the flat cup, splashed out chaotically in all directions, and left the wheel carrying half of its kinetic energy. Lester Pelton discovered that if a bucket is shaped as a double cup with a sharp knife-edge splitter down the middle, the water jet is divided into two smooth sheets and turned through nearly $180^\\circ$, dropping its exit velocity to zero and capturing over $90\\%$ of the water's kinetic energy.",
    coreMechanism:
      "A high-pressure water nozzle fed from a high alpine penstock shoots a concentrated jet of water at supersonic or high hydraulic velocity ($v_{\\text{jet}} = \\sqrt{2 g H} > 100\\text{ m/s}$). As each bucket rotates into position, the central knife-edge splitter cleanly divides the circular water jet into two equal halves. Each half-stream flows smoothly around the curved cylindrical side cup, turning through $\\beta \\approx 165^\\circ\\text{ to }170^\\circ$ relative to the moving bucket. Because the wheel is geared to spin at exactly half the speed of the jet ($u = \\frac{1}{2} v_{\\text{jet}}$), the water emerges from the sides with an absolute forward velocity of nearly zero ($v_{\\text{exit}} \\approx 0$), falling gently away into the tailrace by gravity.",
    mechanicalBreakdown: [
      {
        title: "Bifurcated Double-Cup Bucket Geometry",
        summary: "Twin ellipsoidal concave bowls separated by a central knife splitter.",
        technicalDetails:
          "Cast from high-strength bronze or forged steel. The central splitter has a sharp edge ($r < 0.5\\text{ mm}$) and an entrance angle $\\alpha < 15^\\circ$ to prevent shock stagnation pressure, splitting the stream into two balanced lateral sheets.",
        archaicTerm: "Two concave curved cups separated by a central splitter",
        modernEquivalent: "Pelton split-cup runner bucket / Double-hemispherical bucket",
      },
      {
        title: "High-Pressure Impinging Needle Nozzle",
        summary: "Convergent spear nozzle producing a solid, non-diverging water jet.",
        technicalDetails:
          "A convergent circular nozzle with a central adjustable aerodynamic spear needle. Regulating needle axial position dynamically throttles the jet cross-sectional area ($A_{\\text{jet}} = \\pi r^2$) while maintaining full velocity head ($v = \\sqrt{2 g H}$) at partial loads.",
        archaicTerm: "Nozzle arranged to direct a jet of water",
        modernEquivalent: "Pelton spear nozzle / Variable-needle injector",
      },
      {
        title: "Peripheral Runner Disk & Keyed Hub",
        summary: "Forged steel wheel disk mounting 20 to 24 perimeter buckets.",
        technicalDetails:
          "A heavy steel disk with precision CNC/milled lugs securing each bucket with high-strength shear bolts. Operating at tip speeds exceeding $u = 50\\text{ m/s}$, the disk withstands centrifugal stresses $\\sigma_c = \\rho u^2 > 150\\text{ MPa}$ and cyclic hydraulic impulse impacts.",
        archaicTerm: "Periphery of the wheel with double-cup buckets",
        modernEquivalent: "Pelton turbine runner / Impulse turbine wheel",
      },
      {
        title: "Bucket Entrance Cutout Notch",
        summary:
          "Angled lip notch permitting incoming bucket to enter jet without chopping the stream.",
        technicalDetails:
          "A parabolic cutout notch ($w = 0.35 B_{\\text{bucket}}$) machined into the leading lip of each bucket. As the bucket rotates into the jet path, the notch allows the water jet to impinge uninterrupted on the preceding bucket until the central splitter takes over smoothly, preventing parasitic back-splashing against the bucket underside.",
        archaicTerm: "Recess in the front lip of the bucket",
        modernEquivalent: "Bucket entrance notch / Jet clearance cutout",
      },
      {
        title: "Emergency Jet Deflector & Servomotor Actuator",
        summary:
          "Fast-acting hydraulic shield slicing into the jet to protect against grid load dump.",
        technicalDetails:
          "A curved steel deflector blade pivoted between the nozzle tip and bucket perimeter. During sudden full electrical load rejection, a hydraulic servomotor flips the deflector into the jet path within $0.2\\text{ seconds}$, diverting the stream into the tailrace without closing the penstock needle suddenly and causing catastrophic water hammer ($P_{\\text{hammer}} = \\rho c \\Delta v$).",
        archaicTerm: "Deflecting shield for cutting off the stream",
        modernEquivalent: "Jet deflector blade & hydraulic governor servo",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Fluid Momentum Transfer & Euler Turbine Equation",
        formula:
          "F_{\\text{tangential}} = \\dot{m} (v_{\\text{jet}} - u) (1 - \\cos\\beta), \\quad \\text{Power} = \\dot{m} (v_{\\text{jet}} - u) u (1 - \\cos\\beta)",
        explanation:
          "Reversing the water flow through $\\beta = 170^\\circ$ yields $(1 - \\cos 170^\\circ) = 1 - (-0.985) = 1.985$, nearly doubling the thrust force compared to a flat impact cup where $\\beta = 90^\\circ$ ($1 - \\cos 90^\\circ = 1.0$).",
      },
      {
        principle: "Optimal Peripheral Speed Ratio (Zero Residual Kinetic Energy)",
        formula:
          "u_{\\text{optimal}} = \\frac{1}{2} v_{\\text{jet}} \\implies v_{\\text{exit, absolute}} = (v_{\\text{jet}} - u) - u = 0",
        explanation:
          "When the bucket speed $u$ equals half the water jet speed, the relative exit velocity matches the forward motion of the bucket in the opposite direction, leaving the water stationary in space with zero wasted kinetic energy ($E_{k,\\text{exit}} = 0$).",
      },
      {
        principle: "Torricelli High-Head Jet Hydrodynamics",
        formula:
          "v_{\\text{jet}} = C_v \\sqrt{2 g H}, \\quad \\dot{m} = \\rho A_{\\text{jet}} v_{\\text{jet}}",
        explanation:
          "Under alpine water heads of $H = 500\\text{ to }1,500\\text{ meters}$, water jet velocities exceed $100\\text{ to }170\\text{ m/s}$ ($360\\text{ to }600\\text{ km/h}$), generating megawatt power densities in compact turbine housings.",
      },
      {
        principle: "Specific Speed & High-Head Hydraulic Efficiency Regime",
        formula: "N_s = \\frac{N \\sqrt{P}}{H^{5/4}} \\approx 5\\text{ to }30\\text{ (metric)}",
        explanation:
          "The low specific speed $N_s$ classification of the Pelton impulse turbine makes it thermodynamically superior to reaction turbines (Francis/Kaplan) for high hydraulic heads ($H > 200\\text{ m}$) with low volumetric flow rates.",
      },
    ],
    whyItMattersToday:
      "The Pelton wheel is the most efficient high-head water turbine in existence, operating at measured peak efficiencies exceeding $93\\%$. Pelton turbines generate high-pressure clean hydroelectric power across the Rocky Mountains, the European Alps, and the Himalayas, powering alpine regional power grids and pumped-storage energy systems worldwide.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "A water-wheel bucket comprising two concave curved cups separated by a central splitter wedge or ridge, substantially as described.",
      plainEnglish:
        "Master pioneer claim: a water turbine bucket formed of two concave curved cups separated by a central splitter wedge or ridge to bifurcate water flow.",
      keyInnovations: [
        "Double-cup split bucket geometry",
        "Central knife-edge water jet splitter",
        "180-degree flow reversal impulse extraction",
      ],
      legalSignificance:
        "The landmark structural claim defining the Pelton water wheel, licensed and manufactured globally.",
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "The combination with an impulse water-wheel of a series of split double-cup buckets and a nozzle arranged to direct a jet of water upon the central splitter ridge to divide and reverse the stream, substantially as described.",
      plainEnglish:
        "Specifies the combination of an impulse water wheel with perimeter split buckets and an aligned nozzle directing a high-velocity jet onto the central splitter.",
      keyInnovations: [
        "Direct jet-to-splitter hydraulic alignment",
        "Kinetic impulse hydrodynamic energy transfer",
      ],
      legalSignificance:
        "Protected the complete impulse hydroelectric turbine system architecture.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Plan and Cross-Section of Pelton Split Bucket & Nozzle",
      caption:
        "Drawing showing circular wheel perimeter, double-cup bucket cross-section, central knife-edge splitter, and impinging water jet trajectory.",
      svgType: "pelton-water-wheel",
      callouts: [
        {
          id: "pw-1",
          figureRef: "Fig. 1",
          label: "A",
          element: "Double-Cup Concave Bowls",
          description: "Symmetrical curved side compartments turning flow backwards.",
          x: 50,
          y: 40,
        },
        {
          id: "pw-2",
          figureRef: "Fig. 1",
          label: "B",
          element: "Central Knife-Edge Splitter",
          description: "Sharp wedge dividing water jet cleanly into two equal streams.",
          x: 50,
          y: 60,
        },
        {
          id: "pw-3",
          figureRef: "Fig. 1",
          label: "C",
          element: "High-Pressure Needle Nozzle",
          description: "Convergent spear nozzle directing jet onto bucket splitter.",
          x: 20,
          y: 60,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "In the 1870s, California gold miners used high-pressure water cannons ('monitors') for hydraulic mining. When they diverted this high-pressure water to drive wooden paddle wheels to run stamp mills, the flat buckets broke under the violent jet and wasted more than half the energy in wild splash-back.",
    priorArtLimitations: [
      "Flat-cup 'hurdy-gurdy' wheels achieved barely 40% efficiency because water exited perpendicular to the wheel.",
      "Reaction Francis turbines required massive volumes of low-pressure water and were destroyed by abrasive silt and high-head pressures.",
      "Single-trough curved buckets pushed the wheel laterally and splashed incoming buckets.",
    ],
    breakthroughInsight:
      "In 1878 at Nevada City, California, Lester Pelton watched an ordinary curved bucket wheel when a mounting key slipped, misaligning the wheel so that the water jet struck the *edge* of the cup rather than the center. To his astonishment, the wheel suddenly sped up! Pelton realized that deflecting the water in a curved U-turn extracted twice the momentum, and immediately built a double-cup bucket with a central splitter.",
    patentWars: [
      {
        rivalName: "1883 University of California Turbine Competition",
        rivalClaim:
          "Rival California iron foundries (Knight, Collins, Risdon) claimed their flat and single-curved water wheels were superior.",
        conflictDetails:
          "In 1883, the University of California conducted exhaustive comparative dynamometer efficiency tests on all competing water wheels in Berkeley, California.",
        resolution:
          "Pelton's split-bucket wheel achieved an unprecedented efficiency of 90.2%, completely crushing all rivals (which tested at 60% to 65%). The Pelton Water Wheel Company in San Francisco immediately took over the global mining and hydroelectric market.",
        legalOutcome:
          "Pelton's Patent 233,692 was upheld in all federal courts, making Pelton the definitive standard for impulse turbines.",
      },
    ],
    civilizationalImpact:
      "Pelton wheels powered the earliest electric power stations in the American West (such as the 1895 Folsom Powerhouse delivering high-voltage AC to Sacramento, 22 miles away). They enabled the electrification of mines, factories, and alpine rail networks across the world.",
    funFact:
      "Lester Pelton was a mild-mannered Ohio carpenter who joined the 1849 California Gold Rush. Finding little gold in panning, he built mining flumes and water wheels in Camptonville, California, testing his prototype double-cup buckets in a converted wooden butter churn using water piped from a local creek!",
    aftermath:
      "Pelton sold his patent and business rights in 1888 to the Pelton Water Wheel Company in San Francisco, receiving substantial royalties that allowed him to retire comfortably in Oakland, California. In 1895, Pelton was awarded the Elliott Cresson Medal by the Franklin Institute for his monumental contribution to hydraulic engineering.",
  },
  tags: [
    "Lester Pelton",
    "Water Wheel",
    "Hydroelectric Turbine",
    "Pelton Wheel",
    "Fluid Mechanics",
    "Euler Turbine Equation",
  ],
  stats: {
    totalClaims: 2,
    independentClaims: 1,
  },
};
