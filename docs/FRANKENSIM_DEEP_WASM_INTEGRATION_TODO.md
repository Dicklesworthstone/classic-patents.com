# Deep FrankenSim WebAssembly Physics Integration: Master Execution & Tracking Ledger

This document tracks the end-to-end, domain-by-domain integration of the **FrankenSim** computational physics engine (`~/projects/frankensim/crates`) into **Classic Patents** (`classic-patents.com`).

---

## 1. Architectural Invariants & Doctrine

1. **Audited Physics Integrity**: No pseudo-physics or fake random oscillations. Visual simulations must derive their motion, state transitions, streamline trajectories, temperature gradients, and electromagnetic fields from real physical laws in SI units.
2. **Deterministic Replay Boundary**: Physics state must be deterministic given initial conditions and control parameters. Never seed visual physics from `Math.random()`, `Date.now()`, or uncontrolled ambient clocks.
3. **FrankenSim WASM Kernel Source Truth**: `genericKernelSource()` and `usePatentPhysics()` report `"wasm"` only when the compiled WebAssembly module is genuinely instantiated and stepping in the browser runtime; otherwise, fallback to identical typed host mathematics.
4. **Single Shared Physics Bus**: 3D Three.js studios, 2D vector schematics, HUD telemetry badges, and claim decoders consume SI state from the unified `usePatentPhysics` kernel bus.

---

## 2. Granular Task & Domain Integration Matrix

### Domain A: Fluid Dynamics, Aerodynamics & Streamlines (`fs-lbm`, `fs-airfoil`, `fs-duct`, `fs-airflow`)

- [ ] **Parsons Steam Turbine (`us-608969-parsons-turbine`)**
  - [x] Integrate `parsonsSteamCrate` fluid density sampling
  - [ ] Feed dynamic velocity field into 3D rotor/stator particle streamlines in `ParsonsTurbine3D.tsx`
  - [ ] Couple steam expansion pressure drop ($P_1 \to P_2$) across stages with blade deflection
  - [ ] Add real-time enthalpy drop ($\Delta h$) and shaft power ($P = \dot{m}\Delta h$) readout

- [ ] **Lester Pelton Water Wheel (`us-233692-pelton-wheel`)**
  - [x] Integrate `peltonJetCrate` nozzle jet density sampling
  - [ ] Drive 3D high-velocity water jet mesh and dual-cup bucket splitter dynamics in `PeltonWheel3D.tsx`
  - [ ] Calculate impulse force $F = \dot{m}(v_{\text{jet}} - u)(1 - \cos\beta)$ and hydraulic efficiency $\eta = \frac{2u(v-u)(1 - \cos\beta)}{v^2}$
  - [ ] Verify water droplet splash rebound trajectory with Euler/symplectic ballistic integration

- [ ] **Carl Gustaf de Laval Cream Separator (`us-468383-delaval-separator`)**
  - [x] Integrate `delavalCreamCrate` multi-phase separation sampling
  - [ ] Drive radial stratification gradient in 3D conical disk bowl in `DeLavalSeparator3D.tsx`
  - [ ] Couple 6,000 RPM centrifugal acceleration $a_c = \omega^2 r$ with Stokes flotation velocity
  - [ ] Add skim milk vs. cream outlet volumetric discharge balance

- [ ] **John Ericsson Screw Propeller (`us-588-ericsson-propeller`)**
  - [x] Integrate `wakeFluidCrate` wake density sampling
  - [ ] Bind helical slipstream downwash and thrust vortex shedding in `EricssonPropeller3D.tsx`
  - [ ] Model propeller advance ratio $J = \frac{v_a}{n D}$ and cavitation threshold
  - [ ] Update 2D `EricssonPropellerSim.tsx` with live wake vorticity streamlines

- [ ] **James Watt Separate Condenser (`gb-913-watt-separate-condenser`)**
  - [ ] Integrate transient steam condensation rate and cylinder vacuum formation ($P_{\text{vac}} = P_{\text{atm}} - P_{\text{sat}}(T)$)
  - [ ] Articulate air pump reciprocating stroke and cold water injection spray
  - [ ] Verify thermal efficiency comparison against Newcomen atmospheric cycle

---

### Domain B: Thermodynamics, Heat Diffusion & Radiation (`fs-sparse`, `fs-conduction`, `fs-convection`)

- [ ] **Thomas Edison Incandescent Lamp (`us-223898-edison-lightbulb`)**
  - [x] Integrate `edisonHeatCrate` filament heat diffusion
  - [ ] Bind temperature mesh diffusion ($T = (P / (\varepsilon \sigma A))^{1/4}$) to incandescent glow shaders in `EdisonBulb3D.tsx`
  - [ ] Model temperature-dependent carbon resistance $R(T) = R_0(1 + \alpha \Delta T)$ and vacuum mean free path
  - [ ] Add filament lifespan evaporation / bulb blackening rate prediction

