import React, { useRef } from "react";
import { useMatch, useParams } from "react-router-dom";
import Debug from "../../components/debug/Debug";
import Disclaimer from "../../components/disclaimer/Disclaimer";
import LayoutRenderer from "../../components/layoutRenderer/LayoutRenderer";
import { apiBase } from "../../hooks/useApi";
import cm from "../../utils/classMerger";
import classes from "./front.module.scss";

export default function Front() {
  const { slug } = useParams();
  const layout = useRef<HTMLDivElement>(null);
  const frontMatch = useMatch("/");

  return (
    <>
      <div ref={layout} className={cm(classes.front, slug && classes.hidden)}>
        <Debug />
        <Disclaimer />

        <LayoutRenderer
          enabled={!!frontMatch}
          src={`${apiBase}/layout/s1/front`}
        />
      </div>
      {/* <div style={{height: "1000px"}}></div> */}
    </>
  );
}
