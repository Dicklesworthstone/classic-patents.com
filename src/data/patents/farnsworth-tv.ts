import type { Patent } from "@/types/patent";

export const farnsworthTvPatent: Patent = {
  id: "us-1773980-farnsworth-tv",
  patentNumber: "US 1,773,980",
  title: "Television System",
  shortTitle: "Farnsworth Electronic Television & Image Dissector",
  subtitle: "All-Electronic Television, Continuous Photo-Cathode, and Magnetic Raster Scanning",
  inventors: ["Philo T. Farnsworth"],
  inventorLocation: "San Francisco, California",
  grantDate: "1930-08-26",
  filingDate: "1927-01-07",
  era: "Electronic Era (1920–1960)",
  category: "telecom",
  categoryLabel: "Optoelectronics & Electronic Display",
  summary:
    "Farnsworth's 1930 image dissector: a photoemissive plate, a magnetic raster, and a pinhole anode. No Nipkow disk. He conceived it at 14, looking at a plowed Idaho field, and reduced it to practice in a San Francisco loft in 1927.",
  heroQuote:
    "My invention relates to television systems and has for its primary object the provision of a system of television in which the scanning of the image is accomplished entirely electronically without the use of any mechanically moving parts...",
  originalPdfUrl: "/patents/pdfs/us-1773980-farnsworth-tv.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US1773980A/en",
  usptoClassification: "H04N 3/00 (Scanning systems for television)",
  originalText: `UNITED STATES PATENT OFFICE.
PHILO T. FARNSWORTH, OF SAN FRANCISCO, CALIFORNIA, ASSIGNOR TO TELEVISION LABORATORIES, INC.

TELEVISION SYSTEM.

Application filed January 7, 1927. Serial No. 159,639. Patent No. 1,773,980. Patented Aug. 26, 1930.

To all whom it may concern:
Be it known that I, PHILO T. FARNSWORTH, a citizen of the United States, residing at San Francisco, in the county of San Francisco and State of California, have invented certain new and useful Improvements in Television Systems, of which the following is a specification.

My invention relates to television systems and has for its primary object the provision of a system of television in which the scanning of the object or image is accomplished entirely electronically, without the use of any mechanically moving parts such as rotating disks, mirrors, or prisms.

A further object of my invention is to provide an improved television transmitting tube (the Image Dissector) wherein an optical image of the scene to be transmitted is focused upon a continuous photoelectric surface (a cold photo-cathode) to liberate an electrical charge image or electron stream corresponding in cross-sectional density to the optical light values of the image.

The electron stream as a whole is accelerated toward an anode target at the opposite end of the tube by an electrostatic field, and is focused by a longitudinal magnetic focusing coil so that the cross-sectional distribution of electrons is maintained intact.

A pair of orthogonal magnetic deflection coils energized by sawtooth currents is disposed around the tube to deflect the entire electron image horizontally and vertically across a tiny fixed scanning aperture in the anode target.

As the electron image is swept back and forth across the aperture in a raster pattern of parallel lines, the number of electrons entering the aperture at any instant is directly proportional to the brightness of that elementary pixel area of the original optical scene, producing a continuous electrical video signal.

Referring to the drawings:
Figure 1 is a schematic diagram of the complete television transmitter and receiver system.
Figure 2 is a longitudinal sectional view of the Image Dissector camera tube.
Figure 3 is a diagram of the magnetic deflection coils and sawtooth sweep generators.
Figure 4 is a diagram illustrating the electronic raster scan pattern.
Figure 5 is a sectional view of the target anode and scanning aperture.`,
  plainEnglishExplanation: {
    overview:
      "In the 1920s, television pioneers like John Logie Baird and Charles Francis Jenkins used mechanical spinning wheels with spiraled holes (Nipkow disks) or revolving mirrors. These mechanical systems were bulky, noisy, and could produce only blurry, low-resolution images (30 to 60 lines) that flickered violently. At age 14, while plowing a potato field in Idaho, Philo Farnsworth realized that an electron beam—moving at thousands of miles per second without mechanical inertia—could scan back and forth across an image line-by-line just like plowing furrows in a field, making high-definition electronic television possible.",
    coreMechanism:
      "Lenses focus an optical image onto a silver-cesium cold photoelectric plate at the front of a vacuum tube, knocking loose millions of electrons in exact proportion to the brightness of each point in the image. High voltage pulls this full electron cloud toward the back of the tube. Two pairs of electromagnetic coils create shifting magnetic fields that sweep the entire electron cloud back and forth across a microscopic pinhole aperture in a rapid raster pattern. The electrons passing through the pinhole form a continuous video signal that is amplified and transmitted over radio waves to a cathode ray tube (CRT) display screen.",
    mechanicalBreakdown: [
      {
        title: "Continuous Photo-Cathode Plate",
        summary: "A flat silver-cesium plate that converts photons into a free electron cloud.",
        technicalDetails:
          "Operates via the photoelectric effect ($E_{kinetic} = h\\nu - \\Phi$). Brighter parts of the image liberate higher current densities $J(x,y)$, creating a true 2D electron image in the vacuum.",
        archaicTerm: "Continuous photoelectric surface",
        modernEquivalent: "Photoelectric image sensor / Photo-cathode",
      },
      {
        title: "Orthogonal Magnetic Deflection Coils",
        summary: "Electromagnetic coils sweeping the electron image in a 2D sawtooth raster.",
        technicalDetails:
          "Horizontal coils produce a high-frequency linear sweep ($15.75\\text{ kHz}$ for NTSC); vertical coils produce a $60\\text{ Hz}$ frame sweep. Lorentz forces ($\\vec{F} = q \\vec{v} \\times \\vec{B}$) deflect the electron stream with zero mechanical inertia.",
        archaicTerm: "Deflecting coils energized by alternating currents",
        modernEquivalent: "Magnetic deflection yoke / Raster generator",
      },
      {
        title: "Target Anode & Scanning Aperture",
        summary: "A metal shield with a microscopic pinhole aperture.",
        technicalDetails:
          "Isolates a single pixel area of the electron image at a time, converting spatial image brightness $I(x,y)$ into a time-varying video current $i(t)$.",
        archaicTerm: "Target with scanning aperture",
        modernEquivalent: "Aperture pixel sampler / Electron multiplier",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Einstein Photoelectric Current Generation",
        formula: "J(x,y) = \\eta \\cdot \\frac{e}{h\\nu} I_{optical}(x,y)",
        explanation:
          "The spatial current density of emitted electrons is linearly proportional to the optical irradiance of the image focused upon the photo-cathode.",
      },
      {
        principle: "Lorentz Force Magnetic Beam Deflection",
        formula:
          "\\vec{F} = q (\\vec{E} + \\vec{v} \\times \\vec{B}), \\quad r_{gyro} = \\frac{m v_\\perp}{q B}",
        explanation:
          "Orthogonal magnetic fields steer the high-velocity electron stream across the scanning aperture at relativistic speeds with zero moving parts.",
      },
    ],
    whyItMattersToday:
      "Every camera still reads a scene as a time-series of lines. CMOS pixels replaced the dissector plate; the raster idea did not. CRTs are gone from living rooms, not from the sampling theorem that made them, and LCDs, work.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "The method of television transmission which consists in forming an electrical image of the object to be transmitted, and scanning said electrical image across an aperture to produce a television signal, substantially as described.",
      plainEnglish:
        "The historic master claim covering the method of all-electronic television: forming an electron image in a vacuum and scanning it electronically across an aperture.",
      keyInnovations: [
        "All-electronic television transmission",
        "Electron image formation",
        "Electronic raster scanning across an aperture",
      ],
    },
    {
      number: 15,
      isIndependent: true,
      originalText:
        "An image dissector tube comprising a photo-electric cathode, an anode, means for accelerating an electron stream from said cathode toward said anode, and magnetic deflection coils for deflecting said electron stream across an aperture in said anode, substantially as described.",
      plainEnglish:
        "Apparatus claim covering the Image Dissector tube containing photo-cathode, accelerating field, and magnetic deflection coils.",
      keyInnovations: [
        "Image Dissector vacuum tube",
        "Magnetic deflection yoke integration",
        "Cold cathode electron optics",
      ],
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 2",
      title: "Farnsworth Image Dissector Camera Tube",
      caption:
        "Longitudinal section showing photo-cathode plate, cylindrical vacuum envelope, magnetic deflection coils, and target anode aperture.",
      svgType: "farnsworth-tv",
      callouts: [
        {
          id: "ft-1",
          figureRef: "Fig. 2",
          label: "1",
          element: "Continuous Photo-Cathode",
          description: "Silver-cesium plate emitting electrons in proportion to light intensity.",
          x: 20,
          y: 50,
        },
        {
          id: "ft-2",
          figureRef: "Fig. 2",
          label: "2",
          element: "Orthogonal Magnetic Deflection Coils",
          description:
            "Electromagnetic coils sweeping the electron beam horizontally and vertically.",
          x: 50,
          y: 30,
        },
        {
          id: "ft-3",
          figureRef: "Fig. 2",
          label: "3",
          element: "Scanning Aperture & Anode",
          description:
            "Fixed pinhole aperture sampling pixels to output a continuous analog video signal.",
          x: 85,
          y: 50,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "Baird and Jenkins television of the mid-1920s was a spinning Nipkow disk, 30 to 60 holes, a lamp, and a lot of flicker. Mechanical inertia set the line count. You could not spin a disk fast enough for a picture a newsreel audience would sit through.",
    priorArtLimitations: [
      "Nipkow disks were dim, noisy, and limited to tens of lines.",
      "Mirror drums drifted out of sync and shattered.",
      "Zworykin's early iconoscope work at Westinghouse was real but not yet a closed electronic camera-plus-receiver system in public.",
    ],
    breakthroughInsight:
      "Age 14, Rigby, Idaho, 1921: a plowed field looked like a scan. Electrons have no flywheel. Farnsworth told Justin Tolman, his chemistry teacher; Tolman kept a 1922 blackboard sketch that later won an interference.",
    patentWars: [
      {
        rivalName: "David Sarnoff, Vladimir Zworykin, and RCA",
        rivalClaim:
          "RCA argued Zworykin's iconoscope and the 1923 filing predated Farnsworth's reduction to practice.",
        conflictDetails:
          "Interference No. 64,027. Tolman's sketch and testimony dated conception to 1922. The Patent Office awarded the electronic-scanning claims to Farnsworth in 1934. Sarnoff, who preferred not to pay outsiders, had to write a royalty check.",
        resolution:
          "RCA licensed Farnsworth. Commercial US television still waited on the 1941 NTSC standard and the war. Farnsworth's company never became the RCA of cameras.",
        legalOutcome:
          "Farnsworth kept the dissector/scanning claims. Zworykin kept a storage-target camera that was more sensitive in studio light. Both tubes are ancestors; the living-room set was a standards fight.",
      },
    ],
    civilizationalImpact:
      "Once the scanner had no moving parts, line counts could rise with electronics instead of rpm. News, advertising, and national politics moved onto a raster.",
    funFact:
      "7 September 1927, 202 Green Street, San Francisco: the first image was a straight line. Pem Farnsworth was in the room. The dollar sign they later joked about scanning was a lab gag, not the first transmission.",
    aftermath:
      "Farnsworth sold to ITT, fought depression and drink, and lived to see the 1969 moon walk on a set that owed him a license. He told his wife that this, at least, made the whole fight worth it.",
    sideNotes: [
      "The image dissector has no charge-storage target, so it needs a lot of light. Studio cameras went to iconoscopes and then orthicons for that reason. The patent is the electronic scan, not the most sensitive photocathode.",
      "Farnsworth was 20 when he filed. Investors had backed a high-school idea with cash. That is rarer than the plow story.",
    ],
  },
};
