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
- [x] P3.9 `paramAliases` on the shared bus: 3D local slider names canonicalize on write and expand on read, so peer reverts of individual 3D files cannot split the badge from the mesh.
- [x] P3.10 Diesel / Maxim / Westinghouse / Eastman 3D draw `FrankenSimEngine` steps (adiabatic T₂, recoil stroke, triple-valve clamp, hyperfocal EV). Diesel flame gated on auto-ignition.
- [x] P3.11 Catalog kernels (`catalogKernels.ts`) fill advertised-but-missing engine methods: Pelton, Gramme, Otto, Parsons, Ericsson, De Laval, Nobel. Badge `computeMetrics` and 3D HUDs call the same functions. Daimler/Hollerith 3D use existing engine steps. Parsons `steamPressureBar` aliases `inletPressurePsi`.
- [x] P3.12 Second catalog wave: Whitney, McCormick, Davenport, Corliss, Gatling, Hyatt, Pasteur, Glidden, Edison phonograph, Thomson welding, Zeppelin. Engine `stepZeppelinAirship` now accepts registry keys (`gasInflation`, `flightAlt`, `flightSpeedKnots`, `trimWeight`).
- [x] P3.13 Third wave: Noyce, Edison bulb, Bell, Morse, Engelbart mouse, Wozniak, Einstein (badge COP), Lincoln (badge Archimedes). 3D HUDs match telemetry. Kevlar 3D uses `stepKevlarContinuum` modulus.
- [x] P3.14 Duplicate 3Ds: Corliss steam and Davenport electric now call the same catalog steps as their siblings. Hollerith tabulator uses `stepHollerithTabulating`. Goodyear HUD modulus from `stepGoodyearRubber`. CCD collected charge from `stepCcdWells`.

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

## P5 — Catalog 3D: kernel draw, not camera chrome