- [ ] **Albert Einstein & Leo Szilard Refrigerator (`us-1781541-einstein-refrigerator`)**
  - [x] Integrate `cycleHeatCrate` thermodynamic cycle heat sampling
  - [ ] Drive ternary fluid phase distribution (ammonia absorption, butane evaporation, hydrogen carrier) in `EinsteinRefrigerator3D.tsx`
  - [ ] Model thermosiphon bubble lift pump fluid column elevation without moving parts
  - [ ] Display real-time Coefficient of Performance ($\text{COP} = Q_L / Q_H$)

- [ ] **Percy Spencer Cavity Magnetron Microwave (`us-2495429-spencer-microwave`)**
  - [ ] Model 2.45 GHz resonant cavity standing wave electric field $\vec{E}(x, y, z)$
  - [ ] Bind dielectric loss volumetric heating rate ($\dot{q} = 2\pi f \varepsilon'' \varepsilon_0 E^2$) to food target mesh in `SpencerMicrowave3D.tsx`
  - [ ] Couple waveguide microwave power flux transmission and rotating turntable phase

- [ ] **Charles Hall Aluminium Smelting (`us-400665-hall-aluminium`)**
  - [ ] Model cryolite-alumina electrolytic bath molten cell thermal balance ($T \approx 950^\circ\text{C}$)
  - [ ] Calculate Faraday electrolytic reduction rate ($\dot{m}_{\text{Al}} = \frac{I \cdot M}{z \cdot F}$)
  - [ ] Drive carbon anode consumption and CO2 gas bubble nucleation dynamics in `HallAluminium3D.tsx`

- [ ] **Norbert Rillieux Multiple-Effect Evaporator (`us-3237-rillieux-evaporator`)**
  - [ ] Model cascading vacuum pressures across three evaporator stages ($P_1 > P_2 > P_3$)
  - [ ] Couple latent heat of vaporization reuse ($\Delta H_{\text{vap}}$) and sugar juice concentration gradient ($\text{Brix}$)
  - [ ] Drive boiling vapor streamline transfer and condensate drain pumps in `RillieuxEvaporator3D.tsx`

---

### Domain C: Multi-Body Dynamics, Mechanisms & PGA Screw Motor Orbits (`fs-mbd`, `fs-ga`, `fs-time`)

- [ ] **Elias Howe Sewing Machine (`us-4750-howe-sewing-machine`)**
  - [x] Integrate `howeShaftCrate` and `howeCyclicFlex`
  - [ ] Bind 4-bar linkage kinematics driving the curved needle arm, heart cam, and shuttle carrier in `HoweSewingMachine3D.tsx`
  - [ ] Model thread loop formation, shuttle pass-through, and stitch take-up lever tension cycle
  - [ ] Coordinate baster plate feed-dog intermittent step advance with needle dwell

- [ ] **Richard Gatling Rotary Gun (`us-36836-gatling-gun`)**
  - [x] Integrate `gatlingClusterCrate` and `gatlingClusterKappa`
  - [ ] Model stationary rear cylindrical cam track and 6 reciprocating lock bolts in `GatlingGun3D.tsx`
  - [ ] Articulate gravity feed hopper cartridge drop, chamber seating, firing pin strike, and case extraction
  - [ ] Connect cyclic barrel cluster harmonic vibration to barrel deflection

- [ ] **Samuel Colt Revolver (`us-x9430-colt-revolver`)**
  - [ ] Model pawl-and-ratchet cylinder indexing ($60^\circ$ rotation per cocking stroke) in `ColtRevolver3D.tsx`
  - [ ] Articulate trigger sear engagement, cylinder locking bolt pop-up, and mainspring potential energy
  - [ ] Calculate percussion cap ignition flame propagation into black powder chamber

- [ ] **Ottmar Mergenthaler Linotype (`us-436532-mergenthaler-linotype`)**
  - [x] Integrate `mergenthalerMagCrate`
  - [ ] Model magazine matrix release escapement, assembler front chute slide, and spaceband wedge line justification in `MergenthalerLinotype3D.tsx`
  - [ ] Articulate casting pot molten lead pump stroke, mold disk rotation, and matrix distributor bar 7-tooth binary decoding

- [ ] **Christopher Sholes Typewriter (`us-79265-sholes-typewriter`)**
  - [x] Integrate `sholesBasketCrate`
  - [ ] Model circular type-basket radial lever linkage converging on central platen point in `SholesTypewriter3D.tsx`
  - [ ] Articulate escapement ratchet carriage advance (1 character width per key strike) and ink ribbon spools

