import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { wrightFlyerPatent } from "@/data/patents/wright-flyer";
import { AudioNarrationPlayer } from "./AudioNarrationPlayer";

describe("AudioNarrationPlayer component", () => {
  test("renders narration player UI, title, speed controls, and buttons", () => {
    const html = renderToStaticMarkup(<AudioNarrationPlayer patent={wrightFlyerPatent} />);

    expect(html).toContain('data-testid="audio-narration-player"');
    expect(html).toContain("Audio Engineering Breakdown");
    expect(html).toContain("Listen to the narrated mechanical breakdown");
    expect(html).toContain("1x");
    expect(html).toContain("1.25x");
    expect(html).toContain("1.5x");
    expect(html).toContain("Listen");
    expect(html).toContain("Mute");
    expect(html).toContain("min listen");
  });
});
