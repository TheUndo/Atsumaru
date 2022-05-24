import React, { useCallback, useContext, useEffect, useState } from "react";
import { useLocation, useMatch, useNavigate } from "react-router-dom";
import { AppContext } from "../../../App";
import cm from "../../../utils/classMerger";
import classes from "./search.module.scss";

type Props = {
  shown: boolean;
  forwardRef: React.RefObject<HTMLInputElement>;
};

export default function Search({ shown, forwardRef }: Props) {
  const ctx = useContext(AppContext);
  const [query, setQuery] = ctx.searchQuery ?? [];

  return (
    <>
      <div className={cm(classes.search, shown && classes.shown)}>
        <input
          ref={forwardRef}
          value={query}
          onKeyDown={e => {
            const key = (e.nativeEvent as any)?.key as string; // dumbass react
            if (!key) return;
            else if (/escape/i.test(key)) setQuery?.("");
            else if (/enter/i.test(key)) (e.target as any)?.blur();
          }}
          onChange={e => setQuery?.(e.target.value)}
          className={classes.input}
          placeholder="Search (ctrl + s)"
        />
      </div>
    </>
  );
}

function genUrl(location: ReturnType<typeof useLocation>) {
  if (location.search) return `${location.pathname}?${location.search}`;
  return location.pathname;
}
