import type { Patent } from "@/types/patent";

export const farnsworthTvPatent: Patent = {
  id: "us-1773980-farnsworth-tv",
  patentNumber: "US 1,773,980",
  title: "Television System",
  shortTitle: "Farnsworth Electronic Television",
  subtitle:
    "All-Electronic Image Dissector Video Transmission and Cathode Ray Beam Raster Scanning",
  inventors: ["Philo Taylor Farnsworth"],
  inventorLocation: "San Francisco, California",
  grantDate: "1930-08-26",
  filingDate: "1927-01-07",
  era: "Electronic Broadcast (1925–1935)",
  category: "telecom",
  categoryLabel: "Television & Video Systems",
  summary:
    "The pioneer patent of all-electronic television. At the age of 21, Philo T. Farnsworth replaced the spinning mechanical Nipkow disks of early TV experiments with pure electron optics. His 'Image Dissector' focused an optical image onto a photoelectric cathode, liberating an electron cloud that was deflected magnetically line-by-line across a tiny anode aperture to generate a video signal, which was reconstructed on a cathode-ray tube screen.",
  heroQuote:
    "Be it known that I, Philo T. Farnsworth, a citizen of the United States, residing at San Francisco, in the county of San Francisco and State of California, have invented certain new and useful Improvements in Television Systems...",
  originalPdfUrl: "/patents/pdfs/us-1773980-farnsworth-tv.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US1773980A/en",
  usptoClassification: "H04N 3/00 (Scanning details for electronic television)",
  originalText: `UNITED STATES PATENT OFFICE.
PHILO T. FARNSWORTH, OF SAN FRANCISCO, CALIFORNIA.

TELEVISION SYSTEM.

Application filed January 7, 1927. Serial No. 159,540.

To all whom it may concern:
Be it known that I, PHILO T. FARNSWORTH, a citizen of the United States, residing at San Francisco, in the county of San Francisco and State of California, have invented certain new and useful Improvements in Television Systems, of which the following is a specification.

My invention relates to television systems and apparatus, and more particularly to systems wherein an electrical image of the object to be transmitted is formed and an electron stream is produced, the density of which corresponds at any point to the intensity of light at the corresponding point of the original object...

Heretofore in television systems it has been customary to employ mechanical scanning devices, such as rotating discs provided with spirally arranged apertures or rotating mirrors, for dissecting the image into a sequence of elemental areas. Such mechanical devices are subject to severe limitations as to speed, resolution, and synchronization...

In accordance with my invention, the mechanical scanning devices are entirely eliminated, and the image is dissected electronically by producing an electrical image on a photoelectric surface, forming an electron stream corresponding to the image, and deflecting the electron stream magnetically past an aperture to produce an electric current varying with the intensity of the light in the elemental areas of the optical image...`,
  plainEnglishExplanation: {
    overview:
      "In the 1920s, television pioneers like John Logie Baird and Charles Francis Jenkins used mechanical television systems based on spinning metal discs with spiral holes (Nipkow discs). These mechanical TVs were noisy, prone to catastrophic vibration, could barely project 30 to 60 blurry lines of resolution at 10 frames per second, and required blinding studio spotlights. Philo Farnsworth realized that glass and mechanical metal discs were far too slow—only the nearly weightless electron could move fast enough to scan hundreds of lines per second.",
    coreMechanism:
      "Farnsworth's 'Image Dissector' tube projected an optical scene through glass onto a flat photoelectric cathode coated with cesium oxide, which emitted electrons in direct proportion to the incoming light intensity. This created an invisible, floating 'electron image' in vacuum. Electromagnetic coils placed around the tube created rapid horizontal and vertical magnetic fields, sweeping the entire electron image back and forth across a tiny target aperture. As different parts of the electron cloud passed through the pinhole, the anode collected a varying electronic current representing the brightness of each pixel in sequence, which was amplified and transmitted over radio waves.",
    mechanicalBreakdown: [
      {
        title: "Photoelectric Image Cathode",
        summary: "A continuous photo-emissive plate emitting electrons proportional to photons.",
        technicalDetails:
          "Utilized the photoelectric effect ($E_k = h\\nu - \\Phi$). A focused optical image knocked photoelectrons off the cesium-coated plate, creating a spatial current density distribution $j(x,y) \\propto I_{light}(x,y)$ in vacuum.",
        archaicTerm: "Photoelectric surface emitting an electrical image",
        modernEquivalent: "Photoelectric image sensor / photocathode",
      },
      {
        title: "Electromagnetic Deflection Coils (Raster Sweep)",
        summary: "Horizontal and vertical magnetic coils steering the electron stream.",
        technicalDetails:
          "Sawtooth current waveforms ($I_x(t) = I_0 \\text{saw}(\\omega_h t)$, $I_y(t) = I_0 \\text{saw}(\\omega_v t)$) flowing through orthogonal deflection coils generated dynamic Lorentz forces ($\\vec{F} = q(\\vec{E} + \\vec{v} \\times \\vec{B})$), deflecting the entire electron cloud in a standard progressive raster scan pattern across the aperture.",
        archaicTerm: "Magnetic deflection means for sweeping the electron stream",
        modernEquivalent: "Magnetic deflection yoke / raster scanning circuitry",
      },
      {
        title: "Target Anode & Video Signal Generation",
        summary: "A shielded pinhole aperture collecting electron current line by line.",
        technicalDetails:
          "The current entering the aperture $i(t) = \\iint j(x(t), y(t)) \\, dx\\,dy$ became the analog composite video luminance signal, ready for RF modulation.",
        archaicTerm: "Apertured anode collector",
        modernEquivalent: "Electron collector / video signal pre-amplifier",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Photoelectric Effect & Electron Optics",
        formula: "I_{photo}(x,y) = \\eta \\cdot \\frac{e}{h\\nu} \\cdot P_{opt}(x,y)",
        explanation:
          "Incoming light power P(x,y) at frequency \\nu strikes the photocathode, releasing photoelectrons with quantum efficiency \\eta, converting visual spatial images into free-flight electron clouds.",
      },
      {
        principle: "Lorentz Force Electron Deflection",
        formula: "\\vec{F} = q \\cdot (\\vec{v} \\times \\vec{B}) \\implies r = \\frac{m_e v}{q B}",
        explanation:
          "Magnetic fields applied perpendicular to the electron velocity vector bend electron trajectories with radius r, steering the electron image across the sensing aperture without moving parts.",
      },
    ],
    whyItMattersToday:
      "Farnsworth's invention established the raster-scan architecture that defined 20th-century television broadcasts (NTSC, PAL, SECAM) and directly pioneered modern video displays, CRT monitors, and early electronic imaging sensors.",
  },
  claims: [
    {
      number: 15,
      isIndependent: true,
      originalText:
        "The method of television transmission which comprises forming an electrical image of the object to be transmitted, forming an electron stream corresponding to said image, and deflecting said stream to scan an aperture, thereby producing a current varying with the light intensity of the elemental areas of the image, substantially as described.",
      plainEnglish:
        "Claim 15 is the decisive master claim protecting all-electronic image scanning via electron beam deflection past an aperture.",
      keyInnovations: [
        "Electronic raster scanning",
        "Electron stream deflection",
        "Aperture dissection",
      ],
      legalSignificance:
        "Claim 15 was the central focus of Patent Interference No. 64,027 (Farnsworth v. Zworykin / RCA). Farnsworth won because his high school chemistry teacher produced a sketch Farnsworth drew on a blackboard in 1922 at age 15!",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Schematic Diagram of Image Dissector and Deflection Circuit",
      caption:
        "Drawing of the evacuated cylindrical Image Dissector tube surrounded by magnetic focusing and deflection coils.",
      svgType: "farnsworth-tv",
      callouts: [
        {
          id: "ftv-1",
          figureRef: "Fig. 1",
          label: "1",
          element: "Evacuated Glass Tube",
          description: "Cylindrical high-vacuum envelope housing the electron optics.",
          x: 48,
          y: 50,
        },
        {
          id: "ftv-2",
          figureRef: "Fig. 1",
          label: "2",
          element: "Photocathode Plate",
          description: "Cesium-coated metal surface emitting electron image when illuminated.",
          x: 18,
          y: 50,
        },
        {
          id: "ftv-3",
          figureRef: "Fig. 1",
          label: "11",
          element: "Anode Aperture Finger",
          description: "Shielded cup containing a tiny pinhole collecting electron current.",
          x: 82,
          y: 50,
        },
        {
          id: "ftv-4",
          figureRef: "Fig. 1",
          label: "8, 9",
          element: "Deflection Coils",
          description: "Horizontal and vertical magnetic sweep coils wrapped around the exterior.",
          x: 52,
          y: 28,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "In the 1920s, mechanical television systems could not transmit more than 60 lines of resolution due to the physical inertia and vibration of spinning metal discs, rendering TV unwatchable and commercial broadcasting impossible.",
    priorArtLimitations: [
      "Paul Nipkow (1884) patented the mechanical scanning disc, which suffered from optical blur and physical speed limits.",
      "John Logie Baird demonstrated 30-line mechanical television in London, but images were tiny (1x2 inches), dim, and flickered severely.",
      "Vladimir Zworykin at Westinghouse and RCA had filed for an iconoscope in 1923, but could not produce a working electronic transmission model.",
    ],
    breakthroughInsight:
      "At age 14, while plowing a potato field in Idaho back and forth in parallel rows, young Philo Farnsworth realized that an electron beam could be steered magnetically in back-and-forth lines across a screen just like plowing a field—conceiving the raster scan.",
    patentWars: [
      {
        rivalName: "David Sarnoff & RCA (Radio Corporation of America)",
        rivalClaim:
          "RCA dominated radio broadcasting and tried to claim that Vladimir Zworykin’s 1923 patent application had priority over Farnsworth's electronic television.",
        conflictDetails:
          "David Sarnoff had a strict corporate policy: 'RCA doesn't pay royalties; we collect them.' RCA spent millions of dollars in aggressive patent litigation to break Farnsworth and take over electronic television.",
        resolution:
          "In 1935, the US Patent Office granted priority to Farnsworth on Claim 15. In 1939, after losing on all appeals, RCA was forced to sign a historic patent license agreement with Farnsworth—the first time in RCA history it ever agreed to pay continuing patent royalties to an outside inventor.",
        legalOutcome:
          "Farnsworth was legally recognized as the true inventor of electronic television.",
      },
    ],
    civilizationalImpact:
      "Farnsworth's electronic television sparked the global video revolution, fundamentally transforming news, entertainment, culture, politics, space exploration, and personal computing displays.",
    funFact:
      "When Farnsworth demonstrated the first all-electronic television transmission in his San Francisco lab on September 7, 1927, the image transmitted was a single straight horizontal line painted on a glass slide. Farnsworth turned to his colleagues and said: 'There you are—electronic television!'",
  },
  tags: ["Television", "Philo Farnsworth", "Electronics", "Cathode Ray", "RCA", "Broadcasting"],
  stats: {
    totalClaims: 24,
    independentClaims: 4,
    patentWarYears: "1930–1939",
    impactScore: 98,
  },
};
