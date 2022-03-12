import * as express from "express";
import mongo from "../db/mongo";
import { ReadProgress, Request } from "../types";
import { mongoCollectionByVendor } from "../utils";

const vendor = "MANGASEE";

export default async function manga(req: Request, res: express.Response) {
  const db = await mongo();

  const { slug } = req.params;

  if (!slug) return void res.status(404).send("invalid slug");
  try {
    const [manga, progress] = await Promise.all(
      [
        db.collection(mongoCollectionByVendor(vendor)).findOne({
          slug,
        }),
        req.user &&
          db.collection("readProgress").findOne<ReadProgress>({
            mangaSlug: slug,
            "user._id": req.user._id,
          }),
      ].filter(v => v instanceof Promise),
    );

    if (!manga) return void res.status(404).send("manga not found in db");

    return void res.send({
      manga: {
        ...manga,
        vendor,
      },
      progress,
      vendor,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send("internal server error see logs");
  }
}
