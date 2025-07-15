import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import * as cheerio from "cheerio";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { url } = req.body as { url?: string };
  if (!url) return res.status(400).json({ error: "Missing blog URL" });

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const fullText = $("p")
      .map((_, el) => $(el).text())
      .get()
      .join("\n\n");

    res.status(200).json({ fullText: fullText.trim() });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown error occurred";
    console.error("Scrape error:", message);
    res.status(500).json({ error: "Failed to scrape blog content." });
  }
}
