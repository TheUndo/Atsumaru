import React from "react";
import { Link } from "react-router-dom";
import cm from "../../utils/classMerger";
import classes from "./button.module.scss";
import useRipple from "use-ripple-hook";

type Props = {
  children?: React.ReactNode | React.ReactNode[];
  to?: string;
  icon?: React.ReactNode;
  iconLoc?: "left" | "right";
  legend?: React.ReactNode;
  fullWidth?: boolean;
  label?: string;
  css?: any;
  alignCenter?: boolean;
  circle?: boolean;
  transparent?: boolean;
  hoverReveal?: boolean;
  noHoverEffect?: boolean;
} & Partial<React.ComponentProps<"button">> &
  Partial<React.ComponentProps<typeof Link>>;

const Button = (masterProps: Props) => {
  const [ripple, event] = useRipple();
  const {
    css,
    children,
    to,
    icon,
    legend,
    iconLoc,
    label,
    className,
    alignCenter,
    fullWidth,
    circle,
    transparent,
    hoverReveal,
    noHoverEffect,
    ...props
  } = masterProps;
  const loc = iconLoc || "left";
  const iconContent = (
    <div className={cm(classes.iconCont, "iconCont")}>{icon}</div>
  );
  const child = (
    <>
      <div
        className={cm(
          classes.inner,
          legend && classes.hasLegend,
          alignCenter && classes.alignCenter,
        )}
        ref={ripple}>
        {icon && loc === "left" && iconContent}
        {children && <div className={classes.text}>{children}</div>}
        {icon && loc === "right" && iconContent}
        <legend className={classes.legend}>{legend}</legend>
      </div>
    </>
  );

  const classNames = cm(
    "button",
    classes.button,
    fullWidth && classes.fullWidth,
    circle && classes.circle,
    !!legend && classes.hasLegend,
    className,
    transparent && classes.transparent,
    hoverReveal && classes.hoverReveal,
    noHoverEffect && classes.noHoverEffect,
  );

  const button = (() => {
    if (to) {
      return (
        <>
          <Link
            ref={ripple}
            onMouseDown={event}
            style={css ?? {}}
            className={classNames}
            to={to}
            {...(props as Omit<React.ComponentProps<typeof Link>, "to">)}>
            {child}
          </Link>
        </>
      );
    } else {
      return (
        <>
          <button
            ref={ripple}
            onMouseDown={event}
            style={css ?? {}}
            className={classNames}
            {...(props as React.ComponentProps<"button">)}>
            {child}
          </button>
        </>
      );
    }
  })();

  if (label) {
    return (
      <>
        <label className={classes.label}>
          <div className={classes.tag}>{label}</div>
          <div className={classes.labeled}>{button}</div>
        </label>
      </>
    );
  } else {
    return button;
  }
};

export default React.memo(Button);
