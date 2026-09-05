/**
 * landPolaroidEdition.ts
 *
 * Working source edition for Edwin H. Land's 1951 photographic-product patent
 * (US Patent 2,543,181). This is not yet the visitor-facing archival edition.
 *
 * The pinned 32-page facsimile is at
 * public/patents/pdfs/us-2543181-land-polaroid.pdf (SHA-256:
 * 4ee20338289f545608f472c50aa6ba8a7134f08fa377f1887e81f1e9bb5d4013).
 * The figure-description passage below has been reconciled with the facsimile's
 * printed Figure 1 through Figure 24 inventory. The opening disclosure through
 * the Figure 8 discussion and the Figure 9–24 continuation are staged manual
 * source blocks. The edition is deliberately incomplete and remains unbound.
 */

import type { CuratedSpecificationEdition, CuratedSpecificationInline } from "@/types/patent";

type LandWipSpecificationEdition = Omit<
  CuratedSpecificationEdition,
  "completeFacsimileReviewed"
> & {
  completeFacsimileReviewed: false;
};

const text = (value: string): CuratedSpecificationInline => ({
  kind: "text",
  text: value,
});

const term = (termText: string, definition: string): CuratedSpecificationInline => ({
  kind: "term",
  text: termText,
  definition,
});

const ref = (
  refText: string,
  targetHref: string,
  targetLabel: string,
): CuratedSpecificationInline => {
  return {
    kind: "reference",
    text: refText,
    href: targetHref,
    referenceType: "figure",
    label: targetLabel,
  };
};

const p = (...inlines: CuratedSpecificationInline[]) => ({
  kind: "paragraph" as const,
  inlines,
});

const landPolaroidLegacyParallelReadings: Readonly<Record<number, readonly string[]>> = {
  3: [
    "Land begins broadly: the product carries its processing liquid with the photosensitive material instead of requiring a separate darkroom bath. The following object limits this passage to a product whose container releases liquid under applied stress.",
  ],
  4: [
    "This object identifies the central assembly: photosensitive material plus the materials needed to process it and obtain a positive print. It does not yet identify one exclusive chemical recipe or camera geometry.",
  ],
  5: [
    "This object adds the handling constraint: the sheet is normally dry on its outer faces, then its internal liquid is released between those faces to carry out the chemical treatment.",
  ],
  6: [
    "This longer object clause collects several constraints in one disclosure: the liquid is kept away from the permeable photosensitive layer until release, the product resists evaporative loss, and the liquid must spread substantially uniformly over the area being processed.",
  ],
  7: [
    "This object narrows to a composite sheet whose reagent may be carried in sacs. The thickening agent is not decoration: it gives the released liquid enough viscosity to spread as a controlled layer while participating in the transfer-print structure.",
  ],
  8: [
    "This separate object concerns the physical container. It must both retain the reagent and release it across a selected surface area of the sheet when the product is actuated.",
  ],
  9: [
    "Land states the conventional patent boundary here: the detailed disclosure exemplifies the product's features and component relationships, while the claims state the legal scope. It is not a promise that every later example is itself a claim limitation.",
  ],
  11: [
    "Figure 1 is not a camera view. It shows four sequential sectional states of one film product: before exposure, after liquid release, after image formation, and after stripping the transfer print.",
  ],
  12: [
    "Figure 2 isolates a modified liquid-containing member. Its sectional construction is a variation on the Figure 1 arrangement, not a separate asserted camera apparatus.",
  ],
  13: [
    "Figure 3 shows another composite-product embodiment using the Figure 2 style of sectional explanation. It gives an alternative layer arrangement rather than a process sequence.",
  ],
  14: [
    "Figure 4 is another Figure 2-style sectional embodiment. The printed list treats it as a different product form, so it must retain its own source reference and crop.",
  ],
  15: [
    "Figure 5 presents a further product form based on the Figure 4 kind of view. It is a separate configuration and should not be conflated with the liquid-release state in Figure 6.",
  ],
  16: [
    "Figure 6 is the Figure 5 construction after liquid release. Pairing the two figures lets a reader distinguish the intact liquid-retaining wall from the released condition.",
  ],
  17: [
    "Figure 7 supplies another Figure 2-style product modification. Its purpose is comparative: it shows another way to arrange the photosensitive and liquid-containing layers.",
  ],
  18: [
    "Figure 8 is a product that can be used with the patent's liquid-containing means. It is a compatibility form, not merely another rendering of the Figure 5 release sequence.",
  ],
  19: [
    "Figure 9 returns to liquid-containing means, modifying the Figure 2 type of construction. The figure is about the member that retains liquid, not the later filling apparatus.",
  ],
  20: [
    "Figure 10 shows apparatus for filling the cells of the Figure 9 fluid-retaining member. It must remain distinct from Figure 9 because it explains manufacture or filling rather than the finished member alone.",
  ],
  21: [
    "Figure 11 is a camera arrangement suitable for forming a positive print with the product. It is an apparatus view, separate from the film-stack cross sections.",
  ],
  22: [
    "Figure 12 modifies the Figure 11 camera arrangement. A correct edition must preserve that relationship rather than relabeling the view as a generic roller diagram.",
  ],
  23: [
    "Figure 13 shows a way to fracture the liquid-retaining membrane. Its role is to explain a release mechanism, not to stand in for the complete camera arrangement.",
  ],
  24: [
    "Figure 14 is another product form viewed along its longitudinal axis. It begins the sequence of sac and container constructions elaborated by the following figures.",
  ],
  25: [
    "Figure 15 is a perspective view of the liquid-reagent sac or pod associated with Figure 14. It isolates the container as a physical object.",
  ],
  26: [
    "Figure 16 shows the Figure 15 sac immediately before filling. That staging matters because the patent describes how the container is formed and then charged with liquid.",
  ],
  27: [
    "Figure 17 is a longitudinal sectional view of a novel sheet material. It broadens the disclosure beyond the single pod shape in Figures 14 through 16.",
  ],
  28: [
    "Figure 18 gives a perspective construction view of another container means. It is not the finished filled container shown in the next figure.",
  ],
  29: [
    "Figure 19 is the perspective view of the filled container. Together with Figure 18, it lets the reader compare construction with its liquid-charged condition.",
  ],
  30: [
    "Figure 20 is the section taken through the Figure 19 container. The section line is part of the source relationship and should remain linked to the correct crop.",
  ],
  31: [
    "Figure 21 illustrates another composite-product form in enlarged sectional perspective. It returns from the container detail to the larger product assembly.",
  ],
  32: [
    "Figure 22 is a longitudinal sectional view of still another composite product. It has a separate geometry and cannot borrow a preview from Figure 21.",
  ],
  33: [
    "Figure 23 is a diagrammatic perspective of another embodiment. Its more schematic character is intentional and needs a crop that retains its own labels.",
  ],
  34: [
    "Figure 24 is an enlarged sectional view of a modified container means. It closes the printed drawing list; the facsimile contains no Figures 25 through 32.",
  ],
  36: [
    "The preferred film has a photosensitive layer—Land gives silver-halide gelatin emulsion as an example—plus development and positive-image-forming means. The positive image may be made in the photosensitive layer or in a separate layer that can be stripped away after image formation.",
  ],
  37: [
    "The liquid is stored away from the photosensitive layer until release. It may carry developer in solution, or act as a solvent that dissolves developer held dry in another layer on the route to the photosensitive material; it can also transport other treatment compounds needed for the fixed positive image.",
  ],
  38: [
    "The patent supplies several storage architectures: cell-like chambers, attached sacs, a porous or blotter-like layer saturated with liquid, or a true liquid emulsion in a film layer. Those alternatives matter because the release mechanism depends on the way the liquid is held.",
  ],
  39: [
    "For chambers or a saturated blotter, a relatively brittle wall separates the liquid from the photosensitive layer and breaks under stretching. For an emulsion or discrete containers, compression—and, for containers, piercing—can release the liquid instead.",
  ],
  40: [
    "A porous, deformable paper layer may back the retaining membrane so it can fracture, diffuse the released liquid, and spread it uniformly through the photosensitive layer. The same layer can carry solid process compounds for the released liquid to dissolve and transport.",
  ],
  41: [
    "The liquid-retaining means is made vapor-impervious with an envelope such as paraffin or polyethylene. The envelope may lie on the outside or between selected layers; cells or chambers can also be lined with the vapor-impervious material.",
  ],
  42: [
    "The source generalizes the release principle across the earlier film forms and the modified cell member: a deliberately brittle membrane fractures under tension below the yield point of the remaining layers, allowing the processing liquid to saturate the photosensitive layer.",
  ],
  43: [
    "The Figure 9 member uses cells 94, temporary self-sealing slots 96, and frangible membrane 98. Tension opens the slots when the membrane fractures, releasing the liquid from the cells.",
  ],
  44: [
    "Figure 10 fills the Figure 9 cells while film 92 travels around immersed roll 100. Curvature opens the slots in bath 102, then straight travel reseals them before the film emerges; membrane 98 supplies the permanent seal.",
  ],
  45: [
    "The Figure 11 camera mounts roll 110 and exposes film F through shutter and lens means 112. Differential speeds between roll pairs 114 and 116 tension portion 118, fracture the retaining membrane, and compress the film to discharge the liquid.",
  ],
  46: [
    "After metering, cutter 119 separates the exposed frame and opening 120 discharges it. The camera can strip the positive print from the remaining frame, including by suitable means within the camera, so each frame is developed without exposing the rest of the roll; cutter 119 should be as close as possible to the point where each frame's leading edge is exposed, minimizing film between exposed frames.",
  ],
  47: [
    "The Figure 12 camera corrects the reversal produced by certain film arrangements. Lens means 112a and image-reversing optical element 121 place the reflected image on film F' at substantially 45 degrees to the optical axis; a prism or mirror attachment can provide the same correction in the Figure 11 camera.",
  ],
  48: [
    "The source then offers other release mechanics: differential stretching over a cylindrical roll, followed by compression between friction rolls, or the corrugated rigid roll 122 and yielding roll 124 of Figure 13.",
  ],
  49: [
    "Corrugations 126 on roll 122 differentially stretch successive film lengths and ensure at least one membrane fracture per selected unit length. The radius and spacing of the corrugations control the maximum distance between fractures.",
  ],
  50: [
    "Layer thickness can place the membrane nearer one face, so winding in one direction compresses it while winding in the other tensions and fractures it. Polyvinylidene chloride, polyvinyl acetate-chloride, and cellulose acetate butyrate can provide aggregate vapor resistance in a wound roll.",
  ],
  51: [
    "Figures 14 through 17 introduce a preferred viscous reagent container and related sheet constructions. A film-forming polymer can both process the image and solidify as a receiving film, while also supplying the desired high viscosity; the invention also includes a sheetlike product with reagent-containing means but no photosensitive layer, released by face-to-face pressure against a separate photosensitive layer.",
  ],
  52: [
    "The reagent film may itself receive the transfer image or cooperate with another receiving layer. The invention also includes a sheetlike reagent carrier without a photosensitive layer, pressed into face-to-face contact with a separate photosensitive layer.",
  ],
  53: [
    "Figure 14's composite film uses transparent base 210, photosensitive layer 212, water-permeable receiving layer 214, and base 216. The receiving layer may be cellulose, polyvinyl alcohol, alginate, cellulose ethers such as methyl cellulose and their derivatives, paper, gelatin, glue, gums, starch, or compatible mixtures; it may be selected for affinity to the film-forming reagent, and titanium dioxide can make the layer or reagent film white and substantially opaque.",
  ],
  54: [
    "Elongated pods 218 lie transversely between layers 212 and 214, one per frame, and release reagent 220 longitudinally when the film faces are squeezed. Figures 14 and 15 show the folded oxygen- and water-vapor-impervious sheet; Figure 16 shows cavity 222. Heat seals form a longitudinal seal designed to break before the folded edge, while stronger end seals leave a container whose contents will neither become dry nor oxidize for relatively long periods.",
  ],
  55: [
    "A viscosity above fifty centipoises promotes complete and uniform frame permeation. Gelatin, hydroxyethyl cellulose, and sodium or aluminum carboxymethyl cellulose are examples of water-soluble film-forming thickeners that can make a stable receiving film.",
  ],
  56: [
    "Compression releases reagent 220 from pod 218 between the exposed silver-halide layer 212 and receiving layer 214. The reagent contains developer, complex-forming compound, alkali, and thickener, with optional restrainer and preservative.",
  ],
  57: [
    "Example 2 gives water, 7.0 grams of sodium sulfite, 3.3 grams of hydroquinone, 1.4 grams of sodium thiosulfate, sodium carboxymethyl cellulose solution, and 11.2 cubic centimeters of 10% sodium hydroxide solution.",
  ],
  58: [
    "The stated Example 2 mixing order dissolves the salts, adds the cellulose solution, cools the mixture to 65–75 degrees Fahrenheit, and then adds sodium hydroxide. An alternative dilutes the cellulose solution first and mixes at 80–90 degrees Fahrenheit before cooling.",
  ],
  59: [
    "The proportions vary: hydroquinone may reach 6.6 grams, sodium thiosulfate ranges from 1.4 to 2.8 grams, sodium hydroxide solution from 11 to 44 cubic centimeters, and potassium bromide may be included at 2.2 to 6.6 grams. Example 3 lists the additional Metol formulation.",
  ],
  60: [
    "Sodium alginate and several named starches can replace sodium carboxymethyl cellulose. Titanium dioxide, magnesium oxide, and magnesium carbonate can whiten the reagent film and increase viscosity; 10–20 percent titanium dioxide is reported as effective.",
  ],
  61: [
    "The disclosure lists alternative developers, silver-complexing materials, and accelerators, while warning against toxic sodium cyanide. Preservative and restrainer may be omitted in some reagent formulations.",
  ],
  62: [
    "The practice sequence exposes layer 212, releases reagent 220 under stress, develops exposed silver halide, transports soluble silver complex to layer 214, and reduces it there to the positive image before separating the receiving layer, reagent film, and base 216.",
  ],
  63: [
    "The reagent pods may be dispensed separately or positioned by hand after exposure. A stable high-molecular-weight polymer preserves viscosity and film-forming properties between mixing and use.",
  ],
  64: [
    "Preferred alkali-stable water-soluble polymers include sodium carboxymethyl cellulose, hydroxyethyl cellulose, and sodium polymethacrylate or polyacrylate salts.",
  ],
  65: [
    "Choosing the film-forming material controls which layer receives the solid film after peeling. Sodium carboxymethyl cellulose favors a harder receiving surface over softer emulsion gelatin.",
  ],
  66: [
    "Commercial operation favors more than 1,000 centipoises at about 24 degrees Celsius, preferably 1,000 to 200,000 centipoises; the pod cavity may be omitted in a modified container.",
  ],
  67: [
    "Figure 18's multilayer sheet 230 uses chemically inert inner layer 230a, vapor-resistant metal foil 230b, and paper backing 230c. Folding and sealing produce central reagent space 235.",
  ],
  68: [
    "Figures 19 and 20 show filled container 240 and its section. End bonds are stronger than the longitudinal bond, so compression opens the long seal and frees the reagent for spreading.",
  ],
  69: [
    "The composition can be spread between the emulsion and another sheet or by an applicator roll. Figure 14 or Figure 21 may omit receiving layers, with a white reagent film carrying the positive image.",
  ],
  70: [
    "Figure 23 makes the photosensitive and image-carrying layers a hinged unit. Layer 310 pivots for exposure, then container 300 releases reagent between layers when the unit is pressed.",
  ],
  71: [
    "Opaque backing 318 and image-receiving area 320 permit daylight handling after closure. Hinge 319 leads the unit through pressure rollers to release and spread the reagent.",
  ],
  72: [
    "Figure 24 replaces the pod with brittle tube 350 inside permeable retaining envelope 352, which filters fragments when the tube breaks.",
  ],
  73: [
    "The disclosure extends the product to diazonium layers and gives Blackline, para-diazo, Naphthanil, resorcinol, and related reagent examples in stated proportions.",
  ],
  74: [
    "Ferric organic salts, alternative radiation-sensitive materials, and developing reagents are included. The specification defines developing reagent, development, exposed and nonexposed solarized silver halide, and dispersion.",
  ],
  75: [
    "The continuation applications and illustrative, nonlimiting character of the description are stated immediately before the formal claim preamble: What is claimed is.",
  ],
};

