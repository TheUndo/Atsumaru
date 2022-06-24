import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import React, {
  ComponentProps,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useQuery, UseQueryResult } from "react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../../appContext";
import { apiBase } from "../../hooks/useApi";
import { parseChapterName } from "../../pages/progressSyncing/ProgressSyncing";
import { resolvePageUrlParameter } from "../../pages/read/helpers";
import {
  useIsBookmarked,
  useRemoveBookmark,
  useSetBookmark,
} from "../../state/mangaInfo";
import { Anilist, MangaInfo, ProgressInfo, ProgressNode } from "../../types";
import calculateProgressPercentage from "../../utils/calculateProgressPercentage";
import cm from "../../utils/classMerger";
import getLatestProgress from "../../utils/getLatestProgress";
import resolveVendorSlug from "../../utils/resolveVendorSlug";
import Button from "../button/Button";
import Header from "../header/Header";
import Icon from "../icon/Icon";
import { ChapterItem } from "../info/Chapters";
import { MangaEndPointResponse } from "../info/Info";
import Loading from "../loading/Loading";
import Poster from "../poster/Poster";
import Switcher, { SwitcherItemStruct } from "../switcher/Switcher";
import classes from "./desktopManga.module.scss";

type Props = {
  apiData: UseQueryResult<MangaEndPointResponse, unknown>;
  slug?: string;
};

export default function DesktopManga({ apiData, slug }: Props) {
  const { data, isLoading, status } = apiData;
  const ref = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const appCtx = useContext(AppContext);
  const [signedIn, setSignedIn] = appCtx.signIn ?? [];
  const [loggedIn] = appCtx.loggedIn ?? [];
  const exit = () =>
    navigate((location.state as any)?.backgroundLocation.pathname ?? "/");
  const [bookmarked, setBookmarked] = useState(false);
  const firstChapter =
    data?.manga?.chapters?.[data?.manga?.chapters?.length - 1];
  const anilistID = data?.manga.anilistID;
  const anilistData = useQuery<Anilist>(
    ["anilistInfo", anilistID],
    () => fetch(`${apiBase}/anilist/${anilistID}`).then(d => d.json()),
    {
      enabled: !!anilistID,
    },
  );
  const setBookmark = useSetBookmark(
    {
      enabled: false,
    },
    () => setBookmarked(true),
    apiData.data?.manga,
  );
  const removeBookmark = useRemoveBookmark(
    {
      enabled: false,
    },
    () => setBookmarked(false),
    apiData.data?.manga,
  );

  const isBookmarked = useIsBookmarked<{ state: string; bookmark?: unknown }>(
    {
      enabled: false,
    },
    data => {
      console.log(data.bookmark);
      setBookmarked(!!data.bookmark);
    },
    apiData.data?.manga,
  );

  useEffect(() => {
    if (!!apiData.data?.manga._id) isBookmarked.refetch();
  }, [apiData]);

  const shown = !!slug;

  useEffect(() => {
    if (ref.current && shown) ref.current.scrollTo(0, 0);
  }, [ref, shown]);

  const latestProgress: ProgressNode | undefined =
    data?.progress && getLatestProgress(data.progress);
  //TODO:
  /* const percentage = useMemo(
    () =>
      latestProgress && data?.manga
        ? calculateProgressPercentage(latestProgress, data.manga)
        : "?%",
    [latestProgress, data?.manga],
  ); */
  useLayoutEffect(() => {
    if (!ref.current) return;

    // used to allow render cycle before scroll locks
    setTimeout(() => {
      if (!ref.current) return;
      if (shown) disableBodyScroll(ref.current);
      else enableBodyScroll(ref.current);
    }, 10);
  }, [shown]);

  return createPortal(
    <div className={cm(classes.manga, shown && classes.shown)}>
      <div className={classes.bg}></div>
      <div className={classes.content} onClick={exit} ref={ref}>
        <div className={classes.inner}>
          <Nav forwardRef={ref} data={data?.manga} />
          <div
            className={classes.offset}
            onClick={e => void e.stopPropagation()}>
            <div className={classes.topSection}>
              <aside className={classes.aside}>
                <div className={classes.poster}>
                  <Poster manga={data?.manga} />
                </div>
                <div className={classes.buttons}>
                  {!latestProgress && (
                    <Button
                      icon={<Icon icon="book" />}
                      iconLoc="right"
                      beefy
                      accent
                      fullWidth
                      to={`/read/${resolveVendorSlug(
                        apiData?.data?.manga?.vendor! ?? "",
                      )}/${slug}/${firstChapter?.name}/1`}>
                      Start reading
                    </Button>
                  )}
                  {latestProgress && data?.manga && (
                    <Button
                      icon={<Icon icon="book" />}
                      iconLoc="right"
                      beefy
                      accent
                      to={`/read/${resolveVendorSlug(data.manga.vendor)}/${
                        data.manga.slug
                      }/${
                        data.manga.chapters.find(
                          chapter =>
                            chapter.name ===
                            parseChapterName(latestProgress?.chapter ?? "1"),
                        )?.name
                      }/${resolvePageUrlParameter(
                        parseInt(latestProgress?.meta.page ?? "1") || 1,
                        latestProgress?.meta.progress,
                      )}`}>
                      Resume from last
                    </Button>
                  )}
                  {loggedIn ? (
                    <Button
                      icon={
                        <Icon
                          icon={bookmarked ? "bookmarkSolid" : "bookmarkHollow"}
                        />
                      }
                      iconLoc="right"
                      beefy
                      loading={
                        apiData.isLoading ||
                        isBookmarked.isFetching ||
                        removeBookmark.isFetching ||
                        setBookmark.isFetching
                      }
                      onClick={() => {
                        if (!bookmarked) setBookmark.refetch();
                        else removeBookmark.refetch();
                      }}
                      fadedAccent={bookmarked}
                      fullWidth>
                      {setBookmark.error || removeBookmark.error ? (
                        "Error. Try again?"
                      ) : (
                        <>Bookmark{bookmarked ? "ed" : ""}</>
                      )}
                    </Button>
                  ) : (
                    <Button
                      beefy
                      iconLoc="right"
                      onClick={() => {
                        navigate("/");
                        setSignedIn?.(true);
                      }}
                      fullWidth
                      icon={
                        <Icon
                          icon={bookmarked ? "bookmarkSolid" : "bookmarkHollow"}
                        />
                      }>
                      Log in to bookmark
                    </Button>
                  )}
                  {anilistData.status === "success" && (
                    <a
                      href={`https://anilist.co/manga/${anilistData.data.data.id}`}
                      target="_blanc">
                      <Button
                        icon={<Icon icon="external" />}
                        style={{ background: "#02A9FF" }}
                        iconLoc="right"
                        beefy
                        fullWidth>
                        Anilist
                      </Button>
                    </a>
                  )}
                  {anilistData.status === "success" &&
                    anilistData.data.data.idMal && (
                      <a
                        href={`https://myanimelist.net/manga/${anilistData.data.data.idMal}`}
                        target="_blanc">
                        <Button
                          icon={<Icon icon="external" />}
                          iconLoc="right"
                          beefy
                          style={{ background: "#2E51A2" }}
                          fullWidth>
                          Myanimelist
                        </Button>
                      </a>
                    )}
                  <Button
                    icon={<Icon icon="report" />}
                    iconLoc="right"
                    beefy
                    fullWidth>
                    Report
                  </Button>
                </div>
              </aside>
              <article>
                <div
                  className={cm(
                    classes.title,
                    (data?.manga.title?.length ?? 0) > 21 && classes.longTitle,
                  )}>
                  <h1>{data?.manga.title}</h1>
                </div>
                {status === "success" && <Genres data={data.manga} />}
                <div className={classes.desc}>
                  {isLoading ? (
                    <Loading />
                  ) : (
                    data && (
                      <Desc data={data.manga} anilist={anilistData.data} />
                    )
                  )}
                </div>
                {status === "success" && (
                  <Chapters
                    progress={data.progress}
                    data={apiData.data?.manga}
                  />
                )}
              </article>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById("root")!,
  );
}

