export default function isDev(): boolean {
  return [
    "localhost",
    "local.com",
    "atsumaru.local",
    "127.0.0.1",
    "frontend",
  ].includes(location.hostname);
}
