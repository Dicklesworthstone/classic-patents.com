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

const term = (value: string, definition: string): CuratedSpecificationInline => ({
  kind: "term",
  text: value,
  definition,
});

const crop = (file: string, width: number, height: number, label: string) => ({
  src: `/patents/figures/us-200521-edison-phonograph-${file}.png`,
  alt: `Source-facsimile crop of ${label} from US 200,521.`,
  width,
  height,
});

const FIGURES = {
  "Fig. 1": crop("fig-1-source-crop", 1700, 820, "Fig. 1"),
  "Fig. 2": crop("fig-2-tight-source-crop", 1400, 800, "Fig. 2"),
  "Fig. 3": crop("fig-3-complete-source-crop-v2", 700, 620, "Fig. 3"),
  "Fig. 4": crop("fig-4-source-crop", 700, 550, "Fig. 4"),
} as const;

const figure = (
  label: keyof typeof FIGURES,
  sourceText: string = label,
): CuratedSpecificationInline => ({
  kind: "reference",
  text: sourceText,
  href: "#",
  referenceType: "figure",
  label: `Open the source-facsimile crop for ${label} in US 200,521`,
  figurePreviews: [FIGURES[label]],
});

const claim = (number: number, value: string) => ({
  kind: "claim" as const,
  number,
  inlines: text(value),
});

/**
 * Continuous, manually prepared reading edition of the three-page US 200,521
 * facsimile. The first source page is a drawing sheet with a printed identity
 * and execution block, followed by the uninterrupted specification.
 */
