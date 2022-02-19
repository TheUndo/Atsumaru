
export namespace MangaSee {

    export type ListItem = {
        SeriesID: string,
        IndexName: string,
        SeriesName: string,
        ScanStatus: string,
        Chapter: string,
        Genres: string,
        Date: string,
        IsEdd: false
    }

    export type MangaInfo = {
        title: string;
        authors: string[];
        genres: string[];
        type: string;
        release: string;
        alternativeNames: string[];
        officiallyTranslated: string;
        statuses: string[];
        description: string;
        chapters: NormalizedMangaSeeChapterStruct[];
        latestChapter?: NormalizedMangaSeeChapterStruct;
        cover?: string;
        slug: string;
        mangaSeeSlug: string;
    }

    export type RawMangaSeeChapterStruct = {
        Chapter: string;
        type: string;
        Date: string;
        ChapterName: string | null;
    }
    export type NormalizedMangaSeeChapterStruct = {
        rawChapter: string;
        chapterURL: string;
        name: string;
        type: string;
        date?: Date;
        title: string | null;
        pages: Page[];
    }
    export type Page = {
        pageURLs: string[];
        name: string;
    }

    export type SearchItem = {
        /** slug */
        i: string;

        /** title */
        s: string;

        /** alternative names */
        a: string[];
    }

}