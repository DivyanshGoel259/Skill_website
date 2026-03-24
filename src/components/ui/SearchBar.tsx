"use client";

import { useState } from "react";
import { Search, Sparkles, Command } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative w-full max-w-2xl mx-auto mt-8">
      <motion.div
        animate={{
          boxShadow: isFocused 
            ? "0 0 0 1px rgba(139, 92, 246, 0.5), 0 0 20px rgba(139, 92, 246, 0.2)" 
            : "0 0 0 1px rgba(255, 255, 255, 0.1), 0 0 0px rgba(139, 92, 246, 0)",
        }}
        className="flex items-center glass rounded-2xl overflow-hidden px-4 py-3 transition-colors bg-white/5"
      >
        <Sparkles className="w-5 h-5 text-brand-purple mr-3 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="I need a skill for frontend architecture..."
          className="w-full bg-transparent border-none outline-none text-white placeholder-white/40 text-lg"
        />
        <div className="flex items-center gap-1 ml-2 text-white/30 shrink-0 select-none">
          <Command className="w-4 h-4" />
          <span className="text-sm font-medium">K</span>
        </div>
      </motion.div>
    </div>
  );
}
