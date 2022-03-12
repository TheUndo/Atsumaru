import { vendors } from "./constants";

export function createBase(version: string) {
  return (path: string) => `/api/v1${path}`;
}

export function mongoCollectionByVendor(vendor: typeof vendors[number]) {
  switch (vendor) {
    case "MANGASEE":
      return "mangaSee";
    case "MANGADEX":
      return "mangaDex";
    case "NHENTAI":
      return "nHentai";
  }
}