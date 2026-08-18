# FrankenSim Multi-Domain Physics WASM Integration: Master Roadmap

This document serves as the single source of truth and granular task tracker for integrating the **FrankenSim** computational physics engine (`~/projects/frankensim`) into **Classic Patents** (`classic-patents.com`).

---

## 1. Physics Domain Implementation Checklist

### Domain 1: Aerodynamics & 6-DoF Multi-Body Dynamics
- [x] **Wright Flyer (US 821,393)**
  - [x] 6-DoF Lie-group rigid-body quaternion integration (`fs-time`, `fs-mbd`)
  - [x] Wing-warping differential lift ($\Delta C_L$) & induced drag ($\Delta C_{D_i}$)
  - [x] Coupled rudder yaw moment ($N_r \cdot r$) to counteract adverse yaw
  - [x] Real-time aerodynamic telemetry HUD (Airspeed, Altitude, Drag, Alpha, Beta)
- [x] **Goddard Liquid Rocket (US 1,155,986)**
  - [x] De Laval supersonic isentropic nozzle expansion ($M = v/a$)
  - [x] Combustion chamber pressure ($P_c$) and specific impulse ($I_{sp}$) calculations
  - [x] Gyroscopic steering vane deflection physics

### Domain 2: Electromagnetics & Resonant LC Oscillators
- [x] **Tesla Polyphase AC Induction Motor (US 381,968)**
  - [x] Rotating stator magnetic flux field vector $\vec{B}(t) = B_0(\cos\omega t\,\hat{i} + \sin\omega t\,\hat{j})$
  - [x] Rotor slip calculation ($s = \frac{n_s - n}{n_s}$) and induced electromagnetic torque
  - [x] Interactive AC frequency, pole count, and load torque controllers
- [x] **Tesla High-Potential Transformer (US 593,138)**
  - [x] Interpretive transformer visualization bound to the correct catalogue id
  - [x] Source-described quarter-wave secondary relation ($l \approx \lambda / 4$)
  - [x] Explicitly non-facsimile model until the manual source edition is complete
- [x] **Alexander Graham Bell Telephone (US 174,465)**
  - [x] Variable resistance diaphragm acoustic transfer function
  - [x] Undulating continuous electrical speech current waveform synthesis
  - [x] Live Web Audio acoustic synthesizer coupling
- [x] **Guglielmo Marconi Wireless Telegraphy (US 586,193)**
  - [x] Spark-gap RF damped wave train generation
  - [x] Elevated monopole aerial radiation impedance and ground return loop
- [x] **Samuel Morse Electro-Magnetic Telegraph (US 1,647)**
  - [x] Solenoid coil inductance time constant ($\tau = L/R$)
  - [x] Armature magnetic attraction force ($F = \frac{B^2 A}{2\mu_0}$) and mechanical return spring

### Domain 3: Solid-State, CMOS & Microarchitecture
- [x] **John Bardeen & Walter Brattain Transistor (US 2,569,347)**
  - [x] Germanium point-contact hole injection dynamics
  - [x] Emitter-to-collector current gain factor ($\alpha = \Delta I_c / \Delta I_e$)
  - [x] Dynamic signal amplification curve and bias point
- [x] **Robert Noyce Monolithic Planar IC (US 2,981,877)**
  - [x] PN junction depletion barrier capacitance ($C_j$) and built-in potential
  - [x] Planar silicon dioxide ($\text{SiO}_2$) surface passivation isolation
  - [x] Vapor-deposited aluminum lead interconnect resistance
- [x] **Boyle & Smith 3-Phase CCD (US 3,923,554)**
  - [x] 3-phase clocking MOS potential well charge packet bucket-brigade transfer
  - [x] Charge transfer efficiency ($\text{CTE} \ge 0.9999$)
  - [x] Photodiode photon-to-electron well filling
- [x] **Steve Wozniak Apple II Microcomputer (US 4,136,359)**
  - [x] Two-phase ($\phi_1 / \phi_2$) non-conflicting time-multiplexed DRAM bus arbitration
  - [x] Zero-wait-state CPU read/write vs. video scanline memory access
  - [x] 14.31818 MHz master crystal divider and NTSC color burst phase generator
