"use client";

import { marconiMastHeightFromHz } from "@/physics/catalogKernels";
import {
  type CoupleLink,
  type DatedScenario,
  type FidelityField,
  type IntervalGhost,
  type KittyHawkResidual,
  NAMED_RINGS,
  type SmokePolicy,
  type SpectralMode,
} from "@/physics/weaveSurfaces";
import { soundEngine } from "@/utils/soundEngine";

type UpdateParam = (id: string, value: number) => void;

interface WeaveReadoutPanelsProps {
  patentId: string;
  params: Record<string, number>;
  updateParam: UpdateParam;
  ghosts: IntervalGhost[];
  fidelity: FidelityField | null;
  kittyHawk: KittyHawkResidual | null;
  couples: CoupleLink[];
  smoke: SmokePolicy;
  modes: SpectralMode[];
  scenarios: DatedScenario[];
}

interface WeaveInteractionPanelsProps {
  patentId: string;
  params: Record<string, number>;
  updateParam: UpdateParam;
  bankActive: boolean;
  enableDeviceBank: () => Promise<void>;
  voiceActive: boolean;
  sampleVoice: () => Promise<void>;
  stopVoiceSampling: () => void;
}

const PANEL_CLASS =
  "rounded-xl border border-parchment-300 dark:border-ink-800 bg-white/70 dark:bg-ink-900/70 p-3";

const HOP_GRID_CHANNELS = Array.from({ length: 16 }, (_, index) => index + 1);

export function WeaveReadoutPanels({
  patentId,
  params,
  updateParam,
  ghosts,
  fidelity,
  kittyHawk,
  couples,
  smoke,
  modes,
  scenarios,
}: WeaveReadoutPanelsProps) {
  return (
    <>
      <IntervalGhostsPanel ghosts={ghosts} />
      <FidelityResidualPanel fidelity={fidelity} />
      <KittyHawkResidualPanel residual={kittyHawk} />
      <CoupledChannelsPanel couples={couples} />
      <PlumePolicyPanel patentId={patentId} smoke={smoke} />
      <SpectralModesPanel patentId={patentId} modes={modes} updateParam={updateParam} />
      <DatedScenariosPanel scenarios={scenarios} updateParam={updateParam} />
      <MorseBusPanel patentId={patentId} currentMa={params.currentMa ?? 65} />
    </>
  );
}

export function WeaveInteractionPanels({
  patentId,
  params,
  updateParam,
  bankActive,
  enableDeviceBank,
  voiceActive,
  sampleVoice,
  stopVoiceSampling,
}: WeaveInteractionPanelsProps) {
  return (
    <>
      <WrightBankingPanel
        patentId={patentId}
        params={params}
        updateParam={updateParam}
        bankActive={bankActive}
        enableDeviceBank={enableDeviceBank}
      />
      <BellVoicePanel
        patentId={patentId}
        voiceActive={voiceActive}
        sampleVoice={sampleVoice}
        stopVoiceSampling={stopVoiceSampling}
      />
      <LamarrHopGridPanel patentId={patentId} updateParam={updateParam} />
    </>
  );
}

function IntervalGhostsPanel({ ghosts }: { ghosts: IntervalGhost[] }) {
  if (ghosts.length === 0) return null;

  return (
    <div className={`${PANEL_CLASS} space-y-2`}>
      <div className="text-[10px] font-mono uppercase tracking-wider text-ink-500">
        Interval ghosts
      </div>
      {ghosts.map((ghost) => (
        <IntervalGhostRow key={ghost.label} ghost={ghost} />
      ))}
    </div>
  );
}

function IntervalGhostRow({ ghost }: { ghost: IntervalGhost }) {
  const span = ghost.max - ghost.min || 1;
  const livePercent = Math.min(100, Math.max(0, ((ghost.live - ghost.min) / span) * 100));

  return (
    <div className="space-y-0.5">
      <div className="flex justify-between text-[10px] font-mono text-ink-600 dark:text-ink-400">
        <span>{ghost.label}</span>
        <span>
          {ghost.live.toFixed(1)} {ghost.unit} · [{ghost.min}, {ghost.max}]
        </span>
      </div>
      <div className="relative h-1.5 rounded-full bg-parchment-200 dark:bg-ink-800">
        <div className="absolute inset-y-0 left-0 right-0 rounded-full opacity-30 bg-amber-400" />
        <div
          className="absolute top-[-2px] h-2.5 w-0.5 bg-ink-950 dark:bg-white"
          style={{ left: `${livePercent}%` }}
        />
      </div>
    </div>
  );
}

