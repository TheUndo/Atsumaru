import React, { useContext, useMemo } from "react";
import { AppContext } from "../../../appContext";
import { Page } from "../../../types";
import cm from "../../../utils/classMerger";
import ImageItem from "../imageItem/ImageItem";
import { PageState } from "../Reader";
import classes from "./pageItem.module.scss";

export default function PageItem({
  page,
  pages,
  idx,
  state,
}: {
  page: Page;
  pages: Page[];
  idx: number;
  state: PageState;
}) {
  const [{ pagesModifyColors, readingDirection }] = useContext(AppContext)
    ?.settings ?? [{}];

  const filter = useMemo(() => {
    switch (pagesModifyColors) {
      case "DARKEN":
        return "brightness(50%)";
      case "INVERT":
        return "invert(100%)";
      case "NONE":
        return "";
      case "WARM":
        return "sepia(30%)";
    }
  }, [pagesModifyColors]);

  return (
    <>
      <div
        className={cm(
          classes.page,
          `scroll-to-${page.name}`,
          "page",
          readingDirection === "TOP-TO-BOTTOM" && classes.topToBottom
        )}
        style={{
          filter,
        }}
      >
        <ImageItem {...state} page={page} />
      </div>
    </>
  );
}
