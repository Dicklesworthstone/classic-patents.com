"use client";

import { ShieldAlert, Volume2, VolumeX } from "lucide-react";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { stepGliddenBarbedWire } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { SimulationHeader } from "./SimulationHeader";
import { usePatentAudio } from "./three/usePatentAudio";

export function GliddenBarbedWireSim() {
  const { params, updateParam, resetParams } = usePatentPhysics("us-157124-glidden-barbed-wire");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const twistsPerFoot = params.twistsPerFoot ?? 5;
  const animalPushForceN = params.animalPushForceN ?? 120;
  const wireTensionNewtons = params.wireTensionN ?? 650;

  const wire = stepGliddenBarbedWire({
    wireTensionN: wireTensionNewtons,
    twistsPerFoot,
    animalPushForceN,
    barbSpacingInches: params.barbSpacingInches ?? 5.0,
  });
  const wireTensionLbs = wire.wireTensionLbs;
  const contactAreaMm2 = wire.contactAreaMm2;
  const contactStressMpa = wire.contactStressMpa;
  const barbSlipForceN = wire.barbSlipThresholdN;
  const isBarbLocked = wire.isLocked;
  const isCattleDeterred = contactStressMpa > 200;

  return (
    <div className="w-full rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-md transition-colors">
      <SimulationHeader
        icon={<ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-400" />}
        title="Joseph F. Glidden's Twisted Wire-Fence Improvement (US 157,124)"
        description="A transverse spur wire bent around one strand and clamped by the twisted fellow strand."
        audioAction={{
          label: isAudioMuted ? "Unmute Audio" : "Mute Audio",
          icon: isAudioMuted ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4 text-amber-600" />
          ),
          onPress: () => {
            toggleSound();
            soundEngine.playSwitchClick();
          },
        }}
        onReset={() => {
          resetParams();
          soundEngine.playSwitchClick();
        }}
      />

      {/* SVG Animation Stage */}
      <div className="relative w-full aspect-[16/9] max-h-[360px] bg-parchment-100 dark:bg-ink-900 rounded-xl overflow-hidden border border-parchment-200 dark:border-ink-800 flex items-center justify-center">
        <svg
          viewBox="0 0 600 340"
          role="img"
          aria-label={`Glidden barbed wire fence simulation: wire tension ${Math.round(wireTensionLbs)} pounds${isBarbLocked ? ", barbs locked against the strand" : ""}${isCattleDeterred ? ", contact stress deterring livestock" : ""}`}
          className="w-full h-full"
        >
          {/* Fence Posts */}
          <rect
            x="20"
            y="40"
            width="30"
            height="260"
            rx="3"
            fill="#5C4033"
            stroke="#3D2817"
            strokeWidth="2"
          />
          <rect
            x="550"
            y="40"
            width="30"
            height="260"
            rx="3"
            fill="#5C4033"
            stroke="#3D2817"
            strokeWidth="2"
          />

          {/* Double-Twisted Wire Strands with Helical Sine Wave */}
          <path
            d={`M 50 170 Q 100 ${170 - wire.twistWaveAmpPx}, 150 170 Q 200 ${170 + wire.twistWaveAmpPx}, 250 170 Q 300 ${170 - wire.twistWaveAmpPx}, 350 170 Q 400 ${170 + wire.twistWaveAmpPx}, 450 170 Q 500 ${170 - wire.twistWaveAmpPx}, 550 170`}
            stroke="#A0AEC0"
            strokeWidth="3.5"
            fill="none"
          />
          <path
            d={`M 50 170 Q 100 ${170 + wire.twistWaveAmpPx}, 150 170 Q 200 ${170 - wire.twistWaveAmpPx}, 250 170 Q 300 ${170 + wire.twistWaveAmpPx}, 350 170 Q 400 ${170 - wire.twistWaveAmpPx}, 450 170 Q 500 ${170 + wire.twistWaveAmpPx}, 550 170`}
            stroke="#718096"
            strokeWidth="3.5"
            fill="none"
          />

          {/* Coiled 2-Point Spur Barbs locked at fixed intervals */}
          {[150, 250, 350, 450].map((x) => (
            <g key={`barb-${x}`} transform={`translate(${x}, 170)`}>
              {/* Coiled wrap around primary strand */}
              <ellipse
                cx="0"
                cy="0"
                rx="7"
                ry="12"
                fill="#D69E2E"
                stroke="#744210"
                strokeWidth="2"
              />
              {/* Two sharp diagonal prongs */}
              <line
                x1="-16"
                y1="-28"
                x2="16"
                y2="28"
                stroke="#E2E8F0"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* Sharp tips */}
              <polygon
                points="-16,-28 -22,-36 -12,-30"
                fill="#E2E8F0"
                stroke="#718096"
                strokeWidth="1"
              />
              <polygon points="16,28 22,36 12,30" fill="#E2E8F0" stroke="#718096" strokeWidth="1" />
            </g>
          ))}

          {/* Contact Force Vector Arrow */}
          <g transform="translate(350, 110)">
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="25"
              stroke="#E53E3E"
              strokeWidth="3"
              markerEnd="url(#arrow)"
            />
            <text
              x="10"
              y="15"
              fill="#E53E3E"
              fontSize="10"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              Animal Contact: {contactStressMpa} MPa / {contactAreaMm2} mm²
            </text>
          </g>
        </svg>
      </div>

      {/* Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Wire Tension
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            {wireTensionNewtons} N ({wireTensionLbs} lbs)
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Contact Stress
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-amber-700 dark:text-amber-500">
            {contactStressMpa} MPa
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Barb Slip Resistance
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-500">
            {barbSlipForceN} N
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Barb Lock &amp; Deterrence
          </span>
          <span
            className={`font-mono text-sm sm:text-base font-bold ${
              isBarbLocked && isCattleDeterred
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-amber-600 dark:text-amber-400"
            }`}
          >
            {isBarbLocked
              ? isCattleDeterred
                ? "Locked & Deterred"
                : "Locked (Low Pain)"
              : "Slipping Barb"}
          </span>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-parchment-200 dark:border-ink-800">
        <SensitivitySlider
          id="glidden-twists"
          patentId="us-157124-glidden-barbed-wire"
          paramKey="twistsPerFoot"
          label="Twists per Foot Pitch"
          value={twistsPerFoot}
          min={2}
          max={10}
          step={1}
          unit="twists/ft"
          onChange={(val) => updateParam("twistsPerFoot", val)}
          allParams={params}
        />
        <SensitivitySlider
          id="glidden-push"
          patentId="us-157124-glidden-barbed-wire"
          paramKey="animalPushForceN"
          label="Animal Push Force"
          value={animalPushForceN}
          min={20}
          max={300}
          step={10}
          unit="N"
          onChange={(val) => updateParam("animalPushForceN", val)}
          allParams={params}
        />
      </div>
    </div>
  );
}
