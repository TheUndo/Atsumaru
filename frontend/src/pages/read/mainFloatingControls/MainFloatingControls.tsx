import React, { useContext } from "react";
import { AppContext } from "../../../App";
import Button from "../../../components/button/Button";
import Icon from "../../../components/icon/Icon";
import cm from "../../../utils/classMerger";
import { ReaderContext } from "../Reader";
import classes from "./mainFloatingControls.module.scss";
import controlClasses from "../floatingControls/floatingControls.module.scss";
import { parsePageUrlParameter } from "../helpers";

export default function MainFloatingControls({
  slug,
  type,
  returnLocation,
}: {
  slug: string;
  type: string;
  returnLocation?: string;
}) {
  const ctx = useContext(AppContext);
  const [
    {
      readingDirection,
      currentPageIndicatorLocation,
      displayCurrentPageIndicator,
    },
    setSetting,
  ] = ctx?.settings ?? [{}];
  const { currentPage } = useContext(ReaderContext);

  const stripModeShown =
    ["manhwa", "manhua", "webtoon"].includes(type.toLowerCase()) &&
    readingDirection !== "TOP-TO-BOTTOM";

  const [page] = parsePageUrlParameter(currentPage ?? "1");

  return (
    <>
      <ReaderContext.Consumer>
        {({
          setSettingsShown,
          controlsShown,
          jumpChapter,
          nextChapter,
          previousChapter,
          chapters,
          currentChapter,
          vendor,
        }) => (
          <>
            <div
              className={classes.pageIndicator}
              style={{
                opacity:
                  displayCurrentPageIndicator === "NEVER"
                    ? "0"
                    : displayCurrentPageIndicator === "ON-FOCUS" &&
                      controlsShown
                    ? "1"
                    : displayCurrentPageIndicator === "ON-FOCUS"
                    ? "0"
                    : "1",
                left:
                  currentPageIndicatorLocation === "LEFT"
                    ? "0"
                    : currentPageIndicatorLocation === "RIGHT"
                    ? "unset"
                    : "50%",
                right:
                  currentPageIndicatorLocation === "RIGHT"
                    ? "0"
                    : ["LEFT", "CENTER", undefined].includes(
                        currentPageIndicatorLocation
                      )
                    ? "unset"
                    : "50%",
                transform: `translate(${
                  currentPageIndicatorLocation === "CENTER" ? "-50%" : "0"
                }, calc(${
                  controlsShown && currentPageIndicatorLocation === "CENTER"
                    ? "-40px"
                    : displayCurrentPageIndicator === "ALWAYS" ||
                      currentPageIndicatorLocation !== "CENTER"
                    ? ".5rem"
                    : "-30px"
                } - .5rem))`,
              }}
            >
              <div>
                {page} / {currentChapter?.pages.length || "?"}
              </div>
            </div>
            <div
              className={cm(
                controlClasses.floatingControlCollection,
                controlClasses.floatApart,
                !controlsShown && controlClasses.floatingControlsHidden
              )}
            >
              <div className={controlClasses.floatingControlCollection}>
                <div className={controlClasses.floatingControl}>
                  <Button
                    className={cm("reader-control-button")}
                    to={returnLocation ?? `/manga/${vendor}/${slug}`}
                    icon={<Icon icon="arrow" orientation="-.25turn" />}
                  />
                </div>
                <div className={controlClasses.floatingControl}>
                  <Button
                    className={cm("reader-control-button")}
                    to={`/manga/${vendor}/${slug}/chapters`}
                    icon={<Icon icon="bulletList" />}
                  />
                </div>
              </div>
              <div className={controlClasses.floatingControlCollection}>
                {stripModeShown && (
                  <div className={controlClasses.floatingControl}>
                    <Button
                      className={cm("reader-control-button")}
                      onClick={() => {
                        setSetting?.("readingDirection", "TOP-TO-BOTTOM");
                        setSetting?.("imageFitMethod", "TO-SCREEN");
                      }}
                      icon={<Icon icon="arrow" orientation=".5turn" />}
                    >
                      Strip mode
                    </Button>
                  </div>
                )}
                <div className={controlClasses.floatingControl}>
                  <Button
                    className={cm("reader-control-button")}
                    onClick={() => setSettingsShown(true)}
                    icon={<Icon icon="settings" />}
                  />
                </div>
              </div>
            </div>
            <div
              className={cm(
                controlClasses.floatingControlCollection,
                controlClasses.floatTogether,
                !controlsShown && controlClasses.floatingControlsHidden
              )}
            >
              <div className={controlClasses.floatingControl}>
                <Button
                  className={cm("reader-control-button")}
                  disabled={!previousChapter}
                  onClick={() => jumpChapter(-1)}
                  icon={<Icon icon="chevron" orientation=".5turn" />}
                ></Button>
              </div>
              <div className={controlClasses.floatingControl}>
                <Button className={cm("reader-control-button")}>
                  {currentChapter?.name ?? "?"}{" "}
                  <div className={controlClasses.slash}></div>{" "}
                  {chapters?.[0]?.name}
                </Button>
              </div>
              <div className={controlClasses.floatingControl}>
                <Button
                  className={cm("reader-control-button")}
                  disabled={!nextChapter}
                  onClick={() => jumpChapter(1)}
                  icon={<Icon icon="chevron" />}
                ></Button>
              </div>
            </div>
          </>
        )}
      </ReaderContext.Consumer>
    </>
  );
}
