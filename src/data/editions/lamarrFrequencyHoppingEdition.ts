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

const FIGURE_PREVIEWS = {
  "Fig. 1": {
    src: "/patents/figures/us-2292387-lamarr-frequency-hopping/fig-1.png",
    alt: "US 2,292,387 Fig. 1: transmitting station, record strip, tuning contacts, and torpedo steering circuit.",
    width: 2000,
    height: 1350,
  },
  "Fig. 2": {
    src: "/patents/figures/us-2292387-lamarr-frequency-hopping/fig-2.png",
    alt: "US 2,292,387 Fig. 2: receiving station, synchronized record strip, filters, and rudder mechanism.",
    width: 2000,
    height: 1400,
  },
  "Fig. 3": {
    src: "/patents/figures/us-2292387-lamarr-frequency-hopping/fig-3-v2.png",
    alt: "US 2,292,387 Fig. 3: starting circuit connecting transmitting station and torpedo record-strip releases.",
    width: 1150,
    height: 1100,
  },
  "Fig. 4": {
    src: "/patents/figures/us-2292387-lamarr-frequency-hopping/fig-4.png",
    alt: "US 2,292,387 Fig. 4: plan of the perforated record strip with rows A through H.",
    width: 2000,
    height: 620,
  },
  "Fig. 5": {
    src: "/patents/figures/us-2292387-lamarr-frequency-hopping/fig-5.png",
    alt: "US 2,292,387 Fig. 5: record-responsive pneumatic switching mechanism in longitudinal section.",
    width: 1850,
    height: 1500,
  },
  "Fig. 6": {
    src: "/patents/figures/us-2292387-lamarr-frequency-hopping/fig-6-v2.png",
    alt: "US 2,292,387 Fig. 6: sectional view of the control-head starting pin and record strip.",
    width: 1000,
    height: 1100,
  },
  "Fig. 7": {
    src: "/patents/figures/us-2292387-lamarr-frequency-hopping/fig-7.png",
    alt: "US 2,292,387 Fig. 7: mother ship, torpedo paths, enemy ship, aircraft observer, and water-current arrows.",
    width: 1900,
    height: 1000,
  },
} as const;

