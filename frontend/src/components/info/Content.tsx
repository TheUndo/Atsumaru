import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useMedia from "../../hooks/useMedia";
import { parseChapterName } from "../../pages/progressSyncing/ProgressSyncing";
import { resolvePageUrlParameter } from "../../pages/read/helpers";
import { Chapter, MangaInfo, ProgressInfo } from "../../types";
import cm from "../../utils/classMerger";
import getLatestProgress from "../../utils/getLatestProgress";
import percentage from "../../utils/percentage";
import resolveVendorSlug from "../../utils/resolveVendorSlug";
import Button from "../button/Button";
import Header from "../header/Header";
import Icon from "../icon/Icon";
import Loading from "../loading/Loading";
import Poster from "../poster/Poster";
import { ChapterItem } from "./Chapters";
import classes from "./content.module.scss";
import { MangaEndPointResponse } from "./Info";

export default function Content({
  apiData,
  slug,
}: {
  slug?: string;
  apiData: {
    data: MangaEndPointResponse;
    error: string | undefined;
    loading: boolean;
  };
}) {
  const [bookmarked, setBookmarked] = useState(false);
  const { data, error, loading } = apiData;
  const firstChapter =
    data?.manga?.chapters?.[data?.manga?.chapters?.length - 1];

  const latestProgress = data?.progress && getLatestProgress(data.progress);
  const mobile = useMedia(["(max-width: 1000px)"], [true], false);

  return (
    <>
      <div className={classes.content}>
        <div className={classes.topSection}>
          <div className={classes.posterCont}>
            <Poster manga={data?.manga} />
          </div>

          <div className={classes.table}>
            {!error &&
              [
                [
                  "Alternative names",
                  data?.manga?.alternativeNames?.join(", "),
                ],
                [
                  `Author${data?.manga?.authors?.length > 1 ? "s" : ""}`,
                  data?.manga?.authors?.join(", "),
                ],
                [
                  `Status${data?.manga?.statuses?.length > 1 ? "es" : ""}`,
                  <>
                    {data?.manga?.statuses?.[0]}
                    {data?.manga?.statuses?.[1] && (
                      <>
                        ,<br />
                      </>
                    )}
                    {data?.manga?.statuses?.[1]}
                  </>,
                ],
                [`Released`, data?.manga?.release],
                [
                  `Type`,
                  <Link to={`/type/${data?.manga?.type}}`}>
                    {data?.manga?.type}
                  </Link>,
                ],
                [
                  `Official translation`,
                  data?.manga?.officiallyTranslated === "unknown" &&
                  data?.manga?.officiallyTranslated
                    ? "No"
                    : data?.manga?.officiallyTranslated,
                ],
              ].map(
                ([title, content], i) =>
                  content && (
                    <div key={i} className={classes.row}>
                      <div className={classes.head}>{title}</div>
                      <div className={classes.value}>{content}</div>
                    </div>
                  ),
              )}
          </div>
        </div>
        <div className={classes.title}>
          {loading ? (
            <Loading key="loading" />
          ) : (
            <Header key="header" level={1}>
              {error ? "404 - Manga not found" : data?.manga.title}
            </Header>
          )}
        </div>
        {latestProgress && data.manga && (
          <Progress
            manga={data.manga}
            mobile={mobile}
            latest={latestProgress}
          />
        )}
        <div className={cm(classes.controls, "info-page-control")}>
          {latestProgress && data.manga && mobile && (
            <ResumeButton
              style={{
                minWidth: "180px",
                alignItems: "center",
                display: "flex",
              }}
              alignCenter
              manga={data.manga}
              latest={latestProgress}
            />
          )}
          <Button
            disabled={!!error}
            legend={
              error
                ? "404"
                : (firstChapter?.type || "Chapter") +
                  " " +
                  (firstChapter?.name ?? "")
            }
            icon={<Icon icon="playSolid" />}
            to={`/read/${resolveVendorSlug(
              apiData?.data?.manga?.vendor,
            )}/${slug}/${firstChapter?.name}/1`}></Button>
          <Button
            disabled={!!error}
            legend={bookmarked ? "Bookmarked" : "Bookmark"}
            icon={
              <Icon icon={bookmarked ? "bookmarkSolid" : "bookmarkHollow"} />
            }
            onClick={() => setBookmarked(!bookmarked)}></Button>
          <Button
            disabled={!!error}
            legend="Chapters"
            to={`/manga/${resolveVendorSlug(apiData?.data?.manga?.vendor)}/${
              data?.manga?.slug
            }/chapters`}
            icon={<Icon icon="bulletList" />}></Button>
          <Button
            disabled={!!error}
            legend="Share"
            icon={<Icon icon="share" />}></Button>
          <Button
            disabled={!!error}
            legend="AniList"
            to="/"
            icon={<Icon icon="external" />}></Button>
          <Button
            disabled={!!error}
            legend="Report"
            icon={<Icon icon="report" />}></Button>
        </div>
        <div className={cm(classes.genres, "info-page-control")}>
          {data?.manga?.genres?.map(genre => (
            <Genre key={genre} genre={genre} />
          ))}
        </div>
        <div className={classes.description}>
          <p>{data?.manga?.description}</p>
        </div>
        {data?.manga?.chapters?.length && (
          <SlicedChapters
            progress={data?.progress}
            vendor={data?.manga.vendor}
            slug={data?.manga?.slug}
            chapters={data?.manga.chapters}
          />
        )}
      </div>
    </>
  );
}

