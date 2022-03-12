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
