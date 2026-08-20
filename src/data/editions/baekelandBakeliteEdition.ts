import type {
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

const literal = (text: string): CuratedSpecificationInlines => [{ kind: "text", text }];
const text = (value: string): CuratedSpecificationInline => ({ kind: "text", text: value });
const paragraph = (inlines: CuratedSpecificationInlines) => ({
  kind: "paragraph" as const,
  inlines,
});

const term = (termText: string, definition: string): CuratedSpecificationInline => ({
  kind: "term",
  text: termText,
  definition,
});

export const baekelandBakeliteClaims = [
  {
    number: 1,
    text: "The method of producing a hard, compact, insoluble and infusible condensation product of phenols and formaldehyde, which consists in reacting upon a phenolic body with formaldehyde, and then converting the product into a hard, insoluble and infusible body by the combined action of heat and pressure.",
  },
  {
    number: 2,
    text: "The method of making articles containing an insoluble and infusible condensation product of phenols and formaldehyde, which consists in reacting on a phenolic body with formaldehyde, producing thereby a reaction product capable of transformation by heat into an insoluble and infusible body, forming the article from said reaction product, and rendering the article hard, insoluble and infusible by application of heat and pressure.",
  },
  {
    number: 3,
    text: "The method of making articles containing an insoluble and infusible condensation product of phenols and formaldehyde, which consists in reacting on a phenolic body with formaldehyde, producing thereby a reaction product capable of transformation by heat into an insoluble and infusible body, separating water from the resulting product, forming the article from said reaction product, and rendering the article hard, insoluble and infusible by application of heat and pressure.",
  },
  {
    number: 4,
    text: "The method of making articles containing an insoluble and infusible condensation product of phenols and formaldehyde, which consists in reacting on a phenolic body with formaldehyde, producing thereby a reaction product capable of transformation by heat into an insoluble and infusible body, forming the article from said reaction product compounded with a filling material, and rendering the article hard, insoluble and infusible by application of heat and pressure.",
  },
  {
    number: 5,
    text: "In a method of making articles containing an insoluble and infusible condensation product of phenols and formaldehyde, the step which consists in causing the water to separate from the mixture of a phenolic body and an aqueous solution of formaldehyde by adding to said mixture a metallic salt soluble in water and adapted to cause such separation.",
  },
] as const;

export const baekelandBakeliteArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "91b63f1cfe7c4a24739ea63c9d45caa8059e74010ae3a2191bed97616a384dc5",
  preparedBy: "Classic Patents editorial agent (SteelNeedle)",
  preparedAt: "2026-08-19",
  completeFacsimileReviewed: true,
  drawingStatus: {
    kind: "no-drawings-in-facsimile",
    evidence:
      "United States Patent 942,699 as granted on December 7, 1909 consists of three pages of printed specification and five method claims without separate drawing sheets.",
  },
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE.",
        "LEO H. BAEKELAND, OF YONKERS, NEW YORK.",
        "METHOD OF MAKING INSOLUBLE PRODUCTS OF PHENOL AND FORMALDEHYDE.",
        "942,699.",
        "Specification of Letters Patent. Patented Dec. 7, 1909.",
        "Application filed July 13, 1907. Serial No. 383,684.",
        "No Drawing.",
      ],
    },
    {
      kind: "heading",
      level: 2,
      text: "Specification of Letters Patent",
    },
    paragraph([
      text("To all whom it may concern: Be it known that I, "),
      term(
        "LEO H. BAEKELAND",
        "Belgian-American industrial chemist (1863–1944) who invented Velox photographic paper and Bakelite, creating the modern synthetic plastics industry.",
      ),
      text(
        ", a citizen of the United States, residing at Snug Rock, Harmony Park, Yonkers, in the county of Westchester and State of New York, have invented certain new and useful Improvements in Methods of Making Insoluble Condensation Products of Phenols and Formaldehyde, of which the following is a specification.",
      ),
    ]),
    paragraph([
      text(
        "In my prior application Ser. No. 358,156, filed February 18, 1907, I have described and claimed a method of ",
      ),
      term(
        "indurating",
        "Hardening and densifying porous fibrous or cellular materials such as wood, paper, or textile fibers.",
      ),
      text(
        " fibrous or cellular materials which consists in impregnating or mixing them with a phenolic body and formaldehyde, and causing the same to react within the body of the material to yield an insoluble indurating condensation product, the reaction being accelerated if desired by the use of heat or condensing agents. In the course of this reaction considerable quantities of water are produced, and a drying operation is resorted to to expel it.",
      ),
    ]),
    paragraph(
      literal(
        "The present invention relates to the production of hard, insoluble and infusible condensation products of phenols and formaldehyde.",
      ),
    ),
    paragraph([
      text("According to this invention "),
      term(
        "phenols",
        "Carbolic acid (C₆H₅OH) or its chemical homologues such as cresols and xylenols.",
      ),
      text(" and "),
      term(
        "formaldehyde",
        "Methanal (HCHO), an active aldehyde reagent supplying methylene crosslinking bridges (-CH₂-).",
      ),
      text(
        " are caused to react upon each other, the water which is present in the reagents or produced by the reaction is separated from the mass, and the resulting product is thereafter transformed by heat, preferably in presence of suitable condensing agents, into a hard, compact, insoluble and ",
      ),
      term(
        "infusible",
        "Thermoset polymer state incapable of melting or flowing upon reheating due to irreversible 3D covalent crosslinking.",
      ),
      text(
        " body, which is resistant to oils, water, alcohols and other solvents and chemical reagents.",
      ),
    ]),
    {
      kind: "heading",
      level: 2,
      text: "Two-Phase Reaction & Dehydration Control",
    },
    paragraph(
      literal(
        "I have found that by carrying out the operation in two distinct phases, or in other words by eliminating the water from the initial condensation or dehydration product before transforming the same into the final hard and insoluble product, important advantages are attained and improved results are secured. In the first place, the elimination of water from the initial product is readily accomplished, and this product is easily manipulated, molded, pressed or otherwise formed into any desired shape, or compounded with other materials; in the second place, the final transformation into the hard and insoluble body is accomplished without the evolution of any considerable quantity of water, wherefore the product is compact, homogeneous, and free from cracks or fissures; and in the third place the reaction is under complete control, and the properties of the final product may be varied as desired.",
      ),
    ),
    paragraph([
      text(
        "If a mixture of phenol or its homologues and formaldehyde or its polymers be heated, alone or in presence of catalytic or ",
      ),
      term(
        "condensing agents",
        "Acidic or alkaline catalysts such as ammonia, zinc chloride, or hydrochloric acid that accelerate the step-growth condensation.",
      ),
      text(
        ", the formaldehyde being present in about the molecular proportion required for the reaction or in excess thereof, that is to say, approximately equal volumes of commercial phenol or cresylic acid and commercial formaldehyde, these bodies react upon each other and yield a product consisting of two liquids which will separate or stratify on standing. The lighter or supernatant liquid is an aqueous solution, which contains the water resulting from the reaction or added with the reagents, whereas the heavier liquid is oily or viscous in character and contains the first products of chemical condensation or dehydration. The two liquids are readily separated, and the aqueous solution may be rejected or the water may be eliminated by evaporation. The oily liquid obtained as above described is found to be soluble in or miscible with alcohol, acetone, phenol and similar solvents or mixtures of the same. This oily liquid may be further submitted to heat on a water- or steam-bath so as to thicken it slightly and to drive off any water which might still be mixed with it. If the reaction be permitted to proceed further the condensation product may acquire a more viscous character, becoming gelatinous, or semi-plastic in consistence. This modification of the product is insoluble or incompletely soluble in alcohol but soluble or partially soluble in acetone or in a mixture of acetone and alcohol.",
      ),
    ]),
    paragraph([
      text(
        "The condensation product having either the oily or semi-plastic character may be subjected to heat, or to the combined action of heat and pressure, in order to convert it into the final hard, insoluble and infusible product, which is not affected by water, alcohol, acetone or other ordinary reagents. This product is found to be suitable for many purposes, and may be employed either alone or in admixture with other solid, semi-liquid or liquid materials, as for instance ",
      ),
      term(
        "asbestos fiber",
        "Fibrous mineral filler adding extreme thermal and electrical arc resistance to molded phenolic components.",
      ),
      text(
        ", wood fiber, other fibrous or cellular materials, rubber, casein, lampblack, mica, mineral powders as zinc oxid, barium sulfate, pigments, dyes, nitrocellulose, abrasive materials, lime, sulfate of calcium, graphite, powdered horn or bone, pumice stone, talcum, starch, colophonium, resins or gums, slate dust, etc., in accordance with the particular uses for which it is intended, and in much the same manner as india rubber is compounded with the above-named and other materials to yield various valuable products. In compounding the condensation or dehydration product in this manner the desired materials are mixed with the same before submitting it to the final hardening operation below described.",
      ),
    ]),
    {
      kind: "heading",
      level: 2,
      text: "Curing Conditions & Autoclave Pressure Containment",
    },
    paragraph(
      literal(
        "In order to convert the condensation or dehydration product into the final product above-described I may subject it to a temperature which will depend upon the specific results sought. If it be desired to mold the material directly the condensation product is poured or pressed into a suitable mold and is submitted therein while maintaining appropriate pressure to a suitable temperature, say about 110-140° C.; under these conditions there is obtained in from one to two hours or less a hard, compact, perfectly homogeneous mass similar in its properties to hard rubber or to ivory, insoluble in alcohol, acetone, and resistant to heat or infusible, and resistant to moisture and most chemical reagents as above described. In case the product be first mixed with asbestos fiber, rubber, powdered substances or other materials as above described, and heat be thereafter applied a compound is obtained in the form of hard masses containing the insoluble condensation product described. Such masses may be produced directly in any desired form by the use of a suitable mold, or they may be produced in a block or irregular mass which may be cut, sawed, turned or otherwise manipulated to any suitable form or size.",
      ),
    ),
    paragraph(
      literal(
        "Small proportions of solvents may be added to the initial condensation product in order to facilitate the compounding or mixing of the same, the resulting mixture being then submitted to the final baking or hardening process as described.",
      ),
    ),
    paragraph(
      literal(
        "While I have indicated above a practical hardening temperature of 110-140° C. it should be understood that higher temperatures may be employed, in which case the time required for the hardening process is considerably reduced; the hardening may also be conducted at 100° C. and even at lower temperatures, more particularly for impregnating fibrous or cellular materials, but in this case the hardening is found to be very slow and some days may be required for its completion. The hardening may be greatly accelerated by adding small proportions of catalytic agents, or so-called condensing agents, as for instance zinc chlorid, other metallic chlorids, acids or salts. In case such condensing agents are added the hardening occurs rapidly at relatively low temperatures.",
      ),
    ),
    paragraph(
      literal(
        "The mode of application or compounding of the condensation product will of course depend upon the results sought. For treating or indurating wood, the surface only may be treated, or it may be treated throughout its mass substantially as described in my copending application above referred to; the treated material is thereafter submitted to heat, some condensing agent being added if desired. For facilitating the penetration of wood or the like the condensation product may be slightly heated to render it more mobile, or small proportions of suitable solvents may be added.",
      ),
    ),
    paragraph([
      text(
        "The final heating or baking by which the condensation product, alone or compounded, is converted into an insoluble body should be effected in a ",
      ),
      term(
        "closed vessel in case the temperature exceed 90°-100° C.",
        "The pressurized autoclave apparatus ('Bakelizer') where super-atmospheric air or steam pressure (50–100 psi) suppresses the boiling of volatile water and formaldehyde, preventing foam and porosity.",
      ),
      text(
        "; without this precaution vapors of formaldehyde and the like escape causing foam and air bubbles; furthermore the loss of the reagents and the disturbance of the proportions between them prevents obtaining a product of maximum hardness and uniform texture. In a closed vessel under pressure the operation proceeds with precision, and a uniform result may be always obtained.",
      ),
    ]),
    paragraph(
      literal(
        "Instead of ordinary phenol I may use cresol and its homologues, or other phenolic bodies. If desired I may employ in place of commercial formaldehyde a solution of anhydrous formaldehyde in phenol; or the polymer of formaldehyde which on heating splits up into anhydrous formaldehyde, may be used.",
      ),
    ),
    paragraph(
      literal(
        "The initial oily, viscous or semi-plastic condensation product, may be obtained in various ways, as for instance by digesting a suitable mixture of phenol and formaldehyde in an autoclave, or merely by boiling a mixture of the same in an open vessel provided with a return condenser in order to avoid loss and variation of proportions. A very small proportion of mineral or organic acid, or of zinc chlorid, calcium chlorid, or other salt or agent favoring condensation may be added to the mixture, the proportion being in all cases so small as to avoid such energetic reaction as will not permit the intermediate oily, viscous or semi-plastic condensation product to be obtained. Or I may add a solid salt as for instance calcium chlorid to the mixture of phenol and formaldehyde in which case the calcium chlorid immediately absorbs water and forms two distinct layers, the lower one being formed by a very dense aqueous solution of calcium chlorid, the upper one by the dehydrated mixture.",
      ),
    ),
    {
      kind: "heading",
      level: 2,
      text: "Claims",
    },
    paragraph(literal("I claim:")),
    {
      kind: "claim",
      number: 1,
      inlines: literal(baekelandBakeliteClaims[0].text),
    },
    {
      kind: "claim",
      number: 2,
      inlines: literal(baekelandBakeliteClaims[1].text),
    },
    {
      kind: "claim",
      number: 3,
      inlines: literal(baekelandBakeliteClaims[2].text),
    },
    {
      kind: "claim",
      number: 4,
      inlines: literal(baekelandBakeliteClaims[3].text),
    },
    {
      kind: "claim",
      number: 5,
      inlines: literal(baekelandBakeliteClaims[4].text),
    },
  ],
};

