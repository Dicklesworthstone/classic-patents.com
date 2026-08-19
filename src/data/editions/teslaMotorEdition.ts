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
const term = (value: string, definition: string): CuratedSpecificationInline => ({
  kind: "term",
  text: value,
  definition,
});

const crop = (file: string, width: number, height: number, label: string) => ({
  src: `/patents/figures/us-381968-tesla-motor/${file}.png`,
  alt: `Source-facsimile crop of ${label} from US 381,968.`,
  width,
  height,
});

// Every source figure gets its own source-derived preview. Plural references below
// deliberately present the constituent figures rather than a generic sheet crop.
const FIGURE_1 = crop("fig-1-source-crop-v2", 700, 230, "Fig. 1");
const FIGURE_2 = crop("fig-2-source-crop-v2", 700, 230, "Fig. 2");
const FIGURE_3 = crop("fig-3-source-crop-v2", 700, 230, "Fig. 3");
const FIGURE_4 = crop("fig-4-source-crop-v2", 700, 230, "Fig. 4");
const FIGURE_5 = crop("fig-5-source-crop-v2", 700, 230, "Fig. 5");
const FIGURE_6 = crop("fig-6-source-crop-v2", 700, 200, "Fig. 6");
const FIGURE_7 = crop("fig-7-source-crop-v2", 700, 230, "Fig. 7");
const FIGURE_8 = crop("fig-8-source-crop-v2", 700, 230, "Fig. 8");
const FIGURE_1A = crop("fig-1a-source-crop-v2", 900, 220, "Fig. 1a");
const FIGURE_2A = crop("fig-2a-source-crop-v2", 900, 220, "Fig. 2a");
const FIGURE_3A = crop("fig-3a-source-crop-v2", 900, 220, "Fig. 3a");
// The first v2 selections were too shallow for these closely stacked states.
// These narrower, source-sheet v3 crops retain each complete state and its
// printed label, rather than treating an adjacent state as the preview.
const FIGURE_4A = crop("fig-4a-source-crop-v3", 800, 190, "Fig. 4a");
const FIGURE_5A = crop("fig-5a-source-crop-v3", 800, 180, "Fig. 5a");
const FIGURE_6A = crop("fig-6a-source-crop-v3", 800, 180, "Fig. 6a");
const FIGURE_7A = crop("fig-7a-source-crop-v2", 900, 190, "Fig. 7a");
const FIGURE_8A = crop("fig-8a-source-crop-v2", 900, 160, "Fig. 8a");
const FIGURE_9 = crop("fig-9-source-crop-v1", 1120, 800, "Fig. 9");
const FIGURE_10 = crop("fig-10-source-crop-v2", 930, 650, "Fig. 10");
const FIGURE_11 = crop("fig-11-source-crop-v2", 900, 600, "Fig. 11");
const FIGURE_12 = crop("fig-12-source-crop-v2", 1950, 600, "Fig. 12");
const FIGURE_13 = crop("fig-13-source-crop-v2", 1800, 650, "Fig. 13");
const FIGURE_14 = crop("fig-14-source-crop-v2", 650, 550, "Fig. 14");
const FIGURE_15 = crop("fig-15-source-crop-v2", 1850, 830, "Fig. 15");
const FIGURE_16 = crop("fig-16-source-crop-v2", 700, 350, "Fig. 16");
const FIGURE_17 = crop("fig-17-source-crop-v1", 650, 750, "Fig. 17");
const FIGURE_18 = crop("fig-18-source-crop-v1", 570, 500, "Fig. 18");
const FIGURE_19 = crop("fig-19-source-crop-v1", 1060, 700, "Fig. 19");

const FIGURES = {
  "Fig. 1": [FIGURE_1],
  "Fig. 2": [FIGURE_2],
  "Fig. 3": [FIGURE_3],
  "Fig. 4": [FIGURE_4],
  "Fig. 5": [FIGURE_5],
  "Fig. 6": [FIGURE_6],
  "Fig. 7": [FIGURE_7],
  "Fig. 8": [FIGURE_8],
  "Fig. 1a": [FIGURE_1A],
  "Fig. 2a": [FIGURE_2A],
  "Fig. 3a": [FIGURE_3A],
  "Fig. 4a": [FIGURE_4A],
  "Fig. 5a": [FIGURE_5A],
  "Fig. 6a": [FIGURE_6A],
  "Fig. 7a": [FIGURE_7A],
  "Fig. 8a": [FIGURE_8A],
  "Fig. 9": [FIGURE_9],
  "Fig. 10": [FIGURE_10],
  "Fig. 11": [FIGURE_11],
  "Fig. 12": [FIGURE_12],
  "Fig. 13": [FIGURE_13],
  "Fig. 14": [FIGURE_14],
  "Fig. 15": [FIGURE_15],
  "Fig. 16": [FIGURE_16],
  "Fig. 17": [FIGURE_17],
  "Fig. 18": [FIGURE_18],
  "Fig. 19": [FIGURE_19],
  "Figs. 1 to 8": [FIGURE_1, FIGURE_2, FIGURE_3, FIGURE_4, FIGURE_5, FIGURE_6, FIGURE_7, FIGURE_8],
  "Figs. 1a to 8a": [
    FIGURE_1A,
    FIGURE_2A,
    FIGURE_3A,
    FIGURE_4A,
    FIGURE_5A,
    FIGURE_6A,
    FIGURE_7A,
    FIGURE_8A,
  ],
  "Figs. 10 to 12": [FIGURE_10, FIGURE_11, FIGURE_12],
  "Figs. 13 and 14": [FIGURE_13, FIGURE_14],
  "Figs. 15 and 16": [FIGURE_15, FIGURE_16],
} as const;

