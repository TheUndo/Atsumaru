import React from "react";
import cm from "../../../utils/classMerger";
import Icon from "../../icon/Icon";
import classes from "./radioCircle.module.scss";

type Props = { active: boolean; checkbox?: boolean };

export default function RadioCircle(props: Props) {
  return (
    <>
      <div
        className={cm(
          classes.radioCircle,
          props.active && classes.active,
          props.checkbox && classes.checkbox
        )}
      >
        {props.checkbox && <Icon icon="check" />}
      </div>
    </>
  );
}
