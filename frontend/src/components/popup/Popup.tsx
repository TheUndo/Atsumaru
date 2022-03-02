import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";
import cm from "../../utils/classMerger";
import Button from "../button/Button";
import Header from "../header/Header";
import Icon from "../icon/Icon";
import classes from "./popup.module.scss";

type Props = {
  shown: boolean;
  title?: React.ReactNode;
  children?: React.ReactNode;
  onClose?: () => void;
};

export default function Popup({ shown, title, children, onClose }: Props) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    if (!ref.current) return;

    // used to allow render cycle before scroll locks
    setTimeout(() => {
      if (!ref.current) return;
      if (shown) disableBodyScroll(ref.current);
      else enableBodyScroll(ref.current);
    }, 0);
  }, [shown]);
  useEffect(() => {
    const event = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", event);
    return () => window.removeEventListener("keydown", event);
  }, [onClose]);
  return createPortal(
    <>
      <div
        className={cm(classes.cover, !shown && classes.coverHidden)}
        onClick={onClose}></div>
      <div className={cm(classes.popupCont, !shown && classes.popupHidden)}>
        <div ref={ref} className={cm(classes.popup)}>
          <div className={cm(classes.inner, !shown && classes.hidden)}>
            <Header className={classes.header} level={1}>
              {title}
            </Header>
            <Button
              onClick={onClose}
              className={classes.exitButton}
              circle
              icon={<Icon icon="close" />}
            />
            <div>{children}</div>
          </div>
        </div>
      </div>
    </>,
    document.getElementById("root")!,
  );
}
