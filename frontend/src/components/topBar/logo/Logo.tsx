import React from "react";
import { Link } from "react-router-dom";
import Button from "../../button/Button";
import classes from "./logo.module.scss";

type Props = {};

export default function Logo(props: Props) {
  return (
    <>
      <div className={classes.logo}>
        <Link to="/">
          <Button noHoverEffect transparent>
            <h1>
              <span>atsu</span>maru
            </h1>
          </Button>
        </Link>
      </div>
    </>
  );
}
