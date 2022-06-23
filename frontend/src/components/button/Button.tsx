import React, { useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import cm from "../../utils/classMerger";
import classes from "./button.module.scss";
import useRipple from "use-ripple-hook";
import useMedia from "../../hooks/useMedia";
import Icon from "../icon/Icon";

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
  compact?: boolean;
  slim?: boolean;
  accent?: boolean;
  beefy?: boolean;
  loading?: boolean;
  fadedAccent?: boolean;
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
    compact,
    slim,
    accent,
    beefy,
    loading,
    fadedAccent,
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
  const fakeBackground = useMemo(() => {
    if (fadedAccent)
      return (
        <div
          className={cm(classes.fakeBackground, classes.fadedAccentBg)}></div>
      );
  }, [fadedAccent]);
  const child = (
    <>
      {fakeBackground}
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
      <div className={classes.loading}>{<Icon icon="spinner" />}</div>
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
    slim && classes.slim,
    compact && classes.compact,
    accent && classes.accent,
    beefy && classes.beefy,
    loading && classes.isLoading,
    fadedAccent && classes.fadedAccent,
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
