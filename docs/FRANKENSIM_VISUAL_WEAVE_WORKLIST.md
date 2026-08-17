# FrankenSim visual weave — implementation worklist

Living checklist. No CSV/export/QR/receipt theater. A row is done only when
the visitor can see or hear the kernel change the instrument.

## P0 — Shared law and honesty

- [x] P0.1 Wright registry owns `airspeed`, `wingWarp`, `rudder`, `elevator`, `coupled`
- [x] P0.2 `computeMetrics` calls `stepWrightFlyerSi` (SI newtons / N·m)
- [x] P0.3 `PhysicsTelemetryBadge` reads `usePatentPhysics` (no private slider copy)
- [x] P0.4 Wright 3D sliders write the shared bus
- [x] P0.5 Wright 2D sliders + pedagogy steps write the same bus
- [x] P0.6 Schematic Fig. 4 reads `wingWarp` / `rudder` (not a third name)
- [x] P0.7 Coupling factor unified (rudder = 0.45 × warp when Claim 1 is on)
- [x] P0.8 3D HUD in SI (N, N·m); mph remains the historical airspeed control
- [x] P0.9 Uncoupled warp produces visible adverse yaw on 2D, 3D, and schematic

## P1 — WASM hello kernel on the Flyer mesh

- [x] P1.1 Port `rigid_body_step` (CG2 / exp-map) as TS fallback (`src/physics/lie.ts`)
- [x] P1.2 Loader tries `fs-flyer-wasm` `flyer_hello_spin` from `/wasm/fs-flyer/`
- [x] P1.3 Each rAF tick advances 1 hello step; apply quaternion to airframe
- [x] P1.4 HUD states `WASM` vs `TS lie fallback` honestly
- [x] P1.5 Built `fs-flyer-wasm` locally (RCH has no wasm32) into `public/wasm/fs-flyer/`
- [x] P1.6 Wing/rudder/canard remain local articulations on that body attitude

## P2 — Tesla Fig. 4 strobe + B-field from the kernel

- [x] P2.1 `teslaBAt` / `teslaFig4Strobe` return B(ωt) and 8 samples at nπ/4
- [x] P2.2 Schematic draws those 8 arrows on the stator
- [x] P2.3 Live B arrow is the current sample
- [x] P2.4 Tesla 2D stator arrows use the same kernel
- [x] P2.5 Tesla 3D B-arrow uses the same (bx, by) sample

## P3 — Fields and contacts from the step buffer

- [x] P3.1 CCD: `stepCcdWells` → well depth and packet count
- [x] P3.2 Howe: `stepHoweLockstitch` → needle / shuttle / loop
- [x] P3.3 Engelbart: `stepEngelbartResolver` → pulses from wheel roll
- [x] P3.4 Engine.ts re-exports the same functions

## P4 — Backlog (do not drop; not this slice's visitor-facing blocker)

- [x] P4.1 Host-pumped TickScheduler + bounded catch-up (Wright 3D hello loop)
- [x] P4.2 Shared bus for Tesla / Howe / CCD / Engelbart 3D (2D already on the bus; remaining 3D pairs still local)
- [ ] P4.3 Replace hello_spin with aero kernel (`fs-mbd` + warp/rudder)
- [ ] P4.4 Live USPTO raster warp
- [ ] P4.5 Callout = material probe
- [ ] P4.6 `fs-regime` invalid region on the figure
- [ ] P4.7 `fs-ivl` interval ghosts
- [ ] P4.8 Fidelity discrepancy field on the part
- [ ] P4.9 `fs-qty` typed HUD
- [ ] P4.10 `fs-truss` guy-wire force color
- [ ] P4.11 `fs-lbm` / refuse cosmetic smoke
- [ ] P4.12 `fs-feec` Whitney overlay
- [ ] P4.13 `fs-spectral` mode scrubber
- [ ] P4.14 `fs-psycho` Bell sones
- [ ] P4.15 `fs-matdb` material cards
- [ ] P4.16 Prior-art failure toggle (beyond Wright coupling — already P0.9)
- [ ] P4.17 Two clocks (Fermi / Tesla RF / Spencer)
- [ ] P4.18 Pointer as source term
- [ ] P4.19 Dated `fs-scenario` cards
- [x] P4.20 Claim-satisfaction pills on ClaimsDecoder (Wright Claim 1 ↔ coupled)
- [ ] P4.21 Spec-clause highlight from kernel predicates
- [ ] P4.22 Diptych split-view same tick
- [ ] P4.23 `fs-phs` energy strip
- [ ] P4.24 `fs-couple` after kernels are honest
- [ ] P4.25 `fs-ad` slider derivatives
- [ ] P4.26 `fs-thermochem` Goddard / Einstein / Goodyear
- [ ] P4.27 Visitor as transducer (mic / device roll / typed Morse / Lamarr grid)
- [x] P4.28 Wozniak φ2 theft
- [x] P4.29 Edison filament color from blackbody T
- [x] P4.30 Fermi Geiger from k_eff (respects mute)
- [ ] P4.31 `fs-fft` spark waterfall
- [ ] P4.32 `fs-assimilate` Kitty Hawk residual
- [ ] P4.33 `fs-surrogate` named phone rung
- [ ] P4.34 `fs-mms` residual on schematic
- [ ] P4.35 A11y live region for SI envelope

## Explicitly out of scope

CSV export, digest QR, print receipts, OG stills from ticks, budget pies,
shareable admin URLs.
