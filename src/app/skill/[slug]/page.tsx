import { getAllSkills } from "@/lib/skills";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Terminal, Download, FileText, FolderTree } from "lucide-react";
import { ClientMarkdown } from "@/components/ui/ClientMarkdown";

export async function generateStaticParams() {
  const skills = getAllSkills();
  return skills.map((skill) => ({
    slug: skill.slug,
  }));
}

export default async function SkillPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const skills = getAllSkills();
  const skill = skills.find((s) => s.slug === slug);

  if (!skill) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 mt-8">
      <Link href="/" className="inline-flex items-center text-brand-purple hover:text-brand-purple/80 transition-colors mb-8">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Directory
      </Link>

      <div className="glass rounded-3xl p-8 md:p-12 border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-brand-purple/20 blur-[100px] rounded-full pointer-events-none" />

        <div className="flex items-center gap-4 mb-6 relative z-10">
          <span className="inline-flex items-center rounded-md bg-white/5 px-3 py-1 text-sm font-medium text-white/70 ring-1 ring-inset ring-white/10">
            {skill.category}
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight relative z-10">{skill.title}</h1>
        <p className="text-xl text-white/60 mb-8 leading-relaxed border-b border-white/10 pb-8 relative z-10">
          {skill.description}
        </p>

        {skill.installCommand && (
          <div className="mb-8 bg-black/40 rounded-xl p-4 flex items-center justify-between border border-white/5 relative z-10">
            <div className="flex items-center overflow-hidden w-full">
              <Terminal className="w-5 h-5 text-brand-purple mr-4 shrink-0" />
              <code className="text-brand-purple font-mono text-sm sm:text-base truncate select-all">
                {skill.installCommand}
              </code>
            </div>
          </div>
        )}

        {skill.files && skill.files.length > 0 && (
          <div className="mb-12 bg-black/30 rounded-xl p-6 border border-white/5 relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
              <div className="flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-brand-purple" />
                <h3 className="text-lg font-semibold text-white">Skill Assets ({skill.files.length})</h3>
              </div>
              <a 
                href={`/api/download/${skill.slug}`} 
                download
                className="inline-flex items-center gap-2 px-4 py-2 bg-brand-purple hover:bg-brand-purple/80 text-white font-medium rounded-lg transition-colors text-sm border border-brand-purple/50"
              >
                <Download className="w-4 h-4 inline" />
                Download Skill Bundle
              </a>
            </div>
            
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 overflow-y-auto pr-2 max-h-48">
              {skill.files.map((file, idx) => (
                <li key={idx} className="flex items-center gap-2 text-white/60 text-xs p-2 rounded-md hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                  <FileText className="w-3.5 h-3.5 shrink-0 text-white/30" />
                  <span className="truncate" title={file}>{file}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {skill.content ? (
          <div className="prose prose-invert prose-purple max-w-none prose-pre:bg-black/40 prose-pre:border prose-pre:border-white/10 relative z-10">
            <ClientMarkdown content={skill.content} />
          </div>
        ) : (
          <div className="py-12 text-center text-white/30 italic relative z-10">
            No detailed documentation provided for this skill.
          </div>
        )}
      </div>
    </div>
  );
}
