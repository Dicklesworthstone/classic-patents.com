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
    "The Birth of All-Electronic Television: On January 7, 1927, twenty-year-old Utah inventor Philo T. Farnsworth filed US Patent No. 1,773,980 for the world's first all-electronic television system. Conceived at age 14 while plowing back-and-forth parallel furrows in a potato field in Idaho, Farnsworth replaced clumsy mechanical spinning Nipkow disks with an inertialess electron beam. By focusing an optical image onto a continuous cesium photocathode and deflecting the entire 2D electron cloud across a pinhole aperture using orthogonal magnetic deflection coils ($F = q v \times B$), Farnsworth created the electronic raster scanning architecture that defined global television and video displays for the next century.",
  heroQuote:
    "My invention relates to television systems and has for its primary object the provision of a system of television in which the scanning of the image is accomplished entirely electronically without the use of any mechanically moving parts...",
  originalPdfUrl: "/patents/pdfs/us-1773980-farnsworth-tv.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US1773980A/en",
  usptoClassification: "H04N 3/00 (Scanning systems for television)",
  originalTextAsset: {
    url: "/patents/transcripts/us-1773980-farnsworth-tv.txt",
    pageCount: 13,
    kind: "reviewed-transcription",
  },
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
      "In the 1920s, early television pioneers like John Logie Baird and Charles Francis Jenkins attempted to transmit moving pictures using mechanical Nipkow spinning disks with spiral holes. Mechanical disks were loud, dim, prone to shattering at high speeds, and physically incapable of exceeding 30 to 60 blurry lines of resolution. Philo T. Farnsworth had a revolutionary insight: because electrons have virtually zero mass and zero mechanical inertia, an electron beam can be magnetically steered back and forth millions of times per second. Farnsworth invented the Image Dissector tube, which converted optical light into an intact 2D electron cloud and magnetically swept it across a pinhole aperture, inventing all-electronic high-definition television.",
    coreMechanism:
      "An optical camera lens focuses the live scene onto a cold silver-oxide-cesium photocathode plate in a vacuum tube, liberating photoelectrons whose spatial density distribution $J_e(x,y)$ exactly matches the light and dark values of the optical image. A high-voltage anode accelerates the electron cloud down the tube, while a longitudinal solenoid coil generates an axial magnetic field ($B_z$) that focuses the electrons into sharp focus on the target plane via cyclotron rotation. Orthogonal magnetic deflection coils energized by linear sawtooth sweep currents deflect the entire moving electron image horizontally (15.75 kHz) and vertically (60 Hz) across a microscopic pinhole in the target anode. The stream of electrons entering the aperture forms a continuous analog electrical video signal ($i(t)$) ready for radio broadcast.",
    mechanicalBreakdown: [
      {
        title: "Continuous Cold Photo-Cathode Plate",
        summary:
          "A flat silver-cesium plate converting incident photons into an intact 2D electron cloud.",
        technicalDetails:
          "Operates via the photoelectric effect ($E_{kinetic} = h\\nu - \\Phi$). Brighter areas of the scene liberate higher electron current densities $J(x,y)$, preserving full spatial image resolution in the vacuum without discrete pixel mosaic boundaries.",
        archaicTerm: "Continuous photoelectric surface",
        modernEquivalent: "Photoelectric image sensor / Transmissive photocathode",
      },
      {
        title: "Orthogonal Magnetic Deflection Coils",
        summary:
          "Electromagnetic coils sweeping the electron image in a 2D sawtooth raster pattern.",
        technicalDetails:
          "Horizontal coils produce a high-frequency linear sweep; vertical coils produce a 60 Hz frame sweep. Lorentz forces ($\\vec{F} = q \\vec{v} \\times \\vec{B}$) deflect the electron cloud with zero mechanical inertia and microsecond flyback time.",
        archaicTerm: "Deflecting coils energized by alternating currents",
        modernEquivalent: "Magnetic deflection yoke / Raster scan generator",
      },
      {
        title: "Longitudinal Magnetic Focusing Solenoid",
        summary:
          "A uniform axial magnetic coil wrapped along the entire length of the tube envelope.",
        technicalDetails:
          "Applies a uniform magnetic field ($B_z$) parallel to electron travel. Off-axis electron trajectories are bent into helical cyclotron spirals, refocussing every ray into a sharp 1:1 image at the anode target plane.",
        archaicTerm: "Longitudinal magnetic focusing coil",
        modernEquivalent: "Magnetic electron optics focusing solenoid",
      },
      {
        title: "Target Anode Pinhole Sampling Aperture",
        summary: "A shielded nickel anode with a microscopic pinhole aperture.",
        technicalDetails:
          "Samples a single pixel area ($100\\,\\mu\\text{m}$) of the swept electron cloud at each microsecond instant, converting 2D spatial brightness into a continuous 1D time-series video signal ($i(t)$).",
        archaicTerm: "Target with scanning aperture",
        modernEquivalent: "Aperture pixel sampler / Video signal pickoff electrode",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Einstein Photoelectric Emission Current Density",
        formula: "J_e(x,y) = \\eta_{QE} \\cdot \\frac{e}{h\\nu} \\cdot I_{optical}(x,y)",
        explanation:
          "Incident photons liberate photoelectrons from the continuous cesium-oxide photocathode plate with zero spatial blur, creating an intact 2D electron cloud in the vacuum whose local current density matches image brightness.",
      },
      {
        principle: "Busch's Theorem of Magnetic Solenoid Electron Focusing",
        formula:
          "L_{focus} = \\frac{2\\pi v_z}{\\omega_c} = \\frac{2\\pi \\sqrt{2 q V_a / m}}{q B_z / m} = \\frac{2\\pi}{B_z}\\sqrt{\\frac{2 m V_a}{q}}",
        explanation:
          "A longitudinal magnetic focusing solenoid ($B_z$) forces electrons with transverse velocities into helical cyclotron orbits, focusing the entire 2D electron image onto the anode target plane with exact 1:1 geometric fidelity.",
      },
      {
        principle: "Lorentz Force Sawtooth Raster Deflection",
        formula:
          "\\vec{F} = q(\\vec{E} + \\vec{v} \\times \\vec{B}), \\quad \\theta_{deflect} \\approx \\frac{q B_{trans} L_{coil}}{\\sqrt{2 m q V_a}}",
        explanation:
          "Orthogonal coils energized by linear sawtooth currents generate time-varying transverse magnetic fields, sweeping the entire electron image back and forth across the pinhole aperture at 15.75 kHz with zero mechanical inertia.",
      },
      {
        principle: "Raster Video Signal Bandwidth & Pixel Sampling",
        formula: "BW = \\frac{1}{2} \\cdot K_{Kell} \\cdot N_{lines}^2 \\cdot f_{frame} \\cdot AR",
        explanation:
          "Translating a 2D optical scene into a continuous 1D time-series video current ($i(t)$) requires an electronic transmission bandwidth proportional to the square of scanning line resolution, establishing modern video signal processing.",
      },
      {
        principle: "Secondary Electron Multiplication & Multipactor Gain",
        formula:
          "\\delta = \\frac{I_{secondary}}{I_{primary}} = \\delta_{max} \\frac{\\varepsilon}{\\varepsilon_{max}} \\exp\\left(1 - \\frac{\\varepsilon}{\\varepsilon_{max}}\\right), \\quad G = \\delta^N",
        explanation:
          "Farnsworth invented the multipactor electron multiplier tube, where secondary emission from repeated electron impacts on dynodes amplified faint video currents by over 100,000× without thermal noise.",
      },
    ],
    whyItMattersToday:
      "Every electronic display, television broadcast network, computer monitor (raster rendering), electron microscope, and digital camera raster sensor traces its architectural lineage directly to Farnsworth's 1927 image dissector patent. Farnsworth's victory over RCA established that individual inventors could hold valid pioneer patents against monopolistic corporations.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "The method of television transmission which consists in forming an electrical image of the object to be transmitted, and scanning said electrical image across an aperture to produce a television signal, substantially as described.",
      plainEnglish:
        "The historic master method claim covering all-electronic television: forming a complete 2D electron cloud of an optical scene in a vacuum and scanning the entire electron image across a fixed sampling aperture to generate an analog video signal.",
      keyInnovations: [
        "All-electronic television scanning",
        "Continuous 2D electron image formation",
        "Aperture pixel sampling without moving parts",
      ],
      legalSignificance:
        "Awarded to Farnsworth over RCA and Vladimir Zworykin in Patent Interference No. 64,027, forcing RCA to pay patent royalties to an independent inventor for the first time in its corporate history.",
    },
    {
      number: 11,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "In a television system, the method of focusing an electron image which comprises establishing a longitudinal magnetic field parallel to the path of the electron stream to maintain the spatial relation of the electrons in said stream.",
      plainEnglish:
        "Method of magnetically focusing the moving electron image using a uniform longitudinal solenoid coil to prevent electrons from spreading out in the vacuum.",
      keyInnovations: [
        "Longitudinal magnetic focusing",
        "1:1 electron optics imaging",
        "Cyclotron spiral ray alignment",
      ],
      legalSignificance:
        "Protected the magnetic electron optics that made high-resolution electronic cameras and electron microscopy possible.",
    },
    {
      number: 15,
      isIndependent: true,
      originalText:
        "An image dissector tube comprising a photo-electric cathode, an anode, means for accelerating an electron stream from said cathode toward said anode, and magnetic deflection coils for deflecting said electron stream across an aperture in said anode, substantially as described.",
      plainEnglish:
        "The master apparatus claim covering the Image Dissector camera tube: combining a cold photo-cathode, high-voltage accelerating anode, and magnetic deflection coils to sweep the electron stream across an aperture.",
      keyInnovations: [
        "Image Dissector vacuum tube",
        "Cold photo-cathode electron emission",
        "Integrated magnetic deflection yoke",
      ],
      legalSignificance:
        "The foundational hardware patent on electronic television camera tubes, eliminating spinning Nipkow disks forever.",
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
      "In the mid-1920s, television was stuck in a mechanical dead end. Systems developed by John Logie Baird in Britain and Charles Francis Jenkins in America used rotating mechanical Nipkow disks with spiraling holes. These disks were limited to 30 to 60 coarse lines of resolution, produced blinding flicker, made unbearable mechanical noise, and frequently flew apart at high RPM. Scientists across the world believed television was a practical impossibility.",
    priorArtLimitations: [
      "Mechanical Nipkow disks had severe physical inertia, capping resolution at ~60 lines.",
      "Mechanical mirror drums suffered from phase drift and severe optical distortion.",
      "Early photo-cells lacked sensitivity to produce usable signals without intense, burning arc lights.",
    ],
    breakthroughInsight:
      "In 1921, while working on his family's farm in Rigby, Idaho at age fourteen, Philo Farnsworth was plowing a potato field in back-and-forth parallel furrows. Looking back at the straight lines etched in the dirt, the young prodigy had a revelation: an optical picture could be scanned line-by-line using a magnetic electron beam, row after row, in exactly the same pattern as a plowed field. Farnsworth drew a detailed schematic of his electronic television on a blackboard for his high school chemistry teacher, Justin Tolman—a drawing that would change legal history.",
    patentWars: [
      {
        rivalName: "David Sarnoff, Vladimir Zworykin, and RCA",
        rivalClaim:
          "Radio Corporation of America (RCA), led by ruthless media mogul David Sarnoff, claimed Russian-born engineer Vladimir Zworykin had invented the electronic television with his 1923 iconoscope patent application at Westinghouse.",
        conflictDetails:
          "RCA launched a ferocious legal offensive against Farnsworth (**Patent Interference No. 64,027**). Sarnoff dispatched Zworykin to Farnsworth's San Francisco lab under the guise of an interested visitor; Zworykin spent three days inspecting Farnsworth's tube, remarking: 'This is a beautiful instrument. I wish that I might have invented it myself.' RCA then attempted to patent Farnsworth's dissector and claimed priority. However, Farnsworth's high school teacher, Justin Tolman, took the witness stand and produced the preserved 1922 notebook sketches Farnsworth had drawn as a 14-year-old farm boy.",
        resolution:
          "In 1934, the US Patent Office ruled in favor of Farnsworth, concluding that Philo T. Farnsworth was the true and original inventor of all-electronic television. In 1939, after years of resistance, RCA surrendered and signed a multi-million-dollar patent licensing agreement—the first time in RCA's history that it paid royalties to an outside inventor.",
        legalOutcome:
          "Farnsworth's US Patent No. 1,773,980 was upheld in full, cementing Farnsworth's title as the 'Father of Electronic Television.'",
      },
    ],
    civilizationalImpact:
      "All-electronic television became the most powerful mass communication medium in human history. It transformed culture, politics, entertainment, news, and education worldwide. On September 7, 1927, in a second-floor loft at 202 Green Street in San Francisco, Farnsworth transmitted the world's first all-electronic television image: a simple glowing straight line.",
    funFact:
      "When investors visited Farnsworth's lab in 1928 demanding to know when they would see some 'dollars' from their investment, Farnsworth painted a black **$** dollar sign on a glass slide, placed it in front of the Image Dissector camera, and transmitted a glowing green dollar sign onto the receiver screen, asking: 'There you are, gentlemen—do you see some dollars in television now?'",
    aftermath:
      "Farnsworth went on to hold over 300 patents in television, radar, electron microscopy, and nuclear fusion (inventing the Farnsworth-Hirsch Fusor in the 1960s). On July 20, 1969, as Philo watched Neil Armstrong walk on the Moon on live worldwide television, he turned to his wife Pem and said with tears in his eyes: 'Pem, this has made it all worthwhile.' Farnsworth died in Salt Lake City in 1971 at age 64.",
    sideNotes: [
      "The state of Utah honored Philo Farnsworth by placing a bronze statue of him holding his Image Dissector tube in the US Capitol's National Statuary Hall in Washington, D.C.",
      "The character Professor Hubert J. Farnsworth in the animated science-fiction series *Futurama* was named in tribute to Philo Farnsworth.",
    ],
  },
  tags: [
    "Philo Farnsworth",
    "Television",
    "Image Dissector",
    "Optoelectronics",
    "Cathode Ray Tube",
    "RCA",
    "Patent Wars",
    "20th Century",
  ],
  stats: {
    totalClaims: 3,
    independentClaims: 2,
    patentWarYears: "1927–1939",
    impactScore: 100,
  },
};
