/**
 * Explicit, content-pinned figure acceptance evidence for archival editions.
 *
 * This registry is deliberately not inferred at runtime from file existence. Each
 * entry preserves the reviewer/date attached to the accepted edition and pins the
 * exact edition digest, active asset set, image dimensions, and asset-byte digest.
 * Adding or changing a crop requires a new reviewed attestation; otherwise the
 * publication state fails closed. Legacy source-page rectangles remain null in the
 * runtime evidence until their patent-specific archival beads record them.
 */

export interface AcceptedFigureAssetEvidence {
  sha256: string;
  width: number;
  height: number;
}

export interface ArchivalFigureAcceptanceAttestation {
  sourcePdfSha256: string;
  reviewer: string;
  reviewedAt: string;
  acceptanceBasis: "migrated-reviewed-edition-attestation" | "independent-figure-review";
  acceptedOccurrenceCount: number;
  assets: Readonly<Record<string, AcceptedFigureAssetEvidence>>;
}

export const ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS = {
  "us-1219881-sundback-zipper": {
    sourcePdfSha256: "8b73a4db400d449ec6349a07c05b38df6f5bed609562a2c96ba893890a41a3b9",
    reviewer: "Classic Patents editorial agent (Gemini 3.7 Flash)",
    reviewedAt: "2026-09-01",
    acceptanceBasis: "migrated-reviewed-edition-attestation",
    acceptedOccurrenceCount: 25,
    assets: {
      "/patents/figures/us-1219881-sundback-zipper/fig-1-source-crop-v1.png": {
        sha256: "c6aeea22fa10393aa0beafb4113eac7f3a7846b8ab0f3715359f1df15167bf8d",
        width: 1166,
        height: 1699,
      },
      "/patents/figures/us-1219881-sundback-zipper/fig-2-source-crop-v1.png": {
        sha256: "b1d8d051ab76e87ad36e4b1d6e3420b0dae3ac26aca0be002261a528c383ede0",
        width: 872,
        height: 1078,
      },
      "/patents/figures/us-1219881-sundback-zipper/fig-3-source-crop-v1.png": {
        sha256: "284b3efba38b72b1b9d641454d785e126638ac3c19020a7d386fa865c66fd621",
        width: 833,
        height: 649,
      },
      "/patents/figures/us-1219881-sundback-zipper/fig-4-source-crop-v1.png": {
        sha256: "3c4ff14f263b7dbfd7d39aae7ca16b381f99e1a5bb21becc9971d74c6d46cd0b",
        width: 495,
        height: 729,
      },
      "/patents/figures/us-1219881-sundback-zipper/fig-5-source-crop-v1.png": {
        sha256: "033a4bd565f202a520cff634be31e7f32c0d85150192312aef287e2ff919e674",
        width: 549,
        height: 701,
      },
      "/patents/figures/us-1219881-sundback-zipper/fig-6-source-crop-v1.png": {
        sha256: "2c9f4b74bb807ddecc37b10c889bb9971add34647d31a7553645e69e9f972e9a",
        width: 554,
        height: 729,
      },
      "/patents/figures/us-1219881-sundback-zipper/fig-7-source-crop-v1.png": {
        sha256: "589ae499112201de22814bda1f500a233dd12d6fff8bbb8a4d25b9b04172a9ad",
        width: 427,
        height: 660,
      },
      "/patents/figures/us-1219881-sundback-zipper/fig-8-source-crop-v1.png": {
        sha256: "b884819637089ae69e8534b8c21fd9780f9589511441c699ed830205b5c408f1",
        width: 1044,
        height: 451,
      },
      "/patents/figures/us-1219881-sundback-zipper/fig-9-source-crop-v1.png": {
        sha256: "0e8785cd62e665ade77d2d8cfc20732f9df9ab6462b9a5abc2cb351cbdcfdd62",
        width: 852,
        height: 412,
      },
    },
  },
  "us-124404-westinghouse-air-brake": {
    sourcePdfSha256: "4071920f448fd1c3c5d8b5d593963e629adc0b3ae91212aae23cfad3d95ed665",
    reviewer: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-08-18",
    acceptanceBasis: "migrated-reviewed-edition-attestation",
    acceptedOccurrenceCount: 22,
    assets: {
      "/patents/figures/us-124404-westinghouse-air-brake/fig-1-source-crop.png": {
        sha256: "f2017447d96e5daea3264e46d3d42f87a9aecf90ac4c0d05c2afdcadbe86ff92",
        width: 1540,
        height: 900,
      },
      "/patents/figures/us-124404-westinghouse-air-brake/fig-2-source-crop.png": {
        sha256: "8fe595e7e0f347be13071354a7a909f1fbd0a40a71263498fe396ebf414a0f0a",
        width: 800,
        height: 650,
      },
      "/patents/figures/us-124404-westinghouse-air-brake/fig-3-source-crop.png": {
        sha256: "9792ee5202d3cee6d8b58dd956eebe66941bd24452465685e85e6f656a8b7ec4",
        width: 800,
        height: 650,
      },
      "/patents/figures/us-124404-westinghouse-air-brake/fig-4-source-crop-v2.png": {
        sha256: "d9ebfd783f3454859a9fbb66ef425355671cc59bdf199fffb04c21f477e66a3d",
        width: 430,
        height: 520,
      },
      "/patents/figures/us-124404-westinghouse-air-brake/fig-5-source-crop.png": {
        sha256: "9a9134a06b39251b30aa974ee71cc5e5dc7bdfebd985f214ec220a7ffa756349",
        width: 830,
        height: 460,
      },
      "/patents/figures/us-124404-westinghouse-air-brake/fig-6-source-crop.png": {
        sha256: "e2b259b40adf4f92c30e75d43c9716f03890b9c2dba39af4adb40b7799fa1f1c",
        width: 900,
        height: 400,
      },
    },
  },
  "us-135245-pasteur-fermentation": {
    sourcePdfSha256: "7c9145e813b652e9da76472a8e6d0b2fa3088aeb1cea34b5ae3163f4d673a649",
    reviewer: "CopperLotus; GoldStone full facsimile repair review",
    reviewedAt: "2026-08-20",
    acceptanceBasis: "migrated-reviewed-edition-attestation",
    acceptedOccurrenceCount: 3,
    assets: {
      "/patents/figures/us-135245-pasteur-fermentation/figure-1-v3.png": {
        sha256: "8c5e6f806cc5570a6364168b31e4dc3dcc48a85b2f73494574dce363bbf78541",
        width: 1750,
        height: 1150,
      },
      "/patents/figures/us-135245-pasteur-fermentation/figure-2-v3.png": {
        sha256: "adec6a5da1c2b0b36d2fe40412a06bb4bfcd27342fad78bbeec573195474658f",
        width: 900,
        height: 750,
      },
    },
  },
  "us-1647-morse-telegraph": {
    sourcePdfSha256: "07a534f54894e6130980052a77c565492e53d6cd527c092b47016e8cc243ed93",
    reviewer:
      "Classic Patents editorial agents (codex-foxtrot; independent corrective review by GPT-5.6)",
    reviewedAt: "2026-08-18",
    acceptanceBasis: "migrated-reviewed-edition-attestation",
    acceptedOccurrenceCount: 55,
    assets: {
      "/patents/figures/us-1647-morse-telegraph-fig-ex1.png": {
        sha256: "c6f6aeaef10f9980cfd5100ab060b47e5fe2e20da229eabae3d2e202e4c108e3",
        width: 1000,
        height: 300,
      },
      "/patents/figures/us-1647-morse-telegraph-fig-ex10-fig1.png": {
        sha256: "9c1073eaae5ecac457ee24b31d9dc44aa3ccbec2d1fe313e39f0609b126a48a2",
        width: 720,
        height: 300,
      },
      "/patents/figures/us-1647-morse-telegraph-fig-ex10-fig2.png": {
        sha256: "8cd372b545351435928310e07020206bd1a22b7e2251dd07dd18a3ea6cda0c5a",
        width: 760,
        height: 270,
      },
      "/patents/figures/us-1647-morse-telegraph-fig-ex10-fig4.png": {
        sha256: "07fe98039360c1d4a0849e33f3775dacf050c5f64e15aba0aef641a02fcf9871",
        width: 760,
        height: 280,
      },
      "/patents/figures/us-1647-morse-telegraph-fig-ex10-fig5.png": {
        sha256: "544c7317335cfc796dcb3e45a8bf16277c1fda9d32c09c3783f5a632b944be7b",
        width: 600,
        height: 260,
      },
      "/patents/figures/us-1647-morse-telegraph-fig-ex2.png": {
        sha256: "1e4850bc3f6efd66118fb44e2e9f4934b3ab70c3f5d0d84f04ad4eaecc7acff0",
        width: 1050,
        height: 220,
      },
      "/patents/figures/us-1647-morse-telegraph-fig-ex3.png": {
        sha256: "9558d159c3bdac99732aecca130ff876e883a3c6e0b24f9c59fd6918b4b01f79",
        width: 1050,
        height: 190,
      },
      "/patents/figures/us-1647-morse-telegraph-fig-ex4-fig1.png": {
        sha256: "9083bd32c2fa75dd78dd9503383d7b536d8e8dcd102895f669d25eeeaff7804a",
        width: 1000,
        height: 155,
      },
      "/patents/figures/us-1647-morse-telegraph-fig-ex4-fig2.png": {
        sha256: "477bb0912b69e7408db3067babf29a13ff50dea4ff3da67b634d09eec1904c51",
        width: 1000,
        height: 165,
      },
      "/patents/figures/us-1647-morse-telegraph-fig-ex5.png": {
        sha256: "7b1c30c147d6df3b84d6a5f60225f2a152fc3438e2cfb7a2677c95469d0e8125",
        width: 1040,
        height: 230,
      },
      "/patents/figures/us-1647-morse-telegraph-fig-ex6-fig1.png": {
        sha256: "bb085b26057b5cdc88ab880ba0b192c8563d7ed74f3bafe0bbcc73287ed36814",
        width: 420,
        height: 280,
      },
      "/patents/figures/us-1647-morse-telegraph-fig-ex6-fig2.png": {
        sha256: "b1eeccf4ad447ffa2e10e6975b797cd88013809c31c809836104c09d6c31372d",
        width: 440,
        height: 280,
      },
      "/patents/figures/us-1647-morse-telegraph-fig-ex6-fig3.png": {
        sha256: "6fc927a5cf1b0c26fe26113e8862ce51a56ace1b4e5a3f5207f4e35e4083c3e2",
        width: 470,
        height: 280,
      },
      "/patents/figures/us-1647-morse-telegraph-fig-ex7.png": {
        sha256: "692e2de0bfb9ac3d0fe6708673701e3c004023d8db96beee6062d3c949736f6b",
        width: 620,
        height: 190,
      },
      "/patents/figures/us-1647-morse-telegraph-fig-ex8.png": {
        sha256: "4bcaecde83d58440268e267a83dced8f1cc2a048a7ddaf667aa0f90527fffa8e",
        width: 900,
        height: 340,
      },
      "/patents/figures/us-1647-morse-telegraph-fig-ex9-fig1.png": {
        sha256: "46fe10a1bbb3c0c109736416419b7b7a902ffab7654c2cae6baba176a16c8279",
        width: 720,
        height: 400,
      },
      "/patents/figures/us-1647-morse-telegraph-fig-ex9-fig2.png": {
        sha256: "3c942c7782c2a60508500c1826782068e157a827279b8df227dc8d82ce97e7c8",
        width: 380,
        height: 350,
      },
      "/patents/figures/us-1647-morse-telegraph-fig-ex9-fig3.png": {
        sha256: "2966ea0f4c2676a71a140042fb6a5e7636e5382433af3dda877dadb422b4df7a",
        width: 760,
        height: 180,
      },
      "/patents/figures/us-1647-morse-telegraph-fig-ex9-fig4.png": {
        sha256: "5e1898b42a798906df13d83261e8f1371cfdadb847ee7393dab770474c95d90f",
        width: 300,
        height: 300,
      },
    },
  },
  "us-174465-bell-telephone": {
    sourcePdfSha256: "cb1a0fa7bd871937575e240adf904fa3ea8f462b3bfceb4e7cbbb0811909a8e9",
    reviewer: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-08-18",
    acceptanceBasis: "migrated-reviewed-edition-attestation",
    acceptedOccurrenceCount: 24,
    assets: {
      "/patents/figures/us-174465-bell-telephone/fig-1-source-crop.png": {
        sha256: "bc1a67f3ab084bc9beaf990b6ec1178ccd55a5c2fc291a9b6218701cecdf0908",
        width: 980,
        height: 210,
      },
      "/patents/figures/us-174465-bell-telephone/fig-2-source-crop-v2.png": {
        sha256: "94cdc83126139c8c94e8b24a037ea7f914b02e1935b3a46482e1f332ce2f341c",
        width: 1200,
        height: 180,
      },
      "/patents/figures/us-174465-bell-telephone/fig-3-source-crop-v2.png": {
        sha256: "cd9f8adb9edaeb3c19db06c40c66dd51a19d36d5b9a5fe7a84029c7c0763178d",
        width: 1200,
        height: 250,
      },
      "/patents/figures/us-174465-bell-telephone/fig-4-source-crop.png": {
        sha256: "c57ea1b8829bb2fb293619563a238b9d5e5273af2a83c998aaa4bc9b6c56825b",
        width: 1050,
        height: 430,
      },
      "/patents/figures/us-174465-bell-telephone/fig-5-source-crop.png": {
        sha256: "e9c4c8c790daa22097c8c365630e4f400f8413e3a6ca8dcee28b5373c63c9b69",
        width: 1000,
        height: 400,
      },
      "/patents/figures/us-174465-bell-telephone/fig-6-source-crop.png": {
        sha256: "ffa167fa8b8d3dd6fbd1aefa932955f97f93b1bfb9dc2ce26097a03521b2e4ee",
        width: 1120,
        height: 900,
      },
      "/patents/figures/us-174465-bell-telephone/fig-7-source-crop.png": {
        sha256: "6fe1b789d29b6dc4f0db4472e058e79ccae7a979ca3f2cc1d9bb80c4983d4abd",
        width: 1030,
        height: 650,
      },
    },
  },
  "us-1781541-einstein-refrigerator": {
    sourcePdfSha256: "5b67c380be742776b9509862e68e1fc68478a7b1cc92f215ba422efbd76b96e4",
    reviewer: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-08-18",
    acceptanceBasis: "migrated-reviewed-edition-attestation",
    acceptedOccurrenceCount: 2,
    assets: {
      "/patents/figures/us-1781541-einstein-refrigerator/fig-1-source-crop-v1.png": {
        sha256: "22d451b153876701f7e16ecb4b6eabb32e5f5f182e412cfed9cc859ba1b017bb",
        width: 2040,
        height: 2840,
      },
    },
  },
  "us-194047-otto-engine": {
    sourcePdfSha256: "ad6cfd50e5aaca4dbf9dcb594eb53dc1e619339314f50fdd49a6b4f34eb30baf",
    reviewer: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-08-18",
    acceptanceBasis: "migrated-reviewed-edition-attestation",
    acceptedOccurrenceCount: 41,
    assets: {
      "/patents/figures/us-194047-otto-engine/fig-1-source-crop.png": {
        sha256: "c93ea9e434e10d330b5e7aa1b2415910534f6263aa6abc7c2aa6ba4a0850ebfa",
        width: 620,
        height: 980,
      },
      "/patents/figures/us-194047-otto-engine/fig-10-source-crop-v3.png": {
        sha256: "8c6396f37f3260948853d9ce442bba3535e71e22a4cfde4b0cc816e590447275",
        width: 760,
        height: 220,
      },
      "/patents/figures/us-194047-otto-engine/fig-11-source-crop.png": {
        sha256: "dd521c28b3ba1aaa5856fa7156d7874a413f3673056e268af38f76487c8bcec0",
        width: 330,
        height: 750,
      },
      "/patents/figures/us-194047-otto-engine/fig-12-source-crop.png": {
        sha256: "311a704bed79fc8e0d6d8adf9ae43db40e744359d7947661bd86fe0f9dbfc8c0",
        width: 470,
        height: 320,
      },
      "/patents/figures/us-194047-otto-engine/fig-13-source-crop.png": {
        sha256: "efb5bfb067ad09b3ff8e9e24eba2d407e32f7c7e2c19a11c60b8a62d1e3aff1c",
        width: 450,
        height: 320,
      },
      "/patents/figures/us-194047-otto-engine/fig-2-source-crop.png": {
        sha256: "db3afbdd25b74c5180c9f8b5fa4797f9daa8458a6864531eb93a5fe902d47868",
        width: 1160,
        height: 1800,
      },
      "/patents/figures/us-194047-otto-engine/fig-3-source-crop.png": {
        sha256: "606f9aee896117c66e8f9d6a8e8ee6493aa31b23c63ddfd9487df0b43a9ba310",
        width: 1120,
        height: 1810,
      },
      "/patents/figures/us-194047-otto-engine/fig-4-source-crop.png": {
        sha256: "74640730911411e8ac4dcbf5133719e90799464190feec588153fb4ccb44fc0c",
        width: 960,
        height: 830,
      },
      "/patents/figures/us-194047-otto-engine/fig-5-source-crop-v2.png": {
        sha256: "a2a18ad569f08b87145eafffeea73d33b30b0e76156b76f1f7d8415b30e1c469",
        width: 620,
        height: 560,
      },
      "/patents/figures/us-194047-otto-engine/fig-6-source-crop-v2.png": {
        sha256: "e283c29fbda190663537f0b792e4eef6f3bc66c7a76fafabfd231a3f74f96ba0",
        width: 450,
        height: 420,
      },
      "/patents/figures/us-194047-otto-engine/fig-7-source-crop-v2.png": {
        sha256: "9d4ec64e7b897379161a35741b6aec8f46fd8ffd8aca6e1a842478133a2c0412",
        width: 450,
        height: 420,
      },
      "/patents/figures/us-194047-otto-engine/fig-8-source-crop-v2.png": {
        sha256: "e9d4d20e46d348d8fed3c285e421aea0f3477324ef97b86ca6023d3d53576cbe",
        width: 520,
        height: 500,
      },
      "/patents/figures/us-194047-otto-engine/fig-9-source-crop.png": {
        sha256: "9d0356dc86ab1a8ac1c6d65d07a844fac7ec1f3e59a43a6958bb02e81ca12218",
        width: 300,
        height: 220,
      },
    },
  },
  "us-200521-edison-phonograph": {
    sourcePdfSha256: "6ed4354f12dc944b49ac2a2a3dd8d0aaa3f263d0c5f2017b2237a37ffde00ccd",
    reviewer: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-08-18",
    acceptanceBasis: "migrated-reviewed-edition-attestation",
    acceptedOccurrenceCount: 8,
    assets: {
      "/patents/figures/us-200521-edison-phonograph-fig-1-source-crop.png": {
        sha256: "82041278881c564efaf8ce951758d318eab9746a15d109654197088a25075bb6",
        width: 1700,
        height: 820,
      },
      "/patents/figures/us-200521-edison-phonograph-fig-2-tight-source-crop.png": {
        sha256: "aeb6549043eb847624e036a1e6bcd9deb31d4de3b764c5e962389644cf78e2c4",
        width: 1400,
        height: 800,
      },
      "/patents/figures/us-200521-edison-phonograph-fig-3-complete-source-crop-v2.png": {
        sha256: "c6ff4298cec166acf3cabf36a9de6b00497d374fd679895bf11a122c694c901a",
        width: 700,
        height: 620,
      },
      "/patents/figures/us-200521-edison-phonograph-fig-4-source-crop.png": {
        sha256: "18538c956dc846240febd7652ae6891fd829071235499a0a40839b89e404dc60",
        width: 700,
        height: 550,
      },
    },
  },
  "us-223898-edison-lightbulb": {
    sourcePdfSha256: "70c46d7c8624b1e471dffd1175b0f34e70b4b05b6a9adede43c198fe71abc054",
    reviewer: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-08-18",
    acceptanceBasis: "migrated-reviewed-edition-attestation",
    acceptedOccurrenceCount: 6,
    assets: {
      "/patents/figures/us-223898-edison-lightbulb/fig-1-source-crop-v4.png": {
        sha256: "5c791742c2c6c49b5cf6339bfe89cc346c2ce6463724298a4931bf99a8d75209",
        width: 600,
        height: 900,
      },
      "/patents/figures/us-223898-edison-lightbulb/fig-2-source-crop-v6.png": {
        sha256: "045df0a1340e8ff18c5c91a2d172163e7d6c225ecd59e1ef6643812af3238435",
        width: 430,
        height: 1450,
      },
      "/patents/figures/us-223898-edison-lightbulb/fig-3-source-crop-v3.png": {
        sha256: "f119b44c01bd7198f2cf4f753be8b10e0af7323c74676a83b77445fead819c02",
        width: 650,
        height: 900,
      },
    },
  },
  "us-2318259-sikorsky-helicopter": {
    sourcePdfSha256: "7ab2b9b23907b26bff0afd37e2630b73b15c2c429c603a73cb841c8a2b4e114c",
    reviewer: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-09-01",
    acceptanceBasis: "migrated-reviewed-edition-attestation",
    acceptedOccurrenceCount: 13,
    assets: {
      "/patents/figures/us-2318259-sikorsky-helicopter/fig-1-source-crop-v1.png": {
        sha256: "6ad42ad8c7be4168787d108283f35e620cac0e2da424a7d3429ddf5c74c58beb",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-2318259-sikorsky-helicopter/fig-10-source-crop-v1.png": {
        sha256: "882d56c0e6165f9bb5152456df501421c383781889b85549496469b1610b69e6",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-2318259-sikorsky-helicopter/fig-2-source-crop-v1.png": {
        sha256: "07ef2fd95304d4893718cb413860ee19fbfcbeefe073e400f94d3da1a8255c1a",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-2318259-sikorsky-helicopter/fig-3-source-crop-v1.png": {
        sha256: "6a72a8bc32494fdef149c43915883ee33c440ed97e1811ff3067134fa62d7009",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-2318259-sikorsky-helicopter/fig-4-source-crop-v1.png": {
        sha256: "a809c6ed7281454f24193c16322323588f6efba2f92445d289b085d14f5e2a23",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-2318259-sikorsky-helicopter/fig-5-source-crop-v1.png": {
        sha256: "f2d69dae13df22bf62b58a5a5c96b0b0b3a1379e33b71ef964d328426695306f",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-2318259-sikorsky-helicopter/fig-6-source-crop-v1.png": {
        sha256: "4858e9c88e03bbea98dc963a2e60e6785e04b427246abfc85d36a1d12d7cc427",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-2318259-sikorsky-helicopter/fig-7-source-crop-v1.png": {
        sha256: "59b4cd1faee6e2533af96d1d44acc0d30b53f50d3ebd1a3a34961aa1111c5a91",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-2318259-sikorsky-helicopter/fig-8-source-crop-v1.png": {
        sha256: "ed82d6b8cb7271fd45135f92236b7733180c64b42c8a7245c1499cecbb71e1e1",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-2318259-sikorsky-helicopter/fig-9-source-crop-v1.png": {
        sha256: "a57de2f1337c74f63c33f38f46a208cfc8bb7bad4608613c09a1afaf3f720489",
        width: 2320,
        height: 3408,
      },
    },
  },
  "us-247804-delaval-separator": {
    sourcePdfSha256: "aa9e284bf20a53467a36a3ae648c7ce5bc4b9599837af32281e04b316b5ef187",
    reviewer: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-08-18",
    acceptanceBasis: "migrated-reviewed-edition-attestation",
    acceptedOccurrenceCount: 4,
    assets: {
      "/patents/figures/us-247804-delaval-separator/fig-1-source-crop-v2.png": {
        sha256: "b0e39a9b0485752b79507a9ff9d0d201a4f4751c66ee3d72e7b6e87c24eac5dc",
        width: 1220,
        height: 1550,
      },
      "/patents/figures/us-247804-delaval-separator/fig-2-source-crop-v2.png": {
        sha256: "13d5bfbb919f372ae2edd11c264b7c9f599a985b16498e214a922a4cbc1bb910",
        width: 1380,
        height: 2460,
      },
    },
  },
  "us-2495429-spencer-microwave": {
    sourcePdfSha256: "c5affa57d71dd79a431c8a87427672d9d04579cab911b1b6b5eec9a16ad00aca",
    reviewer: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-08-18",
    acceptanceBasis: "migrated-reviewed-edition-attestation",
    acceptedOccurrenceCount: 1,
    assets: {
      "/patents/figures/us-2495429-spencer-microwave/fig-1-source-crop-v1.png": {
        sha256: "2489b0fa0f47a0dce59c4b8b5f99e3d4ca0acd515ef87f12d6c4aaa527501647",
        width: 2040,
        height: 1550,
      },
    },
  },
  "us-2717437-mestral-velcro": {
    sourcePdfSha256: "3b55f3a8b19575d9261a48f695368101b229bc505a21ea9c554e09161b7aa91a",
    reviewer: "Classic Patents editorial agent (Gemini 3.7 Flash)",
    reviewedAt: "2026-09-01",
    acceptanceBasis: "migrated-reviewed-edition-attestation",
    acceptedOccurrenceCount: 11,
    assets: {
      "/patents/figures/us-2717437-mestral-velcro/fig-1-source-crop-v1.png": {
        sha256: "2c0dd89d419911e182a3f8de568e83ebf90cbe5d95378ec3d8b95cc19fa0124d",
        width: 640,
        height: 310,
      },
      "/patents/figures/us-2717437-mestral-velcro/fig-2-source-crop-v1.png": {
        sha256: "078c789f815fe686a4fa70255bc56561cae25abd4b8fb72de54c03eeeb486ec2",
        width: 580,
        height: 280,
      },
    },
  },
  "us-2846084-goertz-electronic-master-slave-manipulator": {
    sourcePdfSha256: "0e5ceed27b4cf8fc72a9144851a9c58e0342cae111fd932519828171550a6d64",
    reviewer: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-09-01",
    acceptanceBasis: "migrated-reviewed-edition-attestation",
    acceptedOccurrenceCount: 90,
    assets: {
      "/patents/figures/us-2846084-goertz-electronic-master-slave-manipulator/fig-1-source-crop-v1.png":
        {
          sha256: "a4ff0f602539d123ebd8e734da06780b2a44b1310e58e0f1fb2ed7086b1b9295",
          width: 4400,
          height: 5200,
        },
      "/patents/figures/us-2846084-goertz-electronic-master-slave-manipulator/fig-10-12-source-crop-v1.png":
        {
          sha256: "7463857f3f8be5f03c296eb383435174857f52e17bf27fccc8c0a774198f7e86",
          width: 4640,
          height: 6816,
        },
      "/patents/figures/us-2846084-goertz-electronic-master-slave-manipulator/fig-13-14-source-crop-v1.png":
        {
          sha256: "7ecad38f7e45db8ab296a53184324ec6f52b66c74c729af861a69db9faa8ed38",
          width: 4640,
          height: 6816,
        },
      "/patents/figures/us-2846084-goertz-electronic-master-slave-manipulator/fig-15-source-crop-v1.png":
        {
          sha256: "76ba1584f07caea40515be823c20242a961f3ff97bbaef8b1f1cb098789f6973",
          width: 4400,
          height: 5200,
        },
      "/patents/figures/us-2846084-goertz-electronic-master-slave-manipulator/fig-16-source-crop-v1.png":
        {
          sha256: "1edb6d6384165c6a837cf1a6e53252bad109f103bcb90939ac9ea95756c7d673",
          width: 4400,
          height: 5200,
        },
      "/patents/figures/us-2846084-goertz-electronic-master-slave-manipulator/fig-2-source-crop-v1.png":
        {
          sha256: "6ec365f798bed100d1922f111d9f36dee115d79c746be8a336decff878968c21",
          width: 4640,
          height: 6816,
        },
      "/patents/figures/us-2846084-goertz-electronic-master-slave-manipulator/fig-3-5-source-crop-v1.png":
        {
          sha256: "2daf873b01a8da03eb95e7c46575f5500073bcf952401fa201e2899cc9d8c198",
          width: 4400,
          height: 5200,
        },
      "/patents/figures/us-2846084-goertz-electronic-master-slave-manipulator/fig-6-source-crop-v1.png":
        {
          sha256: "f84a78ecfe7471945e8460972e0ecbefdfd2ef6038a670eb04e4599c5427cab5",
          width: 4640,
          height: 6816,
        },
      "/patents/figures/us-2846084-goertz-electronic-master-slave-manipulator/fig-7-source-crop-v1.png":
        {
          sha256: "a565a98330f6ad8ae6043bdb80660fce04a3cbfca572db6f44a4831d23247b36",
          width: 4640,
          height: 6816,
        },
      "/patents/figures/us-2846084-goertz-electronic-master-slave-manipulator/fig-8-source-crop-v1.png":
        {
          sha256: "521555b3071cfbaf360a29f739872d87eb5b74c6ca09564f9960e316449cfedb",
          width: 4640,
          height: 6816,
        },
      "/patents/figures/us-2846084-goertz-electronic-master-slave-manipulator/fig-9-source-crop-v1.png":
        {
          sha256: "e7d1f460bfc7754c0e5666a8527c080922e6286f56d8c22100f824e164ffa9f9",
          width: 4400,
          height: 5200,
        },
    },
  },
  "us-2988237-devol-programmed-transfer": {
    sourcePdfSha256: "9b0ea9729cf6d670a21dfed17264d7b78fa343ab1e98467fc0d3255a5cd03790",
    reviewer: "Classic Patents editorial agent (JadeHeron)",
    reviewedAt: "2026-09-01",
    acceptanceBasis: "migrated-reviewed-edition-attestation",
    acceptedOccurrenceCount: 20,
    assets: {
      "/patents/figures/us-2988237-devol-programmed-transfer/fig-1-source-crop-v1.png": {
        sha256: "db7f6a0b10c261218aaededa4031c383ac295a969e3c1657c9f100e750914c34",
        width: 900,
        height: 470,
      },
      "/patents/figures/us-2988237-devol-programmed-transfer/fig-11-source-crop-v1.png": {
        sha256: "728e2c083e353c43bd8fea5ec448256a776109e75793fa1a24a67dce0debd2db",
        width: 900,
        height: 780,
      },
      "/patents/figures/us-2988237-devol-programmed-transfer/fig-2-source-crop-v1.png": {
        sha256: "c5ed78e02ab898e15b352591ed640be92c1104720e699e43c74ff27eff237ed5",
        width: 850,
        height: 430,
      },
      "/patents/figures/us-2988237-devol-programmed-transfer/fig-3-source-crop-v1.png": {
        sha256: "d21d80490fe41c85e560bc7b759fb083aa32038b81e0fa57c5a4b51bf7a915b5",
        width: 800,
        height: 260,
      },
      "/patents/figures/us-2988237-devol-programmed-transfer/fig-4-source-crop-v1.png": {
        sha256: "46053dcc1f3a1e5823a0a9669a2e035f45f4a89bed0133365afc76b41e9b6c62",
        width: 690,
        height: 550,
      },
      "/patents/figures/us-2988237-devol-programmed-transfer/fig-5-source-crop-v1.png": {
        sha256: "15c4cecb06228eb370879e84cc3e09867411c4e491dff1ba01b9e9db2176c6b3",
        width: 930,
        height: 260,
      },
      "/patents/figures/us-2988237-devol-programmed-transfer/fig-6-source-crop-v1.png": {
        sha256: "c9392083ce26c97733edcaaaddb7bb3ccc04b4fd0a3411c73bddd78f61d66133",
        width: 380,
        height: 210,
      },
      "/patents/figures/us-2988237-devol-programmed-transfer/fig-7-source-crop-v1.png": {
        sha256: "2aa1f3a182cb3be49057bb60b5d1913cccfb40a299ab508530f77ac02e435ca3",
        width: 350,
        height: 190,
      },
      "/patents/figures/us-2988237-devol-programmed-transfer/fig-9-source-crop-v1.png": {
        sha256: "4206214e8eb312b88f9d6580e58c263b9c7ca19896b87a42c33f70f247ccdc7d",
        width: 410,
        height: 410,
      },
    },
  },
  "us-3081379-lemelson-machine-vision": {
    sourcePdfSha256: "2550a9d494a822f3f639c985899452b39432d53928db419633458d020c554b44",
    reviewer: "Classic Patents editorial team (Gemini 3.7 Flash)",
    reviewedAt: "2026-09-01",
    acceptanceBasis: "migrated-reviewed-edition-attestation",
    acceptedOccurrenceCount: 72,
    assets: {
      "/patents/figures/us-3081379-lemelson-machine-vision/fig-1-source-crop-v1.png": {
        sha256: "0c613401868c7b61f6190641a34185cb4f9d92a24dbea0ba00a9611a94b1a0a3",
        width: 4834,
        height: 7100,
      },
      "/patents/figures/us-3081379-lemelson-machine-vision/fig-10-source-crop-v1.png": {
        sha256: "26a0cfa829df788cc9daa0adc43de261068ad0fa8f5ae404aa949b43aedc4984",
        width: 4834,
        height: 7100,
      },
      "/patents/figures/us-3081379-lemelson-machine-vision/fig-2-source-crop-v1.png": {
        sha256: "d3824d5aa63430620fefd47894dff3ecac663336b0496ee464a713329e1734ac",
        width: 4834,
        height: 7100,
      },
      "/patents/figures/us-3081379-lemelson-machine-vision/fig-4-source-crop-v1.png": {
        sha256: "8a6e9b4ba80606380a705c2a302e649df38c352bf0479b0c8d960b7f8213341b",
        width: 4834,
        height: 7100,
      },
      "/patents/figures/us-3081379-lemelson-machine-vision/fig-5-source-crop-v1.png": {
        sha256: "29a2098630d85143d41b9c01a20f7a898e1d9cbcfa7d43297977df0cb748fab9",
        width: 4834,
        height: 7100,
      },
      "/patents/figures/us-3081379-lemelson-machine-vision/fig-6-source-crop-v1.png": {
        sha256: "9363d2c4293b8576944cc47a48a9b486607d8de1cf1cebf09c79f7b0600b0cb5",
        width: 4834,
        height: 7100,
      },
      "/patents/figures/us-3081379-lemelson-machine-vision/fig-7-source-crop-v1.png": {
        sha256: "412c9cf852c3922eceffa106905530f3082465d9ff4398ba82cfc736c5815981",
        width: 4834,
        height: 7100,
      },
      "/patents/figures/us-3081379-lemelson-machine-vision/fig-8-source-crop-v1.png": {
        sha256: "213b47dacb80dc5caed2736de3d9e40af8a977dd1f30361cd72bf1375547f3ea",
        width: 4834,
        height: 7100,
      },
      "/patents/figures/us-3081379-lemelson-machine-vision/fig-9-source-crop-v1.png": {
        sha256: "61abd38220e4976dacdcde7d40d39e081dd4e577390262d235f1881dd3c375e8",
        width: 4834,
        height: 7100,
      },
    },
  },
  "us-3119501-lemelson-automatic-warehousing": {
    sourcePdfSha256: "409c2b9fbd3a926b53a9d17ea3acc975fd710953c3a0b56ec4bb2855c64ff7d4",
    reviewer: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-09-01",
    acceptanceBasis: "migrated-reviewed-edition-attestation",
    acceptedOccurrenceCount: 21,
    assets: {
      "/patents/figures/us-3119501-lemelson-automatic-warehousing/fig-1-source-crop-v1.png": {
        sha256: "90f27cc11bc711cdfaa4c5314ca614029384d4b7dc7b09762ab027634995f1c0",
        width: 3100,
        height: 2200,
      },
      "/patents/figures/us-3119501-lemelson-automatic-warehousing/fig-2-source-crop-v1.png": {
        sha256: "c9cdebbf6bf7fbaa756669803754146e8832f2323f7520c99e6d570cd16a6eb7",
        width: 2500,
        height: 1700,
      },
      "/patents/figures/us-3119501-lemelson-automatic-warehousing/fig-3-source-crop-v1.png": {
        sha256: "3dd3991b40dc1eb1c3095fd381fd47a3f3afd8df4cff78d94ee8ae923461e834",
        width: 2800,
        height: 2800,
      },
      "/patents/figures/us-3119501-lemelson-automatic-warehousing/fig-4-source-crop-v1.png": {
        sha256: "ab6c030d42cbb6e89495ece8883fded2d5ed2fa7ebcf2a18016fa1e8063e5253",
        width: 1600,
        height: 1550,
      },
      "/patents/figures/us-3119501-lemelson-automatic-warehousing/fig-5-source-crop-v1.png": {
        sha256: "086cbc0b2c4aea0b4c465f4984df1c7a8bbe56fbb9211a04d225e7666e9fc797",
        width: 1600,
        height: 1300,
      },
      "/patents/figures/us-3119501-lemelson-automatic-warehousing/fig-6-source-crop-v1.png": {
        sha256: "2abf69eaa7509e77368e788b13b71042e9df13597b8ea05abcfdf5759aa24cf0",
        width: 1250,
        height: 1250,
      },
    },
  },
  "us-319596-maxim-machine-gun": {
    sourcePdfSha256: "ca385c254e2e390451a2eecd28273fee662afd0179451bcbf9f48bf8fde63dcb",
    reviewer: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-08-18",
    acceptanceBasis: "migrated-reviewed-edition-attestation",
    acceptedOccurrenceCount: 8,
    assets: {
      "/patents/figures/us-319596-maxim-machine-gun/fig-1-source-crop-v1.png": {
        sha256: "0bf92e538c1b8614407dab6270a8ea12b08d2b47be3bdacae7657e0168798a76",
        width: 1070,
        height: 2640,
      },
      "/patents/figures/us-319596-maxim-machine-gun/fig-2-source-crop-v1.png": {
        sha256: "bac8669aec19d0859628430cd2f6a4b186f09b0b5466c578dc63a41ea1f46972",
        width: 1030,
        height: 2640,
      },
      "/patents/figures/us-319596-maxim-machine-gun/fig-3-source-crop-v1.png": {
        sha256: "2bb3e9b5443807ca000f15ad43933b0c13c0321e8ac7064a49cb068d8034aa69",
        width: 1210,
        height: 1450,
      },
    },
  },
  "us-3212649-amf-versatran": {
    sourcePdfSha256: "9a985a6bf91770914a5049c3f03e0cee2dc4bfe8711633891df68cc0b894ccbd",
    reviewer: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-09-01",
    acceptanceBasis: "migrated-reviewed-edition-attestation",
    acceptedOccurrenceCount: 234,
    assets: {
      "/patents/figures/us-3212649-amf-versatran/sheet-01-source-crop-v1.png": {
        sha256: "74088a8815c7ab772e4d4f746e85452cd23d7c3ad14346b76d9bc00c1237b852",
        width: 1634,
        height: 2400,
      },
      "/patents/figures/us-3212649-amf-versatran/sheet-02-source-crop-v1.png": {
        sha256: "fd9777eff0baa8623d07352006da54f35026860513b65a61c7c51e757d3bee8b",
        width: 1634,
        height: 2400,
      },
      "/patents/figures/us-3212649-amf-versatran/sheet-03-source-crop-v1.png": {
        sha256: "8be58c67f5d7cacae809e57b166888b617d890d34f694007e086587f478c6dc2",
        width: 1634,
        height: 2400,
      },
      "/patents/figures/us-3212649-amf-versatran/sheet-04-source-crop-v1.png": {
        sha256: "ba71351bda186d6106dfd4ea51e4fa917f392f175bc67ddd56a0ee33352795fb",
        width: 1634,
        height: 2400,
      },
      "/patents/figures/us-3212649-amf-versatran/sheet-05-source-crop-v1.png": {
        sha256: "961c6e17c84344d615d9621324f2278b445cfd58c5b6c547f01d2ee278d949cb",
        width: 1634,
        height: 2400,
      },
      "/patents/figures/us-3212649-amf-versatran/sheet-06-source-crop-v1.png": {
        sha256: "84290a8499eb4a8184c15aeffeb1680a39e1b200c63d21d3dfd0b8cba90431a9",
        width: 1634,
        height: 2400,
      },
      "/patents/figures/us-3212649-amf-versatran/sheet-07-source-crop-v1.png": {
        sha256: "42b1f142a39dcbacb821f98178a104ae18efdd526d0c03d6031afe1cd826d9cb",
        width: 1634,
        height: 2400,
      },
      "/patents/figures/us-3212649-amf-versatran/sheet-08-source-crop-v1.png": {
        sha256: "97c533b27eaf623765b83b84aafe31dffd72cb1442740df9724127c75583e9a9",
        width: 1634,
        height: 2400,
      },
      "/patents/figures/us-3212649-amf-versatran/sheet-09-source-crop-v1.png": {
        sha256: "d7b5eb6225281a2fad57f38150d4d911ccfc6f08788cf1c114ff9726d7dd92fc",
        width: 1634,
        height: 2400,
      },
      "/patents/figures/us-3212649-amf-versatran/sheet-10-source-crop-v1.png": {
        sha256: "7af8ce926a23572376295ce1803021412b93a83c8f196df3dedef6f56e988a81",
        width: 1634,
        height: 2400,
      },
      "/patents/figures/us-3212649-amf-versatran/sheet-11-source-crop-v1.png": {
        sha256: "436038fd605b87bc296338145be2644f30a54b4ebb2da19f53975e060453ed8b",
        width: 1634,
        height: 2400,
      },
      "/patents/figures/us-3212649-amf-versatran/sheet-12-source-crop-v1.png": {
        sha256: "24a8b9fbc2a06978748c9382ac99bcc0f34da32801c5da25d1bf92d28993723a",
        width: 1634,
        height: 2400,
      },
      "/patents/figures/us-3212649-amf-versatran/sheet-13-source-crop-v1.png": {
        sha256: "0215af72cd91ac176a99d7695b93cbbe1ee1e0d533b1c590b16dad3096c97736",
        width: 1634,
        height: 2400,
      },
      "/patents/figures/us-3212649-amf-versatran/sheet-14-source-crop-v1.png": {
        sha256: "3867c80479e217a4720d27f9a2972565e11d313d7ca3cb7ea1add49000af6497",
        width: 1634,
        height: 2400,
      },
      "/patents/figures/us-3212649-amf-versatran/sheet-15-source-crop-v1.png": {
        sha256: "07ecd005bcbc49c54315ff09e28cd26f28d91f29fe365250b2d740912379e0da",
        width: 1634,
        height: 2400,
      },
      "/patents/figures/us-3212649-amf-versatran/sheet-16-source-crop-v1.png": {
        sha256: "2b262207a7804e6ea4d47f1066db89c55736ad428e51a9b6b900f29677ec745f",
        width: 1634,
        height: 2400,
      },
      "/patents/figures/us-3212649-amf-versatran/sheet-17-source-crop-v1.png": {
        sha256: "07ac301d4d0223fe815990cc9cff29fa861a18c6e8394dc36c0a72fc96a4c4c0",
        width: 1634,
        height: 2400,
      },
    },
  },
  "us-3260375-lemelson-adjustable-manipulator": {
    sourcePdfSha256: "e7be38b9f72cba77958ddab0422e147a6947056e4d51dddc7559508723cbdf34",
    reviewer: "Classic Patents editorial agent (SapphireElm)",
    reviewedAt: "2026-09-01",
    acceptanceBasis: "migrated-reviewed-edition-attestation",
    acceptedOccurrenceCount: 57,
    assets: {
      "/patents/figures/us-3260375-lemelson-adjustable-manipulator/fig-1-source-crop-v1.png": {
        sha256: "5c12064abc701b938e159ed520a0d0fac98c016fc8ec0dddfc0c9402adf338f3",
        width: 4834,
        height: 7100,
      },
      "/patents/figures/us-3260375-lemelson-adjustable-manipulator/fig-2-source-crop-v1.png": {
        sha256: "f2710745918a8caab8136114d3be82048b172c4702911cb1cb93ebf200b7e038",
        width: 4834,
        height: 7100,
      },
      "/patents/figures/us-3260375-lemelson-adjustable-manipulator/fig-3-source-crop-v1.png": {
        sha256: "aa695b4bb0ddf8492915b38cf68e844a786b811008580466496647799a1f8b5d",
        width: 4834,
        height: 7100,
      },
    },
  },
  "us-3313014-lemelson-automatic-production": {
    sourcePdfSha256: "6554714ab50e6e0e194081b6cb67c02d689a218418710be059998502ef329548",
    reviewer: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-09-01",
    acceptanceBasis: "migrated-reviewed-edition-attestation",
    acceptedOccurrenceCount: 24,
    assets: {
      "/patents/figures/us-3313014-lemelson-automatic-production/sheet-1-source-crop-v1.png": {
        sha256: "b44edbca892e99a35838b725b5290c637aeafdde1fb4b5a6a73ba88c28eda7e4",
        width: 851,
        height: 1250,
      },
      "/patents/figures/us-3313014-lemelson-automatic-production/sheet-2-source-crop-v1.png": {
        sha256: "12bdf24309e7ca86d3245b1a6180f6feaaa956541e0ccf3b56a9a53c69bc816f",
        width: 851,
        height: 1250,
      },
      "/patents/figures/us-3313014-lemelson-automatic-production/sheet-3-source-crop-v1.png": {
        sha256: "de1d74d1409e476f68b34a38db4bbb9c4c9b32231d081ebd9ebfcac8d17f8166",
        width: 851,
        height: 1250,
      },
      "/patents/figures/us-3313014-lemelson-automatic-production/sheet-4-source-crop-v1.png": {
        sha256: "2ee05384123d81cd82765dfecec7c686e92906cdb9e80889d7c7a96b6cb04d43",
        width: 851,
        height: 1250,
      },
      "/patents/figures/us-3313014-lemelson-automatic-production/sheet-5-source-crop-v1.png": {
        sha256: "d1b3d7b9aa3987e1e81ccd17eac79518bc71207cae09d18894bfefee910eb200",
        width: 851,
        height: 1250,
      },
      "/patents/figures/us-3313014-lemelson-automatic-production/sheet-6-source-crop-v1.png": {
        sha256: "4763732f732390fc9c776dd17911988ff6af578dd97aa1554cc07159e2d37dc8",
        width: 851,
        height: 1250,
      },
    },
  },
  "us-361931-daimler-engine": {
    sourcePdfSha256: "1c20cb38fad97fe6658cd711d7009dcb70da74af4cf22aec380882e055407159",
    reviewer: "Classic Patents editorial agent (codex-hotel)",
    reviewedAt: "2026-08-17",
    acceptanceBasis: "migrated-reviewed-edition-attestation",
    acceptedOccurrenceCount: 12,
    assets: {
      "/patents/figures/us-361931-daimler-engine/fig-1-source-crop-v1.png": {
        sha256: "a8c860b152b80bce30b2110546925e947ef2b7c0aac0a1e974c5be99348b3253",
        width: 1280,
        height: 1570,
      },
      "/patents/figures/us-361931-daimler-engine/fig-2-source-crop-v2.png": {
        sha256: "e2909f21355cfb97e64cde709f6e1a8b887d438ad1ed6ed04b95cba6f7f73324",
        width: 1050,
        height: 700,
      },
      "/patents/figures/us-361931-daimler-engine/fig-3-source-crop-v1.png": {
        sha256: "ff72d7288639f3463a5d7d27aa84fbb701eafa3e15f39c71076c7691d55ffb2e",
        width: 1280,
        height: 1650,
      },
      "/patents/figures/us-361931-daimler-engine/fig-4-source-crop-v1.png": {
        sha256: "cb911c1f20b0f53422432bd142f0e3200f81b891a715c53db96675df4b75fd1d",
        width: 420,
        height: 420,
      },
      "/patents/figures/us-361931-daimler-engine/fig-4a-source-crop-v1.png": {
        sha256: "5d19cc135962bedbfbc0939caebbc962f69858ef578bda4e4908e1c6af7172d1",
        width: 350,
        height: 160,
      },
      "/patents/figures/us-361931-daimler-engine/fig-5-source-crop-v2.png": {
        sha256: "9c665bf3b7dff55070d8fe272b0868d843536d200391f8611c786afb83cd219a",
        width: 820,
        height: 290,
      },
      "/patents/figures/us-361931-daimler-engine/fig-6-source-crop-v1.png": {
        sha256: "7ea14e6ca6aa95760229dcadfb2160cdbb2b2aba3ab314e40bf9b6a036a802c6",
        width: 800,
        height: 450,
      },
    },
  },
  "us-36836-gatling-gun": {
    sourcePdfSha256: "1eb10666b48d84d2e2be3e09168c6f4f224e531428f7f7c39fdf70ff60d0683f",
    reviewer: "codex-lima",
    reviewedAt: "2026-08-17",
    acceptanceBasis: "migrated-reviewed-edition-attestation",
    acceptedOccurrenceCount: 21,
    assets: {
      "/patents/figures/us-36836-gatling-gun-fig-1-preview-v2.png": {
        sha256: "36f6a750b20418c040b1deb686ba60e991978efbe01d6a49eb8e6c9a398ae909",
        width: 590,
        height: 1120,
      },
      "/patents/figures/us-36836-gatling-gun-fig-2-preview.png": {
        sha256: "a467ee73af8c797c5ac536f325afb6af878b326fb55330f0b41f15aa75598d7a",
        width: 420,
        height: 1580,
      },
      "/patents/figures/us-36836-gatling-gun-fig-3-preview.png": {
        sha256: "d17da306e892d5f49b6fa772813772f894be32072972e19d43506b1bb4082f9f",
        width: 800,
        height: 760,
      },
      "/patents/figures/us-36836-gatling-gun-fig-4-preview.png": {
        sha256: "ac568a52e63cffbc1bc3d18cdefdae73deffba791e04fea3bc1078956615025b",
        width: 420,
        height: 420,
      },
      "/patents/figures/us-36836-gatling-gun-fig-5-preview.png": {
        sha256: "f555d57f9a8e66800e94fc43e347a42e0ca093f18f6023e7fd4f62c7785a2a56",
        width: 260,
        height: 290,
      },
      "/patents/figures/us-36836-gatling-gun-fig-6-preview-v2.png": {
        sha256: "2963bc44dcb4d9d632cecf70a46f321ba4754a3c1872606e84c237182ed1a67d",
        width: 300,
        height: 400,
      },
      "/patents/figures/us-36836-gatling-gun-fig-7-preview-v2.png": {
        sha256: "892305ba33874a3eb3760d8a521196fd45ece2410244156a855ae4c9c835d3d1",
        width: 260,
        height: 280,
      },
    },
  },
  "us-3728480-baer-odyssey": {
    sourcePdfSha256: "620a5c6c5563115c9ec3fa34f64c646b4f32cb9f587eda6bef78a9516439a0cc",
    reviewer: "Classic Patents editorial agent (Gemini 3.7 Flash)",
    reviewedAt: "2026-09-01",
    acceptanceBasis: "migrated-reviewed-edition-attestation",
    acceptedOccurrenceCount: 15,
    assets: {
      "/patents/figures/us-3728480-baer-odyssey/fig-1-source-crop-v1.png": {
        sha256: "d7a61c5bb69c962a3f3d81666dbd8f40273f4e9874b9965fd017519ad45c98d0",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3728480-baer-odyssey/fig-10-source-crop-v1.png": {
        sha256: "f2d48dfabb3ccbcf538a99fa563efc7fac9e7bceead5b52a4e63cb6b9fc38653",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3728480-baer-odyssey/fig-11-source-crop-v1.png": {
        sha256: "9dfccdecbeec4824881be41cc09fe4697d559a04c73066dfcec68783094e72a6",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3728480-baer-odyssey/fig-3-source-crop-v1.png": {
        sha256: "6721c0be0f0e4bf898fd664743a8afc317d850ace640758fd22a576e4479c9ce",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3728480-baer-odyssey/fig-4-source-crop-v1.png": {
        sha256: "2e7b1041bbecc8cfc8cd428bbb158d5d26b40646f1bf6d1de0d75d5cadaceac0",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3728480-baer-odyssey/fig-5-source-crop-v1.png": {
        sha256: "da076ec7b71e0afff7b1409adb416b4c614e259adf045c0e06e146a70058a926",
        width: 2320,
        height: 3408,
      },
    },
  },
  "us-381968-tesla-motor": {
    sourcePdfSha256: "cffd7ff061b05feef92c2d6ef4d767c7b7e8c6b4e0d10cc9be3fbd51841dce12",
    reviewer: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-08-18",
    acceptanceBasis: "migrated-reviewed-edition-attestation",
    acceptedOccurrenceCount: 57,
    assets: {
      "/patents/figures/us-381968-tesla-motor/fig-1-source-crop-v2.png": {
        sha256: "6326d98c642f0803b7ed7677d5de339e72bba1ea13b1c1548b472a89338ff8e0",
        width: 700,
        height: 230,
      },
      "/patents/figures/us-381968-tesla-motor/fig-10-source-crop-v2.png": {
        sha256: "146feed32dbab65a4a3e3fe5bd76fb8c622c09fa448da34bec50e7de6f59951e",
        width: 930,
        height: 650,
      },
      "/patents/figures/us-381968-tesla-motor/fig-11-source-crop-v2.png": {
        sha256: "0e4412ed4a7c5eb6c436b7599d64f7d7dd573be4355c9d7eb6139b8c1ca81811",
        width: 900,
        height: 600,
      },
      "/patents/figures/us-381968-tesla-motor/fig-12-source-crop-v2.png": {
        sha256: "9e96d4cc52b7bc30e1d0b29c2cfeb7c7dd1a30c346e7a68d789b0acd4b162d13",
        width: 1950,
        height: 600,
      },
      "/patents/figures/us-381968-tesla-motor/fig-13-source-crop-v2.png": {
        sha256: "fc847bccfea2249320a1dd5327aaae872ab54e8c5e8a55c9f43aa59d7b20914e",
        width: 1800,
        height: 650,
      },
      "/patents/figures/us-381968-tesla-motor/fig-14-source-crop-v2.png": {
        sha256: "e6c750cb4bfe93b83385c4207093ac4ba85e9f7f3fb98cabcf0833903f707f5f",
        width: 650,
        height: 550,
      },
      "/patents/figures/us-381968-tesla-motor/fig-15-source-crop-v2.png": {
        sha256: "97b3ff2dea950fdfe2f78c3c637ab552684240cd9a61123b66a10983ea0ed657",
        width: 1850,
        height: 830,
      },
      "/patents/figures/us-381968-tesla-motor/fig-16-source-crop-v2.png": {
        sha256: "be528efdf4f6c1fd194b9a3c007bf6507c03133276fa57b9bd22f5e2880c7c79",
        width: 700,
        height: 350,
      },
      "/patents/figures/us-381968-tesla-motor/fig-17-source-crop-v1.png": {
        sha256: "6666db6039a51216aaf8cbca1eb7fe9d0cede2df7bed594d7b95181aeb42fbfc",
        width: 650,
        height: 750,
      },
      "/patents/figures/us-381968-tesla-motor/fig-18-source-crop-v1.png": {
        sha256: "d70f72540e501f5fac0fe60d4a72aec2094eb758b69c642e9b51e987f1e6d54b",
        width: 570,
        height: 500,
      },
      "/patents/figures/us-381968-tesla-motor/fig-19-source-crop-v1.png": {
        sha256: "9dd09effc10e72085dada94788e1c485834d61364bd876889f11a4c3db29c6af",
        width: 1060,
        height: 700,
      },
      "/patents/figures/us-381968-tesla-motor/fig-1a-source-crop-v2.png": {
        sha256: "e1ab5ccfbcfd15aeb46e0733e127f958041c4c7b383ece859d8f66a5663df4ce",
        width: 900,
        height: 220,
      },
      "/patents/figures/us-381968-tesla-motor/fig-2-source-crop-v2.png": {
        sha256: "9e19385a06278f17a697b6edfd82c8c18de9e056bc9e2f8cc6a7c5295b34f114",
        width: 700,
        height: 230,
      },
      "/patents/figures/us-381968-tesla-motor/fig-3-source-crop-v3.png": {
        sha256: "54a7e35d848769b6e94bb96a50a463c0e99c3a0cad6bcc7c05faf81e3e3b428c",
        width: 650,
        height: 210,
      },
      "/patents/figures/us-381968-tesla-motor/fig-3a-source-crop-v2.png": {
        sha256: "74aad771177619783fba59a4a3907d8422ff162fea4afe3c8758784e13c8e934",
        width: 900,
        height: 220,
      },
      "/patents/figures/us-381968-tesla-motor/fig-4-source-crop-v2.png": {
        sha256: "e1c78069e613c9eaacc871dd9b8f88948c8e42d4a6e3408e1a1d5c31b8dbdaff",
        width: 700,
        height: 230,
      },
      "/patents/figures/us-381968-tesla-motor/fig-4a-source-crop-v3.png": {
        sha256: "164b35c82924d87fd9818e167150f867e6b3eaddd9bf5207ca5a5b589e8f62ec",
        width: 800,
        height: 190,
      },
      "/patents/figures/us-381968-tesla-motor/fig-5-source-crop-v2.png": {
        sha256: "06b81b7d41c0e92fbf1d79e4b1116055e2679c49b3b5d7ff32af03bb5b7c2e84",
        width: 700,
        height: 230,
      },
      "/patents/figures/us-381968-tesla-motor/fig-5a-source-crop-v3.png": {
        sha256: "67a354d4479f45cb60add4c37a6d3f75bc3d805417b7481dcfbd1cfc5c600b4e",
        width: 800,
        height: 180,
      },
      "/patents/figures/us-381968-tesla-motor/fig-6-source-crop-v2.png": {
        sha256: "6abcc7f1b99424d7cfd0e41d6ef9e52d0240f36dde2288bc66f64b46cee1ef50",
        width: 700,
        height: 200,
      },
      "/patents/figures/us-381968-tesla-motor/fig-6a-source-crop-v3.png": {
        sha256: "ed9bc948235ffe36bc2d2bcb13d761c9e416106708e8fc008cd76641e47353e4",
        width: 800,
        height: 180,
      },
      "/patents/figures/us-381968-tesla-motor/fig-7-source-crop-v2.png": {
        sha256: "b57d72c55b8acef5dc7a7dfee4a392636632d1262fc0a8e075a0fd6e72fbc460",
        width: 700,
        height: 230,
      },
      "/patents/figures/us-381968-tesla-motor/fig-7a-source-crop-v2.png": {
        sha256: "78ebbb6dfa9ce107e3608ac456412de447dc9ce48e257edbbdf5a24f382a3842",
        width: 900,
        height: 190,
      },
      "/patents/figures/us-381968-tesla-motor/fig-8-source-crop-v2.png": {
        sha256: "e60c300eb12d80283d2e65cc196fdd3f258f3c742b111c3c8552e1c827ad4f11",
        width: 700,
        height: 230,
      },
      "/patents/figures/us-381968-tesla-motor/fig-8a-source-crop-v2.png": {
        sha256: "f50d0fabdd08f7e16bda1c4beec99d5c34f1f79ee32aafc8e439ae06854b4c20",
        width: 900,
        height: 160,
      },
      "/patents/figures/us-381968-tesla-motor/fig-9-source-crop-v1.png": {
        sha256: "f2bf787cf33ed151caaceb939db9bcca1913d3453b46c1994a4e7d7032f341a0",
        width: 1120,
        height: 800,
      },
    },
  },
  "us-3858581-kamen-medication-injection-device": {
    sourcePdfSha256: "1aa0df879ec119a9ad4025774e482dfc41e748127bc3f83cde31047daeedc35d",
    reviewer: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-09-01",
    acceptanceBasis: "migrated-reviewed-edition-attestation",
    acceptedOccurrenceCount: 9,
    assets: {
      "/patents/figures/us-3858581-kamen-medication-injection-device/fig-1-source-crop-v1.png": {
        sha256: "87eb863e34410983efc36dcf3d062c1ef940c3f40ac20ce063b236b8f52d65e3",
        width: 2800,
        height: 1350,
      },
      "/patents/figures/us-3858581-kamen-medication-injection-device/fig-2-source-crop-v1.png": {
        sha256: "a7ea1a21ac2f659b437ce2c854d0be68bdec3b05f2711ebe687bd5f11597dea8",
        width: 2800,
        height: 1000,
      },
      "/patents/figures/us-3858581-kamen-medication-injection-device/fig-3-source-crop-v1.png": {
        sha256: "afc6bdffc25b2259c3eebee719c8da1c42638b4855b788ed9f669b32ac6a2b9e",
        width: 3000,
        height: 1350,
      },
      "/patents/figures/us-3858581-kamen-medication-injection-device/fig-4-source-crop-v1.png": {
        sha256: "689e0197dc7ee3f7347bc8c40cb319df784655149bd8e8fb6aeb09e3edd528f0",
        width: 1000,
        height: 800,
      },
      "/patents/figures/us-3858581-kamen-medication-injection-device/fig-5-source-crop-v1.png": {
        sha256: "7fa63356c2865f676c78de4a3af5e323d6dfe12559177df125f20be86e0c8513",
        width: 1200,
        height: 750,
      },
      "/patents/figures/us-3858581-kamen-medication-injection-device/fig-6-source-crop-v1.png": {
        sha256: "cc32da787f8e90e3deb58afd89da0f235bfa4912493d67dbc5adecfb2148f90f",
        width: 2800,
        height: 2700,
      },
    },
  },
  "us-388850-eastman-kodak": {
    sourcePdfSha256: "49c9e9ff048771cb4fcc97b811af7f666c9925bb01b3b46d1588f95c63c0cfe1",
    reviewer: "PurpleDog, manual facsimile review",
    reviewedAt: "2026-08-18",
    acceptanceBasis: "migrated-reviewed-edition-attestation",
    acceptedOccurrenceCount: 11,
    assets: {
      "/patents/figures/us-388850-eastman-kodak/fig-1-source-crop-v1.png": {
        sha256: "0bda16b5a9fd7e9e906893ee3100892a48a8dfc01ff7072db48361492b053a42",
        width: 1500,
        height: 820,
      },
      "/patents/figures/us-388850-eastman-kodak/fig-10-source-crop-v1.png": {
        sha256: "d57308164eb226531d29616ac373b38ebfaaa7cf4dab39a63bfb331b154b5f95",
        width: 900,
        height: 800,
      },
      "/patents/figures/us-388850-eastman-kodak/fig-11-source-crop-v1.png": {
        sha256: "50ec0bc05a0f570694c054c1c23a4c350eeb3992a8f35fe6c2ffa1bd8fcdc715",
        width: 650,
        height: 900,
      },
      "/patents/figures/us-388850-eastman-kodak/fig-2-source-crop-v1.png": {
        sha256: "3121bd131afdf7b06e15a5ecd09343edbc5efeecd4f8d424f60709c0fc0c0684",
        width: 1000,
        height: 650,
      },
      "/patents/figures/us-388850-eastman-kodak/fig-3-source-crop-v1.png": {
        sha256: "82865f7a116cac55d759fd15a00445c836ddb0255242383fde9c8ff7f3597fec",
        width: 1050,
        height: 660,
      },
      "/patents/figures/us-388850-eastman-kodak/fig-4-source-crop-v1.png": {
        sha256: "29a016409e8acc26bc7b0b6e82281cdb271483f71ae58391f3252c573f9bb17e",
        width: 500,
        height: 650,
      },
      "/patents/figures/us-388850-eastman-kodak/fig-5-source-crop-v1.png": {
        sha256: "d8aa22c23cc8dc80a5700580dba0439f245109c142e006a788b7393f0a9d5449",
        width: 400,
        height: 680,
      },
      "/patents/figures/us-388850-eastman-kodak/fig-6-source-crop-v1.png": {
        sha256: "3953a329424e8fbb207817dadb41f909b81dddadc68c36aa1506ac2e4c3649c2",
        width: 450,
        height: 780,
      },
      "/patents/figures/us-388850-eastman-kodak/fig-7-source-crop-v1.png": {
        sha256: "e76a02b3f5d129ea797c04933029ce5a7ff39ba236559e9b0c4ace0175a15467",
        width: 850,
        height: 600,
      },
      "/patents/figures/us-388850-eastman-kodak/fig-8-source-crop-v1.png": {
        sha256: "6dd5bb69eb986a49e48fc4e1cd35ca4b6614f35de2998a49b95f0c2b0cff329b",
        width: 850,
        height: 600,
      },
      "/patents/figures/us-388850-eastman-kodak/fig-9-source-crop-v1.png": {
        sha256: "02e815748dc5724e5d79f0048d1b7567dfa0a2680faf607ba19d6151d5340f1d",
        width: 950,
        height: 820,
      },
    },
  },
  "us-4063220-metcalfe-ethernet": {
    sourcePdfSha256: "3bd400ad08a604c1911f554f3bda8ddc4a64923170760736fde6bd481e5ec928",
    reviewer: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-09-01",
    acceptanceBasis: "migrated-reviewed-edition-attestation",
    acceptedOccurrenceCount: 11,
    assets: {
      "/patents/figures/us-4063220-metcalfe-ethernet/fig-1-source-crop-v1.png": {
        sha256: "0fe079191dc76a22b32e43f070d601231e338385cac1f26da776075f9877e679",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-4063220-metcalfe-ethernet/fig-2-source-crop-v1.png": {
        sha256: "0d6deb2017aa450237963db6be7f7fb17666b74019ffce91fb953fc93ccd5fdd",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-4063220-metcalfe-ethernet/fig-3-source-crop-v1.png": {
        sha256: "917201ab833882e46518539cb0a0cac6c47d432ba3a0a30aff2e90c55cc700da",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-4063220-metcalfe-ethernet/fig-4-source-crop-v1.png": {
        sha256: "7416745f1346ce1ede074d494e7211661d08b39e84470381c3ed676c6570a812",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-4063220-metcalfe-ethernet/fig-5-source-crop-v1.png": {
        sha256: "53f7fb6eb096fa33c6c0698503b6453de9ffaddfeafda925e48bea85a61628de",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-4063220-metcalfe-ethernet/fig-6-source-crop-v1.png": {
        sha256: "671c7b0d907c05859126262cd43070165a7dcbfe39c809b017dec882e098ba28",
        width: 2320,
        height: 3408,
      },
    },
  },
  "us-4098001-watson-rcc": {
    sourcePdfSha256: "67ca409f96f1456b603f198653a1a5d9c411c25dab5737ac2824b7fdaff2093b",
    reviewer: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-09-01",
    acceptanceBasis: "migrated-reviewed-edition-attestation",
    acceptedOccurrenceCount: 35,
    assets: {
      "/patents/figures/us-4098001-watson-rcc/fig-1-source-crop-v1.png": {
        sha256: "452d227c72e5a1a29258e9e27c021d81630f6b7b7eef31e84a455d29c13a441b",
        width: 1300,
        height: 1280,
      },
      "/patents/figures/us-4098001-watson-rcc/fig-10-source-crop-v1.png": {
        sha256: "8ade4168ab1cb59fa0295a1626cf1e485e360e0adca5af2eb9dfc66dfddd4f9d",
        width: 1400,
        height: 1700,
      },
      "/patents/figures/us-4098001-watson-rcc/fig-11-source-crop-v1.png": {
        sha256: "652b27c4c6e969dd1fba52c8c60dd179509c6be51c8f89cc7e3fc16421b37180",
        width: 1400,
        height: 1650,
      },
      "/patents/figures/us-4098001-watson-rcc/fig-11a-source-crop-v1.png": {
        sha256: "562210f929001b722741dd7468679cf147af64e06d09c352ae94fe34d383d816",
        width: 1400,
        height: 1250,
      },
      "/patents/figures/us-4098001-watson-rcc/fig-12-source-crop-v1.png": {
        sha256: "6c524f7d37643999904d95c799eda7ebe5d80882f94aa35a9d2beeaf0b32fc53",
        width: 1400,
        height: 1750,
      },
      "/patents/figures/us-4098001-watson-rcc/fig-2-source-crop-v1.png": {
        sha256: "7ff10a7dd4e097f4b8793ea84cd4c2d2c0db821b9c76d346b745508d5798733b",
        width: 1350,
        height: 1050,
      },
      "/patents/figures/us-4098001-watson-rcc/fig-3-source-crop-v1.png": {
        sha256: "314db5b559bf13093d4fb1e1bd92cbc58905cd4aa1d06a8844e310e3bbff2af4",
        width: 1350,
        height: 1250,
      },
      "/patents/figures/us-4098001-watson-rcc/fig-4-source-crop-v1.png": {
        sha256: "2e2e51a2faca76a899f7ae3e9cb21dd45c7896500f931e13ae2064db04d711eb",
        width: 1200,
        height: 1050,
      },
      "/patents/figures/us-4098001-watson-rcc/fig-4a-source-crop-v1.png": {
        sha256: "6137ba6a12c8a4d892cadc7d159a9191f5135b9e4a97ca14232047af459f7112",
        width: 1200,
        height: 980,
      },
      "/patents/figures/us-4098001-watson-rcc/fig-5-source-crop-v1.png": {
        sha256: "9f67999f7299de07f4c35f0d96fa2cee79f9883904d81214e8bc9bba0bb5c6a2",
        width: 1200,
        height: 1050,
      },
      "/patents/figures/us-4098001-watson-rcc/fig-5a-source-crop-v1.png": {
        sha256: "e22fafac13e35fec0c74a186e3e852f717781f69019b9ea2bffe73e8d58e5d73",
        width: 1350,
        height: 1050,
      },
      "/patents/figures/us-4098001-watson-rcc/fig-6-source-crop-v1.png": {
        sha256: "34945ea56df93d38b64308de63f78dd0f4f0b921170bab7aff6f0d8445dafb28",
        width: 1350,
        height: 1580,
      },
      "/patents/figures/us-4098001-watson-rcc/fig-7-source-crop-v1.png": {
        sha256: "0cb107e9b860a469ff653900a1374a78da1cd9815d937f32d23aa9bfc0187df2",
        width: 1350,
        height: 1050,
      },
      "/patents/figures/us-4098001-watson-rcc/fig-8-source-crop-v1.png": {
        sha256: "17c45ac267ea871d2bf840c498fe253f167bca7c1d25a2050bc14c8976cb6d9a",
        width: 1350,
        height: 1600,
      },
      "/patents/figures/us-4098001-watson-rcc/fig-9-source-crop-v1.png": {
        sha256: "eff63e9b9f0fecadf92210245225de5b697548ca50ab5470a2a0c926ee3adbbd",
        width: 1350,
        height: 1450,
      },
    },
  },
  "us-4136359-wozniak-apple": {
    sourcePdfSha256: "7467256de38125790a5f1b5e4904060e8ec6aa92f33288ccc8f1ea0acb7c3fc0",
    reviewer: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-08-18",
    acceptanceBasis: "migrated-reviewed-edition-attestation",
    acceptedOccurrenceCount: 30,
    assets: {
      "/patents/figures/us-4136359-wozniak-apple/fig-1-source-crop-v1.png": {
        sha256: "b4ffbcdb4d4f6df8435f33df20701209931f1765946374ce89758543355f9118",
        width: 1100,
        height: 760,
      },
      "/patents/figures/us-4136359-wozniak-apple/fig-2-source-crop-v1.png": {
        sha256: "8771636816046abdd7a742b424a6ef951d4cae248bff6bb527fd9c0cc1d6e11e",
        width: 1100,
        height: 760,
      },
      "/patents/figures/us-4136359-wozniak-apple/fig-3-source-crop-v2.png": {
        sha256: "14a717357f784fcadcde74371a07d1c7ee51b583f9f5d9ef8071ae880f21ab15",
        width: 1100,
        height: 875,
      },
      "/patents/figures/us-4136359-wozniak-apple/fig-4-source-crop-v1.png": {
        sha256: "8423bd5aeec79bc1f7348c4292a99d0bfe4c170032b9d2140a9a7fc4612fe1cb",
        width: 1100,
        height: 720,
      },
    },
  },
  "us-4341502-makino-scara": {
    sourcePdfSha256: "0ecad64ed838700e9595b18bc782609ff68fe7c0d7829887b4663554ba24b8b8",
    reviewer: "Classic Patents editorial agent (JadeHeron)",
    reviewedAt: "2026-09-01",
    acceptanceBasis: "migrated-reviewed-edition-attestation",
    acceptedOccurrenceCount: 16,
    assets: {
      "/patents/figures/us-4341502-makino-scara/fig-1-source-crop-v1.png": {
        sha256: "723d5dac2add1be8436d3ed4652b46a10b09a68974b02c16e483ca66c88e4b33",
        width: 850,
        height: 1120,
      },
      "/patents/figures/us-4341502-makino-scara/fig-2-source-crop-v1.png": {
        sha256: "2a7a2b938a5f4b1f2f0962c492ee56fc72991ab73f6c34c3a7be7057203d6cd7",
        width: 530,
        height: 560,
      },
      "/patents/figures/us-4341502-makino-scara/fig-3-source-crop-v1.png": {
        sha256: "605178851cc4fb7959956865b76d79e3188c93d7e3b8b1d80f7b65847a4f8ecb",
        width: 530,
        height: 560,
      },
      "/patents/figures/us-4341502-makino-scara/fig-4-source-crop-v1.png": {
        sha256: "eef870302c88df6afa2f61fbc03c3b72053d846b40b278b7cac29889ab5b473d",
        width: 530,
        height: 560,
      },
      "/patents/figures/us-4341502-makino-scara/fig-5-source-crop-v1.png": {
        sha256: "ea1a3d25b6047b2bc074663417e713d9ac1450f2c83b23ccb16528e3affff78c",
        width: 530,
        height: 680,
      },
      "/patents/figures/us-4341502-makino-scara/fig-6-source-crop-v1.png": {
        sha256: "1629cec1137a51f9eaaf5a5b308ca76e95405a285a21b749008c465fb3ed5b1d",
        width: 820,
        height: 400,
      },
    },
  },
  "us-4512709-milacron-robot-toolchanger": {
    sourcePdfSha256: "9ac43ea5baee978c390bd096fe4beaa2c229a5cde227d9f3e005d035026425b0",
    reviewer: "Classic Patents editorial agent (GentleCedar)",
    reviewedAt: "2026-09-01",
    acceptanceBasis: "migrated-reviewed-edition-attestation",
    acceptedOccurrenceCount: 48,
    assets: {
      "/patents/figures/us-4512709-milacron-robot-toolchanger/fig-1-source-crop-v1.png": {
        sha256: "59d34e0daa464c024d262171d3ae1bc49fca537bbca95c49cba4192f63a11a89",
        width: 1400,
        height: 1950,
      },
      "/patents/figures/us-4512709-milacron-robot-toolchanger/fig-10-source-crop-v1.png": {
        sha256: "15cc991b41fa3037d52d75b2efdfdff3b74371a3781147d16a962f2228a719a9",
        width: 1400,
        height: 840,
      },
      "/patents/figures/us-4512709-milacron-robot-toolchanger/fig-2-source-crop-v1.png": {
        sha256: "f83fa0d8cb07845cb1bf1af411ef87b31375f9915916ce0eae92648fe354e602",
        width: 1400,
        height: 963,
      },
      "/patents/figures/us-4512709-milacron-robot-toolchanger/fig-3-source-crop-v1.png": {
        sha256: "85fcf3ec0d12c6962292f5c6b8b2f4cc71a55d36640f438497152b748f6a672c",
        width: 1400,
        height: 875,
      },
      "/patents/figures/us-4512709-milacron-robot-toolchanger/fig-4-source-crop-v1.png": {
        sha256: "f7d65d694ee0275bca64057e8933cd406af274b13e6b2d76d91724524cc7d141",
        width: 1400,
        height: 875,
      },
      "/patents/figures/us-4512709-milacron-robot-toolchanger/fig-5-source-crop-v1.png": {
        sha256: "38a0c408be9021cfa45f2f9538a05b5b432660cad8e3ab7bb3ef202fd64a5f95",
        width: 1400,
        height: 1867,
      },
      "/patents/figures/us-4512709-milacron-robot-toolchanger/fig-6-source-crop-v1.png": {
        sha256: "220af429914c4240fa41a1f61cd36d36b10fe01bc97d74a509b0f011bc8e64cc",
        width: 1235,
        height: 1900,
      },
      "/patents/figures/us-4512709-milacron-robot-toolchanger/fig-7-source-crop-v1.png": {
        sha256: "3e313f1a37a35485ce662441d40084be8ea7f5f29737595c904fa6d0f2fed725",
        width: 1400,
        height: 1786,
      },
      "/patents/figures/us-4512709-milacron-robot-toolchanger/fig-8-source-crop-v1.png": {
        sha256: "9ef7405b497366283210aaac6614f45de8d956e9fe1123d0250790e3e51a1463",
        width: 997,
        height: 1150,
      },
      "/patents/figures/us-4512709-milacron-robot-toolchanger/fig-9-source-crop-v1.png": {
        sha256: "37f03df9f7de59552c88f6ea030f9271812d44e09065f30dfb251e3b8e01f67b",
        width: 1400,
        height: 1131,
      },
    },
  },
  "us-4575330-hull-stereolithography": {
    sourcePdfSha256: "5dc2211b18f88883ee92394917154d57d102b73c26a4744332cbf0d89b1db1c7",
    reviewer: "Classic Patents editorial agent (Gemini 3.7 Flash)",
    reviewedAt: "2026-09-01",
    acceptanceBasis: "migrated-reviewed-edition-attestation",
    acceptedOccurrenceCount: 21,
    assets: {
      "/patents/figures/us-4575330-hull-stereolithography/fig-1-source-crop-v1.png": {
        sha256: "a28128050ae41ea9bd296d117434b34ee23e8cfc608098d10ea3fb59e7e65054",
        width: 1985,
        height: 1490,
      },
      "/patents/figures/us-4575330-hull-stereolithography/fig-2-source-crop-v1.png": {
        sha256: "5d677073f3aebf0ebe690679e5c0ac404a08cda75fc5495b8593418ec95a72ff",
        width: 1990,
        height: 1488,
      },
      "/patents/figures/us-4575330-hull-stereolithography/fig-3-source-crop-v1.png": {
        sha256: "2fc81e95dd8fdb77c113a8bb2e34edb59448310890a7dda6b0d3aa137c53232c",
        width: 2055,
        height: 2932,
      },
      "/patents/figures/us-4575330-hull-stereolithography/fig-4-source-crop-v1.png": {
        sha256: "487daf990939ba8ae32a2883d95e704a80c07c1677d6d88d578a3723233dbf23",
        width: 1985,
        height: 1682,
      },
      "/patents/figures/us-4575330-hull-stereolithography/fig-5-source-crop-v1.png": {
        sha256: "272fac8c25e222899b292bb36756c6c4564296f504356c634118b04a89cff8e3",
        width: 1990,
        height: 1287,
      },
      "/patents/figures/us-4575330-hull-stereolithography/fig-6-source-crop-v1.png": {
        sha256: "171f75e4b2581ef036d3e20fc1aa41594c09197a19031e265bf9072eaa41ba67",
        width: 1020,
        height: 1490,
      },
      "/patents/figures/us-4575330-hull-stereolithography/fig-7-source-crop-v1.png": {
        sha256: "2c3701e7ae495860f2f4ab7f43b909812922b13fd5fb9f66e5745bc83ee6bf96",
        width: 991,
        height: 1489,
      },
      "/patents/figures/us-4575330-hull-stereolithography/fig-8-source-crop-v1.png": {
        sha256: "ae7de2593f8b374190e64afc45666272ead52286b84f6e5e94b7dd1555c2fa2c",
        width: 1975,
        height: 1489,
      },
    },
  },
  "us-470918-reno-escalator": {
    sourcePdfSha256: "2c34b13c20fab70980a22470702fa891d3ca359c4846b02aa7ea5ff23b1576cf",
    reviewer: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-08-18",
    acceptanceBasis: "migrated-reviewed-edition-attestation",
    acceptedOccurrenceCount: 17,
    assets: {
      "/patents/figures/us-470918-reno-escalator/fig-1-source-crop-v1.png": {
        sha256: "b65c2ac0f4a2346a36a040cc5cda32b04e330de2ce0f12aba48a62538f9fdcc9",
        width: 2321,
        height: 1900,
      },
      "/patents/figures/us-470918-reno-escalator/fig-2-source-crop-v1.png": {
        sha256: "488acee665457dfdd6a968bba4f8757e0aee8636a816af40dde95f89b464467b",
        width: 2050,
        height: 2100,
      },
      "/patents/figures/us-470918-reno-escalator/fig-3-source-crop-v1.png": {
        sha256: "0db628f1e061137033aa71cb0cd137f25437dfa28252d31664fef140e338da02",
        width: 1500,
        height: 1100,
      },
      "/patents/figures/us-470918-reno-escalator/fig-4-source-crop-v1.png": {
        sha256: "aa223aee252f1c830c42ede9a7ffd0da616fed95cfb366b06b78af0b5fcf2f6a",
        width: 2050,
        height: 1350,
      },
    },
  },
  "us-4765668-robot-end-effector": {
    sourcePdfSha256: "654ed8b094309e39412debba71117f177602c1557ade8d9865f834a1d9e84485",
    reviewer: "Classic Patents editorial agent (JadeHeron)",
    reviewedAt: "2026-09-01",
    acceptanceBasis: "migrated-reviewed-edition-attestation",
    acceptedOccurrenceCount: 29,
    assets: {
      "/patents/figures/us-4765668-robot-end-effector/fig-1-source-crop-v1.png": {
        sha256: "78309e056a518aa6895f73a38e61a3470dfa9f64a854d183848e3c35be049b1d",
        width: 900,
        height: 1060,
      },
      "/patents/figures/us-4765668-robot-end-effector/fig-2-source-crop-v1.png": {
        sha256: "95271208c978a7e4c072d92e012b68f97e018d14553f89531f8f624d4a2bca94",
        width: 700,
        height: 1220,
      },
      "/patents/figures/us-4765668-robot-end-effector/fig-3-source-crop-v1.png": {
        sha256: "8d7405f945927a376db84d31b7cd05e47e4fdaa837d86dcd331bcf65b0ac0103",
        width: 900,
        height: 1220,
      },
      "/patents/figures/us-4765668-robot-end-effector/fig-4-source-crop-v1.png": {
        sha256: "d821dcc8e9ce6221117916993162314e0883c29a6eadd123af10c5f52b1fa463",
        width: 620,
        height: 690,
      },
      "/patents/figures/us-4765668-robot-end-effector/fig-5-source-crop-v1.png": {
        sha256: "c1b0eb9380458b2f9bad683f1526bca002f4d402cb0606d97c799336d301c365",
        width: 650,
        height: 690,
      },
      "/patents/figures/us-4765668-robot-end-effector/fig-6-source-crop-v1.png": {
        sha256: "edbbbabad535bf7a1edf0124a842c94e0e5cecf69faa8d13a0f118693cc99df8",
        width: 800,
        height: 400,
      },
    },
  },
  "us-4921293-salisbury-robot-hand": {
    sourcePdfSha256: "a630e3a6c5e3bee141740ed3de4d315ea4ded7f525d5db8f8c4f9605af52fbed",
    reviewer: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-09-01",
    acceptanceBasis: "migrated-reviewed-edition-attestation",
    acceptedOccurrenceCount: 55,
    assets: {
      "/patents/figures/us-4921293-salisbury-robot-hand/fig-1-source-crop-v1.png": {
        sha256: "94a5f0e7ef455c93f9824f5e1dad6d259b62fbbc2f4d2d0c74407c791a8d90e2",
        width: 1672,
        height: 1893,
      },
      "/patents/figures/us-4921293-salisbury-robot-hand/fig-2-source-crop-v1.png": {
        sha256: "dc216aed2ecfdef088dabfb320c84511e1c7795c41f7f08e0a3ef07040fb3ca4",
        width: 957,
        height: 1175,
      },
      "/patents/figures/us-4921293-salisbury-robot-hand/fig-3-source-crop-v1.png": {
        sha256: "a54e1f1e60534835f8042ff7a95c3aa8c5e158c5e2d49fc297ce0b8ba7c0df54",
        width: 1520,
        height: 1115,
      },
      "/patents/figures/us-4921293-salisbury-robot-hand/fig-4-source-crop-v1.png": {
        sha256: "151f66d04714502b9ba8393b821bbc2d317a127d64f7af3c0ce6f5705fe34f54",
        width: 1319,
        height: 872,
      },
      "/patents/figures/us-4921293-salisbury-robot-hand/fig-5-source-crop-v1.png": {
        sha256: "fe9e53453964f6cc75c1d87f868f49465a1ada3d16ad6f8c45bf611b6255eb51",
        width: 1204,
        height: 823,
      },
      "/patents/figures/us-4921293-salisbury-robot-hand/fig-6-source-crop-v1.png": {
        sha256: "44ae78e47f3502385e2dd1c38a9f310794e07d9d4d8850ca2e95905d8cbb0022",
        width: 1050,
        height: 2866,
      },
      "/patents/figures/us-4921293-salisbury-robot-hand/fig-7-source-crop-v1.png": {
        sha256: "3af8b2be8cce3efbfe35f773729f8be67cb96fbab0a29bf187147f3f82a7d1df",
        width: 1037,
        height: 2862,
      },
    },
  },
  "us-4976582-clavel-delta-robot": {
    sourcePdfSha256: "e11516fed15c0937ee14decea63ff25557b848fb40ab381b29413737a145448e",
    reviewer: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-09-02",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 15,
    assets: {
      "/patents/figures/us-4976582-clavel-delta-robot/fig-1-source-crop-v1.png": {
        sha256: "77af97db1f0f1cc52ae46200491bcbcb9553d350627a54c7775f9c37fdd0931c",
        width: 5800,
        height: 8520,
      },
      "/patents/figures/us-4976582-clavel-delta-robot/fig-2-source-crop-v1.png": {
        sha256: "2f141c4925b4c3cbc05a90c1c6676d2bbfe511f682dc75d1d5128e72763663ab",
        width: 5800,
        height: 8520,
      },
      "/patents/figures/us-4976582-clavel-delta-robot/fig-3-4-source-crop-v1.png": {
        sha256: "30cd3c71c9ba1064e012251942f003916787d3670e7ed946de55d98c229fd0b9",
        width: 5800,
        height: 8520,
      },
      "/patents/figures/us-4976582-clavel-delta-robot/fig-5-source-crop-v1.png": {
        sha256: "e5355e53e1a58c2529c5cfacd526280a3d8575cb9ae2233b377dac949ff9d100",
        width: 5800,
        height: 8520,
      },
    },
  },
  "us-5121329-crump-fdm": {
    sourcePdfSha256: "a61b0395a405393ced9160aaa6a3e04624cb69f277eb6f64a070a3c3a0a51708",
    reviewer: "Classic Patents editorial agent (Gemini 3.7 Flash)",
    reviewedAt: "2026-09-01",
    acceptanceBasis: "migrated-reviewed-edition-attestation",
    acceptedOccurrenceCount: 23,
    assets: {
      "/patents/figures/us-5121329-crump-fdm/fig-1-source-crop-v1.png": {
        sha256: "368a840e3adb2ec00ed3262aaaa94c77dc0fc62b00a14465c1cb175f1f6f41e7",
        width: 2020,
        height: 1550,
      },
      "/patents/figures/us-5121329-crump-fdm/fig-10-source-crop-v1.png": {
        sha256: "047b5a8c87a80ca9e6d165ea257155742a80a17bf1a56aa0bc1a1345a68dcc8c",
        width: 1000,
        height: 1500,
      },
      "/patents/figures/us-5121329-crump-fdm/fig-11-source-crop-v1.png": {
        sha256: "98713ce022f841f7bb72b9a5e5e4f223f8eab5f9cede76af54a69ca88b7eedce",
        width: 1050,
        height: 1500,
      },
      "/patents/figures/us-5121329-crump-fdm/fig-12-source-crop-v1.png": {
        sha256: "a0d0ab67ea7f3138a75fe2309375d7cac5b67078f2be549d54091d726ae080d8",
        width: 1000,
        height: 1500,
      },
      "/patents/figures/us-5121329-crump-fdm/fig-2-source-crop-v1.png": {
        sha256: "2695139d784299c67314457d53083c1743e5e7d6f387ae75c451ae984055403c",
        width: 1050,
        height: 1450,
      },
      "/patents/figures/us-5121329-crump-fdm/fig-3-source-crop-v1.png": {
        sha256: "a5bc6501c2aa76013535f0e5c6cb8be171f0019083034ab7eb58b8e0d57478ca",
        width: 1000,
        height: 1450,
      },
      "/patents/figures/us-5121329-crump-fdm/fig-4-source-crop-v1.png": {
        sha256: "94d7f2722d5ed01c54502c67be22d593c290c1c82a4461aca83aa57edbfbfd74",
        width: 2050,
        height: 1000,
      },
      "/patents/figures/us-5121329-crump-fdm/fig-5-source-crop-v1.png": {
        sha256: "93cbe2180b1ce9a373551d225ad679b574dc3c7c31887101fc408ac04dc469a8",
        width: 1050,
        height: 900,
      },
      "/patents/figures/us-5121329-crump-fdm/fig-6-source-crop-v1.png": {
        sha256: "0623ed2c29cf5f7006e296dbcd9c7446b6f25e1356a96fbd924b8a02dd362cf7",
        width: 1000,
        height: 900,
      },
      "/patents/figures/us-5121329-crump-fdm/fig-7-source-crop-v1.png": {
        sha256: "db9c9a1032eff800b0b615c1863b5e4b3c3da9237856d9ceea8cb50bd3f4ec90",
        width: 1050,
        height: 1100,
      },
      "/patents/figures/us-5121329-crump-fdm/fig-8-source-crop-v1.png": {
        sha256: "0bd44efc9b1734965ec6919ed9dccdd1d7c271c1589e4f36e87b28a17760ad41",
        width: 1000,
        height: 1100,
      },
      "/patents/figures/us-5121329-crump-fdm/fig-9-source-crop-v1.png": {
        sha256: "23ba579d8f8a791cc081cffcb4e93cc50def3490973f961ed689926993802f6d",
        width: 1050,
        height: 1500,
      },
    },
  },
  "us-5701965-kamen-transporter": {
    sourcePdfSha256: "b1dac639b2b9905914433d27fd9b6cad82382239bc291d10ca3e1ac1ffe05f65",
    reviewer: "Classic Patents editorial agent (Gemini 3.7 Flash)",
    reviewedAt: "2026-09-01",
    acceptanceBasis: "migrated-reviewed-edition-attestation",
    acceptedOccurrenceCount: 13,
    assets: {
      "/patents/figures/us-5701965-kamen-transporter/fig-1-source-crop-v1.png": {
        sha256: "c0320ac3f49889e2de341c809290862b6eb870f26c144cbe91b8ac6c9a0ece31",
        width: 1306,
        height: 1363,
      },
      "/patents/figures/us-5701965-kamen-transporter/fig-2-source-crop-v1.png": {
        sha256: "97a861973a47a8a32c3f857c55f81433e6214172cf0eb9b049bcd2c3fff941f1",
        width: 1287,
        height: 1903,
      },
      "/patents/figures/us-5701965-kamen-transporter/fig-3-source-crop-v1.png": {
        sha256: "13b7d8a8cd1d6e08d560969f0315b6298ccc3fc6f7f3de33bc069c3fd8d2f4e9",
        width: 1289,
        height: 1908,
      },
      "/patents/figures/us-5701965-kamen-transporter/fig-4-source-crop-v1.png": {
        sha256: "14d5e6c123e38e9be8e60348a3a9bb01e360d055f626e54364d4207d3c3c3dcc",
        width: 1313,
        height: 1627,
      },
      "/patents/figures/us-5701965-kamen-transporter/fig-5-source-crop-v1.png": {
        sha256: "80e3f1c62115e9bc8a3933129368738ba448e3fb92e4049e3561f36c2c8af088",
        width: 1295,
        height: 1992,
      },
      "/patents/figures/us-5701965-kamen-transporter/fig-6-source-crop-v1.png": {
        sha256: "6249b25a76cf598950da4bb32fa90cc618e7a78c301f838a12d49637161d8c1a",
        width: 1287,
        height: 1554,
      },
    },
  },
  "us-586193-marconi-radio": {
    sourcePdfSha256: "ed185aa2e6974608279d044840f1b9176432cea9eee946a6ada7d020e9c6b352",
    reviewer: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-08-18",
    acceptanceBasis: "migrated-reviewed-edition-attestation",
    acceptedOccurrenceCount: 25,
    assets: {
      "/patents/figures/us-586193-marconi-radio/figs-1-to-3-source-crop-v1.png": {
        sha256: "07ee6cbc0fc322332260266290085dfe2306976719bd8c8cf184001aee637b74",
        width: 1180,
        height: 1450,
      },
      "/patents/figures/us-586193-marconi-radio/figs-4-to-8-source-crop-v1.png": {
        sha256: "847b196139e1b4345862ee79294ef7f7cae6a7913944f3e1e520af2ce799f412",
        width: 1180,
        height: 1350,
      },
      "/patents/figures/us-586193-marconi-radio/figs-9-to-11-source-crop-v2.png": {
        sha256: "a3fe212464bec7421fa0add94ac37a09f12c180236a59988fa3ade28bdb8c188",
        width: 1520,
        height: 1850,
      },
    },
  },
  "us-588-ericsson-propeller": {
    sourcePdfSha256: "40582250d44f6558cf9a438801e312a469ccb83b6755ebc813943fba54c3ea9a",
    reviewer: "Classic Patents editorial agent (TurquoiseCoast)",
    reviewedAt: "2026-08-17",
    acceptanceBasis: "migrated-reviewed-edition-attestation",
    acceptedOccurrenceCount: 21,
    assets: {
      "/patents/figures/us-588-ericsson-propeller/fig-1-source-crop-v1.png": {
        sha256: "06e32a7bc89b75a3468e86806012ab5105cae5e4f0ccc465cea59b06175ae2fb",
        width: 860,
        height: 1950,
      },
      "/patents/figures/us-588-ericsson-propeller/fig-2-source-crop-v1.png": {
        sha256: "e7b9cf5f3ccd5c1df335dc480aabb180e44600a4c5a691d95ef9f320ed399726",
        width: 850,
        height: 1950,
      },
      "/patents/figures/us-588-ericsson-propeller/fig-3-source-crop-v1.png": {
        sha256: "f77b36d7366aa446722e2f5f24c796b75a0a5003b58802dde2fe3368281d1cd2",
        width: 700,
        height: 850,
      },
      "/patents/figures/us-588-ericsson-propeller/fig-4-source-crop-v1.png": {
        sha256: "46aefa59a1363f2138e163f143db7c1467c8274079f1c2c63b658efe26934eae",
        width: 1050,
        height: 1100,
      },
      "/patents/figures/us-588-ericsson-propeller/fig-5-source-crop-v1.png": {
        sha256: "f7563e1eced0cf83dd935e0e692fd00583ce710ab5c188c3857724a122ee0403",
        width: 750,
        height: 1250,
      },
      "/patents/figures/us-588-ericsson-propeller/fig-6-source-crop-v2.png": {
        sha256: "5e1af11ee0fb1fdf162ff4b9ba84ad59f694d22d1179a1e153222587e70a5bbd",
        width: 1000,
        height: 950,
      },
    },
  },
  "us-593138-tesla-coil": {
    sourcePdfSha256: "393b0a9cee0baa191c5cf8fac0f65738b9d77ce5318e74324b4792aaf17ddf44",
    reviewer: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-08-18",
    acceptanceBasis: "migrated-reviewed-edition-attestation",
    acceptedOccurrenceCount: 11,
    assets: {
      "/patents/figures/us-593138-tesla-coil/fig-1-source-crop-v2.png": {
        sha256: "317b9967292d75421b7d97f166d2bf1a7301a4c78eea7f6a4f759743f5d773ef",
        width: 1100,
        height: 1450,
      },
      "/patents/figures/us-593138-tesla-coil/fig-2-source-crop-v2.png": {
        sha256: "699631f099f5a7b49ec57b41679fab81899653f9e5f47606369fdd7a76d27b24",
        width: 1100,
        height: 700,
      },
      "/patents/figures/us-593138-tesla-coil/fig-3-source-crop-v3.png": {
        sha256: "4fce377003e88f96b6a1ae5ec400ff5f449f3136c8e5fb57e37c02748b3c3603",
        width: 900,
        height: 500,
      },
    },
  },
  "us-6285999-pagerank": {
    sourcePdfSha256: "c2e024116b9411385aa9cb5d51d3eb34b99f59db190c2bb9298d9d6d6eeed2e4",
    reviewer: "Classic Patents editorial agent (GPT-5 Codex)",
    reviewedAt: "2026-08-21",
    acceptanceBasis: "migrated-reviewed-edition-attestation",
    acceptedOccurrenceCount: 7,
    assets: {
      "/patents/figures/us-6285999-pagerank/fig-1-source-crop-v1.png": {
        sha256: "c2007445f8422221f695288978787b6f6178c07e03ac9445981ec3820c7e837d",
        width: 1681,
        height: 2580,
      },
      "/patents/figures/us-6285999-pagerank/fig-2-source-crop-v1.png": {
        sha256: "415bb4c052694321a5cec953943458b781a9329041f08544a2b8c052f813f5e7",
        width: 1783,
        height: 2598,
      },
      "/patents/figures/us-6285999-pagerank/fig-3-source-crop-v1.png": {
        sha256: "a9cb40f741f9bb5a3001d2b94403179218bdbac6c75af02bbcb186445bf739c0",
        width: 1659,
        height: 2859,
      },
    },
  },
  "us-6302230-kamen-segway": {
    sourcePdfSha256: "bcda272e161a0b973db9d64090f8102447e9aa35914a9a73e70a38736b7934db",
    reviewer: "Classic Patents editorial agent (Gemini 3.7 Flash)",
    reviewedAt: "2026-09-01",
    acceptanceBasis: "migrated-reviewed-edition-attestation",
    acceptedOccurrenceCount: 10,
    assets: {
      "/patents/figures/us-6302230-kamen-segway/fig-1-source-crop-v1.png": {
        sha256: "d761af697602b6723625bfaabd7241aa5a2b94ee22bdce3860fb37bdedbd7d31",
        width: 2088,
        height: 2930,
      },
      "/patents/figures/us-6302230-kamen-segway/fig-2-source-crop-v1.png": {
        sha256: "7ee02f92805b01c940f5ec136464c3d6f696e9c61761994faa6bf4a144974071",
        width: 2088,
        height: 2930,
      },
      "/patents/figures/us-6302230-kamen-segway/fig-3-source-crop-v1.png": {
        sha256: "ac644e82d1f97e64d5d8083fcebeabb7d325bd98c89e44df2995f7e8ec79ca25",
        width: 2088,
        height: 2930,
      },
      "/patents/figures/us-6302230-kamen-segway/fig-4-source-crop-v1.png": {
        sha256: "207415b1d0bc977f0dac12b4c3ec98e95af7a9c978a2f2b132e5725ec8e6f670",
        width: 2088,
        height: 2930,
      },
      "/patents/figures/us-6302230-kamen-segway/fig-5-source-crop-v1.png": {
        sha256: "aab9f88b19105221db1ac4a83e14069c6f923098806661e0eae4abda6d968bfb",
        width: 2088,
        height: 2930,
      },
      "/patents/figures/us-6302230-kamen-segway/fig-6-source-crop-v1.png": {
        sha256: "cc6b49c999119ce6d1e2c4f25867dcee94df2979f3d5531b94ae5088267c709f",
        width: 2088,
        height: 2930,
      },
      "/patents/figures/us-6302230-kamen-segway/fig-7-source-crop-v1.png": {
        sha256: "5d844ca239383d01606a7b9f8459d36bc2d8595854d5f22cfd25f7a1ed9ad26e",
        width: 2088,
        height: 2930,
      },
    },
  },
  "us-79265-sholes-typewriter": {
    sourcePdfSha256: "59e3d127ca09c1468d554cd70cd7621b77e155b42df3194e61f04e69d8750aca",
    reviewer: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-08-18",
    acceptanceBasis: "migrated-reviewed-edition-attestation",
    acceptedOccurrenceCount: 50,
    assets: {
      "/patents/figures/us-79265-sholes-typewriter-fig-1-tight-source-crop.png": {
        sha256: "4821f8745cf6455c40ffdbb17e615f3abfe65d79f726426d3d7a3c14f375fe36",
        width: 820,
        height: 650,
      },
      "/patents/figures/us-79265-sholes-typewriter-fig-2-tight-source-crop.png": {
        sha256: "8cc6bae231555daf5328b43bbea0620f886a0989a142f20513a82672b036a491",
        width: 470,
        height: 240,
      },
      "/patents/figures/us-79265-sholes-typewriter-fig-6-isolated-source-crop-v2.png": {
        sha256: "1316f703a8f1c75ac32c2df6fb670e8e730c8c8c47dba6da834721396be69e01",
        width: 440,
        height: 190,
      },
      "/patents/figures/us-79265-sholes-typewriter-fig-7-verified-source-crop.png": {
        sha256: "21ceebb3a4c560758272a43612945748b6b705a43d6374ec12b700f00e9d98c5",
        width: 760,
        height: 360,
      },
      "/patents/figures/us-79265-sholes-typewriter-fig-8-verified-source-crop.png": {
        sha256: "153ef835df4e9a7eab72a836cfff1a7c1eb9c27615025fa7f7e653860dda7f5e",
        width: 800,
        height: 340,
      },
    },
  },
  "us-879532-de-forest-audion": {
    sourcePdfSha256: "3a37d70051d784a5a086d53b8d2d09f372b8bb14d40179b68b62a5c166e7876e",
    reviewer: "Classic Patents editorial agent (Antigravity)",
    reviewedAt: "2026-08-19",
    acceptanceBasis: "migrated-reviewed-edition-attestation",
    acceptedOccurrenceCount: 6,
    assets: {
      "/patents/figures/us-879532-de-forest-audion/fig-1-source-crop-v2.png": {
        sha256: "690f8315d30bc286aa585ecc88fdfa6a485edf7dd9498eef0151195d7b324eff",
        width: 1200,
        height: 800,
      },
      "/patents/figures/us-879532-de-forest-audion/fig-2-source-crop-v2.png": {
        sha256: "9beb6eec9deaa452144ce2f606f2ab8bb8e63514c1781d3ba7c3f1914a3caf3c",
        width: 1100,
        height: 700,
      },
    },
  },
  "us-x9430-colt-revolver": {
    sourcePdfSha256: "61eed2c1b5ea259a301fb2690a7d3d17e1a59560cfb002dc91c29a50f5841d01",
    reviewer: "codex-charlie",
    reviewedAt: "2026-08-17",
    acceptanceBasis: "migrated-reviewed-edition-attestation",
    acceptedOccurrenceCount: 61,
    assets: {
      "/patents/figures/us-x9430-colt-revolver/division-1-pistol-source-crop-v2.png": {
        sha256: "e71c198d076e8561208f852d2931380253578560ecb2b67ed32ce5850ab835ce",
        width: 700,
        height: 440,
      },
      "/patents/figures/us-x9430-colt-revolver/division-2-pistol-section-source-crop-v2.png": {
        sha256: "d3fc6c1ca9e9242c2a8f22586f303df9d8f836dcaa2feb366f151a15eac7b4c6",
        width: 1100,
        height: 720,
      },
      "/patents/figures/us-x9430-colt-revolver/division-3-lock-parts-source-crop-v2.png": {
        sha256: "9d51aa20a0977d29f9372518956f9cd8d005cccb6e433be8335f42b465da425b",
        width: 430,
        height: 360,
      },
      "/patents/figures/us-x9430-colt-revolver/division-4-arbor-and-cylinder-source-crop-v2.png": {
        sha256: "7270f00f3a0d7306acc4ba36e0f10ecc9c8a4b37a1fd9d670e38279e9a6ee212",
        width: 800,
        height: 430,
      },
      "/patents/figures/us-x9430-colt-revolver/division-5-combination-source-crop-v2.png": {
        sha256: "b75c561b8a1c00a74cfbc2173f917f000114723919d3e755045ddad2979e3b53",
        width: 500,
        height: 330,
      },
      "/patents/figures/us-x9430-colt-revolver/plate-2-lockwork-source-crop-v2.png": {
        sha256: "66ed46bd456aaa5a73c7c86126cffb8039844a5f364cebffe72fa3558ccc4895",
        width: 1150,
        height: 650,
      },
    },
  },
} as const satisfies Readonly<Record<string, ArchivalFigureAcceptanceAttestation>>;
