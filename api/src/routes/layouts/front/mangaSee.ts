import * as express from "express";
import { getLatestUpdates } from "../../../actions/mangaSee";
import { getRecentlyRead } from "../../../actions/readProgress";
import mongo from "../../../db/mongo";
import { Request } from "../../../types";

async function getSliders() {
  const db = await mongo();

  const map = {
    hotUpdates: {
      header: "Hot updates",
      key: "hot-updates",
    },
    topTen: {
      header: "Top 10",
      key: "top-ten",
    },
    newSeries: {
      header: "New manga",
      key: "new-series",
    },
  } as const;

  const sliders = await db
    .collection<{
      key: string;
      items: any[];
    }>("mangaSeeFrontPage")
    .find({
      $or: Object.keys(map).map(key => ({ key })),
    })
    .toArray();

  return Object.entries(map)
    .map(([key, value]) => {
      const items = sliders
        .find(slider => slider.key === key)
        ?.items?.slice(0, 32)
        .map(item => ({ manga: { ...item, type: "GENERIC_ITEM" } }));
      if (!items) return;
      return {
        ...value,
        items: items.map(item => ({
          ...item,
          manga: { ...item.manga, vendor: "MANGASEE" },
        })),
      };
    })
    .filter(v => v);
}

export default async function mangaSeeFront(
  req: Request,
  res: express.Response,
) {
  try {
    const [latest, recentlyRead, sliders] = await Promise.all([
      getLatestUpdates(32),
      getRecentlyRead(req.user!, "MANGASEE", 32),
      getSliders(),
    ]);

    return void res.send({
      layout: [
        recentlyRead.length && {
          header: "Continue reading",
          key: "continue-reading",
          items: recentlyRead,
        },
        ...sliders,
        {
          header: "Latest updates",
          key: "latest-updates",
          items: latest,
        },
      ].filter(v => v),
    });
  } catch (e) {
    console.error(e);
    return void res
      .status(500)
      .send(
        "Something went internally wrong while rendering the front layout for MANGASEE." +
          " Logs are provided for the webmaster",
      );
  }
}
