# Deep FrankenSim WebAssembly Physics Integration: Master Execution & Tracking Ledger

This document tracks the end-to-end, domain-by-domain integration of the **FrankenSim** computational physics engine (`~/projects/frankensim/crates`) into **Classic Patents** (`classic-patents.com`).

---

## 1. Architectural Invariants & Doctrine

1. **Audited Physics Integrity**: No pseudo-physics or fake random oscillations. Visual simulations must derive their motion, state transitions, streamline trajectories, temperature gradients, and electromagnetic fields from real physical laws in SI units.
2. **Deterministic Replay Boundary**: Physics state must be deterministic given initial conditions and control parameters. Never seed visual physics from `Math.random()`, `Date.now()`, or uncontrolled ambient clocks.
3. **FrankenSim WASM Kernel Source Truth**: `genericKernelSource()` and `usePatentPhysics()` report `"wasm"` only when the compiled WebAssembly module is genuinely instantiated and stepping in the browser runtime; otherwise, fallback to identical typed host mathematics.
4. **Single Shared Physics Bus**: 3D Three.js studios, 2D vector schematics, HUD telemetry badges, and claim decoders consume SI state from the unified `usePatentPhysics` kernel bus.
5. **Fail-Closed Release Contract**: Zero-regression production deployment gate via `bun scripts/verified-production-deploy.ts` testing all publication contracts, typechecks, linter rules, and live smoke tests.

---

## 2. Granular Task & Domain Integration Matrix

### Domain A: Fluid Dynamics, Aerodynamics & Streamlines (`fs-lbm`, `fs-airfoil`, `fs-duct`, `fs-airflow`)

- [x] **Parsons Steam Turbine (`us-608969-parsons-turbine`)**
  - [x] Integrate `parsonsSteamCrate` fluid density sampling via `fluidFrames` and `sampleFluidAt`
  - [x] Feed dynamic velocity field into 3D rotor/stator particle streamlines in `ParsonsTurbine3D.tsx` and `parsonsTurbineModel.ts`
  - [x] Couple steam expansion pressure drop ($P_1 \to P_2$) across stages with blade deflection
  - [x] Add real-time enthalpy drop ($\Delta h$) and shaft power ($P = \dot{m}\Delta h$) readout in `StudioKernelChips`

- [x] **Lester Pelton Water Wheel (`us-233692-pelton-wheel`)**
  - [x] Integrate `peltonJetCrate` nozzle jet density sampling
  - [x] Drive 3D high-velocity water jet mesh and dual-cup bucket splitter dynamics in `PeltonWheel3D.tsx` and `peltonWheelModel.ts`
  - [x] Calculate impulse force $F = \dot{m}(v_{\text{jet}} - u)(1 - \cos\beta)$ and hydraulic efficiency $\eta = \frac{2u(v-u)(1 - \cos\beta)}{v^2}$
  - [x] Verify water droplet splash rebound trajectory with Euler/symplectic ballistic integration

- [x] **Carl Gustaf de Laval Cream Separator (`us-468383-delaval-separator`)**
  - [x] Integrate `delavalCreamCrate` multi-phase separation sampling
  - [x] Drive radial stratification gradient in 3D conical disk bowl in `DeLavalSeparator3D.tsx` and `delavalSeparatorModel.ts`
  - [x] Couple 6,000 RPM centrifugal acceleration $a_c = \omega^2 r$ with Stokes flotation velocity
  - [x] Add skim milk vs. cream outlet volumetric discharge balance

- [x] **John Ericsson Screw Propeller (`us-588-ericsson-propeller`)**
  - [x] Integrate `wakeFluidCrate` wake density sampling
  - [x] Bind helical slipstream downwash and thrust vortex shedding in `EricssonPropeller3D.tsx` and `ericssonPropellerModel.ts`
  - [x] Model propeller advance ratio $J = \frac{v_a}{n D}$ and cavitation threshold
  - [x] Update 2D `EricssonPropellerSim.tsx` with live wake vorticity streamlines

- [x] **James Watt Separate Condenser (`gb-913-watt-separate-condenser`)**
  - [x] Integrate transient steam condensation rate and cylinder vacuum formation ($P_{\text{vac}} = P_{\text{atm}} - P_{\text{sat}}(T)$)
  - [x] Articulate air pump reciprocating stroke and cold water injection spray in `WattSeparateCondenser3D.tsx`
  - [x] Verify thermal efficiency comparison against Newcomen atmospheric cycle

---

### Domain B: Thermodynamics, Heat Diffusion & Radiation (`fs-sparse`, `fs-conduction`, `fs-convection`)

