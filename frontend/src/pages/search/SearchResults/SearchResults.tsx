import React, { useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../../../App";
import Button from "../../../components/button/Button";
import Header from "../../../components/header/Header";
import Icon from "../../../components/icon/Icon";
import Poster from "../../../components/poster/Poster";
import PosterGrid from "../../../components/posterGrid/PosterGrid";
import { MangaInfo } from "../../../types";
import resolveVendorSlug from "../../../utils/resolveVendorSlug";
import classes from "./searchResults.module.scss";

type Props = {
  query: string;
  data: {
    vendor: MangaInfo["vendor"];
    info: MangaInfo;
  }[];
};

export default function SearchResults({ query, data }: Props) {
  const ctx = useContext(AppContext);

  const [, setQuery] = ctx.searchQuery ?? [];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && document.activeElement === document.body)
        setQuery?.("");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setQuery]);

  return (
    <>
      <div className={classes.results}>
        <div className={classes.inner}>
          <div className={classes.content}>
            <div className={classes.top}>
              <Header level={2}>Search results for "{query}"</Header>
            </div>
            <PosterGrid>
              <Button
                key="close"
                className={classes.close}
                circle
                icon={<Icon icon="close" />}
                onClick={() => setQuery?.("")}
              />
              {data.map(result => (
                <Item
                  manga={{
                    ...result.info,
                    vendor: result.vendor,
                  }}
                  key={result.info._id}
                />
              ))}
            </PosterGrid>
          </div>
        </div>
      </div>
    </>
  );
}

function Item({ manga }: { manga: MangaInfo }) {
  const url = `/manga/${resolveVendorSlug(manga.vendor)}/${manga.slug}`;
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <div className={classes.item}>
        <Link
          onClick={e => {
            e.preventDefault();
            navigate(location);
            navigate(url);
          }}
          to={url}>
          <Poster manga={manga} label={manga.title} />
        </Link>
      </div>
    </>
  );
}
