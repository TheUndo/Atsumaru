import React, { useContext, useState } from "react";
import useRipple from "use-ripple-hook";
import cm from "../../../utils/classMerger";
import { parsePageUrlParameter } from "../helpers";
import { PageState, ReaderContext } from "../ReaderContext";
import classes from "./previewThumbnail.module.scss";
import DesktopChapterIndicator from "../desktopChapterIndicator/DesktopChapterIndicator";

export default function PageThumbnail({
  state,
  children,
}: {
  state: PageState;
  children?: React.ReactNode;
}) {
  const { jumpToFixedPage, currentPage } = useContext(ReaderContext);
  const [currentResolvedPage] = parsePageUrlParameter(currentPage ?? "-1");
  const [isHover, setIsHover] = useState(false);
  const [ripple, event] = useRipple({
    color: "rgba(0, 0, 0, .3)",
  });
  return (
    <>
      <div
        className={cm(
          classes.pageThumbnail,
          isHover && classes.isHover,
          currentResolvedPage === state.name && classes.pageThumbnailActive,
        )}>
        {children}
        <div
          onMouseDown={event}
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          onClick={() => jumpToFixedPage(state.name)}
          className={classes.pageThumbnailContent}
          style={{
            backgroundImage: state?.loaded ? `url("${state.src}")` : "none",
          }}>
          <div className={classes.pageThumbnailRipple} ref={ripple}></div>
          <span className={classes.pageThumbnailLabel}>{state.name}</span>
        </div>
      </div>
    </>
  );
}
