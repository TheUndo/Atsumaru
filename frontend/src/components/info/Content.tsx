import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Chapter, MangaInfo } from "../../types";
import cm from "../../utils/classMerger";
import resolveVendorSlug from "../../utils/resolveVendorSlug";
import Button from "../button/Button";
import Header from "../header/Header";
import Icon from "../icon/Icon";
import Loading from "../loading/Loading";
import Poster from "../poster/Poster";
import { ChapterItem } from "./Chapters";
import classes from "./content.module.scss";

export default function Content({
  apiData,
  slug,
}: {
  slug?: string;
  apiData: {
    data: MangaInfo;
    error: string | undefined;
    loading: boolean;
  };
}) {
  const [bookmarked, setBookmarked] = useState(false);
  const { data, error, loading } = apiData;
  const firstChapter = data?.chapters?.[data?.chapters?.length - 1];

  return (
    <>
      <div className={classes.content}>
        <div className={classes.topSection}>
          <div className={classes.posterCont}>
            <Poster manga={data} />
          </div>

          <div className={classes.table}>
            {!error &&
              [
                ["Alternative names", data?.alternativeNames?.join(", ")],
                [
                  `Author${data?.authors?.length > 1 ? "s" : ""}`,
                  data?.authors?.join(", "),
                ],
                [
                  `Status${data?.statuses?.length > 1 ? "es" : ""}`,
                  <>
                    {data?.statuses?.[0]}
                    {data?.statuses?.[1] && (
                      <>
                        ,<br />
                      </>
                    )}
                    {data?.statuses?.[1]}
                  </>,
                ],
                [`Released`, data?.release],
                [`Type`, <Link to={`/type/${data?.type}}`}>{data?.type}</Link>],
                [
                  `Official translation`,
                  data?.officiallyTranslated === "unknown" &&
                  data?.officiallyTranslated
                    ? "No"
                    : data?.officiallyTranslated,
                ],
              ].map(
                ([title, content], i) =>
                  content && (
                    <div key={i} className={classes.row}>
                      <div className={classes.head}>{title}</div>
                      <div className={classes.value}>{content}</div>
                    </div>
                  )
              )}
          </div>
        </div>
        <div className={classes.title}>
          {loading ? (
            <Loading key="loading" />
          ) : (
            <Header key="header" level={1}>
              {error ? "404 - Manga not found" : data.title}
            </Header>
          )}
        </div>
        <div className={cm(classes.controls, "info-page-control")}>
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
            to={`/read/${resolveVendorSlug(apiData?.data?.vendor)}/${slug}/${
              firstChapter?.name
            }/1`}
          ></Button>
          <Button
            disabled={!!error}
            legend={bookmarked ? "Bookmarked" : "Bookmark"}
            icon={
              <Icon icon={bookmarked ? "bookmarkSolid" : "bookmarkHollow"} />
            }
            onClick={() => setBookmarked(!bookmarked)}
          ></Button>
          <Button
            disabled={!!error}
            legend="Chapters"
            to={`/manga/${resolveVendorSlug(apiData?.data?.vendor)}/${
              data?.slug
            }/chapters`}
            icon={<Icon icon="bulletList" />}
          ></Button>
          <Button
            disabled={!!error}
            legend="Share"
            icon={<Icon icon="share" />}
          ></Button>
          <Button
            disabled={!!error}
            legend="AniList"
            to="/"
            icon={<Icon icon="external" />}
          ></Button>
          <Button
            disabled={!!error}
            legend="Report"
            icon={<Icon icon="report" />}
          ></Button>
        </div>
        <div className={cm(classes.genres, "info-page-control")}>
          {data?.genres?.map((genre) => (
            <Genre key={genre} genre={genre} />
          ))}
        </div>
        <div className={classes.description}>
          <p>{data?.description}</p>
        </div>
        {data?.chapters?.length && (
          <SlicedChapters
            vendor={data.vendor}
            slug={data?.slug}
            chapters={data.chapters}
          />
        )}
      </div>
    </>
  );
}

function SlicedChapters({
  slug,
  chapters,
  vendor,
}: {
  slug: string;
  chapters: Chapter[];
  vendor: MangaInfo["vendor"];
}) {
  return (
    <>
      <div className={classes.chapters}>
        <Header level={2}>Chapters ({chapters.length})</Header>
        {chapters.length > 10 ? (
          <>
            <div className={classes.chapters}>
              {chapters.slice(0, 5).map((chapter) => (
                <ChapterItem
                  vendor={vendor}
                  slug={slug}
                  chapter={chapter}
                  key={chapter.name}
                />
              ))}
            </div>
            <div className={classes.chapterEllipsis}>...</div>
            <div className={classes.chapters}>
              {chapters.slice(-5).map((chapter) => (
                <ChapterItem
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
              {chapters.map((chapter) => (
                <ChapterItem
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
          to={`/manga/${vendor}/${slug}/chapters`}
        >
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
        <Button icon={<Icon icon="tag" />} to={`/genre/${genre}`}>
          {genre}
        </Button>
      </div>
    </>
  );
}
