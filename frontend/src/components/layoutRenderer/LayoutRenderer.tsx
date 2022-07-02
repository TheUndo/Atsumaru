import React, { useContext, useEffect } from "react";
import { isError, useQuery } from "react-query";
import { useMatch } from "react-router-dom";
import { AppContext } from "../../appContext";
import useOnline from "../../hooks/useOnline";
import { LayoutItems } from "../../types/layouts";
import Carousel, { GenericItem, ShowcaseItem } from "../carousel/Carousel";
import Header from "../header/Header";
import Loading, { LoadingPage } from "../loading/Loading";
import Showcase from "../showcase/Showcase";
import classes from "./layoutRenderer.module.scss";

type Props = {
  src: string;
};

export default function LayoutRenderer({ src }: Props) {
  const isOnline = useOnline();
  const [loggedIn] = useContext(AppContext).loggedIn ?? [];
  const frontMatch = useMatch("/");
  const { refetch, isLoading, error, data, isError } = useQuery<{
    layout: LayoutItems[];
  }>(
    ["front", src],
    () =>
      fetch(src, {
        credentials: "include",
      }).then(res => res.json()),
    {
      retry: false,
      enabled: !!frontMatch,
    },
  );

  if (isLoading || !data?.layout)
    return (
      <div>
        <LoadingPage>
          <Loading />
        </LoadingPage>
      </div>
    );

  if (isError)
    return (
      <div>
        <Header level={2}>
          Something went wrong while rendering this page
        </Header>
        <p>This error is not your fault. Please contact developers!</p>
        <p>Error:</p>
        <pre>{error + ""}</pre>
      </div>
    );

  const { layout } = data ?? {};

  return (
    <>
      {layout.map(item => {
        const content = (() => {
          switch (item.type) {
            case "CAROUSEL":
              return <Carousel title={item.title} src={item.fetch} />;
            case "SHOWCASE":
              return <Showcase src={item.fetch} />
            default:
              return <></>;
          }
        })();

        return <div key={item.key}>{content}</div>;
      })}
    </>
  );

  return <></>;
}
