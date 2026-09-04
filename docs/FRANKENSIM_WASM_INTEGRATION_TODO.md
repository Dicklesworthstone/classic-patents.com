# FrankenSim Multi-Domain Physics WASM Integration: Master Roadmap

This document is the design inventory for integrating the **FrankenSim** computational physics engine (`~/projects/frankensim`) into **Classic Patents** (`classic-patents.com`). It is not the completion ledger. The executable source of truth is [`src/physics/coverageManifest.ts`](../src/physics/coverageManifest.ts), enforced by `scripts/verify-data.ts` and the runtime-instantiation tests.

## Executable status (2026-09-03)

- 103/103 catalogue ids have a pinned facsimile, explicit visual route, TypeScript default telemetry owner, and live equation set; 99/103 have reviewed ledgers and 16/103 publish an accepted archival edition.
- Runtime surfaces: 3 patent-specific WASM packages (Flyer, Goddard's source-bounded 1914 apparatus, and Daimler's source-bounded marine installation), 0 dedicated interpretive packages, 37 consumers of generic FrankenSim owners, and 63 typed-host-only records. Crump's narrow FDM package composes `fs-flux::capillary` and `fs-conduction::reduced_slab` for a declared modern ABS screen, while refusing polymer rheology, entrance loss, phase change, bond strength, heater power, and historic performance. Da Vinci's public visualization stays on a source-bounded TypeScript topology: it keeps the processor, data path, holder engagement structures, and tool physically connected while refusing arm, contact, force, speed, and clinical telemetry the grant does not supply. The shipped `fs-davinci-wasm` joint artifact belongs to the dormant arm demonstration and is not credited to the public route. Howe's narrow package composes one prescribed `fs-mbd` shaft drive into the source's needle-arm, picker, shuttle, lifting-rod, and baster-feed joints; it uses only the two local dimensions printed by the grant and refuses loop capture below an explicit normalized display boundary. Otis's narrow package composes twelve generic `fs-mbd` scalar joints for the complete 1861 hoist, reversing-belt, stop, brake, hook-rack, and counterpoise topology; its travel and speed are explicitly normalized display coordinates because the grant supplies no load, force, timing, travel, or power data. Otto's package composes eight generic `fs-mbd` joint coordinates behind one crank drive and closes the slider-crank, 2:1 side shaft, slide valve, exhaust lift, and normalized governor pose from the same coordinate. Edison's narrow package composes the generic `fs-conduction` gray-body balance with explicit operating-point inputs and the source's seven-thousandths-inch filament example; it does not infer efficacy or lifetime. Kamen's US 3,858,581 exhibit mirrors the generic `fs-mbd` helical-joint constraint on the typed host, counts one striker/switch event per screw turn, and refuses a WASM label because the current browser artifact does not export that joint constructor. Stackhouse's US 4,068,536 exhibit mirrors `fs-mbd` serial revolute-joint forward kinematics on the typed host: motors 9a/9c/9b remain mounted at the elbow, spur gears feed source shafts 15/16/19, three toothed bevel paths remain meshed, and every distal body inherits its supporting shaft frame. It refuses a WASM label because the generic articulated constructor is not exported to this browser boundary, and refuses dynamics because the grant prints no mass, inertia, torque, speed, ratio, efficiency, or calibrated angle. Watson's US 4,098,001 exhibit identifies `fs-solid::Rod` as the applicable geometrically exact flexure owner, but refuses a material/load card and any WASM/SI result because the grant omits section geometry, material, load, and contact inputs; its host pose instead preserves the printed fixed-housing → axial flexures → ring → radial flexures → plate/tool path and exact remote-pivot invariant. Spencer's typed host preserves the printed 10/11 → 24/25 and 26/27 → 23 → 28 path and the exact `c = λf` conversion at the source's ten-centimetre reference; it refuses a generic-WASM label because the shipped surface has no electromagnetic waveguide/magnetron solver and `fs-flux`'s quarter-wave transmission-line relation is not a substitute. Makino's US 4,341,502 exhibit identifies `fs-mbd::JointModel::revolute` as the owner of each printed vertical pivot, but keeps its exact concentric, offset-circle, and Y-link closures on the typed host because `fs-mbd`'s articulated dynamics lane is a tree and the grant withholds dimensions and mass/drive data. Motor 2 is base-supported in every claim form, claims 2/5 show one connected motor-10/two-belt path to tool axis 8, and Claim 6 replaces that coordinate with a rigid two-pivot tool and Y-link. Milacron's US 4,512,709 exhibit identifies `fs-mbd::JointModel::prismatic` for locking-slide translation, `fs-contact::normal_patch` for normal wedge response, and `fs-tribo::partial_slip` for friction; it keeps a source-bounded host interlock because the grant withholds every SI actuator/contact parameter, so a non-aligned aperture physically prevents tool-base withdrawal. Hull's US 4,575,330 exhibit identifies `fs-mbd::JointModel::prismatic` for a future parameterized elevator and `fs-render::volumes::beer_lambert` for optical attenuation only; the typed host preserves the preferred mercury-lamp, shutter, fiber, quartz-lens, plotter, fixed-surface, elevator, and touching-lamina topology, while refusing cure and motion results because the grant supplies neither a resin material card nor a complete motion card. Slocum and Jurgens' US 4,765,668 exhibit mirrors `fs-mbd::JointModel::helical` for the printed 5 mm opposed screw, identifies revolute and prismatic owners for Claims 17 and 16, and withholds `fs-contact::normal_patch` until a workpiece/material card exists. Goddard's separately named liquid-nozzle seam is adjacent to, not called by, the catalogued solid-charge US 1,102,653 apparatus; Tesla's transformer seam is source-bounded to its printed distributed quarter-wave relation.
- Shared bus: 54 time-advancing updaters and 49 typed snapshot publishers. Every cold start is `HONEST_PLACEHOLDER`; a computed host frame is `TS_FALLBACK`. Roomba and Otto promote the shared tape to `WASM` only after an accepted owner step. Watt's sun-and-planet faces share one source-bounded host tape: the rigid planet rocks with its finite connecting rod and the external mesh enforces equal pitch-line velocity, while the unavailable `fs-mbd` holonomic gear/closed-loop boundary remains explicit.
- `wasmArtifacts.test.ts` instantiates and steps all fourteen shipped packages. The twelve active dedicated boundaries prove typed WASM refusals; the dormant Da Vinci joint package remains covered as an artifact but not claimed by the public route; finite-field host decoders still fail closed on malformed accepted results.