export const baekelandBakeliteParallelReadings: Readonly<Record<number, readonly string[]>> = {
  2: [
    "Leo H. Baekeland of Yonkers, New York introduces his master chemical invention: the synthesis and controlled pressure-curing of phenol-formaldehyde condensation products to create the first fully synthetic thermosetting plastic (Bakelite).",
  ],
  3: [
    "Baekeland references his prior patent application (Serial No. 358,156) for indurating cellular wood or paper, noting that the condensation reaction produces substantial quantities of water that must be removed.",
  ],
  4: [
    "The primary objective is the production of a hard, completely insoluble, and infusible (thermoset) synthetic solid from reacting carbolic acid (phenol) with methanal (formaldehyde).",
  ],
  5: [
    "The core process reacts phenolic bodies with formaldehyde, separates the water byproduct to isolate the intermediate prepolymer, and cures the resin under elevated heat and catalysts into a solvent-resistant thermoset mass.",
  ],
  7: [
    "Separating the synthesis into two controlled phases provides three crucial advantages: easy mechanical molding of the dehydrated prepolymer, bubble-free and crack-free final curing without trapped steam, and exact chemical control over material properties.",
  ],
  8: [
    "Reacting equal volumes of phenol and formaldehyde generates two distinct liquid phases: a supernatant aqueous layer carrying excess water, and a dense, viscous lower layer of fusible A-stage resole resin soluble in alcohol and acetone.",
  ],
  9: [
    "The intermediate prepolymer resin can be compounded with reinforcing fillers like asbestos fiber, wood flour, mica, graphite, or pigments, mimicking the compounding of natural rubber but yielding a rigid, non-flammable structural composite.",
  ],
  11: [
    "The prepolymer resin or compounded molding compound is pressed into precision steel molds and cured at 110–140 °C under pressure for 1–2 hours, transforming into a dense, ivory-like, chemically inert solid.",
  ],
  12: [
    "Small quantities of volatile solvents may be introduced into the initial resin to adjust fluidity and improve blending with finely divided fibrous fillers before final baking.",
  ],
  13: [
    "Curing temperatures of 110–140 °C provide rapid curing, while lower temperatures require several days; the curing rate is accelerated by acidic or basic condensing catalysts like zinc chloride or metallic salts.",
  ],
  14: [
    "The resin may be impregnated into the cellular pores of timber, fiberboard, or electrical insulation, where subsequent heating solidifies the plastic directly inside the structural matrix.",
  ],
  15: [
    "Crucially, curing above 90–100 °C must occur inside a sealed, pressurized autoclave ('Bakelizer'); external pressure (50–100 psi) counteracts the vapor pressure of water and formaldehyde, preventing catastrophic foaming, porosity, and warping.",
  ],
  16: [
    "The invention encompasses homologous phenolic compounds such as cresols and xylenols, as well as anhydrous formaldehyde solutions or paraformaldehyde polymers.",
  ],
  17: [
    "The initial intermediate resin can be prepared in an autoclave or reflux condenser, and dehydration can be driven by adding hygroscopic salts like calcium chloride to rapidly salt out and separate the organic phase.",
  ],
  19: [
    "Formal statement transitioning from the descriptive chemical specification into the legally defining enumerated method claims.",
  ],
};
