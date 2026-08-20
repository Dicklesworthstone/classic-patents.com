import { baekelandBakeliteArchivalEdition } from "@/data/editions/baekelandBakeliteEdition";
import type { Patent } from "@/types/patent";

const baekelandClaimText = (claimNumber: number): string => {
  const claimBlock = baekelandBakeliteArchivalEdition.blocks.find(
    (b) => b.kind === "claim" && b.number === claimNumber,
  );
  if (claimBlock?.kind !== "claim") {
    throw new Error(`US 942,699 claim ${claimNumber} missing from manual edition.`);
  }
  return claimBlock.inlines.map((i) => i.text).join("");
};

export const baekelandBakelitePatent: Patent = {
  id: "us-942699-baekeland-bakelite",
  patentNumber: "US 942,699",
  title: "Method of Making Insoluble Products of Phenol and Formaldehyde",
  shortTitle: "Bakelite Synthetic Polymer & Pressure Curing",
  subtitle:
    "Controlled Two-Phase Condensation, Dehydration, and Super-Atmospheric Autoclave Curing",
  inventors: ["Leo Hendrik Baekeland"],
  inventorLocation: "Yonkers, New York",
  grantDate: "1909-12-07",
  filingDate: "1907-07-13",
  era: "Electrification & Early Modern (1870–1920)",
  category: "materials",
  categoryLabel: "Materials Science & Synthetic Chemistry",
  summary:
    "Leo Hendrik Baekeland's landmark 1909 patent for Bakelite—the world's first fully synthetic, thermosetting plastic. By mastering the condensation reaction between phenol and formaldehyde through a two-stage process and applying super-atmospheric pressure in an autoclave ('Bakelizer') during curing above 100 °C, Baekeland prevented destructive foaming, producing a rigid, insoluble, heat-resistant composite that launched the modern polymer age.",
  heroQuote:
    "The final heating or baking by which the condensation product, alone or compounded, is converted into an insoluble body should be effected in a closed vessel... without this precaution vapors of formaldehyde and the like escape causing foam and air bubbles.",
  originalPdfUrl: "/patents/pdfs/us-942699-baekeland-bakelite.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US942699A/en",
  usptoClassification: "528/129",
  originalTextAsset: {
    url: "/patents/transcripts/us-942699-baekeland-bakelite-reviewed.txt",
    pageCount: 3,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (SteelNeedle)",
    reviewedAt: "2026-08-19",
    sourcePdfSha256: "91b63f1cfe7c4a24739ea63c9d45caa8059e74010ae3a2191bed97616a384dc5",
    pageAnchors: [
      {
        page: 1,
        sourceRelationship: "Specification column 1, application filing header, and preamble",
        exactSourceText: "UNITED STATES PATENT OFFICE. LEO H. BAEKELAND, OF YONKERS, NEW YORK.",
      },
      {
        page: 2,
        sourceRelationship: "Specification column 2, curing conditions, and Claim 1",
        exactSourceText:
          "In order to convert the condensation or dehydration product into the final product above-described",
      },
      {
        page: 3,
        sourceRelationship: "Claims 3–5, execution clause, and inventor signatures",
        exactSourceText:
          "3. The method of making articles containing an insoluble and infusible condensation product",
      },
    ],
  },
  archivalEdition: baekelandBakeliteArchivalEdition,
  originalText:
    "To all whom it may concern: Be it known that I, LEO H. BAEKELAND, a citizen of the United States, residing at Snug Rock, Harmony Park, Yonkers, in the county of Westchester and State of New York, have invented certain new and useful Improvements in Methods of Making Insoluble Condensation Products of Phenols and Formaldehyde, of which the following is a specification.\n\nAccording to this invention phenols and formaldehyde are caused to react upon each other, the water which is present in the reagents or produced by the reaction is separated from the mass, and the resulting product is thereafter transformed by heat, preferably in presence of suitable condensing agents, into a hard, compact, insoluble and infusible body, which is resistant to oils, water, alcohols and other solvents and chemical reagents.\n\nI have found that by carrying out the operation in two distinct phases, or in other words by eliminating the water from the initial condensation or dehydration product before transforming the same into the final hard and insoluble product, important advantages are attained and improved results are secured... In a closed vessel under pressure the operation proceeds with precision, and a uniform result may be always obtained.",
  plainEnglishExplanation: {
    overview:
      "For decades prior to 1907, organic chemists (beginning with Adolf von Baeyer in 1872) observed that mixing phenol (carbolic acid) with formaldehyde produced an uncontrollable, insoluble resinous sludge that ruined glassware. Everyone considered this intractable gunk a synthetic failure. Leo Hendrik Baekeland realized that this insoluble 'gunk' was precisely the ultimate goal: a synthetic material that would never melt, never dissolve, and never conduct electricity. Baekeland solved the two great engineering blockers that defeated previous experimenters: water evolution and volatile boiling. By halting the reaction at an intermediate fusible stage (A-stage resole), dehydrating the resin, and curing it inside a pressurized heated vessel (the 'Bakelizer' autoclave at 110–140 °C and 50–100 psi), the external pressure suppressed boiling and bubble formation, creating a dense, flawless 3D crosslinked thermoset polymer.",
    coreMechanism:
      "The synthesis operates in two controlled thermochemical stages: (1) Step-growth condensation of phenol (C₆H₅OH) with excess aqueous formaldehyde (HCHO) in the presence of an alkaline or mild acid catalyst at 70–90 °C, forming ortho- and para-hydroxymethylphenol prepolymers. Water separates into a distinct supernatant layer and is decanted, leaving a viscous, moldable A-stage resin. (2) Compounding the resin with reinforcing fibrous fillers (wood flour, asbestos, mica) and curing inside a heated steel mold or pressure autoclave at 110–140 °C under 3.5–7.0 bar (50–100 psi). Super-atmospheric pressure forces residual water vapor and formaldehyde to remain dissolved, while thermal energy drives irreversible methylene bridge (-CH₂-) crosslinking into an infinite 3D covalent network (C-stage Bakelite).",
    mechanicalBreakdown: [
      {
        title: "A-Stage Intermediate Resole & Phase Separation",
        summary:
          "Controlled addition of formaldehyde to phenol under mild heating yields low-molecular-weight mono- and di-methylolphenols. The mixture spontaneously stratifies into two layers: an upper aqueous waste layer and a dense lower liquid resin. This intermediate can be poured, shaped, or dissolved in alcohol and acetone.",
        technicalDetails:
          "Equimolar or formaldehyde-rich ratios undergo nucleophilic addition: $\\text{C}_6\\text{H}_5\\text{OH} + \\text{HCHO} \\rightarrow \\text{HOC}_6\\text{H}_4\\text{CH}_2\\text{OH}$. The reaction produces one mole of condensation water per methylene bridge: $n\\,\\text{Phenol} + (n+1)\\,\\text{HCHO} \\rightarrow \\text{Prepolymer} + n\\,\\text{H}_2\\text{O}$.",
        archaicTerm: "Oily or viscous dehydration product",
        modernEquivalent: "Fusible A-stage resole prepolymer liquid",
      },
      {
        title: "The Bakelizer Super-Atmospheric Curing Autoclave",
        summary:
          "A sealed, steam-jacketed iron pressure vessel capable of maintaining 50–100 psi of compressed air while heating to 110–140 °C. The external pressure suppresses the boiling point of trapped moisture and unreacted formaldehyde, preventing explosive foaming and porosity.",
        technicalDetails:
          "According to the Clausius-Clapeyron relation $\\ln(P_2/P_1) = -\\frac{\\Delta H_{\\text{vap}}}{R}\\left(\\frac{1}{T_2}-\\frac{1}{T_1}\\right)$, water vapor pressure reaches 3.6 bar at 140 °C. Applying $P_{\\text{applied}} > P_{\\text{vapor}}(T)$ prevents steam bubble nucleation, guaranteeing a void-free density of 1.30–1.45 g/cm³.",
        archaicTerm: "Closed vessel under pressure",
        modernEquivalent: "High-pressure thermal curing autoclave (Bakelizer)",
      },
      {
        title: "Compounding with Structural & Dielectric Fillers",
        summary:
          "Blending the intermediate B-stage resin with wood flour, asbestos fiber, mica, or graphite prior to final cure. The resin wets every fiber, transforming brittle phenolic glass into high-impact structural composites with extreme dielectric strength.",
        technicalDetails:
          "Compounding with 40–50% wood flour increases tensile strength to 50–70 MPa and prevents thermal shock cracking, while asbestos provides non-arcing insulation up to 200 °C.",
        archaicTerm: "Admixture with asbestos fiber, wood fiber, or mica",
        modernEquivalent: "Phenolic molding compound (composite masterbatch)",
      },
      {
        title: "Irreversible 3D Covalent Crosslinking (Thermosetting)",
        summary:
          "Under sustained heat and pressure, methylol groups condense with active aromatic hydrogen atoms at ortho and para positions, forming robust methylene (-CH₂-) and ether (-CH₂-O-CH₂-) bridges across adjacent benzene rings.",
        technicalDetails:
          "Crosslink density reaches $\\rho_x > 10^{21}\\text{ bonds/cm}^3$, creating an infinite macromolecular diamond-like covalent lattice with glass transition temperature $T_g > 200^\\circ\\text{C}$ and infinite molecular weight ($M_w \\rightarrow \\infty$).",
        archaicTerm: "Hard, compact, insoluble and infusible body",
        modernEquivalent: "Fully crosslinked C-stage phenolic thermoset polymer",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Step-Growth Polycondensation Kinetics",
        formula: "\\bar{X}_n = \\frac{1}{1 - p}",
        explanation:
          "Carothers' equation governs the degree of polymerization where $p$ is the fractional conversion of functional groups. Because phenol has a functionality $f=3$ (ortho/ortho/para) and formaldehyde has $f=2$, the critical gel point conversion occurs at $p_c = \\frac{2}{f} = 0.67$. Beyond this threshold, an infinite crosslinked gel network forms irreversibly.",
      },
      {
        principle: "Vapor Pressure Suppression via External Pressure",
        formula:
          "P_{\\text{autoclave}} > P_{\\text{sat}}(T) = P_0 \\exp\\left(-\\frac{\\Delta H_{\\text{vap}}}{R T}\\right)",
        explanation:
          "At curing temperatures of 130–140 °C, the vapor pressure of water is 2.7–3.6 atmospheres. Applying 5–7 atmospheres of pneumatic pressure in the Bakelizer completely suppresses vaporization, forcing moisture to stay dissolved and preventing voids, bubbles, or structural porosity.",
      },
      {
        principle: "Dielectric Breakdown and Thermal Insulation",
        formula:
          "E_{\\text{breakdown}} = \\frac{V_{\\text{arc}}}{d} \\approx 10\\text{--}15\\text{ kV/mm}",
        explanation:
          "Because the cured phenolic matrix contains no mobile electrons or free ions and cannot soften when hot, it exhibits exceptional dielectric breakdown resistance and zero tracking under electrical arcs, making it the premier insulator for early electrical grids, automotive distributors, and radio housings.",
      },
    ],
    whyItMattersToday:
      "Every modern thermoset plastic—from epoxy printed circuit boards and aerospace carbon-fiber prepregs to polyurethane structural foams and heat-resistant automotive brake linings—descends directly from Baekeland's discovery of controlled two-phase step condensation and autoclave pressure curing.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: baekelandClaimText(1),
      plainEnglish:
        "The master broad method of producing hard, insoluble, and infusible synthetic plastic by reacting a phenolic compound with formaldehyde and curing the resulting intermediate into a solid thermoset body through the simultaneous application of heat and pressure.",
      keyInnovations: [
        "Two-step reaction converting phenol and formaldehyde into an insoluble solid",
        "Combined application of heat and super-atmospheric pressure to achieve complete curing",
        "Synthesis of the first fully synthetic thermosetting resin",
      ],
      legalSignificance:
        "The foundational broad independent claim that gave Baekeland total patent dominance over synthetic phenolic resins, successfully defended in federal court against all competitors.",
    },
    {
      number: 2,
      isIndependent: true,
      originalText: baekelandClaimText(2),
      plainEnglish:
        "The manufacturing method of synthesizing an intermediate prepolymer resin from phenol and formaldehyde capable of being heat-transformed, forming a desired shaped article from the prepolymer, and hardening the article into an infusible finished product under heat and pressure.",
      keyInnovations: [
        "Staged molding process from fusible intermediate to finished shape",
        "Net-shape forming before final irreversible curing",
        "Direct manufacture of molded structural components",
      ],
      legalSignificance:
        "Established patent protection for compression molding of phenolic articles, covering industrial parts production.",
    },
    {
      number: 3,
      isIndependent: true,
      originalText: baekelandClaimText(3),
      plainEnglish:
        "The process of claim 2 with the explicit step of separating and removing the water byproduct from the intermediate reaction mixture before forming the shaped article and applying final heat and pressure.",
      keyInnovations: [
        "Explicit phase separation of aqueous byproduct from intermediate resin",
        "Dehydration prior to molding to eliminate steam blister formation",
        "Isolation of pure moldable A-stage resole resin",
      ],
      legalSignificance:
        "Protected the critical dehydration step that made flawless, void-free industrial molding technically possible.",
    },
    {
      number: 4,
      isIndependent: true,
      originalText: baekelandClaimText(4),
      plainEnglish:
        "The method of compounding the intermediate phenol-formaldehyde resin with particulate or fibrous filling materials (such as wood flour, asbestos, mica, or graphite) to form a composite molding compound, and curing the mixture under heat and pressure.",
      keyInnovations: [
        "Compounding intermediate phenolic resin with reinforcing filler masterbatches",
        "Creation of high-strength structural and electrical composite plastics",
        "Adaptation of rubber compounding principles to synthetic thermosets",
      ],
      legalSignificance:
        "Covered all commercial filled Bakelite molding powders (Bakelite Molding Material), the dominant commercial product line of the General Bakelite Company.",
    },
    {
      number: 5,
      isIndependent: true,
      originalText: baekelandClaimText(5),
      plainEnglish:
        "The chemical salting-out process of separating water from the phenol-formaldehyde reaction mixture by adding a water-soluble metallic salt (such as calcium chloride) to force instantaneous phase stratification.",
      keyInnovations: [
        "Salting-out dehydration of organic phenolic resin",
        "Use of hygroscopic metallic salts for rapid non-thermal water separation",
        "Formation of distinct dense electrolyte and dehydrated organic resin layers",
      ],
      legalSignificance:
        "Specific chemical processing claim providing alternative low-energy dehydration methodology.",
    },
  ],
  drawings: [],
  historicalContext: {
    problemStatement:
      "In the late 19th century, the rapid expansion of electrical grids created a global crisis in electrical insulation.",
    priorArtLimitations: [
      "Natural shellac was scarce, expensive, and softened at moderate temperatures",
      "Uncontrolled phenol-formaldehyde reactions foamed into porous sludge",
    ],
    breakthroughInsight:
      "Applying super-atmospheric pneumatic pressure during curing suppresses byproduct vaporization and boiling, enabling dense, void-free 3D crosslinked polymers.",
    patentWars: [
      {
        rivalName: "Condensite Company / Redmanol Chemical Products",
        rivalClaim: "Anhydrous phenolic resin molding formulations",
        conflictDetails:
          "Competitors attempted to circumvent Baekeland's heat-and-pressure patents.",
        resolution:
          "Federal courts ruled in Baekeland's favor in 1921; the competitors merged into the Bakelite Corporation in 1922.",
        legalOutcome:
          "Established the master authority of Baekeland's autoclave curing patents across the polymer industry.",
      },
    ],
    civilizationalImpact:
      "Inaugurated the Age of Plastics, enabling radios, telephones, automotive distributors, and modern electronics.",
  },
  stats: {
    totalClaims: 5,
    independentClaims: 5,
  },
  tags: [
    "chemistry",
    "materials",
    "polymers",
    "plastics",
    "thermoset",
    "synthetic",
    "bakelite",
    "autoclave",
  ],
};
