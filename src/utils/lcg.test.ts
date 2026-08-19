import { describe, expect, test } from "bun:test";
import { createLcg } from "./lcg";

describe("Linear Congruential Generator (lcg.ts)", () => {
  test("generates deterministic floating-point sequences in [0, 1) range for the same seed", () => {
    const seed = 12345;
    const rng1 = createLcg(seed);
    const rng2 = createLcg(seed);

    const seq1 = Array.from({ length: 20 }, () => rng1());
    const seq2 = Array.from({ length: 20 }, () => rng2());

    expect(seq1).toEqual(seq2);
    for (const val of seq1) {
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThan(1);
    }
  });

  test("generates different sequences for distinct seeds", () => {
    const rngA = createLcg(100);
    const rngB = createLcg(200);

    const seqA = Array.from({ length: 10 }, () => rngA());
    const seqB = Array.from({ length: 10 }, () => rngB());

    expect(seqA).not.toEqual(seqB);
  });
});
