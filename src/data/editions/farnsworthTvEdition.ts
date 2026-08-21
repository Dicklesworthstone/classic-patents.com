import type {
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

const text = (value: string): CuratedSpecificationInlines => [{ kind: "text", text: value }];
const p = (value: string) => ({ kind: "paragraph" as const, inlines: text(value) });
const pInlines = (...inlines: CuratedSpecificationInline[]) => ({
  kind: "paragraph" as const,
  inlines: inlines as CuratedSpecificationInlines,
});

const term = (value: string, definition: string): CuratedSpecificationInline => ({
  kind: "term",
  text: value,
  definition,
});

const figureCropVersion: Readonly<Record<number, number>> = {
  1: 2,
  2: 2,
  3: 2,
  4: 2,
  5: 2,
  6: 2,
  7: 2,
  8: 2,
  9: 2,
  10: 2,
  11: 2,
  12: 2,
  13: 2,
  14: 2,
  15: 2,
  16: 2,
  17: 2,
};

const figureDimensions: Readonly<Record<number, readonly [number, number]>> = {
  1: [1600, 1150],
  2: [1600, 450],
  3: [1500, 760],
  4: [1300, 270],
  5: [1300, 230],
  6: [500, 340],
  7: [650, 350],
  8: [380, 360],
  9: [450, 350],
  10: [350, 350],
  11: [1350, 360],
  12: [1350, 260],
  13: [1400, 280],
  14: [400, 560],
  15: [420, 420],
  16: [480, 420],
  17: [400, 400],
};

const figureGroup = (
  numbers: readonly number[],
  sourceText = numbers.map((number) => `Figure ${number}`).join(", "),
): CuratedSpecificationInline => ({
  kind: "reference",
  text: sourceText,
  href: `#figure-${numbers[0]}`,
  referenceType: "figure",
  label: `Open the source-facsimile crops for ${sourceText} in US 1,773,980`,
  figurePreviews: numbers.map((number) => ({
    src: `/patents/figures/us-1773980-farnsworth-tv/fig-${number}-source-crop-v${figureCropVersion[number]}.png`,
    alt: `Source-facsimile crop containing Figure ${number}, oriented for legibility, from US 1,773,980.`,
    width: figureDimensions[number][0],
    height: figureDimensions[number][1],
  })),
});

const figure = (number: number, sourceText = `Figure ${number}`): CuratedSpecificationInline =>
  figureGroup([number], sourceText);

const claim = (number: number, value: string) => ({
  kind: "claim" as const,
  number,
  inlines: text(value),
});

/**
 * Manually prepared continuous reading of US 1,773,980. The grant is not the
 * later single-tube Image Dissector account often attached to Farnsworth: this
 * source specifies a transmitter, radio link, optical receiver, light rotator,
 * quartz oscillographs, and eighteen claims. Figure sheets and ledger page
 * locators remain outside the visitor-facing prose.
 */
export const farnsworthTvArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "b1ca00feb8a6212894a3ac6fd8aed229493b929b2469a7fe710e9ee53c046538",
  preparedBy: "Classic Patents editorial agent (GPT-5.6)",
  preparedAt: "2026-08-18",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE.",
        "PHILO T. FARNSWORTH, OF BERKELEY, CALIFORNIA, ASSIGNOR, BY MESNE ASSIGNMENTS, TO TELEVISION LABORATORIES, INC., OF SAN FRANCISCO, CALIFORNIA, A CORPORATION OF CALIFORNIA.",
        "TELEVISION SYSTEM.",
        "1,773,980.",
        "Application filed January 7, 1927. Serial No. 159,540. Patented Aug. 26, 1930.",
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIGURES 1–17",
      title:
        "Four drawing sheets: transmitter, receiver, optical cell, oscillographs, waveforms, and optical paths",
      description: [
        {
          kind: "text",
          text: "The present invention, together with various objects and advantages thereof will best be understood from a description of a preferred form or example of a process and apparatus for television embodying the invention. For this purpose, I have hereinafter set forth one form of example of a method and apparatus for producing television in accordance with the present invention, and have illustrated said apparatus and method as it is adapted for television by wireless. It is to be understood, however, that the invention is capable of various and numerous modifications, changes, and substitutions, and is not necessarily limited to the transmission by wireless or radio. The apparatus and method will best be understood from a description of the accompanying drawings, in which: ",
        },
        figure(1),
        {
          kind: "text",
          text: " is a diagrammatic view of a complete television transmitter, including a circuit diagram therefor. ",
        },
        figure(2),
        { kind: "text", text: " is a diagrammatic view of the television receiver. " },
        figure(3),
        {
          kind: "text",
          text: " is a circuit diagram of the electrical connections for the television receiver. ",
        },
        figure(4),
        { kind: "text", text: " is an elevation of one of the oscillographs. " },
        figure(5),
        { kind: "text", text: " is a plan view of one of the oscillographs. " },
        figure(6),
        { kind: "text", text: " is a perspective view of the light diverting means. " },
        figure(7),
        { kind: "text", text: " is a sectional view of the photo-electric cell. " },
        figure(8),
        { kind: "text", text: " is a section on the line 8–8 of " },
        figure(7, "Figure 7"),
        { kind: "text", text: ". " },
        figure(9),
        { kind: "text", text: " is a section of the light rotator. " },
        figure(10),
        { kind: "text", text: " is an end view thereof. " },
        figure(11),
        {
          kind: "text",
          text: " is a representation of the form of electric current of the first oscillator employed in developing a potential for the photo-electric cell. ",
        },
        figure(12),
        {
          kind: "text",
          text: " is a representation of the form of electric current produced in the second oscillator. ",
        },
        figure(13),
        { kind: "text", text: " is a representation of the resulting straight lined potential. " },
        figure(14),
        {
          kind: "text",
          text: " is a view of the scanning path and also a view of the path of the light beam over the receiving screen. ",
        },
        figure(15),
        {
          kind: "text",
          text: " is a perspective view of a bi-axial crystal showing the conical refraction of unpolarized light. ",
        },
        figure(16),
        {
          kind: "text",
          text: " is a perspective view of a bi-axial crystal showing the refraction of polarized light, and, ",
        },
        figure(17),
        {
          kind: "text",
          text: " is a diagrammatic illustration of the path of light through the gratings.",
        },
      ],
    },
    p(
      "This invention relates to a television apparatus and process, that is, it is directed to an apparatus and process for the instantaneous transmission of a scene or moving image of an object located at a distance in which the transmission is by electricity.",
    ),
    p(
      "Heretofore attempts have been made to transmit an image of an object by electricity so that the image of the object will instantaneously appear at a distance. These prior attempts at television have generally embodied an apparatus and method in which each particular elementary area of the image of the object is successively converted into an electrical current, the intensity of which is proportional to the intensity of the light at that particular elementary area; all the elementary areas of the image being covered in that fraction of a second during which the eye will retain a picture, hereafter referred to as the optical period. This is followed by a transmission of such current and a conversion of such current to light corresponding in intensity to the intensities of the light of the individual areas of the original image; the reconversion process likewise being performed within the optical period so that, by a proper coordination of the developed light, an image of the object to be transmitted appears as instantly formed at the receiving end of the apparatus and method.",
    ),
    p(
      "The time during which the human eye will retain a picture is of such short duration that the conversion of the light shades of the original image of the object to electricity and the reconversion of said electricity to light and the proper coordination of such light must be performed at a very tremendous speed. All prior attempts at television have attempted to employ some mechanically moving part for dissecting the image of the original object during the process of forming an electrical current which varies in intensity in accordance with the light shades of the respective elementary areas of the image. None of these prior attempts at television have proven successful. They have resulted at best in the production of a crude moving silhouette of the object to be transmitted. This has generally been due to the fact that the mechanically moving parts of the prior apparatus have not been able to travel at the necessary speed requirements with the synchronism required in a television apparatus.",
    ),
    p(
      "An object of the present invention is to provide a method and apparatus for television, which is adapted to transmit electrically a true moving image in full light shades of the object to be transmitted. Another object of the present invention is to provide a method and apparatus for television in which the conversion and dissecting of the light shades of the object to be transmitted, to electricity and the reconversion of such electricity to form an image is accomplished in the following manner:",
    ),
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "In the process and apparatus of the present invention, light from all portions of the object whose image is to be transmitted, is focused at one time upon a ",
        },
        term(
          "light sensitive plate",
          "The source’s photo-electric cathode: a surface whose illumination releases an electron discharge with a spatial distribution corresponding to the illuminated image.",
        ),
        {
          kind: "text",
          text: " of a photo-electrical cell to thereby develop an electronic discharge from said plate, in which each portion of the cross section of such electronic discharge will correspond in electrical intensity with the intensity of light imposed on that portion of the sensitive plate from which the electrical discharge originated. Such a discharge is herein termed an electrical image. An electrical shutter is then interposed between said sensitive plate and the anode of the photo-electrical cell, the shutter having a small aperture therein so that there can be received upon said anode at one instant, only the electrons which originate from one elementary area of the light sensitive plate. There is then imposed upon the electrical discharge a plurality of electrical potentials of different frequencies for causing the electrical discharge to bend in two directions, whereby the electrons from each elementary portion of the sensitive plate are successively directed through said shutter; this action taking place so as to completely cover the area of the sensitive plate within the optical period. The scene to be transmitted is thus analyzed or dissected to produce an electrical current, or “light” current having variations in intensity in accordance with the light shades of the object to be transmitted and this is accomplished within the optical period without the necessity of employing any mechanically moving parts.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        { kind: "text", text: "An " },
        term(
          "electrical shutter",
          "Farnsworth’s fixed perforated electrode between the photo-electric plate and anode. The image is moved across its aperture electrically rather than by moving the shutter itself.",
        ),
        {
          kind: "text",
          text: " is then interposed between said sensitive plate and the anode of the photo-electrical cell, the shutter having a small aperture therein so that there can be received upon said anode at one instant, only the electrons which originate from one elementary area of the light sensitive plate. There is then imposed upon the electrical discharge a plurality of electrical potentials of different frequencies for causing the electrical discharge to bend in two directions, whereby the electrons from each elementary portion of the sensitive plate are successively directed through said shutter; this action taking place so as to completely cover the area of the sensitive plate within the optical period.",
        },
      ],
    },
    p(
      "The produced electrical current or “light” current may be transmitted to the receiving end of the apparatus by either wires or may be superimposed upon a wireless carrier wave. There is also transmitted at the same time and preferably superimposed upon the same carrier wave, the two electric potentials of different frequencies which are employed in analyzing the image so that such currents may be employed to synchronize the receiving apparatus and process.",
    ),
    p(
      "At the receiving end of the apparatus and process, the “light” current is reconverted to light and the light coordinated to form an image of the object transmitted in accordance with the following apparatus and process. Preferably a constant source of light is utilized which is directed, first, through a polarizing prism and hence through an apparatus or means by which the plane of polarization of the light may be rotated by the “light” current.",
    ),
    p(
      "In this manner an instantaneous response to the variations of such light current is obtained in the rotation of the plane of polarization of the light. The light is then directed through a suitable screen capable of shutting off the light in accordance with the rotation of its plane of polarization. In this manner, a beam of light is developed fluctuating in intensity to the variations of intensity of the “light” current transmitted without the necessity of employing any mechanically moving parts.",
    ),
    p(
      "This said beam of light is then projected by means of two cooperating oscillographs upon the screen where the image is to be transmitted, said oscillographs being operated by the synchronizing frequencies transmitted with the “light” current to correctly coordinate the light upon the screen to form a correct image.",
    ),
    p(
      "Referring to the drawings, 2 represents an object, an image of which is to be transmitted. Said object may be an actual scene or a photograph, a projection of a motion picture film, or any other object. The object 2 is preferably illuminated, for example, by means of an arc light 3 focused thereon by a lens 4. 5 indicates a lens for focusing an image of the object 2 upon the light sensitive plate 6 of a photo-electric cell 7.",
    ),
    p(
      "The photo-electric cell is preferably constructed as follows: The light sensitive plate 6 or cathode of the cell is preferably made flat and is formed of a fine mesh screen 8, and said screen 8 is covered or coated with a light sensitive material such as sodium, potassium, or rubidium. 10 is the anode of the photo-electric cell positioned at the other end of the cell. Between the sensitive plate 6 and anode 10 and closely adjacent to anode 10 is placed an electric shutter 11 formed by a metallic plate in which there is a small aperture 12.",
    ),
    p(
      "Between the shutter 11 and light sensitive plate 6, four plates 13, 14, 15, and 16 are placed at right angles to each other and outside the path of electrons from the plate 6 to the shutter 11. Each opposed pair of the plates are connected to a source of electrical potential of a different frequency.",
    ),
    p(
      "The circuit photo-electric cell should be highly evacuated, such for example as to 10⁻⁷ cm. mercury to permit a high potential across the cell without ionization.",
    ),
    p(
      "The necessity for employing a high potential across the cell arises from the fact that the photo electrons emitted from the cathode 6 have a small emission velocity which depends upon the color of the light causing their emission. This emission velocity is always small, of the order of that which an electron would acquire by falling through a volt or two, but it may have nearly any direction. This haphazard motion tends to distort the electric image and is only prevented from doing so by making the potential between the cathode 6 and the anode 10 high enough to insure that the time taken for an electron to traverse the distance between cathode 6 and anode 10 is so small that the small velocity transverse to this path produces no appreciable distortion. Hence the vacuum in the photo-electric cell 7 should be the highest obtainable.",
    ),
    p(
      "The electrical potentials are provided by an oscillator 17, capable of developing two different high frequency electrical currents. Said oscillator 17 not only is required to provide a source of oscillating energy but is required to provide a form of oscillating energy, the wave form of which is composed of substantially straight lines, as will be hereinafter pointed out. Such a wave form is essential to accomplish a uniform lighting of all portions of the image which is to be produced.",
    ),
    p(
      "The oscillator comprises a tri-electrode valve 20 connected in a circuit acting as an oscillator to produce an oscillating energy of low frequency, such for example as 10 cycles per second. It is understood that any customary or preferred form of circuit for this purpose may be employed, the particular circuit described being provided with a grid leak 21 connected with the grid 22 of the tube 20, and hence through a negative bias battery 23 to the filament 24. The filament 24 is indicated as heated by a battery 25. The plate 26 of the tube is connected through a battery 26′ and the choke coil 25′ to the filament 24. The plate 26 also connects through an inductance 27 and capacity 28 with the grid. The inductance 27 is shunted by a fixed capacity 28 and a variable capacity 29 in series, one end of the series being connected to the end of the inductance 27 and the other end having a variable connection with said inductance. Between these capacities 28 and 29, a lead 31 is connected which connects with the filament 24 of the tube 20. By this connection, the constants of the oscillating circuit may be any value of inductance and capacity to bring the oscillating circuit in resonance with the frequency of the desired circuit.",
    ),
    p(
      "Said oscillator in turn provides a source of potential for a second oscillating circuit of similar design, the second oscillator operating at a higher frequency such, for example, as 500 kilo-cycles. The second oscillator comprises the tube 32, the plate 33 of which is charged with the oscillatory energy of the first oscillator. The first oscillator is coupled through the secondary coil 31 to plate 33, the inductance 34 being included in series therewith. The inductance 34 may be any suitable radio frequency choke to prevent the high frequencies in the second oscillating circuit from being imposed on the first oscillating circuit. The plate 33 is connected through the primary 40 of a radio frequency transformer and hence through the capacity 41 with the grid 42. Capacities 43 and 44 are shunted around all or part of the primary 40 and a lead is connected from their midpoint to the filament 39 of the tube 32. The grid 42 of the tube is connected through a suitable leak 45 and negative bias battery 46 with filament 39. It is understood that the second oscillating circuit thus described is only one example of a circuit adapted for this purpose and the various constants of the circuit may be of any value suitable for bringing the circuit into resonance with the frequency of the oscillations, 500 kilo-cycles, desired to be produced therein.",
    ),
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "The voltage of the first oscillator is adjusted to be well above the value required for maximum plate current of the second oscillator. Hence, since the second oscillator will generate oscillations only when the plate voltage is positive, the current generated by the second oscillator will be similar to that shown in ",
        },
        figure(12),
        {
          kind: "text",
          text: ". The harmonic oscillating current developed by the first oscillator is represented in ",
        },
        figure(11),
        {
          kind: "text",
          text: ". This current, when imposed upon the second oscillator, develops a current such as illustrated in ",
        },
        figure(12),
        {
          kind: "text",
          text: ", in which it will be seen that each positive cycle of the first harmonic current produces a series of harmonic oscillations in the second oscillator of substantially equal intensity, while during the negative period of the first harmonic current, substantially no oscillations are developed in the second oscillator.",
        },
      ],
    },
    p(
      "The output from the second oscillator is then imposed upon an audion circuit having a tube 48 with its grid 49 connected by a line through the grid leak and grid condenser 50 to an inductance 51 inductively coupled to the inductance 40. Said secondary 51 is connected to the filament 52 of the audion 48. Shunted across the secondary 51 is a condenser 53 of value suitable to produce resonance with the oscillations developed in the second oscillator. The plate 54 of the audion 48 is connected by the lead 55 with the plate 15 of the photo-electric cell, and the opposed plate 16 of the photo-electric cell is connected by the leads 55 and 56 to provide a potential for the plates 15 and 16.",
    ),
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "The action of the audion circuit including the tube 48 is to produce an alternating current equal to the frequency developed in the first oscillator but the wave form of said frequency is of substantially straight lines such, for example, as indicated in ",
        },
        figure(13),
        {
          kind: "text",
          text: ". In producing this wave form, the audion tube 48 operates due to the bias of the grid leak and condenser 50 to accumulate a charge during the passage of each wave train indicated in ",
        },
        figure(12),
        {
          kind: "text",
          text: ", and such accumulated charge leaks off during the interval between successive trains, so that the output of the audion 48 into the plate circuit, indicated by the leads 55 and 56 passing to the plates 15 and 16 of the photo-electric cell, assumes the straight line form of ",
        },
        figure(13),
        { kind: "text", text: "." },
      ],
    },
    p(
      "There is also a duplicate form of audion circuit for supplying a similar wave form of electrical oscillations for the plates 13 and 14 of the photo-electric cell, said oscillations being, however, at a higher frequency, such for example as 5000 cycles per second. Inasmuch as this circuit is identical except in value of constants to the circuit just described, the parts corresponding to those numbered 20 to 54 are numbered 20a to 54a. It is understood that the oscillating tube 20a develops a harmonic oscillating current of 5000 cycles which will be imposed upon the oscillator including the tube 32a, operating at 500 kilo-cycles, producing a straight line alternating current in tube 48a of a frequency of 5000 cycles per second. The output from tube 48a to the plates 13 and 14 is from filament 52a, through resistance 58a, battery 57a, and hence through a modulating tube 59 through the plate 60 thereof, and to the filament 61 thereof, and hence to the plate 54a of the tube 48a. The potential drop across resistance 58a is utilized to provide the potential for plates 13 and 14 through leads 55a and 56a. The modulated tube 59 has its grid 62 connected through the negative bias battery 63 and condenser 64 with lead 56a while the filament 61 is connected by lead 65 with lead 55. In this way, the tube 61 acts to modulate the low frequency from the first oscillator circuit upon the higher frequency of the second-oscillating circuit.",
    ),
    p(
      "The potential for the photo-electric cell is provided by a battery 67. The negative terminal of the battery 67 is connected by a line 70 with the light sensitive plate 6 of the photo-electric cell and the positive terminal of the battery 67 is connected through a resistance 69 to a lead 68 connecting with the anode 10 of the photo-electric cell. The battery 67 has preferably a high potential, such as the order of 1000 volts and the resistance 69 is of high resistance, such, for example, as one megohm, in order that the drop across such resistance induced by the fluctuations of light in the photo-electric cell may be amplified before being transmitted. The shutter 11 of the photo-electric cell is connected by line 71 to the positive terminal of the battery 67 between the resistance 69 and the battery 67 so that it operates at the same potential as the anode 10 of the cell but its current supply does not pass through the resistance 69.",
    ),
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "The effect of the potential applied to the plates 13 and 14 is to cause the electric discharge from the light sensitive plate 6 to be bent back and forth between the plates 13 and 14 at a frequency corresponding to the frequency of the electric potential imposed on the plates 13 and 14, for example, 10 cycles per second. The effect of the potential applied to the plates 15 and 16 is to cause the electric discharge from the light sensitive plate to be bent back and forth between the plates 15 and 16 at a frequency corresponding to the frequency of the electric potential imposed on the plates 15 and 16, for example, 5000 cycles per second. The resulting effect is the same as if the opening 12 of the shutter 11 was mechanically moved over the light sensitive plate in accordance with the line shown in ",
        },
        figure(14),
        {
          kind: "text",
          text: ", in which the substantially parallel lines indicate the movement caused by the potential on the plates 15 and 16. The oscillations of the electric discharge in the direction at right angles to the lines of ",
        },
        figure(14),
        {
          kind: "text",
          text: " is caused by the potential on plates 13 and 14, causing the image on the plate 6 to be traversed once every 1/20th of a second with a 10 cycle per second potential. During this period of time, the 5000 cycle per second frequency imposed on plates 15 and 16 will have caused five hundred passages across the image as contrasted with the other television attempts which have succeeded in securing only about thirty-five lines across the image during the optical period. Moreover, it is understood that the frequencies imposed on the plates 13 to 16 inclusive may be increased without limit, up to at least ten thousand kilo-cycles per second, giving any desired number of passages over the image within the optical period, or to make the optical period as short as desired.",
        },
      ],
    },
    p(
      "There will now be described the apparatus utilized for amplifying the light current and for transmitting such current on a wireless carrier wave, together with the two analyzing oscillator currents or potentials employed on the plates 13 to 16 inclusive, of the photo-electric cell. The transmitting means comprises the tube 72, said tube operating both as an amplifier of the light current and as a modulator of a further tube 73, it being illustrated as in a Heising modulating circuit. The tube 73 produces a first carrier wave of suitable frequency, such, for example, as of about 500 kilo-cycles.",
    ),
    p(
      "For this purpose, the tube 73 is illustrated as having its plate 74 connected by lead 75 with an inductance 76, the opposite end of which is connected through the condenser 77 to the grid 78 of the tube. The inductance 76 is tapped in the center by a variable tap 79 which connects to a variable condenser 80 and hence by a line 81 to the filament 82. The condenser 80 and the coil 76 may have any values provided that the condenser 80 and the inductance 76 are adapted to bring the circuit in resonance with the carrier wave to be produced. The line 81 is also connected with the line 77 by a condenser 83. The grid 78 is also connected with the filament 82 through a grid leak 84 and negative battery 85. The potential for the tube 73 is provided by the battery 91, through the resistance or choke 90. The tube 72 acts as a variable resistance across 90 and 91, increasing or decreasing the potential drop and thereby modulating the potential on plate 74 of the tube 73. The tube 72 has its grid 86 connected by a negative bias battery 87 with the resistance 69, across which there is imposed the “light” potential whereby said “light” potential is amplified in the tube 73. The plate 88 of the amplifying and modulating tube 72 is connected by a line 89 through a choke or resistance 90 and a battery 91, the negative side of which is connected with the filament 92 of the tube 72 and also with the filament 82 of the oscillating tube 73.",
    ),
    p(
      "The choke 90 operates to fluctuate the potential supply to the plate of the oscillating tube in accordance with the amplified light current. In the lead between the choke 90 and plate 74 is provided a choke 92 which prevents the carrier wave produced in the oscillator 73 from being imposed upon the amplifying and modulating tube 72 by the circuit thus described. The carrier wave produced in the oscillator 73 is modulated by the amplified light current. This potential is then imposed upon a double modulating tube 94 which operates to modulate an oscillator 95 producing a second carrier wave of higher frequency, such for example as 1500 kilo-cycles, or the wave length to be transmitted.",
    ),
    p(
      "Said double modulator tube 94 not only modulates the second carrier wave with the modulated first carrier wave from oscillator 73, but also modulates said carrier wave with the analyzing potentials from the modulator tube 59. The double modulating tube 94 has its grid 96 connected by lead 97 with a coil 98, the coil 98 being connected to the filament 99 of the double modulating tube. By this means, the output from the oscillator 73 is imposed upon the double modulating grid. The analyzing potentials are imposed upon the grid 96 by a lead 100 which connects across the resistance 58a and hence by a lead 101 to the filament 99. The tube 94 is part of a Heising modulator that has its plate 102 connected by a lead 103 through a radio frequency choke or resistance 104 to the positive terminal of battery 105, the negative terminal of which is connected with the filament 99. The lead 103 also connects with the radio frequency choke 106 to the plate 107 of the oscillator tube 95. The choke 106 prevents the second carrier wave from being imposed upon the double modulating tube 94 while the choke or resistance 104 fluctuates the potential supply to the plate 107 of the oscillator 95 in accordance with the output of the double modulating tube 94. The plate 107 connects with the lead 108 to an inductance 109 producing the second carrier wave, said inductance being connected with the lead 110 through condenser 111 with the grid 112 of the oscillator tube 95. The filament 113 of the tube is connected by lead 114 through a variable condenser 115 to the inductance 109. There is also a condenser 116 between the lead 114 and the grid leak 110. The inductance is also connected with an antenna 117 or other means for radiating the output from the transmitter. The filament 113 is grounded as indicated at 118.",
    ),
    p(
      "The receiver of the television apparatus and process is constructed and operates as follows: Preferably there is employed a source of light of constant intensity, such as an arc light 120 and to obtain a pencil of light therefrom, there is placed a shutter 121 with a small aperture 122 in front of the arc light. The light from said shutter is then passed through a polarizer 123. The polarizer is indicated as preferably in the form of a Nicol prism. The polarized light from the Nicol prism 123 is then passed through a lens 124 which parallels the polarized light and the paralleled light is then passed through a device 125 for rotating the plane of the polarized light. The device 125 may be any device suitable for rotating the plane of the polarized light in accordance with the fluctuations of the light current received at the receiver. The method of receiving and separating this light current from the transmitted wave will be hereinafter pointed out.",
    ),
    p(
      "The preferred form of such device is illustrated as comprising a means for producing a magnetic field fluctuating in accordance with the light current, such as the coil 126, surrounding an electrically optically active medium 127, such for example as a thin film of iron, cobalt, or nickel, or carbon disulfide, glass, or any other material in which a beam of polarized light rotates considerably when subjected to a magnetic field. I prefer to employ carbon disulfide and said carbon disulfide is held in the core of the coil 126 by glass plates 128.",
    ),
    p(
      "The light from the light rotator 125 is then passed through a device adapted for restricting the passage of light in accordance with its degree of rotation. I preferably employ a combination of a pair of gratings 129 and 130 and a bi-axial crystal 131. The gratings 129 and 130 may be any usual form of light gratings, for example, ruled upon a silvered transparent surface, and are placed at opposite ends or sides of the bi-axial crystal with their gratings opposed. The bi-axial crystal employed between the gratings is adapted to produce a conical refraction of the light. As an example of a suitable crystal of this kind, I have employed a crystal of arragonite one centimeter thick between the gratings ruled with 100 lines per millimeter. With this combination, the rotation between complete extinction and complete restoration is of the order of two degrees. Thus with this analyzer, very small currents may be employed upon the rotator, permitting the use of a coil of very high natural period.",
    ),
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "The operation of this analyzer will best be understood from ",
        },
        figureGroup([15, 16, 17], "Figures 15, 16 and 17"),
        {
          kind: "text",
          text: ", in which ",
        },
        figureGroup([15, 16, 17], "Figures 15, 16 and 17"),
        {
          kind: "text",
          text: " there is disclosed how a rotation of a few degrees will change complete extinction to complete restoration. A indicates a beam of light passing through the first grating 129 and hence through the bi-axial crystal 131 to the second grating 130, the lines of which are opposed to the lines of the grating 129. If the beam of light passes directly through the bi-axial crystal it is completely extinguished by the lines of the grating 130 but if the plane of polarization of the beam A is rotated slightly, the ray A will take the direction of the dotted lines through the crystal and pass between the lines of the grating 130, a slight difference in refraction of the light in the bi-axial crystal 131 being sufficient for this purpose.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "In explanation of the action of the bi-axial crystal 131, it is understood that the light is directed on said crystal along one of its optic axes. When this is done, the light is refracted to an extent depending on the position of the plane of polarization. When unpolarized light from an aperture is directed on such a crystal along one of its axes, said light will appear as a circle from the other side of the crystal, but when a beam of polarized light is directed along one of the axes of the crystal, it appears as a point of light lying in the circle produced by the unpolarized light, but its position is dependent on the position of the plane of polarization of the beam of light. A 90 degree rotation of the plane of polarization of the beam of light will rotate the light from the crystal from one side of the circle to the opposite side. The two extreme positions of a polarized beam of light are indicated in ",
        },
        figure(15),
        {
          kind: "text",
          text: ", by the two branches of the beam of light A. During the passage of the light through the bi-axial crystal, the wave front of the beam of light remains parallel and the wave front of the beam passes through perpendicularly to the optic axis of the crystal.",
        },
      ],
    },
    p(
      "By means of the polarizer 123, light rotator 125, and analyzer comprising the gratings 129 and 130 and the bi-axial crystal 131, the constant supply of light through arc light 120 is caused to produce a light output varying in intensity in accordance with the intensity of the light current supplied to the coil 126. Thereby, without the employment of any mechanical moving apparatus, the light current is reconverted into light. Such light is then passed through a lens 132 by which it is focused upon a pair of cooperating oscillographs 133 and 134. Said cooperating oscillographs 133 and 134 are positioned at right angles one to the other and so that the light from one strikes the other oscillograph. Said oscillographs are operated at different frequencies with the result that the light is by said oscillographs projected in horizontal vibrations, which are successively lowered or raised vertically so that the light can pass through a lens 135 upon a screen 136 and covers successively an entire rectangular area of said screen. The oscillographs 133 and 134 are operated by electrical currents of the frequencies of the two analyzer currents applied to the plates 13 to 16 of the photo-electric cell so that the passage of the beam of light over the screen 136 is in synchronism with the bending of the electrical discharge from the sensitive plate 6 of the photo-electric cell and thereby each portion of the beam of light is properly coordinated to produce a correct image of the object being transmitted.",
    ),
    pInlines(
      {
        kind: "text",
        text: "The details of the construction of the oscillographs 133 and 134 are shown in ",
      },
      figureGroup([4, 5], "Figures 4 and 5"),
      {
        kind: "text",
        text: ", only one of the oscillographs being illustrated since they are of similar construction. The oscillographs comprise a base or body 137 of any suitable material. In the center thereof, is mounted a quartz strip 138 having a silvered mirror surface 139 at its top. Said quartz strip vibrator 138 is held in a holder 140 which is vertically adjustable by a set-screw 141. The quartz strip vibrator is engaged at opposite sides and at points spaced apart slightly vertically by a pair of quartz strips 142 and 143 laid horizontally and plated at the tops and bottoms by a metallic plating, such as copper, as indicated at 144 and 145. The outer ends of such quartz strips 142 and 143 engage guides 146 on the body, and hence engage clamps 147 by which they are held to carriers 148. The clamps 147 are connected by adjusting screws 149 to the body 137 by means of which the quartz strips 142 and 143 may have their pressure against the quartz strip vibrator 138 adjusted. At the inner ends of the quartz strips 142 and 143 are placed rests 149a over which are placed a resilient material, such as rubber, and thereabove is placed a further quantity of rubber.",
      },
    ),
    pInlines(
      {
        kind: "text",
        text: "Clamps 150 are placed over the top of the inner ends of the quartz strips and connected with adjusting screws 151 by means of which the vertical positions of the ends of the quartz strips may be adjusted. It is understood that in the showing of ",
      },
      figureGroup([4, 5], "Figures 4 and 5"),
      {
        kind: "text",
        text: ", the quartz strips are greatly exaggerated in thickness inasmuch as in practice such strips are very thin, approximating the thickness of a sheet of paper, and are cut with their thickness in the direction of the electric axis, their length in the direction of the axis of extension and their width along the optic axis of the crystal. The bottom sides of the strips 142 and 143 are connected by conductors 152 while the top plating on the strips is connected by conductors 153 connected with springs 154 at the top of the clamps 150.",
      },
    ),
    {
      kind: "paragraph",
      inlines: [
        { kind: "text", text: "Referring to " },
        figure(3),
        {
          kind: "text",
          text: ", the electrical apparatus for receiving the transmitted wave in the transmitter and correctly applying the light current and analyzing currents to the light rotator 125 and oscillographs 133 and 134 is as follows: 155 indicates a receiving antenna or other means for collecting wireless waves which antenna is connected through an inductance 156 to a ground indicated at 157. Inductance 156 forms a primary of a transformer in which the secondary 158 is in the grid circuit of a detector 159. 160 indicates a tuning condenser for bringing the receiver in resonance with the carrier wave of the transmitter. The plate 161 is indicated as connected to a plurality of filters, the first of which comprises the inductance 162, the voltage across which is applied to the grid of a second detector 164. The first filter comprising the inductance 162 should be in resonance with the first carrier wave developed in the transmitter of tube 159 thereof. There is thus imposed upon the grid of a detector tube 164 a current comprising the light current modulated upon the first carrier wave formed in the transmitter. In the detector 164, such carrier wave is detected to produce a current output from the plate 165, which is equivalent to the light current developed in the transmitter. In the second detector circuit 164, 166 indicates a condenser for passing the high frequency and blocking the low frequency currents, and 167 indicates a battery for supplying the plate potential. The plate 165 is indicated as connected with the coil 126 of the light rotator.",
        },
      ],
    },
    p(
      "The complete circuit of the detector tube 159 also includes a condenser 168 of a capacity suitable for by-passing the high frequency of the first carrier wave which is detected by the tube 164 and of a capacity to block the frequency of the analyzing currents. Such analyzing currents are therefrom passed through a choke 169 and line 170 to one of the oscillographs 133, connecting for example with the top platings of both of the quartz strips thereof, the bottom plating of the quartz strips of said oscillographs 133 being connected by a line 171 with a resistance 200 shunted across line 170, and line 201 which line connects with the opposite side of the condenser 168. By this connection, the oscillograph 133 is operated by the higher analyzing frequency, i. e., the 500 cycles per second frequency. Said frequency also passes through the grid leak 172 to a grid 174 of a detector tube 173 wherein said frequency is detected to deliver from its plate 175 a potential of the frequency of the first analyzing current, or 10 cycles per second. The plate 175 is indicated as connected by the line 176 to the resistance 202 which is connected by a tap 203 to the top plating of the oscillograph 134 and the bottom plating of the oscillograph 134 is indicated as connected by line 177 through the battery 178 to the filament 179 of the detector 173. The filament 179 is also connected by the lead 180 with the condenser 168. The resistance 200 and 202 provide a means for controlling the potential of the currents applied to the oscillographs.",
    ),
    p(
      "It will be readily apparent from the description of the apparatus and operation thereof, how the detected light current imposed upon the coil 126 modulates the light in accordance with the intensity of light at the particular point from which said light current originated from the light sensitive plate 6. It will also be seen that said light is projected upon the screen 136 by the oscillations of the oscillographs 133 and 134 to form a correct image of the object transmitted, the light being caused to travel back and forth across the screen similar to the action of the shutter 11 of the transmitter, making the example given 500 reciprocations across the screen in covering the complete area thereof, and said reciprocations are made within a period of 1/20th of a second. It is understood, however, that the process and apparatus of the present invention is not necessarily limited to the use of the particular frequencies given for the purpose of facilitating the description of a preferred process and apparatus.",
    ),
    p(
      "The process and apparatus of the present invention permit the selection of such small elementary areas of the image to be transmitted that the produced image on the screen 136 follows all of the light shades of the object, producing a correct image thereof. This is accomplished without the employment of mechanically moving parts, excepting the vibrating strips of the oscillographs. The apparatus is thus free from mechanical problems.",
    ),
    p(
      "While the process and apparatus for producing television herein described is well adapted for carrying out the objects of the present invention, it is understood that various modifications and changes may be made without departing from the invention, and the invention includes all such modifications and changes as come within the scope of the following appended claims.",
    ),
    { kind: "heading", level: 2, text: "Claims" },
    claim(
      1,
      "The method of television which includes forming an electrical image, and traversing each elementary area of the electrical image by an electric shutter at a velocity sufficient to cover the entire image within the optical period.",
    ),
    claim(
      2,
      "The process of television which comprises forming an electrical image, moving said electrical image in more than one direction by an analyzing potential, and varying the intensity of an electric current in accordance with the position of the electrical image.",
    ),
    claim(
      3,
      "The method of television which comprises focusing an image of an object upon the sensitive plate of a photo-electric cell, imposing a shutter in the path of the electrical discharge from said plate, and forming transverse to the electrical discharge two electrical potentials of different frequencies.",
    ),
    claim(
      4,
      "An apparatus for picture dissecting comprising a cell having a plate of photo sensitive material, an anode, a plurality of plates positioned between the photo sensitive plate and anode, and means for imposing upon said plates a plurality of electrical potentials of different frequencies.",
    ),
    claim(
      5,
      "An apparatus for dissecting an image comprising a cell having a photo sensitive plate, an anode, a shutter between the anode and plate, and electrical means for bending the electrical discharge from said plate.",
    ),
    claim(
      6,
      "The method of television which comprises forming an electrical discharge, which corresponds in cross section in electrical intensity to the light intensity of an image to be transmitted, transmitting successive portions of said electrical discharge, and modulating light thereby.",
    ),
    claim(
      7,
      "A method of television which comprises analyzing an image into elementary areas, producing a train of energy varying according to the intensity of light of said areas, all of the elementary areas being covered within the optical period, causing said train of energy to modulate a source of light of constant intensity according to the light of said areas, and correlating successive portions of said light to reform said image, said latter operation being completed within the optical period.",
    ),
    claim(
      8,
      "A method of television which comprises producing an electrical oscillation having a substantially straight line wave form, utilizing said electrical potential to analyze an image into elementary areas, producing a train of energy varying according to the intensity of light of said areas, and converting said train of energy into light varying according to the light of said areas.",
    ),
    claim(
      9,
      "A method of television which comprises producing an electrical oscillation having a substantially straight line wave form, utilizing said electrical potential to analyze an image into elementary areas, producing a train of energy varying according to the intensity of light of said areas, converting said train of energy into light varying according to the light of said areas, and utilizing said electrical potential of substantially straight line wave form to correlate successive portions of said light.",
    ),
    claim(
      10,
      "A method of television which comprises producing two electrical potentials of different frequencies, each of said electrical potentials having substantially straight line wave forms, causing said electrical potentials to analyze an image into elementary areas, producing a train of energy varying according to the intensity of light of said areas, and converting said train of energy into light varying according to the light of said areas.",
    ),
    claim(
      11,
      "A method of television which comprises producing two electrical potentials of different frequencies, each of said electrical potentials having substantially straight line wave forms, causing said electrical potentials to analyze an image into elementary areas, producing a train of energy varying according to the intensity of light of said areas, converting said train of energy into light varying according to the light of said areas, and causing said electrical potentials of different frequencies to correlate successive portions of said light to reform said image.",
    ),
    claim(
      12,
      "In a system of television, analyzing an image into elementary areas by causing a scanning device to scan all elements of said image successively at a substantially uniform velocity, over a continuous path reciprocating transversely of the image and the reciprocations having a slow motion transverse thereto.",
    ),
    claim(
      13,
      "A method of television which comprises forming an electrical image, moving the image in two directions over an electrical shutter having a small aperture, thus forming an electrical current which is a function of the intensity of the portion of the electrical image at said aperture.",
    ),
    claim(
      14,
      "A method of television which comprises forming an electrical image, impressing upon said image two electrical potentials of different frequencies, thereby causing said image to move in two directions respecting an electrical shutter and forming an electric current from the portion of the electrical image registered with the electrical shutter.",
    ),
    claim(
      15,
      "An apparatus for television which comprises means for forming an electrical image, and means for scanning each elementary area of the electrical image, and means for producing a train of electrical energy in accordance with the intensity of the elementary area of the electrical image being scanned.",
    ),
    claim(
      16,
      "An apparatus for television which comprises means for forming an electric image, means for moving said electric image in more than one direction by an analyzing potential, and means for varying the intensity of an electrical current in accordance with the position of the electrical image.",
    ),
    claim(
      17,
      "An apparatus for television which comprises means for focusing an image of an object upon the sensitive plate of a photo-electric cell, said photo-electric cell having an anode therein to receive an electrical discharge from said plate, said cell having a shutter in the path of the electrical discharge from the sensitive plate, said cell having plates positioned transverse to the electrical discharge, and means for imposing upon said plates electrical potentials of different frequencies.",
    ),
    claim(
      18,
      "An apparatus of the class described, including an oscillator, an oscillator of higher frequency operated by the oscillations from the first oscillator, thereby producing successive trains of oscillations during the positive cycle of oscillations of the first oscillator, a device for accumulating and discharging said oscillations thereby producing oscillations having substantially straight lined wave form, similar means producing an alternating potential of straight lined wave form and higher frequency, means for utilizing said potentials to scan an image in two directions, means for modulating the lower frequency upon the higher frequency, means for producing a train of energy varying in intensity in accordance with the area scanned, means for modulating a carrier wave with said train of energy and said scanning potentials, means for receiving and detecting said train of energy and said analyzing potentials, means for modulating the light in accordance with said analyzing potentials, and means for correlating said light to form an image actuated by said potentials having straight line wave forms.",
    ),
    p("Signed at San Francisco, California, this 21st day of December, 1926. PHILO T. FARNSWORTH."),
  ],
};

