"use client";

import {
  ChevronDown,
  ChevronUp,
  Headphones,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { Patent } from "@/types/patent";

interface AudioNarrationPlayerProps {
  patent: Patent;
}

type NarrationSentence = {
  id: string;
  text: string;
};

const WORDS_PER_MINUTE = 150;
const SERVER_SPEECH_SYNTHESIS_SUPPORTED = true;

function subscribeToSpeechSynthesisSupport(): () => void {
  return () => {};
}

function speechSynthesisIsSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function getServerSpeechSynthesisSupport(): boolean {
  return SERVER_SPEECH_SYNTHESIS_SUPPORTED;
}

function splitNarrationSentences(sections: readonly string[]): NarrationSentence[] {
  const sentences: NarrationSentence[] = [];

  for (const [sectionIndex, section] of sections.entries()) {
    const matches = section.match(/[^.!?]+[.!?]+(\s+|$)/g) ?? [section];
    for (const [sentenceIndex, match] of matches.entries()) {
      const text = match.trim();
      if (text) {
        sentences.push({ id: `${sectionIndex}:${sentenceIndex}:${text}`, text });
      }
    }
  }

  return sentences;
}

function joinNarrationSentences(sentences: readonly NarrationSentence[]): string {
  const parts: string[] = [];
  for (const sentence of sentences) {
    parts.push(sentence.text);
  }
  return parts.join(" ");
}

function estimateNarrationMinutes(sentences: readonly NarrationSentence[]): number {
  let wordCount = 0;
  for (const sentence of sentences) {
    wordCount += sentence.text.match(/\S+/g)?.length ?? 0;
  }
  return Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
}

export function AudioNarrationPlayer({ patent }: AudioNarrationPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  // The optimistic server snapshot preserves the original SSR control state;
  // hydration then reads the real browser capability without a mount-time setState.
  const isSupported = useSyncExternalStore(
    subscribeToSpeechSynthesisSupport,
    speechSynthesisIsSupported,
    getServerSpeechSynthesisSupport,
  );

  // Compile the curated audio script from high-yield Plain English sections
  const narrationScript = useMemo(() => {
    const sections: string[] = [];
    sections.push(
      `${patent.shortTitle}, United States Patent number ${patent.patentNumber}, granted on ${patent.grantDate} to ${patent.inventors.join(", ")}.`,
    );
    if (patent.subtitle) {
      sections.push(patent.subtitle);
    }
    if (patent.plainEnglishExplanation?.overview) {
      sections.push(patent.plainEnglishExplanation.overview);
    }
    if (patent.plainEnglishExplanation?.coreMechanism) {
      sections.push(patent.plainEnglishExplanation.coreMechanism);
    }
    if (patent.plainEnglishExplanation?.whyItMattersToday) {
      sections.push(patent.plainEnglishExplanation.whyItMattersToday);
    }
    return sections;
  }, [patent]);

  // Break text into sentences for sentence-level follow-along highlights
  const sentences = useMemo(() => splitNarrationSentences(narrationScript), [narrationScript]);
  const estimatedMinutes = useMemo(() => estimateNarrationMinutes(sentences), [sentences]);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const stopPlayback = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentSentenceIndex(0);
  }, []);

  // Cleanup on unmount or when patent changes
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const startPlayback = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const fullText = joinNarrationSentences(sentences);
    const utterance = new SpeechSynthesisUtterance(fullText);
    utteranceRef.current = utterance;

    utterance.rate = speed;
    utterance.volume = isMuted ? 0 : 1;

    // Pick a natural English voice if available
    const voices = window.speechSynthesis.getVoices();
    const englishVoice =
      voices.find(
        (v) =>
          v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Enhanced")),
      ) ||
      voices.find((v) => v.lang.startsWith("en")) ||
      voices[0];

    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onboundary = (event) => {
      if (event.name === "sentence" || event.charIndex !== undefined) {
        let accumulated = 0;
        for (let i = 0; i < sentences.length; i++) {
          accumulated += sentences[i].text.length + 1;
          if (event.charIndex < accumulated) {
            setCurrentSentenceIndex(i);
            break;
          }
        }
      }
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentSentenceIndex(0);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  }, [sentences, speed, isMuted]);

  const togglePlayPause = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (!isPlaying) {
      startPlayback();
    } else if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, [isPlaying, isPaused, startPlayback]);

  const changeSpeed = (newSpeed: number) => {
    setSpeed(newSpeed);
    if (isPlaying) {
      // Restart at current sentence with new rate
      startPlayback();
    }
  };

  return (
    <div
      data-testid="audio-narration-player"
      className="rounded-2xl border border-amber-300/60 dark:border-amber-900/50 bg-gradient-to-r from-amber-50/70 via-parchment-100/60 to-amber-50/70 dark:from-amber-950/20 dark:via-ink-900/60 dark:to-amber-950/20 p-4 shadow-xs space-y-3"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Title & badge */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-700/10 dark:bg-amber-400/10 flex items-center justify-center text-amber-700 dark:text-amber-400">
            <Headphones className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-sm text-ink-900 dark:text-parchment-100">
                Audio Engineering Breakdown
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-semibold border border-amber-300/60 dark:border-amber-800/60">
                ~{estimatedMinutes} min listen
              </span>
            </div>
            <p className="text-xs font-sans text-ink-600 dark:text-ink-400">
              Listen to the narrated mechanical breakdown and civilizational context
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Speed Selector */}
          <div className="flex items-center rounded-lg bg-parchment-200/80 dark:bg-ink-800 p-0.5 text-xs font-mono">
            {[1.0, 1.25, 1.5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => changeSpeed(s)}
                className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                  speed === s
                    ? "bg-amber-700 text-white font-bold"
                    : "text-ink-600 dark:text-parchment-300 hover:text-ink-900"
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Mute Toggle */}
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-lg text-ink-600 dark:text-parchment-300 hover:bg-parchment-200 dark:hover:bg-ink-800 transition-colors cursor-pointer"
            title={isMuted ? "Unmute" : "Mute"}
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Reset / Stop Button */}
          {isPlaying && (
            <button
              type="button"
              onClick={stopPlayback}
              className="p-2 rounded-lg text-ink-600 dark:text-parchment-300 hover:bg-parchment-200 dark:hover:bg-ink-800 transition-colors cursor-pointer"
              title="Stop Narration"
              aria-label="Stop Narration"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {/* Main Play / Pause Button */}
          <button
            type="button"
            onClick={togglePlayPause}
            disabled={!isSupported}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 disabled:opacity-50 disabled:hover:bg-amber-700 text-white text-xs font-sans font-bold transition-colors shadow-xs cursor-pointer disabled:cursor-not-allowed"
            aria-label={
              !isSupported
                ? "Speech synthesis not supported in this browser"
                : isPlaying && !isPaused
                  ? "Pause Narration"
                  : "Play Narration"
            }
          >
            {isPlaying && !isPaused ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isPaused ? "Resume" : "Listen"}</span>
              </>
            )}
          </button>

          {/* Transcript Toggle */}
          <button
            type="button"
            onClick={() => setIsTranscriptOpen(!isTranscriptOpen)}
            className="p-2 rounded-lg text-ink-600 dark:text-parchment-300 hover:bg-parchment-200 dark:hover:bg-ink-800 transition-colors cursor-pointer"
            title="Toggle Transcript"
            aria-label="Toggle Transcript"
            aria-expanded={isTranscriptOpen}
          >
            {isTranscriptOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Real-time Subtitle / Sentence Highlight Banner */}
      {isPlaying && sentences[currentSentenceIndex] && (
        <div className="p-3 rounded-xl bg-amber-100/60 dark:bg-amber-950/40 border border-amber-300/40 dark:border-amber-800/40 text-xs sm:text-sm font-serif italic text-ink-900 dark:text-parchment-100 leading-relaxed">
          &ldquo;{sentences[currentSentenceIndex].text}&rdquo;
        </div>
      )}

      {/* Expandable Narration Transcript Drawer */}
      {isTranscriptOpen && (
        <div className="pt-3 border-t border-amber-300/40 dark:border-amber-900/40 space-y-2 text-xs">
          <div className="font-mono text-[11px] font-bold text-amber-800 dark:text-amber-400">
            Narration Transcript:
          </div>
          <div className="p-3 rounded-xl bg-parchment-100 dark:bg-ink-900 text-ink-800 dark:text-parchment-200 font-serif space-y-2 max-h-48 overflow-y-auto leading-relaxed border border-parchment-300 dark:border-ink-800">
            {sentences.map((sentence, idx) => (
              <span
                key={sentence.id}
                className={`transition-colors mr-1 ${
                  isPlaying && idx === currentSentenceIndex
                    ? "bg-amber-300/50 dark:bg-amber-700/50 font-semibold text-ink-950 dark:text-white px-1 py-0.5 rounded-sm"
                    : ""
                }`}
              >
                {sentence.text}{" "}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
