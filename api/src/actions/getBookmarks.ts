import { ObjectId } from "mongodb";
import { vendors } from "../constants";
import mongo from "../db/mongo";
import { mongoCollectionByVendor } from "../utils";

export default async function getBookmarks(
  userID: ObjectId,
  start: number,
  end: number,
) {
  const db = await mongo();

  try {
    const items = await db
      .collection<{
        vendor: typeof vendors[number];
        mangaID: ObjectId;
        date: Date;
      }>("bookmarks")
      .find({
        userID,
      })
      .sort({
        date: -1,
      })
      .skip(start)
      .limit(end)
      .toArray();

    const v: typeof vendors[number][] = [];
    for (const item of items) {
      if (!v.includes(item.vendor)) {
        v.push(item.vendor);
      }
    }
    const jobs = v.map(vendor => ({
      manga: items.filter(v => v.vendor === vendor),
      vendor,
    }));

    const result = await Promise.all(
      jobs.map(job =>
        db
          .collection(mongoCollectionByVendor(job.vendor))
          .find({
            $or: job.manga.map(manga => ({
              _id: manga.mangaID,
            })),
          })
          .project({
            chapters: 0,
            genres: 0,
            latestChapter: 0,
          })
          .toArray(),
      ),
    );

    const sorted = result.flat().sort((x, y) => {
      const xMS = items
        .find(item => item.mangaID.toString() === x._id.toString())
        ?.date.getMilliseconds();
      const yMS = items
        .find(item => item.mangaID.toString() === y._id.toString())
        ?.date.getMilliseconds();

      if (!xMS || !yMS) return 0;
      return yMS - xMS;
    });

    return sorted.map(manga => ({ manga }));
  } catch (e) {
    return [];
  }
}
