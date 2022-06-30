import React, { useMemo, useState } from "react";
import classes from "./chapters.module.scss";
import { MangaInfo, ProgressInfo } from "../../../../types";
import Button from "../../../button/Button";
import Header from "../../../header/Header";
import Icon from "../../../icon/Icon";
import { ChapterItem } from "../../../info/Chapters";
import Switcher from "../../../switcher/Switcher";
import Label from "../label/Label";
import switcherItem from "../switcherItem/SwitcherItem";

export default function Chapters({
  data,
  progress,
}: {
  data: MangaInfo;
  progress?: ProgressInfo;
}) {
  const { chapters: unsortedChapters, vendor, slug } = data;
  type Filters = "OVERVIEW" | "ALL" | "READ" | "UNREAD";
  type Sort = "DESCENDING" | "ASCENDING";
  const [filter, setFilter] = useState<Filters>("OVERVIEW");
  const [sort, setSort] = useState<Sort>("DESCENDING");
  const e404 = <p>No chapters found</p>;
  const chapters =
    sort === "DESCENDING" ? unsortedChapters : [...unsortedChapters].reverse();
  const content = useMemo(() => {
    switch (filter) {
      case "OVERVIEW":
        const gutter = 6;
        return (
          <>
            {chapters.length > gutter * 2 ? (
              <>
                <div className={classes.chapters}>
                  {chapters.slice(0, gutter).map(chapter => (
                    <ChapterItem
                      vendor={vendor}
                      slug={slug}
                      chapter={chapter}
                      key={chapter.name}
                      progress={progress}
                    />
                  ))}
                </div>
                <div className={classes.chapterEllipsis}>
                  <Button
                    onClick={() => setFilter("ALL")}
                    alignCenter
                    fullWidth
                    transparent
                    compact>
                    ...
                  </Button>
                </div>
                <div className={classes.chapters}>
                  {chapters.slice(-gutter).map(chapter => (
                    <ChapterItem
                      progress={progress}
                      vendor={vendor}
                      slug={slug}
                      chapter={chapter}
                      key={chapter.name}
                    />
                  ))}
                </div>
              </>
            ) : chapters.length ? (
              <>
                <div className={classes.chapters}>
                  {chapters.map(chapter => (
                    <ChapterItem
                      progress={progress}
                      vendor={vendor}
                      slug={slug}
                      chapter={chapter}
                      key={chapter.name}
                    />
                  ))}
                </div>
              </>
            ) : (
              e404
            )}

            <Button
              icon={<Icon icon="omniDirectional" orientation=".12turn" />}
              fullWidth
              onClick={() => setFilter("ALL")}
              compact>
              Show all chapters
            </Button>
          </>
        );
      case "ALL":
        if (!chapters.length) return e404;
        return (
          <div className={classes.chapters}>
            {chapters.map(chapter => (
              <ChapterItem
                progress={progress}
                vendor={vendor}
                slug={slug}
                chapter={chapter}
                key={chapter.name}
              />
            ))}
          </div>
        );
      case "READ":
        const resolvedChapters = chapters.filter(
          chapter => !!progress?.chapterProgress[chapter.name],
        );
        if (!resolvedChapters.length) return e404;
        return (
          <div className={classes.chapters}>
            {resolvedChapters.map(chapter => (
              <ChapterItem
                progress={progress}
                vendor={vendor}
                slug={slug}
                chapter={chapter}
                key={chapter.name}
              />
            ))}
          </div>
        );
      case "UNREAD": {
        const resolvedChapters = chapters.filter(
          chapter => !progress?.chapterProgress[chapter.name],
        );
        if (!resolvedChapters.length) return e404;
        return (
          <div className={classes.chapters}>
            {resolvedChapters.map(chapter => (
              <ChapterItem
                progress={progress}
                vendor={vendor}
                slug={slug}
                chapter={chapter}
                key={chapter.name}
              />
            ))}
          </div>
        );
      }
      default:
        return "Oops, unsupported filter (thonk)";
    }
  }, [filter, e404, chapters, sort]);

  return (
    <div className={classes.chaptersCont}>
      <div className={classes.chaptersTitle}>
        <Header level={2}>
          Chapters {chapters.length && <>({chapters.length})</>}
        </Header>
        <Label>Filter chapters</Label>
        <div className={classes.switchers}>
          <Switcher
            variant="dark"
            selected={filter}
            onChange={setFilter}
            items={[
              switcherItem<Filters>("OVERVIEW", "Overview"),
              switcherItem<Filters>("ALL", "All"),
              switcherItem<Filters>("READ", "Read"),
              switcherItem<Filters>("UNREAD", "Unread"),
            ]}
          />
          <Switcher
            variant="dark"
            selected={sort}
            onChange={setSort}
            items={[
              switcherItem<Sort>("DESCENDING", "", {
                icon: <Icon icon="arrow" orientation=".5turn" />,
              }),
              switcherItem<Sort>("ASCENDING", "", {
                icon: <Icon icon="arrow" />,
              }),
            ]}
          />
        </div>
      </div>
      <div className={classes.chapterInner}>{content}</div>
    </div>
  );
}