The bullets below preserve mechanism requirements and design ideas. A bullet means the treatment exists in the design inventory; it does not assert a Rust owner, a stepped WASM path, cross-face parity, or scientific validation.

### Remaining integration gates

- [ ] Promote a visual from `TS_FALLBACK` to `WASM` bus provenance only when the stepped WASM result owns the published frame.
- [ ] Replace snapshot-only participation with a time-advancing owner where the claimed mechanism actually evolves over time.
- [ ] Validate each proposed weave against the facsimile, the shared SI state, and an executable test before claiming it is shipped.
- [x] **AMF Versatran (`fs-versatran-wasm`) build gate — cleared 2026-09-03.** The shared `fs-mbd::salisbury` composition now passes `fs_ga::Vec3` to `JointModel::revolute`; its four focused topology/equation/refusal tests pass. With that owner repaired, `wasm-pack build --dev --target web -- --locked` completed for `fs-versatran-wasm` and emitted the expected browser package in external scratch storage. This clears the Rust build blocker only: no Versatran glue, `.wasm`, digest, loader, coverage-manifest entry, or `WASM` provenance has been promoted into Classic Patents yet. US 3,212,649 correctly remains a typed TypeScript, source-bounded topology until its generated package and typed receipt receive the same loader, digest, browser-step, and cross-face verification now applied to Salisbury.

---

## 1. Visitor-facing physics treatment inventory

### Domain 1: Aerodynamics & 6-DoF Multi-Body Dynamics
- **Wright Flyer (US 821,393)**
  - 6-DoF Lie-group rigid-body quaternion integration (`fs-time`, `fs-mbd`)
  - Wing-warping differential lift ($\Delta C_L$) & induced drag ($\Delta C_{D_i}$)
  - Coupled rudder yaw moment ($N_r \cdot r$) to counteract adverse yaw
  - Real-time aerodynamic telemetry HUD (Airspeed, Altitude, Drag, Alpha, Beta)
- **Goddard Rocket Apparatus (US 1,102,653)**
  - The active model is the claimed multi-stage solid-charge apparatus, distinct from the adjacent liquid-nozzle teaching export for the later 1926 record.
  - A patent-specific owner composes generic `fs-mbd` rigid-body stepping for primary spin, auxiliary-stage release, the Claim 2 tube-ratio predicate, and the gyroscopically isolated camera support.
  - The active face publishes no invented chamber pressure, thrust, Mach number, liquid-propellant state, trajectory, or dimensional performance value.
- **Daimler Explosive-Gas Marine Engine (US 361,931)**
  - A patent-specific owner composes the generic `fs-mbd` prismatic joint for the propeller shaft's single source-stated longitudinal degree of freedom.
  - Ahead, neutral, and astern are mutually exclusive contact topologies; ahead movement is toward the motor, while astern inserts the intermediate reversing disks without reversing the motor shaft.
  - Fore and aft cooling pipes remain present with pump `u` as an additive option. No travel, speed, torque, flow, thrust, friction, heat, or power value is inferred.

