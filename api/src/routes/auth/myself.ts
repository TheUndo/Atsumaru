import axios from "axios";
import * as express from "express";
import createOrUpdateUser from "../../actions/createOrUpdateUser";
import anilistRequest from "../../actions/makeAnilistRequest";
import { Request } from "../../types";

export default async function myself(req: Request, res: express.Response) {
  if (req.user) return res.send(req.user);
  return res.status(404).send("not logged in");
}
