import React, { useMemo } from "react";
import useLocalStorage from "../../hooks/useLocalStorage";
import { Chapter, MangaInfo } from "../../types";
import resolveVendorSlug from "../../utils/resolveVendorSlug";
import Button from "../button/Button";
import Header from "../header/Header";
import Icon from "../icon/Icon";
import classes from "./chapters.module.scss";

type Props = {
  chapters: Chapter[];
  slug: string;
  vendor: MangaInfo["vendor"];
};

export default function Chapters({ chapters, slug, vendor }: Props) {
  const [sort, setSort] = useLocalStorage("manga-sort-chapters");
  const id = useMemo(() => Math.random() + "", []);

  // performance gains
  const reversed = useMemo(() => chapters?.slice(0).reverse(), [chapters]);
  const sorted = useMemo(
    () => (sort === "asc" ? reversed : chapters) ?? [],
    [reversed, chapters, sort]
  );
  return (
    <>
      <div className={classes?.chapters}>
        <Header level={1}>
          {chapters?.length ? (
            <>Chapters {chapters?.length ? `(${chapters.length})` : ""}</>
          ) : (
            "Loading chapters..."
          )}
        </Header>
        <div className={classes.sort}>
          <Button
            icon={
              <Icon
                orientation={sort === "asc" ? "0" : ".5turn"}
                icon="arrow"
              />
            }
            iconLoc="right"
            label="Sort"
            onClick={() => setSort(sort === "asc" ? "desc" : "asc")}
          >
            {sort === "asc" ? "Ascending" : "Descending"}
          </Button>
        </div>
        {(chapters?.length ?? 0) > 5 && (
          <div className={classes?.content}>
            {sorted.map((chapter, i, arr) => (
              <ChapterItem
                vendor={vendor}
                slug={slug}
                key={i + id}
                chapter={chapter}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export function ChapterItem({
  chapter,
  slug,
  vendor,
}: {
  slug: string;
  chapter: Chapter;
  vendor: MangaInfo["vendor"];
}) {
  return (
    <>
      <div className={classes.chapter}>
        <Button
          to={`/read/${resolveVendorSlug(vendor)}/${slug}/${chapter.name}/${1}`}
          fullWidth
          icon={<Icon icon="playSolid" />}
        >
          <div className={classes.chapterName}>
            <div className={classes.text}>
              {chapter.type || "Chapter"} {chapter.name}
            </div>
            <div className={classes.date}>
              {new Date(chapter.date)?.toLocaleDateString()}
            </div>
          </div>
        </Button>
      </div>
    </>
  );
}
