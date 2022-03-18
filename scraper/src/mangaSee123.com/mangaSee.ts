import axios from "axios";
import goLangify from "../utils/golangify";
import log from "../utils/logger";
import { msURL } from "./config";
import * as cheerio from "cheerio";
import aw from "../utils/axiosWrap";
import tryJSONParse from "../utils/tryJSONParse";
import { MangaSee } from "./types";

import slugify from "slugify";
import sleep from "../utils/sleep";
import mongo from "../db/mongo";
import performSearch from "../anilist.co/searchByName";
import upsertManga from "../anilist.co/upsertManga";

export async function scrapeSearch() {
  const url = msURL("/_search.php");

  const { data, error } = await aw<MangaSee.SearchItem[]>(
    goLangify(axios(url)),
  );

  if (error || !data) return void log(error);

  return data;
}

export async function scrapeFrontPage(): Promise<
  MangaSee.ListItem[] | null | undefined
> {
  const url = msURL("/");

  void log("Scraping front page");

  const { data, error } = await aw<string>(goLangify(axios(url)));

  if (error || !data) return void log(error);

  const latestStart = data.slice(
    data.indexOf("vm.LatestJSON = ") + "vm.LatestJSON = ".length,
  );
  const latestEnd = latestStart.slice(0, latestStart.indexOf("}];") + 2);

  const parsed = tryJSONParse<MangaSee.ListItem[]>(latestEnd);

  if (!parsed) return;

  return parsed;
}

/**
 * Scrape a mangasee123.com manga information page.
 *
 * MangaSee Admin, if you're reading this WHY?! WHY?! Did you
 * code your website in this dystopian oop way?! Mad respect for making the website but the code hurts my eyes!
 * Maybe I shouldn't complain, I'm scraping your site... :(
 * @param slug MangaSee slug which for some reason is in pascal case
 */
export async function scrapeInfoPage(
  slug: string,
): Promise<MangaSee.MangaInfo | undefined> {
  const url = msURL(`/manga/${slug}`);

  //void log("Scraping info page", slug);

  const { data, error } = await aw<string>(goLangify(axios(url)));

  if (error || !data) return void log(error);

  const $ = cheerio.load(data);

  const items = new Map<string, string[]>();

  $(".list-group-item").each(function (this: cheerio.Cheerio) {
    const label = $(this).find(".mlabel").text();
    const values = (() => {
      const acc: string[] = [];
      $(this)
        .find(".mlabel")
        .siblings()
        .each(function (this: cheerio.Cheerio) {
          const value = $(this).text();
          if (value) {
            acc.push(value);
          }
        });
      return acc;
    })();
    if (label) {
      void items.set(label, values);
    }
  });
  const db = await mongo();
  const search = await db.collection("mangaSee").findOne<MangaSee.MangaInfo>({
    mangaSeeSlug: slug,
  });

  const title = $(".BoxBody .list-group-item h1").text() ?? "Untitled",
    authors = items.get("Author(s):") ?? [],
    genres = items.get("Genre(s):")?.map(genre => genre.toLowerCase()) ?? [],
    type = items.get("Type:")?.[0] ?? "unknown",
    release = items.get("Released:")?.[0] ?? "unknown",
    alternativeNames = items.get("Alternate Name(s):") ?? [],
    officiallyTranslated = items.get("Official Translation:")?.[0] ?? "unknown",
    statuses = items.get("Status:") ?? ["unknown"],
    description = items.get("Description:")?.[0] ?? "unknown",
    chapters = extractChapters(data)?.map(normalizeChapter) ?? [],
    cover = $(".BoxBody .row img.img-fluid.bottom-5").attr("src");

  const internalSlug = slugify(title, {
    lower: true,
    strict: true,
  });

  let anilistID;
  if (!search?.anilistID) {
    const anilist = await performSearch([title, ...alternativeNames]);

    if (anilist) {
      console.log("Upserting anilist");
      await upsertManga("mangaSeeSlug", internalSlug, anilist);
      anilistID = anilist.id;
    }
  } else {
    anilistID = search?.anilistID;
  }

  /** depends on slug */
  function normalizeChapter(
    rawChapter: MangaSee.RawMangaSeeChapterStruct,
  ): MangaSee.NormalizedMangaSeeChapterStruct {
    const name = normalizeMangaSeeChapterName(rawChapter);

    const date = (() => {
      try {
        return new Date(rawChapter.Date);
      } catch (e) {
        return void console.error(e);
      }
    })();

    return {
      pages: [],
      rawChapter: rawChapter.Chapter,
      chapterURL: URLEncodeChapter(slug, rawChapter.Chapter),
      name,
      title: rawChapter.ChapterName,
      date,
      type: rawChapter.Type,
    };
  }

  const chaptersWithPages: MangaSee.NormalizedMangaSeeChapterStruct[] =
    await (async () => {
      const acc: MangaSee.NormalizedMangaSeeChapterStruct[] = [];
      for (const [i, chapter] of chapters.entries()) {
        const existingChapter = search?.chapters.find(
          v => v.chapterURL === chapter.chapterURL,
        );
        if (existingChapter) {
          void acc.push(existingChapter);
          //void log("Skipping chapter scrape");
          continue;
        }

        const { data, error } = await aw<string>(
          goLangify(axios(`https://mangasee123.com${chapter.chapterURL}`)),
        );
        if (error || !data) {
          void log("Error while scarping page from: ", slug, "error: ", error);
          continue;
        }

        // Dangerously assumes page number to reflect index + 1
        const pagesCount = getChapterDirectory(data)?.Page ?? 0;

        void log(
          `Scraping pages of chapter ${i + 1}/${chapters.length} - ${Math.round(
            +(((i + 1) / chapters.length) * 100).toFixed(2),
          )}%`,
        );

        const pages = (() => {
          const acc: MangaSee.Page[] = [];
          for (let page = 1; page <= pagesCount; page++) {
            const pageURL = generatePageSrc(
              getCurPathName(data),
              slug,
              getChapterDirectory(data)?.Directory ?? "",
              chapter.rawChapter,
              page + "",
            );
            void acc.push({
              pageURLs: [pageURL],
              name: page + "",
            });
          }
          return acc;
        })();

        void acc.push({
          ...chapter,
          pages,
        });

        await sleep(20);
      }
      return acc;
    })();

  return {
    title,
    authors,
    genres,
    type,
    release,
    alternativeNames,
    officiallyTranslated,
    statuses,
    description,
    chapters: chaptersWithPages,
    latestChapter: chapters[0],
    cover,
    slug: internalSlug,
    mangaSeeSlug: slug,
    anilistID,
  };
}

