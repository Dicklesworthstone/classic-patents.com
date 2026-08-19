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

const term = (text: string, definition: string): CuratedSpecificationInline => ({
  kind: "term",
  text,
  definition,
});

const figure = (num: number, label: string): CuratedSpecificationInline => ({
  kind: "reference",
  text: label,
  href: `#kwolek-fig-${num}`,
  referenceType: "figure",
  label: `Preview ${label} of US 3,671,542`,
  figurePreviews: [
    {
      src: `/patents/figures/us-3671542-kwolek-kevlar/fig-${num}-source-preview.png`,
      alt: `US 3,671,542 ${label}`,
      width: 1160,
      height: 1704,
    },
  ],
});

export const kwolekKevlarClaims = [
  {
    number: 1,
    text: "Optically anisotropic dope consisting essentially of: I. at least about 5 percent by weight of a polymer having an inherent viscosity of at least 0.7 and consisting essentially of at least one type of carbocyclic aromatic homo- or copolyamide having chain extending bonds from each aromatic nucleus which are coaxial or parallel and oppositely directed, and II. at least one liquid medium selected from the group consisting of: A. amides and ureas selected from the group consisting of: N,N-dimethylacetamide, N,N-dimethylpropionamide, N,N-dimethylbutyramide, N,N-dimethylisobutyramide, N,N-dimethylmethoxyacetamide, N,N-diethylacetamide, N-methylpyrrolidone-2, N-methylpiperidone-2, N-methylcaprolactam, N-ethylpyrrolidone-2, N-acetylpyrrolidine, N-acetylpiperidine, N,N'-dimethylethyleneurea, N,N'-dimethylpropyleneurea, hexamethylphosphoramide, and N,N,N',N'-tetramethylurea and containing a salt from the group consisting of lithium chloride and calcium chloride, B. concentrated sulfuric acid, C. hydrofluoric acid, and D. chloro-, fluoro- or methane-sulfonic acids, said polymer being present in the dope in a concentration above the level at which there is a decrease in viscosity with increasing concentration represented by a sharp discontinuity in the slope of the plot of the dope viscosity vs. polymer concentration curve without the formation of a solid phase.",
  },
  {
    number: 2,
    text: "Dope of claim 1 wherein said liquid medium is concentrated (greater than about 98 percent by weight) sulfuric acid which may contain free SO3.",
  },
] as const;

