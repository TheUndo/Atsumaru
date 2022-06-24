import * as express from "express";
import getBookmarks from "../../../actions/getBookmarks";
import { getLatestUpdates } from "../../../actions/mangaSee";
import { getRecentlyRead } from "../../../actions/readProgress";
import mongo from "../../../db/mongo";
import { Request } from "../../../types";

export default async function userLibrary(req: Request, res: express.Response) {
  if (!req.user) return void res.status(401).send({ state: "NOT_LOGGED_IN" });

  try {
    const [recentlyRead] = await Promise.all([
      getRecentlyRead(req.user!, "MANGASEE", 32),
    ]);

    getBookmarks(req.user._id, 0, 20);

    return void res.send({
      layout: [
        recentlyRead.length && {
          header: "Continue reading",
          key: "continue-reading",
          items: recentlyRead,
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
