"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Footer from "@/components/ui/footer";
import { toast } from "sonner";
import { useState } from "react";

export default function Home() {
  const [blogURL, setBlogURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [summaryEn, setSummaryEn] = useState("");
  const [summaryUr, setSummaryUr] = useState("");
  const [translating, setTranslating] = useState(false);

  const handleCopy = async (text: string, lang: "en" | "ur") => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`Copied ${lang === "en" ? "English" : "Urdu"} summary!`);
    } catch (err) {
      toast.error("Copy failed.");
      console.error("Copy error:", err);
    }
  };

  async function translateToUrdu(text: string): Promise<string> {
    try {
      const res = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          text
        )}&langpair=en|ur`
      );
      const data = await res.json();
      return data.responseData.translatedText || "Translation failed";
    } catch (error) {
      console.error("Translation error:", error);
      toast.error("Translation failed.");
      return "Translation error";
    }
  }

  function generateSummary(text: string, maxSentences: number = 3): string {
    const stopWords = new Set([
      "the",
      "is",
      "in",
      "of",
      "and",
      "to",
      "a",
      "for",
      "on",
      "that",
      "this",
      "with",
      "as",
      "by",
      "an",
      "are",
      "was",
      "at",
      "be",
      "from",
      "it",
      "or",
    ]);

    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    const wordFreq: Record<string, number> = {};
    const allWords = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];

    for (const w of allWords) {
      if (!stopWords.has(w)) wordFreq[w] = (wordFreq[w] || 0) + 1;
    }

    const scored = sentences.map((s) => {
      const score = (s.toLowerCase().match(/\b[a-z]{3,}\b/g) || []).reduce(
        (acc, w) => acc + (stopWords.has(w) ? 0 : wordFreq[w] || 0),
        0
      );
      return { s: s.trim(), score };
    });

    let summary = "";
    for (const { s } of scored.sort((a, b) => b.score - a.score)) {
      if (summary.length + s.length + 1 > 490) break;
      summary += (summary ? " " : "") + s;
      if (summary.split(/(?<=[.!?])\s+/).length >= maxSentences) break;
    }
    return summary;
  }

  const handleScrape = async () => {
    setLoading(true);
    setSummaryEn("");
    setSummaryUr("");
    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: blogURL }),
      });

      const data = await res.json();
      const text: string = data.fullText || "No content found.";
      const summary = generateSummary(text, 3);
      setSummaryEn(summary);

      await fetch("/api/saveFullText", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blogURL, fullText: text }),
      });
    } catch (err) {
      console.error("Scrape error:", err);
      toast.error("Failed to summarize.");
    }
    setLoading(false);
  };

  const handleTranslate = async () => {
    setTranslating(true);
    const urdu = await translateToUrdu(summaryEn);
    setSummaryUr(urdu);
    setTranslating(false);

    try {
      await fetch("/api/saveSummary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blogURL, summaryEn, summaryUr: urdu }),
      });

      toast.success("Urdu translation saved!");
    } catch (err) {
      console.error("Save summary error:", err);
      toast.error("Failed to save translation.");
    }
  };

  return (
    <>
      <main className="min-h-screen w-full flex flex-col gap-6 items-center justify-center px-4 py-10 bg-gradient-to-br from-[#0f1b33] via-[#0a2540] to-[#001d34]">
        <h1 className="text-4xl sm:text-5xl leading-tight font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-[0_0_10px_rgba(0,255,255,0.35)] text-center">
          Blog Summarizer
        </h1>
        <p className="text-cyan-300 text-sm text-center">
          Summarize karo — English ya Urdu mein.
        </p>

        {/* Input Box */}
        <div className="w-full max-w-xl flex flex-col gap-4 items-end bg-white/5 backdrop-blur-lg border border-cyan-400/20 shadow-[0_8px_24px_rgba(0,255,255,0.08)] rounded-2xl p-6 sm:p-8">
          <Input
            type="text"
            value={blogURL}
            onChange={(e) => setBlogURL(e.target.value)}
            placeholder="Enter blog URL"
            className="w-full bg-transparent border border-cyan-400/40 rounded-md px-4 py-2 text-cyan-100 placeholder:text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/60"
          />
          <Button
            onClick={handleScrape}
            disabled={loading || !blogURL}
            className="relative overflow-hidden py-2 px-6 sm:px-8 rounded-md text-white font-semibold before:absolute before:inset-0 before:bg-gradient-to-r before:from-cyan-500 before:to-blue-600 before:blur-sm before:transition-transform before:duration-300 hover:before:scale-110 focus:ring-4 focus:ring-cyan-500/50 disabled:opacity-50"
          >
            <span className="relative z-10">
              {loading ? "Summarizing..." : "Summarize"}
            </span>
          </Button>
        </div>

        {/* Summaries */}
        <div className="w-full flex flex-col lg:flex-row gap-6 items-center justify-center">
          {summaryEn && (
            <div className="w-full max-w-xl bg-white/5 backdrop-blur-lg border border-blue-400/20 shadow-[0_4px_16px_rgba(0,128,255,0.15)] rounded-2xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-cyan-300 mb-4">
                English Summary
              </h2>
              <p className="text-cyan-100 leading-relaxed">{summaryEn}</p>
              <div className="flex justify-end gap-3 mt-4">
                <Button
                  onClick={() => handleCopy(summaryEn, "en")}
                  className="bg-blue-600 text-white px-4 py-1 rounded hover:brightness-110"
                >
                  Copy
                </Button>
                {!summaryUr && (
                  <Button
                    onClick={handleTranslate}
                    className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-4 py-1 rounded hover:brightness-110"
                  >
                    {translating ? "Translating..." : "Translate"}
                  </Button>
                )}
              </div>
            </div>
          )}

          {summaryUr && (
            <div className="w-full max-w-xl bg-white/5 backdrop-blur-lg border border-green-300 shadow-[0_4px_16px_rgba(0,255,128,0.15)] rounded-2xl p-6 sm:p-8 text-cyan-100 text-right">
              <h2 className="text-xl font-bold text-green-300 mb-4">
                اردو خلاصہ
              </h2>
              <p className="leading-relaxed">{summaryUr}</p>
              <div className="flex justify-end mt-4">
                <Button
                  onClick={() => handleCopy(summaryUr, "ur")}
                  className="bg-green-600 text-white px-4 py-1 rounded hover:brightness-110"
                >
                  Copy
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