- [x] **Philo Farnsworth Electronic Television (US 1,773,980)**
  - [x] Cylindrical dissector tube photo-cathode electron emission
  - [x] Relativistic Lorentz force magnetic deflection raster ($\vec{F} = q(\vec{E} + \vec{v}\times\vec{B})$)
  - [x] Anode aperture scanline intensity sampling

### Domain 4: Thermodynamics, Heat & Phase Transport
- [x] **Thomas Edison Incandescent Carbon Lamp (US 223,898)**
  - [x] Stefan-Boltzmann radiative blackbody emission ($P = \varepsilon \sigma A T^4$)
  - [x] High-vacuum molecular mean free path and filament sublimation prevention
  - [x] Temperature-dependent carbon filament resistance ($R(T) = R_0(1 + \alpha \Delta T)$)
- [x] **Albert Einstein & Leo Szilard Refrigerator (US 1,781,541)**
  - [x] Dalton partial pressure ternary gas-fluid absorption cycle ($NH_3 + H_2O + \text{butane}$)
  - [x] Non-mechanical thermosiphon bubble lift pump
  - [x] Thermodynamic Coefficient of Performance (COP) evaluation
- [x] **Percy Spencer Cavity Magnetron Microwave (US 2,495,429)**
  - [x] Anode resonant cavity standing wave electromagnetic distribution (2.45 GHz)
  - [x] Dielectric loss dipole water molecule heating rate ($\dot{q} = 2\pi f \varepsilon'' \varepsilon_0 E^2$)
  - [x] Waveguide microwave energy propagation

### Domain 5: Nuclear Reactor Criticality & Neutron Kinetics
- [x] **Enrico Fermi & Leo Szilard Neutronic Reactor (US 2,708,656)**
  - [x] 6-group delayed neutron precursor point kinetics:
    $$\frac{dn}{dt} = \frac{\rho - \beta}{\Lambda} n + \sum_{i=1}^6 \lambda_i C_i$$
  - [x] Graphite moderator thermalization and uranium lattice resonance escape probability ($p$)
  - [x] Cadmium control rod absorption cross-section ($\sigma_a = 2520\ \text{barns}$) and criticality index ($k_{\text{eff}}$)

### Domain 6: Continuum Mechanics, Polymers & Mechanisms
- [x] **Charles Goodyear Vulcanized Rubber (US 3,633)**
  - [x] Sulfur bridge polymer cross-linking lattice entropy elasticity
  - [x] Arrhenius temperature-dependent cross-link formation kinetics
- [x] **Stephanie Kwolek Kevlar Aramid Fibers (US 3,671,542)**
  - [x] Liquid-crystalline poly-p-phenylene terephthalamide hydrogen-bonded polymer chains
  - [x] Extreme tensile modulus ($E = 130\ \text{GPa}$) and stress-strain rupture threshold
- [x] **Elias Howe Sewing Machine (US 4,750)**
  - [x] Eye-pointed needle thread loop penetration and oscillating shuttle lockstitch capture
  - [x] Camshaft and feed-dog synchronization kinematics
- [x] **Douglas Engelbart Coordinate Computer Mouse (US 3,541,541)**
  - [x] Orthogonal knife-edge dual wheels planar coordinate resolver kinematics
  - [x] Potentiometer resistance wiper angle to $(X, Y)$ screen cursor position
- [x] **Abraham Lincoln Buoying Vessels (US 6,469)**
  - [x] Expandable air chamber hydrostatic buoyant lift ($\Delta F_b = \rho_{\text{water}} g \Delta V$)
  - [x] River shoal draft reduction and pneumatic shaft synchronization
- [x] **Hedy Lamarr & George Antheil Spread Spectrum (US 2,292,387)**
  - [x] 88-frequency piano-roll slotted paper tape synchronization
  - [x] Pseudo-random carrier frequency hopping and anti-jamming SNR gain

