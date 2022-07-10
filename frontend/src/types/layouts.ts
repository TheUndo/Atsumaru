import { MangaInfo } from "../types";

export type LayoutItem = {
  key: string;
  type: "SHOWCASE" | "CAROUSEL";
  fetch: string;
};

export type CarouselLayoutItem = LayoutItem & {
  title: string;
  type: "CAROUSEL";
};

export type ShowcaseLayoutItem = LayoutItem & {
  type: "SHOWCASE";
};

export type LayoutItems = CarouselLayoutItem | ShowcaseLayoutItem;

export type ShowCaseLayoutItem = {
  manga: {
    vendor: MangaInfo["vendor"];
    slug: string;
    genres: string[];
    title?: string;
  };
  anilist: {
    id: number;
    title: {
      romaji?: string | null;
      english?: string | null;
    };
    coverImage: {
      extraLarge?: string | null;
      large?: string | null;
      color?: string | null;
    };
    description: string;
    bannerImage?: null | string;
  };
};
