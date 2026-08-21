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
    paragraph(
      literal(
        "In practicing the invention I react upon a phenolic body with formaldehyde to obtain a reaction product which is capable of transformation by heat into an insoluble and infusible body, and then convert this reaction product, either alone or compounded with a suitable filling material, into such insoluble and infusible body by the combined action of heat and pressure. Preferably the water produced during the reaction or added with the reacting bodies is separated before hardening the reaction product. By proceeding in this manner a more complete control of the reaction is secured and other important advantages are attained as hereinafter set forth.",
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
        "The condensation product having either the oily or semi-plastic character may be subjected to further treatment as hereinafter described. By heating the said condensation product it is found to be transformed into a hard body, unaffected by moisture, insoluble in alcohol and acetone, infusible, and resistant to acids, alkalies and almost all ordinary reagents. This product is found to be suitable for many purposes, and may be employed either alone or in admixture with other solid, semi-liquid or liquid materials, as for instance ",
      ),
      term(
        "asbestos fiber",
        "Fibrous mineral filler adding extreme thermal and electrical arc resistance to molded phenolic components.",
      ),
      text(
        ", wood fiber, other fibrous or cellular materials, rubber, casein, lampblack, mica, mineral powders as zinc oxid, barium sulfate, cement, etc., pigments, dyes, nitrocellulose, abrasive materials, lime, sulfate of calcium, graphite, powdered horn or bone, pumice stone, talcum, starch, colophonium, resins or gums, slate dust, etc., in accordance with the particular uses for which it is intended, and in much the same manner as india rubber is compounded with the above-named and other materials to yield various valuable products. In compounding the condensation or dehydration product in this manner the desired materials are mixed with the same before submitting it to the final hardening operation below described.",
      ),
    ]),
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
        "A closed vessel under pressure, as the patent states, keeps volatile vapors from escaping during heating above approximately 90–100 °C; the patent does not specify an apparatus name or pressure range.",
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
    paragraph(literal("I claim:")),
    {
      kind: "claim",
      number: 1,
      inlines: literal(
        "The method of producing a hard, compact, insoluble and infusible condensation product of phenols and formaldehyde, which consists in reacting upon a phenolic body with formaldehyde, and then converting the product into a hard, insoluble and infusible body by the combined action of heat and pressure.",
      ),
    },
    {
      kind: "claim",
      number: 2,
      inlines: literal(
        "The method of making articles containing an insoluble and infusible condensation product of phenols and formaldehyde, which consists in reacting on a phenolic body with formaldehyde, producing thereby a reaction product capable of transformation by heat into an insoluble and infusible body, forming the article from said reaction product, and rendering the article hard, insoluble and infusible by application of heat and pressure.",
      ),
    },
    {
      kind: "claim",
      number: 3,
      inlines: literal(
        "The method of making articles containing an insoluble and infusible condensation product of phenols and formaldehyde, which consists in reacting on a phenolic body with formaldehyde, producing thereby a reaction product capable of transformation by heat into an insoluble and infusible body, separating water from the resulting product, forming the article from said reaction product, and rendering the article hard, insoluble and infusible by application of heat and pressure.",
      ),
    },
    {
      kind: "claim",
      number: 4,
      inlines: literal(
        "The method of making articles containing an insoluble and infusible condensation product of phenols and formaldehyde, which consists in reacting on a phenolic body with formaldehyde, producing thereby a reaction product capable of transformation by heat into an insoluble and infusible body, forming the article from said reaction product compounded with a filling material, and rendering the article hard, insoluble and infusible by application of heat and pressure.",
      ),
    },
    {
      kind: "claim",
      number: 5,
      inlines: literal(
        "In a method of making articles containing an insoluble and infusible condensation product of phenols and formaldehyde, the step which consists in causing the water to separate from the mixture of a phenolic body and an aqueous solution of formaldehyde by adding to said mixture a metallic salt soluble in water and adapted to cause such separation.",
      ),
    },
  ],
};

export const baekelandBakeliteParallelReadings: Readonly<Record<number, readonly string[]>> = {
  2: [
    "Baekeland identifies himself as the inventor, gives his Yonkers residence, and states that the specification concerns methods for making insoluble condensation products from phenols and formaldehyde.",
  ],
  3: [
    "He distinguishes the earlier application for treating fibrous or cellular material with phenolic material and formaldehyde, where the reaction produced substantial water that had to be expelled by drying.",
  ],
  4: [
    "The stated subject is the production of hard, insoluble, and infusible condensation products of phenols and formaldehyde.",
  ],
  5: [
    "The claimed practice reacts a phenolic body with formaldehyde, obtains a product that can later become insoluble and infusible under heat, optionally compounds it with filler, and preferably separates water before hardening under heat and pressure.",
  ],
  6: [
    "Heating phenol or its homologues with formaldehyde or its polymers yields two liquids that stratify: an aqueous supernatant and a heavier oily or viscous layer containing the first condensation or dehydration products; the layers can be separated and the oily liquid thickened by gentle heating.",
  ],
  7: [
    "The oily or semi-plastic condensation product can be heated into a hard body unaffected by moisture, insoluble in alcohol and acetone, infusible, and resistant to acids, alkalies, and almost all ordinary reagents; the patent lists possible fillers and compounds.",
  ],
  8: [
    "For direct molding, the product is placed in a mold under appropriate pressure and heated, with the patent giving about 110–140 degrees Celsius and one to two hours or less as a practical example; filler compounds may be molded or machined.",
  ],
  9: [
    "Small proportions of solvent may be added to the initial condensation product to make compounding or mixing easier before the mixture undergoes final baking or hardening.",
  ],
  10: [
    "The patent says higher temperatures shorten hardening time, while 100 degrees Celsius or lower can require days; small proportions of zinc chloride, other metallic chlorides, acids, or salts can accelerate hardening at lower temperatures.",
  ],
  11: [
    "The process can treat wood at its surface or throughout its mass, and the condensation product may be warmed or mixed with a small amount of solvent to improve penetration before the treated material is heated.",
  ],
  12: [
    "Above about 90–100 degrees Celsius, the final heating should occur in a closed vessel so formaldehyde vapors and similar vapors do not escape and create foam or air bubbles; pressure gives a more uniform result.",
  ],
  13: [
    "Cresol and other phenolic bodies, anhydrous formaldehyde solutions in phenol, or a polymer that releases anhydrous formaldehyde on heating may be substituted in the process.",
  ],
  14: [
    "The initial oily, viscous, or semi-plastic product may be made in an autoclave or by boiling under a return condenser; small amounts of acids, zinc chloride, calcium chloride, or another salt may aid condensation, and calcium chloride can absorb water and form two layers.",
  ],
  15: [
    "The specification then introduces five numbered claims defining the methods and the metallic-salt water-separation step.",
  ],
};
