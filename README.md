# Classic Patents

<div align="center">

[![License: MIT + Rider](https://img.shields.io/badge/License-MIT_+_OpenAI/Anthropic_Rider-blue.svg)](./LICENSE)
[![Framework: Next.js 15](https://img.shields.io/badge/Framework-Next.js_15-black.svg)](https://nextjs.org/)
[![3D Engine: Three.js](https://img.shields.io/badge/3D_Physics-Three.js_WebGL-000000.svg)](https://threejs.org/)
[![Deployment: Vercel](https://img.shields.io/badge/Deployment-Vercel-000000.svg)](https://vercel.com/)
[![Styling: Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38bdf8.svg)](https://tailwindcss.com/)
[![Type Checked: Strict TS](https://img.shields.io/badge/TypeScript-5.7_Strict-3178c6.svg)](https://www.typescriptlang.org/)
[![Code Quality: Biome](https://img.shields.io/badge/Linter-Biome_2.5-60a5fa.svg)](https://biomejs.dev/)

**An open-source digital museum and technical analysis platform restoring history's most consequential patents into verified transcripts, full original PDFs, rigorous "Plain English" engineering breakdowns, and interactive real-time 3D physical simulations.**

[**Explore the Live Museum**](https://classic-patents.vercel.app) · [**Interactive Timeline**](https://classic-patents.vercel.app/timeline) · [**Comprehensive Plan**](./COMPREHENSIVE_PLAN_FOR_CLASSIC_PATENTS.md) · [**Agent Guidelines**](./AGENTS.md)

</div>

---

## TL;DR

**The Problem:** Original patents represent the greatest technical breakthroughs in human history—from the Wright Brothers' 3-axis flight control to Tesla's polyphase AC motor and Robert Noyce's monolithic silicon chip. However, in their historical state, they are trapped in low-resolution microfilm scans, archaic legal jargon ("*Be it known that we...*"), and static 2D lithographs that cannot convey dynamic physical mechanisms.

**The Solution:** **Classic Patents** restores these masterpieces:
1. **Verified Archival Transcripts & Embedded PDFs**: High-fidelity digitized text alongside complete, high-resolution original USPTO facsimile documents.
2. **Dual-Projection (Diptych Engine)**: Side-by-side synchronized views of the verbatim legal specification and a lucid, mathematically rigorous **"Plain English" engineering breakdown**.
3. **Interactive 3D WebGL & Physics Visualizations**: Parameterized 3D Three.js modules allowing visitors to manipulate real physical parameters (e.g. twisting the Wright Flyer's wings to observe adverse yaw and vortex shedding, adjusting AC frequencies to witness Tesla's rotating magnetic stator field, or testing spread-spectrum frequency hopping against electronic jamming).
4. **Historical & Legal Deconstructions**: Line-by-line claim decoders, patent litigation histories (Wright vs. Curtiss, Bell vs. Gray, Farnsworth vs. RCA, Goodyear vs. Day), and civilizational impact analyses.

---

## Curated Historical Patents

| Patent | Title | Inventors | Grant Date | Key Breakthrough | Interactive Sim |
|---|---|---|---|---|---|
| **[US 1,647](./src/data/patents/morse-telegraph.ts)** | Electro-Magnetic Telegraph | Samuel F. B. Morse | Jun 20, 1840 | Regenerative relay amplifiers & variable-length binary prefix code | 📻 Morse Stream & Sounder |
| **[US 3,633](./src/data/patents/goodyear-rubber.ts)** | India-Rubber Fabrics (Vulcanization) | Charles Goodyear | Jun 15, 1844 | Disulfide polymer cross-linking under heat creating elastic rubber | 🧪 Polymer Matrix Simulator |
| **[US 174,465](./src/data/patents/bell-telephone.ts)** | Improvement in Telegraphy (Telephone) | Alexander Graham Bell | Mar 7, 1876 | Variable resistance undulating current acoustic speech transmission | 📞 Live Web Audio Transducer |
| **[US 223,898](./src/data/patents/edison-lightbulb.ts)** | Electric-Lamp | Thomas A. Edison | Jan 27, 1880 | High-resistance carbon filament in high vacuum ($100\ \Omega$) | 💡 Thermal Vacuum Circuit |
| **[US 381,968](./src/data/patents/tesla-motor.ts)** | Electro-Magnetic Motor | Nikola Tesla | May 1, 1888 | Brushless polyphase AC rotating magnetic stator field motor | ⚡ 3D WebGL Magnetic Motor |
| **[US 586,193](./src/data/patents/marconi-radio.ts)** | Transmitting Electrical Signals | Guglielmo Marconi | Jul 13, 1897 | Elevated vertical aerial monopole & earth-grounded spark transmitter | 📡 Spark-Gap RF Wavefield |
| **[US 821,393](./src/data/patents/wright-flyer.ts)** | Flying-Machine | Orville & Wilbur Wright | May 22, 1906 | 3-axis aerodynamic flight control via wing-warping & rudder coupling | 🛩️ 3D WebGL 6-DoF Flight Sim |
| **[US 1,773,980](./src/data/patents/farnsworth-tv.ts)** | Television System | Philo T. Farnsworth | Aug 26, 1930 | All-electronic image dissector & magnetic electron beam raster | 📺 3D WebGL Dissector Tube |
| **[US 2,292,387](./src/data/patents/lamarr-frequency-hopping.ts)** | Secret Communication System | Hedy Lamarr & George Antheil | Aug 11, 1942 | 88-frequency piano-roll spread-spectrum anti-jamming carrier hopping | 🎹 88-Channel RF Analyzer |
| **[US 2,495,429](./src/data/patents/spencer-microwave.ts)** | Method of Treating Foodstuffs | Percy L. Spencer | Jan 24, 1950 | Cavity magnetron dielectric microwave electromagnetic heating | 🍕 Microwave Cavity & Pops |
| **[US 2,981,877](./src/data/patents/noyce-ic.ts)** | Semiconductor Device-and-Lead Structure | Robert N. Noyce | Apr 25, 1961 | Monolithic planar silicon IC with vapor-deposited aluminum leads | 🔬 Layer Lithography Stepper |
| **[US 3,671,542](./src/data/patents/kwolek-kevlar.ts)** | Wholly Aromatic Polycarbonamide Filaments | Stephanie L. Kwolek | Jun 20, 1972 | Liquid-crystalline aramid polymer chain alignment (Kevlar) | 🛡️ Tensile Stress & Chain Sim |

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
│  │   • Verbatim OCR Transcript     │  • Deep Engineering Analysis   │  │
│  │   • Full Embedded USPTO PDF     │  • Line-by-Line Claim Decoders │  │
│  │   • Numbered Interactive Pins   │  • Historical Patent Wars      │  │
│  └─────────────────────────────────┴────────────────────────────────┘  │
├────────────────────────────────────────────────────────────────────────┤
│             3D WEBGL & REAL-TIME PHYSICS SIMULATION RUNTIMES           │
│  • 3D Wright Flyer 6-DoF Aerodynamics & Wingtip Vortex Shedding        │
│  • 3D Tesla Induction Motor Rotating Stator Electromagnetic Flux Lines │
│  • 3D Farnsworth All-Electronic Television Image Dissector Tube        │
│  • Web Audio Procedural Acoustic & Harmonic Resonance Synthesizers     │
│  • Lamarr 88-Channel Spread Spectrum Frequency Hopping Spectrum Engine │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Getting Started Locally

### Prerequisites
- [Bun](https://bun.sh) (v1.2+) or Node.js (v20+)
- [Vercel CLI](https://vercel.com/cli) (optional, for deployment)

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

### Quality & Verification Suite

```bash
# Run TypeScript strict type-checking
bun run typecheck

# Run Biome linter and formatter
bun run lint
bun run format

# Run data pipeline verification gate across all 12 patents and PDFs
bun run pipeline:verify

# Test production build
bun run build
```

---

## Vercel Deployment

```bash
# 1. Pull project configuration & environment
vercel pull --yes

# 2. Build locally (prevents burning cloud build credits)
vercel build --prod

# 3. Deploy prebuilt artifact to production
vercel deploy --prebuilt --prod
```

---

## About Outside Contributions

Please don't take this the wrong way, but I do not accept outside contributions for any of my projects. I simply don't have the mental bandwidth to review anything, and it's my name on the thing, so I'm responsible for any problems it causes; thus, the risk-reward is highly asymmetric from my perspective. I'd also have to worry about other "stakeholders," which seems unwise for tools I mostly make for myself for free. Feel free to submit issues, and even PRs if you want to illustrate a proposed fix, but know I won't merge them directly. Instead, I'll have Claude or Codex review submissions via `gh` and independently decide whether and how to address them. Bug reports in particular are welcome. Sorry if this offends, but I want to avoid wasted time and hurt feelings. I understand this isn't in sync with the prevailing open-source ethos that seeks community contributions, but it's the only way I can move at this velocity and keep my sanity.

---

## License

The Classic Patents source code is licensed under the **MIT License with an OpenAI/Anthropic Rider**, Copyright (c) 2026 Jeffrey Emanuel (see [`LICENSE`](./LICENSE)).

Historical patent texts and drawings are in the public domain.
