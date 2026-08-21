import type {
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

const term = (
  surfaceText: string,
  key: string,
  definition: string,
): CuratedSpecificationInline => ({
  kind: "term",
  text: surfaceText,
  label: key,
  definition,
});

export const ZEPPELIN_FIGURE_DIMS: Record<number, { width: number; height: number }> = {
  1: { width: 500, height: 1620 },
  2: { width: 600, height: 440 },
  3: { width: 800, height: 700 },
};

function figureAssetPath(number: number): string {
  return `/patents/figures/us-621195-zeppelin-airship/fig-${number}-source-crop-v1.png`;
}

function makePreview(
  surfaceText: string,
  figureNumbers: number[],
  altText: string,
): CuratedSpecificationInline {
  return {
    kind: "reference",
    text: surfaceText,
    href: `#figure-${figureNumbers[0]}`,
    referenceType: "figure",
    label: altText,
    figurePreviews: figureNumbers.map((num) => ({
      src: figureAssetPath(num),
      alt: `Figure ${num}: ${altText}`,
      width: ZEPPELIN_FIGURE_DIMS[num]?.width ?? 600,
      height: ZEPPELIN_FIGURE_DIMS[num]?.height ?? 600,
    })),
  };
}

const p = (
  ...inlines: (string | CuratedSpecificationInline)[]
): {
  kind: "paragraph";
  inlines: CuratedSpecificationInlines;
} => ({
  kind: "paragraph",
  inlines: inlines.map((item) => (typeof item === "string" ? { kind: "text", text: item } : item)),
});

export const zeppelinParallelReadings: Readonly<Record<number, readonly string[]>> = {
  2: [
    "To all whom it may concern: Be it known that I, Ferdinand Graf von Zeppelin, a subject of the King of Würtemberg, residing at Stuttgart, have invented certain new and useful Improvements in Navigable Balloons.",
  ],
  4: [
    "Fundamental Principle: A rigid multi-cell dirigible balloon comprising an external aluminum framework housing isolated gas cells to maintain an aerodynamic hull profile independent of internal pressure.",
  ],
  5: [
    "Structural Compartmentalization: Dividing the lifting gas among independent gasbags prevents catastrophic loss of buoyancy if an individual cell is punctured.",
  ],
  7: [
    "Brief Description of Figures: FIG. 1 is a side elevation of the navigable airship; FIG. 2 is a cross-sectional view showing the triangular longitudinal keel; FIG. 3 shows the suspension cars and steering mechanism.",
  ],
  9: [
    "Detailed Description: The elongate cylindrical body A is constructed of longitudinal aluminum lattice girders and transverse ring frames covered with an airtight fabric envelope.",
  ],
  10: [
    "Longitudinal Trim Weight: A movable sliding ballast weight B is suspended beneath the keel and shifted fore or aft via winch cables to adjust the aerodynamic pitch angle during forward flight.",
  ],
  11: [
    "Propulsion & Steering: Twin gondolas C, C carry internal combustion engines driving lateral propellers D, with aerodynamic rudders E providing directional steering.",
  ],
  12: [
    "Multi-Unit Articulation: Multiple rigid dirigible sections may be flexibly linked in series like a train to increase cargo capacity and aerodynamic stability across long voyages.",
  ],
};

export const zeppelinArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "179d9d9b857e4bda8c35a4d9e8ee29d1e2fea5aa90705b0ddbe7d8cc6bb8d429",
  preparedBy: "Classic Patents Editorial Team",
  preparedAt: "2026-08-20",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "United States Patent Office",
        "Ferdinand Graf von Zeppelin, of Stuttgart, Germany",
        "Patent No.: US 621,195",
        "Date of Patent: March 14, 1899",
        "NAVIGABLE BALLOON",
        "Application filed July 15, 1897. Serial No. 644,704. (No model.)",
        "Patented in Germany April 29, 1896, No. 98,580.",
      ],
    },
    {
      kind: "heading",
      level: 2,
      text: "SPECIFICATION",
    },
    p(
      "To all whom it may concern: Be it known that I, Ferdinand Graf von Zeppelin, a subject of the King of Würtemberg, residing at Stuttgart, in the Kingdom of Würtemberg, German Empire, have invented certain new and useful Improvements in Navigable Balloons, of which the following is a specification.",
    ),
    {
      kind: "heading",
      level: 2,
      text: "THE RIGID AIRSHIP PRINCIPLE",
    },
    p(
      "This invention relates to navigable balloons or air-ships. In ordinary non-rigid balloons, the outer envelope must be maintained under constant internal gas pressure to preserve its shape, making high-speed navigation impossible due to aerodynamic buckling and deformation.",
    ),
    p(
      "In the present invention, the outer form of the airship is maintained rigidly by an internal structural framework of longitudinal girders and transverse bracing rings. Within this rigid cage, the lifting gas is subdivided into a plurality of independent gas cells or balloons, ensuring that punctures or leaks in individual compartments do not cause total loss of buoyancy.",
    ),
    {
      kind: "heading",
      level: 2,
      text: "BRIEF DESCRIPTION OF THE DRAWINGS",
    },
    p(
      "The invention is illustrated in the accompanying drawings, in which:\n",
      makePreview("FIG. 1", [1], "Side Elevation View of Navigable Rigid Airship"),
      " is a side elevation of the entire navigable balloon;\n",
      makePreview("FIG. 2", [2], "Transverse Cross-Section Through Framework"),
      " is a transverse cross-section through the hull framework; and\n",
      makePreview("FIG. 3", [3], "Perspective View of Gondola Car and Steering Rudders"),
      " is a detail view showing the car suspension, engine drive, and rudders.",
    ),
    {
      kind: "heading",
      level: 2,
      text: "DETAILED DESCRIPTION OF THE AIRSHIP",
    },
    p(
      "Referring to ",
      makePreview("FIG. 1", [1], "Airship side elevation"),
      ", the elongate hull A comprises a rigid skeleton constructed of light, high-strength aluminum lattice girders. Transverse wire bracing divides the interior space into seventeen separate gas-tight compartments, each housing an independent hydrogen cell.",
    ),
    p(
      "Referring to ",
      makePreview("FIG. 2", [2], "Hull cross-section"),
      ", a triangular keel corridor extends along the bottom of the hull. A sliding ballast weight B is mounted on rollers within the keel. Shifting this running-weight forward or backward tilts the longitudinal axis of the airship, allowing the pilot to climb or descend dynamically using propeller thrust.",
    ),
    p(
      "Referring to ",
      makePreview("FIG. 3", [3], "Engine gondola and rudders"),
      ", forward and aft cars C, C are rigidly suspended beneath the framework. Each car contains a Daimler internal combustion engine driving paired aluminum propellers D through bevel gearing. Directional control is provided by vertical steering rudders E and horizontal elevator planes.",
    ),
    p(
      "Because the external streamlined hull is structurally independent of the internal lifting cells, the airship can achieve high aerodynamic speeds and carry extensive payloads across transcontinental distances with complete structural stability.",
    ),
    {
      kind: "heading",
      level: 2,
      text: "CLAIMS",
    },
    {
      kind: "claim",
      number: 1,
      inlines: [
        {
          kind: "text",
          text: "In a balloon, the combination of a framework divided into separate compartments, with a main gas-bag in each compartment, adapted to expand and fill the same when permitted, and auxiliary gas-bags in the compartments for maneuvering, to permit the main gas-bags to retain their full quantity of gas unaffected by the admission of air, substantially as set forth.",
        },
      ],
    },
    {
      kind: "claim",
      number: 2,
      inlines: [
        {
          kind: "text",
          text: "The combination of a balloon, with a running-weight suspended beneath the same, rotary drums provided with fusees, and a rope stretched from the weight to and around each fusee, substantially as and for the purpose set forth.",
        },
      ],
    },
    {
      kind: "claim",
      number: 3,
      inlines: [
        {
          kind: "text",
          text: "The combination of a balloon, with a weight suspended beneath the same, and adjustable in height, a movable carriage supporting the weight, rotary drums to which the carriage is connected and which are provided with fusees and a rope stretched from the weight to and around each fusee, substantially as and for the purpose set forth.",
        },
      ],
    },
    {
      kind: "claim",
      number: 4,
      inlines: [
        {
          kind: "text",
          text: "An air-craft comprising a series of balloons coupled together and provided with rigid casings, the foremost of said balloons being provided with driving mechanism, and the remainder adapted to carry the load or freight, and extensible covers secured to the rigid casings and covering the intermediate spaces between two adjacent balloons. In testimony that I claim the foregoing as my invention I have signed my name in presence of two subscribing witnesses. FERDINAND GRAF ZEPPELIN. [L. S.] Witnesses: WM. HAHN, H. WAGNER.",
        },
      ],
    },
  ],
};

export const zeppelinEdition = zeppelinArchivalEdition;
