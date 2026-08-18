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
const claim = (number: number, value: string) => {
  const inlines =
    number === 1
      ? value
          .split("neutral gas or vapor")
          .flatMap((part, index) =>
            index === 0
              ? [
                  { kind: "text" as const, text: part },
                  term(
                    "neutral gas or vapor",
                    "A gas or vapor that carries heat and dilutes the working charge without supplying the oxygen-and-fuel reaction that produces combustion.",
                  ),
                ]
              : [{ kind: "text" as const, text: part }],
          )
      : text(value);
  return { kind: "claim" as const, number, inlines };
};
const term = (value: string, definition: string): CuratedSpecificationInline => ({
  kind: "term",
  text: value,
  definition,
});
const preview = (figure: number, width: number, height: number) => ({
  src: `/patents/figures/us-542846-diesel-engine/fig-${figure}-source-crop-v1.png`,
  alt: `Source-facsimile crop of Fig. ${figure} from US 542,846.`,
  width,
  height,
});
const figure = (
  number: number,
  sourceText = `Fig. ${number}`,
  additionalPreviews: readonly ReturnType<typeof preview>[] = [],
): CuratedSpecificationInline => ({
  kind: "reference",
  text: sourceText,
  href: "#",
  referenceType: "figure",
  label: `Open the source-facsimile crop for Fig. ${number} in US 542,846`,
  figurePreviews: [
    preview(
      number,
      [600, 430, 520, 650, 400, 500, 850, 780, 800, 850][number - 1] ?? 600,
      [470, 600, 620, 900, 650, 430, 1250, 870, 1250, 620][number - 1] ?? 600,
    ),
    ...additionalPreviews,
  ],
});

/**
 * Continuous, hand-prepared reading of the full ten-page US 542,846
 * facsimile. Its first five pages are drawing sheets; pages 6-10 contain the
 * specification, three claims, signature, and witness names. Page furniture
 * belongs to the ledger and provenance receipt, not this reader.
 */
