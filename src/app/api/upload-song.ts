import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../lib/firebase"; // Ensure this path is correct
import { collection, addDoc } from "firebase/firestore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { title, origSinger, worshipLeader, key } = req.body;

      if (!title || !origSinger || !worshipLeader || !key) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const songsCollection = collection(db, "songs");
      await addDoc(songsCollection, { title, origSinger, worshipLeader, key });

      res.status(200).json({ message: "Song uploaded successfully" });
    } catch (error) {
      console.error("Error uploading song:", error);
      res.status(500).json({ error: "Failed to upload song" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
