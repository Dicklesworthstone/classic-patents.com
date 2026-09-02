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
  shortTitle: "Phenol-Formaldehyde Insoluble Condensation Product",
  subtitle: "Water Separation, Forming, and Heat-and-Pressure Hardening",
  inventors: ["Leo Hendrik Baekeland"],
  inventorLocation: "Yonkers, New York",
  grantDate: "1909-12-07",
  filingDate: "1907-07-13",
  era: "Electrification & Early Modern (1870–1920)",
  category: "materials",
  categoryLabel: "Materials Science & Synthetic Chemistry",
  summary:
    "Leo Hendrik Baekeland's 1909 patent claims methods for reacting a phenolic body with formaldehyde, separating water from the resulting product, forming articles, and hardening the product with heat and pressure into a hard, insoluble, infusible body.",
  heroQuote:
    "The final heating or baking by which the condensation product, alone or compounded, is converted into an insoluble body should be effected in a closed vessel in case the temperature exceed 90°-100° C.",
  originalPdfUrl: "/patents/pdfs/us-942699-baekeland-bakelite.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US942699A/en",
  usptoClassification: "528/129",
  originalTextAsset: {
    url: "/patents/transcripts/us-942699-baekeland-bakelite-reviewed.txt",
    pageCount: 3,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (MossyCat; cloud-Luna visual review pending)",
    reviewedAt: "2026-08-21",
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
    "To all whom it may concern: Be it known that I, LEO H. BAEKELAND, a citizen of the United States, residing at Snug Rock, Harmony Park, Yonkers, in the county of Westchester and State of New York, have invented certain new and useful Improvements in Methods of Making Insoluble Condensation Products of Phenols and Formaldehyde, of which the following is a specification.\n\nIn practicing the invention I react upon a phenolic body with formaldehyde to obtain a reaction product which is capable of transformation by heat into an insoluble and infusible body, and then convert this reaction product, either alone or compounded with a suitable filling material, into such insoluble and infusible body by the combined action of heat and pressure. Preferably the water produced during the reaction or added with the reacting bodies is separated before hardening the reaction product.\n\nThe final heating or baking by which the condensation product, alone or compounded, is converted into an insoluble body should be effected in a closed vessel in case the temperature exceed 90°-100° C.; without this precaution vapors of formaldehyde and the like escape causing foam and air bubbles.",
  plainEnglishExplanation: {
    overview:
      "The patent addresses a practical processing problem: reacting a phenolic body with formaldehyde produces a condensation product and water, while the finished material must be hard, insoluble, and infusible. Baekeland's claimed sequence separates water before final hardening, permits the intermediate to be formed or compounded, and applies heat and pressure to the formed article. The patent requires a closed vessel above about 90–100 °C because escaping vapors can cause foam and air bubbles. Terms such as thermoset and crosslink are modern chemical interpretations, not words printed in this grant.",
    coreMechanism:
      "The source describes two practical stages without assigning modern resin-stage names: first, phenol or another phenolic body reacts with formaldehyde and water is separated; second, the oily or semi-plastic product, alone or compounded with a filling material, is formed and subjected to heat and pressure. The grant gives 110–140 °C as a practical molding temperature and says that above 90–100 °C the heating should occur in a closed vessel to limit vapor escape and foaming. A modern model may represent condensation and irreversible network formation, but it must not present unprinted pressure ranges, apparatus names, conversion values, or material-property measurements as historical observations.",
    mechanicalBreakdown: [
      {
        title: "Oily or Semi-Plastic Condensation Product",
        summary:
          "The patent describes an oily or viscous product and, with further reaction, a gelatinous or semi-plastic product. A mixture may stratify into an aqueous layer and a heavier layer containing the first condensation or dehydration products; the layers can be separated before later forming and hardening.",
        technicalDetails:
          "The patent does not give a structural reaction equation. In modern notation, a simplified phenol-formaldehyde condensation can be represented as $\\text{phenol} + \\text{formaldehyde} \\rightarrow \\text{condensation product} + \\text{water}$, while the exact composition depends on the phenolic body, formaldehyde source, catalyst, and conversion.",
        archaicTerm: "Oily or viscous condensation product",
        modernEquivalent: "Moldable intermediate phenolic resin",
      },
      {
        title: "Closed Vessel Under Pressure",
        summary:
          "The patent requires the final heating in a closed vessel when the temperature exceeds about 90–100 °C. It says that this prevents vapors of formaldehyde and the like from escaping and causing foam and air bubbles, but it does not name a Bakelizer or state a pressure range.",
        technicalDetails:
          "The source gives the qualitative boundary that pressure and enclosure limit vapor escape during heating. A modern thermodynamics model can compare applied pressure with a volatile's saturation pressure using $P_{\\text{applied}} > P_{\\text{sat}}(T)$, but the grant supplies neither a pressure value nor a guaranteed density or porosity.",
        archaicTerm: "Closed vessel under pressure",
        modernEquivalent: "Closed pressure vessel for thermal curing",
      },
      {
        title: "Compounding with Filling Materials",
        summary:
          "The patent permits the condensation product to be mixed with asbestos fiber, wood fiber, rubber, casein, lampblack, mica, mineral powders, pigments, dyes, and other listed materials before final hardening.",
        technicalDetails:
          "Those modern performance values are not measured in this grant. The source establishes only that a filling material may be compounded with the condensation product for the intended use.",
        archaicTerm: "Admixture with asbestos fiber, wood fiber, or mica",
        modernEquivalent: "Phenolic molding compound (composite masterbatch)",
      },
      {
        title: "Hard, Insoluble, and Infusible Body",
        summary:
          "The grant calls the hardened result hard, compact, insoluble, and infusible, and says that it resists moisture, solvents, and most chemical reagents. Modern polymer chemistry interprets that behavior as an extensively crosslinked phenolic network, but the grant does not specify a molecular structure or crosslink density.",
        technicalDetails:
          "A source-bounded modern description is that additional condensation can reduce flow and solubility. The patent provides no numerical crosslink density, glass-transition temperature, or molecular-weight measurement, so those quantities are deliberately withheld here.",
        archaicTerm: "Hard, compact, insoluble and infusible body",
        modernEquivalent: "Fully crosslinked C-stage phenolic thermoset polymer",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Step-Growth Polycondensation Kinetics",
        formula: "\\bar{X}_n = \\frac{1}{1 - p}",
        explanation:
          "Carothers' relation is a modern way to discuss how conversion affects step-growth polymer size. It is not a measurement or equation printed in US 942,699, and the grant does not state a gel-point conversion or a functionality value for its phenolic bodies.",
      },
      {
        principle: "Vapor Pressure Suppression via External Pressure",
        formula:
          "P_{\\text{autoclave}} > P_{\\text{sat}}(T) = P_0 \\exp\\left(-\\frac{\\Delta H_{\\text{vap}}}{R T}\\right)",
        explanation:
          "The grant states that above about 90–100 °C heating should occur in a closed vessel because escaping formaldehyde vapors and the like cause foam and air bubbles. The equation is a modern explanatory model; the patent gives no pressure range or numerical vapor-pressure measurement.",
      },
      {
        principle: "Dielectric Breakdown and Thermal Insulation",
        formula:
          "E_{\\text{breakdown}} = \\frac{V_{\\text{arc}}}{d} \\approx 10\\text{--}15\\text{ kV/mm}",
        explanation:
          "The grant reports resistance to moisture, alcohol, acetone, and most chemical reagents, but it does not measure dielectric breakdown or claim particular electrical applications. Electrical-insulation behavior is a later materials interpretation and must not be read as a result measured by this patent.",
      },
    ],
    whyItMattersToday:
      "The process is an early documented route to an insoluble phenolic condensation material. Later phenolic molding compounds and other thermosets use related ideas of staged forming, fillers, heat, and pressure, but the patent itself does not establish a direct lineage to every modern thermoset named here.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: baekelandClaimText(1),
      plainEnglish:
        "Covers the fundamental industrial process of producing a hard, compact, insoluble, and infusible synthetic condensation material by reacting a phenolic body with formaldehyde and subsequently applying heat and superatmospheric pressure in a closed vessel.",
      keyInnovations: [
        "Two-step reaction converting phenol and formaldehyde into an insoluble solid",
        "Combined application of heat and pressure to harden the condensation product",
        "A method for producing a hard, compact, insoluble, and infusible condensation product",
      ],
      legalSignificance:
        "The broadest claim in this grant, covering reaction of a phenolic body with formaldehyde followed by hardening with heat and pressure.",
    },
    {
      number: 2,
      isIndependent: true,
      originalText: baekelandClaimText(2),
      plainEnglish:
        "Protects the staged manufacturing method comprising reacting a phenolic body with formaldehyde, forming an intermediate fusible resinous reaction product into a desired shape or article, and subsequently hardening the formed article under combined heat and pressure.",
      keyInnovations: [
        "Staged molding process from fusible intermediate to finished shape",
        "Forming an article before heat-and-pressure hardening",
        "Hardening a formed article with heat and pressure",
      ],
      legalSignificance:
        "Adds the article-forming step before the heat-and-pressure hardening operation.",
    },
    {
      number: 3,
      isIndependent: true,
      originalText: baekelandClaimText(3),
      plainEnglish:
        "Covers the article-making process wherein aqueous reaction byproduct and solvent water are physically separated from the intermediate condensation product prior to molding and final irreversible cross-linking under elevated temperature and superatmospheric pressure.",
      keyInnovations: [
        "Explicit phase separation of aqueous byproduct from intermediate resin",
        "Separating water before forming and hardening the article",
        "A source-defined water-removal limitation",
      ],
      legalSignificance:
        "Adds separation of water from the resulting product before forming and hardening the article.",
    },
    {
      number: 4,
      isIndependent: true,
      originalText: baekelandClaimText(4),
      plainEnglish:
        "Protects compounding the intermediate phenolic condensation product with solid filling materials such as wood flour, mineral fibers, or asbestos, shaping the composite mixture into an article, and curing it to an infusible state using heat and pressure.",
      keyInnovations: [
        "Compounding the reaction product with a filling material",
        "Forming a filled article before heat-and-pressure hardening",
        "Applying a compounding step described by the specification",
      ],
      legalSignificance: "Adds a filling-material limitation to the article-making method.",
    },
    {
      number: 5,
      isIndependent: true,
      originalText: baekelandClaimText(5),
      plainEnglish:
        "Covers accelerating and facilitating the rapid physical phase separation of the aqueous liquid from the reacting mixture of a phenolic body and aqueous formaldehyde by introducing an effective quantity of a water-soluble metallic salt, yielding a distinct, highly concentrated, dehydratable resinous intermediate layer suitable for subsequent pressure molding.",
      keyInnovations: [
        "Separating water from a phenol-formaldehyde mixture",
        "Adding a water-soluble metallic salt to cause separation",
        "A distinct metallic-salt water-separation step",
      ],
      legalSignificance:
        "A specific claim to causing water to separate by adding a soluble metallic salt.",
    },
  ],
  drawings: [],
  historicalContext: {
    problemStatement:
      "The grant focuses on controlling the water and vapor produced or introduced during phenol-formaldehyde condensation so the material can be formed and hardened without foam or air bubbles.",
    priorArtLimitations: [
      "The earlier application cited by Baekeland required drying to expel substantial reaction water",
      "Heating above about 90–100 °C in an open vessel allowed formaldehyde vapors and the like to escape, causing foam and air bubbles",
    ],
    breakthroughInsight:
      "Separate the water before final hardening, form or compound the intermediate product, and apply heat and pressure in a closed vessel when required so the finished body is hard, insoluble, and infusible.",
    patentWars: [
      {
        rivalName: "Sir James Swinburne & Condensite Co. (J.W. Aylsworth)",
        rivalClaim:
          "Sir James Swinburne in the UK and J.W. Aylsworth (Condensite Company) in the US developed phenol-formaldehyde resins, filing competing patent claims over curing and molding methods.",
        conflictDetails:
          "Baekeland filed multiple patent infringement lawsuits (General Bakelite Co. v. Condensite Co. and General Bakelite Co. v. Redmanol Chemical Products Co.), asserting US Patent No. 942,699 covering pressurized autoclave curing in the 'Bakelizer'.",
        resolution:
          "In 1922, the competing companies consolidated under Baekeland's leadership into the Bakelite Corporation (General Bakelite, Condensite, and Redmanol merger).",
        legalOutcome:
          "Baekeland's US Patent No. 942,699 was upheld, establishing the Bakelite Corporation as the undisputed synthetic plastics monopoly throughout the 1920s and 1930s.",
      },
    ],
    civilizationalImpact:
      "The claimed sequence became an important historical example of turning a phenolic condensation into a formable, hardened material; later applications and commercial histories require separate sources beyond this three-page grant.",
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
