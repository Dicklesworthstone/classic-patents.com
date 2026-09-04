import type {
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

const text = (value: string): CuratedSpecificationInlines => [{ kind: "text", text: value }];
const paragraph = (inlines: CuratedSpecificationInlines) => ({
  kind: "paragraph" as const,
  inlines,
});
const p = (value: string) => paragraph(text(value));

const term = (value: string, definition: string): CuratedSpecificationInline => ({
  kind: "term",
  text: value,
  definition,
});

const SOURCE_SHEET_PREVIEW = {
  src: "/patents/figures/us-157124-glidden-barbed-wire/source-sheet-1-v1.png",
  alt: "Complete upright source drawing sheet 1 of 1, containing Figs. 1-3 from US 157,124.",
  width: 2320,
  height: 3408,
} as const;

const FIGURES = {
  "Fig. 1": SOURCE_SHEET_PREVIEW,
  "Fig. 2": SOURCE_SHEET_PREVIEW,
  "Fig. 3": SOURCE_SHEET_PREVIEW,
} as const;

const figure = (
  label: keyof typeof FIGURES,
  sourceText: string = label,
): CuratedSpecificationInline => ({
  kind: "reference",
  text: sourceText,
  href: "#",
  referenceType: "figure",
  label: `Open complete source drawing sheet 1 of 1 for ${label} in US 157,124`,
  figurePreviews: [FIGURES[label]],
});

const claim = (number: number, value: string) => ({
  kind: "claim" as const,
  number,
  inlines: text(value),
});

// Definitions are attached to the exact historical occurrence and distinguish
// the source's component from later barbed-wire terminology.

/**
 * A continuous, manually prepared edition of the complete US 157,124
 * facsimile. Its first source sheet is the drawing sheet; the specification,
 * single claim, execution, and witnesses are on the second source sheet.
 */
export const gliddenBarbedWireArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "19c3874222e125ad1be8df9b1e4e59df4d7ff6452876588666a3c9ddf2cb0cc1",
  preparedBy: "Classic Patents editorial agent (GPT-5.6)",
  preparedAt: "2026-08-18",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE.",
        "JOSEPH F. GLIDDEN, OF DE KALB, ILLINOIS.",
        "IMPROVEMENT IN WIRE-FENCES.",
        "Specification forming part of Letters Patent No. 157,124, dated November 24, 1874; application filed October 27, 1873.",
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIGURES 1-3",
      title: "Wire-Fences",
      description: [
        {
          kind: "text",
          text: "J. F. GLIDDEN. Wire-Fences. No. 157,124. Patented Nov. 24, 1874. ",
        },
        figure("Fig. 1", "FIG. 1. "),
        figure("Fig. 2", "FIG. 2. "),
        figure("Fig. 3", "FIG. 3."),
        {
          kind: "text",
          text: " The drawing sheet carries the inventor, attorney, and witness signatures as handwriting; the pinned facsimile remains their authoritative visual record.",
        },
      ],
    },
    p("To all whom it may concern:"),
    p(
      "Be it known that I, JOSEPH F. GLIDDEN, of De Kalb, in the county of De Kalb and State of Illinois, have invented a new and valuable Improvement in Wire-Fences; and that the following is a full, clear, and exact description of the construction and operation of the same, reference being had to the accompanying drawings, in which—",
    ),
    paragraph([
      figure("Fig. 1", "Figure 1"),
      {
        kind: "text",
        text: " represents a side view of a section of fence exhibiting my invention. ",
      },
      figure("Fig. 2"),
      { kind: "text", text: " is a sectional view, and " },
      figure("Fig. 3"),
      { kind: "text", text: " is a perspective view, of the same." },
    ]),
    paragraph([
      {
        kind: "text",
        text: "This invention has relation to means for preventing cattle from breaking through wire-fences; and it consists in combining, with the twisted fence-wires, a short transverse wire, coiled or bent at its central portion about one of the wire strands of the twist, with its free ends projecting in opposite directions, the other wire strand serving to bind the ",
      },
      term(
        "spur-wire",
        "The short crosswise piece that Glidden bends around one long strand, leaving its two free ends projecting in opposite directions as the fence's spurs.",
      ),
      {
        kind: "text",
        text: " firmly to its place, and in position, with its spur ends perpendicular to the direction of the fence-wire, lateral movement, as well as vibration, being prevented. It also consists in the construction and novel arrangement, in connection with such a twisted fence-wire, and its spur-wires, connected and arranged as above described, of a ",
      },
      term(
        "twisting-key or head-piece",
        "The through-post handle and shank attached to the wire ends; turning it tightens the paired strands again when untwisting has loosened the spurs.",
      ),
      {
        kind: "text",
        text: " passing through the fence-post, carrying the ends of the fence-wires, and serving, when the spurs become loose, to tighten the twist of the wires, and thus render them rigid and firm in position.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "In the accompanying drawings, the letter B designates the fence-posts, the twisted fence-wire connecting the same being indicated by the letter A. C represents the ",
      },
      term(
        "twisting-key",
        "The handle and shank that pass through the fence-post and turn the attached wire ends, allowing the paired strands to be tightened again.",
      ),
      {
        kind: "text",
        text: ", the shank of which passes through the fence-post, and is provided at its end with an eye, b, to which the fence-wire is attached. The outer end of said key is provided with a transverse thumb-piece, c, which serves for its manipulation, and at the same time, abutting against the post, forms a shoulder or stop, which prevents the contraction of the wire from drawing the key through its perforation in said post.",
      },
    ]),
    p(
      "The fence-wire is composed at least of two strands, a and z, which are designed to be twisted together after the spur-wires have been arranged in place.",
    ),
    paragraph([
      { kind: "text", text: "The letter D indicates the " },
      term(
        "spur-wires",
        "Short transverse pieces bent around one strand, with free ends projecting from the fence wire in opposite directions as deterrent spurs.",
      ),
      {
        kind: "text",
        text: ". Each of these is formed of a short piece of wire, which is bent at its middle portion, as at E, around one only of the wire strands, this strand being designated by the letter a. In forming this middle bend or coil several turns are taken in the wire, so that it will extend along the strand-wire for a distance several times the breadth of its diameter, and thereby form a solid and substantial bearing-head for the spurs, which will effectually prevent them from vibrating laterally or being pushed down by cattle against the fence-wire. Although these spur-wires may be turned at once around the wire strand, it is preferred to form the central bend first, and to then slip them on the wire strand, arranging them at suitable distances apart.",
      },
    ]),
    p(
      "The spurs having thus been arranged on one of the wire strands are fixed in position and place by approaching the other wire strand z on the side of the bend from which the spurs extend, and then twisting the two strands a z together by means of the wire key above mentioned or otherwise. This operation locks each spur wire at its allotted place, and prevents it from moving therefrom in either direction. It clamps the bend of the spur-wire upon the wire a, thereby holding it against rotary vibration. Finally, the spur ends extending out between the strands on each side, and where the wires are more closely approximated in the twist, form shoulders or stops, s, which effectually prevent such rotation in either direction.",
    ),
    p(
      "Should the spurs, from the untwisting of the strands, become loose and easily movable on their bearings, a few turns of the twisting-key will make them firm, besides straightening up the fence-wire.",
    ),
    p("What I claim as my invention, and desire to secure by Letters Patent, is—"),
    claim(
      1,
      "A twisted fence-wire having the transverse spur-wire D bent at its middle portion about one of the wire strands a of said fence-wire, and clamped in position and place by the other wire strand z, twisted upon its fellow, substantially as specified.",
    ),
    p("JOSEPH F. GLIDDEN."),
    p("Witnesses: G. L. CHAPIN. J. H. ELLIOTT."),
  ],
};

