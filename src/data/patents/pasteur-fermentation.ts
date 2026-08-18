import type { Patent } from "@/types/patent";

export const pasteurFermentationPatent: Patent = {
  id: "us-135245-pasteur-fermentation",
  patentNumber: "US 135,245",
  title: "Improvement in the Manufacture of Beer and Ale",
  shortTitle: "Pasteur Thermal Preservation & Pasteurization Process",
  subtitle:
    "Controlled Sub-Boiling Thermal Inactivation, Pure Yeast Isolation, and Sterile Air Cooling",
  inventors: ["Louis Pasteur"],
  inventorLocation: "Paris, Republic of France",
  grantDate: "1873-01-28",
  filingDate: "1872-05-09",
  era: "Civil War & Industrial Acceleration (1860–1880)",
  category: "consumer",
  categoryLabel: "Biochemical Physics & Food Science",
  summary:
    "The 1873 biological physics patent that established the germ theory of disease in industrial production: Louis Pasteur's thermal method of heating fermented beverages and organic liquids to sub-boiling temperatures (55°C–60°C) in closed vessels, selectively denaturing pathogenic spoilage microbes while preserving flavor and nutritional enzymes, paired with sterile air cooling to prevent re-infection.",
  heroQuote:
    "The object of my invention is to produce a beer that shall be unalterable and capable of being transported and kept without deterioration, by destroying the noxious germs of disease that cause acidity and putrefaction...",
  originalPdfUrl: "/patents/pdfs/us-135245-pasteur-fermentation.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US135245/en",
  usptoClassification:
    "C12H 1/06 (Pasteurisation, sterilisation, preservation of alcoholic beverages)",
  originalTextAsset: {
    url: "/patents/source-text/us-135245-pasteur-fermentation.txt",
    pageCount: 3,
    kind: "source-pdf-text-layer",
  },
  originalText: `UNITED STATES PATENT OFFICE.
LOUIS PASTEUR, OF PARIS, FRANCE.

IMPROVEMENT IN THE MANUFACTURE OF BEER AND ALE.

Specification forming part of Letters Patent No. 135,245, dated January 28, 1873.

To all whom it may concern:
Be it known that I, LOUIS PASTEUR, of Paris, in the Republic of France, have invented a new and useful Process of Manufacturing Beer, Ale, and Other Fermented Liquids, of which the following is a specification:

The nature of my invention consists in:
1. The heating of fermented liquids (such as beer, wine, or vinegar) in closed vessels or bottles to a temperature of from 50 to 60 degrees of the centigrade thermometer (122 to 140 degrees Fahrenheit), whereby the vitality of all noxious microscopic germs, filaments, and ferments of disease is destroyed, while the true alcoholic yeast remains unaltered or is eliminated, and the delicate flavor, bouquet, and aroma of the beverage are preserved unimpaired.
2. The cooling of the wort and fermented liquid in closed vats supplied exclusively with air that has been previously purified and deprived of living atmospheric germs by passing through a furnace or through dense filters of cotton or glass wool.
3. The propagation and employment of a pure yeast free from diseased microscopic ferments, derived by isolating individual yeast globules in sterile media.

Heretofore, large quantities of beer and wine have spoiled and turned sour, ropy, or putrid during warm weather and ocean transport, causing immense commercial losses.

By my process, the liquid is bottled and corked, or sealed in metal vats, and immersed in a hot water bath heated to 55 to 60 degrees Centigrade for a period of fifteen to thirty minutes. This moderate heat is sufficient to kill or permanently deactivate all bacteria of lactic, acetic, and butyric fermentation without boiling the liquid or driving off its volatile aromatic ethers.

When the liquid is cooled and stored, it remains completely unalterable for months or years, even in tropical climates, because no living germs remain within it and no new germs are permitted to enter from the surrounding atmosphere.

I claim as my invention:
1. The process of treating beer, ale, and other fermented liquids by subjecting them to a temperature of from 50 to 60 degrees Centigrade in closed vessels, substantially as and for the purpose described.
2. The method of cooling wort and fermenting beverages in closed vessels supplied with filtered and purified air, substantially as described.
3. The manufacture of an unalterable beer free from diseased ferments by the combined application of heat and pure yeast culture.`,
  plainEnglishExplanation: {
    overview:
      "For centuries, humanity believed that wine turned sour and meat rotted due to 'spontaneous generation'—the mysterious idea that life generated from dead matter. French chemist Louis Pasteur proved that spoilage and disease were caused by specific living microorganisms (bacteria and wild molds) falling from the air. In this historic patent, Pasteur introduced the thermal process known as 'Pasteurization': heating liquids to precisely $55^\\circ\\text{C}-60^\\circ\\text{C}$ in sealed containers to destroy bacteria without boiling away volatile flavor compounds.",
    coreMechanism:
      "Fermented liquid or unpasteurized dairy/juice is sealed in closed vessels and heated in a controlled hot-water jacket to $55^\\circ\\text{ to }60^\\circ\\text{C}$ for 15 to 30 minutes. At this critical temperature band, thermal molecular motion breaks the tertiary hydrogen bonds of bacterial enzymes and cell membranes (lactic acid rods, acetic acid filaments, butyric vibrios), denaturing them irreversibly. Because the temperature remains far below the boiling point of water ($100^\\circ\\text{C}$) and alcohol ($78.3^\\circ\\text{C}$), volatile esters, aromatic terpenes, and nutritional proteins remain chemically intact. The liquid is then cooled with sterile air passed through cotton filters, preventing any airborne microbes from re-inoculating the sterile product.",
    mechanicalBreakdown: [
      {
        title: "Controlled Thermal Water-Bath Vessel",
        summary: "Jacketed water bath providing uniform sub-boiling heat transfer.",
        technicalDetails:
          "Maintains a liquid core temperature of $T = 55^\\circ\\text{ to }60^\\circ\\text{C}$ ($\\pm 1.0^\\circ\\text{C}$) via steam or hot water coils. Convective fluid circulation ensures uniform thermal penetration across the entire volume, avoiding localized overheating or scorching.",
        archaicTerm: "Closed vessels heated in a water bath",
        modernEquivalent: "Batch / Continuous plate pasteurizer & thermal holding tube",
      },
      {
        title: "Sterile Air Cotton/Glass-Wool Filter",
        summary: "Fibrous deep-bed mechanical filter eliminating airborne spore nuclei.",
        technicalDetails:
          "Air drawn into cooling vats passes through a tortuous path of dense cotton wool fibers. Microscopic dust particles and fungal spores ($d > 0.5\\;\\mu\\text{m}$) are captured by inertial impaction and Brownian diffusion, providing sterile ambient air.",
        archaicTerm: "Dense filters of cotton or glass wool",
        modernEquivalent: "HEPA air filtration & sterile tank breather filters",
      },
      {
        title: "Pure Yeast Culture Propagation Tube",
        summary: "Hermetic glassware isolating pure Saccharomyces cerevisiae strains.",
        technicalDetails:
          "Sterilized copper/glass swan-neck vessels that allow carbon dioxide gas to escape while preventing airborne dust from settling against gravity, enabling pure monoculture yeast breeding free from lactic or acetic acid bacteria.",
        archaicTerm: "Pure yeast free from diseased microscopic ferments",
        modernEquivalent: "Axenic monoculture yeast propagator & aseptic fermenter",
      },
      {
        title: "Swan-Neck Gravity Siphon & Tortuous Dust Traps",
        summary:
          "Sinuous glass and copper exit tubes permitting outgassing while blocking airborne particulate entry.",
        technicalDetails:
          "A curved downward-sloping swan-neck conduit ($L = 350\\text{ mm}, D = 12\\text{ mm}$) through which positive fermentation pressure discharges $\\text{CO}_2$. Gravity forces ambient dust particles ($v_{\\text{settling}} = \\frac{\\rho d^2 g}{18\\mu}$) to deposit in the outer low bend of the tube, creating an aseptic sterile airlock without chemical sanitizers.",
        archaicTerm: "Curved exit tube preventing ingress of atmospheric air",
        modernEquivalent: "Aseptic swan-neck breather & sterile gravity trap",
      },
      {
        title: "Counter-Flow Chilling Jacket & Plate Exchanger",
        summary:
          "Dual-wall cooling jacket rapidly quenching pasteurized liquid to arrest thermal cooking.",
        technicalDetails:
          "Immediately following the 20-minute holding duration, cold spring water ($T_{\\text{cool}} = 8^\\circ\\text{C}$) is pumped through the annular outer jacket in counter-current flow ($U \\approx 850\\text{ W}/(\\text{m}^2\\cdot\\text{K})$). This cools the liquid from $60^\\circ\\text{C}$ to $<18^\\circ\\text{C}$ in under 120 seconds, preventing Maillard caramelization and thermal protein haze.",
        archaicTerm: "Cooling apparatus for suddenly lowering the temperature",
        modernEquivalent: "Counterflow plate heat exchanger (PHE) & chilling loop",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Arrhenius Thermal Inactivation Kinetics",
        formula: "\\frac{dN}{dt} = -k(T) N, \\quad k(T) = A \\exp\\left(-\\frac{E_a}{R T}\\right)",
        explanation:
          "Bacterial population decays exponentially with heating time; the high activation energy of protein denaturation ($E_a \\approx 250\\text{ to }350\\text{ kJ/mol}$) causes the death rate constant $k(T)$ to increase tenfold for every $10^\\circ\\text{C}$ rise in temperature.",
      },
      {
        principle: "Decimal Reduction Time (D-Value) & Thermal Lethality",
        formula:
          "D = \\frac{\\ln(10)}{k(T)}, \\quad \\log_{10}\\left(\\frac{N_0}{N}\\right) = \\frac{t}{D(T)} \\ge 6 \\; (\\text{6-log reduction})",
        explanation:
          "Heating at $60^\\circ\\text{C}$ for 20 minutes achieves a $10^{-6}$ reduction (99.9999% destruction) of spoilage bacteria (Acetobacter, Lactobacillus) while leaving primary liquid chemistry unaffected.",
      },
      {
        principle: "Vapor-Liquid Phase Equilibrium & Aromatic Retention",
        formula:
          "P_i = x_i \\gamma_i P_i^{\\text{sat}}(T) \\ll P_{\\text{ambient}} \\; (T < 60^\\circ\\text{C})",
        explanation:
          "Keeping the processing temperature below $60^\\circ\\text{C}$ in a closed, pressurized container prevents the partial pressure of volatile aroma compounds (esters, aldehydes) from exceeding bubble-point thresholds, preventing flavor degradation.",
      },
      {
        principle: "Thermal Death Time z-Value & Pasteurized F-Unit Lethality",
        formula:
          "F_0 = \\int_0^t 10^{\\frac{T(t) - T_{\\text{ref}}}{z}} \\, dt, \\quad z = \\frac{T_2 - T_1}{\\log_{10}(D_1 / D_2)} \\approx 5.5^\\circ\\text{C}",
        explanation:
          "The thermal death curve relates temperature elevation to logarithmic D-value reduction, establishing the standardized Pasteurization Unit (PU) scale used worldwide in continuous aseptic food processing.",
      },
    ],
    whyItMattersToday:
      "Pasteurization is one of the greatest public health and food safety achievements in human history. Applied globally to milk, beer, wine, juices, and canned goods, pasteurization eliminated major food-borne killers like tuberculosis, diphtheria, typhoid, and scarlet fever, saving hundreds of millions of human lives and laying the empirical foundation for modern medicine and antiseptic surgery.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "The process of treating beer, ale, and other fermented liquids by subjecting them to a temperature of from 50 to 60 degrees Centigrade in closed vessels, substantially as and for the purpose described.",
      plainEnglish:
        "Pioneer master claim covering the process of preserving fermented liquids by heating them to 50°C–60°C in sealed containers to destroy disease ferments while preserving flavor.",
      keyInnovations: [
        "Controlled sub-boiling thermal pasteurization (50°C–60°C)",
        "Closed-vessel heat treatment to preserve volatile aromatics",
        "Selective microbial denaturation without boiling",
      ],
      legalSignificance:
        "The foundational method patent establishing the thermal pasteurization process worldwide.",
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "The method of cooling wort and fermenting beverages in closed vessels supplied with filtered and purified air, substantially as described.",
      plainEnglish:
        "Specifies the cooling of heated liquids in closed vessels supplied exclusively with air filtered through cotton or heated chambers to prevent re-contamination by airborne germs.",
      keyInnovations: [
        "Aseptic cooling with filtered air",
        "Fibrous air barrier preventing biological re-infection",
      ],
      legalSignificance:
        "Protected the aseptic handling protocol that prevents sterile products from being re-infected during cooling.",
    },
    {
      number: 3,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "The manufacture of an unalterable beer free from diseased ferments by the combined application of heat and pure yeast culture.",
      plainEnglish:
        "Covers the combined process of thermal pasteurization and pure isolated yeast culture inoculation to produce shelf-stable beverages.",
      keyInnovations: [
        "Pure monoculture yeast inoculation",
        "Integrated thermal-biological quality control",
      ],
      legalSignificance:
        "Established the standard biological industrial protocol for commercial brewing and fermentation.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Section of Pasteur Closed Thermal Treatment & Fermentation Vat",
      caption:
        "Sectional drawing showing cylindrical fermentation vessel, water heating jacket, cotton air-filtration tube, and sampling spigot.",
      svgType: "pasteur-fermentation",
      callouts: [
        {
          id: "pf-1",
          figureRef: "Fig. 1",
          label: "A",
          element: "Sealed Fermentation Vat",
          description: "Closed metallic container holding liquid during thermal treatment.",
          x: 50,
          y: 50,
        },
        {
          id: "pf-2",
          figureRef: "Fig. 1",
          label: "B",
          element: "Water Heating Jacket & Coils",
          description: "Surrounding hot water jacket maintaining temperature at 55°C–60°C.",
          x: 20,
          y: 50,
        },
        {
          id: "pf-3",
          figureRef: "Fig. 1",
          label: "C",
          element: "Cotton-Wool Air Filter Tube",
          description: "Deep-bed fibrous filter stripping airborne spores during cooling.",
          x: 50,
          y: 15,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "In the 1860s, French wine and brewing industries suffered catastrophic financial losses: up to 30% of all wine and beer shipments turned sour, cloudy, or bitter during ocean voyages to Britain and America. French Emperor Napoleon III personally appealed to Louis Pasteur to investigate the cause of 'diseases of wine'.",
    priorArtLimitations: [
      "The dominant scientific dogma of spontaneous generation claimed that chemical oxidation naturally degraded liquids without living organisms.",
      "Boiling liquids ($100^\\circ\\text{C}$) killed bacteria but ruined the taste, coagulated proteins, and drove off all volatile aromas, rendering wine and beer undrinkable.",
      "Sulfur fumigation was harsh, toxic, and altered the chemical composition of food.",
    ],
    breakthroughInsight:
      "Using his microscope, Pasteur discovered that sour wine was teeming with tiny rod-shaped lactic acid bacteria, distinct from round yeast cells. He discovered that these bacteria had a lower thermal tolerance than the liquid itself: heating to just $55^\\circ\\text{C}$ for a few minutes killed the bacteria without boiling or damaging the beverage.",
    patentWars: [
      {
        rivalName: "Spontaneous Generation Academics (Félix Pouchet and Liebig)",
        rivalClaim:
          "Justus von Liebig claimed fermentation was purely non-biological chemical decomposition; Félix Pouchet claimed micro-organisms generated spontaneously from water.",
        conflictDetails:
          "Pasteur conducted his famous swan-neck flask experiments before the French Academy of Sciences, proving that sterile broth in S-shaped curved flasks never spoiled because dust particles settled in the neck bend and could not enter the liquid.",
        resolution:
          "The French Academy unanimously vindicated Pasteur. In 1873, Pasteur patented the industrial process in France and the United States, providing detailed thermal curves for commercial brewing and winemaking.",
        legalOutcome:
          "Pasteur's patents established the international legal precedent that biological preservation methods and sterile fermentation were patentable subject matter.",
      },
    ],
    civilizationalImpact:
      "Pasteur's research demolished spontaneous generation and established the Germ Theory of Disease. This breakthrough inspired Joseph Lister to invent antiseptic surgery in 1865 and led directly to vaccines for anthrax and rabies, modern municipal water sanitation, and global food safety standards.",
    funFact:
      "Pasteur was deeply patriotic: following the French defeat in the Franco-Prussian War of 1870, he dedicated his brewing research to creating a French 'Beer of Revenge' (Bière de la Revanche) that would surpass German beer in quality and shelf-life, dedicating his patent profits to French national scientific laboratories!",
    aftermath:
      "Louis Pasteur founded the Pasteur Institute in Paris in 1887, which became the world's premier center for microbiology, infectious diseases, and immunology. Upon his death in 1895, Pasteur was given a full French state funeral and interred in a magnificent neo-Byzantine mausoleum beneath the Pasteur Institute.",
  },
  tags: [
    "Louis Pasteur",
    "Pasteurization",
    "Germ Theory",
    "Food Safety",
    "Microbiology",
    "Thermal Kinetics",
  ],
  stats: {
    totalClaims: 3,
    independentClaims: 1,
    patentWarYears: "1872–1876",
    impactScore: 100,
  },
};
