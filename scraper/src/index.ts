import mongo from "./db/mongo";
import { pushMangaFromSlugs } from "./mangaSee123.com/impureDbOps";
import { scrapeFrontPage, scrapeSearch } from "./mangaSee123.com/mangaSee";
import { MangaSee } from "./mangaSee123.com/types";
import log from "./utils/logger";
import sleep from "./utils/sleep";

/* front page */
(async () => {
    let prev = "";
    for (;;) {
        const items = await scrapeFrontPage();
        const latest = items?.map((v) => v.IndexName).join(" ") ?? "";
        void log("front page iteration");
        if (prev === latest) {
            void log("No changes detected");
            void (await sleep(1000 * 60 * 60 * 5)); // 5 minute interval
            continue;
        }
        prev = latest;
        if (!items?.length) {
            void log(
                "Something went wrong while scarping MangaSee front page."
            );
            void (await sleep(1000 * 60 * 30));
            continue;
        } else {
            // causes db side effects
            void pushMangaFromSlugs(items.map(({ IndexName }) => IndexName));
        }
        void (await sleep(1000 * 60 * 60 * 5)); // 5 minute interval
    }
})();

/* all */
(async () => {
    void (await sleep(1000 * 60 * 30));
    for (;;) {
        const items = await scrapeSearch();
        void log("all iteration");
        if (!items?.length) {
            void log(
                "Something went wrong while scarping MangaSee front page."
            );
            void (await sleep(3600000));
            continue;
        } else {
            // causes db side effects
            void (await pushMangaFromSlugs(items.map(({ i }) => i)));
        }
        void (await sleep(43200000)); // 12 hour interval
    }
})();
