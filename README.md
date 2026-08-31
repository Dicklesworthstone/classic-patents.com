# Classic Patents

<div align="center">

[![License: MIT + Rider](https://img.shields.io/badge/License-MIT_+_OpenAI/Anthropic_Rider-blue.svg)](./LICENSE)
[![Framework: Next.js 15](https://img.shields.io/badge/Framework-Next.js_15-black.svg)](https://nextjs.org/)
[![3D Engine: Three.js](https://img.shields.io/badge/3D_Physics-Three.js_WebGL-000000.svg)](https://threejs.org/)
[![Deployment: Vercel](https://img.shields.io/badge/Deployment-Vercel-000000.svg)](https://vercel.com/)
[![Styling: Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38bdf8.svg)](https://tailwindcss.com/)
[![Type Checked: Strict TS](https://img.shields.io/badge/TypeScript-5.7_Strict-3178c6.svg)](https://www.typescriptlang.org/)
[![Code Quality: Biome](https://img.shields.io/badge/Linter-Biome_2.5-60a5fa.svg)](https://biomejs.dev/)

**An open-source digital museum and technical analysis platform restoring history's most consequential patents into pinned facsimiles, reviewed archival editions, rigorous "Plain English" engineering breakdowns, and interactive physical simulations.**

[**Explore the Live Museum**](https://classic-patents.com) · [**Interactive Timeline**](https://classic-patents.com/timeline) · [**Comprehensive Plan**](./COMPREHENSIVE_PLAN_FOR_CLASSIC_PATENTS.md) · [**Agent Guidelines**](./AGENTS.md)

</div>

---

## TL;DR

**The Problem:** Original patents represent the greatest technical breakthroughs in human history—from the Wright Brothers' 3-axis flight control to Tesla's progressive two-circuit alternating-current motor-generator and Robert Noyce's monolithic silicon chip. However, in their historical state, they are trapped in low-resolution microfilm scans, archaic legal jargon ("*Be it known that we...*"), and static 2D lithographs that cannot convey dynamic physical mechanisms.

**The Solution:** **Classic Patents** restores these masterpieces:
1. **Reviewed Archival Editions & Embedded PDFs**: Continuous hand-authored source faces and reviewed ledgers alongside pinned public-record facsimiles. Coverage is explicit: 69 of 79 catalogue records currently publish the reviewed edition contract; ten stored or missing editions remain fail-closed pending full-facsimile acceptance.
2. **Dual-Projection (Diptych Engine)**: Side-by-side synchronized views of the verbatim legal specification and a lucid, mathematically rigorous **"Plain English" engineering breakdown**.
3. **Interactive 2D/3D Physics Visualizations**: Parameterized Three.js, SVG, and Canvas instruments let visitors manipulate real physical parameters. The shared telemetry bus uses a compiled FrankenSim WASM owner only when that module genuinely loads and steps; otherwise the UI identifies its typed host owner rather than presenting a WASM badge.
4. **Historical & Legal Deconstructions**: Line-by-line claim decoders, patent litigation histories (Wright vs. Curtiss, Bell vs. Gray, Farnsworth vs. RCA, Goodyear vs. Day, SRI vs. Xerox/Apple), and civilizational impact analyses.

---

## Curated Historical Patents (22 Featured — 79 in the Live Catalogue)

The live, searchable catalogue at [classic-patents.com](https://classic-patents.com) holds 79 records. All 79 have pinned facsimiles, explicit interactive-visual routes, default-stepping SI telemetry owners, and live equation sets. **69 of 79** currently cross the reviewed-edition publication boundary. Nine more records store editions whose own `completeFacsimileReviewed` attestation is false; Linotype has no bound edition. `us-313224-mergenthaler-linotype` remains on its pinned facsimile, source-PDF text layer, 70 staged claim nodes, and source-bounded editorial face after its ledger/draft failed independent acceptance against the pinned 17-sheet facsimile. This table highlights 22 foundational entries; search (⌘K) and the timeline cover the full registry.

| Patent | Title | Inventors | Grant Date | Key Breakthrough | Interactive 3D Sim |
|---|---|---|---|---|---|
| **[US 1,647](./src/data/patents/morse-telegraph.ts)** | Electro-Magnetic Telegraph | Samuel F. B. Morse | Jun 20, 1840 | Regenerative relay amplifiers & binary code | 📻 3D Telegraph Sounder |
| **[US 3,633](./src/data/patents/goodyear-rubber.ts)** | India-Rubber Fabrics (Vulcanization) | Charles Goodyear | Jun 15, 1844 | Disulfide polymer cross-linking under heat | 🧪 3D Polymer Matrix Sim |
| **[US 4,750](./src/data/patents/howe-sewing-machine.ts)** | Sewing Machine | Elias Howe Jr. | Sep 10, 1846 | Eye-pointed needle & reciprocating shuttle lockstitch | 🧵 3D Lockstitch Machine |
| **[US 6,469](./src/data/patents/lincoln-buoy.ts)** | Buoying Vessels Over Shoals | Abraham Lincoln | May 22, 1849 | Synchronized expandable buoyant air chambers | ⛵ 3D River Shoal Lift Sim |
| **[US 174,465](./src/data/patents/bell-telephone.ts)** | Improvement in Telegraphy (Telephone) | Alexander Graham Bell | Mar 7, 1876 | Variable resistance undulating acoustic speech transmission | 📞 3D Acoustic Transducer |
| **[US 223,898](./src/data/patents/edison-lightbulb.ts)** | Electric-Lamp | Thomas A. Edison | Jan 27, 1880 | High-resistance carbon filament in high vacuum | 💡 3D Thermal Vacuum Bulb |
| **[US 381,968](./src/data/patents/tesla-motor.ts)** | Electro-Magnetic Motor | Nikola Tesla | May 1, 1888 | Progressive magnetic pole shift from independent alternating-current circuits | ⚡ 3D Fig. 9 Motor-Generator |
| **[US 586,193](./src/data/patents/marconi-radio.ts)** | Transmitting Electrical Signals | Guglielmo Marconi | Jul 13, 1897 | Elevated monopole aerial & earth-grounded spark system | 📡 3D RF Spark Transmitter |
| **[US 593,138](./src/data/patents/tesla-coil-593138.ts)** | Electrical Transformer | Nikola Tesla | Nov 2, 1897 | Graded spiral windings for high-potential transformation and transmission | ⚡ 3D High-Potential Transformer |
| **[US 821,393](./src/data/patents/wright-flyer.ts)** | Flying-Machine | Orville & Wilbur Wright | May 22, 1906 | 3-axis aerodynamic flight control via wing warping | 🛩️ 3D 6-DoF Flight Sim |
| **[US 1,155,986](./src/data/patents/goddard-rocket.ts)** | Rocket Apparatus | Robert H. Goddard | Oct 5, 1915 | Bipropellant combustion chamber & de Laval nozzle | 🚀 3D Supersonic Rocket Nozzle |
| **[US 1,781,541](./src/data/patents/einstein-refrigerator.ts)** | Refrigeration | Albert Einstein & Leo Szilard | Nov 11, 1930 | Zero-moving-parts hermetic Dalton partial pressure cooling | ❄️ 3D Absorption Refrigerator |
| **[US 1,773,980](./src/data/patents/farnsworth-tv.ts)** | Television System | Philo T. Farnsworth | Aug 26, 1930 | All-electronic image dissector & magnetic raster | 📺 3D Dissector Tube Raster |
| **[US 2,292,387](./src/data/patents/lamarr-frequency-hopping.ts)** | Secret Communication System | Hedy Lamarr & George Antheil | Aug 11, 1942 | 88-frequency piano-roll spread-spectrum carrier hopping | 🎹 3D 88-Channel RF Analyzer |
| **[US 2,495,429](./src/data/patents/spencer-microwave.ts)** | Method of Treating Foodstuffs | Percy L. Spencer | Jan 24, 1950 | Cavity magnetron dielectric microwave heating | 🍕 3D Microwave Magnetron |
| **[US 2,708,656](./src/data/patents/fermi-reactor.ts)** | Neutronic Reactor | Enrico Fermi & Leo Szilard | May 17, 1955 | Heterogeneous graphite lattice & cadmium criticality | ⚛️ 3D Criticality Pile Simulator |
| **[US 2,524,035](./src/data/patents/bardeen-transistor-2524035.ts)** | Three-Electrode Circuit Element Utilizing Semiconductive Materials | John Bardeen & Walter Brattain | Oct 3, 1950 | Point-contact germanium semiconductor circuit element | 🔬 3D Solid-State Transistor |
| **[US 2,981,877](./src/data/patents/noyce-ic.ts)** | Semiconductor Device-and-Lead Structure | Robert N. Noyce | Apr 25, 1961 | Monolithic planar silicon IC with aluminum leads | 🔬 3D Planar Silicon Wafer |
| **[US 3,541,541](./src/data/patents/engelbart-mouse.ts)** | X-Y Position Indicator | Douglas C. Engelbart | Nov 17, 1970 | Orthogonal dual-wheel coordinate encoder mouse | 🖱️ 3D Dual-Wheel Table Mouse |
| **[US 3,671,542](./src/data/patents/kwolek-kevlar.ts)** | Wholly Aromatic Polycarbonamide Filaments | Stephanie L. Kwolek | Jun 20, 1972 | Liquid-crystalline aramid polymer chain alignment (Kevlar) | 🛡️ 3D Polymer Tensile Lattice |
| **[US 3,923,554](./src/data/patents/boyle-smith-ccd.ts)** | 3-Phase Charge-Coupled Device | Willard Boyle & George Smith | Dec 2, 1975 | 3-phase MOS potential well charge packets | 📷 3D Digital Pixel CCD Well |
| **[US 4,136,359](./src/data/patents/wozniak-apple.ts)** | Microcomputer for Use with Video Display | Steve Wozniak | Jan 23, 1979 | Two-phase shared-bus time-multiplexed DRAM | 💻 3D Apple II Bus Multiplexer |

---

## Architectural Highlights

```
┌────────────────────────────────────────────────────────────────────────┐
│                        classic-patents.com                             │
│                    Next.js 15 App Router (Vercel)                      │
├────────────────────────────────────────────────────────────────────────┤
│  [Museum Catalog & Search]   │  [Chronological Milestone Timeline]     │
├──────────────────────────────┴─────────────────────────────────────────┤
│                     PATENT DUAL-PROJECTION ENGINE                       │
│  ┌─────────────────────────────────┬────────────────────────────────┐  │
│  │   Face 1: Archival Facsimile    │  Face 2: Plain English         │  │
│  │   • Reviewed Archival Edition   │  • Deep Engineering Analysis   │  │
│  │   • Pinned Public Facsimile     │  • Line-by-Line Claim Decoders │  │
│  │   • Numbered Interactive Pins   │  • Historical Patent Wars      │  │
│  └─────────────────────────────────┴────────────────────────────────┘  │
├────────────────────────────────────────────────────────────────────────┤
│             3D WEBGL & REAL-TIME PHYSICS SIMULATION RUNTIMES           │
│  • Procedural Azure Sky & Drifting Volumetric Cumulus Clouds           │
│  • 3D Wright Flyer 6-DoF Aerodynamics & Wingtip Vortex Shedding        │
│  • 3D Tesla Fig. 9 Generator-Coupled Progressive Pole Shift           │
│  • 3D Fermi Nuclear Reactor Criticality Cascade & Cadmium Rod Damping  │
│  • 3D Wozniak Apple II Interleaved Memory Bus & NTSC Color Burst       │
│  • Dynamic On-Demand Code Splitting (198 kB Initial JS Payload)        │
├────────────────────────────────────────────────────────────────────────┤
│                TYPED SI PHYSICS & TELEMETRY OWNER BUS                  │
│  • 79/79 default-stepping registry owners with explicit equations      │
│  • Compiled FrankenSim WASM where a module is actually loaded/stepped  │
│  • Typed host kernels elsewhere, identified without a WASM claim       │
│  • Shared controls/telemetry across 2D, 3D, schematic, and source face │
│  • Blake3 state digests and refusal boundaries on WASM-owned paths     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Computational Physics and Telemetry Owners

Every catalogue id has a typed `PATENT_PHYSICS_REGISTRY` entry that accepts SI controls and produces non-empty default telemetry. Aerodynamics, electromagnetics, solid-state electronics, thermodynamics, reactor kinetics, polymers, and mechanisms all use this same presentation contract.

The implementation owner is disclosed at runtime. A visual may use a compiled **FrankenSim** WebAssembly step with Blake3 state digests and typed refusal boundaries, or an explicitly identified TypeScript kernel while its generic FrankenSim composition is still being bound. Tests and `bun run pipeline:verify` exercise every catalogue id's default owner and ensure every id has its own visual-dispatch case and live equation set; file presence alone is not treated as proof of physical integration.

See the complete roadmap in [`docs/FRANKENSIM_WASM_INTEGRATION_TODO.md`](./docs/FRANKENSIM_WASM_INTEGRATION_TODO.md).

---

## Getting Started Locally

### Prerequisites
- [Bun](https://bun.sh) (v1.2+) or Node.js (v20+)
- [Vercel CLI](https://vercel.com/cli) (optional, for prebuilt deployment)

### Installation & Development

```bash
# Clone the repository
git clone https://github.com/Dicklesworthstone/classic-patents.com.git
cd classic-patents.com

# Install dependencies
bun install

# Start local development server with Turbopack
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Verification & Deployment

```bash
# Verified production release. This serializes shared builds, runs the quality
# gates, validates a full prebuilt artifact and critical live routes, then
# promotes classic-patents.com, www.classic-patents.com, and the stable Vercel
# platform alias.
bun scripts/verified-production-deploy.ts
```

Do not invoke `vercel deploy --prebuilt --prod` directly. The verified release
entry point uses `--skip-domain` until the deployed Wright page and its complete
source-text endpoint have passed checks, so a stale or partial `.vercel/output`
directory cannot replace the public site.

---

## License

This project is licensed under the MIT License with OpenAI/Anthropic Commercial Use Rider — see the [LICENSE](./LICENSE) file for details.