export const gliddenBarbedWireParallelReadings: Readonly<Record<number, readonly string[]>> = {
  2: [
    "This is the standard notice at the beginning of a United States patent. It identifies the document as a statement meant for any reader who may need to know what the inventor is claiming.",
  ],
  3: [
    "Glidden identifies himself and his home in De Kalb, Illinois. He promises a full account of both construction and operation, and says the drawings form part of that account.",
  ],
  4: [
    "The drawing sheet shows the invention at three scales. Figure 1 is a fence section between posts, Figure 2 cuts across the wire, and Figure 3 enlarges the relationship between the two twisted strands and one short spur wire.",
  ],
  5: [
    "The central construction is not simply a sharp wire attached to a fence. A short crosswise wire is bent or coiled around one strand of a pair. Its ends project in opposite directions, while the second strand of the pair is twisted close enough to hold that crosswise piece in place.",
    "Glidden calls the crosswise piece a spur-wire. The paired strands are meant to stop both kinds of unwanted movement: sliding along the fence wire and turning so that the spur points no longer face across the fence. He also specifies a through-post key that can retighten the twist if it loosens.",
  ],
  6: [
    "Letters A, B, and C identify the fence wire, fence posts, and twisting key in the drawing. The key is a shank passing through the post. Its eye holds the end of the fence wire; its outer thumb-piece supplies a handhold and bears against the post so tension cannot pull the key inward through its hole.",
  ],
  7: [
    "The fence wire has at least two strands, called a and z. Glidden arranges the spur wires first and twists the two long strands together afterward. That sequence is essential: the second strand becomes the clamp that fixes the spur wire against the first strand.",
  ],
  8: [
    "Each spur wire is a short piece bent at its middle around strand a. Several turns produce a longer coil, or bearing-head, rather than a single loose loop. That longer bearing is intended to keep the projecting ends from being shaken sideways or pressed down against the fence wire by cattle.",
    "Glidden allows the spur wire to be wrapped directly around the strand, but says he prefers to form its central bend first and then slip it onto the strand at chosen intervals. The patent preserves that practical assembly option while keeping the locking arrangement central.",
  ],
  9: [
    "After the spur wires are placed on strand a, the other strand approaches from the side opposite the projecting spurs and the two long strands are twisted together. The resulting geometry grips the central bend, blocks the spur wire from travelling along the fence, and resists its rotation.",
    "The ends of the crosswise spur emerge between the two long strands. Where those strands draw close in the twist, they make physical shoulders or stops beside the spur ends. Those stops are the source-described reason the spur cannot rotate either way.",
  ],
  10: [
    "Glidden anticipates that repeated service may let the paired strands untwist enough for a spur to become loose. Turning the through-post key adds twist again, firming the spur positions and straightening the fence wire. The adjustment mechanism is described in the body, although the single printed claim focuses on the twisted wire and clamped spur.",
  ],
  11: [
    "The claim protects a particular combination: a twisted fence wire; a transverse spur wire bent around one strand; and the other strand twisted around its fellow so it clamps that spur in position. The final words limit the claim to the construction stated in the specification, rather than every possible barbed fence.",
  ],
  13: [
    "Glidden signs the specification. The signature is the inventor's execution of the document, not another technical feature.",
  ],
  14: [
    "G. L. Chapin and J. H. Elliott are listed as witnesses to the execution of the patent instrument.",
  ],
};
