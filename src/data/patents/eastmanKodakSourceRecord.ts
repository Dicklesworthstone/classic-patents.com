import type { Patent } from "@/types/patent";
import {
  eastmanKodakArchivalEdition,
} from "@/data/editions/eastmanKodakEdition";

function manualClaimText(number: number): string {
  const block = eastmanKodakArchivalEdition.blocks.find(
    (candidate) => candidate.kind === "claim" && candidate.number === number,
  );
  if (block?.kind !== "claim") throw new Error(`Eastman manual edition is missing claim ${number}.`);
  return block.inlines.map((inline) => inline.text).join("");
}

const claimPlainEnglish: readonly string[] = [
  "Claims the overall camera arrangement: a tubular box, removable rear film holder, front block, and removable lens-and-shutter assembly located inside that front block.",
  "Claims the front chamber arrangement specifically: the case and partition make a chamber with aligned openings that holds the fixed lens support and the rotary shutter mechanism.",
  "Claims the two-aperture front construction in more detail, including a fixed block, co-operating cap, internal lens, and shutter carried by the lens support.",
  "Claims the basic relationship of a shutter that surrounds the lens and has matching openings. It does not claim a retail Kodak camera name or an exposure speed.",
  "Claims a shutter placed on both sides of the lens so its coincident openings uncover both faces from opposite edges at the same time.",
  "Claims intermediate opaque plates and an operating mechanism that alternately covers and uncovers both sides of the lens together.",
  "Claims the double shutter wrapped around the lens on a pivot and intermittently rotated so both faces are opened together.",
  "Claims the fixed lens support and encircling shutter whose axis of intermittent rotation is transverse to the optical axis.",
  "Claims a hollow shutter with matching openings, mounted pivotally on the lens support that carries the lens.",
  "Claims the lens and surrounding hollow shutter as a complete attachment that can be applied to a camera body.",
  "Claims the combined lens holder and intermittently rotating enclosing shutter, emphasizing that the shutter is wholly sustained by the lens support.",
  "Claims the lens support, encircling shutter, drive, and release-and-stop devices as an operative shutter unit.",
  "Claims a pivotal hollow shutter with coincident openings, a motor, stops and release controls, and a lens fixed within the shutter.",
  "Claims a connected lens-support and shutter module inserted into a front recess and held by the enclosing walls of the camera box.",
  "Claims the nested arrangement of a lens held inside a hollow shutter that is closed at both ends and has aligned openings.",
  "Claims a shutter pivoted on the lens support, with its motor on one end and release device on the other end.",
  "Claims that the shutter's motor and release controls are mounted on the same lens-support as the shutter they control.",
  "Claims the front chamber that receives the lens-support and shutter, including aligned apertures and shutter openings that move in the plane of the optical axis.",
  "Claims the winding train: a wheel, spring between wheel and shutter, ratchet, and drum that winds the spring through a ratchet connection.",
  "Claims the lens-support-mounted ratchet, spring, winding drum, and release device at opposite shutter ends as a compact motor assembly.",
  "Claims the rotating shutter's opposing abutments and beveled pivoted latch, the parts that stop and release each half-turn.",
  "Claims the rotary shutter and its motor and release controls when all sit between the support heads that retain the lens-support in the camera.",
  "Claims the post-supported lens-support, hollow shutter journaled on its posts, latch at one shutter end, and motor at the other.",
  "Claims a continuously driven pivoted tubular shutter, alternately engaging latch, and tension device that regulates movement.",
  "Claims the shutter cam plate and abutments with a latch pivoted in the support post and moved by the push-pin through the support head.",
  "Claims the rotating shutter's cam plate, latch, and spring working as both brake and stop.",
  "Claims the front apertured block and transverse groove that receives the combined lens-support and shutter.",
  "Claims the sectional front block with aligned apertures and transverse chamber for the lens-support and shutter module.",
  "Claims the externally accessible flexible winding connection and push-pin release in a camera whose lens-support and shutter unit sits in a forward chamber.",
  "Claims the detachable lens-and-shutter unit itself: a lens and enclosing shutter carried together on one frame for insertion into the camera.",
  "Claims the detachable supporting frame, lens aperture, pivoted hollow shutter around the lens, and frame-carried shutter actuator.",
  "Claims the removable rear film carrier, including supply spool, guide rolls, platen, and winding roller, all between side-piece outer faces so it fits inside the case.",
  "Claims the roller-holder's removable spool supports passing through its side pieces while remaining flush with or below their outer faces.",
  "Claims the particular socket, pin, head, countersink, and stud arrangement that retains a roller support in the camera's fitted side pieces.",
  "Claims the detachable film-roller support using two pins, a countersunk head, socket plate, and stud-and-slot retention relation.",
  "Claims a light-tight rear roller-holder whose flush indicator and removable winding key are reached through case openings without exposing the film chamber.",
  "Claims the rear-inserted roller-holder and detachable winding key that both drives the film and locks the holder against longitudinal motion.",
  "Claims a shutter that simultaneously covers and uncovers the front and rear of the lens tube or aperture.",
  "Claims the paired light-excluding shutter media positioned in front of and behind the lens, moving together to cover or uncover both lens faces.",
  "Claims the enclosing tube and two separately positioned light-excluding media, plus their common actuating devices.",
  "Claims the overall open-ended box, front lens-and-diaphragm closure, and rear-inserted roller-holder held against the case walls.",
];

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
      { title: "Front block and chamber", summary: "A sectional front block receives the removable lens-and-shutter unit while excluding stray light.", technicalDetails: "The patent calls the chamber b'. Its matched openings and close-fitting sections create a controlled optical path rather than an open camera interior.", archaicTerm: "Block or diaphragm", modernEquivalent: "Light-tight front bulkhead" },
      { title: "Cylindrical shutter", summary: "A hollow cylinder with coincident openings surrounds the lens.", technicalDetails: "At rest the opaque cylinder covers both lens faces. During a controlled half-revolution the aligned openings cross the optical axis, admitting light through the lens before the latch stops the shutter again.", archaicTerm: "Cylindrical shutter", modernEquivalent: "Rotary barrel shutter" },
      { title: "Spring drive and release", summary: "An external cord winds a spring through a ratchet; a push-pin and latch release and arrest motion.", technicalDetails: "The ratchet prevents reverse winding. Cam abutments, the pivoted latch, and spring 27 determine the shutter's stop positions and prevent more than a half-revolution per release.", archaicTerm: "Motor mechanism", modernEquivalent: "Spring-powered shutter drive" },
      { title: "Roller-holder", summary: "The rear assembly carries prepared film, guides it over a platen, and winds it forward.", technicalDetails: "Supply and winding spools, guide rollers, a platen, a tension device, detaining mechanism, and measuring indicator are mounted between side pieces so the holder can slide into the tubular case.", archaicTerm: "Roller-holder", modernEquivalent: "Removable roll-film carrier" },
    ],
    scientificPrinciples: [
      { principle: "Light exclusion", explanation: "Photography requires the sensitive film to see light only through the intended lens aperture. The patent repeatedly protects that condition with overlapping covers, chambers, flush controls, and shutters on both sides of the lens." },
      { principle: "Rotational energy storage", explanation: "A wound spring stores mechanical energy. Ratchets transmit winding torque in one direction and the latch-and-abutment system converts the stored energy into a bounded shutter rotation." },
    ],
    whyItMattersToday:
      "The document is a detailed example of system-level camera engineering: optical admission, light sealing, release control, modular service, film transport, and frame indication are treated as coupled mechanisms rather than as an isolated lens or shutter.",
  },
  claims: claimPlainEnglish.map((plainEnglish, index) => ({
    number: index + 1,
    isIndependent: true,
    originalText: manualClaimText(index + 1),
    plainEnglish,
    keyInnovations: index < 31 ? ["Lens-support and cylindrical shutter mechanism"] : ["Removable roller-holder and film transport"],
  })),
  drawings: [
    { figureNumber: "Fig. 1", title: "Complete camera", caption: "Perspective source drawing of the complete instrument.", svgType: "eastman-kodak", callouts: [{ id: "eastman-a", figureRef: "Fig. 1", label: "A", element: "Camera box or case", description: "The rectangular tube that receives the front block and rear roller-holder.", x: 53, y: 47 }, { id: "eastman-b", figureRef: "Fig. 1", label: "B", element: "Front block", description: "The front block or diaphragm that contains the lens-support and shutter chamber.", x: 31, y: 62 }] },
  ],
  historicalContext: {
    problemStatement: "The source identifies the need for a simple, compact, readily portable camera that can hold prepared film while excluding unwanted light from the exposing chamber.",
    priorArtLimitations: ["The facsimile does not provide a comparative prior-art narrative."],
    breakthroughInsight: "Eastman combines a removable front lens-and-shutter module with a removable rear roller-holder in a tubular, light-tight case.",
    patentWars: [],
    civilizationalImpact: "The grant documents a complete mechanical architecture for a portable prepared-film camera, including exposure, light sealing, and film handling.",
    aftermath: "No post-grant litigation or commercial outcome is asserted here because it is not established by the pinned facsimile.",
    sideNotes: ["The printed specification cites Eastman's Patents Nos. 317,019, 317,050, and 316,933 and a prior application, Serial No. 199,329, filed April 19, 1886."],
  },
  tags: ["camera", "photography", "roll film", "shutter", "optics"],
  stats: { totalClaims: 41, independentClaims: 41 },
};
