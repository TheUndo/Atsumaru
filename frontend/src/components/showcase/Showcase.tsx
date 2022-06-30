import React, { useState } from "react";
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

type Props = {
  layout: ShowcaseItem;
};

export default function Showcase({ layout }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);

  return createPortal(
    <div className={classes.showcase}>
      <div className={classes.inner}>
        <Swiper
          preventClicks={false}
          modules={[Autoplay, Pagination, Navigation]}
          loop
          pagination={{ clickable: true }}
          autoplay={{
            pauseOnMouseEnter: true,
            disableOnInteraction: false,
            delay: 4300,
          }}
          onSlideChange={({ activeIndex }) => setActiveIdx(activeIndex)}>
          {layout.items.map((item, i) => (
            <SwiperSlide key={item.anilist.id}>
              <Item active={i === activeIdx} item={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>,
    document.getElementById("freeContentHeader")!,
  );
}

function Item({
  item,
  active,
}: {
  item: ShowcaseItem["items"][number];
  active: boolean;
}) {
  const delay = (n: number) => ({
    transitionDelay: `${n * 0.05 + 0.1}s`,
  });

  return (
    <div className={classes.item}>
      <div
        className={classes.bg}
        style={{
          backgroundImage: `url("${item.anilist.bannerImage}")`,
          backgroundColor: item.anilist.coverImage.color ?? "transparent",
        }}></div>
      <div className={classes.content}>
        <div className={classes.animate} style={delay(1)}>
          <Header level={1}>{item.anilist.title.english}</Header>
        </div>
        <div className={classes.genres}>
          <Genres
            genres={item.manga.genres ?? []}
            className={classes.animate}
            style={(idx: number) => delay(2 + idx * 0.5)}
          />
        </div>
        <div className={classes.animate} style={delay(2)}>
          <p
            dangerouslySetInnerHTML={{
              __html: serializeDesc(item.anilist.description ?? ""),
            }}></p>
        </div>
        <div className={classes.buttons}>
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
