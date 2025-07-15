# 📰 Blog Summarizer

A sleek, responsive web app that takes a blog URL, extracts the main content, generates a summary in English, and optionally translates it to Urdu. Built with Next.js, Supabase, and MongoDB.

## 🚀 Features

- 🧠 **Auto Summary**: Generates concise summaries from full blog content.
- 🌐 **Language Translation**: Translate summaries to Urdu via MyMemory API.
- 📋 **Copy to Clipboard**: Easily copy summaries with one click.
- 💾 **Data Persistence**:
  - Summaries are saved to **Supabase** (English & Urdu).
  - Full blog text is saved to **MongoDB**.

## 🛠️ Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS, ShadCN UI
- **Backend**:
  - API Routes (in `src/pages/api`)
  - Blog scraping and summary generation logic
- **Database**:
  - Supabase PostgreSQL (`summaries` table)
  - MongoDB Atlas (`blogs` collection)

## Live Demo : https://blog-summarizer-my.vercel.app/
