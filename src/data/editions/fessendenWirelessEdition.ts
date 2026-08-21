/**
 * fessendenWirelessEdition.ts
 *
 * Archival Edition for Reginald Aubrey Fessenden's 1902 Wireless Telegraphy patent
 * (US Patent 706,737).
 *
 * Transcribed, annotated, and verified against the 7-page pinned facsimile
 * at public/patents/pdfs/us-706737-fessenden-wireless.pdf (SHA-256: 2098ec6d967d3ab7999da0fb96357328fa68bb8e7639c1863ac600547aff8887).
 */

import type { CuratedSpecificationEdition, CuratedSpecificationInline } from "@/types/patent";

const text = (value: string): CuratedSpecificationInline => ({ kind: "text", text: value });

const term = (termText: string, definition: string): CuratedSpecificationInline => ({
  kind: "term",
  text: termText,
  definition,
});

const FIGURE_DIMENSIONS: Record<string, { width: number; height: number }> = {
  "/patents/figures/us-706737-fessenden-wireless/fig-1-source-crop-v1.png": {
    width: 1750,
    height: 500,
  },
  "/patents/figures/us-706737-fessenden-wireless/fig-2-source-crop-v1.png": {
    width: 1750,
    height: 500,
  },
  "/patents/figures/us-706737-fessenden-wireless/fig-3-source-crop-v1.png": {
    width: 800,
    height: 1550,
  },
  "/patents/figures/us-706737-fessenden-wireless/fig-4-source-crop-v1.png": {
    width: 550,
    height: 600,
  },
  "/patents/figures/us-706737-fessenden-wireless/fig-5-source-crop-v1.png": {
    width: 550,
    height: 1150,
  },
};

const ref = (figureLabel: string, cropSrc: string, altText: string): CuratedSpecificationInline => {
  const dims = FIGURE_DIMENSIONS[cropSrc] ?? { width: 1200, height: 800 };
  return {
    kind: "reference",
    text: figureLabel,
    href: cropSrc,
    referenceType: "figure",
    label: figureLabel,
    figurePreviews: [
      {
        src: cropSrc,
        alt: altText,
        width: dims.width,
        height: dims.height,
      },
    ],
  };
};

const p = (...inlines: CuratedSpecificationInline[]) => ({
  kind: "paragraph" as const,
  inlines,
});

export const fessendenWirelessParallelReadings: Readonly<Record<number, readonly string[]>> = {
  1: [
    "The opening identifies Reginald A. Fessenden of Allegheny, states the invention's object in electromagnetic-wave transmission and mechanical movement, and introduces the five patent figures.",
  ],
  2: [
    "The specification contrasts rapidly damped, irregular spark-gap waves with Fessenden's continuous train of substantially uniform strength and explains that distributed capacity or self-induction lowers frequency and lengthens the wave.",
  ],
  3: [
    "Figures 3 through 5 describe a cage or cylindrical sending-conductor, its supporting rings and central mast, the ground lead used to adjust self-induction, and the alternative continuous-wall cylinder.",
  ],
  4: [
    "The preferred source is a low-frequency, substantial-voltage alternating-current dynamo in series with the sending-conductor and ground; the specification then lists matching natural period, low armature resistance, ventilation, and low self-induction.",
  ],
  5: [
    "The transformer relation and source-to-radiator resonance are stated, followed by the Fig. 1 receiver: a grounded receiving-conductor and telephone whose diaphragm responds to the low-frequency induced currents.",
  ],
  6: [
    "Figure 2 adds a fine wire in a magnetic field and a liquid receiver with a tiny Wollaston platinum terminal, local battery, and telephone; heating near the tiny terminal changes circuit resistance and produces an audible signal.",
  ],
  7: [
    "Fessenden defines low frequency as below one million periods per second, preferably 25,000 to 100,000, and lists the claimed advantages: greater radiated energy, less absorption and atmospheric dissipation, greater receiving resonance, and direct-action receivers.",
  ],
  8: [
    "The closing discussion relates large capacity and small inductance to lower losses and a shorter conductor, then explains substituting a dynamo for a spark gap and bridging intervals of no radiation by persistent low-frequency oscillation.",
  ],
  9: [
    "The source face ends with the exact transition to the claims, which cover the conductor's capacity, inductance, resistance, tuning, source coordination, low-frequency radiation, and substantially continuous waves.",
  ],
  33: [
    "The grant closes with Fessenden's attestation and the witness names W. B. Fearing and S. C. Gray.",
  ],
};

