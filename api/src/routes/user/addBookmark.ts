import { ObjectID } from "bson";
import * as express from "express";
import Joi from "joi";
import { ObjectId } from "mongodb";
import { vendors } from "../../constants";
import mongo from "../../db/mongo";
import { Request } from "../../types";
import { mongoCollectionByVendor } from "../../utils";

export const bookmarkSchema = Joi.object<{
  vendor: typeof vendors[number];
  mangaID: string;
}>({
  vendor: Joi.string().valid(...vendors),
  mangaID: Joi.string().min(24).max(24),
});

export default async function addBookmark(req: Request, res: express.Response) {
  if (!req.user) return void res.status(401).send({ state: "NOT_LOGGED_IN" });
  const result = bookmarkSchema.validate(req.body?.bookmark);

  if (result.error)
    return void res
      .status(400)
      .send({ state: "INVALID_BOOKMARK", error: result.error });

  const db = await mongo();

  const exists = await db
    .collection(mongoCollectionByVendor(result.value.vendor))
    .findOne({
      _id: new ObjectID(result.value.mangaID),
    });

  if (!exists)
    return void res
      .status(404)
      .send({ state: "NONEXISTENT_MANGA", error: result.error });

  await db.collection("bookmarks").updateOne(
    {
      userID: new ObjectId(req.user._id),
      mangaID: new ObjectId(result.value.mangaID),
    },
    {
      $set: {
        date: new Date(),
        userID: new ObjectId(req.user._id),
        mangaID: new ObjectId(result.value.mangaID),
        vendor: result.value.vendor,
      },
    },
    {
      upsert: true,
    },
  );

  return void res.send({ state: "ok" });
}
