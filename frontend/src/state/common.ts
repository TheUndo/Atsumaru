export const defaultFetchOptions = {
  credentials: "include",
  mode: "cors",
  redirect: "follow",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
} as const;
