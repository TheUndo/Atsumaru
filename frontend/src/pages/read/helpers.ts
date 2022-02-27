import { Page } from "../../types";
import chunk from "../../utils/chunk";
import { clamp } from "../../utils/utils";

/** helper */
export async function loadPagesSequentially(
  chunkSize: number,
  pages: Page[],
  onload: (page: Page, src?: string) => void
) {
  for (const c of chunk(pages, chunkSize)) {
    await Promise.all(loadPageChunk(c, onload));
  }
}

/** helper */
export function loadPageChunk(
  chunk: Page[],
  onload: (page: Page, src?: string) => void
) {
  return chunk.map((page) => loadPage(page, onload));
}
/** helper */
export async function loadPage(
  page: Page,
  onload: (page: Page, src?: string) => void
) {
  for (const src of page.pageURLs) {
    const attempt = await new Promise<string | null>((res) => {
      const image = new Image();
      image.addEventListener("load", () => res(src));
      image.addEventListener("error", () => res(null));
      image.src = src;
    });

    if (attempt) return onload(page, src);
  }
  return onload(page);
}

export function parsePageUrlParameter(page: string) {
  const [pageNumber, progress] = ["1", undefined].map(
    (_, i) => page.split("-")[i]
  );
  return [pageNumber, progress?.replace("_", ".") ?? undefined];
}
export function resolvePageUrlParameter(page: number, progress?: number) {
  const resolvedProgress = progress
    ? clamp(0, progress, 1) !== progress
      ? ""
      : `-${progress}`.replace(".", "_")
    : "";
  return `${page}${resolvedProgress}`;
}
