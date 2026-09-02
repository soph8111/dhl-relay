// Formats a duration in seconds as mm:ss, for display in the UI.
export function formatSeconds(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.round(totalSeconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function formatSignedSeconds(totalSeconds: number): string {
  const sign = totalSeconds < 0 ? '-' : '+';
  return `${sign}${formatSeconds(Math.abs(totalSeconds))}`;
}
