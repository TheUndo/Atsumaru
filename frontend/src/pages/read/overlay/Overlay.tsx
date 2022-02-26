import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../App";
import Header from "../../../components/header/Header";
import Icon from "../../../components/icon/Icon";
import cm from "../../../utils/classMerger";
import { ReaderContext } from "../Reader";
import classes from "../renderPages/renderPages.module.scss";

export default function Overlay() {
    const [settings, setSetting] = useContext(AppContext)?.settings ?? [];
    const reversed = settings?.readingDirection === "RIGHT-TO-LEFT";
    const { readerClickNavigation } = settings ?? {};
    const [animate, setAnimate] = useState(false);
    const [mounted, setMounted] = useState(false);
    const readerCtx = useContext(ReaderContext);

    useEffect(() => {
        if (mounted) {
            setAnimate(true);
            clearTimeout((window as any).__readerOverlayShown);
            (window as any).__readerOverlayShown = setTimeout(() => {
                setAnimate(false);
            }, 1400);
        }
    }, [reversed, readerClickNavigation]);
    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <>
            <div
                onScroll={console.log}
                className={cm(
                    classes.pageContentOverlay,
                    animate && classes.overlayAnimate
                )}
                style={{
                    /* pointerEvents:
                        settings?.readerClickNavigationDisabled === "YES" ||
                        settings?.readingDirection === "TOP-TO-BOTTOM"
                            ? "none"
                            : "all", */
                }}
            >
                {readerClickNavigation !== "ONLY-NEXT" && (
                    <div
                        className={cm(classes.overlayItem, classes.overlayLeft)}
                        onClick={() => {
                            const next = reversed;

                            readerCtx.pageRelativeNavigate?.(next ? 1 : -1);
                        }}
                    >
                        <Header level={1}>
                            {reversed ? (
                                <>
                                    <Icon icon="arrow" orientation="-.25turn" />
                                    <div>Next</div>
                                </>
                            ) : (
                                <>
                                    <Icon icon="arrow" orientation="-.25turn" />
                                    <div>Prev</div>
                                </>
                            )}
                        </Header>
                    </div>
                )}
                {readerClickNavigation === "PREV-MENU-NEXT" && (
                    <div
                        className={cm(
                            classes.overlayItem,
                            classes.overlayMiddle
                        )}
                        onClick={() => {
                            setSetting?.(
                                "readerShowDesktopDrawer",
                                settings?.readerShowDesktopDrawer === "NO"
                                    ? "YES"
                                    : "NO"
                            );
                        }}
                    >
                        <Header level={1}>
                            <div>Settings</div> <Icon icon="settings" />
                        </Header>
                    </div>
                )}
                {
                    <div
                        className={cm(
                            classes.overlayItem,
                            classes.overlayRight
                        )}
                        onClick={() => {
                            const next =
                                readerClickNavigation === "ONLY-NEXT" ||
                                !reversed;

                            readerCtx.pageRelativeNavigate?.(next ? 1 : -1);
                        }}
                    >
                        <Header level={1}>
                            {reversed &&
                            readerClickNavigation !== "ONLY-NEXT" ? (
                                <>
                                    <div>Prev</div>
                                    <Icon icon="arrow" orientation=".25turn" />
                                </>
                            ) : readerClickNavigation === "ONLY-NEXT" &&
                              reversed ? (
                                <>
                                    <Icon icon="arrow" orientation="-.25turn" />
                                    <div>Next</div>
                                </>
                            ) : (
                                <>
                                    <div>Next</div>
                                    <Icon icon="arrow" orientation=".25turn" />
                                </>
                            )}
                        </Header>
                    </div>
                }
            </div>
        </>
    );
}
