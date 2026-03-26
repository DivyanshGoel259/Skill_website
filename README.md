# AI Agent Skills Directory 🚀

A premium directory of production-ready instruction sets (skills) for AI coding agents like Claude, Cursor, and Windsurf.

**Live Website:** [https://skills-anthropic.vercel.app/](https://skills-anthropic.vercel.app/)

---

## 🏗️ Project Overview

This repository contains the source code for the AI Agent Skills Directory. The goal is to provide a central hub where developers can find and install high-quality, pre-built skills to supercharge their AI development workflows.

### Key Features
- **Categorized Skills:** Browse skills for Frontend, Backend, Devops, Security, and more.
- **One-Command Installation:** Use our CLI to add skills directly to your project.
- **Premium UI:** Built with Next.js, Tailwind CSS, and Framer Motion for a stunning dark glassmorphism aesthetic.
- **Smart Integration:** Automatically detects `.claude/skills` for Claude Code or `skills/` for other agents.

---

## ⚡ Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/DivyanshGoel259/Skill_website.git
cd Skill_website
npm install
```

### 2. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the directory in action.

---

## 🛠️ Adding New Skills

Adding a skill is as simple as adding a folder and a markdown file.

1.  Navigate to the `skills/` directory.
2.  Choose or create a category folder (e.g., `engineering/frontend/`).
3.  Create a new skill folder with a `SKILL.md` file.
4.  Write your skill documentation following the [Docs format](https://skills-anthropic.vercel.app/docs).

The website will automatically discover and list your new skill on the next build.

---

## 📦 Using the CLI

Users can install skills from this directory using our one-line command:

```bash
npx @cutdnoise/add-skill <skill-name>
```

Replace `<skill-name>` with any skill found in the directory (e.g., `nextjs`, `tailwind-design-system`).

---

## ☁️ Deployment

This project is optimized for deployment on **Vercel**.

1.  Push your changes to GitHub.
2.  Connect your repository to Vercel.
3.  Build command: `npm run build`
4.  Output directory: `.next`

---

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ by [Divyansh Goel](https://github.com/DivyanshGoel259)
