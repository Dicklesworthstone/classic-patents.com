import type {
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

const text = (value: string): CuratedSpecificationInlines => [{ kind: "text", text: value }];
const p = (inlines: CuratedSpecificationInlines) => ({ kind: "paragraph" as const, inlines });
const claim = (number: number, value: string) => ({
  kind: "claim" as const,
  number,
  inlines: text(value),
});

/**
 * Direct 300 DPI renders of the two pinned drawing sheets. The original
 * isolated preview files remain preserved as research evidence, but active
 * citations deliberately retain the whole historic sheet and its context.
 */
const SOURCE_SHEET_1 = {
  src: "/patents/figures/us-2292387-lamarr-frequency-hopping/source-sheet-1-v1.png",
  width: 2320,
  height: 3408,
} as const;

const SOURCE_SHEET_2 = {
  src: "/patents/figures/us-2292387-lamarr-frequency-hopping/source-sheet-2-v1.png",
  width: 2320,
  height: 3408,
} as const;

const FIGURE_PREVIEWS = {
  "Fig. 1": {
    ...SOURCE_SHEET_1,
    alt: "US 2,292,387 drawing sheet 1, containing Figs. 1-3; Fig. 1 is the transmitting-station apparatus.",
  },
  "Fig. 2": {
    ...SOURCE_SHEET_1,
    alt: "US 2,292,387 drawing sheet 1, containing Figs. 1-3; Fig. 2 is the receiving-station apparatus.",
  },
  "Fig. 3": {
    ...SOURCE_SHEET_1,
    alt: "US 2,292,387 drawing sheet 1, containing Figs. 1-3; Fig. 3 is the simultaneous record-strip release circuit.",
  },
  "Fig. 4": {
    ...SOURCE_SHEET_2,
    alt: "US 2,292,387 drawing sheet 2, containing Figs. 4-7; Fig. 4 is the perforated record strip.",
  },
  "Fig. 5": {
    ...SOURCE_SHEET_2,
    alt: "US 2,292,387 drawing sheet 2, containing Figs. 4-7; Fig. 5 is the record-responsive pneumatic switching mechanism.",
  },
  "Fig. 6": {
    ...SOURCE_SHEET_2,
    alt: "US 2,292,387 drawing sheet 2, containing Figs. 4-7; Fig. 6 is the control-head starting-pin section.",
  },
  "Fig. 7": {
    ...SOURCE_SHEET_2,
    alt: "US 2,292,387 drawing sheet 2, containing Figs. 4-7; Fig. 7 is the torpedo-course plan.",
  },
} as const;

const fig = (value: keyof typeof FIGURE_PREVIEWS): CuratedSpecificationInline => ({
  kind: "reference",
  text: value,
  href: "#",
  referenceType: "figure",
  label: `Preview the complete US 2,292,387 source sheet containing ${value}`,
  figurePreviews: [FIGURE_PREVIEWS[value]],
});

const term = (value: string, definition: string): CuratedSpecificationInline => ({
  kind: "term",
  text: value,
  definition,
});

/** Complete continuous edition manually checked against every sheet of US 2,292,387. */
export const lamarrFrequencyHoppingArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "8204e975e2ea96f34973b87f3cab20d28604e52596c116af367facb74e319292",
  preparedBy: "Classic Patents editorial agent (MossyFortress)",
  preparedAt: "2026-08-18",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "Patented Aug. 11, 1942.",
        "2,292,387.",
        "UNITED STATES PATENT OFFICE.",
        "SECRET COMMUNICATION SYSTEM",
        "Hedy Kiesler Markey, Los Angeles, and George Antheil, Manhattan Beach, Calif.",
        "Application June 10, 1941, Serial No. 397,412.",
        "6 Claims. (Cl. 250-2.)",
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIGS. 1-3",
      title: "2 Sheets-Sheet 1",
      description: text(
        "Aug. 11, 1942. H. K. MARKEY ET AL. 2,292,387. SECRET COMMUNICATION SYSTEM. Filed June 10, 1941.",
      ),
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIGS. 4-7",
      title: "2 Sheets-Sheet 2",
      description: text(
        "Aug. 11, 1942. H. K. MARKEY ET AL. 2,292,387. SECRET COMMUNICATION SYSTEM. Filed June 10, 1941.",
      ),
    },
    p([
      {
        kind: "text",
        text: "This invention relates broadly to secret communication systems involving the use of carrier waves of different frequencies, and is especially useful in the remote control of ",
      },
      term(
        "dirigible craft",
        "A craft whose course can be remotely directed; the specification uses the term for a torpedo.",
      ),
      { kind: "text", text: ", such as torpedoes." },
    ]),
    p(
      text(
        "An object of the invention is to provide a method of secret communication which is relatively simple and reliable in operation, but at the same time is difficult to discover or decipher.",
      ),
    ),
    p([
      {
        kind: "text",
        text: "Briefly, our system as adapted for radio control of a remote craft, employs a pair of ",
      },
      term(
        "synchronous records",
        "Two physical records whose corresponding positions are intended to pass their control heads together, so that the transmitter and receiver choose matching tuning states.",
      ),
      {
        kind: "text",
        text: ", one at the transmitting station and one at the receiving station, which change the tuning of the transmitting and receiving apparatus from time to time, so that without knowledge of the records an enemy would be unable to determine at what frequency a controlling impulse would be sent. Furthermore, we contemplate employing records of the type used for many years in ",
      },
      term(
        "player pianos",
        "Mechanically programmed instruments whose paper rolls contain perforations in longitudinal tracks; the patent uses that physical recording idea for a radio-tuning sequence.",
      ),
      {
        kind: "text",
        text: ", and which consist of long rolls of paper having perforations variously positioned in a plurality of longitudinal rows along the records. In a conventional player piano record there may be 88 rows of perforations, and in our system such a record would permit the use of 88 different carrier frequencies, from one to another of which both the transmitting and receiving station would be changed at intervals. Furthermore, records of the type described can be made of substantial length and may be driven slow or fast. This makes it possible for a pair of records, one at the transmitting station and one at the receiving station, to run for a length of time ample for the remote control of a device such as a torpedo.",
      },
    ]),
    p(
      text(
        "The two records may be synchronized by driving them with accurately calibrated constant-speed spring motors, such as are employed for driving clocks and chronometers. However, it is also within the scope of our invention to periodically correct the position of the record at the receiving station by transmitting synchronous impulses from the transmitting station. The use of synchronizing impulses for correcting the phase relation of rotary apparatus at a receiving station is well-known and highly developed in the fields of automatic telegraphy and television.",
      ),
    ),
    p([
      {
        kind: "text",
        text: "Other more specific objects and features of our invention will appear from the following detailed description of a particular embodiment thereof, as illustrated in the drawings, in which ",
      },
      fig("Fig. 1"),
      {
        kind: "text",
        text: " is a schematic diagram of the apparatus at a transmitting station; ",
      },
      fig("Fig. 2"),
      { kind: "text", text: " is a schematic diagram of the apparatus at a receiving station; " },
      fig("Fig. 3"),
      {
        kind: "text",
        text: " is a schematic diagram illustrating a starting circuit for starting the motors at the transmitting and receiving stations simultaneously; ",
      },
      fig("Fig. 4"),
      {
        kind: "text",
        text: " is a plan view of a section of a record strip that may be employed; ",
      },
      fig("Fig. 5"),
      {
        kind: "text",
        text: " is a detail cross section through a record-responsive switching mechanism employed in the invention; ",
      },
      fig("Fig. 6"),
      { kind: "text", text: " is a sectional view at right angles to the view of " },
      fig("Fig. 5"),
      { kind: "text", text: " and taken substantially in the plane VI-VI of " },
      fig("Fig. 5"),
      {
        kind: "text",
        text: ", but showing the record strip in a different longitudinal position; and ",
      },
      fig("Fig. 7"),
      {
        kind: "text",
        text: " is a diagram in plan illustrating how the course of a torpedo may be changed in accordance with the invention.",
      },
    ]),
    p([
      { kind: "text", text: "Referring first to " },
      fig("Fig. 7"),
      {
        kind: "text",
        text: ", there is disclosed a mother ship 10 which at the beginning of operations occupies the position 10a and at the end of the operations occupies the position 10b. This mother ship discharges a torpedo 11 that travels successively along different paths 12, 13, 14, 15 and 16 to strike an enemy ship 17, which initially occupies the position 17a but which has moved into the position 17b at the time it is struck by the torpedo 11. According to its original course, the enemy ship 17 would have reached the position 17c, but it changed its course following the firing of the torpedo, in an attempt to evade the torpedo.",
      },
    ]),
    p(
      text(
        "In accordance with the present invention, the torpedo 11 can be steered from the mother ship 10a and its course changed from time to time as necessary to cause it to strike its target. In directing the torpedo it may, under some circumstances, be observed directly from the mother ship 10, or its course may be followed by an observer in an airplane 18 who communicates his findings to the mother ship 10a. It is also possible to control the torpedo directly from the airplane 18 if the latter is equipped with the necessary synchronous transmitting equipment in accordance with the invention.",
      ),
    ),
    p([
      { kind: "text", text: "Under the particular circumstances of " },
      fig("Fig. 7"),
      {
        kind: "text",
        text: ", the enemy ship 17 was traveling in a straight line substantially parallel to the mother ship 10 at the time the torpedo was discharged, and the latter was directed forwardly at a substantial angle to compensate for the speed of the ship 17 and for water currents represented by the small arrows 19. However, as a result of the change in course of the enemy ship 17 and the effect of the water currents, it is observed that the torpedo, if it continues on its original course, will miss the enemy ship. Hence it is steered by remote control to depart from the path 12 and follow the path 13. At later times it is noted that further changes are necessary, and its course is successively changed from the path 13 to the path 14, to the path 15, and to the path 16, in order to strike the enemy ship 17b.",
      },
    ]),
    p(
      text(
        "The remote control of the torpedo as described is old and broadly does not constitute a part of our invention. However, it has been very difficult in the past to employ radio control of a torpedo, for the reason that the enemy could quickly discover the frequency of the control signals and block control of the torpedo by sending false signals of the same frequency.",
      ),
    ),
    p(
      text(
        "In accordance with our invention, we employ variable frequency radio transmitters and receivers for the remote control, and change the frequency at intervals by synchronous records at the two stations.",
      ),
    ),
    p([
      { kind: "text", text: "Referring to " },
      fig("Fig. 1"),
      {
        kind: "text",
        text: ", the apparatus at the transmitting station includes as its main elements a variable-frequency carrier oscillator 20, a modulator 21, an amplifier 22, and an antenna 23. These elements are represented schematically since their exact construction does not constitute a part of the present invention. Suffice it to say that the variable-frequency carrier oscillator 20 is controlled to oscillate at different frequencies by a plurality of ",
      },
      term(
        "tuning condensers",
        "The period term for capacitors used here as individually switchable reactive elements that set the oscillator or receiver-selector tuning state.",
      ),
      {
        kind: "text",
        text: " 24a, 24b, 24c, 24d, 24e, 24f, and 24g, adapted to be independently connected to the oscillator by automatically controlled switches 31, one for each condenser. The different condensers 24a to 24g, inclusive, are of different capacities, and these differences are indicated in the drawings by different spacings between the plates.",
      },
    ]),
    p([
      { kind: "text", text: "Two controls are provided in the system of " },
      fig("Fig. 1"),
      {
        kind: "text",
        text: ", in the form of two keys L and R, respectively. Key L is employed to transmit a signal for applying left rudder to the distant torpedo, and the key R is employed to apply right rudder to the torpedo. Actuation of the key L closes main contacts 32, which connect the output of the oscillator 20 to the modulator 21, and at the same time closes contacts 33, which connect a 100-cycle oscillator 34 to the modulator 21, which thereupon modulates the particular carrier wave being generated at that time by the oscillator 20. The modulated carrier wave is then amplified in the amplifier 22 and transmitted from the antenna 23. If the operator desires to apply right rudder to the distant torpedo, he actuates the key R, which closes the main contacts 32 and also closes contacts 35, which connect a 500-cycle oscillator 36 to the modulator 21.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "The switches 31 are selectively closed by a record-controlled mechanism actuated by a ",
      },
      term(
        "record strip",
        "The elongated perforated paper ribbon that stores the ordered control positions. Its holes mechanically select tuning-switch contacts as the strip moves past the head.",
      ),
      {
        kind: "text",
        text: " 37, which is drawn off a supply roll 38 over a control head 39 and wound up on a take-up spool 40 driven by a constant-speed clock motor 41. Referring now to ",
      },
      fig("Fig. 4"),
      {
        kind: "text",
        text: ", the record strip 37 has perforations arranged in eight different longitudinally extending rows A, B, C, D, E, F, G, and H, respectively. Perforations in the rows A, B, C, D, E, F, and G control the seven switches 31 associated with the different tuning condensers 24a to 24g, inclusive. The perforations in row H control an auxiliary switch 42 (",
      },
      fig("Fig. 1"),
      {
        kind: "text",
        text: "), which lights a signal lamp 43 from a battery 44. The strip 37 is drawn over the control head 39, as previously mentioned, and the control head responds to perforations in the different rows A to H, inclusive, on the strip, to close the various switches 31 and the switch 42.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "A typical construction that may be used in the control head 39 is shown in ",
      },
      fig("Fig. 5"),
      { kind: "text", text: " and " },
      fig("Fig. 6"),
      {
        kind: "text",
        text: ". Thus it may comprise a block or shoe 45 over which the record strip is drawn and which has a plurality of vertical passages 46, the orifices of which are juxtaposed to the different rows A to H, inclusive, of the strip. In ",
      },
      fig("Fig. 5"),
      {
        kind: "text",
        text: " two of the passages 46 are shown juxtaposed to and in communication with apertures in the two rows C and G of the strip 37. Each of the passages 46 is communicated by a restricted passage 47 with a ",
      },
      term(
        "suction manifold",
        "A common evacuated conduit supplied by the suction pump. Through restricted passages it holds a piston up while a solid part of the paper covers the matching orifice.",
      ),
      {
        kind: "text",
        text: " 48, which is connected by a tube 49 to a suction pump 50. Each of the passages 46 is also connected by a tube 51 to the upper end of an associated cylinder 52 containing a piston 53. Each piston 53 projects from the lower end of its associated cylinder 52 and overlies a movable spring 54 of one of the tuning switches 31. The movable spring 54 is separated by a block of insulation 55 from the lower end of its associated piston 53. The pistons are normally maintained in upper position in which shoulders 56 thereon lie against the lower face of the cylinder block 57 containing the cylinders 52, under which conditions the contacts 31 are open. However, under certain conditions to be described, the pistons 53 are urged downwardly, by compression springs 53a positioned thereabove, to carry the movable springs 54 against the cooperating contact springs 58 to close the switches 31.",
      },
    ]),
    p(
      text(
        "The pistons 53 are maintained in uppermost position, in which the switches 31 are open, when a solid portion of the record strip 37 overlies the passages 46, but are depressed by the springs 53a when apertures in the record strip move into registration with the passages 46. Thus so long as the upper end of a passage 46 is closed by the record strip 37, suction is applied from the manifold 48 through the restricted passage 47 to the cylinder 52, and lifts the piston 53 against the force of the spring 53a. However, when a perforation in the record strip is in registration with a passage 46, air flows freely into the upper end of the passage and into the restricted passage 47, thereby breaking the suction applied to the upper end of the piston 53 and permitting the spring 53a to move the piston downwardly and close the associated switch 31.",
      ),
    ),
    p([
      {
        kind: "text",
        text: "It will be obvious that by so positioning the perforations in the different rows A, B, C, D, E, F, and G, that perforations in different rows are successively brought into registration with their associated passages 46 (",
      },
      fig("Fig. 5"),
      {
        kind: "text",
        text: "), different ones of the switches 31 will be successively closed, to connect different ones of the tuning condensers 24a to 24g (",
      },
      fig("Fig. 1"),
      {
        kind: "text",
        text: ") inclusive, to the oscillator 20 and thereby change the frequency of the carrier wave. Furthermore the frequency changes can be purely arbitrary, without any periodic recurrence that would render it easy for an enemy to anticipate the frequency at any particular instant.",
      },
    ]),
    p([
      { kind: "text", text: "Referring now to " },
      fig("Fig. 2"),
      {
        kind: "text",
        text: ", the apparatus at the receiving station, which may be on the torpedo 11 of ",
      },
      fig("Fig. 1"),
      {
        kind: "text",
        text: ", comprises a receiving antenna 60 and a signal selector 61 that may be tuned to any one of four different frequencies by connecting thereto different condensers 24'd, 24'e, 24'f, and 24'g. When the condenser 24'd is connected to the selector 61 and the condenser 24d is connected to the oscillator 20, the transmitter and receiver are both tuned to the same frequency, and so on. When a signal received on the antenna 60 is of the same frequency to which the selector 61 is tuned, the signal is amplified in an amplifier 64 and delivered to a detector 65. There will then appear in the output of the detector the modulation wave that was impressed upon the carrier at the transmitting station, and this modulation wave is applied to the input of a pair of filters 166 and 566, the first of which is tuned to 100-cycles and the second to 500-cycles. The output of the filter 166 is delivered through a rectifier 168 to a magnet 169, and the output of the filter 566 is delivered through a rectifier 568 to a magnet 569. The magnets 169 and 569 act on a common armature 72, which is normally positioned in a neutral position but moves in response to energization of magnet 169 to close on a contact 170 and moves in response to energization of magnet 569 to close on a contact 570.",
      },
    ]),
    p([
      { kind: "text", text: "If a received signal was produced by actuation of the key L (" },
      fig("Fig. 1"),
      {
        kind: "text",
        text: ") at the transmitting station, then it is modulated with a wave of 100-cycles, and the modulation wave will be passed by the filter 166 to energize the magnet 169 and close the armature 72 on the contact 170, thereby completing a circuit from a battery 74 through a solenoid 175. The solenoid thereupon attracts its plunger 176, causing a pawl 177, connected to the plunger, to be pulled into engagement with ratchet teeth 178 on a rudder wheel 79 and advance the wheel clockwise by the length of one of the ratchet teeth. A spring 180 normally maintains the pawl 177 clear of the teeth 178, and a stationary cam face 181 guides the pawl into engagement with the ratchet teeth as it is moved by the plunger 176. The rudder wheel 79 is secured to a rudder post 82 carrying a rudder 83, so that the rudder is moved a predetermined distance toward the left in response to a single actuation of the key L at the transmitting station. The key need be closed only momentarily, and as soon as it is released the magnet 169 and the solenoid 175 are released, whereupon the pawl 177 and plunger 176 are retracted into neutral position by the spring 180.",
      },
    ]),
    p(
      text(
        "If the key R at the transmitting station is actuated, then the carrier wave is modulated with the 500-cycle modulating wave, which is passed by the filter 566 at the receiving station, to energize the magnet 569. This closes the armature 72 on the contact 570, to energize a solenoid 575, identical with the solenoid 175, and actuate a pawl 577 which engages with ratchet teeth 578. The latter are oppositely directed with respect to the ratchet teeth 178, so that the pawl 577 and the teeth 578 function to shift the rudder 83 to the right, instead of to the left. Some means must be provided to retain the rudder 83 in whatever position it has been moved by the pawl 177 or 577, and we have shown a brake drum 84 frictionally engaged by a brake-band 85 and connected by a pinion 86 and a gear segment 87 to the rudder wheel 79. The brake-band 85 offers sufficient frictional resistance to movement of the rudder to retain it in the position to which it has been moved, but insufficient to prevent movement of the rudder by the pawls 177 and 577.",
      ),
    ),
    p([
      {
        kind: "text",
        text: "The tuning condensers 24'd to 24'g, inclusive, at the receiving station are adapted to be connected one at a time to the selector 61, to tune it to different frequencies, by contacts 31' similar to the contacts 31 at the transmitting station, and actuated in the same way under the control of a record strip 37', which may be identical with the record strip 37 at the transmitting station, and is pulled over a control head 39' by a clock motor 41' which runs at the same speed as the motor 41 at the transmitting station. The details of the control head 39' and the switches 31', whereby the latter are closed in response to differently positioned perforations in the record strip 37', are the same as those at the transmitting station, which were described with reference to ",
      },
      fig("Fig. 5"),
      { kind: "text", text: " and " },
      fig("Fig. 6"),
      { kind: "text", text: "." },
    ]),
    p([
      {
        kind: "text",
        text: "It is of course necessary that the record strips 37 and 37' at the transmitting and receiving stations, respectively, be started at the same time and in proper phase relation with each other, so that corresponding perforations in the two record strips will move over their associated control heads at the same time. We therefore provide an apparatus for holding both record strips in a starting position until the torpedo is fired, and for then simultaneously releasing both strips so that they can be moved at the same speed by their associated motors 41 and 41'. The holding mechanism at each station includes a pin 100 (",
      },
      fig("Fig. 6"),
      {
        kind: "text",
        text: ") slidably mounted for vertical movement in the head 45 and adapted to engage a special starting hole 101 (",
      },
      fig("Fig. 4"),
      {
        kind: "text",
        text: ") in its associated record strip. The pin 100 is normally urged into a lower position by a compression spring 102, as shown in ",
      },
      fig("Fig. 5"),
      {
        kind: "text",
        text: ", so that it is clear of the record strip and does not impede its movement. However, the pin is adapted to be held in upper position in engagement with the hole 101 in the record strip, by a solenoid 103 having a plunger 104 which is connected to the pin 100. The solenoid is shown energized in ",
      },
      fig("Fig. 6"),
      { kind: "text", text: "." },
    ]),
    p([
      { kind: "text", text: "Referring now to " },
      fig("Fig. 3"),
      { kind: "text", text: ", when a torpedo equipped with the apparatus disclosed in " },
      fig("Fig. 2"),
      {
        kind: "text",
        text: " is prepared for firing from the mother ship, on which the transmitting apparatus of ",
      },
      fig("Fig. 1"),
      {
        kind: "text",
        text: " is mounted, both the solenoid 103 on the torpedo and the solenoid 103 in the transmitting equipment, are connected in series with a battery 105 by a circuit including conductors 106 which extend between the torpedo and the transmitting station on the mother ship, thereby holding both record strips in starting position. When the torpedo is fired, the conductors 106 are broken, thereby interrupting the series energizing circuit of the solenoids 103 and releasing both solenoids simultaneously to permit the strips at both stations to start in phase with each other.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "It will be noted that whereas there are seven tuning condensers 24 at the transmitting station, there are only four tuning condensers 24' at the receiving station. The extra three tuning condensers at the transmitting station provide three additional channels for the transmitter for which there are no corresponding channels at the receiver, to thereby permit the sending of false impulses to confuse the enemy. In the particular system shown, the receiving apparatus is effective to receive on the channels D, E, F, and G, but is ineffective to receive on the channels A, B, and C. If the operator at the transmitting station sent a signal while the oscillator was operating on one of the channels A, B, or C, the signal would not be received on the torpedo. It is therefore desirable to provide an indicator to advise the operator at the transmitting station when the transmitting and receiving stations are both tuned to the same frequency. The lamp 43, actuated by the auxiliary switch 42 (",
      },
      fig("Fig. 1"),
      { kind: "text", text: ") constitutes such an indicator." },
    ]),
    p([
      {
        kind: "text",
        text: "The switch 42 is closed to light the lamp 43 whenever an aperture in row H (",
      },
      fig("Fig. 4"),
      {
        kind: "text",
        text: ") of the record strip moves over its associated passage 46 in the control head 39. The perforations in row H of the record strip are so arranged as to light the lamp 43 whenever the operator should not send a control signal. To this end, the perforations in the row H on the record strip occur at the beginning and end of each perforation in the rows D, E, F, and G, and extend between successive, spaced, perforations in these rows (at which times perforations occur in one or more of the rows A, B, and C, which transmit false signals). The mechanism arranged as described functions to light the lamp 43 for a short time during each transition from one to another of the useful channels D, E, F, and G, to warn the operator not to transmit a control impulse at the moment of transition from one frequency to another. The lamp 43 remains lighted throughout periods when the transmitter is tuned to transmit in any one of the channels A, B, or C. The operator will, of course, occasionally transmit impulses while the transmitter is tuned to one of the channels A, B, or C, to mislead the enemy, but he will know, by the fact that the lamp 43 is lighted, that these impulses will not affect the torpedo.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "It will be understood that many variations from the construction shown can be made without departing from the invention. Thus in order to simplify the drawings a record strip having only eight rows of perforations has been illustrated. However, as previously mentioned, similar record strips employed in player pianos now have as many as 88 rows of perforations, and a similar number could be employed in the present system to provide a large number of useable channels, to which both the transmitting and receiving stations can be tuned, and also a large number of auxiliary channels at the transmitter for sending false signals. If desired, the perforations corresponding to the false signals may be omitted from the record strip at the receiver. However this is not necessary. The record strip at the transmitting and the receiving stations can be identical in all respects, and any number of rows of perforations in the record strip at the receiving station can be rendered ineffective by blocking the passages 46 in the receiving head that correspond to the false channels. It will also be obvious that the control heads 39 and 39' at the transmitting and receiving stations, respectively, can be identical but the contact springs 54 and 58 (",
      },
      fig("Fig. 6"),
      {
        kind: "text",
        text: ") at the receiver can be left disconnected in those channels in which false signals are transmitted.",
      },
    ]),
    p(
      text(
        "A very important feature of our system is that only relatively few and relatively short signals need be transmitted. Thus it is necessary only to close one of the keys L or R momentarily to deflect the rudder 83 by one increment in either direction. The transmission of a very short impulse may not be discovered by the enemy at all. Even if the enemy should pick up one of the impulses transmitted, he would not know whether it was an effective signal or a false signal. Furthermore, it is quite possible to so arrange the records that the receiver is never twice tuned to the same frequency.",
      ),
    ),
    p(
      text(
        "Although the invention has been explained by describing in detail its application to the control of a torpedo or other craft where it is necessary to steer in only one dimension, it will be obvious to those skilled in the art that by using a large number of modulation frequencies, additional functions can be performed. Thus by using four modulation waves having frequencies of say 100-cycles, 500-cycles, 1,000-cycles and 2,000-cycles, respectively, and using appropriate filters at the receiving station, it is obvious that two rudders can be controlled. This would be desirable when controlling aerial torpedoes or other types of craft in which control in a vertical direction, as well as in a horizontal direction, is desirable. There is no particular limit to the number of control channels that can be used with our invention.",
      ),
    ),
    p(
      text(
        'It is also to be understood that other methods of modulation than the conventional one shown, including frequency modulation or phase modulation, can be employed in our system. The expression "carrier wave," as used in the claims, is intended to define the unmodulated wave when phase or frequency modulation is employed. Various other departures from the exact system described will be apparent to those skilled in the art, and the invention is, therefore, to be limited only as set forth in the appended claims.',
      ),
    ),
    { kind: "heading", level: 2, text: "We claim:" },
    claim(
      1,
      "In a secret communication system, a transmitting station including means for generating and transmitting carrier waves of a plurality of frequencies, a first elongated record strip having differently characterized, longitudinally disposed recordings thereon, record-actuated means selectively responsive to different ones of said recordings for determining the frequency of said carrier waves, means for moving said strip past said record-actuated means whereby the carrier wave frequency is changed from time to time in accordance with the recordings on said strip, a receiving station including carrier wave-receiving means having tuning means tunable to said carrier wave frequencies, a second record strip, record-actuated means selectively responsive to different recordings on said second record strip for tuning said receiver to said predetermined carrier frequencies, and means for moving said second strip past its associated record-actuated means in synchronism with said first strip, whereby the record-actuated means at the transmitting station and at the receiving station, respectively, are actuated in synchronism to maintain the receiver tuned to the carrier frequency of the transmitter.",
    ),
    claim(
      2,
      "Apparatus as described in claim 1, in which said differently characterized recordings on said record strips are distinguished by being differently laterally displaced from each other, and said record-actuated means are selectively responsive to the lateral positioning of said recordings.",
    ),
    claim(
      3,
      "Apparatus as described in claim 1, in which said record strip comprises a ribbon having longitudinally extending slots therein differently characterized by being differently laterally positioned on said ribbon, and each said record-actuated means includes a plurality of movable elements each movable to tune its associated generating or receiving means to a different one of said frequencies, and means for selectively moving said elements in accordance with the lateral positioning of the slots in said ribbon.",
    ),
    claim(
      4,
      "In a system of the type described, including a control station and a movable craft to be controlled thereby, apparatus at said control station comprising an oscillator and tuning means therefor, a first elongated record strip having differently characterized, longitudinally disposed recordings thereon, record-actuated means selectively responsive to different ones of said recordings for tuning said oscillator to predetermined different frequencies, means for moving said record strip past said record-actuated means whereby the frequency of oscillation is changed from time to time in accordance with the recordings on said strip, and means for selectively transmitting radio signals corresponding in frequency to the said frequency of oscillation; apparatus on said movable craft comprising a radio receiver having tuning means tunable to said predetermined frequencies, a second record strip, record-actuated means selectively responsive to different recordings on said second record strip for tuning said receiver to said predetermined frequencies, means for moving said second strip past its associated record-actuated means in synchronism with said first strip whereby the record-actuated means at the control station and on the movable craft, respectively, are actuated in synchronism to maintain said radio receiver tuned to the frequency of oscillation of the transmitter; mechanism on said craft for selectively determining its movement, and means responsive to radio signals received by said radio receiver for controlling said mechanism.",
    ),
    claim(
      5,
      "Apparatus as described in claim 4, in which said mechanism on said craft for selectively determining its movement includes a control element movable by predetermined increments, and means responsive to successive received radio impulses for moving said element by one increment only in response to each separate impulse irrespective of the length of the impulse.",
    ),
    claim(
      6,
      "Apparatus as described in claim 1, including means at the transmitting station for transmitting radio signals of different frequencies to which said radio receiver tuning means are not tunable, and means coordinated with the recordings on said first strip for indicating at the transmitting station when the transmitting apparatus is tuned to frequencies that are not receivable at the receiving station.",
    ),
    p(text("HEDY KIESLER MARKEY.\nGEORGE ANTHEIL.")),
  ],
};

