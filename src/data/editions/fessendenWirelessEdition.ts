/**
 * fessendenWirelessEdition.ts
 *
 * Archival Edition for Reginald Aubrey Fessenden's 1902 Wireless Telegraphy patent
 * (US Patent 706,737).
 *
 * Candidate source edition reconciled against the seven-page public record and
 * the pinned facsimile at public/patents/pdfs/us-706737-fessenden-wireless.pdf
 * (SHA-256: 2098ec6d967d3ab7999da0fb96357328fa68bb8e7639c1863ac600547aff8887).
 * Publication remains withheld pending independent GPT-5.6 Luna visual review
 * of every page, claim, and figure crop.
 */

import type { CuratedSpecificationEdition, CuratedSpecificationInline } from "@/types/patent";

type FessendenWirelessWipEdition = Omit<
  CuratedSpecificationEdition,
  "completeFacsimileReviewed"
> & {
  completeFacsimileReviewed: false;
};

const text = (value: string): CuratedSpecificationInline => ({ kind: "text", text: value });

const _term = (termText: string, definition: string): CuratedSpecificationInline => ({
  kind: "term",
  text: termText,
  definition,
});

const FIGURE_DIMENSIONS: Record<string, { width: number; height: number }> = {
  "/patents/figures/us-706737-fessenden-wireless/fig-1-source-crop-v4.png": {
    width: 1750,
    height: 405,
  },
  "/patents/figures/us-706737-fessenden-wireless/fig-2-source-crop-v10.png": {
    width: 700,
    height: 390,
  },
  "/patents/figures/us-706737-fessenden-wireless/fig-2-source-crop-v10-detail-v2.png": {
    width: 180,
    height: 400,
  },
  "/patents/figures/us-706737-fessenden-wireless/fig-3-source-crop-v4.png": {
    width: 690,
    height: 1300,
  },
  "/patents/figures/us-706737-fessenden-wireless/fig-4-source-crop-v4.png": {
    width: 500,
    height: 650,
  },
  "/patents/figures/us-706737-fessenden-wireless/fig-5-source-crop-v4.png": {
    width: 740,
    height: 1250,
  },
  "/patents/figures/us-706737-fessenden-wireless/fig-3-source-crop-v4-detail-v2.png": {
    width: 500,
    height: 470,
  },
};

const ref = (figureLabel: string, cropSrc: string, altText: string): CuratedSpecificationInline => {
  const dims = FIGURE_DIMENSIONS[cropSrc] ?? { width: 1200, height: 800 };
  const previews = [
    {
      src: cropSrc,
      alt: altText,
      width: dims.width,
      height: dims.height,
    },
    ...(cropSrc.endsWith("fig-3-source-crop-v4.png")
      ? [
          {
            src: "/patents/figures/us-706737-fessenden-wireless/fig-3-source-crop-v4-detail-v2.png",
            alt: "Fig. 3 lower detail showing the cone, ground lead 8, and mast numeral 7 without neighboring signatures.",
            width: 500,
            height: 470,
          },
        ]
      : []),
    ...(cropSrc.endsWith("fig-2-source-crop-v10.png")
      ? [
          {
            src: "/patents/figures/us-706737-fessenden-wireless/fig-2-source-crop-v10-detail-v2.png",
            alt: "Fig. 2 lower detail showing element 14, its complete vertical ground lead, and the printed ground symbol, isolated from Fig. 3.",
            width: 180,
            height: 400,
          },
        ]
      : []),
  ];
  return {
    kind: "reference",
    text: figureLabel,
    href: cropSrc,
    referenceType: "figure",
    label: `${figureLabel}: ${altText}`,
    figurePreviews: previews,
  };
};

const refGroup = (
  figureLabel: string,
  previews: readonly { src: string; alt: string }[],
  altText: string,
): CuratedSpecificationInline => ({
  kind: "reference",
  text: figureLabel,
  href: previews[0]?.src ?? "#",
  referenceType: "figure",
  label: `${figureLabel}: ${altText}`,
  figurePreviews: previews.flatMap((preview) => {
    const dims = FIGURE_DIMENSIONS[preview.src] ?? { width: 1200, height: 800 };
    const authored = {
      ...preview,
      alt: `${preview.alt} ${altText}`,
      width: dims.width,
      height: dims.height,
    };
    if (!preview.src.endsWith("fig-3-source-crop-v4.png")) return [authored];
    return [
      authored,
      {
        src: "/patents/figures/us-706737-fessenden-wireless/fig-3-source-crop-v4-detail-v2.png",
        alt: `Fig. 3 lower detail showing the cone, ground lead 8, and mast numeral 7 without neighboring signatures. ${altText}`,
        width: 500,
        height: 470,
      },
    ];
  }),
});

const p = (...inlines: CuratedSpecificationInline[]) => ({
  kind: "paragraph" as const,
  inlines,
});

