"use client";

import { marconiMastHeightFromHz } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import {
  coupleLinks,
  datedScenarios,
  fidelityField,
  intervalGhosts,
  kittyHawkResidual,
  NAMED_RINGS,
  smokePolicy,
  spectralModes,
} from "@/physics/weaveSurfaces";
import { soundEngine } from "@/utils/soundEngine";

interface WeaveInstrumentProps {
  patentId: string;
}

export function WeaveInstrument({ patentId }: WeaveInstrumentProps) {
  const { params, updateParam } = usePatentPhysics(patentId);
  const ghosts = intervalGhosts(patentId, params);
  const fidelity = fidelityField(patentId, params);
  const smoke = smokePolicy(patentId, params);
  const modes = spectralModes(patentId, params);
  const scenarios = datedScenarios(patentId);
  const couples = coupleLinks(patentId, params);
  const isWright = patentId.includes("wright-flyer") || patentId.includes("821393");
  const isBell =
    (patentId.includes("bell") && patentId.includes("telephone")) || patentId.includes("174465");
  const isMorse = patentId.includes("morse") || patentId.includes("1647");
  const isLamarr = patentId.includes("lamarr");
  const kh = isWright ? kittyHawkResidual(params) : null;

  const enableDeviceBank = async () => {
    try {
      const ori = window.DeviceOrientationEvent;
      if (!ori) return;
      const anyOri = DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<string>;
      };
      if (
        typeof anyOri.requestPermission === "function" &&
        (await anyOri.requestPermission()) !== "granted"
      ) {
        return;
      }
      const onOri = (e: DeviceOrientationEvent) => {
        const g = e.gamma ?? 0;
        updateParam("wingWarp", Math.max(-15, Math.min(15, g * 0.4)));
      };
      window.addEventListener("deviceorientation", onOri);
      window.setTimeout(() => window.removeEventListener("deviceorientation", onOri), 10_000);
    } catch {
      // The control remains available for devices that deny orientation permission.
    }
  };

  const sampleVoice = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = new AudioContext();
      const src = ctx.createMediaStreamSource(stream);
      const anal = ctx.createAnalyser();
      anal.fftSize = 1024;
      src.connect(anal);
      const buf = new Uint8Array(anal.fftSize);
      const tick = () => {
        anal.getByteTimeDomainData(buf);
        let peak = 0;
        for (const sample of buf) peak = Math.max(peak, Math.abs(sample - 128));
        const db = 40 + (peak / 128) * 55;
        updateParam("voiceAmplitude", Math.min(95, Math.max(40, db)));
      };
      const intervalId = window.setInterval(tick, 80);
      window.setTimeout(() => {
        window.clearInterval(intervalId);
        for (const track of stream.getTracks()) track.stop();
        void ctx.close();
      }, 4000);
    } catch {
      // A denied microphone permission leaves the manual voice slider usable.
    }
  };

  if (
    ghosts.length === 0 &&
    !fidelity &&
    scenarios.length === 0 &&
    couples.length === 0 &&
    modes.length === 0 &&
    !isWright &&
    !isBell &&
    !isMorse &&
    !isLamarr
  ) {
    return null;
  }

  return (
    <div className="space-y-3">
      {ghosts.length > 0 && (
        <div className="rounded-xl border border-parchment-300 dark:border-ink-800 bg-white/70 dark:bg-ink-900/70 p-3 space-y-2">
          <div className="text-[10px] font-mono uppercase tracking-wider text-ink-500">
            Interval ghosts
          </div>
          {ghosts.map((g) => {
            const span = g.max - g.min || 1;
            const livePct = Math.min(100, Math.max(0, ((g.live - g.min) / span) * 100));
            return (
              <div key={g.label} className="space-y-0.5">
                <div className="flex justify-between text-[10px] font-mono text-ink-600 dark:text-ink-400">
                  <span>{g.label}</span>
                  <span>
                    {g.live.toFixed(1)} {g.unit} · [{g.min}, {g.max}]
                  </span>
                </div>
                <div className="relative h-1.5 rounded-full bg-parchment-200 dark:bg-ink-800">
                  <div className="absolute inset-y-0 left-0 right-0 rounded-full opacity-30 bg-amber-400" />
                  <div
                    className="absolute top-[-2px] h-2.5 w-0.5 bg-ink-950 dark:bg-white"
                    style={{ left: `${livePct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {fidelity && (
        <div className="rounded-xl border border-parchment-300 dark:border-ink-800 bg-white/70 dark:bg-ink-900/70 p-3 text-[11px] font-mono space-y-1">
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
      )}

      {kh && (
        <div className="rounded-xl border border-parchment-300 dark:border-ink-800 bg-white/70 dark:bg-ink-900/70 p-3 text-[11px] font-mono space-y-1">
          <div className="uppercase tracking-wider text-ink-500">
            Kitty Hawk residual · 17 Dec 1903
          </div>
          <div className="flex justify-between">
            <span>lift − 750 lbf</span>
            <span className="font-bold">{kh.liftResidualN.toFixed(0)} N</span>
          </div>
          <div className="flex justify-between">
            <span>airspeed − 30 mph</span>
            <span className="font-bold">{kh.speedResidualMph.toFixed(1)} mph</span>
          </div>
        </div>
      )}

      {couples.length > 0 && (
        <div className="rounded-xl border border-parchment-300 dark:border-ink-800 bg-white/70 dark:bg-ink-900/70 p-3 text-[11px] font-mono space-y-1">
          <div className="uppercase tracking-wider text-ink-500">Coupled channels</div>
          {couples.map((c) => (
            <div key={`${c.from}-${c.to}`} className="flex justify-between">
              <span>
                {c.from} → {c.to}
              </span>
              <span className="font-bold">{Math.round(c.watts)} W</span>
            </div>
          ))}
        </div>
      )}

      {(patentId.includes("goddard") || patentId.includes("spencer")) && (
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
      )}

      {modes.length > 0 && (
        <div className="rounded-xl border border-parchment-300 dark:border-ink-800 bg-white/70 dark:bg-ink-900/70 p-3 space-y-2">
          <div className="text-[10px] font-mono uppercase tracking-wider text-ink-500">
            Spectral modes
          </div>
          <div className="flex flex-wrap gap-1.5">
            {modes.map((m) => (
              <button
                key={m.n}
                type="button"
                onClick={() => {
                  if (patentId.includes("marconi")) {
                    updateParam(
                      "aerialHeight",
                      marconiMastHeightFromHz(m.freqHz / Math.max(1, m.n)),
                    );
                  }
                }}
                className="min-h-11 px-3 py-2 rounded-lg border border-parchment-300 dark:border-ink-700 text-[10px] font-mono"
              >
                {m.name} · {(m.freqHz / 1000).toFixed(0)} kHz
              </button>
            ))}
          </div>
        </div>
      )}

      {scenarios.length > 0 && (
        <div className="rounded-xl border border-parchment-300 dark:border-ink-800 bg-white/70 dark:bg-ink-900/70 p-3 space-y-2">
          <div className="text-[10px] font-mono uppercase tracking-wider text-ink-500">
            Dated scenarios
          </div>
          <div className="flex flex-wrap gap-2">
            {scenarios.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  for (const [k, v] of Object.entries(s.writes)) updateParam(k, v);
                }}
                className="px-2.5 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-left text-[11px] font-sans hover:bg-parchment-100 dark:hover:bg-ink-800"
              >
                <span className="block font-mono text-[10px] text-amber-700 dark:text-amber-400">
                  {s.date}
                </span>
                {s.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {isWright && (
        <div className="rounded-xl border border-parchment-300 dark:border-ink-800 bg-white/70 dark:bg-ink-900/70 p-3 space-y-2">
          <div className="text-[10px] font-mono uppercase tracking-wider text-ink-500">
            Prior-art failure · visitor as bank
          </div>
          <button
            type="button"
            onClick={() => {
              const next = (params.coupled ?? 1) >= 0.5 ? 0 : 1;
              updateParam("coupled", next);
              if (next === 1) updateParam("rudder", (params.wingWarp ?? 8) * 0.45);
            }}
            className="px-2.5 py-1.5 rounded-lg bg-amber-700 text-white text-[11px] font-sans"
          >
            {(params.coupled ?? 1) >= 0.5
              ? "Uncouple rudder (1901 failure)"
              : "Restore Claim 1 link"}
          </button>
          <button
            type="button"
            onClick={() => void enableDeviceBank()}
            className="ml-2 px-2.5 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-[11px] font-sans"
          >
            Bank with device roll
          </button>
        </div>
      )}

      {isBell && (
        <div className="rounded-xl border border-parchment-300 dark:border-ink-800 bg-white/70 dark:bg-ink-900/70 p-3 space-y-2">
          <div className="text-[10px] font-mono uppercase tracking-wider text-ink-500">
            Named ring · visitor mic
          </div>
          <div className="flex flex-wrap gap-1.5">
            {NAMED_RINGS.map((r) => (
              <button
                key={r.name}
                type="button"
                onClick={() => {
                  soundEngine.playContinuousTone(r.hz, "sine", 0.08);
                  setTimeout(() => soundEngine.stopContinuousTone(), 900);
                }}
                className="min-h-11 px-3 py-2 rounded-lg border border-parchment-300 dark:border-ink-700 text-[10px] font-mono"
              >
                {r.name}
              </button>
            ))}
            <button
              type="button"
              onClick={() => void sampleVoice()}
              className="min-h-11 px-3 py-2 rounded-lg bg-amber-700 text-white text-[10px] font-sans"
            >
              Speak 4 s
            </button>
          </div>
        </div>
      )}

      {isMorse && (
        <div className="rounded-xl border border-parchment-300 dark:border-ink-800 bg-white/70 dark:bg-ink-900/70 p-3 text-[11px] font-sans text-ink-700 dark:text-ink-300">
          Typed Morse lives on the 2D face (WHAT HATH GOD WROUGHT). Line current on this bus is{" "}
          <span className="font-mono font-bold">{(params.currentMa ?? 65).toFixed(0)} mA</span>.
        </div>
      )}

      {isLamarr && (
        <div className="rounded-xl border border-parchment-300 dark:border-ink-800 bg-white/70 dark:bg-ink-900/70 p-3 space-y-2">
          <div className="text-[10px] font-mono uppercase tracking-wider text-ink-500">
            Piano-roll hop grid
          </div>
          <div className="grid grid-cols-8 gap-1">
            {Array.from({ length: 16 }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => updateParam("hopRate", 1 + i * 1.8)}
                className="aspect-square rounded bg-parchment-200 dark:bg-ink-800 hover:bg-amber-500 text-[9px] font-mono"
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