- [x] **Thomas Edison Incandescent Lamp (`us-223898-edison-lightbulb`)**
  - [x] Integrate `edisonHeatCrate` filament heat diffusion via `computeEdisonFilamentThermalField`
  - [x] Bind temperature mesh diffusion ($T = (P / (\varepsilon \sigma A))^{1/4}$) to incandescent glow shaders in `EdisonBulb3D.tsx` and `edisonBulbModel.ts`
  - [x] Model temperature-dependent carbon resistance $R(T) = R_0(1 + \alpha \Delta T)$ and vacuum mean free path
  - [x] Add filament lifespan evaporation / bulb blackening rate prediction

- [x] **Albert Einstein & Leo Szilard Refrigerator (`us-1781541-einstein-refrigerator`)**
  - [x] Integrate `cycleHeatCrate` thermodynamic cycle heat sampling
  - [x] Drive ternary fluid phase distribution (ammonia absorption, butane evaporation, hydrogen carrier) in `EinsteinRefrigerator3D.tsx` and `einsteinRefrigeratorModel.ts`
  - [x] Model thermosiphon bubble lift pump fluid column elevation without moving parts
  - [x] Display real-time Coefficient of Performance ($\text{COP} = Q_L / Q_H$)

- [x] **Percy Spencer Cavity Magnetron Microwave (`us-2495429-spencer-microwave`)**
  - [x] Model 2.45 GHz resonant cavity standing wave electric field $\vec{E}(x, y, z)$
  - [x] Bind dielectric loss volumetric heating rate ($\dot{q} = 2\pi f \varepsilon'' \varepsilon_0 E^2$) to food target mesh in `SpencerMicrowave3D.tsx`
  - [x] Couple waveguide microwave power flux transmission and rotating turntable phase

- [x] **Charles Hall Aluminium Smelting (`us-400665-hall-aluminium`)**
  - [x] Model cryolite-alumina electrolytic bath molten cell thermal balance ($T \approx 950^\circ\text{C}$)
  - [x] Calculate Faraday electrolytic reduction rate ($\dot{m}_{\text{Al}} = \frac{I \cdot M}{z \cdot F}$)
  - [x] Drive carbon anode consumption and CO2 gas bubble nucleation dynamics in `HallAluminium3D.tsx`

- [x] **Norbert Rillieux Multiple-Effect Evaporator (`us-3237-rillieux-evaporator`)**
  - [x] Model cascading vacuum pressures across three evaporator stages ($P_1 > P_2 > P_3$)
  - [x] Couple latent heat of vaporization reuse ($\Delta H_{\text{vap}}$) and sugar juice concentration gradient ($\text{Brix}$)
  - [x] Drive boiling vapor streamline transfer and condensate drain pumps in `RillieuxEvaporator3D.tsx`

---

### Domain C: Multi-Body Dynamics, Mechanisms & PGA Screw Motor Orbits (`fs-mbd`, `fs-ga`, `fs-time`)

- [x] **Elias Howe Sewing Machine (`us-4750-howe-sewing-machine`)**
  - [x] Integrate `howeShaftCrate` and `howeCyclicFlex`
  - [x] Bind 4-bar linkage kinematics driving the curved needle arm, heart cam, and shuttle carrier in `HoweSewingMachine3D.tsx`
  - [x] Model thread loop formation, shuttle pass-through, and stitch take-up lever tension cycle
  - [x] Coordinate baster plate feed-dog intermittent step advance with needle dwell

- [x] **Richard Gatling Rotary Gun (`us-36836-gatling-gun`)**
  - [x] Integrate `gatlingClusterCrate` and `gatlingClusterKappa`
  - [x] Model stationary rear cylindrical cam track and 6 reciprocating lock bolts in `GatlingGun3D.tsx`
  - [x] Articulate gravity feed hopper cartridge drop, chamber seating, firing pin strike, and case extraction
  - [x] Connect cyclic barrel cluster harmonic vibration to barrel deflection

- [x] **Samuel Colt Revolver (`us-x9430-colt-revolver`)**
  - [x] Model pawl-and-ratchet cylinder indexing ($72^\circ$ rotation per cocking stroke) in `ColtRevolver3D.tsx`
  - [x] Articulate trigger sear engagement, cylinder locking bolt pop-up, and mainspring potential energy
  - [x] Calculate percussion cap ignition flame propagation into black powder chamber with `wave2dFrames` and `waveFrameRms`

- [x] **Ottmar Mergenthaler Linotype (`us-436532-mergenthaler-linotype`)**
  - [x] Integrate `mergenthalerMagCrate`
  - [x] Model magazine matrix release escapement, assembler front chute slide, and spaceband wedge line justification in `MergenthalerLinotype3D.tsx`
  - [x] Articulate casting pot molten lead pump stroke, mold disk rotation, and matrix distributor bar 7-tooth binary decoding