### Domain 2: Electromagnetics & Resonant LC Oscillators
- **Tesla Progressive Alternating-Current Motor-Generator (US 381,968)**
  - Figure 9's source-bound progressive magnetic pole shift from generator coils B/B′ and corresponding motor circuits
  - Four generator collector rings and brushes, ring R, disk D, and separate Figure 13 three-coil (K/K′/K″ at 60°) teaching path
  - Generator-rate control and resultant-field direction; no unprinted slip, rotor-current, torque, power, or material-performance telemetry
- **Tesla High-Potential Transformer (US 593,138)**
  - Interpretive transformer visualization bound to the correct catalogue id
  - Source-described quarter-wave secondary relation ($l \approx \lambda / 4$)
  - Explicitly non-facsimile model until the manual source edition is complete
- **Alexander Graham Bell Telephone (US 174,465)**
  - Variable resistance diaphragm acoustic transfer function
  - Undulating continuous electrical speech current waveform synthesis
  - Live Web Audio acoustic synthesizer coupling
- **Guglielmo Marconi Wireless Telegraphy (US 586,193)**
  - Spark-gap RF damped wave train generation
  - Elevated monopole aerial radiation impedance and ground return loop
- **Samuel Morse Electro-Magnetic Telegraph (US 1,647)**
  - Solenoid coil inductance time constant ($\tau = L/R$)
  - Armature magnetic attraction force ($F = \frac{B^2 A}{2\mu_0}$) and mechanical return spring

### Domain 3: Solid-State, CMOS & Microarchitecture
- **John Bardeen & Walter Brattain Transistor (US 2,524,035)**
  - Germanium point-contact hole injection dynamics
  - Emitter-to-collector current gain factor ($\alpha = \Delta I_c / \Delta I_e$)
  - Dynamic signal amplification curve and bias point
- **Robert Noyce Monolithic Planar IC (US 2,981,877)**
  - PN junction depletion barrier capacitance ($C_j$) and built-in potential
  - Planar silicon dioxide ($\text{SiO}_2$) surface passivation isolation
  - Vapor-deposited aluminum lead interconnect resistance
- **Boyle & Smith Information Storage Devices (US 3,858,232)**
  - Figure 2's N-type storage medium, insulating layer, three connected electrode groups, input, barrier-layer detector, load, bias, and regeneration topology
  - Figure 3's source-disclosed overlap condition ($\Delta t < 3t_p$) and binary input sequence 1101
  - Typed host tape only: CTE, carrier count, operating voltage/frequency, capacitance, and power remain refused until a source-supported FrankenSim lattice/carrier boundary exists
- **Steve Wozniak Apple II Microcomputer (US 4,136,359)**
  - Two-phase ($\phi_1 / \phi_2$) non-conflicting time-multiplexed DRAM bus arbitration
  - Zero-wait-state CPU read/write vs. video scanline memory access
  - 14.31818 MHz master crystal divider and NTSC color burst phase generator
- **Philo Farnsworth Electronic Television (US 1,773,980)**
  - Cylindrical dissector tube photo-cathode electron emission
  - Relativistic Lorentz force magnetic deflection raster ($\vec{F} = q(\vec{E} + \vec{v}\times\vec{B})$)
  - Anode aperture scanline intensity sampling

### Domain 4: Thermodynamics, Heat & Phase Transport
- **Thomas Edison Incandescent Carbon Lamp (US 223,898)**
  - Stefan-Boltzmann radiative blackbody emission ($P = \varepsilon \sigma A T^4$)
  - High-vacuum molecular mean free path and filament sublimation prevention
  - Temperature-dependent carbon filament resistance ($R(T) = R_0(1 + \alpha \Delta T)$)
- **Albert Einstein & Leo Szilard Refrigerator (US 1,781,541)**
  - Dalton partial pressure ternary gas-fluid absorption cycle ($NH_3 + H_2O + \text{butane}$)
  - Non-mechanical thermosiphon bubble lift pump
  - Thermodynamic Coefficient of Performance (COP) evaluation
- **Percy Spencer Cavity Magnetron Microwave (US 2,495,429)**
  - Anode resonant cavity standing wave electromagnetic distribution (2.45 GHz)
  - Dielectric loss dipole water molecule heating rate ($\dot{q} = 2\pi f \varepsilon'' \varepsilon_0 E^2$)
  - Waveguide microwave energy propagation

