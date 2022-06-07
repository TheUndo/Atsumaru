import React, { useState } from "react";
import useLocalStorage from "../../hooks/useLocalStorage";
import useMedia from "../../hooks/useMedia";
import { GridDisplayType } from "../../types";
import cm from "../../utils/classMerger";
import Button from "../button/Button";
import Icon from "../icon/Icon";
import Switcher from "../switcher/Switcher";
import classes from "./posterGrid.module.scss";

type Props = {
  children: React.ReactNode;
  controls?: React.ReactNode;
  gridType?: GridDisplayType;
} & React.ComponentProps<"div">;

export default function PosterGrid(props: Props) {
  const { className, children, style, controls, gridType, ...compProps } =
    props;

  const mediaArgs: Record<GridDisplayType, [string[], number[], number]> = {
    GRID: [
      [
        "(min-width: 1400px)",
        "(min-width: 1100px)",
        "(min-width: 823px)",
        "(min-width: 0px)",
      ],
      [5, 4, 3, 2],
      5,
    ],
    LIST: [
      ["(min-width: 1300px)", "(min-width: 900px)", "(min-width: 0px)"],
      [3, 2, 1],
      3,
    ],
    DETAILS: [["(min-width: 0px)"], [1], 1],
  };
  const columnsMap = {
    GRID: useMedia(...mediaArgs.GRID),
    LIST: useMedia(...mediaArgs.LIST),
    DETAILS: useMedia(...mediaArgs.DETAILS),
  };
  const columns = columnsMap[gridType ?? "GRID"];

  return (
    <>
      <div
        className={cm(
          className,
          classes.grid,
          gridType === "GRID" && classes.isGrid,
        )}
        {...compProps}>
        {controls}
        <div
          style={{
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            ...style,
          }}
          className={classes.inner}>
          {children}
        </div>
      </div>
    </>
  );
}
