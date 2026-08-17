import type { Patent } from "@/types/patent";

export const eastmanKodakPatent: Patent = {
  id: "us-388850-eastman-kodak",
  patentNumber: "US 388,850",
  title: "Camera",
  shortTitle: "Eastman Kodak Roll-Film Box Camera",
  subtitle:
    "Continuous Flexible Film Spooling, Rotating Sector Barrel Shutter, and Hyperfocal Fixed-Focus Optics",
  inventors: ["George Eastman"],
  inventorLocation: "Rochester, New York",
  grantDate: "1888-09-04",
  filingDate: "1888-03-29",
  era: "Gilded Age & Grid (1870–1900)",
  category: "optics",
  categoryLabel: "Photographic Chemistry & Optics",
  summary:
    "'You press the button, we do the rest.' On September 4, 1888, George Eastman received US Patent No. 388,850 for the original Kodak box camera. Before Eastman, photography was an arduous craft requiring heavy tripods, toxic chemical darkrooms, and fragile, single-exposure glass wet plates. Eastman replaced glass with flexible nitrocellulose gelatin film wound continuously on wooden spools (100 exposures per load). Encased in a simple handheld wooden box with a cylindrical rotating sector barrel shutter ($t = 1/20\\text{ s}$) and a rapid rectilinear doublet lens set to its hyperfocal distance ($H = \\frac{f^2}{N \\cdot c} + f$), the Kodak camera democratized photography for millions of people worldwide and gave birth to visual mass media and motion pictures.",
  heroQuote:
    "Be it known that I, George Eastman, have invented certain new and useful Improvements in Cameras, of which the following is a specification...",
  originalPdfUrl: "/patents/pdfs/us-388850-eastman-kodak.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US388850A/en",
  usptoClassification: "G03B 19/04 (Box cameras / Roll-film holders)",
  originalTextAsset: {
    url: "/patents/transcripts/us-388850-eastman-kodak.txt",
    pageCount: 9,
  },
  originalText: `UNITED STATES PATENT OFFICE.
GEORGE EASTMAN, OF ROCHESTER, NEW YORK.

CAMERA.

SPECIFICATION forming part of Letters Patent No. 388,850, dated September 4, 1888.
Application filed March 29, 1888. Serial No. 268,898. (No model.)

To all whom it may concern:
Be it known that I, GEORGE EASTMAN, of Rochester, in the County of Monroe and State of New York, have invented certain new and useful Improvements in Cameras; and I do hereby declare that the following is a full, clear, and exact description of the invention.

The object of my invention is to produce a simple, light, compact, and readily-portable camera for making photographic exposures upon a continuous strip of sensitive film, adapted to be held in the hand and operated by an amateur without technical knowledge of photography.

The invention consists in the novel construction and arrangement of parts, including:
First, a portable box-casing provided with a lens at the front, an exposure-opening behind the lens, and an internal roll-holder carrying a supply spool and a take-up spool for holding a continuous ribbon of sensitive photographic film.
Second, a cylindrical barrel-shutter enclosing the lens, provided with an aperture, and rotated by a coiled spring under the control of a release-trigger, whereby upon pressing a button on the side of the camera the shutter rotates rapidly to expose the film for an instant.
Third, a film-winding key located outside the casing, connected with the take-up spool, and an indicator device for showing when a sufficient length of film has been drawn forward for a new exposure.
Fourth, a string-cocking device whereby the shutter spring can be rewound from the exterior of the casing after each exposure.`,
  plainEnglishExplanation: {
    overview:
      "In the 1870s, taking a photograph required a horse-drawn wagon packed with glass plates, silver nitrate baths, dangerous cyanide fixing agents, a heavy tripod, and a portable dark tent. George Eastman eliminated this entire chemical circus. By developing flexible gelatin roll film wound on compact spools and packaging it in a $25 handheld box camera with a simple push-button shutter, Eastman transformed photography from a hazardous laboratory discipline into a universal consumer recreation.",
    coreMechanism:
      "The Kodak camera is a handheld mahogany box covered in black Morocco leather ($16.5 \\times 9.5 \\times 8.3\\text{ cm}$, weight $0.9\\text{ kg}$). Inside, a supply spool holds a 100-exposure continuous paper/nitrocellulose film strip coated with gelatin silver bromide emulsion ($w = 70\\text{ mm}$). The film is tensioned across a focal plane mask behind a 57mm $f/9$ doublet lens. The lens is permanently focused at its hyperfocal distance ($H = 2.4\\text{ m}$), rendering everything from $1.2\\text{ m}$ to optical infinity in sharp focus without focusing adjustments. To take a picture, the operator pulls a cocking string to tension a coiled spring around a cylindrical barrel shutter. Pressing the side button releases a spring-loaded sear; the cylindrical shutter spins $180^\\circ$, sweeping an aperture across the lens in $1/20\\text{th}$ of a second. Photons passing through the aperture strike the silver halide crystals ($2\\text{ AgBr} + h\\nu \\to 2\\text{ Ag}^0 + \\text{Br}_2$), creating a stable latent image. The user turns a winding key on top until an audible escapement click indicates one full 2.5-inch circular frame has advanced.",
    mechanicalBreakdown: [
      {
        title: "Revolving Cylindrical Barrel Sector Shutter",
        summary: "Spring-loaded rotating cylinder sweeping exposure aperture across lens.",
        technicalDetails:
          "The shutter consists of a cylindrical brass tube surrounding the lens with two diametrically opposed cutouts. Tensioned by a flat spiral spring and released by a leaf-spring trigger, it executes a $180^\\circ$ rotation, giving an exposure duration $t = \\frac{\\theta_{\\text{slit}}}{\\omega_{\\text{shutter}}} \\approx 0.050\\text{ s}$ ($1/20\\text{ s}$).",
        archaicTerm: "Cylindrical revolving sector shutter and cord cocking device",
        modernEquivalent: "Rotary barrel sector shutter",
      },
      {
        title: "Continuous 100-Exposure Roll Film Carrier",
        summary: "Dual-spool tensioned transport mechanism for flexible emulsion ribbon.",
        technicalDetails:
          "A supply spool feeds a continuous 100-exposure strip of gelatin-coated paper/nitrocellulose film over guide rollers to a take-up spool. A tension spring prevents slack, holding the film flat against the exposure gate within $\\pm 0.1\\text{ mm}$.",
        archaicTerm: "Roll-holder with supply and winding spools",
        modernEquivalent: "Film spool transport cassette",
      },
      {
        title: "Fixed-Focus Rapid Rectilinear Doublet Lens",
        summary: "57mm focal length symmetrical lens set to hyperfocal focus.",
        technicalDetails:
          "Symmetrical two-element glass lens with a fixed circular aperture stop $D = 6.3\\text{ mm}$ ($f/9$). Set to hyperfocal distance $H = 2.4\\text{ m}$ for a circle of confusion $c = 0.03\\text{ mm}$, providing infinite depth of field from $1.2\\text{ m}$ to $\\infty$.",
        archaicTerm: "Photographic objective with diaphragm stop",
        modernEquivalent: "Fixed-aperture hyperfocal doublet lens",
      },
      {
        title: "Escapement Frame Counter & External Winding Key",
        summary: "Toothed measuring roller registering frame advance with audible click.",
        technicalDetails:
          "A knurled roller resting against the film friction-drives a pointer dial on the camera top, clicking every $65\\text{ mm}$ of film travel to notify the operator that a complete unexposed circular frame is positioned.",
        archaicTerm: "Measuring roller and indicator dial",
        modernEquivalent: "Mechanical frame indexer and shot counter",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Hyperfocal Distance & Universal Depth of Field",
        formula:
          "H = \\frac{f^2}{N \\cdot c} + f \\approx \\frac{(0.057)^2}{9 \\times (0.00003)} + 0.057 \\approx 12.1\\text{ m}, \\quad D_{\\text{near}} = \\frac{H}{2} \\approx 1.2\\text{ m}",
        explanation:
          "By fixing the $f$-number at $f/9$ and focal length at $57\\text{ mm}$, Eastman engineered optical parameters where the depth of field extends from half the hyperfocal distance ($1.2\\text{ m}$) all the way to astronomical infinity, eliminating the need for a viewfinder or focusing bellows.",
      },
      {
        principle: "Photochemical Latent Image Formation",
        formula:
          "\\text{Ag}^+ + e^- \\xrightarrow{h\\nu} \\text{Ag}^0 \\quad (\\text{Gurney-Mott Electron-Trapping Mechanism})",
        explanation:
          "Photons absorbed by silver bromide (AgBr) microcrystals in the gelatin emulsion excite electrons to the conduction band. The electrons migrate to sensitivity specks, trapping silver ions to form stable metallic sub-microscopic silver clusters (the latent image) that are later chemically amplified billions of times in the developer bath.",
      },
      {
        principle: "Logarithmic Exposure Value Law",
        formula:
          "\\text{EV} = \\log_2\\left(\\frac{N^2}{t}\\right) = \\log_2\\left(\\frac{9^2}{0.050}\\right) = \\log_2(1620) \\approx 10.66",
        explanation:
          "The Kodak's optical combination of $f/9$ aperture and $1/20\\text{ s}$ shutter yield an exposure value $\\text{EV} \\approx 10.7$, matched to bright outdoor daylight illumination for ISO 25 gelatin emulsion.",
      },
    ],
    whyItMattersToday:
      "Eastman's roll-film architecture was the technical foundation upon which Thomas Edison and the Lumière brothers built the motion picture industry. The business model Eastman invented—selling hardware at cost and making immense long-term profits on recurring consumable media and processing ('the razor and blade' model)—became the standard business structure of 20th-century technology companies.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "The combination, with a camera box or casing provided with a lens, of an internal roll-holder carrying a supply spool and a take-up spool for holding a continuous strip of sensitive film, a revolving barrel-shutter enclosing the lens, and an external trigger for releasing said shutter to make an exposure, substantially as described.",
      plainEnglish:
        "The master handheld roll-film box camera claim covering a portable light-tight box containing roll-film spools, a revolving barrel shutter enclosing the lens, and a push-button release trigger.",
      keyInnovations: [
        "Self-contained roll-film box camera",
        "Concentric barrel shutter enclosing the lens",
        "Push-button external exposure release",
      ],
      legalSignificance:
        "The core patent protecting the original Kodak camera, establishing Eastman Kodak's worldwide commercial dominance in amateur consumer photography.",
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "In a camera, the combination, with the lens, of a cylindrical shutter-barrel provided with an exposure-aperture, a spring for rotating said barrel, a catch for holding the barrel in a set position, and a flexible cord extending to the exterior of the casing for setting the shutter against the tension of its spring.",
      plainEnglish:
        "The pull-string cocking mechanism claim: a cord extending outside the camera box that tensions the shutter spring without opening the light-tight camera casing.",
      keyInnovations: [
        "External pull-cord shutter cocking",
        "Spring-loaded rotary cylinder actuation",
        "Light-tight external camera control",
      ],
      legalSignificance:
        "Protected the external mechanical controls that made the camera completely self-contained and light-tight.",
    },
    {
      number: 3,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "In a roll-film camera, the combination, with the film spools, of a measuring-roller in frictional contact with the moving film, and an indicator operated by said roller to show on the exterior of the camera the length of film moved.",
      plainEnglish:
        "The film indexer claim: a friction roller riding against the film strip connected to an external dial showing exact frame advances.",
      keyInnovations: [
        "Frictional film measuring roller",
        "External shot counter dial",
        "Prevention of frame overlapping",
      ],
      legalSignificance:
        "Protected the mechanical shot counter and exposure-advance indicator found on subsequent roll-film cameras.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Kodak Box Camera Perspective & Internal Spool Layout",
      caption:
        "Perspective cutaway view of the original Kodak box camera showing the fixed doublet lens, cylindrical barrel shutter, film supply spool, and winding key.",
      svgType: "eastman-kodak",
      callouts: [
        {
          id: "ek-1",
          figureRef: "Fig. 1",
          label: "A",
          element: "Rapid Rectilinear Doublet Lens",
          description:
            "57mm f/9 fixed-aperture lens providing infinite depth of field beyond 1.2m.",
          x: 22,
          y: 50,
        },
        {
          id: "ek-2",
          figureRef: "Fig. 1",
          label: "B",
          element: "Revolving Barrel Sector Shutter",
          description: "Cylindrical spring-driven shutter executing 1/20s exposure sweep.",
          x: 28,
          y: 42,
        },
        {
          id: "ek-3",
          figureRef: "Fig. 1",
          label: "C",
          element: "Shutter Cocking Pull-Cord",
          description: "External string pulled by user to rewind shutter spring before shooting.",
          x: 35,
          y: 20,
        },
        {
          id: "ek-4",
          figureRef: "Fig. 1",
          label: "D",
          element: "100-Exposure Film Supply Spool",
          description: "Continuous 70mm gelatin-silver bromide emulsion roll on wooden core.",
          x: 75,
          y: 35,
        },
        {
          id: "ek-5",
          figureRef: "Fig. 1",
          label: "E",
          element: "Film Advance Winding Key",
          description: "Top-mounted key turning take-up spool with audible frame index click.",
          x: 70,
          y: 18,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "In 1877, 23-year-old Rochester bank clerk George Eastman planned a vacation to Santo Domingo. When a friend suggested he photograph his trip, Eastman bought a complete wet-collodion outfit: a camera as big as a microwave oven, a heavy wooden tripod, glass plates, a bottle of collodion, a bath of silver nitrate, a water jug, and a dark tent. The equipment was so heavy that Eastman had to hire a pack horse to carry it. Overwhelmed by the complexity, Eastman never took the vacation and spent every night in his mother's kitchen experimenting with dry gelatin emulsions.",
    priorArtLimitations: [
      "Wet-collodion plates had to be coated, exposed, and developed within 10 minutes before the chemical emulsion dried.",
      "Glass plates were heavy, fragile, and dangerous to transport over rough terrain.",
      "Cameras required manual ground-glass focusing, making spontaneous snapshot photography impossible.",
    ],
    breakthroughInsight:
      "Eastman realized that the photographer should not be a chemist. By coating a light, flexible nitrocellulose/paper base with dry gelatin emulsion, winding it in a 100-shot spool inside a factory-sealed camera, and setting the optical system to its hyperfocal distance, Eastman decoupled image capture from chemical processing: the customer simply pressed the button, and Eastman's Rochester factory performed the chemical development.",
    patentWars: [
      {
        rivalName: "Reverend Hannibal Goodwin",
        rivalClaim:
          "Newark minister Hannibal Goodwin filed a broad patent in 1887 claiming photographic pellicles of nitrocellulose dissolved in nitrobenzene.",
        conflictDetails:
          "Goodwin's application languished in the Patent Office for 11 years. When it was finally granted in 1898, Goodwin's successors (Ansco) sued Eastman Kodak for patent infringement.",
        resolution:
          "In 1914, the US Federal Appeals Court ruled in Goodwin/Ansco's favor. Eastman Kodak was ordered to pay a record $5,000,000 in cash damages (over $150 million today).",
        legalOutcome:
          "Despite the financial settlement, Eastman Kodak's industrial mass-manufacturing and global brand distribution made it the undisputed monopoly of the global photography industry.",
      },
    ],
    civilizationalImpact:
      "The Kodak camera created the modern concept of the 'snapshot.' When a user finished their 100 exposures, they mailed the entire camera with $10 to Rochester, New York. The factory developed the film, mounted 100 round prints on cardboard, reloaded the camera with fresh film, and mailed it back. For the first time in human history, everyday families, travelers, and journalists could effortlessly document birthdays, wars, scientific discoveries, and everyday human life.",
    funFact:
      "George Eastman coined the name 'Kodak' out of thin air. He loved the letter 'K' because it was 'a strong, incisive sort of letter.' Working with his mother, they tried combinations of letters until they created a word that was short, easy to pronounce in any language, and completely unique to trademark law.",
    aftermath:
      "Eastman Kodak became one of the most profitable corporations in American history. George Eastman donated over $100 million to universities (including MIT and the University of Rochester) and dental clinics worldwide before his death in 1932.",
    sideNotes: [
      "The original Kodak produced distinctive 2.5-inch circular photographs because Eastman used circular masks in the camera to hide optical distortion and corner vignetting near the edges of the simple doublet lens.",
      "In 1889, Eastman supplied Thomas Edison with sample strips of flexible transparent roll film, which Edison slit down to 35mm with four perforations per frame, establishing the universal global 35mm motion picture standard.",
    ],
  },
  tags: [
    "George Eastman",
    "Kodak",
    "Box Camera",
    "Roll Film",
    "Photography",
    "Silver Halide",
    "Hyperfocal Optics",
    "Snapshot",
    "Gilded Age",
  ],
  stats: {
    totalClaims: 3,
    independentClaims: 1,
    patentWarYears: "1888–1914",
    impactScore: 100,
  },
};
