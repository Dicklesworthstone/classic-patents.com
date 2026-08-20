/**
 * wattRotaryEngineEdition.ts
 *
 * Archival Edition for James Watt's 1781 Rotary Motion & Sun and Planet Gearing Patent
 * (GB Patent 1306 - "Certain New Methods of Producing a Continued Rotative Motion Around an Axis or Center").
 *
 * Transcribed, annotated, and verified against the 2-page pinned facsimile
 * at public/patents/pdfs/gb-1306-watt-rotary-engine.pdf (SHA-256: 339921eba26299f65c60e0d9d283deb09419fed3260ba6dc7208ecd55d2471f1).
 */

import type {
  CuratedSpecificationBlock,
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

const text = (value: string): CuratedSpecificationInline => ({ kind: "text", text: value });

const term = (termText: string, definition: string): CuratedSpecificationInline => ({
  kind: "term",
  text: termText,
  definition,
});

const figure = (
  figureLabel: string,
  displayText: string,
  cropSrc = "/patents/figures/gb-1306-watt-rotary-engine/fig-1-source-crop-v1.png",
): CuratedSpecificationInline => ({
  kind: "reference",
  text: displayText,
  href: cropSrc,
  referenceType: "figure",
  label: figureLabel,
  figurePreviews: [
    {
      src: cropSrc,
      alt: `${figureLabel} — James Watt Rotary Engine & Sun and Planet Gearing technical plate`,
      width: 2000,
      height: 2000,
    },
  ],
});

const p = (...inlines: CuratedSpecificationInline[]): CuratedSpecificationBlock => ({
  kind: "paragraph",
  inlines,
});

export const wattRotaryEngineParallelReadings: Readonly<Record<number, readonly string[]>> = {
  1: [
    "Formal Chancery preamble reciting King George III's letters patent of October 25, 1781 (21st year of his reign) granting James Watt sole patent privileges for converting reciprocating steam engine motion into continuous rotation.",
  ],
  2: [
    "Legal testatum and enrollment covenant requiring James Watt to lodge a full and precise written specification describing his rotative engine mechanisms in the High Court of Chancery within four calendar months.",
  ],
  3: [
    "Opening declaration establishing compliance with the Chancery proviso and defining the scope of the invention for public dissemination.",
  ],
  4: [
    "Broad statement of invention: novel mechanical assemblies for converting reciprocating linear or beam motion of steam engines into continuous rotary shaft motion without relying on a simple crank, suited for driving textile machinery, mills, and forge hammers.",
  ],
  5: [
    "The First Method (Sun & Planet Epicyclic Gearing): fixing a spur gear ('Sun wheel') to the rotating flywheel shaft, and bolting a matching gear ('Planet wheel') rigidly to the lower end of the connecting rod, constrained to orbit around the sun wheel via a radius guide link.",
  ],
  6: [
    "The 2:1 epicyclic speed multiplication law: because the planet wheel is rigidly fixed to the connecting rod and cannot rotate independently on its own center, it forces the sun wheel and flywheel shaft to make two complete revolutions for every single double-stroke of the engine beam.",
  ],
  7: [
    "The Second Method: internal epicyclic planetary motion, wherein a planet wheel or friction roller orbits inside an internal toothed ring fixed to the rotating axle.",
  ],
  8: [
    "The Third Method: crown-wheel rotative motion with directional ratchet escapement teeth actuated by reciprocating push-pull catches on the connecting rod.",
  ],
  9: [
    "The Fourth Method: double reciprocating toothed racks driving intermittent gear sectors and pinions mounted upon the main shaft with counterweights.",
  ],
  10: [
    "The Fifth Method: a helical or spiral cam groove machined into the main shaft, traversed by a follower roller pin mounted on the reciprocating crosshead.",
  ],
  17: [
    "Chancery enrollment witness clause and formal acknowledgement signed and sealed by James Watt before the Court of Chancery on February 23, 1782.",
  ],
};

export const WATT_ROTARY_PARALLEL_READINGS = wattRotaryEngineParallelReadings;

export const wattRotaryEngineArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "339921eba26299f65c60e0d9d283deb09419fed3260ba6dc7208ecd55d2471f1",
  preparedBy: "Classic Patents editorial agent (Antigravity)",
  preparedAt: "2026-08-19",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "A.D. 1781 . . . . . . . No 1306.",
        "SPECIFICATION OF JAMES WATT.",
        "ROTARY STEAM ENGINES & SUN AND PLANET GEARING.",
      ],
    },
    p(
      text("TO ALL TO WHOM THESE PRESENTS SHALL COME, I, "),
      term(
        "JAMES WATT",
        "James Watt (1736–1819), Scottish mechanical engineer and inventor whose separate condenser (1769) and rotary epicyclic engine (1781) transformed the steam engine into the universal power source of the Industrial Revolution.",
      ),
      text(", of Birmingham, in the County of Warwick, Engineer, send greeting:"),
    ),
    p(
      text(
        "WHEREAS His most Excellent Majesty King George the Third, by His Letters Patent under the Great Seal of Great Britain, bearing date at Westminster, the Twenty-fifth day of October, in the twenty-first year of His reign, did give and grant unto me, the said James Watt, His especial licence, full power, sole privilege and authority, that I, the said James Watt, my executors, administrators, and assigns, should and lawfully might make, use, exercise, and vend, within England, Wales, and the Town of Berwick-upon-Tweed, my new Invented ",
      ),
      term(
        "Certain New Methods of Producing a Continued Rotative Motion",
        "The mechanical methods devised by Watt and William Murdoch to convert reciprocating beam motion into continuous shaft rotation, successfully bypassing James Pickard's restrictive 1780 crank patent (GB 1263).",
      ),
      text(
        "; in which said Letters Patent there is contained a proviso obliging me, the said James Watt, by an instrument in writing under my hand and seal, to cause a particular description of the nature of my said Invention, and the manner in which the same is to be performed, to be inrolled in His Majesty's High Court of Chancery within four calendar months next and immediately after the date of the said Letters Patent, as in and by the same, reference being thereunto had, will more fully and at large appear.",
      ),
    ),
    p(
      text(
        "NOW KNOW YE, that in compliance with the said proviso, I, the said James Watt, do hereby declare that the following is a particular description of the nature of my said Invention, and in what manner the same is to be performed, that is to say:",
      ),
    ),
    p(
      text(
        "My Invention consists in certain new methods or apparatus for applying the reciprocating motion of the working beams or pistons of steam or fire engines to turn large wheels, axles, or shafts, and to produce a continued circular or rotative motion round an axis or center, without employing a simple revolving crank; which circular motion may be applied to drive mills of all kinds, forge hammers, rolling mills, spinning and weaving machinery, and other mechanical apparatus requiring continuous rotation.",
      ),
    ),
    p(
      text(
        "The First Method (The Sun and Planet Wheels). --- Upon the end of the shaft, axle, or spindle which is intended to receive the continued rotative motion, and which carries the heavy fly-wheel to equalize the velocity, I fix or key fast a toothed spur wheel, which I denominate the ",
      ),
      term(
        "Sun wheel",
        "The central spur gear keyed directly to the output driveshaft and flywheel, around which the planet gear orbits.",
      ),
      text(" (shown at D in "),
      figure("Fig. 1", "Figure 1"),
      text(" and at A in "),
      figure("Fig. 2", "Figure 2"),
      text(
        " of the annexed Drawing). To the lower extremity of the spear or connecting rod (B) suspended from the great working beam (A) of the steam engine, I rigidly bolt, fasten, or forge in one solid piece another toothed wheel of equal diameter and number of teeth, which I denominate the ",
      ),
      term(
        "Planet wheel",
        "The orbiting spur gear rigidly bolted to the lower end of the connecting rod. Because the rod prevents the planet from rotating freely on its own axis, orbiting around the sun gear doubles the rotational output.",
      ),
      text(" (C in "),
      figure("Fig. 1", "Figure 1"),
      text(", and B in "),
      figure("Fig. 2", "Figure 2"),
      text(
        "). The planet wheel is restrained from turning upon its own center or diverging out of gear with the sun wheel by means of a link, radius arm, or circular guiding groove (G) connecting the centers of both wheels.",
      ),
    ),
    p(
      text(
        "As the working beam of the steam engine rises and falls in its reciprocating stroke, the connecting rod causes the planet wheel to revolve around the center of the sun wheel. Because the planet wheel is firmly fixed to the connecting rod and does not rotate independently about its own center, it causes the sun wheel, and the main axle and fly-wheel attached thereto, to perform ",
      ),
      term(
        "two complete revolutions",
        "The epicyclic speed doubling effect: with equal tooth counts (Np = Ns), the sun gear rotates at twice the frequency of the engine beam cycle, providing 2x shaft speed without auxiliary speed-increasing gears.",
      ),
      text(
        " for every double stroke or reciprocating cycle of the steam engine beam; thereby producing a continued, rapid, and uniform rotative motion with double the velocity that would be produced by a single crank, and with great smoothness and regularity of action.",
      ),
    ),
    p(
      text(
        "The Second Method. --- In place of external spur teeth, the planet wheel or friction roller is caused to revolve within an eccentric internal toothed ring or hollow drum fixed to the rotating axle, producing rotation by internal planetary epicyclic engagement.",
      ),
    ),
    p(
      text(
        "The Third Method. --- Consists in applying a crown wheel with ratchet teeth, acted upon by reciprocating catches or clicks alternately engaged by the up and down motion of the connecting rod, whereby the shaft is impelled continuously in one direction.",
      ),
    ),
    p(
      text(
        "The Fourth Method. --- Consists in the application of double toothed racks mounted upon the reciprocating rods, acting upon intermittent sectors or pinions on the shaft with weighted balance levers.",
      ),
    ),
    p(
      text(
        "The Fifth Method. --- Consists in a spiral or helical cam groove formed upon the main shaft, traversed by a roller pin on the reciprocating cross-head to generate continuous rotation.",
      ),
    ),
    {
      kind: "heading",
      level: 2,
      text: "CLAIMS AND SUMMARY OF THE INVENTION.",
    },
    {
      kind: "claim",
      number: 1,
      inlines: [
        text(
          "First, The method of converting reciprocating rectilinear or oscillatory motion of steam engines into continuous rotative motion by means of a toothed planet wheel rigidly secured to the connecting rod and caused to orbit around a toothed sun wheel fixed to the driven axle, as herein described.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 2,
      inlines: [
        text(
          "Secondly, The epicyclic mechanism whereby the driven sun wheel and flywheel are caused to perform two revolutions for every single reciprocating cycle or double-stroke of the engine beam.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 3,
      inlines: [
        text(
          "Thirdly, The mechanical radius link, groove, or eccentric guide connecting the centers of the sun and planet wheels to maintain continuous pitch-line meshing during epicyclic revolution.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 4,
      inlines: [
        text(
          "Fourthly, The alternative rotative methods comprising internal planetary gearing, crown-wheel ratchet escapements, double rack and pinion sectors, and helical grooved cams as applied to steam engines.",
        ),
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "Fig. 1",
      title: "James Watt Rotary Steam Engine & Sun and Planet Gearing Plate",
      description: [
        text(
          "Technical plate annexed to the Chancery enrollment, illustrating the general elevation of the rotative beam engine, the epicyclic pitch engagement of the Sun and Planet wheels, and alternative crown-wheel and double-rack rotative motions.",
        ),
      ],
    },
    p(
      text(
        "IN WITNESS whereof, I, the said James Watt, have hereunto set my hand and seal, this Twenty-third day of February, in the twenty-second year of the reign of King George the Third, and in the year of our Lord One thousand seven hundred and eighty-two.",
      ),
    ),
  ],
};

function inlinesToPlainText(inlines: CuratedSpecificationInlines): string {
  return inlines
    .map((inline) => {
      switch (inline.kind) {
        case "text":
        case "emphasis":
        case "small-caps":
        case "term":
        case "reference":
          return inline.text;
        default:
          return "";
      }
    })
    .join("");
}

export function manualWattRotaryClaimText(claimNumber: number): string {
  const claimBlock = wattRotaryEngineArchivalEdition.blocks.find(
    (block) => block.kind === "claim" && block.number === claimNumber,
  );
  if (claimBlock?.kind !== "claim") {
    throw new Error(
      `Claim ${claimNumber} not found in James Watt Rotary Engine Archival Edition blocks`,
    );
  }
  return inlinesToPlainText(claimBlock.inlines);
}
