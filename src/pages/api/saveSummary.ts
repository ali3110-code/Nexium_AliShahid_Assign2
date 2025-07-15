// src/pages/api/saveSummary.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { blogURL, summaryEn, summaryUr } = req.body;

  if (!blogURL || !summaryEn || !summaryUr) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const { error } = await supabase.from("summaries").insert([
    {
      url: blogURL,
      summary_en: summaryEn,
      summary_ur: summaryUr,
    },
  ]);

  if (error) {
    console.error("Supabase insert error:", error.message);
    return res.status(500).json({ error: "Failed to save summaries" });
  }

  res.status(200).json({ message: "Summaries saved to Supabase" });
}
