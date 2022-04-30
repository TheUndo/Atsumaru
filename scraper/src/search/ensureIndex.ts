import { Db, WithId } from "mongodb";
import mongo from "../db/mongo";
import { MangaSee } from "../mangaSee123.com/types";
import { client } from "./client";
import indexManga from "./indexManga";

const log = (...args: any[]) => void console.log("[SEARCH]", ...args);

export default async function ensureIndex() {
  try {
    await client.createIndex("manga", {
      primaryKey: "_id",
    });
    return void log("Index created");
  } finally {
    await client.index("manga").updateSettings({
      searchableAttributes: ["title", "description"],
      rankingRules: [
        "words",
        "typo",
        "proximity",
        "attribute",
        "sort",
        "exactness",
        "unixTimestamp:desc",
      ],
    });
    return void log("Index settings updated");
  }
}

export async function ensureDocuments() {
  const db = await mongo();

  return await Promise.all([ensureMS(db).then(() => log("Indexed MangaSee"))]);
}

export async function ensureMS<T extends {}>(db: Db, query?: T) {
  const mapFN = (document: MangaSee.MangaInfo) =>
    ({
      _id: document._id!.toString(),
      vendor: "MANGASEE",
      title: document.title,
      description: document.description,
      anilistID: document.anilistID,
      unixTimestamp: document._id!.generationTime,
      info: document,
    } as const);
  const documents = db
    .collection<WithId<MangaSee.MangaInfo>>("mangaSee")
    .find(query ?? {})
    .batchSize(100);

  let chunk: ReturnType<typeof mapFN>[] = [];
  for await (const document of documents) {
    if (chunk.length > 100) {
      await indexManga(chunk);
      chunk = [];
    }
    chunk.push(mapFN(document));
  }
  if (chunk.length) await indexManga(chunk);
}
