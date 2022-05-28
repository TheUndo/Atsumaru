import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../../App";
import Button from "../../components/button/Button";
import Icon from "../../components/icon/Icon";
import { MangaEndPointResponse } from "../../components/info/Info";
import Loading, { LoadingPage } from "../../components/loading/Loading";
import useApi, { apiBase } from "../../hooks/useApi";
import { Chapter, MangaInfo } from "../../types";
import cm from "../../utils/classMerger";
import E404 from "../e404/E404";
import ProgressSyncing from "../progressSyncing/ProgressSyncing";
import DesktopChapterNavigation from "./desktopChapterNavigation/DesktopChapterNavigation";
import DesktopSettings from "./desktopSettings/DesktopSettings";
import DesktopSettingsBurger from "./desktopSettingsBurger/DesktopSettingsBurger";
import FloatingControls from "./floatingControls/FloatingControls";
import { parsePageUrlParameter } from "./helpers";
import KeyboardController from "./keyboardController/KeyboardController";
import MainFloatingControls from "./mainFloatingControls/MainFloatingControls";
import PagePreviewThumbnails from "./pagePreviewThumbnails/PagePreviewThumbnails";
import classes from "./reader.module.scss";
import ReaderMeta from "./readerMeta/ReaderMeta";
import RenderPages from "./renderPages/RenderPages";
import SettingsContainer from "./settingsContainer/SettingsContainer";

export type PageState = {
  loading: boolean;
  loaded: boolean;
  src?: string;
  name: string;
  failed?: boolean;
};

export type ReaderCtx = {
  manga?: MangaInfo;
  settingsShown: boolean;
  setSettingsShown: (value: boolean) => void;
  controlsShown: boolean;
  setControlsShown: (value: boolean) => void;
  jumpChapter: (offset: number) => void;
  jumpToFixedPage: (page: string) => void;
  nextChapter?: Chapter;
  currentChapter?: Chapter;
  previousChapter?: Chapter;
  initialPage?: string;
  background?: string;
  setInitialPage?: React.Dispatch<React.SetStateAction<string | undefined>>;
  chapters: Chapter[];
  currentPage?: string;
  setCurrentPage?: React.Dispatch<React.SetStateAction<string>>;
  chapterLoaded?: boolean;
  setChapterLoaded?: React.Dispatch<React.SetStateAction<boolean>>;
  vendor: MangaInfo["vendor"];
  desktopControlsVisible: boolean;
  setDesktopControlsVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  pageContentScrollPosition?: number;
  setPageContentScrollPosition?: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
  pageRelativeNavigate?: (offset: number) => void;
  loadPages: {
    [k: string]: PageState;
  };
  setLoadPages?: React.Dispatch<
    React.SetStateAction<{
      [k: string]: PageState;
    }>
  >;
};

export const ReaderContext = createContext<ReaderCtx>({
  settingsShown: false,
  setSettingsShown: (value: boolean) => void 0,
  controlsShown: true,
  setControlsShown: (value: boolean) => void 0,
  jumpChapter: (offset: number) => void 0,
  jumpToFixedPage: (page: string) => void 0,
  nextChapter: undefined,
  currentChapter: undefined,
  previousChapter: undefined,
  initialPage: "1",
  chapters: [],
  currentPage: void 0,
  vendor: "MANGASEE",
  desktopControlsVisible: true,
  loadPages: {},
});

let __readerURLUpdater: NodeJS.Timeout;