---

## 2. Universal Infrastructure & Visual Polish
- [x] Procedural Daylight Azure Sky & 3D Cumulus Clouds Engine
- [x] Clean Light/Dark Theme Switching with Contrast Preservation
- [x] Dynamic Lazy-Loading Code-Splitting (198 kB Initial JS Payload)
- [x] URL Search Parameter State Synchronization (`?view=...`)
- [x] Satori & Next.js ImageResponse OpenGraph/Twitter Social Cards
- [x] Complete Unredacted Specifications & Verified USPTO Original PDFs
- [x] Universal Physics Telemetry HUD Component (consumes the shared bus, not a private `useState` copy)
- [x] Blake3 Deterministic State Replay Serializer
- [x] Honest kernel badge: "WASM step" vs "TypeScript fallback" — never "WASM Core" on a JS formula
- [x] Shared `usePatentPhysics` bus wired through 2D, 3D, schematic, badge, and audio
- [x] Host-pumped `TickScheduler` (bounded catch-up, visibility re-anchor) adopted from `~/projects/frankensim/apps/wright-flyer`
- [x] Capability probe + transferable-buffer fallback (COOP/COEP is an enhancement)

---

## 3. Visual weaving (how WASM stops being a sticker)

The present museum has three disconnected physics stories: 3D modules call
`FrankenSimEngine.step*` inside rAF, some 2D modules use `usePatentPhysics`,
and `PhysicsTelemetryBadge` keeps its own slider state. None of them load a
`.wasm` module. Closing that gap is not "port more formulas to Rust." It is
making the kernel the **sole author of pose, field, and refusal**, then
letting every face be a projector.

### 3.1 Transport (one protocol)

Host-pumped, host-fed clock, drain-once telemetry. Coarse calls only:

```
controls:  Float32Array  [id-ordered SI values]
step(dt_s, tick) → { digest_u64x4, refused_u32, reason_code, n_samples }
samples:   Float32Array  body poses / field texels / joint angles
```

No per-frame strings. Isolated tabs may use the Wright Flyer leased-ring /
SharedArrayBuffer path; everyone else copies a transferable buffer. The page
must render without COOP/COEP.

### 3.2 Per-patent weave (what the visitor should feel)

