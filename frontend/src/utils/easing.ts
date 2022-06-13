const { pow } = Math;

export function easeInOutQuad(x: number): number {
  return x < 0.5 ? 2 * x * x : 1 - pow(-2 * x + 2, 2) / 2;
}

export function easeOutCubic(x: number): number {
  return 1 - pow(1 - x, 3);
}