export const dieselEngineArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "57679379a0e1d1dc97591e6f634fa6f7ed7c0ec3b465edf493b5f79595a0e866",
  preparedBy: "Classic Patents editorial agent (GPT-5.6)",
  preparedAt: "2026-08-18",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE.",
        "RUDOLF DIESEL, OF BERLIN, GERMANY.",
        "METHOD OF AND APPARATUS FOR CONVERTING HEAT INTO WORK.",
        "Specification forming part of Letters Patent No. 542,846, dated July 16, 1895. Application filed August 26, 1892, serial No. 444,246. (No model.) Patented in Germany February 28, 1892, No. 67,207; in Switzerland April 2, 1892, No. 6,321; and in England April 14, 1892, No. 7,241.",
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIGURES 1 TO 3",
      title: "Theoretical cycle diagrams",
      description: [
        figure(1),
        { kind: "text", text: " shows the ordinary gas-engine cycle; " },
        figure(2),
        { kind: "text", text: " and " },
        figure(3),
        { kind: "text", text: " show Diesel's theoretical cycles." },
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIGURES 4 TO 6",
      title: "Single-acting coal-fuel engine and admission valve",
      description: [
        figure(4),
        { kind: "text", text: " is the sectional single-acting engine, " },
        figure(5),
        { kind: "text", text: " its detail, and " },
        figure(6),
        { kind: "text", text: " the admission-plug sections." },
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIGURE 7",
      title: "Modified two-cylinder engine",
      description: [
        figure(7),
        {
          kind: "text",
          text: " shows the two combustion cylinders, central air-pump cylinder, and reservoir.",
        },
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIGURES 8 TO 10",
      title: "Liquid-fuel construction",
      description: [
        figure(8),
        { kind: "text", text: " and " },
        figure(9),
        { kind: "text", text: " are sectional elevations; " },
        figure(10),
        { kind: "text", text: " is the sectional plan and fuel branch-pipe detail." },
      ],
    },
    paragraph([{ kind: "text", text: "To all whom it may concern:" }]),
    paragraph([
      {
        kind: "text",
        text: "Be it known that I, RUDOLF DIESEL, a subject of the King of Bavaria, residing at Berlin, in the Kingdom of Prussia, German Empire, have invented a new and useful Process for Obtaining Motive Power by the Combustion of Fuel of Any Kind, (for which I have obtained Letters Patent in Great Britain, No. 7,241, dated April 14, 1892; in Switzerland, No. 6,321, dated April 2, 1892, and in Germany, No. 67,207, dated February 28, 1892,) of which the following is a specification.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "My invention has reference to improvements in the methods of and apparatus for converting heat into work.",
      },
    ]),
    {
      kind: "paragraph",
      inlines: [
        { kind: "text", text: "In the accompanying drawings, " },
        figure(1, "Figure 1"),
        {
          kind: "text",
          text: " represents the theoretical diagram of a gas-engine of a usual construction. ",
        },
        figure(2),
        { kind: "text", text: " and " },
        figure(3),
        {
          kind: "text",
          text: " are theoretical diagrams of the cycles according to my invention. ",
        },
        figure(4),
        {
          kind: "text",
          text: " is a sectional elevation of a single-acting engine constructed according to my invention. ",
        },
        figure(5),
        { kind: "text", text: " is a sectional detail thereof. " },
        figure(6),
        {
          kind: "text",
          text: " illustrates detail sections of the admission-plugs for the fuel. ",
        },
        figure(7),
        {
          kind: "text",
          text: " is a sectional elevation of a modified form of engine. ",
        },
        figure(8),
        { kind: "text", text: " and " },
        figure(9),
        { kind: "text", text: " are sectional elevations of a second modified form. " },
        figure(10),
        {
          kind: "text",
          text: " is a sectional plan thereof. Similar letters and figures indicate corresponding parts throughout the several views of the drawings.",
        },
      ],
    },
    paragraph([
      {
        kind: "text",
        text: "The cycle of the ordinary internal combustion-engines is illustrated by the theoretical diagram shown in ",
      },
      figure(1),
      {
        kind: "text",
        text: ". The curve 1 2 in said diagram represents the compression of the mixture of air and gaseous fuel. At point 2 the mixture is ignited and by the now ensuing combustion or explosion a sudden increase of pressure is produced, accompanied by a very considerable increase in temperature. The explosion being substantially instantaneous, the stroke of the piston during combustion is approximately zero. At point 3 the combustion is essentially finished. From 3 to 1 an expansion takes place in performing work, accompanied by a decrease in pressure and temperature.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "Heretofore the combustion of the gaseous mixture has been left entirely to itself immediately after ignition, no attempt having been made to regulate or control the pressure and temperature during the combustion with reference to the existing volume of the body of air. From this condition of matters result the following disadvantages: First, the temperature produced by the combustion is so high that it is impossible to obtain a mean temperature which will permit lubrication and the maintenance of the parts in proper condition for practical working without the presence of arrangements for cooling the cylinders; second, the products of combustion are insufficiently cooled by expansion and escape while in a hot condition, with the consequent loss of heat and energy. Particular types of the above-mentioned class of engines also possess the same defects.",
      },
    ]),
    paragraph([
      { kind: "text", text: "In engines where the air is first compressed from 1 to 2, " },
      figure(1),
      {
        kind: "text",
        text: ", and the fuel then injected in the neighborhood of point 2 and the mixture ignited simultaneously with injection, show the increase of pressure 2 3 and a considerable increase of temperature. Again, the same takes place in engines which carry the compression of the gaseous mixture to such a degree that the same is spontaneously ignited by the temperature of compression.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "The points of ignition of most fuels are very low. (Petroleum at from 70° to 100° centigrade.) When by compression this temperature has been reached, (in the case of petroleum at a pressure less than five atmospheres and in the case of gas at about fifteen atmospheres,) the ignition takes place, and by the ensuing combustion the temperature is very considerably raised and the increase of pressure 2 3, ",
      },
      figure(1),
      {
        kind: "text",
        text: ", is produced. The highest temperature of combustion is entirely independent of the burning or igniting points, the same depending on the physical properties of the fuel. Practically, of course, the combustion or explosion requires a short but material time, and for this reason the line 2 3 is not quite vertical, but somewhat inclined, with a rounded transition at 3.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "The characteristic feature of the cycles of all these engines may therefore be expressed as follows: increase of pressure and temperature by and during combustion and the subsequent performance of work by expansion, the process of combustion being left to itself after ignition.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "The method forming my present invention differs from all those previously described, and is illustrated by the theoretical diagram shown in ",
      },
      figure(2),
      {
        kind: "text",
        text: ". Referring to this diagram, pure atmospheric air is compressed, according to curve 1 2, to such a degree that, before ignition or combustion takes place, the highest pressure of the diagram and the highest temperature are obtained—that is to say, the temperature at which the subsequent combustion has to take place, not the burning or igniting point. To make this more clear, let it be assumed that the subsequent combustion shall take place at a temperature of 700°. Then in that case the initial pressure must be sixty-four atmospheres, or for 800° centigrade the pressure must be ninety atmospheres, and so on.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "Into the air thus compressed is then gradually introduced from the exterior finely-divided fuel, which ignites on introduction, since the air is at a temperature far above the igniting-point of the fuel. The gases in the cylinder are now permitted to expand with the gradual introduction of fuel and the expansion so regulated that the decrease in temperature by expansion counterbalances the heat produced by the combustion of the fresh particles of fuel. The effect of combustion will therefore not be increase in temperature or pressure, but increase in actual energy exerted. The combustion takes place according to the curve 2 3, ",
      },
      figure(2),
      {
        kind: "text",
        text: ", from which it will be seen that it is not in the nature of an explosion, but rather takes place during a period of time corresponding to the portion of the stroke of the piston and determined by the point of cut-off.",
      },
    ]),
    paragraph(
      text(
        "At the point of cut-off 3 the supply of fuel ceases and the expansion of the gases of combustion, without transfer of heat, continues according to curve 3 4. Since the pressure at point 2 of the diagram was very high and is still very high at point 3, the consequent expansion after cut-off (3 to 4) so cools the gases that in leaving the engine they carry away only an insignificant quantity of heat. It will thus be seen that the combustion of the gases is not left to itself after ignition, but is so regulated during its whole duration that pressure, temperature, and volume are in a prescribed proportion.",
      ),
    ),
    paragraph(
      text(
        "If the air were allowed to expand without any supply of fuel, the curve 2 1 would be formed—that is, the expansion would do no work, but restore only the previous work of compression; but by gradually introducing fuel a difference of pressure p is formed between the curves 1 2 and 2 3, in consequence whereof a useful effect is produced. As with the other types of engines before mentioned, the diagram will assume more the nature of the diagram shown by broken lines.",
      ),
    ),
    paragraph(
      text(
        "The characteristic features of the cycle according to my present invention are therefore, increase of pressure and temperature up to the maximum, not by combustion, but prior to combustion by mechanical compression of air, and thereupon the subsequent performance of work without increase of pressure and temperature by gradual combustion during a prescribed part of the stroke determined by the cut-off. According to what has been above stated, the process of combustion itself differs from all the hitherto methods, in that there is no increase of temperature produced, or at the most only a very slight one, and the highest or extreme temperature is produced by the compression of the air. It is therefore under control and will be kept within moderate limits, and moreover, in view of the cooling of the products of combustion by the subsequent expansion, no artificial cooling is required for the cylinder, the mean temperature of the gases being such that the parts of the engine can be kept tight and lubricated.",
      ),
    ),
    paragraph([
      { kind: "text", text: "In " },
      figure(3),
      {
        kind: "text",
        text: " I have shown a diagram obtained when the previously-described method is varied by cooling the air during the first portion of the compression—for instance, by means of an injection of water. In this case the flat curve 1 2 is formed and then the steeper curve 2 2'. By this means I can attain considerably higher pressures than those obtained by the first method without reaching such high temperatures as would necessitate artificial cooling of the cylinder. In consequence of the greater fall of pressure in expanding from 3 to 4, the gases are cooled to a greater extent than before and a higher useful effect is obtained. The exhaust-gases may in this case be cooled even below the temperature of the surrounding atmosphere and utilized for refrigerating purposes.",
      },
    ]),
    paragraph(
      text(
        "My method of working the fuels may be carried out with any kind of fuel, whether solid, liquid, or gaseous. In the case of liquids, gases, or vapors a jet of the fluid under pressure is dispersed in as finely-divided state as possible into the compressed air during the period of admission. Solid fuels may be introduced in a pulverulent or comminuted condition. Such solid fuels which agglomerate in heating or are unsuitable for other reasons are previously converted into gases. Liquid fuels may be previously converted into vapor and introduced in this form. Substances—such, for instance, as anthracite—which are not readily inflammable may be mixed with readily-inflammable material, such as petroleum or the like. The method of working the fuel above described may be carried out in any suitable engine, either single or double acting, and in engines containing one or more cylinders.",
      ),
    ),
    paragraph([
      {
        kind: "text",
        text: "I will now proceed to describe some particular forms especially constructed for carrying out said method. Reference being had at present to ",
      },
      figure(4, "Figs. 4 and 5", [preview(5, 400, 650)]),
      {
        kind: "text",
        text: " of the drawings, the letter C designates a single-acting cylinder especially constructed for the use of coal in a finely-divided condition. P is a plunger constructed for high pressures. b is the connecting-rod; c, the crank; d, the shaft, and a the guides for the plunger. E is the governor whose shaft g is connected to the shaft d by suitable gears at f. At the upper end of the cylinder is located a hopper B provided with a charging-opening m, ",
      },
      figure(5),
      {
        kind: "text",
        text: ", and placed in communication with the cylinder. A disk-valve k closes the discharge end of the hopper and below the same is located a turning valve or plug D by which the fuel is fed to the cylinder.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "A is the air-admission valve arranged in a passage entering the cylinder laterally. The valves are in this instance operated from a horizontal shaft h geared to the governor-shaft g. On the distributing-shaft h is secured a cam i, connected with the stem of the air-admission valve A, and on said shaft is mounted a second similar cam operating the hopper-valve k by a lever-and-rod connection m. Suitable springs l hold the valves A k upon their seats. The fuel-admission valve D is turned by a suitable worm-and-gear connection with the distributing-shaft h. Referring to ",
      },
      figure(6),
      {
        kind: "text",
        text: ", it will be seen that the valve D is provided with a radial groove or chamber r, which, when facing upward, is charged with fuel and when brought to face downward discharges the same into the cylinder, the pressure being equalized owing to the loose condition of the fuel.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "I will now proceed to describe the operation of the engine. On the first downward stroke of the plunger induced by the inertia of the fly-wheel atmospheric air is drawn into the cylinder through the open admission-valve A. The midway position of the plunger P is shown by full lines in ",
      },
      figure(4),
      {
        kind: "text",
        text: ", in which position the valve A is closed. On the succeeding upward stroke, also induced by the inertia of the fly-wheel, the air in the cylinder is compressed by plunger P to such an extent that the temperature at which later on the combustion has to take place is produced by this compression only. The pressure is determined by the temperature of combustion of the fuel.",
      },
    ]),
    paragraph(
      text(
        "On the second downward stroke or actual working stroke of the plunger the fuel-admission valve D is turned to admit the fuel to the cylinder. This introduction of fuel takes place gradually with the turning of the valve in proportions depending on the size of the chamber r therein. The fuel, as it gradually falls into the highly-compressed air, ignites and is consumed, producing heat which is converted into work on the forward stroke of the piston. The supply of fuel continues until the piston has arrived to the position 3, when the chamber r is empty and has cleared the inlet-opening of the cylinder. After the point of cut-off the gases continue to expand and perform work, while in view of the great reduction in pressure they are considerably cooled, and this solely by doing work. Consequently the cylinder need not be cooled by artificial means, but may be provided with an insulating-jacket s.",
      ),
    ),
    paragraph(
      text(
        "On the second upward stroke of the piston the exhaust-gases are driven out with considerable force through the valve A or through a separate exhaust-opening into a pipe p and led away. The residues of combustion being suspended in a finely-divided state in the whirling gases are blown out with the same. The motor is started by introducing through the opening v compressed air from a reservoir by means of the pipe q. If desired a special device may be used at q for igniting a small quantity of explosive matter. The supply of fuel is regulated by the governor E in any suitable manner—for instance, by permitting the hopper-valve k to remain closed in case the engine runs too fast, thus depriving the engine of fuel until the normal speed is re-established.",
      ),
    ),
    paragraph(
      text(
        "This may be accomplished by throwing the end of the lever m out of contact with its operating-cam i for one or more strokes of the engine by the rod-and-lever system n, connected with the sleeve of the governor. It is evident that the engine described may be arranged horizontally without altering the principle of the construction by suitably changing the positions of the parts or a double-acting engine may be constructed on the same principle; also, two or more single engines may be coupled in the usual manner to form a multiple engine.",
      ),
    ),
    paragraph([
      {
        kind: "text",
        text: "The compression of the air, as well as the expansion of the gases, may be effected by increments. An engine for operating in this manner I have illustrated in ",
      },
      figure(7),
      {
        kind: "text",
        text: ". In this figure the valves are indicated diagrammatically. The frame, the connecting-rod, the fly-wheel, &c., are omitted, all these parts being exactly the same as shown in ",
      },
      figure(4, "Figs. 4 and 5", [preview(5, 400, 650)]),
      {
        kind: "text",
        text: ". The engine consists of two cylinders C with plungers P—that is to say, two combustion-cylinders, the construction, distributing devices, &c., of which are identical to those of the cylinder represented in ",
      },
      figure(4, "Figs. 4 and 5", [preview(5, 400, 650)]),
      {
        kind: "text",
        text: ". These two cylinders C are connected by means of the controlled valves b to the two sides of a large central cylinder B, and by the two valves a, which are also controlled, the two combustion-cylinders are in communication with the air-reservoir L.",
      },
    ]),
    paragraph(
      text(
        "The cranks of the two cylinders C are arranged in the same position and they form, with the crank of the central cylinder B, an angle of one hundred and eighty degrees. The operation of this engine is as follows: The piston Q of cylinder B draws in air during its upward stroke through valve d, compresses the latter in its down-stroke to a certain pressure, and then forces the air through valve g to the air reservoir L. The lower part of the central cylinder therefore only serves as an air-pump and effects the preparatory compression of the air for combustion. This preparatory compression should go only to such an extent that the heating of the air produced by this compression remains within moderate limits. Water-nozzles are arranged at g g, through which during the preparatory compression water at a low temperature may be injected. This water is then discharged again through the cock h of the air-vessel.",
      ),
    ),
    paragraph([
      {
        kind: "text",
        text: "The process may, however, be carried out either with or without injection of water. The action in the cylinders C is exactly the same as has been described with reference to ",
      },
      figure(4, "Figs. 4 and 5", [preview(5, 400, 650)]),
      {
        kind: "text",
        text: ", excepting that piston P does not draw in the air directly from the atmosphere, but from reservoir L, in which the air is under pressure. On its upstroke piston P therefore effects the second stage of the compression up to the prescribed degree. The lower and upper end positions of the piston are shown in dotted lines and marked 1 and 2. Piston P now moves downward again to position 3, fuel being during this time gradually introduced and the combustion controlled, as above described. At 3 the admission of fuel ceases and the air continues to expand.",
      },
    ]),
    paragraph(
      text(
        "When the piston has arrived in its lowest position, valve b opens, and piston Q is at this moment just in its upper position owing to the arrangement of the cranks. Piston P then moves upward and piston Q downward, and a further expansion of the combustion gases up to the volume of cylinder B takes place, whereupon valve b closes and valve f opens, so that in the ensuing upward stroke of piston Q the gases of combustion are expelled through valve f into the atmosphere in a perfectly-cool condition, since their entire heat will have been consumed by the work done in expanding. It has already been mentioned that in this construction the exhaust-gases can be caused to escape with a temperature which is below that of the surrounding atmosphere, so that they may then serve for refrigeration.",
      ),
    ),
    paragraph(
      text(
        "As the cylinders C have a working-stroke only once in every two revolutions, I attain by arranging two such cylinders a working-stroke for each revolution, as the combustion is made to take place alternately in the two cylinders. There is no objection to using only one combustion-cylinder in place of two, or, on the other hand, more than two, in which latter case the lower part of the cylinder B may then be used as an expansion-cylinder. The air-pump for the preparatory compression should then be arranged separately and force previously-compressed air into the reservoir L. The compressed air in the reservoir L serves in this construction also for starting the motor, as the latter may be fed during several revolutions from this reservoir with full pressure, the ignition taking place after the fly-wheel has attained the necessary momentum.",
      ),
    ),
    paragraph(
      text(
        "The device for gradually introducing fuel is dependent on the peculiar properties of the material employed. For solid pulverized substances in lieu of the described revolving cock a powder-nozzle or a small pump may be used. For liquids a spray-nozzle or a small pump is employed. For gases also a small pump or any other suitable device permitting the gradual introduction of the fuel in a definite proportion to the piston-stroke may be used.",
      ),
    ),
    paragraph([
      figure(8, "Figs. 8 to 10", [preview(9, 800, 1250), preview(10, 850, 620)]),
      {
        kind: "text",
        text: " show a construction for a motor in which liquid fuel is employed, and at the same time the external distributing device, in particular the device for gradually introducing fuel, is of a quite different construction. This engine consists of two identical single-acting cylinders provided with plunger-pistons, the cranks of which are arranged on the common fly-wheel shaft in the same position. The frame, fly-wheel, and distributing device are substantially the same as illustrated in ",
      },
      figure(4, "Figs. 4 and 5", [preview(5, 400, 650)]),
      {
        kind: "text",
        text: " and therefore not represented. The combustion in the cylinders takes place alternately, so that at each revolution a working-stroke is effected.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "The process in each cylinder is the same as described with reference to ",
      },
      figure(4, "Figs. 4 and 5", [preview(5, 400, 650)]),
      {
        kind: "text",
        text: ", viz: drawing in of air through valve W, then compression by one stroke up to the end position 2 of the piston, (shown in dotted lines;) introduction of liquid fuel through nozzle D and combustion of same during the prescribed period of admission 2 3, ",
      },
      figure(8),
      {
        kind: "text",
        text: "; finally, expansion of the gases of combustion and exhausting through valve W into an outward-leading pipe R. As the drawing in of air follows immediately after the exhaust, the valve W remains open during a whole revolution and then closed during a whole revolution.",
      },
    ]),
    paragraph([
      { kind: "text", text: "This simplest possible regulation is effected by cam S, " },
      figure(9, "Figs. 9 and 10", [preview(10, 850, 620)]),
      {
        kind: "text",
        text: ", by means of the bent lever, as shown in the drawings. The cam S is carried by the distributing-shaft W, which latter is driven by the shaft of the fly-wheel in a similar way, as in ",
      },
      figure(4, "Figs. 4 and 5", [preview(5, 400, 650)]),
      {
        kind: "text",
        text: ". The nozzle D is kept closed by the needle n and serves for gradually admitting the fuel. The liquid fuel is in the inner space r of the nozzle D, and is maintained there by means of a feed-pump (not shown) provided with an air-chamber under a pressure which is higher than the highest pressure of compression of the air in the cylinder.",
      },
    ]),
    paragraph([
      { kind: "text", text: "In " },
      figure(10),
      {
        kind: "text",
        text: " is shown at t the branch pipe for leading the liquid fuel coming from the pump and to the nozzle. At the moment of the highest compression—that is, when the piston is in the position 2—the needle n is opened by the distributing-gear and allows a thin jet of liquid to enter through the very small opening D, as the liquid is under a pressure greater than the cylinder-pressure. This entrance of fuel continues up to position 3 of the piston, where the distributing device cuts it off exactly, whereupon the gases of combustion continue to expand. For regulating the jet of fuel I have provided here exactly the same construction by which, in Sulzer's valve-gears, the period of steam admission is regulated. An eccentric E moves the steel side piece q in a uniform oviform curve up and down. The steel block r is attached to the rod which actuates the needle n. As soon as the piece q, moving downward, strikes against the piece r, the needle is opened and remains open until the steel piece q releases the piece r. As the piece r is adjustable from the governor by means of the rod St, (see ",
      },
      figure(9),
      {
        kind: "text",
        text: ",) the governor regulates simultaneously in the two cylinders the duration of the period of admission of fuel, and in consequence thereof the speed of the engine.",
      },
    ]),
    paragraph([
      { kind: "text", text: "In " },
      figure(8, "Figs. 8 and 10", [preview(10, 850, 620)]),
      {
        kind: "text",
        text: " there is formed round the nozzle D an annular space s, which is in free communication with the interior of the cylinder. When the piston moves backward under decreasing pressure, the air flows from this annular space back into the cylinder and serves in this way both for dividing the jet of fuel and for producing turbulent motion for distributing the combustion heat over the whole air volume. This annular space s is only of practical importance and is not essential for the process. There is, moreover, in ",
      },
      figure(8, "Figs. 8 and 10", [preview(10, 850, 620)]),
      {
        kind: "text",
        text: " at O an opening for introducing compressed air or gases from explosive substances serving to start the motor. When in ",
      },
      figure(8),
      {
        kind: "text",
        text: ", in place of liquid, gas or vapor is compressed in the inner space r of the nozzle D the same construction may be employed. It is therefore not necessary to show a construction of engine for this application.",
      },
    ]),
    paragraph(
      text(
        "It is especially to be remarked that the thermal results are independent of the kind of gas contained in the cylinder. It is sufficient if the quantity of air necessary for combustion is provided. The other considerable quantity of gas, which acts only as a carrier of heat, may consist in former combustion gases, added foreign gases, and vapors or aqueous vapor without altering the result. It follows from the above that closed engines might be arranged so as to take up at each stroke only a small quantity of fresh air for insuring the combustion, but which retain essentially always the same body of gas, a small exhaust of course excepted.",
      ),
    ),
    claim(
      1,
      "1. The herein described process for converting the heat energy of fuel into work, consisting in first compressing air, or a mixture of air and neutral gas or vapor, to a degree producing a temperature above the igniting point of the fuel to be consumed, then gradually introducing the fuel for combustion into the compressed air while expanding against a resistance sufficiently to prevent an essential increase of temperature and pressure, then discontinuing the supply of fuel and further expanding without transfer of heat.",
    ),
    claim(
      2,
      "2. In an internal combustion engine, the combination with the cylinder and piston, of a valved suction inlet for air or a mixture of air and neutral gas, a valved fuel feed constructed to gradually discharge the fuel into the cylinder, and means in operative connection with the feed valve for opening the same at the commencement of the working stroke of the piston and for closing the same at a predetermined part of the stroke, substantially as described.",
    ),
    claim(
      3,
      "3. In an internal combustion engine of the character specified, the combination of a combustion cylinder provided with means for gradually introducing fuel therein up to the point of cut-off, a compressor for air, a reservoir connected with the latter and with the cylinder, and an expansion chamber for the exhaust gases, substantially as described.",
    ),
    paragraph(
      text(
        "In testimony whereof I have signed my name to this specification in the presence of two subscribing witnesses.",
      ),
    ),
    { kind: "heading", level: 3, text: "RUDOLF DIESEL." },
    paragraph(text("Witnesses: LUDWIG GLASER. EDUARD PEITZ.")),
  ],
};

