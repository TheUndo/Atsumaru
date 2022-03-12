export default function percentage(input: number, precision: number) {
  return +(
    (Math.round(input * 10 ** precision) / 10 ** precision) *
    100
  ).toFixed(Math.max(1, precision - 1));
}
