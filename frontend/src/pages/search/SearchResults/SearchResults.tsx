import React, { useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../../../appContext";
import Button from "../../../components/button/Button";
import Header from "../../../components/header/Header";
import Icon from "../../../components/icon/Icon";
import MangaLink from "../../../components/MangaLink/MangaLink";
import Poster from "../../../components/poster/Poster";
import PosterGrid from "../../../components/posterGrid/PosterGrid";
import Switcher from "../../../components/switcher/Switcher";
import useLocalStorage from "../../../hooks/useLocalStorage";
import { GridDisplayType, MangaInfo } from "../../../types";
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
  const [gridType, setGridType] = useLocalStorage<GridDisplayType>(
    "poster-grid-display-style",
    "GRID",
  );

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
        <div className={classes.closeCont}>
          <Button
            key="close"
            className={classes.close}
            circle
            icon={<Icon icon="close" />}
            onClick={() => setQuery?.("")}
          />
        </div>
        <div className={classes.inner}>
          <div className={classes.content}>
            <div className={classes.top}>
              <Header level={2}>Search results for "{query}"</Header>
            </div>
            <PosterGrid
              gridType={gridType}
              controls={
                <div>
                  <Switcher
                    selected={gridType}
                    onChange={setGridType}
                    items={[
                      {
                        value: "GRID",
                        content: (forwardRef, props) => (
                          <Button
                            noHoverEffect
                            compact
                            icon={<Icon icon="grid2" />}
                            transparent
                            forwardRef={forwardRef}
                            {...props}>
                            Grid
                          </Button>
                        ),
                      },
                      {
                        value: "LIST",
                        content: (forwardRef, props) => (
                          <Button
                            noHoverEffect
                            compact
                            icon={<Icon icon="list" />}
                            transparent
                            forwardRef={forwardRef}
                            {...props}>
                            List
                          </Button>
                        ),
                      },
                      {
                        value: "DETAILS",
                        content: (forwardRef, props) => (
                          <Button
                            noHoverEffect
                            compact
                            icon={<Icon icon="burger" />}
                            transparent
                            forwardRef={forwardRef}
                            {...props}>
                            Details
                          </Button>
                        ),
                      },
                    ]}
                  />
                </div>
              }>
              {data.map(result => (
                <Item
                  gridType={gridType}
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

function Item({
  manga,
  gridType,
}: {
  manga: MangaInfo;
  gridType: GridDisplayType;
}) {
  const url = `/manga/${resolveVendorSlug(manga.vendor)}/${manga.slug}`;

  return (
    <>
      <div className={classes.item}>
        {gridType === "GRID" ? (
          <MangaLink to={url}>
            <Poster displayType={gridType} manga={manga} label={manga.title} />
          </MangaLink>
        ) : (
          <MangaLink to={url}>
            <Poster displayType={gridType} manga={manga} label={manga.title} />
          </MangaLink>
        )}
      </div>
    </>
  );
}
