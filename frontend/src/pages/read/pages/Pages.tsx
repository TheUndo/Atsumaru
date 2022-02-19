import React, { useContext, useEffect } from "react";
import useOnline from "../../../hooks/useOnline";
import { Page } from "../../../types";
import { loadPagesSequentially } from "../helpers";
import PageItem from "../pageItem/PageItem";
import { ReaderContext } from "../Reader";

type Props = {};

export default function Pages({
    pages,
    chapterName,
}: {
    pages: Page[];
    chapterName: string;
}) {
    const { setLoadPages, loadPages } = useContext(ReaderContext);
    const online = useOnline();

    useEffect(() => {
        loadPagesSequentially(4, pages, (page, src) => {
            if (src)
                setLoadPages?.((prev) => ({
                    ...prev,
                    [page.name]: {
                        ...prev[page.name],
                        src,
                        loaded: true,
                        loading: false,
                        failed: false,
                    },
                }));
            else
                setLoadPages?.((prev) => ({
                    ...prev,
                    [page.name]: {
                        ...prev[page.name],
                        loaded: true,
                        loading: false,
                        failed: true,
                    },
                }));
        });
    }, [pages, online]);

    return (
        <>
            {pages.map((page, i) => (
                <PageItem
                    page={page}
                    pages={pages}
                    idx={i}
                    key={page.name + chapterName}
                    state={loadPages[page.name]}
                />
            ))}
        </>
    );
}
