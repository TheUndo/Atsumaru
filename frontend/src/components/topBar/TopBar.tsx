import React, { useContext, useEffect, useRef, useState } from "react";
import { useMatch, useParams } from "react-router-dom";
import { AppContext } from "../../App";
import useMedia from "../../hooks/useMedia";
import cm from "../../utils/classMerger";
import Button from "../button/Button";
import Icon from "../icon/Icon";
import Logo from "./logo/Logo";
import Search from "./search/Search";
import classes from "./topBar.module.scss";

type Props = {};

export default function TopBar(props: Props) {
  const readMatch = useMatch("/read/:source/:slug/:chapter/:page");
  const ctx = useContext(AppContext);
  const [query, setQuery] = ctx.searchQuery ?? [];
  const [sideBar] = ctx.desktopNavbar ?? [];
  const [searchShown, setSearchShown] = useState(false);
  const shown = !readMatch || sideBar;
  const mobile = useMedia(["(max-width: 1000px)"], [true], false);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setSearchShown(!!query);
  }, [query]);

  useEffect(
    () =>
      void document.body.style.setProperty(
        "--topBarResolvedHeight",
        shown ? "var(--topBarHeight)" : ".00001px",
      ),
    [shown],
  );

  return (
    <>
      <div
        className={cm(classes.topBarFake, !shown && classes.fakeHidden)}></div>
      <div
        className={cm(
          classes.topBar,
          !shown && !query && classes.topHidden,
          !!query && classes.coverShown,
        )}>
        <div className={classes.cover}></div>
        <Search forwardRef={inputRef} shown={mobile ? searchShown : true} />
        <Logo />
        {mobile && (
          <Button
            onClick={() => {
              setSearchShown(!searchShown);
              if (!searchShown) {
                inputRef.current?.focus();
              } else {
                setQuery?.("");
              }
            }}
            className={classes.exitButton}
            transparent
            icon={<Icon icon={searchShown ? "close" : "search"} />}
          />
        )}
      </div>
    </>
  );
}
