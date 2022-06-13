import * as express from "express";
import mongo from "../../db/mongo";
import { Request } from "../../types";

export default async function getAnilist(req: Request, res: express.Response) {
  const db = await mongo();

  const { id } = req.params;
  try {
    const data = await db.collection("anilist").findOne({
      "data.id": +id,
    });

    return res.send(data);
  } catch (e) {
    return res.status(404).send("404");
  }
}
