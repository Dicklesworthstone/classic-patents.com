import type { CuratedSpecificationEdition, CuratedSpecificationInlines } from "@/types/patent";

const literal = (text: string): CuratedSpecificationInlines => [{ kind: "text", text }];

/**
 * A continuous, manually prepared reading edition of US 105,338. The one-page
 * facsimile is a two-column specification with three printed claims and no
 * drawing sheet, figure, or figure reference.
 */
export const hyattCelluloidArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "186dd64b072c5a1182eac0c9c2cb4d2edb20f17296f3e5d934c9114ed684df82",
  preparedBy: "Classic Patents editorial agent (StormyCreek)",
  preparedAt: "2026-08-17",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE.",
        "JOHN W. HYATT, JR., AND ISAIAH S. HYATT, OF ALBANY, NEW YORK.",
        "IMPROVEMENT IN TREATING AND MOLDING PYROXYLINE.",
        "Specification forming part of Letters Patent No. 105,338, dated July 12, 1870.",
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "We, JOHN W. HYATT, Jr., and ISAIAH S. HYATT, both of Albany, in the county of Albany and State of New York, have invented a new and Improved Process of Dissolving ",
        },
        {
          kind: "term",
          text: "Pyroxyline",
          definition:
            "The period spelling for pyroxylin or soluble nitrocellulose: nitrated cellulose prepared in a grade that can be acted on by a suitable solvent.",
          label: "Period materials term",
        },
        { kind: "text", text: " and of Making " },
        {
          kind: "term",
          text: "Solid Collodion",
          definition:
            "A solid product made from pyroxylin after the solvent action, not merely a liquid collodion solution.",
          label: "Period materials term",
        },
        { kind: "text", text: ", of which the following is a specification:" },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        { kind: "text", text: "Our invention consists, first, of so preparing " },
        {
          kind: "term",
          text: "pyroxyline",
          definition:
            "Soluble nitrocellulose, here first reduced to a pulp so other powdered ingredients can be dispersed through it before solvent action begins.",
          label: "Period materials term",
        },
        {
          kind: "text",
          text: " that pigments and other substances in a powdered condition can be easily and thoroughly mixed therewith before the pyroxyline is subjected to the action of a solvent; secondly, of mixing with the pyroxyline so prepared any desirable pigment, coloring matter, or other material, and also any substance in a powdered state which may be vaporized or liquefied and converted into a solvent of pyroxyline by the application of heat; and, thirdly, of subjecting the compound so made to heavy pressure while heated, so that the least practicable proportion of solvent may be used in the production of solid collodion and its compounds.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "The following is a description of our process: First, we prepare the pyroxyline by grinding it in water until it is reduced to a fine pulp by means of a machine similar to those employed in grinding paper-pulp. Second, any suitable white or coloring pigment or dyes, when desired, are then mixed and thoroughly ground with the pyroxyline pulp, or any powdered or granulated material is incorporated that may be adapted to the purpose of the manufacture. While the ground pulp is still wet we mix therewith finely-pulverized ",
        },
        {
          kind: "term",
          text: "gum-camphor",
          definition:
            "Camphor prepared as a finely divided solid. The specification makes this the heat-activated solvent-forming ingredient rather than starting with a liquid camphor solution.",
          label: "Period materials term",
        },
        {
          kind: "text",
          text: " in about the proportions of one part (by weight) of the camphor to two parts of the pyroxyline when in a dry state. These proportions may be somewhat varied with good results. The gum-camphor may be comminuted by grinding in water, by pounding, or rolling; or, if preferred, the camphor may be dissolved in alcohol or ",
        },
        {
          kind: "term",
          text: "spirits of wine",
          definition:
            "Alcohol, usually ethanol, used here only as an optional way to prepare finely divided camphor before it is precipitated and the liquids are removed.",
          label: "Period chemical term",
        },
        {
          kind: "text",
          text: ", and then precipitated by adding water, the alcohol leaving the camphor and uniting with the water, when both the alcohol and the water may be drawn off, leaving the camphor in a very finely-divided state. After the powdered camphor is thoroughly mixed with the wet pyroxyline pulp and the other ingredients, we expel the water as far as possible by straining the mixture and subjecting it to an immense pressure in a perforated vessel. This leaves the mixture in a comparatively solid and dry state, but containing sufficient moisture to prevent the pyroxyline from burning or exploding during the remaining process. Third, the mixture is then placed in a mold of any appropriate form, which is heated by steam or by any convenient method, to from 150° to 300° Fahrenheit, to suit the proportion of camphor and the size of the mass, and is subjected to a heavy pressure in a hydraulic or other press. The heat, according to the degree used, vaporizes or liquefies the camphor, and thus converts it into a solvent of the pyroxyline. By introducing the solvent in the manner here described, and using heat to make the solvent active, and pressure to force it into intimate contact every particle of the pyroxyline, we are able to use a less proportion of this or any solvent which depends upon heat for its activity than has ever been known heretofore. After keeping the mixture under heat and pressure long enough to complete the solvent action throughout the mass it is cooled while still under pressure, and then taken out of the mold. The product is a solid about the consistency of ",
        },
        {
          kind: "term",
          text: "sole-leather",
          definition:
            "Dense leather used for shoe soles; the comparison describes the newly removed solid's toughness before later hardening.",
          label: "Period materials comparison",
        },
        {
          kind: "text",
          text: ", but which subsequently becomes as hard as horn or bone by the evaporation of the camphor. Before the camphor is evaporated the material is easily softened by heat, and may be molded into any desirable form, which neither changes nor appreciably shrinks in hardening.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "We are aware that camphor made into a solution with alcohol or other solvents of camphor has been used in a liquid state as a solvent of ",
        },
        {
          kind: "term",
          text: "xyloidine",
          definition:
            "A historical name for a nitrated-cellulose material. The inventors distinguish that older liquid-solvent use from the process they are claiming.",
          label: "Period materials term",
        },
        { kind: "text", text: ". Such use of camphor as a solvent of pyroxyline we disclaim." },
      ],
    },
    { kind: "heading", level: 2, text: "Claims" },
    { kind: "paragraph", inlines: literal("We claim as our invention—") },
    {
      kind: "claim",
      number: 1,
      inlines: literal("Grinding pyroxyline into a pulp, as and for the purpose described."),
    },
    {
      kind: "claim",
      number: 2,
      inlines: literal(
        "The use of finely-comminuted camphor-gum mixed with pyroxyline pulp, and rendered a solvent thereof by the application of heat, substantially as described.",
      ),
    },
    {
      kind: "claim",
      number: 3,
      inlines: literal(
        "In conjunction with such use of camphor-gum, the employment of pressure, and continuing the same until the mold and contents are cooled, substantially as described.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "JOHN W. HYATT, JR.\nISAIAH S. HYATT.\nWitnesses:\nWM. H. SLINGERLAND,\nO. M. HYATT.",
      ),
    },
  ],
};

