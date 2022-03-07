import * as express from "express";
import mongo from "../db/mongo";
import { Request, User } from "../types";

export default async function auth(
  req: Request,
  res: express.Response,
  next: express.NextFunction,
) {
  const id = +req.cookies.anilist_user_id;
  if (!id) return void next();
  const db = await mongo();
  const user = await db.collection("users").findOne<User>({
    id,
  });

  if (user) req.user = user;

  next();
}
