import React, { useLayoutEffect, useRef, useState } from "react";
import { MangaInfo } from "../../types";
import Header from "../header/Header";
import Poster from "../poster/Poster";
import classes from "./carousel.module.scss";
import cm from "../../utils/classMerger";
import { Link, useNavigate } from "react-router-dom";
import resolveVendorSlug from "../../utils/resolveVendorSlug";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import useMedia from "../../hooks/useMedia";

export type CarouselItem = {
    header: string;
    key: string;
    items: MangaInfo[];
};

type Props = {
    item: CarouselItem;
};

export default function Carousel(props: Props) {
    const { item } = props;
    const mobile = useMedia(
        ["(pointer: coarse)", "(pointer: fine)"],
        [true, false],
        false
    );
    /* const ref = useRef(null); */
    /* const { onMouseDown } = useDraggableScroll(ref); */

    return (
        <>
            <div className={classes.carousel}>
                <Header level={1}>{item.header}</Header>
                <div className={cm(classes.content)}>
                    {mobile ? (
                        item.items.map((manga) => (
                            <Item key={manga.slug} manga={manga} />
                        ))
                    ) : (
                        <Desktop items={item.items} />
                    )}
                </div>
            </div>
        </>
    );
}

function Desktop({ items }: { items: MangaInfo[] }) {
    const columns = useMedia(
        [
            "(min-width: 1400px)",
            "(min-width: 1000px)",
            "(min-width: 600px)",
            "(min-width: 0px)",
        ],
        [5, 4, 3, 2],
        5
    );
    return (
        <div className={classes.desktop}>
            <Swiper
                // install Swiper modules
                modules={[Navigation, Pagination, Scrollbar, A11y]}
                spaceBetween={10}
                slidesPerView={columns}
                navigation
                preventClicksPropagation={true}
                preventClicks={false}
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
                onSwiper={(swiper) => console.log(swiper)}
                onSlideChange={() => console.log("slide change")}
            >
                {items.map((manga) => (
                    <SwiperSlide key={manga.slug}>
                        <div className={classes.desktopInner}>
                            <Item manga={manga} />
                            {/* <div
                            style={{
                                background: "red",
                                height: "300px"
                            }}
                        >
                        </div> */}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

function Item({ manga }: { manga: MangaInfo }) {
    const navigate = useNavigate();
    return (
        <Poster
            onClick={() =>
                navigate(
                    `/manga/${resolveVendorSlug(manga.vendor)}/${manga.slug}`
                )
            }
            label={manga.title}
            manga={manga}
        />
    );
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
