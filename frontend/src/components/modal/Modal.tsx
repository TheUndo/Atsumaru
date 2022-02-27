import React, { useCallback, useEffect, useRef, useState } from "react";
import classes from "./modal.module.scss";
import * as bodyScrollLock from "body-scroll-lock";
import cm from "../../utils/classMerger";
import Icon from "../icon/Icon";
import { clamp } from "../../utils/utils";
import { createPortal } from "react-dom";

type Props = {
  shown: boolean;
  children: React.ReactNode;
  scaleElements?: (HTMLElement | null)[];
  onClose: () => void;
  id?: string;
};

export default function Modal({
  shown,
  children,
  onClose,
  scaleElements,
  id,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const [previousClientY, setPreviousClientY] = useState(0);
  const [dragging, setDragging] = useState(false);
  // used to prevent jerky animations when entering
  const [enterAnimationComplete, setEnterAnimationComplete] = useState(false);

  useEffect(() => {
    if (shown) {
      setTimeout(() => {
        setEnterAnimationComplete(true);
      }, 400);
    }
  }, [shown]);

  useEffect(() => {
    if (ref.current) {
      if (shown) {
        bodyScrollLock.disableBodyScroll(ref.current);
        if (scaleElements) setScaler(scaleElements, 0.8);
      } else {
        bodyScrollLock.enableBodyScroll(ref.current);
      }
      if (shown && scaleElements) setScaler(scaleElements, 0.8);
      ref.current.style.setProperty("--offset", "60px");
    }
    return () => {
      if (!shown && enterAnimationComplete) {
        exitModal(true);
        if (ref.current) bodyScrollLock.enableBodyScroll(ref.current);
        else bodyScrollLock.enableBodyScroll(document.body);
      }
    };
  }, [shown, ref, scaleElements, enterAnimationComplete]);

  useEffect(() => {
    document.body.classList[dragging ? "add" : "remove"]("dragging");
  }, [dragging]);

  const exitModal = useCallback(
    (preventClose?: boolean) => {
      if (!preventClose) onClose();
      if (scaleElements) setScaler(scaleElements, 1);
      if (!ref.current) return;
      ref.current.style.setProperty("--offset", 0 + "px");
    },
    [ref.current, scaleElements]
  );

  const dragStart = useCallback(
    (
      event:
        | React.DragEvent<HTMLDivElement>
        | React.TouchEvent<HTMLDivElement>
        | React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
      if (!ref.current) return;
      if ((event.target as any)?.closest(`.info-page-control`)) return;

      const clientY =
        "clientY" in event ? event.clientY : event.touches[0].clientY;
      setPreviousClientY(
        clientY - event.currentTarget.getBoundingClientRect().top
      );

      setDragging(true);
    },
    [ref.current, setPreviousClientY]
  );

  const drag = useCallback(
    (
      event: React.DragEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
    ) => {
      if (!ref.current) return;
      if ((event.target as any)?.closest(`.info-page-control`)) return;

      const clientY =
        (-previousClientY +
          ("clientY" in event ? event.clientY : event.touches[0].clientY)) *
        0.5;
      if (clientY < 60) return;

      if (scaleElements)
        setScaler(
          scaleElements,
          clamp(0.8, (clientY * 0.3) / (window.innerHeight * 0.2) + 0.7, 1)
        );

      ref.current.style.setProperty("--offset", clientY + "px");
      setDragging(true);
    },
    [ref.current, previousClientY, scaleElements]
  );

  const dragEnd = useCallback(
    (
      event:
        | React.DragEvent<HTMLDivElement>
        | React.TouchEvent<HTMLDivElement>
        | React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
      if (!ref.current) return;
      const clientY =
        parseInt(
          ref.current.style.getPropertyValue("--offset").replace("px", "")
        ) / 0.5 ?? 0;
      setDragging(false);

      if (clientY > window.innerHeight * 0.4) {
        exitModal();
      } else {
        setPreviousClientY(0);
        ref.current.style.setProperty("--offset", "60px");
        if (scaleElements) setScaler(scaleElements, 0.8);
      }
    },
    [ref.current, onClose, setPreviousClientY, scaleElements]
  );

  useEffect(() => {
    if (shown && ref.current) {
      ref.current.scrollTop = 0;
    }
  }, [shown, ref]);

  useEffect(() => {
    const event = (e: KeyboardEvent) => {
      if (e.key === "Escape" && shown) exitModal();
    };
    window.addEventListener("keydown", event);
    return () => window.removeEventListener("keydown", event);
  }, [shown, exitModal]);

  return createPortal(
    <>
      <div
        id={id}
        ref={ref}
        className={cm(
          classes.info,
          dragging && classes.dragging,
          shown && classes.shown
        )}
      >
        {shown && (
          <div className={classes.overlay} onClick={() => exitModal()}></div>
        )}
        <div
          className={classes.content}
          onMouseDown={dragStart}
          onTouchStart={dragStart}
          onDragStart={dragStart}
          onTouchMove={drag}
          onDragEnd={dragEnd}
          onMouseUp={dragEnd}
          onTouchEnd={dragEnd}
        >
          <div className={classes.handle} ref={handleRef}>
            <div className={classes.handleInner}>
              <div className={classes.handleBar}></div>
              <div className={classes.handleControls}>
                <div style={{ flex: 1 }}></div>
                <button
                  className={classes.closeButton}
                  onClick={() => exitModal()}
                >
                  <Icon icon="close" />
                </button>
              </div>
            </div>
          </div>
          <div className={classes.inner}>{children}</div>
        </div>
      </div>
    </>,
    document.getElementById("root")!
  );
}

function setScaler(elements: (HTMLElement | null)[], value: number) {
  for (const el of elements) {
    el?.style.setProperty("--modal-scaler", value + "");
  }
}
