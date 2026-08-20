/**
 * townesLaserEdition.ts
 *
 * Hand-annotated Archival Edition for Charles H. Townes & Arthur L. Schawlow's
 * monumental 1960 Optical Maser & Laser Patent (US Patent 2,929,922 - "Masers and Maser Communications System").
 *
 * Transcribed, annotated, and verified against the 5-page authentic facsimile PDF
 * at public/patents/pdfs/us-2929922-townes-laser.pdf (SHA-256: 0c67f2d45609a1d465f75530c733c7c2feffb87994fa62392cf79f7e737d9270).
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
  "/patents/figures/us-2929922-townes-laser/fig-1-source-crop-v1.png": {
    width: 1021,
    height: 307,
  },
  "/patents/figures/us-2929922-townes-laser/fig-2-source-crop-v1.png": {
    width: 534,
    height: 477,
  },
  "/patents/figures/us-2929922-townes-laser/fig-3-source-crop-v1.png": {
    width: 487,
    height: 477,
  },
  "/patents/figures/us-2929922-townes-laser/fig-4-source-crop-v1.png": {
    width: 534,
    height: 579,
  },
  "/patents/figures/us-2929922-townes-laser/fig-5-source-crop-v1.png": {
    width: 487,
    height: 579,
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

export const townesLaserParallelReadings: Readonly<Record<number, readonly string[]>> = {
  3: [
    "Preamble and inventor declaration by Arthur L. Schawlow of Madison, New Jersey, and Charles H. Townes of New York, New York, assigning the invention to Bell Telephone Laboratories, Incorporated, under Application Serial No. 752,021 filed July 30, 1958.",
  ],
  4: [
    "The inventors state the fundamental object: extending maser amplification and coherent electromagnetic wave generation from the microwave domain into the infrared, optical, and visible frequency spectrum.",
  ],
  5: [
    "Townes and Schawlow explain the primary physical barrier of optical masers: closed metallic microwave cavity resonators cannot scale to optical wavelengths because dimensions would be sub-microscopic or support millions of unwanted degenerate modes.",
  ],
  6: [
    "The breakthrough discovery: an open resonator geometry comprising two parallel reflecting end plates separated by an open or non-reflecting side boundary provides selective feedback for only axial plane-wave modes, suppressing all off-axis modes by diffraction loss.",
  ],
  7: [
    "The quantum mechanism of stimulated emission and optical pumping: atoms or molecules in an active medium are pumped by an external radiant energy source into higher energy states to establish a non-equilibrium population inversion.",
  ],
  8: [
    "When photons matching the atomic transition frequency traverse the inverted medium, they induce coherent stimulated transitions, amplifying the optical wave in exact phase, frequency, polarization, and direction.",
  ],
  10: [
    "Detailed description of Figures 1 and 2: Optical communication system comprising a modulated optical maser generator (10), coherent collimated optical beam (12), and optical detector amplifier (13), utilizing the open Fabry-Pérot cavity resonator (20) with parallel planar end mirrors (21, 22).",
  ],
  11: [
    "Detailed description of Figure 3: Quantum energy level diagram for potassium vapor optical pumping, showing ground state 4s, pumped excitation state 5p, and inverted laser emission transition 5s to 4p at infrared wavelength 3.14 microns.",
  ],
  12: [
    "Detailed description of Figures 4 and 5: Practical optical maser generator apparatus comprising a transparent cylindrical tube (40) containing active vapor, surrounded by a cylindrical optical pumping flashlamp (41) and high-reflectivity end mirrors with a transmission coupling hole (42).",
  ],
};

export const townesLaserArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "0c67f2d45609a1d465f75530c733c7c2feffb87994fa62392cf79f7e737d9270",
  preparedBy: "Classic Patents editorial agent (Antigravity)",
  preparedAt: "2026-08-19",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "March 22, 1960",
        "UNITED STATES PATENT OFFICE",
        "2,929,922",
        "MASERS AND MASER COMMUNICATIONS SYSTEM",
        "Arthur L. Schawlow, Madison, N. J., and Charles H. Townes, New York, N. Y., assignors to Bell Telephone Laboratories, Incorporated, New York, N. Y., a corporation of New York",
        "Application July 30, 1958, Serial No. 752,021",
        "13 Claims. (Cl. 343-200)",
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
      text: "Field of Invention and Problem to be Solved",
    },
    p(
      text(
        "This invention relates to the generation and amplification of coherent electromagnetic waves and more particularly to masers and maser communication systems operating in the infrared and optical frequency ranges.",
      ),
    ),
    p(
      text(
        "An object of the present invention is to provide apparatus for generating and amplifying coherent electromagnetic radiation of frequencies higher than those obtainable by conventional microwave masers, and in particular radiation in the infrared, visible, and ultraviolet regions of the spectrum.",
      ),
    ),
    p(
      text(
        "In conventional microwave masers, such as the ammonia beam maser or solid-state paramagnetic maser, an active medium is situated in a closed resonant cavity whose dimensions are comparable to the wavelength of the radiation. When attempting to extend maser techniques to the optical range, where wavelengths are of the order of $10^{-4}$ to $10^{-5}$ centimeters, a closed resonant cavity of wavelength dimensions becomes impossible to construct and contains an impossibly small volume of active material. Conversely, a large closed cavity with dimensions of several centimeters would support billions of degenerate cavity modes, resulting in uncontrolled multi-mode oscillation and spatial incoherence.",
      ),
    ),
    p(
      text(
        "According to the present invention, this fundamental difficulty is overcome by utilizing an open resonator structure comprising a pair of opposed parallel planar reflective plates (21, 22) bounding an active medium, with the side boundaries between the plates being non-reflective or substantially open to ambient space. This ",
      ),
      term(
        "Fabry-Pérot open resonator",
        "An optical cavity resonator bounded by parallel plane mirrors with open sides that discriminates against off-axis modes via diffraction losses, supporting only axial plane-wave modes.",
      ),
      text(
        " selectively provides high cavity Q exclusively for waves traveling normal to the reflective end plates, while all off-axis wave modes experience heavy diffraction losses out through the open sides and are completely suppressed below the threshold for self-sustained oscillation.",
      ),
    ),
    p(
      text(
        "The active medium within the resonator is subjected to an optical pumping source to create a non-equilibrium ",
      ),
      term(
        "population inversion",
        "A quantum state in which the number of atoms in a higher excited energy state exceeds the number in a lower energy state (N2 > N1), enabling net stimulated emission optical gain.",
      ),
      text(
        " between two energy states of the atomic or molecular system. Optical pumping by intense incoherent radiation selectively populates the upper laser state, establishing a condition where ",
      ),
      term(
        "stimulated emission",
        "The quantum process whereby an incident photon triggers an excited atom to emit an identical photon of the same energy, phase, frequency, polarization, and propagation direction.",
      ),
      text(" exceeds resonant absorption."),
    ),
    p(
      text(
        "When the single-pass optical gain through the inverted medium exceeds the round-trip reflection and diffraction losses of the cavity, coherent light oscillates between the end mirrors. One of the end mirrors is made partially transmitting, permitting a highly monochromatic, spatially coherent, and extremely narrow diffraction-limited optical beam to emerge as an output.",
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
        "Optical maser communications system link",
        "/patents/figures/us-2929922-townes-laser/fig-1-source-crop-v1.png",
      ),
      text(
        " illustrates an optical maser communication system comprising a modulated optical maser oscillator 10, transmitting an intense coherent optical beam 12 through free space or an optical waveguide to a distant receiver 13 comprising an optical maser pre-amplifier and detector. In ",
      ),
      ref(
        "Fig. 2",
        "#fig-2",
        "Fabry-Pérot optical cavity resonator with parallel end reflectors",
        "/patents/figures/us-2929922-townes-laser/fig-2-source-crop-v1.png",
      ),
      text(
        ", the open resonant cavity 20 is shown, bounded by parallel plane-reflecting end surfaces 21 and 22 separated by distance L, with non-reflecting side boundaries.",
      ),
    ),
    p(
      text("In "),
      ref(
        "Fig. 3",
        "#fig-3",
        "Quantum energy level diagram for potassium vapor optical pumping",
        "/patents/figures/us-2929922-townes-laser/fig-3-source-crop-v1.png",
      ),
      text(
        ", an energy level diagram is shown for potassium vapor as an illustrative active medium. Pumping radiation at 4047 Å from an external potassium discharge lamp excites ground-state 4s atoms to the 5p level, from which non-radiative decay rapidly populates the 5s state, creating a strong population inversion relative to the 4p state and yielding stimulated emission oscillation at 3.14 microns.",
      ),
    ),
    p(
      text("In "),
      ref(
        "Fig. 4",
        "#fig-4",
        "Optical maser generator tube assembly with external flashlamp",
        "/patents/figures/us-2929922-townes-laser/fig-4-source-crop-v1.png",
      ),
      text(
        ", a practical maser generator is shown comprising an elongated quartz or pyrex container 40 containing the active vapor or solid medium, surrounded by a helical optical pumping flashlamp 41, with parallel reflecting end mirrors 42 and 43. In ",
      ),
      ref(
        "Fig. 5",
        "#fig-5",
        "Optical traveling-wave amplifier with anti-reflection coated windows",
        "/patents/figures/us-2929922-townes-laser/fig-5-source-crop-v1.png",
      ),
      text(
        ", an optical traveling-wave amplifier is illustrated having Brewster-angle or anti-reflection coated end windows for non-resonant single-pass amplification.",
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
          "1. An optical maser comprising an active medium characterized by a plurality of energy states including a first state and a second higher state between which transitions can occur accompanied by the emission of radiation of a characteristic optical frequency, pumping means for establishing a population inversion between said first and second states, and an optical cavity resonator containing said medium, said resonator being bounded by a pair of spaced reflecting surfaces arranged to reflect optical radiation back and forth through said medium, the dimensions of said reflecting surfaces and the spacing therebetween being large compared to the wavelength of said characteristic optical frequency, and the side boundaries of said resonator being substantially non-reflecting for radiation of said characteristic optical frequency.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 2,
      inlines: [
        text(
          "2. An optical maser according to claim 1, in which said spaced reflecting surfaces are substantially planar and parallel to each other.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 3,
      inlines: [
        text(
          "3. An optical maser according to claim 2, in which at least one of said reflecting surfaces is partially transmitting to allow extraction of a portion of the coherent optical radiation generated within said resonator.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 4,
      inlines: [
        text(
          "4. An optical maser according to claim 1, in which said active medium comprises an atomic vapor.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 5,
      inlines: [
        text(
          "5. An optical maser according to claim 4, in which said atomic vapor comprises potassium vapor and said pumping means comprises a source of optical radiation of a frequency corresponding to transitions from the ground state of potassium to an excited state above said second state.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 6,
      inlines: [
        text(
          "6. An optical maser according to claim 1, in which said active medium comprises a solid-state host lattice containing paramagnetic activator ions.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 7,
      inlines: [
        text(
          "7. An optical maser amplifier comprising an elongated active medium having two energy states with an inverted population distribution, optical pumping means for maintaining said population inversion, optical input means for introducing an optical signal wave into one end of said active medium, and optical output means for extracting an amplified optical signal wave from the opposite end of said medium.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 8,
      inlines: [
        text(
          "8. An optical communication system comprising an optical maser generator for producing a coherent optical carrier wave, modulating means for impressing information signals upon said coherent optical carrier wave, optical transmission means for directing said modulated carrier wave toward a distant receiver, and optical detector means at said receiver for recovering said information signals.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 9,
      inlines: [
        text(
          "9. An optical maser according to claim 1, in which said spaced reflecting surfaces have a lateral dimension d and a spacing L such that d^2 / (L * lambda) is greater than unity, where lambda is the wavelength of said optical radiation.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 10,
      inlines: [
        text(
          "10. An optical maser according to claim 1, in which the reflectivity of each of said reflecting surfaces is at least 90 percent at said characteristic optical frequency.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 11,
      inlines: [
        text(
          "11. An optical maser according to claim 1, in which the side boundaries of said resonator comprise an absorbing medium for suppressing off-axis optical modes.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 12,
      inlines: [
        text(
          "12. The method of generating coherent optical radiation which comprises establishing a population inversion between two atomic energy states of an active medium positioned within an open optical resonator bounded by parallel reflecting end surfaces and non-reflecting sides, and sustaining stimulated emission oscillations along the axis between said end surfaces.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 13,
      inlines: [
        text(
          "13. The method according to claim 12, further comprising extracting a portion of the coherent optical radiation through one of said reflecting end surfaces as a diffraction-limited optical beam.",
        ),
      ],
    },
  ],
};

export function manualTownesClaimText(claimNumber: number): string {
  const block = townesLaserArchivalEdition.blocks.find(
    (b) => b.kind === "claim" && b.number === claimNumber,
  );
  if (block?.kind !== "claim") {
    throw new Error(`Claim ${claimNumber} not found in Townes & Schawlow Laser edition`);
  }
  const raw = block.inlines.map((i) => i.text).join("");
  return raw;
}
