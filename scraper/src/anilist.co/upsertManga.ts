import { ObjectID } from "bson";
import mongo from "../db/mongo";

export default async function upsertManga(
    key: string,
    value: string | ObjectID,
    anilistMedia: any
) {
    const db = await mongo();

    return void (await db.collection("anilist").updateOne(
        {
            "data.id": anilistMedia.id,
        },
        {
            $set: {
                data: anilistMedia,
                [key]: value,
            },
        },
        {
            upsert: true
        }
    ));
}
