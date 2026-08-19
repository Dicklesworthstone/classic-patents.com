import type { Patent } from "@/types/patent";
import { goodyearRubberArchivalEdition } from "../editions/goodyearRubberEdition";

export const goodyearRubberPatent: Patent = {
  id: "us-3633-goodyear-rubber",
  patentNumber: "US 3,633",
  title: "Improvement in India-Rubber Fabrics",
  shortTitle: "Goodyear India-Rubber Fabric",
  subtitle: "A sulphur, white-lead, cotton-batting, and heat-treatment process",
  inventors: ["Charles Goodyear"],
  inventorLocation: "New York, New York",
  grantDate: "1844-06-15",
  filingDate: "1844-01-30",
  era: "Industrial Dawn (1840–1870)",
  category: "materials",
  categoryLabel: "Materials Science & Chemical Engineering",
  summary:
    "In this June 15, 1844 grant, Charles Goodyear claimed a rubber-fabric compound of India-rubber, sulphur, and white lead or related lead salts or oxides; cotton-batting laminates; and heat treatment. The specification gives 25:5:7 parts as its preferred India-rubber, sulphur, and white-lead mixture, permits 212°–350° Fahrenheit heat, and says the best effect approaches 270°.",
  heroQuote:
    "My principal improvement consists in the combining of sulphur and white lead with the india-rubber, and in the submitting of the compound thus formed to the action of heat at a regulated temperature.",
  originalPdfUrl: "/patents/pdfs/us-3633-goodyear-rubber.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US3633A/en",
  usptoClassification:
    "Historical grant; modern Google Patents classifications include B32B and C08F8/34",
  originalTextAsset: {
    url: "/patents/transcripts/us-3633-goodyear-rubber.txt",
    pageCount: 2,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (SunnySpring)",
    reviewedAt: "2026-08-17",
    sourcePdfSha256: "efd8490327472ea50fd873afd35ec759489f9587c9a9df1a590a500f7a66a8a7",
    pageAnchors: [
      {
        page: 1,
        exactSourceText: "UNITED STATES PATENT OFFICE.",
        sourceRelationship: "Patent-office masthead and first part of the specification.",
      },
      {
        page: 2,
        exactSourceText: "Having thus fully described the nature of the process",
        sourceRelationship:
          "Specification conclusion, claim lead-in, claims 1–3, execution, and witnesses.",
      },
    ],
  },
  archivalEdition: goodyearRubberArchivalEdition,
  originalText: `UNITED STATES PATENT OFFICE.
CHARLES GOODYEAR, OF NEW YORK, N. Y.

IMPROVEMENT IN INDIA-RUBBER FABRICS.

Specification forming part of Letters Patent No. 3,633, dated June 15, 1844.

To all whom it may concern:
Be it known that I, CHARLES GOODYEAR, of the city of New York, in the State of New York, have invented certain new and useful Improvements in the Manner of Preparing Fabrics of Caoutchouc or India-Rubber; and I do hereby declare that the following is a full and exact description thereof.

My principal improvement consists in the combining of sulphur and white lead with the india-rubber, and in the submitting of the compound thus formed to the action of heat at a regulated temperature, by which combination and exposure to heat it will be so far altered in its qualities as not to become softened by the action of the solar ray or of artificial heat at a temperature below that to which it was submitted in its preparation—say to a heat of 270° of Fahrenheit's scale—nor will it be injuriously affected by exposure to cold. It will also resist the action of the expressed oils, and that likewise of spirits of turpentine, or of the other essential oils at common temperatures, which oils are its usual solvents.`,
  plainEnglishExplanation: {
    overview:
      "Goodyear's document has three linked moves. First, it specifies a compound of India-rubber, sulphur, and white lead. Second, it describes a fabric made by sandwiching cotton-wool between coats of that gum. Third, it exposes the material to heat. His stated aim is not a generic rubber improvement: it is resistance to solar or artificial heat below the preparation temperature, cold, and the oils that usually dissolved the gum.",
    coreMechanism:
      "The claimed manufacturing chain is: mix India-rubber with sulphur and white lead; form it as a sheet or coat it on cloth or leather; optionally put cotton-wool between gum layers; dry it; then heat it. The printed range is 212°F to 350°F, with the best effect said to approach 270°F. The source makes a process claim about the changed properties; it does not disclose a modern molecular mechanism, so later cross-linking terminology is editorial interpretation, not wording from the grant.",
    mechanicalBreakdown: [
      {
        title: "Three-part compound",
        summary:
          "The source combines India-rubber, sulphur, and white lead before the heat treatment.",
        technicalDetails:
          "Goodyear gives 25 parts India-rubber, 5 parts sulphur, and 7 parts white lead as the mixture he had found best. His first claim also permits other lead salts or oxides in place of white lead when they produce a like result. The document does not state a molecular reaction mechanism or a measured cross-link density.",
        archaicTerm: "white lead",
        modernEquivalent:
          "A lead-containing pigment material; the grant also names lead salts and oxides.",
      },
      {
        title: "Sheet and coating routes",
        summary: "The compound may become a free sheet or a coating on cloth or leather.",
        technicalDetails:
          "The specification first describes dissolving India-rubber in turpentine or another essential oil and grinding the white lead and sulphur in turpentine. It also gives an alternative: incorporate the ground materials into the gum with heated cylinders or calender rollers, then make sheets or apply them to cloth or leather. Those are manufacturing routes stated in the grant, not a recipe for a modern material-performance model.",
        archaicTerm: "calender-rollers",
        modernEquivalent: "Heated rollers used to work material into a sheet.",
      },
      {
        title: "Cotton-wool laminate",
        summary: "Cotton-wool batting sits between successive gum coats on a supporting fabric.",
        technicalDetails:
          "After laying a compounded coat on fabric, Goodyear covers it with cotton-wool as delivered from a carding-machine and then covers that batting with another coat of gum. He says the sequence may be repeated two or three times to obtain the desired thickness. The printed claim is specifically the interposition of cotton-batting between layers of gum.",
        archaicTerm: "doffer of a carding-machine",
        modernEquivalent: "The part of a carding machine that removes the formed cotton web.",
      },
      {
        title: "Regulated heat treatment",
        summary:
          "The dried fabric is heated between 212°F and 350°F, with the best effect said to approach 270°F.",
        technicalDetails:
          "Goodyear permits either a heated cylinder or an atmosphere of the proper temperature in an oven with openings for the sheet or web. He warns that material above 270°F must remain there only briefly and says the softened fabric must stay on its supporting cloth during the operation. The source gives this operating window but no time, pressure, reaction-rate, or material-strength measurement.",
        archaicTerm: "action of a high degree of temperature",
        modernEquivalent: "A controlled heat-treatment step.",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Stated composition window",
        formula: "25 parts India-rubber : 5 parts sulphur : 7 parts white lead",
        explanation:
          "This is the preferred mixture Goodyear reports from practice. Claim 1 does not freeze the claim at that ratio; it extends to other proportions that produce a like result and to other lead salts or oxides named in the claim.",
      },
      {
        principle: "Stated heat window",
        formula: "212°F–350°F; best effect approaching 270°F",
        explanation:
          "The grant supplies an operating range and a qualitative preference, not a heat-time curve. It says exposure above 270°F must be very brief and that the material needs its cloth support while softened.",
      },
      {
        principle: "Layered support during processing",
        formula: "Laminate = gum + cotton-batting + gum",
        explanation:
          "The patent’s explanation is mechanical and process-specific: cotton-wool is put between gum layers, and the fabric stays on its cloth support during heating because the softened compound cannot support its own weight. It does not give a constitutive equation, tensile strength, or a modern polymer model.",
      },
    ],
    whyItMattersToday:
      "The grant is useful because it records a concrete early manufacturing program rather than a slogan: ingredients, preferred proportions, two fabrication routes, a cotton-wool laminate, a heat range, and limits on exposure above 270°F. Those details make the historical document legible without assigning it unprinted molecular mechanisms, performance figures, or credit for every later rubber product.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "The combining of the said gum with sulphur and with white lead, so as to form a triple compound, either in the proportions herein named or in any other within such limits as will produce a like result; and I will here remark that although I have obtained the best results from the carbonate of lead, other salts of lead or the oxides of that metal may be substituted therefor, and will produce a good effect. I therefore under this head claim the employment of either of the oxides or salts of lead in the place of the white lead in the above-named compound.",
      plainEnglish:
        "Claim 1 covers the three-part compound: the gum, sulphur, and white lead. It says the stated proportions are examples, permits other proportions that produce a like result, and expressly extends the lead component to other lead salts or oxides. The claim does not state a catalyst role or a molecular reaction.",
      keyInnovations: [
        "India-rubber, sulphur, and white-lead compound",
        "Alternative lead salts or oxides",
        "Result-producing composition range",
      ],
      legalSignificance:
        "Claim 1 is the composition claim: it reaches the three-part gum, sulphur, and lead compound, while expressly extending the lead component beyond carbonate of lead.",
    },
    {
      number: 2,
      isIndependent: true,
      originalText:
        "The formation of a fabric of the india-rubber by interposing layers of cotton-batting between those of the gum, in the manner and for the purpose above described.",
      plainEnglish:
        "Claim 2 covers the stated layered fabric: cotton-batting is placed between layers of gum in the manner the specification describes. It is a claim to that interposed batting construction, not a claim to every rubber-coated or waterproof textile.",
      keyInnovations: [
        "Cotton-batting interlayer",
        "Gum-layer fabric construction",
        "Repeated laminate process",
      ],
      legalSignificance:
        "Claim 2 is limited to the cotton-batting interlayer fabric described in the specification; it does not claim every rubber-coated textile.",
    },
    {
      number: 3,
      isIndependent: false,
      dependsOn: [1, 2],
      originalText:
        "In combination with the foregoing, the process of exposing the india-rubber fabric to the action of a high degree of heat, such as is herein specified, by means of which my improved compound is effectually changed in its properties so as to protect it from decomposition or deterioration by the action of those agents which have heretofore been found to produce that effect upon india-rubber goods.",
      plainEnglish:
        "With the preceding compound and fabric, this claim adds the specified high-heat exposure. The specification permits 212°F to 350°F, says the best effect approaches 270°F, and warns that exposure above 270°F must be brief.",
      keyInnovations: [
        "High-temperature thermal curing process",
        "212°F–350°F heat range",
        "Cloth-supported heat treatment",
      ],
      legalSignificance:
        "Claim 3 makes the heat-treatment step part of the claimed combination, tied to the patent's stated protection against deterioration of India-rubber goods.",
    },
  ],
  // The complete two-page grant has no drawing sheet or printed figure reference.
  // Modern educational simulations are not represented as archival drawings.
  drawings: [],
  historicalContext: {
    problemStatement:
      "The specification identifies the practical failure directly: ordinary India-rubber softened under solar or artificial heat, was injured by cold, and was dissolved by expressed oils, spirits of turpentine, and other essential oils.",
    priorArtLimitations: [
      "The source says that the expressed oils, spirits of turpentine, and other essential oils at common temperatures were the gum's usual solvents.",
      "Rubber spread on firmer cloth or leather could peel away under moderate force because the gum released the holding fiber.",
      "During high-heat treatment, the compound could soften enough that it required its supporting cloth and could not support its own weight.",
    ],
    breakthroughInsight:
      "Goodyear's stated move is a compound of India-rubber, sulphur, and white lead exposed to regulated heat. His preferred recipe is 25 parts India-rubber, 5 sulphur, and 7 white lead; the claimed method also uses cotton-wool interlayers and an oven or heated cylinder.",
    patentWars: [],
    civilizationalImpact:
      "The grant documents a reproducible approach to compounded, heat-treated India-rubber fabric: a formulation, fabrication routes, a laminate construction, a temperature range, and three claims. Those concrete process details are the historically useful record preserved here.",
  },
  tags: [
    "Charles Goodyear",
    "Vulcanization",
    "Rubber",
    "Polymers",
    "Materials Science",
    "Chemical Engineering",
    "19th Century",
    "Elastomers",
  ],
  stats: {
    totalClaims: 3,
    independentClaims: 2,
  },
};
