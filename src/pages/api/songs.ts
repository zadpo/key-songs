import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const songsCollection = collection(db, "songs");
    const songsSnapshot = await getDocs(songsCollection);
    const songs = songsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(songs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch songs" });
  }
}