- [ ] **Elisha Otis Elevator Safety Catch (`us-31128-otis-elevator`)**
  - [x] Integrate `otisSheaveCrate`
  - [ ] Model heavy leaf spring tension relaxation on simulated cable failure in `OtisElevator3D.tsx`
  - [ ] Articulate dual-sided wedge pawl deployment and ratchet guide rail teeth arrest

- [ ] **George Corliss Four-Valve Steam Engine (`us-6162-corliss-steam-engine`)**
  - [x] Integrate `corlissValveCrate`
  - [ ] Model central oscillating wrist-plate, 4 radial linkage rods, and rotary steam/exhaust valves in `CorlissSteamEngine3D.tsx`
  - [ ] Articulate spring-loaded dashpot trip cut-off mechanism regulated by flyball governor

- [ ] **Douglas Engelbart Coordinate Computer Mouse (`us-3541541-engelbart-mouse`)**
  - [x] Integrate `engelbartXyCrate`
  - [ ] Model orthogonal dual knife-edge steel wheels rolling across flat tabletop in `EngelbartMouse3D.tsx`
  - [ ] Calculate potentiometer wiper angles and 2D $(X, Y)$ coordinate pulse resolution

---

### Domain D: Electromagnetics, RF Oscillators & Wave Propagation (`fs-flux`, `fs-fft`, `fs-wave2d`)

- [ ] **Nikola Tesla Polyphase AC Induction Motor (`us-381968-tesla-motor`)**
  - [ ] Bind rotating stator magnetic flux vector $\vec{B}(t) = B_0(\cos\omega t\,\hat{i} + \sin\omega t\,\hat{j})$ in `TeslaMotor3D.tsx`
  - [ ] Compute squirrel-cage induced rotor eddy currents $\vec{J} = \sigma(\vec{E} + \vec{v}\times\vec{B})$ and torque-slip curve $\tau(s) = \frac{2\tau_{\max}}{s/s_{\max} + s_{\max}/s}$
  - [ ] Real-time quadrature phase angle and pole count re-configuration

- [ ] **Nikola Tesla High-Potential Transformer / Tesla Coil (`us-593138-tesla-coil`)**
  - [ ] Calculate quarter-wave helical secondary resonant frequency $f_0 = \frac{1}{2\pi\sqrt{L_2 C_2}}$ and voltage magnification $Q = \frac{\omega L_2}{R_2}$
  - [ ] Bind primary spark-gap discharge shock pulses to secondary top-load electric field breakout in `TeslaCoil3D.tsx`
  - [ ] Model primary-to-secondary magnetic mutual coupling coefficient $k = M / \sqrt{L_1 L_2}$

- [ ] **Guglielmo Marconi Wireless Telegraphy (`us-586193-marconi-radio`)**
  - [x] Integrate `marconiWaveCrate`
  - [ ] Model elevated vertical aerial antenna radiation impedance and ground return loop in `MarconiRadio3D.tsx`
  - [ ] Synthesize damped RF spark wave trains ($v(t) = V_0 e^{-\alpha t} \cos(\omega t)$) and coherer metal filings decohesion

- [ ] **Alexander Graham Bell Telephone (`us-174465-bell-telephone`)**
  - [x] Integrate `bellWaveCrate`
  - [ ] Model iron diaphragm acoustic flexure under speech pressure waves in `BellTelephone3D.tsx`
  - [ ] Calculate variable magnetic reluctance $R_{\text{mag}} = \frac{l}{\mu A}$ and undulating continuous electrical speech current

- [ ] **Zénobe Gramme Continuous Current Dynamo (`us-120057-gramme-dynamo`)**
  - [x] Integrate `grammeRingCrate` and `grammeRingKappa`
  - [ ] Model ring armature continuous winding tapped by 36 commutator bars in `GrammeDynamo3D.tsx`
  - [ ] Calculate magnetic circuit flux distribution through annular iron ring core and commutator ripple voltage

- [ ] **Peter Cooper Hewitt Mercury-Vapor Arc Lamp (`us-682690-hewitt-mercury-lamp`)**
  - [ ] Model Townsend electron avalanche and mercury vapor ionization in `HewittMercuryLamp3D.tsx`
  - [ ] Calculate dynamic negative resistance V-I curve and cathode pool evaporation rate
  - [ ] Drive glowing plasma luminous efficacy (lumens/watt) and UV line spectrum emission

---

### Domain E: Continuum Mechanics, Polymers & Materials (`fs-truss`, `fs-solid`, `fs-lattice`, `topopt_frames`)

