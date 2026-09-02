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
type FigureNumber = 1 | 2 | 3 | 4 | 5 | 6;

const figurePreview = (number: FigureNumber, width: number, height: number) => ({
  src: `/patents/figures/us-3858581-kamen-medication-injection-device/fig-${number}-source-crop-v2.png`,
  alt: `Source-facsimile crop of FIG. ${number} from US 3,858,581.`,
  width,
  height,
});

const FIGURES = {
  1: figurePreview(1, 8700, 3400),
  2: figurePreview(2, 9000, 3250),
  3: figurePreview(3, 8700, 4200),
  4: figurePreview(4, 4000, 4200),
  5: figurePreview(5, 4300, 3200),
  6: figurePreview(6, 8500, 7300),
} as const;

const figure = (
  number: FigureNumber,
  sourceText: string = `FIG. ${number}`,
): CuratedSpecificationInline => ({
  kind: "reference",
  text: sourceText,
  href: "#",
  referenceType: "figure",
  label: `Open the source-facsimile crop for FIG. ${number} in US 3,858,581`,
  figurePreviews: [FIGURES[number]],
});

const figureGroup = (
  sourceText: string,
  numbers: readonly FigureNumber[],
): CuratedSpecificationInline => ({
  kind: "reference",
  text: sourceText,
  href: "#",
  referenceType: "figure",
  label: `Open the source-facsimile crops for ${sourceText} in US 3,858,581`,
  figurePreviews: numbers.map((number) => FIGURES[number]),
});

