import {
  parsonsManualClaimText,
  parsonsTurbineArchivalEdition,
} from "@/data/editions/parsonsTurbineEdition";
import type { Patent } from "@/types/patent";

// Retained only as a non-exported legacy snapshot of the superseded catalogue
// copy. It is not registered or rendered; US 608,969 is the marine-turbine
// plumbing patent described by the source-faithful export below.
const _parsonsTurbineLegacyRecord: Patent = {
  id: "us-608969-parsons-turbine",
  patentNumber: "US 608,969",
  title: "Steam-Turbine",
  shortTitle: "Parsons Multi-Stage Axial Reaction Steam Turbine",
  subtitle:
    "Multi-Stage Pressure Compounding, Aerodynamic Reaction Blading, Annular Flow Expansion, and Hydrodynamic Journal Bearings",
  inventors: ["Charles Algernon Parsons"],
  inventorLocation: "Newcastle-upon-Tyne, County of Northumberland, England",
  grantDate: "1898-08-09",
  filingDate: "1897-09-07",
  era: "Electrification & Early Modern (1870–1920)",
  category: "electricity",
  categoryLabel: "Fluid Dynamics & Turbomachinery",
  summary:
    "The 1898 turbomachinery foundation that powers modern electrical grids and maritime propulsion: Sir Charles Parsons' multi-stage axial-flow reaction steam turbine. By dividing high-pressure steam expansion across dozens of sequential alternating stationary and rotating blade rings with expanding annular areas, Parsons controlled blade tip velocities while extracting over 80 percent of the steam's available enthalpy into pure rotational shaft power.",
  heroQuote:
    "The steam is caused to pass through a series of successive rings of fixed guide-blades and moving turbine-blades... the steam expanding gradually through each ring from the high-pressure inlet to the condenser, giving up its energy by reaction at moderate peripheral speeds...",
  originalPdfUrl: "/patents/pdfs/us-608969-parsons-turbine.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US608969/en",
  usptoClassification: "F01D 1/04 (Axial-flow reaction steam turbines; Multi-stage expansion)",
  originalTextAsset: {
    url: "/patents/source-text/us-608969-parsons-turbine.txt",
    pageCount: 7,
    kind: "source-pdf-text-layer",
  },
  originalText: `UNITED STATES PATENT OFFICE.
CHARLES ALGERNON PARSONS, OF NEWCASTLE-UPON-TYNE, ENGLAND.

STEAM-TURBINE.

Specification forming part of Letters Patent No. 608,969, dated August 9, 1898.
Application filed September 7, 1897.

To all whom it may concern:
Be it known that I, The Honorable CHARLES ALGERNON PARSONS, a subject of the Queen of Great Britain, residing at Newcastle-upon-Tyne, in the county of Northumberland, England, have invented certain new and useful Improvements in Steam Turbines, of which the following is a specification:

My invention relates to improvements in parallel-flow or axial-flow steam turbines, in which steam passes longitudinally through an annular casing containing alternating rings of fixed guide-blades and rotating moving blades.

In single-stage steam turbines (such as the De Laval turbine), the full pressure drop from the boiler to the condenser occurs across a single nozzle, producing steam jet velocities of 3,000 to 4,000 feet per second, requiring wheel speeds of 30,000 revolutions per minute, which are dangerous, difficult to gear down, and waste energy in blade friction.

The object of my invention is to split the total steam expansion into a large number of small, gradual successive stages (pressure compounding), so that the steam velocity across each individual ring of blades is kept at a moderate, practical value (300 to 600 feet per second), allowing direct coupling to dynamos and ship propeller shafts at efficient speeds.

The invention comprises:
1. A cylindrical rotor shaft surrounded by a stationary outer casing.
2. A large series of alternating annular rings of stationary guide-vanes attached to the casing and moving rotor blades attached to the shaft.
3. The blade passages between both the fixed and moving blades are shaped as convergent nozzles, so that the steam expands and drops in pressure in both the stationary guide-rings and the moving blade-rings, driving the rotor forward both by the impulse of the entering jet and by the reaction of the expanding jet leaving the moving blades (50% reaction blading).
4. The annular radial height and passage area of the blade rings increase progressively in steps from the small high-pressure inlet end to the large low-pressure exhaust end, providing for the immense volumetric expansion of the steam as its pressure falls to a vacuum condenser.
5. Dummy balance pistons mounted on the shaft to balance the longitudinal axial steam thrust, and pressurized oil-film bearings to support the high-speed rotor.

I claim as my invention:
1. In a multi-stage reaction steam turbine, the combination of a casing and a rotor with alternating rings of fixed and moving blades having converging passages, the annular area of said blade rings increasing from the high-pressure inlet to the exhaust to accommodate the volumetric expansion of the steam, substantially as described.
2. The combination with the stepped rotor and blade rings of dummy balance pistons to equalize the axial steam thrust, substantially as described.`,
  plainEnglishExplanation: {
    overview:
      "Reciprocating steam engines were giant, clanking beasts: huge pistons moved back and forth, shaking ships, wearing out bearings, and wasting energy. Early steam turbines (like Gustaf de Laval's single-wheel turbine) expanded steam all in one blast, shooting steam at $1,200\\text{ m/s}$ and spinning at a terrifying $30,000\\text{ RPM}$ that threw off gear teeth and shattered rotors. Anglo-Irish genius Sir Charles Parsons solved this by inventing 'pressure compounding': breaking the steam's expansion into 50 to 100 gentle steps. Alternating rings of fixed and moving curved blades drop the pressure by just a few percent per stage, allowing the turbine to spin at smooth, manageable speeds ($1,500\\text{ to }3,000\\text{ RPM}$) while extracting over $85\\%$ of the steam's energy.",
    coreMechanism:
      "High-pressure superheated steam ($P = 15\\text{ to }30\\text{ bar}$) enters the small high-pressure end of the turbine casing. It flows axially through alternating rings of stationary blades (bolted to the outer casing) and rotating blades (keyed to the rotor shaft). Each blade passage acts as a convergent nozzle: in the stationary blade ring, the steam expands slightly, speeding up and striking the rotor blades by impulse; in the moving blade ring, the steam expands further as it leaves the curved trailing edge, generating a forward thrust by Newton's third law *reaction* (hence '$50\\%$ reaction blading'). Because steam expands over 1,000-fold in volume as it drops from boiler pressure to condenser vacuum ($P = 0.05\\text{ bar}$), the blade heights and rotor diameter step outward in graduated stages from $2\\text{ cm}$ at the inlet to $50\\text{ cm}$ at the exhaust.",
    mechanicalBreakdown: [
      {
        title: "Multi-Stage Convergent Reaction Aerodynamic Blading",
        summary: "50% reaction airfoil blades accelerating steam in both stator and rotor.",
        technicalDetails:
          "Formed from drawn brass or stainless steel airfoils rolled with precision root dovetails. Symmetrical $50\\%$ degree of reaction ($R = \\frac{\\Delta h_{\\text{rotor}}}{\\Delta h_{\\text{stage}}} = 0.50$) splits enthalpy drop equally between stator and rotor nozzles, minimizing aerodynamic boundary layer separation.",
        archaicTerm: "Alternating rings of fixed guide-blades and moving turbine-blades",
        modernEquivalent: "Parsons 50% reaction axial turbine blading / Stator-rotor stages",
      },
      {
        title: "Stepped Steaming Annular Flow Geometry",
        summary: "Graduated cylinder diameters expanding volumetric flow 1,000-fold.",
        technicalDetails:
          "The rotor is machined in three to four stepped cylindrical barrels (High Pressure, Intermediate Pressure, Low Pressure). As specific volume expands from $v_1 = 0.1\\text{ m}^3/\\text{kg}$ to $v_2 = 25\\text{ m}^3/\\text{kg}$, the annular cross-sectional flow area ($A = \\pi D_{\\text{mean}} h_{\\text{blade}}$) scales up to keep axial steam velocity constant ($V_{\\text{axial}} = 80\\text{ to }120\\text{ m/s}$).",
        archaicTerm: "Annular area increasing progressively from inlet to exhaust",
        modernEquivalent: "Annular volumetric expansion path / Stepped drum casing",
      },
      {
        title: "Dummy Balance Pistons & Labyrinth Shaft Seals",
        summary: "Opposing pressure drums balancing aerodynamic axial rotor thrust.",
        technicalDetails:
          "To counter the massive longitudinal steam thrust ($F_{\\text{thrust}} = \\sum \\Delta P_i A_i > 80\\text{ kN}$ pushing the shaft toward the exhaust), cylindrical balance pistons (dummies) of matching diameters are exposed to forward steam pressures, balancing axial forces to within $5\\%$ and relieving thrust bearings.",
        archaicTerm: "Dummy balance pistons to equalize axial steam thrust",
        modernEquivalent: "Labyrinth-sealed dummy balance piston & axial thrust collar",
      },
      {
        title: "Labyrinth Multi-Fin Steam Shaft Seals",
        summary: "Non-contacting annular bronze fins creating progressive pressure throttling.",
        technicalDetails:
          "A series of 20 to 30 sharp brass knife-edge rings projecting with $0.25\\text{ mm}$ radial clearance against a grooved rotor sleeve. Steam rushing through each constriction undergoes repeated isenthalpic kinetic expansion and vortex dissipation ($P_{k+1} = P_k - \\frac{\\rho v^2}{2}$), sealing high-pressure casing glands without frictional contact wear.",
        archaicTerm: "Labyrinth packing or grooved shaft seals",
        modernEquivalent: "Labyrinth non-contact shaft gland seals",
      },
      {
        title: "Centrifugal Governor & Steam Puff Valve",
        summary:
          "Pulsing relay valve throttling steam admission in intermittent high-pressure bursts.",
        technicalDetails:
          "A centrifugal flyball governor linked to a steam relay puff valve that pulses steam admission to the first stage at $2\\text{ to }4\\text{ Hz}$. Throttling via pulse-width modulation rather than continuous restriction preserves full boiler pressure ($P_{\\text{inlet}} = 20\\text{ bar}$) even under partial grid load, maintaining high stage efficiency.",
        archaicTerm: "Governor regulating the intermittent admission of steam",
        modernEquivalent: "Pulse-width steam governor & electro-hydraulic servo throttle",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Stage Enthalpy Drop & Blade-to-Gas Velocity Ratio",
        formula:
          "\\Delta h_{\\text{stage}} = \\frac{\\Delta h_{\\text{total}}}{N_{\\text{stages}}}, \\quad u = \\omega R_{\\text{mean}} = \\nu \\cdot C_0 \\approx 0.707 \\sqrt{2 \\Delta h_{\\text{stage}}}",
        explanation:
          "Dividing total steam enthalpy drop ($\\Delta h \\approx 1,000\\text{ kJ/kg}$) across $N = 60$ stages reduces the stage isentropic jet speed $C_0$ from $1,400\\text{ m/s}$ to only $180\\text{ m/s}$, matching the optimal reaction blade tip speed ($u \\approx 130\\text{ m/s}$) at electrical grid frequencies (3,000 RPM).",
      },
      {
        principle: "Isentropic Steam Expansion & Continuity Law",
        formula:
          "\\dot{m} = \\rho(P) \\cdot A(x) \\cdot V_{\\text{axial}}(x) = \\text{constant}, \\quad A(x) = \\frac{\\dot{m} \\cdot v_{\\text{specific}}(P)}{V_{\\text{axial}}}",
        explanation:
          "Because specific volume $v_{\\text{specific}}$ increases exponentially as steam expands towards vacuum, the annular passage area $A(x)$ must expand by a factor of 50 to 100 to prevent sonic choking.",
      },
      {
        principle: "Euler Turbomachinery Reaction Torque Extraction",
        formula:
          "\\tau = \\dot{m} R_{\\text{mean}} (C_{u1} - C_{u2}), \\quad \\text{Power} = \\tau \\cdot \\omega = \\dot{m} (h_1 - h_2) \\cdot \\eta_{\\text{isentropic}}",
        explanation:
          "Pure fluid momentum transfer converts thermal enthalpy directly into smooth continuous rotational shaft work without reciprocating pistons, linkages, or vibration.",
      },
      {
        principle: "Rankine Cycle Condenser Vacuum Power Multiplication",
        formula:
          "W_{\\text{expansion}} = \\int_{P_{\\text{condenser}}}^{P_{\\text{boiler}}} v(P) \\, dP, \\quad P_{\\text{vacuum}} = 0.05\\text{ bar} \\implies +40\\% \\text{ Work Output}",
        explanation:
          "Unlike reciprocating steam engines that choked at high specific volumes, the Parsons turbine can expand steam down to a deep condenser vacuum ($0.05\\text{ bar}, 33^\\circ\\text{C}$), harvesting massive low-pressure expansion work that was previously discarded.",
      },
    ],
    whyItMattersToday:
      "Sir Charles Parsons' steam turbine is the prime mover that generates over $80\\%$ of all electricity on Earth today across nuclear power plants, coal plants, and combined-cycle gas thermal stations. It transformed naval architecture, powering the British Dreadnought battleships, luxury ocean liners like the Titanic and Queen Mary, and modern nuclear-powered aircraft carriers and submarines.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "In a multi-stage reaction steam turbine, the combination of a casing and a rotor with alternating rings of fixed and moving blades having converging passages, the annular area of said blade rings increasing from the high-pressure inlet to the exhaust to accommodate the volumetric expansion of the steam, substantially as described.",
      plainEnglish:
        "Master pioneer claim: a multi-stage reaction steam turbine comprising a casing and rotor with alternating rings of fixed and moving converging blades, with the annular passage area expanding from inlet to exhaust to match steam volume expansion.",
      keyInnovations: [
        "Multi-stage axial-flow pressure compounding",
        "50% reaction convergent stator-rotor blading",
        "Stepped annular passage expansion for steam volume growth",
      ],
      legalSignificance:
        "The master pioneer claim for modern multi-stage axial-flow steam and gas turbines worldwide.",
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "The combination with the stepped rotor and blade rings of dummy balance pistons to equalize the axial steam thrust, substantially as described.",
      plainEnglish:
        "Specifies the combination of stepped rotor blading with dummy balance pistons to pneumatically equalize axial steam thrust on the high-speed rotor shaft.",
      keyInnovations: [
        "Pneumatic dummy balance piston system",
        "Rotor axial thrust neutralization",
      ],
      legalSignificance:
        "Protected the axial balance architecture that allowed massive multi-megawatt turbines to run without burning out thrust bearings.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Longitudinal Section of Parsons Multi-Stage Steam Turbine",
      caption:
        "Cutaway drawing showing stepped rotor drum, alternating stator and rotor blade rings, expanding annular casing, dummy balance pistons, high-pressure steam inlet, and exhaust to condenser.",
      svgType: "parsons-turbine",
      callouts: [
        {
          id: "pt-1",
          figureRef: "Fig. 1",
          label: "A",
          element: "Stepped Rotor Drum & Blades",
          description: "Solid forged shaft carrying expanding rings of reaction blades.",
          x: 50,
          y: 50,
        },
        {
          id: "pt-2",
          figureRef: "Fig. 1",
          label: "B",
          element: "Stationary Casing Guide-Vanes",
          description: "Internal casing rings directing steam into moving blades.",
          x: 50,
          y: 35,
        },
        {
          id: "pt-3",
          figureRef: "Fig. 1",
          label: "C",
          element: "High-Pressure Steam Inlet",
          description: "Admission throat receiving superheated steam at 20 bar.",
          x: 20,
          y: 30,
        },
        {
          id: "pt-4",
          figureRef: "Fig. 1",
          label: "D",
          element: "Dummy Axial Balance Pistons",
          description: "Opposing pressure cylinders balancing 80 kN axial steam thrust.",
          x: 15,
          y: 50,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "In the 1880s, the newly born electrical power industry was bottlenecked by reciprocating steam engines: piston engines were massive, limited to 100 RPM, suffered heavy frictional losses, and shook power station buildings with violent vibrations that threw dynamo belts off pulleys.",
    priorArtLimitations: [
      "Reciprocating steam engines wasted vast amounts of energy in the condensation and re-evaporation of steam on cylinder walls.",
      "Single-stage De Laval turbines ran at 30,000 RPM, which produced excessive blade friction in dense steam and required fragile 10:1 reduction gears.",
      "No direct-drive prime mover existed that could spin large electrical dynamos at 3,000 RPM with smooth, vibrationless rotary motion.",
    ],
    breakthroughInsight:
      "Charles Parsons, son of the famous Irish astronomer William Parsons (the 3rd Earl of Rosse who built the 'Leviathan of Parsonstown' telescope), applied thermodynamic theory to realize that if expansion occurred in dozens of small drops across alternating stator and rotor nozzles, steam velocity would never exceed blade speed limits, extracting maximum thermodynamic efficiency.",
    patentWars: [
      {
        rivalName: "1897 Turbinia Naval Spithead Fleet Review Stunt",
        rivalClaim:
          "The British Admiralty and conservative marine engineers dismissed the steam turbine as a 'toy' unsuitable for propelling heavy ocean ships.",
        conflictDetails:
          "Frustrated by Admiralty skepticism, Parsons built a sleek 100-foot experimental yacht, the Turbinia, powered by his multi-stage steam turbine delivering 2,000 horsepower. At Queen Victoria's Diamond Jubilee Naval Review at Spithead in 1897, before 165 Royal Navy battleships and the Prince of Wales, Parsons staged an unauthorized demonstration!",
        resolution:
          "Parsons opened the turbine throttles: Turbinia blasted through the warship lines at an unprecedented, mind-boggling speed of 34.5 knots (40 mph), outrunning the Navy's fastest torpedo boat destroyers with ease! The Admiralty was stunned and immediately ordered turbine engines for all new destroyers, cruisers, and battleships, culminating in the landmark HMS Dreadnought in 1906.",
        legalOutcome:
          "Parsons' patents were licensed to Westinghouse in America and Brown Boveri in Europe, establishing the global steam turbine industry.",
      },
    ],
    civilizationalImpact:
      "The Parsons steam turbine is one of the greatest engineering achievements of mankind. It made central power stations possible, generating high-voltage alternating current across nationwide grids. It enabled transatlantic passenger ocean liners to cut crossing times from weeks to days and revolutionized naval power.",
    funFact:
      "During early high-speed runs of the Turbinia, Parsons discovered the physical phenomenon of 'propeller cavitation'—where propellers spinning at 2,000 RPM create vacuum steam bubbles that collapse with thousands of atmospheres of impact pressure, pitting the bronze blades! Parsons built the world's first water tunnel with a stroboscope to study cavitation physics and solved it by using nine propellers across three shafts.",
    aftermath:
      "Sir Charles Parsons was elected a Fellow of the Royal Society, knighted in 1911, and awarded the Copley Medal in 1928. He died in 1931 at age 76 aboard the ocean liner Duchess of Richmond. His company, C. A. Parsons and Company, operated for nearly a century and is today part of Siemens Energy.",
  },
  tags: [
    "Charles Parsons",
    "Steam Turbine",
    "Turbomachinery",
    "Fluid Dynamics",
    "Turbinia",
    "Power Generation",
  ],
  stats: {
    totalClaims: 2,
    independentClaims: 1,
  },
};

export const parsonsTurbinePatent: Patent = {
  id: "us-608969-parsons-turbine",
  patentNumber: "US 608,969",
  title: "Marine Steam-Turbine",
  shortTitle: "Parsons Selectable Marine Turbine Trains",
  subtitle:
    "Series, simple-parallel, and compound-parallel steam routing for screw-shaft propulsion",
  inventors: ["Charles Algernon Parsons"],
  inventorLocation: "Heaton Works, Newcastle-upon-Tyne, England",
  grantDate: "1898-08-09",
  filingDate: "1898-03-04",
  era: "Electrification & Early Modern (1870–1920)",
  category: "electricity",
  categoryLabel: "Marine Propulsion & Steam Turbines",
  summary:
    "US 608,969 concerns the valve-and-pipe arrangements that let several marine steam turbines drive screw-shafts economically at cruising and full power. Parsons describes selectable series, simple-parallel, and compound-parallel flow paths, turbine sets of different capacities, and reversing turbines that run freely in condenser vacuum while the forward turbines operate.",
  heroQuote:
    "My invention consists in new methods of arranging, proportioning, and operating a set of steam-turbines so as to enable economy to be maintained under widely-varying conditions.",
  originalPdfUrl: "/patents/pdfs/us-608969-parsons-turbine.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US608969/en",
  usptoClassification:
    "Marine steam-turbine propulsion; turbine connections and reversing arrangements",
  originalTextAsset: {
    url: "/patents/transcripts/us-608969-parsons-turbine-reviewed.txt",
    pageCount: 7,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-08-18",
    sourcePdfSha256: parsonsTurbineArchivalEdition.sourcePdfSha256,
  },
  archivalEdition: parsonsTurbineArchivalEdition,
  originalText: `To all whom it may concern:

Be it known that I, CHARLES ALGERNON PARSONS, engineer, a subject of the Queen of Great Britain and Ireland, residing at Heaton Works, Newcastle-upon-Tyne, England, have invented certain new and useful Improvements in Marine Steam-Turbines, of which the following is a specification.

My invention relates to marine steam-engines; and it is chiefly applicable to engines of the steam-turbine class.

My object is to so arrange the engines and couple up the steam connections as to enable the engines to be operated more economically under all conditions of power and speed variation.`,
  plainEnglishExplanation: {
    overview:
      "This patent is about running several turbine engines as a ship propulsion system, not about the internal blade design of an axial reaction turbine. Its central engineering choice is the pipe-and-valve network: at low power the same steam can expand through a longer series of machines, while at greater power the network divides it among parallel routes.",
    coreMechanism:
      "Steam leaves the boiler, passes through selected turbine sets, and ultimately reaches a condenser. The selected valve positions determine whether the route is serial, simple parallel, or compound parallel. Parsons also changes turbine capacity along a train so expansion is shared across the machines, and he permits unused or reversing turbines to rotate in the condenser vacuum.",
    mechanicalBreakdown: [
      {
        title: "Selectable turbine trains",
        summary: "Valves and pipes choose the steam route through more than one marine turbine.",
        technicalDetails:
          "The printed claims require pipe-and-valve connections between plural turbines. The specification gives series, simple-parallel, and compound-parallel arrangements rather than a single fixed route.",
        archaicTerm: "compound parallel",
        modernEquivalent: "A parallel arrangement of staged turbine flow paths.",
      },
      {
        title: "Graduated capacity",
        summary: "Turbines farther along a series may have greater capacity.",
        technicalDetails:
          "Parsons says capacity may rise from one turbine to the next by actual dimensions, rotational speed, or both. The stated purpose is to distribute expansion while the system serves different power conditions.",
        archaicTerm: "capacity or volume",
        modernEquivalent: "Flow-handling capacity of a turbine stage or machine.",
      },
      {
        title: "Reversing turbines",
        summary: "A separate reversing turbine can act on a forward-turbine shaft.",
        technicalDetails:
          "Claims 2 and 3 specify a reversing turbine connected to a shaft. When the forward turbines run, that reversing turbine runs in vacuum; Figure 2 describes using X or Y when going astern.",
        archaicTerm: "running in vacuum",
        modernEquivalent:
          "Turning with its working space connected to condenser vacuum rather than supplied with driving steam.",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Staged expansion",
        explanation:
          "The source treats expansion as a sequence of pressure drops across several engines. Selecting more serial machines gives the steam more successive expansion steps before condensation.",
      },
      {
        principle: "Parallel flow division",
        explanation:
          "In the compound-parallel arrangements, separate turbine trains receive steam from the boiler and exhaust to the condenser. The routing trades the number of operating paths against the demanded ship power.",
      },
    ],
    whyItMattersToday:
      "The document records a marine-turbine control problem in unusually concrete form: how to keep a multi-machine propulsion plant economical at both cruising and full power, while also providing astern operation. Its contribution here is the network of selectable flow paths and turbine groupings printed in the specification and claims.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: parsonsManualClaimText(1),
      plainEnglish:
        "This claim covers a marine propulsion combination with several screw-shafts and turbines, plus the pipes and valves that can couple the turbines in series, simple parallel, or compound parallel. The protected subject is the selectable interconnection, not an asserted blade profile or pressure value.",
      keyInnovations: [
        "Screw-shaft turbine groups",
        "Valve-selected series flow",
        "Compound-parallel turbine connections",
      ],
    },
    {
      number: 2,
      isIndependent: true,
      originalText: parsonsManualClaimText(2),
      plainEnglish:
        "This claim adds turbines on separate screw-shafts and a reversing turbine on one shaft. It requires pipe-and-valve connections that select series or compound-parallel operation and says the reversing turbine runs in vacuum while the forward turbines are running.",
      keyInnovations: [
        "Reversing turbine",
        "Vacuum-running idle turbine",
        "Shaft-specific turbine connection",
      ],
    },
    {
      number: 3,
      isIndependent: true,
      originalText: parsonsManualClaimText(3),
      plainEnglish:
        "This shorter claim protects the combination of plural shafts, plural turbines with pipe connections, and a reversing turbine connected to one shaft that runs in vacuum while the first-mentioned turbines operate.",
      keyInnovations: [
        "Plural screw-shafts",
        "Pipe-connected turbines",
        "Vacuum-running reversing turbine",
      ],
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Eight turbines on four screw-shafts",
      caption:
        "The first drawing sheet shows the A through D-prime turbine sets connected to four screw-shafts.",
      svgType: "parsons-turbine",
      callouts: [],
    },
    {
      figureNumber: "Fig. 2",
      title: "Four main turbines with reversing turbines",
      caption:
        "The second sheet shows main turbines A through D and reversing turbines X and Y for a fast vessel or torpedo-boat destroyer.",
      svgType: "parsons-turbine",
      callouts: [],
    },
    {
      figureNumber: "Fig. 3",
      title: "Six turbines on three screw-shafts",
      caption: "The third sheet shows the three-shaft, six-motor modification.",
      svgType: "parsons-turbine",
      callouts: [],
    },
  ],
  historicalContext: {
    problemStatement:
      "The specification identifies economical marine operation across low and high powers and slow and high speeds as the problem for a set of steam-turbines.",
    priorArtLimitations: [
      "Existing high-economy engines used successive expansion through cylinders or engines.",
      "Known mechanical arrangements could balance moving crank-shaft parts or admit live steam for starting, but Parsons states those arrangements are outside this invention.",
    ],
    breakthroughInsight:
      "The source combines turbine capacity graduation with valve-controlled series, simple-parallel, and compound-parallel connections, so that different operating conditions select different expansion paths.",
    patentWars: [],
    civilizationalImpact:
      "The document expressly addresses marine propulsion, including large war-ships, cruising speeds, full power, and astern operation. It does not itself establish the broader historical claims formerly printed on this record.",
  },
  tags: [
    "Charles Algernon Parsons",
    "Marine propulsion",
    "Steam turbines",
    "Screw-shafts",
    "Reversing turbines",
  ],
  stats: { totalClaims: 3, independentClaims: 3 },
};
