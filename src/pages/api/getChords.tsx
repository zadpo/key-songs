import { NextApiRequest, NextApiResponse } from "next";

const getChords = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const response = await fetch("https://www.worshiptogether.com");
    if (!response.ok) {
      throw new Error("Failed to fetch data from the website");
    }
    const data = await response.text();

    // Note: JSDOM is not available on the client-side, so we're using a simple regex here
    // This is not as robust as using JSDOM, but it works for this example
    const chords =
      data
        .match(/<li[^>]*>(.*?)<\/li>/g)
        ?.map((match) => match.replace(/<[^>]+>/g, "").trim())
        ?.join(", ") || "No chords found";

    console.log(chords);

    res.status(200).json({ chords });
  } catch (error) {
    console.error("Error in getChords:", error);
    res.status(500).json({ error: "Failed to fetch chords" });
  }
};

export default getChords;