/** A continuous manual edition checked against the eight-page US 3,858,581 facsimile. */
export const kamenMedicationInjectionArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "1aa0df879ec119a9ad4025774e482dfc41e748127bc3f83cde31047daeedc35d",
  preparedBy: "Classic Patents editorial agent (GPT-5.6)",
  preparedAt: "2026-09-02",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "United States Patent [19]",
        "[11] 3,858,581",
        "Kamen [45] Jan. 7, 1975",
        "[54] MEDICATION INJECTION DEVICE",
        "[76] Inventor: Dean Kamen, 99 Bulsar Rd., Rockville Centre, N.Y. 11570",
        "[22] Filed: July 2, 1973",
        "[21] Appl. No.: 375,955",
        "[52] U.S. Cl. 128/218 A, 128/DIG. 1",
        "[51] Int. Cl. A61m 5/20",
        "[58] Field of Search 128/2 R, 2.05 R, 218 R, 128/218 A, 214 E, 214 F, DIG. 1, 234, 236",
        "[56] References Cited",
        "Primary Examiner—Dalton L. Truluck",
        "Attorney, Agent, or Firm—Bauer & Amer",
        "[57] ABSTRACT",
      ],
    },
    paragraph(
      words(
        "A medication-administering device controlled for repetitive delivery, by intravenous injection or otherwise, of predetermined syringe volumes of said medication at present time intervals, wherein the syringe plunger medication injection stroke is achieved using a powering motor, and the control exercised over the mode of operation of the device is related to the rotational traverses of said motor. This minimizes non-uniform performance and other shortcomings which characterize prior art medication injection devices in which the performance of the powering motors are vulnerable to variances due to varying line voltage, changing work loads (i.e. medication with different viscosities) and the like.",
      ),
    ),
    paragraph(words("5 Claims, 6 Drawing Figures")),
    {
      kind: "figure-sheet",
      figureLabel: "SHEET 1 OF 2",
      description: [
        { kind: "text", text: "PATENTED JAN 7 1975 3,858,581 " },
        figure(1, "FIG.1"),
        { kind: "text", text: ", " },
        figure(2, "FIG.2"),
        { kind: "text", text: ", " },
        figure(3, "FIG.3"),
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "SHEET 2 OF 2",
      description: [
        { kind: "text", text: "PATENTED JAN 7 1975 3,858,581 " },
        figure(4, "FIG.4"),
        { kind: "text", text: ", " },
        figure(5, "FIG.5"),
        { kind: "text", text: ", " },
        figure(6, "FIG.6"),
      ],
    },
    { kind: "heading", level: 2, text: "MEDICATION INJECTION DEVICE" },
    paragraph(
      words(
        "The present invention relates to improvements in a medication injection device, and more particularly to an automatic medication-injecting or administering device readily capable of dispensing medication in accordance with any selected schedule of successive intervals of operation and non-operation of a syringe-driving or powering motor.",
      ),
    ),
    paragraph(
      words(
        "Motor driven syringes for medication injection service are already known, being described and illustrated in U.S. Pat. Nos. 3,456,649 and 3,623,474, as well as in other patents. None of these prior art devices are readily capable of repetitive deliveries of selected volumes of medication, i.e., of delivering 2 cc's of a medication every 2 hours for an 8-hour period, thereby performing four such deliveries, or otherwise operating on a schedule requiring repetition. Instead, each such prior art device is limited in service to a one-time delivery of a selected volume of medication, during which a motor merely drives the syringe plunger entirely through a selected linear displacement causing exiting flow of the medication from the syringe barrel.",
      ),
    ),
    paragraph(
      words(
        "Moreover, any attempt to achieve repetitive performance from any of the aforesaid prior art devices would be extremely difficult because of the limited controls that they can accommodate. In the syringe device of U.S. Pat. No. 3,456,649, for example, the mechanical components partake of linear movement during its operation and thus, to achieve repetitive service, there would be required limit switches or the like, adjustable in position along the path of said linear movement, to start and stop operation of the device as a function of engagement or physical contact that is established with these limit switches. This concept of control is expensive and complicated, and also vulnerable to malfunction in the event of failure to establish operating contact between a moving part and a control switch. This, in turn, could result in the delivery or administration of an overdose of medication, thereby endangering the patient's health.",
      ),
    ),
    paragraph(
      words(
        "Broadly, it is an object of the present invention to provide an improved medication injection device overcoming the foregoing and other shortcomings of the prior art. Specifically, it is an object to provide a motor driven syringe for medication injection or other delivery to a patient which is readily capable of repetitive service, is characterized by uniform performance in each said repeated cycle, and has a high degree of reliability in achieving these performance requirements.",
      ),
    ),
    paragraph([
      {
        kind: "text",
        text: "A medication injection device demonstrating objects and advantages of the present invention includes a motor operated in rotation and operatively arranged to cause linear displacement, and thus a medication-injection stroke, in a syringe plunger, a pulse generating means effective to emit a pulse each ",
      },
      term(
        "rotational traverse",
        "The source uses this period phrase for one turn of the powered mechanical motion. Here it identifies a repeatable mechanical event, not a safe dose, duration, or patient-specific operating instruction.",
      ),
      {
        kind: "text",
        text: " of the motor during which said syringe plunger partakes of a known, uniform movement in its said stroke, and a ",
      },
      term(
        "pulse-counting means",
        "The historical claim language names circuitry that receives the described rotation-linked electrical pulses and controls motor operation. It does not establish a modern medical-device safety or clinical-control specification.",
      ),
      {
        kind: "text",
        text: " electrically connected to receive the transmission of each aforesaid pulse and operatively connected to cause the commencement of the operation of said syringe-driving motor and the continued operation thereof for the duration of the transmission thereto of a selected number of said pulses, whereby medication-dispensing service of said device is controlled as a function of the number of rotational traverses of said motor as counted by said pulse-counting means.",
      },
    ]),
    paragraph(
      words(
        "The above brief description, as well as further objects, features and advantages of the present invention, will be more fully appreciated by reference to the following detailed description of a presently preferred, but nonetheless illustrative embodiment in accordance with the present invention, when taken in conjunction with the accompanying drawings, wherein:",
      ),
    ),
    paragraph([
      figure(1),
      { kind: "text", text: " is a perspective view of a medication injection device according to the present invention; " },
      figure(2),
      {
        kind: "text",
        text: " is a plan view of the device illustrating further structural features thereof, and also illustrating how the volume of the medication to be dispensed is related to an operating parameter of the device, namely electrical pulses emitted during its operation; ",
      },
      figure(3),
      { kind: "text", text: " is a side elevational view, taken in longitudinal section, illustrating internal structural features; " },
      figure(4),
      {
        kind: "text",
        text: " is an end elevational view, in section taken on line 4—4 of FIG. 3, illustrating structural features of a pulse generator used in the device hereof; ",
      },
      figure(5),
      {
        kind: "text",
        text: " is a partial plan view, in section taken on line 5—5 of FIG. 3, illustrating further structural features; and ",
      },
      figure(6),
      {
        kind: "text",
        text: " is a block diagram illustrating the electrical components used in controlling the operation of the mechanical components of the device hereof.",
      },
    ]),
    paragraph([
      { kind: "text", text: "Reference is now made to the drawings, and in particular to " },
      figureGroup("FIGS. 1-3", [1, 2, 3]),
      {
        kind: "text",
        text: ", which show the general organization of the mechanical parts of a medication injection device, generally designated 10, demonstrating objects and advantages of the present invention. As the name implies, the contemplated use of the device 10 is to achieve the intravenous injection of selected volumes of medication, dispensed from a syringe 12, according to a selected schedule. That is, there are many drugs which cannot be administered to a patient slowly and uniformly over a prolonged period, but rather must be administered within a prescribed comparatively short period, followed by a longer period, when it is not administered and the patient's body has an opportunity to react to the administered drug. For example, there are certain blood anti-coagulants that are best administered frequently, but at intermittent intervals, in order to produce the desired effect on the blood. Device 10 can be most advantageously used for this purpose.",
      },
    ]),
    paragraph(
      words(
        "As will be described in detail herein, any selected volume of medication can be dispensed from the syringe 12 through tubing 15 having at its end, although not shown, a syringe needle or other implement connected for intravenous delivery of the medication into the patient. Moreover, as just noted, the time interval, during which a selected volume of the drug or medication, such as 1 cubic centimeter or “cc”, is to be delivered can be relatively short, e.g., in less than 1 minute, and the next administration of this same volume of medication can be arranged to occur in 2 hours, or after other such interval of time. Thus, assuming that syringe 12 is filled with 6 cc's of medication which has to be delivered 1 cc at a time every 2 hours, this is readily easy to achieve by proper setting of the controls of the device 10. Naturally, the values selected in the previous example can be modified, and the invention is in no way intended to be limited thereto, since it can be just as easily arranged that 2 cc's of medication be administered every 6 hours, et cetera. The significance of the mode of operation of device 10 is that it is operational or effective to dispense medication in accordance with a selected schedule of successive intervals of operation and non-operation.",
      ),
    ),
    paragraph([
      {
        kind: "text",
        text: "In the preferred form of device 10 as illustrated in ",
      },
      figureGroup("FIGS. 1-5", [1, 2, 3, 4, 5]),
      {
        kind: "text",
        text: ", the same includes, as previously noted, a syringe 12 of the type having a plunger 14, the linear displacement of which dictates the amount of medication which is dispensed from the syringe chamber 12 through the tubing 15 to the patient. Arranged to cause linear displacement of the plunger 14 is an upstanding head 16 of a follower, generally designated 18, which, as best shown in ",
      },
      figure(3),
      {
        kind: "text",
        text: ", has a threaded member which is mounted, as at 20, on a lead screw 22 which is powered in rotation by a motor 24. That is, the motor 24 is operatively connected to power the lead screw 22 in rotation, said lead screw having threads 26 of of ",
      },
      term(
        "uniform pitch",
        "The historical phrase means that adjacent screw threads advance the follower by the same distance per turn. The source prints no numerical pitch, pressure limit, calibrated flow, or medically safe setting.",
      ),
      {
        kind: "text",
        text: " machined along its length and further being disposed substantially parallel to the path of linear displacement of the plunger 14, in this instance being arranged below plunger 14 so that the pushing head 16 is readily adapted to be mounted on an upstanding rod 28 projected through a slot 30 in the top plate 32 of the device housing 34. An elastomeric closure 36 with a central slit 38 is appropriately mounted across the slot 30 to prevent dust or other contamination of the interior of the housing box 34.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "Completing the construction of the follower 18, and as is well understood to prevent rotation thereof simultaneously with rotation of the lead screw 22, is a body element 40, the forward end of which is prevented from partaking of rotative movement by being projected, as at 42, through a bore or opening in a stationary depending mounting member 44 which also assists in supporting the previously noted motor 24. In operation, lead screw 22 is driven in rotation and the threaded member 20 in meshing engagement therewith is therefore advanced along the length of the lead screw 22. Naturally, in one direction of rotation of lead screw 22, member 20 is advanced toward the motor 24, and in the opposite direction away from the motor 24. Head 16 has movements corresponding to the member 20, and one said direction of movement causes it, because of its pushing engagement as at 46 with the end of the plunger 14, to cause linear displacement of this plunger within the syringe barrel 12 which, in an obvious manner, results in the dispensing of medication in accordance with said linear displacement from the internal chamber of the syringe 12. To hold the syringe 12 against displacement while the plunger thereof is being operated by the follower head 16, a laterally extending lip 48, which normally functions as a finger grip, has a portion disposed in a holding recess 50 of a mounting plate 52 appropriately secured in place on the top plate 32. An L-shaped rod 54 functions as a clamp to hold the syringe barrel against the mounting plate 52 and, in turn, is held in place by a lock screw 56 which, upon threaded adjustment, engages the flattened surface 58 of the clamp 54.",
      },
    ]),
    paragraph(
      words(
        "Although the lead screw and follower drive arrangement has been used heretofore in producing linear displacement of a syringe plunger in automatic medication injection devices, in the device 10 hereof, the manner in which control is exercised over the operation of the lead screw and follower 22, 28, respectively, is unique and is not known in the prior art nor is it suggested therein. Specifically, this control consists of using the rotational traverses of the lead screw 22 as the measure of the duration that the powering motor 24 is operational. As a consequence, serious prior art shortcomings are overcome. For example, if the powering motor in a prior art device is permitted to operate for a selected interval of time, this still would result in non-uniform volumes of medication being dispensed since, during the selected interval of time of motor operation, there could be variations in the line voltage utilized to energize the motor 24. Also, the work load on the powering motor could be variable and this also would result in non-uniform volumes of medication being dispensed. Within any specified time interval, a prior art motor will cause the delivery of a greater volume of a less viscous medication than one with a greater viscosity, and thus to achieve uniform dispensing of medication with such a prior art device, it is necessary to make an adjustment in the control to account for the different viscosities of the medication being dispensed. Still further, after a prolonged period of use the bearings or other moving parts of a prior art device would experience wear that would in turn effect its operation during an interval of operation, and this variation in frictional resistance would also result in non-uniform volumes of medication being dispensed. In sharp contrast to the foregoing, it is therefore one of the unique aspects of the device 10 hereof that the interval of operation of the powering motor 24 is related to the number of rotational traverses that occur in the lead screw 22, irrespective of the time that it takes to achieve these number of rotational traverses. Naturally, with each rotational traverse of the lead screw 22, member 20 is advanced a uniform amount dictated by the pitch of the uniform threads 26, and this uniform advancement of member 20 also occurs in the pushing head 16 and thus must, of necessity, also result in a uniform linear displacement in the syringe plunger 14.",
      ),
    ),
    paragraph([
      {
        kind: "text",
        text: "At this point in the description, it is appropriate to indicate how the volume of medication to be dispensed during each application is related to the number of rotational traverses of the lead screw 22. As illustrated in ",
      },
      figure(2),
      {
        kind: "text",
        text: ", marked along one edge of the top plate 32, as along edge 60, is a scale, generally designated 62, which is laid out, starting from 0, in ascending numbers such that said numbers are located at distances from the starting point 0 which correspond to the distances of advancement that is produced by the uniform advance or thread pitch 26, that results from that number of rotational traverses in the lead screw 22. Thus, taking into account that with each rotational traverse of the lead screw 22, member 20 will move the pitch of each thread 26 thereon, it follows that the linear distance 64 will be achieved with 10 rotational traverses, and twice that distance with 20 rotational traverses, and so on. Further, assuming that it is desired to dispense 2 cc's of medication during each injection period, as clearly illustrated in ",
      },
      figure(2),
      {
        kind: "text",
        text: ", this will require approximately 27 rotational traverses since, by laying the syringe barrel 12 alongside the scale 62, a 2-cc volume as laid out on the barrel 12 spans the distance from the 0 point on the scale 62 to a point therealong, designated 65, which corresponds to point 27 of the scale.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "Assuming further that it is desired to dispense these 2 cc's of medication every 2 hours, there are two timing controls embodied in the device 10 which are appropriately set to provide the schedule of medication administration indicated. From what has already been described, it should be readily appreciated that medication is administered or delivered to the patient only during operation of the powering motor 24. The motor-on timer, generally designated 66, includes, as best illustrated in ",
      },
      figure(2),
      {
        kind: "text",
        text: ", two control knobs or selectors 68 and 70, each being related to a circumferential display of numbers 72 from 1 to 10. In a manner which will be better understood subsequently, the 2 cc's of medication previously discussed which also, as previously discussed, is dispensed by 27 rotational traverses of the lead screw 22, as thus imposed on the mode of operation of the device 10 by setting the selector 68 at numeral 2 and selector 70 at numeral 7, the combined effect being a selection of 27 as the number of rotational traverses which will occur in the lead screw 22 during each interval of operation of the powering motor 24.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "The other timing device, generally designated 74, is the one which controls or times the ",
      },
      term(
        "motor-off interval",
        "The source's label for the period when the power motor is not operating between the historical device's described cycles. It is not a prescription, a recommended treatment interval, or a clinically validated timer setting.",
      ),
      {
        kind: "text",
        text: ", this timer also including a selector 76 within a circumferential arrangement 78 of numbers from 1 to 10. In the example being used to illustrate the mode of operation of device 10, the interval of non-operation of the powering motor 24 is to be 2 hours between injections of the medication, and thus selector 76 is moved in proper relation to numeral 2 to provide this result. The manner in which this result is achieved will be explained subsequently.",
      },
    ]),
    paragraph([
      { kind: "text", text: "Reference will now be had to " },
      figureGroup("FIGS. 4, 5", [4, 5]),
      { kind: "text", text: ", in conjunction with " },
      figureGroup("FIGS. 1-3", [1, 2, 3]),
      {
        kind: "text",
        text: ", to best explain how the operation of device 10 is controlled in accordance with the rotational traverses of the lead screw 22. Specifically, mounted on the end of the lead screw 22 remote from the powering motor 24 is a radially oriented striker 80 which is driven in rotation simultaneously with the lead screw 22. As illustrated best in ",
      },
      figure(4),
      {
        kind: "text",
        text: ", mounted adjacent the striker 80, and more particularly, in the path of the rotational traverse thereof, is a switch contact arm against which actual physical contact is made by the striker 80 during each rotational traverse. This physical contact or abutment against the switch contact 82 results in actuation of the switch 84. More particularly, it will be understood that switch 84 is part of a pulse-generating circuit in that the actuation thereof is effective to complete this circuit and, in turn, cause the production and transmission of an electric pulse to a pulse-counting circuit which may be embodied on a printed circuit board 86 (see ",
      },
      figure(3),
      { kind: "text", text: ")." },
    ]),
    paragraph([
      {
        kind: "text",
        text: "As will be explained in greater detail in connection with the circuit diagram of ",
      },
      figure(6),
      {
        kind: "text",
        text: ", the pulse-counting circuit 86 will be understood to be effective in causing the commencement of the operation of the powering motor 24 and in causing the continued operation thereof for the duration of the transmission to it of a selected number of said pulses, which in the example being discussed would amount to 27 pulses. This number of pulses or rotational traverses of the lead screw 22 will result, as already noted, in linear displacement of the syringe plunger 14 which will force out of the syringe barrel 12 2 cc's of medication.",
      },
    ]),
    paragraph(
      words(
        "On the 27th rotational traverse of the lead screw 22, the electrical control components of the device 10 are effective in causing three conditions of operation. The first is the resetting of the motor-on timer 66 at the 0 setting. The second is the termination of the operation of the powering motor 24. The third is the starting of the timing operation of the motor-off timer 74. As in the case of the motor-on timer 66, the timer 74 is also operated by the transmission to it of pulses and, in accordance with the example being discussed, will therefore receive whatever number of pulses generated, not by the rotation of the lead screw 22, but by an oscillator of some other source, but which corresponds to the passage of 2 hours of time, this being the time interval selected for non-operation of the motor 24.",
      ),
    ),
    paragraph([
      {
        kind: "text",
        text: "At the expiration of this 2-hour time interval, the motor 24 will again commence its operation, and at that time striker 80, by virtue of actuating switch 84, will again cause a pulse-generating activity as a function of the rotational traverses of the lead screw 22 being powered in rotation by the motor 24. When 27 pulses are again transmitted or counted by the pulse-counting circuit 26, the operation of motor 24 which results in a medicine-injecting stroke in the syringe plunger 14 is again terminated. Ultimately, the final 2 cc's of medication is dispensed from the syringe barrel 12, thus requiring the refilling thereof. To signal this condition, and as best illustrated in ",
      },
      figure(5),
      {
        kind: "text",
        text: ", the follower body 40 has a laterally extending contact 88 which is arranged to actuate the limit switch 91 by physically abutting against the contact 92 thereof, thus indicating that the end of the medicine-injecting stroke 94 is reached.",
      },
    ]),
    paragraph(
      words(
        "In addition to the timing controls consisting of the motor-on timer 66 and motor-off timer 74, device 10 also includes a control which overrides these timing devices and which results in the injection of medicine, even if not in accordance with the selective schedule. This permits the injection of medicine or medication in emergency situations. The control itself includes an accessible push-button 96 which, when depressed, is electrically effective to immediately start operation of the powering motor 24, even if at that time the device 10 is under the control of the motor-off timer 74. Device 10 also includes an off-on master switch 98.",
      ),
    ),
    paragraph(
      words(
        "Also advantageously included as part of the controls for the device 10 is a visual signal in the form of a blinking light 100. Light 100 is energized by each pulse successively transmitted to the timers 66 and 78, and thus is effective in indicating operation of the device 10 during both motor-on and motor-off intervals.",
      ),
    ),
    paragraph([
      {
        kind: "text",
        text: "Completing the device 10, and as best illustrated in ",
      },
      figure(3),
      {
        kind: "text",
        text: ", is a safety device feature which disconnects the drive between the motor 24 and lead screw 22 in the event of successive buildup of pressure which is transmitted in a reverse direction through the tube 15 into the barrel chamber 12 and against the syringe plunger 14. This buildup of resistance pressure will of course be transmitted against the pushing head 16 and thus is manifested as a force tending to push lead screw 22 in a direction away from the motor 24. In response to this force, a clutch 136 of a shaft coupling 90 will break its driving connection between its driving and driven elements and thus result in discontinuation of the driving connection between the motor 24 and the lead screw 22. Clearance for this slight rearward movement of lead screw 22 is provided by compression of an internal spring 138 as a driving notch 140 in the end of the lead screw 22 moves relative to a driving pin 142. The notch and pin drive 140, 142 will be recognized as providing simultaneous driving rotation of the striker 80 as powering motor 24 drives lead screw 22 in rotation.",
      },
    ]),
    paragraph([
      { kind: "text", text: "Reference is now made to " },
      figure(6),
      {
        kind: "text",
        text: " in which there is illustrated, in diagrammatic form, an exemplary electronic circuit which will be understood to be laid out and otherwise appropriately embodied on the printed circuit board 86. The circuit of ",
      },
      figure(6),
      {
        kind: "text",
        text: " will further be understood to function as the motor-on timer 66 and also as the motor-off timer 74, in both instances providing a timing function which utilizes and appropriately reacts to the transmission to it of an electronic pulse. In effect, this portion of the circuit of ",
      },
      figure(6),
      {
        kind: "text",
        text: ", generally designated 110, provides the pulse-counting service or function for the device 10 in the manner previously described. This function, in turn, could be powered by batteries or by line voltage. That is, the device 10 can be used in strapped position on the arm of the patient, in which instance it will be portable and operated by batteries (not shown). Alternatively, it can be used at bedside, in which instance it would be powered by an ordinary electrical source. Assuming the latter, the power fed into the unit operates an electric oscillator or pulse generator 112. This generator may be any one of several types, being generally a unit which reaches a selected peak voltage on a selected time basis and which emits a pulse. The output or pulse from the generator 112 is fed into the counting circuit 110. This counting circuit also could be any one of several so-called decade counting circuits readily available from major firms such as RCA or the like.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "For present purposes, it is suffice to note that operation of a decade counter, such as that denominated “First Pulse Counter” and designated 114 in ",
      },
      figure(6),
      {
        kind: "text",
        text: ", has 10 or more outputs identified by the numbering from 0 to 10. The operation of the pulse counter 114 contemplates activation of each of these outputs in succession with each cycle of operation, and then a repeat of this cycle of operation. Accordingly, output 0 is first activated, then output 1, then output 2, et cetera. When output 10 is activated, this completes an electrical connection to a second decade counter, designated “Second Pulse Counter” and identified by reference numeral 116, which experiences the same mode of operation just described in connection with counter 114. Meanwhile, the cycle of operation of counter 114 is repeated. In effect, therefore, it takes the completion of the succession of pulses through all of the 10 outputs of the first counter 114 to produce one pulse which is sent via conductor 118 to the succeeding counter 116. In this manner, any number of pulses can be counted, it being understood that any selected number of counters 114, 116 and the like can be electrically connected to each other so as to function as a timing device, the two units 114, 116 being used as the motor-on timer 66 to measure the interval of time during which the powering motor 24 of the injection device 10 is operative. Naturally, a greater number of these units would be used in cooperative relation to provide the motor-off timer 74.",
      },
    ]),
    paragraph(
      words(
        "Continuing with the illustrative example previously referred to, the selection of 27 pulses for the interval of operation of the powering motor 24 is thus achieved by arranging the selector 68 so that the wiper 120 thereof is electrically connected to output 2 of the second pulse counter 116 and that the selector 70, and more particularly the wiper 122 thereof, is electrically connected to the output 7 of the first pulse counter 114. While this may appear to be reversed, such arrangement provides for motor-on operation for an interval of 27 pulses. As already explained, to achieve energization of output 2 of the second pulse counter 116 requires the transmission to this counter of two pulses, each one of which, however, requires the energization or pulsing of all ten outputs of the first pulse counter 114, or in other words 20 pulses. Thus, when the first pulse counter 114 starts on its third successive cycle of counting operation and when output 7 is energized on the seventh transmitted pulse, this results in electrical connection to the two outputs 2 and 7 electrically connected to the selectors 68 and 70. This, in turn, completes a control circuit 124 which results in the transmission of a pulse to a motor-off switch 126 which results in termination of the powering operation of the motor 24. It also results in the transmission of a pulse via a conductor 128 to a starter circuit 131 for the motor-off timer 74 which results in the start in operation of this timer.",
      ),
    ),
    paragraph([
      {
        kind: "text",
        text: "It will of course be understood that the wipers associated with the selectors 68 and 70 could have been rotated to make electrical connection with other outputs other than the specific outputs indicated. This is illustrated in ",
      },
      figure(6),
      {
        kind: "text",
        text: " wherein the range of wiper location is diagrammatically illustrated by the path of wiper movement 130.",
      },
    ]),
    paragraph([
      { kind: "text", text: "It is also illustrated in " },
      figure(6),
      {
        kind: "text",
        text: " that pulse generator 112 also transmits a pulse via conductor 132 to a reset control circuit 134 which is effective to reset to 0 the motor-off timer 74 at the end of each interval of non-operation of motor 24. This may be done in any number of ways. One way, for example, is to have the last pulse of this interval operate a flip-flop switch. Such switch is a standard part readily purchased in the open market from such firms as RCA and the like and operates, as generally noted, such that upon activation by said last pulse, it completes the circuit to the motor and at the same time resets the counting circuit at its original 0 setting. As a result, when the motor operation is terminated, the counting circuit 110 is in condition to start counting from 0 again.",
      },
    ]),
    paragraph(
      words(
        "It should be readily appreciated from the description of the mechanical components of the device 10 that the pulse generator 112 during the interval of operation of the motor 24, is controlled in its pulse-emitting function by the striker 80 which, upon physical contact with the switch 84 during each rotational traverse of the lead screw 22, produces a pulse which is counted by the motor-on timer 66. However, during non-operation of the powering motor 24, the pulse generator 112 is operated as an oscillator and transmits pulses also to a counting circuit, such as 110, which performs the same function during non-operation of the motor as was performed during its operation. Since the time of non-operation of the powering motor 24 is considerably longer than the typical interval required for administration of medication, the pulse-counting circuit 110 will include more than just two pulse counters 114 and 116. But at least the first two counters of an enlarged arrangement thereof can be counters 114, 116 to avoid duplication.",
      ),
    ),
    paragraph(
      words(
        "The primary use of the device 10 is, of course, for administering a predetermined volume of medication on a timed schedule. However, it is not strictly limited to this use, but also may be operated by monitoring equipment separate and apart from the timing devices 66 and 74 described herein. In other words, assume a cardiac patient has monitoring equipment to indicate when he is in medical difficulty. Such monitoring equipment could be used to provide a pulse which starts the motor 24 in operation and which causes the injection of the predetermined volume of medication to counteract the condition sensed by the monitoring equipment as requiring said medication.",
      ),
    ),
    paragraph(
      words(
        "From the foregoing description, it should be readily appreciated that there has been described herein a unique medication injection device 10 which is capable of administering medication in accordance with a selected schedule of successive intervals of operation and non-operation of the powering motor 24. Moreover, these intervals are controlled as a function of each rotational traverse, rather than strictly on a manually timed basis, as is the practice in the prior art. Thus, the device 10 hereof is not vulnerable to variations which affect performance during any selected unit of time, such as variations in voltage, in viscosity of the medication being dispensed, variations in the frictional resistance within the motor itself, to mention just a few, and other such factors which adversely affect and produce non-uniformity in the functioning of devices of the class herein described.",
      ),
    ),
    paragraph(
      words(
        "A latitude of modification, change and substitution is intended in the foregoing disclosure, and in some instances some features of the invention will be employed without a corresponding use of other features. Accordingly, it is appropriate that the appended claims be construed broadly and in a manner consistent with the spirit and scope of the invention herein.",
      ),
    ),
    { kind: "heading", level: 2, text: "What is claimed is:" },
    claim(
      1,
      "A medication injection device comprising a syringe for dispensing medication in accordance with linear displacement of a plunger thereof, means secured to said syringe for connection to a patient for dispensing said medication to said patient, a rotatively mounted lead screw with threads of uniform pitch disposed in substantially parallel relation to the linear displacement path of said syringe plunger, pushing means mounted on said lead screw for advancement therealong in pushing engagement with said syringe plunger, a motor operatively arranged to power said lead screw in rotation to cause advancement of said pushing means and corresponding linear displacement of said syringe plunger, a radially oriented striker mounted on said lead screw, a pulse-emitting switch located adjacent said lead screw in the path of the rotational traverse of said striker so as to be engaged thereby to cause an emission of an electrical pulse during each rotation of said lead screw, and a pulse-counting means electrically connected to receive the transmission of each aforesaid pulse and operatively connected to permit the operation of said motor for the duration of the transmission thereto of a selected number of said pulses, whereby medication is dispensed in accordance with the linear displacement of said syringe plunger as a function of the number of rotational traverses of said lead screw as counted by said pulse-counting means.",
    ),
    claim(
      2,
      "A medication injection device as defined in claim 1 including an additional timing means operatively connected to said motor to cause the commencement of the operation thereof after a selected interval of non-operation, whereby said medication is dispensed by said device in accordance with a selected schedule of successive intervals of operation and non-operation of said motor.",
    ),
    claim(
      3,
      "A medication injection device as defined in claim 2 including a clutch interposed in the drive connection between said motor and said lead screw, and including means mounting said lead screw for selected limited linear movement for disengaging the same from said clutch to thereby terminate the powering rotation of said lead screw by said motor, whereby said dispensing of medication by said device is capable of being terminated in an emergency situation.",
    ),
    claim(
      4,
      "A medication injection device as defined in claim 2 wherein said additional timing means is of the type operated by pulses transmitted to it as is also said pulse-counting means, and further including a visual signaling device connected to be operated by each pulse being transmitted to said additional timing means and to said pulse-counting means, whereby the operation of said visual-signal device is effective in indicating the working condition of said medication injection device.",
    ),
    claim(
      5,
      "A medication injection device as defined in claim 4 including a scale calibrating linear displacement of said syringe plunger with a corresponding number of pulses produced during said rotational operation of said motor, whereby the volume of medication to be dispensed can be readily related to a selected number of pulses as counted by said pulse-counting means.",
    ),
  ],
};

