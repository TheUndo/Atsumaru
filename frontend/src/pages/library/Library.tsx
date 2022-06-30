import React from "react";
import Carousel, { GenericItem } from "../../components/carousel/Carousel";
import Header from "../../components/header/Header";
import LayoutRenderer from "../../components/layoutRenderer/LayoutRenderer";
import Loading, { LoadingPage } from "../../components/loading/Loading";
import { useUserLibrary } from "../../state/user";
import classes from "./library.module.scss";

type Props = {};

export default function Library(props: Props) {
  const { data, isLoading, refetch, isRefetching } = useUserLibrary<{
    layout: GenericItem[];
  }>({});

  return (
    <div className={classes.library}>
      {isLoading ? (
        <LoadingPage>
          <Loading />
        </LoadingPage>
      ) : data && data.layout.length ? (
        <LayoutRenderer
          layout={data.layout}
          isRefetching={isRefetching || isLoading}
          refetch={refetch}
        />
      ) : (
        <Header level={2}>Unable to fetch library</Header>
      )}
    </div>
  );
}