### Domain 5: Nuclear Reactor Criticality & Neutron Kinetics
- **Enrico Fermi & Leo Szilard Neutronic Reactor (US 2,708,656)**
  - 6-group delayed neutron precursor point kinetics:
    $$\frac{dn}{dt} = \frac{\rho - \beta}{\Lambda} n + \sum_{i=1}^6 \lambda_i C_i$$
  - Graphite moderator thermalization and uranium lattice resonance escape probability ($p$)
  - Cadmium control rod absorption cross-section ($\sigma_a = 2520\ \text{barns}$) and criticality index ($k_{\text{eff}}$)

### Domain 6: Continuum Mechanics, Polymers & Mechanisms
- **Charles Goodyear Vulcanized Rubber (US 3,633)**
  - Sulfur bridge polymer cross-linking lattice entropy elasticity
  - Arrhenius temperature-dependent cross-link formation kinetics
- **Stephanie Kwolek Kevlar Aramid Fibers (US 3,671,542)**
  - Liquid-crystalline poly-p-phenylene terephthalamide hydrogen-bonded polymer chains
  - Extreme tensile modulus ($E = 130\ \text{GPa}$) and stress-strain rupture threshold
- **Elias Howe Sewing Machine (US 4,750)**
  - One main shaft C carries needle cam Q and feed cam R; follower P rocks needle-arm G about shaft O while shuttle K remains prismatic in trough I between attached picker staves J
  - Lifting-rod W creates the upper-thread slack named by Claim 2, and pinned baster-plate H advances after the shuttle clears the loop
  - The grant's one-eighth-inch needle-eye offset and three-quarter-inch baster-point pitch remain the only historical dimensions; the cam profile, travel, cadence, and loop-clearance threshold are declared normalized display parameters
- **Douglas Engelbart Coordinate Computer Mouse (US 3,541,541)**
  - Orthogonal knife-edge dual wheels planar coordinate resolver kinematics
  - Potentiometer resistance wiper angle to $(X, Y)$ screen cursor position
- **Abraham Lincoln Buoying Vessels (US 6,469)**
  - Expandable air chamber hydrostatic buoyant lift ($\Delta F_b = \rho_{\text{water}} g \Delta V$)
  - River shoal draft reduction and pneumatic shaft synchronization
- **Hedy Lamarr & George Antheil Spread Spectrum (US 2,292,387)**
  - 88-frequency piano-roll slotted paper tape synchronization
  - Pseudo-random carrier frequency hopping and anti-jamming SNR gain

---

## 2. Infrastructure and presentation inventory
- Procedural Daylight Azure Sky & 3D Cumulus Clouds Engine
- Clean Light/Dark Theme Switching with Contrast Preservation
- Dynamic Lazy-Loading Code-Splitting (198 kB Initial JS Payload)
- URL Search Parameter State Synchronization (`?view=...`)
- Satori & Next.js ImageResponse OpenGraph/Twitter Social Cards
- Complete Unredacted Specifications & Verified USPTO Original PDFs
- Universal Physics Telemetry HUD Component (consumes the shared bus, not a private `useState` copy)
- Blake3 Deterministic State Replay Serializer
- Honest kernel badge: "WASM step" vs "TypeScript fallback" — never "WASM Core" on a JS formula
- Shared `usePatentPhysics` bus wired through 2D, 3D, schematic, badge, and audio
- Host-pumped `TickScheduler` (bounded catch-up, visibility re-anchor) adopted from `~/projects/frankensim/apps/wright-flyer`
- Capability probe + transferable-buffer fallback (COOP/COEP is an enhancement)

---

## 3. Visual weaving (how WASM stops being a sticker)

The original roadmap described three disconnected physics stories. The shared
controls and telemetry buses now cover all 79 visual routes, and eleven WASM
packages ship, but most default computation remains TypeScript. Generic WASM
exports are often adjunct visual calculations rather than the sole owner of a
patent state. The remaining gap is making a stepped kernel the **sole author of
pose, field, and refusal** before promoting that frame to `WASM` provenance.

### 3.1 Target transport protocol

Host-pumped, host-fed clock, drain-once telemetry. Coarse calls only:

```
controls:  Float32Array  [id-ordered SI values]
step(dt_s, tick) → { digest_u64x4, refused_u32, reason_code, n_samples }
samples:   Float32Array  body poses / field texels / joint angles
```

No per-frame strings. Isolated tabs may use the Wright Flyer leased-ring /
SharedArrayBuffer path; everyone else copies a transferable buffer. The page
must render without COOP/COEP.

### 3.2 Per-patent target weave (not a completion table)

