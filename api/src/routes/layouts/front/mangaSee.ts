import * as express from "express";
import { getLatestUpdates } from "../../../actions/mangaSee";
import { getRecentlyRead } from "../../../actions/readProgress";
import { Request } from "../../../types";

export default async function mangaSeeFront(
  req: Request,
  res: express.Response,
) {
  try {
    const [latest, recentlyRead] = await Promise.all([
      getLatestUpdates(32),
      getRecentlyRead(req.user!, "MANGASEE", 32),
    ]);

    console.log(recentlyRead)

    return void res.send({
      layout: [
        recentlyRead.length && {
          header: "Continue reading",
          key: "continue-reading",
          items: recentlyRead,
        },
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
