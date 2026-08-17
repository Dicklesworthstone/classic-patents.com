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
- [ ] **Goddard Liquid Rocket (US 1,155,986)**
  - [ ] De Laval supersonic isentropic nozzle expansion ($M = v/a$)
  - [ ] Combustion chamber pressure ($P_c$) and specific impulse ($I_{sp}$) calculations
  - [ ] Gyroscopic steering vane deflection physics

### Domain 2: Electromagnetics & Resonant LC Oscillators
- [x] **Tesla Polyphase AC Induction Motor (US 381,968)**
  - [x] Rotating stator magnetic flux field vector $\vec{B}(t) = B_0(\cos\omega t\,\hat{i} + \sin\omega t\,\hat{j})$
  - [x] Rotor slip calculation ($s = \frac{n_s - n}{n_s}$) and induced electromagnetic torque
  - [x] Interactive AC frequency, pole count, and load torque controllers
- [ ] **Tesla High-Frequency Resonant Transformer (US 533,367)**
  - [ ] Dual-resonant coupled LC tank oscillations ($L_1 C_1 \approx L_2 C_2$)
  - [ ] Spark-gap ionization breakdown kinetics and voltage multiplication ($V_2 = V_1 \sqrt{L_2 / L_1}$)
  - [ ] Electric field streamer ionization geometry
- [ ] **Alexander Graham Bell Telephone (US 174,465)**
  - [ ] Variable resistance diaphragm acoustic transfer function
  - [ ] Undulating continuous electrical speech current waveform synthesis
  - [ ] Live Web Audio acoustic synthesizer coupling
- [ ] **Guglielmo Marconi Wireless Telegraphy (US 586,193)**
  - [ ] Spark-gap RF damped wave train generation
  - [ ] Elevated monopole aerial radiation impedance and ground return loop
- [ ] **Samuel Morse Electro-Magnetic Telegraph (US 1,647)**
  - [ ] Solenoid coil inductance time constant ($\tau = L/R$)
  - [ ] Armature magnetic attraction force ($F = \frac{B^2 A}{2\mu_0}$) and mechanical return spring

### Domain 3: Solid-State, CMOS & Microarchitecture
- [ ] **John Bardeen & Walter Brattain Transistor (US 2,569,347)**
  - [ ] Germanium point-contact hole injection dynamics
  - [ ] Emitter-to-collector current gain factor ($\alpha = \Delta I_c / \Delta I_e$)
  - [ ] Dynamic signal amplification curve and bias point
- [ ] **Robert Noyce Monolithic Planar IC (US 2,981,877)**
  - [ ] PN junction depletion barrier capacitance ($C_j$) and built-in potential
  - [ ] Planar silicon dioxide ($\text{SiO}_2$) surface passivation isolation
  - [ ] Vapor-deposited aluminum lead interconnect resistance
- [ ] **Boyle & Smith 3-Phase CCD (US 3,923,554)**
  - [ ] 3-phase clocking MOS potential well charge packet bucket-brigade transfer
  - [ ] Charge transfer efficiency ($\text{CTE} \ge 0.9999$)
  - [ ] Photodiode photon-to-electron well filling
- [ ] **Steve Wozniak Apple II Microcomputer (US 4,136,359)**
  - [ ] Two-phase ($\phi_1 / \phi_2$) non-conflicting time-multiplexed DRAM bus arbitration
  - [ ] Zero-wait-state CPU read/write vs. video scanline memory access
  - [ ] 14.31818 MHz master crystal divider and NTSC color burst phase generator
- [ ] **Philo Farnsworth Electronic Television (US 1,773,980)**
  - [ ] Cylindrical dissector tube photo-cathode electron emission
  - [ ] Relativistic Lorentz force magnetic deflection raster ($\vec{F} = q(\vec{E} + \vec{v}\times\vec{B})$)
  - [ ] Anode aperture scanline intensity sampling