| Patent | Crate that should own the law | What WASM writes each tick | How the visual uses it |
|---|---|---|---|
| Wright Flyer | `fs-time` + `fs-mbd` + flyer kernel | 6-DoF pose, ΔL, C_Di, yaw/pitch rates, coupling-on flag | 3D airframe follows pose; 2D wings twist from the same warp; Fig. 4 callouts light when coupling is on; badge shows adverse yaw **appearing** when Claim 1 is uncoupled |
| Tesla motor | `fs-flux` rotating B + `fs-mbd` rotor | B-vector (Re, Im), slip, torque, ns | 3D/2D stator arrows are the B sample, not a CSS rotate; squirrel-cage spin = ω(1−s); 2-phase vs 3-phase is a kernel input, not a color swap |
| Tesla coil | `fs-flux` dual-resonant LC | V1, V2, spark-gap state, streamer seeds | Streamer line vertices come from the seed buffer; tone frequency = 1/√(LC) sample |
| Bell | `fs-flux` + Web Audio | instantaneous R(t), i(t) | Diaphragm displacement drives resistance; AudioWorklet reads i(t); "undulating current" is audible |
| Marconi / Morse | `fs-flux` RLC + solenoid | spark train / armature force | Sounder click when F > spring; RF envelope from the damped train, not `playClick()` |
| Goddard | `fs-mbd` + isentropic nozzle (honest: no ICE gas crate yet) | Pe/Pc, Me, Isp, vane moment | Plume length ∝ Me; refuse if Pe/Pa is outside the documented expansion map |
| Fermi | `fs-lattice` 6-group kinetics | n, Ci, keff, rod worth | Pile glow ∝ flux; **refuse** at documented supercritical bound instead of a red CSS tint |
| Bardeen | `fs-lattice` hole injection | Ie, Ic, α | Band diagram / current arrows scale from α; bias point is a kernel state |
| Noyce | depletion + interconnect R | Cj, Vbi, Rlead | Layer stack thickness / window etch is a parameter; Cj HUD is the same sample as the 3D oxide flash |
| Boyle–Smith CCD | bucket-brigade wells | well charge[3 phases] | Packets **are** the f32 wells; CTE < 1 leaves a visible residual |
| Farnsworth | Lorentz orbit | electron (x,y) per scan sample | Raster is the orbit dump, not a CSS grid; aperture current is the sample at the anode hole |
| Spencer | Hull cutoff + dielectric loss | Va, B, q̇ | Electron spokes appear only when B > Bc(√Va); popcorn / water heat from q̇ |
| Edison | Stefan–Boltzmann + R(T) | T, P, R, mean free path | Filament color/emissive = T; refuse if "atmosphere" is restored (mean free path too short) |
| Einstein–Szilard | absorption-cycle thermo | T_evap, T_abs, COP, lift-bubble rate | Bubble pump frequency from the sample; COP card is not a second formula |
| Goodyear | `fs-lattice` cross-link kinetics | ν, E(T, S, t) | Mesh stiffness / bounce from ν; undercured vs scorched is a refusal/regime flag |
| Kwolek | `fs-solid` nematic chain | σ, ε, alignment | Chains align from the order parameter; rupture is a refusal, not a scale(0) |
| Howe | `fs-mbd` cam/shuttle | needle Z, shuttle θ, feed | Lockstitch only closes when the phase window is true — that is Claim 1 |
| Engelbart | dual-wheel kinematics | X, Y, wheel θ | Cursor and wheels are the same integrator; no leftover `isDragging` physics |
| Lincoln | hydrostatic ΔV | Fb, draft | Bellows mesh volume is the state; hull rise = Δdraft |
| Lamarr | deterministic 88-key roll | channel, hop index | Waterfall bars are the roll, not `Math.random`; jamming SNR from the kernel |
| Wozniak | φ1/φ2 bus schedule | phase, who owns the bus | Apple II video snow / CPU wait is the schedule sample |

### 3.3 Cross-face tricks that make it feel like one instrument

1. **Claim switch as a constraint.** Toggling "Claim 1 hip-cradle coupling" or
   "commutator vs induction" is a kernel flag. The schematic, the 2D cartoon,
   and the 3D studio must all show the illegal motion when the flag is off.
2. **Schematic as a field overlay.** `InteractiveDiagramViewer` already reads
   `usePatentPhysics`. Next step: warp SVG paths / flux arrows / charge packets
   from the sample buffer so Fig. 4 is a live reduction, not a static tracing.
3. **Adjoint / sensitivity readout** (`fs-adjoint` when available). A second
   HUD line: "∂yaw/∂warp at this airspeed." That is how you teach adverse yaw
   without a lecture.
4. **Replay tape.** Record `{tick, controls}` and re-step. Same digest ⇒ same
   flight. Visitor-facing "replay the Kitty Hawk warp" / "replay the 88-key
   roll" is the museum version of Blake3.
5. **Load another patent as a port.** Later, Tesla shaft torque as Howe's
   flywheel input, Edison lamp as Tesla's electrical load. Only after each
   kernel is independently honest.
6. **Reduced motion.** If `prefers-reduced-motion`, still step the kernel at
   1 Hz and update numbers; do not freeze the law just because the mesh is still.

### 3.5 Further weaves (beyond the shared bus)

These assume §3.1–3.3. They use crates the museum does not touch yet.

