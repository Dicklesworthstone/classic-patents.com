import { kwolekKevlarClaims } from "@/data/editions/kwolekKevlarEdition";
import type { Patent } from "@/types/patent";

// Preserved research draft. This object contains broad modern interpretation and a
// short, non-literal reconstruction that predate the source-authoring audit. It is
// deliberately not exported or registered: the pinned 58-page facsimile has only
// ten manually checked pages in the current ledger, so this cannot stand in for a
// source edition or a source-bounded engineering treatment.
const _legacyKwolekKevlarPatentDraft: Patent = {
  id: "us-3671542-kwolek-kevlar",
  patentNumber: "US 3,671,542",
  title: "Optically Anisotropic Aromatic Polyamide Dopes",
  shortTitle: "Kwolek Kevlar & Liquid-Crystalline Aramid Fibers",
  subtitle:
    "Liquid-Crystalline Poly-p-Phenylene Terephthalamide (PPD-T) Solution and Dry-Jet Wet Spinning for Ultra-High-Tenacity Fibers",
  inventors: ["Stephanie L. Kwolek"],
  inventorLocation: "Wilmington, Delaware",
  grantDate: "1972-06-20",
  filingDate: "1969-05-23",
  era: "Information Age (1960–1990)",
  category: "materials",
  categoryLabel: "Polymer Chemistry & Advanced Materials",
  summary:
    "The discovery of synthetic liquid-crystalline polymers and Kevlar: DuPont chemist Stephanie Kwolek synthesized poly-p-phenylene terephthalamide (PPD-T) dopes that spontaneously form nematic liquid-crystal domains in concentrated sulfuric acid. When spun through dry-jet wet spinnerets, the molecules self-align into extended crystalline sheets with tensile strength exceeding 3.6 GPa—five times stronger than steel on an equal weight basis.",
  heroQuote:
    "This invention relates to optically anisotropic solutions of carbocyclic aromatic polyamides and to the preparation of high-tenacity, high-modulus fibers and films therefrom... when extruded through spinnerets, the liquid-crystalline domains undergo spontaneous, nearly perfect axial alignment without requiring secondary mechanical drawing.",
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

I claim as my invention:

1. An optically anisotropic solution capable of forming high tenacity fibers, comprising at least 5% by weight of a wholly aromatic polyamide in concentrated sulfuric acid of at least 98% concentration, said polyamide consisting essentially of repeating units wherein the chain-extending bonds are directed coaxially or parallelly in opposite directions.

2. A solution as set forth in claim 1, wherein said polyamide is poly(p-phenylene terephthalamide).

3. The method of producing high-tenacity, high-modulus fibers comprising the steps of extruding the optically anisotropic solution of claim 1 through a spinneret, across a gas space, and into an aqueous coagulating bath to form solid filamentary structures wherein the polymer molecules are aligned parallel to the filament axis.`,
  plainEnglishExplanation: {
    overview:
      "In 1964, DuPont tasked chemist Stephanie Kwolek with finding a lightweight synthetic fiber to replace heavy steel belts in radial automobile tires. Ordinary polymers like nylon form tangled, spaghetti-like molecular chains that produce flexible, moderately strong fibers. When Kwolek synthesized poly-p-phenylene terephthalamide (PPD-T) and dissolved it in concentrated sulfuric acid, she noticed the solution was cloudy, opalescent, and thin as water. While colleagues initially feared it would clog delicate spinning machinery, Kwolek recognized that the solution had formed a nematic liquid crystal: the rigid rod-like molecules had spontaneously lined up parallel to one another. When extruded through spinneret holes, the molecules emerged perfectly pre-aligned into extended-chain crystal lattices, creating Kevlar—a fiber five times stronger than steel by weight.",
    coreMechanism:
      "Kevlar's backbone consists of rigid aromatic benzene rings joined by planar amide ($-\\text{CONH}-$) linkages with para-symmetry (straight 180° orientation). Dissolved in 100% concentrated sulfuric acid above 8% concentration, the rigid rods spontaneously organize into nematic liquid-crystalline domains. Extrusion through a dry-jet air gap exerts high elongational shear ($\\dot{\\varepsilon} > 10^4\\text{ s}^{-1}$), snapping all domains into perfect axial alignment ($f > 0.96$). Quenching in an ice-water bath rapidly leaches out the acid, locking the chains into 2D hydrogen-bonded crystalline sheets ($N-H \\cdots O=C$) with extreme tensile strength ($3.6\\text{ GPa}$) and ultra-high acoustic wave propagation speeds ($9,500\\text{ m/s}$).",
    mechanicalBreakdown: [
      {
        title: "Liquid-Crystalline Nematic Polyamide Dope",
        summary: "PPD-T polymer dissolved in 100% concentrated sulfuric acid ($H_2SO_4$).",
        technicalDetails:
          "Above critical concentration ($C^* \\approx 8\\text{ wt}\\%$), the solution transitions from isotropic to nematic liquid crystal, dropping elongational viscosity by 80% and exhibiting intense optical birefringence under polarized light.",
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
          "Provides high longitudinal tensile modulus ($E = 70\\text{ to }130\\text{ GPa}$) and high acoustic velocity ($c = \\sqrt{E/\\rho} \\approx 9,500\\text{ m/s}$), rapidly dissipating localized kinetic bullet impact energy across the fabric weave.",
        archaicTerm: "High-tenacity, high-modulus shaped article",
        modernEquivalent: "Aramid crystal lattice (Kevlar 29 / Kevlar 49)",
      },
      {
        title: "Para-Aromatic Repeating Backbone",
        summary: "Rigid 1,4-phenylene rings linked by trans-amide bridges.",
        technicalDetails:
          "Para-orientation locks the molecular backbone into straight, unbendable rod segments that prevent chain folding or coil tangling, providing thermal stability up to 500°C.",
        archaicTerm: "Wholly aromatic polyamide with para-oriented radicals",
        modernEquivalent: "Poly(p-phenylene terephthalamide) (PPTA / Kevlar)",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Flory Lyotropic Liquid Crystal Phase Transition",
        formula:
          "v_p^* \\approx \\frac{8}{x} \\left(1 - \\frac{2}{x}\\right), \\quad x = \\frac{L}{d} \\gg 10",
        explanation:
          "Flory's lattice theory predicts that rigid-rod polymers with high aspect ratio ($x = L/d$) spontaneously order into a nematic liquid-crystalline phase above a critical volume fraction ($v_p^*$).",
      },
      {
        principle: "Extended-Chain Tensile Strength & Herman's Orientation",
        formula:
          "\\sigma_t = \\sigma_0 \\cdot \\langle \\cos^2(\\theta) \\rangle \\approx 3.6\\text{ GPa}, \\quad f = \\frac{3\\langle \\cos^2\\theta \\rangle - 1}{2} > 0.96",
        explanation:
          "Near-perfect axial orientation ($\\theta \\approx 0$) directs tensile loads purely along primary covalent C-C and C-N chemical bonds rather than weak van der Waals forces.",
      },
      {
        principle: "Ballistic Shock Wave Propagation Velocity",
        formula:
          "c = \\sqrt{\\frac{E}{\\rho}} = \\sqrt{\\frac{130 \\times 10^9\\text{ Pa}}{1,440\\text{ kg/m}^3}} \\approx 9,500\\text{ m/s}",
        explanation:
          "Because the acoustic velocity in Kevlar ($9,500\\text{ m/s}$) is ten times faster than a handgun bullet ($350-900\\text{ m/s}$), the kinetic energy of an incoming projectile spreads outward across adjacent yarns in microseconds before local yarn tensile failure can occur.",
      },
      {
        principle: "Inter-Chain Hydrogen Bonding Cohesion",
        formula:
          "E_{coh} = \\frac{\\Delta H_{vap} - R T}{V_m}, \\quad E_{H-bond} \\approx 20-30\\text{ kJ/mol}",
        explanation:
          "Dense arrays of $N-H \\cdots O=C$ hydrogen bonds cross-link parallel PPTA chains into rigid planar sheets, giving aramid fibers phenomenal transverse shear strength and dimensional stability up to 500°C.",
      },
      {
        principle: "Dry-Jet Elongational Flow Alignment Rate",
        formula:
          "\\dot{\\varepsilon} = \\frac{v_{takeup} - v_{die}}{L_{air\\_gap}} > 10^4\\text{ s}^{-1}",
        explanation:
          "Extruding through a 1 cm air gap before water quenching creates massive extensional strain rates ($\\dot{\\varepsilon}$), uncoiling any residual misalignments and locking the polymer into macro-crystalline fibrils.",
      },
    ],
    whyItMattersToday:
      "Kevlar is universally synonymous with life-saving body armor, protecting millions of law enforcement officers and military personnel worldwide. It is also essential for fiber-optic cable tension members, aerospace composites on commercial airliners, high-performance sails, brake pads, and planetary descent parachutes for NASA Mars rovers.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: kwolekKevlarClaims[0].text,
      plainEnglish:
        "The master composition claim for the optically anisotropic spinning dope: at least 5% by weight of a carbocyclic aromatic polyamide having coaxial or parallel and oppositely directed chain-extending bonds (para-orientation) and inherent viscosity of at least 0.7, dissolved in concentrated sulfuric acid, hydrofluoric acid, sulfonic acids, or amide/urea solvents with salts, at a concentration above the viscosity-drop threshold without forming a solid phase.",
      keyInnovations: [
        "Lyotropic liquid-crystalline polymer dope",
        "Para-aramid PPD-T chemistry in selected liquid media",
        "Spontaneous nematic domain ordering and viscosity drop",
      ],
      legalSignificance:
        "The master composition-of-matter patent that established DuPont's global foundation for high-modulus aramid fiber production.",
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText: kwolekKevlarClaims[1].text,
      plainEnglish:
        "Protects the anisotropic spinning dope of claim 1 wherein the liquid solvent medium is specifically concentrated sulfuric acid of greater than about 98 percent by weight concentration, which may optionally contain free sulfur trioxide ($SO_3$).",
      keyInnovations: [
        "Concentrated sulfuric acid solvent system (>98% H2SO4)",
        "Dissolution of rigid-rod polyamides without chain degradation",
      ],
      legalSignificance:
        "Specifically protected the commercial sulfuric acid dope system used for industrial Kevlar production.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "PPD-T Solution Phase Diagram & Optical Anisotropy Curve",
      caption:
        "Phase diagram illustrating the sharp transition from isotropic liquid to nematic liquid crystal as polymer concentration exceeds critical concentration $C^*$ with dramatic drop in spinning viscosity.",
      svgType: "kwolek-kevlar",
      callouts: [
        {
          id: "kk-0",
          figureRef: "Fig. 1",
          label: "A",
          element: "Critical Nematic Threshold",
          description:
            "Transition point ($C^* \\approx 8\\%$) where dope becomes optically anisotropic and viscosity plunges.",
          x: 50,
          y: 40,
        },
      ],
    },
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
          label: "B",
          element: "Liquid-Crystal Dope Feed",
          description: "Anisotropic PPD-T / sulfuric acid solution with nematic domain ordering.",
          x: 25,
          y: 25,
        },
        {
          id: "kk-2",
          figureRef: "Fig. 2",
          label: "C",
          element: "Spinneret & Air Gap Zone",
          description:
            "Microscopic capillary extrusion aligning molecular chains along the fiber axis.",
          x: 50,
          y: 45,
        },
        {
          id: "kk-3",
          figureRef: "Fig. 2",
          label: "D",
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
      "In 1964, anticipation of a looming petroleum shortage prompted DuPont to seek lightweight polymer reinforcements to replace heavy steel cord in radial automobile tires. Flexible-chain polymers like nylon and Dacron polyester lacked the stiffness and tensile strength required, melting under frictional heat and creeping under sustained tension.",
    priorArtLimitations: [
      "Aliphatic polyamides (Nylon 6,6) form flexible, randomly coiled chains that require extensive mechanical stretching (hot drawing) to achieve modest alignment, topping out at $<1\\text{ GPa}$ tenacity.",
      "Steel cord provided high stiffness but added excessive rotational inertia, unsprung vehicle weight, and suffered rust corrosion in wet road conditions.",
      "A cloudy, watery polymer solution was, in every commercial spinner's experience, considered a defective contaminated batch that would clog spinneret capillary orifices.",
    ],
    breakthroughInsight:
      "Stephanie Kwolek synthesized poly-p-phenylene terephthalamide (PPD-T) and discovered that dissolving it in 100% concentrated sulfuric acid produced an opalescent, milky, low-viscosity fluid. Recognizing that the cloudiness was due to liquid-crystalline nematic ordering rather than contamination, she convinced technician Charles Mullen to run it through a laboratory spinneret. The extruded fiber emerged with unprecedented molecular orientation, five times stronger than steel on an equal weight basis.",
    patentWars: [
      {
        rivalName: "Akzo Nobel (Twaron Aramid)",
        rivalClaim:
          "Dutch chemical conglomerate Akzo developed an identical poly-p-phenylene terephthalamide fiber (Twaron), sparking a decade-long international patent battle over aramid polymerization solvents and spinning processes.",
        conflictDetails:
          "DuPont and Akzo sued each other in US and European courts through the 1980s. The dispute centered on whether Akzo's solvent system (N-methylpyrrolidone with calcium chloride) infringed DuPont's sulfuric acid and amide-salt dope claims.",
        resolution:
          "In 1988, DuPont and Akzo reached a comprehensive worldwide settlement, cross-licensing patents and dividing commercial territory, while DuPont retained the exclusive trademark rights to Kevlar.",
        legalOutcome:
          "Stephanie Kwolek's foundational 1972 US Patent No. 3,671,542 stood as the definitive prior art establishing liquid-crystalline polymer fiber spinning.",
      },
    ],
    civilizationalImpact:
      "Kevlar revolutionized human safety and advanced materials. Beyond bullet-resistant soft body armor credited with saving over 3,500 police officers' lives, Kevlar enabled undersea fiber-optic transatlantic communication cables, crash-resistant Formula 1 cockpits, fire-retardant turnout gear for firefighters, and lightweight aerospace airframes.",
    funFact:
      "Stephanie Kwolek originally took a temporary job as a chemist at DuPont in 1946 to earn enough money to attend medical school. She became so captivated by polymer discovery that she stayed for 40 years, never went to medical school, and ultimately saved more lives through Kevlar than most physicians could ever hope to save in a career.",
    aftermath:
      "Kwolek received the National Medal of Technology in 1996, the Perkin Medal in 1997, and was inducted into the National Inventors Hall of Fame in 1995 as only the fourth woman ever honored. She retired from DuPont in 1986 and devoted her retirement to mentoring young women in STEM education before passing away in 2014 at age 90.",
    sideNotes: [
      "The term 'aramid' is a portmanteau of 'aromatic polyamide,' officially designated by the Federal Trade Commission in 1974 as a distinct fiber class separate from nylon.",
      "Kevlar does not melt; it retains its structural integrity until it begins to carbonize at approximately 500°C (932°F).",
    ],
  },
  tags: [
    "Stephanie Kwolek",
    "Kevlar",
    "Aramid Fibers",
    "Liquid Crystal Polymers",
    "Polymer Chemistry",
    "Body Armor",
    "Materials Science",
    "DuPont",
  ],
  stats: {
    totalClaims: 2,
    independentClaims: 1,
    patentWarYears: "1968–1988",
    impactScore: 100,
  },
};

/**
 * The public record is intentionally narrower than the preserved legacy draft
 * above. The source-audit receipt proves the front sheet, nine drawing sheets,
 * and both printed claims, but not a complete manually prepared specification.
 * Do not bind the legacy edition or its incomplete ledger to this public record:
 * neither is a reviewed source asset, and the pinned facsimile remains the
 * only complete source face until that work is finished.
 */
export const kwolekKevlarPatent: Patent = {
  id: "us-3671542-kwolek-kevlar",
  patentNumber: "US 3,671,542",
  title: "Optically Anisotropic Aromatic Polyamide Dopes",
  shortTitle: "Kwolek Kevlar Aromatic Polyamide Dopes",
  subtitle: "Complete Patent Transcript with a Structured Edition in Preparation",
  inventors: ["Stephanie Louise Kwolek"],
  inventorLocation: "Wilmington, Delaware",
  grantDate: "1972-06-20",
  filingDate: "1969-05-23",
  era: "Information Age (1960–1990)",
  category: "materials",
  categoryLabel: "Polymer Chemistry & Advanced Materials",
  summary:
    "The grant's abstract describes optically anisotropic dopes made from carbocyclic aromatic polyamides in suitable liquid media and says those dopes are used to prepare fibers with unusual internal structure and high tensile properties. Its complete 58-page transcript is readable on the Original Patent Text face while a structured manual edition is prepared.",
  heroQuote:
    "Compositions or dopes comprising carbocyclic aromatic polyamides in suitable liquid media are prepared which are optically anisotropic.",
  originalPdfUrl: "/patents/pdfs/us-3671542-kwolek-kevlar.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US3671542A/en",
  usptoClassification: "U.S. Cl. 260/30.8 R; Int. Cl. C08g 51/44.",
  originalText: `UNITED STATES PATENT
3,671,542
Patented June 20, 1972

OPTICALLY ANISOTROPIC AROMATIC POLYAMIDE DOPES
Stephanie Louise Kwolek, Wilmington, Del., assignor to E. I. du Pont de Nemours and Company, Wilmington, Del.
Filed May 23, 1969, Appl. No. 827,345

ABSTRACT
Compositions or dopes comprising carbocyclic aromatic polyamides in suitable liquid media are prepared which are optically anisotropic. These dopes are used in preparing fibers of unique internal structure and exceptionally high tensile properties.

The complete 58-page historical transcript is readable on the Original Patent Text face. A structured manual edition is still being prepared against the pinned facsimile.`,
  plainEnglishExplanation: {
    overview:
      "The verified front sheet says this grant concerns optically anisotropic aromatic-polyamide dopes and their use in making fibers. The complete patent transcript is available on the Original Patent Text face; a broader engineering explanation remains limited while the structured source edition is prepared.",
    coreMechanism:
      "The two printed claims define a polymer dope made from a carbocyclic aromatic polyamide and selected liquid media. Claim 2 narrows one such medium to concentrated sulfuric acid. A complete explanation of the specification's processing, examples, figures, tables, and corrections awaits line-by-line manual review.",
    mechanicalBreakdown: [
      {
        title: "Facsimile review boundary",
        summary:
          "The source consists of a front sheet, nine drawing sheets, a long specification, two claims, and two copies of a correction certificate.",
        technicalDetails:
          "Only the front sheet, drawing sheets, and two printed claims are currently verified for public metadata. No quantitative spinning, strength, ballistic, thermal, or production claim is presented here until the remaining source pages are manually authored and reviewed.",
        archaicTerm: "Dope",
        modernEquivalent: "Polymer solution used to form shaped articles",
      },
    ],
    // These would be modern materials-science interpretations, not checked
    // claims or complete-source annotations. Keep the public face empty until
    // the specification can support a non-lossy, manually reviewed treatment.
    scientificPrinciples: [],
    whyItMattersToday:
      "This record preserves the grant and its verified claim boundary while a complete source-led edition is prepared; it does not substitute later material-performance narratives for the historical instrument.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: kwolekKevlarClaims[0].text,
      plainEnglish:
        "Claim 1 defines an optically anisotropic dope: a qualifying carbocyclic aromatic homo- or copolyamide at at least about five percent by weight, combined with one of the named liquid-media families, above the stated viscosity-discontinuity threshold and without a solid phase.",
      keyInnovations: [
        "Carbocyclic aromatic homo- or copolyamide",
        "Selected acid or amide/urea liquid media",
        "Viscosity-discontinuity concentration threshold",
      ],
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText: kwolekKevlarClaims[1].text,
      plainEnglish:
        "Claim 2 narrows claim 1 to concentrated sulfuric acid greater than about 98 percent by weight, which may contain free sulfur trioxide.",
      keyInnovations: [
        "Greater-than-about-98-percent sulfuric acid",
        "Optional free sulfur trioxide",
      ],
    },
  ],
  drawings: [],
  historicalContext: {
    problemStatement:
      "The verified abstract identifies the subject as optically anisotropic aromatic-polyamide dopes used to prepare fibers with high tensile properties.",
    priorArtLimitations: [
      "A complete, source-reviewed account of the specification's stated prior-art limitations has not yet been prepared for publication.",
    ],
    breakthroughInsight:
      "The grant's abstract distinguishes optically anisotropic polyamide dopes and connects them to fibers with distinctive internal structure.",
    // The checked source packet establishes the grant and its claims, not a
    // later litigation record. Keep this empty until a separate primary legal
    // source can support a public patent-war entry.
    patentWars: [],
    civilizationalImpact:
      "The page remains a source-preservation record until its full historical and technical interpretation can be checked against the complete facsimile.",
  },
  tags: ["Stephanie Louise Kwolek", "Kevlar", "Aromatic polyamide dopes", "Polymer chemistry"],
  stats: {
    totalClaims: 2,
    independentClaims: 1,
  },
};