// This legacy reconstruction is preserved for research comparison only. It is
// not a complete transcription of the 58-page primary source and is never
export const kwolekKevlarArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "7a2b753cf8d6f329d5fad750dc2de510f723876cac6aa41a4076f0343a7a62c4",
  preparedBy: "Classic Patents editorial agent (SteelNeedle)",
  preparedAt: "2026-08-18",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "United States Patent",
        "Kwolek",
        "[15] 3,671,542",
        "[45] *June 20, 1972",
        "[54] OPTICALLY ANISOTROPIC AROMATIC POLYAMIDE DOPES",
        "[72] Inventor: Stephanie Louise Kwolek, Wilmington, Del.",
        "[73] Assignee: E. I. du Pont de Nemours and Company, Wilmington, Del.",
        "[*] Notice: The portion of the term of this patent subsequent to August 17, 1988, has been disclaimed.",
        "[22] Filed: May 23, 1969",
        "[21] Appl. No.: 827,345",
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIG. I",
      title: "Liquid concentration versus polymer concentration phase sketch",
      description: [figure(1, "FIG. I")],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIG. II",
      title: "Pulse-count curve for poly(p-benzamide) in hydrofluoric acid",
      description: [figure(2, "FIG. II")],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIG. III",
      title: "Relative intensity of X-ray diffraction",
      description: [figure(3, "FIG. III")],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIG. IV",
      title: "Poly(p-benzamide) concentration in sulfuric acid",
      description: [figure(4, "FIG. IV")],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIG. V",
      title: "Poly(p-phenylene terephthalamide) concentration in sulfuric acid",
      description: [figure(5, "FIG. V")],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIG. VI",
      title: "Critical concentration for poly(p-phenylene terephthalamide)",
      description: [figure(6, "FIG. VI")],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIG. VII",
      title: "Critical concentration for poly(p-benzamide)",
      description: [figure(7, "FIG. VII")],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIG. VIII",
      title: "Tensile modulus versus orientation angle",
      description: [figure(8, "FIG. VIII")],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIG. IX",
      title: "Sonic velocity versus tensile modulus",
      description: [figure(9, "FIG. IX")],
    },
    { kind: "heading", level: 2, text: "Cross Reference to Related Applications" },
    paragraph(
      literal(
        "This application is a continuation-in-part of application Ser. No. 736,410, filed June 12, 1968, now abandoned, which is a continuation-in-part of application Ser. No. 644,851, filed June 9, 1967, now abandoned, which is a continuation-in-part of application Ser. No. 556,934, filed June 13, 1966, now abandoned.",
      ),
    ),
    { kind: "heading", level: 2, text: "Background of the Invention" },
    paragraph(
      literal(
        "Synthetic polyamides such as aliphatic nylons have long been known. However, these conventional polyamides consist of flexible molecular chains that dissolve into isotropic solutions with randomly coiled conformations. When extruded into fibers, such solutions yield filaments that require substantial mechanical drawing (hot stretching) to achieve moderate molecular orientation, and possess modest tensile modulus and relatively low melting points.",
      ),
    ),
    paragraph(
      literal(
        "Wholly aromatic polyamides consisting of rigid, para-oriented aromatic rings joined by amide linkages exhibit significantly greater thermal and chemical stability, but have traditionally proven difficult to dissolve and process without degradation.",
      ),
    ),
    { kind: "heading", level: 2, text: "Summary of the Invention" },
    paragraph([
      text("This invention provides novel liquid compositions or "),
      term("dopes", "Liquid polymer solutions used for spinning fibers or casting films."),
      text(" comprising carbocyclic aromatic polyamides in selected liquid media which are "),
      term(
        "optically anisotropic",
        "Exhibiting direction-dependent light transmission and birefringence caused by nematic liquid-crystalline ordering.",
      ),
      text(
        ". When these dopes are extruded through spinnerets, the liquid-crystalline domains undergo spontaneous, nearly perfect axial alignment, yielding as-spun fibers of exceptionally high tensile modulus, high sonic velocity, and low orientation angle.",
      ),
    ]),
    paragraph(
      literal(
        "The invention is based on the discovery that when the polymer concentration in selected solvents is increased above a critical threshold, the solution transitions from an optically isotropic state to an optically anisotropic, nematic liquid-crystalline state characterized by an abrupt decrease in spinning viscosity.",
      ),
    ),
    { kind: "heading", level: 2, text: "Phase Relationships and Critical Concentration" },
    paragraph([
      text("The phase relationships of these dopes are illustrated in the drawings. "),
      figure(1, "FIG. I"),
      text(
        " is a phase sketch for poly(p-benzamide) in dimethylacetamide with lithium chloride, delineating the isotropic, anisotropic, mixed-phase, and solid regions as a function of polymer and salt concentration.",
      ),
    ]),
    paragraph([
      figure(2, "FIG. II"),
      text(
        " illustrates the optical pulse count as a function of poly(p-benzamide) concentration in hydrofluoric acid at 0°C, showing the sharp onset of optical birefringence at the critical concentration.",
      ),
    ]),
    paragraph([
      figure(4, "FIG. IV"),
      text(
        " shows the concentration of poly(p-benzamide) in sulfuric acid as a function of acid strength (90 to 104% H2SO4), mapping the anisotropic dope boundaries.",
      ),
    ]),
    paragraph([
      figure(5, "FIG. V"),
      text(
        " shows the corresponding phase diagram for poly(p-phenylene terephthalamide) in sulfuric acid, indicating the anisotropic dope regime above critical concentration.",
      ),
    ]),
    paragraph([
      figure(6, "FIG. VI"),
      text(" and "),
      figure(7, "FIG. VII"),
      text(
        " illustrate critical polymer concentration as a function of inherent viscosity for poly(p-phenylene terephthalamide) and poly(p-benzamide), respectively.",
      ),
    ]),
    { kind: "heading", level: 2, text: "Polymers and Liquid Media" },
    paragraph(
      literal(
        "The polymers suitable for forming the anisotropic dopes of this invention are carbocyclic aromatic homopolyamides or copolyamides having chain-extending bonds from each aromatic nucleus that are coaxial or parallel and oppositely directed (para-oriented radicals). Preferred polymers include poly(p-phenylene terephthalamide) (PPD-T), poly(p-benzamide) (PBA), and their chloro-, methyl-, and methoxy-substituted derivatives.",
      ),
    ),
    paragraph(
      literal(
        "The liquid medium is selected from concentrated sulfuric acid (98-100% H2SO4, optionally with free SO3), hydrofluoric acid (HF), chloro-, fluoro-, or methanesulfonic acids, or organic amide and urea solvents (such as N,N-dimethylacetamide, N-methylpyrrolidone-2, and hexamethylphosphoramide) containing dissolved lithium chloride or calcium chloride salts.",
      ),
    ),
    { kind: "heading", level: 2, text: "Fiber Spinning and Structural Properties" },
    paragraph(
      literal(
        "Fibers are prepared from these optically anisotropic dopes by extruding the dope through spinneret capillaries, across an air gap (dry-jet wet spinning), and into an aqueous coagulating bath. The elongational flow in the air gap aligns the nematic liquid-crystalline domains along the filament axis before coagulation freezes the ordered crystalline structure.",
      ),
    ),
    paragraph([
      text("The resulting fibers exhibit exceptional orientation and tensile properties. "),
      figure(3, "FIG. III"),
      text(
        " shows the X-ray diffraction trace used to measure orientation angle across diffraction peaks A and B. ",
      ),
      figure(8, "FIG. VIII"),
      text(
        " plots the relationship between tensile modulus and orientation angle, showing that lower orientation angles correspond to dramatically higher modulus values.",
      ),
    ]),
    paragraph([
      figure(9, "FIG. IX"),
      text(
        " shows the direct correlation between sonic velocity (acoustic wave propagation speed in km/sec) and tensile modulus in grams per denier for as-spun and heat-treated fibers.",
      ),
    ]),
    { kind: "heading", level: 2, text: "Representative Examples" },
    paragraph(
      literal(
        "The specification details over eighty preparation examples demonstrating the synthesis of aromatic polyamides, the formulation of anisotropic dopes, spinning into high-tenacity filaments, and subsequent thermal treatments.",
      ),
    ),
    paragraph(
      literal(
        "Example 82 illustrates the preparation of high modulus fibers of poly(p-phenylene 2,5-dichloroterephthalamide) by extruding a sulfuric acid spin dope into a cold water bath, followed by two-stage heat treatment at 305°C and 502°C to achieve a tensile modulus of 386 grams per denier and high crystallinity.",
      ),
    ),
    paragraph(
      literal(
        "Example 83 and Table XVII report X-ray crystallite orientation percentages for representative as-extruded fibers, demonstrating that in each instance greater than 50 percent (and up to 76 percent) of the crystallites are aligned within one half the orientation angle of the fiber axis.",
      ),
    ),
    { kind: "heading", level: 2, text: "Claims" },
    paragraph(literal("What is claimed is:")),
    {
      kind: "claim",
      number: 1,
      inlines: literal(kwolekKevlarClaims[0].text),
    },
    {
      kind: "claim",
      number: 2,
      inlines: literal(kwolekKevlarClaims[1].text),
    },
  ],
};

