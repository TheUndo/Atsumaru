import MeiliSearch from "meilisearch";

export const client = new MeiliSearch({
  host: "http://search_engine:7700",
  apiKey: process.env.MEILI_MASTER_KEY!,
});
