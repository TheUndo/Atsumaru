import * as express from "express";
import { ObjectId } from "mongodb";

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
