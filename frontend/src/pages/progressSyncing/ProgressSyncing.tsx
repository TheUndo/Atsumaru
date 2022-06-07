import React, { useContext, useEffect, useLayoutEffect } from "react";
import { AppContext } from "../../appContext";
import { apiBase } from "../../hooks/useApi";
import useInterval from "../../hooks/useInterval";
import { SettingsType } from "../../hooks/useSettings";
import { tryJSONParse } from "../../utils/utils";
import { parsePageUrlParameter } from "../read/helpers";
import { ReaderContext } from "../read/Reader";

export default function ProgressSyncing() {
  const reader = useContext(ReaderContext);
  const app = useContext(AppContext);
  const [{ readingDirection }] = app.settings ?? [{}];
  const { currentChapter, currentPage, manga } = reader;
  const [user] = app.loggedIn ?? [];

  useEffect(() => {
    sync();
    return () => void sync();
  }, []);

  useInterval(() => {
    sync();
  }, 1000 * 20);

  useEffect(() => {
    if (!user || !manga || !currentChapter) return;
    const [page, progress] = parsePageUrlParameter(currentPage ?? "1");
    void primeProgress(
      readingDirection ?? null,
      manga.vendor,
      manga.slug,
      currentChapter?.name,
      page,
      progress,
    );
  }, [currentChapter, readingDirection, currentChapter, currentPage, user]);

  return <></>;
}

export type MangaSyncPrime = {
  vendor: string;
  mangaSlug: string;
  preferredDirection: string | null;
  chapterProgress: {
    [key: string]: {
      page: string;
      progress?: number;
      date: number;
    };
  };
};

async function sync() {
  const currentPrimed =
    tryJSONParse<MangaSyncPrime[]>(localStorage.getItem(localStorageKey())) ??
    [];

  if (!currentPrimed.length) return;

  localStorage.removeItem(localStorageKey());

  try {
    const req = await fetch(`${apiBase}/user/sync-progress`, {
      method: "POST",
      credentials: "include",
      mode: "cors",
      redirect: "follow",
      body: JSON.stringify({
        currentPrimed,
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    await req.json();
    const event = new Event("progressSync");

    window.dispatchEvent(event);
  } catch (e) {
    console.error(e);
    return false;
  }
}

function primeProgress(
  preferredDirection: SettingsType["readingDirection"] | null,
  vendor: string,
  mangaSlug: string,
  chapterName: string,
  page: string,
  progress?: string,
) {
  const currentPrimed =
    tryJSONParse<MangaSyncPrime[]>(localStorage.getItem(localStorageKey())) ??
    [];

  const parsedProgress = parseFloat(progress ?? "") ?? undefined;
  const resolvedProgress =
    typeof parsedProgress === "number"
      ? parsedProgress > 0 && parsedProgress <= 1
        ? parsedProgress
        : undefined
      : undefined;

  const newPrime = currentPrimed.map(primed => {
    if (primed.mangaSlug === mangaSlug && primed.vendor === vendor) {
      return {
        ...primed,
        preferredDirection,
        chapterProgress: {
          ...primed.chapterProgress,
          [serializeChapterName(chapterName)]: {
            page,
            progress: resolvedProgress,
            date: Date.now(),
          },
        },
      };
    }
    return primed;
  });

  if (
    !newPrime.some(
      prime => prime?.mangaSlug === mangaSlug && prime.vendor === vendor,
    )
  ) {
    newPrime.push({
      vendor,
      preferredDirection,
      mangaSlug,
      chapterProgress: {
        [serializeChapterName(chapterName)]: {
          page,
          progress: resolvedProgress,
          date: Date.now(),
        },
      },
    });
  }

  localStorage.setItem(localStorageKey(), JSON.stringify(newPrime));
}

export function serializeChapterName(chapterName: string) {
  return chapterName.replace(".", "_");
}
export function parseChapterName(chapterName: string) {
  return chapterName.replace("_", ".");
}

function localStorageKey() {
  return `__mangaPrimedForSync`;
}
