import { bardeenTransistorArchivalEdition } from "@/data/editions/bardeenTransistorEdition";
import type { Patent } from "@/types/patent";

const claimText = (number: number) => {
  const block = bardeenTransistorArchivalEdition.blocks.find(
    (candidate) => candidate.kind === "claim" && candidate.number === number,
  );
  if (!block || block.kind !== "claim") throw new Error(`US 2,524,035 is missing claim ${number}.`);
  return block.inlines.map((inline) => inline.text).join("");
};

const companions: Readonly<Record<number, string>> = {
  1: "Claims the core three-terminal element: opposite-type surface layer, emitter and collector on that layer, and a base on the body. The collector is expressly positioned to collect current spreading from the emitter.",
  2: "Narrows claim 1 to a surface layer made from the same chemical material as the block, so the distinction is conductivity behavior rather than a dissimilar deposited semiconductor.",
  3: "Narrows the basic element to germanium, the material used in the worked example, without importing all of the example's fabrication steps into claim 1.",
  4: "Narrows the material arrangement to N-type germanium supporting a P-type germanium surface layer, preserving both the bulk and surface conductivity assignments.",
  5: "Narrows the basic device to high-back-voltage germanium whose surface received anodic oxidation treatment, capturing a specified preparation route rather than every possible surface treatment.",
  6: "Restates the functional device with a supporting body and opposite-type surface layer, but makes the collector's separate contact location and current-collection role explicit alongside the base contact.",
  7: "Adds a dimensional relation: the emitter contact area must be large relative to layer thickness, a limitation directed at reducing contact resistance against the thin sheet.",
  8: "Narrows the claim-6 emitter to a point contact. It does not independently impose a point collector or a particular metal.",
  9: "Requires both emitter and collector to be point contacts, preserving the close localized electrode geometry of the preferred point-contact embodiment.",
  10: "Requires emitter and collector rectification through the semiconductor layer, distinguishing their junction behavior from the base's stated body contact.",
  11: "Specifies collector-emitter spacing of about one to two mils, a close spacing limitation directed to collection of current spreading in the surface layer.",
  12: "Defines spacing relationally rather than numerically: small versus layer area, but still large versus layer thickness. Both comparisons limit the claimed geometry.",
  13: "Adds a high-resistance barrier between body and surface layer plus a wide-area base on the opposite face, preserving the specified support and return-contact arrangement.",
  14: "Adds bias means: the emitter supplies carriers of the layer's conductive sign and the collector is biased to collect carriers of that same sign.",
  15: "Adds the operating circuits to claim 6: a collector-base work circuit and a separate emitter-base signal application. The claim therefore couples device structure to signal use.",
  16: "Claims the electrostatic model explicitly: fixed body charge, same-sign mobile charge in a barrier-separated surface layer, emitter injection, and a collector field between collector and fixed body charge.",
  17: "Claims a semiconductive body with a thin barrier-separated surface layer, close electrodes including one sharp conductive point, and a third body contact. It preserves the unusual printed barrier wording.",
  18: "Claims a low-resistance surface electrode plus multiple rectifying surface electrodes, with one forward-biased and another reverse-biased through connections using the first electrode.",
  19: "Refines the multiple-electrode bias scheme by requiring the forward bias to be smaller and the reverse bias to be larger, retaining their polarity relationship.",
  20: "Adds a geometrical limit to the multiple-contact device: the rectifying contacts are no farther apart than the block's smallest dimension, alongside the unequal forward and reverse biases.",
  21: "Claims the collector load circuit directly: a reverse-poled source draws current through a collector rectifying contact while another rectifying electrode controls that current's magnitude.",
  22: "Narrows the immediately preceding loaded collector combination to germanium; it depends on claim 21's collector contact, source, load, and control electrode.",
  23: "Defines a translating device by impedance roles: a high-impedance output through a reverse rectifying contact and a low-impedance input through a forward rectifying contact sharing one electrode.",
  24: "Claims the full amplification causal chain: forward emitter injection of opposite-sign mobile charge, reverse collector withdrawal at high impedance, and charge accumulation that changes collector-contact impedance and amplifies both voltage and current components.",
  25: "Claims the opposite-type layer transistor with base-emitter input and base-collector loaded output, the conventional common-base allocation of the three terminals.",
  26: "Claims the same material and electrode arrangement with emitter-base input and emitter-collector loaded output, preserving this distinct external circuit allocation.",
  27: "Claims the same device with collector-base input and collector-emitter loaded output, completing a third stated choice of terminal connection.",
  28: "Claims a generalized translating circuit with two rectifiers, another contact, input-current variations, load, forward-poled input bias, and reverse-poled output bias. Each circuit path and polarity is stated.",
  29: "Narrows claim 28 by placing the load between the other rectifier contact and the other contact; no alternative load position is claimed by this dependent clause.",
  30: "Narrows claim 28 by placing the load between the two rectifier contacts, a different circuit topology from the load placement in claim 29.",
  31: "Further narrows the two-rectifier load topology by requiring the first circuit to connect to the first rectifier independently of the load.",
  32: "Uses a common circuit portion for the two stated circuits and requires one load terminal to join the first rectifier contact, retaining all claim-28 prerequisites.",
  33: "Claims an emitter engaging a local region of inverted conductivity, a collector that collects emitter-supplied current, and a base contact used to vary that current's magnitude.",
  34: "Narrows claim 33 by requiring the collector to make reverse rectifier contact, adding a junction-polarity limitation to the inversion-region arrangement.",
  35: "Adds injection through the emitter, withdrawal through the collector, opposite-sign carrier transport in the body, and an emitter-base applied signal whose amplified component appears in collector current.",
  36: "Narrows claim 6 to a truncated-pyramid supporting body with the surface layer on its smallest face, preserving an explicit physical form rather than a generic block.",
  37: "Narrows claim 6 to a body having a substantial face whose surface layer occupies only a small part, distinguishing partial from full-face layer coverage.",
  38: "Claims injection and withdrawal by carrier sign rather than a named layer: a low-resistance base, spaced emitter biased to inject the minority sign, and an output connection biased to withdraw it.",
  39: "Claims a translating device with separate input-energy application in a body region away from collector, plus a collector-base output whose opposing-polarity bias attracts the established mobile charges.",
  40: "Claims a body with portions of different conductivity types, an emitter on the first portion, a collector that collects emitter-supplied current, and a low-resistance base on the other portion that varies it.",
};

