# Deep FrankenSim WASM Integration: Comprehensive Master Tracker & Roadmap

This document serves as the granular, step-by-step implementation plan and living TODO tracker for deepening the **FrankenSim** WebAssembly physics engine (`~/projects/frankensim`) integration across **Classic Patents** (`classic-patents.com`).

---

## Architecture Principles & Invariants

1. **The Kernel Is the Sole Author of Pose, Field, and Refusal**:
   The presentation layer (React Three Fiber, Three.js WebGL, 2D HTML5 Canvas, SVG schematics, audio synthesizers, telemetry HUDs) is strictly a projector of SI state emitted by FrankenSim kernels.
2. **Zero Ambient Randomness & 100% Determinism**:
   Every visual frame, streamline coordinate, and audio packet is derived deterministically from the step clock and Blake3 state digests. Never use `Math.random()`, `Date.now()`, or unseeded floating point jitter.
3. **Authentic Physics Refusal Boundaries**:
   If parameters violate physical laws (e.g. supersonic flow in a subsonic nozzle, de Laval over-expansion shock, mean free path breakdown in a compromised vacuum, or supercritical neutron runaway without delayed neutron margin), the kernel enters a typed refusal state rather than drawing visual nonsense.
4. **Dual Projection & Pedagogical Rigor**:
   Interactive visuals must explain genuine physical laws (aerodynamic induced drag, Maxwell vector flux, point-contact hole diffusion, 6-group delayed neutron kinetics, and Stefan-Boltzmann blackbody radiation) in rigorous SI units with colorized equations and sensitivity derivatives.

---

## Master Task Tracker & Implementation Phases

### Phase 1: Zero-Copy Streamline, Lattice & Field Texture Bridge (`fs-wasm`, `fs-flux`, `fs-conduction`, `fs-airflow`)
- [ ] **1.1. Procedural 2D/3D Scalar & Vector Field `DataTexture` Generators**:
  - [ ] Implement `createFieldDataTexture(gridSize, numChannels)` helper in `src/physics/fieldTextures.ts`.
  - [ ] Wire `heatFrames` / Fourier thermal diffusion grid directly into `THREE.DataTexture` for **Thomas Edison Incandescent Lamp (US 223,898)**.
  - [ ] Wire 2D potential well profiles $\Phi(x, y)$ into `THREE.DataTexture` for **Boyle-Smith CCD (US 3,858,232)** and **Noyce Planar IC (US 2,981,877)**.
  - [ ] Wire 3D spatial neutron flux $\phi(x,y,z)$ from 6-group delayed neutron diffusion into graphite moderator/fuel lattice for **Enrico Fermi Nuclear Reactor (US 2,708,656)**.
- [ ] **1.2. Zero-Copy Magnetic & Fluid Streamline Vertex Streaming**:
  - [ ] Implement zero-copy buffer mapper `streamlineBufferFromKernel(samples, nLines, pointsPerLine)` for Three.js `LineSegments` and `BufferGeometry`.
  - [ ] Connect `fs-flux` rotating stator vector field to live streamlines in **Tesla AC Motor (US 381,968)** and **Tesla High-Potential Transformer (US 593,138)**.
  - [ ] Connect `fs-airflow` vortex panel / stream-function streamlines over cambered aerofoils in **Wright Flyer (US 821,393)**.
  - [ ] Connect `fs-lbm` steam expansion streamlines across moving blade rows in **Parsons Steam Turbine (US 608,969)** and **De Laval Separator (US 247,804)**.

---

### Phase 2: Automatic Differentiation (AD) & Live Sensitivity HUD (`fs-ad`, `fs-qty`)
- [ ] **2.1. Forward-Mode AD Sensitivity Kernel**:
  - [ ] Create `src/physics/sensitivityKernel.ts` with forward dual-number arithmetic $[x, \dot{x}]$ for live $\frac{\partial Q}{\partial u}$ evaluation.
  - [ ] Register partial derivatives for key domain parameters across all catalog patents:
    - Wright Flyer: $\frac{\partial N}{\partial \delta_{\text{warp}}}$ (adverse yaw sensitivity), $\frac{\partial L}{\partial \delta_{\text{warp}}}$ (roll authority).
    - Tesla AC Motor: $\frac{\partial \tau}{\partial f}$ (torque-frequency slope), $\frac{\partial s}{\partial \tau_{\text{load}}}$ (slip stiffness).
    - Edison Lamp: $\frac{\partial P_{\text{rad}}}{\partial V}$ (radiant power voltage sensitivity), $\frac{\partial T}{\partial V}$ (filament thermal response).
    - Spencer Microwave: $\frac{\partial B_c}{\partial V_a}$ (Hull magnetic cutoff gradient).
    - Kilby IC / Noyce Planar IC: $\frac{\partial C_j}{\partial V_r}$ (depletion capacitance voltage sensitivity).