- [ ] **Charles Goodyear Vulcanized Rubber (`us-3633-goodyear-rubber`)**
  - [x] Integrate `chainHeatCrate`
  - [ ] Model 6 polyisoprene chains interconnected by 14 sulfur cross-link bridges in `GoodyearRubber3D.tsx`
  - [ ] Calculate rubber elasticity from conformational entropy reduction ($\sigma = N k T (\lambda - \lambda^{-2})$)
  - [ ] Real-time stress-strain curve with temperature dependency

- [ ] **Stephanie Kwolek Kevlar Aramid Fibers (`us-3671542-kwolek-kevlar`)**
  - [ ] Model liquid-crystalline poly-p-phenylene terephthalamide hydrogen-bonded planar sheet lattice in `KwolekKevlar3D.tsx`
  - [ ] Calculate extreme longitudinal tensile modulus ($E = 130\ \text{GPa}$) vs. weak transverse shear
  - [ ] Simulate ballistic projectile impact energy absorption and molecular chain rupture

- [ ] **Count von Zeppelin Rigid Airship (`us-621195-zeppelin-airship`)**
  - [x] Integrate `liftHeatCrate`
  - [ ] Model 16 longitudinal triangular duralumin lattice girders and transverse ring frames in `ZeppelinAirship3D.tsx`
  - [ ] Calculate hydrostatic lift across 17 hydrogen gas cells ($\Delta F_b = (\rho_{\text{air}} - \rho_{\text{H}_2}) g V$)
  - [ ] Bending moment and shear force distribution under pitch gusts

- [ ] **Joseph Glidden Barbed Wire (`us-157124-glidden-barbed-wire`)**
  - [x] Integrate `gliddenFlyerCrate`
  - [ ] Model double-strand helical wire twisting and 4-point spur locking in `GliddenBarbedWire3D.tsx`
  - [ ] Calculate torsional shear stress $\tau = \frac{T r}{J}$ and plastic deformation locking threshold

---

### Domain F: Solid-State Semiconductors, Microelectronics & Digital Architectures (`fs-lattice`, `fs-ad`)

- [ ] **John Bardeen & Walter Brattain Point-Contact Transistor (`us-2524035-bardeen-transistor`)**
  - [ ] Model germanium N-type crystal substrate and dual phosphor-bronze point whiskers in `BardeenTransistor3D.tsx`
  - [ ] Calculate minority hole carrier injection across 50 µm spacing and current amplification $\alpha = \Delta I_c / \Delta I_e$
  - [ ] Dynamic signal waveform amplification from emitter input to collector output

- [ ] **Robert Noyce Monolithic Silicon Planar IC (`us-2981877-noyce-ic`)**
  - [ ] Model silicon dioxide ($\text{SiO}_2$) surface passivation and vapor-deposited aluminum lead interconnects in `NoycePlanarIC3D.tsx`
  - [ ] Calculate PN junction reverse-bias depletion barrier width and capacitance
  - [ ] Dynamic clock signal propagation through monolithic planar transistors

- [ ] **Jack Kilby Miniaturized Electronic Circuit (`us-3138743-kilby-integrated-circuit`)**
  - [ ] Model bulk germanium wafer resistors, PN junction mesa capacitors, and gold wire bonds in `KilbyIntegratedCircuit3D.tsx`
  - [ ] Calculate propagation delay ($\tau = R C$), maximum clock frequency, and component packing density

- [ ] **Willard Boyle & George Smith Charge-Coupled Device (`us-3858232-boyle-smith-ccd`)**
  - [ ] Model 3-phase ($\phi_1, \phi_2, \phi_3$) MOS potential well bucket-brigade packet transfer in `BoyleSmithCcd3D.tsx`
  - [ ] Calculate charge transfer efficiency ($\text{CTE} \ge 0.9999$) and photon-to-electron photo-generation
  - [ ] Animate serial shift register pixel readout

- [ ] **Steve Wozniak Apple II Microcomputer (`us-4136359-wozniak-apple`)**
  - [ ] Model two-phase non-conflicting time-multiplexed DRAM bus arbitration in `WozniakApple3D.tsx`
  - [ ] Calculate 14.31818 MHz master clock division into 1.023 MHz CPU clock and 3.58 MHz NTSC color burst
  - [ ] Animate interleaved CPU read/write vs. video scanline memory access without wait-states

---

## 3. Verification & Compliance Gates

- [ ] Every modified 3D visualization must pass typecheck (`bun run typecheck`) and linter (`bun run lint`).
- [ ] Determinism tests (`bun test src/components/patents/visuals/three/determinism.test.ts`) must pass with 0 failures.
- [ ] Per-patent visual tests (`bun test`) must verify pure procedural geometry, deterministic frame loops, and authentic SI physics.
- [ ] Execute `bun scripts/verified-production-deploy.ts` upon completing integration milestones.
