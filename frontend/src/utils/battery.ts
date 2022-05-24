export type BatteryLevel = {
  level: number;
  charging: boolean;
};

export default async function getBattery() {
  return new Promise<BatteryLevel | null>((resolve, reject) => {
    (navigator as any)
      .getBattery()
      .then((d: any) => {
        resolve({
          level: d?.level ?? 1,
          charging: d?.charging ?? true,
        });
      })
      .catch((e: unknown) => {
        resolve(null);
      });
  });
}
