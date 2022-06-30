import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { MangaInfo } from "../../../../types";
import cm from "../../../../utils/classMerger";
import Button from "../../../button/Button";
import Icon from "../../../icon/Icon";
import classes from "./nav.module.scss";

export default function Nav({
  forwardRef,
  data,
}: {
  forwardRef: React.RefObject<HTMLDivElement>;
  data?: MangaInfo;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrollPos, setScrollPos] = useState(0);
  const exit = () =>
    navigate((location.state as any)?.backgroundLocation.pathname ?? "/");
  useEffect(() => {
    const handler = () => {
      if (!forwardRef.current) return;
      setScrollPos(forwardRef.current.scrollTop);
    };
    forwardRef.current?.addEventListener("scroll", handler);
    return () => forwardRef.current?.removeEventListener("scroll", handler);
  }, [forwardRef]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && data) exit();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [data]);

  return (
    <div
      onClick={e => void e.stopPropagation()}
      className={cm(classes.nav, scrollPos > 100 && classes.fixed)}>
      <Button
        onClick={exit}
        transparent
        icon={<Icon icon="chevron" orientation=".5turn" />}>
        Back
      </Button>
      <div
        className={cm(classes.navTitle, scrollPos > 230 && classes.showTitle)}>
        {data?.title}
      </div>
    </div>
  );
}