/**
 * Renderer-compatible patent-local parallel readings. Keys are zero-based
 * source block indexes from `hyattCelluloidArchivalEdition.blocks`. Claims use
 * the canonical claim decoders and are deliberately excluded from this map.
 */
export const hyattCelluloidParallelReadings: Readonly<Record<number, readonly string[]>> = {
  1: [
    "The brothers identify themselves and define the subject as a process, not an already named article. Their title has two linked objectives: dissolve pyroxylin and make a solid collodion from it. In this document, pyroxyline is the material that will be pulped, mixed, heated, and pressed; solid collodion names the intended consolidated result. The formal opening does not itself set an operating condition, but it fixes the inventor names, Albany location, and the process-focused scope that the numbered claims later narrow.",
  ],
  2: [
    "This is the three-part program behind the claims. First, pyroxylin must be put into a condition that lets pigments and other powders disperse through it before a solvent acts. Second, the mixture may include color, other material, and a powder that heat can vaporize or liquefy into a pyroxylin solvent. Third, the hot compound is pressed, with the stated aim of using the smallest practicable solvent proportion. The paragraph therefore preserves both the sequence and the limitation: it is not simply adding camphor, but preparing a powder-filled material, activating a solvent with heat, and using pressure to obtain solid collodion with less solvent.",
  ],
  3: [
    "The detailed process begins with wet grinding: pyroxylin becomes a fine paper-pulp-like slurry. Pigments, dyes, or other suitable powders are then ground into that pulp. While it is still wet, finely divided gum-camphor is added at about one part camphor by weight to two parts dry pyroxylin, although the source allows some variation. It lists three ways to comminute camphor: grind it in water, pound or roll it, or dissolve it in alcohol or spirits of wine and precipitate it with water before drawing off both liquids. The mixed mass is strained and heavily pressed in a perforated vessel to remove as much water as possible, but it must retain enough moisture to stop the pyroxylin from burning or exploding in the rest of the operation. It then enters a suitable mold, receives steam or other heat between 150° and 300° Fahrenheit according to camphor proportion and mass size, and is heavily pressed hydraulically or otherwise. The stated causal chain is exact: heat vaporizes or liquefies camphor, making it a pyroxylin solvent; pressure forces that solvent into intimate contact with every pyroxylin particle. The material stays under heat and pressure until solvent action reaches the whole mass, then cools under pressure before removal. It emerges sole-leather-like, later hardens as camphor evaporates, and before that evaporation can be reheated and molded into a shape that neither changes nor appreciably shrinks while hardening.",
  ],
  4: [
    "This is a deliberate boundary on legal scope. Hyatt and Hyatt acknowledge a known technique in which camphor dissolved in alcohol or another camphor solvent had been used as a liquid solvent for xyloidine. They expressly disclaim that use of camphor as a solvent of pyroxyline. The disclaimer leaves the reader with the distinction emphasized by the rest of the specification: a finely divided camphor ingredient is mixed with pulp, then heat and pressure make it active within the molded mass, rather than beginning with the acknowledged liquid-solvent method.",
  ],
  6: [
    "The printed preamble announces the three formal claims that follow. It is not itself a claim, but it marks the transition from the explanatory process to the legal statements of what the inventors call their invention.",
  ],
  10: [
    "The printed names are the inventors' signature lines, followed by the two witnesses. They authenticate the conclusion of the one-page specification; they do not add a separate process step or claim limitation.",
  ],
};
