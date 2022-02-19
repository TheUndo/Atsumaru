import React, { useEffect, useState } from "react";
import { useMatch, useNavigate, useParams } from "react-router-dom";
import Content from "./Content";
import Modal from "../modal/Modal";
import Chapters from "./Chapters";
import useApi from "../../hooks/useApi";
import { MangaInfo } from "../../types";
import resolveVendorSlug from "../../utils/resolveVendorSlug";

export default function Info({
    layout,
}: {
    layout: React.RefObject<HTMLDivElement>;
}) {
    const { mangaSlug, vendor } = useParams();
    //const [slugs, setSlugs] = useState<string[]>(mangaSlug ? [mangaSlug] : []);
    /* useEffect(() => {
        if (!mangaSlug) return;
        setSlugs((prev) => [...new Set([...prev, mangaSlug])]);
    }, [mangaSlug]); */

    return (
        <>
            <ShowModal
                vendor={vendor as MangaInfo["vendor"]}
                layout={layout}
                slug={mangaSlug}
            />
            <ChapterModal
                vendor={vendor as MangaInfo["vendor"]}
                layout={layout}
                slug={mangaSlug}
            />
        </>
    );
}

function ShowModal({
    slug,
    layout,
    vendor,
}: {
    slug?: string;
    layout: React.RefObject<HTMLDivElement>;
    vendor: MangaInfo["vendor"];
}) {
    const [shown, setShown] = useState(false);
    const apiData = useApi<MangaInfo>(`/manga/${vendor}/${slug}`);
    const navigate = useNavigate();
    /* useEffect(() => {
        if (!resolveVendorSlug) navigate("/?error=INVALID_VENDOR");
    }, [vendor]); */

    return (
        <>
            <Modal
                shown={!!slug}
                scaleElements={[layout.current]}
                onClose={() => {
                    setShown(false);
                    navigate("/");
                }}
                id="info-modal"
            >
                <Content slug={slug} apiData={apiData} />
            </Modal>
        </>
    );
}

const ChapterModal = React.memo(
    ({
        slug,
        layout,
        vendor,
    }: {
        slug?: string;
        layout: React.RefObject<HTMLDivElement>;
        vendor: MangaInfo["vendor"];
    }) => {
        const navigate = useNavigate();
        const match = useMatch(`/manga/${vendor}/:mangaSlug/chapters`);
        const apiData = useApi<MangaInfo>(`/manga/${vendor}/${slug}`);

        return (
            <Modal
                scaleElements={[document.getElementById("info-modal")]}
                shown={!!match}
                onClose={() => navigate(`/manga/${vendor}/${slug}`)}
            >
                {slug && (
                    <Chapters
                        vendor={vendor}
                        slug={slug}
                        chapters={apiData?.data?.chapters}
                    />
                )}
            </Modal>
        );
    }
);
