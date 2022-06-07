import { createContext, PropsWithChildren, useContext } from "react";
import { Chapter, MangaInfo } from "../../types";

export type PageState = {
  loading: boolean;
  loaded: boolean;
  src?: string;
  name: string;
  failed?: boolean;
};

export type ReaderCtx = {
  manga?: MangaInfo;
  settingsShown: boolean;
  setSettingsShown: (value: boolean) => void;
  controlsShown: boolean;
  setControlsShown: (value: boolean) => void;
  jumpChapter: (offset: number) => void;
  jumpToFixedChapter?: (chapter: Chapter) => void;
  jumpToFixedPage: (page: string) => void;
  nextChapter?: Chapter;
  currentChapter?: Chapter;
  previousChapter?: Chapter;
  initialPage?: string;
  background?: string;
  setInitialPage?: React.Dispatch<React.SetStateAction<string | undefined>>;
  chapters: Chapter[];
  currentPage?: string;
  setCurrentPage?: React.Dispatch<React.SetStateAction<string>>;
  chapterLoaded?: boolean;
  setChapterLoaded?: React.Dispatch<React.SetStateAction<boolean>>;
  vendor: MangaInfo["vendor"];
  desktopControlsVisible: boolean;
  setDesktopControlsVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  pageContentScrollPosition?: number;
  setPageContentScrollPosition?: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
  pageRelativeNavigate?: (offset: number) => void;
  loadPages: {
    [k: string]: PageState;
  };
  setLoadPages?: React.Dispatch<
    React.SetStateAction<{
      [k: string]: PageState;
    }>
  >;
};

export const ReaderContext = createContext<ReaderCtx>({
  settingsShown: false,
  setSettingsShown: (value: boolean) => void 0,
  controlsShown: true,
  setControlsShown: (value: boolean) => void 0,
  jumpChapter: (offset: number) => void 0,
  jumpToFixedPage: (page: string) => void 0,
  nextChapter: undefined,
  currentChapter: undefined,
  previousChapter: undefined,
  initialPage: "1",
  chapters: [],
  currentPage: void 0,
  vendor: "MANGASEE",
  desktopControlsVisible: true,
  loadPages: {},
});

export function useReader() {
  return useContext(ReaderContext);
}

export default function ReaderContextProvider({
  value,
  children,
}: PropsWithChildren<{ value: ReaderCtx }>) {
  return (
    <ReaderContext.Provider value={value}>{children}</ReaderContext.Provider>
  );
}
