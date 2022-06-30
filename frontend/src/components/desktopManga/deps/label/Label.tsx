import React from "react";
import classes from "./label.module.scss";

export default function Label({ children }: { children: React.ReactNode }) {
  return <div className={classes.switcherLabel}>{children}</div>;
}