const figure = (
  label: keyof typeof FIGURES,
  sourceText: string = label,
): CuratedSpecificationInline => ({
  kind: "reference",
  text: sourceText,
  href: "#",
  referenceType: "figure",
  label: `Open the source-facsimile crop for ${label} in US 381,968`,
  figurePreviews: FIGURES[label],
});

/**
 * A continuous, manually prepared reading of the entire nine-page US 381,968
 * facsimile. Pages 1–4 are drawing sheets. Pages 5–9 contain the complete
 * specification, four claims, inventor signature, and witness names.
 */
export const teslaMotorArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "cffd7ff061b05feef92c2d6ef4d767c7b7e8c6b4e0d10cc9be3fbd51841dce12",
  preparedBy: "Classic Patents editorial agent (GPT-5.6)",
  preparedAt: "2026-08-18",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE.",
        "NIKOLA TESLA, OF NEW YORK, N. Y., ASSIGNOR OF ONE-HALF TO CHARLES F. PECK, OF ENGLEWOOD, NEW JERSEY.",
        "ELECTRO-MAGNETIC MOTOR.",
        "Specification forming part of Letters Patent No. 381,968, dated May 1, 1888. Application filed October 12, 1887. Serial No. 252,132. (No model.)",
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "SHEET 1 OF 4",
      title: "Successive magnetic positions",
      description: [
        { kind: "text", text: "This sheet prints the generator positions " },
        figure("Figs. 1 to 8"),
        { kind: "text", text: " and their corresponding motor-ring positions " },
        figure("Figs. 1a to 8a"),
        { kind: "text", text: "." },
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "SHEET 2 OF 4",
      title: "Two-phase machine arrangements",
      description: [
        figure("Fig. 9"),
        { kind: "text", text: " shows the first motor-generator system, including generator " },
        term(
          "collector rings",
          "Insulated rings carried by the generator shaft. In Fig. 9 each ring is contacted by a collector or brush so a corresponding circuit can carry alternating current to the motor; this source arrangement is not universally brushless.",
        ),
        { kind: "text", text: " and brushes; " },
        figure("Figs. 10 to 12"),
        { kind: "text", text: " show a second arrangement and its connections." },
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "SHEET 3 OF 4",
      title: "Three-circuit and stationary-armature arrangements",
      description: [
        figure("Figs. 13 and 14"),
        { kind: "text", text: " show the six-pole system; " },
        figure("Figs. 15 and 16"),
        { kind: "text", text: " show the modified disk motor and generator." },
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "SHEET 4 OF 4",
      title: "Both motor elements wound with coils",
      description: [
        figure("Fig. 17"),
        { kind: "text", text: " is the motor, " },
        figure("Fig. 18"),
        { kind: "text", text: " its generator, and " },
        figure("Fig. 19"),
        { kind: "text", text: " the circuit connections." },
      ],
    },
    p(text("To all whom it may concern:")),
    p(
      text(
        "Be it known that I, NIKOLA TESLA, from Smiljan Lika, border country of Austria-Hungary, residing at New York, N. Y., have invented certain new and useful Improvements in Electro-Magnetic Motors, of which the following is a specification, reference being had to the drawings accompanying and forming a part of the same.",
      ),
    ),
    p(
      text(
        "The practical solution of the problem of the electrical conversion and transmission of mechanical energy involves certain requirements which the apparatus and systems heretofore employed have not been capable of fulfilling. Such a solution, primarily, demands a uniformity of speed in the motor irrespective of its load within its normal working limits. On the other hand, it is necessary, to attain a greater economy of conversion than has heretofore existed, to construct cheaper and more reliable and simple apparatus, and, lastly, the apparatus must be capable of easy management, and such that all danger from the use of currents of high tension, which are necessary to an economical transmission, may be avoided.",
      ),
    ),
    p([
      {
        kind: "text",
        text: "My present invention is directed to the production and improvement of apparatus capable of more nearly meeting these requirements than those heretofore available, and though I have described various means for the purpose, they involve the same main principles of construction and mode of operation, which may be described as follows: A motor is employed in which there are two or more ",
      },
      term(
        "independent circuits",
        "Tesla later says that “independent” does not require complete electrical isolation. Here it means separately arranged current paths whose effects can be timed and connected in the stated order.",
      ),
      {
        kind: "text",
        text: " through which alternate currents are passed at proper intervals, in the manner hereinafter described, for the purpose of effecting a progressive shifting of the magnetism or of the “",
      },
      term(
        "lines of force",
        "Tesla's period term for the spatial magnetic field pattern. In this specification, its progressive shift identifies the moving positions of strongest attraction in the motor.",
      ),
      {
        kind: "text",
        text: "” in accordance with the well-known theory, and a consequent action of the motor. It is obvious that a proper progressive shifting of the lines of force may be utilized to set up a movement or rotation of either element of the motor, the ",
      },
      term(
        "armature",
        "The motor member Tesla identifies as capable of movement. Depending on the illustrated form, it may be a free magnetic disk, a cylindrical wound core, or a ring element; the word does not mean one fixed modern rotor construction.",
      ),
      {
        kind: "text",
        text: ", or the field-magnet, and that if the currents directed through the several circuits of the motor are in the proper direction no ",
      },
      term(
        "commutator",
        "A mechanical switching device used in many direct-current motors to reverse current as the armature turns. Tesla's passage says his motor does not require one.",
      ),
      {
        kind: "text",
        text: " for the motor will be required; but to avoid all the usual commutating appliances in the system I prefer to connect the motor-circuits directly with those of a suitable alternating-current generator. The practical results of such a system, its economical advantages, and the mode of its construction and operation will be described more in detail by reference to the accompanying diagrams and drawings.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "Figures 1 to 8 and 1a to 8a, inclusive, are diagrams illustrating the principle of the action of my invention. The remaining figures are views of the apparatus in various forms by means of which the invention may be carried into effect, and which will be described in their order. Referring first to ",
      },
      figure("Fig. 9"),
      {
        kind: "text",
        text: ", which is a diagrammatic representation of a motor, a generator, and connecting-circuits in accordance with my invention, M is the motor, and G the generator for driving it.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "The motor comprises a ring or ",
      },
      term(
        "annulus",
        "A ring-shaped body. Tesla uses it for the magnetic ring R surrounding the movable disk in Figure 9.",
      ),
      {
        kind: "text",
        text: ", R, preferably built up of thin insulated iron rings or annular plates, so as to be as susceptible as possible to variations in its magnetic condition. This ring is surrounded by four coils of insulated wire symmetrically placed, and designated by C C C′ C′. The diametrically-opposite coils are connected up so as to co-operate in pairs in producing free poles on diametrically-opposite parts of the ring. The four free ends thus left are connected to terminals T T T′ T′, as indicated. Near the ring, and preferably inside of it, there is mounted on an axis or shaft, a, a magnetic disk, D, generally circular in shape, but having two segments cut away, as shown. This disk is mounted so as to turn freely within the ring R. The generator G is of any ordinary type, that shown in the present instance having field-magnets N S and a cylindrical armature-core, A, wound with the two coils B B′. The free ends of each coil are carried through the shaft a′ and connected, respectively, to insulated contact-rings b b b′ b′. Any convenient form of collector or brush bears on each ring and forms a terminal by which the current to and from a ring is conveyed. These terminals are connected to the terminals of the motor by the wires L and L′ in the manner indicated, whereby two complete circuits are formed—one including, say, the coils B of the generator C′ C′ of the motor, and the other the remaining coils B′ and C C of the generator and the motor.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "It remains now to explain the mode of operation of this system, and for this purpose I refer to the diagrams, ",
      },
      figure("Figs. 1 to 8", "Figs. 1 to 8"),
      { kind: "text", text: ", and " },
      figure("Figs. 1a to 8a", "1a to 8a"),
      {
        kind: "text",
        text: ", for an illustration of the various phases through which the coils of the generator pass when in operation, and the corresponding and resultant magnetic changes produced in the motor. The revolution of the armature of the generator between the field-magnets N S obviously produces in the coils B B′ alternating currents, the intensity and direction of which depend upon well-known laws.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "In the position of the coils indicated in ",
      },
      figure("Fig. 1"),
      {
        kind: "text",
        text: " the current in the coil B is practically nil, whereas the coil B′ at the same time is developing its maximum current, and by the means indicated in the description of ",
      },
      figure("Fig. 9"),
      {
        kind: "text",
        text: " the circuit including this coil B′ may also include, say, the coils C C of the motor, ",
      },
      figure("Fig. 1a"),
      {
        kind: "text",
        text: ". The result, with the proper connections, would be the magnetization of the ring R, the poles being on the line N S. The same order of connections being observed between the coil B and the coils C′, the latter, when traversed by a current, tend to fix the poles at right angles to the line N S of ",
      },
      figure("Fig. 1a"),
      { kind: "text", text: "." },
    ]),
    p([
      {
        kind: "text",
        text: "It results, therefore, that when the generator-coils have made one eighth of a revolution, reaching the position shown in ",
      },
      figure("Fig. 2"),
      {
        kind: "text",
        text: ", both pairs of coils C and C′ will be traversed by currents and act in opposition, in so far as the location of the poles is concerned. The position of the poles will therefore be the resultant of the magnetizing forces of the coils—that is to say, it will advance along the ring to a position corresponding to one-eighth of the revolution of the armature of the generator. In ",
      },
      figure("Fig. 3"),
      {
        kind: "text",
        text: " the armature of the generator has progressed to one-quarter of a revolution. At the point indicated the current in the coil B is maximum, while in B′ it is nil, the latter coil being in its neutral position. The poles of the ring R in ",
      },
      figure("Fig. 3a"),
      {
        kind: "text",
        text: " will, in consequence, be shifted to a position ninety degrees from that at the start, as shown. I have in like manner shown the conditions existing at each successive eighth of one revolution in the remaining figures. A short reference to these figures will suffice for an understanding of their significance.",
      },
    ]),
    p([
      figure("Fig. 4", "Figs. 4"),
      { kind: "text", text: " and " },
      figure("Fig. 4a", "4a"),
      {
        kind: "text",
        text: " illustrate the conditions which exist when the generator-armature has completed three eighths of a revolution. Here both coils are generating current; but the coil B′, having now entered the opposite field, is generating a current in the opposite direction, having the opposite magnetizing effect; hence the resultant pole will be on the line N S, as shown. In ",
      },
      figure("Fig. 5"),
      {
        kind: "text",
        text: " one-half of one revolution of the armature of the generator has been completed, and the resulting magnetic condition of the ring is shown in ",
      },
      figure("Fig. 5a"),
      {
        kind: "text",
        text: ". In this phase coil B is in the neutral position while coil B′ is generating its maximum current, which is in the same direction as in ",
      },
      figure("Fig. 4"),
      {
        kind: "text",
        text: ". The poles will consequently be shifted through one half of the ring. In ",
      },
      figure("Fig. 6"),
      {
        kind: "text",
        text: " the armature has completed five-eighths of a revolution. In this position coil B′ develops a less powerful current, but in the same direction as before. The coil B, on the other hand, having entered a field of opposite polarity, generates a current of opposite direction. The resultant poles will therefore be in the line N S, ",
      },
      figure("Fig. 6a"),
      {
        kind: "text",
        text: ", or, in other words, the poles of the ring will be shifted along five-eighths of its periphery.",
      },
    ]),
    p([
      figure("Fig. 7", "Figs. 7"),
      { kind: "text", text: " and " },
      figure("Fig. 7a", "7a"),
      {
        kind: "text",
        text: " in the same manner illustrate the phases of the generator and ring at three-quarters of a revolution, and ",
      },
      figure("Fig. 8", "Figs. 8"),
      { kind: "text", text: " and " },
      figure("Fig. 8a", "8a"),
      {
        kind: "text",
        text: " the same at seven-eighths of a revolution of the generator-armature. These figures will be readily understood from the foregoing. When a complete revolution is accomplished, the conditions existing at the start are re-established and the same action is repeated for the next and all subsequent revolutions, and, in general, it will now be seen that every revolution of the armature of the generator produces a corresponding shifting of the poles or lines of force around the ring. This effect I utilize in producing the rotation of a body or armature in a variety of ways—for example, applying the principle above described to the apparatus shown in ",
      },
      figure("Fig. 9"),
      {
        kind: "text",
        text: ". The disk D, owing to its tendency to assume that position in which it embraces the greatest possible number of the magnetic lines, is set in rotation, following the motion of the lines or the points of greatest attraction.",
      },
    ]),
    p([
      { kind: "text", text: "The disk D in " },
      figure("Fig. 9"),
      {
        kind: "text",
        text: " is shown as cut away on opposite sides; but this, I have found, is not essential to effecting its rotation, as a circular disk, as indicated by dotted lines, is also set in rotation. This phenomenon I attribute to a certain inertia or resistance inherent in the metal to the rapid shifting of the lines of force through the same, which results in a continuous tangential pull upon the disk, causing its rotation. This seems to be confirmed by the fact that a circular disk of steel is more effectively rotated than one of soft iron, for the reason that the former is assumed to possess a greater resistance to the shifting of the magnetic lines.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "In illustration of other forms of my invention, I shall now describe the remaining figures of the drawings. ",
      },
      figure("Fig. 10"),
      { kind: "text", text: " is a view in elevation and part vertical section of a motor. " },
      figure("Fig. 12"),
      {
        kind: "text",
        text: " is a top view of the same with the field in section and a diagram of connections. ",
      },
      figure("Fig. 11"),
      {
        kind: "text",
        text: " is an end or side view of a generator with the fields in section. This form of motor may be used in place of that shown above.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "D is a cylindrical or drum-armature core, which, for obvious reasons, should be split up as far as practicable to prevent the circulation within it of currents of induction. The core is wound longitudinally with two coils, E and E′, the ends of which are respectively connected to insulated contact-rings d d d′ d′, carried by the shaft a, upon which the armature is mounted. The armature is set to revolve within an iron shell, R′, which constitutes the field-magnet, or other element of the motor. This shell is preferably formed with a slot or opening, r, but it may be continuous, as shown by the dotted lines, and in this event it is preferably made of steel. It is also desirable that this shell should be divided up similarly to the armature and for similar reasons.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "As a generator for driving this motor I may use the device shown in ",
      },
      figure("Fig. 11"),
      {
        kind: "text",
        text: ". This represents an annular or ring armature, A, surrounded by four coils, F F F′ F′, of which those diametrically opposite are connected in series, so that four free ends are left, which are connected to the insulated contact-rings b b b′ b′. The ring is suitably mounted on a shaft, a′, between the poles N S. The contact-rings of each pair of generator-coils are connected to those of the motor, respectively, by means of contact-brushes and the two pairs of conductors L L and L′ L′, as indicated diagrammatically in ",
      },
      figure("Fig. 12"),
      {
        kind: "text",
        text: ". Now it is obvious from a consideration of the preceding figures that the rotation of the generator-ring produces currents in the coils F F′, which, being transmitted to the motor-coils, impart to the core of the latter magnetic poles constantly shifting or whirling around the core. This effect sets up a rotation of the armature owing to the attractive force between the shell and the poles of the armature, but inasmuch as the coils in this case move relative to the shell or field-magnet the movement of the coils is in the opposite direction to the progressive shifting of the poles.",
      },
    ]),
    p(
      text(
        "Other arrangements of the coils of both generator and motor are possible, and a greater number of circuits may be used, as will be seen in the two succeeding figures.",
      ),
    ),
    p([
      figure("Fig. 13"),
      {
        kind: "text",
        text: " is a diagrammatic illustration of a motor and a generator constructed and connected in accordance with my invention. ",
      },
      figure("Fig. 14"),
      {
        kind: "text",
        text: " is an end view of the generator with its field-magnets in section. The field of the motor M is produced by six magnetic poles, G′ G′, secured to or projecting from a ring or frame, H. These magnets or poles are wound with insulated coils, those diametrically opposite to each other being connected in pairs so as to produce opposite poles in each pair. This leaves six free ends, which are connected to the terminals T T T′ T′ T″ T″. The armature, which is mounted to rotate between the poles, is a cylinder or disk, D, of wrought-iron, mounted on the shaft a. Two segments of the same are cut away, as shown. The generator for this motor has in this instance an armature, A, wound with three coils, K K′ K″, at sixty degrees apart. The ends of these coils are connected, respectively, to insulated contact-rings e e e′ e′ e″ e″. These rings are connected to those of the motor in proper order by means of collecting-brushes and six wires, forming three independent circuits. The variations in the strength and direction of the currents transmitted through these circuits and traversing the coils of the motor produce a steadily-progressive shifting of the resultant attractive force exerted by the poles G′ upon the armature D, and consequently keep the armature rapidly rotating. The peculiar advantage of this disposition is in obtaining a more concentrated and powerful field. The application of this principle to systems involving multiple circuits generally will be understood from this apparatus.",
      },
    ]),
    p([
      { kind: "text", text: "Referring, now, to " },
      figure("Figs. 15 and 16"),
      {
        kind: "text",
        text: ", ",
      },
      figure("Fig. 15"),
      {
        kind: "text",
        text: " is a diagrammatic representation of a modified disposition of my invention. ",
      },
      figure("Fig. 16"),
      {
        kind: "text",
        text: " is a horizontal cross-section of the motor. In this case a disk, D, of magnetic metal, preferably cut away at opposite edges, as shown in dotted lines in ",
      },
      figure("Fig. 15"),
      {
        kind: "text",
        text: ", is mounted so as to turn freely inside two stationary coils, N′ N″, placed at right angles to one another. The coils are preferably wound on a frame, O, of insulating material, and their ends are connected to the fixed terminals T T T′ T′. The generator G is a representative of that class of alternating-current machines in which a stationary induced element is employed. That shown consists of a revolving permanent or electro magnet, A, and four independent stationary magnets, P P′, wound with coils, those diametrically opposite to each other being connected in series and having their ends secured to the terminals t t t′ t′. From these terminals the currents are led to the terminals of the motor, as shown in the drawings. The mode of operation is substantially the same as in the previous cases, the currents traversing the coils of the motor having the effect to turn the disk D. This mode of carrying out the invention has the advantage of dispensing with the sliding contacts in the system.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "In the forms of motor above described only one of the elements, the armature or the field-magnet, is provided with energizing-coils. It remains, then, to show how both elements may be wound with coils. Reference is therefore had to ",
      },
      figure("Fig. 17", "Figs. 17"),
      { kind: "text", text: ", " },
      figure("Fig. 18", "18"),
      { kind: "text", text: ", and " },
      figure("Fig. 19", "19"),
      {
        kind: "text",
        text: ". ",
      },
      figure("Fig. 17", "Fig. 17"),
      {
        kind: "text",
        text: " is an end view of such a motor. ",
      },
      figure("Fig. 18", "Fig. 18"),
      {
        kind: "text",
        text: " is a similar view of the generator with the field-magnets in section, and ",
      },
      figure("Fig. 19", "Fig. 19"),
      {
        kind: "text",
        text: " is a diagram of the circuit-connections.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "In ",
      },
      figure("Fig. 17", "Fig. 17"),
      {
        kind: "text",
        text: " the field-magnet of the motor consists of a ring, R, preferably of thin insulated iron sheets or bands with eight pole-pieces, G′, and corresponding recesses, in which four pairs of coils, V, are wound. The diametrically-opposite pairs of coils are connected in series and the free ends connected to four terminals, w, the rule to be followed in connecting being the same as hereinbefore explained. An armature, D, with two coils, E E′, at right angles to each other, is mounted to rotate inside of the field-magnet R. The ends of the armature-coils are connected to two pairs of contact-rings, d d d′ d′, ",
      },
      figure("Fig. 19", "Fig. 19"),
      {
        kind: "text",
        text: ". The generator for this motor may be of any suitable kind to produce currents of the desired character. In the present instance it consists of a field-magnet, N S, and an armature, A, with two coils at right angles, the ends of which are connected to four contact-rings, b b b′ b′, carried by its shaft. The circuit-connections are established between the rings on the generator-shaft and those on the motor-shaft by collecting brushes and wires, as previously explained.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "In order to properly energize the field-magnet of the motor, however, the connections are so made with the armature coils or wires leading thereto that while the points of greatest attraction or greatest density of magnetic lines of force upon the armature are shifted in one direction those upon the field-magnet are made to progress in an opposite direction. In other respects the operation is identically the same as in the other cases cited. This arrangement results in an increased speed of rotation. In ",
      },
      figure("Fig. 17", "Figs. 17"),
      { kind: "text", text: " and " },
      figure("Fig. 19", "19"),
      {
        kind: "text",
        text: ", for example, the terminals of each set of field-coils are connected with the wires to the two armature-coils in such way that the field-coils will maintain opposite poles in advance of the poles of the armature.",
      },
    ]),
    p([
      { kind: "text", text: "In the drawings the field-coils are in " },
      term(
        "shunts",
        "Parallel circuit branches. Tesla says the field coils are drawn in shunt with the armature but may instead be series or independent circuits in the described motor forms.",
      ),
      {
        kind: "text",
        text: " to the armature, but they may be in series or in independent circuits. It is obvious that the same principle may be applied to the various typical forms of motor hereinbefore described.",
      },
    ]),
    p(
      text(
        "Having now described the nature of my invention and some of the various ways in which it is or may be carried into effect, I would call attention to certain characteristics which the applications of the invention possess and the advantages which the invention secures.",
      ),
    ),
    p([
      { kind: "text", text: "In my motor, considering for convenience that represented in " },
      figure("Fig. 9"),
      {
        kind: "text",
        text: ", it will be observed that since the disk D has a tendency to follow continuously the points of greatest attraction, and since these points are shifted around the ring once for each revolution of the armature of the generator, it follows that the movement of the disk D will be synchronous with that of the armature A. This feature by practical demonstrations I have found to exist in all other forms in which one revolution of the armature of the generator produces a shifting of the poles of the motor through three hundred and sixty degrees.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "In the particular construction shown in ",
      },
      figure("Fig. 15"),
      {
        kind: "text",
        text: ", or in others constructed on a similar plan, the number of alternating impulses resulting from one revolution of the generator armature is double as compared with the preceding cases, and the polarities in the motor are shifted around twice by one revolution of the generator-armature. The speed of the motor will, therefore, be twice that of the generator. The same result is evidently obtained by such a disposition as that shown in ",
      },
      figure("Fig. 17"),
      {
        kind: "text",
        text: ", where the poles of both elements are shifted in opposite directions.",
      },
    ]),
    p([
      { kind: "text", text: "Again, considering the apparatus illustrated by " },
      figure("Fig. 9"),
      {
        kind: "text",
        text: " as typical of the invention, it is obvious that since the attractive effect upon the disk D is greatest when the disk is in its proper relative position to the poles developed in the ring R—that is to say, when its ends or poles immediately follow those of the ring—the speed of the motor for all the loads within the normal working limits of the motor will be practically constant. It is clearly apparent that the speed can never exceed the arbitrary limit as determined by the generator, and also that within certain limits at least the speed of the motor will be independent of the strength of the current.",
      },
    ]),
    p(
      text(
        "It will now be more readily seen from the above description how far the requirements of a practical system of electrical transmission of power are realized in my invention. I secure, first, a uniform speed under all loads within the normal-working limits of the motor without the use of any auxiliary regulator; second, synchronism between the motor and generator; third, greater efficiency by the more direct application of the current, no commutating devices being required on either the motor or generator; fourth, cheapness and simplicity of mechanical construction and economy in maintenance; fifth, the capability of being very easily managed or controlled; and, sixth, diminution of danger from injury to persons and apparatus.",
      ),
    ),
    p([
      { kind: "text", text: "These motors may be run in series, " },
      term(
        "multiple arc",
        "Tesla's period name for a parallel connection of multiple circuit branches. It is distinct from series and multiple-series arrangements named in the same sentence.",
      ),
      {
        kind: "text",
        text: " or multiple series, under conditions well understood by those skilled in the art.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "The means or devices for carrying out the principle may be varied to a far greater extent than I have been able to indicate; but I regard as within my invention, and I desire to secure by Letters Patent in general, motors containing two or more independent circuits through which the operating-currents are led in the manner described. By \u201cindependent\u201d I do not mean to imply that the circuits are necessarily isolated from one another, for in some instances there might be electrical connections between them to regulate or modify the action of the motor without necessarily producing a new or different action.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "I am aware that the rotation of the armature of a motor wound with two energizing-coils at right angles to each other has been effected by an intermittent shifting of the energizing effect of both coils through which a direct current by means of mechanical devices has been transmitted in alternately-opposite directions; but this method or plan I regard as absolutely impracticable for the purposes for which my invention is designed—at least on any extended scale—for the reasons, mainly, that a great waste of energy is necessarily involved unless the number of energizing-circuits is very great, and that the interruption and reversal of a current of any considerable strength by means of any known mechanical devices is a matter of the greatest difficulty and expense.",
      },
    ]),
    p(
      text(
        "In this application I do not claim the method of operating motors which is herein involved, having made separate application for such method.",
      ),
    ),
    { kind: "heading", level: 2, text: "Claims" },
    p(text("I therefore claim the following:")),
    claim(
      1,
      "The combination, with a motor containing separate or independent circuits on the armature or field-magnet, or both, of an alternating-current generator containing induced circuits connected independently to corresponding circuits in the motor, whereby a rotation of the generator produces a progressive shifting of the poles of the motor, as herein described.",
    ),
    {
      kind: "claim",
      number: 2,
      inlines: [
        {
          kind: "text",
          text: "In a system for the electrical transmission of power, the combination of a motor provided with two or more independent ",
        },
        term(
          "magnetizing-coils",
          "Coils whose current establishes the motor's magnetic poles. Claim 2 requires two or more independently connected coils and matching induced generator coils arranged to shift those poles progressively.",
        ),
        {
          kind: "text",
          text: " and an alternating-current generator containing induced coils corresponding to the motor-coils, and circuits connecting directly the motor and generator coils in such order that the currents developed by the generator will be passed through the corresponding motor-coils, and thereby produce a progressive shifting of the poles of the motor, as herein set forth.",
        },
      ],
    },
    claim(
      3,
      "The combination, with a motor having an annular or ring-shaped field-magnet and a cylindrical or equivalent armature, and independent coils on the field-magnet or armature, or both, of an alternating-current generator having correspondingly independent coils, and circuits including the generator-coils and corresponding motor-coils in such manner that the rotation of the generator causes a progressive shifting of the poles of the motor in the manner set forth.",
    ),
    claim(
      4,
      "In a system for the electrical transmission of power, the combination of the following instrumentalities, to wit: a motor composed of a disk or its equivalent mounted within a ring or annular field-magnet, which is provided with magnetizing-coils connected in diametrically-opposite pairs or groups to independent terminals, a generator having induced coils or groups of coils equal in number to the pairs or groups of motor-coils, and circuits connecting the terminals of said coils to the terminals of the motor, respectively, and in such order that the rotation of the generator and the consequent production of alternating currents in the respective circuits produces a progressive shifting of the poles of the motor, as hereinbefore described.",
    ),
    p([{ kind: "small-caps", text: "NIKOLA TESLA." }]),
    p([{ kind: "small-caps", text: "Witnesses: FRANK E. HARTLEY, FRANK B. MURPHY." }]),
  ],
};

