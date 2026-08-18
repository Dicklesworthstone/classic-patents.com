/**
 * Linear Congruential Generator (LCG) for deterministic pseudo-randomness.
 * Useful for replacing Math.random() in visual particle systems and acoustic triggers
 * to ensure that all observers see the same cascade given the same seed/time.
 */

export function createLcg(initialSeed: number) {
  let seed = Math.floor(initialSeed);
  return () => {
    // POSIX lrand48 parameters
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}
