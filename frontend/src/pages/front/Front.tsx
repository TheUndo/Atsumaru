import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import Carousel, { GenericItem } from "../../components/carousel/Carousel";
import Debug from "../../components/debug/Debug";
import Header from "../../components/header/Header";
import Icon from "../../components/icon/Icon";
import Info from "../../components/info/Info";
import Loading from "../../components/loading/Loading";
import useApi from "../../hooks/useApi";
import useOnline from "../../hooks/useOnline";
import cm from "../../utils/classMerger";
import classes from "./front.module.scss";

export default function Front() {
  const online = useOnline();
  const { data, loading, error } = useApi<{
    layout: GenericItem[];
  }>("/layout/s1/front", 1000 * 60 * 60 * 30);
  const { slug } = useParams();
  const layout = useRef<HTMLDivElement>(null);

  return (
    <>
      <div ref={layout} className={cm(classes.front, slug && classes.hidden)}>
        <Debug />
        {online ? (
          loading && !data ? (
            <Loading />
          ) : error ? (
            <>
              <Header level={2}>Oops, apologies</Header>
              <p>
                It appears something went critically wrong, please try again in
                a few minutes.
              </p>
              <p>
                Error: <code>{error}</code> (api probably temporarily down)
              </p>
            </>
          ) : (
            data.layout.map((item) => <Carousel key={item.key} item={item} />)
          )
        ) : (
          <>
            <Header level={1}>
              You are offline <Icon icon="offline" />
            </Header>
            <p>*cricket noises*</p>
          </>
        )}
      </div>
      <Info layout={layout} />
      {/* <div style={{height: "1000px"}}></div> */}
    </>
  );
}
