import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useRipple from "use-ripple-hook";
import useImage from "../../hooks/useImage";
import { GridDisplayType, MangaInfo, ProgressInfo } from "../../types";
import cm from "../../utils/classMerger";
import normalizeChapterNames from "../../utils/normalizeChapterNames";
import percentage from "../../utils/percentage";
import resolveVendorSlug from "../../utils/resolveVendorSlug";
import Button from "../button/Button";
import Header from "../header/Header";
import Icon from "../icon/Icon";
import classes from "./poster.module.scss";

type Props = {
  manga?: MangaInfo;
  label?: string;
  displayType?: GridDisplayType;
  progress?: {
    full: ProgressInfo;
    latest: {
      chapter: string;
      meta: ProgressInfo["chapterProgress"][string];
    };
  };
} & React.ComponentProps<"div">;

const failImage = "https://i.imgur.com/SIyOAeP.png";

export default function Poster(props: Props) {
  const { manga, label, progress, ...compProps } = props;
  const [ripple, event] = useRipple();
  const {
    src: image,
    loading,
    fail,
    retry,
  } = useImage([manga?.cover], failImage);

  const navigate = useNavigate();

  useEffect(() => {
    retry();
  }, [manga]);

  const Image = useMemo(
    () => (
      <div
        ref={ripple}
        className={classes.posterImage}
        style={{
          backgroundImage: `url("${fail ? failImage : image}")`,
        }}>
        {loading && <div className={classes.loader}></div>}
      </div>
    ),
    [ripple, fail, image, loading],
  );

  if (props.displayType && ["LIST", "DETAILS"].includes(props.displayType)) {
    return (
      <>
        <div
          onMouseDown={event}
          className={cm(classes.posterList, props.displayType === "DETAILS" && classes.details)}
          {...compProps}>
          <div ref={ripple} className={classes.content}>
            <div className={classes.posterWrapper}>{Image}</div>
            <div className={classes.info}>
              <div>
                <Header className={classes.title} level={4}>
                  {manga?.title ?? "Unknown manga"}
                </Header>
              </div>
              <div className={classes.genres}>
                {manga?.genres.map((v, i) => (
                  <div key={v} className={classes.genre}>
                    {v}
                  </div>
                ))}
              </div>
              <div className={classes.desc}>
                {manga?.description ?? <i>No description was found</i>}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={classes.poster} onMouseDown={event} {...compProps}>
        {Image}
        {progress && manga && (
          <ProgressMeta progress={progress} manga={manga} />
        )}
        {manga && progress && window.matchMedia("(pointer: fine)").matches && (
          <div className={classes.infoButton}>
            <Button
              onClick={e => {
                e.stopPropagation();
                navigate(
                  `/manga/${resolveVendorSlug(manga.vendor)}/${manga.slug}`,
                );
              }}
              icon={<Icon icon="info" />}
              circle
            />
          </div>
        )}
        <div className={classes.label}>{label}</div>
      </div>
    </>
  );
}

function ProgressMeta({
  manga,
  progress,
}: {
  manga: MangaInfo;
  progress: NonNullable<Props["progress"]>;
}) {
  return (
    <div className={classes.badge}>
      <span className={classes.desktopBullet}>ch. </span>
      <span>{normalizeChapterNames(progress!.latest.chapter)}</span>
      <span>/</span>
      {manga?.chapters && (
        <>
          <span>{normalizeChapterNames(manga.chapters[0]?.name)}</span>
          <span className={classes.desktopBullet}> • </span>
          <br className={classes.mobileBreakLine} />
          <span className={classes.desktopBullet}>
            p.{" "}
            {progress.full.preferredDirection === "TOP-TO-BOTTOM"
              ? percentage(progress.latest.meta.progress ?? 0, 3) + "%"
              : progress.latest.meta.page}
          </span>
        </>
      )}
    </div>
  );
}
