import React from "react";
import cm from "../../utils/classMerger";
import classes from "./input.module.scss";

type Props = {
  fullWidth?: boolean;
  label?: React.ReactNode;
  summonLabel?: boolean;
  invalid?: boolean;
  errorMessage?: React.ReactNode;
} & React.ComponentProps<"input">;

export default function Input(props: Props) {
  const {
    className,
    errorMessage,
    invalid,
    summonLabel,
    label,
    fullWidth,
    ...compProps
  } = props;
  return (
    <>
      <div
        style={{
          maxWidth: fullWidth ? "100%" : "300px",
        }}
        className={cm(
          classes.wrapper,
          summonLabel && classes.summonLabel,
          invalid && classes.invalid,
        )}>
        <label>
          <div className={classes.labelContent}>
            {compProps.required && <div className={classes.required}>*</div>}
            {label}
          </div>
          <input
            className={cm(classes.input, className)}
            type="text"
            {...compProps}
          />
          <div className={classes.errorMessage}>{errorMessage}</div>
        </label>
      </div>
    </>
  );
}
