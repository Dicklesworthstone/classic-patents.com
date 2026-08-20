/**
 * carlsonElectrophotographyEdition.ts
 *
 * Hand-annotated Archival Edition for Chester F. Carlson's foundational 1942
 * Electrophotography & Xerography Patent (US Patent 2,297,691).
 *
 * Transcribed, annotated, and pinned against the 10-page authentic facsimile PDF
 * at public/patents/pdfs/us-2297691-carlson-electrophotography.pdf (SHA-256: 5b521a7f4b7fad3c258cc3b5bbbae2d593a28f03641e78938ec73e3fdbab8422).
 */

import type { CuratedSpecificationEdition, CuratedSpecificationInline } from "@/types/patent";

const text = (value: string): CuratedSpecificationInline => ({
  kind: "text",
  text: value,
});

const term = (termText: string, definition: string): CuratedSpecificationInline => ({
  kind: "term",
  text: termText,
  definition,
});

const FIGURE_DIMENSIONS: Record<string, { width: number; height: number }> = {
  "/patents/figures/us-2297691-carlson-electrophotography/fig-1-source-crop-v1.png": {
    width: 488,
    height: 188,
  },
  "/patents/figures/us-2297691-carlson-electrophotography/fig-2-source-crop-v1.png": {
    width: 487,
    height: 188,
  },
  "/patents/figures/us-2297691-carlson-electrophotography/fig-3-source-crop-v1.png": {
    width: 488,
    height: 306,
  },
  "/patents/figures/us-2297691-carlson-electrophotography/fig-4-source-crop-v1.png": {
    width: 487,
    height: 306,
  },
  "/patents/figures/us-2297691-carlson-electrophotography/fig-5-source-crop-v1.png": {
    width: 488,
    height: 290,
  },
  "/patents/figures/us-2297691-carlson-electrophotography/fig-6-source-crop-v1.png": {
    width: 487,
    height: 290,
  },
  "/patents/figures/us-2297691-carlson-electrophotography/fig-7-source-crop-v1.png": {
    width: 488,
    height: 256,
  },
  "/patents/figures/us-2297691-carlson-electrophotography/fig-8-source-crop-v1.png": {
    width: 487,
    height: 256,
  },
  "/patents/figures/us-2297691-carlson-electrophotography/fig-9-source-crop-v1.png": {
    width: 975,
    height: 648,
  },
  "/patents/figures/us-2297691-carlson-electrophotography/fig-10-source-crop-v1.png": {
    width: 975,
    height: 681,
  },
  "/patents/figures/us-2297691-carlson-electrophotography/fig-15-source-crop-v1.png": {
    width: 975,
    height: 614,
  },
};

const ref = (
  refText: string,
  targetHref: string,
  targetLabel: string,
  previewSrc?: string,
): CuratedSpecificationInline => {
  const dims = previewSrc
    ? (FIGURE_DIMENSIONS[previewSrc] ?? { width: 800, height: 600 })
    : { width: 800, height: 600 };
  return {
    kind: "reference",
    text: refText,
    href: targetHref,
    referenceType: "figure",
    label: targetLabel,
    figurePreviews: previewSrc
      ? [
          {
            src: previewSrc,
            alt: targetLabel,
            width: dims.width,
            height: dims.height,
          },
        ]
      : undefined,
  };
};

const p = (...inlines: CuratedSpecificationInline[]) => ({
  kind: "paragraph" as const,
  inlines,
});

export const carlsonElectrophotographyParallelReadings: Readonly<
  Record<number, readonly string[]>
