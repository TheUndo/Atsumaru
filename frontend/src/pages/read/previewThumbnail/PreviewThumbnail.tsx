import React, { useContext } from "react";
import useRipple from "use-ripple-hook";
import cm from "../../../utils/classMerger";
import { parsePageUrlParameter } from "../helpers";
import { PageState, ReaderContext } from "../Reader";
import classes from "./previewThumbnail.module.scss";
import DesktopChapterIndicator from "../desktopChapterIndicator/DesktopChapterIndicator";

export default function PageThumbnail({ state }: { state: PageState }) {
  const { jumpToFixedPage, currentPage } = useContext(ReaderContext);
  const [currentResolvedPage] = parsePageUrlParameter(currentPage ?? "-1");
  const [ripple, event] = useRipple({
    color: "rgba(0, 0, 0, .3)",
  });
  return (
    <>
      <div
        onMouseDown={event}
        className={cm(
          classes.pageThumbnail,
          currentResolvedPage === state.name && classes.pageThumbnailActive
        )}
        onClick={() => jumpToFixedPage(state.name)}
      >
        <div
          className={classes.pageThumbnailContent}
          style={{
            backgroundImage: state?.loaded ? `url("${state.src}")` : "none",
          }}
        >
          <div className={classes.pageThumbnailRipple} ref={ripple}></div>
          <span className={classes.pageThumbnailLabel}>{state.name}</span>
        </div>
      </div>
    </>
  );
}
