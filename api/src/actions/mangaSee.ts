import mongo from "../db/mongo";

export async function getLatestUpdates(amount: number) {
  const db = await mongo();

  const items = await db
    .collection("mangaSee")
    .find()
    .sort({
      "latestChapter.date": -1,
    })
    .limit(amount)
    .project({
      title: 1,
      genres: 1,
      cover: 1,
      latestChapter: {
        name: 1,
        date: 1,
      },
      statuses: 1,
      type: 1,
      slug: 1,
    })
    .toArray();

  return items.map(v => ({ manga: { ...v, vendor: "MANGASEE" }, type: "GENERIC_ITEM" }));
}