### Domain 4: Thermodynamics, Heat & Phase Transport
- [ ] **Thomas Edison Incandescent Carbon Lamp (US 223,898)**
  - [ ] Stefan-Boltzmann radiative blackbody emission ($P = \varepsilon \sigma A T^4$)
  - [ ] High-vacuum molecular mean free path and filament sublimation prevention
  - [ ] Temperature-dependent carbon filament resistance ($R(T) = R_0(1 + \alpha \Delta T)$)
- [ ] **Albert Einstein & Leo Szilard Refrigerator (US 1,781,541)**
  - [ ] Dalton partial pressure ternary gas-fluid absorption cycle ($NH_3 + H_2O + \text{butane}$)
  - [ ] Non-mechanical thermosiphon bubble lift pump
  - [ ] Thermodynamic Coefficient of Performance (COP) evaluation
- [ ] **Percy Spencer Cavity Magnetron Microwave (US 2,495,429)**
  - [ ] Anode resonant cavity standing wave electromagnetic distribution (2.45 GHz)
  - [ ] Dielectric loss dipole water molecule heating rate ($\dot{q} = 2\pi f \varepsilon'' \varepsilon_0 E^2$)
  - [ ] Waveguide microwave energy propagation

### Domain 5: Nuclear Reactor Criticality & Neutron Kinetics
- [ ] **Enrico Fermi & Leo Szilard Neutronic Reactor (US 2,708,656)**
  - [ ] 6-group delayed neutron precursor point kinetics:
    $$\frac{dn}{dt} = \frac{\rho - \beta}{\Lambda} n + \sum_{i=1}^6 \lambda_i C_i$$
  - [ ] Graphite moderator thermalization and uranium lattice resonance escape probability ($p$)
  - [ ] Cadmium control rod absorption cross-section ($\sigma_a = 2520\ \text{barns}$) and criticality index ($k_{\text{eff}}$)

### Domain 6: Continuum Mechanics, Polymers & Mechanisms
- [ ] **Charles Goodyear Vulcanized Rubber (US 3,633)**
  - [ ] Sulfur bridge polymer cross-linking lattice entropy elasticity
  - [ ] Arrhenius temperature-dependent cross-link formation kinetics
- [ ] **Stephanie Kwolek Kevlar Aramid Fibers (US 3,671,542)**
  - [ ] Liquid-crystalline poly-p-phenylene terephthalamide hydrogen-bonded polymer chains
  - [ ] Extreme tensile modulus ($E = 130\ \text{GPa}$) and stress-strain rupture threshold
- [ ] **Elias Howe Sewing Machine (US 4,750)**
  - [ ] Eye-pointed needle thread loop penetration and oscillating shuttle lockstitch capture
  - [ ] Camshaft and feed-dog synchronization kinematics
- [ ] **Douglas Engelbart Coordinate Computer Mouse (US 3,541,541)**
  - [ ] Orthogonal knife-edge dual wheels planar coordinate resolver kinematics
  - [ ] Potentiometer resistance wiper angle to $(X, Y)$ screen cursor position
- [ ] **Abraham Lincoln Buoying Vessels (US 6,281)**
  - [ ] Expandable air chamber hydrostatic buoyant lift ($\Delta F_b = \rho_{\text{water}} g \Delta V$)
  - [ ] River shoal draft reduction and pneumatic shaft synchronization
- [ ] **Hedy Lamarr & George Antheil Spread Spectrum (US 2,292,387)**
  - [ ] 88-frequency piano-roll slotted paper tape synchronization
  - [ ] Pseudo-random carrier frequency hopping and anti-jamming SNR gain

---

## 2. Universal Infrastructure & Visual Polish
- [x] Procedural Daylight Azure Sky & 3D Cumulus Clouds Engine
- [x] Clean Light/Dark Theme Switching with Contrast Preservation
- [x] Dynamic Lazy-Loading Code-Splitting (198 kB Initial JS Payload)
- [x] URL Search Parameter State Synchronization (`?view=...`)
- [x] Satori & Next.js ImageResponse OpenGraph/Twitter Social Cards
- [x] Complete Unredacted Specifications & Verified USPTO Original PDFs
- [ ] Universal Physics Telemetry HUD Component
- [ ] Blake3 Deterministic State Replay Serializer
