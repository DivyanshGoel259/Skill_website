"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search } from "lucide-react";
import {
  Copy, Check, Terminal, FolderTree, Download, Sparkles, Zap,
  Code2, Layers, Box, Rocket, ChevronRight, CheckCircle2,
  AlertTriangle, BookOpen, Settings, Wrench, HelpCircle,
  ChevronDown, Menu, X, ArrowRight, ExternalLink
} from "lucide-react";

// ─── Sidebar Section Data ───
const sidebarSections = [
  {
    group: "Getting Started",
    items: [
      { id: "introduction", label: "Introduction", icon: BookOpen },
      { id: "installation", label: "Install a Skill", icon: Download },
      { id: "quick-start", label: "Quick Start", icon: Zap },
    ],
  },
  {
    group: "Using Skills",
    items: [
      { id: "project-structure", label: "Your Project Structure", icon: FolderTree },
      { id: "skill-anatomy", label: "Skill Anatomy", icon: Code2 },
    ],
  },
  {
    group: "Advanced",
    items: [
      { id: "multiple-skills", label: "Managing Multiple Skills", icon: Layers },
      { id: "troubleshooting", label: "Troubleshooting", icon: Wrench },
      { id: "faq", label: "FAQ", icon: HelpCircle },
    ],
  },
];

// ─── Reusable Components ───
function CopyBlock({ code, lang = "bash" }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative group my-4">
      <div className="bg-black/60 rounded-xl border border-white/10 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-white/[0.02] border-b border-white/5">
          <span className="text-[10px] uppercase tracking-wider text-white/30 font-semibold">{lang}</span>
          <button onClick={handleCopy} className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs text-white/40 hover:text-white hover:bg-white/10 transition-all">
            {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
          <code className="text-brand-purple/90 font-mono">{code}</code>
        </pre>
      </div>
    </div>
  );
}

