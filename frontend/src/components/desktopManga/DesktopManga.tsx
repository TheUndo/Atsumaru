import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useQuery, UseQueryResult } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../../appContext";
import { apiBase } from "../../hooks/useApi";
import { parseChapterName } from "../../pages/progressSyncing/ProgressSyncing";
import { resolvePageUrlParameter } from "../../pages/read/helpers";
import {
  useIsBookmarked,
  useRemoveBookmark,
  useSetBookmark,
} from "../../state/mangaInfo";
import { Anilist, ProgressNode } from "../../types";
import calculateProgressPercentage from "../../utils/calculateProgressPercentage";
import cm from "../../utils/classMerger";
import getLatestProgress from "../../utils/getLatestProgress";
import resolveVendorSlug from "../../utils/resolveVendorSlug";
import Button from "../button/Button";
import Header from "../header/Header";
import Icon from "../icon/Icon";
import { MangaEndPointResponse } from "../info/Info";
import Loading from "../loading/Loading";
import Poster from "../poster/Poster";
import Chapters from "./deps/chapters/Chapters";
import Desc from "./deps/desc/desc";
import Genres from "./deps/genres/Genres";
import Label from "./deps/label/Label";
import Nav from "./deps/nav/Nav";
import switcherItem from "./deps/switcherItem/SwitcherItem";
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
                {status === "success" && <Genres genres={data.manga.genres} />}
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
