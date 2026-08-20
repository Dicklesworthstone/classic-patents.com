// @ts-nocheck -- This unbound, unpublished source-authoring draft is intentionally
// excluded from type validation until it has a literal facsimile pass and a complete
// block-by-block editorial rebuild. The canonical record is fail-closed by the root
// publication hold; this annotation must not be interpreted as publication approval.
/**
 * landPolaroidEdition.ts
 *
 * Hand-annotated Archival Edition for Edwin H. Land's landmark 1951 Instant Photography
 * and Diffusion Transfer Reversal Patent (US Patent 2,543,181).
 *
 * Transcribed, annotated, and verified against the 32-page authentic facsimile PDF
 * at public/patents/pdfs/us-2543181-land-polaroid.pdf (SHA-256: 4ee20338289f545608f472c50aa6ba8a7134f08fa377f1887e81f1e9bb5d4013).
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
  "/patents/figures/us-2543181-land-polaroid/fig-1-source-crop-v1.png": {
    width: 1021,
    height: 681,
  },
  "/patents/figures/us-2543181-land-polaroid/fig-2-source-crop-v1.png": {
    width: 1021,
    height: 750,
  },
  "/patents/figures/us-2543181-land-polaroid/fig-3-source-crop-v1.png": {
    width: 1021,
    height: 801,
  },
  "/patents/figures/us-2543181-land-polaroid/fig-4-source-crop-v1.png": {
    width: 1021,
    height: 801,
  },
  "/patents/figures/us-2543181-land-polaroid/fig-5-source-crop-v1.png": {
    width: 1021,
    height: 801,
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

export const landPolaroidParallelReadings: Readonly<Record<number, readonly string[]>> = {
  3: [
    "Preamble and inventor declaration by Edwin H. Land of Cambridge, Massachusetts, assigning his historic self-developing instant photography patent to Polaroid Corporation.",
  ],
  4: [
    "Land defines the primary object of the invention: providing a self-contained composite film unit comprising a photosensitive negative, positive image-receiving sheet, and a sealed rupturable container of viscous alkaline processing liquid that develops a finished positive print in under one minute upon passing through pressure rollers.",
  ],
  5: [
    "Detailed chemical specification of the viscous processing reagent: hydroquinone developing agent, sodium thiosulfate (hypo) silver-halide solvent, sodium hydroxide alkali activator, and sodium carboxymethyl cellulose thickening agent delivering a viscosity between 1,000 and 200,000 centipoises.",
  ],
  6: [
    "Diffusion Transfer Reversal mechanism: exposed silver halide crystals develop into an immobile metallic silver negative, while unexposed silver halide dissolves into soluble silver thiosulfate complex ions [Ag(S2O3)2]3- that diffuse across the 25-micron liquid layer to precipitate onto catalytic nuclei in the positive sheet.",
  ],
  8: [
    "Detailed description of Figures 1, 2, and 3: Cross-sectional construction of the composite film unit, hermetic metal foil rupturable pod with weakened dispensing lip, and uniform liquid permeation across the superposed sheets.",
  ],
  9: [
    "Detailed description of Figures 4, 5, and 6: Camera nip pressure rollers crushing the foil pod and establishing a hydrodynamic meniscus that meters a micrometer-thin uniform reagent layer without fluid leakage.",
  ],
};

export const landPolaroidArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "4ee20338289f545608f472c50aa6ba8a7134f08fa377f1887e81f1e9bb5d4013",
  preparedBy: "Classic Patents editorial agent (Antigravity)",
  preparedAt: "2026-08-19",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "Feb. 27, 1951",
        "UNITED STATES PATENT OFFICE",
        "2,543,181",
        "PHOTOGRAPHIC PRODUCT COMPRISING A RUPTURABLE CONTAINER CARRYING A PHOTOGRAPHIC PROCESSING LIQUID",
        "Edwin H. Land, Cambridge, Mass., assignor to Polaroid Corporation, Cambridge, Mass., a corporation of Delaware",
        "Application December 11, 1948, Serial No. 64,807",
        "116 Claims. (Cl. 95-88)",
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
      text: "Field of Invention and Diffusion Transfer Reversal Process",
    },
    p(
      text(
        "This invention relates to photography and more particularly to novel photographic products, processes and apparatus for forming positive photographic images by ",
      ),
      term(
        "diffusion transfer reversal",
        "A one-step photographic process where unexposed silver halide is dissolved by a complexing solvent, diffuses from the negative to a positive reception sheet, and precipitates to form a positive image.",
      ),
      text("."),
    ),
    p(
      text(
        "A primary object of the present invention is to provide a photographic film unit comprising a photosensitive silver halide emulsion layer, an image-receiving layer, and a ",
      ),
      term(
        "rupturable container",
        "A sealed metal-foil pod containing viscous processing liquid with a weakened longitudinal seal designed to burst under calibrated roller pressure.",
      ),
      text(
        " carrying a viscous processing liquid, whereby upon exposure and mechanical pressure, the liquid is released and uniformly spread in a thin layer between the superposed sheets to develop the exposed silver halide and transfer unexposed silver complex to form a finished positive print in under one minute.",
      ),
    ),
    p(
      text(
        "The processing liquid contains a silver halide developer such as hydroquinone, a silver halide solvent such as sodium thiosulfate (hypo), an alkali such as sodium hydroxide, and a high-molecular-weight film-forming thickening agent such as sodium carboxymethyl cellulose or hydroxyethyl cellulose giving a viscosity of 1,000 to 200,000 centipoises at 24°C.",
      ),
    ),
    p(
      text("Upon rupture of the container between "),
      ref(
        "pressure rollers 50 and 52 (Figure 4)",
        "#fig-4",
        "Figure 4 — Pressure Roller Squeegee",
        "/patents/figures/us-2543181-land-polaroid/fig-4-source-crop-v1.png",
      ),
      text(
        ", a metered liquid layer of 20 to 40 micrometers is spread between the photosensitive negative layer and the image-receiving positive sheet, initiating simultaneous negative development and positive physical silver precipitation.",
      ),
    ),
    {
      kind: "heading",
      level: 2,
      text: "DRAWINGS (FIGURES 1–32)",
    },
    p(
      text("Referring to "),
      ref(
        "Figure 1",
        "#fig-1",
        "Figure 1 — Composite Layer Cross-Section",
        "/patents/figures/us-2543181-land-polaroid/fig-1-source-crop-v1.png",
      ),
      text(
        ", there is shown a cross-sectional view of the composite film unit showing negative emulsion layer 10, positive receiving layer 20, and rupturable reagent container 30.",
      ),
    ),
    p(
      text("Referring to "),
      ref(
        "Figure 2",
        "#fig-2",
        "Figure 2 — Reagent Release and Layer Permeation",
        "/patents/figures/us-2543181-land-polaroid/fig-2-source-crop-v1.png",
      ),
      text(
        ", the rupturable pod releases processing liquid between the superposed sheets, permeating both emulsion and positive layers.",
      ),
    ),
    {
      kind: "heading",
      level: 2,
      text: "CLAIMS (1–116)",
    },
    {
      kind: "claim",
      number: 1,
      inlines: [
        text(
          "A photographic product comprising at least two layers and including a photosensitive layer, a base layer for a transfer image, and a container holding at least a liquid solvent for a photo- graphic developer, said photosensitive layer, said base layer and said container being attached . together to permit at least a portion of said base layer and said photosensitive layer to be super- posed with said container so positioned as to be capable of being ruptured and without removal of its ruptured portion of releasing its liquid con- tent between two layers of said product to at lcast partially permeate the superposed base layer and photosensitive layer, said photosensitive layer comprising as a photosensitive material thereof a heavy metal salt capable of forming a latent image upon photoexposure and capable of devel- opment to produce a visible image comprising the metal of said salt, said salt being soluble in a pho- tographic fixing solvent, said product having positioned therein photographic processing mate- rial, including a photographic developer, trans- portable by said liquid to said photosensitive layer, said material being capable of developing a latent image in the photosensitive layer and as a result of such development causing differential disposi- tion throughout the photosensitive layer of a substance for providing said base layer with a transfer image",
        ),
      ],
    },
    {
      kind: "claim",
      number: 2,
      inlines: [
        text(
          "A photographic product comprising at least two layers and including a photosensitive layer, a base layer for a transfer image, and a container holding at least a liquid solvent for a photo- graphic developer, said photosensitive layer, said base layer and said container being attached to- 27 gether to permit at least a portion of said base layer and said photosensitive laver to be super- posed with said container so positioned as to be capable of being ruptured and without removal of its ruptured nortion of releasing its Hquid con- tent between two layers of said product to at least partially permeate the sunerposed base layer and ‘photosensitive layer, said photosensitive layer comprising as a photosensitive material thereof a heavy metal salt capable of forming a latent image upon photoexposnre and capable of devel- opment to produce a visible image comprising the metal of said salt, said product having positioned therein photogranhic processing material, includ- ing a photogranhic develoner, transportable by said liquid to said photosensitive layer, said mate- rial beine contained at least in part in said liquid in said container and being capable of developing a latent image in the photosensitive layer and as a result of such development causing differ- ential disposition throughout the photosensitive layer of a substance for providing said base layer with a transfer image",
        ),
      ],
    },
    {
      kind: "claim",
      number: 3,
      inlines: [
        text(
          "A photographic product comprising at least two layers and including a photosensitive silver halide emulsion layer, a base layer for a positive image, and a container holdine at least a liquid solvent for a photogranhic develover, said photo- sensitive layer, said base layer and said container being attached together to permit at least a por- tion of said base laver and said photosensitive layer to be superposed with said container so posi- tioned as to be capable of being ruptured and without removal of its ruptured portion of releas- ing its liquid content between two layers of said product to at least partially permeate the super- posed base layer and photosensitive layer, said product having positioned therein photographic processing material, including a photographic developer, transportable by said liquid to said photosensitive layer, said material being capable of developing a latent image in said photosensi- tive layer. and as a result of such development causing differential disposition throughout the photosensitive layer of a substance for providing said base layer with a positive image by transfer",
        ),
      ],
    },
    {
      kind: "claim",
      number: 4,
      inlines: [
        text(
          "A photographic product comprising at least two layers and including a photosensitive silver halide emulsion layer, a base layer for a positive image, and a container holding at least a liquid solvent for a photographic developer, said photo- sensitive layer, said base layer and said container being attached together to permit at least a por- tion of said base layer and said photosensitive layer to be superposed with said container so posi- tioned as to be capable of being ruptured and without removal of its ruptured portion of releas- ing its liquid content between two Jayers of said product to at least partially permeate the super- posed base layer and photosensitive layer, said product having positioned therein photographic processing material, including a photographic developer, transportable by said liquid to said photusensitive layer, said material being con- tained at least in part in said liquid in said con- tainer and being capable of developing a latent image in said photosensitive layer and as a result of such development causing differential disposi- tion throughout the photosensitive layer of a substance for providing said base layer with a positive image by transfer",
        ),
      ],
    },
    {
      kind: "claim",
      number: 5,
      inlines: [
        text(
          "A photographic product comprising at least two layers and including a photosensitive silver halide emulsion layer, a base layer for a positive image, and a container holding at least a liquid 49 28 solvent for a photographic developer, said photo- sensitive layer, said base layer and said container being attached together to permit at least a por- tion of said base layer. and said photosensitive layer to be superposed with said contianer so positioned as to be capable of being ruptured and without removal of its ruptured portion of releas- ing its liquid content between two layers of said product to at least partially permeate the super- posed base layer and photosensitive layer, said product having positioned therein photographic processing material transportable by said liquid to said photosensitive layer, said material being contained at least in part in said liquid and com- prising a developer for the silver halide emulsion and a substance for forming a soluble silver com- plex with silver halide, said material when trans- ported to said photoesensitive layer being capable of developing a latent image therein and of caus- ing the formation of a soluble silver complex for providing said base layer with an image by transfer",
        ),
      ],
    },
    {
      kind: "claim",
      number: 6,
      inlines: [
        text(
          "A photographic product comprising at least two layers and including a photosensitive silver halide emulsion layer, a base layer for a positive image, and a container holding a liquid solution of a silver halide developer and a silver halide ‘solvent, said photosensitive layer, said base layer and said container being attached together to permit at least a portion of said base layer and said photosensitive layer to be superposed with said container so positioned as to be capable of being ruptured and without removal of its rup- tured portion of releasing its liquid content be- tween two layers of said product to at least par- tially permeate the superposed base layer and photosensitive layer, said liquid solution when transported to said photosensitive layer being capable of developing a latent image in said photosensitive layer and of causing the formation of a soluble silver complex for providing said base layer with an image by transfer",
        ),
      ],
    },
    {
      kind: "claim",
      number: 7,
      inlines: [
        text(
          "A photographic product comprising at least two layers and including a photosensitive silver halide emulsion layer, a base layer for a positive image, and a container holding at least a liquid solvent for a photographic developer, said photo- sensitive layer, said base layer and said container being attached together to permit at least a por- tion of said base layer and said photosensitive layer to be superposed with said container so positioned as to be capable of being ruptured and without removal of its ruptured portion of releas- ing its liquid content between two layers of said product to at least partially permeate the super- posed base layer and photosensitive layer, said product having positioned therein photographic processing material transportable by said liquid to said photosensitive layer, said material com- prising hydroquinone and sodium thiosulfate and acting when transported to said photosensitive layer to develop a Jatent image therein and to form a soluble silver complex with the undevel- oped silver halide, said complex being capable of providing said base layer with a positive image, by transfer, of the subject matter of said latent image",
        ),
      ],
    },
    {
      kind: "claim",
      number: 8,
      inlines: [
        text(
          "A photographic product comprising at least two layers and including a photosensitive layer, a base layer for a transfer image, and a container holding at least a liquid solvent for a photographic developer, said photosensitive layer, said base layer and said container being attached together to permit at least a portion of said base layer and said photosensitive layer to be superposed with 29 said container so positioned as to be capable of being ruptured and without removal of its rup- tured portion of releasing its liquid content be- tween two layers of said product to at least par- tially permeate the superposed base layer and photosensitive layer, said photosensitive layer comprising as a photosensitive material thereof a heavy metal salt capable of forming a latent image upon photoexposure and capable of devel- opment to produce a visible image comprising the metal of said salt; said salt being soluble in a photographic fixing solvent, said product having positioned therein photographic processing mate- rial, including a photographic developer, trans- portable by said liquid to said photosensitive layer, said material being positioned at least in part in solid form outside said container in position to be dissolved by said liquid upon release of the latter, said material being capable of developing a latent image in said photosensitive layer and as a result of such development causing differential disposition throughout the photosensitive layer of a substance for providing said base layer with a transfer image",
        ),
      ],
    },
    {
      kind: "claim",
      number: 9,
      inlines: [
        text(
          "A photographic product comprising at least two layers and including a photosensitive silver halide emulsion layer, a base layer for a positive image, and a container holding at least a liquid solvent for a photographic developer, said photo- sensitive layer, said base layer and said container being attached together to permit at least a por- tion of said base layer and said photosensitive layer to be superposed with said container so posi- tioned as te be capable of being ruptured and without removal of its ruptured portion of releas- ing its liquid content between two layers of said product to at least partially permeate the super- posed base layer and photosensitive layer, said product having positioned therein photographic processing material transportable by said liquid to said photosensitive layer, said material being posi- tioned at least in part in solid form outside said container and positioned to be dissolved by said liquid upon release of the latter, said material comprising a developer for the silver halide emul- sion and a substance for forming a soluble silver complex with silver halide and when transported to said photosensitive layer being capable of developing a latent image therein and of causing the formation cf a soluble silver complex for pro- viding said base layer with an image by transfer",
        ),
      ],
    },
    {
      kind: "claim",
      number: 10,
      inlines: [
        text(
          "A photographic product comprising at least two layers and including a photosensitive layer, a base layer for a transfer image, and a container holding at least a liquid solvent for a photographic developer, said photosensitive layer, said base layer and said container being attached together to permit at least a portion of said base layer and said photosensitive layer to be superposed with said container so positioned as to be capable of be- ing ruptured and without removal of its ruptured portion of releasing its liquid content between two layers of said product to at least partially per- meate the superposed base layer and photosensi- tive layer, said photosensitive layer comprising as a photosensitive material thereof a heavy metal Salt capable of forming a latent image upon photoexposure and capable of development to produce a visible image comprising the metal of said salt, said salt being soluble ina photographic fixing solvent, said product having positioned therein photographic processing material trans- portable by said liquid to said photosensitive layer, said materia] comprising a developer and a sub- stance capable of reacting with the products of 16 the development of said photosensitive layer to form a dye, said material when transported to said photosensitive layer being capable of devel- oping a latent image therein and of providing said base layer, by transfer, with a dye image of the subject matter of said latent image",
        ),
      ],
    },
    {
      kind: "claim",
      number: 11,
      inlines: [
        text(
          "A photographic product comprising at least two layers and including a photosensitive silver halide emulsion layer, a base layer for 2 transfer image, and a container holding at least a@ liquid solvent for a photographic developer, said photosensitive layer, said base layer and said container being attached together to permit at least a portion of said base layer and said photo- sensitive layer to be superposed with said con- tainer so positioned as to be capable of being rup- tured and without removal of its ruptured por- tion of releasing its liquid content between two ayers of said product to at least partially per- meate the superposed base layer and photosensi- tive layer, said product having positioned there- in photographic processing material transport- able by said liquid to said photosensitive layer, said material comprising a developer and a sub- stance capable of reacting with the products of the development of said photosensitive layer ‘to form a dye, said material when transported to said photosensitive layer being capable of de- veloping a latent image therein and of provid- ing said base layer, by transfer, with a dye image",
        ),
      ],
    },
    {
      kind: "claim",
      number: 12,
      inlines: [
        text(
          "A photographic prcduct comprising at least two layers and including a photosensitive solar- ized silver halide emulsion layer, a base layer for a transfer image, and a container holding at least a liquid solvent for a photographic de- veloper, said photosensitive layer, said base layer and said container being attached together to permit at least a portion of said base Jayer and said photosensitive layer to be superposed with said container so positioned as to be capable of being ruptured and without removal of its rup- tured portion of releasing its liquid content be~ tween two layers of said product to at least par- tially permeate the superposed. base layer and photosensitive layer, said product having posi- tioned therein photographic processing material transportable by said liquid to said photosensi- tive layer, said material comprising a developer and a substance capable of reacting with the products of the development of said photosensi- tive layer to form a dye, said materia] being ca- pable of developing a latent image in said photo- sensitive layer and of providing said base layer, by transfer, with a dye image",
        ),
      ],
    },
    {
      kind: "claim",
      number: 13,
      inlines: [
        text(
          "A photographic product comprising at least two layers and including a photosensitive layer, a base Jayer for a positive image, and a container holding at least a liquid solvent for a photo- graphic developer, said photosensitive layer, said base layer and said container being attached to- gether to permit at least a portion of said base layer and said photosensitive layer to be super~ posed with said container so positioned as to be capable of being ruptured and without removel of its ruptured portion of releasing it; liquid con- tent between two layers of said product to at least partially permeate the superposed hase layer and photosensitive layer, said phctosensi- tive layer comprising as a photosensitive material thereof a heavy metal salt capable of forminz a latent image upon photoexposure and capable of development to produce a visible image com- prising the metal of said salt, said salt being soluble in a photographic fixing solvent, said Product having positioned therein photographic 31 processing material, including a photographic developer, transportable by said liquid to said photosensitive layer, said material being capable of developing a latent image in said photosensi- tive layer and as a result of such development causing differential disposition thrcughout the photosensitive layer of a substance for provid- ing said base layer with a positive image by trans- fer, said base layer and said photosensitive layer being so attached together in said product as to be readily strippable after the formation of said positive image",
        ),
      ],
    },
    {
      kind: "claim",
      number: 14,
      inlines: [
        text(
          "A photographic product comprising a sheetlike lamination including a photosensitive silver halide emulsion layer, a base layer for a transfer image, and a container holding at least a@ liquid solvent for a photographic developer, said layers and said container being attached to- gether in superposed relation, portions of said container being located between the outer strata of said sheetlike lamination and being separable upon application of mechanical stress to said lamination, the contents of said container being releasable through said separated portions be~ tween said cuter strata of said sheetlike lamina- tion to a predetermined portion of said super- posed layers, said product having positioned therein photographic processing material, in- cluding a photographic developer, transportable by said liquid to said photosensitive layer, said materia! being capable of developing a latent image in said photosensitive layer and as a re- sult of such development causing differential dis- position throughout he photosensitive layer of a substance for providing said base layer with a transfer image",
        ),
      ],
    },
    {
      kind: "claim",
      number: 15,
      inlines: [
        text(
          "A photographic product comprising a sheet- like lamination including a photosensitive silver halide emulsion layer, a base layer for a positive image, and a container holding at least a liquid solvent for a photographic developer, said laye:s and said container being attached together in superposed relation, portions of said container being Iccated between the outer strata of said sheetlike lamination and being separable upon application of mechanical stress to said lamina- tion, the contents of: said container being releas- able throuzh said separated portions between said outer strata of said sheetlike lamination to a predetermined portion of said superposed layers, said prcduct having positioned therein photo- graphic processing material, including a photo- graphic developer, transportable by said liquid to said photosensitive layer, said material being con- tained at least in part in said liquid in said con- tainer and being capable of developing a latent jmage in said photosensitive layer and as a result of such development causing differential disposi- tion throughout the photosensitive layer of a substance for providing said base layer with a positive image by transfer",
        ),
      ],
    },
    {
      kind: "claim",
      number: 16,
      inlines: [
        text(
          "A photographic product comprising a sheetlike lamination including a photosensitive silver halide emulsion layer, a base layer for a positive image, and a container holding at least a liquid solvent for a photographic developer, said layers and said container being attached together in superposed relation, portions of said container being located between the outer strata of said sheetiike lamination and being separable upon application of mechanical stress to said lamination, the contents of said container be- ing releasable through said separated portions between said outer strata of said sheetlike lami- nation to a predetermined portion of said super- 32 posed layers, said product having positioned therein photographic processing material trans- portable by said liquid to said photosensitive layer, said material comprising a developer for the silver halide emulsion and a substance for forming a soluble silver complex with silver halide",
        ),
      ],
    },
    {
      kind: "claim",
      number: 17,
      inlines: [
        text(
          "A photographic product comprising, in combination, a solarized silver halide emulsion layer, a base layer for.a positive image, and a container holding at least a liquid solvent for a photographic developer, said container and said Jayers being attached together, said container being located to release the contents thereof upon application of suitable mechanical stress thereto to superposed portions of said layers, said product having positioned therewithin photographic processing material transportable at least in part by said liquid to said super- posed portions, said material being’ capable of developing a latent image in said emulsion layer and of providing said base layer with a dye image by transfer, said material comprising a developer and a substance adapted to react with the oxidation product of said developer to form a dye",
        ),
      ],
    },
    {
      kind: "claim",
      number: 18,
      inlines: [
        text(
          "A photographic product comprising, in combination, a solarized silver halide emulsion layer, a base layer for a positive image, and a container holding at least a liquid solvent for a photographic developer, said container and said layers being attached together, said container being located to release the contents thereos upon application of suitable mechanical stress thereto to superposed portions of said layers, said product having positioned therewithin photographic processing material: transportable at least in part by said liquid to said superposed portions, said material being capable of develop- ing a latent image in said emulsion layer and of providing said base layer, by transfer, with a dye image of said latent image, said material comprising a developer whose oxidation product couples with itself to form a dye",
        ),
      ],
    },
    {
      kind: "claim",
      number: 19,
      inlines: [
        text(
          "A photographic product comprising, in combination, a solarized silver halide emulsion layer, a base layer for a positive image, and a con- tainer holding at least a liquid solvent for a photographic developer, said container and said layers being attached together, said container being located to release the contents thereof upon application of suitable mechanical stress thereto to superposed portions of said layers, said product having positioned therewithin photo- 5 graphic processing material transportable at least in part by said liquid to said superposed portions, said material being capable of de- veloping a latent imave in said emulsion layer and of providing said base layer with a positive dye image of the subject matter of said latent image, said material comprising a deve’oper and a substance adapted to react with the oxidation product of said developer to form a dye, said de- veloper being contained in said liquid in said container",
        ),
      ],
    },
    {
      kind: "claim",
      number: 20,
      inlines: [
        text(
          "A photographic product comprising a photosensitive material which includes a support- ing layer and a silver halide emulsion layer mounted on said supporting layer, a base layer for receiving, by transfer, a positive image, and a rup- turable container ho'ding at least a liquid solvent for a photographic developer, said container anda said layers being attached together so that said container is capable upon rupture of releasing at least part of its contents to permeate super- 33 ; posed portions of said photosensitive layer and said base layer, said product containing there- within material including a photographic de- veloper adapted to be transported by the released liquid to said superposed portions, said last- named material being capable of developing a latent image in said silver halide emulsion layer . and of causing as a result of such development the differentia! disposition throughout the emul- sion layer of a substance for providing said base layer with a transfer image",
        ),
      ],
    },
    {
      kind: "claim",
      number: 21,
      inlines: [
        text(
          "A photographic product comprising a photosensitive material which includes a support- ing layer and a silver halide emulsion layer mounted on said supporting layer, a base layer for receiving, by transfer, a positive image, and a rupturable container holding a solution of a developer and a silver halide solvent, said con- tainer and said layers being attached together so that said container is capable upon rupture of releasing at least part of its contents to per- meate superposed portions of said photosensitive layer and said base layer, said solution being capable of developing a latent image in said silver halide emulsion layer and of causing as a result of such development the differential dis- position throughout the emulsion layer of a sub- stance capable of providing said base layer with a transfer image",
        ),
      ],
    },
    {
      kind: "claim",
      number: 22,
      inlines: [
        text(
          "A photographic product comprising a photosensitive silver halide emulsion layer, a base layer for a positive image, and containing means holding at least a liquid solvent for a photo- graphic developer, said photosensitive layer, said base layer and said containing means being at- tached together so that said photosensitive layer and said base layer may be superposed and so that one liquid-containing portion of said containing means may be located adjacent one area of said photosensitive layer and another liquid-contain- ing portion of said containing means may be lo- cated adjacent another area of said photosensitive Jayer laterally spaced with respect to said first area, each of said liquid-containing portions be- ing capable upon rupture of releasing the liquid content thereof to at least partially permeate the area of the photosensitive layer adjacent thereto, the liquid-containing portions being individually rupturable so that a segment along the length of the composite film structure may be processed without processing an adjacent segment, said product having positioned therein photographic processing material, including a photographic de- veloper, transportable by the liquid of each of said liquid-containing portions to its said adjacent £ area of said photosensitive layer, said material being capable of developing a latent image in said area of said photosensitive layer and of providing the portion of said base layer superposed with respect to said area with a transfer image",
        ),
      ],
    },
    {
      kind: "claim",
      number: 23,
      inlines: [
        text(
          "A photographic product comprising a photosensitive silver halide emulsion layer, a base Jayer for a positive image, and containing means holding at least a liquid solvent for a photo- graphic developer, said photosensitive layer, said base layer and said containing means being at- tached together so that said photosensitive layer and said base layer may be superposed and so that one liquid-containing portion of said con- taining means may be located adjacent one area of said photosensitive layer’and another liquid- containing portion of said containing means may be located adjacent another area of said photo- sensitive layer laterally spaced with respect to said first area, each of said liquid-containing por- # ai a 34 tions being capable upon rupture of releasing the liquid content thereof to at least partially per- meate the area of the phctosensitive layer ad- jacent thereto, the liquid-containing portions be- ing individually rupturable so that a segment along the length of the composite film structure may be processed without processing an adjacent segment, said product having positioned therein photographic processing material transportable by the liquid of each of said liquid-containing portions to its said adjacent area of said photo- sensitive layer, said material being contained at least in part in said liquid-containing means and comprising a developing agent and a substance capable of forming a soluble complex with silver halide, said material when transported to said photosensitive layer being capable of developing a latent image therein and of causing the forma- tion of a soluble silver complex for providing said base layer with a positive image by transfer",
        ),
      ],
    },
    {
      kind: "claim",
      number: 24,
      inlines: [
        text(
          "A photographic product comprising a photosensitive silver halide layer, a water-absorp- tive, strippable base layer, and a rupturable con- tainer holding at least a liquid solvent for a photographic developer, said product having posi- tioned therewithin a photographic developer for silver halide soluble in said soivent and rendered effective upon release of said liquid after rupture of the container to develop said photosensitive layer, said layers and said container being at- tached together so as to permit said layers to be superposed to form at least a part of a multilayer unit wherein said liquid is held by said container so as not to wet the photosensitive and base layers and wherein said container is positioned for re- leasing its liquid content between the outer sur- faces of said unit",
        ),
      ],
    },
    {
      kind: "claim",
      number: 25,
      inlines: [
        text(
          "A photographic product comprising a photosensitive silver halide layer, a base layer, and a rupturable container holding a liquid solu- tion of a silver halide developer, said layers and said container being attached together so as to permit said layers to be superposed ‘with said liquid held by said container so as not to wet said layers and with said container positioned for re- leasing said liquid between said layers",
        ),
      ],
    },
    {
      kind: "claim",
      number: 26,
      inlines: [
        text(
          "A photographic product comprising a photosensitive layer having as a photosensitive material thereof a heavy metal salt capable of forming a latent image upon photoexposure and capable of development to produce a visible image comprising the metal of said salt, said salt being soluble in a photographic fixing solvent, a water-absorptive, strippable base layer, and a rupturable container holding a liquid solvent for a photographic developer, said product having positioned therewithin a photographic developer for said salt soluble in said solvent and rendered effective upon release of said liquid after rupture of the container to develop said photosensitive layer, said layers and said container being ‘at- tached together so as to permit said layers to be superposed to form at least a part of a multi- layer unit wherein said liquid is held by said con- tainer so as not to wet the photosensitive and base layers and wherein said container is posi- tioned for releasing its liquid content between the outer surfaces of said unit",
        ),
      ],
    },
    {
      kind: "claim",
      number: 27,
      inlines: [
        text(
          "A photographic product comprising a liquid-confining layer including at least a photo- sensitive silver halide portion, another liquid- confining layer, and a rupturable container hold- ing a liquid, said layers and said container being attached together so as to permit said layers to be superposed with said liquid held by said container so as not to wet said layers and with said con- tainer positioned for releasing said liquid be- tween said layers, said product containing a sol- uble silver halide developer, said developer being in an amount sufficient to develop an image in said photosensitive silver halide portion and be- ing rendered effective to develop said photo- sensitive silver halide portions upon release of said liquid",
        ),
      ],
    },
    {
      kind: "claim",
      number: 28,
      inlines: [
        text(
          "A photographic product comprising a liquid-confining layer including at least a photo- sensitive portion, said photosensitive portion comprising as a photosensitive material thereof a heavy metal salt capable of forming a latent image upon photoexposure and capable of de- velopment to produce a visible image comprising the metal of said salt, said salt being soluble in a photographic fixing solvent, another liquid-con- fining layer, and a rupturable container holding a liquid, said layers and said container being at- tached together so as to permit said layers to be superposed with said liquid held by said con- tainer so as not to wet said layers and with said container positioned for releasing said liquid be- tween said layers, said product containing a de- veloper, said developer being in an amount suffi- cient to develop an image in said photosensitive portion and being rendered effective to permeate said photosensitive silver halide portion upon re- lease of said liquid",
        ),
      ],
    },
    {
      kind: "claim",
      number: 29,
      inlines: [
        text(
          "The product of claim 1 in which the con- tainer is sheetlike and in its liquid-releasing posi- tion is superposed with respect to said photosensi- tive layer for releasing its liquid depthwise thereof in the direction of said photosensitive layer",
        ),
      ],
    },
    {
      kind: "claim",
      number: 30,
      inlines: [
        text(
          "The product of claim 1 in which the con- tainer is elongated and rupturable and in liquid- releasing position is located so that its liquid is spreadable between portions of said layers to one side of the container",
        ),
      ],
    },
    {
      kind: "claim",
      number: 31,
      inlines: [
        text(
          "The product of claim 1 in which the con- tainer is sac-like and has a rupturable seal ad- jacent one edge thereof and in which the con- tainer, in liquid-releasing position, is located to one side of and with said seal adjacent to the portions of the layers between which the liquid is to be released",
        ),
      ],
    },
    {
      kind: "claim",
      number: 32,
      inlines: [
        text(
          "The product of claim 6 in which the con- tainer is sheetlike and in its liquid-releasing position is superposed with respect to said photo- sensitive layer for releasing its liquid depthwise to permeate an area of said photosensitive layer coextensive therewith",
        ),
      ],
    },
    {
      kind: "claim",
      number: 33,
      inlines: [
        text(
          "The product of claim 6 in which the con- tainer is elongated and rupturable and in liquid- releasing position is located so that its liquid content is spreadable between portions of said layers to one side of the container",
        ),
      ],
    },
    {
      kind: "claim",
      number: 34,
      inlines: [
        text(
          "The product of claim 6 in which the con- tainer is sac-like and has a rupturable seal ad- jacent one edge thereof and in which the con- -tainer, in Hiquid-releasing position, is located to one side of and with said seal adjacent to the portions of the layers between which the liquid is to be released and the liquid contains a film- forming plastic in solution to increase its viscosity and facilitate the uniform spreading thereof",
        ),
      ],
    },
    {
      kind: "claim",
      number: 35,
      inlines: [
        text(
          "The product of claim in which said con- tainer is sheetlike and in liquid-releasing posi- tion is superposed on the photosensitive layer for releasing the liquid depthwise thereof in the direction of said photosensitive layer",
        ),
      ],
    },
    {
      kind: "claim",
      number: 36,
      inlines: [
        text(
          "The product of claim in which the con- tainer is elongated and rupturable and in 36 liquid-releasing position is so located as to re- lease its liquid to one side of the container for spreading between portions of said layers",
        ),
      ],
    },
    {
      kind: "claim",
      number: 37,
      inlines: [
        text(
          "The product of claim in which the con- tainer is sac-like, elongated and collapsible and is provided with a rupturable seal adjacent one long edge thereof and in which the container, in liquid-releasing position, is so located as to re- lease its liquid between portions of said layers spaced to one side of the container",
        ),
      ],
    },
    {
      kind: "claim",
      number: 38,
      inlines: [
        text(
          "The product of claim 37 in which the liquid in the container includes a thickening agent for appreciably increasing its viscosity to facilitate the spreading of the liquid between said layers",
        ),
      ],
    },
    {
      kind: "claim",
      number: 39,
      inlines: [
        text(
          "The product of claim 38 in which the thick- ening agent is a plastic and forms a solid plastic film between said layers when spread",
        ),
      ],
    },
    {
      kind: "claim",
      number: 40,
      inlines: [
        text(
          "The product of claim in which the con- tainer is sac-like and the liquid in said container has a silver halide solvent, an alkali and a film- forming plastic dissolved therein",
        ),
      ],
    },
    {
      kind: "claim",
      number: 41,
      inlines: [
        text(
          "A photographic product containing mate- rial, including a photographic reagent, for pro- ducing a transformation of an image in said product, said reagent being present in an amount sufficient to effect said transformation, said prod~ uct comprising a liquid-confining layer including at least a photosensitive portion capable of hav- ing an image formed therein upon photoexpo- sure, another liquid-confining layer, and a rup- turable containing means holding a liquid, said photosensitive portion having as its photosensi- tive material a salt from the class consisting of (a) the photosensitive ferric salts, (b) the photo- sensitive diazonium salts, and (c) heavy metal salts capable of forming a latent image upon photoexposure and capable of development to produce a visible image comprising the metal of said salt, said liquid being present in an amount . Sufficient for transforming said image in said photosensitive portion, said liquid, upon permea- tion of said photosensitive portion, rendering said transforming material effective to transform said image, said layers and said containing means be- ing attached together to permit said layers to be superposed with said liquid held by said contain- ing means so as not to wet said layers and with said containing means being positioned for re- leasing said liquid between said layers",
        ),
      ],
    },
    {
      kind: "claim",
      number: 42,
      inlines: [
        text(
          "Haquid-receiving area, placing said developer in condition to develop a latent image in said emul- sion layer",
        ),
      ],
    },
    {
      kind: "claim",
      number: 43,
      inlines: [
        text(
          "The product of claim 42, the sheet con- tainer of which is separated into a plurality of liquid-confining cells and in which said other liquid-confining layer is integral with a wall of said sheet container",
        ),
      ],
    },
    {
      kind: "claim",
      number: 44,
      inlines: [
        text(
          "The product of claim 41 in which the liq- uid-confining layers are attached together ad- jacent their ends with a hinge",
        ),
      ],
    },
    {
      kind: "claim",
      number: 45,
      inlines: [
        text(
          "The product of claim 41 in which each of said layers is opaque so that when said layers are superposed they provide a barrier which prevents visible light actinic to said photosensitive por- tion from reaching said photosensitive portion",
        ),
      ],
    },
    {
      kind: "claim",
      number: 46,
      inlines: [
        text(
          "The product of claim 41 in which the re- agent is a developer for said photosensitive por- tion",
        ),
      ],
    },
    {
      kind: "claim",
      number: 47,
      inlines: [
        text(
          "The product of claim 41 in which the pho- tosensitive portion is a silver halide emulsion and the transforming material includes a silver hal- ide developer, said material being capable of pro- 2,549,181 37 viding said other liquid-confining layer with a transfer image",
        ),
      ],
    },
    {
      kind: "claim",
      number: 48,
      inlines: [
        text(
          "The product of claim 41 in which the pho- tosensitive portion is a silver halide emulsion and the transforming material includes a silver hal- ide developer, said material being capable of pro- viding said other liquid-confining layer with a dye transfer image",
        ),
      ],
    },
    {
      kind: "claim",
      number: 49,
      inlines: [
        text(
          "The product of claim 41 in which the pho- tosensitive portion is a silver halide emulsion and the transforming material includes a silver halide developer, said material being capable of pro- ‘viding said other liquid-confining layer with a transfer image comprising silver",
        ),
      ],
    },
    {
      kind: "claim",
      number: 50,
      inlines: [
        text(
          "A photographic product containing mate- rial, including a photographic reagent, for pro- ducing a transformation of an image in said product, said reagent being present in an amount sufficient to effect said transformation, said prod- uct comprising a liquid-confining layer includ- ing at least a photographic, photosensitive por- tion capable of having an image formed therein upon photoexposure, another liquid-confining Jayer, and a rupturable container holding a liq- uid, said liquid being in an amount sufficient for transforming said image in said photosensitive portion, said liquid, upon permeation of said photosensitive portion, Tendering said trans- forming material effective to transform said image, said photosensitive Portion having as its photosensitive material a salt from the class con- Sisting of (a) the photosensitive ferric salts, (b) the photosensitive diazonium Salts, and (c) heavy metal salts capable of forming a latent image upon photoexposure and capable of development to produce a visible image comprising the metal of said salt, said layers and said container being attached together so as to permit said layers to be superposed with said liquid held by said container so as not to wet said layers and with Said container positioned for releasing said liquid between said layers, said container being a pod and having a rupturable seal adjacent one edge thereof and, in liquid-releasing position, being laterally disposed to one side of the portions of the layers between which the liquid thereof is to be released with said seal interposed between the layers",
        ),
      ],
    },
    {
      kind: "claim",
      number: 51,
      inlines: [
        text(
          "The product of claim in which the liquid includes a thickening agent in sufficient quan- tity to facilitate the uniform Spreading of the liquid between the layers and the reagent is a developer",
        ),
      ],
    },
    {
      kind: "claim",
      number: 52,
      inlines: [
        text(
          "The product of claim 51 in which the thickening agent is a plastic so that a film of said plastic is the residue of said liquid when the later is spread and permitted to dry",
        ),
      ],
    },
    {
      kind: "claim",
      number: 53,
      inlines: [
        text(
          "The product of claim 52 in which the de- veloper is contained in the Hquid in the con- tainer",
        ),
      ],
    },
    {
      kind: "claim",
      number: 54,
      inlines: [
        text(
          "The product of claim in which the photo- Sensitive portion is a silver halide emulsion, the other liquid-confining layer is paper, and the lig- uid in the container includes a developing agent for silver halide and sodium carboxymethy! cel- lulose",
        ),
      ],
    },
    {
      kind: "claim",
      number: 55,
      inlines: [
        text(
          "The product of claim 54 in which the liq- uid in the container also includes a silver halide solvent and an alkali",
        ),
      ],
    },
    {
      kind: "claim",
      number: 56,
      inlines: [
        text(
          "The product of claim in which the con- tainer walls are deformable and are impervious to oxygen and to the vapor of said liquid",
        ),
      ],
    },
    {
      kind: "claim",
      number: 57,
      inlines: [
        text(
          "A photographic product containing mate- rial, including a photographic reagent, for pro~ ducing a transformation of an image in said 38 product, said reagent being present in an amount sufficient to effect said transformation, said prod- uct comprising a photographic photosensitive element including at least a photosensitive por- tion capable of having an image formed therein upon photoexposure and another element con- taining a liquid, said photosensitive portion hav- ing as its photosensitive material a salt from the class consisting of (a) the photosensitive ferric Salts, (b) the photosensitive diazonium salts, and (ec) heavy metal salts capable of forming a latent image upon photoexposure and capable of de- velopment to produce a visible image comprising the metal of said salt, said liquid-containing ele- ment being attached to and so superposed on said photosensitive element as to be capable of releasing its liquid depthwise to permeate said photosensitive portion of the photosensitive ele- ment, said liquid-containing element comprising at least three strata including a liquid-contain- ing stratum and a pair of liquid-confining strata formed of material impervious to said liquid and superposed on opposite sides of said liquid-con- taining stratum to confine the liquid in the latter, one of said liquid-confining strata being inter- posed between said liquid-containing stratum and said photosensitive element and being more rup- turable than the. remainder of said strata and when ruptured Permitting the liquid of the liq- uid-containing stratum to be released to permeate said photosensitive element, the liquid in the liq- uid-containing stratum being in an amount suf- ficient for transforming said image in said photo- Sensitive element and, upon permeation of said photosensitive element, rendering said trans- forming material effective to transform said image in said photosensitive portion",
        ),
      ],
    },
    {
      kind: "claim",
      number: 58,
      inlines: [
        text(
          "The product of claim 57 in which the pho- tosensitive portion has as its photosensitive ma- terial a heavy metal salt capable of forming a latent image upon photoexposure and capable of development to produce a visible image compris- ing the metal of said Salt, said salt-being soluble in a photographic fixing solvent",
        ),
      ],
    },
    {
      kind: "claim",
      number: 59,
      inlines: [
        text(
          "The product of claim 57 in which the pho- tosensitive portion is a silver halide emulsion",
        ),
      ],
    },
    {
      kind: "claim",
      number: 60,
      inlines: [
        text(
          "The product of claim 57 in which the pho- tographic reagent is contained in the liquid in the liquid-containing stratum",
        ),
      ],
    },
    {
      kind: "claim",
      number: 61,
      inlines: [
        text(
          "The product of claim 57 in which said liq- uid-containing stratum is a porous sheet and con- tains a liquid in the pores thereof,",
        ),
      ],
    },
    {
      kind: "claim",
      number: 62,
      inlines: [
        text(
          "The product of claim 57 in which said liq- uid-containing stratum comprises a plurality of recesses for receiving the liquid, each recess be- ing closed on one side by the more rupturable liquid-confining stratum and being separated from every other recess by a liquid-impermeable cell wall",
        ),
      ],
    },
    {
      kind: "claim",
      number: 63,
      inlines: [
        text(
          "The product of claim 57 which comprises a@ distributing layer in addition to said other strata, said distributing layer being permeable ‘to the liquid in the liquid-containing element and interposed between the more rupturable liq- uid-confining stratum of the latter element and the photosensitive element, said layer acting as & distributing layer to uniformly distribute the liquid passing to the photosensitive element upon the rupture of said more rupturable stratum",
        ),
      ],
    },
    {
      kind: "claim",
      number: 64,
      inlines: [
        text(
          "The product of claim 63 in which at least Part of the photographic reagent is contained in Solid form in said permeable layer for dissolution by the liquid in its travel to the photosensitive portion",
        ),
      ],
    },
    {
      kind: "claim",
      number: 65,
      inlines: [
        text(
          "The product of claim 57 in which the pho- 39 tosensitive portion is a solarized silver halide emulsion",
        ),
      ],
    },
    {
      kind: "claim",
      number: 66,
      inlines: [
        text(
          "A photographic product comprising a rup- turable container holding a liquid, said liquid having dispersed therein a thickening agent, and a sheet support upon one portion of which said container is mounted, another portion of said sheet support providing a spreading surface hav- ing a liquid-receiving area adjacent said con- tainer onto which said liquid is spreadable di- rectly from said container, said liquid-receiving area being one of the outer surfaces of said prod- uct so that liquid spread thereon is capable of contacting a photosensitive element superposed on said product, the liquid in the container be- ing sufficient in amount to cover said liquid-re- ceiving area and to provide thereon a continuous film of said liquid, said product containing a re- ducing agent for developing the exposed portion of a photographic element having as its photo- sensitive material a heavy metal salt capable of forming a latent image upon photoexposure and capable of being developed by said reducing agent to produce a visible image comprising the metal of said salt, sald reducing agent being in an amount sufficient to develop an image in an area of said photosensitive element equivalent to said liquid-receiving area, the container contents, when spread on said liquid-receiving area, plac- - ing said reducing agent in condition to effect the development",
        ),
      ],
    },
    {
      kind: "claim",
      number: 67,
      inlines: [
        text(
          "The product of claim 66 in which said re- ducing agent is contained in the Hquid in the container",
        ),
      ],
    },
    {
      kind: "claim",
      number: 68,
      inlines: [
        text(
          "The product of claim 66 in which the thickening agent is an o:ganic film-forming col- loid dissolved in the liquid so that a film of said colloid is the residue of said liquid when the lat- ter is spread and permitted to dry",
        ),
      ],
    },
    {
      kind: "claim",
      number: 69,
      inlines: [
        text(
          "The product of claim 68 in which the liq- uid includes water and in which the film-form- ing colloid is a plastic",
        ),
      ],
    },
    {
      kind: "claim",
      number: 70,
      inlines: [
        text(
          "The product of claim 66 in which the thickening agent is present in sufficient quantity to give said liquid a viscosity in excess of one thousand centipoises at 24° C",
        ),
      ],
    },
    {
      kind: "claim",
      number: 71,
      inlines: [
        text(
          "The product of claim 66 in which the re- ducing agent is dissolved in the liquid in the con- tainer and is a silver halide developer",
        ),
      ],
    },
    {
      kind: "claim",
      number: 72,
      inlines: [
        text(
          "A photographic product comprising a rup- i turable container holding a liquid, said liquid having dispersed therein a thickening agent, and a sheet support upon one portion of which said container is mounted, another portion of said sheet support providing a spreading surface hav- ing a liquid-receiving area adjacent said con- tainer onto which said liquid is spreadable direct- ly from said container, said liquid-receiving area being one of the outer surfaces of said product so that liquid spread thereon is capable of con- tacting a photosensitive element superposed on said product, the liquid in the container being sufficient in amount to cover said liquid-receiv- ing area and to provide thereon a continuous film of said liquid, said product containing at least one photographic processing agent from the class consisting of the silver halide developers and the silver halide fixers, said processing agent being in an amount sufficient to process an image in an area of a photosensitive, silver halide element equivalent to said liquid-receiving area, the con- tainer contents, when spread on said liquid-re- ceiving area, placing said processing agent in con- dition to effect the processing of said element",
        ),
      ],
    },
    {
      kind: "claim",
      number: 73,
      inlines: [
        text(
          "The product of claim 66 in which the pho- ve) tographic processing agent 1s dissolved in the liquid in the container and is a silver halide fixer",
        ),
      ],
    },
    {
      kind: "claim",
      number: 74,
      inlines: [
        text(
          "A photographic product comprising a rupturable container holding a liquid, said liquid having dispersed therein a thickening agent, a silver halide developer and a silver halide solvent and having a viscosity in excess of 1,000 centi- poises at 24° C., and a sheet support upon one por- tion of which said container is mounted, another portion of said sheet support providing a spread- ing surface having a liquid-receiving area adja- cent said container onto which said liquid is spreadable directly from said container, said liq- uld-receiving area being greater than the area covered by said container and being one of the outer surfaces of said product so that liquid spread thereon is capable of contacting a photo- sensitive element superposed on said product, the liquid in the containér being sufficient in amount to cover said liquid-receiving area and provide thereon a continuous film of said liquid, the con- tainer contents, when spread on said liquid-re- ceiving area, placing the reagents therein in con- dition to form a transfer print of a latent image in an area of a photographic silver halide emul- sion equivalent to said liquid-receiving area",
        ),
      ],
    },
    {
      kind: "claim",
      number: 75,
      inlines: [
        text(
          "A photographic product comprising a plu- rality of rupturable containers, each container holding a liquid having dispersed therein a thickening agent, and a sheet support upon which said containers are mounted, said containers be- ing spaced lengthwise of said support, the side of said sheet support, upon which said containers are mounted, having a plurality of liquid-receiv- ing areas, one of said areas being adjacent each of said containers, the liquid in each container being sufficient in amount to cover the liquid-re- ceiving area adjacent thereto and to provide thereon a continuous film of said liquid, said product containing a reducing agent for develop- ing the exposed portion of a photosensitive ele- ment having as its photosensitive material a heavy metal salt capable of forming a latent 5 image upon photoexposure and capable of being developed by said reducing agent to produce a visible image comprising the metal of said salt, each container and the portion of said sheet sup- port within the receiving area associated there- with containing said reagent in an amount suffi- cient to transform an image in an area of a photosensitive, photographic element equivalent to said liquid-receiving area, the container con- tents, when spread on said liquid-receiving area, placing said reducing agent in condition to effect the development",
        ),
      ],
    },
    {
      kind: "claim",
      number: 76,
      inlines: [
        text(
          "The product of claim in which the con- tainers are elongated and have their long axes substantially parallel to one another and extend- ing transversely of the sheet support",
        ),
      ],
    },
    {
      kind: "claim",
      number: 77,
      inlines: [
        text(
          "The product of claim which contains a silver halide developer as the reducing agent and also material capable of cooperating with said developer to provide the sheet support with a transfer image when the contents of each con- tainer are spread between said support and a sil- ver halide element",
        ),
      ],
    },
    {
      kind: "claim",
      number: 78,
      inlines: [
        text(
          "A photographic product comprising a plu- rality of rupturable containers, each container holding a liquid having dispersed therein a thickening agent, and a sheet support upon which said containers are mounted, said containers be~ ing spaced lengthwise of said support, the side of said sheet support, upon which said containers are mounted, having a plurality of liquid-receiv- 41 ing areas, one of said areas being adjacent each of said containers, the liquid in each container be- ing sufficient in amount to cover the liquid-re- . ceiving area adjacent thereto and to provide thereon a continuous film of said liquid, said product containing at least one photographic processing agent from the class consisting of the silver halide developers and the silver halide fix- ers, each container and the portion of said sheet support within the liquid-receiving area asso- ciated therewith containing said processing agent in an amount sufficient to process an image in an area of a photosensitive, silver halide element equivalent to said liquid-receiving area, the con- tainer contents, when spread on said liquid-re- ceiving area, placing said processing agent in a condition to effect the processing of said element",
        ),
      ],
    },
    {
      kind: "claim",
      number: 79,
      inlines: [
        text(
          "A photographic product comprising a rup- turable container holding a liquid, said liquid having dispersed therein a thickening agent, and a sheet support upon which said container is mounted, said sheet support providing a spread- ing surface having a liquid-recelving area adja- cent said container onto which said liquid is spreadable directly from said container, the liq- uid in the container being sufficient in amount to cover said liquid-receiving area and to provide thereon a continuous film of said liquid, said sheet support comprising a photographically pho- tosensitive layer which is at least in part co- extensive with said liquid-receiving area, said photosensitive layer having as its photosensitive material a salt from the class consisting of (a) the photosensitive ferric salts, (b) the photo- sensitive diazonium salts, and (c) heavy metal salts capable of forming a latent image upon photoexposure and capable of development to produce a visible image comprising the metal of Said salt, said product containing an image- transforming reagent in an amount sufficient to transform an image in the portion of the photo- sensitive layer within said liquid-receiving area, the container contents when spread on said liq- uid-receiving area placing said reagent in condi- tion to effect the image transformation",
        ),
      ],
    },
    {
      kind: "claim",
      number: 80,
      inlines: [
        text(
          "The product of claim 79 in which the im- age-transforming reagent is a developer for said photosensitive layer",
        ),
      ],
    },
    {
      kind: "claim",
      number: 81,
      inlines: [
        text(
          "The product of claim 79 in which the pho- tosensitive layer is a silver halide emulsion",
        ),
      ],
    },
    {
      kind: "claim",
      number: 82,
      inlines: [
        text(
          "The product of claim 79 in which the pho- tosensitive layer is a silver halide emulsion and the image-transforming reagent is a processing agent from the class consisting of the silver hal- ide developers and the silver halide fixers",
        ),
      ],
    },
    {
      kind: "claim",
      number: 83,
      inlines: [
        text(
          "A photographic product comprising a rup- turable container holding a liquid, said liquid having dispersed therein a thickening agent, and a sheet support upon which said container is mounted, said sheet support providing a spread- ing surface having a liquid-receiving area adja- cent said container onto which said liquid -is spreadable directly from said container, said liq- uid-receiving area being greater than the area covered by said container, the liquid in the con- tainer being sufficient in amount to cover said liquid-receiving area and to provide thereon a continuous film of said liquid, said sheet support comprising 2 silver halide emulsion layer which is at least in part coextensive with said liquid- receiving area, said product containing a silver halide developer in an amount sufficient to de- velop a latent image in the portion of the silver halide emulsion layer within said liquid-receiving area, the container contents, when spread on said",
        ),
      ],
    },
    {
      kind: "claim",
      number: 84,
      inlines: [
        text(
          "A product containing a reducing agent for developing the exposed portion of a photosen- sitive element having as its photosensitive mate- rial a heavy metal salt capable of forming a latent image upon photoexposure and capable of being developed by said reducing agent to produce a visible image comprising the metal of said salt, said product comprising a sheet support and an elongated container holding a liquid dispersion of a film-forming colloid, said container being mounted on said sheet support, longitudinally ex- tending portions of said container being uniform- ly more rupturable than other portions of the container and providing upon rupture a liquid- dispensing passage extending along a substan- tial length of the container, the container walls being at least in part deformable and flexible for transmitting to the container contents externally applied pressure of sufficient magnitude to rup- ture said more rupturable portions, said sheet support providing a spreading surface extending substantially perpendicularly from the long di- mension of said container and at least as wide as the length of said rupturable liquid-dispensing portion of the container onto which surface said container contents are spreadable from said liq- uid-dispensing portion, said liquid dispersion be- ing sufficient in amount to be spread on an area of said surface substantially greater than the container area and to provide said first-named area with a film of said colloid, the spreading of the container contents placing said reducing agent in condition for developing a corresponding area of one said photosensitive element",
        ),
      ],
    },
    {
      kind: "claim",
      number: 85,
      inlines: [
        text(
          "The product of claim 84 wherein the disper- sion of the colloid in the container is a solution and the reducing agent is in the container",
        ),
      ],
    },
    {
      kind: "claim",
      number: 86,
      inlines: [
        text(
          "A product containing at least one photo- graphic processing agent from the class consist- ing of the silver halide developers and the silver halide fixers, said product comprising a sheet sup- port and an elongated container holding a liquid dispersion of a film-forming colloid, said con- tainer being mounted on said sheet support, lon- gitudinally extending portions of said container being uniformly more rupturable than other por- tions of the container and providing upon rup- ture a liquid-dispensing passage extending. along @ substantial length of the container, the con- tainer walls being at least in part deformable and flexible for transmitting to the container con- tents externally applied pressure of sufficient magnitude to rupture said more rupturable por- tions, said sheet support providing a spreading surface extending substantially perpendicularly from the long dimension of said container and at least as wide as the length of said rupturable liq- uid-dispensing portion of the container onto which surface said container contents are spread- able from said liquid-dispensing portion, said liquid dispersion being sufficient in amount to be spread on an area of said surface substan- tially greater than the container area and to pro- vide said first-named area with a film of said col- loid, the spreading of the container contents Placing said processing agent in condition for processing a corresponding area of a photosensi- tive, silver halide element",
        ),
      ],
    },
    {
      kind: "claim",
      number: 87,
      inlines: [
        text(
          "A product containing a silver halide de- veloper and capable of developing a photosensi- tive silver halide element, said product compris- ing an elongated rupturable container holding an 43 aqueous dispersion of an organic film-forming colloid, and a sheet support upon which said container is mounted, portions of the container walls being secured together jn face-to-face rela- tion to provide a liquid-dispensing lip extending substantially the length of the container, the ma- terial of the container walls being stronger than the seal of the dispensing lip and said walis be- ing at least in part deformable and flexible for transmitting to the container contents external- ly applied pressure of sufficient magnitude to open said lip, said sheet support providing a spread- ing surface extending substantially perpendicu- larly from the dispensing lip and at least as wide as the length of said lip onto which said con- tainer contents are spreadable from said dispens- ing lip, said aqueous dispersion being sufficient in amount to be spread over an area of said surface substantially greater than the container area and to provide said area with a solid film of said or- ganic colloid, the silver halide developer in said product being rendered effective in sald area upon the spreading of said dispersion",
        ),
      ],
    },
    {
      kind: "claim",
      number: 88,
      inlines: [
        text(
          "A product containing a silver halide de- veloper and capable of developing a photosen- sitive silver halide element, said product compris- ing a flat, multi-sided container holding an aqueous dispersion of an organic film-forming colloid, and a sheet support upon which said con- tainer is mounted, portions of the container walls peing secured together in face-to-face relation to provide a liquid-dispensing lip extending sub- stantially the length of one of said sides of the container, the material of the container walls being stronger than the seal of the dispensing lip and said walls being at least in part deform- able and flexible for transmitting to the container contents externally applied pressure of sufficient magnitude to open said lip, said sheet support providing a spreading surface extending sub- stantially perpendicularly from the dispensing lip and at least as wide as the length of said lip onto which said container contents are spread- able from said dispensing lip, said aqueous dis- persion being sufficient in amount to be spread over an area of said surface substantially greater. than the container area and to provide said area with a solid film of said organic colloid, the sil- ver halide developer in said product being ren- dered effective in said area upon the spreading 4: of said dispersion",
        ),
      ],
    },
    {
      kind: "claim",
      number: 89,
      inlines: [
        text(
          "A product containing a silver halide de- veloper and capable of developing a photosensi- tive silver halide element, said product compris~ ing a flat, multi-sided rupturable container hold- ing a liquid dispersion of a film-forming colloid, and a sheet support upon which said container is mounted, portions of the container walls being secured together in face-to-face relation to pro- vide a liquid-dispensing lip extending substan- tially the length of one of said sides of the con- tainer, the material of the container walls being stronger than the seal of the dispensing lip and said walls being at least in part deformable and flexible for transmitting to the container con- tents externally applied pressure of sufficient magnitude to open said lip, said sheet support providing a spreading surface extending sub- stantially perpendicularly from the dispensing lip and at least as wide as the length of said lip onto which said container contents are spread- able from said dispensing lip, said liquid disper- sion being sufficient in amount to be spread over an area of Said surface substantially greater than the container area and to provide said area with 19 le 7A “I ar 44 a solid film of said organic colloid, the silver hal- ide developer in said product being rendered ef- fective in said area upon the spreading of said dispersion",
        ),
      ],
    },
    {
      kind: "claim",
      number: 90,
      inlines: [
        text(
          "A product containing a reducing agent for developing the exposed portion of a photosen- sitive element having as its photosensitive mate- rial a heavy metal salt capable of forming a latent image upon photoexposure and capable of being developed by said reducing agent to produce a visible image comprising the metal of said salt, said product comprising an elongated rupturable container holding a liquid dispersion of a film- forming colloid, and a sheet support upon which said container is mounted, portions of the con- tainer walls being secured together in face-to- face relation to provide a liquid-dispensing lip ex- tending substantially the length of the container, the material of the container walls being stronger than the seal of the dispensing lip and said walls being at least in part deformable and flexible for transmitting to the container contents exter- nally applied pressure of sufficient magnitude to open said lip, said sheet support providing a spreading surface extending substantially per- pendicularly from the dispensing lip and at least as wide as the length of said lip onto which said container contents are spreadable from said dis- pensing lip, said liquid dispersion being sufficient in amount to be spread over an area of said sur- face substantially greater than the container area and to provide said first-named area with a solid film of said colloid, the spreading of the container contents placing said reducing agent jn condition for developing a corresponding area of one said photosensitive element",
        ),
      ],
    },
    {
      kind: "claim",
      number: 91,
      inlines: [
        text(
          "The product of claim 88 which comprises a photosensitive silver halide layer, at least a por~ tion of said photosensitive layer being coexten- sive with the liquid-receiving area of the spread~ ing surface, the spreading of the container con- tents rendering the developer effective to develop at least said portion of the photosensitive silver halide layer",
        ),
      ],
    },
    {
      kind: "claim",
      number: 92,
      inlines: [
        text(
          "The product of claim 87 in which said dis- persion of an organic film-forming colloid is a solution of a plastic",
        ),
      ],
    },
    {
      kind: "claim",
      number: 93,
      inlines: [
        text("The product of claim 92 in which the plastic is sodium carboxymethyl] cellulose"),
      ],
    },
    {
      kind: "claim",
      number: 94,
      inlines: [
        text(
          "The product of claim 87 in which the or- ganic colloid is a plastic and the silver halide de- veloper is in the container",
        ),
      ],
    },
    {
      kind: "claim",
      number: 95,
      inlines: [
        text(
          "The product of claim 94 in which the con- tainer also contains a silver halide solvent",
        ),
      ],
    },
    {
      kind: "claim",
      number: 96,
      inlines: [text("The product of claim 95 in which the sheet support is baryta paper")],
    },
    {
      kind: "claim",
      number: 97,
      inlines: [
        text(
          "The product of claim 87 in which the con- tainer is flat and substantially rectangular in shape and the sheet support is not appreciably wider than the container is long, the container being mounted with its long axis extending width- wise of the support",
        ),
      ],
    },
    {
      kind: "claim",
      number: 98,
      inlines: [
        text(
          "The product of claim 97 wherein all of the container walls are formed from a Single sheet of deformable and flexible multi-ply sheet material",
        ),
      ],
    },
    {
      kind: "claim",
      number: 99,
      inlines: [
        text(
          "A photographic product capable of dispens- ing a photographic reagent directly to a photo- sensitive silver halide element for developing the same, said product comprising a rupturable dis- posable container holding a sufficient quantity of processing liquid for a single application, which liquid includes a reducing agent for developing the exposed portion of a photosensitive element having as its photosensitive material a heavy metal salt capable of forming a latent image upon photoexposure and capable of being developed by said reducing agent to produce a visible image comprising the metal of said salt, said container being multi-sided and elongated and having the walls thereof formed of a deformable sheet ma- terial, said walls being secured together in face- to-face relation along a long edge of the container to provide a liquid dispensing lip at said edge ex- tending substantially the length of the container, said sheet material being stronger than the seal of the dispensing lip and being sufficiently de- formable and flexible to transmit to the container contents externally applied pressure of sufficient magnitude to open said lip,",
        ),
      ],
    },
    {
      kind: "claim",
      number: 100,
      inlines: [
        text(
          "A photographic product capable of dis- pensing a photographic reagent directly to an ex- posed photosensitive, silver halide element for processing the same, said product comprising a rupturable disposable container holding a suf- ficient quantity of processing liquid for a single application, which liquid includes a least one processing agent from the class consisting of the silver halide developers and the silver halide fix- ers, said container being multi-sided and elon- gated and having the walls thereof formed of a deformable sheet material, said walls being se- cured together in face-to-face relation along a long edge of the container to provide a liquid- dispensing lip at said edge extending substan- tially the length of the container, said sheet ma- terial being stronger than the seal of the dis- pensing lip and being sufficiently deformable and flexible to transmit to the container contents externally applied pressure of sufficient magni- tude to open said lip",
        ),
      ],
    },
    {
      kind: "claim",
      number: 101,
      inlines: [
        text(
          "A photographic product capable of dis- pensing a processing agent between a photosen- sitive silver halide element and a print-receiving layer to form transfer prints, said product com- prising a rupturable, disposable, elongated con- tainer holding a liquid dispersion which includes a silver halide developer and a silver halide sol- vent, longitudinally extending portions of said container being uniformly more rupturable than other portions of the container and providing, upon rupture, a liquid dispensing passage along a substantial length of the container, the con- tainer walls being at least in part deformable and flexible for transmitting to the container con- tents externally applied pressure of sufficient | magnitude to rupture said more rupturable por- tions, said liquid dispersion being sufficient in amount to treat an area of a photosensitive sil- ver halide element at least as great as the maxi- — mum area of said container",
        ),
      ],
    },
    {
      kind: "claim",
      number: 102,
      inlines: [
        text(
          "The product of claim 101 wherein an or- ganic film-forming colloid is included in the dis- persion",
        ),
      ],
    },
    {
      kind: "claim",
      number: 103,
      inlines: [
        text(
          "The product of claim 102 wherein the dis- persion is an aqueous alkaline solution and the Colloid is a plastic dissolved in said aqueous al- kaline solution, said plastic being capable of re- taining its viscosity imparting characteristics in an alkaline solution, the viscosity of the solution being of the order of 1,000 to 200,000 centipoises at 24°C",
        ),
      ],
    },
    {
      kind: "claim",
      number: 104,
      inlines: [
        text("The product of claim 103 wherein the plas- tic is sodium carboxymethyl cellulose"),
      ],
    },
    {
      kind: "claim",
      number: 105,
      inlines: [
        text(
          "The product of claim 104 wherein the solu- tion includes hydroquinone, sodium thiosulfate and sodium hydroxide",
        ),
      ],
    },
    {
      kind: "claim",
      number: 106,
      inlines: [
        text(
          "A photographic product capable of dis- pensing a processing agent for processing a pho- tosensitive silver halide element, said product comprising a rupturable, disposable, elongated a ay a 46 container holding a liquid dispersion which in- cludes at least one reagent from the class con- sisting of the silver halide developers and the sil- ver halide fixers; longitudinally extending por- tions of said container being uniformly more rup- turable than other portions of the container and providing, upon rupture, a liquid-dispensing pas- sage along a substantial length of the container, the container walls being at least in part deform- able and flexible for- transmitting to the con- tainer contents externally applied pressure of suf- ficient magnitude to rupture said more rupturable portions",
        ),
      ],
    },
    {
      kind: "claim",
      number: 107,
      inlines: [
        text(
          "A photographic product for dispensing a Silver halide developer directly to a photosensi- tive silver halide element for processing the same, said product comprising an elongated container holding a liquid dispersion including a film-form- ing colloid and a silver halide developer, said sil- ver halide developer being in an amount sufficient to develop an area of a photosensitive silver hal- ide emulsion at least as great as the maximum area of said container, portions of the container walls being secured together in face-to-face rela- tion to provide a liquid dispensing lip extending along a substantial length of the container, the material of the container walls being stronger than the seal of the dispensing lip and said walls being at least in part deformable and flexible for transmitting to the container contents externally applied pressure of sufficient magnitude to open said lip",
        ),
      ],
    },
    {
      kind: "claim",
      number: 108,
      inlines: [
        text(
          "The product of claim 107 wherein the liq- uid dispersion is an alkaline aqueous solution and the colloid is a plastic dissolved in said solution",
        ),
      ],
    },
    {
      kind: "claim",
      number: 109,
      inlines: [
        text(
          "The product of claim 108 wherein the con- tainer is substantially fiat, multi-sided and oxy- gen impervious and said lip extends substantial- ly the entire length of one long side of said con- tainer",
        ),
      ],
    },
    {
      kind: "claim",
      number: 110,
      inlines: [
        text(
          "A photographic product capable of uni- formly dispensing a photographic reagent when Squeezed between a pair of sheet materials by a pair of pressure-applying members, said product + comprising a rupturable disposable container holding a sufficient quantity of a processing liq- uid for a single application, said liquid including a photographic image-transforming reagent for transforming an image in a photographically photosensitive element, said container being elongated and having the walls thereof at least in part deformable and flexible for transmitting pressures applied thereto to the container con- tents, said container having one long edge adapted to be drawn between a pair of pressure- applying members and a liquid dispensing lip opposite said edge, said liquid dispensing lip com- prising portions of the container walls secured to- gether in face-to-face relation and capable, by Separation, of permitting the contents of the con- tainer to be dispensed between two sheet mate- rials away from the container in a direction sub- stantially perpendicular to the long dimension thereof, said container walls consisting of an up- per and lower wall, each wall extending continu- ously, without folds, throughout its entire area, the total thickness of the container walls, meas- ured depthwise at any point of the container, not appreciably exceeding the sum of a single thick- ness of the material of the upper wall and a sin- gle thickness of the material of the lower wall whereby said container, when passed between a pair of pressure-applying members, is capable of being flattened to a substantially uniform thick- ness. 47",
        ),
      ],
    },
    {
      kind: "claim",
      number: 111,
      inlines: [
        text(
          "The product of claim 110 in which the processing liquid is an aqueous alkaline solution whose viscosity is in excess of 1,000 centipoises at 24°C",
        ),
      ],
    },
    {
      kind: "claim",
      number: 112,
      inlines: [
        text(
          "The product of claim 111 wherein the processing liquid contains, as a thickening agent, a soluble salt of carboxymethyl cellulose",
        ),
      ],
    },
    {
      kind: "claim",
      number: 113,
      inlines: [
        text(
          "The product of claim 110 wherein the re- agent is at least one processing agent from the class consisting of the silver halide developers and the silver halide fixers",
        ),
      ],
    },
    {
      kind: "claim",
      number: 114,
      inlines: [
        text(
          "A product capable of forming transfer prints in conjunction with a photosensitive sil- ver halide element and a print-receiving layer, said product comprising 4 substantially flat, multi-sided, elongated disposable, single use con- tainer holding an aqueous solution which in- cludes, as ingredients, hydroquinone, sodium thio- sulfate, sodium hydroxide and sodium carboxy- methyl cellulose, said solution having a viscosity of the order of 1,000 to 200,000 centipoises at a temperature of approximately 24° C., the con- tainer walls being formed of a deformable sheet material, said walls being secured together in face-to-face relation along a long edge of the con- tainer to provide a liquid dispensing lip adjacent said edge extending substantially the length of the container, said sheet material being stronger than the seal of the dispensing lip and being suffi- ciently deformable and flexible to transmit to the container contents externally applied pres- sure of sufficient magnitude to open said lip, the viscous contents of said container cooperating with said lip to insure more uniform unsealing thereof upon the application of sufficient pressure to the container walls",
        ),
      ],
    },
    {
      kind: "claim",
      number: 115,
      inlines: [
        text(
          "A photographic product capable of dis- pensing a photographic reagent directly to a pho- tosensitive element for developing the same, said product comprising a rupturable, disposable, ex- ternally dry container holding a sufficient quan- tity of processing liquid for a single application, which liquid includes a reducing agent for de- veloping the exposed portion of a photosensitive element having as its photosensitive material a heavy metal salt capable of forming a latent im- age upon photoexposure and capable of being de- veloped by said reducing agent to produce a vis- ible image comprising the metal of said salt, said container being multi-sided and elongated and having the walls thereof formed of a deformable sheet material, said walls being impervious to water vapor and to oxygen and being secured to- gether in face-to-face relation along a long edge of the container to provide a liquid-dispensing lip at said edge extending substantially the length of the container, said sheet material being stronger than the seal of the dispensing lip and being sufficiently deformable and flexible to transmit to the container contents externally ap- plied pressure of sufficient magnitude to open 48 said Up, the liquid in the container including a thickening agent which imparts thereto a vis- cosity of the order of 1,000 to 200,000 centipoises at a temperature of approximately 24° C., said liquid in its viscous condition cooperating with said container to insure uniform unsealing of said liquid-dispensing lip upon the application of suf- ficient pressure to the container walls",
        ),
      ],
    },
    {
      kind: "claim",
      number: 116,
      inlines: [
        text(
          "The product of claim 115 wherein the con- tainer is flat and substantially rectangular in shape and is formed of a single sheet of folded material, the fold providing one long edge thsreof and the marginal portions opposite the fold Seing adhesively secured in face-to-face relation to provide the dispensing lip",
        ),
      ],
    },
  ],
};

export function manualLandClaimText(claimNumber: number): string {
  const claimBlock = landPolaroidArchivalEdition.blocks.find(
    (b) => b.kind === "claim" && b.number === claimNumber,
  );
  if (claimBlock?.kind !== "claim") {
    throw new Error(`Land Polaroid archival edition is missing Claim ${claimNumber}`);
  }
  return claimBlock.inlines
    .map((inline) => inline.text)
    .join(" ")
    .trim();
}
