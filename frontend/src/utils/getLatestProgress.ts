import { ProgressInfo } from "../types";

export default function getLatestProgress(progress: ProgressInfo) {
  const [chapter, meta] =
    Object.entries(progress.chapterProgress).sort(([, x], [, y]) => {
      return new Date(y.date).getTime() - new Date(x.date).getTime();
    })?.[0] ?? [];

  return {
    chapter,
    meta,
  };
}
export function getSpecificProgress(progress: ProgressInfo, idx: number) {
  const [chapter, meta] = Object.entries(progress.chapterProgress)?.[idx] ?? [];

  return {
    chapter,
    meta,
  };
}
