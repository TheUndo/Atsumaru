import mongo from "../db/mongo";
import log from "../utils/logger";
import sleep from "../utils/sleep";
import { scrapeInfoPage } from "./mangaSee";
import { MangaSee } from "./types";


export async function pushMangaFromSlugs(mangaSeeSlugs: string[]) {
    for (const [i, slug] of mangaSeeSlugs.entries()) {
        void log(`Scraping item ${i + 1}/${mangaSeeSlugs.length} - ${((i + 1) / mangaSeeSlugs.length * 100).toFixed(2)}% - ${slug}`)
        try {
            const mangaEntry = await scrapeInfoPage(slug);
            if (mangaEntry) {
                /* manga.push(mangaEntry); */
                try {
                    // causes db side effect
                    void await upsertMangaSee(mangaEntry);
                } catch (e) {
                    console.error(e);
                    void log("Error when upserting", mangaEntry.title);
                }
            }
        } catch (e) {
            void console.log(e);
            void log("Error while scarping ManagSee info page", e);
        }
        void await sleep(100);
    }
    /* if (manga.length) {
        for (const mangaItem of manga) {
            try {
                // causes db side effect
                void await upsertMangaSee(mangaItem);
            } catch (e) {
                console.error(e);
                void log("Error while upserting", mangaItem.title);
            }
            void await sleep(100);
        }
    } */
}

export async function upsertMangaSee(mangaItem: MangaSee.MangaInfo) {
    const db = await mongo();

    void await db
        .collection("mangaSee")
        .updateOne({
            title: mangaItem.title,
        }, {
            $set: mangaItem,
        }, {
            upsert: true,
        });
    return void log("Successfully upserted", mangaItem.title);
}