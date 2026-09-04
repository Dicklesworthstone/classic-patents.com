/**
 * Hand-authored source face for US 2,929,922, Masers and Maser Communications
 * System. The pinned facsimile has one drawing sheet with Figures 1–3 and
 * eleven claims. Obsolete Figure 4/5 files remain on disk as research evidence
 * and are deliberately not linked here.
 */
import type { CuratedSpecificationEdition, CuratedSpecificationInline } from "@/types/patent";

const text = (value: string): CuratedSpecificationInline => ({ kind: "text", text: value });
const term = (value: string, definition: string): CuratedSpecificationInline => ({
  kind: "term",
  text: value,
  definition,
});
const PREVIEWS = {
  1: {
    src: "/patents/figures/us-2929922-townes-laser/sheet-1-1.png",
    width: 2320,
    height: 3408,
    alt: "Complete source drawing sheet containing Figures 1 through 3",
  },
  2: {
    src: "/patents/figures/us-2929922-townes-laser/sheet-1-1.png",
    width: 2320,
    height: 3408,
    alt: "Complete source drawing sheet containing Figures 1 through 3",
  },
  3: {
    src: "/patents/figures/us-2929922-townes-laser/sheet-1-1.png",
    width: 2320,
    height: 3408,
    alt: "Complete source drawing sheet containing Figures 1 through 3",
  },
} as const;
const figure = (number: 1 | 2 | 3): CuratedSpecificationInline => ({
  kind: "reference",
  text: `Fig. ${number}`,
  href: `#fig-${number}`,
  referenceType: "figure",
  label: `Figure ${number} on the complete source drawing sheet`,
  figurePreviews: [PREVIEWS[number]],
});
const p = (...inlines: CuratedSpecificationInline[]) => ({ kind: "paragraph" as const, inlines });
const claim = (number: number, body: string) => ({
  kind: "claim" as const,
  number,
  inlines: [text(`${number}. ${body}`)],
});

