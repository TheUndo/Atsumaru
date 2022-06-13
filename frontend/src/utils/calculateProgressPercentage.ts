import { parseChapterName } from "../pages/progressSyncing/ProgressSyncing";
import { MangaInfo, ProgressNode } from "../types";
import percentage from "./percentage";

export default function calculateProgressPercentage(
  latest: ProgressNode,
  manga: MangaInfo,
) {
  const parsed = parseChapterName(latest.chapter);
  const idx = manga.chapters.findIndex(chapter => {
    return chapter.name === parsed;
  });

  return idx < 0
    ? "0%"
    : idx === 0
    ? "100%"
    : percentage(1 - idx / manga.chapters.length, 3) + "%";
}