export const fessendenWirelessParallelReadings: Readonly<Record<number, readonly string[]>> = {
  1: [
    "The opening identifies Reginald A. Fessenden of Allegheny, states the invention's object in electromagnetic-wave transmission and mechanical movement, and introduces the five patent figures.",
  ],
  2: [
    "Fessenden contrasts the roughly two-million-period wireless frequencies then in use with the much lower rates needed to move a telephone diaphragm or another receiving element directly, and explains that greater, uniformly distributed capacity or self-induction lowers the oscillation frequency.",
  ],
  3: [
    "The specification defines the complete sending- and receiving-conductor circuits and the radiating portion, including the series apparatus and the point where oscillatory charging and discharging equipment joins the conductor.",
  ],
  4: [
    "The source gives the concrete adjustments behind the low-frequency conductor: coil 2 changes self-induction, radiating surface or height changes capacity, and Fig. 3’s cylindrical cage uses parallel wires, supporting-rings, central sockets, and light non-conducting bamboo rods.",
  ],
  5: [
    "The cage is preferably sectional and electrically connected through its supporting-rings; wires 4 join at top and bottom, wire 8 can include turns for self-induction adjustment, and Fig. 5 supplies the continuous-wall cylinder before the specification explains the shortened radiating conductor.",
  ],
  6: [
    "The preferred dynamo is tuned to the sending-conductor and must have low internal resistance, ventilation, and low self-induction; those conditions permit resonance instead of building a direct one-hundred-thousand-volt machine.",
  ],
  7: [
    "The armature wire, self-induction, and capacity must be small fractions of the complete sending-conductor, and the whole top-to-ground circuit, including the armature, is what Fessenden calls resonant with the dynamo.",
  ],
  8: [
    "Iron must be arranged to avoid voltage-curve distortion and hysteresis loss; pure sine waves, nickel-steel rotating parts, the stated peripheral-speed examples, a steam turbine, and the transformer's secondary-wire proportion are all part of the source discussion.",
  ],
  9: [
    "The source-to-radiator frequency comparison explains why low frequency first produces chiefly electrostatic and magnetic effects, then why a radiating portion that is a large fraction of the circuit enables long-distance electromagnetic radiation. The five-foot radiator examples make the poor-radiator loss concrete.",
  ],
  10: [
    "Figure 1 connects the grounded dynamo through inductance 2 to radiating portion 1, while the receiving conductor 10 feeds a telephone translating device 11 and ground.",
  ],
  11: [
    "Figure 2's fine wire 12 vibrates between magnet poles 13 and makes and breaks the normally open microphonic contact 14; battery 15 and relay 16 form the secondary circuit energized by that contact.",
  ],
  12: [
    "An enlarged or otherwise locally changed radiating surface creates additional periodicities; a similarly formed receiving conductor or two separately tuned receiving conductors may be used to select the desired response.",
  ],
  13: [
    "Uniformly distributed capacity permits a sine-wave and low resistance: Fessenden contrasts a five-volt impressed signal that can resonate above two hundred volts with uniform capacity against a twenty-five-volt limit for a parabolic wave.",
  ],
  14: [
    "The source defines large capacity by comparison with ordinary wires and uniform distribution over the radiating portion, then explains that a local area or capacity increase creates additional periodicities like a weight or spring added to a piano-wire.",
  ],
  15: [
    "Low frequency is defined here as less than one million periods per second, preferably twenty-five thousand to one hundred thousand; the source specifically highlights reduced ground absorption and usable direct mechanical response in the receiving instrument.",
  ],
  16: [
    "The specification defines electromagnetic waves by their long wavelength relative to radiant heat, defines a grounded conductor through its direct or reactive earth connection, and treats tuned and resonant as equivalent terms.",
  ],
  17: [
    "The invention claims the practical use of lower-frequency radiant waves and uses resonance, with the impressed electromotive force and current in phase, to obtain useful radiated energy despite the lower frequency.",
  ],
  18: [
    "For a grounded vertical conductor, resistance must remain below the stated square-root relation for good oscillation and the conductor is ideally one-fourth of the fundamental wave; a ninety-thousand-period plain wire would incur the illustrated two-mile and eighty-mile resistance losses.",
  ],
  19: [
    "Large capacity and inductance shorten the conductor, but large inductance also increases resistance, so Fessenden favors large capacity with correspondingly small inductance and distributes that capacity across the radiating portion.",
  ],
  20: [
    "The source concludes that large capacity with small inductance lowers ohmic loss, shortens the sending-conductor, and enlarges the useful radiating surface, making a large fraction of the wavelength practical.",
  ],
  21: [
    "The low-frequency system can replace the induction-coil and spark-gap with a dynamo or similar alternating source; without the gap it gives a substantially uniform continuous train, while persistent oscillation can bridge spark-gap intervals.",
  ],
  22: [
    "Fessenden compares one-million-period trains with ten-thousand sparks per second, then explains that small resistance and low frequency yield energetic practical continuity and improve tuned-receiver resonance even when trains do not quite overlap.",
  ],
  23: [
    "The uniform-capacity paragraph says a conductor uniform in figure has nearly equal upper and lower capacity to ground, which depends chiefly on size and shape when the conductor is not close to ground.",
  ],
  24: [
    "The specification then introduces the twenty-one formal claims, which state the legal combinations for low-frequency sending-conductors, alternating sources, tuned radiation, and the electro-magnetic signal receiver.",
  ],
  48: [
    "The closing attestation records that Reginald A. Fessenden set his hand and names the two printed witnesses, W. B. Fearing and S. C. Gray.",
  ],
};