- [x] **Christopher Sholes Typewriter (`us-79265-sholes-typewriter`)**
  - [x] Integrate `sholesBasketCrate`
  - [x] Model circular type-basket radial lever linkage converging on central platen point in `SholesTypewriter3D.tsx`
  - [x] Articulate escapement ratchet carriage advance (1 character width per key strike) and ink ribbon spools

- [x] **Elisha Otis Elevator Safety Catch (`us-31128-otis-elevator`)**
  - [x] Integrate `otisSheaveCrate`
  - [x] Model heavy leaf spring tension relaxation on simulated cable failure in `OtisElevator3D.tsx`
  - [x] Articulate dual-sided wedge pawl deployment and ratchet guide rail teeth arrest

- [x] **George Corliss Four-Valve Steam Engine (`us-6162-corliss-steam-engine`)**
  - [x] Integrate `corlissValveCrate`
  - [x] Model central oscillating wrist-plate, 4 radial linkage rods, and rotary steam/exhaust valves in `CorlissSteamEngine3D.tsx`
  - [x] Articulate spring-loaded dashpot trip cut-off mechanism regulated by flyball governor

- [x] **Douglas Engelbart Coordinate Computer Mouse (`us-3541541-engelbart-mouse`)**
  - [x] Integrate `engelbartXyCrate`
  - [x] Model orthogonal dual knife-edge steel wheels rolling across flat tabletop in `EngelbartMouse3D.tsx`
  - [x] Calculate potentiometer wiper angles and 2D $(X, Y)$ coordinate pulse resolution

---

### Domain D: Electromagnetics, RF Oscillators & Wave Propagation (`fs-flux`, `fs-fft`, `fs-wave2d`)

- [x] **Nikola Tesla Polyphase AC Induction Motor (`us-381968-tesla-motor`)**
  - [x] Bind rotating stator magnetic flux vector via `gaMotorOrbit` and `gaMotorFrameIndex` in `TeslaMotor3D.tsx`
  - [x] Compute squirrel-cage induced rotor eddy currents $\vec{J} = \sigma(\vec{E} + \vec{v}\times\vec{B})$ and torque-slip curve
  - [x] Real-time quadrature phase angle and pole count re-configuration

- [x] **Nikola Tesla High-Potential Transformer / Tesla Coil (`us-593138-tesla-coil`)**
  - [x] Calculate quarter-wave helical secondary resonant frequency $f_0 = \frac{1}{2\pi\sqrt{L_2 C_2}}$ and voltage magnification $Q = \frac{\omega L_2}{R_2}$
  - [x] Bind primary spark-gap discharge shock pulses to secondary top-load electric field breakout in `TeslaCoil3D.tsx`
  - [x] Model primary-to-secondary magnetic mutual coupling coefficient $k = M / \sqrt{L_1 L_2}$

- [x] **Guglielmo Marconi Wireless Telegraphy (`us-586193-marconi-radio`)**
  - [x] Integrate `marconiWaveCrate`
  - [x] Model elevated vertical aerial antenna radiation impedance and ground return loop in `MarconiRadio3D.tsx`
  - [x] Synthesize damped RF spark wave trains ($v(t) = V_0 e^{-\alpha t} \cos(\omega t)$) and coherer metal filings decohesion

- [x] **Alexander Graham Bell Telephone (`us-174465-bell-telephone`)**
  - [x] Integrate `bellWaveCrate`
  - [x] Model iron diaphragm acoustic flexure under speech pressure waves in `BellTelephone3D.tsx`
  - [x] Calculate variable magnetic reluctance $R_{\text{mag}} = \frac{l}{\mu A}$ and undulating continuous electrical speech current

- [x] **Zénobe Gramme Continuous Current Dynamo (`us-120057-gramme-dynamo`)**
  - [x] Integrate `grammeRingCrate` and `grammeRingKappa` via `cyclicFlex`
  - [x] Model ring armature continuous winding tapped by 36 commutator bars in `GrammeDynamo3D.tsx`
  - [x] Calculate magnetic circuit flux distribution through annular iron ring core and commutator ripple voltage

- [x] **Peter Cooper Hewitt Mercury-Vapor Arc Lamp (`us-682690-hewitt-mercury-lamp`)**
  - [x] Model Townsend electron avalanche and mercury vapor ionization in `HewittMercuryLamp3D.tsx`
  - [x] Calculate dynamic negative resistance V-I curve and cathode pool evaporation rate
  - [x] Drive glowing plasma luminous efficacy (lumens/watt) and UV line spectrum emission

---

### Domain E: Continuum Mechanics, Polymers & Materials (`fs-truss`, `fs-solid`, `fs-lattice`, `topopt_frames`)

