import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../../appContext";
import Button from "../../../components/button/Button";
import Header from "../../../components/header/Header";
import Icon from "../../../components/icon/Icon";
import MangaLink from "../../../components/MangaLink/MangaLink";
import Settings from "../../../components/settings/Settings";
import { MangaInfo } from "../../../types";
import cm from "../../../utils/classMerger";
import ChapterDropdown from "./chapterDropdown/ChapterDropdown";
import classes from "./desktopSettings.module.scss";

export default function DesktopSettings({
  manga,
  vendor,
}: {
  manga: MangaInfo | null;
  vendor?: string;
}) {
  const [settings, setSetting] = useContext(AppContext).settings ?? [];

  return (
    <>
      <div
        className={cm(
          classes.desktopSettings,
          settings?.readerShowDesktopDrawer === "NO" &&
            classes.desktopSettingsHidden,
        )}>
        <div className={classes.desktopSettingsDrawer}>
          <div className={classes.desktopSettingsInner}>
            <div className={classes.desktopSettingsHeader}>
              <Button
                disabled={!settings}
                onClick={() => setSetting?.("readerShowDesktopDrawer", "NO")}
                fullWidth
                iconLoc="right"
                compact
                transparent
                icon={<Icon icon="arrowWall" />}>{" "}
              </Button>
            </div>
            <div className={classes.desktopSettingsHeader}>
              {manga && vendor && (
                <MangaLink to={`/manga/${vendor}/${manga.slug}`}>
                  <Button
                    fullWidth
                    alignCenter
                    transparent>
                    <Header level={2}>{manga.title}</Header>
                  </Button>
                </MangaLink>
              )}
            </div>
            <ChapterDropdown />
            <div className={classes.desktopSettingsHeader}>
              <Settings />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