| Patent | Crate that should own the law | What WASM writes each tick | How the visual uses it |
|---|---|---|---|
| Wright Flyer | `fs-time` + `fs-mbd` + flyer kernel | 6-DoF pose, ΔL, C_Di, yaw/pitch rates, coupling-on flag | 3D airframe follows pose; 2D wings twist from the same warp; Fig. 4 callouts light when coupling is on; badge shows adverse yaw **appearing** when Claim 1 is uncoupled |
| Tesla motor | `fs-flux` progressive field + `fs-mbd` apparatus motion | source-bound B direction, generator rate, pole shift, Fig. 9 disk relation | 3D/2D arrows are the shared resultant-field sample; Fig. 9 and Fig. 13 remain separately labeled source arrangements, with no inferred later performance quantities |
| Tesla coil | generic `fs-flux` distributed-conductor relation | wavelength, electrical length, normalized standing-wave position | Both visual faces place the live standing-wave sample along the source's developed quarter-wave conductor; absolute voltage, current, loss, air breakdown, and discharge reach remain refused because the grant does not supply them |
| Bell | `fs-flux` + Web Audio | instantaneous R(t), i(t) | Diaphragm displacement drives resistance; AudioWorklet reads i(t); "undulating current" is audible |
| Marconi / Morse | `fs-flux` RLC + solenoid | spark train / armature force | Sounder click when F > spring; RF envelope from the damped train, not `playClick()` |
| Goddard | generic `fs-mbd` rigid-body owner | normalized primary spin, auxiliary-stage release, Claim 2 tube-ratio satisfaction, camera-support counter-rotation | Connected 1914 apparatus follows one source-bounded state; refuse contradictory release/contact or invalid tube geometry |
| Daimler | generic `fs-mbd` prismatic-joint owner | normalized shaft coordinate, ahead/neutral/astern contacts, motor/propeller rotation signs, passive and pump-assisted cooling topology | Shaft, coupling, reversing disks, propeller, and both visual faces use the same discrete state; refuse non-discrete selection or contradictory contacts |
| Fermi | `fs-lattice` 6-group kinetics | n, Ci, keff, rod worth | Pile glow ∝ flux; **refuse** at documented supercritical bound instead of a red CSS tint |
| Bardeen | `fs-lattice` hole injection | Ie, Ic, α | Band diagram / current arrows scale from α; bias point is a kernel state |
| Noyce | depletion + interconnect R | Cj, Vbi, Rlead | Layer stack thickness / window etch is a parameter; Cj HUD is the same sample as the 3D oxide flash |
| Boyle–Smith CCD | future `fs-time` + `fs-lattice` carrier boundary | source phase index, overlap admission, and packet coordinate; quantitative charge remains refused without device parameters | Both faces consume one source-bounded tape; every third electrode is physically wired to its Figure 2 conductor, packets stop when $\Delta t < 3t_p$ is not met, and the output/load/bias/regeneration path closes back to input 25 |
| Farnsworth | Lorentz orbit | electron (x,y) per scan sample | Raster is the orbit dump, not a CSS grid; aperture current is the sample at the anode hole |
| Spencer | Hull cutoff + dielectric loss | Va, B, q̇ | Electron spokes appear only when B > Bc(√Va); popcorn / water heat from q̇ |
| Edison | Stefan–Boltzmann + R(T) | T, P, R, mean free path | Filament color/emissive = T; refuse if "atmosphere" is restored (mean free path too short) |
| Einstein–Szilard | absorption-cycle thermo | T_evap, T_abs, COP, lift-bubble rate | Bubble pump frequency from the sample; COP card is not a second formula |
| Goodyear | `fs-lattice` cross-link kinetics | ν, E(T, S, t) | Mesh stiffness / bounce from ν; undercured vs scorched is a refusal/regime flag |
| Kwolek | `fs-solid` nematic chain | σ, ε, alignment | Chains align from the order parameter; rupture is a refusal, not a scale(0) |
| Howe | `fs-mbd` one-drive joint composition | shaft angle, needle-arm angle, shuttle X, picker angles, lifting-rod Y, baster-feed X, loop/refusal state | The curved needle remains fixed to arm G, shuttle K remains in trough I, attached picker staves exchange it, W opens slack, and Claim 1 capture occurs only when source order and the declared clearance boundary agree |
| Otis | `fs-mbd` twelve-joint source topology | platform D, safety bar F, paired E/f rotations, H/I/N drive rotation, shipper S, brake Z, counterpoise R, claim/refusal states | G stays tethered through pulleys i to H; O/P remain guided between N and J/K/L; S/T/U/V moves the belt/brake chain; Q moves R opposite D; a Claim 1 inversion preserves guided geometry but refuses the hook lock |
| Engelbart | dual-wheel kinematics | X, Y, wheel θ | Cursor and wheels are the same integrator; no leftover `isDragging` physics |
| Stackhouse | `fs-mbd` serial revolute joints (typed browser mirror until a generic articulated WASM constructor ships) | selected A/B/C joint frames, source-bounded obliquities, point-P/offset state, orthonormal rotation frame | Shaft 15 carries the B-axis bearing housing; shaft 16 and bevel pair 17/18 turn housing shaft 14a; shaft 19/20, shaft 23, and pairs 21/22 and 24/25 carry terminal shaft 26. No mesh moves outside its supporting parent frame, and no unprinted dynamics or performance values are inferred. |
| Watson RCC | `fs-solid::Rod` law owner identified; normalized topology host pose until source-backed section/material/load/contact inputs exist | Figure 4 translation phase, Figure 5 rotation phase, remaining normalized mismatch, remote/local pivot, Claim 2 anti-twist state | Fixed machine 18 and lip 54 connect through necked axial flexures 56/58/60 to ring 22; radial flexures 24/26/28 connect ring 22 to plate 20 and preserve free end 52 at remote center 50 during rotation. Bellows 90 connects the fixed cap to the moving plate, and fixed workpiece 73 has a genuinely open chamfered hole 71. No stiffness, force, clearance, insertion-success, or timing value is inferred. |
| Makino SCARA | `fs-mbd::JointModel::revolute` generic joint owner identified; exact normalized host closure until a constrained-loop owner and source-backed dimensions/mass/drive card exist | θ₁, θ₂, φ, selected Claim 1/3/6 topology, fixed-member closure error, base-axis and tool-pivot separation | Base 15 supports both motors in concentric and offset forms; four rigid links terminate on vertical pivot shafts. Claims 2/5 connect motor 10 through belt 11, an intermediate support, belt 12, and tool axis 8. Claim 6 removes the belt coordinate, separates the two tool pivots, and connects Y-link 14 while holding tool attitude fixed. No SI dynamics, payload, force, stiffness, clearance, or servo performance is inferred. |
| Milacron toolchanger | `fs-mbd::JointModel::prismatic` slide owner, `fs-contact::normal_patch` normal-contact owner, and `fs-tribo::partial_slip` friction owner identified; normalized host sequence until actuator and contact cards exist | requested/effective registration, slide coordinate, aperture alignment, retention/capture state, sequence-interlock state | The end-effector flange is attached to a supported wrist; plates 26/27, blocks 28/29, cylinder 47, rod 46, yoke 45, and slide 33 form one connected chain. Aperture 34 admits the retention head while slot 40 remains around stem 37 during locking; open bushings 42 receive correctly oriented cylindrical/diamond pins 43/44. A closed slide holds the base seated instead of permitting nonphysical withdrawal. Rack 20 reaches the floor and carries complete base/tool assemblies. No SI stroke, force, wedge pressure, friction, preload, timing, tolerance, holding load, or reliability result is inferred. |
| Hull stereolithography | `fs-mbd::JointModel::prismatic` elevator owner and `fs-render::volumes::beer_lambert` optical-attenuation candidate identified; source-bounded host topology until motion and resin cards exist | requested/effective shutter state, normalized plotter X–Z spot, normalized recoating excursion, supported display-lamina count, fixed working-surface predicate | Container 21 rests on the floor; platform 29 remains joined to its elevator carriage; every displayed lamina touches its predecessor and remains supported; the preferred 350 W mercury lamp, electronic shutter, 1 mm × 1 m fiber bundle, quartz lens, and plotter carriage form one continuous light path. During a recoating excursion the host interlock holds the shutter closed. Cure depth, conversion, adhesion, recoating time, actuator force, and build duration remain refused because the grant supplies no absorption/extinction, critical dose, kinetics, thickness, viscosity, motion, or part-dimension card. |
| Slocum–Jurgens robot end effector | `fs-mbd::JointModel::helical` typed host mirror; `revolute` and `prismatic` connector owners identified; `fs-contact::normal_patch` refused pending a source-complete contact card | source-typical jaw gap, equal-and-opposite hand offsets, screw/motor phase, eight-peg encoder phase, inward dovetail withdrawal, normalized Claim 16 stage, Claim 17 roll, Claim 1 topology predicate | Both opposed screw halves have visibly opposite handedness and drive non-interpenetrating hand bodies around a fixed midpoint. All four fingers remain seated in their hands until inward withdrawal; the whole frame rides two engaged transverse guides connected through the rotational fitting to a floor-supported exhibit stand. The source's 2,000 N, 43 mm/s, 0.05 mm, and motor figures remain reported facts rather than a fabricated force, pressure, power, deflection, or cycle-time solve. |
| Lincoln | hydrostatic ΔV | Fb, draft | Bellows mesh volume is the state; hull rise = Δdraft |
| Lamarr | deterministic 88-key roll | channel, hop index | Waterfall bars are the roll, not `Math.random`; jamming SNR from the kernel |
| Wozniak | φ1/φ2 bus schedule | phase, who owns the bus | Apple II video snow / CPU wait is the schedule sample |

