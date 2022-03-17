import React, { useContext, useEffect } from "react";
import useOnline from "../../../hooks/useOnline";
import { Page } from "../../../types";
import { loadPagesSequentially, parsePageUrlParameter } from "../helpers";
import PageItem from "../pageItem/PageItem";
import { ReaderContext } from "../Reader";

export default function Pages({
  pages,
  chapterName,
}: {
  pages: Page[];
  chapterName: string;
}) {
  const { setLoadPages, loadPages, currentPage, initialPage } =
    useContext(ReaderContext);
  const online = useOnline();
  const [page] = parsePageUrlParameter((initialPage || currentPage) ?? "1");
  const pageIndex = pages.findIndex(
    pageIteration => pageIteration.name === page,
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
}
