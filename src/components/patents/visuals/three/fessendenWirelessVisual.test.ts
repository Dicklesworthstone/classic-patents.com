import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { stepFessendenWireless } from "@/physics/catalogKernels";
import { articulateFessendenWireless, buildFessendenWirelessModel } from "./fessendenWirelessModel";

describe("US 706,737 Fessenden source-bounded visual boundary", () => {
  const modelPath = resolve(process.cwd(), "src/components/patents/visuals/three/fessendenWirelessModel.ts");
  const studioPath = resolve(process.cwd(), "src/components/patents/visuals/three/FessendenWireless3D.tsx");
  const simPath = resolve(process.cwd(), "src/components/patents/visuals/FessendenWirelessSim.tsx");

  test("does not expose later detector, voice, or invented quantitative claims", () => {
    const source = [modelPath, studioPath, simPath].map((path) => readFileSync(path, "utf8")).join("\n").toLowerCase();
    for (const forbidden of ["barretter", "electrolytic", "audio modulation", "audio snr", "radiated rf power", "radiation efficiency", "received power", "db spl", "carrierfrequencykhz", "radiatedpowerwatts"]) {
      expect(source).not.toContain(forbidden);
    }
    expect(source).toContain("distributed capacity");
    expect(source).toContain("small self-induction");
    expect(source).toContain("receiving conductor");
  });

  test("shared reader exposes only normalized source relations", () => {
    const matched = stepFessendenWireless({ sourcePeriodMatch: 0.95, distributedCapacity: 0.8, radiatingPortionFraction: 0.7, directResponse: true });
    const unmatched = stepFessendenWireless({ sourcePeriodMatch: 0.2, distributedCapacity: 0.2, radiatingPortionFraction: 0.3, directResponse: false });
    expect(matched.isApproximatelyResonant).toBe(true);
    expect(unmatched.isApproximatelyResonant).toBe(false);
    expect(matched.capacityDistributionPct).toBe(80);
    expect(matched.radiatingPortionPct).toBe(70);
    expect(matched.receiverResponseLabel).toContain("direct");
    expect("radiatedPowerWatts" in (matched as unknown as Record<string, unknown>)).toBe(false);
  });

  test("procedural model retains source geometry and direct response nodes", () => {
    const nodes = buildFessendenWirelessModel();
    expect(nodes.cageAntenna.name).toBe("cylindrical-cage-antenna");
    expect(nodes.receivingConductor.name).toBe("receiving-conductor-and-contact");
    expect(nodes.fineWire.name).toBe("fine-wire-receiver-element");
    expect(nodes.magneticField.name).toBe("constant-or-independent-magnetic-field");
    expect(nodes.sourceRelay.name).toBe("battery-and-relay-circuit");
    articulateFessendenWireless(nodes, { timeSec: 1.25, sourcePeriodMatch: 0.9, distributedCapacity: 0.8, radiatingPortionFraction: 0.7, directResponse: true });
    expect(nodes.microphonicContact.position.y).not.toBe(0.52);
    nodes.materials.forEach((material) => material.dispose());
  });
});
