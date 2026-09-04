import type {
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

const text = (value: string): CuratedSpecificationInlines => [{ kind: "text", text: value }];
const paragraph = (inlines: CuratedSpecificationInlines) => ({
  kind: "paragraph" as const,
  inlines,
});
const p = (value: string) => paragraph(text(value));

const term = (value: string, definition: string): CuratedSpecificationInline => ({
  kind: "term",
  text: value,
  definition,
});

const sourceSheet = (number: number, sourcePdfPage: 1 | 2) => ({
  src: `/patents/figures/us-174465-bell-telephone/source-sheet-${sourcePdfPage}-v1.png`,
  alt:
    sourcePdfPage === 1
      ? `Complete source drawing sheet containing Figs. 1 through 5, highlighting Fig. ${number}, from US 174,465.`
      : `Complete source drawing sheet containing Figs. 6 and 7, highlighting Fig. ${number}, from US 174,465.`,
  width: 2320,
  height: 3408,
});

const FIGURES = {
  "Fig. 1": sourceSheet(1, 1),
  "Fig. 2": sourceSheet(2, 1),
  "Fig. 3": sourceSheet(3, 1),
  "Fig. 4": sourceSheet(4, 1),
  "Fig. 5": sourceSheet(5, 1),
  "Fig. 6": sourceSheet(6, 2),
  "Fig. 7": sourceSheet(7, 2),
} as const;

const figure = (
  label: keyof typeof FIGURES,
  sourceText: string = label,
): CuratedSpecificationInline => ({
  kind: "reference",
  text: sourceText,
  href: "#",
  referenceType: "figure",
  label: `Open the complete source drawing sheet for ${label} in US 174,465`,
  figurePreviews: [FIGURES[label]],
});

const claim = (number: number, value: string) => ({
  kind: "claim" as const,
  number,
  inlines: text(value),
});

/**
 * A continuous, manually prepared edition of the complete US 174,465
 * facsimile. The first two source sheets are drawings. The specification
 * begins on the third source page and is deliberately presented here without
 * artificial scan-page boundaries.
 */
export const bellTelephoneArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "cb1a0fa7bd871937575e240adf904fa3ea8f462b3bfceb4e7cbbb0811909a8e9",
  preparedBy: "Classic Patents editorial agent (GPT-5.6)",
  preparedAt: "2026-08-18",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE.",
        "ALEXANDER GRAHAM BELL, OF SALEM, MASSACHUSETTS.",
        "IMPROVEMENT IN TELEGRAPHY.",
        "Specification forming part of Letters Patent No. 174,465, dated March 7, 1876; application filed February 14, 1876.",
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIGURES 1-7",
      title: "Bell's harmonic-telegraph waveforms and instruments",
      description: [
        { kind: "text", text: "The two printed drawing sheets contain " },
        figure("Fig. 1"),
        { kind: "text", text: ", " },
        figure("Fig. 2"),
        { kind: "text", text: ", " },
        figure("Fig. 3"),
        { kind: "text", text: ", " },
        figure("Fig. 4"),
        { kind: "text", text: ", " },
        figure("Fig. 5"),
        { kind: "text", text: ", " },
        figure("Fig. 6"),
        { kind: "text", text: ", and " },
        figure("Fig. 7"),
        {
          kind: "text",
          text: ". Each reference opens its complete primary drawing sheet.",
        },
      ],
    },
    p("To all whom it may concern:"),
    p(
      "Be it known that I, ALEXANDER GRAHAM BELL, of Salem, Massachusetts, have invented certain new and useful Improvements in Telegraphy, of which the following is a specification:",
    ),
    p(
      "In Letters Patent granted to me April 6, 1875, No. 161,739, I have described a method of, and apparatus for, transmitting two or more telegraphic signals simultaneously along a single wire by the employment of transmitting-instruments, each of which occasions a succession of electrical impulses differing in rate from the others; and of receiving-instruments, each tuned to a pitch at which it will be put in vibration to produce its fundamental note by one only of the transmitting-instruments; and of vibratory circuit-breakers operating to convert the vibratory movement of the receiving-instrument into a permanent make or break (as the case may be) of a local circuit, in which is placed a Morse sounder, register, or other telegraphic apparatus. I have also therein described a form of autographic telegraph based upon the action of the above-mentioned instruments.",
    ),
    p(
      "In illustration of my method of multiple telegraphy I have shown in the patent aforesaid, as one form of transmitting-instrument, an electro-magnet having a steel-spring armature, which is kept in vibration by the action of a local battery. This armature in vibrating makes and breaks the main circuit, producing an intermittent current upon the line-wire. I have found, however, that upon this plan the limit to the number of signals that can be sent simultaneously over the same wire is very speedily reached; for, when a number of transmitting-instruments, having different rates of vibration, are simultaneously making and breaking the same circuit, the effect upon the main line is practically equivalent to one continuous current.",
    ),
    p(
      "In a pending application for Letters Patent, filed in the United States Patent Office February 25, 1875, I have described two ways of producing the intermittent current—the one by actual make and break of contact, the other by alternately increasing and diminishing the intensity of the current without actually breaking the circuit. The current produced by the latter method I shall term, for distinction sake, a pulsatory current.",
    ),
    p(
      "My present invention consists in the employment of a vibratory or undulatory current of electricity in contradistinction to a merely intermittent or pulsatory current, and of a method of, and apparatus for, producing electrical undulations upon the line-wire.",
    ),
    p(
      "The distinction between an undulatory and a pulsatory current will be understood by considering that electrical pulsations are caused by sudden or instantaneous changes of intensity, and that electrical undulations result from gradual changes of intensity exactly analogous to the changes in the density of air occasioned by simple pendulous vibrations. The electrical movement, like the aerial motion, can be represented by a sinusoidal curve or by the resultant of several sinusoidal curves.",
    ),
    p(
      "Intermittent or pulsatory and undulatory currents may be of two kinds, accordingly as the successive impulses have all the same polarity or are alternately positive and negative.",
    ),
    p(
      "The advantages I claim to derive from the use of an undulatory current in place of a merely intermittent one are, first, that a very much larger number of signals can be transmitted simultaneously on the same circuit; second, that a closed circuit and single main battery may be used; third, that communication in both directions is established without the necessity of special induction-coils; fourth, that cable dispatches may be transmitted more rapidly than by means of an intermittent current or by the methods at present in use; for, as it is unnecessary to discharge the cable before a new signal can be made, the lagging of cable-signals is prevented; fifth, and that as the circuit is never broken a spark-arrester becomes unnecessary.",
    ),
    p(
      "It has long been known that when a permanent magnet is caused to approach the pole of an electro-magnet a current of electricity is induced in the coils of the latter, and that when it is made to recede a current of opposite polarity to the first appears upon the wire. When, therefore, a permanent magnet is caused to vibrate in front of the pole of an electro-magnet an undulatory current of electricity is induced in the coils of the electro-magnet, the undulations of which correspond, in rapidity of succession, to the vibrations of the magnet, in polarity to the direction of its motion, and in intensity to the amplitude of its vibration.",
    ),
    p(
      "That the difference between an undulatory and an intermittent current may be more clearly understood I shall describe the condition of the electrical current when the attempt is made to transmit two musical notes simultaneously—first upon the one plan and then upon the other. Let the interval between the two sounds be a major third; then their rates of vibration are in the ratio of 4 to 5.",
    ),
    paragraph([
      {
        kind: "text",
        text: "Now, when the intermittent current is used the circuit is made and broken four times by one transmitting-instrument in the same time that five makes and breaks are caused by the other. A and B, ",
      },
      figure("Fig. 1", "Figs. 1"),
      {
        kind: "text",
        text: ", 2, and 3, represent the intermittent currents produced, four impulses of B being made in the same time as five impulses of A. c c c, &c., show where and for how long time the circuit is made, and d d d, &c., indicate the duration of the breaks of the circuit. The line A and B shows the total effect upon the current when the transmitting-instruments for A and B are caused simultaneously to make and break the same circuit. The resultant effect depends very much upon the duration of the make relatively to the break. In ",
      },
      figure("Fig. 1"),
      { kind: "text", text: " the ratio is as 1 to 4; in " },
      figure("Fig. 2"),
      { kind: "text", text: ", as 1 to 2; and in " },
      figure("Fig. 3"),
      {
        kind: "text",
        text: " the makes and breaks are of equal duration. The combined effect, A and B, ",
      },
      figure("Fig. 3"),
      { kind: "text", text: ", is very nearly equivalent to a continuous current." },
    ]),
    p(
      "When many transmitting-instruments of different rates of vibration are simultaneously making and breaking the same circuit the current upon the main line becomes for all practical purposes continuous.",
    ),
    p("Next, consider the effect when an undulatory current is employed."),
    paragraph([
      {
        kind: "text",
        text: "Electrical undulations, induced by the vibration of a body capable of inductive action, can be represented graphically, without error, by the same sinusoidal curve which expresses the vibration of the inducing body itself, and the effect of its vibration upon the air; for, as above stated, the rate of oscillation in the electrical current corresponds to the rate of vibration of the inducing body—that is, to the pitch of the sound produced. The intensity of the current varies with the amplitude of the vibration—that is, with the loudness of the sound; and the polarity of the current corresponds to the direction of the vibrating body—that is, to the condensations and rarefactions of air produced by the vibration. Hence, the sinusoidal curve A or B, ",
      },
      figure("Fig. 4"),
      {
        kind: "text",
        text: ", represents, graphically, the electrical undulations induced in a circuit by the vibration of a body capable of inductive action.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "The horizontal line a d e f, &c., represents the zero of current. The elevations b b b, &c., indicate impulses of positive electricity. The depressions c c c, &c., show impulses of negative electricity. The vertical distance b d or c f of any portion of the curve from the zero-line expresses the intensity of the positive or negative impulse at the part observed, and the horizontal distance a a indicates the duration of the electrical oscillation. The vibrations represented by the sinusoidal curves B and A, ",
      },
      figure("Fig. 4"),
      {
        kind: "text",
        text: ", are in the ratio aforesaid, of 4 to 5—that is, four oscillations of B are made in the same time as five oscillations of A.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "The combined effect of A and B, when induced simultaneously on the same circuit, is expressed by the curve A+B, ",
      },
      figure("Fig. 4"),
      {
        kind: "text",
        text: ", which is the algebraical sum of the sinusoidal curves A and B. This curve A+B also indicates the actual motion of the air when the two musical notes considered are sounded simultaneously. Thus, when electrical undulations of different rates are simultaneously induced in the same circuit, an effect is produced exactly analogous to that occasioned in the air by the vibration of the inducing bodies. Hence, the coexistence upon a telegraphic circuit of electrical vibrations of different pitch is manifested, not by the obliteration of the vibratory character of the current, but by peculiarities in the shapes of the electrical undulations, or, in other words, by peculiarities in the shapes of the curves which represent those undulations.",
      },
    ]),
    p(
      "There are many ways of producing undulatory currents of electricity, dependent for effect upon the vibrations or motions of bodies capable of inductive action. A few of the methods that may be employed I shall here specify. When a wire, through which a continuous current of electricity is passing, is caused to vibrate in the neighborhood of another wire, an undulatory current of electricity is induced in the latter. When a cylinder, upon which are arranged bar-magnets, is made to rotate in front of the pole of an electro-magnet, an undulatory current of electricity is induced in the coils of the electro-magnet.",
    ),
    paragraph([
      {
        kind: "text",
        text: "Undulations are caused in a continuous voltaic current by the vibration or motion of bodies capable of inductive action; or by the vibration of the conducting-wire itself in the neighborhood of such bodies. Electrical undulations may also be caused by alternately increasing and diminishing the resistance of the circuit, or by alternately increasing and diminishing the power of the battery. The internal resistance of a battery is diminished by bringing the voltaic elements nearer together, and increased by placing them farther apart. The reciprocal vibration of the elements of a battery, therefore, occasions an undulatory action in the voltaic current. The external resistance may also be varied. For instance, let mercury or some other liquid form part of a voltaic circuit, then the more deeply the conducting-wire is immersed in the mercury or other liquid, the less resistance does the liquid offer to the passage of the current. Hence, the vibration of the conducting-wire in mercury or other liquid included in the circuit occasions undulations in the current. The vertical vibrations of the elements of a battery in the liquid in which they are immersed produces an undulatory action in the current by alternately increasing and diminishing the power of the battery.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "In illustration of the method of creating electrical undulations, I shall show and describe one form of apparatus for producing the effect. I prefer to employ for this purpose an electro-magnet, A, ",
      },
      figure("Fig. 5"),
      {
        kind: "text",
        text: ", having a coil upon only one of its legs b. A steel-spring armature, c, is firmly clamped by one extremity to the uncovered leg d of the magnet, and its free end is allowed to project above the pole of the covered leg. The armature c can be set in vibration in a variety of ways, one of which is by wind, and, in vibrating, it produces a musical note of a certain definite pitch.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "When the instrument A is placed in a voltaic circuit, g b e f g, the armature c becomes magnetic, and the polarity of its free end is opposed to that of the magnet underneath. So long as the armature c remains at rest, no effect is produced upon the voltaic current, but the moment it is set in vibration to produce its musical note a powerful inductive action takes place, and electrical undulations traverse the circuit g b e f g. The vibratory current passing through the coil of the electro-magnet f causes vibration in its armature h when the armatures c h of the two instruments A I are normally in unison with one another; but the armature h is unaffected by the passage of the undulatory current when the pitches of the two instruments are different.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "A number of instruments may be placed upon a telegraphic circuit, as in ",
      },
      figure("Fig. 6"),
      {
        kind: "text",
        text: ". When the armature of any one of the instruments is set in vibration all the other instruments upon the circuit which are in unison with it respond, but those which have normally a different rate of vibration remain silent. Thus, if A, ",
      },
      figure("Fig. 6"),
      {
        kind: "text",
        text: ", is set in vibration, the armatures of A¹ and A² will vibrate also, but all the others on the circuit will remain still. So if B¹ is caused to emit its musical note the instruments B and B² respond. They continue sounding so long as the mechanical vibration of B¹ is continued, but become silent with the cessation of its motion. The duration of the sound may be used to indicate the dot or dash of the Morse alphabet, and thus a telegraphic dispatch may be indicated by alternately interrupting and renewing the sound.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "When two or more instruments of different pitch are simultaneously caused to vibrate, all the instruments of corresponding pitches upon the circuit are set in vibration, each responding to that one only of the transmitting-instruments with which it is in unison. Thus the signals of A, ",
      },
      figure("Fig. 6"),
      {
        kind: "text",
        text: ", are repeated by A¹ and A², but by no other instrument upon the circuit; the signals of B¹ by B and B²; and the signals of C¹ by C and C²—whether A, B¹, and C¹ are successively or simultaneously caused to vibrate. Hence by these instruments two or more telegraphic signals or messages may be sent simultaneously over the same circuit without interfering with one another.",
      },
    ]),
    p(
      "I desire here to remark that there are many other uses to which these instruments may be put, such as the simultaneous transmission of musical notes, differing in loudness as well as in pitch, and the telegraphic transmission of noises or sounds of any kind.",
    ),
    paragraph([
      { kind: "text", text: "When the armature c, " },
      figure("Fig. 5"),
      {
        kind: "text",
        text: ", is set in vibration the armature h responds not only in pitch, but in loudness. Thus, when c vibrates with little amplitude, a very soft musical note proceeds from h, and when c vibrates forcibly the amplitude of the vibration of h is considerably increased, and the resulting sound becomes louder. So, if A and B, ",
      },
      figure("Fig. 6"),
      {
        kind: "text",
        text: ", are sounded simultaneously, (A loudly and B softly,) the instruments A¹ and A² repeat loudly the signals of A, and B and B² repeat softly those of B.",
      },
    ]),
    paragraph([
      { kind: "text", text: "One of the ways in which the armature c, " },
      figure("Fig. 5"),
      {
        kind: "text",
        text: ", may be set in vibration has been stated above to be by wind. Another mode is shown in ",
      },
      figure("Fig. 7"),
      {
        kind: "text",
        text: ", whereby motion can be imparted to the armature by the human voice or by means of a musical instrument.",
      },
    ]),
    paragraph([
      { kind: "text", text: "The armature c, " },
      figure("Fig. 7"),
      {
        kind: "text",
        text: ", is fastened loosely by one extremity to the uncovered leg d of the electro-magnet b, and its other extremity is attached to the center of a stretched membrane, a. A cone, A, is used to converge sound-vibrations upon the membrane. When a sound is uttered in the cone the membrane a is set in vibration, the armature c is forced to partake of the motion, and thus electrical undulations are created upon the circuit E b e f g. These undulations are similar in form to the air vibrations caused by the sound—that is, they are represented graphically by similar curves.",
      },
    ]),
    p(
      "The undulatory current passing through the electro-magnet f influences its armature h to copy the motion of the armature c. A similar sound to that uttered into A is then heard to proceed from I.",
    ),
    paragraph([
      {
        kind: "text",
        text: "In this specification the three words “oscillation,” “vibration,” and “undulation,” are used synonymously, and in contradistinction to the terms ",
      },
      term(
        "“intermittent” and “pulsatory”",
        "Bell uses these words for currents made by abrupt interruptions or pulses, rather than a current varying continuously.",
      ),
      {
        kind: "text",
        text: ". By the terms “body capable of inductive action,” I mean a body which, when in motion, produces dynamical electricity. I include in the category of bodies capable of inductive action—brass, copper, and other metals; as well as iron and steel.",
      },
    ]),
    p(
      "Having described my invention, what I claim, and desire to secure by Letters Patent is as follows:",
    ),
    claim(
      1,
      "A system of telegraphy in which the receiver is set in vibration by the employment of undulatory currents of electricity, substantially as set forth.",
    ),
    claim(
      2,
      "The combination, substantially as set forth, of a permanent magnet or other body capable of inductive action, with a closed circuit, so that the vibration of the one shall occasion electrical undulations in the other, or in itself, and this I claim, whether the permanent magnet be set in vibration in the neighborhood of the conducting-wire forming the circuit, or whether the conducting-wire be set in vibration in the neighborhood of the permanent magnet, or whether the conducting-wire and the permanent magnet both simultaneously be set in vibration in each other's neighborhood.",
    ),
    claim(
      3,
      "The method of producing undulations in a continuous voltaic current by the vibration or motion of bodies capable of inductive action, or by the vibration or motion of the conducting-wire itself, in the neighborhood of such bodies, as set forth.",
    ),
    claim(
      4,
      "The method of producing undulations in a continuous voltaic circuit by gradually increasing and diminishing the resistance of the circuit, or by gradually increasing and diminishing the power of the battery, as set forth.",
    ),
    claim(
      5,
      "The method of, and apparatus for, transmitting vocal or other sounds telegraphically, as herein described, by causing electrical undulations, similar in form to the vibrations of the air accompanying the said vocal or other sounds, substantially as set forth.",
    ),
    p("In testimony whereof I have hereunto signed my name this 20th day of January, A. D. 1876."),
    p("ALEX. GRAHAM BELL."),
    p("Witnesses: THOMAS E. BARRY. P. D. RICHARDS."),
  ],
};

