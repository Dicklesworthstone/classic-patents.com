"use client";

import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ClaimConstraintToggle } from "@/components/patents/visuals/ClaimConstraintToggle";
import {
  ethernetDisplayWavePhase,
  type MetcalfeEthernetControls,
  readEthernetControls,
  readMetcalfeEthernetTapeFrame,
  resetMetcalfeEthernetTape,
} from "@/physics/metcalfeEthernetKernel";
import { usePatentRuntimeTick } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

const PATENT_ID = "us-4063220-metcalfe-ethernet";

export const MetcalfeEthernetSim: React.FC = () => {
  const { effectiveParams, updateParam } = usePatentPhysics(PATENT_ID);
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });
  const controls = useMemo<MetcalfeEthernetControls>(
    () => readEthernetControls(effectiveParams as any),
    [effectiveParams],
  );
  const runtimeTick = usePatentRuntimeTick(PATENT_ID, 1);
  const tapeFrame = readMetcalfeEthernetTapeFrame(controls);
  const { state, metrics } = tapeFrame;

  const setControl = <K extends keyof MetcalfeEthernetControls>(
    key: K,
    value: MetcalfeEthernetControls[K],
  ) => {
    updateParam(key, value as number);
  };

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const rectangle = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const bufferWidth = Math.max(1, Math.round(rectangle.width * pixelRatio));
      const bufferHeight = Math.max(1, Math.round(rectangle.height * pixelRatio));
      if (canvas.width !== bufferWidth || canvas.height !== bufferHeight) {
        canvas.width = bufferWidth;
        canvas.height = bufferHeight;
      }
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      const width = rectangle.width;
      const height = rectangle.height;

      // Background
      ctx.fillStyle = "#090d16";
      ctx.fillRect(0, 0, width, height);

      // Draw grid
      ctx.strokeStyle = "rgba(30, 41, 59, 0.5)";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Cable parameters
      const cableY = height * 0.45;
      const cableStartX = 60;
      const cableEndX = width - 60;
      const cableLengthPx = cableEndX - cableStartX;

      // 1. Draw 50-ohm Terminators at ends
      ctx.fillStyle = "#475569";
      ctx.fillRect(cableStartX - 24, cableY - 16, 24, 32);
      ctx.fillRect(cableEndX, cableY - 16, 24, 32);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "bold 10px monospace";
      ctx.fillText("50Ω", cableStartX - 22, cableY + 4);
      ctx.fillText("50Ω", cableEndX + 2, cableY + 4);

      // 2. Draw Yellow Coaxial Cable (10BASE5 Thicknet)
      ctx.strokeStyle = "#eab308";
      ctx.lineWidth = 10;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(cableStartX, cableY);
      ctx.lineTo(cableEndX, cableY);
      ctx.stroke();

      // Inner conductor core reflection
      ctx.strokeStyle = "#fef08a";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cableStartX, cableY);
      ctx.lineTo(cableEndX, cableY);
      ctx.stroke();

      // 3. Draw 4 Stations (Xerox Alto Nodes)
      const stations = [
        {
          id: 0,
          label: "Node A (Alto 1)",
          color: "#38bdf8",
          x: cableStartX + cableLengthPx * 0.15,
        },
        {
          id: 1,
          label: "Node B (Alto 2)",
          color: "#34d399",
          x: cableStartX + cableLengthPx * 0.38,
        },
        { id: 2, label: "Node C (Laser)", color: "#a78bfa", x: cableStartX + cableLengthPx * 0.62 },
        {
          id: 3,
          label: "Node D (Gateway)",
          color: "#f472b6",
          x: cableStartX + cableLengthPx * 0.85,
        },
      ];

      stations.forEach((st) => {
        // Transceiver tap clamp
        ctx.fillStyle = "#334155";
        ctx.fillRect(st.x - 8, cableY - 12, 16, 24);
        ctx.strokeStyle = "#64748b";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(st.x - 8, cableY - 12, 16, 24);

        // Drop cable to station (AUI transceiver cable)
        ctx.strokeStyle = "#1e293b";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(st.x, cableY - 12);
        ctx.lineTo(st.x, cableY - 70);
        ctx.stroke();

        // Host Station Box (Xerox Alto CRT)
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(st.x - 30, cableY - 120, 60, 50);
        ctx.strokeStyle = st.color;
        ctx.lineWidth = 2;
        ctx.strokeRect(st.x - 30, cableY - 120, 60, 50);

        // Screen area
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(st.x - 24, cableY - 114, 48, 38);

        // Label
        ctx.fillStyle = "#f8fafc";
        ctx.font = "10px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(st.label, st.x, cableY - 130);
      });

      // 4. Draw the exact shared tape phase, slowed explicitly so a
      // nanosecond electromagnetic transit remains visible to a visitor.
      const wavePhase = ethernetDisplayWavePhase(state);
      const drawBidirectionalWave = (originX: number, color: string) => {
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 12;
        for (const x of [
          originX + wavePhase * (cableEndX - originX),
          originX - wavePhase * (originX - cableStartX),
        ]) {
          ctx.beginPath();
          ctx.arc(x, cableY, 8, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.shadowBlur = 0;
      };

      if (state.station1State === "transmitting" || state.station1State === "jamming") {
        drawBidirectionalWave(
          stations[0].x,
          state.station1State === "jamming" ? "#ef4444" : stations[0].color,
        );
      }
      if (state.station2State === "transmitting" || state.station2State === "jamming") {
        drawBidirectionalWave(
          stations[1].x,
          state.station2State === "jamming" ? "#ef4444" : stations[1].color,
        );
      }

      if (metrics.collisionDisplayActive) {
        ctx.fillStyle = "#facc15";
        ctx.shadowColor = "#ef4444";
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc((stations[0].x + stations[1].x) / 2, cableY, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 5. Draw Bottom Scope / Telemetry Panel
      const scopeY = height * 0.7;
      ctx.fillStyle = "#0b1329";
      ctx.fillRect(20, scopeY, width - 40, height - scopeY - 20);
      ctx.strokeStyle = "#1e293b";
      ctx.lineWidth = 1;
      ctx.strokeRect(20, scopeY, width - 40, height - scopeY - 20);

      // Oscilloscope title
      ctx.fillStyle = "#94a3b8";
      ctx.font = "bold 11px monospace";
      ctx.textAlign = "left";
      ctx.fillText("COAXIAL BUS VOLTAGE & MANCHESTER OSCILLOSCOPE", 35, scopeY + 20);

      // Draw Manchester bit transitions
      const scopeStartX = 40;
      const scopeEndX = width - 40;
      const scopeMidY = scopeY + 60;

      ctx.strokeStyle = metrics.collisionDisplayActive ? "#ef4444" : "#22c55e";
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      for (let x = scopeStartX; x < scopeEndX; x += 2) {
        const t = (x - scopeStartX) * 0.05 + state.manchesterClockPhase / (Math.PI * 2);
        const bitVal = Math.sin(t) > 0 ? 1 : -1;
        // Mid-bit Manchester transition
        const phase = t % 1;
        const yOffset = phase > 0.5 ? bitVal * 20 : -bitVal * 20;
        const deterministicJamRipple = Math.sin(t * 17 + state.rngCounter * 0.31) * 5;
        const y =
          scopeMidY +
          (metrics.collisionDisplayActive ? yOffset * 1.8 + deterministicJamRipple : yOffset);

        if (x === scopeStartX) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Readouts
      ctx.fillStyle = "#38bdf8";
      ctx.font = "11px monospace";
      ctx.fillText(`BUS V: ${metrics?.busVoltageVolts?.toFixed(2) ?? "-1.00"} V`, 40, scopeY + 105);
      ctx.fillStyle = metrics.collisionDisplayActive ? "#ef4444" : "#22c55e";
      ctx.fillText(
        `STATUS: ${metrics.collisionDisplayActive ? "COLLISION EVENT / JAM + BACKOFF" : "CARRIER CLEAR / CLEAN"}`,
        180,
        scopeY + 105,
      );
      ctx.fillStyle = "#eab308";
      ctx.fillText(
        `EFFICIENCY: ${metrics?.channelEfficiencyPct?.toFixed(1) ?? "95.2"}%`,
        450,
        scopeY + 105,
      );
    };

    render();
    const observer = new ResizeObserver(render);
    const canvas = canvasRef.current;
    if (canvas) observer.observe(canvas);
    return () => observer.disconnect();
  }, [metrics, state]);

  return (
    <div
      className="flex flex-col gap-4 w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200"
      data-runtime-tick={runtimeTick}
      data-rng-counter={state.rngCounter}
      data-collision-count={state.totalCollisionCount}
    >
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-base font-semibold text-amber-400">
            CSMA/CD Coaxial Bus Simulator (US 4,063,220)
          </h3>
          <p className="text-xs text-slate-400">
            Multi-node Carrier Sense, Delay-Matched Collision Detection & Binary Exponential Backoff
          </p>
        </div>

        <div className="flex w-full flex-wrap gap-2 sm:w-auto">
          <button
            type="button"
            onClick={() => {
              updateParam("triggerCollision", 0);
              updateParam("station1Transmitting", 1);
              updateParam("station2Transmitting", 0);
            }}
            className="grow px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-md text-xs font-medium transition sm:grow-0"
          >
            Transmit from Node A
          </button>
          <button
            type="button"
            onClick={() => {
              updateParam("triggerCollision", 0);
              updateParam("station1Transmitting", 0);
              updateParam("station2Transmitting", 1);
            }}
            className="grow px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-medium transition sm:grow-0"
          >
            Transmit from Node B
          </button>
          <button
            type="button"
            onClick={() => {
              updateParam("station1Transmitting", 1);
              updateParam("station2Transmitting", 1);
              updateParam("triggerCollision", 1);
            }}
            className="grow px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-md text-xs font-medium transition sm:grow-0"
          >
            Force Collision!
          </button>
          <button
            type="button"
            onClick={() => resetMetcalfeEthernetTape()}
            className="grow px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-md text-xs font-medium transition sm:grow-0"
          >
            Reset Event Tape
          </button>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="relative w-full h-[380px] bg-slate-900 rounded-lg overflow-hidden border border-slate-800">
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
          aria-label="Animated coaxial Ethernet collision-domain diagram"
        />
      </div>

      {/* Physics Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="flex flex-col gap-1.5 bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
          <div className="flex justify-between text-xs">
            <label htmlFor="metcalfe-cable-length" className="text-slate-300 font-medium">
              Coaxial Cable Length
            </label>
            <span className="text-amber-400 font-mono">{controls.cableLengthMeters} m</span>
          </div>
          <input
            id="metcalfe-cable-length"
            aria-label="Coaxial cable length"
            type="range"
            min="50"
            max="1000"
            step="50"
            value={controls.cableLengthMeters}
            onChange={(e) => setControl("cableLengthMeters", Number(e.target.value))}
            className="accent-amber-400 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
          />
          <span className="text-[10px] text-slate-500">
            One-way delay: {metrics?.oneWayPropDelayNs?.toFixed(1) ?? "2500.0"} ns (at 0.66c)
          </span>
        </div>

        <div className="flex flex-col gap-1.5 bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
          <div className="flex justify-between text-xs">
            <label htmlFor="metcalfe-data-rate" className="text-slate-300 font-medium">
              Data Rate
            </label>
            <span className="text-sky-400 font-mono">{controls.dataRateMbps} Mbps</span>
          </div>
          <input
            id="metcalfe-data-rate"
            aria-label="Ethernet data rate"
            type="range"
            min="1.0"
            max="10.0"
            step="0.5"
            value={controls.dataRateMbps}
            onChange={(e) => setControl("dataRateMbps", Number(e.target.value))}
            className="accent-sky-400 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
          />
          <span className="text-[10px] text-slate-500">
            Manchester bit period: {metrics?.bitPeriodNs?.toFixed(1) ?? "340.1"} ns
          </span>
        </div>

        <div className="flex flex-col gap-1.5 bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
          <div className="flex justify-between text-xs">
            <label htmlFor="metcalfe-offered-load" className="text-slate-300 font-medium">
              Offered Traffic Load (G)
            </label>
            <span className="text-emerald-400 font-mono">{controls.offeredLoad}</span>
          </div>
          <input
            id="metcalfe-offered-load"
            aria-label="Offered Ethernet traffic load"
            type="range"
            min="0.1"
            max="2.0"
            step="0.1"
            value={controls.offeredLoad}
            onChange={(e) => setControl("offeredLoad", Number(e.target.value))}
            className="accent-emerald-400 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
          />
          <span className="text-[10px] text-slate-500">
            Slot time: {metrics?.slotTimeMicrosec?.toFixed(2) ?? "5.04"} µs
          </span>
        </div>
      </div>

      <div className="p-4 bg-slate-900/60 rounded-lg border border-slate-800">
        <ClaimConstraintToggle
          patentId={PATENT_ID}
          claimStates={claimStates}
          onClaimStateChange={(num, active) =>
            setClaimStates((prev) => ({ ...prev, [num]: active }))
          }
        />
      </div>
    </div>
  );
};
