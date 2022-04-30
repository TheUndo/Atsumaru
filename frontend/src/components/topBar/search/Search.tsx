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
  const location = useLocation();
  const [initialPath, setInitialPath] = useState(
    /* /^\/search/.test(location.pathname) ? "/" : */ genUrl(location),
  );
  const match = useMatch("/search/:query");
  const { query: queryParam } = match?.params ?? {};

  const navigate = useNavigate();

  useEffect(() => {
    if (!/^\/search/.test(location.pathname)) {
      setQuery?.("");
      setInitialPath(genUrl(location));
    }
  }, [location]);

  /* useEffect(() => {
    const currentQuery = encodeURIComponent(query ?? "");

    if (query && currentQuery !== queryParam) {
      console.log("YUP", query, currentQuery, currentQuery !== queryParam);
      console.log("yup");
      navigate(`/search/${currentQuery}`, { replace: true });
    }
  }, [query, queryParam, location]); */

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
