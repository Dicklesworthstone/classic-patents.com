import type { Patent } from "@/types/patent";

export const gliddenBarbedWirePatent: Patent = {
  id: "us-157124-glidden-barbed-wire",
  patentNumber: "US 157,124",
  title: "Improvement in Wire-Fences",
  shortTitle: "Glidden 'The Winner' Barbed Wire Fence",
  subtitle: "Two-Strand Interlocked Twisted Wire with Coiled Spur Barbs Locked at Fixed Intervals",
  inventors: ["Joseph Farwell Glidden"],
  inventorLocation: "DeKalb, DeKalb County, Illinois",
  grantDate: "1874-11-24",
  filingDate: "1873-10-27",
  era: "Civil War & Industrial Acceleration (1860–1880)",
  category: "materials",
  categoryLabel: "Metallurgy & Structural Wire Fencing",
  summary:
    "The 1874 agricultural patent that settled the American frontier: Joseph Glidden's 'The Winner' barbed wire, featuring short two-pointed wire spur barbs coiled around a primary longitudinal strand and locked permanently in place under mechanical tension by a second twisted strand, creating a cheap, durable, cattle-proof fencing barrier in woodless prairies.",
  heroQuote:
    "The spur-wires are coiled around one of the wires of the fence, and a second wire is then twisted around the first, firmly locking and holding the spur-wire at the point where it is coiled...",
  originalPdfUrl: "/patents/pdfs/us-157124-glidden-barbed-wire.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US157124/en",
  usptoClassification: "B21F 25/00 (Making barbed wire; Barbed wire construction)",
  originalTextAsset: {
    url: "/patents/transcripts/us-157124-glidden-barbed-wire.txt",
    pageCount: 2,
    kind: "reviewed-transcription",
  },
  originalText: `UNITED STATES PATENT OFFICE.
JOSEPH F. GLIDDEN, OF DeKALB, ILLINOIS.

IMPROVEMENT IN WIRE-FENCES.

Specification forming part of Letters Patent No. 157,124, dated November 24, 1874.
Application filed October 27, 1873.

To all whom it may concern:
Be it known that I, JOSEPH F. GLIDDEN, of DeKalb, in the County of DeKalb and State of Illinois, have invented a new and useful Improvement in Wire Fences, of which the following is a specification:

The nature of my invention consists in:
1. Coiling a short piece of wire around a single long strand of fence-wire to form a two-pointed spur or barb.
2. Combining with said barbed strand a second smooth strand of fence-wire, the two strands being twisted together throughout their entire length, whereby the coiled barbs are clamped and locked rigidly at their respective positions and prevented from slipping, sliding longitudinally, or rotating around the wire.

In prior attempts to construct barbed wire, the barbs were loose and would slide along the wire or turn around so as to present no effective point of resistance against cattle, or they required soldering or flattening, which weakened the wire.

In my invention:
The spur-wire is formed from a short piece of steel or iron wire bent with two sharp diagonal points at its ends, and coiled centrally around one of the fence-wires by two turns.
After a series of these spur-wires have been placed upon the main wire at regular intervals (say six inches apart), a second wire of equal length is laid alongside it, and the two wires are twisted together under tension by a twisting machine.

The interlocking twists of the two wires bind against the coiled portions of the spur-wires with immense friction, locking each barb permanently in place so that it cannot be displaced by cattle leaning or crowding against the fence.

Furthermore, the helical twisting of the two strands imparts an elastic spring-like quality to the fence, allowing it to expand in summer and contract in winter without sagging or snapping under seasonal changes of temperature.

I claim as my invention:
1. In combination with a fence-wire, a barb formed by coiling a short piece of wire around it with projecting points, and a second wire twisted with the first to lock the barb in place, substantially as described.
2. The twisted double-strand wire fence having spur-wires coiled upon one strand and held from longitudinal and rotary displacement by the intertwining of the two strands.`,
  plainEnglishExplanation: {
    overview:
      "In the 1870s, the westward expansion of American farming ground to a dead halt at the edge of the Great Plains. The vast prairie had millions of square miles of rich fertile soil, but virtually no trees to build traditional split-rail wooden fences. Plain smooth wire was useless: 1,000-pound longhorn cattle simply leaned against it, stretching the wire and trampling crops. Illinois farmer Joseph Glidden invented 'The Winner' barbed wire: coiled two-pointed steel spur barbs held immovably in place by twisting two wires together under tension.",
    coreMechanism:
      "A short piece of zinc-galvanized steel wire is sheared with sharp diagonal chisel points and coiled two full turns around a primary longitudinal wire strand. A second smooth wire strand is laid alongside, and both wires are twisted together in a continuous helix ($4\\text{ to }6\\text{ twists per foot}$). The helical twist acts as a permanent mechanical clamp: the outer strand presses against the coiled loops of the barb, wedging the coil tightly against the inner strand. This mechanical interlock prevents the barb from sliding along the wire or rotating out of the way. When livestock lean against the wire, the concentrated contact area of the sharp point produces immense localized pressure ($>50\\text{ MPa}$), immediately teaching the animal to respect the fence line.",
    mechanicalBreakdown: [
      {
        title: "Two-Pointed Coiled Spur Barb",
        summary: "Short high-carbon wire bent into a two-turn coil with sharp diagonal tips.",
        technicalDetails:
          "Formed from 12.5-gauge ($2.5\\text{ mm}$) galvanized steel wire sheared at $45^\\circ$ angles to create sharp cutting points. The central coil inner diameter matches the main wire strand diameter ($2.7\\text{ mm}$) with zero clearance.",
        archaicTerm: "Spur-wires coiled around one of the wires",
        modernEquivalent: "2-point / 4-point wire barb",
      },
      {
        title: "Intertwined Double-Strand Helical Core",
        summary: "Two high-tensile wire strands twisted into an elastic structural cable.",
        technicalDetails:
          "Two strands of annealed carbon steel wire ($E = 200\\text{ GPa}$, yield strength $\\sigma_y > 420\\text{ MPa}$) twisted into a continuous double-helix with a pitch of $p = 75\\text{ to }100\\text{ mm}$. The helical geometry provides longitudinal elastic compliance, absorbing animal impacts and seasonal thermal expansion without snapping.",
        archaicTerm: "Two strands twisted together throughout their length",
        modernEquivalent: "Continuous double-strand twisted core wire",
      },
      {
        title: "Friction-Locked Mechanical Barb Interlock",
        summary: "Clamping geometry preventing translational and rotational displacement.",
        technicalDetails:
          "The intertwining of the second strand creates a localized normal clamping force $F_N$ against each barb coil. With steel-on-steel friction coefficient $\\mu \\approx 0.35$, the required longitudinal displacement force exceeds $F_{\\text{slip}} = 2 \\mu F_N > 450\\text{ N}$, preventing barbs from bunching together.",
        archaicTerm: "Firmly locking and holding the spur-wire",
        modernEquivalent: "Helical interference-fit barb lock",
      },
      {
        title: "Diagonal Chisel-Shear Wire Spur Tips",
        summary: "High-angle transverse shear cutting creating razor lancet tips.",
        technicalDetails:
          "The wire ends are sheared at compound acute bevel angles of $35^\\circ\\text{ to }45^\\circ$ during automated coiling. The resultant chisel edge exhibits a tip radius of curvature $r_{\\text{tip}} < 80\\;\\mu\\text{m}$, creating concentrated mechanical stress concentrations that pierce cattle hide ($E_{\\text{skin}} \\approx 20\\text{ MPa}$) with minimal normal force.",
        archaicTerm: "Sharp projecting spur-points",
        modernEquivalent: "Chisel-cut lancet points / Razor barb tips",
      },
      {
        title: "Zinc Galvanic Passivation & Atmospheric Barrier",
        summary:
          "Hot-dip zinc coating offering sacrificial cathodic protection across prairie weather.",
        technicalDetails:
          "A hot-dip metallurgically bonded zinc layer ($50\\text{ to }70\\;\\mu\\text{m}$ thickness, density $350\\text{ g/m}^2$) encases the drawn carbon steel core. In the presence of atmospheric electrolyte moisture, zinc acts as a sacrificial anode ($E^\\circ = -0.76\\text{ V}$ vs $\\text{SHE}$), galvanically shielding exposed steel cuts from iron oxide rust.",
        archaicTerm: "Galvanized or zinc-coated fencing wire",
        modernEquivalent: "Class 3 hot-dip galvanized sacrificial coating",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Catenary Structural Wire Sag & Tension Equilibrium",
        formula:
          "y(x) = a \\left[\\cosh\\left(\\frac{x}{a}\\right) - 1\\right] \\approx \\frac{w x^2}{2 T_0}, \\quad T_0 = \\frac{w L^2}{8 d}",
        explanation:
          "The double-strand twisted wire forms a catenary curve between fence posts spaced $L = 5\\text{ meters}$ apart; the twisted helical geometry provides high tensile strength ($T_{\\text{breaking}} > 4.5\\text{ kN}$) with low linear weight ($w \\approx 0.09\\text{ kg/m}$).",
      },
      {
        principle: "Contact Stress Concentration & Livestock Deterrence",
        formula:
          "\\sigma_{\\text{contact}} = \\frac{F_{\\text{animal}}}{A_{\\text{tip}}} = \\frac{100\\text{ N}}{\\pi (0.25\\text{ mm})^2} \\approx 510\\text{ MPa}",
        explanation:
          "Because the sharp barb tip has a microscopic contact area ($A_{\\text{tip}} < 0.2\\text{ mm}^2$), even a gentle push by a cow generates localized contact stress exceeding animal hide pain thresholds, deterring cattle without causing mortal injury.",
      },
      {
        principle: "Helical Spring Thermal Strain Compensation",
        formula:
          "\\Delta L_{\\text{thermal}} = \\alpha \\cdot L \\cdot \\Delta T, \\quad k_{\\text{helix}} = \\frac{G d^4}{64 R^3 n}",
        explanation:
          "In extreme winter temperatures ($\\Delta T = -50^\\circ\\text{C}$), thermal contraction strain ($\\epsilon = 6 \\times 10^{-4}$) is absorbed by slight elastic untwisting of the double helix rather than generating destructive tensile stress that would snap straight single wire.",
      },
      {
        principle: "Helical Interference Clamping & Normal Force",
        formula:
          "F_{\\text{clamp}} = \\frac{2 T_{\\text{twist}} \\sin\\phi}{R_{\\text{strand}}}, \\quad F_{\\text{slip}} = 2 \\mu F_{\\text{clamp}} > 450\\text{ N}",
        explanation:
          "The mechanical twist helix converts axial wire tension and torsion into radial compressive clamping forces that permanently pinch the coiled barb loops against the primary strand without requiring solder or welds.",
      },
    ],
    whyItMattersToday:
      "Glidden's barbed wire is called 'the wire that won the West.' It made private land ownership, livestock breeding, and commercial crop farming possible across millions of square miles of the American Great Plains, Argentina, and Australia. It permanently closed the open range, defined modern property boundaries, and transformed agricultural economics.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "In combination with a fence-wire, a barb formed by coiling a short piece of wire around it with projecting points, and a second wire twisted with the first to lock the barb in place, substantially as described.",
      plainEnglish:
        "Master pioneer claim: the combination of a wire strand, coiled wire spur barbs with sharp points, and a second wire strand twisted with the first to mechanically clamp and lock the barbs in place.",
      keyInnovations: [
        "Coiled wire spur barb on single strand",
        "Second wire twisted to clamp and lock the barb",
        "Mechanical interlock preventing barb rotation and sliding",
      ],
      legalSignificance:
        "The supreme patent of the 'Barbed Wire Wars,' upheld by the US Supreme Court in 1892 as the foundational patent for all modern barbed fencing.",
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "The twisted double-strand wire fence having spur-wires coiled upon one strand and held from longitudinal and rotary displacement by the intertwining of the two strands.",
      plainEnglish:
        "Specifies the continuous double-strand twisted wire fence where coiled barbs on one strand are held from sliding along the wire or rotating by the intertwining of the two strands.",
      keyInnovations: [
        "Anti-slip / anti-rotation double-helix geometry",
        "Longitudinal position retention under tension",
      ],
      legalSignificance:
        "Protected the structural double-helix cable design that made mass-production manufacturing fast and reliable.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Plan and Detail View of Glidden Twisted Barbed Wire",
      caption:
        "Drawing showing two-strand twisted wire cable, coiled two-point spur barb, and interlocking helical pinch points.",
      svgType: "glidden-barbed-wire",
      callouts: [
        {
          id: "gb-1",
          figureRef: "Fig. 1",
          label: "A",
          element: "Coiled Two-Point Spur Barb",
          description: "Galvanized wire coiled two turns with sharp diagonal points.",
          x: 50,
          y: 45,
        },
        {
          id: "gb-2",
          figureRef: "Fig. 1",
          label: "B",
          element: "Primary Carrying Strand",
          description: "Longitudinal steel wire passing through center of barb coil.",
          x: 30,
          y: 45,
        },
        {
          id: "gb-3",
          figureRef: "Fig. 1",
          label: "C",
          element: "Second Intertwined Locking Strand",
          description: "Second wire twisted helically around first strand to clamp barb.",
          x: 70,
          y: 45,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "In the 1870s, homesteaders settling the prairie states under the Homestead Act of 1862 found themselves in a crisis: wooden rail fences cost more than the value of the land itself because lumber had to be shipped hundreds of miles by rail, while smooth wire failed to stop roaming cattle herds.",
    priorArtLimitations: [
      "Smooth wire lacked deterrence; cattle leaned against it until it sagged and walked over it.",
      "Michael Kelly's 1868 'thorny wire' used flat punched diamond sheet-metal barbs that were fragile, rusted quickly, and slipped along the wire.",
      "Wooden board fences cost upwards of $1,000 per mile and rotted in prairie moisture.",
    ],
    breakthroughInsight:
      "In 1873, 60-year-old farmer Joseph Glidden attended the DeKalb County Agricultural Fair, where Henry Rose exhibited a wooden rail fitted with sharp projecting iron points. Glidden realized that instead of attaching heavy wood strips, a short wire could be bent into a coil around a fence strand and locked tightly by twisting a second wire around it using a modified coffee mill!",
    patentWars: [
      {
        rivalName: "The Barbed Wire Wars and Washburn & Moen",
        rivalClaim:
          "Over two dozen competing inventors (Jacob Haish, Isaac Ellwood, Charles Kelly) claimed prior art in extensive federal patent litigation.",
        conflictDetails:
          "Glidden partnered with hardware merchant Isaac Ellwood and Massachusetts wire manufacturer Washburn & Moen. Rival inventor Jacob Haish sued, claiming his 'S-barb' had priority, sparking 18 years of intense nationwide litigation involving over 50 federal lawsuits.",
        resolution:
          "In the landmark 1892 US Supreme Court decision The Barbed Wire Patent (Washburn & Moen Mfg. Co. v. Beat 'Em All Barbed-Wire Co., 143 U.S. 275), Justice Henry Billings Brown declared that while others had experimented with thorns on wire, Glidden alone turned failure into triumphant success, upholding Patent 157,124 as valid and pioneer.",
        legalOutcome:
          "The Supreme Court established the definitive legal doctrine that transforming an inoperative laboratory idea into a universally successful commercial product constitutes patentable invention.",
      },
    ],
    civilizationalImpact:
      "Barbed wire production exploded from 10,000 pounds in 1874 to over 80 million pounds by 1880. It brought the era of the open range and cowboy cattle drives to an end, established commercial ranching, protected family homestead farms, and enabled transcontinental railroads to fence their rights-of-way.",
    funFact:
      "To manufacture his first batches of barbed wire in 1873, Glidden used an old hand-cranked coffee grinder to bend the sharp wire spur coils around the main strand, while his farmhand climbed up an apple tree and turned a converted grindstone crank to twist the two strands together across the lawn!",
    aftermath:
      "Glidden sold half his patent interest to Washburn & Moen for $60,000 plus a royalty of 25 cents per 100 pounds of wire manufactured, becoming one of the wealthiest men in Illinois. He founded the Glidden State Bank, donated land for Northern Illinois University in DeKalb, and lived to age 93.",
  },
  tags: [
    "Joseph Glidden",
    "Barbed Wire",
    "Agriculture",
    "Open Range",
    "Structural Metallurgy",
    "Supreme Court Landmark",
  ],
  stats: {
    totalClaims: 2,
    independentClaims: 1,
    patentWarYears: "1874–1892",
    impactScore: 100,
  },
};
