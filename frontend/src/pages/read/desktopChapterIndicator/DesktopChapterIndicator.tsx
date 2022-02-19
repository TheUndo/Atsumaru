import React, { useContext } from "react";
import Button from "../../../components/button/Button";
import Icon from "../../../components/icon/Icon";
import cm from "../../../utils/classMerger";
import { ReaderContext } from "../Reader";
import classes from "./desktopChapterIndicator.module.scss";

export default function DesktopChapterIndicator({ shift }: { shift: boolean }) {
    const { jumpChapter, desktopControlsVisible, currentChapter, chapters } =
        useContext(ReaderContext);

    return (
        <>
            <div
                className={cm(
                    classes.desktopChapterIndicator,
                    shift && classes.desktopChapterIndicatorShifted,
                    !shift &&
                        !desktopControlsVisible &&
                        classes.desktopChapterHidden
                )}
            >
                <Button
                    onClick={() => jumpChapter?.(-1)}
                    icon={<Icon icon="chevron" orientation="-.5turn" />}
                />
                <Button disabled>
                    {currentChapter?.name ?? "?"} / {chapters?.[0].name ?? "?"}
                </Button>
                <Button
                    onClick={() => jumpChapter?.(1)}
                    icon={<Icon icon="chevron" orientation="" />}
                />
            </div>
        </>
    );
}
