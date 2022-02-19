import React, { useCallback, useContext, useState } from "react";
import { AppContext } from "../../../App";
import { Page } from "../../../types";
import cm from "../../../utils/classMerger";
import DesktopChapterIndicator from "../desktopChapterIndicator/DesktopChapterIndicator";
import PageThumbnail from "../previewThumbnail/PreviewThumbnail";
import { ReaderContext } from "../Reader";
import classes from "./pagePreviewThumbnails.module.scss";

export default function PagePreviewThumbnails({ pages }: { pages: Page[] }) {
    const [settings] = useContext(AppContext)?.settings ?? [];
    const [shown, setShown] = useState(false);
    const { loadPages } = useContext(ReaderContext);

    const handleMove = useCallback(() => {
        setShown(true);
    }, []);
    const handleLeave = useCallback(() => {
        setShown(false);
    }, []);

    const resolvedShown =
        settings?.displayCurrentPageIndicator === "ALWAYS"
            ? true
            : settings?.displayCurrentPageIndicator === "NEVER"
            ? false
            : shown;

    return (
        <>
            <div
                className={classes.pagePreviewTrigger}
                onMouseMove={handleMove}
                onMouseLeave={handleLeave}
            >
                <DesktopChapterIndicator shift={resolvedShown} />
                <div
                    className={cm(
                        classes.preview,
                        !resolvedShown && classes.pagePreviewHidden
                    )}
                >
                    <div
                        className={cm(
                            classes.previewInner,
                            settings?.readingDirection === "RIGHT-TO-LEFT" &&
                                classes.previewFlipped
                        )}
                    >
                        {Object.values(loadPages).map((page) => {
                            return (
                                <PageThumbnail key={page.name} state={page} />
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}
