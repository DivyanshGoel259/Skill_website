import Link from "next/link";
import { Sparkles, BookOpen } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/30 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <Sparkles className="h-5 w-5 text-brand-purple" />
          <span className="font-semibold tracking-tight text-white">AgentSkills</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-white/70">
          <Link href="/" className="hover:text-white transition-colors">Directory</Link>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
            <BookOpen className="h-4 w-4" />
            <span className="sr-only">Docs</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
