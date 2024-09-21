import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const singersCollection = collection(db, "singers");
    const singersSnapshot = await getDocs(singersCollection);
    const singers = singersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(singers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch singers" });
  }
}
