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
import syncProgress from "./routes/user/syncProgrsss";
import { Request } from "./types";
import mangaSeeFront from "./routes/layouts/front/mangaSee";
import search from "./routes/search/search";

dotenv.config();

const app = express();

const base = createBase("v1");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.listen(3000, () => console.log("Api running"));

const whitelist = [
  "http://localhost:3000",
  "http://localhost:4000",
  "http://local.com",
  "http://650a-158-174-187-200.ngrok.io",
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
app.post(base("/user/sync-progress"), auth, syncProgress);

app.get(base("/layout/:source/front"), auth, (req: Request, res) => {
  switch (req.params.source) {
    case "s1":
      return mangaSeeFront(req, res);
    default:
      res.status(404).send("unknown source");
      break;
  }
});

/* GET search */
app.get(base("/search/:query"), search);


/* GET manga details */
app.get(base("/manga/:source/:slug"), auth, manga);
app.post(base("/auth/anilist"), anilistAuth);

app.all("*", (req, res) => {
  res.status(404).send("404");
});
