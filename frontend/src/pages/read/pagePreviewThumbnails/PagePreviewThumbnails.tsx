import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AppContext } from "../../../App";
import Button from "../../../components/button/Button";
import Icon from "../../../components/icon/Icon";
import { Page } from "../../../types";
import cm from "../../../utils/classMerger";
import DesktopChapterIndicator from "../desktopChapterIndicator/DesktopChapterIndicator";
import PageThumbnail from "../previewThumbnail/PreviewThumbnail";
import { PageState, ReaderContext } from "../Reader";
import classes from "./pagePreviewThumbnails.module.scss";

export default function PagePreviewThumbnails({ pages }: { pages: Page[] }) {
  const [settings] = useContext(AppContext)?.settings ?? [];
  const [shown, setShown] = useState(false);
  const { loadPages, currentPage } = useContext(ReaderContext);

  const maxPagesInARow: number = 13;
  const currentPageNumber: number = parseInt(currentPage?.split("-")?.[0]!);

  const getRowNumber = (): number =>
    !(currentPageNumber % maxPagesInARow)
      ? ~~(currentPageNumber / maxPagesInARow) - 1
      : ~~(currentPageNumber / maxPagesInARow);

  const [currentRowNumber, setCurrentRowNumber] = useState<number>(0);

  useEffect(() => {
    const rowNumber = getRowNumber();
    setCurrentRowNumber(rowNumber);
  }, [currentPageNumber]);

  const firstPageInRow: number = maxPagesInARow * currentRowNumber + 1;
  const lastPageInRow: number = maxPagesInARow * (currentRowNumber + 1);

  const items: PageState[] = Object.values(loadPages);
  const pageThumbnailsToShow: PageState[] = useMemo(
    () => items.slice(firstPageInRow - 1, lastPageInRow),
    [items, firstPageInRow, lastPageInRow],
  );

  const handleMove = useCallback(() => {
    setShown(true);
  }, []);
  const handleLeave = useCallback(() => {
    setShown(false);
  }, []);
  const handleLeftPageButtonClick = (): void =>
    setCurrentRowNumber(currentRowNumber - 1);
  const handleRightPageButtonClick = (): void =>
    setCurrentRowNumber(currentRowNumber + 1);

  const resolvedShown =
    settings?.displayCurrentPageIndicator === "ALWAYS"
      ? true
      : settings?.displayCurrentPageIndicator === "NEVER"
      ? false
      : shown;

  return (
    <>
      <div
        className={classes.pagePreviewTrigger}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}>
        <div
          className={cm(
            classes.preview,
            !resolvedShown && classes.pagePreviewHidden,
          )}>
          <div
            className={cm(
              classes.previewInner,
              settings?.readingDirection === "RIGHT-TO-LEFT" &&
                classes.previewFlipped,
            )}>
            <DesktopChapterIndicator items={items.length} shift={true} />
            <Button
              disabled={!currentRowNumber}
              onClick={handleLeftPageButtonClick}
              icon={<Icon icon="chevron" orientation="-.5turn" />}
            />
            {pageThumbnailsToShow.map((page, i) => {
              return <PageThumbnail key={page.name} state={page} />;
            })}
            <Button
              onClick={handleRightPageButtonClick}
              disabled={(currentRowNumber + 1) * maxPagesInARow >= items.length}
              icon={<Icon icon="chevron" orientation="" />}
            />
          </div>
        </div>
      </div>
    </>
  );
}
