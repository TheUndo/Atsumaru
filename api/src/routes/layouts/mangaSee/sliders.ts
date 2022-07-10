import * as express from "express";
import getSliders from "../../../actions/getSliders";

export default async function mangaSeeSliders(
  req: express.Request,
  res: express.Response,
) {
  const key = req.params.key.toString();
  try {
    const [content] = await getSliders("mangaSeeFrontPage", [key]);
    const result = {
      ...content,
      items: content.items.slice(0, 20).map(manga => ({ manga })),
    };
    return res.send(result);
  } catch (e) {
    console.error(e);
    return void res.status(500).send(e);
  }
}
