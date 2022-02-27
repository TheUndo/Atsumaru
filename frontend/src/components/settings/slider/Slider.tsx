import React from "react";
import cm from "../../../utils/classMerger";
import classes from "./slider.module.scss";

type Props = {
  labelMin: string;
  labelMax: string;
  inactive?: boolean;
} & React.ComponentProps<"input">;

const Slider = React.forwardRef(
  (props: Props, ref: React.ForwardedRef<HTMLInputElement>) => {
    const { labelMin, inactive, labelMax, className, ...compProps } = props;
    return (
      <>
        <div className={cm(classes.sliderCont, inactive && classes.inactive)}>
          <div className={classes.label}>{labelMin}</div>
          <div className={cm(classes.label, classes.inputCont)}>
            <input
              ref={ref}
              type="range"
              {...compProps}
              className={cm(classes.slider, className)}
            />
          </div>
          <div className={classes.label}>{labelMax}</div>
        </div>
      </>
    );
  }
);

export default Slider;
