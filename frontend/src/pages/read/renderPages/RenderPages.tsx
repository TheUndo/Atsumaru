import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../../appContext";
import Button from "../../../components/button/Button";
import Loading from "../../../components/loading/Loading";
import { MangaInfo } from "../../../types";
import cm from "../../../utils/classMerger";
import { clamp } from "../../../utils/utils";
import SwiperReader from "../swiperReader/SwiperReader";
import { parsePageUrlParameter, resolvePageUrlParameter } from "../helpers";
import NextChapterIndicator from "../nextChapterIndicator/NextChaptrerIndicator";
import Overlay from "../overlay/Overlay";
import Pages from "../pages/Pages";
import { ReaderContext, ReaderCtx } from "../ReaderContext";
import classes from "./renderPages.module.scss";

type Props = {};

export default function RenderPages({
  manga,
  hideControls,
}: /* forwardRef: ref, */
{
  manga?: MangaInfo;
  /* forwardRef: React.RefObject<HTMLDivElement>; */
  hideControls: ReaderCtx["setControlsShown"];
}) {
  const { chapter: chapterName } = useParams();
  const ref = useRef<HTMLDivElement>(null);
  const [showIndicator, setShowIndicator] = useState(0);
  const [indicatorColor, setIndicatorColor] = useState("var(--bg)");
  const [awaitChapterLoading, setAwaitChapterLoading] = useState(false);
  const [
    {
      readingDirection,
      stripWidth,
      stripWidthControl,
      imageFitMethod,
      readerShowDesktopDrawer,
      readerClickNavigation,
      readerClickNavigationDisabled,
      readerSwipeEngine,
    },
    setSetting,
  ] = useContext(AppContext)?.settings ?? [{}];
  const [isScrolling, setIsScrolling] = useState(false);

  const [overScrollingDirection, setOverScrollingDirection] = useState<
    "prev" | "next"
  >();
  const threshold = 80;
  const chapter = manga?.chapters?.find(
    chapter => chapter.name === chapterName,
  );

  const {
    currentChapter,
    setCurrentPage,
    initialPage,
    setInitialPage,
    loadPages,
    pageRelativeNavigate,
  } = useContext(ReaderContext);

  const [, progress] = useMemo(
    () => parsePageUrlParameter(initialPage ?? "1"),
    [],
  );

  const rtl = useMemo(
    () => readingDirection === "RIGHT-TO-LEFT",
    [readingDirection],
  );

  const chapterLoaded = useMemo(() => {
    const values = Object.values(loadPages);
    return values.length && values.every(v => v.loaded);
  }, [loadPages]);

  const content = chapter ? (
    <Pages chapterName={chapter.name} pages={chapter.pages} />
  ) : (
    <Loading />
  );

  useEffect(() => {
    if (!ref.current) return;
    ref.current.addEventListener(
      "touchmove",
      e => {
        if (isScrolling) {
          e.stopPropagation();
        }
      },
      {
        passive: false,
      },
    );
  }, [ref, isScrolling]);

  useEffect(() => {
    if (!ref.current || initialPage === void 0) return;
    const { width, height } = ref.current.getBoundingClientRect();
    const size = readingDirection === "TOP-TO-BOTTOM" ? height : width;
    const [page, progress] = parsePageUrlParameter(initialPage);
    const value =
      size *
      ((parseInt(page ?? "1") || 1) - 1) *
      (readingDirection === "RIGHT-TO-LEFT" ? -1 : 1);
    if (readingDirection === "TOP-TO-BOTTOM") {
      // don't add this condition to the dependency list!
      if (!chapterLoaded && progress) setAwaitChapterLoading(true);
      else if (chapterLoaded) {
        const page = ref.current.querySelector(`.scroll-to-${initialPage}`);
        void page?.scrollIntoView(true);
      }
    } else if (chapter) {
      ref.current.scrollLeft = value;
      setInitialPage?.(void 0); // ensures correct page position on chapter change
    }
  }, [initialPage, ref, chapter]);

  const getScrolling = useCallback(() => {
    if (!ref.current) return 0;
    const { width, height } = ref.current.getBoundingClientRect();
    const size = readingDirection === "TOP-TO-BOTTOM" ? height : width;

    return (
      (readingDirection === "RIGHT-TO-LEFT"
        ? -ref.current.scrollLeft
        : readingDirection === "LEFT-TO-RIGHT"
        ? ref.current.scrollLeft
        : ref.current.scrollTop) + size
    );
  }, [ref, readingDirection]);

  useEffect(() => {
    if (
      readingDirection === "TOP-TO-BOTTOM" &&
      progress &&
      chapterLoaded &&
      ref.current
    ) {
      setAwaitChapterLoading(false);
      const [, progress] = parsePageUrlParameter(initialPage ?? "1");
      setInitialPage?.(void 0);
      const { scrollHeight } = ref.current;
      if (progress) {
        ref.current.scrollTop = scrollHeight * parseFloat(progress) || 0;
      }
    }
  }, [ref, chapterLoaded, readingDirection, initialPage]);

  const onScroll = useCallback(
    (cb?: () => void) => {
      if (!ref.current) return;
      void setIsScrolling(true);

      const { width, height } = ref.current.getBoundingClientRect();
      const { scrollWidth, scrollHeight } = ref.current;
      const size = readingDirection === "TOP-TO-BOTTOM" ? height : width;
      const scrollSize =
        readingDirection === "TOP-TO-BOTTOM" ? scrollHeight : scrollWidth;
      const scrolling = getScrolling();

      const [currentPage, progress] = ((
        progress: number,
        duration: number,
        size: number,
      ): [number, number | undefined] => {
        if (!currentChapter) return [1, void 0];
        const { length } = currentChapter.pages;
        return [
          clamp(
            1,
            Math.round((progress / duration) * length),
            Math.max(1, length),
          ),
          clamp(
            0,
            isNaN((progress - size) / duration)
              ? 0
              : Math.round(((progress - size) / duration) * 1e3) / 1e3,
            1,
          ) || undefined,
        ];
      })(scrolling, scrollSize, size);

      if (scrolling !== scrollSize) {
        void setCurrentPage?.(resolvePageUrlParameter(currentPage, progress));
      }
      void setShowIndicator(
        scrolling - size > 0
          ? scrolling - scrollSize
          : Math.abs(scrolling - size),
      );
      setIndicatorColor(
        scrolling - threshold > scrollSize || scrolling - size + threshold < 0
          ? "var(--accent)"
          : "var(--bg)",
      );

      if (scrolling >= scrollSize || scrolling - size <= 0) {
        cb?.();
      }
      if (scrolling - size < 0 || scrolling > scrollSize)
        setOverScrollingDirection(scrolling - size < 0 ? "prev" : "next");
      else setOverScrollingDirection(void "neither");
    },
    [ref, currentChapter, threshold, readingDirection, getScrolling],
  );

  useEffect(() => {
    onScroll(() => hideControls(true));
  }, [manga?.slug]);

  const onRelease = useCallback(
    (cb: (num: number) => void) => {
      if (!ref.current) return;
      setIsScrolling(false);
      const { width, height } = ref.current.getBoundingClientRect();
      const { scrollWidth, scrollHeight } = ref.current;
      const size = readingDirection === "TOP-TO-BOTTOM" ? height : width;
      const scrollSize =
        readingDirection === "TOP-TO-BOTTOM" ? scrollHeight : scrollWidth;
      const scrolling = getScrolling();

      if (
        scrolling - threshold > scrollSize ||
        scrolling - size + threshold < 0
      ) {
        /* cb(scrolling + threshold < 0 ? -1 : 1); */
      }
    },
    [ref, getScrolling, threshold],
  );
  const readingDirectionClass = (dir => {
    switch (dir) {
      case "LEFT-TO-RIGHT":
        return classes.leftToRight;
      case "RIGHT-TO-LEFT":
        return classes.rightToLeft;
      case "TOP-TO-BOTTOM":
        return classes.topToBottom;
    }
  })(readingDirection);
  const desktop = window.matchMedia("(pointer: fine)").matches;

  // handle click navigation for TOP-TO-BOTTOM (otherwise handled by Overlay)
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const closeDropdown = new CustomEvent("closeDropdown");
      window.dispatchEvent(closeDropdown);
      if (!ref.current || !desktop || readerClickNavigationDisabled === "YES")
        return;

      e.stopPropagation();
      const { left, width } = ref.current?.getBoundingClientRect();
      const relX = e.pageX - left;

      if (readerClickNavigation === "PREV-MENU-NEXT") {
        const [leftClick, middleClick, rightClick] = [
          relX >= 0 && relX < (width * 1) / 3,
          relX >= (width * 1) / 3 && relX < (width * 2) / 3,
          relX >= (width * 2) / 3 && relX < (width * 3) / 3,
        ] as const;
        if (leftClick) {
          pageRelativeNavigate?.(rtl ? 1 : -1);
        } else if (middleClick) {
          setSetting?.(
            "readerShowDesktopDrawer",
            readerShowDesktopDrawer === "NO" ? "YES" : "NO",
          );
        } else if (rightClick) {
          pageRelativeNavigate?.(rtl ? -1 : 1);
        }
      } else if (readerClickNavigation === "PREV-NEXT") {
        const [leftClick, rightClick] = [
          relX >= 0 && relX < width / 2,
          relX >= width / 2 && relX < width,
        ] as const;
        if (leftClick) {
          pageRelativeNavigate?.(rtl ? 1 : -1);
        } else if (rightClick) {
          pageRelativeNavigate?.(rtl ? -1 : 1);
        }
      } else if (readerClickNavigation === "ONLY-NEXT") {
        const rightClick = relX >= 0 && relX < width;
        if (rightClick) {
          pageRelativeNavigate?.(rtl ? -1 : 1);
        }
      }
    },
    [
      ref,
      setSetting,
      readerShowDesktopDrawer,
      pageRelativeNavigate,
      desktop,
      readerClickNavigationDisabled,
      readerClickNavigation,
      rtl,
    ],
  );

  const useSwiper = useMemo(() => {
    return (
      readingDirection !== "TOP-TO-BOTTOM" && readerSwipeEngine === "CUSTOM"
    );
  }, [readingDirection, readerSwipeEngine]);

  const wisdom = useMemo(() => getWisdom(), []);

  return (
    <>
      <ReaderContext.Consumer>
        {({
          setControlsShown,
          jumpChapter,
          controlsShown,
          setPageContentScrollPosition,
        }) => (
          <div
            className={cm(
              classes.renderPages,
              overScrollingDirection === "next"
                ? classes.showNextIndicator
                : overScrollingDirection === "prev"
                ? classes.showPrevIndicator
                : null,
              readingDirectionClass,
              stripWidthControl === "AUTO"
                ? classes.stripWidthAuto
                : classes.stripWidthManual,
              imageFitMethod === "TO-HEIGHT" && classes.pagesFitToHeight,
            )}
            style={
              {
                "--width": `${stripWidth ?? "30"}${
                  /%$/.test(stripWidth ?? "30") ? "" : "%"
                }`,
              } as any
            }
            onClick={handleClick}>
            <div
              onClick={() => setControlsShown(!controlsShown)}
              onScroll={e => {
                setControlsShown(false);
                onScroll?.(() => setControlsShown(true));
                setPageContentScrollPosition?.(
                  (e.nativeEvent?.target as any)?.scrollTop,
                );
              }}
              onTouchEnd={() => onRelease(jumpChapter)}
              className={classes.pageContent}
              id="pageContent" // ONLY used for getting scroll position in a performant way
              ref={ref}
              onFocus={e => e.target.blur()}
              onKeyDown={e => e.preventDefault()}
              onKeyUp={e => e.preventDefault()}
              onKeyPress={e => e.preventDefault()}>
              {useSwiper ? <SwiperReader /> : content}

              <div
                className={cm(
                  classes.renderPagesAwaitLoad,
                  awaitChapterLoading && classes.renderPagesAwaitLoadShown,
                )}>
                <div>
                  <Loading />
                </div>
                <div>
                  <div>Loading in pages in order to resume</div>
                  <div>
                    {Object.values(loadPages).filter(v => v.loaded).length} /{" "}
                    {currentChapter?.pages.length} pages loaded
                  </div>
                  <div
                    style={{
                      padding: ".5rem",
                      boxSizing: "border-box",
                      maxWidth: "400px",
                    }}>
                    <strong>Trivia: </strong>
                    {wisdom}
                  </div>
                  <div>
                    <Button onClick={() => setAwaitChapterLoading(false)}>
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <Overlay />
            <NextChapterIndicator
              scaling={showIndicator}
              color={indicatorColor}
            />
            <NextChapterIndicator
              prev
              scaling={showIndicator}
              color={indicatorColor}
            />
          </div>
        )}
      </ReaderContext.Consumer>
    </>
  );
}

