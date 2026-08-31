import { eastmanKodakArchivalEdition } from "@/data/editions/eastmanKodakEdition";
import type { Patent } from "@/types/patent";

function manualClaimText(number: number): string {
  const block = eastmanKodakArchivalEdition.blocks.find(
    (candidate) => candidate.kind === "claim" && candidate.number === number,
  );
  if (block?.kind !== "claim")
    throw new Error(`Eastman manual edition is missing claim ${number}.`);
  return block.inlines.map((inline) => inline.text).join("");
}

/**
 * Claim-by-claim editorial decoders, checked against the printed claim block
 * on pages 4–6 of the pinned US 388,850 facsimile.  The neighbouring claims
 * deliberately overlap, so the distinguishing limitation is named for each
 * one instead of assigning a generic label to an entire run of claims.
 */
const claimEditorialMetadata = [
  {
    plainEnglish:
      "Claim 1 protects the complete modular camera: a tubular case is closed at the rear by the detachable film-holder, at the front by a block or end piece, and the removable lens-support and shutter sit in that front chamber. The legal combination is the three-part light-tight body, not merely any one component.",
    keyInnovations: [
      "Tubular case with two removable end modules",
      "Front-chamber lens-support and shutter",
    ],
  },
  {
    plainEnglish:
      "Claim 2 narrows the front assembly to a partition or block that closes the case, forms a chamber with coincident openings, and holds a fixed lens-support with a rotary shutter in fixed relation. It protects the aligned optical passage and the supported rotating mechanism together.",
    keyInnovations: ["Coincident-aperture front chamber", "Fixed lens-support with rotary shutter"],
  },
  {
    plainEnglish:
      "Claim 3 specifies the sectional front closure: a fixed diaphragm, a cooperating apertured cap, an internal chamber between them, a lens between their apertures, and a shutter on its support. This is the detailed two-piece front block that admits light only through the controlled path.",
    keyInnovations: ["Sectional diaphragm and cap", "Lens chamber between aligned apertures"],
  },
  {
    plainEnglish:
      "Claim 4 covers the basic barrel-shutter relationship in which a shutter surrounds the lens and carries coincident apertures. Its limitation is the enclosing shutter with aligned openings, without the additional support, motor, or case details of later claims.",
    keyInnovations: ["Lens-encircling shutter", "Coincident shutter apertures"],
  },
  {
    plainEnglish:
      "Claim 5 adds the exposure action: the shutter lies on opposite faces of the lens and its matching apertures move to uncover both faces simultaneously from opposite edges. It protects paired exposure openings acting together rather than a one-sided cover.",
    keyInnovations: ["Opposite-face shutter coverage", "Simultaneous two-edge exposure"],
  },
  {
    plainEnglish:
      "Claim 6 requires intermediate covering plates on opposite sides of the lens, coincident shutter spaces, and operating devices that alternately cover and uncover both faces together. The claim protects the coordinated light-blocking sequence, including the opaque intervening plates.",
    keyInnovations: ["Intermediate covering plates", "Alternating synchronized lens-face coverage"],
  },
  {
    plainEnglish:
      "Claim 7 claims a double shutter that embraces the lens, is mounted on a pivot, and is intermittently rotated to uncover both lens faces at once. The pivoted double-barrel arrangement is the limitation, rather than the later particular drive train.",
    keyInnovations: ["Pivoted double shutter", "Intermittent simultaneous exposure"],
  },
  {
    plainEnglish:
      "Claim 8 fixes the shutter geometry: the shutter surrounds the lens on its fixed support and rotates intermittently about an axis transverse to the optical axis. It protects that cross-axis barrel motion, which sweeps the apertures across the lens ends.",
    keyInnovations: ["Transverse-axis shutter rotation", "Fixed lens support"],
  },
  {
    plainEnglish:
      "Claim 9 claims the hollow, aperture-bearing shutter itself when pivotally mounted on the lens-support that carries the lens. The support is not merely nearby: it is the pivot structure for the enclosing shutter.",
    keyInnovations: ["Hollow aperture-bearing shutter", "Lens-support pivot mounting"],
  },
  {
    plainEnglish:
      "Claim 10 treats the lens and hollow shutter as a detachable article for application to a camera. The shutter surrounds the lens, has coincident apertures, and is pivotally attached to the lens-support, so the lens-and-shutter unit can be fitted to a camera body as one attachment.",
    keyInnovations: ["Detachable lens-and-shutter attachment", "Pivotally attached hollow shutter"],
  },
  {
    plainEnglish:
      "Claim 11 claims the combined lens-holder and intermittently rotating enclosing shutter when the shutter is sustained wholly on the lens-support. Its point is self-supporting integration: the camera case need not provide a separate shutter bearing.",
    keyInnovations: [
      "Self-supporting lens-holder shutter unit",
      "Lens-support-borne intermittent shutter",
    ],
  },
  {
    plainEnglish:
      "Claim 12 adds the operating controls to the enclosing shutter: a motor or impelling device drives the shutter, while separate devices release and arrest it. The claim covers the working exposure unit, not only its barrel geometry.",
    keyInnovations: ["Shutter impelling device", "Release-and-arrest controls"],
  },
  {
    plainEnglish:
      "Claim 13 combines a pivotal hollow shutter with coincident apertures, a motor, stopping and releasing devices, and a lens fixed within the shutter. It claims the complete moving barrel around a stationary internal lens with its start-stop mechanism.",
    keyInnovations: [
      "Fixed lens inside pivotal hollow shutter",
      "Motorized stopping and release devices",
    ],
  },
  {
    plainEnglish:
      "Claim 14 protects the insertable front module: the connected lens-support and shutter enter a recess at the camera front, and the surrounding chamber walls hold the lens and support fixed. The case walls serve as the retaining structure after insertion.",
    keyInnovations: ["Insertable front shutter module", "Chamber-wall retention"],
  },
  {
    plainEnglish:
      "Claim 15 is directed to a hollow shutter closed at both ends, with coincident apertures and a lens held inside it. Closing both barrel ends is an express limitation that distinguishes the enclosed lens construction from an open frame.",
    keyInnovations: ["Closed-end hollow shutter", "Internal lens with coincident apertures"],
  },
  {
    plainEnglish:
      "Claim 16 places the shutter pivot on the lens-support and assigns the motor to one shutter end and the release device to the opposite end. It protects this end-to-end division of driving and release functions around the lens.",
    keyInnovations: ["Opposite-end motor and release", "Lens-support shutter pivot"],
  },
  {
    plainEnglish:
      "Claim 17 requires that both the motor and releasing devices are mounted on the same lens-support as the shutter enclosing the lens. The claimed packaging keeps every movement-control part on the removable lens-support assembly.",
    keyInnovations: ["Lens-support-mounted motor", "Lens-support-mounted release controls"],
  },
  {
    plainEnglish:
      "Claim 18 joins the aperture-bearing shutter module to a camera-tube chamber: the shutter apertures rotate in the plane of the lens axis, while the front chamber has coincident apertures and engages the lens-support to receive and hold the module. It protects the matched module-to-case interface.",
    keyInnovations: ["Camera-tube receiving chamber", "Axial-plane rotating shutter apertures"],
  },
  {
    plainEnglish:
      "Claim 19 claims the spring-winding train in detail: a wheel, a spring between wheel and shutter, a ratchet between wheel and support, and a drum connected through another ratchet or equivalent to wind the spring. Its legal subject is the one-way winding transmission that stores energy for shutter motion.",
    keyInnovations: ["Ratchet-coupled spring winding train", "Drum-driven shutter spring"],
  },
  {
    plainEnglish:
      "Claim 20 packages the ratchet, spring, and winding drum as a motor device mounted on one end of the lens-support-mounted shutter, with a release device on the opposite end. It protects the spatially divided compact motor-and-release assembly.",
    keyInnovations: ["One-end ratchet spring winding motor", "Opposite-end shutter release"],
  },
  {
    plainEnglish:
      "Claim 21 covers the positive stop: abutments fixed on opposite sides of the rotary shutter axis cooperate with the inclined or beveled edge of a pivoted latch. Those interacting profiles determine when the rotating shutter stops and when it can be released.",
    keyInnovations: ["Opposed shutter abutments", "Beveled pivoted latch stop"],
  },
  {
    plainEnglish:
      "Claim 22 claims the arrangement in which the rotary shutter, its motor, and its release devices are all mounted on the lens-support between the retaining heads. The heads that locate the support in the camera also bound the complete moving assembly.",
    keyInnovations: [
      "Support-head-bounded shutter assembly",
      "Internally mounted motor and release",
    ],
  },
  {
    plainEnglish:
      "Claim 23 names the supporting structure: posts on opposite sides of the lens carry sustaining heads, a hollow shutter is journaled on those posts, a latch engages one shutter end, and a motor engages the other. It claims the post-and-head mechanical layout rather than a generic shutter.",
    keyInnovations: ["Post-journaled hollow shutter", "Opposite-end latch and motor"],
  },
  {
    plainEnglish:
      "Claim 24 requires a pivoted tubular shutter driven continuously in one direction, with a pivoted latch that alternately engages and releases it and a tension device that regulates movement. The tension device is a separate limitation controlling the shutter's running behavior.",
    keyInnovations: ["Continuously driven tubular shutter", "Tension-regulated alternating latch"],
  },
  {
    plainEnglish:
      "Claim 25 focuses on the particular release linkage: a cam-plate on the shutter carries shoulders or abutments; a latch pivots in a lens-support post; and a pin through the support head actuates that latch. Pressing the pin therefore works through the head and post to the cam plate.",
    keyInnovations: ["Cam-plate shoulder release", "Head-through push-pin latch actuator"],
  },
  {
    plainEnglish:
      "Claim 26 claims a rotating shutter whose cam-plate abutments meet a latch while a spring bears on that plate as both brake and stop. The same spring is legally required to regulate speed and oppose further movement at the stop.",
    keyInnovations: ["Cam-plate brake spring", "Latch-engaged shutter abutments"],
  },
  {
    plainEnglish:
      "Claim 27 protects the front box block with an aperture and a transverse groove sized to receive the combined lens-support and shutter. The groove is the specified mounting feature for the removable optical mechanism.",
    keyInnovations: ["Apertured front block", "Transverse shutter-module groove"],
  },
  {
    plainEnglish:
      "Claim 28 adds that the front block is sectional and has coincident apertures as well as the transverse groove or chamber for the lens-support and shutter mechanism. It protects the two-part, aligned-aperture version of the module receptacle.",
    keyInnovations: ["Sectional coincident-aperture block", "Transverse module chamber"],
  },
  {
    plainEnglish:
      "Claim 29 covers the externally operated control path: a flexible connection passes through the camera wall to the shutter motor, and a push-pin reaches the shutter release while guided by the lens-support. The claim preserves outside access without making the front module permanently exposed.",
    keyInnovations: [
      "Wall-passing flexible winding connection",
      "Lens-support-guided release push-pin",
    ],
  },
  {
    plainEnglish:
      "Claim 30 claims the detachable unit at a higher level: a lens and its enclosing shutter are both mounted on a single supporting frame designed for insertion in the camera tube or case. The single-frame insertion feature is the core limitation.",
    keyInnovations: ["Single-frame detachable shutter unit", "Camera-tube insertion frame"],
  },
  {
    plainEnglish:
      "Claim 31 spells out that detachable frame more completely: it has a transverse lens aperture, a pivoted hollow shutter surrounding the lens, and shutter-actuating devices carried by the frame. It protects the frame's aperture, bearing, and actuator package together.",
    keyInnovations: ["Transversely apertured supporting frame", "Frame-carried shutter actuator"],
  },
  {
    plainEnglish:
      "Claim 32 turns to the rear module. It claims a film-carrying and feeding mechanism inserted longitudinally into the rear of the tubular case to close it, with supply spool, guide rolls, platen, and winding roller all mounted between the outer faces of the side pieces. Nothing may project beyond those faces.",
    keyInnovations: [
      "Flush-sided longitudinal roller-holder",
      "Integrated supply, guide, platen, and winding train",
    ],
  },
  {
    plainEnglish:
      "Claim 33 claims removable spool supports that pass through the roller-holder side pieces while their outer edges remain flush with or below the outer faces. That clearance permits the holder to slide inside the tubular camera box.",
    keyInnovations: ["Flush removable spool supports", "Side-piece pass-through mounting"],
  },
  {
    plainEnglish:
      "Claim 34 protects the named retention geometry for the roller-holder: socket c¹⁷ and pin c¹⁶ include a cross-piece or head c¹⁸ in a countersunk side-piece recess, while stud c¹⁹ enters through the slot or notch in the socket. The claim is the countersink-and-notch fastening relation.",
    keyInnovations: ["Countersunk socket-and-pin retention", "Notch-entering retaining stud"],
  },
  {
    plainEnglish:
      "Claim 35 adds the complete detachable roller support: a head on one pin is countersunk in one side piece, a socket plate and a second pin support the other end, the camera-box wall keeps that pin in place, and a socket-side stud passes a slot or notch during withdrawal. The box itself prevents accidental release once assembled.",
    keyInnovations: ["Camera-wall-retained roller pin", "Two-sided countersunk spool support"],
  },
  {
    plainEnglish:
      "Claim 36 claims the light-tight service openings of the rear module. The tubular case has openings for the indicator and winding key; the roller-holder's closed side pieces extend beyond them; its indicator is flush or recessed at one opening; and a removable key reaches the winding mechanism below the other outer face, so both openings remain closed against light.",
    keyInnovations: [
      "Light-sealed indicator and winding-key openings",
      "Recessed roller-holder controls",
    ],
  },
  {
    plainEnglish:
      "Claim 37 claims a rear-inserted roller-holder that fits the case walls, together with a detachable key that passes through the case to engage the film-winding devices. The key also locks the holder against longitudinal movement, performing both winding and retention work.",
    keyInnovations: ["Winding key as longitudinal holder lock", "Rear-inserted snug roller-holder"],
  },
  {
    plainEnglish:
      "Claim 38 returns to the exposure path and claims a shutter mechanism that operates on opposite faces of the lens, simultaneously uncovering and covering the front and rear of the lens tube or aperture. It protects two-sided light control at the tube itself.",
    keyInnovations: ["Front-and-rear lens-tube shutter", "Simultaneous two-face light control"],
  },
  {
    plainEnglish:
      "Claim 39 specifies that the lens has an enclosing tube conducting light into the camera and that the shutter simultaneously interposes and withdraws light-excluding media in front of and behind the lens. The limitation is paired opaque media moving together on the optical path.",
    keyInnovations: ["Paired light-excluding media", "Enclosing lens tube optical path"],
  },
  {
    plainEnglish:
      "Claim 40 requires an enclosing casing or tube and two separately positioned light-excluding media, one movable in front of the lens and one behind it, with devices that actuate both together. It claims the two-media arrangement plus its common actuation, not merely an enclosing tube.",
    keyInnovations: ["Separately positioned front and rear media", "Common paired-media actuator"],
  },
  {
    plainEnglish:
      "Claim 41 claims the overall open-ended camera box when the front lens and diaphragm close one end and the roller-holder is inserted from the rear, fitted to the case walls, and removably retained. It closes with the full front-closure and rear-carrier combination.",
    keyInnovations: [
      "Open-ended box with front diaphragm",
      "Rear-inserted removably retained roller-holder",
    ],
  },
] as const;

