import mongo from "../db/mongo";
import redis from "../db/redis";
import tryJSONParse from "../utils/tryJSONParse";

type MediaItem = {
  id: number;
  title: {
    romanji: string;
    english?: string;
  };
  coverImage: {
    large?: string;
    extraLarge?: string;
    color?: string;
  };
  description?: string;
  bannerImage?: string;
};

export default async function getAnilistTrending() {
  const db = await redis();

  try {
    const raw = await db.get("anilist:trending");
    if (!raw) return null;
    const data = tryJSONParse<{ Page?: { media?: MediaItem[] } }>(raw);
    if (!data?.Page?.media) return null;
    else return data.Page.media;
  } catch (e) {
    return null;
  }
}

export async function mangaSeeAnilistTrending() {
  const media = await getAnilistTrending();
  if (!media) return [];
  const ids = media.map(media => ({ anilistID: media.id }));
  const db = await mongo();

  const msManga = await db
    .collection("mangaSee")
    .find({
      $or: ids,
    })
    .project({
      _id: 0,
      slug: 1,
      genres: 1,
      anilistID: 1,
      title: 1,
    })
    .toArray();

  return ids
    .map(id => {
      const mangaSee = msManga.find(manga => manga.anilistID === id.anilistID);
      if (!mangaSee) return;
      const anilist = media.find(media => media.id === id.anilistID);
      if (!anilist) return;
      return {
        manga: {
          vendor: "MANGASEE",
          slug: mangaSee.slug,
          genres: mangaSee.genres,
        },
        anilist,
      };
    })
    .filter(v => v && v.anilist.bannerImage);
}
