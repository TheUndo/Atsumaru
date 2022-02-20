import React, { useLayoutEffect, useRef, useState } from "react";
import { MangaInfo } from "../../types";
import Header from "../header/Header";
import Poster from "../poster/Poster";
import classes from "./carousel.module.scss";
import cm from "../../utils/classMerger";
import { Link } from "react-router-dom";
import resolveVendorSlug from "../../utils/resolveVendorSlug";

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
    /* const ref = useRef(null); */
    /* const { onMouseDown } = useDraggableScroll(ref); */

    return (
        <>
            <div className={classes.carousel}>
                <Header level={1}>{item.header}</Header>
                <div className={cm(classes.content)}>
                    {item.items.map((manga) => (
                        <Link
                            key={manga._id}
                            to={`/manga/${resolveVendorSlug(manga.vendor)}/${
                                manga.slug
                            }`}
                        >
                            <Poster label={manga.title} manga={manga} />
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}