export const eastmanKodakPatent: Patent = {
  id: "us-388850-eastman-kodak",
  patentNumber: "US 388,850",
  title: "Camera",
  shortTitle: "Eastman Light-Tight Roll-Film Camera",
  subtitle: "Removable Film Holder and Spring-Driven Cylindrical Shutter",
  inventors: ["George Eastman"],
  inventorLocation: "Rochester, Monroe County, New York",
  grantDate: "1888-09-04",
  filingDate: "1888-03-30",
  era: "Gilded Age & Grid (1870–1900)",
  category: "optics",
  categoryLabel: "Photographic Optics and Mechanisms",
  summary:
    "US 388,850 describes a tubular camera case with a removable rear roller-holder for prepared film and a removable, light-tight front lens-and-shutter module. Its 41 claims cover the paired-aperture cylindrical shutter, its spring-and-ratchet drive and release controls, the sectional front block, and the rear film carrier.",
  heroQuote:
    "This invention relates more particularly to improvements in that class of photographic apparatus known as ‘detective cameras.’",
  originalPdfUrl: "/patents/pdfs/us-388850-eastman-kodak.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US388850A/en",
  usptoClassification: "Not stated on the pinned facsimile.",
  originalTextAsset: {
    url: "/patents/transcripts/us-388850-eastman-kodak-reviewed.txt",
    pageCount: 9,
    kind: "reviewed-transcription",
    reviewedBy: "PurpleDog, manual facsimile review",
    reviewedAt: "2026-08-18",
    sourcePdfSha256: eastmanKodakArchivalEdition.sourcePdfSha256,
  },
  archivalEdition: eastmanKodakArchivalEdition,
  originalText: `To all whom it may concern:

Be it known that I, GEORGE EASTMAN, of Rochester, in the county of Monroe and State of New York, have invented certain new and useful Improvements in Cameras; and I do hereby declare the following to be a full, clear, and exact description of the same, reference being had to the accompanying drawings, forming a part of this specification, and to the figures and letters of reference marked thereon.

This invention relates more particularly to improvements in that class of photographic apparatus known as “detective cameras;” and said invention consists in the novel and improved form, construction, and arrangement of parts constituting the case or body, the lens-support and shutter, and the film-holder, together with the various combinations of such instrumentalities as are hereinafter described, and set forth in the claims.`,
  plainEnglishExplanation: {
    overview:
      "The grant solves a mechanical packaging problem: keep prepared film dark inside a portable box, yet let the user load the film holder, wind the shutter spring, release an exposure, advance film, and remove the modules without reopening an uncontrolled light path.",
    coreMechanism:
      "The optical path runs through a front aperture and lens. A hollow cylinder around the lens has matching openings on opposite sides; opaque cylinder wall blocks the path at rest, and a spring-driven half-turn moves the openings across the lens. A rear roller-holder holds the film on supply and winding spools and seals the rear of the tubular case.",
    mechanicalBreakdown: [
      {
        title: "Front block and chamber",
        summary:
          "A sectional front block receives the removable lens-and-shutter unit while excluding stray light.",
        technicalDetails:
          "The patent calls the chamber b'. Its matched openings and close-fitting sections create a controlled optical path rather than an open camera interior.",
        archaicTerm: "Block or diaphragm",
        modernEquivalent: "Light-tight front bulkhead",
      },
      {
        title: "Cylindrical shutter",
        summary: "A hollow cylinder with coincident openings surrounds the lens.",
        technicalDetails:
          "At rest the opaque cylinder covers both lens faces. During a controlled half-revolution the aligned openings cross the optical axis, admitting light through the lens before the latch stops the shutter again.",
        archaicTerm: "Cylindrical shutter",
        modernEquivalent: "Rotary barrel shutter",
      },
      {
        title: "Spring drive and release",
        summary:
          "An external cord winds a spring through a ratchet; a push-pin and latch release and arrest motion.",
        technicalDetails:
          "The ratchet prevents reverse winding. Cam abutments, the pivoted latch, and spring 27 determine the shutter's stop positions and prevent more than a half-revolution per release.",
        archaicTerm: "Motor mechanism",
        modernEquivalent: "Spring-powered shutter drive",
      },
      {
        title: "Roller-holder",
        summary:
          "The rear assembly carries prepared film, guides it over a platen, and winds it forward.",
        technicalDetails:
          "Supply and winding spools, guide rollers, a platen, a tension device, detaining mechanism, and measuring indicator are mounted between side pieces so the holder can slide into the tubular case.",
        archaicTerm: "Roller-holder",
        modernEquivalent: "Removable roll-film carrier",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Light exclusion",
        formula:
          "\\Phi_{\\text{stray}} \\approx 0 \\implies E_{\\text{film}} = \\frac{\\pi L}{4 N^2}",
        explanation:
          "Photography requires the sensitive film to see light only through the intended lens aperture. The patent repeatedly protects that condition with overlapping covers, chambers, flush controls, and shutters on both sides of the lens.",
      },
      {
        principle: "Rotational energy storage",
        formula: "U = \\frac{1}{2} k \\theta^2 \\quad \\text{and} \\quad \\tau = k \\theta",
        explanation:
          "A wound spring stores mechanical energy. Ratchets transmit winding torque in one direction and the latch-and-abutment system converts the stored energy into a bounded shutter rotation.",
      },
    ],
    whyItMattersToday:
      "The document is a detailed example of system-level camera engineering: optical admission, light sealing, release control, modular service, film transport, and frame indication are treated as coupled mechanisms rather than as an isolated lens or shutter.",
  },
  claims: claimEditorialMetadata.map(({ plainEnglish, keyInnovations }, index) => ({
    number: index + 1,
    isIndependent: true,
    originalText: manualClaimText(index + 1),
    plainEnglish,
    keyInnovations: [...keyInnovations],
  })),
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Perspective View of Camera",
      caption: "Exterior perspective of the rectangular camera case with front block and lens.",
      svgType: "eastman-kodak",
      callouts: [
        {
          id: "eastman-a",
          figureRef: "Fig. 1",
          label: "A",
          element: "Camera box or case",
          description: "The rectangular tube that receives the front block and rear roller-holder.",
          x: 53,
          y: 47,
        },
        {
          id: "eastman-b",
          figureRef: "Fig. 1",
          label: "B",
          element: "Front block",
          description:
            "The front block or diaphragm that contains the lens-support and shutter chamber.",
          x: 31,
          y: 62,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "The source identifies the need for a simple, compact, readily portable camera that can hold prepared film while excluding unwanted light from the exposing chamber.",
    priorArtLimitations: [
      "The pinned facsimile focuses directly on the mechanical improvements and does not document an explicit comparative prior-art history in its opening preamble.",
      "The document omits a detailed survey of competing patent claims from contemporaneous manufacturers, such as those by Scovill or Anthony, which might have defined the technical baseline of the era.",
    ],
    breakthroughInsight:
      "Eastman combines a removable front lens-and-shutter module with a removable rear roller-holder in a tubular, light-tight case.",
    patentWars: [
      {
        rivalName: "Hannibal Goodwin & Anthony & Scovill Co. (Ansco)",
        rivalClaim:
          "Reverend Hannibal Goodwin filed a patent application for flexible nitrocellulose roll film in 1887 (granted in 1898 as US 610,861), claiming priority over Eastman's 1888 paper-backed stripping film and 1889 transparent roll film.",
        conflictDetails:
          "After Goodwin's patent issued in 1898, Goodwin Film and Camera Company (later Ansco) sued Eastman Kodak for patent infringement across all Kodak roll film lines (Goodwin Film & Camera Co. v. Eastman Kodak Co.).",
        resolution:
          "In 1914, the Second Circuit Court of Appeals held that Goodwin was the original inventor of flexible transparent roll film and found Eastman Kodak guilty of infringement.",
        legalOutcome:
          "Eastman Kodak was ordered to pay Ansco a cash settlement of $5,000,000 in 1914 (~$150 million inflation-adjusted), settling one of the largest corporate patent damages awards in early American photographic history.",
      },
    ],
    civilizationalImpact:
      "The grant documents a complete mechanical architecture for a portable prepared-film camera, including exposure, light sealing, and film handling.",
    aftermath:
      "No post-grant litigation or commercial outcome is asserted here because it is not established by the pinned facsimile.",
    sideNotes: [
      "The printed specification cites Eastman's Patents Nos. 317,019, 317,050, and 316,933 and a prior application, Serial No. 199,329, filed April 19, 1886.",
    ],
  },
  tags: ["camera", "photography", "roll film", "shutter", "optics"],
  stats: { totalClaims: 41, independentClaims: 41 },
};
