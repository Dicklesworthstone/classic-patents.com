/**
 * haber-ammonia.ts
 *
 * Canonical Patent Record for Fritz Haber & Robert Le Rossignol's landmark 1910
 * High-Pressure Catalytic Ammonia Synthesis Patent (US Patent 971,501).
 *
 * Transcribed, annotated, and verified against the 1-page pinned facsimile
 * at public/patents/pdfs/us-971501-haber-ammonia.pdf (SHA-256: 59592a18d6dd7208c2d55ce1f6e4e09a0437635b0faa9959d49a95b64d741124).
 */

import {
  haberAmmoniaArchivalEdition,
  manualHaberClaimText,
} from "@/data/editions/haberAmmoniaEdition";
import type { Patent } from "@/types/patent";

export const haberAmmoniaPatent: Patent = {
  id: "us-971501-haber-ammonia",
  patentNumber: "US 971,501",
  title: "Production of Ammonia",
  shortTitle: "Haber-Bosch Catalytic Ammonia Synthesis",
  subtitle: "Continuous High-Pressure Catalytic Hydrogenation of Atmospheric Nitrogen",
  inventors: ["Fritz Haber", "Robert Le Rossignol"],
  inventorLocation: "Karlsruhe, Germany",
  grantDate: "1910-09-27",
  filingDate: "1909-08-13",
  era: "Electrification & Early Modern (1870–1920)",
  category: "materials",
  categoryLabel: "Chemical Engineering & Catalytic Synthesis",
  summary:
    "Fritz Haber and Robert Le Rossignol's 1910 patent claims producing ammonia by passing gases containing nitrogen and hydrogen over osmium, with additional independent process variants using a heated catalyst, pressure, and pressure above 100 atmospheres. The specification reports an example using finely divided osmium at 175 atmospheres and about 550 degrees centigrade that produced eight percent by volume ammonia.",
  heroQuote:
    "We have now discovered that on passing gases containing nitrogen and hydrogen over osmium large quantities of ammonia can be obtained... Pass slowly a mixture of about three parts by volume of hydrogen and one part by volume of nitrogen over finely divided osmium at a pressure of one hundred and seventy-five atmospheres and at a temperature of about five hundred and fifty degrees centigrade. A yield of eight per cent. by volume of ammonia can easily be obtained.",
  originalPdfUrl: "/patents/pdfs/us-971501-haber-ammonia.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US971501A/en",
  usptoClassification: "423/359",
  originalTextAsset: {
    url: "/patents/transcripts/us-971501-haber-ammonia-reviewed.txt",
    pageCount: 1,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (Antigravity)",
    reviewedAt: "2026-08-19",
    sourcePdfSha256: "59592a18d6dd7208c2d55ce1f6e4e09a0437635b0faa9959d49a95b64d741124",
    pageAnchors: [
      {
        page: 1,
        sourceRelationship: "Complete specification, operating parameters, and Claims 1–6",
        exactSourceText:
          "To all whom it may concern: Be it known that we, FRITZ HABER, Ph. D., professor of chemistry, and ROBERT LE ROSSIGNOL, bachelor of science",
      },
    ],
  },
  archivalEdition: haberAmmoniaArchivalEdition,
  originalText:
    "To all whom it may concern: Be it known that we, FRITZ HABER, Ph. D., professor of chemistry, and ROBERT LE ROSSIGNOL, bachelor of science, subjects, respectively, of the King of Prussia and the King of England, residing at Karlsruhe, Germany, have invented new and useful Improvements in the Production of Ammonia, of which the following is a specification.\n\nSeveral attempts have hitherto been made to produce ammonia on a large scale from its elements by passing them over a catalyst, but up to the present not much success has been met with. In order that a process should be successful, it is advisable that the combination take place at as low a temperature and as quickly as possible, since when the temperature increases the concentration of the ammonia formed decreases.\n\nWe have now discovered that on passing gases containing nitrogen and hydrogen over osmium large quantities of ammonia can be obtained... As an example of the manner of carrying out the process of our invention, we give the following without in any way being confined to this example. Pass slowly a mixture of about three parts by volume of hydrogen and one part by volume of nitrogen over finely divided osmium at a pressure of one hundred and seventy-five atmospheres and at a temperature of about five hundred and fifty degrees centigrade. A yield of eight per cent. by volume of ammonia can easily be obtained.",
  drawings: [],
  plainEnglishExplanation: {
    overview:
      "The one-page grant addresses a specific chemical bottleneck: attempts to make ammonia from its elements by passing gases over a catalyst had achieved little success. It reports that osmium allows large quantities of ammonia to be obtained, then gives a source-bounded example at 175 atmospheres and about 550 degrees centigrade. Modern chemistry explains why the pressure and temperature matter: pressure favors the lower-volume product, while heating accelerates bond-breaking and surface reactions at the cost of lower equilibrium concentration. Those modern principles explain the reported example; they do not turn later plant equipment into patent disclosures.",
    coreMechanism:
      "The claimed operation is deliberately simple in the text: pass gases containing nitrogen and hydrogen over a catalyst containing osmium. The specification permits ordinary pressure but prefers 100 to 200 atmospheres, and its example uses finely divided osmium at 175 atmospheres and about 550 degrees centigrade. Modern surface chemistry describes nitrogen and hydrogen adsorption, bond activation, and stepwise hydrogenation on an osmium surface; the grant itself does not specify a compressor, exchanger, condenser, circulation pump, catalyst geometry, or plant loop.",
    mechanicalBreakdown: [
      {
        title: "Nitrogen–Hydrogen Gas Contact",
        summary:
          "The process passes gases containing nitrogen and hydrogen over an osmium-containing catalyst.",
        technicalDetails:
          "For the modern reaction model $\text{N}_2 + 3\text{H}_2 \rightleftharpoons 2\text{NH}_3$, four gas moles become two. At fixed temperature, increasing total pressure favors the lower-volume side, while the catalyst supplies a surface route for the otherwise slow bond-activation steps. The grant claims the contact process, not a particular vessel or flow diagram.",
        archaicTerm: "gases containing nitrogen and hydrogen",
        modernEquivalent: "Nitrogen-and-hydrogen reactant gas mixture",
      },
      {
        title: "Finely Divided Osmium Contact Mass",
        summary:
          "Osmium may be used as finely divided metal or supplied by a reducible osmium compound.",
        technicalDetails:
          "The specification permits metallic osmium, osmium precipitated on quartz, asbestos, or clay, and compounds such as osmium oxid hydrate or Fremy's salt that become metallic osmium under hydrogen. The modern surface step can be written $\text{N}_2 + 2* \rightarrow 2\text{N}^*$, but no activation energy or catalyst-bed dimensions are stated in the grant.",
        archaicTerm: "finely divided condition",
        modernEquivalent: "High-surface-area osmium catalyst",
      },
      {
        title: "Preferred Pressure and Temperature",
        summary:
          "The specification prefers increased pressure and gives a 175-atmosphere, 550-degree example.",
        technicalDetails:
          "The stated example uses approximately a 3:1 hydrogen-to-nitrogen volume ratio, finely divided osmium, 175 atmospheres, and 550 degrees centigrade, with an 8% by-volume ammonia yield. The modern equilibrium relation $K_p = \frac{P_{\text{NH}_3}^2}{P_{\text{N}_2}P_{\text{H}_2}^3}$ explains why pressure favors product, while the temperature is a kinetic/equilibrium compromise; these are interpretive laws, not a drawing of an apparatus.",
        archaicTerm: "at a pressure of one hundred and seventy-five atmospheres",
        modernEquivalent: "High-pressure catalytic operating point",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Le Chatelier's Equilibrium Principle & Volume Contraction",
        formula:
          "K_p(T) = \frac{P_{\text{NH}_3}^2}{P_{\text{N}_2} P_{\text{H}_2}^3} = \frac{y_{\text{NH}_3}^2}{y_{\text{N}_2} y_{\text{H}_2}^3} cdot \frac{1}{P^2}",
        explanation:
          "Because 4 moles of gaseous reactants compress into 2 moles of product, increasing total hydrostatic pressure P forces the equilibrium quotient toward ammonia formation, multiplying equilibrium mole fraction proportionally with system pressure.",
      },
      {
        principle: "Van 't Hoff Isochore & Exothermic Equilibrium Limitation",
        formula:
          "left(\frac{partial ln K_p}{partial T}\right)_P = \frac{Delta H^circ}{R T^2} < 0 quad (Delta H^circ = -92.4\text{ kJ/mol})",
        explanation:
          "Because the synthesis reaction is exothermic, equilibrium conversion decreases as temperature rises. The optimum industrial operating temperature (~450–550 °C) represents the precise kinetic compromise between catalyst activation speed and thermodynamic equilibrium yield.",
      },
      {
        principle: "Temkin-Pyzhev Heterogeneous Catalytic Rate Kinetics",
        formula:
          "r_{\text{syn}} = k_1 P_{\text{N}_2} left(\frac{P_{\text{H}_2}^3}{P_{\text{NH}_3}^2}\right)^alpha - k_2 left(\frac{P_{\text{NH}_3}^2}{P_{\text{H}_2}^3}\right)^{1-alpha}",
        explanation:
          "The rate of ammonia formation over active metal catalysts is governed by the rate-determining dissociative adsorption of N2 on the catalyst surface, where reaction velocity is promoted by high nitrogen and hydrogen partial pressures and inhibited by product ammonia accumulation.",
      },
    ],
    whyItMattersToday:
      "Later Haber-Bosch plants made this chemistry industrially important by adding equipment and catalysts not disclosed in this one-page osmium grant. The durable inheritance is the pressure-and-catalysis strategy for converting atmospheric nitrogen into ammonia, which underlies modern fertilizer production; those later plant claims should not be projected back onto US 971,501.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: manualHaberClaimText(1),
      plainEnglish:
        "This broad independent claim covers the chemical process itself: gases containing nitrogen and hydrogen must be passed over a catalyst containing osmium. It does not require heating, a pressure threshold, a particular support, or any compressor, condenser, circulation loop, or later iron catalyst.",
      keyInnovations: [
        "Direct catalytic synthesis of ammonia from elemental nitrogen and hydrogen",
        "Use of solid osmium as an active heterogeneous contact catalyst",
        "Continuous contact gas-phase reaction",
      ],
      legalSignificance:
        "The foundational claim that established patent protection for transition-metal catalytic ammonia synthesis.",
    },
    {
      number: 2,
      isIndependent: true,
      originalText: manualHaberClaimText(2),
      plainEnglish:
        "This independent variant adds heat to Claim 1's gas-over-osmium process. Its legal limitation is a heated osmium-containing catalyst, while the nitrogen-and-hydrogen feed remains required; the claim does not specify a temperature, vessel, catalyst support, product separator, or recycle system.",
      keyInnovations: [
        "Thermal activation of the solid osmium catalyst bed",
        "Controlled elevated reaction temperature for catalytic bond dissociation",
      ],
      legalSignificance:
        "Specifically covers heated catalytic reaction zones for overcoming the kinetic activation barrier.",
    },
    {
      number: 3,
      isIndependent: true,
      originalText: manualHaberClaimText(3),
      plainEnglish:
        "This claim combines the two operating conditions stated in the specification: nitrogen-and-hydrogen gases pass over osmium, the catalyst is heated, and the process occurs under pressure. It claims that combination without importing the worked example's exact 175 atmospheres or 550 degrees.",
      keyInnovations: [
        "Simultaneous application of elevated temperature and super-atmospheric pressure",
        "Synergistic kinetic acceleration and thermodynamic equilibrium shift",
      ],
      legalSignificance:
        "Covers the combined temperature-and-pressure operating regime of the Haber process.",
    },
    {
      number: 4,
      isIndependent: true,
      originalText: manualHaberClaimText(4),
      plainEnglish:
        "This claim narrows the broad osmium process by requiring a mixture of nitrogen and hydrogen and a pressure above 100 atmospheres. Unlike Claim 3, it does not expressly require a heated catalyst; its distinctive legal boundary is the stated super-atmospheric pressure threshold.",
      keyInnovations: [
        "Super-atmospheric pressure threshold exceeding 100 atmospheres (10 MPa)",
        "Industrial high-pressure chemical processing regime",
      ],
      legalSignificance:
        "Established the distinct legal boundary of extreme super-atmospheric pressure (>100 atm) in synthetic chemistry.",
    },
    {
      number: 5,
      isIndependent: true,
      originalText: manualHaberClaimText(5),
      plainEnglish:
        "This claim requires all three specified elements together: a nitrogen-and-hydrogen mixture, an osmium catalyst that is heated, and pressure above 100 atmospheres. It is narrower than Claim 4 because heat is explicit, but it still claims a process rather than an illustrated plant arrangement.",
      keyInnovations: [
        "Heated catalyst operation at pressures exceeding 100 atmospheres",
        "Nitrogen-and-hydrogen mixture over heated osmium above 100 atmospheres",
      ],
      legalSignificance:
        "The core commercial process claim under which the first industrial Haber-Bosch plants operated.",
    },
    {
      number: 6,
      isIndependent: true,
      originalText: manualHaberClaimText(6),
      plainEnglish:
        "This final claim specifies the worked-example direction and materials more closely: a mixture of hydrogen and nitrogen passes over heated metallic osmium at pressure above 100 atmospheres. It does not claim a particular three-to-one ratio, because that ratio appears in the example rather than in this claim text.",
      keyInnovations: [
        "Use of pure metallic osmium contact mass",
        "Heated metallic osmium above 100 atmospheres",
      ],
      legalSignificance:
        "Specific metallic catalyst claim securing the primary laboratory and pilot plant configuration.",
    },
  ],
  historicalContext: {
    problemStatement:
      "At the turn of the 20th century, the world was rapidly approaching a catastrophic global food shortage as natural Chilean saltpeter (sodium nitrate) and guano deposits were being depleted, creating an urgent civilizational demand for synthetic nitrogen fixation.",
    priorArtLimitations: [
      "The Birkeland-Eyde electric arc process consumed prohibitive amounts of electrical energy (>60,000 kWh per ton of fixed nitrogen)",
      "The Frank-Caro cyanamide process was energy-intensive and produced solid calcium cyanamide rather than versatile ammonia",
      "Prior direct synthesis attempts by Ostwald and Nernst operated at near-atmospheric pressures where equilibrium ammonia concentrations were <0.01%",
    ],
    breakthroughInsight:
      "The source-bounded move was to pass nitrogen-and-hydrogen gases over osmium, preferably in finely divided form, while reporting that increased pressure and a 175-atmosphere, 550-degree example produced eight percent ammonia by volume.",
    patentWars: [],
    civilizationalImpact:
      "Enabled the mass production of synthetic nitrogen fertilizer, sparking the Green Revolution that expanded global agricultural productivity and currently sustains roughly half of the world's 8 billion people.",
    funFact:
      "To test thousands of catalyst candidates, BASF chemist Alwin Mittasch ran over 20,000 experimental tests before identifying the promoted iron-potassium-alumina catalyst that replaced scarce osmium and is still used today.",
  },
  stats: {
    totalClaims: 6,
    independentClaims: 6,
  },
};
