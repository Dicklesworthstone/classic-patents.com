/**
 * carlsonElectrophotographyEdition.ts
 *
 * Hand-annotated Archival Edition for Chester F. Carlson's foundational 1942
 * Electrophotography & Xerography Patent (US Patent 2,297,691).
 *
 * Transcribed, annotated, and pinned against the 10-page authentic facsimile PDF
 * at public/patents/pdfs/us-2297691-carlson-electrophotography.pdf (SHA-256: 5b521a7f4b7fad3c258cc3b5bbbae2d593a28f03641e78938ec73e3fdbab8422).
 *
 * WIP / WITHHELD: the existing candidate is not a publication edition. The
 * page-complete literal reading, Luna visual comparison, source-pixel crops,
 * and paragraph companions still require completion. Keep the attestation
 * false until those source-led gates are complete.
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
  "/patents/figures/us-2297691-carlson-electrophotography/fig-1-source-crop-v2.png": {
    width: 488,
    height: 188,
  },
  "/patents/figures/us-2297691-carlson-electrophotography/fig-2-source-crop-v2.png": {
    width: 487,
    height: 188,
  },
  "/patents/figures/us-2297691-carlson-electrophotography/fig-2a-source-crop-v1.png": {
    width: 600,
    height: 400,
  },
  "/patents/figures/us-2297691-carlson-electrophotography/fig-2b-source-crop-v1.png": {
    width: 600,
    height: 400,
  },
  "/patents/figures/us-2297691-carlson-electrophotography/fig-3-source-crop-v2.png": {
    width: 488,
    height: 306,
  },
  "/patents/figures/us-2297691-carlson-electrophotography/fig-4-source-crop-v2.png": {
    width: 487,
    height: 306,
  },
  "/patents/figures/us-2297691-carlson-electrophotography/fig-5-source-crop-v2.png": {
    width: 488,
    height: 290,
  },
  "/patents/figures/us-2297691-carlson-electrophotography/fig-6-source-crop-v2.png": {
    width: 487,
    height: 290,
  },
  "/patents/figures/us-2297691-carlson-electrophotography/fig-7-source-crop-v2.png": {
    width: 488,
    height: 256,
  },
  "/patents/figures/us-2297691-carlson-electrophotography/fig-8-source-crop-v2.png": {
    width: 487,
    height: 256,
  },
  "/patents/figures/us-2297691-carlson-electrophotography/fig-9-source-crop-v2.png": {
    width: 975,
    height: 648,
  },
  "/patents/figures/us-2297691-carlson-electrophotography/fig-10-source-crop-v2.png": {
    width: 975,
    height: 681,
  },
};

const ref = (
  refText: string,
  targetHref: string,
  targetLabel: string,
  previewSrc?: string | readonly string[],
): CuratedSpecificationInline => {
  const previewSources = previewSrc
    ? typeof previewSrc === "string"
      ? [previewSrc]
      : previewSrc
    : [];
  return {
    kind: "reference",
    text: refText,
    href: targetHref,
    referenceType: "figure",
    label: targetLabel,
    figurePreviews:
      previewSources.length > 0
        ? previewSources.map((src) => {
            const dims = FIGURE_DIMENSIONS[src] ?? { width: 800, height: 600 };
            return { src, alt: targetLabel, width: dims.width, height: dims.height };
          })
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
    "The patent states that the invention concerns photography and seeks improved photographic methods, means, and devices.",
  ],
  4: [
    "Carlson says that additional objects will emerge from the description, the accompanying drawing, and the appended claims.",
  ],
  5: [
    "The invention is defined through construction, element combinations, part arrangements, manufacturing methods, and operating methods illustrated in the disclosure.",
  ],
  6: [
    "The drawing index identifies Fig. 1 as the charged photographic plate, Figs. 2, 2a, and 2b as three exposure methods, Figs. 3 and 4 as development, Fig. 5 as transfer, Figs. 6 and 7 as fixing, Fig. 8 as modified charging, Fig. 9 as another development method, and Fig. 10 as a half-tone enlargement.",
  ],
  7: [
    "Carlson locates the invention in the use of photoelectric or photoconductive materials for photographic purposes.",
  ],
  8: [
    "The preferred materials insulate in darkness, become partly conductive under illumination, and return to insulation when the light is removed.",
  ],
  9: [
    "The photoconductive material controls electric charge to create an invisible electrostatic latent image that is later developed into a visible picture.",
  ],
  10: [
    "Fig. 1 is a plate cross-section with thin photoconductive layer 21 bonded to metal plate 22.",
  ],
  11: [
    "The specified candidates for layer 21 include sulfur, anthracene, anthraquinone, sulfur-selenium mixtures, sulfur-anthracene mixtures and reaction products, and sulfur-treated linseed oil.",
  ],
  12: ["Other materials are permitted when they retain insulating behavior in darkness."],
  13: [
    "Backing plate 22 may be zinc, aluminum, or brass, and etching the metal can improve adhesion of the photoconductive layer.",
  ],
  14: [
    "Sulfur coating is made by melting crystals on etched metal, flowing the melt evenly, cooling, and optionally smoothing it with emery paper and chalk.",
  ],
  15: [
    "Anthracene and anthraquinone form thin glossy layers when melted on etched metal and rapidly cooled.",
  ],
  16: [
    "Volatile anthracene or anthraquinone requires a spaced cover that preserves a nearly saturated vapor atmosphere near the coated plate.",
  ],
  17: [
    "A heated shallow dish can evaporate anthracene or anthraquinone onto a metal plate until the deposit sinters or fuses, followed by slow cooling.",
  ],
  18: [
    "Other listed materials can be layered by melting or spreading them on a suitable support according to their material properties.",
  ],
  19: [
    "The layers remain insulating in darkness, preventing charge from traversing the layer while unilluminated.",
  ],
  20: [
    "Because the charge is retained, the layer remains useful for producing and using the latent electrostatic image.",
  ],
  21: [
    "Carlson distinguishes these layers from ordinary photoelectric-cell semiconductors, which conduct better in light but do not retain a rubbed charge in darkness.",
  ],
  22: [
    "Rubbing and immediately dusting a conventional semiconductor demonstrates that its charge drains away because no powder adheres electrostatically.",
  ],
  23: [
    "Anthracene is described as most photoelectrically conductive under incandescent Eastman Photoflood illumination, followed by anthraquinone and sulfur.",
  ],
  24: [
    "Material sensitivity varies with wavelength: sulfur peaks near 4700 Angstroms in blue-violet light, while anthracene responds more strongly in the green region.",
  ],
  25: [
    "Other photoconductors may respond more strongly to ultra-violet radiation, so the source does not limit the process to visible light.",
  ],
  26: [
    "Thin layers, roughly a thousandth to a few hundredths of an inch, are preferred so exposure light can penetrate the material.",
  ],
  27: [
    "The layer may be continuous, glassy, crystalline, discontinuous in tiny areas, porous, or pitted.",
  ],
  28: [
    "Fig. 1's charging operation rubs the surface with cotton, silk, a brush, or fur, preferably in darkness so the charge remains uniform.",
  ],
  29: [
    "Grounding backing plate 22 creates a high potential difference and strong electric field through layer 21.",
  ],
  30: [
    "Figs. 2, 2a, and 2b provide alternative ways to expose the charged layer to the image being reproduced.",
  ],
  31: [
    "Fig. 2 places plate 20 in camera 24 so original 25 is focussed on layer 21; exposure ranges from seconds to minutes according to sensitivity and illumination.",
  ],
  32: [
    "Original 25 may be printed or typed paper, a drawing, or a three-dimensional object photographed by the camera.",
  ],
  33: [
    "Incandescent lamps 26 illustrate illumination, while sunlight or ultra-violet lamps may be substituted according to object and spectral response.",
  ],
  34: [
    "Illuminated layer regions become more conductive and drain charge through layer 21 to metal plate 22.",
  ],
  35: [
    "Unilluminated regions retain charge, leaving charge beneath dark original areas while white areas discharge.",
  ],
  36: [
    "Fig. 2a handles a transparency or translucent original 27 with image 28 placed against layer 21 and illuminated by source 26.",
  ],
  37: [
    "The Fig. 2a contact exposure ordinarily lasts from a fraction of a second to a few seconds.",
  ],
  38: [
    "Fig. 2b handles a small film or lantern slide 30, including microfilm or motion-picture film, projected through projector 29 onto layer 21.",
  ],
  39: [
    "Exposure is regulated so bright regions lose most but not all charge and half-bright regions lose approximately half their charge.",
  ],
  40: [
    "The layer behaves as many parallel charged condenser-resistance elements, each with its own discharge rate.",
  ],
  41: [
    "Because discharge curves approach zero, excessive exposure erases contrast; exposure stops on the steeper part of the charge-versus-time curve.",
  ],
  42: [
    "Exposure may range from fractions of a second to several minutes, but high-contrast originals make timing less critical.",
  ],
  43: [
    "After the Fig. 2 family of exposures, Figs. 3 and 4 develop the latent image by dusting the plate with powder 31 from screened can 32.",
  ],
  44: [
    "The process is expressly extended from individual reproductions to masters used for making multiple lithographic or typographical copies.",
  ],
  46: [
    "Lithographic masters may begin with the same charging, exposure, and development sequence illustrated by Figures 1 through 4.",
  ],
  47: [
    "The development powder for lithography must be wettable by lithographic ink so the finished master accepts ink selectively.",
  ],
  48: [
    "Copal, sandarac, Vinsol, rosin, and hard waxes are suitable resins; crayon material or fatty additives can improve image adherence.",
  ],
  49: [
    "The transfer sheet can be a specially prepared etched aluminum or zinc plate of the type used for offset lithography.",
  ],
  50: [
    "Commercial Duplimat paper or parchment-like sheets for Multilith machines are also identified as usable lithographic sheets.",
  ],
  51: [
    "Heating melts the resin or wax image onto the sheet, after which offset ink adheres to letters rather than the water-wetted background.",
  ],
  52: [
    "An etched aluminum or zinc lithographic plate can carry an anthracene or anthraquinone photoconductive coating made by the earlier coating methods.",
  ],
  53: [
    "The coated lithographic plate is exposed and dusted with resin powder using the previously described electrophotographic process.",
  ],
  54: [
    "Controlled heating evaporates anthracene or melts the resin, leaving a fixed resin image on the lithographic plate.",
  ],
  55: [
    "The lithographic method uses all resin attached to the latent image and may require a 45-degree photostat mirror or reversed contact placement to avoid a mirror-reverse master.",
  ],
  57: ["The same process can create typographical printing cuts or relief surfaces."],
  58: [
    "A resin dust image on an anthracene or anthraquinone-coated zinc or copper block is heated, cooled, and acid-etched so uncovered metal is removed and the image remains in raised relief.",
  ],
  59: ["The resulting raised cut is usable for ordinary printing."],
  61: ["Electrophotographic masters can also be prepared for hectograph copying."],
  62: ["The hectograph uses a pan containing a layer of gelatin compound."],
  63: [
    "A strong dye such as crystal violet, or dye compounded with gelatin and reduced to fine powder, forms the dust image.",
  ],
  64: [
    "Pressing the dusted plate against gelatin transfers dye into the gelatin surface, from which copy sheets are pressed one at a time.",
  ],
  65: [
    "The original exposure for a hectograph should create a mirror-reverse on the gelatin so transferred copies read correctly.",
  ],
  66: [
    "A thin gelatin coating on a backing sheet can replace the pan, with copies run through a rotary-cylinder copying machine.",
  ],
  67: ["Hectograph dust should be an alcohol-soluble dye or dye composition."],
  68: [
    "Rhodamine, Victoria blue, Victoria green, crystal violet, nigrosine, methyl violet, and induline are listed dyes, alone or in alcohol-soluble resin.",
  ],
  69: [
    "The dye image may be transferred to paper and melted onto it or fixed by slight wetting with alcohol.",
  ],
  70: [
    "A rotary duplicator drum can carry the master while alcohol-moistened blank sheets pick up successive portions of dye.",
  ],
  71: [
    "Pure dye may instead be transferred to a prepared adhesive sheet, such as one carrying meltable resin.",
  ],
  72: [
    "Dyed resin can be melted onto the photoconductive layer itself; a volatile photoconductor can then be evaporated so the image melts onto the metal backing.",
  ],
  73: [
    "The resulting picture is a form of half tone suitable for lithographic or hectographic pictorial reproduction and half-tone cuts.",
  ],
  74: [
    "Figure 10 magnifies a dusted electrostatic eye image: dense particles mark dark eyelash and pupil regions, while lighter regions have separated particles and white regions have none.",
  ],
  75: [
    "Fusible resin particles can be melted into tiny printing areas; in half-tone cuts they protect the backing while uncovered metal is etched away.",
  ],
  76: [
    "Conventional half tones can also be made with a camera half-tone screen or by photographing a half-tone original.",
  ],
  78: [
    "A standalone photoconductive sheet can use a conductive backing only by contact during exposure to drain the charge.",
  ],
  79: [
    "Photoconductive materials such as anthracene can be impregnated into pure cellulose paper with a surface layer as well as internal impregnation.",
  ],
  80: [
    "The preferred paper method melts the material into the sheet, though solution deposition is also possible; pressure-contact backing is needed only during exposure.",
  ],
  81: [
    "Paper may first receive conductive silver or conductive compounds, then receive the photoconductive coating or impregnation after washing away residual chemicals.",
  ],
  82: [
    "Another electrophotographic sheet coats paper with bronze or carbon conductive powder in a binder and applies or impregnates the photoconductor into that conductive surface.",
  ],
  83: [
    "The conductive layer may be sprayed, painted, or rolled into the paper before applying the photoconductor, and in some cases afterward.",
  ],
  85: [
    "Colored powders permit copies in any color, either matching or differing from the original.",
  ],
  86: [
    "Color photography uses filter-separated exposures, colored powder development for each color, and superimposition on one copy sheet.",
  ],
  88: [
    "The process is simple and rapid: a complete permanent copy can take only seconds, without complex chemical development, and the operations can be mechanized.",
  ],
  89: [
    "Sensitized plates are reusable after brushing off and recharging; the layer should be nonreactive and non-hygroscopic because humid air and moisture destroy insulation.",
  ],
  90: [
    "Unlike ordinary photographic plates, the plate need not be stored in darkness because it is charged immediately before each exposure.",
  ],
  91: [
    "The process covers copying letters, drawings, printed and typewritten matter, microfilm enlargement, pictorial and color photography, half-tone production, and lithographic, hectographic, or typographical masters.",
  ],
  92: [
    "In the specification and claims, light includes visible radiation and other radiation affecting the photoconductor, including ultraviolet and infrared.",
  ],
  93: [
    "The application is a continuation in part of Carlson's prior-filed copending application S. N. 169,630, filed October 18, 1937.",
  ],
  94: [
    "The described embodiments do not limit the invention; the claims are intended to cover it broadly within their spirit and scope.",
  ],
};

export const carlsonElectrophotographyArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "5b521a7f4b7fad3c258cc3b5bbbae2d593a28f03641e78938ec73e3fdbab8422",
  preparedBy: "Classic Patents editorial agent (SunnyCitadel; WIP only)",
  preparedAt: "2026-08-21",
  // WIP: a Luna visual pass and source-pixel crops are still outstanding.
  completeFacsimileReviewed: false as unknown as true,
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
        "This invention relates to photography. An object of the invention is to improve methods of photography and to provide improved means and devices for use in photography.",
      ),
    ),
    p(
      text(
        "Other objects of the invention will be apparent from the following description and accompanying drawing taken in connection with the appended claims.",
      ),
    ),
    p(
      text(
        "The invention comprises the features of construction, combination of elements, arrangement of parts, and methods of manufacture and operation referred to above or which will be brought out and exemplified in the disclosure hereinafter set forth, including the illustration in the drawing.",
      ),
    ),
    p(
      text("In the drawing, "),
      ref(
        "Figure 1",
        "#fig-1",
        "Photographic plate and charging method",
        "/patents/figures/us-2297691-carlson-electrophotography/fig-1-source-crop-v2.png",
      ),
      text(
        " is a section through a photographic plate and illustrates a preferred method of applying an electric charge preparatory to photographic exposure. ",
      ),
      ref("Figures 2, 2a and 2b", "#fig-2a-2b", "Three exposure methods", [
        "/patents/figures/us-2297691-carlson-electrophotography/fig-2-source-crop-v2.png",
        "/patents/figures/us-2297691-carlson-electrophotography/fig-2a-source-crop-v1.png",
        "/patents/figures/us-2297691-carlson-electrophotography/fig-2b-source-crop-v1.png",
      ]),
      text(" illustrate three methods of photographically exposing the plate. "),
      ref("Figures 3 and 4", "#fig-3-4", "Electrostatic latent-image development", [
        "/patents/figures/us-2297691-carlson-electrophotography/fig-3-source-crop-v2.png",
        "/patents/figures/us-2297691-carlson-electrophotography/fig-4-source-crop-v2.png",
      ]),
      text(" show a method of developing the electrostatic latent image. "),
      ref(
        "Figure 5",
        "#fig-5",
        "Image transfer",
        "/patents/figures/us-2297691-carlson-electrophotography/fig-5-source-crop-v2.png",
      ),
      text(" shows a method of transferring the image to a sheet such as paper. "),
      ref("Figures 6 and 7", "#fig-6-7", "Image fixing", [
        "/patents/figures/us-2297691-carlson-electrophotography/fig-6-source-crop-v2.png",
        "/patents/figures/us-2297691-carlson-electrophotography/fig-7-source-crop-v2.png",
      ]),
      text(" illustrate methods of fixing the image onto the sheet. "),
      ref(
        "Figure 8",
        "#fig-8",
        "Modified charging and exposure",
        "/patents/figures/us-2297691-carlson-electrophotography/fig-8-source-crop-v2.png",
      ),
      text(" illustrates a modified means for charging and exposing the plate. "),
      ref(
        "Figure 9",
        "#fig-9",
        "Another development method",
        "/patents/figures/us-2297691-carlson-electrophotography/fig-9-source-crop-v2.png",
      ),
      text(" shows another method of developing the image, and "),
      ref(
        "Figure 10",
        "#fig-10",
        "Half-tone enlargement",
        "/patents/figures/us-2297691-carlson-electrophotography/fig-10-source-crop-v2.png",
      ),
      text(" is an enlargement of a half-tone produced by the process."),
    ),
    p(
      text("A feature of the present invention resides in the use of "),
      term(
        "photoelectric or photoconductive materials",
        "Light-responsive materials whose electrical behavior changes under illumination and is used to control charge in the photographic process.",
      ),
      text(" for photographic purposes."),
    ),
    p(
      text(
        "In its preferred form the invention involves materials which are insulators in the dark but become partial conductors when illuminated. They become insulating again when the light is cut off. They can be called ",
      ),
      term(
        "photoconductive insulating materials",
        "Materials that retain surface charge in darkness but become partially conductive during illumination, allowing selective charge dissipation.",
      ),
      text("."),
    ),
    p(
      text(
        "In carrying out the invention the photoconductive insulating material is used to control electric charges so as to produce an ",
      ),
      term(
        "electrostatic latent image",
        "An invisible surface-charge pattern produced by selective light discharge and later made visible with powder.",
      ),
      text(". The electrostatic latent image is then developed to make a visible picture."),
    ),
    p(
      text(
        "The cross-section shows a photographic plate according to the invention comprising a thin layer 21 of photoconductive insulating material bonded to a metal plate 22.",
      ),
    ),
    p(
      text(
        "A variety of materials may be used for layer 21, including sulfur, anthracene, anthraquinone, melted mixtures of sulfur and selenium with sulfur predominating, melted mixtures of sulfur with up to a few percent of anthracene, a compound formed by heating and melting together sulfur and anthracene in proportions of about 1 part sulfur to three parts anthracene by weight until reaction is complete, and linseed oil boiled with sulfur and dried in a thin layer.",
      ),
    ),
    p(
      text(
        "Other photoconductive materials having insulating characteristics in the dark may also be used. The plate 22 may be of almost any suitable metal which does not deleteriously react with the photoconductor used. Zinc or aluminum plates are suitable for sulfur and anthracene layers. Brass may also be used. The surface of the metal may be etched to improve the adherence of the photoconductive layer.",
      ),
    ),
    p(
      text(
        "Sulfur-coated plates may be prepared by placing a few crystals of pure sulfur onto the etched surface of the metal plate and heating the plate until the sulfur melts, then flowing the sulfur uniformly over the surface and allowing any excess to run off, and cooling the plate to solidify the layer. If desired the layer can be made thinner and smoothed with fine emery paper after it has solidified, finishing with a polishing powder such as chalk.",
      ),
    ),
    p(
      text(
        "Anthracene and anthraquinone-coated plates may be made by melting the material onto an etched metal plate and quickly cooling the plate in cold water, whereby a thin glossy layer is obtained on the plate. Because of the strong tendency of these materials to sublime or evaporate when heated to their melting point it is necessary to provide a cover spaced slightly from the metal plate so as to preserve a nearly ",
      ),
      term(
        "saturated vapor atmosphere",
        "A near-saturated vapor space maintained above a volatile coating to reduce material loss during heating and exposure.",
      ),
      text(" adjacent the surface."),
    ),
    p(
      text(
        "Another method is to cover a shallow dish containing anthracene or anthraquinone with a metal plate and heat to evaporate the material and condense it onto the metal plate, the heating being continued until the material sinters or fuses to the metal plate, the assembly then being allowed to cool slowly. The other materials can be made into layers by melting or spreading onto suitable surfaces, the procedure in each case depending upon the nature of the material used.",
      ),
    ),
    p(
      text(
        "The materials described above are all insulators. Sulfur, for example, is one of the best insulators known. If any of them is made into a thin layer and an electric charge is applied on one side of the layer, it will be substantially prevented from passing through the layer to the other side while the layer remains unilluminated. Hence such layers will hold an electric charge for a length of time sufficient for the production and utilization of an electrostatic latent image.",
      ),
    ),
    p(
      text("These materials are distinguished from the "),
      term(
        "semi-conductors",
        "Ordinary photoelectric-cell semiconductors conduct better in light but do not retain a rubbed surface charge in darkness.",
      ),
      text(
        " commonly used in photoelectric cells, such as cuprous oxide or the metallic variety of selenium. The semi-conductors, while of better conductivity in the light than in the dark, will not hold an electrostatic charge on their surface even in the dark. This can be demonstrated by frictionally rubbing the surface of one of these semi-conductors with a cloth or brush and then immediately dusting the surface with an electroscopic powder, such as lycopodium powder. None of the powder will adhere by electrostatic attraction, indicating that any charge developed by rubbing has immediately drained off through the layer.",
      ),
    ),
    p(
      text(
        "Anthracene appears to have the highest photoelectric conductivity when exposed to incandescent light, such as the light from an Eastman Photoflood lamp. Anthraquinone and sulfur appear to be next in sensitivity in the order named. The sensitivity varies with the wavelength of the light source used. Sulfur, for example, has its maximum sensitivity at about 4700 Angstroms, that is, in the blue-violet part of the spectrum. Anthracene appears to have greater sensitivity to rays in the region of the wavelength of green light. Other materials may be more conductive under ultra-violet radiation.",
      ),
    ),
    p(
      text(
        "The layers should preferably in all cases be made quite thin, such as in the order of a thousandth to a few hundredths of an inch thick. Thicker layers may sometimes be used, it being preferable, however, to have the layer thin enough to allow light to penetrate entirely through the layer during exposure. The layer may be continuous and glassy in appearance or may be somewhat crystalline in nature. Or it may be discontinuous, that is, made up of a multiplicity of tiny individual areas of photoconductive insulating material, or the material may be formed into a more or less porous or pitted layer.",
      ),
    ),
    p(
      text(
        "The surface of the photoconductive insulating layer is first charged by rubbing it vigorously with a soft material such as a cotton or silk handkerchief 23 as indicated in ",
      ),
      ref(
        "Figure 1",
        "#fig-1",
        "Charging with handkerchief 23",
        "/patents/figures/us-2297691-carlson-electrophotography/fig-1-source-crop-v2.png",
      ),
      text(
        ". A soft brush or a fur may also be used. The layer should be rubbed in the dark so that it will be at its highest insulating value and hence will retain the charge uniformly distributed on its surface. In some cases, however, where photoelectric materials of low sensitivity are used it will be sufficient to work in subdued light, total darkness not being required.",
      ),
    ),
    p(
      text(
        "By rubbing the surface of the layer vigorously in the manner described a strong and uniformly distributed electric charge is developed at the surface and remains held on the insulating surface while the layer is kept in comparative darkness. Since the backing plate 22 is ordinarily grounded by contact with other surfaces there will exist a high potential difference between the charged surface and the plate resulting in a strong electric field through layer 21.",
      ),
    ),
    p(
      text(
        "The layer is now immediately exposed to the light image or pattern which it is desired to reproduce. ",
      ),
      ref("Figures 2, 2a and 2b", "#fig-2a-2b", "Alternative exposure methods", [
        "/patents/figures/us-2297691-carlson-electrophotography/fig-2-source-crop-v2.png",
        "/patents/figures/us-2297691-carlson-electrophotography/fig-2a-source-crop-v1.png",
        "/patents/figures/us-2297691-carlson-electrophotography/fig-2b-source-crop-v1.png",
      ]),
      text(
        " show three alternative methods of exposure. According to the camera method, for example, the plate 20 is secured in position in the back of camera 24 whereby the image of the original 25 is focussed on the layer 21. The exposure may require from a few seconds to two or three minutes depending on the sensitivity of the layer used and the intensity of illumination. Original 25 may be a sheet of paper carrying printed or typewritten matter, or a drawing, for example, although other things may be photographed such as three-dimensional objects.",
      ),
    ),
    p(
      text(
        "The sources of illumination are illustrated as incandescent lamps 26, although other sources, such as sunlight or ultra-violet lamps, may also be used depending on the character of the object to be illuminated and the wavelengths at which layer 21 has the greatest response. By the exposure, the parts of the layer 21 which are illuminated by the image are, for the time during which they are illuminated, rendered more conductive. This allows the electric charge held on the front surface of the layer to drain off the illuminated areas through the layer to the metal plate 22. During exposure the unilluminated areas, such as black letters corresponding to printing on original sheet 25, retain their charge or a substantial part of it throughout the exposure period. Thus the electric charge will remain where there are black areas in the picture and will be drained off the white areas.",
      ),
    ),
    p(
      ref(
        "Figure 2a",
        "#fig-2a",
        "Contact exposure through original 27",
        "/patents/figures/us-2297691-carlson-electrophotography/fig-2a-source-crop-v1.png",
      ),
      text(
        " illustrates another method of exposure suitable for use where the original is a transparency such as an ordinary photographic film, or a translucent material such as tracing paper or ordinary paper carrying an image in the form of opaque or semi-opaque lines or areas. The original 27 carrying the image 28 on its surface is placed against the surface of layer 21 and the assembly exposed to light from source 26. Exposure for a fraction of a second up to a few seconds will ordinarily be sufficient.",
      ),
    ),
    p(
      ref(
        "Figure 2b",
        "#fig-2b",
        "Projected film exposure",
        "/patents/figures/us-2297691-carlson-electrophotography/fig-2b-source-crop-v1.png",
      ),
      text(
        " shows a method for use where the original is recorded on a small film or lantern slide 30, e.g. microfilm or motion-picture film. In this case the original is placed in a projector 29 which projects the image on layer 21.",
      ),
    ),
    p(
      text(
        "In any of the exposure methods illustrated, the time of exposure may preferably be so regulated that the most brightly illuminated areas will lose somewhat less than their entire charge and the areas which are illuminated only half so brightly will lose less of their charge, such as approximately half of it. This may be better understood by considering each infinitesimal area of layer 21 as a charged condenser with its plates connected together through a resistance. Each condenser-resistance combination is in parallel with a large number of other condenser-resistance combinations having various resistance values.",
      ),
    ),
    p(
      text(
        "The discharging curve (charge vs. time) of a condenser through a resistance slopes downward from maximum charge and then flattens out so as to approach asymptotically the horizontal line representing zero charge. The slopes of the curves for different elements will vary but they all approach zero charge. Hence, if exposure is continued for too long all areas will become discharged and very little contrast will be obtained. It is preferred, therefore, that the exposure be stopped while the discharging rate is still on the steeper part of the charge vs. time curve. The time may vary from a fraction of a second to several minutes depending upon the characteristics of the photoelectric material and the intensity of light. Moreover, where the contrast on the original is high, such as black lines on a white background, the exposure time is not critical.",
      ),
    ),
    p(
      text("Having exposed the plate in one of the manners shown in "),
      ref("Figures 2, 2a and 2b", "#fig-2a-2b", "Exposure preceding development", [
        "/patents/figures/us-2297691-carlson-electrophotography/fig-2-source-crop-v2.png",
        "/patents/figures/us-2297691-carlson-electrophotography/fig-2a-source-crop-v1.png",
        "/patents/figures/us-2297691-carlson-electrophotography/fig-2b-source-crop-v1.png",
      ]),
      text(
        " so as to produce an electrostatic latent image, the image may be developed or made visible as shown in ",
      ),
      ref("Figures 3 and 4", "#fig-3-4", "Dusting and removing loose powder", [
        "/patents/figures/us-2297691-carlson-electrophotography/fig-3-source-crop-v2.png",
        "/patents/figures/us-2297691-carlson-electrophotography/fig-4-source-crop-v2.png",
      ]),
      text(
        ". The exposed plate is removed from the camera or other exposure device in a dark or dimly lighted room and laid face up on a table where it is sprinkled with a fine dust or powder 31 from a can 32 having a cloth or fine wire screen 33 closing its mouth (see ",
      ),
      ref(
        "Figure 3",
        "#fig-3",
        "Dusting through screened can 32",
        "/patents/figures/us-2297691-carlson-electrophotography/fig-3-source-crop-v2.png",
      ),
      text(")."),
    ),
    p(
      text(
        'Almost any kind of powder can be used depending on the effect desired in the finished print. Pulverized resins of all varieties are very satisfactory, the kind being preferred which can be melted or made adhesive by heating. I have successfully used finely pulverized gum copal, gum sandarac, ordinary rosin, sealing wax, cumarone-indene resin, the treated pine resin sold under the trade-mark "Vinsol" resin, and various other synthetic and natural resins. Hard waxes capable of reduction to powder are also suitable. Likewise such diverse materials as dyed lycopodium powder, talcum powder, sulfur, minium, carbon dust, and aluminum bronze powder have been used successfully. Powdered dyes may also be used, or the resin or other powder used may be dyed any color desired.',
      ),
    ),
    p(
      text(
        "Lycopodium powder is naturally of a generally spherical shape. The resins or waxes can be made into spherical powder by spraying molten resin or wax from an atomizer into a cold chamber in which spherical droplets harden before contacting other particles, or by sprinkling pulverized resin or wax through a heated zone where particles momentarily melt, assume a rounded form, and harden.",
      ),
    ),
    p(
      text(
        "The dusted plate is then subjected to a gentle draft of air by blowing the breath on it or directing air from the nozzle of a suitable blower 34 against the dusted surface to blow off all loose powder not held by electrostatic attraction (",
      ),
      ref(
        "Figure 4",
        "#fig-4",
        "Blowing off loose powder",
        "/patents/figures/us-2297691-carlson-electrophotography/fig-4-source-crop-v2.png",
      ),
      text(
        "). Wherever an electric charge remains on the surface, corresponding to dark parts of the original image, the powder remains adhering by electric attraction, developing and making visible picture 35 formerly present as an electrostatic latent image.",
      ),
    ),
    p(
      text(
        "In some cases dusting and blowing off may be performed in one step by blowing dust against the layer with a draft from a dust atomizer or blower. The dust may itself be charged by friction or by discharging electricity through it, preferably with polarity opposite to the latent image. If the charge has the same sign, a negative image results: powder does not deposit on charged areas but deposits on uncharged areas.",
      ),
    ),
    p(
      text(
        "In any case the visible image produced by the dust deposit can be fixed or made permanent in several ways depending on the powder and desired result. If it is desired to apply the image to paper, metal foil, or other sheet material, the procedure of ",
      ),
      ref(
        "Figure 5",
        "#fig-5",
        "Pressure transfer to sheet 36",
        "/patents/figures/us-2297691-carlson-electrophotography/fig-5-source-crop-v2.png",
      ),
      text(
        " may be followed. Sheet material 36 is carefully laid on layer 21 carrying dust image 35 and firmly pressed against the surface by block 37 carrying felt or sponge-rubber pad 38. This transfers part of the powder to the sheet. An adhesive on sheet 36 improves transfer; plain water or other liquids are often satisfactory, especially for paper. Wax, paraffin, or other soft or sticky substances may also be used.",
      ),
    ),
    p(
      text(
        "Where the powder or dye is soluble or partly soluble in water or other liquid and the liquid is used to wet the sheet before transfer, the image becomes permanent as the liquid evaporates. Where wax or another soft or sticky substance is used, pressure may embed the powder sufficiently to produce a fairly permanent print.",
      ),
    ),
    p(
      text("The preferred method of fixing the image is shown in "),
      ref(
        "Figure 6",
        "#fig-6",
        "Heat fixing with resistance element 39",
        "/patents/figures/us-2297691-carlson-electrophotography/fig-6-source-crop-v2.png",
      ),
      text(
        ". It is suitable where resin or wax powder is used, or where sheet 36 is coated or impregnated with resin or wax before transfer. Sheet 36 is heated momentarily to a temperature at which resin or wax melts or becomes adhesive, permanently affixing the image. Heating may be accomplished by heat-radiating electric resistance element 39, as shown in ",
      ),
      ref(
        "Figure 6",
        "#fig-6",
        "Heat fixing with resistance element 39",
        "/patents/figures/us-2297691-carlson-electrophotography/fig-6-source-crop-v2.png",
      ),
      text("."),
    ),
    p(
      ref(
        "Figure 7",
        "#fig-7",
        "Fixative lacquer from atomizer 40",
        "/patents/figures/us-2297691-carlson-electrophotography/fig-7-source-crop-v2.png",
      ),
      text(
        " shows another method of fixing the image, comprising spraying the surface of sheet 36 carrying the dust image with a fixative lacquer by atomizer 40.",
      ),
    ),
    p(
      text(
        "From the preceding description certain advantages over ordinary photographic methods are apparent. The process yields a direct positive copy rather than a negative. After exposure, dusting with black or colored powder, and transfer to white paper, dark original areas are reproduced as black or colored areas and white areas remain white.",
      ),
    ),
    p(
      text(
        "The process also yields directly readable copies of written or printed matter through an ordinary camera lens or by contact printing with the printed side against the sensitive plate, rather than a mirror image. A typewritten letter may be copied by the camera method of ",
      ),
      ref(
        "Figure 2",
        "#fig-2",
        "Camera exposure",
        "/patents/figures/us-2297691-carlson-electrophotography/fig-2-source-crop-v2.png",
      ),
      text(" or the contact method of "),
      ref(
        "Figure 2a",
        "#fig-2a",
        "Contact exposure",
        "/patents/figures/us-2297691-carlson-electrophotography/fig-2a-source-crop-v1.png",
      ),
      text("."),
    ),
    p(
      ref(
        "Figure 8",
        "#fig-8",
        "Modified charging and exposure",
        "/patents/figures/us-2297691-carlson-electrophotography/fig-8-source-crop-v2.png",
      ),
      text(
        " shows another method of charging the surface of photoconductive insulating layer 21. A transparent plate 41 coated with a transparent sputtered metal layer 42 is placed parallel to layer 21 near its surface, with metal layer 42 nearest layer 21. Metal film 42 and metal backing plate 22 are connected to opposite potential terminals 43 and 44 of high-voltage source 45. Source 45 may be a multi-cell battery, electrostatic generator, or transformer-rectifier system; a transformer-rectifier delivering about 1300 volts D.C. is suitable.",
      ),
    ),
    p(
      text(
        "The layer 21 is illuminated uniformly by lamp 46 while the voltage source is connected. When the lamp is turned off and the source disconnected, a charge remains on layer 21.",
      ),
    ),
    p(
      text(
        "In another method, the source polarity is reversed during exposure through lens 47, so illuminated areas discharge positive charge and become negatively charged while dark areas remain positive.",
      ),
    ),
    p(
      text(
        "The first charging step may instead be eliminated and the layer charged during exposure; black powder then gives a negative, while white powder transferred to a black background gives a positive. A thin insulating sheet may be interposed between layers 21 and 42 instead of air in ",
      ),
      ref(
        "Figure 8",
        "#fig-8",
        "Insulating sheet between layers 21 and 42",
        "/patents/figures/us-2297691-carlson-electrophotography/fig-8-source-crop-v2.png",
      ),
      text("."),
    ),
    p(
      text("In "),
      ref(
        "Figure 9",
        "#fig-9",
        "Development through insulating sheet 48",
        "/patents/figures/us-2297691-carlson-electrophotography/fig-9-source-crop-v2.png",
      ),
      text(
        " a thin insulating sheet 48 is laid on top of layer 21 carrying the latent image and powder is deposited on sheet 48; dust adheres opposite the charged parts of layer 21.",
      ),
    ),
    p(
      text(
        "My process may also be adapted to the production of masters for the making of multiple copies by lithographic or typographical methods.",
      ),
    ),
    {
      kind: "heading",
      level: 3,
      text: "Lithographic reproduction",
    },
    p(
      text(
        "For production of masters for offset lithography the first steps in the process may be the same as described in connection with ",
      ),
      ref("Figures 1 to 4", "#fig-1-4", "Plate charging and development", [
        "/patents/figures/us-2297691-carlson-electrophotography/fig-1-source-crop-v2.png",
        "/patents/figures/us-2297691-carlson-electrophotography/fig-2-source-crop-v2.png",
        "/patents/figures/us-2297691-carlson-electrophotography/fig-2a-source-crop-v1.png",
        "/patents/figures/us-2297691-carlson-electrophotography/fig-2b-source-crop-v1.png",
        "/patents/figures/us-2297691-carlson-electrophotography/fig-3-source-crop-v2.png",
        "/patents/figures/us-2297691-carlson-electrophotography/fig-4-source-crop-v2.png",
      ]),
      text(", inclusive."),
    ),
    p(
      text(
        "The dusting powder must be selected to be a material which is wetted by lithographic ink.",
      ),
    ),
    p(
      text(
        "Many of the resins mentioned are suitable for this purpose, such as copal, sandarac, Vinsol and rosin as well as the hard waxes. While these are ordinarily satisfactory it may in some cases be preferred to compound the resin with a small amount of lithographic crayon material or to add some fatty acid or fatty material to improve the adherence of the image to the lithographic plate.",
      ),
    ),
    p(
      text(
        "The sheet 36 is a lithographic sheet such as a specially prepared etched aluminum or zinc plate of the type commonly used for offset lithography.",
      ),
    ),
    p(
      text(
        "The newly-developed paper or parchment-like lithographic sheets known commercially as Duplimat sheets, for use on the Multilith machines, can also be used.",
      ),
    ),
    p(
      text("The resin or wax image is melted onto the sheet by heating as shown in "),
      ref(
        "Figure 6",
        "#fig-6",
        "Heat fixing of the transferred image",
        "/patents/figures/us-2297691-carlson-electrophotography/fig-6-source-crop-v2.png",
      ),
      text(
        ". Any number of copies can then be produced from such a sheet by offset lithography, the lithographic ink adhering to the letters but not to the background, when the sheet is wetted with water.",
      ),
    ),
    p(
      text(
        "The lithographic plate, preferably etched aluminum or zinc, is coated with a thin layer of anthracene or anthraquinone to produce an electro-photographic plate, by one of the coating methods already described.",
      ),
    ),
    p(text("The layer is then exposed and dusted with resin dust as previously described.")),
    p(
      text(
        "The plate is heated carefully to a temperature at which the anthracene evaporates off leaving the resin image on the plate. If the resin has already melted it is merely necessary to cool the plate to solidify the resin image onto the surface. If the resin is of a higher melting point the heating is continued until the resin melts.",
      ),
    ),
    p(
      text(
        "This method has the advantage that all of the resin which becomes attached to the electrostatic latent image is utilized in the finished lithographic plate. In this process it may be necessary to use a photostat camera having a 45 degree mirror in combination with the camera lens, or to modify the contact printing process by placing the back of the original sheet against the photoconductive layer so that a direct image will be produced on the layer instead of a ",
      ),
      term(
        "mirror-reverse image",
        "A laterally reversed image, here identified as the form that must be corrected when a printing master would otherwise read backward.",
      ),
      text("."),
    ),
    {
      kind: "heading",
      level: 3,
      text: "Typography",
    },
    p(
      text(
        "My process can also be used for producing typographical printing cuts or relief printing surfaces.",
      ),
    ),
    p(
      text(
        "This can be accomplished by producing a photoconductive insulating layer of anthracene or anthraquinone on a block of metal such as zinc or copper, exposing and dusting with resin powder to form the image in mirror-reverse, heating to drive off the anthracene or anthraquinone and to melt the resin onto the metal surface, cooling and then etching the plate in acid to etch away the metal not covered by the resin and thereby leave the image in raised relief.",
      ),
    ),
    p(text("The cut thus produced can be used for printing in the usual way.")),
    {
      kind: "heading",
      level: 3,
      text: "Hectographic reproduction",
    },
    p(text("My process may also be used for the preparation of masters for hectograph copying.")),
    p(
      text(
        "A so-called hectograph pan is used in which a gelatin compound is disposed in a layer.",
      ),
    ),
    p(
      text(
        "The dust image in such case is formed of a strong dye, such as crystal violet, or a dye compounded with gelatin and reduced to a fine dry powder.",
      ),
    ),
    p(
      text(
        "The dust image, formed electrophotographically as heretofore described, is transferred to the surface of the gelatin compound in the pan by pressing the dusted electrophotographic plate against the surface of the layer so that the dyestuff is absorbed in the surface of the gelatin compound. Then copies can be produced by pressing sheets of copy paper on the gelatin compound surface one at a time.",
      ),
    ),
    p(
      text("In such a process the original photographic exposure should be such that a "),
      term(
        "mirror-reverse",
        "Laterally reversed relative to the desired copy, so that transfer into the hectograph surface restores readable orientation.",
      ),
      text(" is produced on the gelatin compound when the dust is transferred to it."),
    ),
    p(
      text(
        "The same principle can also be extended to the process in which the gelatin composition is carried in a thin coating on a backing sheet, instead of being placed in a pan, the copies being run off in a rotary cylinder copying machine.",
      ),
    ),
    p(text("The dusting powder should be an alcohol soluble dye or dye composition.")),
    p(
      text(
        "Such dyes as the basic dyestuffs rhodamine, Victoria blue, Victoria green, crystal violet, nigrosine, methyl violet, and induline may be employed either alone or compounded with an alcohol soluble resin.",
      ),
    ),
    p(
      text(
        "The dust image may be transferred to a paper sheet as heretofore described and melted onto the paper or adhered to it by wetting slightly with alcohol.",
      ),
    ),
    p(
      text(
        "Copies can then be run off by attaching the master thus formed to the drum of a rotary duplicator and running through blank sheets moistened with alcohol or other spirit solvent, each of which picks up some of the dye.",
      ),
    ),
    p(
      text(
        "If pure dye is used for the dusting powder it may be transferred to a specially prepared sheet having an adhesive on its surface, such as resin which can be melted to make the dye stick to the sheet.",
      ),
    ),
    p(
      text(
        "The dyed resin can be melted directly onto the photoconductive insulating layer and the layer itself used as a master from which copies can be run off. If anthracene or anthraquinone or some other readily volatilized photoconductive layer is used it may be evaporated and the image melted directly onto the metal backing.",
      ),
    ),
    p(
      text(
        "The picture thus produced is really a form of half tone and as such may be used for lithographic or hectographic reproduction of pictorial subjects and for the production of half-tone cuts.",
      ),
    ),
    p(
      ref(
        "Figure 10",
        "#fig-10",
        "Magnified half-tone dust image",
        "/patents/figures/us-2297691-carlson-electrophotography/fig-10-source-crop-v2.png",
      ),
      text(
        " is a highly magnified view of a dusted electrostatic image of a pictorial subject, the part reproduced being an enlargement of a human eye. It will be noted that in the darker parts of the image such as the eyelash and pupil the dust particles 31 are clustered close together, while in the lighter parts the particles are more widely separated, and in the white parts no particles adhere at all.",
      ),
    ),
    p(
      text(
        "If the particles are of fusible resin they can be melted onto the backing and each will serve as a tiny printing area in a lithographic or hectographic process. In the case of half-tone cuts the resin areas protect the backing metal while the surrounding uncovered areas are etched away. By using powders in which particles of various diameters are mixed together in different proportions, rather than using grains all of one diameter, a variety of different effects can be achieved.",
      ),
    ),
    p(
      text(
        "My process is also applicable to the making of half-tones by conventional methods such as by using a half-tone screen in the camera or by photographing a half-tone original.",
      ),
    ),
    {
      kind: "heading",
      level: 3,
      text: "Paper layers",
    },
    p(
      text(
        "While I have described the photoconductive insulating layer as attached to a metal backing this is not always necessary. Where the material is of such nature as to form a sheet it may be used independently, it being only necessary to provide a conductive backing by contact during the exposure step to drain off the charge.",
      ),
    ),
    p(
      text(
        "I have also found that certain of the materials can be impregnated into paper. It is preferred to use pure cellulose paper and to obtain more or less of a layer of the photoconductive insulating material on a surface of the paper as well as impregnated into the sheet. Anthracene is particularly useful for such a sheet although the other materials, including sulfur, have also been used successfully in this way.",
      ),
    ),
    p(
      text(
        "The preferred method is to melt the material into the paper but other ways can also be employed such as depositing from a solution. A metal backing by pressure contact need only be used during the exposure step.",
      ),
    ),
    p(
      text(
        "It is also contemplated that the paper may be first impregnated with a conductive material which will render the paper fibres conductive and then impregnated or coated with the photoconductive insulating material. For example, a silver salt, such as silver chloride, may be deposited in the paper and reduced to metallic silver by exposure to light, after which the sheet is thoroughly washed to eliminate any remaining chemicals, and then the photoconductive material applied. Certain conductive metallic compounds such as the sulfides may also be used.",
      ),
    ),
    p(
      text(
        "Another type of electrophotographic sheet is made by coating a sheet of paper with a layer of conductive material such as bronze or carbon powder held in a binder, the photoconductive insulating material being applied to the conductive surface or impregnated into the sheet.",
      ),
    ),
    p(
      text(
        "The conductive layer may be sprayed or painted onto the paper or rolled into the surface before applying the photoconductive material and in some cases afterward.",
      ),
    ),
    {
      kind: "heading",
      level: 3,
      text: "Color photography",
    },
    p(
      text(
        "It has already been mentioned that colored powders may be used in developing the image. It is thereby possible to produce a copy in any color, either the same as or different from that of the original.",
      ),
    ),
    p(
      text(
        "The process can also be used for multi-color photography by exposing a plate first to the original through light filters which enable one color to be recorded, and then developing with colored powder to produce a copy of that color, then repeating for each other color and superimposing the dust images on the same copy sheet.",
      ),
    ),
    {
      kind: "heading",
      level: 3,
      text: "Conclusion",
    },
    p(
      text(
        "An outstanding advantage of the process described herein is its simplicity and rapidity. It is a matter of only a few seconds to make a complete permanent copy of any original. No complex chemical development process is required. This gives the process a further advantage in that it may readily be performed by mechanical means, it being only necessary to provide an apparatus for performing the necessary operations in sequence.",
      ),
    ),
    p(
      text(
        "Another advantage resides in the fact that the sensitized plates may be used over and over again it merely being necessary to brush off the surface and recharge it before each exposure. Since the insulating photoconductive layer 21 is normally in contact with the air, which may often be quite humid, the material forming the layer should preferably be of a type which is not highly reactive and which is non-hygroscopic, since moisture in the layer will destroy its insulating properties. All of the materials described herein are of this type.",
      ),
    ),
    p(
      text(
        "The plate need not be stored in the dark as is required with ordinary photographic plates, since the plate is prepared for exposure by charging the surface each time immediately before exposure.",
      ),
    ),
    p(
      text(
        "The present process is suitable for copying letters, drawings, printed matter, books, typewritten matter, enlarging matter from films such as microfilm, pictorial photography, color photography, half-tone production and as a means for producing masters for lithographic, hectographic or typographical production of multiple copies.",
      ),
    ),
    p(
      text(
        'In the specification and claims "light" is intended to refer not only to visible radiation but also other radiations which affect the photoconductive material, such as ultra-violet radiations, infra-red, etc.',
      ),
    ),
    p(
      text(
        "The present application is a continuation in part of my prior-filed co-pending application S. N. 169,630, filed October 18, 1937.",
      ),
    ),
    p(
      text(
        "While the present invention, as to its objects and advantages, has been described herein as carried out in specific embodiments thereof, it is not desired to be limited thereby but it is intended to cover the invention broadly within the spirit and scope of the appended claims.",
      ),
    ),
    {
      kind: "heading",
      level: 2,
      text: "What is claimed is:",
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
          "7. The method of photography which comprises applying a strong electric field through a layer of photoconductive insulating material and simultaneously projecting a light image onto said layer, said light image comprising a pattern of light and shadow to be recorded, whereby electricity will flow through said layer in the illuminated parts thereof, thereby producing an electrostatic charge image at a surface thereof, shutting off the illumination and storing said electrostatic charge image on said surface by protecting said layer from illumination subsequent to exposure to the light image, and subsequently developing said image by dusting said stored charge image with an electroscopic powder.",
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
          "12. A device for electrophotography comprising a pair of layers of conductive material disposed in spaced parallel relation, a thin layer of photoconductive insulating material attached to one of said conductive layers on its surface nearest the other conductive layer, said photoconductive layer being spaced from said other conductive layer whereby it is insulated therefrom; one of said conductive layers being permeable to light, means for projecting a light image onto said photoconductive layer by projecting light through said light-permeable layer, and means for applying a high-voltage potential difference between said conductive layers, whereby an electrostatic latent image corresponding to said light image may be produced on the exposed surface of said photoconductive insulating layer by application of said potential difference and projecting said light image thereon, said layers being exposed to air at atmospheric pressure and said photoconductive insulating material being non-hygroscopic.",
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
          "24. The method of applying a design to a surface which comprises producing an electrostatic charge pattern at the surface of a layer of insulating material, depositing a powder on said pattern whereby to produce a corresponding powder design by the electrostatic attraction of said pattern for said powder, and bringing a second surface having an adhesive material thereon into contact with the powder design whereby to transfer said powder design to said second surface, and then permanently affixing the powder design to said second surface.",
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
