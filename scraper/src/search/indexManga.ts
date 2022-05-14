import { ObjectId } from "mongodb";
import { client } from "./client";
import ensureIndex from "./ensureIndex";

export default async function indexManga(
  manga: {
    _id: string | ObjectId;
    vendor: "MANGASEE";
    title: string;
    description: string;
    anilistID?: number;
    unixTimestamp: number;
    info: any;
  }[],
) {
  return await client.index("manga").updateDocuments(
    manga.map(manga => {
      try {
        delete manga.info.chapters;
      } catch (e) {}
      return manga;
    }),
  );
}
