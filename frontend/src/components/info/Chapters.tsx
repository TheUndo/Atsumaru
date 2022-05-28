import React, { useContext, useMemo, useState } from "react";
import { AppContext } from "../../App";
import useLocalStorage from "../../hooks/useLocalStorage";
import useTimeout from "../../hooks/useTimeout";
import {
  parseChapterName,
  serializeChapterName,
} from "../../pages/progressSyncing/ProgressSyncing";
import { resolvePageUrlParameter } from "../../pages/read/helpers";
import { Chapter, MangaInfo, ProgressInfo } from "../../types";
import { getSpecificProgress } from "../../utils/getLatestProgress";
import normalizeChapterNames from "../../utils/normalizeChapterNames";
import resolveVendorSlug from "../../utils/resolveVendorSlug";
import Button from "../button/Button";
import Header from "../header/Header";
import Icon from "../icon/Icon";
import classes from "./chapters.module.scss";

type Props = {
  chapters: Chapter[];
  slug: string;
  vendor: MangaInfo["vendor"];
  progress: ProgressInfo | undefined;
};

export default function Chapters({ chapters, slug, vendor, progress }: Props) {
  const [sort, setSort] = useLocalStorage("manga-sort-chapters");
  const id = useMemo(() => Math.random() + "", []);

  // performance gains
  const reversed = useMemo(() => chapters?.slice(0).reverse(), [chapters]);
  const sorted = useMemo(
    () => (sort === "asc" ? reversed : chapters) ?? [],
    [reversed, chapters, sort],
  );
  return (
    <>
      <div className={classes?.chapters}>
        <Header level={1}>
          {chapters?.length ? (
            <>Chapters {chapters?.length ? `(${chapters.length})` : ""}</>
          ) : (
            "Loading chapters..."
          )}
        </Header>
        <div className={classes.sort}>
          <Button
            icon={
              <Icon
                orientation={sort === "asc" ? "0" : ".5turn"}
                icon="arrow"
              />
            }
            iconLoc="right"
            label="Sort"
            onClick={() => setSort(sort === "asc" ? "desc" : "asc")}>
            {sort === "asc" ? "Ascending" : "Descending"}
          </Button>
        </div>
        {(chapters?.length ?? 0) > 5 && (
          <div className={classes?.content}>
            {sorted.map((chapter, i, arr) => (
              <ChapterItem
                progress={progress}
                vendor={vendor}
                slug={slug}
                key={i + id}
                chapter={chapter}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export function ChapterItem({
  chapter,
  slug,
  vendor,
  progress,
}: {
  slug: string;
  chapter: Chapter;
  vendor: MangaInfo["vendor"];
  progress: ProgressInfo | undefined;
}) {
  const ctx = useContext(AppContext);
  const [, setQuery] = ctx.searchQuery ?? [];

  const progressNode =
    progress?.chapterProgress &&
    getSpecificProgress(
      progress,
      Object.keys(progress.chapterProgress).findIndex(
        name => parseChapterName(name) === parseChapterName(chapter.name),
      ),
    );

  const [showProgress, setShowProgress] = useState(false);
  useTimeout(() => void setShowProgress(true), 10);

  const cssProgress = progressNode?.meta?.page
    ? `calc((${chapter.pages.findIndex(
        page => progressNode?.meta.page === page.name,
      )} + 1) / ${chapter.pages.length} * 100%)`
    : chapter && progressNode?.meta?.progress
    ? `calc(${progressNode.meta.progress} * 100%)`
    : "0";

  return (
    <>
      <div className={classes.chapter}>
        {progressNode && (
          <div
            className={classes.chapterProgress}
            style={{
              width: showProgress ? cssProgress || "0" : "0",
            }}></div>
        )}
        <Button
          noHoverEffect
          transparent
          to={`/read/${resolveVendorSlug(vendor)}/${slug}/${
            chapter.name
          }/${resolvePageUrlParameter(
            parseInt(progressNode?.meta?.page ?? "1") || 1,
            progressNode?.meta?.progress,
          )}`}
          onClick={() => setQuery?.("")}
          fullWidth
          icon={<Icon icon="playSolid" />}
          className={classes.button}>
          <div className={classes.chapterName}>
            <div className={classes.text}>
              {chapter.type || "Chapter"}{" "}
              {normalizeChapterNames(chapter?.name ?? "404")}
            </div>
            <div className={classes.date}>
              {new Date(chapter.date)?.toLocaleDateString()}
            </div>
          </div>
        </Button>
      </div>
    </>
  );
}