export const townesLaserArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "0c67f2d45609a1d465f75530c733c7c2feffb87994fa62392cf79f7e737d9270",
  preparedBy: "Classic Patents editorial agent (GPT-5.6 Luna)",
  preparedAt: "2026-08-21",
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
        "Application July 30, 1958, Serial No. 752,137",
        "11 Claims. (Cl. 250–7)",
      ],
    },
    { kind: "heading", level: 2, text: "SPECIFICATION" },
    p(
      text(
        "This invention relates to the generation and amplification of infrared, visible, and ultraviolet waves, and more particularly to the generation and amplification of such waves by means of devices including media in which the stimulated emission of radiation occurs; devices of this type are now generally termed masers.",
      ),
    ),
    p(
      text("It is characteristic of a "),
      term(
        "maser",
        "A device whose active medium is driven into a nonequilibrium population distribution so an applied signal stimulates amplified radiation.",
      ),
      text(
        " that it employs a medium in which there is established at least intermittently a nonequilibrium population distribution in a pair of spaced energy levels of its energy level system. In particular, the population of the higher of the selected pair of energy levels may be made larger than that of the lower. It is now usual to describe a medium which is in such a state of nonequilibrium as exhibiting a negative temperature. It is known that a competing process known as relaxation tends to return the system to equilibrium.",
      ),
    ),
    p(
      text(
        "It is characteristic that if there be applied to a medium which is in a negative temperature state a signal of a frequency which satisfies Planck’s law with respect to the two energy levels which are in nonequilibrium, where h is Planck’s constant, then the applied signal will stimulate the emission of radiation at the signal frequency from the medium and the signal will be amplified.",
      ),
    ),
    p(
      text(
        "Among the more promising forms of masers known is one which employs as the negative temperature medium a material whose energy level system is characterized by at least three energy levels, with the separations of these three energy levels falling within desired operating frequency ranges. To this material, there is supplied pumping power which effects transitions from the lowest to the highest of the selected three energy levels. By power saturation of the highest energy level, whereby the populations of the highest and lowest energy levels tend to be equalized, there is established in one of these two energy levels a nonequilibrium population distribution with respect to the intermediate energy level of the selected three, whereby a negative temperature results in the material. Thereafter a signal of appropriate frequency can be amplified by being applied thereto in a manner such that the emission of radiation is stimulated therefrom.",
      ),
    ),
    p(
      text(
        "It is to be noted that the process of relaxation from randomly overpopulated states may give rise to spontaneous emission, that is, emission caused by radiative transitions in a mode other than the desired or stimulated one.",
      ),
    ),
    p(
      text(
        "Generators and amplifiers employing atomic and molecular processes, as do the various known varieties of masers, may in principle be extended in operation far beyond the range of frequencies which have been generated and amplified by electronic processes. As, however, the maser concept is applied to the translation of wavelengths in the infrared, visible, and ultraviolet regions of the electromagnetic wave spectrum, it is found that conventional or microwave maser techniques and structures are suitable neither for the generation of monochromatic radiation nor to provide coherent amplification.",
      ),
    ),
    p(
      text(
        "Accordingly, an object of the present invention is a system, including a maser, for translating infrared, visible, and ultraviolet energy. A maser designed for operation in the microwave range of the spectrum might, for example, comprise a cavity having therein an ensemble of atomic or molecular systems, the cavity being characterized by being able to support only one mode near the frequency which corresponds to the desired radiative transitions of the systems. Alternatively, such an ensemble might be located in a waveguide, which similarly would be characterized by one, or a very few, preferred modes of propagation in the frequency range of interest.",
      ),
    ),
    p(
      text(
        "The energy emitted by a maser operating in the microwave range is typically monochromatic, due to the energy produced by stimulated emission being very much larger than the background of radiation caused by spontaneous emission. Such devices are inherently monochromatic because stimulated emission provides completely coherent amplification, and spontaneous emission, which is not so coherent, is characteristically small by comparison with the stimulated emission.",
      ),
    ),
    p(
      text(
        "A maser cavity operating at frequencies above those in the microwave range requires an impractically small cavity structure, of the order of one wavelength, and/or a high and not easily realizable density of pumping power. Cavities which are large compared to a wavelength are accordingly capable of supporting a large number of modes within the frequency ranges of interest. A disadvantage of this approach is that masers including such cavities must be operated at relatively high power levels in order that the emission stimulated therefrom be at least as large as that spontaneously emitted therefrom.",
      ),
    ),
    p(
      text(
        "Another object of this invention is a practically realizable, efficient, low-noise maser structure which is capable of the generation of monochromatic radiation, or coherent amplification, in the infrared, visible, and ultraviolet portions of the electromagnetic spectrum.",
      ),
    ),
    p(
      text(
        "The above and other objects of the present invention are realized in an illustrative embodiment wherein a negative temperature medium is disposed between two spaced parallel reflecting plates in a configuration which is of practical size and which may be pumped by readily available power sources, and wherein a single mode corresponding to the stimulated emission can be effectively isolated.",
      ),
    ),
    p(
      text(
        "More particularly, one specific illustrative embodiment of the present invention comprises a maser including a chamber having reflective parallel end plates and side members. Positioned within the chamber is a negative temperature medium, which is pumped by an energy source disposed about the chamber. The side walls are transparent to the pumping energy and either transparent to or absorptive of other energy radiated thereat. Further, an optical configuration is arranged adjacent to one of the end plates of the chamber for isolating the one mode of those supported within the chamber which it is desired to selectively utilize.",
      ),
    ),
    p(
      text(
        "The principles of the present invention may illustratively be embodied in a communications system which comprises a maser device capable of generating monochromatic radiation, a second maser device capable of modulating and coherently amplifying the output of the maser generator, and a device for detecting the output of the second maser. Alternatively, such a system may include a maser generator whose output is modulated by a nonamplifying device, or a system in which the maser generator itself is modulated.",
      ),
    ),
    p(
      text(
        "Thus, a feature of the present invention is a system for communicating information by means of energy having wavelengths in the infrared, visible, or ultraviolet portions of the electromagnetic spectrum, comprising a monochromatic generator, a modulatable coherent amplifier, and a detector.",
      ),
    ),
    p(
      text(
        "Another feature of this invention is a maser generator including a chamber comprising reflective parallel end members and side members, a negative temperature medium within said chamber, a pumping power source disposed about the side members, the side members being transparent to the pumping energy and either transparent to or absorptive of other energy radiated thereat, and a configuration arranged adjacent to one of the end members for abstracting from the chamber a selected one of the modes supported therein, whereby there is provided efficient, low-noise, monochromatic generation of infrared, visible, or ultraviolet waves.",
      ),
    ),
    p(
      text(
        "A further feature of the present invention is a maser amplifier including a chamber comprising reflective parallel end members and side members, a negative temperature medium within said chamber, a pumping power source disposed about the side members, the side members being transparent to the pumping energy and nonreflective of other energy radiated thereat, and a configuration arranged adjacent to one of the end members for abstracting from the chamber an amplified replica of a wave fed through the other end member thereof, whereby there is provided an efficient, low-noise, coherent amplifier of infrared, visible, or ultraviolet waves.",
      ),
    ),
    p(
      text(
        "A still further feature of this invention is an arrangement for modulating the signal output of a maser of the type herein described comprising a structure for establishing a magnetic field parallel to the longitudinal axis of the chamber thereof, and an information source capable of varying the magnetic field in correspondence with the output of the source.",
      ),
    ),
    p(
      text(
        "The principles of the present invention will be better understood from the following more detailed discussion taken in conjunction with the accompanying drawing, in which ",
      ),
      figure(1),
      text(
        " is a block diagram of a communications system illustratively embodying aspects of the principles of the present invention; ",
      ),
      figure(2),
      text(
        " is a perspective view of a generator made in accordance with the principles of this invention; and ",
      ),
      figure(3),
      text(
        " is a perspective view of an amplifier embodying the principles of the present invention. Also, ",
      ),
      figure(3),
      text(
        " depicts a modulating source and a detector, arranged in typical relationship, to the amplifier.",
      ),
    ),
    p(
      text("Referring now to "),
      figure(1),
      text(
        ", there is shown a communications system in which the principles of the present invention are illustratively embodied. The system includes a generator or oscillator 10, a modulating source 11, a modulated amplifier 12, and a detector 13.",
      ),
    ),
    p(
      text("The generator 10, which is shown in detail in "),
      figure(2),
      text(
        ", includes a chamber 14, which typically may be about one centimeter in diameter and ten centimeters in length. The chamber 14 comprises a hollow cylinder 15 having its ends capped by two flat parallel assemblies 16 and 17. Disposed within the chamber 14 is a negative temperature material whose radiative energy level separations correspond to frequencies in the infrared, visible, and ultraviolet ranges.",
      ),
    ),
    p(
      text(
        "Various materials are suitable for use as the active or negative temperature medium of maser devices of the general type described herein. For example, vapors of the alkali metals, namely lithium, sodium, potassium, rubidium, and cesium, and some solid rare earth salts, for example anhydrous chlorides of europium and samarium, may be so used. In particular, potassium maintained at a temperature of about 435 degrees Kelvin, at which temperature it exhibits a vapor pressure of about 0.001 millimeter, may advantageously be included in a specific illustrative embodiment of the principles of the present invention as the active medium thereof.",
      ),
    ),
    p(
      text("Each of the flat parallel assemblies 16 and 17 of the device shown in "),
      figure(2),
      text(
        " advantageously includes a material which reflects most of the energy incident thereupon. An assembly comprising sapphire with a coating of gold, typically about 500 angstrom units thick, on the outer surface of the sapphire member may be included in specific embodiments. Such an assembly exhibits 97 percent reflectivity, 2 percent absorptivity, and 1 percent transmissivity to wavelengths in the infrared range.",
      ),
    ),
    p(
      text(
        "The cylinder 15 of the chamber 14 is advantageously of a material which is transparent to the pumping energy and either transparent to or absorptive of other radiation impinging thereupon, thereby both to allow the negative temperature medium within the cylinder 15 to be pumped and to eliminate from the chamber radiation occurring in all modes except those corresponding to waves which travel back and forth between the reflective assemblies 16 and 17. These reflected modes are coupled much more strongly to the excited atomic systems of the negative temperature medium than any other modes and hence would be strongly favored for maser oscillations.",
      ),
    ),
    p(
      text(
        "In those specific embodiments in which the negative temperature medium within the chamber 14 is at a pressure other than atmospheric, as in the case of potassium vapor, it is advantageous to support the chamber 14 by spacer elements 18 within a protective shell 19, typically of glass, within which shell a pressure approximately equal to that within the chamber 14 is maintained. In this manner, the resultant forces acting on the opposing faces of the end assemblies 16 and 17 are made small.",
      ),
    ),
    p(
      text("Mode selection in the maser generator shown in "),
      figure(2),
      text(
        " is based on the phenomenon that, when energy is radiated from a chamber through an end plate member which is large compared to the wavelength of the characteristic radiation, each point in the focal plane thereof corresponds to a mode of a particular direction, affording thereby a separation of modes. If radiation falling on a very limited area in the focal plane is detected, that radiation will represent spontaneous and stimulated emission from a selected and limited number of modes, the large background of spontaneous emission produced in other modes being thereby effectively isolated.",
      ),
    ),
    p(
      text(
        "Radiation in the desired mode is transmitted through the end assembly 17 and focused by a double-convex lens 23 arranged such that the desired energy is directed through an aperture 24 in an absorptive sheet 25 which lies in the focal plane of the lens 23. A second double-convex lens 26 is employed to reconvert the selected energy to the form of a plane wave, in which form the desired energy radiates to the modulated amplifier 12.",
      ),
    ),
    p(
      text("The maser amplifier shown in "),
      figure(3),
      text(
        " is similar in structure to the generator described above. The amplifier includes a chamber 14 comprising a hollow cylinder 15 supported within a protective shell 19 by supporting members 18 and within which cylinder a suitable negative temperature medium is disposed. Arranged about the protective shell 19 is a pumping power assembly 30, which may advantageously comprise a potassium lamp formed in the shape of a spiral, energized by a source 31.",
      ),
    ),
    p(
      text(
        "Energy directed from the generator 10 through the left-hand end of the cylinder 15 of the amplifying device of ",
      ),
      figure(3),
      text(
        " may be modulated by an assembly including a coil 32 for establishing a magnetic field parallel to the longitudinal axis of the cylinder 15 and a source 11 for varying the strength of the longitudinal magnetic field, whereby broadening or splitting of the spectral lines emitted by the device 12 results, a phenomenon generally termed the Zeeman effect.",
      ),
    ),
    p(
      text("The device 12 shown in "),
      figure(3),
      text(
        " radiates through the right-hand end of the cylinder 15 an amplified counterpart of the energy directed at the device 12 by the generator 10. The radiated energy is directed by two lenses 33 and 36 through an aperture 34 in an absorptive member 35 and to a detector 13. The detector 13 may, for example, include a photomultiplier tube.",
      ),
    ),
    p(
      text(
        "It is noted that the admission of a signal into the region between the two end parallel plates of the amplifying device 12 is similar to the process involved in a microwave cavity. The partially reflecting surfaces of the end plates are analogous to coupling holes; if a monochromatic plane wave strikes the outside of one partially reflecting surface, energy will build up between the plates, and the relations between input wave, cavity energy, and output wave correspond to those for a microwave impinging on an appropriate cavity with input and output coupling holes.",
      ),
    ),
    p(
      text(
        "Thus, the principles may be embodied in monochromatic maser generators of infrared, visible, or ultraviolet wavelengths. It is feasible to tune such generators by varying the pressure or temperature of the negative temperature media. Alternatively, tuning may be based on the Stark effect. Maser devices embodying these principles may advantageously be utilized in spectroscopy and measurement applications, as well as in communications.",
      ),
    ),
    p(
      text(
        "The various specific embodiments herein described are merely illustrative of the general principles of the invention. Although the amplifying chamber 14 has been shown as a hollow cylinder, any other transparent structure suitable for retaining the negative temperature medium and including reflective end assemblies may be substituted therefor.",
      ),
    ),
    { kind: "heading", level: 2, text: "CLAIMS" },
    claim(
      1,
      "A communications system for operation in the infrared, visible, or ultraviolet regions of the electromagnetic wave spectrum comprising a monochromatic maser generator, a coherent modulated maser amplifier, a modulating source, and a detector; said generator comprising a chamber having end reflective parallel members and transparent side members, a negative temperature medium disposed within said chamber, and means arranged about said chamber for pumping said medium; said amplifier comprising a chamber having end reflective parallel members and transparent side members, a negative temperature medium disposed within said chamber, means arranged about said chamber for pumping said medium, and coupling means for abstracting from one end of said chamber an amplified counterpart of the energy transmitted into the other end thereof and for directing said amplified counterpart at said detector.",
    ),
    claim(
      2,
      "A communications system for operation in the infrared, visible or ultraviolet regions of the electromagnetic wave spectrum comprising a monochromatic maser generator, a coherent maser amplifier, said generator and amplifier including means for modulating the output of said generator in accordance with signal information, and a detector; said generator comprising a chamber having a length which is substantially greater than its transverse dimension and having partially reflective parallel end members and nonreflective side members, a negative temperature medium disposed within said chamber and characterized by at least three distinct energy levels, two of which have a separation in the frequency range of interest, means for pumping said medium so that a population inversion is produced therein between said two separated energy levels, and means for abstracting from said chamber and directing at the amplifier input the energy of a particular mode of electromagnetic vibration; said amplifier comprising a chamber having a length which is substantially greater than its transverse dimension and having partially reflective parallel end members and nonreflective side members, a negative temperature medium disposed within said chamber and characterized by at least three distinct energy levels, two of which have a separation in the frequency range of interest, means for pumping said medium so that a population inversion is produced therein between said two separated energy levels, means for abstracting from said chamber the energy of a particular mode of electromagnetic vibration representing an amplified and modulated replica of the generator output, and means for directing said replica at said detector.",
    ),
    claim(
      3,
      "A communications system for operation in the infrared, visible or ultraviolet regions of the electromagnetic wave spectrum comprising a monochromatic maser generator, a coherent modulated maser amplifier, a modulating source and a detector, said amplifier including means for establishing a magnetic field parallel to the longitudinal axis of said chamber, said modulating source being coupled to said magnetic means, the radiative output of said generator being directed at said amplifier, and the radiative output of said amplifier, constituting an amplified and modulated counterpart of the radiative output of said generator, being directed at said detector.",
    ),
    claim(
      4,
      "A maser generator comprising a chamber having reflective parallel end members and side members, a negative temperature medium disposed within said chamber, means arranged about said chamber for pumping said medium, said side members being transparent to the pumping energy and transparent to or absorptive of other energy radiated thereat.",
    ),
    claim(
      5,
      "A maser generator for operation in the infrared, visible or ultraviolet regions of the electromagnetic wave spectrum comprising a chamber having a length which is substantially greater than its transverse dimension and having partially reflective parallel end members and nonreflective side members, a negative temperature medium disposed within said chamber and characterized by at least three distinct energy levels, two of which have a separation in the frequency range of interest, means for pumping said medium so that a population inversion is produced therein between said two separated energy levels, and means for abstracting from said chamber and directing at an amplifier input the energy of a particular mode of electromagnetic vibration.",
    ),
    claim(
      6,
      "A maser generator as in claim 5 wherein said mode selecting means includes an absorptive member having an opening therethrough, said absorptive member being positioned adjacent to one end of said chamber, and means for directing a selected portion of the energy radiated by said generator through said opening.",
    ),
    claim(
      7,
      "A maser generator as in claim 5 wherein said negative temperature medium comprises potassium, and said pumping means comprises an assembly of potassium lamps.",
    ),
    claim(
      8,
      "A maser amplifier comprising a chamber having end reflective parallel members and side members, a negative temperature medium disposed within said chamber, means arranged about said chamber for pumping said medium, said side members being transparent to the pumping energy and non-reflective of other energy radiated thereat, and coupling means for abstracting from one end of said chamber an amplified counterpart of the energy directed into the other end thereof.",
    ),
    claim(
      9,
      "A maser amplifier for operation in the infrared, visible or ultraviolet regions of the electromagnetic wave spectrum comprising a chamber having a length which is substantially greater than its transverse dimension and having partially reflective parallel end members and nonreflective side members, a negative temperature medium disposed within said chamber and characterized by at least three distinct energy levels, two of which have a separation in the frequency range of interest, means for pumping said medium so that a population inversion is produced therein between said two separated energy levels, and means for abstracting from said chamber and directing at a detector the energy of a particular mode of electromagnetic vibration.",
    ),
    claim(
      10,
      "A maser amplifier as in claim 9 wherein said negative temperature medium comprises potassium, and said pumping means comprises an assembly of potassium lamps.",
    ),
    claim(
      11,
      "A modulated maser amplifier comprising a chamber having end reflective parallel members, a negative temperature medium disposed within said chamber, means arranged about said chamber for pumping said medium, means coupled to and under the control of a modulating source for establishing a magnetic field parallel to the longitudinal axis of said chamber, and means for abstracting from one end of said chamber an amplified counterpart of the energy directed into the other end thereof, which counterpart is modulatable in accordance with the output of said source.",
    ),
  ],
};

