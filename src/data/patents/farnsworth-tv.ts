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
      "Requires an electrical image and a shutter traversal fast enough to cover its elementary areas within the optical period.",
      "optical-period electrical-image scan",
    ],
    [
      "Covers moving the electrical image in more than one direction by analyzing potentials and making current intensity depend on its position.",
      "two-direction analyzing potential",
    ],
    [
      "Specifies the optical image, photo-electric sensitive plate, shutter, and two transverse potentials of different frequencies as one method.",
      "photo-electric cell with transverse potentials",
    ],
    [
      "Claims the cell apparatus: photo-sensitive plate, anode, intermediate plates, and differently timed potentials imposed on those plates.",
      "multi-plate picture dissector",
    ],
    [
      "Claims the image-dissecting cell with photo-sensitive plate, anode, shutter, and electrical bending of its discharge.",
      "electrically bent discharge",
    ],
    [
      "Defines a method in which a cross-sectionally brightness-corresponding discharge is successively transmitted and used to modulate light.",
      "brightness-corresponding electrical discharge",
    ],
    [
      "Claims full optical-period analysis and reconstruction: variable energy modulates constant light and correlated portions reform the image.",
      "optical-period light reconstruction",
    ],
    [
      "Requires a substantially straight-line electrical oscillation for analysis and conversion of the resulting varying energy back to light.",
      "straight-line analyzing waveform",
    ],
    [
      "Adds use of the straight-line potential at reception to correlate the successive light portions after the analysis and conversion steps.",
      "straight-line waveform correlation",
    ],
    [
      "Requires two differently frequent, substantially straight-line potentials for analysis, followed by energy production and conversion to varying light.",
      "two-frequency straight-line potentials",
    ],
    [
      "Extends claim 10’s two potentials to correlation of the light portions so that the image is reformed.",
      "two-frequency optical correlation",
    ],
    [
      "Claims a continuous, transversely reciprocating scan path: rapid coverage along the path and slow transverse displacement between reciprocations.",
      "reciprocating transverse scan path",
    ],
    [
      "Claims movement of an electrical image in two directions over a small shutter aperture so the output current is a function of the registered area.",
      "aperture-registered electrical image",
    ],
    [
      "Requires two differently frequent potentials to move the electrical image across the shutter and form current from the registered portion.",
      "two-potential shutter registration",
    ],
    [
      "Claims television apparatus that forms an electrical image, scans every elementary area, and produces energy according to the scanned area’s intensity.",
      "scanned-area energy train",
    ],
    [
      "Claims apparatus that moves an electric image in more than one direction with an analyzing potential and varies current by image position.",
      "position-responsive current apparatus",
    ],
    [
      "Claims the photo-electric-cell assembly in detail: focused object image, anode, shutter, transverse plates, and differently frequent potentials.",
      "complete photo-electric shutter cell",
    ],
    [
      "Claims the long system combination: coupled oscillators and straight-line potentials, two-direction scan, carrier modulation and reception, light modulation, and image correlation.",
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
    patentWars: [],
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
