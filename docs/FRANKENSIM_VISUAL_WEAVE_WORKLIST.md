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
- [x] P3.5 Fermi `fermiKeff` / `stepFermiKinetics` shared by engine, badge, schematic, spec clauses, 3D
- [x] P3.6 Sholes / Linotype / Reno / Otis 3D draw `machineKernels` and write registry keys (`typingSpeedWpm`, `matrixRate`, `beltSpeed`, `cabPayload`/`cableTension`)
- [x] P3.7 More 3D sliders remapped to registry keys: Westinghouse `trainPipePressure`, Hyatt `steamTempC`, Maxim `firingRate`, Nobel `ngConcentrationPct`, Pasteur `wortTempC`, Pelton `runnerRpm`, De Laval `bowlRpm`, Diesel `compRatio`, McCormick `forwardSpeedMph`, Edison phonograph `mandrelRpm`, Thomson `weldCurrentAmps`, Gramme `shaftRpm`, Hollerith `cardsPerMin`, Davenport `batteryVoltage`
- [x] P3.8 Corliss both 3Ds write `steamPressurePsi`; Zeppelin writes `flightSpeedKnots`; Glidden writes `twistsPerFoot`. Native `aero_step_yaws_when_torque_is_applied` passed; public `flyer_aero_step` applies +Y torque (ω_y = 0.58 after 8 steps).

## P4 — Backlog (do not drop; not this slice's visitor-facing blocker)

- [x] P4.1 Host-pumped TickScheduler + bounded catch-up (Wright 3D hello loop)
- [x] P4.2 Shared bus for Tesla / Howe / CCD / Engelbart 3D (2D already on the bus)
- [x] P4.2b Remaining original-catalog 3D sliders write the same registry keys as 2D / badge
- [x] P4.3 Aero kernel (`stepFlyerAero` CG2 + SI torque). `flyer_aero_step` added to fs-flyer-wasm; HUD reports wasm vs TS. hello_spin is residual only.
- [x] P4.4 Live USPTO raster warp (Wright Fig. 4 ghost sheet skews with wingWarp)
- [x] P4.5 Callout = material probe (live SI on pin inspector)
- [x] P4.6 `fs-regime` invalid region on the figure (uncoupled high warp)
- [x] P4.7 `fs-ivl` interval ghosts (lift / yaw / k_eff / v_e envelopes)
- [x] P4.8 Fidelity discrepancy field on the part (model vs Kitty Hawk / 3600 rpm)
- [x] P4.9 `fs-qty` typed HUD (SI dimension tags on telemetry units)
- [x] P4.10 `fs-truss` guy-wire force color (left/right bay paint from lift + warp)
- [x] P4.11 `fs-lbm` / refuse cosmetic smoke (Goddard plume gated on v_e; Spencer RF)
- [x] P4.12 `fs-feec` Whitney overlay (Tesla Fig. 4 discrete 1-forms on stator)
- [x] P4.13 `fs-spectral` mode scrubber (Marconi odd harmonics; Tesla coil LC)
- [x] P4.14 `fs-psycho` Bell sones (Stevens 2^((phon-40)/10) on voice slider)
- [x] P4.15 `fs-matdb` material cards (Edison carbon vs platinum)
- [x] P4.16 Prior-art failure toggle (1901 uncoupled warp on the instrument)
- [x] P4.17 Two clocks (Fermi prompt vs delayed; Tesla field vs shaft; Spencer RF vs thermal)
- [x] P4.18 Pointer as source term (Wright schematic click sets wingWarp)
- [x] P4.19 Dated `fs-scenario` cards (Kitty Hawk, CP-1, Auburn, Centennial)
- [x] P4.20 Claim-satisfaction pills on ClaimsDecoder (Wright Claim 1 ↔ coupled)
- [x] P4.21 Spec-clause highlight from kernel predicates (Wright / Tesla / Fermi / Marconi)
- [x] P4.22 Diptych split-view same tick (plain + spec chips share tick N)
- [x] P4.23 `fs-phs` energy strip (Wright / Edison / Goddard / Einstein / Tesla)
- [x] P4.24 `fs-couple` after kernels are honest (warp→yaw, stator→shaft, I²R→radiation)
- [x] P4.25 `fs-ad` slider derivatives (d(param)/dt on badge + tick chips)
- [x] P4.26 `fs-thermochem` Goddard / Einstein / Goodyear (T_c/T_e, COP strip, Arrhenius cure)
- [x] P4.26b Goddard 3D de Laval lathe + plume rebuild from Ae/At and Te
- [x] P4.27 Visitor as transducer (mic / device roll / typed Morse / Lamarr grid)
- [x] P4.28 Wozniak φ2 theft
- [x] P4.29 Edison filament color from blackbody T
- [x] P4.30 Fermi Geiger from k_eff (respects mute)
- [x] P4.31 `fs-fft` spark waterfall (Marconi 2D: odd-harmonic damped train)
- [x] P4.32 `fs-assimilate` Kitty Hawk residual (lift − 750 lbf, speed − 30 mph)
- [x] P4.33 `fs-surrogate` named phone rung (A440 / C5 / Ahoy / Watson)
- [x] P4.34 `fs-mms` residual on schematic (same residual card as fidelity)
- [x] P4.35 A11y live region for SI envelope (PhysicsTelemetryBadge)

## Explicitly out of scope

CSV export, digest QR, print receipts, OG stills from ticks, budget pies,
shareable admin URLs.
