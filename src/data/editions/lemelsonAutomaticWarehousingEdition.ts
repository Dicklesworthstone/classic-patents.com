import type {
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

const words = (value: string): CuratedSpecificationInlines => [{ kind: "text", text: value }];
const paragraph = (inlines: CuratedSpecificationInlines) => ({
  kind: "paragraph" as const,
  inlines,
});
const claim = (number: number, value: string) => ({
  kind: "claim" as const,
  number,
  inlines: words(value),
});
const term = (text: string, definition: string): CuratedSpecificationInline => ({
  kind: "term",
  text,
  definition,
});
const figure = (
  label: "FIG. 1" | "FIG. 2" | "FIG. 3" | "FIG. 4" | "FIG. 5" | "FIG. 6",
  width: number,
  height: number,
): CuratedSpecificationInline => ({
  kind: "reference",
  text: label,
  href: "#",
  referenceType: "figure",
  label: `Open the source-facsimile crop for ${label} in US 3,119,501`,
  figurePreviews: [
    {
      src: `/patents/figures/us-3119501-lemelson-automatic-warehousing/${label.toLowerCase().replace(".", "").replace(" ", "-")}-source-crop-v1.png`,
      alt: `Source-facsimile crop of ${label} from US 3,119,501.`,
      width,
      height,
    },
  ],
});

/** A continuous manual edition checked against the eight-page US 3,119,501 facsimile. */
export const lemelsonAutomaticWarehousingArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "409c2b9fbd3a926b53a9d17ea3acc975fd710953c3a0b56ec4bb2855c64ff7d4",
  preparedBy: "Classic Patents editorial agent (GPT-5.6)",
  preparedAt: "2026-09-01",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE",
        "JEROME H. LEMELSON, OF METUCHEN, NEW JERSEY.",
        "AUTOMATIC WAREHOUSING SYSTEM.",
        "Patent No. 3,119,501. Continuation filed October 10, 1961. Patented January 28, 1964. Application No. 145,013.",
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "SHEET 1",
      title: "Carrier, rack, and track arrangements",
      description: [
        figure("FIG. 1", 3100, 2200),
        { kind: "text", text: " presents the automatic production system and storage racking; " },
        figure("FIG. 2", 2500, 1700),
        { kind: "text", text: " shows a conveyor-unit detail from the same source sheet." },
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "SHEET 2",
      title: "Addressing and control diagrams",
      description: [
        figure("FIG. 3", 2800, 2800),
        { kind: "text", text: " and " },
        figure("FIG. 4", 1600, 1550),
        { kind: "text", text: " provide the source control diagrams; " },
        figure("FIG. 5", 1600, 1300),
        { kind: "text", text: " and " },
        figure("FIG. 6", 1250, 1250),
        { kind: "text", text: " show the photoelectric circuit and remote counter presetting." },
      ],
    },
    { kind: "heading", level: 2, text: "AUTOMATIC WAREHOUSING SYSTEM" },
    paragraph(
      words(
        "This invention relates to an automatic conveying system particularly applicable to the automatic conveyance of work-in-process, materials and finished goods to and from a predetermined storage area and is a continuation of my copending application Ser. No. 449,874 which was filed on July 28, 1954 and is now abandoned.",
      ),
    ),
    paragraph(
      words(
        "Various types of conveyors and conveying systems are known in the art and are applicable for the storage of work-in-process and finished goods. Heretofore conveying equipment for moving palletized or boxed goods into and out of storage have required manual direction or manual remote control. Overhead or floor mounted stacker cranes have been employed for the movement of palletized articles but such equipment requires the manual attendance of an operator. An automatic warehousing system employing closed loop belt conveyors per se is limited to the storage of palletized or boxed material on a particular section of the conveyor and at substantially a single storage level. If storage at multiple levels is desired relatively complex elevating mechanisms and transfer devices are required.",
      ),
    ),
    paragraph(
      words(
        "It is accordingly a primary object of this invention to provide a new and improved automatic conveying apparatus which may be applicable to an automatic warehousing system or the like and which may be operated without human attendance.",
      ),
    ),
    paragraph(
      words(
        "Another object is to provide an improved automatic conveying apparatus including control apparatus for an article carrier which control apparatus may be programmed to effect the storage and conveying from storage selected material or work-in-process without manual attendance and control.",
      ),
    ),
    paragraph([
      {
        kind: "text",
        text: "Referring now to the drawings, there is shown in the automatic production system of ",
      },
      figure("FIG. 1", 3100, 2200),
      {
        kind: "text",
        text: ", a portion of an automatic warehousing system which employs one or more track travelling carriers 20, 30 which may be selectively positioned and remotely controlled as described hereinbelow, for the storage or retrieval of products or work-in-process relative to respective storage volumes in a storage racking system 50.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "The carrier 20 has an overhead track 21 from which is mounted vertically subtending assembly 23, and may have any suitable configuration, two specific designs of which are illustrated in ",
      },
      figure("FIG. 1", 3100, 2200),
      {
        kind: "text",
        text: ". On carrier 20, a first carriage 22 is adapted for movement along the track 21 supported above the storage racking system 50 by conventional means. Subtending assembly 23 serves as a support and guide for a second carriage 25 which is movable up and down on assembly 23 by means of a drive and a motor Mz.",
      },
    ]),
    paragraph([
      { kind: "text", text: "The racking system 50, part of which is illustrated in " },
      figure("FIG. 1", 3100, 2200),
      {
        kind: "text",
        text: ", consists in detail of a plurality of vertical beams 51 joined to horizontal beams 52 in a lattice-like array to define respective cubicles or storage volumes 53a into which pallets 54 containing products, or into which bins 55 containing materials or products, may be stored by the carrier 20, 30 servicing the racking system.",
      },
    ]),
    paragraph([
      { kind: "text", text: "Control of the track travelling carriers 20, 30 of " },
      figure("FIG. 1", 3100, 2200),
      {
        kind: "text",
        text: " to a selected bay or aisle, and of the product holding means or fork assembly 27 to the proper level for selective storage or removal of a product from storage is effected by means of signals generated as the carrier and/or holding means moves, the total of which signals are indicative of the position of said carriers or fork assembly. Such signals may be generated by scanning the racking system 50, floor, overhead track or conveyor vertical column 30 or combinations of these.",
      },
    ]),
    paragraph([
      { kind: "text", text: "In " },
      figure("FIG. 1", 3100, 2200),
      { kind: "text", text: ", a sensing means such as a " },
      term(
        "photo-electric scanner",
        "The source names a light-responsive scanner whose signal changes at position markers. It is a historical optical sensing arrangement, not a modern machine-vision accuracy or safety specification.",
      ),
      {
        kind: "text",
        text: " 37 is shown mounted on the column 33 for movement therewith. The scanner 37 may detect vertical beams 51 by means of sensing markers 56 which effect energization of a photoelectric relay 38 (",
      },
      figure("FIG. 5", 1600, 1300),
      {
        kind: "text",
        text: ") of said scanner 37 and provide a feedback signal as hereafter described in connection with ",
      },
      figure("FIG. 3", 2800, 2800),
      { kind: "text", text: "." },
    ]),
    paragraph([
      {
        kind: "reference",
        text: "The photoelectric scanning means of FIGS. 1 and 2",
        href: "#",
        referenceType: "figure",
        label: "Open the source-facsimile crops for FIGS. 1 and 2 in US 3,119,501",
        figurePreviews: [
          {
            src: "/patents/figures/us-3119501-lemelson-automatic-warehousing/fig-1-source-crop-v1.png",
            alt: "Source-facsimile crop of FIG. 1 from US 3,119,501.",
            width: 3100,
            height: 2200,
          },
          {
            src: "/patents/figures/us-3119501-lemelson-automatic-warehousing/fig-2-source-crop-v1.png",
            alt: "Source-facsimile crop of FIG. 2 from US 3,119,501.",
            width: 2500,
            height: 1700,
          },
        ],
      },
      {
        kind: "text",
        text: ", utilized to generate feedback signals for control of the servo motors positioning the product handling fixture 25, may be replaced by ",
      },
      term(
        "limit switch scanning means",
        "A source-described alternative in which a projecting actuator meets a physical protrusion or post as the carrier travels. It identifies a discrete position event rather than a calibrated force, speed, or timing sensor.",
      ),
      {
        kind: "text",
        text: " mounted on either the carriage 22 or 25 and having actuator means projecting therefrom to be deflected when the carrier 25 moves by either protrusions from the track 21 or the posts of the racking itself which serve as means for identifying each bay as the carrier passes.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "Control of the motors Mx, and Mz for positional control of the conveyor and forks is effected by means of a programming system which employs as a basic control means, the relay switch of scanner 38 (",
      },
      figure("FIG. 5", 1600, 1300),
      {
        kind: "text",
        text: ") which is adapted to become energized as the work carrying fixture moves either vertically or parallel to the storage racking system and provides a feedback signal to a ",
      },
      term(
        "predetermining controller or counter-relay",
        "The source's preset counting relay receives position-indicating events and changes control state when a selected count is reached. The patent does not state a pulse frequency, travel speed, or positional-error bound.",
      ),
      {
        kind: "text",
        text: " which is adapted to uncount and become activated at the end of a predetermined movement of said conveyor.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "In the basic control means of the apparatus of this invention, as illustrated in ",
      },
      figure("FIG. 3", 2800, 2800),
      {
        kind: "text",
        text: ", counters PrCx, PrCz and PrCy are provided to control each of the motors Mx, My and Mz, each of which counters is preset to a predetermined value or count prior to the start of movement of the conveying apparatus to control the stopping of said motor after it has driven the work holding means to a predetermined position in the system.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "The counter PrCx controls motor Mx and is adapted to receive feedback pulses generated by the photoelectric scanner mounted on the first carriage 22 which scanner is adapted to scan position indicating markers 70' or the like provided at predetermined positions along the track 21. The scanner 27' is adjusted to provide an output pulse each time it scans a mark or marker on the track 21 resulting from the increase or decrease in light received by said scanner when in line with said marker. The output of scanner 37' is fed to the input of the predetermining counter PrCx. When PrCx zeros, as carrier 20 moves opposite the selected bay a relay therein energizes the stop-control of motor Mx and the start control for the motor Mz.",
      },
    ]),
    paragraph([
      { kind: "text", text: "In " },
      figure("FIG. 4", 1600, 1550),
      {
        kind: "text",
        text: ", a more general control circuit system diagram is presented which illustrates diagrammatically the scanner 37 which is effective in controlling the various motors of the automatic warehousing system of ",
      },
      figure("FIG. 1", 3100, 2200),
      {
        kind: "text",
        text: ". The predetermining counting devices PrCy, PrCx and PrCz respectively control the conveying motors My, Mx and Mz in response to feedback signals generated by the conveyer positional scanner 37 which scans reflective markers on racking 53.",
      },
    ]),
    paragraph([
      { kind: "text", text: "In the operation of the control system and apparatus of " },
      figure("FIG. 4", 1600, 1550),
      {
        kind: "text",
        text: ", the predetermining counters PrCy, PrCx and PrCz are first pre-set by manual or remote means whereby they will uncount and each effect respective control functions upon uncounting by the operation of one or more switches therein. Assuming that the carrier 20 is situated at a starting or zero position and that the predetermining counters PrCx, PrCy and PrCz have been preset to effect respectively the desired degree of movement of the overhead first carriage 22 as determined by the operation of motor Mx, the advance travel of the fork assembly as determined by the operation of motor My and the vertical positioning of said fork assembly, as determined by the operation of Mz, then a cycle may be initiated by starting motor Mx.",
      },
    ]),
    paragraph([
      figure("FIG. 6", 1250, 1250),
      {
        kind: "text",
        text: " shows a means for effecting the remote pre-setting of the predetermining counter controllers PrC of ",
      },
      {
        kind: "reference",
        text: "FIGS. 3 and 4",
        href: "#",
        referenceType: "figure",
        label: "Open the source-facsimile crops for FIGS. 3 and 4 in US 3,119,501",
        figurePreviews: [
          {
            src: "/patents/figures/us-3119501-lemelson-automatic-warehousing/fig-3-source-crop-v1.png",
            alt: "Source-facsimile crop of FIG. 3 from US 3,119,501.",
            width: 2800,
            height: 2800,
          },
          {
            src: "/patents/figures/us-3119501-lemelson-automatic-warehousing/fig-4-source-crop-v1.png",
            alt: "Source-facsimile crop of FIG. 4 from US 3,119,501.",
            width: 1600,
            height: 1550,
          },
        ],
      },
      {
        kind: "text",
        text: ". A pulse generating dial switch 39 or the like is situated at the operator's station and is adapted to transmit pulse trains on its output 39W in accordance with the position or number dialed.",
      },
    ]),
    { kind: "heading", level: 2, text: "I claim:" },
    claim(
      1,
      "Automatic conveying apparatus comprising in combination (a) a first guide means, (b) a self propelled conveyor including a conveying means in the form of a carriage with means mounted thereon for driving said carriage along said first guide means, (c) said carriage having a second guide means mounted thereon and extending in a generally vertical direction, (d) a second conveying means mounted for movement vertically along said second guide means, (e) a servo drive means mounted on said conveyor for power driving the carriage horizontally along the first guide means and driving said second conveying means vertically relative to said second guide means, (f) said second conveying means including a laterally extending fixture for holding an article thereon, (g) a storage rack having a plurality of storage bays, (h) said first guide means extending substantially parallel to a side of the storage rack which is accessible to the second conveying means, (i) means on the storage rack for identifying the relative positions of said bays, (j) control apparatus for controlling the operation of said servo drive means for positioning said second conveying means at a predetermined position along said first guide means and at a predetermined vertical position relative to said second guide means, (k) a scanning relay means mounted on said self propelled conveyor for scanning said identifying means, (l) said identifying means including a plurality of markers in the scanning path of said scanning relay means, (m) said scanning relay means generating signals for transmission to said control apparatus each time said scanning relay means scans those markers which are in the scanning path said conveyor is moved, (n) said control apparatus including a predetermining counting relay means in circuit with said servo drive means for said carriage said counting means serving to stop said servo drive means upon receipt of a predetermined number of position indicating signals generated by said scanning relay means as said carriage moves along said first guide means.",
    ),
    claim(
      2,
      "Automatic conveying apparatus comprising in combination (a) a first guide means, (b) a self propelled conveyor including a conveying means in the form of a carriage with means mounted thereon for driving said carriage along said first guide means, (c) said carriage having a second guide means mounted thereon and extending in a generally vertical direction, (d) a second conveying means mounted for movement vertically along said second guide means, (e) a servo drive means mounted on said conveyor for power driving the carriage horizontally along the first guide means and power driving said second conveying means vertically relative to said second guide means, (f) said second conveying means including a laterally extending fixture for holding an article thereon, (g) a storage rack having a plurality of storage bays, (h) said first guide means extending substantially parallel to a side of the storage rack which is accessible to the second conveying means, (i) means for identifying the positions of said bays, (j) control apparatus for controlling the operation of said servo drive means for positioning said second conveying means at a predetermined position along said first guide means and at a predetermined vertical position relative to said second guide means, (k) a scanning relay means mounted on said self propelled conveyor for scanning said identifying means, (l) said identifying means including a plurality of markers in the scanning path of said scanning relay, (m) said scanning relay means generating signals for transmission to said control apparatus each time said scanning relay scans those markers in said scanning path of travel as said conveyor is moved, (n) said control apparatus including a predetermining counting relay means in circuit with said servo drive means for said carriage, said control apparatus serving to stop said servo drive means upon receipt of a predetermined number of position indicating feedback signals generated as sensed from the identifying means as said carriage moves along said first guide means.",
    ),
    claim(
      3,
      "Automatic conveying apparatus comprising in combination (a) a first guide means, (b) a self propelled conveyor including a conveying means in the form of a carriage with means mounted thereon for driving said carriage along said first guide means, (c) said carriage having a second guide means mounted thereon and extending in a generally vertical direction, (d) a second conveying means mounted for movement vertically along said second guide means, (e) a servo drive means mounted on said conveyor for power driving the carriage horizontally along the first guide means and power driving said second conveying means vertically relative to said second guide means, (f) said second conveying means including a laterally extending fixture for holding an article thereon, (g) a storage rack having a plurality of storage bays, (h) said first guide means extending substantially parallel to a side of the storage rack which is accessible to the second conveying means, (i) means on the storage rack for identifying the positions of said bays, (j) control apparatus for controlling the operation of said servo drive means for positioning said second conveying means at a predetermined position along said first guide means and at a predetermined vertical position relative to said second guide means, (k) a scanning relay mounted on said self propelled conveyor for scanning said identifying means, (l) said identifying means including a plurality of reflective markers in the scanning path of said scanning relay, (m) said scanning relay means generating feedback signals for transmission to said control apparatus each time said scanning relay scans those reflective markers in said scanning path of travel as said conveyor is moved, (n) said control apparatus including a predetermining counting relay means in circuit with said servo drive means for said first and second conveying means, said control apparatus serving to stop said servo drive means upon receipt of a predetermined number of position indicating feedback signals generated as sensed from the identifying means as said first and second conveying means moves along said first and second guide means, respectively.",
    ),
    claim(
      4,
      "Automatic conveying apparatus comprising in combination: a first guide means, a self propelled conveyor including a first conveying means in the form of a carriage with means mounted thereon for driving said carriage along said first guide means, said carriage having a second guide means mounted thereon and extending in a generally vertical direction, a second conveying means mounted for movement vertically along said second guide means, a servo drive means mounted on said conveyor for driving the carriage horizontally along said first guide means and driving said second conveying means vertically relative to said second guide means, said second conveying means including a laterally extending fixture for holding an article thereon, a storage rack having a plurality of storage bays, said first guide means extending substantially parallel to a side of the storage rack which is accessible to the second conveying means, means for identifying the relative positions of said bays, control apparatus for controlling the operation of said servo drive means for positioning said second conveying means at a predetermined position along said first guide means and at a predetermined vertical position relative to said second guide means, and a scanning relay means mounted on said self propelled conveyor for scanning said identifying means, said identifying means including a plurality of devices for abruptly changing the ambient light pattern in the scanning path of said scanning relay means, said scanning relay means generating signals for transmission to said control apparatus each time said scanning relay means scans said devices which are in its scanning path, said control apparatus including a predetermining counting relay means in circuit with said servo drive means for said carriage, said counting means serving to stop said servo drive means upon receipt of a predetermined number of position indicating signals which are generated by said scanning means as said carriage moves along said first guide means.",
    ),
    claim(
      5,
      "Automatic conveying apparatus comprising in combination: a first guide means, a self propelled conveyor including a first conveying means in the form of a carriage with means mounted thereon for driving said carriage along said first guide means, said carriage having a second guide means mounted thereon and extending in a generally vertical direction, a second conveying means mounted for movement vertically along said second guide means, a servo drive means mounted on said conveyor for driving the carriage horizontally along said first guide means and driving said second conveying means vertically relative to said second guide means, said second conveying means including a laterally extending fixture for holding an article thereon, a storage rack having a plurality of storage bays, said first guide means extending substantially parallel to a side of the storage rack which is accessible to the second conveying means, means for identifying the relative positions of said bays, control apparatus for controlling the operation of said servo drive means for positioning said second conveying means at a predetermined position along said first guide means and at a predetermined vertical position relative to said second guide means, and a scanning relay means mounted on said self propelled conveyor for scanning said identifying means, means for generating an energy field in the vicinity of said conveyor, said storage bay identifying means are supported in said energy field for abruptly changing the level of said energy field in the immediate vicinity of each of said means, there being at least one such identifying means for each of said storage bays, and scanning relay means responsive to changes in the level of said energy field for generating output signals and arranged to scan said identifying means as said carriage moves, said scanning relay means generating signals for transmission to said control apparatus each time said scanning relay means scans said devices which are in its scanning path, said control apparatus including a predetermining counting relay means in circuit with said servo drive means for said carriage, said counting means serving to stop said servo drive means upon receipt of a predetermined number of position indicating signals which are generated by said scanning means as said carriage moves along said first guide means.",
    ),
    claim(
      6,
      "Automatic conveying apparatus in accordance with claim 2, wherein said scanning relay means comprise limit switch means, and said markers comprise protrusion means in the path of travel of said limit switch means.",
    ),
  ],
};

