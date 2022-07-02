import React, { useContext, useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { useMatch, useParams } from "react-router-dom";
import { AppContext } from "../../appContext";
import Carousel, { GenericItem } from "../../components/carousel/Carousel";
import Debug from "../../components/debug/Debug";
import Disclaimer from "../../components/disclaimer/Disclaimer";
import Header from "../../components/header/Header";
import Icon from "../../components/icon/Icon";
import LayoutRenderer from "../../components/layoutRenderer/LayoutRenderer";
import Loading from "../../components/loading/Loading";
import { apiBase } from "../../hooks/useApi";
import useOnline from "../../hooks/useOnline";
import cm from "../../utils/classMerger";
import classes from "./front.module.scss";

export default function Front() {
  const { slug } = useParams();
  const layout = useRef<HTMLDivElement>(null);

  return (
    <>
      <div ref={layout} className={cm(classes.front, slug && classes.hidden)}>
        <Debug />
        <Disclaimer />

        <LayoutRenderer src={`${apiBase}/layout/s1/front`} />
      </div>
      {/* <div style={{height: "1000px"}}></div> */}
    </>
  );
}
