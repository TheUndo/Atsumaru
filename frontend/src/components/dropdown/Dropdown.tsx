import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import cm from "../../utils/classMerger";
import classes from "./dropdown.module.scss";

type Props<T> = {
  button: JSX.Element | HTMLElement;
  items: {
    value: T;
    content: JSX.Element | HTMLElement;
  }[];
};

export default memo(function Dropdown<T>(masterProps: Props<T>) {
  const [open, setOpen] = useState(false);
  const { button, items } = masterProps;
  const id = useMemo(() => "d-" + (Math.random() + "").replace(".", ""), []);
  const idBtn = useMemo(
    () => "dBtn-" + (Math.random() + "").replace(".", ""),
    [],
  );
  const ref = useRef<HTMLDivElement>(null);
  const getStyles = useCallback(() => {
    if (!ref.current) return { display: "none" };
    const bounds = ref.current.getBoundingClientRect();
    const padding = ".5rem";
    const inverted = window.innerHeight / 2 < bounds.top;
    return {
      minWidth: `calc(${bounds.width}px + ${padding})`,
      top: inverted
        ? padding
        : `calc(${bounds.top}px + ${bounds.height}px + ${padding})`,
      left: `calc(${bounds.left}px - ${padding} / 2)`,
      maxHeight: inverted
        ? `calc(${bounds.top}px - ${padding} * 2)`
        : `calc(${window.innerHeight}px - ${bounds.top}px - ${bounds.height}px - 15px)`,
    };
  }, []);
  const [style, setStyle] = useState(getStyles());
  useEffect(() => {
    const handler = () => {
      if (open) setStyle(getStyles());
    };
    handler();
    window.addEventListener("resize", handler);
    window.addEventListener("scroll", handler);
    return () => {
      window.removeEventListener("resize", handler);
      window.removeEventListener("scroll", handler);
    };
  }, [getStyles, button, open]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!open) return;
      const target = e.target as HTMLElement;
      if (
        target &&
        !target.closest(`#${id}`) &&
        !target.closest(`#${idBtn}`) &&
        target.id !== id &&
        target.id !== idBtn
      ) {
        setOpen(false);
      }
    };
    const closeHandler = () => void setOpen(false);
    document.body.addEventListener("click", handler);
    // @ts-ignore custom event
    window.addEventListener("closeDropdown", closeHandler);
    return () => {
      document.body.removeEventListener("click", handler);
      // @ts-ignore custom event
      window.removeEventListener("closeDropdown", closeHandler);
    };
  }, [id, idBtn, open]);
  
  return (
    <>
      <div
        id={idBtn}
        ref={ref}
        className={classes.cont}
        onClick={() => {
          setOpen(!open);
          setStyle(getStyles());
        }}>
        <div className={classes.button}>{button}</div>
      </div>
      {createPortal(
        <div
          id={id}
          style={style}
          className={cm(classes.itemsList, open && classes.open)}>
          <div className={classes.inner}>
            {items.map(item => (
              <div key={JSON.stringify(item.value) + ""}>{item.content}</div>
            ))}
          </div>
        </div>,
        document.getElementById("root")!,
      )}
    </>
  );
});
