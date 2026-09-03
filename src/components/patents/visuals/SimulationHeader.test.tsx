import { describe, expect, test } from "bun:test";
import { Gauge, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";
import { SimulationHeader } from "./SimulationHeader";

const noOp = () => {};

describe("SimulationHeader", () => {
  test("renders the shared mechanism title, description, and three named controls", () => {
    const html = renderToStaticMarkup(
      <SimulationHeader
        icon={<Gauge />}
        title="Mechanism title"
        description="A concise physical explanation."
        playbackAction={{
          label: "Pause Simulation",
          icon: <Pause />,
          onPress: noOp,
        }}
        audioAction={{
          label: "Unmute Audio",
          icon: <VolumeX />,
          onPress: noOp,
        }}
        onReset={noOp}
      />,
    );

    expect(html).toContain("Mechanism title");
    expect(html).toContain("A concise physical explanation.");
    expect(html).toContain('aria-label="Pause Simulation"');
    expect(html).toContain('aria-label="Unmute Audio"');
    expect(html).toContain('aria-label="Reset Simulation"');
  });

  test("uses the opposite accessible labels when playback is stopped and audio is active", () => {
    const html = renderToStaticMarkup(
      <SimulationHeader
        title="Mechanism title"
        description="A concise physical explanation."
        playbackAction={{
          label: "Play Simulation",
          icon: <Play />,
          onPress: noOp,
        }}
        audioAction={{
          label: "Mute Audio",
          icon: <Volume2 />,
          onPress: noOp,
        }}
        onReset={noOp}
      />,
    );

    expect(html).toContain('aria-label="Play Simulation"');
    expect(html).toContain('aria-label="Mute Audio"');
    expect(html.match(/<button/g)).toHaveLength(3);
  });

  test("keeps audio and reset controls useful for static mechanisms without playback", () => {
    const html = renderToStaticMarkup(
      <SimulationHeader
        title="Static mechanism title"
        description="A static physical explanation."
        audioAction={{
          label: "Mute Audio",
          icon: <Volume2 />,
          onPress: noOp,
        }}
        onReset={noOp}
        withBottomMargin={false}
        descriptionHasTopMargin={false}
      />,
    );

    expect(html).toContain('aria-label="Mute Audio"');
    expect(html).toContain('aria-label="Reset Simulation"');
    expect(html).not.toContain('aria-label="Pause Simulation"');
    expect(html.match(/<button/g)).toHaveLength(2);
  });
});
