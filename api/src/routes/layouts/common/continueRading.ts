import * as express from "express";
import { getRecentlyRead } from "../../../actions/readProgress";
import { Request } from "../../../types";

export default async function continueReading(
  req: Request,
  res: express.Response,
) {
  if (!req.user) return void res.status(401).send("unauthorized");

  try {
    return res.send({ items: await getRecentlyRead(req.user, 20) });
  } catch (e) {
    console.error(e);
    return void res.status(500).send(e);
  }
}