/** Patent-local companions; global registration is intentionally owned by another lane. */
export const dieselEngineParallelReadings: Readonly<Record<number, readonly string[]>> = {
  5: [
    "Diesel addresses the standard patent audience before identifying himself and the invention.",
  ],
  6: [
    "Diesel identifies his Bavarian nationality and Berlin residence, names the foreign patent family, and states that this is a process for motive power from fuel combustion.",
  ],
  7: [
    "The stated subject is not merely a new engine shape: it is a method and apparatus for converting heat into useful work.",
  ],
  8: [
    "This is the drawing key. Fig. 1 is the conventional gas-engine cycle; Figs. 2 and 3 are the proposed cycles; Figs. 4-10 locate the several machine constructions and their shared reference letters.",
  ],
  9: [
    "Diesel first defines the ordinary cycle: fuel-air mixture compresses along 1-2, ignition creates a rapid pressure and temperature rise to 3, then expansion from 3 to 1 performs work.",
  ],
  10: [
    "He identifies the prior-cycle costs: uncontrolled combustion makes parts too hot to lubricate without cooling, and hot exhaust carries away heat that expansion did not recover.",
  ],
  11: [
    "Engines that compress a mixture before injection still show the 2-3 pressure rise. The same objection applies when compression itself ignites the mixture.",
  ],
  12: [
    "Because petroleum and gas ignite at comparatively low temperature and pressure, mixture compression triggers combustion before the desired state; the following rise depends on fuel properties, not a controlled schedule.",
  ],
  13: [
    "The old-cycle summary is uncontrolled: combustion itself raises pressure and temperature, after which expansion does work.",
  ],
  14: [
    "Fig. 2 reverses that order. Air alone is compressed before fuel arrives, so the selected subsequent combustion temperature, illustrated at 700 degrees and 64 atmospheres or 800 degrees centigrade and 90 atmospheres, is set mechanically.",
  ],
  15: [
    "Finely divided fuel enters the already hot compressed air gradually. Expansion cooling is balanced against heat from fresh fuel, so the 2-3 path is a timed admission period ending at cut-off rather than an explosion.",
  ],
  16: [
    "After cut-off at point 3, no more fuel is supplied and 3-4 expansion proceeds without heat transfer. The high initial pressure lets that expansion remove heat, while the whole admission period keeps pressure, temperature, and volume in a prescribed relation.",
  ],
  17: [
    "Without added fuel, expansion 2-1 would merely return compression work. Gradual fuel admission creates the pressure difference p between curves 1-2 and 2-3, which is the useful work area.",
  ],
  18: [
    "Diesel states his proposed cycle's constraint: maximum pressure and temperature come from air compression before combustion; timed fuel admission then performs work with no essential additional pressure or temperature rise, avoiding artificial cylinder cooling.",
  ],
  19: [
    "Fig. 3 adds water injection during early compression. The flatter 1-2 and steeper 2-2-prime curves permit still higher pressure without excessive cylinder temperature and can cool exhaust below ambient for refrigeration.",
  ],
  20: [
    "The fuel treatment is deliberately broad: liquid, gas, vapor, solid powder, converted gas, and hard-to-ignite fuel mixed with petroleum may all be finely divided and introduced during admission in single- or double-acting engines.",
  ],
  21: [
    "Figs. 4 and 5 introduce the coal-fuel single-acting construction: cylinder C, high-pressure plunger P, rod b, crank c, shaft d, guides a, governor E, hopper B, disk valve k, and turning fuel plug D.",
  ],
  22: [
    "This paragraph supplies the valve train. Admission valve A and hopper valve k are cam-operated from shaft h; turning valve D meters the fuel, while Fig. 6 shows its radial chamber r loading upward and discharging downward.",
  ],
  23: [
    "The first downstroke admits air through A; the next upstroke compresses it by P. Diesel says the required pressure follows the fuel's combustion temperature, not a separately fixed number.",
  ],
  24: [
    "On the working downstroke, turning D gradually drops fuel from chamber r into compressed air until position 3 clears the inlet. After cut-off, expansion cools the gases by doing work, allowing insulating jacket s instead of artificial cooling.",
  ],
  25: [
    "The following upstroke exhausts through A or pipe p. Compressed air from reservoir and pipe q can start the motor; governor E can withhold hopper fuel when speed is excessive.",
  ],
  26: [
    "The governor can disconnect lever m from cam i for one or more strokes. Diesel also says the layout can be horizontal, double-acting, or coupled into a multiple engine without changing its operating principle.",
  ],
  27: [
    "Fig. 7 introduces staged compression with two combustion cylinders C and plungers P, a central cylinder B, valves a and b, and reservoir L. The omitted frame and flywheel correspond to Figs. 4 and 5.",
  ],
  28: [
    "The two C cranks share a position but lie 180 degrees from B's crank. B acts as the preliminary air pump, sends air through g to L, and may receive low-temperature water at g g so preliminary compression remains moderate.",
  ],
  29: [
    "Each C then takes reservoir air and provides the second compression stage. Its piston moves from dotted position 1 to 2, then down to 3 while fuel enters gradually and combustion is controlled before expansion.",
  ],
  30: [
    "At C's lowest position valve b connects the gases to B. As P rises and Q falls, B provides further expansion, then valve f opens to exhaust after the expanding gases have given up their heat.",
  ],
  31: [
    "Two alternating C cylinders give a working stroke every revolution despite each cylinder working only once in two revolutions. Diesel permits one or more cylinders and notes that L also supplies starting air until the flywheel has momentum.",
  ],
  32: [
    "The gradual-admission device changes with material: a powder nozzle or pump for solids, spray nozzle or pump for liquids, and a suitable small pump for gases, always metered in proportion to piston travel.",
  ],
  33: [
    "Figs. 8-10 show the liquid-fuel alternative: two identical single-acting cylinders on a common flywheel shaft, with alternate combustion so every revolution has one working stroke.",
  ],
  34: [
    "Each liquid-fuel cylinder draws air through W, compresses to dotted position 2, admits fuel through nozzle D during 2-3 in Fig. 8, expands, and exhausts through W. W stays open for one full revolution and closed for the next.",
  ],
  35: [
    "Cam S on the distributing shaft regulates W through the bent lever. Needle n holds D shut; a feed pump and pressurized air chamber keep liquid in nozzle space r at pressure above the cylinder's maximum air-compression pressure.",
  ],
  36: [
    "At position 2, the gear opens needle n so a thin jet enters D; it closes exactly at position 3. The Sulzer-style eccentric, side piece q, block r, and governor rod St change the fuel-admission duration and therefore engine speed.",
  ],
  37: [
    "Annular space s around D returns air into the cylinder during falling pressure, splits the fuel jet, and stirs the charge. Opening O admits compressed air or explosive gas for starting; the same arrangement can use gas or vapor instead of liquid.",
  ],
  38: [
    "Thermal results do not depend on which carrier gas is present so long as combustion air is supplied. Diesel therefore contemplates closed engines that retain a working gas body and take only a small fresh-air charge and exhaust.",
  ],
  42: [
    "Diesel formally attests that he signed the specification before two subscribing witnesses.",
  ],
  44: [
    "The printed witness names are Ludwig Glaser and Eduard Peitz; they complete the formal execution of the document.",
  ],
};

export function dieselManualClaimText(number: number): string {
  const block = dieselEngineArchivalEdition.blocks.find(
    (candidate) => candidate.kind === "claim" && candidate.number === number,
  );
  if (block?.kind !== "claim") throw new Error(`Diesel manual edition is missing claim ${number}.`);
  return block.inlines.map((inline) => inline.text).join("");
}
