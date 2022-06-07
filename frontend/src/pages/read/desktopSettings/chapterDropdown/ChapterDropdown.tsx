import React, { memo, useMemo } from "react";
import Button from "../../../../components/button/Button";
import Dropdown from "../../../../components/dropdown/Dropdown";
import Icon from "../../../../components/icon/Icon";
import { parsePageUrlParameter } from "../../helpers";
import { useReader } from "../../ReaderContext";
import classes from "./chapterDropdown.module.scss";

type Props = {};

export default memo(function ChapterDropdown(props: Props) {
  const reader = useReader();
  const [currentPage] = useMemo(
    () => parsePageUrlParameter(reader.currentPage ?? "1"),
    [reader.currentPage],
  );

  const currentPages = useMemo(
    () => reader.currentChapter?.pages ?? [],
    [reader.currentChapter],
  );
  const chapterItems = useMemo(
    () =>
      reader.chapters.map(chapter => ({
        value: chapter,
        content: (
          <Button
            onClick={() => void reader.jumpToFixedChapter?.(chapter)}
            icon={<Icon scale={0.7} icon="playSolid" />}
            iconLoc="right"
            hoverReveal
            compact
            fullWidth
            accent={reader.currentChapter?.name === chapter.name}>
            <div className={classes.apart}>
              <div>
                {trunc(chapter?.type ?? "", true)}{" "}
                {resolveChapterName(chapter.name)}
              </div>
              <div className={classes.legendLabel}>
                {new Date(chapter.date)?.toLocaleDateString()}
              </div>
            </div>
          </Button>
        ),
      })),
    [reader.chapters, reader.currentChapter],
  );
  const pageItems = useMemo(() => {
    return (reader.currentChapter?.pages ?? []).map(page => ({
      value: page.name,
      content: (
        <Button
          onClick={() => void reader.jumpToFixedPage?.(page.name)}
          icon={<Icon scale={0.7} icon="playSolid" />}
          iconLoc="right"
          hoverReveal
          compact
          fullWidth
          accent={currentPage === page.name}>
          <div className={classes.apart}>
            <div>
              pg.
              {resolveChapterName(page.name)}
            </div>
          </div>
        </Button>
      ),
    }));
  }, [currentPage]);

  const chapterDropdown = useMemo(() => {
    return (
      <Dropdown
        button={
          <Button
            fullWidth
            iconLoc="right"
            icon={
              <Icon
                className={classes.btnIcon}
                icon="chevron"
                orientation=".25turn"
              />
            }>
            <div className={classes.legend}>
              <div
                className={classes.legendLabel}
                style={{
                  display: reader.currentChapter?.type ? "block" : "none",
                }}>
                {trunc(reader.currentChapter?.type ?? "")}
              </div>
              <div>
                {resolveChapterName(reader.currentChapter?.name ?? "???")} /{" "}
                {resolveChapterName(reader.chapters[0]?.name)}
              </div>
            </div>
          </Button>
        }
        items={chapterItems}
      />
    );
  }, [chapterItems, reader.currentChapter, reader.chapters]);

  const pageDropdown = useMemo(() => {
    return (
      <Dropdown
        button={
          <Button
            fullWidth
            iconLoc="right"
            icon={
              <Icon
                className={classes.btnIcon}
                icon="chevron"
                orientation=".25turn"
              />
            }>
            <div className={classes.legend}>
              <div
                className={classes.legendLabel}
                style={{
                  display: reader.currentChapter?.type ? "block" : "none",
                }}>
                pg.
              </div>
              <div>
                {currentPage} /{" "}
                {currentPages[currentPages.length - 1]?.name ?? "??"}
              </div>
            </div>
          </Button>
        }
        items={pageItems}
      />
    );
  }, [pageItems, currentPage, currentPages, reader.currentChapter]);

  return (
    <>
      <div className={classes.cont}>
        <div style={{ height: "20px" }}></div>
        <div className={classes.flex}>
          <Button
            disabled={
              reader.currentChapter?.name ===
              reader.chapters[reader.chapters.length - 1]?.name
            }
            compact
            slim
            icon={<Icon icon="chevron" orientation="-.5turn" />}
            onClick={() => void reader.jumpChapter(-1)}
          />
          {chapterDropdown}
          <Button
            disabled={reader.currentChapter?.name === reader.chapters[0]?.name}
            onClick={() => void reader.jumpChapter(1)}
            compact
            slim
            icon={<Icon icon="chevron" />}
          />
        </div>
        <div className={classes.flex}>
          <Button
            disabled={currentPage === currentPages[0]?.name}
            compact
            slim
            icon={<Icon icon="chevron" orientation="-.5turn" />}
            onClick={() => void reader.pageRelativeNavigate?.(-1)}
          />
          {pageDropdown}
          <Button
            disabled={
              currentPage === currentPages[currentPages.length - 1]?.name
            }
            onClick={() => void reader.pageRelativeNavigate?.(1)}
            compact
            slim
            icon={<Icon icon="chevron" />}
          />
        </div>
      </div>
    </>
  );
});

function trunc(name: string, hard?: boolean) {
  if (hard) return name.toLowerCase().slice(0, 2) + ".";
  if (/chapter/i.test(name)) return "ch.";
  return name;
}

function resolveChapterName(name: string) {
  if (!name) return "";
  const resolved = name.replace(/[^\d.]/g, "");
  return resolved;
}
