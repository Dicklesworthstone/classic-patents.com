/**
 * Linear Congruential Generator (LCG) for deterministic pseudo-randomness.
 * Useful for replacing Math.random() in visual particle systems and acoustic triggers
 * to ensure that all observers see the same cascade given the same seed/time.
 */

export function createLcg(initialSeed: number) {
  // Numerical Recipes LCG constants mod 2^32; the product stays under 2^53,
  // so float64 multiplication is exact. The seed is normalized into the
  // unsigned 32-bit domain because JS `%` keeps the dividend's sign.
  let seed = Math.floor(initialSeed) >>> 0;
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}
