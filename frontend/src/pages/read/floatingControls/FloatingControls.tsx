import React from "react";
import classes from "./floatingControls.module.scss";

type Props = {};

export default function FloatingControls({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className={classes.floatingControls}>
        <div className={classes.floatingControlsInner}>{children}</div>
      </div>
    </>
  );
}