export const bellTelephoneParallelReadings: Readonly<Record<number, readonly string[]>> = {
  2: [
    "This is the usual public notice. The specification that follows identifies Bell, identifies the subject matter, and provides the technical disclosure to which the claims at the end refer.",
  ],
  3: [
    "Bell identifies himself, his Salem residence, and an improvement in telegraphy. He presents the document as the technical specification that supports the legal claims at its end.",
  ],
  4: [
    "Bell starts from his 1875 harmonic-telegraph work. Several transmitters can share one wire when each operates at a different vibration rate, and a matching receiver responds to its own rate. A local circuit then turns that small vibration into a readable Morse mark or sound.",
  ],
  5: [
    "The earlier harmonic system still interrupts a shared circuit. With enough independently vibrating transmitters, their interruptions overlap until the line behaves nearly like a continuously energized line. That is the limit Bell is about to address.",
  ],
  6: [
    "Bell distinguishes an abrupt make-and-break signal from a current whose strength rises and falls while the circuit remains closed. He calls the latter a pulsatory current here; the next paragraphs make a sharper distinction between pulses and continuous undulations.",
  ],
  7: [
    "The asserted move is not merely an audible receiver. Bell claims using an electrical variation that follows vibration, plus apparatus to produce that variation along the line.",
  ],
  8: [
    "An intermittent signal changes abruptly. An undulatory signal changes gradually, like the pressure variation in a simple sound wave. Bell treats a sinusoid, or a sum of sinusoids, as a graphical model of that motion.",
  ],
  9: [
    "Bell notes that either a pulsed or an undulating current can keep one polarity or alternate between positive and negative. That distinction is separate from whether the current changes abruptly or continuously.",
  ],
  10: [
    "Bell lists operating consequences he expects from an unbroken varying current: more simultaneous signals, one main battery, two-way communication without special induction coils, faster cable work because a new signal need not wait for a discharge, and no spark arrester because the circuit is not opened.",
  ],
  11: [
    "A magnet moving toward and away from an electromagnet changes magnetic flux and induces opposite current directions. Bell says the induced variation tracks the magnet's repetition rate, direction of motion, and displacement amplitude.",
  ],
  12: [
    "To make the contrast concrete, Bell chooses two musical notes a major third apart. Their vibration rates are in a 4:5 ratio, so they are a useful test of whether two signals can coexist on one line.",
  ],
  13: [
    "Figures 1 through 3 draw what happens when two transmitters merely open and close a circuit. The marked segments show each make and break; the combined A+B trace depends on their timing. With equal make and break durations in Figure 3, the sum nearly resembles a constant current.",
  ],
  14: [
    "Adding many make-and-break transmitters makes the line look continuously energized for practical purposes. That appearance does not preserve the individual waveforms that distinguish the signals.",
  ],
  15: [
    "Bell now changes models. Rather than treating a signal as a sequence of openings, he treats it as a continuously varying electrical motion.",
  ],
  16: [
    "For an inductive vibrating body, Bell maps repetition rate to musical pitch, amplitude to loudness, and direction of motion to current polarity. Figure 4 is his graphical shorthand for an electrical waveform with those corresponding features.",
  ],
  17: [
    "Figure 4 labels the zero-current line, positive and negative excursions, height from the line, and horizontal duration. Bell uses those graphic dimensions to describe strength, sign, and timing of the electrical variation, then again uses the 4:5 interval.",
  ],
  18: [
    "For two undulatory signals on the same circuit, A+B is the algebraic sum. The combined trace has its own shape rather than erasing the source variations, just as two sounds combine in air while retaining a compound waveform.",
  ],
  19: [
    "Bell gives examples of induction: a current-carrying wire vibrating near another wire, or a rotating cylinder bearing bar magnets near an electromagnet. Each changes the magnetic relation continuously enough to induce an undulatory current.",
  ],
  20: [
    "This paragraph catalogs other ways to vary a closed circuit: move an inductive body or conductor, vary resistance, or vary battery power. The mercury example makes the resistance mechanism concrete: deeper immersion gives a larger conducting path and less liquid resistance. It is an example, not a description of Figure 7's electromagnetic voice apparatus.",
  ],
  21: [
    "Figure 5 is Bell's compact magnetic transmitter-receiver pair. A spring armature c is fixed at one end near a two-legged electromagnet; its free end can vibrate and produce a pitch.",
  ],
  22: [
    "When armature c vibrates, the source instrument produces a varying induced current. A tuned armature h at the distant instrument responds when it is in unison with c. A receiver tuned to another pitch remains comparatively still.",
  ],
  23: [
    "Figure 6 extends that selectivity to three groups of instruments. Vibrating A excites A¹ and A², while a differently tuned group does not answer. Bell also says the duration of a tone could encode Morse dots and dashes.",
  ],
  24: [
    "Different pitches can therefore share the circuit because each resonant receiver responds to its matching source. Bell is describing multiplexed harmonic telegraphy, not a modern switched telephone exchange.",
  ],
  25: [
    "Bell notes that the same arrangement could convey simultaneous musical notes of different pitch and loudness, and could carry other noises or sounds.",
  ],
  26: [
    "The receiver tracks amplitude as well as pitch. In Bell's example, a weak vibration of c makes h sound softly and a stronger one makes h sound louder; Figure 6 extends that relation to several simultaneous instrument groups.",
  ],
  27: [
    "Bell has used wind as a simple driver. Figure 7 supplies the decisive alternative: a human voice or musical instrument moves the armature.",
  ],
  28: [
    "In Figure 7 a stretched membrane a drives armature c near electromagnet b. Cone A concentrates sound at the membrane. Its motion creates electrical undulations in the circuit E-b-e-f-g whose graphical shape follows the sound-caused air motion.",
  ],
  29: [
    "At the distant electromagnet f, armature h copies c's motion, making a similar sound at receiver I. This is the source's direct statement of acoustic-to-electrical-to-acoustic reproduction.",
  ],
  30: [
    "Bell deliberately treats oscillation, vibration, and undulation as interchangeable in this specification, but contrasts all three with abrupt intermittent and pulsatory actions. His broad term for an inductive body includes nonmagnetic conducting metals as well as iron and steel.",
  ],
  31: [
    "The descriptive portion ends here. The five numbered claims now state the legal combinations and methods Bell asks the Patent Office to protect.",
  ],
  37: [
    "Bell states the execution date: January 20, 1876. That is the date of the signed specification, distinct from the February filing and March grant dates in the masthead.",
  ],
  38: [
    "The signature identifies the inventor as Alex. Graham Bell. It adopts the specification and claims as his statement to the Patent Office.",
  ],
  39: [
    "Thomas E. Barry and P. D. Richards appear as witnesses to Bell's execution of the instrument. They are not additional inventors or technical contributors named by the patent.",
  ],
};
