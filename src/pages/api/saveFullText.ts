import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { blogURL, fullText } = req.body;

  if (!blogURL || !fullText) {
    console.error("Missing blogURL or fullText", { blogURL, fullText });
    return res.status(400).json({ error: "Missing blogURL or fullText" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("nexium-mongo");
    const collection = db.collection("blogs");

    await collection.insertOne({ blogURL, fullText, createdAt: new Date() });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("MongoDB Error:", err);
    return res.status(500).json({ error: "Database error" });
  }
}
