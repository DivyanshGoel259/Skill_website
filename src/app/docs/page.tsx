import { Metadata } from "next";
import { DocsLayout } from "@/components/ui/DocsLayout";

export const metadata: Metadata = {
  title: "Documentation — AI Agent Skills Directory",
  description: "Learn how to install and use AI agent skills in your codebase. Set up your project, install skills with one command, and supercharge your AI workflows.",
};

export default function DocsPage() {
  return <DocsLayout />;
}