### 3.3 Cross-face tricks that make it feel like one instrument

1. **Claim switch as a constraint.** Toggling "Claim 1 hip-cradle coupling"
   is a kernel flag. The schematic, the 2D cartoon, and the 3D studio must
   all show the illegal motion when the flag is off.
2. **Schematic as a field overlay.** `InteractiveDiagramViewer` already reads
   `usePatentPhysics`. Next step: warp SVG paths / flux arrows / charge packets
   from the sample buffer so Fig. 4 is a live reduction, not a static tracing.
3. **Adjoint / sensitivity readout** (`fs-adjoint` when available). A second
   HUD line: "∂yaw/∂warp at this airspeed." That is how you teach adverse yaw
   without a lecture.
4. **Replay tape.** Record `{tick, controls}` and re-step. Same digest ⇒ same
   flight. Visitor-facing "replay the Kitty Hawk warp" / "replay the 88-key
   roll" is the museum version of Blake3.
5. **Load another patent as a port.** Later, Tesla's authored source relation
   may connect to Howe's flywheel input, Edison lamp as Tesla's electrical load. Only after each
   kernel is independently honest.
6. **Reduced motion.** If `prefers-reduced-motion`, still step the kernel at
   1 Hz and update numbers; do not freeze the law just because the mesh is still.

