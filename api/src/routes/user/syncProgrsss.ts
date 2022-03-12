import Joi from "joi";
import * as express from "express";
import { Request } from "../../types";
import mongo from "../../db/mongo";
import { readingDirections, vendors } from "../../constants";

export type MangaSyncPrime = {
  vendor: string;
  mangaSlug: string;
  preferredDirection: string | null;
  chapterProgress: {
    [key: string]: {
      page: string;
      progress?: number;
      date: number;
    };
  };
};

const schema = Joi.array().items(
  Joi.object({
    vendor: Joi.string().valid(...vendors),
    mangaSlug: Joi.string(),
    preferredDirection: Joi.string()
      .optional()
      .valid(...readingDirections, null),
    chapterProgress: Joi.object().pattern(
      /./,
      Joi.object({
        page: Joi.string(),
        progress: Joi.number().min(0).max(1).optional(),
        date: Joi.number().min(0),
      }).unknown(true),
    ),
  }),
);

export default async function syncProgress(
  req: Request,
  res: express.Response,
) {
  if (!req.user) return void res.status(403).send({ state: "NOT_LOGGED_IN" });

  const result = schema.validate(req.body?.currentPrimed);

  if (result.error)
    return void res
      .status(400)
      .send({ state: "INVALID_PROGRESS", error: result.error });

  const { value } = result;

  const db = await mongo();

  try {
    // dark magic
    await db.collection("readProgress").bulkWrite(
      value.map((progress: Partial<MangaSyncPrime>) => {
        const chapterProgress = JSON.parse(
          JSON.stringify(progress.chapterProgress),
        );
        delete progress.chapterProgress;

        return {
          updateOne: {
            upsert: true,
            filter: {
              vendor: progress.vendor,
              mangaSlug: progress.mangaSlug,
            },
            update: {
              $set: {
                user: req.user,
                ...progress,
                ...Object.entries(chapterProgress).reduce<any>(
                  (t, [name, progress]: any) => ({
                    ...t,
                    [`chapterProgress.${name}`]: {
                      ...progress,
                      date: new Date(progress.date),
                    },
                  }),
                  {},
                ),
                lastUpdated: new Date(),
              },
            },
          },
        };
      }),
    );
    return void res.status(200).send({ state: "ok" });
  } catch (e) {
    console.error(e);
    return void res.status(500).send({ state: "INTERNAL_ERROR" });
  }
}