export const landPolaroidArchivalEdition: LandWipSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "4ee20338289f545608f472c50aa6ba8a7134f08fa377f1887e81f1e9bb5d4013",
  preparedBy: "Classic Patents editorial agent (unpublished manual source repair)",
  preparedAt: "2026-08-19",
  completeFacsimileReviewed: false,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "Feb. 27, 1951",
        "UNITED STATES PATENT OFFICE",
        "2,543,181",
        "PHOTOGRAPHIC PRODUCT COMPRISING A RUPTURABLE CONTAINER CARRYING A PHOTOGRAPHIC PROCESSING LIQUID",
        "Edwin H. Land, Cambridge, Mass., assignor to Polaroid Corporation, Cambridge, Mass., a corporation of Delaware",
        "Application December 11, 1948, Serial No. 64,870",
        "116 Claims. (Cl. 95–8)",
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
      text: "Opening Statement and Objects",
    },
    p(
      text(
        "This invention relates to photography and more particularly to photographic products wherein a liquid is contained for processing a photographic, photosensitive material.",
      ),
      text(
        " One object of the present invention is to provide a novel photographic product which comprises a ",
      ),
      term(
        "rupturable, disposable container",
        "The specification uses this phrase for a container that retains a photographic processing liquid or solvent and releases it when suitable stress is applied. The exact wall and seal construction varies among the illustrated embodiments.",
      ),
      text(
        " releasably carrying a photographic processing liquid or solvent and so constructed as to be able, upon application of a suitable stress thereto, to release its liquid content for substantially uniform distribution over a predetermined area of a photosensitive material to process the same, the photosensitive material being attached to and forming a part of said product or being first associated with said product during the processing thereof.",
      ),
    ),
    p(
      text(
        "Another object of the present invention is to provide a composite photographic product of the foregoing type which includes a photosensitive layer and such materials as are required for so processing the photosensitive layer as to provide said product with a positive print of the subject matter to which said photosensitive layer is exposed.",
      ),
    ),
    p(
      text(
        "Still another object of the present invention is to provide a novel sheetlike product whose external surfaces are normally dry and which includes a photosensitive layer, a container carrying a liquid, and such other materials as are required for subjecting the photosensitive layer to a predetermined chemical treatment, the liquid being releasable from the container between the outer surfaces of the product and upon release effecting the desired processing.",
      ),
    ),
    p(
      text(
        "Still further objects are the provision of novel film means wherein a permeable layer is associated with means carrying a liquid material in such a way that the liquid is normally out of contact with said layer and capable, upon release, of permeating a predetermined portion of the said layer; wherein the permeable layer is an emulsion of photosensitive material of the type in which a developable image is formed by photoexposure and wherein the liquid material when it permeates said layer comprises a developer for said photosensitive material; wherein the film contains elements sufficiently impervious to the vapor of said liquid material and so located relative thereto as to prevent loss of the liquid by evaporation; wherein the means for containing the liquid material are constructed to permit ready release of the liquid when desired; and wherein means are provided for insuring substantially uniform distribution of the liquid material over the photosensitive area to be processed thereby.",
      ),
    ),
    p(
      text(
        "Further objects are the provision of novel photographic materials in which a liquid reagent is releasable to permeate a silver halide photosensitive layer or the like having formed therein a latent image; in which the reagent develops the latent image and gives as a reaction product an image-forming component; in which the image-forming component is translated relative to the material of the developed latent image to form in another layer of material an image which is a positive of the subject matter to which the film was exposed in producing the latent image; in which the positive image-forming component is reacted in its relatively translated position to give a dye or pigment, e. g., silver, for forming the positive image; in which the transfer image is formed in positive print material separable from the photosensitive layer; and in which all of the materials involved in the formation of the latent image and the positive print thereof are included.",
      ),
    ),
    p(
      text(
        "Still further objects are the provision of a novel composite product comprising a photosensitive layer and carrying a liquid wherein the liquid material is contained in sacs; wherein the liquid material is relatively viscous so that it may be uniformly spread over a predetermined area of the photosensitive material which it is to process; wherein the desired viscosity is imparted to the liquid material by a film-forming thickening agent; wherein the liquid material is capable of release for spreading between the photosensitive layer and a receiving layer for a transfer print; and wherein the liquid material upon release provides at least a portion of the stratum for receiving the material of the transfer print.",
      ),
    ),
    p(
      text(
        "Still another object is to provide a novel sheet material comprising a container which releasably carries a liquid reagent, said container being so constructed and so mounted as to be able to release its liquid for spreading over a predetermined surface area of said material.",
      ),
    ),
    p(
      text(
        "Other objects of the invention will in part be obvious and will in part appear hereinafter.",
      ),
    ),
    p(
      text(
        "The invention accordingly comprises the product possessing the features, properties and the relation of components which are exemplified in the following detailed disclosure, and the scope of the application of which will be indicated in the claims. For a fuller understanding of the nature and objects of the invention, reference should be had to the following detailed description taken in connection with the accompanying drawings wherein:",
      ),
    ),
    {
      kind: "heading",
      level: 2,
      text: "DRAWINGS (FIGURES 1–24)",
    },
    p(
      ref("Figure 1", "#fig-1", "Figure 1 — Four stages of one photographic product"),
      text(
        " is four enlarged, diagrammatic, fragmentary, sectional views of four stages in the use of one form of photographic product comprehended by the present invention;",
      ),
    ),
    p(
      ref("Fig. 2", "#fig-2", "Figure 2 — Modified liquid-containing means"),
      text(
        " is an enlarged, diagrammatic, fragmentary sectional view of a modification of the liquid-containing means of the product shown in the first stage of ",
      ),
      ref("Fig. 1", "#fig-1", "Figure 1 — Four stages of one photographic product"),
      text(";"),
    ),
    p(
      ref("Fig. 3", "#fig-3", "Figure 3 — Another composite-product embodiment"),
      text(" is a view similar to "),
      ref("Fig. 2", "#fig-2", "Figure 2 — Modified liquid-containing means"),
      text(" of another embodiment of a composite product of the present invention;"),
    ),
    p(
      ref("Fig. 4", "#fig-4", "Figure 4 — Further composite-product embodiment"),
      text(" is a view similar to "),
      ref("Fig. 2", "#fig-2", "Figure 2 — Modified liquid-containing means"),
      text(" of still another embodiment of the product of the present invention;"),
    ),
    p(
      ref("Fig. 5", "#fig-5", "Figure 5 — Further product form"),
      text(" is a view like "),
      ref("Fig. 4", "#fig-4", "Figure 4 — Further composite-product embodiment"),
      text(" of still another form of the product of the present invention;"),
    ),
    p(
      ref("Fig. 6", "#fig-6", "Figure 6 — Product after liquid release"),
      text(" is a view similar to "),
      ref("Fig. 5", "#fig-5", "Figure 5 — Further product form"),
      text(" showing the product of "),
      ref("Fig. 5", "#fig-5", "Figure 5 — Further product form"),
      text(" after the release of the liquid;"),
    ),
    p(
      ref("Fig. 7", "#fig-7", "Figure 7 — Another product modification"),
      text(" is a view similar to "),
      ref("Fig. 2", "#fig-2", "Figure 2 — Modified liquid-containing means"),
      text(" of still another modification of the product of the present invention;"),
    ),
    p(
      ref("Fig. 8", "#fig-8", "Figure 8 — Product for use with liquid-containing means"),
      text(" is a view similar to "),
      ref("Fig. 5", "#fig-5", "Figure 5 — Further product form"),
      text(" of a product useful with any of the liquid-containing means of the invention;"),
    ),
    p(
      ref("Fig. 9", "#fig-9", "Figure 9 — Modified liquid-containing means"),
      text(" is a view similar to "),
      ref("Fig. 2", "#fig-2", "Figure 2 — Modified liquid-containing means"),
      text(" of a modification of the liquid-containing means of the latter figure;"),
    ),
    p(
      ref("Fig. 10", "#fig-10", "Figure 10 — Apparatus for filling the Figure 9 member"),
      text(
        " is a diagrammatic view, partly in section and partly in elevation with parts broken away, of apparatus whereby the cells of the fluid-retaining member of ",
      ),
      ref("Fig. 9", "#fig-9", "Figure 9 — Modified liquid-containing means"),
      text(" may be filled;"),
    ),
    p(
      ref("Fig. 11", "#fig-11", "Figure 11 — Camera means"),
      text(
        " is a diagrammatic view, in elevation with parts broken away, of one embodiment of camera means suitable for forming a positive print in the product of the present invention;",
      ),
    ),
    p(
      ref("Fig. 12", "#fig-12", "Figure 12 — Modified camera means"),
      text(" is a view similar to "),
      ref("Fig. 11", "#fig-11", "Figure 11 — Camera means"),
      text(" of a modified form of said camera means;"),
    ),
    p(
      ref("Fig. 13", "#fig-13", "Figure 13 — Means for fracturing a membrane"),
      text(
        " is a fragmentary, diagrammatic view in elevation of novel means for fracturing the liquid-retaining membrane of the product of the invention;",
      ),
    ),
    p(
      ref("Fig. 14", "#fig-14", "Figure 14 — Another product form"),
      text(
        " is an exaggerated, diagrammatic, fragmentary sectional view taken along the longitudinal axis of still another form of product comprehended by the present invention;",
      ),
    ),
    p(
      ref("Fig. 15", "#fig-15", "Figure 15 — Liquid-reagent sac or pod"),
      text(
        " is a perspective view of one form of sac or pod for containing the liquid reagent of the product of ",
      ),
      ref("Fig. 14", "#fig-14", "Figure 14 — Another product form"),
      text(";"),
    ),
    p(
      ref("Fig. 16", "#fig-16", "Figure 16 — Sac before filling"),
      text(" is a fragmentary perspective view showing the sac of "),
      ref("Fig. 15", "#fig-15", "Figure 15 — Liquid-reagent sac or pod"),
      text(" just before the latter is filled with the liquid material;"),
    ),
    p(
      ref("Fig. 17", "#fig-17", "Figure 17 — Novel sheet material"),
      text(
        " is a fragmentary, exaggerated, sectional view taken along the longitudinal axis of one form of novel sheet material comprehended by the invention;",
      ),
    ),
    p(
      ref("Fig. 18", "#fig-18", "Figure 18 — Another container construction"),
      text(
        " is a fragmentary, enlarged, perspective view illustrating the construction of another form of the container means which may comprise part of the novel composite product of the invention;",
      ),
    ),
    p(
      ref("Fig. 19", "#fig-19", "Figure 19 — Filled container"),
      text(" is a perspective view of the filled container;"),
    ),
    p(
      ref("Fig. 20", "#fig-20", "Figure 20 — Section through the Figure 19 container"),
      text(" is a sectional view taken along line 20-20 of "),
      ref("Fig. 19", "#fig-19", "Figure 19 — Filled container"),
      text(";"),
    ),
    p(
      ref("Fig. 21", "#fig-21", "Figure 21 — Another composite product"),
      text(
        " is an enlarged, fragmentary, sectional view in perspective illustrating another form of the composite product of the invention;",
      ),
    ),
    p(
      ref("Fig. 22", "#fig-22", "Figure 22 — Another composite product"),
      text(
        " is a longitudinal, sectional view showing still another composite product of the invention;",
      ),
    ),
    p(
      ref("Fig. 23", "#fig-23", "Figure 23 — Another embodiment"),
      text(
        " is a somewhat diagrammatic, perspective view showing still another embodiment of the invention;",
      ),
    ),
    p(
      ref("Fig. 24", "#fig-24", "Figure 24 — Modified container means"),
      text(
        " is a fragmentary, enlarged, sectional view illustrating another form of the invention which embodies a novel modification of the container means.",
      ),
    ),
    {
      kind: "figure-sheet",
      figureLabel: "FIGURES 1–4",
      title: "Film-stack and liquid-containing means",
      description: [
        text(
          "The pinned Sheet 1 drawing visibly labels Transparent Base, Image Receiving Layer, Photosensitive Layer, Liquid Containing and Distributing Means, Liquid Containing Layer, Porous Layer, Frangible Liquid-Retaining Wall, Water-Vapor Impervious Coating, White Precipitate, Positive Image, Negative Image, Transfer Print, EXPOSE AND RELEASE LIQUID, STRIP, and OBTAIN TRANSFER PRINT; reference numerals are 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, and 56. Sheet 2 visibly labels Liquid, Frangible Retaining Wall, Cells, Base Member, Photosensitive Layer, Base, Permeable Anti-Halation Coating, Positive Image Receiving Layer, and Positive Print Layer; reference numerals are 46a, 48, 60, 62, 64, 66, 68, 70, 70a, 72, 74, 74a, and 76. The sheet closes with INVENTOR, the handwritten Edwin H. Land signature, BY, the handwritten Donald P. Brown signature, and Attorney.",
        ),
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIGURES 5–8",
      title: "Additional film-stack embodiments",
      description: [
        text(
          "The pinned Sheet 3 drawing visibly labels Liquid Containing and Distributing Means, Photosensitive Layer, Opaque Porous Layer, Base, Positive Image Receiving Layer, Ruptured Retaining Wall, Exposed Photosensitive Layer, Transfer Prints, Solarized Photosensitive Layer, Porous Layer, Frangible Wall, Porous Liquid Containing Layer, Transparent Film Base, and Water Permeable Layer; reference numerals are 60, 66, 68, 80, 80a, 80b, 81, 82, 82a, 83, 84, 85, 86, 87, 88, 89, 90, and 91. The sheet closes with INVENTOR, the handwritten Edwin H. Land signature, BY, the handwritten Donald P. Brown signature, and Attorney.",
        ),
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIGURES 9–10",
      title: "Rupturable membrane and filling apparatus",
      description: [
        text(
          "The pinned Sheet 4 drawing visibly labels Liquid Containing Means and Rupturable Membrane in Figure 9, then shows the Figure 10 reference numerals 92, 92a, 92b, 94, 96, 100, and 102; the sheet closes with INVENTOR, the handwritten Edwin H. Land signature, BY, the handwritten Donald P. Brown signature, and Attorney.",
        ),
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIGURES 11–13",
      title: "Camera means and membrane-fracturing rolls",
      description: [
        text(
          "The pinned Sheet 5 drawings visibly show Figure 11 reference marks 110, 112, F, 114, 116, 118, 119, and 120; Figure 12 marks F', 112a, and 121; and Figure 13 marks F, 122, 124, 126, and 126'. The sheet closes with INVENTOR, the handwritten Edwin H. Land signature, BY, the handwritten Donald P. Brown signature, and Attorney.",
        ),
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIGURES 14–17",
      title: "Pod, reagent, and composite sheet constructions",
      description: [
        text(
          "The pinned Sheet 6 drawings visibly label Figure 14 Liquid Containing Means, Base, Photosensitive Layer, and Image Receiving Layer, with reference numerals 210, 212, 214, 216, 218, and 220; Figure 15 marks 218; Figure 16 marks 218 and 222; and Figure 17 labels Liquid Containing Means, Base, and Image Receiving Layer, with reference numerals 214, 216, 218, 220, and 224. The sheet closes with INVENTOR, the handwritten Edwin H. Land signature, BY, the handwritten Donald P. Brown signature, and Attorney.",
        ),
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIGURES 18–22",
      title: "Multilayer container and composite products",
      description: [
        text(
          "The pinned Sheet 7 drawings visibly label Figure 18 Coating, Metal Foil, Paper Backing, and Sealing Strip, with reference numerals 230, 230a, 230b, 230c, 232, 234, and 236; Figure 19 marks 240, 232, and 234; Figure 20 marks 20—20, 230, 235, 240, and 234; Figure 21 labels Container and Sheet Support, with reference numerals 240, 242, and 234; and Figure 22 labels Photosensitive Layer, Film Base, and Print Receiving Layer, with reference numerals 246, 240, 248, and 242. The sheet closes with INVENTOR, the handwritten Edwin H. Land signature, BY, the handwritten Donald P. Brown signature, and Attorney.",
        ),
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIGURES 23–24",
      title: "Hinged image unit and brittle tube retainer",
      description: [
        text(
          "The pinned Sheet 8 drawings visibly label Figure 23 Opaque Barrier, Photosensitive Layer, Container, and Print Receiving Layer, with reference numerals 294, 300, 310, 312, 314, 318, 319, 320, and 322; and Figure 24 Porous Retainer, Frangible Container, and Sheet Support, with reference numerals 242, 350, and 352. The sheet closes with INVENTOR, the handwritten Edwin H. Land signature, BY, the handwritten Donald P. Brown signature, and Attorney.",
        ),
      ],
    },
    {
      kind: "heading",
      level: 2,
      text: "DETAILED DISCLOSURE (STAGED MANUAL PASS)",
    },
    p(
      text(
        "In a preferred form, the novel film of the present invention comprises a photosensitive layer, as for example, a silver halide-gelatin emulsion, means for developing a latent image formed in said photosensitive layer and means for forming a positive image in said film as a product of the development of said photosensitive layer, said positive image being formed either in the photosensitive layer or in another layer of the film. The material in which the positive image is formed may be so attached to the film as to be readily stripped therefrom after formation of the positive image.",
      ),
    ),
    p(
      text(
        "A liquid is preferably carried by the film out of contact with the photosensitive layer and is adapted, when released from the containing means therefor, to permeate said photosensitive layer. The liquid may contain, in solution, the developer for the photosensitive material of the film, or it may comprise a solvent for the developer, the latter being contained as a solid in another layer of the film through which the liquid must travel in order to reach the photosensitive layer. The liquid material may also contain, or dissolve in its travel to the photosensitive layer, other compounds which are desired in the treatment of the photosensitive layer and in the production of a fixed positive image in accordance with the invention.",
      ),
    ),
    p(
      text(
        "The liquid may be carried by the film in any one of several ways, as, for example, by providing the film with a plurality of cell-like chambers for containing the liquid, or by forming on, or securing to, the film a plurality of sacs or containers of the liquid, or by providing the film with a layer of a microscopically porous material or a blotter-like material saturated with said liquid, or by providing a true emulsion of said liquid in one of the layers of the film.",
      ),
    ),
    p(
      text(
        "The liquid material is released to permeate the photosensitive layers of the film in any of several ways, depending on the manner in which it is carried by the film. If, for example, the liquid is contained in chambers, or in a blotter-like material, a liquid-retaining wall or membrane is provided for said chambers or material separating the latter from the photosensitive layer and is formed, for example, of a relatively brittle plastic which, when subjected to stretching, is adapted to fracture, releasing the liquid. If the liquid is contained in an emulsion or in containers, the liquid may be released by compressing the film or, in the case of the containers, by piercing the latter.",
      ),
    ),
    p(
      text(
        "In one form of the invention there is provided between the liquid-retaining means and the photosensitive material a layer of permeable and relatively deformable material such as a porous paper, for example, blotter paper. This layer preferably adjoins the liquid-retaining membrane and serves as a deformable backing against which the membrane can be fractured. It also acts to diffuse the liquid released from the liquid-retaining means and insures a uniform dispersion of the latter throughout the photosensitive layer. A porous, permeable layer of this character, located between the liquid-retaining means and the photosensitive layer, may also serve as the means for carrying in solid form one or more of the compounds used in the photographic processes of the invention, which compounds are to be dissolved by the liquid and transported thereby to the photosensitive layer in carrying out said processes.",
      ),
    ),
    p(
      text(
        "To prevent loss of the liquid material by vaporization, the liquid-containing means is rendered vapor impervious, for example, by providing the film with a continuous coating, i. e., a casing, of a vapor-impervious material such as paraffin or polyethylene. It is to be understood that the coating material may be provided on the outer surfaces of the film or between predetermined layers thereof, provided that the casing or envelope of vapor-impervious material thus formed contains therewithin the liquid-containing means. If the means for containing the liquid comprises cells or chambers, vapor loss may also be prevented by lining the walls of said cells or chambers with the vapor-impervious material.",
      ),
    ),
    p(
      text(
        "One method of forming a positive image, in accordance with the present invention, consists in exposing a layer of photosensitive material to form therein a latent image and then permeating said layer with a liquid reagent adapted to develop the latent image, and to give, in addition to the developed latent image, an ",
      ),
      term(
        "image-forming component",
        "The specification uses this phrase for the material produced or released by development that can move relative to developed silver halide and then form the fixed positive image in another layer or position.",
      ),
      text(
        ". The image-forming component and the developed silver halide are thereafter translated relative to one another, and in its relatively translated position the image-forming component acts to form a fixed image which is the positive of the subject matter of the latent image. This method may be carried out with the above described film, the liquid-containing means providing the liquid reagent.",
      ),
    ),
    p(
      text(
        "In one modification of the method, the relative translation of the image-forming component and the developed silver halide is obtained by movement of the image-forming component to a layer of positive print material adjacent the photosensitive layer.",
      ),
    ),
    p(
      text(
        "One way of forming a positive image, in accordance with the modification of the process wherein the image-forming component is transported to an adjacent positive print or image receiving layer, comprises the step of permeating the photosensitive layer, after the latter is exposed, with a liquid reagent comprising a developer for the exposed silver halide of said layer and a compound for forming soluble complex ions with the nonexposed silver halide. The liquid reagent acts to develop the exposed silver halide, and the nonexposed silver halide is dissolved in said reagent to provide the image-forming component. The latter migrates from the photosensitive layer to the adjacent positive print layer where it is developed and provides in silver a fixed positive of the latent image.",
      ),
    ),
    p(
      text(
        "Another method of forming a fixed image in a positive print layer is to have the photosensitive layer of the film suitably treated as, for example, by ",
      ),
      term(
        "solarization",
        "Here the period process treats the photosensitive layer near reversal before differential exposure, so development occurs in areas left unexposed and the resulting dye transfer can yield a positive image.",
      ),
      text(
        " prior to its differential exposure to actinic light in a camera so that development, after exposure, takes place in those areas which are unexposed during said differential exposure. The liquid reagent for the photosensitive layer contains a developer which gives as its oxidation product a dye base adapted to migrate from said layer to the adjacent positive print layer. There is uniformly dispersed throughout the surface layer of the latter material a coupler which is adapted to react with said dye base, whereby the migration of said base is effective to differentially dye the positive print material and to form therein the desired positive image. In another embodiment of this method of producing the fixed image, employing a solarized photosensitive layer, the coupler and the developer are contained in the liquid reagent and the dye, which is the product of the reaction of said coupler and the oxidized developer, is of a type adapted to migrate from the photosensitive layer to the positive print material.",
      ),
    ),
    p(
      text(
        "Still another embodiment of the invention, wherein the photosensitive layer is solarized, is to have the coupler dispersed throughout the photosensitive layer and adapted to form with the oxidized developer a migratory dye, or to have the oxidized developer couple with itself to form the migratory dye. The dye is then transported to, and dyes, an adjacent positive print layer to give a fixed positive dye image.",
      ),
    ),
    p(
      ref("Fig. 1", "#fig-1", "Figure 1 — Four stages of one photographic product"),
      text(
        " there is illustrated diagrammatically one embodiment of the novel photographic film of the invention which, as shown, comprises a suitable base 32 formed of a transparent material, preferably a plastic, such as a cellulosic ester, or a synthetic superpolymer of the nylon type, a layer 34 of clear gelatin, polyvinyl alcohol or other transparent material wherein a positive image may be formed and a layer 36 of photosensitive material such as a silver halide gelatin emulsion, said layers being superimposed upon the base in the order named.",
      ),
    ),
    p(
      text(
        "The film is provided with novel liquid-containing means 38 which, as illustrated, comprises a sheet 40 of porous material such as blotter paper, containing within its pores a predetermined quantity of at least the solvent, e. g., water, for the liquid reagent. To retain the liquid within said sheet a frangible liquid-retaining wall or membrane 42 formed, for example, of a relatively brittle plastic such as polystyrene, is laminated to one face of said sheet between the latter and layer 36, and a thin film 44 of water-vapor-impervious material, such as paraffin or polyethylene, is coated on the other side of said sheet. Film 44 forms a part of a casing which completely encloses sheet 40 and prevents loss by vaporization of the liquid content of said sheet. As shown, a layer of the vapor-impervious material forms an outer coating 46 for base 32, but it is equally possible to employ a vapor-impervious plastic, such as polyethylene, as the base 32 and to connect said base with layer 44 by an edge seal to provide the vapor-impervious casing.",
      ),
    ),
    p(
      text(
        "To release the liquid from sheet 40, membrane 42 is fractured as by being stretched beyond its yield point. In order to provide a deformable base against which said membrane may be fractured, and to insure a uniform permeation of photosensitive layer 36 by the reagent when the latter is released, a porous layer 48, for example, of the same material as sheet 40, is located between membrane 42 and said photosensitive layer. It is to be understood that layer 48 may contain in solid form one or more of the compounds for the liquid reagent, which compounds are dissolved in the liquid as it passes through said layer.",
      ),
    ),
    p(
      text(
        "All of the above-described layers are laminated together in any suitable manner to form the film and layer 36 is secured to layer 34 so that separation of the two film portions on opposite sides of the interface of said layers may be readily effected. It is to be expressly understood that the drawings are diagrammatic and that the layer thicknesses are not drawn to scale. The overall thickness of the film may vary from a thickness somewhat greater than, to a thickness several times that of, ordinary photographic film.",
      ),
    ),
    p(
      text(
        "One method of forming a fixed image in accordance with the present invention is to provide within means 38 a liquid reagent and to provide in said reagent a developer, e. g., hydroquinone, and a compound, e. g., sodium thiosulfate, which forms soluble complex ions with silver halide at a less rapid rate than the developer will develop exposed silver halide. To carry out the method, a frame of the film is differentially exposed to actinic light, as for example in a camera, so that a latent image is formed in layer 36. After exposure, membrane 42 is fractured to cause the liquid reagent to permeate layer 36. At exposed areas 50 of said layer, development takes place and the silver halide is reduced to silver, remaining in layer 36, whereas at unexposed areas 52 the silver halide forms a soluble complex and is transported at least in part by the reagent to adjacent positive print layer 34 where reduction of the complex silver ions in solution is effected by the developer to form areas 54 of silver, the latter areas corresponding to the unexposed areas 52 of layer 36. An image is thus produced which is the positive of the latent image formed in photosensitive layer 36, and in order to provide a white, opaque background for such image the surface layer of base 32 adjoining layer 34 has dispersed thereon or therein a colorless compound which reacts with a compound contained in the liquid reagent to form a layer 56 of white precipitate. It is to be understood that the colorless compound may also be contained in a suitable permeable, transparent layer, for example of gelatin, disposed between base 32 and layer 34.",
      ),
    ),
    p(
      text(
        "If a positive transparency is desired instead of a print with an opaque background, one or both of the above compounds for producing layer 56 may be eliminated from the film.",
      ),
    ),
    p(
      text(
        "The positive print comprising a silver image on a white or transparent background, as desired, is obtained by stripping base 32 together with layer 34 from the remainder of the film, as shown in ",
      ),
      ref("Fig. 1", "#fig-1", "Figure 1 — Four stages of one photographic product"),
      text(". It will be noted that the print thus obtained is corrected for geometric reversal."),
    ),
    p(
      text(
        "In the above-described embodiment, the developer and the other reactive ingredients of the reagent may be contained either in layer 48 or in the liquid in layer 40. It is also possible to provide one or more of these materials in solid form in photosensitive layer 36, but this procedure is not preferred because it will tend to desensitize said layer.",
      ),
    ),
    p(
      text(
        "An example of a liquid reagent suitable for permeating the photosensitive layer in order to carry out the above method is one consisting of: sodium sulfite (anhydrous), 9.0 grams; hydroquinone, 4.5 grams; sodium hydroxide, 3.75 grams; potassium bromide, 3.00 grams; sodium thiosulfate, 10.00 grams; water to make 170 cubic centimeters.",
      ),
    ),
    p(
      text(
        "In another method of forming a positive image, layer 36 is solarized approximately to, or just beyond, the reversal point so that when said layer is differentially exposed to actinic light, as in a camera, and then developed, the development occurs in the nonexposed areas. In this form of the invention, the reagent provided by containing means 38 contains a developer such as a p-phenylene-diamine which, when oxidized, will react with a coupler such as alpha-naphthol to form a relatively blue dye. To form the positive image, the coupler may be contained in the liquid reagent or it may be dispersed throughout layers 36 or 48 and the dye which is formed migrates to layer 34 to form the positive image. The coupler may also be dispersed throughout layer 34, in which event the oxidized developer migrates to the latter layer and the dye is formed there. It is to be understood that the developer may also be of the type which provides, as a reaction product of development, a compound which couples with itself to form a dye. Examples of developers of this type are pyrocatechin and p-phenylene-diamine.",
      ),
    ),
    p(
      text(
        "Any of the other aforementioned methods of obtaining positive prints which involve the use of a suitable liquid reagent, in combination with a photosensitive layer and a positive print layer, may be carried out with the above-described film.",
      ),
    ),
    p(
      text("A modification 60 of the liquid-containing means 38 of "),
      ref("Fig. 1", "#fig-1", "Figure 1 — Four stages of one photographic product"),
      text(" is shown in "),
      ref("Fig. 2", "#fig-2", "Figure 2 — Modified liquid-containing means"),
      text(
        " and comprises a plurality of cells or chambers 62 formed by a plurality of grooves 64 in a base member 66, such as a sheet of cellulose acetate or cellulose nitrate, said grooves being preferably filled with the liquid and sealed by a frangible membrane or wall 68 formed, for example, of polystyrene and corresponding in function and structure to membrane 42 of the film of ",
      ),
      ref("Fig. 1", "#fig-1", "Figure 1 — Four stages of one photographic product"),
      text(
        ". Liquid-containing means 60 may be substituted for means 38 and, if desired, a porous layer corresponding to layer 48 of the film of ",
      ),
      ref("Fig. 1", "#fig-1", "Figure 1 — Four stages of one photographic product"),
      text(" may be provided between membrane 68 and layer 36 when means 60 is so substituted."),
    ),
    p(
      text(
        "It is to be understood that cells 62 of developer-retaining means 60 may be of various shapes, as for example rectangular or substantially circular in cross-section. It is preferable too that grooves 64 do not extend continuously across the film, so that in each transverse row of said grooves there is provided a plurality of cells. Moreover, the cells of successive rows are staggered so that the film can be cut longitudinally into strips after the cells are filled, for example during the manufacture of the film, without appreciable loss of liquid, and without rendering the strips thus obtained inoperative.",
      ),
    ),
    p(
      text("Referring to "),
      ref("Fig. 3", "#fig-3", "Figure 3 — Another composite-product embodiment"),
      text(
        " there is illustrated another modification of the novel film means of the present invention which comprises, as the outer or base layer thereof, liquid-containing means 60, a photosensitive layer 70 being supported by membrane 68 of said liquid-containing means. Separated from layer 70, by a permeable antihalation coating 72, is a layer 74 of gelatin, polyvinyl alcohol, regenerated cellulose, hydroxyethyl cellulose, or other transparent, water-permeable material wherein the positive image is adapted to be formed. Coating 72 is desirable but not essential, and layer 74 may adjoin layer 70 to give satisfactory results. A backing or base 76, preferably of an opaque material such as paper, supports layer 74 and forms therewith the positive print material. The latter is secured to coating 72 so that it can be readily stripped therefrom when desired. To prevent gradual loss of developer by evaporation, the walls of cells 62 may be coated with water-vapor-impervious material such as polyethylene or paraffin, or the film may be encased in a coating of said material. It is to be understood that layer 74 need not be transparent, but may be formed of a relatively opaque material such as paper, in which event backing 76 may be dispensed with. It is also possible to form backing layer 76 of opal cellulose acetate and to provide layer 74 by regenerating the surface of the acetate sheet to cellulose.",
      ),
    ),
    p(
      text("It will be noted that in each of the film structures described in Figs. "),
      ref("1", "#fig-1", "Figure 1 — Four stages of one photographic product"),
      text(", "),
      ref("3", "#fig-3", "Figure 3 — Another composite-product embodiment"),
      text(" and "),
      ref("4", "#fig-4", "Figure 4 — Further composite-product embodiment"),
      text(", as well as in the modified liquid-containing means of "),
      ref("Fig. 9", "#fig-9", "Figure 9 — Modified liquid-containing means"),
      text(
        ", the liquid is released for saturating the photosensitive layer by fracturing a frangible liquid-retaining membrane. This may be accomplished by forming the membrane of a relatively more brittle material than the other layers of the film so that the fracturing of said membrane can be achieved by subjecting the film to a tension which is beyond the yield point of said membrane and below the yield point of any of the other layers of the film.",
      ),
    ),
    p(
      text("A modified form of liquid-containing means 60 is shown in "),
      ref("Fig. 9", "#fig-9", "Figure 9 — Modified liquid-containing means"),
      text(
        " and comprises a sheet 92, for example, of film base provided with a plurality of chambers or cells 94, each of which is connected by a self-sealing slot 96 to the bottom wall of said base. Slots 96 form temporary seals for said cells and a more permanent seal is provided by a frangible membrane 98 formed of a relatively brittle material and adapted to function in the same manner as membranes 42 and 68 of liquid film-retaining means 38 and 60, respectively. When the side of film 92 containing slots 96 is subjected to sufficient tension to fracture sheet 98, slots 96 are also opened and the liquid contained in cells 94 is released.",
      ),
    ),
    p(
      text("The cells 94 of the retaining means of "),
      ref("Fig. 9", "#fig-9", "Figure 9 — Modified liquid-containing means"),
      text(
        " may be filled with the liquid in any of several ways and one novel method comprises causing film 92 to travel over a roll 100 (",
      ),
      ref("Fig. 10", "#fig-10", "Figure 10 — Apparatus for filling the Figure 9 member"),
      text(
        ") with the side thereof containing slots 96 on the outside, the tension on said film being insufficient to cause slots 96 to open in the straight portions 92a thereof. Throughout the length of the curved portion 92b of said film, the outside surfaces are stretched a substantial amount so as to fully separate the walls of slots 96, and cells 94 remain open during the travel of the base around the roll until said base is again traveling in a straight line. Roll 100 is immersed in a bath 102 of the liquid so that all of curved portion 92b of base 92 is immersed in said liquid as well as short lengths of straight portions 92a of said film adjoining both ends of the curved portion. Cells 94 are thus filled during the curved travel of film 92, and because the straight travel of the film is resumed before the latter emerges from bath 102, said cells are sealed prior to their emergence from the said bath and trap the liquid therein. The cells are thereafter permanently sealed by applying membrane 98 to film base 92. Various other methods may, of course, be used for filling the cells with the liquid.",
      ),
    ),
    p(
      text(
        "Novel camera means for use in connection with the films of the present invention, and embodying means for effecting the release of the liquid in this manner, is shown diagrammatically in ",
      ),
      ref("Fig. 11", "#fig-11", "Figure 11 — Camera means"),
      text(
        " and comprises means for operatively mounting, for example, a roll 110 of one of the films F of the invention, and shutter and lens means 112 of a conventional type adapted to effect exposure of a frame of said film. To release the developer and assist in the metering of the film after each exposure, two pairs 114 and 116 of laterally spaced rolls may be provided, each pair frictionally engaging said film to positively drive the latter and each being positively driven by the camera winding mechanism (not shown), which may be manually actuated. The leading pair of rolls 116 is adapted to drive the film at a higher linear velocity than the other pair 114, whereby film portion 118 between said rolls is subjected to a sufficient tension to fracture the liquid-retaining membrane. Rolls 116 also compress the film and thereby tend to insure a complete discharge of the liquid from the containing means therefor.",
      ),
    ),
    p(
      text(
        "After rolls 116 have metered the exposed frame therethrough, the actuating mechanism renders operative a film-cutting means 119 which cuts the exposed frame from the remainder of the film. The film as it travels from rolls 116 to the point at which it leaves the camera is guided by suitable guideways (not shown) and the travel is generally sufficient to insure development of the exposed area and formation of the positive print. An opening 120 is provided for discharging the cut film frame from the camera and if either of the films of ",
      ),
      text("Figs. "),
      ref("1", "#fig-1", "Figure 1 — Four stages of one photographic product"),
      text(" and "),
      ref("3", "#fig-3", "Figure 3 — Another composite-product embodiment"),
      text(
        " is used, the positive print material may then be stripped from the remainder of said film frame to provide the positive picture. It is to be understood that this stripping may be accomplished by suitable means within the camera so that the separated portions of the film issue from the camera. Each exposed frame may thus be developed and a print thereof formed without requiring that the remainder of the film be exposed. It will be apparent that in order to minimize the length of film between exposed frames, cutting means 119 should be located as closely as possible to the point at which the leading edge of each frame is exposed.",
      ),
    ),
    p(
      text("Certain of the film means, for example, the film illustrated in "),
      ref("Fig. 3", "#fig-3", "Figure 3 — Another composite-product embodiment"),
      text(
        ", gives a positive print which is not corrected for reversal. Accordingly, camera means shown in ",
      ),
      ref("Fig. 12", "#fig-12", "Figure 12 — Modified camera means"),
      text(
        " may effect geometric reversal of the image prior to its projection on the film frame. The camera comprises a lens 112a and means similar to those shown in ",
      ),
      ref("Fig. 11", "#fig-11", "Figure 11 — Camera means"),
      text(
        " for mounting the novel film F'. A mirror 121 is located with relation to lens system 112a and the plane of film F' so as to reflect and reverse light transmitted through the lens before it reaches said film, the mirror being disposed at an angle of substantially 45 degrees to the optical axis. The camera of ",
      ),
      ref("Fig. 11", "#fig-11", "Figure 11 — Camera means"),
      text(
        " may instead have an attachment comprising prisms or mirrors for reversing the entering light.",
      ),
    ),
    p(
      text("In the camera of "),
      ref("Fig. 11", "#fig-11", "Figure 11 — Camera means"),
      text(
        ", rolls 114 and 116 operate to uniformly stretch the portion of film therebetween, but it is expressly understood that the liquid-retaining membrane can be fractured in various other ways. The several layers may be subjected to differential stretching by causing the film to travel under tension over a cylindrical roll or drum whose surface curvature is such that the membrane will be stretched sufficiently to fracture during this travel. The film may thereafter be compressed to insure complete release of the liquid by passing it between friction rolls. Novel means for fracturing the membrane and causing release of the liquid are shown in ",
      ),
      ref("Fig. 13", "#fig-13", "Figure 13 — Means for fracturing a membrane"),
      text(
        " and comprise a pair of rolls 122 and 124 between which film F is adapted to travel. Roll 122 is preferably formed of a rigid material, such as metal, and is provided with a plurality of surface corrugations 126. Roll 124 is formed of a yielding material, such as rubber, and has its axis located with respect to roll 122 so that its periphery is substantially compressed by corrugations 126 in order for rotation of said rolls to take place. When film F is metered between the rolls, successive lengths are subjected to differential stretching, insuring at least one fracture of the liquid-retaining membrane for each predetermined unit length. This unit length, the maximum distance separating fractures, may be controlled by controlling the radius of curvature and spacing of corrugations 126 on roll 122.",
      ),
    ),
    p(
      text(
        "By controlling the thickness of the several layers, the liquid-retaining membrane may be located substantially closer to one face of the film than to the other. The membrane may thereby be subjected to compression when the film is wound in one direction and to tension when the film is wound in the other direction, the tension being sufficient to fracture the membrane. The liquid is retained whenever the film is wound in one direction and released whenever it is wound in the other direction. Where the novel film is to be used in roll form, a water-impervious material somewhat less vapor-impervious than paraffin may be used in sufficient thickness to prevent vapor loss. Satisfactory materials include polyvinylidene chloride, polyvinyl acetate-chloride, and cellulose acetate butyrate. When the film is wound as a roll, the aggregate layers of vapor-resistant material protect it from appreciable vapor loss for a relatively long time, although one or more outer frames may eventually lose liquid by vaporization.",
      ),
    ),
    p(
      text("A further preferred form of the invention is shown in "),
      ref(
        "Figs. 14 to 17",
        "#fig-14",
        "Figures 14–17 — Viscous liquid-containing film and pod constructions",
      ),
      text(
        " and comprises novel means for releasably containing a liquid which is preferably viscous and which is adapted when released to permeate a predetermined area of a photosensitive layer to process the same. In the form illustrated in ",
      ),
      ref("Fig. 14", "#fig-14", "Figure 14 — Another product form"),
      text(
        ", a photosensitive layer is an element of the composite product and the product is adapted to carry out any of the foregoing methods whereby a transfer print is obtained.",
      ),
    ),
    p(
      text(
        "The liquid in the container may comprise a film-forming material such as a high polymer so that upon release the container contents, in addition to providing the liquid for carrying out the desired processing, also form throughout the area over which they are distributed a layer of film-forming material which eventually solidifies to give a solid film. This film-forming component of the liquid contents of the container may serve as the thickening agent for imparting the desired high viscosity to said contents. The film obtained from the film-forming reagent may serve as the layer in which the transfer print is formed, or may cooperate with another layer to provide the print-receiving stratum. Moreover, although a film-forming reagent is used, the transfer print may be entirely formed elsewhere than in the film formed by the reagent as by selecting for the material of one of the other layers of the composite structure a substance wherein the image-forming component for producing the transfer image is more readily precipitated. The invention also comprehends a product of sheetlike structure which preferably comprises a base and containing means for the liquid reagent and does not include a photosensitive layer as an element thereof, but is so constructed that when pressed into face-to-face contact with the photosensitive layer it releases the liquid reagent to cause the processing of the photosensitive layer.",
      ),
    ),
    p(
      text("Referring to "),
      ref("Fig. 14", "#fig-14", "Figure 14 — Another product form"),
      text(
        ", one form of the novel film means comprises a film base 210 formed preferably of transparent plastic, such as cellulose acetate, cellulose nitrate, cellulose acetate propionate, or cellulose acetate butyrate. Base 210 supports a layer 212 of photosensitive material, such as a silver halide or mixed silver halide emulsion. Mounted adjacent layer 212 is an image-receiving layer 214 formed of a water-permeable material, for example regenerated cellulose, polyvinyl alcohol and other high-molecular-weight film-forming polyhydroxy alkanes, sodium alginate, certain of the cellulose ethers such as methyl cellulose and their derivatives such as sodium carboxymethyl cellulose or hydroxyethyl cellulose, papers, gelatin or glue, gums or starch, and compatible mixtures. If the reagent contains a film-forming thickening agent, layer 214 may be selected from those materials which have an affinity for the film. It may be desirable that layer 214 and/or the film formed by the liquid reagent be nontransparent, and it is possible to form a white and substantially opaque layer by incorporating in the materials used for film 214, or as the film-forming component of the liquid reagent, a suitable pigment, as, for example, titanium dioxide. Receiving layer 214 is mounted on a base 216 which may be any suitable base material such as a cellulose plastic, a nylon-type plastic, a polyvinyl plastic, or paper.",
      ),
    ),
    p(
      text(
        "To releasably contain the liquid reagent, the composite film is provided with one or more elongated containers 218 in the form of sacs or pods, preferably mounted transversely between layers 212 and 214. Each contains a sufficient quantity of liquid reagent to permeate a frame of the photosensitive layer of the composite film and is adapted to release said reagent longitudinally in only one direction. One of sacs 218 is provided for each film frame, preferably adjacent the leading or trailing edge of said frame. The composite film comprising these several layers and the container may be provided in the form of a roll or a film pack or in single frames. Sacs 218 are preferably so formed that the application of suitable mechanical stress thereto, as, for example, the squeezing together of the faces of the composite film, releases the liquid reagent in the direction of the exposed frame. As shown in ",
      ),
      ref("Figs. 14 and 15", "#fig-14", "Figures 14–15 — Pod construction"),
      text(
        ", pods 218 may be formed from a single sheet of oxygen- and water-vapor-impervious material, such as wax-impregnated, metal-coated paper or wax-coated metal foil. The sheet is folded and one face is subjected to a forming operation whereby a cavity ",
      ),
      text("222"),
      text(" as shown in "),
      ref("Fig. 16", "#fig-16", "Figure 16 — Sac before filling"),
      text(
        ", is obtained therein. This cavity is thereafter filled with the liquid reagent and the faces of the sheet are folded into engagement with one another and the edges sealed by the application of heat. To exclude oxygen, the cavity is completely filled or the filling operation is carried out in an inert atmosphere. The seal is such that it will break before the folded edge will fracture, so that upon application of pressure to the sac the liquid is released from the side of the sac containing the seal. The seals at the end of the sac are preferably formed so as to offer a greater resistance to separation than the longitudinal seal. There is thus obtained a water-vapor-impervious container whose contents for relatively long periods will neither become dry nor oxidize.",
      ),
    ),
    p(
      text(
        "The reagent is relatively viscous, preferably having a viscosity in excess of fifty centipoises, to insure complete and relatively uniform permeation of the exposed frame. A reagent substantially less viscous may be absorbed too greatly in some portions of the photosensitive layer while other portions remain relatively dry. A suitable thickening agent is preferably a water-soluble, film-forming high-molecular-weight polymer or protein, such as gelatin, hydroxyethyl cellulose, or sodium or aluminum carboxymethyl cellulose, which forms a relatively firm, dimensionally stable film.",
      ),
    ),
    p(
      text(
        "Example 2: Water — 100 cubic centimeters; sodium sulfite — 7.0 grams; hydroquinone — 3.3 grams; sodium thiosulfate — 1.4 grams; aqueous solution of medium-viscosity sodium carboxymethyl cellulose consisting of 20 grams of that compound in 100 cubic centimeters of water — 5 grams; sodium hydroxide, 10% solution — 11.2 cubic centimeters.",
      ),
    ),
    p(
      text(
        "The sodium sulfite, hydroquinone, and sodium thiosulfate are dissolved in the water, and the sodium carboxymethyl cellulose solution is then added and thoroughly mixed therewith. The solution thus obtained is cooled to a temperature between 65° and 75° F. and thereafter the sodium hydroxide solution is added thereto.",
      ),
    ),
    p(
      text(
        "An alternative method of obtaining the above reagent is to first dilute the sodium carboxymethyl cellulose solution with the water and thereafter add the sodium sulfite, hydroquinone, and sodium thiosulfate. The mixing of these ingredients may be carried out at a temperature between 80° F. and 90° F. and after the components are thoroughly mixed, the mixture may be cooled to a temperature of approximately 65° to 75° F. and the specified quantity of sodium hydroxide solution added thereto.",
      ),
    ),
    p(
      text(
        "The proportions of the ingredients set out above may be varied within relatively wide limits as, for example, quantities of hydroquinone up to 6.6 grams may be used. Similarly, the quantity of sodium thiosulfate may be varied from 1.4 to 2.8 grams, and the amount of sodium hydroxide solution from 11 to 44 cc. While it is preferred to omit the preservative from the novel reagents of the invention, satisfactory results may be obtained by including, for example, 2.2 to 6.6 grams of potassium bromide in the solution of the above example.",
      ),
    ),
    p(
      text(
        "Example 3\n\nWater — cubic centimeters — 150\nHydroquinone — grams — 2.8\nSodium sulfite — grams — 20\nMetol — grams — 1.55\nSodium thiosulfate — grams — 10\nAqueous solution of medium viscosity sodium carboxymethyl cellulose consisting of 20 g. of the latter compound in 100 cc. of water — grams — 100\nSodium hydroxide — grams — 5.6",
      ),
    ),
    p(
      text(
        "Sodium alginate may be used instead of sodium carboxymethyl cellulose in either of the above examples in the same relative amounts as sodium carboxymethyl cellulose. Many of the starches as, for example, Merck's starch, Argo starch, Maine potato starch and Brazilian starch may also be used, and it is preferable when using these starches to employ a concentration approximately twice that of the sodium carboxymethyl cellulose suggested above.",
      ),
    ),
    p(
      text(
        "If a relatively white and nontransparent film is to be formed by the reagent, there may be incorporated in said reagent a suitable pigment such as titanium dioxide or mixtures of titanium dioxide and magnesium oxide or magnesium carbonate. The addition of titanium dioxide equivalent to from 10 to 20% by weight of the reagent has given good results. These pigments also serve as fillers for increasing the viscosity of the reagent.",
      ),
    ),
    p(
      text(
        "Examples of other developers which may be used in the reagent are p-aminophenol hydrochloride (Kodelon), p-hydroxyphenylamino-acetic acid (Athenon, Glycin), p-phenylenediamine, pyrocatechin, diaminophenolhydrochloride (Amidol), pyrogallol, o-phenylenediamine and bromohydroquinone.",
      ),
    ),
    p(
      text(
        "Examples of other materials which may be used in the reagent for the purpose of forming a soluble silver complex with the undeveloped silver halide of the photosensitive layer are ammonium thiosulfate and ammonia. For obvious reasons, it is preferable that the complex-forming substance be one which does not desensitize the silver halide emulsion and one which is not toxic. For example, a compound such as sodium cyanide which will give satisfactory photographic results when used in the reagent in accordance with the methods of the invention is generally not desirable because of its toxic character.",
      ),
    ),
    p(
      text(
        "The liquid reagent may also contain other accelerators, as for example potassium hydroxide, sodium carbonate, borax, sodium metaborate, paraformaldehyde, trisodium phosphate or Triton B. The last-named alkali, a Rohm and Haas product, is a 40% aqueous solution of benzyl trimethyl ammonium hydroxide. In certain modifications of the reagent composition, the preservative and the restrainer may be omitted.",
      ),
    ),
    p(
      text(
        "To practice the method, photosensitive layer 212 is differentially exposed, for example in a camera, through base 210 to predetermined subject matter so as to form in said layer a latent image of said subject matter. The film is then subjected, in the absence of actinic light, as for example in the camera or in a dark room, to compression or any other application of stress whereby the liquid reagent in container 218 is released from said container and caused to permeate the photosensitive layer and the receiving layer. The exposed silver halide, at least in the portions of the photosensitive layer adjacent the receiving layer, is developed to silver and a portion of the unexposed silver halide is transformed to the soluble silver complex which is transported at least in part to the receiving layer. This soluble complex is reduced in receiving layer 214 to an insoluble product comprising silver, said product forming in said receiving layer a positive image of the subject matter to which the photosensitive layer was exposed.",
      ),
    ),
    p(
      text(
        "The thickening agent in the reagent forms a film on the receiving layer and accordingly the insoluble reduction product which provides the positive image is contained at least in part in said film. After the formation of the positive image, layer 214, the film formed thereon by the reagent, and base 216 are separated from the photosensitive layer.",
      ),
    ),
    p(
      text(
        "If a transparency is desired, base 216 as well as layer 214 is formed of transparent materials, but if a conventional positive print, i. e., an image visible against a white nontransparent background, is desired, base 216 is preferably formed of a relatively nontransparent, white material. For example, base 216 may be a pigmented cellulosic plastic such as Kotavachrome base, paper, or opal cellulose acetate.",
      ),
    ),
    p(
      text(
        "It is less preferable, but also possible, to use as layer 214 a sheet of relatively water-permeable, nontransparent and preferably opaque white material adapted to adhere to the photosensitive layer 212, and sufficiently thin so that the complex silver ions in the reagent may permeate through said layer to the surface thereof remote from the photosensitive layer to form, when reduced, an image visible from the latter surface of said layer. In the latter case, if base 216 is transparent, it is unnecessary to separate said base from layer 214 since the positive image is visible through said base, and layer 214 acts as a barrier to render layer 212 and the developed silver contained therein invisible.",
      ),
    ),
    p(
      text(
        "Where the reagent contains a thickening agent adapted to form a film, the separate receiving layer 214 may be omitted and the film formed by the reagent used for receiving all of the complex silver ions transported from layer 212. In this modification of the film, it is preferable to use as base 216 a material having a greater affinity for the film-forming material than for the photosensitive layer. A suitable base of this character is pure alpha paper where the film-forming material is any one of the starches, sodium alginate or sodium hydroxyethyl cellulose mentioned above. It is also possible to use substantially all of the plastic, paper and other sheet materials mentioned hereinabove for base 216, provided these materials are first subcoated on the side which is to adjoin the photosensitive layer with a film of the film-forming material in the reagent.",
      ),
    ),
    p(
      text(
        "To carry out another method for forming a positive image, liquid reagent 220 comprises a developer which tans the carrier for the photosensitive material of layer 212 wherever development of said material takes place, and also contains a compound which is adapted to react with a compound dispersed throughout layer 212 to form in said layer a dye which is substantive to the tanned carrier. When the liquid reagent permeates the photosensitive layer, said compound reacts to form the dye throughout layer 212, and wherever development of the latent image takes place, i. e., where the carrier is tanned, the dye is attracted and retained, whereas wherever no development takes place, the dye migrates to the receiving layer and forms therein the desired positive image.",
      ),
    ),
    p(
      text(
        "In a preferred modification of this embodiment of the invention, the developer also serves as the compound which reacts with the compound in the photosensitive layer to form the dye. For example, pyrocatechin may be the developer and p-phenylenediamine may be the compound contained in the photosensitive layer which reacts therewith to form the dye.",
      ),
    ),
    p(
      text(
        "In a modification of the invention, there is provided a unitary sheetlike product 224 (",
      ),
      ref("Fig. 17", "#fig-17", "Figure 17 — Unitary sheetlike product"),
      text(
        ") comprising base 216 and containers 218 and adapted to be used with any developable photosensitive layer containing a latent image to produce a positive image corresponding to the subject matter of said latent image on base 216.",
      ),
    ),
    p(
      text(
        "Base 216 is shown with a receiving layer 214 but the latter may be omitted in the event reagent 220 contains a film-forming material and it is desired to form the positive image in the film obtained from said material.",
      ),
    ),
    p(
      text(
        "In use, composite sheet 225 is pressed into face-to-face contact with an exposed photosensitive layer of, for example, a conventional negative film in such a manner that containers 218 are caused to release the reagent and the latter is spread over the entire exposed frame of said photosensitive layer, causing a fixed positive image to be formed on base 216. Sheet 224 may be used either in a darkroom after the exposed photosensitive film is removed from the camera or in the camera so that a fixed positive image is obtained shortly after exposure.",
      ),
    ),
    p(
      text(
        "A modified form of the film and composite sheet material of the above-described embodiment may be used whereby it becomes unnecessary to keep the unit formed of said sheet material and film in the darkness of the camera after exposure. For example, the photosensitive film may have its photosensitive layer supported by a sheet of opaque material such as black paper, and the sheet material carrying the reagent may be provided with a backing of relatively opaque material. Light is thus excluded from the unit formed of the exposed film and the sheet material when the two are brought into operative engagement, and said unit may pass directly out of the camera, after being assembled, into the light without deleteriously affecting the image-forming reaction.",
      ),
    ),
    p(
      text(
        "It is to be understood that containers 218 may be provided as units separate from base 216 in the above-described embodiments, said containers being operatively positioned between said base and the photosensitive film as the latter are pressed together after exposure of said film. This may be accomplished in the camera by equipping the latter with suitable dispensing means for the containers operatively connected to the film-metering mechanism of the camera. Containers 218 may also be manually positioned between the exposed photosensitive layer and base 216 as the latter are operatively pressed together, for example, between a pair of squeegee or wringer rollers, in a dark room.",
      ),
    ),
    p(
      text(
        "The film-forming material when used as an ingredient of the liquid reagent is preferably a high molecular weight polymer which imparts to the composition the desired viscosity and which is of such character as to retain its viscosity-imparting and film-forming properties in the liquid material for the length of time that is to elapse between the mixing and the use of the viscous liquid. Where it is desired that the liquid material once mixed and in equilibrium remain uniformly viscous for any given temperature, the film-forming material is preferably one of the class of high molecular weight polymers which include in their chemical structure such groups as, for example, the ether, alkyl, hydroxyl, carboxyl, and acetyl groups that are stable to alkalis and which contain none of the chemical groups, such as the ester and acid chloride groups, that are unstable to alkalis. The polymers also contain groups such as the hydroxyl and/or carboxyl groups which tend to solubilize in aqueous alkaline solutions. Suitable examples of such polymers are the alkali-inert and water-soluble cellulose derivatives such as sodium carboxymethyl cellulose and hydroxyethyl cellulose, and the alkali-inert and water-soluble polyalkane derivatives such as the sodium salts of polymethacrylic acid and polyacrylic acid.",
      ),
    ),
    p(
      text(
        "It is to be understood also that by a suitable selection of the film-forming material in liquid composition 220 (",
      ),
      ref("Fig. 14", "#fig-14", "Figure 14 — Another product form"),
      text(
        ") the solid film or layer which is formed therefrom may be caused to adhere to either the photosensitive emulsion 212 or the surface of image-receiving layer 214 when and if the latter are peeled apart subsequent to the processing. For example, if the film-forming material is the plastic sodium carboxymethyl cellulose and layer 214 is a paper such as a baryta paper, the solid film of sodium carboxymethyl cellulose, when formed, will have a greater affinity for the surface of layer 214 than for the gelatin of emulsion 212, provided, of course, that the latter is an ordinary emulsion comprising the usual partially but not fully hardened gelatin and the liquid in the composition does not complete the hardening thereof. In general, the sodium carboxymethyl cellulose film will adhere to the harder of two layers of gelatin between which it is spread. Accordingly, if the surface of any image-carrying layer is provided with a thin coating of a substantially fully hardened gelatin, the film of sodium carboxymethyl cellulose will adhere to said image-carrying layer in preference to the relatively softer gelatin layer of the photosensitive emulsion.",
      ),
    ),
    p(
      text(
        "The high viscosity for the liquid-processing agent is very desirable for any commercial use of the container 218 and its contents. In view of the order of nonuniformity of commercially available materials and of the pressure-applying means to be used in the release and spreading of the composition, for commercial purposes the film-forming material is preferably contained in the composition in suitable quantities to impart to the composition a viscosity in excess of 1,000 centipoises at a temperature of approximately 24° C. and preferably of the order of 1,000 to 200,000 centipoises at said temperature. It is to be understood that the construction of the container 218 may be modified, for example, by omitting the preforming of the cavity 222.",
      ),
    ),
    p(
      text(
        "One example of a suitable container of this type is formed from a single multilayer sheet of material 230 (",
      ),
      ref("Fig. 18", "#fig-18", "Figure 18 — Another container construction"),
      text(
        ") comprising three layers 230a, 230b, and 230c. Layer 230a, which provides the internal surface layer of the container, is formed of a material which is chemically inert to the processing agent and which is impervious to the liquid of the agent. One class of materials suitable for this purpose is the polyvinyl acetals, and of the acetals, polyvinyl butyral is a preferred species. A composition comprising 60% to 72% by weight of polyvinyl butyral, 10% to 23% by weight of 1/2-inch nitrocellulose, and approximately 5% by weight of dibutyl sebacate is particularly satisfactory as inner coating 230a. Layer 230b contiguous to layer 230a is preferably impervious to the vapor of the processing agent and is formed, for example, of a metallic foil, such as lead or silver foil. Backing layer 230c, for example of kraft paper, is provided and makes possible the use of thinner layers 230a and 230b.",
      ),
    ),
    p(
      text("The container 240 ("),
      ref("Fig. 20", "#fig-20", "Figure 20 — Section through the Figure 19 container"),
      text(
        ") is preferably formed by taking the single sheet of material 230 and folding the same medially as shown in ",
      ),
      ref("Fig. 18", "#fig-18", "Figure 18 — Another container construction"),
      text(
        " and thereafter securing the end marginal portions 232 and the longitudinal marginal portions 234 of the two fold faces to one another, providing a central space 235 (",
      ),
      ref("Fig. 20", "#fig-20", "Figure 20 — Section through the Figure 19 container"),
      text(
        ") for containing the processing agent. To fill the container, it is possible, for example, to adhere together the opposite longitudinally extending marginal portions 234 and the end marginal portions 232 at one end only of the container, the container being thereafter filled through the other end. The longitudinal seal between marginal portions 234 is such that upon application of a predetermined compressive force to the walls of the container there may be created within the container a sufficient hydraulic pressure to separate the marginal portions 234 throughout substantially their entire length. To insure this result, the bond securing together said marginal portions 234 is somewhat weaker than the bond which secures together end marginal portions 232. For example, the end portions may be secured by pressing the two polyvinyl butyral inner surfaces together and applying heat thereto while a sealing strip 236 may be inserted between the longitudinal marginal portions, which sealing strip is adapted to adhere to the inner layers of polyvinyl butyral with a lesser affinity than said layers adhere to one another in a direct polyvinyl butyral to polyvinyl butyral bond. Strip 236 may be formed of a material such as ethyl cellulose or a mixture of ethyl cellulose and paraffin.",
      ),
    ),
    p(
      text(
        "One or more containers 240 may be associated with sheet material to provide a sheetlike product capable of subjecting one or more areas of a photosensitive film to a predetermined processing. One such sheetlike structure is shown in ",
      ),
      ref("Fig. 21", "#fig-21", "Figure 21 — Sheetlike container structure"),
      text(
        " and comprises a plurality of containers 240 mounted on the surface of an image-carrying layer 242 as by being adhered thereto with their longitudinal axes extending transversely of said layer. The sheetlike product comprising layer 242 may comprise a part of a composite photographic film (",
      ),
      ref("Fig. 22", "#fig-22", "Figure 22 — Composite photographic film"),
      text(
        ") which includes as a part of its unitary structure a transparent film base 246, a photosensitive emulsion 248 mounted on said film base and one of image-carrying layers 242. Containers 240 are thus located between said photosensitive emulsion and said image-carrying layer and are capable of discharging their fluid content throughout the interface area of said layers. This composite photographic film may be provided as a roll film, in the form of a film pack comprising a plurality of interconnected frames, or in single frames.",
      ),
    ),
    p(
      text(
        "When the film-forming agent carried by container 240 is released therefrom and spread between a photosensitive emulsion such as emulsion 248 and an image-carrying layer such as layer 242, the two layers in contact with the thin layer of composition therebetween prevent the latter from oxidizing. It becomes possible, therefore, to employ higher concentrations of materials subject to oxidation in the processing agent when used in this manner than can be employed in compositions when used, for example, in the ordinary developer bath which have a substantial surface thereof exposed to oxygen. Moreover, the presence of the film-forming material in the liquid composition carried by the container 240 whereby the viscosity of the latter is substantially increased acts to insure an unsealing of the longitudinal edge 234 of the container throughout substantially the entire length thereof, when sufficient compressive force is applied to the container faces, thereby insuring the provision of a mass of the composition throughout said length free for spreading over the desired area.",
      ),
    ),
    p(
      text(
        "While it is preferable to spread the liquid composition from container 240 over the photosensitive emulsion by introducing the container between said emulsion and another sheet material and squeezing together said sheets, the spreading may also be accomplished without the use of said other sheet material as, for example, by means of an applicator roll which engages and spreads the composition over the photosensitive emulsion and which preferably is so surfaced as not to adhere to the composition. An embodiment of a composite product suitable for such use would be the structure shown in ",
      ),
      ref("Fig. 14", "#fig-14", "Figure 14 — Another product form"),
      text(" without layers 214 and 216, or the structure shown in "),
      ref("Fig. 21", "#fig-21", "Figure 21 — Another composite product"),
      text(
        " without layer 242. In the latter event the composition may be of the type adapted to form a white, opaque solid film when dry and may contain a sufficient quantity of silver halide solvent to cause the formation of a positive image in silver in the white layer, which image is visible from the surface of said white layer remote from the photosensitive layer. The white layer serves as an opaque barrier obstructing the negative from view and to provide the highlight portions of the positive.",
      ),
    ),
    p(
      text(
        "One further form of the composite film structure of the present invention is shown in ",
      ),
      ref("Fig. 23", "#fig-23", "Figure 23 — Another embodiment"),
      text(
        " and comprises a photosensitive layer 310, an image-carrying layer 312 and a container 300. Said layers and said container are connected together to form a unitary structure, the connection providing for a predetermined superpositioning of layer 310 with respect to layer 312 with container 300 in a position to discharge its contents between said layers. The unitary structure thus formed differs from the composite photographic films described above in that the connection between the photosensitive layer and the image-carrying layer is such as will permit of the ready displacement of said photosensitive layer with respect to the image-carrying layer so that the surface of the photosensitive layer normally adjacent the image-carrying layer can be directly exposed without having the light which effects said exposure intercepted by or incident on said image-carrying layer. In the form illustrated, photosensitive layer 310 is pivotally secured as by means of a hinge 314 to image-carrying layer 312 so that it may be pivoted from superposed position to a position at an angle to the plane of said image-carrying layer, in which position it may be photographically exposed. Container 300 may be secured to either the photosensitive layer or the image-carrying layer and as shown is adhesively secured to the photosensitive layer. This mounting locates the longitudinal seal 294 of said container 300 parallel to and adjacent the exposed area of the photosensitive layer when the latter is superposed on layer 312, placing the container in a position to release its contents throughout the area between said photosensitive layer and said image-carrying layer.",
      ),
    ),
    p(
      text(
        "Light barriers opaque to light that is actinic to the photosensitive layer are preferably associated with both the photosensitive layer 310 and the image-carrying layer 312. In the embodiment of the invention illustrated in the drawings, a separate layer 318 of, for example, a paper opaque to actinic light is provided as a backing layer for photosensitive layer 310. Backing layer 318 may be secured directly to said photosensitive layer but in the form shown is separate therefrom, being secured as by a suitable hinge 319 to the image-carrying layer. Image-carrying layer 312 may be similarly provided with an opaque backing layer but in the form shown is formed of or comprises as a stratum thereof an opaque material and is preferably substantially equal in area to backing layer 318, being thereby provided with an image-receiving area 320 substantially coextensive with layer 310 and marginal portions 322 surrounding said image-receiving area on at least three sides thereof. Marginal portions 322 may be provided with an adhesive for effecting a temporary bond with sheet 318 when the latter is superposed on said image-receiving layer or the container 300 may be made long enough to release part of its content over marginal portion 322 to obtain this same temporary bond. It will be apparent from the foregoing construction that layer 310 may be readily exposed by pivoting the same with respect to image-receiving layer 312 and thereafter photosensitive layer 310 may be superposed upon layer 312 by causing barrier layer 318 to be pivoted into contact with layer 312. This encloses the photosensitive layer 310 in an envelope opaque to light actinic to said layer and permits of the handling of said envelope in daylight prior to or during processing of said photosensitive layer. The entire unit may be advanced through a pair of pressure-applying rollers or wringer rollers with the hinge end 319 foremost, to release and cause the liquid in container 300 to spread in a substantially uniform layer between the surface of layer 310 and area 320 of layer 312.",
      ),
    ),
    p(
      text("A modification of the containing means 300 is shown in "),
      ref("Fig. 24", "#fig-24", "Figure 24 — Modified container means"),
      text(
        ". It comprises a tube 350 formed of a relatively brittle vapor and liquid-impervious material such, for example, as glass, said tube preferably having its ends hermetically sealed as by fusion. Tube 350 is enclosed in a suitable envelope 352 of a material such as a fabric which is readily permeable to the processing agent carried by said tube but which acts as a filter for retaining the fragments of the tube after the latter has been broken.",
      ),
    ),
    p(
      text(
        "The products of the present invention may be used in conjunction with, or may comprise as elements thereof, diazonium photosensitive layers. For example, a photosensitive product may be formed by having the physical structure of the photosensitive element 310 of ",
      ),
      ref("Fig. 23", "#fig-23", "Figure 23 — Another embodiment"),
      text(
        " with container 300 mounted thereon. The photosensitive layer of element 310 may have as its photosensitive substance a diazonium compound such as that sold by the Boston Blue Print Company under the trade name “Blackline #202,” and the liquid reagent in the container 300 then preferably comprises, by weight, 4 parts of medium viscosity sodium carboxymethyl cellulose, 100 parts of water and 8 parts of “Blackline” developer #203-A (sold by Boston Blue Print Company and manufactured by Frederick Post Company, Chicago).",
      ),
    ),
    p(
      text(
        "In the alternative the photosensitive layer of the photosensitive element 310 may be obtained by applying to one side of a suitable sheet material a sensitizing solution which consists of 20 grams of chlorostannate of para-diazo-di-N-butyl-aniline, 0.4 gram of Pontacyl Brilliant Blue 2R, and 1 liter of water. The liquid-developing reagent in the container 300 then preferably comprises, by weight, 4 parts of medium viscosity sodium carboxymethyl cellulose, 100 parts of water, 5.8 parts of sodium carbonate (monohydrate) and 2.3 parts of phloroglucinol.",
      ),
    ),
    p(
      text(
        "The diazonium photosensitive layer may also be obtained by dipping a sheet of paper in a solution of Du Pont Naphthanil Diazo Black B, and the developing solution in container 300 may comprise 1500 parts by weight of a 5% water solution of sodium carboxymethyl cellulose, 10 parts of resorcinol and 1 part of sodium hydroxide.",
      ),
    ),
    p(
      text(
        "It is also well known that certain ferric salts of organic acids, for example the oxalates, tartrates, and citrates, are reduced to ferrous salts when exposed to light. (L. P. Clerc, “Photography Theory and Practice,” second edition, published 1937 by Pitman Publishing Company, page 402, paragraph 621 et seq.; Crowley Patents Nos. 2,093,421, 2,113,423, 2,130,070, 2,130,071, 2,137,015.) A considerable number of photographic processes depend for their functioning on this photochemical phenomenon.",
      ),
    ),
    p(
      text(
        "It is known in connection with these iron salts that any reagent that will differentiate between ferric and ferrous salts can be used to develop the barely visible image formed by the photochemical reduction of the ferric salt into an image which is very easily visible. Examples of such developing reagents are potassium ferricyanide, potassium ferrocyanide, tannins, gallic acid, beta-naphthoquinone sulphonic acid, silver salts, platinum and palladium salts. It is believed to be now apparent to one skilled in the art that the photoresponsive ferrous salts may constitute the photosensitive material of the photosensitive layer 310, and the liquid in the container 300 may include or dissolve in its travel to the photosensitive layer any one of the aforementioned developing reagents for distinguishing between the ferric and ferrous salts and producing the easily visible image from the very light image that is originally obtained by the photoexposure of the iron salts.",
      ),
    ),
    p(
      text(
        "Broadly, the products of the present invention may comprise, or may be used with, any photographic, photosensitive material for the purpose of developing the same. It is to be understood that the invention is not limited to materials sensitive to visible radiation but includes photographic, photosensitive materials sensitive to such other radiation as X-ray, ultraviolet or infrared.",
      ),
    ),
    p(
      text("The term "),
      term(
        "photographic developing reagent",
        "A reagent that renders a visible photographic image more visible or renders an otherwise invisible photoexposure image visible, including the ferric-salt and silver-halide cases described here.",
      ),
      text(
        " as used herein is intended to include any reagent which acts to render a visible image more visible, as in the case of the ferric salts, or an invisible image visible, as in the case of the silver halide emulsions. The term ",
      ),
      term(
        "development",
        "Treatment of a photographic, photosensitive material that renders an image formed by photoexposure visible or more visible.",
      ),
      text(
        " is intended to cover the treatment of any photographic, photosensitive material for the purpose of rendering an image formed therein by photoexposure visible or more visible.",
      ),
    ),
    p(
      text("The term "),
      term(
        "exposed solarized silver halide",
        "Silver halide that has first undergone solarization and is subsequently exposed, for example in a camera.",
      ),
      text(
        " is to be understood to mean silver halide which, subsequent to solarization, is exposed, for example, in a camera, and by ",
      ),
      term(
        "nonexposed solarized silver halide",
        "Silver halide that has undergone solarization but is not exposed again after that solarization.",
      ),
      text(
        " is meant silver halide which is not exposed subsequent to solarization. Solarization may, of course, be carried out chemically or by subjecting the photosensitive layer to a predetermined uniform exposure to light.",
      ),
    ),
    p(
      text("The term "),
      term("dispersion", "In this specification, a dispersion includes a solution."),
      text(" as used herein is to be understood as covering a solution."),
    ),
    p(
      text(
        "This is in part a continuation of copending applications Serial No. 539,550, filed June 9, 1944, for Photographic Product, and Serial No. 578,379, filed February 17, 1945, for Photographic Product (both of which have been abandoned and replaced by the present application), Serial No. 594,892, filed May 21, 1945, for Photographic Product, Process and Apparatus, Serial No. 652,612, filed March 7, 1946, for Fluid Containers, Serial No. 657,367, filed March 27, 1946, for a Photographic Film Unit Having a Frangible Fluid Container Therein (now abandoned and replaced by application Serial No. 137,393, filed January 7, 1950, Serial No. 728,983, filed February 17, 1947, for Photographic Product and Composition, and Serial No. 729,578, filed February 19, 1947, for Photographic Process and Apparatus. Since certain changes may be made in the above product without departing from the scope of the invention herein involved, it is intended that all matter contained in the above description or shown in the accompanying drawings shall be interpreted as illustrative and not in a limiting sense. What is claimed is:",
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
          "A photographic product comprising at least two layers and including a photosensitive layer, a base layer for a transfer image, and a container holding at least a liquid solvent for a photographic developer, said photosensitive layer, said base layer and said container being attached together to permit at least a portion of said base layer and said photosensitive layer to be superposed with said container so positioned as to be capable of being ruptured and without removal of its ruptured portion of releasing its liquid content between two layers of said product to at least partially permeate the superposed base layer and photosensitive layer, said photosensitive layer comprising as a photosensitive material thereof a heavy metal salt capable of forming a latent image upon photoexposure and capable of development to produce a visible image comprising the metal of said salt, said salt being soluble in a photographic fixing solvent, said product having positioned therein photographic processing material, including a photographic developer, transportable by said liquid to said photosensitive layer, said material being capable of developing a latent image in the photosensitive layer and as a result of such development causing differential disposition throughout the photosensitive layer of a substance for providing said base layer with a transfer image.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 2,
      inlines: [
        text(
          "A photographic product comprising at least two layers and including a photosensitive layer, a base layer for a transfer image, and a container holding at least a liquid solvent for a photographic developer, said photosensitive layer, said base layer and said container being attached together to permit at least a portion of said base layer and said photosensitive layer to be superposed with said container so positioned as to be capable of being ruptured and without removal of its ruptured portion of releasing its liquid content between two layers of said product to at least partially permeate the superposed base layer and photosensitive layer, said photosensitive layer comprising as a photosensitive material thereof a heavy metal salt capable of forming a latent image upon photoexposure and capable of development to produce a visible image comprising the metal of said salt, said product having positioned therein photographic processing material, including a photographic developer, transportable by said liquid to said photosensitive layer, said material being contained at least in part in said liquid in said container and being capable of developing a latent image in the photosensitive layer and as a result of such development causing differential disposition throughout the photosensitive layer of a substance for providing said base layer with a transfer image.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 3,
      inlines: [
        text(
          "A photographic product comprising at least two layers and including a photosensitive silver halide emulsion layer, a base layer for a positive image, and a container holding at least a liquid solvent for a photographic developer, said photosensitive layer, said base layer and said container being attached together to permit at least a portion of said base layer and said photosensitive layer to be superposed with said container so positioned as to be capable of being ruptured and without removal of its ruptured portion of releasing its liquid content between two layers of said product to at least partially permeate the superposed base layer and photosensitive layer, said product having positioned therein photographic processing material, including a photographic developer, transportable by said liquid to said photosensitive layer, said material being capable of developing a latent image in said photosensitive layer, and as a result of such development causing differential disposition throughout the photosensitive layer of a substance for providing said base layer with a positive image by transfer.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 4,
      inlines: [
        text(
          "A photographic product comprising at least two layers and including a photosensitive silver halide emulsion layer, a base layer for a positive image, and a container holding at least a liquid solvent for a photographic developer, said photosensitive layer, said base layer and said container being attached together to permit at least a portion of said base layer and said photosensitive layer to be superposed with said container so positioned as to be capable of being ruptured and without removal of its ruptured portion of releasing its liquid content between two layers of said product to at least partially permeate the superposed base layer and photosensitive layer, said product having positioned therein photographic processing material, including a photographic developer, transportable by said liquid to said photosensitive layer, said material being contained at least in part in said liquid in said container and being capable of developing a latent image in said photosensitive layer and as a result of such development causing differential disposition throughout the photosensitive layer of a substance for providing said base layer with a positive image by transfer.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 5,
      inlines: [
        text(
          "A photographic product comprising at least two layers and including a photosensitive silver halide emulsion layer, a base layer for a positive image, and a container holding at least a liquid solvent for a photographic developer, said photosensitive layer, said base layer and said container being attached together to permit at least a portion of said base layer and said photosensitive layer to be superposed with said container so positioned as to be capable of being ruptured and without removal of its ruptured portion of releasing its liquid content between two layers of said product to at least partially permeate the superposed base layer and photosensitive layer, said product having positioned therein photographic processing material transportable by said liquid to said photosensitive layer, said material being contained at least in part in said liquid and comprising a developer for the silver halide emulsion and a substance for forming a soluble silver complex with silver halide, said material when transported to said photosensitive layer being capable of developing a latent image therein and of causing the formation of a soluble silver complex for providing said base layer with an image by transfer.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 6,
      inlines: [
        text(
          "A photographic product comprising at least two layers and including a photosensitive silver halide emulsion layer, a base layer for a positive image, and a container holding a liquid solution of a silver halide developer and a silver halide solvent, said photosensitive layer, said base layer and said container being attached together to permit at least a portion of said base layer and said photosensitive layer to be superposed with said container so positioned as to be capable of being ruptured and without removal of its ruptured portion of releasing its liquid content between two layers of said product to at least partially permeate the superposed base layer and photosensitive layer, said liquid solution when transported to said photosensitive layer being capable of developing a latent image in said photosensitive layer and of causing the formation of a soluble silver complex for providing said base layer with an image by transfer.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 7,
      inlines: [
        text(
          "A photographic product comprising at least two layers and including a photosensitive silver halide emulsion layer, a base layer for a positive image, and a container holding at least a liquid solvent for a photographic developer, said photosensitive layer, said base layer and said container being attached together to permit at least a portion of said base layer and said photosensitive layer to be superposed with said container so positioned as to be capable of being ruptured and without removal of its ruptured portion of releasing its liquid content between two layers of said product to at least partially permeate the superposed base layer and photosensitive layer, said product having positioned therein photographic processing material transportable by said liquid to said photosensitive layer, said material comprising hydroquinone and sodium thiosulfate and acting when transported to said photosensitive layer to develop a latent image therein and to form a soluble silver complex with the undeveloped silver halide, said complex being capable of providing said base layer with a positive image, by transfer, of the subject matter of said latent image.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 8,
      inlines: [
        text(
          "A photographic product comprising at least two layers and including a photosensitive layer, a base layer for a transfer image, and a container holding at least a liquid solvent for a photographic developer, said photosensitive layer, said base layer and said container being attached together to permit at least a portion of said base layer and said photosensitive layer to be superposed with said container so positioned as to be capable of being ruptured and without removal of its ruptured portion of releasing its liquid content between two layers of said product to at least partially permeate the superposed base layer and photosensitive layer, said photosensitive layer comprising as a photosensitive material thereof a heavy metal salt capable of forming a latent image upon photoexposure and capable of development to produce a visible image comprising the metal of said salt; said salt being soluble in a photographic fixing solvent, said product having positioned therein photographic processing material, including a photographic developer, transportable by said liquid to said photosensitive layer, said material being positioned at least in part in solid form outside said container in position to be dissolved by said liquid upon release of the latter, said material being capable of developing a latent image in said photosensitive layer and as a result of such development causing differential disposition throughout the photosensitive layer of a substance for providing said base layer with a transfer image.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 9,
      inlines: [
        text(
          "A photographic product comprising at least two layers and including a photosensitive silver halide emulsion layer, a base layer for a positive image, and a container holding at least a liquid solvent for a photographic developer, said photosensitive layer, said base layer and said container being attached together to permit at least a portion of said base layer and said photosensitive layer to be superposed with said container so positioned as to be capable of being ruptured and without removal of its ruptured portion of releasing its liquid content between two layers of said product to at least partially permeate the superposed base layer and photosensitive layer, said product having positioned therein photographic processing material transportable by said liquid to said photosensitive layer, said material being positioned at least in part in solid form outside said container and positioned to be dissolved by said liquid upon release of the latter, said material comprising a developer for the silver halide emulsion and a substance for forming a soluble silver complex with silver halide and when transported to said photosensitive layer being capable of developing a latent image therein and of causing the formation of a soluble silver complex for providing said base layer with an image by transfer.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 10,
      inlines: [
        text(
          "A photographic product comprising at least two layers and including a photosensitive layer, a base layer for a transfer image, and a container holding at least a liquid solvent for a photographic developer, said photosensitive layer, said base layer and said container being attached together to permit at least a portion of said base layer and said photosensitive layer to be superposed with said container so positioned as to be capable of being ruptured and without removal of its ruptured portion of releasing its liquid content between two layers of said product to at least partially permeate the superposed base layer and photosensitive layer, said photosensitive layer comprising as a photosensitive material thereof a heavy metal salt capable of forming a latent image upon photoexposure and capable of development to produce a visible image comprising the metal of said salt, said salt being soluble in a photographic fixing solvent, said product having positioned therein photographic processing material transportable by said liquid to said photosensitive layer, said material comprising a developer and a substance capable of reacting with the products of the development of said photosensitive layer to form a dye, said material when transported to said photosensitive layer being capable of developing a latent image therein and of providing said base layer, by transfer, with a dye image of the subject matter of said latent image.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 11,
      inlines: [
        text(
          "A photographic product comprising at least two layers and including a photosensitive silver halide emulsion layer, a base layer for a transfer image, and a container holding at least a liquid solvent for a photographic developer, said photosensitive layer, said base layer and said container being attached together to permit at least a portion of said base layer and said photosensitive layer to be superposed with said container so positioned as to be capable of being ruptured and without removal of its ruptured portion of releasing its liquid content between two layers of said product to at least partially permeate the superposed base layer and photosensitive layer, said product having positioned therein photographic processing material transportable by said liquid to said photosensitive layer, said material comprising a developer and a substance capable of reacting with the products of the development of said photosensitive layer to form a dye, said material when transported to said photosensitive layer being capable of developing a latent image therein and of providing said base layer, by transfer, with a dye image.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 12,
      inlines: [
        text(
          "A photographic product comprising at least two layers and including a photosensitive solarized silver halide emulsion layer, a base layer for a transfer image, and a container holding at least a liquid solvent for a photographic developer, said photosensitive layer, said base layer and said container being attached together to permit at least a portion of said base layer and said photosensitive layer to be superposed with said container so positioned as to be capable of being ruptured and without removal of its ruptured portion of releasing its liquid content between two layers of said product to at least partially permeate the superposed base layer and photosensitive layer, said product having positioned therein photographic processing material transportable by said liquid to said photosensitive layer, said material comprising a developer and a substance capable of reacting with the products of the development of said photosensitive layer to form a dye, said material being capable of developing a latent image in said photosensitive layer and of providing said base layer, by transfer, with a dye image.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 13,
      inlines: [
        text(
          "A photographic product comprising at least two layers and including a photosensitive layer, a base layer for a positive image, and a container holding at least a liquid solvent for a photographic developer, said photosensitive layer, said base layer and said container being attached together to permit at least a portion of said base layer and said photosensitive layer to be superposed with said container so positioned as to be capable of being ruptured and without removal of its ruptured portion of releasing its liquid content between two layers of said product to at least partially permeate the superposed base layer and photosensitive layer, said photosensitive layer comprising as a photosensitive material thereof a heavy metal salt capable of forming a latent image upon photoexposure and capable of development to produce a visible image comprising the metal of said salt, said salt being soluble in a photographic fixing solvent, said product having positioned therein photographic processing material, including a photographic developer, transportable by said liquid to said photosensitive layer, said material being capable of developing a latent image in said photosensitive layer and as a result of such development causing differential disposition throughout the photosensitive layer of a substance for providing said base layer with a positive image by transfer, said base layer and said photosensitive layer being so attached together in said product as to be readily strippable after the formation of said positive image.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 14,
      inlines: [
        text(
          "A photographic product comprising a sheetlike lamination including a photosensitive silver halide emulsion layer, a base layer for a transfer image, and a container holding at least a liquid solvent for a photographic developer, said layers and said container being attached together in superposed relation, portions of said container being located between the outer strata of said sheetlike lamination and being separable upon application of mechanical stress to said lamination, the contents of said container being releasable through said separated portions between said outer strata of said sheetlike lamination to a predetermined portion of said superposed layers, said product having positioned therein photographic processing material, including a photographic developer, transportable by said liquid to said photosensitive layer, said material being capable of developing a latent image in said photosensitive layer and as a result of such development causing differential disposition throughout the photosensitive layer of a substance for providing said base layer with a transfer image.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 15,
      inlines: [
        text(
          "A photographic product comprising a sheetlike lamination including a photosensitive silver halide emulsion layer, a base layer for a positive image, and a container holding at least a liquid solvent for a photographic developer, said layers and said container being attached together in superposed relation, portions of said container being located between the outer strata of said sheetlike lamination and being separable upon application of mechanical stress to said lamination, the contents of said container being releasable through said separated portions between said outer strata of said sheetlike lamination to a predetermined portion of said superposed layers, said product having positioned therein photographic processing material, including a photographic developer, transportable by said liquid to said photosensitive layer, said material being contained at least in part in said liquid in said container and being capable of developing a latent image in said photosensitive layer and as a result of such development causing differential disposition throughout the photosensitive layer of a substance for providing said base layer with a positive image by transfer.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 16,
      inlines: [
        text(
          "A photographic product comprising a sheetlike lamination including a photosensitive silver halide emulsion layer, a base layer for a positive image, and a container holding at least a liquid solvent for a photographic developer, said layers and said container being attached together in superposed relation, portions of said container being located between the outer strata of said sheetlike lamination and being separable upon application of mechanical stress to said lamination, the contents of said container being releasable through said separated portions between said outer strata of said sheetlike lamination to a predetermined portion of said superposed layers, said product having positioned therein photographic processing material transportable by said liquid to said photosensitive layer, said material comprising a developer for the silver halide emulsion and a substance for forming a soluble silver complex with silver halide.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 17,
      inlines: [
        text(
          "A photographic product comprising, in combination, a solarized silver halide emulsion layer, a base layer for a positive image, and a container holding at least a liquid solvent for a photographic developer, said container and said layers being attached together, said container being located to release the contents thereof upon application of suitable mechanical stress thereto to superposed portions of said layers, said product having positioned therewithin photographic processing material transportable at least in part by said liquid to said superposed portions, said material being capable of developing a latent image in said emulsion layer and of providing said base layer with a dye image by transfer, said material comprising a developer and a substance adapted to react with the oxidation product of said developer to form a dye.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 18,
      inlines: [
        text(
          "A photographic product comprising, in combination, a solarized silver halide emulsion layer, a base layer for a positive image, and a container holding at least a liquid solvent for a photographic developer, said container and said layers being attached together, said container being located to release the contents thereof upon application of suitable mechanical stress thereto to superposed portions of said layers, said product having positioned therewithin photographic processing material, transportable at least in part by said liquid to said superposed portions, said material being capable of developing a latent image in said emulsion layer and of providing said base layer, by transfer, with a dye image of said latent image, said material comprising a developer whose oxidation product couples with itself to form a dye.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 19,
      inlines: [
        text(
          "A photographic product comprising, in combination, a solarized silver halide emulsion layer, a base layer for a positive image, and a container holding at least a liquid solvent for a photographic developer, said container and said layers being attached together, said container being located to release the contents thereof upon application of suitable mechanical stress thereto to superposed portions of said layers, said product having positioned therewithin photographic processing material transportable at least in part by said liquid to said superposed portions, said material being capable of developing a latent image in said emulsion layer and of providing said base layer with a positive dye image of the subject matter of said latent image, said material comprising a developer and a substance adapted to react with the oxidation product of said developer to form a dye, said developer being contained in said liquid in said container.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 20,
      inlines: [
        text(
          "A photographic product comprising a photosensitive material which includes a supporting layer and a silver halide emulsion layer mounted on said supporting layer, a base layer for receiving, by transfer, a positive image, and a rupturable container holding at least a liquid solvent for a photographic developer, said container and said layers being attached together so that said container is capable upon rupture of releasing at least part of its contents to permeate superposed portions of said photosensitive layer and said base layer, said product containing therewithin material including a photographic developer adapted to be transported by the released liquid to said superposed portions, said last-named material being capable of developing a latent image in said silver halide emulsion layer and of causing as a result of such development the differential disposition throughout the emulsion layer of a substance for providing said base layer with a transfer image.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 21,
      inlines: [
        text(
          "A photographic product comprising a photosensitive material which includes a supporting layer and a silver halide emulsion layer mounted on said supporting layer, a base layer for receiving, by transfer, a positive image, and a rupturable container holding a solution of a developer and a silver halide solvent, said container and said layers being attached together so that said container is capable upon rupture of releasing at least part of its contents to permeate superposed portions of said photosensitive layer and said base layer, said solution being capable of developing a latent image in said silver halide emulsion layer and of causing as a result of such development the differential disposition throughout the emulsion layer of a substance capable of providing said base layer with a transfer image.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 22,
      inlines: [
        text(
          "A photographic product comprising a photosensitive silver halide emulsion layer, a base layer for a positive image, and containing means holding at least a liquid solvent for a photographic developer, said photosensitive layer, said base layer and said containing means being attached together so that said photosensitive layer and said base layer may be superposed and so that one liquid-containing portion of said containing means may be located adjacent one area of said photosensitive layer and another liquid-containing portion of said containing means may be located adjacent another area of said photosensitive layer laterally spaced with respect to said first area, each of said liquid-containing portions being capable upon rupture of releasing the liquid content thereof to at least partially permeate the area of the photosensitive layer adjacent thereto, the liquid-containing portions being individually rupturable so that a segment along the length of the composite film structure may be processed without processing an adjacent segment, said product having positioned therein photographic processing material, including a photographic developer, transportable by the liquid of each of said liquid-containing portions to its said adjacent area of said photosensitive layer, said material being capable of developing a latent image in said area of said photosensitive layer and of providing the portion of said base layer superposed with respect to said area with a transfer image.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 23,
      inlines: [
        text(
          "A photographic product comprising a photosensitive silver halide emulsion layer, a base layer for a positive image, and containing means holding at least a liquid solvent for a photographic developer, said photosensitive layer, said base layer and said containing means being attached together so that said photosensitive layer and said base layer may be superposed and so that one liquid-containing portion of said containing means may be located adjacent one area of said photosensitive layer and another liquid-containing portion of said containing means may be located adjacent another area of said photosensitive layer laterally spaced with respect to said first area, each of said liquid-containing portions being capable upon rupture of releasing the liquid content thereof to at least partially permeate the area of the photosensitive layer adjacent thereto, the liquid-containing portions being individually rupturable so that a segment along the length of the composite film structure may be processed without processing an adjacent segment, said product having positioned therein photographic processing material transportable by the liquid of each of said liquid-containing portions to its said adjacent area of said photosensitive layer, said material being contained at least in part in said liquid-containing means and comprising a developing agent and a substance capable of forming a soluble complex with silver halide, said material when transported to said photosensitive layer being capable of developing a latent image therein and of causing the formation of a soluble silver complex for providing said base layer with a positive image by transfer.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 24,
      inlines: [
        text(
          "A photographic product comprising a photosensitive silver halide layer, a water-absorptive, strippable base layer, and a rupturable container holding at least a liquid solvent for a photographic developer, said product having positioned therewithin a photographic developer for silver halide soluble in said solvent and rendered effective upon release of said liquid after rupture of the container to develop said photosensitive layer, said layers and said container being attached together so as to permit said layers to be superposed to form at least a part of a multilayer unit wherein said liquid is held by said container so as not to wet the photosensitive and base layers and wherein said container is positioned for releasing its liquid content between the outer surfaces of said unit.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 25,
      inlines: [
        text(
          "A photographic product comprising a photosensitive silver halide layer, a base layer, and a rupturable container holding a liquid solution of a silver halide developer, said layers and said container being attached together so as to permit said layers to be superposed with said liquid held by said container so as not to wet said layers and with said container positioned for releasing said liquid between said layers.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 26,
      inlines: [
        text(
          "A photographic product comprising a photosensitive layer having as a photosensitive material thereof a heavy metal salt capable of forming a latent image upon photoexposure and capable of development to produce a visible image comprising the metal of said salt, said salt being soluble in a photographic fixing solvent, a water-absorptive, strippable base layer, and a rupturable container holding a liquid solvent for a photographic developer, said product having positioned therewithin a photographic developer for said salt soluble in said solvent and rendered effective upon release of said liquid after rupture of the container to develop said photosensitive layer, said layers and said container being attached together so as to permit said layers to be superposed to form at least a part of a multilayer unit wherein said liquid is held by said container so as not to wet the photosensitive and base layers and wherein said container is positioned for releasing its liquid content between the outer surfaces of said unit.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 27,
      inlines: [
        text(
          "A photographic product comprising a liquid-confining layer including at least a photosensitive silver halide portion, another liquid-confining layer, and a rupturable container holding a liquid, said layers and said container being attached together so as to permit said layers to be superposed with said liquid held by said container so as not to wet said layers and with said container positioned for releasing said liquid between said layers, said product containing a soluble silver halide developer, said developer being in an amount sufficient to develop an image in said photosensitive silver halide portion and being rendered effective to develop said photosensitive silver halide portions upon release of said liquid.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 28,
      inlines: [
        text(
          "A photographic product comprising a liquid-confining layer including at least a photosensitive portion, said photosensitive portion comprising as a photosensitive material thereof a heavy metal salt capable of forming a latent image upon photoexposure and capable of development to produce a visible image comprising the metal of said salt, said salt being soluble in a photographic fixing solvent, another liquid-confining layer, and a rupturable container holding a liquid, said layers and said container being attached together so as to permit said layers to be superposed with said liquid held by said container so as not to wet said layers and with said container positioned for releasing said liquid between said layers, said product containing a developer, said developer being in an amount sufficient to develop an image in said photosensitive portion and being rendered effective to permeate said photosensitive silver halide portion upon release of said liquid.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 29,
      inlines: [
        text(
          "The product of claim 1 in which the container is sheetlike and in its liquid-releasing position is superposed with respect to said photosensitive layer for releasing its liquid depthwise thereof in the direction of said photosensitive layer.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 30,
      inlines: [
        text(
          "The product of claim 1 in which the container is elongated and rupturable and in liquid-releasing position is located so that its liquid is spreadable between portions of said layers to one side of the container.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 31,
      inlines: [
        text(
          "The product of claim 1 in which the container is sac-like and has a rupturable seal adjacent one edge thereof and in which the container, in liquid-releasing position, is located to one side of and with said seal adjacent to the portions of the layers between which the liquid is to be released.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 32,
      inlines: [
        text(
          "The product of claim 6 in which the container is sheetlike and in its liquid-releasing position is superposed with respect to said photosensitive layer for releasing its liquid depthwise to permeate an area of said photosensitive layer coextensive therewith.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 33,
      inlines: [
        text(
          "The product of claim 6 in which the container is elongated and rupturable and in liquid-releasing position is located so that its liquid content is spreadable between portions of said layers to one side of the container.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 34,
      inlines: [
        text(
          "The product of claim 6 in which the container is sac-like and has a rupturable seal adjacent one edge thereof and in which the container, in liquid-releasing position, is located to one side of and with said seal adjacent to the portions of the layers between which the liquid is to be released and the liquid contains a film-forming plastic in solution to increase its viscosity and facilitate the uniform spreading thereof.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 35,
      inlines: [
        text(
          "The product of claim 25 in which said container is sheetlike and in liquid-releasing position is superposed on the photosensitive layer for releasing the liquid depthwise thereof in the direction of said photosensitive layer.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 36,
      inlines: [
        text(
          "The product of claim 25 in which the container is elongated and rupturable and in liquid-releasing position is so located as to release its liquid to one side of the container for spreading between portions of said layers.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 37,
      inlines: [
        text(
          "The product of claim 25 in which the container is sac-like, elongated and collapsible and is provided with a rupturable seal adjacent one long edge thereof and in which the container, in liquid-releasing position, is so located as to release its liquid between portions of said layers spaced to one side of the container.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 38,
      inlines: [
        text(
          "The product of claim 37 in which the liquid in the container includes a thickening agent for appreciably increasing its viscosity to facilitate the spreading of the liquid between said layers.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 39,
      inlines: [
        text(
          "The product of claim 38 in which the thickening agent is a plastic and forms a solid plastic film between said layers when spread.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 40,
      inlines: [
        text(
          "The product of claim 25 in which the container is sac-like and the liquid in said container has a silver halide solvent, an alkali and a film-forming plastic dissolved therein.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 41,
      inlines: [
        text(
          "A photographic product containing material, including a photographic reagent, for producing a transformation of an image in said product, said reagent being present in an amount sufficient to effect said transformation, said product comprising a liquid-confining layer including at least a photosensitive portion capable of having an image formed therein upon photoexposure, another liquid-confining layer, and a rupturable containing means holding a liquid, said photosensitive portion having as its photosensitive material a salt from the class consisting of (a) the photosensitive ferric salts, (b) the photosensitive diazonium salts, and (c) heavy metal salts capable of forming a latent image upon photoexposure and capable of development to produce a visible image comprising the metal of said salt, said liquid being present in an amount sufficient for transforming said image in said photosensitive portion, said liquid, upon permeation of said photosensitive portion, rendering said transforming material effective to transform said image, said layers and said containing means being attached together to permit said layers to be superposed with said liquid held by said containing means so as not to wet said layers and with said containing means being positioned for releasing said liquid between said layers.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 42,
      inlines: [
        text(
          "The product of claim 4 in which the containing means is a sheet container which in liquid-releasing position is placed coextensively over the exposed photosensitive portion, releasing its liquid depthwise to permeate said exposed photosensitive portion.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 43,
      inlines: [
        text(
          "The product of claim 42, the sheet container of which is separated into a plurality of liquid-confining cells and in which said other liquid-confining layer is integral with a wall of said sheet container.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 44,
      inlines: [
        text(
          "The product of claim 41 in which the liquid-confining layers are attached together adjacent their ends with a hinge.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 45,
      inlines: [
        text(
          "The product of claim 41 in which each of said layers is opaque so that when said layers are superposed they provide a barrier which prevents visible light actinic to said photosensitive portion from reaching said photosensitive portion.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 46,
      inlines: [
        text(
          "The product of claim 41 in which the reagent is a developer for said photosensitive portion.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 47,
      inlines: [
        text(
          "The product of claim 41 in which the photosensitive portion is a silver halide emulsion and the transforming material includes a silver halide developer, said material being capable of providing said other liquid-confining layer with a transfer image.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 48,
      inlines: [
        text(
          "The product of claim 41 in which the photosensitive portion is a silver halide emulsion and the transforming material includes a silver halide developer, said material being capable of providing said other liquid-confining layer with a dye transfer image.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 49,
      inlines: [
        text(
          "The product of claim 41 in which the photosensitive portion is a silver halide emulsion and the transforming material includes a silver halide developer, said material being capable of providing said other liquid-confining layer with a transfer image comprising silver.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 50,
      inlines: [
        text(
          "A photographic product containing material, including a photographic reagent, for producing a transformation of an image in said product, said reagent being present in an amount sufficient to effect said transformation, said product comprising a liquid-confining layer including at least a photographic, photosensitive portion capable of having an image formed therein upon photoexposure, another liquid-confining layer, and a rupturable container holding a liquid, said liquid being in an amount sufficient for transforming said image in said photosensitive portion, said liquid, upon permeation of said photosensitive portion, rendering said transforming material effective to transform said image, said photosensitive portion having as its photosensitive material a salt from the class consisting of (a) the photosensitive ferric salts, (b) the photosensitive diazonium salts, and (c) heavy metal salts capable of forming a latent image upon photoexposure and capable of development to produce a visible image comprising the metal of said salt, said layers and said container being attached together so as to permit said layers to be superposed with said liquid held by said container so as not to wet said layers and with said container positioned for releasing said liquid between said layers, said container being a pod and having a rupturable seal adjacent one edge thereof and, in liquid-releasing position, being laterally disposed to one side of the portions of the layers between which the liquid thereof is to be released with said seal interposed between the layers.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 51,
      inlines: [
        text(
          "The product of claim 50 in which the liquid includes a thickening agent in sufficient quantity to facilitate the uniform spreading of the liquid between the layers and the reagent is a developer.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 52,
      inlines: [
        text(
          "The product of claim 51 in which the thickening agent is a plastic so that a film of said plastic is the residue of said liquid when the latter is spread and permitted to dry.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 53,
      inlines: [
        text(
          "The product of claim 52 in which the developer is contained in the liquid in the container.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 54,
      inlines: [
        text(
          "The product of claim 50 in which the photosensitive portion is a silver halide emulsion, the other liquid-confining layer is paper, and the liquid in the container includes a developing agent for silver halide and sodium carboxymethyl cellulose.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 55,
      inlines: [
        text(
          "The product of claim 54 in which the liquid in the container also includes a silver halide solvent and an alkali.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 56,
      inlines: [
        text(
          "The product of claim 50 in which the container walls are deformable and are impervious to oxygen and to the vapor of said liquid.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 57,
      inlines: [
        text(
          "A photographic product containing material, including a photographic reagent, for producing a transformation of an image in said product, said reagent being present in an amount sufficient to effect said transformation, said product comprising a photographic photosensitive element including at least a photosensitive portion capable of having an image formed therein upon photoexposure and another element containing a liquid, said photosensitive portion having as its photosensitive material a salt from the class consisting of (a) the photosensitive ferric salts, (b) the photosensitive diazonium salts, and (c) heavy metal salts capable of forming a latent image upon photoexposure and capable of development to produce a visible image comprising the metal of said salt, said liquid-containing element being attached to and so superposed on said photosensitive element as to be capable of releasing its liquid depthwise to permeate said photosensitive portion of the photosensitive element, said liquid-containing element comprising at least three strata including a liquid-containing stratum and a pair of liquid-confining strata formed of material impervious to said liquid and superposed on opposite sides of said liquid-containing stratum to confine the liquid in the latter, one of said liquid-confining strata being interposed between said liquid-containing stratum and said photosensitive element and being more rupturable than the remainder of said strata and, when ruptured permitting the liquid of the liquid-containing stratum to be released to permeate said photosensitive element, the liquid in the liquid-containing stratum being in an amount sufficient for transforming said image in said photosensitive element and, upon permeation of said photosensitive element, rendering said transforming material effective to transform said image in said photosensitive portion.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 58,
      inlines: [
        text(
          "The product of claim 57 in which the photosensitive portion has as its photosensitive material a heavy metal salt capable of forming a latent image upon photoexposure and capable of development to produce a visible image comprising the metal of said salt, said salt being soluble in a photographic fixing solvent.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 59,
      inlines: [
        text(
          "The product of claim 57 in which the photosensitive portion is a silver halide emulsion.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 60,
      inlines: [
        text(
          "The product of claim 57 in which the photographic reagent is contained in the liquid in the liquid-containing stratum.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 61,
      inlines: [
        text(
          "The product of claim 57 in which said liquid-containing stratum is a porous sheet and contains a liquid in the pores thereof.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 62,
      inlines: [
        text(
          "The product of claim 57 in which said liquid-containing stratum comprises a plurality of recesses for receiving the liquid, each recess being closed on one side by the more rupturable liquid-confining stratum and being separated from every other recess by a liquid-impermeable cell wall.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 63,
      inlines: [
        text(
          "The product of claim 57 which comprises a distributing layer in addition to said other strata, said distributing layer being permeable to the liquid in the liquid-containing element and interposed between the more rupturable liquid-confining stratum of the latter element and the photosensitive element, said layer acting as a distributing layer to uniformly distribute the liquid passing to the photosensitive element upon the rupture of said more rupturable stratum.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 64,
      inlines: [
        text(
          "The product of claim 63 in which at least part of the photographic reagent is contained in solid form in said permeable layer for dissolution by the liquid in its travel to the photosensitive portion.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 65,
      inlines: [
        text(
          "The product of claim 57 in which the photosensitive portion is a solarized silver halide emulsion.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 66,
      inlines: [
        text(
          "A photographic product comprising a rupturable container holding a liquid, said liquid having dispersed therein a thickening agent, and a sheet support upon one portion of which said container is mounted, another portion of said sheet support providing a spreading surface having a liquid-receiving area adjacent said container onto which said liquid is spreadable directly from said container, said liquid-receiving area being one of the outer surfaces of said product so that liquid spread thereon is capable of contacting a photosensitive element superposed on said product, the liquid in the container being sufficient in amount to cover said liquid-receiving area and to provide thereon a continuous film of said liquid, said product containing a reducing agent for developing the exposed portion of a photographic element having as its photosensitive material a heavy metal salt capable of forming a latent image upon photoexposure and capable of being developed by said reducing agent to produce a visible image comprising the metal of said salt, said reducing agent being in an amount sufficient to develop an image in an area of said photosensitive element equivalent to said liquid-receiving area, the container contents, when spread on said liquid-receiving area, placing said reducing agent in condition to effect the development.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 67,
      inlines: [
        text(
          "The product of claim 66 in which said reducing agent is contained in the liquid in the container.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 68,
      inlines: [
        text(
          "The product of claim 66 in which the thickening agent is an organic film-forming colloid dissolved in the liquid so that a film of said colloid is the residue of said liquid when the latter is spread and permitted to dry.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 69,
      inlines: [
        text(
          "The product of claim 68 in which the liquid includes water and in which the film-forming colloid is a plastic.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 70,
      inlines: [
        text(
          "The product of claim 66 in which the thickening agent is present in sufficient quantity to give said liquid a viscosity in excess of one thousand centipoises at 24° C.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 71,
      inlines: [
        text(
          "The product of claim 66 in which the reducing agent is dissolved in the liquid in the container and is a silver halide developer.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 72,
      inlines: [
        text(
          "A photographic product comprising a rupturable container holding a liquid, said liquid having dispersed therein a thickening agent, and a sheet support upon one portion of which said container is mounted, another portion of said sheet support providing a spreading surface having a liquid-receiving area adjacent said container onto which said liquid is spreadable directly from said container, said liquid-receiving area being one of the outer surfaces of said product so that liquid spread thereon is capable of contacting a photosensitive element superposed on said product, the liquid in the container being sufficient in amount to cover said liquid-receiving area and to provide thereon a continuous film of said liquid, said product containing at least one photographic processing agent from the class consisting of the silver halide developers and the silver halide fixers, said processing agent being in an amount sufficient to process an image in an area of a photosensitive, silver halide element equivalent to said liquid-receiving area, the container contents, when spread on said liquid-receiving area, placing said processing agent in condition to effect the processing of said element.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 73,
      inlines: [
        text(
          "The product of claim 66 in which the photographic processing agent is dissolved in the liquid in the container and is a silver halide fixer.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 74,
      inlines: [
        text(
          "A photographic product comprising a rupturable container holding a liquid, said liquid having dispersed therein a thickening agent, a silver halide developer and a silver halide solvent and having a viscosity in excess of 1,000 centipoises at 24° C., and a sheet support upon one portion of which said container is mounted, another portion of said sheet support providing a spreading surface having a liquid-receiving area adjacent said container onto which said liquid is spreadable directly from said container, said liquid-receiving area being greater than the area covered by said container and being one of the outer surfaces of said product so that liquid spread thereon is capable of contacting a photosensitive element superposed on said product, the liquid in the container being sufficient in amount to cover said liquid-receiving area and provide thereon a continuous film of said liquid, the container contents, when spread on said liquid-receiving area, placing the reagents therein in condition to form a transfer print of a latent image in an area of a photographic silver halide emulsion equivalent to said liquid-receiving area.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 75,
      inlines: [
        text(
          "A photographic product comprising a plurality of rupturable containers, each container holding a liquid having dispersed therein a thickening agent, and a sheet support upon which said containers are mounted, said containers being spaced lengthwise of said support, the side of said sheet support, upon which said containers are mounted, having a plurality of liquid-receiving areas, one of said areas being adjacent each of said containers, the liquid in each container being sufficient in amount to cover the liquid-receiving area adjacent thereto and to provide thereon a continuous film of said liquid, said product containing a reducing agent for developing the exposed portion of a photosensitive element having as its photosensitive material a heavy metal salt capable of forming a latent image upon photoexposure and capable of being developed by said reducing agent to produce a visible image comprising the metal of said salt, each container and the portion of said sheet support within the receiving area associated therewith containing said reagent in an amount sufficient to transform an image in an area of a photosensitive, photographic element equivalent to said liquid-receiving area, the container contents, when spread on said liquid-receiving area, placing said reducing agent in condition to effect the development.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 76,
      inlines: [
        text(
          "The product of claim 75 in which the containers are elongated and have their long axes substantially parallel to one another and extending transversely of the sheet support.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 77,
      inlines: [
        text(
          "The product of claim 75 which contains a silver halide developer as the reducing agent and also material capable of cooperating with said developer to provide the sheet support with a transfer image when the contents of each container are spread between said support and a silver halide element.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 78,
      inlines: [
        text(
          "A photographic product comprising a plurality of rupturable containers, each container holding a liquid having dispersed therein a thickening agent, and a sheet support upon which said containers are mounted, said containers being spaced lengthwise of said support, the side of said sheet support, upon which said containers are mounted, having a plurality of liquid-receiving areas, one of said areas being adjacent each of said containers, the liquid in each container being sufficient in amount to cover the liquid-receiving area adjacent thereto and to provide thereon a continuous film of said liquid, said product containing at least one photographic processing agent from the class consisting of the silver halide developers and the silver halide fixers, each container and the portion of said sheet support within the liquid-receiving area associated therewith containing said processing agent in an amount sufficient to process an image in an area of a photosensitive, silver halide element equivalent to said liquid-receiving area, the container contents, when spread on said liquid-receiving area, placing said processing agent in condition to effect the processing of said element.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 79,
      inlines: [
        text(
          "A photographic product comprising a rupturable container holding a liquid, said liquid having dispersed therein a thickening agent, and a sheet support upon which said container is mounted, said sheet support providing a spreading surface having a liquid-receiving area adjacent said container onto which said liquid is spreadable directly from said container, the liquid in the container being sufficient in amount to cover said liquid-receiving area and to provide thereon a continuous film of said liquid, said sheet support comprising a photographically photosensitive layer which is at least in part coextensive with said liquid-receiving area, said photosensitive layer having as its photosensitive material a salt from the class consisting of (a) the photosensitive ferric salts, (b) the photosensitive diazonium salts, and (c) heavy metal salts capable of forming a latent image upon photoexposure and capable of development to produce a visible image comprising the metal of said salt, said product containing an image-transforming reagent in an amount sufficient to transform an image in the portion of the photosensitive layer within said liquid-receiving area, the container contents when spread on said liquid-receiving area placing said reagent in condition to effect the image transformation.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 80,
      inlines: [
        text(
          "The product of claim 79 in which the image-transforming reagent is a developer for said photosensitive layer.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 81,
      inlines: [
        text(
          "The product of claim 79 in which the photosensitive layer is a silver halide emulsion.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 82,
      inlines: [
        text(
          "The product of claim 79 in which the photosensitive layer is a silver halide emulsion and the image-transforming reagent is a processing agent from the class consisting of the silver halide developers and the silver halide fixers.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 83,
      inlines: [
        text(
          "A photographic product comprising a rupturable container holding a liquid, said liquid having dispersed therein a thickening agent, and a sheet support upon which said container is mounted, said sheet support providing a spreading surface having a liquid-receiving area adjacent said container onto which said liquid is spreadable directly from said container, said liquid-receiving area being greater than the area covered by said container, the liquid in the container being sufficient in amount to cover said liquid-receiving area and to provide thereon a continuous film of said liquid, said sheet support comprising a silver halide emulsion layer which is at least in part coextensive with said liquid-receiving area, said product containing a silver halide developer in an amount sufficient to develop a latent image in the portion of the silver halide emulsion layer within said liquid-receiving area, the container contents, when spread on said liquid-receiving area, placing said developer in condition to develop a latent image in said emulsion layer.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 84,
      inlines: [
        text(
          "A product containing a reducing agent for developing the exposed portion of a photosensitive element having as its photosensitive material a heavy metal salt capable of forming a latent image upon photoexposure and capable of being developed by said reducing agent to produce a visible image comprising the metal of said salt, said product comprising a sheet support and an elongated container holding a liquid dispersion of a film-forming colloid, said container being mounted on said sheet support, longitudinally extending portions of said container being uniformly more rupturable than other portions of the container and providing upon rupture a liquid-dispensing passage extending along a substantial length of the container, the container walls being at least in part deformable and flexible for transmitting to the container contents externally applied pressure of sufficient magnitude to rupture said more rupturable portions, said sheet support providing a spreading surface extending substantially perpendicularly from the long dimension of said container and at least as wide as the length of said rupturable liquid-dispensing portion of the container onto which surface said container contents are spreadable from said liquid-dispensing portion, said liquid dispersion being sufficient in amount to be spread on an area of said surface substantially greater than the container area and to provide said first-named area with a film of said colloid, the spreading of the container contents placing said reducing agent in condition for developing a corresponding area of one said photosensitive element.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 85,
      inlines: [
        text(
          "The product of claim 84 wherein the dispersion of the colloid in the container is a solution and the reducing agent is in the container.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 86,
      inlines: [
        text(
          "A product containing at least one photographic processing agent from the class consisting of the silver halide developers and the silver halide fixers, said product comprising a sheet support and an elongated container holding a liquid dispersion of a film-forming colloid, said container being mounted on said sheet support, longitudinally extending portions of said container being uniformly more rupturable than other portions of the container and providing upon rupture a liquid-dispensing passage extending along a substantial length of the container, the container walls being at least in part deformable and flexible for transmitting to the container contents externally applied pressure of sufficient magnitude to rupture said more rupturable portions, said sheet support providing a spreading surface extending substantially perpendicularly from the long dimension of said container and at least as wide as the length of said rupturable liquid-dispensing portion of the container onto which surface said container contents are spreadable from said liquid-dispensing portion, said liquid dispersion being sufficient in amount to be spread on an area of said surface substantially greater than the container area and to provide said first-named area with a film of said colloid, the spreading of the container contents placing said processing agent in condition for processing a corresponding area of a photosensitive, silver halide element.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 87,
      inlines: [
        text(
          "A product containing a silver halide developer and capable of developing a photosensitive silver halide element, said product comprising an elongated rupturable container holding an aqueous dispersion of an organic film-forming colloid, and a sheet support upon which said container is mounted, portions of the container walls being secured together in face-to-face relation to provide a liquid-dispensing lip extending substantially the length of the container, the material of the container walls being stronger than the seal of the dispensing lip and said walls being at least in part deformable and flexible for transmitting to the container contents externally applied pressure of sufficient magnitude to open said lip, said sheet support providing a spreading surface extending substantially perpendicularly from the dispensing lip and at least as wide as the length of said lip onto which said container contents are spreadable from said dispensing lip, said aqueous dispersion being sufficient in amount to be spread over an area of said surface substantially greater than the container area and to provide said area with a solid film of said organic colloid, the silver halide developer in said product being rendered effective in said area upon the spreading of said dispersion.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 88,
      inlines: [
        text(
          "A product containing a silver halide developer and capable of developing a photosensitive silver halide element, said product comprising a flat, multi-sided container holding an aqueous dispersion of an organic film-forming colloid, and a sheet support upon which said container is mounted, portions of the container walls being secured together in face-to-face relation to provide a liquid-dispensing lip extending substantially the length of one of said sides of the container, the material of the container walls being stronger than the seal of the dispensing lip and said walls being at least in part deformable and flexible for transmitting to the container contents externally applied pressure of sufficient magnitude to open said lip, said sheet support providing a spreading surface extending substantially perpendicularly from the dispensing lip and at least as wide as the length of said lip onto which said container contents are spreadable from said dispensing lip, said aqueous dispersion being sufficient in amount to be spread over an area of said surface substantially greater than the container area and to provide said area with a solid film of said organic colloid, the silver halide developer in said product being rendered effective in said area upon the spreading of said dispersion.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 89,
      inlines: [
        text(
          "A product containing a silver halide developer and capable of developing a photosensitive silver halide element, said product comprising a flat, multi-sided rupturable container holding a liquid dispersion of a film-forming colloid, and a sheet support upon which said container is mounted, portions of the container walls being secured together in face-to-face relation to provide a liquid-dispensing lip extending substantially the length of one of said sides of the container, the material of the container walls being stronger than the seal of the dispensing lip and said walls being at least in part deformable and flexible for transmitting to the container contents externally applied pressure of sufficient magnitude to open said lip, said sheet support providing a spreading surface extending substantially perpendicularly from the dispensing lip and at least as wide as the length of said lip onto which said container contents are spreadable from said dispensing lip, said liquid dispersion being sufficient in amount to be spread over an area of said surface substantially greater than the container area and to provide said area with a solid film of said organic colloid, the silver halide developer in said product being rendered effective in said area upon the spreading of said dispersion.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 90,
      inlines: [
        text(
          "A product containing a reducing agent for developing the exposed portion of a photosensitive element having as its photosensitive material a heavy metal salt capable of forming a latent image upon photoexposure and capable of being developed by said reducing agent to produce a visible image comprising the metal of said salt, said product comprising an elongated rupturable container holding a liquid dispersion of a film-forming colloid, and a sheet support upon which said container is mounted, portions of the container walls being secured together in face-to-face relation to provide a liquid-dispensing lip extending substantially the length of the container, the material of the container walls being stronger than the seal of the dispensing lip and said walls being at least in part deformable and flexible for transmitting to the container contents externally applied pressure of sufficient magnitude to open said lip, said sheet support providing a spreading surface extending substantially perpendicularly from the dispensing lip and at least as wide as the length of said lip onto which said container contents are spreadable from said dispensing lip, said liquid dispersion being sufficient in amount to be spread over an area of said surface substantially greater than the container area and to provide said first-named area with a solid film of said colloid, the spreading of the container contents placing said reducing agent in condition for developing a corresponding area of one said photosensitive element.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 91,
      inlines: [
        text(
          "The product of claim 88 which comprises a photosensitive silver halide layer, at least a portion of said photosensitive layer being coextensive with the liquid-receiving area of the spreading surface, the spreading of the container contents rendering the developer effective to develop at least said portion of the photosensitive silver halide layer.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 92,
      inlines: [
        text(
          "The product of claim 87 in which said dispersion of an organic film-forming colloid is a solution of a plastic.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 93,
      inlines: [
        text("The product of claim 92 in which the plastic is sodium carboxymethyl cellulose."),
      ],
    },
    {
      kind: "claim",
      number: 94,
      inlines: [
        text(
          "The product of claim 87 in which the organic colloid is a plastic and the silver halide developer is in the container.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 95,
      inlines: [
        text(
          "The product of claim 94 in which the container also contains a silver halide solvent.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 96,
      inlines: [text("The product of claim 95 in which the sheet support is baryta paper.")],
    },
    {
      kind: "claim",
      number: 97,
      inlines: [
        text(
          "The product of claim 87 in which the container is flat and substantially rectangular in shape and the sheet support is not appreciably wider than the container is long, the container being mounted with its long axis extending widthwise of the support.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 98,
      inlines: [
        text(
          "The product of claim 97 wherein all of the container walls are formed from a single sheet of deformable and flexible multi-ply sheet material.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 99,
      inlines: [
        text(
          "A photographic product capable of dispensing a photographic reagent directly to a photosensitive silver halide element for developing the same, said product comprising a rupturable disposable container holding a sufficient quantity of processing liquid for a single application, which liquid includes a reducing agent for developing the exposed portion of a photosensitive element having as its photosensitive material a heavy metal salt capable of forming a latent image upon photoexposure and capable of being developed by said reducing agent to produce a visible image comprising the metal of said salt, said container being multi-sided and elongated and having the walls thereof formed of a deformable sheet material, said walls being secured together in face-to-face relation along a long edge of the container to provide a liquid dispensing lip at said edge extending substantially the length of the container, said sheet material being stronger than the seal of the dispensing lip and being sufficiently deformable and flexible to transmit to the container contents externally applied pressure of sufficient magnitude to open said lip.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 100,
      inlines: [
        text(
          "A photographic product capable of dispensing a photographic reagent directly to an exposed photosensitive, silver halide element for processing the same, said product comprising a rupturable disposable container holding a sufficient quantity of processing liquid for a single application, which liquid includes at least one processing agent from the class consisting of the silver halide developers and the silver halide fixers, said container being multi-sided and elongated and having the walls thereof formed of a deformable sheet material, said walls being secured together in face-to-face relation along a long edge of the container to provide a liquid-dispensing lip at said edge extending substantially the length of the container, said sheet material being stronger than the seal of the dispensing lip and being sufficiently deformable and flexible to transmit to the container contents externally applied pressure of sufficient magnitude to open said lip.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 101,
      inlines: [
        text(
          "A photographic product capable of dispensing a processing agent between a photosensitive silver halide element and a print-receiving layer to form transfer prints, said product comprising a rupturable, disposable, elongated container holding a liquid dispersion which includes a silver halide developer and a silver halide solvent, longitudinally extending portions of said container being uniformly more rupturable than other portions of the container and providing, upon rupture, a liquid dispensing passage along a substantial length of the container, the container walls being at least in part deformable and flexible for transmitting to the container contents externally applied pressure of sufficient magnitude to rupture said more rupturable portions, said liquid dispersion being sufficient in amount to treat an area of a photosensitive silver halide element at least as great as the maximum area of said container.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 102,
      inlines: [
        text(
          "The product of claim 101 wherein an organic film-forming colloid is included in the dispersion.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 103,
      inlines: [
        text(
          "The product of claim 102 wherein the dispersion is an aqueous alkaline solution and the colloid is a plastic dissolved in said aqueous alkaline solution, said plastic being capable of retaining its viscosity imparting characteristics in an alkaline solution, the viscosity of the solution being of the order of 1,000 to 200,000 centipoises at 24°C.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 104,
      inlines: [
        text("The product of claim 103 wherein the plastic is sodium carboxymethyl cellulose."),
      ],
    },
    {
      kind: "claim",
      number: 105,
      inlines: [
        text(
          "The product of claim 104 wherein the solution includes hydroquinone, sodium thiosulfate and sodium hydroxide.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 106,
      inlines: [
        text(
          "A photographic product capable of dispensing a processing agent for processing a photosensitive silver halide element, said product comprising a rupturable, disposable, elongated container holding a liquid dispersion which includes at least one reagent from the class consisting of the silver halide developers and the silver halide fixers, longitudinally extending portions of said container being uniformly more rupturable than other portions of the container and providing, upon rupture, a liquid-dispensing passage along a substantial length of the container, the container walls being at least in part deformable and flexible for transmitting to the container contents externally applied pressure of sufficient magnitude to rupture said more rupturable portions.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 107,
      inlines: [
        text(
          "A photographic product for dispensing a silver halide developer directly to a photosensitive silver halide element for processing the same, said product comprising an elongated container holding a liquid dispersion including a film-forming colloid and a silver halide developer, said silver halide developer being in an amount sufficient to develop an area of a photosensitive silver halide emulsion at least as great as the maximum area of said container, portions of the container walls being secured together in face-to-face relation to provide a liquid dispensing lip extending along a substantial length of the container, the material of the container walls being stronger than the seal of the dispensing lip and said walls being at least in part deformable and flexible for transmitting to the container contents externally applied pressure of sufficient magnitude to open said lip.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 108,
      inlines: [
        text(
          "The product of claim 107 wherein the liquid dispersion is an alkaline aqueous solution and the colloid is a plastic dissolved in said solution.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 109,
      inlines: [
        text(
          "The product of claim 108 wherein the container is substantially flat, multi-sided and oxygen impervious and said lip extends substantially the entire length of one long side of said container.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 110,
      inlines: [
        text(
          "A photographic product capable of uniformly dispensing a photographic reagent when squeezed between a pair of sheet materials by a pair of pressure-applying members, said product comprising a rupturable disposable container holding a sufficient quantity of a processing liquid for a single application, said liquid including a photographic image-transforming reagent for transforming an image in a photographically photosensitive element, said container being elongated and having the walls thereof at least in part deformable and flexible for transmitting pressures applied thereto to the container contents, said container having one long edge adapted to be drawn between a pair of pressure-applying members and a liquid dispensing lip opposite said edge, said liquid dispensing lip comprising portions of the container walls secured together in face-to-face relation and capable, by separation, of permitting the contents of the container to be dispensed between two sheet materials away from the container in a direction substantially perpendicular to the long dimension thereof, said container walls consisting of an upper and lower wall, each wall extending continuously, without folds, throughout its entire area, the total thickness of the container walls, measured depthwise at any point of the container, not appreciably exceeding the sum of a single thickness of the material of the upper wall and a single thickness of the material of the lower wall whereby said container, when passed between a pair of pressure-applying members, is capable of being flattened to a substantially uniform thickness.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 111,
      inlines: [
        text(
          "The product of claim 110 in which the processing liquid is an aqueous alkaline solution whose viscosity is in excess of 1,000 centipoises at 24°C.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 112,
      inlines: [
        text(
          "The product of claim 111 wherein the processing liquid contains, as a thickening agent, a soluble salt of carboxymethyl cellulose.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 113,
      inlines: [
        text(
          "The product of claim 110 wherein the reagent is at least one processing agent from the class consisting of the silver halide developers and the silver halide fixers.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 114,
      inlines: [
        text(
          "A product capable of forming transfer prints in conjunction with a photosensitive silver halide element and a print-receiving layer, said product comprising a substantially flat, multi-sided, elongated disposable, single use container holding an aqueous solution which includes, as ingredients, hydroquinone, sodium thiosulfate, sodium hydroxide and sodium carboxymethyl cellulose, said solution having a viscosity of the order of 1,000 to 200,000 centipoises at a temperature of approximately 24° C., the container walls being formed of a deformable sheet material, said walls being secured together in face-to-face relation along a long edge of the container to provide a liquid dispensing lip adjacent said edge extending substantially the length of the container, said sheet material being stronger than the seal of the dispensing lip and being sufficiently deformable and flexible to transmit to the container contents externally applied pressure of sufficient magnitude to open said lip, the viscous contents of said container cooperating with said lip to insure more uniform unsealing thereof upon the application of sufficient pressure to the container walls.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 115,
      inlines: [
        text(
          "A photographic product capable of dispensing a photographic reagent directly to a photosensitive element for developing the same, said product comprising a rupturable, disposable, externally dry container holding a sufficient quantity of processing liquid for a single application, which liquid includes a reducing agent for developing the exposed portion of a photosensitive element having as its photosensitive material a heavy metal salt capable of forming a latent image upon photoexposure and capable of being developed by said reducing agent to produce a visible image comprising the metal of said salt, said container being multi-sided and elongated and having the walls thereof formed of a deformable sheet material, said walls being impervious to water vapor and to oxygen and being secured together in face-to-face relation along a long edge of the container to provide a liquid-dispensing lip at said edge extending substantially the length of the container, said sheet material being stronger than the seal of the dispensing lip and being sufficiently deformable and flexible to transmit to the container contents externally applied pressure of sufficient magnitude to open said lip, the liquid in the container including a thickening agent which imparts thereto a viscosity of the order of 1,000 to 200,000 centipoises at a temperature of approximately 24° C., said liquid in its viscous condition cooperating with said container to insure uniform unsealing of said liquid-dispensing lip upon the application of sufficient pressure to the container walls.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 116,
      inlines: [
        text(
          "The product of claim 115 wherein the container is flat and substantially rectangular in shape and is formed of a single sheet of folded material, the fold providing one long edge thereof and the marginal portions opposite the fold being adhesively secured in face-to-face relation to provide the dispensing lip.",
        ),
      ],
    },
    p(text("EDWIN H. LAND.")),
    {
      kind: "heading",
      level: 2,
      text: "REFERENCES CITED",
    },
    p(
      text(
        "The following references are of record in the file of this patent:\n\nUNITED STATES PATENTS\n786,534 Thornton et al. — Apr. 4, 1905\n916,325 Kelley — Mar. 23, 1909\n1,207,042 Hochstetter — Dec. 5, 1916\n1,277,048 de Brayer — Aug. 27, 1918\n1,360,624 Dodge — Nov. 30, 1920\n1,592,379 Merle — July 13, 1926\n1,592,584 Wiegelmann — July 13, 1926\n1,742,809 Hoover — Jan. 7, 1930\n2,071,821 Eckhardt — Feb. 23, 1937\n2,121,397 Downing — June 21, 1938\n2,136,007 Gish — Nov. 8, 1938\n2,139,040 Salfisberg — Dec. 6, 1938\n2,197,994 Butement — Apr. 23, 1940\n2,211,498 Files — Aug. 13, 1940\n2,259,796 Clark — Oct. 21, 1941\n2,299,694 Green — Oct. 20, 1942\n2,319,560 Salfisberg — May 18, 1943\n2,322,005 Fierke — June 15, 1943\n2,322,006 Fierke — June 15, 1943\n2,322,027 Jelley et al. — June 15, 1943\n2,347,640 Peters — May 2, 1944\n2,352,014 Rott — June 20, 1944\n2,361,936 Gaspor — Nov. 7, 1944\n2,430,995 Roos — Nov. 18, 1947\n\nFOREIGN PATENTS\n9,248 Great Britain — 1905\n7,521 Great Britain — June 28, 1906\n21,692 Great Britain — Oct. 1, 1908 (of 1907)\n369,146 Germany — Feb. 15, 1923\n370,821 Germany — Mar. 8, 1923\n328,762 Great Britain — May 8, 1930\n567,011 Germany — July 22, 1931\n541,045 Great Britain — Nov. 11, 1941\n879,995 France — Mar. 5, 1942",
      ),
    ),
  ],
};

const landPolaroidLegacyIndexToCurrent = (legacyIndex: number): number => {
  if (legacyIndex <= 6) return legacyIndex;
  if (legacyIndex === 7) return 8;
  if (legacyIndex === 8) return 9;
  if (legacyIndex === 9) return 11;
  if (legacyIndex >= 11 && legacyIndex <= 34) return legacyIndex + 2;
  if (legacyIndex >= 36 && legacyIndex <= 41) return legacyIndex + 6;
  if (legacyIndex >= 42) return legacyIndex + 25;
  return legacyIndex;
};

/**
 * Non-lossy companions keyed to the current edition block indexes. The
 * legacy map above predates the pages 9–12 source repair and is remapped here
 * so consumers cannot silently attach a reading to the wrong paragraph.
 */
const landPolaroidParallelReadingsByBlock: Readonly<Record<number, readonly string[]>> = {
  ...Object.fromEntries(
    Object.entries(landPolaroidLegacyParallelReadings).map(([legacyIndex, reading]) => [
      landPolaroidLegacyIndexToCurrent(Number(legacyIndex)),
      reading,
    ]),
  ),
  7: [
    "The patent next broadens the object list to photographic materials in which a released reagent develops a latent image, moves an image-forming component, and creates a positive dye or silver transfer image in separable print material.",
  ],
  10: [
    "Land separates the final formal object from the notice that other objects will become clear, then states that the claims will define the scope of the product’s features, properties, and component relationships.",
  ],
  48: [
    "This method exposes a photosensitive layer, releases reagent to develop its latent image, and translates the image-forming component relative to developed silver halide so a fixed positive image results.",
  ],
  49: [
    "The first modification sends the image-forming component into an adjacent positive-print layer, making the relative translation a transfer into a neighboring receiving stratum.",
  ],
  50: [
    "The adjacent-layer process uses a developer for exposed silver halide and a compound that complexes unexposed silver halide; the soluble component migrates and is reduced to silver in the positive layer.",
  ],
  51: [
    "Solarization reverses which areas develop after differential exposure. A developer oxidation product migrates as a dye base and reacts with a coupler in the positive layer; the alternative keeps coupler and developer in the reagent.",
  ],
  52: [
    "A further solarized arrangement forms the migratory dye inside the photosensitive layer, either through a dispersed coupler or self-coupling oxidized developer, and then transports it to an adjacent positive print layer.",
  ],
  53: [
    "Figure 1’s first embodiment stacks a transparent plastic base, a clear image-forming layer, and a silver-halide gelatin emulsion in that order.",
  ],
  54: [
    "The film stores solvent in porous sheet 40, backs it with frangible membrane 42, and encloses the sheet with vapor-impervious film 44 and coating 46 so liquid is retained until processing.",
  ],
  55: [
    "Stretching beyond membrane 42’s yield point releases the liquid through porous layer 48, which backs the membrane, promotes uniform permeation, and can carry solid reagent compounds.",
  ],
  56: [
    "All layers are laminated into one film while layers 36 and 34 remain separable at their interface; the drawing is schematic and the stated thickness range is relative to ordinary photographic film.",
  ],
  57: [
    "Hydroquinone develops exposed silver halide while sodium thiosulfate complexes unexposed halide; the soluble complex reaches layer 34, where silver forms the positive image, and a precipitate can supply a white background.",
  ],
  58: [
    "The patent permits a transparency by omitting one or both compounds used to make the opaque white background.",
  ],
  59: [
    "The positive print is obtained by stripping base 32 and layer 34 from the remaining film, and the source notes that this operation corrects geometric reversal.",
  ],
  60: [
    "Developer and other reactive ingredients may reside in porous layer 48 or liquid layer 40; placing solids in photosensitive layer 36 is possible but risks desensitization.",
  ],
  61: [
    "The named reagent example contains sodium sulfite, hydroquinone, sodium hydroxide, potassium bromide, sodium thiosulfate, and water in the printed quantities.",
  ],
  62: [
    "A solarized layer develops its nonexposed areas after camera exposure; p-phenylene-diamine and alpha-naphthol provide the illustrated blue dye route, with alternate coupler placement and self-coupling developers.",
  ],
  63: [
    "The other disclosed positive-print methods may also be used with this film whenever a suitable reagent, photosensitive layer, and receiving layer are combined.",
  ],
  64: [
    "Figure 2’s modification replaces the liquid means with grooved cells and a frangible wall; the porous backing may remain, and the film can be cut into staggered longitudinal strips without wasting liquid.",
  ],
  65: [
    "Cell cross-sections may be rectangular or circular, and staggered rows prevent a longitudinal cut from opening a continuous liquid channel.",
  ],
  66: [
    "Figure 3 places the liquid-containing member outside the photosensitive layer, adds a permeable antihalation coating and positive-image layer, and allows the receiving stack to be stripped or made opaque.",
  ],
  80: [
    "The reagent ingredients are mixed in a specified order: the salts and developer are dissolved first, cellulose solution is mixed in, the batch is cooled to 65–75 degrees Fahrenheit, and sodium hydroxide is added last.",
  ],
  81: [
    "Example 2 records water, 7.0 grams of sodium sulfite, hydroquinone, sodium thiosulfate, sodium carboxymethyl cellulose solution, and 10% sodium hydroxide in the printed quantities.",
  ],
  82: [
    "The alternative mixing route dilutes the cellulose solution first, mixes the remaining ingredients at 80–90 degrees Fahrenheit, cools the batch to approximately 65–75 degrees, and then adds sodium hydroxide.",
  ],
  83: [
    "Ingredient ranges are broad: hydroquinone up to 6.6 grams, thiosulfate 1.4–2.8 grams, hydroxide solution 11–44 cubic centimeters, with optional potassium bromide preservative.",
  ],
  84: [
    "Example 3 lists 150 cubic centimeters water, hydroquinone, sodium sulfite, Metol, sodium thiosulfate, cellulose solution, and sodium hydroxide in the stated quantities.",
  ],
  85: [
    "Sodium alginate and named starches can replace cellulose in stated relative concentrations; starch generally requires about twice the cellulose concentration.",
  ],
  86: [
    "Titanium dioxide, alone or with magnesium oxide or magnesium carbonate, makes a white nontransparent film and raises viscosity; ten to twenty percent titanium dioxide is effective.",
  ],
  87: [
    "The specification lists alternative developers, including Kodelon, Athenon or Glycin, and Amidol, while retaining the chemical breadth of the reagent disclosure.",
  ],
  88: [
    "Ammonium thiosulfate and ammonia can form soluble silver complexes, but the complexing substance should not desensitize the emulsion or be toxic; sodium cyanide is therefore discouraged.",
  ],
  89: [
    "Additional accelerators include alkaline salts, borax, paraformaldehyde, trisodium phosphate, and Triton B, identified as a 40% benzyl trimethyl ammonium hydroxide solution.",
  ],
  90: [
    "The operating sequence differentially exposes layer 212, releases reagent 218 under stress in darkness, develops exposed halide, transports soluble complex to layer 214, and reduces it to the positive silver image.",
  ],
  91: [
    "The thickener leaves the positive reduction product in a film on the receiving layer; after formation, the receiving layer, reagent film, and base 216 separate from the photosensitive layer.",
  ],
  92: [
    "Transparent bases and receiving layers produce transparencies, while pigmented plastic, paper, or opal cellulose acetate provides a white nontransparent background for a conventional print.",
  ],
  93: [
    "A thin opaque water-permeable receiving sheet can itself carry the image as silver ions pass through it; a transparent base may remain attached because the sheet hides the negative.",
  ],
  94: [
    "The receiving layer may be omitted when the reagent thickener forms the image-receiving film. Base 216 is selected or subcoated for affinity to that film rather than to the photosensitive layer.",
  ],
  95: [
    "A second positive-image method tans the carrier where development occurs, retaining dye there while undeveloped regions let dye migrate into the receiving layer as the positive image.",
  ],
  96: [
    "In the preferred dye modification, pyrocatechin acts as developer and p-phenylenediamine in the photosensitive layer reacts with it to form the retained dye.",
  ],
  97: [
    "Figure 17's unitary sheetlike product combines base 216 and reagent containers 218 so it can process a separate latent-image photosensitive layer and make its positive image on the base.",
  ],
  98: [
    "Base 216 may include receiving layer 214, but that layer is optional when the reagent itself forms the positive-image film.",
  ],
  99: [
    "Composite sheet 225 is pressed against an exposed negative film, releasing reagent across the frame; the unit can be used in a darkroom or camera shortly after exposure.",
  ],
  100: [
    "Opaque supports can shield the exposed film and reagent sheet from actinic light, allowing the assembled unit to leave the camera without damaging the image-forming reaction.",
  ],
  101: [
    "Containers may be separate from base 216 and dispensed by camera metering hardware or placed by hand between the exposed layer and base while pressure rollers bring them together.",
  ],
  102: [
    "The film-forming ingredient is a high-molecular-weight polymer chosen to preserve viscosity and film formation during the interval between mixing the reagent and using it.",
  ],
  103: [
    "Alkali-stable polymer groups and water-soluble cellulose or polyalkane derivatives maintain uniform viscosity in aqueous alkaline reagent, unlike ester or acid-chloride groups.",
  ],
  104: [
    "Selecting the polymer controls whether the solid reagent film adheres to emulsion 212 or receiving layer 214; harder gelatin or baryta surfaces attract the cellulose film.",
  ],
  105: [
    "Commercial operation favors viscosity above 1,000 centipoises, preferably 1,000–200,000 at about 24 degrees Celsius, and permits omitting a preformed pod cavity.",
  ],
  106: [
    "Figure 18's three-layer sheet uses chemically inert liquid-facing polyvinyl butyral, vapor-resistant metal foil, and kraft-paper backing, with the printed composition ranges retained.",
  ],
  107: [
    "The Figure 19 container and Figure 20 section fold sheet 230, seal end and longitudinal margins, and create central space 235 for the processing agent.",
  ],
  108: [
    "Containers 240 can be mounted across a sheet support, and Figure 22 places them between transparent base 246 with emulsion 248 and image-carrying layer 242 in rolls, packs, or frames.",
  ],
  109: [
    "Contact between emulsion and receiving layer limits oxidation, while the viscous film-forming reagent opens the longitudinal seal uniformly along the container length.",
  ],
  110: [
    "An applicator roll can spread reagent without a second sheet. Figures 14 and 21 may omit receiving layers when a white opaque reagent film both receives the positive and hides the negative.",
  ],
  111: [
    "Figure 23 connects photosensitive layer 310, image-carrying layer 312, and container 300, with hinge 314 allowing exposure before the layers are returned to superposition.",
  ],
  112: [
    "Opaque backing 318, hinge 319, image-receiving area 320, and margins 322 enclose the exposed layer for daylight handling before pressure rollers spread reagent from container 300.",
  ],
  113: [
    "Figure 24 substitutes a brittle hermetically sealed tube 350 inside permeable envelope 352, which retains broken tube fragments while allowing processing liquid to pass.",
  ],
  114: [
    "The diazonium embodiment uses Figure 23's structure with Blackline #202 photosensitive material and a stated sodium carboxymethyl cellulose and Blackline developer reagent.",
  ],
  115: [
    "An alternative diazonium layer uses chlorostannate of para-diazo-di-N-butyl-aniline and Pontacyl Brilliant Blue 2R; its reagent adds sodium carbonate and phloroglucinol.",
  ],
  116: [
    "Naphthanil Diazo Black B supplies another photosensitive layer, developed by a stated sodium carboxymethyl cellulose solution containing resorcinol and sodium hydroxide.",
  ],
  117: [
    "Ferric oxalates, tartrates, and citrates photoreduce to ferrous salts, providing another barely visible latent image that suitable chemistry can develop.",
  ],
  118: [
    "Ferric-to-ferrous differentiating reagents include ferri- and ferrocyanides, tannins, gallic acid, quinone sulphonic acid, and metal salts, all retained as source examples.",
  ],
  119: [
    "The disclosure covers photographic materials sensitive to visible, X-ray, ultraviolet, or infrared radiation, not only the silver-halide embodiments described earlier.",
  ],
  120: [
    "Land defines photographic developing reagent and development broadly, covering treatment that makes a visible image more visible or makes an otherwise invisible photoexposure visible.",
  ],
  121: [
    "The specification distinguishes exposed from nonexposed solarized silver halide after solarization and notes that solarization may be chemical or produced by uniform light exposure.",
  ],
  122: [
    "Dispersion includes a solution; the continuation applications and illustrative, nonlimiting character of the description immediately precede the formal claim preamble.",
  ],
  240: [
    "The inventor line closes the formal claim section with Edwin H. Land's printed name. The attorney's handwritten signature matter appears only on the drawing sheets and is not silently reconstructed as typed text.",
  ],
  242: [
    "The final formal section identifies the references of record, listing 24 United States patents and 9 foreign patents exactly as printed after the inventor line.",
  ],
};

export const landPolaroidParallelReadings: Readonly<Record<number, readonly string[]>> =
  Object.fromEntries(
    Object.entries(landPolaroidParallelReadingsByBlock).map(([index, reading]) => {
      const blockIndex = Number(index);
      return [blockIndex + (blockIndex >= 37 ? 3 : 0), reading];
    }),
  ) as Readonly<Record<number, readonly string[]>>;

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