function InfoBox({ type = "info", children }: { type?: "info" | "warning" | "success" | "tip"; children: React.ReactNode }) {
  const styles = {
    info: { bg: "bg-brand-blue/5", border: "border-brand-blue/20", icon: <Sparkles className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" /> },
    warning: { bg: "bg-yellow-500/5", border: "border-yellow-500/20", icon: <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" /> },
    success: { bg: "bg-green-500/5", border: "border-green-500/20", icon: <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> },
    tip: { bg: "bg-brand-purple/5", border: "border-brand-purple/20", icon: <Zap className="w-4 h-4 text-brand-purple shrink-0 mt-0.5" /> },
  };
  const s = styles[type];
  return (
    <div className={`${s.bg} border ${s.border} rounded-xl p-4 my-4 flex items-start gap-3`}>
      {s.icon}
      <div className="text-sm text-white/70 leading-relaxed">{children}</div>
    </div>
  );
}

// ─── Section Content Components ───

function IntroductionSection() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Introduction</h1>
      <p className="text-white/50 text-sm mb-6">What are AI Agent Skills and how do they work?</p>

      <p className="text-white/70 leading-relaxed mb-4">
        <strong className="text-white">AI Agent Skills</strong> are pre-built, production-ready instruction sets that you can install directly into your project. 
        They teach AI coding agents (like Claude, Cursor, Windsurf, etc.) how to follow best practices, patterns, and conventions for specific technologies.
      </p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Why Use Skills?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
        {[
          { icon: <Zap className="w-5 h-5" />, title: "Instant Expertise", desc: "Your AI agent learns Next.js, React, TypeScript patterns in seconds" },
          { icon: <CheckCircle2 className="w-5 h-5" />, title: "Production-Ready", desc: "Every skill is tested and follows industry best practices" },
          { icon: <Code2 className="w-5 h-5" />, title: "One Command Install", desc: "Add any skill with a single npx command — no manual setup" },
          { icon: <Layers className="w-5 h-5" />, title: "Stackable", desc: "Install multiple skills that work together in the same project" },
        ].map((item) => (
          <div key={item.title} className="bg-black/30 rounded-xl p-4 border border-white/5">
            <div className="text-brand-purple mb-2">{item.icon}</div>
            <h3 className="text-white font-semibold text-sm">{item.title}</h3>
            <p className="text-white/50 text-xs mt-1">{item.desc}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">How It Works</h2>
      <p className="text-white/70 text-sm leading-relaxed mb-4">
        When you install a skill, a <code className="text-brand-purple bg-brand-purple/10 px-1.5 py-0.5 rounded text-xs">SKILL.md</code> file 
        is placed in your project. Your AI agent reads this file and uses it as context for generating better, more accurate code.
      </p>

      <div className="flex items-center gap-3 flex-wrap my-6">
        {["Browse skills on the directory", "Install with one command", "AI agent reads the skill", "Get better code output"].map((step, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="flex items-center justify-center h-6 w-6 rounded-full bg-brand-purple/20 text-brand-purple text-xs font-bold">{i + 1}</span>
            <span className="text-white/70 text-sm">{step}</span>
            {i < 3 && <ArrowRight className="w-4 h-4 text-white/20 hidden sm:block" />}
          </div>
        ))}
      </div>
    </div>
  );
}

function InstallationSection() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Install a Skill</h1>
      <p className="text-white/50 text-sm mb-6">Add any skill to your project with one command</p>

      <h2 className="text-xl font-semibold text-white mb-3">Using npx (Recommended)</h2>
      <p className="text-white/70 text-sm mb-3">
        No installation required. Just run this in your project directory:
      </p>
      <CopyBlock code={`npx @cutdnoise/add-skill <skill-name>`} />

      <h3 className="text-lg font-semibold text-white mt-6 mb-3">Examples</h3>
      <CopyBlock code={`# Install the Next.js skill
npx @cutdnoise/add-skill nextjs

# Install React frontend patterns
npx @cutdnoise/add-skill react-frontend

# Install Tailwind design system guide
npx @cutdnoise/add-skill tailwind-design-system

# Install TypeScript + Next.js best practices
npx @cutdnoise/add-skill typescript-nextjs-react`} />

      <InfoBox type="tip">
        <strong>Find skill names:</strong> Browse the <a href="/" className="text-brand-purple hover:underline">Skills Directory</a> and 
        click any skill card — the install command is shown on the detail page.
      </InfoBox>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Global Install (Optional)</h2>
      <p className="text-white/70 text-sm mb-3">
        If you use skills frequently, install the CLI globally:
      </p>
      <CopyBlock code={`# Install globally
npm install -g @cutdnoise/add-skill

# Now use without npx
add-skill nextjs
add-skill react-frontend`} />

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">What Happens After Install?</h2>
      <p className="text-white/70 text-sm mb-3">
        After running the command, the CLI:
      </p>
      <ol className="list-decimal list-inside text-white/60 text-sm space-y-2 ml-2">
        <li>Downloads the skill bundle (ZIP) from the directory server</li>
        <li>Detects your project structure automatically</li>
        <li>Extracts skill files into the correct folder</li>
        <li>You&apos;re done — start using it with your AI agent</li>
      </ol>
    </div>
  );
}

function QuickStartSection() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Quick Start</h1>
      <p className="text-white/50 text-sm mb-6">Get your first skill running in under 60 seconds</p>

      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
            <span className="flex items-center justify-center h-7 w-7 rounded-lg bg-brand-purple text-white text-sm font-bold">1</span>
            Open your project
          </h3>
          <p className="text-white/60 text-sm ml-9">
            Navigate to the root of any project where you use an AI coding agent (Claude, Cursor, Windsurf, etc.)
          </p>
          <div className="ml-9">
            <CopyBlock code="cd /path/to/your-project" />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
            <span className="flex items-center justify-center h-7 w-7 rounded-lg bg-brand-purple text-white text-sm font-bold">2</span>
            Install a skill
          </h3>
          <p className="text-white/60 text-sm ml-9">
            Pick any skill from the directory and run the install command:
          </p>
          <div className="ml-9">
            <CopyBlock code="npx @cutdnoise/add-skill nextjs" />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
            <span className="flex items-center justify-center h-7 w-7 rounded-lg bg-brand-purple text-white text-sm font-bold">3</span>
            Verify the skill is installed
          </h3>
          <p className="text-white/60 text-sm ml-9">
            You should see the skill files in your project:
          </p>
          <div className="ml-9">
            <CopyBlock lang="tree" code={`your-project/
└── skills/              ← created automatically
    └── nextjs/
        └── SKILL.md     ← the skill instruction file`} />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
            <span className="flex items-center justify-center h-7 w-7 rounded-lg bg-brand-purple text-white text-sm font-bold">4</span>
            Use it with your AI agent
          </h3>
          <p className="text-white/60 text-sm ml-9">
            Your AI agent will automatically read the skill file and use it as context. Just start coding! For example, in Claude:
          </p>
          <div className="ml-9">
            <CopyBlock lang="prompt" code={`"Build me a Next.js page with server components 
and proper data fetching following the skill guidelines"`} />
          </div>
        </div>
      </div>

      <InfoBox type="success">
        <strong>That&apos;s it!</strong> Your AI agent now has expert-level knowledge in the skill you installed. It will follow the patterns, conventions, and best practices defined in the SKILL.md file.
      </InfoBox>
    </div>
  );
}

