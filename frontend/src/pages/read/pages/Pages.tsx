import { memo, useContext, useEffect, useMemo, useState } from "react";
import useOnline from "../../../hooks/useOnline";
import { Page } from "../../../types";
import isDev from "../../../utils/isDev";
import log from "../../../utils/log";
import { loadPagesSequentially, parsePageUrlParameter } from "../helpers";
import PageItem from "../pageItem/PageItem";
import { ReaderContext } from "../ReaderContext";

export default memo(function Pages({
  pages,
  chapterName,
}: {
  pages: Page[];
  chapterName: string;
}) {
  const {
    setLoadPages,
    loadPages,
    currentPage,
    initialPage,
    nextChapter,
    currentChapter,
  } = useContext(ReaderContext);
  const online = useOnline();
  const [preloading, setPreloading] = useState<string>();
  const [page] = parsePageUrlParameter((initialPage || currentPage) ?? "1");
  const pageIndex = useMemo(
    () => pages.findIndex(pageIteration => pageIteration.name === page),
    [pages, page],
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

  useEffect(() => {
    const done = Object.values(loadPages).every(page => page.loaded);

    if (
      done &&
      nextChapter?.pages.length &&
      preloading !== currentChapter?.name
    ) {
      if (isDev()) log.warn("preloading next chapter", nextChapter);
      setPreloading(currentChapter?.name);
      loadPagesSequentially(
        4,
        nextChapter.pages,
        0,
        page => void console.log("Preloaded page", page.name),
      );
    }
  }, [loadPages, nextChapter, preloading]);

  return (
    <>
      {pages.map((page, i) => (
        <PageItem
          page={page}
          pages={pages}
          idx={i}
          key={page.name + chapterName}
          state={loadPages[page.name]}
        />
      ))}
    </>
  );
});
