import { clamp } from "../../utils/utils";

type DragCtx = {
  isDragging: boolean;
  initialRelativeX: number;
  now: number;
  /**  / time */
  velocity: number;
  momentaryX: number;
};

const map = new Map<string, DragCtx>();
const defaultVal: DragCtx = {
  isDragging: false,
  initialRelativeX: 0,
  now: performance.now(),
  velocity: 0,
  momentaryX: 0,
};
export const asDragging = (id: string) => {
  const setter = (cb: (val: DragCtx) => Omit<DragCtx, "now">) => {
    map.set(id, {
      ...cb(map.get(id) ?? defaultVal),
      now: performance.now(),
    });
  };

  return [() => map.get(id) ?? defaultVal, setter] as const;
};