- [ ] **Hello kernel first.** `fs-flyer-wasm::hello_spin` already returns a unit quaternion, Blake3 digest, and typed refusal. Drive the Wright 3D airframe from that quaternion this week so a `.wasm` module actually moves a museum mesh. Then replace hello with aero. Do not wait for a perfect Flyer kernel to prove the seam.
- [ ] **Live facsimile, not a second cartoon.** Warp the USPTO figure raster (displacement field from WASM poses) so Fig. 4 *is* the granted drawing coming alive. The hand SVG is a fallback when the scan is too dirty.
- [ ] **Callout = probe.** Clicking element `12` drops an `fs-probe` at that material point. The inspector shows local B, T, σ, and the epistemic color (verified / validated / estimated).
- [ ] **`fs-regime` traffic light on the figure.** If airspeed/α is outside lifting-line validity, or Va/B is outside Hull's map, paint the invalid region and list ranked repairs. A beautiful wrong solve is the thing FrankenSim exists to refuse.
- [ ] **`fs-ivl` halos.** HUD values are intervals `[L⁻, L⁺]`, not fake 3-digit certainty. Ghost the wing/filament/pile at the interval extrema so the visitor sees the bound.
- [ ] **Fidelity discrepancy on the part.** `|fine − prolongate(coarse)|` drawn on the wing or stator, not a dashboard pie.
- [ ] **Fidelity ladder the visitor can climb.** Closed-form → 2D panel / circuit → 3D MBD/FEEC. Same sliders. Discrepancy field `|fine − prolongate(coarse)|` drawn on the wing or stator.
- [ ] **`fs-qty` typed HUD.** Kernel emits dimensioned quantities. The UI cannot put lbf next to tesla without a conversion. This kills the current 3D-vs-engine unit split (Wright 3D still does slug/ft while `engine.ts` is SI).
- [ ] **`fs-truss` on the guy-wires.** Wright schematic already draws diagonal wires. Color them by live axial force. Slack wire vs singing wire is Claim-adjacent structure, not decoration.
- [ ] **`fs-lbm` / `fs-airflow` smoke.** Replace cosmetic streamlines with a seed of LBM or a validity-gated airflow card over the airfoil SDF. Refuse rather than invent a pretty vortex.
- [ ] **`fs-feec` Whitney overlay on Tesla Fig. 4.** Edge fluxes on the patent's own coil graph. The rotating field is a 1-form on the drawing, not a CSS `rotate()`.
- [ ] **`fs-spectral` mode scrubber.** Tesla coil, Edison filament, Wright wing: a slider through the first few eigenmodes. Resonance is something you scrub, not a caption.
- [ ] **`fs-psycho` on Bell.** Loudness in sones from the undulating current; refuse an absolute SPL claim without calibration. The telephone patent is a hearing instrument.
- [ ] **`fs-matdb` cards.** Goodyear sulfur, Kwolek PPTA, Edison carbon, Noyce Al/SiO₂: properties come from a named material card, not magic numbers in the React file.
- [ ] **Prior-art failure mode.** A toggle that inverts the independent claim (no hip-cradle coupling, commutator instead of induction, air instead of vacuum). The kernel should reproduce the named prior-art crash/spark/melt.
- [ ] **Two clocks.** Fermi prompt vs delayed neutrons; Tesla RF vs rotor RPM; Spencer 2.45 GHz vs thermal seconds. One kernel, two visible time bases, or the visitor cannot see stiffness.
- [ ] **Pointer as a source term.** Drag on the pile, cavity, or filament to add a local neutron/heat/current source. The field must respond. This is how a schematic becomes a laboratory.
- [ ] **`fs-scenario` as dated flights.** Replace generic "high torque" presets with reconstructable cards: "17 Dec 1903, 10:35, 12 s"; "CP-1, 2 Dec 1942."

### 3.6 Still more weaves (faces, energy, the visitor's body)

