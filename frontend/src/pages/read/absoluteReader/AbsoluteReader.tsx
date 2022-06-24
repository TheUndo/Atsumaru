import React, { useContext } from "react";
import { AppContext } from "../../../appContext";
import Pages from "../pages/Pages";
import { useReader } from "../ReaderContext";
import classes from "./absoluteReader.module.scss";

type Props = {};

export default function AbsoluteReader(props: Props) {
  const { currentChapter } = useReader();
  const [{ readerBackgroundColor }] = useContext(AppContext).settings ?? [{}];
  const pages = currentChapter?.pages ?? [];

  return (
    <div
      className={classes.reader}
      style={
        {
          "--reader-bg": readerBackgroundColor ?? "#000",
        } as any
      }>
      <div className={classes.inner}>
        <Pages pages={pages} chapterName={currentChapter?.title ?? ""} />
      </div>
    </div>
  );
}
