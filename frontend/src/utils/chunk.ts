export default function chunk<T>(arr: T[], size: number): T[][] {
  return new Array(Math.ceil(arr.length / size))
    .fill(undefined)
    .map<T[]>((_, i) => arr.slice(i * size, i * size + size));
}

export function priorityChunking<T>(idx: number, arr: T[], size: number) {
  const region = [...Array(size)].map((_, i) => i + idx);
  return chunk(
    [
      ...arr.slice(idx, idx + size),
      ...arr.filter((_, i) => !region.includes(i)),
    ],
    size,
  );
}
