import axios from "axios";

const query = `
query ($title: String) {
  Media (type: MANGA, search: $title) {
    id
    idMal
    format
    status
    description
    startDate {
        year
        month
        day
    }
    endDate {
        year
        month
        day
    }
    season
    seasonYear
    seasonInt
    duration
    chapters
    volumes
    countryOfOrigin
    isLicensed
    source
    coverImage {
        extraLarge
        large
        medium
        color
    }
    genres
    synonyms
    averageScore
    meanScore
    popularity
    tags {
        id
        name
        description
        category
        description
        rank
        isAdult
    }
    isAdult
    type
    title {
      romaji
      english
      native
    }
  }
}
`;

// Define the config we'll need for our Api request
const url = "https://graphql.anilist.co";

// Make the HTTP Api request

export default async function performSearch(titles: string[]) {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: {
            query,
            variables: {
                title: titles[0],
            },
        },
    } as const;
    try {
        const { data } = await axios.post(url, JSON.stringify(options.body), {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });

        const res = data.data.Media;
        const anilistTitles = [
            res.title?.romaji?.toLowerCase(),
            res.title?.english?.toLowerCase(),
            ...[
                res.title?.romaji?.toLowerCase(),
                res.title?.english?.toLowerCase(),
            ]
                .map((v) => v?.split(":"))
                .flat(2),
            ...(res?.synonyms?.map((v: string) => v.toLowerCase()) ?? []),
        ].map(specialCharsRemover);

        if (
            anilistTitles.some((title: string) =>
                titles
                    .map(specialCharsRemover)
                    .some((otherTitle) => otherTitle === title)
            )
        ) {
            return res;
        }
    } catch (e: any) {
        console.error(e?.response?.data?.errors ?? e);
    }
    return null;
}

function specialCharsRemover(title: string) {
    return cyrillicToLatin(
        title
            ?.replace(/\s+|\.$/g, "")
            ?.replace(/о/g, "o")
            ?.replace(/ou/gi, "o")
            ?.replace(/[:-_+~*'"\s#@%&/\\()[]{}=!?.,^¿`$¢¥£”%¶≠]/g, "")
            ?.toLowerCase()
            .trim() ?? ""
    );
}

function cyrillicToLatin(input: string) {
    return input
        .replace(/\u0401/g, "YO")
        .replace(/\u0419/g, "I")
        .replace(/\u0426/g, "TS")
        .replace(/\u0423/g, "U")
        .replace(/\u041A/g, "K")
        .replace(/\u0415/g, "E")
        .replace(/\u041D/g, "N")
        .replace(/\u0413/g, "G")
        .replace(/\u0428/g, "SH")
        .replace(/\u0429/g, "SCH")
        .replace(/\u0417/g, "Z")
        .replace(/\u0425/g, "H")
        .replace(/\u042A/g, "")
        .replace(/\u0451/g, "yo")
        .replace(/\u0439/g, "i")
        .replace(/\u0446/g, "ts")
        .replace(/\u0443/g, "u")
        .replace(/\u043A/g, "k")
        .replace(/\u0435/g, "e")
        .replace(/\u043D/g, "n")
        .replace(/\u0433/g, "g")
        .replace(/\u0448/g, "sh")
        .replace(/\u0449/g, "sch")
        .replace(/\u0437/g, "z")
        .replace(/\u0445/g, "h")
        .replace(/\u044A/g, "'")
        .replace(/\u0424/g, "F")
        .replace(/\u042B/g, "I")
        .replace(/\u0412/g, "V")
        .replace(/\u0410/g, "a")
        .replace(/\u041F/g, "P")
        .replace(/\u0420/g, "R")
        .replace(/\u041E/g, "O")
        .replace(/\u041B/g, "L")
        .replace(/\u0414/g, "D")
        .replace(/\u0416/g, "ZH")
        .replace(/\u042D/g, "E")
        .replace(/\u0444/g, "f")
        .replace(/\u044B/g, "i")
        .replace(/\u0432/g, "v")
        .replace(/\u0430/g, "a")
        .replace(/\u043F/g, "p")
        .replace(/\u0440/g, "r")
        .replace(/\u043E/g, "o")
        .replace(/\u043B/g, "l")
        .replace(/\u0434/g, "d")
        .replace(/\u0436/g, "zh")
        .replace(/\u044D/g, "e")
        .replace(/\u042F/g, "Ya")
        .replace(/\u0427/g, "CH")
        .replace(/\u0421/g, "S")
        .replace(/\u041C/g, "M")
        .replace(/\u0418/g, "I")
        .replace(/\u0422/g, "T")
        .replace(/\u042C/g, "'")
        .replace(/\u0411/g, "B")
        .replace(/\u042E/g, "YU")
        .replace(/\u044F/g, "ya")
        .replace(/\u0447/g, "ch")
        .replace(/\u0441/g, "s")
        .replace(/\u043C/g, "m")
        .replace(/\u0438/g, "i")
        .replace(/\u0442/g, "t")
        .replace(/\u044C/g, "'")
        .replace(/\u0431/g, "b")
        .replace(/\u044E/g, "yu");
}