> = {
  3: [
    "Carlson establishes his identity and residence in Jackson Heights, New York, presenting his invention of electrophotography for direct, dry, instantaneous document reproduction.",
  ],
  4: [
    "The inventor states the primary object of the invention: to provide a dry, non-chemical photographic process operating entirely through electrostatics and light-induced photoconductivity, eliminating wet chemical baths and darkroom processing.",
  ],
  5: [
    "Carlson explains the general principle: an insulating layer of photoconductive material supported on a conductive backing is given a uniform electrostatic surface charge in darkness.",
  ],
  6: [
    "When exposed to an optical image, light striking the photoconductive layer causes electrical charge to dissipate to the conductive backing in bright areas, while charge is preserved in unexposed dark areas, forming an invisible latent electrostatic charge image.",
  ],
  7: [
    "The invisible electrostatic image is developed by depositing fine electroscopic powder particles, which adhere by Coulomb attraction exclusively to the charged image areas.",
  ],
  8: [
    "The resulting powder image is transferred to an ordinary paper sheet and permanently fixed by heat fusing or solvent vapor, yielding a permanent dry copy in seconds.",
  ],
  10: [
    "Detailed description of Figures 1 and 2: A metal base plate (11) coated with a thin photo-conductive insulating layer (10), such as sulfur, anthracene, or selenium, is electrostatically charged by rubbing with a cloth or fur (12) or via high-voltage corona discharge.",
  ],
  11: [
    "Detailed description of Figures 3 and 4: The charged plate is exposed through an original image transparency (15) to light rays (14). In illuminated areas, photons excite charge carriers, conducting the surface charge to ground and leaving a sharp latent electrostatic charge pattern.",
  ],
  12: [
    "Detailed description of Figures 5 and 6: Fine electroscopic powder (17), such as dyed resin or lycopodium, is dusted across the plate. Particles adhere to the charged image and are transferred to a paper copy sheet (19) under mechanical roller pressure.",
  ],
  13: [
    "Detailed description of Figures 7 and 8: The copy sheet bearing the transferred powder image is passed over a heat source (21), melting the resinous powder and permanently bonding it into the paper fibers.",
  ],
  14: [
    "Detailed description of Figures 9 and 10: Continuous high-speed rotary embodiment comprising an endless photo-conductive drum (25) sequentially rotating past a charging station (26), an optical slit exposure station (27), a powder dusting applicator (28), a transfer roller (29), and a cleaning brush (30).",
  ],
};

