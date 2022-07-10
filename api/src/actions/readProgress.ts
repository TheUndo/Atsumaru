import { ObjectId } from "mongodb";
import { vendors } from "../constants";
import mongo from "../db/mongo";
import { ProjectedReadProgress, User } from "../types";
import { mongoCollectionByVendor } from "../utils";

export async function getRecentlyRead(user: User, limit: number, skip = 0) {
  if (!user) return [];
  const db = await mongo();
  try {
    const items = await db
      .collection("readProgress")
      .find({
        "user._id": user._id,
      })
      .sort({
        lastUpdated: -1,
      })
      .limit(Math.min(limit, 100))
      .skip(skip)
      .map(async doc => ({
        type: "PROGRESS_ITEM",
        progress: doc,
        manga: {
          ...(await db.collection(mongoCollectionByVendor(doc.vendor)).findOne({
            slug: doc.mangaSlug,
          })),
          vendor: doc.vendor,
        },
      }))
      .toArray();

    return (await Promise.all(items)).filter(
      doc => !!doc.manga && !!doc.progress,
    );
  } catch (e) {
    console.error(e);
    return [];
  }
}
