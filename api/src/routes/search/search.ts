import * as express from "express";
import mongo from "../../db/mongo";
import { ReadProgress, Request } from "../../types";
import { mongoCollectionByVendor } from "../../utils";
import MeiliSearch from "meilisearch";

console.log("KEY", process.env.MEILI_MASTER_KEY);

export const client = new MeiliSearch({
  host: "http://search_engine:7700",
  apiKey: process.env.MEILI_MASTER_KEY!,
});

export default async function search(req: Request, res: express.Response) {
  const db = await mongo();

  const { query } = req.params;

  const items = await client.index("manga").search(query, {
    limit: 60
  });

  res.send(items);
}
