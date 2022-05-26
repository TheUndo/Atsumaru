import React from "react";
import useMedia from "../../hooks/useMedia";
import cm from "../../utils/classMerger";
import classes from "./posterGrid.module.scss";

type Props = {
  children: React.ReactNode;
} & React.ComponentProps<"div">;

export default function PosterGrid(props: Props) {
  const { className, children, style, ...compProps } = props;

  const columns = useMedia(
    [
      "(min-width: 1400px)",
      "(min-width: 1100px)",
      "(min-width: 820px)",
      "(min-width: 0px)",
    ],
    [5, 4, 3, 2],
    5,
  );

  return (
    <>
      <div
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          ...style,
        }}
        className={cm(className, classes.grid)}
        {...compProps}>
        {children}
      </div>
    </>
  );
}