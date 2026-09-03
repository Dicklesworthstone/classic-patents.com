import type {
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

const t = (text: string): CuratedSpecificationInline => ({ kind: "text", text });
const term = (text: string, definition: string): CuratedSpecificationInline => ({
  kind: "term",
  text,
  definition,
});
const p = (...inlines: CuratedSpecificationInline[]) => ({
  kind: "paragraph" as const,
  inlines: inlines as CuratedSpecificationInlines,
});
const FIGURE_DIMS: Record<number, { width: number; height: number }> = {
  1: { width: 5000, height: 2700 },
  2: { width: 1800, height: 1800 },
  3: { width: 1500, height: 1500 },
  4: { width: 900, height: 1300 },
  5: { width: 1500, height: 1700 },
  6: { width: 1000, height: 1500 },
  7: { width: 1000, height: 1600 },
  8: { width: 5700, height: 1700 },
  9: { width: 1500, height: 1900 },
  10: { width: 5000, height: 1800 },
  11: { width: 1100, height: 1300 },
  12: { width: 1800, height: 1300 },
  13: { width: 2500, height: 900 },
  14: { width: 900, height: 1100 },
  15: { width: 700, height: 900 },
  16: { width: 360, height: 560 },
  17: { width: 360, height: 560 },
  18: { width: 500, height: 510 },
  19: { width: 310, height: 480 },
  20: { width: 280, height: 480 },
  21: { width: 320, height: 480 },
  22: { width: 260, height: 340 },
  23: { width: 200, height: 340 },
  24: { width: 230, height: 470 },
};
const figureAssetPath = (number: number) =>
  number === 16 || number === 17
    ? "/patents/figures/us-235199-bell-photophone/figs-16-and-17-source-crop-v5.png"
    : number >= 18
      ? `/patents/figures/us-235199-bell-photophone/fig-${number}-source-crop-v5.png`
      : `/patents/figures/us-235199-bell-photophone/fig-${number}-source-crop${number === 14 || number === 15 ? "-v4" : "-v3"}.png`;

function figurePreviews(numbers: readonly number[]) {
  const previews: Array<{
    src: string;
    alt: string;
    width: number;
    height: number;
  }> = [];
  const seenSources = new Set<string>();
  for (const number of numbers) {
    const src = figureAssetPath(number);
    if (seenSources.has(src)) continue;
    seenSources.add(src);
    previews.push({
      src,
      alt: `Fig. ${number} from US 235,199`,
      width: FIGURE_DIMS[number].width,
      height: FIGURE_DIMS[number].height,
    });
  }
  return previews;
}

const fig = (text: string, numbers: readonly number[]): CuratedSpecificationInline => ({
  kind: "reference",
  text,
  href: `#figure-${numbers[0]}`,
  referenceType: "figure",
  label: `Facsimile preview for ${text}`,
  figurePreviews: figurePreviews(numbers),
});

const SOURCE_PARAGRAPHS = [
  p(
    t(
      "Be it known that I, ALEXANDER GRAHAM BELL, of Washington, District of Columbia, have invented an Improved Apparatus for Signaling and Communicating, called “Photophone,” of which the following description, in connection with the accompanying drawings, is a specification.",
    ),
  ),
  p(
    t(
      "My invention consists in a method of utilizing radiant energy and of applying it by suitable apparatus to produce audible signals and to produce electric signals.",
    ),
  ),
  p(
    t(
      "The rays which proceed from the sun and other similar sources, falling upon various bodies, produce effects generally perceived by the senses, as heat or as color. Besides this, and notably when they fall upon the substances hereinafter mentioned, the energy which they are to convey produces in those bodies a change which the sense of touch or the sense of sight has not been able to take notice of. This changed condition may be fitly called a “",
    ),
    term(
      "state of strain",
      "Bell's period term for the transient, radiation-induced physical condition in a sensitive substance; it is the source-side state that later becomes an acoustic or electrical signal.",
    ),
    t(
      ",” and I have been able to make it manifest in various ways in different substances. My discovery and invention relate to this class of changes.",
    ),
  ),
  p(
    t(
      "The changes in the sensitive bodies employed in the apparatus I shall describe follow the changes in the energy of the disturbing rays falling upon them with such extreme rapidity that the two are substantially coincident in time as compared with the time occupied by any vibrational movement which can be detected by the ear. The extent of the change at each instant depends upon variation in the amount of radiant energy expended upon the sensitive body at that instant, and is approximately directly proportional thereto. The change to a greater or less state of strain thus produced in the sensitive body will therefore correspond with the variations in the disturbing cause both in extent and in rapidity of successions. If, therefore, the energy of the rays acting on the sensitive body passes alternately from a maximum to a minimum—that is, exhibits a variation of a vibrational character—the changes in the sensitive body will be thereby correspondingly controlled in their period of change, in their direction of change, in their amplitude of total change, and also in the character of the changes which take place while passing from a maximum to a minimum and back again; or, in other words, the curve which graphically represents the changes thus caused in the sensitive body will correspond to the curve which represents the variations in the disturbing rays due to natural causes, or which may be impressed upon them by artificial means.",
    ),
  ),
  p(
    t(
      "I have discovered and invented a method and apparatus for impressing any desired variation upon the rays or radiant energy falling upon the sensitive body. I have also discovered and invented a method and an apparatus by which the changes in the sensitive body from a less to a greater state of strain, and vice versa, can impart a corresponding motion to the air. If the changes succeed each other with sufficient rapidity and possess sufficient amplitude, the vibrational movements thereby imparted to the air become sensible as sound-waves, and a sound will be heard which will correspond in pitch to the rapidity with which these changes succeed each other, in loudness to their extent, and in “quality” to the character or vibrational form of the changes.",
    ),
  ),
  p(
    t(
      "The radiant energy which affects the sensitive body may be varied in several ways. Its source may be controlled when, as in the case of a lamp, it is in our reach. The rays which convey the energy may be controlled in their passage from the source to the sensitive body—for instance, a part or the whole may be intercepted by screens opaque to them, or the whole may have their energy diminished more or less by the interposition of substances which offer resistance to the passage without wholly interrupting it, or they may be more or less concentrated upon or diverted from the sensitive body by lenses, reflectors, or other appropriate means. The sensitive body may be normally exposed to the full force of the rays, and then partially or wholly protected from them. It may be normally wholly protected from them, and then partially or wholly exposed to them, or it may be normally partially exposed to their influence, and this exposure may then be alternately increased or decreased.",
    ),
  ),
  p(
    t(
      "In the forms of apparatus which I have devised the desired variations in the rays employed to affect the sensitive body are produced in these various ways by means of motion imparted to the appropriate part of the transmitter.",
    ),
  ),
  p(
    t(
      "The extent and character of the changes thereby caused in the sensitive body depend upon the extent and character of that motion, and consequently the sounds to which those changes give rise depend for their pitch upon the frequency of that motion, for their loudness upon its amplitude, and for their quality upon the character thereof. When, therefore, as in certain forms of apparatus which I have devised, a sufficient motion of the appropriate part of the transmitter is caused by the sound-waves which constitute vocal or other sounds acting upon a disk capable of vibrating, or its equivalent, the character of motion thus taken up from the air at the transmitting-station causes vibrational changes of a corresponding character in the sensitive body, and thereby vibrational movements of a corresponding character in the air at the receiving-station. Thus a similar sound to that made or uttered at the transmitting-station is heard at the receiving-station.",
    ),
  ),
  p(
    t(
      "The receiving-instrument consists of devices to receive the beam from the transmitter and direct it upon the sensitive body, together with the sensitive body itself, and, when needed, apparatus connected therewith to produce air-vibrations or sound-waves.",
    ),
  ),
  p(
    t(
      "An essential part of the receiver is the body sensitive to the rays which fall upon it, and the contrivances by which the disturbance therein produced by the rays is made sensible. There are several bodies whose electric conductivity is varied by the rays which fall upon them from the sun or other sources. Any variation in the amount or in the intensity of the radiant energy so falling upon them changes that conductivity or resistance. My apparatus uses this kind of sensitiveness to vary the current in a circuit, which includes the sensitive body, and also includes a telephonic receiver, which will thereupon give forth a sound whose character or quality will correspond to the character of the said variations. Selenium, when in the proper state, is the body which I have found most effective for this purpose.",
    ),
  ),
  p(
    t(
      "I have also found that of various substances, hard rubber especially, in thin sheets—say from the thickness of an ordinary hand-telephone diaphragm up to three millimeters—is so sensitive that when the sun-rays, concentrated by lenses or reflectors, are allowed to fall upon it, and these rays are rapidly interrupted, the ear, placed in contact with or in close proximity to the hard rubber, will hear proceeding from it a sound whose pitch varies with the frequency of the interruptions and corresponds to that frequency.",
    ),
  ),
  p(
    t(
      "I have obtained audible results by using as a receiver a disk of hard rubber, as described, and plates of gold, silver, platinum, aluminum, iron, steel, antimony, lead, Babbitt’s metal, Jenks’ steam-packing, tinned iron, tin-foil, brass, copper, German silver, and ordinary telephone-diaphragms. These were formed into plates about the size and thickness of the ordinary hand-telephone diaphragms. Similar results have been obtained with plates of mica, paper, different kinds of wood, patent-leather, vulcanized fiber, celluloid, ivory, silvered glass, and other substances.",
    ),
  ),
  p(
    t(
      "The receiver may be made in the form of a tube. In this case the light, in the form of a converging pencil, is thrown in at one end, so as to reach a focus near the entering end, and thence diverging so as to strike the inside of the tube. The operator listens at the other end. The tube serves as a resonator, and greatly amplifies the effect of interruptions whose frequency corresponds with the normal pitch of the tube. I have obtained audible results with tubes of soft vulcanized rubber, of brass, and of soft wood, about one-half inch in diameter or less.",
    ),
  ),
  p(
    t(
      "I now proceed to describe certain forms of apparatus in which I have embodied my invention.",
    ),
  ),
  p(
    t(
      "The apparatus employed consists, essentially, of an instrument which varies the amount of radiant energy falling upon the sensitive body, (this part of the apparatus I will call the “",
    ),
    term(
      "photophonic transmitter",
      "The source-side beam controller: an optical or source-modulating instrument that varies the radiant energy delivered toward the sensitive body in accordance with a signal.",
    ),
    t(
      ";” of an instrument by which the variations produced in the sensitive body are directly or indirectly made sensible as sound without the intervention of electricity, or as electrical variations which are capable of producing sounds or signals by means of an electric speaking telephonic receiver or other suitable electric signaling-instrument, (this part of the apparatus I will call a “",
    ),
    term(
      "photophonic receiver",
      "The receiving-side instrument: a sensitive body and its acoustic or electrical connections that turn the received radiant-energy variation into sound or a signal.",
    ),
    t(
      ";”) and of various devices for giving the proper direction or diffusion to the rays employed. These instruments must be suitably arranged and placed with reference to each other.",
    ),
  ),
  p(
    t(
      "I have spoken of the beam-controlling apparatus as the “photophonic transmitter,” and the sensitive body and parts connected with it as the “photophonic receiver,” and this is true if we consider chiefly the action of the beam itself; but, considering that form of apparatus shown which employs electricity as a modified electric speaking-telephone, we may properly call the beam-controller, the “beam,” and the electrically-sensitive body a “variable-resistance electric speaking-telephone transmitter,” operating to create electrical undulations by means of sound-waves, and the receiving-telephone as the “receiver.”",
    ),
  ),
  p(
    t(
      "If the rays are to pass over any considerable distance, they should, to obtain the best result, be formed into a ",
    ),
    term(
      "parallel pencil",
      "A nearly collimated beam whose rays remain close to parallel during the path, reducing geometric spreading and preserving useful radiant energy at a distant receiver.",
    ),
    t(
      " in order to prevent dispersion and loss of effect. At the point where they are to be controlled by the transmitter they are preferably concentrated in order that a large amount of energy may be readily controlled there, and this concentration may be wholly or partially continued till they reach the sensitive body, or they may be there again concentrated, so as to exercise their full effect on a small surface, which is important in most forms of apparatus.",
    ),
  ),
  p(
    t(
      "This management of the rays may be effected by well-known refracting and reflecting devices, the arrangement of which will be sufficiently apparent from the descriptions of apparatus hereinafter given.",
    ),
  ),
  p(
    t(
      "Similar devices will serve to direct the rays into the most convenient path, and it will be noticed hereinafter that I have made one of the most efficient forms of transmitter by availing myself of the power of a reflector to change the direction of the rays by changing the inclination of the whole or of any part of its surface.",
    ),
  ),
  p(
    fig("Figure 1", [1]),
    t(
      " is a general diagraphic view of a transmitting and receiving photophonic apparatus embodying my invention in what I have found to be a simple and effective arrangement for the production of a musical sound or note, and ",
    ),
    fig("Fig. 2", [2]),
    t(" a detail thereof illustrating the interrupter employed in this instance."),
  ),
  p(
    t(
      "A ray from the sun is caused to take a proper direction in any suitable manner—in this case by reflecting it, from a plane mirror or heliostat, a, into a condensing apparatus, (shown as a lens, b,) which should be aplanatic and achromatic to prevent dispersion, and which brings the beam to a focus, as at 2.",
    ),
  ),
  p(
    t(
      "A suitable screen—as a solution of alum in a glass cell, a', for example—to obstruct the passage of obscure heat-rays without obstructing the passage of light, may be used to protect the apparatus from the effect of heat when the sunlight is used. I have found with certain forms of receiving-instruments employing selenium such a heat-screen does not to any great extent diminish the effect produced.",
    ),
  ),
  p(
    t(
      "The passage of the rays at the point 2 may be interrupted or controlled in any suitable manner—as, for instance, by an interrupting wheel or disk, c, pivoted on an axle, d, so that the periphery of the said disk lies in the path of the rays; and at or near the focus 2 this disk is provided with a series of openings or holes, 3, (see ",
    ),
    fig("Fig. 2", [2]),
    t(",) lying in the range of the pencil of rays at or near the focal point 2."),
  ),
  p(
    t(
      "As the wheel c is rotated the rays will intermittently pass through the holes 3, and then be cut off by the blank spaces between the said holes, which blanks should be at least as large as the sectional area of the beam at the point 2 to insure its complete interception. A series of alternate impulses and interruptions will thus be produced, constituting what may be termed an “intermittent beam.” This beam passes on from the focal point 2, and may be directed to any desired point. The rays which diverge from the focal point 2 are again brought to the condition of a parallel pencil by the lens d', and thence pass to the receiving-instrument e—shown in this instance as a thin disk or diaphragm, f, of hard rubber, placed in a suitable frame or inclosing case, g, and which, as hereinbefore stated, will be affected by the intermittent beam falling on it in such manner as to produce sound-waves, the rapidity or pitch of which corresponds to the rapidity of interruption of the said beam caused by the disk c. The diaphragm f may be placed in a suitable sound-chamber furnished with a sound-passage or ear-piece, (shown as a flexible tube, h,) by which the sound may be conducted to the ear of a listener.",
    ),
  ),
  p(
    t(
      "A condensing-instrument (shown as a lens, i) is preferably used to concentrate the rays and increase their effect in the diaphragm f. The said condenser should be as large as possible, as the beam of light is somewhat dispersed in traversing any considerable distance.",
    ),
  ),
  p(
    t(
      "It is obvious that other forms of receiving-instruments may be used in connection with the above-described transmitter, or that this receiving-instrument may be used with other forms of transmitting-instrument. Various modifications of both of these will be hereinafter described.",
    ),
  ),
  p(
    t(
      "By varying the velocity of rotation of the disk c the rapidity of interruption of the beam will be correspondingly varied, and consequently the pitch of the sound produced at the receiving-station. In this form of transmitter the motion which causes the interruptions is continuously in the same direction. I have devised other forms to be used instead of it, and in which the screens employed operate by a to-and-fro or vibratory motion given to the moving part thereof. By means of these I am enabled to give a new power and capacity to the apparatus. ",
    ),
    fig("Figs. 4, 5, 6, 7", [4, 5, 6, 7]),
    t(" are such forms of apparatus."),
  ),
  p(
    fig("Fig. 4", [4]),
    t(
      " represents two gratings, kl, of which one, k, is fixed, while the other, l, is movable, and adapted to slide to and fro upon the fixed grating. In the condition shown in the drawings the opaque portion of one half overlaps and partially covers the open slit in the other, and a passage equal to about half the slit is afforded for the passage of the rays.",
    ),
  ),
  p(
    t(
      "If the movable grating is moved slightly upward, the space allowed for the rays is diminished or entirely cut off. If it be moved slightly downward, the space is increased, and if that motion extends through a distance equal only to half the width of the narrow slit the space allowed for the rays is doubled, and the increase or diminution will be directly proportional to the amplitude of the motion.",
    ),
  ),
  p(
    t("Such gratings may be constructed with actual open slits, as shown in "),
    fig("Fig. 4", [4]),
    t(
      ", or they may be made of glass covered with an opaque coating, (silver, for example,) which may be scraped off in strips to form the slits. I have found this kind the most convenient.",
    ),
  ),
  p(
    t(
      "If desired, the opaque portions may be polished, and the rays reflected therefrom employed to affect the receiving-instrument, the maximum amount being reflected when the polished portion of one grating is opposite the slits or unpolished portion of the other, so that the rays are reflected from the whole surface of both, and the minimum effect is",
    ),
  ),
  p(
    t(
      "when the polished portion of one is behind that of the other, and thus rendered inoperative for reflecting. In some instances both gratings may be made movable, in which case they should be so arranged that any actuating impulse would move them in opposite directions.",
    ),
  ),
  p(
    t("In the form of "),
    term(
      "intercepter",
      "Bell's spelling for an in-path beam interrupter or controller: a moving screen that changes how much of the radiant pencil continues toward the receiver.",
    ),
    t(" or beam-controller illustrated in "),
    fig("Figs. 5, 6, 7, ", [5, 6, 7]),
    t(
      "a series of slats, m, of opaque material, are pivoted, as at 5, in a frame-work in the path of the rays, the said slats being all oscillated simultaneously, like the slats of a window-blind, by a rod, n, connected with the actuating-vibrator j, as shown in ",
    ),
    fig("Fig. 6", [6]),
    t(
      ". The rod n is connected with all the slats on the same side of their pivoted points, so that they are all moved parallel; but in ",
    ),
    fig("Fig. 7", [7]),
    t(
      " the alternate slats are connected with the rod n on opposite sides of their pivots, so that they incline in opposite directions as they are closed. These slats, in their normal position, close about one-half the space, as shown in the main, ",
    ),
    fig("Figs. 6 and 7, ", [6, 7]),
    t(
      "(the rays passing in the direction of the arrow,) and by their movement in one direction they increase the open space for the rays to pass until they arrive at the position shown at 6, where the maximum amount is allowed to pass, while a movement in the other direction decreases the amount until, in the position shown at 7, the rays are wholly intercepted.",
    ),
  ),
  p(
    t(
      "It will be seen that when the slats are open, as shown at 6, they only present their edges as obstruction to the rays, and their thickness may be much less than the open space between them, so that a greater amount of rays may be allowed to pass than when the gratings shown in ",
    ),
    fig("Figs. 3 and 4", [3, 4]),
    t(
      " are used, as they never allow more than half the beam to pass. By connecting the rods n nearer the pivots 5 the same extent of movement in their rods will give a greater angular movement to the slats.",
    ),
  ),
  p(
    t(
      "It will be seen that none of these forms of screens or interruptions will give an intermittent beam, as herein described, unless they are wholly closed at each vibration; but if there be any vibration at all, the strength, and consequently the effect, of the pencil of rays which pass beyond the instrument, though never wholly interrupted, will vary in accordance with the period and with the amplitude of the vibrational movement of the moving part of the transmitter. These variations in the strength of the total beam, falling upon the sensitive body employed in the receiver, will cause in its condition changes which, in their rapidity of succession and in their extent, will correspond to the vibrational movement in the transmitter. When these changes are made sensible as sound, the pitch of that sound and the loudness of that sound will be controlled by the period and the amplitude of the motion given to the vibrational part of the transmitter.",
    ),
  ),
  p(
    t(
      "There are many ways in which vibratory motion can be communicated to these or other forms of screen. For example, the moving portion, being made as light as possible, can be attached, as shown in ",
    ),
    fig("Fig. 3", [3]),
    t(
      ", to a tuned reed, j, which may be moved by an electro-magnet, either directly as an automatic circuit-breaker, or by an electric current controlled by any of the well-known devices for interrupting or varying a current, or an organ-reed may be employed. In every such case the sound produced at the receiving-station will correspond in pitch and in loudness to the period of vibration, and to the amplitude of vibration of this transmitting-reed.",
    ),
  ),
  p(
    fig("Fig. 8", [8]),
    t(
      " shows photophonic apparatus by which articulate speech may be transmitted. I have already stated that the sound at the receiving-station due to the effect produced by the rays which reach the sensitive body there placed corresponds to the character of the changes in the energy of the pencil of rays which reach it.",
    ),
  ),
  p(
    t(
      "The hereinbefore described transmitters have been intended to control merely the pitch and the loudness of a simple musical note, and the devices in them have therefore been adapted to merely control the period during which the energy of the beam passes from its maximum to its minimum, and the range of its change or the difference of energy between its maximum and minimum.",
    ),
  ),
  p(
    t(
      "In order to transmit articulate speech, or any sound having a complex character or quality, it is further necessary, first, that the proper character shall be impressed upon the changes in the receiver, upon the variations in the rays, and upon the motion which produces them while passing from one extreme to the other; and, second, that the voice of the speaker or the sounds to be transmitted shall of themselves operate the photophonic transmitter and impress their own character or form of vibration upon the movable part of the apparatus which controls the beam.",
    ),
  ),
  p(
    t("In the apparatus, "),
    fig("Fig. 8", [8]),
    t(", the movable part of a screen-grating, kl, like that shown in "),
    fig("Fig. 4", [4]),
    t(
      ", is attached to the center of a diaphragm, o, constructed, mounted, and arranged in a sound-chamber, as is usual in electric speaking-telephone transmitters. When spoken to, this diaphragm and the movable part of the screen attached thereto take up from the sound-waves the peculiar character of vibration due to the quality of the sound uttered. The same character of vibrational change is thereby imparted to the pencil of rays which passes through the instrument, and by them to the sensitive body in the receiving-instrument, where it is made sensible by a sound of corresponding quality, and the words uttered into the transmitter are heard to proceed from the receiver.",
    ),
  ),
  p(
    t(
      "It is obvious that the diaphragm, instead of being operated directly by the sound-waves, could be made to vibrate by electrical means, such as used for imparting vibration to the diaphragm of a receiving-telephone.",
    ),
  ),
  p(
    t(
      "It is well known that the extent of motion which can be given by the voice to a diaphragm and the parts directly connected with it is quite small. By making the slits or openings in the screen small, a slight extent of motion will cause a great percentage of change—i. e., from an almost total interruption to the passage of one-half the rays—and by suitable means the rays can be so concentrated that this range of variation will produce a great absolute change in the radiant energy falling on the sensitive body. In passing the rays through fine slits, however, some difficulties arise in the nature of interference. I have obviated these by another form of articulate-speech transmitter, which I will presently describe.",
    ),
  ),
  p(
    t("In "),
    fig("Fig. 8", [8]),
    t(
      " the radiant body is shown as the flame of a candle, p, and the lens brings the divergent rays thereof to the condition of a parallel beam, which is controlled by the gratings kl.",
    ),
  ),
  p(
    t("Another method is to bring the rays to a focus, 2, "),
    fig("Fig. 9", [9]),
    t(
      ", and instead of the grating kl employ two plates, k'l', one fixed and the other connected to the vibrator or diaphragm o, the said plates having a hole, 8, of the size and form of the image at the focal point, and the hole of the fixed grating coinciding with said image in position to allow all the rays to pass through it. The movable plate, in passing to and from a position with its hole coinciding with that of the fixed plate, allows or obstructs the passage of a greater or less portion of the pencil of rays, which are then directed to and act upon the receiving-instrument, as in the other cases described.",
    ),
  ),
  p(
    t(
      "A single plate constructed in this manner, when properly guided, will operate in the same way, and by giving such a plate a movement parallel to the axis of the pencil of rays it will intercept an increasing portion thereof as it moves from the focal point, and thus control the beam.",
    ),
  ),
  p(
    t("The receiver, which is shown in "),
    fig("Fig. 8", [8]),
    t(
      ", depends upon the property hereinbefore referred to as belonging to certain substances, notably properly prepared selenium, of undergoing a great, instantaneous, and substantially proportional increase of conductivity when acted upon by the rays proceeding from the sun and other similar sources.",
    ),
  ),
  p(
    t(
      "A piece of selenium, S, brought into a suitable condition and suitably mounted, forms part of an electric circuit, supplied with a current by a constant electro-motive force, as by the battery B. This selenium is exposed to the rays which proceed from the transmitter, and every variation caused in its conductivity produces a corresponding variation in the strength of the current. These variations will, in the manner now well known to electricians, operate an electric speaking-telephone receiver, T, (or other sensitive electrical instrument,) placed in the circuit or connected with it, and this telephonic receiver will give forth the articulate words which have been uttered into the photophonic transmitter.",
    ),
  ),
  p(
    t("In another application I have described the manner of preparing and mounting the selenium."),
  ),
  p(
    t(
      "I now remark, however, that as the selenium, even when in its most favorable condition, is of ",
    ),
    term(
      "high resistance",
      "A large opposition to current in the selenium path; Bell responds by making the active path short and broad so the cell can carry a useful varying current.",
    ),
    t(
      ", it is desirable to interpose it in the circuit in the form of a conductor of but slight length and of large area, which may be done very advantageously by some novel forms of cells to be hereinafter described.",
    ),
  ),
  p(
    t(
      "Some of the best forms of apparatus for this purpose consist, generically, of two or more plates of good conducting metal, separated by a thin sheet of insulating material placed between each pair of plates. This insulating-sheet has a slightly smaller surface than the conducting-plates, and the space thus left is filled up with selenium, which thus serves as a conductor between the two plates.",
    ),
  ),
  p(
    t(
      "It is obvious that this construction enables the selenium to be used in the shape of a conductor of large area, nearly all of which is exposed to the rays, and of an extremely short length, equal to the thickness of the insulator, which may conveniently be a sheet of mica, while it uses very little selenium, and it is very easy to work the selenium into this shape, by heating the metal cell and fusing the selenium into the cavity left between the two plates when the insulator is placed between them. A considerable number of these cells may be built up side by side and connected in parallel branch circuits. Besides mica, the paints which are employed in painting on china may be used to separate the metal plates when baked. As the plates are heated the said paint becomes porcelain. Various forms of cell constructed on this plan will be hereinafter described. Other forms of cells are described in other applications filed by myself, and other applications filed by myself and Mr. Sumner Tainter jointly, and others filed by Mr. Sumner Tainter.",
    ),
  ),
  p(
    t(
      "The electric circuit being under control of the selenium resistance therein, and the selenium under control of the pencil of rays, and the rays under the control of the transmitting-instruments, it is obvious that any instruments which can be controlled by slight variations in an electric current—such as, for instance, the usual telephonic instruments—if placed in the electric circuit with the said selenium, will be controlled by and will emit sounds corresponding to the action of the said transmitting apparatus on the beam which falls on the selenium.",
    ),
  ),
  p(
    fig("Fig. 10", [10]),
    t(
      " illustrates another apparatus for transmitting complex sounds or articulate speech. As in the form last described, the sound-waves due to the voice serve to give to the movable part of the transmitter a vibrational movement of corresponding character, and this movement, in turn, impresses a vibrational or alternate variation of corresponding character upon the amount of radiant energy falling upon the sensitive part of the receiver.",
    ),
  ),
  p(
    t(
      "The pencil of rays is passed through a suitable concentrating apparatus, a, (shown here as a lens,) and also through a heat-absorbing apparatus, a', which prevents the heat-rays from warping the reflector of the transmitter. It then falls upon a reflector, r, (shown as a plane reflector placed at such an angle as to direct the rays to the receiver e.) After leaving this reflector the rays may be caused to pass through a lens, d', in order to give them the desired parallelism, if they do not already possess it. In the drawings they are shown more concentrated on the reflector r than in their path from the transmitter to the receiver. Arrived there they are caused to fall upon the sensitive receiver either directly, or, as in the drawings, after further concentration by the mirror s'. Tracing the path of a single ray from the lens a and cell a', it will be seen that its path from the reflector r will depend upon the angle at which that portion of the reflector r on which it falls is presented to it.",
    ),
  ),
  p(
    t(
      "If the reflector be so placed normally that the ray will pursue the path toward the receiver shown in the drawings, then a slight change in the angle of incidence of that particular ray will, if in one direction, so alter the subsequent path of the ray as to divert it from the receiver, or, if in the other direction will direct upon the receiver rays which otherwise might not have reached it. Any such change will therefore vary the amount of radiant energy exerted upon the receiver. I construct this reflector r of some material—such as glass, silvered, or thin, polished metal—which will take up from the sound-waves of the air their peculiar motion, and vibrate in accordance with them as the diaphragm of a speaking-telephone does. As it vibrates, each portion of it departs from its normal position as part of a plane surface, and bends or tips more or less in one direction or the other. Consequently each ray reflected from it is more or less diverted from its normal path, and thereby the total amount of radiant energy exerted on the sensitive receiver by all the rays reflected from the transmitter varies at each instant.",
    ),
  ),
  p(
    t(
      "The extent of variation from instant to instant, the direction of the variation, the period of each variation, and the character of each variation depend upon the vibrational movement of the transmitting-reflector, which causes the changes, and therefore the same character of vibrational movement given to the transmitter by the voice reappears in the variations in the radiant energy operative upon the sensitive part of the receiver, and consequently in the sound or other effects due to the changes in that sensitive body. The words spoken against the transmitter are thereupon heard to proceed from the receiver. I have thus transmitted articulate speech, using as a reflector a disk of silvered glass thirty inches in diameter, of tolerable thickness, and I have obtained clearer and better articulation by using as reflector a disk of thin glass, such as is used for mounting objects for the microscope, properly silvered, and about two inches in diameter.",
    ),
  ),
  p(
    t(
      "In the drawings the reflector r is shown as mounted in a mouth-piece such as is commonly used in telephones. It is essential that the mouth-piece should be so fixed and the reflector so held in it that its normal position should always be the same, in order that the rays may be directed to the receiver.",
    ),
  ),
  p(
    t(
      "It will sometimes be desirable to mount the transmitter so as to give it a universal movement. A mounting similar to that of a telescope of a surveyor’s transit accomplishes this, and a similar graduated limb is often useful.",
    ),
  ),
  p(
    t(
      "The mouth-piece or sound-passage may be made as a flexible tube, to enable it to be readily used with the mirror r in any desired angular position.",
    ),
  ),
  p(
    t(
      "I do not herein specifically claim this particular form of transmitter, as it is a joint invention of myself and my assistant, Mr. Sumner Tainter, and will form the subject of a joint application.",
    ),
  ),
  p(t("A small telescope attached to the instrument may be used as a finder.")),
  p(
    t(
      "The beam, after passing from the controlling or transmitting apparatus, is received, as in the other forms described, upon a collecting and condensing instrument, (shown in this instance as a parabolic mirror, s',) by which the rays are concentrated on a selenium cell, S', of peculiar construction, as will be hereinafter described. The said cell is placed at the focal point of the said mirror s', and adjusted in position as shown. It is supported at the end of the tube t, passing through a socket at the vertex of the mirror, and held in adjusted position therein by a set-screw, u. The electrodes u¹ u² pass out through the said tube, and may be connected with a battery and telephonic or electrical instruments, as before described in connection with ",
    ),
    fig("Fig. 8", [8]),
    t("."),
  ),
  p(
    t(
      "A small telescope or finder, v, may be employed to enable the operator to give the proper direction to the axis of the mirror; or this may be done by sighting through the tube t.",
    ),
  ),
  p(
    t("A simple form of selenium cell S is shown in plan and section, "),
    fig("Figs. 11 and 12, and ", [11, 12]),
    t("the different parts thereof in "),
    fig("Fig. 13", [13]),
    t(
      ". This cell has an arrangement similar to, but in construction is different from, what is known as “",
    ),
    term(
      "Siemens spiral",
      "The period name for a spiral or helical arrangement of alternating conductive and insulating strips; Bell adapts the geometry for broad selenium exposure and short current paths.",
    ),
    t(
      ".” Two ribbons, a² b², of suitable conducting material, preferably brass, form the terminals of the poles of the battery B, the said ribbons being separated by thin strips c² of suitable insulating material, which is slightly narrower than the metal strip, so as to leave a slight open space between the edges of said strips. The whole is then coiled into a flat spiral, in order to give it a more convenient form for exposure to the action of the rays, a second strip, d², of insulating material being interposed to prevent conductive contact between the consecutive coils of the spiral. The said coil is then heated to a temperature slightly higher than the melting-point of selenium and solid selenium rubbed over its surface. The selenium melts, filling the channels between the metallic ribbons and forming a connection between them, as shown at e².",
    ),
  ),
  p(
    t(
      "Ribbons of mica may be used as the insulating material to separate the plates, or they may be coated with enamel paints or Japan varnish, in which case a further amount of metal may be electro-deposited on the edges of the strips to give them the proper salience, or to form suitable channels for the reception of the selenium.",
    ),
  ),
  p(
    t("Another form of selenium cell that I have used is illustrated in plan and section in "),
    fig("Figs. 14, 15", [14, 15]),
    t(
      ". In this case the conducting and insulating materials are arranged in alternate parallel strips a³ b³ c³ d³, and only the alternate strips c³ of insulating material have a smaller extent of surface than the inclosing metal strips, so that the selenium e², deposited, as before described, in the channels left for it, will connect only alternate pairs of the said strips—that is, connect each strip b³ with the strip a³ on one side thereof, but not with the strip a³ on its other side. The strips a³ all project on one side and are electrically connected together by the rod f³, and the strips b³ are connected on the other side by the rod g³, and each connected set of strips with one pole of the battery, or, in other words, placed in a circuit which is completed by the selenium e².",
    ),
  ),
  p(
    t("Another form of cell used by me, and shown in plan and section in "),
    fig("Figs. 16, 17, ", [16, 17]),
    t(
      "consists, essentially, of a metal box, a⁴, and a disk, b⁴, fitted in and insulated from it. The said disk is provided with a series of tapering holes, 20, and the bottom of the box with a series of pins, 21, of slightly smaller diameter than the holes, so that when in place the said pins pass into the said holes, leaving a narrow annular space around each pin. These annular spaces are filled with melted selenium e², which thus closes the circuit between the box and disk. I do not specifically claim this particular form of cell, as it was invented by my assistant, Mr. Sumner Tainter, by whom an application for Letters Patent on the said cell will be filed, in which its construction will be fully described.",
    ),
  ),
  p(
    t("Another cell which has been used with excellent results is shown at S' in "),
    fig("Fig. 10", [10]),
    t(", and in side and end views, on a larger scale, in "),
    fig("Figs. 18 and 19, and ", [18, 19]),
    t("in detail in "),
    fig("Figs. 20, 21, 22, 23, 24", [20, 21, 22, 23, 24]),
    t(
      ". It is not herein specifically claimed, as it will form the subject of a joint application by myself and Mr. Sumner Tainter before mentioned. The principle of construction is similar to that of the cell described in connection with ",
    ),
    fig("Fig. 14", [14]),
    t(
      "; but the surface to be exposed is cylindrical instead of plane, such form being preferable when used in connection with a parabolic mirror as the instrument for condensing the rays, as shown in ",
    ),
    fig("Fig. 10", [10]),
    t("."),
  ),
  p(
    t(
      "Instead of rectangular strips of conducting and insulating material, circular disks a⁵ b⁵ c⁵ are used. Those marked c⁵, of insulating material, are slightly smaller in diameter than those a⁵ b⁵, of conducting material, so that annular channels are left between the edges of the conducting-disks a⁵ b⁵, around the periphery of the insulating-disks c⁵, and in this instance such channels are left between all the said disks a⁵ b⁵, so that each disk a⁵ will be connected by the adjacent annular rings e², of selenium, with both the disks b⁵ on either side. The disks are each provided with a central hole, 25, to enable them to be held in proper position on a mandrel, where they are clamped between two suitable end plates, h⁵ i⁵, the disks of metal and insulating material being alternated on the said mandrel. The conducting-disks are electrically connected together in two sets of alternate plates, a⁵ b⁵, between which the circuit is completed by the annular rings of selenium e², following the channels around the disks of insulating material c⁵. This connection is accomplished as follows: The disks are provided with holes, as shown in the detail in number. In the conducting-disks two of the holes, 30 31, are of larger diameter than the other two, 32 33, which are of the same size as all four of the holes in the insulating-disks. In placing the disks on the mandrel the holes are all placed with their centers in line, and the large holes 30 31 of each conducting-disk are in line with the small holes 32 33 of the conducting-disks on each side of it, or, in other words, in a given line of holes all those of the plates a⁵ will be of a different diameter from those of the plates b⁵.",
    ),
  ),
  p(
    t(
      "A cylinder of conducting material of a diameter equal to that of the small holes driven through a line of holes will touch and electrically connect the alternate conducting-plates having their small holes in that line, and will not touch the other plates. Two of the cylinders, f⁵, will connect together all the disks of one set, as a⁵, which will form one terminal of the circuit, and the other two cylinders, g⁵, will connect the disks of the other set, b⁵, which will form the other terminal; but the two sets a⁵ b⁵ will be separated by the selenium e².",
    ),
  ),
  p(
    t(
      "In order to insure a more perfect connection between the plates a⁵ and cylinders f⁵, and the plates b⁵ and cylinders g⁵, the said cylinders are made tubular and one or more slots, 40, cut longitudinally through their sides. Washers c⁶, of insulating material, are placed within the large holes 30 31 in the conducting-disks, so that the said washers completely insulate and separate that portion of the said disks from the cylinders.",
    ),
  ),
  p(
    t(
      "Melted conducting material—as, for example, type-metal—is poured into the tubes f⁵ g⁵, and, passing through the longitudinal slots, makes a perfect connection with the plates having small holes 32 33 around the said tubes, as shown in ",
    ),
    fig("Fig. 23", [23]),
    t(
      ", where the type-metal is indicated by the letter f⁷; but is prevented by the washers c⁶ from making a contact with the plates having the large holes adjacent to it, as shown in ",
    ),
    fig("Fig. 22", [22]),
    t("."),
  ),
  p(
    t(
      "Instead of the washers c⁶, of insulating material, smaller washers or rings of any material—as, for instance, metal—may be used to confine the molten metal and prevent its contact with the plates at the large holes, the said rings themselves being too small in diameter to touch the said disks.",
    ),
  ),
  p(
    t(
      "Instead of using molten metal in the tube to form the connection, pulverized conducting material may be used—as, for example, metal filings, spelter forming an excellent connector—and in such case the cell is much more readily taken apart. Nuts h⁶ on the ends of the tubes f⁵ g⁵ serve to hold the whole together.",
    ),
  ),
  p(
    t(
      "The cell is heated and the selenium melted thereon, and in all cases I have obtained better results by filing off the selenium which covered the edges of the conducting disks or strips, and leaving only the selenium between the said conducting strips or disks.",
    ),
  ),
  p(
    t(
      "After the surface is finished the mandrel, if of conducting material, should be removed, and a handle or tube, t, may be screwed into one of the end plates, h⁵, as a means for holding the cell in position.",
    ),
  ),
  p(
    t(
      "I have shown an alum cell placed in the path of the pencil, so that the only rays which operated the instrument were luminous rays.",
    ),
  ),
  p(
    t(
      "I have also produced audible effects with a selenium-cell receiver when I removed the alum cell and substituted a thin sheet of hard rubber—say one-eighth of an inch thick, and therefore sensibly opaque to light—and also when I placed in the path of the rays both the rubber and the alum cell. I do not therefore intend to limit myself to the employment of any particular portion of the rays which proceed from the sun or other similar bodies.",
    ),
  ),
  p(
    t(
      "I have called the apparatus a “photophone” because an ordinary beam of light contains rays which are practically operative. I will remark, however, that cutting off the luminous rays of the sun which have passed through the lenses, as by a solution of iodine in bisulphide of carbon, stops the operation of the apparatus.",
    ),
  ),
  p(
    t(
      "I have also employed with the selenium cell the rays of gas, of a petroleum-lamp, and of a candle, and of the lime-light. For many purposes, an artificial source of light the position of which can be adjusted at pleasure, and kept unchanged and unaffected by night or weather, is more convenient than sunlight.",
    ),
  ),
  p(
    t(
      "I have employed prepared selenium as a type of one class of sensitive bodies whose changed condition is manifested by the variation in the resistance they afford to a constant current, and a disk of hard rubber as a type of another class of bodies the changes in which can become directly audible as sound.",
    ),
  ),
  p(
    t(
      "I have described forms of apparatus in which the radiant energy falling upon a sensitive body operates to vary the resistance of the circuit of which it forms part, others to vary the electro-motive force of current in the circuit.",
    ),
  ),
  p(
    t(
      "The strength of the electric current in the receiving-circuit may also be varied by varying the electro-motive force developed in that circuit. Thus, for instance, a thermopile, when used as the sensitive part of the receiver, would also be directly affected by heat-rays, and would give rise to varying currents in a circuit in which it was placed; but in order that tones may be so produced, the thermopile must be not merely sensitive but much more rapid in its action than those ordinarily known.",
    ),
  ),
  p(
    t(
      "Rays of light, as distinguished from rays of heat, will develop an electric current when falling upon the junction of two different metals when reduced to the form of thin films. Light falling on sensitive selenium will also develop a current capable of giving electric signals. In both these contrivances, however, special rapidity of action as well as great sensitiveness is required.",
    ),
  ),
  p(
    t(
      "A beam of heat-rays, by falling upon a material arranged to absorb them quickly and again cool quickly—as fine wires strained—may be made to exhibit its variations.",
    ),
  ),
  p(
    t(
      "The amount of rays allowed to act on the receiver may be modified by controlling the source from which they are derived, instead of intercepting or deviating them in their path. The well-known manometric flame apparatus is suitable for this purpose. The motion required to operate such a flame apparatus may be given, as is well known, by the voice.",
    ),
  ),
  p(
    t(
      "The supply of gas for a burner may be allowed to pass through a grating similar to that shown in ",
    ),
    fig("Fig. 4", [4]),
    t(", and when the movable part is vibrated the supply of gas will be controlled accordingly."),
  ),
  p(
    t(
      "The beam may pass from the transmitting to the receiving instrument by other than direct paths, if necessary, and for this suitable reflectors or other directing-instrument may be employed.",
    ),
  ),
  p(
    t(
      "The instruments may be arranged with reference to each other according to the uses desired to be made of them. The transmitter and the sensitive body may be placed near together or be separated by any distance over which the rays can pass effectively.",
    ),
  ),
  p(
    t(
      "If the transmitter be operated by an electric current, the circuit which carries that current may be of any desired length and arranged in any appropriate way known to electricians.",
    ),
  ),
  p(
    t(
      "If an electrically-sensitive receiver be used—as, for example, a selenium cell—the circuit which contains it may be extended to any suitable distance, or may be connected with another circuit by induction-coils, in a manner and for purposes well known to electricians, and to those who are familiar with variable-resistance electric speaking-telephones.",
    ),
  ),
  p(
    t(
      "Inasmuch as the rays have no inertia and are inflexible, a slight motion of a reflector—such, for example, as it will receive if attached to the diaphragm of a receiving-telephone—can not only be made to manifest itself as light, (as in a reflecting-galvanometer,) but also as sound, or as a variation of an electric current in a secondary or local circuit supplied with its own battery.",
    ),
  ),
  p(
    t(
      "The sound produced in the receiving-telephone is a function which is affected by at least three variables—namely, the character of the disturbing rays or of their source, the character of the variation in the path of those rays, the character of the sensitive body.",
    ),
  ),
  p(
    t(
      "In the apparatus shown in the drawings, when mounted for use as there arranged, the second element is all that varies, and the others remain constant. In one form which I have mentioned—that in which the source of rays is a manometric flame—the variation is in the source itself, the path of the rays remaining unchanged; but it is obvious that when one element is removed and replaced by a different one—e. g., when one sensitive body is replaced by another, one source of radiant energy by another, one partially-intercepting body by another, the other elements remaining the same—this change will produce a corresponding change in the audible results and can be detected by the sense of hearing.",
    ),
  ),
] as const;
export const bellPhotophoneArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "924fc983c2b53e84e122b7fb84014b5d37cf2461eae4132ea235211364f25e85",
  preparedBy: "Classic Patents editorial agent (manual facsimile review)",
  preparedAt: "2026-08-21",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE.",
        "ALEXANDER G. BELL, OF WASHINGTON, DISTRICT OF COLUMBIA, ASSIGNOR TO AMERICAN BELL TELEPHONE COMPANY, OF BOSTON, MASS.",
        "APPARATUS FOR SIGNALING AND COMMUNICATING, CALLED “PHOTOPHONE.”",
        "SPECIFICATION forming part of Letters Patent No. 235,199, dated December 7, 1880.",
        "Application filed August 28, 1880. (No model.)",
        "To all whom it may concern:",
      ],
    },
    ...SOURCE_PARAGRAPHS,
    { kind: "heading", level: 3, text: "CLAIMS" },
    {
      kind: "claim",
      number: 1,
      inlines: [
        t(
          "1. The herein-described method of signaling or communicating, which consists in controlling a beam of rays, as to its amount or active strength in accordance with the signals to be given, and receiving the said rays on a sensitive substance forming a part of an electric circuit and affected as to its resistance in accordance with the amount or strength of the beam received upon it, whereby electric apparatus in the said circuit may be controlled to give signals corresponding to the controlling influence imparted to the beam.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 2,
      inlines: [
        t(
          "2. That improvement in the art or method of transmitting or reproducing sound which consists in giving a beam of rays an undulating or intermittent character in accordance with the sound-waves it is desired to produce, and providing a receiving apparatus adapted, when acted upon by the said rays, to produce air-vibrations or sound-waves corresponding to the undulations or variations in the said beam, substantially as described.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 3,
      inlines: [
        t(
          "3. The herein-described method of transmitting articulate and other sound by causing, in the rays proceeding from a photophonic transmitting-instrument to a photophonic receiver, undulatory variations in radiant energy similar in form to the sound-waves accompanying said articulate and other sounds.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 4,
      inlines: [
        t(
          "4. The herein-described method of producing sounds of any desired pitch, amplitude, and quality by exposing a body sensitive to radiant energy to rays whose effective energy, exercised upon said sensitive body, is caused to vary in accordance with the vibrational form of the sound-waves appropriate to the sound to be produced.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 5,
      inlines: [
        t(
          "5. The herein-described method of transmitting articulate and other sounds by causing the sound-waves which constitute said sounds to produce similar variations in the beam of rays proceeding from a photophonic transmitter to a photophonic receiver.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 6,
      inlines: [
        t(
          "6. In an apparatus for communicating signals, a beam-controlling apparatus to impart a varying character to a beam of rays (from a radiant body) and a receiving apparatus sensitive to the said beam and operated thereby, to give signals corresponding to the variations in the said beam imparted by the controlling apparatus.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 7,
      inlines: [
        t(
          "7. The herein-described apparatus for transmitting articulate and other sounds by causing, in rays proceeding from a photophonic transmitter to a photophonic receiver, undulatory variations in radiant energy similar in form to the sound-waves accompanying said articulate and other sounds.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 8,
      inlines: [
        t(
          "8. In combination with a photophonic receiver, a photophonic transmitter, the source of radiant energy of which is varied or controlled substantially as described.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 9,
      inlines: [
        t(
          "9. In an apparatus for producing or reproducing sound at a distant station by means of variations in radiant energy, means, as described, for varying the amount of such energy which reaches the distant station by motion imparted to the transmitting apparatus.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 10,
      inlines: [
        t(
          "10. A photophonic receiver adapted to produce, by the action of a beam of varying character from a radiant source, dynamic or electric effects corresponding with said character, substantially as described.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 11,
      inlines: [
        t(
          "11. In an apparatus for sound-transmission, a device for controlling the beam during its passage from its source, in contradistinction to controlling the source itself, said device being actuated by the waves which constitute said sound to give the beam an undulatory character or variations in effective strength similar in form to the said sound-waves, substantially as described.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 12,
      inlines: [
        t(
          "12. In a photophonic transmitter, the combination of a movable and an immovable portion to control the amount of radiant energy passing from it, substantially as described.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 13,
      inlines: [
        t(
          "13. The combination, with the movable part of a photophonic transmitter, of mechanism operating electrically for giving motion to said part, substantially as described.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 14,
      inlines: [
        t(
          "14. The method of producing a beam of varying character for photophonic transmission by controlling the amount of radiant energy which is allowed to pass in the desired direction from a constant source.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 15,
      inlines: [
        t(
          "15. A beam-controlling device comprising a vibratory medium and means, as indicated, for varying the amount of radiant energy which is allowed to proceed from a constant source in a given direction in accordance with the vibrations of said medium, substantially as described.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 16,
      inlines: [
        t(
          "16. The combination, with a transmitting apparatus to give a beam from a radiant body an undulatory character or variations in effective strength, of a receiving apparatus sensitive to the said beam and having the property of emitting sound under the influence and corresponding to the character of the said beam, substantially as described.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 17,
      inlines: [
        t(
          "17. In an apparatus for sound-transmission, a transmitting apparatus to control a beam from a radiant body, and a receiving apparatus containing, as a portion of an electric circuit, a device the electrical condition of which is varied in accordance with the strength or character of the beam affecting it, and telephonic instruments in circuit therewith, substantially as described.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 18,
      inlines: [
        t(
          "18. In an instrument containing selenium as a portion of an electric circuit, two or more strips of conducting material separated by insulating material, arranged to leave a portion of the space between the said strips unoccupied thereby, and selenium placed in the said unoccupied space to complete an electric circuit between the said conducting-strips, substantially as and for the purpose described.",
        ),
      ],
    },
    p(
      t(
        "In testimony whereof I have signed my name to this specification in the presence of two subscribing witnesses.",
      ),
    ),
    p(t("ALEXANDER GRAHAM BELL.")),
    p(t("Witnesses: JOS. P. LIVERMORE, ARTHUR REYNOLDS.")),
  ],
};
export const bellPhotophoneEdition = bellPhotophoneArchivalEdition;

/**
 * Hand-authored, block-indexed companions for the continuous source reading.
 * Each entry explains the engineering or legal function of that exact block;
 * the archival wording remains exclusively in the edition blocks above.
 */
export const BELL_PHOTOPHONE_PARALLEL_READINGS: Readonly<Record<number, readonly string[]>> = {
  1: [
    "Bell identifies the Washington inventor, the Photophone title, and the specification that follows the drawings.",
  ],
  2: [
    "The broad teaching is radiant energy used deliberately to produce either audible signals or electrical signals.",
  ],
  3: [
    "Bell distinguishes visible heat and color from a subtler radiation-induced state of strain in sensitive bodies, which his invention makes observable.",
  ],
  4: [
    "The sensitive response is fast enough to follow acoustic variation; its magnitude tracks radiant energy, so the response curve preserves period, direction, amplitude, and waveform.",
  ],
  5: [
    "A transmitter impresses a chosen variation on the beam, while the receiver turns corresponding strain changes into air motion whose pitch, loudness, and quality follow the modulation.",
  ],
  6: [
    "Radiant energy can be varied at its source, blocked or attenuated in transit, focused or diverted, or alternately exposed at the sensitive body.",
  ],
  7: [
    "In Bell's apparatus, motion of the transmitter's working part is the actuator that creates those controlled changes in the rays.",
  ],
  8: [
    "Motion frequency sets pitch, amplitude sets loudness, and motion form sets quality; a voice-driven diaphragm therefore reproduces the same sound character at the receiver.",
  ],
  9: [
    "The receiver combines beam-directing optics, a radiation-sensitive body, and, when needed, an acoustic or electrical output stage.",
  ],
  10: [
    "Radiation changes selenium conductivity or resistance, allowing a battery circuit and telephone receiver to convert the beam variation into corresponding sound.",
  ],
  11: [
    "Thin hard rubber can respond directly to rapidly interrupted concentrated sunlight, producing an audible tone whose pitch equals the interruption frequency.",
  ],
  12: [
    "Bell reports direct acoustic response from hard rubber and many metal, mineral, wood, and glass diaphragms formed like ordinary telephone plates.",
  ],
  13: [
    "A converging beam focused inside a narrow rubber, brass, or wooden tube excites the tube as a resonator when interruption frequency matches its natural pitch.",
  ],
  14: [
    "Bell now moves from the general principle to concrete transmitter and receiver constructions.",
  ],
  15: [
    "The named transmitter controls radiant amount; the named receiver senses the resulting change acoustically or electrically, with optics arranging the beam path.",
  ],
  16: [
    "Bell separates beam action from the electrical implementation: the beam controller becomes a variable-resistance telephone transmitter, and a telephone receives its undulations.",
  ],
  17: [
    "Long-distance transmission needs a nearly parallel pencil to limit spreading, with concentration at the control point and again at the small sensitive surface.",
  ],
  18: [
    "Ordinary lenses and reflectors provide the required refraction, reflection, and routing of the radiant pencil.",
  ],
  19: [
    "A reflector can steer the beam by changing the inclination of all or part of its surface, making it an efficient motion-operated transmitter.",
  ],
  20: [
    "Figure 1 lays out a complete musical-note transmitter and receiver; Figure 2 isolates its rotating interrupter.",
  ],
  21: [
    "A heliostat mirror and achromatic, aplanatic lens direct and focus sunlight at point 2 without chromatic or spherical dispersion.",
  ],
  22: [
    "An alum solution in a glass cell can absorb obscure heat rays while passing light, protecting selenium apparatus from solar heating.",
  ],
  23: [
    "At focus 2 a rotating disk with holes 3 alternately admits and blocks the beam, using the focal pencil as a clean optical gate.",
  ],
  24: [
    "The holes produce an intermittent beam; a second lens recollimates it onto hard-rubber diaphragm f, whose sound pitch follows interruption rate and whose tube h carries sound to the ear.",
  ],
  25: [
    "A large condenser lens i restores concentration at diaphragm f, compensating for beam spreading over distance.",
  ],
  26: [
    "The illustrated receiver and transmitter are interchangeable with other forms, so the arrangement is a family of compatible optical and sensing modules.",
  ],
  27: [
    "Disk speed controls interruption frequency and pitch; Bell contrasts this one-way wheel with later screens driven in to-and-fro vibration.",
  ],
  28: [
    "Figure 4's fixed and sliding gratings overlap opaque strips and slits so their relative position sets the open beam area.",
  ],
  29: [
    "A tiny upward or downward grating displacement changes the slit opening linearly, even doubling it after only half a slit-width of travel.",
  ],
  30: [
    "The gratings may be physical slits or scraped openings in an opaque-coated glass plate, which Bell finds convenient.",
  ],
  31: [
    "Polishing the opaque regions lets the paired gratings modulate reflected energy; maximum reflection occurs when polished and open regions oppose.",
  ],
  32: [
    "With polished portions aligned behind one another reflection falls away; two movable gratings may be driven oppositely by one impulse.",
  ],
  33: [
    "Figures 5 through 7 use pivoted opaque slats: a rod moves them together, alternate linkage can incline them oppositely, and the opening ranges from half-open to fully blocked.",
  ],
  34: [
    "Open slats present only their thin edges, passing more light than the half-beam grating; moving the rod nearer pivots increases angular travel.",
  ],
  35: [
    "Complete interruption is unnecessary for speech: any periodic slat motion changes beam strength, and the receiver inherits its period and amplitude as pitch and loudness.",
  ],
  36: [
    "A tuned reed, electromagnet, automatic breaker, variable-current device, or organ reed can drive the screen; received tone follows reed frequency and excursion.",
  ],
  37: [
    "Figure 8 extends the system from a tone to articulate speech by using a voice-actuated beam controller.",
  ],
  38: [
    "Earlier transmitters set pitch and loudness, but complex speech also requires preserving the waveform or quality of the sound.",
  ],
  39: [
    "Speech requires the beam variation to track the complex vibrational form, not merely its average frequency or amplitude.",
  ],
  40: [
    "In Figure 8 a voice diaphragm moves grating kl; its changing slit area gives the beam the same undulatory form as the speech wave.",
  ],
  41: [
    "The diaphragm could be driven indirectly by a speaking telephone or any mechanism that reproduces the desired acoustic motion.",
  ],
  42: [
    "Because voice motion is small, Bell notes that the screen need not move far: the slat or grating geometry amplifies optical effect from limited diaphragm travel.",
  ],
  43: [
    "A candle and lens provide an artificial parallel beam in Figure 8, while gratings kl modulate it without depending on sunlight.",
  ],
  44: [
    "Figure 9 replaces sliding gratings with two plates and a small overlapping aperture at focus 2, using relative motion to vary transmitted area.",
  ],
  45: [
    "A guided plate moving along the beam axis progressively intercepts the focused pencil, providing another way to control radiant amount.",
  ],
  46: [
    "The Figure 8 receiver exploits selenium's rapid, substantial, nearly proportional conductivity increase under solar or similar rays.",
  ],
  47: [
    "Selenium S sits in a battery-driven circuit; beam-induced conductivity changes vary current through telephone T, reproducing the spoken words.",
  ],
  48: [
    "Bell points to a separate application for selenium preparation and mounting rather than repeating that manufacturing disclosure here.",
  ],
  49: [
    "Because selenium remains high-resistance, the useful cell geometry makes its active path short and its exposed conducting area large.",
  ],
  50: [
    "The generic cell stacks conducting plates separated by thin insulation, leaving a narrow channel that selenium fills as the electrical bridge.",
  ],
  51: [
    "This plate-and-insulator construction exposes much selenium area while keeping the current path short; mica, porcelain-forming paint, and parallel branches are alternatives.",
  ],
  52: [
    "The selenium-controlled circuit can drive an ordinary telephone or any current-sensitive instrument, so beam modulation becomes electrical speech.",
  ],
  53: [
    "Figure 10 introduces a second speech transmitter in which voice moves a reflecting surface rather than a slit grating; that reflector's voice-driven motion imposes the same alternating radiant-energy variation on the receiver's sensitive body.",
  ],
  54: [
    "A lens and heat screen feed a plane reflector; optional collimation and a second mirror then concentrate the directed beam on the receiver, with ray path set by reflector angle.",
  ],
  55: [
    "A minute reflector-angle change diverts some rays away and brings others onto the receiver; the silvered diaphragm therefore converts voice motion into beam-energy variation.",
  ],
  56: [
    "The reflector reproduces each voice variation's size, direction, period, and waveform, so the selenium receiver and telephone reproduce articulate speech.",
  ],
  57: [
    "Bell reports speech with a thirty-inch silvered-glass reflector and clearer articulation with a thin, roughly two-inch silvered microscope-cover glass.",
  ],
  58: [
    "The mouthpiece must hold reflector r in a repeatable neutral position so the reflected rays remain aimed at the distant receiver.",
  ],
  59: [
    "A transit-style universal mount and graduated limb allow aiming over different angles while preserving controlled reflector movement.",
  ],
  60: [
    "A flexible tube can carry the sound passage while allowing mirror r to occupy the selected angular position.",
  ],
  61: [
    "Bell expressly leaves this particular transmitter unclaimed because it is a joint invention with Sumner Tainter for a separate application.",
  ],
  62: ["A small attached telescope provides a finder for aiming the optical transmitter."],
  63: [
    "The beam enters parabolic mirror s', which concentrates it on selenium cell S' at the focus; tube t supports and electrically connects the cell.",
  ],
  64: [
    "Finder v or sighting through tube t aligns the parabolic collector's optical axis with the incoming beam. The Figure 11-13 Siemens-spiral cell uses brass ribbons separated by narrower insulation, then coils and fills the channels with melted selenium.",
  ],
  65: [
    "The spiral's second insulating strip prevents adjacent turns from shorting, while molten selenium bridges the two metal ribbons along their exposed channels.",
  ],
  66: [
    "Mica, enamel, or Japan varnish can insulate the ribbons; added metal on their edges forms the projecting surfaces or channels that retain selenium.",
  ],
  67: [
    "Figures 14 and 15 use alternating conducting and insulating strips with offset insulation, so selenium links each b-strip to only one neighboring a-strip and rods collect each terminal.",
  ],
  68: [
    "The Figures 16-17 cell places a perforated disk inside an insulated metal box; pins and annular melted-selenium gaps bridge the two conductors, while Tainter receives credit for the specific cell.",
  ],
  69: [
    "The larger cylindrical cell S' uses alternating disks and selenium rings, a geometry suited to parabolic concentration; Bell and Tainter reserve it for a joint application.",
  ],
  70: [
    "Alternating metal disks and smaller insulating disks leave annular selenium channels; staggered hole diameters let mandrel cylinders connect alternate disk sets without touching the other set.",
  ],
  71: [
    "Small-hole lines select one disk set for cylinders f⁵ and the other for g⁵, leaving selenium rings as the resistive bridge between the two terminals.",
  ],
  72: [
    "Tubular cylinders with longitudinal slots improve contact, while insulating washers in the larger holes keep each cylinder isolated from the wrong plates. Poured type-metal flows through the slots to bond the selected plates; washers block contact with plates containing the larger neighboring holes, as Figures 22 and 23 show.",
  ],
  73: [
    "Small metal washers or rings can confine the molten connector without touching the disks, replacing the insulating washers while preserving isolation.",
  ],
  74: [
    "Metal filings or spelter can replace poured metal and make the cell easier to disassemble; end nuts hold the tube assembly together.",
  ],
  75: [
    "Heating melts selenium into the cell, and filing excess selenium off disk or strip edges leaves only the intended inter-electrode paths.",
  ],
  76: [
    "After finishing the active surface, remove a conductive mandrel and attach handle or tube t to an end plate for mounting.",
  ],
  77: [
    "An alum cell in the optical path demonstrates operation using luminous rays after obscure heat has been removed.",
  ],
  78: [
    "Hard rubber can replace alum, alone or together with it; Bell therefore declines to restrict operation to one spectral portion of sunlight.",
  ],
  79: [
    "The name Photophone reflects effective light rays: filtering out luminous rays with iodine in carbon disulfide stops the apparatus.",
  ],
  80: [
    "Gaslight, petroleum lamps, candlelight, and lime-light also work, and an adjustable artificial source is steadier than sunlight through night and weather.",
  ],
  81: [
    "Prepared selenium represents sensitive bodies whose resistance changes in a constant-current circuit; hard rubber represents bodies whose radiation change is directly audible, so Bell distinguishes the electrical-resistance and directly-audible receiver families.",
  ],
  82: [
    "The specification covers receivers that vary circuit resistance and others that vary the circuit's electromotive force.",
  ],
  83: [
    "A thermopile can vary current through its radiation-induced electromotive force, but tonal reproduction demands response faster than ordinary thermopiles provide.",
  ],
  84: [
    "Thin-film metal junctions and illuminated selenium can generate signal currents, but both require unusually rapid and sensitive response.",
  ],
  85: [
    "Rapidly absorbing and cooling fine strained wires can display variations in a heat-ray beam, extending the receiver principle beyond selenium.",
  ],
  86: [
    "Instead of changing the beam in transit, a manometric flame can vary the source itself; voice can drive that flame mechanism.",
  ],
  87: [
    "A vibrating grating can meter burner gas just as it meters light, making flame brightness follow the actuating sound.",
  ],
  88: [
    "Reflectors and other directing instruments allow a non-straight optical route between transmitter and receiver.",
  ],
  89: [
    "Transmitter and sensitive body may be near or separated by any effective ray distance, with arrangement chosen for the intended use.",
  ],
  90: [
    "An electrically driven transmitter may use a current circuit of any suitable length and familiar electrician's arrangement.",
  ],
  91: [
    "A selenium receiver's circuit may be extended or coupled by induction coils to another circuit, using variable-resistance telephone practice; this remains within the established vocabulary of variable-resistance electric speaking telephones.",
  ],
  92: [
    "Because light has no inertia and travels rigidly, tiny reflector motion can appear as light, sound, or a battery-powered secondary-circuit current change.",
  ],
  93: [
    "Received sound depends on at least the ray or source character, the way the path is varied, and the sensitive body's own character.",
  ],
  94: [
    "In the illustrated setup the path-changing element varies while source and sensitive body stay fixed; swapping any one element changes the audible result.",
  ],
  114: [
    "The attestation clause states that Bell signed the specification before two subscribing witnesses.",
  ],
  115: ["Bell's signature is printed as Alexander Graham Bell."],
  116: [
    "The witness block names Jos. P. Livermore and Arthur Reynolds as the two subscribing witnesses.",
  ],
} as const;
export const bellPhotophoneParallelReadings = BELL_PHOTOPHONE_PARALLEL_READINGS;

export function manualPhotophoneClaimText(claimNumber: number): string {
  const claim = bellPhotophoneArchivalEdition.blocks.find(
    (block) => block.kind === "claim" && block.number === claimNumber,
  );
  if (claim?.kind !== "claim")
    throw new Error(`Bell Photophone archival edition is missing Claim ${claimNumber}`);
  return claim.inlines
    .map((inline) => inline.text)
    .join("")
    .trim();
}
