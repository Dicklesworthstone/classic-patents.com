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
  "us-3237-rillieux-evaporator": {
    sourcePdfSha256: "10d9a2c3909f1a7d7086c063925f96feed8aa362e1b39a64275a869853dc1d7a",
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-sheet review",
    reviewedAt: "2026-09-04",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 6,
    assets: {
      "/patents/figures/us-3237-rillieux-evaporator/source-sheet-1-v1.png": {
        sha256: "5f18d9afe016bfe9ad8cf6a069f5b3568c1517ba8cabfb98550a0af92a0389a7",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3237-rillieux-evaporator/source-sheet-2-v1.png": {
        sha256: "772355903b4520d2854d5f3051d81ef448fa8e699674acbb467a700d272efdce",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3237-rillieux-evaporator/source-sheet-3-v1.png": {
        sha256: "423cc209a90b340ff4ce57e9876ba81e8c7a5fe217e62aa92768f89a0788a60d",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3237-rillieux-evaporator/source-sheet-4-v1.png": {
        sha256: "ba17565044e955be2cc99e4b45ab83d8ddca83f629869e7b2c803f1b9032687f",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3237-rillieux-evaporator/source-sheet-5-v1.png": {
        sha256: "36a035fbd94df854fa994b1d4a88292413ddafae53367739161bde41214b3917",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3237-rillieux-evaporator/source-sheet-6-v1.png": {
        sha256: "e87510ffbc30a2384db658ef790c1fc1069fa257e48b9654e910b397e008276a",
        width: 2320,
        height: 3408,
      },
    },
  },
  "us-3138743-kilby-integrated-circuit": {
    sourcePdfSha256: "e523c17aaef78f727181d87c427be3edf10f964bed20b90ef07a8099a1c18eef",
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-sheet review",
    reviewedAt: "2026-09-04",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 47,
    assets: {
      "/patents/figures/us-3138743-kilby-integrated-circuit/source-sheet-1-v1.png": {
        sha256: "277a2ad986ce7ada30cd138d5e9fd8e3586a309405bb22872de8222173da522d",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3138743-kilby-integrated-circuit/source-sheet-2-v1.png": {
        sha256: "452d8aac115c9fabcee2c839dee0d6e2e4ca8bbab825b30ba3d466c74fdf7ab3",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3138743-kilby-integrated-circuit/source-sheet-3-v1.png": {
        sha256: "7d4e216527526cdbc7e431abea336b285ad0aedb6d5cf247cbc43277dbfb58e3",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3138743-kilby-integrated-circuit/source-sheet-4-v1.png": {
        sha256: "bac412c1f14de683bd537b19c3fa7f54c38ab1f5b9c02535e3f03697e98ee191",
        width: 2320,
        height: 3408,
      },
    },
  },
  "us-x72-whitney-cotton-gin": {
    sourcePdfSha256: "9b0873182dbd2852a89bbf5bc7101e2c3b7a2d0cc76cee0df5c7acbfc86844ee",
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-sheet review",
    reviewedAt: "2026-09-04",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 25,
    assets: {
      "/patents/figures/us-x72-whitney-cotton-gin/source-sheet-1-v1.png": {
        sha256: "6d99d6afdcc73a4f9d25d349bbf938f6a79051e10b7c5e26ce0ed930991ded38",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-x72-whitney-cotton-gin/source-sheet-2-v1.png": {
        sha256: "d44db37019961e5485d20672bc66320579a7c1963705258275605eccb72ca4f9",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-x72-whitney-cotton-gin/source-sheet-3-v1.png": {
        sha256: "1a3e2e973aa7e71186b8116251704c2518b9b828f46d64d42d8b6b440e620fda",
        width: 2320,
        height: 3408,
      },
    },
  },
  "us-395781-hollerith-tabulating": {
    sourcePdfSha256: "39d7c9879f8386f63f609bd43c0a73c96dbe50943d5d17044733c254b8d5a780",
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-sheet review",
    reviewedAt: "2026-09-04",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 32,
    assets: {
      "/patents/figures/us-395781-hollerith-tabulating/source-sheet-1-v1.png": {
        sha256: "60fcc95ebdea63a565aa112a2cc4b1ee58912288e4541c6a49eb1be94052bee4",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-395781-hollerith-tabulating/source-sheet-2-v1.png": {
        sha256: "bd7bcabf3928bee561eb2dd06eafdfb5aaf45f4f768838433ad4f31d158e682d",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-395781-hollerith-tabulating/source-sheet-3-v1.png": {
        sha256: "75c83fe2d594e58787c14db6908aa071820ae0046d1abb00283af7d2b09bfc18",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-395781-hollerith-tabulating/source-sheet-4-v1.png": {
        sha256: "0c28a101fad91de521fb6b550eee275949bba956126c4305d6878fc67d858a18",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-395781-hollerith-tabulating/source-sheet-5-v1.png": {
        sha256: "bff13b8aa1c0803aac55e8e3f6c6282e4ad19fd099b09d61d603ddec45e5c91c",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-395781-hollerith-tabulating/source-sheet-6-v1.png": {
        sha256: "a424d17b54e03a750e880825151d075ff1766a6b9bdd0e71e75a59d4dfc28772",
        width: 2320,
        height: 3408,
      },
    },
  },
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
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-04",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 22,
    assets: {
      "/patents/figures/us-124404-westinghouse-air-brake/source-sheet-1-v1.png": {
        sha256: "7417d1ebd75e021b68f610b49d6f7af4e4ca0cf118dade6e6ca292892bb59c90",
        width: 2320,
        height: 3408,
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
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-04",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 55,
    assets: {
      "/patents/figures/us-1647-morse-telegraph/source-sheet-1-v1.png": {
        sha256: "7b8d588e37946b44a183e405cb4c2636084063bf7bb4d587c7c81b85043e664d",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-1647-morse-telegraph/source-sheet-2-v1.png": {
        sha256: "963b3cbd6c7d73a12cd819b4e88d8e0a3705ed1fc80e744eae06ed5a2adaa351",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-1647-morse-telegraph/source-sheet-3-v1.png": {
        sha256: "b00e83560fdb7a650f65b376e928c8b89bf3d03ccc091fc8f01af109e799b832",
        width: 2320,
        height: 3408,
      },
    },
  },
  "us-174465-bell-telephone": {
    sourcePdfSha256: "cb1a0fa7bd871937575e240adf904fa3ea8f462b3bfceb4e7cbbb0811909a8e9",
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-04",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 24,
    assets: {
      "/patents/figures/us-174465-bell-telephone/source-sheet-1-v1.png": {
        sha256: "45d1b67692b9ae812b48c261fa60a103a6b3e2e736b65506f4b521de21bb695f",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-174465-bell-telephone/source-sheet-2-v1.png": {
        sha256: "656aa9872a2cb51d71b30c5ef87a3e731f5510aee9e3ae82cb8d472aa653d465",
        width: 2320,
        height: 3408,
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
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-sheet review",
    reviewedAt: "2026-09-04",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 41,
    assets: {
      "/patents/figures/us-194047-otto-engine/source-sheet-1-v1.png": {
        sha256: "b41b87e739ff73106de51ab86c128167f233441b1891b06f08b5b8fdfbca72f4",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-194047-otto-engine/source-sheet-2-v1.png": {
        sha256: "e82e41b38499cf1ead14f3b5bc0f0bfecffce9411d32de2c416375328bef8a10",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-194047-otto-engine/source-sheet-3-v1.png": {
        sha256: "89fed96914f5a2d227c77545e997a70bb28cb74548a2ad51b6455073e59414da",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-194047-otto-engine/source-sheet-4-v1.png": {
        sha256: "5f8d940362db576c0b5c971f92cd550ed63284e4857d365568fb9fd9c6c993b8",
        width: 2320,
        height: 3408,
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
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct native-raster source-sheet review",
    reviewedAt: "2026-09-04",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 90,
    assets: {
      "/patents/figures/us-2846084-goertz-electronic-master-slave-manipulator/source-sheet-1-v1.png":
        {
          sha256: "6109920af3a2de6e9387984d385147fc1ffd51c6cc18bd2ac85e7eb780c7fa4a",
          width: 2320,
          height: 3408,
        },
      "/patents/figures/us-2846084-goertz-electronic-master-slave-manipulator/source-sheet-2-v1.png":
        {
          sha256: "3bec03e0b40268d40468147f2958384ced8b14f324b9faee126437744b3b8dea",
          width: 2320,
          height: 3408,
        },
      "/patents/figures/us-2846084-goertz-electronic-master-slave-manipulator/source-sheet-3-v1.png":
        {
          sha256: "5187501e7d4c85897f8471d777c92ed53fa8de155f6487e3bb3048a283df34f7",
          width: 2320,
          height: 3408,
        },
      "/patents/figures/us-2846084-goertz-electronic-master-slave-manipulator/source-sheet-4-v1.png":
        {
          sha256: "e14067c7f3ac103d976ef6e25384ce3613bd0b8f397692d235449fd938a77755",
          width: 2320,
          height: 3408,
        },
      "/patents/figures/us-2846084-goertz-electronic-master-slave-manipulator/source-sheet-5-v1.png":
        {
          sha256: "95f1c1ed438a33f5da55cb38dc918e95080eacc7d02840aaefba02763c1356bd",
          width: 2320,
          height: 3408,
        },
      "/patents/figures/us-2846084-goertz-electronic-master-slave-manipulator/source-sheet-6-v1.png":
        {
          sha256: "7388f25d24e6c3cfbb8bc0c22f8bb3d73765335fb50e7a6e1bc598bc07325735",
          width: 2320,
          height: 3408,
        },
      "/patents/figures/us-2846084-goertz-electronic-master-slave-manipulator/source-sheet-7-v1.png":
        {
          sha256: "3c9d1343f23f198f1e29fbb55cf0b44527e26b45061265da5485a4fc9273fe60",
          width: 2320,
          height: 3408,
        },
      "/patents/figures/us-2846084-goertz-electronic-master-slave-manipulator/source-sheet-8-v1.png":
        {
          sha256: "da13dcfe50d3871bb5e277b080c01746d282cdfde4a8c7cb9bbf4dafe98d1170",
          width: 2320,
          height: 3408,
        },
      "/patents/figures/us-2846084-goertz-electronic-master-slave-manipulator/source-sheet-9-v1.png":
        {
          sha256: "3405391f35645295f3851aa76a50d82dbed1f08fe770eaf4ef91aa23561c8a59",
          width: 2320,
          height: 3408,
        },
      "/patents/figures/us-2846084-goertz-electronic-master-slave-manipulator/source-sheet-10-v1.png":
        {
          sha256: "61954def99dffa276de9dd571d5e32d974ffb196ad5f4de990b7a16e8eafa537",
          width: 2320,
          height: 3408,
        },
      "/patents/figures/us-2846084-goertz-electronic-master-slave-manipulator/source-sheet-11-v1.png":
        {
          sha256: "421fbe76820ccc4be49ec45cf4b19cffffb817bdbda4d144108f44ed1fa15d0d",
          width: 2320,
          height: 3408,
        },
    },
  },
  "us-2988237-devol-programmed-transfer": {
    sourcePdfSha256: "9b0ea9729cf6d670a21dfed17264d7b78fa343ab1e98467fc0d3255a5cd03790",
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-04",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 20,
    assets: {
      "/patents/figures/us-2988237-devol-programmed-transfer/source-sheet-1-v1.png": {
        sha256: "840fe1202ca5890bef7e2f19eb1de144576a71909d7e067e227a64b2674b5da4",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-2988237-devol-programmed-transfer/source-sheet-2-v1.png": {
        sha256: "b2d29359ef512cdd3b7fb51835a26730455565af790c88c91bc448d851678207",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-2988237-devol-programmed-transfer/source-sheet-3-v1.png": {
        sha256: "61c5825513ea014d5fc45b25a9e39759be421f485a255f42f178fff99e9ab4a3",
        width: 2320,
        height: 3408,
      },
    },
  },
  "us-2929922-townes-laser": {
    sourcePdfSha256: "0c67f2d45609a1d465f75530c733c7c2feffb87994fa62392cf79f7e737d9270",
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-04",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 11,
    assets: {
      "/patents/figures/us-2929922-townes-laser/sheet-1-1.png": {
        sha256: "1ea31b81c55171a0c6ced97ed94d80eedb442e4f81bb6248d1ebee8e81648283",
        width: 2320,
        height: 3408,
      },
    },
  },
  "us-2981877-noyce-ic": {
    sourcePdfSha256: "c6efa2efedcfdec092a8f5aff7354fc067f3b287bbfad6749e1235cee77a2d59",
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-04",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 55,
    assets: {
      "/patents/figures/us-2981877-noyce-ic/source-sheet-1-v1.png": {
        sha256: "5c712d83a261ef7cb40ce16f63a557d79f149a7bedc029bd8092730cb8846aef",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-2981877-noyce-ic/source-sheet-2-v1.png": {
        sha256: "c859f8f64fb58cd725beb5914d25793a96242d8026ebb6dc4d2d007cde23e1b6",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-2981877-noyce-ic/source-sheet-3-v1.png": {
        sha256: "3d9e2032361d8433675827cd79f6f6440efed65c6e5b1470f0b83bfade4fc99c",
        width: 2320,
        height: 3408,
      },
    },
  },
  "us-3081379-lemelson-machine-vision": {
    sourcePdfSha256: "2550a9d494a822f3f639c985899452b39432d53928db419633458d020c554b44",
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 72-DPI source-pixel review",
    reviewedAt: "2026-09-04",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 72,
    assets: {
      "/patents/figures/us-3081379-lemelson-machine-vision/source-sheet-1-v1.png": {
        sha256: "34afc9023facb367dafc1e503464ded850699b9b5d27a47eb57ba8bff84739e0",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3081379-lemelson-machine-vision/source-sheet-2-v1.png": {
        sha256: "80b8303a1687e31eae0601b631f6f2d0d7ad7e23a7416db18110c610763fae6a",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3081379-lemelson-machine-vision/source-sheet-3-v1.png": {
        sha256: "f6ecef18552c3fdeba5287b665f3ff311626aa240452635b354ee3f79b7c31cb",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3081379-lemelson-machine-vision/source-sheet-4-v1.png": {
        sha256: "6ac240b87498947eaec7dd5e5a149d08449f9bf0563224f7b0757539339c8c84",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3081379-lemelson-machine-vision/source-sheet-5-v1.png": {
        sha256: "d013f677f1ffcfeef96515205eb5186c68fcd669241991f41945bb3880caa475",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3081379-lemelson-machine-vision/source-sheet-6-v1.png": {
        sha256: "62e7477155377eda07f3038eff083928a5773a3051265a32b90ca4502c5d01c4",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3081379-lemelson-machine-vision/source-sheet-7-v1.png": {
        sha256: "d012bf96141e941839c9cc50dbd1d82bb5cc32b0100bf6d42ce5c2eb76a68860",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3081379-lemelson-machine-vision/source-sheet-8-v1.png": {
        sha256: "9abf00192cd1adc10d2143427cf27becc0982dda2ab1ca49da0f4d0397d7a89b",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3081379-lemelson-machine-vision/source-sheet-9-v1.png": {
        sha256: "61f15caa7e9130e1e8e1fb4f47f65fb38fef73641bff72ed4ca5a543ef482edd",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3081379-lemelson-machine-vision/source-sheet-10-v1.png": {
        sha256: "7f8d1b5ddd6da3995f90c5ca5c08624ffbb3f607ac2ec1618cc7bbeeb4c16d0b",
        width: 2320,
        height: 3408,
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
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct native-raster source-sheet review",
    reviewedAt: "2026-09-04",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 23,
    assets: {
      "/patents/figures/us-3119501-lemelson-automatic-warehousing/source-sheet-1-v1.png": {
        sha256: "bda44d0134aae5768b1cbf842f720f4f17ef43d7806a9226f3241947504d2bce",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3119501-lemelson-automatic-warehousing/source-sheet-2-v1.png": {
        sha256: "1a62d66914d7cd968bc1b255da17b3998eb1c6048012f5d941197dd59f30772e",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3119501-lemelson-automatic-warehousing/source-sheet-3-v1.png": {
        sha256: "154f03b338950f3e18b56de1b3f283ef90e7113b3fcb6577211018d4d1af2848",
        width: 2320,
        height: 3408,
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
    reviewer:
      "Classic Patents editorial agent (GPT-5.6); direct full-resolution source-pixel review",
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
  "us-2524035-bardeen-transistor": {
    sourcePdfSha256: "6de62de550a221c5380088e0485c2ae6955334a199b6da15ff3dcd6ca65978de",
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 180 DPI source-pixel review",
    reviewedAt: "2026-09-04",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 85,
    assets: {
      "/patents/figures/us-2524035-bardeen-transistor/figs-1-2-10-12-source-crop-v1.png": {
        sha256: "7744e8caca186a4187d11adf9228d46e39f3c2e6c1ccf32ceac0e4faf5f0def4",
        width: 1392,
        height: 2045,
      },
      "/patents/figures/us-2524035-bardeen-transistor/figs-3-9-source-crop-v1.png": {
        sha256: "0bbe47d9d635cbeca1802221de61ed4c0a4b1c47efa4792e91cc2dc204a35262",
        width: 1392,
        height: 2045,
      },
      "/patents/figures/us-2524035-bardeen-transistor/figs-13-16-source-crop-v1.png": {
        sha256: "090ad87971cf90e34a8c0825748015105c4c93ada06a6723afe24e5a1d5236e9",
        width: 1392,
        height: 2045,
      },
    },
  },
  "us-3858232-boyle-smith-ccd": {
    sourcePdfSha256: "769ab5a1dc91d51bfeebea53b082de4d9b712deb41c096cdac41aae4d3142ec2",
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-04",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 104,
    assets: {
      "/patents/figures/us-3858232-boyle-smith-ccd/source-sheet-2-v1.png": {
        sha256: "3eadfb055efca66b0116ff900775b88e5e493f5de014deadb417af2cfb7e148e",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3858232-boyle-smith-ccd/source-sheet-3-v1.png": {
        sha256: "e9d21a6993f081c55ba9f17d4afd69ffd76836197ce49484b668ea3a1dfbc7dd",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3858232-boyle-smith-ccd/source-sheet-4-v1.png": {
        sha256: "95618e2f9ae328298d3a0bc202274a7bac994142e60fb6e817bef91752d8ef44",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3858232-boyle-smith-ccd/source-sheet-5-v1.png": {
        sha256: "8c67fdddfbaaf962729dee6a64b2961e90c00a7828ef333ebb4cb8c53de61252",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3858232-boyle-smith-ccd/source-sheet-6-v1.png": {
        sha256: "4f499eb79a992470055dae6279c91e3181b6ad768d5e9493ee0e070774c49695",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3858232-boyle-smith-ccd/source-sheet-7-v1.png": {
        sha256: "47d30c7190bee3deabe9794a0dbf71b7d60bba733fa3d846f77a9b6da2a6dfa6",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3858232-boyle-smith-ccd/source-sheet-8-v1.png": {
        sha256: "9d425dbf2e213f644b589592befee0128d5bdb233f08cd80c31e5a78d8153598",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3858232-boyle-smith-ccd/source-sheet-9-v1.png": {
        sha256: "12ef9c4683041aec68fca877ea42fcaf35fda276f729c1b8c67b2bd90b857c75",
        width: 2320,
        height: 3408,
      },
    },
  },
  "us-3353115-maiman-ruby-laser": {
    sourcePdfSha256: "3222cc08d6662719dba7566e07f96f3d1687dda40d6fe213ac9993ceb1ba03e6",
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-04",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 59,
    assets: {
      "/patents/figures/us-3353115-maiman-ruby-laser/sheet-1-01.png": {
        sha256: "d1a4ce060e2cfa1ef093df3baf853ed837299f16438090893754c5f7216ef898",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3353115-maiman-ruby-laser/sheet-2-02.png": {
        sha256: "95eceb8df7e723a6f90ee38f32a940a437c626ba31776d525340f03f897c9e7e",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3353115-maiman-ruby-laser/sheet-3-03.png": {
        sha256: "15f1b618e64fa04356a907364539be06f00057a6baa5c923d75c6e75d2d81117",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3353115-maiman-ruby-laser/sheet-4-04.png": {
        sha256: "6e29ba1d4bfc34b9e9fb1956e03a9a5c2085e183ebc96f1c4cfd0cc76fbcaf33",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3353115-maiman-ruby-laser/sheet-5-05.png": {
        sha256: "ae8ede41e4731be156d91c4f7444765250419ccc92ea88abbf63d53779c5a779",
        width: 2320,
        height: 3408,
      },
    },
  },
  "us-3260375-lemelson-adjustable-manipulator": {
    sourcePdfSha256: "e7be38b9f72cba77958ddab0422e147a6947056e4d51dddc7559508723cbdf34",
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct native-raster source-sheet review",
    reviewedAt: "2026-09-04",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 57,
    assets: {
      "/patents/figures/us-3260375-lemelson-adjustable-manipulator/source-sheet-1-v1.png": {
        sha256: "05189d8d8c5efc4ec6fbb8b35078ce43377c2cd94b6de612bd542d9cd03e0887",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3260375-lemelson-adjustable-manipulator/source-sheet-2-v1.png": {
        sha256: "2cb28e4169fd10acfc7d8b607b3dfdd9d4254a539035efb315c6e657f02c7c29",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3260375-lemelson-adjustable-manipulator/source-sheet-3-v1.png": {
        sha256: "75b4e79097a06a99cda9b67d0cfcc84979e8ee592595f58d33f75e1fd6285121",
        width: 2320,
        height: 3408,
      },
    },
  },
  "us-3313014-lemelson-automatic-production": {
    sourcePdfSha256: "6554714ab50e6e0e194081b6cb67c02d689a218418710be059998502ef329548",
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-sheet review",
    reviewedAt: "2026-09-04",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 24,
    assets: {
      "/patents/figures/us-3313014-lemelson-automatic-production/source-sheet-1-v1.png": {
        sha256: "0dbb36acddde2826b2eb880567ebfddc26b2a929b69d7ebcd372c6e9c40a2270",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3313014-lemelson-automatic-production/source-sheet-2-v1.png": {
        sha256: "34994bbd00ff64370a48d4ca7d6aaf9b28f65500d93bdc97d74dfee4cf0f4145",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3313014-lemelson-automatic-production/source-sheet-3-v1.png": {
        sha256: "7796ad707c2c3b630fcab7ae56108cf72277dc31e40897ceeb58b7c00e922ebe",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3313014-lemelson-automatic-production/source-sheet-4-v1.png": {
        sha256: "8a9244e4a607a18c3d76ebb803e5057bd925ab74ea2fab2e967ec4d037a68080",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3313014-lemelson-automatic-production/source-sheet-5-v1.png": {
        sha256: "d6f01a8a58ef449181a2cf8fd104c7012c1907746e3c543703262d2e851b909a",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3313014-lemelson-automatic-production/source-sheet-6-v1.png": {
        sha256: "d74aa0913de4f1aa8d2a0f5aeb6da071b180a2b9e26f3310b2f90d28a25b0110",
        width: 2320,
        height: 3408,
      },
    },
  },
  "us-3541541-engelbart-mouse": {
    sourcePdfSha256: "2a01a32bc3d4c3eec1745dd77fcb92f1404e02844c640c9c10a451ed3b5791e0",
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-sheet review",
    reviewedAt: "2026-09-04",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 34,
    assets: {
      "/patents/figures/us-3541541-engelbart-mouse/source-sheet-1-v1.png": {
        sha256: "fc407967aaa9b9a54e176b33d2d1100da294ebebf031849beb03a286c3b50827",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3541541-engelbart-mouse/source-sheet-2-v1.png": {
        sha256: "5974818aff9488ee7c5e5433851ae025c8f5dc580a301a3c44c1b213a15ebaea",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-3541541-engelbart-mouse/source-sheet-3-v1.png": {
        sha256: "bb2e1faa8fc8d29656935f71a39e0c1cec41f4bf8a1d2f9ab0cfc7e3f7846bf0",
        width: 2320,
        height: 3408,
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
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-sheet review",
    reviewedAt: "2026-09-04",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 21,
    assets: {
      "/patents/figures/us-36836-gatling-gun/source-sheet-1-v1.png": {
        sha256: "991fa201957e5a571044f89e47342f3b3b645a7c381026619da25be9c003facd",
        width: 2320,
        height: 3408,
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
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-sheet review",
    reviewedAt: "2026-09-04",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 35,
    assets: {
      "/patents/figures/us-4098001-watson-rcc/source-sheet-1-v1.png": {
        sha256: "89d12d6fb431b3e35bc45ea5f189eaf10b46f02019161e25222f131c82cede72",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-4098001-watson-rcc/source-sheet-2-v1.png": {
        sha256: "525e6329d7522246211d3506d03319b0284dca11353ad9b4f1bb70b174b1ccec",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-4098001-watson-rcc/source-sheet-3-v1.png": {
        sha256: "0f3b8567dc4b9c08f6fc1905b5e2e11f4728103cb53640f83877462f7c2fe16d",
        width: 2320,
        height: 3408,
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
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct native-raster source-sheet review",
    reviewedAt: "2026-09-04",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 48,
    assets: {
      "/patents/figures/us-4512709-milacron-robot-toolchanger/source-sheet-1-v1.png": {
        sha256: "69a4af0cd55654b64c81632a7b468747e18e5c8f0846a1caf1991538b1d96f1b",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-4512709-milacron-robot-toolchanger/source-sheet-2-v1.png": {
        sha256: "3c74c40253075ab664d16989e99e6897651f9567e328e0657f243da0886f4d84",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-4512709-milacron-robot-toolchanger/source-sheet-3-v1.png": {
        sha256: "db28f711c7a5fb0e3f87d8f00b5d7bf05c236e2f8cd002c754d76c203ea7189f",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-4512709-milacron-robot-toolchanger/source-sheet-4-v1.png": {
        sha256: "84279d2d0ea08a6b5ccaccdc16037cfce23f3f0293dac0a34fe2eb0d49f0c7ff",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-4512709-milacron-robot-toolchanger/source-sheet-5-v1.png": {
        sha256: "9df5f88065595eb69a1adfdd34d98633683b4cd8f0c34395929bc572d817d10b",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-4512709-milacron-robot-toolchanger/source-sheet-6-v1.png": {
        sha256: "52602994eb1170e6f1a3e9b6248f45e76446eb08cfbef617ffc00c212ac8ed25",
        width: 2320,
        height: 3408,
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
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-04",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 17,
    assets: {
      "/patents/figures/us-470918-reno-escalator/source-sheet-1-v1.png": {
        sha256: "e4c403f7b5488eea9b9caa05b60f97e7e7de333cd7716e87e2561baced4b929b",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-470918-reno-escalator/source-sheet-2-v1.png": {
        sha256: "44d861a61cb0ee2fe65807af565940742a5f52effb04302eb64d47f0808e8856",
        width: 2320,
        height: 3408,
      },
    },
  },
  "us-4765668-robot-end-effector": {
    sourcePdfSha256: "654ed8b094309e39412debba71117f177602c1557ade8d9865f834a1d9e84485",
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-04",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 29,
    assets: {
      "/patents/figures/us-4765668-robot-end-effector/source-sheet-2-v1.png": {
        sha256: "97d5e3135b2ba39901081101df83d4f701bd5d1401b340996bf5299d6760218a",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-4765668-robot-end-effector/source-sheet-3-v1.png": {
        sha256: "8838902268f95a837299bdff0f16ce4d5a6b1da30b576b73700f8d3cde870230",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-4765668-robot-end-effector/source-sheet-4-v1.png": {
        sha256: "3c5a58a945a8e31917ebedde6523f2625c9646f14d2cf288d281796a8f58c09e",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-4765668-robot-end-effector/source-sheet-5-v1.png": {
        sha256: "871a70092eccb6e8b516b55791d27ddccdb5b8961d4468d14d4cad07dd3564a0",
        width: 2320,
        height: 3408,
      },
    },
  },
  "us-4921293-salisbury-robot-hand": {
    sourcePdfSha256: "a630e3a6c5e3bee141740ed3de4d315ea4ded7f525d5db8f8c4f9605af52fbed",
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-sheet review",
    reviewedAt: "2026-09-04",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 55,
    assets: {
      "/patents/figures/us-4921293-salisbury-robot-hand/source-sheet-1-v1.png": {
        sha256: "6fe1f2948840079efaffe82cacfdb3c072b5d2a929e395d42f6ff6f3cf637910",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-4921293-salisbury-robot-hand/source-sheet-2-v1.png": {
        sha256: "2601b2411cac6127ceb9584547b5846401834947199e1cca32f181024dbf7651",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-4921293-salisbury-robot-hand/source-sheet-3-v1.png": {
        sha256: "e053506ddd3362d8cb30c0bd1aff62e244a0cb83c7a06b198bc866b899875eb4",
        width: 2320,
        height: 3408,
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
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-sheet review",
    reviewedAt: "2026-09-04",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 23,
    assets: {
      "/patents/figures/us-5121329-crump-fdm/source-sheet-1-v1.png": {
        sha256: "669668da6b3ce2ee72bea8e6ee3c3d8701510fa005ae86e1f4eadea40cf107bd",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-5121329-crump-fdm/source-sheet-2-v1.png": {
        sha256: "2950a766e08b6ac1de85970d6a4a7ba355d3c4f7ba287ac15e6d09f9f447f511",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-5121329-crump-fdm/source-sheet-3-v1.png": {
        sha256: "0095dfc6490d96fa2eabe5a0663b64f5d9129a6741631517921cdd6496b3b415",
        width: 2320,
        height: 3408,
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
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-sheet review",
    reviewedAt: "2026-09-04",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 25,
    assets: {
      "/patents/figures/us-586193-marconi-radio/source-sheet-1-v1.png": {
        sha256: "e8bf1c45d436fca22dd57391a6834858880c2f964c1224173b9210cea0ef45b1",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-586193-marconi-radio/source-sheet-2-v1.png": {
        sha256: "536e03cbb4511b9b8652c8ef5f542305459cc2960e9e2d30487fc584da7e99b4",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-586193-marconi-radio/source-sheet-3-v1.png": {
        sha256: "24809400a2db396694fc05e501f4a5f899f88ec7d5242e36cdcea6501613a553",
        width: 2320,
        height: 3408,
      },
    },
  },
  "us-621195-zeppelin-airship": {
    sourcePdfSha256: "179d9d9b857e4bda8c35a4d9e8ee29d1e2fea5aa90705b0ddbe7d8cc6bb8d429",
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-sheet review",
    reviewedAt: "2026-09-04",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 27,
    assets: {
      "/patents/figures/us-621195-zeppelin-airship/source-sheet-1-v1.png": {
        sha256: "9c04ee18093ac1b2c2244aac248d948acf5a0e13b0839bee8559a81aa26fc0c9",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-621195-zeppelin-airship/source-sheet-2-v1.png": {
        sha256: "68cba10e20aec4a1b32bf7a3b98fd5ab87201bd6eb5fe6eef5f9e4d6326e4a6a",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-621195-zeppelin-airship/source-sheet-3-v1.png": {
        sha256: "7ccc45d75934d6b11ec1ebcd762e9f0cf21a4b22d3c505b02f0cc864dfc1073d",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-621195-zeppelin-airship/source-sheet-4-v1.png": {
        sha256: "f5f76c7119df39598e5c7296a986d8c295dc2b79b1b790a05895a8c6d216c1fa",
        width: 2320,
        height: 3408,
      },
    },
  },
  "us-588-ericsson-propeller": {
    sourcePdfSha256: "40582250d44f6558cf9a438801e312a469ccb83b6755ebc813943fba54c3ea9a",
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-04",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 21,
    assets: {
      "/patents/figures/us-588-ericsson-propeller/source-sheet-1-v1.png": {
        sha256: "1ca319ff08021d4edefd66eaf07e71a9bf7f945e27f89ee6b508c979d8c91437",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-588-ericsson-propeller/source-sheet-2-v1.png": {
        sha256: "2d16789f1d9dde794ce5f845d6bbfd94d7ed65ea75c1f81b63ed1fb75ad168f6",
        width: 2320,
        height: 3408,
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
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-04",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 50,
    assets: {
      "/patents/figures/us-79265-sholes-typewriter/source-sheet-1-v1.png": {
        sha256: "526827fee7019c7b1c0401d29a2ba655f4ec134b704f329e0d72f28c6f1cc2b8",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-79265-sholes-typewriter/source-sheet-2-v1.png": {
        sha256: "8149998e7a6cfdf935a22ae7be61e0f4e00a35e3823f56654eed92fab774cb60",
        width: 2320,
        height: 3408,
      },
    },
  },
  "us-682690-hewitt-mercury-lamp": {
    sourcePdfSha256: "bd849330e1ed6e530d0654413016c7e77eda792d0519628ca1bae5747065c74d",
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-04",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 3,
    assets: {
      "/patents/figures/us-682690-hewitt-mercury-lamp/sheet-01.png": {
        sha256: "5d54d50eee4fccb26abf2dd91ff91845d2313f823f570ec73c53824f00c14087",
        width: 1160,
        height: 1704,
      },
      "/patents/figures/us-682690-hewitt-mercury-lamp/sheet-02.png": {
        sha256: "576ae1326f6d3b075a0157b04fb3c5c51b37564f695249d26f7a98dd65d39aab",
        width: 1160,
        height: 1704,
      },
    },
  },
  "us-808897-carrier-air-conditioner": {
    sourcePdfSha256: "b8cfbb69e27934862236ecabf03396e67d04a4b4011c98083f1205cd76f0291e",
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-04",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 8,
    assets: {
      "/patents/figures/us-808897-carrier-air-conditioner/source-sheet-1-v1.png": {
        sha256: "3fb82f452c19cdb79c2a204e5b13b3b73c1f2af5fc4f17905b3104deed79e58e",
        width: 2320,
        height: 3408,
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
  "us-1102653-goddard-rocket": {
    sourcePdfSha256: "8503f52914f4201850d7d6f067ac48886dda77c2cdb5e8fce831e13232f7c42b",
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-sheet review",
    reviewedAt: "2026-09-04",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 11,
    assets: {
      "/patents/figures/us-1102653-goddard-rocket/sheet-1-1.png": {
        sha256: "65f586e211296f66aacd648922ce102b0804d280de2d4a4e4f31237b3774c0ed",
        width: 2320,
        height: 3408,
      },
    },
  },
  "us-706737-fessenden-wireless": {
    sourcePdfSha256: "2098ec6d967d3ab7999da0fb96357328fa68bb8e7639c1863ac600547aff8887",
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-sheet review",
    reviewedAt: "2026-09-04",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 13,
    assets: {
      "/patents/figures/us-706737-fessenden-wireless/source-sheet-1-v1.png": {
        sha256: "80ac578d0928cde8a61c09923e343b1d4e1bba5a71e9e3314a33d7ba5f623ef6",
        width: 2320,
        height: 3408,
      },
    },
  },
  "us-613809-tesla-teleautomaton": {
    sourcePdfSha256: "b92da6bad46cca996f7ecc99a16a87bdd38d12b3e04a0fce11cc5f033aed849b",
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-sheet review",
    reviewedAt: "2026-09-04",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 30,
    assets: {
      "/patents/figures/us-613809-tesla-teleautomaton/source-sheet-1-v1.png": {
        sha256: "29889ce4d7f9b814aab48def45dccf3eebaaa7ae7863c1dc724f8c1ef199af0e",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-613809-tesla-teleautomaton/source-sheet-2-v1.png": {
        sha256: "85db77322a3890247d19f2893edf0e0f2b2d45def4f44e272b550c5e668e5af5",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-613809-tesla-teleautomaton/source-sheet-3-v1.png": {
        sha256: "60713b7124217c8a116cab5baa816381410f5d4061c30e8b5ee3dd65e82b2871",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-613809-tesla-teleautomaton/source-sheet-4-v1.png": {
        sha256: "b035aec55dad08bf8e9a1d63e7bc2aff649b23d08d8a2c196853a83f51423f43",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-613809-tesla-teleautomaton/source-sheet-5-v1.png": {
        sha256: "a55e7bbc83d1925598b81b3d6b93a75c0a3739bcde65e8b19dea15bbc18ba0ac",
        width: 2320,
        height: 3408,
      },
    },
  },
  "us-6120588-eink": {
    sourcePdfSha256: "574678473ca13e7daaeb661cfd96808fffb6c16d06d86872923fec52a08ab324",
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct source-sheet review",
    reviewedAt: "2026-09-04",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 14,
    assets: {
      "/patents/figures/us-6120588-eink/sheet-1-source-crop-v1.png": {
        sha256: "2e5332772f84f91b239fbaaf7898337d737ec659a3eb50a70c4e455b92ec99cb",
        width: 928,
        height: 1364,
      },
      "/patents/figures/us-6120588-eink/sheet-3-source-crop-v1.png": {
        sha256: "085301619c50098b664697bf7e740f33e6da19920dbb20d07e155f058d6c6518",
        width: 928,
        height: 1364,
      },
      "/patents/figures/us-6120588-eink/sheet-4-source-crop-v1.png": {
        sha256: "41723afca1dba529f19be7ad2391e72980294a3398f67d00f9b2a69ed7eeadfc",
        width: 928,
        height: 1364,
      },
      "/patents/figures/us-6120588-eink/sheet-5-source-crop-v1.png": {
        sha256: "9a7d34fa931e5a993bc01c0d8777d5cfaf50e443d65987fbbfbf8e8210ba152b",
        width: 928,
        height: 1364,
      },
      "/patents/figures/us-6120588-eink/sheet-8-source-crop-v1.png": {
        sha256: "9fa262fbf685803acd4a4f5d1050d159692bc85bb9e3613f70b39b50fdc62896",
        width: 928,
        height: 1364,
      },
      "/patents/figures/us-6120588-eink/sheet-10-source-crop-v1.png": {
        sha256: "f76237f1efa1cf0f5f834905a3c83f5681c3b6001c66ace0fd3e28bca3dc4f18",
        width: 928,
        height: 1364,
      },
      "/patents/figures/us-6120588-eink/sheet-14-source-crop-v1.png": {
        sha256: "86e8b71e955a827165ed837989fa6a32f433b22ab6e0dfea6cb58152ae261475",
        width: 928,
        height: 1364,
      },
      "/patents/figures/us-6120588-eink/sheet-16-source-crop-v1.png": {
        sha256: "003467d5e174e4dae5de154c89d36101a9406c1e14d8f14eab88db02fdee4180",
        width: 928,
        height: 1364,
      },
    },
  },
  "us-347140-thomson-welding": {
    sourcePdfSha256: "80e7bbf735c52f3ace482277f39b130c0b6a62ee8eb9290389175939ba48356c",
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-sheet review",
    reviewedAt: "2026-09-04",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 40,
    assets: {
      "/patents/figures/us-347140-thomson-welding/source-sheet-1-v1.png": {
        sha256: "c36b2eecff6a1b842ad46224895372c1d90bea94145beea91e7e92b35c11da54",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-347140-thomson-welding/source-sheet-2-v1.png": {
        sha256: "698343a4d6d6fd2171b93338b7eddb6f5ac69524f97043c754c4c85d2f55d054",
        width: 2320,
        height: 3408,
      },
    },
  },
  "us-542846-diesel-engine": {
    sourcePdfSha256: "57679379a0e1d1dc97591e6f634fa6f7ed7c0ec3b465edf493b5f79595a0e866",
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-sheet review",
    reviewedAt: "2026-09-04",
    acceptanceBasis: "independent-figure-review",
    acceptedOccurrenceCount: 45,
    assets: {
      "/patents/figures/us-542846-diesel-engine/source-sheet-1-v1.png": {
        sha256: "d78768fa229c5b9ba6199ae71990ea30b3cc9a7187728710ec62edb051707ab9",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-542846-diesel-engine/source-sheet-2-v1.png": {
        sha256: "b87c928cc7fa19ca401d7ed067a75ed9838c66c5765a72f4e8fc820ca53673af",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-542846-diesel-engine/source-sheet-3-v1.png": {
        sha256: "e128509e51394b585169dd21bb1729bbf383ba21d20cae2021d4492d366e0c94",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-542846-diesel-engine/source-sheet-4-v1.png": {
        sha256: "89999dc69af185dcaed49a949fac4efeb1fe7e662b0b17240175e7de994435e4",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-542846-diesel-engine/source-sheet-5-v1.png": {
        sha256: "f47e09fed452ecdef387a3a096f92dafb7e31a4baa68cc66104b59a8f80c8431",
        width: 2320,
        height: 3408,
      },
    },
  },
} as const satisfies Readonly<Record<string, ArchivalFigureAcceptanceAttestation>>;
