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
    "The genesis of modern electronic video: 20-year-old Philo Farnsworth's invention of the all-electronic television system, replacing clunky mechanical spinning Nipkow disks with a cold-cathode Image Dissector tube, orthogonal magnetic deflection coils, and electronic raster scanning.",
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
      "Farnsworth's all-electronic raster scanning is the foundational technology behind modern television, computer monitors, video cameras, digital image processing, and CRT/LCD/OLED display technology.",
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
      "Mechanical television systems were fundamentally bottlenecked by mechanical inertia: spinning metal disks could not spin fast enough to deliver flicker-free high-definition video.",
    priorArtLimitations: [
      "Nipkow spinning disks (30–60 lines) were dim, blurry, and mechanically noisy.",
      "Mechanical mirror drums were fragile and went out of calibration constantly.",
    ],
    breakthroughInsight:
      "In 1921 at age 14 in Rigby, Idaho, Farnsworth looked at the parallel furrows left behind by his horse-drawn plow and realized electrons could scan an image line-by-line without any moving parts.",
    patentWars: [
      {
        rivalName: "David Sarnoff, Vladimir Zworykin & Radio Corporation of America (RCA)",
        rivalClaim:
          "RCA and Zworykin filed for an electronic television patent and spent millions trying to prove Zworykin invented electronic television before Farnsworth.",
        conflictDetails:
          "The US Patent Office instituted Patent Interference No. 64,027. Farnsworth's high school chemistry teacher, Justin Tolman, produced a sketch Farnsworth drew on the blackboard in 1922 proving prior conception.",
        resolution:
          "The Patent Office and federal courts ruled completely in Farnsworth's favor in 1934.",
        legalOutcome:
          "RCA was forced to capitulate and pay Farnsworth patent royalties (a first for RCA).",
      },
    ],
    civilizationalImpact:
      "Created the medium of television and electronic visual communication, fundamentally reshaping global culture, politics, news, entertainment, and visual media.",
    funFact:
      "Farnsworth transmitted the first all-electronic television image in history on September 7, 1927 in his laboratory at 202 Green Street, San Francisco: a simple glowing straight line.",
  },
};
