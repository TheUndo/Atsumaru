import { Db, MongoClient } from "mongodb";

/**
 * Master mongo client, do not import this client unless you are making jest tests
 */
export const masterClient = MongoClient.connect(process.env.MONGO_DB_URI!).then(client => {
	process.on("SIGTERM", cleanupMongoClient(client));
	process.on("SIGQUIT", cleanupMongoClient(client));
	process.on("SIGABRT", cleanupMongoClient(client));

	return client;
});

/**
 * Db function that creates easy access to mongodb
 * @returns Database and a close function
 */
export default async function mongo(): Promise<Db> {
	const client = await masterClient;

	return client.db("manga");

};

export const cleanupMongoClient = (client: MongoClient) => async (): Promise<void> => {
	await client.close();
};
