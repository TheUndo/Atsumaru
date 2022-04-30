import React from "react";
import { Link } from "react-router-dom";
import classes from "./logo.module.scss";

type Props = {};

export default function Logo(props: Props) {
  return (
    <>
      <div className={classes.logo}>
        <Link to="/">
          <h1>
            <span>atsu</span>maru
          </h1>
        </Link>
      </div>
    </>
  );
}
