import type { CuratedSpecificationEdition, CuratedSpecificationInline } from "@/types/patent";

const term = (
  surfaceText: string,
  definition: string,
  label?: string,
): CuratedSpecificationInline => ({
  kind: "term",
  text: surfaceText,
  definition,
  label,
});

export const wattSeparateCondenserArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "ba8638c99df583d72958f9ef8125bc30cd4e0f8784656cd561aecdc58b8b8fad",
  preparedBy: "Classic Patents Editorial Team",
  preparedAt: "2026-08-19",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: ["A.D. 1769 . . . . . . . N° 913.", "STEAM ENGINES.", "WATT'S SPECIFICATION."],
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "TO ALL TO WHOM THESE PRESENTS SHALL COME, I, ",
        },
        term(
          "JAMES WATT",
          "James Watt (1736–1819), Scottish mathematical instrument maker at the University of Glasgow whose experiments on latent heat led to the separate condenser.",
          "Inventor",
        ),
        {
          kind: "text",
          text: ", of Glasgow, in Scotland, Merchant, send greeting.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "WHEREAS His most Excellent Majesty King George the Third, by His Letters Patent under the Great Seal of Great Britain, bearing date at Westminster, the Fifth day of January, in the ninth year of His reign, did give and grant unto me, the said James Watt, His special licence, full power, sole privilege and authority, that I, the said James Watt, my executors, administrators, and assigns, should and lawfully might, during the term of years therein expressed, make, use, exercise, and vend, throughout that part of His Majesty's Kingdom of Great Britain called England, the Dominion of Wales, and Town of Berwick-upon-Tweed, and also in His Majesty's Colonies and Plantations abroad, my ",
        },
        term(
          "“NEW INVENTED METHOD OF LESSENING THE CONSUMPTION OF STEAM AND FUEL IN FIRE ENGINES;”",
          "The foundational patent for the modern steam engine, substituting separate vessel condensation for in-cylinder quenching and reducing coal consumption by over 75%.",
          "Invention Grant",
        ),
        {
          kind: "text",
          text: " in which said Letters Patent there is contained a proviso obliging me, the said James Watt, by an instrument in writing under my hand and seal, to cause a particular description of the nature of the said Invention to be inrolled in His Majesty's High Court of Chancery within four calendar months after the date of the said Letters Patent, as in and by the same, relation being thereunto had, may more fully and at large appear.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "NOW KNOW YE, that in compliance with the said proviso, I, the said James Watt, do hereby declare that the following is a particular description of the nature of my said Invention, and the manner in which the same is to be performed (that is to say):—",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "My method of lessening the consumption of steam, and consequently fuel, in ",
        },
        term(
          "fire engines",
          "18th-century term for atmospheric steam engines (such as Thomas Newcomen's 1712 engine) that operated by burning coal to generate steam and condensing it to form a partial vacuum under a piston.",
          "Fire Engine",
        ),
        {
          kind: "text",
          text: ", consists of the following principles:—",
        },
      ],
    },
    {
      kind: "claim",
      number: 1,
      inlines: [
        {
          kind: "text",
          text: "First, That vessel in which the powers of steam are to be employed to work the engine, which is called the cylinder in common fire engines, and which I call the ",
        },
        term(
          "steam vessel",
          "The main working cylinder containing the movable piston. In Watt's design, this chamber is sealed at both ends and maintained continuously at the boiling temperature of steam.",
          "Steam Vessel",
        ),
        {
          kind: "text",
          text: ", must, during the whole time the engine is at work, be kept as hot as the steam that enters it; first, by inclosing it in a ",
        },
        term(
          "case of wood",
          "Thermal insulation lagging wrapped around the metallic cylinder walls to suppress convective and radiant heat loss to the cold ambient engine-house air.",
          "Insulation Lagging",
        ),
        {
          kind: "text",
          text: ", or any other materials that transmit heat slowly; secondly, by surrounding it with steam or other heated bodies; and, thirdly, by suffering neither water nor any other substance colder than the steam to enter or touch it during that time.",
        },
      ],
    },
    {
      kind: "claim",
      number: 2,
      inlines: [
        {
          kind: "text",
          text: "Secondly, In engines that are to be worked wholly or partially by condensation of steam, the steam is to be condensed in vessels distinct from the steam vessels or cylinders, although occasionally communicating with them; these vessels I call ",
        },
        term(
          "condensers",
          "The separate vessel kept immersed in cold water into which expanded steam is exhausted from the cylinder via an equilibrium valve, instantly collapsing the steam into liquid water without cooling the cylinder metal.",
          "Separate Condenser",
        ),
        {
          kind: "text",
          text: "; and, whilst the engines are working, these condensers ought at least to be kept as cold as the air in the neighbourhood of the engines, by application of water or other cold bodies.",
        },
      ],
    },
    {
      kind: "claim",
      number: 3,
      inlines: [
        {
          kind: "text",
          text: "Thirdly, Whatever air or other elastic vapour is not condensed by the cold of the condenser, and may impede the working of the engine, is to be drawn out of the steam vessels or condensers by means of ",
        },
        term(
          "pumps",
          "The reciprocating air pump driven from the engine's main walking beam that continuously evacuates non-condensable atmospheric gases, water vapor, and liquid condensate from the condenser to maintain a deep vacuum (< 0.1 bar).",
          "Air & Extraction Pump",
        ),
        {
          kind: "text",
          text: ", wrought by the engines themselves, or otherwise.",
        },
      ],
    },
    {
      kind: "claim",
      number: 4,
      inlines: [
        {
          kind: "text",
          text: "Fourthly, I intend in many cases to employ the ",
        },
        term(
          "expansive force of steam",
          "Direct pressure of pressurized steam acting on the top surface of the piston inside an enclosed cylinder, eliminating dependence on atmospheric downward pressure and enabling high-pressure expansive non-condensing operation.",
          "Expansive Steam Power",
        ),
        {
          kind: "text",
          text: " to press on the pistons, or whatever may be used instead of them, in the same manner as the pressure of the atmosphere is now employed in common fire engines: In cases where cold water cannot be had in plenty, the engines may be wrought by this force of steam only, by discharging the steam into the open air after it has done its office.",
        },
      ],
    },
    {
      kind: "claim",
      number: 5,
      inlines: [
        {
          kind: "text",
          text: "Fifthly, Where ",
        },
        term(
          "motions round an axis",
          "Continuous rotary motion for driving industrial mills and factories, achieved through rotary steam channels or by mechanical linkages (such as sun-and-planet gearing and cranks) coupled to reciprocating pistons.",
          "Rotary Shaft Motion",
        ),
        {
          kind: "text",
          text: " are required, I make the steam vessels in form of hollow rings, or circular channels, with pistons fitted to them, or with valves that open one way, so that the steam shall circulate and drive the fluids contained in the channels, or pistons directly, round an axis, or by other mechanical contrivances to convert the reciprocal motion of the pistons into a rotative motion.",
        },
      ],
    },
    {
      kind: "claim",
      number: 6,
      inlines: [
        {
          kind: "text",
          text: "Sixthly, I intend in some cases to apply a degree of cold not capable of reducing the steam to water, but of contracting it considerably, so that the engines shall be worked by the alternate expansion and contraction of the steam.",
        },
      ],
    },
    {
      kind: "claim",
      number: 7,
      inlines: [
        {
          kind: "text",
          text: "Lastly, Instead of using water to render the piston or other parts of the engines air and steam-tight, I employ ",
        },
        term(
          "oils, wax, resinous bodies, fat of animals, quicksilver, and other metals in their fluid state",
          "Hydrophobic and thermal-resistant lubricating sealants applied to hemp rope packing in piston glands, avoiding the severe thermal cooling caused by Newcomen's cold water sealing layer.",
          "Thermal Gland Packing",
        ),
        {
          kind: "text",
          text: ".",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "IN WITNESS whereof, I have hereunto set my hand and seal, this Twenty-fifth day of April, in the year of our Lord One thousand seven hundred and sixty-nine.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "JAMES WATT. (L.S.)",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "AND BE IT REMEMBERED, that on the said Twenty-fifth day of April, in the ninth year of the reign of King George the Third, the aforesaid James Watt came before our said Lord the King in His Chancery, and acknowledged the Specification aforesaid, and all and every thing therein contained and specified, in form above written.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "Inrolled the Twenty-ninth day of April, in the year of our Lord One thousand seven hundred and sixty-nine.",
        },
      ],
    },
  ],
};

