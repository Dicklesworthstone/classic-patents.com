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
1. **Reviewed Archival Editions & Embedded PDFs**: Continuous hand-authored source faces and reviewed ledgers alongside pinned public-record facsimiles. Coverage is explicit: **52 of 103** catalogue records currently cross the typed reviewed-edition publication boundary. That editorial boundary does not hide already-present source text: the reader shows an authored edition when available, otherwise a complete local page-marked transcript; review notes remain separate from the readable patent text.
2. **Synchronous Dual-Projection Interface**: Readers toggle between original patent prose and plain-English engineering analysis. Claims link to plain-English breakdowns, and equations bind live telemetry to specification variables.
3. **Interactive 2D/3D Physics Visualizations**: Parameterized Three.js, SVG, and Canvas instruments let visitors manipulate real physical parameters. Runtime ownership is executable rather than aspirational: the catalogue has 3 patent-specific WASM surfaces (the Flyer, Goddard's source-bounded 1914 apparatus, and Daimler's source-bounded marine installation), 0 dedicated interpretive WASM surfaces, 37 generic FrankenSim WASM consumers, and 63 typed-host-only records. Roomba composes the generic `fs-mbd` planar differential-drive owner with its source-bounded optical redirect; Otto composes generic revolute and prismatic joints into one closed slider-crank, half-speed side shaft, valve, and governor topology. Both promote the shared 2D/3D tape only after an accepted WASM step. Salisbury's hand composes nine generic revolute coordinates and the three source-printed cable-torque equations behind a typed browser receipt while refusing undisclosed dynamics and contact behavior. Crump's FDM exhibit composes the generic `fs-flux` Newtonian circular-capillary screen with the generic `fs-conduction` fixed-boundary first-mode slab screen; it labels modern ABS and nozzle inputs as illustrative and refuses to infer shear-thinning, phase change, bond strength, heater power, or historic performance. Kamen's transporter composes generic `fs-mbd` three-wheel rigid kinematics with the nominal wheel, carrier, and stair dimensions printed in US 5,701,965; it checks every displayed tread contact and finite vertical-riser clearance while refusing undisclosed force, friction, impact, compliance, motor, sensor, and controller results. Da Vinci's public tool-interface exhibit stays on a typed source-bounded host because the grant supports compatibility, calibration-record, and engagement topology—not the dormant arm demo's generic-joint solve. Its processor and holder are physically seated, and its holder-to-tool bridge remains connected even when the engagement signal is unavailable. Spencer's food-treatment apparatus likewise stays on a typed source-bounded host: the shipped generic browser surface has no electromagnetic waveguide/magnetron solve, and its quarter-wave transmission-line relation is not a valid substitute, so only the printed path and the exact `c = λf` reference are admitted. Kwolek's public record is a source-bound claim-reading hold: its inherited polymer, tensile, and ballistic model is unavailable pending complete manual review. All 103 have a TypeScript default telemetry owner; a WASM label is admitted only after the relevant module loads and steps.
4. **Curated Historical Context**: Real patent-office disputes, prior art, commercialization history, and societal impacts.

---

## Curated Historical Patents (29 Highlighted — 103 in the Live Catalogue)

