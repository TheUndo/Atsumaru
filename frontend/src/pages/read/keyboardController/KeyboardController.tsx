import React, { useCallback, useContext, useEffect } from "react";
import useKeyboardShortcut from "use-keyboard-shortcut";
import { AppContext } from "../../../App";
import { ReaderContext } from "../Reader";

export default function KeyboardController() {
    const [settings, setSetting] = useContext(AppContext).settings ?? [];
    const nav = settings?.readerKeyboardNavigation;
    const { pageRelativeNavigate, jumpChapter } = useContext(ReaderContext);
    const reversed = settings?.readingDirection === "RIGHT-TO-LEFT";

    useEffect(() => {
        const event = (e: KeyboardEvent) => {
            if (
                document.activeElement !== document.body ||
                nav?.disabled === "YES"
            )
                return;

            switch (e.key) {
                case "d":
                    if (nav?.wasd === "NO") break;
                case "ArrowRight":
                    if (nav?.arrowKeys === "NO") break;
                    return pageRelativeNavigate?.(reversed ? -1 : 1);
                case "a":
                    if (nav?.wasd === "NO") break;
                case "ArrowLeft":
                    if (nav?.arrowKeys === "NO") break;
                    return pageRelativeNavigate?.(reversed ? 1 : -1);
                case "n":
                    if (nav?.nextPage === "NO") break;
                    return jumpChapter(1);
                case "p":
                    if (nav?.previousPage === "NO") break;
                    return jumpChapter(-1);
                case " ":
                    if (nav?.spacebar === "DISABLED") break;
                    else if (nav?.spacebar === "NEXT-CHAPTER")
                        return jumpChapter(1);
                    else if (nav?.spacebar === "NEXT-PAGE")
                        return pageRelativeNavigate?.(1);
            }
        };
        window.addEventListener("keydown", event);
        return () => window.removeEventListener("keydown", event);
    }, [pageRelativeNavigate, reversed, nav]);
    const toggleSettingsDrawer = useCallback(
        () =>
            nav?.wasd === "YES" &&
            setSetting?.(
                "readerShowDesktopDrawer",
                settings?.readerShowDesktopDrawer === "NO" ? "YES" : "NO"
            ),
        [settings, nav]
    );
    useKeyboardShortcut(["S"], toggleSettingsDrawer, { overrideSystem: false });

    return <></>;
}
