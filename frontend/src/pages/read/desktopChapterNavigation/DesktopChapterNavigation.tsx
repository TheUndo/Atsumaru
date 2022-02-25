import React, { useContext, useMemo } from "react";
import useRipple from "use-ripple-hook";
import { AppContext } from "../../../App";
import Button from "../../../components/button/Button";
import Icon from "../../../components/icon/Icon";
import useMedia from "../../../hooks/useMedia";
import cm from "../../../utils/classMerger";
import { parsePageUrlParameter } from "../helpers";
import { ReaderContext } from "../Reader";
import classes from "./desktopChapterNavigation.module.scss";

export default function DesktopChapterNavigation() {
    const { currentChapter, currentPage, chapters, jumpChapter } =
        useContext(ReaderContext);
    const [{ readingDirection, readerKeyboardNavigation }] = useContext(
        AppContext
    ).settings ?? [{}];
    const desktop = useMedia(["(pointer: fine)"], [true], true);

    const currentChapterIndex = chapters.findIndex(
        (chapter) => chapter.name === currentChapter?.name
    );
    const nextChapter = chapters[currentChapterIndex - 1];
    const previousChapter = chapters[currentChapterIndex + 1];

    const reverse = useMemo(
        () => readingDirection === "RIGHT-TO-LEFT",
        [readingDirection]
    );

    const cPage = useMemo(
        () => parsePageUrlParameter(currentPage ?? "-1")[0],
        [currentPage]
    );
    const nextShortcut =
        readerKeyboardNavigation?.nextPage === "YES" &&
        readerKeyboardNavigation.disabled !== "YES";
    const previousShortcut =
        readerKeyboardNavigation?.previousPage === "YES" &&
        readerKeyboardNavigation.disabled !== "YES";

    const lastPage =
        currentChapter?.pages?.[currentChapter.pages.length - 1]?.name ?? "-2";
    const firstPage = currentChapter?.pages?.[0]?.name ?? "-2";

    const nextHidden = lastPage !== cPage;
    const previousHidden = firstPage !== cPage;

    if (!desktop) return <></>;

    return (
        <>
            {previousChapter && (
                <Navigation
                    onClick={() => jumpChapter(-1)}
                    button={
                        <Button
                            transparent
                            className={classes.button}
                            icon={
                                <Icon
                                    icon="arrow"
                                    orientation={
                                        !reverse ? "-.25turn" : ".25turn"
                                    }
                                />
                            }
                            iconLoc={!reverse ? "left" : "right"}
                        >
                            Chapter {previousChapter.name}{" "}
                            {previousShortcut && "(P)"}
                        </Button>
                    }
                    className={cm(
                        !reverse ? classes.left : classes.right,
                        previousHidden && classes.hidden
                    )}
                />
            )}
            {nextChapter && (
                <Navigation
                    onClick={() => jumpChapter(1)}
                    button={
                        <Button
                            transparent
                            className={classes.button}
                            icon={
                                <Icon
                                    icon="arrow"
                                    orientation={
                                        reverse ? "-.25turn" : ".25turn"
                                    }
                                />
                            }
                            iconLoc={reverse ? "left" : "right"}
                        >
                            Chapter {nextChapter.name} {nextShortcut && "(N)"}
                        </Button>
                    }
                    className={cm(
                        reverse ? classes.left : classes.right,
                        nextHidden && classes.hidden
                    )}
                />
            )}
        </>
    );
}

function Navigation({
    button,
    className,
    onClick,
}: {
    button: React.ReactNode;
    className: string;
    onClick: () => void;
}) {
    const [ripple, event] = useRipple();

    return (
        <>
            <div onClick={onClick} className={cm(className, classes.item)}>
                <div className={classes.inner} ref={ripple} onMouseDown={event}>
                    {button}
                </div>
            </div>
        </>
    );
}