The live, searchable catalogue at [classic-patents.com](https://classic-patents.com) holds 103 records. All 103 have pinned facsimiles, explicit interactive-visual routes, default TypeScript telemetry owners, and live equation sets; 99 have reviewed ledgers. **52 of 103** currently cross the typed reviewed-edition publication boundary. That boundary tracks the stronger structured-edition contract, not permission to read the patent: an authored edition is rendered when it exists, and an available complete page-marked transcript is rendered as text otherwise. Candidate, held, rejected, facsimile-only, and source-bounded classifications remain editorial or model-provenance facts, never an empty text face. This table highlights 29 foundational entries; search (⌘K) and the timeline cover the full registry.

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
| **[US 1,102,653](./src/data/patents/goddard-rocket.ts)** | Rocket Apparatus | Robert H. Goddard | Jul 7, 1914 | Nested solid-charge rockets, curved spin passages, launch bearings, and gyroscopically isolated camera support | 🚀 3D Connected Rocket Apparatus |
| **[US 1,781,541](./src/data/patents/einstein-refrigerator.ts)** | Refrigeration | Albert Einstein & Leo Szilard | Nov 11, 1930 | Zero-moving-parts hermetic Dalton partial pressure cooling | ❄️ 3D Absorption Refrigerator |
| **[US 1,773,980](./src/data/patents/farnsworth-tv.ts)** | Television System | Philo T. Farnsworth | Aug 26, 1930 | All-electronic image dissector & magnetic raster | 📺 3D Dissector Tube Raster |
| **[US 2,292,387](./src/data/patents/lamarr-frequency-hopping.ts)** | Secret Communication System | Hedy Lamarr & George Antheil | Aug 11, 1942 | 88-frequency piano-roll spread-spectrum carrier hopping | 🎹 3D 88-Channel RF Analyzer |
| **[US 2,495,429](./src/data/patents/spencer-microwave.ts)** | Method of Treating Foodstuffs | Percy L. Spencer | Jan 24, 1950 | Cavity magnetron dielectric microwave heating | 🍕 3D Microwave Magnetron |
| **[US 2,708,656](./src/data/patents/fermi-reactor.ts)** | Neutronic Reactor | Enrico Fermi & Leo Szilard | May 17, 1955 | Heterogeneous graphite lattice & cadmium criticality | ⚛️ 3D Criticality Pile Simulator |
| **[US 2,846,084](./src/data/patents/goertz-electronic-master-slave-manipulator.ts)** | Electronic Master Slave Manipulator | Raymond C. Goertz, William M. Thompson & Robert A. Olsen | Aug 5, 1958 | Seven-channel bilateral teleoperation, force reflection, tachometer feedback & signal limiting | 🦾 3D Master–Slave Servo Studio |
| **[US 2,524,035](./src/data/patents/bardeen-transistor-2524035.ts)** | Three-Electrode Circuit Element Utilizing Semiconductive Materials | John Bardeen & Walter Brattain | Oct 3, 1950 | Point-contact germanium semiconductor circuit element | 🔬 3D Solid-State Transistor |
| **[US 2,981,877](./src/data/patents/noyce-ic.ts)** | Semiconductor Device-and-Lead Structure | Robert N. Noyce | Apr 25, 1961 | Monolithic planar silicon IC with aluminum leads | 🔬 3D Planar Silicon Wafer |
| **[US 3,541,541](./src/data/patents/engelbart-mouse.ts)** | X-Y Position Indicator | Douglas C. Engelbart | Nov 17, 1970 | Orthogonal dual-wheel coordinate encoder mouse | 🖱️ 3D Dual-Wheel Table Mouse |
| **[US 3,671,542](./src/data/patents/kwolek-kevlar.ts)** | Optically Anisotropic Aromatic Polyamide Dopes | Stephanie Louise Kwolek | Jun 20, 1972 | Checked Claim 1 aromatic-polyamide dope composition | ⏸️ Source-integrity hold |
| **[US 3,858,232](./src/data/patents/boyle-smith-ccd.ts)** | Information Storage Devices | Willard S. Boyle & George E. Smith | Dec 31, 1974 | Three-conductor sequential transfer through a single-conductivity storage medium | 📷 3D Connected Figure 2 Shift Register |
| **[US 4,098,001](./src/data/patents/watson-remote-center-compliance.ts)** | Remote Center Compliance System | Paul C. Watson | Jul 4, 1978 | Decoupled focal flexures & passive anti-jamming compliance | 🦾 3D Focal RCC Wrist |
| **[US 4,136,359](./src/data/patents/wozniak-apple.ts)** | Microcomputer for Use with Video Display | Steve Wozniak | Jan 23, 1979 | Two-phase shared-bus time-multiplexed DRAM | 💻 3D Apple II Bus Multiplexer |
| **[US 4,341,502](./src/data/patents/makino-scara.ts)** | Assembly Robot | Hiroshi Makino | Jul 27, 1982 | Selective compliance 4-link parallel arm (SCARA) | 🦾 3D SCARA Robot Arm |
| **[US 4,765,668](./src/data/patents/robot-end-effector.ts)** | Robot End Effector | Alexander H. Slocum & Peter A. Jurgens | Aug 23, 1988 | Symmetric double hand, opposed-thread ball screws & interchangeable dovetail fingers | 🦾 3D Double-Handed End Effector |
| **[US 4,921,293](./src/data/patents/salisbury-robot-hand.ts)** | Multi-Fingered Robotic Hand | Carl F. Ruoff & J. Kenneth Salisbury, Jr. | May 1, 1990 | Three palm-rooted cable-driven digits & the Figure 3 four-tension / three-torque map | 🖐️ 3D Connected Transmission Studio |
| **[US 5,701,965](./src/data/patents/kamen-transporter.ts)** | Human Transporter | Dean L. Kamen et al. | Dec 30, 1997 | Source-dimensioned tri-wheel balance, transfer & stair-contact geometry | 🛴 3D Three-Wheel Transporter |
| **[US 6,302,230](./src/data/patents/kamen-segway.ts)** | Personal Mobility Vehicles (Segway HT) | Dean L. Kamen et al. | Oct 16, 2001 | Dynamic balancing, balancing margin supervisory monitor & 18 Hz tactile ripple alarm | 🛴 3D Segway Transporter Studio |

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
│                   TYPED PHYSICS & TELEMETRY OWNER BUS                  │
│  • 103/103 typed-host default owners with explicit live equations      │
│  • 3 patent-specific + 0 interpretive + 37 generic WASM surfaces       │
│  • 53 ticking bus updaters + 50 typed snapshot publishers              │
│  • TS fallback and cold-start placeholder provenance remain explicit   │
│  • Typed WASM refusal where exposed; host validation everywhere else   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Computational Physics and Telemetry Owners

Every catalogue id has a typed `PATENT_PHYSICS_REGISTRY` entry and non-empty default telemetry. Where a historical source does not supply a dimensional law or operating constants, its controls and telemetry are explicitly normalized or source-bounded rather than falsely represented as SI facts. Aerodynamics, electromagnetics, solid-state electronics, thermodynamics, reactor kinetics, polymers, and mechanisms all use this same presentation contract. Salisbury's three palm-rooted digit chains now step a hash-pinned `fs-salisbury-wasm` boundary that composes the generic `fs-mbd` revolute-joint owner with the printed Figure 3 four-tension / three-torque law; its typed receipt explicitly withholds historic dynamics and grasp-contact claims. The generated [`coverageManifest`](./src/physics/coverageManifest.ts) binds each of the 103 ids to its facsimile, ledger and edition state, visual route, default owner, optional WASM surface, shared-bus participation, and admitted provenance.

The synchronous default owner is TypeScript for all 103 records. After browser initialization, the Flyer, Goddard's US 1,102,653 apparatus, and Daimler's US 361,931 marine installation can use patent-specific **FrankenSim** WebAssembly packages, while 37 visuals consume generic FrankenSim owners; every such path retains an admitted TypeScript fallback. Goddard's active export composes `fs-mbd` rigid-body integration for the patent's primary spin, auxiliary-stage release sequence, Claim 2 tube ratio, and gyroscopically isolated camera support. It publishes no invented thrust, Mach number, liquid-propellant state, or trajectory. Daimler's export composes the generic `fs-mbd` prismatic-joint owner for the source's one-axis propeller-shaft motion, mutually exclusive ahead/neutral/astern contact topology, and passive-plus-optional-pump cooling paths. The public da Vinci tool-interface visual is a source-bounded TypeScript topology: it keeps the processor/data/holder/tool path physically connected and refuses arm, contact, force, speed, and clinical telemetry that US 6,331,181 does not supply. The shipped `fs-davinci-wasm` generic-joint artifact belongs to the dormant arm demonstration and is not credited to the public route. Makino's US 4,341,502 visual does not pretend the un-dimensioned four-link grant can step a physical arm: it shares a normalized topology/angle exhibit and refuses SI force, stiffness, payload, and controller telemetry. Howe's source-order lockstitch visual composes one prescribed `fs-mbd` shaft drive into revolute needle-arm and picker joints plus prismatic shuttle, lifting-rod, and baster-feed joints; only the printed one-eighth-inch needle-eye offset and three-quarter-inch baster-point pitch are dimensional, while an explicit normalized loop-clearance boundary can refuse Claim 1 capture. Otis's full 1861 apparatus composes twelve generic `fs-mbd` scalar joints for platform D, safety bar F, levers E, pawls f, drums H/N, shaft I, shipper S, brake Z, and counterpoise R; the browser kernel owns only the printed switching topology and normalized display coordinates because US 31,128 supplies no load, force, timing, travel, or power data. Otto's narrow browser boundary composes eight generic `fs-mbd` joint coordinates behind one crank drive, closes the display-scale slider-crank exactly, and derives the 2:1 side shaft, slide valve, exhaust lift, and normalized governor pose from the same coordinate; the grant supplies no build dimensions, masses, inertia, or operating speed, so those remain declared presentation inputs rather than historical claims. Edison's browser seam composes the generic `fs-conduction` Stefan-Boltzmann owner with explicit voltage and hot resistance, the source's seven-thousandths-inch filament diameter, a declared 22 cm thermal-area length, declared emissivity, and ambient temperature; it does not infer lifetime, efficacy, or hidden material properties. Tesla's narrow browser boundary composes the dependency-free `fs-flux` quarter-wave feature from the frequency, propagation speed, and developed conductor length printed in US 593,138. It reports wavelength, electrical length, and normalized standing-wave position only; absolute voltage, current, loss, air breakdown, and discharge reach remain explicitly unknown. Crump's narrow browser boundary composes `fs-flux::capillary` and `fs-conduction::reduced_slab` for a declared modern ABS screening scenario, while the UI separately preserves Claim 1's broad apparatus, Claim 2's heating means, and Claim 39's planar nozzle-bottom relation. These compositions publish no invented travel, speed, friction, flow, thrust, power, or clinical metric. The Goddard package retains a separately named liquid-nozzle export for the later 1926 liquid-rocket record, but the 1914 model never calls it. All twelve active dedicated boundaries expose typed WASM refusals; the host still validates every accepted result before using it. Tests instantiate and step all fourteen shipped packages—including the dormant da Vinci artifact—exercise the active dedicated refusal boundaries and malformed-output rejection, pin the binary digests, and make `bun run pipeline:verify` fail on coverage drift.

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

For per-patent and full-catalogue production-browser acceptance, including the
exact 320 px route, structured JSONL diagnostics, and retained failure traces,
see [Patent vertical-slice browser acceptance](./docs/PATENT_E2E_HARNESS.md).

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