export const fessendenWirelessArchivalEdition: FessendenWirelessWipEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "2098ec6d967d3ab7999da0fb96357328fa68bb8e7639c1863ac600547aff8887",
  preparedBy: "Classic Patents editorial agent (Codex)",
  preparedAt: "2026-08-21",
  completeFacsimileReviewed: false,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE.",
        "REGINALD A. FESSENDEN, OF ALLEGHENY, PENNSYLVANIA.",
        "WIRELESS TELEGRAPHY.",
        "SPECIFICATION forming part of Letters Patent No. 706,737, dated August 12, 1902.",
        "Application filed May 29, 1901. Serial No. 62,301. (No model.)",
      ],
    },
    p(
      text(
        "To all whom it may concern: Be it known that I, REGINALD A. FESSENDEN, a citizen of the United States, residing at Allegheny, in the county of Allegheny and State of Pennsylvania, have invented or discovered certain new and useful Improvements in Wireless Telegraphy, of which improvements the following is a specification. The invention described herein relates to certain improvements in transmission of energy by electromagnetic waves, and has for its object the production of more efficient sending or generating conductors. It is a further object of the invention to provide for the production of mechanical movements by the direct interaction of currents induced in the receiving-conductor by electromagnetic waves and constant or independently-varying magnetic fields. The invention is hereinafter more fully described and claimed. In the accompanying drawings, forming a part of this specification, ",
      ),
      ref(
        "Figure 1",
        "/patents/figures/us-706737-fessenden-wireless/fig-1-source-crop-v4.png",
        "Figure 1, diagrammatic view illustrating a form of apparatus for the practice of the invention.",
      ),
      text(
        " is a diagrammatic view illustrating a form of apparatus for the practice of my invention. ",
      ),
      ref(
        "Fig. 2",
        "/patents/figures/us-706737-fessenden-wireless/fig-2-source-crop-v10.png",
        "Fig. 2, similar view illustrating a modification of the apparatus at the receiving-station.",
      ),
      text(
        " is a similar view illustrating a modification of the apparatus at the receiving-station. ",
      ),
      ref(
        "Fig. 3",
        "/patents/figures/us-706737-fessenden-wireless/fig-3-source-crop-v4.png",
        "Fig. 3, sectional elevation of one form of conductor.",
      ),
      text(" is a sectional elevation of one form of conductor. "),
      ref(
        "Fig. 4",
        "/patents/figures/us-706737-fessenden-wireless/fig-4-source-crop-v4.png",
        "Fig. 4, top plan view of the conductor.",
      ),
      text(" is a top plan view of the same, and "),
      ref(
        "Fig. 5",
        "/patents/figures/us-706737-fessenden-wireless/fig-5-source-crop-v4.png",
        "Fig. 5, elevation of a modification of the conductor.",
      ),
      text(" is an elevation of a modification of the conductor."),
    ),
    p(
      text(
        "In the experiments heretofore made in wireless transmission of energy, as in telegraphy, relatively high frequencies, of the order of two million (2,000,000) periods or more per second, have been used. It is impossible to produce or utilize mechanical movements directly by the interaction of a constant or independently-varying magnetic field and a current induced by electromagnetic waves of such high periodicities, because the element to be moved, as the diaphragm of a telephone, is incapable of such rapid vibrations or the vibrations are too rapid to be utilized. In order to utilize directly the interaction between currents produced by electromagnetic waves and a constant or independently-varying magnetic field to produce motion in one of two members of a receiving instrument, one member thereof consisting of a constant or independently-varying magnetic field, the sending-conductor is so constructed that its capacity or self-induction, or both, are large compared with the value of the aerial wire commonly used in the art and are distributed with practical uniformity along the conductor from or near its top to a point at or near the instrument. By thus increasing the capacity and self-induction of either of them the frequency of the electric oscillations in the conductors, and consequently of the waves generated, will be sufficiently low to produce utilizable motion in the instrument. By low frequency is meant low relative to the frequency hitherto used in wireless telegraphy.",
      ),
    ),
    p(
      text("The terms "),
      _term(
        "sending-conductor",
        "Fessenden uses this term for the complete sending-station circuit, from the top of the conductor to ground when grounded, or from one extreme end to the other when not grounded, including every apparatus connected in series.",
      ),
      text(" and "),
      _term(
        "receiving-conductor",
        "Fessenden uses this term for the complete receiving-station circuit, from the top of the conductor to ground when grounded, or from one extreme end to the other when not grounded, including every apparatus connected in series.",
      ),
      text(
        " as hereinafter employed indicate all of the circuits of the sending and receiving stations from top to ground if grounded, or, if not grounded, from one extreme end to the other extreme end, including all apparatus in series with the circuits. The term ",
      ),
      _term(
        "radiating portion",
        "The radiating portion is substantially all of the sending-conductor from its top or extreme end to the point at or near the junction with the apparatus that effects oscillatory charging and discharging, such as sparking terminals.",
      ),
      text(
        " indicates substantially all of the sending-conductor from the top or extreme end of the same to a point at or near the junction with the apparatus for effecting the oscillatory charging and discharging thereof, such as sparking terminals, transformer-coils, armature-windings, &c.",
      ),
    ),
    p(
      text(
        "The self-induction of the sending-conductor can be regulated by increasing or decreasing the turns in the coil 2, formed in the wire connecting the radiating portion 1 with the generator 3. The capacity of the sending-conductor can be regulated in several ways—as, for example, by changing the superficial area of the radiating portion 1—by the employment of a medium as described in application No. 62,303, filed May 29, 1901, or reducing the height of the radiating portion without reducing its superficial area. A conductor of large capacity may be constructed, as shown in ",
      ),
      ref(
        "Fig. 3",
        "/patents/figures/us-706737-fessenden-wireless/fig-3-source-crop-v4.png",
        "Fig. 3, sectional elevation of one form of conductor.",
      ),
      text(
        ", having its radiating portion 1 in the form of a cylindrical cage, consisting of a number of parallel wires 4, secured at their ends to supporting-rings 5, provided with hubs or central sockets 6 for the reception of supporting-rods 7, formed of bamboo or other light non-conducting material.",
      ),
    ),
    p(
      text(
        "For convenience it is preferred to form the cylindrical cage in sections, which can be mechanically and electrically connected by the supporting-rings, as shown. The wires 4 are connected together at the top and bottom, and the cage or cylinder can be connected to ground in any suitable manner, as by the wire 8, in which coils or turns may be formed to adjust the self-induction of the sending-conductor. As shown in ",
      ),
      ref(
        "Fig. 5",
        "/patents/figures/us-706737-fessenden-wireless/fig-5-source-crop-v4.png",
        "Fig. 5, elevation of a modification of the conductor.",
      ),
      text(
        ", the radiating portion may be formed by a cylinder 9, having continuous metal walls. By employment of sending-conductors having large capacity distributed with approximate uniformity or regularity over a large portion of its length the height thereof may be reduced without affecting the efficient travel of the electromagnetic waves radiated therefrom. When low frequency is obtained by increasing the capacity alone, or by increasing both capacity and self-induction, the sending-conductor can be shortened without reducing the radiating portion to a small fraction of the total length of the conductor.",
      ),
    ),
    p(
      text(
        "In carrying out my invention I prefer to employ a source of alternating current of low frequency and substantial voltage, as an alternating-current dynamo 3, connected directly in series with the sending-conductor 1 and ground, as shown in ",
      ),
      ref(
        "Fig. 1",
        "/patents/figures/us-706737-fessenden-wireless/fig-1-source-crop-v4.png",
        "Fig. 1, transmitting and receiving system diagram.",
      ),
      text(
        ". The dynamo is constructed to generate currents of the desired frequency and voltage, and is tuned to the natural period of the sending-conductor. When low frequency is obtained by increasing the capacity alone, or by increasing both capacity and self-induction, the curve of resonance is broader than is obtained by increasing the self-inductance alone, though in the former cases the amount of energy radiated for a given voltage and length of sending-conductor is more than is obtainable with a short resonance curve. Hence to obtain the best results it is preferred to use the two former methods and to conjoin with them at the receiving-station means for increasing the selective effect of the receiving-conductor, which means are described and claimed in application No. 62,303, filed May 29, 1901. By increasing the capacity and self-induction, or either of them, the stated advantages of a low frequency of oscillations in the conductor and a shorter radiating portion are obtained, and in addition thereto it is possible with frequencies of one hundred thousand (100,000) or less to substitute for the induction-coil connected in the manner now in vogue a source of alternating voltage as the exciting-generator—as, for example, the exciting-generator may be a dynamo, a transformer connected to a dynamo, or an induction-coil producing low-frequency oscillations in a primary circuit, the secondary circuit forming the source of alternating voltage and having one terminal connected to the radiating portion and the other terminal to the ground. In order that a dynamo may be used to produce such a high periodicity which, though low as compared with periodicities heretofore used in wireless transmission of energy, as in telegraphy, is very high as compared with those generated by dynamos commonly used in electrical engineering, it must possess several distinct characteristics. First, it should generate pure sine-waves, because, as is well known, this is the only form of curve which gives perfect resonance. With a dynamo giving such a curve forming a part of a suitably-constructed sending-conductor it is possible to wind the dynamo so as to generate, for example, only a thousand volts on open circuit, and yet by means of resonance effects to obtain a voltage of a hundred thousand volts on the sending-conductor. It is possible to obtain resonance effects by use of a dynamo of low internal resistance, as a portion of a sending-conductor of large capacity or self-induction, or both, having these electrical constants suitably proportioned so that the sending-conductor has a natural period identical with that of the dynamo. This obviously renders the machine much cheaper to build and much easier to manipulate for signaling purposes than a dynamo or dynamo and transformer built to give one hundred thousand volts directly. Second, the armature must be of low internal resistance, because if of a high resistance the oscillations will be dampened and high resonance voltages cannot be produced. Third, it must be well ventilated, because during the period of sending a signal the current may run up to hundreds or even thousands of amperes.",
      ),
    ),
    p(
      text(
        "Fourth, the length of wire in the armature must be as small as possible compared with the length of the sending-conductor, for otherwise the electrical constants of the sending-conductor—that is, of the circuit from the top of the conductor to the ground including the armature—will be determined too largely by that part of the circuit between the armature terminals and the amount of radiation from the given voltage on the sending-conductor would be much less than would be the case if the armature had relatively lesser length of wire. In other words, the self-induction and capacity of the armature must be as small a fraction as possible of the self-induction and capacity of the sending-conductor. When the dynamo is said to be in resonance with the sending-conductor, it is meant that the natural period of the whole conductor, from the top of the conductor to the ground including the armature, is the same as the periodicity of the dynamo.",
      ),
    ),
    p(
      text(
        "Fifth, it is also essential that all iron magnetically influenced by currents in the conductor should be so proportioned and distributed as not to affect the shape of the curve of voltage or to cause loss of power by hysteresis, as in such case there would be too much dampening. For these reasons the dynamo may be constructed with a fixed armature containing no iron, having the air-gap as long as possible consistent with a high magnetic flux density, revolving pole-pieces so shaped as to produce sine-waves as closely as possible, and the revolving parts formed of magnetic material of high tensile strength, such as nickel-steel. A dynamo with the revolving part having a high peripheral speed of one-half mile per minute has given ten thousand periods per second, and with a revolving part formed of nickel-steel a peripheral speed of five miles per minute can be safely maintained, giving thereby one hundred thousand periods per second. Such peripheral speed can be obtained by the employment of a steam-turbine. It will be evident to those skilled in the art that instead of using a dynamo giving a thousand volts a dynamo giving a hundred volts may be used with a transformer stepping up to a thousand volts; but in such case the length of wire in the secondary of the transformer should have the same relation to the length of the whole conductor, including the secondary of the transformer, as stated in reference to a dynamo giving a thousand volts.",
      ),
    ),
    p(
      text(
        "Where a transformer is used in connection with the dynamo, the secondary of the transformer should have the same relation to the length of the whole conductor, including the secondary of the transformer, as stated in reference to a dynamo giving a thousand volts. The best results are obtained when the frequency of the source of alternating voltage, as a dynamo, is equal or approximately equal to the natural frequency of the radiating system. The adjustment of frequencies can be effected by changing the speed of the dynamo. The reason why the best results are obtained when the frequency of the dynamo or its equivalent (as a transformer connected to a dynamo) is equal or approximately equal to that of the natural frequency of the radiating circuit is that when the frequency of the dynamo is less than this the chief effects are electrostatic and magnetic in their nature and there is practically no electromagnetic radiation. Under these circumstances signals cannot be transmitted to any great distance, as the electrostatic and magnetic effects fall off as a high power of the distance. As the frequency of the dynamo is increased the effects of electrostatic and magnetic induction continue to predominate until the frequency of the dynamo approaches that of the natural frequency of the radiating circuit. When this point is reached, if the radiating portion of the sending-conductor has a length which is a large fraction of the total length of the circuit a large amount of energy can be radiated in the form of electromagnetic waves and signals be transmitted a long distance. The reason why the length of the radiating portion of the sending-conductor should be a large fraction of the total length of the circuit is that if otherwise the circuit would be a poor radiator. If, for example, the length of the radiating portion of the sending-conductor is five feet and the length of the wire in the armature is five miles, the amount of energy radiated would be very small compared to what it would be if the length of wire in the armature were only five hundred feet and the radiating portion of the sending-conductor five feet. A further advantage incident to the employment of low frequencies is the fact that there is, as I have discovered, less absorption of the electromagnetic force as the waves travel along the ground than when the waves have high frequencies.",
      ),
    ),
    p(
      text("In the form of apparatus shown in "),
      ref(
        "Fig. 1",
        "/patents/figures/us-706737-fessenden-wireless/fig-1-source-crop-v4.png",
        "Fig. 1, transmitting and receiving system with grounded dynamo 3, inductance 2, radiating portion 1, and telephone receiver 11.",
      ),
      text(
        " the generator 3 (in this case a dynamo) has one pole connected to ground and the other pole connected by a wire having an inductance 2 to the radiating portion 1. The sending-conductor, which may have its radiating portion of any suitable form, but preferably that shown in either ",
      ),
      refGroup(
        "Figs. 3 and 5",
        [
          {
            src: "/patents/figures/us-706737-fessenden-wireless/fig-3-source-crop-v4.png",
            alt: "Fig. 3 sectional elevation of the preferred cylindrical cage.",
          },
          {
            src: "/patents/figures/us-706737-fessenden-wireless/fig-5-source-crop-v4.png",
            alt: "Fig. 5 elevation of the continuous-wall cylinder modification.",
          },
        ],
        "preferred radiating-conductor forms",
      ),
      text(
        ", has its capacity or self-induction or both adjusted in the manner described, that the electromagnetic waves radiated will have low frequency. At the receiving-station the receiving-conductor 10 is connected to one terminal of a translating device 11, as a telephone, the opposite terminal thereof being connected to the ground. As the frequencies of the waves which induce currents in the conductor 10 are low, the diaphragm of the telephone will respond thereto, and the vibrations of the diaphragm will produce audible notes.",
      ),
    ),
    p(
      text("In "),
      ref(
        "Fig. 2",
        "/patents/figures/us-706737-fessenden-wireless/fig-2-source-crop-v10.png",
        "Fig. 2, modified receiving apparatus.",
      ),
      text(
        " is shown another form of receiving apparatus. A portion of the ground connection of the receiving-conductor 10 is formed by a piece of fine wire 12, held in tension between the poles of a magnet 13. By the interaction between the currents passing along the wire 12 and the magnetic field the wire is caused to vibrate, and its vibrations may be observed by means of a microscope or recorded upon a moving strip of sensitized photographic paper. The fine wire 12 is caused to vibrate and make and break contact with the ",
      ),
      _term(
        "microphonic contact point 14",
        "The contact point is adjusted normally out of contact with the fine wire; vibration of the wire makes and breaks the secondary circuit, allowing a local battery to energize a relay or another translating device.",
      ),
      text(
        ", which is adjusted normally out of contact with the wire 12. A circuit including a battery 15 and relay 16, or another translating device, is formed in part by the contact 14 and wire 12, so that whenever the secondary circuit is completed by vibration of the wire the relay is energized.",
      ),
    ),
    p(
      text("If the radiating portion be made, as shown in "),
      ref(
        "Fig. 5",
        "/patents/figures/us-706737-fessenden-wireless/fig-5-source-crop-v4.png",
        "Fig. 5, radiating cylinder with enlarged portion.",
      ),
      text(
        ", with varying superficial dimensions—e.g., with a swell or enlargement 17—the electromagnetic waves generated from its different surfaces will have different periodicities, as the periodicity of electromagnetic waves depends, in part at least, on the capacity of the radiating portion at the sending-station; a similarly-constructed conductor may be used at the receiving-station, or two simple receiving-conductors suitably tuned may be used.",
      ),
    ),
    p(
      text(
        "By the use of a sending-conductor of large capacity and having that capacity uniformly distributed certain specific advantages are obtained which cannot be obtained by any other style of conductor. When the capacity is not distributed with substantial uniformity, it is impossible to obtain a sine form of electromagnetic wave, and this form of wave gives very much better results in that it permits the voltage being increased by resonance to any extent, depending only on the resistance losses. For example, if the resistance be low it is possible with an impressed voltage of, say, five to reach a resonant voltage of two hundred or more with a capacity distributed uniformly—that is, with a sine-wave—while if the capacity be distributed so as to give a parabolic wave with a voltage of five, it is not possible to obtain by resonance a higher voltage than twenty-five, since when the capacity is large the resistance is also low on account of the fact that the currents with these high frequencies flow over the surface of the sending-conductor it follows that with a sending-conductor of large capacity uniformly distributed it is possible to get a sine-wave and a low resistance—that is, conditions necessary and favorable for the production of large resonant voltages from small impressed voltages, and hence conditions which permit of sending over longer distances than if the sending-conductor were of large capacity not uniformly distributed or of small capacity uniformly distributed.",
      ),
    ),
    p(
      _term(
        "large capacity",
        "Fessenden means capacity large compared with the capacities of wires commonly used in the art, a source-defined scale rather than a modern component rating.",
      ),
      text(
        " as herein used is meant a capacity large as compared with the capacities of wires heretofore commonly used in the art, and by the term ",
      ),
      _term(
        "uniformly distributed",
        "The capacity is distributed with substantial uniformity over the radiating portion, rather than concentrated at a local enlargement or isolated point.",
      ),
      text(
        " is meant distributed with substantial uniformity over the radiating portion. The effect of locally increasing the superficial area of the sending-conductor or of locally increasing the capacity by any other suitable means is to produce two or more sets of waves of different periodicities, the periodicity of the first being dependent upon the electrical constants of the sending-conductor as a whole and the periodicity of the other depending upon the position and amount of localized increase of capacity in the same way as by attaching a weight or spring to a piano-wire between its extremities additional vibrations in the wire are created.",
      ),
    ),
    p(
      text(
        'By the term "low frequency" as herein used is meant a frequency of less than one million per second, and preferably between twenty-five thousand and one hundred thousand per second. The advantages of using a low frequency and a sending-conductor of large capacity include less absorption of the electromagnetic force as the waves travel along the ground than when the waves have high frequencies, and the possibility of obtaining usable mechanical response from currents induced in a receiving instrument.',
      ),
    ),
    p(
      text("By the term "),
      _term(
        "electromagnetic waves",
        "Here the phrase means waves whose wavelength is long compared with the wavelength of what are commonly called heat-waves or radiant heat; it is a source-defined period distinction, not a modern communications-band label.",
      ),
      text(
        ' as used herein is meant waves of a wave length long in comparison with the wave length of what are commonly called "heat-waves" or "radiant heat." By "',
      ),
      _term(
        "grounded conductor",
        "A grounded conductor is connected to earth directly or through capacity, inductance, or resistance, so current flows through the conductor to ground and back when electromagnetic waves are generated.",
      ),
      text(
        '" is meant a conductor grounded either directly or through a capacity, an inductance, or a resistance, so that the current in the conductor flows through the conductor to ground, and vice versa, when electromagnetic waves are generated. The terms ',
      ),
      _term(
        "tuned and resonant",
        "Fessenden expressly uses tuned and resonant as including one another, so the words describe the same source-to-conductor period relationship in this specification.",
      ),
      text(" are used herein as one including the other."),
    ),
    p(
      text(
        "This invention involves the discovery of the desirability and practicability of using radiant electromagnetic waves of a frequency lower than has heretofore been recognized as desirable or practicable and in the devising of a considerable number of very meritorious features combined in an apparatus or system whereby the energy of such waves may be successfully radiated in quantities sufficient for practical use over long distances. In constructing an apparatus that will give practical results with such low-frequency waves novel features have been devised, some of which are of general utility in generating and radiating waves of the higher and more usual frequencies, and these are hereinafter claimed in terms which will cover the use thereof in other than the specific connection for which they are primarily intended. The amount of radiation possible for a given system is dependent, among other things, upon the frequency, and, other things being equal, the amount is less for the lower frequencies. In order, therefore, to radiate large amounts of energy by low-frequency waves, I take advantage of the rise of voltage due to resonance effects brought about by a proper proportioning of inductance and capacity, so that the phases of the impressed electromotive force and the current coincide in time.",
      ),
    ),
    p(
      text(
        "Resonance effects in a vertical conductor grounded at one end depend upon the quantities that make it a good oscillator. This is measured by requiring the resistance R < √(4L/C), and the best conditions of resonant oscillation require the conductor to be one-fourth the length of the fundamental wave oscillating in it. With a plain wire of ordinary size and small tuning capacity and inductance, a frequency of ninety thousand gives a wave of about two miles in the ether; the resistance opposing oscillation is then that of eight miles of wire for each complete wave, so the tenth oscillation has encountered the losses of eighty miles of wire.",
      ),
    ),
    p(
      text(
        "When, however, the inductance and capacity are large, the length of the sending-conductor and its subsequent resistance detrimental to oscillation may be greatly decreased, for the frequency of the fundamental wave—that is, the natural period of such a conductor—varies inversely as the square root of the capacity multiplied by the square root of the inductance. Now since the condition of resonance is that CLω²=1, it is evident that instead of increasing L and C in equal proportions to get a large total value, one of these factors may be increased, while the other remains constant or is decreased. Large inductance, however, would involve large resistance, which is bad, as shown, while increase of capacity in accordance with my invention is advantageous in many ways. I therefore make the capacity large and the inductance correspondingly small, thereby making the quantity CL large and correspondingly shortening my sending-conductor and greatly reducing my resistance. The large capacity I distribute uniformly over substantially all of the radiating portion of the conductor, thereby further reducing instead of increasing the resistance and at the same time providing a large effective radiating-surface. In order that I may radiate large amounts of energy, I make the radiating-conductor over which the capacity is distributed a large fraction of the total length of the sending-conductor. This points another advantage of relatively and absolutely large capacity and corresponding inductance, for unless I was able to greatly shorten the sending-conductor, as I do by their use, it would be difficult to construct a low-frequency radiating-conductor which would be so large a fraction of the length of the whole sending-conductor.",
      ),
    ),
    p(
      text(
        "From the above it will be seen that by my invention the internal current losses due to ohmic resistance are largely decreased by using large total capacity and small inductance for the tuning, thereby shortening the length of sending-conductor necessary for a given frequency or for a given wave length in the ether. The shortening of the sending-conductor also facilitates the use of a radiating conductor which is a large fraction of the wave length. The distribution of the capacity makes possible a better form of wave, decreases the resistance of that part of the sending-conductor, and further increases the radiating-surface.",
      ),
    ),
    p(
      text(
        "With this system, whereby large amounts of energy may be radiated at a low frequency, I am able to substitute for the induction-coil and spark-gap now in use a dynamo or similar source of alternating voltage. If the dynamo be used without the spark-gap, I am able at once to produce a continuous train of radiant waves of substantially uniform strength, as distinguished from the well-known systems wherein the spark-discharge starts a train of waves of rapidly-diminishing power followed by relatively long intervals of no radiation. Furthermore, where the spark discharge is used I am able, by reason of the persistent oscillation coupled with the low frequency, to greatly diminish and, indeed, to completely bridge over the intervals of no radiation. With ten thousand sparks per second exciting a sending-conductor having a periodicity of ninety thousand, if each spark gives only ten oscillations before being damped sufficiently to stop radiation, every tenth oscillation coincides with the first oscillation produced by the next succeeding spark. The radiation is therefore practically continuous and the energy of the first oscillation produced by the spark is divided between only nine electromagnetic waves.",
      ),
    ),
    p(
      text(
        "If the frequency were one million and the sparks ten thousand per second it would be necessary to have an oscillator capable of one hundred useful oscillations of a power sufficient to produce useful radiations in order to maintain practically continuous radiation. The energy of a single spark in that case would be divided between one hundred radiant electromagnetic waves and would be too small for practical use over commercial distances. From the above it will be seen that by keeping R small and the frequency low I am able to radiate practically continuous streams of electromagnetic waves of an energy sufficient for practically continuous effects at the receiving-station. Even in the case where the sets of oscillations do not quite overlap in time it is evident that the intervals of inactivity are decreased by the increase of the time of a train to ten times what it would be with a frequency of one million. This is a great advantage in cases where the receiver is tuned to the period of the transmitter, for the regularity, continuity, and great energy of the waves improve the resonance in a manner that by use of proper devices at the receiving-station more than compensates for the rather broad curve of resonance involved in any use of large capacity for tuning purposes.",
      ),
    ),
    p(
      text(
        "In practice substantial uniformity of capacity distribution may be obtained by making the conductor uniform in figure from the top to a point at or near the bottom, as indicated in ",
      ),
      ref(
        "Fig. 3",
        "/patents/figures/us-706737-fessenden-wireless/fig-3-source-crop-v4.png",
        "Fig. 3, sectional elevation of one form of conductor.",
      ),
      text(
        ". Some have held that the capacity of the upper portion of a vertical conductor of uniform cross-section is much smaller than that of the middle or lower portions because it is farther from ground; I have found by actual measurement that this is practically not the case. The upper portions have practically the same capacity as the lower portions, and the capacity of a conductor with respect to ground depends mainly upon its size and shape, not upon its distance from ground when that distance is not small.",
      ),
    ),
    p(text("I claim herein as my invention—")),
    {
      kind: "heading",
      level: 2,
      text: "CLAIMS:",
    },
    {
      kind: "claim",
      number: 1,
      inlines: [
        text(
          "1. A sending-conductor for electromagnetic waves, having a large capacity distributed with substantial uniformity over its radiating portion, substantially as set forth.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 2,
      inlines: [
        text(
          "2. A sending-conductor for electromagnetic waves, having its capacity so adjusted that the waves radiated therefrom have a low frequency, substantially as set forth.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 3,
      inlines: [
        text(
          "3. A sending-conductor for electromagnetic waves, having its capacity and inductance so adjusted that the waves radiated therefrom have a low frequency, substantially as set forth.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 4,
      inlines: [
        text(
          "4. In a system for transmission of energy by electromagnetic waves, the combination of a source of alternating voltage and a conductor in series therewith forming a sending-conductor said sending-conductor being adapted to radiate electromagnetic waves and having its radiating portion of a length which is a large fraction of the quarter-wave length produced by the alternating source of the radiating portion in the medium surrounding the radiating portion, substantially as set forth.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 5,
      inlines: [
        text(
          "5. In a system for transmission of energy by electromagnetic waves, the combination of a source of alternating voltage and a conductor in series therewith forming a sending-conductor said sending-conductor being adapted to radiate electromagnetic waves having its radiating portion of a length which is a large fraction of the length of the sending-conductor, substantially as set forth.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 6,
      inlines: [
        text(
          "6. In a system for transmission of energy by electromagnetic waves, the combination of a source of alternating voltage generating groups of impulses of low frequency and a conductor in series therewith forming a sending-conductor said sending-conductor being adapted and proportioned to radiate electromagnetic waves, and being tuned to the source of alternating voltage, substantially as set forth.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 7,
      inlines: [
        text(
          "7. In a system for the transmission of energy by electromagnetic waves, the combination of an alternating-current dynamo and a conductor in series therewith forming a sending-conductor said sending-conductor being tuned to the dynamo and adapted to radiate electromagnetic waves and tuned to the dynamo, substantially as set forth.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 8,
      inlines: [
        text(
          "8. In a system for the transmission of energy by electromagnetic waves, the combination of a sending-conductor so proportioned as to radiate waves of low frequency and an alternating-current dynamo having its terminals connected respectively to the radiating portion of the sending-conductor and to ground, the dynamo being so adjusted that its periodicity is the same or approximately the same as the natural period of the sending-conductor, substantially as set forth.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 9,
      inlines: [
        text(
          "9. A sending-conductor for electromagnetic waves, formed by an alternating-current dynamo and a conductor in series therewith, one pole of the dynamo being grounded, the sending-conductor thus formed being so proportioned as to radiate waves of low frequency, substantially as set forth.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 10,
      inlines: [
        text(
          "10. A sending-conductor for electromagnetic waves so proportioned as to radiate waves of low frequency in combination with a source of alternating voltage having its terminals connected respectively to the radiating portion of the sending-conductor and to ground, the voltage-generator being so adjusted that its periodicity is the same or approximately the same as the period of the system when so connected, substantially as set forth.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 11,
      inlines: [
        text(
          "11. A sending-conductor for electromagnetic waves, formed by a source for continuously generating alternating voltage and a conductor in series therewith, one pole of the source of alternating voltage being grounded, the sending-conductor thus formed being so proportioned as to radiate waves of low frequency, substantially as set forth.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 12,
      inlines: [
        text(
          "12. A system for signaling by electromagnetic waves having in combination a conductor adapted to radiate waves of low frequency, and a receiver dependent for its action upon a ",
        ),
        _term(
          "constant or independently-varying magnetic field",
          "This claim preserves the source's receiving-field condition: the receiver acts through a magnetic field that is constant or varies independently of the induced current from the radiated waves.",
        ),
        text(
          " and adapted to respond to currents produced by said waves, substantially as set forth.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 13,
      inlines: [
        text(
          "13. A sending-conductor for electromagnetic waves of a length much less than a quarter of the length of an ether wave, having a frequency equal to the natural period of said sending-conductor, and having a radiating portion which is a large fraction of its total length.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 14,
      inlines: [
        text(
          "14. A sending-conductor for electromagnetic waves having a natural period of vibration much lower than the period of an ",
        ),
        _term(
          "ether-wave",
          "The specification's ether-wave is the historical comparison wave in the surrounding medium; the claim uses four times its length as the reference period, not as a modern wireless-band label.",
        ),
        text(
          " four times its length, whereby its radiating portion may be a relatively large fraction of the total length of said sending-conductor.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 15,
      inlines: [
        text(
          "15. A sending-conductor for electromagnetic waves tuned to a desired low frequency by large capacity and small inductance.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 16,
      inlines: [
        text(
          "16. A sending-conductor for electromagnetic waves having small inductance and tuned to a desired low frequency by a suitably-proportioned large capacity.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 17,
      inlines: [
        text("17. A sending-conductor for electromagnetic waves having low resistance, small "),
        _term(
          "self-induction",
          "Self-induction is the conductor's opposition to a changing current caused by its own magnetic field; the claim requires it to remain small while capacity is made great.",
        ),
        text(" and great capacity, substantially as and for the purpose set forth."),
      ],
    },
    {
      kind: "claim",
      number: 18,
      inlines: [
        text(
          "18. A sending-conductor for electromagnetic waves having low resistance, small self-induction and great capacity so correlated as to support ",
        ),
        _term(
          "persistent oscillation",
          "Persistent oscillation means that the low-loss tuned circuit continues its alternating motion long enough to bridge successive excitations rather than dying immediately after each spark.",
        ),
        text(" of a frequency much less than that of an "),
        _term(
          "ether-wave",
          "Here the ether-wave remains the historical wavelength comparison used to express how much lower the sending-conductor's natural frequency is.",
        ),
        text(" of a length four times that of said sending-conductor."),
      ],
    },
    {
      kind: "claim",
      number: 19,
      inlines: [
        text(
          "19. A system for transmission of energy by electromagnetic waves in combination with a radiating-conductor and a source of alternating electrical energy or potential, said radiating-conductor and source being coordinated and relatively adjusted to radiate a substantially continuous stream of electromagnetic waves.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 20,
      inlines: [
        text(
          "20. A system of transmission of energy by electromagnetic waves including in combination a radiating-conductor and a source of alternating electrical energy or potential, said radiating-conductor and source being coordinated and relatively adjusted to generate and radiate a substantially continuous stream of electromagnetic waves.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 21,
      inlines: [
        text(
          "21. A system for transmission of energy by electromagnetic waves, including in combination a radiating-conductor and a source of alternating electrical energy or potential, said radiating-conductor and source being coordinated and relatively adjusted to radiate a substantially continuous stream of electromagnetic waves of substantially uniform strength.",
        ),
      ],
    },
    {
      kind: "heading",
      level: 3,
      text: "SIGNATURES & WITNESSES",
    },
    p(
      text("IN TESTIMONY WHEREOF I have hereunto set my hand.\n\n"),
      text("REGINALD A. FESSENDEN,\n\n"),
      text("Witnesses: W. B. FEARING, S. C. GRAY."),
    ),
  ],
};

export function manualFessendenClaimText(claimNumber: number): string {
  const block = fessendenWirelessArchivalEdition.blocks.find(
    (b) => b.kind === "claim" && b.number === claimNumber,
  );
  if (block?.kind !== "claim") {
    throw new Error(`Claim ${claimNumber} not found in fessendenWirelessArchivalEdition`);
  }
  return block.inlines.map((i) => ("text" in i ? i.text : "")).join("");
}
