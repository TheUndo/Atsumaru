import mongo from "../db/mongo";

export default async function getSliders(collection: string, keys: string[]) {
  const db = await mongo();
  const sliders = await db
    .collection<{
      key: string;
      items: any[];
    }>(collection)
    .find({
      $or: keys.map(key => ({ key })),
    })
    .toArray();
  return sliders;
}
