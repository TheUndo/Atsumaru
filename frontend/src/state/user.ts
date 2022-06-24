import { QueryKey, useQuery, UseQueryOptions } from "react-query";
import { apiBase } from "../hooks/useApi";
import { defaultFetchOptions } from "./common";

export const useUserInfo = <T>(
  options: Omit<
    UseQueryOptions<T, unknown, T, QueryKey>,
    "queryKey" | "queryFn"
  >,
) =>
  useQuery<T>(
    "userInfo",
    () =>
      fetch(apiBase + "/auth/myself", {
        ...defaultFetchOptions,
        method: "GET",
      }).then(d => d.json()),
    options,
  );

export const useUserLibrary = <T>(
  options: Omit<
    UseQueryOptions<T, unknown, T, QueryKey>,
    "queryKey" | "queryFn"
  >,
) =>
  useQuery<T>(
    "userLibrary",
    () =>
      fetch(apiBase + "/layout/library", {
        ...defaultFetchOptions,
        method: "GET",
      }).then(d => d.json()),
    options,
  );
