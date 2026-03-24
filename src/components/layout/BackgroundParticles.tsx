"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function BackgroundParticles() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden bg-[#05050A]">
      {/* Base Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Interactive Glow */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full blur-[140px] opacity-30"
        animate={{
          x: mousePosition.x - 400,
          y: mousePosition.y - 400,
        }}
        transition={{ type: "tween", ease: "backOut", duration: 1.5 }}
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.2) 0%, rgba(59,130,246,0.05) 100%)",
        }}
      />
    </div>
  );
}
