import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { MangaInfo, ProgressInfo } from "../../types";
import Header from "../header/Header";
import Poster from "../poster/Poster";
import classes from "./carousel.module.scss";
import cm from "../../utils/classMerger";
import { Link, useLocation, useNavigate } from "react-router-dom";
import resolveVendorSlug from "../../utils/resolveVendorSlug";
import Swiper, { Pagination, Scrollbar, A11y } from "swiper";
import {
  Swiper as SwiperComponent,
  SwiperSlide,
  useSwiper,
} from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import useMedia from "../../hooks/useMedia";
import { resolvePageUrlParameter } from "../../pages/read/helpers";
import Icon from "../icon/Icon";
import Button from "../button/Button";
import getLatestProgress from "../../utils/getLatestProgress";
import { useQuery } from "react-query";
import { apiBase } from "../../hooks/useApi";

export type ShowcaseItem = {
  key: string;
  items: {
    manga: {
      vendor: MangaInfo["vendor"];
      slug: string;
      genres: string[];
      title?: string;
    };
    anilist: {
      id: number;
      title: {
        romaji?: string | null;
        english?: string | null;
      };
      coverImage: {
        extraLarge?: string | null;
        large?: string | null;
        color?: string | null;
      };
      description: string;
      bannerImage?: null | string;
    };
  }[];
  type: "showcase";
};

export type GenericItem = {
  title: string;
  key: string;
  items: {
    manga: MangaInfo;
    progress: undefined;
    type: "GENERIC_ITEM" | "PROGRESS_ITEM";
  }[];
};

export type ProgressItem = Omit<GenericItem, "items"> & {
  items: {
    manga: MangaInfo;
    progress: ProgressInfo;
  }[];
};

type Data = GenericItem | ProgressItem;

type Props = {
  src: string;
  title: React.ReactNode;
};

const CarouselContext = createContext<{
  swiper?: [
    Swiper | undefined,
    React.Dispatch<React.SetStateAction<Swiper | undefined>>,
  ];
}>({});

export default function Carousel({ src, title }: Props) {
  const { refetch, status, isLoading, isRefetching, error, data, isError } =
    useQuery<Data>(["front", src], () =>
      fetch(apiBase + src, {
        credentials: "include",
      }).then(res => res.json()),
    );

  const swiper = useState<Swiper>();
  const mobile = useMedia(
    ["(pointer: coarse)", "(pointer: fine)"],
    [true, false],
    false,
  );

  /* const ref = useRef(null); */
  /* const { onMouseDown } = useDraggableScroll(ref); */

  const skeleton = useMemo(() => isLoading, [isLoading]);

  if (!data?.items?.length && !isLoading) return <></>;

  if (status === "error")
    return (
      <Header level={3}>
        Error ({title}): {error + ""}
      </Header>
    );

  return (
    <>
      <CarouselContext.Provider value={{ swiper }}>
        <div className={classes.carousel}>
          <CarouselHeader data={data} onRefresh={refetch} title={title} />
          <div
            className={cm(classes.content)}
            style={
              !skeleton
                ? {}
                : {
                    overflow: "hidden",
                  }
            }>
            {mobile ? (
              <Mobile skeleton={skeleton} data={data} />
            ) : (
              <Desktop skeleton={skeleton} data={data} />
            )}
          </div>
        </div>
      </CarouselContext.Provider>
    </>
  );
}

function CarouselHeader({
  data,
  title,
  onRefresh,
}: {
  data?: Data;
  title: React.ReactNode;
  onRefresh?: () => void;
}) {
  const ctx = useContext(CarouselContext);
  const [swiper] = ctx.swiper ?? [];

  return (
    <Header level={1}>
      <div className={classes.header}>
        <div className={classes.title}>{title}</div>
        {!!data?.items?.length && (
          <>
            <div className={classes.controls}>
              <Button
                onClick={onRefresh}
                icon={<Icon scale={0.8} icon="reload" />}
              />
              <div className={classes.unit}>
                <Button
                  onClick={() => swiper?.slidePrev()}
                  icon={<Icon icon="chevron" orientation=".5turn" />}
                />
                <Button
                  onClick={() => swiper?.slideNext()}
                  icon={<Icon icon="chevron" />}
                />
              </div>
              <Button
                hoverReveal
                iconLoc="right"
                icon={<Icon icon="arrow" orientation=".25turn" />}>
                View all
              </Button>
            </div>
            <div className={classes.mobileControls}>
              <Link to="#">
                View all <Icon icon="arrow" orientation=".25turn" />
              </Link>
            </div>
          </>
        )}
      </div>
    </Header>
  );
}

