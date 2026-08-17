# Classic Patents

<div align="center">

[![License: MIT + Rider](https://img.shields.io/badge/License-MIT_+_OpenAI/Anthropic_Rider-blue.svg)](./LICENSE)
[![Framework: Next.js 15](https://img.shields.io/badge/Framework-Next.js_15-black.svg)](https://nextjs.org/)
[![Deployment: Vercel](https://img.shields.io/badge/Deployment-Vercel-000000.svg)](https://vercel.com/)
[![Styling: Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38bdf8.svg)](https://tailwindcss.com/)
[![OCR Engine: focr](https://img.shields.io/badge/OCR-focr_0.6.0-orange.svg)](https://github.com/Dicklesworthstone/franken_ocr)
[![Type Checked: Strict TS](https://img.shields.io/badge/TypeScript-5.7_Strict-3178c6.svg)](https://www.typescriptlang.org/)
[![Code Quality: Biome](https://img.shields.io/badge/Linter-Biome_2.5-60a5fa.svg)](https://biomejs.dev/)

**An open-source digital museum and technical analysis platform restoring history's most consequential patents into pristine OCR transcripts, rigorous "Plain English" engineering breakdowns, and interactive real-time simulations.**

[**Explore the Live Museum**](https://classic-patents.com) · [**Comprehensive Plan**](./COMPREHENSIVE_PLAN_FOR_CLASSIC_PATENTS.md) · [**Agent Guidelines**](./AGENTS.md)

</div>

---

## TL;DR

**The Problem:** Original patents represent the greatest technical breakthroughs in human history—from the Wright Brothers' 3-axis flight control to Tesla's AC motor and Robert Noyce's monolithic silicon chip. However, in their historical state, they are trapped in low-resolution microfilm scans, archaic 19th-century legal jargon ("*Be it known that we...*"), and static 2D lithographs that cannot convey dynamic physical mechanisms.

**The Solution:** **Classic Patents** restores these masterpieces:
1. **Ultra-High-Fidelity OCR**: Digitized from high-res USPTO scans using the pure-Rust `focr` engine into clean, structured text.
2. **Dual-Projection (Diptych Engine)**: Side-by-side synchronized views of the verbatim legal specification and a lucid, mathematically rigorous **"Plain English" engineering breakdown**.
3. **Interactive Mechanical & Physical Simulations**: Bespoke interactive SVG/Canvas modules allowing users to manipulate controls (e.g. twisting the Wright Flyer's wings to observe coordinated rudder deflection, or shifting AC phases to see Tesla's rotating magnetic stator field).
4. **Historical & Legal Deconstructions**: Line-by-line claim decoders, patent litigation history (Wright vs. Curtiss, Bell vs. Gray, Farnsworth vs. RCA), and civilizational impact analysis.

---

## Curated Historical Patents

| Patent | Title | Inventors | Grant Date | Key Breakthrough | Interactive Sim |
|---|---|---|---|---|---|
| **[US 821,393](./src/data/patents/wright-flyer.ts)** | Flying-Machine | Orville & Wilbur Wright | May 22, 1906 | 3-axis flight control via wing-warping & coordinated rudder | 🛩️ Flight Dynamics Sim |
| **[US 381,968](./src/data/patents/tesla-motor.ts)** | Electro-Magnetic Motor | Nikola Tesla | May 1, 1888 | Polyphase AC rotating magnetic field induction motor | ⚡ Rotating Field Vector Sim |
| **[US 223,898](./src/data/patents/edison-lightbulb.ts)** | Electric-Lamp | Thomas A. Edison | Jan 27, 1880 | High-resistance carbon filament in high vacuum ($100\ \Omega$) | 💡 Thermal Vacuum Circuit |
| **[US 174,465](./src/data/patents/bell-telephone.ts)** | Improvement in Telegraphy | Alexander Graham Bell | Mar 7, 1876 | Variable resistance undulating current acoustic transmitter | 📞 Audio Waveform Transducer |
| **[US 1,773,980](./src/data/patents/farnsworth-tv.ts)** | Television System | Philo T. Farnsworth | Aug 26, 1930 | All-electronic image dissector cathode ray video raster | 📺 Electron Beam Raster Sim |
| **[US 2,981,877](./src/data/patents/noyce-ic.ts)** | Semiconductor Device-and-Lead Structure | Robert N. Noyce | Apr 25, 1961 | Monolithic planar IC with vapor-deposited aluminum leads | 🔬 Silicon Layer Cutaway |
| **[US 2,495,429](./src/data/patents/spencer-microwave.ts)** | Method of Treating Foodstuffs | Percy L. Spencer | Jan 24, 1950 | Cavity magnetron dielectric microwave heating | 🍕 RF Cavity Resonance Sim |
| **[US 3,671,542](./src/data/patents/kwolek-kevlar.ts)** | Wholly Aromatic Polycarbonamide Filaments | Stephanie L. Kwolek | Jun 20, 1972 | Liquid-crystalline aramid polymer chain alignment (Kevlar) | 🛡️ Tensile Stress & Chain Sim |

---

## Architectural Highlights

```
┌────────────────────────────────────────────────────────────────────────┐
│                        classic-patents.com                             │
│                    Next.js 15/16 App Router (Vercel)                    │
├────────────────────────────────────────────────────────────────────────┤
│  [Museum Gallery & Catalog]  │  [Search, Timeline & Era Filters]       │
├──────────────────────────────┴─────────────────────────────────────────┤
│                     PATENT DUAL-PROJECTION ENGINE                       │
│  ┌─────────────────────────────────┬────────────────────────────────┐  │
│  │   Face 1: Archival Patent       │  Face 2: Plain English         │  │
│  │   • Verbatim OCR Transcript     │  • Deep Engineering Analysis   │  │
│  │   • Original Scanned Facsimiles │  • Line-by-Line Claim Decoders │  │
│  │   • Legal Claims Hierarchy      │  • Historical Patent Wars      │  │
│  └─────────────────────────────────┴────────────────────────────────┘  │
├────────────────────────────────────────────────────────────────────────┤
│                  INTERACTIVE SIMULATION RUNTIMES                       │
│  • Flight Aerodynamics  • Polyphase AC Magnetics  • Vacuum Bulb Thermal │
│  • Acoustic Transducer  • Electron Beam Raster    • Silicon Planar IC   │
│  • Microwave Resonance  • Liquid Crystal Polymer Chain Alignment       │
└────────────────────────────────────────────────────────────────────────┘
```

### The Dual-Projection Model (Diptych)
Every patent page presents two synchronized faces:
- **Archival Specification**: Exact, verified transcription of the historical USPTO filing, with original figures, reference numerals, and formal claims structure.
- **Plain English Breakdown**: An engineering-first deconstruction of the physical, electrical, or chemical principles, accompanied by decoded claim breakdowns explaining what was legally protected versus prior art.

### Thematic Visual Modes
- 📜 **Archival Parchment Mode**: Warm sepia and cream palette with classic serif typography.
- 📐 **Engineering Blueprint Mode**: Deep cyanotype midnight-blue drafting aesthetic with cyan vector lines.
- 🌑 **Obsidian Dark Mode**: High-contrast modern charcoal-and-brass instrument mode.

---

## Data Pipeline & OCR Tooling

Classic Patents uses an automated data pipeline to ingest, extract, and verify patent records:

```bash
# 1. Download official patent PDFs and high-res drawing plates
bun run pipeline:download

# 2. Run focr (franken_ocr) to extract clean markdown transcripts
bun run pipeline:ocr

# 3. Verify all patent data against strict TypeScript/Zod schemas
bun run pipeline:verify
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

# Test production build
bun run build
```

---

## Vercel Deployment

The project is designed for zero-waste, CLI-driven Vercel hosting using prebuilt artifacts:

```bash
# 1. Pull project configuration & environment
vercel pull --yes

# 2. Build locally (prevents burning cloud build credits)
vercel build --prod

# 3. Deploy prebuilt artifact to production
vercel deploy --prebuilt --prod
```

---

## Project Structure

```
classic-patents.com/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── layout.tsx            # Root layout with fonts & theme provider
│   │   ├── page.tsx              # Museum gallery & catalog home
│   │   ├── patents/[id]/         # Patent dual-projection deep-dive
│   │   └── about/                # Mission, methodology & OCR pipeline
│   ├── components/
│   │   ├── layout/               # Navigation, Header, Footer, ThemeToggle
│   │   ├── patents/              # Patent viewer, DualProjection, ClaimsDecoder
│   │   └── patents/visuals/      # Bespoke interactive simulation components
│   ├── data/
│   │   └── patents/              # Complete patent dataset & specifications
│   ├── types/                    # TypeScript interfaces & data contracts
│   └── lib/                      # Utilities, search, formatting
├── scripts/
│   ├── download-patents.ts       # Patent PDF & plate downloader
│   ├── ocr-patents.ts            # focr integration pipeline
│   └── verify-data.ts            # Data validation suite
├── public/                       # Static assets & patent facsimiles
├── AGENTS.md                     # AI agent operational guidelines
├── COMPREHENSIVE_PLAN_...md      # Master architecture blueprint
├── LICENSE                       # MIT License with OpenAI/Anthropic Rider
└── package.json                  # Dependencies & scripts
```

---

## About Outside Contributions

Please don't take this the wrong way, but I do not accept outside contributions for any of my projects. I simply don't have the mental bandwidth to review anything, and it's my name on the thing, so I'm responsible for any problems it causes; thus, the risk-reward is highly asymmetric from my perspective. I'd also have to worry about other "stakeholders," which seems unwise for tools I mostly make for myself for free. Feel free to submit issues, and even PRs if you want to illustrate a proposed fix, but know I won't merge them directly. Instead, I'll have Claude or Codex review submissions via `gh` and independently decide whether and how to address them. Bug reports in particular are welcome. Sorry if this offends, but I want to avoid wasted time and hurt feelings. I understand this isn't in sync with the prevailing open-source ethos that seeks community contributions, but it's the only way I can move at this velocity and keep my sanity.

---

## License

The Classic Patents source code is licensed under the **MIT License with an OpenAI/Anthropic Rider**, Copyright (c) 2026 Jeffrey Emanuel (see [`LICENSE`](./LICENSE)). The rider withholds all rights from OpenAI, Anthropic, their affiliates, and anyone acting on their behalf, including any use of the software or derivative works in a machine-learning dataset, training corpus, evaluation harness, or pipeline. In any conflict between the rider and the rest of the license, the rider controls.

Historical patent texts and drawings are in the public domain.

---

## See Also
- [`COMPREHENSIVE_PLAN_FOR_CLASSIC_PATENTS.md`](./COMPREHENSIVE_PLAN_FOR_CLASSIC_PATENTS.md) — Master architectural specification.
- [`AGENTS.md`](./AGENTS.md) — Coding agent guidelines & operating protocol.
- [franken_ocr (`focr`)](https://github.com/Dicklesworthstone/franken_ocr) — Pure-Rust hyper-optimized OCR engine.