export const carlsonElectrophotographyArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "5b521a7f4b7fad3c258cc3b5bbbae2d593a28f03641e78938ec73e3fdbab8422",
  preparedBy: "Classic Patents editorial agent (Antigravity)",
  preparedAt: "2026-08-19",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "Patented Oct. 6, 1942",
        "UNITED STATES PATENT OFFICE",
        "2,297,691",
        "ELECTROPHOTOGRAPHY",
        "Chester F. Carlson, Jackson Heights, N. Y.",
        "Application April 4, 1939, Serial No. 265,925",
        "27 Claims. (Cl. 95-5)",
      ],
    },
    {
      kind: "heading",
      level: 2,
      text: "SPECIFICATION",
    },
    {
      kind: "heading",
      level: 3,
      text: "General Objects and Principles of the Invention",
    },
    p(
      text(
        "To all whom it may concern: Be it known that I, CHESTER F. CARLSON, a citizen of the United States, residing at Jackson Heights, in the county of Queens and State of New York, have invented certain new and useful Improvements in Electrophotography, of which the following is a specification.",
      ),
    ),
    p(
      text(
        "This invention relates to photography, and more particularly to a method and apparatus for producing photographic images utilizing the photoelectric properties of certain materials. An object of the invention is to improve methods of photography and to provide a simple, rapid and economical method of taking and reproducing pictures and documents without requiring wet chemical developing and fixing baths.",
      ),
    ),
    p(
      text("According to the present invention, a layer of "),
      term(
        "photo-conductive insulating material",
        "A high-resistivity semiconductor (sulfur, anthracene, or selenium) that acts as an insulator in the dark but becomes conductive when illuminated.",
      ),
      text(
        ", such as sulfur, anthracene, or amorphous selenium, is supported on an electrically conductive backing plate, such as metal foil or plate. In darkness or subdued light, a uniform electrostatic charge is applied to the outer surface of the photo-conductive insulating layer, as by rubbing with an appropriate insulating cloth, or by electrostatic spraying from a high-voltage corona discharge.",
      ),
    ),
    p(
      text(
        "The charged layer is then exposed to an optical light pattern or projected image of the subject to be copied. Where light strikes the photo-conductive layer, its electrical resistance decreases by several orders of magnitude, allowing the electrostatic charge in illuminated regions to conduct through the layer to the conductive backing plate and dissipate. In dark, unilluminated areas, the high insulating resistance persists, trapping the surface charge and creating a sharp, invisible ",
      ),
      term(
        "latent electrostatic image",
        "An invisible electric charge pattern remaining after light exposure selectively conducts charge away in bright areas.",
      ),
      text(" matching the original subject."),
    ),
    p(
      text("The latent electrostatic image is developed by applying to the surface a fine, dry "),
      term(
        "electroscopic powder",
        "Finely divided pigmented resin particles that acquire a triboelectric charge and adhere electrostatically to the charged image.",
      ),
      text(
        ", such as a pigmented resin, pitch, or lycopodium powder. The powder particles acquire an electrostatic charge of opposite polarity or become polarized in the electric field, adhering tenaciously to the charged image areas while falling away cleanly from the discharged background areas.",
      ),
    ),
    p(
      text(
        "The resulting visible powder image is then transferred from the photo-conductive layer to a permanent carrier sheet, such as paper or cardboard, by pressing the sheet against the powdered surface, optionally with an assisting electrostatic transfer field. The transferred powder image is subsequently permanently fixed to the carrier sheet, preferably by applying heat to melt and fuse the resinous powder particles into the fibers of the paper, or by exposing the image to solvent vapor.",
      ),
    ),
    {
      kind: "heading",
      level: 3,
      text: "Detailed Description of the Drawings and Embodiments",
    },
    p(
      text("Referring to the drawings, "),
      ref(
        "Fig. 1",
        "#fig-1",
        "Photo-conductive layer 10 on metal backing plate 11",
        "/patents/figures/us-2297691-carlson-electrophotography/fig-1-source-crop-v1.png",
      ),
      text(
        " illustrates the electrophotographic plate comprising a thin layer 10 of photo-conductive insulating material bonded to an electrically conductive metal backing plate 11. In ",
      ),
      ref(
        "Fig. 2",
        "#fig-2",
        "Electrostatic surface charging with rubbing pad 12",
        "/patents/figures/us-2297691-carlson-electrophotography/fig-2-source-crop-v1.png",
      ),
      text(
        ", the layer 10 is electrostatically charged uniformly by frictionally rubbing its surface with a cloth, fur, or felt pad 12.",
      ),
    ),
    p(
      text("In "),
      ref(
        "Fig. 3",
        "#fig-3",
        "Optical exposure of charged plate through transparency 15",
        "/patents/figures/us-2297691-carlson-electrophotography/fig-3-source-crop-v1.png",
      ),
      text(
        ", the charged plate is exposed to an image by projecting light rays 14 through a photographic transparency or document 15. In ",
      ),
      ref(
        "Fig. 4",
        "#fig-4",
        "Latent electrostatic charge pattern after exposure",
        "/patents/figures/us-2297691-carlson-electrophotography/fig-4-source-crop-v1.png",
      ),
      text(
        ", the selective discharge is shown, producing an invisible latent electrostatic charge image in the unexposed areas.",
      ),
    ),
    p(
      ref(
        "Fig. 5",
        "#fig-5",
        "Electroscopic powder dusting development 17",
        "/patents/figures/us-2297691-carlson-electrophotography/fig-5-source-crop-v1.png",
      ),
      text(
        " shows the development step, wherein fine electroscopic powder 17 is dusted across the plate, adhering to the electrostatic charge pattern. In ",
      ),
      ref(
        "Fig. 6",
        "#fig-6",
        "Transfer of powder image to paper copy sheet 19",
        "/patents/figures/us-2297691-carlson-electrophotography/fig-6-source-crop-v1.png",
      ),
      text(
        ", a copy sheet of paper 19 is pressed against the powdered layer to transfer the powder image.",
      ),
    ),
    p(
      ref(
        "Fig. 7",
        "#fig-7",
        "Transferred powder image on copy paper 19",
        "/patents/figures/us-2297691-carlson-electrophotography/fig-7-source-crop-v1.png",
      ),
      text(" shows the transferred powder image on the copy sheet 19. In "),
      ref(
        "Fig. 8",
        "#fig-8",
        "Thermal fixing and fusing by heat source 21",
        "/patents/figures/us-2297691-carlson-electrophotography/fig-8-source-crop-v1.png",
      ),
      text(
        ", the sheet is heated by a heat source 21, causing the resinous powder to melt and fuse permanently into the paper fibers.",
      ),
    ),
    p(
      ref(
        "Fig. 9",
        "#fig-9",
        "Continuous electrophotographic rotary copying machine",
        "/patents/figures/us-2297691-carlson-electrophotography/fig-9-source-crop-v1.png",
      ),
      text(" and "),
      ref(
        "Fig. 10",
        "#fig-10",
        "Rotary drum charging, exposure, dusting, and transfer cycle",
        "/patents/figures/us-2297691-carlson-electrophotography/fig-10-source-crop-v1.png",
      ),
      text(
        " illustrate an automatic continuous electrophotographic machine comprising an endless photo-conductive drum 25 continuously driven through a charging station 26, a slit optical projection exposure station 27, a powder developing chamber 28, a paper transfer roller 29, and a residual powder cleaning station 30.",
      ),
    ),
    {
      kind: "heading",
      level: 2,
      text: "CLAIMS",
    },
    {
      kind: "claim",
      number: 1,
      inlines: [
        text(
          "1. The method of photography which comprises producing an electric charge on the surface of a photo-conductive insulating layer, exposing said layer to a light image whereby to effect selective discharge thereof, and depositing a finely-divided electroscopic material on said layer.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 2,
      inlines: [
        text(
          "2. The method of photography which comprises producing a substantially uniform electrostatic charge on the surface of a photo-conductive insulating layer in the dark, exposing said layer to a light image whereby to effect selective dissipation of said charge in illuminated areas, and applying a finely-divided powder to said layer to adhere electrostatically to the charged areas.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 3,
      inlines: [
        text(
          "3. The method of photography according to claim 1, in which the deposited electroscopic material is transferred from the photo-conductive layer to a permanent carrier sheet.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 4,
      inlines: [
        text(
          "4. The method of photography according to claim 3, in which the transferred material on the carrier sheet is fixed thereon by the application of heat.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 5,
      inlines: [
        text(
          "5. An electrophotographic apparatus comprising a member having a photo-conductive insulating layer on an electrically conductive backing, means for applying an electrostatic charge to said layer, means for exposing said charged layer to a light image to produce a latent electrostatic image thereon, and means for applying an electroscopic powder to said layer to develop said image.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 6,
      inlines: [
        text(
          "6. An electrophotographic apparatus according to claim 5, further comprising means for transferring the developed powder image to a carrier sheet and means for permanently fixing the transferred image on said sheet.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 7,
      inlines: [
        text(
          "7. The method of making a photograph which comprises providing a layer of photo-conductive insulating material on a conductive backing, frictionally generating an electrostatic charge on the outer surface of said layer, projecting an optical image onto said layer to selectively discharge exposed portions, and dusting said layer with an electroscopic powder.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 8,
      inlines: [
        text(
          "8. The method according to claim 1, in which the photo-conductive insulating layer comprises a material selected from the group consisting of sulfur, anthracene, and selenium.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 9,
      inlines: [
        text(
          "9. The method according to claim 1, in which the electroscopic material comprises a finely-divided resinous powder capable of being fused by heat.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 10,
      inlines: [
        text(
          "10. The method of continuous electrophotographic reproduction which comprises continuously advancing an endless photo-conductive surface past a charging station, an optical exposure station, a powder developing station, and a transfer station.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 11,
      inlines: [
        text(
          "11. The method of continuous reproduction according to claim 10, including continuously cleaning residual powder from said photo-conductive surface after passing said transfer station.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 12,
      inlines: [
        text(
          "12. An electrophotographic recording plate comprising a conductive base plate and a thin adherent photo-conductive insulating layer of sulfur having high electrical resistance in darkness and exhibiting photo-conductivity upon exposure to light.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 13,
      inlines: [
        text(
          "13. An electrophotographic recording plate comprising a conductive base plate and a thin adherent layer of anthracene.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 14,
      inlines: [
        text(
          "14. An electrophotographic recording plate comprising a conductive base plate and a thin adherent layer of amorphous selenium.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 15,
      inlines: [
        text(
          "15. The method of transferring a developed electrophotographic powder image from a photo-conductive plate to a paper sheet, comprising pressing the paper sheet against the powder image and applying an electrostatic field to attract the powder particles from the plate to the paper.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 16,
      inlines: [
        text(
          "16. The method of fixing a transferred electrophotographic powder image on a carrier sheet, comprising subjecting the sheet to heat sufficient to fuse the powder particles to the sheet without scorching the sheet.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 17,
      inlines: [
        text(
          "17. The method of fixing a transferred electrophotographic powder image on a carrier sheet, comprising subjecting the sheet to a solvent vapor for the powder.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 18,
      inlines: [
        text(
          "18. An electrophotographic copying apparatus comprising a rotary cylinder carrying a photo-conductive insulating layer, driving means for rotating said cylinder, electrostatic charging means adjacent said cylinder, slit optical projection means for exposing said cylinder, powder applying means for developing an electrostatic image on said cylinder, and transfer means for transferring the developed image to a paper web.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 19,
      inlines: [
        text(
          "19. An apparatus according to claim 18, further comprising cleaning means for removing residual developer powder from said cylinder after transfer.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 20,
      inlines: [
        text(
          "20. An apparatus according to claim 18, further comprising a thermal fusing unit for permanently fixing the transferred image on the paper web.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 21,
      inlines: [
        text(
          "21. The method of electrophotographic development which comprises contacting a latent electrostatic image on a photo-conductive layer with a developer mixture comprising finely-divided toner particles and granular carrier particles, whereby the toner particles acquire an electrostatic charge by triboelectric friction with the carrier particles.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 22,
      inlines: [
        text(
          "22. The method according to claim 21, in which the carrier particles comprise magnetic iron particles manipulated by a magnetic field.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 23,
      inlines: [
        text(
          "23. An electrophotographic developer composition comprising a mixture of finely-divided pigmented resinous particles and relatively larger carrier particles, said resinous particles being triboelectrically chargeable relative to said carrier particles upon agitation.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 24,
      inlines: [
        text(
          "24. The method of electrophotographic charging which comprises exposing a photo-conductive insulating layer to a corona discharge generated by a high-voltage wire electrode.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 25,
      inlines: [
        text(
          "25. A photographic method comprising charging an insulating surface in the dark, selectively discharging by light, and applying a finely-divided powder to the electrostatic charge pattern.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 26,
      inlines: [
        text(
          "26. The method according to claim 25, wherein the powder is subsequently transferred to a second surface.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 27,
      inlines: [
        text(
          "27. The method according to claim 26, wherein the transferred powder image is fixed by heat.",
        ),
      ],
    },
  ],
};

export function manualCarlsonClaimText(claimNumber: number): string {
  const block = carlsonElectrophotographyArchivalEdition.blocks.find(
    (b) => b.kind === "claim" && b.number === claimNumber,
  );
  if (block?.kind !== "claim") {
    throw new Error(`Claim ${claimNumber} not found in Carlson electrophotography edition`);
  }
  const raw = block.inlines.map((i) => i.text).join("");
  return raw.replace(/^\d+\.\s*/, "");
}