export const edisonPhonographArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "6ed4354f12dc944b49ac2a2a3dd8d0aaa3f263d0c5f2017b2237a37ffde00ccd",
  preparedBy: "Classic Patents editorial agent (GPT-5.6)",
  preparedAt: "2026-08-18",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE.",
        "THOMAS A. EDISON, OF MENLO PARK, NEW JERSEY.",
        "IMPROVEMENT IN PHONOGRAPH OR SPEAKING MACHINES.",
        "Specification forming part of Letters Patent No. 200,521, dated February 19, 1878; application filed December 24, 1877.",
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "T. A. EDISON. — PHONOGRAPH OR SPEAKING MACHINE.",
      title: "No. 200,521. Patented Feb. 19, 1878. — FIGURES 1–4.",
      description: [
        { kind: "small-caps", text: "Witnesses: Chas. H. Smith." },
        { kind: "small-caps", text: "Inventor: Thomas A. Edison." },
        { kind: "text", text: " for " },
        { kind: "small-caps", text: "Lemuel W. Serrell, atty." },
        { kind: "text", text: " The drawing sheet contains " },
        figure("Fig. 1"),
        { kind: "text", text: ", " },
        figure("Fig. 2"),
        { kind: "text", text: ", " },
        figure("Fig. 3"),
        { kind: "text", text: ", and " },
        figure("Fig. 4"),
        { kind: "text", text: "." },
      ],
    },
    paragraph(
      text(
        "T. A. EDISON. Phonograph or Speaking Machine. No. 200,521. Patented Feb. 19, 1878. Witnesses: Chas. H. Smith. Inventor: Thomas A. Edison. for Lemuel W. Serrell, atty.",
      ),
    ),
    paragraph(text("To all whom it may concern:")),
    paragraph(
      text(
        "Be it known that I, THOMAS A. EDISON, of Menlo Park, in the county of Middlesex and State of New Jersey, have invented an Improvement in Phonograph or Speaking Machines, of which the following is a specification:",
      ),
    ),
    paragraph(
      text(
        "The object of this invention is to record in permanent characters the human voice and other sounds, from which characters such sounds may be reproduced and rendered audible again at a future time.",
      ),
    ),
    paragraph(
      text(
        "The invention consists in arranging a plate, diaphragm, or other flexible body capable of being vibrated by the human voice or other sounds, in conjunction with a material capable of registering the movements of such vibrating body by embossing or indenting or altering such material, in such a manner that such register-marks will be sufficient to cause a second vibrating plate or body to be set in motion by them, and thus reproduce the motions of the first vibrating body.",
      ),
    ),
    paragraph(
      text(
        "The invention further consists in the various combinations of mechanism to carry out my invention.",
      ),
    ),
    paragraph(
      text(
        "I have discovered, after a long series of experiments, that a diaphragm or other body capable of being set in motion by the human voice does not give, except in rare instances, superimposed vibrations, as has heretofore been supposed, but that each vibration is separate and distinct, and therefore it becomes possible to record and reproduce the sounds of the human voice.",
      ),
    ),
    paragraph([
      { kind: "text", text: "In the drawings, " },
      figure("Fig. 1", "Figure 1"),
      { kind: "text", text: " is a vertical section, illustrating my invention, and " },
      figure("Fig. 2"),
      { kind: "text", text: " is a plan of the same." },
    ]),
    paragraph(
      text(
        "A is a cylinder having a helical indenting groove cut from end to end—say, ten grooves to the inch. Upon this is placed the material to be indented, preferably metallic foil. This drum or cylinder is secured to a shaft, X, having at one end a thread cut with ten threads to the inch, the bearing P also having a thread cut in it.",
      ),
    ),
    paragraph(
      text(
        "L is a tube, provided with a longitudinal slot, and it is rotated by the clock-work at M, or other source of power.",
      ),
    ),
    paragraph(
      text(
        "The shaft X passes into the tube L, and it is rotated by a pin, 2, secured to the shaft, and passing through the slot on the tube L, the object of the long slot being to allow the shaft X to pass endwise through the center or support P by the action of the screw on X. At the same time that the cylinder is rotated it passes toward the support O.",
      ),
    ),
    paragraph([
      {
        kind: "text",
        text: "B is the speaking-tube or mouth-piece, which may be of any desired character, so long as proper slots or holes are provided to ",
      },
      term(
        "re-enforce",
        "A period spelling of reinforce: the openings are intended to strengthen the audible hissing consonants rather than to supply an unspecified electrical effect.",
      ),
      {
        kind: "text",
        text: " the hissing consonants. Devices to effect this object are shown in my application, No. 143, filed August 28, 1877. Hence they are not shown or further described herein.",
      },
    ]),
    paragraph([
      { kind: "text", text: "Upon the end of the tube or mouth-piece is a diaphragm, having an " },
      term(
        "indenting-point",
        "The hard central point attached to the diaphragm that presses the yielding recording surface, producing the physical marks used for later reproduction.",
      ),
      {
        kind: "text",
        text: " of hard material secured to its center, and so arranged in relation to the cylinder A that the point will be exactly opposite the groove in the cylinder at any position the cylinder may occupy in its forward rotary movement. The speaking-tube is arranged upon a standard, which, in practice, I provide with devices for causing the tube to approach and recede from the cylinder.",
      },
    ]),
    paragraph(text("The operation of recording is as follows:")),
    paragraph(
      text(
        "The cylinder is, by the action of the screw in X, placed adjacent to the pillar P, which brings the indenting-point of the diaphragm G opposite the first groove on the cylinder, over which is placed a sheet of thick metallic foil, paper, or other yielding material. The tube B is then adjusted toward the cylinder until the indenting-point touches the material and indents it slightly. The clock-work is then set running, and words spoken in the tube B will cause the diaphragm to take up every vibration, and these movements will be recorded with surprising accuracy by indentations in the foil.",
      ),
    ),
    paragraph(
      text(
        "After the foil on the cylinder has received the required indentations, or passed to its full limit toward O, it is made to return to P by proper means, and the indented material is brought to a position for reproducing and rendering audible the sounds that had been made by the person speaking into the tube B.",
      ),
    ),
    paragraph(
      text(
        "C is a tube similar to B, except that the diaphragm is somewhat lighter and more sensitive, although this is not actually necessary. In front of this diaphragm is a light spring, D, having a small point shorter and finer than the indenting-point on the diaphragm of B. This spring and point are so arranged as to fall exactly into the path of all the indentations. This spring is connected to the diaphragm F of C by a thread or other substance capable of conveying the movements of D. Now, when the cylinder is allowed to rotate, the spring D is set in motion by each indentation corresponding to its depth and length.",
      ),
    ),
    paragraph(
      text(
        "This motion is conveyed to the diaphragm either by vibrations through a thread or directly by connecting the spring to the diaphragm F, and these motions being due to the indentations, which are an exact record of every movement of the first diaphragm, the voice of the speaker is reproduced exactly and clearly, and with sufficient volume to be heard at some distance.",
      ),
    ),
    paragraph(
      text(
        "The indented material may be detached from the machine and preserved for any length of time, and by replacing the foil in a proper manner the original speaker's voice can be reproduced, and the same may be repeated frequently, as the foil is not changed in shape if the apparatus is properly adjusted.",
      ),
    ),
    paragraph([
      { kind: "text", text: "The record, if it be upon tin-foil, may be " },
      term(
        "stereotyped",
        "Made into a plaster-of-Paris mold or stereotype so that multiple copies of the recorded foil can be cast or pressed from it.",
      ),
      {
        kind: "text",
        text: " by means of the plaster-of-paris process, and from the stereotype multiple copies may be made expeditiously and cheaply by casting or by pressing tin-foil or other material upon it. This is valuable when musical compositions are required for numerous machines.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "It is obvious that many forms of mechanism may be used to give motion to the material to be indented. For instance, a revolving plate may have a ",
      },
      term(
        "volute spiral",
        "A spiral groove whose changing radius guides a follower gradually between the center and rim of a rotating plate.",
      ),
      {
        kind: "text",
        text: " cut both on its upper and lower surfaces, on the top of which the foil or indenting material is laid and secured in a proper manner.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "A two-part arm is used with this disk, the portion beneath the disk having a point in the lower groove, and the portion above the disk carrying the speaking and receiving ",
      },
      term(
        "diaphragmic",
        "An adjective meaning associated with a diaphragm: here, the sound-receiving and sound-reproducing devices carried by the upper arm.",
      ),
      { kind: "text", text: " devices, which arm is caused, by the " },
      term(
        "volute spiral",
        "The same varying-radius spiral groove on the lower face that mechanically sweeps the two-part arm across the plate.",
      ),
      {
        kind: "text",
        text: " groove upon the lower surface, to swing gradually from near the center to the outer circumference of the plate as it is revolved, or vice versa.",
      },
    ]),
    paragraph(
      text(
        "An apparatus of this general character adapted to a magnet that indents the paper is shown in my application for a patent, No. 128, filed March 26, 1877; hence no claim is made herein to such apparatus, and further description of the same is unnecessary.",
      ),
    ),
    paragraph([
      {
        kind: "text",
        text: "A wide continuous roll of material may be used, the diaphragmic devices being reciprocated by proper mechanical devices backward and forward over the roll as it passes forward; or a narrow strip like that in a ",
      },
      term(
        "Morse register",
        "A telegraph recording instrument that moves a narrow strip past a marking point; Edison invokes it as the physical form of an alternative sound-record carrier.",
      ),
      {
        kind: "text",
        text: " may be moved in contact with the indenting-point, and from this the sounds may be reproduced.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "The material employed for this purpose may be soft paper saturated or coated with ",
      },
      term(
        "paraffine",
        "A period spelling of paraffin, a wax-like coating material proposed for the paper carrier beneath its metal-foil surface.",
      ),
      {
        kind: "text",
        text: " or similar material, with a sheet of metal foil on the surface thereof to receive the impression from the indenting-point. I do not wish to confine myself to reproducing sound by indentations only, as the transmitting or recording device may be in a ",
      },
      term(
        "sinuous form",
        "A side-to-side wavelike trace rather than a sequence of vertical indentations. Edison describes it as an alternative way to carry the diaphragm's motion on paper.",
      ),
      {
        kind: "text",
        text: ", resulting from the use of a thread passing with paper beneath the pressure-rollers t, (see ",
      },
      figure("Fig. 3"),
      {
        kind: "text",
        text: ",) such thread being moved laterally by a fork or eye adjacent to the roller t, and receiving its motion from the diaphragm G, with which such fork or eye is connected, and thus record the movement of the diaphragm by the impression of the thread in the paper to the right and left of a straight line, from which indentation the receiving diaphragm may receive its motion and the sound be reproduced, substantially in the manner I have already shown; or the diaphragm may, by its motion, give more or less pressure to an inking-pen, u, ",
      },
      figure("Fig. 4"),
      {
        kind: "text",
        text: ", the point of which rests upon paper or other material moved along regularly beneath the point of the pen, thus causing more or less ink to be deposited upon the material, according to the greater or lesser movement of the diaphragm.",
      },
    ]),
    paragraph(
      text(
        "These ink-marks serve to give motion to a second diaphragm when the paper containing such marks is drawn along beneath the end of a lever resting upon them and connected to such diaphragm, the lever and diaphragm being moved by the friction between the point being greatest, or the thickness of the ink being greater where there is a large quantity of ink than where there is a small quantity. Thus the original sound-vibrations are reproduced upon the second diaphragm.",
      ),
    ),
    paragraph(text("I claim as my invention—")),
    { kind: "heading", level: 2, text: "Claims" },
    claim(
      1,
      "The method herein specified of reproducing the human voice or other sounds by causing the sound-vibrations to be recorded, substantially as specified, and obtaining motion from that record, substantially as set forth, for the reproduction of the sound-vibrations.",
    ),
    claim(
      2,
      "The combination, with a diaphragm exposed to sound-vibrations, of a moving surface of yielding material—such as metallic foil—upon which marks are made corresponding to the sound-vibrations, and of a character adapted to use in the reproduction of the sound, substantially as set forth.",
    ),
    claim(
      3,
      "The combination, with a surface having marks thereon corresponding to sound-vibrations, of a point receiving motion from such marks, and a diaphragm connected to said point, and responding to the motion of the point, substantially as set forth.",
    ),
    claim(
      4,
      "In an instrument for making a record of sound-vibrations, the combination, with the diaphragm and point, of a cylinder having a helical groove and means for revolving the cylinder and communicating an end movement corresponding to the inclination of the helical groove, substantially as set forth.",
    ),
    paragraph(text("Signed by me this 15th day of December, A. D. 1877.")),
    paragraph([{ kind: "small-caps", text: "THOS. A. EDISON." }]),
    paragraph([{ kind: "small-caps", text: "Witnesses: GEO. T. PINCKNEY, CHAS. H. SMITH." }]),
  ],
};

