export default function chunk<T>(arr: T[], size: number): T[][] {
  return new Array(Math.ceil(arr.length / size))
    .fill(undefined)
    .map<T[]>((_, i) => arr.slice(i * size, i * size + size));
}
