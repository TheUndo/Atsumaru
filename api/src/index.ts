import cors from "cors";
import express from "express";
import { getLatestUpdates } from "./actions/mangaSee";
import manga from "./routes/manga";
import { createBase } from "./utils";
import dotenv from "dotenv";
import anilistAuth from "./routes/auth/anilist";
import cookieParser from "cookie-parser";
import auth from "./middleware/auth";
import myself from "./routes/auth/myself";
import logout from "./routes/auth/logout";
import syncProgress from "./routes/user/syncProgrsss";
import { Request } from "./types";
import mangaSeeFront from "./routes/layouts/mangaSee/front/mangaSee";
import search from "./routes/search/search";
import getAnilist from "./routes/anilist/get";
import addBookmark from "./routes/user/addBookmark";
import getBookmark from "./routes/user/getBookmark";
import removeBookmark from "./routes/user/removeBookmark";
import userLibrary from "./routes/layouts/library/library";
import continueReading from "./routes/layouts/common/continueRading";
import mangaSeeAnilistTrendingLayout from "./routes/layouts/mangaSee/trendingShowcase";

dotenv.config();

const app = express();

const base = createBase("v1");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.listen(3000, () => console.log("Api running"));

const localHostnames =
  process.env.DEPLOYED === "TRUE"
    ? []
    : [
        "http://localhost:3000",
        "http://localhost:4000",
        "http://local.com",
        "http://atsu.local",
      ];

const whitelist = [
  ...localHostnames,
  "https://atsu.moe",
  "https://www.atsu.moe",
];

const corsOptions = {
  credentials: true,
  origin: function (origin: any, callback: any) {
    if (origin === undefined || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

app.get(base("/auth/myself"), auth, myself);
app.get(base("/auth/logout"), auth, logout);
app.post(base("/user/sync-progress"), auth, syncProgress);

/* layouts */
app.get(base("/layout/library"), auth, userLibrary);
app.get(
  base("/layouts/common/continue-reading"),
  auth,
  continueReading,
); /* common */
app.get(
  base("/layouts/s1/trending-showcase"),
  mangaSeeAnilistTrendingLayout,
); /* mangaSee */
app.get(base("/layout/:source/front"), auth, (req: Request, res) => {
  switch (req.params.source) {
    case "s1":
      return mangaSeeFront(req, res);
    default:
      res.status(404).send("unknown source");
      break;
  }
});

/* GET anilist */
app.get(base("/anilist/:id"), getAnilist);

/* GET search */
app.get(base("/search/:query"), search);

/* manga */
app.get(base("/manga/:source/:slug"), auth, manga);

/* bookmarks */
app.put(base("/manga/bookmark"), auth, addBookmark);
app.post(base("/manga/bookmark"), auth, getBookmark);
app.delete(base("/manga/bookmark"), auth, removeBookmark);

/* anilist */
app.post(base("/auth/anilist"), anilistAuth);

app.all("*", (req, res) => {
  res.status(404).send("404");
});