function ProjectStructureSection() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Your Project Structure</h1>
      <p className="text-white/50 text-sm mb-6">Where skills live in your codebase</p>

      <h2 className="text-xl font-semibold text-white mb-3">Automatic Folder Detection</h2>
      <p className="text-white/70 text-sm mb-4">
        The CLI automatically detects your project structure and places skill files in the right location. There are two modes:
      </p>

      <h3 className="text-lg font-semibold text-white mt-6 mb-3">
        Mode 1: Projects with <code className="text-brand-purple bg-brand-purple/10 px-2 py-0.5 rounded">.claude/</code> folder
      </h3>
      <p className="text-white/60 text-sm mb-3">
        If your project already has a <code className="text-brand-purple bg-brand-purple/10 px-1.5 py-0.5 rounded text-xs">.claude/</code> directory (e.g., Claude Code projects), 
        skills are placed inside it:
      </p>
      <CopyBlock lang="tree" code={`your-project/
├── .claude/
│   └── skills/                    ← Skills go here
│       ├── nextjs/
│       │   └── SKILL.md
│       ├── react-frontend/
│       │   └── SKILL.md
│       └── tailwind-design-system/
│           └── SKILL.md
├── src/
├── package.json
└── ...`} />

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">
        Mode 2: Standard projects (no <code className="text-brand-purple bg-brand-purple/10 px-2 py-0.5 rounded">.claude/</code> folder)
      </h3>
      <p className="text-white/60 text-sm mb-3">
        For all other projects, a <code className="text-brand-purple bg-brand-purple/10 px-1.5 py-0.5 rounded text-xs">skills/</code> folder is created at the root:
      </p>
      <CopyBlock lang="tree" code={`your-project/
├── skills/                        ← Skills go here
│   ├── nextjs/
│   │   └── SKILL.md
│   ├── react-frontend/
│   │   └── SKILL.md
│   └── typescript-nextjs-react/
│       ├── SKILL.md
│       └── examples/
│           └── sample-usage.ts
├── src/
├── package.json
└── ...`} />

      <InfoBox type="info">
        <strong>No manual setup needed.</strong> You don&apos;t have to create any folders yourself.
        The CLI creates the <code className="text-brand-purple bg-brand-purple/10 px-1.5 py-0.5 rounded text-xs">skills/</code> directory automatically if it doesn&apos;t exist.
      </InfoBox>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">What&apos;s Inside a Skill Folder?</h2>
      <p className="text-white/70 text-sm mb-3">
        Each skill folder contains at minimum a <code className="text-brand-purple bg-brand-purple/10 px-1.5 py-0.5 rounded text-xs">SKILL.md</code>. 
        Some skills also include extra files:
      </p>
      <CopyBlock lang="tree" code={`skills/nextjs/
├── SKILL.md              # Main skill file (always present)
├── scripts/              # Optional helper scripts
│   └── setup.sh
├── templates/            # Optional code templates
│   └── page-template.tsx
└── examples/             # Optional usage examples
    └── data-fetching.md`} />

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Add to .gitignore (Optional)</h2>
      <p className="text-white/70 text-sm mb-3">
        If you don&apos;t want to commit skills to your repo, add this to your <code className="text-brand-purple bg-brand-purple/10 px-1.5 py-0.5 rounded text-xs">.gitignore</code>:
      </p>
      <CopyBlock lang="gitignore" code={`# AI Agent Skills (re-install anytime with npx)
skills/`} />

      <InfoBox type="tip">
        <strong>Tip:</strong> We recommend <strong className="text-white">committing</strong> your skills to version control so your entire team benefits from them.
        Skills are lightweight text files and won&apos;t bloat your repo.
      </InfoBox>
    </div>
  );
}