/**
 * Extract literal claim text from the archival edition blocks.
 * Enforces dynamic runtime single-source-of-truth lookup.
 */
export function manualWattClaimText(claimNumber: number): string {
  const block = wattSeparateCondenserArchivalEdition.blocks.find(
    (b) => b.kind === "claim" && b.number === claimNumber,
  );
  if (block?.kind !== "claim") {
    throw new Error(`Claim ${claimNumber} not found in wattSeparateCondenserArchivalEdition`);
  }
  return block.inlines.map((i) => i.text).join("");
}

export const WATT_SEPARATE_CONDENSER_PARALLEL_READINGS: Readonly<
  Record<number, readonly string[]>
> = {
  1: [
    "Formal opening address and identification of inventor James Watt, instrument maker of Glasgow, Scotland.",
  ],
  2: [
    "Royal letters patent recital granted by King George III on January 5, 1769, granting sole rights across Great Britain and colonies subject to enrolling a written specification within four months.",
  ],
  3: [
    "Formal preamble declaring the specification of the invention to satisfy the Chancery enrollment condition.",
  ],
  4: [
    "General statement declaring the foundational thermodynamic objective: reducing steam and coal consumption by fundamentally restructuring engine heat flows.",
  ],
  12: ["Legal execution testimonium signed and sealed by James Watt on April 25, 1769."],
  13: [
    "Formal inventor signature and seal of James Watt executing the letters patent specification.",
  ],
  14: [
    "Chancery acknowledgment and official enrollment recording on April 29, 1769 in the ninth year of King George III.",
  ],
  15: ["Official date stamp recording Chancery enrollment on April 29, 1769."],
};
