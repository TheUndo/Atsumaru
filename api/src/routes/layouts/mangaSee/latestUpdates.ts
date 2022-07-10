import * as express from "express";
import { getLatestUpdates } from "../../../actions/mangaSee";

export default async function mangaSeeLatestUpdates(
  req: express.Request,
  res: express.Response,
) {
  try {
    return res.send({ items: await getLatestUpdates(32) });
  } catch (e) {
    console.error(e);
    return void res.status(500).send(e);
  }
}