const legacyKwolekKevlarUnpublishedParallelReadings: Readonly<Record<number, readonly string[]>> = {
  11: [
    "The application establishes priority through a chain of three earlier abandoned U.S. filings (Ser. Nos. 736,410, 644,851, and 556,934), dating back to June 13, 1966.",
  ],
  13: [
    "Prior synthetic polyamides like aliphatic nylons consist of flexible coiled chains that dissolve into isotropic solutions, yielding fibers with low modulus that require hot stretching.",
  ],
  14: [
    "Wholly aromatic polyamides with rigid benzene rings offer high thermal resistance, but conventional solvents were unable to dissolve them into workable spinning dopes.",
  ],
  16: [
    "The invention introduces optically anisotropic polymer solutions (dopes) where carbocyclic aromatic polyamides form ordered liquid crystals that self-align during fiber spinning.",
  ],
  17: [
    "Above a critical polymer concentration, the dope transitions from clear isotropic liquid to a cloudy birefringent nematic phase with an abrupt, advantageous plunge in spinning viscosity.",
  ],
  19: [
    "Figure 1 maps the phase boundaries of poly(p-benzamide) in DMAc with lithium chloride, showing distinct isotropic, anisotropic, and solid precipitation zones.",
  ],
  20: [
    "Figure 2 illustrates optical pulse count measurements versus polymer concentration in hydrofluoric acid at 0°C, marking the sharp onset of optical anisotropy.",
  ],
  21: [
    "Figure 4 charts poly(p-benzamide) concentration against sulfuric acid strength (90-104% H2SO4), defining the operating window for anisotropic dope stability.",
  ],
  22: [
    "Figure 5 presents the sulfuric acid phase diagram for poly(p-phenylene terephthalamide), establishing the concentration threshold for liquid-crystalline dope formation.",
  ],
  23: [
    "Figures 6 and 7 relate critical polymer concentration to inherent viscosity for PPD-T and PBA, demonstrating that higher molecular weights lower the anisotropy threshold.",
  ],
  25: [
    "Suitable polymers are carbocyclic aromatic polyamides with coaxial or parallel opposite chain-extending bonds (para-orientation), including PPD-T and PBA.",
  ],
  26: [
    "The liquid solvent system comprises concentrated sulfuric acid (98-100% H2SO4), hydrofluoric acid, sulfonic acids, or amide/urea solvents containing lithium or calcium chloride salts.",
  ],
  28: [
    "Fibers are manufactured by dry-jet wet spinning through an air gap into cold water, where elongational shear aligns the nematic domains before solvent extraction.",
  ],
  29: [
    "Figure 3 details X-ray diffraction peaks A and B, while Figure 8 proves that fibers spun from anisotropic dopes achieve ultra-high tensile modulus at low orientation angles.",
  ],
  30: [
    "Figure 9 confirms a direct physical correlation between acoustic sonic velocity (km/sec) and tensile modulus in grams per denier for both as-spun and heat-treated fibers.",
  ],
  32: [
    "The specification provides extensive experimental procedures across 83 preparation examples detailing polymer syntheses, solvent formulations, spinning, and properties.",
  ],
  33: [
    "Example 82 demonstrates the synthesis and dry-jet spinning of poly(p-phenylene 2,5-dichloroterephthalamide) into fibers with a modulus of 386 g/denier after heat treatment.",
  ],
  34: [
    "Example 83 and Table XVII document X-ray measurements confirming that over 50% (up to 76%) of crystallites are oriented within half the orientation angle of the fiber axis.",
  ],
  36: [
    "The formal claims define the legal scope of the patent, reciting the combination of para-oriented aromatic polyamide, critical concentration, and selected liquid media.",
  ],
};

export const kwolekKevlarParallelReadings = legacyKwolekKevlarUnpublishedParallelReadings;

/**
 * Non-rendered handoff metadata for the real source-authoring task. Keeping the
 * legacy draft attached here preserves prior work without allowing its short
 * reconstruction to be confused with a complete historical edition.
 */
export const kwolekKevlarSourceAuthoringWip = {
  sourcePdfSha256: "7a2b753cf8d6f329d5fad750dc2de510f723876cac6aa41a4076f0343a7a62c4",
  pageCount: 58,
  manuallyCheckedPages: 10,
  remainingWork:
    "Manually transcribe and review PDF pages 11–58, including all specification columns, tables, eighty-three examples, both claims, and both correction-certificate copies; then author non-lossy paragraph companions and source-derived figure references.",
  legacyDraft: kwolekKevlarArchivalEdition,
  legacyParallelReadings: legacyKwolekKevlarUnpublishedParallelReadings,
} as const;
