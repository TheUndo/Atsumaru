import axios from "axios";

export default async function anilistRequest(
  url: string,
  accessToken: string,
  body: any,
) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body,
  } as const;

  try {
    const { data } = await axios.post(url, JSON.stringify(options.body), {
      headers: options.headers,
    });

    return data;
  } catch (e: any) {
    console.error(e?.response || e);
    return null;
  }
}
