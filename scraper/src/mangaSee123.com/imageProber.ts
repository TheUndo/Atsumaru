import axios from "axios";
import mongo from "../db/mongo";
import log from "../utils/logger";
import sleep from "../utils/sleep";
import { upsertMangaSee } from "./impureDbOps";
import { scrapeInfoPage } from "./mangaSee";
import { MangaSee } from "./types";

export default async function imageProber() {
  const db = await mongo();

  const cursor = db.collection("mangaSee").find({});
  while (await cursor.hasNext()) {
    const doc = (await cursor.next()) as MangaSee.MangaInfo;

    if (doc) {
      chapterScrape: for (const chapter of doc?.chapters ?? []) {
        if (chapter) {
          const page = chapter.pages[0];
          if (page) {
            try {
              const responses = await Promise.all(
                page.pageURLs.map(async url => {
                  try {
                    return await axios.head(url);
                  } catch (e) {
                    return { status: 404 };
                  }
                }),
              );

              if (
                !responses.every(
                  response => response.status >= 200 && response.status < 300,
                )
              ) {
                log(
                  "[PROBER]: image failed! FAILURE",
                  doc._id,
                  page.pageURLs.toString(),
                );
                const mangaEntry = await scrapeInfoPage(doc.mangaSeeSlug, true);
                if (mangaEntry) {
                  /* manga.push(mangaEntry); */
                  try {
                    // causes db side effect
                    void (await upsertMangaSee(mangaEntry));
                  } catch (e) {
                    console.error(e);
                    void log("Error when upserting", mangaEntry.title);
                  }
                }
                sleep(1000);
                break chapterScrape;
              } else {
                //log("[PROBER]: image succeeded! :)", page.pageURLs.toString());
                sleep(300);
              }
            } catch (e) {
              log("[PROBER]", e);
            }
          }
        }
      }
    }
  }

  sleep(1000 * 60 * 30);
  imageProber();
}
