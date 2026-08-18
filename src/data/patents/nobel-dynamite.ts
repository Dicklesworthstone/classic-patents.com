import type { Patent } from "@/types/patent";

export const nobelDynamitePatent: Patent = {
  id: "us-78317-nobel-dynamite",
  patentNumber: "US 78,317",
  title: "Improved Explosive Compound",
  shortTitle: "Nobel Dynamite & Detonator Explosive",
  subtitle: "Porous Kieselguhr Nitroglycerin Adsorption and Mercury Fulminate Shock Detonation",
  inventors: ["Alfred Nobel"],
  inventorLocation: "Stockholm, Sweden & Paris, France",
  grantDate: "1868-05-26",
  filingDate: "1867-09-16",
  era: "Civil War & Industrial Acceleration (1860–1880)",
  category: "materials",
  categoryLabel: "Chemical Physics & Energetic Materials",
  summary:
    "The 1868 energetic materials breakthrough that engineered modern civil excavation: Alfred Nobel's method of taming liquid nitroglycerin by adsorbing it into porous diatomaceous earth (kieselguhr), producing a safe, solid explosive paste (Dynamite) that was stable against ordinary handling shock and could only be initiated by a supersonic mercury fulminate percussion blasting cap.",
  heroQuote:
    "This invention relates to the use of nitroglycerin in an altered condition, which renders it far more practical and safe for use... by mixing it with an inert porous substance such as silicious earth.",
  originalPdfUrl: "/patents/pdfs/us-78317-nobel-dynamite.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US78317/en",
  usptoClassification: "C06B 31/00 (Explosives containing nitroglycerin; Solid dynamites)",
  originalTextAsset: {
    url: "/patents/source-text/us-78317-nobel-dynamite.txt",
    pageCount: 2,
    kind: "source-pdf-text-layer",
  },
  originalText: `UNITED STATES PATENT OFFICE.
ALFRED NOBEL, OF STOCKHOLM, SWEDEN.

IMPROVED EXPLOSIVE COMPOUND.

Specification forming part of Letters Patent No. 78,317, dated May 26, 1868.

To all whom it may concern:
Be it known that I, ALFRED NOBEL, of the city of Stockholm, in the Kingdom of Sweden, have invented a new and useful composition of matter, which I term "Dynamite" or "Nobel's Safety Powder," of which the following is a specification:

The nature of my invention consists in mixing liquid nitroglycerin with a porous, non-explosive, inert substance, such as silicious earth (kieselguhr), charcoal, or other porous mineral or vegetable matter, in such proportions that the mixture retains the explosive power of nitroglycerin while losing its dangerous liquid character and extreme sensitivity to accidental shock, friction, or handling.

Liquid nitroglycerin is highly dangerous because the slightest shock or leakage during transport or storage can cause violent accidental explosion.

By my invention, the liquid nitroglycerin is completely absorbed and held within the microscopic pores of the silicious earth, forming a pasty or solid mass that resembles damp sawdust or clay. In this state, the compound can be packed in paper cartridges, handled, transported, and subjected to ordinary shocks, jars, and rough handling with complete safety. It does not explode when exposed to an open flame or spark, but burns away quietly without detonating.

To explode this compound, it is necessary to subject it to a sudden, violent local shock accompanied by intense heat, such as is produced by a copper blasting cap or percussion capsule containing a charge of fulminate of mercury, ignited by a safety fuse or electrical wire. The detonation of the fulminate cap generates a supersonic shock wave that instantly detonates the entire mass of the dynamite with extreme shattering force (brisance).

I claim as my invention:
1. The combination of nitroglycerin with an incombustible, porous, silicious earth or equivalent inert adsorbent, forming a solid or plastic explosive compound, substantially as described.
2. The method of exploding the mixture of nitroglycerin and porous earth by means of a detonating cap containing fulminate of mercury or its equivalent.`,
  plainEnglishExplanation: {
    overview:
      "Nitroglycerin was invented by Ascanio Sobrero in 1847, but was so sensitive to friction, vibration, and temperature swings that crates of liquid nitroglycerin routinely blew up aboard ships, trains, and warehouses, killing hundreds. Alfred Nobel solved this crisis by adsorbing liquid nitroglycerin into porous diatomaceous earth (fossilized algae shells called kieselguhr). The resulting dough-like compound (Dynamite) was shock-proof and flame-safe, but when struck by a mercury fulminate blasting cap, it detonated with full supersonic explosive velocity.",
    coreMechanism:
      "Liquid nitroglycerin is blended with calcined kieselguhr earth in a $75:25$ mass ratio. The microscopic porous cellular matrix of the kieselguhr adsorbs the liquid nitroglycerin through capillary action, trapping the molecules in micro-pockets and cushioning them against mechanical impact and shear friction. When a mercury fulminate ($Hg(CNO)_2$) blasting cap is ignited, its rapid decomposition creates a supersonic shock wave ($v > 6,000\\text{ m/s}$) and transient pressure spike ($P > 10\\text{ GPa}$). This shock wave compresses the trapped nitroglycerin molecules past their activation energy barrier, initiating a self-sustaining Chapman-Jouguet detonation wave that converts the entire cartridge into high-pressure expanding gases in microseconds.",
    mechanicalBreakdown: [
      {
        title: "Porous Silicious Earth (Kieselguhr) Matrix",
        summary: "Inert calcined diatomaceous earth acting as a capillary sponge.",
        technicalDetails:
          "Composed of microscopic porous silica ($SiO_2$) diatom frustules with specific surface areas $>20\\text{ m}^2/\\text{g}$. The capillaries adsorb up to 3 times their weight in liquid nitroglycerin without liquid weeping or exudation, attenuating mechanical stress waves.",
        archaicTerm: "Incombustible, porous silicious earth",
        modernEquivalent: "Diatomaceous earth / Inert energetic adsorbent matrix",
      },
      {
        title: "Liquid Nitroglycerin Chemical Charge",
        summary: "Glyceryl trinitrate ester ($C_3H_5(NO_3)_3$) energetic compound.",
        technicalDetails:
          "A heavy, oily liquid synthesized by nitrating glycerol with nitric and sulfuric acids. Possesses a positive oxygen balance ($4 C_3H_5N_3O_9 \\to 12 CO_2 + 10 H_2O + 6 N_2 + O_2$), releasing $6.3\\text{ MJ/kg}$ of heat and expanding to over 1,000 times its volume in gas at $>3,000^\\circ\\text{C}$.",
        archaicTerm: "Nitroglycerin or blasting oil",
        modernEquivalent: "Glyceryl trinitrate (GTN) / Liquid explosive",
      },
      {
        title: "Mercury Fulminate Percussion Blasting Cap",
        summary: "Copper capsule loaded with primary shock-sensitive explosive.",
        technicalDetails:
          "A small copper tube filled with $0.5\\text{ to }1.5\\text{ grams}$ of pressed mercury fulminate ($Hg(CNO)_2$). Initiated by black-powder safety fuse or electric bridge wire, the cap detonates at $D = 4,250\\text{ m/s}$, generating the supersonic shock impulse ($dP/dt$) required to trigger the secondary dynamite.",
        archaicTerm: "Detonating cap containing fulminate of mercury",
        modernEquivalent: "Blasting cap / Primary explosive shock detonator",
      },
      {
        title: "Waxed Parchment Paper Cartridge Sheath",
        summary:
          "Paraffin-dipped cylindrical paper tube preventing oil exudation and moisture absorption.",
        technicalDetails:
          "High-density kraft paper rolled into a rigid cylinder ($D = 25\\text{ to }32\\text{ mm}, L = 200\\text{ mm}$) and hot-dipped in melted paraffin wax. The hydrophobic barrier prevents environmental moisture from displacing the adsorbed nitroglycerin from the porous silica pores while withstanding bore-hole tamping pressures up to $500\\text{ kPa}$.",
        archaicTerm: "Cartridge tube of parchment or waterproof paper",
        modernEquivalent: "Dynamite cartridge casing / Waxed explosive wrapper",
      },
      {
        title: "Two-Stage Detonation Train (Primary to Secondary)",
        summary:
          "Shock impedance coupling matching acoustic impedance of copper cap to dense silica matrix.",
        technicalDetails:
          "The copper detonator shell is crimped directly onto the core of the dynamite stick. Detonation of the primary charge generates a planar supersonic shock spike ($P > 2.5\\text{ GPa}$) that matches the acoustic impedance of the compacted matrix ($Z = \\rho c \\approx 3.2\\times 10^6\\text{ kg}/(\\text{m}^2\\cdot\\text{s})$), preventing shock reflection and ensuring prompt initiation.",
        archaicTerm: "Detonation train linking cap to charge",
        modernEquivalent: "Explosive initiation train & booster interface",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Chapman-Jouguet Supersonic Detonation Theory",
        formula:
          "D = \\sqrt{2 (\\gamma^2 - 1) q_{\\text{det}}}, \\quad P_{\\text{CJ}} = \\frac{\\rho_0 D^2}{\\gamma + 1} \\approx 10\\text{ to }14\\text{ GPa}",
        explanation:
          "Unlike deflagration (subsonic burning governed by thermal conduction), detonation propagates as a supersonic shock wave front ($D \\approx 6,000\\text{ m/s}$) sustained by the instantaneous exothermic chemical reaction behind the shock front.",
      },
      {
        principle: "Capillary Adsorption & Energy Dissipation",
        formula:
          "\\Delta P_{\\text{capillary}} = \\frac{2 \\gamma_{\\text{surface}} \\cos\\theta}{r_{\\text{pore}}}, \\quad U_{\\text{damping}} = \\mu \\int (\\nabla v)^2 \\, dV",
        explanation:
          "Capillary confinement within micro-pores ($r_{\\text{pore}} < 5\\;\\mu\\text{m}$) prevents hydrodynamic jetting and hotspot formation from ordinary physical drops and rough transport jars.",
      },
      {
        principle: "Arrhenius Reaction Kinetics & Thermal Activation",
        formula:
          "k_{\\text{reaction}} = A \\exp\\left(-\\frac{E_a}{R T_{\\text{shock}}}\\right), \\quad T_{\\text{shock}} \\approx T_0 + \\frac{P_{\\text{shock}} \\Delta V}{2 C_v}",
        explanation:
          "The extreme compression heating ($T_{\\text{shock}} > 1,200\\text{ K}$) generated by the blasting cap's shock wave exceeds the $E_a \\approx 145\\text{ kJ/mol}$ activation barrier, triggering instantaneous global molecular decomposition.",
      },
      {
        principle: "Rankine-Hugoniot Conservation Jump Conditions",
        formula:
          "\\rho_1 (D - u_1) = \\rho_0 D, \\quad P_1 - P_0 = \\rho_0 D u_1, \\quad e_1 - e_0 = \\frac{1}{2}(P_1 + P_0)\\left(\\frac{1}{\\rho_0} - \\frac{1}{\\rho_1}\\right) + q_{\\text{det}}",
        explanation:
          "The conservation laws of mass, momentum, and energy across the discontinuous shock front dictate the state variables of the high-pressure gaseous products expanding into rock strata.",
      },
    ],
    whyItMattersToday:
      "Dynamite enabled the monumental civil engineering triumphs of the late 19th and 20th centuries: blasting the Panama Canal, carving the Swiss Gotthard and Simplon Alpine railway tunnels, building transcontinental railroads, and mining the copper and iron that built modern civilization. Nobel's fortune from this patent established the Nobel Prizes.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "The combination of nitroglycerin with an incombustible, porous, silicious earth or equivalent inert adsorbent, forming a solid or plastic explosive compound, substantially as described.",
      plainEnglish:
        "The master pioneer claim: combining liquid nitroglycerin with porous kieselguhr or inert absorbent to form a safe, solid, or plastic explosive (Dynamite).",
      keyInnovations: [
        "Adsorption of liquid nitroglycerin into porous solid matrix",
        "Conversion of sensitive liquid into shock-safe solid paste",
        "Porous diatomaceous earth carrier",
      ],
      legalSignificance:
        "The landmark composition of matter patent for Dynamite, widely licensed and defended across Europe and North America.",
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "The method of exploding the mixture of nitroglycerin and porous earth by means of a detonating cap containing fulminate of mercury or its equivalent.",
      plainEnglish:
        "Specifies the method of detonating the safe solid dynamite paste using a dedicated mercury fulminate percussion blasting cap to supply the initiating supersonic shock wave.",
      keyInnovations: [
        "Two-stage explosive initiation system",
        "Primary shock detonator for secondary insensitive explosive",
      ],
      legalSignificance:
        "Protected the universal two-component blasting system (cap plus dynamite) used in all modern commercial and military explosives.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Cross-Section of Nobel Dynamite Cartridge with Blasting Cap",
      caption:
        "Sectional drawing showing cylindrical waxed paper wrapper, porous kieselguhr-nitroglycerin paste matrix, copper blasting cap, and safety fuse.",
      svgType: "nobel-dynamite",
      callouts: [
        {
          id: "nd-1",
          figureRef: "Fig. 1",
          label: "A",
          element: "Solid Dynamite Compound",
          description: "75% nitroglycerin adsorbed into 25% porous kieselguhr earth.",
          x: 50,
          y: 55,
        },
        {
          id: "nd-2",
          figureRef: "Fig. 1",
          label: "B",
          element: "Mercury Fulminate Blasting Cap",
          description: "Copper detonator tube providing supersonic initiating shock wave.",
          x: 50,
          y: 25,
        },
        {
          id: "nd-3",
          figureRef: "Fig. 1",
          label: "C",
          element: "Safety Fuse Wire",
          description: "Slow-burning black powder fuse conveying spark to detonator.",
          x: 50,
          y: 10,
        },
        {
          id: "nd-4",
          figureRef: "Fig. 1",
          label: "D",
          element: "Waxed Paper Cartridge",
          description: "Waterproof paraffin paper shell containing the explosive charge.",
          x: 20,
          y: 50,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "In the 1860s, liquid nitroglycerin was known as 'blasting oil.' It was violently unpredictable: drops, friction, or container leaks caused devastating explosions in San Francisco, New York, Panama, and Stockholm. In 1864, an accidental explosion at Nobel's Stockholm laboratory killed his younger brother Emil Nobel and four workers, leading Sweden to ban nitroglycerin factories within city limits.",
    priorArtLimitations: [
      "Black powder (gunpowder) had low brisance and was too weak to shatter hard granite rock in railway tunnels.",
      "Liquid nitroglycerin was exceptionally sensitive to thermal and mechanical shock, leaking through wooden barrels.",
      "No method existed to desensitize liquid high explosives without destroying their explosive power.",
    ],
    breakthroughInsight:
      "While experimenting on a barge anchored on Lake Mälaren, Nobel observed that liquid nitroglycerin leaking into kieselguhr packing material formed a thick paste that did not detonate when dropped, crushed, or struck with a hammer, but detonated with full power when shocked by a mercury fulminate cap.",
    patentWars: [
      {
        rivalName: "Giant Powder Company and US Patent Infringers",
        rivalClaim:
          "American competitors manufactured 'Giant Powder' and substitute mixtures using sawdust or wood pulp, claiming Nobel's patent applied only to silicious kieselguhr earth.",
        conflictDetails:
          "Nobel incorporated the Giant Powder Company in California in 1868. When copycats manufactured sawdust-nitroglycerin dynamites, Nobel's attorneys took infringers to federal court, demonstrating that the patent covered all equivalent porous adsorbent carriers.",
        resolution:
          "Federal courts ruled in Nobel's favor, upholding the patent across all absorbent matrices and cementing Nobel's worldwide commercial dominance.",
        legalOutcome:
          "Established broad pioneer patent protection for composite desensitized chemical explosives.",
      },
    ],
    civilizationalImpact:
      "Nobel's invention of dynamite transformed civil engineering and mining. It made possible the excavation of the Panama Canal, the St. Gotthard Railway Tunnel through the Alps, the Hoosac Tunnel in Massachusetts, and the transcontinental railway networks across North America, while establishing the wealth that funded the Nobel Prizes.",
    funFact:
      "Alfred Nobel chose the word 'dynamite' from the ancient Greek word 'dynamis' (δύναμις), meaning 'power'. Nobel later established the Nobel Peace Prize and international scientific prizes in his 1895 will, dedicating his enormous fortune to honor those who confer the greatest benefit on humankind.",
    aftermath:
      "Nobel went on to invent blasting gelatin (gelignite) in 1875 and ballistite in 1887, accumulating 355 patents worldwide. By his death in Sanremo, Italy in 1896, he controlled over 90 armament and explosive factories in 20 countries.",
    sideNotes: [
      "Kieselguhr (diatomaceous earth) is composed of microscopic fossilized silica skeletons of diatoms, capable of absorbing up to three times its own weight in liquid nitroglycerin.",
      "The invention of the mercury fulminate blasting cap (Patent 78,317 Claim 2) marked the birth of modern two-stage explosive initiation.",
    ],
  },
  tags: [
    "Alfred Nobel",
    "Dynamite",
    "Explosives",
    "Nitroglycerin",
    "Chemistry",
    "Mining Engineering",
    "Civil Engineering",
    "19th Century",
  ],
  stats: {
    totalClaims: 2,
    independentClaims: 1,
    patentWarYears: "1868–1876",
    impactScore: 98,
  },
};
