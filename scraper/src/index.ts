import getTrendingAnilist from "./anilist.co/getTrending";
import performSearch from "./anilist.co/searchByName";
import {
  msFrontPageUpsert,
  pushMangaFromSlugs,
} from "./mangaSee123.com/impureDbOps";
import { scrapeFrontPage, scrapeSearch } from "./mangaSee123.com/mangaSee";
import ensureIndex, { ensureDocuments } from "./search/ensureIndex";
import log from "./utils/logger";
import sleep from "./utils/sleep";

void ensureIndex()
  .then(() => ensureDocuments())
  .catch(console.error);
//performSearch(["Koujo Denka no Katei Kyoushi"]).then(console.log);

/* trending */

(async () => {
  for (;;) {
    await getTrendingAnilist();
    await sleep(21600000);
  }
})();

/* front page */
(async () => {
  let prev = "";
  for (;;) {
    const { latestUpdates, hotUpdates, newSeries, topTen } =
      (await scrapeFrontPage()) ?? {};

    if (hotUpdates) msFrontPageUpsert("hotUpdates", hotUpdates);
    if (newSeries) msFrontPageUpsert("newSeries", newSeries);
    if (topTen) msFrontPageUpsert("topTen", topTen);

    const latest = latestUpdates?.map(v => v.IndexName).join(" ") ?? "";
    void log("front page iteration");
    if (prev === latest) {
      void log("No changes detected");
      void (await sleep(1000 * 60 * 60 * 5)); // 5 minute interval
      continue;
    }
    prev = latest;
    if (!latestUpdates?.length) {
      void log("Something went wrong while scarping MangaSee front page.");
      void (await sleep(1000 * 60 * 30));
      continue;
    } else {
      // causes db side effects
      void pushMangaFromSlugs(latestUpdates.map(({ IndexName }) => IndexName));
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
      void log("Something went wrong while scarping MangaSee front page.");
      void (await sleep(3600000));
      continue;
    } else {
      // causes db side effects
      void (await pushMangaFromSlugs(items.map(({ i }) => i)));
    }
    void (await sleep(43200000)); // 12 hour interval
  }
})();
