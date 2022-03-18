export default function chunk<T>(arr: T[], size: number): T[][] {
  return new Array(Math.ceil(arr.length / size))
    .fill(undefined)
    .map<T[]>((_, i) => arr.slice(i * size, i * size + size));
}

export function priorityChunking<T>(idx: number, arr: T[], size: number) {
  return [
    [arr[idx]],
    ...chunk([...arr.slice(idx + 1), ...arr.slice(0, idx)], size),
  ];
}
