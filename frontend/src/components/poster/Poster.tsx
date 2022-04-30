import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useRipple from "use-ripple-hook";
import useImage from "../../hooks/useImage";
import { MangaInfo, ProgressInfo } from "../../types";
import percentage from "../../utils/percentage";
import resolveVendorSlug from "../../utils/resolveVendorSlug";
import Button from "../button/Button";
import Icon from "../icon/Icon";
import classes from "./poster.module.scss";

type Props = {
  manga?: MangaInfo;
  label?: string;
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

  return (
    <>
      <div className={classes.poster} onMouseDown={event} {...compProps}>
        <div
          ref={ripple}
          className={classes.posterImage}
          style={{
            backgroundImage: `url("${fail ? failImage : image}")`,
          }}>
          {loading && <div className={classes.loader}></div>}
        </div>
        {progress && (
          <div className={classes.badge}>{`ch. ${progress.latest.chapter}${
            manga?.chapters
              ? `/${manga.chapters[0]?.name} • p. ${
                  progress.full.preferredDirection === "TOP-TO-BOTTOM"
                    ? percentage(progress.latest.meta.progress ?? 0, 3) + "%"
                    : progress.latest.meta.page
                }`
              : ""
          }`}</div>
        )}
       {manga && progress && window.matchMedia("(pointer: fine)").matches && <div className={classes.infoButton}>
          <Button
            onClick={e => {
              e.stopPropagation();
              navigate(`/manga/${resolveVendorSlug(manga.vendor)}/${manga.slug}`)
            }}
            icon={<Icon icon="info" />}
            circle
          />
        </div>}
        <div className={classes.label}>{label}</div>
      </div>
    </>
  );
}
