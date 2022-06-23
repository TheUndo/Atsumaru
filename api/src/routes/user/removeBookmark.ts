import * as express from "express";
import { ObjectId } from "mongodb";

import mongo from "../../db/mongo";
import { Request } from "../../types";
import { bookmarkSchema } from "./addBookmark";

export default async function removeBookmark(
  req: Request,
  res: express.Response,
) {
  if (!req.user) return void res.status(401).send({ state: "NOT_LOGGED_IN" });
  const result = bookmarkSchema.validate(req.body?.bookmark);

  const db = await mongo();

  if (result.error)
    return void res
      .status(400)
      .send({ state: "INVALID_BOOKMARK", error: result.error });

  await db.collection("bookmarks").deleteOne({
    userID: new ObjectId(req.user._id),
    mangaID: new ObjectId(result.value.mangaID),
  });

  return void res.send({ state: "ok" });
}
