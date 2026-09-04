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
  acceptanceBasis:
    | "direct-facsimile-crop-review"
    | "migrated-reviewed-edition-attestation"
    | "independent-figure-review";
  acceptedOccurrenceCount: number;
  assets: Readonly<Record<string, AcceptedFigureAssetEvidence>>;
}

export const ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS: Readonly<
  Record<string, ArchivalFigureAcceptanceAttestation>
> = {
  "us-307031-edison-indicator": {
    sourcePdfSha256: "f36bc6aa879d42a3f495a9bda05871bb6181aa1979e6baa03b258c42d6a30c13",
    reviewer: "Classic Patents editorial agent (Codex); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-03",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 6,
    assets: {
      "/patents/figures/us-307031-edison-indicator/source-sheet-1-v1.png": {
        sha256: "7ef74804b41430a48c6645b90857714e4ee532ba96b3e1cd5936329c28087344",
        width: 2320,
        height: 3408,
      },
    },
  },
  "us-233692-pelton-water-wheel": {
    sourcePdfSha256: "b81019c0239af3ab932bd477970c1a414a91f765a68b28f9b22444e4f95c597c",
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-03",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 8,
    assets: {
      "/patents/figures/us-233692-pelton-water-wheel/source-sheet-1-v1.png": {
        sha256: "a1766af4b2a4d72bef0a3578fda56c8c5949060ec8a0fa4554d227db9546c512",
        width: 2320,
        height: 3408,
      },
    },
  },
  "us-2297691-carlson-electrophotography": {
    sourcePdfSha256: "5b521a7f4b7fad3c258cc3b5bbbae2d593a28f03641e78938ec73e3fdbab8422",
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-03",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 30,
    assets: {
      "/patents/figures/us-2297691-carlson-electrophotography/source-sheet-1-v1.png": {
        sha256: "995bf0d92d185edd7719ee76acf6d1db94b3ff4cc06ac787c6cf2534db747fa7",
        width: 2320,
        height: 3408,
      },
    },
  },
  "us-48475-yale-lock": {
    sourcePdfSha256: "8426b35afe9957149ea2f87629cb37c9519409799ddbb578947e23d3d0fa0250",
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-03",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 30,
    assets: {
      "/patents/figures/us-48475-yale-lock/source-sheet-1-v1.png": {
        sha256: "a4927cabec8906a14f8de33cfd7a39cb8d2083fdba6dae51eb5f971cfb68a938",
        width: 2320,
        height: 3408,
      },
    },
  },
  "us-235199-bell-photophone": {
    sourcePdfSha256: "924fc983c2b53e84e122b7fb84014b5d37cf2461eae4132ea235211364f25e85",
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-04",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 32,
    assets: {
      "/patents/figures/us-235199-bell-photophone/source-sheet-1-v1.png": {
        sha256: "28d4be40b8c2cc3e6468337814d202e1f2001086f66ee96e1a79ef6be4fa9705",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-235199-bell-photophone/source-sheet-2-v1.png": {
        sha256: "e624181efbebc2fbf30da6db8a322b8e9eb0431990045fb7bf04638394e908d7",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-235199-bell-photophone/source-sheet-3-v1.png": {
        sha256: "b4e4616fd74a3c88ab2e05057cb2318b7b0467f4f9f1223b21f05e6c8b13bc92",
        width: 2320,
        height: 3408,
      },
    },
  },
  "us-120057-gramme-dynamo": {
    sourcePdfSha256: "b7ffe0d2354ea69f50616261005f1265fcbab643824f0293b91fc3d2b6523895",
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 180 DPI source-pixel review",
    reviewedAt: "2026-09-04",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 31,
    assets: {
      "/patents/figures/us-120057-gramme-dynamo/drawing-sheet-1.png": {
        sha256: "a7c2380f83a93fcdebba8c39ada3833984d845aad829898b1ac22f4d9c304bd2",
        width: 1392,
        height: 2045,
      },
      "/patents/figures/us-120057-gramme-dynamo/drawing-sheet-2.png": {
        sha256: "9f047812267a5e0f7d02f4e43f66b21936bd408e9fe29321fadea91050750e27",
        width: 1392,
        height: 2045,
      },
      "/patents/figures/us-120057-gramme-dynamo/drawing-sheet-3.png": {
        sha256: "9c58685c61fbaa91e460b7542cde68d37b39a1dd0d61cf14e2a0517478dc72ea",
        width: 1392,
        height: 2045,
      },
      "/patents/figures/us-120057-gramme-dynamo/drawing-sheet-4.png": {
        sha256: "d2a63bed87918eeb58eb9b2447a034fc5cc959bba92c9edd149a8efc04021512",
        width: 1392,
        height: 2045,
      },
    },
  },
  "us-1773980-farnsworth-tv": {
    sourcePdfSha256: "b1ca00feb8a6212894a3ac6fd8aed229493b929b2469a7fe710e9ee53c046538",
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-04",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 32,
    assets: {
      "/patents/figures/us-1773980-farnsworth-tv/source-sheet-1-v1.png": {
        sha256: "eb27560b188bd56be680648d130de208b2504ee1da54dd6498110f97e6e9c400",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-1773980-farnsworth-tv/source-sheet-2-v1.png": {
        sha256: "792aeed0d8422ae01f2647bddcd685ddbe6f3dee7daf35a83c464681bae5d8c9",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-1773980-farnsworth-tv/source-sheet-3-v1.png": {
        sha256: "19ba9574fca6e379d7834a0a39e2768dd4231e9f1f62bcef04fdcfa6f8100b34",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-1773980-farnsworth-tv/source-sheet-4-v1.png": {
        sha256: "3be324ceffb5ddc27c6feaa94bd6577aeb2d4939b3986c0871282b83ffc1d04e",
        width: 2320,
        height: 3408,
      },
    },
  },
  "us-2292387-lamarr-frequency-hopping": {
    sourcePdfSha256: "8204e975e2ea96f34973b87f3cab20d28604e52596c116af367facb74e319292",
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-04",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 35,
    assets: {
      "/patents/figures/us-2292387-lamarr-frequency-hopping/source-sheet-1-v1.png": {
        sha256: "9a53787fc9b2315de7d6bec159b9de1a696e08926098bb6649e18ddafd945591",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-2292387-lamarr-frequency-hopping/source-sheet-2-v1.png": {
        sha256: "5c9297937ebcc0fb659118588069ac494485d1a4e9fc51bf6c9fe8048d3669c7",
        width: 2320,
        height: 3408,
      },
    },
  },
  "us-4750-howe-sewing-machine": {
    sourcePdfSha256: "8f7449b3d54c2652dd74bab62fd079fdf76bd7216d8f15dd32c6af5def57b053",
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-04",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 36,
    assets: {
      "/patents/figures/us-4750-howe-sewing-machine/source-sheet-1-v1.png": {
        sha256: "d91899bccbce2eaedeea23fddff2137cadaf0fac1ef2c011e6a64a421ea03cf7",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-4750-howe-sewing-machine/source-sheet-2-v1.png": {
        sha256: "74dfb5350fd16740b2bfeb0d153da87bca795bcd004797feef38d40dc59ac58b",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-4750-howe-sewing-machine/source-sheet-3-v1.png": {
        sha256: "df84b4e87e3ca2b5261e82e3b2dc1e7baae677ab654cf055fabd62d47a7b79d2",
        width: 2320,
        height: 3408,
      },
    },
  },
  "us-1219881-sundback-zipper": {
    sourcePdfSha256: "8b73a4db400d449ec6349a07c05b38df6f5bed609562a2c96ba893890a41a3b9",
    reviewer: "Classic Patents editorial agent (GPT-5.6); independent source-pixel review",
    reviewedAt: "2026-09-03",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 25,
    assets: {
      "/patents/figures/us-1219881-sundback-zipper/source-sheet-1-v1.png": {
        sha256: "d2c2c475fb2fe63d493c6cb15377af95b8b4fcbc0f76fa695c98a4c2bde44fc6",
        width: 2320,
        height: 3408,
      },
    },
  },
  "us-727650-linde-air-liquefaction": {
    sourcePdfSha256: "6d5423307d5718474ea8dd5891c52bccc6c7df2103a9ed4b9c7298d27f29c776",
    reviewer: "Classic Patents editorial agent (GPT-5.6); independent source-pixel review",
    reviewedAt: "2026-09-03",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 2,
    assets: {
      "/patents/figures/us-727650-linde-air-liquefaction/source-sheet-1-v1.png": {
        sha256: "842b7ff51fe93dcf058c0fc837164c7dfa246074389c6ea04ecfbe7b5e24da47",
        width: 2320,
        height: 3408,
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
  "us-132-davenport-electric-motor": {
    sourcePdfSha256: "9147fc5c9d6565aa765198b42e900c90c5c0fe550b9162fe62727f86a5071960",
    reviewer: "Classic Patents editorial agent (GPT-5.6); independent source-pixel review",
    reviewedAt: "2026-09-03",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 1,
    assets: {
      "/patents/figures/us-132-davenport-electric-motor/drawing-sheet-source-v1.png": {
        sha256: "f47bf13c2da1b30cb022f54021b375e3a21bf05ff2726246c054374b22e8f09f",
        width: 2320,
        height: 3408,
      },
    },
  },
  "us-157124-glidden-barbed-wire": {
    sourcePdfSha256: "19c3874222e125ad1be8df9b1e4e59df4d7ff6452876588666a3c9ddf2cb0cc1",
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-03",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 6,
    assets: {
      "/patents/figures/us-157124-glidden-barbed-wire/source-sheet-1-v1.png": {
        sha256: "4002c9b8311556cb861bc5f2eaaf63a404ce01c1b0cac77d76a8a684169d0083",
        width: 2320,
        height: 3408,
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
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-03",
    acceptanceBasis: "direct-facsimile-crop-review",
    acceptedOccurrenceCount: 2,
    assets: {
      "/patents/figures/us-1781541-einstein-refrigerator/source-sheet-1-v1.png": {
        sha256: "8ad5c0284168c3bc123b82b79693f49e1774dcb16c93b8b90c708bf0e2483a05",
        width: 2320,
        height: 3408,
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
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-03",
    acceptanceBasis: "direct-facsimile-crop-review",
    acceptedOccurrenceCount: 8,
    assets: {
      "/patents/figures/us-200521-edison-phonograph/drawing-sheet-source-v1.png": {
        sha256: "6f4ffdaea7781497dad758b3bcf20d3467e13cc1384c85c17be9a03ae32c51b8",
        width: 2320,
        height: 3408,
      },
    },
  },
  "us-223898-edison-lightbulb": {
    sourcePdfSha256: "70c46d7c8624b1e471dffd1175b0f34e70b4b05b6a9adede43c198fe71abc054",
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-03",
    acceptanceBasis: "direct-facsimile-crop-review",
    acceptedOccurrenceCount: 6,
    assets: {
      "/patents/figures/us-223898-edison-lightbulb/source-sheet-1-v1.png": {
        sha256: "6a6bb2965a4b3b68d964cf7ebe6885e2037876e80661bdd7d99b7f0398e0053c",
        width: 2320,
        height: 3408,
      },
    },
  },
  "us-2318259-sikorsky-helicopter": {
    sourcePdfSha256: "7ab2b9b23907b26bff0afd37e2630b73b15c2c429c603a73cb841c8a2b4e114c",
    reviewer: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-09-02",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 15,
    assets: {
      "/patents/figures/us-2318259-sikorsky-helicopter/fig-1-source-crop-v1.png": {
        sha256: "6ad42ad8c7be4168787d108283f35e620cac0e2da424a7d3429ddf5c74c58beb",
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
    },
  },
  "us-247804-delaval-separator": {
    sourcePdfSha256: "aa9e284bf20a53467a36a3ae648c7ce5bc4b9599837af32281e04b316b5ef187",
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-03",
    acceptanceBasis: "direct-facsimile-crop-review",
    acceptedOccurrenceCount: 4,
    assets: {
      "/patents/figures/us-247804-delaval-separator/drawing-sheet-source-v1.png": {
        sha256: "33ae416685348135a7a286d9ceb16dc4ccf3fc3d1056afb878f2dec5a69a94d6",
        width: 2320,
        height: 3408,
      },
    },
  },
  "us-2495429-spencer-microwave": {
    sourcePdfSha256: "c5affa57d71dd79a431c8a87427672d9d04579cab911b1b6b5eec9a16ad00aca",
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-03",
    acceptanceBasis: "direct-facsimile-crop-review",
    acceptedOccurrenceCount: 1,
    assets: {
      "/patents/figures/us-2495429-spencer-microwave/drawing-sheet-source-v1.png": {
        sha256: "ab3aef1cd0afe66a2fa7f728bfedd51f0caaa7d1c80da36932e0a897841bd826",
        width: 2320,
        height: 3408,
      },
    },
  },
  "us-2717437-mestral-velcro": {
    sourcePdfSha256: "3b55f3a8b19575d9261a48f695368101b229bc505a21ea9c554e09161b7aa91a",
    reviewer: "Classic Patents editorial agent (GPT-5.6); independent source-pixel review",
    reviewedAt: "2026-09-03",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 11,
    assets: {
      "/patents/figures/us-2717437-mestral-velcro/source-sheet-1-v1.png": {
        sha256: "3836f440a26c7be2257dbf1bd985f775d0c5387fbbda49b30483bdab493c5dd9",
        width: 2320,
        height: 3408,
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
  "us-31128-otis-elevator": {
    sourcePdfSha256: "c35eb5c999bc20b015ef0d24a3ffb0f194123d780c8a46fabea7f2d52a355d42",
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-03",
    acceptanceBasis: "direct-facsimile-crop-review",
    acceptedOccurrenceCount: 8,
    assets: {
      "/patents/figures/us-31128-otis-elevator/source-sheet-1-v1.png": {
        sha256: "4d4d57f705b8eb92b73193c230e18decfb3f8f1d9c576a4d66e7478f777d8a15",
        width: 2320,
        height: 3408,
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
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-03",
    acceptanceBasis: "direct-facsimile-crop-review",
    acceptedOccurrenceCount: 8,
    assets: {
      "/patents/figures/us-319596-maxim-machine-gun/source-sheet-1-v1.png": {
        sha256: "da088da6e81eb36d878819c392f766edd3733e93e9df78f6fca1258c51bdc048",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-319596-maxim-machine-gun/source-sheet-2-v1.png": {
        sha256: "c2c0c2421227d1b1fc246a3331b88f7c47300b82d610c8e83882727fed939b93",
        width: 2320,
        height: 3408,
      },
    },
  },
  "us-3212649-amf-versatran": {
    sourcePdfSha256: "9a985a6bf91770914a5049c3f03e0cee2dc4bfe8711633891df68cc0b894ccbd",
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct full-resolution source-pixel review",
    reviewedAt: "2026-09-04",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 234,
    assets: {
      "/patents/figures/us-3212649-amf-versatran/source-sheet-1-v1.png": {
        sha256: "537c38d3f5b9f574ea37af6e7e8798a86e3995bfd07f6cdd721a11bf60b713bf",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3212649-amf-versatran/source-sheet-2-v1.png": {
        sha256: "242ab1b7d8898b4c902ed8d9f50031fa07cc1f196e4d4637c1a71fa8707da4bc",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3212649-amf-versatran/source-sheet-3-v1.png": {
        sha256: "4ea41c2b9aae229b27b7bdaeabe502be8d804645b1b3e76f2ddc9fa441716872",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3212649-amf-versatran/source-sheet-4-v1.png": {
        sha256: "84f7223ddb48136a2566499eb80490172cc88921f741692381a1fdec310376b9",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3212649-amf-versatran/source-sheet-5-v1.png": {
        sha256: "6e1e26be74911f15bffbba08d20f04ef827102eed9a823f4683b478c761f0b5b",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3212649-amf-versatran/source-sheet-6-v1.png": {
        sha256: "53e14f83ff37855aae0e17acf663371b95a63944eaa7bd3c349f5b3d12654507",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3212649-amf-versatran/source-sheet-7-v1.png": {
        sha256: "d06ead5d84a76af5af19e6ecb92657dbbc8880987817f2c92d2a9b8b0cb365e5",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3212649-amf-versatran/source-sheet-8-v1.png": {
        sha256: "32ec4fa1f91d114ec489e273ef5b67b06bfca1181e037a24ddad60b8f53ec004",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3212649-amf-versatran/source-sheet-9-v1.png": {
        sha256: "e7bcf63768fbc860be9effc3b698d018979b95a5ae7c5d601db1e62d8b85746d",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3212649-amf-versatran/source-sheet-10-v1.png": {
        sha256: "48bf047dc6d9c2866756a282fd3b037d3525ace947faaa65d5939330b159712b",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3212649-amf-versatran/source-sheet-11-v1.png": {
        sha256: "2aeb3e6315b0b64d1b63d99678175682b8dfaf0bed5667a87ccfad21d46a1947",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3212649-amf-versatran/source-sheet-12-v1.png": {
        sha256: "c90efd44ebf0f63efd254d4323dac6aae8fe376f4b355e3a9d5db7ae8dd3f03c",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3212649-amf-versatran/source-sheet-13-v1.png": {
        sha256: "ab6d702f07a28ecaf11a709029c1d4f43d5991f742e9f6fdff606d08640259f6",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3212649-amf-versatran/source-sheet-14-v1.png": {
        sha256: "4c2b5a3c0d8728f51caf0b8ed987a96edb1fd0d5344abb707cd3dd16d0a42c85",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3212649-amf-versatran/source-sheet-15-v1.png": {
        sha256: "398ff0479027df64c7aa6a95ce806937e0b3aeaaa57271196817a4c4462ef6d5",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3212649-amf-versatran/source-sheet-16-v1.png": {
        sha256: "6c79cf1ab61307a0a77099036ce44886ff1b9d77c35650612310474e62d4ea19",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3212649-amf-versatran/source-sheet-17-v1.png": {
        sha256: "e4fa3cdd274018d8d395fcb2d43319c16fb89fe3fbb71a50b28e3e829f86ceab",
        width: 2320,
        height: 3408,
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
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-03",
    acceptanceBasis: "direct-facsimile-crop-review",
    acceptedOccurrenceCount: 12,
    assets: {
      "/patents/figures/us-361931-daimler-engine/source-sheet-1-v1.png": {
        sha256: "1ac9ceb6eb1164d00298d671dc7100af8c75291f3072decf3accabbd809918ab",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-361931-daimler-engine/source-sheet-2-v1.png": {
        sha256: "653a2dfd70d4633a3d0a73b427e37b100fdcb6e0d213e85e372291c9131d574b",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-361931-daimler-engine/source-sheet-3-v1.png": {
        sha256: "4f83f9b64fd482f9f43c013d7719aed5b3f1da861f2cd0c9e738b0a781d1d00d",
        width: 2320,
        height: 3408,
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
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-03",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 15,
    assets: {
      "/patents/figures/us-3728480-baer-odyssey/source-sheet-pdf-02-v1.png": {
        sha256: "d7a61c5bb69c962a3f3d81666dbd8f40273f4e9874b9965fd017519ad45c98d0",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3728480-baer-odyssey/source-sheet-pdf-03-v1.png": {
        sha256: "291107b3b6e181f9d5022e3e32637b0d6decf0fd05cd148a8d07d5e6f80b4a01",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3728480-baer-odyssey/source-sheet-pdf-04-v1.png": {
        sha256: "6721c0be0f0e4bf898fd664743a8afc317d850ace640758fd22a576e4479c9ce",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3728480-baer-odyssey/source-sheet-pdf-05-v1.png": {
        sha256: "2e7b1041bbecc8cfc8cd428bbb158d5d26b40646f1bf6d1de0d75d5cadaceac0",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3728480-baer-odyssey/source-sheet-pdf-06-v1.png": {
        sha256: "da076ec7b71e0afff7b1409adb416b4c614e259adf045c0e06e146a70058a926",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3728480-baer-odyssey/source-sheet-pdf-11-v1.png": {
        sha256: "f2d48dfabb3ccbcf538a99fa563efc7fac9e7bceead5b52a4e63cb6b9fc38653",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3728480-baer-odyssey/source-sheet-pdf-12-v1.png": {
        sha256: "9dfccdecbeec4824881be41cc09fe4697d559a04c73066dfcec68783094e72a6",
        width: 2320,
        height: 3408,
      },
    },
  },
  "us-381968-tesla-motor": {
    sourcePdfSha256: "cffd7ff061b05feef92c2d6ef4d767c7b7e8c6b4e0d10cc9be3fbd51841dce12",
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 dpi source-pixel review",
    reviewedAt: "2026-09-03",
    acceptanceBasis: "direct-facsimile-crop-review",
    acceptedOccurrenceCount: 57,
    assets: {
      "/patents/figures/us-381968-tesla-motor/figs-1-to-8-and-1a-to-8a-source-sheet-v2.png": {
        sha256: "60b4c9f65579fec9da739ef948cdaadc82c2cfa52c114c30bdbad97be14850df",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-381968-tesla-motor/figs-9-to-12-source-sheet-v2.png": {
        sha256: "1d0fa15c195fd3e187d44573424dcf8752685a7b465a9fe50244665d526e3e90",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-381968-tesla-motor/figs-13-to-16-source-sheet-v2.png": {
        sha256: "b104b6cd2484534abda7bc39267c1c49155de3944ede61c898231235176018ae",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-381968-tesla-motor/figs-17-to-19-source-sheet-v2.png": {
        sha256: "162a8c2598287359f654b6a757af0aa190a601c5f0ee83191853e3fd40b38c67",
        width: 2320,
        height: 3408,
      },
    },
  },
  "us-3858581-kamen-medication-injection-device": {
    sourcePdfSha256: "1aa0df879ec119a9ad4025774e482dfc41e748127bc3f83cde31047daeedc35d",
    reviewer: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-09-02",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 33,
    assets: {
      "/patents/figures/us-3858581-kamen-medication-injection-device/fig-1-source-crop-v2.png": {
        sha256: "5cceb7d8b7cf17713a25b90fb0f2a961a51037f548db678d5d52a310f0cedbd6",
        width: 8700,
        height: 3400,
      },
      "/patents/figures/us-3858581-kamen-medication-injection-device/fig-2-source-crop-v2.png": {
        sha256: "46d347d89033a6d9d027a39270efcc5603b3c1862ec08d8f3e6553df805ee6e4",
        width: 9000,
        height: 3250,
      },
      "/patents/figures/us-3858581-kamen-medication-injection-device/fig-3-source-crop-v2.png": {
        sha256: "d0eed4ec3eec314567dd4be72d52b9d4b5d4fdb1d8756c142de0b97753990d0f",
        width: 8700,
        height: 4200,
      },
      "/patents/figures/us-3858581-kamen-medication-injection-device/fig-4-source-crop-v2.png": {
        sha256: "01d95cbb188a9a4ded179c960718b8e028f2e1eb4aaa8992329067d973bb03e6",
        width: 4000,
        height: 4200,
      },
      "/patents/figures/us-3858581-kamen-medication-injection-device/fig-5-source-crop-v2.png": {
        sha256: "8127be49739e1f2ec76439d6e27de8605b626eb044c79c8857d1fa464a63dce3",
        width: 4300,
        height: 3200,
      },
      "/patents/figures/us-3858581-kamen-medication-injection-device/fig-6-source-crop-v2.png": {
        sha256: "4f253f9a308f0c48cfe0a8c62674b98c48561fc2e5aff67ea811734fc570ea36",
        width: 8500,
        height: 7300,
      },
    },
  },
  "us-388850-eastman-kodak": {
    sourcePdfSha256: "49c9e9ff048771cb4fcc97b811af7f666c9925bb01b3b46d1588f95c63c0cfe1",
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-03",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 11,
    assets: {
      "/patents/figures/us-388850-eastman-kodak/source-sheet-1-v1.png": {
        sha256: "67b465101abf5be4d2b653ce5e8a7df161e97a85d2166b229541484fbedc19a1",
        width: 2560,
        height: 3300,
      },
      "/patents/figures/us-388850-eastman-kodak/source-sheet-2-v1.png": {
        sha256: "2d6f3da0a93b5a4f5248db89f9dc950284ce6f94c836bee38540ae537534edcb",
        width: 2560,
        height: 3300,
      },
      "/patents/figures/us-388850-eastman-kodak/source-sheet-3-v1.png": {
        sha256: "b3d072a586e67e41c2fb960e8e92a646289f68122ce76f930df180fc107902d0",
        width: 2560,
        height: 3300,
      },
    },
  },
  "us-4063220-metcalfe-ethernet": {
    sourcePdfSha256: "3bd400ad08a604c1911f554f3bda8ddc4a64923170760736fde6bd481e5ec928",
    reviewer: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-09-02",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 32,
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
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-03",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 16,
    assets: {
      "/patents/figures/us-4341502-makino-scara/source-sheet-2-v1.png": {
        sha256: "e6ec06f96c767ce5f8a6ff43d912466f6ef3739e31302cc80aac712be2e0155a",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-4341502-makino-scara/source-sheet-3-v1.png": {
        sha256: "74beb6e9c0c307287bbb8d1b4c797a1d3942f6ddf27cf9e256c0d4757c346398",
        width: 2320,
        height: 3408,
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
    reviewer: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-09-02",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 48,
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
    reviewer: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-09-02",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 11,
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
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-03",
    acceptanceBasis: "direct-facsimile-crop-review",
    acceptedOccurrenceCount: 11,
    assets: {
      "/patents/figures/us-593138-tesla-coil/source-sheet-1.png": {
        sha256: "1cd9e455b7277744b52865ac27aba4b43180494bb608c2c33d69c59bc371004a",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-593138-tesla-coil/source-sheet-2.png": {
        sha256: "a7112e2d25055cb226c93504977020e5322e68005a61744b6506e3bb282b49d7",
        width: 2320,
        height: 3408,
      },
    },
  },
  "us-608969-parsons-turbine": {
    sourcePdfSha256: "fafd0884e61225ee7f93d0a88c81229cbbb4984e48869c204af58cb6af64b991",
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-03",
    acceptanceBasis: "direct-facsimile-crop-review",
    acceptedOccurrenceCount: 7,
    assets: {
      "/patents/figures/us-608969-parsons-turbine/source-sheet-1-v1.png": {
        sha256: "c62b45cc66223e233b986f2fde542eca3d5b221cde18d8376cb70138e2d6d491",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-608969-parsons-turbine/source-sheet-2-v1.png": {
        sha256: "9f227e36650567fac56aa0f94f22674f5385b9658df3dbdca0d9cf6466d4878e",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-608969-parsons-turbine/source-sheet-3-v1.png": {
        sha256: "d6a0d2cc7eae660c632063ed6b94d803c938fd922afb3c5cf6fc19424935eb98",
        width: 2320,
        height: 3408,
      },
    },
  },
  "us-6285999-pagerank": {
    sourcePdfSha256: "c2e024116b9411385aa9cb5d51d3eb34b99f59db190c2bb9298d9d6d6eeed2e4",
    reviewer: "Classic Patents editorial agent (GPT-5 Codex)",
    reviewedAt: "2026-09-02",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 6,
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
    reviewer: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-09-02",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 25,
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
      "/patents/figures/us-6302230-kamen-segway/fig-8-source-crop-v1.png": {
        sha256: "4aef909643b3d360efe295b1cac6de648f451944624ebd101eaef6be99c580bd",
        width: 2088,
        height: 2930,
      },
      "/patents/figures/us-6302230-kamen-segway/fig-9-source-crop-v1.png": {
        sha256: "14500ac42dc12be5fc7765fd0dd84430b23ff5c0b382d14960117d18a4f23029",
        width: 2088,
        height: 2930,
      },
      "/patents/figures/us-6302230-kamen-segway/fig-10-source-crop-v1.png": {
        sha256: "d0313f42d180ee882f89b0af7a86889a94deaba1f85ea73c7d22ffc5fd5ad9c6",
        width: 2088,
        height: 2930,
      },
      "/patents/figures/us-6302230-kamen-segway/fig-11-source-crop-v1.png": {
        sha256: "b85b4574b393fbdcd949d525c7f3e537734786fad5d10e650faa1742eb5f4a13",
        width: 2088,
        height: 2930,
      },
      "/patents/figures/us-6302230-kamen-segway/fig-12-source-crop-v1.png": {
        sha256: "2f954a3cfd880ea5764b9d426dd8542601e2093854f4bc61740e163b6bae04c4",
        width: 2088,
        height: 2930,
      },
      "/patents/figures/us-6302230-kamen-segway/fig-13-source-crop-v1.png": {
        sha256: "34df43594e9ea2864dc932cafa176435b96cbca14c7db768d40621dc20e7da8d",
        width: 2088,
        height: 2930,
      },
      "/patents/figures/us-6302230-kamen-segway/fig-14-source-crop-v1.png": {
        sha256: "f5a83e42d7baa45bb7f1aaaf6b17051938857b7b25b3aeb7d40a06757b7909a1",
        width: 2088,
        height: 2930,
      },
      "/patents/figures/us-6302230-kamen-segway/fig-15-source-crop-v1.png": {
        sha256: "720902747ddf2cae69309550d6f105df5c4898964ac10b4c1b82a4e5c7c19a5e",
        width: 2088,
        height: 2930,
      },
      "/patents/figures/us-6302230-kamen-segway/fig-16-source-crop-v1.png": {
        sha256: "1c59f70fc1f3cbea9d1ef4589072e6eef86522bf32b7ad7e11d39cd659597b57",
        width: 2088,
        height: 2930,
      },
    },
  },
  "us-6469-lincoln-buoy": {
    sourcePdfSha256: "0663103c4dc8e15ae66d7829ace7916bd4025bd1751afb8710fca8d3fdbf53be",
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-03",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 10,
    assets: {
      "/patents/figures/us-6469-lincoln-buoy/source-sheet-1-v1.png": {
        sha256: "56bd69ba57f894c068b46ac83bb58d251f5c1e853966168bfaf8004638ef6add",
        width: 2320,
        height: 3408,
      },
    },
  },
  "us-400766-hall-aluminium": {
    sourcePdfSha256: "8a9cda34caaa0426bc62d75ca3910cab636c9f0329cb2f6193019c95c5d94791",
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-03",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 6,
    assets: {
      "/patents/figures/us-400766-hall-aluminium/source-sheet-1-v1.png": {
        sha256: "05f64e513dab40fb7d4ba6f21e71fda8ca7b2f3766cb7f56c3b4fc7f0b349cdd",
        width: 2320,
        height: 3408,
      },
    },
  },
  "us-6594844-roomba": {
    sourcePdfSha256: "66133fab282d46a32c5e5228d9207bcce1d2b49db90d627325592964fe4d5a3e",
    reviewer: "Classic Patents editorial agent (GPT-5.6); independent source-pixel review",
    reviewedAt: "2026-09-03",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 4,
    assets: {
      "/patents/figures/us-6594844-roomba/source-sheet-1-v1.png": {
        sha256: "94e6a12462932936aee2df4b36939da798c1ac878058111621758a0ba7bc627b",
        width: 2320,
        height: 3408,
      },
    },
  },
  "us-6162-corliss-steam-engine": {
    sourcePdfSha256: "22a03c717ed383165143af5aa3b85c8dac0705eaa4cdadcf93130ba28ef76ff5",
    reviewer: "Classic Patents editorial agent (GPT-5.6); independent source-pixel review",
    reviewedAt: "2026-09-03",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 7,
    assets: {
      "/patents/figures/us-6162-corliss-steam-engine/source-sheet-1-v1.png": {
        sha256: "faa48a280c5b0b6fa42bf2f8405e9e8ff2b61fc4a17eecb54563866823453314",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-6162-corliss-steam-engine/source-sheet-2-v1.png": {
        sha256: "3aefd2beed1a3edf5a28e72f842a65678ae8616f459a66b7bbfc5b0d6087497d",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-6162-corliss-steam-engine/source-sheet-3-v1.png": {
        sha256: "718dc57628f1822b406ee44bb1f532fc674c920de255f679b415bccd2ec5ac61",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-6162-corliss-steam-engine/source-sheet-4-v1.png": {
        sha256: "05719997036b5507a4396b1f6e89ea2dd3470d682cfe45c96154ef0c3be40f9f",
        width: 2320,
        height: 3408,
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
  "us-821393-wright-flyer": {
    sourcePdfSha256: "678bea5d81cb4e90a15c998bc932d2cf01bc87cfc3fcc53f0ecbdbdc70097966",
    reviewer: "Classic Patents editorial agent (GPT-5.6); independent source-pixel review",
    reviewedAt: "2026-09-03",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 15,
    assets: {
      "/patents/figures/us-821393-wright-flyer/fig-1-source-sheet-v1.png": {
        sha256: "b09b55b78fd5fd0e321b6e939e665d0981b1724d2fc2b50b8721cac657f79390",
        width: 3408,
        height: 2320,
      },
      "/patents/figures/us-821393-wright-flyer/fig-2-source-sheet-v1.png": {
        sha256: "cedeeaf0931143da7b82a2979be8213470118535eb90e3907c586b51fecb98d4",
        width: 3408,
        height: 2320,
      },
      "/patents/figures/us-821393-wright-flyer/figs-3-5-source-sheet-v1.png": {
        sha256: "c223b62ec6fb80e1a58bc958af129c34f54be685814883e4e9b4b87ba13e60cc",
        width: 3408,
        height: 2320,
      },
    },
  },
  "us-879532-de-forest-audion": {
    sourcePdfSha256: "3a37d70051d784a5a086d53b8d2d09f372b8bb14d40179b68b62a5c166e7876e",
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-03",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 6,
    assets: {
      "/patents/figures/us-879532-de-forest-audion/source-sheet-1-v1.png": {
        sha256: "27c094b22bc5ca46c4e6c664e5c986c51d4076c2f49818b23055e6f60cff7182",
        width: 2320,
        height: 3408,
      },
    },
  },
  "us-x8277-mccormick-reaper": {
    sourcePdfSha256: "24712ca3e966994d72716ccca6df6ef9a1fb3751b30fe34bfeb549ab6ba7f400",
    reviewer: "Classic Patents editorial agent (GPT-5.6); independent source-pixel review",
    reviewedAt: "2026-09-03",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 1,
    assets: {
      "/patents/figures/us-x8277-mccormick-reaper/source-sheet-1-v1.png": {
        sha256: "ccaf8f0f56d335c1a980cc81e8c336066eb43a33af00f4e0522376b0b034e4d5",
        width: 2320,
        height: 3408,
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