function Chapters({
  data,
  progress,
}: {
  data: MangaInfo;
  progress: ProgressInfo | undefined;
}) {
  const { chapters: unsortedChapters, vendor, slug } = data;
  type Filters = "OVERVIEW" | "ALL" | "READ" | "UNREAD";
  type Sort = "DESCENDING" | "ASCENDING";
  const [filter, setFilter] = useState<Filters>("OVERVIEW");
  const [sort, setSort] = useState<Sort>("DESCENDING");
  const e404 = <p>No chapters found</p>;
  const chapters =
    sort === "DESCENDING" ? unsortedChapters : [...unsortedChapters].reverse();
  const content = useMemo(() => {
    switch (filter) {
      case "OVERVIEW":
        const gutter = 6;
        return (
          <>
            {chapters.length > gutter * 2 ? (
              <>
                <div className={classes.chapters}>
                  {chapters.slice(0, gutter).map(chapter => (
                    <ChapterItem
                      vendor={vendor}
                      slug={slug}
                      chapter={chapter}
                      key={chapter.name}
                      progress={progress}
                    />
                  ))}
                </div>
                <div className={classes.chapterEllipsis}>
                  <Button
                    onClick={() => setFilter("ALL")}
                    alignCenter
                    fullWidth
                    transparent
                    compact>
                    ...
                  </Button>
                </div>
                <div className={classes.chapters}>
                  {chapters.slice(-gutter).map(chapter => (
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
            ) : chapters.length ? (
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
            ) : (
              e404
            )}

            <Button
              icon={<Icon icon="omniDirectional" orientation=".12turn" />}
              fullWidth
              onClick={() => setFilter("ALL")}
              compact>
              Show all chapters
            </Button>
          </>
        );
      case "ALL":
        if (!chapters.length) return e404;
        return (
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
        );
      case "READ":
        const resolvedChapters = chapters.filter(
          chapter => !!progress?.chapterProgress[chapter.name],
        );
        if (!resolvedChapters.length) return e404;
        return (
          <div className={classes.chapters}>
            {resolvedChapters.map(chapter => (
              <ChapterItem
                progress={progress}
                vendor={vendor}
                slug={slug}
                chapter={chapter}
                key={chapter.name}
              />
            ))}
          </div>
        );
      case "UNREAD": {
        const resolvedChapters = chapters.filter(
          chapter => !progress?.chapterProgress[chapter.name],
        );
        if (!resolvedChapters.length) return e404;
        return (
          <div className={classes.chapters}>
            {resolvedChapters.map(chapter => (
              <ChapterItem
                progress={progress}
                vendor={vendor}
                slug={slug}
                chapter={chapter}
                key={chapter.name}
              />
            ))}
          </div>
        );
      }
      default:
        return "Oops, unsupported filter (thonk)";
    }
  }, [filter, e404, chapters, sort]);

  return (
    <div className={classes.chaptersCont}>
      <div className={classes.chaptersTitle}>
        <Header level={2}>
          Chapters {chapters.length && <>({chapters.length})</>}
        </Header>
        <Label>Filter chapters</Label>
        <div className={classes.switchers}>
          <Switcher
            variant="dark"
            selected={filter}
            onChange={setFilter}
            items={[
              switcherItem<Filters>("OVERVIEW", "Overview"),
              switcherItem<Filters>("ALL", "All"),
              switcherItem<Filters>("READ", "Read"),
              switcherItem<Filters>("UNREAD", "Unread"),
            ]}
          />
          <Switcher
            variant="dark"
            selected={sort}
            onChange={setSort}
            items={[
              switcherItem<Sort>("DESCENDING", "", {
                icon: <Icon icon="arrow" orientation=".5turn" />,
              }),
              switcherItem<Sort>("ASCENDING", "", {
                icon: <Icon icon="arrow" />,
              }),
            ]}
          />
        </div>
      </div>
      <div className={classes.chapterInner}>{content}</div>
    </div>
  );
}

function switcherItem<T>(
  value: T,
  children: React.ReactNode,
  buttonProps?: ComponentProps<typeof Button>,
) {
  return {
    value,
    content: (
      forwardRef: Parameters<SwitcherItemStruct<T>["content"]>[0],
      props: Parameters<SwitcherItemStruct<T>["content"]>[1],
      selected: Parameters<SwitcherItemStruct<T>["content"]>[2],
    ) => (
      <Button
        noHoverEffect
        compact
        transparent
        alignCenter
        forwardRef={forwardRef}
        style={{
          color: value === selected ? "#fff" : "var(--color)",
          fontWeight: "bold",
        }}
        {...buttonProps}
        {...props}>
        {children}
      </Button>
    ),
  };
}

function Desc({ data, anilist }: { data: MangaInfo; anilist?: Anilist }) {
  type Options = "ORIGINAL" | "ANILIST";
  const [description, setDescription] = useState<Options>("ORIGINAL");

  return (
    <>
      {anilist &&
        anilist.data.description?.replace(/^\s+|\s+$/g, "") !==
          data.description && (
          <>
            <Label>Description source</Label>
            <Switcher
              variant="dark"
              selected={description}
              onChange={setDescription}
              items={[
                switcherItem<Options>("ORIGINAL", "Original"),
                switcherItem<Options>("ANILIST", "Anilist"),
              ]}
            />
          </>
        )}
      <p>
        {anilist ? (
          description === "ANILIST" ? (
            <div
              dangerouslySetInnerHTML={{
                __html:
                  anilist.data.description?.replace(/^\s+|\s+$/g, "") ||
                  "<i>No anilist synopsis available</i>",
              }}></div>
          ) : (
            data?.description
          )
        ) : (
          data?.description
        )}
      </p>
    </>
  );
}

function Genres({ data }: { data: MangaInfo }) {
  const res = data.genres.map((genre, i) => (
    <div key={genre} className={classes.inlineGenre}>
      {i !== 0 && "•"}
      <Link to={`/genres/${genre}`}>
        <div className={classes.genre}>{genre}</div>
      </Link>
    </div>
  ));

  return <div className={classes.genres}>{res}</div>;
}

function Nav({
  forwardRef,
  data,
}: {
  forwardRef: React.RefObject<HTMLDivElement>;
  data?: MangaInfo;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrollPos, setScrollPos] = useState(0);
  const exit = () =>
    navigate((location.state as any)?.backgroundLocation.pathname ?? "/");
  useEffect(() => {
    const handler = () => {
      if (!forwardRef.current) return;
      setScrollPos(forwardRef.current.scrollTop);
    };
    forwardRef.current?.addEventListener("scroll", handler);
    return () => forwardRef.current?.removeEventListener("scroll", handler);
  }, [forwardRef]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && data) exit();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [data]);

  return (
    <div
      onClick={e => void e.stopPropagation()}
      className={cm(classes.nav, scrollPos > 100 && classes.fixed)}>
      <Button
        onClick={exit}
        transparent
        icon={<Icon icon="chevron" orientation=".5turn" />}>
        Back
      </Button>
      <div
        className={cm(classes.navTitle, scrollPos > 230 && classes.showTitle)}>
        {data?.title}
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className={classes.switcherLabel}>{children}</div>;
}
