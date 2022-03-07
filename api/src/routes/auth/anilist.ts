import axios from "axios";
import * as express from "express";
import createOrUpdateUser from "../../actions/createOrUpdateUser";
import anilistRequest from "../../actions/makeAnilistRequest";

export default async function anilistAuth(
  req: express.Request,
  res: express.Response,
) {
  const { code } = req.body;

  if (!code) return void res.status(400).send({ state: "INVALID_CODE" }).end();

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: {
      grant_type: "authorization_code",
      client_id: process.env.VITE_ANILIST_CLIENT_ID,
      client_secret: process.env.ANILIST_CLIENT_SECRET,
      redirect_uri: process.env.VITE_ANILIST_REDIRECT_URI,
      code,
    },
  } as const;
  const url = "https://anilist.co/api/v2/oauth/token";
  try {
    const { data } = await axios.post(url, JSON.stringify(options.body), {
      headers: options.headers,
    });

    const viewer = await anilistRequest(
      "https://graphql.anilist.co",
      data.access_token,
      {
        query: `
query {
  Viewer {
    id
    name
    avatar {
      large
      medium
    }
    bannerImage
  }
}
  `,
      },
    );

    if (!viewer?.data?.Viewer) throw new Error();
    const user = viewer.data.Viewer;

    await createOrUpdateUser(
      {
        ...user,
        anilistAccessToken: data.access_token,
        anilistRefreshToken: data.refresh_token,
      },
      { id: user.id },
    );

    const secure = req.url.startsWith("https");
    res.cookie("anilist_access_token", data.refresh_token, {
      expires: new Date(Date.now() + data.expires_in * 1000),
      httpOnly: true,
      sameSite: "strict",
      secure,
      path: "/",
    });
    res.cookie("anilist_user_id", user.id, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 10),
      httpOnly: true,
      sameSite: "strict",
      secure,
      path: "/",
    });
    res.cookie("anilist_refresh_token", data.refresh_token, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 10),
      httpOnly: true,
      sameSite: "strict",
      secure,
      path: "/",
    });

    return res.status(200).send(viewer);
  } catch (e: any) {
    return res.status(403).send(e?.response?.toString() || e);
  }
}
