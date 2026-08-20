import type {
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

const term = (
  surfaceText: string,
  key: string,
  definition: string,
): CuratedSpecificationInline => ({
  kind: "term",
  text: surfaceText,
  label: key,
  definition,
});

const FIGURE_DIMS: Record<number, { width: number; height: number }> = {
  1: { width: 2000, height: 870 },
  2: { width: 970, height: 600 },
  3: { width: 1030, height: 600 },
  4: { width: 670, height: 600 },
  5: { width: 650, height: 600 },
  6: { width: 680, height: 600 },
  7: { width: 670, height: 600 },
  8: { width: 700, height: 600 },
  9: { width: 630, height: 600 },
  10: { width: 2000, height: 920 },
  11: { width: 1000, height: 800 },
  12: { width: 1000, height: 800 },
  13: { width: 1000, height: 950 },
  14: { width: 1000, height: 500 },
  15: { width: 1000, height: 450 },
  16: { width: 1000, height: 920 },
  17: { width: 1000, height: 920 },
  18: { width: 1000, height: 800 },
  19: { width: 1000, height: 800 },
  20: { width: 670, height: 500 },
  21: { width: 500, height: 650 },
  22: { width: 680, height: 500 },
  23: { width: 2000, height: 500 },
};

function makePreview(
  surfaceText: string,
  figureNumbers: number[],
  altText: string,
): CuratedSpecificationInline {
  return {
    kind: "reference",
    text: surfaceText,
    href: `#figure-${figureNumbers[0]}`,
    referenceType: "figure",
    label: altText,
    figurePreviews: figureNumbers.map((num) => ({
      src: `/patents/figures/us-235199-bell-photophone/fig-${num}-source-crop${num === 21 ? "-v2" : "-v1"}.png`,
      alt: `Figure ${num}: ${altText}`,
      width: FIGURE_DIMS[num]?.width ?? 300,
      height: FIGURE_DIMS[num]?.height ?? 300,
    })),
  };
}

const p = (
  ...inlines: (string | CuratedSpecificationInline)[]
): {
  kind: "paragraph";
  inlines: CuratedSpecificationInlines;
} => ({
  kind: "paragraph",
  inlines: inlines.map((item) => (typeof item === "string" ? { kind: "text", text: item } : item)),
});

export const BELL_PHOTOPHONE_PARALLEL_READINGS: Readonly<Record<number, readonly string[]>> = {
  1: [
    "Formal legal preamble: Alexander Graham Bell of Washington, D.C., assignor to the American Bell Telephone Company of Boston, establishes his master grant for optical wireless signaling and speech communication.",
  ],
  2: [
    "Foundational discovery of the photo-acoustic effect: Bell articulates his breakthrough that nearly all solid, liquid, and gaseous substances emit audible sound when exposed to rapid, undulatory pulsations of radiant energy (light and infrared heat rays).",
  ],
  3: [
    "Physical definition of the radiant carrier: the invention utilizes radiant energy (light, infrared rays, or heat) whose intensity, divergence, or polarization is modulated at the transmitting station to correspond with acoustic sound vibrations.",
  ],
  4: [
    "Overview of the twenty-three patent figures: Fig. 1 full transmitting and receiving photophone system; Fig. 2 ray modulation optical path; Fig. 3 tone-generating siren disk; Figs. 4-7 variable-slat and grid shutters; Figs. 8-9 voice-diaphragm transmitters; Fig. 10 parabolic collector and receiver circuit; Figs. 11-15 cylindrical and flat selenium cells; Figs. 16-23 radial type-metal selenium cells and axial parabolic mounting.",
  ],
  5: [
    "Transmitter optical architecture: condensing lens collects sunlight or artificial light and focuses it upon a voice-actuated flexible mirror or shutter diaphragm, while a second lens collimates the undulatory beam toward the distant receiver.",
  ],
  6: [
    "Flexible mirror diaphragm physics: vocal acoustic pressure alternately flexes the thin mirror between convex and concave curvature, altering beam divergence and modulating the radiant flux density reaching the distant receiver in exact correspondence with sound waves.",
  ],
  7: [
    "Vibrating grid shutter modulators: interlocking opaque and transparent line gratings or Venetian-blind slats actuated by voice diaphragms directly chop or modulate beam amplitude without altering focal alignment.",
  ],
  8: [
    "Vibrating aperture plates: diaphragm-coupled aperture plates intercept the focal point of the ray pencil, varying total transmitted radiant power proportional to speech wave amplitude.",
  ],
  9: [
    "Receiver parabolic flux collector: large silvered parabolic mirror concentrates the distant modulated radiant beam onto an axial selenium photoconductive cell, converting spatial flux into electrical resistance variations.",
  ],
  10: [
    "Photoconductive selenium cell physics: crystalline annealed selenium exhibits electrical resistance that drops rapidly with increasing illumination ($R \\propto E^{-\\gamma}$), modulating current in a local battery circuit to reproduce speech in a telephone receiver.",
  ],
  11: [
    "Cylindrical multi-disc selenium cell: stacking alternating brass conductor disks separated by thin mica insulators provides an expansive surface area with microscopic conduction gap length, drastically reducing cell internal resistance.",
  ],
  12: [
    "Radial fin and cast type-metal construction: interlocking type-metal cores connect alternate disks into parallel interdigital combs, providing maximum optical aperture and uniform heat dissipation.",
  ],
  13: [
    "Direct non-electric photo-acoustic reception: Bell reveals that thin diaphragms of hard rubber, mica, or lampblack directly absorb pulsed radiant heat, producing localized thermal expansion and acoustic pressure waves heard through an ear-tube without any battery or electrical circuit.",
  ],
  14: [
    "Independent utility of constituent inventions: the flexible mirror transmitter, slotted grid shutters, stacked selenium cells, and direct photo-acoustic receivers operate together or in independent optical wireless systems.",
  ],
  34: ["Inventor signature: Alexander Graham Bell."],
  35: ["Attestation of subscribing witnesses: Jos. P. Livermore and Arthur Reynolds."],
};

export const bellPhotophoneParallelReadings = BELL_PHOTOPHONE_PARALLEL_READINGS;

export const bellPhotophoneArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "924fc983c2b53e84e122b7fb84014b5d37cf2461eae4132ea235211364f25e85",
  preparedBy: "Classic Patents Editorial Team",
  preparedAt: "2026-08-19",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE.",
        "ALEXANDER GRAHAM BELL, OF WASHINGTON, DISTRICT OF COLUMBIA, ASSIGNOR TO AMERICAN BELL TELEPHONE COMPANY, OF BOSTON, MASS.",
        'APPARATUS FOR SIGNALING AND COMMUNICATING, CALLED "PHOTOPHONE."',
        "SPECIFICATION forming part of Letters Patent No. 235,199, dated December 7, 1880.",
        "Application filed August 28, 1880. (No model.)",
      ],
    },
    p(
      "To all whom it may concern:\nBe it known that I, ",
      term(
        "ALEXANDER GRAHAM BELL",
        "Alexander Graham Bell",
        "Scottish-born American inventor and scientist (1847–1922) who patented the telephone in 1876 and regarded the Photophone (1880)—the world's first wireless optical communication system—as his greatest invention.",
      ),
      ", of Washington, District of Columbia, have invented certain new and useful Improvements in Apparatus for Signaling and Communicating, called Photophone, of which the following is a specification.",
    ),
    p(
      "In an application for Letters Patent filed by me and Charles Sumner Tainter, of even date herewith, is described an invention based on the discovery that certain substances—such, for example, as ",
      term(
        "selenium",
        "Selenium Photoconductivity",
        "A chemical element whose electrical resistance drops precipitously when illuminated by light rays (photoconductive effect discovered by Willoughby Smith in 1873).",
      ),
      ", gold, silver, platinum, German silver, steel, hard rubber, &c.—when placed in the path of a beam of rays, are affected by variations in the rays falling on them in such a way that if they form part of an electric circuit the resistance of the circuit is varied in accordance with the variations in the rays, and if they are in the form of a plate or diaphragm they emit sound under the influence of an intermittent or undulatory beam of rays.",
    ),
    p(
      "My present invention relates to an apparatus for utilizing radiant energy (such as light, radiant heat, or other rays) for signaling and communicating between distant points, and more especially for the transmission of ",
      term(
        "articulate speech",
        "Articulate Speech Transmission",
        "Transmitting the exact vibrational waveforms and complex harmonics of human speech wirelessly across free space using a modulated beam of light.",
      ),
      " by the agency of such radiant energy.",
    ),
    p(
      "In the accompanying drawings, ",
      makePreview(
        "Figure 1",
        [1],
        "General diagram of transmitting and receiving photophonic apparatus",
      ),
      " is a general diagrammatic view of a transmitting and receiving photophonic apparatus embodying my invention in what I have found to be a simple and effective arrangement; ",
      makePreview("Fig. 2", [2], "Detail of beam modulation path"),
      ", a detail thereof illustrating the path of the rays; ",
      makePreview("Fig. 3", [3], "Transmitting arrangement with slotted siren wheel"),
      ", a view of a modified transmitting arrangement for producing musical tones; ",
      makePreview(
        "Figs. 4, 5, 6, and 7",
        [4, 5, 6, 7],
        "Slotted screen gratings and vibrating slats",
      ),
      ", details of various forms of screen-gratings; ",
      makePreview("Fig. 8", [8], "Voice-modulated diaphragm transmitter with grid shutter"),
      ", a view of a voice-modulated transmitter; ",
      makePreview("Fig. 9", [9], "Diaphragm with vibrating aperture plate"),
      ", a modified form of transmitter diaphragm; ",
      makePreview("Fig. 10", [10], "Parabolic collector and receiver circuit"),
      ", a view of the receiving apparatus; ",
      makePreview(
        "Figs. 11, 12, and 13",
        [11, 12, 13],
        "Cylindrical stacked brass and mica selenium cell",
      ),
      ", side, sectional, and end views of a cylindrical selenium cell; ",
      makePreview(
        "Figs. 14 and 15",
        [14, 15],
        "Flat spiral interdigital selenium cell and cross-section",
      ),
      ", plan and cross-section of a flat selenium cell; ",
      makePreview(
        "Figs. 16, 17, 18, 19, 20, 21, 22, and 23",
        [16, 17, 18, 19, 20, 21, 22, 23],
        "Radial fin type-metal cell construction and axial parabolic mounting",
      ),
      ", details of a multi-disc radial-fin selenium cell and its axial mounting in a parabolic reflector.",
    ),
    p(
      "The transmitter comprises a source of rays (such as the sun or an artificial light), a mirror or reflector, a condensing lens, a device for imparting to the beam of rays an undulatory character corresponding to the sound-waves to be transmitted, and a projecting lens or mirror for directing the beam toward the distant receiving station. In ",
      makePreview("Fig. 1", [1], "General diagram of photophonic apparatus"),
      ", the sun's rays are reflected by a mirror, a, through a condensing lens, b, which focuses the rays upon the transmitting device, c.",
    ),
    p(
      "In one form of transmitter, ",
      term(
        "a thin flexible mirror",
        "Flexible Mirror Diaphragm",
        "A thin silvered glass, mica, or polished metal diaphragm (such as microscopists' cover-glass) that flexes under vocal acoustic pressure, converting parallel light rays into alternating divergent and convergent beams.",
      ),
      " (such as silvered mica or very thin glass) is mounted upon a mouthpiece or speaking-tube. When words are spoken into the tube, the diaphragm vibrates in unison with the sound-waves, alternately bulging outward (convex) and inward (concave). When convex, the reflected rays diverge widely, reducing the intensity of the light reaching the distant receiver; when concave, the rays converge, increasing the intensity. The beam is thus given an undulatory variation in effective power exactly corresponding in pitch, amplitude, and waveform to the spoken voice.",
    ),
    p(
      "In another form of transmitter, as shown in ",
      makePreview("Fig. 8", [8], "Voice diaphragm with screen-grating shutter"),
      ", the beam is focused upon a ",
      term(
        "screen-grating",
        "Grid Shutter Grating",
        "A pair of superposed plates ruled with alternating opaque and transparent parallel slits, where microscopic relative movement between the plates modulates beam transmission from 0% to 100%.",
      ),
      ", k l, consisting of two superposed plates with alternating opaque and transparent strips. One plate is fixed and the other is connected to the vibratory diaphragm. As the diaphragm vibrates, the slits move in and out of coincidence, modulating the transmitted light without altering the focal direction of the beam.",
    ),
    p(
      "In ",
      makePreview("Fig. 9", [9], "Diaphragm with vibrating aperture plate"),
      ", the beam is focused upon two aperture plates, one fixed and the other attached to the diaphragm, having openings matching the focal spot of the lens, allowing varying fractions of the radiant energy to pass as the diaphragm moves.",
    ),
    p(
      "At the receiving station, shown in ",
      makePreview("Fig. 10", [10], "Parabolic collector and receiver circuit"),
      ", the modulated beam is collected by a large ",
      term(
        "parabolic reflector",
        "Parabolic Flux Collector",
        "A silvered concave mirror that gathers the incoming parallel light rays and concentrates them into a intense focal spot on the axial selenium receiver cell.",
      ),
      ", C, and concentrated upon a selenium cell, S, positioned at the focus of the mirror. The selenium cell is placed in an electric circuit containing a battery, B, and a telephone receiver, T.",
    ),
    p(
      "When the undulatory beam falls upon the selenium cell, the ",
      term(
        "photoconductivity of the selenium",
        "Photoconductive Resistance Modulation",
        "The instantaneous decrease in selenium electrical resistance proportional to incident radiant flux, modulating circuit current to drive the telephone receiver diaphragm.",
      ),
      " causes its electrical resistance to vary in exact synchronism with the light fluctuations. These resistance variations modulate the electrical current flowing through the circuit, causing the diaphragm of the telephone receiver T to emit audible sound waves that faithfully reproduce the words spoken into the transmitter.",
    ),
    p(
      "To obtain high sensitivity, the selenium cell must possess both a large exposed surface area and a very low internal electrical resistance. This is accomplished, as shown in ",
      makePreview(
        "Figs. 11, 12, and 13",
        [11, 12, 13],
        "Cylindrical stacked brass and mica selenium cell",
      ),
      ", by building a cylindrical cell composed of a large number of circular brass disks separated by slightly smaller mica insulating washers, with crystalline annealed selenium filling the annular grooves between the disks.",
    ),
    p(
      "Alternate brass disks are connected to opposite terminals of the circuit, forming an interdigital grid where hundreds of thin selenium conducting bridges are connected in parallel. In ",
      makePreview(
        "Figs. 16, 17, 18, 19, 20, 21, 22, and 23",
        [16, 17, 18, 19, 20, 21, 22, 23],
        "Multi-disc radial-fin selenium cell with cast type-metal cores",
      ),
      ", type-metal is cast through longitudinal passages to rigidly join and connect the alternating disks, producing a robust, highly sensitive cylindrical cell that is mounted along the central focal axis of the parabolic reflector.",
    ),
    p(
      "I have also discovered that sound can be reproduced directly from the modulated beam without using an electric circuit or telephone receiver, by focusing the undulatory rays directly upon a thin diaphragm or disc of hard rubber, lampblack, or other absorbing substance enclosed in a hearing chamber connected to an ear-tube—an instrument which I have termed a ",
      term(
        "spectrophone",
        "Photoacoustic Spectrophone",
        "A direct optical receiver wherein periodic absorption of radiant energy creates localized thermal expansion and acoustic pressure waves in the absorbing medium without electrical conversion.",
      ),
      ".",
    ),
    p(
      "The various elements of this invention—the flexible mirror transmitter, the variable-aperture screen gratings, the cylindrical stacked selenium cell, the parabolic optical receiver, and the direct photo-acoustic sound generator—may be employed together or in various combinations for optical telegraphy, telephony, and signaling.",
    ),
    {
      kind: "heading",
      level: 3,
      text: "CLAIMS",
    },
    {
      kind: "claim",
      number: 1,
      inlines: [
        {
          kind: "text",
          text: "1. The herein-described method of signaling or communicating, which consists in controlling a beam of rays, as to its amount or active strength in accordance with the signals to be given, and receiving the said rays on a sensitive substance forming a part of an electric circuit and affected as to its resistance in accordance with the amount or strength of the beam received upon it, whereby electric apparatus in the said circuit may be controlled to give signals corresponding to the controlling influence imparted to the beam.",
        },
      ],
    },
    {
      kind: "claim",
      number: 2,
      inlines: [
        {
          kind: "text",
          text: "2. That improvement in the art or method of transmitting or reproducing sound which consists in giving a beam of rays an undulating or intermittent character in accordance with the sound-waves it is desired to produce, and providing a receiving apparatus adapted, when acted upon by the said rays, to produce air-vibrations or sound-waves corresponding to the undulations or variations in the said beam, substantially as described.",
        },
      ],
    },
    {
      kind: "claim",
      number: 3,
      inlines: [
        {
          kind: "text",
          text: "3. The herein-described method of transmitting articulate and other sound by causing, in the rays proceeding from a photophonic transmitting instrument to a photophonic receiver, undulatory variations in radiant energy similar in form to the sound-waves accompanying said articulate and other sounds.",
        },
      ],
    },
    {
      kind: "claim",
      number: 4,
      inlines: [
        {
          kind: "text",
          text: "4. The herein-described method of producing sounds of any desired pitch, amplitude, and quality by exposing a body sensitive to radiant energy to rays whose effective energy, exercised upon said sensitive body, is caused to vary in accordance with the vibrational form of the sound-waves appropriate to the sound to be produced.",
        },
      ],
    },
    {
      kind: "claim",
      number: 5,
      inlines: [
        {
          kind: "text",
          text: "5. The herein-described method of transmitting articulate and other sounds by causing the sound-waves which constitute said sounds to produce similar variations in the beam of rays proceeding from a photophonic transmitter to a photophonic receiver.",
        },
      ],
    },
    {
      kind: "claim",
      number: 6,
      inlines: [
        {
          kind: "text",
          text: "6. In an apparatus for communicating signals, a beam-controlling apparatus to impart a varying character to a beam of rays (from a radiant body) and a receiving apparatus sensitive to the said beam and operated thereby, to give signals corresponding to the variations in the said beam imparted by the controlling apparatus.",
        },
      ],
    },
    {
      kind: "claim",
      number: 7,
      inlines: [
        {
          kind: "text",
          text: "7. The herein-described apparatus for transmitting articulate and other sounds by causing, in rays proceeding from a photophonic transmitter to a photophonic receiver, undulatory variations in radiant energy similar in form to the sound-waves accompanying said articulate and other sounds.",
        },
      ],
    },
    {
      kind: "claim",
      number: 8,
      inlines: [
        {
          kind: "text",
          text: "8. In combination with a photophonic receiver, a photophonic transmitter, the source of radiant energy of which is varied or controlled, substantially as described.",
        },
      ],
    },
    {
      kind: "claim",
      number: 9,
      inlines: [
        {
          kind: "text",
          text: "9. In an apparatus for producing or reproducing sound at a distant station by means of variations in radiant energy, means, as described, for varying the amount of such energy which reaches the distant station by motion imparted to the transmitting apparatus.",
        },
      ],
    },
    {
      kind: "claim",
      number: 10,
      inlines: [
        {
          kind: "text",
          text: "10. A photophonic receiver adapted to produce, by the action of a beam of varying character from a radiant source, dynamic or electric effects corresponding with said character, substantially as described.",
        },
      ],
    },
    {
      kind: "claim",
      number: 11,
      inlines: [
        {
          kind: "text",
          text: "11. In an apparatus for sound-transmission, a device for controlling the beam during its passage from its source, in contradistinction to controlling the source itself, said device being actuated by the waves which constitute said sound to give the beam an undulatory character or variations in effective strength similar in form to the said sound-waves, substantially as described.",
        },
      ],
    },
    {
      kind: "claim",
      number: 12,
      inlines: [
        {
          kind: "text",
          text: "12. In a photophonic transmitter, the combination of a movable and an immovable portion to control the amount of radiant energy passing from it, substantially as described.",
        },
      ],
    },
    {
      kind: "claim",
      number: 13,
      inlines: [
        {
          kind: "text",
          text: "13. The combination, with the movable part of a photophonic transmitter, of mechanism operating electrically for giving motion to said part, substantially as described.",
        },
      ],
    },
    {
      kind: "claim",
      number: 14,
      inlines: [
        {
          kind: "text",
          text: "14. The method of producing a beam of varying character for photophonic transmission by controlling the amount of radiant energy which is allowed to pass in the desired direction from a constant source.",
        },
      ],
    },
    {
      kind: "claim",
      number: 15,
      inlines: [
        {
          kind: "text",
          text: "15. A beam-controlling device comprising a vibratory medium and means, as indicated, for varying the amount of radiant energy which is allowed to proceed from a constant source in a given direction in accordance with the vibrations of said medium, substantially as described.",
        },
      ],
    },
    {
      kind: "claim",
      number: 16,
      inlines: [
        {
          kind: "text",
          text: "16. The combination, with a transmitting apparatus to give a beam from a radiant body an undulatory character or variations in effective strength, of a receiving apparatus sensitive to the said beam and having the property of emitting sound under the influence and corresponding to the character of the said beam, substantially as described.",
        },
      ],
    },
    {
      kind: "claim",
      number: 17,
      inlines: [
        {
          kind: "text",
          text: "17. In an apparatus for sound-transmission, a transmitting apparatus to control a beam from a radiant body, and a receiving apparatus containing, as a portion of an electric circuit, a device the electrical condition of which is varied in accordance with the strength or character of the beam affecting it, and telephonic instruments in circuit therewith, substantially as described.",
        },
      ],
    },
    {
      kind: "claim",
      number: 18,
      inlines: [
        {
          kind: "text",
          text: "18. In an instrument containing selenium as a portion of an electric circuit, two or more strips of conducting material separated by insulating material, arranged to leave a portion of the space between the said strips unoccupied thereby, and selenium placed in the said unoccupied space to complete an electric circuit between the said conducting-strips, substantially as and for the purpose described.",
        },
      ],
    },
    p("ALEXANDER GRAHAM BELL."),
    p("Witnesses:\nJOS. P. LIVERMORE,\nARTHUR REYNOLDS."),
  ],
};

export const bellPhotophoneEdition = bellPhotophoneArchivalEdition;

export function manualPhotophoneClaimText(claimNumber: number): string {
  const claimBlock = bellPhotophoneArchivalEdition.blocks.find(
    (b) => b.kind === "claim" && b.number === claimNumber,
  );
  if (claimBlock?.kind !== "claim") {
    throw new Error(`Bell Photophone archival edition is missing Claim ${claimNumber}`);
  }
  return claimBlock.inlines
    .map((inline) => (inline.kind === "text" || inline.kind === "term" ? inline.text : ""))
    .join("")
    .trim();
}
