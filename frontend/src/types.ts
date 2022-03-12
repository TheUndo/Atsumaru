import { SettingsType } from "./hooks/useSettings";

export type MangaInfo = {
  _id: string;
  title: string;
  authors: string[];
  genres: string[];
  type: string;
  release: string;
  alternativeNames: string[];
  officiallyTranslated: string;
  statuses: string[];
  description: string;
  slug: string;
  chapters: Chapter[];
  cover?: string;
  vendor: "MANGASEE";
};

export type ProgressInfo = {
  _id: string;
  chapterProgress: {
    [key: string]: {
      page: string;
      progress?: number;
      date: string;
    };
  };
  lastUpdated: string;
  mangaSlug: string;
  preferredDirection: SettingsType["readingDirection"];
  user: unknown;
  vendor: MangaInfo["vendor"];
};

export type Chapter = {
  pages: Page[];
  date: string;
  name: string;
  title: string | null;
  type: string | null;
};

export type Page = {
  name: string;
  pageURLs: string[];
};
