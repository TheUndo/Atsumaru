import React from "react";
import cm from "../../utils/classMerger";
import classes from "./linkButton.module.scss";

type Props = {
  variant?: "default" | "white";
} & React.ComponentProps<"a">;

export default function LinkButton(props: Props) {
  const { variant, className, ...compProps } = props;
  return (
    <>
      <a
        className={cm(className, classes.link, classes[variant ?? "default"])}
        {...compProps}></a>
    </>
  );
}
