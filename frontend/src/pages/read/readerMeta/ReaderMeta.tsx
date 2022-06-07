import React, { useContext, useEffect, useMemo, useState } from "react";
import { AppContext } from "../../../appContext";
import getBattery, { BatteryLevel } from "../../../utils/battery";
import cm from "../../../utils/classMerger";
import percentage from "../../../utils/percentage";
import { parsePageUrlParameter } from "../helpers";
import { ReaderContext } from "../ReaderContext";
import classes from "./readerMeta.module.scss";

type Props = {};

export default function ReaderMeta(props: Props) {
  const { background, currentChapter, chapters, currentPage } =
    useContext(ReaderContext);
  const [settings] = useContext(AppContext).settings ?? [];
  const [time, setTime] = useState(getLocalTime());
  const [battery, setBattery] = useState<null | BatteryLevel>(null);

  useEffect(() => {
    let doBattery = true;
    const interval = setInterval(() => {
      setTime(getLocalTime());
      if (doBattery)
        getBattery()
          .then(setBattery)
          .catch(() => {
            doBattery = false;
          });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const items = useMemo(() => {
    const [pageName] = parsePageUrlParameter(currentPage ?? "1");
    const chapterShown = settings?.readerMeta?.chapter === "YES";
    const pageShown = settings?.readerMeta?.page === "YES";
    const timeShown = settings?.readerMeta?.time === "YES";
    const showBattery =
      settings?.readerMeta?.battery === "YES" &&
      !!battery &&
      battery.level !== 1;
    const labelsShown = settings?.readerMeta?.labels === "YES";
    return [
      chapterShown &&
        `${labelsShown ? "ch. " : ""}${currentChapter?.name}/${
          chapters[0]?.name ?? "?"
        }`,
      pageShown &&
        `${labelsShown ? "p. " : ""}${pageName}/${
          currentChapter?.pages?.[currentChapter?.pages.length - 1]?.name ?? "?"
        }`,
      showBattery && (
        <span
          style={{
            color: battery.level <= 0.1 ? "#ff574f" : "inherit",
          }}>
          {labelsShown && "ba. "}
          {battery?.level * 100}%
        </span>
      ),
      timeShown && time,
    ].map((v, i) => ({ i, v }));
  }, [
    time,
    currentChapter,
    currentPage,
    chapters.length,
    battery,
    settings?.readerMeta?.chapter,
    settings?.readerMeta?.page,
    settings?.readerMeta?.time,
    settings?.readerMeta?.battery,
    settings?.readerMeta?.labels,
  ]);

  return (
    <>
      <div
        className={cm(
          classes.readerMeta,
          settings?.readerMeta.disabled === "YES" && classes.hidden,
        )}
        style={{ background }}>
        <div className={classes.inner}>
          {items
            .filter(v => v.v)
            .map(({ v, i }, j) => (
              <span key={i} className={classes.item}>
                {v}
              </span>
            ))}
        </div>
      </div>
    </>
  );
}

function getLocalTime(): string {
  return new Date()
    ?.toLocaleString()
    ?.split(" ")?.[1]
    ?.split(":")
    ?.slice(0, -1)
    ?.join(":");
}
