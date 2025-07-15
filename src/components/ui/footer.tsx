export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-r from-[#0a2540] via-[#0f1b33] to-[#001d34] text-cyan-200 text-sm py-5 px-6 border-t border-cyan-700/40 backdrop-blur-sm shadow-[0_-1px_6px_rgba(0,255,255,0.05)]">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <p>
          © {new Date().getFullYear()}{" "}
          <span className="text-cyan-400 font-semibold">Ali Shahid</span>. All
          rights reserved.
        </p>
        <p className="text-cyan-300">
          Built with <span className="text-white font-medium">Next.js</span>,{" "}
          <span className="text-white font-medium">Tailwind CSS</span>,{" "}
          <span className="text-white font-medium">TypeScript</span>,{" "}
          <span className="text-white font-medium">MyMemory API</span>,{" "}
          <span className="text-white font-medium">MongoDB</span> &{" "}
          <span className="text-white font-medium">Supabase</span>
        </p>
      </div>
    </footer>
  );
}