- [x] P5.1 Shared `StudioKernelChips` SI overlay (numbers from the step, not a second formula)
- [x] P5.2 Hyatt ram/extrusion gated on `isMelted` + viscosity
- [x] P5.3 De Laval cream/skim streams gated on g-force split
- [x] P5.4 Otis cab drops the claimed catch distance when the rope is cut
- [x] P5.5 Pelton jet paints by u/v (gold at 0.5, cyan/rose off-design)
- [x] P5.6 Sholes ivory key + typebar follow `stepSholesTypewriter`
- [x] P5.7 Linotype magazine channels + falling matrix from slug cycle
- [x] P5.8 Gatling flash interval = kernel RoF; Corliss wrist amplitude = cutoff
- [x] P5.9 Otto flame size from compression ratio; Kodak / Davenport / Reno chips
- [x] P5.10 Weave probes, interval ghosts, fidelity, dated scenarios for the same machines
- [x] P5.11 Parsons steam axial speed from enthalpy; opacity from shaft kW
- [x] P5.12 Ericsson wake from ship knots / thrust
- [x] P5.13 Pasteur bubbles from yeast activity (quiet off-temp)
- [x] P5.14 Thomson sparks + seam glow only when I²R forges
- [x] P5.15 Maxim jacket paints by barrel temperature
- [x] P5.16 Whitney fibers from lint output; brush rpm from kernel
- [x] P5.17 McCormick chips; sickle already kernel-driven
- [x] P5.18 Nobel core only glows when the cap actually initiates
- [x] P5.19 Edison stylus amplitude from groove depth
- [x] P5.20 Zeppelin altitude/pitch from net lift and trim
- [x] P5.21 Westinghouse roll speed from shoe clamp force
- [x] P5.22 Hollerith pin stroke from solenoid force
- [x] P5.23 Glidden / Gramme SI chips on the canvas
- [x] P5.24 Hollerith tabulator sibling: press from cycle time, fake 24-relay badge removed
- [x] P5.25 Daimler hot-tube glow + stall below 600 °C; BMEP / diff wheels shown
- [x] P5.26 Davenport electric sparks scale with shaft watts
- [x] P5.27 Noyce HUD shows depletion width and breakdown margin
- [x] P5.28 Catalog kernels own Daimler / Hollerith; engine and weave call them
- [x] P5.29 Morse armature pull from I² force, not a binary key
- [x] P5.30 Bell diaphragm throw from kernel µm
- [x] P5.31 Einstein circulation / frost from cooling watts and T_evap
- [x] P5.32 Wozniak bus: Φ1 video always, Φ2 CPU only
- [x] P5.33 Lincoln hull paints rose when aground; paddle slows
- [x] P5.34 Goodyear stress arrows from tensile psi
- [x] P5.35 Edison HUD shows lm/W from the blackbody kernel
- [x] P5.36 Spencer spoke spin / opacity from Hull oscillation and dielectric loss
- [x] P5.37 Kevlar stop is E ≥ 90 GPa, not a shear-rate guess
- [x] P5.38 Bardeen hole drift from α and D_p
- [x] P5.39 Marconi wavefronts from f₀ and spark kW
- [x] P5.40 Colt recoil from muzzle velocity
- [x] P5.41 Farnsworth beam brightness from lux; raster scale from gyro radius
- [x] P5.42 Howe engine wraps `stepHoweSewingMachine`; badge + 3D HUD show lockstitch shear
- [x] P5.43 CCD badge / 3D / 2D share `stepCcdWells` (lux, clockFreq, V_gate); no fake 65k e⁻
- [x] P5.44 Tesla coil streamers drawn from kernel inches; coupling *k* is the registry slider
- [x] P5.45 Goddard 3D steps with Ae/At; HUD I_sp / v_e / Mach from the same step as the badge
- [x] P5.46 Engelbart 3D HUD shows wheel ω from the kernel; weave probe / fidelity / 1968 scenario
- [x] P5.47 Diesel / Kodak / Farnsworth / phonograph / Noyce weaves share the same step as the 3D HUD
- [x] P5.48 Maxim / Westinghouse / Lamarr / Diesel badges call the shared step (no second formula)
- [x] P5.49 Lamarr 3D freq / jam / HUD use live channel count, not leftover 44-bar / 87-key math
- [x] P5.50 Marconi range and Spencer loss come from the kernel, not a private badge formula
- [x] P5.51 Bardeen α / transit and Colt hoop / muzzle come from the same step as the 3D HUD
- [x] P5.52 Bardeen transport uses Ge hole lifetime so 50 µm (the historical gap) still amplifies
- [x] P5.53 Tesla motor badge uses the 2-pole kernel (ns = 3600 at 60 Hz), not a 4-pole copy
- [x] P5.54 Kevlar / Goodyear / Farnsworth / Daimler / Kodak / Hollerith badges call the shared step
- [x] P5.55 Otis badge arrest force / pawl come from stepOtisElevator
- [x] P5.56 Fermi 2D/3D/badge share fuelEnrichmentPct; 3D graphite fallback is 99.5% (ZIP)
- [x] P5.57 Engelbart 3D speed/DPI come from the kernel (350 mm/s, wheel-radius dpi)
- [x] P5.58 Nobel cushion and blast P come from the kernel; Sholes pitch replaces fake jam %
- [x] P5.59 Lincoln 2D/3D/badge share stepLincolnBuoy; hull draft depends on registry weight
- [x] P5.60 Einstein 2D/3D/engine wrap the catalog kernel; ammoniaRatio is on the bus
- [x] P5.61 Corliss η comes from cutoff; Bell voice frequency is on the bus
- [x] P5.62 Westinghouse 2D uses the triple-valve kernel; Kevlar 2D strength from draw
- [x] P5.63 Tesla coil N_s and spark rate are on the bus; streamers scale with turns
- [x] P5.64 Parsons 2D/3D/badge share 48 compound stages from the kernel
- [x] P5.65 Engelbart pulses/rev is 200 on the bus; Lamarr jam channel + hop count shared
- [x] P5.66 Goddard altitude is on the bus; Tesla 3D spark flicker follows sparkRateHz
- [x] P5.67 Diesel / Maxim / Otto / Colt / Sholes 2D faces call the shared step
- [x] P5.68 Spencer 2D popcorn heat follows Hull oscillation + dielectric loss
- [x] P5.69 Pelton / Nobel / Thomson / Otis / De Laval / Reno / Zeppelin 2D call the shared step
- [x] P5.70 Catalog 2D honesty: Daimler, Pasteur, Gramme, Gatling, Whitney, McCormick, Hyatt, Edison phonograph/bulb, Linotype, Ericsson, Glidden, Hollerith, Kodak, Bardeen, Corliss, Davenport, Morse, Noyce, Marconi, Bell, Wozniak, Goodyear, Farnsworth call the same step as badge/3D. Otis hoist T uses hanging mass; Zeppelin keel trim is position/pitch, not fake kg.
- [x] P5.71 Peer-reverted Otis/Pelton 2D restored onto the shared step. Tesla 2D uses stepTeslaMotor (P=2, load 38.5). Howe 2D shows stitch Hz / shear N. Lamarr 2D processing gain and jam occupancy come from stepLamarrFrequencyHopping. Morse receive gate is kernel force, not fake miles.
- [x] P5.72 Tesla slip is Kloss low-slip (s≈10% at 38.5 N·m), not T/45. Goddard thermo and rocket step share R=365 / v_e. Energy strip for Edison / Goddard / Einstein / Tesla calls the same step as the badge.
- [x] P5.73 Tesla-coil resonance is teslaCoilResonantKhz (2D/3D/badge/weave). Davenport η/I from copper loss, not P/V tautology. Goddard 2D Mach is kernel machExit. Weave coupleLinks Tesla/Edison call the shared step. Goddard 2D/3D write us-1102653 (page id), not leftover us-1155986.
- [x] P5.74 CCD 2D/3D write us-3858232 (page id), not leftover us-3923554. Wright 2D wing lift/drag bars share the kernel lift split (18.5 N per deg warp). Wozniak 3D clock is apple.cpuClockMhz.
- [x] P5.75 Tesla 2D no longer writes omegaT onto the shared bus every 30 ms; Fig. 4 schematic animates locally. Goddard/CCD colorized equations resolve from page ids via alias.
- [x] P5.76 Tesla 3D publishes the kernel ElectromagneticsState (1.2 T / 220 V / 87% η), not leftover 0.8 T / 110 V / 78%. Input watts from kernel η. Davenport 3D chips show I and η. Goodyear 3D HUD tensile/return from the kernel.
- [x] P5.77 Bardeen 2D / 3D / badge share bardeenLoadLine (Av = α·80, G = 10 log10(Av·α)). No more |Vc|/0.6 or α²·Vc/1.5.
- [x] P5.78 Farnsworth photocathode µA lives on stepFarnsworthTv (lux). 2D / 3D / badge / weave pass incident lux. Engine Bardeen wraps the catalog transport so α cannot drift.
- [x] P5.79 Farnsworth coil→gauss is farnsworthDeflectionGauss (120 G @ 0.42 A). Otto peak compression/firing (r^1.35 and ×3.8) live on stepOttoEngine; 2D/3D read those bars.
- [x] P5.80 Gramme I and ripple live on the kernel (no V/4.5 3D split). Gatling 1850 J, Colt ½mv², and Goodyear Tg are kernel fields. Engine Colt wraps catalog.
- [x] P5.81 Maxim muzzle energy is ½mv² from the same 14 g / 740 m/s already in the recoil step (no leftover 3400 J). Parsons blade u/c lives on the kernel; 2D copy is 48 rings not 45. Otto badge/3D show P2 and P3. Gramme/Gatling/Colt/Goodyear/Daimler/Kodak/Linotype leftover HUD constants now read kernel fields.
- [x] P5.82 Tesla coil f₀ includes the topload slider (15 pF secondary + C_top). Sholes 90° throw and hammer angle share the kernel. Phonograph lead-screw pitch / surface speed / bandwidth live on stepEdisonPhonograph. Morse V/R (12.5 Ω/mi + 150 Ω coil), WPM unit time, and 3D HUD come from stepMorseTelegraph. Kodak 2.5 in format and Edison feeder 0.4 Ω are kernel fields. Tesla P=2 is TESLA_FIELD_POLES.
- [x] P5.83 Glidden 950 lb Bessemer rating, barb contact stress, and line ft/min live on the kernel. Lincoln 3D draft follows hullDraftFt (weight + bellows), not 5.0 − Δd. Hyatt density / clarity / extrusion rate, Kevlar alignment + fiber UTS (engine wraps catalog), and Wozniak Φ2 duty 100% are kernel fields.
- [x] P5.84 McCormick ground m/s and cutter Hz come from the printed wheel/gear kinematics. Zeppelin lift kg / payload live on the kernel (no private /9.81). Corliss boiler MPa and expansion ratio replace leftover psi×0.00689 and 100/cutoff; 3D η is kernel thermalEfficiencyPct, not a coal-savings guess. Otis hanging mass (400 kg cab + payload) and Hollerith 40-dial 1890 register bank are kernel fields.
- [x] P5.85 Nobel GPa / MJ/kg, Thomson upset burr, Whitney saw tip speed, De Laval skim flow, Ericsson pitch/slip (3D η_p is 1−s, not 68+v/15), Gatling cycle ms, Otis hoist T, Pasteur survivor %, Glidden tension lb, and Zeppelin km/h all come from the shared step.
- [x] P5.86 Tesla rotor rpm / shaft W / input W live on ElectromagneticsState (2D/3D/badge/energy/weave). Goddard thrust lbf on both TS and WASM returns. Pasteur ABV/CO₂, CCD V_out, Hollerith 7-hour card day, Whitney vs-hand, Engelbart mm/pulse, Linotype lph, and Edison high-R current come from the shared step.
- [x] P5.87 Otis cab lb / catch inches, Westinghouse stop feet, Noyce oxide nm / tpd ps / f_max, Tesla-coil kV, Bardeen I_c, Howe cloth feed, Pasteur shelf months, and Nobel exudation all come from the shared step.
- [x] P5.88 Goddard nozzle match (ε* vs altitude) is goddardNozzleMatch. Zeppelin mph / prop rpm, Colt powder grains, Linotype chars/hour, phonograph cm/s, Edison feeder I²R, Thomson joule W, Westinghouse 2D stroke from pistonStrokeRatio, and Farnsworth raster advance all come from the shared step.
- [x] P5.89 Fermi Geiger interval is kernel period (not 280/(k−0.98) or 0.4/k²). Gramme 36 junctions from the step. Wozniak demo tick, Lamarr hop/jam occupancy, Spencer popcorn ΔT, Tesla-coil streamer scale, and Westinghouse wheel decel from pistonStrokeRatio.
- [x] P5.90 Howe 2D default is registry 240 rpm (not 180) and passes stitchPitch 3.5 mm. Whitney 2D crank is 180. Corliss 3D rpm is 65. Edison I and Langmuir V^{-3.5} design life live on the kernel. Engelbart 3D pulse rate is v·PPR/circumference, not slew px/s labeled as Hz; counts/mm is 1/pitch.
- [x] P5.91 Corliss 3D η is thermalEfficiencyPct (no leftover coal-savings name). Hyatt ram Hz tracks kernel extrusion. Phonograph 3D traverse is axialTravelMmPerS from the lead-screw pitch, not rpm×0.002.
- [x] P5.92 Fermi 2D delayed-period clock is kernel reactorPeriodSeconds (not 0.084/(k−1)). Tesla-coil 3D arc metres are streamerLengthMeters. Spencer water s/K is mcΔT/P on the kernel. Maxim recoil stroke mm lives on the step. Sholes weave cadence default is 40. Kodak 1/t is shutterReciprocal.
- [x] P5.93 Marconi is one catalog step: R_rad 36.56 Ω and f₀ kHz. Engine wraps it. 2D waterfall / weave / badge use kernel f₀ (not leftover c/4h). Wave rings advance with f₀. Pelton 2D/3D show bucket u. Davenport 3D P_in is electricalWatts.
- [x] P5.94 Tesla-coil spectral modes use teslaCoilResonantKhz (topload included). Marconi mode click writes mast height from the fundamental via marconiMastHeightFromHz, not c/4 of a harmonic. Kevlar appliedTension is on the shared bus; engine wrap forwards it; badge residual GPa matches 2D.
- [x] P5.95 Noyce 2D clock default is registry 10 MHz (not 1). clockPeriodNs lives on the kernel; 3D charge packets and badge use it. Lincoln/Einstein engine wraps spread catalog fields (hullDraftFt, evapTempC/cop) instead of dropping them. Otto 2D shows P2/P3 from the step.
- [x] P5.96 Goodyear 2D drops the leftover vulcanKinetics split; regime/rateRel/true stress live on stepGoodyearRubber. Bell 3D liquid R₀ / I₀ come from the same step as Δi, not a private V/R.
- [x] P5.97 Bell batteryVoltage (6 V) and liquidConductivity (1.2 S) are registry controls; 2D/3D/badge share R₀/I₀. Goodyear specimenTempC and appliedTensileStretch are on the bus; isGlassy / raw-gum melt-freeze use specimen temp, not a private 35 °C slider.
- [x] P5.98 Westinghouse 2D speed tape uses kernel v²/2s deceleration (not pistonStroke×18 mph/s). Approach 45 mph, stop time, and 3D wheel roll come from the same step. Otis 2D drop and “38 ms” banner use stoppingDistanceCm / pawlEngagementMs.
- [x] P5.99 Spencer pop threshold, kernel count, RF period (408 ps), dry-ice ΔT=0, and time-to-100 °C live on the step. Hollerith 2D no longer opens at a fake 450 cards. Kodak roll counter starts at 0 of rollCapacity.
- [x] P5.100 Hollerith sensingPinCount is 16 and registerDialCount is 40 on the same step; 2D cups and badge no longer treat them as one number. Press dwell is cycleTimeMs. Kodak flash dwell is shutter time. Pasteur/Otto/Diesel reset zeros presentation clocks.
- [x] P5.101 Morse sequence uses PARIS dit/dah/gaps from unitDurationMs (not leftover 80/220 ms). Linotype cast dwell is solidificationTimeMs. Thomson weld pulse is I⁻¹ from the step. Nobel flash follows 20 cm charge transit. Marconi spark button uses sparkDisplayMs. Hollerith 3D dial loop is 40 printed.
- [x] P5.102 Morse tapeAdvanceRadPerS lives on the step; 3D spool uses it; 2D HUD/slider writes wpmSpeed and shows dit/dah/unit. Colt 2D/3D share cycleDisplayMs (800). Kevlar impactDisplayMs is 1e6/v (floor 400). Engelbart clickDisplayMs is 180000/pulseRateHz. Nobel flashDisplayMs is the shared 200 ms visibility floor; 2D writes ngConcentrationPct (alias covers nitroglycerinRatioPct). Kodak flashDisplayMs is max(80, t·1000); roll counter uses rollCapacity.
- [x] P5.103 Kevlar 3D fly-in integrates impactVelocityMps (25 m/s per studio unit). Engelbart 2D HUD shows pulseRateHz and clickDisplayMs from the same step.
- [x] P5.104 CCD 3-phase gate step is phasePeriodNs = 1/(3f) on stepCcdWells. Visible φ dwell is phaseDisplayMs = 500/f (not leftover 1/(2f) or 0.8/f). 2D interval, 3D phase timer, badge, engine clockPeriodNs, and weave share it. Kodak barrel ω = 2π/t lives on the step; 3D rotates from barrelOmegaRadPerS. Edison low-R Swan/Maxim I, P, T, and feeder loss live on stepEdisonBulb.
- [x] P5.105 Howe crank ω (rad/s and deg/s) lives on stepHoweSewingMachine. 2D no longer does leftover rpm/60×12; 3D integrates crankOmegaRadPerS. Tesla 2D/3D share teslaFieldDisplayOmega (electrical ω / 20). Spencer heatTickMs is 200 on the step.
- [x] P5.106 De Laval bowl ω and 0.15 display ω live on the step; 2D disc vanes and 3D bowl integrate displayOmega, not leftover rpm×2π×0.15. Parsons rotor ω, blade u, steam c, and 0.08 display ω live on the step; 2D shaft-end and 3D drum share it. Ericsson shaft ω and wakeSwirlScale 0.4 live on the step; 2D blades and 3D screw use shaftOmegaDegPerS / shaftOmegaRadPerS.
- [x] P5.107 rpmToOmega helper. Whitney crank/saw/brush ω, Gatling crank ω, Pelton runner ω, Davenport shaft ω, and Maxim fire ω live on the shared step. 2D clocks and 3D rotors read those fields instead of leftover rpm×6 / rpm×2π/60.
- [x] P5.108 Otto/Corliss crank ω, Glidden flyer/reel ω, phonograph mandrel ω, and Hollerith press ω live on the shared step. 2D crank/cylinder clocks and 3D flywheel/governor/flyer/mandrel/press use those fields.
- [x] P5.109 Diesel step takes engineRpm; crank ω lives on the step (15.71 rad/s at 150 rpm). 2D 720° clock and 3D crank use it. Daimler running ω (hot-tube BMEP scale) lives on the step; 3D no longer does leftover rpm×BMEP/4.5. McCormick wheel/reel/cutter ω live on the printed kinematic step; 2D sickle and 3D wheel/reel/sickle share them.
- [x] P5.110 Davenport 2D rotor uses shaftOmegaDegPerS (not leftover rpm×6). Gramme displayDegPerFrame / displayRadPerFrame (1.5° ≡ 2π/240 at shaftRate=1) live on the step; 2D/3D share it; bobbin loop uses printedJunctionCount. Zeppelin propeller display ω (rpm/60×8) lives on the step; 3D props integrate it.
- [x] P5.111 Hyatt ramHz / ramStrokeStudio live on the step (14.25 cm/min → 0.75 Hz). Wozniak phi2DisplayHz (4 Hz) and busDisplaySpeed live on the step; 3D Φ2 window is 2πf, not leftover π×8. Westinghouse rolling ω (v/0.42 m, clamp from pipe) lives on the step; 3D wheels no longer convert mph privately.
- [x] P5.112 Fermi neutronDisplaySpeed (k_eff×4 studio u/s) lives on the kinetics step. Bell acousticDisplayOmega (2πf/20), electronDisplaySpeed (I₀×12), and waveAdvancePerS live on the telephone step; 3D diaphragm/electrons/rings read them.
- [x] P5.113 3D rotors drop leftover rpm→ω fallbacks (Howe, McCormick, Gatling, Diesel, Whitney, Zeppelin display ω). Maxim kinematics take fireOmegaRadPerS from the step. De Laval creamDropAdvancePerS lives on the separator step. Kevlar chainWiggleOmega / thermalDisorder live on the continuum step.
- [x] P5.114 Pelton / Ericsson / Daimler drop leftover rpm→ω fallbacks. Westinghouse clampRatio is the step field only. Hollerith kinematics take pressOmegaRadPerS (cards/s = ω/2π). Kevlar shearRatePerS / shearAlignment live on the continuum step; 3D no longer does leftover (draw→shear)/600. Otto integrates crankOmegaRadPerS (not leftover rpm×2π/60). Glidden flyer/reel drop 31.4 / 6.28 magic fallbacks.
- [x] P5.115 Edison phonograph kinematics take mandrelOmegaRadPerS (not leftover rpm×2π/60). Tesla Fig. 9 step emits fieldDisplayOmega; 2D tick/HUD and 3D B-arrow read it. Bell 3D drops leftover 138.2 / 2.16 fallbacks and uses acousticDisplayOmega / electronDisplaySpeed.
- [x] P5.116 Tesla coil 2D / 3D / badge / weave call stepTeslaCoilFromControls so resonant kHz is not re-derived beside the step. Thomson burr and Goddard Ae/At drop leftover 3.8 mm / 3.5 fallbacks.
- [x] P5.117 Goddard step emits chamberTempK / exhaustTempK / gamma; 2D and 3D stop calling goddardThermo beside it. Bardeen engine wrapper spreads voltageGain / powerGainDb / collectorCurrentMa; 3D drops the second catalog step and bardeenLoadLine. Ericsson / Hyatt / Fermi drop leftover 0.4 / 0.08 / 99.5 / 800 fallbacks.
- [x] P5.118 Goddard step emits chemicalEnthalpyWatts / exhaustKineticWatts; energy strip drops goddardThermo. Bardeen badge reads powerGainDb / Ic from the engine step (no second catalog step or bardeenLoadLine). Fermi badge uses kinetics.kEffective. CCD / Pelton / Morse / Goddard / Marconi 3D drop leftover 200 ms / 850 lux / 0.5 / 20 WPM / 0 m/s / 88 m fallbacks.
- [x] P5.119 Spencer spokeDisplayOmega / spokeOpacity live on the magnetron step; 3D kinematics no longer do leftover (f/2450)×4.5 or loss/2000. Fermi weave ghosts, spec clauses, and schematic all use stepFermiKinetics.kEffective (no extra fermiKeff call).
- [x] P5.120 Farnsworth electronDisplaySpeed (v/2e7)×45, Goddard plumeAdvancePerS (v_e/2000)×35 gated at 800 m/s, Noyce signalDisplaySpeed (clock×0.45), and Lincoln paddleDisplayOmega (1.2 rad/s) live on the shared steps. 3D kinematics integrate those fields; Goddard model drops leftover Ae/At `?? 3.5`.
- [x] P5.121 Howe lockstitch emits needleStudioRotZ / needleStudioY / shuttleStudioZ and clothStudioAdvancePerS; 3D no longer divides leftover 45/90/60. Pelton jet/spray/needle/handwheel studio rates live on the wheel step. Wozniak, Fermi, and Gramme drop leftover `?? 4.0` / `?? k_eff×4` / `?? 2π/240` fallbacks. Goddard 3D reads thrustLbf from the step.
- [x] P5.122 Einstein fluidDisplaySpeed / heaterGlow / generatorGlow / evaporatorGlow live on the absorption step; 3D thermosiphon and glow no longer divide leftover 45 / 250 / 300 / 35.
- [x] P5.123 Bardeen holeDriftSpeed / gapStudioUnits, Kevlar bulletDisplaySpeed, Morse keyOscillation / armatureStrike / tapeAdvance / electronDisplaySpeed, Edison incandescence / thermalJitter, and Nobel shockwaveGlow / stickDisplayOmega live on the shared steps. 3D kinematics no longer convert leftover Ie/D, v/400, WPM/20, T/300, or v_det/6000 privately.
- [x] P5.124 Otto govDisplayOmega / flyballRadius, Diesel governorBallSpread / pressureNeedleRadPerBar, Maxim steamOpacity, and Parsons steamAdvancePerS / steamOpacity live on the shared steps. 3D no longer converts leftover rpm/180, rpm/150, evap/15, or h/550×n/3000.
- [x] P5.125 Corliss govSpread / wristAmp, Zeppelin hullStudioY, Otis springBowY, and Mergenthaler wedgeLift live on the shared steps. 3D no longer converts leftover rpm/100, lift/40, deflection/10, or wedge/10.
- [x] P5.126 Daimler hotTubeGlow, Goodyear stressScale / thermalAmplitude / clampStudioX, Hollerith plungeAmp, Gramme fluxOpacity, and Thomson weldGlow / weldSeamScale / jawStudioOffset live on the shared steps. 3D no longer converts leftover T/800, psi/2800, F/40, EMF/160, or burr/3.8.
- [x] P5.127 Bell diaphragmStudioScale, Edison phonograph stylusAmp / stylusOmega, Eastman filmAdvance / supplySpool omega, De Laval pulley / skim rates, and Marconi waveOpacity / wavePhaseRate / mastStudioScale live on the shared steps. 3D no longer converts leftover μm/10, μm/1000, spool×0.8, pulley×0.25, or kW/80.
- [x] P5.128 Tesla coil streamerStudioLength (m/1.5), Bell electronStudioSpeed (I×6), Ericsson wakeFlowSpeed / wakeSwirlCoeff, and Fermi rodStudioY / fuelGlow live on the shared steps. 3D no longer converts leftover inches×0.0254, electron×0.5, ω×0.08, or rod/100×3.2.
- [x] P5.129 Parsons steamSwirlOmega, Marconi waveAdvancePx, Fermi rodSvgY, and Engelbart pathDisplayOmega live on the shared steps. 2D/3D no longer convert leftover displayΩ×0.5, f/0.85, rod/100×120, or mm/s×0.018. Fermi 3D wrapper no longer re-derives rod/glow beside the step.

## Explicitly out of scope

CSV export, digest QR, print receipts, OG stills from ticks, budget pies,
shareable admin URLs.