function SkillAnatomySection() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Skill Anatomy</h1>
      <p className="text-white/50 text-sm mb-6">Understanding what&apos;s inside a SKILL.md file</p>

      <p className="text-white/70 text-sm mb-4">
        Every skill is a markdown file with two parts: <strong className="text-white">YAML frontmatter</strong> (metadata) and <strong className="text-white">markdown content</strong> (instructions).
      </p>

      <h2 className="text-xl font-semibold text-white mb-3">Example SKILL.md</h2>
      <CopyBlock lang="markdown" code={`---
name: nextjs
description: Guide for implementing Next.js with App Router, 
  server components, and modern best practices.
license: MIT
version: 1.0.0
---

# Next.js Skill

Next.js is a React framework for building full-stack web 
applications with server-side rendering and static generation.

## When to Use This Skill

Use this skill when:
- Building new Next.js applications (v15+)
- Working with Server Components and Client Components
- Implementing data fetching patterns
- Optimizing images, fonts, and performance

## Core Patterns

### Server Components (Default)
Components in \`app/\` are Server Components by default...

### Client Components
Mark components with \`'use client'\` directive...

## Best Practices

1. Always use Server Components unless you need interactivity
2. Co-locate data fetching with the components that use it
3. Use Suspense boundaries for streaming
...`} />

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Frontmatter Fields</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left p-3 text-white font-semibold">Field</th>
              <th className="text-left p-3 text-white font-semibold">What It Does</th>
            </tr>
          </thead>
          <tbody className="text-white/60">
            <tr className="border-b border-white/5">
              <td className="p-3"><code className="text-brand-purple bg-brand-purple/10 px-1.5 py-0.5 rounded text-xs">name</code></td>
              <td className="p-3">The skill identifier used in the install command and URL</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="p-3"><code className="text-brand-purple bg-brand-purple/10 px-1.5 py-0.5 rounded text-xs">description</code></td>
              <td className="p-3">Short summary displayed on the skills directory card</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="p-3"><code className="text-brand-purple bg-brand-purple/10 px-1.5 py-0.5 rounded text-xs">version</code></td>
              <td className="p-3">Skill version for tracking updates</td>
            </tr>
            <tr>
              <td className="p-3"><code className="text-brand-purple bg-brand-purple/10 px-1.5 py-0.5 rounded text-xs">license</code></td>
              <td className="p-3">Open source license (MIT, Apache-2.0, etc.)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">What Makes a Good Skill?</h2>
      <div className="space-y-2">
        {[
          "Clear \"When to Use\" section so the AI knows when to apply this knowledge",
          "Concrete code examples — not just theory, but copy-paste patterns",
          "Best practices and anti-patterns the AI should follow / avoid",
          "Specific file conventions (naming, folder structure, exports)",
          "Error handling patterns and edge cases",
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-3 p-2">
            <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
            <p className="text-white/60 text-sm">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}



function MultipleSkillsSection() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Managing Multiple Skills</h1>
      <p className="text-white/50 text-sm mb-6">Install and organize multiple skills in one project</p>

      <h2 className="text-xl font-semibold text-white mb-3">Installing Multiple Skills</h2>
      <p className="text-white/70 text-sm mb-3">
        Run the install command multiple times — each skill gets its own folder:
      </p>
      <CopyBlock code={`npx @cutdnoise/add-skill nextjs
npx @cutdnoise/add-skill react-frontend
npx @cutdnoise/add-skill tailwind-design-system
npx @cutdnoise/add-skill typescript-nextjs-react`} />

      <h3 className="text-lg font-semibold text-white mt-6 mb-3">Resulting Structure</h3>
      <CopyBlock lang="tree" code={`your-project/
└── skills/
    ├── nextjs/
    │   └── SKILL.md
    ├── react-frontend/
    │   └── SKILL.md
    ├── tailwind-design-system/
    │   └── SKILL.md
    └── typescript-nextjs-react/
        └── SKILL.md`} />

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Recommended Skill Combinations</h2>
      <div className="space-y-3 mt-4">
        {[
          { stack: "Next.js Full Stack", skills: ["nextjs", "react-frontend", "tailwind-design-system"], desc: "Complete Next.js stack with styling" },
          { stack: "React Native App", skills: ["react-native-architecture", "react-native-design", "react-state-management"], desc: "Mobile app development" },
          { stack: "Backend API", skills: ["backend", "database", "api"], desc: "Server-side development" },
        ].map((combo) => (
          <div key={combo.stack} className="bg-black/30 rounded-xl p-4 border border-white/5">
            <h4 className="text-white font-semibold text-sm">{combo.stack}</h4>
            <p className="text-white/40 text-xs mt-1 mb-2">{combo.desc}</p>
            <div className="flex flex-wrap gap-1.5">
              {combo.skills.map((s) => (
                <span key={s} className="text-brand-purple bg-brand-purple/10 px-2 py-0.5 rounded-md text-xs font-mono">{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Updating a Skill</h2>
      <p className="text-white/70 text-sm mb-3">
        Re-run the install command to update to the latest version. Existing files will be overwritten:
      </p>
      <CopyBlock code={`# Re-install to get the latest version
npx @cutdnoise/add-skill nextjs`} />

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">Removing a Skill</h2>
      <p className="text-white/70 text-sm mb-3">
        Simply delete the skill folder:
      </p>
      <CopyBlock code={`# Remove a specific skill
rm -rf skills/nextjs

# On Windows
rmdir /s /q skills\\nextjs`} />
    </div>
  );
}



function TroubleshootingSection() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Troubleshooting</h1>
      <p className="text-white/50 text-sm mb-6">Common issues and how to fix them</p>

      <div className="space-y-6">
        {[
          {
            q: "\"Skill not found\" error",
            a: "Make sure you're using the exact skill name from the directory. Skill names are lowercase with hyphens (e.g., react-frontend, not React Frontend).",
            code: `# ❌ Wrong
npx @cutdnoise/add-skill "React Frontend"

# ✅ Correct
npx @cutdnoise/add-skill react-frontend`,
          },
          {
            q: "Permission denied on install",
            a: "You may need to run with elevated permissions, or check that your project directory is writable.",
            code: `# On macOS/Linux
sudo npx @cutdnoise/add-skill nextjs

# On Windows (run terminal as Administrator)
npx @cutdnoise/add-skill nextjs`,
          },
          {
            q: "Skills not being read by my AI agent",
            a: "Make sure the skill file is in the correct location. For Claude, it should be in .claude/skills/. For other agents, you may need to reference the file explicitly.",
            code: `# Check if skill exists
ls skills/nextjs/SKILL.md

# If using Claude, move to .claude/skills/
mkdir -p .claude/skills
mv skills/nextjs .claude/skills/nextjs`,
          },
          {
            q: "Network error during download",
            a: "Check your internet connection. The CLI downloads from our server (skills-anthropic.vercel.app).",
            code: `# Test connectivity
curl https://skills-anthropic.vercel.app/api/download/nextjs`,
          },
        ].map((item, i) => (
          <div key={i} className="bg-black/20 rounded-xl p-5 border border-white/5">
            <h3 className="text-white font-semibold text-base mb-2 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500 mt-1 shrink-0" />
              {item.q}
            </h3>
            <p className="text-white/60 text-sm mb-2 ml-6">{item.a}</p>
            <div className="ml-6">
              <CopyBlock code={item.code} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FAQSection() {
  const faqs = [
    { q: "Are skills free to use?", a: "Yes! All skills in the directory are free and open source. You can use them in any project, commercial or personal." },
    { q: "Do skills slow down my AI agent?", a: "No. Skills are just markdown text files. They add context but don't affect performance. Think of them as documentation your AI reads." },
    { q: "Can I create my own skills?", a: "Absolutely! Create a SKILL.md file following the format shown in the Skill Anatomy section. You can also contribute skills to the public directory." },
    { q: "How do I update a skill to the latest version?", a: "Re-run the install command. The CLI will overwrite the existing skill files with the latest version from the directory." },
    { q: "Can I edit a skill after installing it?", a: "Yes! Skills are just local files. Feel free to customize them for your project's specific needs." },
    { q: "Do I need to commit skills to my repo?", a: "It's recommended but optional. Committing allows your team to share the same AI context. Skills are lightweight text files." },
    { q: "Which AI agents are supported?", a: "Skills work with any AI coding agent that can read project files: Claude, Cursor, Windsurf, GitHub Copilot, and more." },
    { q: "What if I need a skill that doesn't exist?", a: "You can request a skill on our GitHub, or create your own SKILL.md following the standard format." },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-white tracking-tight mb-2">FAQ</h1>
      <p className="text-white/50 text-sm mb-6">Frequently asked questions</p>

      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <FAQItem key={i} question={faq.q} answer={faq.a} />
        ))}
      </div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-black/20 rounded-xl border border-white/5 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors"
      >
        <span className="text-white font-medium text-sm pr-4">{question}</span>
        <ChevronDown className={`w-4 h-4 text-white/40 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-4 pb-4 -mt-1">
          <p className="text-white/60 text-sm leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

// ─── Section Renderer ───
const sectionComponents: Record<string, () => React.ReactElement> = {
  "introduction": IntroductionSection,
  "installation": InstallationSection,
  "quick-start": QuickStartSection,
  "project-structure": ProjectStructureSection,
  "skill-anatomy": SkillAnatomySection,
  "multiple-skills": MultipleSkillsSection,
  "troubleshooting": TroubleshootingSection,
  "faq": FAQSection,
};

// ─── Search Data ───
const allSearchItems = sidebarSections.flatMap((section) =>
  section.items.map((item) => ({
    ...item,
    group: section.group,
  }))
);

// ─── Main Layout ───
export function DocsLayout() {
  const [activeSection, setActiveSection] = useState("introduction");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const ActiveComponent = sectionComponents[activeSection] || IntroductionSection;

  // Filter search results
  const searchResults = searchQuery.trim()
    ? allSearchItems.filter((item) =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.group.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allSearchItems;

  const navigateToSection = useCallback((id: string) => {
    setActiveSection(id);
    setSearchOpen(false);
    setSearchQuery("");
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Keyboard shortcut: Ctrl/Cmd + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Listen for navbar search trigger
  useEffect(() => {
    const handleOpenSearch = () => setSearchOpen(true);
    window.addEventListener("open-docs-search", handleOpenSearch);
    return () => window.removeEventListener("open-docs-search", handleOpenSearch);
  }, []);

  // Auto-focus search input when modal opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  return (
    <div className="max-w-[1400px] mx-auto mt-4">

      {/* ─── Search Modal ─── */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
          />

          {/* Modal */}
          <div className="relative w-full max-w-lg mx-4 bg-zinc-900/95 border border-white/10 rounded-2xl shadow-2xl shadow-brand-purple/10 overflow-hidden">
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
              <Search className="w-5 h-5 text-white/30 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documentation..."
                className="w-full bg-transparent border-none outline-none text-white placeholder-white/40 text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchResults.length > 0) {
                    navigateToSection(searchResults[0].id);
                  }
                }}
              />
              <kbd className="hidden sm:flex shrink-0 pointer-events-none h-5 select-none items-center gap-1 rounded bg-white/5 px-1.5 font-mono text-[10px] font-medium text-white/20">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-[50vh] overflow-y-auto p-2">
              {searchResults.length > 0 ? (
                searchResults.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => navigateToSection(item.id)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-white/5 transition-colors group"
                    >
                      <Icon className="w-4 h-4 text-white/30 group-hover:text-brand-purple shrink-0" />
                      <div>
                        <span className="text-sm text-white/80 group-hover:text-white font-medium">{item.label}</span>
                        <span className="block text-[11px] text-white/30">{item.group}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-white/10 group-hover:text-white/30 ml-auto shrink-0" />
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-8 text-white/30 text-sm">
                  No sections found for &ldquo;{searchQuery}&rdquo;
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden flex items-center gap-2 mb-4 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all text-sm"
      >
        {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        {sidebarOpen ? "Close Menu" : "Documentation Menu"}
      </button>

      <div className="flex gap-8">
        {/* ─── Sidebar ─── */}
        <aside className={`${sidebarOpen ? "block" : "hidden"} lg:block w-64 shrink-0`}>
          <div className="sticky top-24">
            <nav className="glass rounded-2xl border border-white/10 p-4 space-y-6">
              {sidebarSections.map((section) => (
                <div key={section.group}>
                  <h3 className="text-[11px] uppercase tracking-widest text-white/30 font-bold mb-2 px-2">
                    {section.group}
                  </h3>
                  <div className="space-y-0.5">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeSection === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveSection(item.id);
                            setSidebarOpen(false);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-left ${
                            isActive
                              ? "bg-brand-purple/15 text-brand-purple border border-brand-purple/20 shadow-[0_0_12px_rgba(139,92,246,0.15)]"
                              : "text-white/50 hover:text-white hover:bg-white/5 border border-transparent"
                          }`}
                        >
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-brand-purple" : "text-white/30"}`} />
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* ─── Content ─── */}
        <main className="flex-1 min-w-0">
          <div className="glass rounded-2xl border border-white/10 p-6 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-brand-purple/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="relative z-10">
              <ActiveComponent />
            </div>
          </div>

          {/* Bottom navigation */}
          <div className="flex items-center justify-between mt-4 px-2">
            {getPrevSection(activeSection) ? (
              <button
                onClick={() => {
                  setActiveSection(getPrevSection(activeSection)!);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                {getSectionLabel(getPrevSection(activeSection)!)}
              </button>
            ) : <div />}

            {getNextSection(activeSection) ? (
              <button
                onClick={() => {
                  setActiveSection(getNextSection(activeSection)!);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
              >
                {getSectionLabel(getNextSection(activeSection)!)}
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : <div />}
          </div>
        </main>
      </div>
    </div>
  );
}

// ─── Navigation Helpers ───
function getAllSectionIds(): string[] {
  return sidebarSections.flatMap((s) => s.items.map((i) => i.id));
}

function getPrevSection(current: string): string | null {
  const all = getAllSectionIds();
  const idx = all.indexOf(current);
  return idx > 0 ? all[idx - 1] : null;
}

function getNextSection(current: string): string | null {
  const all = getAllSectionIds();
  const idx = all.indexOf(current);
  return idx < all.length - 1 ? all[idx + 1] : null;
}

function getSectionLabel(id: string): string {
  for (const section of sidebarSections) {
    const item = section.items.find((i) => i.id === id);
    if (item) return item.label;
  }
  return id;
}
