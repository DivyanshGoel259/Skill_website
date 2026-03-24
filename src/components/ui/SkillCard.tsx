"use client";

import { useState, useRef } from "react";
import { Copy, Terminal, Check } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface SkillCardProps {
  slug: string;
  title: string;
  description: string;
  category: string;
  installCommand?: string;
}

export function SkillCard({ slug, title, description, category, installCommand }: SkillCardProps) {
  const [isCopied, setIsCopied] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const copyCommand = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (installCommand) {
      navigator.clipboard.writeText(installCommand);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      whileHover={{ y: -4 }}
      className="relative flex flex-col justify-between h-full overflow-hidden rounded-2xl border border-white/10 bg-[#1A1A24]/60 p-6 backdrop-blur-sm group"
    >
      <Link href={`/skill/${slug}`} className="absolute inset-0 z-0" />
      
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 z-0"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(139, 92, 246, 0.15), transparent 40%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 rounded-2xl z-0"
        style={{
          opacity,
          boxShadow: `inset 0 0 0 1px rgba(139, 92, 246, 0.4)`,
        }}
      />

      <div className="z-10 pointer-events-none">
        <div className="flex items-start justify-between mb-4">
          <span className="inline-flex items-center rounded-md bg-white/5 px-2 py-1 text-xs font-medium text-white/70 ring-1 ring-inset ring-white/10">
            {category}
          </span>
          <Terminal className="h-5 w-5 text-white/30" />
        </div>
        
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm text-white/50 line-clamp-3 leading-relaxed">
          {description}
        </p>
      </div>

      {installCommand && (
        <div className="z-10 mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
          <code className="text-xs text-brand-purple bg-brand-purple/10 px-2 py-1 rounded truncate max-w-[80%] font-mono">
            {installCommand}
          </code>
          <button 
            onClick={copyCommand}
            className="p-1.5 rounded-md hover:bg-white/10 transition-colors text-white/60 hover:text-white relative z-20 cursor-pointer"
            title="Copy install command"
          >
            {isCopied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      )}
    </motion.div>
  );
}
