import type { Patent } from "@/types/patent";

export const kwolekKevlarPatent: Patent = {
  id: "us-3671542-kwolek-kevlar",
  patentNumber: "US 3,671,542",
  title: "Optically Anisotropic Aromatic Polyamide Dopes",
  shortTitle: "Kwolek Kevlar & Liquid-Crystalline Aramid Fibers",
  subtitle: "Liquid-Crystalline Poly-p-Phenylene Terephthalamide Solution and Dry-Jet Wet Spinning",
  inventors: ["Stephanie L. Kwolek"],
  inventorLocation: "Wilmington, Delaware",
  grantDate: "1972-06-20",
  filingDate: "1968-06-18",
  era: "Information Age (1960–1990)",
  category: "materials",
  categoryLabel: "Polymer Chemistry & Advanced Materials",
  summary:
    "The discovery of synthetic liquid-crystalline polymers and Kevlar: DuPont chemist Stephanie Kwolek synthesized poly-p-phenylene terephthalamide (PPD-T) dopes that spontaneously form nematic liquid-crystal domains, spinning into synthetic fibers five times stronger than steel on an equal weight basis.",
  heroQuote:
    "This invention relates to optically anisotropic solutions of carbocyclic aromatic polyamides and to the preparation of high-tenacity, high-modulus fibers and films therefrom...",
  originalPdfUrl: "/patents/pdfs/us-3671542-kwolek-kevlar.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US3671542A/en",
  usptoClassification: "D01F 6/60 (Synthetic polyamide fibers)",
  originalText: `UNITED STATES PATENT OFFICE.
STEPHANIE L. KWOLEK, OF WILMINGTON, DELAWARE, ASSIGNOR TO E. I. DU PONT DE NEMOURS AND COMPANY, OF WILMINGTON, DELAWARE.

OPTICALLY ANISOTROPIC AROMATIC POLYAMIDE DOPES.

Application June 18, 1968, Serial No. 737,929. Patent No. 3,671,542. Patented June 20, 1972.

To all whom it may concern:
Be it known that I, STEPHANIE L. KWOLEK, a citizen of the United States, residing at Wilmington, in the county of New Castle and State of Delaware, have invented certain new and useful Improvements in Optically Anisotropic Aromatic Polyamide Dopes, of which the following is a specification.

This invention relates to novel optically anisotropic dope solutions of carbocyclic aromatic polyamides, and to the preparation of fibers, films, and other shaped articles therefrom having exceptional tenacity, initial modulus, and thermal stability.

Heretofore, synthetic polyamides (such as nylon) have consisted of flexible aliphatic chains that dissolve into isotropic solutions with randomly tangled molecular coils. Fibers spun from such solutions require extensive mechanical drawing to align the polymer chains, and possess moderate tensile strength and low melting temperatures.

I have discovered that wholly aromatic polyamides consisting essentially of para-oriented repeating units (specifically poly-p-phenylene terephthalamide, PPD-T) can be dissolved in concentrated sulfuric acid (98-100% H2SO4) or amide-salt solvent mixtures to form liquid-crystalline solutions exhibiting optical anisotropy.

Unlike ordinary polymer solutions which are clear, viscous, and optically isotropic, the solutions of my invention at critical polymer concentrations (for example, above 5 to 10 weight percent) spontaneously separate into an ordered nematic liquid-crystalline phase.

Under polarized light microscopy, these dopes exhibit bright birefringence, shimmering opalescence, and a characteristic cloudy, buttermilk-like appearance, yet possess an unexpectedly low spinning viscosity.

When these optically anisotropic dopes are extruded through spinneret orifices by dry-jet wet spinning into an aqueous coagulating bath, the liquid-crystalline domains undergo instantaneous, spontaneous, nearly perfect axial alignment along the fiber axis without requiring secondary mechanical drawing.

The resulting fibers exhibit unprecedented physical properties: a tenacity exceeding 20 grams per denier (over 3,000 MPa tensile strength, more than five times stronger than steel on an equal weight basis), an initial modulus exceeding 400 grams per denier, and complete dimensional stability without melting up to temperatures exceeding 500 degrees Celsius.

Referring to the drawings:
Figure 1 is a phase diagram showing the isotropic-to-anisotropic transition as a function of polymer concentration and temperature.
Figure 2 is a diagram of the dry-jet wet spinning apparatus and coagulation bath.
Figure 3 is a diagrammatic view of the liquid-crystalline nematic domain alignment through the spinneret orifice.
Figure 4 is a diagram of the repeating aromatic polymer chain unit and inter-chain hydrogen bonding network.`,
  plainEnglishExplanation: {
    overview:
      "In 1965, facing a looming petroleum shortage, DuPont sought a lightweight fiber to replace heavy steel cord in automobile tires to save fuel. Standard polymers like nylon dissolved into clear, viscous syrups with randomly tangled, spaghetti-like chains that yielded flexible but weak fibers. Chemist Stephanie Kwolek synthesized poly-p-phenylene terephthalamide (PPD-T). Her solution looked cloudy, milky, and thin as water—so strange that colleagues wanted to throw it out, fearing it would clog the spinning machines. Kwolek persisted, discovering the world's first liquid-crystalline polymer: the rigid rod-like molecules naturally lined up like uncooked spaghetti in a box, spinning into Kevlar—a fiber five times stronger than steel that stops speeding bullets.",
    coreMechanism:
      "Kevlar's backbone consists of rigid aromatic benzene rings joined by planar amide ($-\\text{CONH}-$) linkages with para-symmetry (straight line). In concentrated sulfuric acid, these rigid rods spontaneously form nematic liquid crystal arrays. When forced through microscopic spinneret holes, shear forces align all the rods parallel to the fiber axis. In the water bath, hydrogen bonds ($N-H \\cdots O=C$) lock adjacent chains into a crystal lattice that distributes mechanical shock waves across millions of covalent carbon-carbon bonds.",
    mechanicalBreakdown: [
      {
        title: "Liquid-Crystalline Nematic Polyamide Dope",
        summary: "PPD-T polymer dissolved in 100% concentrated sulfuric acid ($H_2SO_4$).",
        technicalDetails:
          "Above critical concentration ($C > C^* \\approx 8\\text{ wt}\\%$), the solution transitions from isotropic to nematic liquid crystal ($N$), dropping elongational viscosity by 80% and exhibiting optical birefringence.",
        archaicTerm: "Optically anisotropic aromatic polyamide dope",
        modernEquivalent: "Lyotropic liquid-crystalline polymer solution",
      },
      {
        title: "Dry-Jet Wet Spinning Spinneret",
        summary: "Extruding the liquid crystal solution through an air gap into a cold water bath.",
        technicalDetails:
          "The air gap allows elongational shear stress to fully extend and orient the nematic domains ($S_{order} > 0.95$) before water extracts the sulfuric acid solvent, freezing the aligned crystal structure in place.",
        archaicTerm: "Extrusion through spinneret into coagulating bath",
        modernEquivalent: "Dry-jet wet fiber spinning line",
      },
      {
        title: "Extended-Chain Hydrogen-Bonded Crystalline Grid",
        summary: "A dense 2D sheet of inter-chain hydrogen bonds between amide groups.",
        technicalDetails:
          "Provides high longitudinal tensile modulus ($E = 70\\text{ to }130\\text{ GPa}$) and high acoustic velocity ($v = \\sqrt{E/\\rho} \\approx 10,000\\text{ m/s}$), rapidly dissipating localized kinetic bullet impact energy across the fabric weave.",
        archaicTerm: "High-tenacity, high-modulus shaped article",
        modernEquivalent: "Aramid crystal lattice (Kevlar 29 / Kevlar 49)",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Flory Lyotropic Liquid Crystal Phase Transition",
        formula:
          "v_p^* \\approx \\frac{8}{x} \\left(1 - \\frac{2}{x}\\right), \\quad x = \\frac{L}{d} \\gg 10",
        explanation:
          "Flory's lattice theory predicts that rigid-rod polymers with high aspect ratio x spontaneously order into a nematic phase above critical volume fraction v_p*.",
      },
      {
        principle: "Tensile Strength & Molecular Chain Alignment",
        formula:
          "\\sigma_t = \\sigma_0 \\cdot \\langle \\cos^2(\\theta) \\rangle \\approx 3.6\\text{ GPa}, \\quad \\rho = 1.44\\text{ g/cm}^3",
        explanation:
          "Near-perfect axial orientation (θ ≈ 0) directs tensile loads purely along primary covalent C-C and C-N chemical bonds rather than weak van der Waals forces.",
      },
    ],
    whyItMattersToday:
      "Kevlar revolutionized personal armor, saving thousands of police officers and military personnel from fatal bullet and shrapnel wounds, while reinforcing aerospace composites, fiber optic cables, space suits, and high-performance racing tires.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "An optically anisotropic spinning dope comprising from 5% to 25% by weight of a carbocyclic aromatic polyamide consisting essentially of repeating units of the formula -NH-Ar-NH-CO-Ar'-CO- wherein Ar and Ar' are para-oriented carbocyclic aromatic radicals, dissolved in a solvent consisting essentially of sulfuric acid having a concentration of at least 98%, said dope exhibiting optical birefringence in the quiescent state, substantially as described.",
      plainEnglish:
        "The master composition claim for the liquid-crystalline Kevlar spinning dope: para-aramid polymer dissolved in sulfuric acid forming an optically anisotropic, birefringent solution.",
      keyInnovations: [
        "Lyotropic liquid-crystalline polymer dope",
        "Para-aramid PPD-T chemistry",
        "Optically anisotropic spinning solution",
      ],
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 2",
      title: "Dry-Jet Wet Spinning Line for Kevlar Aramid Fibers",
      caption:
        "Schematic showing dope pump, heated spinneret pack, air gap elongation zone, aqueous coagulation quench tank, wash rollers, and fiber windup.",
      svgType: "kwolek-kevlar",
      callouts: [
        {
          id: "kk-1",
          figureRef: "Fig. 2",
          label: "A",
          element: "Liquid-Crystal Dope Feed",
          description: "Anisotropic PPD-T / sulfuric acid solution with nematic domain ordering.",
          x: 25,
          y: 25,
        },
        {
          id: "kk-2",
          figureRef: "Fig. 2",
          label: "B",
          element: "Spinneret & Air Gap Zone",
          description:
            "Microscopic capillary extrusion aligning molecular chains along the fiber axis.",
          x: 50,
          y: 45,
        },
        {
          id: "kk-3",
          figureRef: "Fig. 2",
          label: "C",
          element: "Aqueous Coagulation Quench Bath",
          description:
            "Water bath extracting acid solvent to freeze the aligned crystalline structure.",
          x: 75,
          y: 70,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "DuPont in 1964 wanted a fiber to replace steel cord in tires and save gasoline. Nylon melts and creeps. Steel is heavy and rusts. The vest problem (flak jackets as steel plates) was a later market, not the original brief.",
    priorArtLimitations: [
      "Flexible-chain nylons and polyesters give toughness, not 3+ GPa tenacity.",
      "Steel cord adds unsprung mass and corrosion.",
      "A cloudy, watery dope was, in every spinner's experience, a failed batch.",
    ],
    breakthroughInsight:
      "Kwolek's poly-p-phenylene terephthalamide in concentrated sulfuric acid was opalescent and thin. Colleagues wanted it thrown out before it clogged a spinneret. She insisted it be spun. The cloudiness was a nematic liquid crystal: rigid rods already aligned, so the fiber came out oriented.",
    patentWars: [
      {
        rivalName: "Akzo (Twaron)",
        rivalClaim:
          "Akzo's aramid (later Twaron) was close enough that both companies sued over process and composition through the 1980s.",
        conflictDetails:
          "The 1988 settlement cross-licensed and split territories. DuPont kept the Kevlar trademark. Kwolek's priority on the liquid-crystal spinning route stood.",
        resolution:
          "Two suppliers, one chemistry class. Kwolek received the National Medal of Technology in 1996.",
        legalOutcome:
          "DuPont's composition and process patents held in the US. Europe was messier; the settlement ended it.",
      },
    ],
    civilizationalImpact:
      "Soft armor, sailcloth, brake pads, and the occasional suspension bridge cable. The tire-cord brief succeeded; the vest market became the public face.",
    funFact:
      "Kwolek took the DuPont job to save for medical school and stayed 40 years. She did not become a physician. She became the reason a patrol officer's vest can be worn all shift.",
    aftermath:
      "She retired in 1986 and spent decades visiting classrooms. She died in 2014. DuPont still spins PPTA in Richmond, Virginia, and elsewhere.",
    sideNotes: [
      "The dope is sulfuric acid. That is why Kevlar plants look like chemical works, not textile mills.",
      "Ballistic fabric works because the sonic velocity in the fiber is high (~8–10 km/s), so the strain wave spreads sideways before the yarn breaks. Alignment is the whole game.",
    ],
  },
};