const dependentOn: Readonly<Record<number, readonly number[]>> = {
  2: [1], 3: [1], 4: [1], 5: [1], 7: [6], 8: [6], 9: [6], 10: [6], 11: [6], 12: [6], 13: [6], 14: [6], 15: [6], 22: [21], 29: [28], 30: [28], 31: [28], 32: [28], 34: [33], 35: [6], 36: [6], 37: [6],
};
const independent = new Set([1, 6, 16, 17, 18, 19, 20, 21, 23, 24, 25, 26, 27, 28, 33, 38, 39, 40]);

export const bardeenTransistor2524035Patent: Patent = {
  id: "us-2524035-bardeen-transistor",
  patentNumber: "US 2,524,035",
  title: "Three-Electrode Circuit Element Utilizing Semiconductive Materials",
  shortTitle: "Bardeen and Brattain Point-Contact Transistor",
  subtitle: "Forward emitter injection and reverse collector capture in a semiconductor surface layer",
  inventors: ["John Bardeen", "Walter H. Brattain"],
  inventorLocation: "Summit and Morristown, New Jersey",
  grantDate: "1950-10-03",
  filingDate: "1948-06-17",
  era: "Semiconductor Revolution (1950–1975)",
  category: "computing",
  categoryLabel: "Solid-State Physics & Semiconductors",
  summary: "US 2,524,035 claims a three-electrode semiconductor circuit element in which a forward-biased emitter supplies carriers through an opposite-type surface layer and a reverse-biased collector receives a portion of the resulting current. The application was filed June 17, 1948 and the grant issued October 3, 1950.",
  heroQuote: "The collector is so disposed in relation to the emitter that a large fraction of the emitter current enters the collector.",
  originalPdfUrl: "/patents/pdfs/us-2524035-bardeen-transistor.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US2524035A/en",
  usptoClassification: "Cl. 179-171",
  originalText: "This invention relates to a novel method of and means for translating electrical variations for such purposes as amplification, wave generation, and the like. The present invention in one form utilizes a block of semiconductor material on which three electrodes are placed. One of these, termed the collector, makes rectifier contact with the body of the block. The other, termed the emitter, preferably makes rectifier contact with the body of the block also. The third electrode, which may be designated the base electrode, preferably makes a low resistance contact with the body of the block.",
  originalTextAsset: {
    url: "/patents/transcripts/us-2524035-bardeen-transistor-reviewed.txt",
    pageCount: 14,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (GPT-5)",
    reviewedAt: "2026-08-18",
    sourcePdfSha256: "6de62de550a221c5380088e0485c2ae6955334a199b6da15ff3dcd6ca65978de",
  },
  archivalEdition: bardeenTransistorArchivalEdition,
  plainEnglishExplanation: {
    overview: "The patent turns a surface-layer carrier current into a controllable high-impedance collector current. Its legal core is not simply any modern transistor: it specifies a body, opposite-type surface region, close emitter and collector contacts, and their stated bias and collection relationships.",
    coreMechanism: "Forward emitter bias injects carriers into the surface layer; a nearby reverse-biased collector shapes an electric field and captures part of the spreading carrier current. A small emitter signal changes collector current through a high load impedance, enabling voltage and power gain.",
    mechanicalBreakdown: [
      { title: "Supporting semiconductor body", summary: "The bulk material supports the surface layer and base contact.", technicalDetails: "The source distinguishes N- and P-type carrier populations and places the base at low resistance to the body; surface and bulk are separated by a high-resistance barrier where specified.", archaicTerm: "semiconductive supporting body", modernEquivalent: "semiconductor substrate" },
      { title: "Emitter and collector contacts", summary: "Close rectifying contacts create injection and collection regions.", technicalDetails: "The emitter is forward-biased and the collector reverse-biased. Their short separation lets current spread in the layer and enter the collector field before it crosses to the base.", archaicTerm: "point contact", modernEquivalent: "localized metal-semiconductor contact" },
      { title: "Bias and external circuits", summary: "A low-impedance input drives the emitter while a higher-impedance collector circuit delivers output.", technicalDetails: "The patent identifies conventional, grounded-grid, grounded-plate, and feedback connections, but makes the carrier and polarity conditions—not a tube metaphor—the operating limitation." },
    ],
    scientificPrinciples: [
      { principle: "Carrier injection and collection", formula: "I_C = I_{C0}(V_C) + a f(V_E + R_s I_C)", explanation: "The source presents collector current as a reverse-bias contribution plus a term controlled by emitter voltage and feedback through surface resistance." },
      { principle: "Electric field across a barrier", formula: "E \u2248 V/d", explanation: "A reverse collector bias across the very thin surface-layer and barrier region supplies the field that bends current paths and changes collector contact impedance." },
    ],
    whyItMattersToday: "The grant documents an early practical solid-state amplifier and articulates the carrier, contact, impedance, and bias relationships that made transistor action an engineered circuit element rather than a rectifier alone.",
  },
  claims: Array.from({ length: 40 }, (_, index) => {
    const number = index + 1;
    return { number, isIndependent: independent.has(number), ...(dependentOn[number] ? { dependsOn: [...dependentOn[number]] } : {}), originalText: claimText(number), plainEnglish: `${companions[number]} The decoder does not remove the stated contacts, carrier signs, circuit position, or dimensional condition from the legal limitation.`, keyInnovations: ["Semiconductor carrier control", `Claim ${number} limitation`] };
  }),
  drawings: [
    { figureNumber: "Fig. 1", title: "Preferred circuit element", caption: "The printed drawing shows block 1, plated base 2, surface layer 3, barrier 4, emitter 5, collector 6, and the input/output transformers.", svgType: "bardeen-transistor", callouts: [
      { id: "bardeen-1", figureRef: "Fig. 1", label: "1", element: "Block", description: "Semiconductor block.", x: 50, y: 48 },
      { id: "bardeen-5", figureRef: "Fig. 1", label: "5", element: "Emitter", description: "Forward-biased rectifying contact.", x: 45, y: 28 },
      { id: "bardeen-6", figureRef: "Fig. 1", label: "6", element: "Collector", description: "Nearby reverse-biased contact.", x: 57, y: 28 },
    ] },
    { figureNumber: "Fig. 3", title: "Current fields", caption: "Plan views compare current stream lines without the collector field and with its distortion.", svgType: "bardeen-transistor", callouts: [] },
    { figureNumber: "Fig. 15", title: "Potential distribution", caption: "Energy-band curves depict the thin P-type layer and N-type body separated by a barrier.", svgType: "bardeen-transistor", callouts: [] },
  ],
  historicalContext: { problemStatement: "The specification seeks amplification and signal translation without a heated cathode or evacuated envelope.", priorArtLimitations: ["Earlier solid rectifier amplifier proposals relied on embedded grids or transverse fields that the specification says were too fine to fabricate successfully."], breakthroughInsight: "A close forward emitter and reverse collector can use a surface layer and barrier to couple carrier injection into a high-impedance collector response.", patentWars: [], civilizationalImpact: "The document records an early semiconductor amplifier architecture built around carrier injection, rectifying contacts, and impedance transformation." },
  tags: ["semiconductors", "transistor", "germanium", "amplification"],
  stats: { totalClaims: 40, independentClaims: 18 },
};