type ProgressNode = {
  chapter: string;
  meta: {
    page: string;
    progress?: number | undefined;
    date: string;
  };
};

function Progress({
  manga,
  latest,
  mobile,
}: {
  manga: MangaInfo;
  latest: ProgressNode;
  mobile: boolean;
}) {
  const percentage = useMemo(
    () => calculateProgressPercentage(latest, manga),
    [latest, manga],
  );

  return (
    <div className={classes.progressIndicator}>
      {!mobile && (
        <div>
          <ResumeButton hoverReveal manga={manga} latest={latest} />
        </div>
      )}

      <div className={classes.progressCont}>
        <div className={classes.progressStrip}>
          <div className={classes.label}>
            {percentage !== "100%" ? "100%" : "You're all caught up"}
          </div>
          <div
            className={classes.progressBar}
            style={{
              width: percentage,
              borderRadius: percentage !== "100%" ? `0.3em 0 0 0.3em` : ".3em",
            }}>
            <div className={classes.progressToolTip}>{percentage}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function calculateProgressPercentage(latest: ProgressNode, manga: MangaInfo) {
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

function ResumeButton({
  latest,
  manga,
  style,
  ...compProps
}: {
  latest: ProgressNode;
  manga: MangaInfo;
} & React.ComponentProps<typeof Button>) {
  return (
    <Button
      to={`/read/${resolveVendorSlug(manga.vendor)}/${manga.slug}/${
        manga.chapters.find(
          chapter => chapter.name === parseChapterName(latest.chapter),
        )?.name
      }/${resolvePageUrlParameter(
        parseInt(latest.meta.page) || 1,
        latest.meta.progress,
      )}`}
      style={{ background: "var(--accent)", ...(style ?? {}) }}
      iconLoc="right"
      icon={<Icon icon="playSolid" />}
      {...compProps}>
      Resume from last
    </Button>
  );
}

function SlicedChapters({
  slug,
  chapters,
  vendor,
  progress,
}: {
  slug: string;
  chapters: Chapter[];
  vendor: MangaInfo["vendor"];
  progress: ProgressInfo | undefined;
}) {
  return (
    <>
      <div className={classes.chapters}>
        <Header level={2}>Chapters ({chapters.length})</Header>
        {chapters.length > 10 ? (
          <>
            <div className={classes.chapters}>
              {chapters.slice(0, 5).map(chapter => (
                <ChapterItem
                  vendor={vendor}
                  slug={slug}
                  chapter={chapter}
                  key={chapter.name}
                  progress={progress}
                />
              ))}
            </div>
            <div className={classes.chapterEllipsis}>...</div>
            <div className={classes.chapters}>
              {chapters.slice(-5).map(chapter => (
                <ChapterItem
                  progress={progress}
                  vendor={vendor}
                  slug={slug}
                  chapter={chapter}
                  key={chapter.name}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <div className={classes.chapters}>
              {chapters.map(chapter => (
                <ChapterItem
                  progress={progress}
                  vendor={vendor}
                  slug={slug}
                  chapter={chapter}
                  key={chapter.name}
                />
              ))}
            </div>
          </>
        )}
        <Button
          icon={<Icon icon="bulletList" />}
          fullWidth
          to={`/manga/${vendor}/${slug}/chapters`}>
          View all chapters
        </Button>
      </div>
    </>
  );
}
function Genre({ genre }: { genre: string }) {
  return (
    <>
      <div className={classes.genre}>
        <Button icon={<Icon scale={0.8} icon="tag" />} to={`/genre/${genre}`}>
          {genre}
        </Button>
      </div>
    </>
  );
}