const fig = (value: keyof typeof FIGURE_PREVIEWS): CuratedSpecificationInline => ({
  kind: "reference",
  text: value,
  href: "#",
  referenceType: "figure",
  label: `Preview ${value} from the US 2,292,387 source drawing`,
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
        "UNITED STATES PATENT OFFICE.",
        "HEDY KIESLER MARKEY, OF LOS ANGELES, CALIFORNIA, AND GEORGE ANTHEIL, OF MANHATTAN BEACH, CALIFORNIA.",
        "SECRET COMMUNICATION SYSTEM.",
        "2,292,387. Patented Aug. 11, 1942.",
        "Application June 10, 1941. Serial No. 397,412. 6 Claims. (Cl. 250-2.)",
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIGS. 1-3",
      title: "Transmitting station, receiving station, and starting circuit",
      description: text(
        "Drawing sheet 1 of 2. H. K. Markey et al., Secret Communication System, filed June 10, 1941. Fig. 1 shows the transmitting station; Fig. 2 the receiving station; Fig. 3 the circuit that releases the two records together.",
      ),
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIGS. 4-7",
      title: "Record strip, switching head, starting pin, and torpedo course",
      description: text(
        "Drawing sheet 2 of 2. Fig. 4 shows the record strip; Figs. 5 and 6 the record-responsive switch and its starting pin; Fig. 7 a plan of a torpedo-course correction.",
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
    p(
      text(
        "Briefly, our system as adapted for radio control of a remote craft, employs a pair of synchronous records, one at the transmitting station and one at the receiving station, which change the tuning of the transmitting and receiving apparatus from time to time, so that without knowledge of the records an enemy would be unable to determine at what frequency a controlling impulse would be sent. Furthermore, we contemplate employing records of the type used for many years in player pianos, and which consist of long rolls of paper having perforations variously positioned in a plurality of longitudinal rows along the records. In a conventional player piano record there may be 88 rows of perforations, and in our system such a record would permit the use of 88 different carrier frequencies, from one to another of which both the transmitting and receiving station would be changed at intervals. Furthermore, records of the type described can be made of substantial length and may be driven slow or fast. This makes it possible for a pair of records, one at the transmitting station and one at the receiving station, to run for a length of time ample for the remote control of a device such as a torpedo.",
      ),
    ),
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
        text: ", the apparatus at the transmitting station includes as its main elements a variable-frequency carrier oscillator 20, a modulator 21, an amplifier 22, and an antenna 23. These elements are represented schematically since their exact construction does not constitute a part of the present invention. Suffice it to say that the variable-frequency carrier oscillator 20 is controlled to oscillate at different frequencies by a plurality of tuning condensers 24a, 24b, 24c, 24d, 24e, 24f, and 24g, adapted to be independently connected to the oscillator by automatically controlled switches 31, one for each condenser. The different condensers 24a to 24g, inclusive, are of different capacities, and these differences are indicated in the drawings by different spacings between the plates.",
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
        text: "The switches 31 are selectively closed by a record-controlled mechanism actuated by a record strip 37, which is drawn off a supply roll 38 over a control head 39 and wound up on a take-up spool 40 driven by a constant-speed clock motor 41. Referring now to ",
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
        text: " two of the passages 46 are shown juxtaposed to and in communication with apertures in the two rows C and G of the strip 37. Each of the passages 46 is communicated by a restricted passage 47 with a suction manifold 48, which is connected by a tube 49 to a suction pump 50. Each of the passages 46 is also connected by a tube 51 to the upper end of an associated cylinder 52 containing a piston 53. Each piston 53 projects from the lower end of its associated cylinder 52 and overlies a movable spring 54 of one of the tuning switches 31. The movable spring 54 is separated by a block of insulation 55 from the lower end of its associated piston 53. The pistons are normally maintained in upper position in which shoulders 56 thereon lie against the lower face of the cylinder block 57 containing the cylinders 52, under which conditions the contacts 31 are open. However, under certain conditions to be described, the pistons 53 are urged downwardly, by compression springs 53a positioned thereabove, to carry the movable springs 54 against the cooperating contact springs 58 to close the switches 31.",
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
  ],
  6: [
    "Matching motor speed keeps the records in phase. The inventors also allow periodic radio synchronization, rather than requiring perfect free-running clocks for an entire mission.",
  ],
  7: [
    "These are the seven figures the specification will use: transmitter, receiver, release circuit, punched strip, pneumatic selector, pin detail, and a torpedo-course example.",
  ],
  8: [
    "Figure 7 supplies the application context. The mother ship starts at 10a and finishes at 10b; the torpedo changes from paths 12 through 16 while the target moves from 17a to 17b.",
  ],
  9: [
    "The same system can be operated from the ship or, if fitted with matching synchronous gear, an observing airplane.",
  ],
  10: [
    "The plotted geometry explains why a guidance command is needed: target motion and water current make the original torpedo path miss. Radio commands change its path in successive increments.",
  ],
  11: [
    "Remote steering itself was old. The asserted problem is that a fixed-frequency control signal can be found and imitated by an enemy.",
  ],
  12: [
    "Their answer is not merely many transmitters. Both ends change frequency according to synchronized records, so an authorized receiver stays tuned while an adversary cannot know the current channel from the record alone.",
  ],
  13: [
    "The transmitter has a variable RF oscillator, modulator, amplifier, and antenna. Seven selectable capacitors give seven example oscillator frequencies; the exact oscillator circuitry is outside the claimed contribution.",
  ],
  14: [
    "Two separate audio-frequency modulation tones encode left and right commands. Key L uses 100 cycles; key R uses 500 cycles. The RF carrier is whatever frequency the record has selected at that instant.",
  ],
  15: [
    "The moving strip has eight longitudinal tracks. A through G select the seven tuning capacitors; H drives a warning lamp. The passage of holes over the control head converts the stored pattern into switching events.",
  ],
  16: [
    "The illustrated reader is pneumatic. Paper over an orifice lets suction hold a piston up and keeps its electrical switch open. A hole admits air, releases suction, and lets a spring close that switch. This makes the strip a mechanical program for the oscillator tuning.",
  ],
  17: [
    "A sequence of holes in different rows closes different capacitor switches in sequence. Because the sequence need not repeat periodically, a listener cannot simply time one hop and predict the next.",
  ],
  18: [
    "The torpedo receiver selects the matching RF channel, amplifies and detects its modulation, then separates the 100-cycle and 500-cycle command tones. Separate rectifier-and-magnet paths turn each tone into a direction command.",
  ],
  19: [
    "A 100-cycle command pulls a pawl through one ratchet tooth, turning the rudder one fixed increment left. A brief radio pulse therefore produces a discrete steering step rather than requiring a continuous radio command.",
  ],
  20: [
    "The 500-cycle path is mechanically mirrored so that its pawl turns the rudder right. A friction brake holds the resulting rudder position between commands while still allowing the next pawl stroke.",
  ],
  21: [
    "The receiver has a duplicate strip and matching clock motor. Its four selectable receiver channels follow four of the transmitter's seven example channels. The patent deliberately permits the receiver record to be identical even when some rows are unused.",
  ],
  22: [
    "The two records must begin together as well as run at equal speed. Pins hold both at their special starting holes; releasing both solenoids when the torpedo is fired starts the patterns in phase.",
  ],
  23: [
    "The tethered firing circuit holds both pins engaged before launch. Breaking the conductors at firing de-energizes both solenoids, releasing transmitter and torpedo records together.",
  ],
  24: [
    "Three transmitter channels have no matching receiver channel. They are decoys: pulses sent there can be heard by an enemy but cannot move the torpedo. The lamp marks the moments when a real command would not be received.",
  ],
  25: [
    "Row H makes the lamp illuminate during changes between usable channels and throughout decoy channels. The operator can intentionally emit decoy pulses while knowing the lamp means they will not steer the torpedo.",
  ],
  26: [
    "The eight rows in the drawing are a compact example. The specification expressly points to 88-row player-piano records and allows identical transmitter and receiver strips with receiver passages blocked for false channels.",
  ],
  27: [
    "Short, incremental commands reduce interception opportunities. An intercepted pulse also does not disclose whether it was a real steering command or a decoy.",
  ],
  28: [
    "More modulation tones can control more than one steering axis. The inventors give 100, 500, 1,000, and 2,000 cycles as an example of four command channels, enough for two rudders.",
  ],
  29: [
    'The system is not limited to the displayed modulation method. Here, "carrier wave" means the unmodulated RF wave when phase or frequency modulation is used. The legal scope is then stated in the claims.',
  ],
  30: [
    "Various other departures from the exact system described will be apparent to those skilled in the art, and the invention is therefore to be limited only as set forth in the appended claims.",
  ],
  38: ["The printed specification is signed by Hedy Kiesler Markey and George Antheil."],
};
