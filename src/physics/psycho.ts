/** Stevens loudness: 1 sone = 40 phon. Approximate phon ≈ dB SPL at 1 kHz. */
export function sonesFromDbSpl(dbSpl: number): number {
  const phon = Math.max(0, dbSpl);
  if (phon < 40) return Math.max(0, (phon / 40) ** 3);
  return 2 ** ((phon - 40) / 10);
}

export function formatSones(sones: number): string {
  if (sones < 0.1) return sones.toFixed(2);
  if (sones < 10) return sones.toFixed(1);
  return Math.round(sones).toString();
}
