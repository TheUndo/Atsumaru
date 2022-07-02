import * as express from "express";
import { mangaSeeAnilistTrending } from "../../../actions/getAnilistTrending";

export default async function mangaSeeAnilistTrendingLayout(
  req: express.Request,
  res: express.Response,
) {
  try {
    return res.send({ items: await mangaSeeAnilistTrending() });
  } catch (e) {
    console.error(e);
    return void res.status(500).send(e);
  }
}
