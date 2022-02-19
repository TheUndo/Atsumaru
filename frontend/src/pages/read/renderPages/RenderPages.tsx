import React, {
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../../App";
import Button from "../../../components/button/Button";
import Loading from "../../../components/loading/Loading";
import { MangaInfo } from "../../../types";
import cm from "../../../utils/classMerger";
import { clamp } from "../../../utils/utils";
import { parsePageUrlParameter, resolvePageUrlParameter } from "../helpers";
import NextChapterIndicator from "../nextChapterIndicator/NextChaptrerIndicator";
import Overlay from "../overlay/Overlay";
import Pages from "../pages/Pages";
import { ReaderContext, ReaderCtx } from "../Reader";
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
        { readingDirection, stripWidth, stripWidthControl, imageFitMethod },
    ] = useContext(AppContext)?.settings ?? [{}];
    const [isScrolling, setIsScrolling] = useState(false);

    const [overScrollingDirection, setOverScrollingDirection] = useState<
        "prev" | "next"
    >();
    const threshold = 80;
    const chapter = manga?.chapters?.find(
        (chapter) => chapter.name === chapterName
    );

    const {
        currentChapter,
        setCurrentPage,
        initialPage,
        setInitialPage,
        chapterLoaded,
    } = useContext(ReaderContext);

    const content = chapter ? (
        <Pages chapterName={chapter.name} pages={chapter.pages} />
    ) : (
        <Loading />
    );

    useEffect(() => {
        if (!ref.current) return;
        ref.current.addEventListener(
            "touchmove",
            (e) => {
                if (isScrolling) {
                    e.stopPropagation();
                }
            },
            {
                passive: false,
            }
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
        if (chapterLoaded) {
            setTimeout(() => {
                setAwaitChapterLoading(false);
            }, 0);
        }
        const [, progress] = parsePageUrlParameter(initialPage ?? "1");
        if (
            readingDirection === "TOP-TO-BOTTOM" &&
            progress &&
            chapterLoaded &&
            ref.current
        ) {
            setInitialPage?.(void 0);
            const { height } = ref.current.getBoundingClientRect();
            const { scrollHeight } = ref.current;
            ref.current.scrollTop = scrollHeight * parseFloat(progress) || 0;
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
                readingDirection === "TOP-TO-BOTTOM"
                    ? scrollHeight
                    : scrollWidth;
            const scrolling = getScrolling();

            const [currentPage, progress] = ((
                progress: number,
                duration: number,
                size: number
            ): [number, number | undefined] => {
                if (!currentChapter) return [1, void 0];
                const { length } = currentChapter.pages;
                return [
                    clamp(
                        1,
                        Math.round((progress / duration) * length),
                        Math.max(1, length)
                    ),
                    clamp(
                        0,
                        isNaN((progress - size) / duration)
                            ? 0
                            : Math.round(((progress - size) / duration) * 1e3) /
                                  1e3,
                        1
                    ) || undefined,
                ];
            })(scrolling, scrollSize, size);
            if (scrolling !== scrollSize) {
                void setCurrentPage?.(
                    resolvePageUrlParameter(currentPage, progress)
                );
            }
            void setShowIndicator(
                scrolling - size > 0
                    ? scrolling - scrollSize
                    : Math.abs(scrolling - size)
            );
            setIndicatorColor(
                scrolling - threshold > scrollSize ||
                    scrolling - size + threshold < 0
                    ? "var(--accent)"
                    : "var(--bg)"
            );

            if (scrolling >= scrollSize || scrolling - size <= 0) {
                cb?.();
            }
            if (scrolling - size < 0 || scrolling > scrollSize)
                setOverScrollingDirection(
                    scrolling - size < 0 ? "prev" : "next"
                );
            else setOverScrollingDirection(void "neither");
        },
        [ref, currentChapter, threshold, readingDirection, getScrolling]
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
                readingDirection === "TOP-TO-BOTTOM"
                    ? scrollHeight
                    : scrollWidth;
            const scrolling = getScrolling();

            if (
                scrolling - threshold > scrollSize ||
                scrolling - size + threshold < 0
            ) {
                /* cb(scrolling + threshold < 0 ? -1 : 1); */
            }
        },
        [ref, getScrolling, threshold]
    );
    const readingDirectionClass = ((dir) => {
        switch (dir) {
            case "LEFT-TO-RIGHT":
                return classes.leftToRight;
            case "RIGHT-TO-LEFT":
                return classes.rightToLeft;
            case "TOP-TO-BOTTOM":
                return classes.topToBottom;
        }
    })(readingDirection);
    return (
        <>
            <ReaderContext.Consumer>
                {({ setControlsShown, jumpChapter, controlsShown }) => (
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
                            imageFitMethod === "TO-HEIGHT" &&
                                classes.pagesFitToHeight
                        )}
                        style={
                            {
                                "--width": `${stripWidth ?? "30"}${
                                    /%$/.test(stripWidth ?? "30") ? "" : "%"
                                }`,
                            } as any
                        }
                    >
                        <div
                            onClick={() => setControlsShown(!controlsShown)}
                            onScroll={(e) => {
                                setControlsShown(false);
                                onScroll?.(() => setControlsShown(true));
                            }}
                            onTouchEnd={() => onRelease(jumpChapter)}
                            className={classes.pageContent}
                            ref={ref}
                            /* onKeyDown={(e) => e.preventDefault()}
                            onKeyUp={(e) => e.preventDefault()}
                            onKeyPress={(e) => e.preventDefault()} */
                        >
                            {content}

                            <div
                                className={cm(
                                    classes.renderPagesAwaitLoad,
                                    awaitChapterLoading &&
                                        classes.renderPagesAwaitLoadShown
                                )}
                            >
                                <div>
                                    <Loading />
                                </div>
                                <div>
                                    <div>
                                        Loading in pages in order to resume
                                    </div>
                                    <div>
                                        <Button
                                            onClick={() =>
                                                setAwaitChapterLoading(false)
                                            }
                                        >
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