/** One authored, source-specific companion for each paragraph block. */
export const farnsworthTvParallelReadings: Readonly<Record<number, readonly string[]>> = {
  2: [
    "Defines television here as electrical, near-instant transmission of a remote scene or moving image. It is a scope-setting definition, not a claim that every later television implementation uses this particular transmitter and receiver.",
  ],
  3: [
    "Explains the optical-period requirement: every elementary area must be sampled and re-presented quickly enough for visual persistence to fuse the serial work into one picture.",
  ],
  4: [
    "Contrasts the proposed electrical scan with prior mechanisms that physically moved a dissecting part. The source says those systems produced at best a moving silhouette and did not meet the required synchronized speed.",
  ],
  5: [
    "States two objectives: full light shades in a moving electrical image, and conversion of the scene's shades to electricity followed by optical reconstruction. It introduces the method rather than asserting a modern CRT architecture.",
  ],
  6: [
    "The whole optical image falls on the photo-electric plate at once. Its local illumination produces a corresponding local density in the electron discharge, which the text calls an electrical image.",
  ],
  7: [
    "A fixed perforated shutter admits electrons from only one small source area at a time. Two differently timed plate potentials bend the image in two directions so the aperture samples the whole plate during the optical period.",
  ],
  8: [
    "The brightness signal and the two scanning potentials can ride on a wire or wireless carrier. The scan potentials are sent with the light current so the receiver can reproduce the transmitter's timing.",
  ],
  9: [
    "At reception, a constant light source is modulated by a polarizer and a device that rotates its polarization plane in response to the received light current.",
  ],
  10: [
    "The analyzer or screen turns polarization rotation into intensity variation, so the outgoing beam follows the transmitted light-current amplitude without a mechanical shutter.",
  ],
  11: [
    "Two oscillographs steer the reconstructed beam over the screen. Their motions are synchronized from the transmitted analyzing frequencies, recreating the spatial ordering of the sampled picture.",
  ],
  12: [
    "This is the source's figure key. It matters because the patent is a full transmitter-and-receiver system: optical cell, radio circuits, light rotator, oscillographs, waveforms, and scan geometry are all expressly identified.",
  ],
  13: [
    "Identifies the subject, illumination, and imaging lens. The source permits an actual scene, photograph, or projected motion-picture film; the lens forms the image on plate 6 of the photo-electric cell.",
  ],
  14: [
    "Describes the transmitting cell's physical layout: a flat, photo-sensitive mesh cathode, an anode at the opposite end, and a perforated metallic shutter near the anode.",
  ],
  15: [
    "Separates the page-seven vacuum requirement from the preceding plate geometry: the high evacuation permits a large cell potential without gas ionization.",
  ],
  16: [
    "Explains why the accelerating potential is high: emitted photoelectrons have small, color-dependent, randomly directed initial velocities. Reducing their transit time keeps lateral motion from blurring the electrical image.",
  ],
  17: [
    "Introduces oscillator 17 as the source of two high-frequency potentials and requires a substantially straight-lined waveform, because the disclosed system uses that form to illuminate the image uniformly.",
  ],
  18: [
    "Sets out the low-frequency oscillator in circuit detail: valve, bias, filament, plate, choke, inductance, and fixed and variable capacities are examples whose values are selected to obtain the desired resonance.",
  ],
  19: [
    "Describes the higher-frequency oscillator and coupling network. The source treats the listed tube, transformer, choke, capacities, leak, and bias as one illustrative resonant circuit rather than a unique required implementation.",
  ],
  20: [
    "Explains the waveform sequence shown in Figures 11 and 12: positive cycles of the lower-frequency oscillator permit equal-intensity trains in the higher-frequency oscillator, while negative intervals suppress them.",
  ],
  21: [
    "Routes the second oscillator through audion 48 and a resonant secondary to the photo-electric-cell plates 15 and 16, supplying one of the two analyzing potentials.",
  ],
  22: [
    "Explains the audion’s charge-and-leak action: grouped high-frequency trains become the substantially straight-line waveform shown in Figure 13 before reaching plates 15 and 16.",
  ],
  23: [
    "Describes the duplicate, faster path for plates 13 and 14. Its numbered components mirror the earlier audion circuit but its values create the higher analyzing frequency and modulate the lower-frequency signal upon it.",
  ],
  24: [
    "Sets the photo-electric cell’s biasing arrangement: a high battery potential limits transit blur, the high resistance develops an amplifiable light-current signal, and the shutter is held at anode potential without that signal path.",
  ],
  25: [
    "Gives the disclosed two-axis scan behavior: one plate pair provides the slow transverse movement while the other makes repeated passes, equivalent in result to a mechanically moved aperture but without moving the shutter.",
  ],
  26: [
    "Begins the radio transmitter section. Tube 72 both amplifies the light current and modulates tube 73’s first carrier, while the two analyzing potentials remain part of the transmitted system.",
  ],
  27: [
    "Describes the first carrier oscillator and its modulation path in component detail. Tube 72 senses the resistance-69 light potential and changes tube 73’s plate supply, turning the picture current into carrier modulation.",
  ],
  28: [
    "Explains why the transmitter uses chokes: one varies the oscillator supply with the amplified light current and the other prevents the carrier from feeding back into the amplifier. Tube 94 then drives a higher-frequency carrier.",
  ],
  29: [
    "Adds both the first modulated carrier and the analyzing potentials to the second carrier. The source then lists the second oscillator’s resonant components and antenna connection, completing the wireless transmitting path.",
  ],
  30: [
    "Begins the receiver’s optical chain: constant arc light is aperture-limited, polarized by a Nicol prism, collimated, and sent to a rotator controlled by the received light current.",
  ],
  31: [
    "Identifies the preferred light rotator: coil 126 makes a fluctuating magnetic field around an optically active medium. The printed example is carbon disulfide retained by glass plates in the coil core.",
  ],
  32: [
    "Describes the analyzer as opposed gratings around a bi-axial crystal. Small polarization rotations change the beam from extinction toward transmission, allowing a comparatively slow coil to modulate light.",
  ],
  33: [
    "Uses Figures 15–17 to trace the beam: aligned polarization is stopped by the second grating, while a small rotation changes refraction enough for the beam to pass between its lines.",
  ],
  34: [
    "Explains the source’s optical argument for the bi-axial crystal: unpolarized light appears as a circle, polarized light as a position-dependent point, and a 90-degree rotation moves that point across the circle.",
  ],
  35: [
    "Connects current-to-light conversion to spatial reconstruction. The optical analyzer turns coil-126 current into brightness, then two right-angle oscillographs place that brightness over screen 136 in transmitter synchronization.",
  ],
  36: [
    "Begins the mechanical description of each quartz oscillograph: a silvered quartz strip is mounted, held, and pressure-adjusted by plated horizontal quartz strips, guides, clamps, screws, and resilient rests.",
  ],
  37: [
    "Finishes the quartz-strip mounting detail: clamps and adjusting screws set the strip geometry, while the source notes their thin practical form and the conductor connections to their plated surfaces.",
  ],
  38: [
    "Traces reception from antenna through tuning, filtering, and two detection stages. The detected first carrier yields the original light-current equivalent and drives coil 126 of the optical light rotator.",
  ],
  39: [
    "Separates the received analyzing currents from the light-current path. One drives the higher-frequency oscillograph directly; a detector derives the lower frequency for the other, with resistances setting their applied potentials.",
  ],
  40: [
    "Ties the receiver back to the transmitter: coil 126 converts detected current to brightness, while two oscillographs scan that brightness across the screen in the same ordering as the electrical shutter scan.",
  ],
  41: [
    "Summarizes the displayed result: sufficiently small scanned areas can retain all light shades, while the only stated moving elements are the vibrating oscillograph strips rather than image-dissecting mechanisms.",
  ],
  42: [
    "The closing preservation clause says the illustrated process and apparatus may be modified without departing from the invention, subject to the following claims’ legal scope.",
  ],
  62: [
    "The formal execution identifies San Francisco and December 21, 1926. It is signed by Philo T. Farnsworth and is part of the printed source, not editorial metadata.",
  ],
};
