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
import { clamp } from "../../../utils/utils";
import DesktopChapterIndicator from "../desktopChapterIndicator/DesktopChapterIndicator";
import PageThumbnail from "../previewThumbnail/PreviewThumbnail";
import { PageState, ReaderContext } from "../Reader";
import classes from "./pagePreviewThumbnails.module.scss";

export default function PagePreviewThumbnails({ pages }: { pages: Page[] }) {
  const [settings] = useContext(AppContext)?.settings ?? [];
  const [shown, setShown] = useState(false);
  const { loadPages, currentPage } = useContext(ReaderContext);

  const calculateMaxPages = useCallback(() => {
    return clamp(8, ~~(window.innerWidth / 110), 16);
  }, []);

  const [maxPagesInARow, setMaxPagesInARow] = useState(calculateMaxPages());
  const currentPageNumber: number = parseInt(currentPage?.split("-")?.[0]!);

  useEffect(() => {
    const event = () => {
      setMaxPagesInARow(calculateMaxPages());
    };
    window.addEventListener("resize", event);
    return () => window.removeEventListener("resize", event);
  }, []);

  const getRowNumber = (): number =>
    !(currentPageNumber % maxPagesInARow)
      ? ~~(currentPageNumber / maxPagesInARow) - 1
      : ~~(currentPageNumber / maxPagesInARow);

  const [currentRowNumber, setCurrentRowNumber] = useState<number>(
    getRowNumber(),
  );

  useEffect(() => {
    setCurrentRowNumber(getRowNumber());
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

  const firstReadingDirection = settings?.readingDirection
    .split("-")?.[0]
    .toLowerCase()!;
  const navigationButtonsLocation = ["left", "top"].includes(
    firstReadingDirection,
  )
    ? ["left", "right"]
    : ["right", "left"];
  const navButtonIconsOrientation = ["left", "top"].includes(
    firstReadingDirection,
  )
    ? ["-.5turn", undefined]
    : [undefined, "-.5turn"];

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
            <DesktopChapterIndicator
              shownItems={pageThumbnailsToShow.length}
              shift={true}
            />

            {pageThumbnailsToShow.map((page, i, arr) => {
              return (
                <PageThumbnail key={page.name} state={page}>
                  {i === 0 && (
                    <NavigationButton
                      loc={navigationButtonsLocation[0] as "left" | "right"}
                      button={
                        <Button
                          disabled={!currentRowNumber}
                          onClick={handleLeftPageButtonClick}
                          icon={
                            <Icon
                              icon="chevron"
                              orientation={navButtonIconsOrientation[0]}
                            />
                          }
                        />
                      }
                    />
                  )}
                  {i === arr.length - 1 && (
                    <NavigationButton
                      loc={navigationButtonsLocation[1] as "left" | "right"}
                      button={
                        <Button
                          onClick={handleRightPageButtonClick}
                          disabled={
                            (currentRowNumber + 1) * maxPagesInARow >=
                            items.length
                          }
                          icon={
                            <Icon
                              icon="chevron"
                              orientation={navButtonIconsOrientation[1]}
                            />
                          }
                        />
                      }
                    />
                  )}
                </PageThumbnail>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

function NavigationButton({
  button,
  loc,
}: {
  button: ReturnType<typeof Button>;
  loc: "left" | "right";
}) {
  return (
    <div className={cm(classes.navButton, classes[`navButton-${loc}`])}>
      {button}
    </div>
  );
}