export const kamenMedicationInjectionParallelReadings: Record<number, readonly string[]> = {
  1: [
    "The source abstract defines a motor-driven medication dispenser where delivery volume is governed by rotational traverses rather than variable time, reducing sensitivity to voltage and viscosity changes.",
  ],
  2: [
    "The formal enumeration confirms five granted claims and six accompanying drawing figures detailing the electromechanical assembly and timing circuitry.",
  ],
  6: [
    "The specification opens by stating the primary objective: dispensing medication according to a programmable schedule of operating and idle intervals.",
  ],
  7: [
    "The core mechanical structure couples a lead screw and traveling nut follower directly to the syringe plunger, transforming motor shaft rotations into linear displacement.",
  ],
  8: [
    "A uniform screw thread ensures each complete rotation produces an identical increment of plunger travel, linking kinematic displacement to turn count.",
  ],
  9: [
    "The external scale provides an empirical visual correlation between cumulative rotational pulses and volumetric markings along the syringe barrel.",
  ],
  10: [
    "A rotating striker physically closes a microswitch once per screw rotation, generating discrete electrical pulses fed into decade counter circuits.",
  ],
  11: [
    "Configurable decade counter stages establish programmable delivery volumes and idle interval timers, terminating motor power upon reaching selected pulse counts.",
  ],
  12: [
    "An overload spring clutch disengages the drive train upon excessive downstream backpressure, providing mechanical overpressure relief.",
  ],
};