function getWisdom() {
  const arr = [
    "Did you know the plural form of manga is actually 'manga' without an s?",
    "You can change page warmth in the settings... that's hot!",
    "How much wood would a woodchuck chuck if a woodchuck could chuck wood? He would chuck, he would, as much as he could, and chuck as much wood as a woodchuck would if a woodchuck could chuck wood.",
    "Sweden and Switzerland are two different countries. Never mix them up.",
    "The sky is blue because blue light from the sun hits molecules more often than other wavelengths causing them to scatter across the sky.",
    "You can't find a circle's area that is the exact same as a square's... Try it!",
    "A sandwich always falls butter side down! Is that why cats always land on their feet? Cats = sandwiches?",
    "Tomato is a fruit... but it's also a vegetable, win-win!",
    "There's a 0.77% chance you're sitting on the toilet right now. That percentage is going up by the year.",
    "Roses are red. Violets are violet. That's why they're called violets.",
    "Feeling stressed? Me too",
    "You look good today, but don't get your hopes up, I say that to everyone",
    "The legendary manga Berserk had its debut in 1989 and ended May 6th, 2021 when the author, Kentaro Miura, tragically passed away at age 54. May he rest in peace, he will greatly be missed.",
  ];

  return arr[~~(Math.random() * arr.length)];
}