- [x] **Charles Goodyear Vulcanized Rubber (`us-3633-goodyear-rubber`)**
  - [x] Integrate `chainHeatCrate` via `heatFrames` and `sampleHeatAt`
  - [x] Model 6 polyisoprene chains interconnected by 14 sulfur cross-link bridges in `GoodyearRubber3D.tsx`
  - [x] Calculate rubber elasticity from conformational entropy reduction ($\sigma = N k T (\lambda - \lambda^{-2})$)
  - [x] Real-time stress-strain curve with temperature dependency

- [x] **Stephanie Kwolek Kevlar Aramid Fibers (`us-3671542-kwolek-kevlar`)**
  - [x] Model liquid-crystalline poly-p-phenylene terephthalamide hydrogen-bonded planar sheet lattice in `KwolekKevlar3D.tsx`
  - [x] Calculate extreme longitudinal tensile modulus ($E = 130\ \text{GPa}$) vs. weak transverse shear
  - [x] Simulate ballistic projectile impact energy absorption and molecular chain rupture

- [x] **Count von Zeppelin Rigid Airship (`us-621195-zeppelin-airship`)**
  - [x] Integrate `liftHeatCrate`
  - [x] Model 16 longitudinal triangular duralumin lattice girders and transverse ring frames in `ZeppelinAirship3D.tsx`
  - [x] Calculate hydrostatic lift across 17 hydrogen gas cells ($\Delta F_b = (\rho_{\text{air}} - \rho_{\text{H}_2}) g V$)
  - [x] Bending moment and shear force distribution under pitch gusts

- [x] **Joseph Glidden Barbed Wire (`us-157124-glidden-barbed-wire`)**
  - [x] Integrate `gliddenFlyerCrate`
  - [x] Model double-strand helical wire twisting and 4-point spur locking in `GliddenBarbedWire3D.tsx`
  - [x] Calculate torsional shear stress $\tau = \frac{T r}{J}$ and plastic deformation locking threshold

---

### Domain F: Solid-State Semiconductors, Microelectronics & Digital Architectures (`fs-lattice`, `fs-ad`)

- [x] **John Bardeen & Walter Brattain Point-Contact Transistor (`us-2524035-bardeen-transistor`)**
  - [x] Model germanium N-type crystal substrate and dual phosphor-bronze point whiskers in `BardeenTransistor3D.tsx`
  - [x] Calculate minority hole carrier injection across 50 µm spacing and current amplification $\alpha = \Delta I_c / \Delta I_e$
  - [x] Dynamic signal waveform amplification from emitter input to collector output

- [x] **Robert Noyce Monolithic Silicon Planar IC (`us-2981877-noyce-ic`)**
  - [x] Model silicon dioxide ($\text{SiO}_2$) surface passivation and vapor-deposited aluminum lead interconnects in `NoycePlanarIC3D.tsx`
  - [x] Calculate PN junction reverse-bias depletion barrier width and capacitance via `Dual` forward-mode AD
  - [x] Dynamic clock signal propagation through monolithic planar transistors

- [x] **Jack Kilby Miniaturized Electronic Circuit (`us-3138743-kilby-integrated-circuit`)**
  - [x] Model bulk germanium wafer resistors, PN junction mesa capacitors, and gold wire bonds in `KilbyIntegratedCircuit3D.tsx`
  - [x] Calculate propagation delay ($\tau = R C$), maximum clock frequency, and component packing density

- [x] **Willard Boyle & George Smith Charge-Coupled Device (`us-3858232-boyle-smith-ccd`)**
  - [x] Model 3-phase ($\phi_1, \phi_2, \phi_3$) MOS potential well bucket-brigade packet transfer in `BoyleSmithCcd3D.tsx` via `computeCcdPotentialWellField`
  - [x] Calculate charge transfer efficiency ($\text{CTE} \ge 0.9999$) and photon-to-electron photo-generation
  - [x] Animate serial shift register pixel readout

- [x] **Steve Wozniak Apple II Microcomputer (`us-4136359-wozniak-apple`)**
  - [x] Model two-phase non-conflicting time-multiplexed DRAM bus arbitration in `WozniakApple3D.tsx`
  - [x] Calculate 14.31818 MHz master clock division into 1.023 MHz CPU clock and 3.58 MHz NTSC color burst
  - [x] Animate interleaved CPU read/write vs. video scanline memory access without wait-states

---

## 3. Verification & Compliance Gates

- [x] Full test suite (1,366/1,366 tests pass across 259 files).
- [x] Strict typecheck (`bun run typecheck` passes with zero errors).
- [x] Comprehensive lint and code formatting (`bun run lint` passes across all 816 files with zero errors).
- [x] Verified production deployment pipeline executed and live on `https://classic-patents.com` with 100% HTTP 200 health check confirmations.
