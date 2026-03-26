"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Search, PlusCircle, Menu, X } from "lucide-react";
import { useState, useEffect, SVGProps } from "react";

const GithubIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Directory", href: "/" },
    { name: "Documentation", href: "/docs" },
  ];

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 border-b ${
        isScrolled 
          ? "bg-black/80 backdrop-blur-xl border-white/10 py-3" 
          : "bg-transparent border-transparent py-5"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-10">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-brand-blue to-brand-purple rounded-xl blur-sm opacity-20 group-hover:opacity-60 transition duration-500"></div>
              <div className="relative flex items-center justify-center h-10 w-10 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-105 group-hover:border-white/20">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                <Sparkles className="h-5 w-5 text-brand-purple group-hover:text-brand-blue transition-colors duration-500 relative z-10" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/70 transition-all duration-300">
                AgentSkills
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-purple/60 group-hover:text-brand-blue/60 transition-colors duration-500">
                Directory
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                href={link.href} 
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                  pathname === link.href 
                    ? "text-white bg-white/10" 
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Action Section */}
        <div className="flex items-center gap-3">
          {/* Search Trigger — only on docs page */}
          {pathname.startsWith("/docs") && (
            <>
              <button 
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("open-docs-search"));
                }}
                className="hidden sm:flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 hover:bg-white/[0.06] transition-all group group/search cursor-pointer focus:outline-none focus:ring-1 focus:ring-brand-purple/50"
              >
                <Search className="h-4 w-4 text-white/30 group-hover/search:text-white/60 transition-colors" />
                <span className="text-sm text-white/30 group-hover/search:text-white/60 pr-8">Search...</span>
                <kbd className="hidden lg:flex pointer-events-none h-5 select-none items-center gap-1 rounded bg-white/5 px-1.5 font-mono text-[10px] font-medium text-white/20">
                  ⌘K
                </kbd>
              </button>

              <div className="h-6 w-px bg-white/5 hidden sm:block mx-1"></div>
            </>
          )}

          <a 
            href="https://github.com/DivyanshGoel259/Skill_website" 
            target="_blank" 
            rel="noreferrer" 
            className="p-2.5 text-white/40 hover:text-white hover:bg-white/5 rounded-xl transition-all relative group"
            title="Star on GitHub"
          >
            <GithubIcon className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-purple opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-purple"></span>
            </span>
          </a>

          <Link 
            href="/contribute" 
            className="hidden lg:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-blue to-brand-purple text-white text-sm font-bold shadow-lg shadow-brand-purple/20 hover:shadow-brand-purple/40 hover:scale-[1.02] active:scale-95 transition-all duration-300"
          >
            <PlusCircle className="h-4 w-4" />
            Contribute
          </Link>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="p-2.5 text-white/60 hover:text-white hover:bg-white/5 rounded-xl md:hidden transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-2xl border-b border-white/10 py-6 px-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                href={link.href} 
                className="text-lg font-medium text-white/70 hover:text-white px-4 py-2 rounded-lg hover:bg-white/5 transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="h-px bg-white/10 my-2"></div>
            <Link 
              href="/contribute" 
              className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-brand-purple text-white font-bold"
              onClick={() => setMobileMenuOpen(false)}
            >
              <PlusCircle className="h-5 w-5" />
              Contribute a Skill
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