function FidelityResidualPanel({ fidelity }: { fidelity: FidelityField | null }) {
  if (!fidelity) return null;

  return (
    <div className={`${PANEL_CLASS} text-[11px] font-mono space-y-1`}>
      <div className="uppercase tracking-wider text-ink-500">Fidelity / MMS residual</div>
      <div className="text-ink-800 dark:text-parchment-200">{fidelity.part}</div>
      <div className="flex justify-between">
        <span>model</span>
        <span>
          {fidelity.model} {fidelity.unit}
        </span>
      </div>
      <div className="flex justify-between">
        <span>reference</span>
        <span>
          {fidelity.reference} {fidelity.unit}
        </span>
      </div>
      <div className="flex justify-between font-bold">
        <span>residual</span>
        <span>
          {fidelity.residual} {fidelity.unit}
        </span>
      </div>
    </div>
  );
}

function KittyHawkResidualPanel({ residual }: { residual: KittyHawkResidual | null }) {
  if (!residual) return null;

  return (
    <div className={`${PANEL_CLASS} text-[11px] font-mono space-y-1`}>
      <div className="uppercase tracking-wider text-ink-500">Kitty Hawk residual · 17 Dec 1903</div>
      <div className="flex justify-between">
        <span>lift − 750 lbf</span>
        <span className="font-bold">{residual.liftResidualN.toFixed(0)} N</span>
      </div>
      <div className="flex justify-between">
        <span>airspeed − 30 mph</span>
        <span className="font-bold">{residual.speedResidualMph.toFixed(1)} mph</span>
      </div>
    </div>
  );
}

function CoupledChannelsPanel({ couples }: { couples: CoupleLink[] }) {
  if (couples.length === 0) return null;

  return (
    <div className={`${PANEL_CLASS} text-[11px] font-mono space-y-1`}>
      <div className="uppercase tracking-wider text-ink-500">Coupled channels</div>
      {couples.map((couple) => (
        <div key={`${couple.from}-${couple.to}`} className="flex justify-between">
          <span>
            {couple.from} → {couple.to}
          </span>
          <span className="font-bold">{Math.round(couple.watts)} W</span>
        </div>
      ))}
    </div>
  );
}

function PlumePolicyPanel({ patentId, smoke }: { patentId: string; smoke: SmokePolicy }) {
  if (!patentId.includes("goddard") && !patentId.includes("spencer")) return null;

  return (
    <div
      className={`rounded-xl border p-3 text-[11px] font-sans ${
        smoke.allowed
          ? "border-emerald-300 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/30"
          : "border-rose-300 dark:border-rose-800 bg-rose-50/70 dark:bg-rose-950/30"
      }`}
    >
      <div className="font-mono uppercase tracking-wider text-[10px] mb-1">
        {smoke.allowed ? "Plume admitted" : "Plume refused"}
      </div>
      {smoke.reason}
    </div>
  );
}

function SpectralModesPanel({
  patentId,
  modes,
  updateParam,
}: {
  patentId: string;
  modes: SpectralMode[];
  updateParam: UpdateParam;
}) {
  if (modes.length === 0) return null;

  const selectMode = (mode: SpectralMode) => {
    if (patentId.includes("marconi")) {
      updateParam("aerialHeight", marconiMastHeightFromHz(mode.freqHz / Math.max(1, mode.n)));
    }
  };

  return (
    <div className={`${PANEL_CLASS} space-y-2`}>
      <div className="text-[10px] font-mono uppercase tracking-wider text-ink-500">
        Spectral modes
      </div>
      <div className="flex flex-wrap gap-1.5">
        {modes.map((mode) => (
          <button
            key={mode.n}
            type="button"
            onClick={() => selectMode(mode)}
            className="min-h-11 px-3 py-2 rounded-lg border border-parchment-300 dark:border-ink-700 text-[10px] font-mono"
          >
            {mode.name} · {(mode.freqHz / 1000).toFixed(0)} kHz
          </button>
        ))}
      </div>
    </div>
  );
}

function DatedScenariosPanel({
  scenarios,
  updateParam,
}: {
  scenarios: DatedScenario[];
  updateParam: UpdateParam;
}) {
  if (scenarios.length === 0) return null;

  const applyScenario = (scenario: DatedScenario) => {
    for (const [key, value] of Object.entries(scenario.writes)) updateParam(key, value);
  };

  return (
    <div className={`${PANEL_CLASS} space-y-2`}>
      <div className="text-[10px] font-mono uppercase tracking-wider text-ink-500">
        Dated scenarios
      </div>
      <div className="flex flex-wrap gap-2">
        {scenarios.map((scenario) => (
          <button
            key={scenario.id}
            type="button"
            onClick={() => applyScenario(scenario)}
            className="min-h-11 px-2.5 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-left text-[11px] font-sans hover:bg-parchment-100 dark:hover:bg-ink-800"
          >
            <span className="block font-mono text-[10px] text-amber-700 dark:text-amber-400">
              {scenario.date}
            </span>
            {scenario.name}
          </button>
        ))}
      </div>
    </div>
  );
}

