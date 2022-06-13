import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import cm from "../../utils/classMerger";
import { easeInOutQuad, easeOutCubic } from "../../utils/easing";
import { clamp } from "../../utils/utils";
import classes from "./atsuSwipe.module.scss";
import { asDragging } from "./helpers";

const { abs, ceil } = Math;

type Page = {
  key: string;
  content: React.ReactNode;
};

type Props = {
  pages: Page[];
} & React.ComponentProps<"div">;
// window is better since it detects mouseup outside the body!
const dragEvents = [
  [window, "mousemove"],
  [document.body, "touchmove"],
] as const;
const dragStartEvents = ["mousedown", "touchstart"] as const;
const dragEndEvents = [
  [window, "mouseup"],
  [document.body, "touchend"],
] as const;

const fps = 120;
const pageThreshold = .35;

export default function AtsuSwipe(masterProps: Props) {
  const { pages, className, ...compProps } = masterProps;
  const ref = useRef<HTMLDivElement>(null);
  const getBounds = useCallback(
    () => ref.current?.getBoundingClientRect(),
    [ref.current],
  );
  const [bounds, setBounds] = useState(getBounds());
  const id = useMemo(() => Math.random() + "", []);
  const snap = useMemo(
    () =>
      bounds ? [...Array(pages.length)].map((_, i) => bounds.width * i) : null,
    [pages, bounds],
  );

  useEffect(() => {
    const handler = () => setBounds(getBounds());
    window.addEventListener("resize", handler);
    handler();
    return () => window.removeEventListener("resize", handler);
  }, [getBounds]);

  const getRelativeX = useCallback(
    (e: MouseEvent | TouchEvent): number | null => {
      if (!bounds) return null;
      const pointerX: number | null = (() => {
        switch (true) {
          case ["mousemove", "mousedown"].includes(e.type):
            return (e as MouseEvent).clientX;
          case ["touchmove", "touchstart"].includes(e.type):
            return (e as TouchEvent).changedTouches[0].clientX;
          default:
            return null;
        }
      })();
      if (pointerX === null) return null;

      return pointerX - bounds.left;
    },
    [bounds, ref],
  );

  const getCurrentXPos = useCallback((): number | null => {
    const currentX = ref.current?.style.getPropertyValue("--x");
    return currentX ? parseFloat(currentX) : null;
  }, [ref]);

  /*
  NOT a real state for performance reasons!
  Retrieving the value is imperative only and does not
  work inside a hook as a normal state would!
  */
  const [dragCtx, setDragging] = asDragging(id);

  const setCurrentXPos = useCallback(
    (x: number) => {
      if (!bounds) return;
      const shift =
        x >= 0
          ? -x
          : -x >= bounds.width * (pages.length - 1)
          ? -bounds.width * (pages.length - 1) - x
          : 0;
      const eased = shift === 0 ? 0 : shift / 1.1;
      setDragging(prev => ({ ...prev, momentaryX: x }));
      ref.current?.style.setProperty("--x", x + "");
      ref.current?.style.setProperty("--shift", eased + "");
    },
    [ref, bounds, pages],
  );

  const snapToNearest = useCallback(() => {
    if (!snap) return;
    const ctx = dragCtx();
    if (ctx.isDragging) return;
    const curX = getCurrentXPos() ?? 0;

    const nearestSnap = snap.sort((x, y) => {
      const diffX = abs(curX + x);
      const diffY = abs(curX + y);

      return diffX - diffY;
    });
    const width = abs(snap[0] - snap[1]) ?? 0;
    const nearest =
      Math.abs(ctx.velocity) >= pageThreshold * width &&
      curX < 0 &&
      curX > -width * (snap.length - 1)
        ? -nearestSnap[1]
        : -nearestSnap[0];

    const distance = nearest - curX;
    const duration = clamp(
      20,
      ceil((abs(distance) / width) * fps * (fps / 60)),
      40,
    );
    const frames = [...Array(duration)].map((_, i) => {
      const progress = (i + 1) / duration;
      return ctx.velocity > 40
        ? easeOutCubic(progress)
        : easeInOutQuad(progress);
    });

    const animate = (frameIdx: number = 0) => {
      const frame = frames[frameIdx];
      if (!frame) return;
      const ctx = dragCtx();
      if (ctx.isDragging) return;
      setCurrentXPos(curX + distance * frame);
      setTimeout(() => {
        requestAnimationFrame(() => animate(frameIdx + 1));
      }, 1000 / fps);
    };
    animate();
  }, [snap, getCurrentXPos]);

  // drag start
  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      if (!ref.current) return;
      if (ref.current.contains(e.target as Node) || e.target === ref.current) {
        const relX = getRelativeX(e) ?? 0;
        const curX = getCurrentXPos() ?? 0;
        const dx = relX - curX;
        setDragging(prev => ({
          ...prev,
          isDragging: true,
          initialRelativeX: dx,
          momentaryX: dx,
        }));
      }
    };
    dragStartEvents.forEach(event =>
      document.body.addEventListener(event, handler),
    );
    return () =>
      dragStartEvents.forEach(event =>
        document.body.removeEventListener(event, handler),
      );
  }, [getRelativeX, ref, getCurrentXPos]);

  // drag end
  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      if (!bounds) return;
      const relX = getRelativeX(e) ?? 0;
      const curX = getCurrentXPos() ?? 0;
      const dx = relX - curX;
      setDragging(prev => ({
        ...prev,
        isDragging: false,
        initialRelativeX: 0,
        velocity: clamp(
          bounds.width * -pageThreshold,
          (dx - prev.momentaryX) / (performance.now() - prev.now),
          bounds.width * pageThreshold,
        ),
      }));
      snapToNearest();
    };
    dragEndEvents.forEach(([target, event]) =>
      target.addEventListener(event, handler as any),
    );
    return () =>
      dragEndEvents.forEach(([target, event]) =>
        target.removeEventListener(event, handler as any),
      );
  }, [snapToNearest, getRelativeX, getCurrentXPos, bounds]);

  // drag
  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      const ctx = dragCtx();
      if (!ctx.isDragging || !bounds || !ref.current) return;
      const relativeX = getRelativeX(e);
      if (!relativeX) return;
      const resolvedRelativeX = relativeX - ctx.initialRelativeX;
      const easedRelativeX = resolvedRelativeX;

      setCurrentXPos(easedRelativeX);
    };
    dragEvents.forEach(([target, event]) =>
      target.addEventListener(event, handler as any),
    );
    return () =>
      dragEvents.forEach(([target, event]) =>
        target.removeEventListener(event, handler as any),
      );
  }, [getRelativeX, bounds, ref, setCurrentXPos]);

  return (
    <div
      className={cm(classes.as, className)}
      {...compProps}
      style={{ "--pageAmount": pages.length } as any}>
      <div className={classes.inner} ref={ref}>
        <div className={classes.content}>
          {pages.map(page => (
            <ASPage page={page} key={page.key} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ASPage({ page }: { page: Page }) {
  return (
    <div className={classes.page}>
      <div className={classes.pageInner}>{page.content}</div>
    </div>
  );
}