### 3.4 What this does not authorize

- Porting a formula to Rust and leaving the visual on a CSS spin.
- A second, prettier set of numbers in the badge that disagree with the mesh.
- Claiming 6-group neutron transport or de Laval plume CFD that the crate
  does not yet integrate. Name the refusal; ship the honest fallback.
- Main-thread `atomic.wait`, `Instant::now` on wasm32, or a silent scalar
  path advertised as WASM.

### 3.5 Further weaves (beyond the shared bus)

These are design candidates. Some have partial host or visual treatments, but
none is considered complete merely because a similarly named function or UI
element exists.

- **Hello kernel first.** `fs-flyer-wasm::hello_spin` already returns a unit quaternion, Blake3 digest, and typed refusal. Drive the Wright 3D airframe from that quaternion this week so a `.wasm` module actually moves a museum mesh. Then replace hello with aero. Do not wait for a perfect Flyer kernel to prove the seam.
- **Live facsimile, not a second cartoon.** Warp the USPTO figure raster (displacement field from WASM poses) so Fig. 4 *is* the granted drawing coming alive. The hand SVG is a fallback when the scan is too dirty.
- **Callout = probe.** Clicking element `12` drops an `fs-probe` at that material point. The inspector shows local B, T, σ, and the epistemic color (verified / validated / estimated).
- **`fs-regime` traffic light on the figure.** If airspeed/α is outside lifting-line validity, or Va/B is outside Hull's map, paint the invalid region and list ranked repairs. A beautiful wrong solve is the thing FrankenSim exists to refuse.
- **`fs-ivl` halos.** HUD values are intervals `[L⁻, L⁺]`, not fake 3-digit certainty. Ghost the wing/filament/pile at the interval extrema so the visitor sees the bound.
- **Fidelity discrepancy on the part.** `|fine − prolongate(coarse)|` drawn on the wing or stator, not a dashboard pie.
- **Fidelity ladder the visitor can climb.** Closed-form → 2D panel / circuit → 3D MBD/FEEC. Same sliders. Discrepancy field `|fine − prolongate(coarse)|` drawn on the wing or stator.
- **`fs-qty` typed HUD.** Kernel emits dimensioned quantities. The UI cannot put lbf next to tesla without a conversion. This kills the current 3D-vs-engine unit split (Wright 3D still does slug/ft while `engine.ts` is SI).
- **`fs-truss` on the guy-wires.** Wright schematic already draws diagonal wires. Color them by live axial force. Slack wire vs singing wire is Claim-adjacent structure, not decoration.
- **`fs-lbm` / `fs-airflow` smoke.** Replace cosmetic streamlines with a seed of LBM or a validity-gated airflow card over the airfoil SDF. Refuse rather than invent a pretty vortex.
- **`fs-feec` Whitney overlay on Tesla Fig. 4.** Edge fluxes on the patent's own coil graph. The progressive attraction is a 1-form on the drawing, not a CSS `rotate()`.
- **`fs-spectral` mode scrubber.** Tesla coil, Edison filament, Wright wing: a slider through the first few eigenmodes. Resonance is something you scrub, not a caption.
- **`fs-psycho` on Bell.** Loudness in sones from the undulating current; refuse an absolute SPL claim without calibration. The telephone patent is a hearing instrument.
- **`fs-matdb` cards.** Goodyear sulfur, Kwolek PPTA, Edison carbon, Noyce Al/SiO₂: properties come from a named material card, not magic numbers in the React file.
- **Prior-art failure mode.** A toggle that inverts the independent claim (no hip-cradle coupling, air instead of vacuum). The kernel should reproduce the named prior-art crash or melt.
- **Two clocks.** Fermi prompt vs delayed neutrons; Tesla generator cycles vs display pole shift; Spencer 2.45 GHz vs thermal seconds. One kernel, two visible time bases, or the visitor cannot see stiffness.
- **Pointer as a source term.** Drag on the pile, cavity, or filament to add a local neutron/heat/current source. The field must respond. This is how a schematic becomes a laboratory.
- **`fs-scenario` as dated flights.** Replace generic "high torque" presets with reconstructable cards: "17 Dec 1903, 10:35, 12 s"; "CP-1, 2 Dec 1942."

