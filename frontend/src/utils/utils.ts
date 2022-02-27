export function clamp(
  lowest: number,
  clampee: number,
  highest: number
): number {
  const { min, max } = Math;
  return min(highest, max(clampee, lowest));
}

export function tryJSONParse<T>(string?: string | null): T | null {
  if (!string) return null;
  try {
    return JSON.parse(string);
  } catch (e) {
    return null;
  }
}
