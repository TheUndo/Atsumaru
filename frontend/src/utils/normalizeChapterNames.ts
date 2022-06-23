export default function normalizeChapterNames(name: string) {
  return (name ?? "??").replace(/^[^\d]+/, "");
}