/** A non-lossy explanatory companion for each prose node, keyed by block index. */
export const teslaMotorParallelReadings: Readonly<Record<number, readonly string[]>> = {
  5: [
    "This conventional address opens the legal specification. It does not add a technical limitation.",
  ],
  6: [
    "Tesla identifies himself, his residence, the subject matter, and the drawings that form part of the specification. The wording records origin and authorship; it is not a modern nationality claim.",
  ],
  7: [
    "Tesla frames the engineering target as transmission and conversion of mechanical power. He wants speed that remains substantially uniform through the motor's normal load range, simpler and cheaper apparatus, and less danger when high-tension transmission currents are used.",
  ],
  8: [
    "The proposed mechanism is a motor with two or more independent circuits. Timed alternating currents shift the field's places of greatest attraction progressively. A movable armature or a movable field can follow that progression, and a direct connection to a suitable alternating-current generator removes the motor commutator from the proposed system.",
  ],
  9: [
    "The first sixteen diagrams are a phase-by-phase explanation, while later drawings are complete apparatus alternatives. Figure 9 begins with the basic coupled generator and motor.",
  ],
  10: [
    "Tesla's first motor is an annular laminated magnetic path carrying four coils. Opposite coils operate as pairs. The central disk is free to turn. The generator has two coils and four insulated rings, so two independent electrical paths connect corresponding generator and motor coils.",
  ],
  11: [
    "Tesla now uses the first sheet as a time sequence. The generator's two coils produce alternating currents whose directions and magnitudes change as its armature turns.",
  ],
  12: [
    "At the first position one generator coil is near zero while the other is at maximum. Its current energizes one opposing motor-coil pair, fixing the motor's poles on one diameter; the other pair would make poles on the perpendicular diameter when energized.",
  ],
  13: [
    "At successive eighth turns, contributions from both motor-coil pairs form a resultant magnetic direction between the original axes. At a quarter turn the first generator coil is maximum and the second is neutral, so the field has shifted ninety degrees. Tesla deliberately describes discrete diagram positions to establish a continuous progressive shift.",
  ],
  14: [
    "The remaining phase drawings track the same result through half and five-eighths turns. Reversal of one generator-coil current changes the sign of its magnetic contribution; the net pole position advances rather than jumping back.",
  ],
  15: [
    "After a full generator revolution the initial electrical condition recurs. The motor disk tends to take the position containing the greatest number of magnetic lines, so it follows the migrating high-attraction region and rotates.",
  ],
  16: [
    "The cutaway shape of the disk is not claimed as necessary. Tesla reports that an uncut steel disk also turns and gives his period explanation: resistance to rapid changes of magnetic state supplies a tangential pull. This is historical reasoning, not a claim that every modern induction rotor operates as a solid steel disk.",
  ],
  17: [
    "Figures 10–12 introduce an alternative motor and generator layout: an elevation/section, a top connection diagram, and a generator end view. Tesla is showing variants of the same progressive-field principle, not separate unconnected inventions.",
  ],
  18: [
    "Here the armature is a longitudinally wound drum inside an iron shell. Splitting the core reduces unwanted induced circulating currents. The shell can be slotted or continuous, and Tesla favors steel for the continuous version.",
  ],
  19: [
    "The companion generator has an annular armature and two opposing coil pairs. Its two output circuits feed the motor. Because the coils move relative to the shell in this layout, the armature's rotation is opposite the direction in which the poles progress around the core.",
  ],
  20: [
    "Tesla expressly leaves room for additional circuit arrangements. The next diagrams increase the number of independently driven circuits.",
  ],
  21: [
    "Figures 13 and 14 use six motor poles and a three-coil generator, with the generator coils spaced sixty degrees apart. Their six wires make three independent circuits. Their changing currents move the resultant attraction around the wrought-iron armature, producing rotation with a more concentrated field.",
  ],
  22: [
    "Figures 15 and 16 move to two fixed coils at right angles and a disk rotor. The generator shown has a rotating magnetic element and four stationary induced magnets. Tesla notes the same operating principle and identifies a practical advantage of this variant: no sliding contacts in the system.",
  ],
  23: [
    "Tesla next lets both the armature and the field carry energizing coils. Figures 17, 18, and 19 respectively show the motor, generator, and their circuit connections.",
  ],
  24: [
    "The motor's ring has eight pole pieces and four pairs of coils; its armature has two right-angle coils. The generator likewise supplies two right-angle coils. Tesla specifies the ring connections, brush connections, and the intended correspondence between generator and motor circuits.",
  ],
  25: [
    "The wiring advances the high-attraction regions on the armature one way and those on the field the other. Relative motion between those two moving magnetic patterns increases the rotation speed. This is a statement about the illustrated arrangement, not a promise of unlimited speed.",
  ],
  26: [
    "The shown field coils are shunts, but Tesla says they may instead be series or independent circuits. He claims the field-shifting principle as adaptable to the forms already described.",
  ],
  27: [
    "Tesla closes description of the embodiments and turns to the characteristics and advantages he believes the broader arrangement has.",
  ],
  28: [
    "For the Figure 9 arrangement, one generator revolution carries the motor's attractive region once around the ring. Tesla calls the disk's resulting motion synchronous with the generator armature under this model, based on his demonstrations.",
  ],
  29: [
    "In the Figure 15 form, the magnetic impulses and pole shifts occur twice per generator revolution; Tesla therefore says the motor can run at twice generator speed. Shifting armature and field poles in opposite directions, as in Figure 17, yields the same relative-motion result.",
  ],
  30: [
    "Tesla says the motor's speed has an upper limit set by the generator and should be practically constant across normal loads when the disk remains in its proper relation to the ring poles. He does not state the later squirrel-cage slip model here.",
  ],
  31: [
    "This is Tesla's list of intended system benefits: load-speed regularity, generator-motor synchronism, no commutating devices, simpler construction and maintenance, controllability, and less danger. It is a design argument before the legal claims, not a measured efficiency specification.",
  ],
  32: [
    "Tesla permits series, multiple-arc, and multiple-series operation, subject to ordinary engineering conditions familiar to skilled practitioners.",
  ],
  33: [
    "The patent's central breadth is two or more independent operating circuits used in the described way. Tesla carefully says independent does not mean electrically isolated: circuits may be connected to regulate or modify motor action.",
  ],
  34: [
    "Tesla distinguishes prior right-angle coil motors driven by mechanically interrupted and reversed direct current. He says that method wastes energy unless it uses many circuits and makes high-current interruption and reversal difficult and expensive.",
  ],
  35: [
    "Tesla disclaims the method of operating motors in this particular application because he filed a separate application for that method. The claims here are apparatus and system combinations.",
  ],
  37: [
    "Tesla introduces the formal claims that define the legal boundaries of the invention, focusing on the combination of multi-circuit motors with matching alternating-current generators.",
  ],
  42: [
    "Nikola Tesla's authentic printed signature executes and concludes the formal specification.",
  ],
  43: [
    "Frank E. Hartley and Frank B. Murphy serve as the two subscribing witnesses attesting to the execution of the instrument.",
  ],
};
