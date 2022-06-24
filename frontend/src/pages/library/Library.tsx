import React from "react";
import Carousel, { GenericItem } from "../../components/carousel/Carousel";
import Header from "../../components/header/Header";
import Loading, { LoadingPage } from "../../components/loading/Loading";
import { useUserLibrary } from "../../state/user";
import classes from "./library.module.scss";

type Props = {};

export default function Library(props: Props) {
  const { data, isLoading } = useUserLibrary<{
    layout: GenericItem[];
  }>({});

  return (
    <div className={classes.library}>
      {isLoading && (
        <LoadingPage>
          <Loading />
        </LoadingPage>
      )}
      {data && data.layout.length ? (
        data.layout.map(item => <Carousel key={item.key} item={item} />)
      ) : (
        <>
          <Header level={2}>Unable to fetch library</Header>
        </>
      )}
    </div>
  );
}
