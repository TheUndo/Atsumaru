import * as express from "express";
import { createLayout } from "../../../../layout/layout";
import { Request } from "../../../../types";

export default async function mangaSeeFront(
  req: Request,
  res: express.Response,
) {
  const source = req.params.source as string;
  try {
    return void res.send({
      layout: createLayout([
        {
          type: "SHOWCASE",
          key: "trending-showcase",
          fetch: `/layouts/${source}/trending-showcase`,
        },
        {
          type: "CAROUSEL",
          title: "Continue reading",
          key: "continue-reading",
          fetch: `/layouts/common/continue-reading`,
        },
        {
          type: "CAROUSEL",
          title: "Hot updates",
          key: "hot-updates",
          fetch: `/layouts/${source}/sliders/hotUpdates`,
        },
        {
          type: "CAROUSEL",
          title: "Top 10",
          key: "top-ten",
          fetch: `/layouts/${source}/sliders/topTen`,
        },
        {
          type: "CAROUSEL",
          title: "New manga",
          key: "new-series",
          fetch: `/layouts/${source}/sliders/newSeries`,
        },
        {
          type: "CAROUSEL",
          title: "Latest updates",
          key: "latest-updates",
          fetch: `/layouts/${source}/latest-updates`,
        },
      ]),
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