- [ ] **2.2. Interactive `<SensitivitySlider />` UI Component**:
  - [ ] Build reusable interactive slider component in `src/components/ui/SensitivitySlider.tsx` displaying live derivative badge ($\frac{\partial Q}{\partial u}$) on hover/drag.
  - [ ] Integrate `<SensitivitySlider />` into 2D simulators and 3D studio control bars.

---

### Phase 3: Universal Port-Hamiltonian Energy Ledger (`fs-phs`, `fs-time`)
- [ ] **3.1. Universal Energy Ledger State & Dirac Structure Engine**:
  - [ ] Implement `computePortHamiltonianState(patentId, params, state, dt)` in `src/physics/energyLedger.ts`.
  - [ ] Compute total stored energy $H(q, p) = T(p) + V(q)$, power input $P_{\text{in}} = \mathbf{u}^\top \mathbf{y}$, dissipated power $D(x) \ge 0$, and supply defect $|\Delta H - (P_{\text{in}} - D)\Delta t|$.
- [ ] **3.2. Universal `<PortHamiltonianEnergyStrip />` Component**:
  - [ ] Build `<PortHamiltonianEnergyStrip />` in `src/components/patents/visuals/PortHamiltonianEnergyStrip.tsx`.
  - [ ] Display live energy gauge bar (Kinetic $T$, Potential $V$, Magnetic $W_m$, Electrostatic $W_e$, Thermal $Q$), power flow $P_{\text{in}}$, dissipation rate $D$, and Blake3 deterministic state digest.
  - [ ] Integrate energy strip across 3D WebGL studios and 2D canvas instruments.

---

### Phase 4: Interactive Claim Inversion & Prior-Art Failure Modes (`fs-mbd`, `fs-contact`, `fs-regime`)
- [ ] **4.1. Claim Predicate & Constraint Matrix Switcher**:
  - [ ] Define claim constraint states in `src/physics/claimConstraints.ts` for major patents.
  - [ ] Implement constraint modifications:
    - Wright Flyer (US 821,393 Claim 1): Uncoupling rudder linkage $\to$ adverse yaw induces roll-reversal and stall spin.
    - Edison Lamp (US 223,898 Claim 1): Restoring atmospheric pressure $\to$ rapid carbon filament oxidation and burnout in $< 2$ seconds.
    - Tesla AC Motor (US 381,968 Claim 1): Switching polyphase quadrature to single-phase unassisted $\to$ zero starting torque and stator heating.
    - Howe Sewing Machine (US 4,750 Claim 1): Desynchronizing feed-dog / shuttle timing $\to$ failed thread loop capture and needle jam.
    - Morse Telegraph (US 1,647 Claim 1): Removing magnetic return spring $\to$ armature stiction and continuous ground fault.
- [ ] **4.2. Interactive Claim Toggle Chips on Visual Studios**:
  - [ ] Add interactive claim constraint toggle badges (`[Claim 1: Linkage Active | Inverted]`) to 3D studio headers and 2D simulators.
  - [ ] Connect claim state to the Claims Decoder pills on the patent detail page.

---

### Phase 5: Procedural AudioWorklet & Web Audio Physical Waveform Streaming (`fs-flux`, `fs-spectral`)
- [ ] **5.1. Continuous Acoustic & Harmonic Synthesizers in `soundEngine.ts`**:
  - [ ] Bell Telephone (US 174,465): Continuous undulating electrical speech current synthesizer with microphonic carbon resistance transfer function.
  - [ ] Marconi Wireless (US 586,193) & Tesla Coil (US 593,138): Damped RF wave train spark discharge generator ($e^{-\gamma t} \sin(\omega_0 t)$).
  - [ ] Enrico Fermi Reactor (US 2,708,656): Stochastic Poisson radiation click train whose rate is proportional to thermal neutron flux $\phi_n$.
  - [ ] Wright Flyer (US 821,393): Twin contra-rotating propeller blade passage frequency (BPF) with Doppler frequency shift based on airspeed.
- [ ] **5.2. Audio Mute State Synchronization & Web Audio Context Management**:
  - [ ] Ensure all audio streams respect `usePatentAudio` mute toggles, page visibility changes, and unmount cleanups.

---

### Phase 6: Multi-Patent Coupled Laboratories (`fs-couple`)
- [ ] **6.1. Coupled Historical Machinery Demonstrations**:
  - [ ] Couple **Watt Rotary Steam Engine** $\to$ **Arkwright Water Frame Spinning Mule** $\to$ **Howe Lockstitch Sewing Machine**.
  - [ ] Couple **Tesla Polyphase Alternator** $\to$ **Tesla High-Potential Transformer** $\to$ **Edison Incandescent Lamp Network**.
- [ ] **6.2. Verified Tests & Production Build Gates**:
  - [ ] Add unit and deterministic replay tests for all new physics kernels, sensitivity calculations, energy ledgers, and claim switches.
  - [ ] Verify full test suite passes (`bun test`), TypeScript check (`tsc --noEmit`), Biome check (`biome check .`), and verified production deployment (`scripts/verified-production-deploy.ts`).
