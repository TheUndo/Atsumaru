import React from "react";
import { useQuery } from "react-query";
import { LayoutItems } from "../../types/layouts";
import Carousel from "../carousel/Carousel";
import Header from "../header/Header";
import Loading, { LoadingPage } from "../loading/Loading";
import Showcase from "../showcase/Showcase";

type Props = {
  src: string;
  enabled: boolean;
};

export default function LayoutRenderer({ src, enabled }: Props) {
  const { isLoading, error, data, isError } = useQuery<{
    layout: LayoutItems[];
  }>(
    ["front", src],
    () =>
      fetch(src, {
        credentials: "include",
      }).then(res => res.json()),
    {
      retry: false,
      enabled,
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
              return <Showcase src={item.fetch} />;
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