function MorseBusPanel({ patentId, currentMa }: { patentId: string; currentMa: number }) {
  const isMorse = patentId.includes("morse") || patentId.includes("1647");
  if (!isMorse) return null;

  return (
    <div className={`${PANEL_CLASS} text-[11px] font-sans text-ink-700 dark:text-ink-300`}>
      Typed Morse lives on the 2D face (WHAT HATH GOD WROUGHT). Line current on this bus is{" "}
      <span className="font-mono font-bold">{currentMa.toFixed(0)} mA</span>.
    </div>
  );
}

function WrightBankingPanel({
  patentId,
  params,
  updateParam,
  bankActive,
  enableDeviceBank,
}: {
  patentId: string;
  params: Record<string, number>;
  updateParam: UpdateParam;
  bankActive: boolean;
  enableDeviceBank: () => Promise<void>;
}) {
  const isWright = patentId.includes("wright-flyer") || patentId.includes("821393");
  if (!isWright) return null;

  const toggleClaimLink = () => {
    const next = (params.coupled ?? 1) >= 0.5 ? 0 : 1;
    updateParam("coupled", next);
    if (next === 1) updateParam("rudder", (params.wingWarp ?? 8) * 0.45);
  };

  return (
    <div className={`${PANEL_CLASS} space-y-2`}>
      <div className="text-[10px] font-mono uppercase tracking-wider text-ink-500">
        Prior-art failure · visitor as bank
      </div>
      <button
        type="button"
        onClick={toggleClaimLink}
        className="min-h-11 px-2.5 py-1.5 rounded-lg bg-amber-700 text-white text-[11px] font-sans"
      >
        {(params.coupled ?? 1) >= 0.5 ? "Uncouple rudder (1901 failure)" : "Restore Claim 1 link"}
      </button>
      <button
        type="button"
        onClick={() => void enableDeviceBank()}
        aria-pressed={bankActive}
        className={`min-h-11 ml-2 px-2.5 py-1.5 rounded-lg border text-[11px] font-sans ${
          bankActive
            ? "bg-amber-700 text-white border-amber-800 dark:bg-amber-700"
            : "border-parchment-300 dark:border-ink-700"
        }`}
      >
        {bankActive ? "Banking (10 s) — tap to stop" : "Bank with device roll"}
      </button>
    </div>
  );
}

function BellVoicePanel({
  patentId,
  voiceActive,
  sampleVoice,
  stopVoiceSampling,
}: {
  patentId: string;
  voiceActive: boolean;
  sampleVoice: () => Promise<void>;
  stopVoiceSampling: () => void;
}) {
  const isBell =
    (patentId.includes("bell") && patentId.includes("telephone")) || patentId.includes("174465");
  if (!isBell) return null;

  return (
    <div className={`${PANEL_CLASS} space-y-2`}>
      <div className="text-[10px] font-mono uppercase tracking-wider text-ink-500">
        Named ring · visitor mic
      </div>
      <div className="flex flex-wrap gap-1.5">
        {NAMED_RINGS.map((ring) => (
          <button
            key={ring.name}
            type="button"
            onClick={() => {
              soundEngine.playTone(ring.hz, 0.9, "sine", 0.08);
            }}
            className="min-h-11 px-3 py-2 rounded-lg border border-parchment-300 dark:border-ink-700 text-[10px] font-mono"
          >
            {ring.name}
          </button>
        ))}
        <button
          type="button"
          onClick={() => {
            if (voiceActive) stopVoiceSampling();
            else void sampleVoice();
          }}
          className="min-h-11 px-3 py-2 rounded-lg bg-amber-700 text-white text-[10px] font-sans"
        >
          {voiceActive ? "Stop mic" : "Speak 4 s"}
        </button>
      </div>
    </div>
  );
}

function LamarrHopGridPanel({
  patentId,
  updateParam,
}: {
  patentId: string;
  updateParam: UpdateParam;
}) {
  if (!patentId.includes("lamarr")) return null;

  return (
    <div className={`${PANEL_CLASS} space-y-2`}>
      <div className="text-[10px] font-mono uppercase tracking-wider text-ink-500">
        Piano-roll hop grid
      </div>
      <div className="grid grid-cols-8 gap-1">
        {HOP_GRID_CHANNELS.map((channel) => (
          <button
            key={`hop-channel-${channel}`}
            type="button"
            onClick={() => updateParam("hopRate", 1 + (channel - 1) * 1.8)}
            className="aspect-square rounded bg-parchment-200 dark:bg-ink-800 hover:bg-amber-500 text-[9px] font-mono"
          >
            {channel}
          </button>
        ))}
      </div>
    </div>
  );
}
