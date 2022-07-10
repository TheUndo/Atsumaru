import React, { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { ShowcaseItem } from "../carousel/Carousel";
import classes from "./showcase.module.scss";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Autoplay, Pagination, Navigation } from "swiper";
import Header from "../header/Header";
import Icon from "../icon/Icon";
import Button from "../button/Button";
import cm from "../../utils/classMerger";
import Genres from "../desktopManga/deps/genres/Genres";
import MangaLink from "../MangaLink/MangaLink";
import resolveVendorSlug from "../../utils/resolveVendorSlug";
import { useQuery } from "react-query";
import { apiBase } from "../../hooks/useApi";
import { ShowCaseLayoutItem } from "../../types/layouts";

type Props = {
  src: string;
};

export default function Showcase({ src }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const { refetch, status, isLoading, isRefetching, error, data, isError } =
    useQuery<{ items: ShowCaseLayoutItem[] }>(["front", src], () =>
      fetch(apiBase + src, {
        credentials: "include",
      }).then(res => res.json()),
    );

  const skeleton = useMemo(() => isLoading, [isLoading])
  
  const items: (ShowCaseLayoutItem | undefined)[] = useMemo(
    () => (skeleton ? [...Array(1)] : data?.items ?? []),
    [skeleton, data],
  );

  return createPortal(
    <div className={classes.showcase}>
      <div className={classes.inner}>
        <Swiper
          preventClicks={false}
          modules={[Autoplay, Pagination, Navigation]}
          loop={!skeleton}
          pagination={{ clickable: true }}
          autoplay={{
            pauseOnMouseEnter: true,
            disableOnInteraction: false,
            delay: 4300,
          }}
          onSlideChange={({ activeIndex }) => setActiveIdx(activeIndex)}>
          {items.map((item, i) => (
            <SwiperSlide key={item?.anilist?.id + "" + i}>
              <Item active={i === activeIdx} item={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>,
    document.getElementById("freeContentHeader")!,
  );
}

const fakeDescLines = 5;
function Item({
  item,
  active,
}: {
  item?: ShowcaseItem["items"][number];
  active: boolean;
}) {
  const delay = (n: number) => ({
    transitionDelay: `${n * 0.05 + 0.1}s`,
  });

  const fakeDescription = useMemo(() => {
    return (
      <div className={classes.fakeDesc}>
        {[...Array(fakeDescLines)].map(Math.random).map(r => (
          <div
            key={r}
            style={{
              width: `calc(89% + ${r} * 9%)`,
            }}></div>
        ))}
      </div>
    );
  }, []);

  return (
    <div className={classes.item}>
      <div
        className={classes.bg}
        style={{
          backgroundImage: `url("${item?.anilist.bannerImage}")`,
          backgroundColor:
            item?.anilist.coverImage.color ?? "rgba(255, 255, 255, .1)",
        }}></div>
      <div className={classes.content}>
        <div className={classes.animate} style={delay(1)}>
          <Header level={1}>
            {item?.anilist.title.english ?? item?.manga.title ?? (
              <div className={classes.fakeTitle}>
                <div></div>
                <div></div>
              </div>
            )}
          </Header>
        </div>
        <div className={classes.genres}>
          <Genres
            skeleton={!item?.manga.genres}
            genres={item?.manga.genres ?? [...Array(4)]}
            className={classes.animate}
            style={(idx: number) => delay(2 + idx * 0.5)}
          />
        </div>
        <div className={classes.animate} style={delay(2)}>
          {item ? (
            <p
              dangerouslySetInnerHTML={{
                __html: serializeDesc(item.anilist.description ?? ""),
              }}></p>
          ) : (
            <p>{fakeDescription}</p>
          )}
        </div>
        <div className={classes.buttons}>
          {item ? (
            <MangaLink
              to={`/manga/${resolveVendorSlug(item.manga.vendor)}/${
                item.manga.slug
              }`}>
              <Button
                style={delay(3.5)}
                className={classes.animate}
                iconLoc="right"
                hoverReveal
                icon={<Icon icon="omniDirectional" orientation="45deg" />}>
                More info
              </Button>
            </MangaLink>
          ) : (
            <Button
              style={delay(3.5)}
              disabled
              className={classes.animate}
              iconLoc="right"
              hoverReveal
              icon={
                <Icon
                  className={classes.invisible}
                  icon="omniDirectional"
                  orientation="45deg"
                />
              }>
              <div className={classes.invisible}>More info</div>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function serializeDesc(input: string) {
  const val = input
    .split(/notes/i)[0]
    .replace(/note\:.*|<br\s?\\?>|\(source.*\)/gi, "");

  return val.length > 500 ? val.slice(0, 500) + "..." : val;
}
