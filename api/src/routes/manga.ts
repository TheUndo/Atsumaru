import * as express from "express";
import mongo from "../db/mongo";

export default async function manga(req: express.Request, res: express.Response) {

    const db = await mongo();

    const { slug} = req.params;

    if (!slug)
        return void res.status(404).send("not found");

    const manga = await db
        .collection("mangaSee")
        .findOne({
            slug
        });

    if (!manga)
        return void res.status(404).send("manga not found in db");

    return void res.send({
        ...manga,
        vendor: "MANGASEE"
    });

} 