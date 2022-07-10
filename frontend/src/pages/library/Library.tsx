import React from "react";
import { useMatch } from "react-router-dom";
import LayoutRenderer from "../../components/layoutRenderer/LayoutRenderer";
import { apiBase } from "../../hooks/useApi";
import classes from "./library.module.scss";

type Props = {};

export default function Library(props: Props) {
  const match = useMatch("/me");

  return (
    <div className={classes.library}>
      <LayoutRenderer enabled={!!match} src={`${apiBase}/layout/library`} />
    </div>
  );
}
