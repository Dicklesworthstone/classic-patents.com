import { nobelDynamiteArchivalEdition } from "@/data/editions/nobelDynamiteEdition";
import type { Patent } from "@/types/patent";

export const nobelDynamitePatent: Patent = {
  id: "us-78317-nobel-dynamite",
  patentNumber: "US 78,317",
  title: "Improved Explosive Compound",
  shortTitle: "Porous-Earth Explosive Powder",
  subtitle: "Absorbent silicious earth carrier for nitro-glycerine",
  inventors: ["Alfred Nobel"],
  inventorLocation: "Hamburg, Germany",
  grantDate: "1868-05-26",
  // Neither reviewed primary record supplies a U.S. filing date or application
  // number. Do not substitute the grant or execution date for missing evidence.
  filingDate: null,
  era: "Civil War & Industrial Acceleration (1860–1880)",
  category: "materials",
  categoryLabel: "Chemical Physics & Energetic Materials",
  summary:
    "US 78,317 describes an explosive powder made by mixing nitro-glycerine with a porous, inexplosive absorbent earth. Nobel gives the material's loading range, preparation, screening, packing, and initiation discussion, then claims the composition of matter made substantially from those ingredients in that manner and for those purposes.",
  heroQuote:
    "The chief characteristic of this powder is its nearly perfect exemption from liability to accidental or involuntary explosion.",
  originalPdfUrl: "/patents/pdfs/us-78317-nobel-dynamite.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US78317/en",
  usptoClassification: "C06B 25/10 (Explosive compositions containing nitroglycerine)",
  // The legacy source-text asset remains preserved on disk but is deliberately
  // not served: it is a corrupt OCR layer, not a reviewed transcription.
  originalText:
    "The nature of the invention consists in forming out of two ingredients long known, viz, the explosive substance nitro-glycerine, and an inexplosive porous substance, hereafter specified, a composition which, without losing the great explosive power of nitro-glycerine, is very much altered as to its explosive and other properties, being far more safe and convenient for transportation, storage, and use, than nitro-glycerine.",
  archivalEdition: nobelDynamiteArchivalEdition,
  plainEnglishExplanation: {
    overview:
      "The source distinguishes liquid nitro-glycerine from a powder made by retaining it in a porous earth. Nobel's practical problem is leakage and poor filling of a bore-hole by a cartridge smaller than the hole. His stated answer is an absorbent material that can hold a high liquid fraction while remaining a compressible powder. The primary facsimile calls the product an explosive powder; it does not print the word dynamite or identify the cap's fulminating powder as mercury fulminate.",
    coreMechanism:
      "The specification gives a composition interval from sixty parts nitro-glycerine to forty earth through seventy-eight to twenty-two, with seventy-five to twenty-five described as well adapted to ordinary practice. The dry, pulverized earth receives a small steady stream of nitro-glycerine while mixing. The mass is then screened. In a bore-hole, a fuse initiates a percussion-cap and the cap's explosion initiates the powder. The source records a 360° Fahrenheit heat condition under tight confinement; it does not supply a modern detonation velocity, pressure, or named reaction model.",
    mechanicalBreakdown: [
      {
        title: "Porous Silicious Earth",
        summary: "The silica-rich porous earth is the specified absorbent carrier.",
        technicalDetails:
          "Nobel selects a homogeneous material with low specific gravity and great absorbent capacity, said generally to contain the remains of infusoria. He says it can take up about three times its own weight of nitro-glycerine and still retain powder-form. The specification names silicious marl, tripoli, and rotten-stone as related period names.",
        archaicTerm: "silicious earth",
        modernEquivalent: "silica-rich porous earth; often described today as diatomaceous earth",
      },
      {
        title: "Nitro-Glycerine Loading Range",
        summary:
          "The source sets material ratios and ties them to powder, dry, and pasty behavior.",
        technicalDetails:
          "The minimum given is 60 parts by weight of nitro-glycerine to 40 earth; the maximum is 78 to 22. Nobel calls 75 to 25 suitable for ordinary practical purposes and says it can be compressed to a specific gravity nearly equal to pure nitro-glycerine. He contrasts this with chalk, which he says becomes pasty at 20 percent.",
        archaicTerm: "nitro-glycerine",
        modernEquivalent: "nitroglycerin; the historical spelling is retained in the source face",
      },
      {
        title: "Fuse and Percussion-Cap Initiation",
        summary: "The specification gives a fuse, cap, and embedded-charge sequence.",
        technicalDetails:
          "A common blasting-fuse is inserted into a percussion-cap and its rim crimped around the fuse so the fulminating powder and fuse end are enclosed. The cap-and-fuse end is embedded in the powder. Nobel then states the causal sequence: the fuse explodes the cap, and the cap's explosion explodes the powder.",
        archaicTerm: "percussion-cap",
        modernEquivalent:
          "an initiating cap; the source does not specify its metal or chemical identity",
      },
      {
        title: "Paper Cartridge and Bore-Hole Placement",
        summary:
          "The powder may be packed in strong-paper cartridges and pressed into a bore-hole.",
        technicalDetails:
          "Nobel says the semi-pasty material can fill a bore-hole rather than leave the unfilled clearance caused by a smaller cartridge of liquid nitro-glycerine. He later identifies strong-paper cartridges as a convenient form. No source drawing specifies a cartridge geometry, wax treatment, or dimensions.",
        archaicTerm: "bore-hole",
        modernEquivalent: "a drilled rock hole for a blasting charge",
      },
      {
        title: "Screening and Tamping",
        summary: "Screening establishes particle fineness; pressed tamping confines the charge.",
        technicalDetails:
          "After stirring and kneading, Nobel calls for hair, silk, or brass-wire screening, with a stiff-bristle brush to reduce remaining lumps. In blasting, sand or another proper material is added as tamping and pressed but not pounded. These are source-stated preparation and placement steps, not a modern safety procedure.",
        archaicTerm: "tamping",
        modernEquivalent: "material packed around or above a charge to provide confinement",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Composition by Weight",
        formula: "60:40 through 78:22 nitro-glycerine to earth; 75:25 for ordinary practice",
        explanation:
          "These are the source's own proportions. Nobel associates the lower mixture with a dry appearance and the upper mixture with a pasty one, and says larger relative nitro-glycerine content produces a more easily exploded, more powerful powder.",
      },
      {
        principle: "Porous Absorbent Retention",
        formula: "about 3 times the earth's own weight of nitro-glycerine",
        explanation:
          "The specification makes this stated uptake the reason a selected earth can retain powder-form at a high nitro-glycerine loading. It contrasts that behavior with chalk and porous charcoal.",
      },
      {
        principle: "Confinement and Applied Heat",
        formula: "above 360° Fahrenheit in a tight and strong enclosure",
        explanation:
          "Nobel states this condition directly and contrasts it with explosion caused by another explosion in or into the powder under other circumstances. The patent does not provide an activation-energy calculation.",
      },
      {
        principle: "Stated Initiation Sequence",
        formula: "fuse → percussion-cap → powder",
        explanation:
          "The source gives this sequence in plain language and ties it to cap placement, firm embedding, and tamping. It is source evidence of a use method, but the only printed claim is to the composition of matter.",
      },
    ],
    whyItMattersToday:
      "The document captures a nineteenth-century engineering problem that remains recognizable in bulk materials handling: retain a high-energy liquid in a manageable granular carrier, then define loading, particle preparation, confinement, and initiation conditions. Its historical influence should be assessed through the patent's actual composition claim, not through the invented drawing and second claim removed from this record.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "The composition of matter, made substantially of the ingredients and in the manner and for the purposes set forth.",
      plainEnglish:
        "The sole formal claim is to the composition of matter described in the specification: the named ingredients, prepared in the stated manner, for the stated purposes. The cap-and-fuse discussion is explanatory specification text, not a second claim.",
      keyInnovations: [
        "Nitro-glycerine and porous earth composition",
        "Absorbent mineral carrier",
        "Specified powder preparation and use",
      ],
      legalSignificance:
        "The printed claim is broad in its source wording but must be read with the ingredients, manner, and purposes set forth in the preceding specification; this record makes no broader litigation conclusion.",
    },
  ],
  drawings: [],
  historicalContext: {
    problemStatement:
      "The specification frames the practical problem as retaining nitro-glycerine's explosive power while avoiding leakage and handling difficulty in transport, storage, and mining bore-holes.",
    priorArtLimitations: [
      "A cartridge containing liquid nitro-glycerine must be smaller than the bore-hole and therefore leaves space around it.",
      "Chalk is said to become pasty at a low nitro-glycerine loading, while porous charcoal is rejected as combustible and insufficiently elastic.",
      "The source requires an absorbent material that neither decomposes, destroys, nor injures the nitro-glycerine or its explosiveness.",
    ],
    breakthroughInsight:
      "The patent's stated insight is that a porous earth with high absorbent capacity can retain a large nitro-glycerine fraction in powder-form, allowing the material to be pressed into the bore-hole while retaining much of the liquid's explosive power.",
    patentWars: [
      {
        rivalName: "Atlantic Giant Powder Company v. Dittmar Powder Manufacturing Company",
        rivalClaim:
          "The dispute concerned reissue No. 5,799 of original US 78,317 and whether competing powder mixtures used an absorbent equivalent of the source-described earth.",
        conflictDetails:
          "The reported 1880 decision discusses the original specification's use of “inexplosive” and evidence about competing powders containing nitro-glycerine with other absorbent materials. It does not turn the original two-page grant into a two-claim instrument.",
        resolution:
          "The court treated the reported Dittmar mixtures as infringing the reissue under the reasons given in earlier cases, while separately discussing the limits created by the original specification and reissue history.",
        legalOutcome:
          "This record cites the case only as later history of reissue No. 5,799. The visitor-facing claim remains the one unnumbered claim printed in US 78,317; this is not a current legal-scope opinion.",
      },
    ],
    civilizationalImpact:
      "The patent documents a move from loose liquid nitro-glycerine toward a porous-earth explosive powder that could be packed and handled in a mining context. Its importance lies in that source-stated materials and use problem; the facsimile itself contains no civil-works ledger or litigation outcome.",
    funFact:
      "The title printed in this U.S. grant is “Improved Explosive Compound.” The source calls the subject an “Explosive Powder”; neither “dynamite” nor a drawing caption appears in its two pages.",
    aftermath:
      "The local facsimile is a two-page grant dated May 26, 1868. Its typed edition preserves the attestation, sole claim, signature, and witnesses rather than inferring later commercial or legal outcomes from the document alone.",
    sideNotes: [
      "The source says the selected earth is generally composed of the remains of infusoria and will take up about three times its own weight of nitro-glycerine while retaining powder-form.",
      "The source describes a percussion-cap with fulminating powder, but the grant's only claim is the composition of matter. It does not identify the cap's fulminating powder as mercury fulminate.",
    ],
  },
  tags: [
    "Alfred Nobel",
    "Explosive powder",
    "Explosives",
    "Nitroglycerin",
    "Chemistry",
    "Mining Engineering",
    "Civil Engineering",
    "19th Century",
  ],
  stats: {
    totalClaims: 1,
    independentClaims: 1,
  },
};