export default function Reader() {
  const { readSlug, chapter, page, vendor } = useParams();

  const [settingsShown, setSettingsShown] = useState(false);
  const [controlsShown, setControlsShown] = useState(true);
  const [chapterLoaded, setChapterLoaded] = useState(false);
  const [cursorShown, setCursorShown] = useState(true);
  const [pageContentScrollPosition, setPageContentScrollPosition] =
    useState<number>();
  const [desktopControlsVisible, setDesktopControlsVisible] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const appCtx = useContext(AppContext);
  const [, setQuery] = appCtx.searchQuery ?? [];
  const [
    {
      readerButtonsAppearance,
      readerBackgroundColor,
      readerCustomBackgroundColor,
    },
  ] = appCtx?.settings ?? [{}];
  // is undefined after mount to enable correct page scrolling on chapter change.
  const [initialPage, setInitialPage] = useState<undefined | string>(
    page ?? "1",
  );
  const [currentPage, setCurrentPage] = useState<string>(initialPage ?? "1");
  const apiData = useQuery<MangaEndPointResponse>(
    ["mangaInfo", vendor, readSlug],
    () =>
      fetch(`${apiBase}/manga/${vendor}/${readSlug}`, {
        credentials: "include",
      }).then(d => d.json()),
    {
      enabled: !!readSlug,
    },
  );
  const mangaData = apiData.data?.manga!;
  const navigate = useNavigate();
  const currentChapterIndex = mangaData?.chapters.findIndex(
    c => c.name === chapter,
  );
  const nextChapter = mangaData?.chapters[currentChapterIndex - 1];
  const currentChapter = mangaData?.chapters[currentChapterIndex];
  const previousChapter = mangaData?.chapters[currentChapterIndex + 1];
  const [sidebarShown] = appCtx.desktopNavbar ?? [];
  const [loadPages, setLoadPages] = useState<{ [k: string]: PageState }>({});

  useEffect(() => {
    setLoadPages(
      currentChapter
        ? Object.fromEntries(
            currentChapter.pages.map(page => [
              page.name,
              {
                loaded: false,
                loading: true,
                name: page.name,
              },
            ]),
          )
        : {},
    );
  }, [JSON.stringify(currentChapter?.pages)]);

  useEffect(() => {
    setTimeout(() => {
      appCtx.desktopNavbar?.[1](false);
    }, 20);
  }, []);

  useEffect(() => {
    setQuery?.("");
  }, []);

  const jumpToFixedPage = useCallback(
    (page: string) => {
      void setInitialPage(page);
      void setCurrentPage(page);
      setDesktopControlsVisible(false);
      return navigate(
        `/read/${vendor}/${mangaData.slug}/${currentChapter.name}/${page}`,
        { replace: true },
      );
    },
    [currentChapter, vendor, apiData],
  );
  const background =
    readerBackgroundColor === "custom"
      ? readerCustomBackgroundColor
      : readerBackgroundColor ?? "#000";
  const value: ReaderCtx = {
    manga: mangaData,
    settingsShown,
    setSettingsShown: (value: boolean) => void setSettingsShown(value),
    controlsShown,
    setControlsShown: (value: boolean) => void setControlsShown(value),
    jumpChapter: useCallback(
      (offset: number) => {
        if (!mangaData) return;

        const jump = mangaData.chapters[currentChapterIndex - offset];
        if (!jump) return;
        setDesktopControlsVisible(false);
        void setInitialPage("1");
        void setCurrentPage("1");
        return void navigate(
          `/read/${vendor}/${mangaData.slug}/${jump.name}/1`,
        );
      },
      [chapter, mangaData, currentChapterIndex, setInitialPage, setCurrentPage],
    ),
    jumpToFixedPage,
    background,
    nextChapter,
    currentChapter,
    previousChapter,
    initialPage,
    setInitialPage,
    chapters: mangaData?.chapters ?? [],
    currentPage,
    setCurrentPage,
    chapterLoaded,
    setChapterLoaded,
    vendor: vendor as MangaInfo["vendor"],
    desktopControlsVisible,
    setDesktopControlsVisible,
    pageRelativeNavigate: useCallback(
      (offset: number) => {
        if (!currentPage) return;
        const name = parsePageUrlParameter(currentPage)[0];
        if (!name) return;

        const index = currentChapter?.pages.findIndex(
          page => page.name === name,
        );
        if (index === -1 || index === undefined) return;
        const page = currentChapter?.pages?.[index + offset];
        if (!page) return;
        jumpToFixedPage(page.name);
      },
      [jumpToFixedPage, currentChapter],
    ),
    loadPages,
    setLoadPages,
    pageContentScrollPosition,
    setPageContentScrollPosition,
  };

  useEffect(() => {
    document.body.classList[desktopControlsVisible ? "remove" : "add"](
      "hide-desktop-controls",
    );
  }, [desktopControlsVisible]);

  useEffect(() => {
    document.body.classList.add("standalone");
    return () => document.body.classList.remove("standalone");
  }, []);

  useEffect(() => {
    const event = () => {
      if (!desktopControlsVisible) setDesktopControlsVisible(true);
    };
    window.addEventListener("mousemove", event);
    return () => window.removeEventListener("mousemove", event);
  }, [desktopControlsVisible]);

  useEffect(() => {
    if (!desktopControlsVisible) setCursorShown(false);
    else {
      clearTimeout((window as any).__readerHideCursor);
      setCursorShown(true);
    }
  }, [desktopControlsVisible]);

  useEffect(() => {
    if (!mangaData || !currentChapter) return;
    const timeout = setTimeout(() => {
      navigate(
        `/read/${vendor}/${mangaData.slug}/${currentChapter.name}/${currentPage}`,
        { replace: true },
      );
    }, 350);

    return () => clearTimeout(timeout);
  }, [currentPage, apiData, currentChapter, vendor, mangaData?.slug]);

  if (apiData.isLoading === false && !mangaData) {
    return <E404 />;
  }

  return (
    <>
      <ReaderContext.Provider value={value}>
        <ProgressSyncing />

        <KeyboardController />
        <div
          ref={scrollRef}
          className={cm(
            classes.reader,
            sidebarShown && classes.navbarShown,
            readerButtonsAppearance === "HOLLOW"
              ? classes.readerWithHollowControls
              : readerButtonsAppearance === "TRANSPARENT"
              ? classes.readerWithTransparentControls
              : "",
            !cursorShown && classes.hideCursor,
          )}>
          <FloatingControls>
            <MainFloatingControls
              type={mangaData?.type ?? "unknown"}
              slug={readSlug!}
            />
          </FloatingControls>
          <div
            className={classes.inner}
            style={{
              background,
            }}>
            <DesktopSettingsBurger />
            <div className={classes.content}>
              <ReaderMeta />
              {value?.currentChapter && (
                <PagePreviewThumbnails pages={value?.currentChapter?.pages} />
              )}
              {mangaData?.chapters?.length ? (
                <RenderPages
                  hideControls={value.setControlsShown}
                  manga={mangaData}
                />
              ) : apiData.isLoading ? (
                <>
                  <LoadingPage>
                    <Loading />
                  </LoadingPage>
                </>
              ) : (
                <div className={classes.noChapters}>
                  <div>
                    <h1>This manga contains no chapters yet</h1>
                    <Button to="/" icon={<Icon icon="home" />}>
                      Back home
                    </Button>
                  </div>
                </div>
              )}
              <DesktopChapterNavigation />
            </div>
            <aside className={classes.aside}>
              <DesktopSettings vendor={vendor} manga={mangaData ?? null} />
            </aside>
          </div>
          <SettingsContainer />
        </div>
      </ReaderContext.Provider>
    </>
  );
}
