import { QueryKey, useQuery, UseQueryOptions } from "react-query";
import { apiBase } from "../hooks/useApi";
import { MangaInfo } from "../types";
import { defaultFetchOptions } from "./common";

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
    `mangaInfo`,
    () =>
      fetch(apiBase + `/manga/${vendor}/${slug}`, {
        ...defaultFetchOptions,
        method: "GET",
      }).then(d => d.json()),
    options,
  );