const dummyItems = () => ({
  manga: undefined,
  progress: undefined,
});

function Mobile({ data, skeleton }: { data?: Data; skeleton: boolean }) {
  const items = useMemo(
    () => (skeleton ? [...Array(10)].map(dummyItems) : data?.items ?? []),
    [skeleton, data],
  );

  return (
    <>
      {items.map(({ manga, progress }, i) => (
        <Item key={manga?.slug + "" + i} progress={progress} manga={manga} />
      ))}
    </>
  );
}

function Desktop({ data, skeleton }: { data?: Data; skeleton: boolean }) {
  const columns = useMedia(
    [
      "(min-width: 1400px)",
      "(min-width: 1000px)",
      "(min-width: 600px)",
      "(min-width: 0px)",
    ],
    [5, 4, 3, 2],
    5,
  );

  const items = useMemo(() => {
    if (skeleton) return [...Array(columns)].map(dummyItems);
    return data?.items ?? [];
  }, [skeleton, columns, data]);

  return (
    <div className={classes.desktop}>
      <SwiperComponent
        modules={[Pagination, Scrollbar, A11y]}
        spaceBetween={10}
        slidesPerView={columns}
        preventClicksPropagation={true}
        preventClicks={false}
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        onSlideChange={() => void 0}>
        {items.map(({ manga, progress }, i) => (
          <SwiperSlide key={manga?.slug + "" + i}>
            <SwiperHook />
            <div className={classes.desktopInner}>
              <Item progress={progress} manga={manga} />
            </div>
          </SwiperSlide>
        ))}
      </SwiperComponent>
    </div>
  );
}

function SwiperHook() {
  const swiper = useSwiper();
  const ctx = useContext(CarouselContext);
  const [, setSwiper] = ctx.swiper ?? [];
  useEffect(() => {
    if (!swiper || !setSwiper) return;
    setSwiper(swiper);
  }, [swiper, setSwiper]);
  return <></>;
}

function Item({
  manga,
  progress,
}: {
  manga?: MangaInfo;
  progress?: ProgressInfo;
}) {
  const navigate = useNavigate();
  const latestProgress = useMemo(
    () => progress && getLatestProgress(progress),
    [progress],
  );
  const location = useLocation();
  const url = useMemo(
    () =>
      !manga
        ? ""
        : progress && latestProgress
        ? `/read/${resolveVendorSlug(manga.vendor)}/${manga.slug}/${
            latestProgress.chapter
          }/${resolvePageUrlParameter(
            parseInt(latestProgress.meta.page) ?? 1,
            latestProgress.meta.progress,
          )}`
        : `/manga/${resolveVendorSlug(manga.vendor)}/${manga.slug}`,
    [manga, progress, latestProgress],
  );

  const poster = useCallback(
    (read: boolean) => (
      <Poster
        onClick={() => {
          if (read)
            navigate(
              url,
              /^\/read/.test(url)
                ? {}
                : {
                    state: {
                      backgroundLocation: location,
                    },
                  },
            );
        }}
        label={manga?.title}
        progress={
          progress && latestProgress
            ? {
                full: progress,
                latest: latestProgress,
              }
            : undefined
        }
        manga={manga}
      />
    ),
    [manga, progress, latestProgress, url, location],
  );
  return poster(true);
  /* return (
        <Link
            style={{
                pointerEvents: "none",
            }}
            key={manga._id}
            to={`/manga/${resolveVendorSlug(manga.vendor)}/${manga.slug}`}
        >
            <Poster label={manga.title} manga={manga} />
        </Link>
    ); */
}
