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
  anilistID?: number;
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

export type GridDisplayType = "GRID" | "LIST" | "DETAILS";

export type ProgressNode = {
  chapter: string;
  meta: {
    page: string;
    progress?: number | undefined;
    date: string;
  };
};

export type Anilist = {
  data: {
    id: number;
    idMal: number | null;
    format: "MANGA" | "Manhwa" | "MANHUA";
    status: "RELEASING" | "FINISHED";
    description?: string;
    startDate: {
      year: number | null;
      month: number | null;
      day: number | null;
    };
    endDate: { year: number | null; month: number | null; day: number | null };
    season: string | null;
    seasonYear: string | null;
    seasonInt: number | null;
    duration: string | null;
    chapters: unknown | null;
    volumes: number | null;
    countryOfOrigin: "JP" | "KR" | "CH";
    isLicensed: boolean;
    source: "OTHER" | "ORIGINAL";
    coverImage: {
      extraLarge: string;
      large: string;
      medium: string;
      color: string;
    };
    genres: string[];
    synonyms: string[];
    averageScore: number;
    meanScore: number;
    popularity: number;
    tags: {
      id: number;
      name: string;
      description: string;
      category: string;
      rank: number;
      isAdult: boolean;
    }[];
    isAdult: boolean;
    type: "MANGA" | "Manhwa" | "MANHUA";
    title: {
      romaji?: string;
      english?: string;
      native?: string;
    };
  };
  mangaSeeSlug: string;
};