/** Hand-authored companion readings, keyed to paragraph block positions in this edition. */
export const lamarrFrequencyHoppingParallelReadings: Readonly<Record<number, readonly string[]>> = {
  3: [
    "The patent begins broadly: it concerns radio links whose carrier frequency changes. Its intended use is not general civilian radio; it is remote control of a torpedo.",
  ],
  4: [
    "The target is a control link that is practical for its operator yet difficult for an adversary to discover or decipher.",
  ],
  5: [
    "The core scheme is two physically matched records. Each record selects the current RF channel at its own station. A player-piano roll offers many independently positionable tracks: 88 is an example from the contemporary piano mechanism, not a claim that every implementation must have 88 channels.",
    "The records are long perforated paper rolls, one at the transmitter and one at the receiver. Their corresponding longitudinal rows choose tuning states from time to time; without the matching rolls, an opponent cannot tell which carrier will carry a control impulse. The grant also says the rolls may be substantial in length and driven slowly or quickly, so they can last for a torpedo-control operation.",
  ],
  6: [
    "The records may be driven by accurately calibrated constant-speed spring motors of the kind used in clocks and chronometers, keeping corresponding positions in phase. The inventors also allow the receiving record to be periodically corrected by synchronous impulses from the transmitter; they identify that phase-correction practice as well known in automatic telegraphy and television.",
  ],
  7: [
    "These are the seven figures the specification will use: transmitter, receiver, release circuit, punched strip, pneumatic selector, pin detail, and a torpedo-course example.",
    "More precisely, Fig. 1 is the transmitting station, Fig. 2 the receiving station, and Fig. 3 the circuit for starting both motors at once. Fig. 4 is the perforated strip, Fig. 5 its record-responsive switching head, Fig. 6 the perpendicular section through that head and strip, and Fig. 7 the torpedo-course diagram.",
  ],
  8: [
    "Figure 7 supplies the application context. The mother ship starts at 10a and finishes at 10b; the torpedo changes from paths 12 through 16 while the target moves from 17a to 17b.",
    "The figure also distinguishes the target's position at the moment of impact, 17b, from its expected original-course position, 17c. That matters because the drawing is not a generic battle illustration: it introduces the moving-target and water-current problem that later steering commands address.",
  ],
  9: [
    "The same system can be operated from the ship or, if fitted with matching synchronous gear, an observing airplane.",
    "The observer in airplane 18 may report the torpedo's course to mother ship 10a, or the airplane may itself control the torpedo if it carries the necessary synchronous transmitting equipment. The source describes those alternatives rather than asserting that a particular aircraft or observation method is required.",
  ],
  10: [
    "The plotted geometry explains why a guidance command is needed: target motion and water current make the original torpedo path miss. Radio commands change its path in successive increments.",
    "At discharge, enemy ship 17 travels roughly parallel to the mother ship, so the torpedo is aimed ahead to account for the ship's speed and the water-current arrows 19. Once the ship turns, the initial path 12 no longer intercepts it. The claimed radio-control arrangement lets the operator redirect the torpedo successively through paths 13, 14, 15, and 16 to reach 17b.",
  ],
  11: [
    "Remote steering itself was old. The asserted problem is that a fixed-frequency control signal can be found and imitated by an enemy.",
  ],
  12: [
    "Their answer is not merely many transmitters. Both ends change frequency according to synchronized records, so an authorized receiver stays tuned while an adversary cannot know the current channel from the record alone.",
  ],
  13: [
    "The transmitter has a variable RF oscillator, modulator, amplifier, and antenna. Seven selectable capacitors give seven example oscillator frequencies; the exact oscillator circuitry is outside the claimed contribution.",
    "The listed parts are oscillator 20, modulator 21, amplifier 22, and antenna 23. Seven tuning condensers 24a through 24g have different capacities, depicted by different plate spacings, and automatic switches 31 independently connect them to the oscillator. The inventors intentionally leave the internal construction of those conventional radio elements outside this particular invention.",
  ],
  14: [
    "Two separate audio-frequency modulation tones encode left and right commands. Key L uses 100 cycles; key R uses 500 cycles. The RF carrier is whatever frequency the record has selected at that instant.",
    "Pressing either key closes main contacts 32 from oscillator 20 to modulator 21. L also closes contacts 33, supplying the 100-cycle oscillator 34; R instead closes contacts 35, supplying the 500-cycle oscillator 36. The modulated carrier then goes through amplifier 22 and antenna 23, so a steering command combines the currently selected carrier with one of the two printed tone labels.",
  ],
  15: [
    "The moving strip has eight longitudinal tracks. A through G select the seven tuning capacitors; H drives a warning lamp. The passage of holes over the control head converts the stored pattern into switching events.",
    "Strip 37 travels from supply roll 38 across control head 39 to take-up spool 40, which constant-speed clock motor 41 drives. Rows A through G operate the seven switches 31 for condensers 24a through 24g. Row H instead controls auxiliary switch 42, which lights lamp 43 from battery 44, allowing the record to communicate a transmitter-side warning as well as tune the oscillator.",
  ],
  16: [
    "The illustrated reader is pneumatic. Paper over an orifice lets suction hold a piston up and keeps its electrical switch open. A hole admits air, releases suction, and lets a spring close that switch. This makes the strip a mechanical program for the oscillator tuning.",
    "The strip runs over shoe 45, whose passages 46 line up with rows A through H. Each passage reaches suction manifold 48 through restricted passage 47, tube 49, and pump 50, while tube 51 joins it to a cylinder 52 and piston 53. The piston lies above insulated movable spring 54 of switch 31; shoulders 56 hold it up against cylinder block 57 until compression spring 53a is allowed to drive it down against contact spring 58.",
  ],
  17: [
    "A sequence of holes in different rows closes different capacitor switches in sequence. Because the sequence need not repeat periodically, a listener cannot simply time one hop and predict the next.",
    "With solid paper over a passage, manifold suction lifts the piston against its compression spring and leaves the related switch open. A perforation admits air into passage 46, breaks the suction, and lets spring 53a close that switch. Thus the lateral row and longitudinal order of the holes select which condenser joins oscillator 20; the source emphasizes that the resulting sequence may be arbitrary rather than periodic.",
  ],
  18: [
    "The torpedo receiver selects the matching RF channel, amplifies and detects its modulation, then separates the 100-cycle and 500-cycle command tones. Separate rectifier-and-magnet paths turn each tone into a direction command.",
    "At the receiver, antenna 60 feeds signal selector 61, amplifier 64, and detector 65. Four condensers 24'd through 24'g tune selector 61 to the receiver's four illustrated carrier states. The detector output reaches filters 166 and 566, tuned respectively to 100 and 500 cycles; rectifiers 168 and 568 energize magnets 169 and 569, which move common armature 72 onto contacts 170 or 570.",
  ],
  19: [
    "A 100-cycle command pulls a pawl through one ratchet tooth, turning the rudder one fixed increment left. A brief radio pulse therefore produces a discrete steering step rather than requiring a continuous radio command.",
    "When key L's 100-cycle tone reaches filter 166, magnet 169 closes armature 72 on contact 170 and energizes solenoid 175 from battery 74. Its plunger 176 pulls pawl 177 into teeth 178 on rudder wheel 79. Spring 180 normally clears the pawl and cam face 181 guides it into engagement; wheel 79 turns rudder post 82 and rudder 83 left by one tooth, then the released mechanism returns to neutral.",
  ],
  20: [
    "The 500-cycle path is mechanically mirrored so that its pawl turns the rudder right. A friction brake holds the resulting rudder position between commands while still allowing the next pawl stroke.",
    "A 500-cycle command passes filter 566 and energizes magnet 569, so armature 72 closes contact 570 and drives solenoid 575. Pawl 577 engages oppositely directed teeth 578 and therefore shifts rudder 83 right instead of left. Brake drum 84, brake-band 85, pinion 86, and gear segment 87 resist unwanted rudder motion after either step but do not prevent a pawl from making the next commanded change.",
  ],
  21: [
    "The receiver has a duplicate strip and matching clock motor. Its four selectable receiver channels follow four of the transmitter's seven example channels. The patent deliberately permits the receiver record to be identical even when some rows are unused.",
    "Receiver contacts 31' are actuated by record strip 37', control head 39', and clock motor 41', which runs at the same speed as transmitter motor 41. The receiving head and switches use the same Fig. 5 and Fig. 6 construction. Although the source illustrates only condensers 24'd through 24'g at the receiver, it expressly says the receiver strip may be identical to the transmitter strip and unused rows can be rendered ineffective separately.",
  ],
  22: [
    "The two records must begin together as well as run at equal speed. Pins hold both at their special starting holes; releasing both solenoids when the torpedo is fired starts the patterns in phase.",
    "At each station, pin 100 moves vertically in head 45 and enters special starting hole 101 in its strip. Compression spring 102 normally urges the pin down, clear of moving paper; energized solenoid 103 and plunger 104 instead hold it up in the hole. This explicit start-stop arrangement complements the equal-speed motors, because matching rates alone would not correct an initial phase offset.",
  ],
  23: [
    "The tethered firing circuit holds both pins engaged before launch. Breaking the conductors at firing de-energizes both solenoids, releasing transmitter and torpedo records together.",
    "Before firing, the source places transmitter apparatus from Fig. 1 on the mother ship and receiver apparatus from Fig. 2 on the torpedo. Battery 105 energizes the two solenoids 103 in series through conductors 106 running between them, holding both strips at their starting holes. Launch breaks those conductors, interrupts the series circuit, and releases both strips at the same instant to begin their motion in phase.",
  ],
  24: [
    "In the illustrated arrangement the receiver is effective on channels D, E, F, and G, while it is ineffective on transmitter-only channels A, B, and C. A pulse sent while the transmitter is on A, B, or C is therefore a false impulse that cannot move the torpedo; lamp 43 indicates when the transmitter and receiver are not tuned alike.",
  ],
  25: [
    "Row H makes the lamp illuminate during changes between usable channels and throughout decoy channels. The operator can intentionally emit decoy pulses while knowing the lamp means they will not steer the torpedo.",
    "An H-row aperture over its associated passage 46 closes switch 42 and lights lamp 43. The holes begin and end each D, E, F, or G perforation and span the spaces between them, when one or more A, B, or C perforations may select false channels. The lamp therefore warns during every useful-channel transition as well as while the transmitter remains on a receiver-inaccessible channel.",
  ],
  26: [
    "The eight rows in the drawing are a compact example. The specification expressly points to 88-row player-piano records and allows identical transmitter and receiver strips with receiver passages blocked for false channels.",
    "The grant permits the receiver's false-signal perforations either to be absent or to remain on an otherwise identical strip. In the latter case, passages 46 in the receiving head can be blocked, or the matching receiver contact springs 54 and 58 can be left disconnected. These alternatives preserve the common physical record while ensuring that rows assigned only to decoys cannot tune a usable receiver channel.",
  ],
  27: [
    "Short, incremental commands reduce interception opportunities. An intercepted pulse also does not disclose whether it was a real steering command or a decoy.",
    "One momentary closure of L or R moves rudder 83 by one increment, so the system need not transmit a long control signal. The patent says a short impulse may go undiscovered; even if an adversary receives it, the adversary cannot tell whether it was effective or a false signal. It also states that the record sequence can avoid ever tuning the receiver to the same frequency twice.",
  ],
  28: [
    "More modulation tones can control more than one steering axis. The inventors give 100, 500, 1,000, and 2,000 cycles as an example of four command channels, enough for two rudders.",
    "The illustrated torpedo uses one steering dimension, but the source says a larger number of modulation frequencies and appropriate receiver filters can command additional functions. Its concrete example assigns 100, 500, 1,000, and 2,000 cycles to four modulation waves, allowing two rudders and therefore vertical as well as horizontal control for an aerial torpedo or another craft. It does not prescribe a maximum number of control channels.",
  ],
  29: [
    'The system is not limited to the displayed modulation method. Here, "carrier wave" means the unmodulated RF wave when phase or frequency modulation is used. The legal scope is then stated in the claims.',
    "The displayed arrangement uses the conventional modulation method, but the specification expressly allows frequency modulation and phase modulation. For those alternatives, its claim language uses carrier wave to mean the underlying unmodulated RF wave. The inventors then reserve the formal boundary of their invention to the appended claims rather than to every construction detail shown in the drawings.",
  ],
  30: [
    "Various other departures from the exact system described will be apparent to those skilled in the art, and the invention is therefore to be limited only as set forth in the appended claims.",
  ],
  38: ["The printed specification is signed by Hedy Kiesler Markey and George Antheil."],
};
