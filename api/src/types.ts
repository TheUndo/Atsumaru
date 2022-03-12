import * as express from "express";
import { ObjectId } from "mongodb";
import { vendors } from "./constants";

export type User = {
  id: number;
  _id: ObjectId;
  name: string;
  avatar: Avatar;
};
export type Avatar = {
  medium: string;
  large: string;
};

export type Request = {
  user?: User;
} & express.Request;

export type ReadProgress = {
  _id: ObjectId;
  mangaSlug: string;
  vendor: typeof vendors[number];
  lastUpdated: Date;
  preferredDirection: string;
  user: User;
  chapterProgress: {
    [key: string]: {
      page: string;
      progress?: number;
      date: Date;
    };
  };
};

export type ProjectedReadProgress = Omit<
  ReadProgress,
  "vendor" | "preferredDirection" | "user"
>;
