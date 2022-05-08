import * as express from "express";
import { logout } from "../../actions/logout";
import { Request } from "../../types";

export default async function myself(req: Request, res: express.Response) {
  return void logout(res, req.user);
}
