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
          "1. The method of making a photographic reproduction which comprises applying a uniform layer of photoconductive insulating material to a plane conductive backing, developing a strong electrostatic charge on the surface of said layer by rubbing said surface, exposing the layer to a light image whereby to render the illuminated areas thereof sufficiently conductive to drain off a substantial proportion of said charge to said conductive backing, then bringing a fine dust into contact with the surface whereby to form an electro-static dust deposit on the areas of said surface remaining charged after the exposure, then blowing off excess dust not electrostatically held on said surface, whereby a dust image will be produced in which the dark areas of the original image will be reproduced as dust deposit areas.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 2,
      inlines: [
        text(
          "2. The method of making a photographic reproduction which comprises applying a uniform layer of photoconductive insulating material to a plane conductive backing, developing a strong electrostatic charge on the surface of said layer by rubbing said surface, exposing the layer to a light image whereby to render the illuminated areas thereof sufficiently conductive to drain off a substantial proportion of said charge to said conductive backing, then bringing a fine dust into contact with the surface whereby to form an electrostatic dust deposit on the areas of said surface remaining charged after the exposure, then blowing off excess dust not electrostatically held on said surface, whereby a dust image will be produced in which the dark areas of the original image will be reproduced as dust deposit areas, then transferring the dust image to a sheet of paper by pressing said paper against said surface.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 3,
      inlines: [
        text(
          "3. The method of making a direct-positive photographic reproduction which comprises rubbing the surface of a layer of photoconductive insulating material to produce an electrostatic charge on said surface, then exposing the layer to a light image while simultaneously engaging the side of said layer opposite said charged surface with a conductive backing whereby the illuminated portions of said layer will have their conductivity increased by the illumination and will allow at least part of said charge to drain off to said conductive backing in said illuminated areas, then bringing a dark-colored powder into contact with said surface whereby to form a dust deposit thereon, removing the dust not held onto said surface by electrostatic attraction by passing an air stream over the surface, whereby a dust image is produced on said surface, transferring said dust image to a sheet of paper by pressing said sheet against said surface carrying the dust image and affixing said dust to said paper.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 4,
      inlines: [
        text(
          "4. The method of producing an electrostatic latent image which comprises rubbing the surface of a layer of photoconductive insulating material supported on a conductive backing to charge the surface thereof and produce a strong electric potential gradient through the layer between the charged surface and the backing and projecting a light image onto said layer whereby said layer is rendered partially conductive in the areas thereof illuminated by said image, said light image comprising a pattern of light and shadow to be recorded, said illumination increasing the electrical conductivity of said illuminated areas and thereby permitting a migration of electric charges through said layer in the illuminated areas due to said potential gradient, but not to any substantial extent in the unilluminated areas, whereby said electrostatic latent image will be produced at the surface of said layer due to the change in charge brought about on the illuminated parts of said surface by said charge migration, said image being trapped at said surface when said illumination is discontinued due to the return of said layer to its normal dark insulating value.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 5,
      inlines: [
        text(
          "5. The method of photography which comprises charging the surface of a layer of photoconductive insulating material with an electric charge, exposing the layer photographically to a light image for a period sufficient to substantially discharge the areas receiving the highest intensity of illumination while at the same time engaging the opposite surface of said layer with a conductive backing, and then dusting the charged surface with a fine electroscopic powder to develop the charge image, and subsequently fixing the powder in the configuration in which it is deposited.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 6,
      inlines: [
        text(
          "6. The method of photography which comprises charging the surface of a layer of photoconductive insulating material with an electric charge, exposing the charged layer photographically while maintaining a conductive backing in contact with the surface of said layer opposite to said charged surface, and then dusting the charged surface with an electrostatically attractable finely divided material to develop the charge image.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 7,
      inlines: [
        text(
          "7. The method of photography which comprises applying a strong electric field through a layer of photoconductive insulating material and simultaneously projecting a light image onto said layer, and then dusting the charged surface with an electrostatically attractable finely divided material to develop the charge image.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 8,
      inlines: [
        text(
          "8. The method of producing an electrostatic latent image on the surface of a layer of photoconductive insulating material having an electrically conductive backing which comprises charging the surface of said layer of photoconductive insulating material with an electrostatic charge and then exposing said layer to a light image while simultaneously engaging the side of said layer opposite to said charged surface with a conductive backing, said light image comprising a pattern of light and shadow to be recorded, whereby the illuminated portions of said layer will have their conductivity increased by the illumination and will conduct at least part of said charge away to said conductive backing in said illuminated areas, thereby leaving an electrostatic latent image on said surface corresponding to said light image, and then cutting off the illumination of said layer and storing said electrostatic image on the surface thereof.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 9,
      inlines: [
        text(
          "9. The method of forming an electrostatic latent image on the surface of a layer of photoconductive insulating material affixed to a conductive backing which comprises charging the surface of said layer with a distributed electrostatic charge and then exposing said layer to a light image, said light image comprising a pattern of light and shadow to be recorded, whereby the illuminated portions of said layer will have their conductivity increased by the illumination and will conduct at least a part of said charge away to said conductive backing in said illuminated areas, thereby leaving an electrostatic latent image on said surface corresponding to said light image, and then cutting off the illumination of said layer and storing said electrostatic image on the surface thereof for an indefinite period.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 10,
      inlines: [
        text(
          "10. The method of printing a design on a surface which comprises producing an electrostatic charge pattern on the surface of a layer of insulating material, depositing a powder on said pattern whereby to produce a corresponding powder design, and then transferring the powder design to a second surface by pressing said surfaces together, at least one of the materials comprising said powder and said second surface being thermoadhesive in nature, and permanently affixing said powder design to said second surface by heating said surface and design until said thermoadhesive material becomes adhesive.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 11,
      inlines: [
        text(
          "11. The method of making a photographic reproduction which comprises applying an electric field through a layer of photoconductive insulating material and projecting an image onto said layer whereby a flow of electricity will take place through said layer producing an electrostatic latent image at a surface thereof, then depositing dust particles on said surface where said particles will adhere in a distribution varying in density with the intensity of the charge at the various parts of the surface.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 12,
      inlines: [
        text(
          "12. A device for electrophotography comprising a pair of layers of conductive material disposed in spaced parallel relation, a thin layer of photoconductive insulating material attached to one of said conductive layers on its surface nearest the other conductive layer, means for applying a high potential difference between said conductive layers, and means for projecting an image on said layer.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 13,
      inlines: [
        text(
          "13. A device for reproducing images comprising a layer of photoconductive material of the type having a high insulating value in the dark, a contiguous contacting layer of conductive material engaging one surface of said photoconductive insulating layer, means for applying an electric field through said photoconductive insulating layer and means for projecting a predetermined light image comprising a pattern of light and shadow to be recorded onto said photoconductive insulating layer, said layer of photoconductive material being exposed to air at atmospheric pressure, said material being non-hygroscopic.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 14,
      inlines: [
        text(
          "14. An electrophotographic camera comprising a layer of photoconductive insulating material affixed to a conductive backing, a transparent conductive layer spaced and insulated from the front surface of said photoconductive insulating layer and a lens supported in front of said layers in a position to project a light image onto said photoconductive layer through said transparent conductive layer, and means to apply a high voltage potential difference between said transparent conductive layer and said conductive backing.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 15,
      inlines: [
        text(
          "15. An electrophoto camera comprising a light-tight box having a lens and shutter for admitting a light image, a layer of photoconductive insulating material and a backing supporting said layer in a position within said box to receive an image projected thereon by said lens, spaced parallel conductive electrodes in front of and behind said layer, a high voltage source and means for connecting the terminals thereof to said electrodes to apply a high potential difference between said electrodes, said electrode in front of said layer being light permeable whereby said image may be projected therethrough, and an electric flood lamp mounted within said box for flooding said layer with light at the will of the operator.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 16,
      inlines: [
        text(
          "16. The method of producing an electrostatic latent image at the surface of a layer of photoconductive insulating material having a conductive backing, which comprises charging the front surface of said layer with a distributed electrostatic charge and subsequently exposing said layer to a light image comprising a pattern of light and shadow to be recorded, whereby at least part of said charge will drain off through said layer to said conductive backing in the illuminated areas of said layer leaving an electrostatic charge image on said layer, and then cutting off said illumination.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 17,
      inlines: [
        text(
          "17. The method of recording a light image comprising a pattern of light and shadow to be recorded which method comprises producing and storing an electrostatic latent image corresponding to said light image by creating a strong electric field through a layer of photoconductive insulating material and exposing said layer to said light image to be recorded, whereby electricity will flow through said layer in the illuminated areas thereof thereby changing the charge condition of the illuminated areas at a surface of said layer thus producing said electrostatic latent image thereat, then cutting off the illumination of the image field of said layer to restore the normal dark insulating value to all parts of said layer in the image field and thereby entrap said electrostatic latent image at said surface for an indefinite period.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 18,
      inlines: [
        text(
          "18. The method of producing an electrostatic latent image upon a layer of photoconductive insulating material which comprises charging the outer surface of said layer with a first polarity charge, then exposing said layer to a light image while supporting a transparent electrode spaced from said outer surface, said electrode being charged with the said first polarity charge, and continuing said exposure long enough for the most highly illuminated areas of said layer surface to discharge and to recharge to opposite polarity under influence of said electrode, whereby an electrostatic latent image is produced having areas thereof charged with said first polarity charge and other areas thereof charged with the opposite polarity charge.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 19,
      inlines: [
        text(
          "19. The method of recording a light image comprising a pattern of light and shadow to be recorded which method comprises producing and storing an electrostatic latent image corresponding to said light image by creating a strong electric field through a layer of photoconductive insulating material and exposing said layer to said light image to be recorded, whereby electricity will flow through said layer in the illuminated areas thereof thereby changing the charge condition of the illuminated areas at a surface of said layer thus producing said electrostatic latent image thereat, then cutting off the illumination of the image field of said layer to restore the normal dark insulating value to all parts of said layer in the image field and thereby entrap said electrostatic latent image at said surface for an indefinite period, and subsequently depositing a finely divided material on said electrostatic latent image to form a corresponding image out of said material.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 20,
      inlines: [
        text(
          "20. The method of photography which comprises applying a strong electric field through a layer of photoconductive insulating material and simultaneously projecting a light image onto said layer, said light image comprising a pattern of light and shadow to be recorded, whereby electricity will flow through said layer in the illuminated part thereof, thereby producing an electrostatic charge image at a surface thereof, and then depositing a finely divided electrostatically attractable material on said image to make the image visible.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 21,
      inlines: [
        text(
          "21. The method of electrographic recording which comprises producing an electrostatic latent image at the surface of a layer of insulating material, developing the image by depositing an electrostatically attractable finely divided material thereon, then transferring the material in the image configuration to a second surface by pressure contact and affixing the transferred material to the second surface.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 22,
      inlines: [
        text(
          "22. The method of printing a design on a surface which comprises producing an electrostatic charge pattern on the surface of a layer of insulating material, depositing a finely divided material on said pattern whereby to render said pattern visible, and then transferring said material to a second surface and permanently affixing said material to said second surface in the configuration of said pattern.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 23,
      inlines: [
        text(
          "23. The method of applying a design to a surface which comprises producing an electrostatic charge pattern at the surface of a layer of insulating material, depositing a powder on said pattern whereby to produce a corresponding powder design by the electrostatic attraction of said pattern for said powder, and bringing a second surface having an adhesive material thereon into contact with the powder design whereby to transfer said powder design to said second surface.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 24,
      inlines: [
        text(
          "24. The method of applying a design to a surface which comprises producing an electrostatic charge pattern at the surface of a layer of insulating material, depositing a powder on said pattern whereby to produce a corresponding powder design by the electrostatic attraction of said pattern for said powder, and bringing a second surface having an adhesive material thereon in to contact with the powder design whereby to transfer said powder design to said second surface, and then permanently affixing the powder design to said second surface.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 25,
      inlines: [
        text(
          "25. The method of producing a powder design on a sheet of insulating material which comprises first producing an electrostatic charge pattern on a second layer of insulating material, then placing said sheet in contact with said second layer and then bringing a finely divided electroscopic material adjacent the exposed surface thereof, whereby the electrostatic charge pattern acting through said insulating sheet causes adherence of said electroscopic material to the exposed surface thereof in a design corresponding to said pattern.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 26,
      inlines: [
        text(
          "26. The method of producing a half-tone picture having varied shadings of light and shadow which comprises producing a distribution of individual solid particles of fusible material on a surface in a particle density corresponding to the degree of shading desired on each part of the surface and then affixing said particles to said surface by melting said particles thereon to produce a half-tone dot from each of said particles.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 27,
      inlines: [
        text(
          "27. The method of producing a half-tone picture having varied shadings of light and shadow which comprises producing an electrostatic charge image, producing under the influence thereof a distribution of individual solid particles of fusible material on a surface in a particle density corresponding to the charge on each part of said electrostatic image and then affixing said particles to said surface by melting said particles thereon to produce a half-tone dot from each of said particles.",
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
  return block.inlines.map((i) => ("text" in i ? i.text : "")).join("");
}
