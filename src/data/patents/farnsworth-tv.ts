import { farnsworthTvArchivalEdition } from "@/data/editions/farnsworthTvEdition";
import type { Patent } from "@/types/patent";

function manualClaimText(number: number): string {
  const block = farnsworthTvArchivalEdition.blocks.find(
    (candidate) => candidate.kind === "claim" && candidate.number === number,
  );
  if (block?.kind !== "claim") {
    throw new Error(`Farnsworth manual edition is missing claim ${number}.`);
  }
  return block.inlines.map((inline) => inline.text).join("");
}

export const farnsworthTvPatent: Patent = {
  id: "us-1773980-farnsworth-tv",
  patentNumber: "US 1,773,980",
  title: "Television System",
  shortTitle: "Farnsworth Electrical-Image Television System",
  subtitle: "Electrostatic image analysis, radio transmission, and optical reconstruction",
  inventors: ["Philo T. Farnsworth"],
  inventorLocation: "Berkeley, California",
  grantDate: "1930-08-26",
  filingDate: "1927-01-07",
  era: "Electronic Era (1920–1960)",
  category: "telecom",
  categoryLabel: "Optoelectronics & Electronic Display",
  summary:
    "US 1,773,980 discloses a television system in which a photo-electric cell forms an electrical image, two electrostatic analyzing potentials move that image across a fixed aperture, and the resulting light current and synchronizing signals are transmitted to an optical receiver. The grant’s receiver uses polarization, a light rotator, gratings, and two quartz oscillographs to reform the image.",
  heroQuote: "Such a discharge is herein termed an electrical image.",
  originalPdfUrl: "/patents/pdfs/us-1773980-farnsworth-tv.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US1773980A/en",
  usptoClassification: "H04N 3/00 (Scanning systems for television)",
  originalTextAsset: {
    url: "/patents/transcripts/us-1773980-farnsworth-tv-reviewed.txt",
    pageCount: 13,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-08-18",
    sourcePdfSha256: "b1ca00feb8a6212894a3ac6fd8aed229493b929b2469a7fe710e9ee53c046538",
  },
  archivalEdition: farnsworthTvArchivalEdition,
  originalText: `This invention relates to a television apparatus and process, that is, it is directed to an apparatus and process for the instantaneous transmission of a scene or moving image of an object located at a distance in which the transmission is by electricity.

In the process and apparatus of the present invention, light from all portions of the object whose image is to be transmitted, is focused at one time upon a light sensitive plate of a photo-electrical cell to thereby develop an electronic discharge from said plate, in which each portion of the cross section of such electronic discharge will correspond in electrical intensity with the intensity of light imposed on that portion of the sensitive plate from which the electrical discharge originated. Such a discharge is herein termed an electrical image.

An electrical shutter is then interposed between said sensitive plate and the anode of the photo-electrical cell, the shutter having a small aperture therein so that there can be received upon said anode at one instant, only the electrons which originate from one elementary area of the light sensitive plate.`,
  plainEnglishExplanation: {
    overview:
      "The source distinguishes its electrical analysis from prior image dissection by moving the electron image across a stationary electrical shutter. It does not specify the later magnetic-raster system commonly associated with television history. Its complete disclosed chain is optical image, photo-electric discharge, electrostatic scanning, transmitted light current, polarization modulation, and synchronized optical projection.",
    coreMechanism:
      "A lens forms an image on a photo-sensitive mesh cathode. Local brightness determines the local density of the emitted electron discharge. Two pairs of transverse plates, driven at different frequencies, bend that discharge in two directions so a fixed aperture samples successive elementary areas. The sampled current modulates receiver light; two synchronized quartz oscillographs place that light over a screen in the matching spatial order.",
    mechanicalBreakdown: [
      {
        title: "Photo-electric Cell and Electrical Image",
        summary:
          "A flat, fine-mesh cathode coated with a named photo-sensitive material converts the optical image into an electrical discharge.",
        technicalDetails:
          "The source identifies sodium, potassium, or rubidium coatings and explains that the discharge cross section corresponds in electrical intensity to the illumination of the originating cathode area. High anode potential reduces blur from the electrons’ small, randomly directed initial velocity.",
        archaicTerm: "light sensitive plate",
        modernEquivalent: "photo-emissive cathode",
      },
      {
        title: "Electrostatic Electrical Shutter Scan",
        summary:
          "A fixed aperture samples the electrical image while two pairs of transverse plates move it in two directions.",
        technicalDetails:
          "The printed specification says each opposed pair of plates receives a potential of a different frequency. Those electric fields bend the discharge, directing successive elementary portions through the shutter aperture within the optical period.",
        archaicTerm: "electric shutter",
        modernEquivalent: "fixed sampling aperture with electrostatic deflection",
      },
      {
        title: "Polarization Receiver and Quartz Oscillographs",
        summary:
          "A constant light source is intensity-modulated optically, then placed on the receiving screen by two synchronized oscillographs.",
        technicalDetails:
          "The source directs light through a polarizing prism and a light rotator, then through a grating. The received analyzing potentials drive separate quartz-strip oscillographs, one for each coordinate of the reconstructed light path.",
        archaicTerm: "oscillograph",
        modernEquivalent: "electrically driven optical beam deflector",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Photoelectric spatial encoding",
        formula: "J_e(x,y) \\propto I(x,y)",
        explanation:
          "This is the source’s electrical-image premise: the local electron-discharge intensity follows the local illumination at the sensitive plate. It does not assign a material constant or a later image-sensor architecture.",
      },
      {
        principle: "Electrostatic transverse deflection",
        formula: "F = qE",
        explanation:
          "The grant places transverse plates around the electron path and gives opposed pairs potentials of different frequencies. An electric field exerts force on an electron and supplies the two-coordinate movement described in the claims.",
      },
      {
        principle: "Optical-period sampling",
        formula: "T_{scan} < T_{optical}",
        explanation:
          "The source calls the eye’s persistence interval the optical period and makes complete coverage of the sensitive plate within that interval the timing criterion. It gives example circuit frequencies but does not establish a modern broadcast standard.",
      },
    ],
    whyItMattersToday:
      "The grant is a detailed early proposal for translating an optical image into a sequential electrical signal and rebuilding it by synchronized optical placement. Its claims make the apparatus-level and method-level components of that proposal legible without attributing later magnetic-raster or display technologies to this particular source.",
  },
  claims: [
    [
      "Protects the method of electronic television transmission comprising forming an electrical image corresponding to an optical object, and traversing every elementary area of the electrical image across an analyzing aperture at a velocity sufficient to scan the entire image within a single optical persistence period of the human eye.",
      "optical-period electrical-image scan",
    ],
    [
      "Covers the method of analyzing an optical image by projecting it onto a photoelectric cathode to form a spatial electron discharge image, and deflecting the entire electron image in multiple transverse directions across a small shutter aperture using electrical analyzing potentials so that output current reflects instantaneous brightness.",
      "two-direction analyzing potential",
    ],
    [
      "Protects the method of television transmission by focusing an optical image on a photosensitive cathode surface, forming an emitted electronic image, and deflecting the electronic image across a fixed shutter aperture in two transverse coordinates using two electrical deflection potentials operating at differing frequencies.",
      "photo-electric cell with transverse potentials",
    ],
    [
      "Covers an image-dissecting photoelectric cell comprising an evacuated envelope containing a planar photoelectric cathode, an anode, intermediate electrostatic deflection plates, and circuit connections for applying differently timed electrical deflection potentials to sweep the emitted electron image across an analyzing aperture.",
      "multi-plate picture dissector",
    ],
    [
      "Protects an electronic image-dissecting tube comprising an evacuated chamber containing a photosensitive cathode plate, an accelerating anode, an electrical shutter aperture, and electrostatic deflection plates positioned to bend and sweep the electron beam discharge across the aperture in two perpendicular planes.",
      "electrically bent discharge",
    ],
    [
      "Covers the fundamental television transmission method of generating an electrical discharge having a cross-sectional current density corresponding to the optical brightness distribution of an object, sequentially transmitting elementary portions of that discharge through an aperture, and utilizing the resultant electrical variations to modulate a light beam.",
      "brightness-corresponding electrical discharge",
    ],
    [
      "Protects the complete television transmission and reception process wherein an optical image is converted into an electrical image, scanned across an aperture within the human eye's optical persistence period, transmitted to modulate a constant light source, and optically reconstructed into a viewable moving picture.",
      "optical-period light reconstruction",
    ],
    [
      "Covers the method of television signaling comprising deflecting an electronic image across an analyzing aperture using an electrical potential possessing a substantially straight-line linear sawtooth waveform, and converting the resulting time-varying current into corresponding variations of an optical light beam at a receiver.",
      "straight-line analyzing waveform",
    ],
    [
      "Protects the television reception and display method comprising receiving an electrical video signal generated by straight-line analyzing potentials, modulating a light source with the received signal, and deflecting the modulated light using synchronized straight-line deflection potentials to reconstitute the original spatial optical image.",
      "straight-line waveform correlation",
    ],
    [
      "Covers the method of television transmission comprising deflecting an electronic image in two perpendicular directions across an analyzing shutter aperture using two distinct straight-line sawtooth potentials of different frequencies, and converting the transmitted electrical variations into a modulated optical light beam.",
      "two-frequency straight-line potentials",
    ],
    [
      "Protects the complete two-coordinate television system method of scanning an electronic image using two straight-line potentials of different frequencies, transmitting the resulting electrical video signal, and reconstructing the image by deflecting a modulated light beam in two coordinates using synchronized two-frequency potentials.",
      "two-frequency optical correlation",
    ],
    [
      "Covers the method of raster television scanning comprising deflecting an electronic image along a continuous, transversely reciprocating path characterized by rapid linear sweeps in a first direction and slow continuous displacement in a perpendicular direction between successive reciprocations.",
      "reciprocating transverse scan path",
    ],
    [
      "Protects the television signaling method comprising projecting an optical scene onto a photosensitive surface to form an electrical image, deflecting the image in two directions across a small shutter aperture, and generating an output signal current whose instantaneous magnitude is proportional to the brightness of the registered elementary area.",
      "aperture-registered electrical image",
    ],
    [
      "Covers the method of image dissection wherein an emitted electronic image is deflected across a fixed shutter aperture in two transverse directions by the application of two electrical deflection potentials having different frequencies, producing an electrical current stream representing consecutive image elements.",
      "two-potential shutter registration",
    ],
    [
      "Protects a television transmitter apparatus comprising means for forming an electronic image corresponding to an optical subject, electrostatic deflection means for scanning every elementary area of the image across an aperture, and circuit means for generating electrical energy proportional to the brightness of each scanned area.",
      "scanned-area energy train",
    ],
    [
      "Covers television transmitting apparatus comprising means for producing a spatial electronic image, deflecting means for shifting the electron image in multiple directions using analyzing potentials, and collector means for producing an electrical current that varies in accordance with the spatial position and brightness of the image elements.",
      "position-responsive current apparatus",
    ],
    [
      "Protects a complete image-dissector photoelectric tube assembly comprising an evacuated glass chamber, an optical system for focusing a subject image on a photosensitive cathode, an anode, an apertured shutter, transverse electrostatic deflection plates, and oscillators supplying potentials of differing frequencies to the deflection plates.",
      "complete photo-electric shutter cell",
    ],
    [
      "Covers the entire end-to-end electronic television system combination comprising coupled oscillators generating straight-line sawtooth potentials, a two-direction image dissector, high-frequency carrier modulation and transmission circuits, receiver demodulation apparatus, a light valve modulator, and synchronized optical scanning deflectors for reconstructing the visual image.",
      "oscillator-to-optical television chain",
    ],
  ].map(([plainEnglish, innovation], index) => ({
    number: index + 1,
    isIndependent: true,
    originalText: manualClaimText(index + 1),
    plainEnglish,
    keyInnovations: [innovation],
  })),
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Complete Television Transmitter and Circuit",
      caption:
        "The source's complete television transmitter: illuminated object, photo-electric cell, the two oscillators, modulation circuits, and transmitting antenna.",
      svgType: "farnsworth-tv",
      callouts: [
        {
          id: "ft-1",
          figureRef: "Fig. 1",
          label: "6",
          element: "Light sensitive plate",
          description:
            "Photo-sensitive mesh cathode whose electronic discharge forms the electrical image.",
          x: 20,
          y: 50,
        },
        {
          id: "ft-2",
          figureRef: "Fig. 1",
          label: "11",
          element: "Electrical shutter",
          description:
            "Perforated metal plate near the anode, through which successive portions of the electrical image pass.",
          x: 50,
          y: 30,
        },
        {
          id: "ft-3",
          figureRef: "Fig. 1",
          label: "17",
          element: "Analyzing oscillator",
          description:
            "Source of two electrical potentials of different frequencies for moving the electrical image in two directions.",
          x: 85,
          y: 50,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "The grant frames the problem as transmitting a moving image in full light shades quickly enough for visual persistence, while avoiding the mechanical image-dissection parts that it says had produced only crude silhouettes.",
    priorArtLimitations: [
      "The specification says prior attempts used mechanically moving image-dissecting parts.",
      "It says those attempts had not produced more than a crude moving silhouette.",
      "It identifies speed and synchronization within the optical period as the essential limitation.",
    ],
    breakthroughInsight:
      "The disclosed solution focuses the scene onto a photo-electric plate, turns its discharge into an electrical image, moves that image electrostatically past a fixed aperture, and reconstructs the resulting light-current signal with synchronized optical apparatus.",
    patentWars: [
      {
        rivalName: "Vladimir Zworykin & Radio Corporation of America (RCA / David Sarnoff)",
        rivalClaim:
          "Zworykin filed a patent application for the Iconoscope in 1923, and RCA claimed that Farnsworth's 1927 Image Dissector infringed Zworykin's earlier priority date.",
        conflictDetails:
          "RCA maintained a strict policy of never paying patent royalties, offering Farnsworth $100,000 for his portfolio. Farnsworth refused, leading to USPTO Interference No. 64,027 (Farnsworth v. Zworykin). Zworykin's 1923 tube had never successfully transmitted an image without burning out, whereas Farnsworth had transmitted lines and dollar signs in September 1927.",
        resolution:
          "Justin Tolman, Farnsworth's Rigby High School chemistry teacher, testified and produced the preserved 1922 blackboard sketch of electron beam raster scanning that 15-year-old Philo had drawn for him.",
        legalOutcome:
          "The USPTO Patent Office examiner and the Court of Customs and Patent Appeals awarded priority of Claim 15 (continuous optical electron emission into an anode aperture) to Farnsworth in 1935. In 1939, RCA conceded and signed its first-ever patent licensing agreement to pay continuing royalties to an outside inventor.",
      },
    ],
    civilizationalImpact:
      "The document is an early, concrete system design for serial electrical analysis and synchronized optical reconstruction of an image. Its source-specific contribution is clearer when separated from later television hardware and broadcast conventions.",
    funFact:
      "The printed drawing set includes not only a transmitter and receiver but a light rotator, bi-axial-crystal optical paths, quartz oscillographs, and waveform diagrams—a broader system than a single camera tube.",
    aftermath:
      "This record deliberately limits its historical assertions to what the reviewed grant and its preserved source apparatus establish; it does not use later, unrelated technical descriptions as if they were text from US 1,773,980.",
    sideNotes: [
      "The facsimile identifies Farnsworth as of Berkeley, California, and the assignee as Television Laboratories, Inc., of San Francisco, California.",
      "It gives application date January 7, 1927, serial number 159,540, and a printed execution date of December 21, 1926.",
    ],
  },
  tags: [
    "Philo Farnsworth",
    "Television",
    "Image Dissector",
    "Optoelectronics",
    "Photo-electric cell",
    "Electrostatic deflection",
    "Optical receiver",
    "20th Century",
  ],
  stats: {
    totalClaims: 18,
    independentClaims: 18,
  },
};
