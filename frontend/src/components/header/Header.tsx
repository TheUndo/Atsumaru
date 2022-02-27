import React from "react";
import { downloadFile } from "../../offline/downloadFile";
import cm from "../../utils/classMerger";
import classes from "./header.module.scss";

type Props = {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
} & React.ComponentProps<"h1">;

export default function Header(props: Props) {
  const { level, children, ...compProps } = props;
  return React.createElement(`h${level}`, {
    ...compProps,
    children,
    className: cm(classes.header, "header"),
  });
}
