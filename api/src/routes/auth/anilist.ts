import axios from "axios";
import * as express from "express";

export default async function anilistAuth(
  req: express.Request,
  res: express.Response,
) {
  const { code } = req.body;

  if (!code) return void res.status(400).send({ state: "INVALID_CODE" }).end();

  const options = {
    url: "https://anilist.co/api/v2/oauth/token",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      grant_type: "authorization_code",
      client_id: process.env.VITE_ANILIST_CLIENT_ID,
      client_secret: process.env.ANILIST_CLIENT_SECRET,
      redirect_uri: process.env.VITE_ANILIST_REDIRECT_URI,
      code,
    }),
  } as const;

  const response = await axios(options);
}
