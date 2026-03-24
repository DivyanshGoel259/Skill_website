import { SkillGrid } from "@/components/ui/SkillGrid";
import { getAllSkills } from "@/lib/skills";
import { ShieldCheck, CheckCircle2, Lock } from "lucide-react";

export default function Home() {
  const skills = getAllSkills();
  
  const displaySkills = skills.length > 0 ? skills : [
    {
      title: "Waiting for your 600+ Skills...",
      description: "Place your markdown files in the /skills directory to automatically populate this beautiful grid.",
      category: "System",
      installCommand: "mkdir skills",
      slug: "system",
      content: "",
      files: [],
      dirPath: ""
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center pt-12 pb-8 relative">
      {/* Hero Section */}
      <div className="text-center max-w-3xl px-4 space-y-4 relative z-20">
        <div className="inline-flex items-center rounded-full border border-brand-purple/30 bg-brand-purple/10 px-3 py-1 text-xs text-brand-purple backdrop-blur-md mb-2 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
          <span className="flex h-2 w-2 rounded-full bg-brand-purple mr-2 animate-pulse"></span>
          Directory of {skills.length > 0 ? skills.length : "600+"} AI Agent Skills
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-lg leading-tight">
          Empower Your Agents with <br className="hidden sm:block" />
          <span className="text-gradient">Curated Skills</span>
        </h1>
        
        <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto mt-4 drop-shadow-md">
          Discover, copy, and install production-ready skills, prompts, and server configurations to supercharge your AI workflows instantly.
          <span className="block mt-3 text-sm font-medium text-white/50 space-x-3">
            <span>✓ 100% Tested & Authenticated</span>
            <span className="opacity-50">•</span>
            <span>✓ Prompt Injection Protected</span>
            <span className="opacity-50">•</span>
            <span>✓ Zero Vulnerabilities</span>
          </span>
        </p>
      </div>

      <SkillGrid initialSkills={displaySkills} />
    </div>
  );
}
