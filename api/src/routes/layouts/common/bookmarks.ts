import * as express from "express";
import getBookmarks from "../../../actions/getBookmarks";
import { Request } from "../../../types";

export default async function bookmarks(
  req: Request,
  res: express.Response,
) {
  if (!req.user) return void res.status(401).send("unauthorized");

  try {
    return res.send({ items: await getBookmarks(req.user._id, 0, 20) });
  } catch (e) {
    console.error(e);
    return void res.status(500).send(e);
  }
}
