import * as express from "express";
import { createLayout } from "../../../layout/layout";
import { Request } from "../../../types";

export default async function userLibrary(req: Request, res: express.Response) {
  if (!req.user) return void res.status(401).send({ state: "NOT_LOGGED_IN" });

  try {
    return void res.send({
      layout: createLayout([
        {
          type: "CAROUSEL",
          title: "Continue reading",
          key: "continue-reading",
          fetch: `/layouts/common/continue-reading`,
        },
        {
          type: "CAROUSEL",
          title: "Bookmarks",
          key: "bookmarks",
          fetch: `/layouts/common/bookmarks`,
        },
      ]),
    });
  } catch (e) {
    console.error(e);
    return void res
      .status(500)
      .send(
        "Something went internally wrong while rendering the library." +
          " Logs are provided for the webmaster",
      );
  }
}
