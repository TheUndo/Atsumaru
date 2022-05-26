import React, { useRef } from "react";
import { Link } from "react-router-dom";
import cm from "../../utils/classMerger";
import classes from "./button.module.scss";
import useRipple from "use-ripple-hook";
import useMedia from "../../hooks/useMedia";

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
  forwardRef?: React.RefObject<HTMLElement>;
} & Omit<Partial<React.ComponentProps<"button">>, "ref"> &
  Omit<Partial<React.ComponentProps<typeof Link>>, "ref">;

const Button = (masterProps: Props) => {
  const mobile = useMedia(
    ["(pointer: coarse)", "(pointer: fine)"],
    [true, false],
    false,
  );

  const selfRef = useRef<HTMLElement>(null);

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
    forwardRef,
    ...props
  } = masterProps;

  const resolvedRef = forwardRef ?? selfRef;

  const [ripple, event] = useRipple({
    disabled: mobile,
    ref: resolvedRef,
  });
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
