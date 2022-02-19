import React, { useContext } from "react";
import { AppContext } from "../../../App";
import Button from "../../../components/button/Button";
import Icon from "../../../components/icon/Icon";
import Loading from "../../../components/loading/Loading";
import { Page } from "../../../types";
import cm from "../../../utils/classMerger";
import { loadPage, loadPagesSequentially } from "../helpers";
import { PageState, ReaderContext } from "../Reader";
import classes from "./imageItem.module.scss";
import pageClasses from "../pageItem/pageItem.module.scss";

export default function ImageItem({
    page,
    ...state
}: PageState & { page: Page }) {
    const { loading, failed, src } = state;
    const { setLoadPages, loadPages, currentChapter } =
        useContext(ReaderContext);
    const [{ imageFitMethod, readingDirection }] = useContext(AppContext)
        ?.settings ?? [{}];

    return (
        <>
            {loading ? (
                <div className={classes.loadingPage}>
                    <Loading />
                    {/* {showMsg && <p>{msg}</p>} */}
                </div>
            ) : failed || !src ? (
                <div className={classes.imageLoadFail}>
                    <div>
                        <p>Image failed to load</p>
                        <div>
                            <Button
                                className={cm("reader-control-button")}
                                icon={<Icon icon="reload" />}
                                onClick={() => {
                                    setLoadPages?.((prev) => ({
                                        ...prev,
                                        [page.name]: {
                                            ...prev[page.name],
                                            loaded: false,
                                            loading: true,
                                            failed: false,
                                        },
                                    }));
                                    loadPage(page, (page, src) => {
                                        if (src)
                                            setLoadPages?.((prev) => ({
                                                ...prev,
                                                [page.name]: {
                                                    ...prev[page.name],
                                                    loaded: true,
                                                    loading: false,
                                                    failed: false,
                                                    src,
                                                },
                                            }));
                                        else
                                            setLoadPages?.((prev) => ({
                                                ...prev,
                                                [page.name]: {
                                                    ...prev[page.name],
                                                    loaded: false,
                                                    loading: false,
                                                    failed: true,
                                                },
                                            }));
                                    });
                                }}
                            >
                                Retry
                            </Button>
                        </div>
                        <div>
                            {Object.values(loadPages).filter((v) => v.failed)
                                .length > 1 && (
                                <Button
                                    style={{
                                        marginTop: ".5rem",
                                    }}
                                    className={cm("reader-control-button")}
                                    icon={<Icon icon="reload" />}
                                    onClick={() => {
                                        if (!currentChapter) return;
                                        loadPagesSequentially(
                                            4,
                                            currentChapter.pages.filter(
                                                (page) =>
                                                    loadPages[page.name]?.failed
                                            ),
                                            (page, src) => {
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
                                            }
                                        );
                                    }}
                                >
                                    Retry all failed
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            ) : imageFitMethod === "TO-SCREEN" &&
              readingDirection !== "TOP-TO-BOTTOM" ? (
                <div
                    style={{
                        backgroundImage: `url("${encodeURI(src!)}")`,
                    }}
                    className={pageClasses.img}
                ></div>
            ) : (
                <div
                    className={cm(
                        pageClasses.imgContainer,
                        imageFitMethod === "TO-HEIGHT" &&
                            pageClasses.imageFitToHeight
                    )}
                >
                    <img src={src} />
                </div>
            )}
        </>
    );
}
