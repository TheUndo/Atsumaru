import mongo from "../db/mongo";

export default async function createOrUpdateUser(
  anilistUser: any,
  where: Record<string, any>,
) {
  const db = await mongo();

  return await db.collection("users").updateOne(
    where,
    {
      $set: anilistUser,
    },
    {
      upsert: true,
    },
  );
}
