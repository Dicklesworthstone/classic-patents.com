"use client";

import { useCallback, useEffect, useState } from "react";
import { soundEngine } from "@/utils/soundEngine";

/**
 * Each 3D scene mounts muted. The first speaker click always unmutes.
 * Remounting (route change) remutes the singleton engine so a leftover
 * unmuted state from the previous patent cannot invert toggleMute().
 */
export function usePatentAudio() {
  const [isAudioMuted, setIsAudioMuted] = useState(true);

  useEffect(() => {
    soundEngine.setMuted(true);
    setIsAudioMuted(true);
    return () => {
      soundEngine.stopContinuousTone();
    };
  }, []);

  const toggleSound = useCallback((onUnmute?: () => void) => {
    const muted = soundEngine.toggleMute();
    setIsAudioMuted(muted);
    if (!muted) onUnmute?.();
    return muted;
  }, []);

  const setMuted = useCallback((muted: boolean) => {
    soundEngine.setMuted(muted);
    setIsAudioMuted(muted);
  }, []);

  return { isAudioMuted, toggleSound, setMuted };
}