function extractChapters(html: string) {
  const startChapters = html.slice(
    html.indexOf("vm.Chapters =") + "vm.Chapters =".length,
  );
  const endChapters = startChapters.slice(0, startChapters.indexOf("}];") + 2);

  const data = tryJSONParse<MangaSee.RawMangaSeeChapterStruct[]>(endChapters);

  return data;
}

/* function extractPagesFromChapter(readSlug: string) {

    const { data, error } = await aw<string>(goLangify(axios(url)));


} */

/**
 * Not my code, this was taken from the MangaSee frontend.
 * Very annoying angular obfuscation more or less removed.
 *
 * For context MangaSee formats its chapter name extremely weirdly, perhaps
 * as a half assed work around for old php limitations which are then remedied by
 * client javascript. Completely irrational but whatever.
 * @param chapterName MangaSee encoded chapter name
 * @returns Normalized chapter name
 */
function normalizeMangaSeeChapterName(
  chapter: MangaSee.RawMangaSeeChapterStruct,
) {
  const chapterName = chapter.Chapter ?? "";
  const left = parseInt(chapterName.slice(1, -1));
  const right = chapterName[chapterName.length - 1];
  const res = 0 === +right ? left.toString() : `${left}.${right}`;
  return `${
    /* handle prologues */
    chapter.Type.toLowerCase() === "chapter"
      ? ""
      : chapter.Type?.[0]?.toLowerCase() ?? ""
  }${res}`;
}

/**
 * Another deobfuscated angular frontend function.
 *
 * Yeah this one was really cancerous, AngularJS really likes to violate every no-no in
 * the js handbook. AngularJS is truly a joke, thank God it's almost dead...
 * @param slug Manga slug
 * @param rawChapter MangaSee encoded chapter name
 * @returns Url to the read page
 */
function URLEncodeChapter(slug: string, rawChapter: string) {
  var index = "";
  var t = rawChapter.substring(0, 1);
  if (parseInt(t) !== 1) index = "-index-" + t;
  var n = parseInt(rawChapter.slice(1, -1)),
    m = "",
    a = rawChapter[rawChapter.length - 1];
  return (
    0 !== parseInt(a) && (m = "." + a),
    "/read-online/" + slug + "-chapter-" + n + m + index + ".html"
  );
}

function getCurPathName(html: string) {
  const start = html.slice(
    html.indexOf('vm.CurPathName = "') + 'vm.CurPathName = "'.length,
  );
  const end = start.slice(0, start.indexOf('";') + 0);

  return end;
}

/** unclear what "Directory" means, it's something stupid... MangaSee is coded like a joke... */
function getChapterDirectory(html: string) {
  const start = html.slice(
    html.indexOf("vm.CurChapter = ") + "vm.CurChapter = ".length,
  );
  const end = start.slice(0, start.indexOf("};") + 1);

  const data = tryJSONParse<{ Directory: string; Page: number }>(end);

  return data;
}

/**
 * More angular nonsense, please help me this is actually the stupidest frontend code I've seen.
 * This 2012 era angular + jQuery is nauseatingly bad...
 *
 * @param slug MangaSee slug
 * @param directory IDEK
 * @param rawChapter Raw MangaSee encoded chapter name
 * @param page page unencoded starts from 1
 * @returns Png src
 */
function generatePageSrc(
  curPathName: string,
  slug: string,
  directory: string,
  rawChapter: string,
  page: string,
) {
  return `https://${curPathName}/manga/${slug}/${
    directory === "" ? "" : directory + "/"
  }${formatChapterString(rawChapter)}-${formatPageString(page)}.png`;
}

/** deobfuscated angular code */
function formatChapterString(ChapterString: string) {
  var Chapter = ChapterString.slice(1, -1);
  var Odd = ChapterString[ChapterString.length - 1];
  if (parseInt(Odd) === 0) {
    return Chapter;
  } else {
    return Chapter + "." + Odd;
  }
}

/** deobfuscated angular code */
function formatPageString(PageString: string) {
  var s = "000" + PageString;
  return s.slice(s.length - 3);
}