export const fessendenWirelessArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "2098ec6d967d3ab7999da0fb96357328fa68bb8e7639c1863ac600547aff8887",
  preparedBy: "Classic Patents editorial agent (Codex)",
  preparedAt: "2026-08-21",
  completeFacsimileReviewed: true,
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
        "To all whom it may concern: Be it known that I, REGINALD A. FESSENDEN, a citizen of the United States, residing at Allegheny, in the county of Allegheny and State of Pennsylvania, have invented or discovered certain new and useful Improvements in Wireless Telegraphy, of which improvements the following is a specification. The invention described herein relates to certain improvements in transmission of energy by electromagnetic waves, and has for its object the production of more efficient sending or generating conductors. It is a further object of the invention to provide for the production of mechanical movements by the direct interaction of currents induced in the receiving-conductor by electromagnetic waves and constant or varying magnetic fields. The invention is hereinafter more fully described and claimed. In the accompanying drawings, forming a part of this specification, ",
      ),
      ref(
        "Figure 1",
        "/patents/figures/us-706737-fessenden-wireless/fig-1-source-crop-v1.png",
        "Figure 1, diagrammatic view of a system embodying one form of the invention.",
      ),
      text(" is a diagrammatic view of a system embodying one form of my invention. "),
      ref(
        "Fig. 2",
        "/patents/figures/us-706737-fessenden-wireless/fig-2-source-crop-v1.png",
        "Fig. 2, similar view of a modified transmitting and receiving apparatus.",
      ),
      text(
        " is a similar view of a system illustrating a modification of the transmitting and receiving apparatus. ",
      ),
      ref(
        "Fig. 3",
        "/patents/figures/us-706737-fessenden-wireless/fig-3-source-crop-v1.png",
        "Fig. 3, side elevation of an antenna or generating-conductor.",
      ),
      text(" is a side elevation of an antenna or generating-conductor. "),
      ref(
        "Fig. 4",
        "/patents/figures/us-706737-fessenden-wireless/fig-4-source-crop-v1.png",
        "Fig. 4, transverse section of the antenna or generating-conductor.",
      ),
      text(" is a transverse section of the same, and "),
      ref(
        "Fig. 5",
        "/patents/figures/us-706737-fessenden-wireless/fig-5-source-crop-v1.png",
        "Fig. 5, detail view illustrating an adjusting means for the antenna or generating-conductor.",
      ),
      text(
        " is a detail view illustrating an adjusting means for the antenna or generating-conductor.",
      ),
    ),
    p(
      text(
        "Heretofore the transmission of energy by electromagnetic waves has been effected by generating oscillations of high potential and high frequency by means of a spark-gap, producing a rapidly-damped wave-train. It is a well-known fact that the waves produced by a spark-gap have a very high frequency and that they rapidly diminish in amplitude or power. These waves are also irregular in character and vary in frequency and form, and are consequently unsuitable for the production of continuous and uniform signals. In the practice of my invention I produce a continuous train of waves of substantially uniform strength and predetermined frequency, and as a result thereof the signals produced at the receiving-station are continuous and uniform. In the practice of my invention the sending-conductor is so constructed that its capacity or self-induction, or both, are large, as compared with the value of the aerial wire commonly used in the art, and distributed with practical uniformity along the conductor from or near its top to a point at or near the instrument. By thus increasing the capacity and self-induction or either of them the frequency of the radiated waves is decreased and their wave length correspondingly increased, and at the same time the radiating portion of the conductor is made a large fraction of the total length of the conductor.",
      ),
    ),
    p(
      text("As shown in "),
      ref(
        "Figs. 3 and 4",
        "/patents/figures/us-706737-fessenden-wireless/fig-3-source-crop-v1.png",
        "Figs. 3 and 4, antenna cylinder and transverse section.",
      ),
      text(
        ", the sending-conductor or antenna may consist of a plurality of wires 4, arranged in the form of a cylinder or cage, and supported by rings 5, of metal or other suitable material, which are attached to hubs or collars 6, mounted on a central mast or support 7. The wires 4 are connected together at the top and bottom, and the cage or cylinder can be connected to ground in any suitable manner, as by the wire 8, in which coils or turns may be formed to adjust the self-induction of the sending-conductor. As shown in ",
      ),
      ref(
        "Fig. 5",
        "/patents/figures/us-706737-fessenden-wireless/fig-5-source-crop-v1.png",
        "Fig. 5, antenna cylinder adjusting means.",
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
        "/patents/figures/us-706737-fessenden-wireless/fig-1-source-crop-v1.png",
        "Fig. 1, transmitting and receiving system diagram.",
      ),
      text(
        ". The dynamo is constructed to generate currents of the desired frequency and voltage, and is tuned to the natural period of the sending-conductor. In order to obtain the best results with a dynamo in the sending-circuit, the following conditions should be observed: First, the frequency of the dynamo should be as high as possible, and the capacity and inductance of the sending-conductor should be proportioned so that the sending-conductor has a natural period identical with that of the dynamo. This renders the machine much cheaper to build and much easier to manipulate for signaling purposes than a dynamo or dynamo and transformer built to give one hundred thousand volts directly. Second, the armature must be of low internal resistance, because if of a high resistance the oscillations will be dampened and high resonance voltages cannot be produced. Third, it must be well ventilated, because during the period of sending a signal the current may rise to very large values. Fourth, the armature should have a low self-induction, so that the current will rise to its maximum value quickly.",
      ),
    ),
    p(
      text(
        "Where a transformer is used in connection with the dynamo, the secondary of the transformer should have the same relation to the length of the whole conductor, including the secondary of the transformer, as stated in reference to a dynamo giving a thousand volts. The best results are obtained when the frequency of the source of alternating voltage, as a dynamo, is equal or approximately equal to the natural frequency of the radiating system. The adjustment of frequencies can be effected by changing the speed of the dynamo. The reason why the best results are obtained when the frequency of the dynamo is equal or approximately equal to the natural frequency of the radiating system is that the voltage at the top of the sending-conductor is then a maximum for a given voltage at the terminals of the dynamo. The receiving-station shown in ",
      ),
      ref(
        "Fig. 1",
        "/patents/figures/us-706737-fessenden-wireless/fig-1-source-crop-v1.png",
        "Fig. 1, receiving-station diagram with telephone.",
      ),
      text(
        " comprises a receiving-conductor 10, connected to ground through a telephone-receiver 11, the opposite terminal thereof being connected to ground. As the frequencies of the waves which induce currents in the conductor 10 are low, the diaphragm of the telephone will respond thereto, and the vibrations of the diaphragm will produce audible notes.",
      ),
    ),
    p(
      text("In "),
      ref(
        "Fig. 2",
        "/patents/figures/us-706737-fessenden-wireless/fig-2-source-crop-v1.png",
        "Fig. 2, modified receiving apparatus.",
      ),
      text(
        " is shown another form of receiving apparatus. A portion of the ground connection of the receiving-conductor 10 is formed by a piece of fine wire 12, held in tension between the poles of a magnet 13. By the interaction between the currents passing through the wire 12 and the magnetic field the wire is caused to vibrate, and its vibrations may be observed by means of a microscope or recorded upon a moving strip of sensitized photographic paper. Another form of receiver which may be employed is shown in ",
      ),
      ref(
        "Fig. 2",
        "/patents/figures/us-706737-fessenden-wireless/fig-2-source-crop-v1.png",
        "Fig. 2, liquid thermal receiver.",
      ),
      text(
        ", and consists of a vessel 13 containing a liquid—such as a solution of nitric acid, caustic soda, &c.—in which are immersed two terminals, one of which, 14, is of extremely small cross-sectional area, such as a Wollaston wire of platinum having a diameter of from one-thousandth to one ten-thousandth of an inch. The other terminal may be of any suitable size. The vessel 13 and terminals are included in a circuit with a local battery 15 and telephone 16. When electromagnetic waves strike the receiving-conductor 10, the current induced therein passes through the liquid between the terminals, and by reason of the small size of the terminal 14 the heat generated by the current at or near the terminal 14 changes the resistance of the circuit, and thereby causes a variation in the current flowing through the telephone 16, producing an audible signal.",
      ),
    ),
    p(
      text(
        'By the term "low frequency" as herein used is meant a frequency of less than one million per second, and preferably between twenty-five thousand and one hundred thousand per second. The advantages of using a low frequency and a sending-conductor of large capacity are: First, the energy radiated per second is greater; second, the waves are not absorbed so rapidly by the ground or water over which they travel; third, the waves are not so easily deflected or dissipated by atmospheric conditions; fourth, it is possible to obtain a higher resonance effect at the receiving-station; fifth, it is possible to use receiving instruments which operate by the direct action of the currents induced therein, such as telephones and thermal receivers, instead of coherers which require mechanical tapping to restore them to an operative condition.',
      ),
    ),
    p(
      text(
        "From the above it will be seen that by my invention the internal current losses due to ohmic resistance are largely decreased by using large total capacity and small inductance for the tuning, thereby shortening the length of sending-conductor necessary for a given frequency or for a given wave length in the ether. The shortening of the sending-conductor also facilitates the use of a radiating conductor which is a large fraction of the wave length. The distribution of the capacity makes possible a better form of wave, decreases the resistance of that part of the sending-conductor, and further increases the radiating-surface. With this system, whereby large amounts of energy may be radiated at a low frequency, I am able to substitute for the induction-coil and spark-gap now in use a dynamo or similar source of alternating voltage. If the dynamo be used without the spark-gap, I am able at once to produce a continuous train of radiant waves of substantially uniform strength, as distinguished from the well-known systems wherein the spark-discharge starts a train of waves of rapidly-diminishing power followed by relatively long intervals of no radiation. Furthermore, where the spark discharge is used I am able, by reason of the persistent oscillation coupled with the low frequency, to greatly diminish and, indeed, to completely bridge over the intervals of no radiation, for with ten thousand sparks per second exciting a sending conductor of a periodicity of ninety thousand it is evident that if each spark gives only ten oscillations before being damped sufficiently to stop radiation, every tenth oscillation will coincide with the first oscillation produced by the next succeeding spark. Thus the radiation will be practically continuous, and the total energy of the first oscillation produced by the spark will be divided between only nine electromagnetic waves. From the above it will be seen that by keeping R small and the frequency low I am able to radiate practically continuous streams of electromagnetic waves of an energy sufficient for practically continuous effects at the receiving-station.",
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
          "12. A system for signaling by electromagnetic waves having in combination a conductor adapted to radiate waves of low frequency, and a receiver dependent for its action upon a constant or independently-varying magnetic field and adapted to respond to currents produced by said waves, substantially as set forth.",
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
          "14. A sending-conductor for electromagnetic waves having a natural period of vibration much lower than the period of an ether-wave four times its length, whereby its radiating portion may be a relatively large fraction of the total length of said sending-conductor.",
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
        text(
          "17. A sending-conductor for electromagnetic waves having low resistance, small self-induction and great capacity, substantially as and for the purpose set forth.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 18,
      inlines: [
        text(
          "18. A sending-conductor for electromagnetic waves having low resistance, small self-induction and great capacity so correlated as to support persistent oscillation of a frequency much less than that of an ether-wave of a length four times that of said sending-conductor.",
        ),
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
          "20. A system for transmission of energy by electromagnetic waves including in combination a radiating-conductor and a source of alternating electrical energy or potential, said radiating-conductor and source being coordinated and relatively adjusted to generate and radiate a substantially continuous stream of electromagnetic waves.",
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
      text("REGINALD A. FESSENDEN.\n\n"),
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