### 3.6 Further design candidates (faces, energy, the visitor's body)

- **Claim-satisfaction monitor.** Each independent claim is a predicate on the telemetry envelope. The Claims Decoder pills go green/red live. Uncouple Wright Claim 1 and Claim 1 goes red while the nose yaws the wrong way. The legal face becomes a debugger.
- **Spec sentences as live regions.** Highlight the clause currently true: "the side having the greater angle of incidence experiences… greater drag" lights when ΔCD_i exceeds the interval bound. The specification is a score following the kernel.
- **Diptych is one step.** Split-view must show the facsimile (or schematic) and the 3D studio driven by the same tick. Today they are separate routes with separate state.
- **Stroboscope matching the drawing.** Tesla Fig. 4 is eight successive B-vector positions. A kernel strobe samples ωt = nπ/4 and overlays those eight arrows on the granted figure. The visitor is looking at Tesla's own diagram, animated by discrete de Rham, not a new cartoon.
- **`fs-phs` energy strip.** A thin ledger under machines with authored energy quantities: H, uᵀy, supply defect. If the defect is not ~0, the visual is lying. Tesla's source apparatus remains empty because the grant supplies no authored energy quantity.
- **`fs-couple` coupling and load.** Couple only authored ports; Tesla's Fig. 9 source relation does not provide a mechanical load port. The Dirac interconnection is the point — energy should not appear from nowhere when two patents touch.
- **`fs-ad` on every slider.** Hover a control and show ∂Q/∂u for the on-screen quantity. Adverse yaw is ∂N/∂warp. Hull cutoff is ∂Bc/∂√Va. No extra lecture widget.
- **`fs-thermochem` for fire and ice.** A later liquid-Goddard record can use NASA-9 + frozen composition rather than a magic specific impulse; the active 1914 solid-charge record must not acquire those unprinted quantities. Einstein–Szilard butane/ammonia partial pressures come from the same evaluator. Goodyear sulfur chemistry is a named reaction card or it is refused.
- **`fs-contact` for needle and wheels.** Howe lockstitch and Engelbart knife-edge wheels are contact events. The stitch forms when the contact flag is true; the mouse pulse fires when the wheel rolls, not when React sees a pointer move.
- **The visitor is the transducer.** Mic → Bell R(t). Hardware mouse → Engelbart wheels. Device roll → Wright bank. Typed SOS → Morse L/R kernel. Punched 88-key grid → Lamarr roll (not Math.random). WebMIDI keyboard → Tesla coil / Bell frequency. Gamepad hip-cradle → warp.
- **CCD / Spencer / Fermi pointer sources.** Drag a "lamp" over the CCD wells and watch packets fill; drag a heat blot on the magnetron load; click a uranium lattice cell. Source terms, not hover tooltips.
- **Wozniak bus theft.** A slider that steals φ2 cycles. Video snow and CPU wait are the same schedule sample. That is the patent.
- **Edison as a spectrum, not a color.** T → blackbody samples via `fs-fft`/`fs-spectral`; map to CIE for the filament and to a visible spectrum bar. Vacuum loss (mean free path) knocks the spectrum down, it does not just dim a yellow mesh.
- **Fermi Geiger.** Flux drives a Poisson click train (deterministic seed from the digest). You hear criticality. Mute still defaults on.
- **`fs-fft` spark waterfall.** Marconi / Tesla coil: the schematic grows a live spectrum of the damped train. Tuning C moves the peak. Resonance is a mountain you climb.
- **`fs-assimilate` Kitty Hawk.** Fit warp/elevator tape to the 12-second hop distances. Show residual vs the Wrights' own numbers. A museum that can be wrong on purpose.
- **`fs-surrogate` phone path.** Desktop runs FEEC/LBM; iPhone gets a certified surrogate of the same ports with an honest "reduced rung" banner. Same sliders, named fidelity drop.
- **`fs-mms` residual on the schematic.** Manufactured solution painted as a field on the figure, not a report.
- **A11y live region.** Screen readers get the SI envelope on a throttled interval and on refusal.
