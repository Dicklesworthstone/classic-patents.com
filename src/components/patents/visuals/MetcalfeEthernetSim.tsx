"use client";

import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ClaimConstraintToggle } from "@/components/patents/visuals/ClaimConstraintToggle";
import {
  DEFAULT_ETHERNET_CONTROLS,
  INITIAL_ETHERNET_STATE,
  type MetcalfeEthernetControls,
  stepMetcalfeEthernetSi,
} from "@/physics/metcalfeEthernetKernel";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

const PATENT_ID = "us-4063220-metcalfe-ethernet";

interface WavePacket {
  id: number;
  originStationIndex: number;
  originX: number; // 0..1 normalized cable pos
  direction: 1 | -1;
  currentX: number;
  isJam: boolean;
  active: boolean;
}

export const MetcalfeEthernetSim: React.FC = () => {
  const { params, updateParam } = usePatentPhysics(PATENT_ID);
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });
  const controls = useMemo<MetcalfeEthernetControls>(
    () => ({
      ...DEFAULT_ETHERNET_CONTROLS,
      ...params,
    }),
    [params],
  );

  const metrics = useMemo(() => {
    return stepMetcalfeEthernetSi(INITIAL_ETHERNET_STATE, controls, 0.016).metrics;
  }, [controls]);

  const setControl = <K extends keyof MetcalfeEthernetControls>(
    key: K,
    value: MetcalfeEthernetControls[K],
  ) => {
    updateParam(key, value as number);
  };

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const packetsRef = useRef<WavePacket[]>([]);
  const packetIdSeq = useRef(1);

  // Handle station transmit buttons
  const sendPacketFromStation = (stationIdx: number) => {
    const stationX = 0.15 + (stationIdx / 3) * 0.7;
    packetsRef.current.push({
      id: packetIdSeq.current++,
      originStationIndex: stationIdx,
      originX: stationX,
      direction: 1,
      currentX: stationX,
      isJam: false,
      active: true,
    });
    packetsRef.current.push({
      id: packetIdSeq.current++,
      originStationIndex: stationIdx,
      originX: stationX,
      direction: -1,
      currentX: stationX,
      isJam: false,
      active: true,
    });
  };

  useEffect(() => {
    let animationFrameId: number;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

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

      // 4. Update & Draw Propagating Wave Packets
      const speedPxPerFrame = 4.0;
      const packets = packetsRef.current;

      for (let i = 0; i < packets.length; i++) {
        const p = packets[i];
        if (!p.active) continue;

        p.currentX += (p.direction * speedPxPerFrame) / cableLengthPx;

        // Check if reached terminator
        if (p.currentX <= 0 || p.currentX >= 1) {
          p.active = false;
          continue;
        }

        const px = cableStartX + p.currentX * cableLengthPx;

        // Packet waveform pulse
        const packetColor = p.isJam ? "#ef4444" : "#38bdf8";
        ctx.fillStyle = packetColor;
        ctx.shadowColor = packetColor;
        ctx.shadowBlur = 12;

        ctx.beginPath();
        ctx.arc(px, cableY, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
      }

      // Check packet collisions (packets overlapping on wire from different origins)
      for (let i = 0; i < packets.length; i++) {
        for (let j = i + 1; j < packets.length; j++) {
          const p1 = packets[i];
          const p2 = packets[j];
          if (
            p1.active &&
            p2.active &&
            p1.originStationIndex !== p2.originStationIndex &&
            Math.abs(p1.currentX - p2.currentX) < 0.03
          ) {
            // Collision spark!
            const colX = cableStartX + ((p1.currentX + p2.currentX) / 2) * cableLengthPx;
            ctx.fillStyle = "#facc15";
            ctx.shadowColor = "#ef4444";
            ctx.shadowBlur = 20;
            ctx.beginPath();
            ctx.arc(colX, cableY, 16, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Turn into jam packets
            p1.isJam = true;
            p2.isJam = true;
          }
        }
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
      const time = Date.now() / 1000;
      const scopeStartX = 40;
      const scopeEndX = width - 40;
      const scopeMidY = scopeY + 60;

      ctx.strokeStyle = metrics?.collisionDetected ? "#ef4444" : "#22c55e";
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      for (let x = scopeStartX; x < scopeEndX; x += 2) {
        const t = (x - scopeStartX) * 0.05 + time * 5;
        const bitVal = Math.sin(t) > 0 ? 1 : -1;
        // Mid-bit Manchester transition
        const phase = t % 1;
        const yOffset = phase > 0.5 ? bitVal * 20 : -bitVal * 20;
        const y =
          scopeMidY +
          (metrics?.collisionDetected ? yOffset * 1.8 + (Math.random() - 0.5) * 10 : yOffset);

        if (x === scopeStartX) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Readouts
      ctx.fillStyle = "#38bdf8";
      ctx.font = "11px monospace";
      ctx.fillText(`BUS V: ${metrics?.busVoltageVolts?.toFixed(2) ?? "-1.00"} V`, 40, scopeY + 105);
      ctx.fillStyle = metrics?.collisionDetected ? "#ef4444" : "#22c55e";
      ctx.fillText(
        `STATUS: ${metrics?.collisionDetected ? "COLLISION DETECTED (JAMMING)" : "CARRIER CLEAR / CLEAN"}`,
        180,
        scopeY + 105,
      );
      ctx.fillStyle = "#eab308";
      ctx.fillText(
        `EFFICIENCY: ${metrics?.channelEfficiencyPct?.toFixed(1) ?? "95.2"}%`,
        450,
        scopeY + 105,
      );

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [metrics]);

  return (
    <div className="flex flex-col gap-4 w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200">
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

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => sendPacketFromStation(0)}
            className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-md text-xs font-medium transition"
          >
            Transmit from Node A
          </button>
          <button
            type="button"
            onClick={() => sendPacketFromStation(1)}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-medium transition"
          >
            Transmit from Node B
          </button>
          <button
            type="button"
            onClick={() => {
              sendPacketFromStation(0);
              setTimeout(() => sendPacketFromStation(1), 120);
            }}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-md text-xs font-medium transition"
          >
            Force Collision!
          </button>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="relative w-full h-[380px] bg-slate-900 rounded-lg overflow-hidden border border-slate-800">
        <canvas ref={canvasRef} width={800} height={380} className="w-full h-full block" />
      </div>

      {/* Physics Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="flex flex-col gap-1.5 bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-medium">Coaxial Cable Length</span>
            <span className="text-amber-400 font-mono">{controls.cableLengthMeters} m</span>
          </div>
          <input
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
            <span className="text-slate-300 font-medium">Data Rate</span>
            <span className="text-sky-400 font-mono">{controls.dataRateMbps} Mbps</span>
          </div>
          <input
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
            <span className="text-slate-300 font-medium">Offered Traffic Load (G)</span>
            <span className="text-emerald-400 font-mono">{controls.offeredLoad}</span>
          </div>
          <input
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
