import { QueryKey, useQuery, UseQueryOptions } from "react-query";
import { apiBase } from "../hooks/useApi";
import { MangaInfo } from "../types";

const defaultFetchOptions = {
  credentials: "include",
  mode: "cors",
  redirect: "follow",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
} as const;

export const useSetBookmark = <T>(
  options:
    | Omit<UseQueryOptions<T, unknown, T, QueryKey>, "queryKey" | "queryFn">
    | undefined,
  onSuccess: () => void,
  manga?: MangaInfo,
) =>
  useQuery<T>(
    "addBookmark",
    () =>
      fetch(apiBase + "/manga/bookmark", {
        ...defaultFetchOptions,
        method: "PUT",
        body: JSON.stringify({
          bookmark: {
            mangaID: manga?._id,
            vendor: manga?.vendor,
          },
        }),
      })
        .then(d => d.json())
        .then(d => {
          onSuccess();
          return d;
        }),
    options,
  );
export const useRemoveBookmark = <T>(
  options:
    | Omit<UseQueryOptions<T, unknown, T, QueryKey>, "queryKey" | "queryFn">
    | undefined,
  onSuccess: () => void,
  manga?: MangaInfo,
) =>
  useQuery<T>(
    "removeBookmark",
    () =>
      fetch(apiBase + "/manga/bookmark", {
        ...defaultFetchOptions,
        method: "DELETE",
        body: JSON.stringify({
          bookmark: {
            mangaID: manga?._id,
            vendor: manga?.vendor,
          },
        }),
      })
        .then(d => d.json())
        .then(d => {
          onSuccess();
          return d;
        }),
    options,
  );
export const useIsBookmarked = <T>(
  options:
    | Omit<UseQueryOptions<T, unknown, T, QueryKey>, "queryKey" | "queryFn">
    | undefined,
  onSuccess: (data: T) => void,
  manga?: MangaInfo,
) =>
  useQuery<T>(
    "isBookmarked",
    () =>
      fetch(apiBase + "/manga/bookmark", {
        ...defaultFetchOptions,
        method: "POST",
        body: JSON.stringify({
          bookmark: {
            mangaID: manga?._id,
            vendor: manga?.vendor,
          },
        }),
      })
        .then(d => d.json())
        .then(d => {
          onSuccess(d);
          return d;
        }),
    options,
  );

export const useMangaInfo = <T>(
  options:
    | Omit<UseQueryOptions<T, unknown, T, QueryKey>, "queryKey" | "queryFn">
    | undefined,
  vendor: MangaInfo["vendor"],
  slug: string,
) =>
  useQuery<T>(
    `mangaInfo:${vendor}:${slug}`,
    () =>
      fetch(apiBase + `/manga/info/${vendor}/${slug}`, {
        ...defaultFetchOptions,
        method: "GET",
      }).then(d => d.json()),
    options,
  );