export const lemelsonAutomaticWarehousingParallelReadings: Record<number, readonly string[]> = {
  4: [
    "The grant opens by locating the invention in automatic movement of work-in-process, materials, and finished goods to and from a selected storage area. It also records that the 1961 case is a continuation of an earlier application.",
  ],
  5: [
    "Lemelson states the prior logistical problem in concrete terms: manual direction, manual remote control, and limited single-level conveyor storage. The relevant engineering response is coordinated addressing across travel, lift, and transfer axes.",
  ],
  6: [
    "The first stated object is not merely a rack but an automatic conveying apparatus for a warehouse. The surrounding claims later specify the moving carrier, vertical guide, storage bays, sensing, and count-driven stopping logic.",
  ],
  7: [
    "The second object introduces a programmed carrier that stores or retrieves selected material without manual attendance. The patent-era phrase does not imply present-day autonomous-system safety, throughput, or reliability guarantees.",
  ],
  8: [
    "The text anchors the mechanism to a physical warehouse: track-travelling carriers, racking volumes, and a retrieval or storage operation. It is a spatial machine plus feedback control, not an abstract inventory database.",
  ],
  9: [
    "Carrier 20 supplies a horizontal guide while its subtending assembly guides a second carriage vertically. This supplies two independently addressable coordinates before the fork or fixture reaches into a bay.",
  ],
  10: [
    "The rack is a lattice of vertical and horizontal beams defining storage volumes. The claims use that physical bay geometry together with position-identifying means rather than treating a storage location as a purely symbolic label.",
  ],
  11: [
    "The source says movement generates position-indicating signals, which allows a chosen aisle and level to be reached. The simulator exposes that causal topology with normalized controls because the grant gives no source-backed dimensions or speeds.",
  ],
  12: [
    "The photoelectric scanner observes source-described markers and sends feedback to the control logic. Its historical light-and-relay arrangement is neither a measurement of industrial accuracy nor a basis for claims about modern vision systems.",
  ],
  13: [
    "The patent expressly supplies a mechanical alternative: a limit-switch actuator meeting protrusions or racking posts. Claim 6 narrows that alternative, showing that the broader claims are not restricted to optical sensing alone.",
  ],
  14: [
    "The preset counter receives position events and changes the motor state when its selected count is exhausted. This is the most important control-loop idea: a physical address becomes a sequence of discrete feedback events.",
  ],
  15: [
    "Figure 3 separates counters for the carrier motions and ties each to motor stopping at a selected position. The drawing supports a coordinate-addressing architecture, but not a measured cycle time, velocity profile, or payload capacity.",
  ],
  16: [
    "The rail counter uses marker pulses to stop horizontal travel and begin vertical travel at the selected bay. It is an electromechanical predecessor of discrete position feedback, not a modern encoder specification.",
  ],
  17: [
    "The broader Figure 4 diagram makes the three-axis relationship explicit: one counter per motion direction and feedback from the moving scanner. It is useful pedagogy because it preserves the original sequencing logic across the machine.",
  ],
  18: [
    "The source describes pre-setting the three counts manually or remotely, then beginning the cycle with the rail motor. The museum treats those as normalized address inputs rather than a prescription for operating material-handling equipment.",
  ],
  19: [
    "Figure 6 shows a remote pulse-generating dial arrangement for setting a count. The historical interaction is a selected number of pulses sent to the counter; it is not evidence of a networked inventory-management system or a contemporary software interface.",
  ],
};
