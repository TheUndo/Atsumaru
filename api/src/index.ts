import cors from "cors";
import express from "express";
import { getLatestUpdates } from "./actions/mangaSee";
import manga from "./routes/manga";
import { path } from "./utils";
import dotenv from "dotenv";
import anilistAuth from "./routes/auth/anilist";
import cookieParser from "cookie-parser";
import auth from "./middleware/auth";
import myself from "./routes/auth/myself";

dotenv.config();

const app = express();

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

app.get(path("/auth/myself"), auth, myself);

app.get(path("/layout/:source/front"), async (_, res) => {
  try {
    const [latest] = await Promise.all([getLatestUpdates(32)]);

    return void res.send({
      layout: [
        {
          header: "Latest updates",
          key: "latest-updates",
          items: latest,
        },
      ],
    });
  } catch (e) {
    return void res.status(500).send("error");
  }
});

/* GET manga details */
app.get(path("/manga/:source/:slug"), manga);
app.post(path("/auth/anilist"), anilistAuth);

app.all("*", (req, res) => {
  res.status(404).send("404");
});
