import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { soundEngine } from "@/utils/soundEngine";
import { usePatentAudio } from "./usePatentAudio";

function TestAudioHarness(props: { onState?: (state: ReturnType<typeof usePatentAudio>) => void }) {
  const audio = usePatentAudio();
  props.onState?.(audio);
  return <div data-muted={audio.isAudioMuted ? "true" : "false"} />;
}

describe("usePatentAudio Hook", () => {
  test("renders initially in a muted state", () => {
    let capturedState: ReturnType<typeof usePatentAudio> | undefined;
    const html = renderToStaticMarkup(
      <TestAudioHarness
        onState={(s) => {
          capturedState = s;
        }}
      />,
    );

    expect(html).toContain('data-muted="true"');
    expect(capturedState).toBeDefined();
    expect(capturedState?.isAudioMuted).toBe(true);
    expect(capturedState?.isMuted).toBe(true);
    expect(typeof capturedState?.toggleSound).toBe("function");
    expect(typeof capturedState?.setMuted).toBe("function");
  });

  test("toggleSound interacts with soundEngine correctly", () => {
    let capturedState: ReturnType<typeof usePatentAudio> | undefined;
    renderToStaticMarkup(
      <TestAudioHarness
        onState={(s) => {
          capturedState = s;
        }}
      />,
    );

    expect(capturedState).toBeDefined();
    soundEngine.setMuted(true);
    expect(soundEngine.getIsMuted()).toBe(true);

    let callbackFired = false;
    const resultMuted = capturedState?.toggleSound(() => {
      callbackFired = true;
    });

    expect(resultMuted).toBe(false);
    expect(callbackFired).toBe(true);
    expect(soundEngine.getIsMuted()).toBe(false);

    // Toggle back
    const secondMuted = capturedState?.toggleSound();
    expect(secondMuted).toBe(true);
    expect(soundEngine.getIsMuted()).toBe(true);
  });

  test("setMuted explicitly updates underlying sound engine mute state", () => {
    let capturedState: ReturnType<typeof usePatentAudio> | undefined;
    renderToStaticMarkup(
      <TestAudioHarness
        onState={(s) => {
          capturedState = s;
        }}
      />,
    );

    capturedState?.setMuted(false);
    expect(soundEngine.getIsMuted()).toBe(false);

    capturedState?.setMuted(true);
    expect(soundEngine.getIsMuted()).toBe(true);
  });
});
