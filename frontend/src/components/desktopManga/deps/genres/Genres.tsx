import React, { ComponentProps } from "react";
import classes from "./genres.module.scss";
import { Link } from "react-router-dom";
import cm from "../../../../utils/classMerger";

export default function Genres({
  genres,
  style,
  className,
  skeleton,
  ...props
}: {
  genres: string[];
  style?: (idx: number) => any;
  skeleton?: boolean;
} & ComponentProps<"div">) {
  const res = genres.map((genre, i) => (
    <div
      key={genre}
      className={cm(
        skeleton && classes.isSkeleton,
        classes.inlineGenre,
        className,
      )}
      style={style?.(i)}
      {...props}>
      {i !== 0 && "•"}
      <Link to={`/genres/${genre}`}>
        <div className={cm(skeleton && classes.skeleton, classes.genre)}>
          {genre}
        </div>
      </Link>
    </div>
  ));

  return <div className={classes.genres}>{res}</div>;
}
