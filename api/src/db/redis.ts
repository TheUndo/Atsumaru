import { createClient } from "redis";

const client = createClient({
  url: "redis://redis:6379",
});

client.connect();

export default async function redis() {
  return client;
}
