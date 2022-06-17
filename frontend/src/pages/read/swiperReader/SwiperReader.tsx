import React, { useCallback, useContext, useEffect, useMemo } from "react";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import classes from "./swiperReader.module.scss";
import "swiper/css";
import { useReader } from "../ReaderContext";
import { AppContext } from "../../../appContext";
import {
  loadPagesSequentially,
  parsePageUrlParameter,
  resolvePageUrlParameter,
} from "../helpers";
import PageItem from "../pageItem/PageItem";
import useOnline from "../../../hooks/useOnline";
import cm from "../../../utils/classMerger";
import { Page } from "../../../types";

type Props = {};

export default function SwiperReader(props: Props) {
  const [settings] = useContext(AppContext).settings ?? [];
  const { setLoadPages, currentChapter, initialPage, currentPage } =
    useReader();
  const pages = useMemo(
    () => currentChapter?.pages ?? [],
    [currentChapter?.pages],
  );
  const reversed = useMemo(
    () => [...(currentChapter?.pages ?? [])].reverse(),
    [currentChapter?.pages],
  );

  const [page] = useMemo(
    () => parsePageUrlParameter((initialPage || currentPage) ?? "1"),
    [initialPage, currentPage],
  );

  const online = useOnline();

  const pageIndex = useMemo(
    () => pages.findIndex(pageIteration => pageIteration.name === page),
    [pages, page],
  );

  const rtl = useMemo(
    () => settings?.readingDirection === "RIGHT-TO-LEFT",
    [settings?.readingDirection],
  );

  useEffect(() => {
    if (initialPage) {
      loadPagesSequentially(
        4,
        pages,
        pageIndex < 0 ? 0 : pageIndex,
        (page, src) => {
          if (src)
            setLoadPages?.(prev => ({
              ...prev,
              [page.name]: {
                ...prev[page.name],
                src,
                loaded: true,
                loading: false,
                failed: false,
              },
            }));
          else
            setLoadPages?.(prev => ({
              ...prev,
              [page.name]: {
                ...prev[page.name],
                loaded: true,
                loading: false,
                failed: true,
              },
            }));
        },
      );
    }
  }, [pages, initialPage, page, online]);

  if (rtl) return <Renderer key="rtl" rtl={true} pages={reversed} />;

  return <Renderer key="ltr" rtl={false} pages={pages} />;
}

function Renderer({ rtl, pages }: { rtl: boolean; pages: Page[] }) {
  const [settings] = useContext(AppContext).settings ?? [];
  const { setCurrentPage, loadPages } = useReader();

  return (
    <div
      className={cm(classes.swiperCont, rtl && classes.rtl)}
      style={
        {
          "--swiperWidth":
            settings?.readerShowDesktopDrawer === "YES"
              ? `calc(100vw - var(--drawerWidth))`
              : "100vw",
        } as any
      }>
      <Swiper
        onSlideChange={({ activeIndex }) => {
          void setCurrentPage?.(
            resolvePageUrlParameter(
              rtl ? pages.length - activeIndex : activeIndex + 1,
            ),
          );
        }}>
        {pages.map((page, i) => (
          <SwiperSlide key={page.name}>
            <PageItem
              page={page}
              pages={pages}
              idx={i}
              state={loadPages[page.name]}
            />
          </SwiperSlide>
        ))}
        <Controls />
      </Swiper>
    </div>
  );
}

function Controls() {
  const swiper = useSwiper();
  const { currentPage, currentChapter } = useReader();
  const [settings] = useContext(AppContext).settings ?? [];
  const rtl = useMemo(
    () => settings?.readingDirection === "RIGHT-TO-LEFT",
    [settings?.readingDirection],
  );

  const sharedDeps = [
    currentPage,
    currentChapter,
    settings?.readerShowDesktopDrawer,
    rtl,
  ] as const;

  const slide = useCallback(() => {
    if (!currentPage) return;

    const [page] = parsePageUrlParameter(currentPage);
    const index = currentChapter?.pages.findIndex(iPage => iPage.name === page);
    if (
      typeof index !== "number" ||
      index < 0 ||
      index >= (currentChapter?.pages.length ?? 0)
    )
      return;
    try {
      swiper.slideTo(
        rtl ? (currentChapter?.pages.length ?? 0) - index - 1 : index,
      );
    } catch (e) {}
  }, sharedDeps);

  useEffect(() => {
    slide();
  }, sharedDeps);

  useEffect(() => {
    window.addEventListener("resize", slide);
    return () => window.removeEventListener("resize", slide);
  }, []);

  return <></>;
}
