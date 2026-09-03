"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type UpdateParam = (id: string, value: number) => void;

interface WeaveInstrumentInteractions {
  bankActive: boolean;
  enableDeviceBank: () => Promise<void>;
  stopVoiceSampling: () => void;
  sampleVoice: () => Promise<void>;
  voiceActive: boolean;
}

/**
 * Owns browser APIs that must be torn down when the instrument leaves the
 * page. The visual panels deliberately receive only stable interaction
 * callbacks, so changing a readout cannot accidentally recreate an
 * orientation listener or microphone stream.
 */
export function useWeaveInstrumentInteractions(
  updateParam: UpdateParam,
): WeaveInstrumentInteractions {
  const [bankActive, setBankActive] = useState(false);
  const bankFuseRef = useRef<number | null>(null);
  const voiceCleanupRef = useRef<(() => void) | null>(null);
  const voiceActiveRef = useRef(false);
  const [voiceActive, setVoiceActive] = useState(false);

  // Device-orientation banking owns its listener through the component
  // lifecycle: an orphaned listener keeps writing wingWarp into the
  // patentId-keyed physics store after unmount and resurfaces on revisit.
  useEffect(() => {
    if (!bankActive) return;
    const onOri = (event: DeviceOrientationEvent) => {
      const gamma = event.gamma ?? 0;
      updateParam("wingWarp", Math.max(-15, Math.min(15, gamma * 0.4)));
    };
    window.addEventListener("deviceorientation", onOri);
    bankFuseRef.current = window.setTimeout(() => {
      setBankActive(false);
    }, 10_000);
    return () => {
      window.removeEventListener("deviceorientation", onOri);
      if (bankFuseRef.current !== null) {
        window.clearTimeout(bankFuseRef.current);
        bankFuseRef.current = null;
      }
    };
  }, [bankActive, updateParam]);

  const enableDeviceBank = async () => {
    try {
      const orientation = window.DeviceOrientationEvent;
      if (!orientation) return;
      if (bankActive) {
        setBankActive(false);
        return;
      }
      const permissionableOrientation = DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<string>;
      };
      if (
        typeof permissionableOrientation.requestPermission === "function" &&
        (await permissionableOrientation.requestPermission()) !== "granted"
      ) {
        return;
      }
      setBankActive(true);
    } catch {
      // The control remains available for devices that deny orientation permission.
    }
  };

  const stopVoiceSampling = useCallback(() => {
    voiceCleanupRef.current?.();
    voiceCleanupRef.current = null;
    voiceActiveRef.current = false;
    setVoiceActive(false);
  }, []);

  // Final teardown: the mic stream, analyser interval, and AudioContext must
  // not outlive the component (view-tab switches unmount without a route
  // change, so the global pathname-based cleanup never sees them).
  useEffect(() => {
    return () => {
      voiceCleanupRef.current?.();
      voiceCleanupRef.current = null;
    };
  }, []);

  const sampleVoice = async () => {
    if (voiceActiveRef.current) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const context = new AudioContext();
      // getUserMedia resumes in a different task than the click; Safari and
      // sometimes Chrome leave the context suspended, which pins the analyser
      // at silence for the whole window.
      void context.resume().catch(() => {});
      const source = context.createMediaStreamSource(stream);
      const analyser = context.createAnalyser();
      analyser.fftSize = 1024;
      source.connect(analyser);
      const samples = new Uint8Array(analyser.fftSize);
      const intervalId = window.setInterval(() => {
        analyser.getByteTimeDomainData(samples);
        let peak = 0;
        for (const sample of samples) peak = Math.max(peak, Math.abs(sample - 128));
        const decibels = 40 + (peak / 128) * 55;
        updateParam("voiceAmplitude", Math.min(95, Math.max(40, decibels)));
      }, 80);
      const stop = () => {
        window.clearInterval(intervalId);
        for (const track of stream.getTracks()) track.stop();
        void context.close().catch(() => {});
      };
      voiceCleanupRef.current = stop;
      voiceActiveRef.current = true;
      setVoiceActive(true);
      window.setTimeout(() => {
        if (voiceCleanupRef.current === stop) stopVoiceSampling();
      }, 4000);
    } catch {
      // A denied microphone permission leaves the manual voice slider usable.
    }
  };

  return {
    bankActive,
    enableDeviceBank,
    stopVoiceSampling,
    sampleVoice,
    voiceActive,
  };
}
