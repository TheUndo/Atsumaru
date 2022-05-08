import * as express from "express";
import { User } from "../types";

export async function logout(res: express.Response, user?: User) {
  if (!user) return void res.status(403).send("");

  res.clearCookie("anilist_access_token");
  res.clearCookie("anilist_user_id");
  res.clearCookie("anilist_refresh_token");

  return void res.status(200).send("ok");
}
