"use client";

import { useState } from "react";
import { Search, Sparkles, Command } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SkillCard } from "./SkillCard";
import type { SkillData } from "@/lib/skills";

interface SkillGridProps {
  initialSkills: SkillData[];
}

export function SkillGrid({ initialSkills }: SkillGridProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // Derived unique categories
  const categories = ["All", ...Array.from(new Set(initialSkills.map(s => s.category)))];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredSkills = initialSkills.filter((skill) => {
    // 1. Category filter
    if (selectedCategory !== "All" && skill.category !== selectedCategory) return false;

    // 2. Text Search filter
    if (!query.trim()) return true;
    
    const searchTerms = query.toLowerCase().split(' ');
    const skillText = `
      ${skill.title.toLowerCase()} 
      ${skill.description.toLowerCase()} 
      ${skill.category.toLowerCase()}
    `;

    const stopWords = ['a', 'an', 'the', 'for', 'to', 'in', 'on', 'with', 'I', 'need', 'me', 'give', 'show'];
    const meaningfulTerms = searchTerms.filter(term => !stopWords.includes(term) && term.length > 1);
    
    if (meaningfulTerms.length === 0) return true;

    return meaningfulTerms.every(term => skillText.includes(term));
  });

  const isDefaultView = query.trim() === "" && selectedCategory === "All";
  const displayedSkills = isDefaultView ? filteredSkills.slice(0, 12) : filteredSkills;

  return (
    <>
      {/* Search Bar */}
      <div className="relative w-full max-w-2xl mx-auto mt-6 z-20">
        <motion.div
          animate={{
            boxShadow: isFocused 
              ? "0 0 0 1px rgba(139, 92, 246, 0.5), 0 0 40px rgba(139, 92, 246, 0.25)" 
              : "0 0 0 1px rgba(255, 255, 255, 0.1), 0 0 0px rgba(139, 92, 246, 0)",
          }}
          className="flex items-center glass rounded-xl overflow-hidden px-4 py-3 transition-colors bg-black/40 backdrop-blur-xl"
        >
          <Sparkles className="w-5 h-5 text-brand-purple mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="E.g., I need a skill for frontend architecture..."
            className="w-full bg-transparent border-none outline-none text-white placeholder-white/40 text-sm sm:text-base"
          />
          <div className="flex items-center gap-1 ml-2 text-white/30 shrink-0 select-none bg-white/5 border border-white/10 px-2 py-1 rounded-md">
            <Command className="w-3 h-3" />
            <span className="text-xs font-semibold">K</span>
          </div>
        </motion.div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-5 z-20 max-w-4xl px-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
              selectedCategory === cat 
                ? "bg-brand-purple text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]" 
                : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/5"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="mt-8 w-full max-w-7xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-8 px-4">
          <h2 className="text-2xl font-semibold text-white">
            {!isDefaultView ? `Search Results (${filteredSkills.length})` : "Featured Skills"}
          </h2>
        </div>
        
        {displayedSkills.length > 0 ? (
          <motion.div layout="position" transition={{ duration: 0.3, ease: "easeInOut" }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 pb-20">
            <AnimatePresence mode="popLayout">
              {displayedSkills.map((skill) => (
                <SkillCard key={skill.slug} {...skill} slug={skill.slug} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-20 px-4">
            <p className="text-white/40 text-lg">No skills found matching your criteria. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </>
  );
}