/** Each entry is a specific, non-lossy reading of its matching source paragraph. */
export const edisonPhonographParallelReadings: Readonly<Record<number, readonly string[]>> = {
  2: [
    "The first sheet is part of the patent instrument, not a decorative cover. It prints Edison’s abbreviated name, the title, patent number and grant date, the drawing signatures, and the attorney notation before showing Figs. 1 through 4.",
  ],
  3: [
    "This conventional address opens the public specification. It is legal framing, not part of the mechanism.",
  ],
  4: [
    "Edison names himself, Menlo Park, and an improvement in phonograph or speaking machines. He says the document is the specification that explains it.",
  ],
  5: [
    "The stated job is durable recording: turn a voice or other sound into marks that can later make the sound audible again.",
  ],
  6: [
    "The broad idea is a chain of motion. A voice moves one flexible body; that body alters a yielding surface; the resulting marks later move a second flexible body in the same pattern.",
  ],
  7: [
    "Edison also claims particular mechanisms that carry out that general record-and-reproduce chain.",
  ],
  8: [
    "He reports an experimental premise: voice-driven diaphragm motion can be treated as separate vibrations rather than an inseparable blur. That premise makes a physical record and later replay conceivable in his account.",
  ],
  9: [
    "Figure 1 is the vertical sectional construction. Figure 2 is the plan view of the same machine. The links show the actual source drawing, not a reconstructed schematic.",
  ],
  10: [
    "Cylinder A has ten helical grooves per inch and sits on shaft X, which also has ten threads per inch. Turning it therefore gives rotation and a matched axial advance. A foil sheet is the preferred recording surface.",
  ],
  11: [
    "Tube L is the clock-work-driven slotted member. Its long slot lets the shaft transmit rotation while still moving endwise through the support.",
  ],
  12: [
    "Pin 2 couples shaft X to the rotating slotted tube. The screw thread makes the cylinder travel toward support O while it turns, so the stylus reaches successive parts of the foil.",
  ],
  13: [
    "The mouthpiece may vary, but Edison requires passages that preserve sibilant consonants. He points to a separate 1877 application for those passages rather than claiming or redrawing them here.",
  ],
  14: [
    "A hard point at the speaking diaphragm is kept opposite the cylinder groove as the cylinder advances. The mount can move the speaking tube closer to or farther from the cylinder to set contact.",
  ],
  15: [
    "This sentence announces the recording procedure that the next paragraph sets out: position the cylinder, touch the foil, rotate, and speak.",
  ],
  16: [
    "The operator first puts the stylus at the first groove near pillar P, fits foil or another yielding sheet, and barely indents it. Running the clock-work while speaking makes diaphragm G carry each vibration into a foil indentation.",
  ],
  17: [
    "After a recording reaches its limit toward O, the cylinder returns toward P. The same marked material is then positioned for replay instead of recording.",
  ],
  18: [
    "Tube C is the reproducer. Its lighter diaphragm carries spring D and a finer point that follows the recorded indentations. A thread or direct connection carries that point's motion to diaphragm F.",
  ],
  19: [
    "As the cylinder turns beneath the tracer, the depth and length of each mark move spring D. That motion reaches the reproducing diaphragm and makes it repeat the pattern attributed to the first diaphragm.",
  ],
  20: [
    "Edison says the marked foil can be removed, stored, replaced, and played repeatedly if the apparatus is adjusted so that the foil is not deformed during replay.",
  ],
  21: [
    "He proposes making a plaster-of-Paris stereotype from tinfoil and pressing or casting multiple foil copies. His stated use case is supplying the same musical composition to many machines.",
  ],
  22: [
    "The cylinder is not the only possible carrier. A plate with an upper and lower volute spiral can hold foil while its groove controls the path of the recording and reproducing arm.",
  ],
  23: [
    "The lower member of the two-part arm follows the lower spiral. The upper member carries the speaking and receiving devices, so the groove slowly sweeps them from the center to the rim or back again.",
  ],
  24: [
    "Edison deliberately excludes this magnet-paper apparatus because he says it belongs to another application filed March 26, 1877. The exclusion marks a boundary of this specification rather than an omitted construction.",
  ],
  25: [
    "He also allows a wide advancing roll with a reciprocating head, or a narrow Morse-register-like strip that touches an indenting point and can later drive reproduction.",
  ],
  26: [
    "Here Edison adds two alternatives beyond foil embossing. A paraffine-coated paper and metal-foil surface can take the first impression. A thread can trace a side-to-side line beside a straight line in Figure 3; or an inking pen in Figure 4 can lay down more or less ink as the diaphragm moves. In both cases the later reader uses the trace or ink thickness to move another diaphragm.",
  ],
  27: [
    "The ink version is a mechanical reader: a lever rides over the drawn marks, moving more where the point's friction or the ink thickness is greater. Edison presents that varying motion as another way to recreate the original sound vibrations.",
  ],
  28: [
    "This is the exact transition from the descriptive specification to the numbered claims. Edison declares the following claims as his invention before Claim 1 begins.",
  ],
  34: [
    "Edison signs the completed specification on December 15, 1877. That execution date is distinct from the stated December 24 application filing date and February 19 grant date.",
  ],
  35: ["The initials and surname identify Edison as the signing inventor."],
  36: [
    "George T. Pinckney and Charles H. Smith are printed as witnesses to the signed instrument.",
  ],
};