- [ ] **Claim-satisfaction monitor.** Each independent claim is a predicate on the telemetry envelope. The Claims Decoder pills go green/red live. Uncouple Wright Claim 1 and Claim 1 goes red while the nose yaws the wrong way. The legal face becomes a debugger.
- [ ] **Spec sentences as live regions.** Highlight the clause currently true: "the side having the greater angle of incidence experiences… greater drag" lights when ΔCD_i exceeds the interval bound. The specification is a score following the kernel.
- [ ] **Diptych is one step.** Split-view must show the facsimile (or schematic) and the 3D studio driven by the same tick. Today they are separate routes with separate state.
- [ ] **Stroboscope matching the drawing.** Tesla Fig. 4 is eight successive B-vector positions. A kernel strobe samples ωt = nπ/4 and overlays those eight arrows on the granted figure. The visitor is looking at Tesla's own diagram, animated by discrete de Rham, not a new cartoon.
- [ ] **`fs-phs` energy strip.** A thin ledger under every machine: H, uᵀy, supply defect. If the defect is not ~0, the visual is lying. Tesla motor, Bell diaphragm, Lincoln bellows, Howe needle are port-Hamiltonian objects; treat them as such.
- [ ] **`fs-couple` shaft and load.** Tesla rotor torque as Howe's flywheel port; Edison lamp as Tesla's electrical load. Only after each kernel is independently honest. The Dirac interconnection is the point — energy should not appear from nowhere when two patents touch.
- [ ] **`fs-ad` on every slider.** Hover a control and show ∂Q/∂u for the on-screen quantity. Adverse yaw is ∂N/∂warp. Hull cutoff is ∂Bc/∂√Va. No extra lecture widget.
- [ ] **`fs-thermochem` for fire and ice.** Goddard chamber uses NASA-9 + frozen composition, not a magic Isp. Einstein–Szilard butane/ammonia partial pressures come from the same evaluator. Goodyear sulfur chemistry is a named reaction card or it is refused.
- [ ] **`fs-contact` for needle and wheels.** Howe lockstitch and Engelbart knife-edge wheels are contact events. The stitch forms when the contact flag is true; the mouse pulse fires when the wheel rolls, not when React sees a pointer move.
- [ ] **The visitor is the transducer.** Mic → Bell R(t). Hardware mouse → Engelbart wheels. Device roll → Wright bank. Typed SOS → Morse L/R kernel. Punched 88-key grid → Lamarr roll (not Math.random). WebMIDI keyboard → Tesla coil / Bell frequency. Gamepad hip-cradle → warp.
- [ ] **CCD / Spencer / Fermi pointer sources.** Drag a "lamp" over the CCD wells and watch packets fill; drag a heat blot on the magnetron load; click a uranium lattice cell. Source terms, not hover tooltips.
- [ ] **Wozniak bus theft.** A slider that steals φ2 cycles. Video snow and CPU wait are the same schedule sample. That is the patent.
- [ ] **Edison as a spectrum, not a color.** T → blackbody samples via `fs-fft`/`fs-spectral`; map to CIE for the filament and to a visible spectrum bar. Vacuum loss (mean free path) knocks the spectrum down, it does not just dim a yellow mesh.
- [ ] **Fermi Geiger.** Flux drives a Poisson click train (deterministic seed from the digest). You hear criticality. Mute still defaults on.
- [ ] **`fs-fft` spark waterfall.** Marconi / Tesla coil: the schematic grows a live spectrum of the damped train. Tuning C moves the peak. Resonance is a mountain you climb.
- [ ] **`fs-assimilate` Kitty Hawk.** Fit warp/elevator tape to the 12-second hop distances. Show residual vs the Wrights' own numbers. A museum that can be wrong on purpose.
- [ ] **`fs-surrogate` phone path.** Desktop runs FEEC/LBM; iPhone gets a certified surrogate of the same ports with an honest "reduced rung" banner. Same sliders, named fidelity drop.
- [ ] **`fs-mms` residual on the schematic.** Manufactured solution painted as a field on the figure, not a report.
- [ ] **A11y live region.** Screen readers get the SI envelope on a throttled interval and on refusal.

### 3.4 What this does not authorize

- Porting a formula to Rust and leaving the visual on a CSS spin.
- A second, prettier set of numbers in the badge that disagree with the mesh.
- Claiming 6-group neutron transport or de Laval plume CFD that the crate
  does not yet integrate. Name the refusal; ship the honest fallback.
- Main-thread `atomic.wait`, `Instant::now` on wasm32, or a silent scalar
  path advertised as WASM.