/** Claim text is sourced dynamically from the edition, never duplicated in the record. */
export function manualTownesClaimText(claimNumber: number): string {
  const block = townesLaserArchivalEdition.blocks.find(
    (candidate) => candidate.kind === "claim" && candidate.number === claimNumber,
  );
  if (block?.kind !== "claim")
    throw new Error(`Townes archival edition is missing claim ${claimNumber}.`);
  return block.inlines.map((inline) => inline.text).join("");
}

/** Complete hand-authored companion readings, keyed by paragraph block index. */
export const townesLaserParallelReadings: Readonly<Record<number, readonly string[]>> = {
  2: [
    "The opening identifies the invention as generation and amplification of infrared, visible, and ultraviolet waves by media in which stimulated emission occurs.",
  ],
  3: [
    "The specification defines a maser through a nonequilibrium population between spaced energy levels, with negative temperature describing the higher population and relaxation opposing it.",
  ],
  4: [
    "A signal satisfying the transition relation for the selected energy levels stimulates radiation at that signal frequency, so the negative-temperature medium amplifies it.",
  ],
  5: [
    "The three-level arrangement pumps atoms from the lowest to the highest state, saturates the high state, and leaves the required nonequilibrium population relative to the intermediate state.",
  ],
  6: [
    "Relaxation can cause spontaneous radiation in modes other than the desired stimulated mode, creating background that the maser structure must isolate.",
  ],
  7: [
    "Atomic and molecular masers could reach shorter wavelengths, but microwave structures did not directly provide monochromatic radiation or coherent optical amplification.",
  ],
  8: [
    "The invention therefore seeks a system including a maser that translates energy into the infrared, visible, and ultraviolet portions of the spectrum.",
  ],
  9: [
    "Microwave maser cavities and waveguides support one or a few preferred modes, which makes stimulated radiation dominate the less coherent spontaneous background.",
  ],
  10: [
    "At higher frequencies a cavity of wavelength dimensions is impractically small, while a large cavity supports many modes and requires excessive pumping power.",
  ],
  11: [
    "The inventors state the practical objective: an efficient, low-noise maser for monochromatic generation or coherent amplification in the short-wavelength bands.",
  ],
  12: [
    "The proposed embodiment puts a negative-temperature medium between practical parallel reflectors, pumps it with available sources, and isolates one stimulated mode.",
  ],
  13: [
    "The communication arrangement may use a monochromatic generator, a second maser for coherent modulation and amplification, and a detector, with modulation in either device.",
  ],
  14: [
    "A stated feature is communicating information on infrared, visible, or ultraviolet energy with a monochromatic generator, a modulatable coherent amplifier, and a detector.",
  ],
  15: [
    "The generator feature combines reflective parallel ends, pumped medium, transparent or absorptive sides, and adjacent mode-selection structure for low-noise monochromatic output.",
  ],
  16: [
    "The amplifier feature uses pumped medium and nonreflective sides to extract an amplified wave replica, while a longitudinal magnetic field provides source-controlled modulation.",
  ],
  17: [
    "The drawing sheet is introduced as three figures: a communications system, a maser generator, and a maser amplifier with its modulating source and detector.",
  ],
  18: [
    "Figure 1’s system contains generator or oscillator 10, modulating source 11, modulated amplifier 12, and detector 13 in the claimed communications relationship.",
  ],
  19: [
    "Figure 2’s generator uses a roughly one-centimeter-diameter, ten-centimeter-long chamber, a hollow cylinder, parallel end assemblies, and a negative-temperature active material.",
  ],
  20: [
    "The source lists alkali vapors and rare-earth salts as possible media and identifies potassium near 435 Kelvin as a useful illustrative active medium.",
  ],
  21: [
    "The generator’s parallel end assemblies can use reflective sapphire with a gold coating, and the source records the resulting infrared reflectivity, absorption, and transmission.",
  ],
  22: [
    "The cylinder passes pumping energy while transmitting or absorbing other radiation, favoring modes that travel back and forth between the reflective assemblies.",
  ],
  23: [
    "For a sub-atmospheric medium such as potassium vapor, spacers and a protective shell keep pressures balanced and reduce forces on the parallel end assemblies.",
  ],
  24: [
    "Figure 2 selects modes by mapping propagation direction to focal-plane position; a small detected area therefore isolates a limited set of stimulated and spontaneous modes.",
  ],
  25: [
    "The selected generator radiation passes the end assembly, is focused through an aperture in an absorptive sheet, and is recollimated by a second lens toward amplifier 12.",
  ],
  26: [
    "Figure 3 applies the chamber arrangement to an amplifier and places a pumping assembly around its protective shell, including a spiral potassium lamp embodiment.",
  ],
  27: [
    "A coil and information source vary a magnetic field along the amplifier cylinder, broadening or splitting its spectral lines through the Zeeman effect.",
  ],
  28: [
    "The amplifier sends an amplified counterpart through lenses and an absorptive aperture to detector 13, which may be a photomultiplier tube.",
  ],
  29: [
    "Partially reflecting end surfaces act like microwave coupling holes: an incoming monochromatic plane wave builds energy between the plates and an output wave emerges.",
  ],
  30: [
    "The devices may be tuned by changing pressure or temperature, or by the Stark effect, and the same maser principles serve spectroscopy and measurement as well as communications.",
  ],
  31: [
    "The specific cylinder is illustrative; another transparent retaining structure with reflective end assemblies can retain the medium and pass or absorb the relevant radiation.",
  ],
  32: [
    "The closing specification keeps the disclosed chamber as an example rather than a limitation, allowing another transparent retaining structure with the same reflective-end and pumping functions.",
  ],
  33: [
    "The source then proceeds to its eleven numbered claims, which state the communications system, generator, amplifier, mode selector, potassium pump, and magnetic modulation combinations.",
  ],
};
